# 16.14 — Palindrome Partitioning & String Segmentation

## 1. Problem Definition

Given a string `s`, partition it into contiguous substrings so that every substring satisfies a validity predicate. In the classic palindrome-partitioning problem, every segment must be a palindrome.

Example:

```text
s = "aab"

Valid partitions:
["a", "a", "b"]
["aa", "b"]
```

The key restriction is **contiguity**. We cannot skip characters as we do in subsequence problems.

---

## 2. Core Mental Model

This is a **segmentation search** problem.

At index `start`, choose where the current segment ends:

```text
start = 0

[a] [ab] [aba] [abaa] ...
 ^
 current segment begins here
```

For every possible `end` from `start` through `n - 1`:

1. Consider `s[start..end]`.
2. Validate the candidate segment.
3. If valid, append it to the current partition.
4. Recurse from `end + 1`.
5. Undo the choice.

The search therefore explores **where to place boundaries between characters**.

For a string of length `n`, there are `n - 1` possible boundary positions, so the number of possible complete partitions is at most:

```text
2^(n - 1)
```

That is the fundamental reason this is naturally exponential when all partitions must be generated.

---

## 3. State Representation

A clean recursive state is:

```text
(start, path)
```

Where:

- `start` = first character not yet assigned to a segment.
- `path` = palindrome segments selected for the prefix `s[0..start-1]`.

Invariant:

> At every recursive call, `path` is a valid partition of the prefix before `start`, and no character at or after `start` has been consumed.

This invariant makes both correctness and backtracking easy to reason about.

---

## 4. Decision Tree

For `s = "aab"`:

```text
start 0
├── "a"
│   └── start 1
│       ├── "a"
│       │   └── start 2
│       │       └── "b" → ["a", "a", "b"]
│       └── "ab" ✗
└── "aa"
    └── start 2
        └── "b" → ["aa", "b"]
```

Invalid candidates are rejected immediately rather than being explored further.

---

## 5. Backtracking Template

```text
search(start):
    if start == n:
        record(path)
        return

    for end = start .. n-1:
        if segment(start, end) is invalid:
            continue

        path.push(segment)
        search(end + 1)
        path.pop()
```

This is the standard pattern for constrained contiguous segmentation.

---

## 6. Palindrome Predicate

A substring `s[left..right]` is a palindrome when:

```text
s[left] === s[right]
```

and the inner substring is also a palindrome.

A direct two-pointer check costs `O(length)` per candidate.

```js
function isPalindrome(s, left, right) {
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}
```

This is simple and useful as a correctness oracle, but repeated checks can make enumeration expensive.

---

## 7. Dynamic Programming Optimization

Precompute:

```text
pal[i][j] = true iff s[i..j] is a palindrome
```

Recurrence:

```text
pal[i][j] =
    s[i] === s[j]
    AND (j - i <= 2 OR pal[i + 1][j - 1])
```

The base cases are:

- Length 1: always palindrome.
- Length 2: palindrome when both characters match.

Precomputation:

```text
Time:  O(n²)
Space: O(n²)
```

Then each candidate palindrome test becomes `O(1)`.

This is often the preferred implementation when the search repeatedly asks the same substring-validity question.

---

## 8. Alternative Memoization

Instead of materializing the full `n × n` table, a palindrome predicate can be memoized by `(left, right)`.

This is useful when only a fraction of possible intervals is explored or when a full table is unnecessary.

However, for dense substring queries, the DP table is generally easier to reason about and benchmark.

---

## 9. Correctness Invariants

Maintain these invariants throughout DFS:

### Invariant 1 — Prefix Coverage

`path` covers exactly `s[0..start-1]`.

### Invariant 2 — Segment Validity

Every segment in `path` is a palindrome.

### Invariant 3 — No Gaps

The next segment always starts exactly at `start`.

### Invariant 4 — No Overlap

A recursive call begins at `end + 1`, so the chosen segment cannot overlap the next one.

### Invariant 5 — Restoration

After returning from a recursive call, the path is restored to its exact state before the candidate was selected.

### Terminal Correctness

When `start === n`, every character has been consumed and every selected segment is valid. Therefore `path` is a complete valid partition.

---

## 10. Complexity

There can be `2^(n-1)` complete partitions in the worst case, for example with a string containing repeated identical characters.

Therefore, generating all answers is inherently output-sensitive and exponential.

With palindrome DP:

```text
Preprocessing: O(n²) time, O(n²) space
Search:        exponential in the worst case
Output cost:   proportional to the total materialized answer size
```

Do not describe this problem as having a polynomial-time all-solutions algorithm: the output itself can be exponential.

If the task is only to find the **minimum number of cuts**, generating every partition is unnecessary; a dynamic-programming formulation is usually more appropriate.

---

## 11. Safe Pruning

The basic palindrome test is already a constraint filter, but application-specific pruning can go further.

### Maximum Segment Length

If segments may have at most `L` characters, never test `end > start + L - 1`.

### Minimum Segment Length

Skip candidates shorter than the required minimum.

### Exact Number of Parts

If exactly `k` segments are required, track:

```text
partsUsed
partsRemaining = k - partsUsed
charactersRemaining = n - nextStart
```

Prune when there are too few or too many characters to create the remaining number of segments.

### Target Cost

For weighted segmentation, prune a partial path when its current cost already violates a known upper bound.

Pruning is valid only when it cannot remove a potentially valid solution.

---

## 12. Important Distinction: Partition vs Subsequence

Partitioning:

```text
s = "abc"
["a", "bc"]
```

uses every character exactly once and preserves contiguity.

A subsequence such as `"ac"` skips `b` and therefore is not a partition segment.

This distinction is a common interview failure point.

---

## 13. Variants

### 13.1 Enumerate All Palindrome Partitions

Return every valid partition.

### 13.2 Count Palindrome Partitions

Return only the number of valid partitions. This can avoid materializing output, although the search may still be exponential without stronger DP structure.

### 13.3 Minimum Cuts

Find the minimum number of cuts needed so every resulting segment is a palindrome.

### 13.4 Exactly K Parts

Generate only partitions containing exactly `k` palindrome segments.

### 13.5 Maximum/Minimum Segment Length

Add length constraints to the segmentation predicate.

### 13.6 Weighted Segmentation

Associate a cost with each valid segment and optimize or enumerate under a budget.

### 13.7 Streaming Enumeration

Use a callback or generator so solutions are consumed one at a time instead of storing all results in memory.

### 13.8 General Constraint Segmentation

Replace `isPalindrome(segment)` with any deterministic predicate:

```text
isValidSegment(start, end)
```

This turns palindrome partitioning into a reusable backtracking pattern.

---

## 14. When Backtracking Is the Wrong Tool

Backtracking is appropriate when the caller needs to enumerate or explicitly explore many candidate partitions.

It is often unnecessary when the requirement is only:

- minimum cuts,
- number of ways,
- existence of a partition,
- best-cost partition.

For those tasks, dynamic programming or graph shortest-path formulations can exploit overlapping subproblems and avoid enumerating every complete partition.

A strong engineer first identifies the required output type before choosing the algorithm.

---

## 15. JavaScript Implementation Skeleton

```js
function partition(s) {
  const result = [];
  const path = [];

  function dfs(start) {
    if (start === s.length) {
      result.push([...path]);
      return;
    }

    for (let end = start; end < s.length; end++) {
      if (!isPalindrome(s, start, end)) continue;

      path.push(s.slice(start, end + 1));
      dfs(end + 1);
      path.pop();
    }
  }

  dfs(0);
  return result;
}
```

For production-scale repeated checks, replace the inline palindrome scan with a precomputed DP table.

---

## 16. Production-Oriented Design

A robust implementation should separate:

```text
Input validation
      ↓
Palindrome/segment predicate
      ↓
Search state
      ↓
DFS/backtracking engine
      ↓
Output policy
```

The output policy matters:

- `collect` → store every partition.
- `count` → increment a counter.
- `first` → stop after the first valid partition.
- `stream` → yield/callback each partition.

Separating these concerns prevents the search algorithm from being tightly coupled to one output format.

---

## 17. Testing Strategy

### Basic Cases

```text
""
"a"
"aa"
"ab"
"aab"
"aba"
"aaa"
```

### Adversarial Cases

- Long repeated-character strings.
- Long strings with very few palindromic intervals.
- Alternating characters.
- Inputs with many overlapping palindrome intervals.

### Property Checks

For every returned partition:

1. Concatenating all segments reconstructs the original string.
2. Every segment is a palindrome.
3. No segment is empty.
4. Segment order matches source order.

### Differential Testing

Compare the optimized DP-based search against a simple two-pointer implementation on many small random strings.

The simple implementation acts as an oracle because correctness is easier to inspect.

### Restoration Testing

Verify that after every recursive branch, `path` equals the state that existed before entering that branch.

---

## 18. Backend Engineering Applications

The palindrome condition itself is mostly a teaching constraint. The underlying **contiguous constrained segmentation** pattern is broadly useful.

Examples:

- Parsing structured identifiers into valid components.
- Splitting command/configuration strings under grammar-like rules.
- Generating valid token boundaries for rule-based normalization.
- Exploring workflow/configuration transitions where each contiguous block must satisfy a local predicate.
- Test-case generation for parsers and tokenizers.

The reusable abstraction is:

```text
Choose next boundary
→ validate segment
→ recurse on remaining suffix
→ undo
```

---

## 19. AI Engineering Applications

A useful hybrid architecture is:

```text
AI proposes candidate boundaries
            ↓
Deterministic validator
            ↓
Constraint-aware backtracking
            ↓
Verified segmentation
```

The model can propose likely segmentations, while deterministic code guarantees:

- complete character coverage,
- no overlap,
- segment validity,
- length constraints,
- budget constraints,
- exact part counts.

This follows a general AI engineering principle: **use probabilistic generation for candidates and deterministic algorithms for hard constraints.**

---

## 20. Interview Framework

When asked to solve this problem, explain it in this order:

1. **Define the output** — all partitions, count, existence, or optimization?
2. **Identify the state** — `start` and current `path`.
3. **Define the decision** — choose every possible `end`.
4. **Define the constraint** — candidate segment must be a palindrome.
5. **Define the base case** — `start === n`.
6. **Explain backtracking** — push, recurse, pop.
7. **Optimize repeated checks** — palindrome DP.
8. **Discuss complexity honestly** — output can be exponential.
9. **Add safe pruning** only when constraints justify it.
10. **Mention alternative DP** when the task is optimization rather than enumeration.

This demonstrates algorithmic reasoning rather than memorization.

---

## 21. Revision Checklist

Before moving on, you should be able to answer:

- Why is palindrome partitioning a backtracking problem?
- What exactly does `start` represent?
- Why does the loop iterate over `end`?
- Why recurse with `end + 1`?
- Why must `path.pop()` happen after recursion?
- What makes a substring a palindrome?
- Why can palindrome DP reduce repeated predicate checks to `O(1)`?
- Why is total enumeration still exponential?
- When is minimum-cut DP preferable?
- How would you enforce exactly `k` segments?
- How would you stream results without storing them all?
- Which pruning rules are actually safe?
- How would you validate every generated partition independently?

---

## 22. Master Pattern

Palindrome Partitioning is not fundamentally about palindromes.

The transferable pattern is:

```text
SOURCE STRING
     ↓
CURRENT INDEX
     ↓
CHOOSE NEXT CONTIGUOUS SEGMENT
     ↓
VALIDATE SEGMENT
     ↓
ACCEPT → RECURSE
REJECT → PRUNE
     ↓
RESTORE STATE
     ↓
TRY NEXT BOUNDARY
```

Once this pattern is internalized, many constrained segmentation problems become variations of the same search architecture.
