# 07 — 2D Grid DP: Path Counting & Path Optimization

> **Phase 17 — Dynamic Programming**
>
> A grid is a DP state graph made visible. Each cell is a state, legal moves define dependencies, and the evaluation order follows the direction of those dependencies.

---

## 1. The Grid DP Mental Model

Given a grid, do not start with a table template.

First ask:

1. What does `dp[r][c]` mean?
2. Which predecessor states can reach `(r, c)`?
3. What value is contributed by entering this cell?
4. What are the boundary/base states?
5. In what order can every dependency be computed?

A typical forward grid recurrence is:

```text
dp[r][c] = combine(dp[r - 1][c], dp[r][c - 1], grid[r][c])
```

The recurrence changes with the problem objective.

---

## 2. Grid as a DAG

If movement is only:

```text
↓  or  →
```

then cycles are impossible.

Every cell can be viewed as a vertex in a directed acyclic graph:

```text
(r-1,c) ──→ (r,c)
   │
   ↓
(r,c-1) ──→ (r,c)
```

Grid DP is therefore DAG DP with a particularly simple topological order.

This connection becomes important when movement rules become more general.

---

## 3. Path Counting

For the number of paths from the origin to `(r, c)`:

```text
dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
```

with appropriate boundary conditions.

For example:

```text
dp[0][0] = 1
```

means there is exactly one way to be at the starting state before making any move.

The most important semantic distinction is:

> `dp[r][c]` counts paths **ending at this cell**, not paths leaving it.

Changing that sentence changes the recurrence.

---

## 4. Obstacles

If a cell is blocked:

```text
dp[r][c] = 0
```

for path counting.

But be precise: zero here means **no valid path through this state**, not necessarily that the state was never allocated.

Boundary initialization must also respect obstacles.

---

## 5. Minimum / Maximum Path Cost

For optimization:

```text
dp[r][c] = grid[r][c] + min(
    dp[r - 1][c],
    dp[r][c - 1]
)
```

The same state graph supports a different algebra:

```text
counting      → addition
minimum cost  → minimum
maximum score → maximum
```

This is a powerful DP pattern:

> **The state graph can remain unchanged while the aggregation operator changes.**

---

## 6. Unreachable States

Optimization DP needs an explicit representation for unreachable cells.

For minimization:

```js
const INF = Infinity;
```

For maximization:

```js
const NEG_INF = -Infinity;
```

Do not allow an unreachable predecessor to participate in arithmetic as though it were valid.

For example:

```js
if (best !== Infinity) {
  candidate = best + grid[r][c];
}
```

---

## 7. Boundary States

Most grid-DP bugs are boundary bugs.

Handle explicitly:

- `(0, 0)`
- first row
- first column
- obstacles on boundaries
- empty grid
- single-cell grid
- single-row grid
- single-column grid

Do not depend accidentally on JavaScript array defaults to encode mathematical meaning.

---

## 8. Forward vs Backward Formulation

There are two equivalent ways to define many grid problems.

### Forward

```text
dp[r][c] = answer accumulated from predecessors
```

### Backward

```text
dp[r][c] = answer obtainable from this cell to the destination
```

For the backward form, the recurrence may become:

```text
dp[r][c] = grid[r][c] + min(
    dp[r + 1][c],
    dp[r][c + 1]
)
```

Choose the direction that makes state semantics and boundary conditions clearest.

---

## 9. Evaluation Order

For predecessor dependencies:

```text
(r-1,c), (r,c-1)
```

iterate:

```text
r = 0 → rows - 1
c = 0 → cols - 1
```

For successor dependencies:

```text
(r+1,c), (r,c+1)
```

iterate in reverse.

Again, do not memorize the loop direction. Derive it from dependencies.

---

## 10. Obstacles and Reachability

A robust grid solver separates:

```text
structural state
```

from:

```text
reachability
```

For example, a valid cell may have zero path count, while an optimization state may need `Infinity` to represent unreachable.

This distinction prevents sentinel values from silently changing the answer.

---

## 11. Space Optimization

If each state only depends on the previous row and the current row, use two rows.

If the recurrence allows safe in-place updates, use one row.

For path counting:

```js
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    // dp[c] represents the previous row.
    // dp[c - 1] represents the current row's left cell.
  }
}
```

The update order is part of the algorithm.

See Lesson 05 for the general theory of rolling arrays and state liveness.

---

## 12. Diagonal Movement

If legal moves include:

```text
↓  →  ↘
```

then the recurrence gains another dependency:

```text
dp[r][c] = combine(
    dp[r - 1][c],
    dp[r][c - 1],
    dp[r - 1][c - 1]
)
```

The additional diagonal dependency affects both the recurrence and any one-row compression strategy.

---

## 13. General Move Sets

Instead of hard-coding two predecessors, define legal moves:

```text
moves = [
  [-1, 0],
  [0, -1],
  [-1, -1]
]
```

Then derive predecessors from the move set.

But general movement rules require an important question:

> Does the movement graph remain acyclic?

If not, ordinary topological grid DP may no longer apply.

---

## 14. When Grid DP Stops Being Simple

Consider allowing:

```text
↑ ↓ ← →
```

Now cells can participate in cycles.

A recurrence such as:

```text
dp[r][c] depends on dp[r + 1][c]
```

may create circular dependencies.

At that point, you need a different model, such as:

- shortest-path algorithms
- DAG conversion when possible
- state augmentation
- iterative relaxation for appropriate formulations
- graph algorithms

Recognizing when **not** to use DP is part of DP mastery.

---

## 15. Counting with Large Answers

Path counts can grow rapidly.

JavaScript `Number` cannot represent every integer exactly beyond its safe integer range.

For exact counts:

```js
let ways = 0n;
```

and use `BigInt` consistently.

Alternatively, if the problem asks for a modulus:

```text
MOD = 1_000_000_007
```

apply modular arithmetic at every transition.

Never mix `Number` and `BigInt` in arithmetic.

---

## 16. Modulo DP

For counting under a modulus:

```text
dp[r][c] = (dp[r-1][c] + dp[r][c-1]) % MOD
```

The modulus becomes part of the state-transition contract.

For multiplication-heavy transitions, consider intermediate overflow semantics carefully; JavaScript `Number` multiplication can lose integer precision before the modulo is applied.

For exact arbitrary-size arithmetic, use `BigInt`.

---

## 17. Path Reconstruction

Computing the optimal cost is different from recovering the actual path.

For optimization, retain a decision:

```text
parent[r][c] = UP or LEFT
```

Then reconstruct backward from the destination.

For space-constrained implementations, alternatives include:

- recomputing local decisions
- divide-and-conquer reconstruction
- retaining compressed parent information
- using the full table when clarity is preferable

Always distinguish:

```text
value computation
```

from:

```text
solution reconstruction
```

---

## 18. Tie-Breaking

Suppose two paths have equal cost.

The problem may require:

- any optimal path
- lexicographically smallest path
- minimum turns among optimal paths
- maximum number of preferred moves

Tie-breaking is part of the state/transition specification.

If the required tie-break depends on historical information, the state may need to store additional information.

---

## 19. Multi-Criteria Grid DP

Sometimes one scalar objective is insufficient.

Example:

```text
minimize cost
subject to at most K turns
```

Now a state may be:

```text
(r, c, turns)
```

The grid coordinates alone are no longer sufficient because two arrivals at the same cell with different remaining budgets can have different futures.

This is the same state-sufficiency principle from Lesson 02.

---

## 20. Resource-Constrained Grid DP

Examples:

- at most `K` obstacles removed
- limited energy
- limited fuel
- limited number of special moves
- maximum number of risks tolerated

The general form becomes:

```text
state = (position, resource)
```

Complexity typically becomes:

```text
O(rows × cols × resource)
```

The extra dimension is justified only if it changes future possibilities.

---

## 21. Rolling + Resource Dimensions

Suppose:

```text
state = dp[row][col][k]
```

and each row only depends on the previous row.

The row dimension may be compressed:

```text
previous[col][k]
current[col][k]
```

This illustrates a recurring optimization principle:

> Compress dimensions based on dependency structure, not because the table visually looks large.

---

## 22. Prefix/Suffix Grid DP

A grid may contain multiple queries requiring information from different directions.

Examples:

- best score from source to every cell
- best score from every cell to destination
- combining source-to-cell and cell-to-target values
- identifying cells lying on an optimal path

Forward and backward DP tables can sometimes be combined:

```text
sourceDP[r][c] + targetDP[r][c]
```

This is useful for analyzing optimal paths without enumerating every path.

---

## 23. Diagonal and Anti-Diagonal Processing

Some grid recurrences depend on diagonal layers rather than ordinary rows.

For example, when a state depends on `(r-1,c-1)`, cells can be grouped by:

```text
r + c
```

All cells with the same `r + c` lie on one anti-diagonal.

Layer-based processing is useful when:

- dependencies move between diagonals
- parallel processing is desired
- memory can be reduced to a frontier

---

## 24. Grid DP as Algebra

Many grid DPs can be viewed abstractly as:

```text
state value = aggregate(predecessor values + transition contribution)
```

Examples:

```text
counting       → sum
minimum path   → min + addition
maximum path   → max + addition
boolean reach  → OR + AND-like validity
```

This abstraction helps you transfer the same state-graph reasoning across different problems.

---

## 25. Correctness Invariant

For a forward path-counting DP, a useful invariant is:

> After processing `(r, c)`, `dp[r][c]` equals the exact number of valid paths from the source to `(r, c)` under the defined movement and obstacle rules.

For optimization:

> After processing `(r, c)`, `dp[r][c]` equals the optimal objective value among all valid source-to-`(r,c)` paths, or the designated unreachable sentinel when none exists.

The invariant must match the exact state definition.

---

## 26. Differential Testing

Keep a brute-force solver for very small grids.

Then compare:

```text
brute force
    vs
full-table DP
    vs
rolling-array DP
```

Test:

- empty inputs
- one row
- one column
- one cell
- all obstacles
- no obstacles
- random obstacle layouts
- negative costs where allowed
- large values
- multiple optimal paths

Three-way comparison is especially useful when optimizing an implementation.

---

## 27. Metamorphic Testing

Useful properties include:

- adding an unreachable region cannot create a path
- blocking a previously open cell cannot increase a path count
- identical transformations applied to symmetric square grids should preserve corresponding answers
- a rolling implementation must match its full-table reference
- increasing every edge/cell cost by a constant should change a fixed-length path's total cost predictably

Metamorphic properties should be derived from the actual problem semantics rather than invented blindly.

---

## 28. Complexity

For a grid with `R × C` states and constant-size move set:

```text
Time:  O(RC)
Space: O(RC) full table
```

With two-row compression:

```text
Space: O(C)
```

With one-row compression:

```text
Space: O(C)
```

assuming the chosen iteration order safely preserves dependencies.

With an additional resource dimension `K`:

```text
Time:  O(RCK)
Space: O(RCK)
```

before possible layer compression.

---

## 29. Backend Engineering Applications

Grid DP appears naturally in backend workloads involving structured matrices and state lattices:

- route/cost optimization
- warehouse traversal planning
- resource-constrained workflows
- batch scheduling surfaces
- reconciliation matrices
- sequence comparison services
- pricing or allocation surfaces

For production services, consider:

- request concurrency
- memory per request
- numeric precision
- timeout budgets
- cancellation
- maximum input dimensions
- deterministic behavior

A mathematically correct `O(RC)` algorithm can still be operationally unsafe if unbounded input dimensions are accepted.

---

## 30. AI Engineering Applications

Grid-like DP is useful for structured state spaces such as:

- sequence alignment
- lattice decoding
- constrained path scoring
- structured prediction
- finite-state search
- dynamic programming over token/state lattices

A strong engineering architecture is:

```text
formal state definition
        ↓
reference DP
        ↓
optimized DP
        ↓
differential tests
        ↓
production implementation
```

The AI component may propose constraints or candidate structures, but the DP engine should remain deterministic and verifiable when exactness is required.

---

## 31. Common Failure Modes

### Failure 1 — Wrong state meaning

You cannot derive the recurrence reliably if `dp[r][c]` has ambiguous semantics.

### Failure 2 — Incorrect boundary initialization

The first row or column accidentally receives paths through blocked cells.

### Failure 3 — Treating unreachable as zero

This can create fake optimization paths.

### Failure 4 — Wrong loop direction

In-place DP consumes a state after it has already been updated.

### Failure 5 — Ignoring numeric precision

Large path counts silently become inaccurate.

### Failure 6 — Forgetting reconstruction requirements

The optimal value is correct but the requested path cannot be recovered.

### Failure 7 — Using grid DP on cyclic movement

The dependency graph is not a DAG, so the assumed evaluation order is invalid.

---

## 32. Interview Derivation Framework

When given a grid-DP problem:

1. Define exactly what `dp[r][c]` means.
2. Identify legal predecessors or successors.
3. Derive the recurrence.
4. Establish source/destination base cases.
5. Define obstacle and unreachable semantics.
6. Determine evaluation order.
7. Implement the full table first if necessary.
8. Add reconstruction if required.
9. Compress space only after proving dependencies.
10. State time and auxiliary space.
11. Test boundaries and adversarial cases.
12. Explain why the recurrence is complete and non-overcounting.

---

## 33. Master Pattern

```text
grid problem
    ↓
state = position (+ resources if needed)
    ↓
identify legal dependencies
    ↓
classify objective
    ↓
derive recurrence
    ↓
define boundaries + unreachable states
    ↓
choose dependency-respecting order
    ↓
full-table reference
    ↓
reconstruction if required
    ↓
rolling / in-place compression
    ↓
differential validation
    ↓
production constraints
```

The deepest lesson is:

> **A grid is only a visual representation of a state graph. DP works because the dependency graph is acyclic and each state summarizes everything the future needs.**

---

## Revision Checklist

You should be able to:

- define path-counting grid states precisely
- derive minimum and maximum path recurrences
- handle obstacles correctly
- distinguish zero from unreachable
- choose forward vs backward formulation
- derive evaluation order from dependencies
- implement two-row and one-row variants
- handle diagonal movement
- recognize when movement creates cycles
- use `BigInt` for exact large counts
- apply modular counting correctly
- reconstruct an optimal path
- add resource dimensions when required for state sufficiency
- reason about diagonal/frontier processing
- prove full-table and compressed implementations equivalent
- build brute-force differential oracles
- design metamorphic and adversarial tests
- analyze backend memory/concurrency implications
- explain grid DP in an interview without memorized templates
