# 15.05 — Job Sequencing with Deadlines & Profit Maximization

## 1. Problem Definition

Given jobs where each job requires one unit of execution time, has a deadline, and provides a profit when completed no later than its deadline, select and order jobs to maximize total profit.

## 2. Formal Model

For job `i`:

```text
job[i] = (deadline[i], profit[i])
```

Under the classical model:

- each job takes exactly one slot
- at most one job runs per slot
- a job earns profit only when completed by its deadline
- jobs are independently selectable

## 3. Greedy Rule

Process jobs in decreasing profit order.

For each job, place it into the **latest available slot at or before its deadline**.

If no such slot exists, skip the job.

## 4. Why Highest Profit First

A high-profit job should receive priority because sacrificing it for a lower-profit job can reduce the objective.

But profit ordering alone is not enough: placement must also preserve as many future slots as possible.

## 5. Why Latest Available Slot

Placing a selected job as late as possible leaves earlier slots available for jobs with tighter deadlines.

This is the second essential greedy decision.

## 6. Exchange Intuition

Consider an optimal schedule and a highest-profit unscheduled job.

If a feasible slot exists before its deadline, the schedule can often exchange a lower-profit scheduled job with the higher-profit job without reducing feasibility, while placing the displaced job into an alternative compatible slot when one exists.

The formal proof must account for the slot structure.

## 7. Slot Feasibility

For a job with deadline `d`, candidate slots are:

```text
1, 2, ..., min(d, numberOfSlots)
```

The latest available slot in this range is preferred.

## 8. Deadline Capping

If the maximum deadline is `D` and there are `N` jobs, no useful schedule needs more than:

```text
min(D, N)
```

slots.

## 9. Simple Implementation

A straightforward implementation uses an array of slots.

For each job in descending profit order, scan backward from its deadline until an empty slot is found.

## 10. Complexity of Simple Slot Scanning

Sorting jobs costs:

```text
O(N log N)
```

If each job scans up to `D` slots, scheduling costs:

```text
O(ND)
```

Thus total complexity is:

```text
O(N log N + ND)
```

## 11. DSU Optimization

A disjoint-set structure can track the latest available slot.

After occupying slot `s`, union it with `s - 1` so future queries jump directly to the next available slot.

This can reduce slot-selection work to near-linear after sorting, giving approximately:

```text
O(N log N + N α(D))
```

under the classical DSU formulation.

## 12. Slot DSU Mental Model

Treat each slot as a predecessor query:

```text
find(d) = latest currently available slot <= d
```

When slot `s` is consumed:

```text
parent[s] = find(s - 1)
```

## 13. Deadline Constraints

Invalid or unusual deadlines require explicit policy:

- deadline <= 0
- non-integer deadline
- extremely large deadline
- missing deadline

The classical model assumes positive integer slots.

## 14. Profit Semantics

Under pure maximization, non-positive-profit optional jobs should generally not be selected.

If jobs are mandatory or have penalties, the problem definition changes.

## 15. Equal Profits

Equal-profit jobs can often be processed in any order for the objective value, but deterministic secondary ordering is useful for reproducible schedules.

## 16. Equal Deadlines

Jobs with equal deadlines compete for the same set of slots.

Profit ordering determines which jobs receive those scarce slots under the classical objective.

## 17. Why Earliest Slot Fails

Placing a job in the earliest available slot can consume capacity needed by jobs with tighter deadlines.

Latest-slot placement preserves flexibility.

## 18. Why Earliest Deadline Alone Fails

Earliest-deadline ordering prioritizes feasibility but does not maximize total profit.

The objective is weighted, so profit must influence selection.

## 19. Why Highest Profit Without Slot Strategy Fails

Selecting jobs by profit but placing each in an arbitrary free slot can destroy feasibility for later jobs.

Selection and placement are both part of the greedy algorithm.

## 20. Classical Model Boundary

The standard proof assumes unit-duration jobs.

If jobs have different processing times, the problem becomes a different scheduling optimization problem.

## 21. Weighted Scheduling Boundary

If jobs have arbitrary durations and profits, simple job sequencing by profit is not generally optimal.

Possible alternatives include dynamic programming, branch-and-bound, or richer scheduling algorithms depending on constraints.

## 22. Multiple Machines Boundary

With multiple machines, each time slot can support more than one job.

The state and feasibility model change accordingly.

## 23. Release Times Boundary

If jobs cannot start before release times, deadline-only sequencing is insufficient.

Release constraints must enter the scheduling model.

## 24. Preemption Boundary

The classical job-sequencing problem is non-preemptive and unit-duration.

Allowing preemption changes the feasible schedule space and may change the appropriate algorithm.

## 25. Backend Application

The pattern can model selecting profitable one-slot jobs under deadline constraints:

- batch windows
- maintenance tasks
- promotional jobs
- scheduled workflows
- limited execution slots

Real systems must additionally consider priorities, retries, dependencies, and fairness.

## 26. Backend Priority Scheduling

A production scheduler may combine:

```text
profit
+ deadline
+ priority
+ tenant fairness
+ resource requirements
```

A single scalar profit may be insufficient.

## 27. AI Application

The model can represent choosing time-bounded inference or planning tasks when each task has a discrete execution slot and estimated utility.

The classical greedy algorithm is appropriate only when its assumptions actually hold.

## 28. AI Budgeted Scheduling Boundary

If tasks consume different amounts of compute or have nonlinear utility, the unit-time job-sequencing model no longer captures the problem.

## 29. Correctness Invariant

After processing the first `k` jobs in descending profit order, every accepted job is placed in a feasible slot and the selected schedule is maximal under the placement choices made so far.

## 30. Latest-Slot Invariant

When a job is accepted, it occupies the latest available slot no later than its deadline.

This preserves every earlier slot that remains feasible for other jobs.

## 31. Profit-Selection Reasoning

A correctness proof must show that prioritizing higher-profit feasible jobs does not lose a better total-profit schedule.

This is stronger than simply saying the job has greater profit.

## 32. Brute-Force Verification

For small job sets, enumerate job subsets and all feasible permutations.

Compare the maximum profit with the greedy result.

This is especially useful for testing the implementation and validating proof hypotheses.

## 33. Differential Testing

Compare:

- simple backward slot scan
- DSU-optimized slot selection
- brute-force optimum for small instances

Normalize schedules before comparing because multiple optimal schedules may exist.

## 34. Adversarial Workloads

Test:

- all jobs with deadline one
- all jobs with the same profit
- increasing profits
- decreasing profits
- huge deadline gaps
- deadlines greater than job count
- zero/negative profits
- duplicate jobs
- very large profits

## 35. Complexity Engineering

When maximum deadline `D` is small, simple slot scanning can be preferable because of its implementation simplicity and good constants.

When `D` is large and slot occupancy is sparse, DSU can reduce repeated scanning.

## 36. Memory Engineering

The slot array requires `O(D)` state.

A DSU representation also requires approximately `O(D)` parent state.

If `D` is extremely large but only a small number of slots can be occupied, compressed representations may be considered.

## 37. Common Mistakes

- sorting by deadline instead of profit
- placing jobs in the earliest slot
- forgetting that deadlines are upper bounds
- failing to cap deadlines by useful slot count
- accepting a job when no feasible slot exists
- applying unit-time reasoning to arbitrary-duration jobs
- claiming profit order alone proves correctness

## 38. Interview Framework

For classical job sequencing:

1. identify unit-duration jobs
2. sort by decreasing profit
3. create slots through the maximum useful deadline
4. place each selected job in the latest available slot before its deadline
5. skip jobs with no available slot
6. derive complexity
7. explain the latest-slot invariant
8. distinguish the arbitrary-duration scheduling boundary

## 39. Revision Checklist

- [ ] Define job sequencing with deadlines.
- [ ] State all classical assumptions.
- [ ] Sort jobs by descending profit.
- [ ] Place jobs in the latest feasible slot.
- [ ] Explain why latest placement preserves flexibility.
- [ ] Implement simple slot scanning.
- [ ] Understand DSU slot optimization.
- [ ] Construct counterexamples to wrong placement rules.
- [ ] Verify against brute force.
- [ ] Analyze complexity and memory.
- [ ] Explain boundaries involving durations, release times, and machines.

## Key Takeaways

1. Classical job sequencing assumes unit-duration jobs and discrete slots.
2. The greedy algorithm combines highest-profit selection with latest-feasible-slot placement.
3. Latest placement preserves earlier capacity for tighter deadlines.
4. A slot array is simple; DSU can accelerate predecessor-slot discovery.
5. Changing job duration, machines, release times, or preemption changes the problem and can invalidate the classical greedy proof.
