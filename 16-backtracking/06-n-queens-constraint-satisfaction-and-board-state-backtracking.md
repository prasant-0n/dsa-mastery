# 16.06 — N-Queens, Constraint Satisfaction & Board-State Backtracking

## 1. Concept Definition

N-Queens asks us to place `n` queens on an `n × n` chessboard so that no two queens attack each other.

The problem is a canonical **constraint satisfaction problem (CSP)** and a foundational example of board-state backtracking.

## 2. Constraints

Two queens cannot share:

- a row
- a column
- a main diagonal
- an anti-diagonal

## 3. Row-by-Row Mental Model

Place exactly one queen in each row:

```text
row 0 → choose column
row 1 → choose column
row 2 → choose column
...
row n-1 → choose column
```

This removes the need to consider multiple queens in the same row.

## 4. Core State

Maintain:

```text
row
columns
mainDiagonals
antiDiagonals
```

Optional state:

```text
board
solutions
count
trace
```

## 5. Diagonal Encoding

For cell `(row, col)`:

```text
main diagonal: row - col
anti diagonal: row + col
```

These values uniquely identify each diagonal.

## 6. Safe Placement

A queen can be placed when:

```text
column is unused
row - column is unused
row + column is unused
```

Because each recursion level represents a distinct row, row conflicts are already eliminated.

## 7. Apply / Undo

On placement:

```text
columns.add(col)
mainDiagonals.add(row - col)
antiDiagonals.add(row + col)
```

After recursion:

```text
columns.delete(col)
mainDiagonals.delete(row - col)
antiDiagonals.delete(row + col)
```

Restoration is part of correctness.

## 8. Base Case

When:

```text
row === n
```

all rows contain a valid queen placement.

Record the board or increment the solution count.

## 9. Search Complexity

A simple row-by-row solver has at most:

```text
n^n
```

candidate assignments before constraint pruning.

Because columns are unique, the actual unconstrained candidate tree is bounded by:

```text
n!
```

Worst-case behavior remains exponential/factorial-scale rather than polynomial.

## 10. Why Backtracking Works

If a partial placement already violates a constraint, no extension can repair that violation.

Therefore the entire descendant subtree can be discarded safely.

## 11. Bitmask Representation

For moderate `n`, sets can be replaced with bitmasks:

```text
columnsMask
diag1Mask
diag2Mask
```

Available positions can then be computed with bit operations.

## 12. Bitmask Formula

A common formulation derives available columns from:

```text
available = fullMask & ~(columns | diag1 | diag2)
```

Diagonal masks must be shifted appropriately when moving to the next row.

## 13. Bitwise JavaScript Boundary

JavaScript bitwise operators operate on signed 32-bit integers.

For larger board sizes, ordinary bitwise masks cannot represent arbitrary-width boards.

`BigInt` bit operations can extend the technique, but mixing `Number` and `BigInt` is not allowed without explicit conversion.

## 14. Board Representation

Possible representations:

```text
array of columns
string rows
2D matrix
bitmasks
```

The column-array representation is compact:

```text
solution[row] = column
```

## 15. Output Materialization

A solution can be represented as:

```text
[1, 3, 0, 2]
```

or rendered into board strings:

```text
.Q..
...Q
Q...
..Q.
```

Keep the internal representation compact and materialize only when required.

## 16. Counting vs Enumeration

If the task asks only for the number of solutions, do not store every board.

Return:

```text
count += solve(nextRow)
```

This can dramatically reduce memory.

## 17. Finding One Solution

For existence, stop immediately after finding a valid complete placement.

This changes practical runtime and output requirements without changing the underlying search model.

## 18. Symmetry Breaking

The N-Queens board has geometric symmetries.

For counting, the first-row column can sometimes be restricted to one side and mirrored solutions accounted for separately.

Any symmetry reduction must preserve the required notion of solution identity.

## 19. First-Row Symmetry

For many standard N-Queens formulations, reflections pair solutions.

A solver can exploit this by solving representative first-row columns and applying the corresponding multiplicity carefully, with a separate treatment for the central column when `n` is odd.

## 20. Constraint Propagation

After placing a queen, mark columns and diagonals unavailable for future rows.

This is a simple form of constraint propagation.

More general CSPs can propagate domains for every unassigned variable.

## 21. Minimum Remaining Values

Instead of always assigning rows in order, a generalized CSP solver can select the variable with the smallest remaining legal domain.

This is the **MRV / fail-first heuristic**.

For ordinary N-Queens, row ordering is already highly structured, so the benefit must be measured rather than assumed.

## 22. Forward Checking

After each assignment, verify that every remaining row still has at least one legal column.

If any row has zero candidates, backtrack immediately.

This detects future failure before reaching that row.

## 23. Arc Consistency Boundary

General CSPs can enforce stronger consistency such as arc consistency.

For N-Queens, specialized bitmask propagation is often simpler and faster than a generic CSP framework.

## 24. Constraint Graph

Each queen variable is a row.

Its domain is the set of possible columns.

Binary constraints prohibit equal columns and diagonal conflicts between pairs of rows.

This gives N-Queens a natural CSP graph interpretation.

## 25. Alternative Variable Model

Instead of one variable per row, one can formulate one variable per queen with row and column domains.

The row-by-row formulation is preferable for the standard problem because it encodes one queen per row directly.

## 26. Exact Cover Connection

N-Queens can be expressed as an exact-cover problem using constraints for:

- rows
- columns
- diagonals

This connects the problem to Algorithm X and Dancing Links.

## 27. Algorithm X Boundary

Algorithm X recursively selects rows from an exact-cover matrix while satisfying all required columns.

It is another exact-search framework rather than a fundamentally different notion of constraint reasoning.

## 28. SAT / ILP Connection

N-Queens can also be encoded as:

- SAT
- integer linear programming
- constraint programming

These formulations become useful when learning general solver architectures.

## 29. Minimum-Conflict Heuristic

For local-search variants, queens can be moved toward positions with fewer conflicts.

This is useful for large instances where enumeration of every solution is unnecessary.

It is heuristic rather than the exact backtracking guarantee.

## 30. Randomized Search

Randomized candidate ordering can explore different parts of the tree.

It can be useful for finding one solution, but it does not remove the need for correctness checks.

## 31. General Board-State Pattern

N-Queens teaches a reusable template:

```text
choose a variable
→ enumerate legal values
→ apply constraints
→ recurse
→ undo
```

This same pattern appears in Sudoku, graph coloring, scheduling, configuration, and planning.

## 32. Sudoku Connection

Sudoku chooses a value for a cell while maintaining row, column, and subgrid constraints.

The MRV heuristic is often particularly effective because different cells can have dramatically different domain sizes.

## 33. Graph Coloring Connection

Assign a color to each vertex while preventing adjacent vertices from sharing a color.

The state consists of partial assignments plus the used colors of neighboring vertices.

## 34. Scheduling Connection

A scheduling CSP can assign tasks to time/resource slots while enforcing:

- precedence
- capacity
- incompatibility
- deadlines

The search framework is the same even though the constraints differ.

## 35. Backend Applications

Board-style CSP backtracking maps to:

- deployment placement
- resource-slot assignment
- service topology constraints
- test scheduling
- configuration validation
- dependency-aware rollout planning

Exact search is suitable for small constrained spaces; large production problems usually need stronger optimization or solver techniques.

## 36. AI Applications

CSP-style backtracking can support:

- structured planning
- tool/resource assignment
- constrained generation
- experiment configuration
- evaluation-set construction
- symbolic reasoning

It can serve as an exact verifier or small-state planner alongside learned models.

## 37. Correctness Invariant

At recursion depth `row`:

> Exactly one queen has been assigned to every row before `row`, and no assigned queens share a column or diagonal.

The constraint sets exactly represent conflicts created by the current partial board.

## 38. Completeness Proof

For each row, every legal column is considered.

Every valid N-Queens board has exactly one column choice for each row.

Therefore its assignment appears as one root-to-leaf search path.

Pruning removes only states that already violate an unavoidable constraint.

## 39. Termination

Every recursive call advances the row by one.

The maximum depth is `n`.

Therefore the search terminates for every finite `n`.

## 40. Edge Cases

Handle:

- `n = 0` according to the API contract
- `n = 1`
- `n = 2`
- `n = 3`
- large `n`
- count-only mode
- one-solution mode
- enumeration mode

The standard N-Queens problem has no solutions for `n = 2` or `n = 3`.

## 41. Testing Strategy

Verify known small counts and validate every returned board independently.

For every solution:

```text
one queen per row
one queen per column
diagonal uniqueness
anti-diagonal uniqueness
```

## 42. Brute-Force Oracle

For very small `n`, enumerate column assignments directly and compare the optimized solver's output/count.

This validates both pruning and bitmask implementations.

## 43. Differential Testing

Compare:

```text
Set-based solver
vs
bitmask solver
vs
exact-cover formulation where implemented
```

Normalize solution representations before comparison.

## 44. Metamorphic Testing

Useful transformations include board reflection and horizontal/vertical symmetry where the output contract permits them.

A transformed valid solution should remain valid under the corresponding board transformation.

## 45. Performance Metrics

Measure:

- recursive nodes
- rejected candidates
- solutions found
- maximum depth
- runtime
- memory
- pruning ratio

Do not judge an optimization from runtime alone; verify it preserves the solution set.

## 46. Complexity Analysis

The search is exponential/factorial-scale in general.

Bitmasks improve constant factors and state representation, while symmetry breaking and propagation reduce practical search.

There is no general polynomial-time exact algorithm for arbitrary N-Queens enumeration implied by these optimizations.

## 47. Implementation Lab

Implement:

1. Set-based N-Queens solver
2. count-only solver
3. first-solution solver
4. board-rendering solver
5. bitmask solver
6. symmetry-aware solver
7. forward-checking solver
8. solution generator
9. independent solution validator
10. brute-force oracle for small `n`
11. differential test harness
12. performance benchmark
13. Sudoku-style generic CSP engine
14. graph-coloring backtracking solver
15. constraint-based scheduling prototype

## 48. Interview Framework

Explain:

```text
Variable:
current row

Domain:
columns 0..n-1

Constraints:
column + both diagonals

Choice:
place queen in legal column

Transition:
apply → recurse → undo

Base:
row === n

Complexity:
exponential/factorial-scale search in general
```

Then discuss bitmasks, symmetry breaking, and forward checking as optimizations.

## 49. Revision Checklist

- [ ] Explain N-Queens as a CSP.
- [ ] Derive `row - col` and `row + col` diagonal identities.
- [ ] Implement Set-based backtracking.
- [ ] Maintain apply/undo invariants.
- [ ] Implement count-only and first-solution modes.
- [ ] Implement bitmask optimization.
- [ ] Understand JavaScript 32-bit bitwise limits.
- [ ] Understand `BigInt` bitmasks.
- [ ] Understand symmetry breaking.
- [ ] Understand forward checking.
- [ ] Understand MRV.
- [ ] Connect N-Queens to Sudoku and graph coloring.
- [ ] Understand exact-cover, SAT, and ILP formulations.
- [ ] Build an independent validator.
- [ ] Differential-test multiple implementations.
- [ ] Apply CSP backtracking to Backend and AI planning problems.

## Key Takeaways

1. N-Queens is a canonical CSP and board-state backtracking problem.
2. Row-by-row assignment dramatically simplifies the state space.
3. `row - col` and `row + col` provide constant-time diagonal conflict checks.
4. Apply/undo correctness is as important as candidate selection.
5. Bitmasks, propagation, symmetry breaking, and candidate ordering improve practical performance.
6. Generic CSP ideas such as MRV and forward checking generalize far beyond chess boards.
7. Exact search can be replaced or complemented by Algorithm X, SAT, ILP, or heuristic search depending on the problem.
8. The same state/constraint/search/undo model is valuable for Backend configuration and AI planning.
