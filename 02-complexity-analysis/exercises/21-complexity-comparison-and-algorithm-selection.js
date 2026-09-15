/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.21 — Complexity Comparison & Algorithm Selection
 *
 * Exercises are intentionally unsolved.
 */

// ============================================================
// Exercise 01 — Growth Comparison
// ============================================================
// Compare O(1), O(log N), O(N), O(N log N), O(N²), O(2^N).
// TODO: Order them from slowest growth to fastest growth.

// ============================================================
// Exercise 02 — Crossover Point
// ============================================================
// T_A = 1000N
// T_B = N²
// TODO: Find the approximate crossover point.

// ============================================================
// Exercise 03 — Preprocessing vs Queries
// ============================================================
// A: Q queries, each O(N)
// B: build O(N log N), query O(log N)
// TODO: Derive total cost for both and explain when B becomes attractive.

// ============================================================
// Exercise 04 — Break-Even Analysis
// ============================================================
// Strategy A: 10N work/query.
// Strategy B: 1000N preprocessing + N work/query.
// TODO: Find the query count where B catches A.

// ============================================================
// Exercise 05 — Static vs Dynamic Data
// ============================================================
// TODO: Explain which strategy you would prefer for:
// 1. 1 million reads and almost no updates.
// 2. 100 reads and 1 million updates.

// ============================================================
// Exercise 06 — Hashing vs Sorting
// ============================================================
// N values and Q membership queries.
// TODO: Compare hash-based and sort+binary-search strategies including build,
// query, and memory costs.

// ============================================================
// Exercise 07 — Top-K
// ============================================================
// N values, only K largest are required.
// TODO: Compare full sorting with heap-based Top-K.
// Explain the assumption K << N.

// ============================================================
// Exercise 08 — Multiple Parameters
// ============================================================
// A = O(N²), B = O(NM).
// TODO: Explain why neither is universally better.
// Give conditions under which B wins and A wins.

// ============================================================
// Exercise 09 — Memory-Constrained Selection
// ============================================================
// A: O(N) time, O(N) auxiliary memory.
// B: O(N log N) time, O(1) auxiliary memory.
// TODO: Choose an algorithm under a strict memory budget and justify it.

// ============================================================
// Exercise 10 — BFS vs DFS
// ============================================================
// Graph has V vertices and E edges.
// TODO: Compare traversal time and discuss memory/search-order differences.
// State which one is required for unweighted shortest-path discovery.

// ============================================================
// Exercise 11 — Binary Search Preconditions
// ============================================================
// TODO: Explain why O(log N) does not make binary search valid for every array.
// Give the property required by binary search.

// ============================================================
// Exercise 12 — Tail Latency
// ============================================================
// Algorithm A has lower average latency but occasional very large spikes.
// Algorithm B has slightly higher average latency but stable p99.
// TODO: Choose one for an interactive API with a strict p99 SLA.

// ============================================================
// Exercise 13 — Database-Aware Selection
// ============================================================
// A route performs N database round trips.
// Alternative performs one batched query.
// TODO: Compare the two designs beyond JavaScript loop complexity.

// ============================================================
// Exercise 14 — Distributed Fan-Out
// ============================================================
// A request calls F downstream services.
// TODO: Model sequential critical-path latency and parallel critical-path latency.
// Explain why parallelism does not eliminate total downstream work.

// ============================================================
// Exercise 15 — AI Retrieval
// ============================================================
// Q queries, K candidates/query, D dimensions.
// TODO: Derive scoring complexity and identify three ways to reduce work.
// Discuss quality constraints on each optimization.

// ============================================================
// Exercise 16 — Exact vs ANN
// ============================================================
// TODO: Explain why exact vector search may become expensive as N grows.
// Explain why ANN does not have one universal Big-O complexity.

// ============================================================
// Exercise 17 — AI Reranking
// ============================================================
// K candidates/query and reranking cost R per candidate.
// TODO: Derive total reranking work for Q queries.
// Explain how reducing K changes latency and quality.

// ============================================================
// Exercise 18 — Batch Size Selection
// ============================================================
// Batch cost = C + B*P.
// TODO: Derive average cost/request and explain throughput, memory, and latency
// trade-offs as B increases.

// ============================================================
// Exercise 19 — Build / Update / Query Matrix
// ============================================================
// Index build = O(N log N)
// Update = O(log N)
// Query = O(log N)
// U updates, Q queries.
// TODO: Derive total workload and explain why query-only benchmarking is incomplete.

// ============================================================
// Exercise 20 — Full Algorithm Selection Synthesis
// ============================================================
// A backend/AI service has:
// N records, Q queries, U updates, K Top-K candidates, D vector dimensions,
// C concurrent requests, and strict p99 + memory + quality constraints.
// TODO:
// 1. Define the workload model.
// 2. Identify candidate algorithms.
// 3. Eliminate candidates violating hard constraints.
// 4. Compare time and memory.
// 5. Include build/update/query costs.
// 6. Include database/network costs.
// 7. Account for concurrency and tail latency.
// 8. Account for AI quality constraints.
// 9. Choose the simplest viable design.
// 10. Describe how you would benchmark and validate the decision.

// ============================================================
// Completion Checklist
// ============================================================
// [ ] I compare algorithms using normalized parameters.
// [ ] I understand crossover points.
// [ ] I can perform break-even analysis.
// [ ] I include preprocessing and update costs.
// [ ] I preserve multiple parameters.
// [ ] I include memory in selection.
// [ ] I understand expected vs worst-case behavior.
// [ ] I account for latency and throughput separately.
// [ ] I consider p95/p99 behavior.
// [ ] I include database/network work.
// [ ] I can compare distributed fan-out strategies.
// [ ] I can compare exact and approximate AI retrieval.
// [ ] I include K and D in retrieval analysis.
// [ ] I include quality constraints in AI selection.
// [ ] I can justify an algorithm choice using a complete cost model.
