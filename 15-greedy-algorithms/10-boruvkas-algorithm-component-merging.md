# 15.10 — Borůvka's Algorithm: Greedy Component Merging

## 1. Concept Definition

Borůvka's algorithm computes a minimum spanning tree (MST) of a weighted, undirected graph by repeatedly finding the cheapest outgoing edge of every connected component and merging the components.

The algorithm is greedy at the component level rather than at the individual-edge frontier level.

## 2. Problem Model

Input:

- an undirected weighted graph
- `V` vertices
- `E` edges

Goal:

- connect all vertices when the graph is connected
- minimize total edge weight
- never create a cycle

For a disconnected graph, the natural result is a minimum spanning forest.

## 3. Mental Model

Think of every vertex as its own component:

```text
A   B   C   D   E   F
```

Each component selects its cheapest edge leaving the component.

Those safe edges merge components:

```text
[A B]   [C D]   [E F]
```

The process repeats until one component remains for a connected graph.

## 4. Why It Is Greedy

For every current component, select a minimum-weight outgoing edge.

The cut property guarantees that a lightest edge crossing a cut is safe for some MST. Therefore each selected component edge can be added without losing MST optimality.

## 5. Cut Property

For any cut of a weighted undirected graph, a minimum-weight edge crossing that cut is safe to include in an MST.

A component and all vertices outside it define such a cut.

## 6. Borůvka Round

One round consists of:

1. inspect every edge
2. determine the components of its endpoints
3. record the cheapest outgoing edge for each component
4. merge all recorded safe edges
5. repeat

## 7. Why Multiple Edges Can Be Added

Unlike Kruskal's algorithm, Borůvka can identify many safe edges in the same round.

Some selected edges may connect components indirectly through other selected edges in that round.

Therefore the implementation must re-check whether an edge still joins different components before adding it.

## 8. Disjoint Set Union

DSU, also called Union-Find, tracks connected components efficiently.

Core operations:

- `find(x)` — identify the representative of a component
- `union(a, b)` — merge two components

With path compression and union by size/rank, operations are effectively constant amortized time for practical analysis.

## 9. Cheapest Edge Per Component

For each edge `(u, v, w)`:

```text
cu = find(u)
cv = find(v)
```

If `cu !== cv`, the edge is a candidate for both components.

Keep the minimum candidate for each representative.

## 10. Equal-Weight Edges

Multiple cheapest outgoing edges may have equal weights.

Different valid MSTs can result.

Correctness does not require a unique answer unless the graph has a unique MST.

## 11. Self-Loops

A self-loop cannot connect two components and should not be selected.

## 12. Parallel Edges

Parallel edges are valid.

The minimum suitable edge naturally dominates more expensive parallel edges for a given cut.

## 13. Negative Edge Weights

Negative weights are valid for MST algorithms.

Unlike Dijkstra, Borůvka does not require non-negative edge weights.

The objective is total spanning-tree weight, not shortest-path distance.

## 14. Disconnected Graphs

If no single component can eventually contain all vertices, the algorithm produces a minimum spanning forest.

The number of selected edges is:

```text
V - number_of_final_components
```

## 15. Why the Number of Rounds Is Logarithmic

When each component selects an outgoing edge, every successful selected edge merges at least two components.

Under the standard argument, the number of components can decrease by at least a factor of two per round.

Therefore there are at most `O(log V)` rounds.

## 16. Complexity

If every round scans all `E` edges and there are `O(log V)` rounds:

```text
O(E log V)
```

plus DSU work, which is near-linear in the number of operations.

## 17. Comparison With Kruskal

Kruskal sorts all edges once and processes them in ascending order.

Borůvka repeatedly scans edges and lets every component select a cheapest outgoing edge.

Both rely on the cut property and DSU, but their greedy choices occur at different granularities.

## 18. Comparison With Prim

Prim grows one connected tree from a selected starting vertex.

Borůvka grows many components simultaneously.

Prim's frontier is centered around one growing component; Borůvka's round considers every component.

## 19. Implementation Strategy

A production implementation should separate:

- graph validation
- DSU
- cheapest-edge discovery
- safe merge phase
- termination detection
- MST/forest result construction
- invariant validation

This separation makes testing easier.

## 20. Two-Phase Round Is Important

Do not immediately union an edge merely because it is currently the cheapest candidate while scanning.

First compute the candidate edges, then process the candidates.

This gives the round a clean logical boundary and makes correctness reasoning simpler.

## 21. Safe Merge Check

A candidate can become redundant after an earlier candidate in the same round merges its components.

Before adding it:

```text
if find(u) !== find(v)
```

then union and accept it.

Otherwise skip it.

## 22. Termination

For a connected graph, stop when the MST contains `V - 1` edges or DSU reports one component.

For a disconnected graph, stop when a complete scan produces no successful merges.

## 23. MST Weight

The final MST weight is the sum of all selected edge weights.

The implementation should track this independently from the edge list so tests can validate both structure and cost.

## 24. Correctness Invariant

At the start of every round, every current component is connected by already selected edges, and the selected edges form a forest that can be extended to an MST.

Every accepted cheapest outgoing component edge is safe by the cut property.

Therefore the invariant continues to hold.

## 25. Correctness Proof Sketch

For each component `C`, consider the cut `(C, V - C)`.

The algorithm chooses a minimum-weight edge crossing this cut.

By the cut property, that edge is safe for an MST.

Adding all safe candidates that still connect distinct components preserves acyclicity and keeps the selected forest extendable to an MST.

Repeated rounds eventually connect every reachable component.

Thus the resulting spanning tree or forest is minimum-weight.

## 26. Cycle Prevention

A candidate may have been safe when discovered but become redundant after another candidate is accepted.

The DSU check prevents adding such an edge and therefore prevents cycles.

## 27. Brute-Force Verification

For very small graphs, enumerate candidate spanning trees and compare the minimum total weight with Borůvka's result.

Only connected spanning trees should be compared for an MST test.

## 28. Differential Testing

Compare Borůvka against:

- Kruskal
- Prim
- brute-force MST enumeration for tiny graphs

For graphs with equal weights, compare total MST weight and spanning-tree validity rather than requiring identical edge sets.

## 29. Adversarial Tests

Include:

- single vertex
- two vertices
- disconnected components
- duplicate edges
- self-loops
- negative weights
- zero weights
- many equal weights
- star graphs
- path graphs
- dense graphs
- sparse graphs
- multiple valid MSTs

## 30. Backend Applications

Borůvka's component-merging model can help reason about:

- network topology optimization
- infrastructure connectivity
- distributed clustering
- minimum-cost service connectivity
- communication network design

The actual production objective must match the MST assumptions.

## 31. AI Applications

MSTs can support:

- graph preprocessing
- topology simplification
- clustering pipelines
- graph visualization backbones
- connectivity analysis

Borůvka is especially interesting when component-level parallelism matters.

## 32. Parallelism Insight

Because each component independently selects a cheapest outgoing edge, Borůvka has a natural parallel structure.

The expensive synchronization boundary is the merge phase.

This makes the algorithm historically and practically interesting for parallel/distributed graph processing.

## 33. Memory Model

Typical state includes:

```text
edges
DSU parent[]
DSU size/rank[]
cheapestEdge[]
selectedEdges[]
```

Space is generally `O(V + E)`.

## 34. Numeric Safety

MST weight may be the sum of many edge weights.

JavaScript implementations using `Number` should account for integer precision limits when edge weights or totals can become very large.

## 35. What Borůvka Does Not Solve

Borůvka is not a shortest-path algorithm.

It does not minimize the distance from a source to every vertex.

It minimizes the total weight of a spanning structure.

## 36. Common Mistakes

- treating Borůvka as shortest path
- forgetting the graph must be undirected for the classical MST problem
- selecting only one global cheapest edge per round
- unioning candidates during discovery without a safe merge phase
- forgetting to re-check components
- rejecting negative weights unnecessarily
- requiring an identical edge set when multiple MSTs exist
- claiming a connected MST for a disconnected graph

## 37. Interview Framework

For “find an MST using component merging”:

1. identify the MST problem
2. initialize every vertex as a component
3. for each component find its cheapest outgoing edge
4. collect candidates for the round
5. safely union candidates with DSU
6. repeat until one component remains
7. explain the cut property
8. explain the logarithmic number of rounds
9. derive `O(E log V)` complexity
10. discuss equal weights and disconnected graphs

## 38. Revision Checklist

- [ ] Explain Borůvka's component-level greedy choice.
- [ ] Explain the cut property.
- [ ] Implement DSU with path compression.
- [ ] Find the cheapest outgoing edge for every component.
- [ ] Separate candidate discovery from candidate merging.
- [ ] Prevent cycles with DSU.
- [ ] Explain the logarithmic round bound.
- [ ] Handle disconnected graphs.
- [ ] Handle negative, zero, equal, parallel, and self-loop edges.
- [ ] Compare Borůvka with Kruskal and Prim.
- [ ] Verify against an independent MST implementation.

## Key Takeaways

1. Borůvka applies a greedy choice to every component simultaneously.
2. The cheapest outgoing edge of a component is safe by the cut property.
3. DSU makes component tracking and cycle prevention efficient.
4. The number of rounds is logarithmic because components merge rapidly.
5. Classical Borůvka works with negative edge weights because MSTs do not require non-negative costs.
6. The algorithm naturally exposes opportunities for parallel graph processing.
