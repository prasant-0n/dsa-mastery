# 10.12 — Dynamic Programming Patterns: State, Transition, Memoization & Tabulation

## 1. Objective

Dynamic programming (DP) solves problems with overlapping subproblems and reusable state by computing each relevant state once.

```text
define state
→ define transition
→ define base cases
→ choose evaluation order
→ compute each state once
```

## 2. Why DP Exists

Naive recursion can solve the same subproblem repeatedly. DP stores the result so later calls reuse it.

DP is therefore best understood as **state-space compression plus reuse**, not simply as “recursion with an array.”

## 3. DP Recognition

Look for:

- recursive choices;
- overlapping subproblems;
- an objective such as min/max/count/existence;
- future decisions depending on a limited summary of the past.

Optimal substructure is also required for optimization formulations.

## 4. State Design

A DP state must contain exactly the information needed to determine future decisions.

Examples:

```text
index
index + remaining capacity
position + previous choice
row + column
interval boundaries
bitmask + position
```

Too little state causes incorrect reuse; unnecessary state increases time and memory.

## 5. Transition

The transition describes how one state derives from smaller or neighboring states.

For each state, ask:

```text
What choices are available?
What state does each choice lead to?
How are their results combined?
```

## 6. Base Cases

Base cases define states whose answers are directly known.

They must cover every recursion path or every boundary reached by the tabulation order.

## 7. Memoization

Top-down DP keeps the recursive formulation and caches computed states.

Typical complexity becomes:

```text
number of states × transition cost
```

provided each state is computed once.

## 8. Tabulation

Bottom-up DP explicitly computes states in an order where dependencies are already available.

The challenge is deriving the dependency order before writing loops.

## 9. Memoization vs Tabulation

Memoization:

- follows reachable states only;
- often easier to derive;
- uses recursion unless transformed.

Tabulation:

- avoids recursion depth;
- can reduce overhead;
- makes iteration order explicit;
- can enable aggressive space optimization.

## 10. One-Dimensional DP

Classic state form:

```text
DP[i] = best/count/possible result for prefix ending at i
```

Examples include climbing stairs, house robber, and one-dimensional sequence optimization.

## 11. Two-Dimensional DP

State may represent two coordinates:

```text
DP[i][j]
```

Examples include grid paths, edit distance, and two-sequence comparison.

## 12. Knapsack Pattern

A common state is:

```text
DP[i][capacity]
```

The transition considers whether to skip or take an item.

The state and iteration direction distinguish 0/1 knapsack from unbounded variants.

## 13. 0/1 vs Unbounded Knapsack

In 0/1 knapsack, each item can be used at most once.

In unbounded knapsack, an item may be reused.

With one-dimensional tabulation, iteration direction can enforce the intended usage semantics.

## 14. Sequence DP

Common patterns include:

- longest increasing subsequence;
- longest common subsequence;
- edit distance;
- sequence alignment.

The state captures enough history to make the next transition independent of the discarded history.

## 15. Interval DP

State often uses two boundaries:

```text
DP[l][r]
```

The transition chooses a split or endpoint inside the interval.

Examples include matrix-chain-style partitioning and interval merging objectives.

## 16. Partition DP

Partition a prefix or interval into groups while optimizing a cost.

Typical state:

```text
DP[i] = best result for first i elements
```

with transitions over a possible previous partition point.

## 17. Grid DP

A grid state usually derives from neighboring cells.

For example:

```text
DP[r][c] = combine(DP[r-1][c], DP[r][c-1])
```

The exact transition depends on allowed movement and objective.

## 18. State Compression

If a row depends only on the previous row, the full matrix may be unnecessary.

Memory can sometimes change from `O(RC)` to `O(C)`.

Space compression is valid only when overwritten states are no longer needed.

## 19. Bitmask DP

When the state involves a small set of selected entities, represent the selected subset as a bitmask.

Typical complexity grows exponentially with the number of entities, making this appropriate only for bounded state dimensions.

## 20. DAG DP

Dynamic programming can be viewed as evaluating states in a directed acyclic dependency graph.

Topological ordering makes the dependency structure explicit.

This perspective unifies many DP problems with graph algorithms.

## 21. DP on Trees

A tree DP state can depend on child states.

Typical states describe whether a node is selected, covered, constrained, or associated with a particular local condition.

## 22. DP on Graphs

General graphs may contain cycles, so ordinary DAG-style evaluation does not directly apply.

State transitions may require other techniques such as shortest-path algorithms, memoized acyclic state spaces, or specialized formulations.

## 23. Counting DP

The objective may be the number of valid ways rather than a minimum or maximum.

Define whether order matters and whether states represent distinct constructions or equivalent outcomes.

## 24. Boolean DP

Some DP problems ask only whether a target is achievable.

Examples include subset sum and reachability-style formulations.

Boolean state can reduce memory and computation compared with storing unnecessary numeric detail.

## 25. Min/Max DP

For optimization:

```text
DP[state] = min/max over valid transitions
```

The proof must show that every valid candidate transition is considered and that the stored state represents the required optimum for its subproblem.

## 26. Reconstruction

The DP value alone may not provide the actual solution.

Store parent/choice information or reconstruct choices by comparing the current state with its predecessor states.

## 27. Impossible States

Represent unreachable states explicitly, such as:

```text
Infinity
-null-like sentinel
false
```

Choose a representation that cannot be confused with a valid result.

## 28. Transition Ordering

For tabulation, derive a dependency graph before choosing loop directions.

A state must be computed only after every dependency it reads is valid.

## 29. Optimization of Transitions

A correct DP may still be too slow.

Look for:

- monotonicity;
- prefix sums;
- deques;
- heaps;
- binary search;
- state dominance;
- transition grouping.

These techniques can reduce transition cost without changing the state semantics.

## 30. DP vs Greedy

Greedy discards alternatives immediately after a proof-backed local choice.

DP retains multiple states when those alternatives can lead to different future outcomes.

A problem may have both formulations only when additional structure makes greedy safe.

## 31. DP vs Divide & Conquer

Divide and conquer solves subproblems independently and combines them.

DP becomes necessary when subproblems overlap and their answers can be reused.

## 32. Correctness Proof

A standard DP proof uses induction over the state dependency order:

1. base states are correct;
2. assume all dependency states are correct;
3. show the transition considers exactly the valid choices;
4. show the combination operation produces the correct result.

## 33. Complexity

A useful formula is:

```text
Time = number of states × transition cost
Space = stored states + reconstruction metadata
```

For compressed DP, report both conceptual state size and actual auxiliary memory.

## 34. Common Mistakes

1. Defining an incomplete state.
2. Storing irrelevant dimensions.
3. Missing base cases.
4. Reading a state before its dependencies are computed.
5. Confusing 0/1 and unbounded transitions.
6. Claiming memoization is polynomial without counting the state dimensions.
7. Optimizing memory before proving dependency safety.
8. Forgetting impossible states.
9. Returning the optimal value without reconstructing the requested solution.

## 35. Edge Cases

Test:

- empty input;
- zero capacity;
- impossible target;
- one state;
- duplicate items;
- negative values where allowed;
- all transitions blocked;
- multiple optimal solutions;
- maximum state dimensions;
- reconstruction ties.

## 36. Backend Applications

DP-style state reuse appears in:

- query planning and cost optimization;
- scheduling;
- resource allocation;
- workflow optimization;
- caching repeated computations;
- sequence/event alignment;
- dependency planning.

## 37. AI Applications

DP concepts appear in:

- sequence alignment;
- decoding;
- structured prediction;
- finite-state inference;
- planning over bounded state spaces;
- dynamic resource allocation.

Modern AI systems may use learned components alongside algorithmic DP; the DP state still requires a precise computational definition.

## 38. Testing Strategy

Use:

- brute-force comparison on small instances;
- memoized vs tabulated differential testing;
- recurrence/state-count checks;
- property tests for invariants;
- reconstruction validation;
- adversarial state-size tests.

## 39. Interview Framework

When DP appears:

```text
1. What decisions are being made?
2. What information from the past affects the future?
3. What is the minimum sufficient state?
4. What are the transitions?
5. What are the base cases?
6. Is the state graph acyclic or otherwise reusable?
7. Memoization or tabulation?
8. What is the dependency order?
9. Can transitions be optimized?
10. Can memory be compressed?
11. How is the answer reconstructed?
```

## 40. Revision Checklist

- [ ] I can derive a DP state from the decision process.
- [ ] I can write transitions before code.
- [ ] I can convert recursion to memoization.
- [ ] I can derive tabulation order.
- [ ] I understand 0/1 vs unbounded knapsack.
- [ ] I can recognize sequence/grid/interval DP.
- [ ] I understand bitmask DP.
- [ ] I can compress DP memory safely.
- [ ] I can prove a DP recurrence correct.
- [ ] I can compare DP with greedy and divide-and-conquer.

## 41. Key Takeaways

1. **DP is the disciplined reuse of overlapping subproblem states.**
2. **State design is the central skill: it must preserve exactly the information required for future decisions.**
3. **A DP implementation should be derived from state, transition, base cases, and dependency order—not from memorized code.**
4. **Time is usually state count multiplied by transition cost, while space depends on how many states must remain available.**
5. **Memoization, tabulation, state compression, and transition optimization are engineering choices built on the same underlying recurrence.**
