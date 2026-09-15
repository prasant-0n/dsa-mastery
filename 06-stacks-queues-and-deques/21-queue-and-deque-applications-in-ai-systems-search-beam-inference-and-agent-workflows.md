# 06.21 — Queue & Deque Applications in AI Systems: Search, Beam Search, Inference Scheduling & Agent Workflows

> **Phase 06 — Stacks, Queues & Deques**
>
> This chapter turns queues, deques, and priority queues into AI-engineering tools. The goal is not to memorize AI frameworks; it is to understand how frontier management, beam search, inference scheduling, agent workflows, streaming generation, batching, cancellation, and resource-aware execution reduce to disciplined data-structure and algorithm choices.

## 1. Learning Objectives

You will learn to:

- model AI search as frontier management;
- distinguish FIFO search from priority-driven search;
- understand beam search with bounded candidate sets;
- use deques for frontier expansion and 0-1 style state transitions;
- design inference request queues;
- schedule requests using latency, priority, token, and resource constraints;
- reason about continuous batching and micro-batching;
- manage streaming outputs and cancellation;
- design agent task queues and workflow frontiers;
- reason about fairness and tenant isolation;
- understand speculative and parallel search scheduling;
- connect these ideas to Node.js backend and AI-serving systems.

---

## 2. AI Systems Are Full of Queues

Common queue-shaped AI workloads:

```text
user requests
embedding jobs
retrieval tasks
reranking
model inference
agent actions
tool calls
training jobs
evaluation jobs
batch generation
```

The algorithmic question is always:

```text
What work is waiting?
Who owns it?
Which work should execute next?
How much can execute safely?
What happens when execution fails?
```

---

## 3. Frontier as a Data Structure

Search algorithms maintain a frontier of unexplored states.

```text
visited states
      ↓
   frontier
      ↓
new states
```

The frontier's data structure determines the search policy.

```text
FIFO queue      → breadth-first behavior
LIFO stack      → depth-first behavior
priority queue  → best-first behavior
deque           → double-ended frontier policy
```

This is one of the most important bridges between classical DSA and AI algorithms.

---

## 4. Breadth-First Search in AI

BFS explores states by depth:

```text
level 0
  ↓
level 1
  ↓
level 2
```

A queue ensures that earlier levels are processed before later levels.

Applications include shallow planning, state-space exploration, and unweighted transition problems.

---

## 5. Beam Search

Beam search keeps only the best B candidates at each expansion stage.

```text
all candidates
      ↓
score
      ↓
keep top B
```

The bounded frontier prevents exponential growth from consuming unlimited memory.

---

## 6. Beam Width as a Resource Constraint

Larger beam width:

```text
more candidates
higher compute
higher memory
potentially better search
```

Smaller beam width:

```text
less compute
less memory
faster pruning
higher risk of discarding useful paths
```

Beam width is therefore an algorithmic and systems parameter.

---

## 7. Priority Queue for Best-First Search

A priority queue chooses the highest-value candidate:

```text
candidate → score → next expansion
```

This pattern appears in:

```text
best-first search
A* search
candidate ranking
retrieval prioritization
agent planning
```

The queue ordering policy is part of the algorithm's correctness and behavior.

---

## 8. Top-K Frontier Management

If only K candidates matter, avoid sorting every candidate when possible.

A bounded heap can maintain the current top K.

For N candidates:

```text
full sort: O(N log N)
bounded heap: O(N log K)
```

When K ≪ N, this can materially reduce work.

---

## 9. Deque for Bidirectional Search

Bidirectional search expands from two sides:

```text
start → → → meeting point ← ← ← goal
```

A deque can help manage work from either frontier depending on the strategy.

The important idea is not merely using a deque; it is controlling which side receives expansion budget.

---

## 10. 0-1 BFS

When graph edges have weights only 0 or 1, a deque provides an efficient frontier policy.

```text
weight 0 → push front
weight 1 → push back
```

This gives O(V + E) time for the standard formulation.

It is a classic example of choosing a data structure based on transition cost.

---

## 11. AI Search State

An AI search state may contain:

```text
state
parent
score
cost
depth
actions
constraints
metadata
```

Avoid copying large state objects unnecessarily.

Store compact identifiers and reconstruct paths when appropriate.

---

## 12. Duplicate States

Search can repeatedly discover the same state.

Use:

```text
visited set
best-cost map
transposition table
state hash
```

The queue alone does not prevent duplicate exploration.

---

## 13. Inference Request Queue

An inference service can model requests as:

```text
incoming requests
      ↓
admission queue
      ↓
scheduler
      ↓
batching
      ↓
model
      ↓
stream results
```

This separates arrival from model execution.

---

## 14. Request Metadata

A useful inference queue item may contain:

```text
requestId
tenantId
priority
arrivalTime
deadline
inputTokens
maxOutputTokens
model
status
cancellation signal
```

Scheduling becomes resource-aware rather than simple FIFO.

---

## 15. FIFO Inference Scheduling

FIFO is easy to understand and provides predictable ordering.

But it can cause head-of-line blocking:

```text
large request
      ↓
small requests wait
```

Therefore FIFO is a policy, not automatically the optimal policy.

---

## 16. Shortest-Job-Aware Scheduling

If estimated work is available, smaller requests may be prioritized to improve throughput or mean latency.

But always choosing short requests can starve large requests.

Fairness must therefore be explicit.

---

## 17. Deadline-Aware Scheduling

Requests with latency SLOs may carry deadlines.

A scheduler can prioritize work according to slack:

```text
slack = deadline - estimated completion time
```

Near-deadline work may deserve higher priority.

Incorrect estimates can still cause poor scheduling, so instrumentation matters.

---

## 18. Token-Aware Scheduling

LLM inference cost correlates strongly with token counts.

A scheduler may consider:

```text
input tokens
predicted output tokens
KV-cache requirements
batch compatibility
```

Two requests are not necessarily equal units of work.

---

## 19. Continuous Batching

Instead of waiting for a static batch to finish completely, new compatible requests can join execution opportunities as capacity becomes available.

Conceptually:

```text
request A ─┐
request B ─┼→ active batch
request C ─┘
             ↑
        new work joins
```

This can improve accelerator utilization but makes scheduling and cancellation more complex.

---

## 20. Micro-Batching

A micro-batcher waits for either:

```text
batch size threshold
OR
maximum wait time
```

This balances:

```text
throughput ↔ latency
```

Never optimize batch size without measuring end-to-end latency.

---

## 21. Queueing Delay

Total request latency can be decomposed as:

```text
arrival
 + queue wait
 + scheduling
 + batching wait
 + model execution
 + output streaming
```

Reducing model execution time alone may not improve user latency if queueing dominates.

---

## 22. Little's Law

For a stable system:

```text
L = λW
```

where:

```text
L = average work in system
λ = arrival rate
W = average time in system
```

This gives AI engineers a powerful sanity check for queue depth and latency.

---

## 23. Backpressure in AI Serving

If arrival rate exceeds sustainable throughput:

```text
queue depth ↑
wait time ↑
GPU utilization saturates
memory pressure ↑
```

Eventually the system must:

```text
reject
shed
throttle
prioritize
batch
scale
```

A queue does not create capacity.

---

## 24. Cancellation

Users may cancel streaming inference.

Cancellation should propagate through:

```text
HTTP request
 ↓
queue item
 ↓
scheduler
 ↓
model execution
 ↓
stream
```

Cancelled work should stop consuming scarce resources as early as safely possible.

---

## 25. Streaming Output Queue

Streaming generation produces incremental chunks:

```text
token 1
 token 2
 token 3
 ...
```

A bounded output queue prevents a slow client from causing unlimited memory growth.

This creates a second backpressure boundary after model execution.

---

## 26. Agent Workflow Queue

An agent can be modeled as a work graph:

```text
plan
 ↓
task queue
 ↓
tool execution
 ↓
new tasks
 ↓
queue again
```

The queue controls which pending actions receive execution budget.

---

## 27. Agent Priority

Potential priorities:

```text
user-visible response
safety validation
critical tool call
background enrichment
telemetry
```

Priority must not become an uncontrolled bypass around safety or resource limits.

---

## 28. Dependency-Aware Scheduling

An agent task may depend on another task:

```text
retrieve data
     ↓
summarize data
     ↓
call tool
```

Only ready tasks belong in the executable frontier.

This turns the problem into dependency-aware scheduling rather than ordinary FIFO processing.

---

## 29. Parallel Agent Tasks

Independent tasks can execute concurrently:

```text
       ┌→ search A ─┐
plan ──┼→ search B ─┼→ synthesize
       └→ search C ─┘
```

The scheduler needs:

```text
concurrency limit
failure handling
cancellation
result aggregation
```

---

## 30. Work Stealing for AI Search

Parallel workers can maintain local deques.

```text
worker A deque
worker B deque
worker C deque
```

Workers process local work efficiently and steal from another worker when idle.

This reduces contention compared with a single globally shared queue in some workloads.

---

## 31. Speculative Search

AI systems may explore multiple candidate paths before knowing which is best.

A bounded priority frontier prevents runaway expansion.

Resource limits should include:

```text
maximum states
maximum depth
maximum tokens
maximum wall-clock time
```

---

## 32. Search Budgets

Every production search should have explicit termination conditions:

```text
time budget
node budget
memory budget
token budget
cost budget
```

An algorithm that is theoretically correct but can exhaust production resources is not production-ready.

---

## 33. Retrieval Pipeline Queues

A retrieval system may contain:

```text
query
 ↓
embedding queue
 ↓
vector search
 ↓
reranking queue
 ↓
LLM synthesis
```

Each stage may have a different bottleneck and concurrency limit.

---

## 34. Multi-Stage Backpressure

If stage 3 is slower than stage 1:

```text
stage 1 → stage 2 → stage 3
                 ↑
              backlog
```

Bounded queues between stages prevent the slowest stage from causing unlimited memory growth upstream.

---

## 35. Fair Multi-Tenant AI Serving

Tenants may have different quotas:

```text
tenant A → 100 req/min
tenant B → 20 req/min
```

Use per-tenant accounting and scheduling rather than allowing one tenant to monopolize the global queue.

---

## 36. Priority Inversion

A low-priority task can indirectly block a high-priority task by holding a scarce resource.

Mitigations include:

```text
resource reservation
priority inheritance where applicable
bounded execution
separate pools
```

Queue priority alone cannot solve resource-level priority inversion.

---

## 37. Failure Handling

AI jobs can fail because of:

```text
model errors
GPU OOM
network failure
timeout
invalid tool result
provider throttling
worker crash
```

Classify failures before retrying.

---

## 38. Retry Safety for AI Tasks

Retrying inference may be harmless in some cases but dangerous for agent actions.

For example:

```text
generate summary → often safe to retry
send payment → must be idempotent
create ticket → must deduplicate
```

The queue policy must understand side-effect semantics.

---

## 39. Observability

Measure:

```text
queue depth
oldest request age
p50/p95/p99 queue wait
batch size
batch wait
GPU utilization
throughput
token throughput
cancellation rate
retry rate
failure rate
per-tenant usage
```

Separate queue latency from model latency.

---

## 40. Correctness Invariants

Useful invariants include:

```text
queued + running + terminal = tracked work
```

and:

```text
a cancelled request must not produce a final successful side effect
```

and:

```text
one leased task has one active owner
```

The exact invariant depends on the system's delivery semantics.

---

## 41. Testing AI Queue Systems

Test:

```text
FIFO behavior
priority ordering
fairness
cancellation
retry behavior
lease recovery
batch limits
queue capacity
resource accounting
race conditions
```

Property-based tests are particularly useful for scheduler invariants.

---

## 42. Complexity Reasoning

Typical operations:

```text
FIFO queue: O(1)
heap insertion: O(log N)
heap extraction: O(log N)
top-K with bounded heap: O(N log K)
BFS: O(V + E)
0-1 BFS: O(V + E)
```

But production cost also includes serialization, network latency, accelerator execution, memory bandwidth, and contention.

---

## 43. Backend Architecture Pattern

A practical AI-serving backend can be decomposed as:

```text
HTTP/API
   ↓
admission control
   ↓
request queue
   ↓
scheduler
   ↓
batcher
   ↓
inference workers
   ↓
stream/output queue
   ↓
client
```

Each boundary should have explicit capacity and failure behavior.

---

## 44. Interview Framework

When asked to design an AI scheduler:

```text
1. Define the work item.
2. Define ordering and priority.
3. Define resource dimensions.
4. Define capacity.
5. Define batching.
6. Define concurrency.
7. Define cancellation.
8. Define fairness.
9. Define retry semantics.
10. Define idempotency.
11. Define observability.
12. State complexity.
13. Identify bottlenecks.
14. Define overload behavior.
```

---

## 45. Revision Checklist

- [ ] I can explain a search frontier as a queue/stack/heap.
- [ ] I can implement beam-search frontier management.
- [ ] I understand bounded top-K frontiers.
- [ ] I can explain 0-1 BFS and deque ordering.
- [ ] I can design an inference request queue.
- [ ] I understand token-aware scheduling.
- [ ] I understand micro-batching and continuous batching.
- [ ] I can reason about queueing latency using Little's Law.
- [ ] I can design bounded streaming output queues.
- [ ] I can model an agent workflow as a task frontier.
- [ ] I understand work stealing for parallel AI workloads.
- [ ] I can design multi-stage backpressure.
- [ ] I can design fair multi-tenant AI scheduling.
- [ ] I can reason about retry safety for side effects.
- [ ] I can defend an AI scheduler in an interview.

---

## 46. Key Takeaways

1. AI search is fundamentally frontier management.
2. The frontier data structure determines search policy.
3. Beam search is bounded frontier management under a quality/resource trade-off.
4. Priority queues support best-first and resource-aware scheduling.
5. Inference queues must account for tokens, deadlines, batching, and accelerator capacity.
6. Bounded queues create necessary backpressure boundaries.
7. Cancellation is a resource-management feature, not merely an API detail.
8. Agent systems are dynamic task queues over dependency graphs.
9. Work stealing can scale parallel search by combining local deques with controlled stealing.
10. Production AI scheduling is DSA plus resource accounting, fairness, failure semantics, and observability.
