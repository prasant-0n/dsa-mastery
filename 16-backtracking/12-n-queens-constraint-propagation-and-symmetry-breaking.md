# 16.12 — N-Queens, Constraint Propagation & Symmetry Breaking

## 1. Concept Definition

The N-Queens problem places `N` queens on an `N × N` chessboard so that no two queens attack each other.

A queen attacks along the same row, column, and either diagonal.

N-Queens is a canonical example of constraint satisfaction through backtracking.

## 2. CSP Formulation

A compact model assigns exactly one variable to each row:

```text
Q[r] = column occupied by the queen in row r
```

Then every pair of rows must satisfy:

```text
Q[i] !== Q[j]
abs(Q[i] - Q[j]) !== abs(i - j)
```

The first constraint prevents column conflicts; the second prevents diagonal conflicts.

## 3. Why One Queen Per Row Works

A solution can always be represented with at most one queen per row. Since a valid N-Queens solution contains exactly `N` queens on `N` rows, selecting one column per row captures the whole solution without separately checking row conflicts.

## 4. State Representation

A practical recursive state contains:

```text
row
column occupancy
main-diagonal occupancy
anti-diagonal occupancy
partial placement
```

This avoids scanning every previously placed queen for each candidate.

## 5. Diagonal Encoding

For a cell `(row, col)`:

```text
main diagonal: row - col
anti diagonal: row + col
```

Two cells share a diagonal exactly when their corresponding key is equal.

Because `row - col` can be negative, an array representation can use an offset of `N - 1`.

## 6. O(1) Conflict Checks

With three occupancy sets:

```text
columns
row - col
row + col
```

candidate validation becomes expected `O(1)` with JavaScript `Set` operations.

Bitsets can make these checks even more compact for suitable `N`.

## 7. Core Backtracking

```text
solve(row):
    if row === N:
        emit solution
    for each column:
        if safe:
            place queen
            solve(row + 1)
            remove queen
```

The recursion explores column assignments row by row.

## 8. Naive Approach

A naive solver can place a queen and scan all previous queens for conflicts.

This is easier to understand but performs repeated work.

Use it as a correctness oracle for small `N`, not necessarily as the production implementation.

## 9. Optimized Conflict State

Maintain three structures and update them on every placement:

```text
columns.add(col)
diag1.add(row-col)
diag2.add(row+col)
```

Undo exactly the same mutations after recursion.

## 10. Bitmask Representation

For moderate board sizes, bitmasks can represent available columns and diagonals compactly.

The classic formulation computes available positions using bit operations.

In JavaScript, ordinary bitwise operators are limited to signed 32-bit integers, so larger boards require careful use of `BigInt` or another representation.

## 11. Available-Column Mask

If `allColumns` contains all board columns and `occupiedColumns` contains used columns:

```text
available = allColumns & ~occupiedColumns
```

For `BigInt`, use BigInt literals and operations consistently.

## 12. Lowest-Set-Bit Extraction

A bitmask solver can repeatedly extract one candidate bit, process it, and remove it from the candidate mask.

This is a useful general technique for subset and constraint search.

## 13. Symmetry

The board is symmetric under rotations and reflections.

If only the number of solutions is needed, symmetry can reduce duplicated exploration.

However, symmetry reduction must preserve the requested output semantics when actual placements are required.

## 14. First-Row Symmetry

For counting, fixing or pairing first-row columns under horizontal reflection can avoid exploring equivalent halves.

A center column requires special treatment when `N` is odd.

Do not apply a symmetry rule blindly when enumerating labeled solutions.

## 15. Canonical Symmetry Breaking

A general approach is to transform a complete solution through all board symmetries and keep only a canonical representative.

This is simple conceptually but may do extra work after reaching a solution.

## 16. Symmetry-Aware Search

A stronger approach applies symmetry constraints before deep search.

The challenge is proving that the omitted branches are equivalent to retained branches rather than merely similar.

## 17. Constraint Propagation

After placing a queen, future rows have fewer legal columns.

Forward checking explicitly tracks candidate domains for future rows and removes attacked columns.

If any future row loses every candidate, backtrack immediately.

## 18. MRV Heuristic

The Minimum Remaining Values heuristic chooses the variable with the smallest current domain.

For the standard one-queen-per-row formulation, rows are structurally symmetric, but MRV becomes useful in generalized N-Queens CSP formulations with additional constraints.

## 19. Degree Heuristic

When multiple variables tie under MRV, choose the variable participating in more constraints.

This attempts to expose contradictions earlier.

## 20. Least-Constraining Value

Among legal columns, prefer the candidate that removes the fewest future options.

This can improve solution discovery but must not be confused with pruning: every legal candidate still needs consideration when completeness is required.

## 21. Branch and Bound

N-Queens is normally a feasibility/enumeration problem rather than a numeric optimization problem.

For weighted/generalized queen placement, branch-and-bound can maintain an objective and prune states whose optimistic bound cannot improve the incumbent.

## 22. Counting vs Enumeration

Three common APIs are different:

```text
find one solution
count all solutions
return all solutions
```

The memory and runtime behavior differs substantially.

For counting, never materialize every solution unnecessarily.

## 23. Known Small Cases

Useful sanity checks include:

```text
N = 1 → 1 solution
N = 2 → 0
N = 3 → 0
N = 4 → 2
```

These are excellent regression tests.

## 24. Solution Representation

A compact representation is an array where index = row and value = column:

```text
[1, 3, 0, 2]
```

This represents one solution for `N = 4`.

## 25. Independent Validator

A validator should independently check:

1. exactly `N` assignments
2. every column is in range
3. columns are unique
4. diagonal keys are unique

Do not rely on the solver's internal occupancy sets for validation.

## 26. Correctness Invariant

At recursion depth `r`:

> Exactly one queen is placed in each of rows `0..r-1`, no two placed queens share a column or diagonal, and every occupancy structure exactly matches the partial placement.

## 27. Soundness

A solution emitted at depth `N` satisfies every column and diagonal constraint because each placement was checked against the maintained occupancy state.

## 28. Completeness

For every row, the solver examines every legal column unless a proven symmetry or propagation rule removes an equivalent/impossible branch.

Therefore every valid placement is reachable under the baseline search.

## 29. Restoration Correctness

After returning from a branch, the column and both diagonal sets must exactly match their pre-placement state.

A missing `delete()` can silently invalidate later branches.

This is one of the most important backtracking invariants.

## 30. Complexity

The raw search space is approximately `N^N` if every row independently considers every column.

Column uniqueness reduces this to at most `N!` row-to-column assignments before diagonal pruning.

Actual runtime is much smaller for many instances because diagonal conflicts prune branches early, but worst-case search remains exponential.

## 31. Space Complexity

The standard recursive solver uses:

```text
O(N)
```

for the placement and occupancy state, excluding stored solutions.

If all solutions are materialized, output memory can dominate.

## 32. Parallel Search

Different first-row branches are independent after symmetry decisions.

They can conceptually be distributed across workers for large enumeration workloads.

The challenge is balancing branch sizes and controlling result aggregation.

## 33. Deterministic Parallelism

For reproducible output, define a stable row/column ordering and merge results according to that ordering.

Do not assume worker completion order is deterministic.

## 34. Generalized N-Queens

Variants may include:

- blocked cells
- weighted cells
- forbidden columns
- pre-placed queens
- rectangular boards
- different attack rules
- required/forbidden positions

The state must explicitly represent the added constraints.

## 35. Pre-Placed Queens

Validate all fixed queens before search.

Initialize the occupancy structures with those placements and begin recursion from the first unassigned row.

Contradictory fixed placements should be rejected immediately.

## 36. Blocked Cells

When a board cell is blocked, simply omit it from that row's candidate domain.

If a row has no legal candidate, the state is immediately infeasible.

## 37. Rectangular Boards

For `R × C` boards, the one-queen-per-row formulation may seek up to `min(R,C)` placements depending on the problem contract.

Do not assume the square-board semantics automatically apply.

## 38. Constraint Graph View

Each row variable has a domain of columns.

Pairs of variables have constraints forbidding equal columns and diagonal relationships.

This connects N-Queens directly to general CSP techniques from graph coloring and scheduling.

## 39. SAT / ILP Formulation

Introduce binary variable:

```text
x[r,c] = 1 if a queen occupies (r,c)
```

Then encode exactly-one constraints for rows and columns plus diagonal at-most-one constraints.

This allows general-purpose solvers to handle extended variants.

## 40. Testing Strategy

Use multiple independent approaches:

- naive conflict scanning
- optimized sets
- bitmask solver
- independent validator
- known solution counts
- brute-force tiny boards

Agreement across independent implementations is stronger evidence than testing only one implementation against itself.

## 41. Metamorphic Testing

For standard N-Queens:

- rotating a solution yields another solution
- reflecting a solution yields another solution
- permuting solution enumeration order must not change the solution set

For counting, symmetry transformations preserve the total count.

## 42. Adversarial Testing

Test:

- `N = 0` according to explicit API semantics
- `N = 1,2,3,4`
- larger `N`
- pre-placed conflicting queens
- nearly complete valid placements
- heavily blocked boards
- generalized constraints

## 43. Benchmark Metrics

Measure:

- recursive nodes
- candidate checks
- placements
- backtracks
- propagation deletions
- symmetry-pruned branches
- solutions found
- maximum depth
- runtime
- memory

Compare naive, Set-based, bitmask, propagation, and symmetry-aware variants.

## 44. Backend Applications

The CSP pattern maps to:

- conflict-free resource assignment
- deployment topology placement
- test execution slot assignment
- dependency-compatible scheduling
- configuration generation

The chessboard is merely a compact constraint model; the engineering lesson is state representation plus safe pruning.

## 45. AI Applications

N-Queens-style search appears in:

- constrained planning
- experiment assignment
- tool/resource conflict resolution
- puzzle and game search
- exact validation of model-generated assignments

A learned heuristic can prioritize candidates while deterministic constraints guarantee legality.

## 46. Hybrid AI + CSP

```text
AI proposes candidate ordering
→ CSP search applies hard constraints
→ propagation prunes impossible states
→ validator verifies final assignments
```

This separates probabilistic guidance from deterministic correctness.

## 47. Implementation Lab

Implement:

1. naive N-Queens solver
2. Set-based optimized solver
3. solution counter
4. full solution enumerator
5. independent validator
6. bitmask solver
7. symmetry-aware counter
8. forward-checking solver
9. pre-placed-queen variant
10. blocked-cell variant
11. generalized CSP formulation
12. brute-force differential oracle
13. benchmark harness
14. Backend conflict-assignment variant
15. AI assignment validator

## 48. Interview Framework

Explain:

```text
Variable:
row

Domain:
columns 0..N-1

Constraints:
unique columns
unique row-col
unique row+col

Choice:
legal column

Transition:
place → recurse → remove

Base:
all rows assigned

Optimization:
O(1) conflict checks + bitmasks + safe symmetry/propagation
```

## 49. Revision Checklist

- [ ] Model N-Queens as a CSP.
- [ ] Explain why one queen per row is sufficient.
- [ ] Encode both diagonal families.
- [ ] Implement Set-based O(1)-expected conflict checks.
- [ ] Preserve the apply/undo invariant.
- [ ] Distinguish feasibility, counting, and enumeration APIs.
- [ ] Understand `N!` as a reduced baseline search space.
- [ ] Implement bitmask search and JavaScript BigInt boundaries.
- [ ] Understand symmetry breaking and its proof obligation.
- [ ] Implement forward checking.
- [ ] Validate independently.
- [ ] Differential-test multiple solvers.
- [ ] Extend the model to blocked/pre-placed constraints.
- [ ] Apply CSP reasoning to Backend and AI assignment problems.

## Key Takeaways

1. N-Queens is a canonical CSP/backtracking problem.
2. Modeling one variable per row removes an entire dimension of unnecessary state.
3. `row-col` and `row+col` provide constant-time diagonal conflict keys.
4. Exact apply/undo restoration is central to correctness.
5. Bitmasks, propagation, symmetry breaking, and candidate ordering improve practical search.
6. Symmetry reduction is an optimization only when its equivalence assumptions are proved.
7. Independent validators and differential solvers are essential for trustworthy optimization.
8. The deeper lesson is reusable: represent constraints compactly, prune only when safe, and preserve invariants.
