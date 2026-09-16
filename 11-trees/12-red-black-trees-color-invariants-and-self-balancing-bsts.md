# 11.12 — Red-Black Trees, Color Invariants & Self-Balancing BSTs

## 1. Objective

Red-Black Trees are self-balancing Binary Search Trees that maintain logarithmic height through a small set of color invariants and local structural repairs.

## 2. BST Foundation

A Red-Black Tree preserves the BST ordering invariant. The duplicate-key policy must be explicit and consistent.

## 3. Node Color

Each node is assigned one of two colors:

```text
RED
BLACK
```

Color is balancing metadata rather than a key-ordering property.

## 4. Core Invariants

A conventional Red-Black Tree satisfies:

1. every node is red or black;
2. the root is black;
3. null leaves/sentinels are black;
4. a red node cannot have a red child;
5. every path from a node to descendant null leaves contains the same number of black nodes.

Exact sentinel conventions should be stated for the implementation.

## 5. Why the Tree Stays Balanced

The no-red-red rule limits consecutive red nodes. Equal black-height across paths prevents one branch from becoming arbitrarily deeper than another.

Together these properties imply logarithmic height.

## 6. Black Height

The black height of a node is the number of black nodes on a path to a descendant sentinel under the chosen counting convention.

The convention must remain consistent throughout proofs and code.

## 7. Rotations

Left and right rotations preserve BST inorder ordering while changing local structure.

Red-Black repair uses the same structural rotation primitives as other balanced BSTs but combines them with recoloring.

## 8. Insertion Overview

Insertion first follows normal BST insertion and creates a new red node in the standard formulation.

A red insertion avoids immediately changing black heights, but it can create a red-red violation.

## 9. Insertion Cases

The repair depends on:

- parent color;
- uncle color;
- whether the node is an inner or outer child;
- orientation relative to the grandparent.

The cases reduce to recoloring and rotations.

## 10. Red Uncle Case

When parent and uncle are red, recolor the parent and uncle black and the grandparent red, then continue repairing upward.

The root is ultimately restored to black.

## 11. Black Uncle Cases

With a black uncle, structural rotation is generally required.

Inner-child configurations are first transformed into outer-child configurations, followed by the appropriate rotation and recoloring.

## 12. Deletion Overview

Deletion is more complicated because removing a black node can reduce the black height of a path.

The repair process reasons about an extra-black/double-black conceptual state depending on the implementation formulation.

## 13. Transplant and Successor

As in ordinary BST deletion, a two-child node can be replaced using its successor. The removed node's original color determines whether balancing repair is required.

## 14. Why Red-Black Deletion Is Harder

A deleted red node does not reduce black height. A deleted black node may violate black-height equality and requires additional cases involving the sibling, sibling children, and parent color.

## 15. Deletion Case Families

Conceptually inspect:

1. sibling color;
2. sibling's child colors;
3. parent color;
4. orientation.

Repairs use recoloring and rotations until all invariants are restored.

## 16. Sentinel NIL Nodes

Many implementations use one shared black sentinel rather than JavaScript `null` for leaves.

Sentinels simplify invariant reasoning and pointer operations but require careful handling in APIs and memory ownership.

## 17. Parent Pointers

Red-Black repair often benefits from parent pointers because cases inspect parents, grandparents, and uncles while walking upward.

Every rotation must update parent links correctly.

## 18. Root Handling

After insertion or deletion repair, ensure the root is connected correctly and is black.

Root replacement after rotation is a frequent source of implementation errors.

## 19. Height Bound

A Red-Black Tree with `N` internal nodes has height `O(log N)`. A standard argument shows the tree height is bounded by a constant multiple of its black height, while the black-height property implies exponential growth in the number of nodes as height increases.

## 20. Complexity

For `N` nodes:

| Operation | Worst-case |
|---|---:|
| Search | `O(log N)` |
| Insert | `O(log N)` |
| Delete | `O(log N)` |
| Min/Max | `O(log N)` |
| Rotation | `O(1)` |
| Traversal | `O(N)` |

## 21. AVL vs Red-Black

AVL trees enforce a stricter local height balance, while Red-Black Trees permit more shape variation under their color invariants.

Both provide logarithmic worst-case search/update bounds, but their rotation/recoloring behavior and workload characteristics differ.

## 22. Red-Black vs Heap

A Red-Black Tree provides ordered search, predecessor/successor, and range traversal. A heap primarily provides efficient access to an extreme-priority element.

The ordering guarantees are fundamentally different.

## 23. Augmented Red-Black Trees

Subtree metadata can support:

- rank;
- select/k-th element;
- interval queries;
- aggregate values.

Every rotation must update all affected metadata.

## 24. Order Statistics

With subtree sizes, rank and selection can remain `O(log N)`.

The key requirement is maintaining size metadata after insertion, deletion, and every rotation.

## 25. Interval Trees

An augmented Red-Black Tree can store the maximum endpoint of intervals in each subtree. This enables efficient overlap queries while retaining balanced height.

## 26. Correctness Invariants

A validator should check:

```text
BST ordering
root blackness
red-parent constraint
black-height equality
parent pointers
metadata consistency
```

Do not rely only on inorder output; a sorted inorder traversal does not prove balance correctness.

## 27. Rotation Correctness

Rotations preserve inorder ordering. Recoloring changes balancing metadata but not key ordering.

A repair is correct only if both structural and color invariants hold afterward.

## 28. Insertion Proof Strategy

Show that each insertion case either:

- resolves the red-red violation locally;
- moves the violation upward while preserving black height;
- or terminates with a valid black root.

## 29. Deletion Proof Strategy

Show that each deletion case either removes the extra-black condition, transfers it upward without violating the invariants, or performs a final rotation/recoloring that restores equal black height.

## 30. Common Mistakes

1. Forgetting that NIL leaves are black.
2. Allowing a red node to have a red child.
3. Failing to recolor the root black.
4. Losing the new subtree root after rotation.
5. Breaking parent pointers.
6. Implementing deletion cases without a precise invariant.
7. Forgetting metadata updates in augmented trees.
8. Confusing Red-Black Trees with heaps.

## 31. Edge Cases

Test:

- empty tree;
- single node;
- root insertion;
- repeated inserts;
- root deletion;
- deletion of red node;
- deletion of black node;
- all rotation orientations;
- duplicate keys;
- alternating insert/delete workloads.

## 32. Testing Strategy

Use:

- invariant validators after every operation;
- inorder comparison against a reference ordered set;
- randomized operation sequences;
- targeted insertion/deletion case generators;
- black-height verification;
- parent-pointer validation;
- augmented metadata verification.

## 33. Backend Applications

Red-Black Trees can support:

- ordered in-memory indexes;
- range-aware schedulers;
- interval tracking;
- ordered caches;
- embedded databases and runtime data structures.

## 34. AI Applications

They can support:

- ordered candidate stores;
- threshold/range retrieval;
- interval-based search state;
- deterministic ranked collections;
- dynamic ordered indexes in inference pipelines.

## 35. Interview Framework

When asked about Red-Black Trees:

```text
1. State the five core invariants.
2. Explain why the height is logarithmic.
3. Explain why insertion starts with a red node.
4. Classify insertion by uncle color and orientation.
5. Explain why deletion is harder.
6. Explain NIL/sentinel leaves.
7. Show how rotations preserve inorder order.
8. State worst-case operation costs.
9. Explain AVL vs Red-Black trade-offs.
10. Explain how you would validate every invariant.
```

## 36. Revision Checklist

- [ ] I can state the Red-Black invariants.
- [ ] I understand black height.
- [ ] I can perform left/right rotations.
- [ ] I understand insertion repair cases.
- [ ] I understand red-uncle recoloring.
- [ ] I understand black-uncle rotation cases.
- [ ] I understand the conceptual difficulty of deletion.
- [ ] I can validate black-height equality.
- [ ] I understand augmented Red-Black Trees.
- [ ] I can compare AVL and Red-Black balancing mechanisms.

## 37. Key Takeaways

1. **Red-Black Trees maintain logarithmic height through color and black-height invariants rather than strict per-node height balance.**
2. **Rotations preserve ordering; recoloring repairs balancing constraints.**
3. **Insertion repairs red-red violations, while deletion repairs possible black-height loss.**
4. **A production implementation should validate structural, color, parent-pointer, and metadata invariants independently.**
5. **Augmented Red-Black Trees extend balanced ordered search to ranks, intervals, and other dynamic ordered queries.**
