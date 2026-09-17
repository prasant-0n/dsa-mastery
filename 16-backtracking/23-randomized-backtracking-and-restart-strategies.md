# 16.23 — Randomized Backtracking and Restart Strategies

## 1. Why Randomness Can Help Exact Search

Backtracking is exact, but the order in which branches are explored can make runtime vary dramatically.

Two runs of the same solver can encounter very different search paths if choices are randomized.

The key distinction is:

```text
randomize SEARCH ORDER
≠
randomize CORRECTNESS
```

A randomized exact solver can still guarantee correctness if every branch that matters remains reachable and pruning rules remain sound.

Randomization is especially useful when deterministic heuristics repeatedly lead the solver into difficult regions of the search tree.

---

## 2. Randomized Branch Ordering

Suppose a variable has candidate values:

```text
A B C D E
```

A randomized solver may explore:

```text
C E A D B
```

instead of always using:

```text
A B C D E
```

The search space does not change.

Only the traversal order changes.

This can be useful when:

- many branches are structurally similar,
- there is no clearly superior deterministic ordering,
- a good solution is needed quickly,
- the solver will be restarted repeatedly.

---

## 3. Seeded Randomness

Production and testing should not rely on uncontrolled randomness.

Use an explicit seed:

```text
seed → pseudo-random generator → branch order
```

Then the run becomes reproducible.

This gives both properties:

```text
exploration diversity
+
reproducible debugging
```

Record the seed with performance metrics and failures.

A production solver should make it possible to replay a problematic search.

---

## 4. Randomization vs Heuristic Ordering

Deterministic heuristic:

```text
score every choice
→ sort by score
→ search
```

Randomized ordering:

```text
shuffle choices
→ search
```

Hybrid ordering can be stronger:

```text
heuristic score
      ↓
small candidate pool
      ↓
randomized selection within similar scores
```

This preserves strong structural guidance while avoiding identical search trajectories.

---

## 5. Randomized Value Selection in CSPs

Constraint solvers can randomize value selection after choosing a variable.

For example:

```text
Variable: X
Domain: {1,2,3,4}

LCV ranking:
2, 4, 1, 3
```

Instead of always choosing `2` first, a randomized tie-breaking policy can select among values with similar scores.

This is particularly useful when heuristic scores do not reliably distinguish branches.

Randomization should not bypass constraint validation.

Every selected value still goes through the same propagation and correctness checks.

---

## 6. Randomized Variable Ordering

Randomness can also be introduced into variable selection.

A safe pattern is:

```text
MRV identifies minimum-domain candidates
        ↓
random tie-break among candidates
```

This is preferable to randomly ignoring MRV altogether when MRV is known to be useful.

The general pattern is:

```text
preserve a correctness-neutral heuristic invariant
+
randomize choices where the heuristic is indifferent
```

---

## 7. Restart Strategy

A restart abandons the current search trajectory and starts again from the original problem state with a different search order.

Conceptually:

```text
Run 1
  ↓ failure / timeout
restart
  ↓
Run 2 with different decisions
  ↓
restart
  ↓
Run 3
```

This may seem wasteful, but it can be highly effective when difficult search trees contain long unproductive regions.

The important question is:

> Is it cheaper to continue exploring the current bad trajectory or start a fresh trajectory that may reach useful regions sooner?

---

## 8. Why Restarts Can Work

Imagine the search has many branches:

```text
Easy region
Hard region
Hard region
Easy region
```

A deterministic heuristic may repeatedly enter one hard region first.

Randomized restarts can expose another ordering:

```text
Run 1 → hard region
Run 2 → easy region → solution
```

For decision problems, restarts are especially useful when finding **any** solution is sufficient.

For optimization problems, restart design must preserve the global optimization guarantee.

---

## 9. Restart Is Not the Same as Pruning

Pruning says:

```text
this branch cannot contribute to the required result
```

Restart says:

```text
stop exploring this current trajectory and begin another trajectory
```

A restart does not establish that the abandoned branch is impossible.

This distinction is fundamental.

If exact completeness is required, an interrupted restart-based strategy needs a policy that eventually covers all necessary search or a separate complete fallback.

---

## 10. Cutoff-Based Restarts

A restart needs a cutoff policy.

Examples:

```text
restart after N nodes
restart after T milliseconds
restart after D decisions
restart after K conflicts
```

A fixed cutoff is simple:

```text
cutoff = 10,000 nodes
```

but may be poorly matched to the instance.

A sequence of increasing cutoffs can provide more flexibility.

---

## 11. Geometric Restart Schedules

A common idea is to increase the cutoff geometrically:

```text
C, rC, r²C, r³C, ...
```

where:

```text
r > 1
```

Example:

```text
100
200
400
800
1600
...
```

This avoids committing immediately to an enormous run while gradually allowing deeper exploration.

The exact schedule should be treated as an engineering parameter and benchmarked.

---

## 12. Luby-Style Restart Sequences

Another family uses a universal-style sequence such as:

```text
1, 1, 2, 1, 1, 2, 4, ...
```

The idea is to avoid committing to one guessed ideal cutoff when the distribution of solution times is unknown.

Restart theory studies how such schedules perform when solution times vary.

For this mastery chapter, the important engineering lesson is:

> Restart schedules should be evaluated against the actual runtime distribution of the solver, not selected because a sequence is fashionable.

---

## 13. Heavy-Tailed Search Behavior

Some randomized search processes have highly variable runtimes.

For example:

```text
most runs finish quickly
but
some runs take extremely long
```

The long tail can dominate expected runtime.

Restarts can truncate unlucky runs:

```text
long tail
   ↓
cut off
   ↓
try fresh trajectory
```

This is one reason restart strategies can produce large practical improvements even though they may repeat work.

---

## 14. Randomized Backtracking with Complete Search

A randomized order alone does not remove completeness.

Suppose every branch is eventually explored:

```text
random permutation of choices
→ explore all choices
```

The solver remains complete.

But randomized **restarts with hard cutoffs** can abandon unexplored branches.

Therefore distinguish:

### Randomized traversal

Potentially complete.

### Restarted incomplete run

May not be complete unless abandoned work is tracked or eventually covered.

This distinction matters when designing exact algorithms.

---

## 15. Restart + Global Search Accounting

One way to preserve completeness is to maintain explicit information about what search has already been covered.

For example:

```text
restart
 ↓
new traversal order
 ↓
track previously exhausted regions
 ↓
ensure no required region is permanently forgotten
```

However, tracking enough information to guarantee completeness may remove some of the memory advantages that motivated restarts.

Therefore the design should state explicitly whether the solver is:

```text
complete exact
probabilistically complete
or heuristic / anytime
```

Do not blur these guarantees.

---

## 16. Decision Problems vs Optimization Problems

### Decision

Question:

```text
Does any valid solution exist?
```

A restart can stop immediately after finding one valid solution.

### Optimization

Question:

```text
What is the best valid solution?
```

Finding a good solution is not enough.

A randomized restart can improve the incumbent early, but exact optimality still requires a valid proof mechanism such as:

- exhaustive remaining search,
- branch-and-bound,
- admissible bounds,
- exact dynamic programming where applicable.

Randomness may accelerate discovery of incumbents without becoming the proof of optimality.

---

## 17. Anytime Search

An anytime solver can return progressively better solutions:

```text
solution 1 → score 80
solution 2 → score 91
solution 3 → score 96
...
```

Restarts can provide different trajectories and therefore different candidate solutions.

The solver maintains:

```text
incumbent = best validated solution seen so far
```

For exact optimization, continue until a proof establishes that no better solution exists.

For bounded-time systems, return the incumbent together with its status:

```text
validated feasible
not proven optimal
```

This is a critical engineering distinction.

---

## 18. Randomization and Deterministic Correctness

The following components should remain deterministic for a fixed state and candidate choice:

- constraint validation,
- state mutation/undo,
- objective calculation,
- bound safety,
- result validation.

Randomness should primarily influence:

- branch ordering,
- tie-breaking,
- restart trajectories,
- heuristic perturbation.

This creates a clean architecture:

```text
randomized policy
       ↓
exact search engine
       ↓
deterministic constraints
       ↓
validated result
```

---

## 19. Random Noise in Heuristics

Instead of fully shuffling choices, add controlled noise to a heuristic score:

```text
effectiveScore = heuristicScore + randomNoise
```

This can diversify search while retaining heuristic structure.

But the noise distribution matters.

Large noise:

```text
mostly random search
```

Small noise:

```text
mostly heuristic search
```

The right scale is empirical and problem-dependent.

---

## 20. Reproducibility

Every randomized solver should support:

```text
seed
```

and ideally record:

```text
seed
restart number
cutoff
heuristic policy
node count
runtime
result
```

Then a production failure can be replayed:

```text
same input
+
same configuration
+
same seed
→ same search trajectory
```

This is essential for debugging nondeterministic search behavior.

---

## 21. Parallel Random Restarts

Independent randomized restarts are naturally parallelizable.

Conceptually:

```text
Worker 1 → seed A
Worker 2 → seed B
Worker 3 → seed C
Worker 4 → seed D
```

Each worker explores a different trajectory.

A shared incumbent can improve optimization pruning, but synchronization introduces tradeoffs:

```text
shared incumbent
→ stronger pruning
```

versus:

```text
less synchronization
→ better worker independence
```

For decision problems, workers can terminate globally when one finds a valid solution.

---

## 22. Randomized Search in Distributed Systems

A backend optimization service can distribute independent search attempts across workers.

Each worker receives:

```text
problem
seed
search policy
cutoff
```

and returns:

```text
status
solution
objective
nodes
runtime
seed
```

The coordinator validates returned solutions before updating the global result.

Never trust a worker's claimed objective without validating the witness against the original constraints.

---

## 23. Failure Modes

Randomized backtracking can fail operationally through:

- non-reproducible bugs,
- poor random-number generation,
- too much randomness destroying useful heuristics,
- insufficient exploration diversity,
- restart cutoffs that are too short,
- restart cutoffs that are too long,
- biased seeds,
- accidental state leakage between restarts,
- incorrect shared-incumbent synchronization.

Every restart must restore the original problem state correctly.

A restart is logically equivalent to starting a fresh search.

---

## 24. Complexity

Randomization does not magically remove exponential worst-case complexity.

For a search tree with branching factor `b` and depth `d`, exhaustive traversal can still require approximately:

```text
O(b^d)
```

The purpose of randomization and restarts is to improve the **runtime distribution** and probability of finding useful solutions early, not to change the underlying worst-case combinatorial explosion.

Measure:

```text
median runtime
p90 / p95 / p99 runtime
success within cutoff
nodes per run
restarts per success
best objective over time
```

Tail latency is particularly important.

---

## 25. Testing Strategy

### Seed Reproducibility

Same seed + same input + same configuration should reproduce the same behavior when deterministic execution is expected.

### Different-Seed Testing

Run many seeds and compare:

- success rate,
- runtime distribution,
- nodes explored,
- objective quality.

### Restart Restoration

After every restart, verify that the initial state is identical to a fresh copy.

### Differential Testing

For small instances compare randomized exact search with exhaustive enumeration.

Randomization may change traversal order, but not the correct result.

### Statistical Testing

Use enough independent seeds to estimate performance metrics.

Do not conclude that one seed is universally superior from a single run.

---

## 26. Backend Engineering Applications

Useful applications include:

- configuration optimization,
- scheduling,
- resource allocation,
- dependency resolution,
- route planning,
- test selection,
- deployment planning,
- query-plan exploration.

A production API should expose whether the result is:

```text
PROVEN_OPTIMAL
FEASIBLE_NOT_PROVEN_OPTIMAL
NO_SOLUTION_FOUND_WITHIN_BUDGET
```

This prevents a time-limited randomized search from being mistaken for a proof of impossibility or optimality.

---

## 27. AI Engineering Applications

Randomized restarts fit naturally around AI-generated heuristics.

Architecture:

```text
AI proposes heuristic / candidate ordering
              ↓
validate heuristic inputs
              ↓
seeded randomized search
              ↓
restart on cutoff
              ↓
validate every candidate
              ↓
maintain incumbent
              ↓
exact proof layer when required
```

The AI may influence exploration order, but deterministic validation remains the authority.

For agent planning, different seeds can explore different action sequences while a hard validator enforces legal transitions.

---

## 28. Correctness Invariants

Maintain:

1. Every generated candidate is validated by the original constraints.
2. Randomization changes ordering, not the definition of validity.
3. Every restart begins from an equivalent initial state.
4. State mutations are completely undone before restart or sibling exploration.
5. A cutoff is never described as proof of impossibility.
6. An incumbent is always a validated feasible solution.
7. Exact optimality is claimed only after a valid proof mechanism finishes.
8. Fixed seeds reproduce the configured deterministic trajectory.
9. Shared incumbents are updated only with validated solutions.
10. Parallel workers cannot corrupt shared search state.

---

## 29. Interview Framework

When asked about randomized backtracking:

1. Explain that randomness usually changes branch order.
2. Separate randomized traversal from randomized correctness.
3. Explain seeded pseudo-randomness and reproducibility.
4. Define a restart.
5. Explain why restarts can help heavy-tailed search.
6. Discuss cutoff schedules.
7. Distinguish decision and optimization problems.
8. Explain anytime incumbents.
9. Explain why randomization does not remove exponential worst-case complexity.
10. Discuss parallel independent restarts.
11. Explain how correctness is preserved.
12. Describe the performance statistics you would measure.

The key question is:

> If you restart after a cutoff, what guarantee do you still have about the unexplored search space?

Your answer must distinguish heuristic effectiveness from completeness.

---

## 30. Revision Checklist

You should be able to answer:

- Why randomize backtracking?
- What is randomized branch ordering?
- Why use seeded randomness?
- How can randomization coexist with exact search?
- What is a restart?
- Why can restarts help heavy-tailed runtimes?
- What is a restart cutoff?
- What is a geometric restart schedule?
- What is a Luby-style schedule?
- Why are decision and optimization problems different under restarts?
- What is an anytime solution?
- Why can an incumbent be valid without being optimal?
- How do parallel randomized restarts work?
- Why must restart state be fully restored?
- How do you test randomized algorithms?
- What does a cutoff failure actually prove?

---

## 31. Master Pattern

```text
INITIAL STATE
     ↓
CHOOSE VARIABLE / BRANCH
     ↓
HEURISTIC + CONTROLLED RANDOMNESS
     ↓
MAKE DECISION
     ↓
PROPAGATE / VALIDATE
     ↓
SUCCESS? ───────────────→ RETURN / UPDATE INCUMBENT
     ↓
FAILURE?
     ↓
CUTOFF REACHED?
   /          \
 YES          NO
  ↓            ↓
RESTART     BACKTRACK
  ↓            ↓
NEW SEED / ORDER
  ↓
SEARCH AGAIN
```

The evolution is:

```text
Backtracking
    ↓
Heuristic ordering
    ↓
Randomized tie-breaking
    ↓
Seeded randomized search
    ↓
Restart policies
    ↓
Anytime search
    ↓
Parallel randomized search
    ↓
Distributed exact / heuristic optimization
```

The core principle is:

> **Use randomness to diversify exploration, use restarts to escape unlucky trajectories, and keep correctness in the deterministic constraint-and-proof layer.**
