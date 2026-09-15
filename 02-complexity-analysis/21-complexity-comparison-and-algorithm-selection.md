# 02.21 — Complexity Comparison & Algorithm Selection

## Learning Objective

Learn to compare algorithms systematically and select the right one from competing complexity profiles. The goal is not to memorize that one Big-O is “better” than another, but to reason from constraints, workload, constants, memory, preprocessing, update frequency, latency, throughput, and correctness requirements.

> **Algorithm selection is constrained optimization, not a Big-O popularity contest.**

---

# 1. The Selection Problem

Suppose several algorithms solve the same problem:

```text
A: O(N²)
B: O(N log N)
C: O(N + K)
```

It is tempting to choose `C` immediately.

But selection requires asking:

```text
What is N?
What is K?
How often is the algorithm run?
Is the input static or dynamic?
How much memory is available?
Is preprocessing allowed?
What are the latency requirements?
What constants or I/O costs matter?
```

---

# 2. Correctness Comes First

Never compare performance before establishing that algorithms satisfy the same contract.

```text
Correctness
    ↓
Feasibility
    ↓
Complexity
    ↓
Practical cost
    ↓
Operational behavior
```

A fast algorithm that produces the wrong result is not an optimization.

---

# 3. Hard Constraints vs Optimization Goals

Separate requirements into:

### Hard constraints

```text
must be correct
must fit memory
must satisfy latency limit
must preserve required quality
must support required updates
```

### Optimization goals

```text
minimize CPU
minimize latency
maximize throughput
minimize memory
minimize infrastructure cost
```

First eliminate algorithms violating hard constraints.

---

# 4. Normalize the Input Parameters

Different algorithms may use different notation.

Normalize them:

```text
N = number of records
M = second collection size
Q = number of queries
U = number of updates
K = requested Top-K
D = vector dimension
L = string/token length
```

Then compare expressions using the same parameters.

---

# 5. Growth-Rate Comparison

For large `N`:

```text
O(1)
< O(log N)
< O(N)
< O(N log N)
< O(N²)
< O(N³)
< O(2^N)
< O(N!)
```

This ordering is useful, but it is only a first filter.

---

# 6. Big-O Does Not Give Exact Runtime

Consider:

```text
A = 1000N
B = N²
```

For sufficiently large `N`, `A` grows more slowly.

For small `N`, `B` may be faster.

Therefore:

```text
asymptotic dominance
≠
finite-input performance
```

---

# 7. Crossover Points

If:

```text
T_A(N) = aN
T_B(N) = bN²
```

The approximate crossover occurs when:

```text
aN = bN²
```

so:

```text
N ≈ a/b
```

The actual crossover must be measured when constants and hardware matter.

---

# 8. Complexity Vector

Instead of one complexity number, model:

```text
(time,
 memory,
 I/O,
 network,
 preprocessing,
 update cost,
 query cost,
 quality)
```

Two algorithms can therefore be incomparable until requirements are specified.

---

# 9. Preprocessing vs Query Cost

Algorithm A:

```text
No preprocessing
Query: O(N)
```

Algorithm B:

```text
Build: O(N log N)
Query: O(log N)
```

For `Q` queries:

```text
A ≈ QN
B ≈ N log N + Q log N
```

B becomes attractive when `Q` is sufficiently large and updates are manageable.

---

# 10. Break-Even Analysis

To compare two strategies:

```text
Total A = buildA + Q × queryA
Total B = buildB + Q × queryB
```

Solve:

```text
Total A = Total B
```

for `Q`.

This gives a conceptual break-even workload.

---

# 11. Static vs Dynamic Data

An expensive index may be excellent for static data:

```text
build once
query many times
```

The same index may be poor for highly dynamic data:

```text
many updates
many rebuilds
```

Therefore always include:

```text
Q = queries
U = updates
```

---

# 12. Online vs Offline

### Online

Input arrives continuously and decisions must be made immediately.

### Offline

The full workload is known before processing.

Offline algorithms may sort, group, batch, or reorder operations.

Online constraints can eliminate theoretically attractive offline strategies.

---

# 13. One Query vs Many Queries

For one query:

```text
preprocessing may not be worthwhile
```

For millions of queries:

```text
preprocessing may dominate positively
```

Always analyze the full workload rather than a single operation.

---

# 14. Sorting vs Hashing

Suppose you need membership queries.

### Hash-based

Typical/expected lookup:

```text
O(1)
```

Build:

```text
O(N)
```

Memory:

```text
O(N)
```

### Sorted data + binary search

Sort:

```text
O(N log N)
```

Query:

```text
O(log N)
```

Which is better depends on:

```text
number of queries
ordering requirements
memory
updates
worst-case guarantees
```

---

# 15. Sorting vs Heap for Top-K

If all items must be ordered:

```text
O(N log N)
```

may be appropriate.

If only `K` best items are required:

```text
O(N log K)
```

heap selection can be better when `K << N`.

Selection should match the output contract.

---

# 16. Array vs Hash Table

### Array

Excellent for:

```text
indexed access
compact storage
sequential traversal
```

### Hash table

Excellent for:

```text
key lookup
membership
frequency counting
```

The best structure is determined by required operations, not by which structure has the “better” Big-O overall.

---

# 17. BFS vs DFS Selection

For a graph:

```text
V = vertices
E = edges
```

Both can traverse in:

```text
O(V + E)
```

But they differ in:

```text
memory
search order
shortest-path behavior
solution depth
```

For unweighted shortest path, BFS has a key correctness advantage.

For deep traversal with constrained memory, DFS may be preferable.

---

# 18. Binary Search Selection

Binary search requires an exploitable ordering/monotonicity property.

Do not choose it merely because:

```text
O(log N) < O(N)
```

If the precondition is absent, binary search is invalid.

---

# 19. Two Pointers vs Hashing

A pair-sum problem may have:

### Hashing

```text
O(N) expected time
O(N) memory
```

### Sort + two pointers

```text
O(N log N)
```

plus sorting and potentially different mutation/output implications.

Hashing may win when preserving order is important.

Sorting may win when memory is constrained or ordered structure is useful for later operations.

---

# 20. Multiple Parameters Change Comparisons

Compare:

```text
A = O(N²)
B = O(NM)
```

You cannot declare one universally better.

If:

```text
M << N
```

B may be better.

If:

```text
M >> N
```

A may be better.

Never silently collapse independent parameters.

---

# 21. Output-Sensitive Selection

If the output contains `K` items, an algorithm that spends `O(N²)` but produces only `K` results deserves scrutiny.

Ask:

```text
How much information must actually be produced?
Can the algorithm avoid irrelevant work?
```

Output requirements often reveal a better algorithm.

---

# 22. Exact vs Approximate Algorithms

Exact algorithm:

```text
guaranteed correct answer
```

Approximate algorithm:

```text
controlled or empirical error
```

Approximation may be appropriate when exact computation is too expensive.

But quality becomes a constraint:

```text
minimize cost
subject to quality ≥ threshold
```

---

# 23. Randomized vs Deterministic

Randomized algorithms can improve expected behavior or simplify selection.

But compare:

```text
worst-case guarantee
expected complexity
reproducibility
failure probability
operational predictability
```

A lower expected runtime is not automatically preferable for strict tail-latency systems.

---

# 24. Worst-Case vs Expected Complexity

Hashing commonly has expected/typical constant-time operations under suitable assumptions.

If worst-case guarantees are critical, consider the data structure's actual guarantees.

Similarly, randomized algorithms should be evaluated using the guarantee that the application actually needs.

---

# 25. Memory as a Selection Constraint

Compare:

```text
A: O(N) time, O(N) memory
B: O(N log N) time, O(1) auxiliary memory
```

If memory is scarce, B may be the correct choice.

Therefore:

```text
fastest ≠ best
```

---

# 26. Latency vs Throughput

An algorithm may maximize throughput through batching but increase individual request latency.

Another may minimize single-request latency but waste hardware capacity.

Choose according to:

```text
interactive workload → latency
batch workload → throughput
```

Many real systems need both.

---

# 27. Tail Latency

Average latency can hide severe outliers.

Compare:

```text
p50
p95
p99
p999
```

An algorithm with lower average cost may still be worse if it creates unacceptable tail latency.

---

# 28. Database-Aware Algorithm Selection

Application code may look like:

```text
for each item:
    query database
```

A database-aware solution may batch or join the work.

Therefore compare:

```text
application CPU
+ database work
+ round trips
+ transferred data
```

rather than only JavaScript loop complexity.

---

# 29. Cache-Aware Selection

Two algorithms with the same Big-O may have very different practical performance because of:

```text
memory locality
allocation rate
cache behavior
branch predictability
runtime overhead
```

This matters especially for large arrays, numeric processing, and high-throughput services.

---

# 30. Backend Algorithm Selection

For backend workloads, evaluate:

```text
QPS
concurrency
payload size
DB round trips
CPU/request
memory/request
cache hit rate
queue depth
p95/p99
update frequency
```

The algorithm must fit the complete service workload.

---

# 31. AI Retrieval Selection

Suppose an AI system needs nearest-neighbor retrieval.

Possible strategies include:

```text
exact scan
index-based retrieval
ANN retrieval
hybrid retrieval
```

Compare:

```text
N
D
Q
K
index memory
build cost
update cost
recall
latency
```

There is no universally best retrieval algorithm.

---

# 32. AI Reranking Selection

Suppose retrieval returns `K` candidates.

Options might include:

```text
no reranking
cheap reranker
expensive reranker
```

Higher-quality reranking may increase:

```text
latency
compute cost
memory
```

Selection should be based on the quality improvement per unit resource.

---

# 33. AI Batching Selection

Larger batches may improve:

```text
hardware utilization
throughput
amortized overhead
```

but may hurt:

```text
latency
memory
queueing
```

The selection objective should reflect workload requirements.

---

# 34. Distributed Fan-Out Selection

Suppose one request contacts `F` services.

Sequential critical-path latency is approximately:

```text
T₁ + T₂ + ... + T_F
```

Parallel fan-out can reduce critical-path latency toward:

```text
max(T₁, T₂, ..., T_F)
```

plus coordination/network overhead.

But total downstream work remains roughly the sum of all calls.

Parallelism improves latency without magically removing work.

---

# 35. Sharding and Skew

A distributed algorithm may appear balanced:

```text
N / S
```

records per shard.

Real workloads may be skewed.

One hot shard can dominate latency even when average distribution looks balanced.

Therefore selection must consider:

```text
average load
maximum load
hot keys
partition quality
rebalance cost
```

---

# 36. Build-Query-Update Matrix

A useful comparison table is:

| Dimension | Algorithm A | Algorithm B |
|---|---:|---:|
| Build | ... | ... |
| Query | ... | ... |
| Update | ... | ... |
| Memory | ... | ... |
| Worst case | ... | ... |
| Expected case | ... | ... |
| Latency | ... | ... |
| Throughput | ... | ... |
| Quality | ... | ... |

This prevents single-metric decisions.

---

# 37. Dominant-Term Reasoning

For:

```text
T = N log N + N + Q log N
```

the dominant term depends on workload scale.

If `Q` is enormous:

```text
Q log N
```

may dominate.

If the dataset is rebuilt frequently:

```text
N log N
```

may dominate.

Always ask which term is operationally dominant.

---

# 38. Complexity Under Constraints

Suppose:

```text
N ≤ 10⁵
```

and memory is tight.

An `O(N²)` solution is likely infeasible.

Suppose instead:

```text
N ≤ 100
```

An `O(N²)` solution may be entirely reasonable.

Constraints determine feasibility.

---

# 39. Practical Cost Model

A more realistic model can look like:

```text
Total cost =
CPU cost
+ memory cost
+ DB cost
+ network cost
+ serialization cost
+ coordination cost
+ queueing cost
```

Not every system needs every term.

The point is to model the resources that actually matter.

---

# 40. Algorithm Selection Workflow

```text
1. Define the problem contract.
2. Identify hard correctness/quality constraints.
3. Identify all meaningful input parameters.
4. Estimate input scale.
5. Identify workload frequency.
6. Generate a brute-force baseline.
7. Identify the bottleneck.
8. List candidate algorithms/data structures.
9. Eliminate candidates violating constraints.
10. Compare time complexity.
11. Compare memory complexity.
12. Include build/update/query costs.
13. Include I/O/network/database costs.
14. Consider worst/expected/tail behavior.
15. Consider implementation/runtime constants.
16. Estimate crossover/break-even points.
17. Benchmark realistic workloads.
18. Validate correctness and quality.
19. Choose the simplest design that satisfies the requirements.
```

---

# 41. Decision Tree

```text
Is the input ordered?
 ├─ Yes → Can binary search/ordered structure help?
 └─ No  → Can hashing help?

Do we need all sorted output?
 ├─ Yes → Consider sorting.
 └─ No  → Is it Top-K?
          ├─ Yes → Consider heap/selection.
          └─ No  → Consider scan/hash/index.

Are there many repeated queries?
 ├─ Yes → Consider preprocessing/indexing/cache.
 └─ No  → Prefer low setup cost.

Are updates frequent?
 ├─ Yes → Penalize expensive maintenance.
 └─ No  → Preprocessing becomes more attractive.

Is exactness mandatory?
 ├─ Yes → Exact algorithm.
 └─ No  → Consider approximation/randomization.
```

---

# 42. Common Selection Mistakes

### Mistake 1

Choosing the smallest Big-O without checking correctness assumptions.

### Mistake 2

Ignoring memory.

### Mistake 3

Ignoring preprocessing.

### Mistake 4

Ignoring updates.

### Mistake 5

Ignoring multiple parameters.

### Mistake 6

Ignoring database/network work.

### Mistake 7

Using average-case reasoning where worst-case guarantees matter.

### Mistake 8

Using worst-case reasoning when expected behavior is the actual engineering target without understanding the trade-off.

### Mistake 9

Optimizing p50 while violating p99 requirements.

### Mistake 10

Optimizing throughput while breaking interactive latency.

### Mistake 11

Assuming ANN has one universal complexity.

### Mistake 12

Benchmarking only tiny inputs.

---

# 43. Interview Explanation Template

When asked “Which algorithm would you choose?”:

```text
Given N..., Q..., U..., and memory/latency constraints...

Option A has ... complexity.
Option B has ... complexity.

Because the workload is ..., the dominant cost is ... .

I would choose B because ... .

Its trade-off is ... .

I would validate the choice using workloads around ... and measure ... .
```

This is stronger than saying:

> “O(N log N) is better.”

---

# 44. Key Takeaways

1. **Compare algorithms against the actual workload, not just Big-O labels.**
2. **Correctness and feasibility are hard constraints.**
3. **Preserve independent parameters such as N, Q, U, K, and D.**
4. **Include preprocessing, query, and update costs.**
5. **Use break-even reasoning for repeated workloads.**
6. **Memory can eliminate an otherwise faster algorithm.**
7. **Latency and throughput are different optimization objectives.**
8. **Tail latency matters in production systems.**
9. **Database, network, and I/O costs can dominate application-level complexity.**
10. **AI selection must include quality, candidate count, dimensionality, and architecture-specific costs.**
11. **Distributed parallelism can reduce critical-path latency while leaving total work unchanged.**
12. **The best algorithm is the simplest one that satisfies the real constraints.**

---

# Mastery Checklist

- [ ] I can compare two algorithms using the same parameters.
- [ ] I can identify hard constraints before optimizing.
- [ ] I understand crossover points.
- [ ] I can calculate break-even query counts.
- [ ] I can compare preprocessing against repeated query work.
- [ ] I can reason about static vs dynamic data.
- [ ] I understand online vs offline constraints.
- [ ] I can compare hashing and sorting.
- [ ] I can select Top-K instead of full sorting when appropriate.
- [ ] I can preserve multiple parameters.
- [ ] I can include memory in algorithm selection.
- [ ] I can reason about exact vs approximate algorithms.
- [ ] I can reason about expected vs worst-case behavior.
- [ ] I understand latency vs throughput.
- [ ] I can include tail latency.
- [ ] I can include database/network costs.
- [ ] I can compare distributed fan-out strategies.
- [ ] I can reason about sharding and skew.
- [ ] I can select AI retrieval strategies using N, D, Q, and K.
- [ ] I can include quality in AI algorithm selection.
- [ ] I can create a build-query-update comparison.
- [ ] I can identify the dominant term.
- [ ] I can explain my algorithm choice in an interview.
