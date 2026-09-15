// Phase 03.4 — Array Searching
// Intentionally UNSOLVED.
// For each problem record: approach, invariant, time, auxiliary space.

// 01 — Return first index of target, or -1.
function linearSearch(arr, target) { // TODO }

// 02 — Return whether target exists.
function contains(arr, target) { // TODO }

// 03 — Return last index of target, or -1.
function lastIndexOfValue(arr, target) { // TODO }

// 04 — Return first index whose value is greater than limit, or -1.
function firstGreaterThan(arr, limit) { // TODO }

// 05 — Return first index satisfying predicate, or -1.
function findFirstByPredicate(arr, predicate) { // TODO }

// 06 — Count target occurrences in an unsorted array.
function countOccurrences(arr, target) { // TODO }

// 07 — Iterative binary search on a sorted ascending array.
function binarySearch(arr, target) { // TODO }

// 08 — First occurrence of target in a sorted ascending array.
function firstOccurrence(arr, target) { // TODO }

// 09 — Last occurrence of target in a sorted ascending array.
function lastOccurrence(arr, target) { // TODO }

// 10 — Lower bound: first index i where arr[i] >= target.
// Return arr.length when no such index exists.
function lowerBound(arr, target) { // TODO }

// 11 — Upper bound: first index i where arr[i] > target.
// Return arr.length when no such index exists.
function upperBound(arr, target) { // TODO }

// 12 — Count target occurrences in a sorted array using lower/upper bounds.
// Target O(log n).
function countInSortedArray(arr, target) { // TODO }

// 13 — Return the insertion position preserving sorted order.
// Use lower-bound semantics.
function insertionPosition(arr, target) { // TODO }

// 14 — Search a rotated sorted array with DISTINCT values.
// Example: [4,5,6,7,0,1,2]. Target O(log n).
function searchRotatedSorted(arr, target) { // TODO }

// 15 — Given n and a monotonic predicate f(i), find the first index where
// f(i) becomes true. Return n if it never becomes true.
function firstTrue(n, predicate) { // TODO }

// 16 — Batch membership: build a Set once and answer all queries.
// State expected total complexity versus repeated linear scans.
function batchMembershipQueries(arr, queries) { // TODO }

// 17 — Find first value >= target in a sorted array.
// Return { index, value } or a clear no-match result.
function firstAtLeast(arr, target) { // TODO }

// 18 — Find first object whose id equals targetId. Return object or null.
function findObjectById(items, targetId) { // TODO }

// 19 — Choose between linear scan, Set, and binary search for:
// A one lookup in unsorted data
// B many membership queries on static data
// C many searches on sorted static data
// D sorted data with frequent updates
function chooseSearchStrategy() { // TODO }

// 20 — Full search synthesis: choose a strategy from requirements involving
// sortedness, duplicates, query count, and whether preprocessing is allowed.
function searchStrategySynthesis() { // TODO }

// Self-check: [], [1], [1,2,3,4,5], [1,2,2,2,5],
// [5,4,3,2,1], [-5,-2,0,3,9], [4,5,6,7,0,1,2]
// Binary-search invariant: if the target exists, it remains inside the
// current search interval. Every iteration must shrink that interval.
