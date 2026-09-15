// Phase 03.3 — Array Insertion, Deletion & Mutation
// These exercises are intentionally UNSOLVED.
// For every solution, record time, auxiliary space, and the key invariant.

// 01 — Append value in place and return the array.
function appendValue(arr, value) { // TODO }

// 02 — Remove and return the last element. Define empty-input behavior.
function removeLast(arr) { // TODO }

// 03 — Insert value at index in a NEW array without splice(). Do not mutate input.
function insertAtCopy(arr, index, value) { // TODO }

// 04 — Delete index from a NEW array without splice(). Do not mutate input.
function deleteAtCopy(arr, index) { // TODO }

// 05 — Insert value at index IN PLACE without splice(). Shift right-to-left.
function insertAtInPlace(arr, index, value) { // TODO }

// 06 — Delete index IN PLACE without splice(). Shift left-to-right, then shrink.
function deleteAtInPlace(arr, index) { // TODO }

// 07 — Delete index by replacing it with the last element. Order does NOT matter.
// Target O(1).
function unorderedDelete(arr, index) { // TODO }

// 08 — Remove all values satisfying predicate, preserving order.
// No filter() or repeated splice(). Target O(n) time/O(1) auxiliary space.
function compactRemoveInPlace(arr, predicate) { // TODO }

// 09 — Remove duplicates in place, preserving the first occurrence of each value.
// You may use a Set for tracking.
function deduplicateStableInPlace(arr) { // TODO }

// 10 — Move all zeroes to the end, preserving non-zero order, in place.
function moveZeroesToEnd(arr) { // TODO }

// 11 — Remove every occurrence of target in place while preserving order.
// Target O(n) time/O(1) auxiliary space.
function removeValueInPlace(arr, target) { // TODO }

// 12 — Replace every occurrence of oldValue with newValue in place.
function replaceValueInPlace(arr, oldValue, newValue) { // TODO }

// 13 — Insert multiple values at one index in place without splice(). Preserve order.
function insertManyInPlace(arr, index, values) { // TODO }

// 14 — Rotate array right by one in place without creating another array.
function rotateRightOneInPlace(arr) { // TODO }

// 15 — Delete every matching element using backward traversal and ordinary deletion.
// Explain why backward traversal avoids skipped indices and analyze total complexity.
function deleteBackward(arr, predicate) { // TODO }

// 16 — Stable compaction: keep only elements satisfying predicate, modify in place,
// and return the number retained.
function compactAndCount(arr, predicate) { // TODO }

// 17 — Swap-with-last deletion. Return false for invalid index, true after deletion.
function deleteUnordered(arr, index) { // TODO }

// 18 — Apply operations in order: {type:'insert', index, value} or {type:'delete', index}.
// Return the final array and analyze repeated shifting.
function applyArrayOperations(arr, operations) { // TODO }

// 19 — Create an alias and a shallow copy; mutate index 0 through each and return
// enough information to demonstrate which mutation affects the original.
function mutationAliasExperiment(arr) { // TODO }

// 20 — Return complexity answers/reasons for:
// A append with geometric growth (amortized)
// B front insertion
// C middle deletion
// D unordered deletion
// E one-pass stable compaction
// F k repeated front deletions from an n-element array
// G copying n elements
function insertionDeletionComplexityDefense() { // TODO }

// Self-check: [], [1], [1,2,3], [5,5,5,5], [0,1,0,2,0,3], [1,-1,2,-1,3]
// For every in-place algorithm, state the loop invariant in your notes.
