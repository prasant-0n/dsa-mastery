# 11.19 — Tree Algorithms in Graph Systems: Forests, Dynamic Trees & Link-Cut Trees

## 1. Objective

Real systems often manage a **forest** rather than one fixed tree. Components can merge, split, reconnect, and change over time. This chapter develops dynamic connectivity and dynamic-tree reasoning, from disjoint-set forests to Euler-tour trees and Link-Cut Trees.

## 2. Forest Model

A forest is a collection of disjoint trees. Unlike a rooted static tree, components may change as edges are added or removed.

## 3. Static Forest Traversal

A forest can be processed by starting DFS/BFS from every unvisited vertex. Total traversal remains `O(V + E)` for a forest.

## 4. Connected Components

In a forest, each tree is one connected component. Component identification is foundational for dynamic connectivity problems.

## 5. Disjoint Set Union

Disjoint Set Union (DSU), also called Union-Find, maintains a partition of elements under operations such as:

```text
find(x)
union(a, b)
```

## 6. DSU Parent Forest

Each set is represented by a rooted parent forest. A root is identified by a parent pointer to itself or another chosen sentinel convention.

## 7. Path Compression

`find(x)` can compress the path from `x` directly toward its representative. Repeated operations become extremely efficient amortized.

## 8. Union by Rank/Size

When merging components, attach the smaller tree beneath the larger one or use rank metadata. Combined with path compression, DSU operations have inverse-Ackermann amortized complexity.

## 9. DSU Correctness Invariants

For every node, parent links eventually reach exactly one representative. Union must never create a cycle between distinct representatives.

## 10. DSU Limitations

Standard DSU supports edge additions efficiently but does not directly support arbitrary edge deletions. Deletions require different techniques or offline transformations.

## 11. Offline Dynamic Connectivity

If all operations are known in advance, divide-and-conquer over time or a segment tree over active intervals can transform dynamic connectivity with deletions into repeated DSU operations with rollback.

## 12. DSU Rollback

Rollback DSU records changes made during unions so a previous state can be restored. Path compression is usually avoided or carefully constrained because arbitrary compression complicates rollback.

## 13. Time-Interval Edge Activation

For an edge active during `[start,end)`, insert that edge into the segment-tree nodes covering its active time interval. DFS over the time tree applies relevant unions and rolls them back afterward.

## 14. Dynamic Tree Problem

A dynamic-tree data structure may need to support:

- link two components;
- cut an existing edge;
- determine connectivity;
- query a path;
- update a path;
- expose a root-to-node relationship.

These requirements exceed ordinary DSU.

## 15. Euler-Tour Trees

Euler-Tour Trees represent a dynamic forest using balanced sequence structures over Euler-tour representations. They can support connectivity and certain dynamic subtree/component operations.

## 16. Euler-Tour Representation

A tree traversal can be represented as a sequence of directed edge appearances. Dynamic sequence operations then correspond to forest operations.

## 17. Link Operation

To link two trees, their Euler-tour sequences can be joined after appropriate rerooting/sequence manipulation.

The exact representation determines implementation details.

## 18. Cut Operation

Cutting an edge removes the corresponding traversal occurrences and splits one Euler-tour sequence into multiple sequences representing the resulting components.

## 19. Link-Cut Trees

Link-Cut Trees maintain a dynamic forest and support path-based operations using splay trees. They expose preferred paths and dynamically restructure auxiliary trees.

## 20. Why Splay Trees Appear

Splay operations move accessed nodes toward the root of an auxiliary tree. This supports dynamic preferred-path changes without maintaining one fixed decomposition.

## 21. Access Operation

The `access(x)` operation changes preferred-path structure so that the path from the represented root to `x` becomes exposed through auxiliary-tree relationships.

Understanding `access` is the conceptual center of Link-Cut Trees.

## 22. Preferred vs Represented Tree

A Link-Cut Tree has two different structures:

1. the represented forest;
2. auxiliary splay trees used to maintain preferred paths.

Confusing these layers is a common source of implementation errors.

## 23. Make-Root

`makeRoot(x)` typically accesses `x` and reverses the exposed path so that `x` becomes the represented-tree root.

Lazy reversal flags allow this path orientation to be changed without immediately rewriting every descendant pointer.

## 24. Link-Cut Path Query

After exposing a path, aggregate metadata in the auxiliary tree can represent information over that represented-tree path.

Possible aggregates include sum, minimum, maximum, XOR, or other composable operations.

## 25. Path Updates

Lazy propagation inside the auxiliary splay tree can apply an update to an exposed represented-tree path.

The aggregate/update algebra must be explicitly defined.

## 26. Cut in Link-Cut Trees

After making the desired endpoint the represented root and exposing the other endpoint, the target edge can be isolated and removed while preserving the represented forest invariant.

## 27. Splay Lazy Propagation

Link-Cut implementations may combine:

- parent pointers;
- child pointers;
- subtree aggregate;
- node value;
- reverse flag;
- lazy update tags.

Push/pull ordering is critical.

## 28. Aggregate Invariants

For every auxiliary splay node, stored aggregate must match exactly the nodes in its auxiliary subtree after all pending lazy transformations are logically applied.

## 29. Amortized Complexity

Standard Link-Cut Tree operations have `O(log N)` amortized complexity under the classical analysis, rather than a simple worst-case bound per individual splay step.

## 30. Dynamic Tree vs HLD

Heavy-Light Decomposition is excellent when the underlying tree is mostly static. Link-Cut Trees are designed for forests whose topology itself changes dynamically.

The choice depends on whether link/cut operations are required and on implementation complexity.

## 31. Dynamic Connectivity vs Dynamic Paths

DSU answers component connectivity under insertions. Dynamic-tree structures additionally maintain path and topology information. Do not choose a sophisticated dynamic-tree structure when connectivity-only operations are sufficient.

## 32. Offline vs Online

Offline algorithms can exploit future operations and often simplify dynamic deletion problems. Online structures must answer each operation without knowledge of future requests.

## 33. Correctness Strategy

Prove separately:

1. represented-forest validity;
2. auxiliary-tree validity;
3. parent-pointer consistency;
4. lazy-tag correctness;
5. aggregate correctness;
6. link/cut preservation of acyclicity and component structure.

## 34. Common Mistakes

1. Confusing represented-tree edges with auxiliary splay edges.
2. Forgetting to push reverse/lazy flags before structural decisions.
3. Applying path compression to rollback DSU carelessly.
4. Using DSU when deletions are required online.
5. Mixing amortized and worst-case complexity claims.
6. Failing to maintain aggregate metadata after rotations.

## 35. Edge Cases

Test:

- empty forest;
- singleton components;
- repeated union;
- linking already-connected vertices;
- cutting invalid edges;
- cutting bridges;
- repeated link/cut cycles;
- path of one node;
- path updates on endpoints;
- highly skewed represented trees.

## 36. Backend Applications

Dynamic forests can model:

- changing organizational hierarchies;
- dependency graphs constrained to forests;
- network topology;
- hierarchical resource ownership;
- dynamic routing trees;
- evolving component relationships.

## 37. AI Applications

Dynamic-tree techniques can support:

- evolving search structures;
- hierarchical candidate relationships;
- dynamic clustering approximations;
- changing dependency trees;
- online graph/tree feature maintenance.

## 38. Testing Strategy

Use a simple reference forest for small random workloads and compare every operation against the optimized structure.

For Link-Cut Trees, validate after randomized sequences of:

```text
link → cut → makeRoot → pathQuery → pathUpdate
```

## 39. Interview Framework

```text
1. Is the structure static or dynamically changing?
2. Are only insertions needed?
3. Are deletions required?
4. Are path queries required?
5. Are operations online or offline?
6. Can DSU solve the problem?
7. Would Euler-Tour Trees fit?
8. Would HLD be enough?
9. Do Link-Cut Trees justify their complexity?
10. What are the amortized invariants?
```

## 40. Revision Checklist

- [ ] I understand forests and dynamic connectivity.
- [ ] I can explain DSU.
- [ ] I understand path compression and union by size/rank.
- [ ] I understand DSU rollback.
- [ ] I know why DSU cannot directly handle arbitrary online deletions.
- [ ] I understand Euler-Tour Tree concepts.
- [ ] I understand represented vs auxiliary trees.
- [ ] I can explain Link-Cut `access`.
- [ ] I understand `makeRoot`, `link`, and `cut` conceptually.
- [ ] I can reason about amortized complexity and invariants.

## 41. Key Takeaways

1. **A forest is the natural model when tree connectivity changes over time.**
2. **DSU is exceptionally effective for incremental connectivity but has important deletion limitations.**
3. **Offline rollback techniques can transform some deletion problems into manageable DSU workloads.**
4. **Euler-Tour Trees and Link-Cut Trees address genuinely dynamic forest problems with different operation models.**
5. **Link-Cut Trees are powerful because they dynamically expose paths, but their correctness depends on maintaining multiple interacting invariants.**
