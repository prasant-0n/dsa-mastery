/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.10 — Best, Average & Worst Case
 *
 * Solve every exercise yourself before checking references.
 * Always state the case being analyzed and the assumptions behind it.
 */

// ============================================================
// Exercise 01 — Linear Search Cases
// ============================================================
function exercise01(items, target) {
  for (let i = 0; i < items.length; i++) {
    if (items[i] === target) return i;
  }

  return -1;
}

// TODO:
// Give the best-case and worst-case time complexity.
// Then explain what input produces each case.


// ============================================================
// Exercise 02 — Average Linear Search
// ============================================================
// Assume the target is guaranteed to exist and every position is equally
// likely.
//
// TODO:
// Derive the expected number of comparisons and give its asymptotic bound.


// ============================================================
// Exercise 03 — Early Exit
// ============================================================
function exercise03(items) {
  for (const value of items) {
    if (value < 0) return true;
  }

  return false;
}

// TODO:
// 1. Best case.
// 2. Worst case.
// 3. Explain why early exit does not change the worst-case bound.


// ============================================================
// Exercise 04 — Case Classification
// ============================================================
// For each algorithm, determine which case is being described:
//
// A. Search stops at the first element.
// B. Search examines every element.
// C. Input is sampled according to a known probability distribution.
// D. Cost is averaged across a long sequence of operations.
//
// TODO: Map each description to best / worst / average / amortized.


// ============================================================
// Exercise 05 — Big-O Is Not a Case Label
// ============================================================
// TODO: Explain why the statement:
//
//     "Big-O means worst case."
//
// is mathematically incorrect.
// Give one example of an O(n) best-case upper bound.


// ============================================================
// Exercise 06 — Binary Search
// ============================================================
function exercise06(items, target) {
  let left = 0;
  let right = items.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (items[mid] === target) return mid;
    if (items[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}

// TODO:
// Determine best-case and worst-case time complexity.
// Explain the input condition responsible for each case.


// ============================================================
// Exercise 07 — Distribution Matters
// ============================================================
// A linear search finds a target at position i.
//
// Distribution A: every position is equally likely.
// Distribution B: 90% of successful searches find the target at position 0.
//
// TODO:
// Explain why expected costs differ even though the algorithm is unchanged.


// ============================================================
// Exercise 08 — Quicksort Cases
// ============================================================
// Consider Quicksort with a partition operation costing Θ(n).
//
// TODO:
// 1. Describe a balanced recursion tree.
// 2. Describe a maximally unbalanced recursion tree.
// 3. Give the corresponding asymptotic time bounds.


// ============================================================
// Exercise 09 — Randomized Quicksort
// ============================================================
// TODO:
// Explain the difference between:
//
//     expected O(n log n)
//     worst-case O(n²)
//
// for randomized Quicksort.
// Why does randomization improve expected behavior without eliminating
// the theoretical worst case?


// ============================================================
// Exercise 10 — Hash Lookup
// ============================================================
// TODO: Analyze a hash-table lookup under suitable hashing assumptions.
// State:
// 1. Expected complexity.
// 2. Possible pathological/worst-case behavior.
// 3. Why "always O(1)" is an unsafe statement without assumptions.


// ============================================================
// Exercise 11 — Dynamic Array Insertion
// ============================================================
// TODO: A dynamic array normally appends in O(1), but occasionally resizes
// and copies n elements.
//
// Determine:
// 1. Individual-operation worst case.
// 2. Amortized complexity over many insertions.
// 3. Why amortized complexity is not the same as average-case complexity.


// ============================================================
// Exercise 12 — Best Case Trap
// ============================================================
function exercise12(items, target) {
  for (let i = 0; i < items.length; i++) {
    if (items[i] === target) return true;
  }
  return false;
}

// TODO: Someone reports only O(1) because the target can be first.
// Explain why this is an incomplete performance description.


// ============================================================
// Exercise 13 — Adversarial Input
// ============================================================
// TODO: Construct an adversarial input for a linear search that forces the
// maximum number of comparisons.
// Explain why this matters for a public API accepting user-controlled data.


// ============================================================
// Exercise 14 — Backend API Validation
// ============================================================
function exercise14(ids) {
  for (const id of ids) {
    if (!isValidId(id)) return false;
  }
  return true;
}

function isValidId(id) {
  return typeof id === "string" && id.length > 0;
}

// TODO:
// Analyze best and worst cases.
// Then explain what additional workload information you would need to make
// a meaningful average-case claim.


// ============================================================
// Exercise 15 — Cache Hit/Miss
// ============================================================
// A backend request first checks a cache. On a hit it finishes quickly.
// On a miss it performs a database query.
//
// TODO:
// 1. Describe the best-case path.
// 2. Describe the worst-case path.
// 3. Explain why cache-hit probability matters for expected latency.
// 4. Explain why p99 latency may still be dominated by misses.


// ============================================================
// Exercise 16 — AI Retrieval
// ============================================================
// A retrieval system scores k candidates and then reranks the top r.
//
// TODO:
// 1. Express the dominant candidate-scoring cost in terms of k.
// 2. Explain how variable k creates different request costs.
// 3. Explain why a candidate cap can provide a stronger latency guarantee.
// 4. Identify one trade-off introduced by the cap.


// ============================================================
// Exercise 17 — Tail Latency
// ============================================================
// An API has:
//
// p50 = 20 ms
// p95 = 40 ms
// p99 = 900 ms
//
// TODO: Explain why the average or median alone could hide an important
// performance problem.
// What kind of input or system state might produce the long tail?


// ============================================================
// Exercise 18 — Choose the Relevant Case
// ============================================================
// Match the most important analysis focus:
//
// A. Public API with adversarial user input
// B. Offline batch analytics
// C. Interactive search API
// D. Randomized algorithm
//
// Options:
// 1. Worst-case/resource guarantees
// 2. Total throughput
// 3. Tail latency and distribution
// 4. Expected + worst-case behavior
//
// TODO: Provide the mapping and justify each choice.


// ============================================================
// Exercise 19 — Case-Aware Complexity Report
// ============================================================
function exercise19(items, target) {
  for (let i = 0; i < items.length; i++) {
    if (items[i] === target) {
      return i;
    }
  }
  return -1;
}

// TODO: Write a production-quality complexity report containing:
// - best case
// - average case under an explicit assumption
// - worst case
// - auxiliary space
// - relevant input constraint
// - one operational concern


// ============================================================
// Exercise 20 — Full Synthesis
// ============================================================
// Design an algorithm for a backend endpoint that receives n IDs and needs
// to determine whether any duplicate exists.
//
// Requirements:
// - Explain a brute-force approach.
// - Give best/average/worst-case behavior for the brute-force approach.
// - Design an optimized approach using an appropriate data structure.
// - State its best/average/worst-case assumptions.
// - State auxiliary-space complexity.
// - Explain what changes if IDs are adversarially controlled.
// - Explain the latency/memory trade-off.
// - Give the final interview-style explanation.


// ============================================================
// Completion Checklist
// ============================================================
// [ ] I can distinguish best, average, worst, expected, and amortized.
// [ ] I never use Big-O as a synonym for worst case.
// [ ] I state the probability distribution for average-case analysis.
// [ ] I can construct best-case and worst-case inputs.
// [ ] I understand early termination.
// [ ] I understand adversarial inputs.
// [ ] I can analyze randomized algorithms by expected and worst-case behavior.
// [ ] I can connect complexity cases to p95/p99 production latency.
// [ ] I can analyze backend and AI workloads using case-based reasoning.
