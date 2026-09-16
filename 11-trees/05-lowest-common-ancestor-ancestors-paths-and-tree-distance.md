# 11.05 — Lowest Common Ancestor, Ancestors, Paths & Tree Distance

## 1. Objective

This chapter develops a reusable framework for reasoning about relationships between nodes in trees: ancestors, root-to-node paths, lowest common ancestors (LCA), and distances.

## 2. Ancestors

An ancestor of a node is any node on the path from the root to that node, excluding the node itself unless the problem explicitly defines otherwise.

The root is an ancestor of every non-root node.

## 3. Root-to-Node Path

A root-to-node path is unique in a tree.

That uniqueness is the foundation of many path algorithms:

```text
root → ... → target
```

## 4. Parent Pointers

If every node stores a parent reference, walking from a node to the root takes `O(H)` time.

Parent pointers simplify ancestor queries but increase memory and mutation-consistency requirements.

## 5. Ancestor List

A basic ancestor algorithm repeatedly follows parent references or recursively records the root-to-target path.

For height `H`:

```text
Time: O(H)
Space: O(H)
```

## 6. Lowest Common Ancestor

The Lowest Common Ancestor of nodes `A` and `B` is their deepest node that is an ancestor of both.

The definition assumes the nodes are in the same rooted tree.

## 7. LCA via Root Paths

For a general binary tree, one baseline is:

1. find root-to-`A` path;
2. find root-to-`B` path;
3. compare the paths until they diverge.

This is simple and useful as a reference implementation.

## 8. LCA with Parent Pointers

When parent pointers exist:

1. compute depths;
2. lift the deeper node until both depths match;
3. move both upward until they meet.

Complexity is `O(H)` time and `O(1)` auxiliary space if no ancestor set is used.

## 9. LCA by Recursive Postorder

For a binary tree without parent pointers, recursion can return information about whether each target was found below a node.

If one target is found in each side, the current node is the LCA.

## 10. Missing Targets

The contract must state what happens when one or both targets do not exist.

A robust implementation should not silently return a node as LCA unless both required targets are confirmed.

## 11. Duplicate Values

Values are not necessarily node identity.

If duplicate values exist, LCA algorithms should use node references, unique IDs, or another explicit identity mechanism rather than assuming value equality identifies a node.

## 12. LCA When One Node Is an Ancestor

If `A` lies on the path from the root to `B`, then `A` is the LCA of `A` and `B`.

This case must be preserved by the recursive logic.

## 13. Path Between Two Nodes

The unique path from `A` to `B` can be decomposed as:

```text
A → ... → LCA → ... → B
```

This decomposition is central to distance and path-query problems.

## 14. Distance Between Nodes

Using edge distance:

```text
dist(A, B) = depth(A) + depth(B) - 2 * depth(LCA(A, B))
```

The formula follows because the root-to-A and root-to-B paths share the root-to-LCA segment.

## 15. Path Reconstruction

After finding the LCA, reconstruct:

```text
A → LCA
LCA → B
```

Then combine them without duplicating the LCA.

## 16. LCA in a Binary Search Tree

For a valid BST, ordering can eliminate branches:

```text
A and B both < node → left
A and B both > node → right
otherwise → current node is LCA
```

This uses the BST invariant and costs `O(H)`.

## 17. LCA in a Balanced vs Skewed BST

For a balanced BST, LCA is typically `O(log N)`.

For a skewed BST, it can degrade to `O(N)`.

Again, the relevant parameter is height.

## 18. LCA with Binary Lifting Preview

For many ancestor queries, preprocess jump pointers:

```text
up[node][j] = 2^j-th ancestor
```

Then ancestors can be lifted in logarithmic time after preprocessing.

This technique will be studied more deeply in advanced tree chapters.

## 19. Euler Tour Preview

An Euler-tour representation can flatten a rooted tree into an ordered sequence. With suitable preprocessing, LCA can be reduced to range-minimum-style queries over the Euler representation.

## 20. Path Queries

Many tree problems ask for an aggregate over the path between two nodes:

- sum;
- minimum/maximum;
- XOR;
- frequency;
- edge cost.

The correct strategy depends on whether queries are one-off or repeated.

## 21. One-Off vs Repeated Queries

For a few queries, direct path/LCA traversal may be enough.

For millions of queries, preprocessing can trade memory and build time for faster query latency.

This is a fundamental algorithm-engineering trade-off.

## 22. Tree Diameter via LCA Perspective

For any pair of nodes, their distance can be expressed using LCA. The diameter asks for the maximum such distance.

This illustrates how a local primitive can become a component of a global optimization problem.

## 23. Root Changes

LCA is defined relative to a root. Changing the root can change the LCA relationship.

Therefore any algorithm using LCA must state which root is authoritative.

## 24. Multiple LCA Queries

For repeated queries, consider:

- parent/depth preprocessing;
- binary lifting;
- Euler tour + RMQ;
- specialized offline algorithms.

Selection depends on preprocessing budget, memory, query count, and update frequency.

## 25. Dynamic Trees

If parent-child relationships change frequently, static preprocessing may become invalid or expensive to maintain.

Dynamic-tree algorithms require separate data-structure techniques and will be covered later.

## 26. Correctness of Recursive LCA

A recursive proof should establish that the returned result for each subtree correctly represents target presence and the lowest common ancestor within that subtree.

At each node, the combine logic must distinguish:

- neither target;
- exactly one target;
- both targets in one child;
- targets split across children.

## 27. Correctness of Distance Formula

Let `L = LCA(A,B)`. The path from root to `A` and root to `B` share exactly the root-to-`L` prefix.

Subtracting the shared segment twice yields:

```text
d(A,B) = depth(A) + depth(B) - 2 depth(L)
```

## 28. Complexity

For a single general-tree LCA query using direct traversal:

```text
Time: O(N) worst case
Space: O(H)
```

For a BST LCA:

```text
Time: O(H)
```

For parent-pointer LCA:

```text
Time: O(H)
Auxiliary space: O(1)
```

assuming depths are available or computed without extra storage.

## 29. Common Mistakes

1. Confusing node values with node identity.
2. Returning an LCA when one target is absent.
3. Forgetting the ancestor-as-LCA case.
4. Using a BST LCA algorithm on an arbitrary binary tree.
5. Using an LCA result without specifying the root.
6. Duplicating the LCA during path reconstruction.
7. Applying expensive preprocessing when only a few queries exist.
8. Ignoring tree mutations that invalidate preprocessing.

## 30. Edge Cases

Test:

- empty tree;
- one node;
- `A === B`;
- one node is ancestor of the other;
- nodes in different branches;
- root as LCA;
- missing target;
- duplicate values;
- deep skewed tree;
- large query batches.

## 31. Backend Applications

LCA/path techniques support:

- organization hierarchy queries;
- permission inheritance;
- category hierarchies;
- dependency ancestry;
- directory paths;
- hierarchical routing and policy systems.

## 32. AI Applications

Tree relationship queries can support:

- search-tree path extraction;
- planning-state ancestry;
- hierarchical label relationships;
- syntax-tree navigation;
- decision-tree path analysis.

## 33. Testing Strategy

Use:

- brute-force ancestor-set LCA as a reference;
- randomized trees;
- random node pairs;
- duplicate-value trees with node identity;
- path-distance cross-checks;
- BST-specific tests;
- preprocessing/query differential tests.

## 34. Interview Framework

When asked an LCA or path problem:

```text
1. Is the tree rooted?
2. Are nodes identified by identity or value?
3. Are parent pointers available?
4. Is this a general tree or BST?
5. Is this one query or many?
6. Are updates possible?
7. What does "distance" count?
8. What happens if a target is missing?
9. Can the path be reconstructed?
10. What preprocessing trade-off is acceptable?
```

## 35. Revision Checklist

- [ ] I can define ancestors precisely.
- [ ] I can find root-to-node paths.
- [ ] I understand general-tree LCA.
- [ ] I can use parent pointers for LCA.
- [ ] I can derive recursive LCA.
- [ ] I understand BST-specific LCA.
- [ ] I can derive node distance from LCA.
- [ ] I can reconstruct paths through the LCA.
- [ ] I understand repeated-query preprocessing.
- [ ] I understand why node identity matters with duplicates.

## 36. Key Takeaways

1. **LCA is a rooted-tree relationship; the chosen root is part of the problem definition.**
2. **The path between two nodes naturally decomposes around their LCA.**
3. **Node identity must be separated from node value when duplicates are possible.**
4. **One-off queries favor simple traversal; repeated queries justify preprocessing such as binary lifting or Euler-tour methods.**
5. **Distance, path reconstruction, hierarchy queries, and many advanced tree algorithms can be reduced to ancestor relationships.**
