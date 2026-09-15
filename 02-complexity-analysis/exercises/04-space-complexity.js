/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.4 — Space Complexity
 *
 * Solve every exercise before checking any reference material.
 * For each problem, distinguish auxiliary space from output space
 * when that distinction matters.
 */

// ============================================================
// Exercise 01 — Constant Auxiliary Space
// ============================================================
function exercise01(numbers) {
  let max = -Infinity;

  for (const number of numbers) {
    if (number > max) max = number;
  }

  return max;
}

// TODO: Derive auxiliary space complexity.
// Explain why the input size does not cause additional retained storage.


// ============================================================
// Exercise 02 — Hash Storage
// ============================================================
function exercise02(numbers) {
  const seen = new Set();

  for (const number of numbers) {
    seen.add(number);
  }

  return seen;
}

// TODO:
// 1. What is the worst-case number of entries in seen?
// 2. What is auxiliary space complexity?
// 3. If the returned Set is considered output, explain the distinction.


// ============================================================
// Exercise 03 — Array Copy
// ============================================================
function exercise03(numbers) {
  const copy = [...numbers];
  return copy;
}

// TODO: Analyze additional space and explain why spread changes the
// memory requirements compared with merely reading numbers.


// ============================================================
// Exercise 04 — In-Place Reverse
// ============================================================
function exercise04(numbers) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    [numbers[left], numbers[right]] = [numbers[right], numbers[left]];
    left++;
    right--;
  }

  return numbers;
}

// TODO: Analyze auxiliary space. Consider the temporary destructuring
// assignment and explain why the asymptotic class remains unchanged.


// ============================================================
// Exercise 05 — Linear Output
// ============================================================
function exercise05(numbers) {
  const result = [];

  for (const number of numbers) {
    result.push(number * 2);
  }

  return result;
}

// TODO:
// 1. Analyze output space.
// 2. Analyze auxiliary space if result is considered output.
// 3. Explain why the classification can depend on the convention used.


// ============================================================
// Exercise 06 — Recursive Stack
// ============================================================
function exercise06(n) {
  if (n <= 0) return;
  exercise06(n - 1);
}

// TODO: Derive stack-space complexity from the maximum number of
// simultaneously active calls.


// ============================================================
// Exercise 07 — Branching Recursion
// ============================================================
function exercise07(n) {
  if (n <= 1) return n;
  return exercise07(n - 1) + exercise07(n - 2);
}

// TODO:
// 1. Describe the time growth qualitatively.
// 2. Derive the maximum recursion depth.
// 3. Explain why exponential time does not imply exponential space here.


// ============================================================
// Exercise 08 — Hidden Array Allocations
// ============================================================
function exercise08(numbers) {
  const doubled = numbers.map(x => x * 2);
  const filtered = doubled.filter(x => x > 10);
  return filtered;
}

// TODO: Analyze peak additional memory at a high level.
// Which arrays can be live simultaneously?
// Give the asymptotic auxiliary/output-space class.


// ============================================================
// Exercise 09 — Object Copies
// ============================================================
function exercise09(state) {
  const nextState = { ...state, active: true };
  return nextState;
}

// TODO: If state contains n properties, analyze the additional space
// needed for the copied object.


// ============================================================
// Exercise 10 — Two Large Structures
// ============================================================
function exercise10(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b);
  const seen = new Set(sorted);
  return { sorted, seen };
}

// TODO:
// Analyze the major retained allocations.
// Explain why the exact constant factor matters in production even though
// the asymptotic class may remain O(n).


// ============================================================
// Exercise 11 — Streaming vs Materialization
// ============================================================
// Design two conceptual approaches to process n records:
// A. Load all records into an array before processing.
// B. Process records using a fixed-size buffer.
//
// TODO: State the asymptotic retained memory for each approach and
// explain the practical trade-off.


// ============================================================
// Exercise 12 — Graph Representation
// ============================================================
// A graph has V vertices and E edges.
//
// TODO:
// 1. State the space complexity of an adjacency matrix.
// 2. State the space complexity of an adjacency list.
// 3. Explain which representation is generally more memory-efficient
//    for a sparse graph.


// ============================================================
// Exercise 13 — BFS State
// ============================================================
function exercise13(graph, start) {
  const visited = new Set([start]);
  const queue = [start];

  while (queue.length > 0) {
    const node = queue.shift();

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}

// TODO: Analyze the major memory components in terms of V.
// Ignore the cost of shift() for this exercise; this chapter is about space.


// ============================================================
// Exercise 14 — DFS Recursion
// ============================================================
function exercise14(graph, node, visited = new Set()) {
  if (visited.has(node)) return;

  visited.add(node);

  for (const neighbor of graph[node]) {
    exercise14(graph, neighbor, visited);
  }
}

// TODO: Analyze visited-set space and recursion-stack space.
// Express the overall space bound using V.


// ============================================================
// Exercise 15 — Cache Capacity
// ============================================================
// An in-memory cache stores at most C entries, where each entry has
// bounded-size metadata and payload.
//
// TODO: Derive retained-space complexity in terms of C.
// Explain why this memory exists even when individual cache lookups are O(1)
// expected time.


// ============================================================
// Exercise 16 — Concurrency Multiplier
// ============================================================
// One request requires O(B) temporary memory for its batch.
// R requests can execute concurrently.
//
// TODO: Build a high-level upper model for request-local memory.
// Explain why a per-request complexity bound is insufficient for capacity
// planning at high concurrency.


// ============================================================
// Exercise 17 — AI Candidate Memory
// ============================================================
// A retrieval system keeps K candidates, each represented by a D-dimensional
// numeric vector.
//
// TODO:
// 1. Derive the asymptotic memory requirement.
// 2. Explain how reducing K affects memory.
// 3. Explain why the numeric data type changes practical memory but not
//    necessarily the asymptotic class.


// ============================================================
// Exercise 18 — Allocation Volume vs Peak Memory
// ============================================================
function exercise18(n) {
  for (let i = 0; i < n; i++) {
    const temporary = { value: i };
    consume(temporary);
  }
}

function consume(value) {
  void value;
}

// TODO: Explain the difference between total allocation volume and peak
// simultaneously live memory in this example.
// Do not assume that large allocation volume automatically means O(n)
// retained space.


// ============================================================
// Exercise 19 — Time-Space Trade-Off
// ============================================================
// Problem: determine whether an array contains duplicates.
//
// Approach A: compare every pair.
// Approach B: store previously seen values in a Set.
//
// TODO:
// 1. Give time and auxiliary-space complexity for both.
// 2. Explain what resource Approach B spends to reduce time.
// 3. Give one backend scenario where the trade-off matters.


// ============================================================
// Exercise 20 — Full Synthesis
// ============================================================
// Design a function that receives n records and returns only records whose
// IDs are unique.
//
// Requirements:
// 1. Provide an implementation that uses a Set and preserves the first
//    occurrence of each ID.
// 2. Analyze time complexity.
// 3. Analyze auxiliary space.
// 4. Analyze output space separately.
// 5. Discuss a streaming version for datasets too large to materialize.
// 6. Explain how concurrency changes the practical memory model in a backend.

function uniqueRecords(records) {
  // TODO
}
