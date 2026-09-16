# 11.02 — Tree Traversal: DFS, BFS, Preorder, Inorder, Postorder & Level-Order

## 1. Objective

Tree traversal is the systematic process of visiting every relevant node according to a defined order. The traversal order determines what information is available when a node is processed and therefore which problems the traversal can solve naturally.

## 2. Why Traversal Exists

A tree does not have one universal linear order. Traversal converts hierarchical structure into a controlled sequence of visits.

Typical goals include:

- searching;
- aggregation;
- serialization;
- expression evaluation;
- structural validation;
- transformation;
- level-based analysis.

## 3. Two Major Families

### Depth-First Search (DFS)

Explore a branch deeply before moving to another branch.

### Breadth-First Search (BFS)

Explore nodes level by level using a queue.

Both can visit every node once, but they expose different structural information.

## 4. Preorder

For a binary tree:

```text
node → left → right
```

Preorder processes a parent before its descendants.

It is useful for:

- copying structure;
- serialization with null markers;
- prefix expression representation;
- root-first processing.

## 5. Inorder

```text
left → node → right
```

For a binary search tree, inorder traversal produces keys in nondecreasing order when the tree obeys the BST ordering invariant.

## 6. Postorder

```text
left → right → node
```

Postorder processes children before their parent.

It is useful when the parent result depends on completed child results:

- subtree sizes;
- deletion/freeing structures;
- expression evaluation;
- bottom-up DP.

## 7. Level-Order

Level-order traversal visits nodes by increasing depth.

A queue typically implements it:

```text
enqueue root
while queue not empty:
  dequeue node
  enqueue children
```

## 8. DFS Recursion

Recursive DFS naturally follows the tree structure:

```text
visit(node)
  visit(left)
  visit(right)
```

Changing where `node` is processed gives preorder, inorder, or postorder.

## 9. Explicit DFS Stack

Recursion can be replaced with an explicit stack containing nodes or traversal frames.

This makes stack state explicit and avoids dependence on the JavaScript call stack.

## 10. Iterative Preorder

Push the root, process it, then push children in reverse desired order so the next node is visited correctly.

For left-before-right preorder:

```text
push right
push left
```

## 11. Iterative Inorder

Maintain a stack of ancestors while repeatedly descending left. Process the node when its left subtree has been exhausted, then continue into the right subtree.

## 12. Iterative Postorder

Postorder is more stateful because a node must wait for both children.

Approaches include:

- two stacks;
- one stack plus a last-visited reference;
- explicit frames storing the next action.

## 13. Traversal Frames

A general iterative DFS frame can store:

```text
node
nextChildIndex
localState
```

This is a direct simulation of recursive call-stack state.

## 14. Morris Traversal

Morris traversal can perform inorder traversal with `O(1)` auxiliary space by temporarily modifying tree links and restoring them afterward.

The restoration invariant is essential.

## 15. BFS Queue Model

BFS maintains a frontier:

```text
current frontier
→ next frontier
```

A queue ensures nodes are processed in nondecreasing depth order.

## 16. Level Boundaries

To process one level at a time, use either:

- the queue length at the start of a level;
- explicit level markers;
- two frontier collections.

Queue-length batching is usually simple and allocation-friendly.

## 17. Multi-Source BFS

Multiple roots can be inserted initially. BFS then explores outward from all sources simultaneously.

This is useful for nearest-source distance problems.

## 18. BFS Distance Invariant

In an unweighted graph/tree, when BFS first assigns a node distance `d`, that distance is the shortest number of edges from the source set under standard BFS assumptions.

## 19. Search and Early Exit

Traversal need not always visit every node.

If the objective is existence, a traversal can stop as soon as a valid target is found.

For complete aggregation, early exit is generally invalid unless the remaining nodes cannot affect the result.

## 20. Traversal + State

Many tree algorithms carry state through traversal:

```text
path
ancestor information
accumulator
bounds
running depth
parent reference
```

The state must represent exactly what the subtree or frontier requires.

## 21. Preorder Serialization

Preorder plus explicit null markers can uniquely encode a binary tree structure.

Without null markers, different shapes can produce the same value sequence.

## 22. Inorder + Preorder Reconstruction

Under appropriate uniqueness assumptions, preorder and inorder traversals can reconstruct a binary tree.

Duplicate values require additional identity information or different conventions.

## 23. Postorder Applications

Postorder is natural for bottom-up computations:

```text
child results
→ combine at parent
→ return parent result
```

This pattern is fundamental to tree DP.

## 24. Traversal Complexity

For a tree with `N` nodes:

```text
Time: O(N)
```

Typical auxiliary space:

```text
DFS recursion/stack: O(H)
BFS queue: O(W)
```

where `H` is tree height and `W` is maximum width.

## 25. BFS vs DFS Memory

A deep skewed tree can make DFS use `O(N)` stack space while BFS may use a small frontier.

A wide balanced tree can make BFS use `O(N)` queue space while DFS may use only `O(log N)` stack space.

## 26. Traversal on General Trees

For a node with `children`, DFS processes children according to their order. The same preorder/postorder concepts generalize naturally.

## 27. Traversal with Parent Pointers

If nodes have parent references, traversal can navigate upward as well as downward. This can support iterative algorithms but introduces additional memory and consistency requirements.

## 28. Cycle / Shared-Reference Safety

A mathematical tree has no cycles and normally has unique parent ownership. Arbitrary JavaScript object graphs may violate these assumptions.

If input can be malformed, use a visited structure to detect repeated references rather than assuming tree validity.

## 29. Correctness Proof

A traversal proof should establish:

1. the initial frontier/stack contains every required starting node;
2. each expansion adds exactly the intended children;
3. processing order follows the traversal definition;
4. every reachable tree node is eventually processed unless an intentional early exit occurs;
5. no node is processed more than intended.

## 30. Common Mistakes

1. Pushing DFS children in the wrong order.
2. Mixing preorder and postorder state timing.
3. Using `shift()` repeatedly on JavaScript arrays for BFS and accidentally creating quadratic behavior.
4. Forgetting null roots.
5. Assuming inorder is sorted for every binary tree.
6. Reconstructing trees with duplicate values without handling ambiguity.
7. Forgetting to restore Morris traversal links.
8. Using early exit when the result requires all nodes.

## 31. Edge Cases

Test:

- empty tree;
- one node;
- only-left tree;
- only-right tree;
- balanced tree;
- duplicate values;
- very deep tree;
- very wide tree;
- malformed/shared-reference object graph where validation is required.

## 32. Backend Applications

Traversal is fundamental for:

- JSON/document processing;
- permission hierarchies;
- organizational trees;
- filesystem-like structures;
- dependency inspection;
- AST transformations;
- hierarchical configuration evaluation.

## 33. AI Applications

Traversal supports:

- search-space exploration;
- tree-based planning;
- syntax processing;
- hierarchical classification;
- decision-tree inference;
- structured data preprocessing.

## 34. Testing Strategy

Use:

- recursive vs iterative differential tests;
- traversal-order reference tests;
- generated balanced/skewed/wide trees;
- serialization/reconstruction round trips;
- malformed-reference tests;
- queue/stack peak-memory measurements.

## 35. Interview Framework

When asked to traverse a tree:

```text
1. Which order is required?
2. DFS or BFS?
3. What state must be carried?
4. Can recursion safely handle the maximum height?
5. If iterative, what does each stack frame represent?
6. For BFS, what is the frontier width?
7. Can the answer terminate early?
8. Are values unique?
9. Is the input guaranteed to be a tree?
10. What are time and auxiliary-space costs?
```

## 36. Revision Checklist

- [ ] I can implement preorder recursively and iteratively.
- [ ] I can implement inorder recursively and iteratively.
- [ ] I can implement postorder recursively and iteratively.
- [ ] I can implement level-order BFS.
- [ ] I understand DFS stack state.
- [ ] I understand BFS frontier state.
- [ ] I know when each traversal is natural.
- [ ] I understand traversal space as `O(H)` vs `O(W)`.
- [ ] I can explain serialization/reconstruction concepts.
- [ ] I can apply traversal to backend and AI structures.

## 37. Key Takeaways

1. **Traversal order is a problem-solving choice, not merely a way to print a tree.**
2. **Preorder is parent-first, inorder is left-node-right, postorder is child-first, and BFS is level-first.**
3. **Recursive DFS and explicit-stack DFS represent the same structural process with different stack ownership.**
4. **BFS memory depends on frontier width; DFS memory depends primarily on height.**
5. **Traversal invariants become the foundation for serialization, tree DP, search, validation, and hierarchical backend/AI processing.**
