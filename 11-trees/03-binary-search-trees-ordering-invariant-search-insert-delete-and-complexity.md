# 11.03 — Binary Search Trees: Ordering Invariant, Search, Insert, Delete & Complexity

## 1. Objective

A Binary Search Tree (BST) is a binary tree whose ordering invariant allows search to eliminate an entire subtree at each decision when the tree is correctly ordered.

## 2. BST Ordering Invariant

For a chosen duplicate policy, every node must satisfy an ordering relationship with its descendants.

A common strict policy is:

```text
all keys in left subtree < node.key < all keys in right subtree
```

Other implementations permit duplicates on one defined side. The policy must be explicit and consistent.

## 3. Why BSTs Exist

A BST combines hierarchical structure with ordering. It can support search, insertion, deletion, predecessor, and successor operations using tree height as the primary cost driver.

## 4. Search

At each node:

```text
key === node.key → found
key < node.key   → search left
key > node.key   → search right
```

Only one child subtree remains relevant after each comparison.

## 5. Search Complexity

For tree height `H`:

```text
Time: O(H)
```

Balanced tree:

```text
O(log N)
```

Skewed tree:

```text
O(N)
```

A BST does not automatically guarantee logarithmic performance.

## 6. Insertion

Insertion follows the same comparisons as search until an empty child position is reached.

The insertion algorithm must preserve the duplicate policy and BST invariant.

## 7. Recursive Insertion

Recursive insertion naturally returns the potentially updated subtree root:

```text
insert(root, key)
→ return updated root
```

This pattern is useful when rotations or structural replacements are later introduced.

## 8. Iterative Insertion

Iterative insertion tracks the current node and parent until it finds the correct null child position.

It avoids recursion depth concerns on highly skewed trees.

## 9. Minimum and Maximum

The minimum key is found by repeatedly following `left`.

The maximum key is found by repeatedly following `right`.

Both require `O(H)` time.

## 10. Predecessor and Successor

For a node:

- predecessor is the largest key smaller than it;
- successor is the smallest key larger than it.

If the relevant child subtree exists, follow the opposite extreme. Otherwise, ancestor relationships determine the answer.

## 11. Delete: Three Cases

Deleting a BST node has three structural cases:

1. leaf;
2. one child;
3. two children.

The first two are direct pointer replacement cases.

## 12. Deleting a Node with Two Children

A common strategy replaces the node's key with its inorder successor, then deletes that successor from the right subtree.

Alternatively, use the inorder predecessor from the left subtree.

The chosen replacement must preserve the ordering invariant.

## 13. Delete Complexity

Search for the node and perform replacement operations along one root-to-leaf path:

```text
Time: O(H)
Auxiliary recursive space: O(H)
```

## 14. Duplicate Keys

Possible policies include:

- reject duplicates;
- always place equal keys left;
- always place equal keys right;
- store a count at each key;
- store a collection of records per key.

Mixing policies breaks search/delete assumptions.

## 15. BST Validation

Checking only each node against its immediate children is insufficient.

A correct validation method carries allowable bounds through the entire subtree:

```text
lower < key < upper
```

according to the selected duplicate policy.

## 16. Inorder Validation

Under a strict unique-key BST policy, inorder traversal must be strictly increasing.

For duplicate-permitting policies, the required monotonicity changes accordingly.

## 17. Range Search

A BST can avoid exploring branches that cannot contain keys within `[low, high]`.

The search still depends on tree height and the number of reported results.

## 18. Lower and Upper Bound

BST navigation can find the first key satisfying a lower-bound condition or the first key greater than a threshold.

At each node, record a candidate and continue toward a potentially better boundary.

## 19. Kth Smallest

Inorder order corresponds to sorted key order under the BST invariant.

A simple solution performs inorder traversal and counts visited nodes.

Augmented trees can support faster repeated rank queries.

## 20. Order Statistics Preview

If every node stores subtree size, the tree can support rank/select operations by comparing `k` with the size of the left subtree.

Maintaining augmentation correctly becomes an invariant of every structural update.

## 21. Successor-Based Iteration

A BST can be traversed in sorted order by repeatedly finding successors.

With parent pointers or a maintained ancestor stack, this can provide an iterator without materializing every key.

## 22. Range Query Complexity

A range query has cost related to the visited tree boundary plus output size.

A useful model is:

```text
O(H + K)
```

for a balanced/appropriately pruned BST where `K` results are reported, subject to implementation details.

## 23. Skewed Trees

Sorted insertion into a naive BST can produce:

```text
root
  \
   node
     \
      node
```

The structure degenerates into a linked list and loses logarithmic search behavior.

## 24. Balanced BST Motivation

Self-balancing trees such as AVL and Red-Black trees maintain height bounds through rotations and balancing rules.

They will be studied separately; here the key lesson is that balance must be actively maintained.

## 25. BST vs Hash Table

BSTs provide ordering and range operations. Hash tables provide expected constant-time key lookup but do not inherently maintain sorted order.

Choose based on required operations rather than assuming one structure is universally superior.

## 26. BST vs Array

A sorted array offers compact storage and efficient binary search but expensive arbitrary insertion/deletion.

A BST offers structural updates but adds node/reference overhead and may require balancing.

## 27. Memory Model

A pointer-based BST node commonly stores:

```text
key
value
left reference
right reference
```

Additional metadata such as parent pointers, subtree size, or balance information increases memory requirements.

## 28. Correctness Proof

A BST operation proof should preserve the ordering invariant.

For insertion/deletion, prove:

1. unaffected subtrees remain valid BSTs;
2. modified links connect valid subtrees;
3. all keys remain on their permitted side of each ancestor;
4. the duplicate policy remains satisfied.

## 29. Common Mistakes

1. Assuming BST means balanced.
2. Validating only immediate children.
3. Ignoring duplicate semantics.
4. Mishandling two-child deletion.
5. Losing the returned subtree root in recursive updates.
6. Using inorder sortedness without defining duplicate policy.
7. Forgetting output-sensitive range-query cost.

## 30. Edge Cases

Test:

- empty tree;
- one node;
- duplicate insertion;
- delete missing key;
- delete root;
- delete leaf;
- delete node with one child;
- delete node with two children;
- all sorted insertions;
- reverse-sorted insertions;
- negative and large keys.

## 31. Backend Applications

BST concepts appear in:

- ordered in-memory indexes;
- range filtering;
- scheduling structures;
- ordered caches;
- ranking and ordered metadata;
- query planning concepts.

Production databases generally use specialized balanced/index structures rather than naive application-level BSTs for large persistent datasets.

## 32. AI Applications

BST-style ordered structures can support:

- ordered candidate stores;
- threshold/range filtering;
- ranking metadata;
- exact search over structured feature values;
- components of search and planning systems.

## 33. Testing Strategy

Use:

- reference sorted-array comparisons;
- insert/delete differential tests;
- invariant validation after every mutation;
- randomized operation sequences;
- duplicate-policy tests;
- skewed-tree stress tests;
- range-query output comparisons.

## 34. Interview Framework

When a BST problem appears:

```text
1. What is the exact ordering invariant?
2. What is the duplicate policy?
3. What is the tree height?
4. Can one subtree be eliminated per comparison?
5. Does the operation mutate structure?
6. What invariant must deletion preserve?
7. Is ordering or hashing more important?
8. Do I need rank/range operations?
9. Could the tree become skewed?
10. Is balancing required?
```

## 35. Revision Checklist

- [ ] I can state the BST invariant precisely.
- [ ] I can search iteratively and recursively.
- [ ] I can insert while preserving ordering.
- [ ] I understand all three deletion cases.
- [ ] I can find min/max/predecessor/successor.
- [ ] I can validate a BST using bounds.
- [ ] I can perform range searches.
- [ ] I understand why skewing causes `O(N)` behavior.
- [ ] I understand the motivation for balanced BSTs.
- [ ] I can compare BSTs with arrays and hash tables.

## 36. Key Takeaways

1. **A BST is defined by an ordering invariant, not by being balanced.**
2. **Search, insertion, and deletion are `O(H)`, where `H` is tree height.**
3. **A naive BST can degrade to linear height.**
4. **Deletion with two children is fundamentally a subtree-replacement problem that must preserve ordering.**
5. **BSTs are valuable when ordered traversal, predecessor/successor, and range operations matter—not merely exact key lookup.**
