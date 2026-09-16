# 11.04 — Binary Tree Structural Properties: Height, Balance, Diameter, Width & Path Analysis

## 1. Objective

Many tree problems ask for a structural property rather than a traversal output. The central technique is to compute a compact summary for each subtree and combine child summaries at the parent.

## 2. Height

For a node:

```text
height(node) = 1 + max(height(left), height(right))
```

The empty-tree convention must be defined consistently, commonly `-1` for edge-based height or `0` for node-count height.

## 3. Maximum Depth

Maximum depth from the root is equivalent to tree height when both use the same edge/node convention.

Always state the convention before deriving formulas.

## 4. Minimum Depth

Minimum depth is the shortest root-to-leaf path.

A critical edge case occurs when one child is absent: do not treat the missing child as a valid zero-length path when looking for a real leaf.

## 5. Balance

A common height-balance definition requires:

```text
|height(left) - height(right)| <= 1
```

for every node.

Other balance definitions exist, so the specification must be explicit.

## 6. Naive Balance Check

A naive algorithm repeatedly computes subtree heights while checking every node. In a skewed tree this can become `O(N²)`.

The optimization is to return both height and balance status from one bottom-up traversal.

## 7. Bottom-Up Summary Pattern

Instead of computing separate traversals:

```text
left summary
right summary
→ combine
→ parent summary
```

This is one of the most reusable tree-DP patterns.

## 8. Diameter

The diameter is the maximum distance between any two nodes, measured according to the chosen edge/node convention.

For a binary tree, a path passing through a node can combine the deepest downward paths from its left and right subtrees.

## 9. Diameter Recurrence

Using edge distance:

```text
through(node) = leftHeight + rightHeight + 2
```

The global diameter is the maximum of all such candidate paths and child diameters.

## 10. One-Pass Diameter

A single postorder traversal can return subtree height while updating a global diameter.

Complexity:

```text
Time: O(N)
Auxiliary space: O(H)
```

## 11. Width

Tree width can mean different things:

- number of nodes at a level;
- maximum number of actual nodes at any level;
- positional width including gaps.

Do not solve a width problem until the definition is clear.

## 12. Maximum Level Width

For actual-node width, BFS naturally computes the number of nodes in each level.

Complexity:

```text
Time: O(N)
Space: O(W)
```

where `W` is maximum frontier width.

## 13. Positional Width

If missing positions count toward width, each node can carry a conceptual heap-style position index.

Large indices can grow exponentially with depth, so production implementations should normalize indices per level to avoid unnecessary numeric growth.

## 14. Root-to-Leaf Paths

Path analysis often carries the current path or an aggregate state during DFS.

Examples:

- path sum;
- maximum path value;
- path existence;
- path enumeration.

## 15. Path Sum

A root-to-leaf sum can be expressed as:

```text
currentSum + node.value
```

and evaluated when a leaf is reached.

## 16. Maximum Root-to-Leaf Sum

For each node:

```text
best(node) = value + max(best(left), best(right))
```

Again, absent-child semantics must be handled explicitly.

## 17. Maximum Path Sum

A general maximum path may start and end at arbitrary nodes. A node can therefore compute:

```text
bestDownwardPath
bestPathThroughNode
```

The first is returned upward; the second can update the global answer.

## 18. Path vs Subtree State

Distinguish:

- state passed **downward** from ancestors;
- state returned **upward** from descendants;
- global or external state representing the best result seen so far.

Many tree problems become simple once these directions are separated.

## 19. Leaf Counting

A leaf has no children. Counting leaves is a direct structural recursion:

```text
leaf → 1
internal → sum(child counts)
```

## 20. Internal Node Count

For a non-empty binary tree:

```text
internal nodes = total nodes - leaves
```

This relation provides a useful invariant for testing.

## 21. Full Binary Tree Property

A full binary tree has zero or two children per node.

For a non-empty full binary tree:

```text
N = 2I + 1
L = I + 1
```

where `I` is internal-node count and `L` is leaf count.

## 22. Complete Tree Height

A complete binary tree has height `Θ(log N)` under standard definitions. This is why heap operations can achieve logarithmic height while using array storage.

## 23. Symmetry

A binary tree is symmetric when the left subtree mirrors the right subtree structurally and by value according to the specified equality rule.

This can be checked recursively or with paired BFS/DFS states.

## 24. Mirror Transformation

Mirroring swaps left and right recursively.

An important property is:

```text
mirror(mirror(T)) = T
```

assuming no external aliases are violated by mutation.

## 25. Same-Tree Comparison

Two trees are equal when corresponding nodes satisfy the value/equality rule and corresponding child structures are equal.

The structural comparison naturally follows the recursive tree model.

## 26. Subtree Detection

Determining whether one tree occurs as a subtree of another can use recursive structural comparison, serialization techniques, hashing, or specialized tree matching methods.

The simple recursive baseline may be quadratic in the worst case.

## 27. Structural Hashing Preview

A subtree can be summarized by a hash derived from:

```text
hash(value, leftHash, rightHash)
```

Hashing can accelerate candidate matching but introduces collision considerations. Exact verification may still be required.

## 28. Tree Shape Encoding

Shape can be represented independently of values using structural markers such as:

```text
node → marker + encode(left) + encode(right)
null → null marker
```

This is useful for equality and structural testing.

## 29. Correctness via Structural Induction

For bottom-up structural algorithms:

1. establish the empty-tree result;
2. assume child summaries are correct;
3. prove the parent combination computes the correct summary;
4. show the global answer includes every relevant candidate.

## 30. Complexity Reasoning

For a one-pass structural algorithm:

```text
Time = O(N)
Auxiliary recursion/stack = O(H)
```

BFS-based width analysis typically uses `O(W)` queue space.

## 31. Common Mistakes

1. Mixing edge-based and node-based height definitions.
2. Mishandling missing children in minimum-depth/path problems.
3. Recomputing heights and accidentally creating `O(N²)` algorithms.
4. Confusing maximum level width with positional width.
5. Treating an arbitrary path as root-to-leaf.
6. Forgetting that a path can pass through a node without being a root path.
7. Ignoring aliasing when implementing destructive mirror operations.

## 32. Edge Cases

Test:

- empty tree;
- single node;
- one-sided tree;
- balanced tree;
- complete tree;
- duplicate values;
- negative path values;
- zero values;
- very deep trees;
- very wide trees.

## 33. Backend Applications

Structural tree analysis supports:

- hierarchy validation;
- organization depth/width analysis;
- permission-tree checks;
- document transformation;
- dependency-tree metrics;
- AST analysis.

## 34. AI Applications

Structural properties support:

- search-tree analysis;
- planning depth;
- decision-tree metrics;
- hierarchical classification;
- parse-tree analysis;
- candidate-search diagnostics.

## 35. Testing Strategy

Use structural invariants:

```text
N = edges + 1
internal + leaves = N
mirror(mirror(T)) = T
height/diameter match reference
balance result matches exhaustive checker
```

Compare optimized one-pass algorithms with simple reference implementations on generated trees.

## 36. Interview Framework

When asked for a tree property:

```text
1. Define the exact property.
2. Decide whether state flows down, up, or both.
3. Identify the smallest subtree summary.
4. Derive the recurrence.
5. Choose DFS/BFS based on the property.
6. Check empty-child semantics.
7. Prove the combine step.
8. Analyze H and N.
```

## 37. Revision Checklist

- [ ] I can compute height in one traversal.
- [ ] I can check balance without repeated height calculations.
- [ ] I can compute diameter in `O(N)`.
- [ ] I understand actual-node vs positional width.
- [ ] I can solve root-to-leaf path problems.
- [ ] I can distinguish downward and upward state.
- [ ] I can test symmetry and mirror properties.
- [ ] I can use structural induction for proofs.
- [ ] I can reason about `O(N)` time and `O(H)` space.

## 38. Key Takeaways

1. **Most binary-tree structural problems reduce to computing a small summary for each subtree.**
2. **Bottom-up postorder reasoning often converts repeated `O(N²)` work into a single `O(N)` traversal.**
3. **Height, width, and diameter use different notions of structure and must not be conflated.**
4. **Path problems require careful separation of downward state, upward summaries, and global results.**
5. **Precise definitions and structural invariants are more important than memorizing individual tree tricks.**
