# 40 — Functional Graph DP: Cycles, In-Trees & Repeated Transitions

## 1. What Is a Functional Graph?

A functional graph is a directed graph in which every vertex has exactly one outgoing edge:

```text
next[u] = v
```

Therefore, every node has a unique forward trajectory:

```text
u → next[u] → next[next[u]] → ...
```

With finitely many vertices, every trajectory eventually enters a directed cycle.

The graph therefore decomposes into:

```text
in-trees → directed cycle ← in-trees
```

This special structure makes many apparently cyclic problems reducible to tree DP + cycle processing.

---

## 2. Why Functional Graphs Matter for DP

General cyclic graphs can make ordinary acyclic DP invalid. A functional graph is special because each node has only one outgoing dependency.

Typical questions include:

- where does a node eventually end up?
- how many steps reach a cycle?
- what cycle is reached?
- what is the value after exactly `k` transitions?
- what is the sum/max/min over the first `k` visited states?
- what is the best state reachable from every node?
- how can repeated applications of `next` be accelerated?

The main tools are:

```text
cycle decomposition
+ reverse trees
+ tree DP
+ binary lifting
+ cycle prefix/sparse aggregation
```

---

## 3. Decomposition Into Cycles and Trees

Every weakly connected component of a functional graph contains exactly one directed cycle.

Nodes not on the cycle form directed trees whose edges point toward that cycle.

Example:

```text
0 → 1 → 2 → 3 → 1
        ↑
        4 → 2
```

The cycle is `1 → 2 → 3 → 1`.

Node `0` and `4` lie in in-trees feeding the cycle.

This gives two natural processing directions:

- process trees toward the cycle;
- process the cycle separately.

---

## 4. Detecting Cycle Nodes

A robust global technique uses indegree peeling:

1. compute indegree of every node;
2. enqueue all zero-indegree nodes;
3. repeatedly remove them and decrement the indegree of their unique successor;
4. vertices left after peeling are exactly cycle vertices.

This is a functional-graph version of topological pruning.

The total work is `O(n)`.

---

## 5. Alternative Cycle Detection

For a single starting node, Floyd's tortoise-and-hare algorithm can detect the cycle using `O(1)` extra memory.

It separates:

- tail length `μ`;
- cycle length `λ`.

This is useful when the graph is implicit and only one trajectory matters.

For all-node preprocessing, indegree peeling is usually more useful because it produces a global cycle/non-cycle classification.

---

## 6. Reverse Adjacency

Build reverse edges:

```text
rev[v] = all u such that next[u] = v
```

Every node can have many reverse children, but every node has exactly one forward parent.

After identifying cycle vertices, remove cycle-to-cycle reverse edges from tree traversal and process the remaining reverse trees.

This converts the non-cycle portion into ordinary rooted trees whose roots are cycle vertices.

---

## 7. Distance to the Cycle

Define:

```text
dist[u] = number of transitions needed to reach any cycle node
```

Then:

```text
dist[cycleNode] = 0

dist[u] = 1 + dist[next[u]]
```

for every non-cycle node.

This can be computed in reverse topological order from indegree peeling.

Once `dist[u]` is known, repeated-transition queries become much easier to reason about.

---

## 8. Component and Cycle Identification

Every node eventually reaches exactly one cycle.

Store:

```text
component[u]
cycleId[u]
cyclePosition[u]
cycleLength[cycleId]
```

For a non-cycle node, `cycleId[u]` is the cycle reached by following `next` repeatedly.

A tree DP can propagate the cycle identifier backward from cycle roots.

---

## 9. Basic Tree DP on Functional In-Trees

Suppose each node has a value `w[u]`.

A common state is:

```text
subtreeSum[u]
```

where the subtree means all nodes that eventually flow through `u` before reaching the cycle.

For a non-cycle node:

```text
subtreeSum[u] = w[u] + Σ subtreeSum[v]
```

where `v` ranges over reverse children that are not cycle edges.

This is ordinary tree DP hidden inside a directed cyclic structure.

---

## 10. Tree Height / Longest Tail

Define:

```text
height[u] = longest number of reverse-tree edges below u
```

or, depending on the problem,

```text
far[u] = maximum distance from a descendant to u
```

Reverse-tree postorder produces these values in linear time.

Be precise about direction because "depth" and "height" are commonly reversed in functional-graph problems.

---

## 11. Maximum Distance to a Target Cycle

If the cycle is treated as a terminal boundary, every non-cycle node has a unique forward path to that cycle.

Therefore the forward distance is not a shortest-path problem at all:

```text
dist[u] = 1 + dist[next[u]]
```

The uniqueness of the outgoing edge removes branching in the forward direction.

---

## 12. K-Step Transition Queries

The operation

```text
next^k(u)
```

means applying `next` exactly `k` times.

Binary lifting stores:

```text
up[j][u] = next^{2^j}(u)
```

with recurrence:

```text
up[j][u] = up[j-1][ up[j-1][u] ]
```

Then a `k`-step query takes `O(log k)` time after `O(n log K)` preprocessing for the maximum required jump size.

---

## 13. Binary Lifting Is DP on Powers

Binary lifting is itself a dynamic program:

```text
2^j transition
= two consecutive 2^(j-1) transitions
```

The state is `(j, u)` and the dependency is `(j-1, ...)`.

This is an important bridge between DP, functional graphs, and ancestor-query techniques.

---

## 14. Aggregated Binary Lifting

Store not only the destination but also an aggregate along the jump.

For example:

```text
up[j][u]
mx[j][u]
sum[j][u]
```

where `sum[j][u]` is the total node weight over the corresponding `2^j` transitions.

The transition becomes:

```text
mid = up[j-1][u]
up[j][u] = up[j-1][mid]
sum[j][u] = sum[j-1][u] + sum[j-1][mid]
```

This pattern generalizes to any associative aggregate with a suitable identity.

---

## 15. Handling the Cycle

Binary lifting works across cycles too, but cycle-specific structure is often much faster for large repeated queries.

Once a query reaches the cycle:

```text
remainingSteps >> cycleLength
```

can be reduced modulo the cycle length for destination queries.

For additive aggregates, cycle prefix sums can answer long cycle segments quickly.

---

## 16. Cycle Prefix Sums

For a cycle ordered as:

```text
c0 → c1 → ... → c(L-1) → c0
```

build a prefix representation of cycle values.

Then the sum over a cycle arc can be computed by splitting the wrapped interval into at most two ordinary ranges.

For very large `k`, decompose:

```text
k = qL + r
```

so:

```text
cycleSum(k) = q * totalCycleSum + sumOfFirstRSteps
```

This turns huge-horizon cycle aggregation into constant-time arithmetic after preprocessing.

---

## 17. Maximum/Minimum Over Long Cycle Walks

Sums are not the only aggregate.

For max/min, use:

- cycle range-query structures;
- doubling tables with max/min;
- sparse tables for static cycle ranges.

Unlike sum, repeating a cycle does not necessarily increase a maximum after the first full cycle. The recurrence must reflect the actual aggregate semantics.

---

## 18. Eventual Periodicity

For deterministic transitions on a finite state space, trajectories are eventually periodic:

```text
prefix + repeating cycle
```

Therefore many infinite-horizon questions reduce to:

```text
finite prefix
+ cycle summary
```

This is one of the most important structural facts behind fast functional-graph algorithms.

---

## 19. Huge K

When `k` can be extremely large, ordinary simulation is impossible.

Choose the representation according to the query:

```text
Destination only       → binary lifting / cycle arithmetic
Sum over first k      → lifting + cycle prefix sums
Min/max over first k  → lifting + cycle range queries
Count visits          → cycle decomposition + arithmetic
Repeated linear state → matrix/operator methods when appropriate
```

The point is not to memorize one universal method. Exploit the eventual periodic structure.

---

## 20. Counting How Many Nodes Reach Each Cycle

For every cycle, count all nodes whose trajectory enters it.

This is a tree-subtree aggregation problem:

```text
count[u] = 1 + Σ count[v]
```

for non-cycle tree nodes.

Summing `count[c]` over cycle roots gives the component size.

The same technique answers the number of nodes reaching each cycle or each particular cycle position after a specified number of transitions.

---

## 21. Functional Graph Distance Between Nodes

The directed distance from `u` to `v` is finite only when `v` lies on the unique trajectory of `u`.

To solve queries:

1. identify component/cycle;
2. compare cycle membership or tree ancestry;
3. use depth/distance-to-cycle information;
4. use binary lifting for jumps.

A common trap is treating the graph as an ordinary undirected tree. The direction is part of the problem definition.

---

## 22. Meeting Point on a Functional Trajectory

Given two starts `u` and `v`, determine whether their trajectories eventually meet.

Within the same component, they may:

- merge in the same in-tree;
- arrive at the same cycle at different times;
- belong to different cycles and never meet.

A useful state description is:

```text
cycleId
cyclePosition
```

plus tree depth and binary lifting when the meeting point is on the in-tree portion.

---

## 23. Cycle-Tree DP for Global Objectives

Suppose every node contributes a value and we want an objective over the entire component.

Compute:

```text
cycle contribution
+ all attached tree contributions
```

The cycle itself is a ring, while each cycle position owns an attached rooted tree.

This creates a two-level decomposition:

```text
functional component
    ↓
cycle backbone
    ↓
independent tree summaries attached to each cycle node
```

Global optimization can then become a cycle DP over those summaries when adjacent cycle positions interact.

---

## 24. When the Cycle Becomes a DP Problem

If cycle nodes are independent, simple aggregation is enough.

If adjacent cycle nodes have compatibility constraints, the cycle becomes a small ring-DP problem.

For example:

```text
choose/not choose cycle position
```

with adjacency restrictions becomes a circular version of house-robber DP.

Break the cycle into two linear cases or explicitly track the first state's choice.

---

## 25. Functional Graph + State Machine

Sometimes the node transition is deterministic but the DP value has an additional state:

```text
dp[state][u]
```

The pair `(u, state)` forms another functional or finite-state transition system.

This is useful for:

- constrained repeated actions;
- automaton state attached to deterministic environments;
- periodic workflow simulation;
- game/state-machine transitions.

Always check the resulting state-space size before applying cycle decomposition.

---

## 26. Weighted Transitions

An edge `u → next[u]` may carry a cost.

Then:

```text
costToCycle[u] = edgeCost[u] + costToCycle[next[u]]
```

for non-cycle nodes.

Cycle prefix sums can store edge costs, not only node values.

This distinction matters when the query asks for cost of transitions rather than values of visited nodes.

---

## 27. Negative Weights and Infinite Horizons

A finite-horizon sum is always finite, but an infinite-horizon optimization over a cycle depends on the aggregation objective.

For additive reward:

- positive cycle total can cause unbounded growth in maximization;
- negative cycle total can matter analogously for minimization.

Do not assign an infinite-horizon answer without first defining whether the objective is bounded and whether arbitrary cycle repetition is allowed.

---

## 28. Sparse vs Dense Preprocessing

Binary lifting requires `O(n log K)` memory.

If queries have small actual `k`, memoized jumps or direct cycle arithmetic may be better.

For very large `n`, memory can dominate runtime. Use:

- compact typed arrays;
- only the required log levels;
- 32-bit indices where valid;
- chunked storage when necessary.

The optimal representation depends on both node count and maximum jump size.

---

## 29. Correctness Proofs

### Cycle decomposition
Indegree peeling removes every node that cannot belong to a directed cycle. Because each vertex has one outgoing edge, every remaining vertex lies on a cycle.

### Distance recurrence
For a non-cycle node, its unique outgoing edge leads to a state with one fewer transition to the cycle.

### Binary lifting
The `2^j` transition is exactly the composition of two `2^(j-1)` transitions.

### Cycle arithmetic
After one complete cycle of length `L`, the trajectory returns to the same cycle position, so destination state depends on `k mod L`; additive repeated aggregates can additionally use the number of complete revolutions.

---

## 30. Testing Strategy

Use independent oracles and structural checks.

Test:

- all nodes self-looping;
- one large cycle;
- a long chain entering one cycle;
- many trees feeding one cycle;
- multiple disconnected functional components;
- cycle length `1`;
- cycle length `2`;
- large `k`;
- `k = 0`;
- weighted edges;
- negative values where supported;
- random functional graphs.

For binary lifting, compare random queries against direct simulation for small `k`.

For cycle decomposition, verify every node reaches exactly one identified cycle.

---

## 31. Backend Applications

Functional graphs model deterministic relationships such as:

- redirect chains;
- canonical-parent mappings;
- recommendation successor graphs;
- deterministic workflow transitions;
- cache replacement pointers;
- finite-state service routing.

Production systems should bound `k`, validate node IDs, detect malformed successor arrays, and avoid rebuilding `O(n log K)` tables for one-off tiny queries.

---

## 32. AI Engineering Applications

Deterministic state transitions occur in:

- finite-state decoding;
- constrained action environments;
- deterministic simulators;
- planning over repeatedly applied transitions;
- state-machine rollouts.

Functional-graph decomposition is valuable when the learned or configured policy is deterministic. It lets long-horizon rollouts be summarized without simulating every step.

---

## 33. Interview Recognition Framework

When every state has exactly one next state, immediately ask:

1. Is this a functional graph?
2. Do I need all-node preprocessing or only one trajectory?
3. Can I decompose cycles and in-trees?
4. Is the query a repeated-transition problem?
5. Do I need `next^k`?
6. Can binary lifting answer it?
7. Can cycle arithmetic reduce huge `k`?
8. Is there an aggregate along the path?
9. Can tree DP summarize the non-cycle region?
10. Does the cycle itself require a ring DP?

---

## 34. Master Pattern

```text
Exactly one outgoing edge
          ↓
Functional graph
          ↓
Detect cycles
          ↓
Build reverse trees
          ↓
Process tree DP
          ↓
Identify component / cycle position
          ↓
Choose query accelerator
   ↙          ↓          ↘
binary       cycle      cycle +
lifting      arithmetic ring DP
   ↓            ↓           ↓
fast repeated-transition queries
          ↓
prove + differential-test
```

The central insight is that a functional graph is not an arbitrary cyclic graph. Its deterministic successor structure forces every trajectory into a **finite tail followed by a periodic cycle**, and that structure can be separated cleanly into tree DP and cycle algorithms.