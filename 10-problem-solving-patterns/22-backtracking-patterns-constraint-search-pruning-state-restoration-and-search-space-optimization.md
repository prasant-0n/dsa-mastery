# 10.22 — Backtracking Patterns: Constraint Search, Pruning, State Restoration & Search-Space Optimization

## 1. Objective

Backtracking systematically explores a search space while abandoning partial states that cannot lead to a valid or better solution.

```text
choose
→ validate
→ recurse
→ undo
→ try next choice
```

The central skill is designing a correct state transition and proving when pruning is safe.

## 2. Why It Exists

Many combinatorial problems have too many possible solutions to enumerate blindly. Backtracking keeps exhaustive correctness while reducing work through constraints and early rejection.

## 3. Search-Tree Mental Model

Each recursive call represents a node in a search tree. Each candidate decision creates a child state.

The full tree may be exponential, but pruning can eliminate large portions.

## 4. State Design

A backtracking state should contain exactly the information needed to determine:

- available choices;
- constraint validity;
- completion;
- objective or partial result.

Avoid storing redundant state unless it improves verified performance.

## 5. Choice → Explore → Undo

The canonical structure is:

```text
for each choice:
  apply choice
  if valid:
    recurse
  undo choice
```

State restoration is mandatory when mutable state is reused across branches.

## 6. Base Cases

A base case occurs when the partial state is complete or no further decisions are possible.

The base case must distinguish a complete valid solution from a dead end.

## 7. Permutations

For permutations, choose one unused element at each depth.

A `used` structure or in-place swapping can represent the state.

The search explores `N!` leaves before accounting for pruning.

## 8. Combinations

For combinations, enforce increasing choice indices so the same subset is not generated in different orders.

This symmetry-breaking constraint reduces duplicate branches.

## 9. Subsets

Each element can create two branches:

```text
include
exclude
```

The search tree has approximately `2^N` leaves.

## 10. Combination Sum

When choices can be reused or have bounded multiplicity, the recursive index transition must encode that exact rule.

Incorrectly advancing or retaining the same index changes the problem.

## 11. Constraint Propagation

Before descending into a branch, update the constraints implied by the chosen value.

This can reduce future candidate sets and provide earlier failure detection.

## 12. N-Queens

Place one queen per row while maintaining column and diagonal constraints.

A set or bitmask can make constraint checks constant-time under a bounded board size.

## 13. Sudoku-Style Search

Choose an unfilled cell, try candidates satisfying row/column/region constraints, recurse, then restore.

Selecting the most constrained cell first is a powerful branching heuristic.

## 14. Minimum Remaining Values

Choose the variable with the fewest currently legal values.

This heuristic often detects contradictions earlier, though it does not by itself prove an asymptotic improvement for every problem.

## 15. Forward Checking

After assigning a variable, remove the selected value from relevant future domains.

If any domain becomes empty, backtrack immediately.

## 16. Constraint Graphs

Represent variables as vertices and constraints as edges or higher-order relations.

Graph structure can guide variable ordering and propagation.

## 17. Branch Ordering

If the goal is to find one solution quickly, trying promising candidates first can greatly affect practical runtime.

For proving optimality, branch ordering improves search order but does not replace a valid bound.

## 18. Branch and Bound

For optimization problems, compute an optimistic bound on what a partial state could achieve.

If the bound cannot beat the current best solution, prune the branch.

## 19. Safe Pruning

A pruning rule is correct only when it proves that no completion of the current state can produce an acceptable solution.

Aggressive but unjustified pruning turns an exhaustive algorithm into an incorrect heuristic.

## 20. Duplicate Avoidance

Sorted input plus same-depth duplicate skipping can avoid generating equivalent branches.

Be precise about whether duplicates should be removed globally, per depth, or not at all.

## 21. Memoization + Backtracking

If different paths reach the same future state, memoization can avoid repeated exploration.

The memoization key must contain every state component that affects future possibilities.

## 22. Bitmask Backtracking

For small universes, bitmasks compactly encode used resources, visited vertices, or selected features.

This can reduce allocation and simplify state keys.

## 23. Iterative Backtracking

A recursive search can be transformed into an explicit stack storing:

- current state;
- next choice index;
- restoration information.

This avoids call-stack depth limits at the cost of more explicit bookkeeping.

## 24. Stack-Safe Engineering

JavaScript recursion depth is finite in practice. Large search trees may require iterative implementations or carefully bounded depth.

Stack safety is separate from algorithmic time complexity.

## 25. Exact Cover

Problems such as exact cover can be represented as constraint satisfaction systems where each decision satisfies some constraints and restricts remaining choices.

Column/variable selection heuristics can dramatically reduce practical search.

## 26. Graph Coloring

Assign colors to vertices while rejecting assignments that violate adjacency constraints.

Ordering vertices by constraint degree or remaining options can improve search.

## 27. Hamiltonian-Style Search

Track the current path and visited vertices. A bitmask is useful for small graphs.

Pruning can use degree, connectivity, or remaining-capacity constraints when logically safe.

## 28. Word Search / Grid Search

Track position, visited cells, and target-progress state. Avoid revisiting cells when the problem requires simple paths.

## 29. Expression Generation / Parsing

Backtracking can enumerate syntactic choices such as operator placements or partition points.

Memoization may help when the same substring/state is repeatedly evaluated.

## 30. Correctness Proof

A backtracking proof should establish:

1. every valid solution corresponds to at least one explored path;
2. every explored terminal solution satisfies the constraints;
3. every pruning rule removes only states that cannot lead to a required solution;
4. state restoration returns the parent state exactly;
5. termination occurs after finite choices.

## 31. Complexity

Worst-case backtracking is commonly exponential or factorial:

```text
subsets: O(2^N)
permutations: O(N!)
```

Real runtime depends heavily on branching factor, depth, constraint propagation, symmetry breaking, and pruning.

## 32. Common Mistakes

1. Forgetting to undo mutable state.
2. Pruning without proof.
3. Generating duplicate branches.
4. Using incomplete memoization keys.
5. Confusing optimization bounds with feasibility checks.
6. Ignoring recursion depth.
7. Mutating shared structures incorrectly.
8. Reporting average observed runtime as a worst-case guarantee.

## 33. Edge Cases

Test:

- empty input;
- no candidates;
- already complete state;
- immediate contradiction;
- one valid solution;
- many solutions;
- duplicate values;
- maximum depth;
- highly constrained state;
- unconstrained state.

## 34. Backend Applications

Backtracking can support:

- rule/configuration generation;
- resource assignment;
- dependency resolution;
- test-case generation;
- scheduling under complex constraints;
- workflow planning.

## 35. AI Applications

Applications include:

- constrained generation;
- symbolic search;
- structured decoding;
- planning under discrete constraints;
- feature/subset selection;
- combinatorial optimization.

In AI systems, heuristic pruning should be clearly distinguished from exact search.

## 36. Testing Strategy

Use:

- brute-force reference implementations for small instances;
- state-restoration assertions;
- solution-validity checks;
- exhaustive-vs-pruned differential tests;
- randomized constraint instances;
- duplicate-heavy cases;
- branch-and-bound bound validation;
- recursion-depth tests.

## 37. Interview Framework

When backtracking appears:

```text
1. What is the decision at each depth?
2. What is the complete state?
3. What choices are available?
4. When is a state invalid?
5. What can be pruned safely?
6. What must be restored?
7. Can symmetry be broken?
8. Can memoization merge repeated states?
9. What is the branching factor and depth?
10. Can the recursion be made stack-safe?
```

## 38. Revision Checklist

- [ ] I can design a search-tree state.
- [ ] I understand choose/explore/undo.
- [ ] I can solve permutations/combinations/subsets.
- [ ] I can reason about constraint propagation.
- [ ] I understand N-Queens/Sudoku-style search.
- [ ] I can distinguish safe pruning from heuristics.
- [ ] I understand branch and bound.
- [ ] I can combine backtracking with memoization.
- [ ] I can use bitmask state.
- [ ] I can explain backend and AI applications.

## 39. Key Takeaways

1. **Backtracking is systematic search plus state restoration and safe pruning.**
2. **The state representation determines whether the search is correct and whether repeated work can be memoized.**
3. **Pruning requires a proof that the removed branch cannot produce a required solution.**
4. **Branch ordering and heuristics can improve practical performance without changing correctness when they only affect exploration order.**
5. **Worst-case combinatorial growth remains exponential/factorial unless stronger structure, memoization, or problem-specific algorithms reduce the search space.**
