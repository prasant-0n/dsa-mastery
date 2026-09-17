# 10 — Coin Change & Unbounded Knapsack DP

> **Phase 17 — Dynamic Programming**
>
> Coin Change is the canonical unbounded-choice DP pattern. The important skill is recognizing when a decision may reuse the same item, defining the state around a capacity/amount, and choosing an evaluation order that preserves the intended semantics.

---

## 1. Why This Lesson Matters

Lesson 08 introduced 0/1 subset selection. Coin Change looks similar but changes one fundamental rule:

```text
0/1 item      → use at most once
unbounded item → reuse any number of times
```

That single semantic change affects:

- the recurrence;
- loop direction;
- counting semantics;
- reconstruction;
- complexity;
- correctness proofs.

Never copy a 0/1 knapsack loop into an unbounded problem without re-deriving the state transition.

---

## 2. The Core Coin Change Problem

Given coin denominations and an amount, determine the minimum number of coins required to form that amount.

Example:

```text
coins  = [1, 3, 4]
amount = 6

answer = 2   // 3 + 3
```

A coin may be used repeatedly.

The problem is not asking which individual input occurrence is selected. It asks which denomination may be selected any number of times.

---

## 3. State Design

For minimum coins, define:

```text
dp[a] = minimum number of coins needed to form amount a
```

The target is:

```text
dp[amount]
```

This is a compact state because the future only depends on the remaining amount, not on how we previously reached it.

That is the future-equivalence principle from earlier lessons.

---

## 4. Base Case

The empty amount requires zero coins:

```text
dp[0] = 0
```

For positive amounts that cannot currently be formed, use an explicit unreachable sentinel such as:

```text
INF = amount + 1
```

Do not use `0` for unreachable states because zero is a valid answer for amount zero.

---

## 5. Deriving the Recurrence

Suppose the final coin selected has value `c`.

Then immediately before selecting it, the remaining amount was:

```text
a - c
```

Therefore:

```text
dp[a] = 1 + min(dp[a - c])
```

for every coin `c <= a`.

More explicitly:

```text
dp[a] = min(
  dp[a - c1] + 1,
  dp[a - c2] + 1,
  ...
)
```

The recurrence comes from enumerating the possible final decisions.

---

## 6. Why Reuse Is Correct

After choosing coin `c`, the smaller state `dp[a - c]` may itself have used coin `c`.

That is not a bug. It is exactly what unbounded semantics require.

For example:

```text
coins = [3]
amount = 9

9 → 6 → 3 → 0
```

The same denomination is allowed at every transition.

The state decreases strictly in amount, so the dependency graph is acyclic.

---

## 7. Bottom-Up Evaluation

For minimum Coin Change:

```text
for amount = 1 → target
    for each coin
        relax dp[amount] from dp[amount - coin]
```

Because `dp[amount]` depends on smaller amounts, increasing amount order is natural.

This is different from 0/1 subset-sum compression, where descending capacity prevents reuse.

Here ascending amount order permits reuse intentionally.

---

## 8. Loop Direction Is Semantics

Compare:

```text
0/1 subset / knapsack
→ descending capacity
→ current item cannot see itself in the same pass
```

with:

```text
unbounded knapsack / Coin Change
→ ascending capacity
→ current item may contribute repeatedly
```

A loop direction is therefore part of the mathematical proof when a compressed DP table is used.

---

## 9. Minimum Coins vs Number of Ways

Coin Change has at least two classic interpretations.

### Minimum coins

```text
dp[a] = minimum number of coins
```

Aggregation:

```text
MIN
```

### Number of combinations

```text
dp[a] = number of ways to form amount a
```

Aggregation:

```text
SUM
```

These are different problems even though they use the same state dimension.

---

## 10. Combination vs Permutation Semantics

This is one of the most important Coin Change traps.

Suppose:

```text
coins = [1, 2]
amount = 3
```

The combination:

```text
1 + 2
```

should normally count once.

But ordered sequences:

```text
1 + 2
2 + 1
```

are two different permutations.

The loop nesting determines which semantics you compute.

---

## 11. Counting Combinations

For order-independent combinations, process coins outside and amounts inside:

```text
for coin of coins
    for amount = coin → target
        dp[amount] += dp[amount - coin]
```

The coin dimension establishes a canonical nondecreasing choice order.

Thus different orderings of the same selected denominations are not counted separately.

---

## 12. Counting Permutations

For ordered sequences, process amount outside:

```text
for amount = 1 → target
    for coin of coins
        dp[amount] += dp[amount - coin]
```

Now every valid previous sequence can be extended by every possible final coin.

The state represents ordered constructions, so `1 + 2` and `2 + 1` can both contribute.

The recurrence alone does not specify the counting semantics; evaluation order can be part of the specification.

---

## 13. Unbounded Knapsack

Coin Change generalizes to unbounded knapsack.

Each item has:

```text
weight / cost
value
```

and may be selected repeatedly.

Define:

```text
dp[c] = best value achievable with capacity c
```

Then:

```text
dp[c] = max(dp[c - weight[i]] + value[i])
```

for every item that fits.

Ascending capacity permits repeated use of an item.

---

## 14. 0/1 vs Unbounded Knapsack

The state can look identical:

```text
dp[capacity]
```

but the temporal meaning differs.

### 0/1

Read from the previous logical item state:

```text
capacity descending
```

### Unbounded

Read from the current item's already-updated state:

```text
capacity ascending
```

This is a powerful interview lesson:

> Same state does not imply same problem semantics.

---

## 15. Reachability Version

Before optimizing, solve the simpler question:

> Can the amount be formed at all?

Define:

```text
dp[a] = true if amount a is reachable
```

Then:

```text
dp[a] |= dp[a - c]
```

This separates feasibility from optimization and makes correctness easier to reason about.

---

## 16. Reconstruction

For minimum Coin Change, store a parent decision:

```text
parentCoin[a] = coin selected to reach optimal a
```

Then:

```text
a = target
while a > 0
    c = parentCoin[a]
    output c
    a -= c
```

The parent must correspond to an optimal transition.

Always validate that reconstruction actually reaches zero and uses the reported number of coins.

---

## 17. Tie-Breaking

There may be multiple minimum-coin solutions.

The specification may require:

```text
any optimal solution
fewest coins, then smallest denomination
fewest coins, then lexicographically smallest sequence
fewest coins, then deterministic canonical representation
```

Tie-breaking may require:

- deterministic iteration order;
- explicit comparison of candidate witnesses;
- additional state;
- a second reconstruction phase.

Do not accidentally turn a simple `O(target * coins)` value computation into an expensive string-comparison DP.

---

## 18. Impossible Amounts

If no coin combination forms the target, return an explicit failure representation such as:

```text
-1
```

or:

```text
null
```

internally, an unreachable sentinel is often cleaner.

The sentinel must not participate in arithmetic as if it were a real finite value.

For example, avoid blindly computing:

```text
INF + 1
```

and treating it as a valid candidate.

---

## 19. Duplicate Denominations

Input may contain:

```text
[1, 2, 2, 5]
```

If denomination identity does not matter, duplicate values are redundant for minimum Coin Change and can also distort counting if processed as separate choices.

Normalize denominations when the problem semantics define them as values rather than distinct item types.

But do not deduplicate when the input explicitly treats equal-valued items as distinct resources.

Input normalization is therefore a semantic decision, not merely an optimization.

---

## 20. GCD Reachability Insight

If every denomination has a common divisor:

```text
g = gcd(coins)
```

then every reachable amount must be divisible by `g`.

Therefore, if:

```text
amount % g !== 0
```

the target is impossible.

This is a mathematical pre-check that can avoid unnecessary DP work.

It is a necessary condition, not generally a sufficient condition for arbitrary bounded targets.

---

## 21. Canonical Coin Systems and Greedy

Some coin systems allow greedy selection to produce a minimum-coin answer.

For example, repeatedly taking the largest fitting denomination works for common canonical currency systems.

But greedy is **not** universally correct.

A classic counterexample is:

```text
coins = [1, 3, 4]
amount = 6
```

Greedy chooses:

```text
4 + 1 + 1 = 3 coins
```

while DP finds:

```text
3 + 3 = 2 coins
```

The lesson is not “greedy is bad.” The lesson is to prove the required greedy-choice property before replacing DP with greedy.

---

## 22. Bounded vs Unbounded Supply

A problem statement may say:

```text
coin denomination can be used unlimited times
```

or:

```text
there are only k copies of this item
```

The second is a bounded knapsack problem.

Possible techniques include:

- explicit item expansion for small counts;
- binary decomposition of multiplicities;
- bounded knapsack transitions;
- monotonic-queue optimization for certain formulations.

Do not silently apply unbounded transitions to bounded inventory.

---

## 23. Multi-Dimensional Unbounded DP

Real problems may impose more than one resource constraint.

Example:

```text
dp[budget][latency]
```

where each option may be selected repeatedly.

The same state-design principle applies:

> Store exactly the information required to describe the remaining future problem.

As dimensions increase, state count can grow multiplicatively.

Operational feasibility must be analyzed before implementation.

---

## 24. Alternative Top-Down Formulation

Define:

```text
solve(remaining)
```

as the minimum coins needed for the remaining amount.

Transition:

```text
solve(r) = 1 + min(solve(r - coin))
```

for coins that fit.

Memoization computes only reachable remaining amounts.

Bottom-up computes all amounts in dependency order.

Same state graph, different evaluation strategy.

---

## 25. Complexity

Let:

```text
T = target amount
K = number of denominations
```

The standard one-dimensional DP costs:

```text
Time:  O(TK)
Space: O(T)
```

This is pseudo-polynomial in the numeric target.

If `T` is encoded in binary, the input contains only `O(log T)` bits for the target, while the table may contain `O(T)` states.

This matters when designing systems that accept large numeric inputs.

---

## 26. State-Space Alternatives

The dense array is ideal when:

```text
T is moderate
```

For huge targets or sparse reachable amounts, alternatives include:

- `Map`/`Set` sparse DP;
- shortest-path formulations;
- meet-in-the-middle for different bounded variants;
- mathematical number-theoretic methods for special cases;
- bounded-state search with pruning.

Choose the representation based on the reachable state space, not the elegance of the recurrence alone.

---

## 27. Coin Change as Shortest Path

Construct a directed graph whose nodes are amounts:

```text
0, 1, 2, ..., T
```

For every coin `c`, add:

```text
a → a + c
```

when the destination is within the target.

Every edge has cost `1`.

Then minimum Coin Change is a shortest-path problem from `0` to `T` on a DAG because amounts strictly increase.

This viewpoint connects DP to graph algorithms and makes the recurrence intuitive.

---

## 28. Weighted Coin Costs

Suppose each denomination has a different usage cost:

```text
coin = 5
cost = 2
```

Then the recurrence becomes:

```text
dp[a] = min(dp[a - coin] + usageCost)
```

The optimization is no longer “minimum number of coins.”

The same state can solve a broader minimum-cost unbounded selection problem.

State meaning should describe the objective precisely.

---

## 29. Negative Costs and Cycles

The standard amount DP assumes transitions increase the amount and the optimization model is well-founded.

If a generalized problem permits transitions that can decrease and later increase a state, the dependency graph may contain cycles.

Then ordinary bottom-up DP may no longer apply.

Likewise, negative-cost cycles can make a minimum objective unbounded.

Always verify that the state graph is acyclic—or choose an algorithm designed for cyclic graphs.

---

## 30. BigInt Counting

The number of ways to make an amount can grow rapidly.

For example, a large target with many small denominations can produce counts far beyond `Number.MAX_SAFE_INTEGER`.

If exact counting is required, use:

```js
BigInt
```

or a specified modulus.

Do not silently return an unsafe floating-point integer as an exact count.

---

## 31. Modular Counting

If the problem asks for:

```text
answer mod M
```

apply the modulus during transitions:

```text
dp[a] = (dp[a] + dp[a - coin]) % M
```

This prevents unnecessary growth.

But define whether `M` fits JavaScript `Number` arithmetic safely. For arbitrary large moduli, use `BigInt`.

---

## 32. JavaScript Engineering

Validate inputs before allocating:

```text
negative target
non-integer target
zero denomination
negative denomination
empty denomination list
huge target
```

A zero denomination is especially dangerous because:

```text
a - 0 === a
```

creates a self-dependency rather than progress.

Reject or explicitly handle invalid denominations.

For dense minimum-coin DP, a typed array such as `Int32Array` can reduce memory overhead when the sentinel and answer fit safely.

---

## 33. Correctness Invariant — Minimum Coins

After processing amounts through `a` in increasing order:

> `dp[a]` equals the minimum number of allowed coins required to form amount `a`, or the unreachable sentinel if no valid combination exists.

For each candidate final coin `c`, the smaller amount `a - c` has already been solved.

Taking the minimum over every legal final coin therefore considers every optimal final decision.

That is the core induction proof.

---

## 34. Correctness Invariant — Combination Counting

When coins are processed outermost and amount increases inner-most:

> after processing the first `i` denominations, `dp[a]` counts combinations forming `a` using only those denominations, where denomination order does not create distinct solutions.

The processing order creates a canonical construction order and prevents permutation duplicates.

---

## 35. Differential Testing

For small targets, construct brute-force reference solvers.

Compare:

```text
recursive minimum search
vs
memoized DP
vs
bottom-up DP
```

For counting, build separate oracles for:

```text
combinations
permutations
```

Do not compare a combination solver against a permutation oracle.

For reconstruction, validate:

1. every selected denomination is valid;
2. the sum equals the target;
3. the number of selected coins equals the reported optimum;
4. the solution is impossible exactly when the value DP says so.

---

## 36. Metamorphic Testing

Useful properties include:

- adding a duplicate denomination should not change minimum Coin Change when denominations are value-based;
- permutation of the denomination list should not change minimum cost;
- multiplying every denomination and target by the same positive factor preserves the structural solution after scaling;
- adding a denomination larger than the target cannot change feasibility or minimum answer;
- for combination counting, reordering input denominations must not change the result;
- combination counts should never exceed permutation counts when both are defined over the same unlimited choices.

Every property must match the exact input semantics.

---

## 37. Adversarial Cases

Use cases such as:

```text
amount = 0
coins = []
coins = [1]
coins = [2] with odd target
coins = [1, 3, 4], target = 6
many duplicate denominations
large denomination gaps
many denominations near target
large target with gcd obstruction
zero denomination
negative denomination
very large counting result
```

The goal is to expose semantic bugs, not merely syntax errors.

---

## 38. Backend Engineering Applications

Unbounded knapsack patterns appear in:

- pricing/package composition;
- compute-resource allocation;
- subscription bundle construction;
- workload batching;
- capacity planning;
- storage tier selection;
- repeated service-plan selection;
- cost-minimizing configuration.

A production API should define:

```text
maximum target
maximum number of options
CPU budget
memory budget
cancellation behavior
numeric precision
output/tie-break contract
```

For untrusted targets, allocation limits are part of correctness from an operational perspective.

---

## 39. AI Engineering Applications

An AI system may propose candidate components repeatedly:

```text
AI proposal
   ↓
formal resource constraints
   ↓
unbounded DP
   ↓
optimal / feasible configuration
```

The DP layer can provide deterministic validation and optimization beneath a generative planner.

For example, an AI planner could suggest reusable service tiers, but a deterministic optimizer can enforce exact budget constraints before deployment.

The principle is the same as earlier phases:

> probabilistic proposal → deterministic constraint/optimization boundary.

---

## 40. Interview Derivation Framework

When you see a Coin Change / unbounded knapsack problem:

1. Determine whether choices are reusable.
2. Determine whether the objective is feasibility, count, min, or max.
3. Define the state in one sentence.
4. Derive the final-choice recurrence.
5. Establish the base case.
6. Identify the dependency direction.
7. Choose top-down or bottom-up.
8. If compressing state, prove the loop order.
9. Separate combination from permutation counting.
10. Discuss reconstruction if requested.
11. Check impossible-state semantics.
12. Analyze pseudo-polynomial complexity.
13. Test against a brute-force oracle on small inputs.

A strong explanation sounds like a derivation rather than a memorized template.

---

## 41. Common Failure Modes

### Failure 1 — Using descending capacity

This accidentally prevents intended reuse.

### Failure 2 — Confusing combinations and permutations

Loop nesting changes the counting semantics.

### Failure 3 — Using greedy without proof

Coin systems are not universally canonical.

### Failure 4 — Treating `0` as unreachable

Amount zero legitimately requires zero coins.

### Failure 5 — Allowing zero denominations

They create self-dependencies.

### Failure 6 — Ignoring duplicate semantics

Duplicate denominations can distort counting.

### Failure 7 — Returning unsafe counts

Large exact counts require `BigInt` or a modulus.

### Failure 8 — Allocating `target + 1` blindly

Untrusted numeric input can cause memory exhaustion.

---

## 42. Master Pattern

The reusable pattern is:

```text
1. Define the state.
2. Define the objective.
3. Enumerate the final reusable choice.
4. Derive the transition.
5. Define unreachable states explicitly.
6. Establish dependency order.
7. Evaluate bottom-up or memoize top-down.
8. Prove the loop direction when compressing state.
9. Add parent information only when reconstruction is required.
10. Define counting semantics before counting.
11. Validate with brute force on small instances.
12. Add operational guardrails for large numeric state spaces.
```

This pattern applies far beyond coins.

---

## 43. Revision Checklist

Before leaving this lesson, you should be able to explain without notes:

- why Coin Change is unbounded;
- why amount order is naturally ascending;
- why 0/1 and unbounded knapsack use different compressed-loop directions;
- how minimum Coin Change differs from counting Coin Change;
- why loop nesting changes combination/permutation counting;
- how to reconstruct an optimal solution;
- when greedy works and why it can fail;
- how gcd gives a necessary reachability filter;
- why the standard solution is pseudo-polynomial;
- when sparse DP may beat a dense array;
- how Coin Change maps to shortest path;
- how to make counting exact with `BigInt`;
- how to test the implementation against a brute-force oracle.

If you can derive all of these from first principles, the pattern is becoming reusable rather than memorized.

---

## 44. Phase Integration

This lesson connects directly to earlier DP ideas:

```text
Lesson 01 → overlapping subproblems
Lesson 02 → state and recurrence design
Lesson 03 → memoization
Lesson 04 → dependency order
Lesson 05 → space optimization
Lesson 06 → 1D transitions
Lesson 08 → 0/1 subset semantics
Lesson 10 → unbounded reusable-choice semantics
```

The critical progression is:

```text
same DP machinery
        ↓
change the state semantics
        ↓
change the dependency/evaluation order
        ↓
change the problem being solved
```

That is the deeper lesson of unbounded DP.
