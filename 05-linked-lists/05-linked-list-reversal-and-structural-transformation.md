# 05.05 — Linked List Reversal & Structural Transformation

## Purpose

Reversal is one of the most important linked-list transformations because it forces precise reasoning about pointer ownership, traversal state, invariants, and in-place mutation.

The goal is not to memorize three assignments. The goal is to understand how a directed chain can be transformed without losing reachability.

> Reversal is a controlled change of every `next` edge while preserving every node exactly once.

---

# 1. The Structural Problem

Given:

```text
A → B → C → D → null
```

produce:

```text
D → C → B → A → null
```

The node values do not need to move between objects.

The links change direction.

---

# 2. Why Reversal Is Dangerous

Consider:

```js
current.next = previous;
```

If the original successor was not saved first, the remaining list may become unreachable.

Therefore the fundamental rule is:

```text
SAVE successor
→ REWIRE current
→ ADVANCE
```

This is the same save-before-overwrite principle used in mutation operations.

---

# 3. Three-Pointer Model

The standard iterative reversal maintains:

```text
previous
current
next
```

Initially:

```text
previous = null
current  = head
```

At each step:

```js
next = current.next;
current.next = previous;
previous = current;
current = next;
```

At termination:

```text
previous = new head
current  = null
```

---

# 4. Reversal Invariant

During iteration, maintain two regions:

```text
reversed region → current region → untouched region
```

Example:

```text
C → B → A → null    D → E → null
^                   ^
reversed            current
```

Every iteration moves exactly one node from the untouched/current side into the reversed side.

This invariant explains correctness.

---

# 5. Iterative Reversal

Canonical implementation:

```js
function reverseList(head) {
    let previous = null;
    let current = head;

    while (current !== null) {
        const next = current.next;
        current.next = previous;
        previous = current;
        current = next;
    }

    return previous;
}
```

Complexity:

```text
Time:  O(N)
Space: O(1)
```

No new list nodes are required.

---

# 6. Empty and Singleton Lists

Empty:

```text
null → null
```

Singleton:

```text
A → null
```

Both naturally work with the iterative algorithm.

A strong implementation should make boundary behavior emerge from the algorithm rather than requiring unnecessary special cases.

---

# 7. Updating Head and Tail

If a list object tracks both endpoints:

Before:

```text
head = A
tail = D
```

After reversal:

```text
head = D
tail = A
```

For a list abstraction, endpoint metadata is part of correctness.

If size is tracked, size remains unchanged.

---

# 8. Recursive Reversal

Recursive reversal can be expressed as:

```text
reverse the suffix
→ attach current node after the reversed suffix
→ return new head
```

For:

```text
A → B → C
```

reverse the suffix beginning at `B` first.

Then reconnect `A` at the end.

The recursive approach is elegant but consumes call-stack space.

---

# 9. Recursive Reversal Formula

Conceptually:

```text
reverse(node)

if node is null or node.next is null:
    return node

newHead = reverse(node.next)
node.next.next = node
node.next = null
return newHead
```

The `node.next = null` step is essential.

Without it, the old forward edge can create a cycle.

---

# 10. Recursive Complexity

For N nodes:

```text
Time:  O(N)
Auxiliary stack: O(N)
```

The list nodes themselves are reused.

The extra space comes from recursive call frames.

This is a critical distinction between:

```text
data-structure space
```

and

```text
algorithmic auxiliary space
```

---

# 11. Reverse a Sublist

Sometimes the entire list should not be reversed.

Given:

```text
A → B → C → D → E
```

reverse positions `B..D`:

```text
A → D → C → B → E
```

The internal segment is reversed and then reconnected to the unchanged prefix and suffix.

This is a boundary-rewiring problem.

---

# 12. Segment Reversal

For a segment:

```text
before → first → ... → last → after
```

after reversal:

```text
before → last → ... → first → after
```

You must preserve:

- `before`;
- `after`;
- original `first`;
- new segment head.

A dummy node often simplifies the case where `first` is the original head.

---

# 13. Reverse in Groups

A more advanced transformation reverses nodes in fixed groups.

For group size `k`:

```text
A B C D E F
```

with `k = 2` becomes:

```text
B A D C F E
```

Depending on the specification, an incomplete final group may remain unchanged.

The key challenge is connecting group boundaries correctly.

---

# 14. Reverse in Groups: Boundary Reasoning

For every group identify:

```text
group predecessor
first node
group last node
successor after group
```

After reversal:

```text
group predecessor → new group head
new group tail → successor
```

The same pointer-rewiring principles repeat at every group.

---

# 15. Pairwise Swapping

Pairwise swapping is a special transformation:

```text
A → B → C → D
```

becomes:

```text
B → A → D → C
```

It can be implemented by repeatedly rewiring two-node segments.

Dummy nodes are particularly useful for making the first pair behave like every later pair.

---

# 16. Reverse Values vs Reverse Nodes

These are different operations.

### Reverse values

```text
A(1) → B(2) → C(3)
```

becomes:

```text
A(3) → B(2) → C(1)
```

The node structure remains unchanged.

### Reverse nodes

```text
A → B → C
```

becomes:

```text
C → B → A
```

The node identities and edges change.

For production data structures, node identity can matter, so these operations must not be conflated.

---

# 17. Reverse Without Mutation

A non-mutating reversal can construct a new structure:

```text
A → B → C
```

producing new nodes:

```text
C' → B' → A'
```

Original nodes remain unchanged.

Trade-off:

```text
mutable in-place:
O(N) time, O(1) auxiliary space

reconstructed:
O(N) time, O(N) additional nodes
```

---

# 18. Persistent Structural Sharing

Immutable linked structures can reverse or transform using shared nodes in specialized designs.

However, ordinary singly linked nodes are naturally optimized for forward traversal, so full reversal with maximal sharing can require a different representation or additional metadata.

The broader lesson is:

> Data representation determines which transformations are cheap.

---

# 19. Reverse Traversal Without Reversal

Sometimes the requirement is only to process nodes from tail to head.

Do not mutate the list unnecessarily.

Possible approaches include:

- recursion;
- explicit stack;
- collecting nodes into an array and iterating backward.

For a list of N nodes:

```text
recursion: O(N) auxiliary stack
explicit stack: O(N)
array: O(N)
```

The correct choice depends on stack safety and workload constraints.

---

# 20. Detecting Cycles Before Reversal

A standard reversal algorithm assumes a terminating chain.

If the list contains a cycle, ordinary reversal may not have the expected semantics.

For production-grade structural utilities, define whether cyclic input is:

```text
invalid
supported
or rejected explicitly
```

Do not let malformed input silently produce undefined structure.

---

# 21. Reversal and Aliasing

If another structure holds a reference to a node inside the list, in-place reversal changes what that reference observes.

Example:

```text
list → A → B → C
       ^
external reference
```

After reversal:

```text
C → B → A
    ^
external reference
```

The referenced node is the same object, but its `next` relationship may have changed.

Mutation therefore has observable effects beyond the list head.

---

# 22. Reversal and Ownership

Before an in-place transformation, determine who owns the nodes.

If nodes are exclusively owned by the list, mutation is usually straightforward.

If nodes are shared, reversal can corrupt assumptions held by other consumers.

Ownership is therefore part of API design.

---

# 23. Reversal as a State Machine

Each iteration can be viewed as a state transition:

```text
(previous, current)
        ↓
(previous', current')
```

where:

```text
previous' = current
current'  = saved successor
```

This makes reversal useful as a model for understanding state transitions in pointer-based algorithms.

---

# 24. Reversal Correctness Proof

A useful proof structure is:

### Initialization

Before the first iteration:

```text
previous = null
current = head
```

The reversed region is empty and the entire list remains reachable through `current`.

### Maintenance

One node is removed from the current region and prepended to the reversed region while preserving the saved successor.

### Termination

When `current === null`, every original node belongs to the reversed region.

Therefore `previous` is the new head and the chain contains every node exactly once.

---

# 25. Complexity

| Transformation | Time | Extra Space |
|---|---:|---:|
| Full iterative reversal | O(N) | O(1) |
| Full recursive reversal | O(N) | O(N) stack |
| Reverse values with array | O(N) | O(N) |
| Reverse sublist | O(N) worst | O(1) |
| Reverse in groups | O(N) | O(1) iterative |
| Reverse traversal with stack | O(N) | O(N) |
| Detect cycle before transformation | O(N) | O(1) with Floyd |

The exact complexity of a sublist operation can be expressed in terms of the distance to the segment when the boundaries are not already known.

---

# 26. Common Mistakes

1. Overwriting `current.next` before saving it.
2. Returning the old head instead of the new head.
3. Forgetting to update tail metadata.
4. Creating a cycle during recursive reversal.
5. Breaking the suffix connection during sublist reversal.
6. Connecting reversed groups incorrectly.
7. Confusing value reversal with node reversal.
8. Ignoring external references to mutated nodes.
9. Using recursion for lists too large for the available call stack.
10. Reversing when only reverse-order processing was required.

---

# 27. Edge Cases

Test:

```text
empty list
one node
two nodes
full reversal
reverse prefix
reverse suffix
reverse middle segment
segment of length 1
k = 1
k > length
exact multiple of k
incomplete final group
cycle input
shared node references
head/tail metadata
```

---

# 28. Backend Applications

Reversal and structural transformations help explain:

- LRU list manipulation;
- undo/redo chains;
- linked work queues;
- stream-processing buffers;
- explicit traversal structures.

In an LRU cache, operations often move a known node to the front rather than reverse the entire list, but the same pointer discipline applies.

---

# 29. AI Applications

Useful conceptual applications include:

- reversing explicit search paths;
- processing generated chains backward;
- transforming linked candidate structures;
- converting recursive search state into explicit stacks.

In modern AI systems, arrays/tensors and graph structures are usually more common, so linked-list reversal is primarily valuable as a foundation for pointer-safe state transformation.

---

# 30. Production Engineering

Before implementing an in-place transformation, define:

```text
input ownership
mutation contract
node identity guarantees
cycle policy
metadata policy
failure behavior
```

A production utility should make invalid assumptions explicit.

For example, if a function requires an acyclic singly linked list, document and validate that contract rather than relying on accidental termination.

---

# 31. Design Procedure

```text
1. Draw original chain.
2. Draw desired chain.
3. Identify every boundary.
4. Determine which nodes must retain identity.
5. Save successors before rewiring.
6. Define the loop/recursive invariant.
7. Perform minimum edge changes.
8. Reconnect prefix/suffix boundaries.
9. Update head/tail/size metadata.
10. Validate reachability and termination.
11. Analyze auxiliary space.
12. Test malformed and boundary inputs.
```

---

# 32. Interview Explanation Template

> “I treat reversal as controlled edge rewiring. The iterative solution maintains previous, current, and the saved successor. The invariant is that the previous chain is already reversed while current still identifies the unprocessed suffix. Each iteration moves exactly one node across that boundary. When current becomes null, previous is the new head. The algorithm is O(N) time and O(1) auxiliary space.”

---

# 33. Revision Checklist

- [ ] Can I reverse a singly linked list iteratively without losing nodes?
- [ ] Can I state and prove the reversal invariant?
- [ ] Can I reverse recursively?
- [ ] Can I explain recursive auxiliary space?
- [ ] Can I reverse a sublist?
- [ ] Can I reverse nodes in groups?
- [ ] Can I pairwise swap nodes?
- [ ] Can I distinguish reversing values from reversing nodes?
- [ ] Can I process a list backward without mutating it?
- [ ] Can I reason about cycles before structural transformation?
- [ ] Can I identify aliasing and ownership hazards?
- [ ] Can I update head/tail/size correctly?
- [ ] Can I derive the complexity instead of memorizing it?

# Key Takeaways

1. Reversal is edge rewriting, not value movement.
2. Always save the successor before overwriting `next`.
3. The iterative three-pointer algorithm gives O(N) time and O(1) auxiliary space.
4. Recursive reversal uses O(N) call-stack space.
5. Sublist and group reversal are boundary-reconnection problems.
6. Node identity and value order are different concepts.
7. In-place mutation has consequences for aliases and external node references.
8. A clear invariant makes reversal correctness easy to prove.
9. Do not mutate when reverse-order processing alone is required.
10. Pointer transformations should be designed from before/after states and verified through invariants.
