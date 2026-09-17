# 16.15 — Restore IP Addresses & Bounded String Segmentation

## 1. Problem Definition

Given a string containing only digits, insert exactly three separators to form a valid IPv4 address.

For example:

```text
s = "25525511135"

255.255.11.135
255.255.111.35
```

Each IPv4 segment must satisfy:

```text
1 <= segment length <= 3
0 <= numeric value <= 255
```

and leading zeroes are forbidden except for the single digit `"0"`.

This is a specialized instance of **bounded contiguous string segmentation**: at each position, choose a segment whose length and value satisfy local constraints, then recurse on the remaining suffix.

---

## 2. Why Backtracking Fits

The search decision is not whether to take or skip a character. Instead, we choose **where the next segment ends**.

At index `start`:

```text
start
  |
  +-- take 1 digit
  +-- take 2 digits
  +-- take 3 digits
```

Every accepted choice advances the cursor and consumes one IP component.

The generic pattern is:

```text
choose boundary
    ↓
validate segment
    ↓
accept → recurse
reject → prune
    ↓
restore path
```

This is the same segmentation pattern from palindrome partitioning, but the validity predicate is now numeric and bounded.

---

## 3. State Representation

A minimal state is:

```text
(start, parts, path)
```

Where:

- `start` = first unused character.
- `parts` = number of IPv4 components already selected.
- `path` = current component strings.

The strongest invariant is:

> `path` contains exactly `parts` valid components whose concatenation equals `s[0..start-1]`.

At every recursive call, no character before `start` remains unassigned and no character at or after `start` has been consumed.

---

## 4. Decision Tree

For:

```text
s = "25525511135"
```

The root considers:

```text
"2"
"25"
"255"
```

Suppose we choose `"255"`:

```text
[255]
   ↓
remaining = "25511135"
```

Then again:

```text
[255, 2]
[255, 25]
[255, 255]
```

Invalid branches are eliminated before recursion.

The search tree is shallow because an IPv4 address has exactly four components.

---

## 5. Segment Validity

A candidate segment is valid exactly when all of these conditions hold:

### Length

```text
1 <= length <= 3
```

### Numeric Range

```text
0 <= value <= 255
```

### Leading Zero Rule

```text
"0"     → valid
"00"    → invalid
"01"    → invalid
"001"   → invalid
"10"    → valid
"255"   → valid
```

A clean validator should check the string representation before converting it to a number.

```js
function isValidSegment(segment) {
  if (segment.length < 1 || segment.length > 3) return false;
  if (segment.length > 1 && segment[0] === '0') return false;
  return Number(segment) <= 255;
}
```

The lower bound is automatically satisfied because the segment contains only decimal digits.

---

## 6. Incremental Numeric Construction

Instead of creating three substrings and repeatedly parsing them, build the numeric value while extending the candidate:

```text
value = value * 10 + digit
```

For example:

```text
"2"   → 2
"25"  → 25
"255" → 255
```

As soon as `value > 255`, extending that candidate cannot make it valid again.

Therefore the branch can be pruned immediately.

This illustrates a general principle:

> If a constraint is monotonic under extension, check it during candidate construction rather than after the candidate is complete.

---

## 7. Leading-Zero Pruning

If the first digit of a candidate is `0`, only the one-character segment is allowed.

So:

```text
start points at '0'
    ↓
accept "0"
    ↓
stop extending this segment
```

There is no reason to examine `"01"` or `"012"`.

This is both a correctness rule and a search-space reduction.

---

## 8. Base Case

A solution is valid only when both conditions hold:

```text
parts === 4
start === s.length
```

Why both?

If only `start === s.length` is checked, strings can be split into too few components.

If only `parts === 4` is checked, unused characters may remain.

Therefore the terminal condition is:

```text
exactly four valid components
AND
all characters consumed
```

---

## 9. Remaining-Length Pruning

Suppose:

```text
partsUsed = p
partsRemaining = 4 - p
charactersRemaining = n - start
```

Each remaining component needs between 1 and 3 characters.

Therefore a necessary condition is:

```text
partsRemaining <= charactersRemaining
charactersRemaining <= 3 * partsRemaining
```

If either condition fails, the branch is impossible.

Example:

```text
partsRemaining = 2
charactersRemaining = 7
```

Two components can consume at most six characters, so the branch is immediately impossible.

This is a powerful example of **capacity pruning**.

---

## 10. Generic Bounded Segmentation

The important abstraction is larger than IP addresses.

Suppose a string must be divided into exactly `k` contiguous components, where each component satisfies:

```text
minLength <= length <= maxLength
isValid(segment) === true
```

At state `(start, partsUsed)`, calculate:

```text
remainingParts = k - partsUsed
remainingChars = n - start
```

Then prune if:

```text
remainingChars < remainingParts * minLength
```

or:

```text
remainingChars > remainingParts * maxLength
```

This generalizes the IP-address solution into a reusable constrained segmentation engine.

---

## 11. Backtracking Template

```text
search(start, partsUsed):

    if partsUsed == targetParts:
        if start == n:
            emit(path)
        return

    if remaining length cannot fill remaining parts:
        return

    value = 0

    for end from start to min(n - 1, start + maxLength - 1):

        extend candidate

        if leading-zero rule is violated:
            break

        if numeric constraint is violated:
            break

        if candidate is valid:
            path.push(candidate)
            search(end + 1, partsUsed + 1)
            path.pop()
```

The algorithm is small because the state model is precise.

---

## 12. Complexity

For IPv4 specifically, each of four positions chooses at most three candidate lengths.

A loose search-tree bound is:

```text
O(3^4)
```

candidate combinations, with validation and output costs added.

Because the number of components and maximum segment length are fixed constants, IPv4 restoration has effectively constant bounded search for practical input lengths.

For generalized segmentation with `k` parts and maximum segment length `L`, the naive branching bound is approximately:

```text
O(L^k)
```

before accounting for pruning and output materialization.

For variable `k` proportional to input length, the problem becomes exponential in the general case.

Space complexity is primarily:

```text
O(k)
```

for recursion/path state, excluding the returned output.

---

## 13. Output-Sensitive Thinking

If the caller requests **all** valid addresses, the algorithm must spend at least enough time to emit them.

Therefore distinguish:

```text
search cost
vs.
output materialization cost
```

For APIs, this matters because collecting every result into an array can create avoidable memory pressure.

Possible output policies include:

- return all results,
- return the first result,
- count results,
- stream results through a callback/generator,
- stop after `N` results.

---

## 14. Parsing Without `slice`/`parseInt`

A production-oriented implementation can construct candidate values incrementally:

```js
let value = 0;

for (let end = start; end < n && end < start + 3; end++) {
  value = value * 10 + (s.charCodeAt(end) - 48);
}
```

Benefits:

- avoids repeated substring allocation,
- avoids repeated numeric parsing,
- exposes the numeric constraint directly,
- makes early pruning straightforward.

However, clarity should not be sacrificed unnecessarily for micro-optimization. For ordinary interview-sized input, `slice` plus a carefully written validator is perfectly reasonable.

---

## 15. Correctness Invariants

### Invariant 1 — Prefix Coverage

`path` represents exactly the prefix already consumed.

### Invariant 2 — Component Validity

Every component in `path` satisfies all IP constraints.

### Invariant 3 — Exact Component Count

`partsUsed === path.length`.

### Invariant 4 — No Gaps

The next segment begins exactly at `start`.

### Invariant 5 — No Overlap

The recursive call begins at `end + 1`.

### Invariant 6 — Restoration

After returning from a child branch, `path` and all mutable state are restored exactly.

### Terminal Correctness

When `partsUsed === 4` and `start === n`, the four components form a valid IPv4 address because every component was validated before entering the path.

---

## 16. Safe vs Unsafe Pruning

Safe pruning rules include:

- candidate length exceeds maximum,
- candidate exceeds numeric maximum,
- leading-zero violation,
- too few characters for remaining parts,
- too many characters for remaining parts,
- already using four components while characters remain.

Unsafe pruning would be any rule that rejects a branch based on a property that could change later.

For example, do not prune merely because a partial address "looks unlikely" to produce a valid result. Backtracking pruning must be logically justified.

---

## 17. Variants

### 17.1 IPv4 Restoration

Exactly four decimal components, each `0..255`.

### 17.2 Fixed-K Numeric Segmentation

Split a digit string into exactly `k` bounded integer components.

### 17.3 Length-Constrained Segmentation

Every component must have a length within `[minLength, maxLength]`.

### 17.4 Custom Segment Predicate

Replace the IPv4 validator with a domain-specific predicate.

### 17.5 Minimum/Maximum Segment Cost

Assign each segment a cost and search under a budget or optimize total cost.

### 17.6 Streaming Segmentation

Emit each valid segmentation immediately.

### 17.7 Count Only

Avoid storing the actual segmentations when only the count matters.

---

## 18. When Dynamic Programming Helps

For classic IPv4 restoration, the state space is so small that memoization is usually unnecessary.

For generalized segmentation, however, many recursive branches can reach the same state:

```text
(start, partsUsed)
```

If the future result depends only on this state and immutable input/constraints, the problem may admit memoization or dynamic programming.

This gives a useful decision rule:

```text
Need all explicit paths?
    → backtracking / enumeration

Need count / existence / optimum?
    → consider DP / memoization
```

Do not add memoization merely because it is available. If the state space is already tiny, the extra complexity can provide no practical benefit.

---

## 19. Testing Strategy

### Basic Cases

```text
"25525511135"
"0000"
"010010"
"101023"
```

### Invalid Cases

- fewer than four digits,
- more than twelve digits,
- segment value above `255`,
- leading-zero segments,
- non-digit characters.

### Boundary Values

```text
0
1
9
10
99
100
249
250
255
256
999
```

### Property Tests

For every generated address:

1. It contains exactly three dots.
2. It has exactly four components.
3. Every component is valid.
4. Removing dots reconstructs the input.
5. No component has a forbidden leading zero.

### Differential Testing

Compare an optimized incremental parser against a simpler substring-based oracle on many small digit strings.

### Completeness Testing

For small inputs, enumerate all possible three-boundary placements and compare them against the backtracking implementation.

---

## 20. Backend Engineering Applications

The useful lesson is **bounded constrained segmentation**, not IP addresses themselves.

Backend applications include:

- parsing version-like numeric identifiers,
- validating structured numeric tokens,
- generating legal route/configuration variants,
- partitioning identifiers into bounded components,
- generating parser test cases,
- exploring fixed-step workflow representations,
- validating machine-generated structured strings.

A clean service architecture can expose:

```text
input validation
      ↓
segment predicate
      ↓
constraint engine
      ↓
backtracking enumerator
      ↓
output policy
```

This makes the search engine reusable across different validation rules.

---

## 21. AI Engineering Applications

This pattern is particularly useful when an AI system produces structured text that must satisfy hard constraints.

For example:

```text
AI-generated candidate
        ↓
deterministic parser
        ↓
bounded segmentation search
        ↓
validated structure
```

The AI should not be trusted to enforce exact structural constraints merely through prompting.

A deterministic validator can guarantee:

- exact component count,
- legal ranges,
- no leading zeros,
- complete input coverage,
- no ambiguous separators.

This is a general **generate → validate → repair/search** architecture.

---

## 22. Interview Framework

Explain the solution in this order:

1. We need exactly four contiguous components.
2. At each position, try segment lengths `1..3`.
3. Validate length, leading zeros, and numeric range.
4. Recurse from the next unconsumed index.
5. Stop successfully only after four components consume the entire string.
6. Prune impossible remaining-length states.
7. Backtrack with `push → recurse → pop`.
8. Mention that IPv4's fixed four-component structure keeps the search tiny.
9. Generalize the pattern to bounded string segmentation.
10. Discuss DP only when the generalized problem has overlapping subproblems and the required output is count/existence/optimization rather than explicit enumeration.

---

## 23. Revision Checklist

You should be able to answer:

- Why is this a segmentation problem?
- What does `start` represent?
- Why are there at most three candidate segment lengths?
- Why are leading-zero checks special?
- Why can `value > 255` terminate the current candidate loop?
- Why must the base case check both component count and input exhaustion?
- How does remaining-length pruning work?
- What is the invariant for `path`?
- Why is IPv4 restoration effectively a tiny bounded search?
- How would you generalize it to `k` segments?
- When would memoization become useful?
- How would you stream results instead of collecting them?
- How would you validate the output independently?

---

## 24. Master Pattern

```text
STRING
  ↓
CURRENT INDEX
  ↓
CHOOSE BOUNDED CONTIGUOUS SEGMENT
  ↓
CHECK LOCAL CONSTRAINTS
  ↓
INVALID → PRUNE
  ↓
VALID
  ↓
PUSH
  ↓
RECURSE
  ↓
POP / RESTORE
  ↓
TRY NEXT BOUNDARY
```

The transferable skill is recognizing when a problem can be modeled as:

> **Choose the next contiguous segment, validate it locally, recurse on the suffix, and restore the state.**

Once you see that structure, IP restoration, constrained tokenization, parser candidate generation, and many other string-search problems become variations of the same backtracking engine.
