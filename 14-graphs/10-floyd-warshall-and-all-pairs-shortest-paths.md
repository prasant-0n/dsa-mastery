# 14.10 — Floyd-Warshall & All-Pairs Shortest Paths

## 1. Concept Definition

The **all-pairs shortest-path (APSP)** problem asks for the shortest-path distance between every ordered pair of vertices.

Floyd-Warshall solves APSP using dynamic programming and supports negative edge weights as long as the graph has no relevant negative cycle.

## 2. Why It Matters

APSP is useful when many source-target queries must be answered and the graph is small or dense enough to justify a quadratic distance matrix.

Applications include:

- routing matrices
- network analysis
- graph closure
- dependency distance
- facility/network planning
- knowledge-graph analysis

## 3. Core State

Let:

```text
d[i][j]
```

represent the shortest known distance from vertex `i` to vertex `j`.

Initialize it with direct edge weights, `0` on the diagonal, and `Infinity` when no direct edge exists.

## 4. Dynamic Programming Insight

Floyd-Warshall progressively allows vertices from a set of intermediate vertices.

For intermediate vertex `k`:

```text
d[i][j] = min(
  d[i][j],
  d[i][k] + d[k][j]
)
```

The key question is whether the best path from `i` to `j` benefits from routing through `k`.

## 5. Recurrence

Define `D(k, i, j)` as the shortest path from `i` to `j` whose intermediate vertices belong to `{1, ..., k}`.

Then:

```text
D(k,i,j) = min(
  D(k-1,i,j),
  D(k-1,i,k) + D(k-1,k,j)
)
```

The in-place implementation uses the same recurrence without retaining every historical matrix.

## 6. Triple Loop

Canonical implementation:

```text
for k = 0 .. V-1
    for i = 0 .. V-1
        for j = 0 .. V-1
            d[i][j] = min(d[i][j], d[i][k] + d[k][j])
```

The order `k → i → j` is fundamental to the standard in-place algorithm.

## 7. Complexity

```text
Time:  O(V³)
Space: O(V²)
```

The distance matrix itself requires `O(V²)` storage.

## 8. Why It Can Be Useful

For dense graphs with moderate `V`, an `O(V³)` algorithm can be practical and conceptually simpler than repeatedly running sparse-graph algorithms.

The correct choice depends on vertex count, density, query volume, and memory budget.

## 9. Initialization

For each vertex `i`:

```text
d[i][i] = 0
```

For every edge `u → v` with weight `w`:

```text
d[u][v] = min(d[u][v], w)
```

The `min` matters when parallel edges exist.

## 10. Undirected Graphs

Represent an undirected edge `{u,v}` as both directed entries:

```text
d[u][v] = w
d[v][u] = w
```

unless the data model already stores both directions.

## 11. Negative Edges

Floyd-Warshall supports negative edge weights.

Unlike Dijkstra, it does not rely on nonnegative edge costs.

However, negative cycles require explicit detection and change the meaning of shortest-path distances.

## 12. Negative-Cycle Detection

After the algorithm completes:

```text
if d[v][v] < 0
    vertex v is affected by a reachable negative cycle
```

A negative diagonal entry indicates that a negative-cost closed walk is reachable from that vertex and returns to it.

## 13. Negative-Cycle Semantics

If a negative cycle lies on a route from `i` to `j`, the path cost can be reduced without bound.

Therefore a finite shortest distance for that pair does not exist under the usual unrestricted-walk model.

Applications must define how such pairs are represented.

## 14. Negative-Cycle Reachability

A negative diagonal entry alone identifies vertices involved in or able to return through negative-cycle structure.

To identify all `(i,j)` pairs whose shortest paths are unbounded below, examine whether:

```text
d[i][k] < Infinity
and d[k][k] < 0
and d[k][j] < Infinity
```

for some negative-cycle vertex `k`.

## 15. Path Reconstruction

Distances alone do not identify the actual route.

Maintain a predecessor/next-hop matrix with carefully defined update semantics.

A common approach stores the predecessor of `j` on the current best path from `i` to `j`.

## 16. Next-Hop Matrix

Another representation stores:

```text
next[i][j] = next vertex after i on a shortest path to j
```

Path reconstruction repeatedly follows `next` until reaching the target.

This can make route reconstruction convenient for repeated queries.

## 17. Path Reconstruction Invariant

Whenever `d[i][j]` is improved through `k`, update the path metadata consistently with the new route.

Distance and path metadata must always describe the same candidate path.

## 18. Multiple Optimal Paths

There may be many equal-cost shortest paths.

Floyd-Warshall normally retains one according to its tie-breaking/update policy.

If deterministic output is required, define a stable tie-breaking rule.

## 19. Lexicographic Tie-Breaking

A secondary optimization criterion can select among equal-cost paths.

However, path comparison can become expensive and may require additional metadata.

Do not silently assume numeric distance optimization also determines a unique path.

## 20. Transitive Closure

For an unweighted graph, Floyd-Warshall can be adapted to boolean reachability:

```text
reachable[i][j] = reachable[i][j]
                  OR
                  (reachable[i][k] AND reachable[k][j])
```

This computes transitive closure in `O(V³)` time.

## 21. Boolean vs Weighted Semiring View

The Floyd-Warshall recurrence is part of a broader dynamic-programming pattern over algebraic structures.

Examples include:

- min-plus for shortest paths
- boolean OR/AND for reachability
- max-min variants for bottleneck paths

The recurrence changes according to the aggregation and combination operations.

## 22. Min-Plus Interpretation

Shortest paths use:

```text
combine = +
select  = min
```

Therefore the update is:

```text
min(current, throughKLeft + throughKRight)
```

This is often called min-plus dynamic programming.

## 23. Bottleneck Paths

For a path whose value is the minimum edge capacity along the path, combine path values with `min` and select alternatives using `max`.

This illustrates how the Floyd-Warshall structure can solve related closure problems by changing the algebra.

## 24. Dense Graph Strategy

For dense graphs, the adjacency matrix representation naturally aligns with Floyd-Warshall's matrix computation.

For sparse graphs with very large `V`, `O(V²)` memory may be the limiting factor before computation time becomes acceptable.

## 25. Repeated Single-Source Comparison

One alternative for APSP is running a single-source algorithm from every vertex.

For nonnegative sparse graphs, repeated Dijkstra may be preferable.

For graphs with negative edges, repeated Bellman-Ford may be much more expensive than Floyd-Warshall.

## 26. Johnson's Algorithm Boundary

Johnson's algorithm combines reweighting with repeated Dijkstra to solve APSP efficiently on sparse graphs with negative edges but no negative cycles.

It will be studied separately.

## 27. DAG APSP Boundary

If the graph is a DAG, single-source shortest paths can be solved efficiently using topological order from each source.

The graph's structural guarantees should influence algorithm selection.

## 28. Matrix Memory

For `V` vertices, a full numeric matrix contains `V²` entries.

At large `V`, this can become the dominant resource.

In JavaScript, nested ordinary arrays can add substantial object overhead; typed arrays can provide more predictable memory usage for numeric matrices.

## 29. Infinity Handling

Never blindly compute:

```text
Infinity + negativeWeight
```

without considering the representation semantics.

Explicitly check whether both subpaths are reachable before combining them when implementation correctness depends on that distinction.

## 30. Numeric Precision

JavaScript `Number` uses IEEE-754 double precision.

Very large path sums can lose integer precision.

If exact large integer costs are required and values fit the supported range, consider `BigInt`, while remembering that `BigInt` and `Number` cannot be mixed directly.

## 31. Backend Application: Route Matrices

A service or network with a moderate number of nodes may precompute all-pairs distances and answer repeated route-cost queries quickly.

A production design must account for update frequency, invalidation, memory, and consistency.

## 32. Backend Application: Dependency Distance

An organization can compute dependency distances between services/modules.

The resulting matrix can support impact analysis and architectural queries.

## 33. Backend Application: Policy/Reachability Analysis

Boolean Floyd-Warshall can compute transitive reachability in a small relation graph.

For authorization systems, the graph semantics and security boundaries must be explicit; mathematical reachability is not automatically equivalent to permission.

## 34. AI Application: Knowledge-Graph Distances

APSP can precompute hop or weighted distances in small knowledge graphs where repeated pair queries justify the cost.

For large graphs, local search or specialized indexing may be more appropriate.

## 35. AI Application: State-Space Analysis

For small finite state spaces, an APSP matrix can support repeated planning-distance queries and structural analysis.

For large state spaces, `O(V²)` storage is usually impractical.

## 36. AI Application: Graph Closure

Transitive closure can reveal indirect relationships in symbolic or knowledge systems.

The output size itself is quadratic, so the representation must be justified by the query workload.

## 37. Correctness Proof Structure

Prove by induction on `k`:

1. before processing `k`, `d[i][j]` represents the best path whose allowed intermediate vertices are among the previously processed set
2. any optimal path either avoids `k` or uses `k`
3. if it uses `k`, split it into `i → k` and `k → j`
4. the recurrence chooses the better case
5. after all `k`, every allowed intermediate vertex has been considered

## 38. Negative-Cycle Proof

A negative diagonal means there is a negative-cost closed walk from a vertex back to itself.

Such a cycle can be repeated to reduce total path cost without bound.

For pair `(i,j)`, a reachable negative-cycle vertex on a route from `i` to `j` makes the ordinary shortest-path value unbounded below.

## 39. Testing Strategy

Test:

- empty graph
- one vertex
- disconnected graph
- direct edges
- multi-hop shortest paths
- parallel edges
- zero weights
- negative edges
- negative cycles
- multiple optimal paths
- dense graphs
- boolean transitive closure

## 40. Differential Testing

For small graphs without negative cycles, compare Floyd-Warshall against repeated Bellman-Ford or Dijkstra where weights are nonnegative.

Validate every finite matrix entry independently.

## 41. Property Testing

Useful properties:

- `d[i][i] = 0` when no negative cycle affects `i`
- triangle inequality holds for finite shortest-path distances
- every direct edge is no cheaper than the computed shortest distance
- path reconstruction cost equals the reported distance
- a negative cycle produces a negative diagonal entry

## 42. Adversarial Testing

Use:

- dense graphs
- many parallel edges
- long chains
- zero-weight cycles
- negative edges near optimal routes
- negative cycles hidden behind long paths
- huge numeric weights
- many unreachable pairs

## 43. Common Mistakes

- using the wrong loop order for in-place Floyd-Warshall
- forgetting diagonal initialization
- overwriting a cheaper parallel edge
- mishandling `Infinity`
- claiming negative edges are unsupported
- ignoring negative cycles
- reconstructing paths with inconsistent metadata
- allocating unnecessary copies of the full matrix

## 44. Interview Framework

For “all-pairs shortest paths”:

1. identify whether all pairs are actually required
2. estimate `V²` memory
3. inspect graph density
4. check for negative edges/cycles
5. choose Floyd-Warshall for suitable moderate-size/dense graphs
6. state the recurrence
7. explain the `k → i → j` loop order
8. derive `O(V³)` time and `O(V²)` space
9. compare with repeated Dijkstra/Bellman-Ford and Johnson

## 45. Revision Checklist

- [ ] Define APSP.
- [ ] Initialize the Floyd-Warshall matrix.
- [ ] Explain the DP recurrence.
- [ ] Implement the correct triple-loop order.
- [ ] Handle parallel edges.
- [ ] Support negative edges.
- [ ] Detect negative cycles.
- [ ] Understand negative-cycle pair semantics.
- [ ] Reconstruct paths with next-hop/predecessor metadata.
- [ ] Compute transitive closure.
- [ ] Explain min-plus reasoning.
- [ ] Compare Floyd-Warshall with repeated SSSP and Johnson.
- [ ] Analyze `O(V³)` time and `O(V²)` space.
- [ ] Apply APSP reasoning to backend and AI systems.

## Key Takeaways

1. Floyd-Warshall solves all-pairs shortest paths with dynamic programming.
2. Its core recurrence considers whether an optimal route passes through intermediate vertex `k`.
3. The standard in-place implementation requires `k` as the outer loop.
4. Negative edges are supported; negative cycles require explicit handling.
5. `O(V²)` memory makes graph size a primary design constraint.
6. Boolean Floyd-Warshall computes transitive closure.
7. Algorithm selection should consider density, graph size, query volume, and weight semantics.
