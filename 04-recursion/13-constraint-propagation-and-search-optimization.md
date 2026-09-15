# 04.13 — Constraint Propagation & Search Optimization

## Purpose

Backtracking gives us systematic search. Constraint propagation makes that search substantially smarter by deriving consequences before blindly branching.

The central idea is:

> Before making another guess, extract every safe consequence of the decisions already made.

This chapter develops propagation, domain reduction, variable/value ordering, forward checking, arc consistency, symmetry breaking, bounds, heuristics, and the engineering trade-offs between stronger reasoning and cheaper search.

---

# 1. From Backtracking to Constraint Solving

A constraint problem can be represented as:

```text
Variables
Domains
Constraints
```

Example:

```text
A ∈ {1,2,3}
B ∈ {1,2,3}
A ≠ B
```

A solver searches assignments while maintaining constraint consistency.

---

# 2. Domains

A variable's **domain** is the set of values currently available to it.

Initially:

```text
D(A) = {1,2,3}
D(B) = {1,2,3}
```

After assigning:

```text
A = 1
```

constraint propagation can derive:

```text
D(B) = {2,3}
```

---

# 3. Domain Reduction

Removing impossible values is useful because every removed value represents future search that no longer needs to occur.

A domain reduction is safe when the removed value cannot participate in any valid completion.

---

# 4. Propagation

Generic cycle:

```text
assignment
   ↓
propagate constraints
   ↓
domains shrink
   ↓
contradiction?
 ↙       ↘
yes       no
backtrack  branch
```

Propagation can therefore move failure detection closer to the cause.

---

# 5. Forward Checking

Forward checking examines future variables immediately after an assignment.

If any future domain becomes empty:

```text
current branch is impossible
```

and the solver backtracks.

It is cheaper than full consistency algorithms but stronger than checking only the current assignment.

---

# 6. Constraint Propagation vs Search

Search makes a decision:

```text
try A = 1
```

Propagation derives consequences:

```text
A = 1
→ B ≠ 1
→ C cannot be 3
```

Do not confuse deduction with guessing.

---

# 7. Arc Consistency

For a binary constraint between variables `X` and `Y`, a value `x ∈ D(X)` is supported if there exists some `y ∈ D(Y)` satisfying the constraint.

If no supporting `y` exists, remove `x`.

This is the core idea behind arc consistency.

---

# 8. AC-3 Mental Model

A common propagation approach maintains a queue of arcs:

```text
(X, Y)
```

Process an arc:

```text
revise D(X) using D(Y)
```

If `D(X)` changes, neighboring arcs may need to be reconsidered.

The important concept is not memorizing the implementation first; understand why domain changes can create new deductions elsewhere.

---

# 9. Propagation Fixed Point

Propagation can continue until:

```text
no domain changes
```

or:

```text
some domain becomes empty
```

The first is a local fixed point; the second is a contradiction.

---

# 10. Contradiction Detection

Common contradiction signals:

```text
empty domain
conflicting assignment
capacity exceeded
required value unavailable
constraint impossible
```

The earlier a contradiction is detected, the fewer descendants need to be explored.

---

# 11. Minimum Remaining Values

MRV chooses the variable with the smallest current domain.

Example:

```text
A → {1,2,3,4}
B → {2}
C → {1,3}
```

Choose `B` first.

Why?

> A highly constrained variable is more likely to expose failure early.

---

# 12. Degree Heuristic

If several variables tie under MRV, prefer the variable involved in more constraints.

It can constrain more of the remaining problem after assignment.

Common combination:

```text
MRV first
→ degree heuristic as tie-breaker
```

---

# 13. Least Constraining Value

For value ordering, one useful heuristic is:

> Try the value that leaves the most options for neighboring variables.

This is called the least-constraining-value principle.

Unlike safe pruning, this primarily changes search order.

---

# 14. Heuristic vs Correctness Rule

A crucial distinction:

```text
safe pruning → may remove only impossible branches
heuristic ordering → changes which branch is explored first
```

A heuristic should not silently become an unsound pruning rule.

If every candidate is eventually considered, ordering generally preserves completeness.

---

# 15. Constraint Graph

A CSP can be represented as a graph:

```text
variable = vertex
constraint = edge
```

This makes structural reasoning possible.

Highly connected variables can influence many others.

Sparse problems may be much easier than dense problems even with the same number of variables.

---

# 16. Propagation Through a Graph

Suppose:

```text
A — B — C
```

Changing `A` may reduce `B`'s domain.

That reduction may then reduce `C`'s domain.

Therefore propagation can cascade through the constraint graph.

---

# 17. Global Constraints

Some constraints involve many variables simultaneously.

Examples:

```text
AllDifferent
capacity limits
sum constraints
scheduling constraints
resource allocation
```

A strong global constraint implementation can derive more information than repeatedly applying weak pairwise checks.

---

# 18. AllDifferent

For variables:

```text
A, B, C
```

an `AllDifferent` constraint requires all assigned values to differ.

Simple propagation can remove assigned values from remaining domains.

Stronger algorithms can detect deeper Hall-set-style restrictions.

---

# 19. Sudoku Propagation

Sudoku naturally exposes propagation:

```text
row constraints
column constraints
box constraints
```

After placing a digit, remove it from related domains.

If a cell has one remaining candidate, the assignment is forced rather than guessed.

---

# 20. N-Queens Propagation

When a queen is placed at `(row, col)`, future rows cannot use:

```text
same column
same main diagonal
same anti-diagonal
```

Tracking these sets is a compact form of constraint propagation.

---

# 21. Symmetry

Many search spaces contain equivalent solutions caused by symmetry.

For example, board reflections or rotations can produce equivalent configurations.

If the problem asks only for equivalence classes, symmetry-breaking constraints can eliminate redundant branches.

---

# 22. Symmetry-Breaking Safety

Symmetry breaking is safe only when the removed branches are guaranteed to be equivalent under the problem's required output semantics.

If the problem requires every distinct arrangement, incorrectly removing symmetric branches changes the answer.

Always define what “distinct” means first.

---

# 23. Bounds as Constraints

Optimization problems often maintain a bound.

For maximization:

```text
optimistic upper bound ≤ current best
→ prune
```

For minimization:

```text
optimistic lower bound ≥ current best
→ prune
```

The bound must be optimistic, not merely plausible.

---

# 24. Branch-and-Bound

General structure:

```text
choose branch
→ compute optimistic bound
→ if branch cannot beat best: prune
→ otherwise recurse
→ update best
```

Branch-and-bound combines search with mathematical bounding.

---

# 25. Bound Quality

A weak bound:

```text
rarely prunes
```

A strong bound:

```text
requires more computation
```

The best engineering choice minimizes total work:

```text
bound computation cost + remaining search cost
```

---

# 26. Propagation Cost Trade-Off

Stronger propagation is not automatically faster.

Consider:

```text
cheap propagation + large search
```

versus:

```text
expensive propagation + tiny search
```

The optimal choice depends on the instance and workload.

---

# 27. Search Node Metrics

Useful measurements include:

```text
nodes visited
branches attempted
branches pruned
propagation operations
domain reductions
maximum depth
solutions found
cache hits
```

Instrumentation makes optimization evidence-based rather than speculative.

---

# 28. Effective Branching Factor

The nominal branching factor may be large while propagation reduces the effective branching factor.

For example:

```text
10 candidate values
→ propagation eliminates 7
→ effective choices = 3
```

This is why practical runtime can differ dramatically from naive `O(b^d)` estimates.

---

# 29. Constraint Ordering

Check cheap, highly selective constraints early.

Bad:

```text
expensive calculation
→ cheap rejection
```

Better:

```text
cheap rejection
→ expensive calculation only if needed
```

This is analogous to short-circuit evaluation in ordinary algorithms.

---

# 30. Incremental Constraint State

Avoid recomputing the entire constraint state after every decision.

Prefer incremental updates:

```text
apply one choice
→ update affected constraints
→ recurse
→ undo only those updates
```

This can dramatically reduce per-node cost.

---

# 31. Copy vs Undo

Copying state:

```text
simpler ownership
higher allocation cost
```

Undoing state:

```text
lower allocation
more complex restoration invariant
```

For large search trees, allocation and garbage-collection costs can matter substantially.

---

# 32. Bitmasks

For small finite domains, bitmasks can represent sets compactly.

Example concept:

```text
bits = available values
```

Operations such as membership, intersection, and removal can become constant-time machine operations for bounded domains.

This is particularly useful in puzzles and combinatorial search.

---

# 33. Memoization Boundary

Propagation does not eliminate all repeated states.

If two different decision histories produce the same future-relevant state, memoization can merge them.

The important question is:

> What information completely determines the remaining search?

---

# 34. Canonical State

A memoization key should exclude irrelevant history.

For example:

```text
remaining variables + normalized domains
```

may be more appropriate than the complete sequence of assignments that produced them.

Canonicalization is often harder than the cache itself.

---

# 35. Propagation + Memoization

A powerful hybrid is:

```text
lookup canonical state
→ propagate
→ check contradiction
→ branch
→ cache result
```

The cache stores the result of the normalized logical state, not accidental implementation details.

---

# 36. Completeness

A complete exact solver must eventually consider every equivalence class of feasible solutions unless a proof-based rule eliminates it.

Three common ways to preserve completeness:

```text
enumerate every legal choice
or
apply logically safe propagation/pruning
or
replace equivalent branches with a proven symmetry rule
```

---

# 37. Soundness vs Completeness

**Soundness:** every reported solution is valid.

**Completeness:** every required valid solution is reachable/reported according to the problem contract.

A solver can be:

```text
sound but incomplete
```

if it uses aggressive heuristic pruning.

Exact backtracking systems should explicitly protect both properties.

---

# 38. Backend Applications

Constraint propagation is useful for:

- scheduling with availability constraints;
- resource allocation;
- configuration validation;
- dependency resolution;
- feature compatibility;
- rule-based workflows;
- capacity planning.

A backend service should bound worst-case search and expose cancellation/timeouts for expensive requests.

---

# 39. AI Applications

Propagation and search appear in:

- planning;
- symbolic reasoning;
- program synthesis;
- theorem/proof search;
- structured generation;
- constraint-based decoding;
- combinatorial optimization.

AI search often combines exact constraints with heuristic scoring.

---

# 40. Production Architecture

A robust constraint solver may expose:

```text
solve(problem, options)
```

where options can include:

```text
maxNodes
maxDepth
timeLimit
memoryLimit
heuristic strategy
propagation strength
cancellation signal
collectAllSolutions
```

Keep correctness semantics separate from operational limits.

---

# 41. Design Procedure

```text
1. Define variables and domains.
2. Define hard constraints.
3. Identify cheap/high-value propagation rules.
4. Apply initial propagation.
5. Detect contradictions.
6. Select a variable using a principled heuristic.
7. Order candidate values.
8. Apply one candidate.
9. Propagate incrementally.
10. Recurse.
11. Undo all changes.
12. Maintain soundness and completeness.
13. Measure nodes/pruning/propagation cost.
14. Add memoization if equivalent states repeat.
15. Add bounds for optimization.
16. Add production resource controls.
```

---

# 42. Interview Explanation Template

> “I first model the problem as variables, domains, and constraints. After each assignment I propagate all cheap, logically safe consequences and immediately backtrack on contradiction. I choose highly constrained variables first, use value ordering as a search heuristic, and maintain incremental constraint state. For optimization I add an optimistic bound for branch-and-bound. I distinguish correctness-preserving pruning from heuristics and measure the effective branching factor rather than relying only on the nominal search-tree size.”

---

# 43. Revision Checklist

- [ ] Can I explain domains and domain reduction?
- [ ] Can I distinguish search from propagation?
- [ ] Can I explain forward checking?
- [ ] Can I explain arc consistency conceptually?
- [ ] Can I describe the AC-3 mental model?
- [ ] Can I use MRV and degree heuristics?
- [ ] Can I explain least-constraining-value ordering?
- [ ] Can I distinguish pruning from ordering heuristics?
- [ ] Can I reason about constraint graphs?
- [ ] Can I explain symmetry breaking safely?
- [ ] Can I derive valid optimization bounds?
- [ ] Can I explain branch-and-bound?
- [ ] Can I measure effective branching factor?
- [ ] Can I design incremental constraint updates?
- [ ] Can I recognize memoization boundaries?
- [ ] Can I distinguish soundness from completeness?
- [ ] Can I design production limits for expensive search?

# Key Takeaways

1. Propagation derives consequences before branching.
2. Domain reduction shrinks future search.
3. Forward checking detects many failures immediately after assignment.
4. Arc consistency reasons about whether domain values have supporting values in neighboring domains.
5. MRV and related heuristics reduce expected search by exposing contradictions early.
6. Ordering heuristics are not the same as correctness-preserving pruning.
7. Stronger propagation costs more per node, so total runtime is the real optimization target.
8. Incremental constraint state is usually better than full recomputation.
9. Memoization can merge different histories that produce the same future-relevant state.
10. Exact solvers must protect both soundness and completeness.
11. Branch-and-bound extends constraint search to optimization.
12. Production-grade search needs explicit operational resource controls.
