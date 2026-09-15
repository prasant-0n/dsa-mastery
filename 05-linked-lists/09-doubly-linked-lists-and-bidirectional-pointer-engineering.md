# 05.09 — Doubly Linked Lists & Bidirectional Pointer Engineering

## Purpose

A doubly linked list adds a `prev` pointer to every node:

```text
null ← A ⇄ B ⇄ C → null
```

This changes the engineering problem from managing one direction to maintaining a **bidirectional structural invariant**.

The central rule is:

> Whenever a link changes, reason about both directions before declaring the operation correct.

---

# 1. Doubly Linked List Node

A typical node contains:

```js
class DoublyNode {
    constructor(value) {
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}
```

Compared with a singly linked node, the additional pointer enables backward traversal and easier local deletion.

---

# 2. Core Invariant

For every internal node:

```text
node.next.prev === node
node.prev.next === node
```

Boundary conditions are:

```text
head.prev === null
tail.next === null
```

These are structural invariants, not optional implementation details.

---

# 3. Traversal in Both Directions

Forward:

```text
head → next → next → ... → tail
```

Backward:

```text
tail → prev → prev → ... → head
```

Backward traversal is O(N), but it can begin from the nearer boundary when an index is known.

---

# 4. Bidirectional Index Access

With both head and tail references:

```text
index near 0      → start from head
index near N - 1  → start from tail
```

For an index `i` in a list of length `N`, choose the shorter route:

```text
if i < N / 2:
    traverse from head
else:
    traverse from tail
```

This remains O(N) worst-case, but reduces traversal distance in practice and changes the average path length.

---

# 5. Insertion at Head

To insert X before A:

```text
X ⇄ A ⇄ B
```

update both directions:

```text
X.next = A
A.prev = X
head = X
```

Also ensure:

```text
X.prev = null
```

---

# 6. Insertion at Tail

Given:

```text
A ⇄ B
```

append C:

```text
A ⇄ B ⇄ C
```

with:

```js
C.prev = tail;
tail.next = C;
tail = C;
```

When the tail is known, append is O(1).

---

# 7. Inserting Between Two Nodes

Suppose:

```text
A ⇄ B
```

Insert X:

```text
A ⇄ X ⇄ B
```

The four relationships must be repaired:

```text
A.next = X
X.prev = A
X.next = B
B.prev = X
```

This is the fundamental doubly-linked insertion pattern.

---

# 8. Deleting a Known Node

For:

```text
A ⇄ X ⇄ B
```

remove X:

```text
A ⇄ B
```

by connecting:

```text
A.next = B
B.prev = A
```

This is O(1) if X is already known and the list owns the node.

That is a major advantage over singly linked lists, where the predecessor is normally required.

---

# 9. Head and Tail Deletion

Deleting head requires:

```text
head = head.next
head.prev = null
```

when a new head exists.

Deleting tail requires:

```text
tail = tail.prev
tail.next = null
```

when a new tail exists.

Singleton lists require separate boundary handling or a sentinel-based design.

---

# 10. Dummy / Sentinel Nodes

A doubly linked list can use permanent sentinels:

```text
HEAD ⇄ A ⇄ B ⇄ TAIL
```

Then an internal insertion always has two neighbors.

For insertion of X between A and B:

```text
A.next = X
X.prev = A
X.next = B
B.prev = X
```

This greatly reduces head/tail special cases.

---

# 11. Sentinel-Based Empty List

An empty sentinel list can be represented as:

```text
HEAD ⇄ TAIL
```

with:

```text
HEAD.next === TAIL
TAIL.prev === HEAD
```

This gives uniform boundary semantics.

---

# 12. Detaching a Node

A reusable operation is:

```text
A ⇄ X ⇄ B
```

becoming:

```text
A ⇄ B

X
```

The detached node should normally become:

```text
X.prev = null
X.next = null
```

unless the API intentionally preserves its links for another operation.

Explicit detachment prevents accidental stale ownership.

---

# 13. Moving a Node

A common operation is:

```text
remove X
insert X elsewhere
```

For example:

```text
A ⇄ X ⇄ B

C ⇄ D
```

move X before D:

```text
A ⇄ B

C ⇄ X ⇄ D
```

This pattern is the foundation of LRU caches.

---

# 14. Move-to-Front

For an LRU-style structure:

```text
most recent ⇄ ... ⇄ least recent
```

accessing a known node can:

1. detach it;
2. insert it after the head sentinel.

If the node is already known through a map:

```text
hash map lookup → O(1) expected
list move       → O(1)
```

This combination gives the classic O(1) expected LRU operations.

---

# 15. Reverse a Doubly Linked List

For each node, swap:

```text
prev ↔ next
```

Then swap:

```text
head ↔ tail
```

Example:

```text
A ⇄ B ⇄ C
```

becomes:

```text
C ⇄ B ⇄ A
```

The operation is O(N) time and O(1) auxiliary space.

---

# 16. Reversing Requires Care

Before swapping pointers, retain whichever reference is needed to continue traversal.

A safe conceptual pattern is:

```text
nextOriginal = node.next
swap(node.prev, node.next)
node = nextOriginal
```

Otherwise, the traversal direction may be changed before the next node is saved.

---

# 17. Delete by Reference vs Delete by Value

### Known node reference

```text
O(1)
```

provided ownership and validity are guaranteed.

### Search by value

```text
O(N)
```

because the node must first be located.

This distinction appears repeatedly in real systems.

---

# 18. Ownership Validation

A dangerous API accepts an arbitrary node reference and assumes it belongs to the list.

Consider:

```text
List A: A ⇄ B ⇄ C
List B: X ⇄ Y ⇄ Z
```

Passing Y to List A's delete operation can corrupt both structures if ownership is not checked.

Production APIs should define ownership expectations clearly.

---

# 19. Membership Checking

A simple membership check traverses the list:

```text
is node reachable from head?
```

This costs O(N).

An alternative is to maintain an ownership registry, but that introduces memory and lifecycle complexity.

Use such tracking only when the API genuinely requires it.

---

# 20. Structural Validation

A useful validator checks:

```text
head.prev === null
 tail.next === null
next.prev === current
prev.next === current
```

It should also verify:

- forward and backward traversal agree;
- counted nodes match metadata;
- no unexpected cycle exists;
- head and tail are reachable from each other.

---

# 21. Cycles in Doubly Linked Lists

Doubly linked lists naturally contain two directional paths, but accidental cycles can still occur.

A malformed structure may contain:

```text
A ⇄ B ⇄ C
↑       ↓
└───────┘
```

Validation must therefore consider both forward and backward traversal.

---

# 22. Splitting a Doubly Linked List

To split:

```text
A ⇄ B ⇄ C ⇄ D
```

after B:

```text
A ⇄ B

C ⇄ D
```

repair both boundaries:

```text
B.next = null
C.prev = null
```

The singly-linked split only required one pointer repair; the doubly-linked split requires both sides of the boundary to be consistent.

---

# 23. Concatenating Doubly Linked Lists

Given:

```text
A ⇄ B

C ⇄ D
```

connect:

```text
B.next = C
C.prev = B
```

Then update the resulting tail.

If both lists are valid and disjoint, this is O(1) with known tails and heads.

---

# 24. Splicing a Segment

A segment:

```text
A ⇄ B ⇄ C
```

can be removed from one location and inserted elsewhere.

This is called splicing.

Splicing is a fundamental operation in:

- editors;
- linked deques;
- LRU caches;
- intrusive data structures;
- scheduling structures.

---

# 25. Doubly Linked List as a Deque

A doubly linked list with head and tail can implement:

```text
pushFront   O(1)
pushBack    O(1)
popFront    O(1)
popBack     O(1)
```

This is one reason deques are closely associated with doubly linked structures.

---

# 26. Doubly Linked List vs Array

| Operation | Doubly Linked List | Array |
|---|---:|---:|
| Random access | O(N) | O(1) |
| Insert at known node | O(1) | O(N) shifting |
| Delete known node | O(1) | O(N) shifting |
| Push front | O(1) | O(N) |
| Push back with tail | O(1) | amortized O(1) |
| Backward traversal | O(N) | O(N) |

These are asymptotic properties; actual performance also depends heavily on memory locality and allocation overhead.

---

# 27. Cache Locality Trade-Off

Linked nodes may be scattered in memory.

Arrays generally provide better spatial locality:

```text
cache-friendly sequential memory
```

while linked structures involve pointer chasing:

```text
node → arbitrary memory → arbitrary memory
```

Therefore O(1) pointer operations do not automatically mean better real-world performance.

---

# 28. Backend Applications

Doubly linked lists are especially useful for:

- LRU caches;
- MRU caches;
- ordered eviction lists;
- deques;
- task scheduling queues;
- intrusive resource lists;
- connection/session tracking.

The classic LRU design combines:

```text
Map<key, node>
+
Doubly linked list
```

for expected O(1) lookup and movement.

---

# 29. AI Applications

Potential uses include:

- maintaining mutable ranked candidate windows;
- recency-based candidate caches;
- beam/frontier structures with frequent local movement;
- eviction lists for model-serving caches;
- mutable inference work queues.

Again, specialized heaps, arrays, and indexed structures may be preferable at scale.

---

# 30. Common Pointer Bugs

1. Updating `next` but forgetting `prev`.
2. Updating `prev` but forgetting `next`.
3. Forgetting head/tail boundary conditions.
4. Losing the traversal successor during reversal.
5. Deleting a node from the wrong list.
6. Leaving stale links on detached nodes.
7. Creating a cycle during insertion.
8. Incorrect sentinel handling.
9. Corrupting metadata after mutation.
10. Assuming O(1) pointer mutation means O(1) search.

---

# 31. Pointer-Rewiring Checklist

For insertion between A and B:

```text
A.next = X
X.prev = A
X.next = B
B.prev = X
```

For deletion of X between A and B:

```text
A.next = B
B.prev = A
X.prev = null
X.next = null
```

For concatenation:

```text
A.tail.next = B.head
B.head.prev = A.tail
```

The exact sequence can vary, but the final invariant must always hold.

---

# 32. Complexity Summary

| Operation | Time | Extra Space |
|---|---:|---:|
| Forward traversal | O(N) | O(1) |
| Backward traversal | O(N) | O(1) |
| Access by index | O(N) worst | O(1) |
| Insert at head/tail | O(1) | O(1) |
| Insert after known node | O(1) | O(1) |
| Delete known node | O(1) | O(1) |
| Search by value | O(N) | O(1) |
| Reverse | O(N) | O(1) |
| Concatenate with boundaries | O(1) | O(1) |
| Split at known boundary | O(1) | O(1) |

---

# 33. Design Procedure

```text
1. Define ownership.
2. Define head/tail/sentinel model.
3. Identify all neighboring nodes.
4. Save traversal references before rewiring.
5. Update both directions.
6. Repair boundaries.
7. Clear detached-node links.
8. Update metadata.
9. Validate forward/backward invariants.
10. Check cycles and aliases.
11. Derive complexity from search + mutation separately.
```

---

# 34. Interview Explanation Template

> “A doubly linked list adds backward links, so every mutation must preserve two-way consistency. If I already have a valid node reference, insertion or deletion can be O(1) because the node has access to both neighbors. I use sentinels to eliminate head/tail special cases when appropriate. For an LRU cache, a hash map provides expected O(1) lookup while the doubly linked list provides O(1) detach and move-to-front operations.”

---

# 35. Revision Checklist

- [ ] Can I define the bidirectional invariant?
- [ ] Can I traverse forward and backward?
- [ ] Can I insert between two nodes safely?
- [ ] Can I delete a known node in O(1)?
- [ ] Can I use head/tail sentinels?
- [ ] Can I detach and move a node safely?
- [ ] Can I reverse a doubly linked list?
- [ ] Can I split and concatenate doubly linked lists?
- [ ] Can I validate both pointer directions?
- [ ] Can I reason about node ownership?
- [ ] Can I explain the map + doubly-linked-list LRU design?
- [ ] Can I compare pointer complexity with actual cache locality?

# Key Takeaways

1. Doubly linked lists trade extra memory for backward navigation and easier local mutation.
2. Every internal edge has a forward and backward invariant.
3. A known node can be deleted in O(1) without searching for its predecessor.
4. Sentinels simplify boundary handling.
5. Detaching nodes should clear stale links when ownership is transferred.
6. LRU caches are a canonical map + doubly-linked-list application.
7. O(1) pointer mutation does not imply O(1) lookup.
8. Memory locality can make arrays faster despite weaker asymptotic insertion/deletion behavior.
9. Ownership and aliasing must be part of the API contract.
10. Structural validation should check both directions, boundaries, reachability, and cycles.
