# 05.10 — Circular Linked Lists & Ring-Structure Engineering

## Purpose

A circular linked list removes the `null` terminator from the traversal path and connects the final node back to the first:

```text
      ┌──────────────┐
      ↓              │
A → B → C → D ───────┘
```

The structure is powerful for cyclic scheduling and rotation, but ordinary traversal assumptions no longer apply.

> **In a circular structure, termination is a logical condition, not a `null` condition.**

---

# 1. Circular List Model

In a singly circular list:

```text
A.next = B
B.next = C
C.next = A
```

There is no `null` after C.

A valid non-empty circular list therefore has:

```text
last.next === head
```

---

# 2. Head and Tail Representation

A circular list can be represented with:

```text
head
 tail
```

where:

```text
tail.next === head
```

An alternative is to store only `tail`.

Then:

```text
head === tail.next
```

This representation can make insertion at both ends efficient.

---

# 3. Why a Tail-Only Representation Is Useful

With a tail pointer:

```text
tail → last node
head = tail.next
```

Appending X:

```text
tail.next = X
X.next = head
tail = X
```

Prepending X:

```text
X.next = head
tail.next = X
```

Both can be O(1) when the list is non-empty.

---

# 4. Empty Circular List

A common empty representation is:

```text
head = null
tail = null
```

The first insertion creates:

```text
X.next = X
head = X
tail = X
```

A singleton circular list points back to itself.

---

# 5. Singleton Invariant

For one node:

```text
X.next === X
```

This is easy to accidentally break when writing generic insertion/deletion logic.

Always test singleton behavior explicitly.

---

# 6. Traversal Must Be Boundary-Aware

A normal linked-list loop:

```js
while (current !== null)
```

does not terminate.

Instead, stop when you return to the starting node:

```text
start = head
current = head

process current
move current
stop when current === start
```

The starting reference becomes the logical boundary.

---

# 7. Do Not Use Value Equality for Termination

Suppose:

```text
A(5) → B(7) → C(5) → A
```

Stopping when a value equals the first value is incorrect.

Termination should use **node identity**:

```text
current === start
```

not:

```text
current.value === start.value
```

---

# 8. Counting Nodes Safely

To count nodes:

```text
if head is null → 0
otherwise traverse until current === head again
```

A malformed structure that does not return to the starting node may require cycle validation before normal operations.

---

# 9. Insertion at Head

For:

```text
A → B → C → A
```

insert X at head:

```text
X → A → B → C → X
```

With tail stored:

```text
X.next = head
tail.next = X
head = X
```

The tail remains unchanged.

---

# 10. Append at Tail

Given:

```text
A → B → C → A
```

append X:

```text
A → B → C → X → A
```

The key rewiring is:

```text
X.next = head
tail.next = X
tail = X
```

This is O(1) with a tail pointer.

---

# 11. Insertion After a Known Node

Given:

```text
A → B → C → A
```

insert X after B:

```text
A → B → X → C → A
```

Only the local successor edge must be rewired.

This remains O(1) when B is already known.

---

# 12. Deleting the Head

Given:

```text
A → B → C → A
```

remove A:

```text
B → C → B
```

If the list becomes empty, both head and tail become null.

If a singleton is deleted:

```text
X → X
```

becomes an empty list.

---

# 13. Deleting the Tail

Given:

```text
A → B → C → A
```

remove C:

```text
A → B → A
```

For a singly circular list, the predecessor of the tail is needed, so finding it costs O(N) unless additional metadata or a different structure is used.

---

# 14. Josephus Problem

Circular lists are a natural model for repeated elimination.

Example:

```text
1 → 2 → 3 → 4 → 5 → 1
```

Repeatedly count and remove a node until one remains.

The problem demonstrates:

- circular traversal;
- modular position reasoning;
- repeated deletion;
- the relationship between simulation and mathematical recurrence.

---

# 15. Round-Robin Scheduling

A circular list naturally represents:

```text
Job A → Job B → Job C → Job A
```

A scheduler can advance a cursor after each time slice.

There is no need to move the entire structure; only the current position changes.

---

# 16. Cursor / Current Node

Many circular APIs benefit from storing:

```text
current
```

instead of always treating one node as permanently special.

For a round-robin structure:

```text
current = current.next
```

advances to the next participant in O(1).

---

# 17. Rotation

A circular list can rotate by changing the logical head.

Given:

```text
A → B → C → D → A
```

move head forward:

```text
head = head.next
```

No node pointers need to change.

This is a powerful distinction between **physical structure** and **logical starting position**.

---

# 18. Splitting a Circular List

A circular list can be divided into two circular lists.

Given:

```text
A → B → C → D → A
```

split after B:

```text
A → B → A
C → D → C
```

Both new tails must point to their respective heads.

---

# 19. Fast/Slow Circular Splitting

The slow/fast pointer technique can locate a midpoint while respecting circular traversal.

The implementation must avoid assuming that `fast === null` will occur.

Instead, termination is based on reaching the start or crossing the circular boundary according to the chosen midpoint convention.

---

# 20. Merging Circular Lists

Two circular lists can be concatenated by exchanging their boundary edges.

Suppose:

```text
A → B → A
X → Y → X
```

connect them as:

```text
A → B → X → Y → A
```

The operation can be O(1) if both tails are known.

---

# 21. Circular Doubly Linked Lists

A circular doubly linked list has:

```text
head.prev === tail
tail.next === head
```

and for every node:

```text
node.next.prev === node
node.prev.next === node
```

Conceptually:

```text
      ┌───────────────┐
      ↓               │
A ⇄ B ⇄ C ⇄ D ────────┘
```

---

# 22. Sentinel Circular List

A sentinel can eliminate null boundaries entirely.

For example:

```text
S ⇄ A ⇄ B ⇄ C ⇄ S
```

An empty list is simply:

```text
S ⇄ S
```

This makes insertion and deletion highly uniform.

---

# 23. Sentinel Insertion

To insert X between A and B:

```text
A.next = X
X.prev = A
X.next = B
B.prev = X
```

No head/tail special case is required because the sentinel always supplies a neighbor.

---

# 24. Sentinel Deletion

To delete X:

```text
X.prev.next = X.next
X.next.prev = X.prev
```

Then optionally detach:

```text
X.prev = null
X.next = null
```

This is the core pattern behind many intrusive and cache-oriented structures.

---

# 25. Circular Deque

A circular doubly linked list with a sentinel can implement a deque with O(1) operations at both ends.

Typical operations:

```text
pushFront
pushBack
popFront
popBack
```

All are local pointer operations.

---

# 26. Circular List vs Linear List

| Property | Linear | Circular |
|---|---|---|
| Natural terminator | null | start identity / sentinel |
| Rotation | often O(N) if physically moved | O(1) logical head change |
| Round-robin traversal | extra reset logic | natural |
| Tail-to-head transition | special case | direct |
| Accidental infinite loop risk | lower | higher |

Circular structures trade simpler repeated cycling for more demanding termination reasoning.

---

# 27. Circular List vs Array Ring Buffer

A circular linked list and a ring buffer are not the same.

A ring buffer uses contiguous array storage and typically maintains indices such as:

```text
headIndex
tailIndex
```

It often provides much better cache locality.

A circular linked list provides node-level insertion/deletion flexibility but pays pointer and allocation overhead.

For high-throughput queues, a ring buffer may therefore be preferable.

---

# 28. Backend Applications

Circular structures are useful for:

- round-robin schedulers;
- cyclic retry rotation;
- connection rotation;
- worker assignment;
- reusable buffer concepts;
- event-loop-like cursor structures;
- recurring task schedules.

Production implementations should choose a ring buffer when fixed-capacity contiguous storage is more appropriate.

---

# 29. AI Applications

Possible applications include:

- cyclic candidate rotation;
- repeated worker/model selection;
- round-robin inference workers;
- bounded candidate queues;
- rotating retrieval sources.

For large-scale systems, arrays and indexed queues frequently outperform pointer-heavy circular structures because of memory locality.

---

# 30. Common Mistakes

1. Using `current !== null` as the traversal condition.
2. Using value equality instead of node identity.
3. Forgetting the singleton self-loop.
4. Breaking `tail.next === head`.
5. Forgetting to update the logical head after rotation.
6. Incorrectly splitting one ring into two.
7. Accidentally creating multiple disconnected cycles.
8. Failing to update both directions in a circular doubly list.
9. Infinite loops during malformed-input traversal.
10. Choosing a linked ring where an array ring buffer is more efficient.

---

# 31. Validation Invariants

For a non-empty singly circular list:

```text
head !== null
tail !== null
tail.next === head
```

For a circular doubly linked list:

```text
head.prev === tail
tail.next === head
node.next.prev === node
node.prev.next === node
```

A validator should also verify that traversal from the head returns to the head after exactly N unique nodes when size metadata exists.

---

# 32. Complexity Summary

| Operation | Time | Extra Space |
|---|---:|---:|
| Traverse ring | O(N) | O(1) |
| Count nodes | O(N) | O(1) |
| Insert after known node | O(1) | O(1) |
| Push front with tail | O(1) | O(1) |
| Push back with tail | O(1) | O(1) |
| Delete known node in circular doubly list | O(1) | O(1) |
| Delete tail in singly circular list | O(N) | O(1) |
| Rotate logical head | O(1) | O(1) |
| Concatenate rings with tails | O(1) | O(1) |
| Split ring at known boundary | O(1) | O(1) |

---

# 33. Design Procedure

```text
1. Define whether the structure is singly or doubly circular.
2. Define head/tail/current representation.
3. Define the logical termination rule.
4. Define singleton behavior.
5. Preserve ring closure after every mutation.
6. Save successors before rewiring.
7. Update both directions for doubly circular lists.
8. Update metadata.
9. Validate exactly-one-cycle reachability.
10. Consider malformed input and aliases.
11. Compare against a ring buffer for production workloads.
```

---

# 34. Interview Explanation Template

> “A circular linked list replaces the null terminator with a structural cycle, so traversal must terminate by returning to a known node or sentinel. With a tail pointer, `tail.next` gives the head, allowing O(1) push-front, push-back, and logical rotation. Circular doubly linked lists additionally maintain bidirectional invariants and are especially useful for deques and LRU-style structures. For high-throughput fixed-capacity workloads, I would also compare the design with an array-based ring buffer because of cache locality.”

---

# 35. Revision Checklist

- [ ] Can I define a circular linked-list invariant?
- [ ] Can I traverse a ring without an infinite loop?
- [ ] Can I distinguish node identity from value equality?
- [ ] Can I represent a ring using only a tail pointer?
- [ ] Can I insert at both ends in O(1)?
- [ ] Can I delete head and tail safely?
- [ ] Can I rotate a ring in O(1)?
- [ ] Can I split one ring into two rings?
- [ ] Can I concatenate two rings in O(1) with boundary metadata?
- [ ] Can I maintain a circular doubly-linked invariant?
- [ ] Can I use a sentinel circular list?
- [ ] Can I explain the Josephus and round-robin applications?
- [ ] Can I compare a circular linked list with an array ring buffer?

# Key Takeaways

1. Circular lists terminate by identity or sentinel, not by null.
2. `tail.next === head` is the core singly-circular invariant.
3. A tail-only representation can provide O(1) operations at both logical ends.
4. Logical rotation can be O(1) without moving nodes.
5. Circular doubly lists combine ring closure with bidirectional invariants.
6. Sentinels remove many boundary special cases.
7. Circular structures are natural for round-robin and repeated-cycle workloads.
8. Ring buffers often provide better locality for fixed-capacity high-throughput systems.
9. Malformed circular structures can cause non-termination, so validation matters.
10. Every mutation must preserve exactly the intended cycle structure.
