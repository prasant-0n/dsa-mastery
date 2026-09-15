# 09.07 — Merge Sort

## 1. Definition

Merge Sort is a divide-and-conquer sorting algorithm. It recursively divides a sequence into smaller parts, sorts those parts, and merges the sorted results.

```text
divide → solve → merge
```

## 2. Why It Matters

Merge Sort introduces several core ideas used throughout advanced algorithms:

- divide and conquer;
- recurrence relations;
- linear-time merging;
- stable sorting;
- predictable `O(n log n)` time;
- external sorting;
- parallel decomposition.

## 3. Mental Model

Instead of trying to sort a large sequence directly, repeatedly reduce the problem until every subarray contains at most one element.

A one-element sequence is already sorted.

Then rebuild the answer by merging sorted sequences.

## 4. Divide Step

For an array of length `n`, split around a midpoint:

```text
left  = A[0 ... mid)
right = A[mid ... n)
```

The exact midpoint convention is less important than maintaining non-overlapping ranges that cover every input element exactly once.

## 5. Base Case

A sequence with zero or one element is already sorted:

```text
n <= 1
```

This guarantees recursive termination.

## 6. Merge Step

Given two sorted sequences:

```text
left  = [1, 4, 7]
right = [2, 3, 8]
```

compare their front elements and repeatedly take the smaller one:

```text
[1, 2, 3, 4, 7, 8]
```

Every element is consumed once.

## 7. Merge Invariant

During a merge:

```text
output is sorted
and
output contains exactly the consumed prefix of each input
```

At every step, the smallest remaining element among the two fronts is safe to append.

## 8. Correctness of Merge

Because both inputs are sorted, their first remaining elements are the smallest remaining elements in their respective inputs.

Taking the smaller front element therefore produces the smallest globally remaining element.

Repeating this until both inputs are exhausted yields sorted output containing every input element exactly once.

## 9. Stability

A standard merge can be stable when ties select the left element first:

```text
if compare(left[i], right[j]) <= 0:
    take left
else:
    take right
```

The tie rule preserves the original relative order of equivalent elements across the two runs.

## 10. Time Complexity

For a standard array implementation:

```text
Best:    O(n log n)
Average: O(n log n)
Worst:   O(n log n)
```

The predictable bound is one of Merge Sort's defining properties.

## 11. Recurrence

A balanced merge sort follows approximately:

```text
T(n) = 2T(n/2) + O(n)
```

The `2T(n/2)` term represents recursive sorting of two halves.

The `O(n)` term represents merging.

Therefore:

```text
T(n) = O(n log n)
```

## 12. Auxiliary Space

A straightforward top-down array implementation commonly uses:

```text
O(n)
```

auxiliary storage for merge buffers, plus recursion stack space.

Some specialized implementations reduce allocations or reuse a shared buffer, but the standard asymptotic auxiliary storage remains linear.

## 13. Top-Down Implementation

Conceptually:

```text
mergeSort(A):
    if size <= 1: return A
    split A
    sort left
    sort right
    merge left and right
```

The important reasoning is the decomposition and merge invariant, not memorizing a particular slicing syntax.

## 14. Bottom-Up Merge Sort

Merge Sort does not require recursion.

Bottom-up sorting starts with runs of width `1`, then merges runs of width `2`, `4`, `8`, and so on.

```text
width = 1
→ 2
→ 4
→ 8
→ ...
```

This provides an iterative formulation and can avoid recursive call-stack usage.

## 15. Shared Buffer Engineering

Repeatedly allocating temporary arrays can increase allocation pressure.

A production implementation can reuse one auxiliary buffer across merge passes.

This changes allocation behavior without changing the fundamental `O(n log n)` time and `O(n)` auxiliary-space model.

## 16. In-Place Merge

In-place merging is possible, but achieving both efficient movement and simple implementation is substantially more complicated than the standard buffered merge.

Therefore “Merge Sort is in-place” should never be claimed without specifying the exact merge implementation.

## 17. Stable Multi-Key Sorting

Stable Merge Sort can support multi-pass sorting:

```text
stable sort by secondary key
stable sort by primary key
```

Within equal primary-key groups, secondary ordering is preserved.

A single compound comparator is often clearer when the complete ordering is known.

## 18. Natural Runs

Real data may contain already sorted runs.

A merge-based strategy can exploit these runs rather than always treating the input as arbitrary halves.

This idea is central to adaptive hybrid sorting approaches.

## 19. Merge Cost

Merging two sequences of lengths `n` and `m` costs:

```text
O(n + m)
```

because each element is advanced through at most once.

This linear merge operation is the reason the divide-and-conquer recurrence becomes `O(n log n)`.

## 20. Example

Input:

```text
[38, 27, 43, 3, 9, 82, 10]
```

Conceptually divide:

```text
[38,27,43] [3,9,82,10]
```

Continue until singletons, sort/merge upward, and finally obtain:

```text
[3,9,10,27,38,43,82]
```

## 21. JavaScript Pattern

A clean educational implementation can separate merging from recursion:

```js
function merge(left, right, compare) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (compare(left[i], right[j]) <= 0) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return result;
}
```

Then recursively sort and merge.

## 22. Slicing Cost

JavaScript implementations that use repeated `slice()` operations create additional arrays.

Although the asymptotic time can remain `O(n log n)`, allocation and copying constants matter.

A shared-buffer index-based implementation can reduce allocation overhead.

## 23. Comparator Cost

If comparing complex records requires extracting or computing expensive keys, comparator calls can dominate practical runtime.

Possible engineering techniques include:

- precomputing keys;
- decorate-sort-undecorate;
- caching derived values;
- using a compound comparator with explicit fields.

## 24. External Sorting

Merge-based sorting is especially important when the dataset does not fit in memory.

A simplified external workflow is:

```text
read chunks
→ sort each chunk
→ write sorted runs
→ k-way merge runs
```

The algorithm changes from an in-memory operation into a storage-aware pipeline.

## 25. K-Way Merge

If `k` sorted streams must be merged, a min-heap can track the smallest current element from each stream.

For `N` total elements:

```text
O(N log k)
```

heap-based merge work is typical.

This pattern connects Merge Sort to external systems and distributed data processing.

## 26. Backend Applications

Merge-based reasoning appears in:

- external log processing;
- sorted event streams;
- batch pipelines;
- database merge operations;
- distributed sorted-run processing;
- large-file processing.

When data is already indexed or sortable in the database, application code should consider whether sorting can be delegated to the storage engine.

## 27. AI Applications

Merge-based techniques can support:

- merging ranked candidate streams;
- ordered evaluation data;
- external preprocessing;
- sorted dataset construction;
- distributed result aggregation.

For top-k streams, k-way merge can avoid materializing all candidates into one unsorted structure.

## 28. Parallelism

The independent recursive halves provide natural parallelism:

```text
sort left  ─┐
            ├→ merge
sort right ─┘
```

The merge remains a synchronization stage.

Parallel implementations must account for scheduling overhead, memory bandwidth, and synchronization costs.

## 29. Correctness Proof Structure

Prove:

### Base case
Sequences of size `0` or `1` are sorted.

### Inductive hypothesis
The recursive calls correctly sort both halves.

### Merge lemma
Merging two sorted sequences produces a sorted permutation of both.

### Conclusion
The merged result is a sorted permutation of the original sequence.

## 30. Common Mistakes

1. Incorrect midpoint/range boundaries.
2. Losing elements during merge.
3. Forgetting leftover elements.
4. Using the wrong tie rule and breaking stability.
5. Assuming slicing is free.
6. Misreporting auxiliary space.
7. Confusing in-place merge with ordinary buffered merge.
8. Incorrect recursive base case.
9. Infinite recursion from unchanged ranges.
10. Ignoring comparator consistency.

## 31. Edge Cases

Test:

- empty;
- singleton;
- two elements;
- odd lengths;
- even lengths;
- already sorted;
- reverse sorted;
- all equal;
- duplicate-heavy;
- very large arrays;
- object records with tied keys.

## 32. Testing Strategy

For every implementation verify:

```text
sortedness
permutation preservation
stability if promised
mutation contract
```

Use randomized differential testing against a trusted reference.

For merge specifically, verify that the output contains exactly the multiset union of both inputs.

## 33. Benchmarking

Measure:

- comparisons;
- allocations;
- copies;
- writes;
- recursion depth;
- elapsed time.

Compare top-down and bottom-up variants on representative workloads.

## 34. Interview Questions

1. Why is Merge Sort `O(n log n)`?
2. Derive its recurrence.
3. Why is the merge operation linear?
4. How does the tie rule provide stability?
5. Why does standard array Merge Sort require `O(n)` auxiliary memory?
6. How can you implement it iteratively?
7. What is external Merge Sort?
8. Why does k-way merge use a heap?
9. How can repeated `slice()` calls affect practical performance?
10. How would you parallelize Merge Sort?

## 35. Revision Checklist

- [ ] I can explain divide and conquer.
- [ ] I can implement merge independently.
- [ ] I can state the merge invariant.
- [ ] I can derive `T(n)=2T(n/2)+O(n)`.
- [ ] I can explain `O(n log n)` time.
- [ ] I understand `O(n)` auxiliary memory in the standard array version.
- [ ] I understand stable tie handling.
- [ ] I can explain bottom-up Merge Sort.
- [ ] I understand external and k-way merging.
- [ ] I can prove correctness by induction plus the merge lemma.

## 36. Key Takeaways

1. **Merge Sort solves sorting through divide, recursive sorting, and linear merging.**
2. **Its standard time complexity is `O(n log n)` in best, average, and worst cases.**
3. **The merge operation is linear because every element is consumed once.**
4. **A buffered array implementation normally uses `O(n)` auxiliary memory.**
5. **Stable tie handling makes standard Merge Sort stable.**
6. **Bottom-up Merge Sort removes recursion while retaining the core merge strategy.**
7. **Merge-based processing extends naturally to external sorting and k-way stream merging.**
8. **Its divide-and-conquer structure provides a natural foundation for parallel processing.**
9. **The deeper lesson is how a simple linear merge combines recursively solved subproblems into predictable scalable complexity.**
