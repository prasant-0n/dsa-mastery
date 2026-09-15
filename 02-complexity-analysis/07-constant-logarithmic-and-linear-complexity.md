# 02.7 — Constant, Logarithmic & Linear Complexity

## Learning Objective

Build a deep mental model for the three most important low-growth complexity classes:

```text
O(1)
O(log n)
O(n)
```

These appear constantly in backend systems, indexing, searching, caching, data structures, and AI infrastructure.

The goal is not to memorize labels. The goal is to recognize **why the amount of work grows—or does not grow—with input size**.

---

# 1. The Growth Hierarchy

For sufficiently large `n`:

```text
O(1) < O(log n) < O(n)
```

Intuitively:

```text
O(1)     → work does not grow with n
O(log n) → work grows by repeatedly shrinking the problem
O(n)     → work grows proportionally with n
```

These classes are usually considered highly scalable compared with polynomial or exponential growth.

But “better” is still workload-dependent. An `O(n)` scan can be preferable to an `O(log n)` structure if the data is tiny or the indexing overhead is unnecessary.

---

# 2. Constant Complexity — O(1)

An operation is `O(1)` when its asymptotic work is bounded independently of input size.

Example:

```js
function first(numbers) {
  return numbers[0];
}
```

Assuming array indexing is constant-time under the standard random-access model:

```text
Time = O(1)
```

Whether the array has:

```text
10 elements
10,000 elements
10,000,000 elements
```

the operation still performs one indexed access.

---

# 3. Constant Does Not Mean Literally One Operation

Consider:

```js
function example(x) {
  const a = x + 1;
  const b = a * 2;
  const c = b - 3;
  return c;
}
```

The function performs several operations.

But the number of operations does not grow with an input-size parameter.

Therefore:

```text
T(n) = O(1)
```

Constant complexity means **bounded with respect to `n`**, not necessarily one machine instruction.

---

# 4. Multiple Constant Operations

Suppose:

```text
T(n) = 5
```

or:

```text
T(n) = 5000
```

Both are:

```text
O(1)
```

The difference matters in real performance, but not asymptotically.

This is another reason Big-O cannot replace benchmarking and profiling.

---

# 5. Constant-Time Array Access

Under the standard RAM/random-access model:

```js
numbers[i]
```

is treated as:

```text
O(1)
```

because the address can be calculated directly from the base address and index.

Conceptually:

```text
address = base + index × element_size
```

This is one reason arrays are powerful for random access.

---

# 6. Array Length

In JavaScript:

```js
numbers.length
```

is constant-time because the array maintains its length information.

Therefore:

```js
function size(numbers) {
  return numbers.length;
}
```

is:

```text
O(1)
```

Do not confuse retrieving the length with traversing the array.

---

# 7. Constant-Time Does Not Mean Every JavaScript Operation Is O(1)

You must know what the operation actually does.

For example:

```js
numbers.includes(target)
```

may inspect many elements.

Therefore its worst-case complexity is:

```text
O(n)
```

while:

```js
numbers[index]
```

is normally modeled as:

```text
O(1)
```

Abstraction syntax does not determine complexity; underlying work does.

---

# 8. Logarithmic Complexity — O(log n)

Logarithmic complexity appears when the problem size is repeatedly reduced by a constant factor.

The classic example is halving:

```text
n
n/2
n/4
n/8
n/16
...
1
```

After `k` reductions:

```text
n / 2^k = 1
```

Therefore:

```text
2^k = n
```

and:

```text
k = log₂ n
```

So the number of steps is:

```text
O(log n)
```

---

# 9. Why Halving Is Logarithmic

Consider:

```js
function reduceByHalf(n) {
  let steps = 0;

  while (n > 1) {
    n = Math.floor(n / 2);
    steps++;
  }

  return steps;
}
```

The values are approximately:

```text
n
n/2
n/4
n/8
...
```

The loop does not inspect every value from `1` to `n`.

It removes a large fraction of the remaining work on every iteration.

Therefore:

```text
Time = Θ(log n)
```

---

# 10. Search-Space Reduction

The deeper pattern is not specifically “division by two.”

The pattern is:

> **Each operation reduces the remaining search space by a constant factor.**

Examples:

```text
n → n/2
n → n/3
n → 0.1n
```

all produce logarithmic iteration counts under the appropriate model.

The logarithm's base changes the constant factor, not the asymptotic class.

---

# 11. Binary Search

Binary search is the canonical `O(log n)` algorithm.

For sorted data:

```js
function binarySearch(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);

    if (numbers[middle] === target) return middle;

    if (numbers[middle] < target) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return -1;
}
```

Each comparison discards roughly half the remaining elements.

Therefore:

```text
Worst-case time = Θ(log n)
```

---

# 12. Logarithmic Complexity Is About Depth

A useful mental model:

```text
O(log n)
```

often means:

> “How many times can I shrink the problem before reaching a base case?”

This is why logarithmic complexity appears in:

- binary search
- balanced search trees
- divide-and-conquer depth
- heap height
- exponentiation by squaring
- hierarchical indexes

---

# 13. Balanced Trees

A balanced binary tree with `n` nodes has height approximately:

```text
log₂ n
```

Therefore operations following one root-to-leaf path can often be:

```text
O(log n)
```

Examples include balanced search-tree lookup, insertion, and deletion under the usual model.

The **balance condition** is what prevents the height from becoming `O(n)`.

---

# 14. Heap Height

A binary heap is a complete binary tree.

Its height is:

```text
Θ(log n)
```

Therefore operations that move an element along a root-to-leaf path, such as heapify-up or heapify-down, are:

```text
O(log n)
```

This is why priority queues can support efficient insertion and extraction.

---

# 15. Exponentiation by Squaring

Computing:

```text
x^n
```

naively by multiplying `x` repeatedly takes:


```text
O(n)
```

multiplications.

Exponentiation by squaring uses the structure:

```text
x^n = (x^(n/2))²
```

for even `n`, reducing the exponent by a constant factor.

Therefore it can achieve:

```text
O(log n)
```

multiplications.

The important pattern is again **repeated problem-size reduction**.

---

# 16. Linear Complexity — O(n)

An algorithm is linear when its work grows proportionally with input size.

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

If there are `n` elements:

```text
T(n) = c·n + d
```

Therefore:

```text
T(n) = Θ(n)
```

---

# 17. Linear Means Proportional Growth

Suppose:

```text
n = 100
```

and an algorithm performs approximately:

```text
100c
```

units of work.

If:

```text
n = 1,000
```

it performs approximately:

```text
1,000c
```

The input grew by `10×`, and the dominant work also grew by approximately `10×`.

That is linear growth.

---

# 18. Full Array Scan

Operations such as:

```js
for (const item of items) {
  process(item);
}
```

are usually:

```text
O(n)
```

when `process(item)` is `O(1)`.

A full scan is often optimal when every element must be inspected.

This connects directly to lower-bound reasoning:

```text
Need to inspect all n elements
→ Ω(n)

One constant amount of work per element
→ O(n)

Therefore
→ Θ(n)
```

---

# 19. Linear Search

Searching an unsorted array:

```js
function find(numbers, target) {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === target) return i;
  }

  return -1;
}
```

Worst case:

```text
Θ(n)
```

Best case:

```text
Θ(1)
```

The worst-case lower bound for guaranteed search in an unsorted array under the standard comparison model is also:

```text
Ω(n)
```

so the linear scan is asymptotically optimal for that model.

---

# 20. Linear Does Not Mean “Slow”

`O(n)` is often excellent.

If the algorithm must inspect every item, there may be no asymptotically better solution.

Examples:

- summing all values
- finding a maximum in an unsorted collection
- validating every record
- producing an output containing every input element
- one-pass stream processing

The correct question is not:

> “Is it linear?”

but:

> “Does the problem require linear work, and is the constant/resource cost acceptable?”

---

# 21. Constant vs Linear

Compare:

```js
function first(numbers) {
  return numbers[0];
}
```

and:

```js
function sum(numbers) {
  let total = 0;
  for (const number of numbers) total += number;
  return total;
}
```

The first accesses one position:

```text
Θ(1)
```

The second processes every element:

```text
Θ(n)
```

The difference is whether work scales with the number of elements.

---

# 22. Linear vs Logarithmic

Suppose:

```text
n = 1,000,000
```

Then approximately:

```text
log₂(n) ≈ 20
```

while:

```text
n = 1,000,000
```

A logarithmic algorithm might need around a few dozen reduction steps, while a linear algorithm might inspect a million elements.

This illustrates why logarithmic growth scales extremely well.

But binary search requires sorted data and random-access semantics; you cannot replace every linear scan with binary search.

---

# 23. The Hidden Cost of Getting O(log n)

A logarithmic lookup often requires structure:

```text
sorted data
balanced tree
index
heap property
```

Building or maintaining that structure can cost time and memory.

For example:

```text
Build sorted structure → O(n log n)
Query → O(log n)
```

If you only perform one query, the preprocessing may not be worth it.

If you perform millions of queries, the trade-off can become highly favorable.

---

# 24. Preprocessing Trade-Off

Suppose we have:

```text
N = number of records
Q = number of queries
```

A simple scan strategy:

```text
O(NQ)
```

A sorted/indexed strategy might have:

```text
Build = O(N log N)
Each query = O(log N)
Total = O(N log N + Q log N)
```

The better approach depends on `Q` and workload characteristics.

This is a recurring algorithm-selection pattern.

---

# 25. Logarithmic Does Not Always Mean Binary Search

Other sources of `O(log n)` include:

### Tree height

```text
balanced tree
→ O(log n)
```

### Heap operations

```text
insert / extract
→ O(log n)
```

### Divide-and-conquer depth

If each level reduces the problem by a constant factor:

```text
depth = O(log n)
```

### Exponentiation

Repeated squaring:

```text
O(log n)
```

The common principle is structural reduction.

---

# 26. Common Ways to Accidentally Lose O(1)

Consider:

```js
function example(numbers) {
  return numbers.includes(numbers[0]);
}
```

Even though `numbers[0]` is `O(1)`, `includes()` can be `O(n)`.

Therefore:

```text
O(1) + O(n)
= O(n)
```

A constant-time subexpression does not make the entire function constant-time.

---

# 27. Common Ways to Accidentally Lose O(log n)

A binary search can become useless if each step performs a linear operation.

Conceptually:

```text
log n iterations
×
O(n) work per iteration
=
O(n log n)
```

The loop structure alone is not enough.

Always analyze the work performed **inside** each logarithmic step.

---

# 28. Logarithmic Loop Recognition

Common form:

```js
for (let i = 1; i < n; i *= 2) {
  // work
}
```

Values are:

```text
1, 2, 4, 8, 16, ...
```

After `k` iterations:

```text
2^k ≈ n
```

so:

```text
k = Θ(log n)
```

Another common form:

```js
for (let i = n; i > 0; i = Math.floor(i / 2)) {
  // work
}
```

also has:

```text
Θ(log n)
```

---

# 29. A Linear Loop Can Have a Logarithmic Number of Iterations

Be careful with the variable's meaning.

For example:

```js
let x = n;
while (x > 1) {
  x = Math.floor(x / 2);
}
```

There are only:

```text
Θ(log n)
```

iterations.

But if each iteration scans the original array:

```js
let x = n;
while (x > 1) {
  for (const value of numbers) {
    void value;
  }

  x = Math.floor(x / 2);
}
```

then:

```text
Θ(log n) × Θ(n)
= Θ(n log n)
```

---

# 30. Constant, Logarithmic, Linear — Mental Models

### O(1)

```text
Direct access
Fixed number of operations
```

### O(log n)

```text
Repeatedly eliminate a constant fraction
Follow one path in a balanced hierarchy
```

### O(n)

```text
Inspect each element once
Produce/process one unit per element
```

These mental models are more useful than memorizing isolated examples.

---

# 31. Backend Applications

## Cache lookup

A hash-based cache lookup is typically modeled as expected:

```text
O(1)
```

## Indexed lookup

A balanced-tree database index can provide logarithmic search behavior in an appropriate model:

```text
O(log n)
```

## Log processing

A one-pass log transformation is often:

```text
O(n)
```

where `n` is the number of records processed.

## Pagination

Processing a returned page of `k` records can be:

```text
O(k)
```

for per-record application work.

The surrounding database/I/O model still matters.

---

# 32. AI Applications

## Direct key lookup

Metadata lookup by a hash key is commonly expected:

```text
O(1)
```

## Tree/index traversal

Hierarchical indexes often have logarithmic traversal depth:

```text
O(log n)
```

under their respective models.

## Candidate scanning

Scoring `N` candidates once each is:

```text
O(N)
```

## Retrieval pipeline

A common architecture is:

```text
large corpus N
      ↓
index / coarse retrieval
      ↓
small candidate set K
      ↓
linear or pairwise reranking
```

Reducing `N` to `K` can dramatically reduce the expensive stage.

---

# 33. Why These Three Classes Matter So Much

They form the foundation for recognizing more complex algorithms.

For example:

```text
O(n log n)
```

can often be understood as:

```text
n units of work
×
log n levels
```

And:

```text
O(log n)
```

often becomes part of:

```text
O(n log n)
```

through repeated logarithmic-depth work across `n` elements.

Understanding these three classes makes later complexity analysis much easier.

---

# 34. Common Mistakes

## Mistake 1 — “Constant means one operation”

It means independent of `n` asymptotically.

## Mistake 2 — “Logarithmic means dividing by two only”

The deeper pattern is constant-factor reduction.

## Mistake 3 — “Every loop is O(n)”

Iteration count depends on how the loop variable changes.

## Mistake 4 — “Binary search is always O(log n)”

Its assumptions include suitable ordered data and efficient access to the midpoint.

## Mistake 5 — Ignoring work inside a logarithmic loop

`log n` iterations with `n` work each becomes `n log n`.

## Mistake 6 — Assuming linear is bad

Linear can be optimal when every input element must be processed.

## Mistake 7 — Ignoring preprocessing

An `O(log n)` query may require substantial build or maintenance cost.

## Mistake 8 — Treating JavaScript built-ins as magic

Analyze what the operation actually does.

---

# 35. Interview Framework

When asked to recognize `O(1)`, `O(log n)`, or `O(n)`, ask:

```text
1. Does work depend on n?
   └─ No → likely O(1)

2. Does the remaining problem shrink by a constant factor?
   └─ Yes → likely O(log n)

3. Must each element be inspected once?
   └─ Yes → likely O(n)

4. Is there additional work inside each iteration?
   └─ Multiply/include that cost.

5. Are there preprocessing or external-resource costs?
   └─ Include them in the full model.
```

This is a reasoning framework, not a replacement for deriving the actual cost.

---

# 36. Mastery Checklist

- [ ] Explain O(1) precisely.
- [ ] Explain why constant does not mean one operation.
- [ ] Recognize direct array access as O(1) under the standard model.
- [ ] Explain why array scanning is O(n).
- [ ] Derive O(log n) from repeated constant-factor reduction.
- [ ] Recognize logarithmic loops.
- [ ] Explain binary search from search-space reduction.
- [ ] Explain balanced-tree and heap height reasoning.
- [ ] Distinguish O(log n) iterations from total O(n log n) work.
- [ ] Explain why linear complexity can be optimal.
- [ ] Analyze preprocessing/query trade-offs.
- [ ] Handle multiple parameters.
- [ ] Identify hidden costs inside loops.
- [ ] Apply O(1), O(log n), and O(n) to backend systems.
- [ ] Apply these classes to AI retrieval pipelines.

---

# Key Takeaways

1. **O(1) means asymptotically bounded work independent of input size.**
2. **O(log n) usually comes from repeatedly shrinking a problem by a constant factor.**
3. **O(n) usually means proportional work across the input.**
4. **The code structure alone does not determine complexity; execution frequency does.**
5. **A logarithmic loop can become O(n log n) when each iteration performs O(n) work.**
6. **Linear algorithms are often optimal because some problems require inspecting all input.**
7. **Faster asymptotic queries can require preprocessing, indexing, or additional memory.**
8. **Backend and AI systems frequently combine these growth classes across pipeline stages.**
9. **Always state the model and assumptions when a complexity depends on them.**
10. **The core mental models are direct access, constant-factor reduction, and full-input traversal.**
