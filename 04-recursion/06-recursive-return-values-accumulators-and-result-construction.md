# 04.6 — Recursive Return Values, Accumulators & Result Construction

## Purpose

Recursion becomes much easier to master when you understand exactly how information moves **down** the call stack and how answers move **back up**.

This chapter covers:

- return-value propagation;
- combine steps;
- accumulators;
- result construction;
- output mutation;
- immutable result construction;
- prefix/suffix result flow;
- recursion that returns booleans, numbers, arrays, objects, and composite results;
- choosing between return-style and accumulator-style recursion.

The central model is:

```text
Arguments carry state downward.
Return values carry results upward.
```

---

# 1. Recursive Return Values

Consider:

```js
function sumTo(n) {
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}
```

The recursive call does not merely execute.

It **returns a value** to its caller.

```text
sumTo(3)
→ 3 + sumTo(2)
       → 2 + sumTo(1)
              → 1 + sumTo(0)
                     → 0
```

Then values return upward:

```text
0
1
3
6
```

---

# 2. Downward vs Upward Information Flow

Recursive execution has two directions:

```text
DOWN:
state / parameters / decisions

UP:
results / return values / combined answers
```

This distinction is one of the most useful mental models in recursion.

---

# 3. The Combine Step

A recursive algorithm often follows:

```text
solve(current)
    ↓
solve(smaller)
    ↓
childResult
    ↓
combine(current, childResult)
```

For sum:

```text
current value + child result
```

For maximum:

```text
max(current value, child result)
```

For strings:

```text
current character + child result
```

The combine step reconstructs the answer.

---

# 4. Base Case Return Value

The base case must return a value compatible with the combine operation.

Examples:

```text
sum       → 0
product   → 1
count     → 0
AND       → true
OR        → false
minimum   → suitable identity/sentinel
maximum   → suitable identity/sentinel
```

The base value is part of the mathematical design.

---

# 5. Identity Values

An identity value does not change the operation.

Examples:

```text
x + 0 = x
x * 1 = x
x && true = x
x || false = x
```

This makes identity values powerful base-case choices.

However, minimum/maximum problems require careful handling of empty inputs and valid domains.

---

# 6. Boolean Recursion

A recursive function can return a boolean.

Example concept:

```text
isSorted(index)
```

Base:

```text
reached final element → true
```

Recursive condition:

```text
current pair valid AND remaining suffix valid
```

The result propagates upward through logical composition.

---

# 7. Counting Recursion

Counting problems commonly return:

```text
current contribution + recursive result
```

Example:

```text
count(index)
= contribution(index) + count(index + 1)
```

This pattern appears in:

- counting occurrences;
- counting valid states;
- counting paths;
- counting combinations.

---

# 8. Search Recursion

Search often returns a boolean or an answer object.

Conceptually:

```text
if current succeeds → return success
otherwise recurse
if child succeeds → propagate success
otherwise → failure
```

The recursive result may therefore be short-circuited rather than combined arithmetically.

---

# 9. Returning Composite Results

A recursive call can return:

```text
array
object
pair
tuple-like structure
custom result
```

Example:

```text
findBest(node)
→ { value, metadata }
```

The parent can inspect and combine the child's result.

---

# 10. Result Construction

Suppose recursion reverses a string.

One approach:

```text
reverse(rest) + firstCharacter
```

This constructs a new result while returning upward.

It is conceptually simple but may create repeated allocations depending on the implementation.

---

# 11. Accumulator Recursion

Instead of building the answer while returning, carry partial work downward.

Example:

```text
solve(index, total)
```

where:

```text
total = answer accumulated so far
```

At the base case:

```text
return total
```

The two approaches are:

```text
return-style
accumulator-style
```

---

# 12. Return-Style vs Accumulator-Style

Return-style:

```text
solve(state)
→ childResult
→ combine
```

Accumulator-style:

```text
solve(state, partialResult)
→ updatedPartialResult
→ child
```

Return-style often mirrors the mathematical recurrence.

Accumulator-style can make the evolving state explicit.

---

# 13. Accumulator Invariant

An accumulator needs a precise invariant.

For array sum:

```text
sum(index, total)
```

Invariant:

> `total` equals the sum of all elements before `index`.

At the terminal state:

```text
index === arr.length
```

`total` is the final answer.

---

# 14. Accumulators and Tail Position

If the recursive call is the final operation:

```js
return solve(nextState, updatedResult);
```

the call is in tail position.

Some languages optimize tail calls, but JavaScript environments should **not** be assumed to provide general proper-tail-call optimization in ordinary Node.js application code.

Therefore tail position does not automatically make deep recursion safe in JavaScript.

---

# 15. Output Arrays

Recursive algorithms often need to build arrays.

Two broad approaches:

```text
return a new array from each call
```

or:

```text
share one output array and mutate it
```

The first can simplify isolation.

The second can reduce copying but requires ownership discipline.

---

# 16. Push → Recurse → Pop

Backtracking commonly uses:

```text
push choice
recurse
pop choice
```

The output array is shared mutable state.

Invariant:

> Before each sibling branch begins, the path contains exactly the decisions belonging to the current recursion depth.

---

# 17. Result Construction After Recursion

Some algorithms need the child result before constructing the parent's result.

Pattern:

```text
child = solve(smaller)
result = transform(current, child)
return result
```

Examples:

- reverse traversal;
- tree height;
- tree serialization;
- recursive parsing;
- divide-and-conquer combination.

---

# 18. Result Construction Before Recursion

Other algorithms construct state before descending.

Pattern:

```text
update state
solve(nextState)
```

This is common in:

- accumulators;
- path construction;
- prefix processing;
- depth tracking.

The timing of construction determines what the recursive invariant means.

---

# 19. Pre-Order vs Post-Order Work

Recursive work can happen:

```text
BEFORE recursive call → pre-order style
AFTER recursive call  → post-order style
```

Tree traversal makes this especially visible.

```text
pre-order  → node, left, right
post-order → left, right, node
```

The same concept applies to general recursion.

---

# 20. Multiple Return Paths

A recursive function may have several ways to return.

Example:

```text
success → return answer
invalid → return failure
base    → return default
recursive → combine child result
```

Each return value must have a clear semantic meaning.

Avoid mixing incompatible result types without a deliberate contract.

---

# 21. Sentinel Values

Sometimes failure can be represented by a sentinel:

```text
-1
null
undefined
Infinity
```

But sentinels are safe only when they cannot be confused with valid results.

A structured result can be clearer:

```js
{ found: false }
```

or:

```js
{ found: true, value }
```

---

# 22. Returning Multiple Pieces of Information

A recursive computation may need to return several values.

Example:

```text
maximum value
AND
its index
```

Instead of recomputing information, return a composite result:

```text
{ value, index }
```

This can preserve linear complexity.

---

# 23. Avoiding Repeated Reconstruction

Suppose each recursive call copies an increasingly large array:

```text
result = [current, ...childResult]
```

Even if there are only `n` calls, repeated copying can produce:

```text
O(n²)
```

work.

Therefore result size and allocation cost must be included in complexity analysis.

---

# 24. Accumulator as State Compression

An accumulator can replace a growing intermediate result when only a summary is needed.

Example:

```text
sum of values
```

does not require storing every partial sum.

Instead:

```text
(total)
```

is sufficient.

This is state compression.

---

# 25. When Accumulators Are Not Enough

If the final result requires the complete sequence of choices, a scalar accumulator may lose necessary information.

For example:

```text
generate all subsets
```

requires retaining the current path and/or produced outputs.

Do not compress state beyond what correctness permits.

---

# 26. Recursive Result as a Function Contract

For every recursive function define:

```text
Input state
→ meaning of returned value
→ base-case result
→ child result meaning
→ combine rule
```

If you cannot explain what the returned value means for an arbitrary state, the recursion is not yet fully designed.

---

# 27. Backend Applications

Return-value and accumulator patterns appear in:

- recursive validation;
- hierarchical aggregation;
- dependency result propagation;
- nested configuration transformation;
- tree metrics;
- recursive parsing.

Production code must also consider allocation and maximum depth.

---

# 28. AI Applications

These patterns appear in:

- recursive search scoring;
- tree evaluation;
- candidate aggregation;
- recursive parsing;
- hierarchical retrieval;
- search result propagation.

An accumulator can represent a running score, budget, depth, or partial candidate state.

---

# 29. Design Procedure

Before coding:

```text
1. Define the recursive state.
2. Define exactly what the function returns.
3. Define the base-case return value.
4. Define the recursive child result.
5. Define the combine operation.
6. Decide whether an accumulator is useful.
7. Define the accumulator invariant if used.
8. Identify output allocations.
9. Analyze result-construction complexity.
10. Test empty and boundary states.
```

---

# 30. Expert Questions

Ask:

```text
What flows downward?
What flows upward?
What does the return value mean?
What is the base return value?
How is the child result combined?
Could an accumulator simplify the state?
Does the accumulator preserve the required information?
Am I repeatedly copying results?
What is the peak memory?
What is the recursion depth?
```

---

# 31. Revision Checklist

- [ ] Can I trace return values from base case back to the root?
- [ ] Can I identify the combine operation?
- [ ] Can I choose correct identity/base values?
- [ ] Can I explain downward state flow vs upward result flow?
- [ ] Can I design accumulator-style recursion?
- [ ] Can I state an accumulator invariant?
- [ ] Can I recognize tail position without assuming JavaScript tail-call optimization?
- [ ] Can I distinguish pre-recursion and post-recursion work?
- [ ] Can I construct composite return values?
- [ ] Can I identify repeated result copying?
- [ ] Can I analyze result-allocation complexity?
- [ ] Can I apply these ideas to backend and AI recursive workloads?

# Key Takeaways

1. Recursive arguments carry state downward; return values carry results upward.
2. The combine step reconstructs the parent's answer from the child's result.
3. Base-case return values must match the combine operation's semantics.
4. Accumulators move partial results downward instead of reconstructing them upward.
5. Every accumulator needs a precise invariant.
6. Shared output arrays can be efficient but require restoration/ownership discipline.
7. Returning large copied structures can introduce hidden quadratic work.
8. Tail position is useful conceptually, but JavaScript applications should not assume deep recursion becomes stack-safe.
9. Return-style and accumulator-style recursion are alternative representations of the same computation.
10. Expert recursive design specifies state, return meaning, base result, transition, combine rule, and allocation behavior before implementation.
