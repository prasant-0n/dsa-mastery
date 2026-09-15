# 00.2 — Operators and Expressions

## 1. Why This Matters for DSA

Algorithms constantly transform state through arithmetic, comparisons, logical decisions, and assignment. You should be able to read an expression and predict its result before executing it.

## 2. Arithmetic Operators

```js
const a = 10;
const b = 3;

console.log(a + b); // 13
console.log(a - b); // 7
console.log(a * b); // 30
console.log(a / b); // 3.333...
console.log(a % b); // 1
console.log(a ** b); // 1000
```

### DSA focus: modulo

The remainder operator is common in circular indexing and divisibility problems.

```js
const index = 7;
const size = 5;
console.log(index % size); // 2
```

Do not assume `%` always behaves like mathematical modulo for negative values; JavaScript's result keeps the sign of the dividend.

## 3. Assignment Operators

```js
let count = 10;
count += 5;
count -= 2;
count *= 2;
count /= 4;
```

These are useful when maintaining algorithmic state.

## 4. Comparison Operators

Use strict comparisons in DSA code.

```js
5 === 5;  // true
5 !== 4;  // true
5 < 10;   // true
5 >= 5;   // true
```

Avoid accidental type coercion through `==` and `!=`.

## 5. Logical Operators

```js
const age = 25;
const active = true;

age >= 18 && active;
age < 18 || !active;
```

The important operators are:

- `&&` — logical AND
- `||` — logical OR
- `!` — logical NOT

They are heavily used in conditions and loop termination.

## 6. Short-Circuit Evaluation

JavaScript evaluates logical expressions from left to right and may stop early.

```js
const value = null;
const result = value && value.length;
```

This can be useful, but don't sacrifice clarity in algorithm implementations.

## 7. Increment and Decrement

```js
let i = 0;
i++;
++i;
i--;
--i;
```

Be able to distinguish postfix and prefix behavior when an expression uses the returned value.

```js
let i = 0;
const a = i++; // a = 0, i = 1

let j = 0;
const b = ++j; // b = 1, j = 1
```

For loop counters, the distinction is usually irrelevant when the increment is a standalone statement.

## 8. Ternary Operator

Useful for compact value selection:

```js
const max = a > b ? a : b;
```

Don't use nested ternaries when they make algorithmic logic harder to read.

## 9. Operator Precedence

Expressions can become difficult to reason about when many operators are combined.

Prefer explicit parentheses:

```js
const result = (a + b) * c;
```

This makes the intended order obvious.

## 10. Bitwise Operators — Preview

JavaScript provides:

```text
&  AND
|  OR
^  XOR
~  NOT
<< left shift
>> signed right shift
>>> unsigned right shift
```

We will study these deeply later in the Bit Algorithms phase. For now, understand that bitwise operators operate on integer bit representations and can be useful for masks and low-level algorithmic techniques.

## 11. DSA Mental Model

When reading an algorithm, classify each expression as one of:

```text
calculation
comparison
state update
condition
index calculation
termination condition
```

Example:

```js
while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    // ...
}
```

You should immediately recognize:

- `left <= right` → termination/search condition
- `(left + right) / 2` → midpoint calculation
- `left` / `right` → mutable algorithmic state

## 12. Common Mistakes

- Forgetting operator precedence.
- Using `==` when strict equality is intended.
- Confusing `%` with mathematical modulo for negative numbers.
- Accidentally modifying state through `++` or `--` inside a larger expression.
- Writing overly clever expressions that hide the algorithm.

## 13. Exercises

1. Write expressions to calculate quotient and remainder for two integers.
2. Determine whether an integer is even or odd using `%`.
3. Write an expression that returns the larger of two values.
4. Predict the output of prefix and postfix increment examples before running them.
5. Write a condition that checks whether a number is inside an inclusive range.
6. Implement circular array indexing with `%` for non-negative indexes.
7. Explain why parentheses can improve algorithm readability even when they are not technically required.

## 14. Self-Check

- [ ] I understand arithmetic operators.
- [ ] I can use `%` correctly for common DSA problems.
- [ ] I understand strict comparison.
- [ ] I understand `&&`, `||`, and `!`.
- [ ] I understand prefix vs postfix increment.
- [ ] I can read a compound algorithmic expression without guessing.
