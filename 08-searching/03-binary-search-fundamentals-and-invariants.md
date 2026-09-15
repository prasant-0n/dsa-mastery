# 08.03 — Binary Search Fundamentals & Invariants

## 1. Definition

Binary search is a divide-and-conquer search technique that repeatedly reduces an ordered search space by roughly half.

Its power does not come from the midpoint itself. It comes from a **safe elimination rule** supported by ordering or monotonicity.

```text
ordered search space
        ↓
      choose mid
        ↓
 evaluate predicate
    ↙           ↘
 discard       discard
 one region    other region
        ↓
 repeat
```

## 2. Preconditions

Before using ordinary binary search, verify the required structure.

Typical preconditions:

1. The search domain is ordered.
2. The comparison/predicate has a monotonic structure.
3. Eliminating a region cannot remove a valid answer.
4. The interval representation is precisely defined.

If these conditions do not hold, binary search is not justified merely because the input is an array.

## 3. Mental Model

Imagine a sorted array:

```text
[1, 4, 7, 10, 13, 16, 20, 25]
```

To find `16`, inspect the middle rather than starting at the beginning.

If the middle is too small, every element before it is also too small.

That entire region can be eliminated.

## 4. Core Invariant

A binary-search implementation must maintain a statement such as:

> If a valid answer exists, it is contained in the current search interval.

This invariant is more important than any particular code template.

## 5. Closed Interval

One common representation is:

```text
[L, R]
```

Both boundaries are candidates.

Typical initialization:

```text
L = 0
R = n - 1
```

Termination occurs when:

```text
L > R
```

for exact-match search.

## 6. Half-Open Interval

Another representation is:

```text
[L, R)
```

`L` is included and `R` is excluded.

Typical initialization:

```text
L = 0
R = n
```

This convention is particularly useful for lower/upper-bound searches.

## 7. Never Mix Conventions

Many binary-search bugs come from combining:

```text
closed initialization
```

with:

```text
half-open termination
```

or vice versa.

Choose one convention and derive every update from it.

## 8. Midpoint

For integer boundaries:

```text
mid = L + floor((R - L) / 2)
```

This makes the intended arithmetic explicit.

In JavaScript, numeric behavior differs from fixed-width integer languages, but this form remains a useful general algorithmic convention.

## 9. Exact-Match Search

For a sorted array and target `T`:

```text
A[mid] === T → return mid
A[mid] <  T → search right
A[mid] >  T → search left
```

The equality case terminates successfully.

## 10. Why Elimination Is Correct

Suppose:

```text
A[mid] < T
```

Because the array is sorted:

```text
A[0..mid] <= A[mid] < T
```

Therefore no position through `mid` can contain `T`.

The left region can be safely discarded.

The same reasoning applies symmetrically when:

```text
A[mid] > T
```

## 11. Termination

A correct implementation must strictly shrink the candidate interval.

For closed intervals:

```text
A[mid] < T → L = mid + 1
A[mid] > T → R = mid - 1
```

The `+1` and `-1` are essential because `mid` has already been classified.

## 12. Complexity Derivation

Each iteration reduces the search space approximately by half:

```text
n
n/2
n/4
n/8
...
1
```

After `k` iterations:

```text
n / 2^k ≈ 1
```

Therefore:

```text
2^k ≈ n
k ≈ log₂ n
```

So:

```text
Time → O(log n)
Auxiliary space → O(1)
```

for the iterative implementation.

## 13. Recursive Binary Search

A recursive formulation creates one smaller subproblem:

```text
T(n) = T(n/2) + O(1)
```

Therefore:

```text
Time → O(log n)
Call-stack space → O(log n)
```

The asymptotic time is unchanged, but the memory model differs from iteration.

## 14. Exact Search vs Boundary Search

Exact search asks:

```text
Does target T exist?
```

Boundary search asks:

```text
Where does a predicate become true?
```

Boundary search is more general and will become the foundation for lower bound, upper bound, and answer-space search.

## 15. Predicate Formulation

Instead of thinking only about values, define:

```text
P(i) = A[i] >= target
```

For sorted `A`, this can produce:

```text
false false false true true true
```

Binary search can locate the first `true` position.

## 16. Invariant for First True

For a half-open lower-bound search, a useful invariant is:

```text
all indices < L are false
all indices >= R are true
```

The answer, if it exists, remains in `[L, R)`.

This formulation makes the boundary update derivable rather than memorized.

## 17. Empty Input

For:

```text
[]
```

there are no candidates.

A correct implementation should terminate immediately according to its chosen interval convention.

## 18. Singleton Input

For:

```text
[7]
```

there is exactly one candidate.

Test both:

```text
T = 7
T ≠ 7
```

This catches many boundary errors.

## 19. Duplicate Values

Duplicates expose the difference between:

```text
any occurrence
```

and:

```text
first/last occurrence
```

An exact-match implementation may return any matching position unless its invariant specifically targets a boundary.

## 20. Search Bounds

Targets may be:

```text
less than minimum
between values
greater than maximum
```

A boundary search must still return the mathematically correct insertion/boundary position.

## 21. Off-by-One Errors

Typical errors include:

```text
R = mid
```

when `mid` has already been ruled out, or:

```text
L = mid
```

when `mid` remains unchanged and the loop cannot progress.

Every update must be justified by the invariant.

## 22. Infinite Loop Detection

Ask after every update:

> Can `L` and `R` remain unchanged?

If yes, the algorithm may not terminate.

A useful manual technique is to trace two-element and three-element arrays.

## 23. Two-Element Trace

For:

```text
[L, R] = [0, 1]
```

midpoint behavior should be explicitly traced.

This catches many errors that remain hidden in larger examples.

## 24. Three-Element Trace

For:

```text
[0, 1, 2]
```

trace each possible target relation:

```text
target < A[mid]
target = A[mid]
target > A[mid]
```

Then verify that every update reduces the interval.

## 25. Search API Contract

A binary-search function should document:

```text
sortedness requirement
ordering direction
comparison semantics
return value
not-found value
duplicate behavior
input mutation
```

A correct algorithm with an ambiguous contract is still difficult to use safely.

## 26. Descending Arrays

Binary search can work on descending data, but the comparison directions reverse.

The important property is not ascending order specifically.

It is a known total ordering that allows safe elimination.

## 27. Custom Comparators

For objects, define:

```text
compare(a, b)
```

and use it consistently.

Examples:

```text
timestamp
priority
score
version
lexicographic key
```

The comparator must be compatible with the ordering assumption.

## 28. Floating-Point Search

Binary search over discrete integer indices is straightforward.

Searching a continuous numeric interval is different:

```text
while interval width > tolerance:
    mid = (low + high) / 2
    evaluate predicate
```

Termination is based on precision/tolerance rather than an integer interval becoming empty.

## 29. Numerical Caution

For floating-point search, define:

- tolerance;
- maximum iterations;
- comparison behavior;
- rounding assumptions.

Do not use exact equality for approximate numerical results unless the domain guarantees it.

## 30. Binary Search on Answer

The array itself does not need to be sorted.

The answer domain must provide a monotonic feasibility predicate.

Example:

```text
capacity C
```

```text
C = 10 → impossible
C = 20 → impossible
C = 30 → possible
C = 40 → possible
```

Search for the transition.

## 31. Decision vs Optimization

Instead of directly solving:

```text
minimum capacity
```

ask:

```text
Can capacity C satisfy the requirement?
```

If feasibility is monotonic, binary search can find the smallest feasible `C`.

## 32. Cost Model for Search on Answer

If each feasibility check costs `F(n)` and the answer range has size `R`:

```text
O(F(n) log R)
```

The feasibility function is often the true engineering bottleneck.

## 33. Search and Duplicates

For sorted values:

```text
[2, 2, 2, 5, 5, 8]
```

A standard exact search does not guarantee which `2` is returned.

To find the first `2`, continue searching left after a match.

To find the last `2`, continue searching right.

## 34. Lower Bound

Lower bound is:

```text
first index i where A[i] >= T
```

If no such index exists:

```text
i = n
```

This is a boundary result, not necessarily a successful exact match.

## 35. Upper Bound

Upper bound is:

```text
first index i where A[i] > T
```

It enables occurrence counting:

```text
count(T) = upperBound(T) - lowerBound(T)
```

## 36. Correctness Proof Structure

For any binary search, write:

### Initialization
Show the invariant is true before the loop.

### Maintenance
Show every branch preserves the invariant.

### Progress
Show the search interval strictly shrinks.

### Termination
Show termination occurs after finite iterations.

### Postcondition
Show the final interval/state produces the required answer.

## 37. Common Mistakes

1. Binary-searching unsorted data.
2. Assuming exact search and boundary search are identical.
3. Mixing interval conventions.
4. Incorrect midpoint arithmetic.
5. Failing to remove `mid` when it is ruled out.
6. Returning immediately when a boundary is required.
7. Ignoring duplicates.
8. Forgetting empty input.
9. Using a non-monotonic predicate for search-on-answer.
10. Failing to prove termination.

## 38. Backend Applications

Binary-search reasoning appears in:

- sorted event arrays;
- timestamp boundaries;
- threshold lookup;
- capacity tuning;
- rate selection;
- version ranges;
- pagination over ordered in-memory data.

Large persistent datasets generally use database/index structures rather than loading the full dataset into application memory.

## 39. AI Applications

Binary-search reasoning appears in:

- threshold calibration;
- score cutoffs;
- parameter feasibility;
- sorted retrieval scores;
- nearest-value lookup;
- hyperparameter ranges with monotonic feasibility.

It can also appear inside more sophisticated search systems as a boundary-finding primitive.

## 40. Implementation Lab

Implement from scratch:

1. iterative exact binary search;
2. recursive exact binary search;
3. first occurrence;
4. last occurrence;
5. lower bound;
6. upper bound;
7. descending-order search;
8. custom-comparator search;
9. search on a monotonic predicate;
10. search on answer.

For every implementation write the invariant first.

## 41. Verification Lab

Test:

```text
empty
single element
2 elements
3 elements
target below range
target above range
target at boundaries
duplicates
all duplicates
absent target
```

Trace the interval after every iteration for at least one example.

## 42. Benchmarking Lab

Compare:

```text
linear search
binary search
hash lookup
```

under workloads with:

- small N;
- large N;
- one query;
- many queries;
- expensive comparisons;
- repeated keys.

Separate algorithmic complexity from preprocessing cost.

## 43. Interview Questions

1. Why does binary search require ordering?
2. What invariant does your implementation maintain?
3. Why is the complexity `O(log n)`?
4. Why must `mid` sometimes be excluded from the next interval?
5. How do closed and half-open intervals differ?
6. How do you find the first occurrence?
7. What is lower bound?
8. What is upper bound?
9. How do you prove termination?
10. When can binary search work on an unsorted array?
11. What is binary search on answer?
12. What happens with duplicates?

## 44. Revision Checklist

- [ ] I can define the binary-search preconditions.
- [ ] I can state the search invariant before coding.
- [ ] I can use a closed interval consistently.
- [ ] I can use a half-open interval consistently.
- [ ] I can derive midpoint and boundary updates.
- [ ] I can prove the elimination rule.
- [ ] I can prove termination.
- [ ] I can explain `O(log n)` mathematically.
- [ ] I can implement first/last occurrence.
- [ ] I understand lower/upper bounds.
- [ ] I can search a monotonic answer space.
- [ ] I can account for feasibility-check cost.
- [ ] I can test adversarial boundary cases.

## 45. Key Takeaways

1. **Binary search is an invariant-driven elimination algorithm.**
2. **Ordering or monotonicity is what makes elimination safe.**
3. **Interval conventions must be consistent from initialization through termination.**
4. **Every boundary update must follow from the invariant.**
5. **The `O(log n)` bound comes from repeatedly halving the search space.**
6. **Boundary search is more general than exact-match search.**
7. **Search on answer applies the same reasoning to a monotonic feasibility domain.**
8. **Duplicates require explicitly defined semantics.**
9. **Correctness requires initialization, maintenance, progress, termination, and postcondition reasoning.**
10. **Expert binary search means deriving the algorithm from the invariant rather than memorizing a template.**
