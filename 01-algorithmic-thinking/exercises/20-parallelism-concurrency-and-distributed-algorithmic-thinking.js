// 01.20 — Parallelism, Concurrency & Distributed Algorithmic Thinking
//
// Rules:
// 1. Keep all exercises unsolved.
// 2. Define the sequential baseline first.
// 3. Identify dependencies before attempting parallelization.
// 4. Analyze work, span, memory, communication, and coordination.

// -----------------------------------------------------------------------------
// Exercise 01 — Concurrency vs Parallelism
// -----------------------------------------------------------------------------
// Give a concrete example of:
// A. concurrency without parallel execution,
// B. parallel execution on one machine,
// C. distributed execution across machines.
//
// Explain what computational model each example represents.

// -----------------------------------------------------------------------------
// Exercise 02 — Dependency Graph
// -----------------------------------------------------------------------------
// Given tasks:
// A, B, C are independent.
// D depends on A and B.
// E depends on B and C.
// F depends on D and E.
//
// Draw the dependency graph.
//
// Determine:
// - maximum available parallelism at each stage,
// - critical path length,
// - total work if each task takes one unit.

// -----------------------------------------------------------------------------
// Exercise 03 — Parallel Sum
// -----------------------------------------------------------------------------
// Implement a conceptual tree-reduction algorithm for summing an array.
//
// Compare:
// A. sequential sum,
// B. pairwise/tree reduction.
//
// Derive work and span.
//
// Discuss the floating-point associativity caveat.

// -----------------------------------------------------------------------------
// Exercise 04 — Amdahl's Law
// -----------------------------------------------------------------------------
// Calculate idealized speedup for a workload where 90% is parallelizable using:
// - 2 workers,
// - 4 workers,
// - 8 workers,
// - 32 workers,
// - 1024 workers.
//
// Explain why speedup eventually saturates.

// -----------------------------------------------------------------------------
// Exercise 05 — Task Granularity
// -----------------------------------------------------------------------------
// Simulate a workload divided into:
// A. 1,000 tiny tasks,
// B. 100 medium tasks,
// C. 10 coarse tasks.
//
// Add a configurable scheduling/coordination overhead.
//
// Determine when finer granularity becomes more expensive than useful.

// -----------------------------------------------------------------------------
// Exercise 06 — Race Condition
// -----------------------------------------------------------------------------
// Model two concurrent workers performing:
// read counter → increment → write counter.
//
// Enumerate possible interleavings.
//
// Identify one that causes a lost update.
//
// Then design an atomic/serialized version of the transition.

// -----------------------------------------------------------------------------
// Exercise 07 — Bounded Queue
// -----------------------------------------------------------------------------
// Implement a bounded producer/consumer queue.
//
// Maintain the invariant:
//   0 <= queueSize <= capacity
//
// Define what happens when:
// - queue is empty,
// - queue is full,
// - producer is faster than consumer.

// -----------------------------------------------------------------------------
// Exercise 08 — Lock Contention
// -----------------------------------------------------------------------------
// Simulate multiple workers competing for one critical section.
//
// Measure throughput as worker count increases.
//
// Explain why more workers can eventually stop improving throughput.

// -----------------------------------------------------------------------------
// Exercise 09 — Deadlock Detection
// -----------------------------------------------------------------------------
// Construct a small resource-allocation graph that can deadlock.
//
// Identify the circular wait.
//
// Then redesign resource acquisition using a global lock-order rule.

// -----------------------------------------------------------------------------
// Exercise 10 — Optimistic Concurrency
// -----------------------------------------------------------------------------
// Model a record containing:
//   value + version
//
// Implement an optimistic update:
// 1. read version,
// 2. compute update,
// 3. commit only if version is unchanged.
//
// Simulate conflicting writers and define the retry behavior.

// -----------------------------------------------------------------------------
// Exercise 11 — Idempotent Job
// -----------------------------------------------------------------------------
// Design a job operation that may be executed multiple times because of retries.
//
// Compare:
// A. non-idempotent implementation,
// B. idempotency-key-based implementation.
//
// Demonstrate how duplicate execution changes the result.

// -----------------------------------------------------------------------------
// Exercise 12 — Worker Pool
// -----------------------------------------------------------------------------
// Implement a conceptual worker pool with:
// - a queue,
// - configurable worker count,
// - task completion,
// - retry handling.
//
// Measure throughput and queue latency as worker count changes.

// -----------------------------------------------------------------------------
// Exercise 13 — Fan-Out / Fan-In
// -----------------------------------------------------------------------------
// Given several independent computations, implement a fan-out/fan-in workflow.
//
// Measure:
// - sequential latency,
// - concurrent latency,
// - merge overhead.
//
// Add one intentionally slow task and explain its effect on the critical path.

// -----------------------------------------------------------------------------
// Exercise 14 — MapReduce Word Count
// -----------------------------------------------------------------------------
// Implement conceptual MapReduce word counting:
//
// map:
//   document → partial frequency map
//
// reduce:
//   partial maps → global frequency map
//
// Explain what can run independently and where merging is required.

// -----------------------------------------------------------------------------
// Exercise 15 — Partitioning and Skew
// -----------------------------------------------------------------------------
// Partition a dataset among N workers using:
// A. range partitioning,
// B. hash partitioning.
//
// Construct an input distribution that causes severe skew.
//
// Measure the largest partition and explain why total completion time is governed
// by the slowest worker.

// -----------------------------------------------------------------------------
// Exercise 16 — Work Stealing
// -----------------------------------------------------------------------------
// Simulate workers with local task queues.
//
// When a worker becomes idle, allow it to steal work from another worker.
//
// Compare completion time against fixed partition assignment for an uneven task
// distribution.

// -----------------------------------------------------------------------------
// Exercise 17 — Distributed Top-K
// -----------------------------------------------------------------------------
// Split a dataset across several partitions.
//
// Each partition computes local Top-K.
//
// Merge local results into global Top-K.
//
// Prove why examining only local Top-K candidates is sufficient for global Top-K.
//
// Analyze computation and communication volume.

// -----------------------------------------------------------------------------
// Exercise 18 — Distributed Deduplication
// -----------------------------------------------------------------------------
// Events contain unique logical IDs.
//
// Compare:
// A. random partitioning,
// B. partitioning by event ID.
//
// Explain why ID-based ownership can make deduplication partition-local.
//
// Identify what goes wrong when identical IDs can be processed by multiple owners.

// -----------------------------------------------------------------------------
// Exercise 19 — AI Parallel Retrieval
// -----------------------------------------------------------------------------
// Model a sharded retrieval system:
//
// query
//   ↓
// shard A → local Top-K
// shard B → local Top-K
// shard C → local Top-K
//   ↓
// merge → global Top-K
//
// Measure:
// - shard parallelism,
// - network transfer,
// - merge cost,
// - effect of a slow shard.
//
// Explain the trade-off between shard count and coordination overhead.

// -----------------------------------------------------------------------------
// Exercise 20 — Full Distributed Algorithm Design
// -----------------------------------------------------------------------------
// Choose a realistic backend or AI workload and design a distributed algorithm.
//
// Document:
// 1. Sequential baseline.
// 2. Work decomposition.
// 3. Dependency graph.
// 4. Work W.
// 5. Span S.
// 6. Partition strategy.
// 7. Worker model.
// 8. Shared/global state.
// 9. Synchronization requirements.
// 10. Communication cost.
// 11. Serialization cost.
// 12. Load-balancing strategy.
// 13. Data-skew handling.
// 14. Retry behavior.
// 15. Idempotency strategy.
// 16. Ordering guarantees.
// 17. Partial-failure behavior.
// 18. Memory requirements.
// 19. Correctness invariants.
// 20. Expected scalability limits.
//
// Finish by explaining why the distributed design is superior to simply adding
// more workers to the naive implementation.

// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// [ ] I can distinguish concurrency, parallelism, and distribution.
// [ ] I can identify independent work.
// [ ] I can draw a dependency graph.
// [ ] I understand work and span.
// [ ] I can identify a critical path.
// [ ] I understand Amdahl's Law intuition.
// [ ] I understand task granularity.
// [ ] I can reason about race conditions.
// [ ] I understand atomicity.
// [ ] I understand locks and contention.
// [ ] I can identify deadlock.
// [ ] I understand optimistic concurrency.
// [ ] I understand idempotency and retries.
// [ ] I can design a worker pool.
// [ ] I understand fan-out/fan-in.
// [ ] I can reason about MapReduce.
// [ ] I understand partitioning and data skew.
// [ ] I can reason about communication cost.
// [ ] I can design distributed Top-K/deduplication.
// [ ] I can apply distributed algorithmic thinking to backend and AI systems.
