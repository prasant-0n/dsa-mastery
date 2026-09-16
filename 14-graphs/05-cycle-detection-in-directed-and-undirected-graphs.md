# 14.05 — Cycle Detection in Directed & Undirected Graphs

## 1. Concept Definition

A cycle is a closed path that returns to a previously reached vertex under the graph's edge semantics. Cycle detection asks whether such a structure exists.

The correct technique depends on whether the graph is directed or undirected.

## 2. Why Cycle Detection Matters

Cycles appear in:

- dependency graphs
- workflow systems
- package managers
- scheduling constraints
- network topology
- state spaces
- database relationships
- build systems

A cycle can indicate a valid recurring structure or an invalid dependency, depending on the domain.

## 3. Undirected Cycle Mental Model

During DFS/BFS, reaching an already visited neighbor is not automatically a cycle because the neighbor may simply be the vertex from which the current vertex was discovered.

The key question is:

> Is the visited neighbor different from the current vertex's parent?

## 4. Undirected DFS Detection

For each vertex `u`, explore neighbor `v`.

If `v` is unvisited, recurse with `u` as its parent.

If `v` is already visited and `v !== parent`, a cycle exists.

## 5. Undirected BFS Detection

The same parent relationship can be maintained using a queue.

When processing `(u, parent)`, an already visited neighbor other than `parent` indicates a cycle.

## 6. Why the Parent Check Exists

Every undirected edge `{u,v}` is represented in both adjacency directions.

When exploring `u → v`, the reverse `v → u` is expected and must not be mistaken for a cycle.

The parent check removes this expected reverse edge.

## 7. Undirected DFS Invariant

For a DFS tree:

> Every discovered non-tree edge connecting two vertices in the same explored component creates a cycle in an undirected graph.

This follows because the DFS tree already provides a path between the endpoints.

## 8. Directed Graphs Need Different State

In a directed graph, there is no symmetric parent edge to ignore.

A common DFS solution tracks whether a vertex is currently active in the recursion path.

Use three states:

```text
WHITE = undiscovered
GRAY  = active
BLACK = finished
```

## 9. Directed DFS Detection

For edge `u → v`:

- `WHITE`: explore `v`
- `GRAY`: a back edge exists, therefore a directed cycle exists
- `BLACK`: `v` was already completed; this alone does not imply a cycle

## 10. Active-Path Mental Model

The `GRAY` set represents the current DFS path.

If an edge points back into that active path, the path can be followed from the target back to the source, creating a directed cycle.

## 11. Directed Cycle Invariant

During DFS:

> A directed cycle exists exactly when an explored edge points to a vertex that is active in the current DFS recursion path.

This is the core correctness idea behind DFS cycle detection.

## 12. Iterative Directed DFS

Recursive DFS can be replaced with an explicit stack containing frames such as:

```text
{ vertex, nextNeighborIndex }
```

A vertex becomes active when its frame is entered and finished when all neighbors have been processed.

This preserves the recursive state machine without relying on the JavaScript call stack.

## 13. Why Simple Visited State Fails for Directed Graphs

Consider:

```text
A → B
A → C
B → C
```

`C` may already be visited when processing `B`, but that does not form a cycle.

A completed vertex is not the same as an ancestor currently on the DFS path.

## 14. Topological Sorting Connection

A directed acyclic graph (DAG) contains no directed cycles.

Therefore cycle detection is a critical validation step for topological ordering.

Later, Kahn's algorithm and DFS-based topological sorting will use this relationship explicitly.

## 15. Kahn's Algorithm as Cycle Detection

Kahn's topological process repeatedly removes zero-indegree vertices.

If fewer than `V` vertices can be removed, the remaining subgraph contains a directed cycle.

Thus:

```text
processedCount < V → cycle exists
processedCount = V  → DAG
```

## 16. Self-Loops

A self-loop is a cycle under standard graph-theoretic definitions.

For directed graphs, `u → u` immediately forms a cycle.

For undirected graphs, a self-loop also indicates cyclic structure.

Implementations must not accidentally exclude this case unless the domain explicitly defines otherwise.

## 17. Parallel Edges

Parallel edges require explicit semantics.

In an undirected graph, two distinct parallel edges between the same vertices form a cycle of length two in multigraph theory.

In a simple-graph implementation that collapses duplicate edges, that information may be lost.

## 18. Disconnected Graphs

Cycle detection must inspect every component.

Use an outer loop:

```text
for each vertex u:
    if unvisited:
        start cycle search at u
```

Stopping after one acyclic component can produce an incorrect global result.

## 19. Directed Disconnected Graphs

The same outer-loop principle applies to directed graphs.

A cycle can exist in a component unrelated to the chosen starting vertex.

## 20. Cycle Reconstruction

Detecting a cycle is often not enough.

Store parent relationships and, when a back edge is found, walk backward through parents to reconstruct the cycle vertices.

The exact reconstruction logic depends on graph direction and traversal state.

## 21. Undirected Cycle Reconstruction

When an edge `u — v` connects two already related DFS-tree vertices, use their parent chains to find a common ancestor and construct the closed walk.

For simple cycle-reporting tasks, parent tracking can be combined with depth information.

## 22. Directed Cycle Reconstruction

When `u → v` targets a `GRAY` vertex `v`, `v` is an ancestor of `u` in the active DFS path.

Follow parents from `u` until reaching `v`, then add the closing edge `u → v`.

## 23. Complexity

With adjacency lists:

```text
DFS/BFS cycle detection: O(V + E)
Auxiliary state:          O(V)
```

Each vertex and adjacency entry is processed a bounded number of times.

## 24. Adjacency Matrix Cost

With an adjacency matrix, discovering all neighbors of a vertex requires scanning `V` possible destinations.

A full traversal can therefore require `O(V²)` work.

## 25. Cycle Detection vs Shortest Cycle

Detecting whether any cycle exists is not the same as finding the shortest cycle.

The latter can require substantially different algorithms and may use BFS from multiple sources or more specialized techniques.

Do not conflate the two objectives.

## 26. Cycle Detection vs Strong Connectivity

A strongly connected directed component with more than one vertex contains cycles, but SCC decomposition solves a broader structural problem.

Cycle detection can often be performed more cheaply when only existence is required.

## 27. Backend Application: Dependency Validation

Represent dependencies as directed edges:

```text
service A → service B
```

A cycle may make initialization, deployment, or dependency ordering impossible under the system's dependency semantics.

Cycle detection can therefore be a build-time validation step.

## 28. Backend Application: Workflow Graphs

A workflow may allow cycles intentionally, such as retry loops, or prohibit them for DAG-style execution.

The algorithm must follow the workflow's actual semantics rather than assuming every cycle is invalid.

## 29. Backend Application: Package Dependencies

Package/module dependency graphs are commonly modeled as directed graphs.

A directed cycle can reveal circular dependencies that complicate build or module initialization behavior.

## 30. AI Application: State Spaces

Cycles are normal in many state spaces.

Therefore AI search usually needs duplicate-state detection rather than simply declaring every repeated state an error.

This is an important distinction between graph structure and application semantics.

## 31. AI Application: Planning

Dependency-like planning graphs may require cycle checks when constructing acyclic plans or dependency schedules.

Other planning systems intentionally permit repeated states and handle them with visited sets, costs, or transposition tables.

## 32. AI Application: Knowledge Graphs

Knowledge graphs can contain cycles naturally.

Cycle detection may be useful for structural analysis, but a cycle is not inherently an error.

## 33. Correctness Proof Structure

For an undirected DFS detector, prove:

1. every tree edge is handled as discovery
2. the parent edge is ignored
3. every remaining visited neighbor closes a cycle

For directed DFS, prove:

1. `GRAY` means active ancestor/path membership
2. an edge to `GRAY` closes a cycle
3. edges to `BLACK` do not by themselves imply a cycle

## 34. Testing Strategy

Test:

- empty graph
- single vertex
- single edge
- tree
- triangle
- long cycle
- self-loop
- parallel edges
- disconnected graph with one cyclic component
- directed back edge
- directed DAG
- directed cross/forward edges

## 35. Differential Testing

For small graphs, compare the optimized detector against brute-force cycle reasoning.

For directed graphs, enumerate small simple paths or use transitive closure to independently validate whether a cycle exists.

## 36. Property Testing

Useful properties:

- every undirected tree is acyclic
- adding an edge between two already connected vertices creates a cycle in a simple undirected graph
- a directed DAG remains cycle-free under topological ordering
- a directed self-loop is cyclic
- disconnected cycle detection equals the OR of per-component detection

## 37. Adversarial Graphs

Use:

- deep chains
- huge stars
- dense graphs
- many self-loops
- many parallel edges
- one tiny cyclic component hidden among millions of acyclic vertices
- long directed chains with a back edge near the end

## 38. JavaScript Engineering

Prefer iterative DFS when graph depth may be large.

Avoid repeatedly allocating temporary objects inside hot traversal loops when performance matters.

Use compact typed arrays for integer-indexed graphs when memory pressure is significant.

## 39. Common Mistakes

- using only `visited` for directed DFS
- forgetting the parent check in undirected graphs
- missing disconnected components
- treating every visited directed neighbor as a cycle
- forgetting self-loops
- ignoring multigraph semantics
- using recursive DFS on extremely deep graphs
- confusing cycle existence with shortest-cycle computation

## 40. Interview Framework

When asked “detect a cycle”:

1. clarify directed vs undirected
2. clarify simple graph vs multigraph
3. choose DFS/BFS or Kahn where appropriate
4. define state semantics
5. state the invariant
6. implement
7. derive `O(V + E)` for adjacency lists
8. cover disconnected graphs and edge cases
9. explain how to reconstruct the cycle if required

## 41. Revision Checklist

- [ ] Detect cycles in undirected graphs with DFS.
- [ ] Detect cycles in undirected graphs with BFS.
- [ ] Detect cycles in directed graphs with DFS states.
- [ ] Implement iterative directed DFS.
- [ ] Understand `WHITE/GRAY/BLACK`.
- [ ] Reconstruct a directed cycle.
- [ ] Handle disconnected graphs.
- [ ] Handle self-loops.
- [ ] Understand parallel-edge semantics.
- [ ] Connect cycle detection to topological sorting.
- [ ] Explain Kahn's cycle criterion.
- [ ] Test against reference implementations.
- [ ] Apply cycle reasoning to backend and AI systems.

## Key Takeaways

1. Undirected cycle detection needs parent awareness.
2. Directed DFS needs active-path state, not merely a visited set.
3. A `GRAY` target in directed DFS represents a back edge and therefore a cycle.
4. Kahn's algorithm can detect cycles when topological processing cannot consume all vertices.
5. Self-loops and multigraphs require explicit semantics.
6. Cycle existence, shortest cycle, and SCC decomposition are different problems.
