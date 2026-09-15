/*
 * Phase 02 — Complexity Analysis
 * Chapter 02.17 — Auxiliary Space & Memory
 *
 * Exercises are intentionally unsolved.
 */

// ============================================================
// Exercise 01 — Linear Scan
// ============================================================
function findMax(items) {
  let max = items[0];

  for (let i = 1; i < items.length; i++) {
    if (items[i] > max) max = items[i];
  }

  return max;
}

// TODO: State input space, auxiliary space, output space, and time complexity.


// ============================================================
// Exercise 02 — Array Copy
// ============================================================
function clone(items) {
  return [...items];
}

// TODO: Determine additional memory and explain whether it is output or
// auxiliary memory under your chosen convention.


// ============================================================
// Exercise 03 — Duplicate Detection
// ============================================================
function hasDuplicate(items) {
  const seen = new Set();

  for (const item of items) {
    if (seen.has(item)) return true;
    seen.add(item);
  }

  return false;
}

// TODO:
// 1. Give worst-case time complexity.
// 2. Give auxiliary-space complexity.
// 3. Explain what causes the memory growth.


// ============================================================
// Exercise 04 — In-Place Reverse
// ============================================================
function reverseInPlace(items) {
  let left = 0;
  let right = items.length - 1;

  while (left < right) {
    [items[left], items[right]] = [items[right], items[left]];
    left++;
    right--;
  }
}

// TODO: Analyze time and auxiliary space.


// ============================================================
// Exercise 05 — Recursive Depth
// ============================================================
function countdown(n) {
  if (n === 0) return;
  countdown(n - 1);
}

// TODO:
// 1. Give time complexity.
// 2. Give maximum recursion-stack space.
// 3. Explain why the stack is not O(1).


// ============================================================
// Exercise 06 — Recursive Tree Traversal
// ============================================================
function traverse(node) {
  if (node == null) return;

  traverse(node.left);
  traverse(node.right);
}

// TODO:
// For a balanced tree and a skewed tree, determine:
// 1. Total time.
// 2. Maximum recursion depth.
// 3. Auxiliary stack space.


// ============================================================
// Exercise 07 — BFS Memory
// ============================================================
function bfs(root) {
  if (!root) return;

  const queue = [root];
  let head = 0;

  while (head < queue.length) {
    const node = queue[head++];

    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}

// TODO: Express queue memory in terms of maximum tree width.
// Compare it with DFS stack memory in terms of height.


// ============================================================
// Exercise 08 — Graph Visited Set
// ============================================================
function graphSearch(graph, start) {
  const visited = new Set([start]);
  const stack = [start];

  while (stack.length) {
    const node = stack.pop();

    for (const next of graph[node] ?? []) {
      if (!visited.has(next)) {
        visited.add(next);
        stack.push(next);
      }
    }
  }
}

// TODO: For V vertices and E edges, determine time and auxiliary space.
// Identify the dominant memory structures.


// ============================================================
// Exercise 09 — Adjacency Representations
// ============================================================
// A graph has V vertices and E edges.

// TODO:
// Compare auxiliary storage of:
// 1. Adjacency list.
// 2. Adjacency matrix.
// Explain which representation is generally preferable for sparse graphs.


// ============================================================
// Exercise 10 — Aliasing
// ============================================================
const a = { count: 1 };
const b = a;
const c = { ...a };

// TODO:
// 1. How many object allocations are represented by a, b, and c?
// 2. Which variables refer to the same object?
// 3. Explain why references should not be counted as independent objects.


// ============================================================
// Exercise 11 — Map Memory
// ============================================================
function frequencies(items) {
  const counts = new Map();

  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }

  return counts;
}

// TODO:
// If there are n input elements and u unique values, express auxiliary space
// in terms of u. Give the worst-case bound in terms of n.


// ============================================================
// Exercise 12 — Hidden Intermediate Arrays
// ============================================================
function transform(items) {
  return items.filter(x => x > 0).map(x => x * 2);
}

// TODO:
// Analyze the additional arrays created during execution.
// Discuss peak live memory rather than only final output size.


// ============================================================
// Exercise 13 — Streaming vs Materialization
// ============================================================
function materialize(items) {
  const result = [];
  for (const item of items) {
    result.push(process(item));
  }
  return result;
}

function process(item) {
  return item;
}

// TODO:
// 1. Determine output memory.
// 2. Explain how a streaming version could reduce working memory.
// 3. Distinguish output memory from auxiliary memory.


// ============================================================
// Exercise 14 — Concurrent Requests
// ============================================================
// A server handles C requests concurrently.
// Each request requires M bytes of working memory.

// TODO:
// 1. Derive total working-memory complexity.
// 2. Explain why a single-request memory benchmark can be misleading.
// 3. Identify another factor that could increase peak memory.


// ============================================================
// Exercise 15 — Cache Bound
// ============================================================
class SimpleCache {
  constructor(limit) {
    this.limit = limit;
    this.map = new Map();
  }

  set(key, value) {
    this.map.set(key, value);
  }
}

// TODO:
// If the cache correctly enforces at most K entries and each entry has bounded
// size, give its asymptotic memory bound.
// What changes if there is no bound on K?


// ============================================================
// Exercise 16 — Rate Limiter State
// ============================================================
// A rate limiter stores up to W timestamps for each active user.
// There are U active users.

// TODO:
// 1. Derive worst-case memory complexity.
// 2. Explain how a token-bucket representation can reduce per-user state.
// 3. Identify the trade-off.


// ============================================================
// Exercise 17 — Embedding Storage
// ============================================================
// There are N embeddings, each with D numeric dimensions.

// TODO:
// 1. Give asymptotic storage complexity.
// 2. Explain how changing numeric precision changes concrete bytes without
//    changing asymptotic complexity.
// 3. List metadata/index overheads that may also consume memory.


// ============================================================
// Exercise 18 — Beam Search Memory
// ============================================================
// Beam search keeps at most B active candidates.
// Each candidate requires S units of state.

// TODO:
// 1. Derive active-state memory.
// 2. Compare it conceptually with storing the complete search tree.
// 3. Explain the quality/compute trade-off introduced by beam width B.


// ============================================================
// Exercise 19 — Peak Live Memory
// ============================================================
// Algorithm A repeatedly allocates a temporary 50 MB buffer, processes it,
// releases it, and repeats.
// Algorithm B retains one 50 MB buffer while allocating another 50 MB buffer
// before releasing the first.

// TODO:
// Compare peak live memory for the two algorithms.
// Explain why total allocation volume and peak live memory are different.


// ============================================================
// Exercise 20 — Full Synthesis
// ============================================================
function solve(items) {
  const counts = new Map();
  const output = [];

  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }

  for (const item of items) {
    if (counts.get(item) === 1) {
      output.push(item);
    }
  }

  return output;
}

// TODO:
// 1. Analyze time complexity.
// 2. Analyze auxiliary space.
// 3. Analyze output space separately.
// 4. Give a worst-case concrete memory interpretation in terms of n.
// 5. Explain how streaming could change the memory profile.
// 6. Identify any runtime-specific allocation considerations in JavaScript.
// 7. Explain the time-space trade-off if the Map is removed.


// ============================================================
// Completion Checklist
// ============================================================
// [ ] I distinguish input, output, auxiliary, and total space.
// [ ] I can analyze recursion-stack memory.
// [ ] I can analyze Map/Set memory.
// [ ] I can compare BFS and DFS memory.
// [ ] I understand graph representation memory.
// [ ] I understand references and aliasing.
// [ ] I recognize hidden intermediate allocations.
// [ ] I can reason about peak live memory.
// [ ] I understand allocation volume vs live memory.
// [ ] I can use streaming to bound working memory.
// [ ] I can analyze concurrency × per-request memory.
// [ ] I can reason about cache and rate-limiter state.
// [ ] I can estimate vector storage.
// [ ] I understand beam-search memory.
// [ ] I can explain time-space trade-offs.
