# 10.19 — Union-Find / Disjoint Set Patterns: Connectivity, Merging & Dynamic Components

## 1. Objective

Disjoint Set Union (DSU), also called Union-Find, maintains a collection of non-overlapping sets while supporting connectivity queries and component merges.

Core operations:

```text
find(x) → representative of x's component
union(a, b) → merge two components
```

## 2. Why It Exists

Repeatedly discovering whether two elements belong to the same connected component can be expensive with naive traversal. DSU incrementally maintains connectivity as relationships are added.

## 3. Parent Representation

Each element points toward a representative through a parent relationship.

Initially:

```text
parent[x] = x
```

A root is an element whose parent is itself.

## 4. Component Invariant

Every element belongs to exactly one component, and following parent links eventually reaches exactly one root.

The root identifies the component.

## 5. Find

`find(x)` follows parent links until reaching the root.

The naive tree can become tall, making repeated finds expensive.

## 6. Path Compression

During `find`, redirect visited nodes toward the root.

This flattens future paths and dramatically improves amortized performance.

## 7. Union

To merge components, find both roots and connect one root beneath the other.

Never blindly connect arbitrary nodes; component metadata belongs at roots.

## 8. Union by Size / Rank

Attach the smaller tree to the larger tree or use rank as an approximate height bound.

This prevents pathological tree growth.

## 9. Combined Optimization

Path compression + union by size/rank gives near-constant amortized operations, commonly expressed as `O(α(N))`, where `α` is the inverse Ackermann function.

For practical input sizes, `α(N)` grows extremely slowly.

## 10. Component Count

Maintain a component counter initialized to `N`.

A successful union decreases it by one; attempting to union elements already in the same component does not.

## 11. Connectivity Queries

Two elements are connected exactly when their representatives are equal.

```text
find(a) === find(b)
```

## 12. Cycle Detection in Undirected Graphs

For each edge `(u, v)`:

- if `find(u) === find(v)`, the edge connects vertices already connected;
- otherwise union their components.

This detects a cycle under the standard undirected incremental-edge model.

## 13. Connected Components

Process every edge with union. The resulting roots represent connected components.

A final scan can group vertices by representative.

## 14. Kruskal's Algorithm

Kruskal sorts edges by weight and adds an edge when its endpoints belong to different components.

DSU makes the cycle-safety test efficient.

Sorting dominates the typical complexity:

```text
O(E log E) + O(E α(V))
```

## 15. Why Kruskal Is Correct

The key is the cut property: the lightest edge crossing an appropriate cut is safe for an MST.

DSU implements the component constraint; it does not itself prove the greedy choice.

## 16. Offline Connectivity

If all union operations and connectivity queries are known in advance and edges only get added, DSU is often an ideal offline solution.

## 17. Dynamic Components

DSU naturally handles monotonic connectivity:

```text
separate components
→ add connection
→ components merge
```

It does not naturally support arbitrary edge deletion.

## 18. Why Deletion Is Hard

Removing an edge can split a component into multiple components. Standard DSU has already discarded the internal graph structure needed to reconstruct that split.

Dynamic connectivity with deletions requires different techniques such as rollback/offline processing or specialized dynamic graph structures.

## 19. Weighted / Metadata DSU

Store component-level metadata at roots:

- size;
- sum;
- minimum/maximum;
- application-specific aggregate.

When merging, combine root metadata according to the component invariant.

## 20. Weighted Relationships

Some DSU variants store relative information between a node and its parent, such as offsets, parity, or ratios.

Path compression must update that metadata consistently.

## 21. Parity DSU

Parity information can represent whether two vertices have the same or opposite color under constraints.

This can support incremental bipartiteness checks in suitable models.

## 22. Potential / Difference DSU

Store a potential difference between each node and its parent.

When components merge, derive the root-to-root potential relation from the new constraint.

This is useful for equations of the form:

```text
value[a] - value[b] = d
```

## 23. DSU with Rollback

Rollback DSU records reversible parent/size changes so previous states can be restored.

Path compression is usually avoided or carefully constrained because arbitrary compression complicates rollback history.

## 24. Offline Dynamic Connectivity

A common technique processes time intervals during which edges are active, using a segment tree over time and rollback DSU.

Each active edge is inserted into the relevant time segments, then DFS over the time structure applies and rolls back unions.

## 25. DSU on Trees Is Different

The phrase “DSU on tree” usually refers to a subtree-query optimization technique, not the ordinary Union-Find data structure.

Do not conflate the two concepts.

## 26. Grid Connectivity

Map grid cells to integer IDs and union adjacent active cells.

This can track connected regions as cells become active.

## 27. Image / Region Components

The same model applies to connected-region labeling when adjacency is fixed and components only merge.

## 28. Backend Applications

DSU can model:

- account/entity consolidation;
- infrastructure connectivity;
- tenant/resource grouping;
- dependency clusters;
- network component tracking;
- offline relationship analysis.

## 29. AI Applications

Applications include:

- clustering under pairwise merge constraints;
- connected-component preprocessing;
- entity-resolution grouping;
- graph preprocessing;
- segmentation pipelines.

DSU itself is a connectivity structure, not a general clustering-quality algorithm.

## 30. Correctness Proof

Prove:

1. every parent chain reaches a root;
2. each root represents exactly one component;
3. `find` returns the component representative;
4. successful union merges exactly two distinct components;
5. path compression preserves component membership;
6. metadata remains correct after root merges.

## 31. Complexity

With path compression and union by size/rank:

```text
m operations over n elements: O(m α(n)) amortized
space: O(n)
```

Kruskal additionally requires edge sorting.

Rollback and weighted variants have their own constant factors and metadata costs.

## 32. Common Mistakes

1. Forgetting to union roots.
2. Updating component count on redundant unions.
3. Storing metadata on non-root nodes without a clear invariant.
4. Combining path compression and rollback carelessly.
5. Using DSU for arbitrary deletions without another strategy.
6. Confusing DSU with DSU-on-tree.
7. Claiming DSU proves Kruskal correctness.
8. Ignoring edge direction when applying undirected connectivity logic.

## 33. Edge Cases

Test:

- zero elements;
- one element;
- repeated union of the same pair;
- self-loop;
- already-connected endpoints;
- long initial chains;
- isolated vertices;
- duplicate edges;
- disconnected graphs;
- rollback to empty history.

## 34. Testing Strategy

Use:

- naive component-label reference implementations;
- randomized union/query sequences;
- repeated redundant unions;
- invariant checks after every operation;
- metadata consistency checks;
- rollback differential tests;
- Kruskal comparison against brute-force MSTs on small graphs.

## 35. Interview Framework

When incremental connectivity appears:

```text
1. Are components only merging?
2. Do I need connectivity queries?
3. Can I represent each component by a root?
4. Do I need path compression?
5. Do I need union by size/rank?
6. Do I need component metadata?
7. Are deletions present?
8. Is the problem offline?
9. Could rollback be useful?
10. What invariant proves every find/union operation?
```

## 36. Revision Checklist

- [ ] I can implement `find`.
- [ ] I understand path compression.
- [ ] I can implement union by size/rank.
- [ ] I can track component count.
- [ ] I can detect undirected cycles.
- [ ] I understand Kruskal + DSU.
- [ ] I know why deletions are difficult.
- [ ] I understand weighted/parity DSU.
- [ ] I understand rollback DSU conceptually.
- [ ] I can explain backend and AI applications.

## 37. Key Takeaways

1. **DSU maintains connectivity efficiently when components only merge.**
2. **Path compression and union by size/rank control tree shape and yield near-constant amortized operations.**
3. **Root-level metadata can extend DSU into weighted and application-specific component structures.**
4. **Kruskal uses DSU for efficient cycle/component checks while its optimality comes from the MST cut property.**
5. **Arbitrary deletion is outside standard DSU's natural model and requires additional techniques.**
