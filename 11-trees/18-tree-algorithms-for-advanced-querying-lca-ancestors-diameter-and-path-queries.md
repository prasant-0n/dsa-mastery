# 11.18 — Tree Algorithms for Advanced Querying: LCA, Ancestors, Diameter & Path Queries

## 1. Objective

Advanced tree queries ask for relationships between nodes rather than simply visiting every node. This chapter develops Lowest Common Ancestor (LCA), ancestor queries, tree diameter, path aggregates, distance queries, binary lifting, Euler-tour techniques, and heavy-light decomposition.

## 2. Rooted Tree Model

Many advanced queries require a chosen root. Once rooted, every node has:

- parent;
- depth;
- subtree;
- ancestor chain.

The root choice affects representation but not many undirected structural properties such as diameter.

## 3. Ancestors

Node `u` is an ancestor of `v` when `u` lies on the path from the root to `v`.

The immediate ancestor is the parent.

## 4. Depth

Depth is the number of edges from the root to a node under the standard convention:

```text
depth(root) = 0
```

Depth differences become fundamental to path and LCA algorithms.

## 5. Lowest Common Ancestor

The LCA of nodes `u` and `v` is their deepest common ancestor.

It is the branching point where their root-to-node paths last coincide.

## 6. Naive LCA

A simple method walks ancestors of one node and checks membership in the ancestor chain of the other.

With parent pointers this can cost `O(H)` per query.

## 7. Depth Equalization

If two nodes have different depths, lift the deeper node upward until both nodes have equal depth.

Then move both upward until they meet.

## 8. Binary Lifting

Precompute:

```text
up[v][j] = 2^j-th ancestor of v
```

This allows an ancestor to be reached using the binary representation of the requested jump distance.

## 9. Binary Lifting Preprocessing

For each node:

```text
up[v][0] = parent[v]
up[v][j] = up[ up[v][j-1] ][j-1]
```

For `N` nodes and `O(log N)` levels, preprocessing uses `O(N log N)` time and space.

## 10. LCA with Binary Lifting

To find LCA:

1. equalize depths;
2. if nodes are equal, return that node;
3. inspect powers of two from largest to smallest;
4. lift both nodes when their ancestors differ;
5. return their common parent.

Query complexity is `O(log N)`.

## 11. Ancestor Queries

A node `u` is an ancestor of `v` iff:

```text
tin[u] <= tin[v] && tout[v] <= tout[u]
```

under a DFS Euler-entry/exit timestamp convention.

## 12. Euler Tour

A DFS can record entry and exit times. The resulting intervals encode subtree containment.

A subtree becomes a contiguous interval in Euler order.

## 13. Subtree Queries

If node values are mapped to Euler positions, subtree aggregation can sometimes be reduced to an array range query.

This connects tree algorithms with Fenwick and segment trees.

## 14. Tree Distance

For an unweighted tree:

```text
distance(u,v) = depth[u] + depth[v] - 2 * depth[LCA(u,v)]
```

This is one of the most useful LCA applications.

## 15. K-th Ancestor

Binary lifting can find the k-th ancestor by decomposing `k` into powers of two.

Complexity is `O(log N)` after preprocessing.

## 16. K-th Node on a Path

The k-th node on the path from `u` to `v` can be derived using the LCA and ancestor jumps on the two path segments.

The implementation must define whether `k` is zero-based and whether nodes or edges are counted.

## 17. Tree Diameter

The diameter is the longest shortest path between any pair of tree nodes.

For an unweighted tree, its length is measured in edges under the standard convention.

## 18. Diameter by Two BFS/DFS

One method:

1. choose any node `s`;
2. find a farthest node `a` from `s`;
3. find a farthest node `b` from `a`;
4. distance(`a`,`b`) is the diameter length.

The tree property makes this strategy correct.

## 19. Diameter by Tree DP

A postorder DP can compute the two largest downward path lengths at every node. Their sum gives the best path passing through that node.

This runs in `O(N)`.

## 20. Weighted Tree Diameter

With nonnegative edge weights, the same conceptual diameter approach can be adapted using weighted distances. DFS/BFS traversal becomes distance accumulation rather than unit-level distance.

## 21. Path Queries

Path queries may ask for:

- sum;
- minimum;
- maximum;
- XOR;
- number of marked nodes;
- edge or vertex properties.

The challenge is representing a path efficiently.

## 22. Binary Lifting with Aggregates

Binary-lifting tables can store both ancestors and aggregates along each jump:

```text
up[v][j]
agg[v][j]
```

This supports path-prefix style queries while lifting.

## 23. Heavy-Light Decomposition

Heavy-Light Decomposition (HLD) partitions a tree path into a logarithmic number of heavy-chain segments.

Each chain is mapped to a contiguous array interval.

## 24. Heavy Child

For each node, a heavy child is commonly chosen as the child with the largest subtree size.

The remaining child edges are light.

## 25. Heavy-Light Property

Every time a path crosses a light edge, the subtree size decreases substantially. Therefore a root-to-node path contains only `O(log N)` light edges.

This is the key reason HLD decomposes arbitrary paths into `O(log N)` chain segments.

## 26. HLD + Segment Tree

After mapping chains into an array, a segment tree or Fenwick-style structure can answer aggregates over chain segments.

A path query repeatedly moves the deeper chain upward until both nodes share a chain.

## 27. Path Update

HLD can support path updates by applying an update to each chain segment.

With a lazy segment tree, many range-update/path-query combinations become `O(log² N)`.

## 28. Subtree + Path Hybrid Queries

Euler ordering and HLD can coexist. A system may support subtree updates as contiguous intervals while using HLD for arbitrary paths.

The update/query algebra must be defined carefully when operations interact.

## 29. Virtual Trees

When only a small subset of nodes matters for a query, a virtual tree compresses relevant nodes and their LCAs into a much smaller tree.

This is useful for batch queries over marked nodes.

## 30. Offline LCA

Tarjan's offline LCA algorithm answers a known batch of LCA queries using DFS and disjoint-set union. It trades online query capability for efficient batch processing.

## 31. Euler Tour + RMQ LCA

An Euler tour of node visits can reduce LCA to a Range Minimum Query problem over depths. Depending on the RMQ structure, query performance can be `O(1)` after preprocessing, with different preprocessing/space trade-offs.

## 32. Complexity Comparison

| Technique | Preprocessing | Query |
|---|---:|---:|
| Parent climbing | `O(N)` setup | `O(H)` |
| Binary lifting | `O(N log N)` | `O(log N)` |
| Euler + RMQ | varies | can reach `O(1)` |
| HLD + segment tree | `O(N log N)` typical | `O(log² N)` typical |
| Diameter DP | `O(N)` | one computation |

## 33. Correctness Invariants

For advanced tree-query systems validate:

1. parent/depth consistency;
2. ancestor-table recurrence;
3. Euler entry/exit containment;
4. LCA ancestry and minimality;
5. path decomposition coverage;
6. aggregate correctness across every segment.

## 34. Common Mistakes

1. Mixing node-count and edge-count distance conventions.
2. Using an insufficient binary-lifting table height.
3. Mishandling the root's missing parent.
4. Incorrectly defining Euler timestamps.
5. Forgetting final same-chain segment in HLD.
6. Combining edge and vertex values incorrectly.
7. Assuming arbitrary graphs have tree-specific LCA properties.

## 35. Edge Cases

Test:

- empty tree;
- one node;
- root queries;
- same-node LCA;
- ancestor/descendant pairs;
- highly skewed trees;
- balanced trees;
- weighted edges;
- zero-weight edges;
- path endpoints;
- large k-th ancestor requests.

## 36. Backend Applications

Advanced tree queries can support:

- organizational hierarchy queries;
- dependency trees;
- permission inheritance;
- routing/tree-shaped networks;
- hierarchical metrics;
- version ancestry.

## 37. AI Applications

They can support:

- hierarchical label relationships;
- taxonomy traversal;
- search-tree path scoring;
- dependency/AST ancestry queries;
- hierarchical retrieval structures.

## 38. Testing Strategy

Use:

- brute-force path reconstruction;
- naive LCA as a reference;
- random tree generation;
- binary-lifting differential tests;
- Euler ancestor tests;
- HLD-vs-brute-force path aggregation;
- diameter-vs-all-pairs validation on small trees.

## 39. Interview Framework

```text
1. What query is required: ancestor, LCA, distance, path, or subtree?
2. Is the tree static or dynamic?
3. Are queries online or offline?
4. What is N and Q?
5. Can preprocessing be O(N log N)?
6. Is the aggregate associative?
7. Do we need updates?
8. Would binary lifting, Euler/RMQ, or HLD fit?
9. What are the exact indexing/counting conventions?
10. How will correctness be validated?
```

## 40. Revision Checklist

- [ ] I can derive naive LCA.
- [ ] I understand binary lifting.
- [ ] I can answer k-th ancestor queries.
- [ ] I can derive tree distance from LCA.
- [ ] I understand Euler subtree intervals.
- [ ] I can compute tree diameter.
- [ ] I understand path aggregates.
- [ ] I can explain HLD.
- [ ] I understand offline LCA and Euler+RMQ alternatives.
- [ ] I can select a technique from N, Q, updates, and workload constraints.

## 41. Key Takeaways

1. **Advanced tree queries are usually solved by preprocessing structural relationships so repeated queries avoid retraversing the entire tree.**
2. **LCA is a central primitive from which ancestor, distance, and path-position queries can be derived.**
3. **Binary lifting converts ancestor jumps into binary decomposition; Euler methods convert subtree structure into intervals.**
4. **Heavy-Light Decomposition converts arbitrary tree paths into a logarithmic number of array ranges.**
5. **The correct technique depends on query volume, updates, online/offline requirements, aggregate algebra, and memory budget.**
