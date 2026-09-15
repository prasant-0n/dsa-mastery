# 08.06 — Rotated Sorted Arrays & Modified Binary Search

## 1. Definition

A rotated sorted array is produced by moving a prefix of an originally sorted array to the end.

Example:

```text
sorted:  [1, 2, 3, 4, 5, 6, 7]
rotated: [4, 5, 6, 7, 1, 2, 3]
```

The global array is no longer fully sorted, but it retains enough local ordering to support modified binary-search reasoning.

## 2. Why It Matters

Rotated-array problems are important because they teach a broader lesson:

> Binary search does not require blindly comparing the target with the midpoint. It requires finding enough structure to eliminate a region safely.

The central task is to identify which portion of the current interval remains ordered.

## 3. Mental Model

In a rotated ascending array without duplicates, there is one conceptual pivot where the ordering wraps:

```text
[4, 5, 6, 7 | 1, 2, 3]
          pivot
```

At any midpoint, at least one side of the current interval is sorted.

That local ordering becomes the elimination tool.

## 4. Core Observation

For a rotated sorted array with distinct values, at midpoint `M`:

```text
A[L] <= A[M]
```

means the left half is sorted.

Otherwise:

```text
A[M] <= A[R]
```

means the right half is sorted.

This allows us to determine which half can be reasoned about using ordinary ordering.

## 5. Modified Exact Search

For target `T`:

1. Compute `M`.
2. Determine which half is sorted.
3. Determine whether `T` lies within that sorted half's value range.
4. Keep that half if it can contain `T`.
5. Otherwise discard it.

The key is not “pick the sorted half.”

The key is:

> Determine which half can safely contain the target.

## 6. Example

```text
A = [6, 7, 8, 1, 2, 3, 4]
T = 2
```

If midpoint is `1`, the right region is sorted:

```text
[1, 2, 3, 4]
```

Since `2` lies within that ordered range, the left region can be eliminated.

## 7. Complexity

For distinct values:

```text
Time → O(log n)
Auxiliary space → O(1)
```

The search interval still shrinks geometrically.

## 8. Pivot Search

Another approach is to first locate the rotation pivot, then perform ordinary binary search on the appropriate sorted segment.

This creates two phases:

```text
find pivot → O(log n)
search segment → O(log n)
```

Overall:

```text
O(log n)
```

for the distinct-value case.

## 9. Minimum in Rotated Sorted Array

The minimum element is at the rotation pivot for a non-empty rotated ascending array with distinct values.

Compare midpoint with the right boundary:

```text
A[mid] > A[right]
```

suggests the minimum lies to the right of `mid`.

Otherwise, the minimum is at `mid` or to its left.

The exact invariant must be stated before implementation.

## 10. Pivot vs Minimum

For an array rotated by `k` positions:

```text
pivot = index of minimum
```

for the standard ascending rotation model.

Do not assume “pivot” means the last element of the first segment; define it precisely.

## 11. Duplicates Change the Problem

Consider:

```text
[2, 2, 2, 3, 2, 2]
```

When:

```text
A[L] === A[M] === A[R]
```

the ordering information may be insufficient to determine which side contains the pivot or target.

A common safe fallback is to shrink one or both boundaries, but this can degrade worst-case complexity.

## 12. Worst Case with Duplicates

With adversarial duplicates, modified binary search may degrade toward:

```text
O(n)
```

because ordering evidence can repeatedly disappear.

Therefore do not claim unconditional `O(log n)` for duplicate-tolerant variants.

## 13. Search Invariant

A useful exact-search invariant is:

> If the target exists, it remains inside the current interval.

Every branch must prove that discarded positions cannot contain the target.

The invariant is the same foundational idea as ordinary binary search, but the elimination proof uses local sortedness.

## 14. Sorted-Half Reasoning

Suppose:

```text
A[L] <= A[M]
```

Then `[L, M]` is sorted in the distinct-value ascending model.

If:

```text
A[L] <= T <= A[M]
```

then `T` can be inside that half.

Otherwise it cannot be there and the left half can be discarded.

The complementary reasoning applies to the right half.

## 15. Descending Rotations

The same conceptual technique works for rotated descending arrays, but comparison directions change.

Derive the ordering relation instead of copying ascending conditions.

## 16. Finding the Pivot

A pivot-search algorithm should define its target precisely.

Possible definitions include:

- index of minimum value;
- index where order breaks;
- number of rotations;
- first element of the second sorted segment.

These are related but can differ at boundaries and with duplicates.

## 17. Number of Rotations

Under the standard model:

```text
rotations = indexOfMinimum
```

for a left-to-right ascending array rotated to the left/right according to the documented convention.

Always define the rotation direction because “rotated by k” is ambiguous without a convention.

## 18. Zero Rotations

A completely sorted array is a valid edge case:

```text
[1, 2, 3, 4, 5]
```

The minimum is at index `0`.

A pivot algorithm must not assume the array has been rotated at least once.

## 19. Full-Length Rotation

A rotation by `n` positions produces the original sequence.

Therefore a robust API should define whether rotation counts are normalized modulo `n`.

## 20. Search in Duplicated Rotated Arrays

Target search with duplicates requires additional care because the sorted-half test may become ambiguous.

A practical decision structure is:

```text
if left == mid == right:
    shrink safely
else:
    identify an ordered side
```

The correctness proof must explain why the shrink operation cannot discard a unique required answer.

## 21. Minimum with Duplicates

For minimum search:

```text
A[mid] > A[right] → minimum right of mid
A[mid] < A[right] → minimum at/before mid
A[mid] == A[right] → right boundary may be redundant
```

Shrinking `right` can preserve correctness but may cause linear worst-case behavior.

## 22. Search vs Pivot-Then-Search

Two strategies:

### Direct modified search

```text
O(log n)
```

for distinct values and usually one pass.

### Pivot then ordinary search

```text
pivot O(log n)
+ binary search O(log n)
```

Also `O(log n)` in the distinct case.

The direct approach can avoid an explicit pivot representation; the pivot-first approach can simplify subsequent operations.

## 23. Search Range Across the Pivot

A target can exist in either sorted segment.

Do not assume the target's numeric position corresponds to its physical index.

The rotation breaks that direct global relationship.

## 24. Boundary Search in Rotated Arrays

Finding first/last occurrences in a rotated array is harder because the physical array has two sorted regions.

A robust strategy may be:

```text
identify segments
→ boundary-search each relevant segment
→ combine results
```

or use a carefully derived modified search.

The simplest correct decomposition is often preferable.

## 25. Why Duplicates Are Dangerous

Distinct values provide strict ordering evidence.

Duplicates can make:

```text
A[L] <= A[M]
```

true even when the meaningful pivot structure lies elsewhere.

Therefore the information content of a comparison can become insufficient for logarithmic elimination.

## 26. Correctness Proof

For distinct-value target search:

### Initialization
The target, if present, is inside `[L, R]`.

### Maintenance
Identify a sorted half. If the target's value range is inside that half, retain it and discard the other half. Otherwise discard the sorted half.

### Progress
At least one endpoint moves past the midpoint.

### Termination
The interval becomes empty or a matching value is found.

### Postcondition
If a result is returned, it is a target position; if the interval is exhausted, no target remains.

## 27. Correctness of Pivot Search

For minimum search, define an invariant such as:

> The minimum remains inside the current interval.

Each comparison must determine whether the minimum is strictly to one side or can remain at the midpoint.

The final singleton candidate is then the minimum under the stated assumptions.

## 28. Common Mistakes

1. Assuming the whole array is sorted.
2. Forgetting to identify the sorted half.
3. Choosing the sorted half without checking whether the target lies inside it.
4. Incorrectly handling the pivot.
5. Ignoring duplicates.
6. Claiming `O(log n)` for duplicate-degenerate cases.
7. Mishandling an already sorted array.
8. Confusing rotation direction.
9. Mixing inclusive/exclusive intervals.
10. Returning a pivot without defining what “pivot” means.

## 29. Edge Cases

Test:

- empty array;
- singleton;
- already sorted;
- one rotation;
- rotation by `n - 1`;
- target at pivot;
- target at first position;
- target at last position;
- absent target;
- all duplicates;
- duplicate-heavy pivot region;
- descending rotation.

## 30. Backend Applications

Modified binary-search reasoning can appear in:

- cyclic schedules;
- rotated time windows;
- circular buffers represented as arrays;
- partitioned configuration versions;
- segmented caches;
- ring-buffer snapshots.

In production systems, the data representation and ordering contract must be explicit.

## 31. AI Applications

Related reasoning can appear in:

- cyclic score buffers;
- partitioned ranked candidates;
- rotated batches;
- segmented threshold arrays;
- circular sampling structures.

The technique is primarily valuable as a search-space reasoning pattern.

## 32. Implementation Lab

Implement:

1. search in rotated sorted array without duplicates;
2. minimum in rotated sorted array;
3. pivot index;
4. rotation count;
5. search with duplicates;
6. minimum with duplicates;
7. pivot-then-search strategy;
8. descending rotated search.

For every function, document assumptions explicitly.

## 33. Verification Lab

Build a brute-force reference and generate rotated arrays from sorted arrays.

Test:

```text
all rotation amounts
all target positions
absent targets
random duplicates
```

Compare optimized results against the reference.

## 34. Benchmarking

Measure distinct and duplicate-heavy inputs separately.

Record:

- comparisons;
- iterations;
- fallback shrink operations;
- total runtime.

Do not mix average observed behavior with worst-case complexity claims.

## 35. Interview Questions

1. How can binary search work on a rotated sorted array?
2. Why is at least one side sorted when values are distinct?
3. How do you determine whether the target lies in the sorted side?
4. How do duplicates change complexity?
5. How do you find the minimum?
6. What is the pivot?
7. How do you handle an already sorted array?
8. Can you find the rotation count?
9. Why can duplicates destroy logarithmic elimination?
10. What invariant does your modified search maintain?

## 36. Revision Checklist

- [ ] I can explain the rotated-array model.
- [ ] I can identify a sorted half.
- [ ] I can derive target containment in that half.
- [ ] I can implement distinct-value rotated search.
- [ ] I can find the minimum.
- [ ] I can locate the pivot.
- [ ] I understand duplicate degradation.
- [ ] I can explain why duplicates reduce available ordering information.
- [ ] I can handle zero rotations.
- [ ] I can prove the modified-search invariant.
- [ ] I can validate against brute force.
- [ ] I can distinguish average behavior from worst-case complexity.

## 37. Key Takeaways

1. **Rotated sorted arrays preserve local ordering even though global ordering is broken.**
2. **With distinct values, at least one side of the current interval is sorted.**
3. **Modified binary search uses that local ordering to eliminate candidates safely.**
4. **The target must be checked against the value range of the sorted side.**
5. **Pivot-first and direct modified search are two valid decompositions of the same structure.**
6. **Duplicates can remove enough ordering information to degrade worst-case search to `O(n)`.**
7. **Minimum/pivot search is another invariant-driven binary-search variant.**
8. **Rotation direction and pivot definition must be explicit.**
9. **Correctness still comes from candidate preservation, safe elimination, progress, and termination.**
10. **The transferable skill is recognizing partial ordering and turning it into a safe elimination rule.**
