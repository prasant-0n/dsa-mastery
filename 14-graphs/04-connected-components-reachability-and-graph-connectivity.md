# 14.04 — Connected Components, Reachability & Graph Connectivity

## 1. Concept Definition

Reachability asks whether one vertex can be reached from another by following valid edges. Connected components partition an undirected graph into maximal groups of mutually reachable vertices.

For directed graphs, connectivity has several distinct meanings, including reachability, weak connectivity, and strong connectivity.

## 2. Why It Matters

Connectivity is a foundation for:

- network analysis
- service dependency analysis
- clustering
- dependency resolution
- social/network structure
- image/grid regions
- graph partitioning
- distributed-system topology

## 3. Reachability

For vertices `u` and `v`, `v` is reachable from `u` if there exists a path from `u` to `v` following the graph's edge direction rules.

BFS and DFS provide direct reachability tests.

## 4. Connected Component

In an undirected graph, a connected component is a maximal set of vertices where every pair is connected by a path.

Components form a partition of the vertex set:

```text
no vertex belongs to two components
all vertices belong to exactly one component
```

## 5. Component Algorithm

For an undirected graph:

```text
visited = empty
components = []

for every vertex u:
    if u is unvisited:
        run BFS/DFS from u
        collect all reached vertices
        add that set as one component
```

Each vertex is discovered once, giving `O(V + E)` with adjacency lists.

## 6. Component Labels

Instead of storing explicit arrays of vertex lists, assign a component ID:

```text
component[u] = id
```

Then connectivity can be answered by checking whether two vertices have the same component ID.

## 7. Component Sizes

Store:

```text
size[id] = number of vertices in component id
```

This supports constant-time size queries after preprocessing.

## 8. Reachability vs Connectivity

Reachability is source-specific.

Connected components describe the complete partition of an undirected graph.

A graph may have many components even though each individual component is internally connected.

## 9. Directed Reachability

In directed graphs, `u → v` does not imply `v → u`.

A BFS/DFS from `u` answers directed reachability from that source.

Computing all-pairs reachability is a different and potentially much more expensive problem.

## 10. Weak Connectivity

A directed graph is weakly connected if replacing every directed edge with an undirected edge produces one connected component.

This ignores edge direction for connectivity structure.

## 11. Strong Connectivity Preview

A strongly connected component (SCC) is a maximal set of vertices where every vertex can reach every other vertex following directed edges.

Algorithms such as Kosaraju and Tarjan solve SCC decomposition efficiently. They will be studied in depth later.

## 12. Transitive Closure

The transitive closure represents reachability between every ordered pair.

For small/dense graphs, matrix-based methods can be useful. For large sparse graphs, storing all reachable pairs may be prohibitively expensive.

## 13. Grid Components

A grid can be modeled as a graph:

```text
cell = vertex
allowed neighbor relation = edge
```

Connected-region problems then become ordinary component discovery.

Examples include islands, image regions, and contiguous availability zones.

## 14. 4-Neighbor vs 8-Neighbor Connectivity

Grid connectivity depends on the specified neighborhood.

4-neighbor:

```text
up/down/left/right
```

8-neighbor additionally includes diagonals.

Changing the adjacency rule can change the number and shape of components.

## 15. Component Discovery Invariant

When a traversal started from an unvisited vertex finishes:

> Every vertex reachable from that starting vertex has been assigned to the same component, and no vertex outside that reachable set has been assigned to it.

## 16. Component Count

The number of times the outer loop starts a new traversal equals the number of connected components in an undirected graph.

This follows because each traversal consumes exactly one previously undiscovered component.

## 17. Isolated Vertices

A vertex with degree zero forms a component containing only itself.

Do not accidentally ignore vertices with empty adjacency lists.

## 18. Empty Graph

An empty graph has zero vertices and therefore zero connected components under the standard definition.

Define this explicitly in APIs.

## 19. Self-Loops

A self-loop does not connect an isolated vertex to another vertex.

It may still matter for cycle semantics, but component membership remains unchanged.

## 20. Parallel Edges

Multiple edges between the same two vertices do not create additional connected components.

Traversal should still handle them without repeated discovery.

## 21. Dynamic Connectivity

If edges are added over time and queries ask whether two vertices are connected, repeatedly running BFS can become expensive.

Disjoint Set Union (DSU/Union-Find) is designed for incremental connectivity and will be studied later.

## 22. Component Compression

After discovering components, a graph can sometimes be compressed into a component-level graph:

```text
many original vertices
        ↓
component IDs
        ↓
smaller quotient graph
```

This is useful in later graph algorithms and systems analysis.

## 23. Backend Application: Dependency Groups

A service graph can reveal isolated dependency groups.

If the graph is undirected for a particular analysis, components identify groups with no cross-group relationship.

The semantic choice—directed vs undirected—must match the question being answered.

## 24. Backend Application: Network Reachability

Connectivity analysis can identify isolated infrastructure segments or reachable service clusters.

Production systems should impose authorization and traversal limits when graph data is user-controlled.

## 25. Backend Application: Permission Graphs

A permission relationship can be represented as a graph, but direction matters.

Reachability can model inherited access, while component analysis may only answer structural grouping questions.

Never confuse graph reachability with authorization policy by itself.

## 26. AI Application: Knowledge Graph Neighborhoods

A knowledge graph can be traversed to identify entities in the same connected region or to expand a query neighborhood.

The traversal policy should include depth, node, and token/resource limits.

## 27. AI Application: State-Space Regions

In state spaces, connectivity can identify which configurations are mutually reachable under allowed transitions.

This can support planning diagnostics and search-space analysis.

## 28. Complexity

For adjacency-list component discovery:

```text
Time:  O(V + E)
Space: O(V)
```

The space includes visited/component state and traversal frontier.

If an adjacency matrix is scanned, traversal can require `O(V²)` work.

## 29. Output-Sensitive Component Listing

If the API returns every vertex in every component, output itself costs `O(V)`.

If it returns only a component count, less output is produced, but the graph still generally must be traversed to establish the count.

## 30. Determinism

Component IDs depend on the order in which vertices are considered.

If IDs are externally visible, define deterministic vertex ordering or treat IDs as opaque labels.

The partition itself does not depend on traversal order.

## 31. Common Mistakes

- running one traversal and calling it all components
- ignoring isolated vertices
- confusing directed reachability with undirected connectivity
- treating weak and strong connectivity as identical
- forgetting visited state
- assuming component IDs have intrinsic meaning
- using repeated BFS for a dynamic connectivity workload without considering DSU

## 32. Testing Strategy

Test:

- empty graph
- one vertex
- isolated vertices
- one connected graph
- multiple components
- trees
- cycles
- self-loops
- parallel edges
- directed graphs
- grid components

## 33. Differential Testing

For small graphs, compare component labels against a simple pairwise reachability reference.

For undirected graphs, two vertices belong to the same component exactly when each is reachable from the other.

## 34. Property Testing

Useful properties:

- every vertex receives exactly one component ID
- vertices in one component are mutually reachable
- no vertices from different components are connected by a path
- component sizes sum to `V`
- isolated vertices form singleton components

## 35. Adversarial Testing

Use:

- long chains
- stars with very high degree
- dense graphs
- many isolated vertices
- repeated parallel edges
- deep graphs that stress recursive DFS
- large component imbalance

## 36. Interview Framework

For “find connected components”:

1. clarify graph direction
2. choose adjacency representation
3. initialize visited
4. iterate over every vertex
5. launch BFS/DFS for each unvisited vertex
6. assign a component ID
7. derive `O(V + E)`
8. discuss isolated vertices and recursion depth

## 37. Mental Model

Think of the outer loop as asking:

> “Have I already explored this region?”

If not, start one traversal and consume the entire region.

## 38. Revision Checklist

- [ ] Define reachability.
- [ ] Define connected components.
- [ ] Implement component discovery with BFS.
- [ ] Implement component discovery with DFS.
- [ ] Assign component IDs.
- [ ] Compute component sizes.
- [ ] Handle isolated vertices.
- [ ] Handle self-loops and parallel edges.
- [ ] Distinguish directed reachability.
- [ ] Explain weak vs strong connectivity.
- [ ] Model grid regions as graphs.
- [ ] Explain dynamic connectivity and DSU.
- [ ] Test randomized graphs.
- [ ] Apply connectivity reasoning to backend and AI systems.

## Key Takeaways

1. Reachability is source-specific; connected components partition an undirected graph.
2. Complete component discovery requires an outer loop over all vertices.
3. Adjacency-list component discovery is `O(V + E)`.
4. Isolated vertices are valid singleton components.
5. Directed graphs require careful distinctions between reachability, weak connectivity, and strong connectivity.
6. Dynamic connectivity motivates DSU rather than repeatedly traversing the graph.
