// 01.2 — Problem Decomposition & Computational Modeling
//
// Rules:
// 1. Model before coding.
// 2. Write the computational contract, not the story.
// 3. Identify required operations before selecting a data structure.
// 4. Define minimal sufficient state.
// 5. Identify repeated work and the dominant bottleneck.
// 6. State invariants and correctness conditions.

// Exercise 1: Take a story-based problem and rewrite it as:
// - goal
// - inputs
// - outputs
// - constraints
// - required operations

// Exercise 2: Given an array problem, identify whether the dominant operation is
// indexed access, membership, frequency lookup, ordering, or priority extraction.
// Choose a natural representation and explain why.

// Exercise 3: Model Two Sum without writing code.
// Include the brute-force search space, repeated work, optimized state,
// required operation, and expected complexity.

// Exercise 4: Given a sorted-array search problem, write the precondition,
// postcondition, search state, invariant, and condition that allows half the
// search space to be discarded.

// Exercise 5: Design a model for counting the frequency of every value in an array.
// State the minimum information that must be remembered after each element.

// Exercise 6: Given a top-K problem, decompose it into independent responsibilities.
// Identify where sorting, a heap, or selection could enter the design.

// Exercise 7: Given a nested JSON structure containing objects, arrays, strings,
// and numbers, design a computational model for summing all numbers regardless
// of nesting depth. Do not code it yet.

// Exercise 8: Model a category hierarchy as a tree.
// Identify entities, relationships, state, base case, and traversal strategy.

// Exercise 9: Model a social-network connection problem as a graph.
// Explain why an array or object alone is not the most direct representation.

// Exercise 10: Given n = 10^5 and a memory limit, compare an O(n^2) brute-force
// approach with an O(n) extra-memory approach. Identify the trade-off.

// Exercise 11: Pick an algorithm and list every piece of state it maintains.
// Remove one state variable at a time and determine whether the algorithm still works.

// Exercise 12: Identify the bottleneck in a hypothetical algorithm with work:
// O(n) + O(n log n) + O(n^2). Explain where optimization effort should go.

// Exercise 13: For a problem of your choice, identify repeated work and transform
// the algorithm from "recompute" to "remember and reuse".

// Exercise 14: Take one problem and produce two different representations of the
// same information. Compare which required operations become cheaper or more expensive.

// Exercise 15: Write preconditions, postconditions, and an invariant for a simple
// two-pointer or linear traversal algorithm.

// Exercise 16: Use this complete modeling template on an unfamiliar problem:
// Problem / Goal / Inputs / Outputs / Constraints / Entities / Relationships /
// Required operations / State / Search space / Brute force / Repeated work /
// Optimization / Representation / Invariant / Termination / Complexity target.

// Add tests only after the model is clear. Include boundary conditions and cases
// that challenge the assumptions made in the model.
