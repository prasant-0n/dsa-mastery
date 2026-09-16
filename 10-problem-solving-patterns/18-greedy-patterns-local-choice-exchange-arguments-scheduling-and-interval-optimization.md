# 10.18 — Greedy Patterns: Local Choice, Exchange Arguments, Scheduling & Interval Optimization

## 1. Objective

Greedy algorithms build a solution incrementally by making a locally optimal choice and committing to it without revisiting the decision.

The critical skill is proving that the local choice can safely lead to a globally optimal solution.

## 2. Why Greedy Exists

Some optimization problems have structural properties that make dynamic programming or exhaustive search unnecessary.

When a greedy-choice property and an appropriate invariant hold, a simple sequence of local decisions can achieve a global optimum.

## 3. Greedy Is Not a Heuristic by Default

A greedy algorithm is exact only when its choice rule is justified by the problem's structure.

A plausible-looking local choice is not a proof.

## 4. Greedy-Choice Property

A problem has a greedy-choice property when there exists an optimal solution containing the locally selected choice.

The proof usually shows that any optimal solution can be transformed to include the greedy choice without worsening its objective.

## 5. Optimal Substructure

After committing to a safe choice, the remaining problem must preserve the structure needed for optimal decisions.

Greedy solutions often rely on both:

- greedy-choice property;
- optimal substructure.

## 6. Exchange Argument

A standard proof structure is:

1. take an arbitrary optimal solution;
2. identify where it differs from the greedy solution;
3. exchange its choice with the greedy choice;
4. prove feasibility is preserved;
5. prove objective value does not worsen;
6. repeat as needed.

## 7. Interval Scheduling

To maximize the number of non-overlapping intervals, sorting by earliest finishing time gives a classic greedy solution.

The exchange argument shows that an optimal schedule can replace its first selected interval with the earliest-finishing compatible interval without reducing the number of future opportunities.

## 8. Activity Selection Invariant

After selecting intervals through a current endpoint:

> the maintained endpoint is as early as possible among solutions with the same number of selected intervals.

This preserves maximum room for future compatible intervals.

## 9. Interval Partitioning

When assigning intervals to the minimum number of resources, track active intervals and reuse a resource as soon as its current interval ends.

A min-heap of end times is a common implementation.

## 10. Minimum Number of Platforms / Rooms

Sort starts and ends or process events in time order.

The maximum number of simultaneous active intervals determines the required resource count.

This is a sweep-line formulation closely related to greedy allocation.

## 11. Merge Intervals

Sort intervals by start time, then merge overlapping ranges while maintaining the current merged boundary.

This is greedy because once sorted, an interval that starts before the current merged end cannot create a separate component.

## 12. Minimum Interval Cover

To cover a target range with intervals, repeatedly choose the compatible interval that extends farthest to the right.

The choice is justified because any valid cover must use some interval reaching at least the current boundary, and the farthest-reaching choice preserves maximum remaining coverage.

## 13. Jump / Reachability Problems

For certain array reachability problems, maintain the farthest position reachable from the current frontier.

The greedy invariant summarizes all reachable positions without exploring them individually.

## 14. Jump Game

Maintain the furthest reachable index while scanning.

If the current index exceeds that frontier, the target is unreachable.

The correctness comes from the fact that only the furthest reachable boundary matters for future reachability.

## 15. Minimum Jumps

For minimum-jump reachability, process a current reachable layer and track the furthest next frontier.

This resembles BFS by levels but can be implemented greedily because all positions in the current frontier have the same jump count.

## 16. Gas Station / Circular Feasibility

For the classic cumulative surplus problem, if a segment causes the running surplus to become negative, no starting point inside that segment can successfully complete the circuit.

This permits skipping an entire failed prefix.

## 17. Two-Sequence Greedy Merge

When merging ordered streams under a lexicographic or objective rule, the safe choice depends on a proven dominance relation.

Do not assume choosing the currently smaller item is globally optimal unless the remaining structure guarantees it.

## 18. Fractional Knapsack

When fractions are allowed, sorting by value-to-weight ratio and taking the highest ratio first is optimal.

The exchange argument follows because replacing lower-ratio weight with higher-ratio weight cannot reduce total value.

## 19. Why 0/1 Knapsack Is Different

When items are indivisible, value-to-weight ratio is not generally sufficient.

This contrast is essential: changing one constraint can destroy the greedy-choice property and require DP or another method.

## 20. Huffman-Style Greedy

Repeatedly combining the two least frequent symbols yields an optimal prefix-code tree under the Huffman objective.

The proof uses a structural exchange argument showing that two least-frequent items can occupy deepest sibling positions in an optimal tree.

## 21. Scheduling by Deadlines

Greedy scheduling rules depend heavily on the objective and constraints.

Examples include earliest deadline first for particular feasibility models and shortest processing time for certain average-completion objectives.

Never transfer a rule between objectives without proving its relevance.

## 22. Deadline Scheduling with Heap

For maximizing the number of feasible jobs when each job has a deadline and processing time, sort by deadline and maintain selected jobs in a max-heap by duration.

When total processing exceeds the current deadline, remove the longest selected job.

## 23. Greedy + Heap

A heap often turns the greedy choice into an efficient implementation:

```text
sort by structural key
→ maintain candidate set
→ extract/replace according to objective
```

The data structure implements the choice; it does not establish correctness.

## 24. Greedy + Sorting

Sorting frequently reveals the ordering in which the safe choices become visible.

Always include sorting cost in the complexity analysis.

## 25. Greedy + Two Pointers

Ordered data can allow two-pointer greedy scans for matching, pairing, allocation, and interval problems.

The correctness proof must explain why advancing one pointer cannot discard a better feasible solution.

## 26. Greedy + Prefix State

Cumulative state can expose feasibility boundaries, surplus, or coverage.

This is useful in circular arrays, resource allocation, and scheduling constraints.

## 27. Greedy vs DP

Use DP when future optimal choices depend on multiple competing historical states that cannot be safely collapsed into one greedy state.

Use greedy when an exchange or dominance argument proves that only one choice needs to survive.

## 28. Greedy vs Backtracking

Backtracking explores alternatives because no single local choice is known to be safe.

Greedy commits immediately because a proof establishes that alternatives cannot improve the optimum.

## 29. Greedy vs Binary Search on Answer

Some optimization problems use binary search to test feasibility, while greedy constructs the solution directly.

A greedy feasibility check can itself become the predicate used by binary search.

## 30. Correctness Proof Framework

For a greedy solution, explicitly identify:

1. candidate choice;
2. feasibility invariant;
3. greedy-choice theorem;
4. exchange/dominance argument;
5. optimal-substructure argument;
6. termination and final optimality.

## 31. Complexity

Typical greedy solutions are dominated by sorting:

```text
sorting: O(N log N)
scan: O(N)
heap operations: O(N log N)
```

State the exact workload and data structure costs.

## 32. Common Mistakes

1. Assuming a local optimum implies global optimality.
2. Using a known greedy rule for a different objective.
3. Skipping the exchange proof.
4. Ignoring tie semantics.
5. Forgetting feasibility constraints.
6. Treating 0/1 knapsack like fractional knapsack.
7. Ignoring sorting and heap costs.
8. Calling a heuristic greedy algorithm without proving optimality.

## 33. Edge Cases

Test:

- empty input;
- one item;
- equal keys;
- nested intervals;
- touching intervals;
- impossible schedules;
- zero-duration jobs;
- zero capacities;
- duplicate values;
- circular wraparound;
- extremely large totals.

## 34. Backend Applications

Greedy reasoning appears in:

- resource allocation;
- job scheduling;
- interval reservation;
- capacity planning;
- cache eviction policies;
- batch prioritization;
- routing heuristics where exact optimality is separately established.

## 35. AI Applications

Greedy methods support:

- beam-style candidate selection;
- feature selection heuristics;
- rule-based decoding;
- approximate resource allocation;
- search ordering;
- compression and coding algorithms.

When a greedy method is heuristic rather than exact, label it as such and evaluate its objective empirically.

## 36. Testing Strategy

Use:

- brute-force optimal references on small inputs;
- exchange-property counterexample searches;
- randomized workloads;
- tie-heavy cases;
- adversarial ordering;
- invariant assertions;
- differential greedy vs exhaustive comparison.

## 37. Interview Framework

When considering greedy:

```text
1. What is the objective?
2. What local choice looks safe?
3. What invariant does it preserve?
4. Can I exchange an optimal choice for the greedy one?
5. Does feasibility remain valid?
6. Does the remaining problem retain optimal structure?
7. What counterexample would break this rule?
8. Would DP/backtracking be required if the exchange proof fails?
9. What sorting/heap costs exist?
10. Can I explain the proof, not just the implementation?
```

## 38. Revision Checklist

- [ ] I can distinguish greedy from heuristic.
- [ ] I understand greedy-choice property.
- [ ] I can construct an exchange argument.
- [ ] I can solve interval scheduling.
- [ ] I understand interval partitioning.
- [ ] I can reason about jump/reachability greedily.
- [ ] I understand fractional vs 0/1 knapsack.
- [ ] I can combine greedy with heaps.
- [ ] I can identify when greedy fails.
- [ ] I can prove greedy correctness.

## 39. Key Takeaways

1. **Greedy algorithms are justified by structure, not intuition.**
2. **Exchange arguments are one of the most important tools for proving greedy correctness.**
3. **Sorting and heaps often expose or implement the safe local choice, but neither proves optimality by itself.**
4. **The objective and constraints determine whether a greedy rule is valid; a rule that works for one variant may fail for another.**
5. **When the safe-choice proof fails, DP, backtracking, graph algorithms, or approximation methods may be required instead.**
