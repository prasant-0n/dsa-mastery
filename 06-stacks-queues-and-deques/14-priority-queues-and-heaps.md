# 06.14 — Priority Queues & Heaps: Ordering Requirements to Efficient Scheduling

> **Phase 06 — Stacks, Queues & Deques**
>
> A priority queue is an ADT for repeatedly selecting the highest-priority element. A binary heap is one efficient implementation. This chapter derives the structure from the ordering requirement, then connects it to scheduling, shortest paths, streaming, backend systems, and AI search.

---

## 1. Learning Objectives

You will learn to:

- distinguish FIFO queues from priority queues;
- define priority and tie-breaking contracts;
- understand the heap as a complete binary tree;
- derive parent/child index formulas;
- implement min-heaps and max-heaps;
- understand sift-up and sift-down;
- derive O(log N) insertion and removal;
- understand O(N) heap construction;
- reason about stability and duplicate priorities;
- use heaps for top-K and scheduling problems;
- compare heaps with sorted arrays, balanced trees, and deques;
- design production priority schedulers.

---

## 2. Queue vs Priority Queue

FIFO queue:

```text
first arrival → first service
```

Priority queue:

```text
highest priority → first service
```

Arrival time matters only when the priority contract says it does.

Example:

```text
normal job A
urgent job B
normal job C
```

A FIFO queue produces:

```text
A → B → C
```

A priority queue may produce:

```text
B → A → C
```

The data structure must reflect the required ordering semantics.

---

## 3. Priority Must Be Explicit

Define:

```text
priority value
comparison direction
tie-breaking rule
```

For example:

```text
smaller number = higher priority
```

or:

```text
larger score = higher priority
```

Never rely on accidental JavaScript sorting behavior for a production scheduling contract.

---

## 4. Priority Queue ADT

Typical operations:

```text
insert(item)
peek()
extract()
size()
isEmpty()
```

Optional operations include:

```text
remove(item)
updatePriority(item)
decreaseKey(item)
increaseKey(item)
merge(other)
```

The optional operations strongly influence implementation choice.

---

## 5. Why a Sorted Array Is Not Always Enough

A sorted array can provide:

```text
peek → O(1)
```

but insertion may require shifting elements:

```text
O(N)
```

A binary heap trades constant-time arbitrary indexing for:

```text
peek    → O(1)
insert  → O(log N)
extract → O(log N)
```

This is often a better workload match.

---

## 6. Heap Mental Model

A binary heap is a complete binary tree satisfying a heap-order property.

Min-heap:

```text
parent <= children
```

Max-heap:

```text
parent >= children
```

Important:

> A heap is **not** fully sorted.

Only the root is guaranteed to be the global minimum or maximum.

---

## 7. Complete Binary Tree

Completeness means levels are filled from left to right.

Example:

```text
        2
      /   \
     5     7
    / \   /
   9   8 11
```

This shape allows the tree to be stored compactly in an array without explicit node pointers.

---

## 8. Array Representation

For zero-based indexing:

```text
parent(i) = floor((i - 1) / 2)
left(i)   = 2i + 1
right(i)  = 2i + 2
```

Children exist only when their indexes are within the heap size.

This representation gives excellent locality compared with pointer-based trees.

---

## 9. Heap Invariant

For a min-heap:

```text
heap[parent(i)] <= heap[i]
```

for every non-root node.

For a max-heap, reverse the comparison.

This local invariant is enough to guarantee that the root contains the global extremum.

---

## 10. Insert and Sift-Up

Insert at the end.

Then repeatedly compare with the parent:

```text
while child violates heap order
    swap(child, parent)
    child = parent
```

This is called:

```text
sift-up
bubble-up
percolate-up
```

The element moves at most the height of the heap.

Therefore insertion is O(log N).

---

## 11. Extract Root and Sift-Down

To remove the root:

```text
save root
move last element to root
remove last slot
sift down
```

Compare the node with its children and swap with the better child until the heap invariant is restored.

This takes O(log N).

---

## 12. Why Sift-Down Chooses the Better Child

For a min-heap, if both children violate the parent relationship, choose the smaller child.

Otherwise a larger child could remain above a smaller child and the root might cease to represent the minimum candidate.

The choice of child is part of correctness, not an implementation detail.

---

## 13. Build Heap

Given an arbitrary array, we can construct a heap by heapifying internal nodes from the last parent toward the root.

```text
for i = lastParent down to 0
    siftDown(i)
```

The total complexity is:

```text
O(N)
```

not O(N log N).

This is an important example where summing individual worst-case costs overestimates the total work.

---

## 14. Why Build-Heap Is O(N)

Nodes near the leaves have very small sift-down distances.

Only a few nodes are capable of moving through large heights.

The weighted sum of possible movement across all internal nodes is linear.

This is a classic algorithm-analysis result worth being able to explain in interviews.

---

## 15. Min-Heap vs Max-Heap

Min-heap:

```text
peek → smallest
extract → smallest
```

Max-heap:

```text
peek → largest
extract → largest
```

The implementation can usually be generalized using a comparator.

---

## 16. Comparator Design

A comparator should answer one question consistently:

> Should A appear above B in the heap?

For example:

```text
higherPriority(a, b) === true
```

Then all heap operations use the same rule.

Mixing comparator directions is a common source of subtle corruption.

---

## 17. Duplicate Priorities

Two jobs may have equal priority.

Possible tie-breakers:

```text
arrival time
sequence number
deadline
job ID
```

If deterministic order matters, attach a monotonic sequence number.

```text
(priority, sequence)
```

This creates explicit stable ordering without requiring the heap itself to be stable.

---

## 18. Stability

A standard binary heap is not inherently stable.

If equal-priority elements must preserve insertion order, encode that requirement into the comparator.

Example:

```text
higher priority first
then smaller sequence number
```

The data structure remains a heap; stability becomes part of the item ordering.

---

## 19. Complexity Table

| Operation | Binary Heap |
|---|---:|
| Peek | O(1) |
| Insert | O(log N) |
| Extract root | O(log N) |
| Build heap | O(N) |
| Search arbitrary value | O(N) |
| Delete known index | O(log N) |

The last two matter: a heap is optimized for extremum access, not arbitrary search.

---

## 20. Search Is Not O(log N)

The heap invariant does not fully order all nodes.

Searching for an arbitrary value may require examining many nodes.

Therefore:

```text
heap.find(x) → O(N)
```

in the general case.

This is a frequent interview trap.

---

## 21. Top-K Problems

A heap is often useful when you need only K elements rather than a complete sort.

For example, to keep the K largest values:

```text
maintain min-heap of size K
if new value > root
    replace root
```

Complexity:

```text
O(N log K)
```

with O(K) auxiliary space.

This can outperform O(N log N) full sorting when K is small relative to N.

---

## 22. K-Way Merge

Given K sorted sequences, keep one current item from each sequence in a min-heap.

Repeatedly:

```text
extract smallest
advance that sequence
insert next item
```

For T total items:

```text
O(T log K)
```

This pattern appears in external sorting, log merging, and multi-source data processing.

---

## 23. Dijkstra

Dijkstra repeatedly needs the currently smallest tentative distance.

A min-priority queue provides this operation.

With a binary heap and adjacency list, the common implementation is:

```text
O((V + E) log V)
```

depending on implementation details and graph assumptions.

The key point is the algorithm's need for repeated global minimum selection.

---

## 24. Best-First and A*

Best-first search chooses the most promising frontier state.

A* commonly prioritizes:

```text
f(n) = g(n) + h(n)
```

where:

```text
g(n) = cost so far
h(n) = estimated remaining cost
```

The heap manages this frontier ordering.

---

## 25. Backend Scheduling

Priority queues can schedule:

```text
urgent jobs
nearest deadlines
high-value requests
retries
maintenance tasks
```

A production scheduler often uses a composite priority:

```text
(priority, deadline, sequence)
```

rather than a single integer.

---

## 26. Deadline Scheduling

A deadline scheduler may prioritize the earliest deadline:

```text
smaller deadline → higher priority
```

But deadlines alone can cause starvation of jobs without near-term deadlines.

Production policy may therefore combine:

```text
deadline
age
priority
tenant fairness
```

The algorithm should match the business contract.

---

## 27. Priority Inversion

A low-priority task can indirectly delay a high-priority task by holding a resource required by it.

A priority queue cannot solve this alone.

System-level mechanisms may be required, such as priority inheritance or resource-aware scheduling.

This illustrates the boundary between a data structure and a concurrency architecture.

---

## 28. Delayed Work

A heap ordered by `nextRunAt` is useful for delayed jobs:

```text
root = earliest runnable time
```

Workers can inspect the root and wait until it becomes eligible.

This can support retry scheduling, timers, and background jobs.

A durable production scheduler still needs persistence and crash recovery.

---

## 29. Rate-Limit Scheduling

Suppose requests have:

```text
nextAllowedAt
```

A min-heap can select the request becoming eligible first.

This differs from a timestamp deque:

```text
deque → ordered sliding window
heap   → arbitrary scheduled eligibility times
```

Choose based on the ordering guarantee.

---

## 30. AI Inference Scheduling

An AI serving layer may rank requests by:

```text
latency deadline
model priority
tenant tier
batch compatibility
GPU utilization
```

A heap can maintain the next best candidate, but a real scheduler may need multiple queues or a more complex policy to avoid starvation.

---

## 31. Beam Search

Beam search retains only a limited number of promising states.

A bounded heap can maintain top candidates:

```text
capacity = beamWidth
```

When a new candidate is better than the worst retained candidate, replace the worst.

This is a direct bridge between top-K heap patterns and AI search.

---

## 32. Heap vs Deque Decision

Use a deque when the ordering is structurally restricted:

```text
0/1 transitions
monotonic window candidates
```

Use a heap when priorities are arbitrary:

```text
job scores
deadlines
estimated costs
A* scores
```

A specialized deque can be faster, but only when its invariant is valid.

---

## 33. Heap vs Sorted Array

| Requirement | Heap | Sorted Array |
|---|---:|---:|
| Peek extremum | O(1) | O(1) |
| Insert | O(log N) | O(N) |
| Extract extremum | O(log N) | O(1) if end is used |
| Arbitrary search | O(N) | O(log N) |
| Full sorted traversal | O(N log N) | O(N) |

The workload determines the better structure.

---

## 34. Memory and Locality

Binary heaps use contiguous arrays.

Advantages include:

```text
low structural overhead
cache-friendly access
no explicit tree nodes
simple memory management
```

This is often preferable to pointer-heavy priority structures for ordinary workloads.

---

## 35. JavaScript Engineering

A production heap implementation should define:

```text
empty extraction behavior
invalid comparator behavior
capacity policy
duplicate semantics
mutation ownership
```

Avoid silently accepting malformed priority values if they can corrupt ordering assumptions.

If the heap stores objects, define whether the comparator reads immutable priority fields or supports explicit priority updates.

---

## 36. Priority Updates

Changing an item's priority without repairing its heap position can invalidate the heap.

Options include:

```text
decrease/increase key + known index
remove + reinsert
lazy invalidation with version numbers
```

Lazy invalidation is often simpler for application schedulers, but stale entries increase memory/work until removed.

---

## 37. Lazy Deletion

Instead of locating and deleting an arbitrary heap item:

```text
mark old version invalid
insert new version
```

When the old entry reaches the root, discard it.

This is common in graph algorithms and schedulers.

The implementation must ensure stale entries cannot produce incorrect results.

---

## 38. Correctness Invariant

For every heap index `i` except the root:

```text
better(parent(i), value(i)) === true
```

after every public mutation.

Every implementation technique—sift-up, sift-down, replacement, deletion—exists to restore this invariant.

---

## 39. Testing Strategy

Test:

```text
empty heap
single item
ascending input
descending input
all equal priorities
negative priorities
large values
mixed objects
repeated insert/extract
random operations
```

For every operation sequence, validate the heap invariant.

For randomized testing, compare extraction order against a simple reference model.

---

## 40. Benchmarking

Measure realistic workloads:

```text
many inserts
many extracts
mixed operations
large N
small K
duplicate priorities
priority updates
```

Compare against alternatives only under equivalent semantics.

A benchmark that changes the workload or correctness contract is not a useful comparison.

---

## 41. Interview Framework

When asked to implement a priority queue:

```text
1. Define priority semantics.
2. Choose min vs max.
3. Explain heap shape.
4. Derive array indexes.
5. State heap invariant.
6. Explain sift-up.
7. Explain sift-down.
8. Derive complexities.
9. Discuss duplicates/ties.
10. Discuss arbitrary deletion/update.
11. Compare alternatives.
12. State production failure modes.
```

---

## 42. Revision Checklist

- [ ] I can distinguish FIFO from priority ordering.
- [ ] I can define a priority comparator.
- [ ] I understand complete binary trees.
- [ ] I know heap array index formulas.
- [ ] I can implement min/max heap operations.
- [ ] I can prove sift-up and sift-down correctness.
- [ ] I understand O(N) build-heap.
- [ ] I know why arbitrary heap search is O(N).
- [ ] I understand duplicate and stable tie-breaking.
- [ ] I can solve top-K problems with heaps.
- [ ] I understand K-way merge.
- [ ] I can connect heaps to Dijkstra and A*.
- [ ] I can design backend priority scheduling.
- [ ] I understand lazy deletion and stale entries.
- [ ] I can choose between heap, deque, and sorted array.

---

## 43. Key Takeaways

1. A priority queue is an ordering ADT; a heap is one efficient implementation.
2. A binary heap guarantees only the root extremum, not global sorting.
3. Sift-up repairs insertion; sift-down repairs root removal and replacement.
4. Binary heap insertion and extraction are O(log N); peek is O(1).
5. Bottom-up heap construction is O(N).
6. Arbitrary search is generally O(N).
7. Explicit tie-breaking makes priority behavior deterministic.
8. Heaps are fundamental for top-K, K-way merge, shortest paths, scheduling, and AI search.
9. Lazy deletion is powerful but requires stale-state correctness.
10. Choose a heap when the algorithm needs arbitrary priority ordering; choose a deque only when a stronger structural invariant permits it.
