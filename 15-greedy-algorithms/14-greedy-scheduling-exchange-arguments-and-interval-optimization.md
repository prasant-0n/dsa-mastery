# 15.14 — Greedy Scheduling, Exchange Arguments & Interval Optimization

## 1. Concept Definition

Greedy scheduling problems choose jobs, intervals, or resources one decision at a time using a locally optimal rule. The key skill is identifying the structural property that makes an exchange argument valid.

## 2. Mathematical Model

A job may have start time, finish time, processing time, deadline, profit, weight, release time, or machine requirements. The objective determines the algorithm.

## 3. Activity Selection

For intervals `[start, finish)`, maximize the number of mutually compatible intervals. The classical greedy rule is to repeatedly choose the compatible interval with the earliest finish time.

## 4. Exchange Argument

Let `G` be the greedy first interval and `O` the first interval in an optimal solution. Since `G` finishes no later than `O`, replace `O` by `G`. The replacement leaves at least as much room for every later choice, so an optimal solution exists that begins with `G`.

## 5. Greedy Choice + Optimal Substructure

Greedy correctness commonly follows from:

```text
greedy-choice property + optimal substructure
```

The greedy-choice property means an optimal solution can be transformed to contain the greedy choice without worsening the objective.

## 6. Activity Selection Algorithm

1. Sort intervals by finish time.
2. Track the finish time of the last selected interval.
3. Select an interval when its start is compatible.
4. Continue through the input.

With sorting, the standard complexity is `O(n log n)` time.

## 7. Endpoint Semantics

Explicitly define whether intervals are half-open `[start, finish)` or closed. Under half-open semantics, an interval starting exactly when another finishes is compatible.

## 8. Weighted Interval Scheduling

If intervals have values and the objective is maximum total value, earliest finish is not generally optimal. Weighted interval scheduling is a dynamic-programming boundary.

This is a critical lesson: changing the objective can change the correct algorithm even when the input looks similar.

## 9. Interval Partitioning

Interval partitioning asks for the minimum number of resources needed so overlapping intervals receive different resources. The minimum equals the maximum number of simultaneously active intervals.

A min-heap of resource finish times supports efficient assignment.

## 10. Resource Assignment

Process intervals by start time. Reuse the resource with the earliest finish when it is available; otherwise allocate a new resource. Update that resource's finish time after assignment.

## 11. Meeting Rooms

Meeting-room counting is interval partitioning. Use an endpoint sweep when only the count is required, or a min-heap when actual room assignment is required.

## 12. Endpoint Sweep

Create start and finish events and sort them with endpoint semantics in mind. For half-open intervals, a finish at time `t` should be processed before a start at `t` when counting simultaneous occupancy.

## 13. Deadline Scheduling

Deadline problems are not one problem. Common objectives include maximizing on-time jobs, maximizing profit, minimizing maximum lateness, and minimizing weighted completion time. Identify the objective first.

## 14. Minimize Maximum Lateness

For a single machine, all jobs available at time zero, with processing times and deadlines, earliest-deadline-first minimizes maximum lateness under the standard assumptions.

For job `j`:

```text
Cj = completion time
dj = deadline
Lj = Cj - dj
Lmax = max(Lj)
```

## 15. Adjacent Exchange Proof

If two adjacent jobs are ordered with the later deadline before the earlier deadline, swapping them does not increase maximum lateness under the standard model. Repeatedly removing deadline inversions produces earliest-deadline-first order.

## 16. Lateness vs Tardiness

Lateness may be negative:

```text
Lj = Cj - dj
```

Tardiness cannot be negative:

```text
Tj = max(0, Cj - dj)
```

A proof for one objective cannot automatically be applied to the other.

## 17. Smith's Rule

For minimizing weighted completion time on one machine, with all jobs available and no extra constraints, order jobs by increasing `processingTime / weight`, equivalently decreasing `weight / processingTime`.

## 18. Smith's Rule Exchange Argument

Compare two adjacent jobs in both possible orders. The difference in total weighted completion cost reduces to the processing-time/weight ratio comparison, establishing the correct local ordering.

## 19. Objective Selection Table

```text
maximum number of compatible intervals -> earliest finish
minimum resources for all intervals     -> interval partitioning + heap
maximum total interval weight            -> weighted interval DP
minimum maximum lateness                 -> earliest deadline first
minimum weighted completion time         -> Smith's Rule
```

## 20. Brute Force Oracle

For small inputs, enumerate job permutations or subsets and compute the exact objective. Use this oracle to validate greedy implementations and discover counterexamples.

## 21. Counterexample-Driven Learning

When a proposed greedy rule fails: construct a tiny instance, compare it with the exact solution, identify the violated assumption, and replace the algorithm with the appropriate technique.

## 22. Greedy Failure Boundaries

Greedy rules can fail when adding weights, release times, multiple machines, setup times, capacities, precedence constraints, or other constraints. Re-check the proof whenever the model changes.

## 23. Backend Applications

Scheduling appears in worker queues, background jobs, retries, deployment pipelines, database maintenance, batch processing, rate-limited APIs, and task orchestration. Real schedulers often add priorities, fairness, deadlines, quotas, and resource limits.

## 24. Distributed Scheduling

A distributed scheduler may combine a priority queue with resource availability and job metadata. Stale state, race conditions, fairness, and coordination costs can invalidate assumptions from a single-machine textbook model.

## 25. AI Applications

Greedy scheduling can support batch inference, GPU jobs, retrieval refreshes, evaluation runs, embedding generation, preprocessing, and model-artifact processing. Objectives may combine latency, throughput, cost, and deadlines.

## 26. Fairness Boundary

Pure greedy priority can starve low-priority work. Production systems may add aging, quotas, weighted fairness, tenant limits, or starvation detection. Such constraints can change the optimization model.

## 27. Exchange Argument Template

```text
1. State the greedy choice.
2. Take an optimal solution.
3. Find its conflicting choice.
4. Swap in the greedy choice.
5. Prove feasibility is preserved.
6. Prove the objective does not worsen.
7. Recurse on the remaining problem.
```

## 28. Correctness Requirements

A scheduling proof should establish feasibility, the greedy-choice property, preservation of an optimal solution, optimal substructure, and termination. Examples alone are not a proof.

## 29. Testing Strategy

Test empty input, one job, equal endpoints, nested intervals, duplicates, equal deadlines, equal ratios, zero processing time where permitted, large timestamps, and adversarial counterexamples.

## 30. JavaScript Engineering

For large timestamps or costs, verify `Number` precision. Use `BigInt` when exact integers exceed the safe range, remembering that `BigInt` and `Number` cannot be mixed directly. Keep sort comparators consistent and define deterministic tie-breaking.

## 31. Complexity Engineering

Separate sorting, heap operations, scanning, auxiliary memory, and output storage. For example, interval partitioning with sorting plus a min-heap is typically `O(n log n)`.

## 32. Interview Questions

Be able to explain why earliest finish works, why earliest start fails, why weighted interval scheduling needs DP, the difference between scheduling and partitioning, why EDF minimizes maximum lateness under its assumptions, how Smith's Rule is derived, and how to construct a greedy counterexample.

## 33. Implementation Lab

Implement activity selection, interval partitioning, meeting-room counting, room assignment, earliest-deadline-first scheduling, maximum-lateness calculation, Smith's Rule, a brute-force scheduling oracle, and greedy-vs-optimal differential testing.

## 34. Revision Checklist

- [ ] State the objective before choosing a greedy rule.
- [ ] Explain exchange arguments.
- [ ] Prove activity selection.
- [ ] Distinguish scheduling from partitioning.
- [ ] Implement interval partitioning with a heap.
- [ ] Explain EDF and its assumptions.
- [ ] Derive Smith's Rule.
- [ ] Identify weighted interval scheduling as a DP boundary.
- [ ] Construct greedy counterexamples.
- [ ] Test endpoint semantics and tie-breaking.
- [ ] Apply scheduling concepts to backend and AI systems.

## Key Takeaways

1. Greedy scheduling is a family of problems, not one algorithm.
2. The objective determines the correct greedy rule.
3. Exchange arguments explain why many scheduling rules are optimal.
4. Activity selection uses earliest finish; weighted interval scheduling is different.
5. Interval partitioning minimizes resources and uses resource-frontier tracking such as a min-heap.
6. EDF and Smith's Rule are correct only under their stated assumptions.
7. Counterexamples are essential for detecting invalid greedy strategies.
8. Production schedulers add fairness, capacity, retries, and distributed-state constraints beyond textbook models.
