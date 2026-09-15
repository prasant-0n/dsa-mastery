# 06.03 — Stack Operations, Complexity & Error Semantics

> **Phase 06 — Stacks, Queues & Deques**
>
> This chapter turns stack operations into a rigorous engineering model. The objective is not merely to know that `push()` and `pop()` exist, but to understand their contracts, derive their costs, reason about failure semantics, distinguish worst-case from amortized behavior, and select an API that remains correct under normal and adversarial workloads.

---

## 1. Learning Objectives

By the end of this chapter, you should be able to:

- specify stack operation contracts precisely;
- derive the complexity of each operation from the representation;
- distinguish worst-case, average-case, amortized, and expected complexity;
- explain why array-backed `push()` is normally amortized O(1);
- reason about `peek()`, `pop()`, `push()`, `size()`, and `isEmpty()` independently;
- design explicit underflow and overflow semantics;
- distinguish exceptional control flow from ordinary operation failure;
- design result-based APIs for infrastructure code;
- analyze batch stack operations;
- identify hidden O(N) work inside apparently constant-time APIs;
- reason about memory retention and cleanup;
- validate operation postconditions and invariants;
- compare stack implementations under realistic workloads;
- communicate stack complexity professionally in interviews and design reviews.

---

# 2. The Stack Operation Contract

A data structure operation has more than a function name.

For each operation, define:

```text
Input
Preconditions
State transition
Output
Postconditions
Failure behavior
Time complexity
Space complexity
```

For example, `pop()` is not simply:

```text
remove something
```

It is:

```text
Precondition: stack is non-empty
Transition: remove current top
Output: removed top value
Postcondition: size decreases by 1
Failure: explicit underflow policy
```

This level of precision prevents ambiguous implementations.

---

# 3. Core Operations

A conventional stack provides:

| Operation | Meaning |
|---|---|
| `push(x)` | add `x` to top |
| `pop()` | remove and return top |
| `peek()` | inspect top without removal |
| `isEmpty()` | test whether stack is empty |
| `size()` | return element count |

These operations are deliberately restricted.

That restriction creates the LIFO guarantee.

---

# 4. `push(x)` — Exact Semantics

Given:

```text
S = [A, B]
```

After:

```text
push(C)
```

we require:

```text
S = [A, B, C]
```

The new element becomes the unique top.

### Preconditions

For an unbounded stack:

```text
stack representation is valid
```

For a bounded stack:

```text
size < capacity
```

unless the API explicitly defines another overflow behavior.

### Postconditions

```text
newSize = oldSize + 1
newTop = x
previous elements retain their relative stack order
```

### Complexity

Array-backed:

```text
O(1) amortized
```

Linked-list-backed:

```text
O(1) worst-case
```

---

# 5. `pop()` — Exact Semantics

Given:

```text
S = [A, B, C]
```

then:

```text
pop() → C
```

and the new state is:

```text
S = [A, B]
```

### Preconditions

```text
size > 0
```

unless underflow is explicitly represented as a valid result.

### Postconditions

```text
newSize = oldSize - 1
returnedValue = previousTop
remaining elements preserve order
```

The operation must not accidentally remove an arbitrary element.

---

# 6. `peek()` — Read Without Mutation

`peek()` returns the current top while preserving the entire stack state.

```text
Before: [A, B, C]
peek() → C
After:  [A, B, C]
```

This gives us a useful postcondition:

```text
observableState(after) === observableState(before)
```

A correct `peek()` is therefore a **read-only operation** from the ADT perspective.

Complexity should normally be:

```text
Time: O(1)
Auxiliary space: O(1)
```

If `peek()` traverses the structure, the representation is poorly aligned with the ADT.

---

# 7. `size()` and `isEmpty()`

These operations look trivial but reveal an important design choice.

## Stored size

Maintain:

```text
size = current number of elements
```

Then:

```text
size()     → O(1)
isEmpty()  → O(1)
```

## Derived size

If the implementation counts linked nodes every time:

```text
size() → O(N)
```

This is usually a poor design for a general-purpose stack.

If `isEmpty()` only checks whether `top === null`, it remains O(1) even if size is not stored.

### Design lesson

Do not assume all metadata has the same cost. Analyze exactly what each operation needs.

---

# 8. Complexity Is Representation-Dependent

The Stack ADT does not have one universal complexity table.

For example:

```text
Stack ADT
   ↓
Array representation
   ↓
push = amortized O(1)
```

while:

```text
Stack ADT
   ↓
Singly linked representation with top at head
   ↓
push = O(1) worst-case
```

The abstraction defines behavior; the representation determines the operational cost.

This distinction is foundational to data-structure engineering.

---

# 9. Complexity Taxonomy

When describing an operation, be precise about which complexity you mean.

## Worst-case

The maximum cost over valid inputs of a specified size.

## Best-case

The minimum cost.

Usually less useful for guaranteeing system performance.

## Average-case

Expected cost under an explicitly defined input distribution or model.

## Amortized

Average cost across a sequence of operations, without requiring a probabilistic input assumption.

## Expected / randomized

Expected cost when randomness is part of the algorithm or model.

These terms are not interchangeable.

---

# 10. Worst-Case vs Amortized Push

For a dynamic array:

```text
Most pushes:
store at next available position → O(1)

Occasional resize:
allocate/copy → O(N)
```

Therefore:

```text
individual worst-case push = O(N)
amortized push              = O(1)
```

This does **not** mean the expensive resize disappeared.

It means its cost is distributed across a sufficiently long sequence of insertions under geometric growth.

---

# 11. Deriving Amortized O(1)

Assume capacity doubles:

```text
1 → 2 → 4 → 8 → 16 → ...
```

When resizing occurs, copied elements are approximately:

```text
1 + 2 + 4 + 8 + ... + N
```

This geometric series is O(N).

Across N pushes:

```text
ordinary insertion work = O(N)
copying work             = O(N)
--------------------------------
total                    = O(N)
```

Therefore:

```text
N pushes = O(N)
1 push amortized = O(1)
```

This is one of the most important examples of amortized analysis in practical DSA.

---

# 12. Aggregate Analysis

The previous argument is an example of the **aggregate method**.

Suppose a sequence contains N pushes.

Instead of asking:

```text
How expensive was each individual push?
```

we ask:

```text
What was the total cost of all N pushes?
```

If total cost is O(N), then average cost per operation is:

```text
O(N) / N = O(1)
```

This is not probabilistic average-case analysis.

It is amortized sequence analysis.

---

# 13. Potential-Method Intuition

Another way to understand dynamic-array amortization is to imagine that cheap operations accumulate "credit" that pays for future resizing.

Conceptually:

```text
cheap push
   ↓
store element + accumulate potential
   ↓
future resize
   ↓
spend accumulated potential on copying
```

The formal potential method defines a potential function over states.

For stacks, you do not need the formal machinery for every implementation, but understanding the idea helps later with queues, dynamic arrays, heaps, and advanced amortized structures.

---

# 14. Underflow Semantics

Underflow occurs when a stack-removal/read operation requires an element but the stack is empty.

Example:

```text
S = []
pop()
```

There are several valid API policies.

---

# 15. Underflow Policy A — Sentinel / `undefined`

JavaScript-friendly design:

```js
const value = stack.pop();
```

where an empty stack returns:

```js
undefined
```

### Advantage

Simple API.

### Problem

If `undefined` is a valid stored value, then:

```text
undefined result
```

may mean either:

```text
stack was empty
```

or:

```text
stored value was undefined
```

The ambiguity matters in generic libraries.

---

# 16. Underflow Policy B — Throwing

The API may treat underflow as a programming error:

```js
throw new Error('Stack underflow');
```

This makes invalid state transitions immediately visible.

Useful when:

```text
empty pop = impossible according to caller contract
```

However, throwing exceptions for ordinary expected control flow can be undesirable in hot infrastructure paths.

The API contract should determine the policy.

---

# 17. Underflow Policy C — Result Object

An explicit result model can remove ambiguity:

```js
{
  ok: true,
  value: 42
}
```

or:

```js
{
  ok: false,
  error: 'STACK_EMPTY'
}
```

This is useful for service boundaries and infrastructure components where failure is expected and should be handled explicitly.

A typed language might express this with an algebraic data type such as:

```text
Result<T, StackError>
```

JavaScript can model the same concept with tagged objects.

---

# 18. Choosing an Underflow Policy

Ask:

```text
Is empty pop expected?
Is empty pop a programmer bug?
Can the value domain contain undefined?
Is this a hot path?
Does the caller need structured error information?
```

There is no universal answer.

The professional answer is to state the contract and justify it.

---

# 19. Overflow Semantics

Overflow applies to bounded stacks.

Given:

```text
capacity = 3
stack = [A, B, C]
```

then:

```text
push(D)
```

requires a policy.

Possible choices:

```text
reject
throw
return structured failure
expand capacity
overwrite
```

The last two are fundamentally different designs.

If the stack is intended to be bounded, silently expanding it violates the capacity contract.

If it is intended to overwrite, it is better described as a specialized bounded/overwrite buffer rather than an ordinary stack.

---

# 20. Error Semantics Are Part of the Data Structure

A production data structure is defined by both:

```text
success semantics
failure semantics
```

For example:

```text
push when full → what happens?
pop when empty → what happens?
peek when empty → what happens?
invalid capacity → what happens?
non-integer capacity → what happens?
corrupted internal state → what happens?
```

These decisions belong in the API contract, not as afterthoughts.

---

# 21. Invalid Constructor Arguments

Suppose:

```js
createBoundedStack(-5)
```

Possible behavior:

```text
throw immediately
```

This is usually better than constructing an invalid object and failing later.

Likewise consider:

```text
NaN
Infinity
fractional capacity
string capacity
null
undefined
```

The exact validation depends on the intended API, but it should be explicit.

---

# 22. Operation Postconditions

Postconditions make correctness testable.

For `push(x)`:

```text
size_after = size_before + 1
peek_after = x
```

For `pop()`:

```text
returned = previous top
size_after = size_before - 1
```

For `peek()`:

```text
state_after = state_before
returned = previous top
```

For `isEmpty()`:

```text
result === (size === 0)
```

These statements can become automated assertions.

---

# 23. State Transition Testing

Instead of testing methods only in isolation, test sequences.

Example:

```text
push(A)
push(B)
pop()
push(C)
peek()
pop()
pop()
```

Track the expected model:

```text
[]
[A]
[A,B]
[A]
[A,C]
C
[A]
[]
```

Every operation has both:

```text
input state
output state
```

This is the foundation of differential testing.

---

# 24. Reference Model

A simple array can act as the reference model:

```js
const reference = [];
```

For every operation:

```text
optimized stack
      ↕
reference array
```

Compare observable behavior.

The reference model does not need to be optimized.

Its purpose is correctness, not performance.

This pattern generalizes to queues, heaps, caches, databases, and distributed-state simulations.

---

# 25. Hidden O(N) Work

A method that looks simple can hide linear work.

Bad example:

```js
size() {
  let count = 0;
  let node = this.top;
  while (node) {
    count++;
    node = node.next;
  }
  return count;
}
```

This is:

```text
O(N)
```

If callers invoke `size()` inside an O(N) loop, total complexity can become:

```text
O(N²)
```

Therefore complexity analysis must inspect implementation, not just method names.

---

# 26. Complexity Composition

Suppose an algorithm performs:

```text
N pushes
N calls to size()
N pops
```

If `size()` is O(1):

```text
O(N) + O(N) + O(N) = O(N)
```

If `size()` is O(N):

```text
O(N) + O(N²) + O(N) = O(N²)
```

One apparently small implementation decision can therefore change the algorithm's overall complexity.

---

# 27. Batch Operations

Sometimes the API can expose operations such as:

```text
pushMany(values)
popMany(count)
```

You must define their complexity and failure semantics.

For example:

```text
pushMany(N values)
```

may be:

```text
O(N) total
```

but a bounded stack introduces an atomicity question:

```text
capacity = 5
size = 3
pushMany([A,B,C])
```

Only two elements fit.

Possible policies:

```text
all-or-nothing
partial success
throw
structured result
```

This is a systems-design problem hiding inside a data-structure API.

---

# 28. Atomicity of Batch Operations

Consider:

```text
pushMany([A,B,C])
```

If insertion of C fails, should the stack contain:

```text
[A,B]
```

or should it revert to:

```text
[]
```

assuming the original stack was empty?

An all-or-nothing contract provides transactional semantics:

```text
success → entire operation committed
failure → original state preserved
```

This concept connects directly to backend transactions and stateful systems.

---

# 29. Memory Complexity

For N stored values:

### Array-backed

Logical storage is O(N).

The backing allocation may have spare capacity:

```text
capacity ≥ size
```

so physical storage can exceed the logical element count.

### Linked-list-backed

There are N nodes plus per-node reference/object overhead.

Therefore:

```text
logical elements = O(N)
node metadata = O(N)
```

Both remain O(N) asymptotically, but constants can differ substantially.

---

# 30. Auxiliary Space vs Total Space

If an algorithm uses a stack containing N elements:

```text
stack storage = O(N)
```

That may be **algorithmic auxiliary space** if the stack is additional to the input.

But if the input itself is represented by the stack, classification can differ.

Always state what counts as input and what counts as auxiliary storage.

---

# 31. Recursion and Stack Space

A recursive algorithm may use:

```text
O(H)
```

call-stack space for recursion depth H.

Replacing recursion with an explicit stack does not automatically eliminate memory usage.

It changes where the state lives:

```text
implicit runtime stack
        ↓
explicit program-managed stack
```

The benefit is control over representation and traversal state.

---

# 32. Stack Safety

A production stack should consider:

```text
maximum depth
maximum memory
unbounded growth
malicious input
unexpected recursion depth
```

For example, parsing deeply nested input can turn a theoretically correct algorithm into a resource-exhaustion problem.

Bounded stacks can provide a deliberate safety limit.

---

# 33. Resource Exhaustion

An unbounded stack exposed to untrusted input can become a memory-exhaustion vector.

Example:

```text
input nesting depth = extremely large
```

If every nesting level creates a stack entry, memory usage grows with depth.

Defensive systems may impose:

```text
maximum nesting depth
maximum elements
maximum input size
maximum processing time
```

This is algorithmic complexity applied to security engineering.

---

# 34. Performance Engineering

When benchmarking stacks, measure more than elapsed time.

Consider:

- operations per second;
- latency distribution;
- allocation rate;
- garbage-collection behavior;
- peak memory;
- retained memory;
- workload size;
- warm-up effects;
- correctness overhead.

Avoid conclusions such as:

> "Linked lists are faster because push is O(1)."

Asymptotic equality does not imply equal runtime.

---

# 35. Practical Cost Model

A useful conceptual model is:

```text
Total Cost ≈
algorithmic operations
+ allocation cost
+ memory-access cost
+ cache effects
+ garbage-collection cost
+ synchronization cost
+ error-handling cost
```

Big-O captures the dominant growth class, but production engineering requires understanding meaningful constants and runtime behavior.

---

# 36. Backend Applications

Stack semantics appear in:

### Request execution contexts

Nested middleware or execution contexts can form stack-like state.

### Undo/rollback

Newest reversible operation first.

### DFS

Explicit depth-first traversal.

### Parsing

Nested syntax and expression processing.

### Resource cleanup

Acquisition and cleanup can follow reverse-order patterns:

```text
acquire A
acquire B
acquire C

cleanup C
cleanup B
cleanup A
```

This is closely related to stack discipline.

---

# 37. AI Applications

Stack semantics can support:

- depth-first search;
- backtracking;
- reversible planning decisions;
- nested agent/tool execution contexts;
- explicit traversal state;
- search-state restoration.

But do not mistake "stack-shaped" for "must use a linked list."

An array-backed stack may be the better implementation.

The workload determines the representation.

---

# 38. Interview Complexity Table

A professional answer should distinguish typical guarantees:

| Operation | Array-backed | Linked-list-backed |
|---|---:|---:|
| `push` | O(1) amortized | O(1) worst-case |
| `pop` | O(1) | O(1) |
| `peek` | O(1) | O(1) |
| `isEmpty` | O(1) | O(1) |
| `size` with stored count | O(1) | O(1) |
| `size` by traversal | — | O(N) |
| Search | O(N) | O(N) |
| Random access | O(1) | O(N) |

A strong interview explanation includes the reason behind the table.

---

# 39. Common Interview Trap

Question:

> "What is the time complexity of push in an array-backed stack?"

Weak answer:

```text
O(1)
```

Better answer:

```text
O(1) amortized, because ordinary pushes append at the end,
while an occasional dynamic-array resize can cost O(N).
The worst-case individual push can therefore be O(N).
```

This demonstrates actual understanding rather than memorization.

---

# 40. Common Implementation Mistakes

### Mistake 1
Using `shift()` / `unshift()` for the stack top.

### Mistake 2
Recomputing linked-list size every time.

### Mistake 3
Duplicating state without maintaining invariants.

### Mistake 4
Leaving removed references unintentionally retained.

### Mistake 5
Silently dropping data on overflow.

### Mistake 6
Ambiguous empty-stack behavior.

### Mistake 7
Calling an amortized bound a strict worst-case bound.

### Mistake 8
Ignoring invalid constructor arguments.

### Mistake 9
Benchmarking without correctness validation.

### Mistake 10
Choosing linked lists solely because they are "O(1) insertion."

---

# 41. Professional Design Checklist

Before shipping a stack implementation, answer:

```text
What is the ADT contract?
What representation is used?
Where is the top?
How is size tracked?
What are the invariants?
What happens on underflow?
What happens on overflow?
What is the worst-case cost?
What is the amortized cost?
What memory can be retained?
What are the capacity limits?
What inputs are invalid?
How is correctness tested?
What workload justifies this representation?
```

If these questions cannot be answered, the implementation is not yet production-ready.

---

# 42. Correctness Proof Template

For every operation, use:

```text
1. State the invariant.
2. Describe the mutation.
3. Show the invariant before mutation.
4. Show the invariant after mutation.
5. Show the returned value is correct.
6. Show the size transition is correct.
```

Example for linked `pop()`:

```text
Invariant:
size equals number of reachable nodes.

Mutation:
top = top.next
size--

Result:
previous top is returned.
Remaining nodes are unchanged.
The new top is the previous second node.
Size decreases by exactly one.
```

This is the foundation of formal reasoning about data structures.

---

# 43. Mastery Exercises

The companion exercise file contains 20 progressively harder tasks covering:

1. operation contracts;
2. complexity classification;
3. worst-case vs amortized analysis;
4. underflow policies;
5. overflow policies;
6. result-based APIs;
7. invalid input validation;
8. postcondition checking;
9. hidden O(N) operations;
10. batch operations;
11. batch atomicity;
12. memory retention;
13. reference-model testing;
14. operation-sequence analysis;
15. complexity composition;
16. recursive stack-space analysis;
17. resource-exhaustion defenses;
18. backend workload analysis;
19. AI workload analysis;
20. complete stack API engineering synthesis.

Do not implement them by memorizing the chapter. Derive the contract first.

---

# 44. Revision Checklist

- [ ] I can specify `push` preconditions and postconditions.
- [ ] I can specify `pop` preconditions and postconditions.
- [ ] I can explain why `peek` is non-mutating.
- [ ] I can derive `size()` complexity from its implementation.
- [ ] I can distinguish worst-case from amortized complexity.
- [ ] I can derive amortized O(1) dynamic-array push.
- [ ] I understand aggregate analysis.
- [ ] I understand the intuition behind the potential method.
- [ ] I can choose an underflow policy deliberately.
- [ ] I can choose an overflow policy deliberately.
- [ ] I understand why error semantics are part of the API.
- [ ] I can detect hidden O(N) operations.
- [ ] I can reason about batch-operation atomicity.
- [ ] I understand logical vs physical memory usage.
- [ ] I can build a reference model.
- [ ] I can design adversarial tests.
- [ ] I can explain stack resource-exhaustion risks.
- [ ] I can analyze stack workloads for backend systems.
- [ ] I can analyze stack workloads for AI systems.
- [ ] I can defend stack complexity in an interview.

---

# 45. Key Takeaways

1. **An operation's name does not determine its complexity; its implementation does.**
2. **Array-backed `push()` is normally O(1) amortized, not O(1) worst-case.**
3. **Error and failure behavior are part of a data structure's contract.**
4. **Stored metadata can turn repeated operations from O(N) into O(1).**
5. **Batch operations introduce atomicity and transaction-like design questions.**
6. **Logical removal and physical memory release are different concerns.**
7. **Reference models are powerful tools for validating optimized structures.**
8. **Big-O is necessary but insufficient for production performance analysis.**
9. **Resource limits matter when input is large or untrusted.**
10. **The professional skill is not memorizing a complexity table; it is being able to derive it.**

---

# Final Mental Model

When you see a stack operation, think:

```text
Contract
   ↓
Precondition
   ↓
State transition
   ↓
Postcondition
   ↓
Invariant preservation
   ↓
Implementation cost
   ↓
Worst-case / amortized analysis
   ↓
Memory behavior
   ↓
Failure semantics
   ↓
Testing
   ↓
Production workload
```

That is how a basic DSA operation becomes professional algorithm engineering.
