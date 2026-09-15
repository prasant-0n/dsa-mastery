# 02.3 — Time Complexity

## Learning Objective

Learn to analyze how an algorithm's **running work grows with input size**.

By the end of this chapter, you should be able to look at unfamiliar JavaScript code, identify the operations that determine runtime, count how often they execute, and derive a meaningful time-complexity bound.

> **Time complexity is about growth in computational work, not a stopwatch reading.**

---

## 1. What Is Time Complexity?

Time complexity describes how the amount of computational work performed by an algorithm changes as its input grows.

We model running work as a function:

```text
T(n)
```

For example:

```text
T(n) = 5n + 3
```

means the work grows linearly with `n`.

Another algorithm might have:

```text
T(n) = 2n² + 4n + 10
```

The exact machine time depends on the implementation and environment, but the growth pattern is quadratic.

---

## 2. Time Complexity Is Not Execution Time

These are different questions.

### Execution time

> How many milliseconds did this implementation take on this machine for this input?

### Time complexity

> How does the amount of work grow as the input becomes larger?

An implementation can be faster for small inputs because of lower constants while having worse asymptotic growth.

This distinction is essential for scalable engineering.

---

## 3. The Basic Analysis Model

Use this mental pipeline:

```text
Input
  ↓
Input-size parameters
  ↓
Basic/expensive operation
  ↓
Number of executions
  ↓
Cost function T(...)
  ↓
Dominant growth
  ↓
Asymptotic complexity
```

Example:

```js
function sum(numbers) {
  let total = 0;

  for (const number of numbers) {
    total += number;
  }

  return total;
}
```

Let:

```text
n = numbers.length
```

The addition executes once per element:

```text
T(n) = an + b
```

Therefore:

```text
Time = O(n)
```

---

## 4. Constant Time — O(1)

An operation is constant-time when its work does not grow with the input size under the analysis model.

Example:

```js
function first(numbers) {
  return numbers[0];
}
```

Whether the array contains 10 elements or 10 million elements, the function performs one indexed access.

```text
Time: O(1)
```

### Important

`O(1)` does **not** mean “instant.”

It means the modeled work is bounded independently of `n`.

---

## 5. Linear Time — O(n)

An algorithm is linear when its work grows proportionally to the input size.

```js
function findMax(numbers) {
  let max = -Infinity;

  for (const number of numbers) {
    if (number > max) {
      max = number;
    }
  }

  return max;
}
```

For `n` elements, the loop performs approximately `n` iterations.

```text
T(n) = an + b
Time = O(n)
```

Typical examples:

- scanning an array
- counting elements
- finding min/max
- checking every character
- copying `n` items

---

## 6. Quadratic Time — O(n²)

Quadratic work commonly appears when every element may interact with every other element.

```js
function printPairs(numbers) {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      console.log(numbers[i], numbers[j]);
    }
  }
}
```

If each loop executes `n` times:

```text
n × n = n²
```

Therefore:

```text
Time: O(n²)
```

At large `n`, this growth becomes expensive quickly.

---

## 7. Triangular Loops

Consider:

```js
function countPairs(numbers) {
  let count = 0;

  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      count++;
    }
  }

  return count;
}
```

The exact number of iterations is:

```text
n(n - 1) / 2
```

Expand it:

```text
(n² - n) / 2
= 0.5n² - 0.5n
```

The dominant growth is quadratic:

```text
O(n²)
```

The triangular structure changes the constant factor, not the asymptotic class.

---

## 8. Sequential Loops

Consider:

```js
function process(numbers) {
  for (const number of numbers) {
    console.log(number);
  }

  for (const number of numbers) {
    console.log(number * 2);
  }
}
```

The first loop is `O(n)`.

The second loop is `O(n)`.

Together:

```text
O(n) + O(n)
= O(2n)
= O(n)
```

### Rule

Sequential work is **added**, then simplified according to dominant growth.

---

## 9. Nested Loops

When loops are independent:

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    work();
  }
}
```

The inner work executes:

```text
n × n = n²
```

Therefore:

```text
O(n²)
```

But never determine complexity merely by counting indentation. Analyze how loop variables actually evolve.

---

## 10. Dependent Nested Loops

Consider:

```js
let j = 0;

for (let i = 0; i < n; i++) {
  while (j < n) {
    j++;
  }
}
```

It looks nested, but `j` is shared across all iterations.

`j` increases from `0` to `n` only once.

Therefore:

```text
outer work = O(n)
inner total work = O(n)

Total = O(n)
```

### Expert rule

> Count total executions, not visual nesting.

---

## 11. Logarithmic Time — O(log n)

Logarithmic algorithms repeatedly reduce the remaining problem by a multiplicative factor.

Example:

```js
function countHalves(n) {
  let count = 0;

  while (n > 1) {
    n = Math.floor(n / 2);
    count++;
  }

  return count;
}
```

After each iteration:

```text
n
n/2
n/4
n/8
...
```

We ask how many times we can divide by 2 before reaching 1:

```text
2^k ≈ n
k ≈ log₂(n)
```

Therefore:

```text
O(log n)
```

---

## 12. The Base of Logarithm

You may see:

```text
O(log₂ n)
O(log₁₀ n)
O(ln n)
```

For asymptotic Big-O analysis, the constant factor between logarithm bases is ignored:

```text
log₂ n = log₁₀ n × constant
```

So we normally write:

```text
O(log n)
```

The base can still matter in practical algorithm design, such as the branching factor of a tree, but not for the usual asymptotic class.

---

## 13. Logarithmic Work Through Search-Space Reduction

Binary search repeatedly halves the search interval.

```text
N
N/2
N/4
N/8
...
1
```

Therefore:

```text
Time = O(log n)
```

The key idea is not “binary search is logarithmic because it is binary.”

The deeper idea is:

> **Each step eliminates a constant fraction of the remaining search space.**

This mental model generalizes far beyond binary search.

---

## 14. Linearithmic Time — O(n log n)

Many efficient sorting algorithms have:

```text
O(n log n)
```

behavior.

Conceptually, divide-and-conquer sorting often has:

```text
log n levels
```

with:

```text
O(n) work per level
```

giving:

```text
O(n log n)
```

We will analyze the underlying recurrence and sorting algorithms later.

---

## 15. Polynomial Time

Polynomial complexities include:

```text
O(n)
O(n²)
O(n³)
O(n^k)
```

where `k` is a constant.

Polynomial does not automatically mean “fast.”

For sufficiently large `n`:

```text
n³
```

can become very expensive.

The actual feasibility depends on:

- `n`
- constant factors
- hardware
- workload
- memory
- I/O
- latency requirements

---

## 16. Exponential Time

An exponential algorithm may have:

```text
O(2^n)
```

Each additional input element can roughly double the search space.

For example, generating all subsets produces:

```text
2^n
```

subsets.

Exponential algorithms are often practical only for relatively small problem sizes or when strong pruning reduces the explored search space.

---

## 17. Factorial Time

Generating all permutations of `n` distinct elements produces:

```text
n!
```

possibilities.

Growth is extremely fast:

```text
1!
2!
3!
...
```

Factorial complexity commonly appears in exhaustive permutation search.

Later, backtracking and pruning will show how we can sometimes avoid exploring the entire theoretical search space.

---

## 18. Combining Different Complexity Terms

Consider:

```js
function example(numbers) {
  for (const number of numbers) {
    work(number);
  }

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      work(numbers[i], numbers[j]);
    }
  }
}
```

The first section:

```text
O(n)
```

The second:

```text
O(n²)
```

Total:

```text
O(n + n²)
```

Dominant term:

```text
O(n²)
```

---

## 19. Multiplying Complexity Terms

Consider:

```js
for (let i = 0; i < n; i++) {
  doLinearWork();
}
```

If `doLinearWork()` itself takes `O(n)`:

```text
n × n = n²
```

Therefore:

```text
O(n²)
```

This is why analyzing helper functions matters.

Do not assume a function call is `O(1)` simply because it appears on one line.

---

## 20. Helper Functions Must Be Expanded

```js
function processAll(numbers) {
  for (const number of numbers) {
    process(number, numbers);
  }
}

function process(number, numbers) {
  for (const value of numbers) {
    if (value === number) {
      return true;
    }
  }

  return false;
}
```

Outer loop:

```text
n calls
```

Each helper call:

```text
O(n)
```

Total:

```text
O(n × n)
= O(n²)
```

### Important

Complexity belongs to the **whole execution**, not individual source-code lines in isolation.

---

## 21. Early Exit and Worst-Case Complexity

Consider:

```js
function contains(numbers, target) {
  for (const number of numbers) {
    if (number === target) {
      return true;
    }
  }

  return false;
}
```

Possible behavior:

- target is first → one comparison
- target is near the middle → roughly `n/2`
- target is last → `n`
- target absent → `n`

Worst-case time:

```text
O(n)
```

Early exit can improve actual runtime without changing the worst-case asymptotic class.

We will study best, average, and worst cases explicitly in a later chapter.

---

## 22. Complexity of Built-In Operations

Be careful with JavaScript built-ins.

Examples:

```js
array.push(x)
array.pop()
```

are typically treated as `O(1)` amortized for ordinary dynamic arrays.

But:

```js
array.shift()
```

typically requires moving many elements and is `O(n)`.

Similarly:

```js
array.includes(x)
```

may scan the array:

```text
O(n)
```

while:

```js
set.has(x)
```

is typically expected `O(1)` under the usual hash-table model.

### Rule

Do not treat built-in methods as automatically constant time. Know or verify their computational behavior.

---

## 23. String Operations Need Care

A statement that looks simple may process many characters.

For example:

```js
const result = a + b;
```

The actual cost can depend on the lengths of the strings and the runtime's representation/optimization behavior.

For algorithmic reasoning, define string lengths explicitly when string copying or scanning is relevant.

Later, string algorithms will require more detailed models.

---

## 24. Sorting Inside a Loop

Consider:

```js
for (const group of groups) {
  group.sort((a, b) => a - b);
}
```

You cannot simply say:

```text
O(n)
```

because the loop body is not constant-time.

If there are `g` groups and each group has at most `k` elements, a simple upper model is:

```text
O(g × k log k)
```

If all groups together contain `n` elements, a tighter analysis may require the individual group sizes:

```text
O(Σ kᵢ log kᵢ)
```

This is another reason meaningful parameters matter.

---

## 25. Time Complexity of Common Patterns

| Pattern | Typical Time |
|---|---:|
| Direct access | O(1) |
| Single scan | O(n) |
| Two independent scans | O(n) |
| Binary search | O(log n) |
| Pairwise comparison | O(n²) |
| Three independent loops | O(n³) |
| Efficient comparison sort | O(n log n) |
| Enumerate all subsets | O(2ⁿ) |
| Enumerate all permutations | O(n!) |

These are patterns, not rules to memorize blindly.

Always derive the complexity from the actual algorithm.

---

## 26. Backend Example — Request Processing

Suppose an endpoint receives `n` records and performs one constant-time in-memory validation per record:

```js
for (const record of records) {
  validate(record);
}
```

If validation is `O(1)`:

```text
CPU work = O(n)
```

Now suppose validation performs a scan through all records:

```text
validation = O(n)
```

Then:

```text
n records × O(n) validation
= O(n²)
```

The algorithmic bottleneck is the repeated scan.

---

## 27. Backend Example — Pagination

Suppose an API returns a page of `k` records from an already indexed data source.

Processing the returned records may cost:

```text
O(k)
```

If the implementation instead repeatedly scans all `n` records to locate each page:

```text
O(n)
```

or worse, depending on the implementation and repeated work.

The algorithmic lesson is:

> **Pagination is not automatically efficient; the retrieval strategy determines the actual cost.**

---

## 28. AI Example — Retrieval and Reranking

Suppose:

```text
N = corpus size
K = retrieved candidates
```

An approximate index may reduce candidate generation from considering all `N` items to approximately `K` candidates.

If reranking is linear in the candidate count:

```text
O(K)
```

The system can then spend expensive scoring computation on `K` rather than `N` items.

If pairwise candidate comparison is used:

```text
O(K²)
```

Reducing `K` can have an even larger effect because the downstream cost is quadratic.

---

## 29. Asymptotic Complexity Is an Abstraction

Suppose two algorithms have:

```text
T₁(n) = 100n
T₂(n) = n²
```

For small `n`, `T₂` might be smaller.

For sufficiently large `n`, `T₁` wins because:

```text
n² grows faster than n
```

Asymptotic analysis intentionally abstracts away machine-specific constants so we can reason about scaling.

Production engineering still requires benchmarking because constants, memory locality, allocation, I/O, and runtime behavior matter.

---

## 30. A Reliable Time-Complexity Checklist

For unfamiliar code:

### 1. Define parameters

```text
n = ?
m = ?
V = ?
E = ?
```

### 2. Find loops

Ask how many times each loop actually executes.

### 3. Expand helper calls

Determine the complexity of called functions.

### 4. Find recursion

Count recursive calls and work per call.

### 5. Account for expensive operations

Sorting, searching, copying, hashing, I/O, DB calls, etc.

### 6. Add sequential work

```text
O(n) + O(n²)
```

### 7. Multiply nested independent work

```text
O(n) × O(n)
```

### 8. Look for dependencies

Do not multiply if work is shared across iterations.

### 9. Build the function

```text
T(n) = ...
```

### 10. Simplify only after deriving it

Then identify the dominant growth.

---

## 31. Common Mistakes

### Mistake 1 — Counting lines

Ten source lines do not imply ten units of runtime.

### Mistake 2 — Assuming every nested loop is quadratic

Analyze variable movement.

### Mistake 3 — Assuming every function call is O(1)

Inspect the function.

### Mistake 4 — Ignoring library operations

`sort`, `includes`, `shift`, copying, and other operations have nontrivial costs.

### Mistake 5 — Dropping terms too early

First derive the total work; simplify afterward.

### Mistake 6 — Confusing early exit with a lower worst-case bound

An early return may improve best/typical behavior while worst-case remains unchanged.

### Mistake 7 — Using one `n` for unrelated dimensions

Keep `n`, `m`, `V`, `E`, etc. distinct when necessary.

### Mistake 8 — Ignoring external operations

A database query or network call can dominate local CPU work.

### Mistake 9 — Memorizing patterns without deriving them

Pattern recognition is useful; blind pattern matching is dangerous.

---

## 32. Interview Framework

When asked:

> “What is the time complexity?”

Answer in this sequence:

1. **Define the input size.**
2. **Identify the operation being counted.**
3. **Determine how many times it executes.**
4. **Account for helper functions and library calls.**
5. **Combine the costs.**
6. **Simplify to the dominant asymptotic term.**
7. **Mention important assumptions.**

Example:

> “Let `n` be the number of elements. The outer loop executes `n` times, and each iteration performs a linear scan of the same array. Therefore the total work is `n × n`, giving O(n²) time. This assumes the scan itself is linear and there is no early structural optimization.”

That is much stronger than simply saying “quadratic.”

---

## 33. Mastery Checklist

You should now be able to:

- [ ] Define time complexity precisely.
- [ ] Distinguish time complexity from wall-clock runtime.
- [ ] Derive O(1), O(log n), O(n), O(n log n), O(n²), O(n³), O(2ⁿ), and O(n!).
- [ ] Analyze sequential loops.
- [ ] Analyze nested loops.
- [ ] Recognize dependent loops.
- [ ] Analyze helper-function costs.
- [ ] Account for built-in operation complexity.
- [ ] Handle multiple input parameters.
- [ ] Build and simplify a cost function.
- [ ] Reason about early exits.
- [ ] Explain complexity in an interview.
- [ ] Apply time-complexity reasoning to backend workloads.
- [ ] Apply candidate-space reasoning to AI retrieval systems.
- [ ] Derive complexity instead of memorizing labels.

---

## Key Takeaways

1. **Time complexity describes how computational work grows with input size.**
2. **It is not the same thing as milliseconds measured on a machine.**
3. **Sequential costs add; independent nested costs multiply.**
4. **Dependent work must be analyzed by total executions, not indentation.**
5. **Helper functions and built-in methods contribute their own costs.**
6. **Always define the parameters before deriving complexity.**
7. **Derive the cost function first; simplify it second.**
8. **The dominant growth term determines the usual asymptotic class.**
9. **Backend and AI systems require counting expensive operations beyond local CPU instructions.**
10. **The real skill is being able to analyze unfamiliar code from first principles.**
