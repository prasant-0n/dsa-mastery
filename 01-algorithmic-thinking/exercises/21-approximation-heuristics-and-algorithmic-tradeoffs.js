// 01.21 — Approximation, Heuristics & Algorithmic Trade-Offs
//
// Rules:
// 1. Keep all exercises unsolved.
// 2. State the exact objective and hard constraints first.
// 3. Separate formal guarantees from empirical observations.
// 4. Quantify quality, latency, memory, and error whenever possible.

// -----------------------------------------------------------------------------
// Exercise 01 — Classify the Algorithm
// -----------------------------------------------------------------------------
// Classify each strategy as exact, approximation, heuristic, randomized, or a
// combination of these categories. Explain your reasoning.
//
// A. Full exhaustive search.
// B. Greedy algorithm with a proven 2-approximation bound.
// C. Random-restart hill climbing with no quality guarantee.
// D. Randomized exact algorithm.
// E. ANN retrieval with measured recall but no universal exactness guarantee.

// -----------------------------------------------------------------------------
// Exercise 02 — Approximation Ratio
// -----------------------------------------------------------------------------
// A minimization algorithm returns a solution costing 135 while OPT = 100.
//
// Calculate:
// - multiplicative ratio,
// - relative error,
// - percentage error.
//
// Explain what a formal 1.35-approximation guarantee would mean.

// -----------------------------------------------------------------------------
// Exercise 03 — Maximization Ratio
// -----------------------------------------------------------------------------
// A maximization algorithm returns value 80 while OPT = 100.
//
// Express its approximation quality using:
// - a fraction of OPT,
// - a maximization approximation factor.
//
// Explain why minimization and maximization conventions must not be mixed.

// -----------------------------------------------------------------------------
// Exercise 04 — Lower Bound + Approximation Proof
// -----------------------------------------------------------------------------
// An algorithm constructs a solution ALG.
// You prove:
//   ALG <= 2 × LB
// and independently prove:
//   LB <= OPT
//
// Write the complete proof that ALG is a 2-approximation for a minimization
// problem.

// -----------------------------------------------------------------------------
// Exercise 05 — Greedy Without a Guarantee
// -----------------------------------------------------------------------------
// Construct a small optimization problem where a greedy local decision produces
// a worse solution than the globally optimal solution.
//
// Show:
// - input,
// - greedy choices,
// - greedy result,
// - optimal result,
// - why the greedy rule fails.
//
// Do not claim an approximation guarantee unless you prove one.

// -----------------------------------------------------------------------------
// Exercise 06 — Relaxation and Rounding
// -----------------------------------------------------------------------------
// Consider a binary decision problem where x must be 0 or 1.
//
// Create a relaxed version allowing:
//   0 <= x <= 1
//
// Solve a small example conceptually and design a rounding rule.
//
// Identify a case where naive rounding can violate a hard constraint.

// -----------------------------------------------------------------------------
// Exercise 07 — Local Search
// -----------------------------------------------------------------------------
// Represent a route as an array of locations.
//
// Define at least three neighborhood operations:
// - swap,
// - reverse segment,
// - relocate.
//
// Implement a local-search skeleton that repeatedly accepts improving moves.
//
// Document how the neighborhood definition changes the search behavior.

// -----------------------------------------------------------------------------
// Exercise 08 — Hill Climbing Failure
// -----------------------------------------------------------------------------
// Construct a small search landscape containing:
// - a local optimum,
// - a better global optimum,
// - a path that requires temporarily accepting a worse state.
//
// Explain why basic hill climbing gets stuck.
//
// Add random restarts and compare the behavior.

// -----------------------------------------------------------------------------
// Exercise 09 — Simulated Annealing Intuition
// -----------------------------------------------------------------------------
// Implement a toy optimization search where worse moves may be accepted with a
// probability controlled by a temperature parameter.
//
// Experiment with:
// - high starting temperature,
// - low starting temperature,
// - fast cooling,
// - slow cooling.
//
// Record how the search behavior changes.

// -----------------------------------------------------------------------------
// Exercise 10 — Beam Search
// -----------------------------------------------------------------------------
// Build a small search tree and implement beam search with beam widths:
// - 1,
// - 2,
// - 4.
//
// Measure:
// - nodes expanded,
// - maximum frontier size,
// - final solution quality.
//
// Explain what is gained and lost as beam width changes.

// -----------------------------------------------------------------------------
// Exercise 11 — Safe vs Heuristic Pruning
// -----------------------------------------------------------------------------
// Create two pruning rules for a search problem:
// A. a mathematically safe bound,
// B. a heuristic rule that discards candidates that merely look unlikely.
//
// Show why A can preserve exactness while B may change the returned optimum.

// -----------------------------------------------------------------------------
// Exercise 12 — Branch-and-Bound
// -----------------------------------------------------------------------------
// Implement a small branch-and-bound optimization problem.
//
// Track:
// - current best solution,
// - bound for each branch,
// - branches explored,
// - branches pruned.
//
// Verify that every pruned branch cannot contain a better solution.

// -----------------------------------------------------------------------------
// Exercise 13 — Anytime Algorithm
// -----------------------------------------------------------------------------
// Design an optimizer that receives a time/iteration budget.
//
// It should:
// 1. produce a feasible solution quickly,
// 2. improve it repeatedly,
// 3. return the best solution known when the budget expires.
//
// Record quality after several budgets.

// -----------------------------------------------------------------------------
// Exercise 14 — Error Budget
// -----------------------------------------------------------------------------
// A production system allows at most 2% relative error and 100 ms p95 latency.
//
// Compare three hypothetical algorithms:
// A. 0% error, 500 ms p95.
// B. 1% error, 90 ms p95.
// C. 5% error, 20 ms p95.
//
// Determine which candidates satisfy the contract and explain why.

// -----------------------------------------------------------------------------
// Exercise 15 — Heuristic Benchmarking
// -----------------------------------------------------------------------------
// Create several input families:
// - random,
// - sorted,
// - reverse sorted,
// - duplicate-heavy,
// - highly skewed,
// - maximum-size.
//
// Evaluate a heuristic on each family.
//
// Report:
// - solution quality,
// - average latency,
// - p95 latency,
// - memory,
// - worst observed quality.
//
// Explain why a random benchmark alone is insufficient.

// -----------------------------------------------------------------------------
// Exercise 16 — Approximate vs Exact Top-K
// -----------------------------------------------------------------------------
// Given a large dataset and K much smaller than N, compare:
// A. full sorting,
// B. exact heap-based Top-K,
// C. approximate candidate selection followed by exact verification.
//
// Derive the expected computational and memory trade-offs.
//
// Identify cases where approximation is unnecessary.

// -----------------------------------------------------------------------------
// Exercise 17 — Backend Scheduling Heuristic
// -----------------------------------------------------------------------------
// Design a job scheduler using:
// - priority,
// - deadline,
// - resource availability.
//
// Create an input where the heuristic produces a feasible but non-optimal
// schedule.
//
// Define how you would measure whether the heuristic is good enough in
// production.

// -----------------------------------------------------------------------------
// Exercise 18 — AI ANN Retrieval Trade-Off
// -----------------------------------------------------------------------------
// Model an approximate nearest-neighbor retrieval system with configurable:
// - search effort,
// - candidate count,
// - reranking depth.
//
// Measure:
// - recall@K,
// - latency,
// - memory,
// - candidate count.
//
// Find a practical operating point under a fixed latency budget.

// -----------------------------------------------------------------------------
// Exercise 19 — Approximate-First, Exact-Later Pipeline
// -----------------------------------------------------------------------------
// Design a pipeline:
//
// cheap approximate filter
//       ↓
// candidate generation
//       ↓
// exact verification
//       ↓
// final result
//
// Apply it to either backend search or AI retrieval.
//
// Explain why the first stage is allowed to make mistakes while the final stage
// remains authoritative.

// -----------------------------------------------------------------------------
// Exercise 20 — Expert Algorithm Selection
// -----------------------------------------------------------------------------
// Choose a realistic backend or AI optimization problem.
//
// Compare at least four strategies:
// 1. exact,
// 2. approximation with a formal guarantee,
// 3. heuristic,
// 4. hybrid approximate-first/exact-later.
//
// For each strategy document:
// - correctness/quality,
// - worst-case behavior,
// - expected behavior,
// - latency,
// - memory,
// - implementation complexity,
// - operational risks,
// - failure modes.
//
// Then choose one strategy and defend it using a concrete system contract.

// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// [ ] I can distinguish exact algorithms from approximation algorithms.
// [ ] I can distinguish approximation algorithms from heuristics.
// [ ] I understand approximation ratios.
// [ ] I can reason about additive and relative error.
// [ ] I can use lower bounds to prove approximation quality.
// [ ] I understand relaxation and rounding.
// [ ] I understand local search and local optima.
// [ ] I understand beam search trade-offs.
// [ ] I can distinguish safe pruning from heuristic pruning.
// [ ] I understand branch-and-bound.
// [ ] I understand anytime algorithms.
// [ ] I can define an explicit error budget.
// [ ] I can design a meaningful heuristic benchmark.
// [ ] I can analyze quality vs latency vs memory.
// [ ] I can reason about false positives and false negatives.
// [ ] I can identify when approximation is unnecessary.
// [ ] I can apply approximation thinking to backend scheduling.
// [ ] I can apply approximation thinking to AI retrieval.
// [ ] I can design approximate-first/exact-later systems.
// [ ] I can defend an algorithmic trade-off using a concrete system contract.
