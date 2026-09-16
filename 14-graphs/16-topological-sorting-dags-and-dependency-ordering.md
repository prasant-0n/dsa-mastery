# 14.16 — Topological Sorting, DAGs & Dependency Ordering

## 1. Concept Definition

A **topological ordering** of a directed acyclic graph (DAG) is a linear ordering of vertices such that for every directed edge `u → v`, `u` appears before `v`.

## 2. Why It Matters

Topological ordering models prerequisite relationships:

- build systems
- package dependencies
- database migrations
- workflow execution
- task scheduling
- course prerequisites
- compilation pipelines

## 3. DAG Definition

A directed graph is a **DAG** when it contains no directed cycle.

A graph has a topological ordering exactly when it is a DAG.

## 4. Partial Order Mental Model

A DAG represents precedence constraints rather than a total ordering.

Many valid topological orders may exist.

The algorithm chooses one valid linear extension of the partial order.

## 5. Kahn's Algorithm

Kahn's algorithm uses indegrees:

1. compute `indegree[v]`
2. place every zero-indegree vertex into a queue
3. remove one available vertex
4. decrement its outgoing neighbors' indegrees
5. add newly zero-indegree vertices
6. repeat

## 6. Kahn Invariant

Every vertex placed into the output has no remaining incoming edge from an unprocessed vertex.

Therefore placing it next cannot violate any remaining prerequisite.

## 7. Cycle Detection with Kahn

If fewer than `V` vertices are output, the graph contains a directed cycle.

The remaining vertices cannot all reach indegree zero because cyclic prerequisites remain.

## 8. DFS Topological Sort

A DFS-based approach appends a vertex after processing all outgoing neighbors.

Reverse the finishing order to obtain a topological ordering.

## 9. DFS Three-Color State

Use:

```text
0 = unvisited
1 = active
2 = finished
```

An edge to an active vertex identifies a directed cycle.

## 10. DFS Correctness

For every edge `u → v` in a DAG, `v` finishes before `u` because DFS must complete reachable descendants before finishing `u`.

Reversing finish order therefore places `u` before `v`.

## 11. Complexity

Both Kahn and DFS topological sorting run in:

```text
Time:  O(V + E)
Space: O(V + E)
```

with adjacency lists.

## 12. Queue Choice in Kahn

A FIFO queue produces one valid order.

A min-heap can instead select the smallest available vertex, producing a lexicographically smallest topological order when vertex IDs define the ordering.

## 13. Lexicographically Smallest Order

At every step, choose the smallest currently available zero-indegree vertex.

A priority queue provides the required selection policy.

Complexity becomes typically:

```text
O((V + E) log V)
```

because of heap operations.

## 14. Lexicographically Largest Order

Choose the largest currently available vertex using a max-oriented priority queue.

The same framework supports different deterministic policies.

## 15. Multiple Valid Orders

If multiple zero-indegree vertices are available, there are multiple possible next choices.

This does not imply the graph is ambiguous in a problematic sense; it reflects independent prerequisites.

## 16. Counting Topological Orders

Counting all valid topological orders is substantially harder than producing one.

A common exact approach uses subset DP for small `V`:

```text
state = set of already scheduled vertices
```

The state space is exponential.

## 17. Enumerating Topological Orders

Backtracking can enumerate all valid orders by repeatedly selecting any currently available vertex.

This is output-sensitive and can become exponential because the number of valid orders itself can be enormous.

## 18. Unique Topological Ordering

A topological ordering is unique exactly when, at every step, there is only one currently available vertex.

Equivalently, in a generated topological order every consecutive pair must be constrained by reachability sufficient to force the order; the simple zero-indegree test during Kahn is the practical criterion.

## 19. Dependency Scheduling

A dependency graph can be interpreted as:

```text
dependency → dependent
```

Topological order then gives a valid execution sequence.

## 20. Build Systems

Compilation units form a DAG when circular dependencies are forbidden.

Topological order determines a legal build sequence.

Parallel execution can be layered by repeatedly processing all currently available tasks.

## 21. Level / Layer Scheduling

Process all zero-indegree vertices as one batch.

Remove them together and continue with the next layer.

This exposes dependency depth and potential parallelism.

## 22. Critical Path

If each DAG vertex or edge has a duration, topological order enables dynamic programming for earliest completion times.

For vertex duration `w[v]`:

```text
earliest[v] = w[v] + max(earliest[p])
```

over prerequisites `p`.

## 23. Longest Path in a DAG

Unlike general graphs, longest paths are tractable in DAGs.

Process vertices topologically and relax using `max` rather than `min`.

This is another example of structural specialization.

## 24. Shortest Paths in DAGs

Weighted DAG shortest paths can be solved in:

```text
O(V + E)
```

by processing vertices in topological order.

Negative edge weights are allowed because cycles do not exist.

## 25. Transitive Closure Boundary

Topological ordering alone does not answer arbitrary reachability queries.

Additional indexing or graph algorithms are required when the workload demands reachability rather than precedence ordering.

## 26. Course / Prerequisite Modeling

For prerequisite relations:

```text
prerequisite → course
```

A topological ordering gives one legal completion sequence.

A cycle means the prerequisite constraints are mutually impossible to satisfy in a finite sequence.

## 27. Database Migration Ordering

Migration dependencies can form a DAG.

Topological sorting produces a valid application order while cycle detection identifies incompatible dependency definitions.

## 28. Workflow Engines

Workflow steps can be represented as DAG nodes with dependency edges.

Zero-indegree tasks are ready to execute.

A production scheduler must additionally manage retries, resources, concurrency, deadlines, and failures.

## 29. Backend Application: Job Scheduling

A dependency-aware job scheduler can maintain a DAG of prerequisites.

Kahn-style indegrees identify jobs whose dependencies have completed.

## 30. Backend Application: Microservice Deployment

Deployment steps can be represented as dependencies:

```text
migration → service deployment → traffic shift
```

Topological ordering establishes a valid dependency sequence.

## 31. AI Application: Feature Pipelines

Feature transformations can form a DAG.

Topological scheduling ensures a transformation runs only after its inputs are ready.

## 32. AI Application: Computation Graphs

Many computational graphs use directed acyclic structure.

Topological traversal provides an execution order for forward computation and can also support reverse dependency analysis.

## 33. AI Application: Data/Model Pipelines

Training and inference workflows can encode preprocessing, feature generation, model execution, and postprocessing as dependency nodes.

Topological scheduling exposes independent tasks that may execute concurrently.

## 34. Incremental Dependency Updates

Adding an edge `u → v` can invalidate an existing topological order if `v` currently precedes `u`.

Maintaining a valid order under arbitrary online edge insertions is harder than computing an order from scratch.

## 35. Dynamic Topological Ordering

Dynamic algorithms maintain an ordering while edges are inserted or deleted.

The data structure must detect whether a new constraint creates a cycle and efficiently repair affected portions of the order.

## 36. Transitive Reduction Preview

A DAG may contain redundant edges.

A transitive reduction removes edges whose reachability relationship is implied by other paths, while preserving the same reachability relation.

This is distinct from topological sorting.

## 37. Correctness Invariant — Kahn

Before selecting a vertex, every remaining incoming edge represents an unprocessed prerequisite.

A zero-indegree vertex therefore has no unresolved prerequisite and is safe to output.

## 38. Correctness Invariant — DFS

When a vertex finishes, every reachable descendant has already finished.

For an edge `u → v` in a DAG, this guarantees `finish(u) > finish(v)`.

Reversing finish order satisfies every edge constraint.

## 39. Testing Strategy

Test:

- empty graph
- single vertex
- simple chain
- independent vertices
- diamond dependencies
- multiple valid orders
- unique order
- directed cycle
- disconnected DAG
- self-loop
- parallel edges

## 40. Differential Testing

Compare Kahn and DFS implementations.

Both outputs may differ while remaining valid.

Validate each output independently against every edge constraint and compare cycle detection results.

## 41. Property Testing

For a returned order `order`:

1. every vertex appears exactly once
2. every graph vertex appears
3. for every edge `u → v`, `position[u] < position[v]`
4. if the algorithm reports a cycle, independently verify cyclicity on small graphs

## 42. Adversarial Testing

Use:

- very deep chains
- wide layers
- dense DAGs
- nearly cyclic graphs
- self-loops
- duplicate edges
- many independent sources

## 43. Common Mistakes

- confusing directed and undirected graphs
- forgetting cycle detection
- reversing DFS finish order incorrectly
- decrementing indegree incorrectly with duplicate edges
- assuming the topological order is unique
- using BFS as if it were topological sorting
- ignoring deep recursion limits in JavaScript

## 44. Interview Framework

For “topological sort”:

1. confirm the graph is directed
2. determine whether a cycle is allowed
3. choose Kahn or DFS
4. state the invariant
5. implement cycle detection
6. derive `O(V + E)`
7. discuss multiple valid orders
8. mention lexicographically constrained variants
9. connect the result to dependency scheduling

## 45. Revision Checklist

- [ ] Define a DAG.
- [ ] Define topological ordering.
- [ ] Implement Kahn's algorithm.
- [ ] Implement DFS topological sort.
- [ ] Detect directed cycles.
- [ ] Explain indegree invariants.
- [ ] Explain DFS finishing-time reasoning.
- [ ] Produce lexicographically smallest order.
- [ ] Understand unique-order detection.
- [ ] Understand layered scheduling.
- [ ] Solve DAG shortest/longest path variants.
- [ ] Understand dynamic topological ordering.
- [ ] Apply DAG ordering to backend and AI pipelines.

## Key Takeaways

1. A topological order is a linear extension of a directed acyclic dependency graph.
2. Kahn's algorithm repeatedly schedules zero-indegree vertices.
3. DFS produces an order by reversing finishing times.
4. Both standard approaches run in `O(V + E)`.
5. A directed cycle makes topological ordering impossible.
6. Topological ordering enables efficient DAG scheduling and dynamic programming.
7. Heap-based selection can impose deterministic lexicographic policies at additional cost.
