# 01.20 — Parallelism, Concurrency & Distributed Algorithmic Thinking

> A single-machine algorithm assumes one computational state. Real backend and AI systems often have many workers changing state concurrently, communicating over networks, and failing independently. The algorithm must therefore reason about coordination, ordering, consistency, contention, and partial failure.

## Learning Objectives

By the end of this chapter, you should be able to:

- Distinguish concurrency, parallelism, and distribution.
- Understand work, span, and critical-path reasoning.
- Identify dependencies that limit parallelism.
- Recognize race conditions and lost updates.
- Reason about atomicity and shared-state invariants.
- Understand locks, optimistic concurrency, and compare-and-swap intuition.
- Reason about queues, worker pools, partitioning, and fan-out/fan-in.
- Understand map/reduce-style decomposition.
- Analyze load balancing and skew.
- Understand idempotency, retries, and duplicate work.
- Reason about distributed consistency and partial failure.
- Apply these concepts to backend and AI pipelines.

---

## 1. Concurrency vs Parallelism vs Distribution

These concepts are related but not identical.

### Concurrency

Multiple tasks make progress during overlapping periods.

```text
Task A → pause → resume
Task B → run → pause
```

### Parallelism

Multiple tasks execute simultaneously on multiple computational resources.

```text
CPU 1 → Task A
CPU 2 → Task B
```

### Distributed computation

Tasks execute across separate machines/processes that communicate through a network or message system.

```text
Machine A ←network→ Machine B
```

A system can be concurrent without being parallel and parallel without being distributed.

---

## 2. Why Sequential Complexity Is Not Enough

A sequential algorithm might have:

```text
T(n) = O(n)
```

If the work can be split across workers, wall-clock time may decrease.

But communication, synchronization, and uneven workloads introduce additional costs.

A realistic model is:

```text
useful computation
+
communication
+
synchronization
+
coordination
+
imbalance
```

Parallelism changes the cost model rather than simply dividing runtime by the worker count.

---

## 3. Work and Span

A useful parallel-analysis model uses:

### Work

Total operations performed by all workers.

```text
W(n)
```

### Span

Length of the longest dependency chain, also called the critical path.

```text
S(n)
```

An idealized lower bound on parallel execution time is:

```text
T_p(n) ≥ max(W(n) / p, S(n))
```

where `p` is the number of workers/processors.

This immediately explains why unlimited workers cannot make a computation faster than its dependency chain.

---

## 4. Example: Parallel Sum

Suppose we sum N numbers.

Sequential:

```text
work = O(n)
span = O(n)
```

A tree reduction can create:

```text
n values
↓
n/2 partial sums
↓
n/4 partial sums
↓
...
↓
1 result
```

Then:

```text
work = O(n)
span = O(log n)
```

The total amount of work did not disappear; dependencies were reduced.

---

## 5. Amdahl's Law Intuition

Suppose fraction `f` of a program can be parallelized and the remaining `1-f` is inherently sequential.

With `p` processors, idealized speedup is approximately:

```text
1 / ((1 - f) + f/p)
```

As `p` becomes very large:

```text
speedup → 1 / (1 - f)
```

Therefore even a small sequential fraction can limit maximum speedup.

---

## 6. Parallelism Is Not Free

Splitting work introduces overhead:

- creating tasks,
- scheduling,
- communication,
- serialization,
- synchronization,
- merging results.

If each task is tiny:

```text
coordination cost > useful work
```

Parallel execution can be slower than sequential execution.

---

## 7. Task Granularity

Granularity describes how much useful work each parallel task performs.

Fine-grained:

```text
many tiny tasks
```

Coarse-grained:

```text
fewer larger tasks
```

Fine-grained work provides flexibility but increases scheduling overhead.

Coarse-grained work reduces coordination but can reduce load-balancing flexibility.

---

## 8. Dependency Graph

Parallelism is fundamentally constrained by dependencies.

Example:

```text
A → B → C
```

must execute sequentially.

But:

```text
A ─┐
B ─┼→ D
C ─┘
```

allows A, B, and C to run concurrently.

The dependency graph is therefore a representation of available parallelism.

---

## 9. Critical Path

The critical path is the longest chain of dependent operations.

Even if there are many workers:

```text
A → B → C → D
```

still requires four dependency steps.

To increase parallelism, look for opportunities to:

- remove unnecessary dependencies,
- batch independent work,
- use tree reductions,
- restructure state.

---

## 10. Race Conditions

A race condition occurs when the result depends on the relative timing/interleaving of concurrent operations.

Example:

```text
counter = 10

Worker A reads 10
Worker B reads 10
Worker A writes 11
Worker B writes 11
```

Expected:

```text
12
```

Observed:

```text
11
```

The lost update violates the intended state transition.

---

## 11. Atomicity

An operation is atomic when other concurrent operations cannot observe or interleave within the protected transition in a way that violates the required semantics.

Conceptually:

```text
read → modify → write
```

must behave as one indivisible state transition when required.

Atomicity is about operation boundaries, not simply “using a lock.”

---

## 12. Shared-State Invariants

Concurrent algorithms must preserve invariants under interleavings.

For a bounded queue:

```text
0 ≤ size ≤ capacity
```

If two producers modify `size` concurrently without coordination, the invariant can be broken.

Therefore concurrent correctness means:

```text
valid state
+
valid transition
+
valid interleavings
```

---

## 13. Locks

A lock provides mutual exclusion around critical sections.

Conceptually:

```text
acquire
↓
read/modify/write
↓
release
```

Only one worker executes the protected section at a time.

Locks can establish correctness but introduce:

- contention,
- waiting,
- deadlock risk,
- reduced parallelism.

---

## 14. Lock Contention

If many workers need the same lock:

```text
worker A → lock
worker B → wait
worker C → wait
worker D → wait
```

Increasing worker count may stop improving throughput.

The shared critical section becomes the bottleneck.

This is another form of critical-path reasoning.

---

## 15. Deadlock

Deadlock can occur when tasks wait for each other indefinitely.

Classic pattern:

```text
A holds lock 1 → waits for lock 2
B holds lock 2 → waits for lock 1
```

A practical prevention strategy is consistent lock ordering:

```text
always acquire lock 1 before lock 2
```

More generally, design resource acquisition so circular wait cannot occur.

---

## 16. Optimistic Concurrency

Instead of locking the resource for the entire operation, an optimistic approach assumes conflicts are relatively rare.

Conceptually:

```text
read version
↓
compute update
↓
commit only if version unchanged
```

If another worker changed the state:

```text
version mismatch
↓
retry/reject/recompute
```

This is useful when contention is low and retry is cheaper than long lock holding.

---

## 17. Compare-and-Swap Intuition

CAS conceptually means:

```text
if current value == expected:
    replace with new value
else:
    fail
```

The comparison and replacement are treated as one atomic operation by the underlying concurrency primitive.

CAS enables lock-free or low-lock data structures under appropriate conditions.

---

## 18. Idempotency

Distributed systems retry because of:

- timeouts,
- crashes,
- network failures,
- worker failures.

Therefore the same logical operation may execute more than once.

An operation is idempotent when repeating it produces the same intended final effect.

Example:

```text
set order status = PAID
```

is easier to make idempotent than:

```text
increment account balance by 100
```

Idempotency is an algorithmic correctness property in distributed execution.

---

## 19. Exactly-Once Is Difficult

Distributed execution often naturally provides:

```text
at-most-once
```

or:

```text
at-least-once
```

semantics.

At-least-once delivery can create duplicates.

Instead of assuming perfect exactly-once execution, robust systems often combine:

```text
at-least-once delivery
+
idempotency/deduplication
+
transactional state changes
```

The correct guarantee depends on the system.

---

## 20. Worker Pools

A worker pool limits concurrent processing.

```text
                 ┌→ worker 1
queue → scheduler ├→ worker 2
                 ├→ worker 3
                 └→ worker 4
```

The queue absorbs temporary bursts.

The pool controls concurrency.

This prevents creating an unbounded number of simultaneous tasks.

---

## 21. Queue-Based Parallelism

A queue can decouple producers and consumers:

```text
producer
   ↓
queue
   ↓
workers
```

Benefits:

- buffering,
- concurrency control,
- retry handling,
- load smoothing.

Costs:

- queue latency,
- memory/storage,
- duplicate delivery,
- ordering complexity.

---

## 22. Fan-Out / Fan-In

Many workloads have independent subtasks:

```text
              → task A →
input → split → task B → merge
              → task C →
```

This is fan-out/fan-in.

The merge stage must account for:

- ordering,
- failures,
- partial results,
- duplicates,
- timeout behavior.

---

## 23. Map/Reduce Thinking

Map stage:

```text
input partitions
↓
independent transformations
```

Reduce stage:

```text
partial results
↓
combine
↓
final result
```

The key requirement is that the reduction operation supports safe decomposition.

Associative operations are especially useful:

```text
(a + b) + c = a + (b + c)
```

Parallel reduction becomes possible because grouping does not change the mathematical result.

---

## 24. Associativity and Parallel Reduction

For an associative operation:

```text
combine(combine(A, B), C)
```

can be regrouped:

```text
combine(A, combine(B, C))
```

This allows tree-style parallel reduction.

Commutativity is not always required for parallel reduction, but it can make partition ordering easier to manage.

Floating-point arithmetic deserves special caution because machine floating-point addition is not perfectly associative.

---

## 25. Partitioning

Large datasets can be divided into partitions:

```text
Dataset
├── P1
├── P2
├── P3
└── P4
```

Each partition can often be processed independently.

Good partitioning aims for:

- balanced work,
- low cross-partition communication,
- locality,
- stable ownership.

---

## 26. Data Parallelism

Data parallelism applies the same computation to different data partitions.

Example:

```text
partition 1 → transform
partition 2 → transform
partition 3 → transform
```

This is common in:

- batch processing,
- image processing,
- ML inference,
- embedding generation.

The algorithm becomes parallel because data elements are sufficiently independent.

---

## 27. Task Parallelism

Task parallelism executes different operations concurrently.

Example:

```text
fetch user
fetch recommendations
fetch inventory
```

If the tasks are independent, they can overlap.

Task parallelism is especially useful in backend request orchestration.

---

## 28. Load Balancing

Suppose four workers receive workloads:

```text
10, 10, 10, 100
```

Three workers finish early while one becomes the bottleneck.

Total completion time is dominated by the worker handling 100 units.

Therefore parallel efficiency depends on workload balance, not just worker count.

---

## 29. Data Skew

Some partitions may naturally contain more work than others.

Examples:

```text
popular customer
popular key
large document
hot tenant
high-frequency event type
```

A partitioning strategy based only on key ownership may create a hot partition.

Solutions include:

- better partition keys,
- sharding hot keys,
- dynamic work stealing,
- replication,
- adaptive partitioning.

---

## 30. Work Stealing

In work-stealing systems, an idle worker can take tasks from another worker's queue.

Conceptually:

```text
worker A: [many tasks]
worker B: []

B steals some work from A
```

This can improve utilization for irregular workloads.

The trade-off is additional synchronization and scheduling complexity.

---

## 31. Synchronization Barriers

A barrier forces workers to wait until a phase completes.

```text
worker A ─┐
worker B ─┼→ barrier → next phase
worker C ─┘
```

Barriers are simple but can reduce parallelism when one worker is much slower.

Avoid unnecessary global synchronization.

---

## 32. Communication Cost

In distributed systems, communication is not free.

A computation that requires frequent network round trips may be slower than a slightly more expensive local computation.

Therefore optimize:

```text
communication volume
+
round-trip count
+
serialization cost
```

not only CPU operations.

---

## 33. Data Locality

Moving computation toward data can be cheaper than moving huge data toward computation.

Examples:

```text
process partition locally
↓
send compact aggregate
```

rather than:

```text
send all records
↓
central processor
```

This principle appears in distributed databases, MapReduce systems, and AI data pipelines.

---

## 34. Distributed State

A single-machine data structure has one memory state.

A distributed structure may have:

```text
node A state
node B state
node C state
```

and messages connecting them.

Now correctness must account for:

- message delay,
- reordering,
- duplication,
- loss/retry,
- node failure.

The communication protocol becomes part of the algorithm.

---

## 35. Partial Failure

In a distributed system, one component can fail while others continue running.

Example:

```text
A → B → C
```

B may fail while A remains alive.

The system cannot assume:

```text
failure of one component = failure of everything
```

Algorithms therefore need explicit failure semantics.

---

## 36. Timeouts Are Not Proof of Failure

A timeout means:

```text
no response observed within deadline
```

It does not necessarily mean:

```text
remote operation did not happen
```

The remote service may have completed the operation while the response was delayed.

This is why retries require idempotency/deduplication reasoning.

---

## 37. Ordering

Distributed processing can reorder events.

If the algorithm requires order:

```text
A before B
```

then partitioning and concurrency must preserve or reconstruct that order.

If order is not required, relaxing the constraint can unlock more parallelism.

Ordering requirements are therefore performance constraints as well as correctness constraints.

---

## 38. Partition-Local vs Global State

A state can be:

### Partition-local

Only one partition needs it.

### Global

Many workers need a consistent view.

Global state is expensive because it requires coordination.

Whenever possible:

```text
global state
↓
partition-local state + final merge
```

This can dramatically improve scalability.

---

## 39. Distributed Deduplication

Suppose events are partitioned by ID.

If the partitioning guarantees that the same ID always reaches the same owner, deduplication can remain local.

If identical IDs can reach different workers, global coordination is required.

This demonstrates a central distributed-algorithm principle:

> Partitioning can turn a global problem into independent local problems if the partition key preserves the required correctness relationship.

---

## 40. Distributed Top-K

Each partition can compute local Top-K:

```text
P1 → Top-K
P2 → Top-K
P3 → Top-K
```

Then merge:

```text
local Top-K results
↓
global Top-K
```

Only a bounded number of candidates need to move between stages.

This is a powerful example of algorithmic decomposition reducing communication.

---

## 41. Backend: API Fan-Out

A backend endpoint may need data from multiple services:

```text
request
├── service A
├── service B
└── service C
```

If independent, calls can run concurrently.

Latency approaches the slowest dependency plus orchestration overhead rather than the sum of every latency.

But the design must handle:

- timeouts,
- partial failure,
- cancellation,
- retries,
- result merging.

---

## 42. Backend: Worker Queues

Background jobs are naturally modeled as:

```text
producer
↓
queue
↓
worker pool
↓
result/store
```

Algorithmic decisions include:

- concurrency limit,
- partitioning,
- retry policy,
- idempotency key,
- ordering requirements,
- dead-letter behavior.

These determine correctness and throughput.

---

## 43. Backend: Cache Stampede

Suppose many requests miss the same cache key simultaneously.

```text
100 requests
↓
cache miss
↓
100 backend computations
```

This is redundant concurrent work.

Coordination techniques can collapse duplicate computation:

```text
first request computes
↓
others wait/share result
```

The trade-off is coordination complexity versus duplicate work.

---

## 44. Backend: Distributed Rate Limiting

A local limiter is simple:

```text
one process → one counter
```

A distributed limiter needs shared or partitioned state.

Challenges include:

- clock differences,
- race conditions,
- network latency,
- stale state,
- atomic updates,
- partition failure.

The simplest correct design is often to route each rate-limit key to one authoritative partition.

---

## 45. AI: Parallel Inference

AI workloads often use data parallelism:

```text
batch
↓
split across workers/GPUs
↓
inference
↓
merge
```

Throughput can increase substantially, but batch size and model memory constrain parallelism.

Communication can become the bottleneck for distributed model execution.

---

## 46. AI: Embedding Generation

A large corpus can be partitioned:

```text
documents
├── partition A → worker
├── partition B → worker
└── partition C → worker
```

Each worker generates embeddings independently.

The final index merge/update stage becomes the coordination boundary.

Correctness requires stable document/chunk IDs so retries do not create ambiguous duplicates.

---

## 47. AI: Distributed Retrieval

Vector retrieval can be partitioned across shards:

```text
query
 ↓
shard A → local Top-K
shard B → local Top-K
shard C → local Top-K
 ↓
merge
 ↓
global Top-K
```

This is distributed Top-K.

The system trades:

```text
parallel search
vs
network merge cost
vs
recall/shard strategy
```

---

## 48. AI: RAG Parallelism

A RAG request may parallelize:

```text
query preprocessing
├── lexical retrieval
├── vector retrieval
└── metadata filtering
```

Then:

```text
merge candidates
↓
deduplicate
↓
rerank
↓
context selection
```

The dependency graph determines what can run concurrently.

---

## 49. AI: Model/Data Parallelism

### Data parallelism

Each worker holds the model and processes different data.

### Model parallelism

Different workers hold different model components.

Model parallelism introduces stronger communication dependencies.

The correct approach depends on:

- model size,
- device memory,
- communication bandwidth,
- batch size,
- latency target.

---

## 50. Common Mistakes

### Mistake 1 — Equating concurrency with parallelism

Overlapping progress does not necessarily mean simultaneous execution.

### Mistake 2 — Assuming N workers give N× speedup

Work, span, overhead, and imbalance limit speedup.

### Mistake 3 — Ignoring synchronization

Locks and barriers can dominate runtime.

### Mistake 4 — Sharing too much mutable state

More shared state means more coordination.

### Mistake 5 — Assuming retries imply an operation did not execute

Timeouts do not prove remote failure.

### Mistake 6 — Forgetting idempotency

At-least-once execution naturally creates duplicate-work risks.

### Mistake 7 — Ignoring data skew

One hot partition can dominate the entire job.

### Mistake 8 — Moving huge data instead of compact results

Communication can dominate CPU.

### Mistake 9 — Ignoring ordering requirements

Concurrency can reorder operations.

### Mistake 10 — Treating distributed state like local memory

Network delay and partial failure fundamentally change the model.

---

## 51. Parallel/Distributed Algorithm Selection Checklist

Ask:

```text
1. Is the workload actually parallelizable?
2. What operations are independent?
3. What dependencies exist?
4. What is total work W?
5. What is span S?
6. What is the critical path?
7. How many workers are useful?
8. What is task granularity?
9. What synchronization is required?
10. Is shared mutable state necessary?
11. How should work be partitioned?
12. Can data skew create a hot partition?
13. What communication is required?
14. Can local results be merged efficiently?
15. What happens under retries?
16. Is the operation idempotent?
17. What ordering guarantees are required?
18. What happens when one worker fails?
19. Where is authoritative state?
20. What is the actual bottleneck: CPU, memory, I/O, network, or coordination?
```

---

## 52. Interview Template

For a parallel/distributed algorithm:

```text
1. Define the sequential baseline.
2. Identify independent work.
3. Define the dependency graph.
4. Explain partitioning.
5. Define worker responsibilities.
6. Define synchronization points.
7. Define shared/global state.
8. Explain result merging.
9. Analyze work.
10. Analyze span/critical path.
11. Analyze communication.
12. Analyze memory.
13. Discuss skew and load balancing.
14. Discuss retries and idempotency.
15. Discuss partial failure.
16. Explain correctness under concurrency/interleavings.
```

---

## 53. Key Takeaways

1. Concurrency, parallelism, and distribution are different computational models.
2. Parallel performance depends on work, span, overhead, and load balance.
3. The critical path limits achievable speedup.
4. More workers do not guarantee proportionally more performance.
5. Shared mutable state creates coordination costs and race-condition risks.
6. Correct concurrent algorithms must preserve invariants across valid interleavings.
7. Locks provide coordination but introduce contention and deadlock risks.
8. Optimistic concurrency can replace long lock holding when conflicts are manageable.
9. Idempotency is essential when distributed execution can retry.
10. Worker pools provide bounded concurrency.
11. Fan-out/fan-in and MapReduce expose parallel structure.
12. Associative reductions enable tree-style parallel computation.
13. Partitioning is a core distributed-algorithm design decision.
14. Data skew can destroy otherwise good parallel scaling.
15. Communication and serialization can dominate computation.
16. Local computation plus compact merging is often preferable to moving raw data.
17. Distributed systems must explicitly model partial failure and message uncertainty.
18. Backend APIs, queues, caches, and rate limiters are concurrency/distributed algorithm problems.
19. AI inference, embeddings, retrieval, and RAG pipelines naturally expose data/task parallelism.
20. Expert distributed algorithm design begins by identifying dependencies, ownership, and failure semantics before choosing infrastructure.

---

## Revision Checklist

- [ ] I can distinguish concurrency, parallelism, and distribution.
- [ ] I understand work and span.
- [ ] I can identify a critical path.
- [ ] I understand Amdahl's Law intuition.
- [ ] I can identify parallelizable vs dependent work.
- [ ] I understand race conditions.
- [ ] I can reason about atomicity.
- [ ] I understand lock contention and deadlock.
- [ ] I understand optimistic concurrency and CAS intuition.
- [ ] I understand idempotency.
- [ ] I understand at-least-once vs at-most-once execution.
- [ ] I can design worker-pool algorithms.
- [ ] I understand fan-out/fan-in.
- [ ] I can reason about MapReduce decomposition.
- [ ] I understand partitioning and data skew.
- [ ] I can reason about communication costs.
- [ ] I understand partial failure and timeout uncertainty.
- [ ] I can design distributed Top-K.
- [ ] I can apply these concepts to backend systems.
- [ ] I can apply these concepts to AI inference and retrieval systems.
