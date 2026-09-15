# 02.11 — Counting Operations

## Learning Objective

Learn to derive time complexity by **counting the work performed by an algorithm**, rather than guessing from keywords such as `for`, `while`, or recursion.

The goal is to move from:

```text
code
↓
exact operation count
↓
mathematical expression
↓
asymptotic complexity
```

Counting operations is the bridge between reading code and proving its complexity.

---

# 1. What Is an Operation?

For asymptotic analysis, an operation is an abstract unit of computational work.

Examples:

```js
x = x + 1;
a[i] === target;
map.get(key);
```

We usually do not need the exact CPU instruction count.

Instead, we ask:

> How many times does the dominant unit of work execute as input size grows?

---

# 2. Why Count Operations?

Consider:

```js
for (let i = 0; i < n; i++) {
  console.log(i);
}
```

The body executes approximately `n` times.

Therefore:

```text
T(n) = c·n + d
```

where `c` and `d` are constants.

Asymptotically:

```text
Θ(n)
```

Counting makes the conclusion defensible.

---

# 3. Exact Count vs Asymptotic Count

Suppose:

```js
for (let i = 0; i < n; i++) {
  x++;
  y++;
}
```

The body performs two increments:

```text
2n
```

operations, ignoring loop-control details.

Therefore:

```text
T(n) = 2n
Θ(n)
```

The exact count is useful for reasoning.

The asymptotic class describes growth.

---

# 4. Counting a Single Loop

```js
for (let i = 0; i < n; i++) {
  work();
}
```

If `work()` costs `Θ(1)`:

```text
body executions = n
```

Therefore:

```text
T(n) = Θ(n)
```

The important question is always:

> How many times can the body execute?

---

# 5. Loop Bounds Matter

These loops have different counts:

```js
for (let i = 0; i < n; i++) {}
```

approximately:

```text
n
```

while:

```js
for (let i = 1; i <= n; i++) {}
```

also has:

```text
n
```

iterations.

But:

```js
for (let i = 0; i < n - 1; i++) {}
```

has:

```text
n - 1
```

which is still:

```text
Θ(n)
```

Small boundary differences usually disappear asymptotically.

---

# 6. Constant Multipliers

Suppose a loop executes:

```text
5n + 20
```

operations.

For asymptotic analysis:

```text
5n + 20 = Θ(n)
```

Constants affect real performance but not the growth class.

Do not confuse:

```text
exact cost
```

with:

```text
asymptotic growth
```

---

# 7. Sequential Loops Add

Consider:

```js
for (let i = 0; i < n; i++) {
  work();
}

for (let j = 0; j < n; j++) {
  work();
}
```

The total is:

```text
n + n = 2n
```

Therefore:

```text
Θ(n)
```

Sequential loops add their costs.

---

# 8. Different Sequential Bounds

```js
for (let i = 0; i < n; i++) {}

for (let j = 0; j < m; j++) {}
```

Total:

```text
Θ(n + m)
```

Do not automatically collapse this to `Θ(n)`.

If `n` and `m` are independent parameters, preserve both.

---

# 9. Nested Loops Multiply

Consider:

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    work();
  }
}
```

For each of `n` outer iterations, the inner loop runs `n` times.

Therefore:

```text
n × n = n²
```

and:

```text
Θ(n²)
```

---

# 10. Nested Loops With Different Parameters

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < m; j++) {
    work();
  }
}
```

Count:

```text
n × m
```

Therefore:

```text
Θ(nm)
```

This is more precise than saying `Θ(n²)` unless `m` is known to equal or scale with `n`.

---

# 11. Triangular Loops

Consider:

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < i; j++) {
    work();
  }
}
```

The inner loop runs:

```text
0 + 1 + 2 + ... + (n - 1)
```

Using:

```text
0 + 1 + ... + (n - 1)
= n(n - 1) / 2
```

Therefore:

```text
T(n) = Θ(n²)
```

Even though the inner loop does not always execute `n` times.

---

# 12. Dependent Bounds

Consider:

```js
for (let i = 0; i < n; i++) {
  for (let j = i; j < n; j++) {
    work();
  }
}
```

Counts are:

```text
n + (n - 1) + (n - 2) + ... + 1
```

which is:

```text
n(n + 1) / 2
```

Therefore:

```text
Θ(n²)
```

The correct method is to derive the sum instead of relying on visual intuition.

---

# 13. Logarithmic Loops

Consider:

```js
for (let i = 1; i < n; i *= 2) {
  work();
}
```

Values are approximately:

```text
1, 2, 4, 8, 16, ...
```

After `k` iterations:

```text
2ᵏ ≈ n
```

Therefore:

```text
k ≈ log₂ n
```

and:

```text
Θ(log n)
```

---

# 14. Logarithmic Loops With Division

```js
for (let i = n; i > 1; i = Math.floor(i / 2)) {
  work();
}
```

The value repeatedly halves:

```text
n
n/2
n/4
n/8
...
```

Therefore the number of iterations is:

```text
Θ(log n)
```

---

# 15. Multiple Logarithmic Operations

```js
for (let i = 1; i < n; i *= 2) {
  for (let j = 1; j < m; j *= 2) {
    work();
  }
}
```

The loops execute approximately:

```text
log n × log m
```

Therefore:

```text
Θ(log n · log m)
```

---

# 16. Linear × Logarithmic

```js
for (let i = 0; i < n; i++) {
  for (let j = 1; j < n; j *= 2) {
    work();
  }
}
```

Outer loop:

```text
n
```

Inner loop:

```text
log n
```

Total:

```text
Θ(n log n)
```

---

# 17. Non-Unit Loop Increments

Consider:

```js
for (let i = 0; i < n; i += 5) {
  work();
}
```

The loop executes approximately:

```text
n / 5
```

times.

Since `1/5` is constant:

```text
Θ(n)
```

Likewise:

```js
i += 100
```

is still linear.

---

# 18. Multiplicative Growth

Compare:

```js
for (let i = 0; i < n; i += 2) {}
```

with:

```js
for (let i = 1; i < n; i *= 2) {}
```

The first changes by a constant amount:

```text
Θ(n)
```

The second changes by a constant factor:

```text
Θ(log n)
```

This distinction is fundamental.

---

# 19. Loop With Two Variables

Consider:

```js
let i = 0;
let j = n;

while (i < j) {
  i++;
  j--;
}
```

Each iteration moves both variables toward each other.

Together they cover approximately `n` units of progress.

Therefore:

```text
Θ(n)
```

Do not multiply the variables merely because two variables appear.

Analyze the number of loop iterations.

---

# 20. Two Pointers Often Produce Linear Total Work

```js
let left = 0;
let right = n - 1;

while (left < right) {
  if (condition) left++;
  else right--;
}
```

Each pointer moves monotonically toward the other.

If each pointer advances at most `n` times:

```text
Total pointer movements ≤ 2n
```

Therefore:

```text
Θ(n)
```

This is a recurring counting technique for two-pointer algorithms.

---

# 21. Counting Work in Nested Dependent Loops

Consider:

```js
for (let i = 1; i <= n; i++) {
  for (let j = 1; j <= i; j++) {
    work();
  }
}
```

Count the inner executions:

```text
1 + 2 + 3 + ... + n
```

Therefore:

```text
n(n + 1) / 2
```

and:

```text
Θ(n²)
```

The exact summation is often the cleanest proof.

---

# 22. Nested Loops Are Not Always Multiplication by n²

Consider:

```js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < i * i; j++) {
    work();
  }
}
```

The total is:

```text
Σ i²
```

from `i = 0` to `n - 1`.

Since:

```text
Σ i² = Θ(n³)
```

we obtain:

```text
Θ(n³)
```

The inner loop's bound must be analyzed, not merely counted as “one nested loop.”

---

# 23. Conditional Work

Consider:

```js
for (let i = 0; i < n; i++) {
  if (items[i] > 0) {
    work();
  }
}
```

Even if `work()` runs only for some elements, the loop still inspects every element.

Therefore worst-case time is:

```text
Θ(n)
```

If `work()` is `Θ(1)`, average behavior is also generally linear under any distribution where a nonzero fraction of elements may trigger work.

---

# 24. Conditional Branches Add, Not Multiply

Consider:

```js
for (const x of items) {
  if (conditionA(x)) {
    workA();
  } else {
    workB();
  }
}
```

Only one branch executes per iteration.

If both branch costs are constant:

```text
Θ(n)
```

Do not multiply branch costs as though both execute simultaneously.

---

# 25. Sequential Function Calls

Suppose:

```js
function a(items) {
  // Θ(n)
}

function b(items) {
  // Θ(n²)
}
```

and:

```js
function main(items) {
  a(items);
  b(items);
}
```

Total:

```text
Θ(n + n²)
```

Dominant term:

```text
Θ(n²)
```

Sequential complexity adds before simplification.

---

# 26. Repeated Function Calls Inside a Loop

If:

```text
helper(n) = Θ(n)
```

and:

```js
for (let i = 0; i < n; i++) {
  helper(n);
}
```

then:

```text
n × n = Θ(n²)
```

Always inspect the complexity of called functions.

A constant-looking function call in source code may hide substantial work.

---

# 27. Recursive Operation Counting

Consider:

```js
function count(n) {
  if (n <= 1) return;

  count(n - 1);
}
```

There is one recursive call per level.

Depth:

```text
n
```

Therefore:

```text
Time = Θ(n)
Space = Θ(n)
```

Now compare:

```js
function count(n) {
  if (n <= 1) return;

  count(n - 1);
  count(n - 1);
}
```

The number of calls branches exponentially.

Therefore:

```text
Time = Θ(2ⁿ)
```

with recursion depth:

```text
Θ(n)
```

---

# 28. Counting Operations With a Summation

A powerful general method is:

```text
Total work = Σ(work at each iteration/state)
```

For example:

```text
for i = 1 ... n
    do i units of work
```

becomes:

```text
Σ i
```

which becomes:

```text
Θ(n²)
```

This technique generalizes to complex nested loops.

---

# 29. Useful Summations

Memorize these because they repeatedly appear in DSA analysis:

### Arithmetic sum

```text
1 + 2 + ... + n = Θ(n²)
```

More precisely:

```text
n(n + 1) / 2
```

### Squares

```text
1² + 2² + ... + n² = Θ(n³)
```

More precisely:

```text
n(n + 1)(2n + 1) / 6
```

### Geometric series

```text
1 + 2 + 4 + ... + 2ⁿ = Θ(2ⁿ)
```

### Harmonic series

```text
1 + 1/2 + 1/3 + ... + 1/n = Θ(log n)
```

These identities are useful proof tools.

---

# 30. Harmonic Loop Pattern

Consider a nested loop where the inner work is proportional to:

```text
n / i
```

Total work becomes:

```text
Σ(n / i)
= n Σ(1 / i)
= Θ(n log n)
```

Recognizing harmonic sums is an important step toward advanced complexity analysis.

---

# 31. Counting Pair Comparisons

Suppose an algorithm compares every pair of distinct elements:

```js
for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) {
    compare(items[i], items[j]);
  }
}
```

Number of pairs:

```text
n(n - 1) / 2
```

Therefore:

```text
Θ(n²)
```

This pattern appears in duplicate detection, pairwise similarity, collision checks, and naive recommendation/ranking systems.

---

# 32. Counting Output Work

Suppose an algorithm generates all pairs:

```text
(n choose 2)
```

Even if pair generation itself is constant work, the output contains:

```text
Θ(n²)
```

items.

Therefore the algorithm cannot asymptotically run faster than the amount of output it must produce.

This is an output-size lower-bound argument.

---

# 33. Backend Example — Pairwise Duplicate Checks

Naive duplicate detection might compare every pair:

```text
n(n - 1) / 2
```

comparisons.

Therefore:

```text
Θ(n²)
```

An indexed or hash-based representation can reduce the dominant search work to expected:

```text
Θ(n)
```

at the cost of additional memory.

Counting the pair comparisons reveals exactly where the optimization opportunity exists.

---

# 34. AI Example — Pairwise Similarity

Suppose an AI pipeline compares every pair of `n` vectors, and each similarity computation costs `Θ(d)` for embedding dimension `d`.

Number of pairs:

```text
Θ(n²)
```

Cost per pair:

```text
Θ(d)
```

Total:

```text
Θ(n²d)
```

This is why all-pairs similarity becomes expensive as candidate counts grow.

---

# 35. Counting Candidate Reranking

Suppose a retrieval system receives `q` queries and reranks `k` candidates per query, with scoring cost `Θ(d)`.

Total work:

```text
q × k × d
```

Therefore:

```text
Θ(qkd)
```

If `k` is capped, the system has a stronger predictable upper bound per query.

---

# 36. Counting I/O or Network Operations

Complexity analysis is not limited to CPU operations.

Suppose an API performs:

```text
1 database query per item
```

for `n` items.

Even if each query is individually fast, the system performs:

```text
n queries
```

This is:

```text
Θ(n)
```

in query count.

In production, query count may matter more than the in-memory loop itself because network and database operations are expensive.

---

# 37. Nested Network Calls

Suppose:

```text
n requests
```

and each request triggers:

```text
m database queries
```

Total database calls:

```text
nm
```

Therefore:

```text
Θ(nm)
```

This is the algorithmic shape behind many N+1 query problems.

---

# 38. Counting Allocation Work

A loop can also create memory pressure:

```js
for (let i = 0; i < n; i++) {
  const result = transform(items[i]);
}
```

If `transform()` allocates a new object each time, there may be:

```text
Θ(n)
```

allocations.

Even when asymptotic time remains `Θ(n)`, allocation frequency can strongly affect real performance through garbage collection and memory bandwidth.

---

# 39. Complexity of JavaScript Built-ins

Do not automatically treat every JavaScript method as `O(1)`.

Examples often requiring linear work:

```js
arr.includes(x)   // O(n)
arr.indexOf(x)    // O(n)
arr.slice(...)    // O(k), where k is copied length
arr.map(...)      // O(n)
arr.filter(...)   // O(n)
arr.sort(...)     // typically O(n log n), implementation-dependent
```

Always ask:

> What amount of data does this operation inspect, copy, or reorder?

---

# 40. Counting Hidden Work in Abstractions

This code:

```js
items.map(transform).filter(predicate)
```

may look like one expression.

Conceptually it performs multiple passes:

```text
map → Θ(n)
filter → Θ(n)
```

Total:

```text
Θ(n + n)
= Θ(n)
```

But if the intermediate array is materialized, memory and allocation behavior differ from a fused single-pass implementation.

Asymptotic time alone does not capture every engineering consequence.

---

# 41. Counting With Multiple Parameters

Suppose:

```text
n = number of users
m = number of permissions per user
```

and the algorithm checks every permission for every user.

Total operations:

```text
nm
```

Therefore:

```text
Θ(nm)
```

Preserve independent parameters until you have a justified relationship between them.

---

# 42. Dominant Work

Suppose:

```text
T(n) = 3n² + 100n + 500
```

As `n` grows, the quadratic term dominates:

```text
Θ(n²)
```

Counting gives the complete expression.

Simplification gives the asymptotic class.

Both stages are useful.

---

# 43. Practical Counting Procedure

For unfamiliar code:

```text
1. Identify the input-size parameters.
2. Mark the basic unit of work.
3. Count how many times each loop executes.
4. Expand dependent bounds into sums.
5. Analyze recursive calls separately.
6. Include costs of helper functions and built-ins.
7. Add sequential work.
8. Multiply genuinely nested work.
9. Preserve independent parameters.
10. Include I/O/network/database operations when relevant.
11. Simplify the resulting expression.
12. State the final asymptotic bound.
```

---

# 44. Common Mistakes

## Mistake 1 — “One loop means O(n)”

Not necessarily. Its body may contain `O(n)` work.

## Mistake 2 — “Two loops mean O(n²)”

Not necessarily. They may be sequential, logarithmic, or dependent.

## Mistake 3 — Multiplying independent sequential loops

Sequential costs add.

## Mistake 4 — Ignoring loop bounds

A dependent bound can create a summation rather than simple multiplication.

## Mistake 5 — Ignoring helper-function complexity

A function call may hide a complete traversal or sort.

## Mistake 6 — Treating built-ins as magic

Library abstractions still perform computational work.

## Mistake 7 — Collapsing multiple parameters too early

`O(nm)` is not automatically `O(n²)`.

## Mistake 8 — Ignoring output and I/O

The system may be bottlenecked by data movement rather than arithmetic.

---

# 45. Interview Framework

When given code and asked for complexity:

```text
1. Define n (and other parameters).
2. Identify the dominant operation.
3. Count the outer iterations.
4. Count inner/dependent iterations.
5. Analyze function calls.
6. Add sequential costs.
7. Multiply nested costs.
8. Reduce sums.
9. Drop constants/lower-order terms.
10. State time and space complexity.
```

Example:

```js
for (let i = 0; i < n; i++) {
  for (let j = i; j < n; j++) {
    work();
  }
}
```

Strong answer:

> The inner loop executes `n - i` times for each `i`, so the total is `n + (n-1) + ... + 1 = n(n+1)/2 = Θ(n²)`. Assuming `work()` is constant time and no additional data structure grows with `n`, the auxiliary space is Θ(1).

---

# 46. Mastery Checklist

- [ ] Define an abstract operation for complexity analysis.
- [ ] Distinguish exact operation count from asymptotic complexity.
- [ ] Count a simple linear loop.
- [ ] Add sequential loops.
- [ ] Multiply genuinely nested loops.
- [ ] Analyze loops with different parameters.
- [ ] Analyze triangular loops.
- [ ] Analyze dependent bounds using summations.
- [ ] Recognize multiplicative/logarithmic loops.
- [ ] Analyze two-pointer total movement.
- [ ] Analyze recursive call counts.
- [ ] Use arithmetic and geometric sums.
- [ ] Recognize harmonic sums.
- [ ] Count pairwise comparisons.
- [ ] Include helper-function costs.
- [ ] Include built-in method costs.
- [ ] Preserve multiple input parameters.
- [ ] Count database/network operations when relevant.
- [ ] Analyze allocation work separately from asymptotic CPU work.
- [ ] Derive complexity instead of guessing from syntax.

---

# Key Takeaways

1. **Counting operations is the foundation of rigorous complexity analysis.**
2. **First derive the amount of work; simplify to Big-O/Θ afterward.**
3. **Sequential work adds; genuinely nested work multiplies.**
4. **Dependent loop bounds often require summations.**
5. **Constant increments usually produce linear loops; multiplicative changes usually produce logarithmic loops.**
6. **Two-pointer algorithms often remain linear because each pointer moves only a bounded number of times.**
7. **Helper functions and built-in methods have their own costs.**
8. **Independent parameters such as `n` and `m` should remain separate unless their relationship is known.**
9. **Backend complexity includes database, network, and I/O operation counts—not only CPU loops.**
10. **AI workloads often require counting candidates, dimensions, queries, and pairwise comparisons.**
11. **A strong engineer can derive complexity directly from code instead of recognizing memorized patterns.**
