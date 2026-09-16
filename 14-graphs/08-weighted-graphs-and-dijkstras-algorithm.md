# 14.08 — Weighted Graphs & Dijkstra's Algorithm

## 1. Concept Definition

A weighted graph assigns a cost, distance, latency, price, or other numeric value to each edge. A shortest path minimizes the total sum of edge weights.

Dijkstra's algorithm solves single-source shortest paths when all edge weights are **nonnegative**.

## 2. Why It Matters

Weighted shortest paths model:

- network latency
- travel distance
- API/service cost
- routing
- job transition cost
- resource consumption
- AI planning costs

## 3. Path Cost

For a path containing edges `e1 ... ek`:

```text
cost(path) = w(e1) + w(e2) + ... + w(ek)
```

The shortest path minimizes this total cost, not necessarily the number of edges.

## 4. Why BFS Is Not Enough

BFS assumes every edge has equal cost.

Consider:

```text
A → B = 1
A → C = 10
B → C = 1
```

The two-edge path `A → B → C` costs `2`, while the direct one-edge path costs `10`.

Minimum edge count and minimum weighted cost are different objectives.

## 5. Dijkstra Mental Model

Maintain the best-known distance to every vertex.

Repeatedly choose the unsettled vertex with the smallest tentative distance and relax its outgoing edges.

The priority queue stores candidate vertices ordered by tentative distance.

## 6. Initialization

For source `s`:

```text
distance[s] = 0
all other distances = Infinity
```

The source is inserted into the priority queue with priority `0`.

## 7. Relaxation

For edge `u → v` with weight `w`:

```text
candidate = distance[u] + w
```

If:

```text
candidate < distance[v]
```

update `distance[v]` and usually set:

```text
parent[v] = u
```

This operation is called **relaxation**.

## 8. Core Algorithm

```text
Dijkstra(source):
    distance[source] = 0
    push (0, source)

    while priority queue not empty:
        (d, u) = extract minimum
        if d is stale: continue

        for each edge u → v with weight w:
            if d + w < distance[v]:
                distance[v] = d + w
                parent[v] = u
                push (distance[v], v)
```

## 9. Why Stale Entries Occur

A binary heap may contain multiple entries for the same vertex after its distance improves.

Instead of requiring an efficient arbitrary `decreaseKey`, a common implementation inserts a new entry and ignores stale entries later.

Check:

```text
gheapDistance !== distance[u] → stale
```

## 10. Dijkstra Invariant

When the minimum non-stale tentative distance `d` for vertex `u` is extracted:

> `d` is the final shortest-path distance to `u`, provided all edge weights are nonnegative.

This is the key correctness invariant.

## 11. Why Nonnegative Weights Matter

Once a vertex has the smallest tentative distance, any future path reaching it through another unsettled vertex cannot become cheaper if all remaining edge costs are nonnegative.

Negative edges break this monotonicity.

## 12. Counterexample with Negative Edge

```text
A → B = 2
A → C = 5
C → B = -10
```

A naive Dijkstra process may finalize `B` at `2` before discovering the cheaper path through `C`.

Therefore Dijkstra must not be used for general graphs containing negative edges.

## 13. Priority Queue Requirement

The algorithm needs repeated minimum extraction.

A binary min-heap gives approximately:

```text
insert: O(log V)
extract-min: O(log V)
```

for the standard lazy-duplicate implementation.

## 14. Complexity with Binary Heap

For adjacency lists and lazy heap entries:

```text
O((V + E) log V)
```

Often simplified to:

```text
O(E log V)
```

for connected graphs where `E >= V-1`.

Auxiliary space is `O(V + E)` if graph storage is included; traversal state and heap state are `O(V + E)` under lazy duplicate insertion in the worst case.

## 15. Complexity with a Simple Array

If the next minimum vertex is found by scanning all vertices:

```text
O(V² + E)
```

This can be competitive for dense graphs or very small graphs because it avoids heap overhead.

## 16. Dense vs Sparse Graphs

Representation and workload matter.

- sparse graph + binary heap: usually attractive
- dense graph + array selection: can be reasonable
- integer weights with special structure: specialized queues may outperform generic heaps

Algorithm selection should be workload-driven.

## 17. Path Reconstruction

Store `parent[v]` whenever `distance[v]` improves.

After reaching a target, follow:

```text
 target → parent[target] → ... → source
```

and reverse the sequence.

## 18. Single Target

If only one target is required, Dijkstra can terminate once the target is extracted with its non-stale minimum distance.

Do not terminate merely because the target was inserted into the heap; its distance may still improve.

## 19. Early Termination Correctness

The target is safe to return when it is extracted as the minimum non-stale candidate because the Dijkstra finalization invariant applies at that point.

## 20. Unreachable Vertices

Vertices that remain at `Infinity` are unreachable from the source.

The API should define whether it returns `Infinity`, `null`, or another explicit representation.

## 21. Multiple Shortest Paths

Equal-cost paths can exist.

A normal parent array stores one chosen predecessor. If all shortest paths are needed, additional predecessor sets and potentially exponential output are required.

## 22. Counting Shortest Paths

Maintain `ways[source] = 1`.

When a strictly shorter distance is found:

```text
ways[v] = ways[u]
```

When an equally short distance is found:

```text
ways[v] += ways[u]
```

For nonnegative graphs, careful handling is needed around zero-weight edges and the distinction between counting paths and counting simple paths.

## 23. Zero-Weight Edges

Dijkstra supports zero-weight edges.

They preserve nonnegative monotonicity but can create many equal-distance relationships.

Do not assume every extracted vertex has a strictly greater distance than the previous one.

## 24. Negative Edges Boundary

Use algorithms designed for negative weights, such as Bellman-Ford, when negative edges are possible.

If the graph is a DAG, topological-order relaxation can also solve shortest paths even with negative edge weights because cycles are absent.

## 25. Directed vs Undirected Weighted Graphs

For directed graphs, an edge `u → v` only permits movement in that direction.

For undirected weighted graphs, an edge `{u,v}` normally contributes the same weight in both directions.

Explicitly model whichever semantics the problem requires.

## 26. Heap Comparator

The priority queue must order by tentative distance.

If deterministic behavior is required, define tie-breaking explicitly, such as vertex ID.

Tie-breaking affects which shortest path is selected but not the shortest distance.

## 27. Indexed Heap vs Lazy Heap

Two common designs:

**Lazy heap:** insert new entries and skip stale entries.

**Indexed heap:** maintain each vertex's heap position and support priority decrease/update.

Lazy heaps are often simpler; indexed heaps can reduce duplicate entries but require more bookkeeping.

## 28. Decrease-Key

The textbook version often describes `decreaseKey`.

JavaScript implementations frequently avoid explicit decrease-key by pushing a new candidate.

This is an engineering choice, not a change to the mathematical algorithm.

## 29. Dijkstra and A*

A* extends Dijkstra by adding a heuristic:

```text
priority(v) = g(v) + h(v)
```

Dijkstra corresponds to `h(v) = 0`.

The heuristic and admissibility/consistency conditions will be studied with advanced search algorithms.

## 30. Backend Application: Network Routing

Edges can represent network links and weights can represent latency or cost.

Dijkstra can compute minimum-cost routes when link costs are nonnegative and the graph model is appropriate.

Real routing also includes dynamic state, policies, capacity, and failure handling.

## 31. Backend Application: Service Graphs

A service dependency graph can assign estimated latency or operational cost to transitions.

Dijkstra can identify minimum-cost dependency paths for diagnostics or optimization.

## 32. Backend Application: Workflow Optimization

Workflow transitions can carry durations or costs.

Dijkstra can find a minimum-cost route through a state graph when all transition costs are nonnegative.

## 33. AI Application: Uniform-Cost Search

Dijkstra's algorithm is closely related to **Uniform-Cost Search (UCS)**.

Both expand the lowest accumulated path cost first.

In AI, the state representation and duplicate detection policy are as important as the priority queue.

## 34. AI Application: Planning

Actions can have nonnegative costs:

```text
state --action cost--> next state
```

Dijkstra/UCS finds minimum-cost plans under the graph/search model.

## 35. AI Application: Knowledge Graph Paths

Edges can encode confidence-derived cost, distance, or traversal penalties.

A shortest weighted path can then support cost-aware graph navigation, provided the cost model is explicitly defined.

## 36. Memory Engineering

For large graphs:

- store adjacency compactly
- avoid full path copies
- use parent arrays
- use typed arrays for integer IDs where appropriate
- consider heap entry duplication under lazy updates

## 37. Numerical Safety in JavaScript

If weights and accumulated distances can exceed safe integer precision, ordinary `Number` arithmetic may become unsafe.

Possible strategies include:

- bounding input values
- using `BigInt` where appropriate
- using decimal/arbitrary-precision representations when domain requirements demand them

The numeric representation is part of algorithm correctness.

## 38. Edge Validation

Production implementations should define whether weights must be:

```text
finite
numeric
>= 0
```

Rejecting invalid weights early prevents silent violations of Dijkstra's assumptions.

## 39. Testing Strategy

Test:

- one vertex
- disconnected vertices
- simple weighted chain
- competing routes
- zero-weight edges
- duplicate edges
- directed graphs
- undirected graphs
- unreachable target
- source equals target
- large weights
- negative-weight rejection

## 40. Differential Testing

For small graphs with nonnegative weights, compare Dijkstra against an independent reference such as exhaustive simple-path enumeration.

For each reachable target, verify the reported distance equals the minimum reference cost.

## 41. Property Testing

Useful properties:

- `distance[source] = 0`
- every reconstructed path consists of valid edges
- reconstructed path cost equals reported distance
- `distance[v] <= distance[u] + w(u,v)` for every reachable edge
- no reachable vertex has a finite distance larger than a valid path cost

## 42. Adversarial Workloads

Use:

- long chains
- huge stars
- dense graphs
- many zero-weight edges
- many duplicate heap entries
- highly unequal edge weights
- unreachable regions
- large numeric weights

## 43. Common Mistakes

- using Dijkstra with negative edges
- marking a vertex permanently when it is first inserted rather than when its minimum is finalized
- stopping when the target is merely discovered
- forgetting stale heap entries
- storing full paths in every heap entry
- assuming shortest distance means fewest edges
- ignoring numeric precision

## 44. Interview Framework

For “shortest path with nonnegative weights”:

1. identify weighted edges
2. verify weights are nonnegative
3. choose Dijkstra
4. initialize distance/source
5. use a min-priority queue
6. relax edges
7. handle stale entries
8. store parents if reconstruction is required
9. prove the finalization invariant
10. derive complexity
11. explain negative-weight boundary

## 45. Revision Checklist

- [ ] Explain weighted shortest paths.
- [ ] Explain why BFS fails for arbitrary weights.
- [ ] Implement Dijkstra with a binary min-heap.
- [ ] Implement relaxation correctly.
- [ ] Handle stale heap entries.
- [ ] Reconstruct shortest paths.
- [ ] Support early target termination.
- [ ] Handle unreachable vertices.
- [ ] Handle zero-weight edges.
- [ ] Explain the negative-edge boundary.
- [ ] Compare lazy and indexed heaps.
- [ ] Analyze sparse vs dense implementations.
- [ ] Apply Dijkstra to backend routing.
- [ ] Relate Dijkstra to AI uniform-cost search.
- [ ] Test correctness and numeric safety.

## Key Takeaways

1. Dijkstra solves single-source shortest paths with nonnegative edge weights.
2. Relaxation is the central operation.
3. The priority queue selects the smallest tentative distance.
4. A vertex is final only when its minimum non-stale candidate is extracted.
5. Lazy heaps trade duplicate entries for simpler implementation.
6. Negative edges violate Dijkstra's core correctness assumption.
7. Dijkstra is the graph-theoretic foundation of uniform-cost search.
