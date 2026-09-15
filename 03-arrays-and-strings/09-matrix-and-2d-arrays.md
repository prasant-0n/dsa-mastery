# 03.9 — Matrix / 2D Arrays

## Definition

A matrix is a two-dimensional arrangement of values addressed by row and column.

```text
      c0 c1 c2
r0    1  2  3
r1    4  5  6
r2    7  8  9
```

In JavaScript this is commonly represented as an array of arrays:

```js
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
```

A matrix problem is therefore fundamentally an **indexing, traversal, representation, and boundary-management problem**.

---

## Why It Matters

2D arrays appear in:

- grids and maps;
- image processing;
- dynamic programming tables;
- graph adjacency matrices;
- spreadsheets;
- game boards;
- simulations;
- database-like tabular data;
- AI tensors and attention-like structures.

The important skill is not memorizing matrix tricks. It is translating a geometric operation into precise index transitions.

---

# 1. Coordinate Model

For a matrix with `R` rows and `C` columns:

```text
row ∈ [0, R - 1]
col ∈ [0, C - 1]
```

Access:

```js
matrix[row][col]
```

The total number of cells is:

```text
R × C
```

A complete traversal therefore costs `Θ(RC)`.

Do not automatically write `O(N²)`. Use `R` and `C` when they can differ.

---

# 2. Rectangular vs Jagged Matrices

A rectangular matrix has equal column counts:

```text
3 × 4
3 × 4
3 × 4
```

A jagged matrix may have different row lengths:

```text
[1, 2]
[3, 4, 5]
[6]
```

Many matrix algorithms silently assume rectangular input. If the contract does not guarantee it, validate or reason about each row independently.

For a jagged matrix, total work is better expressed as:

```text
Θ(total number of cells)
```

rather than `Θ(RC)`.

---

# 3. Basic Traversal

Row-major traversal:

```js
for (let r = 0; r < matrix.length; r++) {
  for (let c = 0; c < matrix[r].length; c++) {
    // matrix[r][c]
  }
}
```

For a rectangular matrix:

```text
Time = Θ(RC)
Auxiliary space = Θ(1)
```

assuming constant-size state and no output allocation.

---

# 4. Column Traversal

Column-oriented processing changes the nesting order:

```js
for (let c = 0; c < cols; c++) {
  for (let r = 0; r < rows; r++) {
    // matrix[r][c]
  }
}
```

The algorithmic complexity is still `Θ(RC)`, but representation and memory locality can differ in lower-level systems.

For JavaScript nested arrays, do not assume a contiguous C-style 2D memory layout.

---

# 5. Four-Direction Neighbors

For grid problems, the four orthogonal neighbors of `(r, c)` are:

```text
(r - 1, c)
(r + 1, c)
(r, c - 1)
(r, c + 1)
```

A compact representation:

```js
const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1]
];
```

For each candidate neighbor, validate:

```text
0 <= nr < R
0 <= nc < C
```

Boundary checks are part of correctness, not optional defensive code.

---

# 6. Eight-Direction Neighbors

Including diagonals gives:

```text
(-1,-1) (-1,0) (-1,1)
( 0,-1)         ( 0,1)
( 1,-1) ( 1,0) ( 1,1)
```

This is common in:

- connected-component problems;
- board games;
- image processing;
- spatial simulations.

Always determine whether diagonal adjacency is part of the problem definition.

---

# 7. Boundary Reasoning

For every cell, ask:

- can it have a top neighbor?
- bottom?
- left?
- right?
- diagonals?

Corners have fewer neighbors than edges, and edges have fewer than interior cells.

A robust approach is to generate candidate coordinates and perform one consistent bounds check instead of writing many special cases.

---

# 8. Row and Column Aggregation

Common operations:

- row sums;
- column sums;
- row maxima;
- column minima;
- diagonal sums.

A complete scan is usually `Θ(RC)`.

If many queries repeatedly ask for rectangular sums, a 2D prefix sum can reduce query cost dramatically.

---

# 9. Main and Secondary Diagonals

For an `N × N` matrix:

### Main diagonal

```text
(r, r)
```

### Secondary diagonal

```text
(r, N - 1 - r)
```

Each contains `N` cells.

For non-square matrices, the notion of a complete secondary diagonal must be defined carefully rather than blindly using square-matrix formulas.

---

# 10. Matrix Transpose

Transpose changes:

```text
R × C → C × R
```

with:

```text
T[c][r] = matrix[r][c]
```

For a new output matrix:

- Time: `Θ(RC)`
- Output space: `Θ(RC)`.

For a square matrix, transpose can be performed in-place by swapping only one side of the diagonal.

---

# 11. In-Place Transpose

For square matrix:

```text
for r = 0..N-1
  for c = r+1..N-1
    swap(matrix[r][c], matrix[c][r])
```

The `c = r + 1` boundary prevents swapping each pair twice and avoids swapping diagonal elements.

Invariant:

> After processing row `r` and the appropriate columns, every processed off-diagonal pair is already in transposed position.

Time: `Θ(N²)`.

Auxiliary space: `Θ(1)`.

---

# 12. Matrix Rotation

A common 90-degree clockwise rotation of a square matrix can be decomposed into:

1. transpose;
2. reverse every row.

This is an example of **algorithm composition**.

Each phase is `Θ(N²)`, so total complexity remains `Θ(N²)`.

The decomposition is often easier to prove than a direct coordinate formula.

---

# 13. Spiral Traversal

Spiral traversal maintains four boundaries:

```text
 top
 bottom
 left
 right
```

Repeatedly process:

1. top row left → right;
2. right column top → bottom;
3. bottom row right → left;
4. left column bottom → top;
5. shrink boundaries.

After each layer, the unprocessed region becomes smaller.

Important edge cases:

- one remaining row;
- one remaining column;
- single cell;
- empty matrix.

Avoid processing the same middle row/column twice.

---

# 14. Matrix Search

The simplest search scans every cell:

```text
Θ(RC)
```

If each row is sorted, binary search can be applied to each row:

```text
O(R log C)
```

If the matrix has stronger ordering properties, a staircase search can often achieve:

```text
O(R + C)
```

The representation and ordering guarantees determine which search algorithm is valid.

---

# 15. Staircase Search

For a matrix where rows and columns are sorted increasingly, start at the top-right cell.

```text
      ↓ columns
[ 1  4  7 11 ] ← start
[ 2  5  8 12 ]
[ 3  6  9 16 ]
```

At `(r,c)`:

- if value equals target → found;
- if value > target → move left;
- if value < target → move down.

Each move eliminates a row or column region.

Time: `O(R + C)`.

This is another example of monotonic search-space elimination.

---

# 16. Flood Fill / Connected Regions Preview

Grid traversal can model a matrix as an implicit graph:

- each cell = vertex;
- valid neighboring cells = edges.

BFS or DFS can then solve:

- flood fill;
- islands;
- connected components;
- shortest unweighted grid paths.

Detailed graph traversal belongs to Phase 14, but the grid representation should already feel natural here.

A visited structure may require `O(RC)` memory, although in-place marking can sometimes reduce auxiliary memory if mutation is allowed.

---

# 17. In-Place Grid Mutation

Some grid algorithms mark state directly in the matrix.

Example conceptual states:

```text
0 = unvisited
1 = visited
```

Advantages:

- less auxiliary memory;
- often simpler state storage.

Risks:

- destroys original data;
- may conflict with caller expectations;
- can make debugging harder;
- may require encoding multiple states into existing values.

Mutation is a contract decision.

---

# 18. 2D Prefix Sums

For repeated rectangular-sum queries, build a 2D prefix table.

Define `P[r+1][c+1]` as the sum of the rectangle from `(0,0)` through `(r,c)`.

The recurrence uses inclusion-exclusion:

```text
P[r+1][c+1]
= A[r][c]
+ P[r][c+1]
+ P[r+1][c]
- P[r][c]
```

A rectangle query can then be answered using four prefix values.

### Complexity

For an `R × C` matrix:

- build: `O(RC)`;
- each rectangle query: `O(1)`;
- space: `O(RC)`.

This is the 2D extension of the prefix-sum technique from the previous chapter.

---

# 19. Matrix Multiplication

For:

```text
A: R × K
B: K × C
```

result:

```text
R × C
```

Standard multiplication costs:

```text
Θ(RKC)
```

because each of the `RC` output cells requires a dot product of length `K`.

This is an important multiple-parameter complexity pattern.

For square `N × N` matrices:

```text
Θ(N³)
```

---

# 20. Matrix Representation Choices

Not every matrix should be stored as a dense 2D array.

If most entries are zero, sparse representations may be better:

```text
(row, column) → value
```

using a `Map`, coordinate list, compressed sparse formats, or specialized structures.

Dense representation costs `Θ(RC)` storage even when only a tiny fraction of cells contain meaningful values.

Representation should follow the workload and density.

---

# 21. Flattening a Matrix

A rectangular matrix can conceptually be flattened into one dimension.

For row-major indexing:

```text
index = row * C + column
```

and reverse:

```text
row = Math.floor(index / C)
column = index % C
```

This representation is useful for:

- compact storage;
- typed arrays;
- image buffers;
- numerical processing.

For JavaScript nested arrays, flattening may change memory behavior and should be chosen deliberately.

---

# 22. Common Matrix Traversal Patterns

### Row-major

```text
→ → →
→ → →
→ → →
```

### Column-major

```text
↓ ↓ ↓
↓ ↓ ↓
↓ ↓ ↓
```

### Diagonal

Traverse cells where an index relationship holds.

### Spiral

Shrink four boundaries.

### Layer-by-layer

Process concentric rectangles.

### Neighbor traversal

Generate directions from a fixed cell.

Recognizing the geometric structure is usually more important than memorizing implementation code.

---

# 23. Complexity Rules

For `R × C`:

| Operation | Typical Complexity |
|---|---:|
| Access cell | `O(1)` |
| Full traversal | `O(RC)` |
| Search unsorted | `O(RC)` |
| Transpose | `O(RC)` |
| Spiral traversal | `O(RC)` |
| 2D prefix build | `O(RC)` |
| Rectangle query after prefix | `O(1)` |
| Row-wise binary search | `O(R log C)` |
| Staircase search | `O(R+C)` |
| Matrix multiplication `R×K · K×C` | `O(RKC)` |

Always include output cost and preprocessing cost where relevant.

---

# 24. Correctness Framework

For a matrix traversal, define:

> Every valid cell is processed exactly once, and no invalid coordinate is accessed.

For neighbor traversal:

> Every generated neighbor is either valid and processed according to the algorithm or rejected by the bounds check.

For spiral traversal:

> The processed outer layers are final, and the four boundaries describe exactly the remaining unprocessed rectangle.

For 2D prefix sums:

> Each prefix cell stores the sum of exactly the rectangle represented by its coordinates.

For matrix multiplication:

> Each output cell accumulates exactly the dot product of the corresponding row of `A` and column of `B`.

---

# Backend Applications

### Grid-Based Scheduling

A matrix can represent:

```text
resource × time-slot
```

and algorithms can scan, aggregate, or search availability.

### Heatmaps / Metrics

Rows can represent tenants/services and columns can represent time buckets.

### Spatial Service Data

Location grids can support neighborhood or region computations.

### Batch Processing

2D structures naturally represent:

```text
batch × feature
```

or:

```text
request × attribute
```

The same complexity discipline applies: use `R`, `C`, density, and query count rather than one vague `N`.

---

# AI Applications

### Image Data

Images can be represented as:

```text
height × width × channels
```

A 2D matrix is the first step toward tensor reasoning.

### Embedding Matrices

A collection of `N` embeddings with dimension `D` is an `N × D` structure.

Storage is:

```text
Θ(ND)
```

before accounting for element size and metadata.

### Attention / Similarity Structures

Pairwise operations can create matrices whose size depends on two sequence dimensions.

### Grid Search

Spatial AI tasks can model regions and neighboring states as implicit graphs.

### Data Preprocessing

Matrix traversal is common when normalizing, transforming, filtering, or aggregating feature data.

---

# JavaScript Pitfalls

## Shared Rows

This is dangerous:

```js
const matrix = Array(3).fill(Array(3).fill(0));
```

All rows reference the same inner array.

Prefer:

```js
const matrix = Array.from(
  { length: 3 },
  () => Array(3).fill(0)
);
```

This creates independent rows.

## Mutation Aliasing

Nested arrays are references. A shallow copy of the outer array does not clone rows.

## Jagged Input

Do not use `matrix[0].length` as the column count unless rectangularity is guaranteed.

## Boundary Errors

`r <= rows` is incorrect when the valid range ends at `rows - 1`.

## Accidental O(RC) Work Inside O(RC) Traversal

Repeatedly copying rows, sorting every row, or scanning neighborhoods naively can raise the total complexity substantially.

---

# When to Use Matrix Techniques

Use matrix-specific reasoning when:

- data has row/column coordinates;
- neighbors matter;
- rectangular regions matter;
- transformations involve rows/columns/diagonals;
- repeated 2D range queries exist;
- the structure is naturally spatial.

Do not force a dense matrix representation when the data is sparse.

---

# Interview Framework

1. Identify `R` and `C`.
2. Determine rectangular vs jagged.
3. Define valid coordinates.
4. Identify traversal direction or geometry.
5. Define boundary conditions.
6. State the invariant.
7. Decide whether mutation is allowed.
8. Look for prefix-sum/search ordering opportunities.
9. Calculate complexity using `R`, `C`, and any third dimension.
10. Test empty, singleton, one-row, one-column, rectangular, jagged, boundary, and duplicate cases.

---

# Revision Checklist

- [ ] I can model a 2D array using `(row, column)` coordinates.
- [ ] I can traverse rectangular and jagged matrices.
- [ ] I can generate four/eight neighbors.
- [ ] I can handle boundaries correctly.
- [ ] I can calculate row/column aggregates.
- [ ] I can traverse diagonals.
- [ ] I can transpose a matrix.
- [ ] I understand in-place transpose.
- [ ] I understand matrix rotation composition.
- [ ] I can implement spiral traversal.
- [ ] I understand staircase search.
- [ ] I understand 2D prefix sums.
- [ ] I can reason about matrix multiplication complexity.
- [ ] I can distinguish dense and sparse representations.
- [ ] I understand flattening and coordinate conversion.
- [ ] I know the JavaScript shared-row pitfall.
- [ ] I can analyze `R × C` instead of blindly using `N²`.
- [ ] I can connect matrices to backend data models.
- [ ] I can connect matrices to AI/tensor workloads.

## Key Takeaways

1. A matrix algorithm is primarily about **coordinate representation and boundary-safe transitions**.
2. Use `R` and `C` as separate parameters when dimensions may differ.
3. Full matrix traversal is `Θ(RC)`; jagged matrices should be analyzed by total cell count.
4. Neighbor generation plus bounds checking turns a grid into an implicit graph.
5. Prefix sums extend naturally into two dimensions and give `O(1)` rectangle queries after preprocessing.
6. Ordering guarantees can reduce matrix search from `O(RC)` to `O(R log C)` or `O(R+C)`.
7. Dense and sparse representations have fundamentally different memory costs.
8. In JavaScript, nested arrays are reference structures, so aliasing and shared-row bugs must be understood.
9. Matrix problems are a bridge from basic arrays to grids, graphs, dynamic programming, numerical computing, and AI tensor workloads.
