# 15.08 — Prim's Algorithm & Greedy MST Frontier Expansion

## 1. Concept Definition

Prim's algorithm constructs a minimum spanning tree by starting from one vertex and repeatedly adding the minimum-weight edge that connects the current tree to a vertex outside it.

It is a greedy **frontier-expansion** algorithm.

## 2. Core Mental Model

Maintain two regions:

```text
inside MST | frontier | outside MST
```

At every step, choose the lightest frontier edge that safely expands the tree.

## 3. Cut Property

The vertices already included in the growing tree define a cut.

A minimum-weight edge crossing that cut is safe by the MST cut property.

Therefore Prim's next edge can be selected greedily.

## 4. Algorithm

1. Choose a starting vertex.
2. Mark it as included.
3. Insert its outgoing edges into a min-priority queue.
4. Extract the cheapest frontier edge.
5. Ignore it if its destination is already included.
6. Otherwise add the edge and destination to the tree.
7. Insert the new vertex's outgoing edges.
8. Repeat until all reachable vertices are included.

## 5. Priority Queue Role

The heap stores candidate edges ordered by weight.

This makes the minimum frontier edge available efficiently.

## 6. Lazy Heap Strategy

A common implementation does not delete stale heap entries eagerly.

When an edge is extracted, check whether its destination is already inside the tree.

If so, discard the stale entry.

## 7. Indexed-Key Strategy

Another implementation maintains one best-known connecting edge per outside vertex and supports priority updates.

This can reduce duplicate frontier entries but requires more complex heap operations.

## 8. Lazy vs Eager Prim

**Lazy Prim:** push frontier edges freely and skip stale edges during extraction.

**Eager Prim:** maintain the cheapest known connection for each outside vertex and update it when a better edge appears.

Both implement the same greedy idea.

## 9. Adjacency List Representation

Prim is naturally expressed using adjacency lists:

```text
vertex → [(neighbor, weight), ...]
```

For sparse graphs this avoids scanning nonexistent edges.

## 10. Adjacency Matrix Variant

For dense graphs, an `O(V²)` implementation can scan all candidate connections without a binary heap.

The appropriate implementation depends on graph density and representation.

## 11. Complexity — Binary Heap

With adjacency lists and a binary heap, a common bound is:

```text
O(E log V)
```

for connected graphs, ignoring constant-factor implementation details.

## 12. Complexity — Matrix

With an adjacency matrix and array-based minimum selection:

```text
O(V²)
```

This can be attractive for dense graphs where `E` approaches `V²`.

## 13. Space Complexity

Typical state includes:

- adjacency representation
- visited/in-tree flags
- key/best-edge metadata
- parent information
- priority queue
- resulting edges

Total storage is generally `O(V + E)` for adjacency lists.

## 14. Starting Vertex

For a connected undirected weighted graph, the starting vertex does not change the minimum total MST cost, although it can change which particular MST is returned when multiple MSTs exist.

## 15. Equal-Weight Edges

Equal weights can produce multiple valid MSTs.

Deterministic tie-breaking can make output reproducible without changing the minimum total cost.

## 16. Negative Weights

Prim works with negative edge weights because MST correctness depends on relative edge weights and the cut property, not on non-negative weights.

## 17. Self-Loops

A self-loop cannot improve a spanning tree because it does not connect the tree to a new vertex.

It can be ignored.

## 18. Parallel Edges

Parallel edges are valid.

The lighter connection is generally preferred when it crosses the current cut, while heavier alternatives may become stale.

## 19. Disconnected Graphs

A single Prim traversal only reaches the connected component containing its start vertex.

To construct a minimum spanning forest, restart Prim from each unvisited vertex.

## 20. Prim vs Kruskal

Prim grows one connected tree outward from a frontier.

Kruskal globally processes edges by weight and joins components.

Prim is often natural with adjacency lists; Kruskal is often natural with an edge list.

## 21. Choosing Between Them

Consider:

- graph representation
- sparsity/density
- memory layout
- priority-queue implementation
- need for connected-component handling
- update/workload characteristics

Do not choose solely from memorized complexity formulas.

## 22. Prim vs Dijkstra

Both can use a priority queue and maintain a growing frontier, but their objectives differ.

Prim minimizes total spanning-tree weight.

Dijkstra minimizes source-to-vertex path distances under its edge-weight assumptions.

Their keys and correctness proofs are different.

## 23. Greedy Invariant

At every iteration, the selected edges form a tree over the vertices currently marked inside the frontier expansion.

## 24. Cut Invariant

The next selected edge crosses from the current tree to an outside vertex.

The heap's minimum valid frontier edge is therefore a light edge crossing the current cut.

## 25. Correctness Proof

At every iteration:

1. current edges form a forest/tree
2. the frontier defines a cut
3. the selected minimum frontier edge is safe by the cut property
4. adding it preserves acyclicity and expands the tree

By induction, the final spanning tree is an MST.

## 26. Lazy-Heap Correctness

Stale entries do not compromise correctness because every extracted edge is validated against the current in-tree state before acceptance.

Only a valid edge crossing the cut can be selected.

## 27. Brute-Force Verification

For small graphs, enumerate spanning trees and compare the minimum total weight against Prim's result.

When multiple MSTs exist, compare total cost and validity rather than exact edge identity.

## 28. Differential Testing

Compare:

- lazy Prim
- eager Prim
- Kruskal
- brute-force MST on tiny graphs

This catches representation and heap-update bugs.

## 29. Adversarial Tests

Use:

- dense graphs
- sparse graphs
- equal weights
- negative weights
- parallel edges
- self-loops
- disconnected graphs
- very long chains
- star graphs
- graphs with many stale heap entries

## 30. Backend Applications

Prim's frontier model can support:

- network topology planning
- infrastructure connection design
- low-cost cluster links
- connectivity planning
- physical network construction

Production objectives may also include redundancy, latency, reliability, capacity, or geographic constraints.

## 31. AI Applications

Prim can be used in graph preprocessing and structure extraction, such as constructing compact connectivity backbones from similarity graphs.

The edge-weight definition must match the intended AI objective.

## 32. Performance Engineering

For high-throughput graph workloads, measure:

- heap operations
- stale-entry rate
- adjacency traversal
- memory allocation
- cache behavior
- total edge comparisons

Asymptotic complexity does not reveal every production bottleneck.

## 33. Heap Engineering

A production implementation should define:

- comparator behavior
- tie-breaking
- duplicate entries
- empty extraction semantics
- memory ownership
- numeric precision

## 34. Snapshot and Concurrency Considerations

For mutable graphs, Prim should generally operate on a well-defined graph snapshot or version.

Concurrent mutation during traversal can otherwise invalidate the meaning of the frontier and correctness proof.

## 35. Dynamic MST Boundary

Repeated edge insertion/deletion is not efficiently solved by simply restarting Prim after every update.

Dynamic MST algorithms use more advanced data structures and update strategies.

## 36. Common Mistakes

- confusing Prim with Dijkstra
- using the wrong priority key
- failing to skip stale entries
- assuming the graph is connected
- forgetting to mark vertices as included
- inserting duplicate or invalid state incorrectly
- comparing exact MST edges when multiple MSTs exist

## 37. Interview Framework

For “find the minimum-cost network connecting all nodes”:

1. recognize MST
2. choose Prim when adjacency/frontier growth is natural
3. maintain a min-heap of frontier edges
4. repeatedly select the cheapest valid crossing edge
5. skip edges leading to already included vertices
6. stop after `V - 1` edges
7. prove safety using the cut property
8. derive complexity

## 38. Revision Checklist

- [ ] Explain Prim's frontier model.
- [ ] Implement lazy Prim.
- [ ] Understand eager Prim.
- [ ] Explain heap-based complexity.
- [ ] Explain the matrix variant.
- [ ] Prove the cut invariant.
- [ ] Handle disconnected graphs.
- [ ] Handle equal/negative/parallel edges.
- [ ] Distinguish Prim from Dijkstra.
- [ ] Compare Prim with Kruskal.
- [ ] Verify with differential testing.

## Key Takeaways

1. Prim grows an MST by repeatedly selecting the cheapest edge crossing the current tree's cut.
2. The cut property is the core correctness theorem.
3. Lazy Prim is simple because stale heap entries can be discarded when extracted.
4. Adjacency-list heap Prim is commonly `O(E log V)`; matrix Prim is `O(V²)`.
5. Starting vertices can change the returned MST but not the minimum cost.
6. Prim's frontier model is useful in network, graph-processing, backend, and AI preprocessing systems.
