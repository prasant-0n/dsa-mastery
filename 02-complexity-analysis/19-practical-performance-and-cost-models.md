# 02.19 — Practical Performance & Cost Models

## Learning Objective

Learn how to connect asymptotic complexity with real execution cost, latency, throughput, memory, I/O, network behavior, allocation, caching, concurrency, and workload shape.

> **Big-O tells you how growth behaves. A practical cost model asks what actually consumes the budget.**

---

# 1. Why Big-O Is Not Enough

Consider two algorithms:

```text
A: O(n)
B: O(n)
```

They have the same asymptotic growth, but A may perform:

```text
1 operation per element
```

while B performs:

```text
100 operations per element
```

A can be faster for every practical input size.

Asymptotic complexity and practical performance answer different questions.

---

# 2. The Four Layers of Performance Reasoning

Analyze a system at four levels:

```text
1. Asymptotic growth
2. Operation-level cost
3. Hardware/runtime behavior
4. System-level workload behavior
```

Example:

```text
O(n)
→ number of comparisons
→ CPU/cache/allocation behavior
→ concurrency/queueing/network/database effects
```

Expert algorithm engineering connects all four.

---

# 3. Latency vs Throughput

### Latency

Time required to complete one request or operation.

### Throughput

Amount of work completed per unit time.

An algorithm can improve throughput while worsening individual-request latency.

Batching is a classic example.

---

# 4. Tail Latency

Do not analyze only average latency.

Common percentiles:

```text
p50 → median
p95 → 95% of requests are at or below this latency
p99 → 99% are at or below this latency
p999 → 99.9% are at or below this latency
```

Backend systems often care heavily about tail behavior because a small fraction of slow requests can affect user experience and distributed request completion.

---

# 5. Why Average Can Hide Problems

Suppose 999 requests take 5 ms and one request takes 5 seconds.

The average may still appear reasonable compared with the extreme request.

But the p99/p999 behavior reveals the outlier.

Therefore:

```text
mean latency ≠ tail latency
```

and:

```text
amortized complexity ≠ tail-latency guarantee
```

---

# 6. Constant Factors Matter in Practice

Asymptotically:

```text
O(n)
```

is the same growth class regardless of constants.

Practically:

```text
10n
```

and:

```text
1000n
```

can have very different execution times.

Constants matter especially when:

- input sizes are moderate
- operations are expensive
- algorithms have similar asymptotic complexity
- hardware/cache behavior dominates

---

# 7. Crossover Points

Suppose:

```text
Algorithm A = 100n
Algorithm B = n²
```

For small `n`, B may be faster.

For sufficiently large `n`, A wins.

The point where performance changes is a **crossover point**.

Do not blindly select an asymptotically superior algorithm without considering realistic workload sizes.

---

# 8. Example Crossover Analysis

Compare:

```text
T1(n) = 50n
T2(n) = n²
```

Set them approximately equal:

```text
50n = n²
```

For positive `n`:

```text
n ≈ 50
```

So the practical winner can depend on whether workload size is below or above that region.

Real implementations require measurement because constants are rarely known exactly from source inspection.

---

# 9. CPU Cost

CPU work includes:

- arithmetic
- comparisons
- branches
- hashing
- function calls
- serialization
- parsing
- compression
- cryptographic operations

Two `O(n)` algorithms can have very different CPU cost per element.

---

# 10. Memory Access Cost

Modern systems are not uniform-memory machines in practice.

Accessing data may involve:

```text
registers
→ CPU caches
→ RAM
→ storage
→ network
```

Data locality can strongly affect practical performance.

An algorithm with sequential memory access may outperform one with theoretically similar work but poor locality.

---

# 11. Cache Locality

Consider processing an array sequentially:

```js
for (let i = 0; i < items.length; i++) {
  work(items[i]);
}
```

versus repeatedly jumping across unrelated memory locations.

Both can have the same asymptotic complexity, but sequential access often has better locality.

This is a practical reason representation matters.

---

# 12. Data Representation and Performance

These can have identical Big-O complexity:

```text
array of compact values
array of object references
Map of objects
linked nodes
```

But their concrete performance can differ because of:

- memory layout
- pointer/reference chasing
- allocation
- cache locality
- object overhead
- garbage collection

Complexity describes growth, not every machine-level consequence.

---

# 13. JavaScript Runtime Effects

JavaScript performance is affected by runtime implementation details such as:

- JIT compilation
- warm-up
- optimization/deoptimization
- garbage collection
- hidden classes/object shapes
- allocation behavior
- engine-specific optimizations

Therefore benchmark conclusions should be interpreted within the tested runtime and workload.

Do not assume an implementation detail is a language-level complexity guarantee.

---

# 14. Allocation Cost

Creating temporary objects can increase:

```text
allocation rate
GC pressure
memory traffic
latency variance
```

Two algorithms may both be:

```text
O(n) time
O(n) space
```

but one may create millions of short-lived objects while the other reuses storage.

Production performance can differ substantially.

---

# 15. I/O Cost

An algorithm can be computationally cheap but I/O-heavy.

Examples:

```text
read file
write database row
perform network request
fetch remote API
```

A local CPU loop may execute millions of operations while one network round trip dominates latency.

Therefore practical cost models should separate:

```text
CPU
memory
I/O
network
```

when appropriate.

---

# 16. Sequential vs Random I/O

Sequential access often has very different practical behavior from random access.

External-memory algorithms therefore care about:

```text
number of I/O operations
```

not merely arithmetic operation count.

This motivates models such as external-memory/I/O complexity.

---

# 17. Database Queries as Cost Units

Suppose an endpoint executes:

```text
1 query
```

versus:

```text
1 + N queries
```

Even if application-level loops are cheap, the second pattern can become expensive because database calls have significant fixed and network/serialization costs.

This is the practical intuition behind the N+1 query problem.

---

# 18. Round Trips

Distributed systems often pay significant cost per network round trip.

Suppose each request has fixed network overhead `R` and processes `N` items.

A model might look like:

```text
Total ≈ R + processing(N)
```

If there are `Q` independent round trips:

```text
Total ≈ QR + processing
```

Batching can reduce the number of round trips while increasing batch size and memory.

---

# 19. Fixed Cost + Variable Cost

A useful practical model is:

```text
Total cost = fixed cost + variable cost × workload
```

For example:

```text
T(n) = C + an
```

Asymptotically:

```text
O(n)
```

But for small `n`, `C` can dominate.

This explains why tiny workloads can behave differently from large workloads.

---

# 20. Multi-Resource Cost Model

A real operation may consume:

```text
CPU time
+ memory
+ disk I/O
+ network I/O
+ database time
```

There is no single scalar “cost” that always captures the system.

A useful model identifies the resource currently limiting performance.

---

# 21. Bottleneck Identification

The bottleneck is the resource or stage that most constrains throughput or latency.

Possible bottlenecks:

```text
CPU
RAM
GC
Database
Network
Disk
Lock contention
External API
Queueing
```

Optimizing a non-bottleneck may produce little observable improvement.

---

# 22. Amdahl-Style Reasoning

Suppose only a fraction `p` of execution time can be improved.

Even an enormous optimization of that part has limited total impact if the rest dominates.

For example:

```text
90% database
10% application CPU
```

Making application CPU 10× faster cannot produce a 10× endpoint speedup.

This is a practical extension of algorithm-selection reasoning.

---

# 23. Benchmarking Is Experimental Science

A useful benchmark controls:

- input size
- input distribution
- warm-up
- repetitions
- environment
- concurrency
- garbage-collection effects
- output validation
- measurement overhead

Bad benchmarks can produce misleading conclusions.

---

# 24. Benchmark the Same Work

If comparing algorithms, ensure they solve the same problem and produce equivalent results.

Otherwise a faster benchmark may simply be doing less work.

Use:

```text
same inputs
same outputs
same correctness requirements
same workload distribution
```

---

# 25. Warm-Up in JavaScript

JavaScript engines may optimize hot code after execution begins.

A benchmark that measures only the first few calls may measure startup/interpreter behavior rather than steady-state performance.

For meaningful comparisons:

```text
warm up
→ measure repeated execution
→ validate results
```

Exact behavior is runtime-specific.

---

# 26. Benchmark Input Distributions

The same algorithm can behave differently on:

```text
random data
sorted data
reverse-sorted data
all-equal data
highly duplicated data
adversarial data
```

For example, an algorithm with data-dependent early exits may look excellent on friendly data but poor on adversarial inputs.

Benchmark distributions should match production risk.

---

# 27. Scaling Experiments

Do not benchmark only one input size.

Measure:

```text
n = 1,000
n = 10,000
n = 100,000
n = 1,000,000
```

Then observe how runtime changes.

Scaling behavior provides evidence for the theoretical complexity model.

---

# 28. Complexity as a Hypothesis

Treat your analysis as a prediction:

> “I expect runtime to grow approximately linearly with N.”

Then benchmark multiple sizes.

If measured growth disagrees strongly, investigate:

- hidden work
- data-dependent behavior
- runtime effects
- I/O
- allocation
- cache behavior
- incorrect theoretical analysis

Theory and measurement should reinforce each other.

---

# 29. Differential Benchmarking

When comparing two implementations:

```text
same input
→ run A
→ run B
→ verify outputs
→ measure
→ repeat
```

This combines correctness testing with performance comparison.

Never optimize an implementation whose output correctness has not been established.

---

# 30. Backend Example — Pagination

Suppose an endpoint returns `K` records.

Possible costs include:

```text
DB query
serialization
network transfer
application transformation
JSON parsing
```

An algorithmic optimization inside the transformation loop may be irrelevant if database latency dominates.

This is why end-to-end bottleneck identification matters.

---

# 31. Backend Example — Rate Limiter

A rate limiter may use:

```text
O(1) hash lookup
```

but practical performance can still depend on:

- lock contention
- distributed network calls
- clock access
- storage latency
- cleanup frequency
- allocation

Asymptotic complexity is only one layer of the design.

---

# 32. Backend Example — Cache

A cache can reduce expensive downstream work from:

```text
database/network computation
```

to:

```text
memory lookup
```

Even if both paths have favorable asymptotic complexity, the constant and I/O differences can be enormous.

Cache design therefore changes the practical cost model, not merely the Big-O notation.

---

# 33. AI Example — Retrieval

Suppose retrieval scores:

```text
K candidates × D dimensions
```

with complexity:

```text
O(KD)
```

Practical cost also depends on:

- memory locality
- vector representation
- SIMD/vectorization
- cache behavior
- batching
- hardware acceleration
- candidate count
- network/database overhead

Reducing `K` may improve both asymptotic work and actual latency.

---

# 34. AI Example — Inference Batching

Batching can improve hardware utilization and amortize fixed overhead.

But larger batches may increase:

```text
queueing delay
memory usage
p99 latency
```

Therefore the objective may be:

```text
maximize throughput subject to latency and memory constraints
```

rather than simply minimizing operation count.

---

# 35. AI Example — Approximate Retrieval

An exact method may have expensive candidate processing.

An approximate method may reduce:

```text
candidate count
memory traffic
distance calculations
```

while introducing:

```text
recall loss
index complexity
build/update cost
```

This is a practical quality-vs-cost trade-off.

---

# 36. Complexity and Capacity Planning

Suppose one request requires:

```text
CPU = c
Memory = m
```

and concurrency is:

```text
C
```

Approximate aggregate requirements can scale like:

```text
CPU demand ∝ Cc
Memory demand ∝ Cm
```

This does not mean the system can scale indefinitely; contention and shared bottlenecks eventually appear.

---

# 37. Queueing Effects

Even when service time is stable, increasing arrival rate can increase waiting time.

A system near saturation may experience rapidly increasing latency.

Therefore endpoint complexity alone does not predict user-visible latency under load.

Production performance must consider:

```text
service cost
+ arrival rate
+ concurrency
+ queueing
```

---

# 38. Optimization Order

A disciplined optimization process:

```text
1. Establish correctness.
2. Measure baseline.
3. Identify bottleneck.
4. Model expected improvement.
5. Change one meaningful variable.
6. Re-measure.
7. Validate correctness again.
8. Check memory and tail latency.
9. Keep the change only if it improves the real objective.
```

Do not optimize by intuition alone.

---

# 39. Common Performance Mistakes

### Mistake 1

Treating Big-O as exact runtime.

### Mistake 2

Ignoring constants for realistic workloads.

### Mistake 3

Benchmarking only one input size.

### Mistake 4

Ignoring input distribution.

### Mistake 5

Ignoring warm-up and GC in JavaScript.

### Mistake 6

Optimizing code that is not the bottleneck.

### Mistake 7

Ignoring I/O and network costs.

### Mistake 8

Measuring average latency only.

### Mistake 9

Comparing algorithms that do different amounts of work.

### Mistake 10

Optimizing before establishing a baseline.

---

# 40. Expert Performance-Modeling Workflow

```text
1. Start with asymptotic complexity.
2. Identify independent workload parameters.
3. Estimate operation counts.
4. Identify fixed and variable costs.
5. Separate CPU, memory, I/O, and network work.
6. Identify likely bottleneck.
7. Consider constants and crossover points.
8. Model concurrency and queueing.
9. Measure multiple workload sizes.
10. Measure realistic distributions.
11. Check p50/p95/p99 where latency matters.
12. Profile before optimizing.
13. Re-run correctness tests.
14. Re-measure after optimization.
```

---

# 41. Complexity vs Performance — Final Mental Model

Use this hierarchy:

```text
Algorithmic structure
        ↓
Asymptotic complexity
        ↓
Operation count
        ↓
Runtime / memory behavior
        ↓
Hardware + I/O behavior
        ↓
Concurrency + queueing
        ↓
End-to-end system performance
```

No single layer replaces the others.

---

# 42. Mastery Checklist

- [ ] I know why Big-O is not exact runtime.
- [ ] I understand constant factors.
- [ ] I can reason about crossover points.
- [ ] I distinguish latency and throughput.
- [ ] I understand p50, p95, p99, and p999.
- [ ] I can identify CPU vs memory vs I/O bottlenecks.
- [ ] I understand cache locality conceptually.
- [ ] I understand allocation and GC effects in JavaScript.
- [ ] I can model fixed and variable costs.
- [ ] I understand database/network round-trip costs.
- [ ] I can design a fair benchmark.
- [ ] I understand JavaScript warm-up effects.
- [ ] I benchmark multiple input sizes.
- [ ] I benchmark realistic input distributions.
- [ ] I can use differential benchmarking.
- [ ] I understand backend capacity implications.
- [ ] I understand queueing and concurrency effects.
- [ ] I can reason about AI retrieval cost.
- [ ] I can reason about inference batching trade-offs.
- [ ] I optimize based on measured bottlenecks rather than intuition.

---

# Key Takeaways

1. **Big-O describes growth, not exact runtime.**
2. **Constants, data representation, cache behavior, allocation, and runtime details matter in practice.**
3. **Latency, throughput, and tail latency are different performance objectives.**
4. **CPU, memory, I/O, and network costs should be modeled separately when they matter.**
5. **A benchmark is useful only when its workload and measurement methodology are sound.**
6. **Scaling experiments test whether observed behavior matches theoretical complexity.**
7. **Always optimize the bottleneck, not the code that merely looks expensive.**
8. **Backend performance depends on database, network, concurrency, and queueing effects in addition to algorithmic cost.**
9. **AI performance depends on candidate count, dimensions, batching, memory locality, hardware utilization, and quality constraints.**
10. **Expert algorithm engineering combines mathematical analysis, measurement, profiling, and system-level reasoning.**
