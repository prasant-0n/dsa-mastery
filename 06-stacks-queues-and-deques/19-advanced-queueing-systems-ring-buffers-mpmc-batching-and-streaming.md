# 06.19 — Advanced Queueing Systems: Ring Buffers, MPMC Queues, Batching & Streaming Architecture

> **Phase 06 — Stacks, Queues & Deques**
>
> This chapter moves from abstract queue operations to high-throughput queueing architecture. The focus is on ring buffers, bounded queues, multi-producer/multi-consumer designs, batching, streaming, cache-aware layouts, and the trade-offs between throughput, latency, memory, and correctness.

## 1. Learning Objectives

You will learn to:

- model queues as bounded resource systems;
- design fixed-capacity ring buffers;
- understand SPSC, SPMC, MPSC, and MPMC models;
- reason about producer and consumer ownership;
- distinguish indexes, slots, sequence numbers, and occupancy;
- understand batching and micro-batching;
- analyze backpressure and overload;
- reason about cache locality and false sharing;
- understand lock-based vs atomic queue designs;
- design streaming pipelines for backend and AI workloads.

---

## 2. Queue as a Resource Boundary

A queue is not merely:

```text
enqueue()
dequeue()
```

It is a boundary between producers and consumers with different rates.

```text
arrival rate λ
      ↓
    queue
      ↓
service rate μ
```

When λ persistently exceeds μ, backlog grows until capacity is exhausted.

---

## 3. Bounded vs Unbounded Queues

### Unbounded

Conceptually convenient, but memory usage can grow with backlog.

### Bounded

Capacity is explicit:

```text
0 ≤ size ≤ capacity
```

A bounded queue forces the system to define overload behavior.

---

## 4. Ring Buffer Mental Model

A ring buffer uses fixed storage and wraps around:

```text
[0][1][2][3][4][5]
 ↑           ↑
read        write
```

When an index reaches the end:

```text
next = (index + 1) mod capacity
```

The physical array is fixed while logical positions advance continuously.

---

## 5. Why Ring Buffers Matter

Advantages include:

```text
fixed memory
predictable allocation
excellent locality
O(1) indexing
low allocation overhead
```

They are especially useful for telemetry, networking, logging, audio-like streams, and high-throughput pipelines.

---

## 6. Full vs Empty Ambiguity

If only read and write indexes are stored, equal positions can represent both:

```text
empty
full
```

Common solutions include:

```text
store size
reserve one slot
use sequence numbers
track generation/phase
```

The representation must make state unambiguous.

---

## 7. Occupancy Model

For a simple bounded queue:

```text
size = writes - reads
```

when indexes are monotonic logical counters and capacity rules are enforced.

Physical positions are derived using modulo arithmetic.

This separates logical progress from physical storage position.

---

## 8. Monotonic Indexes

Instead of repeatedly wrapping counters, use monotonically increasing counters:

```text
readIndex  = 100
writeIndex = 107
```

The physical slot is derived from the counter.

This makes distance and occupancy easier to reason about, especially in concurrent designs.

---

## 9. SPSC

Single Producer, Single Consumer:

```text
producer → ring → consumer
```

Each side owns one logical index.

This greatly simplifies synchronization because there is no competition among producers or consumers.

---

## 10. MPSC

Multiple producers share one queue while one consumer drains it.

```text
P1 ─┐
P2 ─┼→ queue → C
P3 ─┘
```

The write side needs coordination; the read side may remain simpler.

---

## 11. SPMC

One producer feeds multiple consumers.

The producer side is simpler, while consumers compete for items.

Correct ownership of read positions becomes the key synchronization problem.

---

## 12. MPMC

Multiple producers and consumers operate simultaneously:

```text
P1 ─┐
P2 ─┼→ queue ←─ C1
P3 ─┘          C2
```

Both ends require coordination.

MPMC designs are significantly harder because publication, ownership, and visibility must all be correct.

---

## 13. Slot Ownership

A robust concurrent ring design can reason about each slot independently:

```text
slot available
→ producer claims slot
→ producer writes data
→ producer publishes slot
→ consumer claims slot
→ consumer reads data
→ consumer releases slot
```

Publication must occur only after the data is fully written.

---

## 14. Sequence Numbers

Sequence numbers can encode slot state across generations.

Conceptually:

```text
slot sequence
      ↓
which producer generation owns it?
which consumer generation expects it?
```

This avoids ambiguity when indexes wrap around.

---

## 15. Why Naive Atomic Indexing Fails

Making `writeIndex++` atomic does not automatically make the queue correct.

You must also ensure:

```text
capacity reservation
slot ownership
write visibility
publication order
consumer visibility
release order
```

Concurrency correctness is about the complete protocol.

---

## 16. Memory Ordering

Concurrent queues depend on ordering guarantees between operations.

Conceptually:

```text
write payload
→ publish slot
```

must become visible in the correct order to a consumer.

The exact memory model depends on the language and runtime.

---

## 17. Batching

Instead of processing one item:

```text
receive → process
receive → process
```

batch:

```text
receive N
→ process N
```

Batching can amortize:

```text
lock cost
network cost
serialization
scheduler overhead
GPU launch overhead
```

---

## 18. Batch Size Trade-Off

Larger batches can improve throughput but increase waiting time.

```text
small batch → lower latency
large batch → higher efficiency
```

The optimal point depends on workload and latency objectives.

---

## 19. Micro-Batching

Micro-batching collects work for a short bounded interval:

```text
wait up to Δt
or until batch size K
```

Whichever condition occurs first triggers processing.

This is common in high-throughput services and AI inference systems.

---

## 20. Streaming Pipeline

A streaming architecture can be modeled as:

```text
source
 ↓
buffer
 ↓
transform
 ↓
buffer
 ↓
aggregate
 ↓
sink
```

Each boundary may have its own queue and backpressure policy.

---

## 21. Backpressure

If downstream processing slows:

```text
sink slows
 ↓
transform backlog grows
 ↓
upstream queue grows
 ↓
source must slow or shed work
```

Without backpressure, queues merely move the overload problem into memory.

---

## 22. Load Shedding

When capacity is exhausted, possible policies include:

```text
reject newest
reject oldest
sample
prioritize critical work
drop stale telemetry
```

The correct choice depends on the value of each item.

---

## 23. Queueing and Freshness

Not every queued item should be processed after a long delay.

Examples:

```text
latest dashboard metric
latest presence status
stale cache refresh
```

For such workloads, replacing old values may be better than preserving every event.

This leads to specialized coalescing queues.

---

## 24. Coalescing

If many updates target the same key:

```text
A=1
A=2
A=3
A=4
```

processing all four may be unnecessary.

A coalescing queue may retain only:

```text
A=4
```

This trades event history for freshness and lower work.

---

## 25. Priority + Ring Buffer

A ring buffer provides FIFO storage but does not provide arbitrary priority ordering.

If both are required, consider:

```text
priority classes
+ per-class ring buffers
+ scheduler
```

rather than forcing priority behavior into one physical buffer.

---

## 26. Cache Locality

Ring buffers store elements contiguously.

Compared with pointer-heavy structures, this can improve spatial locality and reduce allocation overhead.

But actual performance depends on element size, access pattern, runtime representation, and cache behavior.

---

## 27. False Sharing

Concurrent producer and consumer indexes may be updated frequently.

If unrelated hot variables share cache lines, cache-coherence traffic can increase.

High-performance queue implementations therefore consider memory layout as part of the design.

---

## 28. Queue Latency

Measure:

```text
enqueue latency
dequeue latency
queue wait time
end-to-end latency
batch wait time
```

Do not confuse fast queue operations with low application latency.

A queue can have O(1) operations while holding work for seconds.

---

## 29. Throughput

Throughput is work completed per unit time.

A useful decomposition is:

```text
throughput = useful work / elapsed time
```

Batching can increase throughput by reducing fixed overhead per item.

---

## 30. Little's Law

Under stable conditions:

```text
L = λW
```

where L is average items in the system, λ is throughput/arrival rate, and W is average time in the system.

This gives a powerful intuition:

> More backlog at the same throughput means more time spent waiting.

---

## 31. Queue Depth as a Signal

Track:

```text
current depth
average depth
maximum depth
time near capacity
```

A queue approaching capacity is an early overload signal.

---

## 32. MPMC Design Choices

Possible approaches include:

```text
single mutex
partitioned queues
atomic bounded ring
per-worker queues
work stealing
external broker
```

The best option depends on contention, durability, ordering, and deployment boundaries.

---

## 33. In-Memory vs Durable Queue

In-memory queues provide low latency but usually do not survive process failure by themselves.

Durable queues add:

```text
persistence
replay
acknowledgement
recovery
consumer offsets
```

The data structure is therefore only one layer of the queueing system.

---

## 34. Backend Streaming Example

A telemetry service may use:

```text
HTTP producers
 ↓
bounded ring buffer
 ↓
batched aggregator
 ↓
time-series storage
```

The buffer protects the aggregator from short bursts.

If sustained overload occurs, the system must apply backpressure or controlled loss.

---

## 35. AI Inference Example

An inference gateway may use:

```text
requests
 ↓
admission control
 ↓
compatible-request queue
 ↓
micro-batcher
 ↓
GPU workers
```

Scheduling can combine:

```text
priority
deadline
tenant quota
token cost
batch compatibility
```

---

## 36. Streaming AI Data

For model pipelines, queues may connect:

```text
data ingestion
→ preprocessing
→ embedding
→ retrieval
→ ranking
→ generation
```

Backpressure prevents fast stages from overwhelming slower stages.

---

## 37. Exactly-Once Claims

A queue data structure does not automatically provide exactly-once processing.

Exactly-once effects usually require coordination with external state, idempotency, transactional boundaries, or carefully designed processing semantics.

Distinguish:

```text
at-most-once
at-least-once
exactly-once effects
```

---

## 38. Failure Recovery

Define what happens when a consumer crashes after reading an item but before completing work.

Possible semantics:

```text
item lost
item redelivered
item moved to retry queue
transaction rolled back
```

Recovery semantics are part of queue architecture.

---

## 39. Testing Ring Buffers

Test:

```text
empty
single item
full
wrap-around
multiple wraps
capacity one
capacity boundaries
producer/consumer interleavings
```

For concurrent variants, add stress tests and invariant checks.

---

## 40. Correctness Invariants

For a bounded ring buffer:

```text
0 ≤ size ≤ capacity
logical order preserved
published slots contain initialized data
unpublished slots are not consumed
released slots are not consumed twice
```

These should be checked continuously in test builds.

---

## 41. Benchmarking

Benchmark realistic workloads:

```text
single producer/consumer
many producers
many consumers
bursty traffic
steady traffic
small payloads
large payloads
batching enabled/disabled
```

Report throughput and latency distributions, not just one average.

---

## 42. Production Failure Modes

Watch for:

```text
unbounded memory growth
full-buffer storms
consumer lag
stale data
head-of-line blocking
retry amplification
batch latency spikes
false sharing
contention hotspots
incorrect wrap-around arithmetic
```

---

## 43. Interview Framework

For a high-throughput queue problem:

```text
1. Define producer/consumer model.
2. Define capacity.
3. Define ordering.
4. Define durability.
5. Define overload behavior.
6. Choose ring/linked/partitioned representation.
7. Define ownership.
8. Define synchronization.
9. Define batching policy.
10. Define failure semantics.
11. State invariants.
12. Derive complexity.
13. Measure throughput and tail latency.
```

---

## 44. Revision Checklist

- [ ] I can explain a ring buffer.
- [ ] I can derive full/empty behavior.
- [ ] I understand monotonic logical indexes.
- [ ] I can distinguish SPSC, MPSC, SPMC, and MPMC.
- [ ] I understand slot ownership and publication.
- [ ] I understand why atomic indexes alone are insufficient.
- [ ] I understand batching and micro-batching.
- [ ] I can design backpressure.
- [ ] I understand load shedding and coalescing.
- [ ] I can reason about cache locality and false sharing.
- [ ] I can distinguish in-memory and durable queues.
- [ ] I understand queue recovery semantics.
- [ ] I can design a backend streaming pipeline.
- [ ] I can design an AI inference queue and batcher.
- [ ] I can test and benchmark a high-throughput queue.

---

## 45. Key Takeaways

1. A ring buffer gives bounded storage, predictable memory behavior, and excellent locality.
2. SPSC is substantially simpler than MPMC because ownership is easier to define.
3. Concurrent correctness requires a complete publication and ownership protocol, not merely atomic counters.
4. Batching amortizes fixed overhead but can increase latency.
5. Backpressure is necessary whenever producers can outpace consumers.
6. Coalescing can be better than preserving every event when freshness matters more than history.
7. Queue depth is both a state variable and an operational signal.
8. In-memory queue correctness and durable delivery semantics are separate concerns.
9. Backend and AI streaming systems combine queues with admission, scheduling, batching, and failure recovery.
10. High-performance queue engineering requires reasoning about memory, synchronization, latency, throughput, and workload shape together.
