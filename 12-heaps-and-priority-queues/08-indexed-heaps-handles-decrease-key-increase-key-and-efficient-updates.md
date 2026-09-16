# 12.08 — Indexed Heaps: Handles, Decrease-Key, Increase-Key & Efficient Updates

## Objective

A normal binary heap is excellent at finding the next priority, but arbitrary updates require locating an entry first. An **indexed heap** augments the heap with a mapping from an external identifier or handle to the entry's current heap position.

## 1. The Problem

Suppose a heap contains a job with ID `job-42`. Finding that job by scanning the heap costs `O(N)`.

An indexed heap maintains:

```text
jobId → heap index
```

so the entry can be located directly.

## 2. Core Operations

Typical indexed-heap operations are:

```text
insert
peek
extract
remove(handle)
update(handle, value)
decreaseKey(handle, value)
increaseKey(handle, value)
```

The index map is an auxiliary structure supporting efficient addressing.

## 3. Complexity

With a hash-based handle-to-index map:

```text
peek          O(1)
insert        O(log N)
extract       O(log N)
update        O(log N)
remove        O(log N)
```

The expected `O(1)` lookup for the handle is followed by a logarithmic heap repair.

## 4. Handle Abstraction

A handle should identify an entry independently of its current heap position.

The key insight is:

```text
handle is stable
index is mutable
```

The heap may move the entry many times while the handle remains valid.

## 5. Why Store the Index?

A heap's ordering changes during swaps. An external ID does not tell you where the entry currently lives.

The index map bridges semantic identity and physical storage location.

## 6. Swap Is a Compound Operation

In a normal heap:

```text
swap(array[i], array[j])
```

In an indexed heap:

```text
swap entries
→ update handle[i]
→ update handle[j]
```

Failing to update the map creates stale locations.

## 7. Handle Invariant

For every active handle `h`:

```text
indexMap[h] = i
heap[i].handle = h
```

Both directions must agree.

## 8. Insert

Insertion requires:

1. append entry;
2. register handle at the appended index;
3. sift-up;
4. update the map on every swap.

## 9. Extract

Extraction requires:

1. identify root;
2. move final entry to root;
3. remove the final slot;
4. delete the extracted handle from the map;
5. update the moved handle's index;
6. sift-down.

## 10. Remove by Handle

Removal is structurally similar to extraction from an arbitrary index:

```text
locate index from handle
→ replace with last entry
→ delete last slot
→ update moved handle
→ repair upward or downward
```

The repair direction depends on the replacement's relationship with its parent and children.

## 11. Choosing Repair Direction

After replacing index `i`, first check whether the new value violates the parent relation. If so, sift-up. Otherwise, check children and sift-down if required.

## 12. Decrease-Key

For a min-heap, decreasing a key makes an entry more preferred. It may violate the parent relation, so sift-up is the natural repair.

For a max-heap, the direction is reversed.

## 13. Increase-Key

For a min-heap, increasing a key makes an entry less preferred. It may violate a child relation, so sift-down is the natural repair.

Again, max-heap behavior is symmetric.

## 14. Generic Update

A generic update should compare old and new values under the comparator and select the repair direction from the resulting ordering.

Do not assume every update moves in one direction.

## 15. Atomic Update Semantics

An update should behave as one logical operation from the caller's perspective:

```text
locate
→ validate new value
→ mutate
→ repair
→ publish final state
```

The implementation must avoid exposing an intermediate invalid state through callbacks or reentrant behavior.

## 16. Duplicate Handles

Handles must have a uniqueness policy. Duplicate identifiers make a one-to-one index map ambiguous.

Reject duplicate handles or define an explicit multi-entry mapping.

## 17. Stale Handles

After extraction or removal, the handle is no longer active. A later update using that handle should follow the documented contract, such as returning failure or throwing.

## 18. Handle Lifetime

Handles should not accidentally remain valid forever. Reusing an identifier can create ABA-style confusion if old handles are indistinguishable from new ones.

A generation number can help when handle identity must survive reuse.

## 19. Hash Map Choice

JavaScript's `Map` is a natural structure for handle-to-index mapping when handles are arbitrary values.

A plain object is less suitable for general identifiers because of key coercion and prototype-related semantics.

## 20. Memory Overhead

An indexed heap requires additional metadata:

```text
heap storage: O(N)
index map:    O(N)
```

The asymptotic space remains `O(N)`, but constants are larger than for a plain heap.

## 21. Alternative: Entry Stores Index

An entry can contain its current index, but the heap still needs a way to locate the entry from its external identity. The two-direction mapping problem does not disappear.

## 22. Alternative: Search on Update

If updates are rare, scanning the heap may be simpler:

```text
lookup O(N)
repair O(log N)
```

Indexed heaps are justified when update/cancellation frequency makes the extra metadata worthwhile.

## 23. Dijkstra Connection

Shortest-path implementations often need `decrease-key` semantics for frontier nodes. An indexed priority queue can provide efficient location and priority updates.

Many practical implementations instead use lazy duplicate insertion, which trades memory and stale entries for simpler code.

## 24. Lazy Duplicate Strategy

Instead of updating an existing heap entry:

```text
insert new candidate
→ leave old candidate in heap
→ discard stale candidate when extracted
```

This can be simpler, but queue size may grow and stale entries increase extraction work.

## 25. Indexed vs Lazy Design

The choice depends on workload:

```text
frequent updates + bounded memory
→ indexed approach may help

simple implementation + tolerant memory usage
→ lazy duplicates may be attractive
```

The algorithmic contract should drive the decision.

## 26. Backend Application

A job scheduler can maintain:

```text
jobId → heap index
```

for cancellation, priority changes, or rescheduling.

This is useful when queued jobs are addressed by stable IDs.

## 27. AI Application

Search algorithms can maintain state identifiers or node handles for frontier updates. Indexed priority structures can support explicit score changes when the algorithm requires them.

## 28. Concurrency

A handle-to-index map is only safe when heap and map updates are coordinated. Concurrent mutation requires synchronization appropriate to the execution model.

## 29. Persistence

An index map is derived state. If the heap is persisted, recovery must either reconstruct the map or persist enough information to rebuild it safely.

## 30. Correctness Proof

Maintain two linked invariants:

1. heap order is valid;
2. handle-to-index mapping is bijective over active entries.

Every mutation must preserve both.

## 31. Testing Strategy

Use a reference map and reference priority multiset. After every operation verify:

```text
map → heap
heap → map
heap invariant
active handle count
extraction order
```

## 32. Randomized Testing

Generate sequences containing:

```text
insert
update
increase-key
decrease-key
remove
extract
```

and compare with a simple reference model.

## 33. Adversarial Tests

Specifically test:

- repeated updates of one entry;
- updating root;
- updating a leaf;
- removing last element;
- removing root;
- removing an arbitrary middle entry;
- duplicate priorities;
- stale handles;
- duplicate handles;
- many swaps.

## 34. Benchmarking

Measure mixed workloads rather than update operations alone. Track:

- heap comparisons;
- swaps;
- map operations;
- memory;
- queue latency;
- stale-entry rate for lazy alternatives.

## 35. Common Mistakes

1. Updating the heap but not the index map.
2. Updating one side of the map relationship only.
3. Choosing the wrong repair direction.
4. Reusing stale handles incorrectly.
5. Forgetting to remove extracted handles.
6. Claiming worst-case `O(1)` for a hash-map lookup without qualification.

## 36. Interview Framework

```text
Need efficient arbitrary update
→ scanning costs O(N)
→ maintain handle → index
→ update map during swaps
→ locate in expected O(1)
→ repair heap in O(log N)
```

Then discuss the memory trade-off and lazy-update alternative.

## Revision Checklist

- [ ] I can explain why a plain heap cannot efficiently locate arbitrary entries.
- [ ] I understand the handle-to-index invariant.
- [ ] I can implement index updates during swaps.
- [ ] I can derive decrease-key and increase-key directions.
- [ ] I can remove an arbitrary entry in `O(log N)` after lookup.
- [ ] I understand indexed vs lazy priority updates.
- [ ] I can apply indexed heaps to backend and AI systems.

## Key Takeaways

1. **Indexed heaps add an identity-to-position mapping to a normal heap.**
2. **Every swap must update both heap storage and index metadata.**
3. **Efficient handle lookup enables `O(log N)` updates and removals after expected `O(1)` lookup.**
4. **Decrease-key and increase-key are directional heap repairs.**
5. **Indexed heaps trade memory and implementation complexity for efficient arbitrary updates.**
