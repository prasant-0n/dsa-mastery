# 10.08 — Heap & Top-K Patterns: Selection, Streaming & Priority-Based Reasoning

## 1. Objective

Heap-based patterns maintain only the most relevant candidates instead of fully sorting all input.

Core transformation:

```text
need global ordering?
→ sort

need only best K / next priority?
→ maintain bounded heap
```

## 2. Why It Exists

Sorting `N` items costs `O(N log N)` even when the problem needs only a small number `K` of extreme elements.

A heap can often reduce selection to approximately:

```text
O(N log K)
```

when `K << N`.

## 3. Heap Mental Model

A heap maintains a root with the highest priority according to its ordering.

It does **not** maintain all elements in globally sorted order.

## 4. Min-Heap vs Max-Heap

Use a min-heap when the smallest retained candidate should be removed first.

Use a max-heap when the largest retained candidate should be removed first.

For top-K largest:

```text
min-heap of size K
```

The root is the weakest retained candidate.

## 5. Top-K Pattern

Process each item:

```text
insert candidate
if heap size > K:
    remove weakest candidate
```

At the end, the heap contains the K strongest candidates under the comparator.

## 6. Why Bounded Heaps Work

Once K candidates are retained, an incoming candidate weaker than the current threshold cannot belong to the final top K.

The root acts as a dynamic threshold.

## 7. Top-K Smallest

Reverse the heap orientation:

```text
max-heap of size K
```

The root is the largest retained candidate and is removed when a smaller candidate arrives.

## 8. Kth Largest / Smallest

The root of a bounded heap can represent the Kth boundary after processing all values.

This turns order-statistic problems into streaming selection.

## 9. Streaming Data

A heap is especially useful when the complete input is not stored.

Maintain only the required frontier while records arrive.

Memory can remain `O(K)` instead of `O(N)`.

## 10. Comparator Design

Heap correctness depends on a consistent priority relation.

For objects, define:

```text
record → key → comparator
```

Tie-breaking should be deterministic when output ordering matters.

## 11. Heap Operations

Typical binary heap operations:

```text
peek → O(1)
insert → O(log N)
extract → O(log N)
```

Building a heap from an array can be `O(N)` with bottom-up heapify.

## 12. Top-K Complexity

For `N` inputs and bounded heap size `K`:

```text
Time: O(N log K)
Space: O(K)
```

If the final heap must be sorted, add the cost of ordering the K results.

## 13. Heapify vs Repeated Insert

Bottom-up heap construction is linear because most nodes are near the leaves and require little downward movement.

Repeated insertion is typically `O(N log N)`.

Choose based on whether all input is available at construction time.

## 14. K-Way Merge

When K sorted sequences must be merged, keep one current item from each sequence in a min-heap.

Each extraction advances one source.

For total elements `T`:

```text
O(T log K)
```

## 15. Merge K Sorted Streams

The same idea works for streaming sources when each source exposes its next ordered item.

The heap stores only one frontier item per source.

## 16. Two Sorted Streams

A heap is unnecessary when only two sorted sequences are merged; two pointers are simpler.

This illustrates an important rule:

> Use the smallest data structure that matches the number of competing frontiers.

## 17. Median of a Stream

Maintain two heaps:

```text
max-heap → lower half
min-heap → upper half
```

Balance their sizes and ordering to obtain the median efficiently.

## 18. Running Median Invariant

A typical invariant is:

```text
all lower-half values ≤ all upper-half values
size difference ≤ 1
```

The exact size convention must be defined.

## 19. Priority Scheduling

A heap naturally represents a changing priority frontier.

Applications include:

- job scheduling;
- event processing;
- shortest-path exploration;
- retry queues;
- deadline management.

## 20. Dynamic Priorities

If an item's priority changes, options include:

- decrease/increase-key with an indexed heap;
- lazy invalidation and reinsertion;
- rebuilding.

The right strategy depends on update frequency and implementation complexity.

## 21. Lazy Deletion

When arbitrary deletion is expensive, mark entries stale and discard them when they reach the root.

The heap may contain obsolete records, so correctness requires validating the root before consuming it.

## 22. Top-K Frequent

Combine:

```text
frequency map + bounded heap
```

First aggregate frequencies, then retain only the required K highest-frequency keys.

## 23. Top-K by Custom Score

The score may be:

- numeric;
- composite;
- dynamically computed;
- deterministic tie-broken.

Be explicit about whether score computation is `O(1)` or expensive.

## 24. Heap + Hash Map

An indexed or lazy heap can be paired with a map for:

- record lookup;
- frequency tracking;
- active/stale status;
- priority updates.

The map and heap must remain semantically consistent.

## 25. Heap + Binary Search

A feasibility algorithm can sometimes use a heap internally while an outer binary search chooses a candidate answer.

Analyze both layers:

```text
O(log R × heap-based feasibility cost)
```

## 26. Heap + Graph Search

Dijkstra-like algorithms repeatedly extract the smallest tentative distance.

The heap maintains the next frontier candidate; correctness depends on the graph weight assumptions and relaxation invariant.

## 27. Heap vs Sorting

Use sorting when:

- complete order is required;
- deterministic ordered output dominates;
- K is close to N.

Use a heap when:

- only a small frontier matters;
- data is streaming;
- priorities change over time.

These are workload-based trade-offs, not absolute rules.

## 28. Heap vs Quickselect

Quickselect can find a Kth boundary in expected linear time without maintaining a heap, but it has different mutation, worst-case, streaming, and implementation characteristics.

The choice depends on the workload and guarantees required.

## 29. Backend Applications

Heap patterns appear in:

- priority job queues;
- top-K API results;
- connection scheduling;
- retry systems;
- event ordering;
- alert prioritization;
- streaming analytics.

## 30. AI Applications

Common uses include:

- top-K retrieval;
- candidate ranking;
- beam-style frontier management;
- nearest-candidate selection;
- streaming inference priorities;
- approximate search frontiers.

## 31. Correctness Invariants

### Bounded Top-K Heap

> The heap contains the strongest K processed candidates, or all processed candidates when fewer than K exist.

### K-Way Merge

> The heap contains the smallest unconsumed item from every non-exhausted source.

### Running Median

> The two heaps partition the processed values into ordered lower and upper halves with the required size balance.

## 32. Common Mistakes

1. Using the wrong heap orientation.
2. Assuming a heap is globally sorted.
3. Forgetting final output ordering requirements.
4. Ignoring comparator tie-breaking.
5. Mishandling stale entries under lazy deletion.
6. Claiming `O(N log K)` without confirming heap size stays bounded by K.
7. Rebuilding expensive scores unnecessarily.
8. Using a heap where two pointers are sufficient.

## 33. Edge Cases

Test:

- `K = 0`;
- `K = 1`;
- `K > N`;
- empty input;
- duplicate values;
- equal priorities;
- negative values;
- stale heap entries;
- empty streams;
- one source in K-way merge.

## 34. Interview Framework

When top-K or priority processing appears:

```text
1. Do I need complete sorting?
2. What is K relative to N?
3. Can I maintain a bounded frontier?
4. Which heap orientation makes the root the discard threshold?
5. Is input streaming?
6. Are priorities static or changing?
7. Do I need stable/deterministic ties?
8. What invariant does the heap maintain?
9. What is the true heap size?
10. What are preprocessing and output-order costs?
```

## 35. Revision Checklist

- [ ] I can derive top-K largest/smallest heaps.
- [ ] I can explain why the heap remains bounded.
- [ ] I understand heapify complexity.
- [ ] I can solve K-way merge.
- [ ] I understand running median.
- [ ] I understand lazy deletion.
- [ ] I can reason about dynamic priorities.
- [ ] I can compare heap, sorting, and selection.
- [ ] I can analyze comparator and score costs.
- [ ] I can apply heaps to backend and AI systems.

## 36. Key Takeaways

1. **Heap patterns maintain a priority frontier rather than globally ordering all data.**
2. **Top-K problems often become `O(N log K)` by maintaining a heap bounded by K.**
3. **The heap orientation should make the root the candidate that should be discarded when the bound is exceeded.**
4. **Streaming, dynamic priority, and K-way frontier problems are natural heap workloads.**
5. **Sorting, heaps, and selection algorithms solve related problems under different workload and guarantee assumptions.**
