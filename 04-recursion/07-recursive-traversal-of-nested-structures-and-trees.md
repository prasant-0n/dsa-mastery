# 04.7 — Recursive Traversal of Nested Structures & Trees

## Purpose

Recursion becomes natural when the input itself has recursive structure.

Examples:

```text
nested arrays
nested objects
trees
file-system-like hierarchies
expression trees
JSON-like documents
```

The core idea is **structural recursion**:

> Solve the current structure, recursively solve each child structure, then combine or propagate the result.

---

# 1. Recursive Data Has Recursive Shape

A nested structure contains values that may themselves contain nested structures.

Conceptually:

```text
Structure
├── value
├── value
└── Structure
    ├── value
    └── Structure
```

The algorithm mirrors the data shape.

---

# 2. Structural Recursion

Structural recursion follows the structure of the input.

For a tree:

```text
process(node)
→ process(left)
→ process(right)
```

For a nested array:

```text
process(element)
→ if element is nested, process(element)
```

The input structure naturally supplies the recursive state.

---

# 3. Base Case for Nested Structures

The base case is usually a value that has no children.

Examples:

```text
number/string/boolean → process directly
null → stop
leaf node → process leaf
empty collection → return identity result
```

The exact base case depends on the data contract.

---

# 4. Tree as a Recursive Data Structure

A binary tree node can be modeled as:

```text
Node
├── value
├── left subtree
└── right subtree
```

Each subtree is itself a tree.

Therefore:

```text
Tree = empty OR Node(leftTree, value, rightTree)
```

This recursive definition directly motivates recursive tree algorithms.

---

# 5. Node and Child State

For simple tree traversal, the recursive state may be only:

```text
node
```

For more advanced problems it may include:

```text
node + depth
node + accumulated value
node + parent information
node + constraint state
```

Use the minimum sufficient state.

---

# 6. Depth-First Traversal

Recursive tree traversal is naturally depth-first.

Conceptually:

```text
visit(node)
→ visit(child)
→ visit(next child)
```

The call stack stores the active path.

This is why recursive DFS usually requires stack space proportional to tree depth.

---

# 7. Pre-Order Traversal

Pre-order processes the node before its children:

```text
node
left
right
```

Pattern:

```text
process node
recurse left
recurse right
```

Useful for operations where parent information should appear before descendants.

---

# 8. In-Order Traversal

For binary trees:

```text
left
node
right
```

In a binary search tree, in-order traversal produces values in sorted order.

The ordering follows the recursive structure.

---

# 9. Post-Order Traversal

Post-order processes children before the node:

```text
left
right
node
```

This is useful when the parent's result depends on already-computed child results.

Examples:

- subtree size;
- height;
- deletion-style processing;
- expression evaluation.

---

# 10. Traversal as Return-Value Construction

A tree metric often follows:

```text
leftResult = solve(left)
rightResult = solve(right)
return combine(node, leftResult, rightResult)
```

Example for height:

```text
height(node)
= 1 + max(height(left), height(right))
```

The recursive return values flow upward.

---

# 11. Tree Size

The subtree-size recurrence is:

```text
size(null) = 0
size(node) = 1 + size(left) + size(right)
```

This demonstrates a general pattern:

```text
base identity
+ child results
+ current contribution
```

---

# 12. Tree Aggregation

Many tree problems are aggregation problems:

```text
sum
count
minimum
maximum
height
number of leaves
number of matching nodes
```

The recursive structure naturally decomposes the aggregation into subtree results.

---

# 13. Path-Based State

Some problems depend on the path from root to current node.

State may include:

```text
node
current path
running sum
current depth
```

Example:

```text
root → A → B → C
```

The current path is part of the relevant state if the final answer depends on it.

---

# 14. Accumulated Path State

Instead of reconstructing the path after recursion, carry it downward.

Example:

```text
(node, runningSum)
```

Transition:

```text
runningSum + node.value
```

At a leaf, the accumulated state represents the complete root-to-leaf path value.

---

# 15. Shared Path Array

Backtracking-style tree algorithms may use:

```text
path.push(node)
recurse
path.pop()
```

The restoration invariant is:

> After returning from a child, `path` must represent exactly the parent's path again.

Without restoration, sibling branches can observe incorrect state.

---

# 16. Nested Arrays

Nested arrays can be processed structurally:

```text
for each element:
    if element is nested:
        recurse(element)
    else:
        process value
```

This pattern is useful for flattening, summation, counting, validation, and transformation.

---

# 17. Nested Objects

JSON-like objects can also be recursive.

A traversal may distinguish:

```text
primitive value
array
object
null
```

Each category has a different transition rule.

A robust implementation should define the input contract explicitly.

---

# 18. Cycles Are Different

A tree is acyclic by definition.

Arbitrary object graphs may contain cycles:

```text
A → B → C → A
```

Naive recursive traversal can therefore become non-terminating.

A visited structure may be required.

---

# 19. Identity-Based Visited Tracking

For object graphs, identity may matter more than structural equality.

JavaScript `Set` can track object references:

```text
visited.has(node)
visited.add(node)
```

This prevents revisiting the same object identity.

Do not confuse object identity with equal-looking objects.

---

# 20. Tree vs Graph

| Structure | Cycles | Typical Recursive Safety |
|---|---:|---|
| Tree | No | naturally finite if children are finite |
| DAG | No cycles | finite, but repeated nodes possible |
| Graph | Possible | needs cycle/revisit handling |
| Arbitrary object graph | Possible | identity tracking may be required |

The data model determines the recursion strategy.

---

# 21. DAGs and Repeated Substructures

A directed acyclic graph may contain shared descendants.

Two parents can reference the same node.

Without memoization:

```text
shared subtree → processed repeatedly
```

With memoization:

```text
unique node/state → processed once
```

This is another bridge between recursion and dynamic programming.

---

# 22. Complexity of Tree Traversal

If every node is visited once:

```text
Time = O(N)
```

where `N` is the number of nodes.

Recursive stack space is:

```text
O(H)
```

where `H` is tree height.

For a balanced tree:

```text
H = O(log N)
```

For a degenerate chain:

```text
H = O(N)
```

---

# 23. Hidden Complexity in Recursive Traversal

Traversal itself may be O(N), but additional work can change the complexity.

For example, repeatedly copying a path of length `H` at every node can add substantial cost.

Always analyze:

```text
node visits
+ work per node
+ copying/allocation
+ output size
```

---

# 24. Recursive Transformation

A traversal can return a transformed structure.

Pattern:

```text
transform(node)
→ transform children
→ construct transformed parent
```

This is useful for:

- AST transformations;
- JSON normalization;
- configuration rewriting;
- tree mapping.

---

# 25. In-Place vs New-Structure Transformation

Two approaches:

```text
mutate original structure
```

or:

```text
construct a new structure
```

Mutation reduces allocation but changes the input contract.

New structures provide isolation but consume more memory.

Choose explicitly.

---

# 26. Recursive Validation

A nested structure can be validated recursively.

At each node:

```text
validate current value
AND
validate every child
```

The base case represents a valid leaf/empty structure.

A failure can short-circuit the traversal.

---

# 27. Short-Circuit Traversal

For predicates such as:

```text
Does any node match?
```

return immediately after success.

For:

```text
Are all nodes valid?
```

return immediately after failure.

This can dramatically reduce practical work even when the worst-case complexity remains O(N).

---

# 28. Tree Search and State

Searching a tree may require:

```text
node
```

only if the search condition depends solely on node values.

If the condition depends on path constraints, state may become:

```text
node + constraint
```

The state definition determines correctness.

---

# 29. Backend Applications

Recursive nested-structure traversal appears in:

- JSON processing;
- category hierarchies;
- permission trees;
- organizational structures;
- dependency analysis;
- nested configuration validation;
- directory-like resources.

Production concerns include cycle safety, maximum depth, memory usage, and untrusted input.

---

# 30. AI Applications

Recursive structural traversal appears in:

- syntax/AST processing;
- hierarchical document structures;
- search trees;
- planning states;
- knowledge structures;
- recursive candidate evaluation.

AI pipelines may additionally require node budgets and depth limits.

---

# 31. Design Procedure

Before implementing recursive traversal:

```text
1. Identify the recursive data structure.
2. Define leaf/base states.
3. Define child relationships.
4. Define the recursive state.
5. Define the result contract.
6. Decide pre-order/post-order behavior.
7. Define child-result combination.
8. Check for cycles/shared nodes.
9. Analyze node count and height.
10. Analyze allocation/output size.
11. Add depth/resource limits when input is untrusted.
```

---

# 32. Expert Questions

Ask:

```text
Is the structure truly a tree?
Can it contain cycles?
Can nodes be shared?
What is the base case?
What does solve(node) mean?
What information must flow downward?
What result flows upward?
Is traversal pre-, in-, or post-order?
What is the maximum depth?
Can work be short-circuited?
Can repeated substructures be memoized?
```

---

# 33. Revision Checklist

- [ ] Can I explain structural recursion?
- [ ] Can I define tree base cases?
- [ ] Can I implement conceptual pre-order, in-order, and post-order traversal?
- [ ] Can I derive tree aggregation recurrences?
- [ ] Can I distinguish node state from path state?
- [ ] Can I reason about shared mutable path state?
- [ ] Can I distinguish trees, DAGs, and graphs?
- [ ] Can I identify when visited tracking is required?
- [ ] Can I identify repeated substructures and memoization opportunities?
- [ ] Can I analyze O(N) traversal and O(H) stack space?
- [ ] Can I account for copying and output costs?
- [ ] Can I apply recursive traversal to backend and AI structures?

# Key Takeaways

1. Recursive data structures naturally invite structural recursion.
2. A tree can often be modeled as a node plus recursively defined child trees.
3. Tree traversal commonly uses the call stack as an implicit path.
4. Pre-order, in-order, and post-order differ by when current-node work occurs.
5. Many tree algorithms are simply child-result aggregation.
6. Path-dependent problems require additional recursive state.
7. Trees are acyclic; arbitrary object graphs may require visited tracking.
8. DAGs can contain repeated shared substructures, making memoization useful.
9. Visiting every node once is O(N), while recursive stack space is O(H).
10. Production recursive traversal must consider cycles, depth, allocation, and untrusted input.
