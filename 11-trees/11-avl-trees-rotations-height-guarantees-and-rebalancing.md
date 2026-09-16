# 11.11 — AVL Trees, Rotations, Height Guarantees & Rebalancing

## 1. Objective

An AVL tree is a self-balancing Binary Search Tree (BST). Every node maintains a balance condition that keeps tree height logarithmic, preserving efficient search, insertion, and deletion.

## 2. BST Foundation

An AVL tree inherits the BST ordering invariant:

```text
left keys < node key < right keys
```

The exact duplicate policy must be defined by the implementation.

## 3. Balance Factor

For node `u`:

```text
balanceFactor(u) = height(left(u)) - height(right(u))
```

An AVL node is balanced when:

```text
-1 <= balanceFactor(u) <= 1
```

## 4. Why Balancing Exists

An ordinary BST can become a chain when insertion order is unfavorable. Its height can become `O(N)`, degrading search and updates.

AVL balancing prevents this degeneration.

## 5. Height Guarantee

AVL trees maintain logarithmic height. The minimum number of nodes required for height `h` follows a Fibonacci-like recurrence:

```text
N(h) = 1 + N(h-1) + N(h-2)
```

Therefore AVL height is `O(log N)`.

## 6. Rotations

Rotations change local structure while preserving inorder key order.

The four classical imbalance cases are:

- LL → right rotation;
- RR → left rotation;
- LR → left rotation, then right rotation;
- RL → right rotation, then left rotation.

## 7. Rotation Correctness

A rotation must preserve:

1. BST ordering;
2. all involved nodes;
3. subtree relationships outside the rotated region;
4. parent pointers if present.

## 8. Right Rotation

For a left-heavy subtree, a right rotation promotes the left child and moves its right subtree to the original root's left side.

The inorder sequence remains unchanged.

## 9. Left Rotation

For a right-heavy subtree, a left rotation promotes the right child and moves its left subtree to the original root's right side.

Again, inorder ordering is preserved.

## 10. Double Rotations

LR and RL cases first transform the shape into a single-rotation case, then perform the required outer rotation.

The two rotations together repair the local imbalance while preserving ordering.

## 11. Node Metadata

An AVL node commonly stores:

```text
key
left
right
height
```

Parent pointers may be added when upward navigation or iterative updates are required.

## 12. Height Maintenance

After modifying a subtree:

```text
height(u) = 1 + max(height(left), height(right))
```

The height must be updated after child pointers change and before the balance factor is evaluated by ancestors.

## 13. Insertion

AVL insertion follows the normal BST insertion path, then walks back toward the root updating heights and repairing imbalances.

Only ancestors of the inserted node can have changed height.

## 14. Insertion Rebalancing

After insertion, inspect each ancestor:

1. update height;
2. compute balance factor;
3. identify LL/RR/LR/RL shape;
4. rotate if required.

## 15. Deletion

Deletion begins with normal BST deletion.

Unlike insertion, multiple ancestors may require height changes and rebalancing while walking toward the root.

This makes AVL deletion more subtle.

## 16. BST Deletion Cases

A node can have:

- no children;
- one child;
- two children.

For two children, replace/remove using an inorder successor or predecessor while preserving ordering.

## 17. Deletion Rebalancing

After each structural change on the path to the root, recompute height and balance. A rotation can reduce subtree height and allow further ancestors to become unbalanced.

## 18. Recursive vs Iterative Updates

Recursive implementations naturally return the updated subtree root after rotations.

Iterative implementations can use parent pointers or an explicit ancestor stack.

The choice affects API shape and memory behavior.

## 19. Subtree Root Return Pattern

A key implementation pattern is:

```text
node = rebalance(node)
return node
```

After a rotation, the local subtree root may change. Forgetting to return the new root is a common structural bug.

## 20. Duplicate Keys

AVL trees need an explicit duplicate policy:

- reject duplicates;
- count duplicates in each node;
- consistently place equal keys on one side.

The policy must remain consistent through rotations and deletion.

## 21. Search

Search is the ordinary BST search procedure.

Because AVL height is `O(log N)`, search is `O(log N)` worst case.

## 22. Minimum and Maximum

The minimum is found by following left children; maximum by following right children.

Both cost `O(log N)` in an AVL tree.

## 23. Predecessor and Successor

BST predecessor/successor queries can use local child subtrees and ancestor relationships.

With AVL height bounded logarithmically, these operations are `O(log N)`.

## 24. Range Queries

An AVL tree can support ordered range traversal by pruning subtrees that cannot contain keys in the requested interval.

Time depends on the output size and tree height.

## 25. Augmented AVL Trees

Additional metadata can support richer queries:

- subtree size;
- sum/min/max;
- interval information;
- order statistics.

Every rotation must update all affected metadata correctly.

## 26. Order Statistics

With subtree sizes, an AVL tree can support:

```text
k-th smallest
rank(key)
```

in `O(log N)` if metadata is maintained correctly.

## 27. Rotation Metadata Invariant

For every rotation, recompute metadata bottom-up for the nodes whose child relationships changed.

Updating only height while forgetting augmented fields produces logically corrupted trees.

## 28. AVL vs Red-Black Trees

AVL trees enforce a tighter height bound than Red-Black trees, while Red-Black trees generally allow fewer balancing adjustments in update-heavy workloads.

The appropriate structure depends on workload and implementation requirements.

## 29. AVL vs Heap

A heap provides efficient extreme-priority access but does not support arbitrary ordered search like a BST.

An AVL tree provides ordered search and range operations.

They solve different problems.

## 30. Complexity

For `N` nodes:

| Operation | Worst-case |
|---|---:|
| Search | `O(log N)` |
| Insert | `O(log N)` |
| Delete | `O(log N)` |
| Min/Max | `O(log N)` |
| Predecessor/Successor | `O(log N)` |
| Rotation | `O(1)` |

A full traversal remains `O(N)`.

## 31. Correctness Proof

AVL correctness requires three invariants:

1. BST ordering is preserved;
2. every node's stored height is correct;
3. every node satisfies the AVL balance bound.

Insertion/deletion proofs show that local repairs restore these invariants along the modified ancestor path.

## 32. Rotation Proof Strategy

For each rotation:

1. write the inorder sequence before rotation;
2. write the inorder sequence after rotation;
3. show the sequences are identical;
4. verify each affected subtree remains attached to the correct ordering interval.

## 33. Common Mistakes

1. Using incorrect height base cases.
2. Computing balance factors with stale heights.
3. Returning the old root after rotation.
4. Mishandling LR/RL cases.
5. Forgetting parent-pointer updates.
6. Updating augmented metadata incompletely.
7. Treating duplicate keys inconsistently.
8. Assuming deletion needs the same single-repair logic as insertion.

## 34. Edge Cases

Test:

- empty tree;
- single node;
- LL insertion;
- RR insertion;
- LR insertion;
- RL insertion;
- repeated deletion;
- root deletion;
- duplicate keys;
- highly skewing insertion sequences;
- augmented metadata.

## 35. Testing Strategy

Use:

- BST invariant validation;
- AVL balance validation;
- stored-height validation;
- inorder comparison against a sorted reference;
- random insertion/deletion sequences;
- rotation-specific tests;
- differential tests against a reference ordered set;
- metadata consistency checks.

## 36. Backend Applications

AVL trees can support:

- ordered in-memory indexes;
- scheduler priority/range structures;
- configuration version ordering;
- ranking and ordered lookup;
- embedded indexes where predictable worst-case lookup matters.

## 37. AI Applications

They can support:

- ordered candidate indexes;
- deterministic threshold/range retrieval;
- online ranked data structures;
- search-state ordering where balanced ordered access is required.

## 38. Interview Framework

When asked about AVL trees:

```text
1. What is the BST invariant?
2. What is the balance factor?
3. Why does AVL height stay logarithmic?
4. Which imbalance case occurred?
5. Which rotation repairs it?
6. What metadata must be updated?
7. Why does rotation preserve inorder ordering?
8. Why is deletion harder than insertion?
9. What are the worst-case complexities?
10. When would another ordered structure be preferable?
```

## 39. Revision Checklist

- [ ] I can define the AVL invariant.
- [ ] I can calculate balance factors.
- [ ] I can derive LL/RR/LR/RL cases.
- [ ] I can implement single rotations.
- [ ] I can implement double rotations.
- [ ] I can insert into an AVL tree.
- [ ] I understand deletion rebalancing.
- [ ] I can prove rotations preserve BST order.
- [ ] I understand augmented AVL metadata.
- [ ] I can explain AVL complexity and height guarantees.

## 40. Key Takeaways

1. **AVL trees combine the BST ordering invariant with a strict local height-balance invariant.**
2. **Rotations repair local imbalance while preserving inorder ordering.**
3. **Stored height is algorithmic state and must be updated consistently after every structural change.**
4. **Deletion can require multiple rebalancing steps on the path to the root.**
5. **Augmented AVL trees extend balanced ordered search into rank, aggregate, and range-query systems, provided every rotation maintains all metadata.**
