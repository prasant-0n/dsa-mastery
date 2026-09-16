# 14.07 — Shortest Paths: BFS, Unweighted Graphs & Path Reconstruction

## 1. Concept Definition

A shortest path minimizes the number of edges between two vertices in an unweighted graph. BFS is the foundational algorithm because it explores vertices in nondecreasing distance from the source.

## 2. Why It Matters

Shortest paths appear in:

- network hops
- dependency distance
- routing
- grid navigation
- workflow transitions
- state-space search
- social/network analysis

## 3. Mathematical Model

For source `s`, define:

```text
d[s] = 0
```

For every reachable vertex `v`:

```text
d[v] = minimum number of edges on a path from s to v
```

## 4. BFS Shortest-Path Principle

BFS processes vertices layer by layer:

```text
0 edges → source
1 edge  → source neighbors
2 edges → next layer
3 edges → next layer
...
```

Therefore the first discovered distance is optimal in an unweighted graph.

## 5. Algorithm

```text
set distance[source] = 0
queue source

while queue not empty:
    u = dequeue()
    for v in neighbors(u):
        if v has no distance:
            distance[v] = distance[u] + 1
            parent[v] = u
            enqueue(v)
```

## 6. Why Mark on Discovery

Marking a vertex when first discovered guarantees that only one shortest-path discovery schedules it.

If marking is delayed until dequeue, duplicate queue entries may occur and additional work may be introduced.

## 7. Parent Pointers

Store:

```text
parent[v] = u
```

when `v` is first discovered from `u`.

Following parents from target to source reconstructs one shortest path.

## 8. Path Reconstruction

Given `parent[target]`, repeatedly move toward the source:

```text
target → parent[target] → ... → source
```

Then reverse the collected sequence.

## 9. Unreachable Vertices

If no path exists, the target remains undiscovered.

Define the API explicitly, for example:

```text
null
[]
Infinity
```

Do not mix sentinel conventions accidentally.

## 10. Shortest-Path Tree

BFS parent pointers form a shortest-path tree rooted at the source over all reachable vertices.

For every reachable `v ≠ s`:

```text
d[parent[v]] + 1 = d[v]
```

## 11. Correctness Invariant

When a vertex `v` is first discovered by BFS:

> `distance[v]` equals the shortest number of edges from the source to `v`.

This follows because every smaller distance layer has already been processed.

## 12. Proof by Layers

Assume all vertices at distance `k` are discovered with correct distance.

Their undiscovered neighbors are at distance at most `k+1`.

No undiscovered vertex can have a path of length ≤ `k` because such a vertex would already have been reached in an earlier layer.

Therefore the newly assigned distance `k+1` is minimal.

## 13. Time Complexity

With adjacency lists:

```text
Time:  O(V + E)
Space: O(V)
```

The graph's adjacency storage is separate from traversal auxiliary space.

## 14. Adjacency Matrix

With an adjacency matrix, each processed vertex may require scanning all `V` possible neighbors.

Standard BFS therefore requires `O(V²)` traversal work.

## 15. Single-Target BFS

If only one target matters, BFS can terminate immediately when the target is discovered.

This can reduce practical work while preserving the `O(V + E)` worst-case bound.

## 16. Path vs Distance

These are separate outputs:

- distance answers the minimum cost
- parent pointers enable path reconstruction

Do not store full paths for every queue entry unless there is a specific reason; parent pointers use much less memory.

## 17. Multiple Shortest Paths

A vertex can have multiple shortest predecessors.

Standard BFS stores one parent and therefore reconstructs one shortest path.

If all shortest paths are required, the representation and complexity change substantially.

## 18. Counting Shortest Paths

Maintain a count:

```text
ways[source] = 1
```

When discovering `v` for the first time:

```text
ways[v] = ways[u]
```

If another edge reaches `v` at the same shortest distance:

```text
ways[v] += ways[u]
```

Use appropriate numeric handling when counts can become large.

## 19. Lexicographically Smallest Shortest Path

If several shortest paths exist and a deterministic smallest path is required, neighbor ordering alone may not always be sufficient depending on the exact vertex-label semantics.

Define the comparison rule explicitly and design the BFS state accordingly.

## 20. Multi-Source Shortest Paths

Initialize every source with distance zero.

BFS then computes:

```text
d[v] = minimum distance from v to any source
```

This is equivalent to adding a conceptual super-source connected to every source by a zero-cost edge under the multi-source model.

## 21. Nearest Target / Nearest Source

Multi-source BFS can solve nearest-source problems efficiently:

- nearest server
- nearest facility
- nearest marked cell
- nearest available resource

The distance array and source-owner array can identify both distance and responsible source.

## 22. Bidirectional BFS

When source and target are both known, bidirectional BFS expands from both ends.

The frontiers meet when the searches overlap.

It can reduce explored states on suitable high-branching graphs, but the reverse traversal must be available or constructible.

## 23. Grid Shortest Paths

A grid is an implicit graph:

```text
cell = vertex
legal move = edge
```

BFS finds minimum-step paths when every move has equal cost.

Obstacles simply remove edges or vertices.

## 24. Grid Path Reconstruction

Store a parent direction or previous-cell coordinate for each discovered cell.

This reconstructs the actual movement sequence after reaching the target.

## 25. State-Space Shortest Paths

For puzzles or transformations:

```text
state = vertex
legal operation = edge
```

BFS finds the minimum number of operations when every operation has equal cost.

## 26. When BFS Is Not Enough

BFS is not the correct shortest-path algorithm when edge costs differ.

Typical alternatives include:

- 0-1 BFS for weights restricted to `0/1`
- Dijkstra for nonnegative weights
- DAG shortest paths for DAGs
- Bellman-Ford when negative edges may exist

These will be studied separately.

## 27. Weighted-Graph Boundary

Do not treat an unweighted graph as weighted merely because edges carry metadata.

The relevant question is whether traversal cost is identical for every edge under the optimization objective.

## 28. Backend Application: Network Hops

If every network transition is modeled as one equal-cost hop, BFS can find minimum-hop routes.

Real routing usually has latency, bandwidth, reliability, or policy costs, requiring richer models.

## 29. Backend Application: Dependency Distance

BFS can determine minimum dependency depth from a service/module to a target dependency.

This can support impact analysis and architecture diagnostics.

## 30. Backend Application: Workflow Transitions

If every workflow transition has equal cost, BFS can find the minimum number of transitions between states.

If transitions have duration or risk, a weighted shortest-path algorithm is more appropriate.

## 31. AI Application: Puzzle Search

BFS gives minimum-action solutions for finite state spaces where each action has equal cost.

The state representation and duplicate detection strategy often dominate memory usage.

## 32. AI Application: Planning

When actions have uniform cost, BFS is a valid optimal search strategy.

For varying action costs or heuristic guidance, uniform-cost or heuristic search may be preferable.

## 33. AI Application: Knowledge-Graph Distance

BFS can compute hop distance between entities in an unweighted knowledge graph.

Production systems should constrain depth, visited nodes, and returned paths.

## 34. Memory Engineering

For large graphs, avoid storing complete paths in every queue entry.

Prefer:

```text
visited/distance array
parent array
compact queue
```

For integer vertex IDs, typed arrays can reduce memory overhead.

## 35. Queue Engineering in JavaScript

Avoid repeatedly using `Array.shift()` in a large BFS if it causes unnecessary element movement.

Use a head index:

```text
queue = []
head = 0

while head < queue.length:
    u = queue[head++]
```

This gives queue operations with practical constant-time behavior.

## 36. Deterministic Results

If output must be reproducible, define:

- vertex ordering
- neighbor ordering
- tie-breaking
- source ordering for multi-source BFS

The shortest distance is invariant, but the chosen path may not be.

## 37. Edge Cases

Handle:

- empty graph
- source absent
- target absent
- source equals target
- unreachable target
- self-loops
- parallel edges
- disconnected graph
- single-vertex graph
- very deep path
- very wide frontier

## 38. Testing Strategy

For small graphs, compare BFS distances against a brute-force enumeration of simple paths or an independent shortest-path oracle.

Validate every reconstructed path edge and verify its length equals the reported shortest distance.

## 39. Property Testing

Useful properties:

- `distance[source] = 0`
- every reachable non-source vertex has a parent
- `distance[v] = distance[parent[v]] + 1`
- reconstructed path starts at source and ends at target
- reconstructed path length equals target distance
- unreachable vertices have the chosen unreachable sentinel

## 40. Adversarial Testing

Use:

- long chains
- huge star graphs
- dense graphs
- many duplicate edges
- isolated targets
- source=target
- large grids
- multiple equal-length paths

## 41. Common Mistakes

- using DFS for unweighted shortest paths without additional reasoning
- marking visited too late
- storing complete paths in every queue entry
- using `shift()` carelessly on huge queues
- forgetting disconnected targets
- confusing minimum hops with minimum weighted cost
- assuming the reconstructed path is unique

## 42. Interview Framework

For “shortest path in an unweighted graph”:

1. identify equal edge cost
2. choose BFS
3. initialize distance/source state
4. mark on discovery
5. store parent if path reconstruction is required
6. stop early if appropriate
7. prove the layer invariant
8. derive `O(V + E)`
9. discuss unreachable and source=target cases

## 43. Revision Checklist

- [ ] Implement BFS shortest distance.
- [ ] Implement path reconstruction.
- [ ] Build a shortest-path tree.
- [ ] Handle unreachable targets.
- [ ] Count shortest paths.
- [ ] Implement multi-source BFS.
- [ ] Understand bidirectional BFS.
- [ ] Solve grid shortest-path problems.
- [ ] Model state-space problems as graphs.
- [ ] Explain when BFS is not appropriate.
- [ ] Optimize a JavaScript queue.
- [ ] Test shortest-path invariants.
- [ ] Apply shortest paths to backend and AI systems.

## Key Takeaways

1. BFS computes shortest edge-count paths in unweighted graphs.
2. The first discovery of a vertex establishes its shortest distance.
3. Parent pointers reconstruct one shortest path without storing full paths in the queue.
4. Multi-source BFS computes distance to the nearest source.
5. Equal-cost shortest paths are different from weighted shortest paths.
6. Queue and memory engineering matter for large JavaScript graphs.
