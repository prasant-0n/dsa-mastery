# 16.09 — Word Search, Grid Backtracking & Multi-Directional State Exploration

## 1. Concept Definition

Word Search asks whether a target sequence can be traced through adjacent cells of a grid while respecting movement and reuse constraints.

The canonical version allows movement up, down, left, and right, with each cell used at most once in one path.

## 2. Backtracking Model

```text
State  → current cell + position in word + visited cells
Choice → neighboring cell matching next character
Constraint → bounds + character match + no reuse
Transition → mark → recurse → unmark
Base → entire word matched
```

## 3. Why Backtracking Fits

A path choice changes the future legal moves. A failed continuation must return to the previous cell and try another direction.

This is a search tree over possible paths.

## 4. Grid Coordinates

Represent a cell as `(row, col)`.

For a rectangular grid:

```text
0 <= row < rows
0 <= col < cols
```

Never rely on implicit array behavior for boundary checks.

## 5. Four-Directional Movement

The standard neighbor set is:

```text
[-1,0]
[1,0]
[0,-1]
[0,1]
```

Diagonal movement changes the problem and must be explicitly requested.

## 6. Eight-Directional Movement

Some variants permit all eight neighboring directions.

The same search architecture works, but the branching factor increases.

## 7. Visited-State Requirement

If cells cannot be reused within one word path, maintain visited state.

Possible representations:

- 2D boolean matrix
- Set of encoded coordinates
- flat boolean array
- bitmask for very small grids

## 8. In-Place Marking

A common optimization temporarily replaces a visited cell with a sentinel.

This avoids allocating a separate visited matrix but requires exact restoration.

Never choose a sentinel that can collide with legitimate input without an explicit escape strategy.

## 9. Flat Index Encoding

For a fixed-width grid:

```text
id = row * cols + col
```

A flat visited array can then reduce nested-object overhead.

## 10. Search Function

Conceptually:

```text
search(row, col, index)
```

At each call:

1. validate cell
2. compare character
3. check visited
4. mark
5. explore neighbors
6. unmark

## 11. Base Case Ordering

Check the character at the current position before declaring success unless the API deliberately defines an empty-word behavior.

For `index === word.length - 1`, a matching current cell completes the search.

## 12. Empty Word

An empty target needs an explicit contract.

Depending on the API, it may return true because no cells are required, or be rejected as invalid input.

Do not leave this behavior accidental.

## 13. Character Frequency Pruning

Before search, compare character frequencies in the board and target.

If the board contains fewer copies of any required character than the target, the search can safely return false.

This is a global feasibility check.

## 14. Endpoint Heuristics

If one endpoint character is rarer than the other, reversing the target can reduce the number of starting cells.

This changes search order only; it does not change existence.

## 15. Starting-Cell Enumeration

For existence search, begin only from cells matching the first target character.

For multiple words, building a shared prefix structure can avoid repeated traversal.

## 16. Trie Connection

When searching for many words simultaneously, a Trie can represent shared prefixes.

Grid traversal then advances through both:

```text
board state
+
Trie state
```

This turns repeated word searches into a unified backtracking problem.

## 17. Word Search II Pattern

For multiple targets:

```text
Trie root
→ choose matching grid cell
→ advance Trie node
→ explore neighbors
→ report terminal words
```

Removing discovered words or terminal markers can prevent duplicate output, subject to the API contract.

## 18. Duplicate Words

Input may contain duplicate targets.

Decide whether the output should preserve duplicates or return unique words.

Trie-based deduplication is often useful when unique output is required.

## 19. Branching Factor

If each state has at most `b` candidate neighbors and the target length is `L`, a loose search bound is exponential in `L`.

The no-reuse constraint reduces the available choices after the first step.

## 20. Complexity

For a single word, a typical upper-bound description is:

```text
O(R * C * 4 * 3^(L-1))
```

for a four-direction, no-reuse grid under a simple implementation, because after the first move at most three unvisited directions remain.

Space is `O(R*C)` for visited state plus recursion depth `O(L)`; the exact representation changes constants.

## 21. Why the Bound Is Loose

Character mismatches, boundaries, visited cells, and grid structure often prune far more branches than the theoretical bound suggests.

Benchmark actual node counts rather than assuming the loose bound predicts real runtime.

## 22. Correctness Invariant

During recursion:

> The current path spells exactly the target prefix through legal adjacent cells, and no cell appears more than once in the current path.

Marking and unmarking preserve this invariant across sibling branches.

## 23. Completeness

Every legal continuation is considered from each path state.

Therefore every valid target path is reachable unless an optimization incorrectly prunes it.

Global frequency pruning is safe because a missing required character makes any completion impossible.

## 24. Symmetry and Search Order

Changing direction order, reversing the word, or choosing different starting cells changes traversal order but not the set of valid paths.

This makes such transformations useful for performance experiments and metamorphic tests.

## 25. Duplicate-State Boundaries

For a single target with no cell reuse, the path itself determines the visited cells and current position.

Memoization can sometimes use `(position, index, visited-set)` as a state, but the visited set can make the key large.

Memoization is more attractive in variants where many paths converge to the same compact state.

## 26. Bitmask State

For grids with at most the machine word's practical bit capacity, visited cells can be represented as bits.

For larger grids, JavaScript `BigInt` or another bitset representation can encode larger masks, with corresponding performance and memory trade-offs.

## 27. Obstacles

Blocked cells simply become unavailable states.

The same approach supports maze-like path search when the target sequence is replaced by another state condition.

## 28. Weighted Grid Variant

If moving through a cell incurs cost, the problem becomes a path optimization problem rather than pure existence.

Backtracking can enumerate small instances, but shortest-path algorithms are usually more appropriate when state reuse and graph structure permit them.

## 29. State-Dependent Constraints

Variants may constrain:

- maximum turns
- exact number of cells
- required special cells
- resource budget
- direction changes
- forbidden patterns

Add these to the explicit state rather than hiding them in global variables.

## 30. Multiple Targets

For a list of words, independent searches repeat work on shared prefixes.

A Trie allows shared prefix traversal and is the natural bridge to the Trie phase of DSA.

## 31. Backend Applications

Grid/path backtracking concepts map to:

- workflow state exploration
- dependency-path validation
- constrained route enumeration
- configuration search
- small topology exploration
- test-path generation

Real backend routing should usually use graph algorithms when the state space is large and weights or shortest paths matter.

## 32. AI Applications

The pattern is useful for:

- symbolic grid reasoning
- game-state exploration
- puzzle solving
- constrained sequence/path generation
- multimodal spatial reasoning validation
- search-based evaluation of model-proposed paths

An AI model can propose a path while an exact search validator checks legality.

## 33. Hybrid AI + Search

A useful architecture is:

```text
model proposes candidate/order
→ deterministic constraints validate
→ backtracking repairs or searches alternatives
```

This is especially useful when the model's output is probabilistic but constraints are exact.

## 34. Generic Grid Backtracking Template

```text
search(state):
    if goal(state): return success
    for move in legalMoves(state):
        apply(move)
        if search(nextState): return success
        undo(move)
    return failure
```

The template generalizes to puzzles, planning, and constrained generation.

## 35. Multiple-Solution Enumeration

Do not stop after the first solution when the API requires all paths.

Store or stream solutions according to memory requirements.

For large output sets, streaming is preferable to materializing everything.

## 36. Counting Paths

If only the number of valid paths matters, accumulate counts instead of storing every path.

The count can still be exponential, so consider overflow semantics and arbitrary-precision requirements.

## 37. BigInt Counting

JavaScript `Number` cannot exactly represent all large integers.

Use `BigInt` when exact counts can exceed `Number.MAX_SAFE_INTEGER`, and keep numeric types consistent at API boundaries.

## 38. Path Reconstruction

If the recursion itself represents the current path, push coordinates on entry and pop on exit.

A copied path should be created only when a solution is emitted; otherwise sibling recursion would mutate the stored answer.

## 39. Testing Strategy

Test:

- empty grid
- one cell
- one-character word
- impossible first character
- repeated characters
- repeated grid characters
- boundary paths
- long winding paths
- blocked cells
- duplicate words
- all-direction variants
- multiple solutions

## 40. Independent Validator

Given a returned path, independently verify:

1. coordinates are in bounds
2. consecutive cells are adjacent
3. no cell repeats when prohibited
4. characters match the target sequence
5. obstacles are not used

Do not rely solely on the search routine's own state checks.

## 41. Brute-Force Oracle

For tiny grids, enumerate all simple paths up to target length and compare the optimized solver.

This is particularly effective for validating pruning and in-place mutation restoration.

## 42. Metamorphic Testing

Useful properties include:

- reversing a valid path yields a valid path for the reversed word
- permuting equivalent direction ordering preserves existence
- reflecting the entire grid and target path preserves existence
- adding an obstacle cannot create a new path
- removing an obstacle cannot destroy an existing path

These properties catch subtle state bugs.

## 43. Adversarial Cases

Construct grids with:

- many repeated target characters
- long nearly-valid prefixes
- many branches that fail at the final character
- large open regions
- dense duplicate words

These workloads expose poor pruning and restoration errors.

## 44. Benchmark Metrics

Measure:

- starting cells
- recursive calls
- character checks
- rejected moves
- successful paths
- maximum depth
- runtime
- memory

Compare baseline, frequency-pruned, reversed-word, bitmask, and Trie variants independently.

## 45. Exact vs Heuristic Search

For a finite target and exact constraints, backtracking provides complete search when implemented correctly.

Heuristic ordering improves practical performance but must not become an unsound pruning rule.

## 46. Interview Framework

Explain:

```text
State:
(row, col, index, visited)

Constraint:
legal neighbor + matching character + no reuse

Choice:
neighbor direction

Transition:
mark → recurse → unmark

Base:
word fully matched

Optimization:
frequency check + search ordering + compact visited state
```

Then derive the exponential complexity and explain why the `3^(L-1)` bound appears for four-direction no-reuse traversal.

## 47. Implementation Lab

Implement:

1. single-word Word Search
2. independent path validator
3. in-place visited marking
4. flat visited representation
5. frequency precheck
6. reversed-word heuristic
7. path enumeration
8. path counting
9. bitmask visited state
10. obstacle-aware search
11. multi-word Trie search
12. duplicate-output handling
13. brute-force oracle
14. differential test harness
15. Backend constrained path validator
16. AI spatial/search validator

## 48. Revision Checklist

- [ ] Model Word Search as backtracking.
- [ ] Define exact state and invariants.
- [ ] Implement boundary and character checks.
- [ ] Implement visited marking and restoration.
- [ ] Understand in-place sentinel risks.
- [ ] Derive the loose `O(R*C*4*3^(L-1))` bound.
- [ ] Implement frequency pruning.
- [ ] Understand search-order heuristics.
- [ ] Implement path enumeration/counting.
- [ ] Understand BigInt count boundaries.
- [ ] Understand bitmask state.
- [ ] Connect multiple-word search to Tries.
- [ ] Build an independent validator.
- [ ] Differential-test against a brute-force oracle.
- [ ] Apply grid backtracking to Backend and AI constraint search.

## Key Takeaways

1. Word Search is a compact example of multi-directional backtracking.
2. The essential state is position, target progress, and visited cells.
3. Exact apply/undo behavior preserves correctness across sibling branches.
4. Frequency checks and search ordering can reduce work without sacrificing completeness.
5. Bitmasks and flat state improve implementation efficiency for suitable grid sizes.
6. Multi-word search naturally connects grid backtracking with Tries and shared-prefix search.
7. Independent path validation and brute-force differential testing are essential for trustworthy optimization.
8. The same search architecture applies to constrained spatial reasoning, workflow exploration, and AI validation.
