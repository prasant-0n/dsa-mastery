/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.14 — Recursive Complexity
 *
 * Goal: translate recursive code into recurrences and derive time/space.
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

// TODO: Write the recurrence and derive time and stack-space complexity.


// ============================================================
// Exercise 02 — Halving Recursion
// ============================================================
function exercise02(n) {
  if (n <= 1) return;
  work();
  exercise02(Math.floor(n / 2));
}

// TODO: Derive time and recursion-depth complexity.


// ============================================================
// Exercise 03 — Linear Work Per Level
// ============================================================
function exercise03(n) {
  if (n <= 1) return;

  for (let i = 0; i < n; i++) work();
  exercise03(n - 1);
}

// TODO: Derive T(n) and solve it.


// ============================================================
// Exercise 04 — Binary Branching
// ============================================================
function exercise04(n) {
  if (n <= 1) return;
  exercise04(n - 1);
  exercise04(n - 1);
}

// TODO: Derive time complexity and maximum recursion depth.
// Explain why the two are different.


// ============================================================
// Exercise 05 — Fibonacci
// ============================================================
function exercise05(n) {
  if (n <= 1) return n;
  return exercise05(n - 1) + exercise05(n - 2);
}

// TODO: Write the recurrence and give an exponential upper bound.
// Explain the repeated-subproblem problem.


// ============================================================
// Exercise 06 — Memoized Fibonacci
// ============================================================
function exercise06(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);

  const result = exercise06(n - 1, memo) + exercise06(n - 2, memo);
  memo.set(n, result);
  return result;
}

// TODO: Derive time and auxiliary-space complexity.
// Explain why memoization changes the computational structure.


// ============================================================
// Exercise 07 — Divide and Conquer
// ============================================================
function exercise07(n) {
  if (n <= 1) return;
  exercise07(Math.floor(n / 2));
  exercise07(Math.floor(n / 2));
  for (let i = 0; i < n; i++) work();
}

// TODO: Write T(n) and solve it.


// ============================================================
// Exercise 08 — Four Half-Sized Calls
// ============================================================
function exercise08(n) {
  if (n <= 1) return;
  for (let k = 0; k < 4; k++) {
    exercise08(Math.floor(n / 2));
  }
}

// TODO: Derive time and recursion-depth complexity.


// ============================================================
// Exercise 09 — Uneven Recursion
// ============================================================
function exercise09(n) {
  if (n <= 1) return;
  exercise09(Math.floor(n / 2));
  exercise09(Math.floor(n / 4));
  for (let i = 0; i < n; i++) work();
}

// TODO: Determine the asymptotic complexity.
// Use a recursion-tree or bounding argument.


// ============================================================
// Exercise 10 — Recursion With a Loop
// ============================================================
function exercise10(n) {
  if (n <= 1) return;

  for (let i = 0; i < n * n; i++) work();
  exercise10(n - 1);
}

// TODO: Write the recurrence and solve it.


// ============================================================
// Exercise 11 — Binary Search Recursion
// ============================================================
function exercise11(items, target, left = 0, right = items.length - 1) {
  if (left > right) return -1;

  const mid = Math.floor((left + right) / 2);
  if (items[mid] === target) return mid;
  if (items[mid] < target) {
    return exercise11(items, target, mid + 1, right);
  }
  return exercise11(items, target, left, mid - 1);
}

// TODO: Derive best/worst-case time and stack-space complexity.


// ============================================================
// Exercise 12 — Tail Recursion
// ============================================================
function exercise12(n, acc = 0) {
  if (n <= 0) return acc;
  return exercise12(n - 1, acc + n);
}

// TODO: Analyze time and actual JavaScript recursion-stack behavior.
// Do not assume general tail-call optimization.


// ============================================================
// Exercise 13 — Recursive Array Copy
// ============================================================
function exercise13(items) {
  if (items.length <= 1) return items;

  const mid = Math.floor(items.length / 2);
  const left = items.slice(0, mid);
  const right = items.slice(mid);

  return [...exercise13(left), ...exercise13(right)];
}

// TODO: Analyze time and auxiliary memory, including slicing/copying.


// ============================================================
// Exercise 14 — Tree Traversal
// ============================================================
function exercise14(node) {
  if (!node) return;

  work();
  exercise14(node.left);
  exercise14(node.right);
}

// TODO: If the tree contains N nodes, derive time complexity.
// Then analyze maximum stack depth for a balanced tree and a degenerate tree.


// ============================================================
// Exercise 15 — Graph DFS
// ============================================================
function exercise15(node, visited = new Set()) {
  if (!node || visited.has(node)) return;

  visited.add(node);

  for (const next of node.neighbors) {
    exercise15(next, visited);
  }
}

// TODO: Express time in terms of V and E.
// Explain why visited is necessary for cyclic graphs.


// ============================================================
// Exercise 16 — Search Tree
// ============================================================
function exercise16(state, depth) {
  if (depth === 0) return;

  for (const next of generateNextStates(state)) {
    exercise16(next, depth - 1);
  }
}

function generateNextStates(state) {
  return [];
}

// TODO: If each state has at most b children and maximum depth is d,
// derive an upper bound on total calls.


// ============================================================
// Exercise 17 — Memoized State Search
// ============================================================
function exercise17(state, memo = new Map()) {
  const key = serialize(state);
  if (memo.has(key)) return memo.get(key);

  let result = baseResult(state);

  for (const next of generateNextStates(state)) {
    result = combine(result, exercise17(next, memo));
  }

  memo.set(key, result);
  return result;
}

function serialize(state) { return JSON.stringify(state); }
function baseResult(state) { return 0; }
function combine(a, b) { return a + b; }

// TODO: If there are S unique states and each has at most b transitions,
// derive a time bound assuming memo lookup and serialization are O(1).
// Then explain how non-constant serialization changes the analysis.


// ============================================================
// Exercise 18 — Backend Dependency Expansion
// ============================================================
function exercise18(job, depth, visited = new Set()) {
  if (!job || depth === 0 || visited.has(job.id)) return;

  visited.add(job.id);

  for (const dependency of job.dependencies) {
    exercise18(dependency, depth - 1, visited);
  }
}

// TODO:
// 1. Give a naive b^d search-tree bound.
// 2. Explain how visited changes the analysis when dependencies overlap.
// 3. Identify a practical backend risk from unbounded depth/branching.


// ============================================================
// Exercise 19 — AI Search Tree
// ============================================================
function exercise19(state, depth, beamWidth) {
  if (depth === 0) return;

  const candidates = generateNextStates(state)
    .slice(0, beamWidth);

  for (const next of candidates) {
    exercise19(next, depth - 1, beamWidth);
  }
}

// TODO:
// If beam width is b and depth is d, derive the search-tree upper bound.
// Explain how beam width changes exponential growth compared with unrestricted
// branching.


// ============================================================
// Exercise 20 — Full Recurrence Synthesis
// ============================================================
function exercise20(n) {
  if (n <= 1) return;

  exercise20(Math.floor(n / 2));
  exercise20(Math.floor(n / 2));

  for (let i = 0; i < n; i++) {
    work();
  }

  for (let i = 0; i < n * n; i++) {
    work();
  }
}

// TODO:
// 1. Write the recurrence.
// 2. Identify the critical recursive-tree term.
// 3. Identify the dominant non-recursive work.
// 4. Solve the recurrence.
// 5. Derive recursion-depth space.
// 6. Explain which change would most improve the algorithm and why.


// ============================================================
// Completion Checklist
// ============================================================
// [ ] I can translate recursive code into a recurrence.
// [ ] I identify base cases correctly.
// [ ] I count recursive branches.
// [ ] I determine subproblem sizes.
// [ ] I include non-recursive work.
// [ ] I can solve linear recursion.
// [ ] I can solve logarithmic recursion.
// [ ] I can analyze divide-and-conquer recursion.
// [ ] I understand exponential branching.
// [ ] I understand Fibonacci's repeated states.
// [ ] I understand memoization as state sharing.
// [ ] I distinguish total calls from recursion depth.
// [ ] I analyze recursive stack space.
// [ ] I account for copying/allocation.
// [ ] I understand graph traversal with visited state.
// [ ] I can analyze b^d search trees.
// [ ] I can apply recursion analysis to backend workloads.
// [ ] I can apply recursion/search-tree reasoning to AI systems.
// [ ] I can use recursion trees or recurrences instead of guessing.
