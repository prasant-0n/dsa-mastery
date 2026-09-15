/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.1 — Why Complexity Analysis Exists
 *
 * Instructions:
 * - Do not look for a solution while solving these exercises.
 * - Write your reasoning before writing code when an exercise asks for analysis.
 * - For complexity questions, explicitly identify the input-size parameter(s).
 * - These exercises are intentionally UNSOLVED.
 */

// ============================================================
// Exercise 01 — Correct but Not Scalable
// ============================================================
// Explain why an algorithm can be correct but still unsuitable
// for production. Give one concrete example.

function exercise01() {
  // TODO: Write your explanation.
}


// ============================================================
// Exercise 02 — Identify the Input Size
// ============================================================
// For each scenario, identify the most relevant input-size parameter(s):
// 1. Processing an array of transactions.
// 2. Comparing two strings.
// 3. Traversing a graph.
// 4. Processing a matrix.
// 5. Searching K candidates generated from N documents.

function exercise02() {
  // TODO: Write the parameters and explain why they matter.
}


// ============================================================
// Exercise 03 — Growth Reasoning
// ============================================================
// An algorithm performs approximately one operation per input element.
// Describe how its work changes when N changes from:
// 10 → 100 → 1,000 → 1,000,000.

function exercise03() {
  // TODO: Explain the growth pattern.
}


// ============================================================
// Exercise 04 — Pairwise Work
// ============================================================
// An algorithm compares every element with every other element.
// Without using formal Big-O notation yet, explain how the amount
// of work grows as N increases.

function exercise04() {
  // TODO: Describe the growth and justify it.
}


// ============================================================
// Exercise 05 — Same Problem, Different Cost
// ============================================================
// Implement two correct duplicate-detection approaches:
// A. Compare pairs of elements.
// B. Track previously seen values.
//
// Do not optimize further. The goal is to make the difference in
// computational work visible.

function exercise05Pairwise(values) {
  // TODO
}

function exercise05SeenSet(values) {
  // TODO
}


// ============================================================
// Exercise 06 — Benchmarking Is Not a Complexity Proof
// ============================================================
// Write a short explanation of why measuring an algorithm once on
// an array of 100 elements cannot tell you how it behaves on
// 10 million elements.

function exercise06() {
  // TODO: Explain the limitation of a single benchmark.
}


// ============================================================
// Exercise 07 — Cost Function
// ============================================================
// Consider a hypothetical algorithm with cost:
//
//     f(N) = 4N + 20
//
// Calculate f(N) for N = 10, 100, and 1,000.
// Then explain which part represents work that grows with N.

function exercise07() {
  // TODO
}


// ============================================================
// Exercise 08 — Multiple Parameters
// ============================================================
// An algorithm receives two arrays with lengths N and M and compares
// each element of the first array with each element of the second.
//
// Identify the input-size parameters and describe the total number
// of comparisons.

function exercise08() {
  // TODO
}


// ============================================================
// Exercise 09 — Matrix Work
// ============================================================
// A program visits every cell of an R × C matrix exactly once.
// Explain what determines the amount of work.
//
// Then explain why using only N can be misleading if R and C can vary
// independently.

function exercise09() {
  // TODO
}


// ============================================================
// Exercise 10 — Backend Cost
// ============================================================
// An API receives N user IDs and performs one database query for each ID.
//
// Analyze the growth of database operations as N increases.
// Explain why counting only JavaScript loop iterations would be an
// incomplete performance analysis.

function exercise10() {
  // TODO
}


// ============================================================
// Exercise 11 — Find the Scaling Risk
// ============================================================
// Consider three approaches for processing N records:
//
// A → approximately N units of work
// B → approximately N × N units of work
// C → approximately 2^N units of work
//
// Without calculating exact runtimes, explain which approaches become
// dangerous as N becomes large and why.

function exercise11() {
  // TODO
}


// ============================================================
// Exercise 12 — Small Input Trap
// ============================================================
// Algorithm A costs approximately 100N operations.
// Algorithm B costs approximately N² operations.
//
// Determine which is smaller for N = 10 and N = 1,000.
// Explain what this teaches about constants versus growth.

function exercise12() {
  // TODO
}


// ============================================================
// Exercise 13 — Resource Dimensions
// ============================================================
// List at least five resources that can matter when evaluating a
// backend algorithm besides raw CPU instructions.
//
// For each resource, give one example of how an algorithm can consume it.

function exercise13() {
  // TODO
}


// ============================================================
// Exercise 14 — Input Magnitude vs Input Size
// ============================================================
// A function sums every element of an array.
// Explain why changing the values from small integers to very large
// integers does not normally change the number of array elements visited.
//
// Then describe one situation where numeric magnitude can matter to
// complexity analysis.

function exercise14() {
  // TODO
}


// ============================================================
// Exercise 15 — Complexity as a Feasibility Filter
// ============================================================
// You must process N = 10,000,000 records.
// Candidate approaches perform roughly:
//
// A → N operations
// B → N log N operations
// C → N² operations
//
// Explain which approach(es) you would reject immediately and what
// additional information you would want before choosing between A and B.

function exercise15() {
  // TODO
}


// ============================================================
// Exercise 16 — Backend Bottleneck
// ============================================================
// Two implementations both scan an array once.
//
// Implementation A performs a few arithmetic operations per element.
// Implementation B performs one remote API request per element.
//
// Explain why both can have similar structural iteration growth while
// having radically different practical performance.

function exercise16() {
  // TODO
}


// ============================================================
// Exercise 17 — AI Retrieval
// ============================================================
// A vector search system compares one query vector against N document
// vectors. Each similarity calculation examines D dimensions.
//
// Identify the input-size parameters and describe how the total amount
// of similarity-computation work grows.
//
// Do not use an ANN index yet; reason about the brute-force baseline.

function exercise17() {
  // TODO
}


// ============================================================
// Exercise 18 — Growth Table
// ============================================================
// Complete a qualitative table for N = 10, 100, 1,000, and 10,000.
// Compare how quickly these expressions grow:
//
// 1. constant work
// 2. logarithmic-style work
// 3. linear work
// 4. quadratic work
//
// Exact logarithm values are not required.

function exercise18() {
  // TODO: Build the table and explain the ordering.
}


// ============================================================
// Exercise 19 — Before Coding
// ============================================================
// Design a pre-coding checklist for deciding whether an algorithmic
// approach is likely to scale.
//
// Your checklist must contain at least 8 questions and include both
// time and memory considerations.

function exercise19() {
  // TODO
}


// ============================================================
// Exercise 20 — Explain Like an Interview
// ============================================================
// Imagine an interviewer asks:
//
// “Why do we need complexity analysis if we can just benchmark the code?”
//
// Write a 60–90 second answer that clearly distinguishes:
// - asymptotic growth,
// - implementation performance,
// - workload size,
// - and practical benchmarking.

function exercise20() {
  // TODO: Write your interview answer.
}


// ============================================================
// Completion Checklist
// ============================================================
// [ ] I can explain why correctness alone is insufficient.
// [ ] I can identify input-size parameters.
// [ ] I can reason about growth before using Big-O notation.
// [ ] I understand why one benchmark does not describe scaling.
// [ ] I can distinguish CPU work from expensive I/O/network work.
// [ ] I can use complexity as an early feasibility filter.
// [ ] I can explain complexity concepts in backend and AI scenarios.
// [ ] I can explain the purpose of asymptotic analysis in an interview.
