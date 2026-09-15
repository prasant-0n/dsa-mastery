// 01.13 — State Transition & Invariant-Driven Algorithm Design
//
// All exercises are intentionally UNSOLVED.
// For every problem, explicitly write:
// 1. State
// 2. Invariant
// 3. Transition
// 4. Progress measure
// 5. Terminal condition
// 6. Result interpretation

// -----------------------------------------------------------------------------
// Exercise 01 — Running Maximum
// -----------------------------------------------------------------------------
// Design a linear scan that maintains the maximum seen so far.
//
// State: ?
// Invariant: ?
// Transition: ?
// Progress: ?
// Terminal state: ?
//
// Prove why the final state contains the maximum value.

// -----------------------------------------------------------------------------
// Exercise 02 — Binary Search State
// -----------------------------------------------------------------------------
// Write binary search for a sorted array.
//
// Explicitly define:
// - low/high state,
// - search-space invariant,
// - each transition,
// - progress measure,
// - termination condition.
//
// Explain why no valid candidate is discarded incorrectly.

// -----------------------------------------------------------------------------
// Exercise 03 — Two Sum on Sorted Input
// -----------------------------------------------------------------------------
// Given a sorted array and a target sum, design a two-pointer solution.
//
// Prove why moving left or right is safe for each comparison result.
//
// Your proof must identify the invariant over the remaining search interval.

// -----------------------------------------------------------------------------
// Exercise 04 — Sliding Window
// -----------------------------------------------------------------------------
// Given an array of positive integers and a target S, find the minimum-length
// contiguous subarray whose sum is at least S.
//
// Define the window state and invariant.
// Explain why both pointers only move forward.
//
// Do not use nested rescanning of the window.

// -----------------------------------------------------------------------------
// Exercise 05 — Duplicate Detection
// -----------------------------------------------------------------------------
// Detect whether an array contains duplicates using a Set.
//
// State: seen values.
//
// Prove the invariant:
// “seen contains exactly the values encountered before the current position.”
//
// Explain why the first repeated value proves the answer.

// -----------------------------------------------------------------------------
// Exercise 06 — Prefix Sum State
// -----------------------------------------------------------------------------
// Build a prefix-sum array.
//
// Define precisely what prefix[i] means.
//
// Derive the transition from prefix[i] to prefix[i + 1].
//
// Then implement constant-time range-sum queries using the constructed state.

// -----------------------------------------------------------------------------
// Exercise 07 — Monotonic Stack
// -----------------------------------------------------------------------------
// Given an array, solve the Next Greater Element problem using a monotonic stack.
//
// Define the stack invariant.
//
// Explain why popping an element cannot lose a future valid answer.
//
// Identify the progress measure and amortized movement of elements.

// -----------------------------------------------------------------------------
// Exercise 08 — Queue + Visited BFS
// -----------------------------------------------------------------------------
// Implement BFS on an adjacency-list graph.
//
// Define:
// - queue state,
// - visited state,
// - discovery invariant,
// - processing transition.
//
// Explain why every reachable vertex is eventually processed and why repeated
// processing is avoided.

// -----------------------------------------------------------------------------
// Exercise 09 — DFS Recursive State
// -----------------------------------------------------------------------------
// Implement recursive DFS.
//
// Define the recursive state and base/terminal state.
//
// Explain what must be true before entering a recursive call and after returning.
//
// Include a cycle-safe version for a general graph.

// -----------------------------------------------------------------------------
// Exercise 10 — Heap Restoration
// -----------------------------------------------------------------------------
// Implement min-heap insertion.
//
// State: array-backed heap.
// Invariant: parent <= child.
//
// Describe the transition that restores the invariant after insertion.
//
// Prove why bubbling upward terminates.

// -----------------------------------------------------------------------------
// Exercise 11 — Heap Removal
// -----------------------------------------------------------------------------
// Implement removeMin for a min-heap.
//
// Identify the state immediately after removing the root.
//
// Explain why that intermediate state may violate the invariant and how the
// downward-restoration transition repairs it.

// -----------------------------------------------------------------------------
// Exercise 12 — Backtracking State
// -----------------------------------------------------------------------------
// Generate all subsets of an array using backtracking.
//
// State:
// - current index,
// - current path.
//
// Define the invariant for path validity.
// Explain the choose/recurse/unchoose transition.
//
// Identify the progress measure.

// -----------------------------------------------------------------------------
// Exercise 13 — Backtracking Constraint State
// -----------------------------------------------------------------------------
// Solve a small N-Queens problem using backtracking.
//
// Define the minimal state required to determine whether a new queen is safe.
//
// State the invariant that must hold after every placement.
//
// Explain why undoing the placement restores the previous valid state.

// -----------------------------------------------------------------------------
// Exercise 14 — Memoization Through State Equivalence
// -----------------------------------------------------------------------------
// Implement Fibonacci recursively with memoization.
//
// Define what makes two recursive calls equivalent.
//
// Explain why their histories do not matter once the relevant state is identical.
//
// Compare the state-space and time complexity with naive recursion.

// -----------------------------------------------------------------------------
// Exercise 15 — DP State Definition
// -----------------------------------------------------------------------------
// Solve a simple climbing-stairs/counting problem using dynamic programming.
//
// Define dp[i] in one precise sentence.
//
// Derive the transition from smaller states.
//
// Explain why the state definition is sufficient to determine all future results.

// -----------------------------------------------------------------------------
// Exercise 16 — State Compression
// -----------------------------------------------------------------------------
// Take a DP solution that stores an entire array but where each state only depends
// on the previous two states.
//
// Rewrite it using O(1) auxiliary state.
//
// Prove why the discarded states are no longer required by future transitions.

// -----------------------------------------------------------------------------
// Exercise 17 — Backend Job State Machine
// -----------------------------------------------------------------------------
// Design the valid state transitions for:
//
// CREATED → QUEUED → PROCESSING → COMPLETED
//                         ↓
//                       FAILED
//
// Add retry support.
//
// Define:
// - valid states,
// - allowed transitions,
// - forbidden transitions,
// - retry invariant,
// - terminal states.

// -----------------------------------------------------------------------------
// Exercise 18 — Backend Rate Limiter State
// -----------------------------------------------------------------------------
// Design a token-bucket rate limiter.
//
// State:
// - token count,
// - last refill time,
// - capacity,
// - refill rate.
//
// Define the invariant and request transition.
//
// Explain why token count can never exceed capacity and how time changes state.

// -----------------------------------------------------------------------------
// Exercise 19 — AI Top-K Retrieval State
// -----------------------------------------------------------------------------
// Given a stream of scored candidates, maintain the best K candidates using a
// bounded min-heap.
//
// Define the invariant:
// “the heap contains the best K candidates seen so far.”
//
// Explain every insertion/replacement transition and prove why the final state is
// sufficient to return the global Top-K set.

// -----------------------------------------------------------------------------
// Exercise 20 — Debug the First Invalid State
// -----------------------------------------------------------------------------
// The following sliding-window pseudocode is suspected to be incorrect:
//
//   right = 0
//   left = 0
//   while right < n:
//       add(arr[right])
//       right++
//       if windowIsInvalid():
//           remove(arr[left])
//           left++
//
// Find a class of inputs where one removal is insufficient.
//
// Then:
// 1. State the intended invariant.
// 2. Find the first state where it becomes invalid.
// 3. Explain the broken transition.
// 4. Repair the transition.
// 5. Prove the repaired loop terminates.

// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// [ ] I can define algorithm state before writing code.
// [ ] I can state an invariant precisely.
// [ ] I can derive transitions from the invariant.
// [ ] I can identify a monotonic progress measure.
// [ ] I can prove termination.
// [ ] I can explain binary search as state-space reduction.
// [ ] I can explain sliding windows as state transitions.
// [ ] I can explain monotonic stacks as invariant restoration.
// [ ] I can explain BFS state using queue + visited.
// [ ] I can define heap restoration transitions.
// [ ] I can model backtracking as choose/recurse/unchoose.
// [ ] I can explain memoization using state equivalence.
// [ ] I can define DP state precisely.
// [ ] I can safely compress DP state when dependencies permit it.
// [ ] I can model backend workflows as state machines.
// [ ] I can model rate limiting as state + transition + invariant.
// [ ] I can maintain AI Top-K retrieval using an invariant.
// [ ] I can debug an algorithm by finding its first invalid state.
