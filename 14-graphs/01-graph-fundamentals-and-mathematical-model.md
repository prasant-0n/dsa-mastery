# 14.01 — Graph Fundamentals & Mathematical Model

## 1. Concept Definition

A graph is a mathematical structure consisting of vertices (nodes) and edges (relationships). Graphs model connectivity, dependencies, routes, interactions, and state transitions.

A graph is commonly written as `G = (V, E)` where `V` is the vertex set and `E` is the edge set.

## 2. Why Graphs Matter

Graphs appear whenever relationships matter:

- network routing
- social relationships
- package dependencies
- service communication
- workflows
- recommendation systems
- knowledge graphs
- state-space search
- road and navigation systems
- scheduling dependencies

## 3. Vertices and Edges

A vertex represents an entity or state.

An edge represents a relationship or transition between vertices.

For an undirected edge `{u, v}`, the relationship is symmetric.

For a directed edge `(u, v)`, the relationship has a direction from `u` to `v`.

## 4. Directed vs Undirected

### Undirected

```text
A ----- B
```

If A is connected to B, B is connected to A.

### Directed

```text
A ----> B
```

A can reach B through that edge, but B does not necessarily reach A.

## 5. Weighted Graphs

An edge can carry a weight:

```text
A --5--> B
```

The weight may represent:

- distance
- latency
- cost
- capacity
- risk
- time
- similarity

## 6. Unweighted Graphs

Every edge has equal traversal cost.

This makes the number of edges in a path sufficient for shortest-path reasoning and leads naturally to BFS for shortest paths in unweighted graphs.

## 7. Degree

For an undirected graph, the degree of a vertex is the number of incident edges.

For directed graphs:

- indegree = incoming edges
- outdegree = outgoing edges

Degree distributions can reveal graph structure and workload characteristics.

## 8. Paths

A path is a sequence of vertices connected by edges.

```text
A → B → C → D
```

Path length may mean number of edges or total edge weight, depending on the problem.

Always define which one is being optimized.

## 9. Walk, Trail, Path, Cycle

A walk may repeat vertices and edges.

A trail does not repeat edges.

A simple path does not repeat vertices.

A cycle returns to its starting vertex through a non-empty route.

Precise terminology prevents incorrect algorithms.

## 10. Connectivity

An undirected graph is connected when every vertex can reach every other vertex.

A directed graph can be:

- weakly connected
- strongly connected

Strong connectivity requires mutual directed reachability.

## 11. Components

A connected component is a maximal set of mutually connected vertices in an undirected graph.

Components are often found using DFS, BFS, or DSU.

## 12. Trees as Graphs

A tree is a connected undirected graph with no cycles.

For `N` vertices, a tree has exactly `N - 1` edges.

This connects Phase 14 to the tree structures studied earlier.

## 13. Forests

A forest is a collection of disjoint trees.

A forest with `N` vertices and `C` components has:

```text
E = N - C
```

edges when each component is a tree.

## 14. DAGs

A Directed Acyclic Graph has directed edges and contains no directed cycle.

DAGs naturally model:

- dependency graphs
- build systems
- workflows
- task scheduling
- data pipelines
- computational graphs

## 15. Cycles

Cycles change the behavior of many algorithms.

For example, naive recursive traversal can loop forever without visited-state tracking.

Cycle detection is therefore a foundational graph technique.

## 16. Dense vs Sparse Graphs

A sparse graph has relatively few edges compared with the maximum possible number.

A dense graph has many edges.

For a simple directed graph with `V` vertices, the maximum number of edges is approximately `V²`.

Representation should follow density and query requirements.

## 17. Graph Representations

The primary representations are:

1. edge list
2. adjacency list
3. adjacency matrix
4. compressed/specialized representations

Each provides different time, memory, and cache behavior.

## 18. Edge List

```js
[
  [0, 1],
  [1, 2],
  [2, 3],
]
```

Simple and compact for storing edges, but inefficient for finding all neighbors of a vertex without additional indexing.

## 19. Adjacency List

```text
0 → [1, 2]
1 → [0, 3]
2 → [0]
3 → [1]
```

Usually the default representation for sparse graph traversal.

## 20. Adjacency Matrix

```text
    A B C
A   0 1 0
B   1 0 1
C   0 1 0
```

Provides constant-time edge existence checks under the usual matrix model but requires `O(V²)` space.

## 21. Representation Selection

Ask:

- How many vertices?
- How many edges?
- Is the graph sparse?
- Do we frequently enumerate neighbors?
- Do we frequently test direct edge existence?
- Are weights required?
- Is memory constrained?

Do not choose a representation by habit.

## 22. Multigraphs

A multigraph permits multiple edges between the same pair of vertices.

An adjacency list must then preserve multiple edge records rather than silently treating them as one connection.

## 23. Self-Loops

A self-loop connects a vertex to itself:

```text
A ↺
```

Algorithms must define whether self-loops are valid and how they affect degree and cycle semantics.

## 24. Parallel Edges

Two distinct edges can connect the same vertices.

Weighted graphs may contain parallel edges with different weights.

Shortest-path algorithms must consider each applicable edge unless the representation has already safely reduced them.

## 25. Graph Invariants

Useful invariants include:

- every referenced vertex exists
- every edge has valid endpoints
- undirected edges have symmetric adjacency entries
- directed edges appear only in their declared direction
- edge weights satisfy the problem's domain rules
- duplicate-edge policy is explicit

## 26. Mathematical Counting

For an undirected graph:

```text
sum(degrees) = 2E
```

For a directed graph:

```text
sum(indegrees) = E
sum(outdegrees) = E
```

These identities are valuable correctness checks.

## 27. Graph Traversal Mental Model

Traversal is state-space exploration.

At each vertex:

```text
current state
    ↓
inspect outgoing transitions
    ↓
choose unexplored states
    ↓
record state
    ↓
continue
```

DFS and BFS differ primarily in the frontier discipline.

## 28. Visited State

A visited set prevents repeated processing and infinite exploration in cyclic graphs.

But visited semantics depend on the problem. Some weighted/state-space algorithms need a distance or best-known-cost structure instead of a simple permanent visited flag.

## 29. Graph Search vs Graph Traversal

Traversal may mean visiting every reachable vertex.

Search may terminate once a goal is found and may require additional state such as distance, predecessor, or cost.

Do not treat all graph exploration problems as identical.

## 30. Backend Applications

Graphs model:

- service dependency graphs
- authorization relationships
- workflow dependencies
- network topology
- recommendation connections
- database relationships
- job dependencies

## 31. AI Applications

Graphs are fundamental to:

- state-space search
- planning
- knowledge graphs
- tool/dependency graphs
- agent workflows
- computational graphs
- navigation
- reasoning over relationships

## 32. Complexity Model

Let:

- `V` = number of vertices
- `E` = number of edges

For adjacency-list traversal that processes every vertex and edge, the typical bound is:

```text
O(V + E)
```

Space is commonly `O(V + E)` for the graph plus algorithm-specific auxiliary state.

## 33. Correctness Thinking

Before implementing a graph algorithm, identify:

1. state representation
2. transition representation
3. visited/reached invariant
4. termination condition
5. output invariant
6. complexity parameters

## 34. Common Mistakes

- forgetting cycles
- confusing directed and undirected edges
- using BFS/DFS without visited tracking
- counting vertices when the problem asks for weighted distance
- assuming every graph is connected
- silently dropping parallel edges
- allocating an adjacency matrix for a huge sparse graph

## 35. Interview Framework

When given a graph problem:

```text
1. Identify vertices
2. Identify edges/transitions
3. Determine direction
4. Determine weights
5. Determine graph density
6. Choose representation
7. Identify traversal/search state
8. Define invariant
9. Derive algorithm
10. Analyze O(V + E) or the appropriate bound
11. Test disconnected/cyclic/empty cases
```

## 36. Revision Checklist

- [ ] Define `G = (V, E)`.
- [ ] Distinguish directed and undirected graphs.
- [ ] Distinguish weighted and unweighted graphs.
- [ ] Explain degree, path, cycle, and connectivity.
- [ ] Explain trees, forests, and DAGs as graph classes.
- [ ] Implement edge-list representation.
- [ ] Implement adjacency lists.
- [ ] Implement adjacency matrices.
- [ ] Explain sparse vs dense representation.
- [ ] Handle self-loops and parallel edges.
- [ ] State graph invariants.
- [ ] Derive `O(V + E)` traversal complexity.
- [ ] Explain backend graph applications.
- [ ] Explain AI graph applications.

## Key Takeaways

1. A graph models entities plus relationships or transitions.
2. Direction, weights, cycles, and multiplicity fundamentally change the problem.
3. Adjacency lists are usually natural for sparse traversal workloads.
4. Adjacency matrices trade `O(V²)` memory for direct edge-access simplicity.
5. Graph algorithms should be derived from the graph's semantics and query requirements.
