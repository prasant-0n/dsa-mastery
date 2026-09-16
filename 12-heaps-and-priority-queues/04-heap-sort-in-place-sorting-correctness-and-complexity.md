# 12.04 — Heap Sort: In-Place Sorting, Correctness & Complexity

## Objective

Heap sort combines bottom-up heap construction with repeated extraction to produce a deterministic `O(N log N)` comparison sort. The important engineering ideas are heap invariants, shrinking the active heap, in-place mutation, correctness, and complexity.

## 1. Core Idea

For ascending order, build a **max-heap**. The largest element is then at the root. Repeatedly move that root to the end of the active array and restore the heap property over the remaining prefix.

```text
build max-heap
→ move maximum to final position
→ shrink heap
→ sift-down root
→ repeat
```

## 2. Active Heap Boundary

Heap sort uses one array but maintains two logical regions:

```text
[ active heap | sorted suffix ]
```

Only the active prefix participates in heap operations.

## 3. Why Max-Heap Produces Ascending Order

The maximum active value is at index `0`. Swapping it with the last active position places it at its final sorted location. Repeating this process fills the suffix from right to left.

## 4. Descending Order

For descending order, use the symmetric strategy with a min-heap.

## 5. Heap Construction

Use bottom-up build-heap rather than repeated insertion when the complete input is available.

```text
Build: O(N)
```

## 6. Extraction Phase

There are `N - 1` extraction-like iterations. Each iteration performs at most one sift-down across the active heap.

```text
O(log N) per iteration
```

Therefore:

```text
Extraction phase = O(N log N)
```

## 7. Overall Complexity

```text
Build heap      O(N)
Sort/extraction O(N log N)
---------------------------
Total           O(N log N)
```

## 8. Auxiliary Space

The standard iterative in-place implementation uses:

```text
O(1) auxiliary space
```

The input array itself is mutated.

## 9. Not Stable

Heap sort is generally **not stable**. Equal-key elements can change relative order through swaps.

If stability is required, encode a sequence number or choose a stable sorting algorithm instead.

## 10. Deterministic Worst-Case Bound

Heap sort guarantees `O(N log N)` comparison work regardless of the initial arrangement. Unlike quicksort's common simple implementations, it does not rely on avoiding a bad pivot sequence.

## 11. In-Place Does Not Mean No Mutation

In-place sorting means the algorithm uses constant auxiliary storage relative to `N`; it does not mean the original array remains unchanged.

An API requiring preservation must copy first, increasing memory use.

## 12. Active-Range Sift-Down

During sorting, the heap size decreases. Sift-down must never inspect the sorted suffix as if it were part of the heap.

The active boundary is therefore a correctness-critical parameter.

## 13. Correctness Invariant

At the beginning of every extraction iteration:

1. the active prefix is a valid max-heap;
2. the suffix is sorted;
3. every suffix element is greater than or equal to every active element.

After moving the root to the boundary and repairing the reduced prefix, the invariant remains true.

## 14. Correctness Proof

### Initialization

Build-heap establishes a valid max-heap and the sorted suffix is empty.

### Maintenance

The root is the maximum active element. Moving it to the final active position extends the sorted suffix. Sift-down restores the max-heap property over the reduced prefix.

### Termination

When one active element remains, it is necessarily in its final position. Therefore the whole array is sorted.

## 15. Termination

The active heap size decreases by one after every extraction. Since it begins at `N` and eventually reaches one, the loop terminates after a finite number of iterations.

## 16. Comparator Model

A generic heap-sort implementation can use a comparator describing the desired ordering. Be explicit about whether the comparator defines ascending or priority order and how the heap orientation is derived from it.

## 17. Edge Cases

Test:

- empty array;
- one element;
- two elements;
- already sorted input;
- reverse-sorted input;
- all equal values;
- duplicate-heavy input;
- negative values;
- custom objects;
- custom comparator.

## 18. Heap Sort vs Built-In Sort

In JavaScript applications, the platform's built-in sorting implementation is often preferable for normal application code because it is optimized and maintained by the runtime. Implement heap sort to understand the algorithm, meet specific constraints, or provide specialized behavior—not merely because it exists.

## 19. Heap Sort vs Quicksort

Heap sort provides a worst-case `O(N log N)` bound and constant auxiliary space in its classic form. Quicksort-family algorithms can have strong practical locality and are often faster in typical workloads, depending on implementation and runtime.

## 20. Heap Sort vs Merge Sort

Merge sort offers predictable `O(N log N)` behavior and can be stable, but conventional implementations require additional memory. Heap sort trades stability/locality for in-place constant auxiliary space.

## 21. Heap Sort vs Selection Sort

Both repeatedly place extreme elements, but selection sort scans the remaining region linearly for each position, producing `O(N²)`. Heap sort maintains the extreme efficiently.

## 22. Memory and Cache Behavior

Asymptotic space is excellent, but heap sort's non-sequential access pattern can have weaker cache locality than highly optimized array sorts. Real performance must be benchmarked.

## 23. Comparator Cost

If each comparison costs `O(C)`, heap sort requires approximately:

```text
O(C N log N)
```

comparison-related work.

This matters for object keys, normalization, locale-aware strings, or expensive derived values.

## 24. Backend Applications

Heap sort is useful when deterministic worst-case comparison sorting and in-place operation are explicit requirements. It is less commonly needed when the runtime already provides a highly optimized general-purpose sort.

## 25. AI Applications

Heap-based sorting concepts appear in candidate ranking and top-K pipelines. However, when only the top `K` elements are required, a size-`K` heap can avoid fully sorting all `N` candidates.

## 26. Top-K Connection

Full heap sort processes all elements. Top-K selection can maintain only the required frontier:

```text
O(N log K)
```

for a typical heap-based approach, when `K << N`.

## 27. Common Mistakes

1. Building the wrong heap orientation.
2. Forgetting to shrink the active boundary.
3. Sifting into the sorted suffix.
4. Returning the wrong order.
5. Assuming heap sort is stable.
6. Claiming build-heap costs `O(N log N)` as the optimal construction.
7. Forgetting that in-place sorting mutates the input.

## 28. Testing Strategy

Use a reference sort to validate results, plus invariant checks after each extraction during development.

Randomized differential testing should include adversarial and duplicate-heavy inputs.

## 29. Benchmarking

Measure separately:

- heap construction time;
- extraction/sort phase time;
- comparisons;
- swaps;
- memory;
- different input distributions.

Compare against relevant production alternatives rather than relying on Big-O alone.

## 30. Interview Derivation

A strong derivation is:

```text
Need sorted output
→ use heap to expose extremes
→ build heap in O(N)
→ move each extreme to final position
→ shrink active heap
→ restore heap in O(log N)
→ N iterations
→ O(N log N), O(1) auxiliary
```

## Revision Checklist

- [ ] I can derive heap sort from heap operations.
- [ ] I understand the active heap boundary.
- [ ] I can prove the sorting invariant.
- [ ] I can explain `O(N log N)` total complexity.
- [ ] I know why standard heap sort is not stable.
- [ ] I understand in-place mutation.
- [ ] I can compare heap sort with other sorting strategies.
- [ ] I know when top-K is preferable to full sorting.

## Key Takeaways

1. **Heap sort is heap construction plus repeated extreme extraction.**
2. **The active-prefix/sorted-suffix invariant is the central correctness idea.**
3. **Its worst-case time is `O(N log N)` and classic auxiliary space is `O(1)`.**
4. **Standard heap sort is not stable.**
5. **Algorithm choice should consider workload, locality, stability, mutation, and runtime-provided alternatives—not only asymptotic complexity.**
