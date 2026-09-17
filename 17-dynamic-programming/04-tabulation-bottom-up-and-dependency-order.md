# 04 — Tabulation: Bottom-Up DP & Dependency Order

> **Phase 17 — Dynamic Programming**
>
> Tabulation is the bottom-up evaluation of a DP state graph. The central skill is proving that every dependency is solved before the state that consumes it.

---

## 1. Mental Model

Top-down DP starts from demand. Tabulation starts from known states:

```text
base states → dependencies → target
```

A table is only storage. The real object is the **state dependency graph**.

## 2. The Four Questions

Before writing a loop, answer:

1. What exactly does `dp[state]` mean?
2. Which states does it depend on?
3. What are the base states?
4. In what order must states be evaluated?

If these are unclear, implementation is premature.

## 3. Fibonacci

For `F(i) = F(i-1) + F(i-2)`:

```text
dp[0] = 0
dp[1] = 1
dp[i] = dp[i-1] + dp[i-2]
```

Increasing `i` works because both dependencies have smaller indices.

## 4. Dependency Order Is the Rule

Do not memorize “DP loops go left to right.” The correct rule is:

> A state may be evaluated only after every dependency required by its transition has a correct value.

For a grid, row-major order may work when dependencies are above and left. Another recurrence may require reverse or column-major order.

## 5. Tabulation as Topological Evaluation

If states form a DAG, tabulation is evaluation in a topological/dependency order.

```text
DP table ≠ necessarily an array
DP order = valid topological order of state dependencies
```

This generalizes naturally to DAG DP.

## 6. Dense 1D and 2D Tables

Dense integer states commonly use arrays:

```js
const dp = new Array(n + 1).fill(0);
```

For `(i, j)` states:

```js
const dp = Array.from(
  { length: n + 1 },
  () => new Array(m + 1).fill(0)
);
```

The bounds and initialization must match the state semantics.

## 7. Base Cases

For every base state document:

```text
state → mathematical meaning → stored value
```

Typical values include `0`, `1`, `false`, or `Infinity` for impossible minimization states. Sentinels must never be treated as ordinary values without checking their semantics.

## 8. Exact vs At-Most vs Prefix States

These meanings are different:

```text
dp[i] = answer using exactly i items
dp[i] = answer using at most i items
dp[i] = answer for prefix [0..i]
dp[i] = answer ending exactly at i
```

They can require different transitions and target states.

## 9. Transition Completeness

For a state `s`, ask:

> If an optimal solution reaches `s`, what was the final decision before entering `s`?

Enumerating every valid predecessor gives the transition. Missing one predecessor can silently produce an incorrect optimum.

## 10. Forward vs Reverse Formulations

A DP can define:

```text
dp[i] = best answer ending at i
```

or:

```text
dp[i] = best answer starting at i
```

The formulation determines base states, dependency direction, loop order, and reconstruction direction.

If `dp[i]` depends on `dp[i+1]`, a reverse loop is usually required:

```js
for (let i = n; i >= 0; i--) {
  // dependencies already computed
}
```

## 11. 0/1 Knapsack Loop Direction

For 0/1 selection with a 1D capacity table, process capacity in descending order:

```text
for each item:
    for capacity descending:
        update from capacity - weight
```

Ascending capacity can allow the current item to be reused during the same iteration, changing the semantics toward unbounded selection. Loop direction is therefore part of the mathematical recurrence.

## 12. In-Place Tabulation

Start with a full table when correctness is unclear. Then:

```text
full DP → identify live dependencies → reuse storage
```

Never compress first and guess whether an overwritten value is still needed.

## 13. Space Optimization

If a row depends only on the previous row, retain two rows. If the recurrence allows it, a single row may be updated in a carefully chosen direction.

Space optimization changes storage, not necessarily time.

## 14. When Full Tables Are Necessary

Keep the full table when you need:

- arbitrary-state reconstruction
- debugging/tracing
- later queries over historical states
- older dependencies
- maximum implementation transparency

Optimization is optional after correctness is established.

## 15. Reconstruction

The objective value and actual solution are separate outputs.

Options include:

- choice tables
- parent pointers
- recomputing which predecessor satisfies the recurrence

Always verify reconstruction against the objective value.

## 16. Sparse Tabulation

Tabulation does not require a rectangular table. Sparse states can use:

- `Map`
- explicit state lists
- generated DAGs
- coordinate compression

The invariant remains: every dependency must be evaluated first.

## 17. DAG Dynamic Programming

For a weighted DAG:

1. obtain a topological order
2. initialize source states
3. process each state in that order
4. relax outgoing transitions
5. read the target

This is DP without a conventional DP array.

## 18. Detecting Invalid Orders

For every dependency edge:

```text
u → v
```

require:

```text
position(u) < position(v)
```

If no such ordering exists because dependencies contain a cycle, ordinary one-pass DAG tabulation is invalid.

## 19. Cycles Are Different

A dependency cycle such as `A → B → C → A` has no topological order. Do not repair it with an arbitrary loop order. Reformulate with an appropriate method such as shortest paths, fixed-point computation, SCC processing, or another well-founded state definition.

## 20. Bottom-Up vs Top-Down

```text
Top-down:    target → needed dependencies
Bottom-up:   base → evaluation order → target
```

Top-down may skip unreachable states. Bottom-up often gives predictable iteration and makes space compression easier.

Choose from the state graph rather than habit.

## 21. Complexity

If there are `S` states and `T` transition work per state:

```text
Time  = O(S × T)
Space = O(S)
```

Compression can reduce space but not automatically time. Count actual states and transition operations.

## 22. Correctness Proof

Use a loop invariant:

> Before processing state `s`, every dependency required by `s` contains its mathematically correct answer.

Prove:

1. initialization establishes the invariant
2. the order respects dependencies
3. every valid transition is considered
4. the recurrence computes the correct value
5. the invariant remains true
6. the target contains the requested answer

For in-place DP, explicitly prove that overwritten values are no longer required.

## 23. Testing

Use a small brute-force or top-down oracle and compare implementations.

Test:

- empty and minimum inputs
- impossible states
- duplicate transitions
- zero/negative values where valid
- boundary capacities
- one-row/one-column grids
- reverse dependencies
- loop-direction-sensitive cases
- reconstruction

## 24. Metamorphic Testing

Properties must follow from the problem semantics.

Examples:

- Adding a valid move cannot make a reachability answer become unreachable.
- Adding an option cannot increase a minimization optimum if all previous options remain available.
- Duplicate transitions may or may not change counts depending on whether duplicate choices are distinct.

## 25. JavaScript Engineering

Dense numeric DP may use `Array` or typed arrays such as `Int32Array`/`Float64Array` when appropriate. Be careful with safe integer limits, `Infinity`, `BigInt` type mixing, nested-array allocation, and accidental sparse arrays.

For huge tables, memory layout and cache locality can dominate runtime.

## 26. Backend Applications

Bottom-up state evaluation appears in:

- dependency planning
- workflow scheduling
- resource allocation
- DAG execution planning
- deterministic configuration optimization
- capacity planning

Production implementations also need memory limits, cancellation, observability, and predictable runtime.

## 27. AI Engineering Applications

Bounded structured state spaces can use tabulation for:

- sequence scoring
- constrained decoding
- segmentation
- finite-horizon planning
- alignment/edit-distance-style computation

A useful architecture is:

```text
candidate states → valid transitions → DP values → best result → reconstruction
```

AI-generated candidates can feed a deterministic DP layer while exact constraints remain in the DP logic.

## 28. Interview Derivation Framework

For an unfamiliar DP problem:

```text
1. Define dp[...] in one sentence.
2. Ask what the final decision was.
3. Enumerate valid predecessors.
4. Derive the recurrence.
5. Establish base states.
6. Determine dependency direction.
7. Choose evaluation order.
8. Count states.
9. Count transition work.
10. Decide whether full storage is needed.
11. Prove the invariant.
12. Test against brute force.
```

## 29. Common Failure Modes

- Filling a table before defining its meaning.
- Wrong base cases.
- Computing a state before its dependency.
- Missing a predecessor.
- Reading an overwritten value.
- Confusing exact, at-most, prefix, and suffix semantics.
- Returning the wrong target cell.
- Assuming 1D compression is always safe.
- Treating sentinels as ordinary values.
- Optimizing before proving correctness.

## 30. Master Pattern

```text
Problem
  ↓
State definition
  ↓
Recurrence
  ↓
Base cases
  ↓
Dependency graph
  ↓
Valid evaluation order
  ↓
Full tabulation
  ↓
Correctness proof
  ↓
Complexity
  ↓
Safe space compression
  ↓
Reconstruction if required
  ↓
Differential + adversarial testing
```

### Revision Questions

1. Why is tabulation fundamentally a dependency-ordering problem?
2. How do you derive loop direction from a recurrence?
3. Why does descending capacity preserve 0/1 semantics?
4. When is a full table required for reconstruction?
5. How can DP operate over a sparse DAG?
6. What proves an in-place update is safe?
7. Why can bottom-up DP compute unnecessary states?
8. How do you detect an invalid evaluation order?

**Completion standard:** derive a bottom-up DP for a previously unseen problem without memorizing its table shape.
