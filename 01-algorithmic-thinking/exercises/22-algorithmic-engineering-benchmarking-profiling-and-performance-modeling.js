// 01.22 — Algorithmic Engineering: Benchmarking, Profiling & Performance Modeling
//
// Rules:
// 1. Keep all exercises unsolved.
// 2. Validate correctness before trusting performance measurements.
// 3. Use representative and adversarial workloads.
// 4. Measure distributions, not one timing result.
// 5. Profile before optimizing.

// -----------------------------------------------------------------------------
// Exercise 01 — Big-O vs Reality
// -----------------------------------------------------------------------------
// Compare two O(n) implementations with intentionally different constant
// factors and allocation behavior.
//
// Benchmark increasing input sizes.
//
// Explain why both are O(n) but their measured performance differs.

// -----------------------------------------------------------------------------
// Exercise 02 — Benchmark Contract
// -----------------------------------------------------------------------------
// Write a benchmark specification for an array-search algorithm.
// Include:
// - objective,
// - input sizes,
// - input distributions,
// - correctness rule,
// - warm-up strategy,
// - repetitions,
// - reported metrics,
// - runtime/environment metadata.

// -----------------------------------------------------------------------------
// Exercise 03 — Input Families
// -----------------------------------------------------------------------------
// Generate datasets that are:
// - random,
// - sorted,
// - reverse sorted,
// - nearly sorted,
// - duplicate-heavy,
// - adversarial.
//
// Use them to benchmark a sorting/searching algorithm.
//
// Explain which input properties affect performance.

// -----------------------------------------------------------------------------
// Exercise 04 — Scaling Experiment
// -----------------------------------------------------------------------------
// Benchmark an algorithm at:
// n = 100, 1_000, 10_000, 100_000, 1_000_000.
//
// Record runtime.
//
// Compare observed growth with its theoretical complexity.
//
// Explain why measured values will not form a perfect mathematical curve.

// -----------------------------------------------------------------------------
// Exercise 05 — Crossover Point
// -----------------------------------------------------------------------------
// Implement two algorithms where one has a better asymptotic complexity but a
// larger constant factor.
//
// Find the approximate input size where the faster implementation changes.
//
// Report the crossover point and explain why Big-O alone could not identify it.

// -----------------------------------------------------------------------------
// Exercise 06 — Latency Distribution
// -----------------------------------------------------------------------------
// Generate repeated latency measurements containing realistic outliers.
//
// Calculate:
// - mean,
// - median,
// - p90,
// - p95,
// - p99,
// - maximum.
//
// Explain why reporting only the mean can be misleading.

// -----------------------------------------------------------------------------
// Exercise 07 — Correctness + Benchmarking
// -----------------------------------------------------------------------------
// Implement:
// A. a simple trusted reference algorithm,
// B. an optimized algorithm.
//
// Generate random test cases and compare outputs before collecting performance
// results.
//
// Add edge-case and adversarial tests.

// -----------------------------------------------------------------------------
// Exercise 08 — Allocation Pressure
// -----------------------------------------------------------------------------
// Create two implementations of the same transformation:
// A. creates many temporary objects,
// B. uses a lower-allocation representation.
//
// Measure runtime and memory behavior.
//
// Explain how allocation rate can affect garbage collection and tail latency.

// -----------------------------------------------------------------------------
// Exercise 09 — Warm-Up Effects
// -----------------------------------------------------------------------------
// Benchmark a JavaScript function repeatedly.
//
// Record early iterations separately from steady-state iterations.
//
// Explain why JIT warm-up can make the first measurements different from later
// measurements.

// -----------------------------------------------------------------------------
// Exercise 10 — Profiling a Hot Path
// -----------------------------------------------------------------------------
// Build a small pipeline:
// parse → validate → lookup → rank → serialize.
//
// Intentionally make one stage expensive.
//
// Profile or instrument the pipeline and identify the dominant stage.
//
// Optimize only that stage and measure end-to-end impact.

// -----------------------------------------------------------------------------
// Exercise 11 — Dominant Resource
// -----------------------------------------------------------------------------
// Construct three workloads:
// A. CPU-bound,
// B. memory/allocation-bound,
// C. I/O-bound.
//
// Identify the dominant resource for each.
//
// Propose an optimization that targets the actual bottleneck.

// -----------------------------------------------------------------------------
// Exercise 12 — Data Locality
// -----------------------------------------------------------------------------
// Compare two representations of equivalent logical data:
// A. compact contiguous representation,
// B. pointer/object-heavy representation.
//
// Benchmark traversal.
//
// Explain possible effects of memory locality and allocation overhead without
// assuming that implementation details are universal across runtimes.

// -----------------------------------------------------------------------------
// Exercise 13 — Differential Complexity Validation
// -----------------------------------------------------------------------------
// Choose an algorithm whose expected complexity is O(n log n).
//
// Measure runtime across multiple input sizes.
//
// Test whether the observed scaling is broadly consistent with the expected
// growth rate.

// -----------------------------------------------------------------------------
// Exercise 14 — Amortized Benchmark
// -----------------------------------------------------------------------------
// Implement a dynamic-array-like structure with geometric resizing.
//
// Benchmark a long sequence of insertions rather than only the resize operation.
//
// Compare:
// - individual worst-case insertion,
// - total insertion cost,
// - average/amortized cost.

// -----------------------------------------------------------------------------
// Exercise 15 — Cache Workload
// -----------------------------------------------------------------------------
// Implement a small cache and benchmark it under:
// A. uniform random keys,
// B. highly skewed keys,
// C. repeated hot keys.
//
// Measure:
// - hit rate,
// - miss rate,
// - latency,
// - memory.
//
// Explain why workload distribution changes the conclusion.

// -----------------------------------------------------------------------------
// Exercise 16 — Parallel Speedup
// -----------------------------------------------------------------------------
// Given measured times:
// T1 and Tp for multiple worker counts,
// calculate:
// - speedup,
// - efficiency.
//
// Identify the point where adding workers provides diminishing returns.
//
// Explain whether serial work, contention, communication, or imbalance could be
// responsible.

// -----------------------------------------------------------------------------
// Exercise 17 — Backend Load Test
// -----------------------------------------------------------------------------
// Design a benchmark for a backend endpoint.
//
// Vary:
// - request rate,
// - concurrency,
// - payload size,
// - cache hit rate,
// - dependency latency.
//
// Record:
// - throughput,
// - p50/p95/p99,
// - CPU,
// - memory,
// - errors,
// - queue depth.
//
// Identify the saturation point.

// -----------------------------------------------------------------------------
// Exercise 18 — Pagination Performance
// -----------------------------------------------------------------------------
// Compare conceptual offset pagination with keyset/cursor pagination.
//
// Benchmark increasing page positions.
//
// Analyze:
// - scanned records,
// - latency,
// - memory,
// - behavior under concurrent inserts.

// -----------------------------------------------------------------------------
// Exercise 19 — AI Retrieval Benchmark
// -----------------------------------------------------------------------------
// Build or simulate a retrieval pipeline with configurable candidate count.
//
// Measure:
// - recall@K,
// - p50/p95/p99 latency,
// - candidate count,
// - memory.
//
// Find an operating point that satisfies both a quality target and a latency
// budget.

// -----------------------------------------------------------------------------
// Exercise 20 — Expert Performance Investigation
// -----------------------------------------------------------------------------
// Take a deliberately slow backend or AI workload.
//
// Follow this complete process:
// 1. Define the target metric.
// 2. Establish correctness baseline.
// 3. Benchmark representative inputs.
// 4. Benchmark adversarial inputs.
// 5. Profile the workload.
// 6. Identify the dominant resource.
// 7. Form one optimization hypothesis.
// 8. Implement one change.
// 9. Re-run the benchmark.
// 10. Compare latency distributions.
// 11. Measure memory/allocation effects.
// 12. Validate correctness again.
// 13. Check whether the bottleneck moved.
// 14. Decide whether the complexity of the optimization is justified.
// 15. Define a regression threshold for future changes.
//
// Document the complete investigation as an engineering performance report.

// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// [ ] I understand why Big-O is necessary but insufficient.
// [ ] I can distinguish latency from throughput.
// [ ] I can explain p50, p95, and p99.
// [ ] I can write a benchmark contract.
// [ ] I can generate representative workload families.
// [ ] I can perform scaling experiments.
// [ ] I understand crossover points and constant factors.
// [ ] I can validate correctness before benchmarking.
// [ ] I understand benchmark noise and repetitions.
// [ ] I understand JavaScript warm-up/JIT considerations.
// [ ] I can identify hot paths with profiling.
// [ ] I can distinguish CPU, memory, I/O, network, and coordination bottlenecks.
// [ ] I understand allocation pressure and GC implications.
// [ ] I can reason about memory locality.
// [ ] I can benchmark amortized algorithms correctly.
// [ ] I can benchmark caches under different distributions.
// [ ] I can calculate parallel speedup and efficiency.
// [ ] I can design production-like backend load tests.
// [ ] I can evaluate AI retrieval using both quality and performance metrics.
// [ ] I can run a complete hypothesis-driven performance investigation.
