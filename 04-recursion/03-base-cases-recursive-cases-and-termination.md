# 04.3 — Base Cases, Recursive Cases & Termination

## Purpose

A recursive function is correct only when its recursion is **well-founded**: every execution path must eventually reach a valid terminal state.

This chapter develops the discipline to design and verify:

- base cases;
- recursive cases;
- progress measures;
- termination arguments;
- multiple terminal states;
- invalid states;
- boundary-driven recursion;
- recursive contracts.

The central principle is:

> **A base case stops recursion; a progress measure proves that the base case can be reached.**

---

# 1. Base Case vs Recursive Case

Every recursive design should answer two questions:

```text
When can I answer immediately?
How do I reduce the remaining problem?
```

Example:

```js
function sumTo(n) {
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}
```

Here:

```text
Base case:     n === 0
Recursive case: n + sumTo(n - 1)
```

---

# 2. A Base Case Is a Mathematical Boundary

Do not choose a base case merely because it is convenient to code.

The base case should represent a problem whose answer is already known.

Examples:

```text
factorial(0) = 1
empty array sum = 0
null tree = empty result
search interval with left > right = not found
empty string = 0 characters
```

The correct boundary depends on the problem's mathematical definition.

---

# 3. Base Case Must Be Reachable

This is a subtle but critical distinction.

A function can contain a base case and still fail to terminate.

```js
function f(n) {
  if (n === 0) return;
  f(n + 1);
}
```

The base case exists, but positive `n` moves away from it.

Therefore:

```text
base case exists
≠
base case is reachable
```

---

# 4. Progress Measure

Define a quantity that moves toward a terminal boundary.

Examples:

```text
n → n - 1
index → index + 1
right - left → smaller interval
remaining choices → fewer choices
remaining nodes → fewer nodes
```

A valid progress measure should not move indefinitely without reaching the terminal condition.

---

# 5. Well-Founded Progress

For simple recursion, progress often looks like:

```text
n, n-1, n-2, ..., 0
```

For more complex recursion, the measure may be:

```text
remaining elements
```

or:

```text
(left, right)
```

where the interval continuously shrinks.

The deeper idea is that the recursive transition must move through a well-founded set toward termination.

---

# 6. Recursive Contract

Treat a recursive function like a normal function contract.

Define:

```text
Precondition
State meaning
Base condition
Recursive transition
Postcondition
```

Example for recursive array sum:

```text
Precondition:
index is within [0, arr.length]

State:
index identifies the next element to process

Base:
index === arr.length

Transition:
index + 1

Postcondition:
returns sum of arr[index...] from the original state
```

---

# 7. The Smaller-Problem Requirement

The recursive case should solve a genuinely smaller or simpler problem.

Good:

```text
sum(n) → sum(n - 1)
```

Good:

```text
search(left, right) → search(smaller interval)
```

Suspicious:

```text
solve(state) → solve(state)
```

or:

```text
solve(n) → solve(n + 1)
```

Unless another argument guarantees progress, these are dangerous.

---

# 8. One Base Case Is Not Always Enough

Some recursive problems have several terminal conditions.

For search:

```text
success → target found
failure → search space exhausted
```

For backtracking:

```text
invalid branch → stop
complete solution → record answer
```

For tree traversal:

```text
null node → stop
```

Design terminal states according to the state machine, not a fixed template.

---

# 9. Success and Failure Base Cases

Consider:

```text
search(state)
```

Possible outcomes:

```text
SUCCESS
FAILURE
CONTINUE
```

This is often clearer than forcing everything into one base case.

The recursive case handles `CONTINUE`.

---

# 10. Invalid-State Base Cases

Backtracking often terminates early when a partial solution cannot become valid.

Example:

```text
remaining capacity < 0
```

can be an invalid terminal state.

This is called **pruning**.

The pruning condition must be proven safe:

> Once the state is invalid, no descendant state can become a valid solution.

---

# 11. Base Cases and Invariants

A strong recursive design connects the base case to the invariant.

Example:

```text
Invariant:
processed prefix is represented correctly by state.

Base:
all elements have been processed.

Conclusion:
state now represents the complete answer.
```

The base case is therefore not just a stopping condition; it is where the invariant becomes sufficient to establish the result.

---

# 12. Termination Proof Template

Use this template:

```text
1. Define a progress measure M.
2. Show M is valid for every active recursive state.
3. Show every recursive transition strictly progresses M.
4. Show M cannot decrease forever.
5. Therefore recursion eventually reaches a base case.
```

For simple integer recursion, this may be trivial.

For state-space algorithms, it becomes essential.

---

# 13. Example: Recursive Array Traversal

```js
function process(arr, index) {
  if (index === arr.length) return;

  process(arr, index + 1);
}
```

Progress measure:

```text
arr.length - index
```

Each call decreases it by one.

Eventually:

```text
index === arr.length
```

and the base case executes.

---

# 14. Example: Shrinking Search Interval

```text
search(left, right)
```

If each transition removes part of the interval:

```text
right - left
```

strictly decreases.

Eventually:

```text
left > right
```

and the search terminates.

This is the foundation of recursive binary search.

---

# 15. Example: Two-Ended Recursion

Palindrome checking can use:

```text
(left, right)
```

Transition:

```text
left + 1
right - 1
```

Progress measure:

```text
right - left
```

The interval shrinks until:

```text
left >= right
```

which is the terminal condition.

---

# 16. Multiple Recursive Branches

Termination must hold for **every branch**.

Example:

```text
solve(state)
├── transition A
├── transition B
└── transition C
```

It is not enough for one branch to reach a base case.

Every reachable branch must make valid progress or terminate immediately.

---

# 17. Branch-Specific Progress

Different branches may reduce the state differently.

For example:

```text
branch A → remove one element
branch B → remove two elements
```

Both are valid if every branch moves toward termination.

The exact amount of reduction can differ; the important property is guaranteed progress.

---

# 18. Recursion With Multiple Parameters

Sometimes no single parameter decreases.

Example state:

```text
(index, remaining)
```

A branch might:

```text
index + 1
remaining unchanged
```

Another might:

```text
index + 1
remaining - 1
```

Termination can be reasoned about using a combined measure such as remaining input positions or a lexicographic measure.

---

# 19. Lexicographic Progress

For complex recursive states, use ordered tuples conceptually.

Example:

```text
(a, b)
```

Progress may mean:

```text
(a decreases)
OR
(a stays equal AND b decreases)
```

This is useful when one phase completes before another begins.

It will become important in advanced algorithmic proofs.

---

# 20. Avoiding Accidental Non-Termination

Watch for:

```text
missing argument update
wrong increment/decrement
incorrect boundary comparison
repeated same state
transition away from base
branch that never reduces work
```

When reviewing recursive code, compare the current state and next state explicitly.

---

# 21. Infinite Recursion Example

Bad:

```js
function f(n) {
  if (n <= 0) return;
  f(n + 1);
}
```

For positive `n`, the state moves away from `n <= 0`.

Correct direction:

```js
f(n - 1);
```

The lesson is simple:

> Verify the direction of progress, not just the existence of a boundary.

---

# 22. Recursive Cases Can Be Correct but Inefficient

Termination does not imply efficiency.

Naive Fibonacci terminates:

```text
fib(n)
├── fib(n-1)
└── fib(n-2)
```

But it repeats many states.

Therefore analyze two independent properties:

```text
Correctness/termination
Complexity
```

A terminating algorithm can still be computationally impractical.

---

# 23. Base Case Granularity

Sometimes a larger base case simplifies recursion.

For example, instead of recursively processing a singleton and then handling it elsewhere, a function may terminate for:

```text
length <= 1
```

This is often useful in divide-and-conquer algorithms.

Choose the smallest clean boundary that makes the recursive transition correct.

---

# 24. Base Cases and Edge Cases

Always inspect:

```text
empty input
singleton input
minimum valid input
maximum boundary
invalid input if contract allows it
already-complete state
no-solution state
```

Many recursion bugs are boundary bugs disguised as algorithm bugs.

---

# 25. Defensive Validation vs Algorithmic Base Cases

Do not confuse input validation with algorithmic termination.

Example:

```text
invalid argument → throw/return validation error
valid smallest state → algorithmic base case
```

The distinction keeps the recursive contract clear.

---

# 26. Termination and Untrusted Input

Backend systems may process deeply nested or adversarial input.

Even a terminating recursive algorithm can fail operationally because:

```text
recursion depth becomes too large
```

Therefore production code should consider:

- maximum depth;
- input limits;
- iterative conversion;
- explicit stacks;
- resource budgets.

---

# 27. Termination in Search Spaces

For backtracking, the progress measure is often:

```text
number of decisions made
```

or:

```text
number of remaining choices
```

Every recursive step advances the decision depth or reduces remaining choices.

This makes finite search spaces terminate even when there are many branches.

---

# 28. Safe Pruning

A pruning base case is valid only when:

```text
current state cannot possibly lead to a valid answer
```

Examples:

```text
capacity < 0
partial cost already exceeds proven bound
constraint violated
```

Never prune merely because a branch “looks unlikely.”

That changes correctness into heuristic behavior.

---

# 29. Backend Applications

Termination reasoning matters for:

- recursive JSON transformations;
- dependency traversal;
- nested configuration processing;
- hierarchical permissions;
- workflow evaluation.

Production systems should define depth/resource limits for untrusted or arbitrarily deep structures.

---

# 30. AI Applications

Termination and base-case design apply to:

- recursive search;
- beam/search-tree exploration;
- recursive parsing;
- hierarchical document traversal;
- candidate generation.

AI search often adds explicit budgets such as:

```text
maximum depth
maximum nodes
maximum time
beam width
```

These are operational termination controls.

---

# 31. Base Case + Recursive Case Design Procedure

Before coding:

```text
1. Define the state.
2. Define the smallest solvable state.
3. Define every terminal outcome.
4. Define the recursive transition.
5. Identify the progress measure.
6. Prove every branch progresses.
7. Define the return/combine step.
8. Estimate depth.
9. Estimate total work.
10. Test boundary states.
```

---

# 32. Expert Review Questions

When reviewing recursive code, ask:

```text
What is the state?
What does each parameter mean?
What are all base cases?
Can every base case be reached?
What decreases?
Does every branch progress?
Can the same state recur?
Can a branch become invalid?
Is pruning safe?
What is the maximum depth?
What is the total number of calls?
What happens for adversarial input?
```

---

# 33. Revision Checklist

- [ ] Can I distinguish a base case from a validation check?
- [ ] Can I define a mathematically meaningful base case?
- [ ] Can I prove the base case is reachable?
- [ ] Can I identify a progress measure?
- [ ] Can I prove every recursive branch progresses?
- [ ] Can I use a combined or lexicographic measure when necessary?
- [ ] Can I identify success, failure, and invalid-state base cases?
- [ ] Can I connect the base case to the recursive invariant?
- [ ] Can I prove termination independently from complexity?
- [ ] Can I detect accidental repeated-state recursion?
- [ ] Can I reason about termination under untrusted backend input?
- [ ] Can I explain termination budgets in AI search?

# Key Takeaways

1. A recursive function needs a valid terminal boundary and a transition that reaches it.
2. A base case existing in code does not prove termination.
3. Progress measures make termination explicit and provable.
4. Every reachable recursive branch must terminate.
5. Success, failure, and invalid-state base cases are all legitimate.
6. Safe pruning requires proof that discarded states cannot produce valid answers.
7. Termination and efficiency are separate properties.
8. Recursive correctness becomes much easier when state, invariant, and base case are designed together.
9. Deep recursion can be operationally unsafe even when mathematically terminating.
10. The same reasoning will support backtracking, trees, divide-and-conquer, and dynamic programming.
