# 08.13 — Lower Bound, Upper Bound & Boundary Search Patterns

## 1. Concept Definition

Boundary search finds the **transition point** in an ordered search space rather than merely asking whether an exact value exists.

For ascending values:

```text
lower bound = first index i where A[i] >= target
upper bound = first index i where A[i] > target
```

These two primitives form the foundation of many range, insertion, duplicate, threshold, and answer-search algorithms.

## 2. Why It Exists

Exact binary search answers:

> Does an equivalent element exist?

Boundary search answers richer questions:

- Where should this value be inserted?
- Where does the target range begin?
- Where does the target range end?
- How many values satisfy a threshold?
- What is the first feasible answer?

The key shift is from **finding a match** to **finding a monotone boundary**.

## 3. Mental Model

Imagine a Boolean predicate:

```text
false false false false true true true
```

Boundary search finds the first `true`.

For lower bound:

```text
A[i] >= target
```

For upper bound:

```text
A[i] > target
```

This Boolean transformation is the central mental model.

## 4. Lower Bound

Given ascending `A`, find the smallest index satisfying:

```text
A[i] >= target
```

If no element satisfies the condition, return:

```text
A.length
```

This makes lower bound directly usable as an insertion position.

## 5. Upper Bound

Find the smallest index satisfying:

```text
A[i] > target
```

Again, return `A.length` if no such position exists.

The interval:

```text
[lowerBound(target), upperBound(target))
```

contains every element equal to the target under ordinary numeric equality.

## 6. Exact Search via Bounds

Exact search can be expressed using lower bound:

```text
i = lowerBound(A, target)

if i < n && A[i] === target
    found
else
    absent
```

This gives a useful unification:

```text
exact search
→ boundary search + equality check
```

## 7. Duplicate Counting

For sorted data:

```text
count(target) = upperBound(target) - lowerBound(target)
```

This is one of the most important practical applications of boundary search.

## 8. Insertion Position

Lower bound gives the first position at which a target can be inserted while preserving ascending order.

Example:

```text
[10, 20, 40, 50]
target = 35
```

The lower bound is the position before `40`.

## 9. Range Queries

To retrieve all values in a closed value interval:

```text
[start, end]
```

find:

```text
left = lowerBound(start)
right = upperBound(end)
```

Then the relevant index interval is:

```text
[left, right)
```

## 10. Half-Open Intervals

Boundary algorithms are easiest to reason about with:

```text
[left, right)
```

where `right` is exclusive.

This convention makes empty intervals and insertion positions easier to express.

## 11. Core Lower-Bound Invariant

A strong invariant is:

```text
all indices < left are known to fail the predicate
all indices >= right are known to satisfy the predicate
answer lies in [left, right)
```

For lower bound, the predicate is:

```text
A[i] >= target
```

## 12. Core Upper-Bound Invariant

For upper bound:

```text
A[i] > target
```

The same boundary invariant applies.

The algorithm differs only in the predicate used for the comparison.

## 13. Canonical Lower-Bound Loop

A common form is:

```text
left = 0
right = n

while left < right:
    mid = left + floor((right - left) / 2)

    if A[mid] < target:
        left = mid + 1
    else:
        right = mid
```

When the loop terminates:

```text
left === right
```

and that index is the lower bound.

## 14. Canonical Upper-Bound Loop

Use:

```text
if A[mid] <= target:
    left = mid + 1
else:
    right = mid
```

The changed predicate is small but semantically important.

## 15. Why `right = n`

The answer can legitimately be:

```text
n
```

when every element is below the requested boundary.

Therefore the initial search interval should represent the insertion position after the final element.

This is a major reason half-open `[0, n)` reasoning is convenient.

## 16. Empty Input

For:

```text
A = []
```

both bounds return:

```text
0
```

This is naturally produced by the half-open formulation.

## 17. All Values Smaller

If:

```text
A = [1, 2, 3]
target = 10
```

then:

```text
lowerBound = 3
upperBound = 3
```

The insertion position is after the last element.

## 18. All Values Larger

If:

```text
A = [10, 20, 30]
target = 1
```

then both bounds return `0`.

The insertion position is at the beginning.

## 19. All Values Equal

For:

```text
[5, 5, 5, 5]
```

and target `5`:

```text
lowerBound = 0
upperBound = 4
```

Therefore the entire array is the equality range.

## 20. Exact Range of Duplicates

The duplicate block is:

```text
[left, right)
```

where:

```text
left = lowerBound(target)
right = upperBound(target)
```

This representation avoids scanning all duplicates to discover their boundaries.

## 21. Custom Comparators

Boundary search generalizes naturally to objects.

For a comparator `compare(value, target)`:

```text
lower bound → first compare(value, target) >= 0
upper bound → first compare(value, target) > 0
```

The sortedness contract must use a compatible comparator.

## 22. Descending Arrays

For descending data, the predicate directions change.

Do not simply reuse ascending comparisons.

Instead define the desired boundary in terms of the comparator and derive which side is known to satisfy/fail the predicate.

## 23. Boolean Boundary Search

Suppose:

```text
[false, false, false, true, true]
```

The answer is the first true index.

This is structurally identical to lower bound.

Therefore many seemingly unrelated problems can be reduced to:

```text
find first index where predicate(index) is true
```

## 24. Monotone Predicates

A predicate `P(i)` is suitable when it has a one-way transition:

```text
false...false true...true
```

Once `P(i)` becomes true, all later positions remain true.

Binary boundary search can then locate the transition in `O(log n)` predicate evaluations.

## 25. First Feasible Answer

Many optimization problems can be transformed into:

```text
Is answer x feasible?
```

If feasibility is monotone:

```text
false false false true true true
```

binary boundary search finds the first feasible answer.

This is often called **binary search on the answer**.

## 26. Last Feasible Answer

Similarly, if:

```text
true true true false false
```

is monotone, search for the last true position.

This can be converted to a first-false boundary.

## 27. Threshold Queries

Boundary search can answer:

```text
first value >= threshold
first value > threshold
last value <= threshold
last value < threshold
```

Most of these reduce to lower/upper bound with a suitable ordering convention.

## 28. Range Counting

Given a sorted array and query range `[L, R]`:

```text
count = upperBound(R) - lowerBound(L)
```

Time per query:

```text
O(log n)
```

after sorting.

For many queries, preprocessing the sorted representation can therefore be valuable.

## 29. Prefix/Suffix Thresholds

Boundary search can locate where values cross a threshold.

Examples:

- first timestamp after deadline;
- first price above limit;
- first score meeting requirement;
- first version at least a requested release.

## 30. Search in Rotated Arrays

Boundary concepts can help reason about rotated sorted data, but ordinary lower-bound assumptions no longer directly apply because global monotonicity is broken.

The first task is to identify the structural invariant available after rotation.

## 31. Bitonic Data

Similarly, a mountain array contains two monotone regions.

Boundary search can be applied after identifying the peak and selecting the appropriate ordered side.

This demonstrates a general strategy:

```text
partition complex structure
→ identify monotone region
→ apply boundary search
```

## 32. Time Complexity

Each iteration halves or nearly halves the active interval.

Therefore:

```text
Time = O(log n)
Auxiliary space = O(1)
```

for iterative boundary search.

## 33. Predicate-Cost Model

If evaluating the predicate costs `C`, then the real cost is better represented as:

```text
O(C log n)
```

This matters when feasibility checks involve substantial computation.

## 34. Answer-Space Complexity

When binary-searching an answer rather than an array index, complexity depends on the answer range:

```text
O(log U)
```

where `U` represents the size of the searched numeric/domain range.

The feasibility-check cost must then be multiplied into the model.

## 35. Correctness Proof

### Initialization
The interval contains every possible boundary position.

### Maintenance
The midpoint comparison identifies a region where the boundary cannot be, and that region is discarded.

### Progress
The interval strictly shrinks whenever the loop continues.

### Termination
Eventually `left === right`.

### Postcondition
`left` is the first index satisfying the boundary predicate.

## 36. Common Off-by-One Errors

Typical failures include:

- returning `mid` instead of the boundary;
- using `right = n - 1` when `n` is a valid insertion result;
- using `left < right` with incompatible updates;
- forgetting `mid + 1` when eliminating `mid`;
- confusing `>=` with `>`.

Boundary search is fundamentally an off-by-one discipline.

## 37. Common Mistakes

1. Treating lower bound as exact search.
2. Returning `-1` when insertion position `n` is meaningful.
3. Mixing inclusive and exclusive interval conventions.
4. Using the wrong equality predicate.
5. Applying boundary search to a non-monotone predicate.
6. Ignoring duplicates.
7. Forgetting custom comparator semantics.
8. Failing to prove termination.
9. Using an expensive predicate without including its cost.
10. Testing only successful exact matches.

## 38. Edge Cases

Test:

- empty array;
- singleton;
- target before all values;
- target after all values;
- target exactly present;
- target absent between values;
- all equal values;
- duplicate blocks;
- multiple boundaries;
- custom objects;
- descending data;
- answer-space predicates.

## 39. Implementation Lab

Implement:

1. lower bound;
2. upper bound;
3. exact search using lower bound;
4. duplicate count;
5. range query;
6. first true;
7. last true;
8. first false;
9. last false;
10. comparator-based bounds;
11. descending bounds;
12. binary search on a monotone feasibility predicate.

For every implementation, write the invariant before the loop.

## 40. Interview Questions

1. What is the difference between binary search and lower bound?
2. What does upper bound return?
3. Why is `right = n` useful?
4. How do you count duplicates in `O(log n)`?
5. How do you find an insertion position?
6. How does lower bound generalize to Boolean predicates?
7. What is binary search on the answer?
8. What makes a predicate suitable for boundary search?
9. How do custom comparators affect bounds?
10. What invariant proves a lower-bound implementation correct?

## 41. Revision Checklist

- [ ] I can define lower bound precisely.
- [ ] I can define upper bound precisely.
- [ ] I can derive both loops from the predicate.
- [ ] I understand half-open intervals.
- [ ] I can count duplicates using two bounds.
- [ ] I can derive insertion positions.
- [ ] I can reduce Boolean boundary problems to lower bound.
- [ ] I understand monotone feasibility predicates.
- [ ] I can apply bounds to objects with comparators.
- [ ] I can prove termination and correctness.
- [ ] I can derive complexity including predicate cost.

## 42. Key Takeaways

1. **Lower bound finds the first position satisfying `A[i] >= target`; upper bound finds the first satisfying `A[i] > target`.**
2. **Boundary search is fundamentally about locating a monotone transition, not merely finding equality.**
3. **Half-open intervals make insertion positions and empty cases natural.**
4. **Duplicate counting reduces to `upperBound - lowerBound`.**
5. **Exact search can be built on top of lower bound.**
6. **Many optimization problems become boundary searches when feasibility is monotone.**
7. **The invariant must describe what is known about both sides of the candidate boundary.**
8. **Most boundary-search bugs are interval or predicate-definition errors.**
9. **Comparator cost and feasibility-check cost belong in the real complexity model.**
10. **Mastering boundary search gives you a reusable primitive for arrays, ranges, thresholds, scheduling, databases, backend systems, and AI search spaces.**
