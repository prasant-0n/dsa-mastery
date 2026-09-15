# 06.01 — Stack Fundamentals & Abstract Data Type (ADT)

> **Phase 06 — Stacks, Queues & Deques**
>
> This chapter establishes the conceptual and engineering foundation for stacks before moving into implementation details, monotonic structures, expression processing, queues, deques, and production applications.

---

## 1. Learning Objectives

By the end of this chapter, you should be able to:

- define a stack precisely;
- explain the LIFO principle;
- distinguish an ADT from a concrete implementation;
- identify stack operations and their contracts;
- derive stack complexity from the representation;
- implement a stack in JavaScript;
- compare array-backed and linked-list-backed stacks;
- reason about overflow, underflow, and empty-state behavior;
- explain why JavaScript arrays are often a practical stack implementation;
- identify stack-shaped problems in backend and AI systems;
- defend a stack design in an interview.

---

# 2. What Is a Stack?

A **stack** is a linear abstract data type in which insertion and removal occur at the same logical end, called the **top**.

The defining rule is:

> **LIFO — Last In, First Out.**

If elements are inserted in this order:

```text
A → B → C
```

then removals occur as:

```text
C → B → A
```

The most recently inserted element is the first element available for removal.

A useful physical analogy is a stack of plates:

```text
┌───┐  ← top
│ C │
├───┤
│ B │
├───┤
│ A │
└───┘
```

You normally add and remove from the top rather than reaching into the middle.

---

# 3. Why Does a Stack Exist?

A general-purpose sequence allows many forms of access:

```text
insert at front
insert at middle
insert at end
remove from front
remove from middle
remove from end
random access
```

Many algorithms do not need all of these operations.

Sometimes the requirement is simply:

```text
add the newest item
remove the newest item
inspect the newest item
```

A stack captures exactly that policy.

This is important because a data structure is not merely a container. It encodes **allowed operations and ordering semantics**.

---

# 4. Stack as an Abstract Data Type

A stack is an **ADT**, not necessarily a particular data structure in memory.

The ADT specifies behavior.

A concrete implementation specifies representation.

For example:

```text
Stack ADT
   │
   ├── Array-backed implementation
   │
   ├── Linked-list-backed implementation
   │
   └── Custom fixed-capacity implementation
```

The same stack behavior can therefore have multiple implementations.

### ADT vs implementation

| Concept | Meaning |
|---|---|
| ADT | What the structure does |
| Representation | How the structure is stored |
| Algorithm | How an operation is performed |
| API | How a caller interacts with it |
| Invariant | What must always remain true |

This distinction becomes increasingly important when designing production systems.

---

# 5. Core Stack Operations

A conventional stack exposes these operations.

## 5.1 `push(x)`

Adds `x` to the top.

```text
Before:
A → B

push(C)

After:
A → B → C(top)
```

### Contract

**Input:** an element `x`  
**Output:** stack containing `x` at the top  
**Side effect:** stack size increases by one

---

## 5.2 `pop()`

Removes and returns the top element.

```text
Before:
A → B → C(top)

pop()

Returns: C

After:
A → B
```

### Contract

If the stack is non-empty:

```text
return previous top
size decreases by 1
```

If empty, the implementation must define an explicit underflow policy.

Possible policies include:

- return `undefined`;
- return a sentinel value;
- throw an error;
- use a result object such as `{ ok, value }`.

The correct policy depends on the API contract.

---

## 5.3 `peek()` / `top()`

Returns the top element without removing it.

```text
A → B → C(top)

peek() → C

Stack remains unchanged.
```

This operation is essential when an algorithm needs to inspect state before deciding whether to remove it.

---

## 5.4 `isEmpty()`

Determines whether the stack contains zero elements.

```text
size === 0
```

A robust implementation should make empty-state semantics explicit.

---

## 5.5 `size()`

Returns the number of elements currently stored.

If size is maintained as metadata, this can be O(1).

If size is derived by traversal, it can be O(N), which is usually undesirable for a stack.

---

# 6. Formal Stack Model

We can model a stack as a sequence:

```text
S = [s₀, s₁, ..., sₙ₋₁]
```

where the top is:

```text
Top(S) = sₙ₋₁
```

For a non-empty stack:

```text
pop(push(S, x)) = x
```

and the remaining structure is equivalent to `S`.

The key semantic property is:

```text
push(A)
push(B)
push(C)

pop() = C
pop() = B
pop() = A
```

The stack therefore imposes an ordering policy independent of the underlying storage mechanism.

---

# 7. Fundamental Invariants

A stack implementation should preserve clear invariants.

### Invariant 1 — Size correctness

```text
size === number of stored elements
```

### Invariant 2 — Top correctness

If non-empty:

```text
top === most recently pushed element that has not been popped
```

### Invariant 3 — LIFO ordering

If two elements remain in the stack, the more recently pushed surviving element must be removed first.

### Invariant 4 — Empty consistency

```text
size === 0
```

must agree with the implementation's empty-state representation.

For an array-backed stack:

```text
items.length === 0
```

is a natural invariant.

---

# 8. Stack State Transitions

Think of stack operations as state transitions.

```text
        push(A)
   ┌───────────────┐
   ↓               │
EMPTY ───────→ [A] │
                 │ │
            push(B)│
                 ↓ │
                [A,B]
                 │
              pop()│
                 ↓ │
                [A]
                 │
              pop()│
                 ↓ │
               EMPTY
```

This model becomes useful later for parsing, backtracking, undo systems, and state machines.

---

# 9. Array-Backed Stack

The simplest JavaScript implementation uses an array.

```js
class Stack {
  constructor() {
    this.items = [];
  }

  push(value) {
    this.items.push(value);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}
```

The array's end acts as the stack top.

This is usually preferable to inserting/removing at index `0` because front operations can require shifting elements.

---

# 10. Why `push()` / `pop()` at the End?

Consider:

```js
items.push(x);
items.pop();
```

Both operations target the array's end.

Contrast this with:

```js
items.unshift(x);
items.shift();
```

which targets the beginning and may require moving many elements.

The stack therefore aligns naturally with the efficient end of a dynamic array.

### Engineering principle

> **Choose the representation so that the required ADT operations map to cheap primitive operations.**

---

# 11. Complexity Analysis

For a normal array-backed stack:

| Operation | Typical complexity |
|---|---:|
| `push` | O(1) amortized |
| `pop` | O(1) |
| `peek` | O(1) |
| `isEmpty` | O(1) |
| `size` | O(1) |
| Search arbitrary value | O(N) |
| Random access by index | O(1) |

### Important distinction

`push()` is generally **amortized O(1)** for a dynamically growing array, not necessarily O(1) for every individual operation.

When the backing storage grows, a resize/copy operation can cost O(N). Across many pushes, the average cost per operation remains O(1) under the usual dynamic-array growth strategy.

---

# 12. Linked-List-Backed Stack

A stack can also use a linked list.

The head represents the top:

```text
TOP
 ↓
C → B → A → null
```

Then:

```text
push(X)

X → C → B → A
↑
TOP
```

and:

```text
pop()

C → B → A
↑
TOP
```

Both operations are O(1) when the head is the top.

---

# 13. Array vs Linked List Stack

| Property | Array-backed | Linked-list-backed |
|---|---|---|
| Push | O(1) amortized | O(1) |
| Pop | O(1) | O(1) |
| Peek | O(1) | O(1) |
| Per-element allocation | Usually no node object | Yes |
| Cache locality | Generally better | Generally worse |
| Memory overhead | Lower in common cases | Higher due to nodes/references |
| Capacity growth | May resize | Naturally grows until memory limit |
| Random indexing | Available | O(N) |
| Implementation simplicity | Very high | Moderate |

For typical JavaScript application code, an array-backed stack is usually the first choice.

A linked implementation becomes useful when its specific memory/ownership/workload characteristics justify it.

---

# 14. Underflow

**Underflow** occurs when a removal operation is requested from an empty stack.

Example:

```js
const stack = new Stack();
stack.pop();
```

The API must define what happens.

### Option A — `undefined`

Simple and JavaScript-friendly:

```js
const value = stack.pop();
```

But callers must distinguish a missing element from a legitimately stored `undefined` value if the stack permits `undefined`.

### Option B — Throw

Useful when empty pop represents a programming error:

```js
throw new Error('Stack underflow');
```

### Option C — Result object

Useful for explicit domain APIs:

```js
{ ok: false, error: 'EMPTY_STACK' }
```

There is no universally correct choice. The contract matters.

---

# 15. Overflow

A bounded stack can have a maximum capacity.

```text
capacity = 3

[A,B,C]

push(D) → overflow
```

A fixed-capacity implementation must define whether overflow:

- throws;
- rejects the operation;
- returns a failure result;
- overwrites data — generally a different abstraction and therefore dangerous unless explicitly required.

For production systems, silent data loss should never be an accidental overflow policy.

---

# 16. Stack vs Array

A JavaScript array provides more capabilities than a stack:

```text
random access
arbitrary insertion
arbitrary deletion
iteration
```

A stack intentionally exposes fewer operations.

Why restrict the interface?

Because abstraction prevents callers from violating the intended ordering semantics.

For example, if callers can directly mutate:

```js
stack.items[0] = 'corrupted';
```

then the stack's abstraction boundary has been weakened.

Production APIs should expose only the operations the abstraction promises.

---

# 17. Stack as a Restricted Sequence

You can think of a stack as:

```text
Sequence + restricted access policy
```

The restriction is:

```text
Only the top is directly mutable/removable.
```

This restriction is what gives stacks their predictable behavior.

Many algorithms exploit exactly this property.

---

# 18. Recognizing a Stack Problem

Look for language such as:

- most recently added;
- last action;
- undo;
- reverse order;
- nested operations;
- matching delimiters;
- backtracking;
- previous state;
- restore the previous configuration;
- process the latest unresolved item first.

These are signals that LIFO behavior may be useful.

Do not automatically use a stack simply because a problem involves sequences. Identify the required ordering policy first.

---

# 19. Classic Example — Reverse a Sequence

Suppose:

```text
Input: A B C D
```

Push all elements:

```text
A
A B
A B C
A B C D
```

Pop all elements:

```text
D C B A
```

The stack naturally performs reversal because insertion order and removal order are opposite.

Complexity:

```text
Time:  O(N)
Space: O(N)
```

---

# 20. Stack and Recursion

A recursive program implicitly uses a call stack.

Consider:

```js
function countdown(n) {
  if (n === 0) return;
  countdown(n - 1);
}
```

Conceptually:

```text
countdown(3)
countdown(2)
countdown(1)
countdown(0)
```

The most recently entered call must complete before the previous call resumes.

That is LIFO behavior.

This is one reason understanding stacks is essential before studying advanced recursion and explicit-stack transformations.

---

# 21. Explicit Stack vs Call Stack

There are two related but different ideas:

### Implicit stack

Managed by the runtime for function calls.

### Explicit stack

Managed by your program:

```js
const stack = [];
```

An explicit stack can replace certain recursive algorithms and gives the programmer control over:

- stored state;
- traversal order;
- memory representation;
- termination behavior;
- work scheduling.

We will use this heavily in tree and graph algorithms later.

---

# 22. Backend Applications

Stacks appear naturally in backend engineering.

## Request Processing

Nested processing contexts can behave stack-like:

```text
request
 → middleware
   → authentication
     → authorization
       → handler
```

## Undo / Rollback State

A service can keep previous states:

```text
state₁
state₂
state₃ ← current
```

Rollback can restore the most recent state first.

## Parser / Validation Systems

Nested structures such as:

```text
JSON
parentheses
expressions
configuration blocks
```

often require stack semantics.

## DFS

Depth-first traversal commonly uses an explicit stack when implemented iteratively.

---

# 23. AI Engineering Applications

Stacks also appear in AI systems, although specialized structures are often better for large workloads.

Examples:

### Depth-first search

```text
Search frontier → stack
```

### Backtracking

Store previous decisions:

```text
decision A
  decision B
    decision C
```

When C fails, return to B, then potentially A.

### Search-state restoration

A stack can store snapshots or reversible operations when exploring state spaces.

### Agent tool/action history

An agent may maintain recent reversible actions, although production systems often use richer event/state representations rather than a bare stack.

The key lesson is not "AI uses stacks everywhere." It is:

> Use stack semantics when the workload genuinely requires LIFO state management.

---

# 24. Production Engineering Considerations

A production stack should answer more than "does push work?"

Consider:

### Capacity

Is it bounded?

### Failure behavior

What happens on underflow/overflow?

### Memory

Can retained elements unnecessarily prevent garbage collection?

### Ownership

Who is allowed to mutate the stack?

### Observability

Do you need:

```text
current size
maximum size
push count
pop count
overflow count
```

### Concurrency

Can multiple execution contexts mutate it?

### API safety

Can callers bypass invariants?

These questions turn a data-structure exercise into engineering.

---

# 25. Common Mistakes

## Mistake 1 — Using the front of an array

```js
unshift()
shift()
```

This can introduce O(N) work per operation.

## Mistake 2 — Forgetting empty-state semantics

A caller should not have to guess what `pop()` does on an empty stack.

## Mistake 3 — Returning the wrong element

`peek()` must not remove the element.

## Mistake 4 — Losing the size invariant

If maintaining explicit size, update it exactly once per successful mutation.

## Mistake 5 — Exposing mutable internals

Callers can accidentally violate stack semantics.

## Mistake 6 — Assuming theoretical complexity guarantees practical performance

An array-backed stack may outperform a linked stack because of locality and lower allocation overhead even when both provide O(1) operations.

---

# 26. Edge Cases

Always test:

```text
empty stack
single element
many elements
duplicate values
undefined/null values if allowed
capacity = 0
capacity = 1
pop until empty
peek repeatedly
push after emptying
overflow
underflow
```

Also test mixed sequences:

```text
push A
push B
pop
push C
peek
pop
pop
```

Do not test only happy paths.

---

# 27. Correctness Reasoning

Suppose we implement an array-backed stack using the array end as the top.

### Push correctness

Before:

```text
items = [A, B]
```

After `push(C)`:

```text
items = [A, B, C]
```

The newly inserted element is the top, so LIFO ordering is preserved.

### Pop correctness

Before:

```text
items = [A, B, C]
```

`pop()` removes C.

Remaining sequence:

```text
[A, B]
```

B is now the most recently surviving element, so the invariant continues to hold.

Thus repeated push/pop operations preserve LIFO ordering by induction over mutations.

---

# 28. Complexity Derivation

If `N` elements are stored:

### Push

Normally append at the end:

```text
O(1)
```

Occasional dynamic-array resize may cost O(N), giving amortized O(1).

### Pop

Remove the final element:

```text
O(1)
```

### Peek

Read the final element:

```text
O(1)
```

### Empty check

Read size/length:

```text
O(1)
```

Therefore a normal array-backed stack supports its core operations efficiently.

---

# 29. Stack Design Decision Framework

When you encounter a stack requirement:

```text
Do I need LIFO?
    ↓ yes
Do I need only top access?
    ↓ yes
Can an array efficiently represent the top?
    ↓ yes
Use array-backed stack
```

Consider another representation when:

- fixed capacity is important;
- specialized memory management is required;
- nodes are already available and owned elsewhere;
- structural sharing is required;
- a larger composite structure makes a linked representation useful.

Never select a linked list merely because "stacks can use linked lists."

---

# 30. Interview Questions

## Beginner

1. What is a stack?
2. What does LIFO mean?
3. What are the core stack operations?
4. What is the difference between `pop()` and `peek()`?
5. What is stack underflow?

## Intermediate

6. How would you implement a stack using an array?
7. Why is array `push()` amortized O(1)?
8. How can you implement a stack using a linked list?
9. Compare array and linked-list stacks.
10. Why should the linked-list head usually represent the stack top?

## Advanced

11. How would you design a bounded production stack?
12. What should happen on overflow?
13. How do recursive calls relate to stacks?
14. How would you replace recursion with an explicit stack?
15. When might a linked-list stack be worse than an array-backed stack despite equal asymptotic complexity?

### Interview follow-up

If asked "Which implementation would you choose in JavaScript?", a strong answer is:

> "For a conventional stack, I'd use an array and treat its end as the top because push, pop, peek, and length are efficient, the implementation is simple, and contiguous array storage generally has better locality and lower per-element object overhead than a linked-node implementation. I'd choose another representation only when the workload or memory/ownership constraints justify it."

---

# 31. Practical Lab

Implement three versions:

### Lab A — Minimal Stack

Required:

```text
push
pop
peek
isEmpty
size
```

### Lab B — Safe Stack

Add:

```text
capacity
underflow policy
overflow policy
clear
```

### Lab C — Production Stack

Add:

```text
invariants
operation counters
validation
reference-model tests
benchmarking
```

Do not copy a solution. Derive the API first.

---

# 32. Mastery Checklist

Before moving forward, you should be able to explain:

- [ ] What a stack is
- [ ] Why LIFO matters
- [ ] Stack ADT vs implementation
- [ ] Push/pop/peek semantics
- [ ] Underflow
- [ ] Overflow
- [ ] Stack invariants
- [ ] Array-backed implementation
- [ ] Linked-list-backed implementation
- [ ] Amortized O(1) push
- [ ] Why array end is preferable to array front
- [ ] Array vs linked-list trade-offs
- [ ] Explicit vs implicit stacks
- [ ] Stack relationship to recursion
- [ ] Backend applications
- [ ] AI applications
- [ ] Production considerations
- [ ] Correctness reasoning
- [ ] Complexity derivation
- [ ] Interview explanation

---

# 33. Key Takeaways

1. **A stack is an ADT defined by LIFO behavior.**
2. **An ADT describes behavior; an implementation describes representation.**
3. **The top is the only directly accessible end in the conventional stack model.**
4. **Array-backed stacks are usually the practical default in JavaScript.**
5. **`push`, `pop`, and `peek` can all be O(1), with dynamic-array push being amortized O(1).**
6. **Underflow and overflow are API-contract decisions, not implementation accidents.**
7. **Stacks model recursion, backtracking, undo, parsing, and depth-first processing naturally.**
8. **The right data structure follows the workload, not the other way around.**

---

# Final Mental Model

Remember the stack as:

```text
                TOP
                 ↓
              ┌─────┐
              │  C  │ ← newest / next out
              ├─────┤
              │  B  │
              ├─────┤
              │  A  │ ← oldest / deepest
              └─────┘

push → add here
pop  → remove here
peek → inspect here

Ordering: LAST IN → FIRST OUT
```

The next chapters will build on this model rather than treating stacks as isolated coding tricks.
