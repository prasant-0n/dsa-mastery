# 05.07 — Linked List Merging, Splitting & Partitioning

## Purpose

Many real linked-list algorithms do more than insert or delete one node. They combine lists, divide one list into independent segments, or rearrange nodes around a condition.

These operations are fundamentally about **boundary management and ownership**.

> When lists are merged or split, correctness means preserving every intended node exactly once and establishing the correct boundary edges.

---

# 1. Merge vs Concatenate

Two operations are often confused.

### Concatenation

```text
A → B → null

C → D → null
```

becomes:

```text
A → B → C → D → null
```

No ordering comparison is required.

### Sorted merge

Given:

```text
1 → 4 → 8
2 → 3 → 9
```

produce:

```text
1 → 2 → 3 → 4 → 8 → 9
```

Sorted merge must compare node values.

---

# 2. Concatenating Lists

If the first list's tail is already known:

```js
tailA.next = headB;
```

The pointer operation itself is O(1).

If the tail is not known, finding it costs O(N).

This is an important example of how stored metadata changes operation complexity.

---

# 3. Empty-List Cases

Concatenation must define:

```text
A + empty
empty + B
empty + empty
```

For a list abstraction with head/tail/size, these cases also require correct metadata updates.

---

# 4. Destructive vs Non-Destructive Merge

A destructive merge reuses existing nodes:

```text
A → B
C → D
```

and rewires them into one structure.

A non-destructive merge constructs new nodes and leaves the originals unchanged.

Trade-off:

```text
in-place:    O(N+M) time, O(1) auxiliary space
reconstruct: O(N+M) time, O(N+M) new-node space
```

---

# 5. Sorted Merge Mental Model

Maintain:

```text
result tail
currentA
currentB
```

At each step, select the smaller current node and attach it to the result.

Conceptually:

```text
result → ... → tail
                  ↑
             chosen node
```

Then advance only the source list from which the node was selected.

---

# 6. Dummy Node for Merge

A dummy node makes the first insertion behave like every later insertion:

```text
dummy → result...
   ↑
 resultTail
```

At the end:

```text
head = dummy.next
```

The dummy is an algorithmic sentinel, not part of the returned data structure.

---

# 7. Stable Sorted Merge

If values are equal:

```text
A(5) and B(5)
```

choose one consistently, commonly the node from A first.

This preserves a defined ordering among equal-valued elements and makes the merge stable.

Stability can matter when nodes carry secondary metadata.

---

# 8. Complexity of Sorted Merge

If lists contain N and M nodes:

```text
Time:  O(N + M)
Space: O(1) auxiliary
```

assuming nodes are reused and the lists are acyclic.

Every node is examined and attached at most once.

---

# 9. Splitting a List

Given:

```text
A → B → C → D → E
```

split after C:

```text
A → B → C → null
D → E → null
```

The key operation is:

```js
C.next = null;
```

But a production list abstraction must also update both lists' metadata.

---

# 10. Split by Index

For a zero-based split index `k`:

```text
left  = positions [0, k)
right = positions [k, N)
```

For example, splitting `[A,B,C,D]` at `2` produces:

```text
A → B
C → D
```

The boundary convention must be explicit.

---

# 11. Split at the Middle

The slow/fast pointer technique can find the midpoint without first calculating length.

A common strategy uses:

```text
slow → one step
fast → two steps
```

Then detach the two halves at the chosen boundary.

The exact half sizes depend on whether the specification favors the first or second middle.

---

# 12. Split Into Odd and Even Positions

Given:

```text
A B C D E F
```

split by position parity:

```text
A C E
B D F
```

This can be done in one traversal by maintaining two result chains.

Again, this is a stable partition by position rather than by value.

---

# 13. Partition Around a Value

Given:

```text
3 → 5 → 8 → 5 → 10 → 2
```

partition around `5` can produce:

```text
3 → 2 → 5 → 8 → 5 → 10
```

depending on the chosen specification.

A common requirement is:

```text
values < pivot
then values >= pivot
```

while preserving relative order inside each group.

---

# 14. Stable Partition

Stable partition preserves the original order within each category.

Example:

```text
4 → 2 → 5 → 1 → 3
```

partition `< 4` gives:

```text
2 → 1 → 4 → 5 → 3
```

The relative order of `2,1` and `4,5,3` is preserved.

---

# 15. Two-Chain Partition

Maintain two chains:

```text
lessHead → lessTail
otherHead → otherTail
```

For each node:

```text
detach node
append to appropriate chain
```

Finally:

```text
lessTail.next = otherHead
```

This is a reusable pattern for linked-list partitioning.

---

# 16. Why Detaching Is Important

When moving a node between chains, explicitly detach it before reusing it:

```js
const next = current.next;
current.next = null;
// append current
current = next;
```

This prevents stale edges from accidentally connecting unrelated regions or creating cycles.

---

# 17. Three-Way Partition

Some problems require:

```text
< pivot
== pivot
> pivot
```

Maintain three chains and concatenate them afterward.

This is conceptually similar to three-way partitioning used in sorting algorithms.

---

# 18. Partition Without Creating Nodes

Partitioning can be performed by rewiring existing nodes.

Advantages:

```text
O(N) time
O(1) auxiliary space
preserves node identity
```

But mutation affects aliases, so the ownership contract must be clear.

---

# 19. Merge Multiple Sorted Lists

For more than two sorted linked lists, several strategies exist.

### Sequential merge

Merge list 1 with list 2, then merge the result with list 3, and so on.

### Divide and conquer

Pair lists and merge recursively:

```text
k lists
 ↓
merge pairs
 ↓
merge results
 ↓
continue
```

### Heap-based merge

Store the current node from each list in a min-heap.

The heap approach gives:

```text
O(T log K)
```

for T total nodes across K lists.

---

# 20. Merge K Lists With a Heap

At any moment, the heap contains at most one active node per input list.

Process:

```text
extract smallest
→ append node
→ insert its successor
```

Complexity:

```text
Time:  O(T log K)
Space: O(K)
```

assuming node references are reused.

This is an important bridge from linked lists to priority queues.

---

# 21. Divide-and-Conquer K-Way Merge

Pairwise merging can also achieve:

```text
O(T log K)
```

when the merge tree is balanced.

The benefit is that it avoids maintaining a heap, while the trade-off is more explicit recursive/iterative merge scheduling.

---

# 22. Intersection and Merge Safety

Never merge lists blindly if they may already share nodes.

Example:

```text
A → C → D
B → C → D
```

Naively connecting tails can create unexpected cycles or duplicate reachability.

Before destructive combination, define whether input lists are guaranteed disjoint.

---

# 23. Split and Ownership

After splitting:

```text
original owner
```

may become:

```text
owner A
owner B
```

A clean API should specify whether the original list remains valid, becomes empty, or transfers ownership to the returned lists.

This is especially important when external references exist.

---

# 24. Reverse Then Merge

A useful composite operation is:

```text
reverse list A
merge A and B
```

The important engineering principle is to analyze each transformation's preconditions and postconditions before composing them.

Do not assume an operation remains valid merely because each component is valid independently.

---

# 25. Backend Applications

Linked-list merging and partitioning concepts appear in:

- merging ordered work queues;
- LRU/eviction-list manipulation;
- batching and queue splitting;
- stream-processing partitions;
- ordered in-memory indexes;
- scheduling structures.

For production systems, standard collections are often preferable unless pointer-level control provides a real benefit.

---

# 26. AI Applications

These patterns can help model:

- candidate-chain merging;
- ordered search-frontier structures;
- partitioning candidate states by score/constraint;
- combining sorted result streams.

In practical AI systems, heap, array, graph, and indexed structures often provide better locality and access patterns than raw linked lists.

---

# 27. Common Mistakes

1. Losing the successor during partitioning.
2. Forgetting to terminate the final chain.
3. Creating cycles when concatenating shared structures.
4. Forgetting empty-list cases.
5. Breaking stable ordering unintentionally.
6. Confusing split index conventions.
7. Ignoring tail and size metadata.
8. Allocating new nodes when in-place rewiring was required.
9. Reusing nodes without considering aliases.
10. Applying two-list merge logic to potentially intersecting inputs.

---

# 28. Edge Cases

Test:

```text
empty + empty
empty + non-empty
single-node lists
all values equal
already sorted lists
reverse-sorted lists
duplicate values
pivot smaller than all
pivot larger than all
all values equal pivot
split at 0
split at length
split at middle
odd length
 even length
shared nodes
cycle input
K = 1
K > number of lists
```

---

# 29. Complexity Summary

| Operation | Time | Extra Space |
|---|---:|---:|
| Concatenate with known tail | O(1) | O(1) |
| Concatenate without tail | O(N) | O(1) |
| Sorted merge of 2 lists | O(N+M) | O(1) |
| Split by index | O(N) worst | O(1) |
| Stable partition | O(N) | O(1) |
| Three-way partition | O(N) | O(1) |
| Merge K sorted lists with heap | O(T log K) | O(K) |
| Merge K sorted lists divide/conquer | O(T log K) | implementation-dependent |

---

# 30. Design Procedure

```text
1. Define ownership and mutation semantics.
2. Determine whether inputs may share nodes.
3. Define ordering/stability requirements.
4. Define split boundaries precisely.
5. Identify all chain heads and tails needed.
6. Save successors before rewiring.
7. Detach moved nodes when necessary.
8. Reconnect boundaries explicitly.
9. Update metadata.
10. Verify every intended node is reachable exactly once.
11. Check termination / cycle invariants.
12. Derive complexity from actual traversal and auxiliary structures.
```

---

# 31. Interview Explanation Template

> “For linked-list merging or partitioning, I focus on boundary ownership. I maintain the smallest number of head/tail references needed for each output chain, save each node's successor before rewiring, detach nodes when moving them between chains, and reconnect the final boundaries explicitly. For sorted merge I process each input node once, giving O(N+M) time and O(1) auxiliary space. For K sorted lists, a heap or balanced divide-and-conquer merge gives O(T log K).”

---

# 32. Revision Checklist

- [ ] Can I concatenate two lists with known tails?
- [ ] Can I merge two sorted lists stably?
- [ ] Can I split a list at an index?
- [ ] Can I split a list around its middle?
- [ ] Can I partition by a pivot while preserving order?
- [ ] Can I perform three-way partitioning?
- [ ] Can I explain why nodes should be detached before moving them?
- [ ] Can I merge K sorted lists with a heap?
- [ ] Can I merge K lists with divide and conquer?
- [ ] Can I detect dangerous shared-node inputs before destructive merging?
- [ ] Can I preserve head/tail/size invariants?
- [ ] Can I reason about ownership and aliasing after a split?

# Key Takeaways

1. Merging, splitting, and partitioning are boundary-management problems.
2. Known tail metadata can turn concatenation into O(1).
3. Two sorted lists can be merged in O(N+M) time and O(1) auxiliary space.
4. Dummy nodes simplify output-chain construction.
5. Stable partitioning preserves relative order within groups.
6. Detaching nodes before moving them prevents stale-edge bugs and cycles.
7. K-way merge connects linked lists with heaps and divide-and-conquer scheduling.
8. Shared nodes make destructive merging dangerous.
9. Ownership and metadata are part of structural correctness.
10. Always verify reachability, termination, and node identity after structural composition.
