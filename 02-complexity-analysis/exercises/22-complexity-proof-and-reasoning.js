/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.22 — Complexity Proof & Reasoning
 *
 * Exercises are intentionally unsolved.
 */

// ============================================================
// Exercise 01 — Exact Counting
// ============================================================
function linearWork(n) {
  let count = 0;
  for (let i = 0; i < n; i++) {
    count++;
  }
  return count;
}

// TODO: Derive the exact operation count and simplify it to Θ notation.


// ============================================================
// Exercise 02 — Formal Big-O Proof
// ============================================================
// T(n) = 7n + 20

// TODO: Find valid constants c and n0 proving T(n) = O(n).


// ============================================================
// Exercise 03 — Formal Big-Theta Proof
// ============================================================
// T(n) = 5n + 30

// TODO: Prove T(n) = Θ(n) by establishing both upper and lower bounds.


// ============================================================
// Exercise 04 — Sequential Composition
// ============================================================
// Algorithm A costs Θ(n).
// Algorithm B costs Θ(n²).
// They execute sequentially.

// TODO: Derive the combined complexity and explain why the costs are added.


// ============================================================
// Exercise 05 — Nested Composition
// ============================================================
function nestedLogWork(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 1; j < n; j *= 2) {
      // constant work
    }
  }
}

// TODO: Prove the complexity instead of relying on the visual shape of the loops.


// ============================================================
// Exercise 06 — Triangular Sum
// ============================================================
function triangular(n) {
  let count = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      count++;
    }
  }
  return count;
}

// TODO: Write the summation and derive the tight bound.


// ============================================================
// Exercise 07 — Harmonic Bound
// ============================================================
function harmonic(n) {
  let count = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = i; j <= n; j += i) {
      count++;
    }
  }
  return count;
}

// TODO: Express the inner count as a function of i.
// Then derive the total Θ bound.


// ============================================================
// Exercise 08 — Geometric Loop
// ============================================================
function halve(n) {
  let count = 0;
  while (n > 1) {
    n = Math.floor(n / 2);
    count++;
  }
  return count;
}

// TODO: Prove the number of iterations is Θ(log n).


// ============================================================
// Exercise 09 — Multiple Parameters
// ============================================================
function compare(a, b) {
  let count = 0;
  for (let i = 0; i < a; i++) {
    for (let j = 0; j < b; j++) {
      count++;
    }
  }
  return count;
}

// TODO: Give the tight complexity in terms of a and b.
// Do not replace both with n unless a relationship is provided.


// ============================================================
// Exercise 10 — Parameter Relationship
// ============================================================
// T(N, M) = NM + N + M
// Constraint: M <= N

// TODO: Determine whether Θ(NM) is a valid simplification.
// Prove your answer.


// ============================================================
// Exercise 11 — Recurrence Expansion
// ============================================================
// T(n) = T(n / 2) + n, T(1) = Θ(1)

// TODO: Expand the recurrence and derive Θ(T(n)).


// ============================================================
// Exercise 12 — Recursion Tree
// ============================================================
// T(n) = 2T(n / 2) + n

// TODO: Draw the conceptual recursion tree in comments.
// Calculate work per level and number of levels.


// ============================================================
// Exercise 13 — Master Theorem
// ============================================================
// T(n) = 4T(n / 2) + n

// TODO: Identify a, b, f(n), compare f(n) with n^(log_b a),
// and derive the tight bound.


// ============================================================
// Exercise 14 — Lower Bound
// ============================================================
function findTarget(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// TODO:
// 1. Give worst-case complexity.
// 2. Give best-case complexity.
// 3. Explain an Ω bound for the problem when the array is unsorted.


// ============================================================
// Exercise 15 — Space Proof
// ============================================================
function recursiveSum(arr, i = 0) {
  if (i === arr.length) return 0;
  return arr[i] + recursiveSum(arr, i + 1);
}

// TODO: Analyze auxiliary stack space separately from input/output space.
// Explain why total calls and peak simultaneous stack frames are different.


// ============================================================
// Exercise 16 — Backend Cost Model
// ============================================================
// An endpoint performs:
//   authentication: Θ(1)
//   cache lookup: expected Θ(1)
//   one database scan over N records: Θ(N)
//   serialization of N records: Θ(N)

// TODO: Build the total first-order time model.
// Then identify the dominant term.


// ============================================================
// Exercise 17 — N+1 Proof
// ============================================================
// A request loads N parent records and performs one database round trip
// for every parent.
// Each round trip has fixed cost R.

// TODO:
// 1. Prove the number of round trips is Θ(N).
// 2. Express the round-trip component as a function of N and R.
// 3. Explain how batching changes the model.


// ============================================================
// Exercise 18 — Distributed Fan-Out
// ============================================================
// A request calls F independent downstream services.
// Their latencies are T1, T2, ..., TF.

// TODO:
// 1. Model sequential critical-path latency.
// 2. Model ideal parallel critical-path latency.
// 3. Explain why total downstream work does not become zero.
// 4. List coordination/network overheads omitted from the ideal model.


// ============================================================
// Exercise 19 — AI Retrieval Proof
// ============================================================
// Q queries each score K candidates.
// Each candidate comparison costs Θ(D).

// TODO:
// Derive the total complexity from first principles.
// Explain why Q, K, and D should remain separate parameters.


// ============================================================
// Exercise 20 — Full Complexity Defense
// ============================================================
// You are given an algorithm/system and asked in an interview:
// “Why is this Θ(N log N), and is that the best possible?”

// TODO:
// Construct a complete answer containing:
// 1. Input definition.
// 2. Cost model.
// 3. Operation count.
// 4. Upper-bound derivation.
// 5. Lower-bound reasoning.
// 6. Tight Θ conclusion if justified.
// 7. Auxiliary-space analysis.
// 8. Assumptions.
// 9. If applicable, a problem-level lower bound.
// 10. How the proof would change for a backend or AI workload.


// ============================================================
// Completion Checklist
// ============================================================
// [ ] I can define a cost model.
// [ ] I can count operations exactly.
// [ ] I can prove O bounds.
// [ ] I can prove Ω bounds.
// [ ] I can prove Θ bounds.
// [ ] I can distinguish loose and tight bounds.
// [ ] I can analyze sequential composition.
// [ ] I can analyze nested loops.
// [ ] I can derive dependent-loop sums.
// [ ] I can prove logarithmic loops.
// [ ] I can derive harmonic complexity.
// [ ] I can expand recurrences.
// [ ] I can use recursion trees.
// [ ] I know when Master Theorem applies.
// [ ] I can reason about lower bounds.
// [ ] I preserve multiple parameters.
// [ ] I can analyze auxiliary stack space.
// [ ] I can model backend DB/network costs.
// [ ] I can prove N+1 round-trip complexity.
// [ ] I can derive AI retrieval complexity.
// [ ] I can defend a complexity claim verbally.
