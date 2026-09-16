# 15.11 — A* Search & Heuristic-Guided Greedy Optimization

## 1. Concept Definition

A* is a best-first graph-search algorithm that combines the cost already paid to reach a state with a heuristic estimate of the remaining cost to a goal.

Its evaluation function is:

```text
f(n) = g(n) + h(n)
```

where `g(n)` is the known path cost from the start and `h(n)` estimates the remaining cost to the goal.

## 2. Why It Exists

Dijkstra's algorithm expands the lowest known path cost and has no directional knowledge of the target.

A* adds domain knowledge through a heuristic so the search can prioritize states that appear promising toward the goal.

## 3. Mental Model

Think of each frontier state as having two costs:

```text
g = cost already spent
h = estimated remaining cost
f = estimated total cost
```

The priority queue expands the smallest `f` value.

## 4. Problem Model

Typical input:

- a state space or graph
- start state
- goal state
- non-negative transition costs
- heuristic function

Goal:

Find a minimum-cost path from start to goal under the algorithm's heuristic assumptions.

## 5. Dijkstra Relationship

If:

```text
h(n) = 0
```

for every state, then:

```text
f(n) = g(n)
```

and A* becomes uniform-cost search, corresponding to Dijkstra's frontier ordering in the appropriate graph model.

## 6. Greedy Best-First Search

Greedy best-first search prioritizes only:

```text
f(n) = h(n)
```

It can reach a goal quickly but does not generally guarantee a shortest path.

A* balances accumulated cost and estimated remaining cost.

## 7. Admissible Heuristic

A heuristic is admissible when it never overestimates the true remaining optimal cost:

```text
h(n) <= h*(n)
```

where `h*(n)` is the actual minimum remaining cost.

For standard A* graph-search settings, admissibility is central to optimality reasoning.

## 8. Consistent Heuristic

A heuristic is consistent when for every edge `u -> v`:

```text
h(u) <= cost(u, v) + h(v)
```

and the goal has heuristic zero.

Consistency implies admissibility and gives an especially clean graph-search implementation because `f` values do not decrease along an edge.

## 9. Why Consistency Matters

With a consistent heuristic, once a state is removed from the priority queue with its best valid `f` ordering, its `g` value can be treated as final under the standard closed-set formulation.

Without consistency, graph-search A* may need to reopen states when a better path is discovered.

## 10. Relaxation

For a transition `u -> v` with cost `w`:

```text
candidateG = g[u] + w
```

If `candidateG < g[v]`, update `g[v]`, record the predecessor, and compute:

```text
f[v] = g[v] + h(v)
```

## 11. Priority Queue

A min-heap ordered by `f` is the standard efficient frontier structure.

Tie-breaking can use lower `h`, lower `g`, insertion order, or a domain-specific deterministic rule.

Tie-breaking affects search behavior and performance but, under valid optimality assumptions, not the optimal path cost.

## 12. Lazy Heap Entries

As with practical Dijkstra implementations, A* can use lazy duplicate queue entries.

When a better `g` value is discovered, push a new entry.

When an old entry is extracted, discard it if its stored `g` no longer matches the current best-known value.

## 13. Closed Set

A closed set records states that have been expanded.

Under consistency assumptions, expanded states generally do not need to be reopened.

Under weaker assumptions, reopening may be necessary for correctness.

## 14. Goal Test Timing

For standard A* with an admissible heuristic and appropriate graph-search implementation, terminating when the goal is selected for expansion is the safe optimality point.

Do not stop merely when the goal is first discovered.

## 15. Why A* Can Search Less

A useful heuristic gives the algorithm information about direction.

States that appear unable to produce a competitive route can remain unexpanded.

The quality of the heuristic can therefore strongly affect practical runtime even when the asymptotic worst-case behavior remains large.

## 16. Heuristic Quality

Useful categories include:

- weak heuristic: little guidance
- informative heuristic: substantial pruning of search
- perfect heuristic: exactly equals remaining optimal cost

A perfect heuristic makes A* expand only states necessary for an optimal solution subject to tie behavior.

## 17. Dominance

If two admissible heuristics satisfy:

```text
h2(n) >= h1(n)
```

for every state, then `h2` is at least as informed while remaining admissible.

This is useful when comparing heuristic designs.

## 18. Combining Heuristics

The pointwise maximum of multiple admissible heuristics is also admissible:

```text
h(n) = max(h1(n), h2(n), ...)
```

This can produce a stronger heuristic without sacrificing admissibility.

## 19. Grid Search

For a 4-direction grid with unit movement cost, Manhattan distance is a natural heuristic:

```text
|x1 - x2| + |y1 - y2|
```

For unrestricted 8-direction movement with equal diagonal cost, a different geometric lower bound is required.

## 20. Weighted Grids

If movement costs vary, the heuristic must remain a lower bound on the true remaining cost.

A geometric distance alone may be insufficient unless scaled appropriately.

## 21. Euclidean Distance

For movement where straight-line distance is a lower bound on travel cost, Euclidean distance can be admissible.

The relationship between geometry and movement rules must be verified rather than assumed.

## 22. Abstraction Heuristics

A problem can sometimes be simplified into an abstract state space.

Solving the abstract problem can provide a lower-bound estimate for the original problem.

This is a powerful route to domain-specific heuristics.

## 23. Pattern Databases

For combinatorial search, a pattern database precomputes exact costs for an abstract subset of the state.

The lookup becomes a heuristic for the full problem when the abstraction preserves the required lower-bound property.

## 24. Memory Trade-Off

A stronger heuristic may require preprocessing or additional memory.

Production design therefore balances:

```text
heuristic computation + memory + search reduction
```

rather than optimizing only the number of expanded states.

## 25. A* vs Dijkstra

Dijkstra:

```text
priority = g
```

A*:

```text
priority = g + h
```

Dijkstra is uninformed with respect to the target; A* uses a heuristic.

## 26. A* vs Greedy Best-First

Greedy best-first:

```text
priority = h
```

A*:

```text
priority = g + h
```

The `g` term prevents the search from ignoring expensive paths already taken.

## 27. A* vs BFS

BFS is appropriate when every edge has equal unit cost.

A* is useful when transition costs vary and a useful heuristic exists.

For unit-cost graphs with `h = 0`, A* reduces to uniform-cost search rather than gaining heuristic guidance.

## 28. A* vs Bidirectional Search

Bidirectional search changes the search topology by expanding from both endpoints.

A* changes frontier priority using heuristic information.

They can be combined, but correctness and termination conditions require careful design.

## 29. Weighted A*

Weighted A* modifies the evaluation function, commonly:

```text
f(n) = g(n) + w * h(n)
```

for `w > 1`.

This gives more influence to the heuristic and can trade optimality for speed under appropriate theoretical bounds.

## 30. Heuristic Scaling

If the heuristic is scaled, document the relationship between the scaled estimate and the true cost.

Do not call a heuristic admissible after arbitrary scaling without proving the lower-bound property.

## 31. Bidirectional A* Boundary

Bidirectional A* is not simply “run A* twice and stop when frontiers touch.”

The stopping condition must establish that no better complete path remains.

## 32. Dynamic Graphs

If edge costs change during search, previously computed heuristic or frontier assumptions may no longer be valid.

Dynamic replanning algorithms such as Lifelong Planning A* or D* Lite address related settings.

## 33. Backend Applications

A* can be useful for:

- route planning with spatial information
- workflow state navigation
- dependency traversal toward a specific target
- infrastructure topology search
- game/server map routing

The heuristic must reflect a valid lower bound for the actual cost model.

## 34. AI Applications

A* is useful for:

- state-space planning
- robotics-style navigation
- puzzle solving
- symbolic search
- graph planning
- structured action planning

It is best understood as a general search framework rather than an AI-only algorithm.

## 35. Heuristic Design Is the Real Engineering Problem

The priority queue is relatively straightforward.

The difficult part is designing a heuristic that is:

- cheap to compute
- informative
- correct for the objective
- stable under state transitions
- memory efficient

## 36. Correctness Invariant

For every discovered state, `g` represents the cost of some known path from the start.

Therefore `g` is always an upper bound on the true optimal cost to that state.

For an admissible heuristic, `g + h` is an estimate that does not underestimate the total cost of an optimal completion in the sense required by the standard A* optimality proof.

## 37. Optimality Proof Sketch

Suppose A* selects the goal with cost `C` while a cheaper goal path of cost `C* < C` exists.

Along that cheaper path, consider the first frontier state `n`.

Admissibility implies:

```text
f(n) = g(n) + h(n) <= C*
```

But the goal has `f(goal) = C`.

Therefore `f(n) < f(goal)`, contradicting the choice to expand the goal first.

Thus the returned goal cost is optimal under the standard assumptions.

## 38. Correctness Boundaries

Optimality reasoning depends on details such as:

- non-negative transition costs
- admissible heuristic
- graph-search vs tree-search behavior
- consistency or state reopening
- termination rule

Always state the assumptions.

## 39. Complexity

A* has no single useful tight complexity independent of the state space and heuristic quality.

With a binary heap, practical work is often described in terms of expanded states `V'` and generated edges `E'`, with heap operations contributing logarithmic factors.

Worst-case search can still be exponential in the depth of the solution for broad state spaces.

## 40. Memory Complexity

A* can be memory-intensive because it stores frontier and often closed-set state.

Space can dominate runtime in large search problems.

## 41. Branching Factor

If the branching factor is `b` and the solution depth is `d`, uninformed tree search can approach exponential growth in `d`.

A strong heuristic can dramatically reduce the practical number of expanded states.

## 42. State Identity

A* requires correct state equality and hashing.

If two representations describe the same logical state but are treated as different keys, the search may revisit equivalent states unnecessarily.

## 43. Duplicate States

Graph search should detect previously discovered states.

The implementation must decide whether a new path improves the existing `g` value and whether the state must be reopened.

## 44. Path Reconstruction

Store a predecessor for every improved state.

When the goal is finalized under the chosen correctness model, follow predecessors back to the start and reverse the sequence.

## 45. Testing Strategy

Test heuristics independently from the search algorithm.

For small graphs:

- compare A* to Dijkstra
- compare against brute-force shortest paths
- verify admissibility
- verify consistency when claimed
- test zero-cost edges
- test unreachable goals
- test duplicate states

## 46. Adversarial Tests

Include:

- `h = 0`
- exact heuristic
- weak heuristic
- intentionally overestimating heuristic
- inconsistent heuristic
- zero-cost transitions
- many equal `f` values
- dead ends
- duplicate states
- disconnected goals
- large branching factors

## 47. Backend Performance Engineering

Measure:

- generated states
- expanded states
- stale queue entries
- heuristic calls
- average heuristic cost
- maximum frontier size
- closed-set size
- solution cost
- wall-clock time

A stronger heuristic is not automatically better if computing it is expensive.

## 48. AI Search Engineering

For AI planning systems, profile both search and model-derived heuristics.

A learned heuristic may be informative but requires explicit validation if the system depends on optimality guarantees.

## 49. Common Mistakes

- using an overestimating heuristic while claiming optimal A*
- stopping when the goal is discovered
- assuming admissibility and consistency are identical concepts
- forgetting state reopening when required
- ignoring duplicate states
- using Manhattan distance for incompatible movement rules
- treating A* as always faster than Dijkstra
- ignoring memory consumption

## 50. Interview Framework

For “find a shortest path using a heuristic”:

1. identify weighted state-space search
2. define `g`, `h`, and `f`
3. state the heuristic assumptions
4. use a min-heap ordered by `f`
5. relax transitions by `g`
6. handle duplicate/stale entries
7. define goal termination correctly
8. reconstruct the path
9. prove optimality under the stated assumptions
10. derive practical complexity and memory behavior

## 51. Revision Checklist

- [ ] Explain `f = g + h`.
- [ ] Explain admissibility.
- [ ] Explain consistency.
- [ ] Explain why `h = 0` gives Dijkstra/uniform-cost search.
- [ ] Implement lazy-heap A*.
- [ ] Reconstruct paths.
- [ ] Handle duplicate states and reopening.
- [ ] Design valid grid heuristics.
- [ ] Compare A* with BFS, Dijkstra, and greedy best-first search.
- [ ] Explain weighted A* trade-offs.
- [ ] Verify heuristic properties independently.
- [ ] Benchmark heuristic cost versus search reduction.

## Key Takeaways

1. A* combines actual path cost `g` with heuristic remaining cost `h`.
2. A useful admissible heuristic can dramatically reduce search compared with uninformed search.
3. Consistency simplifies graph-search correctness and reopening behavior.
4. A* becomes Dijkstra/uniform-cost search when `h = 0`.
5. Heuristic design is usually the central engineering challenge.
6. Optimality, speed, and memory must be evaluated under explicit assumptions.
