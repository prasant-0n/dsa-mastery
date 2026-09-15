# 08.21 — Search in 2D / Matrix Structures

## 1. Concept Definition

Searching a matrix is not one single problem. The correct algorithm depends on which ordering guarantees exist across rows and columns.

Common contracts include:

1. each row is sorted;
2. each column is sorted;
3. rows and columns are both sorted;
4. the matrix is globally flattened-sorted;
5. no ordering guarantee exists.

The first step is always to identify the strongest valid invariant.

## 2. Why It Matters

Two-dimensional search is a direct extension of algorithmic invariant reasoning.

The central question is:

> What regions can be eliminated safely from the matrix?

The answer depends on the matrix's ordering model.

## 3. Matrix Representation

For a matrix with `R` rows and `C` columns:

```text
A[0][0] ... A[0][C-1]
A[1][0] ... A[1][C-1]
...
A[R-1][0] ... A[R-1][C-1]
```

Typical JavaScript representation:

```js
const matrix = [
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
];
```

The access cost and rectangular shape must be considered.

## 4. Unsorted Matrix

Without ordering, exact search requires examining every relevant cell in the worst case:

```text
Time → O(RC)
Auxiliary space → O(1)
```

unless preprocessing such as hashing or indexing is introduced.

## 5. Row-Wise Sorted Matrix

If every row is independently sorted, binary search can be applied to each row.

Worst-case complexity:

```text
O(R log C)
```

for exact membership search.

This is useful when rows are sorted but there is no cross-row ordering.

## 6. Column-Wise Sorted Matrix

If every column is sorted, the symmetric strategy is to binary-search each column:

```text
O(C log R)
```

The dimensions should not be accidentally swapped in complexity analysis.

## 7. Fully Row-and-Column Sorted Matrix

Suppose:

```text
A[r][c] <= A[r][c+1]
A[r][c] <= A[r+1][c]
```

for valid neighboring positions.

Then a staircase search can eliminate an entire row or column at each step.

## 8. Staircase Search

Start from a strategic corner, commonly:

```text
(top-right)
```

At each cell:

- if equal → found;
- if target is smaller → move left;
- if target is larger → move down.

Each move eliminates a monotone region.

## 9. Staircase Complexity

At most approximately:

```text
R + C
```

moves are required.

Therefore:

```text
Time → O(R + C)
Auxiliary space → O(1)
```

## 10. Why Top-Right Works

At the top-right cell:

- everything below is greater or equal;
- everything to the left is smaller or equal.

Therefore one comparison determines which direction can be eliminated.

## 11. Top-Left Alternative

Top-left can also work if the movement rules are derived correctly, but the target comparisons differ.

The important idea is not memorizing a corner; it is choosing a position with monotone directions.

## 12. Bottom-Left Alternative

Bottom-left is another useful starting point:

- moving right increases values;
- moving up decreases values.

Again, the movement rules follow the matrix invariant.

## 13. Global Flattened Ordering

Some matrices satisfy a stronger property:

```text
A[r][last] < A[r+1][0]
```

Then the matrix can be treated conceptually as one sorted array.

A 1D binary search can operate over:

```text
0 ... R*C - 1
```

## 14. 2D-to-1D Index Mapping

For row-major storage:

```text
row = floor(index / C)
col = index % C
```

This mapping lets ordinary binary search operate over a globally sorted matrix.

## 15. Flattened Binary Search Complexity

If the matrix is globally sorted under the flattening contract:

```text
Time → O(log(RC))
      = O(log R + log C)

Auxiliary space → O(1)
```

The stronger invariant produces a stronger bound than staircase search.

## 16. Row Selection + Binary Search

For certain matrix contracts, first determine which row may contain the target, then binary-search that row.

This can be useful when row ranges are ordered and disjoint.

The exact complexity depends on how the candidate row is identified.

## 17. Matrix with Sorted Rows and Overlapping Ranges

If rows are individually sorted but their value ranges overlap, a target may occur in multiple rows.

A row-selection strategy that assumes disjoint ranges would be incorrect.

This is a common invariant mistake.

## 18. Duplicates

Duplicates affect:

- exact membership;
- count of occurrences;
- first/last row;
- first/last coordinate;
- range queries.

A search returning one coordinate does not automatically solve boundary semantics.

## 19. Counting Occurrences

If each row is sorted, count occurrences by combining row-level lower and upper bounds:

```text
count(row) = upperBound(row, target) - lowerBound(row, target)
```

Then aggregate across rows.

Complexity is typically:

```text
O(R log C)
```

without additional indexing.

## 20. First / Last Coordinate

For duplicate-aware queries, define the coordinate ordering:

```text
(row, column)
```

and specify whether “first” means row-major order, column-major order, or another contract.

Never leave coordinate semantics implicit.

## 21. Rectangular vs Ragged Matrices

A rectangular matrix has a consistent column count.

A ragged JavaScript array may have:

```text
row 0 → C0 elements
row 1 → C1 elements
...
```

Algorithms relying on constant `C` require either validation or a different access model.

## 22. Empty Rows

Even a nominally matrix-shaped input may contain empty rows.

Row-wise algorithms must avoid accessing invalid endpoints.

Production APIs should specify whether empty rows are permitted.

## 23. Sparse Matrices

A sparse matrix should not automatically be represented as a dense `R × C` array.

If most cells are absent, coordinate maps, compressed formats, or specialized indexes may reduce memory and search costs.

The representation itself becomes part of the algorithm.

## 24. Hash-Based Matrix Search

For an unsorted matrix with many repeated queries, a hash index can trade preprocessing and memory for fast membership queries.

A typical architecture is:

```text
scan matrix → Set / Map index → O(1) expected membership
```

The preprocessing cost is `O(RC)` and the memory cost is proportional to the indexed cells.

## 25. Query Workload Modeling

For `Q` queries, compare:

```text
Q × scanCost
```

against:

```text
preprocessCost + Q × indexedQueryCost
```

This is especially important for backend systems where the matrix is reused.

## 26. Monotone Predicate Search in 2D

Some matrix problems ask for a boundary rather than an exact value.

For example:

```text
find the first row containing a value >= X
```

If the row predicate is monotone, binary search can operate over rows.

The same principle can be applied to columns.

## 27. Search for First Feasible Cell

A 2D domain may have a monotone feasibility structure:

```text
false false true true
false false true true
false true  true true
```

The exact search strategy depends on which dimensions are monotone and whether the objective is one cell, a boundary, or a count.

## 28. Saddleback / Staircase Reasoning

Staircase search is sometimes called saddleback search.

Its strength comes from eliminating one complete monotone region at every move rather than repeatedly searching individual rows.

## 29. Divide-and-Conquer Matrix Search

A matrix can also be recursively partitioned into submatrices.

This can be useful for certain ordering structures, but the recurrence and eliminated regions must be derived from the actual invariant.

Do not assume every sorted matrix benefits from generic 2D divide-and-conquer.

## 30. Binary Search Per Row vs Staircase

For a row-and-column sorted matrix:

```text
row binary searches → O(R log C)

staircase search → O(R + C)
```

Which is preferable depends on dimensions and workload, but the bounds arise from different structural exploitation.

## 31. Extremely Rectangular Matrices

If:

```text
R << C
```

row-level binary searches may have different practical behavior than staircase traversal.

Likewise, when:

```text
C << R
```

column-oriented reasoning may be useful.

Complexity should be expressed in both dimensions rather than collapsed prematurely to `n`.

## 32. Cache and Layout

JavaScript nested arrays are not necessarily contiguous as one flat memory block.

A flat typed array can provide a different memory-access profile:

```text
index = row * C + col
```

Algorithmic complexity is unchanged, but practical performance can differ.

## 33. Typed Arrays

For numeric matrices, typed arrays can reduce representation overhead and provide predictable element storage.

A flat representation can also make flattened binary search natural when the global ordering contract exists.

## 34. Backend Applications

2D structures can model:

- feature matrices;
- permission matrices;
- availability grids;
- pricing tables;
- scheduling grids;
- time × metric data.

The appropriate search method depends on whether rows, columns, or both have useful ordering.

## 35. AI Applications

Matrix search concepts connect to:

- sorted score grids;
- discretized search spaces;
- feature lookup tables;
- dynamic-programming state tables;
- structured candidate matrices.

For dense numerical linear algebra, matrix operations are usually handled by specialized numerical kernels rather than general-purpose search algorithms.

## 36. Correctness Invariant — Staircase

At every step:

> Every eliminated cell is proven unable to contain the target.

For top-right traversal:

- moving left eliminates cells larger than the target in the current column region;
- moving down eliminates cells smaller than the target in the current row region.

The exact proof follows from row and column monotonicity.

## 37. Correctness Invariant — Flattened Search

The active 1D interval contains every possible flattened index of the target.

The row/column mapping is a representation detail and must not alter the ordering invariant.

## 38. Termination

Staircase search terminates because every move changes either:

```text
row += 1
```

or:

```text
col -= 1
```

and both coordinates remain bounded.

Binary search terminates through the standard interval-shrinking invariant.

## 39. Common Mistakes

1. Assuming a matrix is globally sorted when only rows are sorted.
2. Using staircase search without column ordering.
3. Flattening a matrix without proving cross-row ordering.
4. Swapping row/column dimensions in complexity analysis.
5. Ignoring ragged or empty rows.
6. Mishandling duplicates and occurrence semantics.
7. Using dense storage for highly sparse data without considering representation cost.
8. Ignoring repeated-query preprocessing opportunities.
9. Confusing matrix search with matrix multiplication or numerical kernels.
10. Failing to define coordinate ordering for boundary results.

## 40. Edge Cases

Test:

- empty matrix;
- one row;
- one column;
- single cell;
- rectangular matrices;
- duplicate values;
- all equal values;
- target below minimum;
- target above maximum;
- target at corners;
- empty rows for ragged input;
- sparse representations.

## 41. Testing Strategy

Create separate generators for each ordering contract:

1. unsorted;
2. row-sorted;
3. column-sorted;
4. row-and-column sorted;
5. globally flattened-sorted.

Do not use one generator for all algorithms because their preconditions differ.

## 42. Differential Testing

Compare optimized searches against a linear matrix scan.

For every target and coordinate query:

```text
optimized result
vs
reference result
```

For duplicate boundary queries, compare exact documented coordinate semantics.

## 43. Benchmarking

Measure:

- rows `R`;
- columns `C`;
- query count `Q`;
- number of comparisons;
- cell accesses;
- preprocessing cost;
- memory usage;
- representation/layout.

Benchmark different matrix shapes rather than only square matrices.

## 44. Implementation Lab

Implement:

1. unsorted matrix scan;
2. row-wise binary search;
3. column-wise binary search;
4. staircase search;
5. flattened binary search;
6. duplicate counting;
7. first/last coordinate search;
8. hash-indexed repeated queries;
9. ragged-matrix-safe search;
10. differential and benchmark harnesses.

## 45. Interview Questions

1. How do you search a row-and-column sorted matrix in `O(R + C)`?
2. Why does top-right staircase search work?
3. When can a matrix be treated as one flattened sorted array?
4. What is the complexity of binary-searching every row?
5. What changes for column-sorted data?
6. How do duplicates affect matrix search?
7. How would you count occurrences in row-sorted data?
8. How would you handle a ragged matrix?
9. When is preprocessing with a hash index useful?
10. How does matrix shape affect algorithm choice and complexity?

## 46. Revision Checklist

- [ ] I can identify the matrix ordering contract.
- [ ] I can distinguish row-sorted, column-sorted, and globally sorted matrices.
- [ ] I can derive staircase search.
- [ ] I can explain `O(R + C)`.
- [ ] I can map 2D coordinates to a flattened index.
- [ ] I can derive `O(log(RC))` for globally sorted matrices.
- [ ] I can handle duplicates and coordinate semantics.
- [ ] I can reason about ragged and sparse representations.
- [ ] I can model preprocessing for repeated queries.
- [ ] I can test each algorithm only under its valid contract.

## 47. Key Takeaways

1. **2D search is defined by the matrix's ordering invariant, not by the fact that it has two dimensions.**
2. **Unsorted search is `O(RC)` without additional indexing.**
3. **Row-wise sorted data supports per-row binary search.**
4. **Row-and-column monotonicity enables staircase search in `O(R + C)`.**
5. **A globally flattened-sorted matrix can be searched in `O(log(RC))`.**
6. **Duplicates require explicit occurrence and coordinate semantics.**
7. **Ragged and sparse representations change the access model and therefore the algorithm design.**
8. **Repeated-query workloads may justify hash-based preprocessing.**
9. **Matrix dimensions should remain explicit in complexity analysis.**
10. **The deeper lesson is to identify exactly which dimensions are ordered before selecting a search strategy.**
