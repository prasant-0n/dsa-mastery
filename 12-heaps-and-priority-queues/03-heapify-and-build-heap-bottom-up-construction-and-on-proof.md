# 12.03 — Heapify & Build-Heap: Bottom-Up Construction and O(N) Proof

## 1. Objective

This chapter explains how an arbitrary array becomes a valid binary heap and why the optimal bottom-up construction runs in `O(N)` time rather than `O(N log N)`.

## 2. The Problem

Given:

```text
values[0 ... N-1]
```

with no ordering guarantee, construct a min-heap or max-heap in place.

## 3. Two Construction Strategies

### Repeated insertion

Start with an empty heap and insert each element:

```text
N × O(log N) = O(N log N)
```

### Bottom-up construction

Treat the array as a complete binary tree and repair internal nodes from the bottom upward.

```text
O(N)
```

## 4. Why Leaves Need No Work

Every leaf has no children. Therefore its subtree already satisfies the heap-order condition regardless of its value.

Only internal nodes need heapify.

## 5. Last Internal Node

With zero-based indexing, the last internal node is:

```text
floor(N / 2) - 1
```

All indexes after this position are leaves.

## 6. Bottom-Up Algorithm

Conceptually:

```text
for i = floor(N / 2) - 1 down to 0:
    siftDown(i)
```

Each child subtree has already been made into a valid heap before its parent is processed.

## 7. Heapify Precondition

For a node `i`, assume both child subtrees are valid heaps. The only possible violation is at `i`.

Sift-down restores the heap property for the entire subtree rooted at `i`.

## 8. Correctness by Induction

Process nodes from the deepest internal level toward the root.

### Base case

Nodes whose children are leaves can be heapified because their child subtrees are already valid.

### Inductive step

When processing node `i`, every descendant subtree has already been repaired. Sift-down therefore restores the invariant for `i`'s entire subtree.

### Conclusion

After processing index `0`, the complete array is a valid heap.

## 9. Why O(N) Is Possible

The key insight is that **not every node can move `O(log N)` levels**.

Most nodes are near the bottom and can move only a few levels.

```text
many nodes → tiny work
few nodes   → larger work
```

The total is linear.

## 10. Height Distribution

In a complete binary tree:

- about `N/2` nodes are leaves;
- about `N/4` nodes are one level above leaves;
- about `N/8` nodes are two levels above leaves.

The number of nodes decreases geometrically as possible sift-down distance increases.

## 11. O(N) Summation

A conceptual bound is:

```text
N/4 × 1
+ N/8 × 2
+ N/16 × 3
+ ...
```

Factor out `N`:

```text
N × (1/4 + 2/8 + 3/16 + ...)
```

The remaining infinite series converges to a constant, so total work is `O(N)`.

## 12. Alternative Height-Based View

If nodes of height `h` require at most `h` downward steps and there are approximately `N / 2^(h+1)` such nodes:

```text
Σ h × N / 2^(h+1) = O(N)
```

This gives the formal intuition behind linear build time.

## 13. Why Repeated Insertion Is Different

Repeated insertion pays for a full root-to-leaf restoration for many elements, including elements that could have been repaired more cheaply from the bottom.

Bottom-up construction exploits the already-valid structure of lower subtrees.

## 14. In-Place Construction

Bottom-up heap construction can rearrange the original array without requiring another array of size `N`.

Typical auxiliary space for an iterative implementation is:

```text
O(1)
```

excluding the input storage itself.

## 15. Min-Heap Build

For a min-heap, each sift-down selects the smaller child whenever a violation exists.

The final root is the global minimum.

## 16. Max-Heap Build

For a max-heap, each sift-down selects the larger child.

The final root is the global maximum.

## 17. Heapify vs Build-Heap

These terms are related but should be distinguished:

- **heapify/sift-down** → repair one subtree under suitable preconditions;
- **build-heap** → apply bottom-up repairs to transform the complete array into a heap.

## 18. Complexity Model

For `N` elements:

```text
Bottom-up build: O(N)
time
Auxiliary space: O(1) iterative
```

If comparisons cost `C`, the comparison work scales accordingly.

## 19. Comparator Cost

The standard bound assumes constant-time comparisons. If comparison costs `O(C)`:

```text
Build cost = O(NC)
```

for the corresponding linear number of comparisons up to constant factors.

## 20. Mutation Semantics

An in-place build destroys the original array ordering. If the caller needs the original sequence, clone it first.

This is an API and ownership decision, not merely an implementation detail.

## 21. Stability

Heap construction does not create a stable ordering for equal priorities. If stability is required, encode a sequence number into each entry before building.

## 22. Duplicate Values

Duplicates do not prevent heap construction. Equality simply means no ordering violation exists between those values.

## 23. Building from Objects

When objects are stored, heapify operates on comparator-defined priority rather than object identity.

Example entry:

```js
{ priority: 5, sequence: 17, value: job }
```

## 24. Production Memory Considerations

For large arrays, in-place construction avoids a second full heap allocation. This can reduce peak memory pressure compared with constructing a separate heap and copying values.

## 25. Build-Heap vs Sorting

Heap construction alone does not sort the array. Heap sort uses repeated extraction after building the heap.

The construction stage is only the first part.

## 26. Backend Application

When a service receives a batch of jobs and needs to process them by priority, bottom-up construction can turn the batch into a priority queue in `O(N)` time.

This is useful when the initial batch is known all at once.

## 27. AI Application

A search system that receives an initial batch of candidate states can build a priority frontier efficiently rather than inserting each state independently.

This can reduce initialization cost for large frontiers.

## 28. Correctness Invariant

At the start of processing index `i`, every processed descendant subtree is already a valid heap.

After `siftDown(i)`, the subtree rooted at `i` becomes valid without invalidating already-processed descendant subtrees.

## 29. Edge Cases

Test:

- empty array;
- one value;
- two values;
- all equal values;
- already valid heap;
- reverse-sorted input;
- random input;
- large arrays;
- custom comparators.

## 30. Differential Testing

Compare:

```text
bottom-up build
vs
repeated insertion
```

Then repeatedly extract from both and compare the resulting priority sequence.

## 31. Benchmarking

Measure:

- build time;
- number of comparisons;
- swaps/moves;
- allocations;
- peak memory;
- behavior across input distributions.

The comparison count is particularly useful when explaining why bottom-up construction is linear.

## 32. Common Mistakes

1. Starting heapify from the wrong index.
2. Processing nodes from root to leaves.
3. Assuming every node costs `O(log N)`.
4. Forgetting that leaves require no heapify.
5. Using the wrong child during sift-down.
6. Accidentally creating an `O(N)` copy when an in-place contract was intended.

## 33. Interview Proof

A concise interview explanation:

> Leaves are already heaps. Process internal nodes from the last one toward the root. When a node is processed, both child subtrees are already heaps, so one sift-down repairs that subtree. Although a single sift-down can cost `O(log N)`, most nodes are close to leaves; the weighted height sum is linear. Therefore build-heap is `O(N)`.

## 34. Revision Checklist

- [ ] I know the last internal-node index.
- [ ] I can derive bottom-up heap construction.
- [ ] I understand why leaves require no work.
- [ ] I can prove correctness by induction.
- [ ] I can explain why build-heap is `O(N)`.
- [ ] I can distinguish it from repeated insertion.
- [ ] I understand in-place memory behavior.
- [ ] I can apply it to backend and AI batch frontiers.

## Key Takeaways

1. **Bottom-up construction exploits already-valid child subtrees.**
2. **Only internal nodes need heapify.**
3. **The weighted height distribution of a complete tree makes total build work `O(N)`.**
4. **In-place build can use `O(1)` auxiliary space.**
5. **The `O(N)` result comes from aggregate analysis, not from claiming every heapify is constant time.**
