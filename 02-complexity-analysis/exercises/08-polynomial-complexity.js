/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.8 — Polynomial Complexity
 *
 * Solve without looking at solutions.
 * Derive the cost first; simplify only after the full cost is known.
 */

// ============================================================
// Exercise 01 — Polynomial or Not?
// ============================================================
// Classify each as polynomial-time or non-polynomial-time:
//
// A. O(n)
// B. O(n²)
// C. O(n³)
// D. O(n log n)
// E. O(2ⁿ)
// F. O(n!)
// G. O(n^10)
//
// TODO: Explain your reasoning, especially for O(n log n).


// ============================================================
// Exercise 02 — Quadratic Loops
// ============================================================
function exercise02(numbers) {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      void numbers[i];
      void numbers[j];
    }
  }
}

// TODO: Derive the tight complexity.


// ============================================================
// Exercise 03 — Triangular Work
// ============================================================
function exercise03(numbers) {
  let count = 0;

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < i; j++) {
      count++;
    }
  }

  return count;
}

// TODO:
// 1. Write the summation.
// 2. Simplify the summation.
// 3. Give the tight complexity.


// ============================================================
// Exercise 04 — Cubic Complexity
// ============================================================
function exercise04(n) {
  let count = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        count++;
      }
    }
  }

  return count;
}

// TODO: Derive the exact dominant growth and explain why it is cubic.


// ============================================================
// Exercise 05 — Four Dimensions
// ============================================================
function exercise05(n) {
  let count = 0;

  for (let a = 0; a < n; a++) {
    for (let b = 0; b < n; b++) {
      for (let c = 0; c < n; c++) {
        for (let d = 0; d < n; d++) {
          count++;
        }
      }
    }
  }

  return count;
}

// TODO: Give the complexity and explain the relationship between nesting
// depth and polynomial degree in this particular example.


// ============================================================
// Exercise 06 — Logarithmic × Linear
// ============================================================
function exercise06(numbers) {
  let count = 0;

  for (let i = 1; i < numbers.length; i *= 2) {
    for (const number of numbers) {
      void number;
      count++;
    }
  }

  return count;
}

// TODO: Explain why the answer is not O(n²).


// ============================================================
// Exercise 07 — Multiple Parameters
// ============================================================
function exercise07(A, B, C) {
  for (const a of A) {
    for (const b of B) {
      for (const c of C) {
        void a;
        void b;
        void c;
      }
    }
  }
}

// TODO: Let n = A.length, m = B.length, k = C.length.
// Derive the tight complexity without assuming n = m = k.


// ============================================================
// Exercise 08 — Polynomial Expression
// ============================================================
// Given:
//
//     T(n) = 7n^5 + 3n^3 + 20n + 100
//
// TODO:
// 1. Identify the dominant term.
// 2. Give the O bound.
// 3. Give the Ω bound.
// 4. Give the Θ bound.


// ============================================================
// Exercise 09 — Dependent Bound
// ============================================================
function exercise09(n) {
  let count = 0;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= i * i; j++) {
      count++;
    }
  }

  return count;
}

// TODO:
// 1. Write the summation.
// 2. Simplify its dominant term.
// 3. Give the tight complexity.
// Do not simply count the two loops as O(n²).


// ============================================================
// Exercise 10 — Dependent Bound With Square Root
// ============================================================
function exercise10(n) {
  let count = 0;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= Math.sqrt(i); j++) {
      count++;
    }
  }

  return count;
}

// TODO: Derive the tight asymptotic complexity.
// Use a summation or integral-style reasoning.


// ============================================================
// Exercise 11 — Combination Count
// ============================================================
// TODO: Explain why the number of unordered pairs among n elements is:
//
//     n(n - 1) / 2
//
// and why this is Θ(n²).


// ============================================================
// Exercise 12 — Triple Combinations
// ============================================================
// TODO: Explain why:
//
//     C(n, 3) = n(n - 1)(n - 2) / 6
//
// is Θ(n³).
// Connect this to a three-level brute-force search.


// ============================================================
// Exercise 13 — Naive Duplicate Detection
// ============================================================
function exercise13(numbers) {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] === numbers[j]) return true;
    }
  }

  return false;
}

// TODO:
// 1. Give worst-case time complexity.
// 2. Give auxiliary-space complexity.
// 3. Explain how a hash-based approach changes the time/space trade-off.


// ============================================================
// Exercise 14 — Quadratic Output
// ============================================================
function exercise14(numbers) {
  const pairs = [];

  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      pairs.push([numbers[i], numbers[j]]);
    }
  }

  return pairs;
}

// TODO:
// 1. Analyze the number of generated pairs.
// 2. Analyze output-space complexity.
// 3. Explain why an explicit algorithm producing every pair cannot have
//    asymptotically less work than the output size.


// ============================================================
// Exercise 15 — Polynomial Space
// ============================================================
function exercise15(n) {
  const matrix = Array.from(
    { length: n },
    () => Array(n).fill(0)
  );

  return matrix;
}

// TODO: Analyze the space complexity in terms of n.
// Explain why this is polynomial but potentially impractical at scale.


// ============================================================
// Exercise 16 — Time-Space Trade-Off
// ============================================================
// Strategy A:
//     Time  = Θ(n²)
//     Space = Θ(1)
//
// Strategy B:
//     Expected Time = Θ(n)
//     Space         = Θ(n)
//
// TODO:
// Explain when Strategy B is preferable and when Strategy A might still
// be acceptable.


// ============================================================
// Exercise 17 — Batch Size
// ============================================================
// A backend endpoint performs Θ(n²) validation work per request.
//
// TODO:
// 1. If n doubles, approximately how does the work change?
// 2. If n becomes 10 times larger, how does the work change?
// 3. Why can batch-size limits protect a backend from computational spikes?


// ============================================================
// Exercise 18 — Concurrent Requests
// ============================================================
// A request performs Θ(n²) CPU work.
// There are R concurrent requests with comparable input sizes.
//
// TODO: Build a high-level model for total CPU work in terms of R and n.
// Explain why concurrency must be considered together with algorithmic
// complexity in backend systems.


// ============================================================
// Exercise 19 — AI Pairwise Similarity
// ============================================================
// There are N embeddings, each with dimension d.
// A naive system computes similarity for every unordered pair and each
// similarity requires Θ(d) work.
//
// TODO:
// 1. Determine the number of pairs.
// 2. Derive the total time complexity.
// 3. Explain why reducing candidate count can be more powerful than
//    micro-optimizing the similarity calculation.


// ============================================================
// Exercise 20 — Full Synthesis
// ============================================================
function exercise20(numbers) {
  // Stage A — linear
  for (const number of numbers) {
    void number;
  }

  // Stage B — logarithmic × linear
  for (let i = 1; i < numbers.length; i *= 2) {
    for (const number of numbers) {
      void number;
    }
  }

  // Stage C — triangular quadratic
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < i; j++) {
      void numbers[i];
      void numbers[j];
    }
  }

  // Stage D — cubic
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      for (let k = 0; k < numbers.length; k++) {
        void numbers[i];
        void numbers[j];
        void numbers[k];
      }
    }
  }
}

// TODO:
// 1. Analyze every stage independently.
// 2. Write the complete combined cost.
// 3. Identify the dominant term.
// 4. Give the tightest useful Θ bound.
// 5. Give valid O and Ω bounds.
// 6. Explain why simply counting "four stages" is meaningless.
// 7. Explain which stage should receive optimization attention first.
