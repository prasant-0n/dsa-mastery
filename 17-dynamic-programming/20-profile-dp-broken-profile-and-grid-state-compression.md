# 20 — Profile DP: Broken Profile & Grid State Compression

## 1. Why Profile DP Exists

Many grid problems have dimensions that are too large for a `2D cell-state` DP but have one **small dimension** (usually width `W`). The key idea is to process the grid as a frontier and remember only the information crossing that frontier.

Profile DP is therefore a form of **state compression over a separator**:

```text
processed cells | frontier/profile | unprocessed cells
```

The entire processed region does not need to be remembered. Only the boundary information that can affect future transitions is stored.

Typical state-space size:

```text
O(2^W)
```

or, for richer frontiers, a larger but still width-dependent state space.

This turns some apparently exponential-in-area problems into algorithms exponential only in the small dimension.

---

## 2. The Core Mental Model

Profile DP follows the same discipline as ordinary DP:

1. Define a state.
2. Prove the state contains every piece of information the future needs.
3. Enumerate valid transitions.
4. Aggregate transitions.
5. Evaluate states in dependency order.
6. Reconstruct an answer when required.

The special feature is that the state is a **frontier profile** rather than a scalar, prefix, interval, or arbitrary subset.

A useful question is:

> If I cut the grid here, what information must cross the cut so that the unprocessed part can be solved independently of the exact history?

That information is the profile.

---

## 3. Choosing the Processing Direction

For an `H × W` grid, profile DP usually processes rows while storing information about the next row.

If `W` is small, complexity can be approximately:

```text
O(H × 2^W × T)
```

where `T` is the number of compatible transitions per profile.

Therefore, transpose the conceptual grid when useful so that:

```text
W = min(original H, original W)
```

This can change an infeasible state space into a manageable one.

### Important engineering rule

**Width controls the exponential factor.**

Never casually build a `2^H` state space when a `2^W` formulation is available with smaller `W`.

---

## 4. Bitmask Profiles

For binary frontier information, represent the profile as a bitmask.

For width `W`:

```text
bit j = 1 → cell/slot j on the frontier is occupied or already handled
bit j = 0 → cell/slot j remains available
```

Common operations:

```js
const bit = 1 << j;
const occupied = mask & bit;
const next = mask | bit;
const cleared = mask & ~bit;
```

For `W >= 31`, JavaScript's ordinary bitwise operators require special care because they operate on signed 32-bit integers. Use `BigInt` masks or a different representation when the width exceeds the safe bitwise regime.

---

## 5. Domino Tiling: Canonical Example

Consider counting ways to tile a grid using `1 × 2` dominoes.

When processing one row, a profile records cells already occupied by horizontal dominoes coming from the previous row.

For each cell:

- if the cell is blocked/occupied, move forward;
- otherwise place a horizontal domino if the next cell is available;
- or place a vertical domino, marking the corresponding position in the next-row profile.

The crucial distinction is:

```text
current mask → next mask
```

A row transition consumes the current profile and generates a new profile.

---

## 6. Cell-by-Cell Transition Generation

A robust way to generate row transitions is recursive scanning within one row.

Conceptually:

```text
fill(position, currentMask, nextMask)
    if position == W:
        emit nextMask
        return

    if current position already occupied:
        fill(position + 1, ...)
        return

    try every legal placement
```

For domino tiling:

### Horizontal placement

Requires the next cell in the current row to be free.

```text
currentMask:  ...00
                       ^^
```

Mark both current-row cells as consumed.

### Vertical placement

Consumes the current cell and carries occupancy into the next row.

```text
currentMask → nextMask
```

This transition-generation procedure is itself a small backtracking search, but it runs only inside one row/profile.

That is a recurring pattern:

> **Backtracking generates local transitions; DP memoizes the global frontier states.**

---

## 7. Precomputing Compatible Transitions

When the grid width is fixed, transition generation can be performed once for every possible input profile.

```text
transitions[mask] = [nextMask1, nextMask2, ...]
```

Then the main DP becomes a simple state transition loop.

Benefits:

- removes repeated transition generation;
- separates correctness of local placement logic from DP aggregation;
- enables sparse transition storage;
- makes benchmarking easier;
- supports repeated queries on grids with the same width.

For weighted variants, store transition metadata rather than only `nextMask`.

---

## 8. Obstacles

Obstacles can be represented by an availability mask for each row.

A cell cannot be occupied by a domino if it is blocked.

The transition generator therefore receives:

```text
row obstacle mask
current frontier mask
```

and emits legal next profiles.

A useful invariant is:

```text
(currentMask & obstacleMask) === 0
```

for every reachable state, assuming the representation treats blocked cells separately from carried occupancy.

The exact mask semantics must be documented because obstacle bits and occupancy bits can otherwise be confused.

---

## 9. Row Transition Recurrence

Let:

```text
dp[r][mask]
```

represent the number of ways to process rows `0 ... r-1` such that `mask` describes occupancy entering row `r`.

Then:

```text
dp[r + 1][nextMask] += dp[r][mask]
```

for every valid transition:

```text
mask → nextMask
```

The final state must satisfy the boundary condition that no occupancy extends beyond the grid:

```text
finalMask === 0
```

unless the problem explicitly defines another terminal condition.

---

## 10. Compatibility-Graph Interpretation

Each profile is a node.

Each valid local placement is a directed edge:

```text
mask → nextMask
```

The grid induces repeated layers of this graph:

```text
row 0 → row 1 → row 2 → ... → row H
```

The DP is then path counting or path optimization through a layered compatibility graph.

This perspective is useful because it connects profile DP to:

- DAG DP;
- transfer matrices;
- sparse graph traversal;
- matrix exponentiation for repeated identical rows;
- weighted automata.

---

## 11. Transfer-Matrix View

If every row has identical transition rules, define a transition matrix `T`:

```text
v_next = T · v
```

After `H` rows:

```text
v_H = T^H · v_0
```

For very large `H` and small `W`, matrix exponentiation can replace `H` explicit DP layers.

However, dense matrix multiplication may be wasteful because profile compatibility graphs are usually sparse.

Possible alternatives include:

- sparse matrix multiplication;
- repeated sparse-vector transitions;
- exponentiation exploiting sparsity;
- linear-recurrence techniques when the output sequence is analyzed further.

---

## 12. Sparse vs Dense State Storage

Although there are at most `2^W` masks, not every mask is reachable.

Dense storage:

```js
const dp = new Array(1 << W).fill(0);
```

is simple and often fast for moderate `W`.

Sparse storage:

```js
const dp = new Map();
```

can be better when the reachable state set is small.

Do not assume sparse is automatically faster. Measure:

- number of reachable states;
- transition count;
- allocation frequency;
- lookup overhead;
- garbage-collection cost.

---

## 13. Rolling-Row Memory

The previous row is needed only to produce the next row in many profile DPs.

Therefore:

```text
dp[r]
next[r + 1]
```

can be replaced by two arrays/maps.

Memory changes from approximately:

```text
O(H × 2^W)
```

to:

```text
O(2^W)
```

plus transition storage.

If reconstruction is required, additional parent information or checkpointing may be necessary.

---

## 14. Width-Minimization as State-Space Engineering

Suppose a problem has dimensions:

```text
H = 1000
W = 10
```

Then:

```text
2^W = 1024
```

is manageable, while `2^H` is impossible.

This is why profile DP is fundamentally a **separator-width technique**.

The same reasoning appears in more advanced algorithms involving:

- pathwidth;
- treewidth;
- frontier methods;
- bounded-width graph decompositions.

Profile DP is a practical gateway into those ideas.

---

## 15. Broken-Profile DP

The term **broken profile DP** commonly refers to processing a grid cell-by-cell while maintaining a profile describing partially completed cells around the current frontier.

Instead of completing one entire row in one recursive transition, the algorithm advances through individual cells.

A typical state can be represented by:

```text
(position, mask)
```

or by an equivalent compressed representation.

The cell-level formulation is powerful because it naturally handles:

- irregular obstacles;
- local placement constraints;
- variable-width regions;
- several tile shapes;
- constraints that are awkward to express as whole-row transitions.

---

## 16. General Frontier State Design

A binary occupancy mask is not always enough.

Some problems require each frontier position to store a small label or connectivity identifier.

Examples include:

- connected-component tracking;
- Hamiltonian structures;
- polyomino tilings;
- path/cycle construction;
- connectivity constraints.

Then a profile can become a vector:

```text
[label0, label1, ..., labelW-1]
```

and must be canonicalized so that equivalent labelings share one state.

For example:

```text
[3, 3, 7, 7]
```

and

```text
[1, 1, 2, 2]
```

may represent the same connectivity pattern.

Canonicalization can dramatically reduce state count.

---

## 17. Plug / Connectivity Profiles

Connectivity-aware profile DP extends the frontier idea by recording how partial components connect across the boundary.

This is substantially harder than binary occupancy because the state must preserve enough topology to prevent invalid merges or premature cycles.

Typical ingredients include:

1. canonical labels;
2. component merge operations;
3. component-closure checks;
4. cycle detection;
5. terminal connectivity conditions;
6. canonical state encoding.

The general principle remains unchanged:

> Preserve exactly the connectivity information that can affect future legality or objective value.

---

## 18. Counting, Optimization, and Feasibility

Profile DP is not restricted to counting.

The same state graph can compute:

### Feasibility

```text
reachable[next] = true
```

### Counting

```text
dp[next] += dp[current]
```

### Minimum cost

```text
dp[next] = min(dp[next], dp[current] + cost)
```

### Maximum score

```text
dp[next] = max(dp[next], dp[current] + score)
```

### Probability

```text
prob[next] += prob[current] * transitionProbability
```

The aggregation operator must match the problem's algebraic structure.

---

## 19. Reconstruction

If the task asks for an actual tiling/path rather than only its count, store a predecessor:

```text
parent[row][nextMask] = previousMask
```

For cell-level DP, store enough information to recover the placement decision.

When multiple answers exist, define a deterministic tie-breaking policy if reproducibility matters.

For memory-constrained reconstruction, consider:

- checkpointing;
- divide-and-conquer reconstruction;
- recomputing local transitions;
- storing only decision bits.

---

## 20. Complexity Analysis

For a binary profile width `W`, there are at most:

```text
S = 2^W
```

states per layer.

If each state has at most `T` transitions:

```text
Time:   O(H × S × T)
Space:  O(S + transitionStorage)
```

The transition count depends strongly on the local rules.

For domino tiling, local transition generation can be much smaller than all `S²` possible profile pairs.

A careless implementation that checks every pair:

```text
for mask in states:
    for nextMask in states:
```

can introduce an unnecessary `O(4^W)` factor.

Precompute only compatible transitions.

---

## 21. Correctness Invariant

A useful proof invariant is:

> After processing the first `r` rows, `dp[r][mask]` equals the aggregate value of exactly those valid partial configurations whose interaction with the unprocessed region is represented by `mask`.

Proof structure:

### Initialization

The empty processed region has exactly the initial boundary state.

### Preservation

Every transition corresponds to one legal way of extending a partial configuration, and every legal extension is generated exactly once.

### Termination

The terminal profile condition accepts exactly complete configurations.

This gives a reusable proof template for profile DP.

---

## 22. Common Failure Modes

### 22.1 Wrong mask semantics

Confusing:

```text
occupied in current row
```
with:

```text
occupied in next row
```

causes subtle transition bugs.

### 22.2 Ignoring obstacles in carried state

A vertical placement cannot cross an obstacle.

### 22.3 Forgetting the final zero-profile condition

Configurations extending beyond the grid must be rejected.

### 22.4 Using a too-large width

Always consider transposition.

### 22.5 Enumerating all profile pairs

Precompute sparse compatible transitions instead.

### 22.6 JavaScript bitwise overflow

Use `BigInt` or another representation when width requires it.

### 22.7 Non-canonical connectivity labels

Equivalent frontier states can explode the state space if labels are not normalized.

### 22.8 Incorrect modulo arithmetic

Normalize additions/multiplications according to the required modulus and numeric range.

---

## 23. Testing Strategy

Profile DP benefits from several independent validation strategies.

### Brute-force oracle

For tiny grids, enumerate placements directly.

### Differential testing

Compare:

```text
cell-level profile DP
vs
row-level profile DP
```

on the same instances.

### Metamorphic tests

Useful relations include:

- transpose-equivalent boards should agree when tile rules are symmetric;
- adding an impossible obstacle should not increase the number of solutions;
- identical rows under symmetric rules may produce predictable equivalences;
- changing weights by a constant can have predictable effects when every solution has equal size.

### Adversarial cases

Include:

- `1 × N` grids;
- `N × 1` grids;
- all blocked;
- no blocked cells;
- checkerboard obstacles;
- maximum supported width;
- disconnected regions;
- impossible parity cases;
- repeated identical rows.

---

## 24. Backend Engineering Applications

Profile-style state compression appears beyond puzzles.

Examples:

- constrained scheduling across a short rolling horizon;
- resource allocation where the frontier contains active commitments;
- finite-state configuration optimization;
- batch-layout optimization;
- small-width dependency planning.

The engineering lesson is broader than grid tiling:

> If the future interacts with the past through a small boundary, compress the past into that boundary state.

This can turn a large history into a compact cache key.

---

## 25. AI Engineering Applications

Profile DP is useful when an AI planning problem has a bounded interface between processed and unprocessed decisions.

Examples:

- structured sequence/grid planning;
- constrained action layouts;
- finite-horizon resource allocation;
- small-frontier combinatorial search;
- exact inference over bounded-width factor structures.

It also teaches a central AI algorithm-engineering skill:

**choose a state representation that removes irrelevant history without removing information needed for optimal decisions.**

---

## 26. Relationship to Other DP Patterns

| Pattern | State remembers |
|---|---|
| 1D DP | prefix/position information |
| 2D DP | two-dimensional prefix/state |
| Interval DP | active interval |
| Tree DP | subtree boundary to parent |
| Bitmask DP | selected subset |
| Digit DP | processed digits + constraints |
| Profile DP | frontier across a separator |
| Plug DP | frontier connectivity/topology |

Profile DP therefore belongs to the larger family of **boundary-state dynamic programming**.

---

## 27. Interview Recognition Framework

When you see a difficult grid problem, ask:

1. Is one dimension small?
2. Can I process the grid along the large dimension?
3. Does the future depend only on a narrow frontier?
4. Can the frontier be encoded as a bitmask?
5. Can local transitions be generated independently?
6. Can transitions be precomputed?
7. Are reachable profiles sparse?
8. Do I need connectivity labels rather than occupancy bits?
9. Is reconstruction required?
10. What is the exact state count as a function of width?

If the answer to the first three is yes, profile DP should be considered immediately.

---

## 28. Master Pattern

The progression is:

```text
Grid problem
    ↓
Choose processing direction
    ↓
Identify frontier
    ↓
Compress frontier
    ↓
Encode profile
    ↓
Generate local transitions
    ↓
Precompute compatibility
    ↓
Run layered DP
    ↓
Optimize storage/numeric representation
    ↓
Reconstruct if required
    ↓
Prove + differential-test
```

The deepest principle is not “use a bitmask.” It is:

> **Find the smallest separator state that makes the future independent of the detailed past.**

That principle generalizes from grids to bounded-width graphs and many exact combinatorial algorithms.

---

## 29. Mastery Checklist

You should be able to explain and implement:

- [ ] frontier-state DP
- [ ] binary profile masks
- [ ] domino tiling DP
- [ ] obstacle-aware profiles
- [ ] cell-by-cell broken-profile DP
- [ ] row-level transition generation
- [ ] transition precomputation
- [ ] sparse profile storage
- [ ] rolling-row memory
- [ ] width minimization/transposition
- [ ] transfer-matrix interpretation
- [ ] reconstruction
- [ ] weighted profile DP
- [ ] probability profile DP
- [ ] canonical connectivity labels
- [ ] plug/connectivity profiles
- [ ] brute-force oracle construction
- [ ] differential testing
- [ ] metamorphic testing
- [ ] exact complexity analysis
- [ ] JavaScript bitmask/BigInt safety
- [ ] proof of state sufficiency
- [ ] proof of transition completeness
- [ ] backend state-compression applications
- [ ] AI bounded-frontier planning applications

If you can derive the profile from first principles rather than memorizing a tiling template, you understand the technique.