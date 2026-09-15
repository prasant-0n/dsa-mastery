# 00.1 — Variables and Data Types

## 1. Why This Matters for DSA

Algorithms manipulate data. Before reasoning about an algorithm, you must be comfortable representing values, changing state, and understanding what a variable refers to.

## 2. Variables

JavaScript provides `let`, `const`, and the older `var`.

```js
let count = 0;
count = count + 1;

const limit = 10;
```

### Practical DSA rule

Prefer `const` by default. Use `let` when the variable must be reassigned. Avoid `var` in modern DSA code.

## 3. Primitive Types

The main primitive values you will encounter in DSA are:

- `number`
- `bigint`
- `string`
- `boolean`
- `undefined`
- `null`
- `symbol`

For normal interview problems, `number`, `string`, and `boolean` dominate. `BigInt` matters when integer values exceed JavaScript's safe integer range.

```js
const n = 42;
const name = "array";
const found = true;
const huge = 9007199254740993n;
```

## 4. Number and Safe Integers

JavaScript `number` uses IEEE 754 double-precision floating point. Integer arithmetic is exact only within the safe integer range.

```js
Number.MAX_SAFE_INTEGER;
Number.isSafeInteger(123);
```

Do not blindly assume every large integer can be represented exactly.

## 5. Reference Values

Arrays, objects, functions, `Map`, and `Set` are reference-type values in practical JavaScript reasoning.

```js
const a = [1, 2, 3];
const b = a;

b.push(4);

console.log(a); // [1, 2, 3, 4]
```

`a` and `b` refer to the same array.

This becomes important when implementing linked lists, trees, graphs, queues, and mutable algorithms.

## 6. Equality

Prefer strict equality:

```js
1 === 1;      // true
1 === "1";    // false
```

Avoid relying on coercive equality (`==`) in DSA implementations.

## 7. Type Checking

```js
typeof 10;       // "number"
typeof "hello";  // "string"
typeof true;     // "boolean"
```

Remember that `typeof null` returns `"object"`, a historical JavaScript quirk.

## 8. DSA Mental Model

A variable is a name bound to a value. For mutable structures, multiple variables can refer to the same underlying structure.

Think carefully about:

```text
value
reference
mutation
reassignment
copy
```

These distinctions prevent subtle bugs in algorithm implementations.

## 9. Common Mistakes

- Using `var` without understanding function scope.
- Assuming arrays are copied by assignment.
- Ignoring safe-integer limits.
- Mixing `==` and `===` without a reason.
- Mutating a structure when an independent copy was intended.

## 10. Exercises

1. Create variables for an array length, target value, and whether a target was found.
2. Demonstrate the difference between reassignment and mutation.
3. Show what happens when two variables reference the same array.
4. Test several values with `Number.isSafeInteger()`.
5. Explain why `const arr = []` still allows `arr.push(1)`.

## 11. Self-Check

- [ ] I understand `let` vs `const`.
- [ ] I know the primitive types relevant to DSA.
- [ ] I understand JavaScript number limitations.
- [ ] I understand reference sharing.
- [ ] I can explain mutation vs reassignment.
- [ ] I can write these examples without looking them up.
