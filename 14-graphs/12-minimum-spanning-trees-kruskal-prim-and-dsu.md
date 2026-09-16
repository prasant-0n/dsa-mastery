# 14.12 — Minimum Spanning Trees: Kruskal, Prim & DSU

## 1. Concept Definition

A **minimum spanning tree (MST)** of a connected, weighted, undirected graph is a spanning tree whose total edge weight is minimum among all spanning trees.

For a graph with `V` vertices, every spanning tree contains exactly `V - 1` edges.

## 2. Why It Matters

MST algorithms solve network-connection problems where every vertex must be connected while minimizing total connection cost.

Applications include:

- network infrastructure
- cable/fiber planning
- clustering
- road/pipeline design
- service topology optimization
- graph-based segmentation

## 3. Graph Requirements

The classical MST problem assumes:

- undirected graph
- weighted edges
- spanning requirement

If the graph is disconnected, no spanning tree exists for the whole graph. Instead, the result is a **minimum spanning forest**.

## 4. Tree Properties

A tree is:

- connected
- acyclic
- contains `V - 1` edges

Removing any tree edge disconnects the tree.

Adding any non-tree edge creates exactly one cycle.

## 5. Cut Property

The central MST theorem is the **cut property**:

> A lightest edge crossing a cut is safe for some MST.

If multiple edges tie for minimum weight, any of the tied light edges can be safe.

## 6. Cycle Property

For a cycle, a strictly heaviest edge cannot belong to any MST when its removal preserves the relevant graph connectivity and it is uniquely heaviest on that cycle.

This gives another way to reason about safe edge exclusion.

## 7. Kruskal's Algorithm

Kruskal processes edges globally in nondecreasing weight order.

```text
sort edges by weight
initialize DSU

for each edge (u,v,w):
    if u and v are in different components:
        accept edge
        union(u,v)
```

Stop after `V - 1` accepted edges for a connected graph.

## 8. Why DSU Is Used

The algorithm repeatedly asks:

```text
Are u and v already connected?
```

A Disjoint Set Union structure answers this efficiently while supporting component merges.

## 9. DSU Structure

Typical DSU operations:

```text
find(x)
union(a,b)
```

Use:

- path compression
- union by size or rank

These produce near-constant amortized operation cost.

## 10. Kruskal Complexity

Sorting dominates:

```text
O(E log E)
```

DSU operations contribute approximately:

```text
O(E α(V))
```

so the standard bound is:

```text
O(E log E)
```

## 11. Prim's Algorithm

Prim grows one tree from a starting vertex.

At each step, choose the minimum-weight edge connecting the current tree to an unvisited vertex.

With an adjacency list and binary heap:

```text
O(E log V)
```

in the standard sparse-graph implementation.

## 12. Prim Mental Model

Think of Prim as maintaining a frontier:

```text
visited vertices | candidate crossing edges | unvisited vertices
```

The minimum frontier edge expands the tree.

## 13. Prim vs Dijkstra

Both can use a min-heap, but they optimize different objectives.

**Dijkstra:** shortest distance from a source.

**Prim:** minimum total cost of a spanning tree.

Prim's priority for a vertex is the cheapest edge connecting it to the growing tree, not its shortest source distance.

## 14. Lazy Prim

A simple implementation can push candidate edges into a heap and ignore edges whose endpoints are already included.

This resembles lazy priority-queue techniques used elsewhere in graph algorithms.

## 15. Eager Prim

An eager implementation maintains, for each unvisited vertex, the best known connecting edge.

A decrease-key or indexed heap can reduce duplicate frontier entries.

## 16. Kruskal vs Prim

Kruskal is naturally edge-centric.

Prim is naturally vertex/frontier-centric.

Useful decision factors:

- graph representation
- density
- edge sorting cost
- need for connected components
- available heap implementation
- memory layout

## 17. Equal-Weight Edges

MSTs are not necessarily unique.

If different edge choices have the same total weight, multiple MSTs can exist.

The algorithm may return any valid MST unless a deterministic tie-breaking policy is required.

## 18. Unique MST

A connected weighted graph has a unique MST when every edge weight is distinct; distinct weights are sufficient but not necessary.

Uniqueness can still occur with tied edge weights if the graph structure prevents alternative equal-cost spanning trees.

## 19. Disconnected Graphs

Kruskal naturally produces a minimum spanning forest by accepting safe edges within each component.

Prim started from one vertex covers only its connected component unless restarted for every unvisited component.

## 20. Negative Edge Weights

MST algorithms can handle negative edge weights.

Unlike shortest paths, adding a negative edge does not create a problem by itself because an MST is constrained to remain acyclic.

## 21. Self-Loops

A self-loop never helps connect two distinct components and therefore cannot belong to an MST.

Kruskal's DSU check rejects it because both endpoints have the same representative.

## 22. Parallel Edges

Parallel edges are allowed.

Only the cheapest relevant edge may be needed for an MST, but the algorithm can safely process all edges and let the cut/cycle logic determine selection.

## 23. MST Correctness — Kruskal

At every accepted edge, the endpoints are in different components.

Therefore adding the edge cannot create a cycle.

The edge is a lightest crossing edge for the current component cut, making it safe by the cut property.

Thus every accepted edge can be extended into an MST.

## 24. MST Correctness — Prim

At every iteration, Prim chooses a minimum-weight edge crossing from the current tree to an unvisited vertex.

By the cut property, that edge is safe.

Repeated safe additions produce an MST.

## 25. Spanning Tree Validation

For a connected graph, validate:

```text
edgeCount = V - 1
all vertices reachable
no cycle
```

If all three hold, the result is a spanning tree.

## 26. MST Weight Validation

For small graphs, enumerate all spanning trees and compare total weights.

This provides a reference oracle for testing optimized implementations.

## 27. DSU Invariants

Useful invariants include:

- every vertex has a valid representative
- representatives are roots
- parent chains terminate
- component sizes are maintained correctly
- `find(find(x)) === find(x)`

## 28. DSU Complexity

With path compression and union by size/rank:

```text
m operations: O(m α(V)) amortized
```

where `α` is the inverse Ackermann function and grows extraordinarily slowly.

## 29. MST and Clustering

Single-linkage clustering is closely related to MSTs.

Removing the largest `k - 1` edges from an MST can produce `k` connected components under the corresponding clustering interpretation.

## 30. Bottleneck Property

For two vertices, the path between them in an MST minimizes the maximum edge weight among all paths between those vertices.

This is called the **minimum bottleneck path property** of MST paths.

## 31. Maximum Spanning Tree

Replace minimum edge selection with maximum edge selection.

The same structural algorithms can produce a maximum spanning tree.

## 32. Second-Best MST Preview

To analyze a second-best MST, a common technique is:

1. build an MST
2. consider each non-tree edge
3. add it to create a cycle
4. remove the appropriate maximum-weight edge from that cycle
5. evaluate the resulting tree

Efficient implementations use LCA/binary lifting or related maximum-edge-on-path structures.

## 33. MST with Constraints

Real systems may impose constraints such as:

- mandatory edges
- forbidden edges
- degree limits
- geographic restrictions
- budget constraints

These can change the problem beyond the classical MST model.

Do not assume a standard MST algorithm remains valid under arbitrary additional constraints.

## 34. Backend Application: Network Infrastructure

Services, zones, or facilities can be represented as vertices and connection costs as weighted edges.

An MST provides a minimum-cost connected infrastructure under the graph's assumptions.

Production network design additionally requires redundancy, latency, capacity, and failure tolerance.

## 35. Backend Application: Service Topology

For a simplified service topology, an MST can identify a low-cost connectivity backbone.

It should not automatically replace production topology planning where resilience requires cycles and redundant paths.

## 36. Backend Application: Data Center Connectivity

Rack/region connectivity can be modeled as a weighted graph.

MST reasoning can minimize construction cost when only connectivity is required.

## 37. AI Application: Clustering

MSTs can support graph-based clustering and hierarchical segmentation.

The tree compresses connectivity information while preserving important bottleneck relationships.

## 38. AI Application: Similarity Graphs

A weighted similarity/distance graph can be reduced to an MST before downstream graph analysis when the reduced connectivity structure is sufficient for the task.

## 39. AI Application: Image/Graph Segmentation

MST-based methods can represent relationships among neighboring regions or pixels using a compact tree structure.

The exact objective determines whether an MST is appropriate.

## 40. Memory Engineering

Kruskal requires storing edges for sorting.

Prim can work directly from adjacency lists but needs frontier state.

For very large graphs, memory layout and integer IDs can materially affect practical performance.

## 41. Deterministic MSTs

For reproducible output, define a total edge ordering such as:

```text
(weight, min(u,v), max(u,v), edgeId)
```

This determines which equal-weight edges are considered first.

## 42. Testing Strategy

Test:

- single vertex
- simple tree
- complete graph
- equal-weight graph
- negative weights
- parallel edges
- self-loops
- disconnected graph
- multiple MSTs
- unique MST

## 43. Differential Testing

Compare Kruskal and Prim on the same graph.

The exact edge sets may differ when multiple MSTs exist, so compare total weight and spanning-tree validity rather than requiring identical edges.

## 44. Property Testing

For a connected graph:

- result has `V - 1` edges
- result is connected
- result is acyclic
- result weight is no greater than independently verified alternatives

For small graphs, compare against exhaustive enumeration.

## 45. Benchmarking

Measure:

- edge sorting
- DSU operations
- heap operations
- graph traversal
- memory usage
- sparse vs dense behavior
- duplicate-edge overhead

## 46. Common Mistakes

- using MST algorithms on directed graphs without reformulating the problem
- confusing MST with shortest-path tree
- assuming the MST is unique
- forgetting disconnected components
- implementing DSU without correct union logic
- comparing exact edge sets when several MSTs are valid
- ignoring mandatory/forbidden constraints

## 47. Interview Framework

For “minimum spanning tree”:

1. confirm the graph is weighted and undirected
2. clarify connected vs forest requirements
3. choose Kruskal or Prim
4. state the relevant invariant/cut property
5. implement DSU or heap frontier
6. validate `V - 1` edges and connectivity
7. derive complexity
8. discuss equal weights and non-unique MSTs
9. compare with shortest-path algorithms

## 48. Revision Checklist

- [ ] Define an MST.
- [ ] Explain the cut property.
- [ ] Explain the cycle property.
- [ ] Implement DSU.
- [ ] Implement Kruskal.
- [ ] Implement Prim.
- [ ] Compare lazy and eager Prim.
- [ ] Handle disconnected graphs as forests.
- [ ] Handle negative weights.
- [ ] Validate an MST.
- [ ] Explain MST vs shortest-path tree.
- [ ] Understand bottleneck paths.
- [ ] Understand second-best MST techniques.
- [ ] Apply MST reasoning to backend and AI systems.

## Key Takeaways

1. An MST minimizes total edge weight while connecting all vertices of a connected undirected graph.
2. Kruskal is edge-centric and uses DSU to prevent cycles.
3. Prim is frontier-centric and repeatedly chooses the cheapest connecting edge.
4. The cut property provides the central correctness argument.
5. Negative edge weights are valid for MSTs.
6. Multiple MSTs can exist when edge weights tie.
7. MST is fundamentally different from a shortest-path tree.
