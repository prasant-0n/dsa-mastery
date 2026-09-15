# 05.01 — Linked List Fundamentals & Memory Model

## Purpose

A linked list stores elements as nodes connected through references rather than requiring elements to occupy one contiguous array-like region.

This chapter establishes the mental model required for every later linked-list operation: node structure, references, head/tail semantics, traversal, mutation, complexity, ownership, and failure modes.

> A linked list is fundamentally a problem of **nodes + references + invariants**.

---

# 1. What Is a Linked List?

A singly linked list can be represented as:

```text
head
 ↓
[10 | next] → [20 | next] → [30 | null]
```

Each node stores:

```text
value
reference to next node
```

The list is reached by following references from `head`.

---

# 2. Node Model in JavaScript

A simple node can be represented as:

```js
class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}
```

The list itself can maintain:

```text
head
optional tail
optional size
```

These fields form part of the data-structure invariant.

---

# 3. Array vs Linked List

Arrays provide efficient indexed access because an index can directly locate an element conceptually.

Linked lists require traversal from a known node.

| Operation | Array | Singly Linked List |
|---|---:|---:|
| Access by index | O(1) | O(N) |
| Search | O(N) | O(N) |
| Insert at front | O(N) | O(1) |
| Delete at front | O(N) | O(1) |
| Insert after known node | O(N) shifting worst case | O(1) |
| Delete after known predecessor | O(N) shifting worst case | O(1) |
| Extra pointer memory | Low | Higher |

These are structural trade-offs, not universal performance guarantees.

---

# 4. The Head Pointer

`head` identifies the first node.

For an empty list:

```text
head = null
```

For a non-empty list:

```text
head → first node
```

Losing the head reference can make the remaining list unreachable from the list object.

---

# 5. The Tail Pointer

A list may also maintain `tail`.

Invariant:

```text
tail === last reachable node from head
```

and usually:

```text
tail.next === null
```

A tail pointer can make append operations O(1), provided the invariant is maintained.

---

# 6. Size Metadata

A list may maintain `size`.

Then:

```text
size = number of reachable nodes from head
```

This changes the cost of obtaining length from O(N) to O(1), but every insertion/deletion must update the counter correctly.

---

# 7. Empty, Singleton, and General States

Always distinguish:

### Empty
```text
head = null
```

### Singleton
```text
head === tail
head.next === null
```

### Multiple nodes
```text
head !== tail
```

Many linked-list bugs occur when code handles the general case but breaks one of these boundaries.

---

# 8. Traversal

Basic traversal follows references:

```js
let current = head;

while (current !== null) {
    // process current.value
    current = current.next;
}
```

The key invariant is:

> `current` references the next node whose value has not yet been processed.

---

# 9. Why Indexing Is Not Native

A linked list does not inherently provide:

```js
list[5]
```

with O(1) access.

To reach position 5, the algorithm must follow approximately five links from the head.

Therefore indexed access is O(N) in the worst case.

---

# 10. Searching

Linear search checks each reachable node until:

```text
value found
or
current === null
```

Worst-case time:

```text
O(N)
```

Auxiliary traversal space for an iterative implementation:

```text
O(1)
```

---

# 11. Insertion at the Head

Given:

```text
head → A → B
```

insert `X`:

```text
X → A → B
↑
head
```

Operations:

```js
node.next = head;
head = node;
```

Time:

```text
O(1)
```

If the list was empty, update `tail` too when a tail pointer exists.

---

# 12. Append at the Tail

Without a tail pointer, reaching the final node requires traversal:

```text
O(N)
```

With a valid tail pointer:

```text
O(1)
```

The optimization is only correct if `tail` remains synchronized with the actual list.

---

# 13. Insertion After a Known Node

Given:

```text
A → B
```

insert `X` after `A`:

```text
A → X → B
```

Correct pointer order:

```js
node.next = current.next;
current.next = node;
```

Changing `current.next` first without saving the successor can disconnect part of the list.

---

# 14. Deletion at the Head

Given:

```text
head → A → B
```

remove `A`:

```js
head = head.next;
```

If `A` was the only node, the list must transition to:

```text
head = null
tail = null
```

when tail metadata is maintained.

---

# 15. Deleting a Node in a Singly Linked List

A singly linked list generally needs the predecessor to reconnect the chain:

```text
A → B → C
```

remove `B`:

```text
A → C
```

Conceptually:

```js
previous.next = current.next;
```

This is why knowing a node and knowing its predecessor are different algorithmic states.

---

# 16. Reference Rewiring

Linked-list algorithms are often about changing edges rather than moving values.

Think in terms of:

```text
old edge
→ remove edge
→ create new edge
→ preserve reachability
```

This mental model becomes essential for reversal, merging, partitioning, and cycle operations.

---

# 17. Reachability Invariant

A fundamental invariant is:

> Every node that belongs to the list must remain reachable from `head` unless intentionally removed.

A pointer update that violates this can silently lose an entire suffix.

---

# 18. Mutation Safety

Before rewiring a pointer, identify which references are still needed.

For example:

```js
const next = current.next;
current.next = previous;
current = next;
```

The saved `next` preserves access to the unprocessed suffix.

---

# 19. Singly vs Doubly Linked Lists

A doubly linked node contains:

```text
prev
value
next
```

Conceptually:

```text
null ← A ⇄ B ⇄ C → null
```

This allows backward traversal and can simplify deletion when the target node is already known, at the cost of another reference and more invariants.

---

# 20. Circular Linked Lists

In a circular list, the last node points back to a node rather than `null`.

Example:

```text
A → B → C
↑       ↓
└───────┘
```

Traversal can no longer use `current === null` as its stopping condition.

A termination condition must be defined explicitly.

---

# 21. Linked Lists and Recursion

Linked lists are naturally recursive structures:

```text
node → next node → next node → ... → null
```

A recursive function can treat:

```text
node.next
```

as the smaller subproblem.

The base case is usually:

```text
node === null
```

Phase 04 established the recursion model; this phase applies it to pointer-based structures.

---

# 22. Complexity Model

For a singly linked list with N nodes:

```text
Traversal: O(N)
Search: O(N)
Indexed access: O(N)
Head insertion: O(1)
Head deletion: O(1)
Append with tail: O(1)
Append without tail: O(N)
```

Always state the assumptions behind these bounds.

---

# 23. Memory Model

Linked-list nodes require references in addition to stored values.

Therefore a linked list often has higher per-element memory overhead than a packed array.

The trade-off is flexible structural modification without shifting a contiguous sequence.

---

# 24. Cache Locality

Array elements are typically stored in a layout that is friendly to sequential memory access.

Linked-list nodes may be scattered in memory.

Consequently, O(N) linked-list traversal can be slower in practice than O(N) array traversal despite identical asymptotic complexity.

Big-O does not describe every hardware-level performance effect.

---

# 25. Garbage Collection and Reachability

In JavaScript, objects become collectible when no reachable references keep them alive.

Removing a node from a list means removing the list's references to it.

However, external references may still keep that node and its reachable successors alive.

Understand reachability before assuming a mutation immediately frees memory.

---

# 26. Backend Applications

Linked lists appear conceptually in:

- LRU cache implementations;
- ordered eviction structures;
- task chains;
- stream/chunk processing;
- intrusive queues;
- custom schedulers.

In production JavaScript, built-in arrays, maps, and specialized data structures may outperform handwritten linked lists for many workloads.

Use linked lists when their structural properties actually solve the problem.

---

# 27. AI Applications

Linked-list concepts can appear in:

- token/sequence structures;
- mutable search paths;
- custom queues/stacks;
- beam/search candidate chains;
- memory or event structures.

More commonly, AI systems use arrays, heaps, hash maps, trees, and graphs because those representations better match their access patterns.

---

# 28. Common Mistakes

1. Losing `head`.
2. Overwriting `next` before saving the successor.
3. Forgetting to update `tail`.
4. Forgetting to update `size`.
5. Mishandling empty lists.
6. Mishandling singleton lists.
7. Creating accidental cycles.
8. Traversing circular lists with a null-only condition.
9. Assuming linked-list indexing is O(1).
10. Confusing a node reference with a list reference.
11. Losing the remaining suffix during pointer rewiring.
12. Ignoring external references during mutation.

---

# 29. Edge Cases

Always test:

```text
empty list
one node
two nodes
head operation
tail operation
middle operation
remove missing value
duplicate values
already sorted values
cycle present
large list
```

---

# 30. Design Procedure

When solving a linked-list problem:

```text
1. Draw the nodes.
2. Mark head and tail.
3. Identify the node references you currently have.
4. Identify the predecessor/successor you need.
5. Save references before rewiring.
6. Perform the minimum pointer changes.
7. Restore/update metadata.
8. Check reachability.
9. Check cycles.
10. Analyze time and auxiliary space.
11. Test empty/singleton/boundary cases.
```

---

# 31. Interview Explanation Template

> “A linked list is a chain of nodes connected by references. Its key trade-off is O(N) traversal/index access in exchange for O(1) structural insertion or deletion when the relevant node/predecessor is already known. When mutating links, I first preserve any successor references I still need, then rewire edges and update head, tail, and size invariants. I also explicitly handle empty, singleton, and cycle cases.”

---

# 32. Revision Checklist

- [ ] Can I define a singly linked list from first principles?
- [ ] Can I explain head/tail/size invariants?
- [ ] Can I traverse a list safely?
- [ ] Can I explain why indexing is O(N)?
- [ ] Can I insert at the head in O(1)?
- [ ] Can I append with and without a tail pointer?
- [ ] Can I insert after a known node?
- [ ] Can I delete safely without losing the suffix?
- [ ] Can I explain singly vs doubly linked lists?
- [ ] Can I reason about circular lists?
- [ ] Can I connect linked lists to recursion?
- [ ] Can I analyze memory and cache-locality trade-offs?
- [ ] Can I identify pointer-rewiring bugs?
- [ ] Can I defend when a linked list is actually appropriate?

# Key Takeaways

1. A linked list is primarily a structure of nodes and references.
2. `head`, `tail`, and `size` are metadata governed by invariants.
3. Pointer rewiring must preserve reachability of every intended node.
4. Save references before overwriting links.
5. O(1) insertion/deletion requires the appropriate node or predecessor to already be known.
6. Linked lists provide poor indexed access compared with arrays.
7. Asymptotic complexity does not eliminate cache-locality and allocation costs.
8. Empty, singleton, duplicate, and circular cases require explicit handling.
9. Recursive reasoning maps naturally onto the `node → next` structure.
10. Use linked lists because their structural properties are useful—not because they are a classic interview topic.
