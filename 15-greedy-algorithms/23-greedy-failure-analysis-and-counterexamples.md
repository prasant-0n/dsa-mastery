# 15.23 — Greedy Failure Analysis & Counterexamples

## 1. Concept Definition

A greedy algorithm is not justified merely because its local choice looks reasonable.

**Greedy failure analysis** is the disciplined process of determining when a greedy rule is exact, approximate, or incorrect by constructing counterexamples and identifying the missing structural property.

The core question is:

> What prevents a locally best decision from destroying the globally best solution?

## 2. Why Counterexamples Matter

A single valid counterexample disproves a universal greedy claim.

For a proposed algorithm:

```text
claim: greedy always produces an optimum
counterexample: one valid input where greedy < optimum
```

This makes counterexample construction one of the most valuable DSA reasoning skills.

## 3. Greedy Proof Signals

Common structural reasons greedy can work include:

- exchange property
- cut property
- optimal substructure
- matroid independence
- prefix property
- dominance
- diminishing returns with a known constraint structure

The absence of an obvious proof signal should trigger skepticism.

## 4. Greedy Choice Property

A problem has a useful greedy-choice property when some globally optimal solution contains a locally selected choice that can safely be fixed first.

This must be demonstrated, not assumed.

## 5. Exchange Argument

A common proof pattern is:

```text
Take an optimal solution O.
If O already contains greedy choice g, continue.
Otherwise replace an appropriate choice in O with g.
Show feasibility is preserved and objective does not worsen.
```

If the replacement cannot always be made, the greedy proof fails at that point.

## 6. Exchange Failure

A counterexample often appears when replacing the optimal choice with the greedy choice causes a later resource conflict.

This is especially common in:

- weighted scheduling
- 0/1 knapsack
- arbitrary graph path problems
- packing
- tokenization

## 7. Activity Selection vs Weighted Scheduling

Unweighted activity selection is solved optimally by earliest finishing time.

Adding arbitrary activity weights changes the problem.

The same earliest-finish rule can then fail because a later high-value activity may be preferable.

## 8. 0/1 Knapsack Boundary

For fractional knapsack, value density gives an exact greedy solution.

For 0/1 knapsack, an item cannot be partially taken.

A high-density item can consume capacity that would produce greater total value through a different combination.

This is a canonical greedy boundary.

## 9. Coin Change Failure

Choosing the largest denomination first works for some canonical coin systems.

It does not work for arbitrary denominations.

For example, denominations `{1, 3, 4}` and target `6`:

```text
greedy: 4 + 1 + 1 = 3 coins
optimal: 3 + 3 = 2 coins
```

The counterexample immediately disproves universal greedy correctness.

## 10. Shortest Path Boundary

Dijkstra's greedy extraction relies on nonnegative edge weights.

With negative edges, a node finalized too early may later receive a shorter path.

The local decision is therefore no longer safe under the original invariant.

## 11. Negative-Cycle Boundary

If reachable negative cycles exist, shortest-path optimization may have no finite optimum.

An algorithm must distinguish:

```text
finite shortest path
negative cycle
unreachable vertex
```

## 12. MST Boundary

Kruskal and Prim are greedy algorithms with strong correctness guarantees because the cut property supports safe edge selection.

Not every graph optimization objective has that property.

Changing the objective can invalidate the MST greedy argument.

## 13. Shortest Superstring Boundary

Choosing the pair with maximum overlap is intuitive.

But locally maximizing overlap does not guarantee the globally shortest superstring.

This is a useful example of a greedy heuristic without an exact greedy proof.

## 14. Set Cover Boundary

Greedy Set Cover is not generally exact.

Its strength is an approximation guarantee, not universal optimality.

This distinction is essential:

```text
exact greedy != approximate greedy
```

## 15. Submodular Boundary

Monotone submodular maximization under a cardinality constraint supports a classic greedy approximation guarantee.

Changing the objective to non-monotone or changing the constraints can invalidate the same guarantee.

## 16. Online Algorithm Boundary

An online greedy algorithm makes decisions without knowing future input.

An offline optimum can use future information.

The correct comparison is often a competitive ratio rather than exact equality with the offline optimum.

## 17. Adversarial Inputs

A strong greedy test suite deliberately constructs inputs that exploit the algorithm's local rule.

Useful adversarial dimensions include:

- ties
- near ties
- large early values
- delayed high-value choices
- overlapping resources
- nested intervals
- redundant candidates
- pathological ordering

## 18. Counterexample Construction Recipe

Use this process:

```text
1. Write the greedy rule exactly.
2. Identify what information it ignores.
3. Make the ignored information matter later.
4. Create the smallest possible instance.
5. Compute greedy result.
6. Compute a better feasible solution.
7. Verify every constraint.
```

## 19. Minimal Counterexamples

A small counterexample is easier to understand and explain in interviews.

Start with:

```text
2 choices
→ 3 choices
→ 4 choices
```

and increase only when necessary.

## 20. Brute-Force Oracle

For tiny instances, enumerate every feasible solution and calculate the exact optimum.

Then compare:

```text
greedyResult === optimalResult
```

This is one of the strongest practical tools for discovering failures.

## 21. Differential Testing

Run multiple implementations against the same generated instances:

- greedy
- dynamic programming
- brute-force oracle
- alternative exact algorithm

Any disagreement becomes a debugging or proof-investigation target.

## 22. Property Testing

Rather than checking only expected outputs, verify invariants such as:

```text
solution is feasible
solution contains no invalid elements
capacity is respected
objective is internally consistent
```

Property tests catch classes of bugs rather than individual examples.

## 23. Metamorphic Testing

Transform an input in a way that should preserve or predictably change the answer.

Examples:

- reorder independent candidates
- duplicate a dominated option
- add an unusable resource
- scale all weights by a positive constant

The expected relationship becomes the test oracle.

## 24. Tie-Breaking

Different tie-breaking rules can produce different greedy outputs.

If correctness depends on a particular tie rule, it must appear explicitly in the algorithm and proof.

Otherwise test all relevant tie permutations.

## 25. Ordering Sensitivity

Some greedy algorithms are order-independent.

Others are highly order-sensitive.

If changing input order changes solution quality, the ordering policy is part of the algorithm.

## 26. Dominated Choices

A candidate is dominated if another candidate is at least as good under every relevant dimension and strictly better in one.

Adding dominated choices should not improve an optimum under the same objective.

This creates useful metamorphic tests.

## 27. Greedy Score Failure

Suppose the score is:

```text
value / cost
```

A ratio can ignore interactions between choices.

Whenever selecting one candidate changes the value or feasibility of another, inspect whether independent scoring remains valid.

## 28. State-Dependent Greedy

A candidate's marginal value can change after another selection.

Examples:

- Set Cover
- Maximum Coverage
- caching
- replica placement
- retrieval diversity

Recompute marginal value when the mathematical model requires it.

## 29. Stale-State Failure

In distributed systems, a score calculated from an old state may no longer be valid.

The algorithm must either:

- validate before commit
- use versioned state
- tolerate approximation
- serialize decisions

## 30. Feasibility Failure

A greedy score must never override hard constraints.

Bad pattern:

```text
highest score → assign
```

Correct pattern:

```text
filter feasible candidates
→ rank feasible candidates
→ select
```

## 31. Objective Mismatch

A greedy policy may optimize a proxy instead of the actual objective.

For example:

```text
maximize CPU utilization
```

may conflict with:

```text
minimize request latency
```

A high utilization score does not prove better system performance.

## 32. Local vs Global Metrics

A local improvement may worsen a global metric.

Examples:

- one node becomes highly utilized
- one tenant receives excessive capacity
- one cache becomes overloaded
- one GPU receives incompatible workload concentration

Always define the objective at the system level.

## 33. Approximation Ratio Analysis

For an approximation algorithm:

```text
ratio = algorithmValue / optimalValue
```

for maximization problems, with appropriate conventions.

For minimization problems, the ratio is commonly:

```text
algorithmCost / optimalCost
```

The direction and normalization must be stated explicitly.

## 34. Empirical Ratio vs Theoretical Guarantee

Observed performance on random tests is not a proof.

A theoretical guarantee applies to every input satisfying the theorem's assumptions.

Keep these statements separate.

## 35. Proving a Lower Bound

To show that a greedy rule cannot achieve a better universal guarantee, construct a family of instances where its ratio approaches the proposed limit.

A single example disproves exactness; a family is often needed to establish asymptotic tightness.

## 36. Automated Counterexample Search

A counterexample finder can:

```text
generate instance
→ run greedy
→ run exact oracle
→ compare
→ retain failures
→ minimize failure
```

This turns proof discovery into an engineering workflow.

## 37. Counterexample Minimization

Once a failing instance is found, repeatedly remove or simplify elements while preserving failure.

This is analogous to delta debugging.

The resulting minimal witness often exposes the missing invariant.

## 38. Proof Debugging

When a proof fails, locate the exact statement that cannot be established.

For example:

```text
"greedy choice can always replace optimal choice"
```

may fail because no feasible replacement exists.

That failure is more informative than merely knowing the algorithm is wrong.

## 39. Greedy vs Dynamic Programming

Use DP when the best decision depends on combinations of previous choices and no safe local exchange exists.

Common boundaries:

```text
0/1 knapsack
weighted interval scheduling
arbitrary coin change
```

## 40. Greedy vs Backtracking

Backtracking is useful when the search space must be explored because local choices cannot guarantee the optimum.

Pruning can make exact search practical on structured small instances.

## 41. Greedy vs Graph Search

For path problems, distinguish:

- BFS
- Dijkstra
- A*
- Bellman-Ford
- Floyd-Warshall

The correct greedy invariant depends on edge-weight assumptions and objective.

## 42. Greedy vs Approximation

If exact optimization is computationally expensive but a greedy approximation has a formal bound, the engineering question becomes:

```text
acceptable quality
vs
runtime + memory + implementation complexity
```

## 43. Backend Failure Analysis

Apply counterexample thinking to:

- schedulers
- cache eviction
- load balancing
- rate limits
- autoscaling
- replica placement
- query planning
- resource allocation

Construct workloads that maximize the gap between local score and system objective.

## 44. AI Failure Analysis

Apply the same method to:

- retrieval selection
- tool selection
- GPU scheduling
- evaluation-set selection
- data-source selection
- batching
- model placement

Test redundancy, delayed value, resource interactions, and prediction errors.

## 45. Production Safety Invariants

A greedy optimization must never violate safety properties merely to improve its score.

Examples:

```text
capacity never negative
quota never exceeded
invalid reference never emitted
request isolation preserved
output size bounded
```

## 46. Regression Corpus

Every discovered counterexample should become a permanent regression test.

Recommended workflow:

```text
counterexample found
→ minimize
→ document
→ add test
→ fix algorithm or qualify guarantee
```

## 47. Interview Framework

When someone claims a greedy solution is correct:

1. state the greedy rule
2. test tiny examples
3. search for a counterexample
4. identify the structural proof property
5. attempt an exchange argument
6. compare against an exact oracle
7. state assumptions
8. classify as exact, approximate, or heuristic

## 48. Implementation Lab

Implement:

1. generic greedy runner
2. brute-force oracle
3. counterexample generator
4. counterexample minimizer
5. differential tester
6. metamorphic tester
7. approximation-ratio analyzer
8. adversarial workload generator
9. regression corpus
10. Backend greedy failure simulator
11. AI greedy failure simulator

## 49. Revision Checklist

- [ ] Explain why one counterexample disproves a universal greedy claim.
- [ ] Construct minimal counterexamples.
- [ ] Use brute-force exact oracles.
- [ ] Understand exchange-argument failure.
- [ ] Recognize the 0/1 knapsack boundary.
- [ ] Recognize arbitrary coin-change failure.
- [ ] Understand shortest-path assumptions.
- [ ] Distinguish exact, approximation, and heuristic greedy algorithms.
- [ ] Analyze tie-breaking and ordering sensitivity.
- [ ] Use property and metamorphic testing.
- [ ] Automate counterexample discovery and minimization.
- [ ] Apply failure analysis to Backend and AI systems.

## Key Takeaways

1. A greedy-looking rule is a hypothesis until its correctness structure is established.
2. One valid counterexample can disprove a universal exactness claim.
3. Minimal counterexamples expose exactly which assumption or invariant is missing.
4. Exact brute-force oracles make tiny-instance differential testing extremely powerful.
5. Approximation guarantees require their stated objective and constraint assumptions.
6. Every discovered counterexample should become a regression test.
7. Expert DSA reasoning means knowing not only how greedy algorithms work, but exactly where and why they stop working.
