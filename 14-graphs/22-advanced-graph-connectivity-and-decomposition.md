# 14.22 — Advanced Graph Connectivity & Decomposition

## 1. Concept Definition

Graph decomposition breaks a graph into structurally meaningful components so later algorithms can operate on smaller pieces.

Important connectivity structures include:

- connected components
- strongly connected components
- bridges
- articulation points
- 2-edge-connected components
- biconnected components
- condensation DAGs

## 2. Why It Matters

Connectivity decomposition is useful for:

- fault analysis
- dependency analysis
- graph compression
- routing
- dynamic connectivity
- backend topology analysis
- AI graph preprocessing

## 3. Connected Components

In an undirected graph, connected components partition vertices into maximal sets where every pair is mutually reachable.

DFS, BFS, or DSU can compute them efficiently.

## 4. Strongly Connected Components

In a directed graph, a strongly connected component (SCC) is a maximal set of vertices where every vertex can reach every other vertex.

## 5. Kosaraju's Algorithm

Kosaraju uses:

1. DFS finishing order on the original graph
2. reverse all edges
3. process vertices in decreasing finishing time

Each DFS in the reversed graph identifies one SCC.

## 6. Tarjan's SCC Algorithm

Tarjan computes SCCs in one DFS using:

```text
tin[v]
low[v]
stack membership
```

A vertex is an SCC root when its low-link value identifies itself as the earliest active ancestor reachable from its subtree.

## 7. SCC Stack Invariant

The active stack contains vertices belonging to DFS regions whose SCC has not yet been finalized.

A vertex is popped when its DFS subtree proves that the SCC rooted there is complete.

## 8. Condensation Graph

Collapse every SCC into one super-vertex.

The resulting **condensation graph is always a DAG**.

This converts cyclic directed structure into an acyclic component-level representation.

## 9. Why Condensation Matters

Many problems become easier after SCC compression:

- dependency ordering
- reachability between cyclic modules
- DAG dynamic programming
- component-level scheduling

## 10. Bridges

In an undirected graph, a bridge is an edge whose removal increases the number of connected components.

Using DFS low-link values, tree edge `u-v` is a bridge when:

```text
low[v] > tin[u]
```

## 11. Articulation Points

An articulation point is a vertex whose removal increases the number of connected components.

For a non-root DFS vertex `u`, a child `v` proves `u` is an articulation point when:

```text
low[v] >= tin[u]
```

The DFS root uses a different child-count rule.

## 12. 2-Edge-Connected Components

Removing all bridges partitions an undirected graph into maximal components that are connected without relying on any single bridge edge.

These components form a bridge tree when the original graph is connected.

## 13. Bridge Tree

Contract each 2-edge-connected component into one vertex and retain bridges between components.

The result is a tree for a connected undirected graph.

This can turn difficult path/connectivity queries into tree queries.

## 14. Biconnected Components

Biconnected decomposition identifies vertex-connected blocks separated by articulation points.

An edge-stack implementation can emit blocks when DFS low-link conditions are satisfied.

## 15. Block-Cut Tree

Construct a bipartite graph containing:

- original articulation vertices
- biconnected components

Connect an articulation vertex to every block containing it.

For an undirected graph, this structure is a tree within each connected component.

## 16. Vertex Connectivity vs Edge Connectivity

**Edge connectivity** asks how many edges must be removed to disconnect a graph.

**Vertex connectivity** asks how many vertices must be removed.

Bridges and articulation points detect connectivity vulnerabilities of size one.

## 17. Menger's Theorem Boundary

Menger's theorem connects the maximum number of internally vertex-disjoint or edge-disjoint paths with minimum separators.

This provides a deeper theoretical basis for connectivity and cut analysis.

## 18. Global Minimum Cut Boundary

Local bridges are not the same as a global minimum cut.

Global cut algorithms solve a broader optimization problem.

For undirected weighted graphs, Stoer-Wagner is a classical exact global minimum-cut algorithm.

## 19. DSU for Offline Connectivity

When edge additions are known offline, DSU can process connectivity efficiently.

Union operations merge components; find operations identify component representatives.

## 20. Rollback DSU

Rollback DSU supports undoing unions by recording changes rather than using irreversible path compression.

This enables offline dynamic-connectivity techniques.

## 21. Offline Dynamic Connectivity

For edge insertion/deletion queries known in advance, segment-tree-over-time plus rollback DSU can process active edge intervals.

Each edge is added to the time intervals during which it exists.

## 22. Complexity of Offline Dynamic Connectivity

A typical approach uses:

- segment tree over query time
- rollback DSU

and achieves near `O((N + Q) log Q α(N))`-style complexity depending on the exact implementation and interval handling.

## 23. Dynamic Connectivity Boundary

Fully online connectivity with arbitrary insertions and deletions requires more advanced dynamic graph data structures.

Do not assume ordinary DSU can handle deletions.

## 24. Decomposition as Compression

A large graph can often be represented at multiple levels:

```text
vertices → components → component graph
```

This hierarchical representation reduces repeated work.

## 25. Backend Application: Service Topology

SCCs can reveal mutually dependent service groups.

Bridges can reveal topology links whose removal disconnects modeled infrastructure.

## 26. Backend Application: Dependency Analysis

SCC compression converts cyclic dependency groups into DAG nodes.

The resulting condensation DAG can then be topologically ordered.

## 27. Backend Application: Failure Analysis

Articulation points and bridges provide structural indicators of single-point connectivity failures in a modeled network.

They are graph-level indicators, not complete reliability probabilities.

## 28. AI Application: Knowledge Graph Compression

SCC or connectivity decomposition can compress strongly related graph regions before downstream analysis.

## 29. AI Application: Search-Space Reduction

Component decomposition can eliminate impossible cross-component searches and allow independent processing where no connecting edges exist.

## 30. AI Application: Dependency Graphs

SCCs can identify cyclic groups in data/model pipelines.

After compression, the component DAG supports scheduling and dynamic programming.

## 31. Correctness — SCC

For Tarjan, `low[v]` represents the earliest discovery index reachable from the active DFS region under the algorithm's edge rules.

When `low[u] === tin[u]`, `u` is the root of a completed SCC and all stack vertices above it belong to that SCC.

## 32. Correctness — Bridge

For tree edge `u-v`, if `low[v] > tin[u]`, no back edge from the subtree of `v` reaches `u` or an ancestor of `u`.

Removing `u-v` therefore disconnects that subtree.

## 33. Correctness — Articulation Point

For non-root `u`, if a child `v` satisfies `low[v] >= tin[u]`, that subtree has no back edge to a strict ancestor of `u`.

Removing `u` separates the subtree from the ancestor side.

## 34. Correctness — Condensation DAG

If the condensation graph contained a directed cycle among distinct SCCs, each SCC on that cycle would be mutually reachable with the others, contradicting maximal SCC separation.

## 35. Testing Strategy

Test:

- isolated vertices
- trees
- cycles
- directed cycles
- multiple SCCs
- nested DFS structures
- parallel edges
- self-loops
- disconnected components
- bridge-heavy graphs
- articulation-heavy graphs

## 36. Differential Testing

For small graphs compare SCC output against mutual-reachability brute force.

Compare bridge/articulation results against removal-and-recompute connectivity.

## 37. Property Testing

Validate:

- SCC labels partition vertices
- vertices in an SCC are mutually reachable
- distinct SCCs are not mutually reachable
- condensation graph is acyclic
- every reported bridge disconnects after removal
- every reported articulation point changes component count after removal

## 38. Adversarial Testing

Use:

- long DFS chains
- dense directed graphs
- many parallel edges
- self-loops
- large SCCs with few outgoing edges
- graphs with many bridges
- graphs with many articulation points

## 39. Benchmarking

Measure:

- DFS edge scans
- stack operations
- DSU operations
- rollback operations
- component counts
- memory usage
- graph compression ratio

## 40. Common Mistakes

- confusing SCCs with weakly connected components
- forgetting directed edge direction in SCC logic
- applying the non-root articulation rule to the DFS root
- mishandling parallel edges in bridge detection
- using path compression in rollback DSU
- assuming DSU supports deletions
- treating local bridges as a global minimum cut

## 41. Interview Framework

For advanced connectivity questions:

1. identify directed vs undirected structure
2. determine whether the task is connectivity, SCC, bridge, articulation, or dynamic connectivity
3. choose the appropriate decomposition
4. state DFS/DSU invariants
5. derive complexity
6. explain component compression
7. discuss dynamic/offline boundaries

## 42. Revision Checklist

- [ ] Compute connected components.
- [ ] Implement Kosaraju SCC.
- [ ] Implement Tarjan SCC.
- [ ] Build a condensation DAG.
- [ ] Detect bridges.
- [ ] Detect articulation points.
- [ ] Build 2-edge-connected components.
- [ ] Build a bridge tree.
- [ ] Understand biconnected components.
- [ ] Build a block-cut tree.
- [ ] Understand DSU and rollback DSU.
- [ ] Understand offline dynamic connectivity.
- [ ] Apply decomposition to backend and AI graph systems.

## Key Takeaways

1. Decomposition exposes the structural units hidden inside large graphs.
2. SCCs compress directed cycles into a DAG.
3. Bridges and articulation points identify single-edge and single-vertex connectivity vulnerabilities.
4. Bridge trees and block-cut trees turn graph structure into tree structure.
5. DSU handles incremental connectivity; rollback DSU extends it to important offline dynamic settings.
6. Component-level compression is valuable in backend architecture and AI graph processing.
