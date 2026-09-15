// 09.05 — Selection Sort
// INTENTIONALLY UNSOLVED.
// Derive the sorted-prefix invariant before coding.

function selectionSort(values, compare) {
  // TODO
}

function selectionSortDescending(values, compare) {
  // TODO
}

function selectionSortNonMutating(values, compare) {
  // TODO
}

function stableSelectionSort(values, compare) {
  // TODO: Use shifting/insertion rather than a disruptive swap.
}

function findMinimumIndex(values, start, compare) {
  // TODO
}

function isSorted(values, compare) {
  // TODO
}

function isPermutation(original, sorted) {
  // TODO
}

function isStableRelativeOrder(original, sorted, compare) {
  // TODO
}

function countSelectionComparisons(values, compare) {
  // TODO
}

function countSelectionSwaps(values, compare) {
  // TODO
}

function countSelectionWrites(values, compare) {
  // TODO
}

function deriveComparisonCount(n) {
  // TODO: Derive the quadratic comparison count.
}

function deriveMaximumSwapCount(n) {
  // TODO
}

function verifySortedPrefixInvariant(values, start, compare) {
  // TODO: Verify the Selection Sort invariant.
}

function traceSelectionIteration(values, start, compare) {
  // TODO: Trace minimum discovery and placement.
}

function traceSelectionSort(values, compare) {
  // TODO
}

function demonstrateInstability(records, compare) {
  // TODO: Construct/observe an equal-key crossing.
}

function generateEqualKeyRecords(size) {
  // TODO
}

function generateAlreadySortedInput(size) {
  // TODO
}

function generateReverseSortedInput(size) {
  // TODO
}

function generateRandomInput(size) {
  // TODO
}

function generateDuplicateHeavyInput(size) {
  // TODO
}

function generateNearlySortedInput(size, disorderRate) {
  // TODO
}

function compareSelectionAndBubble(workload, compare) {
  // TODO: Compare comparisons, swaps, and stability properties.
}

function compareSelectionAndInsertion(workload, compare) {
  // TODO: Compare behavior across disorder levels.
}

function validateStableSelectionSort(original, sorted, compare) {
  // TODO
}

function validateSelectionSortContract(original, sorted, compare, options) {
  // TODO: Ordering, permutation, optional stability/mutation checks.
}

function benchmarkSelectionWorkloads(workloads, compare) {
  // TODO: Measure comparisons, swaps, writes, and elapsed time.
}

function analyzeSelectionCost(n, comparisonCost, writeCost) {
  // TODO: Build a weighted cost model.
}

function analyzeStabilityTradeoff(n, inversionCount, writeCost) {
  // TODO: Model stable shifting versus swap-based selection.
}

function designSelectionSortLab(requirements) {
  // TODO: Define comparator, contract, instrumentation, and test strategy.
}

module.exports = {
  selectionSort,
  selectionSortDescending,
  selectionSortNonMutating,
  stableSelectionSort,
  findMinimumIndex,
  isSorted,
  isPermutation,
  isStableRelativeOrder,
  countSelectionComparisons,
  countSelectionSwaps,
  countSelectionWrites,
  deriveComparisonCount,
  deriveMaximumSwapCount,
  verifySortedPrefixInvariant,
  traceSelectionIteration,
  traceSelectionSort,
  demonstrateInstability,
  generateEqualKeyRecords,
  generateAlreadySortedInput,
  generateReverseSortedInput,
  generateRandomInput,
  generateDuplicateHeavyInput,
  generateNearlySortedInput,
  compareSelectionAndBubble,
  compareSelectionAndInsertion,
  validateStableSelectionSort,
  validateSelectionSortContract,
  benchmarkSelectionWorkloads,
  analyzeSelectionCost,
  analyzeStabilityTradeoff,
  designSelectionSortLab,
};
