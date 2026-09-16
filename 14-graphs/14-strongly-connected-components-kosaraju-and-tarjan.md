# 14.14 — Strongly Connected Components: Kosaraju & Tarjan

## 1. Concept Definition

A **strongly connected component (SCC)** of a directed graph is a maximal set of vertices where every vertex is reachable from every other vertex.

## 2. Why It Matters

SCCs reveal mutually reachable regions in directed systems:

- dependency cycles
- service topology
- workflow loops
- state-machine regions
- implication graphs
- program analysis
- directed knowledge graphs

## 3. Strong Connectivity

Vertices `u` and `v` belong to the same SCC exactly when:

```text
u → v is reachable
and
v → u is reachable
```

The relation is reflexive, symmetric within mutual reachability, and transitive, so SCCs partition the vertex set.

## 4. Condensation Graph

Collapse every SCC into one super-vertex.

The resulting **condensation graph** is always a DAG.

This is one of the most important consequences of SCC decomposition.

## 5. Why Condensation Is A DAG

If two distinct SCCs formed a directed cycle in the condensation graph, every component on that cycle would be mutually reachable with every other component.

They would therefore be one SCC, contradicting maximality.

## 6. Kosaraju's Algorithm

Kosaraju uses two graph traversals:

1. DFS on the original graph to compute finishing order.
2. Reverse every edge.
3. Process vertices in decreasing finishing time on the reversed graph.
4. Each DFS in step 3 identifies one SCC.

## 7. Finishing Times

During DFS, a vertex finishes after all reachable descendants in the current DFS branch have finished.

Store vertices when their DFS completes.

## 8. Why the Transpose Works

Reversing every edge transforms reachability relationships.

Processing vertices in decreasing original finishing time ensures that each second-pass traversal starts from an appropriate source component and does not incorrectly merge distinct SCCs.

## 9. Kosaraju Complexity

With adjacency lists:

```text
Time:  O(V + E)
Space: O(V + E)
```

The graph is traversed a constant number of times.

## 10. Tarjan's Algorithm

Tarjan finds all SCCs using a single DFS and a stack.

For each vertex maintain:

```text
index[v]
low[v]
```

where `low[v]` records the smallest DFS index reachable from the DFS subtree of `v` using tree edges and at most one back/cross relationship to an appropriate active vertex.

## 11. Tarjan Stack

Vertices currently belonging to the active DFS search are kept on a stack.

Maintain an `onStack` marker.

Only vertices still active in the current SCC search can participate in low-link updates through the stack relation.

## 12. Low-Link Rule

For an unvisited neighbor `w`:

```text
DFS(w)
low[v] = min(low[v], low[w])
```

For an edge to an active stack vertex `w`:

```text
low[v] = min(low[v], index[w])
```

## 13. SCC Root Condition

When:

```text
low[v] === index[v]
```

`v` is the root of an SCC.

Pop vertices from the stack until `v` is removed.

All popped vertices form one SCC.

## 14. Why onStack Matters

An edge to a vertex that has already been assigned to a completed SCC must not lower the current vertex's low-link value.

Therefore the active-stack condition is essential for Tarjan correctness.

## 15. Tarjan Complexity

With adjacency lists:

```text
Time:  O(V + E)
Space: O(V + E)
```

Every vertex and edge is processed a bounded number of times.

## 16. Kosaraju vs Tarjan

Both run in linear graph size:

```text
O(V + E)
```

Kosaraju is often conceptually straightforward because it separates ordering and component discovery.

Tarjan uses one DFS and low-link reasoning but requires more delicate invariants.

## 17. Iterative DFS Engineering

Recursive DFS may overflow the JavaScript call stack on very deep graphs.

An iterative implementation should explicitly represent:

- current vertex
- next neighbor index
- DFS state
- parent/return state

## 18. Recursive vs Iterative Tarjan

Recursive Tarjan maps naturally to the mathematical algorithm.

An iterative implementation must simulate call frames and preserve low-link updates after child completion.

This is an important engineering exercise for large graphs.

## 19. SCC Numbering

Component IDs are arbitrary unless an ordering is explicitly defined.

Do not compare raw component IDs across different algorithms as if they had canonical meaning.

Compare the induced partition or normalized component sets.

## 20. Condensation Construction

For every original edge:

```text
component[u] != component[v]
```

add an edge:

```text
component[u] → component[v]
```

Deduplicate condensation edges when the downstream algorithm requires a simple DAG.

## 21. Topological Ordering of SCCs

Because the condensation graph is a DAG, it can be topologically sorted.

This transforms cyclic directed structure into an acyclic component-level representation.

## 22. Reachability Compression

If many vertices belong to the same SCC, component compression can dramatically reduce the graph before downstream DAG algorithms.

This is useful for dependency analysis and symbolic reasoning.

## 23. SCCs and Directed Cycles

Every directed cycle lies entirely inside one SCC.

However, an SCC can contain many cycles and does not have to be a simple cycle.

A vertex belongs to a nontrivial SCC if it participates in mutual reachability with another distinct vertex.

## 24. Detecting Any Directed Cycle

A directed graph is cyclic if either:

- some SCC has more than one vertex, or
- a self-loop exists.

SCC decomposition therefore provides a complete cycle-analysis framework.

## 25. Self-Loops

A self-loop forms an SCC of size one but still represents a directed cycle.

Do not identify cycles solely by checking component size greater than one.

## 26. Single-Vertex SCCs

A singleton SCC with no self-loop is acyclic internally.

A singleton SCC with a self-loop contains a cycle.

## 27. Backend Application: Dependency Cycles

A directed dependency graph can be decomposed into SCCs.

An SCC with multiple services/modules indicates mutual dependency reachability and can highlight cyclic architecture.

## 28. Backend Application: Service Topology

Mutually reachable service flows can be grouped into components before performing higher-level topology analysis.

The SCC graph then provides an acyclic component-level view.

## 29. Backend Application: Workflow Systems

Workflow states connected through directed transitions can contain strongly connected regions representing repeatable loops.

SCC compression can simplify analysis of the workflow state machine.

## 30. Backend Application: Build Systems

Dependency graphs are expected to be DAGs in many build systems.

SCC detection can identify circular dependency groups before scheduling.

## 31. AI Application: Knowledge Graphs

SCCs can identify mutually reachable relation clusters in directed knowledge graphs.

Interpretation depends on edge semantics; reachability does not by itself imply semantic equivalence.

## 32. AI Application: State-Space Analysis

SCCs reveal recurrent regions of a directed state-transition graph.

They can support analysis of loops, absorbing regions, and repeated-state behavior.

## 33. AI Application: Program Analysis

Control-flow and call graphs can contain strongly connected regions corresponding to loops or mutually recursive routines.

SCC decomposition provides a natural unit for iterative analysis.

## 34. SCC + Dynamic Programming

Once SCCs are compressed, many problems become DAG problems.

A common pipeline is:

```text
directed graph
→ SCC decomposition
→ condensation DAG
→ topological processing
→ dynamic programming
```

## 35. Weighted SCC Aggregation

If every SCC receives an aggregate such as:

- total weight
- minimum value
- maximum value
- count

the condensation DAG can process these component-level values efficiently.

## 36. 2-SAT Preview

The implication graph of a 2-SAT instance can be analyzed using SCCs.

An instance is unsatisfiable when a variable and its negation belong to the same SCC.

Assignment extraction requires additional ordering/reachability reasoning.

## 37. Correctness Invariant — Kosaraju

At the beginning of each second-pass DFS, the selected vertex belongs to a not-yet-assigned SCC whose vertices can be discovered together in the transpose graph.

The finishing-time order prevents traversal from incorrectly crossing into an already-separated component.

## 38. Correctness Invariant — Tarjan

For an active vertex `v`, `low[v]` records the smallest discovery index reachable from its DFS subtree while respecting the active-stack condition.

When `low[v] === index[v]`, no active ancestor can reach above `v` through the current SCC, so `v` closes one SCC.

## 39. Testing Strategy

Test:

- empty graph
- isolated vertices
- one directed cycle
- multiple independent cycles
- chains
- DAGs
- self-loops
- parallel edges
- nested SCC structures
- large deep graphs

## 40. Differential Testing

Compare Kosaraju and Tarjan on generated graphs.

Because component IDs may differ, normalize each result into canonical sets before comparison.

## 41. Property Testing

Validate:

- every vertex belongs to exactly one SCC
- every pair within an SCC is mutually reachable
- no two distinct SCCs are mutually reachable
- condensation graph is acyclic
- every original cross-component edge appears in the condensation relation

## 42. Adversarial Testing

Use:

- very deep DFS chains
- one huge SCC
- many singleton SCCs
- alternating SCCs connected by one-way edges
- dense directed graphs
- large numbers of parallel edges

## 43. Common Mistakes

- applying SCC algorithms directly to undirected graphs without recognizing the different problem
- forgetting the transpose in Kosaraju
- using the wrong finishing-time order
- updating Tarjan `low` through inactive vertices
- forgetting self-loops when detecting cycles
- assuming component IDs are canonical
- using recursive DFS on huge graphs without considering stack depth

## 44. Interview Framework

For “find strongly connected components”:

1. confirm the graph is directed
2. define mutual reachability
3. choose Kosaraju or Tarjan
4. state the core invariant
5. implement carefully
6. derive `O(V + E)`
7. explain SCC condensation
8. discuss cycle detection and downstream DAG processing

## 45. Revision Checklist

- [ ] Define an SCC.
- [ ] Explain mutual reachability.
- [ ] Implement Kosaraju.
- [ ] Build the transpose graph.
- [ ] Explain finishing times.
- [ ] Implement Tarjan.
- [ ] Explain `index`, `low`, stack, and `onStack`.
- [ ] Detect directed cycles with SCCs.
- [ ] Build a condensation DAG.
- [ ] Topologically process SCC components.
- [ ] Understand SCC applications in 2-SAT/program analysis.
- [ ] Handle deep graphs safely in JavaScript.
- [ ] Compare SCC implementations using normalized partitions.

## Key Takeaways

1. SCCs partition a directed graph into maximal mutually reachable regions.
2. Kosaraju uses two DFS passes and the transpose graph.
3. Tarjan uses one DFS, low-link values, and an active stack.
4. Both run in `O(V + E)` with adjacency lists.
5. The condensation graph of SCCs is always a DAG.
6. SCC compression is a powerful bridge from cyclic directed graphs to DAG algorithms.
