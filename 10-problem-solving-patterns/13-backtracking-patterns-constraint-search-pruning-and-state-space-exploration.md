# 10.13 — Backtracking Patterns: Constraint Search, Pruning & State-Space Exploration

## 1. Objective

Backtracking systematically explores a combinatorial state space while abandoning a partial candidate as soon as it cannot lead to a valid solution.

```text
choose
→ validate constraint
→ recurse
→ undo choice
→ try next choice
```

## 2. Why Backtracking Exists

Many problems require exploring combinations, permutations, assignments, or configurations where local choices cannot safely eliminate all alternatives.

Backtracking provides exhaustive search with principled pruning.

## 3. State-Space Model

Represent each partial solution as a state.

Define:

- current state;
- available choices;
- transition;
- constraint predicate;
- completion predicate;
- undo operation.

## 4. Core Template

```text
search(state):
    if complete(state): record solution
    for choice in choices(state):
        if feasible(state, choice):
            apply(choice)
            search(state)
            undo(choice)
```

Correctness depends on exploring every feasible branch and restoring state exactly.

## 5. Choice Ordering

Ordering choices does not necessarily change correctness, but it can dramatically affect practical search time.

Useful ordering can expose contradictions early or find a valid solution quickly.

## 6. Constraint Checking

A constraint should be checked as early as possible when the relevant information becomes available.

Early rejection reduces the explored state space.

## 7. Pruning

Pruning removes a branch when it is provably incapable of producing a valid required solution.

Examples:

- violated constraints;
- exceeded capacity;
- impossible remaining target;
- duplicate state;
- insufficient remaining resources.

## 8. Permutations

Permutation search chooses one unused element at each depth.

Typical state includes:

```text
current path + used set
```

The number of leaves can approach `N!`.

## 9. Combinations

Combination search usually imposes an increasing start index so the same subset is not generated in different orders.

This reduces duplicate branches structurally.

## 10. Subsets

At each element, choose:

```text
include
exclude
```

This creates up to `2^N` states/leaves before pruning.

## 11. Duplicate Handling

For duplicate values, decide whether outputs are value-distinct or index-distinct.

Sort-and-skip is a common strategy for avoiding duplicate result sets.

## 12. N-Queens Pattern

Place one queen per row while tracking columns and diagonals already occupied.

A candidate is rejected immediately if it conflicts with existing placements.

## 13. Sudoku-Style Constraint Search

Maintain row, column, and region constraints.

Choose an empty cell, try a legal value, recurse, and undo on failure.

Choosing the most constrained cell first can reduce branching substantially.

## 14. Constraint Propagation

After a choice, derive consequences before branching further.

Examples include:

- removing impossible candidates;
- updating domains;
- forcing singleton choices.

Propagation and backtracking complement each other.

## 15. Minimum Remaining Values

Choose the variable with the fewest legal values.

This heuristic attempts to expose contradictions early.

It is a search heuristic, so its benefit depends on the problem structure.

## 16. Branch and Bound

Maintain a bound on the best possible completion of the current partial state.

If the bound cannot beat the current best solution, prune the branch.

Unlike basic constraint pruning, this targets optimization rather than only feasibility.

## 17. Feasibility vs Optimization

A feasibility backtracker stops when it finds a valid solution if any solution is sufficient.

An optimization backtracker must compare valid solutions or use a safe bound to prune inferior branches.

## 18. Memoized Backtracking

Different search paths may reach the same logical state.

If future behavior depends only on that state, memoization can avoid recomputing it.

The memoization key must contain every variable affecting future transitions.

## 19. Backtracking + Bitmask

A bitmask can compactly represent selected/used entities when the number of entities is small enough.

Operations can become efficient, but state count remains exponential in the number of represented entities.

## 20. Backtracking + DP

A search tree can sometimes be compressed into DP states when many branches reach equivalent states.

The transition remains the same; DP changes how repeated states are evaluated.

## 21. Backtracking + Sorting

Sorting can make duplicate skipping, bound calculations, and candidate ordering easier.

Sorting is a preprocessing cost and must be included in complexity analysis.

## 22. Backtracking + Binary Search

A monotone feasibility subproblem inside a search tree can sometimes use binary search to reduce candidate selection cost.

Only use this when the predicate's ordering assumptions are proved.

## 23. State Restoration

Mutable state must satisfy:

```text
state_before_branch
→ apply
→ recurse
→ exact restoration
→ state_before_next_branch
```

A restoration bug can silently corrupt every later branch.

## 24. Copy vs Mutate-and-Undo

Copying state simplifies ownership but may add substantial time and memory costs.

Mutate-and-undo can be faster but requires stronger invariants.

Choose based on state size and implementation risk.

## 25. Search Ordering

Common heuristics include:

- most constrained variable;
- largest impact first;
- smallest remaining capacity;
- promising objective first.

These affect search performance but require no optimality claim unless they are used as pruning rules.

## 26. Symmetry Breaking

Equivalent configurations can be eliminated by imposing a canonical representation or fixing one symmetric choice.

This reduces duplicate exploration without removing genuinely distinct solutions.

## 27. Meet-in-the-Middle

For some exponential problems, split the input into two halves, enumerate each half, and combine the results.

This can transform approximately `2^N` enumeration into roughly `2^(N/2)` per side plus combination work.

## 28. Iterative Backtracking

Recursive backtracking can be transformed into an explicit stack containing:

- current state;
- next choice index;
- restoration metadata.

This avoids call-stack limits but makes control state explicit.

## 29. Correctness Proof

A backtracking proof should establish:

1. every valid solution has a corresponding search path;
2. every explored branch represents a legal partial state;
3. every pruned branch is provably incapable of producing a required solution;
4. state restoration preserves branch independence.

## 30. Complexity

Worst-case backtracking is often exponential or factorial.

Report:

```text
branching factor
× depth
× cost per node
```

Then separately explain pruning, memoization, preprocessing, and practical reductions.

## 31. Common Mistakes

1. Pruning without proof.
2. Forgetting to undo mutable state.
3. Using an incomplete memoization key.
4. Generating duplicate permutations/combinations.
5. Confusing heuristic ordering with correctness pruning.
6. Ignoring solution-output size.
7. Copying large state at every node without analyzing cost.
8. Claiming polynomial complexity for an exponential state space.

## 32. Edge Cases

Test:

- empty input;
- no feasible solution;
- one solution;
- many solutions;
- all duplicate values;
- maximum branching;
- immediate contradiction;
- deep search depth;
- mutable-state restoration failures;
- tied optimal solutions.

## 33. Backend Applications

Backtracking-style search can model:

- rule-based configuration;
- resource assignment;
- workflow constraint resolution;
- dependency planning;
- test-case generation;
- scheduling under hard constraints.

## 34. AI Applications

Backtracking connects directly to:

- symbolic planning;
- constraint satisfaction;
- combinatorial optimization;
- search-based reasoning;
- structured generation;
- candidate exploration.

Modern AI pipelines may combine learned heuristics with exact constraint checks; heuristic ordering should remain distinct from correctness-critical pruning.

## 35. Testing Strategy

Use:

- brute-force reference implementations for small inputs;
- solution-set comparison;
- property tests for constraints;
- restoration checks;
- duplicate-output checks;
- counterexamples for pruning rules;
- search-node instrumentation.

## 36. Interview Framework

When a combinatorial search problem appears:

```text
1. What is the state?
2. What choices exist at each state?
3. What makes a partial state infeasible?
4. What can be pruned safely?
5. What must be undone?
6. Are duplicate states possible?
7. Can memoization merge states?
8. Can symmetry reduce the search?
9. Can branch-and-bound help?
10. What are branching factor, depth, and per-node costs?
```

## 37. Revision Checklist

- [ ] I can write the choose/apply/recurse/undo pattern.
- [ ] I can distinguish pruning from heuristic ordering.
- [ ] I understand permutations, combinations, and subsets.
- [ ] I can prevent duplicate solutions.
- [ ] I can design constraint checks.
- [ ] I understand constraint propagation.
- [ ] I can apply branch and bound.
- [ ] I can identify memoizable states.
- [ ] I understand meet-in-the-middle.
- [ ] I can explain backend and AI applications.

## 38. Key Takeaways

1. **Backtracking is systematic state-space exploration with provably safe branch elimination.**
2. **The state representation and constraint model determine both correctness and search size.**
3. **Pruning must be logically safe; choice ordering is usually a performance heuristic.**
4. **Memoization, symmetry breaking, constraint propagation, and branch-and-bound can dramatically reduce practical search without changing the underlying search model.**
5. **Exact state restoration is a first-class invariant whenever mutable state is used.**
