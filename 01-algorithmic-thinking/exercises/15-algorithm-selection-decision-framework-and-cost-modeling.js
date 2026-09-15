// 01.15 — Algorithm Selection: Decision Framework & Cost Modeling
//
// Keep all exercises unsolved.
// For every exercise, justify the choice instead of naming an algorithm only.

// -----------------------------------------------------------------------------
// Exercise 01 — Contract First
// -----------------------------------------------------------------------------
// Write a precise contract for a function that searches for a user by ID.
// Include input, output, correctness requirement, constraints, and failure cases.
//
// Then list at least three possible algorithm/representation choices.

// -----------------------------------------------------------------------------
// Exercise 02 — Workload Model
// -----------------------------------------------------------------------------
// A service performs 10,000 writes and 10,000,000 reads per hour.
//
// Design two candidate lookup strategies and calculate a rough workload model for
// each. Explain why operation frequency changes the algorithm decision.

// -----------------------------------------------------------------------------
// Exercise 03 — Constraint-First Elimination
// -----------------------------------------------------------------------------
// N can be as large as 1,000,000.
//
// Evaluate whether O(n²), O(n log n), O(n), and O(log n) candidates are plausible.
// Do not use exact hardware timing; explain the asymptotic feasibility reasoning.

// -----------------------------------------------------------------------------
// Exercise 04 — Big-O Is Not Everything
// -----------------------------------------------------------------------------
// Construct a scenario where an O(n) implementation is slower than an O(n log n)
// implementation for small inputs.
//
// Explain the roles of constants, locality, allocation, and implementation details.

// -----------------------------------------------------------------------------
// Exercise 05 — Break-Even Analysis
// -----------------------------------------------------------------------------
// Compare:
// A. Q queries at 100 operations each.
// B. 1,000 preprocessing operations + Q queries at 2 operations each.
//
// Derive the approximate break-even value of Q.
//
// Explain what assumptions make this model useful and what it ignores.

// -----------------------------------------------------------------------------
// Exercise 06 — Static vs Dynamic
// -----------------------------------------------------------------------------
// Compare algorithm choices for:
// A. a dataset updated once and queried 100 million times,
// B. a dataset updated millions of times and queried rarely.
//
// Explain how preprocessing and index-maintenance costs change the choice.

// -----------------------------------------------------------------------------
// Exercise 07 — Online vs Offline
// -----------------------------------------------------------------------------
// Given a list of records and a set of queries, design:
// A. an online strategy,
// B. an offline strategy that can see all records and queries first.
//
// Explain what additional opportunities the offline model provides.

// -----------------------------------------------------------------------------
// Exercise 08 — Exact vs Approximate
// -----------------------------------------------------------------------------
// Design an exact membership solution and an approximate membership solution for a
// very large stream.
//
// Explain the correctness guarantee lost by the approximate version and why the
// weaker guarantee can reduce memory.

// -----------------------------------------------------------------------------
// Exercise 09 — Worst Case vs Expected Case
// -----------------------------------------------------------------------------
// Compare two hypothetical algorithms:
// A. deterministic O(n log n) worst case,
// B. expected O(n), worst case O(n²).
//
// Decide which is preferable for:
// - an interactive API with strict p99 latency,
// - an offline analytics job.
//
// Justify each choice.

// -----------------------------------------------------------------------------
// Exercise 10 — Latency vs Throughput
// -----------------------------------------------------------------------------
// Design two strategies for processing 1 million requests:
// A. one request at a time,
// B. batching requests.
//
// Discuss how batching can improve throughput while potentially increasing
// individual request latency.

// -----------------------------------------------------------------------------
// Exercise 11 — Search Algorithm Selection
// -----------------------------------------------------------------------------
// For each workload choose a strategy and justify it:
// A. unsorted array, one search
// B. sorted array, one search
// C. sorted array, millions of searches
// D. mutable collection, millions of exact membership queries
// E. database-backed collection with an appropriate index

// -----------------------------------------------------------------------------
// Exercise 12 — Sorting Selection
// -----------------------------------------------------------------------------
// Compare candidate sorting approaches for:
// A. small in-memory data,
// B. stable sorting requirement,
// C. bounded integer keys,
// D. data larger than RAM,
// E. adversarial input requiring strong worst-case behavior.
//
// Explain why the requirements lead to different choices.

// -----------------------------------------------------------------------------
// Exercise 13 — Selection vs Full Sorting
// -----------------------------------------------------------------------------
// Only the largest K values out of N are needed.
//
// Compare:
// A. full sorting,
// B. size-K heap,
// C. selection/Quickselect-style approach.
//
// Discuss runtime, output requirements, memory, and whether all ordering is needed.

// -----------------------------------------------------------------------------
// Exercise 14 — Dominant Resource
// -----------------------------------------------------------------------------
// Consider a service where CPU usage is 20%, memory is 95%, and network bandwidth
// is 90%.
//
// Rank the likely optimization priorities.
//
// Explain why reducing CPU operations may have little effect on overall performance.

// -----------------------------------------------------------------------------
// Exercise 15 — I/O-Aware Selection
// -----------------------------------------------------------------------------
// Compare two algorithms:
// A. fewer CPU operations but many random disk reads,
// B. more CPU operations but sequential reads.
//
// Explain which could win and why CPU operation count alone is insufficient.

// -----------------------------------------------------------------------------
// Exercise 16 — Backend Rate Limiter
// -----------------------------------------------------------------------------
// Design candidate algorithms for a 100-requests-per-minute-per-user policy:
// A. fixed window,
// B. sliding window,
// C. token bucket.
//
// Compare precision, burst behavior, memory, and implementation complexity.

// -----------------------------------------------------------------------------
// Exercise 17 — Backend LRU Cache
// -----------------------------------------------------------------------------
// Design an LRU cache supporting get, put, and constant-time eviction decisions.
//
// Identify the required operations and select a combination of data structures.
//
// Explain why a single plain array is not an ideal representation.

// -----------------------------------------------------------------------------
// Exercise 18 — AI Retrieval Selection
// -----------------------------------------------------------------------------
// Compare:
// A. brute-force exact vector search,
// B. approximate indexed vector search.
//
// Choose a strategy for:
// - 10,000 vectors,
// - 100 million vectors,
// - strict exactness,
// - strict low latency with acceptable recall loss.
//
// Explain how N, D, recall, memory, and update frequency influence the decision.

// -----------------------------------------------------------------------------
// Exercise 19 — Benchmark Design
// -----------------------------------------------------------------------------
// You have two plausible algorithms for the same backend workload.
//
// Design a benchmark specifying:
// - input size,
// - data distribution,
// - operation mix,
// - warm/cold state,
// - concurrency,
// - repetitions,
// - memory measurement,
// - correctness validation.
//
// Explain why a single synthetic benchmark is insufficient.

// -----------------------------------------------------------------------------
// Exercise 20 — Full Algorithm Selection Review
// -----------------------------------------------------------------------------
// Choose a real backend or AI workload and perform a complete algorithm-selection
// review.
//
// Required sections:
// 1. Contract
// 2. Hard constraints
// 3. Optimization goals
// 4. N/Q/D and workload model
// 5. Required operations
// 6. Available assumptions
// 7. Candidate algorithms
// 8. Feasibility elimination
// 9. Time complexity
// 10. Memory complexity
// 11. Build/query/update cost
// 12. Worst/expected/tail behavior
// 13. Dominant resource
// 14. Implementation complexity
// 15. Benchmark plan
// 16. Final choice
// 17. Conditions under which another candidate would win
//
// Defend the final decision as if presenting it in a senior backend/AI engineering
// interview.

// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// [ ] I define the contract before selecting an algorithm.
// [ ] I separate hard constraints from optimization goals.
// [ ] I can model N, Q, D, and operation frequency.
// [ ] I can calculate preprocessing/query break-even points.
// [ ] I understand why Big-O alone is insufficient.
// [ ] I can distinguish static and dynamic workloads.
// [ ] I can distinguish online and offline algorithms.
// [ ] I can reason about exact vs approximate guarantees.
// [ ] I can compare worst-case and expected-case algorithms.
// [ ] I understand latency vs throughput.
// [ ] I can account for memory and allocation costs.
// [ ] I can identify I/O and network as algorithmic resources.
// [ ] I can identify the dominant resource before optimizing.
// [ ] I can choose an algorithm from the output contract.
// [ ] I can compare full sorting with selection for Top-K.
// [ ] I can select structures for caches and rate limiters.
// [ ] I can compare exact and approximate AI retrieval.
// [ ] I can design a representative benchmark.
// [ ] I can defend a final algorithm choice and its trade-offs.
// [ ] I can state when a different algorithm would become preferable.
