# 04.12 — Recursive Tree Algorithms & Advanced Tree Recursion

## Purpose

Trees are one of the most natural structures for recursion because a tree is defined recursively:

```text
Tree = empty
    OR node + collection of child trees
```

This chapter turns the recursion model into systematic tree algorithms. The goal is to reason about traversal, aggregation, structural transformation, path state, subtree relationships, binary-search-tree properties, and recursion complexity.

The central mental model is:

> Solve the current node using answers obtained from its child subtrees.

---

# 1. Recursive Tree Model

For a binary tree:

```text
node
├── left subtree
└── right subtree
```

A recursive function commonly follows:

```text
if node is empty:
    return base value

leftResult  = recurse(left)
rightResult = recurse(right)
return combine(node, leftResult, rightResult)
```

---

# 2. Structural Recursion

The recursive calls should follow the structure of the input.

For a tree:

```js
solve(node.left);
solve(node.right);
```

This is structural recursion because every call moves to a smaller subtree.

---

# 3. Tree Base Cases

The most common base case is:

```js
if (node === null) return ...;
```

The returned value depends on the operation.

Examples:

```text
sum       → 0
count     → 0
height    → -1 or 0, depending on convention
contains  → false
```

The base value must be compatible with the combine operation.

---

# 4. Preorder

Preorder processes:

```text
node → left → right
```

Use it when the parent should be handled before descendants.

Examples include serialization and copying a tree structure.

---

# 5. Inorder

Inorder processes:

```text
left → node → right
```

For a binary search tree, inorder traversal produces values in sorted order when the BST invariant is valid.

---

# 6. Postorder

Postorder processes:

```text
left → right → node
```

It is especially useful when the parent depends on completed child results.

Examples:

```text
subtree size
height
delete/free-style processing
expression evaluation
```

---

# 7. Aggregation Pattern

Many tree algorithms are simple aggregation:

```text
answer(node)
    = combine(node.value,
              answer(left),
              answer(right))
```

Examples:

```text
sum
count
minimum
maximum
height
number of leaves
```

---

# 8. Identity Values

When a subtree is empty, return an identity value where possible.

Examples:

```text
sum       → 0
count     → 0
any       → false
all       → true
```

This makes recursive combination mathematically clean.

---

# 9. Tree Height

Using edge-based height:

```text
height(null) = -1
height(leaf) = 0

height(node) = 1 + max(height(left), height(right))
```

Using node-based height instead changes the base case to `0` and leaf height to `1`.

Always state the convention.

---

# 10. Tree Size

```text
size(null) = 0
size(node) = 1 + size(left) + size(right)
```

Every node is counted exactly once.

For `N` nodes, time is `O(N)` because every node is visited.

---

# 11. Searching a Tree

A general binary tree does not provide ordering.

Search may require both branches:

```text
contains(left) OR contains(right)
```

This differs fundamentally from a BST search.

---

# 12. Short-Circuit Search

If the target is found in the left subtree, the right subtree does not need to be searched.

Conceptually:

```js
if (search(left)) return true;
return search(right);
```

Short-circuiting changes practical work while preserving worst-case `O(N)` behavior.

---

# 13. BST Search

A binary search tree has an ordering invariant:

```text
left values < node value < right values
```

Therefore:

```text
if target < node.value → search left
if target > node.value → search right
otherwise → found
```

The recursive state follows a single path rather than both subtrees.

---

# 14. BST Complexity

Let `H` be tree height.

BST search:

```text
Time:  O(H)
Space: O(H) recursive stack
```

Balanced BST:

```text
H = O(log N)
```

Worst-case skewed BST:

```text
H = O(N)
```

---

# 15. Path State

Some problems require information about the path from the root.

Typical state:

```text
current path
current depth
remaining budget
ancestor constraints
```

Example:

```js
path.push(node.value);
recurse(node.left);
recurse(node.right);
path.pop();
```

The same restoration invariant from backtracking applies.

---

# 16. Root-to-Leaf Paths

A root-to-leaf path is complete only when:

```text
node.left === null
AND
node.right === null
```

At a leaf:

```text
record current path
```

Do not record arbitrary internal prefixes when the requirement is specifically root-to-leaf paths.

---

# 17. Path Sum

For a target sum:

```text
remaining = target - node.value
```

Then recurse into children.

At a leaf, success occurs when:

```text
node.value === remaining
```

This is an example of transforming global state into smaller local state.

---

# 18. Lowest Common Ancestor

A recursive LCA solution can reason from child results.

For a general binary tree:

```text
left contains target?
right contains target?
current is target?
```

If targets are discovered in different subtrees, the current node can be the LCA.

The exact contract matters when one or both targets may be absent.

---

# 19. Tree Diameter

Diameter is the longest path between two nodes.

A useful recursive design returns information upward:

```text
height of subtree
best diameter seen
```

At each node, a candidate diameter can pass through the node:

```text
leftHeight + rightHeight + 2
```

for edge-based height.

This demonstrates a powerful technique:

> Return more information than the caller directly asked for so each node can be solved in one traversal.

---

# 20. Composite Return Values

Instead of repeatedly traversing a subtree, return a structured result:

```js
{
  height,
  diameter
}
```

or:

```js
{
  valid,
  min,
  max
}
```

This is often the difference between `O(N)` and accidental `O(N²)` solutions.

---

# 21. Validate a BST

A local check such as:

```text
left child < node < right child
```

is insufficient.

A deeper descendant may violate the global ordering constraint.

Use propagated bounds:

```text
node must lie within (minBound, maxBound)
```

Each recursive call receives the valid range for that subtree.

---

# 22. BST Bounds

Conceptually:

```text
validate(node, low, high)

left  → (low, node.value)
right → (node.value, high)
```

This is a direct example of recursive state carrying constraints from ancestors.

Duplicate handling must be explicitly defined because different BST conventions allow or reject duplicates differently.

---

# 23. Tree Transformation

Recursion can construct a new tree:

```text
transform(node)
    ↓
create transformed node
    ↓
transform children
```

Examples:

```text
clone tree
map values
invert tree
serialize structure
normalize nodes
```

When preserving immutability, avoid mutating the original tree.

---

# 24. Tree Inversion

For each node:

```text
new.left  = transformed(right)
new.right = transformed(left)
```

The recursive structure makes inversion almost mechanical.

---

# 25. Comparing Trees

To determine structural and value equality:

```text
both null → equal
one null   → unequal
values differ → unequal
otherwise compare both child pairs
```

This demonstrates recursive decomposition into independent subproblems.

---

# 26. Subtree Detection

Checking whether `B` is a subtree of `A` often combines two recursive algorithms:

```text
traverse A to find candidate roots
→ compare candidate subtree with B
```

A naive implementation can be `O(NM)` in the worst case.

Serialization + string matching or hashing can provide alternative designs, with their own collision/correctness considerations.

---

# 27. Balanced Tree Validation

A naive balance check can repeatedly compute subtree heights.

That can become `O(N²)` on skewed trees.

Better:

```text
return height if balanced
return failure sentinel if unbalanced
```

Each subtree is processed once.

This is another composite-return pattern.

---

# 28. Recursion Depth

For a tree:

```text
recursion depth = O(H)
```

where `H` is height.

Balanced tree:

```text
O(log N)
```

Skewed tree:

```text
O(N)
```

Tree shape therefore directly affects recursion safety.

---

# 29. Time Complexity

A traversal visiting every node once is generally:

```text
O(N)
```

If each node performs work proportional to subtree size, complexity can become:

```text
O(N²)
```

Do not infer complexity only from “there are two recursive calls.” Count total node visits and per-node work.

---

# 30. Recursion Tree vs Input Tree

Do not confuse:

```text
input tree
```

with:

```text
recursion-call tree
```

For structural tree traversal they often correspond closely.

For algorithms such as divide-and-conquer, the recursion tree represents computation over subproblems and may have a different interpretation.

---

# 31. DAGs Are Not Trees

A structure may look tree-like while sharing child references.

Example:

```text
    A
   / \
  B   C
   \ /
    D
```

`D` is shared.

Naive recursion may process `D` multiple times.

If cycles are possible, naive recursion can fail to terminate.

---

# 32. Visited Sets

For graph-like structures, use identity-based tracking:

```js
const visited = new Set();
```

Before processing a node:

```text
if visited → stop
otherwise mark visited and continue
```

This changes the algorithm from tree traversal toward graph traversal.

---

# 33. Memoization on Shared Subtrees

For a DAG without cycles, repeated subproblems may be cached.

The cache key should identify the logical node/state.

Then each unique state can be processed once.

This connects recursion to dynamic programming over graphs.

---

# 34. Tail Recursion Caveat in JavaScript

Do not assume JavaScript implementations provide general proper-tail-call optimization.

Deep recursive tree traversal can therefore overflow the call stack.

For untrusted or extremely deep structures, iterative traversal or an explicit stack may be safer.

---

# 35. Recursive vs Iterative Tree Algorithms

Recursion advantages:

```text
natural structural mapping
short code
clear correctness reasoning
```

Iteration advantages:

```text
explicit memory control
no call-stack overflow
better control over cancellation
```

Production engineering is not about proving recursion is elegant; it is about choosing the right execution model.

---

# 36. Backend Applications

Recursive tree processing appears in:

- nested configuration validation;
- category hierarchies;
- organization trees;
- permission inheritance;
- menu/navigation structures;
- JSON-like document processing;
- dependency trees;
- AST processing.

Always consider maximum nesting depth for user-controlled JSON or configuration.

---

# 37. AI Applications

Tree recursion appears in:

- abstract syntax trees;
- expression trees;
- search trees;
- decision trees;
- game trees;
- program representations;
- hierarchical document structures;
- symbolic reasoning.

Tree search can become exponentially large even when each individual recursive operation is simple.

---

# 38. Common Mistakes

### Mistake 1 — Wrong base value

```text
sum(null) = 1
```

would corrupt aggregation.

### Mistake 2 — Missing one child

Processing only `left` silently loses data.

### Mistake 3 — Recomputing subtree information

Repeated height calculations can produce `O(N²)` work.

### Mistake 4 — Confusing BST with general tree

Ordering assumptions must be proven by the data structure invariant.

### Mistake 5 — Forgetting path restoration

Shared arrays require push/pop discipline.

### Mistake 6 — Treating DAGs as trees

Shared references can cause repeated work or infinite recursion.

---

# 39. Design Procedure

For a recursive tree problem:

```text
1. Define the node model.
2. Define the empty-tree result.
3. Decide whether one or both children are needed.
4. Define the recursive state.
5. Decide what information children return.
6. Combine child results at the current node.
7. Prove the recursive state decreases toward empty subtrees.
8. Analyze total node visits.
9. Analyze per-node work.
10. Analyze O(H) stack space.
11. Check whether references can be shared or cyclic.
12. Decide whether recursion is operationally safe.
```

---

# 40. Interview Explanation Template

> “I model the tree recursively because each node consists of a value and smaller child subtrees. I define the null base case first, recursively solve the required children, and combine their results at the current node. I explicitly track what information is returned upward so I do not recompute subtree properties. For an N-node traversal the time is usually O(N), while recursion stack space is O(H), where H is the tree height.”

---

# 41. Revision Checklist

- [ ] Can I explain structural recursion on trees?
- [ ] Can I choose correct null identity values?
- [ ] Can I implement preorder, inorder, and postorder?
- [ ] Can I compute size, height, leaves, and aggregate values?
- [ ] Can I search a general tree safely?
- [ ] Can I exploit the BST invariant correctly?
- [ ] Can I carry path state?
- [ ] Can I return composite subtree information?
- [ ] Can I avoid accidental O(N²) tree algorithms?
- [ ] Can I validate BST bounds?
- [ ] Can I reason about tree diameter and balance?
- [ ] Can I distinguish trees from DAGs and graphs?
- [ ] Can I explain O(H) recursive space?
- [ ] Can I identify recursion-depth risks in JavaScript?
- [ ] Can I choose recursion vs iteration for production?

# Key Takeaways

1. Trees naturally support structural recursion.
2. Most tree recursion follows empty-case → child recursion → combine.
3. The information returned by a subtree is a major algorithm-design decision.
4. Composite return values can eliminate repeated traversals.
5. BST algorithms depend on a global ordering invariant.
6. Path-based tree problems use state inherited from ancestors.
7. Tree traversal is usually O(N) time and O(H) stack space.
8. Shared references turn tree-like data into graph-like data and require different reasoning.
9. JavaScript recursion depth is an engineering constraint, not merely a theoretical detail.
10. Expert tree recursion means designing the state, return contract, invariant, and complexity together.
