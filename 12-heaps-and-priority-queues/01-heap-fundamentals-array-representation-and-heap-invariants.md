# 12.01 — Heap Fundamentals, Array Representation & Heap Invariants

## 1. Objective

A **heap** is a tree-shaped data structure specialized for maintaining an extreme element—typically a minimum or maximum—while supporting efficient insertion and removal of that extreme.

This chapter builds the mental model required for later work with priority queues, heap sort, top-K problems, scheduling, graph algorithms, streaming systems, and AI search.

## 2. Why Heaps Exist

A sorted array keeps every element ordered, but maintaining that order can make insertion expensive. A heap preserves only the ordering information necessary to expose the minimum or maximum efficiently.

This is a central DSA trade-off:

```text
Full ordering  → more maintenance
Partial ordering → cheaper updates + fast extreme access
```

## 3. Heap Definition

A binary heap is a **complete binary tree** satisfying a heap-order property.

### Min-Heap

Every parent is less than or equal to its children.

```text
parent <= child
```

### Max-Heap

Every parent is greater than or equal to its children.

```text
parent >= child
```

The heap property is local; it does **not** mean the entire structure is sorted.

## 4. Complete Binary Tree

A complete binary tree fills every level completely except possibly the final level, which is filled from left to right.

Completeness matters because it allows a binary heap to be represented compactly in an array without explicit child pointers.

## 5. Array Representation

Using zero-based indexing:

```text
parent(i) = floor((i - 1) / 2)
left(i)   = 2i + 1
right(i)  = 2i + 2
```

For a node at index `i`, a child exists only when the calculated index is within the array bounds.

## 6. Example

A min-heap:

```text
        2
      /   \
     5     7
    / \   /
   9   8 10
```

can be stored as:

```text
[2, 5, 7, 9, 8, 10]
```

No node objects or child pointers are required.

## 7. Memory Model

An array-backed binary heap stores values contiguously. Compared with pointer-based trees, this generally reduces per-node metadata and improves locality for many workloads.

The logical tree exists through index arithmetic rather than object references.

## 8. Heap Invariant

For a min-heap, for every non-root index `i`:

```text
heap[parent(i)] <= heap[i]
```

For a max-heap:

```text
heap[parent(i)] >= heap[i]
```

The invariant is the primary correctness condition for every heap operation.

## 9. Root Semantics

The root is always an extreme element:

- min-heap → minimum value;
- max-heap → maximum value.

This gives root access in `O(1)` time when the heap is non-empty.

## 10. Core Operations

Typical binary-heap operations are:

| Operation | Typical Complexity |
|---|---:|
| Peek extreme | `O(1)` |
| Insert | `O(log N)` |
| Extract extreme | `O(log N)` |
| Build heap | `O(N)` |
| Heapify one node | `O(log N)` |
| Search arbitrary value | `O(N)` |

The exact complexity assumes a binary heap with constant-time comparison.

## 11. Insertion

Insertion proceeds conceptually as:

```text
1. Append the new value at the end.
2. Restore heap order by moving it upward.
```

The upward operation is commonly called **sift-up**, **bubble-up**, or **heapify-up**.

## 12. Sift-Up

Suppose a newly inserted value violates the parent relationship. Repeatedly compare it with its parent and swap while the heap property is violated.

The node moves upward at most the height of the heap.

For a complete binary tree:

```text
height = O(log N)
```

Therefore insertion is `O(log N)`.

## 13. Extracting the Extreme

To remove the root:

```text
1. Save the root.
2. Move the last element to the root.
3. Remove the final array slot.
4. Restore heap order downward.
```

The downward restoration is called **sift-down**, **bubble-down**, or **heapify-down**.

## 14. Sift-Down

For a min-heap, compare a node with its children and move it toward the smaller child when necessary.

For a max-heap, move it toward the larger child.

Choosing the correct child is essential. Swapping with an arbitrary violating child can leave another violation below it.

## 15. Why Height Is Logarithmic

A complete binary tree with height `h` has exponentially many possible nodes by level:

```text
1 + 2 + 4 + ... + 2^h
```

Thus:

```text
N = Θ(2^h)
h = Θ(log N)
```

This bounds sift-up and sift-down work.

## 16. Build-Heap

A naïve strategy inserts each element individually:

```text
N insertions × O(log N) = O(N log N)
```

But a more efficient bottom-up construction exists.

## 17. Bottom-Up Heap Construction

Start from the last internal node and sift-down each internal node toward the root.

Leaves already satisfy the heap property because they have no children.

The resulting build operation runs in **O(N)** time.

## 18. Why Build-Heap Is O(N)

Although individual sift-down operations can cost `O(log N)`, most nodes are near the leaves and can move only a small distance.

The aggregate work over all levels forms a convergent weighted sum, producing `O(N)` total work.

## 19. Heapify

A `heapify` operation restores the heap property for a subtree when its children already satisfy their own heap properties.

The operation follows a downward path and therefore costs `O(log N)` in the worst case.

## 20. Heap Is Not a Sorted Structure

A valid min-heap such as:

```text
[1, 4, 2, 9, 7, 5]
```

is not globally sorted.

What is guaranteed is only that every parent is no greater than its children.

This distinction is fundamental when deciding whether a heap or balanced ordered structure is appropriate.

## 21. Searching a Heap

Finding an arbitrary value is generally `O(N)` because heap order does not provide enough information to perform ordinary binary-search-style elimination.

Some pruning is possible under specific conditions, but a heap should not be treated as a general search index.

## 22. Min-Heap vs Max-Heap

Choose according to which extreme should be available:

```text
smallest first → min-heap
largest first  → max-heap
```

A priority queue can use either orientation depending on its scheduling policy.

## 23. Comparator Design

Production heaps should usually separate ordering from storage.

A comparator convention should be explicit, for example:

```text
compare(a, b) < 0 → a has higher priority than b
compare(a, b) = 0 → equivalent priority
compare(a, b) > 0 → b has higher priority
```

The comparator must be consistent throughout every heap operation.

## 24. Duplicate Values

Duplicates are valid. A heap does not require unique values.

When priorities tie, a secondary ordering may be introduced if deterministic behavior is required.

## 25. Stable Priority Queues

A normal heap does not automatically preserve insertion order for equal-priority elements.

If FIFO behavior among equal priorities is required, store an explicit sequence number:

```text
(priority, sequence)
```

and compare lexicographically.

## 26. JavaScript Implementation Considerations

JavaScript arrays are convenient for heap storage. Avoid relying on accidental comparator behavior. Define whether the heap stores raw values, objects, or entries with explicit priorities.

For production code, validate the empty-heap behavior and comparator contract.

## 27. Empty Heap Semantics

Decide explicitly what happens when extracting from an empty heap:

- return a sentinel;
- return `undefined`;
- return `null`;
- throw an error.

The choice is an API contract, not an algorithmic detail.

## 28. Complexity and Allocations

Asymptotic complexity does not capture all runtime cost. Repeated object allocation, comparator execution, array resizing, and expensive key extraction can affect real latency.

Benchmark the actual representation and workload.

## 29. Backend Applications

Heaps are foundational for:

- job scheduling;
- delayed jobs;
- retry queues;
- top-K APIs;
- rate-limit event ordering;
- timeout management;
- connection management;
- event simulation;
- priority-based task processing.

## 30. AI Applications

Heaps appear in:

- A* search open sets;
- best-first search;
- top-K candidate selection;
- beam-search candidate management;
- nearest-neighbor candidate queues;
- event-driven simulations;
- priority-based planning.

## 31. Heap vs Sorted Array

A sorted array gives:

- fast ordered iteration;
- binary search;
- direct indexing.

A heap gives:

- fast extreme access;
- efficient extreme insertion/removal;
- no need to maintain total order.

Choose based on the required operations.

## 32. Heap vs Balanced BST

A balanced BST generally supports ordered search and range queries, while a heap specializes in extreme-priority operations.

If arbitrary ordered lookup is central, a heap is usually the wrong abstraction.

## 33. Heap vs Hash Table

A hash table specializes in key-based lookup. A heap specializes in priority ordering.

They solve fundamentally different access problems and are often used together.

## 34. Correctness Proof Pattern

For insertion:

1. Appending preserves completeness.
2. Only the inserted node can initially violate the heap relation with its parent.
3. Sift-up swaps the node upward until the invariant is restored.
4. Existing heap relationships remain valid outside the traversed path.

For extraction:

1. Removing the final position preserves completeness after moving it to the root.
2. Only the moved root can initially violate heap order.
3. Sift-down restores the invariant along one root-to-leaf path.

## 35. Common Mistakes

1. Using the wrong child during sift-down.
2. Confusing heap order with sorted order.
3. Using `O(N log N)` as the only build-heap complexity.
4. Incorrect parent/child index formulas.
5. Forgetting duplicate priorities.
6. Mutating an entry's priority without reheapifying.
7. Using a comparator inconsistently.
8. Ignoring empty-heap behavior.

## 36. Edge Cases

Test:

- empty heap;
- one element;
- two elements;
- already valid heap;
- reverse-ordered input;
- all equal values;
- duplicate priorities;
- negative values;
- very large values;
- custom objects;
- expensive comparators.

## 37. Testing Strategy

At minimum:

- validate the heap invariant after every mutation in tests;
- compare extraction order with a sorted reference;
- test randomized insertion/extraction sequences;
- test bottom-up construction against repeated insertion;
- test custom comparator directions.

## 38. Benchmarking

Compare:

```text
buildHeap vs repeatedInsert
heap extraction vs sorted-array removal
min-heap vs max-heap workloads
primitive values vs object entries
cheap vs expensive comparators
```

Measure throughput, latency, allocations where possible, and memory behavior.

## 39. Interview Framework

When asked whether to use a heap:

```text
1. What is the required priority order?
2. Do I need only the extreme or arbitrary ordered access?
3. How often are inserts performed?
4. How often is the extreme removed?
5. Do priorities change after insertion?
6. Are ties meaningful?
7. What are N and Q?
8. What are the memory constraints?
```

## 40. Revision Checklist

- [ ] I can define a binary heap precisely.
- [ ] I understand completeness.
- [ ] I can derive parent/child array indexes.
- [ ] I can implement sift-up.
- [ ] I can implement sift-down.
- [ ] I understand why heap operations are `O(log N)`.
- [ ] I understand why bottom-up build is `O(N)`.
- [ ] I know why a heap is not sorted.
- [ ] I can design a comparator contract.
- [ ] I can choose heap vs BST vs hash table.
- [ ] I can explain backend and AI applications.

## Key Takeaways

1. **A heap preserves partial order, not total order.**
2. **Array representation makes a complete binary heap compact and efficient.**
3. **Sift-up and sift-down restore the heap invariant in `O(log N)`.**
4. **Bottom-up heap construction runs in `O(N)`, not `O(N log N)`.**
5. **Heaps are ideal when the workload repeatedly asks for the highest- or lowest-priority item.**
