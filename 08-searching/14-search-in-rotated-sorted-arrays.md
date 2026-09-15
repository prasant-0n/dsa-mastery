# 08.14 — Search in Rotated Sorted Arrays

## 1. Concept Definition

A rotated sorted array is produced by taking a sorted array and moving a suffix to the front.

Example:

```text
sorted:  [1, 2, 3, 4, 5, 6, 7]
rotated: [4, 5, 6, 7, 1, 2, 3]
```

The resulting array is no longer globally sorted, but it retains strong structure: it consists of one or two monotone regions separated by a pivot.

## 2. Why It Matters

Rotated-array search teaches an important algorithmic skill:

> When the original global invariant is broken, identify the weaker invariant that survives.

This pattern appears in:

- cyclic data;
- rotated indexes;
- circular buffers;
- version windows;
- shifted sorted datasets.

## 3. Mental Model

For a normally rotated ascending array:

```text
[4, 5, 6, 7, 0, 1, 2]
       ↑     ↑
   sorted  sorted
    left    right
```

At any binary-search midpoint, at least one side of the current interval is normally sorted.

That fact enables logarithmic search in the distinct-value case.

## 4. Preconditions

The classic `O(log n)` algorithm assumes:

- ascending sorted source before rotation;
- a valid rotation;
- indexed access;
- distinct values for the simplest formulation.

Duplicates require additional handling because they can hide which side is sorted.

## 5. Distinct Values: Key Observation

For:

```text
left <= mid
```

if:

```text
A[left] <= A[mid]
```

then the left half is sorted.

Otherwise, the right half is sorted.

This lets us decide which half can be eliminated using the target value.

## 6. Core Algorithm

At each iteration:

```text
mid = midpoint

if A[mid] === target:
    found

if left half is sorted:
    determine whether target lies inside it
    otherwise discard it
else:
    determine whether target lies inside right half
    otherwise discard it
```

The algorithm is binary-search reasoning with a conditional ordering invariant.

## 7. Sorted-Half Invariant

The key invariant is:

> At every iteration, at least one half of the active interval is sorted.

The target must remain in the active interval if it exists.

## 8. Left Half Sorted

If:

```text
A[left] <= A[mid]
```

then the left side is sorted.

The target lies there when:

```text
A[left] <= target < A[mid]
```

Otherwise the target must be searched on the other side.

## 9. Right Half Sorted

If the left half is not sorted, the right half is the sorted region.

The target lies there when:

```text
A[mid] < target <= A[right]
```

Otherwise search the left side.

## 10. Why This Is Not Ordinary Binary Search

Ordinary binary search relies on:

```text
entire interval is sorted
```

Rotated-array search instead relies on:

```text
at least one half is sorted
```

That weaker invariant is enough to preserve logarithmic elimination under distinct values.

## 11. Complexity: Distinct Values

Each iteration normally discards one half:

```text
Time → O(log n)
Auxiliary space → O(1)
```

for the iterative exact-search algorithm.

## 12. Rotation Pivot

The pivot is the location where ordering wraps:

```text
... large, large, small, small ...
```

For:

```text
[4, 5, 6, 7, 0, 1, 2]
```

`7 → 0` is the wrap point.

Finding the pivot is a separate problem from searching for a target.

## 13. Pivot Search

A pivot can often be located in `O(log n)` for distinct rotated sorted data by comparing midpoint values against the boundary value.

After finding the pivot, the array can conceptually be treated as two sorted intervals.

However, searching directly with the sorted-half invariant avoids requiring a separate pivot-search pass.

## 14. Search by Pivot

An alternative strategy is:

```text
find pivot
→ determine sorted half containing target
→ ordinary binary search
```

This can cost:

```text
O(log n) + O(log n) = O(log n)
```

It may be useful when multiple searches are performed against a fixed rotation and the pivot is reusable.

## 15. Direct Search vs Pivot Search

Direct search keeps the logic in one pass.

Pivot-based search makes the structure explicit and can reuse the pivot.

The appropriate design depends on whether the pivot is already known or useful to subsequent operations.

## 16. Duplicates Change the Problem

Consider:

```text
[2, 2, 2, 3, 2, 2]
```

When:

```text
A[left] === A[mid] === A[right]
```

we may not be able to determine which side contains the rotation boundary from values alone.

The distinct-value elimination guarantee can disappear.

## 17. Duplicate Ambiguity

A common safe step is:

```text
left++
right--
```

when the boundary values provide no ordering information.

This preserves correctness but may reduce worst-case complexity to:

```text
O(n)
```

## 18. Complexity with Duplicates

With duplicates, worst-case search can degrade to linear time.

This is not merely an implementation issue; the available information may genuinely be insufficient to eliminate a large region.

Therefore state the data assumptions whenever claiming `O(log n)`.

## 19. Finding Minimum in Rotated Array

A related problem asks for the minimum value rather than an arbitrary target.

For distinct values, the midpoint can be compared with the right boundary to determine which side contains the pivot/minimum.

This is another example of binary search over a structural property rather than exact equality.

## 20. Finding Rotation Count

If the original array was sorted ascending and rotation moves a suffix to the front, the index of the minimum corresponds to the rotation count under the standard convention.

For example:

```text
[4, 5, 6, 1, 2, 3]
```

has its minimum at index `3`.

The exact rotation-count convention should be documented because left/right rotation definitions differ.

## 21. First/Last Occurrence with Duplicates

Searching for any target is different from finding the first or last occurrence.

With duplicates and rotation, the array may have multiple equal values across the conceptual boundary.

A correct boundary algorithm requires a carefully defined ordering representation, often by splitting at the pivot or using a specialized invariant.

## 22. Range Search

A rotated array does not represent one globally sorted contiguous range.

A value interval can therefore map to:

- one physical interval;
- two physical intervals crossing the rotation boundary.

This is why range-query design should begin by identifying the pivot structure.

## 23. Comparator-Based Rotated Search

The same reasoning can be generalized to objects if a comparator defines the sorted order.

The comparator must consistently represent the original pre-rotation ordering.

## 24. Descending Rotations

A descending sorted source can also be rotated.

The elimination predicates reverse.

The correct approach is to derive the invariant from the comparator rather than mechanically reversing a few operators.

## 25. Negative and Arbitrary Values

The algorithm depends on relative ordering, not on values being positive.

Examples such as:

```text
[-5, -2, 0, 4, 9]
```

work exactly like positive arrays when the ordering contract is preserved.

## 26. Empty and Singleton Arrays

Handle:

```text
[]
```

and:

```text
[x]
```

before relying on boundary comparisons.

The singleton case is both sorted and rotated without changing the practical search problem.

## 27. Fully Sorted Array

A rotation by zero positions produces a normally sorted array.

The rotated-search algorithm should still work because the left-half-sorted condition naturally handles this case.

## 28. Rotation by Full Length

A full-length rotation produces the original ordering.

If the API normalizes rotation count, `k % n` can represent this equivalence.

## 29. Correctness Proof

### Initialization
The entire array is the candidate region.

### Maintenance
At least one half is sorted. The target either lies within that sorted half's value range or must lie in the other half.

### Elimination
Discard only a region proven unable to contain the target.

### Progress
The active interval shrinks unless duplicate ambiguity requires conservative boundary movement.

### Termination
The interval becomes empty or the target is found.

### Postcondition
A returned index contains the target; otherwise no valid target position remains.

## 30. Duplicate Correctness

When:

```text
A[left] === A[mid] === A[right]
```

eliminating both boundaries is safe for membership search because those boundary values are equal to the midpoint and provide no additional ordering information.

However, occurrence semantics require additional care because removing a boundary can discard a desired first/last occurrence.

## 31. Common Mistakes

1. Assuming the entire rotated array is sorted.
2. Forgetting that at least one half is sorted rather than both.
3. Using the wrong inclusive/exclusive target range.
4. Mishandling equality at `mid`.
5. Claiming `O(log n)` with unrestricted duplicates.
6. Shrinking duplicate boundaries without considering occurrence semantics.
7. Confusing pivot index with rotation count.
8. Using ascending logic for descending data.
9. Forgetting zero/full rotation cases.
10. Mixing pivot-search and direct-search invariants.

## 32. Edge Cases

Test:

- empty array;
- one element;
- two elements;
- zero rotation;
- full rotation;
- rotation by one;
- rotation near the end;
- target at pivot;
- target at boundaries;
- absent target;
- negative values;
- duplicate-heavy arrays;
- all values equal.

## 33. Backend Applications

Rotated ordered structures can model:

- cyclic version windows;
- circular time ranges;
- rotated partitions;
- ring-buffer indexes;
- cyclic priority representations.

In production systems, explicit circular indexing may be clearer than physically rotating data.

## 34. AI Applications

Related reasoning can appear in:

- cyclic ranked candidate windows;
- shifted sorted score arrays;
- circular token/index structures;
- rotated partitions in specialized search pipelines.

The important transferable concept is exploiting partial order rather than the specific rotated-array code.

## 35. Testing Strategy

Generate a sorted base array, rotate it by every valid `k`, and test every target from:

- present values;
- absent values;
- values outside the range.

Then repeat with duplicates and compare against a linear reference.

## 36. Differential Testing

For exact membership:

```text
optimized rotated search
vs
linear scan
```

For pivot/minimum problems, use a reference scan that implements the exact documented result semantics.

## 37. Benchmarking

Benchmark separately for:

- distinct values;
- duplicate-heavy values;
- random rotations;
- already sorted arrays;
- tiny arrays;
- large arrays.

Record iteration counts as well as wall-clock time.

## 38. Implementation Lab

Implement:

1. exact search with distinct values;
2. duplicate-aware membership search;
3. minimum in rotated sorted array;
4. rotation-count detection;
5. pivot-based search;
6. direct one-pass search;
7. comparator-based rotated search;
8. reference implementations;
9. randomized differential tests;
10. benchmark suite.

## 39. Interview Questions

1. How do you search a rotated sorted array in `O(log n)`?
2. Why is at least one half always sorted?
3. How do you decide which half contains the target?
4. What changes when duplicates exist?
5. Why can duplicates produce `O(n)` worst-case behavior?
6. How do you find the minimum element?
7. How is the pivot related to rotation count?
8. When would you precompute the pivot?
9. How would you support custom object comparators?
10. Which invariant proves the direct-search algorithm correct?

## 40. Revision Checklist

- [ ] I can explain the surviving sorted-half invariant.
- [ ] I can derive direct rotated-array search.
- [ ] I can distinguish pivot search from direct search.
- [ ] I understand why distinct values give logarithmic elimination.
- [ ] I understand why duplicates can degrade complexity.
- [ ] I can find the minimum in a rotated array.
- [ ] I can reason about rotation count conventions.
- [ ] I can handle zero/full rotation.
- [ ] I can prove target preservation.
- [ ] I can test every rotation against a linear reference.

## 41. Key Takeaways

1. **Rotated sorted arrays lose global sortedness but preserve a crucial partial-order invariant.**
2. **With distinct values, at least one half of the active interval is sorted.**
3. **That invariant enables `O(log n)` exact search.**
4. **Duplicates can make the sorted-half identity ambiguous and degrade worst-case search to `O(n)`.**
5. **Pivot detection and direct rotated search are related but distinct strategies.**
6. **Minimum and rotation-count problems are structural binary-search problems, not ordinary equality searches.**
7. **Occurrence semantics become more complicated when duplicates cross the rotation boundary.**
8. **Correctness depends on preserving the candidate interval and eliminating only provably impossible regions.**
9. **The method generalizes to comparator-defined ordered objects.**
10. **The deeper lesson is to recover a useful invariant after a global ordering transformation.**
