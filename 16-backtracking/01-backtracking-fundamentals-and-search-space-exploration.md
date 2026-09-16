# 16.01 — Backtracking Fundamentals & Search-Space Exploration

## 1. Concept Definition

Backtracking is an exact search technique that incrementally constructs a candidate solution, explores it, and abandons the branch as soon as it cannot lead to a valid or useful solution.

```text
choose
→ explore
→ undo
→ choose another
```

It is systematic depth-first search over a decision space with pruning.

## 2. Why Backtracking Exists

Some problems cannot safely commit to one local choice.

When choices interact, an exact algorithm may need to explore multiple possibilities.

Backtracking makes this exploration structured and avoids continuing branches that are already impossible.

## 3. Search-Space Mental Model

Imagine every decision as an edge in a tree:

```text
                         root
                    /      |      \
                  A        B       C
                / | \     / \     / \
               ... ...   ... ...  ...
```

Each root-to-node path represents a partial solution.

## 4. Decision Variables

Most backtracking problems can be expressed as a sequence of decisions:

```text
x1, x2, x3, ..., xn
```

At depth `k`, the algorithm has assigned `x1 ... xk` and chooses a value for `x(k+1)`.

## 5. State

A backtracking state contains everything required to determine:

- which decisions have been made
- which choices remain
- whether the partial solution is valid
- whether the goal has been reached

Good state design makes pruning and correctness much easier.

## 6. Candidate Generation

At every node:

```text
candidates = generateChoices(state)
```

Then each candidate is tested before recursive exploration.

Candidate generation should avoid unnecessary work when possible.

## 7. Constraint Checking

The central pruning question is:

> Can this partial solution still be extended to a valid solution?

If the answer is definitely no, stop exploring that branch.

## 8. Backtracking Template

```text
search(state):
    if goal(state):
        record solution
        return

    for choice in candidates(state):
        if !valid(state, choice):
            continue

        apply(choice)
        search(nextState)
        undo(choice)
```

The `undo` operation restores the exact state that existed before the choice.

## 9. The Undo Operation

Backtracking depends on state restoration.

If a mutation is not undone correctly, later branches inherit incorrect state.

This is one of the most common implementation bugs.

## 10. In-Place vs Copying State

Two approaches are common:

```text
copy state → recurse
```

or:

```text
mutate state
→ recurse
→ undo mutation
```

Copying is simpler conceptually but may consume more time and memory.

In-place mutation is efficient but requires precise restoration.

## 11. Search Tree vs State Space

The conceptual search tree contains decisions.

Different paths may reach the same underlying state.

When repeated states exist, memoization or dynamic programming may reduce duplicated work.

## 12. DFS Connection

Backtracking is closely related to DFS.

The distinction is conceptual:

- DFS traverses a graph/tree.
- Backtracking searches a decision space and actively constructs and retracts choices.

Many implementations use recursive DFS.

## 13. Base Case

A base case identifies a completed assignment or terminal state.

Examples:

```text
index === n
board is complete
remaining items === 0
expression is complete
```

## 14. Solution Enumeration

Some problems require every valid solution.

The search must continue after finding one solution.

```text
record solution
return
```

is therefore different from:

```text
record solution
continue searching
```

## 15. First-Solution Search

If any valid solution is sufficient, stop at the first successful leaf.

The ordering of candidates can then dramatically affect practical runtime.

## 16. Optimization Search

Backtracking can also find an optimum by maintaining the best solution found so far.

```text
if complete:
    updateBest()
```

Pruning becomes stronger when a branch can be proven incapable of beating the incumbent.

## 17. Branch and Bound Preview

Suppose the current solution has value `v` and a safe upper bound `UB` on the best possible completion.

If:

```text
UB <= bestValue
```

the branch can be pruned.

This extends basic backtracking into branch and bound.

## 18. Feasibility Pruning

The simplest pruning rule is immediate constraint violation.

Examples:

- duplicate value where uniqueness is required
- row conflict in N-Queens
- capacity exceeded
- invalid partial expression

## 19. Bound Pruning

A bound estimates whether the branch can still achieve the objective.

Bounds must be safe.

An overly optimistic bound reduces pruning but preserves correctness.

An invalidly tight bound can incorrectly remove the optimum.

## 20. Symmetry

Many search spaces contain equivalent states.

For example, several arrangements may be equivalent under permutation or rotation.

Symmetry breaking can remove duplicate exploration while preserving required solutions.

## 21. Canonical Choices

A canonical construction rule can enforce one representative from each equivalent class.

This is a powerful way to reduce search without changing the mathematical answer.

## 22. Duplicate Avoidance

When candidates contain duplicates, naive recursion can generate duplicate solutions.

Typical strategy:

```text
sort candidates
→ skip equal candidates at the same recursion depth
```

The exact rule depends on whether duplicate values may be reused.

## 23. Permutation Search

For permutations, each position chooses one unused element.

Typical state:

```text
path
used[]
```

The search depth equals the number of chosen elements.

## 24. Combination Search

For combinations, order does not matter.

A `start` index prevents choosing earlier elements again.

```text
choose i
→ recurse from i + 1
```

## 25. Subset Search

Each element typically creates two branches:

```text
exclude
include
```

This creates approximately `2^n` leaves before pruning.

## 26. Constraint Satisfaction Problems

CSPs consist of:

- variables
- domains
- constraints

Backtracking assigns variables and rejects assignments that violate constraints.

Examples include Sudoku and N-Queens.

## 27. Variable Ordering

The order in which variables are assigned affects runtime.

A powerful heuristic is **minimum remaining values (MRV)**:

```text
choose the variable with the fewest legal values
```

This exposes contradictions earlier.

## 28. Value Ordering

After selecting a variable, the order of candidate values also matters.

A common heuristic is to try values likely to preserve future flexibility first.

This changes search order, not correctness, when all candidates remain eventually explored.

## 29. Forward Checking

After assigning a variable, remove incompatible values from neighboring domains.

If any domain becomes empty, prune immediately.

This is stronger than checking only the newly assigned variable.

## 30. Constraint Propagation

Repeatedly derive consequences from current assignments before branching.

Propagation can dramatically reduce the remaining search space.

The trade-off is additional computation per node.

## 31. Sudoku as a Model

Sudoku demonstrates the full framework:

```text
choose empty cell
→ candidate digits
→ validate row/column/box
→ place digit
→ recurse
→ undo
```

MRV and propagation make practical solving much faster than naive cell ordering.

## 32. N-Queens as a Model

Place one queen per row while tracking occupied columns and diagonals.

Useful state:

```text
columns
row - col
row + col
```

Each placement is checked in near-constant time with hash sets or boolean arrays.

## 33. Maze Search

Backtracking can explore paths through a maze while marking visited cells and undoing marks when returning.

For ordinary shortest-path problems, however, BFS or another graph algorithm is usually a more direct model.

## 34. Word Search

Word Search uses:

- current grid position
- target index
- visited state

A branch is pruned when the next character does not match.

## 35. Expression Construction

Expression-generation problems choose operators, operands, or partitions recursively.

State must include enough information to enforce syntax and objective constraints.

## 36. Partitioning

Backtracking can enumerate partitions by choosing the next segment boundary.

Pruning can use remaining length, ordering constraints, or target feasibility.

## 37. Exact Search and NP-Hard Problems

Many combinatorial problems have exponential worst-case search spaces.

Backtracking does not remove exponential worst-case complexity in general.

Its value is reducing practical work through pruning and good search order.

## 38. Complexity

For a branching factor `b` and depth `d`, a basic upper bound is roughly:

```text
O(b^d)
```

Actual complexity depends heavily on pruning, state cost, and the number of solutions produced.

## 39. Space Complexity

Recursive DFS uses stack space proportional to search depth:

```text
O(d)
```

Additional state structures and stored solutions can increase memory substantially.

## 40. Recursion Depth in JavaScript

JavaScript recursion depth is runtime-dependent and finite.

Deep search may require an explicit stack rather than recursive calls.

## 41. Iterative Backtracking

Recursive backtracking can be converted into an explicit stack containing frames such as:

```text
state
nextCandidateIndex
undoInformation
```

This avoids call-stack limits at the cost of more explicit bookkeeping.

## 42. Correctness Invariant

A useful invariant is:

> Before entering a recursive call, the state represents exactly the decisions along the current root-to-node path and satisfies all constraints checked so far.

After returning, the parent state must be restored exactly.

## 43. Completeness

If candidate generation includes every legal choice and pruning removes only impossible or provably inferior branches, backtracking explores every solution that can satisfy the problem.

This is the foundation of exactness.

## 44. Common Bugs

Watch for:

- missing undo
- wrong base case
- incorrect start index
- shared mutable state
- duplicate solutions
- pruning valid branches
- stale visited markers
- incorrect bound calculations

## 45. Backend Applications

Backtracking is useful when backend systems need exact search over small or constrained spaces:

- test configuration generation
- dependency resolution prototypes
- rule-set validation
- query-plan enumeration on small spaces
- resource assignment prototypes
- configuration compatibility

Production systems often combine search with memoization, bounds, or domain-specific pruning.

## 46. AI Applications

AI engineering uses backtracking-like search for:

- constrained tool planning
- structured generation
- symbolic reasoning
- small scheduling problems
- puzzle/search environments
- exact feature/configuration selection
- candidate sequence construction

Large AI search systems often add heuristics, beam search, memoization, or learned guidance.

## 47. Backtracking vs Greedy

Greedy commits to one local choice.

Backtracking preserves alternatives and can recover from bad choices.

```text
greedy: choose → never reconsider
backtracking: choose → explore → undo
```

## 48. Backtracking vs Dynamic Programming

If many branches reach identical states, memoization may eliminate repeated computation.

This is the bridge from naive backtracking toward dynamic programming.

## 49. Backtracking vs BFS

Use BFS when the problem is naturally a shortest-distance traversal in an unweighted state graph.

Use backtracking when the primary goal is systematic construction/enumeration of constrained combinations.

## 50. Master Workflow

```text
Define decisions
→ define state
→ generate choices
→ validate choice
→ apply
→ recurse
→ undo
→ prune
→ record solution
```

## 51. Implementation Lab

Implement from scratch:

1. subset generation
2. combination generation
3. permutation generation
4. duplicate-aware combinations
5. N-Queens
6. Sudoku solver
7. Word Search
8. maze path enumeration
9. target-sum search
10. partition generation
11. exact configuration search
12. iterative backtracking engine

For every implementation record:

- state representation
- branching factor
- pruning rule
- invariant
- complexity
- edge cases

## 52. Interview Framework

When solving a backtracking problem, explain:

1. decision being made
2. state
3. choices at each state
4. constraint check
5. base case
6. mutation
7. undo
8. pruning
9. complexity
10. why no valid solution is skipped

## 53. Revision Checklist

- [ ] Define backtracking precisely.
- [ ] Draw the search tree.
- [ ] Identify decision variables.
- [ ] Design minimal state.
- [ ] Generate all legal choices.
- [ ] Implement apply/undo correctly.
- [ ] Distinguish first-solution from all-solutions search.
- [ ] Add feasibility pruning.
- [ ] Understand branch and bound.
- [ ] Understand symmetry breaking.
- [ ] Understand duplicate avoidance.
- [ ] Know permutation vs combination state.
- [ ] Understand MRV and forward checking.
- [ ] Understand recursive vs iterative backtracking.
- [ ] Prove completeness and restoration invariants.
- [ ] Compare backtracking with Greedy, DP, and BFS.
- [ ] Apply the framework to Backend and AI search problems.

## Key Takeaways

1. Backtracking is systematic DFS over a decision space with undo and pruning.
2. The state must precisely represent the current partial solution.
3. The undo operation is as important as the recursive choice.
4. Safe pruning is the main source of practical performance.
5. Search ordering can dramatically change runtime without changing exactness.
6. Repeated states suggest memoization or dynamic programming.
7. Backtracking is an exact framework for many combinatorial problems, but exponential worst cases remain.
8. The transferable skill is learning to model decisions, constraints, state, pruning, and correctness together.
