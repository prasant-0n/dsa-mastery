/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.3 — Time Complexity
 *
 * Solve these without looking at solutions.
 * For every complexity question:
 * 1. Define the input-size parameter(s).
 * 2. Identify the operation being counted.
 * 3. Count how often it executes.
 * 4. Derive the cost before simplifying it.
 */

// ============================================================
// Exercise 01 — Constant Time
// ============================================================
function exercise01(numbers) {
  return numbers[0];
}

// TODO: Derive the time complexity and explain why it does not
// depend on the array length.


// ============================================================
// Exercise 02 — Linear Scan
// ============================================================
function exercise02(numbers) {
  let sum = 0;

  for (const number of numbers) {
    sum += number;
  }

  return sum;
}

// TODO: Derive T(n), then give the asymptotic time complexity.


// ============================================================
// Exercise 03 — Sequential Loops
// ============================================================
function exercise03(numbers) {
  for (const number of numbers) {
    console.log(number);
  }

  for (const number of numbers) {
    console.log(number * 2);
  }
}

// TODO: Analyze each loop independently, add the costs, and simplify.


// ============================================================
// Exercise 04 — Independent Nested Loops
// ============================================================
function exercise04(numbers) {
  let count = 0;

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      count++;
    }
  }

  return count;
}

// TODO: Derive the exact number of inner-loop executions and
// asymptotic time complexity.


// ============================================================
// Exercise 05 — Triangular Loop
// ============================================================
function exercise05(numbers) {
  let count = 0;

  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      count++;
    }
  }

  return count;
}

// TODO: Derive the exact iteration count n(n-1)/2 and simplify it.


// ============================================================
// Exercise 06 — Dependent Loop
// ============================================================
function exercise06(n) {
  let j = 0;
  let operations = 0;

  for (let i = 0; i < n; i++) {
    while (j < n) {
      j++;
      operations++;
    }
  }

  return operations;
}

// TODO: Explain why this is O(n), not O(n²).


// ============================================================
// Exercise 07 — Logarithmic Loop
// ============================================================
function exercise07(n) {
  let count = 0;

  while (n > 1) {
    n = Math.floor(n / 2);
    count++;
  }

  return count;
}

// TODO: Derive the number of iterations using a logarithm.


// ============================================================
// Exercise 08 — Growing Multiplicatively
// ============================================================
function exercise08(n) {
  let count = 0;

  for (let i = 1; i < n; i *= 2) {
    count++;
  }

  return count;
}

// TODO: Determine the time complexity and explain the role of i *= 2.


// ============================================================
// Exercise 09 — Multiple Parameters
// ============================================================
function exercise09(a, b) {
  let count = 0;

  for (const x of a) {
    for (const y of b) {
      if (x === y) count++;
    }
  }

  return count;
}

// TODO: Let n = a.length and m = b.length.
// Derive the complexity using both parameters.


// ============================================================
// Exercise 10 — Helper Function
// ============================================================
function exercise10(numbers) {
  for (const number of numbers) {
    if (contains(numbers, number)) {
      return true;
    }
  }

  return false;
}

function contains(numbers, target) {
  for (const number of numbers) {
    if (number === target) return true;
  }

  return false;
}

// TODO: Analyze contains() first, then exercise10().
// Explain why the final complexity is not O(n).


// ============================================================
// Exercise 11 — Add Sequential and Quadratic Work
// ============================================================
function exercise11(numbers) {
  for (const number of numbers) {
    console.log(number);
  }

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      console.log(numbers[i], numbers[j]);
    }
  }
}

// TODO: Write the combined cost before simplifying it.


// ============================================================
// Exercise 12 — Function Inside Loop
// ============================================================
function exercise12(numbers) {
  for (const number of numbers) {
    process(number, numbers);
  }
}

function process(number, numbers) {
  for (const value of numbers) {
    if (value === number) return true;
  }

  return false;
}

// TODO: Determine the complexity of the complete execution.


// ============================================================
// Exercise 13 — Built-In Operation Reasoning
// ============================================================
function exercise13(numbers, target) {
  return numbers.includes(target);
}

// TODO: Under the normal array model, explain the worst-case time
// complexity of includes().


// ============================================================
// Exercise 14 — Sorting Inside a Loop
// ============================================================
function exercise14(groups) {
  for (const group of groups) {
    group.sort((a, b) => a - b);
  }
}

// TODO:
// Let there be g groups and assume each group has at most k elements.
// Derive a useful upper-bound complexity.


// ============================================================
// Exercise 15 — Early Exit
// ============================================================
function exercise15(numbers, target) {
  for (const number of numbers) {
    if (number === target) {
      return true;
    }
  }

  return false;
}

// TODO: Analyze best-case and worst-case time complexity.
// Explain why early exit does not change the worst-case class.


// ============================================================
// Exercise 16 — Exponential Search Space
// ============================================================
function exercise16(n) {
  let count = 0;

  for (let mask = 0; mask < 2 ** n; mask++) {
    count++;
  }

  return count;
}

// TODO: Derive the time complexity in terms of n.


// ============================================================
// Exercise 17 — Factorial Search Space
// ============================================================
// Imagine an algorithm enumerates every permutation of n distinct
// elements and performs O(1) work for each permutation.
//
// TODO: State the number of permutations and the resulting time
// complexity.


// ============================================================
// Exercise 18 — Backend Complexity
// ============================================================
function exercise18(users, loadPermissions) {
  for (const user of users) {
    loadPermissions(user.id);
  }
}

// TODO:
// Assume there are n users and loadPermissions performs a database
// operation with cost D.
// Model the total work as a function of n and D.
// Explain why O(n) alone can be misleading in production.


// ============================================================
// Exercise 19 — AI Candidate Reranking
// ============================================================
function exercise19(candidates, score) {
  for (const candidate of candidates) {
    score(candidate);
  }
}

// TODO:
// Let K be the number of candidates and assume score() is O(1).
// 1. Derive the complexity.
// 2. If score() is O(d), where d is embedding dimension, derive
//    the complexity using K and d.


// ============================================================
// Exercise 20 — Full Synthesis
// ============================================================
function exercise20(numbers) {
  numbers.sort((a, b) => a - b);

  for (const number of numbers) {
    if (numbers.includes(number)) {
      // constant local work
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
// Analyze every stage separately:
// 1. Sorting
// 2. includes() inside the loop
// 3. Triangular nested loop
//
// Build the total complexity before simplifying it.
// Identify the dominant term and explain every assumption you make.
