// 01.14 — Algorithm Design Through Representation & Data-Structure Choice
//
// Rules:
// 1. Keep every exercise unsolved.
// 2. State the dominant operations before selecting a structure.
// 3. Include time, space, workload, and update/query trade-offs.
// 4. Do not choose a data structure merely because it is familiar.

// -----------------------------------------------------------------------------
// Exercise 01 — Operation Inventory
// -----------------------------------------------------------------------------
// Given a collection of user records, identify the best representation for each
// workload:
// A. random access by position
// B. membership by user ID
// C. user ID -> user record
// D. repeated minimum-priority retrieval
// E. prefix search over usernames
//
// Explain the reasoning for every choice.

// -----------------------------------------------------------------------------
// Exercise 02 — Array vs Set
// -----------------------------------------------------------------------------
// Given an array of N IDs and Q membership queries, compare:
// A. scanning the array for every query,
// B. building a Set once.
//
// Derive total expected time and auxiliary space for both approaches.
//
// Explain when the Set's build cost is justified.

// -----------------------------------------------------------------------------
// Exercise 03 — Frequency Representation
// -----------------------------------------------------------------------------
// Given an array of values, count the frequency of every value.
//
// Implement:
// A. a nested-loop approach,
// B. a Map-based approach.
//
// Explain exactly which repeated operation the Map representation removes.

// -----------------------------------------------------------------------------
// Exercise 04 — Linked List Location vs Update
// -----------------------------------------------------------------------------
// Insert a new node after a specified value in a singly linked list.
//
// Analyze separately:
// - locating the node,
// - changing the links.
//
// Explain why saying “linked-list insertion is O(1)” can be misleading.

// -----------------------------------------------------------------------------
// Exercise 05 — Stack Representation
// -----------------------------------------------------------------------------
// Determine whether a string of brackets is balanced.
//
// Explain why a stack represents the required state naturally.
//
// Identify the invariant that must hold after processing every character.

// -----------------------------------------------------------------------------
// Exercise 06 — Queue Representation
// -----------------------------------------------------------------------------
// Implement a queue without repeatedly shifting the entire JavaScript array.
//
// Compare your representation with:
//   array.shift()
//
// Analyze the likely complexity and practical allocation implications.

// -----------------------------------------------------------------------------
// Exercise 07 — Deque and Sliding Window
// -----------------------------------------------------------------------------
// Solve the sliding-window maximum problem using a deque.
//
// Explain what information the deque stores and what information it intentionally
// discards.
//
// State the invariant maintained by the deque.

// -----------------------------------------------------------------------------
// Exercise 08 — Heap vs Full Sorting
// -----------------------------------------------------------------------------
// Given N incoming numbers, repeatedly return the smallest number while allowing
// new numbers to arrive.
//
// Compare:
// A. maintaining a fully sorted array,
// B. maintaining a min-heap.
//
// Analyze insertion, minimum access, and overall workload cost.

// -----------------------------------------------------------------------------
// Exercise 09 — Top-K Representation
// -----------------------------------------------------------------------------
// Given N scores but only the largest K are required, compare:
// A. sort all N values,
// B. maintain a size-K heap.
//
// Explain why a heap stores only the ordering information necessary for the output.

// -----------------------------------------------------------------------------
// Exercise 10 — Hash Table vs Ordered Structure
// -----------------------------------------------------------------------------
// A backend service needs:
// - exact key lookup,
// - predecessor lookup,
// - range queries.
//
// Compare a hash table with an ordered tree-like structure.
//
// Explain which requirements favor each representation.

// -----------------------------------------------------------------------------
// Exercise 11 — Graph Representation
// -----------------------------------------------------------------------------
// Build both an adjacency matrix and adjacency list representation for a graph.
//
// Compare them for:
// - memory,
// - edge existence checks,
// - neighbor traversal.
//
// Test your reasoning on both sparse and dense graphs.

// -----------------------------------------------------------------------------
// Exercise 12 — Prefix Sum Transform
// -----------------------------------------------------------------------------
// Given an array and Q range-sum queries, implement:
// A. direct range summation,
// B. prefix sums.
//
// Derive total cost for both approaches.
//
// Explain prefix sums as a representation transform rather than merely a trick.

// -----------------------------------------------------------------------------
// Exercise 13 — Difference Array
// -----------------------------------------------------------------------------
// Given N values and many range-add operations, design a difference-array solution.
//
// Explain:
// - what is represented,
// - why updates become cheaper,
// - how the final array is reconstructed.

// -----------------------------------------------------------------------------
// Exercise 14 — Coordinate Compression
// -----------------------------------------------------------------------------
// Given a list containing very large integer coordinates, compress them into ranks.
//
// Requirements:
// - preserve ordering,
// - map equal values to the same rank,
// - support conversion back when necessary.
//
// Explain when coordinate compression enables an array-based algorithm.

// -----------------------------------------------------------------------------
// Exercise 15 — Static vs Dynamic Workload
// -----------------------------------------------------------------------------
// Compare representation choices for these two systems:
// A. 10 million records loaded once and queried 100 million times.
// B. 10 million records receiving millions of updates per hour.
//
// Discuss preprocessing, indexing, memory, and update costs.

// -----------------------------------------------------------------------------
// Exercise 16 — LRU Cache Representation
// -----------------------------------------------------------------------------
// Design the data structures needed for an LRU cache supporting:
// - get(key),
// - put(key, value),
// - eviction of the least recently used item.
//
// Explain why one simple structure is insufficient for efficient support of all
// required operations.

// -----------------------------------------------------------------------------
// Exercise 17 — Rate Limiter Representation
// -----------------------------------------------------------------------------
// Design state representations for:
// A. fixed-window rate limiting,
// B. sliding-window rate limiting,
// C. token-bucket rate limiting.
//
// Identify the state each representation must maintain and the trade-offs involved.

// -----------------------------------------------------------------------------
// Exercise 18 — Exact vs Approximate Deduplication
// -----------------------------------------------------------------------------
// Design two duplicate-detection systems:
// A. exact detection,
// B. approximate detection where false positives are acceptable.
//
// Compare Set/hash-based storage with a Bloom-filter-style representation.
//
// Explain what guarantee is lost in the approximate version.

// -----------------------------------------------------------------------------
// Exercise 19 — AI Retrieval Representation
// -----------------------------------------------------------------------------
// A vector database contains millions of D-dimensional vectors.
//
// Compare these conceptual representations:
// A. raw vectors + brute-force scan,
// B. indexed approximate retrieval.
//
// Analyze:
// - build cost,
// - query cost,
// - memory,
// - update complexity,
// - recall/quality guarantees.

// -----------------------------------------------------------------------------
// Exercise 20 — Representation Design Challenge
// -----------------------------------------------------------------------------
// Design the data representation for a backend/AI system of your choice.
//
// Your design must include:
// 1. logical entities,
// 2. required operations,
// 3. operation frequencies,
// 4. input/data constraints,
// 5. chosen representations,
// 6. invariants,
// 7. expected complexity,
// 8. memory cost,
// 9. build/query/update trade-offs,
// 10. failure or edge cases,
// 11. alternative representation,
// 12. reason the chosen representation wins.
//
// Defend the design as if you were answering an algorithm/system-design interview.

// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// [ ] I start with required operations before choosing a data structure.
// [ ] I consider operation frequency.
// [ ] I distinguish logical data from physical representation.
// [ ] I understand why arrays are strong for indexed sequences.
// [ ] I understand Set for membership.
// [ ] I understand Map for key-to-value relationships.
// [ ] I understand location cost vs linked-list update cost.
// [ ] I can choose stack, queue, or deque from the required ordering policy.
// [ ] I understand why a heap is useful for priority workloads.
// [ ] I can choose adjacency list vs matrix from graph density.
// [ ] I can use prefix sums as a representation transform.
// [ ] I understand difference arrays.
// [ ] I can explain coordinate compression.
// [ ] I can analyze preprocessing vs query cost.
// [ ] I can design a combined representation such as Map + linked list.
// [ ] I can reason about exact vs approximate representations.
// [ ] I can select a representation for backend caches/rate limiters.
// [ ] I can reason about AI vector retrieval indexes.
// [ ] I include memory and operational costs, not just Big-O time.
// [ ] I can defend a representation choice from first principles.
