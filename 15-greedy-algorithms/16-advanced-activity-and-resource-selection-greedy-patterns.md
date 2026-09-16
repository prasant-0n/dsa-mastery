# 15.16 — Advanced Activity & Resource Selection Greedy Patterns

## 1. Concept Definition

Advanced activity and resource-selection problems extend classical interval scheduling by adding capacities, costs, priorities, compatibility rules, multiple resources, or selection limits.

The central skill is to identify whether the added constraint preserves a known greedy structure or changes the problem into dynamic programming, flow, matching, or another optimization model.

## 2. The First Question: What Is the Objective?

Before choosing a greedy rule, define exactly what is optimized:

- maximum number of activities
- maximum total value
- minimum resources
- minimum cost
- maximum covered demand
- minimum lateness
- maximum throughput
- feasibility under a fixed resource budget

Similar-looking interval inputs can require completely different algorithms.

## 3. Classical Activity Selection

For mutually compatible intervals with unit value, selecting the compatible interval with the earliest finish time maximizes the number of selected activities.

The exchange argument from the previous chapter is the foundation.

## 4. Resource-Constrained Selection

Suppose activities require one of a limited number of resources.

A valid greedy strategy must account for resource availability, not just interval ordering.

Typical state includes:

```text
resource -> next available time
```

A min-heap is useful when the resource with the earliest availability should be considered first.

## 5. Interval Partitioning

When every interval must be assigned to a resource and overlapping intervals cannot share a resource, the minimum number of resources equals the maximum overlap depth.

Sort by start time and maintain resource finish times.

## 6. Selecting vs Scheduling

These are different tasks:

```text
selection  -> choose a subset
scheduling -> assign chosen jobs to time/resources
partition  -> assign every interval to resources
```

Mixing these objectives is a common source of incorrect greedy solutions.

## 7. At Most K Activities

If the goal is to select at most `k` compatible activities maximizing count, ordinary activity selection may already select fewer than `k` when compatibility limits the optimum.

If activities have weights, the problem becomes weighted interval selection and generally requires dynamic programming.

## 8. Maximum Number Under Multiple Tracks

If there are multiple independent tracks or rooms and each activity can be placed on one track, the problem may reduce to interval partitioning or a related scheduling formulation.

The exact model depends on whether every activity must be scheduled or only a subset.

## 9. Online Interval Selection

In an online setting, activities arrive without knowledge of future intervals.

The offline earliest-finish proof cannot simply be reused because the algorithm cannot inspect future candidates.

Online scheduling introduces competitive-analysis concepts.

## 10. Streaming Selection

For large streams, retaining every interval may be undesirable.

A streaming algorithm may maintain a compact summary, but memory reduction can require weaker guarantees or additional assumptions.

## 11. Weighted Activity Boundary

If interval `i` has value `w_i`, selecting by earliest finish can fail to maximize total value.

Example structure:

```text
one long interval -> high value
several short intervals -> combined higher value
```

The correct solution is weighted interval scheduling with dynamic programming.

## 12. Capacity-Constrained Intervals

Suppose each time period has capacity `C` and activities consume capacity.

This is no longer ordinary interval partitioning when activities can consume multiple units.

Possible formulations include:

- resource-constrained scheduling
- flow
- dynamic programming
- integer optimization

Do not assume a single min-heap solves every capacity problem.

## 13. Unit-Demand vs Multi-Demand

Unit-demand activities require one resource unit.

Multi-demand activities may require several units simultaneously.

A heap that tracks individual resources works naturally for unit-demand assignment but may need a different model for multi-unit demand.

## 14. Compatible Resource Types

A task may require a particular resource type:

```text
GPU
CPU
high-memory worker
region-specific worker
```

The scheduler must track availability by compatible resource class.

## 15. Earliest Available Resource

For a fixed activity order, selecting the compatible resource with the earliest finish time minimizes the current resource frontier.

This is a local scheduling rule whose correctness depends on the fixed ordering and resource model.

## 16. Lexicographic Objectives

Real systems may optimize multiple objectives:

```text
maximize completed jobs
then minimize cost
then minimize latency
```

A greedy comparator can encode a lexicographic policy, but optimality must be proved for the exact objective.

## 17. Tie-Breaking

Equal finish times or equal scores can produce multiple valid solutions.

Use deterministic tie-breaking when reproducibility matters.

Possible keys:

- finish time
- start time
- stable ID
- cost
- priority

## 18. Dominance

One candidate can dominate another when it is no worse in every relevant dimension and strictly better in at least one.

Dominated candidates can sometimes be removed before greedy processing.

This is a useful preprocessing pattern, but dominance must be defined relative to the objective.

## 19. Pareto Frontier

For multi-objective resource selection, retain candidates that are not dominated.

The resulting Pareto frontier can be much smaller than the original candidate set in favorable workloads, but it can also remain large.

## 20. Resource Allocation with Costs

If selecting an activity consumes a resource and has a cost, the ratio:

```text
value / cost
```

may be tempting but is not automatically correct.

Ratio greedy requires structural justification such as divisibility or an appropriate approximation framework.

## 21. Budgeted Activity Selection

With a total budget, activities having different costs create a knapsack-like constraint.

A simple value-per-cost greedy rule is not generally exact for 0/1 choices.

This is another important greedy boundary.

## 22. Precedence Constraints

If activity `B` cannot start until `A` completes, ordinary interval compatibility is insufficient.

Precedence can transform scheduling into a DAG scheduling or topological-order problem, potentially with additional optimization layers.

## 23. Release Times

A release time means a job cannot begin before a specified time.

This changes the assumptions behind many classical single-machine scheduling proofs.

Always include release-time semantics in the mathematical model.

## 24. Setup Times

If switching between activity types requires setup time, two individually compatible intervals may no longer be compatible when scheduled consecutively.

The simple earliest-finish rule may therefore fail.

## 25. Sequence-Dependent Costs

When the cost or duration of a job depends on the preceding job, the objective depends on the sequence rather than merely on selected intervals.

This is outside classical activity selection.

## 26. Maximum Coverage with Intervals

Suppose each selected activity covers a set of demand points and only `k` activities may be selected.

The objective becomes coverage maximization rather than compatibility maximization.

Greedy marginal coverage may be appropriate when the resulting objective has the required submodular structure.

## 27. Interval Stabbing

A related problem asks for the minimum number of points that intersect every interval.

The classical greedy rule is to repeatedly choose the right endpoint of the interval that currently ends earliest.

This is a different problem from activity selection even though both use intervals.

## 28. Interval Covering

Covering a target range with available intervals is another distinct formulation.

A common greedy pattern is to choose, among intervals starting before the current uncovered position, the one extending farthest right.

The invariant is maximum reachable coverage after each choice.

## 29. Jump-Style Reachability

The same invariant appears in array and interval reachability problems:

```text
current reachable boundary
→ inspect candidates within it
→ extend the farthest reachable boundary
```

This is a useful transferable greedy pattern.

## 30. Backend Applications

Advanced resource selection appears in:

- worker scheduling
- connection-pool allocation
- batch processing
- deployment windows
- maintenance windows
- rate-limit slots
- multi-region workload placement
- cache refresh scheduling

The implementation must model concurrency, failures, retries, and stale state.

## 31. AI Applications

AI systems can apply these patterns to:

- GPU job placement
- batch inference
- embedding generation
- dataset preprocessing
- evaluation scheduling
- model artifact processing
- retrieval refresh jobs

Cost, memory, accelerator compatibility, and deadlines can create constraints beyond basic interval scheduling.

## 32. Distributed-System Boundary

A textbook scheduler assumes a reliable centralized view of resource availability.

Distributed systems introduce:

- stale state
- concurrent reservations
- lease expiry
- retries
- duplicate execution
- clock differences
- worker failure

The greedy decision layer must therefore be combined with coordination and correctness mechanisms.

## 33. Idempotency

A scheduling operation may be retried after a timeout.

Backend scheduling should use stable job IDs and idempotent reservation or dispatch operations where appropriate.

The DSA algorithm alone does not guarantee system-level correctness.

## 34. Fairness

A greedy scheduler optimizing throughput can repeatedly select short or high-value tasks while delaying others.

Production policies may add:

- aging
- quotas
- tenant fairness
- starvation detection
- weighted priority

These policy constraints may alter the optimization problem.

## 35. Correctness Invariants

Examples:

```text
no overlapping activities share an exclusive resource
resource finish times represent actual assignments
selected intervals remain compatible
coverage boundary never decreases
```

Choose invariants based on the exact problem.

## 36. Counterexample-Driven Design

Before trusting a new greedy rule:

1. write the proposed local rule
2. generate tiny adversarial cases
3. compute an exact brute-force answer
4. compare objectives
5. inspect the first divergence
6. identify which assumption failed

This is one of the most effective ways to learn greedy algorithms.

## 37. Brute-Force Oracle

For small interval sets, enumerate subsets or permutations depending on the problem.

Use the oracle to test:

- activity selection
- resource assignment
- coverage selection
- weighted variants
- tie-breaking

## 38. Complexity Engineering

Separate:

```text
sorting cost
+ heap operations
+ compatibility checks
+ resource lookup
+ output reconstruction
```

For example, sorting `n` intervals and performing logarithmic heap operations typically leads to `O(n log n)` time.

## 39. JavaScript Engineering

For production-quality JavaScript:

- avoid mutating caller-owned arrays unexpectedly
- define endpoint semantics explicitly
- use deterministic comparators
- validate numeric inputs
- avoid unsafe integer arithmetic when exactness matters
- keep resource state separate from input objects

## 40. Interview Decision Tree

```text
What is the objective?
        |
        +-- max compatible count -> earliest finish
        |
        +-- min resources -> interval partitioning
        |
        +-- max weighted value -> weighted interval DP
        |
        +-- min max lateness -> EDF
        |
        +-- coverage under k -> maximum coverage / submodular greedy
        |
        +-- budgeted 0/1 choice -> inspect knapsack/DP boundary
```

## 41. Implementation Lab

Implement and compare:

1. activity selection
2. interval partitioning
3. typed-resource assignment
4. interval covering
5. interval stabbing
6. maximum interval coverage
7. dominance preprocessing
8. brute-force oracles
9. adversarial counterexample search
10. backend/AI scheduler simulations

## 42. Revision Checklist

- [ ] Separate selection, scheduling, and partitioning.
- [ ] Define the exact objective before choosing a greedy rule.
- [ ] Recognize weighted interval scheduling as a DP boundary.
- [ ] Understand typed-resource assignment.
- [ ] Understand interval covering and interval stabbing.
- [ ] Understand reachability-style greedy invariants.
- [ ] Identify budget, precedence, setup-time, and release-time boundaries.
- [ ] Use dominance and Pareto reasoning where appropriate.
- [ ] Build brute-force counterexample oracles.
- [ ] Apply the patterns to backend and AI schedulers.

## Key Takeaways

1. Adding a constraint can completely change which greedy strategy is valid.
2. Activity selection, interval partitioning, interval covering, and interval stabbing are distinct optimization problems.
3. Resource compatibility often requires a resource-aware frontier such as a heap.
4. Weighted, budgeted, precedence-constrained, and setup-dependent variants frequently cross into DP or other optimization techniques.
5. Dominance, Pareto frontiers, and marginal coverage are useful advanced selection patterns.
6. Counterexample-driven testing should accompany greedy design.
7. Backend and AI schedulers must combine algorithmic decisions with distributed-systems correctness, fairness, and failure handling.
