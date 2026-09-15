# 01.3 — Constraints, Input Size & Feasibility Analysis

## 1. Why Feasibility Comes Before Coding

An algorithm is useful only if it can finish within the available computational budget.

Before implementation, estimate:

```text
Input size
  ↓
Candidate algorithm
  ↓
Approximate work
  ↓
Time / memory budget
  ↓
Feasible or infeasible?
```

The key question is not:

> "Can this algorithm produce the answer?"

It is:

> "Can this algorithm produce the answer under the actual constraints?"

---

## 2. Constraints Are Part of the Problem

A problem is incomplete without its constraints.

Typical constraints include:

- number of elements
- value range
- string length
- graph vertices and edges
- number of queries
- memory limit
- time limit
- input ordering
- uniqueness
- whether input is static or streaming
- whether mutation is allowed

Constraints determine which computational strategies are realistic.

---

## 3. Big-O Is a Growth Model

Big-O describes how resource usage grows as input size increases.

Common growth rates:

```text
O(1)
O(log n)
O(n)
O(n log n)
O(n²)
O(n³)
O(2ⁿ)
O(n!)
```

For sufficiently large `n`, growth rate often dominates constant factors.

But Big-O is not a stopwatch.

Two `O(n)` algorithms can have very different real performance because of:

- constants
- memory access patterns
- allocations
- cache behavior
- runtime overhead
- implementation details

---

## 4. Practical Growth Intuition

For rough reasoning:

| Complexity | Growth intuition |
|---|---|
| `O(1)` | unchanged as input grows |
| `O(log n)` | grows very slowly |
| `O(n)` | proportional to input |
| `O(n log n)` | slightly above linear |
| `O(n²)` | pair-like growth |
| `O(n³)` | triple-nested growth |
| `O(2ⁿ)` | doubles with each added element |
| `O(n!)` | becomes enormous extremely quickly |

The purpose is to reject impossible approaches early.

---

## 5. Approximate Operation Counting

Suppose:

```text
n = 100,000
```

An `O(n)` algorithm performs work proportional to roughly:

```text
100,000
```

An `O(n²)` algorithm has roughly:

```text
10,000,000,000
```

pair-scale operations.

That difference is structural, not a small optimization.

Do not obsess over exact machine instructions during normal DSA analysis. Use estimates to determine feasibility.

---

## 6. The Common Constraint Heuristic

A useful interview heuristic is:

```text
n ≈ 10
    → exponential may be possible

n ≈ 20
    → some 2ⁿ approaches may be possible

n ≈ 10²
    → O(n²) often reasonable

n ≈ 10³
    → O(n²) may be acceptable depending on constants

n ≈ 10⁵
    → prefer O(n log n) or O(n)

n ≈ 10⁶
    → near-linear work and memory efficiency matter

n much larger / streaming
    → think online, batched, indexed, external, or approximate processing
```

These are heuristics, not universal limits.

Always consider the actual environment and operation cost.

---

## 7. Constraint Patterns That Reveal Algorithms

### Sorted Input

Often suggests:

- binary search
- two pointers
- merge-style processing
- monotonic reasoning

### Small Value Range

May suggest:

- frequency arrays
- counting sort
- direct indexing

### Large Value Range but Few Values

May suggest:

- hash maps
- sparse representations

### Many Repeated Queries

May suggest:

- preprocessing
- caching
- prefix structures
- indexing

### Streaming Input

May require:

- bounded memory
- online algorithms
- incremental aggregation
- sketches or approximate structures

### Hierarchical Input

May suggest:

- tree traversal
- recursion
- stack-based traversal

### Graph Relationships

May suggest:

- BFS
- DFS
- shortest path
- connectivity structures

---

## 8. Time Budget vs Memory Budget

An algorithm can be time-efficient but memory-heavy.

Example:

```text
Approach A
Time: O(n²)
Space: O(1)

Approach B
Time: O(n)
Space: O(n)
```

If `n` is large and memory is constrained, Approach B may still be unsuitable.

Engineering requires evaluating both budgets.

---

## 9. Auxiliary Space vs Total Input Space

When reporting space complexity, distinguish:

### Input Space

Memory already occupied by the input.

### Auxiliary Space

Additional memory created by the algorithm.

Example:

```js
function sum(values) {
    let total = 0;

    for (const value of values) {
        total += value;
    }

    return total;
}
```

Auxiliary space is:

```text
O(1)
```

The input array itself is not counted as newly allocated auxiliary memory.

---

## 10. Recursion Depth Is Space

Recursive algorithms consume call-stack space.

If recursion depth is `n`:

```text
auxiliary stack space = O(n)
```

If recursion depth is `log n`:

```text
auxiliary stack space = O(log n)
```

This matters especially in JavaScript because deep recursion can exceed the runtime stack.

---

## 11. Multiple Dimensions Matter

For a matrix:

```text
rows = r
columns = c
```

Traversal complexity is:

```text
O(r × c)
```

Do not automatically replace every dimension with `n`.

For graphs:

```text
V = vertices
E = edges
```

Many algorithms are expressed as:

```text
O(V + E)
```

This is more precise than pretending the graph has only one input-size parameter.

---

## 12. Number of Queries Matters

Suppose preprocessing costs:

```text
O(n)
```

and each query costs:

```text
O(log n)
```

for `q` queries.

Total:

```text
O(n + q log n)
```

If the same operation is requested millions of times, preprocessing can be extremely valuable.

Always include query count when the problem has repeated requests.

---

## 13. Preprocessing Trade-Off

Preprocessing spends resources now to reduce future work.

General model:

```text
preprocessing cost
+
query cost × number of queries
```

Compare it with:

```text
no preprocessing
+
full cost × number of queries
```

Preprocessing becomes attractive when repeated queries amortize its cost.

This concept is fundamental to:

- indexes
- caches
- prefix sums
- lookup tables
- search indexes
- vector indexes

---

## 14. Amortized Thinking Preview

Some operations are not always cheap individually but are cheap on average across a sequence.

A classic example is dynamic-array append.

Most `push()` operations are constant-time, but occasionally resizing requires copying elements.

Therefore we describe typical append cost as:

```text
O(1) amortized
```

This is different from saying every individual operation is guaranteed `O(1)`.

Amortized analysis becomes important for stacks, queues, dynamic arrays, and caches.

---

## 15. Best, Average, and Worst Case

Always know which case you are describing.

Example: linear search.

```text
Best case:    O(1)
Average case: O(n) under common assumptions
Worst case:   O(n)
```

Example: early-exit scan.

Best case may be dramatically smaller than worst case.

For production systems, tail latency and worst-case behavior can matter more than average behavior.

---

## 16. Input Distribution Matters

Two datasets with the same `n` can behave differently.

Example:

```text
already sorted
randomly ordered
reverse sorted
many duplicates
all unique
```

An algorithm may have the same asymptotic complexity but very different practical performance on these distributions.

When an algorithm is distribution-sensitive, state the assumption explicitly.

---

## 17. Worst-Case Guarantees vs Expected Complexity

Hash-table operations are commonly described as expected `O(1)`.

That is not identical to a strict worst-case `O(1)` guarantee.

Similarly, randomized algorithms may have expected complexity that differs from worst-case complexity.

Use precise language:

```text
O(1) expected
O(n) worst-case
```

when that distinction matters.

---

## 18. Memory Complexity Beyond Big-O

Two algorithms may both use `O(n)` memory but have different practical costs.

Consider:

```text
Array of numbers
```

versus:

```text
Map of objects containing multiple fields
```

Both may be `O(n)`, but the second can require substantially more memory.

For backend engineering, memory footprint, garbage collection, allocation frequency, and object overhead can materially affect performance.

---

## 19. Feasibility Matrix

When comparing approaches, build a quick table:

| Approach | Time | Space | Feasible? |
|---|---:|---:|---|
| brute force | `O(n²)` | `O(1)` | ? |
| hash-based | `O(n)` expected | `O(n)` | ? |
| sort + scan | `O(n log n)` | depends | ? |

Then evaluate against the actual constraints.

Do not call an algorithm "optimal" without specifying the resource being optimized.

---

## 20. Example — Duplicate Detection at Different Scales

### `n = 100`

`O(n²)` may be completely acceptable.

### `n = 100,000`

`O(n²)` becomes approximately:

```text
10 billion pair-scale checks
```

A hash-based approach with expected `O(n)` behavior is usually far more appropriate.

### Streaming input

If the stream is enormous, even `O(n)` memory may be unacceptable.

Now the problem changes:

```text
What does "duplicate" mean?
How much history must be exact?
Can state be bounded?
Can approximate membership be accepted?
```

The constraints can change the problem architecture itself.

---

## 21. Backend Engineering

Backend systems frequently have explicit budgets:

```text
request rate
latency target
memory limit
CPU capacity
payload size
query count
storage cost
```

An algorithm should be evaluated against these budgets.

Examples:

```text
pagination
→ avoid loading every row

rate limiting
→ bounded state + efficient time-window operations

log processing
→ streaming / batching

cache
→ memory budget + eviction strategy

search
→ indexing + query latency
```

---

## 22. AI Engineering

AI systems make feasibility especially important because datasets and vector collections can be enormous.

Examples:

```text
naive nearest-neighbor search
→ O(Nd) per query in a basic vector scan
```

where `N` is the number of vectors and `d` is dimensionality.

At large `N`, exact brute-force retrieval can become expensive.

This motivates:

- vector indexes
- approximate nearest-neighbor algorithms
- candidate generation
- dimensionality reduction techniques
- batching
- quantization
- caching

The core reasoning remains the same:

> What is the computational budget, and which work can be avoided?

---

## 23. Feasibility Workflow

Use this workflow before implementing an unfamiliar problem:

```text
1. Extract constraints
2. Identify all input-size parameters
3. Estimate candidate complexities
4. Reject obviously infeasible approaches
5. Compare time vs memory
6. Consider best/average/worst behavior
7. Consider repeated queries
8. Consider preprocessing
9. Consider runtime/environment constraints
10. Select a feasible strategy
```

---

## 24. Common Mistakes

- Ignoring constraints until after coding.
- Treating Big-O as an exact runtime measurement.
- Assuming `O(n²)` is always bad.
- Assuming `O(n)` is always fast enough.
- Ignoring memory constraints.
- Forgetting query count.
- Confusing recursion depth with total work.
- Ignoring best/worst-case behavior.
- Calling expected `O(1)` a guaranteed worst-case `O(1)`.
- Ignoring allocation and memory overhead in production.
- Optimizing asymptotically when the actual input is tiny.

---

## 25. Key Takeaways

1. Constraints determine feasibility.
2. Input size is an algorithm-selection signal.
3. Big-O is a growth model, not an exact runtime.
4. Time and memory budgets must be considered together.
5. Query count can justify preprocessing.
6. Recursion depth contributes to auxiliary space.
7. Best, average, and worst cases are different claims.
8. Expected complexity is not always worst-case complexity.
9. Real systems care about constants, allocation, memory, and latency as well as asymptotic growth.
10. A strong engineer rejects infeasible algorithms before implementing them.

---

## 26. Self-Check

- [ ] I can extract constraints from a problem statement.
- [ ] I can estimate whether O(n), O(n log n), or O(n²) is plausible.
- [ ] I can identify all relevant input-size parameters.
- [ ] I can distinguish input space from auxiliary space.
- [ ] I can account for recursion depth.
- [ ] I understand preprocessing trade-offs.
- [ ] I can distinguish best, average, and worst cases.
- [ ] I understand expected vs worst-case complexity.
- [ ] I can compare time and memory budgets.
- [ ] I can reason about feasibility before coding.
