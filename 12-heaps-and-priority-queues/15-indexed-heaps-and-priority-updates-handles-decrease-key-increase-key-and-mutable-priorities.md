# 12.15 — Indexed Heaps & Priority Updates: Handles, Decrease-Key, Increase-Key & Mutable Priorities

## Objective

An indexed heap combines a heap with an external mapping from logical item identity to its current heap position. This makes priority updates and arbitrary removal efficient without searching the entire heap.

## 1. The Problem

A normal binary heap can find the root efficiently, but locating an arbitrary item by identity may require `O(N)` search.

If priorities change frequently, that search can dominate the workload.

## 2. Indexed-Heap Mental Model

Maintain two structures:

```text
heap[]       → entries arranged by priority
indexById    → item identity → heap index
```

Both structures describe the same logical collection.

## 3. Core Invariant

For every active entry:

```text
indexById[id] = its current position in heap[]
```

Conversely, every heap position must map back to the correct identity.

## 4. Why Swaps Are Special

A heap swap changes two physical positions. Therefore every swap must also update both affected entries in `indexById`.

Forgetting this creates a data structure that may appear heap-correct while its index map is corrupt.

## 5. Insert

Insertion is:

```text
append entry
→ record index
→ sift up
→ update index map after every swap
```

Complexity is `O(log N)`.

## 6. Peek

The root is still available in `O(1)`.

## 7. Extract Root

Extraction swaps the root with the final active entry, removes the final entry, deletes its identity mapping, and sifts the new root down.

Complexity is `O(log N)`.

## 8. Lookup by ID

The index map provides direct physical location:

```text
id → heap index
```

Expected lookup is `O(1)` when backed by a hash map.

## 9. Decrease-Key

For a min-heap, decreasing a priority can only create a violation with the parent. Therefore:

```text
update value
→ sift up
```

Complexity is `O(log N)`.

## 10. Increase-Key

For a min-heap, increasing a priority can only create a violation with a child. Therefore:

```text
update value
→ sift down
```

Complexity is `O(log N)`.

## 11. Generic Update

If the new priority can move in either direction, compare the new entry with its parent and children, then choose the necessary repair direction.

A common strategy is:

```text
if parent violates → sift up
else → sift down
```

## 12. Arbitrary Removal

With an index map:

```text
id → index
→ swap with final entry
→ remove mapping
→ repair locally
```

The repair costs `O(log N)`.

## 13. Replace-At

Replacing the priority at a known index is equivalent to a generic priority update followed by local heap repair.

## 14. Stable Handles

A handle can contain an immutable logical identifier rather than a physical index. This is safer because physical indices change after swaps.

The handle should resolve through the index map.

## 15. Why Storing the Index in the Handle Is Dangerous

If a handle stores only:

```text
index = 17
```

another heap operation may move that item to index `5`. The handle becomes stale.

Use stable identity plus an index map, or update handles on every swap.

## 16. Identity Requirements

Identifiers should be unique within the heap. Define behavior for:

- duplicate IDs;
- missing IDs;
- stale handles;
- deleted items;
- reused IDs.

## 17. Tombstone vs Immediate Deletion

Some systems mark entries as cancelled and skip them during extraction. This can simplify cancellation but increases heap size and requires periodic cleanup.

Indexed deletion removes entries structurally but requires correct map maintenance.

## 18. Mutable Objects

Avoid changing an object's priority field directly without notifying the heap. The heap cannot automatically know that its ordering changed.

Prefer explicit APIs such as:

```text
updatePriority(id, newPriority)
```

## 19. Comparator Contract

The comparator must provide a consistent ordering. Priority updates are only correct when comparisons before and after mutation obey the same ordering semantics.

## 20. Duplicate Priorities

Equal priorities require a defined tie policy. A sequence number can provide deterministic FIFO behavior among equal priorities.

## 21. Composite Priorities

A priority may contain multiple dimensions:

```text
priority
→ deadline
→ sequence
→ id
```

The comparator should encode the complete ordering contract.

## 22. Complexity Summary

For an indexed binary heap:

| Operation | Expected/Typical Cost |
|---|---:|
| peek | O(1) |
| lookup by ID | O(1) expected |
| insert | O(log N) |
| extract | O(log N) |
| decrease-key | O(log N) |
| increase-key | O(log N) |
| arbitrary remove | O(log N) |
| build | O(N) heapify + index construction |

The map's expected `O(1)` operations depend on the hash-table implementation and key-processing cost.

## 23. Memory Complexity

The heap requires `O(N)` storage and the index map requires another `O(N)` logical mapping. Constant factors are higher than a plain heap.

## 24. Correctness Invariant

Maintain both:

```text
heap-order invariant
index-bijection invariant
```

Correctness requires both simultaneously.

## 25. Swap Primitive

The safest implementation centralizes swaps:

```text
swap(i, j)
→ swap heap entries
→ update index of entry at i
→ update index of entry at j
```

Every movement operation should use this primitive.

## 26. Transactional Updates

A priority update should not leave the heap partially repaired if the comparator fails. Production implementations should define mutation/error semantics, especially when comparisons can execute user code.

## 27. Lazy Cancellation

A practical backend queue may use IDs and cancellation flags rather than immediate arbitrary deletion. The trade-off is simpler cancellation versus retained stale entries.

## 28. Backend Applications

Indexed heaps are useful for:

- schedulers with reschedulable jobs;
- timeout managers;
- delayed queues;
- retry scheduling;
- connection/request deadlines;
- task cancellation;
- priority updates.

## 29. AI Applications

Useful for:

- search frontiers with mutable costs;
- dynamic beam candidates;
- best-first search with improved paths;
- A* open sets;
- candidate queues whose scores change.

## 30. A* and Decrease-Key

When a better path to an existing node is found, an indexed open set can update that node's priority directly rather than inserting an indistinguishable duplicate.

An alternative is **lazy duplicate insertion**, where improved entries are inserted and stale entries are discarded later. Indexed updates save duplicates at the cost of more bookkeeping.

## 31. Indexed Heap vs Lazy Duplicates

| Strategy | Advantage | Trade-off |
|---|---|---|
| Indexed update | bounded logical entries | map/bookkeeping complexity |
| Lazy duplicates | simpler heap operations | stale entries increase memory/work |

The appropriate choice depends on workload and implementation constraints.

## 32. Testing Strategy

Test every mutation while checking both invariants after each operation.

Particularly test:

- swap-heavy sequences;
- root updates;
- leaf updates;
- arbitrary removals;
- duplicate priorities;
- missing IDs;
- stale handles.

## 33. Differential Testing

Compare extraction order against a reference priority map. For every operation, update the reference model and verify the indexed heap produces the same logical behavior.

## 34. Property Testing

Useful properties include:

```text
lookup(id) returns the actual entry
indexById[id] points to that entry
all active IDs are unique
heap-order holds
extract sequence is sorted by comparator
```

## 35. Benchmarking

Measure separately:

- lookup;
- insert;
- extract;
- priority update;
- arbitrary removal;
- map overhead;
- allocations;
- memory;
- comparator count.

Compare indexed and non-indexed heaps under the same workload.

## 36. Common Mistakes

1. Updating heap entries without updating the index map.
2. Treating a physical index as a stable identity.
3. Forgetting to delete an extracted ID.
4. Repairing in the wrong direction.
5. Allowing duplicate IDs accidentally.
6. Mutating priority fields outside the heap API.
7. Ignoring stale handles.

## 37. Interview Framework

```text
Need efficient arbitrary priority updates
→ normal heap cannot locate arbitrary item efficiently
→ maintain ID → heap-index map
→ centralize swap bookkeeping
→ update priority
→ sift up or down
→ O(log N) update
→ O(1) expected lookup
→ discuss memory and lazy-duplicate alternatives
```

## Revision Checklist

- [ ] I can explain why a plain heap cannot efficiently locate arbitrary entries.
- [ ] I understand the heap/index-map invariant.
- [ ] I can implement a swap that preserves both structures.
- [ ] I can implement decrease-key and increase-key.
- [ ] I can remove an arbitrary item by ID.
- [ ] I understand stable handles.
- [ ] I can compare indexed updates with lazy duplicates.
- [ ] I can apply indexed heaps to backend and AI systems.

## Key Takeaways

1. **An indexed heap combines heap ordering with identity-to-position mapping.**
2. **The index map turns arbitrary lookup into expected `O(1)`.**
3. **Priority updates and arbitrary removal become `O(log N)` once the item is located.**
4. **Every heap swap must keep the index map synchronized.**
5. **Indexed heaps are especially useful for mutable priorities, schedulers, A*, and other update-heavy workloads.**
