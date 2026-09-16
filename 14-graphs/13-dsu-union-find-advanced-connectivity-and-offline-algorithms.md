# 14.13 — DSU / Union-Find: Advanced Connectivity & Offline Algorithms

## 1. Concept Definition

**Disjoint Set Union (DSU)**, also called Union-Find, maintains a partition of elements into disjoint sets.

Core operations:

```text
find(x)  → representative of x's component
union(a,b) → merge two components
```

## 2. Why It Matters

DSU is a foundational connectivity primitive for:

- Kruskal's MST
- dynamic component merging
- connectivity queries
- offline graph processing
- clustering
- image segmentation
- equivalence classes

## 3. Forest Representation

Each set is represented as a rooted tree.

```text
parent[x] = parent of x
parent[root] = root
```

The representative identifies the component.

## 4. Path Compression

During `find(x)`, compress the path so visited vertices point directly toward the root.

This dramatically reduces future lookup depth.

## 5. Union by Size

Attach the smaller tree beneath the larger tree.

Maintain:

```text
size[root]
```

Only roots need authoritative component size.

## 6. Union by Rank

Maintain an approximate tree-height rank and attach the lower-rank root under the higher-rank root.

When ranks tie, choose one root and increment its rank.

## 7. Combined Complexity

With path compression plus union by size/rank:

```text
m operations on n elements: O(m α(n)) amortized
```

This is effectively near-constant for practical input sizes.

## 8. DSU Invariants

Maintain:

- every parent pointer is a valid element
- every root points to itself
- parent chains terminate
- one root represents each component
- component metadata belongs to the representative

## 9. Connectivity Query

Two elements are connected exactly when:

```text
find(a) === find(b)
```

This is the fundamental DSU query.

## 10. Component Count

Start with `n` components.

Every successful union decreases the component count by one.

An attempted union within one component does not change the count.

## 11. Redundant Edge Detection

An edge `(u,v)` is redundant for connectivity if:

```text
find(u) === find(v)
```

before adding it.

This is the core idea behind Kruskal cycle rejection.

## 12. Equivalence Classes

DSU is not limited to graphs.

It can represent equivalence relations such as:

- aliases
- merged identities
- connected pixels
- synchronized resources
- symbolic equivalence classes

## 13. Offline Dynamic Connectivity

Suppose edges are added and connectivity is queried over time.

Process events chronologically and apply each edge addition with DSU.

This handles insertion-only connectivity efficiently.

## 14. Why Deletions Are Harder

DSU naturally supports merging but not arbitrary deletion.

Removing an edge can split a component, which cannot generally be repaired by a simple inverse of `union`.

This motivates offline reversal, rollback DSU, and dynamic-tree techniques.

## 15. Reverse-Time Processing

For offline problems with deletions:

1. start from the graph state after all deletions
2. process events backward
3. convert deletion into an addition
4. answer connectivity queries in reverse

This can turn an otherwise difficult deletion problem into DSU-friendly insertion processing.

## 16. Rollback DSU

A rollback DSU supports undoing recent union operations without path compression that destroys historical information.

Typical structure stores a change stack.

## 17. Rollback Principle

Before a mutation, record enough state to restore the previous DSU state.

Then:

```text
snapshot = history.length
...
rollback(snapshot)
```

restores the partition.

## 18. Why Standard Path Compression Is Problematic for Rollback

Path compression performs many parent mutations during `find`.

Recording every mutation is possible but complicates the structure.

Rollback DSU commonly uses union by size/rank without path compression, keeping tree height logarithmic.

## 19. Rollback Complexity

With union by size/rank and rollback:

```text
find: approximately O(log n)
union: O(log n) or better under suitable representation
rollback: proportional to recorded changes
```

Exact bounds depend on the implementation and operations being measured.

## 20. Offline Dynamic Connectivity with Segment Trees

A standard advanced technique maps each edge's active time interval onto a segment tree over time.

For every segment-tree node, add edges active throughout that node's interval.

DFS over the time tree while using rollback DSU answers connectivity queries at each time.

## 21. Time-Interval Decomposition

If an edge exists during `[l,r)`, decompose that interval into `O(log Q)` segment-tree nodes.

Each DFS path accumulates exactly the edges active at that time.

## 22. Offline Dynamic Connectivity Complexity

For `Q` events, each edge interval may be stored in `O(log Q)` segment-tree nodes.

With rollback DSU, the overall approach is typically near:

```text
O((E log Q + Q) log V)
```

up to implementation details and inverse-Ackermann/log factors.

## 23. Bipartite Connectivity with DSU

Plain DSU can answer connectivity, but bipartiteness requires additional parity information.

A parity DSU tracks whether a vertex has the same or opposite color relative to its representative.

## 24. Weighted / Potential DSU

A generalized DSU can store relative potentials between nodes and representatives.

This supports constraints such as:

```text
value[a] - value[b] = c
```

when the algebra and consistency rules are designed appropriately.

## 25. Potential Consistency

When joining two components, calculate the relative potential required by the new constraint.

If the components are already connected, verify that the new relation agrees with the stored potential difference.

## 26. DSU for Constraint Satisfaction

Difference constraints and equivalence-style constraints can sometimes be represented using weighted DSU.

The choice depends on whether the constraints form an equivalence relation with relative offsets.

## 27. Small-to-Large Merging

A related technique merges smaller containers into larger containers.

If every element moves only when its containing structure at least doubles, each element moves `O(log n)` times.

This is useful for maintaining per-component metadata.

## 28. DSU with Component Metadata

A component representative can maintain:

- size
- minimum/maximum value
- aggregate sum
- counts
- custom statistics

When two components merge, combine their metadata according to an associative rule.

## 29. Metadata Correctness

After every successful union:

```text
metadata[newRoot] = combine(metadata[rootA], metadata[rootB])
```

Metadata of non-root nodes should not be treated as authoritative unless the representation explicitly requires it.

## 30. DSU and Kruskal Revisited

Kruskal is an example of DSU used inside a greedy graph algorithm.

The DSU answers whether an edge would create a cycle in the currently selected forest.

## 31. DSU and Connected Components

Given an undirected graph, union both endpoints of every edge.

After processing all edges, vertices with equal representatives belong to the same connected component.

## 32. DSU vs DFS/BFS

DFS/BFS can discover components in `O(V+E)` for a static graph.

DSU becomes especially useful when connectivity must be maintained across many edge additions or when processing edges as independent union events.

## 33. DSU vs Dynamic Trees

DSU cannot efficiently support arbitrary link/cut operations.

For dynamic forests with deletions and path queries, techniques such as Euler-Tour Trees or Link-Cut Trees are more appropriate.

## 34. Backend Application: Cluster Merging

When groups repeatedly merge, DSU can maintain group membership efficiently.

Examples include resource pools, topology components, and offline relationship consolidation.

## 35. Backend Application: Dependency Components

Service or module relationships can be reduced to connected components for architectural analysis.

DSU is useful when relationships are added incrementally.

## 36. Backend Application: Batch Event Processing

A stream of merge events can be processed with DSU to answer whether two entities have become connected.

For deletions, use an appropriate offline or dynamic-connectivity strategy.

## 37. AI Application: Image Segmentation

Adjacent pixels or regions can be merged into components according to similarity rules.

DSU efficiently maintains the resulting connected regions.

## 38. AI Application: Clustering

Thresholded similarity edges can be processed with DSU to form connected clusters.

This produces connectivity-based clusters rather than arbitrary centroid-based clusters.

## 39. AI Application: Entity Resolution

If rules establish that two records represent the same equivalence class, DSU can merge them and provide a canonical component representative.

## 40. Memory Engineering

For integer IDs, typed arrays can store parent, size/rank, and optional metadata compactly.

Avoid per-node objects when millions of elements make object overhead significant.

## 41. Iterative Find

An iterative implementation avoids JavaScript recursion depth concerns.

A two-pass strategy can:

1. find the root
2. compress the path iteratively

## 42. Defensive API Design

Define behavior for:

- invalid indices
- repeated union
- self-union
- empty DSU
- snapshot misuse
- rollback beyond available history

Production code should fail predictably rather than silently corrupting component state.

## 43. Testing Strategy

Test:

- singleton components
- repeated unions
- self-unions
- chain unions
- balanced unions
- connectivity queries
- component counts
- rollback snapshots
- dynamic intervals
- parity constraints
- weighted constraints

## 44. Differential Testing

Compare DSU connectivity against a brute-force DFS/BFS reference on small graphs after every generated operation.

For rollback, compare every snapshot state against a persistent/reference model.

## 45. Property Testing

Useful properties:

- `find(find(x)) === find(x)`
- connectivity is symmetric
- union is idempotent
- if `union(a,b)` succeeds, `find(a) === find(b)` afterward
- component count decreases exactly on successful merges
- rollback restores the prior partition

## 46. Benchmarking

Measure:

- random unions
- adversarial chain unions
- repeated finds
- connectivity queries
- rollback workloads
- metadata merges
- typed-array vs object representations

## 47. Common Mistakes

- confusing DSU with a general graph traversal
- forgetting path compression or union balancing
- mutating non-root metadata incorrectly
- using path compression in rollback DSU without accounting for history
- attempting arbitrary edge deletion with plain DSU
- assuming DSU supports path queries

## 48. Interview Framework

For “dynamic connectivity”:

1. identify whether operations are insertion-only or include deletion
2. if insertion-only, consider DSU
3. add path compression and union by size/rank
4. define component semantics
5. if deletions are offline, consider reverse processing or rollback DSU
6. if interval lifetimes exist, consider a time segment tree + rollback DSU
7. if online deletions/path queries are required, consider dynamic trees

## 49. Revision Checklist

- [ ] Implement `find`.
- [ ] Implement union by size.
- [ ] Implement union by rank.
- [ ] Explain path compression.
- [ ] Derive `O(m α(n))` amortized complexity.
- [ ] Track component counts.
- [ ] Maintain component metadata.
- [ ] Understand insertion-only connectivity.
- [ ] Explain why deletion is difficult.
- [ ] Implement rollback DSU.
- [ ] Understand offline dynamic connectivity.
- [ ] Understand parity/potential DSU.
- [ ] Apply DSU to backend and AI systems.

## Key Takeaways

1. DSU maintains disjoint connectivity components efficiently.
2. Path compression plus union by size/rank gives near-constant amortized operations.
3. DSU naturally supports merging, not arbitrary deletion.
4. Rollback DSU enables controlled historical restoration.
5. Time-segment-tree + rollback DSU is a powerful offline dynamic-connectivity pattern.
6. Parity and potential metadata extend DSU to richer constraints.
7. Small-to-large merging is a related technique for component metadata.
