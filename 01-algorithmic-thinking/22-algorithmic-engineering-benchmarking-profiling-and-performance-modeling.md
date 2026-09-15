# 01.22 — Algorithmic Engineering: Benchmarking, Profiling & Performance Modeling

> Big-O tells you how an algorithm scales. Algorithmic engineering tells you what actually happens on a real machine, under a real workload, with real memory, I/O, allocation, runtime, and tail-latency behavior.

This chapter is about turning an algorithmic idea into measurable engineering evidence. It is **not** a replacement for asymptotic analysis. It is the layer that connects theory to production performance.

---

## Learning Objectives

By the end of this chapter, you should be able to:

- Distinguish asymptotic complexity from measured performance.
- Design meaningful benchmarks.
- Avoid common benchmarking traps.
- Understand throughput, latency, and tail latency.
- Measure CPU, memory, allocations, and I/O separately.
- Profile before optimizing.
- Identify hot paths and bottlenecks.
- Understand constant factors and crossover points.
- Reason about cache locality and data representation.
- Account for JavaScript/V8-specific effects.
- Compare algorithms fairly.
- Build performance models before running experiments.
- Validate optimizations statistically.
- Apply benchmarking to backend and AI workloads.

---

## 1. Big-O Is Necessary but Not Sufficient

Suppose two implementations are both:

```text
O(n)
```

They can still have dramatically different runtimes.

One may:

- allocate many temporary objects,
- perform expensive function calls,
- access memory poorly,
- trigger garbage collection,
- execute more instructions.

The other may use compact loops and predictable memory access.

Therefore:

```text
asymptotic complexity
+
constant factors
+
machine/runtime behavior
+
workload characteristics
```

all matter.

---

## 2. Asymptotic Analysis vs Performance Measurement

### Asymptotic analysis asks

```text
How does cost grow as input size increases?
```

### Benchmarking asks

```text
How long did this implementation take on this workload and environment?
```

### Profiling asks

```text
Where did the program actually spend its resources?
```

These answer different questions and should be used together.

---

## 3. Performance Is a Vector, Not One Number

A serious performance analysis should consider:

```text
latency
throughput
CPU
memory
allocations
I/O
network
startup/warm-up
contention
p95/p99 latency
error/failure rate
```

An optimization that improves CPU time but doubles memory may be a regression for a memory-constrained service.

---

## 4. Latency vs Throughput

### Latency

Time required to complete one operation.

```text
request → response = 20 ms
```

### Throughput

Amount of work completed per unit time.

```text
10,000 requests/sec
```

They are related but not interchangeable.

A batch algorithm can improve throughput while increasing individual-request latency.

---

## 5. Tail Latency

Average latency can hide severe outliers.

Consider:

```text
p50 = 10 ms
p95 = 30 ms
p99 = 500 ms
```

Most requests are fast, but 1% are extremely slow.

Backend systems frequently care about p95/p99 because users and upstream services experience those tails directly.

---

## 6. Throughput and Concurrency

Increasing concurrency can initially increase throughput:

```text
1 worker  → 100 ops/s
2 workers → 190 ops/s
4 workers → 350 ops/s
```

Eventually a bottleneck appears:

```text
8 workers  → 500 ops/s
16 workers → 510 ops/s
32 workers → 505 ops/s
```

More concurrency after saturation can increase contention without increasing useful work.

---

## 7. Benchmark the Workload, Not Just the Function

A microbenchmark such as:

```js
algorithm(input)
```

may be useful, but production performance may also depend on:

- input distribution,
- serialization,
- network calls,
- database access,
- caching,
- concurrency,
- retries,
- garbage collection.

Always define what layer the benchmark is measuring.

---

## 8. Benchmark Contract

Before benchmarking, specify:

```text
What is being measured?
What input sizes are used?
What input distributions are used?
What environment is used?
What outputs must be verified?
What metrics are collected?
What warm-up is required?
How many repetitions are used?
```

Without a contract, benchmark numbers are difficult to interpret.

---

## 9. Correctness Before Performance

A fast incorrect algorithm is worthless.

Every benchmark should validate that competing implementations produce equivalent results.

Conceptually:

```text
input
↓
implementation A
implementation B
implementation C
↓
compare outputs
↓
measure only correct runs
```

This is especially important when optimizing complex algorithms.

---

## 10. Benchmark Input Design

Use multiple input families:

- random,
- sorted,
- reverse sorted,
- duplicate-heavy,
- nearly sorted,
- sparse,
- dense,
- skewed,
- adversarial,
- minimum-size,
- maximum-size.

A single average-looking dataset can hide algorithmic weaknesses.

---

## 11. Scaling Experiments

Do not benchmark only one input size.

Measure several sizes:

```text
n = 100
n = 1,000
n = 10,000
n = 100,000
n = 1,000,000
```

Look for the growth pattern.

This helps validate whether observed behavior matches the theoretical model.

---

## 12. Crossover Points

Algorithm A may be faster for small inputs while algorithm B wins for large inputs.

Example:

```text
n < 1,000  → A faster
n > 1,000  → B faster
```

This threshold is the crossover point.

Asymptotically superior does not mean universally faster.

---

## 13. Constant Factors

Suppose:

```text
A = 100n
B = n log n
```

For sufficiently large `n`, B eventually grows more slowly.

But for small `n`, A may be faster.

Real algorithm selection therefore requires:

```text
asymptotic growth
+
constant factors
+
expected input scale
```

---

## 14. Cost Modeling

Before measuring, build a rough model.

For example:

```text
Total cost = CPU + memory cost + I/O + network + coordination
```

Or:

```text
T(n) ≈ a·n + b·n log n + c
```

The model does not need to be exact.

Its purpose is to predict dominant terms and guide experiments.

---

## 15. Dominant Resource

Ask which resource limits the workload:

```text
CPU-bound?
Memory-bound?
I/O-bound?
Network-bound?
Lock/coordination-bound?
GC-bound?
```

Optimizing CPU code in a network-bound application may produce almost no user-visible improvement.

---

## 16. CPU-Bound Work

Signs include:

- high CPU utilization,
- little waiting on I/O,
- performance strongly correlated with operation count.

Typical algorithmic optimizations:

- reduce asymptotic work,
- reduce repeated computation,
- improve data structures,
- reduce expensive operations,
- exploit parallelism.

---

## 17. Memory-Bound Work

A program may spend substantial time waiting for data movement rather than performing arithmetic.

Relevant factors include:

- memory access pattern,
- data size,
- cache locality,
- pointer chasing,
- allocations.

A theoretically efficient algorithm with poor memory locality can perform badly.

---

## 18. Cache Locality

Modern CPUs operate with multiple levels of cache.

Sequential access such as:

```js
for (let i = 0; i < arr.length; i++) {
  sum += arr[i];
}
```

usually has better locality than unpredictable pointer chasing.

This does not change the Big-O classification, but can dramatically affect constant factors.

---

## 19. Data Representation Matters

Two structures representing the same logical data may have different performance characteristics.

For example:

```text
contiguous array
vs
object-heavy structure
```

Differences can include:

- memory footprint,
- locality,
- allocation count,
- access overhead.

Representation is therefore part of algorithm engineering.

---

## 20. Allocation Pressure

Repeated allocation creates work beyond the visible algorithm.

Example:

```js
const result = items.map(x => ({ value: x * 2 }));
```

This creates many objects.

An alternative representation may use fewer allocations.

Allocation pressure can increase garbage-collection work and tail latency.

---

## 21. JavaScript/V8 Considerations

JavaScript performance can be influenced by:

- JIT compilation,
- warm-up behavior,
- object shapes,
- hidden classes,
- inline caching,
- deoptimization,
- garbage collection.

Therefore a benchmark that runs a function once is generally not meaningful evidence about steady-state performance.

Do not overfit to engine internals unless profiling demonstrates that they matter.

---

## 22. Warm-Up

JIT runtimes may optimize frequently executed code after observing it.

A benchmark should distinguish:

```text
cold-start performance
```

from:

```text
steady-state performance
```

Both can matter.

Backend serverless functions may care strongly about startup behavior; long-running services may care more about steady state.

---

## 23. Dead-Code Elimination and Benchmark Validity

A benchmark can accidentally measure less than intended if the result is never meaningfully used or if the runtime/compiler can simplify work.

Always make the benchmark's output observable enough to ensure the intended computation actually occurs.

Correctness checks also help protect against meaningless measurements.

---

## 24. Benchmark Noise

Runtime measurements vary because of:

- operating-system scheduling,
- background processes,
- CPU frequency changes,
- thermal throttling,
- garbage collection,
- JIT state,
- cache state,
- network variability.

One timing result is weak evidence.

---

## 25. Repetitions

Run repeated trials rather than relying on one measurement.

Collect distributions:

```text
min
median
p90
p95
p99
max
```

For stable microbenchmarks, many iterations can reduce measurement noise.

For services, realistic load tests are usually more informative than huge in-process iteration counts.

---

## 26. Median vs Mean

The mean is sensitive to outliers.

The median describes the central observation more robustly.

For latency-sensitive systems, percentiles often matter more than either alone.

A useful report may be:

```text
median = 4.2 ms
p95 = 7.8 ms
p99 = 19.4 ms
```

---

## 27. Statistical Thinking

Suppose:

```text
old = 10.0 ms
new = 9.8 ms
```

A 2% improvement may be smaller than measurement noise.

A benchmark conclusion should ask:

```text
Is the difference repeatable?
How large is the variance?
Does it survive different inputs?
Is the improvement practically meaningful?
```

---

## 28. Effect Size

Do not optimize merely because a benchmark number changed.

Ask whether the improvement matters to the system.

Example:

```text
API latency: 500 ms → 490 ms
```

may be less valuable than:

```text
p99: 2,000 ms → 700 ms
```

even though the first improvement may look cleaner in an average benchmark.

---

## 29. Profiling

Profiling identifies where resources are actually spent.

Typical questions:

```text
Which function consumes CPU?
Which code allocates memory?
Where are requests waiting?
Which call path dominates latency?
```

Profiling should guide optimization rather than intuition alone.

---

## 30. Hot Paths

A hot path is frequently executed or disproportionately expensive code.

Example:

```text
request
 ↓
parse
 ↓
validate
 ↓
lookup
 ↓
rank
 ↓
serialize
```

If ranking consumes 70% of CPU, optimizing serialization first is unlikely to produce a major improvement.

---

## 31. CPU Profiling

CPU profiling can reveal:

- expensive functions,
- repeated calls,
- recursion hotspots,
- parsing overhead,
- sorting overhead,
- hashing cost.

The key is to optimize the dominant path rather than the most aesthetically interesting code.

---

## 32. Memory Profiling

Memory profiling should examine:

- retained memory,
- allocation rate,
- object counts,
- large arrays/buffers,
- cache growth,
- temporary allocations.

A memory leak is different from high temporary allocation pressure.

Both can cause production problems, but the fixes differ.

---

## 33. Peak Memory vs Total Allocation

Suppose an algorithm allocates 10 GB over time but releases objects quickly.

Another allocates 2 GB and retains it.

The first may have high allocation/GC pressure.

The second may have higher peak retained memory.

Therefore measure both:

```text
allocation volume
+
peak live/retained memory
```

---

## 34. I/O Profiling

For storage-heavy algorithms, CPU complexity may not dominate.

Measure:

- bytes read,
- bytes written,
- operation count,
- sequential vs random access,
- batching,
- queue depth.

An algorithm doing fewer CPU operations can still be slower if it performs substantially more random I/O.

---

## 35. Network Cost

For distributed/backend algorithms:

```text
latency ≈ computation + network + waiting + coordination
```

Measure:

- request count,
- bytes transferred,
- round trips,
- serialization/deserialization,
- retries.

Reducing one network round trip can sometimes matter more than optimizing thousands of local operations.

---

## 36. Benchmark Isolation

When comparing algorithms, keep constant:

- input data,
- output requirements,
- environment,
- warm-up strategy,
- measurement method,
- correctness validation.

Change one important variable at a time.

Otherwise you cannot confidently attribute the observed difference.

---

## 37. Fair Algorithm Comparison

Compare equivalent implementations.

Bad comparison:

```text
Algorithm A: optimized production code
Algorithm B: debug/reference implementation
```

Good comparison:

```text
same language
same runtime
same input
same output semantics
same optimization level
same measurement process
```

Reference implementations are valuable for correctness, but do not confuse them with optimized production baselines.

---

## 38. Differential Benchmarking

Use one implementation as a correctness oracle where appropriate.

```text
optimized algorithm
vs
simple trusted algorithm
```

For random and adversarial inputs:

```text
outputs must match
```

Then performance can be measured safely.

---

## 39. Complexity Validation

Suppose theory predicts:

```text
O(n log n)
```

Measure runtime across increasing `n`.

You should not expect a perfect mathematical curve because constants and machine effects exist.

Instead ask whether growth is broadly consistent with the predicted model.

---

## 40. Benchmarking Amortized Algorithms

Dynamic arrays and hash tables can show occasional expensive operations.

A single operation may look terrible:

```text
resize → O(n)
```

but the sequence may have:

```text
O(1) amortized insertion
```

Benchmark sequences, not isolated operations, when evaluating amortized structures.

---

## 41. Benchmarking Caches

Cache performance depends heavily on workload distribution.

Measure:

- hit rate,
- miss rate,
- latency,
- memory,
- eviction rate,
- key popularity.

A cache benchmark using uniformly random keys can produce very different conclusions from a Zipf-like workload.

---

## 42. Benchmarking Hash Tables

Measure under different:

- key counts,
- key distributions,
- hit/miss ratios,
- insertion/update/query mixes.

A hash table's usefulness depends on the workload, not merely average O(1) lookup notation.

---

## 43. Benchmarking Search Algorithms

For search, test:

- successful searches,
- unsuccessful searches,
- early hits,
- late hits,
- duplicate-heavy data,
- sortedness assumptions.

An algorithm optimized for successful lookups may behave differently when most requests miss.

---

## 44. Benchmarking Sorting

Sorting performance is highly sensitive to:

- input size,
- ordering,
- duplicates,
- comparator cost,
- element representation.

If comparisons themselves are expensive, reducing comparison count may matter more than reducing simple loop operations.

---

## 45. Comparator Cost

Consider:

```js
items.sort((a, b) => expensiveScore(a) - expensiveScore(b));
```

The sorting algorithm may be efficient, but repeatedly computing the score can dominate runtime.

A decorate-sort-undecorate strategy can sometimes move repeated work into preprocessing:

```text
compute score once
↓
sort by score
↓
restore original representation
```

This is algorithmic engineering through representation and repeated-work elimination.

---

## 46. Benchmarking Parallel Algorithms

Measure:

```text
T1 = time with one worker
Tp = time with p workers
```

Then:

```text
speedup = T1 / Tp
```

and:

```text
efficiency = speedup / p
```

If efficiency collapses as workers increase, investigate:

- serial work,
- synchronization,
- communication,
- contention,
- load imbalance.

---

## 47. Scaling: Strong vs Weak

### Strong scaling

Same total workload, more workers.

Question:

```text
How much faster can we finish the same job?
```

### Weak scaling

Increase workload with worker count.

Question:

```text
Can execution time remain stable as system size and workload grow together?
```

This distinction matters when evaluating distributed algorithms.

---

## 48. Backend Load Testing

A production-like backend benchmark should vary:

- request rate,
- concurrency,
- payload size,
- cache hit rate,
- database latency,
- dependency failures.

Measure:

```text
throughput
p50/p95/p99
CPU
memory
GC
error rate
queue depth
```

The goal is to find saturation behavior, not just the fastest isolated request.

---

## 49. Queueing Effects

As utilization approaches system capacity, waiting time can rise sharply.

Conceptually:

```text
load ↑
→ queue ↑
→ waiting ↑
→ latency ↑
```

Therefore a system operating at near-maximum throughput may have unacceptable tail latency.

Performance engineering must optimize for the required operating point, not maximum theoretical utilization.

---

## 50. Backend: Pagination Benchmark

Compare pagination strategies:

```text
offset pagination
vs
keyset/cursor pagination
```

Benchmark across increasing offsets and realistic indexes.

Ask:

- Does work grow with page number?
- How much data is scanned?
- What happens under concurrent inserts?
- What is p99 latency?

This turns an abstract data-access decision into measurable evidence.

---

## 51. Backend: Rate Limiter Benchmark

Measure a rate limiter under:

- low contention,
- high contention,
- many unique keys,
- one hot key,
- burst traffic.

Measure:

```text
decision latency
throughput
memory
contention
accuracy
```

A design that performs well for millions of independent keys may fail under one extremely hot key.

---

## 52. AI: Retrieval Benchmarking

For vector retrieval, measure:

- recall@K,
- precision where appropriate,
- p50/p95/p99 latency,
- index memory,
- build time,
- update time,
- candidate count.

Do not optimize latency without tracking retrieval quality.

---

## 53. AI: RAG End-to-End Profiling

Break the pipeline into stages:

```text
query processing
↓
embedding
↓
retrieval
↓
deduplication
↓
reranking
↓
context construction
↓
generation
```

Measure each stage independently.

If generation consumes 80% of latency, shaving 20% from retrieval may have little end-to-end effect.

---

## 54. AI: Batch Inference

Batch size creates a throughput/latency/memory trade-off.

Typically:

```text
batch size ↑
→ hardware utilization may ↑
→ throughput may ↑
→ memory ↑
→ individual request waiting may ↑
```

Benchmark the actual service objective rather than maximizing throughput alone.

---

## 55. AI: Approximation + Benchmarking

Approximate algorithms require two measurements:

```text
quality
+
resource cost
```

For ANN retrieval:

```text
recall@K ↔ latency ↔ memory
```

For heuristic ranking:

```text
ranking quality ↔ CPU ↔ latency
```

An optimization is useful only if it moves the system toward the actual product objective.

---

## 56. Optimization Workflow

Use this disciplined loop:

```text
1. Define target metric.
2. Establish correctness baseline.
3. Measure baseline.
4. Profile bottleneck.
5. Form one optimization hypothesis.
6. Implement the smallest change.
7. Re-run representative benchmarks.
8. Validate correctness.
9. Compare distributions, not one number.
10. Test adversarial workloads.
11. Measure memory and secondary effects.
12. Keep the change only if it materially helps.
```

This prevents optimization by intuition alone.

---

## 57. Optimization Hypothesis

A strong optimization statement looks like:

> “Hashing currently performs repeated linear membership checks, which contributes approximately 60% of CPU time. Replacing the repeated scan with a Set should reduce lookup work from O(n) per query to expected O(1), so I expect substantial improvement at high query counts.”

This is better than:

> “Set is faster than Array.”

The first is a testable engineering hypothesis.

---

## 58. One Change at a Time

If you simultaneously:

- change the algorithm,
- change data representation,
- increase concurrency,
- change database settings,
- change runtime version,

then a performance improvement becomes difficult to attribute.

Controlled experiments produce stronger conclusions.

---

## 59. Optimization Can Move the Bottleneck

Suppose:

```text
before:
CPU 70%
DB 20%
network 10%
```

After optimizing CPU:

```text
CPU 20%
DB 65%
network 15%
```

The optimization worked.

The next bottleneck simply became visible.

Performance engineering is iterative.

---

## 60. Beware Premature Optimization

Premature optimization is not the same as caring about performance.

A disciplined approach is:

```text
design for reasonable complexity
↓
measure
↓
profile
↓
optimize demonstrated bottlenecks
```

For known hot paths and strict performance requirements, performance constraints should be considered early.

---

## 61. Readability vs Performance

The fastest implementation is not automatically the best production implementation.

Consider:

```text
performance gain
vs
maintenance cost
vs
correctness risk
vs
operational complexity
```

A 2% speedup that makes the code much harder to maintain may be a poor trade.

A 10× improvement on a critical path is usually worth deeper complexity analysis.

---

## 62. Performance Regression Testing

Once a critical optimization is established, protect it with benchmarks.

Track:

```text
baseline
current
threshold
```

Fail or investigate when performance crosses an agreed threshold.

Performance should become an observable property, not a one-time experiment.

---

## 63. Benchmark Reproducibility

Record:

- hardware,
- OS/runtime version,
- Node.js version,
- configuration,
- input generator/seed,
- dataset version,
- concurrency,
- benchmark version.

Without environment metadata, benchmark numbers become difficult to reproduce.

---

## 64. Production vs Synthetic Benchmarks

Synthetic benchmarks are useful for controlled questions.

Production traces reveal real distributions.

Best practice:

```text
synthetic benchmark
+
representative dataset
+
production-like load test
```

Use each for the question it answers best.

---

## 65. Benchmark Anti-Patterns

Avoid:

1. timing one run,
2. using only tiny inputs,
3. using unrealistic data,
4. ignoring correctness,
5. comparing different environments,
6. ignoring warm-up,
7. reporting only averages,
8. ignoring memory,
9. ignoring GC,
10. optimizing before profiling,
11. changing multiple variables at once,
12. publishing results without workload details.

---

## 66. Performance Engineering Mental Model

Think in layers:

```text
Algorithm
  ↓
Data structure
  ↓
Representation
  ↓
Runtime behavior
  ↓
Machine resources
  ↓
System interactions
  ↓
Production workload
```

A performance problem can originate at any layer.

---

## 67. Expert Performance Question Set

When an algorithm is slow, ask:

```text
1. Is the algorithm asymptotically appropriate?
2. What is the actual input size?
3. What is the workload distribution?
4. What is the hot path?
5. What resource is saturated?
6. How many operations are actually performed?
7. Are we repeating work?
8. Are we allocating excessively?
9. Is memory locality poor?
10. Is GC contributing to latency?
11. Is I/O dominant?
12. Is network communication dominant?
13. Is contention limiting concurrency?
14. Is there a crossover point?
15. Does the optimization preserve correctness?
16. Does it improve p95/p99?
17. Does it increase memory?
18. Does it merely move the bottleneck?
19. Does the improvement survive realistic workloads?
20. Is the complexity worth the measurable gain?
```

---

## 68. Interview Framework

When asked to optimize an algorithm:

```text
1. State the baseline complexity.
2. State the expected input scale.
3. Identify the dominant operation.
4. Identify repeated work.
5. Choose a better representation/data structure.
6. Derive the new complexity.
7. Discuss memory trade-offs.
8. Explain expected constant-factor effects.
9. Describe how you would benchmark it.
10. Describe how you would profile it.
11. Discuss workload distributions.
12. Discuss tail latency.
13. Discuss production risks.
```

This demonstrates engineering maturity beyond simply naming a Big-O class.

---

## 69. Backend Algorithm Engineering Checklist

For a backend optimization:

```text
[ ] correctness verified
[ ] baseline measured
[ ] workload representative
[ ] input scale realistic
[ ] CPU measured
[ ] memory measured
[ ] allocation/GC considered
[ ] I/O measured
[ ] network measured
[ ] concurrency tested
[ ] p95/p99 measured
[ ] failure behavior tested
[ ] bottleneck identified
[ ] optimization hypothesis explicit
[ ] regression benchmark added
```

---

## 70. AI Algorithm Engineering Checklist

For an AI optimization:

```text
[ ] quality metric defined
[ ] retrieval/generation correctness defined
[ ] baseline quality measured
[ ] latency measured
[ ] p95/p99 measured
[ ] memory measured
[ ] batch behavior measured
[ ] candidate count measured
[ ] recall/precision measured where applicable
[ ] representative dataset used
[ ] adversarial cases tested
[ ] index build/update costs measured
[ ] approximation error measured
[ ] end-to-end impact measured
```

---

## 71. Key Takeaways

1. Big-O predicts growth; benchmarking measures actual behavior.
2. Profiling tells you where resources are actually being spent.
3. Latency, throughput, memory, CPU, I/O, and tail latency are separate dimensions.
4. Average latency can hide serious p95/p99 problems.
5. Algorithm choice depends on workload distribution and input scale.
6. Asymptotically better algorithms can lose for small inputs because of constants.
7. Crossover points matter.
8. Data representation affects real performance.
9. Allocation and garbage collection can dominate JavaScript workloads.
10. Warm-up matters in JIT runtimes.
11. One benchmark run is weak evidence.
12. Correctness must be validated before trusting performance results.
13. Representative and adversarial workloads are both necessary.
14. Always identify the dominant resource before optimizing.
15. Network and I/O costs can dominate CPU improvements.
16. Parallel performance must account for serial work, contention, and imbalance.
17. Optimizing one bottleneck often reveals another.
18. Performance optimization should be hypothesis-driven.
19. Production benchmarks should measure the actual system objective, including tails.
20. Expert algorithmic engineering combines mathematical complexity, empirical measurement, profiling, and disciplined trade-off analysis.

---

## Revision Checklist

- [ ] I can explain why Big-O alone is insufficient for production performance.
- [ ] I can distinguish latency and throughput.
- [ ] I understand p50, p95, and p99.
- [ ] I can design a benchmark contract.
- [ ] I can create representative input families.
- [ ] I understand crossover points.
- [ ] I can reason about constant factors.
- [ ] I can build a simple performance cost model.
- [ ] I can identify CPU-, memory-, I/O-, network-, and coordination-bound workloads.
- [ ] I understand cache locality.
- [ ] I understand allocation pressure and GC implications in JavaScript.
- [ ] I understand warm-up and steady-state benchmarking.
- [ ] I can use profiling to find hot paths.
- [ ] I understand peak memory vs allocation volume.
- [ ] I can benchmark parallel algorithms using speedup and efficiency.
- [ ] I can perform differential correctness testing.
- [ ] I can evaluate optimizations statistically rather than from one run.
- [ ] I can benchmark backend workloads realistically.
- [ ] I can benchmark AI retrieval/inference using both quality and performance metrics.
- [ ] I can defend an optimization using evidence rather than intuition.
