# 14.18 — Bipartite Matching & Assignment Algorithms

## 1. Concept Definition

A **bipartite graph** divides vertices into two disjoint sets `L` and `R`, with edges only between the sets.

A **matching** is a set of edges sharing no endpoint.

## 2. Why It Matters

Matching models one-to-one or capacity-constrained assignment:

- workers to jobs
- students to courses
- users to resources
- tasks to machines
- candidates to recommendations

## 3. Maximum Bipartite Matching

A maximum matching contains the largest possible number of matched pairs.

## 4. Augmenting Paths

An augmenting path alternates between unmatched and matched edges and begins and ends at unmatched vertices.

Flipping matched/unmatched status along it increases matching size by one.

## 5. Berge's Theorem

A matching is maximum exactly when there is no augmenting path.

This theorem is the foundation of augmenting-path matching algorithms.

## 6. Kuhn's Algorithm

A DFS-based augmenting-path algorithm repeatedly tries to assign each left vertex to an available right vertex, recursively rerouting existing matches when necessary.

A common bound is `O(VE)`.

## 7. Visited State in Kuhn

Per-search visitation state prevents repeated traversal of the same right-side vertices during one augmentation attempt.

Resetting it at the correct scope is essential.

## 8. Hopcroft-Karp

Hopcroft-Karp finds multiple shortest augmenting paths per phase.

It alternates:

1. BFS to construct distance layers.
2. DFS to find a maximal set of compatible shortest augmenting paths.

Its standard complexity is:

```text
O(E sqrt(V))
```

## 9. Why Layering Helps

Instead of searching for one augmenting path at a time, Hopcroft-Karp batches vertex-disjoint shortest augmentations.

This reduces the number of expensive phases.

## 10. Matching Representation

Useful structures include:

```text
pairU[u] = matched right vertex
pairV[v] = matched left vertex
```

and distance arrays for Hopcroft-Karp.

## 11. Matching Validation

A matching is valid when:

- every selected edge exists
- no left vertex appears twice
- no right vertex appears twice

## 12. Maximum Cardinality vs Maximum Weight

Maximum cardinality maximizes the number of pairs.

Maximum-weight matching instead optimizes total edge weight and may select fewer pairs if unmatched vertices are permitted.

These are different objectives.

## 13. Assignment Problem

The classical assignment problem seeks a one-to-one assignment minimizing total cost or maximizing total benefit.

It is a weighted bipartite optimization problem.

## 14. Hungarian Algorithm

The Hungarian algorithm solves the square assignment problem in polynomial time, commonly stated as:

```text
O(n^3)
```

It maintains dual labels and adjusts the equality structure while growing an optimal assignment.

## 15. Rectangular Assignment

When the two sides have different sizes, dummy rows or columns can be introduced, or a rectangular formulation can be handled directly depending on the implementation.

## 16. Min-Cost Flow Reduction

Weighted bipartite assignment can also be modeled as min-cost flow:

```text
source → left → right → sink
```

with capacities encoding assignment constraints and costs on candidate edges.

## 17. Matching vs Flow

Flow provides a general modeling framework.

Specialized matching algorithms can exploit bipartite structure and often provide better asymptotic or practical performance for the corresponding problem.

## 18. Perfect Matching

A perfect matching matches every vertex on both sides when the two sides have equal cardinality.

Hall's theorem characterizes when a bipartite graph contains such a matching.

## 19. Hall's Theorem

A bipartite graph has a matching saturating every vertex of `L` exactly when for every subset `S ⊆ L`:

```text
|N(S)| >= |S|
```

where `N(S)` is the neighborhood of `S`.

## 20. Vertex Capacities

If a resource can serve multiple assignments, replace the simple matching constraint with a capacity constraint.

This naturally leads to flow or b-matching formulations.

## 21. b-Matching Boundary

A b-matching generalizes matching by allowing vertices to participate in up to a specified number of edges.

Capacity-constrained bipartite matching can often be reduced to flow.

## 22. Online Matching

In online matching, requests or vertices arrive over time and decisions may need to be made without knowing future arrivals.

Offline maximum matching algorithms cannot automatically be applied when future information is unavailable.

## 23. Dynamic Matching

Adding or deleting edges can invalidate a current matching.

Dynamic algorithms aim to repair the solution without recomputing everything from scratch.

## 24. Stable Matching Boundary

Stable matching is different from maximum-cardinality or minimum-cost matching.

It uses preference rankings and a stability condition rather than simply maximizing edge count or minimizing numeric cost.

## 25. Backend Application: Job Assignment

Workers and jobs can form a bipartite graph.

An edge means a worker is eligible for a job.

Maximum matching assigns as many eligible pairs as possible.

## 26. Backend Application: Resource Allocation

Users can be matched to available resources, machines, or service slots.

Capacity extensions support resources that can accept multiple assignments.

## 27. Backend Application: Feature/Permission Assignment

Entities can be matched to eligible roles, capabilities, or operational slots under one-to-one constraints.

The domain's authorization semantics must be modeled explicitly.

## 28. AI Application: Candidate-to-Task Assignment

AI-generated candidates can be assigned to tasks using a bipartite graph of eligibility or compatibility.

Weights can encode scores when optimizing assignment quality.

## 29. AI Application: Retrieval Deduplication

Candidate items can be matched to slots or constraints where each item or slot has limited capacity.

Flow/matching can enforce hard combinatorial constraints after ranking.

## 30. AI Application: Resource Scheduling

Models, workers, GPUs, jobs, and queues can be represented as capacity-constrained assignment networks.

The final scheduler must additionally account for time, locality, and resource compatibility.

## 31. Weighted Scoring

If each edge has score `w(u,v)`, a weighted assignment can optimize:

```text
sum(w(u,v))
```

subject to assignment constraints.

## 32. Forbidden Assignments

An unavailable pair can be omitted from the graph.

Alternatively, an explicit large penalty can encode forbidden choices in certain optimization formulations, but numeric bounds and exact semantics must be handled carefully.

## 33. Tie-Breaking

Production assignment systems often require deterministic tie-breaking.

Define a secondary ordering rather than relying on incidental traversal order.

## 34. Sparse Graphs

Real eligibility graphs may be sparse.

Adjacency lists avoid the `O(LR)` memory cost of dense matrices when only a small fraction of pairs are possible.

## 35. Dense Graphs

Dense assignment problems may benefit from matrix-based representations and specialized implementations.

Representation should follow workload characteristics.

## 36. Numerical Precision

Weighted assignment using floating-point scores can create comparison and tie issues.

For exact costs, prefer integer-scaled values or exact arithmetic where practical.

## 37. Correctness — Augmenting Paths

Flipping an augmenting path preserves the matching invariant and increases matching cardinality by exactly one.

## 38. Correctness — Maximum Matching

By Berge's theorem, once no augmenting path exists, the current matching is maximum.

## 39. Correctness — Hopcroft-Karp

The BFS phase identifies shortest augmenting-path distances; the DFS phase only follows valid layered edges and finds a maximal collection of compatible shortest augmenting paths.

Repeated phases eventually eliminate all augmenting paths.

## 40. Correctness — Assignment

Assignment algorithms maintain feasibility while improving objective value until complementary optimality conditions certify an optimum.

The exact proof depends on the algorithm, such as Hungarian or min-cost flow.

## 41. Testing Strategy

Test:

- empty sides
- isolated vertices
- perfect matching
- no matching
- multiple valid matchings
- augmenting reroutes
- duplicate edges
- weighted ties
- rectangular matrices
- forbidden assignments

## 42. Differential Testing

For small graphs compare matching algorithms against brute-force subset enumeration.

For small weighted assignment matrices compare against exhaustive permutations.

## 43. Property Testing

Validate:

- matching validity
- cardinality upper bounds
- objective consistency
- no augmenting path after maximum matching
- assignment uniqueness constraints

## 44. Benchmarking

Measure:

- graph density
- augmentation count
- BFS phases
- DFS scans
- matrix vs adjacency-list overhead
- weighted objective calculations
- memory usage

## 45. Common Mistakes

- treating matching as ordinary graph traversal
- forgetting to reroute an existing match
- reusing visited state across augmenting searches incorrectly
- confusing maximum cardinality with maximum weight
- ignoring rectangular assignment constraints
- using unstable floating-point comparisons for exact tie decisions

## 46. Interview Framework

For “maximum bipartite matching”:

1. identify the two partitions
2. define matching constraints
3. explain augmenting paths
4. use Kuhn for a simple solution or Hopcroft-Karp for larger instances
5. derive complexity
6. validate matching invariants
7. discuss flow reduction when useful

For “assignment”:

1. identify weighted one-to-one constraints
2. distinguish cardinality from cost optimization
3. consider Hungarian or min-cost flow
4. state complexity and numerical assumptions

## 47. Revision Checklist

- [ ] Define a bipartite graph.
- [ ] Define a matching.
- [ ] Explain augmenting paths.
- [ ] State Berge's theorem.
- [ ] Implement Kuhn's algorithm.
- [ ] Understand Hopcroft-Karp.
- [ ] Explain BFS layering.
- [ ] Distinguish cardinality and weighted matching.
- [ ] Understand the assignment problem.
- [ ] Understand the Hungarian algorithm.
- [ ] Reduce matching/assignment to flow.
- [ ] Understand Hall's theorem.
- [ ] Handle capacities and b-matching.
- [ ] Apply matching to backend and AI allocation systems.

## Key Takeaways

1. Matching is a constrained edge-selection problem on bipartite graphs.
2. Augmenting paths are the core mechanism for maximum-cardinality matching.
3. Hopcroft-Karp batches shortest augmenting paths in `O(E sqrt(V))`.
4. Weighted assignment is a different optimization problem from maximum cardinality.
5. Hungarian and min-cost flow are important weighted-assignment techniques.
6. Matching concepts translate naturally into resource, task, and AI assignment systems.
