# 06.04 — Stack Patterns & Monotonic Stacks

> **Phase 06 — Stacks, Queues & Deques**
>
> This chapter develops the reusable problem-solving patterns that make stacks powerful: delimiter matching, nested-state processing, previous/next-nearest relationships, monotonic stacks, contribution reasoning, histogram algorithms, online processing, and production-oriented applications.

---

# 1. Learning Objectives

By the end of this chapter, you should be able to:

- recognize when a problem contains a last-unresolved / nearest-boundary structure;
- model nested state with a stack;
- distinguish ordinary stacks from monotonic stacks;
- derive previous-greater, previous-smaller, next-greater, and next-smaller algorithms;
- choose increasing versus decreasing monotonic invariants;
- prove why elements are pushed and popped at most once in a monotonic-stack scan;
- derive O(N) algorithms from an apparent O(N²) brute force solution;
- handle duplicates deliberately through strict and non-strict comparisons;
- solve stock-span, daily-temperature, histogram, and boundary problems;
- reason about sentinels, flushing, and end-of-input behavior;
- use stack patterns in backend parsing, scheduling, validation, and event processing;
- apply stack-based reasoning to AI search and sequence processing;
- explain monotonic-stack solutions in an interview without memorizing templates.

---

# 2. Why Stack Patterns Matter

A stack is more than a container.

Its deeper algorithmic value comes from its ordering rule:

```text
last unresolved item
        ↓
processed first
```

Many problems repeatedly ask:

```text
For this item, what is the nearest earlier/later item satisfying a condition?
```

A naive solution often searches outward for every element:

```text
for each i
    scan left/right until answer is found
```

That can become:

```text
O(N²)
```

A stack can preserve exactly the unresolved candidates needed for future answers.

The key question is not:

> "Can I use a stack here?"

It is:

> **"What information can safely be discarded while preserving every candidate that could still matter?"**

That is the core of monotonic-stack reasoning.

---

# 3. Pattern A — Nested State

Stacks naturally model nested structures.

Examples:

```text
()
[]
{}
```

or:

```text
function A
  function B
    function C
```

The most recently opened structure must be resolved first.

This is exactly LIFO.

Example:

```text
(
([ 
([{ 
```

When `}` arrives, it must close `{`, not `[` or `(`.

The stack stores unresolved opening state.

---

# 4. Delimiter Matching Pattern

For every opening delimiter:

```text
push
```

For every closing delimiter:

```text
check top
pop
```

Invariant:

> The stack contains exactly the currently unmatched opening delimiters in nesting order.

Example:

```text
Input: ([{}])

(
([ 
([{ 
([ 
(
[]
empty
```

If a closing delimiter does not match the top, the sequence is invalid immediately.

At end of input, the stack must be empty.

---

# 5. Correctness of Delimiter Matching

Maintain the invariant:

```text
stack = unmatched opening delimiters
        from outermost to innermost
```

Opening delimiter:

```text
adds one unmatched delimiter
```

Matching closing delimiter:

```text
removes exactly the innermost unmatched delimiter
```

Mismatched closing delimiter:

```text
violates nesting correctness
```

End of input:

```text
empty stack → every opening delimiter was matched
non-empty   → at least one opening delimiter remains unmatched
```

Because every input character is processed once:

```text
Time  = O(N)
Space = O(N) worst-case
```

---

# 6. Pattern B — Last Unresolved Item

A powerful recognition signal is:

> An item cannot be resolved now, but a future event may resolve the most recent unresolved item first.

Examples:

- next greater element;
- matching delimiters;
- function-call nesting;
- dependency completion;
- undo history;
- expression parsing;
- unresolved intervals;
- nearest boundary problems.

The stack becomes a collection of candidates waiting for resolution.

---

# 7. Pattern C — Nearest Greater / Smaller Element

For each element `A[i]`, we may want:

```text
previous greater
previous smaller
next greater
next smaller
```

The brute-force strategy checks neighbors repeatedly.

For each `i`:

```text
scan until condition is satisfied
```

Worst case:

```text
O(N²)
```

The monotonic stack eliminates candidates that can no longer be useful.

---

# 8. What Is a Monotonic Stack?

A monotonic stack maintains elements in a chosen order.

Examples:

```text
increasing:
1, 3, 5, 8

non-decreasing:
1, 3, 3, 5

decreasing:
9, 7, 4, 2
```

The stack is not necessarily sorted by insertion time alone.

When a new value arrives, violating elements are removed until the invariant is restored.

Conceptually:

```text
candidate stack
      ↓
new value
      ↓
pop dominated candidates
      ↓
push new candidate
```

---

# 9. The Dominance Principle

Why can we pop elements permanently?

Suppose we are searching for the next greater element.

Current stack:

```text
[2, 5, 7]
```

New value:

```text
9
```

For next-greater queries:

```text
9 > 7
9 > 5
9 > 2
```

Once 9 arrives, those values have found their next greater candidate.

They no longer need to remain unresolved.

The stack therefore performs **candidate elimination**.

This is the deeper idea behind the pattern.

---

# 10. Increasing vs Decreasing Stack

The desired relationship determines the invariant.

A common mapping is:

| Goal | Typical stack invariant |
|---|---|
| Next greater | decreasing stack |
| Previous greater | decreasing stack |
| Next smaller | increasing stack |
| Previous smaller | increasing stack |

But do not memorize this table blindly.

Derive it from the pop condition.

For next greater:

```text
while top is smaller than current:
    top has found its answer
```

Therefore smaller candidates must be removable from the top.

---

# 11. Next Greater Element — Brute Force

Given:

```text
[2, 1, 2, 4, 3]
```

For each value, scan right until finding a larger value.

Result:

```text
[4, 2, 4, -1, -1]
```

Brute force:

```text
for i = 0..N-1
    for j = i+1..N-1
        if A[j] > A[i]
            answer[i] = A[j]
            break
```

Worst-case:

```text
O(N²)
```

---

# 12. Next Greater Element — Monotonic Stack

Scan left to right.

Maintain a stack of indices whose next greater element has not yet been found.

For current index `i`:

```text
while stack is not empty
and A[stack.top] < A[i]
    answer[stack.top] = A[i]
    pop

push i
```

Example:

```text
A = [2, 1, 2, 4, 3]
```

The stack stores unresolved indices.

When 4 arrives, it resolves all smaller unresolved values that are exposed from the top.

---

# 13. Why Indices Are Usually Better Than Values

Store:

```text
index
```

rather than only:

```text
value
```

because the answer often needs to be written back to the original position.

With indices we can access:

```js
A[index]
```

and store:

```js
answer[index] = currentValue
```

Indices also preserve identity when duplicate values exist.

---

# 14. The Fundamental Monotonic-Stack Invariant

For a next-greater scan using a decreasing candidate stack:

```text
A[stack[0]] > A[stack[1]] > ... > A[stack[top]]
```

depending on the exact strictness policy.

More importantly:

> Every index remaining in the stack is unresolved, and every index removed from the stack has received its first valid next-greater candidate.

This invariant gives both correctness and complexity.

---

# 15. Why the Algorithm Is O(N)

At first glance:

```text
for each element
    while ...
        pop
```

looks like it might be O(N²).

But every index:

```text
is pushed at most once
is popped at most once
```

Therefore total stack operations are bounded by:

```text
O(N) pushes + O(N) pops
```

so:

```text
Time = O(N)
Space = O(N)
```

This is a classic example of amortized reasoning.

---

# 16. Amortized Reasoning for Monotonic Stacks

The inner `while` loop can execute many times during one iteration.

But those pops cannot repeat indefinitely.

Each pop permanently removes one index.

Therefore across the entire scan:

```text
number of pops ≤ N
```

This is why the algorithm is linear even though a single iteration may perform O(N) work.

Important distinction:

```text
per-iteration worst case ≠ total algorithm complexity
```

---

# 17. Previous Greater Element

For previous-greater queries, process left to right.

For each current value `x`:

```text
remove candidates that are too small
then top is the nearest surviving greater candidate
push x/index
```

The exact pop condition depends on duplicate semantics.

For strict previous greater:

```text
pop while top <= x
```

For non-strict previous greater-or-equal:

```text
pop while top < x
```

The comparison operator is part of the problem definition.

---

# 18. Previous Smaller / Next Smaller

Reverse the comparison logic.

For smaller relationships, maintain an increasing candidate stack.

Typical strict next-smaller rule:

```text
while A[stack.top] >= A[i]
    pop
```

Then the surviving top is the nearest strictly smaller candidate.

Again:

```text
strict <     → often pop >=
non-strict <= → often pop >
```

Do not apply these mechanically without defining the desired relation first.

---

# 19. Duplicates Are a Major Source of Bugs

Consider:

```text
[2, 2, 2]
```

Questions:

```text
Does equal count as greater?
Does equal count as smaller?
Should duplicate indices remain separate candidates?
```

For nearest-element problems, strictness determines whether equal values are retained or eliminated.

You should always write the target relation explicitly:

```text
A[j] > A[i]
```

or:

```text
A[j] >= A[i]
```

before writing the pop condition.

---

# 20. Stock Span Pattern

The stock-span problem asks for each day:

> How many consecutive previous days have price less than or equal to today's price?

Brute force can be O(N²).

A monotonic stack can solve it in O(N).

Maintain indices of prices that remain relevant as span boundaries.

When today's price dominates earlier prices, those earlier candidates can be popped.

The surviving top becomes the previous greater boundary.

If none exists:

```text
span = i + 1
```

Otherwise:

```text
span = i - stack.top
```

---

# 21. Daily Temperatures Pattern

For each day, find how many days until a warmer temperature.

This is a next-greater problem over indices.

For current day `i`:

```text
while temperature[stack.top] < temperature[i]
    previous = pop
    answer[previous] = i - previous
push i
```

Unresolved days remain in the stack.

At the end:

```text
unresolved days → answer remains 0
```

This is an important online-processing pattern.

---

# 22. Boundary Problems

Monotonic stacks become especially powerful when the desired answer depends on the first boundary satisfying a comparison.

Examples:

```text
nearest greater
nearest smaller
first blocking wall
previous dominant value
next smaller boundary
```

The stack compresses the search space.

Instead of remembering every previous item, we retain only candidates that have not been dominated by a more useful candidate.

---

# 23. Largest Rectangle in a Histogram

Given bar heights:

```text
[2, 1, 5, 6, 2, 3]
```

find the largest rectangle.

Brute force can enumerate intervals and compute minimum height.

That leads to O(N²) or worse depending on implementation.

The key observation is:

For each bar, determine:

```text
nearest smaller to left
nearest smaller to right
```

Then that bar can be the limiting height of the widest rectangle spanning those boundaries.

Monotonic stacks provide those boundaries in O(N).

---

# 24. Histogram Width Derivation

For bar `i` with height `h`:

```text
left boundary  = previous smaller index
right boundary = next smaller index
```

If:

```text
L = previous smaller
R = next smaller
```

then width is:

```text
R - L - 1
```

and area is:

```text
h × (R - L - 1)
```

If no smaller bar exists on one side, use a conceptual sentinel boundary outside the array.

This is a direct application of nearest-boundary reasoning.

---

# 25. Sentinel Technique

A common engineering technique is adding a sentinel element to force unresolved candidates to flush.

Example:

```text
heights = [2, 1, 5, 6, 2, 3, 0]
```

The final `0` is smaller than every valid height, so it causes remaining bars to be processed.

Conceptually:

```text
normal input
    ↓
append guaranteed boundary
    ↓
all remaining candidates resolve
```

Sentinels simplify end-of-input logic but must be chosen so they cannot collide incorrectly with legitimate values.

---

# 26. Stack Flush at End of Input

Without a sentinel, unresolved candidates must often be processed explicitly:

```text
while stack not empty
    resolve remaining candidates
```

This is not an extra asymptotic cost because every remaining element is popped at most once.

General lesson:

> **End-of-stream behavior is part of the algorithm, not an implementation detail.**

This matters in file processing, network streams, parsers, and event pipelines.

---

# 27. Parsing as a Stack Pattern

Stacks are useful for expression parsing.

Examples:

```text
infix → postfix
postfix evaluation
operator precedence
nested function calls
AST construction
```

For operator parsing, the stack stores operators whose final output position has not yet been determined.

The same unresolved-state model appears again:

```text
input token
    ↓
resolve higher/equal precedence operators
    ↓
push current operator
```

---

# 28. Undo / Redo as Stack Patterns

Undo commonly uses:

```text
undoStack
redoStack
```

New action:

```text
undoStack.push(action)
redoStack.clear()
```

Undo:

```text
action = undoStack.pop()
apply inverse
redoStack.push(action)
```

Redo reverses the direction.

This is a direct application of LIFO state history.

---

# 29. Iterative DFS Pattern

Depth-first search can replace recursive call-stack state with an explicit stack.

Recursive form:

```text
visit(node)
    visit(child)
```

Explicit form:

```text
stack.push(start)

while stack not empty
    node = stack.pop()
    process(node)
    push children
```

The explicit stack gives control over:

```text
maximum pending work
traversal state
resource limits
cancellation
instrumentation
```

This is particularly useful in backend services where uncontrolled recursion is undesirable.

---

# 30. Monotonic Stack vs Heap

Both can solve certain "best candidate" problems, but they preserve different information.

### Monotonic stack

Strong when the answer depends on:

```text
nearest qualifying boundary
linear sequence order
one-dimensional locality
```

### Heap

Strong when the answer depends on:

```text
globally best current candidate
minimum/maximum priority
arbitrary insertion order
```

Do not replace one with the other merely because both can find maxima/minima.

The structural question is:

> **Does distance/order matter, or only priority?**

---

# 31. Monotonic Deque Preview

A monotonic deque extends the idea when we need both:

```text
front removal
back candidate elimination
```

This becomes important for sliding-window maximum/minimum problems.

The stack is therefore one point in a larger family of monotonic data structures.

The key invariant remains:

```text
retain only candidates that can still become an answer
```

---

# 32. Backend Applications

Stack patterns appear in backend systems through:

- request validation and nested schema traversal;
- expression and query parsing;
- route/path parsing;
- template processing;
- configuration evaluation;
- dependency resolution;
- transaction/savepoint nesting;
- undoable administrative workflows;
- iterative tree traversal;
- log/event sequence analysis;
- resource acquisition/release ordering.

Example:

```text
middleware A enters
middleware B enters
middleware C enters

C exits
B exits
A exits
```

This is naturally LIFO.

---

# 33. AI Engineering Applications

Stack-based reasoning appears in:

- depth-first search;
- backtracking;
- symbolic expression evaluation;
- parser/AST processing;
- state-space exploration;
- planning traces;
- nested tool execution;
- reasoning-tree traversal;
- beam-search variants combined with other priority structures;
- candidate-boundary analysis over sequences.

For AI systems, the stack is often the explicit representation of unresolved search state.

---

# 34. Production Considerations

A production monotonic-stack implementation should define:

```text
input validation
empty input
duplicate semantics
strictness policy
index/value representation
sentinel policy
memory limits
maximum input size
output allocation
cancellation behavior
observability
```

For huge streams, avoid storing unnecessary objects.

If only indices are required, store indices.

If the input is immutable and accessible by index, an index stack is often more memory-efficient than storing duplicate values.

---

# 35. Common Mistakes

### Mistake 1 — Memorizing the wrong comparison

Fix:

```text
define desired relation first
then derive pop condition
```

### Mistake 2 — Storing values when identity matters

Use indices when duplicate values exist.

### Mistake 3 — Forgetting unresolved candidates

Flush the stack or use a safe sentinel.

### Mistake 4 — Claiming O(N²) because of `while`

Count total pushes and pops.

### Mistake 5 — Ignoring duplicates

Define strict versus non-strict semantics.

### Mistake 6 — Using a stack when global priority is required

Consider a heap instead.

### Mistake 7 — Mutating input unexpectedly

Document whether sentinels or in-place transformations modify the original data.

---

# 36. A General Derivation Framework

When you see a new sequence problem, use this process:

```text
1. Write the brute-force search.
2. Identify repeated searches.
3. Ask which candidates become permanently irrelevant.
4. Identify the ordering among remaining candidates.
5. Define the stack invariant.
6. Derive the pop condition from the desired relation.
7. Decide whether to store values or indices.
8. Process each element once.
9. Resolve remaining candidates.
10. Prove each element is pushed/popped at most once.
11. Analyze time and space.
12. Test duplicates and boundary cases.
```

This is more valuable than memorizing ten monotonic-stack templates.

---

# 37. Correctness Proof Template

For a monotonic-stack algorithm, prove three claims.

### Claim 1 — Invariant preservation

After every iteration, the stack satisfies the required monotonic ordering and contains only unresolved candidates.

### Claim 2 — Safe removal

When an index is popped, the current element is the first valid candidate encountered in the required direction, so its answer is final.

### Claim 3 — Completeness

Every index that still has a valid answer is either resolved when its candidate arrives or remains in the stack until a later valid candidate appears.

Together these establish correctness.

---

# 38. Complexity Proof Template

For a single scan:

```text
Each element is pushed ≤ 1 time.
Each element is popped ≤ 1 time.
Each stack operation is O(1).
```

Therefore:

```text
push work ≤ O(N)
pop work  ≤ O(N)
scan work = O(N)

Total = O(N)
```

Auxiliary stack:

```text
O(N) worst-case
```

Output:

```text
O(N)
```

Keep auxiliary space separate from output space when discussing complexity precisely.

---

# 39. Interview Explanation Framework

When asked to solve a monotonic-stack problem, explain it in this order:

```text
1. State brute force and its O(N²) cost.
2. Identify repeated nearest-element searches.
3. Explain candidate elimination.
4. Define the stack invariant.
5. Explain the pop condition.
6. Explain why the surviving top is the correct boundary.
7. Explain unresolved elements after the scan.
8. Prove O(N) using one push/one pop amortization.
9. Discuss duplicates and edge cases.
```

This demonstrates reasoning rather than memorization.

---

# 40. Master Pattern Table

| Pattern | Core idea | Typical complexity |
|---|---|---:|
| Nested delimiters | unresolved nesting | O(N) |
| Next greater | eliminate smaller unresolved candidates | O(N) |
| Previous greater | maintain useful greater candidates | O(N) |
| Next smaller | eliminate larger unresolved candidates | O(N) |
| Previous smaller | maintain useful smaller candidates | O(N) |
| Stock span | previous greater boundary | O(N) |
| Daily temperatures | next greater distance | O(N) |
| Histogram | nearest smaller boundaries | O(N) |
| Expression parsing | unresolved operators/state | O(N) typical |
| Iterative DFS | explicit recursion state | O(V+E) |

---

# 41. Revision Checklist

- [ ] I can identify a last-unresolved pattern.
- [ ] I can distinguish an ordinary stack from a monotonic stack.
- [ ] I can derive the pop condition instead of memorizing it.
- [ ] I understand increasing and decreasing invariants.
- [ ] I handle strict and non-strict comparisons correctly.
- [ ] I know when to store indices instead of values.
- [ ] I can prove O(N) despite a nested `while` loop.
- [ ] I can solve next/previous greater and smaller problems.
- [ ] I can derive stock span.
- [ ] I can derive daily temperatures.
- [ ] I understand the histogram boundary technique.
- [ ] I understand sentinels and end-of-input flushing.
- [ ] I know when a heap is more appropriate.
- [ ] I can explain backend applications.
- [ ] I can explain AI/search applications.
- [ ] I can defend the invariant and complexity in an interview.

---

# 42. Key Takeaways

1. A stack is powerful because it preserves LIFO resolution order.
2. Many stack problems are really unresolved-state problems.
3. A monotonic stack retains only candidates that can still matter.
4. Popping is safe only when the removed candidate can never produce a better future answer.
5. Every element being pushed and popped at most once gives linear total work.
6. Strictness and duplicate handling must be derived from the exact problem relation.
7. Indices preserve identity and make answer placement easier.
8. Histogram algorithms are nearest-boundary problems in disguise.
9. Sentinels and final flushing are part of correct stream processing.
10. The most transferable skill is learning to derive the invariant, not memorizing a template.
