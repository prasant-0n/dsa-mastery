# 15.07 — Minimum Spanning Tree: Kruskal's Greedy Algorithm & Cut Property

## 1. Concept Definition

Given a connected, weighted, undirected graph, a **minimum spanning tree (MST)** is a spanning tree whose total edge weight is minimum among all spanning trees.

For a disconnected graph, the analogous object is a **minimum spanning forest**.

Kruskal's algorithm constructs an MST by repeatedly selecting the lightest edge that does not create a cycle.

## 2. Why It Matters

Kruskal is a canonical greedy algorithm because its correctness follows from the **cut property** and a precise safe-edge argument.

It combines:

- sorting
- greedy choice
- disjoint-set union (DSU)
- cycle detection
- exchange/cut reasoning

## 3. Formal Model

For graph `G = (V, E)` with edge weights `w(e)`, find a spanning tree `T` minimizing:

```text
Σ w(e), e ∈ T
```

A spanning tree contains exactly:

```text
|V| - 1
```

edges for a connected graph.

## 4. Kruskal's Greedy Rule

1. Sort all edges by non-decreasing weight.
2. Start with every vertex in its own DSU component.
3. Consider edges in sorted order.
4. Add an edge if its endpoints belong to different components.
5. Union those components.
6. Stop after `V - 1` selected edges for a connected graph.

## 5. Why Reject Cycle-Forming Edges

If both endpoints are already connected, adding the edge creates a cycle.

A spanning tree cannot contain a cycle.

Removing any edge from that cycle would produce a spanning structure with no greater cost, so the cycle-forming edge is unnecessary.

## 6. Cut Property

For any cut of a weighted graph, a minimum-weight edge crossing that cut is **safe** for an MST.

If several crossing edges tie for minimum weight, at least one of them is safe; depending on the graph, multiple MSTs may exist.

## 7. Kruskal Through Cuts

At any point, DSU components define a partition of the vertices.

An edge connecting two different components crosses the corresponding cut.

The lightest such edge can be safely selected.

## 8. Exchange Argument

Let `e` be a light edge crossing a cut and suppose an MST `T` does not contain `e`.

Adding `e` to `T` creates a cycle.

That cycle contains another edge `f` crossing the same cut.

Since `e` is no heavier than `f`, replace `f` with `e`.

The result is still a spanning tree and has no greater total weight.

Therefore an MST exists containing `e`.

## 9. DSU Role

DSU answers:

```text
Are u and v already connected?
```

and supports:

```text
union(u, v)
```

efficiently.

## 10. DSU Optimizations

Two standard optimizations are:

- path compression
- union by size/rank

Together they provide near-constant amortized operations, commonly written as `O(α(V))` per operation.

## 11. Complexity

Sorting dominates:

```text
O(E log E)
```

DSU processing is approximately:

```text
O(E α(V))
```

Total:

```text
O(E log E)
```

Since `E <= V²`, this is also commonly expressed as `O(E log V)` up to standard graph-model assumptions.

## 12. Space Complexity

Typical auxiliary state includes:

- sorted edge storage
- DSU parent array
- DSU size/rank array
- selected MST edges

Overall space is typically:

```text
O(V + E)
```

when the edge list is stored explicitly.

## 13. Minimum Spanning Forest

If the graph is disconnected, Kruskal naturally produces one MST per connected component.

The result contains:

```text
V - C
```

edges, where `C` is the number of connected components.

## 14. Negative Edge Weights

MST algorithms do not require non-negative edge weights.

Kruskal still sorts by weight and applies the same cycle/cut reasoning.

## 15. Parallel Edges

Parallel edges are valid.

The lighter edge may be selected while a heavier parallel edge is rejected because it would connect vertices already joined by the lighter edge.

## 16. Self-Loops

A self-loop cannot belong to a spanning tree because it does not connect two distinct components.

Kruskal can safely reject it.

## 17. Equal Weights

Equal-weight edges can lead to multiple valid MSTs.

Kruskal may return any MST unless deterministic tie-breaking is required.

## 18. Deterministic Tie-Breaking

For reproducible output, sort using:

```text
weight → edge ID
```

Determinism does not imply uniqueness of the mathematical MST.

## 19. MST vs Shortest-Path Tree

An MST minimizes the **total weight of the tree**.

A shortest-path tree minimizes distances from a chosen source.

They solve different problems.

## 20. MST vs Steiner Tree

An MST spans every required vertex.

A Steiner tree may introduce additional vertices to reduce connection cost among terminals.

The optimization problem is different.

## 21. Kruskal vs Prim

Kruskal:

- naturally uses an edge list
- sorts global edges
- works well for sparse graphs
- naturally produces a forest
- uses DSU

Prim:

- grows one tree from a frontier
- naturally uses adjacency structures
- uses a priority queue
- can be attractive for dense or adjacency-based workloads

Neither should be selected by habit alone.

## 22. When Sorting Is Dominant

If the graph has many edges, edge sorting often dominates runtime.

Specialized integer-weight algorithms can change this trade-off when weights have restricted domains.

## 23. Integer Weight Boundary

When edge weights are small integers, bucket/radix-style ordering can potentially reduce comparison-sorting cost.

The appropriate choice depends on weight range and memory constraints.

## 24. Dynamic MST Boundary

When edges are inserted or deleted repeatedly, rerunning Kruskal from scratch may be too expensive.

Dynamic MST techniques use substantially more advanced structures.

## 25. Backend Applications

MST concepts can model:

- network backbone construction
- infrastructure connectivity
- low-cost physical links
- dependency consolidation
- cluster connectivity
- topology planning

The real system may have reliability, capacity, latency, or redundancy constraints that change the optimization objective.

## 26. AI Applications

MSTs can support:

- clustering pipelines
- graph preprocessing
- topology simplification
- hierarchical structure extraction
- connectivity analysis

An MST is not automatically an appropriate substitute for a task-specific similarity graph objective.

## 27. Correctness Invariant

After processing any prefix of sorted edges, every selected edge connects two different DSU components, so the selected edges form a forest.

## 28. Forest Invariant

If the current DSU has `C` components, the selected forest contains:

```text
V - C
```

edges.

## 29. Termination

For a connected graph, the algorithm terminates once `V - 1` edges have been selected.

For a disconnected graph, it terminates after all edges are processed and returns a spanning forest.

## 30. Optimality Proof Structure

A clean proof uses:

1. forest invariant
2. cut property for every accepted safe edge
3. induction over greedy selections
4. termination with a spanning tree/forest

## 31. Brute-Force Verification

For tiny graphs, enumerate subsets containing the required number of edges, keep only spanning trees, and compare total weights.

This provides a reference for validating Kruskal implementations.

## 32. Differential Testing

Compare:

- Kruskal
- Prim
- brute-force MST for tiny graphs

Normalize edge IDs or total cost when multiple MSTs are possible.

## 33. Adversarial Test Families

Test:

- already sorted edges
- reverse-sorted edges
- equal weights
- negative weights
- disconnected graphs
- dense graphs
- sparse graphs
- parallel edges
- self-loops
- duplicate edge IDs

## 34. Common Mistakes

- applying Kruskal to directed MST problems
- forgetting that MST is about total tree weight
- using a max-heap/order accidentally
- failing to union accepted edges
- treating equal-weight MSTs as unique
- rejecting negative weights unnecessarily
- confusing MST with shortest paths

## 35. Backend Engineering

A production MST service should define:

- graph versioning
- edge identity
- update semantics
- deterministic output
- numeric precision
- concurrency
- snapshot consistency
- failure behavior

## 36. AI Engineering

When using MSTs for clustering or graph preprocessing, validate that the chosen edge weight actually represents the intended similarity/dissimilarity objective.

Algorithmic correctness cannot compensate for an incorrect graph model.

## 37. Interview Framework

For “minimum-cost network connecting all nodes”:

1. identify an undirected weighted graph
2. identify total connection cost as the objective
3. recognize MST
4. choose Kruskal when edge-list processing is natural
5. sort edges by weight
6. use DSU to reject cycles
7. stop after `V - 1` accepted edges
8. prove safety with the cut property
9. derive `O(E log E)`

## 38. Revision Checklist

- [ ] Define MST and spanning forest.
- [ ] Explain Kruskal step-by-step.
- [ ] Implement DSU.
- [ ] Explain path compression.
- [ ] Explain union by size/rank.
- [ ] State the cut property.
- [ ] Perform the exchange argument.
- [ ] Handle disconnected graphs.
- [ ] Handle equal/negative weights and self-loops.
- [ ] Distinguish MST from shortest-path trees.
- [ ] Compare Kruskal and Prim.
- [ ] Verify against brute force.

## Key Takeaways

1. Kruskal repeatedly chooses the lightest edge that safely connects different components.
2. DSU makes cycle detection efficient.
3. The cut property provides the fundamental greedy correctness theorem.
4. Sorting usually dominates the classical runtime.
5. Kruskal naturally extends from MSTs to minimum spanning forests.
6. Production graph problems may add constraints that require algorithms beyond classical MST.
