# 16.22 — Backjumping and Conflict-Directed Search

## 1. Why Chronological Backtracking Can Waste Work

Standard backtracking returns to the immediately previous decision whenever a branch fails.

```text
A
└── B
    └── C
        └── failure
             ↓
            undo C
             ↓
            undo B
```

But sometimes the failure has nothing to do with the most recent decision.

Suppose:

```text
X₁ = a
X₂ = b
X₃ = c
X₄ = d
```

and the contradiction is caused specifically by:

```text
X₁ + X₃
```

Undoing `X₄` may accomplish nothing. Undoing `X₂` may also accomplish nothing.

The useful question becomes:

> Which earlier decisions are actually responsible for this failure?

This leads to **backjumping** and **conflict-directed search**.

---

## 2. Chronological Backtracking

Traditional backtracking follows the search stack:

```text
X₁ → X₂ → X₃ → X₄
                    ↓ failure
                back to X₃
                    ↓
                back to X₂
                    ↓
                back to X₁
```

It is simple and often sufficient.

Its weakness is that the search tree contains historical decisions that may be irrelevant to the current contradiction.

Chronological backtracking asks:

```text
What was the last decision?
```

Conflict-directed search asks:

```text
Which decisions caused the contradiction?
```

---

## 3. Conflict Sets

A **conflict set** records variables or decisions that participate in a detected contradiction.

For a variable `Xᵢ`, represent its conflict set as:

```text
conflict[Xᵢ] = {variables responsible for failure}
```

Example:

```text
X₄ cannot take any value

conflict[X₄] = {X₁, X₃}
```

If `X₂` is not involved, there is no reason to jump directly to `X₂` merely because it was the previous assignment.

Conflict information is therefore a form of **causal information about failure**.

---

## 4. Backjumping

When a branch fails, determine the deepest decision in its conflict set and jump directly to that decision.

Conceptually:

```text
X₁
 ↓
X₂
 ↓
X₃
 ↓
X₄ → contradiction
      conflict = {X₁, X₃}

jump from X₄ directly to X₃
```

If `X₃` changes, the contradiction may disappear.

If `X₃` has no remaining alternatives, its conflict information can be propagated upward.

This avoids exploring intermediate stack levels that cannot affect the conflict.

---

## 5. Backjumping Is Not Arbitrary Skipping

A dangerous misconception is:

> “If a branch looks bad, jump backward several levels.”

That is not enough.

A backjump is correct only when the algorithm can establish that the skipped decisions cannot resolve the detected conflict.

Therefore the key invariant is:

> Every skipped decision is irrelevant to the recorded conflict under the problem's constraint semantics.

Without this invariant, non-chronological backtracking can skip a valid solution.

---

## 6. Conflict-Directed Backjumping

A classic approach is **Conflict-Directed Backjumping (CBJ)**.

Each variable maintains a conflict set.

When assigning `Xᵢ`:

```text
try value
 ↓
propagate constraints
 ↓
conflict?
 ├── no → continue
 └── yes → collect conflicting variables
```

If all values of `Xᵢ` fail, its conflict set is merged with the conflict information received from deeper variables.

Then the algorithm jumps to the deepest relevant earlier variable.

This is more informative than simply returning `false`.

---

## 7. Failure Information Must Propagate

Suppose:

```text
X₁ → X₂ → X₃ → X₄
```

and `X₄` reports:

```text
conflict = {X₁, X₃}
```

If `X₃` has no alternative values, then `X₃` itself failed because of `{X₁}` after removing itself from the conflict explanation.

That information can propagate:

```text
X₄ failure
    ↓
X₃ conflict explanation
    ↓
X₂ / X₁
```

The search stack therefore carries more than assignments.

It carries **failure dependencies**.

---

## 8. Conflict Sets vs Constraint Sets

Do not confuse these concepts.

### Constraint set

Describes the problem's rules.

Example:

```text
X₁ != X₂
X₂ != X₃
```

### Conflict set

Describes which assigned variables are implicated in a particular failure.

Example:

```text
{X₂, X₃}
```

The constraint graph is static problem structure.

The conflict set is dynamic search information.

---

## 9. Constraint Graph View

For a CSP:

```text
variables = nodes
constraints = edges / relations
```

A conflict often has a localized structure.

Example:

```text
A ─ B ─ C
    │
    D
```

If `D` becomes impossible because of assignments to `B` and `C`, jumping to an unrelated earlier variable can be wasteful.

Conflict-directed methods exploit this dependency structure.

This connects directly to the constraint-propagation and variable-ordering techniques from earlier lessons.

---

## 10. Backjump Target

Let the current variable be `Xᵢ`.

Suppose its conflict set contains:

```text
{X₂, X₅, X₇}
```

and the current assignment order is:

```text
X₁, X₂, X₃, X₄, X₅, X₆, X₇, Xᵢ
```

The deepest assigned conflicting variable is `X₇`.

The backjump target is therefore `X₇`.

Variables between `X₇` and `Xᵢ` are skipped because they are absent from the conflict explanation.

---

## 11. Dead-End Conflicts

A particularly useful case is a variable whose domain becomes empty.

```text
Domain(X) = ∅
```

The algorithm should not merely return:

```text
false
```

It should ask:

```text
Why did every value disappear?
```

For example:

```text
X ∈ {1,2,3}

1 eliminated by A
2 eliminated by B
3 eliminated by A
```

Then the conflict explanation can contain:

```text
{A, B}
```

This explanation can guide the next backjump.

---

## 12. Forward Checking + Conflict Tracking

Forward checking removes inconsistent values from future domains.

Conflict-directed backjumping records why those values were removed.

Together:

```text
assign
 ↓
forward check
 ↓
remove impossible values
 ↓
record responsible variables
 ↓
domain becomes empty?
 ↓
backjump to deepest relevant cause
```

This is a stronger search architecture than plain chronological backtracking.

---

## 13. Arc Consistency + Conflict Information

Arc consistency can remove values through chains of constraints.

When a value is removed, the solver may record a reason or dependency set.

If propagation eventually creates:

```text
Domain(X) = ∅
```

the collected reasons can form a conflict explanation.

This allows propagation to contribute not only pruning but also information about **where to backtrack**.

The implementation cost is higher because explanations must be maintained accurately.

---

## 14. Backjumping vs Forward Checking

These solve different problems.

### Forward checking

Answers:

> Which future values can already be eliminated?

### Backjumping

Answers:

> Which earlier decision should be reconsidered after failure?

They can be combined.

```text
variable ordering
+
forward checking
+
conflict sets
+
backjumping
```

---

## 15. Conflict Learning

A conflict explanation can sometimes be stored as a **nogood**.

A nogood represents a partial assignment that cannot participate in any solution.

Example:

```text
(A=1, C=3) → impossible
```

If the same combination is encountered again through another search path, it can be rejected immediately.

This transforms historical failure into reusable pruning information.

However, the stored nogood must be semantically correct.

An incorrectly generalized nogood can eliminate valid solutions.

---

## 16. Backjumping vs Nogood Learning

They are related but different.

### Backjumping

Changes **where search resumes**.

```text
failure → jump to relevant decision
```

### Nogood learning

Changes **what future search can immediately reject**.

```text
failure → remember impossible assignment pattern
```

A solver can use both:

```text
conflict explanation
       ↓
backjump
       +
learn nogood
```

---

## 17. Dependency-Directed Backtracking

A more general view is to associate each failure with the decisions that caused it.

Then search becomes:

```text
make decision
 ↓
derive consequences
 ↓
detect contradiction
 ↓
extract dependency set
 ↓
return to a responsible decision
```

This is useful beyond classical CSPs.

The same idea appears whenever a computation can explain why a partial state became impossible.

---

## 18. Correctness of Conflict-Directed Pruning

The correctness proof should establish:

1. Every reported conflict really implies contradiction under the current assignments.
2. Every variable included in the conflict is actually relevant to that contradiction.
3. Variables omitted from the conflict cannot resolve that contradiction while the included assignments remain fixed.
4. The backjump target is an assigned variable in the conflict set.
5. Any skipped decision is therefore irrelevant to the current failure.
6. Conflict information is merged without losing a necessary dependency.

The central proof obligation is **explanation soundness**.

---

## 19. Conflict Explanation Quality

Not all explanations are equally useful.

A large explanation:

```text
{A, B, C, D, E, F}
```

may still be correct but produce little backjumping.

A smaller explanation:

```text
{B, E}
```

can identify a much more precise cause.

Therefore there is a practical tradeoff:

```text
explanation computation cost
vs.
search reduction
```

The strongest explanation is not automatically the fastest if deriving it is expensive.

---

## 20. Variable Ordering Interaction

Backjumping and variable ordering interact strongly.

Suppose the solver chooses variables using MRV.

The resulting assignment order may change from one node to another.

Therefore a conflict set should be represented by stable variable identities, not merely stack positions.

The backjump target is then the deepest currently assigned variable contained in the conflict set.

This is another reason to separate:

```text
variable identity
```

from:

```text
search-stack index
```

---

## 21. Symmetry and Conflicts

Symmetry breaking can reduce duplicate search.

Conflict explanations must still refer to the actual semantic variables or symmetry-reduced representation.

Do not assume that two symmetric branches have identical conflict explanations unless the symmetry transformation preserves the relevant constraints and state semantics.

---

## 22. Complexity

Backjumping does not generally change the worst-case exponential nature of CSP search.

Worst case remains exponential for many NP-hard constraint problems.

Its practical benefit comes from avoiding irrelevant backtracking.

Useful metrics include:

```text
nodes visited
chronological backtracks
backjumps
average jump length
maximum jump length
conflict-set size
propagation operations
nogoods learned
runtime
```

Measure the entire solver, not just the number of backjumps.

---

## 23. Testing Strategy

### Differential Testing

Compare conflict-directed search against a simple chronological solver on small instances.

The result sets must match.

### Conflict Soundness

For every recorded conflict, fix the conflict variables and verify by exhaustive local search that the claimed contradiction really follows.

### Backjump Safety

Construct cases where:

```text
previous variable is irrelevant
```

and verify the solver jumps past it without changing the result.

### Adversarial Cases

Test:

- no conflicts,
- conflicts involving the immediately previous variable,
- conflicts involving distant variables,
- multiple conflicting causes,
- empty domains,
- duplicate constraints,
- highly symmetric CSPs,
- dynamic MRV ordering.

### Differential Result Equality

Do not require the optimized solver to visit the same nodes as the reference solver.

Require:

```text
same feasibility
same solution set when enumerating
same optimal objective when optimizing
```

---

## 24. Backend Engineering Applications

Conflict-directed search is useful when systems must repeatedly repair configurations under interacting constraints.

Examples:

- dependency resolution,
- deployment configuration,
- feature compatibility,
- policy validation,
- scheduling conflicts,
- resource allocation,
- workflow rule systems.

A backend constraint engine can expose explanations such as:

```text
configuration invalid because:
  databaseVersion = 16
  extensionVersion = 11
  compatibility rule requires extensionVersion >= 12
```

This is valuable not only for search performance but also for debuggability.

---

## 25. AI Engineering Applications

AI systems frequently generate candidate configurations or plans that violate interacting constraints.

A robust architecture can be:

```text
LLM candidate
     ↓
normalize
     ↓
constraint propagation
     ↓
conflict explanation
     ↓
backjump / repair
     ↓
validated result
```

Conflict explanations can also become structured feedback:

```text
candidate failed
because constraints C₁ and C₇ conflict with decision X₄
```

The important engineering principle is:

> Generated suggestions may be heuristic; constraint validation and conflict reasoning should remain deterministic.

---

## 26. Interview Framework

When asked about backjumping:

1. Explain chronological backtracking.
2. Give an example where the latest decision is irrelevant to failure.
3. Define a conflict set.
4. Explain how the deepest conflicting variable becomes the backjump target.
5. Explain how conflict information propagates upward.
6. Distinguish backjumping from forward checking.
7. Distinguish backjumping from nogood learning.
8. Explain why explanation soundness is required.
9. Discuss interaction with MRV and dynamic ordering.
10. State that worst-case complexity remains exponential.
11. Explain how differential testing validates the optimized solver.

The strongest interview question is:

> Why is it safe to skip the decisions between the current node and the backjump target?

The answer must reference the conflict explanation, not intuition.

---

## 27. Revision Checklist

You should be able to answer:

- Why can chronological backtracking waste work?
- What is a conflict set?
- What is a backjump target?
- Why must backjumping be explanation-driven?
- How does conflict information propagate upward?
- How does CBJ differ from ordinary backtracking?
- How does CBJ interact with forward checking?
- How can arc consistency contribute conflict information?
- What is a nogood?
- How does nogood learning differ from backjumping?
- Why must conflict explanations be sound?
- Why should conflict sets use variable identities?
- How does MRV affect backjumping?
- How do you test conflict-directed pruning?
- Why does backjumping not guarantee polynomial complexity?

---

## 28. Master Pattern

```text
             ASSIGN VARIABLE
                    ↓
             PROPAGATE CONSTRAINTS
                    ↓
              DOMAIN FAILURE?
               /          \
             NO            YES
             ↓              ↓
        CONTINUE       EXTRACT CONFLICT
                            ↓
                    FIND DEEPEST CAUSE
                            ↓
                       BACKJUMP
                            ↓
                     MERGE FAILURE INFO
                            ↓
                       LEARN NOGOOD?
                            ↓
                       CONTINUE SEARCH
```

The evolution is:

```text
Chronological backtracking
        ↓
Constraint propagation
        ↓
Conflict explanations
        ↓
Backjumping
        ↓
Conflict-directed backjumping
        ↓
Nogood learning
        ↓
Explanation-driven search
```

The core principle is:

> **When a branch fails, do not merely ask where you came from; determine which decisions actually caused the failure, and use that information to move the search backward safely.**
