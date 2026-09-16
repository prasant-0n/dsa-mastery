# 11.07 — Binary Tree Views, Boundary Traversal, Vertical Order & Diagonal Traversal

## 1. Objective

Tree-view problems ask for nodes visible under a particular geometric or traversal interpretation. They are fundamentally coordinate-and-order problems built on top of DFS or BFS.

## 2. The Core Mental Model

Assign structural coordinates to nodes.

For a binary tree, a useful coordinate system is:

```text
row/depth
column/horizontal distance
```

Moving left decreases column; moving right increases it.

The chosen traversal determines tie-breaking when multiple nodes occupy the same coordinate.

## 3. Left View

The left view contains the first visible node at each depth when observing the tree from the left.

BFS can record the first node of every level. DFS can also work when it visits left children before right children and records the first node at each depth.

## 4. Right View

The right view contains the first visible node at each depth when observing from the right.

Equivalent implementations include recording the last node of each BFS level or using right-first DFS.

## 5. Top View

The top view selects the first visible node for each horizontal distance under a specified tie-breaking rule.

A common implementation uses BFS and records the first node encountered at each column.

## 6. Bottom View

The bottom view selects the deepest/latest visible node for each horizontal distance under a specified tie-breaking rule.

The tie-breaking rule must be explicit because nodes can share the same column and depth.

## 7. Vertical Traversal

Vertical traversal groups nodes by horizontal distance.

A complete specification should define ordering within a column, for example by:

1. row/depth;
2. value;
3. traversal order.

Do not assume that all interview problems use the same definition.

## 8. Horizontal Distance

For a binary tree:

```text
root column = 0
left child  = column - 1
right child = column + 1
```

A map from column to collected nodes supports grouping.

## 9. Column Ordering

The final result normally requires columns from smallest to largest horizontal distance.

JavaScript `Map` preserves insertion order, but that is not a substitute for numeric ordering when columns are discovered in arbitrary order. Explicit sorting may be required.

## 10. Boundary Traversal

A common boundary traversal consists of:

```text
root
→ left boundary excluding leaves
→ all leaves left-to-right
→ right boundary excluding leaves, reversed
```

The exact definition should be stated before implementation.

## 11. Avoiding Duplicate Boundary Nodes

The root and leaves can appear in multiple boundary categories. A correct implementation must define inclusion/exclusion rules so each node appears exactly as intended.

## 12. Leaf Collection

Leaves can be collected independently with DFS and combined with boundary paths.

This decomposition separates structural responsibilities and simplifies correctness reasoning.

## 13. Diagonal Traversal

Diagonal traversal groups nodes according to repeated right/down movement under a chosen coordinate convention.

Because multiple definitions exist, the diagonal direction and ordering must be specified explicitly.

## 14. Diagonal Coordinates

One useful representation assigns a diagonal index that changes when moving left while keeping the index unchanged when moving right.

Alternative conventions exist; the algorithm must match the stated definition.

## 15. BFS vs DFS for Views

BFS is often natural when visibility depends on depth because a queue exposes level boundaries directly.

DFS is often natural when the problem can be represented as a first-visit invariant over depth or coordinate.

## 16. First-Visit Invariant

For left/right views, if traversal order guarantees the desired visibility order, the first node recorded at a depth is the visible node.

Correctness depends on traversal ordering, not merely on using DFS.

## 17. Coordinate + Ordering Model

Many view problems reduce to:

```text
node → coordinate → candidate group → ordering/tie-break → selected result
```

This model generalizes to vertical, diagonal, top, and bottom views.

## 18. Sorting vs Ordered Maps

If horizontal coordinates range over a compact predictable interval, indexed arrays can be practical.

For arbitrary coordinates, maps plus sorting are often simpler.

The choice depends on coordinate range and memory constraints.

## 19. Complexity of Vertical Grouping

For `N` nodes, collecting all nodes is `O(N)`.

If column keys must be sorted, an additional ordering cost may be:

```text
O(C log C)
```

where `C` is the number of distinct columns and `C <= N`.

## 20. Value Tie-Breaking

Some vertical traversal specifications require nodes with equal coordinates to be sorted by value.

A stable comparator must define all required fields:

```text
(row, value, traversalSequence)
```

when traversal sequence is the final tie-breaker.

## 21. Stable Ordering

JavaScript sorting behavior and comparator design must be considered when deterministic output matters.

Never return inconsistent comparator results for equivalent inputs.

## 22. Boundary Correctness

For boundary traversal, prove separately that:

1. root inclusion is correct;
2. left boundary contains only intended non-leaf nodes;
3. all leaves are included exactly once;
4. right boundary is reversed correctly;
5. no node is duplicated.

## 23. View Problems with Duplicate Values

Visibility is about node identity and position, not value uniqueness. Duplicate values must not cause nodes to be accidentally merged.

## 24. Sparse and Deep Trees

Coordinate values may become large in deep skewed trees. JavaScript numbers can represent ordinary integer coordinates safely for realistic depths, but production algorithms should still avoid unnecessary coordinate expansion and recursion risk.

## 25. Iterative Implementations

BFS-based view algorithms are naturally iterative.

For DFS-based views, an explicit stack can replace recursion and carry:

```text
node
row
column
state
```

## 26. Streaming Considerations

A left/right view can sometimes be produced level by level. Vertical or bottom views may require retaining candidates until the traversal has established the relevant ordering.

This distinction matters for memory-constrained systems.

## 27. Backend Applications

Tree views are useful for:

- organization hierarchy rendering;
- category navigation;
- permission-tree visualization;
- dependency inspection;
- document outline generation;
- hierarchical API responses.

## 28. AI Applications

These techniques can support:

- search-tree visualization;
- planning-tree inspection;
- hierarchical decision analysis;
- AST visualization;
- tree-structured candidate exploration.

## 29. Correctness Strategy

For every view problem, define:

```text
coordinate model
visibility rule
traversal order
selection rule
output order
```

Then prove that the implementation preserves each component.

## 30. Common Mistakes

1. Treating all vertical traversal definitions as identical.
2. Forgetting tie-breaking requirements.
3. Using `Map` insertion order when sorted columns are required.
4. Duplicating leaves during boundary traversal.
5. Reversing the wrong portion of the right boundary.
6. Confusing left/right view with top/bottom view.
7. Using values as node identity.
8. Ignoring output ordering.

## 31. Edge Cases

Test:

- empty tree;
- single node;
- only-left tree;
- only-right tree;
- balanced tree;
- duplicate values;
- multiple nodes in one column;
- multiple nodes at the same row/column;
- deep skewed tree;
- wide tree.

## 32. Testing Strategy

Build a slow reference implementation using explicit coordinate records, then compare optimized view implementations against it.

Useful properties include:

- left/right view length ≤ tree height + 1 under node-depth conventions;
- boundary nodes belong to the tree;
- no unintended duplicates;
- vertical output contains every node exactly once when the specification requires complete grouping.

## 33. Interview Framework

When given a tree-view problem:

```text
1. What exactly is visible?
2. What coordinate identifies the view position?
3. What is the tie-breaker?
4. Does depth matter?
5. Is output grouped or flattened?
6. Is BFS or DFS more natural?
7. Do columns need sorting?
8. Can duplicate values occur?
9. What is the required memory bound?
10. Can I prove every node is handled exactly as specified?
```

## 34. Revision Checklist

- [ ] I can derive left view.
- [ ] I can derive right view.
- [ ] I can derive top view.
- [ ] I can derive bottom view.
- [ ] I understand vertical traversal coordinates.
- [ ] I can perform boundary traversal without duplication.
- [ ] I understand diagonal traversal conventions.
- [ ] I can define tie-breaking precisely.
- [ ] I can analyze sorting and memory costs.
- [ ] I can test views against a coordinate-based reference.

## 35. Key Takeaways

1. **Tree-view problems are usually coordinate + traversal-order + tie-breaking problems.**
2. **BFS is naturally suited to depth-based visibility; DFS can work when traversal order establishes the visibility invariant.**
3. **Vertical traversal is not one universal problem—its ordering specification must be read carefully.**
4. **Boundary traversal requires explicit inclusion/exclusion rules to prevent duplicates.**
5. **A precise coordinate model turns seemingly visual tree problems into systematic algorithmic problems.**
