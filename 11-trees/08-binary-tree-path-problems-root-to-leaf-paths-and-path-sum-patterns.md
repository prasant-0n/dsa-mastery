# 11.08 — Binary Tree Path Problems, Root-to-Leaf Paths & Path-Sum Patterns

## 1. Objective

Path problems turn a tree into a family of unique root-to-node or root-to-leaf routes. The key skill is deciding what state travels downward, what result returns upward, and when a path is considered complete.

## 2. Path Definitions

Always distinguish:

- root-to-node path;
- root-to-leaf path;
- node-to-node path;
- downward path that may start anywhere;
- path that may end anywhere.

These definitions produce different algorithms.

## 3. Root-to-Leaf Path

A root-to-leaf path begins at the root and ends at a node with no children.

A path is complete only when a leaf is reached.

## 4. Path State

A DFS can carry state such as:

```text
current sum
current product
current depth
current path
running maximum
```

The state should contain only information needed by descendants or the final result.

## 5. Path Sum Existence

To determine whether a root-to-leaf path reaches a target sum, subtract the current node value from the remaining target as traversal descends.

At a leaf, success requires the remaining target to match the leaf condition exactly.

## 6. Path Sum Enumeration

To return every matching path, maintain a mutable path buffer during DFS:

```text
push node
recurse
pop node
```

The pop operation restores the invariant before exploring a sibling.

## 7. Backtracking Invariant

At entry to a recursive call, the path buffer must represent exactly the root-to-current-node path.

After the call returns, the buffer must be restored to its previous state.

## 8. Maximum Root-to-Leaf Sum

A bottom-up formulation returns the best path value from a node to any descendant leaf.

Missing-child handling is critical when values may be negative.

## 9. Negative Values

Do not use `0` as the default best path when zero is not a valid path. Otherwise an all-negative tree can produce an incorrect result.

Use an explicit unreachable state such as `-Infinity` or a structured result.

## 10. Minimum Root-to-Leaf Sum

The same recurrence works for minimum sums, but again missing-child semantics must distinguish an absent path from a valid path with value zero.

## 11. Count Paths with a Target Sum

If paths must start at the root, a simple DFS carries the remaining target.

If paths may start anywhere, the problem is different and usually needs prefix-sum reasoning or repeated subtree state.

## 12. Any-Start Downward Paths

For paths that can begin at any ancestor and travel downward, prefix-sum counting can avoid enumerating every possible start/end pair.

The standard idea tracks how many earlier prefix sums equal:

```text
currentPrefix - target
```

## 13. Prefix-Sum Map on Trees

Maintain a frequency map of prefix sums along the current root-to-node path.

On visiting a node:

```text
prefix += node.value
answer += count(prefix - target)
count(prefix)++
```

After exploring children, decrement the current prefix frequency to restore the path state.

## 14. Why Backtracking Is Required

The prefix map represents only the current root-to-node path. Leaving a subtree without removing its prefix state would contaminate sibling computations.

## 15. Maximum Path Sum

For arbitrary node-to-node paths, compute the best downward contribution from each child while updating a global best path through the current node.

Negative child contributions can be discarded when the specification permits starting/ending at arbitrary nodes.

## 16. Path Through a Node

A candidate path through node `x` can combine:

```text
bestLeftDown + x + bestRightDown
```

The downward value returned to the parent can use at most one child branch because a parent path cannot branch into both children.

## 17. Path Reconstruction

If the actual path, not only its sum, is required, store enough information to reconstruct the chosen child direction or maintain candidate node references.

Returning complete arrays from every recursive call can create unnecessary allocation.

## 18. Root-to-Leaf Maximum Path

This differs from maximum arbitrary path sum because the path must start at the root and end at a leaf.

Do not apply arbitrary-node maximum-path logic without checking the endpoint constraints.

## 19. Path Product

Product paths introduce overflow/underflow considerations and zero handling. In production systems, define numeric limits and representation before implementation.

## 20. Path String / Expression Construction

A path can produce:

- slash-separated hierarchy paths;
- dot-separated configuration keys;
- expression strings;
- breadcrumbs.

Avoid repeated immutable string concatenation when paths are very deep; a path buffer can reduce allocation.

## 21. Longest Root-to-Leaf Path

Depth itself provides the length of a root-to-leaf path. The same DFS state can track the maximum depth and optionally retain the corresponding path.

## 22. Lexicographic Path Selection

When multiple paths have the same score, define a deterministic tie-breaker such as lexicographic node sequence, earliest discovery, or node ID ordering.

Tie-breaking is part of correctness when output must be deterministic.

## 23. Path Constraints

Examples include:

- sum ≤ limit;
- maximum number of negative nodes;
- required labels;
- forbidden values;
- resource budgets.

The state representation must capture exactly the constraint information needed for future decisions.

## 24. Path State Compression

If the future only depends on an aggregate such as sum, carry the aggregate rather than the complete path.

If the output requires the actual path, retain enough identity to reconstruct it.

## 25. Recursive vs Iterative Path Algorithms

Recursive DFS is concise and matches the tree model. Iterative DFS requires explicit frames containing the equivalent path/backtracking state.

This is particularly important for very deep trees in JavaScript.

## 26. Complexity

For a single root-to-leaf existence/sum computation:

```text
Time: O(N)
Auxiliary stack/path: O(H)
```

Enumerating all paths has output-sensitive cost because the output itself may contain `Θ(NH)` total node references in a highly branching tree.

## 27. Prefix-Sum Complexity

For target-sum paths that may start anywhere:

```text
Time: O(N) expected
Auxiliary map + recursion state: O(H)
```

The expected constant-time map operations assume appropriate hash-table behavior.

## 28. Correctness Proof

For root-to-leaf path sums, prove by induction that the carried state equals the aggregate of the exact root-to-current path.

At a leaf, the decision therefore corresponds exactly to the required path condition.

## 29. Correctness of Prefix-Sum Counting

At a node with prefix `P`, every earlier prefix `P - target` identifies a downward path ending at the current node whose sum is the target.

Backtracking ensures only prefixes on the current root-to-node path are counted.

## 30. Common Mistakes

1. Confusing root-to-leaf with arbitrary node-to-node paths.
2. Treating an absent child as a valid zero-valued path.
3. Using `0` as the best result when all values may be negative.
4. Forgetting path-buffer backtracking.
5. Forgetting prefix-map cleanup.
6. Returning copied path arrays at every recursion level.
7. Ignoring deterministic tie-breaking.
8. Assuming recursion depth is unlimited in JavaScript.

## 31. Edge Cases

Test:

- empty tree;
- single node;
- target equals root;
- target equals a leaf;
- all-negative values;
- zero values;
- duplicate values;
- very deep trees;
- multiple matching paths;
- no matching path;
- target-sum paths with arbitrary starting nodes.

## 32. Backend Applications

Path algorithms support:

- organization hierarchy paths;
- category breadcrumbs;
- configuration inheritance;
- permission ancestry;
- dependency paths;
- filesystem-like routing;
- audit hierarchy analysis.

## 33. AI Applications

They support:

- planning trajectories;
- decision-tree paths;
- search-state scoring;
- explanation paths through hierarchical models;
- AST expression paths;
- constrained search traces.

## 34. Testing Strategy

Use:

- brute-force path enumeration as a reference;
- random trees with negative/zero/positive values;
- prefix-sum vs enumeration differential tests;
- path reconstruction validation;
- backtracking-state leak tests;
- deep-tree iterative stress tests.

## 35. Interview Framework

When solving a path problem:

```text
1. What are the allowed endpoints?
2. Must the path reach a leaf?
3. Can it start anywhere?
4. Is the path downward only?
5. What state is needed for descendants?
6. Is the actual path required or only a score?
7. Are negative values possible?
8. Can prefix sums compress the state?
9. What is the recursion depth?
10. What is the exact complexity including output size?
```

## 36. Revision Checklist

- [ ] I can solve root-to-leaf sum existence.
- [ ] I can enumerate root-to-leaf paths.
- [ ] I can handle negative values correctly.
- [ ] I understand arbitrary-start downward path sums.
- [ ] I can derive prefix-sum path counting.
- [ ] I can compute maximum arbitrary path sum.
- [ ] I can reconstruct a selected path.
- [ ] I understand path-state compression.
- [ ] I can convert recursive path algorithms to iterative form.
- [ ] I can analyze output-sensitive complexity.

## 37. Key Takeaways

1. **Path problems are defined primarily by endpoint and direction constraints.**
2. **Carry only the state descendants actually need; reconstruct full paths only when the output requires them.**
3. **Backtracking is a state-restoration invariant, not merely a coding trick.**
4. **Prefix sums transform many any-start downward path problems from repeated enumeration into one traversal.**
5. **Negative values and missing-child semantics are frequent sources of subtle correctness bugs.**
