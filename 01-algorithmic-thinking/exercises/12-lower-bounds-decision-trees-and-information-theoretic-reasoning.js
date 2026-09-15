// 01.12 — Lower Bounds, Decision Trees & Information-Theoretic Reasoning
//
// Rules:
// 1. Keep all exercises unsolved.
// 2. Distinguish algorithm upper bounds from problem lower bounds.
// 3. State the computational model before claiming a lower bound.
// 4. Prefer proof/reasoning over benchmark evidence.
// 5. Identify assumptions that could change the lower bound.

// -----------------------------------------------------------------------------
// Exercise 01 — Upper vs Lower Bound
// -----------------------------------------------------------------------------
// Choose an algorithm with runtime O(n^2) for a problem that you suspect can be
// solved faster.
//
// Explain why O(n^2) is only an upper bound for that implementation and does not
// prove that the problem requires Omega(n^2).

// -----------------------------------------------------------------------------
// Exercise 02 — Tight Bound
// -----------------------------------------------------------------------------
// Implement a linear scan that finds the maximum element in an unsorted array.
//
// Prove:
// - upper bound O(n),
// - lower bound Omega(n),
// - tight bound Theta(n).
//
// Your lower-bound argument should explain why every non-maximum element must be
// ruled out somehow.

// -----------------------------------------------------------------------------
// Exercise 03 — Decision Tree Basics
// -----------------------------------------------------------------------------
// Build a decision tree for sorting three distinct elements using comparisons.
//
// Label:
// - internal nodes as comparisons,
// - leaves as final orderings.
//
// Count the leaves and determine the minimum possible tree height.

// -----------------------------------------------------------------------------
// Exercise 04 — Factorial Outcomes
// -----------------------------------------------------------------------------
// For n distinct elements:
//
// 1. Explain why there are n! possible sorted-order outcomes.
// 2. Calculate n! for several small n.
// 3. Explain why a comparison-sorting decision tree needs at least n! leaves.

// -----------------------------------------------------------------------------
// Exercise 05 — Binary Decision Tree Bound
// -----------------------------------------------------------------------------
// A binary decision tree of height h has at most 2^h leaves.
//
// Derive this fact recursively.
//
// Then explain why a tree with at least n! leaves must satisfy:
//   2^h >= n!

// -----------------------------------------------------------------------------
// Exercise 06 — Sorting Lower Bound
// -----------------------------------------------------------------------------
// Starting from:
//   2^h >= n!
//
// derive:
//   h >= log2(n!)
//
// Then show why log(n!) = Theta(n log n).
//
// Write the complete comparison-sorting lower-bound proof in your own words.

// -----------------------------------------------------------------------------
// Exercise 07 — Comparison Sort vs Counting Sort
// -----------------------------------------------------------------------------
// Compare comparison sorting with counting sort under the assumption that keys
// are integers in a small bounded range.
//
// Explain why counting sort can beat n log n without contradicting the comparison
// sorting lower bound.

// -----------------------------------------------------------------------------
// Exercise 08 — Unsorted Search Lower Bound
// -----------------------------------------------------------------------------
// Consider searching for an arbitrary target in an unsorted array.
//
// Prove an Omega(n) worst-case lower bound.
//
// Then implement linear search and show that its O(n) upper bound is optimal.

// -----------------------------------------------------------------------------
// Exercise 09 — Sorted Search
// -----------------------------------------------------------------------------
// Implement binary search.
//
// Explain its O(log n) runtime through a decision-tree/information argument.
//
// Then compare the information available in:
// - an unsorted array,
// - a sorted array.

// -----------------------------------------------------------------------------
// Exercise 10 — Preprocessing Trade-Off
// -----------------------------------------------------------------------------
// Solve repeated membership queries in two ways:
// A. scan the original array for every query,
// B. build a Set once and reuse it.
//
// Analyze:
// - preprocessing time,
// - query time,
// - total time for Q queries,
// - memory.
//
// Explain why preprocessing changes the computational setup rather than violating
// a lower bound for the original one-shot problem.

// -----------------------------------------------------------------------------
// Exercise 11 — Constant-Factor Optimization
// -----------------------------------------------------------------------------
// Design two linear-time algorithms for finding both minimum and maximum.
//
// Compare their number of comparisons.
//
// Explain why improving the constant factor does not change the Theta(n) bound.

// -----------------------------------------------------------------------------
// Exercise 12 — Indistinguishability
// -----------------------------------------------------------------------------
// Construct two inputs that produce identical observations for an algorithm until
// the algorithm examines a particular position.
//
// Use the example to explain why the algorithm cannot safely stop earlier.

// -----------------------------------------------------------------------------
// Exercise 13 — Adversary Argument
// -----------------------------------------------------------------------------
// Develop a simple adversary argument for an information-gathering problem.
//
// The adversary should answer queries in a way that leaves multiple possible
// inputs consistent with all observations so far.
//
// Explain why the algorithm needs another query.

// -----------------------------------------------------------------------------
// Exercise 14 — Model-Dependent Lower Bounds
// -----------------------------------------------------------------------------
// For each pair, explain why the achievable complexity can differ:
// A. comparison sorting vs integer sorting
// B. unsorted search vs sorted search
// C. exact retrieval vs approximate retrieval
// D. one-shot query vs preprocessed indexed query
//
// Identify the changed assumption/model in each case.

// -----------------------------------------------------------------------------
// Exercise 15 — Database Indexing
// -----------------------------------------------------------------------------
// Model a backend table with N rows and repeated equality queries.
//
// Compare:
// A. full scan,
// B. indexed lookup.
//
// Analyze build cost, query cost, memory/storage, and update maintenance.
//
// Explain the index as stored information that reduces future query work.

// -----------------------------------------------------------------------------
// Exercise 16 — Pagination Reasoning
// -----------------------------------------------------------------------------
// Compare offset pagination with cursor/keyset pagination conceptually.
//
// Identify what information each strategy stores or uses to avoid rediscovering
// earlier records.
//
// Discuss how indexing and ordering assumptions affect the achievable performance.

// -----------------------------------------------------------------------------
// Exercise 17 — AI Exact vs Approximate Retrieval
// -----------------------------------------------------------------------------
// Consider N vectors of dimension D.
//
// Compare:
// A. exact brute-force nearest-neighbor search,
// B. an approximate indexed retrieval strategy.
//
// Analyze:
// - computation,
// - index memory,
// - build cost,
// - quality guarantee.
//
// Explain why changing the requirement from exact to approximate changes the
// algorithmic problem.

// -----------------------------------------------------------------------------
// Exercise 18 — Streaming Lower-Bound Thinking
// -----------------------------------------------------------------------------
// Consider a stream of N values and a tiny memory budget.
//
// Choose an exact problem whose solution appears to require remembering substantial
// information.
//
// Explain what information must be preserved and why a very small-memory algorithm
// may be impossible or may require multiple passes.
//
// Do not claim a formal lower bound without specifying the model.

// -----------------------------------------------------------------------------
// Exercise 19 — Resource Lower Bounds
// -----------------------------------------------------------------------------
// Choose a backend algorithm and analyze more than CPU time:
// - memory,
// - disk/network I/O,
// - communication,
// - synchronization.
//
// Identify which resource could become the true bottleneck and explain why an
// O(n) CPU bound alone is insufficient.

// -----------------------------------------------------------------------------
// Exercise 20 — Full Lower-Bound Proof
// -----------------------------------------------------------------------------
// Choose one problem and produce a complete lower-bound analysis:
//
// 1. Precisely define the problem.
// 2. Define the computational model.
// 3. Identify the information that must be discovered.
// 4. Identify the possible outcomes/states.
// 5. Explain how much information one operation can reveal.
// 6. Construct the lower-bound argument.
// 7. State the lower bound.
// 8. Give an algorithm matching it, if one is known.
// 9. Identify assumptions that could change the bound.
// 10. Explain the backend or AI engineering implication.
//
// Finish by explaining why empirical benchmarks cannot prove the lower bound.

// -----------------------------------------------------------------------------
// Final Mastery Check
// -----------------------------------------------------------------------------
// [ ] I can distinguish an algorithm upper bound from a problem lower bound.
// [ ] I understand why lower bounds require a computational model.
// [ ] I can explain the decision-tree model.
// [ ] I can derive the n! possible orderings for n distinct elements.
// [ ] I can derive the comparison-sorting Omega(n log n) lower bound.
// [ ] I understand why counting/radix sorting does not contradict it.
// [ ] I can prove the Omega(n) lower bound for unsorted search.
// [ ] I understand the information-theoretic intuition behind binary search.
// [ ] I understand how preprocessing changes query complexity.
// [ ] I can distinguish asymptotic optimality from constant-factor optimization.
// [ ] I understand indistinguishability and adversary arguments.
// [ ] I can reason about model-dependent lower bounds.
// [ ] I can apply lower-bound thinking to database indexing.
// [ ] I can apply it to pagination and retrieval systems.
// [ ] I can distinguish exact and approximate AI retrieval.
// [ ] I understand that CPU time is only one computational resource.
// [ ] I can write a complete lower-bound argument instead of merely quoting one.
