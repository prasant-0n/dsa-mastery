# 16.17 — Branch and Bound for Optimization Search

## 1. From Enumeration to Optimization

Basic backtracking asks:

> Which assignments are valid?

Optimization backtracking asks:

> Among all valid assignments, which one has the best objective value?

Examples include:

- minimum-cost assignment,
- maximum-score selection,
- shortest Hamiltonian tour,
- minimum-resource configuration,
- maximum-value scheduling.

The search tree is still explored recursively, but each node now carries an objective-related bound.

---

## 2. Branch and Bound Mental Model

The pattern is:

```text
BRANCH
  ↓
MAKE A DECISION
  ↓
COMPUTE A BOUND
  ↓
CAN THIS BRANCH BEAT THE BEST KNOWN SOLUTION?
  ├── NO  → PRUNE
  └── YES → RECURSE
```

Backtracking provides the branching mechanism.

Branch and bound adds an **optimization bound** that can safely eliminate branches that cannot improve the incumbent solution.

---

## 3. Incumbent Solution

The **incumbent** is the best complete solution discovered so far.

For minimization:

```text
bestCost = +Infinity
```

For maximization:

```text
bestScore = -Infinity
```

Whenever a complete valid solution is found:

```text
if candidate is better than incumbent:
    incumbent = candidate
```

The incumbent becomes stronger as search progresses.

A strong incumbent generally creates more pruning opportunities.

---

## 4. Lower and Upper Bounds

The bound must describe the best possible outcome remaining in a partial branch.

### Minimization

A **lower bound** estimates the smallest total cost this branch could possibly achieve.

If:

```text
lowerBound >= bestCost
```

then the branch cannot improve the incumbent and can be pruned.

### Maximization

An **upper bound** estimates the largest total score this branch could possibly achieve.

If:

```text
upperBound <= bestScore
```

then the branch cannot improve the incumbent.

The bound must be optimistic in the correct direction.

---

## 5. Bound Safety

This is the most important correctness requirement.

For minimization:

```text
lowerBound <= true best achievable completion cost
```

For maximization:

```text
upperBound >= true best achievable completion score
```

The bound must never underestimate the achievable maximum in a maximization problem or overestimate the achievable minimum in a minimization problem.

An unsafe bound can prune the optimal solution and silently make the algorithm incorrect.

---

## 6. Example — 0/1 Knapsack

Suppose each item has:

```text
weight
value
```

and the capacity is limited.

At each item we branch:

```text
include item
exclude item
```

A partial solution has current value and remaining capacity.

For maximization, calculate an optimistic upper bound by assuming that remaining capacity can be filled with the best available value density, even allowing fractional use for the bound.

If:

```text
upperBound <= currentBestValue
```

prune.

The fractional relaxation does not need to be a valid 0/1 solution. It only needs to be an optimistic upper bound.

---

## 7. Example — Traveling Salesperson Search

For a partial tour:

```text
current path
visited cities
current cost
```

we can derive a lower bound on the eventual tour cost.

A simple bound might combine:

- cost already incurred,
- minimum outgoing-edge estimates for unvisited cities,
- required return-to-start cost.

If this lower bound is already no better than the incumbent tour, stop exploring that branch.

The quality of the bound strongly affects practical performance.

---

## 8. Branch Ordering Matters

Pruning depends on the incumbent.

Therefore finding a strong complete solution early can be extremely valuable.

A common strategy is:

```text
heuristic solution first
       ↓
strong incumbent
       ↓
more pruning
       ↓
less search
```

Branch ordering itself does not change correctness, assuming pruning remains sound.

It changes how quickly useful incumbents are discovered.

---

## 9. Greedy Solution as an Initial Incumbent

For many optimization problems, construct a feasible solution quickly using a heuristic.

Example:

```text
construct feasible solution
        ↓
set bestCost / bestScore
        ↓
run exact branch-and-bound search
```

The heuristic does **not** need to be optimal.

Its role is to provide a valid baseline that makes the first pruning threshold finite and useful.

---

## 10. Bound vs Exact Evaluation

A bound should be cheaper than fully solving the branch.

If computing the bound costs as much as exploring the entire subtree, the optimization may provide little benefit.

Therefore evaluate:

```text
bound computation cost
vs.
search nodes eliminated
```

A stronger but expensive bound is not automatically better.

---

## 11. Generic Minimization Skeleton

```text
search(state):
    if invalid(state):
        return

    lowerBound = computeLowerBound(state)

    if lowerBound >= bestCost:
        return

    if complete(state):
        bestCost = objective(state)
        bestSolution = copy(state)
        return

    for choice in orderedChoices(state):
        apply(choice)
        search(state)
        undo(choice)
```

For maximization, replace the lower-bound comparison with an upper-bound comparison.

---

## 12. Branch-and-Bound vs Ordinary Backtracking

Ordinary backtracking:

```text
prune because constraints make the branch invalid
```

Branch and bound:

```text
prune because the branch cannot produce a better objective
```

A solver can use both:

```text
constraint pruning
        +
objective bound pruning
```

This combination is often substantially stronger than either alone.

---

## 13. Hard Constraints vs Objective Bounds

Keep the concepts separate.

### Hard Constraint

```text
This branch cannot produce a valid solution.
```

### Objective Bound

```text
This branch might produce valid solutions,
but none can improve our incumbent.
```

A bound does not prove that the branch is invalid. It proves that the branch is irrelevant to the requested optimization objective.

---

## 14. Feasibility Bounds

Optimization bounds can also incorporate remaining capacity constraints.

Example:

```text
requiredWeight > remainingCapacity
```

means the branch is infeasible.

Similarly:

```text
maximumPossibleScore < requiredThreshold
```

can prove that a target is unreachable.

These are logically distinct from objective pruning but can be implemented in the same bound calculation.

---

## 15. Dominance Pruning

Sometimes two partial states have the same structural position, but one is strictly better.

Example:

```text
State A:
remaining capacity = 10
current value = 40

State B:
remaining capacity = 10
current value = 35
```

If all future choices are identical from both states, `B` is dominated by `A` and can be discarded.

Dominance is a form of state-space reduction.

It requires a proof that the dominated state can never lead to a better final result.

---

## 16. Memoization + Branch and Bound

The two techniques can coexist.

Memoization recognizes repeated states:

```text
same future state
→ reuse result
```

Branch and bound eliminates states whose objective potential is insufficient:

```text
cannot beat incumbent
→ prune
```

However, global incumbent-dependent pruning can complicate caching because the result of a state may depend on the current threshold.

Be explicit about what the memoized value represents.

---

## 17. Numerical Precision

Optimization bounds often involve arithmetic.

Be careful with floating-point comparisons:

```text
upperBound <= bestScore
```

can be unstable when values are computed approximately.

Prefer:

- integer arithmetic where possible,
- exact rational representations when necessary,
- carefully defined tolerances for floating-point objectives.

Never let numerical noise turn a safe bound into an unsafe pruning decision.

---

## 18. Complexity

Branch and bound does not generally eliminate exponential worst-case complexity.

For many combinatorial optimization problems:

```text
worst case ≈ exponential
```

The practical advantage comes from reducing the number of nodes explored.

Benchmark:

```text
nodes without bounds
nodes with bounds
pruning ratio
bound computation time
best solution discovery depth
final runtime
```

Node reduction alone is insufficient evidence of improvement.

---

## 19. Correctness Invariants

Maintain these invariants:

1. The current path represents a legal partial solution.
2. The incumbent is always a valid complete solution, unless no feasible solution has been found yet.
3. Every minimization lower bound is optimistic.
4. Every maximization upper bound is optimistic.
5. A branch is pruned only when its bound proves it cannot improve the incumbent.
6. Every branch mutation is restored before its sibling is explored.
7. Every potentially optimal branch remains reachable unless safely eliminated by a proof-valid bound.

These invariants form the correctness argument.

---

## 20. Testing Strategy

### Brute-Force Differential Testing

For small instances:

```text
branch-and-bound result
        vs
complete enumeration result
```

Compare both objective value and validity.

### Bound Soundness Testing

For randomly generated small states, calculate the bound and enumerate every completion.

For minimization verify:

```text
lowerBound <= optimal completion cost
```

For maximization verify:

```text
upperBound >= optimal completion score
```

### Restoration Testing

Snapshot state before a branch and verify exact restoration afterward.

### Adversarial Testing

Use instances where:

- the optimum is found late,
- the optimum is found early,
- the bound is weak,
- the bound is strong,
- many states are symmetric,
- many partial states are dominated.

---

## 21. Backend Engineering Applications

Branch and bound is useful when a backend must find the best configuration under interacting constraints.

Examples:

- cheapest infrastructure configuration,
- highest-value resource allocation,
- scheduling optimization,
- route optimization,
- dependency-aware deployment planning,
- test-suite minimization,
- capacity planning.

A service can separate:

```text
constraint model
objective function
bound function
search engine
result validator
```

This makes the optimization engine reusable.

---

## 22. AI Engineering Applications

AI systems can propose promising branches, but exact optimization should retain deterministic correctness.

Architecture:

```text
AI heuristic proposal
        ↓
construct feasible incumbent
        ↓
exact branch-and-bound
        ↓
constraint validation
        ↓
optimal / provably optimal result
```

The AI can help with:

- branch ordering,
- initial feasible solutions,
- heuristic scoring,
- candidate generation.

The AI should not be allowed to redefine hard constraints or invalidate the mathematical bound without verification.

---

## 23. Interview Framework

Explain branch and bound in this order:

1. Define the optimization objective.
2. Define the search decisions.
3. Maintain the best complete solution found so far.
4. Compute an optimistic bound for every partial state.
5. Compare that bound with the incumbent.
6. Prune only when improvement is mathematically impossible.
7. Order branches to find strong incumbents early.
8. Explain bound correctness.
9. Discuss constraint pruning separately.
10. State that worst-case complexity can remain exponential.
11. Measure node reduction and actual runtime.

The most important interview question is often:

> Why is your bound safe?

If you cannot prove that, the pruning rule is not trustworthy.

---

## 24. Revision Checklist

You should be able to answer:

- What distinguishes branch and bound from ordinary backtracking?
- What is an incumbent?
- What is a lower bound in minimization?
- What is an upper bound in maximization?
- Why must bounds be optimistic?
- Why can a greedy solution improve exact search without being optimal?
- Why does branch ordering affect runtime?
- How do hard constraints differ from objective bounds?
- What is dominance pruning?
- How can memoization interact with branch and bound?
- Why can a stronger bound still be slower overall?
- How do you test bound soundness?
- Why does branch and bound not necessarily change worst-case complexity?

---

## 25. Master Pattern

```text
PARTIAL SOLUTION
      ↓
CHECK HARD CONSTRAINTS
      ↓
INFEASIBLE? → PRUNE
      ↓
COMPUTE OPTIMISTIC BOUND
      ↓
CANNOT BEAT INCUMBENT? → PRUNE
      ↓
COMPLETE?
 ├── YES → UPDATE INCUMBENT
 └── NO  → ORDER BRANCHES
             ↓
           CHOOSE
             ↓
           RECURSE
             ↓
           UNDO
```

The evolution is:

```text
Backtracking
    ↓
Constraint pruning
    ↓
Objective bounds
    ↓
Strong incumbent
    ↓
Branch ordering
    ↓
Dominance / memoization
    ↓
Exact combinatorial optimization
```

The key engineering principle is simple:

> **Search exactly, but never explore a branch whose best possible future has already been proven insufficient.**
