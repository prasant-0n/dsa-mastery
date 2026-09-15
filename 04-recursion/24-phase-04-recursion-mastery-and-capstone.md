# 04.24 — Phase 04 Recursion Mastery & Capstone

## Purpose

This capstone closes the recursion phase by requiring one complete workflow:

```text
model → derive → implement → prove → analyze → optimize → engineer → defend
```

The goal is not to memorize recursive patterns. The goal is to reliably recognize recursive structure, design correct state, control complexity, and choose the appropriate production execution strategy.

---

# 1. Phase 04 Mastery Standard

You should now be able to reason about:

- recursive state;
- base cases;
- progress and termination;
- call-stack execution;
- recursive return flow;
- accumulators;
- structural recursion;
- divide and conquer;
- linked-list recursion;
- subsets/combinations/permutations;
- backtracking;
- constraint propagation;
- memoization and top-down DP;
- recursion-to-iteration transformation;
- advanced state spaces;
- stack-safe recursion;
- parsing and AST processing;
- backend recursion;
- AI search and planning;
- production recursive engineering.

---

# 2. The Complete Recursive Design Pipeline

For every unfamiliar problem:

```text
1. Identify structure
2. Define state
3. Define terminal states
4. Define progress
5. Define transitions
6. Choose information flow
7. State invariant
8. Write recurrence
9. Implement brute force
10. Prove correctness
11. Analyze time/space/depth
12. Identify repeated states
13. Add safe pruning/memoization
14. Re-analyze complexity
15. Choose execution strategy
16. Add production controls
17. Test edge/pathological cases
18. Defend the design
```

---

# 3. Capstone A — Hierarchical Data Engine

Design a system that accepts flat records:

```text
id
parentId
metadata
```

and supports:

- hierarchy construction;
- recursive validation;
- subtree size;
- depth calculation;
- descendant search;
- inherited configuration;
- cycle detection.

Requirements:

```text
O(N) construction target
bounded traversal depth
cycle safety
tenant-aware state
```

Explain when recursion should be replaced by an explicit worklist.

---

# 4. Capstone B — Expression Language

Build a small arithmetic expression parser supporting:

```text
numbers
identifiers
+
-
*
/
parentheses
unary operators
```

Pipeline:

```text
source
→ tokenizer
→ recursive-descent parser
→ AST
→ evaluator
→ AST transformer
```

You must preserve precedence and associativity and report useful syntax errors.

---

# 5. Capstone C — Constraint Search

Build a generic recursive constraint solver.

Required capabilities:

- variables;
- domains;
- constraints;
- backtracking;
- forward checking;
- MRV ordering;
- safe pruning;
- solution detection.

Analyze:

```text
branching factor
search depth
worst-case nodes
pruning effectiveness
```

---

# 6. Capstone D — Memoized State Search

Choose a problem with overlapping recursive states.

Implement:

```text
naive recursion
→ memoized recursion
→ bottom-up alternative
```

Compare:

- state count;
- total calls;
- memory;
- recursion depth;
- implementation complexity.

---

# 7. Capstone E — AI Planning Search

Model a planning problem as:

```text
state → legal actions → successor states
```

Implement a bounded recursive search with:

- canonical state;
- duplicate detection;
- heuristic ordering;
- safe pruning;
- depth limit;
- node budget;
- time budget.

Clearly identify which optimizations are exact and which are heuristic.

---

# 8. Capstone F — Stack-Safe Transformation

Take a deeply nested structure and implement:

```text
recursive traversal
explicit-stack traversal
```

Verify equivalent output and compare:

```text
time
heap
call-stack usage
maximum supported depth
```

---

# 9. Correctness Requirements

Every capstone must explicitly document:

### State invariant
What is true at every recursive level?

### Base-case correctness
Why is the terminal answer correct?

### Recursive correctness
Why do correct child results produce the correct parent result?

### Termination
What strictly progresses toward termination?

### Pruning safety
Why can a removed branch not affect the required answer?

---

# 10. Complexity Requirements

For every solution report:

```text
Time
Auxiliary space
Output space
Recursion depth
Total recursive calls
State count, if memoized
External work, if applicable
```

Do not confuse recursion depth with total work.

---

# 11. Production Requirements

For backend/AI capstones include:

- input limits;
- depth limits;
- node/work budgets;
- cancellation;
- timeout/deadline handling;
- cycle detection;
- bounded memoization;
- deterministic ordering where useful;
- observability;
- failure classification;
- security/tenant boundaries.

---

# 12. Testing Requirements

Every capstone should test:

```text
empty input
single element
normal case
boundary case
invalid input
no solution
many solutions
duplicate state
cycle
maximum allowed depth
resource exhaustion
cancellation
```

Where practical, compare recursive and iterative implementations.

---

# 13. Interview Defense

For any recursive solution, be able to answer:

```text
Why recursion?
What is the state?
Why this base case?
How do you prove termination?
What is the recurrence?
What is the depth?
What is total work?
Can states repeat?
Why is pruning safe?
Why does memoization work?
What is the iterative alternative?
What happens with adversarial input?
```

---

# 14. Expert Failure Checklist

If a recursive implementation fails, inspect:

```text
state
base case
progress
transition
invariant
return/combine
mutation
restoration
memo key
pruning
resource limits
```

Do not immediately rewrite the function. Locate the broken abstraction first.

---

# 15. Phase 04 Final Mental Model

```text
RECURSION
│
├── State
│   ├── minimal
│   ├── canonical
│   └── future-relevant
│
├── Control
│   ├── base case
│   ├── progress
│   └── transitions
│
├── Correctness
│   ├── invariant
│   ├── induction
│   └── termination
│
├── Complexity
│   ├── depth
│   ├── total work
│   ├── allocation
│   └── output
│
├── Optimization
│   ├── pruning
│   ├── memoization
│   └── DP
│
└── Engineering
    ├── stack safety
    ├── cancellation
    ├── budgets
    ├── observability
    ├── security
    └── execution strategy
```

---

# 16. Final Mastery Test

You have passed Phase 04 when you can take an unfamiliar problem and independently produce:

```text
1. Problem model
2. Recursive state
3. Base cases
4. Progress proof
5. Transition design
6. Correctness invariant
7. Recursive implementation
8. Complexity derivation
9. Optimization strategy
10. Iterative alternative
11. Production constraints
12. Test strategy
13. Interview explanation
```

without copying a memorized solution.

---

# 17. Transition to Phase 05

Phase 04 establishes recursion as a general reasoning tool.

The next phase applies that foundation to **Linked Lists**, where pointer-based recursive and iterative reasoning becomes a central data-structure skill.

The progression is:

```text
Recursion
 ↓
State + pointer reasoning
 ↓
Linked Lists
 ↓
Stacks / Queues
 ↓
Hashing
```

# Key Takeaways

1. Recursion is a model of computation, not merely a syntax pattern.
2. State design determines whether a recursive solution is correct and optimizable.
3. Base cases and progress establish termination.
4. Invariants and recursive contracts establish correctness.
5. Complexity requires separate reasoning about depth, work, allocation, and output.
6. Repeated states create opportunities for memoization and dynamic programming.
7. Search problems require explicit reasoning about pruning and branching.
8. Production recursion requires stack safety, resource limits, cancellation, and observability.
9. The best recursive design may ultimately be implemented iteratively.
10. True mastery is the ability to derive and defend the solution to an unfamiliar problem.
