# 05.04 — Linked List Searching & Position-Based Operations

## Purpose

Searching a linked list is fundamentally different from searching an array because nodes are reached by following links rather than by direct address calculation. This chapter develops precise techniques for finding nodes, positions, predecessors, ranges, and structural relationships while preserving correctness and complexity awareness.

> In a linked list, a position is discovered by traversal; it is not normally accessed directly.

---

# 1. Search Mental Model

A singly linked list is a chain:

```text
head → A → B → C → D → null
```

To inspect `C`, the algorithm normally performs:

```text
head
 ↓
A → B → C
```

Therefore, ordinary search is sequential.

Typical search complexity:

```text
Time:  O(N)
Space: O(1)
```

assuming an iterative traversal and no auxiliary structure.

---

# 2. Search by Value

The simplest search asks whether a target value exists.

```js
current = head;

while (current !== null) {
    if (current.value === target) return true;
    current = current.next;
}

return false;
```

The algorithm may terminate early when the target is found.

Worst case: the entire list is traversed.

---

# 3. Return the First Matching Node

Sometimes a boolean is insufficient. Mutation operations often need the actual node reference.

```text
find(target)
   ↓
node reference
```

Returning the node can allow later O(1) operations such as insertion after that node.

Important distinction:

```text
search cost + mutation cost
```

must be analyzed separately.

---

# 4. First vs Last Match

For:

```text
A → X → B → X → C
```

Searching for `X` can return:

- first occurrence;
- last occurrence;
- all matching nodes.

First occurrence can stop immediately.

Last occurrence requires continuing through the list.

All occurrences require examining every reachable node.

---

# 5. Search by Index

An index-based operation is implemented through traversal.

For index `k`:

```text
head → node[0] → node[1] → ... → node[k]
```

Typical time:

```text
O(k)
```

and therefore O(N) in the worst case.

Unlike an array, linked lists do not normally provide O(1) random indexing.

---

# 6. Validate an Index

A robust position-based operation must distinguish:

```text
index < 0
index === 0
0 < index < length
index === length
index > length
```

The valid range depends on the operation.

For example:

```text
get(index):        0 ≤ index < length
insert(index):     0 ≤ index ≤ length
```

Do not assume all index APIs use the same boundary rules.

---

# 7. Find the Predecessor

For singly linked lists, the predecessor is often more useful than the target.

Given:

```text
A → B → C
```

The predecessor of `C` is `B`.

Knowing `B` allows:

```js
B.next = C.next;
```

for deletion.

This is why many linked-list algorithms track two pointers:

```text
previous
current
```

---

# 8. Position and Predecessor Relationship

For index `i`:

```text
predecessor index = i - 1
current index     = i
```

For `i = 0`, there is no real predecessor.

A dummy node can eliminate this special case:

```text
dummy → head → ...
```

Then the predecessor of the original head is simply `dummy`.

---

# 9. Find the Middle Node

A classic linked-list search problem is finding the middle without knowing the length in advance.

Use two pointers:

```text
slow → one step
fast → two steps
```

When `fast` reaches the end, `slow` is near the middle.

This is the slow/fast pointer technique.

---

# 10. First Middle vs Second Middle

For an even-length list:

```text
A → B → C → D
```

there are two reasonable middle definitions:

```text
first middle  = B
second middle = C
```

The loop condition determines which one is returned.

Never say simply “the middle” in an implementation specification when even-length behavior matters.

---

# 11. Find the Kth Node From the End

Suppose:

```text
A → B → C → D → E
```

and we need the 2nd node from the end: `D`.

Use two pointers separated by a fixed gap.

```text
fast advances k steps
then slow and fast advance together
```

When `fast` reaches the required boundary, `slow` identifies the answer.

Time: O(N)

Extra space: O(1)

---

# 12. Kth From End: Boundary Definition

The exact answer depends on whether the API defines:

```text
1st from end = E
```

or

```text
0th from end = E
```

Both conventions are possible.

Define the convention before implementing the algorithm.

---

# 13. Search Within a Position Range

A linked list can be searched between two indices:

```text
[start, end)
```

The half-open convention means:

```text
start included
end excluded
```

This is often easier to compose with other algorithms.

Still, reaching `start` itself costs traversal unless a node reference is already known.

---

# 14. Search With a Predicate

Instead of searching for one exact value, accept a condition:

```js
findNode(head, node => node.value > 100)
```

This generalizes search to:

- threshold queries;
- object-property matching;
- validation;
- domain-specific conditions.

The traversal remains O(N) in the worst case.

---

# 15. Search With Multiple Conditions

A predicate can encode compound logic:

```text
value is active
AND
priority > 5
AND
not expired
```

Prefer a clear predicate over duplicating traversal logic for every condition.

This is especially useful in application-level data structures.

---

# 16. Search and Mutation Composition

Consider:

```text
find target
→ delete target
```

If `find` returns only the target node, deletion in a singly linked list may still require finding its predecessor.

A better single-pass algorithm can track:

```text
previous + current
```

This avoids a second traversal.

General principle:

> Do not perform two traversals when one traversal can collect all required structural information safely.

---

# 17. Known Node Reference vs Index

Suppose a caller already has a node reference.

Operations involving that node may be O(1):

```text
insert after known node
```

But an index-based operation may require O(N) traversal.

Therefore complexity depends not only on the data structure but also on the information already available to the algorithm.

---

# 18. Searching for a Predecessor

In a singly linked list:

```text
head → A → B → C
```

there is no backward edge from `C` to `B`.

Therefore, predecessor search requires starting from the head unless the predecessor is already known.

This is one of the fundamental limitations of singly linked structures.

---

# 19. Searching a Doubly Linked List

A doubly linked list provides:

```text
prev
next
```

If a node is known, its predecessor is immediately available:

```js
node.prev
```

This can make local structural operations easier.

However, finding an arbitrary value still normally requires traversal.

---

# 20. Bidirectional Search

For a doubly linked list with a known length, an index search can choose the closer end:

```text
index near 0      → search from head
index near length → search from tail
```

This can reduce traversal distance from O(N) worst-case to approximately O(min(i, N-i)).

The asymptotic worst case remains O(N).

---

# 21. Search in Sorted Linked Lists

If values are sorted:

```text
1 → 4 → 8 → 12 → 20
```

search can stop when the current value exceeds the target.

This improves practical work for some inputs but does **not** turn linked-list search into binary search.

Why?

Binary search requires efficient access to the middle element. Finding the middle repeatedly still costs traversal.

---

# 22. Why Binary Search Is Usually Poor on Linked Lists

Arrays support:

```text
middle = (low + high) / 2
```

with O(1) indexing.

Linked lists require walking from a known node to reach the middle.

Repeated middle discovery destroys the normal O(log N) advantage.

Therefore, a sorted linked list generally favors sequential search with early termination rather than ordinary binary search.

---

# 23. Search With Cycle Awareness

A normal traversal assumes eventual `null` termination.

A corrupted list may instead contain:

```text
A → B → C
    ↑   ↓
    └───┘
```

A search can loop forever.

For untrusted or mutable structures, cycle-aware traversal can use:

- visited-node set;
- Floyd's cycle detection;
- explicit traversal limits in defensive diagnostics.

Do not silently add cycle tracking to every hot path without considering its memory cost.

---

# 24. Search Complexity

Typical singly linked-list operations:

| Operation | Time | Extra Space |
|---|---:|---:|
| Search by value | O(N) | O(1) |
| Find first match | O(N) worst | O(1) |
| Find last match | O(N) | O(1) |
| Find by index | O(N) worst | O(1) |
| Find predecessor | O(N) | O(1) |
| Find middle | O(N) | O(1) |
| Kth from end | O(N) | O(1) |
| Collect all matches | O(N) + output | O(K) output |
| Cycle-aware search with Set | O(N) | O(N) |

`K` is the number of returned matches.

---

# 25. Early Termination

A search should stop as soon as its specification allows.

Examples:

```text
find first match → stop at first match
sorted ascending → stop when current > target
predicate satisfied → stop immediately
```

Early termination improves best-case performance without changing worst-case asymptotic complexity.

---

# 26. Search and Mutation Safety

If a search will later mutate the list, decide whether you need:

```text
current only
previous + current
current + next
```

Collecting too little information can force another traversal.

Collecting too much state can complicate correctness.

Choose the minimum state required by the complete operation.

---

# 27. Backend Applications

Linked-list searching appears in custom data structures such as:

- LRU cache node lookup through a hash map;
- queue inspection;
- eviction lists;
- in-memory job chains;
- ordered work queues.

A production LRU cache typically avoids linear node searching by combining a hash map with a doubly linked list:

```text
key → node
       ↓
head ⇄ node ⇄ node ⇄ tail
```

The map performs lookup while the list maintains ordering.

---

# 28. AI Applications

Linked-list-style traversal can appear in:

- explicit search paths;
- candidate chains;
- work-item queues;
- generated token or state sequences in specialized implementations.

However, AI systems frequently use arrays, tensors, heaps, hash maps, or graph structures instead when random access or vectorized computation dominates.

The lesson is not “use linked lists for AI,” but “understand when pointer-based sequential access is appropriate.”

---

# 29. Production Considerations

Before using a linked list in production, evaluate:

1. Is sequential traversal acceptable?
2. Is random access required?
3. Will nodes be frequently inserted or removed?
4. Can a node reference be retained?
5. Is metadata maintained consistently?
6. Can nodes become shared or aliased?
7. Can cycles occur?
8. Does memory locality matter?
9. Would an array/deque/Map provide a simpler solution?
10. Is the abstraction worth its pointer-management complexity?

The best data structure is determined by workload, not by theoretical operation lists alone.

---

# 30. Common Mistakes

1. Treating linked-list indexing like array indexing.
2. Forgetting that predecessor search requires traversal.
3. Claiming sorted linked-list search is O(log N) by ordinary binary search.
4. Traversing twice when one pass could collect predecessor information.
5. Returning the wrong middle for even-length lists.
6. Mixing zero-based and one-based kth-from-end definitions.
7. Forgetting early termination.
8. Assuming every traversal reaches `null`.
9. Adding a Set to every search without considering O(N) memory.
10. Ignoring the references already available to the caller.

---

# 31. Edge Cases

Always test:

```text
empty list
one node
two nodes
target at head
target at tail
target missing
duplicate target values
all nodes matching
negative index
index == length
index > length
k == 1
k == length
k > length
even-length middle
odd-length middle
cycle present
```

---

# 32. Search Design Procedure

```text
1. Define exactly what must be returned.
2. Define index conventions.
3. Define duplicate behavior.
4. Identify references already available.
5. Decide whether one-pass traversal is sufficient.
6. Choose current / previous / fast / slow state.
7. Define termination conditions.
8. Handle empty and boundary states.
9. Analyze time complexity.
10. Analyze auxiliary space.
11. Test duplicates and malformed structures.
```

---

# 33. Interview Explanation Template

> “A linked list does not provide direct indexing, so ordinary search is sequential. I traverse from the head while maintaining the minimum state needed by the operation. If I need to mutate the structure, I usually track both the current node and its predecessor. For middle or kth-from-end problems, I use slow/fast pointers. I define boundary conventions explicitly and analyze complexity based on the references already available.”

---

# 34. Revision Checklist

- [ ] Can I search by value?
- [ ] Can I return the first or last matching node?
- [ ] Can I find a node by index?
- [ ] Can I find its predecessor?
- [ ] Can I find the first and second middle nodes?
- [ ] Can I find the kth node from the end?
- [ ] Can I search with a predicate?
- [ ] Can I combine search and mutation in one pass?
- [ ] Can I explain why binary search is usually unsuitable for linked lists?
- [ ] Can I exploit bidirectional traversal in a doubly linked list?
- [ ] Can I make traversal cycle-aware when necessary?
- [ ] Can I analyze complexity based on known node references?
- [ ] Can I choose an array or Map instead when linked-list traversal is a poor fit?

# Key Takeaways

1. Linked-list search is normally sequential traversal.
2. Position-based access costs traversal because there is no normal O(1) indexing.
3. Predecessor information is essential for many singly linked-list mutations.
4. Slow/fast pointers solve important positional problems in O(N) time and O(1) extra space.
5. Sorted order can enable early termination but does not normally provide practical O(log N) binary search.
6. Complexity depends on what references are already known.
7. One-pass algorithms can combine searching with the structural information required for mutation.
8. Cycle awareness is valuable for defensive diagnostics and untrusted structures.
9. Linked lists should be selected based on workload and access patterns, not habit.
10. Correct search reasoning prepares the foundation for advanced linked-list algorithms.
