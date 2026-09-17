# 16.16 — Constraint Propagation, Variable Ordering & Search Heuristics

## 1. Why This Lesson Matters

Basic backtracking follows:

```text
choose → validate → recurse → undo
```

That is enough for small search spaces. Real constraint-satisfaction problems (CSPs) become difficult because a naive DFS can spend most of its time exploring branches that were already doomed by information available elsewhere in the state.

Advanced backtracking improves the search by making constraints **propagate** before deeper recursion and by choosing the next variable intelligently.

The central idea is:

> Do not merely detect failure after making a choice. Push the consequences of a choice through the remaining state as early as possible.

---

## 2. CSP Mental Model

A CSP can be represented as:

```text
Variables
Domains
Constraints
```

Example: graph coloring

```text
Variables: V1, V2, V3, V4
Domain:    {red, green, blue}
Constraint: adjacent vertices must differ
```

A backtracking solver repeatedly:

1. chooses an unassigned variable,
2. chooses a value from its domain,
3. propagates constraints,
4. detects contradiction or continues,
5. restores the previous state on failure.

The quality of steps 1–3 can dominate runtime.

---

## 3. Constraint Propagation

Constraint propagation reduces future possibilities using constraints already known to hold.

Suppose:

```text
A = red
B ∈ {red, green, blue}
A != B
```

Propagation immediately changes:

```text
B ∈ {green, blue}
```

No recursive search was required to discover that `B = red` is impossible.

This turns information from one assignment into restrictions on other variables.

---

## 4. Forward Checking

A simple propagation strategy is **forward checking**.

After assigning a variable:

```text
X = value
```

inspect every directly constrained unassigned variable and remove values that now violate the constraint.

If any domain becomes empty:

```text
contradiction → backtrack immediately
```

Forward checking is stronger than checking only the current assignment, but it does not necessarily detect every contradiction among variables that have not yet been assigned.

---

## 5. Arc Consistency

A stronger concept is arc consistency.

For a binary constraint between `X` and `Y`, a value `x ∈ Domain(X)` is supported when there exists at least one `y ∈ Domain(Y)` such that the constraint holds.

If no supporting value exists, remove `x`.

Conceptually:

```text
for each constraint X ↔ Y:
    remove unsupported values from X
    if X changed:
        revisit constraints affected by X
```

Repeated propagation can expose contradictions before DFS makes many additional decisions.

For a general solver, this is closely related to AC-style algorithms such as AC-3.

---

## 6. Propagation vs Validation

These are different operations.

### Validation

Ask:

```text
Is the current partial assignment still legal?
```

### Propagation

Ask:

```text
Given what I know, what values are no longer possible elsewhere?
```

Validation detects failure.

Propagation attempts to prevent future failure by shrinking domains now.

A strong solver often performs both.

---

## 7. Variable Ordering

When several variables remain unassigned, the order in which they are selected can dramatically change the search tree.

A naive solver might choose:

```text
V1 → V2 → V3 → V4
```

regardless of constraints.

A heuristic solver asks:

> Which variable should I assign next to expose contradictions as early as possible?

This is a search-order decision, not a correctness requirement.

---

## 8. MRV — Minimum Remaining Values

The **MRV** heuristic selects the unassigned variable with the smallest current domain.

Example:

```text
A → {1,2,3}
B → {2}
C → {1,2}
D → {1,2,3,4}
```

MRV chooses `B`.

Why?

A variable with very few options is closest to failure or forced assignment. Resolving it early often reduces wasted exploration.

MRV is sometimes called the **fail-first** principle:

> Explore the most constrained variable first so contradictions appear early.

---

## 9. Degree Heuristic

If several variables tie under MRV, choose the variable involved in the largest number of constraints with other unassigned variables.

Example:

```text
A degree = 5
B degree = 2
C degree = 5
```

If `A` and `C` tie on domain size, either may be selected according to a deterministic tie-breaker.

The intuition is that highly connected variables have greater influence on the remaining search space.

---

## 10. Least Constraining Value

Variable selection answers:

```text
Which variable first?
```

Value ordering answers:

```text
Which value first?
```

The **Least Constraining Value (LCV)** heuristic tries the value that removes the fewest options from neighboring variables.

Example:

```text
X = red
```

might remove one neighbor option, while:

```text
X = blue
```

might remove four.

Trying `red` first preserves more future flexibility.

LCV does not guarantee a smaller search tree. It is a heuristic for ordering branches.

---

## 11. MRV + Degree + LCV

A common CSP search pipeline is:

```text
Select variable:
    MRV
      ↓ tie
    Degree

Select value:
    LCV

Then:
    assign
    propagate
    recurse
    undo
```

The heuristics influence **which branch is explored first**. The constraints determine which branches are actually legal.

Never confuse a heuristic preference with a correctness rule.

---

## 12. State Representation

A generic CSP solver may maintain:

```text
variables
assignments
unassigned variables
domains
constraint graph
propagation trail
search statistics
```

A useful state invariant is:

> Every value currently present in every domain remains consistent with all constraints that have already been propagated.

The trail records changes so backtracking can restore exactly the previous state.

---

## 13. The Trail / Undo Log

Propagation may modify many domains:

```text
X assignment
 ↓
remove Y=red
remove Z=blue
remove W=green
```

A single `pop()` on the assignment stack is not enough to restore these changes.

Use a trail:

```text
trail.push({ variable: Y, removed: red })
trail.push({ variable: Z, removed: blue })
trail.push({ variable: W, removed: green })
```

Before entering a branch:

```text
checkpoint = trail.length
```

After failure:

```text
undo until trail.length === checkpoint
```

This is a general production technique for reversible search state.

---

## 14. Contradiction Detection

Propagation should terminate with either:

```text
consistent state
```

or:

```text
contradiction
```

Common contradiction signals:

- an unassigned variable has an empty domain,
- an assignment violates a constraint,
- a global constraint becomes impossible,
- required capacity exceeds available capacity.

Returning failure immediately prevents unnecessary recursion.

---

## 15. Search Skeleton

```text
search(state):
    if solved(state):
        return success

    variable = selectVariable(state)      // MRV + degree

    for value in orderValues(variable):   // LCV
        checkpoint = trail.length

        if assign(variable, value) fails:
            restore(checkpoint)
            continue

        if propagate(state) succeeds:
            if search(state) succeeds:
                return success

        restore(checkpoint)

    return failure
```

This is the core architecture for advanced CSP backtracking.

---

## 16. Propagation Strength Tradeoff

More propagation is not automatically better.

There is a tradeoff:

```text
weak propagation
→ cheap per node
→ more search nodes

strong propagation
→ expensive per node
→ potentially far fewer nodes
```

The best strategy depends on the problem.

For a tiny puzzle, sophisticated propagation may be unnecessary overhead. For a highly constrained large CSP, it can dramatically reduce the search tree.

Benchmark both node count and wall-clock time.

---

## 17. Dynamic Variable Ordering

A variable's domain changes during search.

Therefore MRV must generally be evaluated **dynamically**, not once at the beginning.

Example:

```text
Before propagation:
A → {1,2,3}
B → {1,2}

After assigning X:
A → {2}
B → {1,2}
```

MRV should now select `A`.

Static ordering can miss this newly exposed bottleneck.

---

## 18. Symmetry Breaking

If two branches are equivalent under a problem symmetry, exploring both may be redundant.

Example:

```text
colors = {red, green, blue}
```

If color names themselves have no semantic meaning, some assignments can be canonicalized to avoid equivalent color permutations.

Symmetry breaking must preserve at least one representative from every equivalence class of valid solutions.

Incorrect symmetry breaking can silently destroy completeness.

---

## 19. Nogood Learning

A failed partial assignment can sometimes be summarized as a **nogood**:

```text
(A=1, C=3) → impossible
```

If the same combination appears through another search path, the solver can reject it immediately.

This moves the solver toward techniques used in more advanced constraint programming and SAT solving.

The key requirement is that the learned condition must be logically justified by the constraints.

---

## 20. Complexity

Worst-case CSP backtracking remains exponential.

For `n` variables with maximum domain size `d`, a naive assignment search can have roughly:

```text
O(d^n)
```

leaves.

Constraint propagation and heuristics do not generally remove the exponential worst case. Their practical purpose is to reduce the number of states actually explored.

Therefore report both:

```text
Worst-case theoretical complexity
```

and:

```text
Observed search reduction from heuristics/propagation
```

---

## 21. Correctness Framework

A heuristic is correct when it changes ordering without changing the set of legal branches.

Propagation is correct when it removes only values that cannot participate in any solution consistent with the current state.

Restoration is correct when every mutation made in a branch is undone before another sibling branch is explored.

Completeness therefore depends on three properties:

```text
sound constraints
+ sound propagation
+ complete branch exploration
```

Ordering heuristics affect performance, not the mathematical solution set.

---

## 22. Testing Strategy

Test the solver at several levels.

### Constraint Tests

Verify each primitive constraint independently.

### Propagation Tests

Given a state, verify that propagation removes only unsupported values.

### Restoration Tests

Take a state snapshot, run a branch, restore it, and compare every mutable field.

### Heuristic Tests

Verify MRV chooses the smallest domain and degree tie-breaking is deterministic.

### Completeness Tests

Compare against a brute-force solver on small instances.

### Performance Tests

Record:

```text
recursive calls
constraint checks
propagation operations
branches pruned
solutions found
maximum depth
runtime
```

Do not assume fewer recursive calls always means faster execution; measure actual runtime.

---

## 23. Backend Engineering Applications

Constraint propagation appears in systems that must produce valid combinations under interacting rules:

- scheduling,
- resource allocation,
- configuration generation,
- feature compatibility,
- routing constraints,
- dependency resolution,
- rule engines,
- test-case generation.

For example, a deployment planner might maintain domains for:

```text
region
instance type
availability zone
network
database tier
```

Selecting one option can eliminate incompatible options elsewhere.

A CSP-style engine can propagate those restrictions before attempting expensive deeper combinations.

---

## 24. AI Engineering Applications

AI systems frequently generate candidates that must satisfy hard constraints.

A robust architecture is:

```text
LLM proposes candidate
        ↓
constraint parser
        ↓
propagation
        ↓
exact search / repair
        ↓
validated output
```

Examples include:

- structured workflow generation,
- tool-call planning,
- configuration generation,
- schema-constrained output repair,
- scheduling proposals,
- dependency-aware task planning.

The AI can provide useful candidate ordering or heuristic scores, while deterministic constraints retain authority over validity.

---

## 25. Interview Framework

When asked about optimizing backtracking, explain:

1. Define the variables, domains, and constraints.
2. State the naive DFS search space.
3. Add constraint validation.
4. Add forward checking.
5. Explain stronger propagation when justified.
6. Select variables with MRV.
7. Break MRV ties with degree.
8. Order values using LCV when useful.
9. Maintain a reversible trail for propagated changes.
10. Restore every mutation after the branch.
11. Discuss correctness separately from heuristic performance.
12. Benchmark node count and wall-clock time.

This shows that you understand search as an engineered system rather than only a recursive template.

---

## 26. Revision Checklist

You should be able to answer:

- What is constraint propagation?
- How does forward checking differ from simple validation?
- What does arc consistency attempt to guarantee?
- What is MRV?
- Why is MRV called fail-first?
- When is the degree heuristic useful?
- What is LCV?
- Why should variable ordering be dynamic?
- Why is a trail needed?
- How do you restore propagated domain changes?
- What constitutes a contradiction?
- Why can stronger propagation increase per-node cost?
- Why do heuristics not change worst-case exponential complexity?
- What makes pruning sound?
- How can symmetry breaking accidentally destroy completeness?
- What is nogood learning?
- How would you benchmark a CSP solver properly?

---

## 27. Master Pattern

```text
CURRENT STATE
     ↓
PROPAGATE KNOWN CONSTRAINTS
     ↓
CONTRADICTION? ── YES → BACKTRACK
     ↓ NO
SELECT MOST CONSTRAINED VARIABLE
     ↓
ORDER CANDIDATE VALUES
     ↓
ASSIGN
     ↓
PROPAGATE AGAIN
     ↓
RECURSE
     ↓
UNDO USING TRAIL
     ↓
TRY NEXT VALUE
```

The evolution from basic backtracking to advanced CSP solving is:

```text
Backtracking
    ↓
Constraint checking
    ↓
Forward checking
    ↓
Constraint propagation
    ↓
MRV / Degree / LCV
    ↓
Trail-based restoration
    ↓
Symmetry breaking
    ↓
Nogood learning
```

The goal is not to make recursion more complicated. The goal is to make every recursive decision **better informed**.
