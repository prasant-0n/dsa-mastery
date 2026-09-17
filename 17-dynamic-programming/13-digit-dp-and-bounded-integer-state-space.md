# 13 — Digit DP & Bounded Integer State Space

> **Phase 17 — Dynamic Programming**
>
> Digit DP is the pattern for counting, optimizing, or deciding properties of integers inside a bounded numeric range when the property depends on the digits. The key skill is turning an enormous range of integers into a small state space over digit positions, prefix bounds, leading-zero status, and problem-specific information such as digit sum or remainder.

---

## 1. Why Digit DP Exists

Suppose a problem asks:

> How many integers from `0` to `N` have digit sum `S`?

Brute force examines every integer:

```text
0, 1, 2, ..., N
```

If `N` has 18 or 19 decimal digits, that is impossible.

Digit DP changes the unit of computation.

Instead of asking about complete numbers, ask about prefixes:

```text
position → chosen prefix → remaining constraint
```

The number of positions is only `O(log N)`.

The enormous numeric domain is compressed into a finite state graph.

---

## 2. The Canonical Digit-DP State

A common state is:

```text
(pos, tight, started, extraState)
```

where:

- `pos` = current digit position;
- `tight` = whether the prefix is still equal to the bound's prefix;
- `started` = whether a non-leading-zero digit has appeared;
- `extraState` = information required by the target property.

For a digit-sum problem:

```text
(pos, tight, started, sum)
```

For a remainder constraint:

```text
(pos, tight, started, remainder)
```

For multiple constraints:

```text
(pos, tight, started, sum, remainder, ...)
```

The central design question is the same as ordinary DP:

> What information about the chosen prefix is sufficient to determine every legal continuation?

---

## 3. `tight` Is the Bound Constraint

Let the upper bound be represented as digits:

```text
D = [d0, d1, ..., d(m - 1)]
```

At position `pos`, if `tight === true`, the next digit cannot exceed:

```text
D[pos]
```

If the chosen digit is smaller, the remaining suffix is free:

```text
nextTight = false
```

If the chosen digit equals the bound digit:

```text
nextTight = true
```

Therefore:

```text
limit = tight ? D[pos] : 9
```

This tiny boolean represents an enormous set of prefix inequalities.

---

## 4. The Most Important Transition

For each legal digit:

```text
for digit = 0 ... limit
```

compute:

```text
nextTight = tight && digit === D[pos]
```

Then update the problem-specific state.

For digit sum:

```text
nextSum = sum + digit
```

For a decimal remainder modulo `M`:

```text
nextRemainder = (remainder * 10 + digit) % M
```

The transition is therefore ordinary DP over a specialized finite state machine.

---

## 5. Leading Zeros and `started`

Digit DP often pads shorter numbers with leading zeroes.

For example, when the bound has four digits:

```text
7 → 0007
42 → 0042
305 → 0305
```

Those padding digits are not necessarily real digits of the number.

The `started` state distinguishes:

```text
0007 → number 7
```

from a genuinely chosen zero after the number has started.

A transition may use:

```text
nextStarted = started || digit !== 0
```

This distinction becomes essential for properties such as:

- number of zero digits;
- first digit restrictions;
- exact digit occurrences;
- no-leading-zero semantics;
- digit-length constraints.

---

## 6. Do Not Confuse Leading Zeros with Real Zeros

Consider counting occurrences of digit `0`.

For bound `105`, the padded representation of `7` is:

```text
007
```

Those first two zeroes should usually not count as occurrences of the digit `0` in the integer `7`.

A correct transition can therefore define:

```text
nextCount = count

if (started || digit !== 0) {
    if (digit === 0) nextCount++
}
```

The exact semantics depend on the problem specification.

Never add `started` automatically without first defining what constitutes a digit of the represented number.

---

## 7. Base Case

When:

```text
pos === digits.length
```

all digits have been selected.

The base case evaluates the accumulated state.

Examples:

```text
sum === targetSum
remainder === 0
count <= K
hasRequiredPattern === true
```

For a counting problem:

```text
return valid ? 1 : 0
```

For an optimization problem, return the appropriate objective value or an unreachable sentinel.

---

## 8. Counting `0 ... N`

The standard Digit-DP interface is:

```text
countUpTo(N)
```

It counts every valid integer satisfying:

```text
0 <= x <= N
```

Then a range query becomes:

```text
countRange(L, R)
    = countUpTo(R) - countUpTo(L - 1)
```

This transformation is one of the most reusable patterns in Digit DP.

It separates:

```text
numeric range handling
```

from:

```text
property counting
```

---

## 9. Handling `L = 0`

The expression:

```text
countUpTo(L - 1)
```

requires special handling when:

```text
L = 0
```

because `-1` is outside the non-negative domain.

A robust API should define:

```text
countUpTo(N < 0) = 0
```

Then:

```text
countRange(L, R)
    = countUpTo(R) - countUpTo(L - 1)
```

works uniformly.

---

## 10. Digit Sum DP

For counting numbers whose digit sum equals `S`:

```text
state = (pos, tight, started, sum)
```

Transition:

```text
nextSum = sum + digit
```

Prune when:

```text
nextSum > S
```

A stronger bound can also estimate the maximum remaining sum:

```text
sum + 9 * remainingPositions < S
```

If true, the state cannot reach the target.

This is a useful example of DP combined with admissible state pruning.

---

## 11. Modulo / Remainder DP

To count numbers divisible by `M`, store the remainder of the current prefix.

If the current remainder is `r`, appending digit `d` gives:

```text
newR = (10 * r + d) % M
```

The state becomes:

```text
(pos, tight, started, remainder)
```

At the end:

```text
remainder === 0
```

is the acceptance condition.

This avoids constructing the full integer and is especially important when the bound exceeds JavaScript's safe integer range.

---

## 12. Multiple Constraints

Digit DP becomes powerful when several properties can be combined.

For example:

```text
count x <= N such that:
    digitSum(x) <= S
    x % M === 0
    x contains digit 7
```

A possible state is:

```text
(pos, tight, started, sum, remainder, seen7)
```

The product of dimensions determines the state-space size.

This gives a critical engineering rule:

> Every added state dimension multiplies the search space.

State design is therefore also complexity design.

---

## 13. Digit DP as Automaton DP

Many digit properties can be represented as a finite automaton.

Suppose a number must not contain the substring:

```text
13
```

Track the automaton state representing the relevant suffix information.

Then the Digit-DP state becomes:

```text
(pos, tight, started, automatonState)
```

The transition is:

```text
nextAutomatonState = transition(automatonState, digit)
```

This connects Digit DP with:

- finite automata;
- pattern matching;
- forbidden substrings;
- regular-language constraints;
- Aho–Corasick-style state machines.

---

## 14. Forbidden Digit Patterns

For a single forbidden substring, the state may only need the longest relevant suffix.

For multiple patterns, an automaton can encode all pattern prefixes.

Then Digit DP performs:

```text
bound-constrained walk
        ×
automaton state transitions
```

This is conceptually important:

> Digit DP is not fundamentally about arithmetic. It is DP over digit sequences under a prefix bound.

---

## 15. Exact Digit Counts

Suppose the task is:

> Count integers `<= N` containing exactly `K` occurrences of digit `5`.

State:

```text
(pos, tight, started, count5)
```

Transition:

```text
if started || digit !== 0
    nextCount5 = count5 + (digit === 5 ? 1 : 0)
```

Prune when:

```text
nextCount5 > K
```

At the end:

```text
count5 === K
```

The leading-zero rule is the subtle part, not the recurrence itself.

---

## 16. Digit DP for Optimization

Digit DP is not limited to counting.

You can optimize a property over all numbers `<= N`.

Examples:

- maximize digit sum;
- minimize digit changes;
- maximize the number of occurrences of a digit;
- find the smallest valid number;
- find the largest valid number;
- minimize a weighted digit cost.

The transition changes from:

```text
ways += childWays
```

to an aggregation such as:

```text
best = max(best, digitCost + childBest)
```

The state design remains the same.

---

## 17. Reconstruction

If the DP stores an optimal value, reconstruction can choose a digit at each position that preserves optimality.

For example:

```text
for digit in legalDigits:
    candidate = immediateCost(digit) + dp(nextState)
    if candidate === optimalStateValue:
        choose digit
        continue reconstruction
```

For smallest-number reconstruction, try digits in ascending order.

For largest-number reconstruction, try descending order.

This turns a value-only Digit DP into a constructive algorithm.

---

## 18. Memoization vs Tabulation

Digit DP is naturally expressed top-down because only reachable states need evaluation:

```text
solve(pos, tight, started, state)
```

Memoize states when:

```text
tight === false
```

and, depending on implementation, other repeated states.

Bottom-up tabulation is also possible, but the dimensions and tight-state transitions must be represented explicitly.

Top-down is often clearer when the state space is sparse.

---

## 19. Complexity Analysis

Suppose there are:

- `D` digit positions;
- `2` tight states;
- `2` started states;
- `S` possible digit sums;
- `M` possible remainders;
- `10` digit transitions.

Then a rough upper bound is:

```text
O(D × 2 × 2 × S × M × 10)
```

or:

```text
O(D × S × M)
```

up to constant factors.

Space is proportional to the number of stored states, plus recursion depth if using top-down recursion.

This is dramatically smaller than iterating through every number up to `N`.

---

## 20. State-Space Explosion

Digit DP can still become infeasible.

For example, combining many dimensions:

```text
sum × remainder × automatonState × count × flags
```

can produce millions or billions of states.

Before coding, estimate:

```text
product of state dimensions × digit branching
```

Then remove dimensions that are derivable or unnecessary.

Possible reductions include:

- cap counters at the target;
- use boolean flags instead of redundant counts;
- combine equivalent automaton states;
- exploit symmetry;
- use sparse `Map` storage;
- prune impossible sums;
- reduce modulo state when only divisibility matters.

---

## 21. JavaScript Numeric Safety

JavaScript `Number` cannot exactly represent every integer above:

```text
Number.MAX_SAFE_INTEGER
```

Therefore do not convert a 20-digit bound directly into an ordinary `Number` and assume exactness.

Prefer:

```text
String(N)
```

and process its digits directly.

For exact arithmetic involving the bound itself, use `BigInt` when appropriate.

For huge counts, use:

```text
BigInt
```

or modular arithmetic according to the problem specification.

---

## 22. Leading-Zero Policy Must Be Explicit

There are two common models.

### Model A — Include zero

The empty/never-started path represents the integer `0`.

### Model B — Positive integers only

Reject the all-leading-zero terminal state.

Neither model is universally correct.

Define the API contract before implementing:

```text
Does 0 count?
Do leading zeroes count as digits?
Is digit length significant?
```

Many Digit-DP bugs are specification bugs disguised as implementation bugs.

---

## 23. Digit Length Constraints

Suppose the task requires exactly `K` decimal digits.

There is no need to iterate through all shorter numbers.

Possible approaches:

- constrain `started` and require it to become true at the first position;
- process a fixed-length interval directly;
- use a separate count-by-length formulation.

For example, numbers from:

```text
10^(K-1) ... 10^K - 1
```

can be counted by bounded Digit DP with an explicit first-digit restriction.

---

## 24. Digit DP and Range Decomposition

A bound such as:

```text
N = 583214
```

creates a prefix tree.

At each position:

```text
0 ... d[pos]-1
```

branches immediately become unconstrained.

The single branch:

```text
d[pos]
```

remains tight.

Digit DP merges all equivalent unconstrained suffix states.

This is the geometric mental model:

```text
bounded prefix tree
        ↓
merge equivalent suffix subproblems
        ↓
DP state graph
```

---

## 25. Correctness Invariant

A useful invariant is:

> `dp(pos, tight, started, state)` represents exactly the set of digit suffixes that can legally complete the already-selected prefix represented by that state, and its value is the correct aggregate over those completions.

For every transition:

1. the chosen digit respects the current bound;
2. the next tight state correctly records whether equality with the bound remains;
3. the accumulated property state is updated exactly;
4. every legal continuation is represented exactly once.

The base case then evaluates the completed number against the target condition.

---

## 26. Brute Force as a Verification Oracle

Digit DP is ideal for differential testing.

For small bounds:

```text
N <= 10^5
```

compare:

```text
bruteForce(N)
```

against:

```text
digitDP(N)
```

Generate many random bounds and constraints.

This catches:

- tight-state mistakes;
- leading-zero errors;
- off-by-one range errors;
- incorrect remainder transitions;
- incorrect terminal handling.

---

## 27. Metamorphic Tests

Useful properties include:

```text
countRange(L, R) >= 0
```

and, for disjoint adjacent ranges:

```text
countRange(A, B) + countRange(B + 1, C)
    === countRange(A, C)
```

Also:

```text
countUpTo(N) <= countUpTo(N + 1)
```

for pure counting properties.

These tests validate structural behavior beyond individual examples.

---

## 28. Adversarial Cases

Always test:

```text
N = 0
N = 1
N = 9
N = 10
N = 99
N = 100
```

and values containing many zeroes:

```text
1000000000
```

Also test:

- impossible digit sums;
- target sum `0`;
- modulus `1`;
- large modulus relative to digit length;
- bounds near powers of ten;
- `L = 0`;
- `L = R`;
- very large string bounds;
- all-leading-zero paths.

---

## 29. Backend Engineering Applications

Digit DP can model bounded numeric domains in backend systems.

Examples include:

- generating constrained identifiers;
- validating numeric policy spaces;
- counting IDs satisfying compliance rules;
- analyzing ranges of account/reference numbers;
- enumerating bounded numeric configurations;
- capacity analysis over encoded numeric keys.

The important engineering lesson is not that production systems commonly use textbook Digit DP directly.

It is that a huge discrete domain can often be represented as a compact state machine and evaluated without enumerating every element.

---

## 30. AI / ML Engineering Applications

Digit DP is a useful conceptual pattern for constrained generation.

A digit sequence can be viewed as:

```text
state + allowed next symbols + terminal constraint
```

This resembles constrained decoding over a finite state space.

The same principles appear in:

- structured generation;
- finite-state constraints;
- rule-based decoding;
- constrained search;
- counting feasible configurations.

The connection is architectural: a state machine can restrict generation while DP aggregates or optimizes over all valid continuations.

---

## 31. Digit DP vs Ordinary DP

Ordinary DP often asks:

```text
What is the best/count of ways to reach state X?
```

Digit DP asks:

```text
What is the best/count of ways to build a digit string
that is also <= a particular bound?
```

The extra difficulty is the prefix-bound state:

```text
tight
```

Once that mental model is internalized, many seemingly different numeric-range problems become variations of the same framework.

---

## 32. Digit DP Interview Derivation Framework

When given a Digit-DP problem, proceed in this order:

### Step 1 — Define the bound

```text
N → digit array
```

### Step 2 — Decide the range API

```text
countUpTo(N)
```

then derive:

```text
countRange(L, R)
```

### Step 3 — Define prefix state

Ask:

```text
What does the chosen prefix need to remember?
```

### Step 4 — Add `tight`

Ask:

```text
Can the next digit exceed the bound digit?
```

### Step 5 — Add `started` if leading-zero semantics matter

### Step 6 — Derive digit transition

```text
nextState = transition(state, digit)
```

### Step 7 — Define terminal acceptance

### Step 8 — Estimate state-space size

### Step 9 — Add safe pruning

### Step 10 — Validate against brute force

This framework is more valuable than memorizing individual Digit-DP problems.

---

## 33. Common Failure Modes

### Failure 1 — Enumerating all numbers

The entire purpose of Digit DP is to avoid numeric enumeration.

### Failure 2 — Forgetting `tight`

Then numbers greater than `N` can be counted.

### Failure 3 — Counting padded zeroes

This corrupts digit-frequency constraints.

### Failure 4 — Using `Number` for huge bounds

Exactness can be lost before DP starts.

### Failure 5 — Storing too much state

The Cartesian product can explode.

### Failure 6 — Incorrect `L - 1`

Range counting gets off by one, especially around zero.

### Failure 7 — Memoizing an incomplete state

If a variable affects future legality or objective value, it belongs in the state.

### Failure 8 — Unsafe pruning

A pruning condition must prove that no valid completion has been removed.

---

## 34. Master Pattern

The reusable template is:

```text
solve(pos, tight, started, state):

    if pos === digits.length:
        return terminal(state, started)

    if memo has state:
        return memo[state]

    limit = tight ? digits[pos] : 9
    answer = identity

    for digit in 0 ... limit:
        nextTight = tight && digit === digits[pos]
        nextStarted = started || digit !== 0
        nextState = transition(state, digit, nextStarted)

        answer = aggregate(
            answer,
            solve(pos + 1, nextTight, nextStarted, nextState)
        )

    memo[state] = answer
    return answer
```

The only problem-specific pieces are:

```text
state
transition
terminal
aggregate
```

That is the essence of the pattern.

---

## 35. Revision Checklist

Before considering Digit DP mastered, explain without notes:

- [ ] Why brute force fails for huge bounds
- [ ] What `tight` means
- [ ] How `tight` changes after choosing a digit
- [ ] Why `started` is needed
- [ ] How to count `0 ... N`
- [ ] How to transform `[L, R]`
- [ ] How digit sum becomes state
- [ ] How modulo becomes state
- [ ] How exact digit counts become state
- [ ] How automata combine with Digit DP
- [ ] How to reconstruct an optimal number
- [ ] How to estimate state complexity
- [ ] How to avoid unsafe JavaScript integer conversion
- [ ] How to prove the recurrence
- [ ] How to differential-test against brute force
- [ ] How to identify unsafe pruning
- [ ] How Digit DP relates to finite-state constrained generation

---

## 36. Final Mental Model

Do not think:

```text
Digit DP = a special trick for counting numbers.
```

Think:

```text
A huge bounded set of digit sequences
        ↓
represented as prefix states
        ↓
with a bound flag (`tight`)
        ↓
plus the minimum information needed by the constraint
        ↓
then solved as a finite-state dynamic program.
```

The real mastery is **state compression over a bounded combinatorial space**.

Once that abstraction is clear, digit sums, divisibility, digit frequencies, forbidden patterns, automata, optimization, and constrained construction become variations of one powerful DP architecture.
