# 02.2 — Input Size & Computational Cost

## Learning Objective

Learn to identify what actually determines an algorithm's cost, model input size correctly, and reason about how computational work grows as the input grows.

The goal is not to memorize Big-O labels. The goal is to look at a problem and ask:

> **What quantity grows, what work depends on it, and how does that work scale?**

---

## 1. What Is Input Size?

**Input size** is the quantity that represents how much data or how much problem state an algorithm must process.

For a simple array:

```js
const numbers = [10, 20, 30, 40, 50];
```

The natural input size is:

```text
n = numbers.length
```

But `n` is not always the whole story.

Examples:

| Problem | Useful size parameters |
|---|---|
| Array traversal | `n` = number of elements |
| Two arrays comparison | `n`, `m` |
| Matrix processing | `r`, `c` |
| Graph algorithm | `V`, `E` |
| String matching | `n`, `m` |
| Database query | rows scanned, rows returned, indexes touched |
| Batch API | requests `B`, payload size `S` |
| Search system | corpus `N`, query terms `Q`, candidates `K` |

### Core rule

Never automatically assume that every problem has one input-size variable called `n`.

First determine **which dimensions actually control the work**.

---

## 2. Why Input Size Matters

An algorithm that works instantly on 100 elements may become unusable on 100 million elements.

Consider:

```js
function containsDuplicate(numbers) {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] === numbers[j]) {
        return true;
      }
    }
  }

  return false;
}
```

The important question is not:

> How fast was it on my laptop?

It is:

> How does the amount of work change when `n` becomes larger?

The number of comparisons grows approximately like:

```text
n(n - 1) / 2
```

So doubling `n` produces roughly four times as much pairwise work.

That growth behavior is what complexity analysis captures.

---

## 3. Computational Cost

An algorithm performs operations such as:

- comparisons
- arithmetic
- assignments
- array accesses
- hash lookups
- function calls
- memory allocations
- sorting
- recursion
- I/O
- database queries
- network requests

We can model total work as a function of input size:

```text
Cost = f(n)
```

For example:

```text
f(n) = 3n + 7
```

means the algorithm performs work that grows linearly with `n`.

Another algorithm might have:

```text
f(n) = n² + 5n + 2
```

The second algorithm grows much faster as `n` increases.

---

## 4. Exact Operation Counting vs Growth Analysis

At the beginning, it is useful to count operations precisely.

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

If there are `n` elements, the loop executes `n` times.

There may be several primitive operations per iteration, so an exact model could look like:

```text
f(n) = an + b
```

For algorithm analysis, we usually care more about the **growth rate** than exact machine-level instruction counts.

Thus:

```text
an + b  →  O(n)
```

The constants still matter in production, but asymptotic analysis deliberately focuses on scaling behavior.

---

## 5. Input Size Is Not Always Element Count

Consider:

```js
function printMatrix(matrix) {
  for (const row of matrix) {
    for (const value of row) {
      console.log(value);
    }
  }
}
```

If the matrix has `r` rows and `c` columns, the work is:

```text
O(r × c)
```

If the matrix is square and has `n × n` cells:

```text
O(n²)
```

These are mathematically related but conceptually different models.

For a rectangular matrix, collapsing everything into one `n` can hide an important dimension.

---

## 6. Multiple Input Parameters

Consider:

```js
function compare(a, b) {
  for (const x of a) {
    for (const y of b) {
      if (x === y) {
        return true;
      }
    }
  }

  return false;
}
```

Let:

```text
n = a.length
m = b.length
```

Then the number of comparisons is proportional to:

```text
n × m
```

Therefore:

```text
Time: O(nm)
```

Writing `O(n²)` would only be valid if you explicitly assume `n` and `m` scale together and use a shared variable.

### Expert habit

Keep independent parameters independent unless there is a justified constraint connecting them.

---

## 7. Constraints Connect Input Size to Feasibility

Suppose a problem gives:

```text
1 ≤ n ≤ 20
```

An exponential algorithm may be feasible.

For example:

```text
O(2^n)
```

At `n = 20`:

```text
2^20 = 1,048,576
```

That may be manageable.

But if:

```text
n ≤ 100,000
```

then an `O(2^n)` algorithm is not a realistic general solution.

The complexity is meaningful because it connects:

```text
input constraints → computational growth → feasibility
```

---

## 8. Growth Matters More Than a Single Benchmark

Suppose two implementations take these approximate times:

| `n` | Algorithm A | Algorithm B |
|---:|---:|---:|
| 100 | 1 ms | 2 ms |
| 1,000 | 10 ms | 200 ms |
| 10,000 | 100 ms | 20,000 ms |

Algorithm B might be faster under some small workload in another environment, but its quadratic growth eventually dominates.

This is why complexity analysis complements benchmarking.

### Benchmarking asks

> How fast is this implementation for this workload and environment?

### Complexity analysis asks

> How does its cost scale as the workload grows?

Both are important.

---

## 9. Cost Can Come From Different Resources

Do not equate complexity with CPU time alone.

An algorithm may be limited by:

### CPU

```text
comparisons, arithmetic, hashing, sorting
```

### Memory

```text
arrays, maps, recursion stack, caches, indexes
```

### I/O

```text
file reads, database scans, disk operations
```

### Network

```text
API calls, distributed requests, data transfer
```

### Coordination

```text
locks, synchronization, distributed communication
```

A backend algorithm can have excellent CPU complexity but terrible performance because it performs thousands of database or network operations.

---

## 10. The Hidden Cost of Repeated Work

A common reason algorithms become expensive is repeated computation.

Example:

```js
for (const user of users) {
  const permissions = loadPermissions(user.id);
}
```

If `loadPermissions` performs a database request, the computational model is not simply:

```text
O(n)
```

You must account for the cost of each external operation.

Conceptually:

```text
Total cost ≈ n × cost(loadPermissions)
```

If the external operation is expensive, reducing the number of calls may matter more than optimizing JavaScript instructions.

This is a crucial backend engineering habit:

> **Count expensive operations, not just loops.**

---

## 11. Input Size vs Workload Size

Sometimes the raw input size does not directly describe the work.

Example: a database query may receive one small request but scan millions of rows.

```text
Request payload: tiny
Rows examined: huge
```

The relevant computational quantity is the amount of data actually processed.

Similarly, in a search system:

```text
query size = 10 terms
candidate corpus = 10 million documents
```

The query itself is small, but retrieval may involve a very large search space.

### General principle

Identify the quantity that controls the algorithm's actual work—not merely the size of the input object passed to the function.

---

## 12. Output Size Can Also Determine Cost

Consider:

```js
function copy(numbers) {
  return [...numbers];
}
```

If the output contains `n` elements, producing the output already requires work proportional to `n`.

This gives a fundamental lower-bound intuition:

> If an algorithm must explicitly produce `k` pieces of output, it generally cannot spend less than Ω(k) time merely to produce them.

Output size therefore matters when reasoning about feasibility.

---

## 13. Work Per Element

A useful first approximation is:

```text
Total work = number of processed items × work per item
```

Example:

```js
for (const item of items) {
  process(item);
}
```

If:

```text
n = number of items
cost(process) = O(1)
```

then:

```text
Total = O(n)
```

But if `process(item)` itself scans all `n` items:

```text
Total = O(n × n)
      = O(n²)
```

This decomposition is one of the most useful ways to analyze unfamiliar code.

---

## 14. Nested Work Does Not Automatically Mean n²

Consider:

```js
let j = 0;

for (let i = 0; i < n; i++) {
  while (j < n) {
    j++;
  }
}
```

The `while` loop does not restart from zero for every `i`.

`j` increases from `0` to `n` only once.

Total work:

```text
O(n)
```

This is an important lesson:

> **Analyze total executions, not visual indentation.**

We will study dependent and nested loops more deeply later in Phase 02.

---

## 15. Computational Cost as a Function

Think of an algorithm as a function:

```text
input size → computational work
```

Examples:

```text
n       → n
n       → log n
n       → n²
n       → 2ⁿ
n, m    → nm
r, c    → rc
V, E    → V + E
```

Complexity analysis is essentially the study of these growth relationships.

---

## 16. A Practical Analysis Procedure

When you encounter unfamiliar code:

### Step 1 — Identify the input

What data enters the algorithm?

### Step 2 — Define its size

Use meaningful variables:

```text
n = number of users
m = number of transactions
V = vertices
E = edges
```

### Step 3 — Identify expensive operations

Examples:

```text
comparison
lookup
sort
allocation
DB query
network request
recursive call
```

### Step 4 — Count how often they happen

Ask:

> How many times can this operation execute as the input grows?

### Step 5 — Build the cost function

For example:

```text
T(n) = 3n² + 5n + 2
```

### Step 6 — Determine the dominant growth

```text
3n² + 5n + 2 → O(n²)
```

### Step 7 — Check feasibility against constraints

An algorithm is not useful merely because its code is correct.

It must fit the workload.

---

## 17. Backend Example — Duplicate Detection

### Brute force

```js
function hasDuplicate(users) {
  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      if (users[i].email === users[j].email) {
        return true;
      }
    }
  }

  return false;
}
```

For `n` users:

```text
Time: O(n²)
Auxiliary space: O(1)
```

### Hash-based approach

```js
function hasDuplicate(users) {
  const seen = new Set();

  for (const user of users) {
    if (seen.has(user.email)) {
      return true;
    }

    seen.add(user.email);
  }

  return false;
}
```

Typical complexity:

```text
Time: O(n) expected
Space: O(n)
```

The optimization is not magic. The representation changed the cost of checking whether an email has already appeared.

---

## 18. AI Example — Candidate Scoring

Suppose a retrieval pipeline produces:

```text
N = 100,000 candidate documents
```

and the system computes a score for every candidate.

If scoring each candidate costs approximately constant work:

```text
O(N)
```

If the system compares every candidate with every other candidate:

```text
O(N²)
```

If an index reduces the candidate set to:

```text
K = 100 candidates
```

then downstream reranking may cost approximately:

```text
O(K)
```

This is one of the central ideas behind scalable AI systems:

> **Reduce the expensive search space before applying expensive computation.**

---

## 19. Why This Foundation Matters

Later topics depend on this mental model:

```text
Arrays
  ↓
Searching
  ↓
Sorting
  ↓
Hashing
  ↓
Trees / Heaps / Graphs
  ↓
Dynamic Programming
  ↓
Advanced Algorithms
  ↓
Backend Algorithm Engineering
  ↓
AI Retrieval / Ranking / Inference
```

Without understanding how input size drives computational cost, Big-O becomes memorization.

With this foundation, Big-O becomes a language for describing observed growth.

---

## 20. Common Mistakes

### Mistake 1 — Always using `n`

Different inputs may have different dimensions.

### Mistake 2 — Counting lines instead of executions

A line inside a loop may execute millions of times.

### Mistake 3 — Assuming nested loops always mean O(n²)

Loop variables may move cumulatively rather than independently.

### Mistake 4 — Ignoring expensive external operations

One database query may dominate thousands of CPU operations.

### Mistake 5 — Ignoring output size

Producing large output has unavoidable cost.

### Mistake 6 — Treating benchmark results as complexity analysis

A benchmark measures a particular implementation and workload; complexity describes scaling behavior.

### Mistake 7 — Ignoring constraints

A theoretically correct algorithm can still be computationally infeasible.

---

## 21. Interview Explanation Template

When asked to analyze an algorithm, explain it in this order:

> **1. Define the input-size parameter.**
>
> **2. Identify the dominant operation.**
>
> **3. Count how its executions grow with the input.**
>
> **4. Express the resulting growth function.**
>
> **5. Simplify to the relevant asymptotic class.**
>
> **6. Analyze auxiliary space separately.**

Example:

> “Let `n` be the number of elements. Each element is processed once, and the work per element is constant. Therefore the total work is proportional to `n`, giving O(n) time. The algorithm uses a constant amount of auxiliary state, so auxiliary space is O(1).”

---

## 22. Mastery Checklist

Before moving on, you should be able to:

- [ ] Define input size for a simple problem.
- [ ] Identify multiple independent input parameters.
- [ ] Distinguish input size from actual workload size.
- [ ] Explain why growth matters.
- [ ] Count repeated operations conceptually.
- [ ] Build a simple cost function.
- [ ] Identify dominant computational work.
- [ ] Explain why nested loops do not automatically imply O(n²).
- [ ] Include database/network/I/O work in a realistic model.
- [ ] Recognize output-size constraints.
- [ ] Connect constraints to feasibility.
- [ ] Explain the difference between benchmarking and complexity analysis.
- [ ] Model backend workloads using meaningful parameters.
- [ ] Model AI retrieval workloads using corpus/candidate parameters.
- [ ] Explain complexity reasoning without relying on memorized labels.

---

## Key Takeaways

1. **Input size is a model, not automatically `n`.**
2. **Choose parameters that actually control computational work.**
3. **Complexity describes how cost grows as those parameters grow.**
4. **Count executions of expensive work, not source-code lines.**
5. **Nested syntax does not automatically determine complexity.**
6. **Backend analysis must account for database, network, I/O, and coordination costs.**
7. **AI systems often scale by reducing the candidate/search space before expensive computation.**
8. **Constraints turn complexity analysis into a feasibility decision.**
9. **Benchmarking and asymptotic analysis answer different questions.**
10. **The expert habit is: define the workload → model the work → count it → reason about growth.**
