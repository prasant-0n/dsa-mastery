# 11.15 — Interval Trees, Range Trees & Spatial Search Structures

## 1. Objective

Spatial and interval structures organize data by one or more dimensions so queries can avoid scanning every item. They extend ordered-tree reasoning from single keys to ranges and geometric regions.

## 2. Interval Model

An interval is commonly represented as:

```text
[start, end]
```

The implementation must define whether endpoints are inclusive, exclusive, or mixed.

## 3. Interval Overlap

Two closed intervals `[a,b]` and `[c,d]` overlap when:

```text
a <= d && c <= b
```

for the closed-interval convention.

Endpoint semantics change this predicate.

## 4. Interval Tree Motivation

A normal BST ordered by interval start can still require scanning many intervals to find overlaps. An interval tree augments nodes with information about the maximum endpoint in their subtree.

## 5. Max-Endpoint Augmentation

For node `u`:

```text
maxEnd(u) = max(end(u), maxEnd(left), maxEnd(right))
```

This metadata allows subtrees that cannot overlap the query to be pruned.

## 6. Overlap Search

For query interval `Q`, inspect a node's interval. If it does not overlap, determine whether the left subtree could contain an overlap using its `maxEnd` value. Otherwise continue to the right according to the ordering invariant.

## 7. Reporting All Overlaps

Finding one overlap and reporting every overlap are different tasks. All-overlap queries must traverse every subtree that can still contain a candidate.

Complexity is output-sensitive.

## 8. Interval Tree Ordering

A common interval tree uses interval start as the BST key. Duplicate starts require an explicit secondary key or duplicate policy.

## 9. Metadata Maintenance

Insertion, deletion, and rotations must update `maxEnd` just like subtree-size metadata in an augmented balanced BST.

## 10. Balanced Interval Trees

An interval tree can use an AVL or Red-Black tree as its underlying balanced BST. The balancing mechanism and interval metadata are conceptually separate layers.

## 11. Correctness of Pruning

If a subtree's maximum endpoint is less than a query's lower bound under the chosen endpoint convention, no interval in that subtree can overlap the query.

This is the fundamental pruning invariant.

## 12. Point Queries

A point `x` can be represented as the degenerate interval `[x,x]` under closed semantics. Interval overlap then becomes point containment.

## 13. Scheduling Applications

Interval trees can efficiently locate:

- conflicting reservations;
- overlapping jobs;
- active maintenance windows;
- resource conflicts;
- time-window matches.

## 14. Range Trees

A range tree supports orthogonal range searching in multiple dimensions. A primary balanced tree is built on one coordinate, while associated secondary structures index another coordinate.

## 15. One-Dimensional Range Searching

A balanced ordered tree already supports interval/range queries by pruning branches outside the requested key interval.

Range trees become particularly useful as dimensionality increases.

## 16. Two-Dimensional Range Queries

For a query rectangle:

```text
x1 <= x <= x2
 y1 <= y <= y2
```

a range tree decomposes the x-range into canonical nodes and searches associated y-structures.

## 17. Canonical Decomposition

A range query is reduced to a small set of canonical subtrees whose union exactly represents the requested region.

This is analogous to segment-tree range decomposition.

## 18. Fractional Cascading

When multiple related sorted structures must be searched, fractional cascading can reduce repeated binary-search work by sharing navigation information.

It is an advanced optimization and increases implementation complexity and memory usage.

## 19. KD-Trees

A KD-tree recursively partitions points by alternating coordinate dimensions. Each node defines a spatial region and uses one coordinate as its splitting dimension.

## 20. KD-Tree Construction

A common construction chooses a splitting dimension and a median point. Median-based construction tends to produce balanced trees for suitable distributions.

## 21. KD-Tree Nearest Neighbor

Nearest-neighbor search maintains the best known distance and prunes subtrees whose bounding region cannot improve that best distance.

Correctness depends on a valid lower bound on possible distance inside the pruned region.

## 22. Bounding Regions

For each subtree, track a bounding box or derive it from ancestor splits. The minimum possible distance from the query point to that region determines whether pruning is safe.

## 23. Exact vs Approximate Spatial Search

Exact nearest-neighbor search may degrade on adversarial or high-dimensional data. Approximate search can trade accuracy for predictable latency or scalability.

The data structure must match the workload and dimensionality.

## 24. High-Dimensional Limits

Tree partitioning often becomes less effective as dimensionality increases because pruning becomes weaker and many regions remain plausible candidates.

This motivates specialized approximate nearest-neighbor methods for high-dimensional AI workloads.

## 25. Range Tree vs KD-Tree

Range trees emphasize orthogonal range reporting with stronger worst-case geometric guarantees at higher memory cost. KD-trees are often simpler and practical for point data and nearest-neighbor workloads, but their performance depends strongly on data distribution and dimensionality.

## 26. R-Trees

R-Trees organize spatial objects using nested bounding rectangles and are designed for multidimensional spatial indexing where objects may have area rather than being points.

They are especially relevant to geographic and spatial databases.

## 27. Bounding-Box Pruning

A query first checks whether the query region intersects a node's bounding rectangle. If not, the entire subtree can be skipped.

This is the spatial analogue of interval-tree max-end pruning.

## 28. Static vs Dynamic Spatial Data

Static datasets can afford expensive preprocessing and balanced partitioning. Dynamic workloads require insertion/deletion strategies and may tolerate less ideal spatial partitions.

## 29. Coordinate Compression

For discrete coordinates, compression can transform large coordinate domains into compact indexes. For geometric distance queries, however, preserving ordering is not enough; actual coordinate differences must remain available.

## 30. Duplicate Points

Spatial structures must distinguish point identity from coordinate equality when duplicates are legal.

## 31. Floating-Point Coordinates

Floating-point comparisons introduce precision concerns. Production systems should define tolerance, canonicalization, and ordering rules explicitly when coordinates are not exact integers.

## 32. Complexity

For balanced one-dimensional interval structures:

```text
search/update: typically O(log N)
```

All-overlap reporting is generally output-sensitive, often described as `O(log N + K)` for suitable interval-tree formulations, where `K` is the number of reported intervals.

Range-tree and spatial-query complexity depends on dimensionality, balancing, associated structures, and output size.

## 33. Correctness Proof

For interval trees, prove:

1. BST ordering by the chosen interval key;
2. correct `maxEnd` metadata;
3. pruning removes only impossible subtrees;
4. every reported interval satisfies overlap semantics.

For spatial trees, prove every pruned region has a geometric lower bound that cannot satisfy the query predicate.

## 34. Common Mistakes

1. Ignoring endpoint semantics.
2. Using stale `maxEnd` metadata.
3. Pruning without proving the bound.
4. Confusing one-overlap and all-overlap queries.
5. Assuming KD-trees have guaranteed logarithmic nearest-neighbor behavior on every dataset.
6. Losing duplicate point/interval identity.
7. Treating coordinate compression as distance preservation.

## 35. Edge Cases

Test:

- empty structure;
- one interval/point;
- touching endpoints;
- nested intervals;
- identical intervals;
- duplicate starts;
- zero-length intervals;
- negative coordinates;
- highly clustered points;
- high-dimensional points;
- adversarial distributions.

## 36. Backend Applications

These structures can support:

- calendar conflict detection;
- reservation systems;
- geospatial queries;
- time-window filtering;
- log/event interval analysis;
- resource occupancy indexes.

## 37. AI Applications

Spatial/index structures can support:

- nearest-neighbor candidate search;
- embedding metadata for low-dimensional spaces;
- bounding-region pruning;
- geometric simulation;
- structured retrieval and candidate filtering.

For high-dimensional embeddings, specialized ANN systems are usually more appropriate than naïve tree partitioning.

## 38. Testing Strategy

Use:

- brute-force overlap/reference search;
- random interval generation;
- nested and touching interval tests;
- random spatial points;
- nearest-neighbor differential testing;
- bounding-region invariant checks;
- adversarial distribution benchmarks.

## 39. Interview Framework

```text
1. Is the data point-based or interval-based?
2. What is the ordering key?
3. What metadata enables pruning?
4. What proves pruning is safe?
5. Is the query one-result or reporting all matches?
6. What is the output size K?
7. Is the data static or dynamic?
8. What are the dimensions?
9. Are coordinates exact or floating point?
10. Would a database/spatial index or ANN structure be more appropriate?
```

## 40. Revision Checklist

- [ ] I can define interval overlap precisely.
- [ ] I understand max-endpoint augmentation.
- [ ] I can explain safe interval pruning.
- [ ] I understand output-sensitive overlap reporting.
- [ ] I understand range-tree canonical decomposition.
- [ ] I understand KD-tree partitioning.
- [ ] I can explain nearest-neighbor pruning.
- [ ] I understand bounding regions.
- [ ] I know when high-dimensional tree search becomes weak.
- [ ] I can compare interval, range, KD, and R-tree concepts.

## 41. Key Takeaways

1. **Interval trees turn range overlap into an augmented ordered-tree problem.**
2. **The correctness of pruning depends on metadata that provides a proven bound on what a subtree can contain.**
3. **Range trees generalize ordered searching into multiple dimensions through canonical decomposition and secondary indexes.**
4. **KD-trees use geometric partitioning and bounding regions for spatial search, but effectiveness depends on dimensionality and data distribution.**
5. **Spatial indexing is fundamentally about reducing candidate regions while preserving a proof that no valid result is pruned.**
