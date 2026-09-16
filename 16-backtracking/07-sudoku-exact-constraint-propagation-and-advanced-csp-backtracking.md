# 16.07 — Sudoku, Exact Constraint Propagation & Advanced CSP Backtracking

## 1. Concept Definition

Sudoku is a constraint satisfaction problem (CSP). Each empty cell is a variable, its legal digits form its domain, and row, column, and box rules define constraints.

The goal is to complete the board so every required constraint is satisfied.

## 2. CSP Mental Model

```text
Variables → empty cells
Domains   → candidate digits
Constraints → row / column / box uniqueness
Search    → assign → propagate → recurse → undo
```

## 3. State Representation

A practical solver may maintain:

```text
board
row masks/sets
column masks/sets
box masks/sets
candidate domains
```

For repeated solving, keep immutable puzzle input separate from mutable search state.

## 4. Candidate Domain

For cell `(r,c)`, a digit is legal when it is absent from:

- row `r`
- column `c`
- box containing `(r,c)`

The domain is the intersection of these constraints.

## 5. Basic Backtracking

The baseline algorithm is:

```text
choose empty cell
choose candidate
place value
recurse
undo
```

It is correct but can explore a very large search tree without variable ordering and propagation.

## 6. Minimum Remaining Values

Choose the empty cell with the smallest candidate domain.

This is MRV, or the fail-first heuristic.

A cell with one candidate should be resolved before a cell with many candidates.

## 7. Degree Heuristic

When several variables tie under MRV, prefer the variable constraining the largest number of remaining variables.

This can expose contradictions earlier.

## 8. Value Ordering

After selecting a cell, order candidate values by their effect on future domains.

A least-constraining-value heuristic tries values that leave more options for peers first.

This is primarily a search-order heuristic; correctness does not depend on it.

## 9. Forward Checking

After assigning a value, remove that value from every peer's domain.

If any peer domain becomes empty, backtrack immediately.

## 10. Constraint Propagation

Propagation repeatedly applies deterministic consequences of assignments until no further change occurs or a contradiction appears.

This creates a fixed point before branching again.

## 11. Naked Single

If a cell's domain contains exactly one value, that value is forced.

Assign it and continue propagation.

## 12. Hidden Single

Within a row, column, or box, if a digit can occur in only one cell, that placement is forced even if the cell has other candidates.

## 13. Naked Pair

If two cells in a unit have exactly the same two candidates, those two digits must occupy those cells.

Those candidates can be removed from other cells in the unit.

## 14. Naked Triple

A generalized subset rule uses three cells whose combined candidate set contains exactly three digits.

Those digits can be removed from other cells in the unit.

## 15. Hidden Pair

If two digits occur only in the same two cells of a unit, other candidates can be removed from those cells.

This is stronger than simple single-value propagation but requires careful domain bookkeeping.

## 16. Locked Candidates

A candidate confined to one row within a box, or one column within a box, can be removed from the corresponding row/column outside that box.

This is another form of constraint propagation.

## 17. Propagation Safety

Every elimination must be justified by the Sudoku constraints.

Never remove a candidate merely because it seems unlikely.

An incorrect elimination destroys completeness.

## 18. Contradiction Detection

Common contradictions include:

- an empty cell has no candidates
- a unit contains duplicate assigned values
- a required digit has no possible position in a unit
- a given clue conflicts with another clue

Detecting contradictions early is central to efficient search.

## 19. Assignment Invariant

At every search state:

> Every assigned digit is legal under the original clues and all other current assignments, and every retained candidate remains potentially legal under the enforced constraints.

## 20. Apply / Undo

If domains are mutated during recursion, every mutation must be recorded so it can be reversed exactly.

A change log is safer than trying to reconstruct state heuristically.

## 21. Domain Change Log

Record changes such as:

```text
(cell, removedValue)
```

Then undo them in reverse order.

This makes restoration explicit and testable.

## 22. Bitmask Representation

For a standard 9×9 Sudoku, a bitmask can represent available digits compactly.

For example, one bit per digit allows constant-time-style membership and fast candidate intersections.

## 23. Bitmask Candidate Formula

Conceptually:

```text
available = FULL_MASK & ~(rowMask | columnMask | boxMask)
```

The exact digit-to-bit convention is an implementation detail but must remain consistent.

## 24. Bitmask Benefits

Bitmasks reduce:

- candidate allocation
- set membership overhead
- repeated scanning
- state size

They are especially useful in hot recursive loops.

## 25. Memoization Boundary

Memoization is useful when the same logical state can recur.

Serialize only information that completely determines the remaining problem.

Memoizing an incomplete state key can return incorrect results.

## 26. Counting Solutions

For uniqueness checking, stop after finding two solutions.

There is no need to enumerate every solution when the question is simply:

```text
0, 1, or more than 1?
```

## 27. Puzzle Generation

Generating a puzzle typically starts from a solved board and removes clues while preserving desired properties.

For a uniquely solvable puzzle, every removal must be checked against a uniqueness solver.

## 28. Difficulty

Human difficulty and computational difficulty are not identical.

A puzzle may be solved quickly by a program but require advanced human deduction, or vice versa.

Do not equate recursion node count directly with human difficulty.

## 29. Exact Cover Connection

Each possible `(row, column, digit)` assignment can correspond to an exact-cover row satisfying constraints such as:

- each cell gets one digit
- each row contains each digit once
- each column contains each digit once
- each box contains each digit once

This leads naturally to Algorithm X.

## 30. Algorithm X

Algorithm X performs exact-cover search using recursive choice and constraint elimination.

Dancing Links is a specialized data structure that makes sparse exact-cover updates efficient.

## 31. SAT / ILP Formulations

Sudoku can also be encoded as Boolean or integer constraints.

These formulations are valuable for understanding how general-purpose solvers represent combinatorial constraints.

## 32. CSP vs Specialized Solver

A generic CSP solver provides reusable infrastructure:

```text
variables
+ domains
+ constraints
+ propagation
+ heuristics
+ backtracking
```

A Sudoku-specific solver can exploit board structure and bitmasks for lower overhead.

## 33. Constraint Graph

Each cell is connected to cells sharing its row, column, or box.

The graph helps explain domain propagation and variable-degree heuristics.

## 34. Arc Consistency

Arc consistency removes a value from one variable when no compatible value remains in a related variable's domain.

For Sudoku, specialized unit propagation is often easier to implement, but the CSP concept generalizes broadly.

## 35. Search Strategy Comparison

Compare:

```text
naive first-empty
MRV
MRV + degree
MRV + forward checking
MRV + propagation
bitmask + propagation
exact cover
```

The correct comparison should measure nodes, backtracks, constraint operations, runtime, and memory—not just wall-clock time.

## 36. Backend Applications

Advanced CSP backtracking applies to:

- deployment configuration
- resource assignment
- service placement
- dependency-aware scheduling
- feature compatibility
- infrastructure configuration validation

Sudoku is useful because it teaches a general architecture rather than because production systems literally contain Sudoku boards.

## 37. AI Applications

CSP techniques can support:

- structured planning
- tool assignment
- experiment configuration
- constrained generation
- evaluation-set construction
- symbolic verification

A learned model can propose candidates while an exact CSP layer verifies hard constraints.

## 38. Hybrid AI + CSP Pattern

A useful architecture is:

```text
AI proposes
→ CSP validates/repairs
→ exact constraints guarantee legality
```

This separates probabilistic proposal from deterministic constraint enforcement.

## 39. Correctness Proof

If every assignment is checked against all Sudoku constraints and every legal candidate is considered, every valid completion remains reachable.

Propagation is correct when every elimination follows logically from the constraints.

Backtracking restores all temporary state before exploring another branch.

## 40. Completeness

A complete solver must not permanently discard a candidate unless a valid constraint proves it impossible.

Search ordering may change the order of discovery but cannot remove valid solutions.

## 41. Termination

Each successful assignment reduces the number of empty cells.

Each finite propagation step either changes finite domains or reaches a fixed point.

Therefore a finite puzzle search terminates when the implementation guarantees finite branching and exact restoration.

## 42. Edge Cases

Test:

- already solved board
- empty board
- invalid clue
- contradictory row
- contradictory column
- contradictory box
- no solution
- unique solution
- multiple solutions
- nearly solved puzzle

## 43. Validation

Never trust the solver's own internal state as the only validator.

Use an independent validator to check:

```text
rows
columns
boxes
given clues
```

This catches correlated implementation errors.

## 44. Brute-Force Oracle

For very small generalized CSP instances, construct a simple exhaustive oracle.

Compare optimized propagation and heuristic solvers against it.

For standard Sudoku, independent solver implementations can serve as differential oracles.

## 45. Property Testing

Useful properties include:

- every returned board is valid
- every given clue remains unchanged
- solving an already solved board returns it unchanged
- a puzzle reported unsatisfiable has no valid completion in small oracle cases
- count mode and enumeration mode agree on small instances

## 46. Metamorphic Testing

Apply valid transformations such as digit relabeling, row permutations within bands, and column permutations within stacks.

The transformed puzzle should have a correspondingly transformed solution set.

## 47. Adversarial Testing

Include puzzles that cause:

- large search trees
- deep contradictions
- many equal MRV domains
- expensive propagation
- high candidate density
- nearly solved states

These expose heuristic and restoration bugs.

## 48. Complexity

Sudoku solving is exponential in general search formulations.

MRV, propagation, bitmasks, and specialized constraints can reduce practical search dramatically but do not make arbitrary exact CSP solving polynomial.

Memory depends on board state, candidate domains, recursion depth, memoization, and output requirements.

## 49. Implementation Lab

Implement:

1. naive Sudoku backtracking
2. independent validator
3. MRV solver
4. degree tie-breaker
5. least-constraining-value ordering
6. forward checking
7. propagation to fixpoint
8. naked/hidden singles
9. pair and locked-candidate techniques
10. bitmask solver
11. uniqueness checker
12. memoized solver
13. exact-cover / Algorithm X solver
14. puzzle generator
15. differential test harness
16. generic CSP engine
17. Backend configuration CSP prototype
18. AI constrained-planning prototype

## 50. Interview Framework

Explain:

```text
Variables:
empty cells

Domains:
legal digits

Constraints:
row + column + box

Heuristic:
MRV

Propagation:
remove impossible values

Choice:
assign a candidate

Transition:
apply → recurse → undo

Base:
no empty cells

Optimization:
bitmasks + propagation
```

Then discuss correctness, completeness, and why every pruning rule is safe.

## 51. Revision Checklist

- [ ] Explain Sudoku as a CSP.
- [ ] Build row/column/box constraints.
- [ ] Calculate candidate domains.
- [ ] Implement naive backtracking.
- [ ] Implement MRV.
- [ ] Understand degree and value-ordering heuristics.
- [ ] Implement forward checking.
- [ ] Implement propagation to a fixed point.
- [ ] Understand naked and hidden singles.
- [ ] Understand pairs and locked candidates.
- [ ] Maintain exact apply/undo logs.
- [ ] Implement bitmask candidates.
- [ ] Implement uniqueness checking.
- [ ] Understand memoization boundaries.
- [ ] Understand exact cover and Algorithm X.
- [ ] Understand SAT/ILP formulations.
- [ ] Build independent validation and differential tests.
- [ ] Apply CSP architecture to Backend and AI problems.

## Key Takeaways

1. Sudoku is a concrete, rich example of CSP backtracking.
2. The key abstractions are variables, domains, constraints, propagation, heuristics, and restoration.
3. MRV and forward checking reduce wasted search by exposing failures early.
4. Propagation techniques are safe only when every elimination follows from a proven constraint.
5. Bitmasks provide compact, fast state representation for fixed-size Sudoku.
6. Exact cover, SAT, ILP, and generic CSP solvers provide alternative formulations of the same constraint system.
7. Independent validators and brute-force/differential testing are essential for trustworthy optimization.
8. The architecture generalizes directly to constrained Backend configuration and AI planning.
