# 05.03 — Linked List Insertion, Deletion & Mutation

## Purpose

This chapter focuses on modifying linked lists safely. The central skill is not memorizing pointer assignments; it is deriving the exact edge changes required while preserving list invariants.

> Mutation is correct only when the intended nodes remain reachable and every structural invariant is restored.

---

# 1. Mutation as Edge Rewriting

A linked list is a directed chain:

```text
A → B → C → null
```

Insertion and deletion change edges.

Insertion:

```text
A → X → B
```

Deletion:

```text
A → C
```

Think in terms of graph edges rather than moving values.

---

# 2. Insertion at the Head

To insert `X` before the current head:

```text
X → oldHead → ...
```

The essential sequence is:

```js
node.next = head;
head = node;
```

Time: **O(1)**.

If the list was empty, `tail` must also become `node`.

---

# 3. Append at the Tail

Without a tail pointer, traverse to the final node.

Time:

```text
O(N)
```

With a valid tail pointer:

```js
tail.next = node;
tail = node;
```

Time: **O(1)**.

---

# 4. Insert After a Known Node

Given:

```text
A → B
```

Insert `X` after `A`:

```js
node.next = current.next;
current.next = node;
```

Result:

```text
A → X → B
```

The successor must be saved before the predecessor's edge is replaced.

---

# 5. Insert Before a Known Node

In a singly linked list, knowing only the target node is generally insufficient to insert before it.

You need its predecessor:

```text
previous → target
```

Then:

```js
node.next = target;
previous.next = node;
```

This is a structural consequence of one-way links.

---

# 6. Dummy Node Technique

A dummy node simplifies operations involving the head:

```text
dummy → head → ...
```

Now every real node has a predecessor.

This is particularly useful for:

- deleting by value;
- inserting before a target;
- partitioning;
- merging lists.

---

# 7. Deleting the Head

For:

```text
head → B → C
```

remove the head:

```js
head = head.next;
```

If the removed node was the only node:

```text
head = null
tail = null
```

and size must become zero if tracked.

---

# 8. Delete by Value

Maintain:

```text
previous
current
```

When the target is found:

```js
previous.next = current.next;
```

Then update `tail` if the deleted node was the tail.

Decide whether the operation removes:

```text
first occurrence
or
all occurrences
```

These are different algorithms.

---

# 9. Delete by Position

For index `i`, locate the predecessor at `i - 1`, then bypass the target.

Typical complexity:

```text
O(N)
```

unless the required predecessor is already available.

Boundary indices require explicit handling.

---

# 10. Delete All Matching Values

Suppose:

```text
1 → 2 → 2 → 3 → 2
```

Removing every `2` should produce:

```text
1 → 3
```

A dummy node can make repeated head deletion uniform.

The algorithm must continue checking the successor after deletion rather than blindly advancing past it.

---

# 11. Consecutive Deletions

Consider:

```text
A → X → X → B
```

After deleting the first `X`, the second `X` becomes the new successor of `A`.

Therefore:

```text
previous stays
current changes
```

when consecutive nodes are removed.

This is a common pointer-state bug.

---

# 12. Removing the Tail

With a singly linked list, deleting the tail usually requires locating its predecessor.

Without a tail pointer:

```text
O(N)
```

Even with a tail pointer, deletion remains O(N) because the predecessor is not directly available.

A doubly linked list can reduce this to O(1) when the tail node is known.

---

# 13. Doubly Linked List Mutation

A doubly linked node has:

```text
prev
value
next
```

Deleting `B` from:

```text
A ⇄ B ⇄ C
```

requires reconnecting both directions:

```text
A.next = C
C.prev = A
```

The benefit is easier bidirectional navigation; the cost is additional memory and invariants.

---

# 14. Doubly Linked List Invariants

For adjacent nodes:

```text
node.next.prev === node
node.prev.next === node
```

Boundary nodes satisfy:

```text
head.prev === null
tail.next === null
```

A mutation that updates only one direction corrupts the structure.

---

# 15. Mutation With Metadata

If the list tracks `size`, every successful insertion/deletion must update it exactly once.

If it tracks `tail`, every operation affecting the final node must preserve tail correctness.

Metadata is part of the data structure's state, not an optional afterthought.

---

# 16. Ownership of Removed Nodes

After unlinking a node:

```text
previous.next = node.next
```

The node may still be referenced elsewhere.

Do not assume unlinking automatically destroys the JavaScript object.

If the removed node must become isolated, you may explicitly clear its structural references where appropriate.

---

# 17. Safe Mutation Pattern

A robust pattern is:

```text
identify
→ preserve required references
→ modify minimum edges
→ update metadata
→ verify invariants
```

Avoid changing unrelated pointers.

The fewer edges you mutate, the easier correctness is to reason about.

---

# 18. Transaction-Like Thinking

For complex mutations, conceptually separate:

```text
before state
→ planned edge changes
→ commit changes
→ validate invariants
```

This is especially useful when implementing multi-step operations such as list splicing or merging.

---

# 19. Splicing a List

Splicing moves or inserts an entire chain without copying nodes.

For example:

```text
A → B → C
X → Y
```

can become:

```text
A → X → Y → B → C
```

The operation is about reconnecting boundary edges.

Be explicit about ownership of the moved segment.

---

# 20. Concatenation

If `tailA` is known:

```text
tailA.next = headB
```

can concatenate two singly linked lists in O(1), assuming ownership and aliasing are acceptable.

If list A and B remain independently mutable objects, metadata must be reconciled carefully.

---

# 21. Aliasing Hazards

Two list objects can accidentally share nodes:

```text
listA → B → C
          ↑
listB ────┘
```

Mutating one list can unexpectedly mutate the other.

This is an ownership problem, not merely a pointer syntax problem.

---

# 22. Accidental Cycles During Mutation

A careless assignment can produce:

```text
A → B → C
    ↑   ↓
    └───┘
```

The list may appear correct during a short traversal and then loop forever.

Cycle detection should be part of testing for complex rewiring algorithms.

---

# 23. Mutation and Recursion

Recursive linked-list mutations can be elegant:

```text
solve(node.next)
→ reconnect returned head
```

But mutation depth becomes recursion depth.

For large lists, an iterative version may be safer even if the recursive version is easier to express.

---

# 24. Persistent / Non-Mutating Alternatives

Instead of changing the original list, construct a new structure or share immutable nodes.

Advantages:

- easier reasoning;
- safer sharing;
- simpler rollback.

Costs:

- additional allocation;
- possible O(N) copying;
- more complex structural sharing.

---

# 25. Complexity Summary

For a singly linked list:

| Operation | Typical Complexity |
|---|---:|
| Insert head | O(1) |
| Append with tail | O(1) |
| Append without tail | O(N) |
| Insert after known node | O(1) |
| Insert before target | O(N) |
| Delete head | O(1) |
| Delete known node with predecessor | O(1) |
| Delete by value | O(N) |
| Delete tail | O(N) |
| Delete all matches | O(N) |
| Concatenate with known tail | O(1) |

The exact bound depends on what references the caller already has.

---

# 26. Common Mistakes

1. Losing the successor before rewiring.
2. Updating `head` but forgetting `tail`.
3. Updating `size` incorrectly.
4. Advancing after deleting a node and skipping its successor.
5. Creating a cycle.
6. Breaking a doubly linked list's reverse edge.
7. Mutating an aliased list unexpectedly.
8. Treating a node reference as ownership of the whole list.
9. Assuming a tail pointer makes tail deletion O(1) in a singly linked list.
10. Forgetting that removed nodes can remain reachable elsewhere.

---

# 27. Edge Cases

Test every mutation with:

```text
empty list
one node
two nodes
insert into empty
insert at head
insert at tail
delete head
delete tail
delete only node
delete missing value
duplicate values
consecutive matches
all nodes matching
already shared nodes
cycle present
```

---

# 28. Backend Applications

Mutation patterns directly apply to an LRU cache:

```text
Map(key → node)
+
doubly linked list for recency
```

Operations such as `get`, `put`, promote-to-front, and eviction depend on correct O(1) pointer updates.

A single broken `prev/next` invariant can corrupt the cache.

---

# 29. AI Applications

Mutation concepts appear in:

- maintaining candidate chains;
- search-path construction;
- work queues;
- explicit traversal stacks.

For AI workloads, immutable state or explicit worklists can sometimes make concurrent reasoning safer than shared pointer mutation.

---

# 30. Design Procedure

```text
1. Draw the before state.
2. Draw the desired after state.
3. Identify boundary nodes.
4. List every edge that must change.
5. Save references that would otherwise be lost.
6. Apply the minimum mutations.
7. Update head/tail/size metadata.
8. Check reachability.
9. Check for accidental cycles.
10. Check doubly linked reverse links when applicable.
11. Analyze complexity based on known references.
12. Test boundary and duplicate cases.
```

---

# 31. Interview Explanation Template

> “I model insertion and deletion as edge rewiring. Before changing a link, I preserve the successor or predecessor references required by the remaining algorithm. Then I perform the minimum pointer changes and restore all metadata invariants such as head, tail, and size. For doubly linked lists I verify both forward and backward links. The complexity depends on which node references are already available.”

---

# 32. Revision Checklist

- [ ] Can I insert at head and tail safely?
- [ ] Can I insert after a known node?
- [ ] Can I explain why insert-before needs a predecessor in a singly linked list?
- [ ] Can I delete the head, middle, and tail?
- [ ] Can I delete all matching values without skipping nodes?
- [ ] Can I use a dummy node to simplify mutations?
- [ ] Can I maintain head/tail/size invariants?
- [ ] Can I mutate a doubly linked list correctly in both directions?
- [ ] Can I identify aliasing hazards?
- [ ] Can I detect accidental cycles?
- [ ] Can I splice chains safely?
- [ ] Can I explain why a singly linked tail pointer does not make tail deletion O(1)?
- [ ] Can I compare mutable and persistent approaches?
- [ ] Can I implement LRU-style pointer mutation?

# Key Takeaways

1. Linked-list mutation is edge rewriting.
2. Save references before overwriting links.
3. Dummy nodes simplify many head-boundary operations.
4. In singly linked lists, the predecessor is fundamental to insertion-before and deletion.
5. Tail metadata improves append but does not make singly linked tail deletion O(1).
6. Doubly linked lists trade extra memory for easier bidirectional mutation.
7. Head, tail, size, reachability, and cycle invariants must remain synchronized.
8. Aliasing means two structures can unintentionally share the same nodes.
9. Mutation should be minimal, explicit, and followed by invariant checks.
10. The correct complexity depends on which references are already known.
