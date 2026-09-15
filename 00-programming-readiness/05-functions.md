# 00.5 — Functions

## 1. Why Functions Matter for DSA

Functions are the unit in which most algorithms are expressed.

A function gives an algorithm:

- inputs
- a transformation or decision process
- an output
- a reusable boundary
- a place to reason about correctness and complexity

For DSA, the important question is not only **how to write a function**, but how to design a function whose behavior and complexity are easy to reason about.

---

## 2. Function Anatomy

```js
function add(a, b) {
    return a + b;
}
```

Think of it as:

```text
input → algorithm → output
```

The function contract should make clear:

```text
What inputs are valid?
What does it return?
Does it mutate anything?
What are the edge cases?
What is the time complexity?
What is the space complexity?
```

---

## 3. Parameters vs Arguments

A parameter is the variable declared by the function.

```js
function square(value) {
    return value * value;
}
```

`value` is a parameter.

When calling:

```js
square(5);
```

`5` is an argument.

This distinction matters when reasoning about APIs and function contracts.

---

## 4. Return Values

`return` sends a value back to the caller and immediately exits the function.

```js
function findFirstEven(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] % 2 === 0) {
            return arr[i];
        }
    }

    return -1;
}
```

Notice that `return` can provide **early termination** of the entire function, not merely the loop.

---

## 5. Function Expressions

Functions can also be assigned to variables.

```js
const add = function (a, b) {
    return a + b;
};
```

The function itself is a value.

---

## 6. Arrow Functions

Modern JavaScript commonly uses arrow functions for short operations.

```js
const add = (a, b) => a + b;
```

They are especially common with array methods:

```js
const doubled = arr.map(value => value * 2);
```

For algorithm-heavy code, choose the syntax that makes the algorithm easiest to read and explain.

---

## 7. Functions Are First-Class Values

JavaScript functions can be:

- assigned to variables
- passed as arguments
- returned from other functions
- stored in arrays or objects

Example:

```js
function apply(value, operation) {
    return operation(value);
}

const result = apply(5, x => x * 2);
```

This idea becomes important for higher-order functions, callbacks, and functional patterns.

---

## 8. Scope

A variable declared inside a function belongs to that function's local scope.

```js
function calculate() {
    const total = 10;
    return total;
}
```

`total` cannot be accessed outside the function.

Prefer local state when designing algorithms. Hidden global state makes correctness, testing, and reasoning harder.

---

## 9. Mutation and Functions

A function can mutate an object or array passed to it.

```js
function appendValue(arr, value) {
    arr.push(value);
}
```

After the call, the original array has changed.

Alternatively, a function can return a new value:

```js
function appendValue(arr, value) {
    return [...arr, value];
}
```

These approaches have different memory and performance implications.

For DSA, always know whether your function:

```text
mutates input
or
returns a new structure
```

---

## 10. Input Validation vs Algorithm Logic

Production code often needs input validation.

```js
function getMax(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        return null;
    }

    // algorithm
}
```

In interview problems, the problem statement often guarantees valid input, so unnecessary validation can distract from the algorithm.

The important skill is knowing the difference between:

```text
problem constraints
vs.
production API contracts
```

---

## 11. Default Parameters

JavaScript supports defaults:

```js
function repeat(value, count = 1) {
    // ...
}
```

Be careful when `0`, `false`, `null`, and `undefined` have different meanings.

Default parameters apply when the argument is `undefined`, not simply when it is falsy.

---

## 12. Rest Parameters

Rest parameters collect remaining arguments into an array.

```js
function sum(...values) {
    let total = 0;

    for (const value of values) {
        total += value;
    }

    return total;
}
```

Creating and traversing that collection has real runtime and memory costs. Understand the abstraction rather than assuming it is free.

---

## 13. Recursive Functions Preview

A function can call itself.

```js
function countdown(n) {
    if (n === 0) {
        return;
    }

    countdown(n - 1);
}
```

Every recursive function needs a **base case** and progress toward it.

We will study recursion deeply in a later phase. For now, understand that function calls consume call-stack space.

---

## 14. Call Stack Mental Model

When a function calls another function, JavaScript keeps track of the active calls.

```text
main()
  ↓
solve()
  ↓
helper()
```

Conceptually:

```text
┌─────────┐
│ helper  │
├─────────┤
│ solve   │
├─────────┤
│ main    │
└─────────┘
```

When `helper` returns, its stack frame is removed.

This becomes critical when analyzing recursion and stack overflow.

---

## 15. Helper Functions

Complex algorithms are often easier to understand when split into small helpers.

```js
function isValidIndex(index, length) {
    return index >= 0 && index < length;
}
```

Good helper functions should have clear responsibilities.

Avoid splitting an algorithm into so many tiny functions that the core logic becomes difficult to follow.

---

## 16. Pure Functions

A pure function:

- depends only on its inputs
- produces the same output for the same inputs
- does not modify external state

Example:

```js
function multiply(a, b) {
    return a * b;
}
```

Pure functions are easier to test and reason about.

Many algorithm implementations naturally work well as pure functions.

---

## 17. Function Complexity

The complexity belongs to the work performed by the function.

```js
function sum(arr) {
    let total = 0;

    for (const value of arr) {
        total += value;
    }

    return total;
}
```

Time: `O(n)`

Auxiliary space: `O(1)`

The returned scalar does not count as growing auxiliary space.

If a function creates an output array of size `n`, that output requires `O(n)` space, even if its temporary working memory is constant.

---

## 18. Composition

Functions can build on other functions.

```js
function double(value) {
    return value * 2;
}

function square(value) {
    return value * value;
}

function doubleThenSquare(value) {
    return square(double(value));
}
```

Composition can improve organization, but always inspect the underlying work when analyzing performance.

---

## 19. Common Mistakes

- Forgetting to return a computed value.
- Confusing `return` with `console.log`.
- Mutating input unintentionally.
- Relying on global variables.
- Ignoring the cost of creating new arrays or objects.
- Writing recursive functions without a reliable base case.
- Hiding the core algorithm behind excessive helpers.
- Ignoring input/output contracts.
- Assuming helper functions are automatically `O(1)`.
- Forgetting that function calls participate in recursion stack usage.

---

## 20. DSA Function Design Checklist

Before submitting an algorithm, ask:

```text
1. What are the inputs?
2. What is the output?
3. What are the constraints?
4. Does the function mutate its inputs?
5. What are the edge cases?
6. Where does it terminate?
7. What is the time complexity?
8. What is the auxiliary space complexity?
9. Can the core logic be explained in a few sentences?
10. Can I modify it for a likely interviewer variation?
```

---

## 21. Exercises

1. Write a function that returns the larger of two numbers without `Math.max`.
2. Write a function that returns the sum of an array.
3. Write a function that returns the first index of a target or `-1`.
4. Write a function that counts values satisfying a condition.
5. Write a function that returns a reversed copy of an array without mutating the input.
6. Write a function that reverses an array **in place**. State the mutation contract and complexity.
7. Write a pure function that returns whether an array is sorted in non-decreasing order.
8. Write a helper function for checking whether an index is valid, then use it in another function.
9. Write a recursive countdown with a base case. Explain what happens on the call stack.
10. Write a function that accepts another function and applies it to every array element.
11. Take one algorithm from the previous chapter and redesign it with a clear function contract.
12. For each exercise, write the expected time and auxiliary-space complexity before running it.

---

## 22. Self-Check

- [ ] I understand parameters, arguments, and return values.
- [ ] I can use declarations, expressions, and arrow functions appropriately.
- [ ] I understand that functions are values in JavaScript.
- [ ] I understand local scope.
- [ ] I can identify accidental mutation.
- [ ] I understand pure vs impure functions.
- [ ] I can explain the call stack at a basic level.
- [ ] I know why recursion needs a base case.
- [ ] I can state a function's input/output contract.
- [ ] I can analyze a function's time and auxiliary-space complexity.
