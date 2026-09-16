# 11.09 — Binary Tree Dynamic Programming: Subtree State, Bottom-Up DP & Tree DP Patterns

## 1. Objective

Tree Dynamic Programming (Tree DP) solves problems by defining a compact state for each subtree, solving child subproblems, and combining their results at the parent.

The core workflow is:

```text
state definition → child states → transition → answer
```

## 2. Why Tree DP Works

A tree has no cycles and every child subtree is structurally independent once the parent decision/state is fixed. This makes recursive decomposition especially natural.

## 3. Subtree as a DP Subproblem

For a node `u`, define a state that summarizes everything the parent needs to know about the subtree rooted at `u`.

A good state is:

- sufficient;
- minimal enough to avoid unnecessary work;
- composable from child states.

## 4. Bottom-Up DP

Postorder traversal naturally computes child states before the parent:

```text
solve(left)
solve(right)
combine
```

This is the default mental model for many tree DP problems.

## 5. State Design

Before coding, ask:

```text
What question will the parent ask this subtree?
```

The answer determines the state returned upward.

## 6. Scalar State

Some problems need one value:

```text
height
subtree size
minimum cost
maximum sum
```

Scalar states are simple and efficient.

## 7. Multi-Value State

Other problems need multiple related facts:

```text
{ height, balanced }
{ include, exclude }
{ bestDown, bestGlobal }
```

Returning a structured object can make dependencies explicit.

## 8. Tree Diameter as DP

Return height upward while maintaining the best diameter seen through each node.

The node combines two child heights to create a candidate path.

## 9. Balanced Tree as DP

Return both:

```text
height
isBalanced
```

A node is balanced only when both child states are balanced and their heights differ within the allowed threshold.

## 10. Maximum Path Sum as DP

Return the best downward contribution because the parent can extend only one child branch.

Separately track the best complete path that can pass through the current node.

## 11. Include/Exclude State

A common tree DP pattern is:

```text
include(u)
exclude(u)
```

For example, when adjacent nodes cannot both be selected, including `u` restricts child choices while excluding `u` allows the best child alternatives.

## 12. Tree Independent Set Pattern

For maximum-weight independent set on a tree:

```text
include(u) = weight(u) + Σ exclude(child)
exclude(u) = Σ max(include(child), exclude(child))
```

The recurrence directly follows the adjacency constraint.

## 13. Minimum Vertex Cover Pattern

For a tree vertex cover:

```text
include(u) = 1 + Σ min(include(child), exclude(child))
exclude(u) = Σ include(child)
```

An uncovered parent forces children to be included for every parent-child edge.

## 14. Tree Coloring / Labeling

When nodes receive one of `K` colors and adjacent colors cannot match, a state can represent the best result for each possible color at each subtree.

This gives a typical `O(NK²)` transition, reducible to `O(NK)` with suitable best/second-best optimization in some variants.

## 15. Knapsack-Like Tree DP

If each node has a budget/resource dimension, the state may become:

```text
dp[u][capacity]
```

Combining child subtrees becomes a convolution/knapsack-style merge.

Complexity can become `O(NK²)` or higher depending on the merge structure.

## 16. Rerooting Motivation

A standard bottom-up DP often answers a property relative to one fixed root.

Rerooting computes answers as if every node were the root, usually by combining:

1. a downward/subtree pass;
2. an upward/outside-subtree pass.

## 17. Subtree vs Outside State

For rerooting, distinguish:

```text
inside[u] = information from u's subtree
outside[u] = information coming through u's parent side
```

Then combine both to derive an all-directions answer for `u`.

## 18. Prefix/Suffix Child Aggregation

When excluding one child from a parent's aggregate, prefix/suffix aggregates can avoid recomputing all siblings.

This is a general technique for rerooting transitions.

## 19. Example: Sum of Distances

For a rooted tree, a first pass can compute subtree sizes and total distance from the root.

A second pass derives the answer for neighboring roots using the subtree size relationship.

The important lesson is state transfer across an edge.

## 20. Memoization

Memoization is useful when a recursive state can be reached through multiple equivalent subproblems.

In a plain rooted tree, each subtree normally has one parent, so bottom-up traversal already avoids duplicate computation.

Memoization becomes more relevant when the state includes additional dimensions or the structure is DAG-like rather than a strict tree.

## 21. Tree DP vs Graph DP

A tree's absence of cycles makes parent-child dependency ordering straightforward.

General graphs require cycle handling and often use different state decompositions.

Do not transfer a tree recurrence to an arbitrary graph without proving the dependency structure.

## 22. Top-Down + Bottom-Up DP

Some problems need both:

- ancestor-provided constraints flowing downward;
- subtree summaries flowing upward.

This creates a two-directional state model and often leads naturally to rerooting or path-based techniques.

## 23. Global Answer vs Returned State

A frequent pattern is:

```text
returned state → what parent needs
global answer   → best complete solution anywhere
```

Confusing these two can produce incorrect transitions.

## 24. Sentinel / Impossible States

When a subtree cannot satisfy a constraint, represent impossibility explicitly.

Do not use an ordinary numeric value such as `0` if it could also represent a valid solution.

## 25. State Compression

If several values can be derived from one another, avoid storing redundant state.

For example, if only the best and second-best child contributions are needed, storing every child combination may be unnecessary.

## 26. Transition Ordering

A correct tree DP has a dependency direction:

```text
children → parent
```

for bottom-up DP.

The implementation must process children before consuming their state.

## 27. Correctness Proof Template

For every state `dp[u]`:

1. define exactly what it means;
2. prove base case;
3. assume child states are correct;
4. show the transition considers every legal combination;
5. show no illegal combination is included;
6. conclude the parent state is correct.

## 28. Complexity

For a scalar-state tree DP:

```text
Time: O(N)
Space: O(H)
```

If each node processes `K` states:

```text
Time: typically O(NK) or O(NK²)
```

depending on transition cost.

Additional dimensions such as capacity can increase complexity substantially.

## 29. Common Mistakes

1. Designing state after writing code.
2. Returning insufficient information to the parent.
3. Returning excessive redundant information.
4. Forgetting impossible states.
5. Mixing global answer with subtree return value.
6. Using a rooted-tree recurrence on a cyclic graph.
7. Recomputing sibling aggregates unnecessarily.
8. Ignoring recursion depth.

## 30. Edge Cases

Test:

- empty tree;
- single node;
- skewed tree;
- balanced tree;
- negative weights;
- zero weights;
- duplicate labels;
- impossible constraints;
- large state dimensions;
- deep recursion.

## 31. Backend Applications

Tree DP patterns appear in:

- hierarchy optimization;
- permission policy evaluation;
- dependency cost aggregation;
- organization resource allocation;
- configuration inheritance;
- hierarchical scheduling.

## 32. AI Applications

Tree DP can support:

- search-tree scoring;
- decision-tree optimization;
- planning-state evaluation;
- hierarchical label optimization;
- constrained tree search;
- structured prediction over trees.

## 33. Testing Strategy

Use:

- brute-force enumeration for small trees;
- randomized weighted trees;
- recurrence-level property tests;
- optimized-vs-naive differential testing;
- rerooting vs per-root brute force;
- impossible-state tests;
- deep-tree iterative stress tests.

## 34. Interview Framework

When a tree DP problem appears:

```text
1. What exactly does dp[u] mean?
2. What must the parent know?
3. Is the state scalar or multi-dimensional?
4. Can children be solved independently?
5. Is the answer local or global?
6. Are there include/exclude choices?
7. Are there resource dimensions?
8. Do I need rerooting?
9. Can sibling aggregates be optimized?
10. What are N, H, K, and any additional dimensions?
```

## 35. Revision Checklist

- [ ] I can define a subtree state before coding.
- [ ] I can derive bottom-up transitions.
- [ ] I understand include/exclude DP.
- [ ] I can distinguish returned state from global answer.
- [ ] I can represent impossible states safely.
- [ ] I understand rerooting at a conceptual level.
- [ ] I can reason about state dimensions and transition cost.
- [ ] I can prove a tree-DP recurrence.
- [ ] I can compare optimized DP with brute force.
- [ ] I can identify backend and AI applications.

## 36. Key Takeaways

1. **Tree DP is primarily a state-design discipline: define exactly what each subtree must report to its parent.**
2. **Postorder traversal is the natural execution order for bottom-up tree DP.**
3. **Include/exclude, multi-state summaries, and rerooting are reusable families of tree-DP patterns.**
4. **The returned state and the global answer often have different meanings and must be separated.**
5. **Complexity is determined not only by the number of nodes but also by the number and cost of DP states and transitions.**
