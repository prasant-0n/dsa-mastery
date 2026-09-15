/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.15 — Recurrence Relations
 *
 * Goal: translate recursive code into mathematical recurrences and solve them.
 * Exercises are intentionally unsolved.
 */

// ============================================================
// Exercise 01 — Linear Recursion
// ============================================================
function exercise01(n) {
  if (n <= 0) return;
  work();
  exercise01(n - 1);
}

function work() {}

// TODO:
// 1. Write T(n).
// 2. Solve it.
// 3. Analyze recursion depth and stack space.


// ============================================================
// Exercise 02 — Constant-Step Recursion
// ============================================================
function exercise02(n) {
  if (n <= 1) return;
  work();
  exercise02(n - 5);
}

// TODO: Derive the recurrence and Θ complexity.


// ============================================================
// Exercise 03 — Halving Recursion
// ============================================================
function exercise03(n) {
  if (n <= 1) return;
  work();
  exercise03(Math.floor(n / 2));
}

// TODO: Derive time and stack-space complexity.


// ============================================================
// Exercise 04 — Linear Work Per Level
// ============================================================
function exercise04(n) {
  if (n <= 1) return;

  for (let i = 0; i < n; i++) {
    work();
  }

  exercise04(Math.floor(n / 2));
}

// TODO: Write and solve T(n) = T(n/2) + Θ(n).


// ============================================================
// Exercise 05 — Two Halves
// ============================================================
function exercise05(n) {
  if (n <= 1) return;

  exercise05(Math.floor(n / 2));
  exercise05(Math.floor(n / 2));
}

// TODO: Derive the recurrence and solve it.


// ============================================================
// Exercise 06 — Merge-Sort Shape
// ============================================================
function exercise06(n) {
  if (n <= 1) return;

  exercise06(Math.floor(n / 2));
  exercise06(Math.floor(n / 2));

  for (let i = 0; i < n; i++) {
    work();
  }
}

// TODO: Write the recurrence and solve it using a recursion tree or Master Theorem.


// ============================================================
// Exercise 07 — Quadratic Work Per Level
// ============================================================
function exercise07(n) {
  if (n <= 1) return;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      work();
    }
  }

  exercise07(Math.floor(n / 2));
  exercise07(Math.floor(n / 2));
}

// TODO: Analyze T(n) = 2T(n/2) + Θ(n²).


// ============================================================
// Exercise 08 — Four Subproblems
// ============================================================
function exercise08(n) {
  if (n <= 1) return;

  for (let i = 0; i < n; i++) work();

  for (let k = 0; k < 4; k++) {
    exercise08(Math.floor(n / 2));
  }
}

// TODO: Derive and solve the recurrence.


// ============================================================
// Exercise 09 — Exponential Branching
// ============================================================
function exercise09(n) {
  if (n <= 0) return;

  exercise09(n - 1);
  exercise09(n - 1);
}

// TODO:
// 1. Write recurrence.
// 2. Solve time complexity.
// 3. Analyze maximum stack depth.


// ============================================================
// Exercise 10 — Fibonacci Shape
// ============================================================
function exercise10(n) {
  if (n <= 1) return n;
  return exercise10(n - 1) + exercise10(n - 2);
}

// TODO:
// 1. Write recurrence.
// 2. Give a simple exponential upper bound.
// 3. Explain overlapping recursive work.


// ============================================================
// Exercise 11 — Memoized Fibonacci
// ============================================================
function exercise11(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);

  const result = exercise11(n - 1, memo) + exercise11(n - 2, memo);
  memo.set(n, result);
  return result;
}

// TODO:
// 1. Explain why the call tree collapses into a state graph.
// 2. Analyze time.
// 3. Analyze auxiliary space.


// ============================================================
// Exercise 12 — Unequal Division
// ============================================================
function exercise12(n) {
  if (n <= 1) return;

  exercise12(Math.floor(n / 2));
  exercise12(Math.floor(n / 4));

  for (let i = 0; i < n; i++) work();
}

// TODO: Derive the recurrence and determine the asymptotic complexity.


// ============================================================
// Exercise 13 — Three Unequal Subproblems
// ============================================================
function exercise13(n) {
  if (n <= 1) return;

  exercise13(Math.floor(n / 2));
  exercise13(Math.floor(n / 3));
  exercise13(Math.floor(n / 6));

  for (let i = 0; i < n; i++) work();
}

// TODO: Analyze using a recursion-tree / level-work argument.


// ============================================================
// Exercise 14 — Recursive Call Inside a Loop
// ============================================================
function exercise14(n) {
  if (n <= 1) return;

  for (let i = 0; i < n; i++) {
    work();
  }

  exercise14(Math.floor(n / 2));
}

// TODO: Derive the recurrence, time, and stack space.


// ============================================================
// Exercise 15 — Nested Work + Recursion
// ============================================================
function exercise15(n) {
  if (n <= 1) return;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      work();
    }
  }

  exercise15(Math.floor(n / 2));
}

// TODO: Solve T(n) = T(n/2) + Θ(n²).


// ============================================================
// Exercise 16 — Recursive Tree Traversal
// ============================================================
function exercise16(node) {
  if (node == null) return;

  work();
  exercise16(node.left);
  exercise16(node.right);
}

// TODO:
// Let N be the number of nodes.
// 1. Write a recurrence for a balanced tree.
// 2. Explain why total traversal work is Θ(N).
// 3. Analyze stack space for balanced and skewed trees.


// ============================================================
// Exercise 17 — Backend Dependency Expansion
// ============================================================
function exercise17(node, visited = new Set()) {
  if (node == null || visited.has(node.id)) return;

  visited.add(node.id);
  work();

  for (const dependency of node.dependencies) {
    exercise17(dependency, visited);
  }
}

// TODO:
// Assume N unique nodes and E dependency edges.
// Analyze the traversal when each node/edge is processed once.
// Explain why visited-state tracking changes the computational model.


// ============================================================
// Exercise 18 — AI Search Tree
// ============================================================
function exercise18(state, depth) {
  if (depth === 0) return evaluate(state);

  let best = -Infinity;

  for (const nextState of generateCandidates(state)) {
    best = Math.max(best, exercise18(nextState, depth - 1));
  }

  return best;
}

function evaluate(state) {
  return 0;
}

function generateCandidates(state) {
  return [];
}

// TODO:
// Assume branching factor b and search depth d.
// 1. Model the recurrence.
// 2. Give the approximate time complexity.
// 3. Analyze DFS stack space.
// 4. Explain how beam width could change the practical search cost.


// ============================================================
// Exercise 19 — Recurrence Recognition
// ============================================================
// For each recurrence below, identify an appropriate solution method
// and derive the asymptotic complexity.

// A) T(n) = T(n - 1) + n
// B) T(n) = T(n / 2) + 1
// C) T(n) = 2T(n / 2) + n
// D) T(n) = 2T(n / 2) + n²
// E) T(n) = 4T(n / 2) + n
// F) T(n) = 2T(n - 1) + 1
// G) T(n) = T(n / 2) + T(n / 4) + n

// TODO: Solve all seven and state why the chosen method is appropriate.


// ============================================================
// Exercise 20 — Full Recurrence Synthesis
// ============================================================
function exercise20(n) {
  if (n <= 1) return 1;

  let total = 0;

  for (let i = 0; i < n; i++) {
    work();
  }

  total += exercise20(Math.floor(n / 2));
  total += exercise20(Math.floor(n / 2));
  total += exercise20(Math.floor(n / 4));

  return total;
}

// TODO:
// 1. Write the complete recurrence.
// 2. Identify whether the basic Master Theorem applies directly.
// 3. Use a recursion-tree/generalized argument to analyze it.
// 4. Analyze recursion depth.
// 5. Analyze auxiliary stack space.
// 6. Explain the difference between the call tree and unique-state graph
//    if identical subproblems were memoized.


// ============================================================
// Completion Checklist
// ============================================================
// [ ] I can translate recursive code into T(n).
// [ ] I include base cases.
// [ ] I count all recursive calls.
// [ ] I include non-recursive work.
// [ ] I can solve n-1 recurrences.
// [ ] I can solve n/k recurrences.
// [ ] I can build recursion trees.
// [ ] I can apply the Master Theorem correctly.
// [ ] I know when the basic Master Theorem does not apply.
// [ ] I distinguish recursion depth from total work.
// [ ] I can analyze recursive stack space.
// [ ] I understand exponential branching.
// [ ] I understand overlapping subproblems.
// [ ] I understand memoization as state sharing.
// [ ] I can analyze recursive tree/graph traversal.
// [ ] I can model backend dependency expansion.
// [ ] I can model AI search-tree complexity.
// [ ] I can explain recurrence solutions mathematically.
