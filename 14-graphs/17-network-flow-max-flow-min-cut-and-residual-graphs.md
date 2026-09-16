# 14.17 — Network Flow: Max Flow, Min Cut & Residual Graphs

## 1. Concept Definition

A **flow network** is a directed graph with capacities on edges, a source `s`, and a sink `t`.

A flow must satisfy:

- capacity constraints
- flow conservation at every intermediate vertex

The **maximum-flow problem** asks for the greatest possible flow from `s` to `t`.

## 2. Why It Matters

Network flow models:

- resource allocation
- routing
- matching
- scheduling
- transportation
- bandwidth allocation
- assignment systems

## 3. Flow Variables

For each directed edge `(u,v)` with capacity `c(u,v)`:

```text
0 <= f(u,v) <= c(u,v)
```

For every vertex except source and sink:

```text
incoming flow = outgoing flow
```

## 4. Flow Value

The value of a flow is the net flow leaving the source, equivalently the net flow entering the sink.

## 5. Residual Graph

The residual graph describes additional flow that can still be sent.

For a forward edge:

```text
residual = capacity - currentFlow
```

A reverse residual edge represents the ability to undo previously routed flow.

## 6. Why Reverse Edges Exist

A previous routing decision may block a better global solution.

Reverse residual capacity allows an algorithm to cancel or reroute earlier flow.

This is the key idea behind augmenting-path algorithms.

## 7. Augmenting Path

An augmenting path is a source-to-sink path in the residual graph containing only positive-capacity residual edges.

The amount that can be added is the minimum residual capacity along that path:

```text
bottleneck = min(residual edge capacities)
```

## 8. Ford-Fulkerson

Ford-Fulkerson repeatedly:

1. finds an augmenting path
2. computes its bottleneck
3. augments the flow
4. updates residual capacities

With integer capacities, each augmentation increases flow by at least one, giving a finite termination argument.

## 9. Edmonds-Karp

Edmonds-Karp chooses augmenting paths using BFS, minimizing the number of edges in the residual path.

For standard adjacency-list implementations its worst-case complexity is:

```text
O(VE^2)
```

## 10. Dinic's Algorithm

Dinic builds a **level graph** using BFS and then sends a blocking flow using DFS-style augmentations.

The standard general bound is:

```text
O(V^2 E)
```

with stronger bounds for important graph/capacity classes.

## 11. Level Graph

BFS assigns:

```text
level[v] = shortest residual edge distance from s
```

Only edges satisfying:

```text
level[v] = level[u] + 1
```

are eligible in the level graph.

## 12. Blocking Flow

A blocking flow saturates the level graph in the sense that no additional source-to-sink path remains within the current level graph.

Dinic repeatedly constructs a new level graph until the sink becomes unreachable.

## 13. Current-Arc Optimization

During Dinic DFS, remember the next outgoing edge that may still carry useful flow.

This avoids repeatedly scanning edges that are already exhausted or lead to invalid levels.

## 14. Edge Representation

A practical implementation stores paired forward/reverse edges:

```text
edge.to
edge.rev
edge.cap
```

When one edge's capacity changes, its reverse edge must be updated consistently.

## 15. Flow Invariants

For every residual edge pair:

```text
forward residual + actual reverse relation
```

must remain consistent.

At intermediate vertices, net flow must remain zero.

## 16. Max-Flow Min-Cut Theorem

The maximum flow value equals the capacity of a minimum `s-t` cut.

This provides both an optimality theorem and a certificate for a computed maximum flow.

## 17. Cut Definition

An `s-t` cut partitions vertices into:

```text
S containing s
T containing t
```

Its capacity is the sum of capacities of edges directed from `S` to `T`.

## 18. Extracting a Minimum Cut

After maximum flow terminates, run reachability from `s` in the final residual graph using positive-capacity residual edges.

Reachable vertices form `S`; unreachable vertices form `T`.

The crossing original edges form a minimum cut under standard assumptions.

## 19. Optimality Certificate

A useful production/debugging result is:

```text
maxFlowValue === minCutCapacity
```

If both match, the flow is certified optimal by the max-flow min-cut theorem.

## 20. Integral Flow Property

With integer capacities, standard augmenting-path algorithms can produce an integral maximum flow.

This is important for discrete assignment and routing models.

## 21. Bipartite Matching

Maximum bipartite matching can be reduced to flow:

```text
source → left vertices → right vertices → sink
```

with capacity `1` on matching edges.

## 22. Vertex Capacities

A vertex-capacity constraint can be modeled by splitting each vertex:

```text
v_in → v_out
```

with capacity equal to the vertex capacity.

Incoming edges target `v_in`; outgoing edges originate from `v_out`.

## 23. Multiple Sources and Sinks

Introduce a super-source connected to every original source and a super-sink connected from every original sink.

Capacities encode how much flow each endpoint can supply or receive.

## 24. Lower Bounds Preview

Some flow problems require every edge to carry at least a lower bound.

Such **circulation with lower bounds** requires additional demand-balance transformations and feasibility analysis.

## 25. Min-Cost Flow Boundary

Maximum flow optimizes quantity subject to capacities.

**Min-cost flow** additionally optimizes the cost of sending flow.

Do not treat the two objectives as interchangeable.

## 26. Residual Reachability

Residual reachability is useful for:

- minimum cut extraction
- debugging
- identifying saturated bottlenecks
- sensitivity analysis

## 27. Capacity Scaling Preview

Capacity-scaling max-flow algorithms focus on augmenting paths with large residual capacity first.

This can improve practical performance and yields alternative theoretical bounds.

## 28. Numerical Safety

For large capacities, JavaScript implementations must choose numeric representations carefully.

If exact integer values can exceed `Number.MAX_SAFE_INTEGER`, use `BigInt` or another exact representation with a consistent API.

## 29. Backend Application: Bandwidth Allocation

Services can be modeled as nodes and communication channels as capacity-constrained edges.

Max flow estimates the maximum transferable quantity under the modeled network.

## 30. Backend Application: Resource Allocation

Flow networks can assign limited resources to consumers through intermediate capacity constraints.

Bipartite matching is a common special case.

## 31. Backend Application: Deployment/Job Assignment

Workers, jobs, regions, or quotas can be represented using flow networks when constraints are naturally capacity-based.

Production systems additionally need priorities, latency, failures, and transactional semantics.

## 32. AI Application: Assignment

Candidate-to-task assignment can be represented as a capacity network.

Maximum flow determines the largest feasible assignment under hard capacity constraints.

## 33. AI Application: Dataset/Cluster Allocation

Capacity-constrained allocation of samples, tasks, or compute resources can use flow formulations when the relationships are bipartite or network-like.

## 34. AI Application: Graph Optimization

Flow can model constrained routing and selection problems inside larger AI pipelines.

The graph semantics must be explicit; not every optimization problem is naturally a flow problem.

## 35. Complexity Selection

Choose among:

```text
Ford-Fulkerson
Edmonds-Karp
Dinic
capacity scaling
specialized matching algorithms
```

based on graph structure, capacity domain, density, and required guarantees.

## 36. Correctness — Augmentation

Augmenting along a residual path preserves:

- capacity feasibility
- flow conservation

because flow is increased along the path and reverse residual capacity records the ability to undo that change.

## 37. Correctness — Termination

For integer capacities, every augmentation increases total flow by a positive integer.

Ford-Fulkerson therefore terminates after finitely many augmentations when capacities are integral.

## 38. Correctness — Maximum Flow

If no augmenting path remains, the vertices reachable from `s` in the residual graph define an `s-t` cut whose crossing edges are saturated.

The current flow equals that cut capacity, so by the max-flow min-cut theorem it is maximum.

## 39. Testing Strategy

Test:

- zero capacities
- single edge
- parallel edges
- bottlenecks
- disconnected sink
- multiple augmenting paths
- rerouting through reverse edges
- integer capacities
- large capacities
- bipartite matching reductions

## 40. Differential Testing

For small networks, compare implementations such as Edmonds-Karp and Dinic.

Compare maximum flow values and validate flow conservation/capacity constraints.

## 41. Property Testing

Validate:

- every edge flow respects capacity
- conservation holds at intermediate vertices
- source/sink flow value is consistent
- residual reverse edges are consistent
- extracted cut separates source and sink
- max-flow value equals cut capacity

## 42. Adversarial Testing

Use:

- long augmenting paths
- layered networks
- many parallel edges
- narrow bottlenecks
- dense residual graphs
- zero-capacity edges
- graphs designed to require rerouting

## 43. Benchmarking

Measure:

- BFS/DFS scans
- augmentations
- residual edge updates
- heap/bucket overhead where used
- memory usage
- dense vs sparse behavior

## 44. Common Mistakes

- forgetting reverse residual edges
- confusing capacity with current flow
- updating only the forward edge
- violating conservation
- stopping after one augmenting path
- using BFS on the original graph instead of the residual graph
- extracting the cut from the wrong graph
- using unsafe JavaScript numbers for huge exact capacities

## 45. Interview Framework

For “maximum flow”:

1. define source, sink, and capacities
2. explain residual graphs
3. explain augmenting paths
4. choose Ford-Fulkerson, Edmonds-Karp, or Dinic
5. implement forward/reverse edges
6. state flow invariants
7. derive complexity
8. explain min-cut extraction
9. connect to matching or capacity allocation

## 46. Revision Checklist

- [ ] Define a flow network.
- [ ] Explain capacity and conservation constraints.
- [ ] Build a residual graph.
- [ ] Explain reverse edges.
- [ ] Implement an augmenting-path method.
- [ ] Implement Edmonds-Karp.
- [ ] Understand Dinic's level graph.
- [ ] Understand blocking flow.
- [ ] Extract a minimum cut.
- [ ] Prove max-flow/min-cut optimality.
- [ ] Reduce bipartite matching to flow.
- [ ] Understand vertex splitting.
- [ ] Understand lower-bound/min-cost-flow boundaries.
- [ ] Handle large exact capacities safely in JavaScript.

## Key Takeaways

1. Maximum flow finds the greatest feasible source-to-sink flow.
2. Residual reverse edges enable global rerouting of previous decisions.
3. Edmonds-Karp uses BFS augmenting paths.
4. Dinic combines BFS level graphs with blocking flows.
5. Max-flow min-cut gives a powerful optimality certificate.
6. Matching, assignment, routing, and capacity problems often reduce to flow.
