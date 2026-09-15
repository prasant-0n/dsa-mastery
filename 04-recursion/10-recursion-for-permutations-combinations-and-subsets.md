# 04.10 — Recursion for Permutations, Combinations & Subsets

## Purpose

Many recursive problems ask us to explore a **space of choices** rather than follow a single path.

Examples:

```text
subsets
combinations
permutations
binary choices
include/exclude decisions
arrangements
candidate selections
```

The central mental model is:

> At each recursive state, choose what decision to make next, recursively explore the resulting state, then restore or isolate state before exploring another choice.

This chapter is the bridge from ordinary recursion to **backtracking and search**.

---

# 1. Recursion as a Decision Tree

Suppose every element can be included or excluded.

For `[A, B]`:

```text
                 start
               /       \
            include A  exclude A
             /    \       /    \
          +B      -B    +B     -B
```

Each root-to-leaf path represents one complete decision sequence.

---

# 2. State-Space Thinking

For choice-based recursion, ask:

```text
What decisions have already been made?
What decisions remain?
What is the current partial solution?
What choices are legal next?
```

A typical state is:

```text
index + current solution
```

or:

```text
remaining choices + current solution
```

---

# 3. Subsets

For `N` distinct elements, every element has two choices:

```text
include
exclude
```

Therefore there are:

```text
2^N
```

possible subsets.

A recursive generator cannot have less than Ω(2^N) output work if it must explicitly produce every subset.

---

# 4. Include / Exclude Pattern

A canonical subset recursion is:

```text
solve(index, current)

choose include arr[index]
→ solve(index + 1, current)

choose exclude arr[index]
→ solve(index + 1, current)
```

The base case occurs after all elements have been decided.

---

# 5. Combination vs Subset

A subset can have any size.

A combination often asks for exactly `K` selected elements, without caring about order.

For example:

```text
[A, B, C]
choose 2
```

produces:

```text
AB
AC
BC
```

`AB` and `BA` represent the same combination.

---

# 6. Combination State

A useful recursive state is:

```text
startIndex
currentSelection
remainingCount
```

The `startIndex` prevents selecting earlier elements again and naturally avoids permutation duplicates.

---

# 7. Permutations

Permutations care about order.

For `[A, B, C]`:

```text
ABC
ACB
BAC
BCA
CAB
CBA
```

For `N` distinct elements:

```text
N!
```

permutations exist.

This immediately gives a lower bound of Ω(N!) for explicit generation.

---

# 8. Permutation State

A typical permutation state is:

```text
current arrangement
used elements
```

At each level:

```text
choose one unused element
→ mark it used
→ recurse
→ unmark it
```

The unmark operation is state restoration.

---

# 9. Backtracking Pattern

The general structure is:

```text
choose
apply choice
recurse
undo choice
```

or:

```text
for each legal choice:
    apply choice
    search(next state)
    undo choice
```

This is the fundamental backtracking template.

---

# 10. Why Undo Is Necessary

Suppose:

```text
path = [A]
```

After exploring `A → B`, the next sibling should start from:

```text
[A]
```

not:

```text
[A, B]
```

Therefore:

```text
push B
recurse
pop B
```

restores the parent state.

---

# 11. Copying vs Shared State

Two ways to construct candidate paths:

### Copy

```text
nextPath = [...path, choice]
```

### Shared + restore

```text
path.push(choice)
recurse(path)
path.pop()
```

Copying simplifies ownership but allocates more.

Shared state can reduce allocations but requires a strict restoration invariant.

---

# 12. Recursive State Invariant

A strong invariant is:

> At entry to `solve(index, current)`, `current` contains exactly the choices selected for positions before `index`.

If the invariant remains true through every transition, the search tree has a precise meaning.

---

# 13. Base Cases for Choice Recursion

Common base cases include:

```text
index === N
selection.length === K
no choices remain
solution is complete
constraint is violated
```

There may be multiple terminal states.

The base case should define whether the current state is:

```text
valid solution
invalid branch
incomplete state
```

---

# 14. Pruning

Backtracking becomes powerful when impossible branches are rejected early.

Example:

```text
remaining capacity < required selection
```

or:

```text
current sum already exceeds target
```

Then recursion can stop before exploring descendants.

---

# 15. Pruning Must Be Safe

A pruning rule must never remove a branch that could contain a valid solution.

Therefore ask:

> Can this state possibly lead to a valid solution?

If the answer is definitely no, prune.

If the answer is merely “unlikely,” pruning changes correctness and is no longer ordinary exact search.

---

# 16. Output-Sensitive Complexity

Generation problems require careful complexity analysis.

If there are `2^N` subsets and each subset contains up to `N` elements, explicitly materializing all output can require:

```text
O(N · 2^N)
```

work and output space in the worst case.

Do not report only the recursion depth.

---

# 17. Permutation Complexity

There are `N!` permutations.

If each complete permutation is copied into the output, the output itself contains:

```text
N × N!
```

values.

Therefore explicit permutation generation is naturally factorial-scale.

---

# 18. Search vs Generation

These are different goals.

### Generation
Produce every valid solution.

### Search
Find one valid solution.

### Optimization
Find the best valid solution.

If the task is search, stopping after the first valid solution can save enormous work.

---

# 19. Boolean Propagation

A recursive search can return:

```text
true  → solution found
false → no solution in this branch
```

Then:

```text
if recurse(choice) returns true:
    return true
```

This allows early termination of the entire search.

---

# 20. Counting Solutions

Instead of returning the first solution, recursion can aggregate counts:

```text
count(state)
= sum(count(child) for every legal child)
```

This changes the return-value contract but keeps the same state-space structure.

---

# 21. Duplicate Values

Duplicate input values create duplicate candidate outputs.

For example:

```text
[A, A, B]
```

naive permutation recursion can generate equivalent arrangements multiple times.

A common strategy is to sort values and skip equivalent choices at the same recursion depth.

The skip rule must be carefully defined so valid distinct arrangements are not removed.

---

# 22. Constraint-Driven Recursion

Many classic problems can be viewed as:

```text
state
→ legal choices
→ next states
→ terminal validation
```

Examples:

- N-Queens;
- Sudoku;
- combination sum;
- word search;
- maze search;
- partitioning;
- scheduling choices.

The data structure changes, but the state-space model remains similar.

---

# 23. Search Tree vs State Graph

A recursion tree treats each path as a separate search state.

But different paths may reach the same logical state.

Example:

```text
Path A → State X
Path B → State X
```

If future possibilities from `X` are identical, repeated work may exist.

This is where memoization and dynamic programming become relevant.

---

# 24. Backtracking vs Dynamic Programming

### Backtracking
Explores choices, often pruning invalid branches.

### Dynamic Programming
Recognizes repeated states and stores results.

A problem can contain both:

```text
backtracking search
+ memoization of equivalent states
```

The key question is whether the future depends only on a compact state representation.

---

# 25. Lexicographic and Ordered Generation

If outputs must be generated in a particular order, choice ordering becomes part of the algorithm contract.

For example:

```text
sort candidates
choose in ascending order
```

can produce lexicographically ordered combinations under suitable invariants.

Ordering should be intentional, not accidental.

---

# 26. Backend Applications

Choice-based recursion appears in:

- scheduling candidate assignments;
- configuration search;
- routing alternatives;
- resource allocation;
- permission combinations;
- rule evaluation;
- dependency selection.

Production systems usually require explicit search limits, pruning, time budgets, or iterative work queues.

---

# 27. AI Applications

This pattern is especially relevant to AI engineering:

- search trees;
- planning;
- candidate generation;
- beam-style exploration;
- structured reasoning search;
- program synthesis;
- constrained generation;
- combinatorial optimization.

The central concepts are state representation, branching factor, pruning, and evaluation.

---

# 28. Branching Factor and Depth

A search tree with branching factor `b` and depth `d` can contain roughly:

```text
O(b^d)
```

nodes in a broad worst-case model.

For permutations and subsets, the branching factor changes by level, so exact counting requires a more precise derivation.

---

# 29. Stack Space vs Search-Space Size

A backtracking algorithm may explore exponentially many states while using only linear recursion depth.

For example:

```text
search work  → exponential
stack depth  → O(N)
```

If complete solutions are stored, output space can dominate both.

Always separate:

```text
call stack
visited/search state
output storage
```

---

# 30. Production Safety

For large search spaces, recursion alone is not enough.

Consider:

```text
maximum depth
branching factor
node budget
time budget
memory budget
cancellation
partial results
observability
```

A production search service should have explicit resource boundaries.

---

# 31. Design Procedure

For a choice-based problem:

```text
1. Define the state.
2. Define the decisions available at that state.
3. Define legal choices.
4. Apply a choice.
5. Recurse into the next state.
6. Restore shared state.
7. Define terminal success/failure.
8. Add only provably safe pruning.
9. Determine whether the goal is search, count, optimization, or generation.
10. Check for repeated states and memoization opportunities.
11. Analyze branching, depth, and output size.
12. Add resource limits for large/untrusted inputs.
```

---

# 32. Interview Explanation Template

> “I model the problem as a decision tree. The recursive state represents the choices already made and the choices that remain. At each level I iterate through legal choices, apply one, recurse, and restore the state. The base case identifies a complete solution. I can prune only when I can prove the branch cannot produce a valid result. Complexity depends on the branching factor, depth, and output size.”

---

# 33. Revision Checklist

- [ ] Can I explain recursion as a decision tree?
- [ ] Can I implement include/exclude recursion?
- [ ] Can I generate subsets?
- [ ] Can I generate fixed-size combinations?
- [ ] Can I generate permutations?
- [ ] Can I define precise recursive state?
- [ ] Can I maintain a backtracking invariant?
- [ ] Can I explain choose → recurse → undo?
- [ ] Can I safely prune impossible branches?
- [ ] Can I handle duplicate values correctly?
- [ ] Can I distinguish search from generation?
- [ ] Can I calculate output-sensitive complexity?
- [ ] Can I distinguish recursion depth from search-space size?
- [ ] Can I identify repeated states and memoization opportunities?
- [ ] Can I connect backtracking to backend and AI search?

# Key Takeaways

1. Choice recursion explores a state space rather than a single chain.
2. Subsets use include/exclude decisions and produce `2^N` possibilities.
3. Combinations select elements without treating order as distinct.
4. Permutations treat order as significant and produce `N!` arrangements for distinct elements.
5. Backtracking follows choose → recurse → undo.
6. The recursive invariant precisely defines what the current partial solution means.
7. Safe pruning can dramatically reduce practical work without changing correctness.
8. Generation complexity must include the cost of producing the output.
9. Repeated logical states create opportunities for memoization and dynamic programming.
10. Backend and AI search systems must impose explicit resource limits when the state space can explode.
