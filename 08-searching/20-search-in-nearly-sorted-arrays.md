# 08.20 — Search in Nearly Sorted Arrays

## 1. Concept Definition

A nearly sorted array is an array whose elements are close to their positions in a fully sorted array. A common contract is that every element is at most `k` positions away from its sorted position.

A different, frequently used interview contract is the **k-sorted / k-displaced array**, where an element originally at sorted index `i` may appear within `[i-k, i+k]`.

The exact disorder model must be defined before choosing an algorithm.

## 2. Why It Matters

Nearly sorted data rewards algorithms that exploit **local disorder** instead of treating the input as completely unsorted.

The core engineering lesson is:

> Search algorithms should exploit the strongest valid structural guarantee, but no stronger.

## 3. Mental Model

A normally sorted array has:

```text
A[i] <= A[i+1]
```

A nearly sorted array may contain local inversions:

```text
... 3 1 2 4 ...
```

but the disorder is bounded.

## 4. Classic k-Displacement Search

If every value can move at most `k` positions from its sorted location, a target that belongs near index `mid` can only appear in a bounded neighborhood.

A common strategy examines:

```text
mid-k ... mid ... mid+k
```

and then eliminates regions using the displacement guarantee.

## 5. Why the Neighborhood Matters

Suppose the fully sorted position of target `x` is `p`.

Under the displacement contract:

```text
|actualIndex(x) - p| <= k
```

Therefore a candidate search window can be limited using `k`.

The correctness depends completely on this contract.

## 6. Alternative: Sort First

If many queries will be performed, it may be useful to restore full ordering first.

For a k-sorted array, specialized sorting methods such as a min-heap can exploit the bounded disorder.

The correct strategy depends on:

- number of queries;
- value of `k`;
- mutation tolerance;
- preprocessing budget.

## 7. Heap-Based Ordering

A k-sorted array can be sorted using a min-heap of approximately `k + 1` elements.

The heap maintains the smallest candidate among the next bounded region.

Typical complexity:

```text
O(n log k)
```

with:

```text
O(k)
```

auxiliary space.

## 8. Search vs Preprocess Trade-Off

For one query, specialized bounded-disorder search may be preferable to fully sorting the array.

For many queries, preprocessing can amortize its cost.

Model total cost as:

```text
preprocessing + numberOfQueries × queryCost
```

rather than optimizing only one query.

## 9. Binary Search Is Not Automatically Valid

Standard binary search assumes a globally sorted array.

A nearly sorted array violates that invariant.

Blindly applying ordinary binary search can eliminate a region that still contains the target.

## 10. Local Disorder Does Not Mean Arbitrary Disorder

The useful guarantee is bounded displacement, not merely “mostly sorted.”

For example:

```text
1 2 3 5 4 6 7
```

has a small local inversion.

But an array with one element moved from the beginning to the end may violate a small-`k` displacement contract even though most adjacent pairs remain sorted.

## 11. Disorder Metrics

Possible contracts include:

- maximum displacement `k`;
- number of inversions;
- maximum local inversion distance;
- percentage of correctly ordered pairs;
- monotone runs.

These are not interchangeable.

## 12. Maximum Displacement

If the maximum displacement is known, algorithms can use `k` directly.

If it is unknown, determining `k` may require additional preprocessing or validation.

Do not claim a `k`-dependent complexity without establishing how `k` is obtained.

## 13. Unknown k

Possible approaches:

1. trust an external contract;
2. validate displacement while scanning;
3. estimate a bound conservatively;
4. use an algorithm that does not require `k` explicitly.

The right choice depends on whether correctness or performance is the primary constraint.

## 14. Duplicate Values

Duplicates complicate the meaning of “sorted position.”

If equal values can occupy multiple sorted indices, displacement should be defined using a stable ordering or a set of valid positions.

Boundary-query semantics must be explicit.

## 15. Exact Membership vs Occurrence Queries

These are different problems:

```text
Does target exist?
```

versus:

```text
What is the first/last occurrence?
```

A bounded-neighborhood search may find one occurrence without determining global occurrence boundaries.

## 16. Stable Identity for Records

For records with duplicate keys, define whether displacement applies to:

- record identity;
- key occurrence;
- stable sorted order.

Without this definition, “k positions away” can be ambiguous.

## 17. Correctness Invariant

For a valid k-displacement contract:

> Every candidate eliminated by the algorithm must be unable to contain the target under the maximum-displacement bound.

The active candidate region must always contain every still-possible target position.

## 18. Correctness Proof Pattern

### Initialization
Start with the entire valid search domain.

### Candidate Restriction
Use the displacement bound to restrict possible target positions.

### Elimination
Discard only positions proven impossible under the contract.

### Termination
The candidate region becomes empty or a valid occurrence is found.

## 19. Complexity Reasoning

The exact complexity depends on the chosen algorithm and displacement model.

A neighborhood-based search performs work related to the number of examined candidates, often involving `k`.

A heap-based preprocessing strategy typically costs:

```text
O(n log k)
```

followed by ordinary sorted-array search.

Always state whether preprocessing is included.

## 20. Nearly Sorted Search by Local Window

A direct implementation can inspect a bounded neighborhood around a candidate midpoint.

The key challenge is not the loop itself; it is proving that the neighborhood contains every possible target position under the stated contract.

## 21. Nearly Sorted Search by Heap

Another architecture is:

```text
nearly sorted input
→ k-aware heap ordering
→ fully sorted representation
→ ordinary binary search
```

This is attractive when many subsequent queries justify preprocessing.

## 22. Multiple Queries

For `q` queries, compare:

```text
q × specializedSearchCost
```

against:

```text
preprocessCost + q × binarySearchCost
```

This is an algorithm-selection problem rather than a single-algorithm problem.

## 23. Streaming Nearly Sorted Data

A bounded-disorder stream can be processed with a heap.

When enough future elements have arrived to establish the next output safely, emit the minimum available value.

This is closely related to event-time reordering and bounded-lateness processing.

## 24. Backend Applications

Useful backend scenarios include:

- delayed event streams;
- records arriving slightly out of order;
- log reordering;
- bounded-lateness telemetry;
- locally disordered queues;
- sorted cache refreshes.

The distinction between bounded disorder and arbitrary disorder is critical for correctness.

## 25. AI Applications

Potential applications include:

- approximately ordered candidate scores;
- batched ranking results with bounded movement;
- streaming metadata with bounded lateness;
- locally reordered feature values.

For large-scale ranking, specialized indexing and top-k structures may be more appropriate depending on the workload.

## 26. Relationship to Top-K

A k-sorted stream and a top-k query are different structures.

A heap can appear in both algorithms, but the invariant and objective differ:

- k-sorted processing restores order;
- top-k processing retains only the required extreme candidates.

Do not conflate the two.

## 27. Streaming and Event-Time Ordering

Suppose an event may arrive up to `k` positions late relative to expected order.

A min-heap can buffer recent events until the bounded-lateness guarantee allows safe emission.

This is a systems-level extension of the same bounded-disorder principle.

## 28. Validation

A validation routine may compute each element's displacement from a chosen sorted reference.

For large data, fully sorting solely to validate the contract can defeat the purpose of a specialized algorithm.

Production systems should preferably enforce the guarantee at the producer or ingestion boundary.

## 29. Common Mistakes

1. Applying ordinary binary search to unsorted data.
2. Treating “nearly sorted” as a precise mathematical guarantee without defining it.
3. Assuming a small number of inversions implies small maximum displacement.
4. Ignoring duplicates when defining sorted positions.
5. Forgetting preprocessing cost for multi-query workloads.
6. Claiming a `k`-dependent bound without knowing or enforcing `k`.
7. Confusing k-sorted data with top-k problems.
8. Ignoring streaming lateness semantics.
9. Searching a local window without proving candidate coverage.
10. Mutating input without documenting it.

## 30. Edge Cases

Test:

- empty array;
- singleton;
- `k = 0`;
- `k = 1`;
- `k >= n`;
- target at the beginning/end;
- target absent;
- duplicate keys;
- all equal values;
- reverse-sorted data;
- one far-displaced element;
- partially ordered runs.

## 31. Testing Strategy

Generate a sorted reference, then apply controlled permutations whose displacement never exceeds `k`.

Verify:

- exact membership;
- duplicate semantics;
- boundary behavior;
- sorting/preprocessing output.

Also generate intentionally invalid inputs to verify contract enforcement.

## 32. Differential Testing

Compare specialized search against:

```text
linear search on original input
```

and, when preprocessing is used:

```text
heap-based sorted output
vs
fully sorted reference
```

## 33. Benchmarking

Benchmark across:

- `n`;
- `k`;
- query count `q`;
- duplicate density;
- disorder distribution;
- preprocessing enabled/disabled.

Measure total workload cost rather than only individual query latency.

## 34. Implementation Lab

Implement:

1. k-aware membership search;
2. configurable displacement contract;
3. first/last occurrence semantics;
4. k-aware heap sorting;
5. multi-query preprocessing strategy;
6. bounded-lateness stream reorderer;
7. contract validator;
8. differential test harness;
9. workload-level benchmark;
10. adaptive preprocess-vs-query policy.

## 35. Interview Questions

1. What does k-sorted mean?
2. Why can ordinary binary search fail?
3. How can a heap sort a k-sorted array in `O(n log k)`?
4. How does the value of `k` affect the algorithm?
5. What changes when `k` is unknown?
6. How do duplicates affect displacement semantics?
7. When does preprocessing become worthwhile for many queries?
8. How does bounded disorder relate to streaming event reordering?
9. What is the difference between k-sorted data and a top-k problem?
10. How would you prove that a local candidate window is sufficient?

## 36. Revision Checklist

- [ ] I can define a precise nearly-sorted contract.
- [ ] I understand maximum displacement `k`.
- [ ] I know why ordinary binary search can fail.
- [ ] I can reason about local candidate windows.
- [ ] I can explain heap-based `O(n log k)` sorting.
- [ ] I can compare one-query and multi-query strategies.
- [ ] I understand duplicate semantics.
- [ ] I can apply bounded-disorder reasoning to streams.
- [ ] I can validate specialized-algorithm assumptions.
- [ ] I can derive workload-level cost.

## 37. Key Takeaways

1. **“Nearly sorted” must be defined precisely before it can support an algorithmic guarantee.**
2. **A k-displacement contract provides a bounded-disorder invariant.**
3. **Ordinary binary search is not valid unless the required global ordering invariant holds.**
4. **A k-sorted array can be fully sorted with a min-heap in `O(n log k)`.**
5. **Preprocessing can become worthwhile when many queries reuse the same data.**
6. **Duplicates require explicit definitions of sorted position and occurrence semantics.**
7. **Bounded disorder naturally extends to streaming and event-time reordering.**
8. **The deeper lesson is to exploit quantified disorder rather than vague assumptions about data being “almost sorted.”**
