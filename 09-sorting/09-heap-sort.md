# 09.09 — Heap Sort

## 1. Definition

Heap Sort sorts an array by organizing it as a binary heap, repeatedly extracting the extreme element, and placing it into its final position.

For ascending order, a max-heap is commonly used:

```text
build max heap
→ move maximum to the end
→ shrink heap
→ restore heap
→ repeat
```

## 2. Why It Matters

Heap Sort connects sorting with:

- complete binary trees;
- array-based tree representation;
- heap invariants;
- bottom-up heap construction;
- repeated extraction;
- guaranteed `O(n log n)` worst-case time;
- constant auxiliary array storage.

It also prepares you for Priority Queues and later heap patterns.

## 3. Array Representation

For zero-based indexing:

```text
parent(i) = floor((i - 1) / 2)
left(i)   = 2i + 1
right(i)  = 2i + 2
```

A heap is represented without explicit tree nodes.

## 4. Heap Property

A max-heap satisfies:

```text
parent >= children
```

A min-heap satisfies:

```text
parent <= children
```

The heap property is local, but it provides a global guarantee about the root.

## 5. Complete Tree Structure

A binary heap is a complete binary tree:

- every level except possibly the last is full;
- the last level is filled from left to right.

This shape is what allows compact array representation.

## 6. Heapify Mental Model

`heapify` repairs a possible violation at one node under the assumption that its child subtrees already satisfy the heap property.

For a max-heap:

1. compare node with children;
2. find the largest;
3. swap if necessary;
4. continue downward.

## 7. Sift Down

Heapify is often implemented as sift-down:

```text
node
 ↓
compare children
 ↓
select larger child
 ↓
exchange if child is larger
 ↓
continue
```

The process terminates when the node is already in the correct position or reaches a leaf.

## 8. Heap Invariant

During sift-down, the subtrees below the current node remain valid heaps while the possible violation moves downward.

Once no violating child exists, the entire affected subtree satisfies the heap property.

## 9. Build Heap

A naive approach inserts every element into a heap individually:

```text
n insertions × O(log n)
= O(n log n)
```

Bottom-up construction is better:

```text
start at last internal node
→ heapify backward to root
```

## 10. Why Build-Heap Is O(n)

Although individual heapify operations can cost `O(log n)`, most nodes are near the leaves and therefore have very small heights.

Summing the work over all internal nodes gives:

```text
O(n)
```

This is an important example where multiplying `n` by the worst cost of one operation gives an overly loose bound.

## 11. Heap Sort Algorithm

For ascending order with a max-heap:

1. build the max-heap;
2. swap the root with the final active position;
3. reduce heap size;
4. heapify the root;
5. repeat.

The suffix becomes sorted in ascending order.

## 12. Sorting Invariant

During extraction:

```text
heap region | sorted suffix
```

The heap region contains the remaining elements and satisfies the max-heap property.

The suffix contains the largest extracted elements in final sorted order.

## 13. Correctness

The heap root is the maximum remaining element.

Swapping it into the final active position therefore fixes the next largest element.

Heapify restores the heap property over the remaining region.

Repeated extraction grows the sorted suffix until all elements are fixed.

## 14. Complexity

Standard Heap Sort:

```text
Best:    O(n log n)
Average: O(n log n)
Worst:   O(n log n)
Auxiliary array storage: O(1)
```

The guaranteed worst-case time is a major property.

## 15. Why Extraction Is O(log n)

The heap height is:

```text
O(log n)
```

A root replacement can move down at most one root-to-leaf path.

Therefore each extraction costs `O(log n)`.

## 16. Total Sorting Cost

Build heap:

```text
O(n)
```

Extract approximately `n` elements:

```text
O(n log n)
```

Therefore:

```text
O(n) + O(n log n)
= O(n log n)
```

## 17. Stability

Standard Heap Sort is not stable.

Long-distance swaps can change the relative order of equal keys.

A stable heap-based sorting design requires additional mechanisms and should not be assumed from the heap property alone.

## 18. In-Place Behavior

Heap Sort can rearrange the input array in place.

Its auxiliary storage can remain:

```text
O(1)
```

apart from recursion if heapify is implemented recursively.

An iterative heapify can avoid recursive stack usage.

## 19. Recursive vs Iterative Heapify

Recursive heapify is often easier to read:

```text
heapify(node)
→ swap with child
→ heapify(child)
```

Iterative sift-down avoids recursion and provides explicit control over stack usage.

Both implement the same conceptual operation.

## 20. Comparator Design

For a reusable implementation, define the heap relation through a comparator rather than assuming numeric values.

Be precise about whether the comparator represents ascending order and whether the heap is max-oriented or min-oriented.

## 21. Example

Input:

```text
[4, 10, 3, 5, 1]
```

Build a max-heap, then repeatedly move the root to the end.

Conceptually:

```text
[max heap] | sorted suffix
```

After each extraction, the suffix grows by one element.

The exact intermediate heap depends on the heapify implementation.

## 22. Heap Sort vs Quicksort

| Property | Heap Sort | Quicksort |
|---|---|---|
| Typical model | Heap extraction | Partitioning |
| Worst time | O(n log n) | O(n²) |
| Average time | O(n log n) | O(n log n) under suitable assumptions |
| Auxiliary array storage | O(1) | O(1) partition storage |
| Recursive stack | Optional | Common unless engineered iteratively |
| Stability | Generally no | Generally no |
| Core invariant | Heap + sorted suffix | Partitioned ranges |

The comparison highlights different guarantees and mechanisms rather than a universal choice.

## 23. Heap Sort vs Merge Sort

Merge Sort commonly uses `O(n)` auxiliary memory for array sorting but offers predictable `O(n log n)` time and stable variants.

Heap Sort can achieve `O(1)` auxiliary array storage but is generally unstable.

The appropriate trade-off depends on memory, stability, workload, and implementation requirements.

## 24. Cache and Locality

Although Heap Sort uses an array, repeated tree-style jumps can produce less sequential access than algorithms that scan contiguous regions.

This illustrates why asymptotic complexity does not completely determine hardware performance.

## 25. Backend Applications

Heap-based reasoning is especially useful for:

- priority scheduling;
- top-k processing;
- event ordering;
- bounded priority queues;
- streaming ranking.

Heap Sort itself is less commonly needed than the heap data structure and its selection patterns.

## 26. AI Applications

Heaps are useful in AI systems for:

- top-k candidate selection;
- beam-style candidate management;
- priority-based search;
- bounded retrieval results;
- streaming score selection.

The key transferable concept is maintaining the relevant extreme efficiently.

## 27. Common Mistakes

1. Incorrect child index formulas.
2. Heapifying beyond the active heap boundary.
3. Using the wrong child comparison for max/min heaps.
4. Forgetting to reduce heap size after extraction.
5. Confusing build-heap `O(n)` with repeated insertion `O(n log n)`.
6. Claiming standard Heap Sort is stable.
7. Ignoring recursive heapify stack space.
8. Mixing ascending/descending heap conventions.
9. Using an inconsistent comparator.
10. Breaking the sorted suffix invariant.

## 28. Edge Cases

Test:

- empty;
- singleton;
- two elements;
- already sorted;
- reverse sorted;
- all equal;
- duplicate-heavy;
- negative numbers;
- large values;
- object records with equal keys.

## 29. Testing Strategy

Verify:

```text
sortedness
permutation preservation
heap property after build
heap property after each repair
sorted suffix after each extraction
```

A useful test isolates `heapify` independently from the full sorting algorithm.

## 30. Benchmarking

Measure:

- comparisons;
- swaps;
- sift-down steps;
- build-heap time;
- extraction time;
- maximum stack usage;
- elapsed time.

Compare against other algorithms using identical workloads.

## 31. Interview Questions

1. How is a binary heap represented in an array?
2. Why is heapify `O(log n)`?
3. Why is build-heap `O(n)`?
4. Why is Heap Sort `O(n log n)`?
5. Why can Heap Sort be in-place?
6. Why is it generally unstable?
7. What is the difference between max-heap and min-heap usage?
8. How does Heap Sort compare conceptually with Quicksort?
9. How can iterative heapify affect space usage?
10. Why is the heap data structure often more useful in backend systems than Heap Sort itself?

## 32. Revision Checklist

- [ ] I can derive parent/child array indices.
- [ ] I can implement max-heapify.
- [ ] I can implement bottom-up build-heap.
- [ ] I can explain why build-heap is O(n).
- [ ] I can implement Heap Sort from memory.
- [ ] I can state the heap + sorted-suffix invariant.
- [ ] I can derive O(n log n) total time.
- [ ] I understand auxiliary and stack space separately.
- [ ] I understand why standard Heap Sort is unstable.
- [ ] I can connect heaps to backend and AI top-k workloads.

## 33. Key Takeaways

1. **Heap Sort combines a binary heap with repeated extraction.**
2. **Bottom-up build-heap runs in O(n), not O(n log n).**
3. **Each extraction costs O(log n), producing O(n log n) total sorting time.**
4. **Heap Sort can be implemented with O(1) auxiliary array storage.**
5. **Standard Heap Sort is not stable.**
6. **Iterative heapify can eliminate recursive stack usage.**
7. **The heap structure is often more important in practice for priority and top-k workloads than Heap Sort itself.**
8. **Its deeper lesson is how a local heap invariant supports repeated global selection.**
