# 12.20 — Heap Algorithms in Backend Systems: Scheduling, Delayed Jobs, Rate Limiting, Caching & Distributed Workflows

## Objective

Translate heap algorithms into backend architecture. The goal is not merely to use a priority queue, but to understand where heap ordering belongs in a production system, what guarantees it provides, and what guarantees must come from other components.

## 1. Heap as a Backend Primitive

A heap is useful when a backend repeatedly needs the next item according to an ordering policy.

Typical policies include:

```text
smallest deadline
highest priority
earliest retry time
nearest expiration
lowest score
```

## 2. Heap Is Not Durable Storage

An in-memory heap provides ordering but normally does not provide durable recovery by itself.

For crash recovery, combine it with durable state such as a database, log, or message broker.

## 3. Job Scheduling

A scheduler can store runnable jobs in a priority queue:

```text
job → priority/deadline → heap → worker
```

The heap answers which eligible job should be considered next.

## 4. Job Lifecycle

A production job often moves through:

```text
CREATED → QUEUED → RUNNING → SUCCEEDED
```

with failure paths such as retry, cancellation, expiration, and dead-lettering.

## 5. Delayed Jobs

A delayed-job scheduler can use a min-heap ordered by `availableAt`.

The scheduler examines the root and releases jobs whose availability time has arrived.

## 6. Sleeping Until the Next Job

If the root is scheduled for the future, the scheduler can wait until that timestamp rather than polling continuously.

This reduces unnecessary CPU work.

## 7. Clock Semantics

Use a well-defined clock model. Wall-clock time can jump because of synchronization or administrative changes; monotonic time is often preferable for measuring durations.

## 8. Retry Scheduling

Failed jobs can be rescheduled using:

```text
nextAttemptAt
→ retry heap
```

The heap then naturally orders the next eligible retries.

## 9. Exponential Backoff

A retry policy may calculate:

```text
delay = min(maxDelay, base × 2^attempt)
```

with jitter to reduce synchronized retry bursts.

## 10. Retry Storms

If a dependency fails, many jobs may become eligible together. A scheduler should consider rate limits, concurrency limits, jitter, and circuit-breaking policies.

## 11. Priority Scheduling

Business priority can be represented explicitly, but priority alone can starve lower-priority work.

Combine priority with fairness or aging when required.

## 12. Deadline Scheduling

For latency-sensitive work, order by deadline or a derived urgency score.

Define behavior for expired jobs explicitly.

## 13. Bounded Priority Queues

An unbounded in-memory queue can become an outage amplifier. Define capacity and overload behavior:

```text
accept
reject
block
shed
persist
```

## 14. Rate Limiting

Heaps can support time-ordered rate-limit events, especially when tokens, leases, or scheduled replenishment have future timestamps.

However, a heap is not always the best rate-limiting primitive; fixed-window, sliding-window, token-bucket, and distributed-counter approaches have different properties.

## 15. Scheduled Token Replenishment

A heap can store future replenishment events:

```text
availableAt → bucket
```

The scheduler processes due events and updates the corresponding limiter state.

## 16. Expiration and TTL

Caches and session systems may maintain expiration timestamps. A min-heap can efficiently identify the nearest expiration.

## 17. Lazy Expiration

Instead of proactively removing every expired object at its exact timestamp, remove or validate entries when they are encountered. This can reduce background work but may retain stale memory.

## 18. Heap + Hash Map Cache

A cache requiring eviction by expiration or priority can combine:

```text
Map → key → entry
Heap → next eviction candidate
```

The map provides direct lookup; the heap provides ordered eviction candidates.

## 19. Stale Cache Entries

If an entry is updated, the old heap record may become stale. Use an entry version, generation number, or indexed heap to distinguish current state from obsolete records.

## 20. Cache Eviction Policies

Heap ordering can implement policies such as earliest expiration or explicit priority. It does not automatically implement true LRU semantics; LRU requires recency ordering and appropriate updates.

## 21. Connection Pools

A backend may prioritize connections by health, idle duration, deadline, or resource cost. A heap can help select candidates, while actual resource validation remains separate.

## 22. Timeout Management

Timeout managers often need:

```text
nearest deadline
→ timer wakeup
→ expire due operations
```

A min-heap is a natural data structure for the deadline frontier.

## 23. Event Scheduling

A discrete event queue stores:

```text
timestamp
sequence
payload
```

and processes the earliest event first.

## 24. Deterministic Tie-Breaking

When timestamps match, sequence numbers provide deterministic ordering. This improves reproducibility and debugging.

## 25. Database Workflows

A backend can use heaps after retrieving candidate work from durable storage. The database remains the source of truth; the heap is a local ordering layer.

## 26. Claiming Work Safely

Before execution, a worker should atomically claim the durable job. Otherwise multiple workers can process the same logical job.

## 27. Idempotency

Retries and duplicate delivery require idempotent handlers or deduplication keys when business semantics demand it.

A heap cannot provide exactly-once side effects.

## 28. Distributed Scheduling

A single process-local heap cannot directly coordinate multiple scheduler instances. Common architectures include:

- one scheduler leader;
- partitioned ownership;
- durable queue partitions;
- broker-backed delayed delivery.

## 29. Leader-Based Scheduler

One scheduler owns the active heap while durable state supports recovery. Failover requires a new owner to rebuild its in-memory ordering state.

## 30. Sharded Scheduling

Jobs can be partitioned by tenant, hash, region, or workload class. Each shard maintains local ordering.

Global priority may then be approximate or coordinated through shard-head structures.

## 31. Database Polling + Heap

A worker system may periodically query durable jobs that are eligible, load a bounded batch into a heap, and process them locally.

This bounds memory while preserving local priority ordering.

## 32. Broker + Heap

A message broker can provide durability and delivery semantics while a local heap reorders a bounded set of messages according to application policy.

## 33. Backpressure

If the local heap fills faster than workers consume it, stop fetching or reduce admission. Pull-based ingestion often makes backpressure easier to control than unrestricted push ingestion.

## 34. Batch Processing

A heap can prioritize a batch of jobs while workers execute concurrently. Batch size creates a trade-off between scheduling visibility, memory, database load, and throughput.

## 35. Multi-Tenant Fairness

One tenant should not necessarily consume all heap capacity. Use per-tenant quotas, separate queues, weighted scheduling, or admission control when isolation is required.

## 36. Priority + Fairness

A useful model is:

```text
eligibility
→ fairness constraint
→ priority
→ deadline
→ sequence
```

The exact ordering should match the product requirement.

## 37. Observability

Track:

- queue depth;
- oldest item age;
- wait time;
- execution latency;
- retry count;
- cancellation count;
- deadline misses;
- per-tenant share;
- heap size;
- stale-entry ratio.

## 38. Queue Health

A rising oldest-item age can indicate overload even when total queue depth looks stable.

Compare arrival rate and service rate over time.

## 39. Failure Recovery

On restart:

```text
durable source
→ load eligible jobs
→ reconstruct heap
→ resume scheduling
```

Recovery must account for jobs that were running when the process failed.

## 40. Leases

A worker can acquire a time-limited lease before execution. If the worker disappears, another worker can reclaim the job after expiration.

## 41. Heap Reconstruction

When recovering many records, bottom-up heap construction can be more efficient than repeated insertion when the entire candidate set is already available.

## 42. Security and Abuse

Priority fields may be user-controlled. Never allow untrusted clients to bypass service quotas simply by assigning extreme priority values.

Validate and normalize priority at the trust boundary.

## 43. AI Inference Scheduling

An AI service may schedule requests based on:

```text
deadline
service class
token estimate
GPU cost
fairness quota
sequence
```

The heap is responsible for ordering candidates; resource admission and quota enforcement remain separate.

## 44. AI Batch Formation

For inference batching, the next request is not always simply the highest priority. Compatibility constraints such as model, sequence length, device, or batching window can affect selection.

This may require multiple queues or bucketed candidate pools.

## 45. Retrieval Systems

A retrieval aggregator can maintain a heap of ranked candidates from multiple sources and emit the global top results without materializing every candidate.

## 46. AI Candidate Expiration

Search and inference candidates may have deadlines or bounded usefulness. A deadline heap can remove candidates that can no longer meet the system's objective.

## 47. Complexity Model

For a local binary heap:

```text
peek          O(1)
insert        O(log N)
extract       O(log N)
update        O(log N) with indexing
build         O(N)
```

But backend cost additionally includes persistence, serialization, synchronization, network, database, and worker execution.

## 48. Correctness Model

For a backend scheduler prove:

1. heap order;
2. eligibility correctness;
3. no duplicate active ownership;
4. cancellation safety;
5. retry-state correctness;
6. capacity enforcement;
7. concurrency limits;
8. recovery behavior.

## 49. Testing Strategy

Use:

- deterministic fake clocks;
- reference schedulers;
- randomized workloads;
- failure injection;
- duplicate delivery tests;
- crash/recovery tests;
- starvation tests;
- load-saturation tests.

## 50. Benchmarking

Measure:

- enqueue throughput;
- dequeue throughput;
- scheduling latency;
- worker utilization;
- database/broker load;
- memory;
- p95/p99 wait time;
- fairness;
- recovery time.

## 51. Common Mistakes

1. Treating an in-memory heap as durable scheduling state.
2. Assuming priority prevents starvation.
3. Polling aggressively instead of sleeping until the next deadline.
4. Ignoring stale entries in lazy-expiration designs.
5. Forgetting atomic job claims.
6. Confusing queue ordering with execution guarantees.
7. Ignoring overload and backpressure.
8. Letting untrusted priority values bypass quotas.

## 52. Production Design Framework

```text
Define job semantics
→ define durable source of truth
→ define eligibility
→ define priority/deadline policy
→ choose heap/indexed heap/multiple queues
→ bound memory
→ enforce admission + concurrency
→ handle retry/cancel/expiration
→ instrument queue health
→ design recovery
→ test adversarial workloads
→ benchmark tail latency
```

## Revision Checklist

- [ ] I can use heaps for backend job scheduling.
- [ ] I understand delayed-job and timeout queues.
- [ ] I can combine heaps with maps for cache expiration.
- [ ] I understand retry scheduling and backoff.
- [ ] I can design bounded scheduling with backpressure.
- [ ] I understand distributed scheduling trade-offs.
- [ ] I can design durable recovery around an in-memory heap.
- [ ] I can apply heaps to AI inference and retrieval systems.
- [ ] I can define correctness and observability requirements.

## Key Takeaways

1. **A heap provides local ordering; durability, ownership, fairness, and execution guarantees require additional system components.**
2. **Delayed jobs, retries, timeouts, expiration, and event scheduling are natural deadline-ordered heap workloads.**
3. **Maps and heaps complement each other: maps provide identity lookup while heaps provide ordered selection.**
4. **Production schedulers must explicitly handle overload, cancellation, retries, fairness, recovery, and concurrency.**
5. **For backend and AI systems, the heap is one layer inside a larger scheduling architecture.**
