# 04.5 — Recursion Patterns: Linear, Binary & Multiple-Branch Recursion

## Purpose

Not all recursion has the same computational shape. The number of recursive calls, the amount of work per call, and the way subproblems overlap determine both behavior and complexity.

The three foundational shapes are:

```text
Linear recursion       → 1 recursive call
Binary recursion       → 2 recursive calls
Multiple-branch        → 2+ recursive calls
```

Understanding the shape lets you predict recursion depth, call-tree size, repeated work, and when optimization is necessary.

---

# 1. Linear Recursion

A linear recursive function makes one recursive call per active invocation.

```js
function sumTo(n) {
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}
```

Shape:

```text
f(n)
 ↓
f(n-1)
 ↓
f(n-2)
 ↓
...
```

Typical characteristics:

```text
Depth: O(n)
Calls: O(n)
```

assuming constant work per call.

---

# 2. Linear Recursion Is Often Sequential

The recursive calls form a chain rather than a branching tree.

Examples:

- array traversal;
- linked-list traversal;
- factorial;
- string traversal;
- recursive binary search is also single-branch but logarithmic depth because the state shrinks geometrically.

The number of calls depends on how quickly the state decreases.

---

# 3. Linear Does Not Automatically Mean O(n)

Consider:

```text
f(n) → f(n / 2)
```

There is still only one recursive call, but the depth is:

```text
O(log n)
```

Therefore:

> **Branch count and state-shrink rate are separate dimensions.**

---

# 4. Binary Recursion

A binary recursive function makes two recursive calls.

Example:

```text
f(n)
├── f(n-1)
└── f(n-2)
```

The call structure branches.

If both branches continue to depth `d`, the naive call-tree size can grow exponentially.

---

# 5. Fibonacci as the Classic Example

Naive Fibonacci:

```js
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
```

The same subproblems occur repeatedly:

```text
fib(5)
├── fib(4)
│   ├── fib(3)
│   └── fib(2)
└── fib(3)
    ├── fib(2)
    └── fib(1)
```

The recursion terminates, but repeated states create unnecessary work.

---

# 6. Recursion Tree vs State Graph

A recursion tree records **calls**.

A state graph records **unique states**.

For Fibonacci:

```text
recursion tree → many repeated calls
state graph    → only O(n) distinct n-values
```

This distinction is fundamental for recognizing memoization opportunities.

---

# 7. Multiple-Branch Recursion

Some algorithms make more than two recursive calls.

Conceptually:

```text
f(state)
├── child 1
├── child 2
├── child 3
└── ...
```

If the branching factor is `b` and depth is `d`, a rough upper bound on tree size is:

```text
O(b^d)
```

This is a search-space model, not a universal exact formula.

---

# 8. Branching Factor

Define:

```text
b = number of recursive choices per state
```

Examples:

```text
binary choice       → b ≈ 2
three-way choice    → b ≈ 3
permutation search  → b decreases with depth
```

Branching factor is often more useful than simply saying “recursive.”

---

# 9. Depth

Define:

```text
d = maximum recursion depth
```

A search algorithm may have:

```text
small depth + huge branching
```

or:

```text
large depth + one branch
```

These have very different performance profiles.

---

# 10. The `b^d` Model

For a roughly uniform branching tree:

```text
level 0 → 1 state
level 1 → b states
level 2 → b² states
...
level d → b^d states
```

Total nodes are approximately:

```text
1 + b + b² + ... + b^d
```

For `b > 1`, this is dominated by:

```text
O(b^d)
```

---

# 11. Uneven Branching

Real algorithms often do not have a constant branching factor.

Example:

```text
root → 4 choices
next level → 3 choices
next level → 2 choices
```

The exact tree size depends on the product of branching choices.

Therefore `b^d` should be treated as a useful model, not a blind formula.

---

# 12. Permutation Recursion

Generating permutations has decreasing branching:

```text
n choices
(n-1) choices
(n-2) choices
...
1 choice
```

The number of leaves is:

```text
n!
```

This is factorial growth.

The recursion structure explains why permutation generation becomes expensive quickly.

---

# 13. Subset Recursion

Each element can produce two choices:

```text
exclude
include
```

So for `n` elements:

```text
2^n
```

subsets exist.

The recursion tree naturally reflects this binary decision space.

---

# 14. Branching Recursion Is Not Automatically Wrong

Exponential or factorial recursion may be necessary when the output itself is exponential or factorial.

For example:

```text
generate all subsets
```

must produce `2^n` outputs.

The correct question is:

> Is the branching caused by unavoidable output or by redundant computation?

---

# 15. Redundant Branching

Naive Fibonacci branches because it needs only one final number, yet explores the same states repeatedly.

This is a strong signal for:

```text
memoization
DP
state compression
```

The goal is not always to eliminate recursion; it is often to eliminate duplicate work.

---

# 16. Divide-and-Conquer Recursion

Divide-and-conquer commonly has two or more recursive calls on smaller independent subproblems.

General form:

```text
solve(problem)
├── solve(part A)
├── solve(part B)
└── combine(results)
```

Examples include:

- merge sort;
- divide-and-conquer counting;
- recursive geometric algorithms.

---

# 17. Binary Search Is a Special Linear-Branch Pattern

Binary search makes one recursive call, but reduces the search interval by roughly half.

```text
T(n) = T(n/2) + O(1)
```

Therefore:

```text
T(n) = O(log n)
```

This demonstrates why analyzing state shrinkage matters as much as counting recursive calls.

---

# 18. Merge Sort Has Two Branches

Merge sort has:

```text
T(n) = 2T(n/2) + O(n)
```

There are two recursive calls, but the problem size halves.

The total complexity is:

```text
O(n log n)
```

Two branches do not automatically imply exponential complexity.

---

# 19. Branching + Shrinkage

Always analyze both:

```text
How many recursive calls?
How much smaller is each subproblem?
```

Examples:

```text
1 call + n-1       → O(n)
1 call + n/2       → O(log n)
2 calls + n/2 each → O(n log n) with linear combine work
2 calls + n-1/-2   → exponential
```

This is the beginning of recurrence analysis.

---

# 20. Recursion Tree Reasoning

For recursive complexity, draw levels.

At each level ask:

```text
How many nodes?
How much work per node?
What is the total work at this level?
How many levels exist?
```

Then sum the levels.

This often reveals the complexity faster than memorizing formulas.

---

# 21. Work Per Level

Suppose:

```text
T(n) = 2T(n/2) + n
```

At each level:

```text
number of subproblems doubles
work per subproblem halves
```

So total work remains approximately:

```text
n
```

per level.

There are `log n` levels.

Therefore:

```text
O(n log n)
```

---

# 22. Call Count vs Useful Work

Do not count only recursive calls.

A function may do significant work before or after each recursive call.

For example:

```text
recursive call → O(1)
array scan      → O(n)
copying         → O(n)
```

The total complexity must include all work performed by every call.

---

# 23. Multiple Branches and Stack Space

Time can be exponential while recursion depth remains linear.

For a depth-first recursive search:

```text
Time  → O(b^d)
Stack → O(d)
```

assuming only the active path is stored and ignoring stored results/visited structures.

This distinction is extremely important.

---

# 24. Backtracking Shape

Backtracking usually looks like:

```text
choose
→ recurse
→ undo
```

At each state, multiple choices may branch.

Its complexity depends on:

- branching factor;
- depth;
- pruning;
- duplicate states;
- output size.

---

# 25. Pruning Changes the Effective Tree

Without pruning:

```text
many branches survive
```

With safe pruning:

```text
invalid branches terminate early
```

The worst-case asymptotic bound may remain large, but practical work can decrease dramatically.

Never assume pruning changes the worst-case bound without proving it.

---

# 26. Memoization Changes the Computation Graph

Memoization transforms:

```text
recursion tree
```

into something closer to:

```text
state graph
```

Each unique state is solved once.

If there are `S` states and each state has `b` transitions, a typical bound becomes approximately:

```text
O(S · b)
```

plus state/key/memoization overhead.

---

# 27. Choosing the Pattern

Use linear recursion when:

```text
one subproblem naturally follows another
```

Use divide-and-conquer when:

```text
one problem splits into independent smaller problems
```

Use branching/backtracking when:

```text
multiple candidate choices must be explored
```

Use memoization when:

```text
different paths reach equivalent states
```

---

# 28. When Recursion Is a Poor Choice

Recursion may be a poor engineering choice when:

- depth can be extremely large;
- JavaScript call-stack limits are a concern;
- an iterative formulation is simpler;
- state must be explicitly queued or prioritized;
- recursion adds allocation without benefit.

Algorithmic elegance does not override production constraints.

---

# 29. Backend Applications

Recursive patterns appear in:

- dependency graphs;
- nested configuration traversal;
- hierarchical permissions;
- directory/tree processing;
- workflow evaluation;
- recursive data transformation.

Backend engineering adds constraints such as:

```text
maximum depth
CPU budget
memory budget
request timeout
```

---

# 30. AI Applications

AI systems frequently explore branching spaces:

- planning;
- tree search;
- beam search;
- candidate generation;
- recursive parsing;
- combinatorial generation.

Useful controls include:

```text
beam width
maximum depth
node budget
pruning
memoization
heuristic ordering
```

These directly manipulate the search tree.

---

# 31. Pattern Recognition Checklist

When you see recursion, identify:

```text
1. Number of recursive calls per state
2. Size of each child problem
3. Number of recursion levels
4. Work outside recursive calls
5. Repeated states
6. Pruning
7. Stored results
8. Maximum stack depth
```

Then derive the complexity.

---

# 32. Expert Comparison Table

| Pattern | Typical Shape | Key Driver |
|---|---|---|
| Linear | 1 child | state shrink |
| Binary search recursion | 1 child | geometric shrink |
| Divide-and-conquer | 2+ children | subproblem split |
| Fibonacci-style | 2 children | repeated states |
| Subset generation | 2 choices | output size |
| Permutations | decreasing branches | factorial output |
| Backtracking | variable branches | search space + pruning |
| Memoized recursion | state graph | unique states |

---

# 33. Revision Checklist

- [ ] Can I distinguish linear from branching recursion?
- [ ] Can I explain why one recursive call can still be O(log n)?
- [ ] Can I analyze binary recursion with a recurrence?
- [ ] Can I estimate branching factor and depth?
- [ ] Can I reason using `b^d`?
- [ ] Can I explain recursion tree vs state graph?
- [ ] Can I identify repeated states?
- [ ] Can I explain why memoization removes duplicate work?
- [ ] Can I distinguish unavoidable output complexity from redundant computation?
- [ ] Can I analyze stack space separately from time?
- [ ] Can I explain how pruning changes a search tree?
- [ ] Can I map recursion patterns to backend and AI systems?

# Key Takeaways

1. Recursive algorithms have recognizable computational shapes.
2. One recursive call does not necessarily mean O(n); state-shrink rate matters.
3. Branching factor and depth determine search-tree growth.
4. `b^d` is a useful search-space model, not a universal exact formula.
5. Divide-and-conquer can branch while remaining polynomial.
6. Repeated states distinguish inefficient recursion trees from reusable state graphs.
7. Memoization attacks duplicate work rather than recursion itself.
8. Exponential recursion can be necessary when the output is exponential.
9. Time complexity and recursion-stack complexity must be analyzed separately.
10. Backend and AI systems require explicit limits on recursive depth, branching, time, and memory.
