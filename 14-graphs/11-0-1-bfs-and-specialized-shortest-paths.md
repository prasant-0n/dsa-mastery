# 14.11 — 0–1 BFS & Specialized Shortest Paths

## 1. Concept Definition

**0–1 BFS** solves single-source shortest paths when every edge weight is exactly `0` or `1`.

It uses a **deque** instead of a general priority queue.

## 2. Why It Exists

Dijkstra's algorithm works for nonnegative weights, but a general heap is unnecessary when the only weights are `0` and `1`.

0–1 BFS exploits this restricted weight domain to obtain:

```text
Time:  O(V + E)
Space: O(V)
```

with adjacency lists.

## 3. Core Mental Model

When relaxing an edge:

```text
weight = 0 → process near the front
weight = 1 → process near the back
```

This preserves the same distance-priority idea as Dijkstra while using a deque.

## 4. Algorithm

Initialize:

```text
d[source] = 0
all other distances = Infinity
```

For edge `u → v` with weight `w ∈ {0,1}`:

```text
if d[u] + w < d[v]:
    d[v] = d[u] + w
    if w === 0:
        pushFront(v)
    else:
        pushBack(v)
```

## 5. Why the Deque Works

At all times, vertices in the deque are arranged so that their tentative distances differ only within the narrow range induced by `0/1` edge costs.

A zero-cost transition belongs ahead of a one-cost transition from the same frontier.

## 6. Correctness Relationship to Dijkstra

0–1 BFS can be understood as a specialized implementation of Dijkstra's priority discipline.

The deque replaces the heap because priorities have a restricted structure.

## 7. Relaxation

The fundamental operation remains:

```text
candidate = d[u] + w
```

and update `d[v]` when the candidate is smaller.

The specialization changes the frontier data structure, not the shortest-path objective.

## 8. Parent Tracking

Store:

```text
parent[v] = u
```

when `d[v]` improves.

Then reconstruct a shortest path exactly as with ordinary BFS or Dijkstra.

## 9. Multiple Optimal Paths

Equal-cost paths may exist.

If deterministic reconstruction is required, define tie-breaking explicitly rather than depending accidentally on adjacency order.

## 10. Complexity

Each edge may cause a bounded number of useful relaxations under the 0–1 BFS structure, yielding:

```text
O(V + E)
```

for adjacency-list representations.

The deque and distance state require `O(V)` auxiliary space.

## 11. Comparison with BFS

Ordinary BFS assumes every edge has equal cost.

0–1 BFS extends the idea to two costs:

```text
BFS:   every edge = 1
0–1 BFS: edge ∈ {0,1}
```

Using ordinary BFS when zero-cost edges exist can produce incorrect distances.

## 12. Comparison with Dijkstra

Dijkstra:

```text
arbitrary nonnegative weights
priority queue
```

0–1 BFS:

```text
weights restricted to 0 or 1
deque
```

When the restriction holds, the deque provides a simpler and asymptotically faster frontier implementation.

## 13. Edge Reversal Modeling

Many problems assign cost `0` to following an existing preferred direction and cost `1` to reversing it.

0–1 BFS then finds a path requiring the minimum number of direction changes/reversals.

## 14. Grid Direction Changes

A grid can assign:

```text
move in preferred cell direction → 0
change direction → 1
```

0–1 BFS can minimize the number of changes.

## 15. Teleportation / Free Transitions

State spaces may contain free transitions and unit-cost transitions.

Represent them as weights `0` and `1`, then apply 0–1 BFS.

## 16. Graph State Expansion

A richer state can encode additional information:

```text
(vertex, mode)
(vertex, direction)
(vertex, resource-state)
```

Edges between these states can carry `0/1` costs.

The algorithm operates on the expanded graph.

## 17. Avoiding Incorrect State Compression

If future cost depends on history or mode, the vertex alone may not be a sufficient state.

Expand the state until the shortest-path objective becomes Markovian:

> future transitions and costs must depend only on the current represented state.

## 18. Deque Engineering in JavaScript

A production implementation should avoid repeatedly shifting large arrays.

A practical deque can use an array with a moving head/tail index or a circular buffer.

## 19. Circular Deque

A fixed-capacity circular buffer can provide predictable front/back operations.

For workloads with a known upper bound, this can reduce allocation overhead.

## 20. Stale Entries

Unlike lazy-heap Dijkstra, a deque implementation should be designed carefully around repeated distance improvements.

An implementation may enqueue a vertex again after a better distance is found.

Correctness comes from relaxation; performance depends on maintaining the specialized frontier invariant.

## 21. Duplicate Queue Entries

Do not assume that every vertex appears exactly once unless the implementation proves that property.

The safe mental model is:

```text
distance is authoritative
frontier entries are work items
```

## 22. Early Termination

If only one target is needed, termination is safe only when the target's distance is known to be final under the algorithm's frontier ordering.

Do not stop merely because the target was first encountered.

## 23. Multi-Source 0–1 BFS

Initialize every source with distance `0` and place them into the deque.

This computes the minimum 0/1 cost from any source to every vertex.

## 24. Reverse-Graph Technique

For a query from many vertices toward one target, reverse the graph when the problem semantics permit it.

Then run one multi-source 0–1 BFS from the target to answer distances to the target.

## 25. Specialized Weight Domains

0–1 BFS is one example of a broader algorithm-engineering principle:

> Restricting the input domain can allow a simpler and faster data structure.

Related techniques include bucket-based shortest paths for bounded integer weights.

## 26. Dial's Algorithm Boundary

When nonnegative edge weights are small integers bounded by `C`, bucket-based approaches such as Dial's algorithm can replace a general heap under suitable assumptions.

The frontier becomes a collection of distance buckets.

## 27. Monotone Priority Queues

Shortest-path algorithms often exploit the fact that extracted minimum distances are nondecreasing.

Specialized integer-weight algorithms exploit this monotonicity more aggressively than comparison-based heaps.

## 28. Small Integer Weights

If weights lie in a small range, bucket queues may reduce priority-queue overhead.

However, the practical choice depends on:

- maximum weight
- graph size
- density
- memory
- distance range
- update distribution

## 29. Negative-Weight Boundary

0–1 BFS does **not** support arbitrary negative weights.

Its correctness relies on weights being exactly `0` or `1`.

Negative edges require algorithms designed for that domain.

## 30. Backend Application: Network Policy Costs

Suppose an edge means:

```text
preferred route = 0
policy exception = 1
```

0–1 BFS can find a route minimizing policy exceptions.

The cost model must be explicitly defined before choosing the algorithm.

## 31. Backend Application: Service Routing

A service topology can assign zero cost to preferred links and one cost to fallback links.

0–1 BFS can identify routes minimizing fallback transitions.

## 32. Backend Application: Configuration State Graphs

Configuration transitions can have free and unit operational costs.

An expanded state graph plus 0–1 BFS can find minimum-change transformations.

## 33. AI Application: Search with Free and Costly Actions

A state-space search can assign:

```text
free action → 0
unit-cost action → 1
```

0–1 BFS then computes minimum action cost under this restricted cost model.

## 34. AI Application: Constrained Decoding

A decoding state graph may contain transitions with no incremental penalty and transitions carrying a unit penalty.

0–1 BFS can be appropriate when the state space and cost semantics satisfy the strict 0/1 requirement.

## 35. AI Application: Grid Planning

Direction changes, rule violations, or mode switches can be modeled as unit penalties while ordinary moves cost zero.

The algorithm minimizes the number of penalized transitions.

## 36. Correctness Invariant

At every relaxation:

> `distance[v]` is the cost of some valid path from the source to `v`, and the deque ordering maintains the specialized frontier discipline required to process lower-cost states before higher-cost states.

## 37. Correctness Proof Sketch

Interpret 0–1 BFS as Dijkstra specialized to priorities whose edge increments are only `0` or `1`.

A zero-cost relaxation belongs before distance-increasing work; a unit-cost relaxation belongs after it.

Thus the deque preserves the minimum-distance frontier needed for shortest-path correctness.

## 38. Testing Strategy

Test:

- all-zero edges
- all-one edges
- mixed 0/1 edges
- disconnected graphs
- cycles
- self-loops
- multiple shortest paths
- long chains
- dense graphs
- grid direction-change problems

## 39. Differential Testing

For small graphs, compare 0–1 BFS against Dijkstra using the same 0/1 weights.

Every finite distance should match.

## 40. Property Testing

Validate:

- source distance is zero
- every reported path uses valid edges
- path cost equals reported distance
- no edge can improve a final distance
- distances match Dijkstra on the same valid 0/1 graph

## 41. Benchmarking

Compare:

- 0–1 BFS
- binary-heap Dijkstra
- indexed-heap Dijkstra
- bucket-based variants where applicable

Use workloads with different ratios of zero and one edges.

## 42. Common Mistakes

- applying 0–1 BFS to weights outside `{0,1}`
- using ordinary BFS when zero-cost edges exist
- assuming first discovery is always final
- implementing an inefficient deque
- losing state information in expanded graphs
- stopping at target before its distance is final

## 43. Interview Framework

For “shortest path with edge costs 0 or 1”:

1. identify the exact weight domain
2. recognize the 0–1 BFS pattern
3. use a deque
4. relax edges normally
5. push `0` edges to the front
6. push `1` edges to the back
7. explain the Dijkstra specialization
8. derive `O(V + E)`
9. compare against BFS and Dijkstra

## 44. Revision Checklist

- [ ] Explain why ordinary BFS fails with zero-cost edges.
- [ ] Implement 0–1 BFS.
- [ ] Implement an efficient deque.
- [ ] Track parent pointers.
- [ ] Handle repeated relaxations safely.
- [ ] Implement multi-source 0–1 BFS.
- [ ] Understand reverse-graph usage.
- [ ] Compare 0–1 BFS with Dijkstra.
- [ ] Understand bounded-integer bucket algorithms.
- [ ] Reject negative/arbitrary weights.
- [ ] Test against Dijkstra.
- [ ] Apply 0–1 BFS to backend and AI state spaces.

## Key Takeaways

1. 0–1 BFS is a specialized shortest-path algorithm for edge weights exactly `0` or `1`.
2. A deque replaces Dijkstra's general priority queue.
3. Zero-cost relaxations go to the front; unit-cost relaxations go to the back.
4. The resulting adjacency-list complexity is `O(V + E)`.
5. State representation is critical when costs depend on mode or history.
6. The same specialization principle leads to bucket-based shortest-path algorithms for bounded integer weights.
