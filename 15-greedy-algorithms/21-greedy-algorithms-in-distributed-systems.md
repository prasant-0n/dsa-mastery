# 15.21 — Greedy Algorithms in Distributed Systems

## 1. Concept Definition

A distributed greedy algorithm makes locally attractive decisions while state, computation, or resources are spread across multiple machines or processes.

The central difficulty is that a local decision is made from an incomplete, delayed, or changing view of global state.

```text
centralized greedy
→ one consistent state

distributed greedy
→ partial state + communication + concurrency
```

## 2. Why Distributed Greedy Is Different

A textbook greedy proof usually assumes a well-defined state at every step.

Distributed systems introduce:

- network delay
- concurrent decisions
- stale reads
- message loss
- retries
- duplicate messages
- partial failures
- partitions
- clock differences

Therefore, the algorithmic rule and the distributed coordination protocol must be analyzed separately.

## 3. Local Optimality vs Global Feasibility

A node can make a locally feasible choice that becomes globally invalid after another node makes a concurrent choice.

Example:

```text
Node A sees capacity = 1
Node B sees capacity = 1
Both accept a job
Actual capacity = 1
```

A distributed greedy policy needs a coordination mechanism when the resource is shared.

## 4. Shared-State Greedy Decisions

When decisions depend on shared state, common mechanisms include:

- atomic operations
- compare-and-swap
- transactions
- leases
- consensus-backed state
- partitioned ownership

The choice affects throughput, latency, and correctness guarantees.

## 5. Commutative Decisions

Greedy operations are easier to distribute when independent decisions commute.

If applying decisions `A` and `B` in either order produces the same state and objective, concurrency is easier to manage.

Non-commutative decisions require stronger ordering or conflict resolution.

## 6. Monotone State

A state is especially useful for distributed algorithms when updates move monotonically toward a stable result.

Examples include:

- growing sets
- counters
- maximum values
- minimum known distances under suitable synchronization

Monotonicity can reduce coordination requirements.

## 7. Idempotency

Retries are normal in distributed systems.

A greedy operation should often be safe to execute more than once or should carry a unique operation ID so duplicates can be detected.

```text
request ID
→ deduplication
→ apply once
```

## 8. Leases

A lease grants temporary ownership of a resource.

A distributed scheduler can use leases to make a greedy allocation while limiting the lifetime of stale ownership.

Lease expiry must be handled explicitly.

## 9. Reservation Race

Two workers may reserve the same resource concurrently.

A safe reservation protocol needs an atomic state transition such as:

```text
available → reserved
```

rather than a non-atomic:

```text
read available
→ decide
→ write reserved
```

## 10. Sharding

Partitioning the problem by key can turn global greedy decisions into local decisions.

For example:

```text
tenant → shard
region → owner
partition → worker
```

This reduces coordination but may sacrifice global optimality.

## 11. Hierarchical Greedy

A practical architecture can use:

```text
local greedy decisions
→ regional aggregation
→ global reconciliation
```

This trades exact global decisions for scalability.

## 12. Distributed Top-K

Each node can compute a local top-k candidate set.

The coordinator merges candidates and computes the global top-k.

If each node discards too aggressively, a globally important candidate may never reach the coordinator.

## 13. Candidate Pruning

Pruning reduces network traffic.

Safe pruning requires a bound showing that discarded candidates cannot affect the required result.

Otherwise pruning changes the optimization problem.

## 14. Distributed Maximum Selection

For simple maximum selection, nodes can compute local maxima and reduce them through a tree or coordinator.

The associative property of `max` makes this operation naturally distributable.

## 15. Distributed Coverage

Coverage selection is harder because marginal gain depends on the globally selected set.

A node's local marginal gain can become stale after another node selects an overlapping candidate.

This is a classic synchronization challenge for submodular greedy algorithms.

## 16. Parallel Greedy

Instead of selecting one candidate at a time, a system can evaluate many candidates concurrently and choose a compatible batch.

The algorithm must account for interactions among batch members.

## 17. Stale Marginal Gains

Suppose candidate `x` covers 100 elements when evaluated.

Another node selects a candidate covering 80 of those elements.

The true marginal gain of `x` may now be only 20.

Cached gains therefore require validation before acceptance.

## 18. Distributed Lazy Greedy

Lazy greedy already relies on cached upper bounds.

Distributed lazy greedy adds another source of staleness: changes to the shared selected set.

A robust implementation needs versioning or validation.

## 19. Versioned State

Attach a version to the shared selection state:

```text
selectedSetVersion = 42
candidateGainVersion = 42
```

When the candidate is evaluated, compare versions before committing the decision.

## 20. Compare-and-Swap

A compare-and-swap style operation allows a decision to succeed only if the state remains unchanged:

```text
if version == expectedVersion:
    apply update
else:
    retry
```

This prevents certain lost-update races.

## 21. Optimistic Concurrency

Optimistic systems allow concurrent computation and validate conflicts at commit time.

This can provide high throughput when conflicts are rare.

High contention may cause repeated retries.

## 22. Pessimistic Coordination

A lock or serialized coordinator can prevent conflicting greedy decisions before they occur.

This simplifies reasoning but can reduce throughput and introduce contention or availability concerns.

## 23. Leader-Based Greedy

A leader can serialize global decisions while workers perform candidate evaluation.

Architecture:

```text
workers → candidate scores → leader
leader → greedy choice → state update
```

This separates computation from ordering.

## 24. Eventual Consistency Boundary

Under eventual consistency, different nodes may temporarily observe different states.

A greedy decision based on local state may therefore not correspond to any single global snapshot.

If strong global optimality is required, eventual consistency alone may be insufficient.

## 25. CRDT Connection

Conflict-free replicated data types exploit algebraic properties that make concurrent updates mergeable.

CRDT-style structures can support distributed state whose updates are associative, commutative, and idempotent under appropriate designs.

Not every greedy optimization state has these properties.

## 26. Approximate Global Greedy

A distributed system may intentionally use approximate marginal gains:

```text
local estimate
→ distributed candidate reduction
→ approximate greedy selection
```

The quality guarantee must be derived for the approximation and synchronization model actually used.

## 27. Communication Complexity

A centralized algorithm may be computationally cheap but expensive to distribute if every candidate requires global communication.

Measure:

- messages
- bytes transferred
- synchronization rounds
- serialization points
- retries

Communication can dominate CPU cost.

## 28. Synchronization Rounds

Some distributed greedy algorithms operate in rounds:

```text
1. evaluate locally
2. exchange summaries
3. choose candidates
4. commit updates
5. repeat
```

Reducing rounds can be as important as reducing local computation.

## 29. MapReduce-Style Greedy

A common pattern is:

```text
map   → local candidate statistics
reduce → aggregate candidates
```

This works especially well for associative summaries but may require multiple rounds for state-dependent greedy selection.

## 30. Distributed Scheduling

Workers can report:

- availability
- queue length
- capacity
- cost
- locality

A coordinator or distributed policy selects assignments.

Stale capacity can cause overload unless reservations or leases are used.

## 31. Load Balancing

Greedy load balancing often assigns the next job to the currently least-loaded worker.

Distributed versions need a consistent or sufficiently fresh view of worker loads.

Approximate load views can reduce coordination but may increase imbalance.

## 32. Distributed Caching

Cache placement can use greedy selection based on expected request coverage or cost reduction.

Concurrent cache updates can invalidate marginal-gain estimates.

## 33. Replica Placement

Selecting replicas to improve availability or latency can resemble coverage or facility-location optimization.

A distributed greedy policy may select replicas region by region, followed by global reconciliation.

## 34. Backend Applications

Important backend examples include:

- service placement
- request routing
- worker scheduling
- replica selection
- cache placement
- rate-limit allocation
- autoscaling
- test distribution
- observability coverage

## 35. AI Applications

AI infrastructure can use distributed greedy decisions for:

- GPU allocation
- inference batching
- retrieval candidate selection
- embedding jobs
- evaluation scheduling
- model replica placement
- data-source selection

## 36. GPU Scheduling

GPU resources differ by:

- memory
- accelerator type
- region
- utilization
- model compatibility

A greedy scheduler must include these constraints rather than selecting only the least-loaded machine.

## 37. Distributed Retrieval

Candidate documents may be partitioned across shards.

Each shard can produce local candidates, after which a coordinator merges and reranks them.

Global diversity objectives may require additional coordination beyond local top-k selection.

## 38. Failure Handling

A distributed greedy algorithm must define behavior when a node fails after:

- evaluating a candidate
- reserving a resource
- committing a selection
- sending a result

Recovery may require leases, durable state, or compensating actions.

## 39. Duplicate Messages

Network retries can deliver the same decision multiple times.

Use stable operation IDs and idempotent state transitions where possible.

## 40. Partial Failure

A node may be reachable from one part of the system and unreachable from another.

Do not assume that a failed response means the underlying operation did not happen.

This is particularly important for resource allocation.

## 41. Clock Semantics

Greedy scheduling often uses timestamps and deadlines.

Distributed clocks are not perfectly synchronized.

Use monotonic local durations where possible and explicit server-side or logical time semantics for distributed ordering.

## 42. Fairness and Multi-Tenancy

Pure greedy throughput optimization can repeatedly favor one tenant.

Production policies may introduce:

- quotas
- weighted fairness
- aging
- tenant budgets
- per-region limits

These constraints can change the optimization problem and its proof.

## 43. Observability

Record enough state to reconstruct decisions:

```text
candidate
score
state version
resource state
decision
reason
latency
retry count
```

This is essential when debugging distributed optimization behavior.

## 44. Testing Strategy

Use three layers:

1. deterministic unit tests
2. concurrent simulation
3. fault injection

Inject:

- delays
- duplicate messages
- dropped messages
- stale reads
- node failures
- retries
- clock skew

## 45. Differential Testing

For small instances, compare the distributed approximation with a centralized exact or greedy reference.

Measure:

- feasibility
- objective gap
- duplicate work
- communication cost
- convergence time

## 46. Correctness Invariants

Examples:

```text
resource is never allocated beyond capacity
committed operation IDs are not applied twice
selected state versions advance monotonically
released leases cannot be used after expiry
```

The exact invariant set depends on the system.

## 47. Complexity Model

Distributed complexity should include more than CPU time:

```text
local computation
+ communication
+ synchronization rounds
+ storage
+ retries
```

An algorithm with lower asymptotic CPU complexity may still be slower because of network coordination.

## 48. Interview Framework

When asked to distribute a greedy algorithm:

1. define the centralized greedy invariant
2. identify shared state
3. identify which decisions commute
4. partition independent work
5. choose a coordination model
6. handle stale state
7. define idempotency
8. analyze communication
9. preserve feasibility
10. discuss what approximation or consistency is lost

## 49. Implementation Lab

Implement and compare:

1. distributed maximum reduction
2. distributed top-k
3. sharded coverage selection
4. parallel lazy greedy simulation
5. optimistic resource allocation
6. lease-based scheduling
7. leader-based greedy scheduler
8. distributed load balancing
9. replica placement simulation
10. GPU allocation simulation
11. fault-injection test harness

## 50. Revision Checklist

- [ ] Explain why distributed greedy differs from centralized greedy.
- [ ] Understand stale state and concurrent decisions.
- [ ] Explain idempotency and operation IDs.
- [ ] Understand leases and atomic reservation.
- [ ] Recognize commutative and monotone state.
- [ ] Understand sharding and hierarchical greedy.
- [ ] Understand distributed top-k and candidate pruning.
- [ ] Understand stale marginal gains in submodular selection.
- [ ] Compare optimistic and pessimistic coordination.
- [ ] Understand communication and synchronization complexity.
- [ ] Apply greedy distributed reasoning to Backend and AI infrastructure.

## Key Takeaways

1. A local greedy rule is not automatically globally safe in a distributed system.
2. Shared resources require explicit coordination, atomicity, or a carefully defined approximation model.
3. Commutativity, monotonicity, idempotency, and versioning are powerful distributed-design tools.
4. Sharding and hierarchical greedy decisions improve scalability but can change global optimality.
5. Communication, synchronization, retries, and failure recovery are part of the real complexity model.
6. Distributed submodular selection is particularly sensitive to stale marginal gains.
7. Production systems need algorithmic correctness plus distributed-systems correctness.
