// 01.3 — Constraints, Input Size & Feasibility Analysis
//
// Rules:
// 1. Never select an algorithm before reading the constraints.
// 2. Estimate growth before implementation.
// 3. State whether complexity is expected, amortized, average, or worst-case.
// 4. Consider both time and auxiliary space.
// 5. Treat these as reasoning exercises; do not optimize by guesswork.

// Exercise 1: For n = 10, 100, 1_000, 100_000, and 1_000_000,
// classify O(1), O(log n), O(n), O(n log n), and O(n^2) as plausible,
// suspicious, or clearly impractical under a typical interview time budget.
// Explain that these are heuristics rather than universal limits.

// Exercise 2: Estimate the number of pair comparisons performed by a nested-loop
// duplicate check for n = 100, 1_000, and 100_000.

// Exercise 3: Compare two duplicate-detection approaches:
// A) O(n^2) time, O(1) auxiliary space
// B) O(n) expected time, O(n) auxiliary space
// Decide which is preferable for n = 50 and n = 500_000, and explain why.

// Exercise 4: A problem has r rows and c columns. Derive the time complexity of
// visiting every cell. Explain why O(r*c) is more precise than blindly writing O(n^2).

// Exercise 5: A graph has V vertices and E edges. Explain why a traversal is often
// expressed as O(V + E). Give examples of sparse and dense graphs.

// Exercise 6: A system preprocesses n records in O(n), then answers q queries in
// O(log n) each. Derive total complexity and explain when preprocessing is useful.

// Exercise 7: Analyze a recursive algorithm with depth n and O(1) work per call.
// State time complexity and auxiliary stack space.

// Exercise 8: Analyze a recursive algorithm that halves n on every call and does
// O(1) work per call. State time complexity and recursion depth.

// Exercise 9: Explain the difference between:
// - worst-case O(1)
// - expected O(1)
// - amortized O(1)
// Use hash-table lookup and dynamic-array append as examples.

// Exercise 10: For linear search, identify best-case, average-case under a simple
// uniform-position assumption, and worst-case complexity.

// Exercise 11: Given a streaming input with billions of records, explain why an
// O(n) algorithm may still be infeasible if it stores all records. Propose questions
// you would ask before changing the algorithm.

// Exercise 12: Given a memory budget, compare an array of primitive values with a
// Map containing objects. Explain why both can be O(n) while having different
// practical memory footprints.

// Exercise 13: A vector database contains N vectors of dimension d. Explain why a
// naive exact scan is approximately O(N*d) per query. Identify what happens as N grows.

// Exercise 14: For a system with many repeated queries, compare:
// - no preprocessing
// - preprocessing + cheaper query
// Derive total work symbolically using n and q.

// Exercise 15: Create a feasibility matrix for three candidate algorithms for a
// problem of your choice. Include time, auxiliary space, assumptions, and verdict.

// Exercise 16: Pick an algorithm that looks asymptotically optimal. Identify at
// least three production factors besides Big-O that could make another approach
// preferable (for example allocation, constants, memory locality, latency, or
// operational complexity).

// Add boundary examples where the input is tiny, medium, and very large. Record
// what changes in your algorithm choice as the constraints change.
