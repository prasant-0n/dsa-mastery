# 00.9 — References & Mutation

## 1. Why This Matters for DSA

Many difficult bugs in JavaScript DSA code are not algorithm mistakes. They come from misunderstanding **values, references, mutation, and copying**.

This matters because data structures are often mutable:

```text
array → object → nested object → linked structure → tree → graph
```

If you do not know whether two variables refer to the same underlying value, you cannot reliably reason about an algorithm.

---

## 2. Primitive Values vs Objects

JavaScript primitives include values such as:

```text
number
bigint
string
boolean
undefined
null
symbol
```

Objects include:

```text
arrays
plain objects
functions
Map
Set
Date
and other object values
```

A useful beginner mental model is:

```text
Primitive variable
    ↓
contains a value

Object variable
    ↓
refers to an object
```

The exact ECMAScript semantics are more precise than this model, but it is useful for reasoning about assignment and mutation.

---

## 3. Primitive Assignment

With primitive values:

```js
let a = 10;
let b = a;

b = 20;
```

`a` remains `10`.

The variables do not become aliases to one mutable primitive object.

---

## 4. Object Assignment Creates Another Reference

Consider:

```js
const a = { count: 10 };
const b = a;
```

Both variables refer to the same object.

```js
b.count = 20;
```

Now:

```js
a.count === 20;
```

The assignment did not copy the object.

It created another reference to the existing object.

---

## 5. Identity vs Equality

Two separately created objects can contain the same data but still be different objects:

```js
const a = { value: 1 };
const b = { value: 1 };

console.log(a === b); // false
```

They have equal-looking contents but different identity.

By contrast:

```js
const a = { value: 1 };
const b = a;

console.log(a === b); // true
```

Here both variables reference the same object.

This identity concept becomes essential when working with linked lists, trees, graphs, caches, and visited sets.

---

## 6. Mutation

Mutation changes an existing object.

```js
const user = {
    name: 'A',
};

user.name = 'B';
```

The object itself changed.

Other references to that object observe the change.

---

## 7. Reassignment

Reassignment changes what a variable refers to.

```js
let user = {
    name: 'A',
};

user = {
    name: 'B',
};
```

The original object was not modified by this assignment. The variable now refers to a different object.

Distinguish:

```text
mutation     → changes an existing object
reassignment → changes a variable's reference/value
```

---

## 8. Function Arguments

JavaScript passes arguments by value.

For an object argument, the value being passed is a reference to the object.

```js
function update(user) {
    user.name = 'B';
}

const user = { name: 'A' };
update(user);
```

The object is mutated.

But reassignment inside the function does not replace the caller's variable:

```js
function replace(user) {
    user = { name: 'B' };
}

const user = { name: 'A' };
replace(user);
```

The caller's `user` still refers to the original object.

This is often described informally as "pass-by-reference," but the precise model is **pass-by-value where the value can itself be an object reference**.

---

## 9. Array Aliasing

Arrays are objects, so the same rule applies:

```js
const a = [1, 2, 3];
const b = a;

b.push(4);
```

Now both observe:

```js
[1, 2, 3, 4]
```

This is aliasing: multiple variables refer to the same mutable object.

---

## 10. Shallow Copy

A shallow copy creates a new outer object:

```js
const original = [1, 2, 3];
const copy = [...original];
```

Now:

```js
copy !== original;
```

Changing a top-level primitive element does not affect the original array.

But nested objects remain shared.

```js
const original = [{ count: 1 }];
const copy = [...original];

copy[0].count = 2;
```

Both arrays now expose an object whose `count` is `2`.

---

## 11. Deep Copy Is a Different Problem

If nested mutable data must be completely independent, a shallow copy is insufficient.

One modern option is:

```js
const copy = structuredClone(original);
```

But deep copying is not automatically the correct solution.

It can:

- consume significant memory
- take `O(n)` or more work relative to copied data
- duplicate data unnecessarily
- fail or behave differently for unsupported values

For DSA, prefer designing the algorithm so that unnecessary copying is avoided.

---

## 12. Spread Syntax Does Not Mean Deep Copy

These are shallow copies:

```js
const objectCopy = { ...object };
const arrayCopy = [...array];
```

For nested structures:

```text
original ──→ nested object ←── copy
```

The outer containers differ, but the nested object is shared.

---

## 13. Nested Mutation Example

```js
const state = {
    user: {
        name: 'A',
    },
};

const nextState = { ...state };
nextState.user.name = 'B';
```

This mutates the nested object inside both structures.

If you want the nested property to be replaced without mutating the original:

```js
const nextState = {
    ...state,
    user: {
        ...state.user,
        name: 'B',
    },
};
```

Now the relevant object levels are independently created.

---

## 14. Mutation During Traversal

Changing a collection while iterating it can invalidate your mental model.

Example:

```js
const values = [1, 2, 3, 4];

for (let i = 0; i < values.length; i++) {
    if (values[i] % 2 === 0) {
        values.splice(i, 1);
    }
}
```

After removal, later elements shift left, while `i` still increases.

This can cause elements to be skipped.

When mutating during traversal, explicitly reason about:

```text
index movement
collection length
shifted elements
loop update
```

Often, constructing a result or traversing from the end is safer.

---

## 15. Mutation and Algorithm Contracts

A function should make its mutation behavior clear.

Bad contract:

```text
reverse(array)
```

Better:

```text
reverseInPlace(array)
→ mutates the input
→ returns the same array
```

or:

```text
reversedCopy(array)
→ does not mutate the input
→ returns a new array
```

The difference affects callers, testing, memory usage, and algorithm composition.

---

## 16. In-Place Algorithms

An in-place algorithm modifies the input structure while using little additional working memory.

Example: reverse an array using two pointers.

```js
function reverseInPlace(arr) {
    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
    }

    return arr;
}
```

Time: `O(n)`

Auxiliary space: `O(1)` under the algorithmic model.

In-place does not necessarily mean the runtime performs zero temporary allocations internally; it means the algorithm's additional working storage is bounded independently of input size.

---

## 17. Structural Sharing

Sometimes we want to avoid copying an entire structure while also avoiding destructive mutation.

Instead, create new outer structures while reusing unchanged nested parts.

Conceptually:

```text
old state
 ├── unchanged branch ── shared
 └── changed branch   ── copied
```

This idea appears in persistent data structures and immutable application architectures.

It is not required for beginner DSA, but understanding it helps explain why "copy everything" is not the only alternative to mutation.

---

## 18. `const` Does Not Make Objects Immutable

This is valid:

```js
const user = { age: 20 };
user.age = 21;
```

`const` prevents reassignment of the variable binding. It does not freeze the referenced object.

Compare:

```text
const user = object
       ↑
variable binding cannot be reassigned

object properties
       ↑
can still mutate unless prevented separately
```

---

## 19. `Object.freeze()`

`Object.freeze()` prevents direct changes to an object's own properties in ordinary usage:

```js
const user = Object.freeze({
    age: 20,
});
```

But freezing is shallow:

```js
const user = Object.freeze({
    profile: {
        age: 20,
    },
});
```

The nested `profile` object is still mutable unless it is also frozen.

Do not treat `Object.freeze()` as a universal deep-immutability mechanism.

---

## 20. Equality and Mutation Bugs

A common debugging mistake is checking only values while ignoring identity.

Useful questions:

```text
Are these values equal?
Are these references identical?
Was one object mutated through another alias?
Was a shallow copy mistaken for a deep copy?
```

For objects, `===` checks identity, not structural equality.

---

## 21. DSA Applications

Reference and mutation reasoning becomes essential in:

### Linked Lists

Nodes reference other nodes.

```text
node → next → next → null
```

### Trees

Nodes reference child nodes.

### Graphs

Nodes and adjacency structures reference other objects.

### Caches

Multiple structures may refer to the same cached entry.

### Backtracking

Mutable state must be restored correctly after exploring a branch.

### Dynamic Programming

Shared memoization structures depend on deliberate mutation and identity.

---

## 22. Backend Applications

Backend systems frequently transform nested request/response objects.

A careless mutation can cause:

- one request's state to leak into another operation
- cached data to change unexpectedly
- shared configuration to be modified
- difficult-to-reproduce bugs
- unnecessary full-object copying

Production code should make ownership and mutation boundaries explicit.

---

## 23. AI Applications

AI pipelines often combine large numerical arrays with metadata objects.

For example:

```js
const document = {
    embedding,
    metadata,
};
```

Copying large embeddings repeatedly can be expensive.

Understanding references helps avoid accidental duplication while still preventing unwanted mutation.

Later, this becomes relevant to batch processing, vector retrieval, model inputs, and memory-sensitive pipelines.

---

## 24. Common Mistakes

- Saying JavaScript objects are "passed by reference" without understanding the precise value model.
- Confusing mutation with reassignment.
- Assuming `const` means immutable.
- Assuming spread creates a deep copy.
- Mutating nested objects through a shallow copy.
- Mutating an array while iterating forward without accounting for shifting indexes.
- Copying large structures unnecessarily.
- Returning a mutated input when callers expect a new value.
- Comparing objects with `===` when structural equality is required.
- Forgetting that `Object.freeze()` is shallow.

---

## 25. DSA Mental Model

Whenever an algorithm manipulates an object or array, ask:

```text
1. Who owns this data?
2. Who else can reference it?
3. Am I mutating or reassigning?
4. Do I need a copy?
5. Is a shallow copy enough?
6. What nested data remains shared?
7. Can mutation change traversal behavior?
8. What is the mutation contract?
9. What memory does copying require?
10. Can I solve this in place safely?
```

If you cannot answer these questions, you do not yet fully understand the algorithm's state behavior.

---

## 26. Exercises

1. Demonstrate primitive assignment and explain why changing one variable does not change the other.
2. Demonstrate object aliasing with two variables.
3. Demonstrate object identity using `===`.
4. Write a function that mutates an object argument, then explain why the caller observes the change.
5. Write a function that reassigns its object parameter and explain why the caller's variable does not change.
6. Create a shallow copy of an array containing nested objects and demonstrate the shared nested reference.
7. Create an independent nested copy using `structuredClone()` and compare behavior.
8. Implement `reverseInPlace(arr)` using two pointers.
9. Implement `reversedCopy(arr)` without mutating the input.
10. Create an array-removal loop that accidentally skips elements. Explain exactly why.
11. Fix the removal algorithm without using `filter()`.
12. Create a nested object and update one nested property without mutating the original outer structure.
13. Demonstrate why `const` does not make an object immutable.
14. Demonstrate shallow vs deep freezing with nested objects.
15. For each solution, document identity, mutation, time, and auxiliary-space behavior.

---

## 27. Self-Check

- [ ] I understand primitive values vs object references.
- [ ] I understand aliasing.
- [ ] I can distinguish identity from value equality.
- [ ] I understand mutation vs reassignment.
- [ ] I understand JavaScript's argument-passing model.
- [ ] I understand shallow vs deep copying.
- [ ] I know why `const` does not imply object immutability.
- [ ] I can reason about mutation during traversal.
- [ ] I can implement a safe in-place algorithm.
- [ ] I can state a function's mutation contract.
- [ ] I understand why reference semantics become critical in linked lists, trees, graphs, caches, and backtracking.
