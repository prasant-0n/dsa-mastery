# 16.21 — Iterative Deepening and Depth-Bounded Backtracking

## 1. Why Depth Matters

Backtracking normally searches until it reaches a complete solution. But some problems have an additional question:

> Can a solution be found using at most `d` decisions?

This introduces **depth-bounded search**.

Instead of allowing recursion to continue indefinitely or to an arbitrary maximum depth, the search carries an explicit depth budget:

```text
depth = number of decisions already made
limit = maximum allowed decisions
```

A branch is stopped when:

```text
depth === limit
```

unless the current state is already a valid goal.

This simple constraint creates an important family of exact-search techniques.

---

## 2. Depth-Limited Backtracking

The basic pattern is:

```text
search(state, depth):
    if goal(state):
        return solution

    if depth === limit:
        return failure

    for choice in choices(state):
        apply(choice)
        search(nextState, depth + 1)
        undo(choice)
```

The depth limit is a **search boundary**, not necessarily a problem constraint.

If the problem itself requires exactly `k` selections, then `k` is a semantic constraint.

If we temporarily use a limit of `k` to discover a shallow solution, that is an algorithmic search control.

Keep those concepts separate.

---

## 3. Iterative Deepening DFS

If the required solution depth is unknown, run depth-limited search repeatedly:

```text
limit = 0
while not found:
    run depth-limited search(limit)
    limit++
```

This is **Iterative Deepening Depth-First Search (IDDFS)**.

Conceptually:

```text
limit 0 → search
limit 1 → search
limit 2 → search
limit 3 → search
...
```

The algorithm combines two properties:

```text
DFS-style memory usage
+
BFS-style increasing depth order
```

For unit-cost edges and an appropriate search model, the first found shallowest goal has minimum depth.

---

## 4. Why Repeating Work Can Still Be Useful

At first, repeated search looks wasteful.

Suppose the branching factor is `b`.

The number of nodes at depth `d` is approximately:

```text
b^d
```

The total work through depth `D` is:

```text
1 + b + b² + ... + b^D
```

When `b > 1`, the deepest layer dominates the total.

Therefore earlier shallow searches often contribute relatively little compared with the final iteration.

The tradeoff is:

```text
more computation
→ much lower peak memory
```

---

## 5. IDDFS vs BFS vs DFS

| Property | DFS | BFS | IDDFS |
|---|---|---|---|
| Memory | Low | High | Low |
| Shallowest goal | Not guaranteed | Yes | Yes, under unit depth assumptions |
| Repeated work | Low | Low | Higher |
| Depth control | Natural | Layer-based | Explicit |
| Good for unknown solution depth | Sometimes | Yes | Yes |

The algorithm should be selected from the problem's objective and state-space properties, not from the name of the technique.

---

## 6. Backtracking Interpretation

IDDFS can be understood as a sequence of backtracking searches:

```text
Backtracking
    ↓
add depth state
    ↓
stop at depth limit
    ↓
restart with larger limit
```

This connects naturally with combinatorial problems where every action is represented by a recursive choice.

Examples:

- find a sequence of exactly/at-most `k` operations,
- puzzle solving,
- bounded transformation problems,
- shortest operation sequences,
- shallow configuration search,
- bounded planning.

---

## 7. Goal Test Ordering

The order of checks matters.

A common pattern is:

```text
if goal(state):
    success

if depth === limit:
    failure
```

Why test the goal first?

Because a goal at exactly the depth limit is valid.

If the limit is `3`, a solution reached at depth `3` must be accepted.

Incorrect ordering can accidentally reject valid boundary solutions.

---

## 8. At-Most vs Exactly Depth

These are different problems.

### At most `k`

A solution at any depth:

```text
0 <= depth <= k
```

is acceptable.

### Exactly `k`

The goal is accepted only when:

```text
goal(state) && depth === k
```

### Minimum depth

Run increasing limits and stop at the first successful iteration.

Do not silently switch between these semantics.

---

## 9. Remaining-Depth Reasoning

Instead of storing only `depth`, define:

```text
remaining = limit - depth
```

This often makes pruning conditions easier to express.

For example, if at least `r` actions are required to complete a goal and:

```text
r > remaining
```

the branch is impossible.

This is a **feasibility bound**.

It is safe only when the lower bound on required remaining work is itself correct.

---

## 10. Lower Bounds on Solution Depth

Suppose a target requires at least `r(state)` additional decisions.

Then:

```text
if r(state) > remaining:
    prune
```

Examples:

- number of uncovered requirements,
- minimum number of moves required by a puzzle invariant,
- minimum number of substitutions needed,
- minimum number of selected items needed to satisfy cardinality constraints.

The stronger the safe lower bound, the more useless branches can be eliminated.

---

## 11. Upper Bounds on Completion Depth

Sometimes we can prove a completion requires at most `u` additional decisions.

If:

```text
remaining >= u
```

then enough depth exists for that particular completion strategy.

This does not prove the branch is globally solvable unless the upper bound corresponds to a guaranteed constructive completion.

Distinguish:

```text
possible upper estimate
```

from:

```text
guaranted completion bound
```

---

## 12. Cycles and Repeated States

Depth-limited search does not automatically prevent cycles.

Consider a state transition:

```text
A → B → A → B → ...
```

A finite depth limit eventually stops the infinite recursion, but the same state can still be explored repeatedly.

For graph-like state spaces, use an appropriate visited-state strategy.

However, a global visited set can be incorrect in some depth-sensitive problems.

A state reached with more remaining depth may be more useful than the same state reached with less remaining depth.

Therefore the memoization key may need to include:

```text
state + depth
```

or:

```text
state + remainingDepth
```

when reachability depends on the remaining budget.

---

## 13. Path-Based vs Global Visited Sets

For ordinary backtracking over choices, a path-local set often means:

```text
used in current path
```

rather than:

```text
visited anywhere in the entire search
```

These are not interchangeable.

### Path-local

Useful when a choice cannot repeat within one candidate solution.

### Global

Useful when reaching the same state always has equivalent future possibilities.

The correctness question is:

> If I discard this state because I have seen it before, can the new occurrence have a different future because its path, depth, cost, or remaining resources differ?

---

## 14. IDDFS on Unit-Cost Graphs

For a graph where every action has equal cost, depth corresponds to number of actions.

Therefore:

```text
smallest depth
≈
smallest number of actions
```

IDDFS explores depth limits in increasing order and can return a shallowest goal.

For weighted edges, ordinary depth is not path cost.

A path with two expensive edges may cost more than a path with five cheap edges.

Do not use IDDFS as a shortest-cost algorithm merely because it finds minimum depth.

Weighted search requires techniques such as uniform-cost search or other cost-aware algorithms depending on the problem.

---

## 15. Branch Ordering

Within one depth limit, branch ordering affects the time at which a goal is discovered.

Useful ordering signals can include:

- heuristic closeness to target,
- constraint tightness,
- estimated remaining work,
- promising moves first.

Branch ordering does not change correctness if every admissible branch is eventually explored and pruning remains sound.

It can dramatically change practical runtime.

---

## 16. Heuristic Ordering vs Heuristic Pruning

This distinction is critical.

### Ordering

```text
try promising branch first
```

No branch is removed solely because it appears less promising.

### Pruning

```text
prove branch cannot succeed
→ remove it
```

Ordering can be heuristic.

Pruning must be justified by a correctness argument.

This principle applies throughout backtracking.

---

## 17. Transposition Tables

In puzzle and planning search, different paths can reach the same state.

Such a repeated state is sometimes called a **transposition**.

A transposition table stores information about previously searched states.

Possible entries include:

```text
state → solved / unsolved
state → minimum required depth
state → maximum remaining depth proven
```

The stored meaning must be precise.

For example, caching:

```text
state = unsolvable
```

may be unsafe if the earlier search had a smaller depth limit than the current search.

Instead, record the exact guarantee established by the previous search.

---

## 18. Iterative Deepening + Memoization

These techniques interact in subtle ways.

Each new depth limit may revisit many states from previous iterations.

A cache can reduce repeated work, but cache entries must respect the search budget.

A useful conceptual key is:

```text
(state, remainingDepth)
```

For a boolean reachability problem, one possible cached fact is:

```text
(state, r) = solvable within r steps
```

Then:

```text
(state, largerR)
```

cannot necessarily reuse a failure from a smaller `r`.

But a proven solution within `r` steps remains a solution for any larger budget when the problem is “at most r”.

The direction of reusable information must be reasoned about, not guessed.

---

## 19. Iterative Deepening with Increasing Bounds

Depth is only one possible bound.

The broader pattern is:

```text
bound = initial
while not solved:
    search(state, bound)
    increase bound
```

The bound could represent:

- depth,
- cost,
- resource consumption,
- number of operations,
- another monotonic search budget.

This general idea leads toward **cost-bounded iterative search**, including techniques such as Iterative Deepening A* (IDA*) when a heuristic is used to form an `f = g + h` threshold.

---

## 20. IDA* Connection

IDA* applies iterative deepening to an evaluation threshold rather than raw depth.

A common form is:

```text
f(n) = g(n) + h(n)
```

where:

- `g(n)` = cost already paid,
- `h(n)` = estimated remaining cost.

Instead of:

```text
depth <= limit
```

search is constrained by:

```text
f(n) <= threshold
```

The threshold increases after each unsuccessful iteration.

If `h` is admissible and the search assumptions are satisfied, this can support optimal-cost search with much lower memory than storing the full BFS frontier.

This is an important bridge from basic backtracking to heuristic search.

---

## 21. Complexity

Let `b` be the effective branching factor and `d` the shallowest goal depth.

Depth-limited search through depth `d` explores up to approximately:

```text
O(b^d)
```

nodes in the worst case.

IDDFS repeats shallower levels, giving the same exponential order for common tree-search assumptions:

```text
O(b^d)
```

but with different constant factors.

Space is approximately proportional to search depth:

```text
O(d)
```

for a tree-style DFS implementation, excluding stored output, visited-state structures, or transposition tables.

Do not hide those additional memory costs inside the `O(d)` claim.

---

## 22. Correctness Invariants

Maintain:

1. `depth` equals the number of decisions represented by the current path.
2. `remaining = limit - depth` is consistent.
3. Every accepted goal satisfies the requested depth semantics.
4. Every pruned branch violates a proven depth/feasibility condition.
5. Every mutation is undone before exploring a sibling.
6. Any cached result states exactly which search budget it proves something about.
7. If iterative deepening is used to find minimum depth, limits increase monotonically.
8. For unit-cost minimum-depth search, no smaller limit is skipped.
9. Global state deduplication is used only when equivalent future behavior is proven.
10. Weighted problems are not incorrectly treated as depth-optimal problems.

---

## 23. Testing Strategy

### Boundary Tests

Test:

- limit `0`,
- goal at depth `0`,
- goal exactly at limit,
- goal one level beyond limit,
- impossible target,
- empty state,
- single-choice state.

### Differential Testing

For small unit-cost graphs compare:

```text
IDDFS minimum depth
vs
BFS minimum depth
```

### Depth-Limit Property

If a goal is reachable within depth `d`, then an at-most search with limit `d` should find it.

If no goal is reachable within depth `d`, the bounded search must report failure.

### Restoration Testing

Snapshot mutable state before recursive calls and verify exact restoration after return.

### Cycle Testing

Use graphs containing:

```text
A → B → A
```

and verify termination plus correct reachability.

### Cache Testing

Run with and without memoization and compare results, not merely runtime.

---

## 24. Backend Engineering Applications

Depth-bounded backtracking appears in systems that need exact answers under a limited number of operations.

Examples:

- bounded configuration repair,
- dependency resolution with limited changes,
- workflow transformation search,
- retry/action planning,
- migration planning with a maximum number of edits,
- route search by hop count,
- bounded scheduling adjustments.

A service can expose:

```text
initialState
constraints
maximumDepth
searchPolicy
```

and return:

```text
solution
stepsUsed
nodesExplored
pruningStatistics
```

Instrumentation is especially valuable because exponential search performance depends heavily on the instance.

---

## 25. AI Engineering Applications

AI planning often produces candidate actions but needs deterministic bounded verification.

A useful architecture is:

```text
LLM proposes actions
        ↓
normalize actions
        ↓
depth-bounded exact search
        ↓
constraint validation
        ↓
verified plan
```

The LLM can help with branch ordering, but the search engine should enforce:

- maximum action count,
- legal transitions,
- state invariants,
- deterministic termination,
- final validation.

For tool-using agents, this provides a useful safety boundary around generated action sequences.

---

## 26. Interview Framework

When asked to find the shortest sequence of actions:

1. Define the state.
2. Define legal transitions.
3. Define the goal test.
4. Decide whether edge costs are uniform.
5. If uniform and memory is constrained, consider IDDFS.
6. Add a depth limit.
7. Run limits monotonically from the smallest relevant depth.
8. Use safe pruning and cycle handling.
9. Explain why the first successful limit is minimum depth.
10. Compare against BFS and A*/IDA*.
11. State memory and time complexity.

The key question is:

> What exactly does the bound mean, and what guarantee does each failed iteration establish?

---

## 27. Revision Checklist

You should be able to answer:

- What is depth-limited backtracking?
- What is IDDFS?
- Why does IDDFS repeat work?
- Why can repeated work still be acceptable?
- How does IDDFS compare with BFS and DFS?
- What is the difference between at-most and exactly depth?
- Why must the goal test ordering be correct at the depth boundary?
- How can lower bounds on remaining work prune a branch?
- Why are global visited sets dangerous in some depth-sensitive searches?
- What is a transposition table?
- Why can cache entries depend on remaining depth?
- Why does IDDFS find minimum depth but not automatically minimum cost?
- How does IDA* generalize the iterative-bound idea?
- How do you test IDDFS against BFS?
- What correctness guarantee does each iteration provide?

---

## 28. Master Pattern

```text
INITIAL STATE
     ↓
DEPTH-LIMITED SEARCH
     ↓
GOAL?
 ├── YES → RETURN
 └── NO
     ↓
LIMIT REACHED?
 ├── YES → BACKTRACK
 └── NO
     ↓
ORDER / PRUNE CHOICES
     ↓
CHOOSE
     ↓
RECURSE(depth + 1)
     ↓
UNDO
     ↓
IF FAILURE → INCREASE LIMIT
     ↓
RESTART
```

The evolution is:

```text
Backtracking
    ↓
Depth-bounded search
    ↓
Iterative deepening
    ↓
State deduplication / transposition tables
    ↓
Heuristic ordering
    ↓
Cost-bounded iterative search
    ↓
IDA* and heuristic exact search
```

The core principle is:

> **Make the search budget explicit, increase it systematically, and never confuse a search boundary with a proof that the underlying problem is impossible.**
