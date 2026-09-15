# 06.02 — Stack Implementation & Internal Mechanics

> **Phase 06 — Stacks, Queues & Deques**
>
> This chapter moves from the Stack ADT into implementation engineering: representation choices, top/index mechanics, linked nodes, dynamic-array growth, memory behavior, invariants, failure handling, API design, and the reasoning needed to build a stack from first principles.

---

# 1. Learning Objectives

By the end of this chapter, you should be able to:

- derive a stack implementation from its ADT contract;
- implement a stack without relying on a built-in stack abstraction;
- explain exactly what `top` means in different representations;
- implement array-backed and linked-list-backed stacks;
- understand dynamic-array growth and amortized push complexity;
- distinguish logical size, capacity, and storage length;
- reason about empty and full states;
- define robust underflow and overflow behavior;
- preserve stack invariants after every mutation;
- identify memory and cache trade-offs;
- design a production-oriented stack API;
- test a stack using invariants and differential testing;
- choose an implementation based on workload rather than habit.

---

# 2. From ADT to Concrete Representation

In the previous chapter, we defined the Stack as an abstract behavior:

```text
push(x)
pop()
peek()
isEmpty()
size()
```

The ADT does not tell us how the elements must be stored.

We must choose a representation.

Two fundamental representations are:

```text
Stack ADT
   │
   ├── contiguous storage
   │      └── dynamic array
   │
   └── linked storage
          └── linked nodes
```

The implementation problem is therefore:

> **How can we represent the stack so that its required operations are correct, efficient, and maintainable?**

This is the same design process used throughout DSA and production engineering.

---

# 3. The Central Implementation Decision

For a stack, every mutation happens at one logical location:

```text
TOP
```

Therefore the implementation should make access to the top cheap.

This gives us the first design principle:

> **Put the stack top at a representation boundary where insertion and removal are inexpensive.**

For an array:

```text
items = [A, B, C]
             ↑
            top
```

For a linked list:

```text
top
 ↓
C → B → A → null
```

Both representations make the top directly accessible.

---

# 4. Array-Backed Representation

The simplest representation is:

```js
class Stack {
  constructor() {
    this.items = [];
  }
}
```

The array's final occupied position is the logical top.

For:

```js
['A', 'B', 'C']
```

the state is:

```text
index:   0    1    2
value:   A    B    C
                  ↑
                 top
```

The top index can be derived as:

```text
topIndex = size - 1
```

If `size = 0`, the stack is empty and there is no valid top element.

---

# 5. Minimal Array Implementation

A first-principles implementation is:

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

This is short, but an expert should be able to explain the mechanics rather than merely memorize it.

---

# 6. What Actually Happens During `push`?

Suppose:

```text
[A, B]
```

We execute:

```js
push(C)
```

Conceptually:

```text
Before

index:  0  1
value:  A  B
          size = 2

             ↓ push(C)

After

index:  0  1  2
value:  A  B  C
             ↑
            top
          size = 3
```

The logical operation is:

```text
newSize = oldSize + 1
store value at index oldSize
```

For a dynamic array, the runtime may also need to grow its backing storage when capacity is exhausted.

That distinction matters for amortized analysis.

---

# 7. Logical Size vs Capacity

These are different concepts.

### Size

Number of elements currently stored.

```text
size = 3
```

### Capacity

Number of elements that can fit in the current backing allocation before growth is required.

```text
capacity = 8
```

Therefore:

```text
size ≤ capacity
```

Example:

```text
capacity = 8
size     = 3

[A, B, C, _, _, _, _, _]
```

The unused positions are available capacity.

JavaScript's `Array` abstraction does not expose a simple user-level `capacity` property corresponding exactly to a conventional vector implementation, so treat capacity as an implementation model rather than assuming a specific V8 storage layout.

---

# 8. Dynamic Array Growth

Imagine a fixed backing array with capacity 4:

```text
[A, B, C, D]
```

Now we push `E`.

There is no free slot in the conceptual backing storage.

A conventional dynamic-array strategy is:

```text
allocate larger storage
copy/move existing elements
insert E
replace old storage
```

Conceptually:

```text
Old:
[A B C D]

        ↓ grow

New:
[A B C D _ _ _ _]
```

The growth factor is implementation-dependent. Common dynamic-array designs use multiplicative growth so repeated insertion remains amortized O(1).

Do not assume a particular JavaScript engine growth factor unless you are studying that engine's current implementation.

---

# 9. Why `push()` Is Amortized O(1)

An individual resize can cost O(N).

For example:

```text
push #1 → O(1)
push #2 → O(1)
push #3 → O(1)
push #4 → O(1)
push #5 → resize → O(N)
```

It would therefore be incorrect to claim every push is strictly O(1).

However, if capacity grows geometrically, expensive reallocations happen increasingly far apart.

Across N pushes:

```text
total insertion work ≈ O(N)
```

Therefore:

```text
amortized cost per push = O(1)
```

This is an important distinction:

```text
worst-case individual push: O(N)
amortized push:              O(1)
```

---

# 10. Manual Dynamic Stack Model

To understand the mechanics, imagine a custom vector:

```js
class ManualStack {
  constructor(initialCapacity = 4) {
    this.storage = new Array(initialCapacity);
    this.sizeValue = 0;
  }

  push(value) {
    // grow if necessary
    // store at sizeValue
    // increment sizeValue
  }

  pop() {
    // check empty
    // decrement sizeValue
    // return previous top
  }
}
```

The important state is:

```text
storage
size
capacity = storage.length
```

The stack does not need a separate `top` value because:

```text
topIndex = size - 1
```

This is an example of **derived state**.

---

# 11. Derived State vs Stored State

Suppose we store both:

```js
this.size = 3;
this.top = 2;
```

Then we must maintain:

```text
top === size - 1
```

after every mutation.

This creates another invariant that can become inconsistent.

If we can derive top cheaply:

```text
topIndex = size - 1
```

we often prefer not to duplicate it.

Engineering principle:

> **Avoid storing state that can be derived cheaply unless the stored form provides a meaningful performance or design benefit.**

---

# 12. `pop()` Mechanics

Suppose:

```text
[A, B, C]
size = 3
```

`pop()` should return C and produce:

```text
[A, B]
size = 2
```

Conceptually:

```text
oldTopIndex = size - 1
value = storage[oldTopIndex]
size = size - 1
return value
```

A production implementation may also clear the removed reference when retaining backing storage:

```js
storage[size - 1] = undefined;
```

Why?

Because leaving a reference in an unused slot can keep an otherwise unreachable object alive longer than necessary.

This is a memory-retention consideration, not a requirement for the abstract Stack ADT.

---

# 13. Why Clearing Removed References Can Matter

Suppose a stack stores a very large object:

```text
storage[0] → hugeObject
```

We pop it logically:

```text
size = 0
```

If the backing array still contains the reference:

```text
storage[0] → hugeObject
```

then the object may remain reachable through the stack's storage.

If we clear it:

```text
storage[0] = undefined
```

the object can become eligible for garbage collection if no other references exist.

This illustrates an important distinction:

```text
logical deletion ≠ necessarily removal of the reference
```

The runtime memory model can therefore influence implementation details.

---

# 14. Empty Stack Mechanics

An empty array-backed stack is naturally:

```text
storage = []
size = 0
```

Then:

```text
peek()
```

has no top element.

You must define the API contract.

Possible designs:

```text
undefined
throw
Result<T>
```

Do not mix policies across methods.

For example, this is confusing:

```text
pop()  → undefined
peek() → throws
```

unless there is a documented reason.

---

# 15. Fixed-Capacity Stack

A bounded stack can be modeled as:

```text
storage = fixed array
capacity = N
size ≤ N
```

Push behavior:

```text
if size === capacity
    overflow
else
    insert
```

Pop behavior:

```text
if size === 0
    underflow
else
    remove top
```

The key advantage is predictable maximum storage.

This is useful when memory usage must be bounded.

---

# 16. Overflow Is a Policy Decision

When a bounded stack is full, possible policies include:

### Reject

```text
push → failure
```

### Throw

```js
throw new Error('Stack overflow');
```

### Return a result

```js
{ ok: false, error: 'STACK_FULL' }
```

### Overwrite

This is generally not Stack semantics anymore unless explicitly defined as a specialized circular/overwrite structure.

For infrastructure code, silently discarding the oldest value is dangerous unless the API explicitly promises that behavior.

---

# 17. Linked-List Representation

A linked stack stores nodes:

```text
Node:
[value | next]
```

Example:

```text
top
 ↓
[C|•] → [B|•] → [A|null]
```

The top is the head node.

This is crucial: if we instead use the tail as the top in a singly linked list, removal would require traversal to find the predecessor.

Therefore:

```text
singly linked stack
→ top should normally be the head
```

---

# 18. Linked `push()` Mechanics

Before:

```text
top
 ↓
B → A → null
```

Push C:

```text
newNode.next = top
top = newNode
```

After:

```text
top
 ↓
C → B → A → null
```

Only a constant number of pointer assignments are required.

Therefore:

```text
push = O(1)
```

---

# 19. Linked `pop()` Mechanics

Before:

```text
top
 ↓
C → B → A
```

Save C:

```text
removed = top
```

Advance top:

```text
top = top.next
```

Result:

```text
top
 ↓
B → A
```

Return removed value.

Again:

```text
pop = O(1)
```

No traversal is required.

---

# 20. Linked Stack Invariants

For a singly linked implementation:

```text
top === null  ↔  size === 0
```

and:

```text
size = number of reachable nodes from top
```

If the implementation tracks size, every successful push/pop must update it exactly once.

A valid acyclic list should eventually reach:

```text
null
```

A cycle would violate the expected stack representation.

---

# 21. Why Not Push at the Tail?

Suppose:

```text
A → B → C → null
```

and C is the top.

To pop C from a singly linked list, we need B to become the new tail.

Finding B requires traversal:

```text
A → B → C
    ↑
 predecessor
```

That costs O(N).

By putting the top at the head:

```text
C → B → A
↑
TOP
```

we make both push and pop O(1).

Representation choice directly determines complexity.

---

# 22. Array vs Linked Stack — Deeper Comparison

The asymptotic table is only the beginning.

| Dimension | Array-backed | Linked-list-backed |
|---|---|---|
| Push | O(1) amortized | O(1) |
| Pop | O(1) | O(1) |
| Peek | O(1) | O(1) |
| Allocation | amortized contiguous growth | per-node allocation |
| Locality | generally strong | pointer chasing |
| Metadata | low | node references + object overhead |
| Capacity | dynamic or fixed | naturally dynamic |
| Random access | possible | O(N) |
| Memory retention | backing storage may remain allocated | nodes individually collectible when unreachable |
| Implementation | simpler | more pointer-sensitive |

For JavaScript application code, the array implementation will often be the practical default.

But the correct engineering answer is workload-dependent.

---

# 23. Cache Locality

Contiguous data structures tend to have better spatial locality.

Conceptually:

```text
Array:
[A][B][C][D][E]
 ↑ nearby memory locations
```

Linked nodes may be scattered:

```text
[A]       [B]
   [C]             [D]
```

Traversal therefore involves following references to potentially distant locations.

This can make linked structures slower in practice even when both operations have identical asymptotic complexity.

The lesson is:

> **Big-O describes growth; it does not completely describe hardware-level performance.**

---

# 24. JavaScript-Specific Considerations

When implementing stacks in JavaScript, understand:

- arrays are high-level dynamic objects, not raw C-style vectors;
- engine optimizations can depend on element kinds and usage patterns;
- object allocation has runtime cost;
- garbage collection affects latency and memory behavior;
- clearing references can reduce accidental retention;
- recursion consumes the runtime call stack;
- explicit stacks allow algorithmic state to be represented in ordinary data.

Do not build conclusions around undocumented engine internals unless your task specifically requires runtime-level investigation.

---

# 25. API Design

A production Stack API should define its contract.

Example:

```js
class Stack {
  push(value) {}
  pop() {}
  peek() {}
  isEmpty() {}
  size() {}
}
```

Questions the contract must answer:

```text
Can undefined be stored?
What does pop() do when empty?
What does peek() do when empty?
Is capacity bounded?
What happens on overflow?
Can callers mutate internal storage?
Is iteration supported?
Does iteration expose top-to-bottom or bottom-to-top order?
```

These are API design questions, not merely coding details.

---

# 26. Encapsulation

Avoid exposing mutable internal representation unnecessarily.

Weak design:

```js
stack.items.push('corruption');
```

If users can mutate internal storage directly, they can bypass invariants.

Better:

```js
stack.push(value);
stack.pop();
stack.peek();
```

The implementation owns its state transitions.

This is the same principle used in production services:

> **Centralize mutation behind validated operations.**

---

# 27. Generic Stack Design

Conceptually, a stack is generic over its element type:

```text
Stack<T>
```

In TypeScript:

```ts
class Stack<T> {
  private items: T[] = [];

  push(value: T): void {
    this.items.push(value);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
}
```

The data structure does not need to know whether T is:

```text
number
string
object
request
AST node
search state
```

This separation between container semantics and element type is fundamental to reusable data structures.

---

# 28. Stronger Error Contracts

For systems where `undefined` can be a valid element, returning `undefined` on empty can be ambiguous.

Example:

```js
stack.push(undefined);
```

Now:

```js
pop() === undefined
```

could mean either:

```text
an actual undefined value was stored
```

or:

```text
stack was empty
```

An explicit result type solves the ambiguity:

```js
{
  ok: true,
  value
}
```

versus:

```js
{
  ok: false,
  error: 'EMPTY_STACK'
}
```

The right choice depends on the surrounding system's error-handling conventions.

---

# 29. Correctness Through State Transitions

A useful proof strategy is to examine each operation.

Suppose the invariant is:

```text
size equals the number of stored elements
```

For `push(x)`:

1. Before: there are N elements.
2. Insert x at the top.
3. Increase size to N + 1.
4. Therefore the invariant is restored.

For `pop()`:

1. Before: there are N > 0 elements.
2. Remove the top element.
3. Decrease size to N − 1.
4. Return the removed element.
5. Therefore the invariant is restored.

This is **invariant preservation reasoning**.

---

# 30. Complexity Proof by Primitive Operations

Instead of memorizing:

```text
push = O(1)
pop = O(1)
```

derive them.

For linked push:

```text
allocate node
set next
update top
increment size
```

The number of operations does not depend on N.

Therefore:

```text
O(1)
```

For linked pop:

```text
read top
advance top
decrement size
return value
```

Again independent of N:

```text
O(1)
```

For array push, the ordinary case is O(1), but resizing may require O(N). Therefore the correct aggregate statement is amortized O(1).

---

# 31. Testing Strategy

Do not test only successful pushes and pops.

Use multiple layers.

## Layer 1 — Basic Examples

```text
empty
push A
peek → A
push B
pop → B
pop → A
```

## Layer 2 — Boundary Tests

```text
pop empty
peek empty
capacity 0
capacity 1
single element
repeated push/pop
```

## Layer 3 — Invariant Tests

After every mutation:

```text
size correct
empty state correct
top correct
ordering correct
```

## Layer 4 — Differential Tests

Compare against a trusted simple model:

```js
const reference = [];
```

The optimized implementation must produce the same observable behavior.

---

# 32. Differential Testing

Suppose operations are:

```text
push A
push B
pop
push C
peek
```

Run them against:

```text
Reference array
Your Stack
```

After each operation compare:

```text
returned value
size
empty state
peek value
```

If they diverge, record the first failing operation.

This technique scales far beyond stacks. It is useful for caches, queues, trees, parsers, schedulers, and other stateful systems.

---

# 33. Property-Based Thinking

Instead of testing only examples, test properties.

For any valid value x:

```text
push(x)
peek()
```

should return x without changing size.

Also:

```text
push(x)
pop()
```

should return x and restore the previous stack state.

For a sequence:

```text
push(a)
push(b)
push(c)
pop()
pop()
pop()
```

returns:

```text
c, b, a
```

These are behavioral properties of the ADT.

---

# 34. Common Implementation Bugs

## Bug 1 — Incorrect top index

Using:

```text
top = size
```

instead of:

```text
top = size - 1
```

for an occupied array index.

## Bug 2 — Forgetting size update

Push modifies storage but not size.

## Bug 3 — Decrementing size too late

Returning the wrong array position during pop.

## Bug 4 — Popping from empty

Accessing an invalid element without a defined contract.

## Bug 5 — Linked-stack tail removal

Causing O(N) pop by choosing the wrong end.

## Bug 6 — Corrupting `next`

Losing the remainder of a linked stack during push/pop.

## Bug 7 — Exposing internal state

Allowing callers to bypass invariants.

---

# 35. Production Failure Modes

A production stack can fail through:

- unbounded growth;
- memory retention;
- incorrect capacity handling;
- ambiguous empty behavior;
- corrupted linked pointers;
- duplicate ownership of nodes;
- unexpected mutation by consumers;
- excessive object allocation;
- poor observability;
- incorrect assumptions about concurrency.

For infrastructure components, correctness includes failure behavior, not just the happy path.

---

# 36. Backend Application — Request Context Stack

Some backend workflows naturally contain nested contexts:

```text
request
 ↓
auth context
 ↓
transaction context
 ↓
operation context
```

A stack-like structure can model push/pop of temporary state.

However, do not automatically create a custom stack when ordinary language/runtime structures already provide the required behavior.

Engineering maturity means knowing when **not** to build another abstraction.

---

# 37. Backend Application — DFS Work Stack

Iterative depth-first search uses:

```text
stack = [start]
```

Then:

```text
while stack not empty:
    node = stack.pop()
    process(node)
    push children
```

The stack determines traversal order.

The exact child-push order matters because the most recently pushed child is processed first.

This becomes important when deterministic traversal is required.

---

# 38. AI Application — Search and Backtracking

In search systems, a stack can represent pending states for depth-first exploration:

```text
pending states
      ↓
┌────────────┐
│ state C    │ ← next
│ state B    │
│ state A    │
└────────────┘
```

For backtracking:

```text
current decision
      ↓
previous decision
      ↓
previous decision
```

Undoing the latest decision first is naturally LIFO.

But AI systems frequently require ranking, deduplication, beam width, priority, or random access. In those cases a stack alone may be insufficient.

---

# 39. Stack Selection Decision Tree

When deciding whether to use a stack:

```text
Do you need newest-item-first removal?
        │
       yes
        ↓
Do you need arbitrary removal/access?
        │
   ┌────┴────┐
  no        yes
   │          │
 stack     consider another/hybrid structure
```

Then choose representation:

```text
Need simple general-purpose stack?
→ array

Need explicit node identity or linked ownership?
→ linked representation

Need bounded memory?
→ fixed-capacity representation

Need priority?
→ heap/priority queue, not stack

Need key lookup?
→ map, possibly combined with another structure
```

---

# 40. When NOT to Use a Stack

Do not use a stack when the required ordering is:

### FIFO

Use a queue.

### Highest priority first

Use a priority queue/heap.

### Random access

Use an array or another indexed structure.

### Key-based retrieval

Use a hash map.

### Double-ended operations

Use a deque.

The data structure should follow the required access pattern.

---

# 41. Engineering Exercise: Derive Before Coding

For a new stack implementation, write these first:

```text
ADT:
Representation:
State variables:
Invariants:
Operations:
Failure policy:
Capacity policy:
Complexity target:
Memory considerations:
Testing strategy:
```

Only after this should implementation begin.

This workflow is deliberately slower at the beginning and faster over the lifetime of the system because it reduces accidental design decisions.

---

# 42. Interview Framework

When asked:

> "Implement a stack."

Do not immediately type code.

A strong answer starts:

> "I will first define the required operations and their failure semantics, then choose a representation that makes top access O(1). For a general JavaScript implementation, I would normally use an array and map the stack top to the array's end."

Then explain:

```text
representation
→ operations
→ invariants
→ complexity
→ edge cases
→ implementation
```

This demonstrates engineering reasoning rather than code memorization.

---

# 43. Interview Follow-Up Questions

Be prepared for:

### Why is array push amortized O(1)?

Explain geometric growth and aggregate cost.

### Why not use the front of an array?

Because front insertion/removal can require shifting elements.

### Why can a linked stack have O(1) push/pop?

Because the top is the head and requires only local pointer changes.

### Which is faster in practice?

Often the array implementation due to locality and lower allocation overhead, but benchmark the actual workload.

### How do you make a stack bounded?

Track capacity and define explicit overflow behavior.

### How do you prove correctness?

State invariants and show each operation preserves them.

---

# 44. Master Complexity Table

| Representation | Push | Pop | Peek | Extra Notes |
|---|---:|---:|---:|---|
| Dynamic array | O(1) amortized | O(1) | O(1) | occasional resize |
| Fixed array | O(1) | O(1) | O(1) | bounded capacity |
| Singly linked | O(1) | O(1) | O(1) | top=head |
| Singly linked, top=tail | O(1) | O(N) | O(1) | poor pop design |

Remember: complexity belongs to the **representation + operation combination**, not merely the abstract data structure name.

---

# 45. Mastery Checklist

## Conceptual

- [ ] I can distinguish Stack ADT from implementation.
- [ ] I can explain why top placement matters.
- [ ] I understand size vs capacity.
- [ ] I understand derived state.

## Implementation

- [ ] I can implement an array-backed stack from scratch.
- [ ] I can implement a fixed-capacity stack.
- [ ] I can implement a linked stack.
- [ ] I can explain every mutation.

## Complexity

- [ ] I can derive O(1) pop.
- [ ] I can derive O(1) peek.
- [ ] I can explain amortized O(1) push.
- [ ] I can compare array and linked representations.

## Engineering

- [ ] I can define underflow behavior.
- [ ] I can define overflow behavior.
- [ ] I can reason about memory retention.
- [ ] I can preserve invariants.
- [ ] I can design differential tests.

## Backend / AI

- [ ] I can recognize stack-shaped backend problems.
- [ ] I can use an explicit stack for DFS.
- [ ] I can recognize backtracking as LIFO state management.
- [ ] I know when a stack is the wrong structure.

---

# 46. Final Takeaways

A professional understanding of stacks is not:

```text
"Stack uses push and pop."
```

It is:

```text
ADT
 ↓
access policy
 ↓
representation
 ↓
state variables
 ↓
invariants
 ↓
operation mechanics
 ↓
complexity
 ↓
memory behavior
 ↓
failure policy
 ↓
testing
 ↓
production trade-offs
```

The most important implementation lesson is:

> **Put the top where the chosen representation makes insertion and removal cheap.**

For most JavaScript application workloads, that means using the end of an array. For specialized ownership, node-level manipulation, or structural requirements, a linked representation may be justified.

The next chapters will build on this foundation rather than treating Stack as a collection of isolated interview tricks.
