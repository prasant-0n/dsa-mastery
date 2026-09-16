# 14.09 — Bellman-Ford, Negative Weights & Negative Cycles

## 1. Concept Definition

Bellman-Ford solves single-source shortest paths in weighted directed graphs and supports negative edge weights. It can also detect whether a reachable negative-weight cycle exists.

## 2. Why It Matters

Dijkstra requires nonnegative weights. Bellman-Ford is the foundational alternative when negative edges are valid or when negative-cycle detection is required.

Applications include:

- cost transformations
- arbitrage-style models
- constraint systems
- graph potentials
- routing with penalties/credits
- difference constraints

## 3. Relaxation

For edge `u → v` with weight `w`:

```text
d[v] = min(d[v], d[u] + w)
```

Bellman-Ford repeatedly applies this operation across all edges.

## 4. Core Algorithm

Initialize:

```text
d[source] = 0
d[others] = Infinity
```

Then perform `V - 1` full relaxation passes.

Afterward, perform one additional pass. If any reachable distance can still improve, a reachable negative cycle exists.

## 5. Why V - 1 Passes

Any simple path contains at most `V - 1` edges.

After pass `k`, all shortest paths using at most `k` edges have been correctly propagated under a suitable edge-processing invariant.

Therefore `V - 1` passes are sufficient when no reachable negative cycle exists.

## 6. Negative Cycles

A negative cycle has total edge weight less than zero.

Repeated traversal can decrease the path cost without bound.

Therefore a finite shortest-path distance does not exist for vertices whose costs can be improved indefinitely through a reachable negative cycle.

## 7. Negative Cycle Detection

After `V - 1` passes, scan every edge once more.

If:

```text
d[u] + w < d[v]
```

for a reachable `u`, then a reachable negative cycle exists.

The reachability condition matters: an unrelated negative cycle cannot affect the source's shortest-path problem.

## 8. Early Termination

If an entire pass produces no distance changes, the algorithm can terminate early.

No edge can improve the solution in later passes because the relaxation closure has stabilized.

Worst-case complexity remains `O(VE)`.

## 9. Edge Processing Order

The order in which edges are relaxed can affect how quickly improvements propagate between passes.

It does not change the final shortest-path result when the algorithm completes under its assumptions.

Certain edge orders can make a simple implementation converge earlier in practice.

## 10. Path Reconstruction

Store:

```text
parent[v] = u
```

when a strict distance improvement occurs.

Following parents reconstructs a shortest path when a finite shortest path exists.

## 11. Negative-Cycle Reconstruction

When an additional pass detects an improvable vertex, follow its parent pointer repeatedly for `V` steps to enter the cycle's predecessor region.

Then continue following parents until a repeated vertex is found and reconstruct the cycle.

The implementation must distinguish the cycle itself from the path leading into it.

## 12. Reachable vs Unreachable Negative Cycles

Consider:

```text
source → A

B → C = -5
C → B = 1
```

If `B` is unreachable from the source, its negative cycle does not affect source-based shortest paths.

Therefore cycle detection must ignore relaxations originating from `Infinity`.

## 13. Complexity

With an edge list:

```text
Time:  O(VE)
Space: O(V)
```

Graph storage itself requires `O(E)`.

## 14. Comparison with Dijkstra

| Property | Bellman-Ford | Dijkstra |
|---|---|---|
| Negative edges | yes | no |
| Negative-cycle detection | yes | no |
| Typical time | `O(VE)` | `O((V+E) log V)` with heap |
| Core operation | repeated relaxation | greedy finalization + relaxation |
| Typical use | negative-weight models | nonnegative weights |

## 15. Why Dijkstra Fails Here

Dijkstra finalizes a minimum tentative distance based on nonnegative monotonicity.

Negative edges can invalidate that assumption because a later path can reduce an already selected vertex's distance.

Bellman-Ford does not rely on this greedy finalization property.

## 16. Difference Constraints

A constraint such as:

```text
x_v ≤ x_u + c
```

can be represented as an edge:

```text
u → v with weight c
```

Bellman-Ford can then determine whether the system is feasible under a suitable super-source construction.

## 17. Constraint Feasibility

A reachable negative cycle in a difference-constraints graph indicates an inconsistent set of inequalities under the standard transformation.

This is a major conceptual connection between shortest paths and constraint solving.

## 18. Super-Source Technique

To analyze all vertices regardless of their original reachability, introduce a conceptual source connected to every vertex with a zero-weight edge.

Then every vertex is reachable from the super-source, allowing global negative-cycle detection.

## 19. Arbitrage-Style Models

Some financial graph models transform multiplicative exchange relationships into additive edge weights using logarithms.

A profitable cycle can correspond to a negative cycle under an appropriate sign convention.

The mathematical transformation must be defined explicitly; Bellman-Ford itself does not model finance automatically.

## 20. SPFA Boundary

The Shortest Path Faster Algorithm (SPFA) is a queue-based optimization of relaxation ideas.

It can perform well on some workloads but has poor worst-case behavior and should not be treated as a guaranteed replacement for Bellman-Ford.

## 21. Queue-Based Relaxation

A queue can store vertices whose outgoing edges may need reconsideration after their distance improves.

This can reduce unnecessary scans in practice, but adversarial graphs can cause repeated processing.

## 22. DAG Boundary

If the graph is a DAG, shortest paths can be solved by topological-order relaxation, even with negative edge weights.

Bellman-Ford is therefore not the only negative-edge-capable approach.

## 23. Zero-Weight Edges

Bellman-Ford naturally supports zero-weight edges.

They may create multiple equal-distance paths without causing negative cycles by themselves.

## 24. Undirected Negative Edges

An undirected negative edge effectively creates a two-edge cycle whose total weight is negative when represented in both directions.

Therefore an undirected graph containing a negative-weight edge has a reachable negative cycle whenever that edge is reachable from the source.

This is an important modeling boundary.

## 25. Numerical Safety

Distance values may become very negative when negative edges and cycles exist.

Use safe numeric representations and avoid arithmetic such as `Infinity + weight` without explicit reachability checks when implementation semantics could obscure the intended state.

## 26. Backend Applications

Bellman-Ford can support:

- constraint validation
- cost propagation
- routing models with penalties
- dependency cost analysis
- anomaly detection in graph cost systems

Production workloads should justify the `O(VE)` cost and use faster specialized algorithms when their assumptions apply.

## 27. AI Applications

Bellman-Ford concepts appear in:

- constraint graphs
- planning with signed costs
- graph-based optimization
- negative-cycle diagnostics
- feasibility analysis

AI search with arbitrary negative action costs requires careful handling because standard shortest-path assumptions may fail.

## 28. Correctness Invariant

After the `k`-th full relaxation pass, shortest paths using at most `k` edges have had sufficient opportunity to propagate through the relaxation process.

After `V - 1` passes, every finite shortest simple path has been covered.

## 29. Negative-Cycle Proof

If an edge can still relax after `V - 1` passes from a reachable source, then the improving walk contains more than `V - 1` edges.

Such a walk must repeat a vertex.

The repeated cycle must have negative total weight; otherwise removing it would not produce a strictly cheaper path.

## 30. Testing Strategy

Test:

- positive weights
- zero weights
- negative edges without cycles
- reachable negative cycles
- unreachable negative cycles
- multiple negative edges
- disconnected graphs
- self-loops
- source equals target
- DAGs with negative edges

## 31. Differential Testing

For small graphs without negative cycles, compare Bellman-Ford against exhaustive simple-path enumeration.

For nonnegative graphs, also compare against Dijkstra.

For graphs with negative cycles, independently validate the existence and reachability of the cycle.

## 32. Property Testing

Useful properties:

- source distance is zero
- every finite reconstructed path has the reported cost
- no relaxable reachable edge remains after convergence without a negative cycle
- a reported negative cycle is reachable from the source
- every edge on a reconstructed cycle exists in the correct direction

## 33. Adversarial Testing

Use:

- long chains
- dense graphs
- slowly propagating improvements
- negative edges near the end of paths
- reachable negative cycles
- unreachable negative cycles
- many zero-weight edges
- edge-order permutations

## 34. Common Mistakes

- running only `V - 2` passes
- treating any negative cycle anywhere as source-relevant
- relaxing from unreachable vertices
- using Dijkstra with negative edges
- failing to distinguish negative cycles from negative edges
- reconstructing the path into a cycle instead of the cycle itself
- assuming SPFA has Bellman-Ford's worst-case performance

## 35. Interview Framework

For “shortest path with negative edges”:

1. verify negative weights are possible
2. ask whether negative cycles are possible/relevant
3. choose Bellman-Ford when general negative edges must be supported
4. initialize distances
5. perform `V - 1` relaxation passes
6. optionally stop early when stable
7. perform the extra negative-cycle detection pass
8. derive `O(VE)`
9. explain unreachable-cycle semantics

## 36. Revision Checklist

- [ ] Explain why Dijkstra fails with negative edges.
- [ ] Implement Bellman-Ford.
- [ ] Implement early termination.
- [ ] Detect reachable negative cycles.
- [ ] Reconstruct shortest paths.
- [ ] Reconstruct a negative cycle.
- [ ] Distinguish reachable and unreachable cycles.
- [ ] Understand difference constraints.
- [ ] Understand the super-source technique.
- [ ] Compare Bellman-Ford with DAG shortest paths.
- [ ] Understand the SPFA trade-off.
- [ ] Test numeric and graph edge cases.
- [ ] Apply the model to backend and AI systems.

## Key Takeaways

1. Bellman-Ford supports negative edge weights.
2. `V - 1` relaxation passes are sufficient for finite shortest paths without reachable negative cycles.
3. An additional pass detects reachable negative cycles.
4. Reachability matters: an unrelated negative cycle does not affect the source's shortest paths.
5. Difference constraints connect shortest-path algorithms to constraint solving.
6. DAG shortest paths can handle negative edges more efficiently when acyclicity is guaranteed.
