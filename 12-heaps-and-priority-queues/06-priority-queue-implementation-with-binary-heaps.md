# 12.06 — Priority Queue Implementation with Binary Heaps

## Objective

This chapter turns the priority-queue ADT into a reusable binary-heap implementation. The emphasis is on API boundaries, comparator contracts, encapsulation, mutation, complexity, and production behavior.

## 1. Architecture

A heap-backed priority queue has two layers:

```text
Priority Queue API
        ↓
Binary Heap
        ↓
Array storage
```

The caller should reason about priorities and queue semantics rather than internal indexes.

## 2. Core API

A minimal implementation can expose:

```text
insert(value)
peek()
extract()
size()
isEmpty()
```

Optional operations include `clear`, `remove`, `updatePriority`, iteration, and handles.

## 3. Internal Representation

For zero-based arrays:

```text
parent(i) = floor((i - 1) / 2)
left(i)   = 2i + 1
right(i)  = 2i + 2
```

Only the internal heap owns these structural details.

## 4. Encapsulation

Do not expose the internal array as mutable public state unless the API explicitly intends to. External mutation can silently violate the heap invariant.

A controlled API preserves representation invariants.

## 5. Constructor Contract

A production queue should define:

- comparator;
- initial values, if supported;
- heap orientation through the comparator;
- empty behavior;
- tie-breaking behavior;
- mutation/ownership semantics.

## 6. Comparator Design

The comparator should define a consistent total or application-appropriate ordering.

A queue implementation should use the same comparator for every heap operation and validation path.

## 7. Min-Priority Queue

If smaller values represent higher priority, the comparator should make the smallest entry preferred by the heap.

## 8. Max-Priority Queue

If larger values represent higher priority, reverse the ordering convention consistently.

## 9. Insert

Insertion consists of:

```text
append entry
→ sift-up
```

The complete-tree shape is preserved by appending at the next available leaf position.

## 10. Peek

Peek returns the root without mutation:

```text
O(1)
```

The root represents the next extractable entry.

## 11. Extract

Extraction consists of:

```text
save root
→ move final entry to root
→ remove final slot
→ sift-down
```

Expected complexity is `O(log N)`.

## 12. Size Tracking

Size can be derived from the internal array length. If a separate counter is maintained, it becomes another invariant that must remain synchronized.

Prefer the simplest representation that satisfies requirements.

## 13. Empty Semantics

Define behavior explicitly for empty `peek` and `extract`. Returning `undefined` can be appropriate in JavaScript APIs, while throwing may be appropriate when absence indicates a programming error.

## 14. Duplicate Priorities

Duplicates are valid. The queue must define whether equal priorities may emerge in arbitrary order or require deterministic/stable handling.

## 15. Stable Ordering

To achieve FIFO behavior among equal priorities, wrap entries with a sequence number:

```text
{ priority, sequence, value }
```

The comparator uses priority first and sequence second.

## 16. Arbitrary Removal

A simple heap can locate an arbitrary value only by scanning:

```text
O(N)
```

If the API requires efficient removal by identifier, maintain an index map or handle structure and update indexes after every swap.

## 17. Priority Updates

If an entry's priority changes, the heap must be repaired. Depending on the direction of change, the entry may need sift-up or sift-down.

Mutating priority fields behind the queue's back is unsafe.

## 18. Handles

A handle identifies an entry independently of its current heap index. The implementation can map:

```text
handle → current index
```

Every swap must update this mapping correctly.

## 19. Swap Invariant

If handles are used, a swap is not merely an array operation. It is a coordinated state transition:

```text
array positions change
→ handle-to-index mapping changes
```

Forgetting the second update creates latent corruption.

## 20. Build from Initial Values

If the caller supplies a large initial batch, bottom-up construction gives:

```text
O(N)
```

instead of repeated `O(log N)` insertion.

## 21. API Method Complexity

Typical heap-backed queue:

| Operation | Complexity |
|---|---:|
| peek | O(1) |
| insert | O(log N) |
| extract | O(log N) |
| build from batch | O(N) |
| arbitrary scan/remove | O(N) without index map |

Priority update can be `O(log N)` when an efficient handle/index mapping exists.

## 22. JavaScript Implementation Considerations

JavaScript arrays provide convenient dynamic storage, but `push`/`pop` should be used for the end of the heap. Avoid operations such as `shift()` for root removal because they move many array elements.

The heap should move entries by index rather than repeatedly restructuring the front of the array.

## 23. Comparator Exceptions

If a comparator can throw, mutation semantics must be considered carefully. A partially completed operation can leave internal state changed before the exception occurs.

Production APIs should either constrain comparator behavior or design explicit exception-safety guarantees.

## 24. Allocation Behavior

A queue that wraps every value in a new object may create allocation and garbage-collection pressure. Stable queues and handle maps add additional metadata.

Measure this when queues become high-throughput infrastructure.

## 25. Memory Ownership

Decide whether the queue stores references to caller-owned objects or copies data. Storing references is efficient but means external mutation can affect comparator-visible state.

## 26. Iterator Semantics

Iterating the raw heap array does **not** yield sorted priority order. Heap order guarantees only parent-child constraints.

If ordered iteration is required, use extraction on a copy or another ordered data structure.

## 27. Destructive vs Non-Destructive Inspection

`peek()` is non-destructive. `extract()` is destructive. A method such as `toSortedArray()` should avoid destroying the queue unless explicitly documented.

## 28. Backend Application

A backend worker scheduler can wrap jobs as:

```text
{ priority, sequence, jobId, payload }
```

The queue controls ordering while the worker system handles execution, retries, persistence, and observability.

## 29. AI Application

An AI search frontier can store:

```text
{ score, state, parent, depth }
```

with a comparator based on search policy. The queue supplies efficient best-candidate extraction.

## 30. Testing Contract

Test the public API, not only internal helper functions. A correct implementation should preserve:

```text
size consistency
heap invariant
root priority
correct extraction multiset
```

across arbitrary operation sequences.

## 31. Reference Model

A useful test oracle can maintain a simple array and sort it before each extraction. This is slower but easier to reason about.

Compare the production queue against this reference over randomized operations.

## 32. Property-Based Testing

Generate random sequences such as:

```text
insert
insert
peek
extract
insert
update
extract
```

and assert invariants after each state transition.

## 33. Benchmarking

Benchmark realistic mixes rather than only isolated operations:

- insert-heavy;
- extract-heavy;
- balanced mixed workload;
- duplicate-heavy priorities;
- large objects;
- expensive comparators.

## 34. Production Failure Modes

Watch for:

- comparator inconsistency;
- leaked handles;
- stale index maps;
- unbounded queue growth;
- cancelled entries retained too long;
- external mutation of priority fields;
- expensive comparisons;
- unexpected garbage collection pauses.

## 35. Queue Depth and Backpressure

A heap provides ordering but does not solve overload. If producers outpace consumers, queue depth can grow indefinitely.

The surrounding system needs capacity and backpressure policy.

## 36. Observability

Useful metrics include:

```text
queue depth
insert rate
extract rate
wait time
oldest entry age
priority distribution
cancellation count
retry count
```

## 37. Correctness Proof Strategy

Prove the implementation in layers:

1. index formulas identify correct parent/children;
2. insert preserves completeness;
3. sift-up restores heap order;
4. extract preserves completeness;
5. sift-down restores heap order;
6. API methods preserve size and ownership invariants.

## 38. Interview Design Sequence

```text
Define ADT
→ define priority comparator
→ choose binary heap
→ implement insert/peek/extract
→ derive complexity
→ add stable ties if required
→ add handles if updates/cancellation matter
→ discuss concurrency, persistence and backpressure
```

## Revision Checklist

- [ ] I can implement a priority queue over a binary heap.
- [ ] I can keep the heap implementation encapsulated.
- [ ] I can explain every public operation's complexity.
- [ ] I understand stable priority ordering.
- [ ] I can reason about handles and index maps.
- [ ] I understand JavaScript array-specific performance concerns.
- [ ] I can test against a reference model.
- [ ] I can extend the queue for backend and AI workloads.

## Key Takeaways

1. **The priority queue API should hide heap indexes and representation details.**
2. **Insert and extract are local heap repairs with `O(log N)` complexity.**
3. **Handles make efficient update/cancellation possible but introduce additional invariants.**
4. **JavaScript implementation details such as `shift()`, object allocation, and comparator behavior affect real performance.**
5. **A production priority queue is an algorithm plus explicit contracts for mutation, ties, capacity, failure, and observability.**
