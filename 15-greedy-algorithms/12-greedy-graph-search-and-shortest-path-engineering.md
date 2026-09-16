# 15.12 — Greedy Graph Search & Shortest-Path Engineering

## 1. Concept Definition

Greedy graph search chooses the currently most promising frontier state according to a local priority rule.

Shortest-path engineering is broader than memorizing one algorithm: it requires selecting the correct graph model, objective, representation, frontier structure, termination rule, and correctness assumptions.

## 2. Why It Exists

Many production problems look like “find the shortest route,” but their constraints differ:

- unweighted edges
- non-negative weighted edges
- negative edges
- changing weights
- one target
- all destinations
- many sources
- heuristic information
- memory limits

Algorithm selection must follow these properties.

## 3. Core Decision Model

Ask in order:

1. Is the graph directed or undirected?
2. Are edge costs uniform, non-negative, or possibly negative?
3. Is the objective shortest path or minimum spanning structure?
4. Is there one source, many sources, or all pairs?
5. Is there a target?
6. Is a useful heuristic available?
7. Are costs static or dynamic?

## 4. Unweighted Shortest Path

For equal unit-cost edges, BFS explores vertices in nondecreasing number of edges from the source.

Its FIFO queue naturally produces shortest-path layers.

## 5. Non-Negative Weighted Shortest Path

Dijkstra generalizes BFS by replacing the FIFO frontier with a minimum-cost priority queue.

The greedy choice is the smallest tentative source distance.

## 6. Heuristic Weighted Search

A* adds a heuristic:

```text
f = g + h
```

This uses target information while retaining an optimality guarantee when the required heuristic assumptions hold.

## 7. Greedy Best-First Search

Greedy best-first search uses:

```text
f = h
```

It prioritizes apparent closeness to the target but does not generally minimize path cost.

## 8. Negative Edges

Dijkstra and standard A* assumptions do not permit arbitrary negative transition costs.

Bellman-Ford can handle negative edges and can detect reachable negative cycles.

## 9. Negative Cycles

A reachable negative cycle means the shortest distance to affected destinations can be unbounded below.

The problem must therefore distinguish:

```text
finite shortest path
unreachable
negative-cycle affected
```

## 10. All-Pairs Shortest Paths

For all-pairs requirements, repeated single-source algorithms or dynamic-programming approaches such as Floyd-Warshall may be appropriate depending on graph density and size.

## 11. Multi-Source Search

Multi-source shortest path initializes the frontier with several sources at distance zero.

This is equivalent to connecting all sources to a conceptual super-source with zero-cost edges under the appropriate model.

## 12. Reverse-Graph Search

For directed graphs, searching backward from a target requires reversing edges.

This can turn “distance from every node to one target” into one-source shortest-path computation on the reversed graph.

## 13. Early Termination

For a single target, do not compute unnecessary destinations if the algorithm's correctness proof permits stopping when the target reaches its final extraction condition.

The exact condition depends on the algorithm.

## 14. Path Reconstruction

Distance computation and path reconstruction are separate concerns.

Store a predecessor or parent pointer when a relaxation improves a state.

Then reconstruct only when the actual path is requested.

## 15. Frontier Engineering

The frontier data structure strongly affects performance.

Possible structures include:

- FIFO queue
- binary min-heap
- indexed/decrease-key heap
- bucket queue
- radix heap for suitable integer weights
- specialized monotone queues

## 16. Integer Weight Optimization

When edge weights are small non-negative integers, bucket-based methods can sometimes outperform comparison-based heaps.

The data distribution and maximum weight range determine whether this is useful.

## 17. Stale Entries

Lazy heaps often contain obsolete entries after better distances are discovered.

The implementation must detect and discard them rather than processing outdated state.

## 18. Tie-Breaking

Equal-priority states can be processed in different orders.

Tie-breaking may affect:

- number of expansions
- selected predecessor tree
- deterministic output
- cache behavior

It should be explicit when reproducibility matters.

## 19. Graph Representation

Adjacency lists are usually preferable for sparse graphs because traversal follows existing edges.

Adjacency matrices can be useful for dense graphs or simple `O(V²)` implementations.

## 20. Memory Engineering

A production graph search may store:

```text
adjacency
costs
distances
predecessors
visited/closed state
priority queue
metadata
```

Memory can become the limiting resource before arithmetic work does.

## 21. Backend Routing Model

Suppose services are vertices and network latency is edge cost.

Shortest-path algorithms can find a low-latency route, but production routing may also need:

- capacity
- failures
- time variation
- policy constraints
- retries
- regional rules
- multi-objective cost

The mathematical model must match the real routing objective.

## 22. Dependency Graphs

Build systems and service dependency graphs can use graph traversal to find reachable dependencies, critical chains, or minimum-cost routes through weighted relationships.

Do not confuse dependency ordering with shortest-path optimization.

## 23. Workflow Planning

A workflow can be modeled as states and transitions.

If each transition has an additive cost, shortest-path algorithms can find a least-cost valid sequence.

Additional constraints may require state augmentation or a different optimization method.

## 24. AI State-Space Search

AI planning can represent configurations as states and actions as weighted transitions.

BFS, Dijkstra, uniform-cost search, A*, or other methods can then be selected based on the transition model and available heuristic information.

## 25. Retrieval Graphs

Graph-based retrieval can assign edge costs representing semantic distance, traversal cost, or another additive objective.

The search algorithm is only as meaningful as the cost model behind those weights.

## 26. State Augmentation

When a constraint depends on history, augment the state.

For example:

```text
(vertex, remainingBudget)
(vertex, numberOfTransfers)
(vertex, resourceMode)
```

This transforms a constrained path problem into a larger state-space search.

## 27. Product-State Explosion

State augmentation can multiply the number of states.

A solution that is mathematically correct may become operationally infeasible.

Always estimate the resulting state-space size before implementation.

## 28. Multi-Criteria Routing

Latency, cost, reliability, and bandwidth may conflict.

A single scalar edge weight requires an explicit aggregation policy.

Without one, “shortest” is not mathematically well-defined.

## 29. Pareto Frontiers

If multiple objectives must remain separate, the solution may require maintaining nondominated labels rather than one distance per vertex.

This is substantially more complex than ordinary Dijkstra.

## 30. Dynamic Edge Costs

If weights change while searching, a previously computed shortest path may become invalid.

Use incremental or replanning methods when the environment requires continuous updates.

## 31. Caching

Repeated routing queries can reuse graph preprocessing, heuristic data, or cached routes.

Cache invalidation must account for topology and edge-weight changes.

## 32. Bidirectional Search

For a single source-target query, bidirectional methods can reduce explored regions.

However, termination and correctness conditions must be derived rather than assuming that the first meeting point is optimal.

## 33. Correctness Invariant

At every stage, maintain an explicit statement of what the stored frontier values mean.

Examples:

- BFS distance = minimum number of edges discovered
- Dijkstra tentative distance = cost of a known source path
- A* `g` = cost of a known source path

Clear invariants prevent subtle implementation errors.

## 34. Correctness Before Optimization

Before adding specialized heaps, caching, parallelism, or early termination:

1. implement a simple reference algorithm
2. prove the core invariant
3. build differential tests
4. benchmark realistic workloads
5. optimize only measured bottlenecks

## 35. Differential Testing Matrix

Useful reference comparisons include:

| Algorithm | Reference Against |
|---|---|
| BFS | Dijkstra with unit weights |
| Dijkstra | Bellman-Ford on non-negative graphs |
| A* | Dijkstra with admissible heuristic |
| MST algorithms | each other + brute force for tiny graphs |

Compare costs and validity, not necessarily identical paths.

## 36. Adversarial Testing

Test:

- disconnected graphs
- zero-cost edges
- equal-cost paths
- parallel edges
- self-loops
- very long paths
- dense graphs
- sparse graphs
- stale heap entries
- unreachable targets
- extreme weights
- malformed graph data

## 37. Numeric Engineering in JavaScript

`Number` uses IEEE-754 double precision.

Large integer path costs may lose exactness.

When exact integer arithmetic is required and values fit the intended model, consider `BigInt` and design the priority queue accordingly.

## 38. Observability

Production graph search should expose useful metrics:

- nodes generated
- nodes expanded
- edges relaxed
- queue operations
- maximum frontier size
- search duration
- result cost
- cache hit rate
- failure reason

## 39. Failure Semantics

A production API should distinguish at least:

```text
success
no path
invalid graph
unsupported weight model
resource limit exceeded
cancelled
```

Do not collapse every failure into “no route.”

## 40. Resource Limits

Large searches should support bounded execution when appropriate:

- maximum expansions
- maximum memory
- deadline
- cancellation signal

Returning a partial search state may be preferable to silently timing out.

## 41. Testing Properties

Useful properties include:

- source distance equals zero
- returned path starts at source
- returned path ends at target
- path cost equals reported cost
- every path edge exists
- unreachable target has no finite path
- non-negative shortest distances satisfy triangle inequalities along edges

## 42. Benchmarking

Measure more than asymptotic complexity.

Record:

- graph density
- degree distribution
- weight distribution
- query count
- cache state
- heap size
- memory consumption
- latency distribution

## 43. Algorithm Selection Summary

```text
unit edges              -> BFS
non-negative weights    -> Dijkstra
non-negative + heuristic-> A*
negative edges          -> Bellman-Ford family
all pairs / dense       -> consider Floyd-Warshall
MST objective           -> Kruskal / Prim / Borůvka
```

This is a starting decision tree, not a substitute for analyzing constraints.

## 44. Common Mistakes

- choosing an algorithm from the problem title instead of its mathematical model
- confusing shortest path with MST
- ignoring negative edges
- assuming a heuristic is valid without proving it
- terminating too early
- forgetting stale priority-queue entries
- treating a constrained path as an ordinary vertex-only state
- optimizing before measuring
- ignoring memory and cancellation

## 45. Interview Framework

For a graph-search design question:

1. formalize vertices, edges, and cost
2. identify the optimization objective
3. classify edge weights
4. determine source/target requirements
5. choose graph representation
6. choose frontier structure
7. define state and invariants
8. prove correctness under assumptions
9. derive complexity
10. discuss edge cases
11. add differential tests
12. discuss production constraints

## 46. Revision Checklist

- [ ] Choose BFS for unit-cost shortest paths.
- [ ] Choose Dijkstra for non-negative weighted shortest paths.
- [ ] Explain A* through `g + h`.
- [ ] Explain negative-edge boundaries.
- [ ] Explain multi-source and reverse-graph search.
- [ ] Understand stale priority-queue entries.
- [ ] Reconstruct paths correctly.
- [ ] Understand state augmentation.
- [ ] Recognize multi-objective routing limitations.
- [ ] Design differential and adversarial tests.
- [ ] Account for JavaScript numeric precision.
- [ ] Design production observability and resource limits.

## Key Takeaways

1. Graph-search engineering begins with a precise mathematical model.
2. BFS, Dijkstra, A*, and Bellman-Ford differ primarily because their assumptions and objectives differ.
3. Frontier data structures and graph representation materially affect performance.
4. Real backend and AI routing often require state augmentation, dynamic costs, or multiple objectives.
5. Correctness proofs, differential testing, benchmarking, and observability are part of production algorithm engineering—not optional extras.
