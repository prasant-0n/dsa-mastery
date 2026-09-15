# 10.10 — Greedy Patterns: Local Choice, Exchange Arguments & Feasibility

## 1. Objective

Greedy algorithms construct a solution by repeatedly making a locally preferred choice while preserving the possibility of an optimal completion.

The difficult part is not writing the loop. It is proving that the local choice is globally safe.

```text
candidate local choice
→ prove safety
→ commit choice
→ reduce problem
→ repeat
```

## 2. Why Greedy Exists

Some optimization problems contain structure that makes future decisions compatible with a locally optimal choice.

When that structure exists, greedy algorithms can replace exhaustive search or dynamic programming with a simpler and faster process.

## 3. Greedy Is Not a Heuristic by Default

A rule such as:

```text
pick the largest
pick the smallest
pick the earliest
pick the highest ratio
```

does not become a correct algorithm merely because it sounds reasonable.

A greedy solution requires a correctness argument under explicit assumptions.

## 4. Core Greedy Questions

Ask:

1. What is the local choice?
2. What invariant remains after choosing it?
3. Can an optimal solution always be transformed to contain this choice?
4. Does the remaining problem have the same structure?
5. What assumptions make the choice safe?

## 5. Exchange Argument

A common proof technique is:

1. Start with an optimal solution.
2. Identify its choice at the relevant position.
3. Replace that choice with the greedy choice.
4. Show feasibility is preserved.
5. Show objective value does not worsen.
6. Repeat inductively.

If this transformation is valid, the greedy choice is safe.

## 6. Staying-Ahead Argument

Another technique proves that after every step the greedy solution is at least as good according to a carefully chosen state measure as any competing solution.

This is useful when direct exchange is awkward.

## 7. Structural Greedy Proofs

Some problems use structural properties such as:

- cut properties;
- matroid structure;
- interval ordering;
- canonical merge structure.

The proof method should match the mathematical structure rather than relying on intuition.

## 8. Interval Scheduling

To maximize the number of non-overlapping intervals, ordering by earliest finishing time provides a classic greedy structure.

The safety argument is based on replacing the first chosen interval of an optimal solution with the interval that finishes earliest.

## 9. Interval Overlap

Some interval problems are not selection problems.

For example, minimum resources required for overlapping intervals can be solved by processing starts and ends in chronological order or with a priority structure.

First identify the exact objective before choosing a greedy rule.

## 10. Interval Covering

Coverage problems often use the farthest reachable endpoint among currently feasible intervals.

The greedy choice must be proved to preserve maximum future reach.

## 11. Jump-Style Frontier Greedy

For reachability arrays, maintain the farthest index reachable from the current frontier.

A minimum-jump variant maintains a current range and expands the next reachable range before committing another jump.

## 12. Resource Assignment

When requirements and resources have compatible ordering, sort both and greedily match the smallest resource capable of satisfying the current requirement.

The proof typically exchanges a larger usable resource with the smaller feasible one.

## 13. Scheduling

Greedy scheduling has many different objectives:

- maximize number of tasks;
- maximize total value;
- minimize lateness;
- meet deadlines;
- minimize resources.

The correct rule depends on the objective and constraints.

Never transfer a greedy rule from one scheduling objective to another without proving it.

## 14. Fractional Knapsack

When items are divisible, selecting by value density is optimal.

This relies on the ability to take arbitrary fractions.

The same ratio rule is not automatically valid for 0/1 knapsack.

## 15. Coin Change Caveat

Choosing the largest available coin first is optimal only for coin systems with the necessary canonical structure.

For arbitrary denominations, greedy can fail.

A production-quality solution must either establish the assumption or use another method.

## 16. Minimum Refueling

A common strategy processes stations reachable with current fuel and chooses the largest available fuel amount when another refueling stop is required.

This combines a greedy frontier with a max-heap.

## 17. Huffman / Minimum Merge Cost

When repeatedly merging items and paying the combined cost, combining the two smallest current weights produces the optimal merge tree under the standard Huffman cost model.

A min-heap maintains the two smallest candidates efficiently.

## 18. Gas Station Feasibility

Some cyclic feasibility problems use a running deficit and identify positions that cannot serve as valid starts.

The key is proving that once a candidate prefix fails, certain earlier candidates can be discarded together.

## 19. Greedy + Heap

Many production-style greedy algorithms have two layers:

```text
ordered scan / frontier
+
heap of currently eligible choices
```

Examples:

- refueling;
- deadline scheduling;
- priority selection;
- streaming resource allocation.

## 20. Greedy + Sorting

Sorting frequently establishes the order in which safe greedy decisions become visible.

Total complexity often becomes:

```text
O(N log N) sorting + O(N) scan
```

or a heap-based variant with a different cost profile.

## 21. Greedy + Binary Search

A greedy feasibility checker can become the predicate inside search-on-answer.

Then total complexity is:

```text
O(log R × feasibilityCost)
```

Correctness requires both the greedy checker and predicate monotonicity.

## 22. Greedy + Prefix State

Prefix sums or other cumulative state can make greedy feasibility checks efficient.

The combination is useful when each candidate decision needs range information.

## 23. Greedy vs Dynamic Programming

A greedy solution commits decisions immediately.

Dynamic programming explicitly preserves multiple relevant states when local choices cannot safely discard alternatives.

If you cannot prove greedy choice safety, DP or another exhaustive-state technique may be required.

## 24. Counterexample-Driven Validation

Before trusting a greedy rule, generate small adversarial instances and compare it against brute force.

Counterexamples do not prove correctness, but they can quickly disprove an invalid rule.

## 25. Feasibility vs Optimality

Some greedy algorithms answer:

```text
Can this be done?
```

Others optimize:

```text
What is the maximum/minimum value?
```

A feasibility rule may be safe without directly proving an optimization objective. Keep the contracts separate.

## 26. Correctness Invariant

A useful greedy invariant often says:

> After each committed choice, the partial solution is feasible and remains extendable to an optimal solution.

The exact invariant must be specialized to the problem.

## 27. Complexity

Typical greedy patterns:

```text
sort + scan → O(N log N)
heap + scan → O(N log N) or O(N log K)
linear frontier greedy → O(N)
```

Always include sorting, heap operations, key computation, and output costs.

## 28. Common Mistakes

1. Assuming a plausible local rule is automatically optimal.
2. Using a rule outside its assumptions.
3. Confusing fractional and 0/1 knapsack.
4. Applying coin-change greedy to arbitrary denominations.
5. Ignoring tie-breaking when it affects feasibility.
6. Failing to prove the exchange step.
7. Comparing only a few examples instead of deriving an invariant.
8. Forgetting sorting or heap costs.

## 29. Edge Cases

Test:

- empty input;
- one item;
- equal values;
- equal endpoints;
- nested intervals;
- touching intervals;
- impossible coverage;
- duplicate resources;
- zero capacity;
- arbitrary coin systems;
- adversarial scheduling deadlines.

## 30. Backend Applications

Greedy reasoning appears in:

- scheduling jobs;
- resource allocation;
- connection management;
- retry prioritization;
- capacity assignment;
- interval-based reservation systems;
- batch selection.

## 31. AI Applications

Greedy methods can appear in:

- candidate pruning;
- resource allocation during inference;
- beam/frontier management;
- heuristic search;
- approximation algorithms;
- ranking and selection pipelines.

Greedy selection in AI does not imply global optimality unless the underlying objective has the required structure.

## 32. Testing Strategy

Use three levels:

### Example Tests

Hand-designed cases explain the intended behavior.

### Differential Tests

Compare against brute force on small instances.

### Property Tests

Verify invariants and objective constraints across generated instances.

Also search deliberately for counterexamples to proposed greedy rules.

## 33. Interview Framework

When a greedy solution seems possible:

```text
1. Define the objective.
2. State constraints and assumptions.
3. Identify the local choice.
4. State the partial-solution invariant.
5. Prove the choice is safe.
6. Show the remaining problem has the required structure.
7. Derive complexity.
8. Test edge cases.
9. Search for counterexamples.
```

## 34. Revision Checklist

- [ ] I can distinguish greedy from heuristic reasoning.
- [ ] I can formulate an exchange argument.
- [ ] I understand staying-ahead proofs.
- [ ] I can identify interval-scheduling structure.
- [ ] I understand greedy + heap.
- [ ] I know when coin-change greedy needs assumptions.
- [ ] I can distinguish fractional from 0/1 knapsack.
- [ ] I can use counterexamples to reject bad greedy rules.
- [ ] I can combine greedy with binary search.
- [ ] I can explain backend and AI applications.

## 35. Key Takeaways

1. **Greedy is a proof-backed strategy, not merely choosing what looks best right now.**
2. **Exchange arguments and staying-ahead arguments are core tools for establishing greedy correctness.**
3. **Constraints and problem structure determine whether a greedy choice is safe.**
4. **Counterexample generation is an effective way to falsify an unjustified greedy rule before implementation.**
5. **Sorting, heaps, binary search, and prefix state frequently combine with greedy reasoning in practical algorithms.**
