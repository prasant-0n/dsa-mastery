# 15.22 — Greedy for Backend & AI Resource Allocation

## 1. Concept Definition

Resource allocation chooses how limited resources are assigned to competing workloads.

Typical resources include:

- CPU
- memory
- GPU
- storage
- network bandwidth
- workers
- database connections
- cache capacity
- API quota

A greedy allocator repeatedly makes a locally attractive feasible assignment.

## 2. The Resource Allocation Model

Represent each request as:

```text
request = value + resourceDemand + constraints + deadline
```

Represent each resource as:

```text
resource = capacity + capabilities + currentUsage + cost
```

The objective determines what greedy means.

## 3. Common Objectives

Possible objectives include:

```text
maximize total value
minimize cost
maximize throughput
minimize latency
maximize utilization
maximize coverage
minimize deadline violations
```

A production scheduler may optimize several objectives simultaneously.

## 4. Feasibility First

A resource assignment is valid only if all hard constraints remain satisfied.

Typical hard constraints:

- capacity
- compatibility
- locality
- deadline
- tenant quota
- dependency
- regulatory boundary

Greedy score should be applied only to feasible candidates.

## 5. Value Density

When resource consumption varies, a useful heuristic is:

```text
value / resourceCost
```

This is related to fractional-knapsack-style reasoning.

It is not automatically optimal for discrete allocation.

## 6. Deadline-Aware Greedy

For deadline-sensitive jobs, priority can combine:

```text
urgency + value + resource fit
```

A simple earliest-deadline policy may protect latency while a value-based policy may maximize throughput.

The correct policy depends on the objective.

## 7. Least-Loaded Allocation

A basic load-balancing rule assigns work to the least-loaded compatible worker.

It is simple and often effective, but heterogeneous resource requirements can make scalar load insufficient.

## 8. Multi-Dimensional Resources

A server can be:

```text
CPU: 20% free
RAM: 70% free
GPU: 0% free
```

A single utilization number can hide the bottleneck dimension.

Resource vectors are often required.

## 9. Dominance

Resource A dominates resource B for a job when A is at least as capable under every relevant dimension and strictly better in at least one.

Dominated resources can sometimes be deprioritized safely.

## 10. Best-Fit Resource Allocation

A best-fit policy places a workload into the smallest resource that satisfies its requirements.

This can reduce fragmentation but may preserve large resources for future workloads differently from least-loaded allocation.

## 11. Worst-Fit Allocation

Worst-fit sends a job toward the resource with the most remaining capacity.

This can spread load but may increase fragmentation.

## 12. First-Fit Allocation

First-fit scans resources in a deterministic order and assigns the first compatible resource.

Its main advantage is implementation simplicity.

## 13. Resource Fragmentation

Capacity can exist but remain unusable because it is split across incompatible dimensions or machines.

Therefore:

```text
sum(free capacity) != usable capacity
```

in many real allocation problems.

## 14. Admission Control

When demand exceeds capacity, the scheduler must decide which requests enter the system.

Possible greedy criteria:

- highest value
- earliest deadline
- highest value density
- smallest resource footprint
- tenant fairness

Admission control is often more important than the assignment rule itself.

## 15. Backpressure

Backpressure prevents unlimited queue growth.

A production allocator can:

```text
accept
→ queue
→ defer
→ shed
→ reject
```

based on workload and capacity.

## 16. Priority Queues

A heap can maintain the highest-priority waiting requests.

Priority keys can combine:

```text
priority = urgency + businessValue + aging
```

Tie-breaking must be deterministic when reproducibility matters.

## 17. Aging

Pure priority can starve low-priority requests.

Aging gradually increases waiting requests' effective priority.

This converts a static greedy policy into a state-dependent policy.

## 18. Tenant Fairness

Multi-tenant systems should not allow one tenant to consume all resources.

Common mechanisms include:

- quotas
- weighted fair sharing
- token buckets
- per-tenant concurrency limits
- reservation pools

## 19. Weighted Fair Allocation

Assign each tenant a weight representing its share of capacity.

A scheduler can prefer tenants whose observed allocation is below their weighted target.

The fairness policy becomes part of the optimization objective.

## 20. CPU Scheduling

A greedy CPU scheduler may prioritize:

```text
shortest job
highest priority
earliest deadline
highest value density
```

Each rule optimizes a different metric.

## 21. Memory Allocation

Memory-aware scheduling must account for:

- requested memory
- working-set size
- fragmentation
- NUMA locality
- eviction/reclamation cost

A job that barely fits can still create operational pressure.

## 22. GPU Allocation

GPU scheduling is particularly constrained by:

- VRAM
- compute capability
- model compatibility
- interconnect topology
- batching opportunity
- locality

Selecting only the least-utilized GPU can be incorrect.

## 23. GPU Packing

When jobs require different amounts of GPU memory, allocation resembles bin packing.

Greedy policies can reduce fragmentation but do not generally guarantee optimal packing.

## 24. GPU Batching

Batching compatible inference requests can improve accelerator utilization.

The scheduler balances:

```text
batch size
+ queue delay
+ throughput
+ memory limit
```

This is a constrained online optimization problem.

## 25. Model Placement

AI model replicas can be placed across nodes according to:

- traffic
- memory
- latency
- geographic locality
- accelerator compatibility

A greedy placement policy may rank candidate nodes by estimated marginal benefit.

## 26. Autoscaling

Autoscaling chooses when and where to add or remove capacity.

Greedy rules can react to:

- queue depth
- CPU utilization
- GPU utilization
- latency
- request rate

Hysteresis and cooldowns prevent oscillation.

## 27. Hysteresis

Without hysteresis:

```text
scale up
→ utilization drops
→ scale down
→ utilization rises
→ scale up
```

A threshold gap can prevent rapid repeated changes.

## 28. Database Connection Pools

Connection allocation can prioritize requests by deadline or value while enforcing maximum connections.

The scheduler must also account for connection duration, not only request count.

## 29. Rate-Limit Allocation

A shared API quota can be allocated among tenants according to:

```text
priority
quota
recent usage
fairness
business value
```

Greedy allocation must preserve the hard quota invariant.

## 30. Cache Capacity

Limited cache capacity can be allocated to objects with high expected benefit.

A useful score can combine:

```text
requestFrequency × missCost / memoryCost
```

But future demand uncertainty makes this an online problem.

## 31. Storage Placement

Objects can be placed according to:

- access frequency
- size
- durability requirement
- locality
- storage price

Greedy placement may need periodic rebalancing.

## 32. Network Bandwidth

Bandwidth allocation can prioritize flows according to value, deadline, or service class.

A scalar greedy score may fail when flows have different latency sensitivity.

## 33. Multi-Objective Allocation

Suppose the objective is:

```text
score = value - α·latency - β·cost
```

Changing `α` or `β` changes the allocation behavior.

Weights should therefore be treated as explicit product requirements rather than hidden magic constants.

## 34. Hard vs Soft Constraints

Separate constraints into:

```text
hard -> must never violate
soft -> may be traded off
```

Greedy optimization should never treat a hard safety constraint as merely another score component.

## 35. Preemption

A greedy allocator may need to reclaim resources from an existing workload.

Preemption has costs:

- checkpointing
- migration
- cache loss
- restart time
- wasted computation

The allocation score should account for these costs when relevant.

## 36. Migration

Moving workloads between machines can improve global utilization.

But migration itself consumes network, CPU, and time.

A stable greedy policy should avoid oscillating workloads between equivalent resources.

## 37. Reservations

Reservations protect future capacity for known high-priority work.

This trades current utilization for future guarantees.

## 38. Capacity Planning

Historical workload statistics can inform capacity reservations.

However, predictions should be treated separately from hard guarantees.

A prediction-assisted greedy allocator should have a fallback for prediction errors.

## 39. Distributed Allocation

When resources are distributed across nodes:

```text
local candidate scoring
→ candidate aggregation
→ reservation
→ commit
```

The process must handle stale state and concurrent reservations.

## 40. Atomic Commit

Never implement shared capacity as:

```text
read capacity
if enough:
    write capacity
```

without synchronization.

Use an atomic conditional update, transaction, reservation service, or equivalent coordination mechanism.

## 41. Allocation Leases

A lease can reserve capacity temporarily.

If the worker fails to confirm the allocation, the lease expires and capacity becomes available again.

## 42. Backend Resource Allocation Architecture

A production scheduler can be structured as:

```text
Ingress
  ↓
Admission Control
  ↓
Priority Queue
  ↓
Candidate Resource Scoring
  ↓
Reservation
  ↓
Atomic Commit
  ↓
Execution
  ↓
Metrics / Feedback
```

## 43. AI Resource Allocation Architecture

For AI infrastructure:

```text
Inference / Training Requests
          ↓
Model + Resource Compatibility
          ↓
Batching / Admission
          ↓
GPU Candidate Scoring
          ↓
Reservation
          ↓
Execution
          ↓
Latency + Cost Feedback
```

## 44. Approximation Boundary

Many real allocation problems are NP-hard or involve online uncertainty.

Therefore a practical greedy policy should be described honestly as:

- exact, when a proof exists
- approximation, when a guarantee exists
- heuristic, when only empirical evidence exists

## 45. Testing With Exact Oracles

For small resource-allocation instances:

1. enumerate feasible assignments
2. compute exact optimum
3. run greedy policy
4. compare objective
5. verify hard constraints

This exposes counterexamples quickly.

## 46. Adversarial Workloads

Test:

- large early jobs
- tiny jobs after large jobs
- burst traffic
- heterogeneous resources
- synchronized deadlines
- repeated tenant dominance
- changing resource availability

These workloads reveal fragmentation and starvation.

## 47. Benchmarking

Measure:

- allocation latency
- throughput
- utilization
- rejection rate
- queue delay
- fairness
- migration cost
- objective value
- memory
- CPU overhead

## 48. Observability

Record each decision's:

```text
request ID
resource candidates
scores
constraints rejected
selected resource
state version
allocation latency
reason
```

This makes greedy behavior explainable.

## 49. Interview Framework

For a resource-allocation problem:

1. define resources and requests
2. define hard constraints
3. define objective
4. choose greedy score
5. prove or qualify the strategy
6. analyze online uncertainty
7. handle concurrency
8. analyze fragmentation
9. test against an exact oracle
10. discuss production trade-offs

## 50. Implementation Lab

Implement and compare:

1. least-loaded worker allocation
2. best-fit allocation
3. value-density allocation
4. deadline-aware scheduling
5. fair multi-tenant allocation
6. GPU packing
7. inference batching
8. autoscaling simulation
9. cache allocation
10. distributed reservation
11. Backend resource scheduler
12. AI GPU/resource scheduler

## 51. Revision Checklist

- [ ] Define a resource-allocation model.
- [ ] Separate objective from hard constraints.
- [ ] Understand value-density greedy.
- [ ] Understand least-loaded, best-fit, worst-fit, and first-fit policies.
- [ ] Understand multi-dimensional resource constraints.
- [ ] Explain fragmentation.
- [ ] Understand admission control and backpressure.
- [ ] Explain priority queues and aging.
- [ ] Understand tenant fairness.
- [ ] Understand GPU packing and batching.
- [ ] Understand reservations, leases, and atomic commit.
- [ ] Test greedy allocation against exact small-instance oracles.
- [ ] Apply the framework to Backend and AI infrastructure.

## Key Takeaways

1. Resource allocation is only meaningful after the objective and hard constraints are explicit.
2. A greedy score should rank feasible choices; it should not replace safety constraints.
3. Multi-dimensional resources make naive scalar utilization misleading.
4. Backend and AI systems naturally combine greedy selection with queues, heaps, reservations, leases, and feedback.
5. Distributed allocation requires atomicity, idempotency, and stale-state handling.
6. Exactness, approximation, and heuristic behavior must be distinguished clearly.
7. Small-instance exact oracles and adversarial workloads are essential for validating production allocation policies.
