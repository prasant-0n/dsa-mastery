# 09.08 — Quicksort

## 1. Definition

Quicksort is a divide-and-conquer sorting algorithm built around partitioning an array around a pivot.

Conceptually:

```text
choose pivot
→ partition
→ recursively sort left/right regions
```

Unlike Merge Sort, Quicksort performs its key reorganization during partitioning rather than during a final merge.

## 2. Why It Matters

Quicksort teaches:

- partition invariants;
- divide-and-conquer recursion;
- average versus worst-case complexity;
- pivot selection;
- recursion-depth engineering;
- duplicate handling;
- in-place sorting;
- hybrid algorithm design.

It is also a foundation for understanding production introspective sorting strategies.

## 3. Mental Model

For a pivot `p`, partition the active range into regions whose relationship to `p` is known.

A simple two-way target is:

```text
values <= p | values > p
```

The exact invariant depends on the partition scheme.

## 4. Partition Is the Core

Quicksort correctness depends more on the partition invariant than on the recursive wrapper.

A partition operation should:

1. choose or receive a pivot;
2. rearrange the active range;
3. place the pivot or establish a boundary;
4. return subproblem boundaries that make measurable progress.

## 5. Lomuto Partition

One common scheme keeps a boundary for elements known to be less than or equal to the pivot.

Conceptually:

```text
[ <= pivot | unknown | > pivot ]
```

As scanning progresses, the unknown region shrinks.

Lomuto is easy to reason about, but can perform many swaps and can degrade badly on certain inputs.

## 6. Hoare-Style Partition

Another family uses two scanning indices moving inward.

Conceptually:

```text
left scan →      ← right scan
```

Values are exchanged when they are on the wrong side of the pivot relation.

Hoare-style schemes have different return-boundary semantics from Lomuto, so recursive bounds must match the chosen partition contract.

## 7. Partition Invariant

A possible invariant for a two-pointer scheme is:

```text
left region  satisfies the left-side relation
right region satisfies the right-side relation
middle region remains unclassified
```

Every iteration must shrink the unclassified region.

## 8. Correctness

After partitioning, the recursive subproblems must be arranged so that every element belongs to a region whose final ordering is compatible with the pivot boundary.

Then recursively sorting each region produces a globally sorted sequence.

The proof must explicitly match the selected partition implementation.

## 9. Base Case

A subarray containing zero or one element is already sorted.

For index ranges:

```text
low >= high
```

is a typical termination condition.

## 10. Average Complexity

With reasonably balanced partitions, Quicksort follows approximately:

```text
T(n) = 2T(n/2) + O(n)
```

which gives:

```text
O(n log n)
```

average-style behavior under appropriate pivot assumptions.

## 11. Worst Case

If partitions repeatedly produce sizes near:

```text
0 and n-1
```

then:

```text
T(n) = T(n-1) + O(n)
```

which gives:

```text
O(n²)
```

The worst case can also produce linear recursion depth in a naive implementation.

## 12. Best Case

Near-perfectly balanced partitions produce:

```text
O(n log n)
```

comparison/partition work.

The exact constants depend on the partition implementation and input characteristics.

## 13. Pivot Selection

Common strategies include:

- first element;
- last element;
- middle element;
- random element;
- median-of-three;
- more advanced sampling.

No single pivot rule is universally optimal. The appropriate strategy depends on workload, adversarial risk, implementation, and available safeguards.

## 14. Randomized Quicksort

Choosing a pivot using randomness can reduce the likelihood of repeatedly encountering pathological partitions for many input models.

Expected complexity can remain:

```text
O(n log n)
```

while the algorithm still has a theoretical `O(n²)` worst case.

Randomization changes the probability distribution of bad behavior; it does not eliminate the worst-case possibility.

## 15. Median-of-Three

A common deterministic heuristic chooses a pivot based on several sampled positions.

Its purpose is to avoid obvious poor choices such as consistently selecting an extreme value on already ordered data.

It is a heuristic, not a worst-case proof.

## 16. Duplicate-Heavy Inputs

Two-way partitioning can perform unnecessary work when many values equal the pivot.

Three-way partitioning creates:

```text
less | equal | greater
```

This can be especially useful when duplicate keys are common.

## 17. Three-Way Quicksort

A Dutch-National-Flag-style partition maintains three regions:

```text
< pivot | = pivot | unknown | > pivot
```

The equal region needs no further recursive sorting.

This can dramatically reduce work for arrays containing many duplicates.

## 18. Stability

Standard in-place Quicksort is generally **unstable**.

Swapping elements during partitioning can change the relative order of equal keys.

Stable Quicksort variants exist, but maintaining stability generally introduces additional movement or memory complexity.

## 19. In-Place Behavior

Quicksort can be implemented with `O(1)` auxiliary partition storage.

However, recursive calls consume stack space.

Therefore a recursive implementation should not simply be labeled `O(1)` total auxiliary space.

Balanced recursion typically uses:

```text
O(log n)
```

stack space.

Poor partitions can produce:

```text
O(n)
```

stack depth.

## 20. Tail-Recursion Engineering

One practical technique is to recursively process the smaller partition first and iterate over the larger partition.

This can keep stack usage bounded by the logarithm of the input size under appropriate partition behavior.

The technique changes implementation mechanics without changing the sorting model itself.

## 21. Introspective Sorting

A production-oriented hybrid can monitor recursion depth.

If Quicksort becomes suspiciously deep, it can switch to a guaranteed `O(n log n)` fallback such as Heap Sort.

This combines:

```text
Quicksort practical behavior
+
Heap Sort worst-case safeguard
```

The exact policy belongs to the implementation contract.

## 22. Insertion-Sort Cutoff

Small partitions may be sorted using Insertion Sort instead of continuing recursive partitioning.

Why?

- fewer function calls;
- lower constant factors;
- good performance on tiny arrays.

This is a classic hybrid-algorithm technique.

## 23. Example

Input:

```text
[7, 2, 1, 6, 8, 5, 3, 4]
```

Choose a pivot according to the selected policy, partition the array, then recursively sort the resulting regions.

The exact intermediate arrangement depends on the partition scheme and pivot choice.

## 24. JavaScript Implementation Pattern

A clean implementation should separate:

```text
partition(values, low, high, compare)
quickSortRange(values, low, high, compare)
```

The partition function should document its boundary contract.

Do not mix Lomuto and Hoare recursive-bound conventions.

## 25. Comparator Discipline

Quicksort should use a consistent comparator:

```js
(a, b) => a - b
```

for ascending numbers.

For records, define explicit key ordering and tie behavior.

An inconsistent comparator can invalidate the algorithm's ordering assumptions.

## 26. Complexity Accounting

Separate:

```text
partition work
recursive work
stack space
pivot-selection cost
comparison cost
swap/write cost
```

For expensive object comparisons, comparator cost can dominate the simple `O(n log n)` comparison count.

## 27. Cache Behavior

In-place Quicksort often works on contiguous arrays and can have favorable locality.

But partitioning can create branch and memory-access behavior that varies by implementation and input distribution.

Asymptotic complexity and actual hardware performance are different layers of analysis.

## 28. Backend Applications

Quicksort concepts appear in:

- in-memory API result ordering;
- small batch processing;
- ranking pipelines;
- partitioning workloads;
- deterministic preprocessing.

For database-scale records, first consider database-side ordering and indexes rather than copying all records into application memory.

## 29. AI Applications

Quicksort-style partitioning is relevant to:

- candidate ordering;
- score partitioning;
- ranking preprocessing;
- threshold-based grouping.

For top-k workloads, full Quicksort may be unnecessary; selection or heap-based methods can target only the required portion.

## 30. Common Mistakes

1. Mixing partition schemes.
2. Returning the wrong boundary from partition.
3. Forgetting to shrink the recursive range.
4. Choosing a pivot but failing to move it consistently.
5. Assuming randomized pivots remove worst-case complexity.
6. Ignoring recursion stack space.
7. Breaking stability unintentionally.
8. Handling equal values poorly.
9. Using an inconsistent comparator.
10. Creating infinite recursion through unchanged bounds.

## 31. Edge Cases

Test:

- empty;
- singleton;
- two elements;
- already sorted;
- reverse sorted;
- all equal;
- duplicate-heavy;
- many repeated extreme values;
- adversarial pivot patterns;
- object records with equal keys.

## 32. Testing Strategy

Validate:

```text
sortedness
permutation preservation
stability if promised
termination
partition invariants
```

Use randomized differential testing against a trusted reference.

Test both normal and adversarial distributions.

## 33. Benchmarking

Instrument:

- comparisons;
- swaps;
- partition count;
- maximum recursion depth;
- pivot-selection cost;
- elapsed time.

Compare pivot strategies on the same workload rather than changing multiple variables at once.

## 34. Interview Questions

1. Why can Quicksort be `O(n²)`?
2. What determines its average `O(n log n)` behavior?
3. What is a partition invariant?
4. Compare Lomuto and Hoare-style partitioning.
5. Why can three-way partitioning help with duplicates?
6. Why is standard Quicksort unstable?
7. What is recursion-stack complexity?
8. How can tail-recursive engineering reduce stack usage?
9. What is introsort and why is it useful?
10. Why might Insertion Sort be used for small partitions?

## 35. Revision Checklist

- [ ] I can explain Quicksort as divide-and-conquer partitioning.
- [ ] I can implement a partition function with a precise invariant.
- [ ] I can derive balanced and pathological recurrences.
- [ ] I understand pivot-selection trade-offs.
- [ ] I understand randomized Quicksort's expected behavior.
- [ ] I can explain three-way partitioning.
- [ ] I can account for recursion stack space.
- [ ] I understand introspective and hybrid strategies.
- [ ] I can test adversarial and duplicate-heavy inputs.
- [ ] I can defend my partition boundary contract in an interview.

## 36. Key Takeaways

1. **Quicksort sorts by partitioning around a pivot and recursively processing the resulting regions.**
2. **Its performance depends strongly on partition balance.**
3. **Balanced partitions lead to `O(n log n)` behavior; repeatedly poor partitions lead to `O(n²)`.**
4. **Randomization changes expected behavior but does not remove the theoretical worst case.**
5. **Three-way partitioning is valuable for duplicate-heavy inputs.**
6. **In-place partitioning can use little array storage, but recursive stack space must still be counted.**
7. **Tail-recursive engineering, small-partition insertion sort, and introspective fallbacks are important production techniques.**
8. **The deepest lesson is that algorithm correctness and performance come from explicitly defining and preserving the partition invariant.**
