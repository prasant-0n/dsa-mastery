# 05.02 — Linked List Traversal & Pointer Manipulation

## Purpose

This chapter develops the core linked-list skill: moving through nodes while preserving references and safely changing links.

> Most linked-list bugs are not value bugs. They are **reference-flow bugs**.

---

# 1. Traversal Mental Model

Given:

```text
head → A → B → C → null
```

Traversal maintains a cursor:

```text
current
```

At every step:

```text
process current
move current to current.next
```

The cursor must eventually reach the termination condition.

---

# 2. Basic Iterative Traversal

```js
let current = head;

while (current !== null) {
    console.log(current.value);
    current = current.next;
}
```

Invariant:

> Every node before `current` has already been processed exactly once.

---

# 3. Traversal With an Index

An index can be tracked alongside the cursor:

```js
let index = 0;
let current = head;

while (current !== null) {
    // current corresponds to index
    current = current.next;
    index++;
}
```

The index is derived traversal state, not native linked-list addressing.

---

# 4. Find a Node

Searching typically returns either:

```text
node reference
```

or:

```text
null
```

Returning the node itself is often more useful than returning only its value because later operations may mutate its links.

---

# 5. Find a Predecessor

For singly linked lists, many operations need:

```text
previous
current
```

Maintain both:

```text
previous → current → next
```

This makes deletion and insertion straightforward.

---

# 6. Two-Pointer Traversal

Two cursors can traverse at different speeds:

```text
slow → one step
fast → two steps
```

This supports:

- middle-node detection;
- cycle detection;
- relative-position problems.

The important skill is reasoning about their invariant rather than memorizing a template.

---

# 7. Fast and Slow Pointer Invariant

For cycle detection, if a cycle exists, the faster pointer eventually catches the slower pointer inside the cycle.

If `fast` reaches `null`, no cycle exists in a finite singly linked structure.

The algorithm uses O(1) auxiliary space.

---

# 8. Finding the Middle

With:

```text
slow += 1
fast += 2
```

when `fast` reaches the end, `slow` is near the middle.

The exact returned middle for even-length lists depends on the chosen stopping condition.

Always define whether you want the first or second middle.

---

# 9. Pointer Rewiring

Suppose:

```text
A → B → C
```

To insert `X` after `A`:

```text
X.next = A.next
A.next = X
```

The order matters.

---

# 10. The Save-Before-Overwrite Rule

Before replacing a pointer, save anything that would otherwise become unreachable.

For reversal:

```js
const next = current.next;
current.next = previous;
current = next;
```

This is one of the most important linked-list implementation habits.

---

# 11. Reversal Mental Model

Original:

```text
A → B → C → null
```

Reversed:

```text
null ← A ← B ← C
```

At each step:

```text
save next
reverse current.next
advance previous
advance current
```

The unprocessed suffix must remain reachable through the saved reference.

---

# 12. Reversal Invariant

A useful invariant is:

```text
previous = correctly reversed prefix
current = first node of unprocessed suffix
```

At termination:

```text
current === null
previous = new head
```

---

# 13. Reverse in Place

In-place reversal uses:

```text
previous
current
next
```

and requires O(N) time and O(1) auxiliary space iteratively.

No new node is required.

---

# 14. Insertion While Traversing

To insert before a target in a singly linked list, you generally need the predecessor.

To insert after a known current node, you do not need a full traversal.

The required state determines the operation's complexity.

---

# 15. Deletion While Traversing

Maintain:

```text
previous
current
```

When the target is found:

```js
previous.next = current.next;
```

Then update metadata if the list tracks size or tail.

Deleting the head is a separate boundary case unless a sentinel node is used.

---

# 16. Sentinel / Dummy Nodes

A dummy node can simplify operations near the head:

```text
dummy → head → ...
```

Now the predecessor of the real head is `dummy`.

This can reduce special-case branching, especially in deletion and insertion algorithms.

The dummy node is implementation state, not part of the logical list.

---

# 17. Recursive Traversal

A singly linked list naturally supports:

```text
process node
→ recurse on node.next
```

Base case:

```text
node === null
```

This uses O(N) call-stack space in the worst case.

For large/untrusted lists, iterative traversal may be safer.

---

# 18. Forward vs Reverse Processing

Recursive calls can process a node:

### Before recursion
```text
node → process → recurse
```

### After recursion
```text
recurse → process node
```

The second form naturally processes nodes in reverse order without modifying links.

---

# 19. Iterative Reverse Traversal

To process a list backward without changing it, common approaches include:

```text
stack
array
recursion
```

Each changes the auxiliary-space trade-off.

A singly linked list does not inherently support backward traversal.

---

# 20. Pointer Ownership

When an algorithm changes `next`, ask:

```text
Who owns this edge?
Which nodes remain reachable?
Which reference preserves the unprocessed region?
```

This prevents accidental list corruption.

---

# 21. Accumulating During Traversal

A traversal can maintain:

- sum;
- count;
- maximum;
- minimum;
- predicate result;
- collected values.

Scalar accumulators usually require O(1) auxiliary space.

A result array requires O(N) output space.

---

# 22. Early Termination

Search traversal can stop immediately when the required condition is satisfied.

Examples:

```text
find target
any predicate
first matching node
```

Worst-case complexity remains O(N), but best-case work can be much smaller.

---

# 23. Multiple Traversal Passes

Some algorithms use several passes:

```text
pass 1 → determine length
pass 2 → locate target
```

This remains O(N) asymptotically when the number of passes is constant.

But one-pass alternatives may reduce latency and simplify certain streaming scenarios.

---

# 24. Traversal With Cycles

A standard null-terminated traversal is unsafe if a cycle exists.

For arbitrary linked structures, choose a cycle policy:

```text
Floyd's algorithm
or
Set of visited nodes
```

A `Set` uses O(N) memory; Floyd's algorithm uses O(1) auxiliary space.

---

# 25. Complexity

For N reachable nodes:

```text
Single traversal: O(N)
Two constant-number passes: O(N)
Reverse in place: O(N)
Cycle detection: O(N)
Extra traversal variables: O(1)
Visited-set cycle detection: O(N)
Recursive traversal stack: O(N)
```

Output storage must be counted separately.

---

# 26. Common Pointer Bugs

### Lost suffix
You overwrite `current.next` before saving it.

### Accidental cycle
A rewiring operation points back into an earlier node unintentionally.

### Wrong head
The new head is not returned or stored.

### Broken tail
The old tail still points into the list incorrectly.

### Skipped node
Advancing a cursor too early causes a node to be missed.

---

# 27. Debugging Technique: Draw Before Code

For every pointer mutation, draw:

```text
previous
current
next
```

Then draw the desired final edges.

Translate exactly those edge changes into code.

This is often faster than debugging a corrupted list afterward.

---

# 28. Backend Applications

Pointer-manipulation concepts appear in:

- LRU cache lists;
- queue implementations;
- eviction chains;
- linked task structures;
- internal scheduling structures.

A production LRU commonly combines a hash map for O(1) lookup with a doubly linked list for O(1) recency updates.

---

# 29. AI Applications

Traversal and pointer reasoning can support:

- custom candidate chains;
- search paths;
- sequence structures;
- explicit work queues/stacks.

However, choose representations according to actual access patterns; arrays and maps are often preferable in JavaScript.

---

# 30. Design Procedure

```text
1. Draw the list.
2. Identify current, previous, next.
3. Define the traversal invariant.
4. Save references before mutation.
5. Perform pointer changes.
6. Advance exactly once per intended step.
7. Check head/tail invariants.
8. Check for accidental cycles.
9. Define termination.
10. Analyze time, stack, and output space.
11. Test empty/singleton/two-node cases.
```

---

# 31. Interview Explanation Template

> “For linked-list pointer manipulation, I first define the invariant and identify which references must survive each mutation. I keep `previous`, `current`, and `next` explicit when rewiring. Before overwriting a link, I save the successor so the unprocessed suffix remains reachable. After mutation I verify head, tail, reachability, and cycle invariants.”

---

# 32. Revision Checklist

- [ ] Can I traverse a list safely?
- [ ] Can I maintain a traversal invariant?
- [ ] Can I track predecessor and current node?
- [ ] Can I use slow/fast pointers correctly?
- [ ] Can I find the first/second middle deliberately?
- [ ] Can I reverse a list in place?
- [ ] Can I explain the save-before-overwrite rule?
- [ ] Can I use a dummy node to simplify boundaries?
- [ ] Can I traverse recursively and explain stack cost?
- [ ] Can I process a list backward without reversing it?
- [ ] Can I detect accidental cycles?
- [ ] Can I debug pointer corruption by drawing edges?
- [ ] Can I analyze output vs auxiliary space?
- [ ] Can I explain backend applications such as LRU structures?

# Key Takeaways

1. Traversal is controlled movement of a cursor through references.
2. Pointer manipulation is fundamentally edge rewiring.
3. Save a successor before overwriting a link that you still need.
4. `previous/current/next` is the core state for many singly linked-list mutations.
5. Slow/fast pointers solve several problems without extra memory.
6. Dummy nodes can eliminate awkward head special cases.
7. Recursive traversal is natural but consumes call-stack space proportional to depth.
8. Cycle-aware traversal requires an explicit policy.
9. Draw pointer states before coding difficult mutations.
10. Correctness depends on preserving reachability and metadata invariants.
