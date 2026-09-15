# 08.15 — Search in Bitonic / Mountain Arrays

## 1. Concept Definition

A **mountain array** increases strictly up to one peak and then decreases strictly:

```text
1 3 5 8 12 9 6 2
        ↑
       peak
```

A **bitonic array** is commonly used for the same structural idea: one monotone increasing region followed by one monotone decreasing region.

The global array is not sorted, but it contains two sorted regions separated by a peak.

## 2. Why It Matters

This topic extends the invariant-recovery idea from rotated arrays.

Instead of asking:

> Is the whole array sorted?

we ask:

> What monotone structure remains, and how can I exploit it?

## 3. Mental Model

Think of the array as:

```text
ascending region | descending region
                 ↑
                peak
```

Once the peak is known, ordinary binary search can be applied independently to each region.

## 4. Strict Mountain Contract

The classic mountain-array contract is:

```text
A[0] < A[1] < ... < A[p]
A[p] > A[p+1] > ... > A[n-1]
```

There is exactly one peak index `p`.

Duplicates require a different contract and can complicate peak identification.

## 5. Finding the Peak

Compare the midpoint with its successor.

If:

```text
A[mid] < A[mid + 1]
```

then the peak lies to the right.

Otherwise:

```text
A[mid] > A[mid + 1]
```

means the peak is at `mid` or to its left.

This gives a binary-search-style peak algorithm.

## 6. Peak Invariant

At every iteration:

> The true peak remains inside the active interval.

The comparison with `mid + 1` identifies which side still contains the peak.

## 7. Peak Complexity

The active interval approximately halves each iteration:

```text
Time → O(log n)
Auxiliary space → O(1)
```

for iterative peak finding under the strict mountain contract.

## 8. Search Strategy

After finding the peak:

```text
search ascending [0, peak]
search descending [peak + 1, n - 1]
```

If either search finds the target, return according to the API's occurrence contract.

## 9. Ascending Half Search

The left region uses ordinary ascending binary search:

```text
A[mid] < target → move right
A[mid] > target → move left
```

## 10. Descending Half Search

The right region reverses the comparison direction:

```text
A[mid] < target → move left
A[mid] > target → move right
```

The search algorithm must explicitly encode the ordering direction.

## 11. Total Complexity

Peak detection costs:

```text
O(log n)
```

Each half search costs at most:

```text
O(log n)
```

Therefore:

```text
O(log n) + O(log n) + O(log n) = O(log n)
```

Overall auxiliary space remains `O(1)` for iterative implementations.

## 12. One-Pass Search

It is possible to combine peak reasoning and target search into a more specialized procedure, but the two-stage approach is often easier to prove:

```text
find structural boundary
→ search ordered regions
```

Separating concerns also makes testing easier.

## 13. Why the Peak Is Special

The peak is greater than every value in the strict mountain array.

Therefore:

- if `target > peakValue`, it is absent;
- if `target === peakValue`, the peak is the answer;
- otherwise it may exist in either monotone region.

## 14. Target Relative to Peak

If:

```text
target < peakValue
```

both halves remain possible.

This is why the algorithm must search both sides unless additional information eliminates one side.

## 15. First Occurrence Semantics

If duplicates are allowed, the same target may appear on both sides of the peak.

Returning the first physical index may require searching both candidate regions and combining the results.

Do not assume the first successful binary search gives the globally first occurrence.

## 16. Last Occurrence Semantics

Similarly, finding the last occurrence can require searching both sides and taking the appropriate result according to the documented index ordering.

Membership and boundary semantics must remain separate.

## 17. Duplicate Values

A strict mountain array forbids equal adjacent values.

If the input instead permits:

```text
1 3 5 5 4 2
```

peak identification is no longer governed by the same strict inequalities.

The algorithm must either reject such input or explicitly support a weaker contract.

## 18. Plateau Peaks

A plateau such as:

```text
1 3 5 5 5 4 2
```

has multiple maximum positions.

Questions such as:

- any peak;
- first peak;
- last peak;
- peak interval

become distinct problems.

## 19. Validation

For a strict mountain array, validate:

1. at least three elements when required by the contract;
2. a strictly increasing prefix;
3. a strictly decreasing suffix;
4. exactly one transition from increasing to decreasing.

Production APIs should document whether validation is expected or assumed.

## 20. Bitonic Subarrays

A general array may contain a mountain-shaped **subarray** even when the whole array is not bitonic.

Finding the longest bitonic subarray is a different optimization problem and should not be confused with searching a known mountain array.

## 21. Mountain Array vs Rotated Array

Rotated array:

```text
sorted region → sorted region
```

with a wrap from high to low.

Mountain array:

```text
ascending → peak → descending
```

The useful invariant differs:

- rotated search: at least one half is sorted;
- mountain search: the peak partitions the array into two ordered regions.

## 22. Peak Finding as Boundary Search

Peak detection can be interpreted as locating the transition:

```text
A[i] < A[i + 1]
```

changing from true to false.

This connects mountain search directly to boundary-search reasoning.

## 23. Predicate Formulation

Define:

```text
P(i) = A[i] < A[i + 1]
```

For a strict mountain array:

```text
true true true false false false
```

The first false identifies the peak.

This is another example of reducing a structural problem to a monotone predicate.

## 24. Correctness: Peak Search

### Initialization
The interval contains the peak.

### Maintenance
If the slope is rising at `mid`, the peak must be to the right. Otherwise it is at `mid` or to the left.

### Progress
The interval strictly shrinks.

### Termination
`left === right`.

### Postcondition
The resulting index is the peak under the strict mountain contract.

## 25. Correctness: Ascending Search

Within `[0, peak]`, the values are sorted ascending.

Therefore ordinary binary-search invariants apply.

## 26. Correctness: Descending Search

Within `[peak + 1, n - 1]`, values are sorted descending.

Therefore the binary-search direction is reversed while preserving the same candidate-preservation invariant.

## 27. Combined Correctness

If the target exists, it must be:

1. the peak;
2. in the ascending region;
3. in the descending region.

The algorithm examines all structurally valid regions, so an absent result means every possible region has been exhausted.

## 28. Edge Cases

Test:

- empty array;
- one element;
- two elements;
- minimal valid mountain;
- target at first element;
- target at peak;
- target at last element;
- target absent;
- increasing-only invalid input;
- decreasing-only invalid input;
- duplicate plateau when unsupported;
- negative values.

## 29. Backend Applications

Mountain-shaped data can represent:

- traffic load rising then falling;
- latency curves;
- capacity-response measurements;
- performance profiles;
- resource utilization over a bounded experiment.

The algorithm is useful when the monotone structure is guaranteed and indexed access is available.

## 30. AI Applications

Related structures can appear in:

- score landscapes with one known peak;
- hyperparameter sweeps;
- monotone objective slices;
- ranked candidate curves.

For arbitrary high-dimensional optimization, this should not be confused with general optimization algorithms.

## 31. Testing Strategy

Generate strict mountains by:

```text
ascending prefix + descending suffix
```

with a randomly chosen peak.

Test every element as a target plus values outside the range.

Compare optimized results against a linear reference.

## 32. Differential Testing

For each generated mountain:

```text
optimized peak
vs
linear maximum
```

and:

```text
optimized search
vs
linear membership search
```

For occurrence queries, make the reference implement the exact first/last semantics.

## 33. Benchmarking

Measure:

- peak-search comparisons;
- ascending-search comparisons;
- descending-search comparisons;
- target distribution;
- array size;
- validation cost.

Separate validation cost from query cost when benchmarking a prevalidated dataset.

## 34. Common Mistakes

1. Treating the entire mountain array as sorted.
2. Searching only the ascending half.
3. Forgetting the descending comparator direction.
4. Mishandling `mid + 1` during peak search.
5. Returning a peak when the target is not the peak.
6. Assuming duplicates satisfy the strict mountain contract.
7. Claiming `O(log n)` for an algorithm that linearly validates the input every query.
8. Confusing a mountain array with a rotated array.
9. Ignoring occurrence semantics.
10. Failing to define invalid-input behavior.

## 35. Implementation Lab

Implement:

1. peak index search;
2. ascending binary search;
3. descending binary search;
4. exact mountain-array search;
5. validated mountain search;
6. duplicate-aware variant under an explicit contract;
7. first occurrence;
8. last occurrence;
9. brute-force references;
10. randomized differential tests.

## 36. Interview Questions

1. How do you find the peak of a mountain array in `O(log n)`?
2. Why does comparing `A[mid]` and `A[mid + 1]` work?
3. How do you search both sides of the peak?
4. Why is descending binary search different?
5. What happens if duplicates are allowed?
6. How does peak finding relate to boundary search?
7. What is the total complexity of peak + two searches?
8. How would you return the first occurrence?
9. How would you validate the mountain contract?
10. How is a mountain array structurally different from a rotated sorted array?

## 37. Revision Checklist

- [ ] I can define a strict mountain array.
- [ ] I can find its peak in `O(log n)`.
- [ ] I understand the slope-transition invariant.
- [ ] I can binary-search an ascending region.
- [ ] I can binary-search a descending region.
- [ ] I can combine both searches correctly.
- [ ] I understand duplicate/plateau complications.
- [ ] I can distinguish mountain and rotated structures.
- [ ] I can prove peak-search correctness.
- [ ] I can test against a brute-force reference.

## 38. Key Takeaways

1. **A mountain array is two monotone regions joined at a peak.**
2. **The peak can be found in `O(log n)` by following the slope transition.**
3. **Once the peak is known, each side can be searched with the appropriate binary-search direction.**
4. **Peak finding itself is a monotone-boundary problem.**
5. **Strictness matters: duplicates change the structural contract and can change the algorithm.**
6. **Occurrence queries require stronger semantics than membership queries.**
7. **The overall search remains `O(log n)` under the strict mountain assumptions.**
8. **The deeper lesson is to partition a non-monotone structure into monotone regions and reuse known search primitives.**
