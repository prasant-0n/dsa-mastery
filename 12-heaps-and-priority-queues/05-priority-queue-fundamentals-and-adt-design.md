# 12.05 — Priority Queue Fundamentals & ADT Design

## Objective

A priority queue is an abstract data type in which removal is governed by priority rather than insertion order. This chapter separates the **ADT contract** from the data structure used to implement it.

## 1. What Is a Priority Queue?

A priority queue maintains a collection of entries and exposes operations such as:

```text
insert(entry)
peek()
extract()
isEmpty()
size()
```

`extract()` returns the entry with the highest priority according to a defined ordering.

## 2. Priority Is an Ordering Contract

Priority does not inherently mean a larger number. The application must define the ordering.

Examples:

```text
smaller number → higher priority
larger number  → higher priority
earliest time   → higher priority
```

The comparator is the executable form of this contract.

## 3. Priority Queue vs FIFO Queue

A FIFO queue removes the oldest eligible entry.

A priority queue removes the entry that is most preferred by the priority ordering.

These are different semantics even if both expose `enqueue` and `dequeue`-like methods.

## 4. ADT vs Implementation

The priority queue is an **abstract data type**. Possible implementations include:

- unsorted array;
- sorted array;
- linked list;
- binary heap;
- balanced search tree;
- specialized bucket/radix structures.

The correct implementation depends on the workload.

## 5. Operation Requirements

A useful specification defines:

| Operation | Meaning |
|---|---|
| insert | add an entry |
| peek | inspect next entry without removal |
| extract | remove and return next entry |
| size | number of entries |
| isEmpty | whether no entries exist |
| clear | remove all entries, if supported |

Optional capabilities include deletion by handle, priority update, iteration, and cancellation.

## 6. Binary Heap Implementation

A binary heap is the common general-purpose implementation because it provides:

```text
peek       O(1)
insert     O(log N)
extract    O(log N)
```

with `O(N)` bottom-up construction for an initial batch.

## 7. Unsorted Array

An unsorted array gives cheap insertion:

```text
insert → O(1) amortized
extract → O(N)
```

This can be appropriate when insertions dominate and extractions are rare.

## 8. Sorted Array

A sorted array can provide cheap extraction from one end, but insertion may require shifting elements:

```text
insert → O(N)
extract → O(1)
```

The workload determines whether this trade-off is useful.

## 9. Balanced Search Tree

A balanced ordered tree can support ordered operations and potentially arbitrary-key deletion efficiently. It is useful when the system needs more ordered queries than a basic priority queue provides.

## 10. Queue Contract and Tie-Breaking

Equal priorities require an explicit policy.

Possible policies:

- arbitrary order;
- FIFO among equal priorities;
- LIFO among equal priorities;
- secondary priority key;
- deterministic identifier ordering.

Never assume the heap itself provides stable equal-priority ordering.

## 11. Stable Priority Queue

A common solution is to attach a monotonically increasing sequence number:

```text
(priority, sequence)
```

The comparator first evaluates priority and then sequence.

## 12. Comparator Requirements

A production comparator should define a consistent ordering. It should be deterministic for unchanged entries and should handle all permitted values.

Ambiguous comparisons can break queue semantics.

## 13. Empty Queue Semantics

The API must define what happens when `peek` or `extract` is called on an empty queue.

Possible choices:

```text
return undefined
return null
throw an error
```

The important requirement is consistency with the documented contract.

## 14. Error Semantics

Invalid operations and invalid entries should have deliberate behavior. Do not allow accidental runtime exceptions to become the public API contract unless that behavior is intentional.

## 15. Ownership and Mutation

An in-memory priority queue usually owns its internal container. If an entry object is mutable, changing fields used by the comparator while the entry is inside the queue can invalidate ordering.

Priority mutation should therefore use an explicit update operation when supported.

## 16. Handles and Cancellation

Backend systems frequently need to cancel a queued job. Searching linearly for an entry can cost `O(N)`.

An implementation can maintain an external mapping from job ID to heap index or handle, enabling more efficient cancellation when the design supports index updates.

## 17. Lazy Cancellation

Another strategy is to mark jobs as cancelled and discard them when they reach the root.

This simplifies heap mutation but can increase memory retention and the number of stale entries processed later.

## 18. Delayed Work

A priority queue can represent scheduled work by using execution time as the priority:

```text
priority = nextRunAt
```

The root is the earliest due item.

## 19. Multiple Priority Dimensions

Real systems may use composite priorities:

```text
urgency
→ deadline
→ tenant fairness
→ enqueue sequence
```

The ordering policy should be explicit rather than scattered across callers.

## 20. Fairness

Pure priority scheduling can starve low-priority work. Production schedulers may use aging, quotas, weighted fairness, or multiple queues.

Priority queue mechanics alone do not guarantee fairness.

## 21. Backpressure

An unbounded priority queue can grow without limit when producers outpace consumers.

A production queue may therefore define:

- maximum size;
- rejection policy;
- blocking/backpressure policy;
- spill-to-disk behavior;
- load shedding.

## 22. Concurrency

A standard JavaScript heap is not automatically a concurrent priority queue. If multiple workers modify shared state, synchronization or an external coordination mechanism is required.

## 23. Persistence

An in-memory queue disappears on process failure. Durable job systems need persistence, recovery, visibility timeouts, or a transactional source of truth depending on requirements.

## 24. Backend Applications

Priority queues appear in:

- job schedulers;
- retry systems;
- delayed jobs;
- connection management;
- rate-limiting schedulers;
- timeout management;
- event simulation;
- task orchestration.

## 25. AI Applications

Priority queues are central to:

- best-first search;
- A* open sets;
- beam-search candidate management;
- top-K candidate selection;
- event-driven simulation;
- inference scheduling.

## 26. Complexity Selection

Choose an implementation by asking:

```text
What operation dominates?
How many entries exist?
Are priorities updated?
Are arbitrary deletions required?
Is stability required?
Is persistence required?
Is concurrency required?
```

Big-O should follow the workload model, not precede it.

## 27. Correctness Invariants

For a heap-backed priority queue:

1. the internal array represents a complete tree;
2. every parent satisfies the comparator relation with its children;
3. the root is the next extractable entry;
4. size equals the number of active entries.

## 28. Testing Strategy

Test operations independently and in randomized sequences. Compare extraction order against a trusted reference model such as a sorted multiset representation.

Include duplicates, cancellations, updates, empty operations, and adversarial priorities.

## 29. Benchmarking

Measure the workload that actually matters:

- insert throughput;
- extract throughput;
- mixed operation throughput;
- latency distribution;
- memory usage;
- comparator calls;
- queue depth.

Average throughput alone can hide tail-latency problems.

## 30. Interview Framework

When asked to design a priority queue:

```text
Define extract ordering
→ define tie policy
→ define operation contract
→ choose implementation
→ derive complexity
→ handle updates/cancellation
→ address memory/concurrency if relevant
```

## Revision Checklist

- [ ] I can define a priority queue as an ADT.
- [ ] I can distinguish ADT from implementation.
- [ ] I can compare unsorted and sorted arrays with heaps.
- [ ] I can define a comparator contract.
- [ ] I understand equal-priority semantics.
- [ ] I can reason about cancellation and priority updates.
- [ ] I can identify backend and AI applications.
- [ ] I can choose an implementation from workload requirements.

## Key Takeaways

1. **A priority queue is an ADT, not synonymous with a heap.**
2. **The comparator defines priority semantics.**
3. **Tie-breaking, cancellation, updates, capacity, and persistence are separate engineering decisions.**
4. **A binary heap provides a strong general-purpose complexity profile.**
5. **Production priority queues must be designed around workload and system requirements.**
