# 11.10 — Binary Heaps & Tree-Based Priority Structures

## 1. Objective

A binary heap is a complete binary tree maintained under a heap-order invariant. It provides an efficient priority-queue foundation for repeatedly retrieving the minimum or maximum element.

## 2. Heap Invariants

A min-heap satisfies:

```text
parent <= children
```

A max-heap satisfies:

```text
parent >= children
```

Completeness is the structural invariant; heap order is the value invariant.

## 3. Array Representation

Because a binary heap is complete, it can be stored compactly in an array.

For zero-based indexing:

```text
parent(i) = floor((i - 1) / 2)
left(i)   = 2i + 1
right(i)  = 2i + 2
```

No explicit node objects or child pointers are required.

## 4. Why Completeness Matters

Completeness guarantees height `Θ(log N)` and makes the array representation dense. This is the structural reason heap operations can remain logarithmic.

## 5. Peek

The root is the highest-priority element:

```text
min-heap → minimum
max-heap → maximum
```

Peek is `O(1)`.

## 6. Insert

Insert at the end to preserve completeness, then repeatedly swap the new element with its parent while heap order is violated.

This is called sift-up or bubble-up.

## 7. Extract Root

To remove the root:

1. move the final element to the root;
2. shrink the array;
3. sift the replacement downward until heap order is restored.

Complexity is `O(log N)`.

## 8. Sift-Up

Sift-up follows one rootward path. At each step, compare the node with its parent and swap when necessary.

The number of swaps is bounded by heap height.

## 9. Sift-Down

Sift-down follows one downward path. For a min-heap, compare both children and select the smaller child before deciding whether to swap.

Selecting the wrong child can violate the heap invariant even if the local comparison appears reasonable.

## 10. Heapify

Heapify transforms an arbitrary array into a heap.

Starting from the last internal node and sifting downward produces a heap in `O(N)` time.

## 11. Why Build-Heap Is O(N)

Not every node travels `O(log N)` levels. Most nodes are near the leaves and have very small possible sift-down distances.

The sum of these bounded heights is linear.

## 12. Heap Sort

Heap sort builds a heap and repeatedly extracts the root into its final position.

Typical complexity:

```text
Time: O(N log N)
Auxiliary space: O(1)
```

for an in-place implementation, subject to implementation details.

## 13. Min-Heap vs Max-Heap

The same structure supports either priority direction by changing the comparator.

A comparator-based implementation is preferable to duplicating the entire data structure.

## 14. JavaScript Implementation Concerns

JavaScript's standard `Array` is suitable for a heap backing store, but the implementation must manage indices explicitly.

Avoid relying on repeated `shift()` operations for a queue-like priority structure because they are not heap operations.

## 15. Priority Queue ADT

A priority queue typically exposes:

```text
insert
peek
extract
isEmpty
size
```

The heap is one implementation of this abstract data type.

## 16. Complexity Table

For a binary heap:

| Operation | Complexity |
|---|---|
| Peek | O(1) |
| Insert | O(log N) |
| Extract root | O(log N) |
| Build heap | O(N) |
| Search arbitrary value | O(N) |

Heap order does not provide binary-search-tree-style arbitrary lookup.

## 17. Arbitrary Search

A common mistake is assuming a heap can search for any value in `O(log N)`. The heap only guarantees ordering relative to parents/children, not a globally sorted sequence.

## 18. Heap Property Validation

A validator checks every parent against its children using the comparator.

This takes `O(N)` time and is an important debugging/reference operation.

## 19. Duplicate Values

Duplicates are valid unless the problem explicitly requires uniqueness.

The comparator should treat equivalent values consistently.

## 20. Custom Objects

A priority queue can store objects and compare them using a key:

```text
compare(a, b) = compare(a.priority, b.priority)
```

Tie-breaking can then include timestamp, sequence number, or ID.

## 21. Stable Priority Ordering

A binary heap does not inherently provide stable ordering for equal priorities.

If stability is required, attach a monotonically increasing sequence number and compare `(priority, sequence)`.

## 22. Decrease-Key

Many graph algorithms need to lower the priority of an existing item. A basic binary heap does not efficiently locate arbitrary items unless additional indexing is maintained.

## 23. Indexed Heap

An indexed heap maintains a mapping from item identity to heap position.

After swaps, the index map must be updated consistently.

This enables efficient priority updates and deletion by identity.

## 24. Lazy Deletion

An alternative is to insert a new priority record and ignore stale records when they reach the root.

This simplifies updates but may increase memory and extraction work.

## 25. Heap vs Balanced BST

A heap provides efficient access to the extreme priority element but poor arbitrary search.

A balanced BST provides ordered search, predecessor/successor, and range operations.

Choose based on the required operations rather than the abstract label of the data structure.

## 26. Heap vs Sorted Array

A sorted array offers `O(1)` access to an extreme element but insertion can cost `O(N)` due to shifting.

A heap trades ordered iteration for efficient dynamic insertion/extraction.

## 27. Kth / Top-K Problems

A heap is useful when only a small number of extreme elements are needed.

For top `K`, a min-heap or max-heap of bounded size can reduce memory and work compared with fully sorting all values.

## 28. K-Way Merge

A heap can maintain the smallest current element from each sorted source.

With `K` sources and `N` total elements:

```text
Time: O(N log K)
Space: O(K)
```

for the heap component.

## 29. Streaming Top-K

Maintain a heap containing the best `K` elements seen so far. Each new candidate can be compared against the heap root.

This is useful when the full stream cannot or should not be stored.

## 30. Backend Applications

Priority queues support:

- job scheduling;
- delayed work;
- retry queues;
- timeout management;
- event simulation;
- connection prioritization;
- rate-limit scheduling.

## 31. AI Applications

Heaps are foundational for:

- best-first search;
- beam search candidate selection;
- top-K retrieval;
- nearest-neighbor candidate queues;
- priority-based inference scheduling.

## 32. Correctness Proof

For insertion, prove:

1. placing the new item at the end preserves completeness;
2. all untouched parent-child relationships remain valid;
3. sift-up repairs the only possible violation along the ancestor path.

For extraction, prove the analogous replacement and sift-down invariant.

## 33. Amortized and Practical Considerations

A binary heap guarantees logarithmic worst-case insertion/extraction, but constant factors depend on comparisons, object movement, cache behavior, and allocation patterns.

## 34. Common Mistakes

1. Using the wrong child during sift-down.
2. Incorrect parent/child index formulas.
3. Forgetting to update indexed-heap metadata after swaps.
4. Assuming arbitrary search is logarithmic.
5. Implementing stable priority behavior without an explicit tie-breaker.
6. Calling `shift()` repeatedly instead of using heap extraction.
7. Claiming build-heap is `O(N log N)` without analyzing bottom-up heapify.

## 35. Edge Cases

Test:

- empty heap;
- one element;
- duplicate priorities;
- negative values;
- already-heapified input;
- reverse-ordered input;
- custom objects;
- equal-priority stability;
- repeated extraction;
- priority updates;
- very large heaps.

## 36. Testing Strategy

Use:

- heap-order invariant checks;
- extraction-vs-sorted-reference tests;
- random insertion/extraction sequences;
- build-heap differential tests;
- indexed-position consistency checks;
- top-K comparisons against full sorting;
- stress benchmarks.

## 37. Interview Framework

When asked about heaps:

```text
1. What is the priority rule?
2. Is the tree complete?
3. Can it use array storage?
4. Which operation dominates?
5. Is arbitrary lookup required?
6. Are priorities mutable?
7. Are equal priorities stable?
8. Is K small relative to N?
9. What is the comparator cost?
10. What are the time and space guarantees?
```

## 38. Revision Checklist

- [ ] I can derive heap index formulas.
- [ ] I can implement sift-up.
- [ ] I can implement sift-down.
- [ ] I understand build-heap `O(N)`.
- [ ] I can implement a priority queue.
- [ ] I understand arbitrary search is `O(N)`.
- [ ] I understand indexed heaps and lazy deletion.
- [ ] I can solve top-K and K-way merge problems.
- [ ] I can prove heap operations preserve invariants.
- [ ] I can explain backend and AI use cases.

## 39. Key Takeaways

1. **A binary heap combines complete-tree structure with a local parent-child ordering invariant.**
2. **The heap is optimized for extreme-priority access, not arbitrary ordered search.**
3. **Bottom-up heap construction is linear because most nodes have small possible sift-down distances.**
4. **Indexed and lazy-update techniques extend basic heaps to mutable-priority workloads.**
5. **Priority queues are a core primitive for scheduling, best-first search, top-K processing, and streaming systems.**
