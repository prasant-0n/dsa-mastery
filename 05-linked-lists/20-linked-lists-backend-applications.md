# 05.20 — Linked Lists in Backend Applications

## Purpose

This chapter connects linked-list fundamentals to practical backend engineering. The goal is not to force linked lists into production systems, but to recognize the specific backend workloads where stable node identity, O(1) local mutation, ordering, and explicit ownership are useful.

---

## 1. Where Linked Lists Fit

Linked lists are usually **in-memory implementation details** inside a larger component.

Common backend combinations include:

```text
HashMap + Doubly Linked List
Queue + Linked Nodes
Scheduler + Ordered Nodes
Object Pool + Free List
```

The surrounding system determines correctness and durability.

---

## 2. LRU Cache

The classic backend example is:

```text
Map<key, node>
        ↓
Doubly Linked List
MRU ← ... → LRU
```

### Operations

- `get` → map lookup + move node to front
- `set` → insert/update + move to front
- eviction → remove tail + delete map entry

Expected lookup and known-node movement are O(1).

---

## 3. LRU Invariants

A correct implementation maintains:

```text
map.size === list.size
```

and every map entry points to exactly one list node.

For every doubly linked node:

```text
node.next.prev === node
node.prev.next === node
```

Boundary conditions must also hold.

---

## 4. FIFO Work Queue

A linked queue with both endpoints provides:

```text
enqueue → O(1)
dequeue → O(1)
peek    → O(1)
```

Typical backend uses:

- background jobs;
- in-process task queues;
- request buffering;
- retry candidates;
- worker coordination.

---

## 5. Backpressure

A queue should not automatically be unbounded.

Define:

```text
capacity
on-full behavior
producer policy
consumer policy
shutdown policy
```

Possible full-queue policies include rejection, dropping, blocking, or external persistence.

---

## 6. Cancellation by Identity

Suppose a request waits in a queue and can be cancelled.

With:

```text
Map<requestId, node>
```

cancellation can find the node directly and remove it from a doubly linked queue in O(1) after lookup.

Without an index, finding the request may require O(N) traversal.

---

## 7. Timeout Queues

A simple ordered linked list can maintain timeout entries:

```text
earliest → ... → latest
```

It is attractive for small workloads because the implementation is simple.

For large workloads, heaps or specialized timing structures often provide better asymptotic insertion behavior.

---

## 8. Scheduler Design

Choose based on scheduling semantics:

| Requirement | Candidate |
|---|---|
| FIFO | Queue |
| Priority | Heap |
| Earliest deadline | Heap/timing structure |
| Known-task cancellation | Map + linked list |
| Bounded FIFO | Ring buffer |
| Ordered range queries | Tree/index |

A linked list is one component, not the universal scheduler.

---

## 9. Retry Queues

Backend systems frequently retry failed work.

A retry item may contain:

```text
jobId
attemptCount
nextAttemptAt
payload/reference
```

The queue must also define duplicate handling and retry ownership.

For durable retries, use durable infrastructure rather than relying on a process-local list.

---

## 10. Connection and Resource Tracking

A doubly linked structure can track active resources when known objects need efficient removal:

```text
connection → node
```

When a connection closes, a direct node reference can allow O(1) removal.

A separate map may provide lookup by connection ID.

---

## 11. Free Lists and Object Reuse

A free list tracks reusable objects:

```text
freeHead → node → node → node
```

A resource pool can move objects between:

```text
available
active
```

states.

The implementation must reset ownership-sensitive fields before reuse.

---

## 12. Producer–Consumer Architecture

A queue can decouple producers from workers:

```text
producer → queue → worker
```

But a production system also needs:

- capacity limits;
- fairness policy;
- shutdown semantics;
- metrics;
- failure handling;
- retry policy.

The linked list only represents the queue state.

---

## 13. Undo / Redo State

A doubly linked structure can represent a history:

```text
past ⇄ current ⇄ future
```

Moving backward or forward changes the current position.

However, if history must survive process failure, store it in durable storage rather than only in memory.

---

## 14. Session or Activity Ordering

A backend may maintain an ordered in-memory set of active sessions or tasks.

A linked list is useful when:

- order matters;
- objects already exist;
- direct removal is frequent;
- random indexing is unnecessary.

Otherwise an array or another ordered structure may be simpler.

---

## 15. Combining Hashing and Linking

This pattern is worth memorizing:

```text
Hash table → locate object
Linked list → maintain order
```

The hash table answers:

> Where is the object?

The linked list answers:

> Where does the object sit in this ordering?

This separation of responsibilities is the foundation of many cache and scheduling designs.

---

## 16. Node Identity

Stable identity matters when other components hold references to an object.

Example:

```text
request object
     ↓
queue node
```

With an intrusive design, the request can itself carry linkage fields.

With a wrapper design, the map can point to the wrapper.

Choose deliberately based on ownership and API boundaries.

---

## 17. API Contract

A backend linked container should specify:

```text
insert semantics
remove semantics
duplicate policy
ownership
capacity
error behavior
mutation behavior
shutdown behavior
```

Ambiguous contracts are more dangerous than pointer syntax.

---

## 18. Concurrency

Do not assume a linked queue is thread-safe because its pointer operations are simple.

Determine whether the system uses:

```text
single-threaded ownership
message passing
locks
atomics/shared memory
```

Use established concurrency primitives where possible.

---

## 19. Distributed Boundary

A process-local linked list cannot provide:

- durable delivery;
- cross-process ownership;
- distributed ordering;
- retry persistence.

For those requirements, use appropriate databases, streams, or message brokers and treat the linked list as local working state.

---

## 20. Idempotency

A job may be retried after a timeout or process failure.

Use stable identifiers and idempotent business operations where possible.

The queue's data structure does not guarantee exactly-once business effects.

---

## 21. Observability

Useful queue/cache metrics include:

```text
current size
maximum size
wait time
throughput
rejection count
hit/miss ratio
allocation rate
error count
```

For latency-sensitive systems, inspect p50, p95, and p99 where appropriate.

---

## 22. Security and Resource Limits

Never allow untrusted traffic to create unbounded in-memory state without policy.

Consider:

- maximum queue depth;
- maximum cache size;
- payload limits;
- timeout limits;
- admission control;
- eviction policy.

Resource limits are part of backend correctness.

---

## 23. Testing Strategy

Test at multiple levels.

### Unit

Pointer operations and boundary cases.

### Property

Random operation sequences against a reference model.

### Integration

Map/list consistency and worker interaction.

### Load

Realistic operation mixes and queue depths.

### Failure

Cancellation, retries, shutdown, rejection, and partial failures.

---

## 24. Reference Model

A simple array can act as a correctness oracle for many queue/list APIs.

Example:

```text
linkedQueue operations
        ↓
reference array operations
        ↓
compare observable behavior
```

The production implementation can be optimized while the reference remains intentionally simple.

---

## 25. Performance Model

When evaluating a backend linked structure, consider:

```text
Big-O
allocation count
GC behavior
cache locality
pointer chasing
contention
serialization cost
I/O
```

Often the dominant cost is not the pointer operation itself.

---

## 26. AI Backend Example

An inference service might maintain:

```text
Map<requestId, request>
+
Doubly Linked Pending Queue
```

This can support:

- FIFO processing;
- direct cancellation;
- request lookup;
- bounded capacity;
- queue-depth metrics.

At higher scale, the durable/distributed queue should normally live outside the process.

---

## 27. Choosing Alternatives

Use an array when:

```text
sequential traversal + indexing dominate
```

Use a ring buffer when:

```text
bounded FIFO + locality dominate
```

Use a heap when:

```text
priority/deadline ordering dominates
```

Use a hash table when:

```text
key lookup dominates
```

Use a tree when:

```text
ordered search/range queries dominate
```

---

## 28. Production Checklist

Before shipping a linked-list-backed backend component:

```text
[ ] workload defined
[ ] operations defined
[ ] invariants documented
[ ] ownership documented
[ ] capacity bounded
[ ] failure behavior defined
[ ] concurrency model defined
[ ] observability added
[ ] property tests added
[ ] load tested
[ ] alternatives compared
```

---

## 29. Common Mistakes

1. Using a linked list because insertion is theoretically O(1).
2. Forgetting the hash-map/list consistency problem.
3. Building an unbounded in-memory queue.
4. Treating local queues as durable.
5. Ignoring cancellation.
6. Ignoring ownership and external references.
7. Assuming GC solves retention problems.
8. Implementing custom concurrency unnecessarily.
9. Benchmarking pointer operations instead of the workload.
10. Ignoring simpler alternatives such as arrays or ring buffers.

---

## Revision Checklist

- [ ] Design an LRU cache.
- [ ] Design a cancellable FIFO queue.
- [ ] Explain `Map + Linked List` architecture.
- [ ] Design a bounded work queue.
- [ ] Explain backpressure.
- [ ] Design a retry queue.
- [ ] Design a free list.
- [ ] Explain ownership and node identity.
- [ ] Separate local state from durable infrastructure.
- [ ] Explain idempotency and retries.
- [ ] Design reference-model tests.
- [ ] Compare linked lists with arrays, ring buffers, heaps, and trees.
- [ ] Design an AI inference request queue.

# Key Takeaways

1. Backend linked lists are usually local implementation details inside larger systems.
2. `Map + Doubly Linked List` is the canonical LRU/cancellable-ordering pattern.
3. Queue capacity and backpressure are essential for production systems.
4. Stable node identity can make cancellation and direct removal efficient.
5. Local linked structures do not provide durability or distributed coordination.
6. Correctness requires ownership, invariants, failure semantics, and observability.
7. Benchmark complete workloads, including allocation and runtime effects.
8. Arrays, ring buffers, heaps, hash tables, trees, and brokers may be better depending on the workload.
