# 12.13 — Heap Sort: In-Place Sorting, Heap Construction & Performance Engineering

## Objective

Heap sort turns the heap data structure into a deterministic comparison-sorting algorithm. It combines bottom-up heap construction with repeated root extraction while using the input array itself as the primary storage.

## 1. Core Idea

For ascending order using a max-heap:

```text
build max-heap
→ largest element at root
→ move root to final position
→ shrink active heap
→ restore heap
→ repeat
```

## 2. Why Max-Heap for Ascending Order

The maximum element belongs at the end of an ascending array. Extracting the max root and placing it at the current right boundary naturally builds the sorted suffix.

## 3. In-Place Property

Standard heap sort uses the input array as the heap and does not require an auxiliary array proportional to `N`.

The algorithm therefore has `O(1)` auxiliary space when implemented iteratively apart from constant bookkeeping.

## 4. Phase One — Build Heap

Build the heap bottom-up by sifting down each internal node from the last parent toward the root.

For a binary heap this takes:

```text
O(N)
```

not `O(N log N)`.

## 5. Why Build-Heap Is Linear

Most nodes are near the leaves and can move only a small number of levels. Although an individual sift-down can cost `O(log N)`, the sum of all node heights is linear.

## 6. Phase Two — Sort Down

Repeatedly:

1. swap root with the final element of the active heap;
2. reduce heap size by one;
3. sift the new root down.

There are `N - 1` such iterations.

## 7. Complexity

For standard comparison-based heap sort:

```text
Build heap: O(N)
Sort-down:  O(N log N)
Total:      O(N log N)
Auxiliary:  O(1) iterative implementation
```

The asymptotic worst-case, average-case, and best-case comparison complexity are `O(N log N)` for the usual implementation.

## 8. Deterministic Worst Case

Unlike quicksort's ordinary partitioning strategy, heap sort does not depend on avoiding a bad pivot sequence to retain its `O(N log N)` worst-case bound.

## 9. Heap Boundary

The most important implementation detail is the distinction between:

```text
array.length
```

and

```text
activeHeapSize
```

The sorted suffix must not participate in later heap operations.

## 10. Sift-Down During Sorting

After placing the root at the end, only the new root can violate heap order. Sift-down repairs the active heap.

The sorted suffix remains untouched.

## 11. Ascending vs Descending

For ascending order, use a max-heap.

For descending order, use a min-heap.

The underlying algorithm is identical; only the comparator/heap orientation changes.

## 12. Comparator Design

A robust implementation should accept a comparator rather than hard-code numeric comparison.

For objects, define ordering explicitly and consistently.

## 13. Stability

Standard heap sort is **not stable**. Equal-key elements can change relative order because heap operations perform swaps.

If stability is required, attach original sequence positions to entries and use them as a deterministic tie-breaker. This creates a stable ordering contract, although the algorithm still needs careful handling of object identity and memory.

## 14. Heap Sort vs Built-In Sort

In JavaScript, production code should normally use the platform's optimized sorting facilities unless there is a specific reason to implement heap sort.

Heap sort remains important for understanding:

- heaps;
- complexity guarantees;
- in-place algorithms;
- comparator reasoning;
- interview problems.

## 15. Heap Sort vs Quicksort

| Property | Heap Sort | Typical Quicksort |
|---|---|---|
| Worst-case | O(N log N) | implementation-dependent; naive versions can reach O(N²) |
| Extra array | O(1) | often O(log N) stack, depending on implementation |
| Stable | No | Usually no |
| Cache locality | moderate | often strong |
| Core mechanism | heap | partitioning |

Actual performance depends heavily on implementation and runtime.

## 16. Heap Sort vs Merge Sort

Merge sort offers predictable `O(N log N)` time and can be stable, but ordinary array merge sort requires additional storage. Heap sort trades stability and locality for constant auxiliary space.

## 17. Cache Behavior

Heap sort repeatedly jumps between parent and child indexes. Although storage is contiguous, the access pattern is less sequential than many modern sorting implementations.

Therefore asymptotic space efficiency does not imply best wall-clock performance.

## 18. Branching and Comparisons

Each sift-down selects the preferred child and compares it with the current node. Comparator count can be a useful benchmark metric when comparisons are expensive.

## 19. D-Ary Heap Sort

Heap sort can theoretically use d-ary heaps, but the extraction phase becomes more expensive because selecting a child scans up to `d` candidates.

Binary heaps are the conventional choice for heap sort.

## 20. Bottom-Up Heap Construction

The last internal node in a zero-based binary heap is:

```text
floor((N - 2) / 2)
```

for `N >= 2`.

Process internal nodes in reverse order.

## 21. Correctness Invariant

During sorting, maintain two regions:

```text
[ active max-heap ][ sorted suffix ]
```

The active region satisfies heap order. Every element in the sorted suffix is already in its final ascending position and is at least as large as every element remaining in the active heap.

## 22. Sorting Proof

At each iteration:

1. the root is the maximum active element;
2. swapping it with the last active position places it in final position;
3. shrinking the heap excludes that final element;
4. sift-down restores heap order.

By induction, the sorted suffix grows by one correct element each iteration.

## 23. Edge Cases

Handle:

- empty array;
- one element;
- two elements;
- already sorted input;
- reverse-sorted input;
- all duplicates;
- negative numbers;
- `NaN` policy if numeric JavaScript data is accepted;
- object comparators;
- very large arrays.

## 24. Mutation Contract

Standard heap sort mutates the input array. A production API should document this clearly.

If mutation is unacceptable, copy the input first, changing the memory and time profile.

## 25. Exception Safety

If a user comparator throws during sorting, the array may already be partially rearranged. A strong rollback guarantee requires additional copying and therefore changes the space contract.

## 26. Benchmarking

Measure separately:

- build-heap time;
- sort-down time;
- total comparisons;
- swaps;
- array accesses;
- allocation count;
- peak memory;
- wall-clock latency.

Compare against relevant alternatives on identical datasets.

## 27. Backend Applications

Heap sort itself is less common than optimized library sorting in backend application code. Its principles remain useful when designing bounded-memory ordering routines, priority structures, and deterministic performance guarantees.

## 28. AI Applications

Heap-based selection is useful in AI pipelines for top-K candidates, beam/frontier management, and bounded priority collections. Full heap sort is appropriate when a complete deterministic ordering is required.

## 29. Partial Selection

If only the top `K` elements are required, fully sorting `N` elements may do unnecessary work. A heap of size `K` can often achieve:

```text
O(N log K)
```

for top-K selection, depending on the chosen heap orientation and output requirements.

## 30. Common Mistakes

1. Using the wrong heap orientation.
2. Forgetting to shrink the active heap boundary.
3. Sifting into the sorted suffix.
4. Claiming build-heap is `O(N log N)`.
5. Assuming heap sort is stable.
6. Ignoring comparator semantics.
7. Assuming `O(1)` auxiliary space guarantees fastest runtime.

## 31. Interview Framework

```text
Need in-place O(N log N) comparison sort
→ build heap in O(N)
→ repeatedly move root to final position
→ shrink active heap
→ sift down
→ total O(N log N)
→ auxiliary O(1) iteratively
→ not stable
→ discuss cache/performance trade-offs
```

## Revision Checklist

- [ ] I can derive heap sort from heap operations.
- [ ] I can explain why bottom-up heap construction is O(N).
- [ ] I can implement in-place heap sort.
- [ ] I can maintain the active-heap boundary.
- [ ] I can prove the sorted-suffix invariant.
- [ ] I know heap sort is not stable by default.
- [ ] I understand its space/performance trade-offs.
- [ ] I can explain when top-K selection is better than full sorting.

## Key Takeaways

1. **Heap sort is repeated heap extraction performed directly inside the input array.**
2. **Bottom-up heap construction is `O(N)`.**
3. **The complete sort is `O(N log N)` with `O(1)` auxiliary space in an iterative implementation.**
4. **The active heap boundary is central to correctness.**
5. **Heap sort's memory efficiency does not automatically make it the fastest practical sorting algorithm.**
