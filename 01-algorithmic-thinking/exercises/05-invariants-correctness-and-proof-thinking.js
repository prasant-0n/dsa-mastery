// 01.5 — Invariants, Correctness & Proof Thinking
//
// Rules:
// 1. Do not only make the code pass examples.
// 2. For every algorithm, write its precondition, invariant, termination argument,
//    and postcondition.
// 3. For loops, explicitly identify initialization and maintenance.
// 4. For recursion, identify the base case, recursive assumption, recursive step,
//    and progress toward termination.
// 5. Keep solutions unsolved until you can explain the proof in your own words.

// -----------------------------------------------------------------------------
// Exercise 01 — Maximum Invariant
// -----------------------------------------------------------------------------
// Implement maxValue(nums).
//
// Then write:
// - precondition
// - invariant
// - initialization
// - maintenance
// - termination
// - postcondition
//
// Include the empty-array contract explicitly.

// -----------------------------------------------------------------------------
// Exercise 02 — Sum Invariant
// -----------------------------------------------------------------------------
// Implement sumArray(nums) using a loop.
//
// State precisely what `sum` means before every iteration.
// Prove the final value is the sum of the entire array.

// -----------------------------------------------------------------------------
// Exercise 03 — Linear Search Correctness
// -----------------------------------------------------------------------------
// Implement linearSearch(nums, target).
// Return the first matching index or -1.
//
// Your invariant must explain what the already-scanned region tells you.
// Explain why returning the first match is correct.

// -----------------------------------------------------------------------------
// Exercise 04 — Two-Pointer Pair Sum
// -----------------------------------------------------------------------------
// Given a sorted array, implement a two-pointer pair-sum search.
//
// Requirements:
// - State the candidate-region invariant.
// - Prove why moving left is safe when the sum is too small.
// - Prove why moving right is safe when the sum is too large.
// - Explain termination.

// -----------------------------------------------------------------------------
// Exercise 05 — Binary Search Proof
// -----------------------------------------------------------------------------
// Implement binarySearch(nums, target) for a sorted array.
//
// Write the proof using:
// - precondition,
// - candidate-region invariant,
// - initialization,
// - maintenance for each comparison,
// - termination,
// - postcondition.
//
// Include absent-target cases and duplicate values.

// -----------------------------------------------------------------------------
// Exercise 06 — Binary Search Bug Hunt
// -----------------------------------------------------------------------------
// Analyze an intentionally broken binary search.
//
// Example failure modes to investigate:
// - left = mid instead of mid + 1
// - right = mid instead of mid - 1
// - incorrect midpoint calculation
// - returning too early
// - using a stale candidate interval
//
// For each bug, identify the invariant or termination property that fails.

// -----------------------------------------------------------------------------
// Exercise 07 — Prefix Sum Invariant
// -----------------------------------------------------------------------------
// Implement buildPrefixSum(nums).
//
// Use the convention:
//   prefix[i] = sum of nums[0 ... i - 1]
//
// Prove that convention remains true after every construction step.
// Then implement rangeSum(prefix, left, right) and prove its formula.

// -----------------------------------------------------------------------------
// Exercise 08 — Sliding Window Proof
// -----------------------------------------------------------------------------
// For non-negative nums, implement the longest contiguous subarray whose sum
// is <= limit.
//
// Requirements:
// - State the window invariant.
// - Explain why adding a value cannot decrease the sum.
// - Explain why shrinking restores validity.
// - Explain why the left pointer never needs to move backward.
// - State the termination argument.

// -----------------------------------------------------------------------------
// Exercise 09 — Deliberately Break an Invariant
// -----------------------------------------------------------------------------
// Take a correct loop from an earlier exercise and introduce a subtle bug.
//
// Examples:
// - skip an index,
// - update state at the wrong time,
// - mutate the array during traversal,
// - use the wrong boundary.
//
// Then write:
// - intended invariant,
// - buggy operation,
// - exact point where the invariant becomes false,
// - corrected implementation.

// -----------------------------------------------------------------------------
// Exercise 10 — Recursive Sum Proof
// -----------------------------------------------------------------------------
// Implement recursive sumTo(n).
//
// Prove it using:
// - base case,
// - recursive assumption,
// - recursive step,
// - progress toward the base case.

// -----------------------------------------------------------------------------
// Exercise 11 — Recursive Binary Search Proof
// -----------------------------------------------------------------------------
// Implement binary search recursively.
//
// State what the recursive call is guaranteed to solve and why the selected
// smaller interval is sufficient.
//
// Explain why every recursive call strictly reduces the search interval.

// -----------------------------------------------------------------------------
// Exercise 12 — Heap Invariant
// -----------------------------------------------------------------------------
// Implement a MinHeap with:
// - insert(value)
// - peek()
// - extractMin()
//
// For every operation, state the heap invariant before and after the operation.
//
// Explain why the root is always the minimum value.

// -----------------------------------------------------------------------------
// Exercise 13 — Hash-Set Invariant
// -----------------------------------------------------------------------------
// Implement hasDuplicate(values) using a Set.
//
// State an invariant describing exactly what `seen` contains at the start of
// each iteration.
//
// Prove why finding an already-seen value proves a duplicate exists.

// -----------------------------------------------------------------------------
// Exercise 14 — Graph Traversal Invariant
// -----------------------------------------------------------------------------
// Implement BFS for an unweighted graph represented by an adjacency list.
//
// State:
// - what `visited` means,
// - what the queue means,
// - why revisiting a visited vertex is unnecessary,
// - why BFS discovers vertices in nondecreasing distance from the source.

// -----------------------------------------------------------------------------
// Exercise 15 — Recursive Nested Data
// -----------------------------------------------------------------------------
// Write a recursive function that sums all numeric values inside a nested
// structure containing arrays and objects.
//
// State the recursive contract:
// “This function returns ... for this subtree/value.”
//
// Prove that combining child results gives the correct result for the parent.

// -----------------------------------------------------------------------------
// Exercise 16 — Termination / Progress Measure
// -----------------------------------------------------------------------------
// For each algorithm below, identify a quantity that moves toward termination:
// - linear scan,
// - reverse scan,
// - binary search,
// - recursive factorial,
// - DFS,
// - BFS.
//
// Explain why the quantity cannot decrease forever without reaching a terminal
// condition under the stated finite-input assumptions.

// -----------------------------------------------------------------------------
// Exercise 17 — Greedy Counterexample
// -----------------------------------------------------------------------------
// Construct a problem where a natural greedy rule produces a non-optimal result.
//
// Then explain why “the local choice looks best” is not enough to establish
// correctness.
//
// Optional challenge: modify the problem so that the greedy strategy becomes
// correct and identify the structural property that changed.

// -----------------------------------------------------------------------------
// Exercise 18 — Backend State Invariant
// -----------------------------------------------------------------------------
// Design a small LRU-cache-like structure using a Map plus a linked list.
//
// Before implementing, state invariants such as:
// - every cached key maps to exactly one node,
// - every linked-list node corresponds to one cached key,
// - list order represents recency.
//
// After implementing get/set/eviction, verify that every operation preserves
// all invariants.

// -----------------------------------------------------------------------------
// Exercise 19 — AI Retrieval Invariant
// -----------------------------------------------------------------------------
// Model a Top-K candidate-retention stage for an AI retrieval pipeline.
//
// State an invariant describing exactly what the retained candidate set means
// after processing each incoming candidate.
//
// Explain why the eviction rule preserves the invariant.

// -----------------------------------------------------------------------------
// Exercise 20 — Full Correctness Write-Up
// -----------------------------------------------------------------------------
// Choose one optimized algorithm from 01.4 and write a complete correctness
// proof using this structure:
//
// ## Precondition
// ...
//
// ## Invariant
// ...
//
// ## Initialization
// ...
//
// ## Maintenance
// ...
//
// ## Termination
// ...
//
// ## Postcondition
// ...
//
// ## Complexity
// ...
//
// ## Why the Optimization Preserves Correctness
// ...
//
// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// [ ] I can define an invariant in plain language.
// [ ] I can distinguish preconditions from postconditions.
// [ ] I can prove a loop using initialization, maintenance, and termination.
// [ ] I can give a progress measure for a terminating algorithm.
// [ ] I can prove recursive correctness using a smaller-problem assumption.
// [ ] I can state the invariant behind binary search.
// [ ] I can prove when a two-pointer movement is safe.
// [ ] I can prove when sliding-window shrinking is safe.
// [ ] I can identify exactly where a buggy algorithm violates its invariant.
// [ ] I understand that complexity does not prove correctness.
// [ ] I can explain the correctness of an optimized algorithm in an interview.
// [ ] I can identify invariants in backend data structures.
// [ ] I can identify invariants in AI retrieval / ranking structures.
