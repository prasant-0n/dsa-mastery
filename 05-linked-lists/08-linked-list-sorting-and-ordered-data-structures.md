# 05.08 — Linked List Sorting & Ordered Data Structures

## Purpose

Sorting a linked list is not the same as sorting an array. Linked lists provide cheap pointer rewiring but poor random access, so the algorithm should exploit sequential traversal and node manipulation rather than repeatedly indexing into the structure.

The central idea is:

> **Use the structure's strengths: sequential access, node identity, and O(1) pointer rewiring at known boundaries.**

---

# 1. Why Sorting a Linked List Is Different

Arrays provide:

- O(1) random access;
- cache-friendly contiguous storage;
- efficient index-based partitioning.

Linked lists provide:

- O(1) insertion after a known node;
- O(1) deletion after a known predecessor;
- sequential traversal;
- flexible node ownership and rewiring.

Therefore, an algorithm that repeatedly requires random access can become inefficient on a linked list.

---

# 2. Sorting Goal

Given:

```text
4 → 1 → 7 → 2 → 5
```

produce:

```text
1 → 2 → 4 → 5 → 7
```

The important question is not merely whether values become ordered. We must also define whether the algorithm:

- mutates existing nodes;
- creates new nodes;
- is stable;
- preserves metadata;
- permits shared ownership.

---

# 3. Stable vs Unstable Sorting

A stable sort preserves the relative order of equal keys.

Suppose nodes contain:

```text
(5, A) → (2, X) → (5, B)
```

A stable ascending sort must produce:

```text
(2, X) → (5, A) → (5, B)
```

This matters when the key being sorted is only one field of a richer object.

---

# 4. Insertion Sort on a Linked List

Insertion sort fits linked lists naturally.

Process nodes one at a time and insert each node into its correct position in a sorted prefix.

Conceptually:

```text
sorted prefix | remaining nodes
```

For each node:

```text
remove from remaining
find insertion point
rewire into sorted prefix
```

---

# 5. Insertion Sort Complexity

For N nodes:

```text
Best case:    O(N)
Average case: O(N²)
Worst case:   O(N²)
Space:        O(1) auxiliary
```

The best case occurs when the input is already sorted and each node can be appended to the sorted region with minimal comparisons.

---

# 6. Merge Sort Is Usually the Natural Choice

Merge sort is particularly suitable for linked lists because:

1. splitting can be done with slow/fast pointers;
2. merging requires only sequential traversal;
3. nodes can be reused by pointer rewiring;
4. random access is unnecessary.

Typical complexity:

```text
Time:  O(N log N)
Auxiliary space: O(log N) for recursive implementation
```

An iterative bottom-up implementation can reduce recursion-stack usage.

---

# 7. Merge-Sort Structure

```text
            list
             │
          split
         /     \
       left    right
        │         │
      sort      sort
        │         │
         \       /
          merge
            │
         sorted
```

The merge operation from the previous chapter becomes a fundamental building block.

---

# 8. Splitting for Merge Sort

Use slow/fast pointers to locate a boundary near the middle.

Then detach:

```js
mid.next = null;
```

This produces two independent lists.

The split should guarantee progress: recursive calls must receive strictly smaller lists.

---

# 9. Recursive Merge Sort Base Case

A list with:

```text
0 nodes
```

or

```text
1 node
```

is already sorted.

Therefore:

```text
if head == null || head.next == null
    return head
```

This is both the correctness base case and the termination condition.

---

# 10. Bottom-Up Merge Sort

A linked list can also be sorted iteratively.

Start with runs of size 1:

```text
[4] [1] [7] [2] [5]
```

Then size 2:

```text
[1,4] [2,7] [5]
```

Then size 4, and so on.

This avoids recursive call-stack growth and can be useful in production implementations.

---

# 11. Comparator-Based Sorting

Production code should avoid assuming values are always primitive numbers.

Define a comparator:

```js
compare(a, b)
```

where:

```text
< 0 → a before b
= 0 → equivalent ordering key
> 0 → b before a
```

This makes the sorting algorithm reusable for objects, timestamps, priorities, and composite keys.

---

# 12. Sorting Objects

Example:

```text
Job(priority=3)
Job(priority=1)
Job(priority=2)
```

Sort by priority while preserving node identity.

For stable sorting, equal-priority jobs retain their original order.

This pattern is useful for ordered work queues and event processing.

---

# 13. Ordered Linked List

An ordered linked list maintains an invariant:

```text
node[i].key <= node[i+1].key
```

Every insertion must preserve that invariant.

A typical operation is:

```text
find insertion predecessor
rewire node
```

If the insertion position is already known, pointer mutation can be O(1). Finding it generally requires O(N).

---

# 14. Ordered Insert

Given:

```text
1 → 4 → 7
```

insert `5`:

```text
1 → 4 → 5 → 7
```

The algorithm searches until:

```text
current.key <= new.key
next.key > new.key
```

with special handling for insertion at the head.

---

# 15. Ordered Delete

To delete a node by key from an ordered list, traversal can stop once the current key exceeds the target.

Example:

```text
1 → 4 → 7 → 10
```

searching for `6` does not need to inspect `7` and everything after it once ordering is established.

This is an example of using a structural invariant to reduce unnecessary work.

---

# 16. Ordered List vs Binary Search

A common mistake is to think a sorted linked list automatically supports efficient binary search.

It does not.

Binary search requires efficient access to the middle element. Finding the middle of a linked list costs traversal.

Repeated midpoint traversal can lead to O(N log N)-scale pointer work rather than the O(log N) access pattern expected from an array.

The ordering is useful for early termination, but not enough to provide array-like random access.

---

# 17. Maintaining a Tail

If an ordered list frequently receives maximum-valued elements, maintaining a tail pointer can make appending those elements O(1) once the insertion position is known.

Metadata is part of data-structure design, not merely bookkeeping.

---

# 18. Node Identity vs Value Reconstruction

Two implementations may produce the same values:

```text
1 → 2 → 3
```

but differ semantically.

### Node rewiring

Existing nodes are rearranged.

Advantages:

- preserves node identity;
- avoids allocating replacement nodes;
- O(1) auxiliary space for suitable algorithms.

### Reconstruction

New nodes are allocated.

Advantages:

- original structure remains untouched;
- ownership is simpler in some APIs.

Trade-off:

```text
more allocations
more memory
identity is not preserved
```

---

# 19. Duplicate Keys

Duplicate handling must be explicit.

For stable insertion, decide whether a new equal key goes:

```text
before existing equals
```

or:

```text
after existing equals
```

Choosing insertion-after-equals is a common strategy for preserving stable order.

---

# 20. Nearly Sorted Lists

Insertion sort can be attractive when a linked list is nearly sorted because each node may require little movement.

This is a broader engineering lesson:

> Asymptotic complexity is not the only input. Data distribution matters.

Benchmarking should validate whether a theoretically slower algorithm performs better for the actual workload.

---

# 21. Fully Sorted Input

A good implementation should recognize that already sorted input is favorable for several algorithms.

For insertion sort:

```text
current node belongs at the end of the sorted prefix
```

For merge sort, the asymptotic bound remains O(N log N), although implementation details and constants still matter.

---

# 22. Cycles and Sorting

A cyclic linked list is not a valid input to ordinary linear sorting algorithms.

Example:

```text
A → B → C
    ↑   │
    └───┘
```

Traversal may never terminate.

A production API should either:

- reject cyclic input;
- document that input must be acyclic;
- or provide a cycle-aware normalization step.

---

# 23. Shared Nodes and Sorting

Sorting a list destructively can affect every alias pointing into the same node chain.

If:

```text
headA ─┐
       ├→ shared nodes
headB ─┘
```

sorting through `headA` can change what `headB` observes.

Ownership contracts therefore matter before destructive sorting.

---

# 24. Ordered Data Structures Beyond Basic Lists

An ordered linked list can model:

- priority-ordered work;
- timestamp-ordered events;
- ranked candidates;
- scheduled tasks;
- ordered cache entries.

However, once efficient arbitrary insertion/search becomes important, balanced trees, heaps, skip lists, or indexed structures may be more appropriate.

---

# 25. Linked List vs Heap

A sorted linked list maintains a complete ordering.

A heap maintains only the ordering needed to identify the minimum or maximum efficiently.

For repeated priority operations:

```text
linked list: find insertion point O(N)
heap:        insert O(log N), extract-min/max O(log N)
```

Choosing between them depends on the operation mix.

---

# 26. Linked List vs Balanced Tree

A linked list is sequential.

A balanced search tree can support approximately:

```text
search:  O(log N)
insert:  O(log N)
delete:  O(log N)
```

while a linked list generally requires O(N) search.

Therefore, ordered data should not automatically imply a linked list.

---

# 27. Backend Applications

Sorting and ordered-list concepts appear in:

- priority queues;
- job scheduling;
- event ordering;
- cache eviction policies;
- ordered processing pipelines;
- merge pipelines for database-like streams;
- maintaining small ordered in-memory collections.

In high-throughput services, heaps or indexed structures are often preferable when priorities change frequently.

---

# 28. AI Applications

Potential applications include:

- ranking candidate states;
- ordered beam-search candidates;
- sorted retrieval results;
- priority-based task queues;
- merging ranked result streams.

For large AI workloads, heaps, arrays, trees, and specialized priority structures generally provide better locality and scalability.

---

# 29. Common Mistakes

1. Using array-style indexing assumptions.
2. Forgetting to detach split boundaries.
3. Losing the successor during node movement.
4. Breaking stable ordering among duplicates.
5. Recursing without shrinking the input.
6. Sorting a cyclic list without validation.
7. Ignoring external aliases during destructive sorting.
8. Allocating new nodes unnecessarily.
9. Forgetting comparator semantics.
10. Choosing a linked list when a heap or tree better matches the workload.

---

# 30. Complexity Summary

| Operation | Time | Extra Space |
|---|---:|---:|
| Ordered search | O(N) worst | O(1) |
| Ordered insert | O(N) | O(1) |
| Ordered delete by key | O(N) | O(1) |
| Insertion sort, best | O(N) | O(1) |
| Insertion sort, average/worst | O(N²) | O(1) |
| Merge sort | O(N log N) | O(log N) recursive stack |
| Bottom-up merge sort | O(N log N) | O(1) auxiliary |
| Merge two sorted lists | O(N+M) | O(1) |

---

# 31. Algorithm Selection Framework

```text
Need sorting?
   │
   ├─ nearly sorted / small input → consider insertion sort
   │
   ├─ general linked-list sorting → merge sort
   │
   ├─ repeated min/max priority operations → heap
   │
   ├─ fast key lookup + ordered traversal → tree/index
   │
   └─ simple sequential ordering → ordered list
```

The data structure and workload should determine the algorithm, not familiarity alone.

---

# 32. Interview Explanation Template

> “For linked-list sorting, I avoid algorithms that depend heavily on random access. Merge sort is a natural fit because I can split with slow/fast pointers and merge sequentially by rewiring nodes. It runs in O(N log N) time. A recursive implementation uses O(log N) call-stack space, while a bottom-up implementation can use O(1) auxiliary space. For nearly sorted data, insertion sort can be competitive and has O(N) best-case behavior.”

---

# 33. Revision Checklist

- [ ] Can I explain why merge sort fits linked lists?
- [ ] Can I implement linked-list insertion sort?
- [ ] Can I implement recursive merge sort?
- [ ] Can I explain bottom-up merge sort?
- [ ] Can I preserve node identity while sorting?
- [ ] Can I implement comparator-based ordering?
- [ ] Can I maintain stable duplicate ordering?
- [ ] Can I maintain ordered-list invariants?
- [ ] Can I explain why binary search is not naturally efficient on linked lists?
- [ ] Can I compare linked lists, heaps, and balanced trees for ordered workloads?
- [ ] Can I reason about cycles and shared-node ownership?
- [ ] Can I choose an algorithm based on workload rather than habit?

# Key Takeaways

1. Linked lists favor sequential algorithms and pointer rewiring.
2. Merge sort is usually the strongest general-purpose linked-list sorting strategy.
3. Insertion sort is useful for small or nearly sorted lists.
4. Stable sorting preserves the relative order of equal keys.
5. Comparator-based design makes ordered structures reusable.
6. A sorted linked list does not provide efficient binary search.
7. Node identity, ownership, and aliasing are part of correctness.
8. Cyclic input must be rejected or handled explicitly.
9. Heaps and trees can outperform linked lists for different ordered workloads.
10. Algorithm selection should follow the workload's operation mix and constraints.
