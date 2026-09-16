# 14.23 — Graph Mastery: Advanced Problem Patterns & Interview Preparation

## 1. The Graph Problem-Solving Pipeline

For an unfamiliar graph problem:

1. identify the entities
2. identify relationships
3. decide directed vs undirected
4. decide weighted vs unweighted
5. identify static vs dynamic updates
6. define the required output
7. estimate `V`, `E`, weights, and query count
8. select the representation
9. select the algorithm
10. prove correctness
11. derive complexity
12. test adversarial cases

## 2. Representation Selection

Common representations:

- adjacency list
- adjacency matrix
- edge list
- reverse adjacency
- implicit graph
- compressed component graph

Choose based on density, traversal direction, update pattern, and memory constraints.

## 3. Traversal Pattern Recognition

Use BFS when the graph is unweighted and shortest edge count matters.

Use DFS for structural exploration, cycle detection, components, low-link algorithms, and recursive decomposition.

## 4. Shortest-Path Recognition

Ask whether edge weights are:

- all equal
- nonnegative
- possibly negative
- restricted to small integers
- dynamically changing

This determines whether BFS, 0-1 BFS, Dijkstra, Bellman-Ford, DAG DP, or another method is appropriate.

## 5. BFS Patterns

Core patterns include:

- shortest path in unweighted graphs
- multi-source BFS
- level processing
- bipartite testing
- state-space search
- implicit-grid traversal

## 6. DFS Patterns

Core patterns include:

- component discovery
- cycle detection
- topological ordering
- SCCs
- bridges
- articulation points
- backtracking state exploration

## 7. Topological Sorting

If dependencies form a DAG, use:

- Kahn's algorithm
- DFS finishing order

A cycle means a complete dependency ordering does not exist.

## 8. Dijkstra Pattern

Use Dijkstra when edge weights are nonnegative.

A min-priority queue tracks the next vertex with the smallest tentative distance.

## 9. 0-1 BFS

When every edge weight is `0` or `1`, a deque can replace a general heap and achieve linear complexity in the graph size.

## 10. Bellman-Ford Pattern

Use Bellman-Ford when negative edges are allowed and the graph size permits repeated relaxation.

It can also detect reachable negative cycles.

## 11. DAG Shortest Paths

A weighted DAG allows shortest paths to be computed by processing vertices in topological order.

Negative edge weights are allowed because cycles do not exist.

## 12. Minimum Spanning Tree Recognition

If the problem asks for minimum-cost connectivity of an undirected weighted graph, think MST rather than shortest paths.

Use Kruskal or Prim depending on representation and workload.

## 13. Connectivity Recognition

Distinguish:

- connected components
- reachability
- strong connectivity
- bridges
- articulation points
- global cuts
- dynamic connectivity

These are different questions.

## 14. SCC Pattern

For directed mutual reachability, consider Kosaraju or Tarjan.

Compress SCCs into a condensation DAG when later processing is easier at the component level.

## 15. Flow Pattern

If the problem contains capacity constraints and source-to-sink throughput, consider max flow.

If costs also matter, consider min-cost flow.

## 16. Matching Pattern

If entities belong to two partitions and each side has one-to-one assignment constraints, consider bipartite matching.

Weighted one-to-one assignment leads to assignment algorithms or min-cost flow.

## 17. Eulerian Pattern

If every **edge** must be used exactly once, think Eulerian traversal and Hierholzer.

Do not confuse this with Hamiltonian vertex traversal.

## 18. Coloring Pattern

If adjacent entities must receive different labels/resources, model graph coloring.

For two colors, use BFS/DFS bipartite testing.

For general `k`, distinguish heuristic coloring from exact constraint search.

## 19. DSU Pattern

Use DSU for repeated connectivity under edge additions or for Kruskal.

For arbitrary deletions, ordinary DSU is insufficient.

## 20. Offline Dynamic Connectivity

If insertions/deletions and queries are known ahead of time, consider time-interval decomposition plus rollback DSU.

## 21. Tree as a Graph

Trees support specialized algorithms:

- DFS/BFS traversal
- diameter
- LCA
- binary lifting
- Euler tours
- heavy-light decomposition
- tree DP

Recognize when the graph has `E = V - 1` and connectivity guarantees.

## 22. DAG as a Graph

A DAG supports:

- topological ordering
- dependency scheduling
- dynamic programming
- longest/shortest path under appropriate weight assumptions
- transitive-reachability processing

## 23. Search-State Graphs

AI problems often have implicit graphs where states are vertices and legal transitions are edges.

The graph need not be materialized explicitly.

## 24. A* Recognition

For state-space shortest-path problems with an admissible heuristic, A* combines actual cost `g(n)` with estimated remaining cost `h(n)`:

```text
f(n) = g(n) + h(n)
```

A consistent heuristic provides useful monotonicity properties.

## 25. Duplicate-State Detection

Search algorithms may encounter the same state through multiple paths.

Canonical state representation plus a visited or best-cost map prevents redundant expansion.

## 26. Graph + Hashing

Use hash maps/sets when the main challenge is state identity, membership, deduplication, or memoization.

## 27. Graph + Heap

Use a heap when the next graph state is selected by a dynamic priority:

- Dijkstra
- A*
- best-first search
- top-K graph exploration
- scheduling frontiers

## 28. Graph + DP

DAGs transform recursive dependency relationships into an acyclic computation order.

Tree DP is a special graph-DP family.

## 29. Graph + Binary Search

Many optimization problems can be reframed as:

```text
Does a feasible graph solution exist under threshold X?
```

If feasibility is monotone, binary search can find the minimum/maximum threshold.

## 30. Graph + Flow

When a constraint is fundamentally about capacity, conservation, or assignment, flow may encode the problem more directly than custom graph search.

## 31. Graph + Greedy

MST algorithms are canonical examples where a structural theorem makes a local choice safe.

Always identify the proof property before trusting a graph greedy algorithm.

## 32. Graph + Backtracking

Small graph coloring, Hamiltonian search, constraint assignment, and exhaustive state-space problems may require backtracking.

Use pruning and symmetry breaking to reduce the search space.

## 33. Complexity Ledger

For every solution record:

```text
V = vertices
E = edges
Q = queries
K = domain/constraint parameter
S = state-space size
```

Then derive complexity using the parameters that actually control runtime.

## 34. Output-Sensitive Analysis

If an algorithm must return many paths, matches, components, or edges, include output size in the complexity.

An algorithm cannot report `K` results in less than `Ω(K)` output work.

## 35. Dense vs Sparse

Sparse graphs often favor adjacency lists.

Dense graphs can make matrices or array-based scans competitive.

Do not choose representations by habit.

## 36. Weighted Edge Comparison

Priority algorithms may spend substantial time comparing or computing weights.

If weight computation is expensive, include its cost in the performance model.

## 37. Correctness Framework

For every algorithm identify:

- state invariant
- transition rule
- termination condition
- output invariant
- proof that termination implies the required result

## 38. Testing Framework

Every graph algorithm should be tested with:

- empty/small graphs
- disconnected graphs
- cycles
- duplicate/parallel edges
- self-loops where valid
- sparse graphs
- dense graphs
- adversarial ordering
- large inputs

## 39. Differential Testing

Build a simple reference implementation for small instances.

Compare optimized output against the reference using normalized representations when multiple valid answers exist.

## 40. Property-Based Testing

Test structural truths instead of only fixed examples:

- shortest-path distances satisfy edge constraints
- MST has correct connectivity and edge count
- matching endpoints are unique
- coloring constraints hold
- flow conservation holds
- topological edges point forward

## 41. Interview Communication

A strong explanation follows:

```text
Model → Observation → Algorithm → Invariant → Correctness → Complexity → Edge Cases
```

Avoid starting with code before explaining why the algorithm fits the problem.

## 42. Constraint-Driven Selection

A useful decision table:

| Problem shape | Candidate technique |
|---|---|
| unweighted shortest path | BFS |
| weights 0/1 | 0-1 BFS |
| nonnegative weights | Dijkstra |
| negative edges | Bellman-Ford |
| weighted DAG | topological DP |
| minimum undirected connectivity | MST |
| source-sink capacity | max flow |
| bipartite one-to-one assignment | matching |
| every edge exactly once | Eulerian traversal |
| mutual directed reachability | SCC |
| two-color conflict | bipartite test |
| incremental connectivity | DSU |

## 43. Backend Engineering Translation

When a graph problem appears in backend engineering, explicitly define:

- entity identity
- edge semantics
- consistency requirements
- update frequency
- query latency target
- memory budget
- concurrency model
- failure behavior

The mathematical graph is only one layer of the production system.

## 44. AI Engineering Translation

For AI/search systems define:

- state representation
- transition generator
- scoring function
- heuristic
- duplicate policy
- memory bound
- termination/budget policy
- approximation tolerance

## 45. Production Graph Design

Production systems may require:

- incremental updates
- snapshots
- persistence
- serialization
- observability
- deterministic results
- concurrency control
- resource limits
- graceful failure

## 46. Common Interview Traps

- using BFS on weighted graphs without justification
- using Dijkstra with negative edges
- confusing MST with shortest paths
- assuming a DAG because cycles were not noticed
- treating DSU as a deletion-capable structure
- using greedy coloring as an exact algorithm
- forgetting reverse residual edges in flow
- ignoring duplicate search states

## 47. Final Problem-Solving Checklist

- [ ] Can I model the problem as a graph?
- [ ] What exactly are vertices and edges?
- [ ] Directed or undirected?
- [ ] Weighted or unweighted?
- [ ] Static or dynamic?
- [ ] Sparse or dense?
- [ ] What are `V`, `E`, `Q`, and other parameters?
- [ ] Is this traversal, shortest path, connectivity, MST, flow, matching, coloring, or decomposition?
- [ ] What invariant proves correctness?
- [ ] What are the edge cases?
- [ ] What is the actual time and auxiliary-space complexity?
- [ ] What production constraints change the design?

## Key Takeaways

1. Graph mastery is primarily pattern recognition plus proof-driven algorithm selection.
2. Start from the mathematical structure, not from a memorized implementation.
3. Combine graphs with DSU, heaps, hashing, DP, binary search, flow, and backtracking when the problem demands it.
4. Complexity must be expressed using the parameters that actually control the workload.
5. Backend and AI graph systems require production concerns beyond the core algorithm.
6. In interviews, communicate the model, observation, invariant, correctness, complexity, and edge cases before code.
