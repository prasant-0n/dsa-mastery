# 12.18 — Concurrent Heaps & Priority Queues: Locking, Atomicity, Contention & Parallel Workloads

## Objective

A heap that is correct in a single thread is not automatically safe when multiple workers access it concurrently. This chapter connects heap invariants with synchronization, linearizability, contention, sharding, batching, and parallel workload design.

## 1. Concurrency Changes the Problem

A sequential heap has one operation order. Concurrent execution introduces interleavings between operations.

Correctness now requires both:

- heap-order correctness;
- synchronization correctness.

## 2. Critical Section

A shared mutable heap generally needs protection around operations that can observe or modify shared state.

Examples include:

```text
insert
extract
remove
updatePriority
peek
```

The exact critical section depends on the implementation.

## 3. Mutex-Protected Heap

The simplest design is one heap protected by one lock.

Advantages:

- easy reasoning;
- straightforward invariants;
- simple linearization model.

Trade-offs:

- contention;
- reduced parallelism;
- lock acquisition overhead.

## 4. Atomicity

An operation is atomic from the perspective of other threads when observers cannot see an invalid intermediate state.

A multi-step heap operation such as root replacement plus sift-down must appear as one coherent logical operation if the API promises atomicity.

## 5. Linearizability

For a concurrent priority queue, each successful operation should appear to take effect at one logical point between its invocation and response.

Finding that linearization point is a powerful correctness technique.

## 6. Example Linearization Points

Depending on implementation:

- insert may linearize when the entry becomes logically visible;
- extract may linearize when the selected root is logically removed;
- cancellation may linearize when the state changes to cancelled.

Physical swaps do not necessarily equal the logical linearization point.

## 7. Lock Scope

A lock held across expensive user callbacks or I/O can create severe contention.

Keep critical sections focused on shared-state mutation when possible.

## 8. Comparator Safety

A comparator should ideally be pure, deterministic, and fast. Calling arbitrary user code while holding a shared heap lock can cause:

- long lock holds;
- re-entrancy;
- deadlock;
- priority instability.

## 9. Re-Entrancy

If a callback invoked during an operation tries to access the same queue, a non-reentrant lock may deadlock. A robust design should avoid callbacks inside critical sections or explicitly define re-entrancy semantics.

## 10. Lock Contention

When many workers repeatedly access one global heap, throughput can become limited by the lock rather than by `O(log N)` heap operations.

Measure contention rather than assuming asymptotic complexity predicts scalability.

## 11. Sharded Priority Queues

Partition work across multiple queues:

```text
shard 0 → heap
shard 1 → heap
...
shard S → heap
```

Workers can operate independently, reducing contention.

## 12. Sharding Trade-Off

Sharding sacrifices a single globally ordered queue. The system must define whether approximate priority, partition-local priority, or coordinated global priority is acceptable.

## 13. Global Minimum Across Shards

Finding the exact global minimum requires examining shard heads or maintaining additional coordination.

If there are S shards, a coordinator can maintain a heap of shard heads.

## 14. Hierarchical Priority Queues

A scalable architecture can use:

```text
worker-local heap
→ shard-level heap
→ coordinator-level frontier
```

This creates multiple layers of scheduling state.

## 15. Batching

Instead of locking for every operation, process batches:

```text
acquire lock
→ perform many operations
→ release lock
```

Batching can reduce synchronization overhead but may increase latency for competing operations.

## 16. Bulk Insert

Bulk insertion can append many entries and perform one bottom-up heap construction, potentially reducing total work compared with repeated insertion.

For a batch of B new entries into a compatible heap, the exact optimal strategy depends on whether the existing heap and batch can be combined efficiently.

## 17. Producer/Consumer Architecture

Separate producers from the priority worker:

```text
producers
→ concurrent ingestion
→ centralized priority structure
→ workers
```

The ingestion layer and priority layer can have different concurrency strategies.

## 18. Multi-Queue Approximation

Instead of one exact global heap, a system may choose among several local queues. This can scale better but may return a non-global-best item.

The approximation must be part of the documented contract.

## 19. Work Stealing

Workers can maintain local deques and steal from others when idle. This favors parallel throughput and locality, but strict global priority is difficult to guarantee.

## 20. Priority-Aware Stealing

A stealing policy may inspect victim priority information before taking work. More coordination improves priority fidelity but can reduce scalability.

## 21. Lock-Free Structures

Lock-free priority queues attempt progress without a traditional mutex. They are substantially harder to implement and verify.

Important concepts include:

- atomic compare-and-swap;
- memory ordering;
- ABA problems;
- safe reclamation;
- helping;
- progress guarantees.

## 22. Lock-Free Does Not Mean Wait-Free

A lock-free algorithm guarantees system-wide progress under its formal model; it does not necessarily guarantee that every individual operation completes within a bounded number of steps.

Wait-free algorithms provide a stronger per-operation progress guarantee but can be substantially more complex.

## 23. ABA Problem

A location may change:

```text
A → B → A
```

between observations. A thread performing CAS may see A and incorrectly assume nothing relevant changed.

Version tags or safe reclamation strategies can help address ABA-related hazards.

## 24. Memory Reclamation

Concurrent pointer-based structures need safe object lifetime management. An object cannot be reclaimed while another worker may still access it.

Possible strategies include:

- hazard pointers;
- epochs;
- reference counting;
- garbage collection.

## 25. JavaScript Reality

JavaScript execution models differ from native shared-memory systems. Standard Node.js application code typically relies on an event loop, while true shared-memory concurrency can involve worker threads and `SharedArrayBuffer`/Atomics.

Therefore distinguish:

```text
async concurrency
vs
parallel shared-memory execution
```

## 26. Async Concurrency

Promises and asynchronous I/O can interleave operations even without multiple CPU threads. Shared application state can still require careful atomicity at the logical level.

## 27. Worker Threads

Node.js worker threads allow parallel JavaScript execution with shared-memory capabilities when explicitly used. A priority queue crossing worker boundaries requires a synchronization and communication design beyond a normal array heap.

## 28. Message-Passing Queues

Instead of sharing a heap, workers can communicate through messages. Ownership of the priority state is then explicit.

This often simplifies correctness compared with shared mutable memory.

## 29. Single Owner Model

A dedicated scheduler owns the heap:

```text
workers → messages → scheduler-owned heap
```

Only the owner mutates the heap, reducing shared-memory synchronization complexity.

## 30. Backpressure Under Concurrency

A concurrent producer system needs bounded capacity. Otherwise multiple producers can overwhelm consumers before queue-depth checks become effective.

## 31. Fairness Under Concurrency

Concurrent workers can accidentally favor whichever worker acquires locks first. Fairness must be measured at the logical workload level, not inferred from lock behavior.

## 32. Priority Inversion Under Locks

A low-priority worker holding a shared lock can delay high-priority operations. Lock duration and scheduling policy therefore interact.

## 33. Deadlock Avoidance

If multiple locks exist, establish a consistent acquisition order or use designs that avoid nested lock ownership.

A single-owner queue can eliminate many multi-lock ordering problems.

## 34. Starvation

A thread or logical job may repeatedly fail to acquire resources. Distinguish:

```text
algorithmic starvation
lock starvation
scheduler starvation
```

Each requires different diagnostics.

## 35. Atomic State Transitions

For queued jobs, transitions such as:

```text
QUEUED → RUNNING
```

must be atomic with respect to competing workers to prevent duplicate execution.

## 36. Claiming Work

A worker should atomically claim a job before executing it. The claim may be represented by ownership, a state transition, or a lease.

## 37. Leases

In distributed systems, a worker may hold a time-bounded lease. If it fails, another worker can recover the job after lease expiration.

This is a distributed coordination problem, not merely a heap problem.

## 38. Exactly-Once Execution

A concurrent priority queue does not automatically provide exactly-once execution. Durable state, idempotency, ownership, and failure recovery are separate concerns.

## 39. Parallel Heap Construction

Large heaps can potentially be built in parallel, but practical benefits depend on partitioning, synchronization, memory bandwidth, and implementation overhead.

Asymptotic parallel work and actual wall-clock speedup are different measurements.

## 40. Parallel Heap Operations

Independent heaps can perform operations concurrently. A single binary heap has structural dependencies that limit straightforward parallel mutation.

This motivates sharded or hierarchical designs.

## 41. Concurrent K-Way Merge

Multiple producers can generate ordered streams independently. A coordinator can maintain a heap of currently available heads.

Synchronization then occurs around candidate publication rather than every underlying record.

## 42. Distributed Priority Queue

A distributed design can use:

```text
partitioned queues
→ local priority ordering
→ coordinator or sampling
→ execution workers
```

Exact global ordering requires coordination and can become expensive.

## 43. Approximate Global Priority

Sampling multiple queues and selecting the best observed candidate can reduce coordination. The trade-off is weaker global-priority guarantees.

## 44. Observability

Measure:

- lock wait time;
- lock hold time;
- contention rate;
- queue depth;
- operation latency;
- p95/p99 latency;
- worker utilization;
- steal rate;
- fairness;
- failed claims.

## 45. Testing Concurrent Structures

Use deterministic schedulers or controlled interleavings where possible. Random stress tests should record seeds and operation histories so failures are reproducible.

## 46. Linearizability Testing

Generate concurrent histories and determine whether the observed results can be explained by some valid sequential ordering consistent with real-time constraints.

## 47. Invariant Checking

After safe synchronization points verify:

```text
heap order
identity uniqueness
ownership correctness
queue capacity
job-state validity
```

## 48. Fault Injection

Test:

- worker crashes;
- delayed operations;
- duplicate claims;
- lock contention;
- queue saturation;
- stale leases;
- comparator failures;
- message duplication.

## 49. Benchmarking

Compare designs under identical workloads:

- global mutex heap;
- sharded heaps;
- single-owner scheduler;
- multi-queue approximation;
- work stealing.

Measure throughput and tail latency, not only average operation time.

## 50. Backend Applications

Concurrent priority queues support:

- worker pools;
- job schedulers;
- deadline queues;
- distributed task processing;
- retry orchestration;
- multi-tenant execution.

## 51. AI Applications

Potential uses include:

- parallel inference scheduling;
- GPU job queues;
- distributed retrieval candidate merging;
- parallel beam search coordination;
- model evaluation workloads.

## 52. Architecture Selection

Use a simple mutex-protected heap when contention is low and correctness simplicity matters.

Consider sharding, ownership, batching, or multi-queue designs when measurements show the shared heap is a bottleneck.

Do not choose lock-free structures merely because they sound faster.

## 53. Correctness Proof Framework

For concurrent priority queues prove:

1. sequential heap invariant;
2. operation atomicity;
3. linearization points;
4. ownership/state transitions;
5. memory-safety properties;
6. progress guarantees;
7. recovery semantics.

## 54. Complexity Ledger

Record separately:

```text
heap comparisons
+ synchronization
+ contention
+ communication
+ allocation/reclamation
+ I/O
```

The sequential `O(log N)` bound is not an end-to-end concurrency model.

## 55. Common Mistakes

1. Assuming a heap is thread-safe because its sequential algorithm is correct.
2. Holding locks across slow callbacks or I/O.
3. Ignoring stale job claims.
4. Confusing async concurrency with shared-memory parallelism.
5. Assuming lock-free means wait-free.
6. Ignoring memory reclamation.
7. Claiming exact global priority in a sharded design without coordination.
8. Benchmarking only average latency.

## 56. Interview Framework

```text
Need concurrent priority queue
→ define consistency/priority contract
→ choose ownership or shared-memory model
→ define linearization points
→ protect heap + metadata atomically
→ measure contention
→ consider sharding/batching
→ define cancellation/claim/recovery
→ test adversarial interleavings
→ benchmark tail latency
```

## Revision Checklist

- [ ] I can explain why a sequential heap is not automatically thread-safe.
- [ ] I understand linearizability and linearization points.
- [ ] I can design a mutex-protected heap.
- [ ] I can explain sharding and its global-priority trade-off.
- [ ] I understand single-owner and message-passing designs.
- [ ] I can distinguish lock-free and wait-free progress.
- [ ] I understand ABA and memory reclamation at a conceptual level.
- [ ] I can reason about concurrent job claiming.
- [ ] I can design tests for interleavings and contention.

## Key Takeaways

1. **Concurrency correctness requires synchronization semantics in addition to heap invariants.**
2. **A single-owner or message-passing design can dramatically simplify shared-state reasoning.**
3. **Sharding and multi-queue approaches trade exact global priority for scalability.**
4. **Lock-free engineering introduces memory-ordering and reclamation problems that are substantially harder than ordinary heap implementation.**
5. **Real performance must be evaluated using contention, throughput, and tail latency—not Big-O alone.**
