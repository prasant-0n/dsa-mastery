# 04.11 — Backtracking Fundamentals & Constraint Search

## Purpose

Backtracking is systematic search over a space of possible decisions.

It extends the choice-recursion pattern from the previous chapter:

```text
choose
→ make choice
→ check constraints
→ recurse
→ undo choice
```

The key idea is not simply “try everything.” It is:

> Explore a structured decision space while rejecting impossible partial states as early and safely as possible.

This chapter establishes the foundation for N-Queens, Sudoku, maze search, combination problems, constraint satisfaction, and many AI search problems.

---

# 1. Backtracking Mental Model

Imagine constructing a solution one decision at a time:

```text
partial solution
       ↓
choose next option
       ↓
valid?
  ↙         ↘
no           yes
prune       recurse
              ↓
           continue
```

When a branch cannot produce a valid solution, stop exploring it.

---

# 2. Search Space

Every possible sequence of decisions forms a search space.

For example, choosing values for three positions might produce:

```text
             start
          /    |    \
         A     B     C
       / | \ / | \ / | \
      ...
```

Backtracking navigates this implicit tree without necessarily materializing the entire tree.

---

# 3. State

A backtracking state should answer:

```text
What has already been decided?
What remains undecided?
What constraints currently hold?
What partial solution exists?
```

Typical state:

```text
index + path
```

or:

```text
row + board + constraint sets
```

---

# 4. Candidate Choices

At each state, determine the legal next choices.

Conceptually:

```text
for choice in candidates(state):
    if legal(choice, state):
        apply(choice)
        search(nextState)
        undo(choice)
```

The candidate-generation rule can dramatically affect performance.

---

# 5. Constraints

A constraint determines whether a partial solution remains viable.

Examples:

```text
no duplicate value
sum ≤ target
queen cannot attack another queen
cell must contain an allowed digit
vertex cannot be revisited
resource capacity must not be exceeded
```

Constraints are the main source of pruning.

---

# 6. Hard vs Soft Constraints

A **hard constraint** must never be violated.

A **soft constraint** expresses preference or cost.

Classic backtracking generally handles hard constraints.

Optimization search can add an objective function for soft preferences.

---

# 7. Feasibility Before Recursion

The most important optimization is often:

```text
reject invalid state BEFORE recursing
```

Bad:

```text
recurse deeply
then discover violation
```

Better:

```text
check constraint
→ recurse only if viable
```

This reduces the search tree without changing the exact answer.

---

# 8. Safe Pruning

A pruning rule is correct only if:

> Every solution that could exist below the current state is impossible once the pruning condition is true.

For example, if a positive-only combination problem already has a sum greater than the target, further additions cannot recover feasibility.

That is a proof-based pruning rule.

---

# 9. Unsound Pruning

This is dangerous:

```text
“This branch looks unlikely, so skip it.”
```

Unless the branch is mathematically impossible, exact correctness is lost.

Backtracking is an exact algorithmic method; heuristic pruning must be explicitly identified as heuristic.

---

# 10. Base Cases

Typical terminal states:

```text
complete solution
no candidates remain
constraint violation
requested depth reached
all variables assigned
```

A terminal state can represent:

```text
success
failure
partial result
```

The return contract must distinguish them clearly.

---

# 11. Search for One Solution

If the goal is one solution, return immediately after success.

Conceptually:

```text
if search(choice):
    return true
```

This can avoid exploring the remaining search tree.

The worst case may remain exponential, but practical work can be much smaller.

---

# 12. Enumerating All Solutions

If every solution is required, successful branches cannot terminate the entire search.

Instead:

```text
record solution
continue exploring siblings
```

Output size can itself be exponential or worse.

---

# 13. Counting Solutions

A counting backtracker returns:

```text
sum of valid child counts
```

It does not need to materialize every solution.

However, the search may still visit a large portion of the state space unless memoization or stronger pruning applies.

---

# 14. Optimization Search

Optimization asks:

```text
Which valid solution is best?
```

State may include:

```text
current objective
best objective found
```

A branch can be pruned if an upper/lower bound proves it cannot beat the current best.

This is the conceptual bridge to branch-and-bound.

---

# 15. Backtracking Invariant

For a shared mutable path:

> Immediately before entering a recursive call, the path contains exactly the decisions represented by that child state.

After returning:

> The path must be restored exactly to the parent state.

This is the central mutation invariant.

---

# 16. Apply / Recurse / Undo

Canonical structure:

```text
apply(choice)
search()
undo(choice)
```

Example:

```js
path.push(choice);
search(next);
path.pop();
```

If `pop()` is skipped, sibling branches inherit incorrect state.

---

# 17. Copying Instead of Undoing

An alternative is:

```js
search([...path, choice]);
```

This simplifies ownership because each call receives its own path.

Trade-off:

```text
copying → simpler state ownership, more allocation
undoing  → fewer allocations, stricter invariant
```

Both are legitimate designs.

---

# 18. Constraint Tracking Structures

Efficient backtracking often maintains auxiliary state.

Examples:

```text
Set → used values
Set → occupied columns
Set → occupied diagonals
boolean array → used resources
bitmask → compact constraint state
```

The goal is to test legality cheaply.

---

# 19. N-Queens Example

Place one queen per row.

For each row, choose a column.

A placement is legal when:

```text
column unused
main diagonal unused
anti-diagonal unused
```

Then:

```text
place queen
→ recurse to next row
→ remove queen
```

The board is a constraint state.

---

# 20. Sudoku Example

At each empty cell:

```text
try a legal digit
→ update row/column/box constraints
→ recurse
→ undo digit
```

Choosing the next cell intelligently can greatly reduce branching.

---

# 21. Variable Ordering

In constraint satisfaction, not all undecided variables are equally useful.

A powerful heuristic is:

> Choose the variable with the fewest legal values remaining.

This is often called **minimum remaining values (MRV)**.

The principle is simple:

```text
fail early
```

---

# 22. Value Ordering

Choice order also matters.

Examples:

```text
try restrictive values first
try promising candidates first
try smallest value first for lexicographic output
```

Ordering usually changes performance or output order, not correctness, provided all legal choices are eventually considered.

---

# 23. Forward Checking

After assigning a variable, inspect future variables.

If another variable has no legal value remaining, backtrack immediately.

Conceptually:

```text
make assignment
→ update future domains
→ if any domain becomes empty: undo immediately
```

This is stronger than waiting for a deeper recursive level to discover the contradiction.

---

# 24. Constraint Propagation

Constraint propagation repeatedly derives consequences from current assignments.

For example:

```text
A = 5
→ B cannot be 5
→ C cannot be 5
→ if B now has one option, assign it
```

Propagation can reduce the search space before branching.

---

# 25. Backtracking vs Brute Force

Brute force may:

```text
generate every possibility
→ test complete solutions
```

Backtracking:

```text
build partial solution
→ reject impossible prefixes
→ avoid their descendants
```

Backtracking is therefore structured brute force with early constraint reasoning.

---

# 26. Complexity

Worst-case backtracking is frequently exponential:

```text
O(b^d)
```

where:

```text
b = branching factor
d = search depth
```

But this is a model, not a universal exact formula.

Branching can change by level, and pruning can dramatically reduce actual nodes visited.

---

# 27. Search Tree Node Count

For branching factors `b1, b2, ..., bd`, the number of nodes is more accurately related to:

```text
1
+ b1
+ b1b2
+ b1b2b3
+ ...
```

This is useful when choices shrink as the search progresses.

For permutations, for example, branching changes from `N` to `N-1` to `N-2`, etc.

---

# 28. Space Complexity

Separate:

```text
recursion stack
current partial solution
constraint structures
output
```

A search may have exponential time while using only O(d) active recursion depth plus auxiliary state.

If all solutions are stored, output space may dominate.

---

# 29. Memoization Connection

Backtracking can revisit equivalent logical states.

If future possibilities depend only on a compact state, cache the result.

Then the algorithm becomes:

```text
state
→ check cache
→ otherwise explore choices
→ cache result
```

This is the bridge from backtracking to dynamic programming.

---

# 30. Canonical State Representation

Memoization only works if equivalent states map to the same key.

For example:

```text
remainingIndex + remainingCapacity
```

may define a canonical state.

A full path may contain irrelevant historical information.

State compression is therefore critical.

---

# 31. Branch-and-Bound

Optimization search can maintain a bound.

Example:

```text
best known score = 100
current branch maximum possible score = 90
```

The branch cannot win, so prune it.

The bound must be optimistic in the appropriate direction:

```text
maximization → upper bound
minimization → lower bound
```

---

# 32. Determinism

Backtracking is usually deterministic if:

```text
candidate order is deterministic
constraints are deterministic
```

This is valuable for testing and debugging.

Randomized choice ordering can improve expected performance but complicates reproducibility unless a controlled seed is used.

---

# 33. Debugging Backtracking

When debugging, log:

```text
current depth
current state
choice applied
constraint result
recursive result
choice undone
```

The most common bug is not the recursive call itself; it is incorrect state restoration.

---

# 34. Backend Applications

Constraint search can model:

- scheduling;
- resource assignment;
- dependency selection;
- configuration generation;
- routing alternatives;
- rule combinations;
- capacity-constrained allocation.

Production systems should impose bounded search and cancellation rather than assume the search will finish quickly.

---

# 35. AI Applications

Backtracking and constraint search connect directly to:

- planning;
- symbolic search;
- program synthesis;
- structured candidate generation;
- puzzle solving;
- constraint satisfaction;
- combinatorial optimization.

Modern AI systems often combine search with heuristics, scoring, caching, and pruning.

---

# 36. Production Resource Controls

For potentially large state spaces, consider:

```text
maximum depth
maximum nodes explored
time deadline
memory budget
cancellation signal
best-so-far result
progress metrics
```

A theoretically correct algorithm can still be operationally unsafe without resource limits.

---

# 37. Design Procedure

```text
1. Define the state.
2. Define all legal choices.
3. Define hard constraints.
4. Define terminal success/failure.
5. Apply one choice.
6. Update constraint state.
7. Prune impossible states.
8. Recurse.
9. Undo all state changes.
10. Decide search/count/generation/optimization semantics.
11. Look for repeated states.
12. Analyze branching and depth.
13. Add resource limits when needed.
```

---

# 38. Interview Explanation Template

> “I model the problem as a constraint-search tree. Each recursive state represents a partial assignment and the remaining decisions. I enumerate legal choices, apply one, validate constraints, recurse, and restore the state afterward. I prune only when a branch is provably unable to produce a valid solution. The worst-case search is exponential in the branching/depth model, while the actual work depends heavily on constraint propagation and pruning.”

---

# 39. Revision Checklist

- [ ] Can I define backtracking precisely?
- [ ] Can I model a problem as a state-space tree?
- [ ] Can I define legal choices?
- [ ] Can I separate hard constraints from preferences?
- [ ] Can I implement choose → recurse → undo?
- [ ] Can I maintain a restoration invariant?
- [ ] Can I distinguish safe and unsound pruning?
- [ ] Can I search for one solution?
- [ ] Can I enumerate all solutions?
- [ ] Can I count solutions?
- [ ] Can I formulate optimization search?
- [ ] Can I explain MRV and forward checking?
- [ ] Can I identify memoization opportunities?
- [ ] Can I derive branching/depth complexity?
- [ ] Can I separate stack, auxiliary state, and output space?
- [ ] Can I apply constraint search to backend and AI problems?

# Key Takeaways

1. Backtracking is structured state-space search.
2. Its core cycle is choose → apply → recurse → undo.
3. Constraints allow impossible branches to be rejected early.
4. Pruning must be logically safe for exact algorithms.
5. State invariants are essential when mutable state is shared.
6. Search, generation, counting, and optimization have different termination/return contracts.
7. Variable ordering, value ordering, forward checking, and propagation can dramatically reduce search.
8. Worst-case complexity is often exponential, but actual work depends strongly on branching and pruning.
9. Equivalent states can create memoization opportunities.
10. Production search needs explicit depth, time, memory, and cancellation controls.
