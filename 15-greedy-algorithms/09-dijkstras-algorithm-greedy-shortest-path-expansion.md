# 15.09 — Dijkstra's Algorithm: Greedy Shortest-Path Expansion

## 1. Concept Definition

Dijkstra's algorithm solves the single-source shortest-path problem for graphs whose edge weights are non-negative.

It repeatedly finalizes the unsettled vertex with the smallest tentative distance.

## 2. Mental Model

Maintain:

```text
finalized shortest paths | frontier | unsettled vertices
```

The smallest tentative distance is the next greedy choice.

## 3. Relaxation

For an edge `u -> v` with weight `w`:

```text
tentative = dist[u] + w
```

If this is smaller than `dist[v]`, update `dist[v]` and record `u` as its predecessor.

## 4. Greedy Choice

Select the unsettled vertex with minimum tentative distance.

Because all edge weights are non-negative, any alternative path reaching that vertex through another unsettled vertex cannot produce a smaller distance.

Therefore its tentative distance becomes final.

## 5. Priority Queue

A min-heap provides the next vertex with minimum tentative distance.

A common implementation uses lazy duplicate entries rather than a decrease-key operation.

## 6. Lazy Priority Queue

When a shorter path is found, push a new `(distance, vertex)` entry.

An extracted entry is stale when its distance no longer equals the current best-known distance.

Stale entries are discarded.

## 7. Eager Priority Queue

An indexed heap can maintain one entry per vertex and support decrease-key.

This reduces duplicate queue entries but increases implementation complexity.

## 8. Complexity

With adjacency lists and a binary heap, a common bound is:

```text
O((V + E) log V)
```

or `O(E log V)` for connected graphs where `E` dominates `V`.

## 9. Dense-Graph Variant

An array-based implementation can select the minimum tentative vertex in `O(V)` per iteration, giving:

```text
O(V² + E)
```

which is often summarized as `O(V²)` for dense graphs.

## 10. Correctness Invariant

Once a vertex is finalized, its recorded distance equals the true shortest-path distance from the source.

This invariant depends critically on non-negative edge weights.

## 11. Proof Sketch

Let `u` be the unsettled vertex with minimum tentative distance.

Assume a shorter path to `u` exists.

On that path, consider the first unsettled vertex `x` after the finalized region.

Its predecessor is finalized, so relaxation would have assigned `x` a distance no greater than the shorter path's length to `u`.

Because edge weights are non-negative, `x` cannot have a larger tentative distance than `u`, contradicting the choice of `u` unless the distances are equal.

Thus `u` is safe to finalize.

## 12. Why Non-Negative Weights Matter

With a negative edge, a path that appears more expensive while passing through an unsettled vertex can later become cheaper.

That breaks the greedy finalization argument.

## 13. Negative Edge Boundary

Dijkstra should not be used when reachable negative-weight edges can affect shortest paths.

Bellman-Ford or other algorithms may be appropriate depending on the problem.

## 14. Negative Cycle Boundary

If a reachable negative cycle exists, shortest-path distance may be undefined because paths can reduce their cost indefinitely.

## 15. Directed Graphs

Dijkstra works on directed graphs with non-negative edge weights as well as undirected graphs represented by symmetric directed edges.

## 16. Unreachable Vertices

Vertices that cannot be reached from the source retain an infinite distance and no predecessor.

The implementation must represent this state explicitly.

## 17. Multiple Shortest Paths

Equal-length paths may produce different predecessor trees.

If deterministic output is required, define tie-breaking.

## 18. Self-Loops

A non-negative self-loop cannot improve a shortest distance.

It may be ignored safely under the classical model.

## 19. Parallel Edges

Parallel edges are valid.

Relaxation naturally considers each edge and keeps the best resulting distance.

## 20. Early Termination

If the goal is one target vertex rather than all distances, the algorithm can terminate when that target is finalized.

Do not terminate merely when the target is discovered.

## 21. Path Reconstruction

Store a predecessor whenever relaxation improves a vertex.

Starting at the target, follow predecessors back to the source and reverse the sequence.

## 22. Stale Entry Handling

A stale heap entry must not finalize a vertex using an obsolete distance.

Always validate the extracted distance against current state before processing it.

## 23. Dijkstra vs BFS

BFS is correct for unweighted graphs or equal unit-cost edges because each edge contributes the same cost.

Dijkstra generalizes the frontier idea to non-negative weighted edges.

## 24. Dijkstra vs Prim

Both can use a min-priority queue, but their keys represent different objectives.

Prim chooses the cheapest edge connecting the growing tree to a new vertex.

Dijkstra chooses the smallest source-distance estimate.

## 25. Dijkstra vs A*

A* adds a heuristic to guide search toward a target.

Dijkstra is equivalent to A* with zero heuristic.

A* requires appropriate heuristic conditions for its optimality guarantees.

## 26. Backend Applications

Dijkstra can support:

- network routing
- service-to-service latency paths
- dependency-cost traversal
- infrastructure topology analysis
- least-cost workflow routing

The edge weight must represent the intended additive cost.

## 27. Production Routing

Real routing systems may need:

- changing edge weights
- congestion
- multiple metrics
- service availability
- time-dependent costs
- route constraints
- caching

A static Dijkstra model may be insufficient for these requirements.

## 28. AI Applications

Dijkstra can serve as a baseline for exact graph search in planning, state-space traversal, and graph-based retrieval when transition costs are non-negative.

It is also the conceptual foundation for understanding uniform-cost search.

## 29. Uniform-Cost Search

Uniform-cost search expands the lowest path-cost frontier node.

This is the search interpretation of Dijkstra's algorithm.

## 30. Numeric Considerations

Distances can grow as paths accumulate edge weights.

JavaScript implementations should consider precision and overflow behavior when weights or path lengths are very large.

## 31. Complexity Depends on Representation

Do not state only `O(E log V)` without identifying assumptions.

Mention:

- adjacency list vs matrix
- heap implementation
- decrease-key vs lazy duplicates
- graph density
- number of reachable edges

## 32. Brute-Force Verification

For tiny graphs, enumerate simple paths and compare shortest distances.

For graphs containing cycles, bound the search or use a reference algorithm rather than enumerating arbitrary walks.

## 33. Differential Testing

Compare Dijkstra against:

- Bellman-Ford on non-negative graphs
- Floyd-Warshall for tiny graphs
- exhaustive simple-path search on very small graphs

Compare distance arrays and validate reconstructed paths.

## 34. Adversarial Tests

Use:

- disconnected graphs
- zero-weight edges
- equal-weight paths
- dense graphs
- sparse graphs
- long chains
- star graphs
- many stale heap entries
- very large weights
- reachable negative edges as rejection tests

## 35. Correctness Testing

Verify:

- source distance is zero
- finalized distances never decrease
- every predecessor edge exists
- reconstructed paths have the recorded cost
- unreachable vertices remain unreachable
- every relaxation satisfies the shortest-distance inequality

## 36. Common Mistakes

- using Dijkstra with negative edges
- finalizing a vertex when discovered rather than extracted as minimum
- failing to ignore stale heap entries
- confusing Prim's key with Dijkstra's key
- using BFS for arbitrary positive weights
- reconstructing paths without cycle protection
- using unsafe numeric assumptions

## 37. Interview Framework

For “shortest path from one source with non-negative weights”:

1. identify weighted single-source shortest path
2. verify non-negative edge weights
3. initialize source distance to zero
4. use a min-heap by tentative distance
5. repeatedly finalize the minimum valid entry
6. relax outgoing edges
7. optionally stop when the target is finalized
8. reconstruct using predecessors
9. derive complexity
10. explain why negative edges break the proof

## 38. Revision Checklist

- [ ] Explain tentative vs finalized distance.
- [ ] Implement lazy-heap Dijkstra.
- [ ] Understand decrease-key/eager Dijkstra.
- [ ] Prove the greedy finalization property.
- [ ] Explain the non-negative-weight requirement.
- [ ] Reconstruct shortest paths.
- [ ] Handle unreachable vertices.
- [ ] Handle ties and parallel edges.
- [ ] Compare Dijkstra with BFS, Prim, and A*.
- [ ] Verify against an independent reference.
- [ ] Apply it to backend and AI graph problems.

## Key Takeaways

1. Dijkstra greedily finalizes the unsettled vertex with minimum tentative source distance.
2. Non-negative edge weights make that finalization safe.
3. A min-heap makes the frontier selection efficient.
4. Lazy duplicate entries are a practical alternative to decrease-key.
5. Dijkstra, Prim, and A* can look structurally similar while solving different optimization problems.
6. Correct algorithm selection begins by checking the graph's weight and objective assumptions.
