# 16.13 — Rat in a Maze, Path Enumeration & Grid Constraint Search

## 1. Concept Definition

Rat in a Maze is a grid path-search problem in which a traversal must move through allowed cells from a source to a destination while respecting movement and reuse constraints.

It is a canonical backtracking problem because each movement creates a branch and failed paths must be undone.

## 2. State Model

A useful state contains:

```text
position
visited cells
current path
movement rules
obstacles
```

Variants may add cost, turns, resources, keys, or other state variables.

## 3. Core Backtracking

```text
search(cell):
    if goal: emit/return
    mark cell
    for each legal move:
        recurse(next)
    unmark cell
```

The exact base case depends on whether the task asks for one path, all paths, minimum cost, or a count.

## 4. Grid Validation

Define explicitly:

- number of rows
- number of columns
- valid cell values
- source
- destination
- obstacle representation
- allowed directions

Do not allow malformed input to leak into recursive search.

## 5. Four-Directional Search

With up/down/left/right movement, a cell can have up to four outgoing choices.

If revisiting is forbidden, the number of immediately available choices after entering a non-boundary cell is reduced by the previous cell.

## 6. Eight-Directional Search

Diagonal moves can be added when the problem contract allows them.

This changes reachability, branching factor, and potentially shortest-path behavior.

## 7. Visited State

For simple-path enumeration, maintain a visited structure.

Possible representations:

- 2D boolean array
- `Set` of encoded coordinates
- flat boolean array
- bitmask for small boards

The representation should match board size and hot-loop performance requirements.

## 8. In-Place Marking

Temporarily change an open-cell value to a sentinel while exploring it.

This saves auxiliary memory but requires exact restoration.

A sentinel collision with legitimate board values is a correctness bug.

## 9. Path Representation

Store coordinates or encoded cell IDs in the current path.

Push before recursion and pop after recursion so sibling branches reuse the same mutable path.

When emitting a result, copy the path unless the consumer processes it synchronously.

## 10. Simple Paths

A simple path never visits the same vertex twice.

Simple-path enumeration can be exponential because the number of possible simple paths can itself be exponential in the graph size.

## 11. Reachability Precheck

Before expensive enumeration, run a cheap reachability check when appropriate.

For an unweighted grid, BFS/DFS can determine whether the destination is reachable at all.

This can avoid a full path enumeration attempt for obviously disconnected inputs.

## 12. When Precheck Helps

A reachability precheck is especially useful when the API needs all paths and many instances are unsatisfiable.

For a task that already performs a nearly identical traversal, however, the extra pass may not improve total runtime.

Benchmark rather than assuming.

## 13. Dead-End Detection

A state is a dead end when no legal continuation exists.

Common causes include:

- obstacle
- boundary
- visited neighbor
- resource constraint
- invalid transition

Dead-end checks should be cheap because they execute frequently.

## 14. Destination Semantics

If the destination is reached, decide whether search should:

- stop immediately
- emit the path and continue for other paths
- continue through the destination for a longer target

The correct behavior depends on the problem definition.

## 15. All Paths vs One Path

For one feasible path, stop after the first success.

For all paths, continue exploring every legal branch after emitting a solution.

This distinction changes both runtime and output memory.

## 16. Counting Paths

If only the number of paths is required, accumulate counts instead of storing paths.

Counts can exceed JavaScript's exact `Number` range for sufficiently large state spaces; use `BigInt` when exact arbitrary-size counts are required.

## 17. Streaming Paths

A generator or callback can emit paths incrementally.

Streaming avoids storing all solutions and is often preferable for huge output spaces.

## 18. Shortest Path Boundary

If the only goal is an unweighted shortest path, backtracking is usually unnecessary.

BFS provides a polynomial-time shortest-path method on an unweighted graph.

Recognizing when backtracking is the wrong abstraction is an important engineering skill.

## 19. Weighted Path Boundary

With nonnegative movement costs, Dijkstra's algorithm is generally more appropriate for shortest-path optimization.

Backtracking remains useful for small constrained enumeration problems where the goal is not simply shortest distance.

## 20. A* Boundary

If a useful admissible heuristic exists for a large grid and only an optimal path is needed, A* can reduce search relative to uninformed methods.

This is a search-algorithm selection issue, not a replacement for exact path enumeration.

## 21. Constraint Augmentation

Backtracking becomes appropriate when path legality depends on additional state such as:

- maximum turns
- limited energy
- collected keys
- required checkpoints
- forbidden transitions
- exact path length
- visit quotas

The complete state must include every variable that can affect future legality.

## 22. State Completeness

If two states have different future possibilities, they must not be treated as equivalent by memoization or pruning.

Omitting a relevant resource, key, or visited-set component can make an optimized solver incorrect.

## 23. Memoization

Memoization can help when many search branches reach the same future-equivalent state.

For simple paths, the visited set is part of the state, so memoization may provide limited benefit because state keys become large.

## 24. Bitmask State

For sufficiently small grids, represent visited cells as bits.

A transition can set one bit and test membership with compact operations.

JavaScript's ordinary bitwise operators are 32-bit; use `BigInt` for larger bitmasks when appropriate.

## 25. Connectivity Pruning

In some constrained variants, detect whether remaining unvisited cells can still connect the current position to the destination.

This can be a powerful but potentially expensive pruning rule.

The check must be exact if used as a hard prune.

## 26. Forced-Move Reasoning

If a state has only one legal continuation, following it without creating an unnecessary recursive branch is safe.

This is an optimization of search representation, provided the path state is restored correctly on failure.

## 27. Corridor Compression

Long degree-two corridors can sometimes be compressed into macro-edges for specialized search.

This requires preserving all constraints and path-output semantics, so it is best treated as an advanced optimization rather than a default technique.

## 28. Symmetry

If the board and constraints are symmetric, equivalent source/direction branches may be explored redundantly.

Symmetry breaking is valid only when omitted branches have equivalent solution semantics.

## 29. Hamiltonian Boundary

If the requirement is to visit every cell exactly once, the problem becomes a Hamiltonian-path-style search and can be substantially harder than ordinary reachability.

The same backtracking machinery applies, but the objective and pruning requirements change.

## 30. Exact-Length Paths

For exactly `L` moves, track the current depth and reject states that cannot reach the required length.

Remaining-distance lower bounds can provide safe pruning when movement constraints are known.

## 31. Manhattan Lower Bound

On a four-direction empty grid, Manhattan distance gives a lower bound on the number of moves required to reach a target.

If remaining moves are less than that lower bound, the branch is impossible.

Obstacles may make the true required distance larger, never smaller.

## 32. Resource-Budget Pruning

If every future move consumes at least a known minimum cost and the remaining budget is insufficient even for the optimistic minimum, prune safely.

This is the same bound-based reasoning used throughout branch-and-bound search.

## 33. Correctness Invariant

During recursion:

> The current path begins at the source, follows only legal transitions, contains no repeated cell when simple paths are required, and the visited state exactly represents its cells.

## 34. Apply/Undo Correctness

Every successful mark must have exactly one matching restoration on every return path.

A missing restoration can cause valid paths in sibling branches to disappear.

## 35. Completeness

Every legal next move is considered unless a pruning rule has a proof that no valid completion exists from that state.

Search ordering alone cannot remove branches.

## 36. Complexity

Path enumeration is output-sensitive and can be exponential.

For a grid with `V` cells, the number of simple paths can be exponential in `V`.

A basic DFS/backtracking implementation uses `O(V)` working memory for visited state and recursion depth, excluding stored output paths.

## 37. Independent Validator

For every returned path, verify independently:

1. starts at source
2. ends at destination
3. every cell is valid
4. every transition is allowed
5. obstacles are not used
6. no cell repeats when prohibited
7. all additional constraints hold

## 38. Differential Testing

For tiny grids compare the optimized solver against an intentionally simple exhaustive oracle.

Useful comparisons include:

- one-path existence
- path count
- all-path sets
- shortest path length where applicable

## 39. Metamorphic Testing

Useful properties include:

- reflecting a symmetric grid preserves corresponding reachability
- adding an obstacle cannot create a new path
- removing an obstacle cannot destroy an existing path
- reversing source and destination maps every path to its reverse when movement is reversible

## 40. Adversarial Cases

Test:

- blocked source
- blocked destination
- source equals destination
- completely blocked board
- open board with many paths
- narrow corridor
- cycles requiring visited protection
- late dead ends
- long exact-length paths
- tight resource budgets

## 41. Benchmark Metrics

Track:

- recursive calls
- candidate moves
- visited checks
- dead ends
- paths found
- branches pruned
- maximum depth
- runtime
- peak memory

Compare baseline DFS, reachability precheck, bitmask, and constraint-aware variants.

## 42. Backend Applications

The pattern can model:

- dependency workflow path enumeration
- constrained deployment routes
- service topology exploration
- configuration transition search
- test execution path generation

For large graph routing, use graph algorithms rather than blindly applying backtracking.

## 43. AI Applications

Useful applications include:

- symbolic spatial reasoning
- game and puzzle search
- constrained action-sequence generation
- multimodal path validation
- model-proposed route verification

An AI planner can rank moves while deterministic search verifies hard constraints.

## 44. Hybrid AI + Search

```text
AI proposes/ranks moves
→ exact search enforces constraints
→ validator checks completed paths
```

This architecture combines learned heuristics with deterministic correctness.

## 45. Implementation Lab

Implement:

1. one-path maze solver
2. all-path enumerator
3. path counter
4. streaming path generator
5. independent path validator
6. in-place visited marking
7. flat visited state
8. bitmask visited state
9. reachability precheck
10. exact-length path search
11. resource-budget path search
12. checkpoint-constrained path search
13. brute-force oracle
14. differential/metamorphic test harness
15. Backend workflow path explorer
16. AI constrained route validator

## 46. Interview Framework

Explain:

```text
State:
position + visited + constraint resources

Choice:
legal neighboring cell

Constraint:
bounds + obstacle + transition + state rules

Transition:
mark → append → recurse → pop/unmark

Base:
destination / target condition

Optimization:
prechecks + compact visited state + safe bounds
```

Then explain why BFS/Dijkstra/A* are preferable when the task is shortest-path optimization rather than path enumeration.

## 47. Revision Checklist

- [ ] Model maze traversal as backtracking.
- [ ] Define exact state and movement rules.
- [ ] Implement visited tracking.
- [ ] Preserve apply/undo invariants.
- [ ] Distinguish one path, all paths, and path counting.
- [ ] Understand streaming output.
- [ ] Use `BigInt` when exact path counts exceed safe integer limits.
- [ ] Recognize when BFS is better.
- [ ] Recognize when Dijkstra/A* is better.
- [ ] Add exact-length and resource constraints safely.
- [ ] Understand memoization state completeness.
- [ ] Use Manhattan distance only under its valid assumptions.
- [ ] Build an independent path validator.
- [ ] Differential-test optimized search.
- [ ] Apply the pattern to Backend and AI constrained search.

## Key Takeaways

1. Rat in a Maze is a reusable template for constrained path enumeration.
2. The core state is position, visited cells, path, and any additional future-relevant constraints.
3. Exact restoration is essential because sibling branches share mutable search state.
4. Backtracking is appropriate for enumeration and small constrained search, not automatically for shortest-path problems.
5. BFS, Dijkstra, and A* should be selected when their graph-search assumptions fit the actual objective.
6. Safe pruning comes from proven bounds, feasibility checks, and complete state modeling.
7. Independent validators and brute-force differential tests are critical for optimized search engines.
8. The same architecture transfers to workflow exploration, AI planning, and deterministic validation layers.
