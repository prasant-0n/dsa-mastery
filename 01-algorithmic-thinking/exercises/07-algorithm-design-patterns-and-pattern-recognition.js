// 01.7 — Algorithm Design Patterns & Pattern Recognition
//
// Rules:
// 1. Do not select a pattern from keywords alone.
// 2. For every selected pattern, write the structural clue and invariant.
// 3. State the assumptions that make the pattern valid.
// 4. When possible, implement both a baseline and the pattern-based solution.
// 5. Keep solutions unsolved until you can justify the pattern from first principles.

// -----------------------------------------------------------------------------
// Exercise 01 — Pattern Extraction
// -----------------------------------------------------------------------------
// For each problem statement below, ignore the story and identify:
// - input,
// - output,
// - dominant operation,
// - constraints,
// - useful structure,
// - candidate pattern.
//
// A. Detect duplicate user IDs.
// B. Find the longest valid substring.
// C. Repeatedly return the highest-priority job.
// D. Search for a value in sorted data.
// E. Find connected users through relationships.
// F. Answer thousands of range-sum queries.

// -----------------------------------------------------------------------------
// Exercise 02 — Linear Scan
// -----------------------------------------------------------------------------
// Implement three linear-scan algorithms:
// - maximum value,
// - first matching value,
// - count values satisfying a predicate.
//
// For each, state the invariant and explain why no stronger pattern is required.

// -----------------------------------------------------------------------------
// Exercise 03 — Two Pointers
// -----------------------------------------------------------------------------
// Implement:
// - palindrome check,
// - pair sum in a sorted array,
// - in-place array reversal.
//
// For each, identify exactly why two pointers are safe.
//
// Then create one array problem where two pointers would be an incorrect choice
// and explain why.

// -----------------------------------------------------------------------------
// Exercise 04 — Sliding Window
// -----------------------------------------------------------------------------
// Implement a fixed-size window calculation.
//
// Then implement a variable-size window for a problem involving non-negative
// values.
//
// Finally, create a similar-looking problem containing negative values and explain
// why the same sliding-window reasoning does not automatically apply.

// -----------------------------------------------------------------------------
// Exercise 05 — Hashing
// -----------------------------------------------------------------------------
// Implement:
// - duplicate detection,
// - frequency counting,
// - Two Sum,
// - grouping records by key.
//
// For each, state what the Map/Set contains after processing the first i items.

// -----------------------------------------------------------------------------
// Exercise 06 — Prefix / Suffix
// -----------------------------------------------------------------------------
// Implement:
// - prefix sums,
// - suffix maximums,
// - product except self using prefix/suffix information.
//
// For each, state the exact meaning of every stored entry.

// -----------------------------------------------------------------------------
// Exercise 07 — Binary Search
// -----------------------------------------------------------------------------
// Implement binary search over a sorted array.
//
// Then answer:
// - What is the search space?
// - What property lets you eliminate half?
// - What is the invariant?
// - What proves termination?

// -----------------------------------------------------------------------------
// Exercise 08 — Sort + Scan
// -----------------------------------------------------------------------------
// Solve duplicate detection two ways:
// 1. Set.
// 2. Sort + adjacent scan.
//
// Compare:
// - time,
// - space,
// - mutation,
// - whether sorted order can be reused later.

// -----------------------------------------------------------------------------
// Exercise 09 — Heap / Priority Queue
// -----------------------------------------------------------------------------
// Implement a min-heap from scratch.
//
// Use it to solve:
// - repeatedly process the smallest item,
// - return Top-K largest values.
//
// Explain why complete sorting is unnecessary for the Top-K version.

// -----------------------------------------------------------------------------
// Exercise 10 — Divide and Conquer
// -----------------------------------------------------------------------------
// Implement merge sort.
//
// Identify:
// - decomposition,
// - recursive subproblems,
// - combine step,
// - base case,
// - recurrence,
// - correctness argument.

// -----------------------------------------------------------------------------
// Exercise 11 — Memoization
// -----------------------------------------------------------------------------
// Take a recursive problem with overlapping subproblems and implement:
// - naive recursion,
// - memoized recursion.
//
// Draw the repeated-state structure and define the memo table's invariant.

// -----------------------------------------------------------------------------
// Exercise 12 — Backtracking
// -----------------------------------------------------------------------------
// Implement a permutation or subset generator.
//
// Explicitly model:
// choose → explore → undo.
//
// State the path invariant before each recursive call.
// Then add one safe pruning rule.

// -----------------------------------------------------------------------------
// Exercise 13 — Greedy vs DP
// -----------------------------------------------------------------------------
// Choose a small optimization problem where a natural greedy rule seems plausible.
//
// 1. Implement the greedy approach.
// 2. Find or construct a counterexample if it is incorrect.
// 3. Explain why the local choice fails globally.
// 4. Solve the problem with DP or another correct approach.

// -----------------------------------------------------------------------------
// Exercise 14 — Graph Modeling
// -----------------------------------------------------------------------------
// Convert each scenario into a graph model:
// - social connections,
// - service dependencies,
// - road network,
// - workflow states.
//
// Identify:
// - vertices,
// - edges,
// - directed/undirected nature,
// - weighted/unweighted nature,
// - likely traversal or graph algorithm.

// -----------------------------------------------------------------------------
// Exercise 15 — Monotonic Stack
// -----------------------------------------------------------------------------
// Implement nextGreaterElement for an array.
//
// First identify the brute-force approach.
// Then derive the monotonic-stack approach by asking which previous candidates
// become permanently useless when a larger value arrives.
//
// State the stack invariant.

// -----------------------------------------------------------------------------
// Exercise 16 — Union-Find
// -----------------------------------------------------------------------------
// Implement Disjoint Set Union with:
// - find,
// - union,
// - connected.
//
// Add path compression and union by size/rank.
//
// State the component-membership invariant.

// -----------------------------------------------------------------------------
// Exercise 17 — Search on the Answer
// -----------------------------------------------------------------------------
// Choose a problem where a numeric answer has a monotonic feasibility predicate.
//
// Implement:
// - canSolve(answer),
// - brute-force search over possible answers,
// - binary search over the answer space.
//
// Prove the false → true or true → false transition.

// -----------------------------------------------------------------------------
// Exercise 18 — Coordinate Compression
// -----------------------------------------------------------------------------
// Given a collection of huge integer coordinates, compress them into ranks while
// preserving relative ordering.
//
// Explain:
// - why the original coordinate magnitude is unnecessary,
// - how duplicates should be handled,
// - where compressed indices can be useful.

// -----------------------------------------------------------------------------
// Exercise 19 — Offline Processing
// -----------------------------------------------------------------------------
// Design a problem involving many queries where operations can safely be reordered.
//
// Compare:
// - processing in arrival order,
// - sorting/batching operations first.
//
// Explain how the reordered computation preserves the required output contract.

// -----------------------------------------------------------------------------
// Exercise 20 — Pattern Confusion Test
// -----------------------------------------------------------------------------
// For each pair, explain the difference and give one problem where each is valid:
// - two pointers vs sliding window,
// - hashing vs sorting,
// - binary search vs two pointers,
// - DFS vs BFS,
// - greedy vs DP,
// - heap vs full sorting.

// -----------------------------------------------------------------------------
// Exercise 21 — Pattern Failure
// -----------------------------------------------------------------------------
// Take five familiar problem statements and deliberately reject the most obvious
// pattern.
//
// For each:
// - state the tempting pattern,
// - identify its missing assumption,
// - construct a counterexample,
// - choose a better model.

// -----------------------------------------------------------------------------
// Exercise 22 — Backend Pattern Mapping
// -----------------------------------------------------------------------------
// Map each backend requirement to an algorithmic structure/pattern and justify it:
// - request deduplication,
// - cache lookup,
// - LRU eviction,
// - rate limiting,
// - Top-K API results,
// - job scheduling,
// - dependency execution,
// - cursor pagination.
//
// For every answer include the key invariant.

// -----------------------------------------------------------------------------
// Exercise 23 — AI Pattern Mapping
// -----------------------------------------------------------------------------
// Map these AI-engineering requirements to algorithmic patterns:
// - nearest-neighbor retrieval,
// - Top-K candidate retention,
// - RAG candidate generation,
// - reranking,
// - beam-style state search,
// - embedding deduplication,
// - large-scale candidate filtering.
//
// Explain what computation is being reduced or organized.

// -----------------------------------------------------------------------------
// Exercise 24 — Full Pattern Recognition Challenge
// -----------------------------------------------------------------------------
// Take an unfamiliar problem you have never solved.
//
// Before writing code, produce:
//
// 1. Problem model
// 2. Input/output contract
// 3. Constraints
// 4. Dominant operation
// 5. Repeated work
// 6. Structural properties
// 7. Candidate patterns
// 8. Rejected patterns and why
// 9. Chosen pattern
// 10. Invariant
// 11. Correctness argument
// 12. Complexity
//
// Only then implement the solution.

// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// [ ] I can identify the computational structure beneath a problem story.
// [ ] I use constraints before choosing a pattern.
// [ ] I can state the invariant behind the pattern I choose.
// [ ] I know the assumptions required by two pointers.
// [ ] I know the assumptions required by sliding window.
// [ ] I can distinguish hashing from sorting trade-offs.
// [ ] I understand binary search as search-space elimination.
// [ ] I know when a heap is better than full sorting.
// [ ] I can identify overlapping subproblems.
// [ ] I can identify state-space search and backtracking.
// [ ] I do not assume greedy is correct without proof.
// [ ] I can recognize graph-shaped problems.
// [ ] I can recognize monotonic-stack and Union-Find structures.
// [ ] I understand binary search on the answer.
// [ ] I can reject a tempting pattern when its assumptions do not hold.
// [ ] I can map backend and AI requirements to algorithmic structures.
// [ ] I can derive a pattern from first principles rather than keywords.
