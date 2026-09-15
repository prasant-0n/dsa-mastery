// Phase 03.2 — Array Traversal & Iteration
// These exercises are intentionally UNSOLVED.
// For every solution, record time, auxiliary space, and the key invariant.

// 01 — Return all elements in forward order without map().
function traverseForward(arr) {
  // TODO
}

// 02 — Return all elements in reverse order without reverse().
function traverseReverse(arr) {
  // TODO
}

// 03 — Return the sum of all values.
function sumWithTraversal(arr) {
  // TODO
}

// 04 — Return the maximum value. Define empty-input behavior.
function maxWithTraversal(arr) {
  // TODO
}

// 05 — Return the minimum value. Define empty-input behavior.
function minWithTraversal(arr) {
  // TODO
}

// 06 — Count values satisfying predicate(value).
function countMatching(arr, predicate) {
  // TODO
}

// 07 — Return the first index satisfying predicate(value).
// Return -1 when no element matches.
function firstMatchingIndex(arr, predicate) {
  // TODO
}

// 08 — Return the last index satisfying predicate(value).
// Use reverse traversal.
function lastMatchingIndex(arr, predicate) {
  // TODO
}

// 09 — Return true when every element satisfies predicate(value).
// Do not use every().
function allMatch(arr, predicate) {
  // TODO
}

// 10 — Return true when at least one element satisfies predicate(value).
// Do not use some().
function anyMatch(arr, predicate) {
  // TODO
}

// 11 — Create a new array containing only values satisfying predicate.
// Do not use filter().
function filterManually(arr, predicate) {
  // TODO
}

// 12 — Create a new array by transforming each value with transform(value).
// Do not use map().
function mapManually(arr, transform) {
  // TODO
}

// 13 — Reduce arr using an accumulator and initialValue.
// Do not use reduce().
function reduceManually(arr, initialValue, combine) {
  // TODO
}

// 14 — Increment every numeric element in place.
// Target O(n) time and O(1) auxiliary space.
function incrementInPlace(arr) {
  // TODO
}

// 15 — Remove all values satisfying predicate in place.
// Do not use filter() or splice() repeatedly.
// Target O(n) time and O(1) auxiliary space.
function removeMatchingInPlace(arr, predicate) {
  // TODO
}

// 16 — Compare two arrays by content using one traversal.
// Return true only for equal length and corresponding values.
function equalByTraversal(a, b) {
  // TODO
}

// 17 — Find the first negative number and return its index.
// Stop immediately when found.
function firstNegativeIndex(arr) {
  // TODO
}

// 18 — Return the sum of an R x C matrix using nested traversal.
function matrixSum(matrix) {
  // TODO
}

// 19 — Given an array of numbers, return an object containing:
// sum, min, max, countPositive, countNegative, countZero.
// Aim for one traversal.
function summarizeArray(arr) {
  // TODO
}

// 20 — Complexity Defense
// Before coding, state the best/worst-case time and auxiliary-space complexity for:
// A. full traversal
// B. first-match search with early exit
// C. filter-style traversal producing k results
// D. two sequential full traversals
// E. two nested full traversals
// F. complete R x C matrix traversal
// Then return your answers as an object.
function traversalComplexityDefense() {
  // TODO
}

// Suggested self-check cases:
// []
// [1]
// [1, 2, 3, 4]
// [4, 3, 2, 1]
// [5, 5, 5]
// [-3, 0, 7, -1]
// [1, -1, 0, 4, -2]
//
// For each non-trivial solution, write the loop invariant in your notes.
