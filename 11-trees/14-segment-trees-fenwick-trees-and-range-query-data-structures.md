# 11.14 — Segment Trees, Fenwick Trees & Range Query Data Structures

## 1. Objective

Range-query structures preprocess an array so repeated interval queries and point/range updates can be performed faster than rescanning the entire interval.

The central design question is:

```text
What associative information can summarize a range?
```

## 2. Prefix Sums as Baseline

For static range sums, prefix sums provide:

```text
query(l, r) = prefix[r + 1] - prefix[l]
```

Queries are `O(1)` after `O(N)` preprocessing, but arbitrary point updates require rebuilding or additional machinery.

## 3. Why Segment Trees Exist

A segment tree recursively partitions an array into intervals and stores an aggregate for each segment.

It supports both updates and queries efficiently.

## 4. Segment Tree Structure

Each node represents an interval:

```text
[left, right]
```

Its children represent approximately the left and right halves.

The tree has `O(N)` nodes under standard layouts.

## 5. Associative Operations

A segment tree naturally supports associative aggregation such as:

- sum;
- minimum;
- maximum;
- greatest common divisor;
- bitwise AND/OR/XOR.

Associativity allows child aggregates to be combined consistently.

## 6. Identity Element

A query implementation needs an identity value `e` satisfying:

```text
combine(e, x) = combine(x, e) = x
```

Examples:

```text
sum → 0
min  → +Infinity
max  → -Infinity
```

## 7. Point Update

A point update changes one leaf and recomputes all ancestors on its root path.

Complexity:

```text
O(log N)
```

## 8. Range Query

A query recursively classifies each segment as:

1. completely outside the requested range;
2. completely inside;
3. partially overlapping.

Only relevant segments are explored.

## 9. Query Complexity

A standard segment-tree range query visits `O(log N)` nodes for many boundary segments and can be bounded by `O(log N)` for a one-dimensional range aggregate under the usual recursive decomposition analysis.

The number of visited canonical segments is `O(log N)` and their combination is constant-time per segment for a scalar aggregate.

## 10. Segment Tree Build

Bottom-up construction can build all node aggregates in `O(N)` time.

Recursive construction also performs `O(N)` total node work.

## 11. Array-Based Segment Trees

A segment tree can be stored in an array rather than explicit node objects.

Depending on the layout:

```text
parent / child indices
```

are derived arithmetically.

This improves locality and reduces object overhead.

## 12. Fenwick Tree

A Fenwick Tree, or Binary Indexed Tree, stores partial prefix aggregates using a compact array representation.

It is especially useful for point updates and prefix/range sums.

## 13. Fenwick Lowbit

The central operation is:

```text
lowbit(i) = i & -i
```

It identifies the size of the responsibility interval represented by index `i` in the standard one-based formulation.

## 14. Fenwick Prefix Query

A prefix query repeatedly removes the lowest set bit:

```text
i -= i & -i
```

This takes `O(log N)` operations.

## 15. Fenwick Point Update

A point update repeatedly adds the lowest set bit:

```text
i += i & -i
```

It updates every stored prefix component that contains the position.

## 16. Range Sum with Fenwick

For sums:

```text
rangeSum(l, r) = prefixSum(r) - prefixSum(l - 1)
```

Thus point updates and range sums both cost `O(log N)`.

## 17. Fenwick vs Segment Tree

| Capability | Fenwick | Segment Tree |
|---|---|---|
| Point update | `O(log N)` | `O(log N)` |
| Prefix sum | `O(log N)` | `O(log N)` |
| Range sum | `O(log N)` | `O(log N)` |
| Range min/max | Limited/generalization-dependent | Natural |
| Range update | Specialized variants | Lazy propagation |
| Memory | `O(N)` compact | `O(N)` |

The right structure depends on the operation and update model.

## 18. Lazy Propagation

A lazy segment tree postpones applying a range update to descendants until necessary.

Each node stores a pending update that can later be pushed to children.

## 19. Range Update + Range Query

With lazy propagation, many combinations such as range addition + range sum can be supported in `O(log N)` per operation.

Correctness depends on applying and propagating lazy state in the correct order.

## 20. Lazy State Invariant

A node's aggregate must reflect all updates that logically apply to its represented interval, even if some updates have not yet been pushed to descendants.

## 21. Range Assignment

Range assignment is more complex than addition because a later assignment can overwrite earlier pending updates.

Lazy operations therefore require explicit composition rules.

## 22. Lazy Tag Composition

For multiple update types, define an algebra of tags:

```text
newTag ∘ oldTag
```

The order matters when operations are non-commutative.

## 23. Iterative Segment Trees

Iterative segment trees can represent leaves in a compact bottom-up array and process range queries using two moving boundaries.

They often reduce recursion overhead and can provide good locality.

## 24. Coordinate Compression

When queried coordinates are sparse or huge, compress the relevant coordinates into dense indices before building the structure.

Compression preserves ordering but not raw coordinate distance unless the algorithm explicitly accounts for gaps.

## 25. Merge Sort Tree

A merge sort tree stores sorted values in each segment-tree node. It can answer queries involving counts or binary searches inside ranges.

A typical query may cost `O(log² N)` due to visiting `O(log N)` nodes and searching within each node.

## 26. Persistent Segment Trees

A persistent segment tree keeps previous versions after updates using structural sharing.

An update creates only `O(log N)` new nodes in a standard point-update design.

## 27. Dynamic Segment Trees

When the coordinate domain is enormous but only a small number of positions are touched, dynamically allocate only visited nodes.

This is useful for sparse coordinate spaces.

## 28. Multidimensional Extensions

Two-dimensional segment trees and Fenwick trees can answer rectangle queries, but memory and implementation complexity increase significantly.

Alternative structures such as offline sweeps may be more efficient depending on the workload.

## 29. Offline Range Queries

If all queries are known in advance, an offline algorithm can reorder work to exploit sorting, prefix state, or other transformations.

Do not automatically use a dynamic tree when the workload is static.

## 30. Monoid Perspective

Segment-tree aggregation is naturally described using a monoid:

```text
(set, combine, identity)
```

Associativity enables hierarchical composition; identity handles empty query segments.

## 31. Non-Commutative Aggregates

Commutativity is not required, but query combination order must be preserved.

Examples include string concatenation or matrix multiplication.

## 32. Complexity

Standard structures provide:

```text
Segment tree build: O(N)
Point update: O(log N)
Range query: O(log N)
Range update with lazy propagation: O(log N)
Fenwick build: O(N) or O(N log N), depending on construction method
Fenwick update/query: O(log N)
```

Space is generally `O(N)`.

## 33. Correctness Proof

For a segment tree, prove each node stores the aggregate of exactly its interval. Then prove query decomposition partitions the requested interval into disjoint canonical segments.

For Fenwick Trees, prove each index stores the aggregate over its defined responsibility interval and that prefix traversal covers those intervals exactly once.

## 34. Common Mistakes

1. Mixing zero-based and one-based Fenwick indexing.
2. Using the wrong identity value.
3. Forgetting query segment order for non-commutative operations.
4. Applying lazy tags in the wrong composition order.
5. Forgetting to push lazy state before descending.
6. Confusing coordinate compression with preserving distances.
7. Allocating huge sparse segment trees unnecessarily.

## 35. Edge Cases

Test:

- empty array;
- one element;
- single-point query;
- full-range query;
- disjoint query;
- repeated updates;
- negative values;
- duplicate values;
- non-commutative aggregates;
- sparse coordinates;
- long update sequences.

## 36. Backend Applications

Range-query structures can support:

- time-series aggregation;
- leaderboard/ranking windows;
- analytics counters;
- scheduling intervals;
- dynamic metrics;
- inventory/range state queries.

## 37. AI Applications

They can support:

- dynamic feature statistics;
- sequence range aggregation;
- token-position statistics;
- attention-window metadata;
- dynamic search/ranking state;
- offline query acceleration.

## 38. Testing Strategy

Use:

- brute-force array reference queries;
- randomized update/query sequences;
- differential Fenwick-vs-array tests;
- differential segment-tree-vs-array tests;
- lazy propagation stress tests;
- non-commutative aggregate tests;
- persistent-version consistency tests.

## 39. Interview Framework

```text
1. Is the array static or dynamic?
2. What operation is being aggregated?
3. Is the operation associative?
4. What is the identity?
5. Are updates point-based or range-based?
6. Is Fenwick sufficient?
7. Do I need lazy propagation?
8. Is the aggregate commutative?
9. Can the problem be solved offline?
10. What are N, Q, memory, and coordinate constraints?
```

## 40. Revision Checklist

- [ ] I understand why segment trees exist.
- [ ] I can derive point updates.
- [ ] I can derive range queries.
- [ ] I understand monoid/identity requirements.
- [ ] I can implement a Fenwick Tree.
- [ ] I understand `lowbit`.
- [ ] I can compare Fenwick and segment trees.
- [ ] I understand lazy propagation.
- [ ] I understand persistent/dynamic variants.
- [ ] I can choose between online and offline approaches.

## 41. Key Takeaways

1. **Range-query structures trade preprocessing and memory for fast repeated interval operations.**
2. **Segment trees generalize naturally to many associative range aggregates and dynamic updates.**
3. **Fenwick Trees provide a compact specialized solution for prefix/range sums with point updates.**
4. **Lazy propagation turns many expensive range-update workloads into logarithmic operations by postponing work safely.**
5. **The algebra of the aggregate and update operations should be understood before choosing or designing the data structure.**
