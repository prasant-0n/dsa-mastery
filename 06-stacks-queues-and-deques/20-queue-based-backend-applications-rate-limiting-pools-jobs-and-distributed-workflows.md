# 06.20 — Queue-Based Backend Applications: Rate Limiting, Connection Pools, Job Systems & Distributed Workflows

> **Phase 06 — Stacks, Queues & Deques**
>
> Queues become truly valuable when they coordinate real backend resources. This chapter applies queue, deque, and priority-queue reasoning to rate limiting, connection pools, background jobs, retries, delayed work, distributed consumers, workflow orchestration, and AI-serving infrastructure.

## 1. Learning Objectives

You will learn to:

- recognize queue-shaped backend problems;
- design rate limiters using queues and time windows;
- manage bounded connection pools;
- build worker/job queues;
- reason about retries, visibility timeouts, and dead-letter queues;
- understand delayed and scheduled jobs;
- design fair multi-tenant workers;
- reason about idempotency and duplicate delivery;
- model distributed workflow state;
- connect queue semantics to Node.js backend systems;
- design AI task queues around token, GPU, and latency constraints.

---

## 2. Queue as a Backend Primitive

A backend queue separates:

```text
producer
   ↓
work boundary
   ↓
consumer
```

This decouples arrival from processing and allows buffering, retries, batching, and controlled concurrency.

---

## 3. Why Queue Instead of Direct Execution?

Direct execution:

```text
request → expensive operation → response
```

Queue-based execution:

```text
request → enqueue → response accepted
                  ↓
                worker
```

Benefits include:

```text
load smoothing
fault isolation
retryability
horizontal scaling
bounded concurrency
```

The trade-off is increased complexity and often eventual rather than immediate completion.

---

## 4. Queue vs Cache vs Log

These primitives are different.

### Queue

Usually each item is intended for one processing path.

### Cache

Optimizes repeated access to existing data.

### Log / stream

Persists an ordered history that may be consumed by multiple independent consumers.

Choosing the wrong abstraction creates operational problems later.

---

## 5. Rate Limiting with a Queue

A sliding-window rate limiter can store recent timestamps:

```text
[101][105][108][112]
 ↑
oldest
```

On each request:

```text
remove expired timestamps
if count < limit → allow
else → reject
```

A deque is a natural structure for this policy.

---

## 6. Token Bucket

Token bucket models a replenishing resource:

```text
tokens accumulate over time
requests consume tokens
```

It supports controlled bursts while enforcing a long-term rate.

The implementation may not require an actual queue, but queueing concepts help reason about pending work.

---

## 7. Leaky Bucket

Leaky bucket approximates a fixed processing rate:

```text
incoming → queue → constant-rate output
```

The queue absorbs short bursts while output remains bounded.

---

## 8. Rate Limiting Dimensions

Production systems may limit by:

```text
IP
user
API key
tenant
endpoint
region
resource
```

A robust key design prevents one actor from consuming another actor's quota.

---

## 9. Connection Pool

A connection pool is effectively a bounded resource queue.

Conceptually:

```text
available connections → idle queue
busy connections      → in-use set
waiting requests      → wait queue
```

A request either acquires a connection or waits/rejects according to policy.

---

## 10. Pool Invariants

For capacity K:

```text
idle + busy ≤ K
```

A connection must not simultaneously appear as both idle and busy.

Released connections must return to exactly one ownership state.

---

## 11. Pool Timeout

A waiting request should not necessarily wait forever.

Define:

```text
acquisition timeout
maximum queue depth
cancellation behavior
```

Otherwise downstream slowness can become unbounded request latency.

---

## 12. Pool Fairness

FIFO acquisition is often desirable:

```text
oldest waiter → next connection
```

But priorities may be required for administrative or critical traffic.

Again, fairness and priority must be explicit policies.

---

## 13. Background Job Queue

Typical architecture:

```text
API
 ↓
job store / broker
 ↓
workers
 ↓
external side effect
```

Examples:

```text
email
PDF generation
image processing
webhooks
billing tasks
report generation
```

---

## 14. Job State Machine

A job should have explicit states such as:

```text
queued
leased
running
succeeded
failed
retrying
cancelled
dead-lettered
```

Do not treat queue membership alone as the complete source of truth for workflow state.

---

## 15. Visibility Timeout

A worker may temporarily own a job.

If it crashes, the job should become eligible again after a visibility timeout.

Conceptually:

```text
queued → leased
          ↓
       timeout
          ↓
       available
```

This supports at-least-once processing.

---

## 16. Acknowledgement

A worker should acknowledge successful processing according to the queue's delivery contract.

Failure before acknowledgement can cause redelivery.

Therefore handlers must be designed for duplicate delivery when using at-least-once semantics.

---

## 17. Idempotency

An idempotent operation can safely tolerate repeated execution.

Example:

```text
process payment request with idempotency key X
```

A duplicate request should not produce an unintended duplicate side effect.

Queue reliability and idempotency are complementary concerns.

---

## 18. Retry Policy

Retries should be bounded and deliberate.

Common strategy:

```text
attempt 1 → short delay
attempt 2 → longer delay
attempt 3 → longer delay
```

Exponential backoff with jitter reduces synchronized retry storms.

---

## 19. Retry Classification

Not every error should be retried.

### Often retryable

```text
transient network error
temporary overload
connection reset
```

### Often not retryable

```text
invalid input
authentication failure
permanent validation error
```

Blind retries amplify failures.

---

## 20. Dead-Letter Queue

After retry limits are exhausted:

```text
main queue → DLQ
```

The DLQ preserves failed work for investigation, repair, replay, or controlled deletion.

It should be observable and governed by retention policy.

---

## 21. Delayed Jobs

A delayed job has:

```text
availableAt
```

A priority queue ordered by timestamp is a natural in-memory model.

Workers extract jobs whose availability time has arrived.

---

## 22. Scheduled Work

A scheduler can combine:

```text
delay timestamp
priority
retry attempt
sequence number
```

Use deterministic tie-breaking so identical timestamps do not produce unpredictable behavior.

---

## 23. Fair Worker Scheduling

A single FIFO may allow one tenant to dominate if it continuously produces work.

Per-tenant queues plus fair scheduling provide stronger isolation:

```text
tenant A queue ─┐
tenant B queue ─┼→ fair scheduler → workers
tenant C queue ─┘
```

---

## 24. Concurrency Limits

Workers should have explicit limits:

```text
max concurrent jobs
max concurrent DB queries
max external API requests
max memory-heavy tasks
```

A queue without a concurrency limit can still overload downstream systems.

---

## 25. Backpressure

If consumers cannot keep up:

```text
queue depth ↑
latency ↑
capacity → exhausted
```

Options include:

```text
reject
shed
slow producers
increase workers
batch
prioritize
```

---

## 26. Batch Workers

Workers can process jobs in groups:

```text
10 DB writes
→ one transaction/batch
```

or:

```text
N inference requests
→ one GPU batch
```

Batching improves efficiency but may increase wait time.

---

## 27. Queue Partitioning

Partition by:

```text
tenant
region
job type
priority
resource requirement
```

Partitioning reduces contention and can isolate failures.

But too many partitions can cause idle capacity and scheduling complexity.

---

## 28. Ordering Guarantees

Ask:

```text
FIFO globally?
FIFO per tenant?
FIFO per key?
No ordering guarantee?
```

Strong global ordering can limit parallelism.

Often the best compromise is ordering within a business key.

---

## 29. Exactly-Once Effects

Distributed queues commonly provide at-least-once delivery rather than magical exactly-once execution.

To achieve effectively-once business effects, combine:

```text
idempotency
transactional state
unique constraints
outbox/inbox patterns
```

---

## 30. Transactional Outbox

When a database update and event publication must remain consistent:

```text
transaction
 ├─ update business data
 └─ write outbox event
```

A separate publisher reads the outbox and sends events.

This prevents the classic failure where the database commits but the message is lost.

---

## 31. Inbox / Deduplication

A consumer can store processed message identifiers:

```text
messageId → processed
```

A duplicate delivery can then be detected and safely ignored.

Storage and cleanup policy are part of the design.

---

## 32. Distributed Queue vs Local Queue

### Local queue

```text
low latency
simple
process-local
```

### Distributed queue

```text
shared
persistent options
multiple consumers
cross-process coordination
```

Choose based on durability, scale, ownership, and failure boundaries.

---

## 33. Queue as a Failure Boundary

A queue can isolate:

```text
API → email provider
API → payment provider
API → ML inference
```

If the downstream dependency slows, the API does not necessarily block on every operation.

But the queue itself must have capacity and overload policies.

---

## 34. Poison Messages

A poison message repeatedly fails and consumes retry capacity.

Controls include:

```text
retry limit
DLQ
error classification
quarantine
manual replay
```

Never allow one permanently invalid job to create an infinite retry loop.

---

## 35. Queue Observability

Track:

```text
queue depth
oldest item age
enqueue rate
dequeue rate
processing latency
retry rate
DLQ rate
success rate
failure rate
```

The age of the oldest item is often a powerful signal of consumer lag.

---

## 36. Queue Health

A queue is healthy when:

```text
backlog remains bounded
workers remain productive
latency meets SLO
failures are controlled
capacity remains available
```

A permanently near-empty queue is not automatically healthier than a queue with a small stable backlog.

---

## 37. Node.js Worker Model

In Node.js, background work may use:

```text
process-local async workers
Worker Threads
separate worker processes
external job workers
```

CPU-heavy work should not block the main event loop.

External queues become valuable when work must survive process boundaries or scale independently.

---

## 38. Database Work Queues

A database can sometimes act as a work queue using row state and locking semantics.

Conceptually:

```text
pending rows
 ↓
claim safely
 ↓
process
 ↓
mark complete
```

This can be useful at modest scale, but contention, cleanup, and query-planning costs must be measured.

---

## 39. AI Task Queue

An AI gateway may queue:

```text
embedding jobs
retrieval tasks
agent actions
model inference
batch generation
fine-tuning jobs
```

Scheduling may consider:

```text
token budget
GPU memory
latency SLO
tenant priority
batch compatibility
```

---

## 40. AI Backpressure

If model throughput is lower than request arrival rate:

```text
queue grows
GPU utilization reaches saturation
latency explodes
```

A strong system may reject low-value work before queue latency becomes unacceptable.

---

## 41. Security and Abuse

Queues can be attacked through:

```text
unbounded submissions
huge payloads
retry amplification
priority abuse
tenant flooding
```

Apply authentication, quotas, payload limits, and resource-aware admission control.

---

## 42. Production Failure Modes

Watch for:

```text
unbounded backlog
stuck jobs
duplicate side effects
retry storms
poison messages
connection leaks
priority starvation
clock skew
worker crashes
DLQ accumulation
```

Every failure mode needs a detection and recovery path.

---

## 43. Interview Design Framework

For a backend queue problem:

```text
1. Define work semantics.
2. Define ordering.
3. Define capacity.
4. Define concurrency.
5. Define delivery semantics.
6. Define acknowledgement.
7. Define retry policy.
8. Define idempotency.
9. Define failure recovery.
10. Define fairness/quotas.
11. Define observability.
12. State complexity and bottlenecks.
```

---

## 44. Revision Checklist

- [ ] I can design a sliding-window rate limiter.
- [ ] I understand token and leaky bucket models.
- [ ] I can model a connection pool as bounded resources.
- [ ] I can design a background job system.
- [ ] I understand visibility timeouts and acknowledgement.
- [ ] I understand at-least-once delivery.
- [ ] I can design idempotent consumers.
- [ ] I can design bounded retries and DLQs.
- [ ] I understand delayed jobs.
- [ ] I can design fair multi-tenant workers.
- [ ] I understand transactional outbox/inbox patterns.
- [ ] I can define queue observability metrics.
- [ ] I can design a Node.js worker architecture.
- [ ] I can design an AI task queue with token/GPU constraints.
- [ ] I can explain queue failure modes in an interview.

---

## 45. Key Takeaways

1. Backend queues are resource and failure boundaries, not merely FIFO containers.
2. Rate limiters, connection pools, worker systems, and delayed jobs all contain queue-like state.
3. Delivery semantics must be explicit: at-most-once, at-least-once, and effectively-once effects are different.
4. Idempotency is essential when duplicate processing is possible.
5. Retries require bounded policy, backoff, and dead-letter handling.
6. Tenant fairness and concurrency limits protect shared infrastructure.
7. Transactional outbox/inbox patterns connect queues with database correctness.
8. Queue depth and oldest-item age are critical operational signals.
9. AI workloads add token cost, GPU capacity, batching, and latency constraints.
10. Production queue design is the combination of data structures, distributed semantics, resource limits, and failure recovery.
