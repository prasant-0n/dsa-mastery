# 15.03 — Interval Partitioning, Resource Allocation & Scheduling with Heaps

## 1. Concept Definition

**Interval partitioning** asks for the minimum number of resources required to assign every interval so that overlapping intervals never share a resource.

Examples:

- meeting rooms
- CPU slots
- classrooms
- machines
- database connections
- execution workers

## 2. Objective Difference

Activity selection maximizes the number of non-overlapping activities on one resource.

Interval partitioning schedules **all** activities while minimizing the number of resources.

Changing the objective changes the greedy algorithm.

## 3. Formal Model

Each interval is:

```text
(start, finish)
```

Two intervals conflict when they overlap under the selected boundary convention.

The objective is:

```text
minimum number of resources
```

such that every interval is assigned to a compatible resource.

## 4. Depth of an Interval Set

The minimum number of resources equals the maximum number of simultaneously active intervals, called the **depth** of the interval set.

This provides both a lower bound and, for interval partitioning, the exact optimum.

## 5. Greedy Strategy

Process intervals in increasing start time.

Maintain a min-heap containing the finish time of the interval currently occupying each resource.

For each interval:

- if the earliest resource becomes available, reuse it
- otherwise allocate a new resource

## 6. Why a Min-Heap

Only the earliest resource-release time matters when processing the next interval.

A min-heap supports:

```text
peek minimum finish time → O(1)
extract/update minimum → O(log R)
```

where `R` is the number of resources currently used.

## 7. Greedy Rule

For the half-open convention, if:

```text
earliestFinish <= currentStart
```

that resource can be reused.

Otherwise a new resource is necessary.

## 8. Correctness Lower Bound

Suppose `d` intervals overlap at the same time.

No schedule can assign those intervals to fewer than `d` resources because each conflicting pair cannot share a resource.

Therefore:

```text
resources >= depth
```

## 9. Correctness Upper Bound

The heap-based greedy algorithm creates a new resource only when every existing resource has a finish time greater than the current interval's start.

Therefore all currently active resources conflict with the new interval.

Creating another resource is necessary.

## 10. Optimality Proof

The greedy algorithm uses exactly the maximum number of simultaneously active intervals.

Because depth is a lower bound and greedy uses no more than depth resources, the solution is optimal.

## 11. Sorting Order

Sort by start time.

If starts tie, deterministic secondary ordering may be useful for reproducibility.

The finish time determines which resource becomes available first.

## 12. Alternative Endpoint-Sweep Algorithm

Store starts and finishes separately, sort both arrays, and sweep them with two pointers.

This computes the minimum resource count without explicitly assigning every interval to a resource.

## 13. Sweep-Line Complexity

Sorting starts and finishes costs:

```text
O(N log N)
```

The two-pointer sweep is:

```text
O(N)
```

Total:

```text
O(N log N)
```

## 14. Heap Assignment Complexity

Sort intervals:

```text
O(N log N)
```

Each interval performs at most one heap removal and one insertion:

```text
O(N log R)
```

Overall:

```text
O(N log N)
```

with `R <= N`.

## 15. Recovering Resource Assignments

To return actual resource IDs, store:

```text
{ finishTime, resourceId }
```

in the heap.

When a resource is reused, assign its ID to the current interval.

## 16. Deterministic Assignments

If multiple resources are simultaneously available, choose a deterministic policy such as the smallest resource ID.

The number of resources remains optimal regardless of this tie-break under the standard model.

## 17. Priority Queue Representation

A binary min-heap is a common implementation.

For specialized integer-time workloads, bucketed structures or event queues may be competitive.

Choose based on the actual domain.

## 18. Boundary Semantics

For half-open intervals `[start, finish)`:

```text
start === previousFinish → compatible
```

For closed intervals, equality may still represent overlap.

The compatibility contract must be explicit.

## 19. Zero-Duration Intervals

Intervals where `start === finish` need a defined semantic interpretation.

Under a half-open mathematical model, they occupy no positive-duration time, but implementation behavior must still be consistent.

## 20. Duplicate Intervals

Identical intervals require distinct assignments when all occurrences must be scheduled.

Stable IDs help preserve output identity.

## 21. Invalid Intervals

Production code should define behavior for:

- missing endpoints
- `start > finish`
- non-finite timestamps
- unsupported timestamp types

Do not let invalid input silently corrupt resource counts.

## 22. Weighted Resources Boundary

If resources have different capabilities or costs, ordinary interval partitioning is no longer sufficient.

The problem may become a richer assignment or scheduling optimization problem.

## 23. Capacity Boundary

If one resource can handle multiple simultaneous jobs up to capacity `C`, model capacity explicitly.

Simple interval coloring assumes capacity one.

## 24. Online Scheduling Boundary

If intervals arrive online and cannot be reordered, the offline optimality proof does not automatically apply.

Online scheduling requires a different analysis.

## 25. Streaming Event Processing

For event streams, maintain active resource state and release resources as finish events occur.

The data structure may be a heap ordered by completion time.

## 26. Backend Application: Meeting Rooms

Meeting intervals can be assigned to rooms using the heap strategy.

The number of rooms is the maximum simultaneous meeting count.

## 27. Backend Application: Worker Pools

Tasks with fixed execution windows can be assigned to workers while minimizing worker count under capacity-one assumptions.

Real worker pools additionally consider task duration uncertainty, priorities, failures, and heterogeneous workers.

## 28. Backend Application: Connection Allocation

Connections or execution slots can be modeled as resources with availability times.

A min-heap efficiently tracks the earliest available resource.

## 29. AI Application: Batch/Device Scheduling

AI jobs with non-overlapping execution windows can be assigned to devices or execution slots.

Additional constraints such as memory, accelerator type, and model residency require richer scheduling models.

## 30. AI Application: Tool Execution Windows

Time-bounded tool calls can be modeled as intervals when simultaneous execution has a resource limit.

## 31. Resource Reuse Pattern

The general pattern is:

```text
sort by request start
→ release reusable resources
→ reuse earliest available resource
→ allocate only when necessary
```

This pattern appears far beyond literal intervals.

## 32. Heap Invariant

At every step, the heap contains the availability time of every currently allocated resource.

The minimum heap element is the earliest resource that can become available.

## 33. Correctness Invariant

Before scheduling interval `i`, all previously scheduled intervals have valid resource assignments and no overlapping intervals share a resource.

## 34. Resource-Count Invariant

The number of allocated resources equals the maximum number of active intervals encountered so far under the greedy processing order.

## 35. Brute-Force Verification

For small interval sets, enumerate assignments to `R` resources and find the minimum feasible `R`.

Compare the result with heap-based greedy.

## 36. Differential Testing

Compare:

- heap assignment
- endpoint sweep count
- brute-force optimum for small cases

Normalize resource IDs before comparing assignments because multiple optimal assignments can exist.

## 37. Adversarial Test Families

Test:

- completely disjoint intervals
- all-overlapping intervals
- nested intervals
- touching intervals
- identical intervals
- identical start times
- identical finish times
- zero-duration intervals
- very large timestamps

## 38. Complexity Engineering

If only the minimum resource count is needed, endpoint sweep may use less state than maintaining resource assignments.

If assignments are required, the heap method naturally retains resource identity.

## 39. Memory Engineering

Track only active resources in the heap when possible.

For full assignment output, store the assigned resource ID with each interval or return assignments separately.

## 40. Common Mistakes

- solving activity selection instead of partitioning
- using a max-heap instead of a min-heap
- forgetting to release all reusable resources
- comparing the current start with the wrong finish time
- using the wrong endpoint convention
- assuming resource count equals number of intervals
- claiming weighted/heterogeneous scheduling has the same proof

## 41. Interview Framework

For “minimum meeting rooms”:

1. identify intervals and overlap semantics
2. sort by start time
3. maintain a min-heap of resource finish times
4. reuse the earliest available room
5. allocate a room only when necessary
6. derive `O(N log N)`
7. explain depth as the lower bound
8. prove greedy reaches that lower bound

## 42. Revision Checklist

- [ ] Define interval partitioning.
- [ ] Distinguish it from activity selection.
- [ ] Explain depth.
- [ ] Implement min-heap resource allocation.
- [ ] Implement endpoint sweep.
- [ ] Recover resource assignments.
- [ ] Handle endpoint conventions.
- [ ] Handle ties and duplicate intervals.
- [ ] Verify against brute force.
- [ ] Explain the lower-bound/upper-bound proof.
- [ ] Apply the pattern to backend and AI scheduling.

## Key Takeaways

1. Interval partitioning minimizes the number of capacity-one resources needed to schedule all intervals.
2. The optimum equals the maximum number of simultaneously active intervals.
3. A min-heap tracks the earliest resource that becomes available.
4. Endpoint sweep computes the resource count without constructing assignments.
5. The proof combines a depth lower bound with greedy resource reuse.
6. Real production scheduling may require richer constraints than the classical interval model.
