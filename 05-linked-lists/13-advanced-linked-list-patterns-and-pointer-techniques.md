# 05.13 — Advanced Linked List Patterns & Pointer Techniques

## Purpose

This chapter combines the pointer techniques developed so far into reusable algorithmic patterns.

The goal is not to memorize isolated tricks. The goal is to recognize structural signals and choose the smallest amount of state needed to transform or inspect a linked structure safely.

---

## 1. Pointer Technique Mindset

Most advanced linked-list problems can be reduced to a few questions:

1. Which nodes must I remember?
2. Can I make progress with one pass?
3. Do I need a predecessor pointer?
4. Can two pointers move at different speeds?
5. Can I temporarily reverse or rewire part of the list?
6. Can a sentinel remove boundary cases?
7. Does node identity matter?
8. Are nodes shared with another structure?

---

## 2. Fast and Slow Pointers

Two pointers can move at different rates:

```text
slow → one step
fast → two steps
```

This supports:

- middle-node detection;
- cycle detection;
- cycle-entry discovery;
- some partitioning and timing problems.

The technique often achieves O(N) time with O(1) auxiliary space.

---

## 3. Dummy/Sentinel Nodes

A sentinel creates a stable predecessor before the real head:

```text
DUMMY → A → B → C
```

This simplifies operations involving the first node because the head becomes an ordinary successor of the dummy.

Common uses:

- deletion by value;
- insertion before a target;
- partitioning;
- merging;
- removing the Nth node from the end.

---

## 4. One-Pass Mutation

Suppose the task is:

```text
find first X and delete it
```

A search that retains the predecessor can perform discovery and mutation in one traversal.

Conceptually:

```text
previous → current → next
```

Once `current` matches:

```text
previous.next = current.next
```

This avoids a second search.

---

## 5. Two-Pointer Gap Technique

To find the kth node from the end:

1. advance `fast` by k positions;
2. move `fast` and `slow` together;
3. when `fast` reaches the required boundary, `slow` identifies the target.

The key idea is maintaining a fixed distance between pointers.

This turns a common two-pass problem into one pass.

---

## 6. Remove Nth Node from End

A sentinel plus a fixed pointer gap is a robust solution:

```text
DUMMY → A → B → C → D
 ^
 slow
       
             fast
```

Maintain the required gap, then bypass the target.

Complexity:

```text
Time:  O(N)
Space: O(1)
```

---

## 7. Reverse-Then-Process

Some problems become simpler after reversing a list or a segment.

Examples:

- process suffixes from the opposite direction;
- transform a right-side condition into a left-side condition;
- compare mirrored regions.

But reversal mutates structure, so ownership and external references must be considered.

---

## 8. Reverse a Segment In Place

For a segment:

```text
A → B → C → D → E
```

reverse B through D:

```text
A → D → C → B → E
```

The operation requires careful management of:

```text
before
first
current
next
last
after
```

The most common bugs are losing the remainder of the list or reconnecting the segment incorrectly.

---

## 9. Reverse in Groups

Given k:

```text
A B C D E F
```

for k = 2:

```text
B A D C F E
```

A group-reversal algorithm repeatedly:

1. determines whether a complete group exists;
2. reverses that group;
3. reconnects it to the previous group;
4. continues from the next group.

The incomplete final group requires an explicit policy.

---

## 10. Pairwise Swapping

Pair swapping is a specialized group reversal:

```text
A → B → C → D
```

becomes:

```text
B → A → D → C
```

A sentinel often makes the implementation cleaner.

---

## 11. Partitioning with Multiple Chains

Instead of repeatedly moving nodes inside one chain, maintain several chains:

```text
less

equal

greater
```

After processing, connect the chains.

This is useful for stable three-way partitioning.

The important safety rule is to detach each node before placing it into a new chain.

---

## 12. Detach-Before-Rewire

Suppose a node currently belongs to:

```text
A → X → B
```

and must move elsewhere.

A defensive sequence is:

```text
save next
unlink node
clear node.next if ownership requires it
attach node to destination
```

This makes stale links less likely to corrupt the new structure.

---

## 13. Palindrome Detection

A linked-list palindrome can be solved with O(1) auxiliary space:

1. find the middle;
2. reverse the second half;
3. compare both halves;
4. optionally restore the second half.

Restoring the list is important when callers expect non-destructive behavior.

---

## 14. Intersection by Identity

Two lists intersect when they contain the same node object, not merely equal values.

Pointer switching provides an elegant O(N + M) approach:

```text
A-list + B-list
B-list + A-list
```

After traversing one list, switch to the other head. Equalized path lengths cause pointers to meet at the shared node or null.

---

## 15. Cycle Entry via Floyd

Floyd's method:

```text
slow += 1
fast += 2
```

First detect a meeting inside the cycle.

Then reset one pointer to the head and move both one step at a time. Their next meeting is the cycle entry.

The proof depends on distance relationships within the cycle.

---

## 16. Cycle Decomposition

A cyclic list can be modeled as:

```text
prefix + cycle
```

Track:

- prefix length μ;
- cycle length λ.

This decomposition supports reasoning about repeated traversal and termination.

---

## 17. Merge Two Sorted Lists

The canonical pattern is:

```text
choose smaller current node
advance chosen list
attach chosen node
```

With a sentinel:

```text
DUMMY → result
```

When one list ends, attach the remainder of the other list.

Time is O(N + M), with O(1) auxiliary space when nodes are reused.

---

## 18. Merge K Sorted Lists

For K sorted lists containing T total nodes:

### Sequential
Repeatedly merge into one result.

Potential cost can approach O(KT) for poorly balanced ordering.

### Divide and conquer
Pair lists recursively:

```text
K → K/2 → K/4 → ...
```

Cost:

```text
O(T log K)
```

### Min-heap
Keep the smallest current node from each non-empty list in a heap.

Cost:

```text
O(T log K)
```

with O(K) heap space.

---

## 19. Stable Algorithms

If two nodes have equal keys, stability means their original relative order is preserved.

For merging A and B, choose A first on equality:

```text
A.value <= B.value
```

The comparator alone does not guarantee stability; the tie-handling policy does.

---

## 20. Structural Transformation vs Value Transformation

These are different operations.

### Value transformation

```text
A → B → C
```

may become:

```text
X → Y → Z
```

with the same node structure.

### Structural transformation

The node links themselves change.

This affects:

- external references;
- ownership;
- identity;
- aliasing;
- concurrent observers.

---

## 21. Node Identity as State

If callers hold:

```js
const node = findNode(head, target);
```

then replacing the node with a newly allocated equivalent object changes identity.

Therefore an implementation that is value-equivalent may still violate the API contract.

---

## 22. Copy-on-Write Thinking

Immutable or persistent list designs avoid destructive mutation by creating new structure around shared immutable nodes.

Conceptually:

```text
old: A → B → C
new: X → Y ─┘
```

This can make sharing safe when nodes are immutable.

The trade-off is additional allocation.

---

## 23. Persistent Linked Structures

A persistent list preserves old versions after updates.

For a singly linked immutable list, prepending can be O(1):

```text
newHead → newNode → oldHead
```

The old list remains valid.

This is a fundamental connection between linked lists and functional programming.

---

## 24. Destructive vs Persistent Trade-Off

| Property | Destructive | Persistent |
|---|---|---|
| Mutation | yes | no/controlled |
| Allocation | lower | higher |
| Old versions | lost | preserved |
| Aliasing risk | higher | lower when immutable |
| Reasoning | imperative | functional/state-based |

Neither is universally better.

---

## 25. Iterator-Based Processing

Instead of exposing nodes, a container can expose an iterator:

```js
for (const value of list) {
    // process value
}
```

This hides structural ownership while allowing sequential processing.

Iterators can also represent lazy pipelines without constructing intermediate arrays.

---

## 26. Lazy Traversal

A linked structure can be consumed incrementally:

```text
node → process → next → process → ...
```

This can reduce peak memory when processing large streams, although the list itself still retains its reachable nodes until references are released.

---

## 27. Defensive Cycle Handling

Algorithms that assume `next === null` termination can loop forever on malformed cyclic input.

If input integrity is uncertain:

- validate first;
- impose a node-count limit;
- use cycle detection;
- or define cyclic input as invalid.

The correct choice depends on the API contract.

---

## 28. Backend Patterns

Advanced pointer techniques appear conceptually in:

- LRU caches;
- task queues;
- eviction lists;
- intrusive lists;
- schedulers;
- graph frontiers;
- in-memory indexes.

The most important production concern is usually ownership and lifecycle, not clever pointer syntax.

---

## 29. AI Patterns

These techniques support:

- search frontier management;
- candidate lists;
- beam-style candidate pruning;
- graph traversal;
- state-space exploration;
- linked representations of incremental processing.

However, large numerical data generally belongs in contiguous specialized structures rather than object-heavy linked lists.

---

## 30. Common Mistakes

1. Losing `next` before rewiring.
2. Forgetting to reconnect a reversed segment.
3. Forgetting the predecessor of a target.
4. Using value equality where identity is required.
5. Mutating shared nodes without ownership checks.
6. Forgetting incomplete-group policy.
7. Breaking stability on equal keys.
8. Assuming a list is acyclic without validating the contract.
9. Forgetting to restore a list after a temporary transformation.
10. Overusing clever pointer tricks when a simpler structure is safer.

---

## 31. Advanced Problem-Solving Framework

For an unfamiliar linked-list problem:

```text
1. Draw the nodes.
2. Mark identity, not only values.
3. Identify required boundaries.
4. Decide whether a sentinel helps.
5. Determine whether one pass is possible.
6. Look for a fast/slow or gap invariant.
7. Decide whether mutation is allowed.
8. Save next before rewiring.
9. State the invariant after each iteration.
10. Prove termination.
11. Analyze time and auxiliary space.
12. Test empty, singleton, short, duplicate, cyclic, and shared cases.
```

---

## 32. Revision Checklist

- [ ] Use fast/slow pointers for middle and cycle problems.
- [ ] Use a sentinel to simplify head mutation.
- [ ] Use a fixed pointer gap for kth-from-end problems.
- [ ] Reverse segments safely in place.
- [ ] Reverse nodes in groups.
- [ ] Partition using multiple chains.
- [ ] Detect palindromes through middle + reversal.
- [ ] Find intersection by identity.
- [ ] Explain Floyd cycle-entry reasoning.
- [ ] Merge sorted lists stably.
- [ ] Compare K-way merge strategies.
- [ ] Distinguish structural and value transformations.
- [ ] Explain node identity and aliasing.
- [ ] Explain persistent linked structures.
- [ ] Explain defensive cycle handling.

# Key Takeaways

1. Advanced linked-list problems are combinations of a small number of pointer patterns.
2. Sentinels reduce boundary complexity.
3. Fast/slow and gap pointers turn many two-pass tasks into one-pass algorithms.
4. Reversal is a powerful temporary transformation but requires ownership discipline.
5. Identity and value equality are different contracts.
6. Stable merging requires explicit tie handling.
7. Persistent lists demonstrate how linked structures can support safe structural sharing.
8. One-pass algorithms should be justified by an invariant, not memorized as tricks.
9. Defensive cycle and ownership handling matter in production systems.
10. The goal is not clever pointer manipulation; it is correct, explainable, efficient structural reasoning.
