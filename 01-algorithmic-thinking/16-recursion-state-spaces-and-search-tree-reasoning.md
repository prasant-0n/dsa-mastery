# 01.16 — Recursion, State Spaces & Search-Tree Reasoning

> Recursion becomes much easier when you stop thinking about function calls and start thinking about states, choices, transitions, and the search space those choices create.

## Learning Objectives

By the end of this chapter, you should be able to:

- Model recursive problems as state transitions.
- Identify the state required to describe a recursive subproblem.
- Define base cases and progress measures.
- Derive recursion trees and branching complexity.
- Distinguish recursion depth from total recursive work.
- Recognize exponential search spaces.
- Understand pruning, memoization, and duplicate-state elimination.
- Connect recursion to DFS, backtracking, DP, parsing, and tree algorithms.
- Apply search-tree reasoning to backend and AI workloads.

---

## 1. Recursion Is a State Transition

A recursive function can be viewed as:

```text
current state
    ↓
choose transition
    ↓
smaller/different state
    ↓
solve recursively
    ↓
combine result
```

For example:

```js
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
```

The state is simply:

```text
n
```

and the transition is:

```text
n → n - 1
```

---

## 2. The Four Questions of Recursion

For every recursive algorithm, identify:

1. **State** — what completely describes the current subproblem?
2. **Base case** — when is the answer immediately known?
3. **Transition** — how does the current state produce smaller/different states?
4. **Progress measure** — why must recursion eventually terminate?

If any of these is unclear, the recursion is probably not understood yet.

---

## 3. Base Cases Are Part of the Algorithm

A recursive algorithm needs a stopping condition.

Example:

```js
function sumTo(n) {
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}
```

Without:

```js
if (n === 0)
```

the recursion has no terminating state.

A base case is not a coding detail.

It defines a terminal state in the state space.

---

## 4. Progress Measures

A progress measure is a quantity that moves toward termination.

Examples:

```text
n decreases
index increases
remaining items decrease
interval length decreases
unvisited nodes decrease
```

For recursive correctness, ask:

> What mathematical quantity guarantees that we eventually reach a base case?

---

## 5. Linear Recursion

If each state creates one recursive subproblem:

```text
T(n) = T(n - 1) + O(1)
```

then:

```text
T(n) = O(n)
```

Example:

```js
function countDown(n) {
  if (n === 0) return;
  countDown(n - 1);
}
```

There are approximately n recursive calls.

Depth:

```text
O(n)
```

Time:

```text
O(n)
```

---

## 6. Logarithmic Recursion

If each recursive call reduces the problem by a constant factor:

```text
n → n / 2
```

then:

```text
T(n) = T(n / 2) + O(1)
```

giving:

```text
O(log n)
```

Binary search is the canonical example.

The recursion depth is logarithmic because the remaining search interval repeatedly shrinks by half.

---

## 7. Divide and Conquer

Some algorithms create multiple independent subproblems.

Example:

```text
T(n) = 2T(n/2) + O(n)
```

Merge sort follows this shape.

The recursion tree has:

```text
level 0 → n work
level 1 → n work
level 2 → n work
...
```

There are O(log n) levels.

Therefore:

```text
O(n log n)
```

---

## 8. Recursion Tree Reasoning

A recursion tree represents every recursive call as a node.

For:

```text
T(n) = 2T(n/2) + O(n)
```

we get:

```text
                 n
              /     \
            n/2     n/2
           /  \     /  \
         n/4 n/4  n/4 n/4
```

The number of nodes grows, but the total work per level remains approximately n.

This is why recursion-tree reasoning is more useful than merely counting calls.

---

## 9. Recursion Depth vs Total Work

These are different quantities.

A recursive algorithm may have:

```text
depth = O(log n)
```

but:

```text
total work = O(n)
```

or:

```text
total work = O(n log n)
```

Always analyze both:

```text
time = total work
space = maximum simultaneous recursion depth + other memory
```

---

## 10. Branching Recursion

Suppose every state creates two recursive states:

```text
                 state
                /     \
             state   state
             /  \     /  \
```

The number of states can grow exponentially.

A simple recurrence:

```text
T(n) = 2T(n - 1) + O(1)
```

produces:

```text
O(2^n)
```

This is the first major search-tree pattern.

---

## 11. Fibonacci as a Search Tree

Naive Fibonacci:

```js
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
```

creates overlapping recursive work.

Conceptually:

```text
fib(5)
├── fib(4)
│   ├── fib(3)
│   └── fib(2)
└── fib(3)
    ├── fib(2)
    └── fib(1)
```

The same states appear repeatedly.

This is not merely “recursion is slow.”

The real problem is:

> Multiple paths reach the same state, causing repeated computation.

---

## 12. State Identity

For Fibonacci, the complete state is:

```text
n
```

Therefore:

```text
fib(3)
```

has the same answer regardless of which recursive path reached it.

That means the result can be reused.

This observation leads directly to memoization.

---

## 13. Memoization

Memoization stores the answer for previously solved states.

```text
state
 ↓
cache lookup
 ↓
known? → reuse
unknown? → compute and store
```

For Fibonacci:

```text
naive recursion → exponential
memoized recursion → O(n)
```

The search tree effectively becomes a graph of unique states.

---

## 14. Search Tree vs State Graph

This is a powerful mental model.

### Search tree

Every path is represented separately.

```text
A
├── B
│   └── D
└── C
    └── D
```

### State graph

Shared state `D` is represented once:

```text
A → B → D
 \→ C → D
```

Memoization merges equivalent states.

Therefore:

```text
exponential paths
↓
unique states
↓
potentially much smaller computation
```

---

## 15. State Explosion

Many recursive problems have a huge state space.

If each state has branching factor `b` and depth `d`, a rough search-tree bound is:

```text
O(b^d)
```

This appears in:

- subsets,
- permutations,
- combinations,
- game trees,
- path enumeration,
- backtracking,
- planning/search problems.

The goal is often not to eliminate recursion itself.

The goal is to control the search space.

---

## 16. Branching Factor

The branching factor is approximately:

```text
number of choices from a state
```

Examples:

```text
binary decision → b ≈ 2
chess position → many legal moves
subset choice → often 2
permutation construction → decreases as positions fill
```

Search complexity depends strongly on both:

```text
branching factor
×
depth
```

---

## 17. Backtracking

Backtracking explores a search space while undoing decisions when returning.

Generic structure:

```text
choose
↓
modify state
↓
recurse
↓
undo choice
```

Example:

```js
function search(state) {
  for (const choice of choices(state)) {
    apply(choice);
    search(state);
    undo(choice);
  }
}
```

The undo step is essential because sibling branches must start from the correct state.

---

## 18. Backtracking State Invariant

At every recursive call:

> The mutable state must exactly represent the decisions made along the current path and nothing from completed sibling paths.

If this invariant is broken:

```text
branch A state
    ↓
return
    ↓
branch B accidentally inherits A
```

and the algorithm becomes incorrect.

---

## 19. Pruning

A brute-force search explores every possible branch.

Pruning stops exploring branches that cannot produce a valid or useful answer.

```text
choice
 ↓
can this branch still succeed?
 ↓       ↓
no      yes
 ↓       ↓
prune   recurse
```

Pruning changes the practical search space dramatically.

It does not automatically change the worst-case asymptotic bound.

---

## 20. Branch-and-Bound Intuition

A stronger form of pruning uses a bound on what a branch can achieve.

If the best possible result from a branch cannot beat the current best answer:

```text
branch cannot win
↓
prune
```

This is common in optimization search.

The quality of the bound determines pruning power.

---

## 21. Ordering Choices to Improve Pruning

Two algorithms may explore the same theoretical search space but behave very differently because they try choices in different orders.

If promising choices are explored first:

```text
good solution found early
↓
stronger pruning threshold
↓
more branches eliminated
```

This is an important practical optimization in backtracking and branch-and-bound.

---

## 22. Search-Space Representation

The state should contain only information needed to determine future decisions.

Bad state:

```text
entire history + redundant data
```

Better state:

```text
minimal sufficient information
```

Smaller state can mean:

- less memory,
- faster hashing/memoization,
- fewer distinct states,
- easier correctness reasoning.

---

## 23. State Compression

Suppose two different histories produce the same future-relevant state.

If future decisions and outcomes depend only on that state, the histories are computationally equivalent.

Therefore they can share one computed result.

This is the fundamental idea behind:

```text
memoization
DP
state compression
transposition tables
```

---

## 24. Recursion and Trees

Tree algorithms naturally map recursive calls to child states.

Example:

```js
function height(node) {
  if (!node) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}
```

State:

```text
current node
```

Transitions:

```text
node → left child
node → right child
```

The recursion mirrors the data structure.

---

## 25. DFS as Recursive State Search

Depth-first search can be expressed recursively:

```text
visit node
↓
mark state
↓
visit each unvisited neighbor
```

The visited set is part of the algorithmic state.

Without it, cyclic graphs can cause repeated traversal or infinite recursion.

Therefore DFS correctness depends on both:

```text
recursion structure
+
state tracking
```

---

## 26. BFS and the Same State-Space Idea

BFS is usually implemented iteratively with a queue, but the underlying model is still state-space exploration.

```text
current frontier
↓
next reachable states
↓
next frontier
```

The queue stores pending states.

The visited set prevents duplicate exploration.

So recursion is only one way to traverse a state space.

---

## 27. Recursion and Dynamic Programming

Dynamic programming can be understood as:

```text
recursive state definition
+
overlapping states
+
state reuse
```

Top-down DP:

```text
recursive formulation
↓
memoize states
```

Bottom-up DP:

```text
identify state dependencies
↓
compute states in dependency order
```

The important idea is state structure, not whether recursion syntax appears.

---

## 28. Top-Down vs Bottom-Up

### Top-down

Advantages:

- mirrors recursive reasoning,
- computes only reachable states,
- often easier to derive.

Costs:

- recursion stack,
- function-call overhead,
- possible deep recursion.

### Bottom-up

Advantages:

- explicit control over memory,
- no recursive stack,
- predictable iteration.

Costs:

- may compute states that are never needed,
- dependency ordering must be designed carefully.

---

## 29. Recursive Complexity Through Recurrences

For each recursive function:

1. Identify number of recursive calls.
2. Determine the size of each subproblem.
3. Determine non-recursive work.
4. Write the recurrence.
5. Solve or bound the recurrence.
6. Analyze maximum recursion depth.

Example:

```text
T(n) = T(n - 1) + O(1)
```

vs:

```text
T(n) = 2T(n - 1) + O(1)
```

A single change in branching factor changes the complexity dramatically.

---

## 30. Search Tree Complexity Is Often More Important Than Syntax

Consider two implementations:

```text
recursive
```

and:

```text
iterative
```

They can have exactly the same computational complexity.

Likewise, rewriting recursive code iteratively does not automatically make an exponential search polynomial.

The key quantity is:

```text
number of states explored
```

not whether the code contains a recursive function.

---

## 31. Memoization Changes the Search Structure

Without memoization:

```text
same state reached repeatedly
↓
recompute
```

With memoization:

```text
same state reached repeatedly
↓
lookup cached result
```

The algorithm changes from path-based exploration toward unique-state evaluation.

This is why memoization can produce exponential-to-polynomial improvements.

---

## 32. When Memoization Does Not Help Much

Memoization helps when many paths reach the same state.

If every state is unique:

```text
no overlap
```

then caching may add memory and lookup overhead without eliminating much work.

Examples of high overlap:

```text
Fibonacci
grid paths with repeated coordinates
many DP problems
```

Low overlap:

```text
some permutation enumeration problems
```

You must inspect state identity before adding a cache.

---

## 33. Search With Constraints

Constraints can shrink a search tree.

Suppose a partial solution already violates:

```text
sum <= target
```

and future choices can only increase the sum.

Then the branch can be pruned.

The key reasoning is:

```text
invariant + monotonic constraint
↓
future success becomes impossible
↓
prune safely
```

This connects pruning to earlier invariant reasoning.

---

## 34. Recursion and Monotonicity

Pruning is strongest when you can prove that a bad partial state cannot become good later.

Examples:

```text
current cost already exceeds best
```

```text
current sum already exceeds target and future additions are non-negative
```

```text
remaining capacity is insufficient
```

The proof depends on the direction in which future transitions can move the state.

---

## 35. Backend Application: Dependency Resolution

Dependency graphs can be explored recursively.

State may include:

```text
current package
visited packages
current dependency path
```

Cycle detection requires state tracking.

Memoization can avoid repeatedly resolving the same dependency subtree.

This is a practical example of recursive graph reasoning.

---

## 36. Backend Application: File/Tree Processing

Directory structures are naturally recursive:

```text
folder
├── file
├── folder
│   └── file
└── folder
```

Recursive traversal is often natural.

But production systems must consider:

- maximum depth,
- stack limits,
- symlink cycles,
- huge directories,
- cancellation,
- memory usage.

The theoretical algorithm is only part of the engineering problem.

---

## 37. Backend Application: Retry / Workflow State

A workflow can be represented as states:

```text
PENDING
  ↓
RUNNING
  ↓
SUCCESS
```

or:

```text
RUNNING
  ↓ failure
RETRYING
  ↓
RUNNING
```

State-transition reasoning helps identify invalid transitions and retry loops.

Recursive-looking workflows can become dangerous when progress is not guaranteed.

---

## 38. AI Application: Search Trees

AI systems frequently explore state spaces:

- planning,
- decoding,
- beam search,
- tree search,
- candidate generation,
- combinatorial optimization.

A state may contain:

```text
partial sequence
current score
constraints
available actions
```

The search tree can grow exponentially.

Therefore practical AI systems rely on:

- pruning,
- beam limits,
- caching,
- approximate search,
- heuristic ordering.

---

## 39. AI Application: Beam Search

Beam search limits the number of active states.

Instead of keeping every candidate:

```text
all states
```

keep only the best `B` states:

```text
candidate states
↓
score
↓
Top-B
↓
expand
```

This trades completeness for controlled computation.

It is a direct example of search-space management.

---

## 40. AI Application: Memoized Search

If multiple reasoning/search paths reach an equivalent state, cache the result.

The challenge is defining state equivalence correctly.

Too little state:

```text
incorrect cache reuse
```

Too much state:

```text
few cache hits
large memory
```

Therefore:

> Good memoization depends on a correct minimal sufficient state representation.

---

## 41. AI Application: Retrieval as Search

Retrieval can also be viewed as search:

```text
query state
↓
candidate generation
↓
candidate states
↓
score
↓
prune/select
```

ANN indexes reduce the effective search space.

Reranking reduces a candidate set rather than scoring the entire corpus with an expensive model.

This is search-tree thinking applied to retrieval pipelines.

---

## 42. Recursion Stack and JavaScript

JavaScript execution environments have finite call stacks.

A recursive algorithm with very large depth can fail even when its asymptotic time is acceptable.

For example:

```text
O(n) time
O(n) recursion depth
```

may be problematic for large n.

An iterative implementation may preserve the time complexity while moving state from the call stack into explicit data structures.

---

## 43. Explicit Stack vs Recursive Call Stack

These can represent essentially the same DFS state.

Recursive:

```text
call stack stores pending work
```

Iterative:

```text
explicit stack stores pending work
```

The algorithmic state is similar.

The engineering difference is control over:

- memory,
- depth,
- cancellation,
- debugging,
- scheduling.

---

## 44. Common Mistakes

### Mistake 1 — Thinking recursion automatically means O(n)

Branching determines the search-tree growth.

### Mistake 2 — Confusing depth with time

A shallow tree can still contain many nodes.

### Mistake 3 — Missing the real state

If the state is incomplete, memoization and correctness can fail.

### Mistake 4 — Forgetting progress

Every recursive path needs a route toward a base case.

### Mistake 5 — Mutating backtracking state without undoing

Sibling branches then inherit incorrect state.

### Mistake 6 — Assuming pruning changes worst-case complexity

Pruning often improves practical behavior but may leave the theoretical worst case unchanged.

### Mistake 7 — Memoizing the wrong state

Incorrect state equivalence produces incorrect answers.

### Mistake 8 — Ignoring recursion depth in JavaScript

Large linear recursion can overflow the call stack.

### Mistake 9 — Believing iterative code is automatically faster asymptotically

Changing syntax does not change the search space.

### Mistake 10 — Ignoring cycles in graph recursion

Visited-state tracking is essential when the state space contains cycles.

---

## 45. Recursion Design Checklist

Before implementing recursion:

```text
1. What is the state?
2. What does the state mean?
3. What is the base case?
4. What transitions are possible?
5. What decreases/increases toward termination?
6. How many branches exist?
7. How large is each subproblem?
8. Are states repeated?
9. Can repeated states be memoized?
10. Can invalid branches be pruned?
11. What is maximum depth?
12. What memory is held per call?
13. Can the state be represented more compactly?
14. Would an explicit stack be safer?
15. What happens in the worst case?
```

---

## 46. Expert Mental Model

Think of recursion as:

```text
State
  ↓
Choices
  ↓
Transitions
  ↓
Search tree
  ↓
Repeated states?
  ↓
Prune?
  ↓
Memoize?
  ↓
Bound search
```

The recursive syntax is only the implementation mechanism.

The real object being analyzed is the state space.

---

## 47. Key Takeaways

1. Recursion is state-transition reasoning expressed through function calls.
2. Every recursive algorithm needs a state, base case, transition, and progress measure.
3. Linear recursion usually has linear depth/work.
4. Constant-factor shrinking creates logarithmic depth.
5. Divide-and-conquer creates recursion trees whose levels can be analyzed independently.
6. Branching recursion can create exponential search spaces.
7. Recursion depth and total work are different measurements.
8. Repeated states are the key opportunity for memoization.
9. Memoization converts repeated path computation into unique-state computation.
10. Backtracking requires precise state restoration.
11. Pruning controls the search space by proving branches cannot succeed or improve the answer.
12. Branch ordering can improve practical pruning.
13. State should contain minimal sufficient information.
14. DFS, DP, backtracking, and many AI searches are state-space exploration problems.
15. Iterative and recursive implementations can represent the same underlying state machine.
16. JavaScript recursion depth is a practical engineering constraint.
17. Backend workflows, dependency graphs, and tree processing benefit from state-transition reasoning.
18. AI planning, beam search, decoding, and retrieval all involve search-space management.
19. The most important question is not “Where is the recursive call?” but “How many states can the algorithm explore?”
20. Expert recursion analysis is search-space analysis.

---

## Revision Checklist

- [ ] I can define the state of a recursive problem.
- [ ] I can identify a correct base case.
- [ ] I can state the progress measure.
- [ ] I can derive a recurrence from recursive code.
- [ ] I can distinguish recursion depth from total work.
- [ ] I can draw a recursion tree.
- [ ] I understand branching factor.
- [ ] I can identify exponential search spaces.
- [ ] I can identify overlapping states.
- [ ] I can explain memoization as state reuse.
- [ ] I can distinguish a search tree from a state graph.
- [ ] I can design correct backtracking state restoration.
- [ ] I can identify safe pruning conditions.
- [ ] I understand why pruning may improve practical runtime without changing worst-case Big-O.
- [ ] I can reason about DFS as state-space traversal.
- [ ] I can compare recursive and iterative DFS.
- [ ] I can explain top-down vs bottom-up DP.
- [ ] I can reason about recursion-stack limits in JavaScript.
- [ ] I can apply search-tree reasoning to backend workflows.
- [ ] I can apply search-space reasoning to AI search and retrieval.
