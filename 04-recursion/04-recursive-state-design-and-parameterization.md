# 04.4 — Recursive State Design & Parameterization

## Purpose

The hardest part of many recursive algorithms is not writing the recursive call. It is deciding **what the recursive state should contain**.

A well-designed recursive function answers:

```text
What does this call represent?
What information must it know?
What information can be discarded?
How does the state transition?
```

This chapter develops recursive state design as a first-class algorithmic skill.

---

# 1. Recursion Is a Function Over State

Instead of thinking:

```text
function calls itself
```

think:

```text
solve(state)
```

The recursive algorithm transforms:

```text
state → nextState → nextState → ...
```

The function parameters are the representation of that state.

---

# 2. What Is Recursive State?

Recursive state is the minimum information required to define the remaining subproblem.

Examples:

```text
array traversal → index
binary search → left, right
palindrome → left, right
subset generation → index, current selection
tree traversal → node
knapsack-style recursion → index, remaining capacity
```

The state is not necessarily the entire input.

---

# 3. The Sufficient-State Principle

A recursive call should receive enough information to determine the correct remaining computation.

Formally:

> If two execution histories produce the same recursive state, and all future decisions depend only on that state, they represent the same remaining subproblem.

This idea becomes the foundation of memoization and dynamic programming.

---

# 4. State vs Input

Input is the original problem data.

State is the information that changes during recursive execution.

Example:

```js
function sum(arr, index) {
  // arr = fixed input
  // index = changing state
}
```

Conceptually:

```text
Input: arr
State: index
```

Separating these concepts makes recursive reasoning much easier.

---

# 5. State vs Local Temporary Variables

Not every local variable needs to become a recursive parameter.

Suppose:

```js
const next = index + 1;
```

If `next` can always be reconstructed from `index`, storing both is redundant.

Prefer:

```text
minimum sufficient state
```

rather than duplicating derivable information.

---

# 6. State Compression

Suppose a problem appears to require:

```text
entire processed history
```

but future decisions only depend on:

```text
running sum
```

Then the history can be compressed to the sum.

This reduces state size and simplifies the recursion.

The important question is:

> What information from the past can actually influence the future?

---

# 7. Example: Array Sum

Naive conceptual state:

```text
entire prefix + index
```

Sufficient state:

```text
index
```

because the input array remains available and the remaining answer is determined by the suffix starting at `index`.

---

# 8. Example: Accumulated Result

Another valid design is:

```text
(index, total)
```

where `total` represents the contribution already processed.

Now the invariant can be:

> `total` equals the sum of all elements before `index`.

Both designs can be correct:

```text
return-style recursion
accumulator-style recursion
```

Choose based on clarity, stack behavior, and required output construction.

---

# 9. State Transition

A recursive algorithm is easier to understand as:

```text
current state
→ transition
→ next state
```

Example:

```text
(index, total)
→ (index + 1, total + arr[index])
```

The transition must preserve the state invariant.

---

# 10. State Invariant

Define what every recursive state means.

Example:

```text
solve(index)
```

Invariant:

> The function is responsible for solving exactly the suffix beginning at `index`.

This is stronger than saying:

> “It processes the array recursively.”

Precise state meaning makes proofs possible.

---

# 11. Parameter Semantics

Every recursive parameter should have a precise meaning.

Bad:

```text
count
```

Better:

```text
number of elements selected so far
```

Bad:

```text
limit
```

Better:

```text
remaining capacity that the current branch may consume
```

Precise names improve reasoning and reduce bugs.

---

# 12. Index Parameters

Index-based recursion is one of the most common forms.

```js
function solve(arr, index) {
  if (index === arr.length) return ...;
  return solve(arr, index + 1);
}
```

Advantages:

- avoids copying;
- explicit progress;
- predictable stack depth;
- easy complexity analysis.

---

# 13. Range Parameters

Two indices can represent a subproblem interval.

```text
(left, right)
```

Used for:

- binary search;
- palindrome checking;
- divide-and-conquer;
- partitioning;
- recursive range processing.

The range itself becomes the state.

---

# 14. Multiple State Dimensions

Some problems require several independent dimensions.

Example:

```text
(index, remainingCapacity)
```

Another:

```text
(row, column)
```

Another:

```text
(index, selectedCount)
```

The number of independent dimensions strongly affects the number of possible states.

---

# 15. State-Space Size

If:

```text
index ∈ [0, N]
capacity ∈ [0, C]
```

there may be approximately:

```text
O(NC)
```

unique states.

This observation becomes important when recursion starts producing repeated states.

---

# 16. Repeated States

Consider a recursive algorithm that reaches:

```text
solve(5, 10)
```

from two different paths.

If the future computation depends only on `(5, 10)`, solving it twice is redundant.

Memoization can store:

```text
memo[5][10]
```

and reuse the result.

---

# 17. History vs State

Two different histories can produce the same state.

Example:

```text
Path A → state S
Path B → state S
```

If both have identical future possibilities, their histories are irrelevant after reaching `S`.

This is one of the most important transitions from recursion to dynamic programming.

---

# 18. State Explosion

Adding parameters increases the state space.

For example:

```text
index
```

may produce `O(N)` states.

But:

```text
index + capacity
```

may produce `O(NC)` states.

Adding unnecessary dimensions can make an algorithm dramatically more expensive.

---

# 19. State Minimization

Ask:

```text
Can this parameter be derived?
Can this history be summarized?
Can two states be considered equivalent?
Can one dimension be eliminated?
```

State minimization can improve both:

- runtime;
- memory.

---

# 20. State Representation and Correctness

Do not minimize state blindly.

If a discarded variable affects future decisions, removing it changes the problem.

Therefore state compression requires proof:

```text
discarded information
→ cannot distinguish future outcomes
```

This is the same reasoning used in algorithmic optimization generally.

---

# 21. Mutable Shared State

Recursive algorithms may maintain shared structures:

```js
const path = [];
```

A branch may:

```text
push
→ recurse
→ pop
```

The recursive state is partly represented by function arguments and partly by shared mutable state.

This requires explicit restoration invariants.

---

# 22. Copying State vs Sharing State

Two strategies:

```text
copy state for every call
```

or:

```text
share one mutable state and restore it
```

Copying is simpler conceptually but may increase memory and allocation.

Sharing can be efficient but is easier to get wrong.

Choose deliberately.

---

# 23. Persistent-Style State

Instead of mutating shared state, a recursive call can create a new logical state.

Conceptually:

```text
state A
→ state B
```

Advantages:

- easier isolation;
- fewer restoration bugs.

Costs:

- copying/allocation;
- memory pressure;
- potentially higher runtime.

---

# 24. State Ownership

For every mutable recursive structure, ask:

```text
Who owns it?
Who can modify it?
When is modification valid?
When must it be restored?
Can sibling branches observe the mutation?
```

This is particularly important in production JavaScript.

---

# 25. Recursive State for Search

A search problem may use:

```text
current position
remaining choices
partial answer
```

Example:

```text
(index, path)
```

The recursive transition chooses an option and moves to a new state.

This is the foundation of backtracking.

---

# 26. Recursive State for Divide-and-Conquer

Divide-and-conquer commonly uses:

```text
(left, right)
```

The state identifies a subproblem interval.

Then:

```text
divide interval
→ solve left state
→ solve right state
→ combine
```

State design directly determines the recursion structure.

---

# 27. Recursive State for Trees

For tree algorithms:

```text
node
```

may be sufficient for simple traversal.

But more advanced problems may require:

```text
node + parent information
node + depth
node + accumulated value
node + constraint
```

Add information only when future decisions require it.

---

# 28. Recursive State for Grid Problems

A grid recursion might use:

```text
(row, column)
```

but often also needs:

```text
visited
```

or another representation preventing cycles.

The state is therefore not just location; it may include the relevant history summary.

---

# 29. State and Cycle Prevention

Pure recursive descent naturally terminates when the state strictly shrinks.

Graph-like recursion can revisit a previous state.

Example:

```text
A → B → C → A
```

A visited structure may be required.

This is why recursion over graphs is different from recursion over simple trees.

---

# 30. Backend Applications

Recursive state design maps directly to:

- workflow execution state;
- dependency traversal;
- hierarchical permissions;
- nested document transformation;
- recursive configuration processing.

Production systems should keep state explicit and bounded whenever possible.

---

# 31. AI Applications

Recursive state appears in:

- search trees;
- candidate generation;
- recursive parsing;
- hierarchical retrieval;
- beam-style exploration;
- planning/search problems.

A useful AI question is:

> What information from the search history is actually required to choose the next action?

That is state design.

---

# 32. State Design Procedure

Before writing recursive code:

```text
1. Define the remaining subproblem.
2. Identify the minimum information that describes it.
3. Separate fixed input from changing state.
4. Remove derivable parameters.
5. Define the state invariant.
6. Define the transition.
7. Define terminal states.
8. Check whether different paths can reach the same state.
9. Estimate state-space size.
10. Decide whether state should be copied or shared.
```

---

# 33. Expert Questions

For every recursive function ask:

```text
What exactly does solve(state) mean?
What does each parameter represent?
Which values are fixed input?
Which values change?
Which values are derivable?
What information from history matters?
Can two paths reach the same state?
What is the state-space size?
What invariant holds?
How does the transition preserve it?
```

If these answers are unclear, the recursive design is probably unclear.

---

# 34. Revision Checklist

- [ ] Can I define recursion as a function over state?
- [ ] Can I separate input from recursive state?
- [ ] Can I identify the minimum sufficient state?
- [ ] Can I remove redundant parameters?
- [ ] Can I define precise parameter semantics?
- [ ] Can I model one-dimensional and range state?
- [ ] Can I reason about multi-dimensional state spaces?
- [ ] Can I detect repeated states?
- [ ] Can I explain why memoization can reuse equivalent states?
- [ ] Can I reason about state explosion?
- [ ] Can I compare copying state vs sharing mutable state?
- [ ] Can I define restoration requirements?
- [ ] Can I design recursive state for search, trees, and grids?
- [ ] Can I connect recursive state design to backend and AI systems?

# Key Takeaways

1. The recursive function is best understood as `solve(state)`.
2. Parameters are a representation of the remaining subproblem.
3. State should contain the minimum information needed for future decisions.
4. Fixed input and changing state should be conceptually separated.
5. Removing redundant state can reduce both complexity and memory.
6. Two different histories may represent the same future-relevant state.
7. Repeated states are the bridge from recursion to memoization and dynamic programming.
8. Shared mutable state requires ownership and restoration reasoning.
9. State design determines the shape and size of the recursion tree/state space.
10. Strong recursive solutions are designed by defining state and invariant before writing the recursive call.
