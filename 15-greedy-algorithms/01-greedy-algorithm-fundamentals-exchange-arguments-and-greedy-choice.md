# 15.01 — Greedy Algorithm Fundamentals, Exchange Arguments & Greedy Choice

## 1. Concept Definition

A **greedy algorithm** constructs a solution incrementally by making a locally optimal choice at each step, with the expectation that a sequence of such choices produces a globally optimal solution.

The important skill is not recognizing the word "greedy". It is proving that the local choice is **safe**.

## 2. Why Greedy Algorithms Matter

Greedy methods are often valuable because they can turn an apparently combinatorial optimization problem into a simple sequence of decisions.

They frequently provide:

- simple implementations
- low memory usage
- strong runtime performance
- online or incremental behavior
- useful approximations when exact optimization is difficult

## 3. Greedy Is Not a Proof

A locally best choice does **not** automatically imply a globally optimal solution.

Counterexamples are common.

Before using a greedy algorithm, establish a structural reason that the chosen decision can safely appear in an optimal solution.

## 4. Optimization Problem Model

Typical greedy problems contain:

- a set of candidates
- a feasibility constraint
- an objective function
- a sequence of choices

At each step, the algorithm selects a candidate according to a priority rule while preserving feasibility.

## 5. Greedy Choice Property

A problem has a greedy-choice property when there exists an optimal solution beginning with a greedy choice.

This is stronger than simply observing that the greedy choice looks reasonable.

## 6. Optimal Substructure

After making a safe greedy choice, the remaining problem should have an optimal solution that can be combined with that choice.

Greedy algorithms therefore often rely on both:

```text
Greedy-choice property
+
Optimal substructure
```

## 7. Exchange Argument

An **exchange argument** proves a greedy choice is safe by transforming an arbitrary optimal solution into another optimal solution that contains the greedy choice.

General pattern:

1. take an optimal solution `OPT`
2. identify where the greedy choice differs
3. replace that choice with the greedy choice
4. prove feasibility is preserved
5. prove the objective does not worsen
6. obtain another optimal solution containing the greedy choice

## 8. Canonical Exchange Argument

Suppose the greedy algorithm selects `g` and an optimal solution selects `x` instead.

Construct:

```text
OPT' = OPT - {x} + {g}
```

Then prove:

```text
feasible(OPT')
objective(OPT') >= objective(OPT)
```

for a maximization problem, or the corresponding non-increase for minimization.

## 9. Interval Scheduling Preview

A canonical greedy problem is selecting the maximum number of mutually compatible intervals.

The safe rule is to repeatedly select the interval with the **earliest finishing time**.

The proof uses an exchange argument: an optimal schedule can exchange its first selected interval with the earliest-finishing interval without reducing the number of remaining opportunities.

## 10. Why Earliest Start Time Fails

Choosing the interval that starts earliest can block many later intervals.

The same is true for choosing the shortest interval or the interval with the fewest conflicts.

The correct rule must be justified by the structure of the objective.

## 11. Fractional Knapsack Preview

When items can be divided, selecting the greatest value-to-weight ratio first is optimal.

This is a genuine greedy problem because fractions allow exchanges that preserve feasibility.

The analogous **0/1 knapsack** problem does not generally permit the same greedy proof.

## 12. Greedy vs Dynamic Programming

Ask whether a local choice permanently commits the solution without losing a better future option.

If decisions interact in a way that requires remembering many alternative states, dynamic programming may be necessary instead.

## 13. Greedy vs Brute Force

Brute force explores combinations.

Greedy commits to one sequence.

The benefit is potentially enormous, but the cost is that an incorrect choice cannot usually be repaired later.

## 14. Greedy vs Backtracking

Backtracking explores choices and can undo them.

Greedy does not normally backtrack.

Therefore a greedy algorithm requires stronger structural justification.

## 15. Greedy Algorithm Template

```text
initialize solution

while candidates remain:
    choose best candidate according to rule
    if choice is feasible:
        commit choice
        update state

return solution
```

The difficult part is usually designing and proving the selection rule.

## 16. Feasibility Invariant

After every greedy choice:

```text
current solution remains feasible
```

This is one of the core invariants to maintain.

## 17. Progress Invariant

Every iteration should reduce the remaining problem or permanently commit some part of the solution.

This provides a straightforward termination argument.

## 18. Objective Invariant

A proof must connect each local decision to the global objective.

Do not confuse:

```text
locally highest score
```

with:

```text
globally optimal objective
```

## 19. Dominance

Greedy algorithms often work because one state dominates another.

If state `A` is at least as good as state `B` while offering every relevant future possibility, retaining `B` is unnecessary.

This dominance can justify discarding alternatives.

## 20. Stays-Ahead Arguments

Another proof technique shows that after every step, the greedy solution is at least as good as a corresponding optimal solution according to a useful progress measure.

This is common in scheduling and resource-allocation proofs.

## 21. Cut-Based Greedy Preview

Minimum spanning tree algorithms use a powerful greedy theorem: a light edge crossing a cut is safe for some MST.

This demonstrates that greedy correctness often comes from a graph structural theorem rather than intuition.

## 22. Matroid Preview

Matroids provide an abstract setting in which greedy optimization works for weighted independent-set selection.

Key concepts include:

- independence
- hereditary property
- exchange property
- weighted greedy selection

Matroids explain why several seemingly unrelated greedy algorithms share the same proof structure.

## 23. Greedy Failure Detection

Before implementing greedy, actively search for a counterexample.

Try:

- small exhaustive instances
- ties
- highly unbalanced values
- nested intervals
- one large item vs many small items
- adversarial ordering

A single counterexample disproves a greedy rule.

## 24. Brute Force as a Proof Assistant

For small inputs, implement exhaustive search and compare it against the proposed greedy algorithm.

This does not prove correctness for all inputs, but it is an excellent way to discover false conjectures and validate implementations.

## 25. Tie-Breaking

If several candidates have equal greedy priority, determine whether tie-breaking matters.

A robust algorithm should either:

- prove all ties are safe, or
- define deterministic tie-breaking.

## 26. Complexity

A greedy algorithm is often dominated by candidate ordering.

For example:

```text
sort candidates: O(N log N)
scan candidates: O(N)
```

Total:

```text
O(N log N)
```

But if candidates arrive already ordered, the cost may become `O(N)`.

## 27. Priority-Queue Greedy

Some greedy algorithms repeatedly select the currently best candidate from a changing frontier.

A heap can reduce repeated selection from linear scanning to logarithmic heap operations.

Examples appear in scheduling, graph algorithms, and resource allocation.

## 28. Greedy With Sorting

A very common pattern is:

```text
sort by structural key
→ scan once
→ commit safe choices
```

The sorting key is part of the algorithm and must be justified by the proof.

## 29. Greedy With Heap

Another pattern is:

```text
insert available candidates
→ extract best candidate
→ update candidate set
→ repeat
```

The heap controls the dynamic greedy frontier.

## 30. Backend Applications

Greedy reasoning appears in:

- job scheduling
- resource allocation
- admission policies
- cache eviction heuristics
- capacity planning
- network construction
- batching
- deadline selection

Production systems must distinguish proven optimal algorithms from heuristics.

## 31. AI Applications

Greedy methods appear in:

- best-first search
- beam selection
- candidate pruning
- feature selection heuristics
- decoding strategies
- approximate planning
- resource-constrained search

AI systems often use greedy choices intentionally as approximations rather than claiming global optimality.

## 32. Production Engineering

A production greedy system should define:

- objective
- feasibility constraints
- priority rule
- tie-breaking
- update semantics
- complexity
- failure behavior
- approximation/optimality guarantee

## 33. Correctness Proof Template

Use:

```text
Lemma 1: greedy choice is safe.
Lemma 2: remaining problem preserves optimal substructure.
Theorem: repeated greedy choices produce an optimal solution.
```

For an exchange proof, explicitly construct the transformed optimal solution.

## 34. Common Mistakes

- assuming "largest first" must be optimal
- confusing a useful heuristic with a proof
- copying a greedy rule from a related problem
- ignoring feasibility after each choice
- forgetting tie cases
- using fractional-knapsack reasoning for 0/1 knapsack
- proving only that the algorithm terminates

## 35. Interview Framework

When asked whether a problem is greedy:

1. define the objective
2. identify the candidate decision
3. propose a local rule
4. search for counterexamples
5. identify exchange/dominance/cut structure
6. prove the greedy choice is safe
7. prove optimal substructure
8. derive complexity
9. discuss alternatives

## 36. Revision Checklist

- [ ] Define greedy algorithms.
- [ ] Explain greedy-choice property.
- [ ] Explain optimal substructure.
- [ ] Perform an exchange argument.
- [ ] Distinguish greedy from heuristic search.
- [ ] Recognize interval scheduling.
- [ ] Explain fractional vs 0/1 knapsack.
- [ ] Use brute force to test greedy hypotheses.
- [ ] Reason about tie-breaking.
- [ ] Analyze sorting and heap-based greedy algorithms.
- [ ] Explain matroid intuition.
- [ ] Translate greedy reasoning to backend and AI systems.

## Key Takeaways

1. Greedy algorithms are justified by structure, not intuition.
2. The exchange argument is one of the most important proof techniques.
3. Optimal substructure explains why the remaining problem can be solved recursively or iteratively.
4. Counterexample search should happen before committing to a greedy strategy.
5. Sorting and priority queues are common implementation mechanisms for greedy algorithms.
6. In backend and AI systems, clearly distinguish exact greedy optimization from heuristic approximation.
