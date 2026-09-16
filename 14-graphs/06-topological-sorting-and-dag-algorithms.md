# 14.06 — Topological Sorting & DAG Algorithms

## 1. Concept Definition

A **topological ordering** of a directed graph is a linear ordering of vertices such that for every directed edge `u → v`, `u` appears before `v`.

A graph has a topological ordering **if and only if it is a DAG (Directed Acyclic Graph)**.

## 2. Why It Matters

Topological ordering models precedence constraints:

- build dependencies
- package dependencies
- task scheduling
- workflow execution
- course prerequisites
- database migration ordering
- compiler dependency graphs
- AI planning dependencies

## 3. DAG Mental Model

Think of a DAG as a dependency system with no circular dependency.

```text
A → B → D
A → C → D
```

`A` must occur before `B` and `C`, while `D` must occur after both.

## 4. Partial Order

A DAG induces a partial order.

A topological ordering converts that partial order into one valid linear sequence.

There may be many valid topological orderings for the same DAG.

## 5. Important Consequence

Topological sorting does **not** necessarily produce a unique answer.

If two vertices are currently unconstrained relative to each other, either may appear first.

Uniqueness is a separate property.

## 6. Kahn's Algorithm

Kahn's algorithm repeatedly selects vertices with indegree zero.

```text
calculate indegrees
queue all indegree-0 vertices

while queue is not empty:
    u = remove a zero-indegree vertex
    output u
    for each edge u → v:
        decrement indegree[v]
        if indegree[v] == 0:
            enqueue v
```

## 7. Kahn Invariant

At every iteration:

> Every vertex currently in the zero-indegree frontier has no remaining incoming dependency among unprocessed vertices.

Therefore it is safe to place such a vertex next.

## 8. Detecting a Cycle with Kahn

If Kahn's algorithm outputs fewer than `V` vertices, some vertices remain with unresolved incoming dependencies.

Those remaining dependencies contain a directed cycle.

```text
outputCount < V → cycle exists
outputCount = V → DAG
```

## 9. DFS Topological Sorting

A second approach uses DFS finish order.

For every vertex:

1. recursively explore outgoing neighbors
2. after all descendants finish, place the vertex into the result
3. reverse the resulting finish order

This is based on the fact that an edge `u → v` requires `u` to appear before `v`.

## 10. DFS Cycle Requirement

DFS topological sorting must detect directed cycles.

Use active-path (`GRAY`) state. If an edge points to an active vertex, no topological ordering exists.

## 11. Finish-Time Intuition

For an edge `u → v` in a DAG, DFS finishes `v` before `u`.

Therefore descending finish times produce a valid topological order.

## 12. Correctness of Kahn's Algorithm

Inductively:

1. choose a zero-indegree vertex `u`
2. no remaining vertex depends on `u` as a prerequisite
3. placing `u` first cannot violate an edge ordering
4. remove `u` and continue on the remaining DAG

If the graph is acyclic, the process eventually removes every vertex.

## 13. Correctness of DFS Ordering

For every edge `u → v` in a DAG, DFS finishes `v` before `u`.

Therefore `u` appears before `v` after reversing finish order.

## 14. Complexity

With adjacency lists:

```text
Kahn:       O(V + E)
DFS method: O(V + E)
Space:      O(V)
```

Space includes indegree/state arrays and the frontier or recursion/explicit stack.

## 15. Adjacency Matrix

With an adjacency matrix, discovering outgoing neighbors requires scanning `V` destinations for each processed vertex.

The standard traversal-based implementation therefore requires `O(V²)` work.

## 16. Deterministic Topological Order

If multiple zero-indegree vertices are available, the chosen data structure determines the order.

Options include:

- FIFO queue
- min-heap for lexicographically smallest order
- custom priority queue

The ordering remains valid as long as every selected vertex has indegree zero in the remaining graph.

## 17. Lexicographically Smallest Ordering

To obtain the lexicographically smallest valid topological ordering, replace Kahn's ordinary queue with a min-heap.

Complexity becomes approximately:

```text
O((V + E) log V)
```

because frontier operations use the heap.

## 18. Lexicographically Largest Ordering

Similarly, a max-heap can choose the largest available vertex at each step.

This is a policy choice layered on top of the same dependency invariant.

## 19. Detecting Unique Topological Order

During Kahn's algorithm:

> If at any step there are two or more zero-indegree choices, multiple valid topological orders exist.

Therefore a unique ordering requires exactly one available vertex at every step.

## 20. Counting Topological Orders

Counting all valid topological orders is generally much harder than producing one.

For small graphs, subset DP can enumerate/count orders.

For large general DAGs, exact counting is computationally difficult.

Do not confuse construction with counting.

## 21. All Topological Orders

Generating every valid ordering can be exponential because the number of valid orderings itself may be exponential.

Backtracking can generate them for small graphs, but output size must be included in the complexity analysis.

## 22. DAG Dynamic Programming

DAGs enable dynamic programming because a topological order provides a dependency-respecting evaluation order.

General pattern:

```text
topological order
      ↓
process predecessors
      ↓
compute state
      ↓
propagate to successors
```

## 23. Longest Path in a DAG

Unlike general weighted graphs, longest paths in a DAG can be solved efficiently using dynamic programming.

Process vertices in topological order and relax outgoing edges using a **maximum** operation.

## 24. Shortest Path in a DAG

For weighted DAGs, shortest paths can be computed by processing vertices in topological order and relaxing outgoing edges.

Negative edge weights are allowed because a DAG contains no cycles that could repeatedly reduce the path cost.

## 25. DAG DP Recurrence

For shortest path:

```text
dp[v] = min(dp[v], dp[u] + weight(u,v))
```

for each edge `u → v` processed in topological order.

For longest path, replace `min` with `max` and define appropriate unreachable-state semantics.

## 26. Reachability in DAGs

Topological ordering can simplify reachability and dependency propagation.

For repeated queries, additional indexing or transitive-closure techniques may be justified depending on graph size and density.

## 27. Transitive Reduction Preview

A transitive reduction removes redundant edges while preserving reachability, where the graph semantics allow such a reduction.

For DAGs, this reveals a minimal dependency relation.

It is distinct from topological sorting.

## 28. Critical Path Analysis

A project dependency DAG can model tasks and durations.

The longest weighted path represents a critical dependency chain under the chosen scheduling model.

Topological order provides the processing sequence for the DP.

## 29. Scheduling with Prerequisites

Represent:

```text
prerequisite → task
```

Then a topological ordering gives a valid prerequisite-respecting execution sequence.

Parallel execution requires additional frontier/scheduling logic and is not solved by a topological order alone.

## 30. Parallel DAG Execution

At any stage, multiple zero-indegree tasks can be concurrently eligible.

The zero-indegree frontier therefore represents a set of currently dependency-free tasks.

Real scheduling additionally requires:

- worker capacity
- priorities
- resource constraints
- fairness
- failure/retry policy

## 31. Backend Application: Build Systems

Source/module dependencies form a DAG when circular dependencies are prohibited.

Topological ordering determines a valid build sequence.

Cycle detection should happen before execution.

## 32. Backend Application: Database Migrations

Migration dependencies can be represented as a DAG.

A topological order provides a dependency-safe application sequence when the migration model is acyclic.

Production systems must additionally account for transactional safety and rollback semantics.

## 33. Backend Application: Workflow Engines

A DAG workflow can use topological structure for dependency readiness.

A production scheduler may extend Kahn's frontier with a priority queue and resource-aware workers.

## 34. AI Application: Planning

Planning dependencies can form DAGs where actions or subtasks have prerequisites.

Topological evaluation can order prerequisite computations.

Not every planning problem is acyclic; state-space planning may contain cycles and requires different search machinery.

## 35. AI Application: Computational Graphs

Neural-network and data-processing computational graphs are commonly represented as directed acyclic dependency graphs.

Topological ordering determines a valid forward evaluation order.

## 36. AI Application: Feature Pipelines

Feature transformations can be represented as dependencies:

```text
raw data → transform A → transform B → model
```

A DAG scheduler can determine dependency-safe execution.

## 37. Edge Cases

Handle:

- empty graph
- one vertex
- isolated vertices
- multiple independent components
- multiple valid orders
- unique order
- self-loop
- directed cycle
- duplicate edges
- disconnected DAG

## 38. Duplicate Edges

Parallel dependency edges require explicit semantics.

If two identical edges are stored, indegree must be incremented consistently and decremented consistently.

Alternatively, normalize the graph to simple-edge semantics before sorting.

## 39. Self-Loops

A self-loop `u → u` gives `u` positive indegree and prevents Kahn's algorithm from removing it.

DFS also identifies it as a back edge.

Thus no topological ordering exists.

## 40. Disconnected DAGs

A DAG can have many independent components.

Kahn's algorithm naturally processes all zero-indegree vertices across the graph.

The resulting order is one interleaving of the component orders.

## 41. Common Mistakes

- forgetting cycle detection
- assuming the topological order is unique
- reversing DFS finish order incorrectly
- calculating indegree only for some vertices
- ignoring disconnected components
- using a normal queue when lexicographic ordering is required
- confusing longest path in a DAG with general longest path
- treating topological sorting as parallel scheduling

## 42. Testing Strategy

Test:

- simple chain
- diamond DAG
- independent components
- multiple valid orders
- unique order
- cycle
- self-loop
- duplicate edges
- isolated vertices
- large sparse DAG

## 43. Differential Testing

For small graphs:

1. generate candidate permutations
2. validate each candidate against every directed edge
3. compare whether a topological order exists
4. compare the optimized algorithm's result

For larger graphs, validate the returned order directly and compare against an independent implementation.

## 44. Property Testing

For every returned ordering `order`:

```text
for every edge u → v:
    position[u] < position[v]
```

For a DAG, the algorithm must return exactly `V` vertices.

For a cyclic graph, Kahn's processed count must be less than `V`.

## 45. Benchmarking

Measure:

- graph construction
- indegree calculation
- Kahn processing
- DFS ordering
- heap-based deterministic ordering
- DAG shortest/longest-path DP
- memory usage

Use both sparse and dense workloads.

## 46. Interview Framework

For “topological sort”:

1. confirm graph is directed
2. explain that a valid ordering requires a DAG
3. choose Kahn or DFS
4. state the invariant
5. implement
6. detect cycles
7. derive `O(V + E)`
8. discuss deterministic ordering if requested
9. mention disconnected graphs

## 47. Revision Checklist

- [ ] Define a topological ordering.
- [ ] Explain why DAGs are required.
- [ ] Implement Kahn's algorithm.
- [ ] Implement DFS-based topological sorting.
- [ ] Detect cycles during both approaches.
- [ ] Explain the Kahn invariant.
- [ ] Explain DFS finish-time reasoning.
- [ ] Produce lexicographically smallest ordering with a heap.
- [ ] Detect whether the order is unique.
- [ ] Understand why counting all orders is harder.
- [ ] Solve shortest paths in DAGs.
- [ ] Solve longest paths in DAGs.
- [ ] Apply DAG DP.
- [ ] Apply topological reasoning to backend systems.
- [ ] Apply it to AI computational graphs and planning.

## Key Takeaways

1. Topological sorting converts DAG dependencies into a valid linear order.
2. Kahn's algorithm repeatedly removes zero-indegree vertices.
3. DFS topological sorting uses reverse finish order and requires directed-cycle detection.
4. Multiple valid orders are normal; uniqueness is a separate property.
5. A heap can impose deterministic lexicographic selection.
6. DAG structure enables efficient shortest/longest-path dynamic programming.
7. Topological ordering is a dependency-ordering primitive, not a complete production scheduler.
