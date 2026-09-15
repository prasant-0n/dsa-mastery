# 06.08 — Queue Implementations, Circular Buffers & Amortized Performance

> **Phase 06 — Stacks, Queues & Deques**
>
> This chapter goes beneath the Queue ADT and studies implementation mechanics: dynamic head-index queues, circular buffers, resizing, amortized analysis, memory behavior, invariants, and production performance.

---

# 1. Learning Objectives

You should be able to:

- derive queue implementation mechanics from the FIFO contract;
- implement a robust dynamic array-backed queue;
- implement a fixed-capacity circular buffer;
- implement a dynamically growing circular queue;
- distinguish logical positions from physical indices;
- derive wrap-around formulas;
- analyze resize costs with amortized reasoning;
- understand capacity, size, head, and tail invariants;
- reason about memory retention and reference release;
- compare circular and linked representations;
- design production queues for throughput, latency, and bounded memory.

---

# 2. Representation State

A high-quality array queue commonly stores:

```text
buffer
head
size
capacity
```

where:

```text
head = physical index of logical front
size = number of live elements
capacity = buffer length
```

The logical element at position `i` is stored at:

```text
(head + i) % capacity
```

This formula is the foundation of circular-buffer reasoning.

---

# 3. Why Tail Is Sometimes Derived

The next insertion position can be derived as:

```text
(head + size) % capacity
```

Therefore an implementation does not always need an independent `tail` field.

Fewer mutable fields can mean fewer synchronization and invariant bugs.

General principle:

> If a value can be safely derived from authoritative state, avoid storing a second mutable copy unless it provides a measurable benefit.

---

# 4. Circular Buffer Mental Model

Imagine a ring:

```text
        [0]
     /       \
   [3]       [1]
     \       /
        [2]
```

After the physical end, logical indexing wraps to zero.

For capacity `C`:

```text
next(i) = (i + 1) % C
previous(i) = (i - 1 + C) % C
```

The addition of `C` in the previous-index formula avoids negative modulo behavior.

---

# 5. Enqueue Mechanics

For a queue with available capacity:

```text
writeIndex = (head + size) % capacity
buffer[writeIndex] = value
size++
```

Required postconditions:

```text
size increased by one
value is the newest logical element
existing logical order unchanged
```

If the queue was empty, `head` remains the position of the inserted value.

---

# 6. Dequeue Mechanics

For a non-empty queue:

```text
readIndex = head
value = buffer[readIndex]
buffer[readIndex] = emptyMarker
head = (head + 1) % capacity
size--
```

If `size` becomes zero, the queue is empty.

Whether `head` is reset to zero is an implementation choice; correctness should not depend on that reset unless the representation explicitly requires it.

---

# 7. Empty and Full States

With explicit `size`:

```text
empty ⇔ size === 0
full  ⇔ size === capacity
```

This is simple and robust.

The physical relationship between head and insertion position no longer needs to encode fullness.

That is one reason storing `size` is often preferable for educational and production implementations where memory is not extremely constrained.

---

# 8. Fixed-Capacity Circular Queue

A bounded queue has a clear policy:

```text
capacity = C
```

When full, possible behavior is:

```text
reject
throw
return failure result
overwrite oldest
```

For general-purpose work queues, silent overwrite is usually dangerous.

For telemetry or rolling-window buffers, overwrite may be exactly the intended semantics.

The storage mechanism and the overflow policy should be designed separately.

---

# 9. Dynamic Circular Queue

If growth is allowed and the buffer is full:

```text
old capacity = C
new capacity = G(C)
```

A common growth policy is:

```text
newCapacity ≈ 2C
```

Then copy logical elements into contiguous order:

```text
old logical sequence:
[A, B, C, D]

new buffer:
[A, B, C, D, _, _, _, _]

new head = 0
```

The resize itself costs O(N), but it need not happen on every enqueue.

---

# 10. Resizing Correctness

During resize, never copy based only on physical positions.

Suppose:

```text
capacity = 5
head = 3
logical = [A, B, C, D]
```

Physical layout may be:

```text
index: 0  1  2  3  4
value: B  C  D  A  _
```

Copying indices `0..size-1` directly would produce the wrong logical order.

Instead, for each logical position `i`:

```text
oldIndex = (head + i) % oldCapacity
newBuffer[i] = oldBuffer[oldIndex]
```

Then:

```text
newHead = 0
```

This preserves the abstract queue.

---

# 11. Amortized Analysis of Growth

Suppose capacity doubles:

```text
1 → 2 → 4 → 8 → 16 → ...
```

A resize copies approximately:

```text
1 + 2 + 4 + 8 + ...
```

For N inserted elements, the total copying cost is O(N).

Therefore the total cost of N enqueue operations is:

```text
O(N)
```

and average amortized cost per enqueue is:

```text
O(1)
```

This does **not** mean every enqueue is O(1). Some individual operations are O(N).

---

# 12. Aggregate Method Intuition

Suppose N insertions trigger capacities:

```text
1, 2, 4, 8, ..., 2^k
```

Each element can be copied only a logarithmic number of times, and the total copied volume is bounded by a geometric series.

Thus:

```text
ordinary writes = O(N)
resize copies = O(N)
total = O(N)
```

This is why amortized O(1) insertion is possible.

---

# 13. Potential Method Intuition

Think of unused capacity as stored potential.

Cheap enqueue operations accumulate potential.

When a resize occurs, previously accumulated potential pays for copying elements.

You do not need to memorize formal potential-function equations initially.

Understand the principle:

> Cheap operations can prepay for occasional expensive operations.

---

# 14. Growth Factor Trade-Off

A larger growth factor means:

- fewer resizes;
- potentially more unused memory;
- larger individual resize operations.

A smaller growth factor means:

- less spare capacity;
- more frequent copying;
- potentially better memory utilization.

Therefore capacity growth is a memory/CPU trade-off, not a magic constant.

---

# 15. Shrinking

Dynamic queues may also shrink when mostly empty.

But shrinking too aggressively can cause:

```text
grow → shrink → grow → shrink
```

repeatedly.

A hysteresis policy is safer:

```text
shrink only below a sufficiently low utilization threshold
```

and often shrink to a capacity larger than the current size.

This avoids resize thrashing.

---

# 16. Reference Release

When dequeuing objects from JavaScript storage:

```js
buffer[index] = undefined;
```

can make the removed object unreachable from the queue.

Without clearing the slot, the queue may retain references to logically removed objects.

This matters for:

```text
large objects
buffers
request payloads
closures
cache entries
```

Correct asymptotic space does not guarantee good memory behavior.

---

# 17. Logical Size vs Physical Capacity

A queue may have:

```text
size = 10
capacity = 1024
```

Both values are useful.

`size` answers:

```text
How much work is currently queued?
```

`capacity` answers:

```text
How much storage can be held without growth?
```

Production systems often monitor both.

---

# 18. Queue Utilization

Define utilization approximately as:

```text
size / capacity
```

High utilization can mean:

- efficient memory usage;
- little burst headroom;
- increased risk of producer blocking/rejection.

Low utilization can mean:

- more burst tolerance;
- potentially wasted allocated memory.

This is a useful operational metric for bounded queues.

---

# 19. Head-Index Queue vs Circular Queue

### Head-index queue

```text
buffer = [A, B, C, _, _, _]
head = 3
```

Simple and often effective.

But consumed prefixes can grow, requiring compaction.

### Circular queue

```text
buffer = [C, D, _, _, A, B]
head = 4
```

Storage is reused naturally without shifting live elements.

For bounded high-throughput workloads, the circular design is often the stronger representation.

---

# 20. Circular Queue vs Linked Queue

| Property | Circular Array | Linked Queue |
|---|---|---|
| Allocation | contiguous | per-node |
| Locality | strong | weaker |
| Capacity | bounded or growable | naturally dynamic |
| Enqueue | O(1) amortized | O(1) |
| Dequeue | O(1) | O(1) |
| Metadata overhead | low | node references |
| Resize | possible | unnecessary |
| Cache behavior | generally favorable | pointer chasing |

The best choice depends on workload, not on asymptotic complexity alone.

---

# 21. Cache and Runtime Behavior

Contiguous arrays can provide better locality because nearby elements are stored together in the backing representation.

Linked nodes require following pointers from one object to another.

In JavaScript, exact engine behavior depends on runtime implementation, object shapes, allocation patterns, and garbage collection.

Therefore benchmark real workloads rather than assuming theoretical locality guarantees a fixed speedup.

---

# 22. Batch Operations

Suppose a queue needs to process 10,000 items.

Repeated single-item API calls may add overhead.

A production abstraction may support:

```text
enqueueMany(items)
dequeueMany(limit)
```

Batch operations can reduce call overhead and improve memory locality.

But complexity must remain explicit.

For N inserted items:

```text
enqueueMany = O(N)
```

not O(1).

---

# 23. Queue as a Work-Conserving Structure

A basic queue only stores work.

A worker system adds scheduling behavior:

```text
producer
  ↓
queue
  ↓
worker availability
  ↓
consumer
```

The queue should not be responsible for everything.

Separate concerns:

```text
storage
ordering
capacity
scheduling
retry
cancellation
metrics
```

This separation makes the system easier to reason about and test.

---

# 24. Backpressure and Capacity

A bounded circular queue gives a hard upper bound on in-memory queued work.

When full, the system must choose:

```text
reject
wait
shed load
spill elsewhere
prioritize
```

This is a system-level decision.

A queue that grows indefinitely is not necessarily “more reliable”; it may simply postpone failure until memory exhaustion.

---

# 25. Backend Example: Job Dispatcher

Consider:

```text
API requests
     ↓
job queue
     ↓
workers
```

Each job may contain:

```text
jobId
payload
tenantId
createdAt
attempt
priority
```

A simple FIFO queue provides ordering, while production requirements may add:

```text
max capacity
retry policy
cancellation
visibility timeout
metrics
persistence
```

The in-memory queue is only one component of the complete architecture.

---

# 26. AI Example: Inference Buffer

Suppose an inference gateway receives requests faster than model workers can process them.

A bounded queue can protect the service from unbounded memory growth.

But AI workloads may require:

```text
priority
deadline
batch compatibility
tenant fairness
cancellation
```

A plain FIFO queue may therefore become a building block inside a more advanced scheduler.

---

# 27. Correctness Invariants

For a circular queue:

```text
0 ≤ size ≤ capacity
```

and for non-empty queues:

```text
head points to the logical front
```

Logical position `i` maps to:

```text
(head + i) % capacity
```

For every successful enqueue:

```text
size' = size + 1
```

For every successful dequeue:

```text
size' = size - 1
```

After resizing:

```text
logical sequence before == logical sequence after
```

That final invariant is the most important resize property.

---

# 28. Correctness of Wrap-Around

Let capacity be `C`.

For logical positions:

```text
physical(i) = (head + i) mod C
```

Because modulo maps every integer into:

```text
0 ... C-1
```

all physical accesses remain inside the buffer.

When `head + i ≥ C`, the modulo operation wraps to the beginning.

This gives a mathematical basis for ring-buffer correctness.

---

# 29. Testing Strategy

Use a simple reference sequence:

```js
const reference = [];
```

For every operation:

```text
candidate.enqueue(x)
reference.push(x)
```

and:

```text
candidate.dequeue()
reference.shift()
```

Compare:

```text
returned values
size
isEmpty
logical contents
```

Also generate random sequences that force wrap-around and resize transitions.

---

# 30. Adversarial Cases

Test:

```text
capacity = 1
capacity = 2
empty → enqueue → dequeue
fill → drain
fill → dequeue → enqueue
multiple wrap-arounds
resize while wrapped
large objects
long enqueue/dequeue sequences
repeated grow/shrink boundaries
```

The most valuable tests are transition tests, not just steady-state tests.

---

# 31. Benchmarking

Benchmark realistic workloads:

```text
mostly enqueue
mostly dequeue
balanced producer/consumer
bursty producers
long-lived queues
small objects
large objects
frequent wrap-around
frequent resize
```

Measure:

```text
throughput
latency
memory usage
allocation rate
GC pressure
resize count
```

Do not conclude that one implementation is faster from a single microbenchmark.

---

# 32. Production Failure Modes

### Incorrect wrap formula

Can read/write outside the intended logical region.

### Size drift

Eventually causes false full/empty states.

### Resize order corruption

Produces incorrect FIFO ordering.

### Reference retention

Causes avoidable memory pressure.

### Resize thrashing

Repeated grow/shrink wastes CPU.

### Unbounded growth

Turns load spikes into memory exhaustion.

### Silent overwrite

Can destroy work without an explicit failure.

---

# 33. Interview Framework

When asked to implement a circular queue:

```text
1. Define FIFO.
2. Define capacity and size.
3. Define head.
4. Derive insertion index.
5. Define empty/full conditions.
6. Implement enqueue.
7. Implement dequeue.
8. Explain wrap-around.
9. Explain resize if dynamic.
10. Prove FIFO preservation.
11. Analyze amortized complexity.
12. Discuss memory retention and production policy.
```

The strongest candidates derive the representation instead of memorizing one.

---

# 34. Revision Checklist

- [ ] I can derive `(head + i) % capacity`.
- [ ] I understand logical vs physical positions.
- [ ] I can implement a fixed circular queue.
- [ ] I can implement a dynamically growing circular queue.
- [ ] I can preserve FIFO order during resize.
- [ ] I understand why resize is occasionally O(N).
- [ ] I can explain amortized O(1) enqueue.
- [ ] I understand growth-factor trade-offs.
- [ ] I understand shrink hysteresis.
- [ ] I understand reference release.
- [ ] I can compare circular and linked queues.
- [ ] I can design bounded backpressure.
- [ ] I can differential-test a queue.
- [ ] I can design backend and AI queue components.

---

# 35. Key Takeaways

1. A circular buffer reuses contiguous storage through modular indexing.
2. `size` can make full/empty semantics explicit.
3. The insertion position can be derived from `(head + size) % capacity`.
4. Resizing must copy logical order, not physical order.
5. Geometric growth gives amortized O(1) enqueue.
6. Shrinking requires hysteresis to avoid resize thrashing.
7. Clearing consumed references can materially improve memory behavior.
8. Circular arrays and linked queues have different locality/allocation trade-offs.
9. Bounded queues provide a concrete memory boundary and support backpressure.
10. Production queue design combines representation, ordering, capacity, failure policy, and workload characteristics.
