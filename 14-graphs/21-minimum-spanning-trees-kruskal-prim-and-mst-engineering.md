# 14.21 — Minimum Spanning Trees: Kruskal, Prim & MST Engineering

## 1. Concept Definition

For a connected, weighted, undirected graph, a **minimum spanning tree (MST)** is a spanning tree with minimum total edge weight.

A spanning tree connects every vertex with exactly `V - 1` edges and contains no cycle.

## 2. Why It Matters

MSTs model minimum-cost connectivity:

- network design
- cable/fiber planning
- infrastructure connection
- clustering
- road and utility planning
- graph-based preprocessing

## 3. Tree Properties

For `V` vertices, every spanning tree has:

```text
V - 1 edges
```

and is connected and acyclic.

## 4. Cut Property

For any cut, a minimum-weight edge crossing that cut is **safe** for some MST.

This is the foundation of greedy MST algorithms.

## 5. Cycle Property

For any cycle, a maximum-weight edge on that cycle can be excluded from at least one MST.

This gives the complementary intuition behind MST correctness.

## 6. Kruskal's Algorithm

Kruskal:

1. sort edges by nondecreasing weight
2. scan edges
3. add an edge when it connects two different components
4. stop after `V - 1` edges

## 7. Disjoint Set Union

Kruskal uses DSU/Union-Find to test whether two endpoints are already connected.

With path compression and union by rank/size, operations are nearly constant amortized:

```text
O(α(V))
```

## 8. Kruskal Complexity

Sorting dominates:

```text
O(E log E)
```

plus near-linear DSU work.

## 9. Prim's Algorithm

Prim grows one connected tree:

1. start from a vertex
2. choose the cheapest edge leaving the current tree
3. add its new endpoint
4. repeat

A binary heap implementation commonly runs in:

```text
O(E log V)
```

with adjacency lists.

## 10. Prim Invariant

At every stage, the selected vertices form a connected tree and the next chosen crossing edge is safe by the cut property.

## 11. Kruskal vs Prim

Kruskal is edge-centric and naturally works with an edge list.

Prim is frontier-centric and naturally works with adjacency lists.

Choice depends on graph representation, density, implementation constraints, and workload.

## 12. Disconnected Graphs

A disconnected graph has no spanning tree covering all vertices.

Kruskal naturally produces a **minimum spanning forest** when all useful edges are processed.

Prim must be restarted from every unvisited component to construct the corresponding forest.

## 13. Minimum Spanning Forest

An MSF contains an MST for each connected component and has:

```text
V - C
```

edges, where `C` is the number of connected components.

## 14. Equal Weights

An MST need not be unique when multiple edges have equal weights.

All valid MSTs can have the same total weight while containing different edges.

## 15. Deterministic Tie-Breaking

For reproducible output, define a total ordering such as:

```text
(weight, edgeId, u, v)
```

Tie-breaking changes which MST is returned, not necessarily its total cost.

## 16. Maximum Spanning Tree

Negating weights or reversing the comparison transforms maximum spanning tree into an MST-style problem, provided numeric handling is safe.

## 17. Bottleneck Spanning Tree

An MST also minimizes the maximum edge weight on the path between any two vertices among spanning trees, under the standard bottleneck property.

This is useful when the objective is to minimize the worst required link capacity/cost rather than total cost.

## 18. Second-Best MST Preview

To find the next-best spanning tree, a common technique adds a non-tree edge and removes the maximum-weight edge on the resulting cycle.

Efficient implementations often use binary lifting or other path-maximum structures.

## 19. MST Verification

A candidate spanning tree is valid when it:

- contains exactly `V - 1` edges
- connects all vertices
- contains no cycle

To verify minimality efficiently, stronger MST-specific criteria can be used, such as cycle/cut arguments or maximum-edge-on-path checks.

## 20. Kruskal Correctness

When Kruskal selects an edge joining two different components, that edge is a light edge crossing the cut between those components.

By the cut property, it is safe to include in some MST.

## 21. Prim Correctness

The current tree defines a cut between selected and unselected vertices.

The minimum-weight crossing edge is safe by the cut property.

Repeated safe choices produce an MST.

## 22. DSU Correctness

DSU maintains a partition of vertices into connected components induced by the selected edges.

An edge whose endpoints have different representatives cannot create a cycle.

## 23. Complexity Model

Kruskal:

```text
O(E log E) time
O(V + E) representation space
```

Prim with a binary heap and adjacency lists:

```text
O(E log V) time
O(V + E) space
```

Actual performance depends on heap implementation, graph density, and key-update strategy.

## 24. Dense Graph Prim

With an adjacency matrix and simple minimum-key scanning, Prim can run in `O(V²)`.

For dense graphs this can be competitive with heap-based representations.

## 25. Lazy Prim

A heap can contain multiple candidate edges for the same vertex.

Stale entries are ignored when popped.

This simplifies implementation at the cost of additional heap entries.

## 26. Eager Prim

Maintain one best-known crossing edge per unselected vertex and support decrease-key or indexed-heap updates.

This reduces stale entries but requires more data-structure engineering.

## 27. Backend Application: Network Design

Services, regions, or infrastructure nodes can be connected with minimum total modeled link cost.

The result gives a baseline connectivity topology, not a complete production network design.

## 28. Backend Application: Cluster Backbone

An MST can create a low-cost backbone connecting distributed nodes.

Real systems may need redundancy, latency, capacity, and fault-domain constraints beyond MST.

## 29. Backend Application: Infrastructure Planning

Data-center or branch connectivity can be modeled as weighted edges representing deployment cost.

MST gives the minimum-cost tree under the chosen graph assumptions.

## 30. AI Application: Hierarchical Clustering

MSTs can support single-linkage clustering.

Removing sufficiently expensive MST edges can separate clusters according to a threshold.

## 31. AI Application: Similarity Graphs

A weighted similarity/distance graph can use an MST as a sparse connectivity skeleton.

The meaning depends on whether lower weight represents stronger similarity or smaller distance.

## 32. AI Application: Graph Preprocessing

An MST can reduce a dense graph to a sparse connected backbone while preserving important connectivity structure.

It does not preserve all shortest paths or all pairwise relationships.

## 33. Negative Weights

MST algorithms do not require edge weights to be nonnegative.

Only relative ordering matters for the standard greedy algorithms.

## 34. Numeric Safety in JavaScript

If exact weights may exceed safe integer range, use `BigInt` or an exact numeric representation.

Do not mix `Number` and `BigInt` arithmetic without an explicit design.

## 35. Parallel Edges and Self-Loops

Parallel edges are valid and must be treated as distinct edges.

Self-loops can never belong to an MST because they create a cycle without connecting a new vertex.

## 36. Testing Strategy

Test:

- single vertex
- tree graphs
- cycles
- complete graphs
- equal weights
- negative weights
- parallel edges
- self-loops
- disconnected graphs
- sparse and dense graphs

## 37. Differential Testing

For small graphs, compare Kruskal/Prim against exhaustive enumeration of spanning trees.

Validate equal total MST cost even when returned edge sets differ.

## 38. Property Testing

Validate:

- tree edge count
- connectivity
- acyclicity
- total weight
- minimality against small reference instances

## 39. Adversarial Testing

Use:

- many equal-weight edges
- long chains
- dense graphs
- negative weights
- parallel edges
- graphs with many candidate ties

## 40. Benchmarking

Measure:

- edge sorting time
- DSU operations
- heap operations
- stale heap entries
- graph representation overhead
- memory usage
- dense vs sparse performance

## 41. Common Mistakes

- applying MST to directed graphs without a different formulation
- forgetting disconnected components
- treating equal-weight MSTs as unique
- allowing self-loops into the tree
- implementing DSU without path compression/union heuristics
- comparing MST total cost with shortest-path cost
- assuming an MST preserves shortest paths

## 42. Interview Framework

For “find an MST”:

1. confirm the graph is weighted and undirected
2. determine whether connectivity is guaranteed
3. choose Kruskal or Prim
4. state the cut property
5. explain the DSU or heap structure
6. derive complexity
7. discuss equal weights and deterministic ties
8. mention MST vs shortest-path distinctions

## 43. Revision Checklist

- [ ] Define a spanning tree.
- [ ] Define an MST.
- [ ] Explain the cut property.
- [ ] Explain the cycle property.
- [ ] Implement DSU.
- [ ] Implement Kruskal.
- [ ] Implement Prim.
- [ ] Understand lazy vs eager Prim.
- [ ] Handle disconnected graphs as a forest.
- [ ] Handle equal weights.
- [ ] Understand second-best MST techniques.
- [ ] Distinguish MST from shortest paths.
- [ ] Apply MST concepts to backend and AI systems.

## Key Takeaways

1. MST minimizes total edge weight while connecting all vertices of a connected undirected graph.
2. Kruskal grows components by globally sorted edges.
3. Prim grows one tree through the cheapest frontier edge.
4. The cut property provides the central correctness argument.
5. DSU makes Kruskal efficient.
6. Heap engineering and graph representation strongly affect Prim's practical performance.
