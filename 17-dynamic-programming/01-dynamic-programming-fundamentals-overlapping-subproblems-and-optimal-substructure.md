# 01 — Dynamic Programming Fundamentals: Overlapping Subproblems & Optimal Substructure

> **Phase 17 — Dynamic Programming**
>
> Dynamic Programming (DP) is a method for solving problems by identifying reusable subproblems, defining a state that represents those subproblems, deriving transitions between states, and storing results so equivalent work is not repeated.

---

## 1. What Dynamic Programming Actually Is

DP is not a specific data structure and it is not synonymous with recursion + memoization.

At its core, DP answers four questions:

1. **What smaller problem does the current problem depend on?**
2. **How can that smaller problem be represented as a state?**
3. **How are states transformed into other states?**
4. **How can each state be solved once instead of repeatedly?**

A useful mental model is:

```text
Original problem
      ↓
Decompose into subproblems
      ↓
Identify repeated subproblems
      ↓
Define state
      ↓
Define transition
      ↓
Define base cases
      ↓
Evaluate states once
      ↓
Construct final answer
```

The most important skill in DP is therefore **state design**, not memorizing famous formulas.

---

## 2. Why DP Exists

Consider Fibonacci:

```text
F(n) = F(n - 1) + F(n - 2)
```

A naive recursive implementation repeatedly evaluates the same values:

```text
                    F(5)
                  /      \
               F(4)      F(3)
              /   \      /   \
           F(3)   F(2) F(2)  F(1)
           / \
        F(2) F(1)
```

`F(3)` and `F(2)` appear multiple times.

The recursion tree grows exponentially, but the number of **distinct subproblems** is only linear:

```text
F(0), F(1), F(2), ..., F(n)
```

DP stores each distinct result once.

---

## 3. Overlapping Subproblems

A problem has **overlapping subproblems** when solving the original problem causes the same smaller problem to be encountered multiple times.

Formally, if different computational paths reach the same state:

```text
Problem A
 ├── Subproblem X
 └── Subproblem Y
      └── Subproblem X
```

then `X` is reusable work.

### Important distinction

Not every recursive problem with smaller subproblems is automatically a good DP problem.

DP becomes useful when:

```text
many recursive paths
        ↓
reach the same state
        ↓
state has a reusable answer
```

If every subproblem is unique, memoization may add storage without eliminating meaningful work.

---

## 4. Optimal Substructure

A problem has **optimal substructure** when an optimal solution can be constructed from optimal solutions to appropriate subproblems.

For a minimization problem:

```text
Optimal(problem)
    = best combination of
      Optimal(smaller problem(s))
```

For a maximization problem:

```text
Optimal(problem)
    = best combination of
      Optimal(smaller problem(s))
```

The exact transition depends on the problem.

### Example: minimum cost to reach a position

If reaching position `i` can come from `i - 1` or `i - 2`, then:

```text
dp[i] = cost[i] + min(dp[i - 1], dp[i - 2])
```

The optimal answer for `i` depends on optimal answers for smaller states.

---

## 5. Overlapping Subproblems vs Optimal Substructure

These properties solve different parts of the problem.

| Property | Question |
|---|---|
| Overlapping subproblems | Are we solving the same subproblem repeatedly? |
| Optimal substructure | Can the answer be composed from optimal smaller answers? |

A typical DP problem has both.

Think of them as:

```text
Optimal substructure
        ↓
defines how answers can be composed

Overlapping subproblems
        ↓
justifies caching those answers
```

---

## 6. The DP State

The **state** is the smallest sufficient description of a subproblem whose answer can be reused.

For Fibonacci:

```text
dp[i] = F(i)
```

The state is simply:

```text
i
```

For a two-dimensional grid problem:

```text
dp[row][col]
```

The state is:

```text
(row, col)
```

For a sequence problem involving an index and remaining capacity:

```text
dp[i][capacity]
```

The state is:

```text
(i, capacity)
```

### State-design rule

A good state should contain:

- everything needed to determine future decisions
- nothing that can be derived from the existing state
- no irrelevant history

A useful test is:

> **If two execution paths arrive at the same state, must their remaining problem be identical?**

If yes, the state is probably sufficient.

---

## 7. State as a Future-Equivalence Class

A deeper way to understand DP is to view a state as a **future-equivalence class**.

Suppose two different histories produce:

```text
State S
```

If everything that matters from that point onward is identical, the histories can share one answer.

```text
History A ──┐
            ├── State S ── same future ──> one cached answer
History B ──┘
```

This explains why choosing the correct state is more important than choosing recursion or iteration first.

---

## 8. The Transition

A transition describes how a state depends on other states.

Generic form:

```text
dp[state] = aggregate(
    transition(dp[previous states])
)
```

Examples:

### Counting

```text
dp[i] = dp[i - 1] + dp[i - 2]
```

### Minimum

```text
dp[i] = min(candidate_1, candidate_2)
```

### Maximum

```text
dp[i] = max(candidate_1, candidate_2)
```

### Boolean feasibility

```text
dp[i] = dp[a] || dp[b]
```

The aggregation operator depends on what the DP is computing.

---

## 9. Base Cases

Base cases define states whose answers are known directly.

For Fibonacci:

```text
dp[0] = 0
dp[1] = 1
```

For a path-counting problem, the starting cell might have:

```text
dp[start] = 1
```

For a minimum problem, unreachable states often require a carefully chosen sentinel such as `Infinity`.

### Sentinel warning

Never treat a sentinel as an ordinary value.

For example:

```js
const INF = Number.POSITIVE_INFINITY;
```

Then ensure transitions do not accidentally perform invalid arithmetic such as:

```text
INF + negative value
```

without considering the intended semantics.

---

## 10. Top-Down DP — Memoization

Top-down DP starts with a recursive formulation and caches solved states.

```js
function solve(state) {
  if (baseCase(state)) return baseValue(state);

  if (memo.has(state)) {
    return memo.get(state);
  }

  const answer = transition(state, solve);
  memo.set(state, answer);
  return answer;
}
```

Conceptually:

```text
Demand-driven evaluation
        ↓
solve only states reachable from the target
        ↓
cache every solved state
```

### Advantages

- mirrors recursive mathematical definitions
- often easy to derive
- naturally skips unreachable states
- useful when the state space is sparse

### Risks in JavaScript

- recursion depth can become a practical limitation
- object/string serialization may make state keys expensive
- careless mutable state can corrupt memoized results

---

## 11. Bottom-Up DP — Tabulation

Bottom-up DP explicitly computes states in dependency order.

```js
function solve(n) {
  const dp = Array(n + 1).fill(0);

  dp[0] = 0;
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}
```

Conceptually:

```text
smallest states
      ↓
next states
      ↓
...
      ↓
target state
```

### Advantages

- avoids recursive call-stack growth
- dependency order is explicit
- often easier to optimize space
- predictable iteration overhead

### Risks

- may compute states that are never needed
- dependency order must be correct
- initialization mistakes can silently corrupt results

---

## 12. Memoization vs Tabulation

They are two evaluation strategies over the same state graph.

| Aspect | Memoization | Tabulation |
|---|---|---|
| Direction | Top-down | Bottom-up |
| Starts from | Target | Base states |
| Computes unreachable states | Usually no | Often yes |
| Recursion | Usually yes | No |
| Stack risk | Yes | No |
| Derivation style | Recursive | Iterative |
| Sparse state spaces | Often useful | May waste work |
| Space optimization | Sometimes harder | Often straightforward |

Do not ask:

> "Which DP style is always better?"

Ask:

> "What is the state graph, and which evaluation strategy fits it?"

---

## 13. DP as a DAG of States

A powerful mental model is to treat DP states as vertices in a directed acyclic graph.

```text
State A ──> State C ──> State F
   │           ↑
   └──> State B ───────┘
```

Each edge represents a dependency.

If dependencies always move toward smaller/earlier states, the graph is acyclic and can be evaluated in a valid order.

This explains:

- memoization = DFS over the state DAG + caching
- tabulation = evaluate the DAG in dependency/topological order

This viewpoint becomes especially important for DAG DP, interval DP, tree DP, and more advanced formulations.

---

## 14. The Four-Part DP Derivation

For almost every DP problem, force yourself through this sequence:

### Step 1 — Define the state

```text
What does dp[...] mean exactly?
```

### Step 2 — Define the transition

```text
How can this state be reached or constructed?
```

### Step 3 — Define the base cases

```text
Which states have direct answers?
```

### Step 4 — Define evaluation order

```text
Which states must be solved before this state?
```

Only after these four are correct should implementation begin.

---

## 15. A Reliable DP Specification

Write a sentence before writing code.

Bad:

```text
dp[i] stores something about the array.
```

Good:

```text
dp[i] = the minimum cost required to reach index i.
```

Even better:

```text
dp[i] = the minimum total cost of reaching index i from index 0,
where the final move enters i.
```

The specification should make the transition almost inevitable.

---

## 16. Complexity of DP

If there are:

```text
S = number of distinct states
T = transition cost per state
```

then a common DP complexity is:

```text
Time  = O(S × T)
Space = O(S)
```

But this is not universal.

Examples:

```text
1D state with O(1) transition:
O(n) time, O(n) space

2D state with O(1) transition:
O(nm) time, O(nm) space

State + capacity:
O(nC) time, O(nC) space
```

Always count the actual number of states and the work performed per state.

---

## 17. DP vs Brute Force

The progression should be explicit:

```text
Brute force
    ↓
Recursive decomposition
    ↓
Observe repeated states
    ↓
Memoize
    ↓
Identify dependency order
    ↓
Tabulate
    ↓
Compress state/storage if possible
```

DP is therefore an optimization of a correct recursive/state-space formulation—not a collection of magical formulas.

---

## 18. DP vs Divide and Conquer

Both decompose problems, but their subproblem structures differ.

### Divide and conquer

```text
Problem
├── independent subproblem A
└── independent subproblem B
```

The subproblems generally do not overlap.

### Dynamic programming

```text
Problem
├── subproblem A ──┐
└── subproblem B ──┴──> shared subproblem C
```

The overlapping state can be solved once and reused.

This distinction is more useful than memorizing labels.

---

## 19. DP vs Greedy

Greedy algorithms make locally justified choices and commit to them.

DP preserves multiple possibilities through state transitions and compares their resulting outcomes.

A problem may look greedy but actually require DP when an early decision changes future possibilities in a way that cannot be summarized by a single locally optimal choice.

The key question is:

> **Can a locally optimal decision be proven safe, or must alternative futures be retained?**

---

## 20. Correctness Invariants

For every DP, maintain a precise invariant.

Example:

```text
dp[i] is exactly the optimal answer for state i.
```

For bottom-up computation, prove:

1. base states are correct
2. when computing state `i`, all required predecessor states are correct
3. the transition considers every valid predecessor/choice
4. the aggregation selects the correct answer
5. therefore `dp[i]` is correct
6. the target state gives the required result

This is the DP equivalent of proving a loop invariant.

---

## 21. Common DP Failure Modes

### 21.1 Starting with a table instead of a state

A table is an implementation detail. State semantics come first.

### 21.2 Missing a dimension

If the future depends on both index and capacity, `dp[index]` may lose necessary information.

### 21.3 Adding unnecessary dimensions

Extra state dimensions increase complexity and may hide a simpler formulation.

### 21.4 Wrong base cases

One incorrect base case can contaminate the entire table.

### 21.5 Wrong iteration order

A state must be evaluated only after all dependencies it uses are valid.

### 21.6 Mixing states with answers

Be explicit about whether `dp[i]` means:

- exact state `i`
- at-most `i`
- prefix through `i`
- suffix starting at `i`
- ending at `i`

These distinctions change transitions.

### 21.7 Treating every recursion as DP

If states do not overlap, memoization may not provide meaningful benefit.

### 21.8 Optimizing space before proving the recurrence

First establish correctness with a clear full-state implementation. Compress only after dependencies are understood.

---

## 22. JavaScript Engineering Considerations

### Arrays

Use arrays for dense numeric states:

```js
const dp = new Array(n + 1).fill(0);
```

### Maps

Use `Map` for sparse or structured states:

```js
const memo = new Map();
```

### BigInt

Use `BigInt` when exact integer results can exceed JavaScript's safe integer range.

Do not mix `number` and `bigint` arithmetic accidentally.

### Typed arrays

For dense numeric DP with known bounds, typed arrays can reduce memory overhead and improve locality.

### State keys

Avoid expensive string serialization when a compact numeric encoding or nested `Map` structure is practical.

---

## 23. Testing Dynamic Programs

DP deserves more than a few sample cases.

### Reference oracle

For small inputs, implement a brute-force recursive solver without memoization.

Then compare:

```text
optimized DP == brute-force oracle
```

### Differential testing

Compare multiple independent implementations:

```text
memoized DP
      vs
bottom-up DP
      vs
brute-force oracle
```

### Edge cases

Test:

- empty input
- smallest valid input
- single element
- impossible cases
- all equal values
- strictly increasing/decreasing values
- duplicate-heavy input
- very large values
- maximum state dimensions

### Metamorphic properties

Where mathematically valid, test transformations that should preserve or predictably change the answer.

Examples depend on the problem, but may include:

- adding irrelevant unreachable states
- equivalent reorderings
- duplicated neutral choices
- monotonicity under increased capacity

Never assume a metamorphic property without proving it for the specific problem.

---

## 24. Backend Engineering Applications

DP is useful outside interview problems.

Examples include:

- pricing plans with constrained options
- resource allocation
- scheduling under bounded capacity
- request routing with cumulative cost
- configuration optimization
- workload planning
- sequence reconciliation
- staged deployment planning

The production pattern is the same:

```text
state
  ↓
valid transitions
  ↓
cost / score / feasibility
  ↓
best or valid aggregate
```

The engineering challenge becomes controlling state explosion, memory usage, latency, and input constraints.

---

## 25. AI Engineering Applications

DP appears in algorithmic components behind AI systems, including:

- sequence alignment
- edit distance
- decoding formulations
- constrained sequence optimization
- dynamic programming over structured outputs
- segmentation
- scheduling inference
- shortest-path style structured decisions

A useful AI engineering workflow is:

```text
Model proposes scores / costs
        ↓
DP defines valid structured decisions
        ↓
DP searches the constrained state space
        ↓
Best valid structure is returned
```

This separates probabilistic scoring from exact combinatorial reasoning.

---

## 26. Interview Framework

When given an unfamiliar DP problem, say:

### 1. Clarify the objective

```text
Are we counting, minimizing, maximizing, or checking feasibility?
```

### 2. Identify decisions

```text
What choices can be made at each step?
```

### 3. Find repeated subproblems

```text
Which different decision paths can produce the same future problem?
```

### 4. Define the state

```text
dp[...] = exactly what?
```

### 5. Derive transitions

```text
What choices lead into this state?
```

### 6. Define base cases

### 7. Choose evaluation strategy

```text
top-down or bottom-up?
```

### 8. Analyze complexity

```text
number of states × transition cost
```

### 9. Optimize only afterward

Consider:

- rolling arrays
- sparse maps
- state compression
- symmetry
- pruning

---

## 27. Master Mental Model

```text
                 Dynamic Programming
                         │
             ┌───────────┴───────────┐
             │                       │
      Optimal Structure       Overlapping States
             │                       │
             └───────────┬───────────┘
                         ↓
                    Define State
                         ↓
                  Define Transition
                         ↓
                   Define Base Cases
                         ↓
              Determine Dependency Order
                         ↓
              ┌──────────┴──────────┐
              │                     │
         Memoization            Tabulation
              │                     │
              └──────────┬──────────┘
                         ↓
                  Correctness Proof
                         ↓
                  Complexity Analysis
                         ↓
                Space Optimization
```

---

## 28. Revision Checklist

You should be able to explain without notes:

- [ ] What dynamic programming actually is
- [ ] Overlapping subproblems
- [ ] Optimal substructure
- [ ] Why the two properties are different
- [ ] How to define a DP state
- [ ] Future-equivalence of states
- [ ] How to derive a transition
- [ ] How to define base cases
- [ ] Memoization
- [ ] Tabulation
- [ ] Memoization vs tabulation
- [ ] DP as a state DAG
- [ ] Dependency order
- [ ] DP complexity from state count
- [ ] DP vs divide and conquer
- [ ] DP vs greedy
- [ ] Correctness invariants
- [ ] Common state-design mistakes
- [ ] JavaScript implementation considerations
- [ ] Differential testing against brute force
- [ ] When DP applies to backend and AI engineering

---

## 29. Mastery Standard

You have mastered this lesson when you can take a problem you have never seen before and independently produce:

```text
Problem
  ↓
Decisions
  ↓
Repeated subproblem
  ↓
State definition
  ↓
Transition
  ↓
Base cases
  ↓
Memoized solution
  ↓
Tabulated solution
  ↓
Complexity
  ↓
Correctness argument
```

The objective is not to recognize the phrase **"this is DP."**

The objective is to be able to **derive the DP formulation from first principles.**
