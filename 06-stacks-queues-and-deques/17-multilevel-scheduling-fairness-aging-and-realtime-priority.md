# 06.17 — Multi-Level Scheduling, Fairness, Aging & Real-Time Priority

> **Phase 06 — Stacks, Queues & Deques**
>
> This chapter studies priority scheduling as an engineering problem: a single heap is rarely enough when systems need fairness, deadlines, quotas, aging, starvation prevention, and real-time guarantees.

## 1. Learning Objectives

You will learn to:

- distinguish priority from fairness;
- design multi-level priority queues;
- understand starvation and aging;
- reason about weighted fairness and round-robin scheduling;
- model deadlines and real-time constraints;
- design admission control and quotas;
- combine queues with heaps;
- understand hierarchical scheduling;
- analyze latency, throughput, and utilization trade-offs;
- connect scheduling structures to backend and AI systems.

---

## 2. Why One Global Priority Queue Is Not Enough

A global heap answers:

> Which currently eligible item has the best priority?

It does not automatically answer:

```text
Is every tenant getting service?
Can low-priority work starve?
Should deadlines override priority?
Should one tenant consume all capacity?
What happens when the queue is full?
```

These are scheduling-policy questions.

---

## 3. Priority vs Fairness

Priority answers:

```text
who should go first?
```

Fairness answers:

```text
who should not be permanently excluded?
```

A strict-priority scheduler can be optimal for urgency while being unfair.

A fair scheduler may intentionally serve a lower-priority task even when a higher-priority task exists.

The correct policy depends on the system contract.

---

## 4. Multi-Level Queue

A simple multi-level scheduler can maintain:

```text
urgent queue
normal queue
background queue
```

Policy might be:

```text
serve urgent first
then normal
then background
```

This is easy to implement but can starve lower levels if urgent traffic never stops.

---

## 5. Multi-Level Feedback Queue

A feedback scheduler can change a task's effective priority based on behavior.

For example:

```text
new task → high priority
CPU-heavy task → lower priority
interactive task → remain responsive
```

The central idea is dynamic classification rather than a permanent priority assignment.

---

## 6. Starvation

Starvation occurs when a valid task waits indefinitely because other work repeatedly receives preference.

Example:

```text
high A
high B
high C
...
low X
```

If high-priority work continuously arrives, X may never run.

A production scheduler must explicitly decide whether starvation is acceptable.

---

## 7. Aging

Aging increases a waiting task's effective priority over time.

Conceptually:

```text
effectivePriority = basePriority + ageFactor
```

As wait time grows, the task becomes harder to ignore.

This transforms fairness into a time-dependent ordering problem.

---

## 8. Aging Trade-Off

Aggressive aging can effectively erase priority differences.

Weak aging may fail to prevent starvation.

Therefore define:

```text
aging rate
maximum effective priority
priority ceiling
wait-time target
```

Scheduling policy should be measurable rather than described only as “fair.”

---

## 9. Round-Robin

Round-robin gives each active source a turn:

```text
A → B → C → A → B → C
```

It is useful when fairness is more important than strict priority.

A queue naturally represents the rotation.

---

## 10. Weighted Fair Scheduling

Different sources may receive different service shares:

```text
Tenant A → weight 1
Tenant B → weight 2
Tenant C → weight 4
```

Over time, C should receive more service than A.

A practical implementation may use virtual finish times, deficit counters, or weighted round-robin policies.

The key is that fairness is defined over a time interval, not necessarily every individual decision.

---

## 11. Hierarchical Scheduling

Large systems often schedule at multiple levels:

```text
global capacity
    ↓
tenant scheduler
    ↓
priority class
    ↓
job queue
    ↓
worker
```

Each layer can enforce a different policy.

This prevents application-level priority from completely bypassing tenant-level quotas.

---

## 12. Heap + Queue Composition

A useful architecture is:

```text
per-tenant FIFO queues
        ↓
heap of eligible tenant representatives
        ↓
worker
```

The heap selects among tenants while each tenant queue preserves local ordering.

This is often more expressive than one global heap containing every job.

---

## 13. Representative Scheduling

Instead of putting every job into a global heap, put one representative per active queue into the scheduler.

When selected:

```text
choose tenant
serve one or more jobs
update representative
reinsert tenant if work remains
```

This can reduce scheduler state and make fairness policy explicit.

---

## 14. Quotas

A quota limits resource consumption:

```text
requests/minute
tokens/minute
CPU-seconds
GPU-seconds
concurrent jobs
bytes
```

A scheduler should distinguish:

```text
priority → ordering
quota    → resource entitlement
```

A high-priority tenant should not necessarily bypass a hard quota.

---

## 15. Admission Control

Scheduling happens after work is accepted.

Admission control decides whether work should enter the system at all.

Possible decisions:

```text
accept
reject
shed
queue
sample
rate-limit
```

This is crucial when incoming work can exceed service capacity.

---

## 16. Backpressure

If:

```text
arrival rate > service rate
```

queue depth grows.

Backpressure must communicate downstream saturation upstream.

Possible mechanisms:

```text
bounded queue
producer blocking
HTTP 429
retry-after
load shedding
adaptive concurrency
```

---

## 17. Deadline Scheduling

For earliest-deadline-first:

```text
smaller deadline → higher priority
```

This can minimize deadline misses under suitable workload assumptions.

But deadline scheduling alone does not guarantee real-time correctness in arbitrary systems.

---

## 18. Soft vs Hard Deadlines

### Soft deadline

Missing it degrades quality but does not make the result invalid.

### Hard deadline

Missing it makes the work useless or unsafe.

Hard-deadline systems require stronger admission control and resource guarantees than ordinary priority queues.

---

## 19. Deadline Slack

Define:

```text
slack = deadline - currentTime - estimatedRemainingWork
```

Low slack indicates risk.

A scheduler can prioritize low-slack jobs, but estimated work must be accurate enough for the policy to be meaningful.

---

## 20. Real-Time Scheduling

Real-time systems care about predictable completion, not merely average throughput.

Relevant properties include:

```text
worst-case execution time
release time
deadline
jitter
response time
blocking
```

A heap can organize jobs, but it cannot create CPU capacity or guarantee deadlines by itself.

---

## 21. Earliest Deadline First

EDF chooses the eligible task with the earliest absolute deadline.

Conceptually:

```text
min-heap(deadline)
```

The algorithm is elegant, but production correctness depends on execution-time assumptions, preemption, blocking, and admission control.

---

## 22. Deadline + Priority Composite Policy

A service may need:

```text
priority class
→ deadline
→ age
→ sequence
```

A lexicographic comparator can encode this.

However, if priority dominates deadline completely, an urgent-but-late job may still be delayed by a high-priority stream.

The ordering must reflect the desired business behavior.

---

## 23. Starvation-Free Priority

One strategy is bounded waiting:

> Every admitted job must receive service within a specified maximum wait under stated system assumptions.

This turns “fairness” into a testable requirement.

The scheduler can enforce this using aging, quotas, or explicit reservation.

---

## 24. Tenant Isolation

Suppose one tenant submits 100,000 jobs while another submits 10.

A global FIFO can produce poor isolation.

A global priority heap can be even worse if the large tenant has high priority.

Per-tenant queues plus a fair scheduler provide a stronger isolation model.

---

## 25. Noisy Neighbor Problem

A noisy neighbor consumes shared capacity and increases latency for others.

Controls include:

```text
per-tenant concurrency
rate limits
queue quotas
weighted fairness
priority ceilings
separate worker pools
```

These controls are architecture, not merely data-structure details.

---

## 26. Scheduling by Cost

Jobs may have different execution costs:

```text
job A → 2 ms
job B → 2 seconds
```

Serving only by job count can be unfair in resource consumption.

Weighted scheduling should consider:

```text
CPU cost
memory
GPU time
network cost
estimated tokens
```

This is particularly important in AI workloads.

---

## 27. AI Token Scheduling

LLM serving may involve requests with different token workloads.

A scheduler can consider:

```text
input tokens
estimated output tokens
deadline
tenant tier
batch compatibility
```

A FIFO queue may maximize simplicity but can produce poor tail latency when large requests dominate.

---

## 28. Continuous Batching

AI inference systems can batch compatible requests.

Now scheduling must balance:

```text
batch efficiency
waiting time
GPU utilization
fairness
deadlines
```

The best next request is not always the highest-priority individual request.

Batch formation itself becomes an optimization problem.

---

## 29. Priority Inversion

Priority inversion occurs when a high-priority task waits indirectly on lower-priority work.

Example:

```text
high task → needs lock
low task → holds lock
medium tasks → consume CPU
```

The high task can be delayed by medium work even though it has higher priority.

Data-structure ordering cannot solve resource-level inversion by itself.

---

## 30. Cancellation and Deadlines

If a deadline has passed, queued work may no longer be useful.

The scheduler should define:

```text
remove
mark expired
skip on extraction
execute anyway
```

Expired work should not silently consume resources if its result is guaranteed to be useless.

---

## 31. Queue Compaction

Lazy cancellation can produce stale scheduler entries.

If:

```text
stale entries >> active entries
```

memory and extraction overhead increase.

Possible responses:

```text
periodic rebuild
threshold-based compaction
indexed eager removal
```

This is an example of operational maintenance becoming part of data-structure engineering.

---

## 32. Scheduling Invariants

A production scheduler should define explicit invariants.

Examples:

```text
active queue never exceeds capacity
cancelled work is never executed
per-tenant quota is respected
root ordering matches comparator
expired work is handled according to policy
```

These invariants should become tests and metrics.

---

## 33. Complexity

Typical building blocks:

```text
FIFO enqueue/dequeue      O(1)
heap insert               O(log N)
heap extraction           O(log N)
indexed cancellation     O(log N)
map identity lookup       expected O(1)
```

A hierarchical scheduler may have additional factors based on the number of active queues and policy layers.

---

## 34. Latency Metrics

Measure more than throughput:

```text
queue wait time
service time
response time
p50
p95
p99
maximum observed wait
deadline misses
starvation incidents
```

Tail latency is especially important for interactive backend and AI systems.

---

## 35. Queueing Insight

A useful relationship is:

```text
L = λW
```

where average system population, arrival rate, and time in system are related under stable conditions.

If arrival rate remains constant, excessive queued work implies higher waiting time.

Simply increasing queue capacity may hide overload while making latency worse.

---

## 36. Production Failure Modes

Watch for:

```text
starvation
priority inversion
retry storms
unbounded queues
quota bypass
noisy neighbors
stale-entry buildup
expired work execution
clock errors
scheduler crashes
```

Every failure mode should have a defined mitigation or accepted trade-off.

---

## 37. Testing Fairness

Fairness needs workload-level tests.

Generate:

```text
one noisy tenant
many quiet tenants
continuous high-priority arrivals
long jobs + short jobs
cancelled jobs
expired jobs
bursty traffic
```

Measure service shares and maximum waiting times.

Do not declare a scheduler fair because a few examples look balanced.

---

## 38. Simulation

A scheduler can be tested with a discrete-event simulation.

Represent events:

```text
arrival
start
finish
cancel
retry
expire
```

Then compare policies under identical workloads.

This is often more informative than microbenchmarks.

---

## 39. Interview Framework

For a scheduling problem:

```text
1. Define ordering.
2. Define fairness.
3. Define capacity.
4. Define deadlines.
5. Define quotas.
6. Define cancellation.
7. Define starvation policy.
8. Select queue/heap composition.
9. State invariants.
10. Derive complexity.
11. Analyze tail latency.
12. Explain failure modes.
```

---

## 40. Revision Checklist

- [ ] I can distinguish priority from fairness.
- [ ] I understand multi-level queues.
- [ ] I understand feedback scheduling.
- [ ] I can explain starvation.
- [ ] I understand aging.
- [ ] I understand round-robin and weighted fairness.
- [ ] I can design hierarchical scheduling.
- [ ] I understand quotas and admission control.
- [ ] I can reason about deadlines and slack.
- [ ] I understand soft vs hard real-time constraints.
- [ ] I can design tenant isolation.
- [ ] I understand priority inversion.
- [ ] I can apply scheduling concepts to AI inference.
- [ ] I can test fairness with simulations.
- [ ] I can defend a production scheduling design.

---

## 41. Key Takeaways

1. Priority and fairness are different objectives.
2. A single global heap cannot automatically provide tenant isolation or starvation prevention.
3. Multi-level and hierarchical schedulers compose queues and heaps to express richer policies.
4. Aging converts waiting time into scheduling priority.
5. Quotas and admission control protect resources before work reaches the scheduler.
6. Deadlines require explicit handling and do not automatically create real-time guarantees.
7. AI serving adds token cost, batching, GPU utilization, and tail-latency concerns.
8. Cancellation and lazy deletion require stale-state management.
9. Fairness should be measured through service share and waiting-time metrics.
10. Production scheduling is a policy-and-invariants problem built on top of data structures.
