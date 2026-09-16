# 14.20 — Graph Coloring, Bipartite Graphs & Constraint Modeling

## 1. Concept Definition

A **proper vertex coloring** assigns colors to vertices so that adjacent vertices receive different colors.

The minimum number of colors required is the **chromatic number** `χ(G)`.

## 2. Why It Matters

Coloring models conflict constraints:

- scheduling
- register allocation
- frequency assignment
- resource separation
- map coloring
- exam timetables
- conflict-free grouping

## 3. Bipartite Graphs and 2-Coloring

A graph is bipartite exactly when it can be properly colored using at most two colors.

This gives an important equivalence:

```text
bipartite ⇔ 2-colorable ⇔ no odd cycle
```

## 4. BFS/DFS Bipartite Testing

Assign alternating colors while traversing each connected component.

For every edge `(u,v)`:

```text
color[v] = 1 - color[u]
```

If an edge connects equal colors, the graph is not bipartite.

## 5. Disconnected Graphs

Start a coloring traversal from every uncolored vertex.

Bipartiteness is a property of every connected component.

## 6. Odd-Cycle Certificate

When a conflict is found, parent pointers can reconstruct an odd cycle.

This provides a useful failure certificate rather than only returning `false`.

## 7. General Graph Coloring

For `k > 2`, determining whether a general graph is `k`-colorable is computationally difficult in the general case.

Backtracking can solve small instances exactly but may require exponential time.

## 8. Greedy Coloring

Process vertices in an order and assign the smallest color not used by already-colored neighbors.

A greedy coloring is always valid, but its number of colors depends on the vertex ordering.

## 9. Greedy Upper Bound

Greedy coloring uses at most:

```text
Δ + 1
```

colors, where `Δ` is maximum degree.

Better orderings can often use substantially fewer colors.

## 10. Vertex Ordering Matters

Common ordering strategies include:

- natural order
- degree order
- largest-degree-first
- smallest-last ordering
- DSATUR-style saturation ordering

The ordering changes greedy coloring quality.

## 11. DSATUR

DSATUR prioritizes an uncolored vertex by the number of distinct colors already used by its colored neighbors, with a deterministic tie-break rule.

It is a heuristic for general graph coloring and can also be embedded in exact search.

## 12. Backtracking Coloring

Exact `k`-coloring can recursively assign colors and backtrack whenever a constraint is violated.

State:

```text
vertex assignment + available colors
```

## 13. Constraint Propagation

Before branching, remove colors already forbidden by neighboring assignments.

If a vertex has no legal color, backtrack immediately.

This reduces unnecessary search.

## 14. Forward Checking

After assigning a color, update the available-color domains of neighboring unassigned vertices.

A domain becoming empty is an immediate contradiction.

## 15. Variable Ordering

A useful constraint-search strategy is to branch on the most constrained variable first.

DSATUR is one graph-coloring-specific realization of this idea.

## 16. Symmetry Breaking

Color names are interchangeable.

For example, swapping colors `1` and `2` produces an equivalent coloring.

Fixing the first vertex to color `0` can remove some redundant search.

## 17. Chromatic Number

To determine `χ(G)` exactly for a small graph, test colorability with increasing `k` until a feasible coloring exists.

The smallest feasible `k` is the chromatic number.

## 18. Clique Lower Bound

Every clique of size `k` requires at least `k` colors.

Therefore:

```text
ω(G) <= χ(G)
```

where `ω(G)` is the clique number.

## 19. Independent Sets

Each color class is an independent set.

Therefore coloring partitions the vertices into independent sets.

This connects coloring to scheduling and resource grouping.

## 20. Complement Graph Boundary

A coloring of `G` corresponds to a partition of vertices into cliques in the complement graph `Ḡ`.

This dual perspective is useful in certain optimization reductions.

## 21. Edge Coloring Preview

Vertex coloring assigns colors to vertices.

**Edge coloring** assigns colors to edges so incident edges receive different colors.

Do not confuse the two problems.

## 22. Scheduling Interpretation

If vertices represent tasks and edges represent conflicts, each color can represent a time slot.

Adjacent tasks cannot share a slot.

## 23. Resource Allocation Interpretation

If adjacent entities cannot share a resource class, graph coloring assigns compatible groups.

The number of colors represents the number of required classes under the model.

## 24. Register Allocation Preview

Compiler register allocation can be modeled using an interference graph.

Vertices represent live ranges and edges represent simultaneous-use conflicts.

Coloring assigns registers in simplified formulations.

## 25. Frequency Assignment

Vertices can represent transmitters and edges interference constraints.

Colors represent frequencies or channels.

A proper coloring prevents adjacent conflicting transmitters from sharing a channel.

## 26. Backend Application: Job Scheduling

Build a conflict graph where an edge means two jobs cannot run in the same slot or resource class.

Coloring provides conflict-free grouping.

Real schedulers additionally model durations, capacity, priorities, and dependencies.

## 27. Backend Application: Multi-Tenant Resource Separation

Tenants or workloads with incompatible co-location requirements can be represented as conflict edges.

Color classes can encode isolation groups.

## 28. AI Application: Batch Construction

If items cannot be processed together because of conflicts, a coloring can partition them into compatible batches.

## 29. AI Application: Feature/Experiment Allocation

Conflicting experiments can be modeled as graph vertices and conflict edges.

Colors can represent isolated execution groups.

## 30. AI Application: Constraint Search

Coloring is a compact example of constraint satisfaction:

```text
variables = vertices
values = colors
constraints = adjacent vertices differ
```

This connects graph algorithms with CSP and AI search.

## 31. Correctness — Bipartite Coloring

Maintain the invariant that every colored edge has endpoints with opposite colors.

A same-color edge is therefore a direct proof that the graph cannot be bipartite.

## 32. Correctness — Greedy Coloring

When coloring vertex `v`, choose a color absent from all already-colored neighbors.

No processed edge can therefore become monochromatic.

## 33. Correctness — Backtracking

Each recursive state represents a partial assignment satisfying all constraints considered so far.

A branch is discarded only when no legal extension remains.

Exhausting all branches therefore proves that no coloring exists for the tested `k`.

## 34. Complexity

BFS/DFS bipartite testing:

```text
O(V + E)
```

General exact `k`-coloring can be exponential.

Greedy coloring is typically `O(V + E)` with suitable adjacency processing, though priority-based heuristics add data-structure costs.

## 35. Testing Strategy

Test:

- empty graph
- isolated vertices
- paths
- even cycles
- odd cycles
- complete graphs
- bipartite graphs
- disconnected graphs
- self-loops
- duplicate edges
- sparse and dense graphs

## 36. Differential Testing

For small graphs compare exact backtracking colorability against greedy and DSATUR heuristics.

Do not treat a heuristic failure to find a `k`-coloring as proof that none exists unless the algorithm is exhaustive.

## 37. Property Testing

Validate:

- every vertex has a legal color
- every edge has differently colored endpoints
- reported color count matches the produced assignment
- a claimed odd-cycle certificate is valid and odd

## 38. Adversarial Testing

Use:

- complete graphs
- odd cycles
- Mycielski-style high-chromatic sparse graphs
- graphs sensitive to vertex ordering
- highly symmetric graphs
- dense random graphs

## 39. Benchmarking

Measure:

- traversal time
- color count
- backtracking nodes explored
- propagation reductions
- DSATUR priority operations
- memory usage

## 40. Common Mistakes

- assuming every graph is 2-colorable
- confusing bipartite with directed reachability
- forgetting disconnected components
- using greedy coloring as an exact chromatic-number algorithm
- ignoring vertex ordering effects
- confusing vertex coloring with edge coloring
- failing to validate the final coloring

## 41. Interview Framework

For “is this graph bipartite?”:

1. model the graph as undirected
2. use BFS/DFS two-coloring
3. handle every component
4. detect same-color conflicts
5. derive `O(V + E)`
6. optionally reconstruct an odd-cycle certificate

For “color with `k` colors”:

1. distinguish heuristic from exact requirements
2. use backtracking/constraint propagation for small exact instances
3. use greedy/DSATUR when heuristic performance is acceptable
4. state the computational trade-off

## 42. Revision Checklist

- [ ] Define graph coloring.
- [ ] Define bipartite graphs.
- [ ] Prove the 2-coloring equivalence.
- [ ] Implement BFS/DFS bipartite testing.
- [ ] Reconstruct an odd-cycle certificate.
- [ ] Implement greedy coloring.
- [ ] Understand DSATUR.
- [ ] Implement exact backtracking for small graphs.
- [ ] Apply constraint propagation and forward checking.
- [ ] Understand clique lower bounds.
- [ ] Distinguish heuristic coloring from exact chromatic-number computation.
- [ ] Apply coloring to backend and AI scheduling/constraint systems.

## Key Takeaways

1. Proper coloring assigns different colors to adjacent vertices.
2. Bipartite graphs are exactly the graphs that can be 2-colored.
3. BFS/DFS detects bipartiteness in `O(V + E)`.
4. General exact coloring is fundamentally harder than bipartite testing.
5. Greedy and DSATUR provide practical coloring strategies but are not universally optimal.
6. Coloring is a natural constraint-satisfaction model for scheduling and resource separation.
