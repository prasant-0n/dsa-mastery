# 10.23 — Dynamic Programming Patterns: State Design, Transitions, Memoization, Tabulation & Optimization

## 1. Objective

Dynamic Programming (DP) solves problems with overlapping subproblems and optimal substructure by storing results so the same state is not recomputed.

```text
state
→ transition
→ base cases
→ dependency order
→ cached result
```

The hardest part is usually not coding the DP table. It is designing the correct state and transition.

## 2. Why DP Exists

Naive recursion may solve the same subproblem repeatedly. DP identifies equivalent states and computes each once.

## 3. DP Recognition

Look for:

- repeated subproblems;
- choices leading to smaller states;
- optimal substructure;
- counting, minimization, maximization, or feasibility objectives.

## 4. State Design

A DP state must contain every variable that affects the optimal future result.

Too little state produces incorrect reuse. Too much state creates unnecessary complexity.

## 5. Transition

A transition describes how the current state is derived from smaller or previously solved states.

For optimization:

```text
DP[state] = best over valid previous states
```

## 6. Base Cases

Base cases represent states whose answers are known directly.

They determine whether the recurrence has a valid foundation.

## 7. Memoization

Top-down DP keeps the natural recursive formulation and caches each computed state.

Typical complexity is:

```text
number of reachable states × transition cost
```

## 8. Tabulation

Bottom-up DP computes states iteratively in an order where dependencies are already available.

It often avoids recursion overhead and makes memory optimization easier.

## 9. Dependency Graph

Think of each DP state as a node in a directed acyclic dependency graph.

A valid tabulation order is a topological ordering of these dependencies.

## 10. 1D DP

Common examples include:

- climbing stairs;
- house robber;
- minimum cost paths on a line;
- prefix-based optimization.

The state often depends on a small fixed number of previous positions.

## 11. 2D DP

Two-dimensional state commonly represents two positions, two indices, grid coordinates, or two quantities.

Examples include:

- grid paths;
- edit distance;
- longest common subsequence;
- interval relationships.

## 12. Knapsack DP

For 0/1 knapsack, state may be:

```text
DP[i][capacity]
```

The transition chooses between excluding and including item `i`.

## 13. 0/1 vs Unbounded Knapsack

The iteration order and state transition differ because an item can be used once in 0/1 knapsack but repeatedly in unbounded variants.

A loop-order change can encode the usage constraint.

## 14. Subset Sum

Track whether a target sum is reachable using a prefix of the items.

This is a feasibility DP rather than an optimization DP.

## 15. Coin Change

Depending on the objective, DP can calculate:

- minimum number of coins;
- number of combinations;
- number of ordered sequences.

These are different problems and require different transition/order semantics.

## 16. Longest Common Subsequence

`DP[i][j]` can represent the best LCS length for prefixes ending before indices `i` and `j`.

Equal characters and unequal characters produce different transitions.

## 17. Edit Distance

State the cost of transforming one prefix into another.

The transition considers insertion, deletion, and replacement.

## 18. Longest Increasing Subsequence

Possible formulations include `O(N²)` DP and faster `O(N log N)` approaches using ordered tails.

Not every DP problem must remain a DP table when stronger structure exists.

## 19. Interval DP

The state is often an interval `[l, r]`, and transitions split it at an intermediate position.

Examples include matrix-chain multiplication and interval partitioning problems.

## 20. Partition DP

Partition a sequence into groups while optimizing a cumulative objective.

A common form is:

```text
DP[i] = best over j < i of (DP[j] + cost(j, i))
```

## 21. State Compression

If a state only depends on a small previous frontier, retain only the required rows/columns or variables.

This can reduce space from `O(NM)` to `O(M)`.

## 22. Rolling Arrays

For row-dependent 2D DP, keep current and previous rows when no older rows are needed.

Verify dependency direction before overwriting values.

## 23. In-Place DP

A DP table can sometimes be updated directly in the input or one-dimensional buffer.

Correctness depends on preventing overwritten values from being reused incorrectly.

## 24. Bitset DP

Boolean subset-style states can sometimes be represented with machine-word or language-supported bit operations, dramatically reducing practical constants.

## 25. DAG DP

A DAG naturally provides a DP dependency graph. Process vertices in topological order and relax transitions.

This connects dynamic programming with graph algorithms.

## 26. Tree DP

For trees, define a state relative to a node and often whether its parent/edge imposes a constraint.

Examples include independent set, subtree aggregation, and rerooting techniques.

## 27. Rerooting DP

Compute information for one root, then propagate complementary information to derive answers for every possible root.

The key is separating child-contributed state from parent/outside-subtree state.

## 28. Bitmask DP

When the universe is small, a bitmask can encode selected or visited elements.

Typical complexity is exponential in the universe size, but polynomial in the number of DP states times transitions.

## 29. Digit DP

Digit DP counts or optimizes over integers represented digit-by-digit under constraints.

State may include:

- digit position;
- tightness;
- leading-zero status;
- accumulated property;
- modular or count state.

## 30. Automaton / String DP

A finite automaton can become part of the DP state to process strings under pattern or language constraints.

## 31. DP + Monotonic Structures

A transition such as a sliding minimum/maximum can sometimes be optimized with a monotonic deque.

This changes the transition cost while preserving the DP state model.

## 32. DP + Binary Search

If DP transitions involve monotone thresholds or predecessor queries, binary search can reduce transition cost.

The proof must establish the ordering required by the search.

## 33. DP + Prefix Sums

Prefix sums can reduce range-sum transition costs from `O(N)` to `O(1)`, often reducing a DP from quadratic transition work to near-linear or `O(N log N)` depending on the remaining optimization.

## 34. DP Optimization

Advanced optimization techniques include:

- divide-and-conquer optimization;
- Knuth-style optimization under specific conditions;
- convex hull trick;
- Li Chao tree;
- monotone queue optimization.

Each requires structural assumptions; they are not interchangeable tricks.

## 35. Correctness Proof

A DP proof should establish:

1. state meaning is precise;
2. base cases are correct;
3. every transition considers exactly the valid possibilities;
4. no required predecessor is omitted;
5. the dependency order computes prerequisites first;
6. the stored value equals the intended optimum/count/feasibility result.

## 36. Complexity

Use:

```text
states × transition cost
```

Then separately report auxiliary space and any preprocessing.

For optimized DP, explain which transition cost was reduced and what data structure enables it.

## 37. Common Mistakes

1. Designing an incomplete state.
2. Mixing optimization and counting semantics.
3. Incorrect base cases.
4. Wrong iteration direction.
5. Double-counting combinations.
6. Treating ordered and unordered sequences as identical.
7. Overwriting dependencies in compressed DP.
8. Applying an optimization without proving its structural assumptions.

## 38. Edge Cases

Test:

- empty input;
- zero capacity;
- impossible target;
- one item;
- duplicate values;
- zero/negative costs where permitted;
- all equal elements;
- maximum state dimensions;
- unreachable states;
- ties among optimal solutions.

## 39. Backend Applications

DP appears in:

- scheduling optimization;
- pricing and allocation models;
- resource planning;
- workflow optimization;
- sequence reconciliation;
- temporal policy evaluation.

## 40. AI Applications

DP supports:

- sequence decoding;
- dynamic alignment;
- structured prediction;
- shortest-path style inference;
- constrained generation;
- segmentation;
- optimal sequence alignment.

Many modern AI workloads use specialized or approximate methods when exact DP state spaces become too large.

## 41. Testing Strategy

Use:

- brute-force recursion for small inputs;
- memoized-vs-tabulated differential tests;
- state invariant assertions;
- randomized transitions;
- edge-case suites;
- optimized-vs-naive transition comparisons;
- memory and runtime benchmarks.

## 42. Interview Framework

When DP appears:

```text
1. What exactly does the state mean?
2. What decisions lead into the state?
3. What are the base cases?
4. Is the problem optimization, counting, or feasibility?
5. Do subproblems overlap?
6. What is the dependency graph?
7. What is the natural recurrence?
8. Can it be memoized or tabulated?
9. Can state space be compressed?
10. Can transitions be optimized with another pattern?
```

## 43. Revision Checklist

- [ ] I can define DP state precisely.
- [ ] I can derive transitions.
- [ ] I understand memoization.
- [ ] I understand tabulation.
- [ ] I can identify dependency order.
- [ ] I can solve 1D/2D DP.
- [ ] I understand knapsack variants.
- [ ] I understand LCS/edit distance.
- [ ] I can compress DP memory safely.
- [ ] I understand advanced DP optimizations conceptually.

## 44. Key Takeaways

1. **DP is fundamentally state design plus transitions over overlapping subproblems.**
2. **The meaning of the state must be precise enough that cached values remain valid.**
3. **Memoization and tabulation compute the same dependency structure in different directions.**
4. **Space optimization is safe only when overwritten information is provably unnecessary.**
5. **Advanced DP optimization works by exploiting additional structure in the transition—not by applying arbitrary tricks.**
