# 11.01 — Tree Fundamentals, Terminology, Memory Model & Recursive Mental Model

## 1. Objective

A tree is a connected, acyclic hierarchical data structure. Trees model parent-child relationships and provide a foundation for search trees, heaps, tries, indexes, syntax trees, and many backend/AI structures.

## 2. Why Trees Exist

Arrays and linked lists represent primarily sequential relationships. Trees represent hierarchical relationships where one node can lead to multiple descendants.

Common domains:

- file systems;
- organizational hierarchies;
- database indexes;
- JSON/XML documents;
- abstract syntax trees;
- dependency structures;
- decision processes.

## 3. Core Terminology

- **Node** — an element containing data and links to children.
- **Root** — the unique top node of a rooted tree.
- **Parent** — the immediate predecessor of a node.
- **Child** — an immediate descendant.
- **Sibling** — nodes sharing a parent.
- **Leaf** — a node with no children.
- **Internal node** — a node with at least one child.
- **Ancestor** — any node on the path from the root to a node.
- **Descendant** — any node below another node.
- **Depth** — number of edges from the root.
- **Height** — maximum number of edges from a node to a descendant leaf.
- **Subtree** — a node together with its descendants.

## 4. Tree Properties

For a finite tree with `N` nodes:

```text
number of edges = N - 1
```

There is exactly one simple path between any two nodes.

A connected graph with `N - 1` edges is a tree when it is acyclic.

## 5. Rooted vs Unrooted Trees

A rooted tree chooses one node as the root and therefore gives parent/child direction.

An unrooted tree only specifies connectivity and acyclicity. Algorithms may choose a temporary root when needed.

## 6. Ordered vs Unordered Trees

In an ordered tree, child positions matter.

```text
A → [B, C]
A → [C, B]
```

can represent different structures.

In an unordered tree, sibling ordering does not matter.

## 7. General Trees

A general tree permits any number of children per node.

A JavaScript representation can use:

```js
{
  value,
  children: []
}
```

## 8. Binary Trees

A binary tree gives each node at most two child positions, commonly called `left` and `right`.

```js
{
  value,
  left: null,
  right: null
}
```

The left and right positions are distinct even if one is empty.

## 9. Binary Tree Shapes

Important structural forms include:

- full binary tree;
- complete binary tree;
- perfect binary tree;
- balanced tree;
- skewed tree;
- degenerate tree.

Do not use these terms interchangeably.

## 10. Full Binary Tree

Every node has either zero or two children.

If there are `I` internal nodes, a full binary tree has:

```text
leaves = I + 1
```

## 11. Complete Binary Tree

Every level except possibly the last is completely filled, and the final level is filled from left to right.

This property enables compact array representations and is fundamental to binary heaps.

## 12. Perfect Binary Tree

Every internal node has exactly two children and every leaf has the same depth.

At depth `d`, there are:

```text
2^d nodes
```

and a perfect tree of height `h` has:

```text
2^(h+1) - 1 nodes
```

## 13. Balanced vs Skewed

A balanced tree keeps height relatively small compared with the number of nodes.

A skewed tree behaves like a linked list:

```text
O(N) height
```

Many tree algorithms depend on height rather than node count alone.

## 14. Memory Model

A pointer-based tree stores nodes separately in memory with references connecting parents to children.

Conceptually:

```text
Node
├── value
├── left reference
└── right reference
```

JavaScript engines manage the actual object layout and allocation strategy.

## 15. Array Representation

Complete binary trees can use an array representation.

With zero-based indexing:

```text
left(i)  = 2i + 1
right(i) = 2i + 2
parent(i) = floor((i - 1) / 2)
```

This is efficient when the structure is sufficiently complete.

## 16. Pointer vs Array Representation

Pointer representation is flexible for irregular trees.

Array representation can improve locality and remove explicit child pointers but may waste space for sparse structures.

Choose based on shape and access pattern.

## 17. Recursive Mental Model

The most important tree insight is:

> Every node is the root of its own subtree.

Therefore a tree problem can often be expressed recursively as:

```text
solve(node)
= combine(solve(left), solve(right), node)
```

for a binary tree.

## 18. Base Case

For pointer-based trees, the natural base case is often:

```text
node === null
```

The result for an empty subtree must be defined explicitly.

## 19. Structural Induction

Tree correctness is naturally proved by induction on subtree structure:

1. prove the empty/smallest tree case;
2. assume recursive results are correct for child subtrees;
3. prove the combine step produces the correct parent result.

## 20. Traversal Preview

The major traversal orders are:

```text
preorder:  node → left → right
inorder:   left → node → right
postorder: left → right → node
level-order: breadth by depth
```

Each traversal corresponds to a different timing of node processing.

## 21. Depth and Height

For a node:

```text
depth(node) = distance from root
height(node) = longest downward distance to a leaf
```

For the root:

```text
height(root) = tree height
```

A common mistake is confusing these two directions.

## 22. Subtree Size

The size of a node's subtree can be computed recursively:

```text
size(node) = 1 + Σ size(child)
```

This simple recurrence becomes a foundation for many advanced tree algorithms.

## 23. Tree Diameter Preview

The diameter is the maximum distance between two nodes.

It may pass through a node while combining the heights of multiple child subtrees.

This illustrates why local subtree summaries can solve global tree problems.

## 24. Complexity

A traversal that visits every node once is typically:

```text
Time: O(N)
```

For recursive depth `H`:

```text
Auxiliary stack: O(H)
```

For balanced trees, `H` is often `O(log N)`; for skewed trees it can be `O(N)`.

## 25. Common Mistakes

1. Confusing depth and height.
2. Assuming every binary tree is balanced.
3. Treating complete and perfect as synonyms.
4. Forgetting the empty-tree base case.
5. Assuming recursive depth is always logarithmic.
6. Ignoring representation-specific memory costs.
7. Mutating shared child references accidentally.

## 26. Edge Cases

Always test:

- empty tree;
- one node;
- only left children;
- only right children;
- balanced tree;
- highly skewed tree;
- duplicate values;
- negative values;
- very deep trees.

## 27. Backend Applications

Trees appear in:

- file/directory hierarchies;
- organization structures;
- JSON processing;
- database/index structures;
- routing and policy hierarchies;
- AST processing;
- hierarchical permissions.

## 28. AI Applications

Trees are used for:

- decision trees;
- syntax/AST processing;
- hierarchical classification;
- search trees;
- planning/state exploration;
- hierarchical representations.

## 29. Interview Framework

When a tree appears:

```text
1. What exactly is a node?
2. Is the tree rooted?
3. Is it binary or general?
4. Does child order matter?
5. What does depth/height mean here?
6. What is the natural empty-subtree result?
7. Can the answer be expressed from child answers?
8. What is the maximum height?
9. Does the representation affect complexity?
```

## 30. Revision Checklist

- [ ] I know all core tree terminology.
- [ ] I can distinguish rooted/unrooted trees.
- [ ] I can distinguish full/complete/perfect/balanced trees.
- [ ] I understand pointer and array representations.
- [ ] I can define depth and height precisely.
- [ ] I understand the subtree mental model.
- [ ] I can formulate recursive tree solutions.
- [ ] I can reason about `O(N)` traversal and `O(H)` stack space.
- [ ] I can identify backend and AI applications.

## 31. Key Takeaways

1. **A tree is hierarchical, connected, and acyclic; a rooted tree adds parent/child direction.**
2. **Tree algorithms are usually governed by height as well as node count.**
3. **Every node can be viewed as the root of a subtree, making structural recursion extremely powerful.**
4. **Representation matters: pointer trees favor flexibility, while complete trees can exploit compact arrays.**
5. **Precise terminology—depth, height, full, complete, perfect, balanced—is essential for correct reasoning.**
