# 06.13 — Stack & Queue Applications: Algorithms, Scheduling, Caching & Backend Systems

> **Phase 06 — Stacks, Queues & Deques**
>
> This chapter turns stacks, queues, and deques from isolated data structures into reusable engineering components. The focus is choosing an ordering model, defining operational contracts, and designing systems that remain correct under load, failure, cancellation, retries, and memory pressure.

---

## 1. Learning Objectives

By the end, you should be able to:

- map real problems to stack/queue/deque semantics;
- distinguish LIFO, FIFO, double-ended, priority, and history-based workloads;
- design task queues and worker pipelines;
- reason about scheduling and fairness;
- build undo/redo and browser-history models;
- understand queue-backed caching and LRU architecture;
- design bounded queues and backpressure;
- reason about retries, dead letters, cancellation, and idempotency;
- connect BFS/DFS to production traversal systems;
- analyze memory, latency, throughput, and failure modes;
- defend a data-structure choice in backend and AI interviews.

---

## 2. Start With Ordering Semantics

Before selecting a structure, identify the required order:

```text
LIFO                  → stack
FIFO                  → queue
both ends             → deque
highest priority      → heap / priority queue
recent history        → stack or doubly linked history
recent + eviction     → LRU map + doubly linked list
```

The data structure is a consequence of the required semantics.

---

## 3. Algorithmic Applications

Stacks naturally support:

- DFS;
- backtracking;
- expression parsing;
- delimiter matching;
- monotonic patterns;
- undo operations.

Queues naturally support:

- BFS;
- level-order traversal;
- task processing;
- producer/consumer pipelines;
- rate-limited work;
- event buffering.

Deques support:

- 0-1 BFS;
- sliding-window extrema;
- bounded candidate frontiers;
- two-ended scheduling policies.

---

## 4. DFS as an Explicit Stack

Recursive DFS uses the language call stack.

An iterative implementation moves that state into an explicit stack:

```text
stack.push(source)

while stack not empty
    state = stack.pop()
    process(state)
    push children
```

The explicit form gives control over:

```text
memory limits
pausing/resuming
serialization
instrumentation
cancellation
```

These properties matter in backend services.

---

## 5. BFS as a Queue

BFS maps naturally to:

```text
enqueue discovered state
dequeue next frontier state
```

This is useful when processing work by discovery layer or shortest unweighted distance.

The production version may need:

```text
visited state
persistent frontier
retry semantics
rate limiting
parallel workers
```

A textbook queue alone does not provide these guarantees.

---

## 6. Producer–Consumer Architecture

A common backend pattern is:

```text
Producer
   ↓
Bounded Queue
   ↓
Workers
   ↓
Side Effects
```

The queue decouples production rate from consumption rate.

But it also creates a new state boundary that needs explicit capacity and failure semantics.

---

## 7. Why Bounded Queues Matter

An unbounded queue can turn traffic spikes into memory exhaustion.

A bounded queue defines a hard resource boundary:

```text
queue size ≤ capacity
```

When full, choose deliberately:

```text
reject
block
shed load
prioritize
spill
retry upstream
```

The correct policy depends on business requirements.

---

## 8. Backpressure

Backpressure means downstream capacity influences upstream production.

Example:

```text
API → queue → worker
             ↓
          saturated
```

The system should not blindly continue accepting work forever.

Backpressure may be implemented through:

```text
bounded buffers
rate limits
producer throttling
concurrency limits
admission control
```

---

## 9. Queue Depth Is a Signal

Queue depth can indicate:

```text
arrival rate > service rate
```

for a sustained period.

Useful metrics include:

```text
current depth
maximum depth
oldest item age
enqueue rate
dequeue rate
processing latency
rejection count
```

Queue depth alone is not enough; age often reveals user-visible delay more directly.

---

## 10. Little's-Law Intuition

For a stable system, queueing theory gives the relationship:

```text
L = λW
```

where:

```text
L = average number of items in system
λ = throughput / arrival rate
W = average time in system
```

This provides a powerful engineering intuition:

> If throughput stays fixed, increasing the amount of queued work increases the time work spends in the system.

It is a useful bridge from DSA to backend performance reasoning.

---

## 11. Worker Pools

A worker pool limits concurrent processing:

```text
queue
 ↓↓↓
worker worker worker
```

Important parameters:

```text
queue capacity
worker count
job timeout
retry count
shutdown behavior
```

Increasing worker count does not always increase throughput. Bottlenecks may simply move to:

```text
database
network
CPU
external API
rate limits
```

---

## 12. Fairness

FIFO provides basic arrival fairness.

But multi-tenant systems may require:

```text
tenant quotas
weighted fairness
priority classes
round-robin scheduling
starvation prevention
```

A single FIFO queue may allow one noisy tenant to dominate the system.

The data structure must support the fairness model actually required.

---

## 13. Priority vs FIFO

Do not solve a priority problem with FIFO.

If jobs have:

```text
priority = 1, 2, 3, ...
```

and the lowest number must run first, a priority queue is the natural structure.

A deque with “urgent at front” supports only a limited two-class policy unless additional ordering logic is introduced.

---

## 14. Retry Queues

A failed job may be scheduled again:

```text
attempt 1 → fail
attempt 2 → fail
attempt 3 → success
```

Retry design should define:

```text
maximum attempts
backoff
jitter
next-attempt time
idempotency
poison-job handling
```

A plain FIFO queue does not automatically implement delayed retries.

---

## 15. Dead-Letter Queues

Jobs that repeatedly fail should not necessarily block healthy work forever.

A dead-letter queue can isolate permanently problematic jobs:

```text
main queue → retry → DLQ
```

This protects throughput while preserving failed work for inspection or recovery.

---

## 16. Idempotency

Retries can duplicate execution.

For side-effecting jobs, use an idempotency strategy such as:

```text
jobId
idempotency key
processed-event record
unique database constraint
```

The key principle is:

> Queue semantics do not guarantee exactly-once business effects.

Exactly-once processing is much harder than exactly-once delivery of a data structure operation.

---

## 17. Cancellation

Queued work may become irrelevant:

```text
HTTP request cancelled
user closed job
request deadline expired
workflow superseded
```

A queue should define whether cancellation means:

```text
remove before execution
mark cancelled
skip when dequeued
attempt to stop active work
```

Removing arbitrary middle elements may change the complexity of a simple queue, so cancellation can require an auxiliary index or tombstone strategy.

---

## 18. Graceful Shutdown

A worker service should distinguish:

```text
stop accepting new work
finish accepted work
cancel remaining work
persist unfinished work
exit
```

A queue implementation should not silently lose in-flight jobs during process termination.

Production durability may require an external persistent queue rather than an in-memory structure.

---

## 19. LRU Cache Architecture

A classic LRU cache combines:

```text
Hash Map + Doubly Linked List
```

The map provides:

```text
key → node
```

The list provides recency order:

```text
least recent ← ... → most recent
```

Then:

```text
get(key) → move node to MRU
set(key) → insert/move node to MRU
capacity exceeded → evict LRU
```

This produces expected O(1) operations under standard hash-table assumptions.

---

## 20. Why a Queue Alone Cannot Implement LRU Efficiently

LRU requires moving an arbitrary accessed entry to the most-recent end.

A simple FIFO queue does not support arbitrary node movement efficiently.

The combination of:

```text
Map → identity lookup
Doubly linked list → O(1) node relocation
```

solves the problem.

This is an important example of composing data structures.

---

## 21. Browser History

A simple browser history can use two stacks:

```text
backStack
forwardStack
```

Navigate to a new page:

```text
current → backStack
clear forwardStack
current = newPage
```

Back:

```text
current → forwardStack
backStack.pop() → current
```

Forward reverses that movement.

---

## 22. Undo/Redo Systems

The same two-stack model supports editors:

```text
undo stack
redo stack
```

After a new edit:

```text
record edit
clear redo history
```

Undo moves an operation to redo.

Redo moves it back to undo.

This is a semantic history model, not merely a stack exercise.

---

## 23. Snapshot vs Inverse Operation

Undo can store:

### Snapshot

```text
state before edit
```

Simple but potentially memory-heavy.

### Inverse operation

```text
insert X → inverse = delete X
```

More memory-efficient but requires correct inverse semantics.

### Persistent state

Share immutable structure between versions.

This can reduce copying but introduces structural-sharing complexity.

---

## 24. Cache Eviction and Memory Bounds

Caches need explicit resource limits:

```text
maximum entries
maximum bytes
TTL
LRU/LFU policy
```

A cache without a bound is a memory-growth mechanism, not a reliable cache.

---

## 25. Queueing Database Work

A backend may queue expensive database jobs:

```text
HTTP
 ↓
queue
 ↓
worker
 ↓
DB
```

But this does not eliminate database constraints.

You still need:

```text
connection pool limits
transaction boundaries
timeouts
retries
idempotency
ordering requirements
```

Queues move work in time; they do not make expensive work free.

---

## 26. Rate Limiting With a Deque

A timestamp deque can maintain requests in a sliding time window.

For each request:

```text
remove expired timestamps
if count >= limit → reject
else append timestamp
```

This gives a clear local algorithm.

Distributed rate limiting requires additional architecture for shared/global state.

---

## 27. Stack-Based Request Context

Stacks also model nested execution contexts:

```text
request
  → middleware
    → transaction
      → operation
```

Push entering context; pop leaving it.

This mental model appears in:

```text
call stacks
scope management
nested transactions
resource acquisition/release
parser states
```

---

## 28. Exception-Safe Cleanup

Resource lifetimes often behave like stack scopes:

```text
acquire A
  acquire B
    acquire C
    release C
  release B
release A
```

Last acquired resource is released first.

This is the same LIFO principle as a stack and is closely related to RAII/defer/finally-style cleanup patterns.

---

## 29. AI Inference Queue

An AI gateway may receive:

```text
user requests
batch requests
embedding jobs
retrieval jobs
agent tasks
```

A queue can provide:

```text
buffering
concurrency control
admission control
batch accumulation
```

But AI workloads often need richer scheduling:

```text
priority
deadline
batch compatibility
tenant fairness
cancellation
GPU utilization
```

A FIFO queue may therefore be only one component.

---

## 30. AI Search Frontier

Search algorithms map to frontier structures:

```text
DFS       → stack
BFS       → queue
0-1 BFS   → deque
best-first → heap
beam      → bounded ranked frontier
```

The frontier is effectively the algorithm's scheduling policy for future computation.

---

## 31. Queueing and Latency in AI Systems

If model service time increases while arrival rate stays constant, queued work grows.

Consequences include:

```text
higher latency
more memory
request expiry
cancellation
reduced user experience
```

Therefore AI systems need admission control and load shedding, not merely larger queues.

---

## 32. Persistence Boundary

An in-memory queue disappears when the process crashes.

If work must survive failure, use a durable mechanism such as a database-backed outbox or external message system.

The in-memory DSA structure can still be useful inside a worker, but it should not be mistaken for durable storage.

---

## 33. Observability

Instrument queue-based components with:

```text
queue depth
oldest item age
enqueue/dequeue rate
processing latency
failure rate
retry count
cancellation count
capacity utilization
```

These measurements let operators distinguish:

```text
traffic spike
slow worker
database bottleneck
retry storm
consumer outage
```

---

## 34. Security and Resource Exhaustion

Queues can be abused through:

```text
unbounded requests
large payloads
many low-value jobs
retry amplification
tenant flooding
```

Defenses include:

```text
authentication
quotas
payload limits
queue limits
per-tenant limits
rate limits
circuit breakers
```

Resource limits are part of correctness for production systems.

---

## 35. Testing Strategy

Use three levels:

### Unit tests

Validate individual operations and invariants.

### Differential tests

Compare against simple reference models.

### System tests

Test:

```text
burst load
worker failure
retry storms
cancellation
shutdown
full queue
slow downstream
```

A queue that passes unit tests can still fail as a system.

---

## 36. Performance Testing

Measure:

```text
throughput
p50/p95/p99 latency
memory
allocation rate
GC pressure
queue wait time
worker utilization
```

Do not optimize only dequeue/enqueue microbenchmarks when the real bottleneck is database or network I/O.

---

## 37. Architecture Decision Framework

When designing a real system:

```text
1. Identify ordering semantics.
2. Identify durability requirements.
3. Define capacity.
4. Define overflow behavior.
5. Define concurrency.
6. Define retry semantics.
7. Define cancellation.
8. Define fairness.
9. Define observability.
10. Define failure recovery.
11. Select the DSA representation.
12. Benchmark the actual workload.
```

This prevents choosing a data structure before understanding the system.

---

## 38. Interview Framework

For a backend queue problem, explain:

```text
ADT semantics
→ representation
→ invariants
→ complexity
→ capacity
→ backpressure
→ concurrency
→ retries
→ idempotency
→ cancellation
→ persistence
→ observability
→ failure modes
```

For a cache problem, explain the Map + linked-list composition.

For a scheduling problem, explicitly identify whether FIFO, deque, or priority ordering is required.

---

## 39. Revision Checklist

- [ ] I can map workloads to stack/queue/deque semantics.
- [ ] I can explain iterative DFS and BFS.
- [ ] I understand producer-consumer queues.
- [ ] I can design bounded queues and backpressure.
- [ ] I understand worker pools and fairness.
- [ ] I understand retry and dead-letter queues.
- [ ] I understand idempotency under retries.
- [ ] I can design cancellation semantics.
- [ ] I understand LRU as Map + doubly linked list.
- [ ] I can model browser history and undo/redo.
- [ ] I understand snapshot vs inverse-operation history.
- [ ] I can connect deques to rate limiting.
- [ ] I can design AI inference queues.
- [ ] I can reason about durability and shutdown.
- [ ] I can defend production queue architecture in an interview.

---

## 40. Key Takeaways

1. Stack, queue, and deque semantics are ordering policies, not just data structures.
2. Backend queues decouple producers and consumers but introduce capacity and failure boundaries.
3. Bounded queues and backpressure protect systems from uncontrolled memory growth.
4. FIFO does not solve arbitrary priority or fairness requirements.
5. Retries require idempotency and poison-job handling.
6. LRU demonstrates why multiple data structures are often composed to achieve a target complexity.
7. Undo/redo is a state-history problem naturally modeled with stacks.
8. In-memory queues are not durable message systems.
9. AI inference and search workloads often need richer frontier policies than plain FIFO.
10. Production-grade DSA means connecting the abstract invariant to memory, concurrency, failure, and operational behavior.
