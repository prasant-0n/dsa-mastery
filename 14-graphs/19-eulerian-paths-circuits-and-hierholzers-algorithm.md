# 14.19 — Eulerian Paths, Eulerian Circuits & Hierholzer's Algorithm

## 1. Concept Definition

An **Eulerian path** traverses every edge of a graph exactly once.

An **Eulerian circuit** is an Eulerian path that starts and ends at the same vertex.

The problem is about **edges**, unlike Hamiltonian traversal, which is about visiting vertices.

## 2. Why It Matters

Eulerian structure appears in:

- route planning
- network inspection
- street/postal routing
- circuit tracing
- genome/string reconstruction
- sequence reconstruction
- workflow edge coverage

## 3. Undirected Eulerian Conditions

Ignoring isolated vertices, a connected undirected graph has:

- an Eulerian circuit iff every vertex has even degree
- an Eulerian path iff exactly zero or two vertices have odd degree

## 4. Directed Eulerian Conditions

For a directed graph:

- Eulerian circuit: `indegree(v) = outdegree(v)` for every vertex, with appropriate connectivity
- Eulerian path: one vertex has `outdegree = indegree + 1`, one has `indegree = outdegree + 1`, and all others are balanced

Connectivity must also be considered over the relevant nonzero-degree vertices.

## 5. Hierholzer's Algorithm

Hierholzer constructs an Eulerian traversal by:

1. starting at an appropriate vertex
2. following unused edges until returning to the start or reaching the required endpoint
3. splicing additional unused-edge cycles into the current tour
4. continuing until every edge is consumed

## 6. Why Splicing Works

Whenever the current tour encounters a vertex with unused incident edges, those unused edges form a continuation that can be explored and inserted into the existing closed trail.

Repeating this process eventually consumes every edge.

## 7. Stack Implementation

A common implementation keeps a stack of vertices.

While the current vertex has unused edges, push the next vertex.

When no unused edge remains, pop the vertex into the output.

Reverse the resulting sequence.

## 8. Edge IDs

When parallel edges exist, store explicit edge IDs.

Mark individual edges as used rather than marking only endpoint pairs.

## 9. Complexity

With adjacency lists and O(1)-amortized edge consumption:

```text
Time:  O(V + E)
Space: O(V + E)
```

Every edge is consumed once.

## 10. Undirected Edge Consumption

An undirected edge appears in both endpoint adjacency lists.

When consumed, mark its edge ID used so the reverse adjacency entry is skipped later.

## 11. Directed Edge Consumption

Each directed edge belongs to one outgoing adjacency list.

Marking it consumed is sufficient for traversal correctness.

## 12. Choosing the Start Vertex

For an undirected Eulerian circuit, any non-isolated vertex can be used.

For an Eulerian path with two odd vertices, start at one odd vertex.

For a directed Eulerian path, start at the vertex with one extra outgoing edge.

## 13. Validating a Candidate Eulerian Walk

A valid traversal must:

1. use only existing edges
2. use each edge exactly once
3. use no edge more than once
4. contain the required number of edges
5. satisfy endpoint conditions

## 14. Connectivity Requirement

Degree conditions alone are insufficient.

Disconnected edge-bearing components prevent one traversal from covering every edge.

## 15. Isolated Vertices

Isolated vertices do not matter for Eulerian traversal connectivity when they have degree zero.

A graph with edges must have one connected edge-bearing component for an undirected Eulerian traversal.

## 16. Directed Connectivity Boundary

For directed graphs, checking only ordinary weak connectivity is not always sufficient to reason about Eulerian circuits.

A robust validation approach examines the vertices with nonzero degree and the appropriate directed reachability/strong-connectivity condition.

## 17. Eulerian Circuit vs Eulerian Path

A circuit returns to its start.

A path with two odd undirected endpoints starts at one odd vertex and ends at the other.

## 18. Eulerian Cycle as a Closed Walk

An Eulerian circuit is a closed trail containing every edge exactly once.

Repeated vertices are allowed.

Repeated edges are not.

## 19. Hierholzer vs DFS

Hierholzer is not ordinary DFS.

The stack explores unused edges, but vertices are added to the final answer when they become dead ends, which effectively performs the required cycle splicing.

## 20. Lexicographically Constrained Eulerian Traversal

If multiple unused edges are available, a deterministic ordering policy can choose among them.

A min-heap or sorted adjacency structure can impose lexical ordering, but additional data-structure costs may change complexity.

## 21. Reconstructing a Sequence

Directed Eulerian paths can reconstruct sequences when each edge represents an overlap transition.

The graph formulation converts local overlap constraints into an edge-coverage problem.

## 22. String Reconstruction

For strings of fixed length `k`, `(k-1)`-length prefixes/suffixes can form vertices and `k`-length strings can form directed edges.

An Eulerian path through these edges can reconstruct a sequence under appropriate multiplicity assumptions.

## 23. Genome Assembly Preview

De Bruijn graph approaches represent k-mers as edges between prefix/suffix nodes.

An Eulerian traversal can produce a sequence consistent with the observed k-mer multiset, subject to sequencing assumptions and graph ambiguity.

## 24. Chinese Postman Boundary

The Eulerian problem assumes every edge should be traversed exactly once.

The **Chinese Postman Problem** instead seeks a minimum-cost closed walk covering every edge, allowing repeated edges when necessary.

## 25. Backend Application: Network Inspection

If every communication link must be inspected exactly once, an Eulerian route can model an ideal inspection path when the graph satisfies Eulerian conditions.

## 26. Backend Application: Route Planning

Street-like edges can be modeled as graph edges.

Degree analysis determines whether a single edge-covering route exists without repeating edges.

## 27. Backend Application: Workflow Edge Coverage

A directed workflow graph can be analyzed for an execution trace that traverses every transition exactly once.

Real workflow semantics may impose additional state, authorization, or resource constraints.

## 28. AI Application: Sequence Reconstruction

When observations naturally represent transitions between overlapping states, an Eulerian graph can reconstruct a sequence using every observed transition exactly once.

## 29. AI Application: Synthetic Test Generation

A transition graph can be traversed Eulerian-style to cover every modeled transition with minimal repetition.

This can support systematic edge-coverage test generation.

## 30. AI Application: Token/Substring Reconstruction

Overlap graphs can represent fragments or token sequences.

Eulerian traversal can reconstruct a candidate sequence when fragment multiplicities and connectivity permit it.

## 31. Correctness Invariant

At every stage of Hierholzer's algorithm:

- every already-consumed edge appears exactly once in the partial traversal structure
- every unconsumed edge remains available in the adjacency structure
- splicing preserves edge continuity

## 32. Termination

Each traversal step consumes one previously unused edge.

Since there are finitely many edges, the algorithm terminates after all reachable edges are consumed.

## 33. Correctness of Final Walk

The stack-based reverse-output construction places each vertex after all edges leaving its current unfinished trail have been processed.

The resulting sequence therefore forms a continuous trail using each consumed edge exactly once.

## 34. Degree Necessity

In a closed Eulerian circuit, every time a vertex is entered, an unused outgoing/incident edge must eventually leave it.

Thus incident edges pair up at every vertex, forcing even degree in undirected graphs and equal in/out degree in directed graphs.

## 35. Path Endpoint Necessity

For an undirected open Eulerian path, exactly two vertices can have an unmatched incident edge: the start and end.

Therefore exactly two odd-degree vertices are required.

## 36. Testing Strategy

Test:

- empty graph
- one edge
- single vertex
- simple cycle
- path graph
- figure-eight graph
- disconnected graphs
- parallel edges
- self-loops
- directed circuits
- directed open trails

## 37. Differential Testing

For small graphs, compare Hierholzer against a brute-force trail enumerator.

Validate the returned edge sequence independently rather than comparing vertex sequences directly because multiple valid Eulerian traversals may exist.

## 38. Property Testing

For a returned traversal verify:

```text
number of traversed edges === number of graph edges
```

and verify every edge ID occurs exactly once.

Also verify consecutive vertices correspond to the traversed edge.

## 39. Adversarial Testing

Use:

- very large edge counts
- many parallel edges
- many self-loops
- high-degree hubs
- long chains
- repeated cycle splicing
- graphs with exactly two odd vertices

## 40. Benchmarking

Measure:

- edge-consumption operations
- adjacency pointer advancement
- memory allocation
- edge-ID bookkeeping
- sorted vs unsorted adjacency
- recursive vs iterative traversal

## 41. Common Mistakes

- confusing Eulerian and Hamiltonian traversal
- checking degree conditions without connectivity
- marking endpoint pairs instead of individual parallel edges
- forgetting to reverse stack output
- returning a partial trail without checking that every edge was consumed
- mishandling self-loops
- assuming one Eulerian traversal is unique

## 42. Interview Framework

For “find an Eulerian path/circuit”:

1. determine directed vs undirected
2. count degrees or in/out degrees
3. verify connectivity
4. choose the correct start vertex
5. use Hierholzer
6. track individual edge IDs
7. verify every edge is consumed
8. derive `O(V + E)`

## 43. Revision Checklist

- [ ] Define Eulerian path.
- [ ] Define Eulerian circuit.
- [ ] State undirected degree conditions.
- [ ] State directed degree conditions.
- [ ] Explain connectivity requirements.
- [ ] Implement Hierholzer.
- [ ] Handle parallel edges with edge IDs.
- [ ] Handle self-loops.
- [ ] Validate a candidate traversal.
- [ ] Understand sequence reconstruction via overlap graphs.
- [ ] Distinguish Eulerian traversal from Chinese Postman.
- [ ] Apply Eulerian reasoning to backend and AI systems.

## Key Takeaways

1. Eulerian traversal is about using every edge exactly once.
2. Degree conditions are necessary but must be combined with connectivity.
3. Hierholzer constructs Eulerian traversals in linear time.
4. Explicit edge IDs are essential for parallel-edge correctness.
5. Eulerian graphs naturally model edge coverage and overlap-based sequence reconstruction.
