# 02 — DP State Design & Recurrence Derivation

> **Phase 17 — Dynamic Programming**
>
> Dynamic Programming becomes predictable when you stop memorizing tables and learn to derive the **state, decisions, transition, base cases, and evaluation order** from the problem itself.

---

## 1. The Core Skill: State Design

The hardest part of a DP problem is usually not writing the loop. It is answering:

> **What information completely describes the remaining problem?**

A DP state is a compact representation of a subproblem.

```text
full history
    ↓
remove irrelevant history
    ↓
retain information that affects the future
    ↓
DP state
```

If two different histories reach the same state and have the same set of legal future decisions, they can share one DP result.

That is the foundation of memoization and state compression.

---

## 2. State = Future Equivalence

Consider a sequence problem where you have processed the first `i` items and have `capacity` remaining.

Two histories may have selected completely different earlier items, but if they produce the same:

```text
(i, capacity)
```

and the future only depends on those two values, their remaining problems are identical.

```text
History A ──┐
            ├── (i, capacity) ── same future
History B ──┘
```

Therefore one cached answer is sufficient.

This gives a rigorous state-design test:

> If two histories map to the same proposed state, can every future transition and future outcome be identical?

If not, the state is missing information.

---

## 3. State Sufficiency vs State Minimality

A state must satisfy two competing requirements.

### Sufficiency

It contains everything required to determine the remaining problem.

### Minimality

It does not contain information that is irrelevant or derivable.

A useful progression is:

```text
Too little information
        ↓
incorrect state
        ↓
add necessary information
        ↓
sufficient state
        ↓
remove redundant information
        ↓
minimal useful state
```

Minimality matters because every extra state dimension can multiply the state-space size.

If a state has dimensions of sizes `n`, `m`, and `k`, a dense table may require:

```text
O(n × m × k)
```

states.

---

## 4. Start From Decisions, Not From `dp[]`

A common mistake is to immediately ask:

```text
dp[i] = ?
```

Instead ask:

1. What decisions can I make?
2. What does each decision change?
3. After making that decision, what information determines the remaining problem?
4. Can different histories produce that same remaining problem?

Only then define `dp[...]`.

### Generic decision model

```text
State S
 ├── Decision A ──> State S1
 ├── Decision B ──> State S2
 └── Decision C ──> State S3
```

The recurrence combines the values of `S1`, `S2`, and `S3` according to the problem objective.

---

## 5. The Decision-to-State Derivation

Use this repeatable method.

### Step 1 — Identify the position in the input

Usually an index, interval, node, or coordinate.

Examples:

```text
i
left, right
row, col
node
```

### Step 2 — Identify remaining resources or constraints

Examples:

```text
remaining capacity
remaining budget
number of transactions
previous value
number of groups used
mask of selected items
```

### Step 3 — Identify history that changes future legality or score

Do not preserve history merely because it happened.

Preserve only what affects future decisions.

### Step 4 — Define the smallest sufficient state

Write it as a sentence before writing code.

```text
dp[i][c] = maximum value obtainable using items from i onward
with remaining capacity c.
```

---

## 6. Common State Dimensions

### 6.1 Index state

```text
dp[i]
```

Use when the future depends only on where you are in the input.

Typical examples:

- climbing stairs
- house robber
- one-dimensional path problems
- prefix decisions

### 6.2 Index + capacity

```text
dp[i][capacity]
```

Use when a remaining resource changes future choices.

Typical examples:

- 0/1 knapsack
- budget-constrained selection
- resource allocation

### 6.3 Two indices

```text
dp[i][j]
```

Useful when two positions interact.

Typical examples:

- LCS
- edit distance
- sequence alignment
- interval boundaries

### 6.4 Interval state

```text
dp[left][right]
```

The problem is defined over a contiguous interval.

Typical examples:

- matrix-chain multiplication
- interval partitioning
- palindrome optimization variants

### 6.5 Index + previous choice

```text
dp[i][previous]
```

Useful when the next legal decision depends on the previous selected value or category.

Typical examples:

- constrained subsequences
- alternating sequences
- finite-state sequence problems

### 6.6 Index + count

```text
dp[i][k]
```

Useful when exactly or at-most `k` decisions/groups/transactions remain.

### 6.7 Position + bitmask

```text
dp[position][mask]
```

Useful when the selected/visited set is small enough to represent compactly.

This connects DP with the bitmask backtracking techniques from Phase 16.

---

## 7. Exact, Prefix, Suffix, and Ending-State Semantics

The same dimensions can represent very different meanings.

For an array `a`:

### Prefix state

```text
dp[i] = answer using the first i elements
```

### Suffix state

```text
dp[i] = answer using elements i ... n-1
```

### Ending state

```text
dp[i] = best answer whose chosen structure ends at i
```

### Exact state

```text
dp[i] = answer for exactly state i
```

### At-most state

```text
dp[i] = best answer using at most i units
```

These are not interchangeable.

Before coding, state the semantics explicitly.

---

## 8. Example: Climbing Stairs

Suppose you may climb one or two steps.

### Decisions

From position `i`, choose:

```text
+1
+2
```

### State

```text
dp[i] = number of ways to reach step i
```

### Transition

Every way to reach `i` must come from either `i - 1` or `i - 2`:

```text
dp[i] = dp[i - 1] + dp[i - 2]
```

### Base cases

```text
dp[0] = 1
dp[1] = 1
```

The `dp[0] = 1` convention means there is one way to construct an empty sequence of moves: choose nothing.

That convention makes the recurrence uniform.

---

## 9. Example: House Robber

Given values arranged along a line, choose houses with no adjacent selections.

### Decision

At house `i`:

```text
skip i
rob i
```

### State

One valid formulation is:

```text
dp[i] = maximum value obtainable from houses i ... n-1
```

Then:

```text
skip → dp[i + 1]
rob  → value[i] + dp[i + 2]
```

Therefore:

```text
dp[i] = max(
  dp[i + 1],
  value[i] + dp[i + 2]
)
```

The recurrence is derived from the decisions; it was not memorized first.

---

## 10. Example: 0/1 Knapsack

Each item can be selected at most once.

### Decisions

At item `i`:

```text
skip item i
choose item i, if capacity allows
```

### State

```text
dp[i][c] = maximum value obtainable from items i onward
with remaining capacity c
```

### Transition

Skip:

```text
dp[i + 1][c]
```

Take:

```text
value[i] + dp[i + 1][c - weight[i]]
```

Therefore:

```text
dp[i][c] = max(
  dp[i + 1][c],
  value[i] + dp[i + 1][c - weight[i]]
)
```

The capacity dimension is necessary because two histories at the same item index can have different remaining capacities and therefore different futures.

---

## 11. Example of an Insufficient State

Suppose the problem is:

> Find the longest increasing subsequence.

A tempting state is:

```text
dp[i] = best answer considering the first i elements
```

But if we need to decide whether the next value can be appended, we may need to know the value of the last selected element.

A state such as:

```text
(i, previousIndex)
```

can capture that dependency.

An alternative formulation stores:

```text
dp[i] = best increasing subsequence ending at i
```

The key lesson is not that one particular formulation is always required. The lesson is:

> **The state must preserve exactly the information future legality depends on.**

---

## 12. State Collision Test

To test a proposed state, deliberately construct two histories.

Suppose your candidate state is:

```text
index = i
```

Ask whether two different histories can reach `i` while leaving different legal futures.

If yes:

```text
history A → i → future A
history B → i → future B
```

then `i` is not sufficient.

Add the missing information.

Repeat until:

```text
history A → state S → same future
history B → state S → same future
```

This is one of the most powerful techniques for deriving unfamiliar DP states during interviews.

---

## 13. Recurrence Derivation

Once the state is correct, derive the recurrence by partitioning all valid solutions by their first or final decision.

For a maximization problem:

```text
answer(state)
= max(answer produced by each valid decision)
```

For minimization:

```text
answer(state)
= min(candidate answers)
```

For counting:

```text
answer(state)
= sum(counts from disjoint choices)
```

For feasibility:

```text
answer(state)
= OR(feasibility of valid choices)
```

The aggregation operator follows the question being asked.

---

## 14. The Partition-of-Solutions Principle

A recurrence is correct when the choices partition the solution space appropriately.

For example:

```text
All valid solutions
├── solutions beginning with A
├── solutions beginning with B
└── solutions beginning with C
```

If these categories are:

1. **complete** — every valid solution appears somewhere
2. **appropriately disjoint** — no solution is incorrectly counted multiple times
3. **correctly transformed** — each branch maps to the right subproblem

then the recurrence can be justified.

This is the bridge between recurrence derivation and correctness proof.

---

## 15. Counting Requires Special Care

For counting DP, distinguish:

- ordered sequences
- unordered combinations
- distinct solutions
- solutions with multiplicity

Example:

```text
steps = [1, 2]
target = 3
```

If order matters:

```text
1 + 1 + 1
1 + 2
2 + 1
```

There are three sequences.

If order does not matter:

```text
1 + 1 + 1
1 + 2
```

There are two combinations.

The state and iteration order must reflect the intended semantics.

---

## 16. Base Cases Should Be Derived, Not Guessed

Ask:

> What is the smallest state for which the answer is directly known?

Examples:

### Empty suffix

For many optimization problems:

```text
dp[n] = 0
```

because there are no remaining items and therefore no additional score/cost.

### Empty construction

For counting constructions:

```text
dp[0] = 1
```

because the empty construction is one valid way to reach zero.

### Impossible state

Use a sentinel consistent with the objective:

```js
Infinity      // impossible minimum
-Infinity     // impossible maximum
false         // impossible feasibility
```

But define sentinel behavior explicitly before transitions.

---

## 17. Direction of the Recurrence

A recurrence can be written forward or backward.

### Forward formulation

```text
dp[i] depends on dp[i - 1], dp[i - 2]
```

Natural bottom-up order:

```text
0 → 1 → 2 → ... → n
```

### Backward formulation

```text
dp[i] depends on dp[i + 1], dp[i + 2]
```

Natural bottom-up order:

```text
n → n-1 → ... → 0
```

Neither direction is inherently superior.

Choose the direction that makes the state and transitions easiest to reason about.

---

## 18. Dependency Graph

Every DP recurrence induces a state dependency graph.

```text
S0 ──> S1 ──> S2 ──> S3
       └────────────> S3
```

For bottom-up evaluation, dependencies must already have correct values when a state is computed.

For acyclic DP:

```text
state definition
      ↓
transition graph
      ↓
valid evaluation order
```

This is why a wrong loop direction can break an otherwise correct recurrence.

---

## 19. Detecting Impossible DP States

Not every syntactically representable state is semantically valid.

Examples:

```text
capacity < 0
index > n
negative group count
invalid interval left > right
mask containing impossible items
```

You must decide whether to:

- avoid generating invalid states
- return a sentinel
- clamp the state
- reject the input

Do not let invalid states silently participate in arithmetic.

---

## 20. State Compression

After deriving the full recurrence, inspect dependencies.

Suppose:

```text
dp[i] depends only on dp[i - 1] and dp[i - 2]
```

The complete table is not required to compute the final value.

You can retain only:

```text
previous2
previous1
current
```

### Critical rule

> **Never perform space optimization before understanding the dependency structure.**

First prove the full DP. Then compress the state storage.

Space compression can also change the ability to reconstruct the actual solution, so distinguish:

```text
compute optimum value
```

from:

```text
reconstruct optimum decisions
```

---

## 21. Value DP vs Reconstruction DP

A DP may return only a score:

```text
maximum value = 42
```

But production systems and interviews often require the actual decisions:

```text
selected items = [2, 5, 7]
```

Reconstruction strategies include:

- store parent/choice information
- retain enough table state to walk backward
- recompute local decisions during traceback
- use Hirschberg-style divide-and-conquer techniques for suitable problems

Always ask whether the output requires the value, the decisions, or both.

---

## 22. Memoization vs Tabulation After State Design

Once the mathematical state is correct, implementation becomes an evaluation choice.

### Top-down

```text
solve(target)
    ↓
follow reachable dependencies
    ↓
cache state results
```

Useful when the reachable state graph is sparse or irregular.

### Bottom-up

```text
base states
    ↓
valid dependency order
    ↓
target
```

Useful when the state space is dense and an explicit order is straightforward.

The recurrence does not change merely because the evaluation strategy changes.

---

## 23. A Complete Derivation Template

For an unfamiliar problem, fill this out before coding:

```text
PROBLEM
-------
What exactly is being asked?

DECISIONS
---------
What choices can be made at the current point?

STATE
-----
dp[...] = ______________________________

STATE SUFFICIENCY
-----------------
What information affects all future decisions?

TRANSITION
----------
For each decision:
  decision → next state → candidate answer

AGGREGATION
-----------
max / min / sum / OR / AND / other

BASE CASES
----------
Which smallest states have direct answers?

INVALID STATES
--------------
Which states cannot exist?

DIRECTION
---------
Forward / backward / interval / DAG order

ANSWER STATE
------------
Which state contains the final answer?

COMPLEXITY
----------
#states × transition cost

RECONSTRUCTION
--------------
Is the actual solution required, or only its value?
```

This template should become automatic interview behavior.

---

## 24. Correctness Proof Framework

A DP proof should answer four questions.

### 24.1 State meaning

Precisely define what `dp[state]` represents.

### 24.2 Base correctness

Show that every base state has the correct answer.

### 24.3 Transition completeness and soundness

For every valid solution:

```text
it appears in at least one valid transition
```

And every transition-generated candidate corresponds to a valid solution.

### 24.4 Inductive dependency

Assume smaller/dependent states are correct. Show that the transition therefore computes the correct answer for the current state.

Then show that the selected target state equals the requested problem answer.

---

## 25. Complexity From the State Definition

Do not say merely:

> "This is DP, so it is O(n²)."

Count it.

If:

```text
states = n × m
transitions per state = k
```

then:

```text
Time = O(n × m × k)
Space = O(n × m)
```

If `k` is bounded by a constant, simplify appropriately.

For memoization, actual runtime may depend on the number of reachable states rather than the entire theoretical dense state space.

---

## 26. Common State-Design Mistakes

### Mistake 1 — State stores too little

Different histories collide despite having different futures.

### Mistake 2 — State stores the entire history

This often destroys the benefit of DP because almost every history becomes unique.

### Mistake 3 — State includes derivable data

Redundant dimensions inflate complexity.

### Mistake 4 — Confusing prefix with ending state

`best among first i` is not the same as `best ending at i`.

### Mistake 5 — Mixing exact and at-most semantics

This commonly causes off-by-one and incorrect feasibility results.

### Mistake 6 — Counting overlapping categories

A counting recurrence can double-count if its branches are not partitioned correctly.

### Mistake 7 — Optimizing storage too early

A compressed recurrence that has not been proven can hide dependency bugs.

### Mistake 8 — Ignoring reconstruction

A one-number DP may be insufficient if the actual selected decisions are required.

---

## 27. DP and Backend Engineering

State design appears directly in backend systems.

### Resource allocation

```text
state = (jobIndex, remainingCapacity)
```

### Request scheduling

```text
state = (timeSlot, remainingResources, completedCount)
```

### Configuration optimization

```text
state = (componentIndex, budget, compatibilityState)
```

### Rate/budget planning

```text
state = (requestIndex, remainingQuota, currentPolicyState)
```

The engineering question is the same:

> What information about the past is necessary to determine all valid future actions?

This is a state-modeling problem before it is an algorithm problem.

---

## 28. DP and AI Engineering

DP is useful when a planning/search problem has:

- discrete states
- repeated future-equivalent states
- deterministic or explicitly modeled transitions
- a measurable objective
- a manageable state space

A practical architecture can be:

```text
candidate actions
      ↓
state transition
      ↓
constraint validation
      ↓
DP value computation
      ↓
optimal structured plan
      ↓
external validation
```

For AI systems, keep model-generated suggestions separate from the deterministic DP evaluator. The model may propose candidates; the DP layer can provide reproducible optimization under explicit constraints.

---

## 29. Testing Strategy

### Brute-force oracle

For small inputs, enumerate all legal decisions and compare against the DP.

### Differential testing

Compare:

```text
memoized DP
vs
bottom-up DP
vs
space-optimized DP
vs
brute force
```

### State-collision tests

Construct different histories that should converge to the same state and verify identical remaining answers.

### Boundary tests

Include:

- empty input
- one element
- zero capacity
- impossible target
- all-negative values
- duplicate values
- maximum/minimum legal values
- very sparse reachable state spaces

### Metamorphic properties

Use transformations whose effect can be predicted mathematically.

Examples:

- adding an unreachable option should not change an optimum
- duplicating a decision should change a count only when multiplicity is part of the semantics
- increasing a resource budget cannot reduce a maximization optimum when the feasible set is nested

The property must be proved for the specific problem before using it as a test.

---

## 30. Interview Derivation Drill

When given a new DP problem, say your reasoning out loud:

1. **What are the decisions?**
2. **What information from the past changes future decisions?**
3. **Can I construct two histories that collide under my proposed state?**
4. **If they collide, are their futures identical?**
5. **What exactly does `dp[...]` mean?**
6. **What are the valid next states?**
7. **Do those choices partition the solution space correctly?**
8. **What are the base states?**
9. **Which direction evaluates dependencies correctly?**
10. **How many states exist?**
11. **How much work occurs per state?**
12. **Can storage be compressed?**
13. **Do I need reconstruction?**
14. **How will I prove the recurrence?**

This is the skill interviewers are testing when they give unfamiliar DP questions.

---

## 31. Master Mental Model

```text
Problem
  ↓
Identify decisions
  ↓
Ask what affects the future
  ↓
Construct the smallest sufficient state
  ↓
Define exact state semantics
  ↓
Partition valid solutions by decisions
  ↓
Derive transitions
  ↓
Derive base cases
  ↓
Determine dependency direction/order
  ↓
Prove recurrence
  ↓
Implement memoization or tabulation
  ↓
Count states × transition cost
  ↓
Compress storage if safe
  ↓
Add reconstruction if required
  ↓
Differential-test against a brute-force oracle
```

If you can perform this process on an unfamiliar problem, you understand DP at a much deeper level than simply recognizing LeetCode patterns.

---

## 32. Revision Checklist

Before leaving this lesson, you should be able to explain:

- [ ] What makes a state sufficient?
- [ ] What makes a state minimal?
- [ ] How do decisions determine state dimensions?
- [ ] How do you detect a missing dimension?
- [ ] What is future equivalence?
- [ ] Why are prefix, suffix, ending, exact, and at-most states different?
- [ ] How do you derive a recurrence from solution partitions?
- [ ] Why do counting transitions need disjoint semantics?
- [ ] How are base cases derived?
- [ ] How do you determine evaluation direction?
- [ ] How do you derive complexity from the state space?
- [ ] When is state compression safe?
- [ ] How does reconstruction affect DP design?
- [ ] How do you prove a recurrence?
- [ ] How would you test a DP against brute force?

---

## 33. Final Rule

> **Never start a DP problem by asking what table to build. Start by asking what information makes two histories equivalent from this point forward.**

Once the state is correct, the recurrence, evaluation order, complexity, and implementation become much easier to derive.