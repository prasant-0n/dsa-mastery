# 12 — Interval DP & Range Partitioning

> **Phase 17 — Dynamic Programming**
>
> Interval DP is the core pattern for problems where a solution is defined over a contiguous range and the final decision splits that range into smaller independent ranges. The central skill is learning to derive `dp[l][r]`, choose the correct interval ordering, enumerate split points, and reconstruct the optimal partition.

---

## 1. Why Interval DP Matters

Many difficult DP problems do not move through a sequence from left to right.

Instead, they ask:

- How should a range be parenthesized?
- Where should an interval be split?
- What is the minimum cost to merge a range?
- What is the best score obtainable inside a range?
- Which final operation combines two already-solved subranges?

The recurring structure is:

```text
dp[l][r] = best answer for interval [l, r]
```

and a transition of the form:

```text
answer(l, r)
    = best over split k
      combine(answer(l, k), answer(k + 1, r), cost(l, k, r))
```

This is the **range-partitioning pattern**.

---

## 2. The Interval State

For an array or sequence:

```text
A[0 ... n - 1]
```

define:

```text
dp[l][r] = optimal value for the inclusive interval [l, r]
```

The exact meaning must be stated before coding.

For example:

```text
dp[l][r] = minimum scalar multiplications needed to multiply matrices l..r
```

or:

```text
dp[l][r] = minimum cost to merge items l..r
```

The boundaries are part of the state because the contents outside `[l, r]` are irrelevant to the subproblem under the chosen decomposition.

---

## 3. Why Contiguous Intervals Work

Interval DP depends on a structural property:

> After choosing a final split, the remaining work separates into contiguous subranges whose optimal solutions can be solved independently.

If splitting `[l, r]` at `k` gives:

```text
[l ... k]
[k + 1 ... r]
```

then the transition can combine those two results.

If a problem has cross-dependencies between the two ranges that are not represented in the state, the simple interval recurrence is invalid.

---

## 4. The Split-Point Pattern

A generic minimization recurrence is:

```text
dp[l][r] = min over k:
    dp[l][k]
  + dp[k + 1][r]
  + mergeCost(l, k, r)
```

A maximization version is:

```text
dp[l][r] = max over k:
    dp[l][k]
  + dp[k + 1][r]
  + score(l, k, r)
```

The difficult part is not the loop syntax.

The difficult part is proving that the final operation can be represented by a split point and that the two resulting ranges contain sufficient information for the future.

---

## 5. Base Cases

The smallest intervals normally have no internal split.

Examples:

```text
l === r
```

may represent a single item with zero partition cost.

For matrix-chain multiplication:

```text
dp[i][i] = 0
```

because one matrix requires no multiplication.

For other problems, the base case may be:

```text
single-character score
empty interval value
infinity for invalid interval
```

Derive the base case from the state definition rather than copying a template.

---

## 6. Interval Length Ordering

If:

```text
dp[l][r]
```

depends on:

```text
dp[l][k]
dp[k + 1][r]
```

then both dependencies have shorter interval length.

Therefore process intervals by increasing length:

```text
length = 2 → n
    l = 0 → n - length
        r = l + length - 1
```

This is the canonical bottom-up interval-DP order.

The ordering is a consequence of the dependency graph.

---

## 7. Matrix Chain Multiplication

Suppose matrices have dimensions:

```text
A1: p0 × p1
A2: p1 × p2
...
An: p(n-1) × pn
```

The final multiplication splits the chain at matrix `k`:

```text
(Ai ... Ak) × (A(k+1) ... Aj)
```

Define:

```text
dp[i][j] = minimum scalar multiplications for Ai...Aj
```

Then:

```text
dp[i][j] = min over k:
    dp[i][k]
  + dp[k + 1][j]
  + p[i - 1] * p[k] * p[j]
```

The final term is the cost of multiplying the two resulting matrices.

---

## 8. Matrix Chain: Why Greedy Fails

Matrix-chain multiplication demonstrates why local choices can be misleading.

Two adjacent matrices that look cheap to multiply may create a large intermediate matrix and make later multiplication expensive.

The globally optimal parenthesization depends on the entire range.

Therefore the state must preserve the interval and consider every legal split.

---

## 9. Matrix Chain Reconstruction

The minimum cost alone is often insufficient.

Store:

```text
split[i][j] = k
```

where `k` produced the optimal transition.

Then recursively reconstruct:

```text
(i, j)
   ↓
(i, k) and (k + 1, j)
```

until reaching single matrices.

This converts a numeric DP into an actual parenthesization.

---

## 10. Burst Balloons

Burst Balloons looks different but contains the same interval idea.

The direct question asks:

> Which balloon should be burst first?

That is awkward because the neighbors change.

Instead ask:

> Which balloon is burst **last** inside an interval?

If `k` is the last balloon burst in `[l, r]`, then the left and right intervals have already been completely processed.

This produces independent subproblems.

The last-decision transformation is the key insight.

---

## 11. The Last-Decision Trick

A powerful interval-DP derivation technique is:

```text
first action may change the remaining structure
        ↓
choose the LAST action instead
        ↓
remaining structure becomes stable
        ↓
left/right intervals become independent
```

This technique appears in:

- Burst Balloons
- optimal polygon triangulation
- some merging problems
- parsing-style DP
- range elimination problems

When the first action changes boundaries, investigate whether the last action restores a clean decomposition.

---

## 12. Interval DP vs Prefix DP

Compare:

```text
prefix DP:
dp[i] = best answer for first i elements
```

with:

```text
interval DP:
dp[l][r] = best answer for contiguous range [l, r]
```

Prefix DP works when the boundary between processed and unprocessed elements captures all required information.

Interval DP is necessary when the internal partition structure of a range matters.

---

## 13. Interval DP vs Divide and Conquer

Both may recursively split ranges, but their optimization models differ.

Divide and conquer generally solves independent subproblems produced by a predetermined or algorithmically chosen split.

Interval DP evaluates **many possible split points** because the optimal split itself is part of the problem.

The distinction is:

```text
fixed split → divide and conquer
optimal split among many → often interval DP
```

This is conceptual rather than absolute; advanced optimizations can blur the implementation boundary.

---

## 14. Range Merge Cost

A common interval recurrence is:

```text
dp[l][r] = min_k(
    dp[l][k] + dp[k + 1][r] + cost(l, r)
)
```

where `cost(l, r)` represents combining the two solved ranges.

If the merge cost depends on the total weight:

```text
sum(l, r)
```

precompute prefix sums:

```text
prefix[i + 1] = prefix[i] + A[i]
```

Then:

```text
sum(l, r) = prefix[r + 1] - prefix[l]
```

making range-cost lookup `O(1)`.

---

## 15. Minimum Cost to Merge Files / Stones

Suppose adjacent groups must be merged and each merge costs the total weight of the merged range.

Define:

```text
dp[l][r] = minimum merge cost for l..r
```

Transition:

```text
dp[l][r] = min_k(
    dp[l][k]
  + dp[k + 1][r]
  + sum(l, r)
)
```

This is structurally identical to Matrix Chain Multiplication.

The domain changed; the DP pattern did not.

---

## 16. Range Partitioning as Binary Trees

Every sequence of binary splits creates a full binary tree.

For example:

```text
[a b c d]
```

can be partitioned as:

```text
((a b) (c d))
```

or:

```text
(a (b (c d)))
```

Interval DP is therefore often equivalent to finding the optimal binary decomposition tree over the sequence.

This viewpoint is useful for:

- parenthesization;
- expression evaluation;
- hierarchical aggregation;
- merge planning;
- parsing.

---

## 17. Catalan Growth and Why Brute Force Explodes

The number of binary parenthesizations of `n` objects grows according to Catalan numbers.

That means enumerating every parenthesization quickly becomes infeasible.

Interval DP does not enumerate every complete tree independently.

It reuses solutions for repeated intervals.

The same interval may appear as a subtree in many different parenthesizations.

That is exactly where overlapping subproblems enter.

---

## 18. Complexity of Basic Interval DP

For:

```text
dp[l][r]
```

there are `O(n²)` intervals.

If each interval tries `O(n)` split points:

```text
Time:  O(n³)
Space: O(n²)
```

This is the standard complexity of Matrix Chain Multiplication.

Before implementing, count:

```text
number of states × transitions per state
```

rather than guessing complexity from nested loops.

---

## 19. Prefix Sums Are Part of the DP Design

If every transition repeatedly computes:

```text
sum(A[l..r])
```

using a loop, the intended `O(n³)` algorithm can accidentally become:

```text
O(n⁴)
```

Precompute range aggregates when the transition needs them.

Common helpers include:

- prefix sums;
- prefix counts;
- sparse tables for static associative queries;
- precomputed compatibility matrices.

Auxiliary preprocessing can preserve the intended transition complexity.

---

## 20. Palindrome Interval DP

A classic boolean interval state is:

```text
pal[l][r] = whether A[l..r] is a palindrome
```

The recurrence is:

```text
pal[l][r] =
    A[l] === A[r]
    && (length <= 2 || pal[l + 1][r - 1])
```

This is an interval DP even though it does not choose a split point.

Therefore interval DP is broader than just Matrix Chain style partitioning.

---

## 21. Interval DP Has Multiple Transition Families

Do not reduce the entire pattern to one recurrence.

### Family A — Split point

```text
min/max over k
```

Examples:

- Matrix Chain
- merge costs
- triangulation

### Family B — Endpoint recurrence

```text
dp[l][r] from dp[l + 1][r - 1]
```

Examples:

- palindrome recognition
- some range matching problems

### Family C — Last action

```text
dp[l][r] from two smaller ranges after choosing final action
```

Example:

- Burst Balloons

Recognizing the transition family is often more useful than memorizing problem names.

---

## 22. Polygon Triangulation

Given polygon vertices in order, choose non-crossing diagonals to minimize triangulation cost.

Define:

```text
dp[i][j] = minimum triangulation cost of polygon chain i..j
```

Choose a vertex `k` between `i` and `j`:

```text
dp[i][j] = min_k(
    dp[i][k]
  + dp[k][j]
  + triangleCost(i, k, j)
)
```

The two subranges share endpoint `k`, which differs slightly from Matrix Chain's `[i,k]` and `[k+1,j]` indexing but follows the same structural idea.

---

## 23. Expression Parenthesization

Suppose an expression contains operators whose parenthesization affects the result.

A range may need to store more than one scalar value.

For boolean parenthesization, for example:

```text
dp[l][r][true]
dp[l][r][false]
```

may both be required because a range can produce either truth value depending on its parent context.

This illustrates a fundamental state-design rule:

> Store every property of a subrange that can affect how its parent combines it.

---

## 24. Multi-Value Interval States

Some interval problems require:

```text
minimum value
maximum value
number of ways
reconstruction parent
```

or multiple semantic states.

Do not compress them into one value if the parent transition needs the missing information.

Conversely, do not store unnecessary information merely because it is available.

State sufficiency and state minimality are both important.

---

## 25. Invalid Splits

Not every `k` is necessarily legal.

Constraints may require:

- minimum segment length;
- maximum segment length;
- balanced partitions;
- compatible boundary symbols;
- resource limits;
- parity restrictions;
- grammar compatibility.

The transition should enumerate only legal splits, or explicitly reject invalid candidates.

Never let an invalid split contaminate an optimization with a default zero value.

---

## 26. Infinity Sentinels

For minimization, unreachable intervals are commonly initialized to:

```text
INF
```

But JavaScript numeric arithmetic requires care.

Avoid blindly computing:

```text
INF + finiteCost
```

if your representation can create misleading finite values.

A safe pattern is:

```text
if (left === INF || right === INF)
    skip candidate
```

or use a sufficiently controlled sentinel with explicit checks.

---

## 27. Reconstruction as Tree Recovery

For split-based interval DP, store:

```text
choice[l][r] = best split k
```

Then reconstruct a binary tree:

```text
build(l, r)
    if l === r
        return leaf

    k = choice[l][r]
    return combine(
        build(l, k),
        build(k + 1, r)
    )
```

This is more general than reconstructing a sequence of choices.

You are recovering the optimal decomposition tree.

---

## 28. Tie-Breaking

Multiple splits may produce the same optimal value.

A production specification may require:

```text
any optimal partition
smallest split index
largest split index
lexicographically smallest parenthesization
minimum tree height
canonical binary tree
```

The numeric DP alone cannot guarantee these semantics unless the tie rule is encoded.

A deterministic iteration order gives reproducibility, not necessarily the requested semantic tie-break.

---

## 29. Memoization Form

The same recurrence can be expressed top-down:

```text
solve(l, r)
    if base case
        return base

    if memoized
        return memo[l][r]

    best = INF

    for k in legalSplits(l, r)
        candidate = solve(l, k)
                 + solve(k + 1, r)
                 + cost(l, k, r)

    memo[l][r] = best
    return best
```

Only reachable intervals are evaluated.

The state graph is identical to the bottom-up version.

---

## 30. Dependency Graph View

Every interval `[l, r]` is a node.

A split creates edges to smaller intervals.

Because interval length strictly decreases:

```text
length([child]) < length([parent])
```

there can be no cycle in ordinary interval partitioning DP.

Increasing interval length is therefore a topological ordering of the state DAG.

This connects interval DP directly to the general DP-as-DAG model from Lesson 01.

---

## 31. State Count vs Transition Count

For `n` elements:

```text
number of intervals ≈ n(n + 1) / 2
```

which is `O(n²)`.

Each long interval may have `O(n)` split points.

Thus:

```text
O(n²) states × O(n) transitions = O(n³)
```

This accounting method should become automatic.

---

## 32. When O(n³) Is Too Slow

For large `n`, the cubic transition loop may dominate.

Potential optimization families include:

- exploiting monotone optimal split positions;
- Knuth-style optimization under its mathematical conditions;
- divide-and-conquer optimization for suitable recurrences;
- Monge-array structure;
- reducing candidate split ranges;
- special problem-specific algebra.

These are not generic tricks.

Each requires structural conditions that must be proven for the recurrence.

---

## 33. Knuth-Style Optimization Intuition

Some interval recurrences have optimal split positions satisfying a monotonicity property such as:

```text
opt[l][r - 1] <= opt[l][r] <= opt[l + 1][r]
```

When the required conditions hold, the search range for `k` can be dramatically reduced.

The implementation can approach `O(n²)` rather than `O(n³)` for appropriate problems.

But the optimization is valid only under its theorem's assumptions.

Never apply it merely because an interval DP happens to exist.

---

## 34. Divide-and-Conquer Optimization Bridge

Some DP recurrences have the form:

```text
dp[i][j] = min_k(previous[k] + cost(k, j))
```

with monotonic optimal decisions.

Divide-and-conquer optimization can reduce the search over `k`.

This differs from classic interval DP because the state geometry and recurrence structure are different, but both exploit restricted movement of optimal split points.

Understanding this bridge prepares you for advanced DP optimization.

---

## 35. Monge Structure

A cost matrix may satisfy a quadrangle inequality / Monge property that implies useful monotonicity.

When a problem has such structure, many candidate split comparisons become redundant.

The important engineering habit is:

```text
identify algebraic structure
→ prove monotonicity
→ restrict search
→ benchmark
```

not:

```text
see O(n³)
→ guess an optimization
```

---

## 36. Backend Engineering Applications

Interval DP patterns appear in systems that optimize ordered aggregation or transformation:

- database query-plan parenthesization;
- hierarchical batch merging;
- log/event aggregation;
- document segmentation;
- range-based reconciliation;
- optimal transformation pipelines;
- expression planning;
- resource merge scheduling.

A backend implementation should expose workload limits because `O(n²)` memory can become the operational bottleneck before CPU becomes the bottleneck.

---

## 37. AI Engineering Applications

Interval DP can act as a deterministic optimization layer around AI systems.

Examples:

```text
AI proposes candidate decomposition
        ↓
DP validates/optimizes the decomposition
```

or:

```text
AI generates candidate segmentation
        ↓
interval DP computes exact cost
        ↓
select/validate according to deterministic rules
```

Applications include:

- structured text segmentation;
- hierarchical plan composition;
- sequence chunking;
- optimal merge planning;
- deterministic evaluation of candidate decompositions.

AI-generated choices should not replace the exact recurrence when correctness is required.

---

## 38. Testing Strategy

Interval DP is particularly suitable for differential testing because small inputs can be solved by exhaustive enumeration.

For small `n`:

```text
brute-force every legal partition
```

and compare against DP.

Test separately:

- value correctness;
- reconstruction correctness;
- tie-breaking;
- invalid split handling;
- optimized implementation equivalence.

---

## 39. Adversarial Cases

Important cases include:

```text
n = 0
n = 1
n = 2
all equal values
strictly increasing values
strictly decreasing values
large weights
zero weights
repeated dimensions
many equal-cost splits
highly skewed optimal splits
```

Tie-heavy inputs are especially valuable because an implementation may compute the correct optimum while reconstructing an invalid or nondeterministic partition.

---

## 40. Metamorphic Properties

Useful properties depend on the problem's semantics.

Examples:

- adding an irrelevant independent range should not change the optimal value of the original isolated interval;
- identical input representations should produce identical canonical output under deterministic tie-breaking;
- a reconstructed decomposition should evaluate to the DP's reported objective;
- splitting a solved interval according to its recorded parent should reproduce the stored subproblem costs.

Always prove a metamorphic property before turning it into a test oracle.

---

## 41. Differential Testing for Optimizations

If you later implement an optimized interval DP:

```text
O(n³) reference
        vs
optimized implementation
```

Use the simple cubic algorithm as the correctness oracle for small and medium inputs.

This is one of the safest ways to introduce advanced optimizations such as restricted split ranges.

Performance optimization should not eliminate the reference implementation from the repository.

---

## 42. Correctness Proof Template

For a split-based recurrence, prove:

### Base

Every minimum-size interval is initialized correctly.

### Soundness

Every candidate generated by a legal split represents a valid solution for `[l, r]`.

### Completeness

Every valid optimal decomposition has some final split `k` considered by the recurrence.

### Optimality

The minimum/maximum over all candidates therefore equals the optimal interval value.

### Induction

Because all child intervals are shorter, their values are already correct when `[l, r]` is evaluated.

---

## 43. Common Failure Modes

### Failure 1 — Wrong interval boundaries

Mixing inclusive and exclusive endpoints.

### Failure 2 — Wrong loop order

Computing a long interval before its children.

### Failure 3 — Missing split

Looping only to `r - 1` or incorrectly excluding a legal boundary.

### Failure 4 — Wrong merge cost

Using a local cost where the problem requires a whole-range aggregate.

### Failure 5 — Invalid sentinel arithmetic

Treating unreachable states as ordinary numbers.

### Failure 6 — Reconstruction mismatch

Returning a split tree that does not correspond to the stored optimum.

### Failure 7 — Unproved optimization

Restricting split candidates without proving the restriction is safe.

---

## 44. JavaScript Engineering

For a dense `n × n` DP table, nested JavaScript arrays are convenient but memory-heavy.

For numeric problems, consider:

- flattened arrays;
- typed arrays;
- triangular storage when appropriate;
- `Float64Array` for large numeric costs;
- `BigInt` only when exact integer magnitude requires it.

A flattened index can be:

```text
index = l * n + r
```

This improves locality and avoids thousands of small array objects.

Do not optimize representation before measuring the workload.

---

## 45. Memory Engineering

An `n × n` table has:

```text
O(n²)
```

cells.

For example, even before storing reconstruction metadata, a large dense table can consume substantial memory.

Unlike many 1D DP problems, interval DP generally cannot reduce to one row because a state depends on many differently positioned subintervals.

Space optimization requires exploiting additional problem structure, not merely copying rolling-array techniques.

---

## 46. Numeric Safety

Matrix-chain costs can involve products such as:

```text
p[i - 1] * p[k] * p[j]
```

Large dimensions can exceed JavaScript's exact integer range.

For exact integer optimization, determine whether `Number` is safe.

If not, use `BigInt` consistently for the arithmetic and comparisons.

Do not mix `Number` and `BigInt` implicitly.

---

## 47. Production Algorithm Selection

Before selecting an interval-DP implementation, identify:

```text
n
exact vs approximate objective
needs reconstruction?
tie-breaking requirements
numeric range
memory budget
CPU budget
```

Then estimate:

```text
states ≈ n²
transitions ≈ n³
```

If the workload cannot fit the budget, look for mathematical structure or a different formulation before optimizing JavaScript syntax.

---

## 48. Interview Derivation Framework

When given an unfamiliar range optimization problem:

### Step 1
Ask whether the answer for a contiguous range is useful.

### Step 2
Define:

```text
dp[l][r]
```

in one precise sentence.

### Step 3
Ask whether the final operation creates two smaller contiguous ranges.

### Step 4
Enumerate the split or final action.

### Step 5
Derive the merge cost from the actual operation.

### Step 6
Derive base cases.

### Step 7
Determine dependency order by interval length.

### Step 8
Calculate:

```text
number of states × transitions/state
```

### Step 9
Add reconstruction only if required.

### Step 10
Challenge the recurrence with brute force on tiny cases.

---

## 49. Master Pattern

The interval-DP mental model is:

```text
                    [l, r]
                       │
               choose final split/action
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
          [l, k]              [k+1, r]
             │                   │
             └─────────┬─────────┘
                       ▼
                  combine + cost
                       │
                       ▼
                   dp[l][r]
```

Implementation pattern:

```text
initialize base intervals

for length = smallest → n:
    for each l:
        r = l + length - 1

        best = identity

        for every legal split/action:
            candidate = combine(child states) + local cost
            best = aggregate(best, candidate)

        dp[l][r] = best
```

The implementation is straightforward once the state and final-decision decomposition are correct.

---

## 50. Revision Checklist

You should be able to explain without notes:

- Why interval DP uses `[l, r]` states.
- Why interval length is the natural bottom-up order.
- How Matrix Chain Multiplication is derived.
- Why Matrix Chain needs every split point.
- How to reconstruct an optimal parenthesization.
- Why Burst Balloons is easier when choosing the last balloon.
- How merge-cost DP uses prefix sums.
- How interval DP represents binary decomposition trees.
- Why Catalan growth makes brute-force parenthesization expensive.
- Why basic split-based interval DP is `O(n³)`.
- When palindrome recognition is interval DP without split enumeration.
- Why expression problems may require multiple values per interval.
- How invalid splits and infinity sentinels should be handled.
- When Knuth/divide-and-conquer optimization may apply.
- Why optimization conditions must be proven.
- How to differential-test an optimized implementation.
- How interval DP can support backend and AI engineering systems.

---

## 51. Final Master Questions

Before moving forward, derive these from first principles:

1. Why does choosing the last operation often make an interval problem easier?
2. Why does increasing interval length form a topological order?
3. What exactly causes `O(n³)` time in split-based interval DP?
4. When is prefix-sum preprocessing necessary?
5. Why is reconstruction naturally a binary-tree recovery problem?
6. When is `dp[l][r]` insufficient and an additional state dimension required?
7. What conditions would justify restricting the split range?
8. How would you prove an interval-DP optimization against a cubic reference implementation?
9. Why can interval DP require `O(n²)` memory even when many other DP patterns compress to `O(n)`?
10. How would you decide whether an unfamiliar problem is interval DP rather than prefix DP, greedy, divide-and-conquer, or backtracking?

---

## Phase 17 Position

```text
01 Fundamentals
02 State Design
03 Memoization
04 Tabulation
05 Space Optimization
06 1D DP
07 2D Grid DP
08 Subset Sum
09 LCS & Sequence Alignment
10 Coin Change & Unbounded Knapsack
11 Edit Distance & String Transformation
12 Interval DP & Range Partitioning   ← CURRENT
```

The core progression is deliberate:

```text
basic DP
  ↓
state design
  ↓
implementation strategies
  ↓
1D / 2D states
  ↓
selection/counting
  ↓
sequence transformation
  ↓
interval state spaces
```

Master the recurrence derivation—not the problem names.
