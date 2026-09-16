# 15.02 — Activity Selection & Interval Scheduling

## 1. Problem Definition

Given activities represented by start and finish times, select the maximum number of mutually compatible activities.

Two activities are compatible when one can start after the other finishes, according to the chosen boundary convention.

## 2. Why It Matters

Activity selection is a canonical greedy problem because it demonstrates how a carefully chosen ordering can produce an optimal solution in linear scan time after sorting.

It teaches:

- greedy-choice reasoning
- exchange arguments
- interval compatibility
- sorting by structural keys
- tie handling
- proof-driven algorithm selection

## 3. Formal Model

For activity `i`:

```text
activity[i] = (start[i], finish[i])
```

The objective is to maximize the number of selected pairwise-compatible activities.

## 4. Compatibility Convention

Define the boundary rule explicitly.

For the common half-open convention:

```text
next.start >= current.finish
```

If intervals are closed, the compatibility condition changes.

## 5. Greedy Rule

Repeatedly select the compatible activity with the **earliest finishing time**.

Then continue from its finish time.

## 6. Why Earliest Finish Matters

Finishing earlier leaves at least as much remaining time for future activities as any later-finishing choice.

This is the structural reason behind the greedy choice.

## 7. Exchange Argument

Let `g` be the compatible activity with the earliest finish time and let `o` be the first activity of an optimal schedule.

Because `g.finish <= o.finish`, replace `o` with `g`.

The resulting schedule remains feasible and leaves at least as much room for every subsequent activity.

Therefore an optimal solution exists that begins with the greedy choice.

## 8. Recursive Reduction

After selecting the earliest-finishing activity, discard activities that overlap it.

The remaining compatible activities form a smaller instance of the same problem.

This establishes optimal substructure.

## 9. Iterative Implementation

The standard implementation is:

1. sort by finish time
2. track the finish time of the last selected activity
3. scan activities in sorted order
4. select an activity when it is compatible

## 10. Complexity

Sorting costs:

```text
O(N log N)
```

The scan costs:

```text
O(N)
```

Total:

```text
O(N log N)
```

Auxiliary space depends on whether sorting is in-place and on the language/runtime sorting implementation.

## 11. Already-Sorted Input

If activities are guaranteed to be ordered by finish time, the selection scan is `O(N)`.

Never pay for sorting when the required order is already guaranteed.

## 12. Tie-Breaking

If two activities have the same finish time, either can be selected for the cardinality objective.

For deterministic behavior, define a secondary key such as start time and stable identifier.

## 13. Why Earliest Start Fails

An activity may begin very early but occupy almost the entire schedule.

Therefore earliest start does not maximize the number of compatible activities.

## 14. Why Shortest Duration Fails

A short interval can occur at an inconvenient position and block several useful intervals.

Duration alone does not capture future availability.

## 15. Why Fewest Conflicts Fails

Local conflict counts do not necessarily preserve the largest possible remaining schedule.

The proof for earliest finish is specifically tied to the ordering of the remaining timeline.

## 16. Weighted Interval Scheduling Boundary

If each activity has a value and the objective is to maximize total value rather than count, earliest finish alone is not generally sufficient.

The problem becomes **weighted interval scheduling**, typically solved using dynamic programming with predecessor computation.

## 17. Interval Partitioning Boundary

A different problem asks for the minimum number of resources required to schedule all activities.

That objective leads to a different greedy structure, commonly using sorted endpoints and a min-heap of resource availability.

Do not reuse the activity-selection proof for a different objective.

## 18. Interval Covering Boundary

If the goal is to cover a target range with the fewest intervals, the safe greedy rule is different again.

A common pattern is repeatedly choosing the interval that extends coverage farthest among intervals that have already become eligible.

## 19. Meeting Scheduling

Activity selection can model choosing the maximum number of non-overlapping meetings for one room.

For multiple rooms, the problem changes into interval partitioning/resource allocation.

## 20. Online Considerations

The classic algorithm assumes all activities are known before selection.

If activities arrive online and decisions cannot be revoked, the offline proof no longer automatically applies.

## 21. Streaming Considerations

A stream may require maintaining enough state to select or reject intervals without storing the entire input.

Whether exact optimality remains possible depends on what information and future knowledge are available.

## 22. Boundary Semantics

Be explicit about whether an activity ending at time `t` is compatible with another starting at `t`.

Many incorrect implementations differ only because this contract was never defined.

## 23. Input Validation

Production code should decide how to handle:

- missing start/finish values
- `start > finish`
- non-finite values
- duplicate activities
- zero-duration activities
- negative times

Validation policy is part of the API contract.

## 24. Zero-Duration Activities

An activity with `start === finish` requires careful handling under the selected compatibility convention.

The algorithm should remain consistent with the formal model.

## 25. Duplicate Activities

Duplicate intervals do not increase the maximum cardinality when selecting one activity at a time, but stable identifiers may matter for output reproducibility.

## 26. Negative and Large Time Values

The algorithm depends on ordering and comparison, not on time values being positive.

Large values require avoiding unsafe numeric assumptions in JavaScript when integer precision matters.

## 27. Correctness Invariant

After processing a prefix of the finish-time-sorted activities:

```text
selected activities are compatible
```

and the last selected finish time is the earliest finish achievable by a greedy schedule with the current number of selected activities.

## 28. Optimality Proof Structure

Prove three parts:

1. the first greedy choice is safe
2. the remaining problem is the same problem on a reduced set
3. recursively or iteratively applying the safe choice preserves optimality

## 29. Brute-Force Verification

For small `N`, enumerate all subsets, discard incompatible subsets, and compare their maximum cardinality with the greedy result.

This is useful for implementation validation and for discovering incorrect alternative greedy rules.

## 30. Adversarial Test Families

Test:

- nested intervals
- identical finish times
- identical start times
- one huge interval
- many zero-duration intervals
- already-sorted input
- reverse-sorted input
- dense overlaps
- completely disjoint intervals

## 31. Differential Testing

Compare the greedy implementation against exhaustive search for randomly generated small instances.

Compare both objective value and validity of the returned schedule.

## 32. Backend Application

For a single resource, activity selection can model maximizing non-overlapping jobs, maintenance windows, meetings, or tasks.

For multiple resources, combine interval ordering with resource-availability data structures.

## 33. Backend Engineering

A production scheduler should additionally define:

- priorities
- cancellations
- deadlines
- fairness
- resource identities
- time-zone semantics
- concurrency
- persistence

These requirements can invalidate the simple offline greedy model.

## 34. AI Application

Interval selection can model choosing non-overlapping candidate actions, tool executions, retrieval windows, or time-budgeted planning steps.

The same warning applies: if candidates have heterogeneous value, the objective must be modeled explicitly.

## 35. Complexity Engineering

If the input arrives in arbitrary order, sorting is usually dominant.

If the same activity set is queried repeatedly, pre-sorting can amortize the ordering cost across queries.

## 36. Memory Engineering

For very large workloads, consider:

- compact interval representation
- integer timestamps where safe
- avoiding unnecessary object copies
- external sorting when data exceeds memory

## 37. Common Mistakes

- sorting by start time instead of finish time
- using weighted-interval logic for unweighted selection
- mixing closed and half-open interval semantics
- forgetting the first activity initialization
- assuming all tie-breakers change the objective
- claiming greedy works for every interval problem

## 38. Interview Pattern

When you see:

> maximize the number of non-overlapping intervals

immediately test earliest finish time.

Then explain the exchange argument rather than simply naming the algorithm.

## 39. Interview Explanation

A concise explanation:

> Sort activities by finishing time. Repeatedly choose the first activity whose start is at least the finish time of the previously selected activity. The earliest-finishing compatible activity is safe because replacing the first activity of any optimal schedule with it cannot reduce the remaining available time. Therefore repeated choices produce an optimal maximum-cardinality schedule.

## 40. Revision Checklist

- [ ] Define activity selection formally.
- [ ] State the compatibility convention.
- [ ] Implement earliest-finish greedy.
- [ ] Prove the exchange argument.
- [ ] Explain optimal substructure.
- [ ] Construct counterexamples to other ordering rules.
- [ ] Distinguish weighted interval scheduling.
- [ ] Distinguish interval partitioning.
- [ ] Test tie and boundary cases.
- [ ] Verify against brute force.
- [ ] Explain complexity.
- [ ] Translate the pattern to backend scheduling.

## Key Takeaways

1. Activity selection is the canonical earliest-finish greedy problem.
2. Its correctness comes from an exchange argument, not from intuition.
3. Sorting by finish time enables a simple linear scan after ordering.
4. Small changes to the objective can completely change the correct algorithm.
5. Interval scheduling is an important pattern for recognizing safe greedy structure.
