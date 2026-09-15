# 08.11 — Search in 2D Matrices & Monotone Matrices

## 1. Concept Definition

Searching a matrix requires exploiting whatever ordering structure the matrix provides.

Different matrix contracts produce different algorithms:

- completely sorted flattened order;
- each row sorted;
- each column sorted;
- rows and columns both monotone;
- globally monotone matrix predicates.

The first step is therefore not choosing binary search. It is identifying the exact ordering model.

## 2. Why It Matters

A 2D matrix contains two dimensions of position, but its values may encode a one-dimensional ordering.

The central skill is transforming:

```text
2D search space
→ ordered search space
→ safe elimination
```

## 3. Matrix Search Contracts

### Model A — Globally flattened sorted

Every row follows the previous row:

```text
A[i][j] <= A[i][j + 1]
A[i][last] <= A[i + 1][0]
```

The matrix can be treated as a virtual sorted array.

### Model B — Rows and columns sorted

```text
row: increasing →
column: increasing ↓
```

but the last element of one row may not be ordered relative to the first element of the next row.

These models require different search strategies.

## 4. Mental Model: Virtual 1D Array

For a globally sorted matrix with `R` rows and `C` columns, map virtual index `k` to:

```text
row = Math.floor(k / C)
col = k % C
```

Then ordinary binary search can operate over:

```text
0 ... R*C - 1
```

without physically flattening the matrix.

## 5. Why Avoid Flattening

Creating a flattened array costs:

```text
O(R*C)
```

additional space and copying time.

Virtual indexing preserves:

```text
O(1)
```

auxiliary space for the search itself.

## 6. Complexity: Globally Sorted Matrix

Binary search over `R*C` virtual elements costs:

```text
O(log(R*C))
```

which is equivalent to:

```text
O(log R + log C)
```

for asymptotic reasoning.

Auxiliary search space:

```text
O(1)
```

## 7. Model B: Row-and-Column Sorted Matrix

When every row and column is sorted but the matrix is not globally flattened-sorted, a useful strategy is the **staircase search**.

Start from a corner such as:

```text
(top-right)
```

At each step compare the current value with the target.

## 8. Staircase Search

For ascending rows and columns, start at top-right.

If:

```text
current > target
```

move left.

If:

```text
current < target
```

move down.

If equal, the target is found.

## 9. Why Staircase Search Works

At the top-right corner:

- everything below is greater than or equal to the current value;
- everything left is less than or equal to the current value under the ordering model.

A comparison therefore eliminates an entire row or column.

## 10. Staircase Invariant

A useful invariant is:

> If the target exists, it remains inside the uneliminated staircase region.

Every left/down move removes only cells that cannot contain the target.

## 11. Complexity

At each step, either:

```text
column decreases
```

or:

```text
row increases
```

There can be at most:

```text
R + C
```

moves.

Therefore:

```text
Time → O(R + C)
Auxiliary space → O(1)
```

## 12. Why Not Binary Search Every Row?

Binary-searching each row costs approximately:

```text
O(R log C)
```

The staircase method uses the relationship between rows and columns to eliminate both dimensions together.

Which strategy is preferable depends on the matrix dimensions and access model, but they have different structural assumptions and costs.

## 13. Binary Search Each Row

This strategy is valid when rows are independently sorted.

For each row:

```text
binarySearch(row, target)
```

Total:

```text
O(R log C)
```

It does not require column ordering.

## 14. Search Each Column

Symmetrically, if columns are sorted, binary search can be performed independently across columns:

```text
O(C log R)
```

This may be useful when the matrix is extremely rectangular.

## 15. Choosing the Starting Corner

For ascending row/column order, useful corners include:

```text
upper-right
lower-left
```

because one movement direction increases values while the other decreases them.

Starting from upper-left or lower-right does not provide the same immediate two-way elimination rule.

## 16. Descending Matrices

If rows and columns are descending, comparison directions reverse.

Do not copy ascending staircase logic without re-deriving the invariant.

## 17. Jagged Arrays

JavaScript arrays can be jagged:

```text
[
  [1, 2],
  [3, 4, 5],
  [6]
]
```

A rectangular-matrix algorithm cannot assume:

```text
row.length === C
```

unless the contract guarantees rectangular shape.

## 18. Empty Dimensions

Handle:

```text
[]
```

and matrices containing zero-length rows according to the API contract.

A matrix search should never access a nonexistent corner.

## 19. Duplicates

Duplicates do not invalidate membership search in a monotone matrix.

They do matter for occurrence questions such as:

- first row containing target;
- first column containing target;
- minimum row-major occurrence;
- count of occurrences.

A membership search and a boundary search are different contracts.

## 20. Counting Occurrences

Counting all target occurrences in a row/column-sorted matrix may require more than simple membership search.

Possible approaches include:

- row-wise binary boundaries;
- column-wise boundaries;
- exploiting special matrix structure;
- specialized traversal.

The correct complexity depends on the guarantees available.

## 21. First/Last Position

If the matrix is globally flattened-sorted, row-major first/last occurrence can be reduced to ordinary lower/upper-bound search over the virtual array.

If only rows and columns are sorted, the problem requires a different derivation.

## 22. Monotone Boolean Matrices

A powerful generalization is a matrix whose predicate transitions monotonically.

For example:

```text
false false false true
false false true  true
false true  true  true
```

Each row may have a boundary where values switch from false to true.

The search can exploit those boundaries rather than searching arbitrary values.

## 23. Boundary Search Per Row

If each row has:

```text
false...false true...true
```

then the first true position can be found with binary search.

Across rows, additional monotonicity may allow reuse of the previous boundary.

This is a two-dimensional extension of lower-bound reasoning.

## 24. Top-Right Boundary Walk

For a matrix of monotone booleans, start from the top-right corner.

If the current cell is true:

```text
move left
```

because earlier columns may contain the boundary.

If false:

```text
move down
```

because later rows may contain true values.

This is the same staircase elimination pattern applied to predicates.

## 25. Find Leftmost True

The staircase walk can locate a global leftmost true boundary under the required row/column monotonicity assumptions.

The invariant is:

> All eliminated cells cannot improve the requested boundary.

This illustrates how a search algorithm can optimize a boundary rather than merely find membership.

## 26. Matrix as a Partially Ordered Set

A row/column-sorted matrix can be viewed as a 2D partial-order structure.

Moving right increases values.

Moving down increases values.

The search exploits these dominance relationships to eliminate regions.

## 27. Dominance Reasoning

If:

```text
A[r][c] > target
```

then every cell below it in the same column is also greater under column monotonicity.

If:

```text
A[r][c] < target
```

then every cell left of it in the same row is smaller under row monotonicity.

These are the two elimination rules behind staircase search.

## 28. Correctness Proof: Staircase Search

### Initialization
The entire matrix is a candidate region.

### Maintenance
At each cell, eliminate a complete row or column that cannot contain the target.

### Progress
Either the column decreases or the row increases.

### Termination
The pointer leaves the matrix or encounters the target.

### Postcondition
If the algorithm returns an index, that cell equals the target. Otherwise, all possible candidate cells have been eliminated.

## 29. Correctness Proof: Virtual Binary Search

### Initialization
The virtual interval `[0, R*C - 1]` contains every matrix cell in row-major order.

### Maintenance
The global ordering guarantees that ordinary binary-search elimination is valid.

### Mapping
Every virtual index maps to exactly one `(row, column)` pair.

### Termination
The interval becomes empty or a matching cell is found.

## 30. Overflow / Large Matrices

When computing:

```text
R * C
```

or virtual indices, consider numeric limits for the implementation language.

JavaScript `Number` can exactly represent integers only up to `Number.MAX_SAFE_INTEGER`.

For realistic in-memory arrays this is usually not the limiting concern, but production-scale abstractions should define index limits explicitly.

## 31. Cache and Access Patterns

Staircase search may move across rows and columns in a pattern different from row-wise binary search.

For physically stored row-major matrices, row-wise locality can matter.

Therefore asymptotic complexity should be supplemented with actual access-pattern measurements for performance-sensitive workloads.

## 32. Backend Applications

2D ordered search can appear in:

- time × metric tables;
- capacity/latency lookup matrices;
- routing or cost tables;
- configuration threshold grids;
- precomputed decision tables.

The matrix's ordering contract must be explicit before selecting a search algorithm.

## 33. AI Applications

Related structures can appear in:

- score threshold grids;
- hyperparameter result tables;
- discretized cost surfaces;
- monotone feasibility matrices;
- retrieval/ranking lookup tables.

For large tensor workloads, specialized numerical libraries may be more appropriate than hand-written JavaScript matrix search.

## 34. Testing Strategy

Generate matrices satisfying each contract separately:

1. globally flattened sorted;
2. row-sorted only;
3. row-and-column sorted;
4. descending;
5. duplicate-heavy;
6. monotone boolean.

Do not test an algorithm against data that violates its documented assumptions and then classify the failure as an implementation bug.

## 35. Differential Testing

Use a brute-force scan as the correctness reference.

For membership:

```text
reference → scan every cell
optimized → matrix search
```

For boundary tasks, the reference must implement the exact same boundary contract.

## 36. Benchmarking

Measure separately:

- matrix dimensions;
- density of matches;
- duplicates;
- row/column shape;
- cache effects;
- number of comparisons;
- number of matrix accesses.

Compare only algorithms that are valid under the same matrix contract.

## 37. Common Mistakes

1. Assuming every sorted matrix is globally flattened-sorted.
2. Using staircase search without column ordering.
3. Flattening unnecessarily and hiding `O(R*C)` copying cost.
4. Starting from a corner that does not support two-way elimination.
5. Mishandling empty matrices.
6. Ignoring jagged arrays.
7. Confusing membership with occurrence boundaries.
8. Applying ascending comparisons to descending matrices.
9. Forgetting the exact matrix contract.
10. Claiming `O(log(R*C))` when only row/column ordering is guaranteed.

## 38. Edge Cases

Test:

- empty matrix;
- one row;
- one column;
- one cell;
- rectangular dimensions;
- highly wide matrix;
- highly tall matrix;
- all equal values;
- target at first/last cell;
- absent target;
- duplicate target;
- jagged input when supported;
- descending order.

## 39. Implementation Lab

Implement:

1. virtual 1D binary search in a globally sorted matrix;
2. binary search per sorted row;
3. binary search per sorted column;
4. staircase search;
5. descending staircase search;
6. first true in a monotone boolean matrix;
7. row boundary search;
8. brute-force references for every contract.

## 40. Interview Questions

1. How do you search a matrix sorted row-wise and column-wise?
2. Why does top-right staircase search work?
3. What is its complexity?
4. When can a matrix be treated as a virtual 1D sorted array?
5. Why should you avoid flattening the matrix?
6. How do duplicates affect boundary queries?
7. How would you search a descending matrix?
8. What changes for jagged arrays?
9. How does a monotone boolean matrix generalize lower-bound search?
10. Which invariant proves staircase search correctness?

## 41. Revision Checklist

- [ ] I can distinguish globally sorted from row/column sorted matrices.
- [ ] I can map a virtual 1D index to `(row, column)`.
- [ ] I can implement matrix binary search without flattening.
- [ ] I can derive staircase elimination.
- [ ] I can prove the staircase invariant.
- [ ] I know when row-wise binary search is valid.
- [ ] I can reason about descending matrices.
- [ ] I understand boundary search in monotone boolean matrices.
- [ ] I can handle duplicates and empty dimensions.
- [ ] I can preserve space complexity by using index access.
- [ ] I can validate every strategy against a matching brute-force reference.

## 42. Key Takeaways

1. **Matrix search begins by identifying the exact ordering contract.**
2. **A globally row-major sorted matrix can be searched as a virtual 1D sorted array.**
3. **A row-and-column sorted matrix supports staircase elimination.**
4. **Staircase search works because each comparison eliminates an entire row or column.**
5. **The classic staircase complexity is `O(R + C)` with `O(1)` auxiliary space.**
6. **Duplicates change boundary semantics even when membership search remains straightforward.**
7. **Monotone boolean matrices are a natural generalization of boundary-search problems.**
8. **Avoid physical flattening when constant auxiliary space and access efficiency matter.**
9. **Do not apply a search algorithm outside the ordering assumptions that justify it.**
10. **The transferable skill is converting multidimensional ordering into safe search-space elimination.**
