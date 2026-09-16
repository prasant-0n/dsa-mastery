# 14.15 — Bridges, Articulation Points & Low-Link Algorithms

## 1. Concept Definition

In an undirected graph, a **bridge** is an edge whose removal increases the number of connected components.

An **articulation point** is a vertex whose removal increases the number of connected components.

Both can be found in `O(V + E)` using DFS discovery times and low-link values.

## 2. Why It Matters

These structures identify connectivity bottlenecks:

- network failure points
- infrastructure resilience
- dependency analysis
- graph decomposition
- vulnerability analysis
- critical communication links

## 3. DFS Discovery Time

During DFS assign each vertex a monotonically increasing timestamp:

```text
tin[v] = discovery time of v
```

This creates a DFS tree and gives an ordering for low-link reasoning.

## 4. Low-Link Value

For an undirected DFS, define:

```text
low[v] = minimum tin[x]
```

reachable from `v`'s DFS subtree using zero or more tree edges followed by at most one back edge to an ancestor.

## 5. Tree Edges

If `u` discovers an unvisited vertex `v`, then `(u,v)` becomes a DFS tree edge.

After recursively processing `v`:

```text
low[u] = min(low[u], low[v])
```

## 6. Back Edges

An edge from a vertex to an already visited ancestor can provide an alternate route upward.

For an undirected graph, ignore the immediate parent edge when processing the DFS adjacency list.

For a non-parent visited neighbor `v`:

```text
low[u] = min(low[u], tin[v])
```

## 7. Bridge Criterion

For a DFS tree edge `(u,v)` where `u` is the parent of `v`:

```text
low[v] > tin[u]
```

implies `(u,v)` is a bridge.

## 8. Why the Bridge Criterion Works

If `low[v] > tin[u]`, the subtree rooted at `v` has no back edge reaching `u` or any ancestor of `u`.

Therefore every route from that subtree to the rest of the DFS component must cross `(u,v)`.

Removing it disconnects the graph.

## 9. Non-Bridge Criterion

If:

```text
low[v] <= tin[u]
```

then the subtree has an alternate connection to `u` or an ancestor, so `(u,v)` is not a bridge.

## 10. Articulation Point: Non-Root

For a non-root DFS vertex `u`, if it has a child `v` satisfying:

```text
low[v] >= tin[u]
```

then `u` is an articulation point.

## 11. Why the Articulation Criterion Works

The subtree rooted at `v` has no back edge reaching a strict ancestor of `u`.

Removing `u` therefore separates that subtree from the rest of the DFS component.

## 12. Articulation Point: Root

A DFS root is an articulation point exactly when it has at least **two DFS tree children**.

The root has no ancestor, so the non-root low-link criterion does not apply directly.

## 13. Bridge-Tree Relationship

Remove all bridges from an undirected graph.

The remaining connected components can be contracted into vertices.

The resulting bridge tree is a forest; for a connected original graph it is a tree.

## 14. 2-Edge-Connected Components

Two vertices are in the same 2-edge-connected component when no bridge separates them.

Bridge decomposition exposes these components naturally.

## 15. Biconnected Components Preview

Articulation-point analysis leads to **vertex-biconnected components** and block-cut trees.

A biconnected decomposition captures regions that remain connected under removal of a single vertex, subject to the precise definition being used.

## 16. Block-Cut Tree

Create a bipartite structure containing:

- articulation-point vertices
- biconnected component nodes

Connect an articulation vertex to every block containing it.

The resulting block-cut structure is a tree for each connected component under the standard decomposition.

## 17. Parallel Edges

Parallel edges require careful parent-edge handling.

If the graph stores edge IDs, skip only the exact parent edge rather than every edge connecting to the parent vertex.

Otherwise a parallel edge can incorrectly be ignored and a true bridge may be reported.

## 18. Self-Loops

A self-loop does not disconnect an undirected graph when removed and therefore is not a bridge.

It also does not create a separate articulation point by itself.

## 19. Disconnected Graphs

Run DFS from every unvisited vertex.

Bridge and articulation analysis must cover every connected component.

## 20. Complexity

With adjacency lists:

```text
Time:  O(V + E)
Space: O(V + E)
```

Each vertex and edge is processed a constant number of times.

## 21. Recursive Implementation

The recursive DFS directly mirrors the low-link recurrence.

However, very deep graphs can exceed the JavaScript call stack.

## 22. Iterative Implementation

An iterative version must explicitly simulate DFS frames and defer the parent's low-link update until the child frame finishes.

A frame can store:

```text
vertex
parent edge
next neighbor index
```

## 23. Edge-Stack Decomposition

Biconnected component algorithms can maintain an edge stack.

When a DFS child satisfies the relevant low-link boundary, pop edges until the parent-child edge is reached to form a block.

## 24. Correctness Invariant

For every active DFS vertex `u`, `low[u]` accurately summarizes the earliest discovery time reachable from its subtree under the low-link definition.

All bridge and articulation criteria follow from this invariant.

## 25. Bridge Correctness

For tree edge `(u,v)`:

- `low[v] > tin[u]` means no alternate route reaches `u` or above
- therefore `(u,v)` is a mandatory connection
- removing it separates the child subtree

## 26. Articulation Correctness

For non-root `u`, a child `v` with `low[v] >= tin[u]` has no route to a strict ancestor of `u` without passing through `u`.

Removing `u` separates that subtree.

## 27. Root Correctness

If a DFS root has at least two children, their subtrees have no DFS-tree connection through an ancestor of the root.

Removing the root therefore separates those subtrees.

## 28. Backend Application: Network Resilience

Vertices can represent services or infrastructure nodes and edges can represent communication links.

Bridges identify links whose failure can partition the network.

Articulation points identify nodes whose failure can split connectivity.

## 29. Backend Application: Service Dependency Graphs

Critical links or service nodes can be detected in an undirected dependency model.

The result can inform redundancy analysis, but operational importance also depends on traffic, capacity, and failure semantics.

## 30. Backend Application: Infrastructure Planning

Bridge and articulation analysis can identify where redundant connections may be needed.

A production design should evaluate multiple failure scenarios rather than relying on one graph abstraction.

## 31. AI Application: Similarity Graphs

In graph-based clustering, bridges can indicate weak connectivity between otherwise dense regions.

Removing selected bridges can expose natural component boundaries under the graph's similarity definition.

## 32. AI Application: Knowledge Graph Structure

Articulation analysis can identify structural bottlenecks in an undirected projection of a knowledge graph.

The interpretation depends strongly on how directed relations are converted to an undirected model.

## 33. AI Application: State-Space Connectivity

Critical transitions or states can be identified when a state graph is modeled as undirected connectivity.

For directed state semantics, SCC and directed-cut techniques may be more appropriate.

## 34. Testing Strategy

Test:

- single vertex
- isolated vertices
- tree graphs
- cycles
- chains
- dense graphs
- disconnected graphs
- parallel edges
- self-loops
- graphs with many articulation points
- graphs with no bridges

## 35. Differential Testing

For small graphs, remove each edge and compare connected-component counts to identify bridges by brute force.

Similarly, remove each vertex and compare component counts to identify articulation points.

Use this as a reference oracle against the linear-time implementation.

## 36. Property Testing

Validate every reported bridge by physically removing it and checking that connectivity increases.

Validate every reported articulation point by removing it and checking that connectivity increases.

Validate every non-bridge/non-articulation candidate against the reference model.

## 37. Adversarial Testing

Use:

- deep DFS chains
- large cycles
- dense graphs
- parallel edges
- disconnected components
- many repeated edges
- root-heavy DFS structures

## 38. Benchmarking

Measure:

- DFS traversal time
- adjacency representation
- recursive vs iterative implementations
- edge-ID handling
- bridge count
- articulation count
- memory usage

## 39. Common Mistakes

- using `low[v] >= tin[u]` for bridges instead of `>`
- forgetting the special root rule
- skipping all parent-vertex edges when parallel edges exist
- failing to restart DFS on disconnected graphs
- updating `low` with `low[v]` for a back edge instead of `tin[v]`
- ignoring self-loops and edge IDs
- assuming recursive DFS is safe for arbitrarily deep graphs

## 40. Interview Framework

For “find bridges/articulation points”:

1. confirm the graph is undirected
2. identify DFS discovery times
3. define `low[]`
4. derive the bridge criterion
5. derive the articulation criterion
6. handle the root separately
7. handle parallel edges correctly
8. derive `O(V + E)`
9. discuss disconnected graphs
10. explain iterative DFS concerns in JavaScript

## 41. Revision Checklist

- [ ] Define a bridge.
- [ ] Define an articulation point.
- [ ] Explain `tin[]`.
- [ ] Explain `low[]`.
- [ ] Implement bridge detection.
- [ ] Implement articulation-point detection.
- [ ] Explain the root special case.
- [ ] Handle parallel edges with edge IDs.
- [ ] Handle disconnected graphs.
- [ ] Understand bridge trees.
- [ ] Understand biconnected components and block-cut trees.
- [ ] Implement/understand iterative DFS.
- [ ] Apply the technique to backend and AI graph models.

## Key Takeaways

1. Bridges are edge-level connectivity bottlenecks.
2. Articulation points are vertex-level connectivity bottlenecks.
3. Both can be found in `O(V + E)` using DFS low-link values.
4. Bridges use `low[v] > tin[u]`.
5. Non-root articulation points use `low[v] >= tin[u]`.
6. DFS roots require the special two-child rule.
7. Edge IDs are important when parallel edges exist.
