# 00.4 — Loops & Iteration

## 1. Why This Matters for DSA

Most algorithms repeatedly inspect, transform, or eliminate data. Loops are the basic mechanism for expressing that repetition.

You should eventually look at a loop and immediately reason about:

```text
What changes each iteration?
When does it stop?
How many iterations can occur?
What invariant is maintained?
```

That reasoning is the beginning of complexity analysis.

---

## 2. The `for` Loop

The standard form is:

```js
for (let i = 0; i < n; i++) {
    // work
}
```

Think of it as three pieces:

```text
initialization
      ↓
condition → body → update
      ↑             │
      └─────────────┘
```

For an array:

```js
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}
```

This performs one operation per element, so it is typically `O(n)`.

---

## 3. `while` Loop

Use `while` when the stopping condition is more natural than a fixed counter.

```js
let i = 0;

while (i < n) {
    // work
    i++;
}
```

This is common in two-pointer and binary-search algorithms.

```js
while (left <= right) {
    // search
}
```

The key requirement is that the loop must make progress toward termination.

---

## 4. `do...while`

The body executes at least once.

```js
do {
    // work
} while (condition);
```

It is less common in algorithm problems but is useful when one iteration must happen before checking the condition.

---

## 5. `for...of`

Use `for...of` when you need values rather than indexes.

```js
for (const value of arr) {
    console.log(value);
}
```

This can make traversal clearer when the index is irrelevant.

---

## 6. `for...in`

`for...in` iterates enumerable property keys. It is generally **not the preferred loop for arrays**.

```js
for (const key in object) {
    console.log(key);
}
```

For arrays, prefer an indexed `for`, `for...of`, or an appropriate array method depending on the algorithm.

---

## 7. `break`

`break` terminates the nearest loop immediately.

```js
for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
        break;
    }
}
```

Early termination can improve actual runtime, but always analyze worst-case complexity separately.

For example, a linear search is still `O(n)` even if some inputs finish in `O(1)`.

---

## 8. `continue`

`continue` skips the remaining body of the current iteration.

```js
for (const value of arr) {
    if (value < 0) {
        continue;
    }

    console.log(value);
}
```

Use it when skipping a case makes the main logic clearer.

---

## 9. Nested Loops

A nested loop often means multiplication of iteration counts.

```js
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        // work
    }
}
```

This is `O(n²)`.

But don't mechanically label every nested loop `O(n²)`. Analyze the actual bounds.

Example:

```js
for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
        // work
    }
}
```

There are about `n(n - 1) / 2` iterations, which is still `O(n²)`.

---

## 10. Sequential Loops

Two loops executed one after another usually add their costs.

```js
for (let i = 0; i < n; i++) {
    // O(n)
}

for (let i = 0; i < n; i++) {
    // O(n)
}
```

Total:

```text
O(n) + O(n) = O(n)
```

Big-O ignores constant factors.

---

## 11. Loop Growth and Complexity

Not every loop is `O(n)`.

### Increment by one

```js
for (let i = 0; i < n; i++) {}
```

`O(n)`

### Double each iteration

```js
for (let i = 1; i < n; i *= 2) {}
```

`O(log n)`

### Halve each iteration

```js
for (let i = n; i > 0; i = Math.floor(i / 2)) {}
```

`O(log n)`

The important question is:

> **How does the remaining problem size change after each iteration?**

---

## 12. Two-Pointer Traversal

A loop may move multiple pointers while still being linear.

```js
let left = 0;
let right = arr.length - 1;

while (left < right) {
    // work
    left++;
    right--;
}
```

Although two variables move, each pointer moves at most `n` times. The total is `O(n)`, not automatically `O(n²)`.

This distinction becomes important later.

---

## 13. Loop Invariants

A loop invariant is a property that remains true before and after each iteration.

Example:

```js
let sum = 0;

for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
}
```

Useful invariant:

> Before iteration `i`, `sum` equals the sum of elements from index `0` through `i - 1`.

Thinking in invariants helps you prove algorithms correct instead of merely observing that they seem to work.

---

## 14. Off-by-One Errors

One of the most common beginner bugs.

Compare:

```js
for (let i = 0; i < arr.length; i++) {}
```

with:

```js
for (let i = 0; i <= arr.length; i++) {}
```

The second loop accesses an invalid index at `i === arr.length`.

Always ask:

```text
What is the first valid index?
What is the last valid index?
Is the upper bound inclusive or exclusive?
```

---

## 15. Infinite Loops

A loop becomes infinite when its termination condition can never become false.

```js
let i = 0;

while (i < n) {
    console.log(i);
    // missing i++
}
```

Before writing a `while` loop, identify the variable that moves toward termination.

---

## 16. Array Methods and DSA

JavaScript provides iteration methods such as:

```text
forEach
map
filter
reduce
some
every
find
findIndex
```

They are useful, but don't let abstraction hide complexity.

For example:

```js
const doubled = arr.map(x => x * 2);
```

is still `O(n)` time and requires `O(n)` output space.

Likewise, chaining several array methods may create multiple passes over the data.

Understand the underlying work before choosing the abstraction.

---

## 17. DSA Mental Model

Whenever you see a loop, identify:

```text
1. State
2. Initialization
3. Loop condition
4. State update
5. Work performed
6. Termination argument
7. Number of iterations
8. Invariant
```

Example:

```js
let left = 0;
let right = arr.length - 1;

while (left < right) {
    if (arr[left] + arr[right] === target) {
        return true;
    }

    if (arr[left] + arr[right] < target) {
        left++;
    } else {
        right--;
    }
}
```

Don't just memorize this pattern. Understand why every pointer movement eliminates part of the search space.

---

## 18. Common Mistakes

- Using `<=` when `<` is required.
- Forgetting to update a `while` loop's state.
- Assuming every nested loop is `O(n²)`.
- Assuming two pointers always mean `O(n²)`.
- Mutating the wrong variable inside a loop.
- Ignoring empty arrays.
- Confusing indexes with values.
- Using `for...in` for array traversal without understanding its behavior.
- Assuming early `break` changes worst-case complexity.

---

## 19. Exercises

1. Print every integer from `0` to `n - 1`.
2. Print every integer from `n` down to `1`.
3. Calculate the sum of an array using an indexed `for` loop.
4. Calculate the maximum value in an array.
5. Count how many values are even.
6. Find the first occurrence of a target and stop immediately with `break`.
7. Print all pairs `(i, j)` where `i < j`.
8. Implement a loop whose counter doubles each iteration and explain why it is `O(log n)`.
9. Traverse an array from both ends using two pointers.
10. Write a loop and explicitly state its invariant in a comment.
11. Create an intentional off-by-one bug, observe it, and then fix it.
12. Implement the same simple traversal using `for`, `while`, and `for...of`, then compare readability.

---

## 20. Self-Check

- [ ] I understand `for`, `while`, and `do...while`.
- [ ] I know when to use `for...of` and why `for...in` is usually unsuitable for arrays.
- [ ] I understand `break` and `continue`.
- [ ] I can calculate the iteration count of common loops.
- [ ] I understand `O(n)` vs `O(log n)` loops.
- [ ] I can analyze nested and sequential loops.
- [ ] I understand off-by-one errors.
- [ ] I can explain loop termination.
- [ ] I can state a useful loop invariant.
- [ ] I can recognize when multiple pointers still produce linear complexity.
