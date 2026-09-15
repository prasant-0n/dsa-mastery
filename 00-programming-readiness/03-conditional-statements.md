# 00.3 — Conditional Statements

## 1. Why This Matters for DSA

Algorithms make decisions. A condition determines which path the algorithm takes, when a loop continues, whether a value belongs to a case, and whether an invariant is still valid.

If conditions are unclear, algorithmic reasoning becomes unclear.

---

## 2. Boolean Conditions

A condition evaluates to a truthy or falsy value.

```js
const age = 20;
const isAdult = age >= 18;
```

In DSA, prefer conditions whose meaning is obvious.

```js
while (left <= right) {
    // search space is still valid
}
```

The condition should describe *why* the loop is allowed to continue.

---

## 3. `if` Statement

```js
if (target === value) {
    console.log("found");
}
```

Use `if` when an operation should happen only when a condition is true.

---

## 4. `if...else`

```js
if (value > 0) {
    console.log("positive");
} else {
    console.log("zero or negative");
}
```

This represents a two-way decision.

Think:

```text
condition
   ├── true  → path A
   └── false → path B
```

---

## 5. `else if`

Use this for mutually exclusive cases.

```js
if (score >= 90) {
    grade = "A";
} else if (score >= 80) {
    grade = "B";
} else if (score >= 70) {
    grade = "C";
} else {
    grade = "D";
}
```

Order matters. The first matching branch executes.

---

## 6. Truthy and Falsy Values

JavaScript treats some values as falsy:

```text
false
0
-0
0n
""
null
undefined
NaN
```

Most other values are truthy.

For DSA, be careful with this shorthand:

```js
if (value) {
    // ...
}
```

It is appropriate only when *all* falsy values should mean "not present" or "false".

If `0` is a valid answer, use an explicit condition:

```js
if (value !== undefined) {
    // 0 is still accepted
}
```

---

## 7. Strict Equality

Prefer:

```js
value === target
value !== target
```

This avoids implicit type coercion.

---

## 8. Compound Conditions

Combine conditions with logical operators.

```js
if (value >= min && value <= max) {
    // inclusive range
}
```

Common forms:

```text
A && B  → both must be true
A || B  → at least one must be true
!A      → opposite of A
```

---

## 9. Nested Conditions

Nested conditions are sometimes necessary, but excessive nesting often indicates that the logic can be simplified.

Prefer clear guard conditions where appropriate:

```js
if (array.length === 0) {
    return;
}

// main algorithm
```

This is particularly useful for edge cases.

---

## 10. `switch`

`switch` can be useful when comparing one value against several discrete cases.

```js
switch (operation) {
    case "insert":
        // ...
        break;
    case "delete":
        // ...
        break;
    default:
        // ...
}
```

For most algorithmic problems, `if/else` is sufficient. Choose based on readability, not style preference.

---

## 11. Conditional Logic and Algorithm Invariants

A major DSA skill is connecting conditions to an invariant.

Example:

```js
while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
        return mid;
    }

    if (arr[mid] < target) {
        left = mid + 1;
    } else {
        right = mid - 1;
    }
}
```

The conditions are not arbitrary.

They preserve the property that the remaining search interval contains every position that could still contain the target.

This is the kind of reasoning we will use throughout DSA.

---

## 12. Guard Conditions and Edge Cases

Before the main algorithm, check invalid or trivial states when doing so improves correctness.

```js
if (arr.length === 0) {
    return -1;
}
```

Common edge cases:

```text
empty input
single element
minimum value
maximum value
duplicate values
negative values
already sorted input
all values identical
```

Do not add random checks. Every condition should have a reason.

---

## 13. Common Mistakes

- Using assignment `=` instead of comparison `===`.
- Forgetting that `0`, `""`, `null`, and `undefined` are falsy.
- Writing conditions without understanding boundary cases.
- Using `||` where `??` or an explicit check is required.
- Creating deeply nested conditions that hide the algorithm.
- Changing a boundary without explaining what invariant the change preserves.
- Forgetting `break` in a `switch` case when fall-through is not intended.

---

## 14. DSA Mental Model

When you see a condition, ask:

```text
What decision is being made?

What states are possible?

Which branch is valid for each state?

What boundary is being defined?

What invariant does this condition preserve?
```

This turns conditional logic from syntax into algorithmic reasoning.

---

## 15. Exercises

1. Write a function that returns whether an integer is positive, negative, or zero.
2. Write a function that returns the largest of three numbers without `Math.max()`.
3. Check whether a number lies inside an inclusive range.
4. Check whether a number lies outside an inclusive range.
5. Determine whether an array contains at least one even number.
6. Determine whether every element in an array is positive.
7. Return `-1` for an empty array before finding its maximum value.
8. Implement binary-search branching and explain what each branch eliminates.
9. Write a condition that treats `0` as a valid value but rejects `undefined`.
10. Create a small `switch` implementation for `insert`, `delete`, and `search` operations.

---

## 16. Self-Check

- [ ] I understand `if`, `else if`, and `else`.
- [ ] I understand truthy and falsy values.
- [ ] I use strict equality correctly.
- [ ] I can combine conditions with `&&`, `||`, and `!`.
- [ ] I understand boundary conditions.
- [ ] I can identify useful edge cases.
- [ ] I can explain what an algorithmic condition is protecting or deciding.
- [ ] I can connect a condition to an invariant.
