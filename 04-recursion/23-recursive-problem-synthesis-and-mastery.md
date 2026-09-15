# 04.23 — Recursive Problem Synthesis & Mastery

## Purpose

This chapter is the synthesis layer of the recursion phase. The goal is no longer to recognize individual recursion patterns, but to derive a recursive solution from a new problem, prove it, analyze it, optimize it, and decide whether recursion is actually the right execution strategy.

> Mastery means deriving the state and recurrence from the problem—not memorizing recursive templates.

---

# 1. The Universal Recursive Model

Most recursive problems can be reduced to:

```text
state
→ terminal test
→ generate subproblems
→ solve subproblems
→ combine / propagate result
```

The implementation is secondary to correctly defining this model.

---

# 2. Step One — Identify Structure

Ask what the input really is:

```text
sequence
hierarchy
search space
graph
expression
state space
```

Recursion is especially natural when the problem contains nested or self-similar structure.

---

# 3. Step Two — Define the State

The recursive parameters should represent the remaining problem.

Ask:

```text
What information determines all future choices?
What information is derivable?
What information is irrelevant?
```

Minimal state reduces complexity and makes correctness easier to prove.

---

# 4. Step Three — Define Base States

A base state should be:

- unambiguous;
- reachable;
- directly solvable;
- consistent with the recursive contract.

If a base case cannot be reached, the algorithm is incomplete.

---

# 5. Step Four — Define Progress

A recursive call must move toward termination.

Possible progress measures include:

```text
index increases
range shrinks
depth decreases
remaining capacity decreases
unassigned variables decrease
input structure becomes smaller
```

For multi-parameter recursion, lexicographic or other well-founded measures may be required.

---

# 6. Step Five — Define the Transition

For each state, determine the next states.

Examples:

```text
one recursive child
multiple children
left/right halves
include/exclude
choose/unchoose
```

The transition must preserve the problem's validity invariant.

---

# 7. Step Six — Choose Information Flow

Decide whether information travels:

### Downward
Parameters/context are passed into recursive calls.

### Upward
Child return values are combined by the parent.

### Accumulated
A running result is carried through the recursion.

### Shared
Mutable state is modified and restored.

Choose deliberately rather than mixing styles accidentally.

---

# 8. Step Seven — Write the Recurrence

Describe the result mathematically before coding.

For example:

```text
T(n) = T(n - 1) + O(1)
```

or:

```text
T(n) = 2T(n/2) + O(n)
```

This separates algorithm design from syntax.

---

# 9. Step Eight — Analyze the Recursion Tree

For branching recursion, ask:

```text
How many children per state?
How deep can the tree become?
How much work occurs per level?
Are states repeated?
```

The raw tree may overestimate work when states converge and memoization is possible.

---

# 10. Step Nine — Distinguish Tree from Graph

If two recursive paths can reach the same state, the computational structure is a graph, not merely a tree.

This immediately raises:

```text
visited?
memoization?
canonical state?
cycle handling?
```

---

# 11. Step Ten — Prove Correctness

A practical recursive proof contains:

### Base case
The answer is correct for terminal states.

### Recursive assumption
Assume recursive calls correctly solve smaller valid states.

### Combine step
Show that correct child results produce the correct parent result.

### Termination
Show that recursive calls eventually reach terminal states.

---

# 12. Invariants

An invariant states what remains true at every recursive level.

Examples:

```text
all selected elements satisfy constraints
cursor points to first unprocessed item
current path is valid
memo contains correct completed states
```

Strong invariants simplify both implementation and debugging.

---

# 13. Edge-Case Matrix

Before implementation, classify:

```text
empty input
single element
minimum valid input
maximum practical input
invalid input
already solved input
no solution
many solutions
duplicate values
cycles
extreme depth
```

Recursive bugs often hide at boundaries rather than normal cases.

---

# 14. Brute Force First

Start with the simplest correct recursion.

This reveals:

- state;
- transitions;
- correctness;
- baseline complexity.

Only then optimize.

---

# 15. Optimization Ladder

A useful progression is:

```text
naive recursion
→ remove unnecessary copying
→ improve state
→ prune impossible branches
→ memoize repeated states
→ transform to DP/graph algorithm
→ replace stack if necessary
```

Do not jump directly to sophisticated optimization without understanding the baseline.

---

# 16. Pruning vs Optimization

Pruning changes the explored search space.

An optimization should preserve correctness unless explicitly classified as approximate.

For every pruning rule ask:

```text
Why can this branch never produce a valid/better answer?
```

If that cannot be explained, the pruning rule is suspect.

---

# 17. Memoization Decision

Memoize when:

```text
states repeat
AND
state results are deterministic
AND
memoization cost is worthwhile
```

Do not memoize merely because recursion exists.

---

# 18. Canonical State

Equivalent states should have equivalent keys.

A poor key can cause:

```text
false misses → wasted work
or
false hits → incorrect results
```

Correctness comes before cache efficiency.

---

# 19. Output-Sensitive Complexity

If an algorithm generates all solutions, output itself may be enormous.

For example:

```text
N subsets → 2^N outputs
N permutations → N! outputs
```

You cannot generally claim constant-space output if all results must be retained.

---

# 20. Search vs Generation vs Optimization

These are different problem types.

### Search
Find one valid solution.

### Generation
Produce all valid solutions.

### Counting
Count solutions without producing them.

### Optimization
Find the best solution under an objective.

The correct return representation and pruning strategy depend on this classification.

---

# 21. Recursion vs Dynamic Programming

Use recursive memoization when it naturally explores reachable states.

Use bottom-up DP when:

- dependency order is known;
- recursion depth is problematic;
- dense state tables are efficient;
- iteration improves memory/control.

The underlying state graph matters more than the syntax.

---

# 22. Recursion vs Graph Algorithms

If the problem has explicit graph semantics, use graph concepts:

- visited sets;
- active-path detection;
- topological ordering;
- shortest-path algorithms;
- connected components.

Do not force a graph into a tree recursion model.

---

# 23. Recursion vs Backtracking

Backtracking is recursive search with state modification and restoration.

Use it when:

```text
choices
+ constraints
+ partial state
+ search
```

are central to the problem.

---

# 24. Recursion vs Divide and Conquer

Divide and conquer is appropriate when:

```text
problem splits into independent smaller problems
```

and their results can be combined efficiently.

If subproblems overlap heavily, memoization/DP may be more appropriate.

---

# 25. Recursion vs Iteration

Choose iteration when:

- depth may be huge;
- stack usage is unsafe;
- cancellation/pause-resume matters;
- execution must be explicitly scheduled.

Choose recursion when its structural clarity outweighs those concerns and depth is controlled.

---

# 26. Backend Classification

For backend problems, classify recursive work by external effects:

```text
pure CPU traversal
DB traversal
network traversal
workflow execution
search/planning
```

A recursive CPU algorithm and recursive network workflow have very different engineering constraints.

---

# 27. AI Classification

For AI problems, identify whether recursion represents:

```text
AST hierarchy
search tree
planning state space
symbolic expression
document hierarchy
program generation
```

Then identify whether exactness or approximation is required.

---

# 28. Resource Model

A complete analysis should consider:

```text
CPU
call stack
heap
output size
I/O
network
database
model/token cost
```

Asymptotic time alone is insufficient for production algorithms.

---

# 29. Debugging Recursive Algorithms

When output is wrong, inspect in this order:

```text
1. State definition
2. Base case
3. Progress
4. Child-state construction
5. Return/combine logic
6. Mutation/restoration
7. Memoization key
8. Pruning rule
```

Most recursive bugs are state bugs rather than syntax bugs.

---

# 30. Interview Problem-Solving Template

When given a new recursive problem:

```text
1. Restate the problem.
2. Identify the recursive structure.
3. Define the smallest useful state.
4. Define base cases.
5. Define progress.
6. Define transitions.
7. Write brute-force recursion.
8. State correctness invariant.
9. Derive complexity.
10. Identify repeated states.
11. Add pruning/memoization if justified.
12. Re-analyze complexity.
13. Discuss stack and memory.
14. Give iterative alternative if relevant.
```

---

# 31. Mastery Test

You have recursion mastery when you can take an unfamiliar problem and answer:

```text
What is the state?
What is the base case?
What is the progress measure?
What are the transitions?
What invariant is preserved?
What is the recurrence?
What is the recursion depth?
How much total work occurs?
Are states repeated?
Can I prune safely?
Can I memoize?
Should I use iteration instead?
```

without relying on a memorized solution.

---

# 32. Common Failure Modes

1. Writing recursion before defining state.
2. Choosing too much state.
3. Choosing too little state.
4. Missing a reachable base case.
5. Failing to make progress.
6. Copying large structures at every level.
7. Mutating shared state without restoration.
8. Memoizing an incomplete state.
9. Using unsound pruning.
10. Ignoring output complexity.
11. Confusing depth with total work.
12. Ignoring stack limits.
13. Treating graphs as trees.
14. Treating heuristics as correctness proofs.

---

# 33. Expert Synthesis Principle

The progression to remember is:

```text
Problem
 ↓
Structure
 ↓
State
 ↓
Base cases
 ↓
Progress
 ↓
Transitions
 ↓
Invariant
 ↓
Recurrence
 ↓
Complexity
 ↓
Optimization
 ↓
Execution strategy
```

This is the reusable mental model for unfamiliar recursive problems.

---

# 34. Revision Checklist

- [ ] Can I derive recursive state from an unfamiliar problem?
- [ ] Can I define reachable base cases?
- [ ] Can I prove progress and termination?
- [ ] Can I derive the transition relation?
- [ ] Can I choose return vs accumulator vs shared state?
- [ ] Can I write the recurrence?
- [ ] Can I distinguish depth from total work?
- [ ] Can I recognize tree vs graph state spaces?
- [ ] Can I identify overlapping states?
- [ ] Can I design canonical memo keys?
- [ ] Can I prove pruning safety?
- [ ] Can I reason about output-sensitive complexity?
- [ ] Can I decide recursion vs iteration?
- [ ] Can I connect recursion to backend workloads?
- [ ] Can I connect recursion to AI search and structured processing?
- [ ] Can I defend the complete solution in an interview?

# Key Takeaways

1. Recursion mastery is state-design mastery.
2. Every recursive solution needs a reachable terminal condition and a proof of progress.
3. Correctness comes from invariants and the recursive contract, not from the recursive syntax.
4. Complexity requires analyzing depth, total work, allocation, and output separately.
5. Repeated states signal a graph structure and often a memoization/DP opportunity.
6. Pruning requires a correctness argument; heuristics do not automatically provide one.
7. The best recursive solution may ultimately become a DP, graph algorithm, explicit stack, or iterative state machine.
8. Backend and AI recursion must account for external resources and operational limits.
9. An expert derives a solution instead of recalling a template.
10. The final skill is choosing the correct algorithm and execution strategy for the actual problem.
