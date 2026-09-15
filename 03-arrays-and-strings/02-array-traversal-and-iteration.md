# 03.2 — Array Traversal & Iteration

## Definition

**Array traversal** means systematically visiting array elements according to a defined order and processing each visited element.

Traversal is one of the most fundamental algorithmic operations because almost every array algorithm starts with a question like:

> Which elements must I inspect, in what order, and what state must I maintain while inspecting them?

For an array of `n` elements, a complete traversal normally performs `Θ(n)` element visits.

---

## Why Traversal Matters

Traversal teaches the core mechanics behind:

- scanning
- aggregation
- searching
- filtering
- transformation
- counting
- state maintenance
- early termination
- reverse processing
- boundary reasoning
- nested-array processing

Later patterns such as two pointers and sliding windows are essentially more sophisticated forms of controlled traversal.

---

## Core Mental Model

Given:

```text
[10, 20, 30, 40, 50]
```

A forward traversal moves through positions:

```text
0 → 1 → 2 → 3 → 4
```

A reverse traversal moves through:

```text
4 → 3 → 2 → 1 → 0
```

The algorithm consists of three things:

```text
state + transition + work
```

For a basic traversal:

```text
state      = current index i
transition = i → i + 1
work       = process arr[i]
termination = i reaches n
```

This is the same state-transition reasoning introduced in Phase 01.

---

## Standard Index-Based Traversal

```js
for (let i = 0; i < arr.length; i++) {
  const value = arr[i];
  // process value
}
```

For `n` elements:

```text
Visits = n
Time   = Θ(n)
```

If only a constant number of variables are used:

```text
Auxiliary space = Θ(1)
```

---

## Traversal Invariant

For a forward traversal, a useful invariant is:

> Before processing `arr[i]`, every element at indices `< i` has already been processed exactly as required.

At the start:

```text
0 elements processed
```

After one iteration:

```text
arr[0] processed
```

After `i` iterations:

```text
arr[0 ... i-1] processed
```

At termination:

```text
arr[0 ... n-1] processed
```

This gives a simple correctness proof for many linear scans.

---

## Forward Traversal

Use when processing elements from left to right:

```js
for (let i = 0; i < arr.length; i++) {
  // arr[i]
}
```

Common applications:

- sum
- minimum/maximum
- counting
- validation
- first-match search
- prefix computation
- left-to-right state transitions

---

## Reverse Traversal

```js
for (let i = arr.length - 1; i >= 0; i--) {
  // arr[i]
}
```

Common applications:

- suffix computations
- right-to-left dynamic programming
- reverse construction
- processing dependencies from the end
- finding the last matching element

A reverse traversal still visits each element once:

```text
Time = Θ(n)
```

Direction does not change asymptotic complexity.

---

## Traversal with an Accumulator

An accumulator stores information about elements processed so far.

Example: sum.

```js
function sum(arr) {
  let total = 0;

  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }

  return total;
}
```

Invariant:

> After processing index `i`, `total` equals the sum of all processed elements.

Complexity:

```text
Time = Θ(n)
Auxiliary space = Θ(1)
```

---

## Traversal with a Running Best

Example: maximum.

```js
function maxValue(arr) {
  if (arr.length === 0) return undefined;

  let best = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > best) {
      best = arr[i];
    }
  }

  return best;
}
```

Invariant:

> `best` is the maximum value among all elements processed so far.

This pattern generalizes to:

- minimum
- maximum
- earliest timestamp
- highest score
- lowest price
- best candidate according to a comparator

---

## Traversal with a Counter

Example: count positive numbers.

```js
function countPositive(arr) {
  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > 0) {
      count++;
    }
  }

  return count;
}
```

Invariant:

> `count` equals the number of processed elements satisfying the condition.

This is the foundation of frequency/counting techniques.

---

## Traversal with a Result Array

A traversal can construct a new array.

```js
function doubleValues(arr) {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i] * 2);
  }

  return result;
}
```

If `n` elements are copied into the result:

```text
Time = Θ(n)
Auxiliary/output space = Θ(n)
```

Be precise about space terminology. If the returned array is considered output rather than auxiliary storage, classify it accordingly.

---

## In-Place Traversal

An algorithm can process and modify the existing array without allocating another array.

```js
function incrementAll(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i]++;
  }

  return arr;
}
```

Complexity:

```text
Time = Θ(n)
Auxiliary space = Θ(1)
```

This distinction becomes essential in interview problems that explicitly require `O(1)` extra space.

---

## Early Termination

Not every traversal must visit every element.

```js
function containsNegative(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < 0) return true;
  }

  return false;
}
```

Complexity:

```text
Best case  = Θ(1)
Worst case = Θ(n)
```

If the input distribution is known, an average/expected analysis may differ, but it must not be confused with the worst-case bound.

---

## Early Termination Is Not Automatically Better Asymptotically

Suppose a scan can stop early.

The worst case can still be:

```text
Θ(n)
```

So:

```text
early exit ≠ automatically O(1)
```

It can improve practical performance and best-case behavior while leaving the worst-case asymptotic complexity unchanged.

---

## First Match vs Last Match

To find the first matching element:

```js
for (let i = 0; i < arr.length; i++) {
  if (condition(arr[i])) return i;
}
```

To find the last matching element, a reverse traversal can stop immediately:

```js
for (let i = arr.length - 1; i >= 0; i--) {
  if (condition(arr[i])) return i;
}
```

The choice of traversal direction can eliminate unnecessary work.

---

## `for`, `for...of`, and `while`

### `for`

Best when index control matters.

```js
for (let i = 0; i < arr.length; i++) {
  // arr[i]
}
```

### `for...of`

Best when only values are needed.

```js
for (const value of arr) {
  // value
}
```

### `while`

Useful when traversal termination depends on a custom condition.

```js
let i = 0;
while (i < arr.length) {
  // process
  i++;
}
```

Under ordinary assumptions, all three can perform linear traversal. The important issue is the algorithm's number of element visits, not the syntax used to express the loop.

---

## `forEach`

```js
arr.forEach((value, index) => {
  // process
});
```

For a dense array of `n` elements, processing all visited elements is generally `O(n)`.

However, `forEach` is less suitable when you need:

- immediate `break`
- custom index jumps
- reverse traversal
- multiple-pointer control

Use the construct that makes the algorithm's state transition clear.

---

## `map`

`map` transforms each visited element and creates a new array.

```js
const doubled = arr.map(x => x * 2);
```

For `n` elements with `O(1)` transformation:

```text
Time = Θ(n)
Output space = Θ(n)
```

Do not use `map` merely because a problem says “traverse.” First understand whether you need a transformation, side effect, search, aggregation, or in-place update.

---

## `filter`

```js
const positive = arr.filter(x => x > 0);
```

It traverses the input and constructs a result containing matching values.

Worst-case output size is `n`:

```text
Time = Θ(n)
Output space = O(n)
```

The exact output size can be represented by `k`, giving output-sensitive space:

```text
O(k)
```

where `k` is the number of retained elements.

---

## `reduce`

`reduce` expresses accumulator-style traversal.

```js
const total = arr.reduce((sum, value) => sum + value, 0);
```

Conceptually:

```text
state = accumulator
for each element:
    state = transition(state, element)
```

For constant work per element:

```text
Time = Θ(n)
```

The important DSA skill is understanding the state transition, not memorizing `reduce` syntax.

---

## Traversal and Side Effects

Be careful with:

```js
arr.forEach(value => {
  arr.push(value);
});
```

Mutating the collection while traversing it can change what gets visited and can create confusing behavior.

For DSA, prefer a clear rule:

> **Separate the traversal boundary from modifications whenever mutation could affect the traversal itself.**

If mutation during traversal is intentional, define the semantics explicitly.

---

## Traversing While Mutating

Consider deleting elements while moving forward.

```js
for (let i = 0; i < arr.length; i++) {
  if (shouldRemove(arr[i])) {
    arr.splice(i, 1);
  }
}
```

After deletion, later elements shift left. Incrementing `i` may therefore skip an element.

This is a correctness problem, not merely a performance issue.

Possible solutions include:

- traverse backward
- avoid repeated shifting
- write retained values into the array using a compaction pointer
- construct a new result

The right choice depends on the contract.

---

## Compaction Pattern

A powerful in-place traversal technique is a write pointer.

Conceptually:

```text
read pointer  → examines every element
write pointer → stores elements that should remain
```

Example goal:

```text
remove all zero values in place
```

The read pointer advances through every element; the write pointer advances only when a value is retained.

This produces:

```text
Time = Θ(n)
Auxiliary space = Θ(1)
```

This pattern becomes important in later in-place and two-pointer problems.

---

## Multiple Passes

Two sequential traversals are usually:

```text
Θ(n) + Θ(n) = Θ(n)
```

For example:

```js
for (const x of arr) {
  // pass 1
}

for (const x of arr) {
  // pass 2
}
```

The constant factor changes, but the asymptotic class remains linear.

This is a critical distinction:

> **Sequential linear work adds; nested linear work multiplies.**

---

## Nested Traversal

```js
for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr.length; j++) {
    // work
  }
}
```

This performs approximately:

```text
n × n = n²
```

operations.

Therefore:

```text
Time = Θ(n²)
```

This connects directly to Phase 02's nested-loop analysis.

---

## Dependent Traversal

Consider:

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < i; j++) {
    // work
  }
}
```

The total work is:

```text
0 + 1 + 2 + ... + (n - 1)
```

which is:

```text
Θ(n²)
```

Even though the inner loop does not execute `n` times on every iteration, the total still grows quadratically.

---

## Traversal of a Matrix

For:

```js
const matrix = [
  [1, 2, 3],
  [4, 5, 6]
];
```

A complete traversal is:

```js
for (let r = 0; r < matrix.length; r++) {
  for (let c = 0; c < matrix[r].length; c++) {
    // matrix[r][c]
  }
}
```

For `R` rows and `C` columns in a rectangular matrix:

```text
Time = Θ(RC)
```

Do not write `Θ(n²)` unless the matrix dimensions are known to satisfy `R = C = n`.

---

## Traversal of Jagged Arrays

Rows may have different lengths:

```js
const data = [
  [1, 2],
  [3, 4, 5],
  [6]
];
```

The total work is proportional to the total number of cells:

```text
Θ(total cells)
```

A single dimension such as number of rows is insufficient to describe the work.

This is an example of why precise parameters matter.

---

## Traversal of Objects Stored in Arrays

```js
for (const user of users) {
  if (user.active) {
    // process user
  }
}
```

If property access is treated as `O(1)` under the normal model:

```text
Time = Θ(n)
```

If each element requires a variable-cost operation, model that cost explicitly rather than blindly claiming `O(n)`.

---

## Traversal with a Comparator

Many algorithms maintain the best element according to a comparison function.

```js
function bestBy(arr, score) {
  if (arr.length === 0) return undefined;

  let best = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (score(arr[i]) > score(best)) {
      best = arr[i];
    }
  }

  return best;
}
```

If `score()` costs `O(1)`, total complexity is `O(n)`.

If `score()` costs `O(f(n))`, then the total becomes:

```text
O(n × f(n))
```

assuming it is evaluated once per comparison in the shown implementation.

This illustrates a critical rule:

> **Analyze the cost of the work inside the traversal, not merely the loop structure.**

---

## Traversal and Short-Circuiting

Some JavaScript methods naturally stop early:

```js
arr.some(predicate)
arr.every(predicate)
arr.find(predicate)
arr.findIndex(predicate)
```

These may have:

```text
Best case  = O(1)
Worst case = O(n)
```

when the predicate itself is `O(1)`.

Again, early termination changes possible work, not necessarily the worst-case bound.

---

## Traversal and Correctness

When designing a traversal, explicitly state:

### State

What variables represent progress or accumulated information?

### Transition

How does state change after processing one element?

### Invariant

What remains true after every iteration?

### Termination

What guarantees that the loop eventually stops?

### Postcondition

What does the final state tell us about the input?

This framework scales from a five-line scan to complex array algorithms.

---

## Backend Applications

Array traversal appears in backend workloads such as:

- processing API results
- validating request batches
- transforming records
- filtering events
- aggregating metrics
- scanning logs
- processing queue batches
- ranking candidates
- calculating totals
- validating transaction lines

Example:

```text
batch of N events
      ↓
linear validation
      ↓
filter invalid events
      ↓
aggregate valid events
```

A pipeline of several sequential passes can still be `O(N)` if each pass is linear. But practical performance may differ because every pass adds CPU work, allocations, and memory traffic.

---

## AI Applications

Traversal is equally fundamental in AI engineering:

- iterate over tokens
- process feature vectors
- scan candidate documents
- evaluate embeddings
- transform batches
- compute evaluation metrics
- inspect model outputs

For `N` candidates with constant-time scoring:

```text
Θ(N)
```

For candidates represented by vectors of dimension `D`, scoring every candidate may become:

```text
Θ(ND)
```

The traversal itself is linear in the number of candidates; the per-candidate computation determines the additional factor.

---

## Common Mistakes

### 1. Off-by-one bounds

Use:

```text
0 ≤ i < n
```

### 2. Confusing sequential and nested loops

```text
n + n = O(n)

n × n = O(n²)
```

### 3. Forgetting early termination

A loop with `return` may have a different best-case complexity.

### 4. Mutating while traversing

Shifting elements can cause skipped values.

### 5. Ignoring inner-operation cost

A linear loop containing an `O(n)` operation is not necessarily linear overall.

### 6. Using `O(n²)` for every matrix

Use `R × C` when dimensions are independent.

### 7. Calling every higher-order method interchangeable

`map`, `filter`, `find`, `some`, and `reduce` express different algorithmic intents.

---

## Interview Questions

### Q1. What is array traversal?

Systematically visiting array elements according to a defined order and processing them.

### Q2. What is the complexity of traversing an array?

`Θ(n)` when all `n` elements are visited and each visit performs constant work.

### Q3. What is the difference between two sequential loops and nested loops?

Sequential work adds; nested work multiplies. Two full scans are `Θ(n)`, while two independent nested scans are `Θ(n²)`.

### Q4. Can a traversal be O(1)?

Yes, if the algorithm is permitted to inspect only a constant number of elements. A **complete** traversal of `n` elements cannot be `O(1)` because it must visit `n` elements.

### Q5. What is the benefit of reverse traversal?

It can align processing with right-to-left dependencies and can avoid skipped elements when deleting from an array.

### Q6. Why can early exit improve performance without changing worst-case complexity?

Because some inputs terminate quickly, but another valid input may still require all `n` elements to be inspected.

### Q7. What is the complexity of scanning an `R × C` matrix?

`Θ(RC)` when every cell is visited once.

---

## Revision Checklist

- [ ] I can write forward and reverse traversals without mistakes.
- [ ] I can state the traversal invariant.
- [ ] I can use an accumulator correctly.
- [ ] I can maintain a running minimum/maximum.
- [ ] I understand early termination.
- [ ] I can distinguish best-case and worst-case traversal complexity.
- [ ] I understand in-place vs output-producing traversal.
- [ ] I know when index-based traversal is preferable.
- [ ] I understand `map`, `filter`, `reduce`, `find`, `some`, and `every` conceptually.
- [ ] I can safely reason about mutation during traversal.
- [ ] I can analyze sequential and nested traversal.
- [ ] I can analyze rectangular and jagged 2D arrays.
- [ ] I can account for non-constant work inside a traversal.
- [ ] I can connect traversal to backend batch processing.
- [ ] I can connect traversal to AI candidate/vector processing.

---

## Key Takeaways

1. **Traversal is the fundamental array-processing operation.**
2. **A complete linear traversal is `Θ(n)`.**
3. **Traversal is best understood as state + transition + invariant + termination.**
4. **Sequential linear passes remain linear; nested linear work becomes quadratic.**
5. **Early exit can improve best-case behavior without improving the worst-case bound.**
6. **The cost of operations inside a loop matters.**
7. **Mutation during traversal can create correctness bugs through shifting.**
8. **In-place traversal can reduce auxiliary space to `O(1)`.**
9. **Independent matrix dimensions should be modeled as `R × C`.**
10. **Advanced array patterns are controlled forms of traversal with richer state.**
