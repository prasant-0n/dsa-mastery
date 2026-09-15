# 04.15 — Recursion → Iteration & Explicit Stack Transformation

## Purpose

Recursion is an execution model, not a requirement of the problem itself. Many recursive algorithms can be transformed into iterative algorithms by replacing the language call stack with an explicit data structure.

The central idea is:

> A recursive call stores execution state implicitly; an iterative algorithm stores equivalent state explicitly.

This chapter develops mechanical recursion-to-iteration transformation, explicit stacks, frame simulation, traversal order, accumulator preservation, backtracking state, and production trade-offs.

---

# 1. Why Transform Recursion?

Common reasons include:

- unbounded or adversarial input depth;
- JavaScript call-stack limitations;
- explicit memory control;
- easier cancellation and pausing;
- serialization of pending work;
- avoiding recursive function-call overhead in hot paths.

Recursion can still be clearer for naturally recursive structures.

---

# 2. Recursive Call as a Stack Frame

A recursive call frame conceptually stores:

```text
function identity
parameters
local variables
next instruction after recursive call
partial result
```

When transforming recursion, identify these pieces first.

---

# 3. Implicit vs Explicit Stack

Recursive:

```text
program call stack
    ↓
recursive frames
```

Iterative:

```text
const stack = []
    ↓
explicit frames
```

The algorithm can preserve the same logical execution state while changing who stores it.

---

# 4. Simple Linear Recursion

Recursive:

```text
solve(n)
→ solve(n - 1)
```

often becomes:

```text
while (n > base) {
    ...
    n--;
}
```

No explicit stack is needed when only one recursive call exists and no suspended branch state must be remembered.

---

# 5. Tail-Position Recursion

If the recursive call is the final operation:

```js
return solve(nextState);
```

an iterative loop is often straightforward.

The transformation preserves the accumulator/state explicitly.

---

# 6. Non-Tail Recursion

Consider:

```text
solve(n)
    result = solve(n - 1)
    return combine(result, n)
```

The caller must remember the pending `combine` operation.

An iterative translation may need an explicit stack of frames or an equivalent accumulator transformation.

---

# 7. Tree Traversal

Recursive preorder:

```text
process node
→ recurse left
→ recurse right
```

Iterative preorder:

```text
push root
while stack not empty:
    node = pop
    process node
    push right
    push left
```

Right is pushed first because the stack is LIFO.

---

# 8. Why Push Order Matters

A stack reverses insertion order.

To process:

```text
left before right
```

push:

```text
right
left
```

This is a general transformation rule for depth-first traversal.

---

# 9. Inorder Traversal

Inorder requires more explicit state because the node must wait until its left subtree is processed.

Typical iterative model:

```text
push left chain
→ pop node
→ process node
→ move to right subtree
```

The explicit stack represents suspended recursive calls.

---

# 10. Postorder Traversal

Postorder is harder because a node must wait for both children.

Common approaches:

```text
modified preorder + reverse output
```

or:

```text
explicit frames with child-processing state
```

The second approach mirrors recursion more directly.

---

# 11. Explicit Frame Model

A frame might contain:

```js
{
    node,
    state,
    partialResult
}
```

where `state` indicates the next operation:

```text
0 → process node / enter left
1 → left completed / enter right
2 → both completed / return
```

This is essentially a manual call stack.

---

# 12. Recursive Return Values

Recursive functions pass results upward automatically.

With explicit frames, you must decide where the child result goes.

Possible strategies:

```text
frame.result
parent frame field
separate result stack
shared accumulator
```

The chosen representation must preserve the original data flow.

---

# 13. Accumulator Transformation

Some recursive algorithms can avoid frames by converting upward result flow into an explicit accumulator.

Example concept:

```text
recursive sum
→ loop + total
```

This is usually preferable when the recurrence is naturally reducible to a linear fold.

---

# 14. Backtracking with an Explicit Stack

Recursive backtracking stores:

```text
current choices
next candidate
restoration point
```

An explicit frame can store exactly these fields.

Conceptually:

```text
frame = {
  state,
  nextChoice,
  choiceToUndo
}
```

---

# 15. DFS as Explicit Stack

Graph DFS can be written recursively or iteratively.

Recursive DFS:

```text
visit(v)
→ visit(neighbor)
```

Iterative DFS:

```text
push(start)
while stack:
    v = pop()
    process(v)
    push neighbors
```

The exact marking timing affects duplicate work and traversal semantics.

---

# 16. Marking Visited

For graphs, decide whether to mark:

```text
when discovered/pushed
```

or:

```text
when removed/processed
```

Marking at discovery often prevents the same node from being pushed repeatedly.

The correct choice depends on the algorithm's invariants.

---

# 17. DFS Order Is Not Unique

Different iterative implementations can produce different valid DFS visitation orders depending on:

- neighbor order;
- push order;
- visited timing.

Do not overfit correctness to one traversal sequence unless the problem specifies an order.

---

# 18. Recursive Search → Explicit Search

A recursive search frame can be modeled as:

```text
current state
candidate cursor
parent state
pending continuation
```

This allows iterative execution while preserving depth-first semantics.

---

# 19. Explicit Stack vs Queue

Stack:

```text
LIFO
→ depth-first behavior
```

Queue:

```text
FIFO
→ breadth-first behavior
```

Changing the worklist can therefore change the algorithm, not merely the implementation style.

---

# 20. Continuation Perspective

A recursive call can be viewed as:

```text
“compute child, then continue with this pending operation”
```

That pending operation is a **continuation**.

Explicit-frame transformations store continuations as data.

This is a powerful mental model for difficult recursion conversions.

---

# 21. Example: Factorial

Recursive:

```text
factorial(n)
= n * factorial(n - 1)
```

An accumulator form:

```text
result = 1
while n > 1:
    result *= n
    n--
```

The pending multiplication has been absorbed into the accumulator.

---

# 22. Example: Reverse Traversal

Recursive tree algorithms often process work on both descent and ascent.

An explicit frame can model:

```text
enter
after-left
after-right
```

This makes pre/in/postorder transformations systematic instead of relying on memorized tricks.

---

# 23. Maintaining Invariants

Transformation correctness requires the iterative state to represent exactly what the recursive stack would contain.

Invariant:

> The explicit stack contains the same unfinished recursive work that the implicit call stack would contain at the corresponding execution point.

---

# 24. Complexity Preservation

A correct recursion-to-iteration transformation should normally preserve asymptotic work.

For example:

```text
recursive DFS → iterative DFS
Time:  O(V + E)
Space: O(V)
```

The recursion stack becomes explicit stack storage.

---

# 25. Constant-Factor Differences

Even with identical Big-O complexity, implementations can differ because of:

```text
function-call overhead
object allocation
array push/pop cost
cache locality
GC pressure
frame representation
```

Benchmark representative workloads when performance matters.

---

# 26. Recursion Depth vs Explicit Stack Size

Iteration does not magically reduce worst-case auxiliary space.

A DFS can still require:

```text
O(V)
```

explicit stack space.

The advantage is that memory is now under program control rather than limited by the language call stack.

---

# 27. Stack Overflow Avoidance

For a deeply nested user-controlled structure:

```text
recursive traversal
→ potential call-stack overflow
```

An iterative traversal:

```text
explicit stack
→ heap-managed worklist
```

can safely handle greater depth, subject to available memory.

---

# 28. Cancellation and Budgets

Explicit worklists make operational controls easier:

```text
if cancelled → stop
if nodes > maxNodes → stop
if deadline exceeded → stop
```

This is valuable in backend request handlers and search systems.

---

# 29. Pausing and Resuming

An explicit stack can potentially be persisted or transferred between execution steps if the frame state is serializable.

The language call stack generally cannot be safely serialized this way.

---

# 30. Debugging Explicit Stacks

Useful frame fields for debugging:

```text
depth
node/state identifier
next choice
partial result
parent relationship
```

Logging frames can make hidden recursive state visible.

---

# 31. Common Transformation Mistakes

### Mistake 1 — Losing continuation state

The iterative version forgets what should happen after the child returns.

### Mistake 2 — Wrong push order

LIFO reverses intended traversal order.

### Mistake 3 — Incorrect visited timing

Nodes may be processed repeatedly.

### Mistake 4 — Shared mutable state not restored

Backtracking semantics change.

### Mistake 5 — Treating iteration as automatically O(1) space

An explicit stack may still be O(N).

---

# 32. Mechanical Transformation Procedure

```text
1. Write the recursive algorithm clearly.
2. Identify every parameter/state component.
3. Identify local variables that survive recursive calls.
4. Identify the next operation after each recursive call.
5. Decide whether an accumulator removes the need for frames.
6. Otherwise define an explicit frame structure.
7. Push the initial frame.
8. Simulate enter/return transitions.
9. Preserve recursive ordering.
10. Preserve state restoration.
11. Prove the frame invariant.
12. Compare time and auxiliary space.
13. Add cancellation/resource controls if needed.
```

---

# 33. Backend Applications

Explicit stacks are useful for:

- deeply nested JSON/configuration processing;
- filesystem-like hierarchies;
- dependency traversal;
- graph workflows;
- large request-driven searches;
- parsers and AST processing.

For user-controlled nesting, iterative processing can provide stronger operational safety.

---

# 34. AI Applications

Explicit search stacks appear in:

- DFS state exploration;
- symbolic execution;
- program synthesis;
- search/planning systems;
- AST transformation;
- game-tree exploration.

Search engines often need pause/resume, budgets, cancellation, and instrumentation, all of which benefit from explicit state.

---

# 35. Interview Explanation Template

> “Recursion stores unfinished computation implicitly in the call stack. To convert it to iteration, I identify the state and continuation represented by each recursive frame and store that information explicitly. For simple tail recursion, an accumulator and loop may be enough; for branching recursion, I use an explicit stack of frames. The goal is to preserve the same state-transition invariant, traversal order, and asymptotic complexity while gaining control over depth and execution resources.”

---

# 36. Revision Checklist

- [ ] Can I explain what a recursive frame stores?
- [ ] Can I identify continuation state?
- [ ] Can I convert linear recursion into a loop?
- [ ] Can I use accumulators to remove recursion?
- [ ] Can I convert preorder DFS to an explicit stack?
- [ ] Can I derive iterative inorder traversal?
- [ ] Can I derive iterative postorder traversal?
- [ ] Can I design explicit recursive frames?
- [ ] Can I preserve return-value flow?
- [ ] Can I preserve backtracking apply/undo state?
- [ ] Can I explain the frame invariant?
- [ ] Can I reason about visited timing in iterative DFS?
- [ ] Can I compare stack space with call-stack space?
- [ ] Can I add cancellation and resource limits?
- [ ] Can I choose recursion or iteration based on production constraints?

# Key Takeaways

1. Recursion is an execution strategy; the underlying state transitions can often be executed iteratively.
2. A recursive call frame stores parameters, locals, continuation, and partial results.
3. Simple tail recursion can often become a loop with an accumulator.
4. Branching recursion generally requires an explicit stack of pending work.
5. Traversal order depends on worklist and push/pop semantics.
6. Correct transformation requires preserving the recursive state invariant.
7. Iteration does not automatically reduce asymptotic space; it moves control to explicit memory.
8. Explicit state enables better cancellation, budgeting, instrumentation, and potentially pause/resume behavior.
9. JavaScript call-stack limits are a practical reason to prefer iterative traversal for untrusted depth.
10. Expert recursion knowledge includes knowing when not to use recursion.
