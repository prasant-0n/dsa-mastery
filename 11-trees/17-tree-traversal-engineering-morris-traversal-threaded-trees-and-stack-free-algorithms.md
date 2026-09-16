# 11.17 — Tree Traversal Engineering: Morris Traversal, Threaded Trees & Stack-Free Algorithms

## 1. Objective

Tree traversal is more than preorder, inorder, and postorder definitions. Production and interview implementations may need bounded auxiliary space, stack safety, mutation control, predictable locality, and traversal over augmented or threaded structures.

## 2. Traversal Families

Core depth-first traversals:

```text
Preorder  → node, left, right
Inorder   → left, node, right
Postorder → left, right, node
```

Breadth-first traversal uses a queue and processes nodes by level.

## 3. Recursive Traversal

Recursive DFS is concise because the call stack stores pending subtrees. Auxiliary space is `O(H)`, where `H` is tree height.

For a balanced tree this is `O(log N)`; for a skewed tree it can become `O(N)`.

## 4. Explicit Stack Traversal

Replacing recursion with an explicit stack makes stack memory visible and controllable.

This is especially useful in JavaScript when tree depth may be large enough to exceed the runtime call stack.

## 5. Iterative Preorder

Push the root, process it, then push right before left so the left subtree is processed first.

The stack represents deferred work.

## 6. Iterative Inorder

Repeatedly descend left while pushing ancestors, process the nearest unvisited node, then move into its right subtree.

The stack contains the path whose left subtrees have been handled but whose nodes remain pending.

## 7. Iterative Postorder

Postorder requires knowing whether a node's children have been processed. Common strategies use:

- two stacks;
- one stack plus last-visited state;
- explicit frames containing traversal state.

## 8. State-Machine Traversal

A stack frame can explicitly encode a program counter:

```text
ENTER → LEFT_DONE → RIGHT_DONE
```

This gives a systematic transformation from recursive algorithms to iterative ones.

## 9. Morris Traversal

Morris traversal uses temporary right links, called threads, to traverse a binary tree with `O(1)` auxiliary space under the standard mutable-tree model.

It avoids both recursion and an explicit stack.

## 10. Morris Inorder

For current node `x`:

1. if no left child, visit `x` and move right;
2. otherwise find the inorder predecessor in `x.left`;
3. if predecessor's right is empty, create a temporary thread to `x` and move left;
4. if the thread already points to `x`, remove it, visit `x`, and move right.

## 11. Temporary Mutation

Morris traversal temporarily modifies pointers. Correct implementations must restore every temporary thread before completion.

This is a central invariant, not an optional cleanup detail.

## 12. Morris Postorder

Postorder Morris traversal is more involved because output order differs from the natural threaded traversal. A common technique temporarily reverses right-edge paths, visits them, then restores them.

The restoration invariant must be preserved.

## 13. Morris Space Complexity

Auxiliary pointer/state storage can be `O(1)` beyond output, but the algorithm performs additional predecessor searches.

Time remains `O(N)` under the standard amortized traversal analysis because temporary edges are created and removed in bounded aggregate work.

## 14. Threaded Binary Trees

A threaded tree permanently uses otherwise-null child pointers to point to traversal predecessors or successors, together with metadata identifying whether a pointer is a child or a thread.

## 15. Single vs Double Threading

Single-threaded trees add one direction of traversal links. Double-threaded trees provide predecessor and successor links.

The representation must distinguish threads from real children.

## 16. Threaded Inorder Traversal

A threaded tree can traverse inorder without recursion or an auxiliary stack by following successor threads.

This is useful when repeated ordered traversal is required and the representation can permanently maintain thread metadata.

## 17. Morris vs Threaded Trees

Morris traversal creates temporary threads and restores the original tree. Threaded trees maintain traversal links as part of the data structure.

Morris minimizes persistent metadata but mutates during traversal. Threaded trees increase representation complexity but can make traversal direct.

## 18. Traversal with Parent Pointers

Parent pointers can eliminate some auxiliary stack requirements by allowing the algorithm to find successors from the current node.

This trades memory in each node for traversal-state simplification.

## 19. Inorder Successor

For a BST node:

- if it has a right subtree, successor is the minimum of that subtree;
- otherwise move upward until the node is a left child of an ancestor.

This is fundamental to ordered iteration.

## 20. Reverse Inorder

Reverse inorder is:

```text
right → node → left
```

It yields BST keys in descending order and supports reverse ordered iteration.

## 21. Early-Terminating Traversal

Many queries do not require visiting the whole tree. Examples include:

- first value satisfying a predicate;
- k smallest values;
- range reporting;
- existence checks.

Traversal should stop as soon as the result contract allows.

## 22. Generator-Based Traversal

JavaScript generators can expose lazy traversal:

```js
function* inorder(root) {
  // traversal state
}
```

This can integrate naturally with `for...of`, but the underlying state still requires either recursion, an explicit stack, threads, or parent navigation.

## 23. Streaming Traversal

A traversal can feed consumers incrementally rather than constructing a full result array.

This reduces output buffering but does not eliminate traversal-state memory.

## 24. Traversal of Augmented Trees

Traversal usually ignores balancing metadata for ordering, but validation traversals should inspect metadata such as:

- height;
- subtree size;
- max endpoint;
- color;
- lazy state.

## 25. Concurrent Mutation Hazard

Morris traversal is unsuitable when other code may concurrently mutate the same tree because it temporarily changes pointers.

Even in single-threaded JavaScript, callbacks invoked during traversal can create reentrancy hazards.

## 26. Read-Only Traversal Contract

If an API promises a read-only traversal, Morris traversal may violate the intuitive contract because the structure is temporarily mutated.

An explicit stack or persistent/thread-safe representation may be preferable.

## 27. Exception Safety

If traversal invokes user callbacks, exceptions can occur while temporary Morris threads exist.

Production implementations need a strategy to guarantee restoration, such as carefully structured cleanup or avoiding temporary mutation when callbacks are untrusted.

## 28. Cycle Detection

Ordinary trees should be acyclic. Pointer corruption can create cycles and cause infinite traversal.

Debug validators can maintain visited identities when diagnosing malformed structures, though this adds `O(N)` auxiliary space.

## 29. Complexity

For `N` nodes and height `H`:

```text
Recursive DFS: O(N) time, O(H) stack
Explicit-stack DFS: O(N) time, O(H) auxiliary stack
BFS: O(N) time, O(W) queue
Morris DFS: O(N) amortized time, O(1) auxiliary state
Threaded traversal: O(N) time, O(1) traversal auxiliary state
```

`W` is maximum tree width.

## 30. Correctness Invariants

For Morris traversal:

1. every temporary thread points to the correct future ancestor;
2. each created thread is removed exactly once;
3. original child pointers are restored;
4. each node is visited exactly once in the requested order.

## 31. Correctness of Iterative DFS

The explicit stack must represent exactly the recursive algorithm's pending calls. A useful proof technique is to map each stack frame to a recursive invocation state.

## 32. Common Mistakes

1. Forgetting to remove Morris threads.
2. Misidentifying the inorder predecessor.
3. Accidentally following a thread as a child.
4. Producing duplicate visits.
5. Assuming `O(1)` space means no temporary mutation.
6. Ignoring callback exceptions during Morris traversal.
7. Using BFS when DFS is required for memory reasons.

## 33. Edge Cases

Test:

- empty tree;
- single node;
- only-left chains;
- only-right chains;
- balanced trees;
- duplicate keys;
- threaded nodes with missing children;
- callback exceptions;
- early termination;
- extremely deep trees.

## 34. Backend Applications

Traversal engineering supports:

- ordered cache iteration;
- hierarchical configuration processing;
- index scans;
- expression-tree evaluation;
- filesystem/tree metadata traversal.

## 35. AI Applications

It can support:

- AST traversal for code intelligence;
- search-tree exploration;
- hierarchical feature structures;
- expression evaluation;
- memory-efficient traversal of inference/search state.

## 36. Testing Strategy

Use:

- recursive traversal as a reference;
- iterative-vs-recursive differential tests;
- Morris-vs-recursive output tests;
- post-traversal structural equality checks;
- thread-restoration assertions;
- deep-tree stress tests;
- exception-safety tests.

## 37. Interview Framework

```text
1. Explain recursive DFS.
2. Convert it to an explicit stack.
3. Explain the stack invariant.
4. Explain Morris traversal.
5. Explain how Morris achieves O(1) auxiliary space.
6. Explain temporary-thread restoration.
7. Analyze amortized time.
8. Explain threaded trees.
9. Discuss mutation/reentrancy risks.
10. Choose a traversal strategy for a production workload.
```

## 38. Revision Checklist

- [ ] I can implement recursive DFS.
- [ ] I can derive iterative preorder.
- [ ] I can derive iterative inorder.
- [ ] I understand iterative postorder state.
- [ ] I can explain Morris inorder.
- [ ] I understand thread creation/removal.
- [ ] I can prove Morris restoration.
- [ ] I understand threaded trees.
- [ ] I can reason about traversal memory.
- [ ] I can choose a safe production traversal strategy.

## 39. Key Takeaways

1. **Traversal is an execution-state problem: recursion, explicit stacks, parent pointers, and threads are different ways to store that state.**
2. **Morris traversal achieves constant auxiliary traversal state by temporarily threading the tree and restoring it.**
3. **Threaded trees make traversal links part of the permanent representation.**
4. **The safest traversal strategy depends not only on asymptotic space but also on mutation, reentrancy, exception, and concurrency contracts.**
5. **A production traversal should be selected from the data structure's ownership and mutation model, not from Big-O alone.**
