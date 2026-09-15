# 04.2 — Recursion State, Call Stack & Execution Tracing

## Purpose

This chapter turns recursion from a syntax pattern into an execution model.

The central question is:

> **What exactly is happening to state while recursive calls go down and return back up?**

You will learn to trace recursive execution, identify stack frames, distinguish local state from shared state, and reason about recursion depth and total work.

---

# 1. Recursion Is State Over Time

A recursive function can be modeled as:

```text
current state
→ recursive transition
→ new state
→ recursive transition
→ base state
→ return
→ previous state resumes
```

For example:

```js
function sumTo(n) {
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}
```

The changing state is primarily `n`.

The caller also retains the work needed after the recursive call returns.

---

# 2. What a Stack Frame Represents

Conceptually, each active call has:

```text
function invocation
parameters
local variables
return location
intermediate computation
```

For:

```js
sumTo(3)
```

the stack conceptually becomes:

```text
sumTo(3)
sumTo(2)
sumTo(1)
sumTo(0)
```

Each frame waits for its child call to finish.

---

# 3. CALL Phase

During the downward phase:

```text
sumTo(3)
→ sumTo(2)
→ sumTo(1)
→ sumTo(0)
```

No final result has yet been reconstructed.

The stack grows as calls remain active.

This determines recursion depth.

---

# 4. RETURN Phase

After reaching the base case:

```text
sumTo(0) → 0
```

The previous frame resumes:

```text
sumTo(1) → 1 + 0 = 1
sumTo(2) → 2 + 1 = 3
sumTo(3) → 3 + 3 = 6
```

The stack shrinks as frames return.

---

# 5. Downward vs Upward Work

A recursive function can do work:

```text
before recursive call
```

and/or:

```text
after recursive call
```

Example:

```js
function visit(n) {
  if (n === 0) return;

  console.log("down", n);
  visit(n - 1);
  console.log("up", n);
}
```

Output:

```text
down 3
down 2
down 1
up 1
up 2
up 3
```

This distinction is fundamental for tree traversals and backtracking.

---

# 6. Return Values Flow Upward

Consider:

```js
function f(n) {
  if (n === 0) return 10;
  return f(n - 1) + 1;
}
```

The base result moves upward through every caller.

A common beginner error is understanding the recursive call but not understanding how its return value becomes part of the caller's result.

---

# 7. Trace Table Method

For difficult recursion, create a table:

| Call | State | Action | Return |
|---|---|---|---|
| `f(3)` | 3 | call `f(2)` | pending |
| `f(2)` | 2 | call `f(1)` | pending |
| `f(1)` | 1 | call `f(0)` | pending |
| `f(0)` | 0 | base case | known |

Then fill the return column upward.

This is often easier than mentally simulating the stack.

---

# 8. Recursion Depth

Recursion depth is the maximum number of simultaneously active calls.

For:

```js
f(n) → f(n - 1)
```

the depth is typically `O(n)`.

For binary search:

```text
n → n/2 → n/4 → ...
```

the depth is `O(log n)`.

Depth is a **space** concern, not automatically a time complexity.

---

# 9. Total Calls vs Depth

These must not be confused.

A recursive function may have:

```text
Depth = O(n)
Total calls = O(n)
```

or:

```text
Depth = O(n)
Total calls = O(2^n)
```

The second situation occurs in branching recursion such as naive Fibonacci.

---

# 10. Branching Recursion

Example:

```js
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
```

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

This introduces the idea of overlapping subproblems, which later leads to memoization and dynamic programming.

---

# 11. Call Tree Is Not the Same as State Graph

A recursion tree represents **calls**.

A state graph represents **unique states and transitions**.

If the same state is reached multiple times:

```text
call tree → duplicates
state graph → one logical state
```

Memoization can exploit this distinction.

---

# 12. Local State vs Shared State

Consider:

```js
function f(n) {
  const value = n;
  if (n === 0) return;
  f(n - 1);
}
```

Each call has its own `value`.

But an outer array can be shared:

```js
function f(arr, index) {
  arr[index] = ...;
  f(arr, index + 1);
}
```

Now all frames may observe the same mutable object.

This distinction becomes critical in backtracking.

---

# 13. Primitive Parameters vs Object References

JavaScript passes argument values.

For objects and arrays, the value passed is a reference to the object.

Therefore:

```js
function change(obj) {
  obj.x = 10;
}
```

can mutate the same object visible to the caller.

Recursive algorithms must explicitly reason about this behavior.

---

# 14. Mutation and Restoration

Backtracking commonly uses:

```text
make change
→ recurse
→ undo change
```

Example structure:

```js
path.push(choice);
search(nextState);
path.pop();
```

The `pop()` is not cosmetic.

It restores the invariant required by sibling branches.

---

# 15. Execution Tracing With Side Effects

Consider:

```js
function f(n) {
  if (n === 0) return;
  console.log(n);
  f(n - 1);
  console.log(n * 10);
}
```

The first log occurs during descent.

The second occurs during ascent.

Tracing this manually builds the mental model required for tree traversals and recursive generation.

---

# 16. Recursive Accumulators

Compare:

```js
function sum(n) {
  if (n === 0) return 0;
  return n + sum(n - 1);
}
```

with:

```js
function sum(n, total = 0) {
  if (n === 0) return total;
  return sum(n - 1, total + n);
}
```

The second carries more work in the state.

However, in JavaScript you should still account for the recursive stack; do not assume accumulator style guarantees constant stack space.

---

# 17. Tail Position

A recursive call is in tail position when its result is returned directly without additional computation.

Example:

```js
return sum(n - 1, total + n);
```

This is structurally tail-recursive.

But JavaScript environments do not provide a general practical guarantee of proper tail-call optimization across common Node.js execution environments.

Therefore:

```text
Tail-recursive source code
≠ automatically O(1) stack space in JavaScript
```

---

# 18. Stack Depth and Input Shape

Depth depends on how the recursive algorithm moves through input.

A recursive tree traversal can have:

```text
balanced tree → O(log N) depth
skewed tree   → O(N) depth
```

The same algorithm can therefore have very different practical stack behavior depending on input shape.

---

# 19. Recursive Binary Search Trace

For a sorted array:

```text
left = 0
right = N - 1
mid = floor((left + right) / 2)
```

Each recursive call reduces the search interval.

Conceptually:

```text
[N elements]
→ [N/2]
→ [N/4]
→ [N/8]
```

Depth is `O(log N)`.

The recursive state is the search interval.

---

# 20. Recursive State Must Be Sufficient

A recursive call must receive enough information to solve its subproblem.

Too little state causes incorrect results.

Too much state can cause:

- unnecessary memory;
- harder proofs;
- accidental coupling;
- larger function interfaces.

State design is algorithm design.

---

# 21. State Transition Table

For complex recursion, explicitly write:

| Current state | Choice/transition | Next state |
|---|---|---|
| `(index, total)` | consume `arr[index]` | `(index+1, total+value)` |
| `(left, right)` | discard one half | smaller interval |
| `(node)` | visit child | child state |

This makes recursion much easier to reason about.

---

# 22. Base Case Categories

Common base cases include:

### Empty input

```text
length === 0
```

### Singleton

```text
length === 1
```

### Boundary index

```text
index === length
```

### Search interval exhausted

```text
left > right
```

### Null node

```text
node === null
```

Choose the base case based on the recursive state.

---

# 23. Multiple Base Cases

Some problems need several terminal states.

Example:

```text
invalid state → failure
completed state → success
```

Backtracking often has:

```text
invalid branch
successful complete branch
```

Do not force every recursive problem into one base case.

---

# 24. Recursive State Bugs

A recursive algorithm can fail even with a correct base case.

Typical causes:

```text
wrong state transition
state not updated
state updated too far
shared mutation not restored
wrong return propagation
missing branch
duplicate branch
```

When debugging recursion, inspect the **first incorrect state**, not merely the final incorrect output.

---

# 25. Complexity From Execution Structure

For each recursive algorithm determine:

```text
number of calls
work per call
branching factor
problem-size reduction
maximum depth
```

Then derive:

```text
Time
Space
```

Do not infer complexity from the presence of recursion alone.

---

# 26. Backend Applications

Execution tracing helps with recursive backend workloads such as:

- nested configuration traversal;
- hierarchical authorization;
- dependency resolution;
- directory traversal;
- recursive data transformation.

For untrusted or deeply nested input, explicit stacks may be safer than call-stack recursion.

---

# 27. AI Applications

The same execution model appears in:

- search trees;
- recursive parsing;
- hierarchical document traversal;
- candidate generation;
- backtracking search;
- recursive decomposition.

Understanding stack depth and branching helps estimate search cost and failure modes.

---

# 28. Execution Tracing Procedure

When given unfamiliar recursive code:

```text
1. Identify parameters.
2. Identify base cases.
3. Write the first call.
4. Follow one call downward.
5. Record state at every frame.
6. Stop at the base case.
7. Reverse direction.
8. Evaluate return values.
9. Record side effects before/after calls.
10. Count calls and maximum depth.
```

This procedure should become automatic.

---

# 29. Master Trace Template

Use this on paper:

```text
CALL STACK
──────────
f(input)
  f(smaller)
    f(smaller)
      base

RETURN FLOW
──────────
base → result
parent → combine
parent → combine
root → final result
```

For branching recursion, draw the complete small recursion tree.

---

# 30. Revision Checklist

- [ ] Can I explain what a recursive stack frame represents?
- [ ] Can I trace descent and ascent separately?
- [ ] Can I calculate recursion depth?
- [ ] Can I distinguish total calls from maximum depth?
- [ ] Can I distinguish a recursion tree from a state graph?
- [ ] Can I identify local vs shared mutable state?
- [ ] Can I trace return-value propagation?
- [ ] Can I identify tail position without assuming stack optimization?
- [ ] Can I derive recursive complexity from execution structure?
- [ ] Can I identify the first incorrect recursive state when debugging?
- [ ] Can I explain why recursion depth matters in JavaScript?

# Key Takeaways

1. Recursion is execution over changing state.
2. The call stack stores active frames waiting for deeper calls to return.
3. Descent and ascent are separate parts of recursive execution.
4. Maximum depth and total calls measure different things.
5. Branching recursion can have exponential total work even with linear depth.
6. Shared mutable state requires explicit ownership and restoration reasoning.
7. Recursive state must contain exactly the information needed by the subproblem.
8. Execution tracing is a practical debugging and correctness tool.
9. JavaScript does not make deep recursion automatically safe merely because the recursion is tail-positioned.
10. The same mental model will later support trees, backtracking, divide-and-conquer, and dynamic programming.
