# 06.23 — Queue & Deque Mastery: Advanced Problem Patterns & Interview Preparation

> **Phase 06 — Stacks, Queues & Deques**
>
> This chapter is the interview and problem-solving layer for Phase 06. The objective is to recognize queue/deque patterns quickly, derive the invariant, select the correct implementation, prove it, analyze complexity, and communicate the solution under pressure.

## 1. Mastery Objective

You should be able to see a problem and answer:

```text
What is the state?
What must remain true?
What item should be processed next?
What information must be discarded?
Which structure gives that policy efficiently?
```

The target is not memorization. It is pattern recognition plus derivation.

---

## 2. Pattern 1 — FIFO Processing

Use a queue when work must be processed in arrival order.

Typical problems:

```text
BFS
level-order traversal
request processing
job queues
producer-consumer systems
```

Core invariant:

```text
oldest valid item is processed next
```

---

## 3. Pattern 2 — BFS

Recognition signals:

```text
minimum number of unweighted steps
level-by-level exploration
shortest path in unweighted graph
```

Template:

```text
enqueue start
mark visited
while queue not empty:
    remove front
    inspect neighbors
    enqueue unseen neighbors
```

Complexity is typically O(V + E).

---

## 4. Pattern 3 — Multi-Source BFS

Instead of one starting state, enqueue every source initially.

```text
source A ─┐
source B ─┼→ queue
source C ─┘
```

This computes minimum distance from the nearest source in an unweighted graph/grid.

The initial queue represents distance zero for all sources.

---

## 5. Pattern 4 — Monotonic Queue

Use a deque when a sliding window needs repeated maximum/minimum queries.

Maintain candidates in monotonic order and remove dominated elements.

Typical complexity:

```text
O(N) total
```

because each element enters and leaves the deque at most once.

---

## 6. Pattern 5 — Sliding Window Maximum

For each window:

```text
remove indices outside window
remove smaller values from back
push current index
front = maximum candidate
```

The deque stores only potentially useful candidates.

This is an important example of **discarding information that can never become optimal**.

---

## 7. Pattern 6 — 0-1 BFS

Recognition:

```text
edge costs are only 0 or 1
```

Use:

```text
0-cost edge → front
1-cost edge → back
```

This replaces a general priority queue with a specialized deque policy.

---

## 8. Pattern 7 — Top-K

Recognition:

```text
N candidates
only K best matter
K ≪ N
```

Use a bounded heap.

Typical complexity:

```text
O(N log K)
```

rather than sorting all N elements.

---

## 9. Pattern 8 — K-Way Merge

Given K sorted sequences, maintain one current candidate from each source in a min-heap.

Each extraction exposes the next candidate from one source.

For T total elements:

```text
O(T log K)
```

---

## 10. Pattern 9 — Running Median

Maintain two heaps:

```text
max-heap → lower half
min-heap → upper half
```

Balance their sizes.

Median retrieval becomes O(1), while insertion is O(log N).

---

## 11. Pattern 10 — Priority Scheduling

Recognition:

```text
next item is determined by score/deadline/priority
```

Use a priority queue rather than forcing FIFO.

Always define tie-breaking explicitly.

---

## 12. Pattern 11 — Delayed Work

If work becomes available at time T, order pending work by availability time.

A min-heap is often appropriate:

```text
smallest availableAt → next
```

---

## 13. Pattern 12 — Lazy Deletion

If arbitrary deletion from a heap is expensive:

```text
mark invalid
leave entry
skip when popped
```

Track stale-entry growth so memory does not become unbounded.

---

## 14. Pattern 13 — Fair Scheduling

Recognition:

```text
multiple tenants/classes
shared capacity
no tenant should starve
```

Possible solutions:

```text
round robin
weighted round robin
per-tenant queues
aging
hierarchical schedulers
```

---

## 15. Pattern 14 — Bounded Buffer

Recognition:

```text
producer faster than consumer
memory must remain bounded
```

Use a bounded queue/ring buffer and explicit overflow behavior.

Possible policies:

```text
block
reject
drop newest
drop oldest
sample
```

---

## 16. Pattern 15 — Producer/Consumer

Separate production from consumption.

Important questions:

```text
capacity?
blocking?
shutdown?
cancellation?
error propagation?
```

The data structure is only one part of the concurrency contract.

---

## 17. Pattern 16 — Work Stealing

Recognition:

```text
parallel workers
uneven workloads
local work preferred
idle workers can steal
```

Use worker-local deques.

Owner and thief operations intentionally use opposite ends.

---

## 18. Pattern 17 — Rate Limiting

Recognition:

```text
limit requests over time
```

Sliding-window implementations naturally use a deque of timestamps.

The key invariant is that stored timestamps belong to the active time window.

---

## 19. Pattern 18 — Connection Pool

Recognition:

```text
finite reusable resources
requests wait when exhausted
```

Model:

```text
idle pool
busy set
wait queue
```

Invariant:

```text
idle + busy ≤ capacity
```

---

## 20. Pattern 19 — Job Queue with Retries

Model jobs explicitly:

```text
queued
leased
running
retrying
completed
failed
DLQ
```

Do not rely on queue position as the complete job state.

---

## 21. Pattern 20 — Cancellation

A cancelled item should not execute an unintended side effect.

For priority queues, lazy deletion is often useful.

For FIFO queues, eager removal may be expensive; an invalidation marker can be simpler.

---

## 22. Pattern 21 — Backpressure

If downstream capacity is lower than upstream arrival:

```text
queue grows
```

A production system must eventually:

```text
throttle
reject
shed
batch
scale
```

Queues buffer bursts; they do not create capacity.

---

## 23. Pattern 22 — Streaming Pipelines

Model each stage separately:

```text
Q1 → worker → Q2 → worker → Q3
```

Each queue should have a capacity and overload policy.

This prevents hidden unbounded accumulation.

---

## 24. Pattern 23 — AI Inference Scheduling

Recognition:

```text
requests have different token costs/deadlines/priorities
```

A useful scheduler may combine:

```text
queue
priority heap
batcher
fairness policy
resource accounting
```

The structure should follow the actual scheduling objective.

---

## 25. Pattern 24 — Beam Search

Recognition:

```text
search branches rapidly
retain only B best candidates
```

Maintain a bounded frontier.

Beam width controls the quality/compute/memory trade-off.

---

## 26. Pattern 25 — Agent Task Frontier

An agent can maintain ready tasks in a frontier.

Only tasks whose dependencies are satisfied should enter the executable queue.

A priority policy can then select among ready tasks.

---

## 27. Pattern 26 — Multi-Stage AI Backpressure

For:

```text
embedding → retrieval → reranking → generation
```

slow stages need bounded queues before them.

Measure each stage separately rather than treating the whole pipeline as one latency number.

---

## 28. Pattern Selection Decision Tree

```text
Need arrival order?
 └─ yes → FIFO queue

Need newest/oldest from both ends?
 └─ yes → deque

Need best score next?
 └─ yes → heap

Need fixed memory?
 └─ yes → ring buffer

Need local ownership + stealing?
 └─ yes → work-stealing deque

Need sliding max/min?
 └─ yes → monotonic deque

Need top K only?
 └─ yes → bounded heap
```

Then revisit constraints, concurrency, and failure semantics.

---

## 29. Brute Force → Optimized Reasoning

For every interview problem:

### Step 1
Describe the obvious solution.

### Step 2
Find the repeated expensive operation.

### Step 3
Ask what information could be maintained incrementally.

### Step 4
Choose the structure that maintains that information.

### Step 5
Prove that discarded information can never matter again.

This is how many deque and heap optimizations are derived.

---

## 30. Correctness Invariants

Before coding, write one or more invariants.

Examples:

```text
queue order is preserved
heap property always holds
window contains only valid indices
front is the best remaining candidate
all queued jobs have exactly one logical state
```

If you cannot state the invariant, your implementation is probably not ready.

---

## 31. Complexity Defense

Always distinguish:

```text
operation complexity
total algorithm complexity
auxiliary space
total memory
amortized cost
practical system cost
```

Example:

```text
monotonic deque operation → O(1) amortized
whole algorithm → O(N)
```

---

## 32. Common Interview Traps

- Using `shift()` repeatedly for a queue and accidentally creating O(N²) behavior.
- Sorting every window instead of maintaining candidates.
- Using a heap when a deque is sufficient.
- Forgetting to remove stale window indices.
- Confusing max-heap and min-heap orientation.
- Failing to handle duplicate priorities.
- Claiming FIFO guarantees fairness.
- Ignoring empty/full semantics in ring buffers.
- Forgetting integer/index wraparound.
- Ignoring cancellation or duplicate delivery in backend designs.

---

## 33. JavaScript-Specific Interview Notes

Avoid relying on:

```js
array.shift()
```

for high-frequency queue operations.

Prefer:

```text
head index
ring buffer
deque abstraction
```

Also remember that JavaScript's standard `Array` is not a concurrent queue shared across worker threads; concurrency requires explicit synchronization and shared-memory mechanisms or process/external coordination.

---

## 34. Interview Communication Template

Use:

```text
1. Clarify the requirement.
2. State the brute-force idea.
3. Identify the bottleneck.
4. State the required information.
5. Choose the data structure.
6. State the invariant.
7. Walk through an example.
8. Implement.
9. Derive complexity.
10. Discuss edge cases.
11. Mention production implications if relevant.
```

---

## 35. Advanced Interview Questions

Be prepared to explain:

1. Why is BFS naturally implemented with a queue?
2. Why is sliding-window maximum O(N) with a monotonic deque?
3. Why does 0-1 BFS work?
4. When is a heap better than a sorted array?
5. Why is top-K often O(N log K)?
6. How do you implement a queue without `shift()`?
7. How do you design a bounded concurrent queue?
8. How do you prevent starvation in priority scheduling?
9. How do you handle cancelled heap entries?
10. How do visibility timeouts support worker recovery?
11. Why is idempotency required for at-least-once delivery?
12. How would you schedule AI inference requests by token cost?
13. How would you design a work-stealing scheduler?
14. What metrics reveal queue overload?
15. How do you prove a queue implementation correct?

---

## 36. Whiteboard Drill

For each problem, spend time in this order:

```text
2 min → understand
3 min → brute force
3 min → bottleneck
3 min → invariant
5 min → optimize
5 min → code
2 min → complexity
2 min → edge cases
```

The exact timing can vary. The sequence is what matters.

---

## 37. Mastery Matrix

| Skill | Target |
|---|---|
| Queue implementation | Can implement from scratch |
| Deque | Can implement and reason about both ends |
| Monotonic deque | Can derive O(N) solution |
| BFS | Can derive and explain |
| 0-1 BFS | Can derive deque policy |
| Heap | Can implement and analyze |
| Top-K | Can choose heap vs sorting |
| Scheduling | Can design policy + structure |
| Concurrency | Can state ownership/correctness model |
| Backend | Can design production queue systems |
| AI | Can design resource-aware frontiers |
| Interview | Can explain and defend trade-offs |

---

## 38. Final Revision Checklist

- [ ] I can implement stack, queue, deque, and heap from scratch.
- [ ] I can recognize BFS immediately.
- [ ] I can recognize monotonic deque problems.
- [ ] I can derive sliding-window maximum.
- [ ] I can derive 0-1 BFS.
- [ ] I can solve top-K using a bounded heap.
- [ ] I can solve K-way merge.
- [ ] I understand two-heap median design.
- [ ] I can design fair priority scheduling.
- [ ] I can design bounded buffers and backpressure.
- [ ] I can design worker/job queues.
- [ ] I understand retries, idempotency, and DLQs.
- [ ] I understand concurrent queue ownership.
- [ ] I can design AI inference scheduling.
- [ ] I can model agent work as a frontier.
- [ ] I can prove correctness with invariants.
- [ ] I can derive amortized complexity.
- [ ] I can explain every major trade-off in an interview.

---

## 39. Key Takeaways

1. Most queue/deque interview problems are really ordering and information-maintenance problems.
2. Monotonic structures work by discarding candidates that can never become optimal.
3. Heaps are appropriate when arbitrary priorities matter; deques are better when ordering has stronger structure.
4. Correctness starts with invariants, not code.
5. Production queue problems add capacity, concurrency, cancellation, retries, fairness, and observability.
6. AI systems extend the same ideas with token, accelerator, deadline, and batching constraints.
7. Expert interview performance comes from deriving the pattern rather than recalling a memorized solution.
