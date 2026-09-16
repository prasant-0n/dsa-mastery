# 12.09 — D-Heaps & Generalized Heaps: Branching Factor, Trade-offs & Engineering

## Objective

A binary heap is a special case of a **d-ary heap**, where every node can have up to `d` children. Increasing the branching factor changes tree height, child-selection work, memory locality, and the practical cost of priority-queue operations.

## 1. D-Ary Heap Model

A d-ary heap is a complete tree with at most `d` children per node and a heap-order invariant between every parent and child.

Binary heap:

```text
d = 2
```

Ternary heap:

```text
d = 3
```

and so on.

## 2. Zero-Based Array Representation

For a d-ary heap, one common zero-based layout is:

```text
parent(i) = floor((i - 1) / d)
```

For a parent index `p`, its children occupy:

```text
d*p + 1 ... d*p + d
```

Only indexes below the active heap size are valid children.

## 3. Binary Heap as a Special Case

Setting `d = 2` gives the familiar binary formulas:

```text
left  = 2p + 1
right = 2p + 2
```

The generalized model therefore preserves the same fundamental heap reasoning.

## 4. Height

A d-ary heap has height approximately:

```text
O(log_d N)
```

Larger `d` means fewer levels.

## 5. Insert Complexity

Sift-up follows one parent path, so insertion is approximately:

```text
O(log_d N)
```

comparisons/levels, assuming constant-time parent access.

As `d` grows, the height decreases.

## 6. Extract Complexity

Extraction requires selecting the preferred child among up to `d` children at every level.

Therefore the trade-off is approximately:

```text
O(d log_d N)
```

The height decreases with `d`, but each downward step examines more children.

## 7. Why Larger d Is Not Automatically Better

Reducing tree height does not guarantee faster extraction. Each level becomes more expensive because the preferred child must be selected from a larger set.

The useful question is:

```text
fewer levels × more child comparisons
```

not simply “smaller height.”

## 8. Child Selection

For a min-heap, inspect all existing children and select the minimum according to the comparator.

For a max-heap, select the maximum.

The child-selection loop is the main additional cost compared with a binary heap.

## 9. Index Arithmetic

The generalized formulas make implementation sensitive to integer arithmetic and boundary checks. Every child index must satisfy:

```text
child < heapSize
```

before accessing the array.

## 10. Last Internal Node

Leaves begin after the last index that has at least one child. A practical implementation can derive the final internal index from `N` and `d` rather than scanning the array.

## 11. Build-Heap

Bottom-up construction still works for d-ary heaps. Process internal nodes from the deepest level toward the root and sift each node down.

The asymptotic construction remains linear in `N` for fixed `d`.

## 12. Build Complexity with Variable d

When `d` is treated as a parameter rather than a constant, child-selection cost becomes relevant. For a fixed engineering choice of `d`, the build remains `O(N)` under the standard model.

## 13. Memory Layout

D-ary heaps remain contiguous arrays. This avoids per-node object pointers and can provide compact storage.

The trade-off is that wider child scans can increase memory accesses per sift-down step.

## 14. Cache and Locality

Children of a node occupy a contiguous range in the array. A larger `d` therefore makes each child-selection scan more contiguous, but the scan itself touches more entries.

Actual cache behavior should be measured on the target runtime and hardware.

## 15. Choosing d

There is no universally optimal branching factor. Consider:

- insertion/extraction ratio;
- heap size;
- comparator cost;
- cache behavior;
- update frequency;
- hardware/runtime;
- benchmark results.

## 16. Insert-Heavy Workloads

A larger `d` can reduce sift-up height, which may help when insertions dominate and extraction child selection is less frequent.

## 17. Extract-Heavy Workloads

Extraction examines multiple children per level. A smaller `d` may reduce per-level selection cost even though the heap is taller.

The actual balance depends on the workload.

## 18. Priority Updates

Indexed d-ary heaps can support handle-based updates just like indexed binary heaps. The repair path has fewer levels, while extraction has wider child selection.

## 19. Decrease-Key

For a min d-ary heap, decreasing a key moves the entry toward the root using the same parent relation:

```text
while preferred over parent:
    swap upward
```

The generalized branching factor does not change the conceptual algorithm.

## 20. Increase-Key

For a min d-ary heap, increasing a key may require sift-down. At each level, choose the preferred child among up to `d` candidates.

## 21. D-Heaps vs Binary Heaps

| Property | Binary | D-Ary |
|---|---|---|
| Branching | 2 | d |
| Height | O(log N) | O(log_d N) |
| Sift-up | fewer comparisons per level | same parent comparison |
| Sift-down | 2-child selection | d-child selection |
| Storage | array | array |
| Main trade-off | balanced | height vs child scan |

## 22. Priority Queue Applications

D-ary heaps can be useful when a workload strongly favors operations whose cost benefits from reduced height, such as repeated insertions or decrease-key-heavy workloads.

## 23. Shortest-Path Algorithms

D-ary heaps have historically been considered for graph shortest-path workloads because decrease-key and extract-min frequencies can make branching-factor trade-offs important.

The correct choice remains workload- and implementation-dependent.

## 24. Backend Application

A scheduler processing very large volumes of newly arriving jobs can evaluate a d-ary heap if insertion performance and memory locality are important. Benchmark against the binary baseline before adopting it.

## 25. AI Application

Search frontiers with frequent insertions and score updates can potentially benefit from generalized heaps. The useful branching factor depends on frontier size and comparator behavior.

## 26. Correctness Invariant

For every active node and every valid child:

```text
parent is preferred over child
```

The branching factor changes the number of children, not the fundamental ordering invariant.

## 27. Sift-Down Invariant

Before each iteration, every child subtree is a valid heap. Only the current node may violate heap order.

Select the best child, swap when required, and continue the violation down one level.

## 28. Testing Strategy

Test multiple values of `d`:

```text
d = 2
3
4
8
16
```

and compare extraction order against a trusted sorted reference.

## 29. Boundary Tests

Include:

- `N = 0`;
- `N = 1`;
- `N < d`;
- `N = d`;
- exactly one child at the final internal node;
- duplicate priorities;
- very large `d`;
- custom comparators.

## 30. Benchmarking

Benchmark each `d` using the same workload and record:

- insert latency;
- extract latency;
- comparison count;
- swaps;
- memory accesses where measurable;
- total throughput;
- tail latency.

## 31. Comparator Cost

If comparisons are expensive, scanning `d` children can become significant. A smaller branching factor may reduce comparison work even if it increases heap height.

## 32. Common Mistakes

1. Using binary child formulas for a d-ary heap.
2. Forgetting the `heapSize` boundary.
3. Assuming larger `d` always improves performance.
4. Selecting the wrong child among `d` candidates.
5. Forgetting that `d` affects both height and per-level work.

## 33. Interview Derivation

```text
Generalize binary tree
→ each node has d children
→ parent(i) = floor((i-1)/d)
→ height = O(log_d N)
→ sift-up follows one parent path
→ sift-down scans up to d children per level
→ extraction ≈ O(d log_d N)
```

Then discuss the workload-dependent engineering trade-off.

## Revision Checklist

- [ ] I can derive d-ary heap indexes.
- [ ] I can implement sift-up and sift-down for arbitrary `d`.
- [ ] I understand `O(log_d N)` height.
- [ ] I understand the `d` factor in sift-down.
- [ ] I can compare binary and d-ary heaps.
- [ ] I can reason about cache and comparator costs.
- [ ] I can evaluate branching factor using benchmarks.

## Key Takeaways

1. **A binary heap is simply a 2-ary heap.**
2. **Increasing `d` reduces height but increases child-selection work.**
3. **Sift-down is approximately `O(d log_d N)` for a d-ary heap.**
4. **The best branching factor depends on workload, comparator cost, and hardware behavior.**
5. **Generalized heaps are an engineering trade-off, not an automatic optimization.**
