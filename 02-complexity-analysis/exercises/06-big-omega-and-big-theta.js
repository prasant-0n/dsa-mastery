/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.6 — Big-Ω and Big-Θ
 *
 * Solve every exercise without looking at solutions.
 * For proof questions, explicitly identify constants and thresholds.
 * For algorithm questions, distinguish case analysis from asymptotic notation.
 */

// ============================================================
// Exercise 01 — Definitions
// ============================================================
// TODO: Define Big-O, Big-Ω, and Big-Θ in your own words.
// Then write the formal inequality for each notation.


// ============================================================
// Exercise 02 — Classify a Function
// ============================================================
// Given:
//
//     f(n) = 7n + 20
//
// TODO: Determine whether f(n) is O(n), Ω(n), and Θ(n).
// Justify each answer.


// ============================================================
// Exercise 03 — Loose Bounds
// ============================================================
// Given:
//
//     f(n) = n
//
// TODO:
// Determine whether each statement is true:
// 1. f(n) = O(n)
// 2. f(n) = O(n²)
// 3. f(n) = Ω(1)
// 4. f(n) = Ω(log n)
// 5. f(n) = Ω(n)
// 6. f(n) = Θ(n²)
// Explain why a valid O bound does not necessarily identify the tight class.


// ============================================================
// Exercise 04 — Prove Ω
// ============================================================
// Prove:
//
//     3n + 5 = Ω(n)
//
// TODO: Choose valid c and n₀ and prove the required inequality.


// ============================================================
// Exercise 05 — Prove Θ
// ============================================================
// Prove:
//
//     n² + 3n + 10 = Θ(n²)
//
// TODO:
// 1. Prove the O(n²) upper bound.
// 2. Prove the Ω(n²) lower bound.
// 3. State your constants and threshold.


// ============================================================
// Exercise 06 — Best Case Is Not Ω
// ============================================================
function exercise06(numbers, target) {
  for (const number of numbers) {
    if (number === target) return true;
  }

  return false;
}

// TODO:
// 1. Determine best-case time.
// 2. Determine worst-case time.
// 3. Explain why Ω does not mean "best case".
// 4. Give a tight bound for the worst-case function.


// ============================================================
// Exercise 07 — Worst Case Is Not the Definition of O
// ============================================================
// TODO: Explain why the statement
//
//     "Big-O means worst case"
//
// is an oversimplification.
// Give one concrete example where best-case and worst-case functions
// have different asymptotic bounds.


// ============================================================
// Exercise 08 — Sequential Work
// ============================================================
function exercise08(numbers) {
  for (const number of numbers) {
    void number;
  }

  for (const number of numbers) {
    void number;
  }
}

// TODO: Derive the exact iteration count up to constant details and
// classify the time using O, Ω, and Θ.


// ============================================================
// Exercise 09 — Triangular Loop
// ============================================================
function exercise09(numbers) {
  let count = 0;

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < i; j++) {
      count++;
    }
  }

  return count;
}

// TODO:
// 1. Derive the summation for the inner-loop executions.
// 2. Simplify it.
// 3. Give O, Ω, and Θ classifications.


// ============================================================
// Exercise 10 — Multiple Parameters
// ============================================================
function exercise10(a, b) {
  for (const x of a) {
    for (const y of b) {
      void x;
      void y;
    }
  }
}

// TODO: Let n = a.length and m = b.length.
// Determine the tight asymptotic bound in terms of both parameters.
// Explain why Θ(nm) is preferable to Θ(n²) without an additional constraint.


// ============================================================
// Exercise 11 — Algorithm vs Problem Lower Bound
// ============================================================
// TODO: Explain the difference between:
//
//     "This algorithm runs in Θ(n)."
//
// and:
//
//     "This problem requires Ω(n)."
//
// Which statement is stronger? Why?


// ============================================================
// Exercise 12 — Maximum Element
// ============================================================
// TODO: Consider finding the maximum element in an unsorted array.
// Explain why a comparison-based algorithm must inspect all elements
// in the worst case.
// Then state the problem's lower bound and the complexity of a simple scan.


// ============================================================
// Exercise 13 — Binary Search
// ============================================================
function exercise13(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);

    if (numbers[middle] === target) return middle;

    if (numbers[middle] < target) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return -1;
}

// TODO:
// 1. State the required input assumption.
// 2. Explain the search-space reduction.
// 3. Give the tight worst-case bound.
// 4. State O, Ω, and Θ for the worst-case comparison count.


// ============================================================
// Exercise 14 — Comparison Sorting
// ============================================================
// TODO: Explain the relationship between:
//
//     comparison sorting lower bound = Ω(n log n)
//     Merge Sort worst-case time = Θ(n log n)
//
// Why does this make Merge Sort asymptotically optimal in the
// comparison model?


// ============================================================
// Exercise 15 — Constants Matter in Practice
// ============================================================
// Consider:
//
//     A(n) = 100n
//     B(n) = n²
//
// TODO:
// 1. Classify both using Θ.
// 2. Find approximately where B becomes larger than A.
// 3. Explain why asymptotic superiority does not automatically mean
//    lower runtime for every finite input.


// ============================================================
// Exercise 16 — Multiple Bounds
// ============================================================
// For each function, determine whether the proposed bound is a valid
// O, Ω, and/or Θ bound.
//
// A. f(n) = n² + n, proposed g(n) = n
// B. f(n) = n² + n, proposed g(n) = n²
// C. f(n) = n log n, proposed g(n) = n²
// D. f(n) = n log n, proposed g(n) = n
//
// TODO: Explain each classification.


// ============================================================
// Exercise 17 — Case Analysis vs Notation
// ============================================================
function exercise17(numbers, target) {
  for (const number of numbers) {
    if (number === target) return true;
  }

  return false;
}

// TODO: Complete this table conceptually:
//
// Case        Growth
// Best        ?
// Worst       ?
//
// Then explain which mathematical notation can be used to describe
// each growth function.


// ============================================================
// Exercise 18 — Backend Lower Bound
// ============================================================
// An API must return k records to the client.
//
// TODO:
// 1. Explain why producing k outputs gives an Ω(k)-style output-sensitive
//    lower bound in a simple model.
// 2. Give conditions under which the implementation could be Θ(k).
// 3. Explain why the lower bound does not prove that every part of the
//    request takes Θ(k).


// ============================================================
// Exercise 19 — AI Retrieval
// ============================================================
// A retrieval stage evaluates N candidates and computes one constant-cost
// score for each candidate.
//
// TODO:
// 1. Give the tight time complexity.
// 2. If an upstream index reduces candidates to K, what is the reranking
//    cost if reranking is linear in K?
// 3. If reranking compares every pair of candidates, what is its cost?
// 4. Explain how lower-bound reasoning helps distinguish unavoidable work
//    from work caused by a poor retrieval design.


// ============================================================
// Exercise 20 — Full Synthesis
// ============================================================
function exercise20(numbers) {
  numbers.sort((a, b) => a - b);

  for (const number of numbers) {
    if (numbers.includes(number)) {
      void number;
    }
  }

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < i; j++) {
      void numbers[i];
      void numbers[j];
    }
  }
}

// TODO:
// 1. Define n.
// 2. Analyze sorting under the standard comparison-sort assumption.
// 3. Analyze includes() inside the loop.
// 4. Analyze the triangular nested loop.
// 5. Combine all costs.
// 6. Give the tightest useful Θ bound.
// 7. Give a valid O bound and Ω bound.
// 8. Explain which part dominates.
// 9. Explain the difference between the algorithm's bound and any
//    lower bound that might exist for the underlying problem.
