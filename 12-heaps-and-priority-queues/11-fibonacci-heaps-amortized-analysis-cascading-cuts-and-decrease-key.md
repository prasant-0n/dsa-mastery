# 12.11 — Fibonacci Heaps: Amortized Analysis, Cascading Cuts & Decrease-Key

## Objective

Fibonacci heaps are a collection of heap-ordered trees designed to make several priority-queue operations extremely cheap in amortized analysis. Their defining ideas are a root list, lazy consolidation, `decrease-key`, cuts, and cascading cuts.

## 1. Structure

A Fibonacci heap maintains a collection of heap-ordered trees rather than one rigid tree.

The minimum element is tracked explicitly through a pointer/reference to the minimum root.

## 2. Heap-Order Invariant

Every node satisfies:

```text
parent is preferred over child
```

Unlike a binary heap, the forest does not need to be fully consolidated after every operation.

## 3. Root List

Roots are maintained in a circular doubly linked list in common implementations.

This makes adding a new root or concatenating root lists structurally inexpensive.

## 4. Make-Heap

Creating an empty Fibonacci heap initializes an empty root list and a null minimum pointer.

This is constant actual work.

## 5. Insert

A new singleton tree is added directly to the root list. If it is more preferred than the current minimum, update the minimum pointer.

The operation is `O(1)` amortized.

## 6. Meld

Two root lists can be concatenated directly and the minimum pointer updated.

This is `O(1)` actual work in the standard representation.

## 7. Peek-Min

The explicit minimum pointer makes inspection constant-time:

```text
O(1)
```

## 8. Lazy Consolidation

Fibonacci heaps postpone tree consolidation. Expensive restructuring is primarily performed during `extract-min`.

This laziness is what enables strong amortized bounds for other operations.

## 9. Extract-Min

The minimum root is removed. Its children are promoted to the root list, then roots of equal degree are repeatedly linked until the forest is consolidated.

## 10. Linking Trees

When two roots have the same degree, the less-preferred root becomes a child of the preferred root.

The preferred root's degree increases by one.

## 11. Consolidation Table

A temporary degree-indexed structure tracks one root per degree during consolidation.

Repeated equal-degree collisions cause linking until no duplicate degree remains in the temporary representation.

## 12. Decrease-Key

For a min-oriented Fibonacci heap, decreasing a node's key can violate its relationship with its parent.

If the node becomes more preferred than its parent, cut the node from its parent and add it to the root list.

## 13. Cut

A cut:

1. removes the node from its parent's child list;
2. decreases the parent's degree;
3. adds the node to the root list;
4. clears its parent reference;
5. resets its child-loss mark as appropriate.

## 14. Marking

Nodes can be marked to record whether they have already lost a child since becoming a child themselves.

This supports cascading cuts.

## 15. Cascading Cut

When a non-root node loses a child:

```text
if unmarked → mark it
if already marked → cut it and continue upward
```

The process stops at an unmarked node or the root.

## 16. Why Cascading Cuts Exist

Without cascading cuts, repeated child losses could create trees with poor structural properties. Cascading cuts control how much a node can lose before it is promoted to the root list.

## 17. Amortized Analysis

Fibonacci heaps are a canonical example of amortized data-structure analysis. A potential function accounts for root-list size and marked nodes so that cheap lazy operations accumulate potential used by future consolidation and cascading cuts.

## 18. Typical Amortized Bounds

For the standard Fibonacci-heap model:

```text
insert       O(1)
amortized
meld         O(1)
amortized
peek-min     O(1)
amortized
decrease-key O(1)
amortized
extract-min  O(log N)
amortized
```

`delete` can be implemented using `decrease-key` followed by `extract-min`, giving `O(log N)` amortized under the standard model.

## 19. Worst-Case vs Amortized

These are not statements that every individual operation always takes the displayed amount of time. In particular, an individual `extract-min` can perform substantial consolidation work.

## 20. Degree Bound

A crucial theoretical property is that node degrees remain logarithmically bounded in the number of nodes. This relies on the child-loss restrictions created by marking and cascading cuts.

## 21. Potential Function

A common potential has the form:

```text
Φ(H) = t(H) + 2m(H)
```

where `t(H)` is the number of trees in the root list and `m(H)` is the number of marked non-root nodes, under a suitable unit-cost model.

The exact proof should account for the chosen representation and operation sequence.

## 22. Why Insert Is Cheap

Insertion adds one root and increases the potential by approximately one unit. The actual operation is constant, while the accumulated potential pays for future consolidation.

## 23. Why Decrease-Key Is Cheap Amortized

Cuts add roots, increasing potential, while cascading cuts remove marks and can decrease potential. The potential change offsets the actual structural work across an operation sequence.

## 24. Why Extract-Min Is Expensive

Extraction removes a root and consolidates trees of equal degree. The operation can perform many links, but the root-list potential accumulated by previous lazy operations helps pay for this work.

## 25. Handles

Efficient `decrease-key` requires locating the node. A production implementation can expose a node handle or maintain an external identity-to-node mapping.

## 26. Pointer Representation

Common nodes contain:

```text
parent
child
left
right
degree
mark
key/value
```

This is substantially more metadata than an array-backed binary heap.

## 27. Memory Trade-Off

The theoretical asymptotic space is `O(N)`, but each node has several pointers and metadata fields. In JavaScript, object allocation and garbage collection can dominate practical performance.

## 28. Comparison with Pairing Heaps

Both are pointer-based mergeable heaps, but Fibonacci heaps provide stronger classical amortized guarantees for certain operations. Pairing heaps are considerably simpler and have strong practical appeal despite more subtle theoretical analysis.

## 29. Comparison with Binary Heaps

Binary heaps offer:

- compact contiguous storage;
- strong cache locality;
- simple implementation;
- predictable `O(log N)` insert/extract.

Fibonacci heaps offer stronger amortized bounds for meld and decrease-key but pay substantial structural complexity and memory costs.

## 30. Dijkstra Connection

Fibonacci heaps are historically important in theoretical analyses of Dijkstra's algorithm because frequent decrease-key operations can benefit from the `O(1)` amortized bound.

In practical software, simpler priority queues may still perform better because of locality and lower constants.

## 31. Backend Applications

Potential applications include systems with:

- frequent meld operations;
- explicit priority updates;
- large sequences of decrease-key operations.

For ordinary job queues, a binary or specialized heap is often simpler to operate and benchmark.

## 32. AI Applications

Fibonacci-heap concepts can be used to reason about search frontiers with many priority decreases, although practical AI implementations frequently use simpler structures or lazy duplicates.

## 33. Correctness Invariants

Maintain:

1. heap order;
2. correct parent/child relationships;
3. correct sibling links;
4. accurate degree counts;
5. minimum pointer identifies the preferred root;
6. root list contains only roots;
7. marks obey the defined child-loss semantics.

## 34. Cut Correctness

After a cut, the promoted node has no parent and belongs to the root list. The former parent has one fewer child and an updated degree. Heap order inside unaffected subtrees remains unchanged.

## 35. Cascading-Cut Correctness

Each recursive/iterative step either stops at a root or unmarked node, or promotes a marked node and continues upward. The process therefore terminates at the root boundary.

## 36. Testing Strategy

Test:

- insert sequences;
- repeated melds;
- extract-min consolidation;
- decrease-key on roots;
- decrease-key on children;
- repeated cascading cuts;
- duplicate priorities;
- stale handles;
- empty extraction.

## 37. Structural Testing

Verify every pointer in both directions:

```text
left.right === node
right.left === node
child.parent === node
```

when those relationships are defined by the representation.

## 38. Reference Model

Compare extraction order against a simple sorted reference collection. For update operations, apply the same semantic priority change to the reference model before comparing the next extraction.

## 39. Benchmarking

Measure:

- insert;
- meld;
- extract-min;
- decrease-key;
- allocations;
- memory;
- garbage collection;
- latency distribution.

Compare with binary and pairing heaps under identical workloads.

## 40. Common Mistakes

1. Forgetting to update the minimum pointer.
2. Corrupting circular sibling links during cuts.
3. Forgetting to update degree.
4. Applying the wrong marking rule.
5. Confusing amortized and worst-case bounds.
6. Ignoring handle lifetime.
7. Assuming theoretical advantages guarantee practical speed.

## 41. Interview Framework

```text
Need frequent meld/decrease-key
→ consider Fibonacci heap
→ maintain heap-ordered forest
→ lazy root-list operations
→ mark child losses
→ cascading cuts
→ consolidate during extract-min
→ analyze with potential function
→ compare practical overhead with simpler heaps
```

## Revision Checklist

- [ ] I can describe a Fibonacci heap as a forest of heap-ordered trees.
- [ ] I understand lazy consolidation.
- [ ] I can explain meld and insert.
- [ ] I can explain decrease-key and cuts.
- [ ] I understand cascading cuts and marking.
- [ ] I can distinguish amortized from worst-case complexity.
- [ ] I understand the potential-function idea.
- [ ] I can compare Fibonacci, pairing, and binary heaps.

## Key Takeaways

1. **Fibonacci heaps trade structural complexity for strong amortized bounds.**
2. **Lazy consolidation makes insert, meld, and decrease-key cheap amortized operations.**
3. **Cascading cuts control repeated child loss and preserve logarithmic degree bounds.**
4. **Extract-min performs the major deferred consolidation work.**
5. **Theoretical complexity must be evaluated alongside memory, locality, allocation, and implementation complexity.**
