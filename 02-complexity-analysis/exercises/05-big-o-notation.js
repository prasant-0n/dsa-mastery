/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.5 — Big-O Notation
 *
 * Solve without looking at solutions.
 * For proof exercises, explicitly identify constants and a threshold.
 * For code exercises, derive the cost before giving the Big-O bound.
 */

// ============================================================
// Exercise 01 — Meaning of Big-O
// ============================================================
// In your own words, explain what it means to say:
//
//     f(n) = O(g(n))
//
// TODO: Give both a formal and an intuitive explanation.


// ============================================================
// Exercise 02 — Exact Cost to Big-O
// ============================================================
// Given:
//
//     T(n) = 7n + 20
//
// TODO:
// 1. Identify the dominant term.
// 2. Remove constants/lower-order terms.
// 3. Give the Big-O classification.


// ============================================================
// Exercise 03 — Polynomial Simplification
// ============================================================
// Given:
//
//     T(n) = 5n^3 + 100n^2 + 20n + 7
//
// TODO: Derive the asymptotic upper bound and explain every
// simplification step.


// ============================================================
// Exercise 04 — Sequential Work
// ============================================================
function exercise04(numbers) {
  for (const number of numbers) {
    console.log(number);
  }

  for (const number of numbers) {
    console.log(number * 2);
  }

  return numbers.length;
}

// TODO: Derive the total cost before simplifying it.


// ============================================================
// Exercise 05 — Nested Work
// ============================================================
function exercise05(numbers) {
  let count = 0;

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      count++;
    }
  }

  return count;
}

// TODO: Derive the Big-O time complexity from execution counts.


// ============================================================
// Exercise 06 — Multiple Parameters
// ============================================================
function exercise06(a, b) {
  for (const x of a) {
    for (const y of b) {
      if (x === y) return true;
    }
  }

  return false;
}

// TODO: Let n = a.length and m = b.length.
// Derive the worst-case Big-O bound.
// Explain why O(nm) is more precise than automatically writing O(n²).


// ============================================================
// Exercise 07 — Logarithmic Complexity
// ============================================================
function exercise07(n) {
  let count = 0;

  while (n > 1) {
    n = Math.floor(n / 2);
    count++;
  }

  return count;
}

// TODO: Explain why the number of iterations is O(log n).


// ============================================================
// Exercise 08 — Loose vs Tight Bounds
// ============================================================
// Suppose:
//
//     f(n) = n
//
// TODO:
// 1. Is f(n) = O(n²) true?
// 2. Is f(n) = O(n³) true?
// 3. Which is the tightest useful bound?
// 4. Explain why reporting O(n³) would be poor communication.


// ============================================================
// Exercise 09 — Big-O Proof
// ============================================================
// Prove:
//
//     3n + 5 = O(n)
//
// TODO: Find explicit values for c and n₀ and show the inequality.


// ============================================================
// Exercise 10 — Polynomial Big-O Proof
// ============================================================
// Prove:
//
//     n² + 3n + 10 = O(n²)
//
// TODO: Choose valid c and n₀ and justify the inequality.


// ============================================================
// Exercise 11 — Function Call Expansion
// ============================================================
function exercise11(numbers) {
  for (const number of numbers) {
    contains(numbers, number);
  }
}

function contains(numbers, target) {
  for (const number of numbers) {
    if (number === target) return true;
  }

  return false;
}

// TODO:
// 1. Analyze contains().
// 2. Analyze exercise11().
// 3. Explain why a function call cannot automatically be treated as O(1).


// ============================================================
// Exercise 12 — Branch Complexity
// ============================================================
function exercise12(numbers, condition) {
  if (condition) {
    for (const number of numbers) {
      console.log(number);
    }
  } else {
    for (let i = 0; i < numbers.length; i++) {
      for (let j = 0; j < numbers.length; j++) {
        console.log(numbers[i], numbers[j]);
      }
    }
  }
}

// TODO: Give the worst-case Big-O bound.
// Also state the best-case bound if condition is known at runtime.


// ============================================================
// Exercise 13 — Early Return
// ============================================================
function exercise13(numbers, target) {
  for (const number of numbers) {
    if (number === target) return true;
  }

  return false;
}

// TODO: Give best-case and worst-case time complexity.
// Explain which bound is normally reported when someone simply asks
// for the algorithm's Big-O time complexity.


// ============================================================
// Exercise 14 — Multiplication Through Helper Work
// ============================================================
function exercise14(numbers) {
  for (const number of numbers) {
    doWork(number, numbers);
  }
}

function doWork(number, numbers) {
  for (const value of numbers) {
    void number;
    void value;
  }
}

// TODO: Derive the total Big-O time complexity.


// ============================================================
// Exercise 15 — Built-In Operation
// ============================================================
function exercise15(numbers, target) {
  return numbers.includes(target);
}

// TODO: Under the normal array model, state the worst-case complexity.
// Explain why treating includes() as O(1) would be incorrect.


// ============================================================
// Exercise 16 — Combined Terms
// ============================================================
// Simplify each expression:
//
// A. O(n) + O(n²)
// B. O(n log n) + O(n)
// C. O(n²) + O(n³)
// D. O(log n) + O(n)
// E. O(nm) + O(n + m)
//
// TODO: Give the simplified bound and the reasoning for each.


// ============================================================
// Exercise 17 — Assumptions Matter
// ============================================================
// An algorithm has complexity O(n + m).
//
// TODO:
// Explain under what assumptions you might describe its growth using
// O(n) or O(max(n, m)), and why keeping O(n + m) may be preferable.


// ============================================================
// Exercise 18 — Expected vs Worst Case
// ============================================================
// A hash-table lookup is expected O(1) but can have O(n) worst-case
// behavior under a collision-heavy model.
//
// TODO: Explain why simply saying "Map lookup is O(1)" can be incomplete.
// State the assumptions that make expected O(1) useful.


// ============================================================
// Exercise 19 — Backend Complexity
// ============================================================
function exercise19(users, loadPermissions) {
  for (const user of users) {
    loadPermissions(user.id);
  }
}

// TODO:
// Let n = number of users and D = cost of one permission lookup.
// 1. Build a high-level cost model.
// 2. Explain why O(n) alone hides an important production assumption.
// 3. Explain how batching/caching could change the workload model.


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
// 2. Analyze sorting.
// 3. Analyze includes() inside the loop.
// 4. Analyze the triangular nested loop.
// 5. Add all costs before simplifying.
// 6. Give the tightest useful Big-O bound.
// 7. State assumptions about sort() and includes().
// 8. Explain your answer as if you were in a backend-engineering interview.
