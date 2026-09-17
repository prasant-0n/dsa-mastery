# 06 — 1D DP: Linear State & Transition Patterns

> **Phase 17 — Dynamic Programming**
>
> One-dimensional DP is the cleanest environment for learning how a problem becomes a state machine: define what `dp[i]` means, enumerate the decisions that can reach `i`, derive the transition, then choose the smallest sufficient history.

---

## 1. The Core Model

Many sequence problems can be expressed as:

```text
dp[i] = answer for a prefix ending at position i
```

The important question is not “which famous DP problem is this?”

It is:

> **What information about the prefix is sufficient to make every future decision?**

A linear DP usually has:

```text
input prefix
   ↓
state at i
   ↓
possible last decisions
   ↓
transition from earlier states
   ↓
state at i
```

---

## 2. Prefix State Semantics

A state such as:

```text
dp[i] = best answer using elements [0 ... i]
```

is different from:

```text
dp[i] = best answer ending exactly at i
```

This distinction is fundamental.

For example, the maximum subarray problem naturally uses an **ending-at-i** state, while House Robber naturally uses a **prefix-optimum** state.

Never use `dp[i]` until its semantic contract is explicit.

---

## 3. Last-Decision Decomposition

A powerful derivation technique is to ask:

> What was the final decision that produced the answer for state `i`?

If the last action has two possibilities:

```text
skip item i
or
use item i
```

then a typical recurrence becomes:

```text
dp[i] = max(
  dp[i - 1],
  dp[i - 2] + value[i]
)
```

The recurrence is not memorized. It follows from the mutually exclusive final decisions.

---

## 4. Base Cases Are Semantic

For a linear DP, define small states before writing the loop.

Example:

```text
dp[0] = answer for the first valid prefix
```

and perhaps:

```text
dp[-1] = identity / empty-prefix state
```

The correct base case depends on the state meaning.

Common bugs come from copying base cases between problems whose state semantics differ.

---

## 5. Climbing Stairs

If each move advances either one or two steps:

```text
dp[i] = number of ways to reach i
```

The final move must come from either:

```text
i - 1
or
 i - 2
```

Therefore:

```text
dp[i] = dp[i - 1] + dp[i - 2]
```

This is a linear recurrence, but its real value is methodological: **count ways by partitioning paths according to their final action**.

---

## 6. Variable-Step Reachability

Generalize the previous idea.

Given allowed jumps `steps`, define:

```text
dp[i] = number of ways to reach i
```

Then:

```text
dp[i] = Σ dp[i - step]
```

for every valid `step`.

The same state can support:

- reachability
- counting
- minimum number of jumps
- maximum reward
- reconstruction of one valid path

Only the aggregation changes.

---

## 7. Aggregation Operator

Many linear DPs share the same dependency structure but differ in what they aggregate.

Examples:

```text
counting      → sum
reachability  → OR
minimum       → min
maximum       → max
probability   → weighted sum
```

This suggests a useful abstraction:

```text
state + transitions + aggregation + identity
```

Understanding this pattern makes it easier to derive new DPs.

---

## 8. House Robber Pattern

For a sequence of non-negative rewards where adjacent elements cannot both be selected:

```text
dp[i] = best reward from the first i elements
```

At each item:

```text
skip → dp[i - 1]
use  → dp[i - 2] + value[i]
```

Thus:

```text
dp[i] = max(dp[i - 1], dp[i - 2] + value[i])
```

The constraint becomes a dependency distance.

This is an important transformation:

> **A local combinatorial constraint often appears as a restricted predecessor set in the DP.**

---

## 9. State Machine View

The House Robber recurrence can also be represented with two states:

```text
notTaken
Taken
```

For each value:

```text
newTaken    = oldNotTaken + value
newNotTaken = max(oldNotTaken, oldTaken)
```

This state-machine formulation is often easier to extend when constraints become more complicated.

Examples:

- cooldown
- transaction limits
- mandatory waiting
- multiple resource states
- finite modes

---

## 10. Maximum Subarray

For maximum subarray, define:

```text
dp[i] = maximum sum of a subarray ending exactly at i
```

Then the subarray either:

```text
starts at i
```

or extends the best subarray ending at `i - 1`.

Therefore:

```text
dp[i] = max(value[i], dp[i - 1] + value[i])
```

The global answer is:

```text
max(dp[i])
```

This demonstrates why “prefix optimum” and “ending-at-i optimum” must not be confused.

---

## 11. Minimum Cost to Reach a Position

If each position has a cost and movement has bounded predecessors:

```text
dp[i] = minimum cost to reach i
```

Then:

```text
dp[i] = cost[i] + min(dp[p])
```

over valid predecessor positions `p`.

The same framework handles:

- staircase cost
- minimum travel cost
- weighted jumps
- production planning
- resource transitions

---

## 12. Counting vs Optimization

A common mistake is changing only `max` to `sum` without changing state semantics.

For counting:

```text
dp[i] = number of valid constructions reaching i
```

For optimization:

```text
dp[i] = best score among constructions reaching i
```

The state meaning must match the algebra used by the transition.

---

## 13. Exactly vs At-Most vs Ending-At

Linear DP questions frequently differ by one word:

```text
exactly i
at most i
ending at i
using first i
```

These are different mathematical states.

A useful discipline is to write a sentence before coding:

> `dp[i]` means __________________.

If you cannot complete that sentence precisely, the DP is not ready to implement.

---

## 14. Bounded Local Dependencies

Suppose:

```text
dp[i] depends only on dp[i-1], ..., dp[i-k]
```

Then the recurrence has bounded dependency width.

This immediately suggests:

```text
O(k) auxiliary space
```

using a rolling history.

Lesson 05 studied the memory principle. Here the focus is deriving the dependency structure from the problem itself.

---

## 15. When One Dimension Is Not Enough

A sequence may require additional context.

For example, stock trading with a cooldown may require:

```text
index
holding/not holding
cooldown state
```

So the state becomes:

```text
DP[i][state]
```

The important lesson is not “use 2D DP.”

It is:

> **Add a dimension only when future behavior depends on information that the current state does not contain.**

---

## 16. Finite-State Dynamic Programming

Many linear DPs can be modeled as a finite-state machine processing one input item at a time.

General form:

```text
state[i][s] = best/count/reachability after processing prefix i in mode s
```

Each input item induces transitions:

```text
(s, input[i]) → s'
```

This creates a bridge between:

- DP
- automata
- parsing
- sequence processing
- transaction-state machines
- constrained decoding

---

## 17. Stock Trading as a State Machine

A simplified unlimited-transaction model can use:

```text
cash[i] = best value while not holding
hold[i] = best value while holding
```

Transitions encode legal actions:

```text
cash → hold  : buy
hold → cash  : sell
```

Adding constraints means adding state information rather than rewriting the entire algorithm from scratch.

Examples:

```text
cooldown
transaction count
fee mode
```

---

## 18. Decision DAG Interpretation

Every linear DP creates a directed acyclic state graph when transitions move from earlier positions to later positions.

For each `i`:

```text
predecessor states → i
```

Then solving the DP means evaluating the DAG in topological order.

This unifies:

```text
recurrence
memoization
```

and

```text
tabulation
```

as different evaluation strategies over the same state graph.

---

## 19. Reconstruction

If the answer requires the actual decisions rather than only the optimal value, store enough information to recover them.

For each state, you may record:

```text
chosen predecessor
chosen action
```

Then reconstruct by following parent pointers backward.

Example:

```text
best[i] ← skip
best[i] ← take from i-2
```

Do not confuse computing the optimum with reconstructing the optimum.

---

## 20. Tie Handling

Multiple optimal solutions may exist.

Define a policy:

```text
first optimum
lexicographically smallest
fewest actions
stable earliest choice
all optima
```

Tie-breaking is part of the algorithm's contract when output identity matters.

A value-only DP can hide this requirement.

---

## 21. Negative Values

Negative inputs expose incorrect base cases.

For maximum subarray, initializing everything to zero incorrectly permits an empty result when the specification requires a non-empty subarray.

Always ask:

```text
Is empty selection allowed?
Is zero a valid score?
Can all values be negative?
```

The answer determines the identity and base states.

---

## 22. Large Counts

Counting paths can exceed JavaScript's safe integer range.

For exact counting, use `BigInt` where necessary:

```js
0n
1n
```

The recurrence remains conceptually identical, but arithmetic and testing must respect the numeric type.

---

## 23. Complexity Derivation

If there are `n` states and each state examines at most `k` predecessors:

```text
Time  = O(nk)
Space = O(n)
```

With bounded-history compression:

```text
Space = O(k)
```

If `k` is constant:

```text
Time  = O(n)
Space = O(1)
```

The complexity should be derived from state count × transition cost, not guessed from the problem name.

---

## 24. Correctness Invariant

For a prefix DP, a typical invariant is:

> After processing position `i`, the stored state equals the mathematically defined answer for exactly the prefix/state described by the recurrence.

For a compressed implementation, add a representation invariant:

> Every retained variable represents the exact logical predecessor state required by the next transition.

These two invariants provide a clean correctness proof.

---

## 25. Differential Testing

For every optimized linear DP, keep a small reference implementation.

Compare:

```text
brute force
vs
memoized
vs
tabulated
vs
space-optimized
```

Random small cases are particularly effective for finding recurrence and boundary mistakes.

---

## 26. Adversarial Cases

Always test:

- empty input
- one element
- two elements
- all zeros
- all negative values where applicable
- strictly increasing values
- strictly decreasing values
- repeated values
- very large values
- maximum jump sizes
- impossible targets
- many tied optima
- inputs that force the base case

A DP should survive semantic edge cases, not only happy-path examples.

---

## 27. Backend Engineering Applications

Linear DP appears naturally in backend systems that process ordered events or decisions:

- pricing plans
- subscription transitions
- resource allocation
- job scheduling
- request routing with bounded states
- reconciliation sequences
- workload batching
- policy/state-machine evaluation

The finite-state perspective is especially useful when a backend workflow has explicit legal transitions.

Instead of embedding a complicated set of conditionals, model:

```text
state + event → next state + score
```

and optimize over the sequence when necessary.

---

## 28. AI Engineering Applications

The same pattern appears in sequential AI systems:

- constrained decoding
- sequence alignment
- finite-state generation constraints
- structured prediction
- planning with bounded state
- dynamic scoring over candidate sequences

A useful architecture is:

```text
candidate action
      ↓
state transition
      ↓
constraint validation
      ↓
score aggregation
      ↓
next DP state
```

This is often more reliable than treating every sequence problem as unrestricted search.

---

## 29. Interview Derivation Framework

When given a new 1D DP problem:

1. Define the smallest meaningful prefix/state.
2. Write exactly what `dp[i]` means.
3. Ask what the final decision at `i` could be.
4. Enumerate all legal predecessors.
5. Choose the aggregation operator: sum/min/max/OR/etc.
6. Derive base cases from the state definition.
7. Determine evaluation order.
8. Build a full-table reference solution.
9. Compress memory only after dependencies are proven.
10. State time, space, correctness invariant, and reconstruction strategy.

---

## 30. Master Pattern

```text
sequence
   ↓
state semantics
   ↓
last decision
   ↓
legal predecessors
   ↓
transition
   ↓
base cases
   ↓
aggregation
   ↓
state DAG
   ↓
full DP
   ↓
state compression
   ↓
proof + differential testing
```

The deepest lesson is:

> **Linear DP is not a collection of named problems. It is the systematic conversion of sequential decisions into a finite set of reusable states and transitions.**

---

## Revision Checklist

You should be able to:

- distinguish prefix and ending-at-position states
- derive Climbing Stairs from final-step decomposition
- derive House Robber from skip/take decisions
- derive Maximum Subarray from “start vs extend”
- generalize bounded jumps
- identify the correct aggregation operator
- distinguish exactly/at-most/ending-at semantics
- recognize when an extra state dimension is necessary
- model sequential problems as finite-state DP
- derive stock-style state machines
- reconstruct decisions
- define tie-breaking behavior
- handle negative values and invalid states
- derive complexity from states and transitions
- connect linear DP to DAG evaluation
- validate implementations with differential testing
