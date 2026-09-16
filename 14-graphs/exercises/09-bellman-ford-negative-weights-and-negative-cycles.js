// 14.09 — Bellman-Ford, Negative Weights & Negative Cycles
// Exercise Lab
// All exercises are intentionally unsolved.

function createWeightedGraph(vertexCount, directed) { // TODO
}
function addEdge(graph, from, to, weight) { // TODO
}
function initializeDistances(vertexCount, source) { // TODO
}
function relaxEdge(distance, parent, from, to, weight) { // TODO
}
function bellmanFord(graph, source) { // TODO
}
function bellmanFordWithParents(graph, source) { // TODO
}
function bellmanFordEarlyTermination(graph, source) { // TODO
}
function runRelaxationPass(graph, distance, parent) { // TODO
}
function detectReachableNegativeCycle(graph, distance) { // TODO
}
function findNegativeCycle(graph, source) { // TODO
}
function reconstructNegativeCycle(parent, vertex, vertexCount) { // TODO
}
function reconstructShortestPath(parent, source, target) { // TODO
}
function pathCost(graph, path) { // TODO
}
function validateNegativeCycle(graph, cycle) { // TODO
}
function validateShortestDistances(graph, source, distance) { // TODO
}
function validateRelaxationInvariant(graph, distance) { // TODO
}
function reachableVertices(graph, source) { // TODO
}
function addSuperSource(graph) { // TODO
}
function detectAnyNegativeCycle(graph) { // TODO
}
function solveDifferenceConstraints(constraints, variableCount) { // TODO
}
function buildConstraintGraph(constraints, variableCount) { // TODO
}
function validateDifferenceConstraints(solution, constraints) { // TODO
}
function detectConstraintInconsistency(constraints, variableCount) { // TODO
}
function bellmanFordOnDAG(graph, source, topologicalOrder) { // TODO
}
function compareBellmanFordAndDAGShortestPath(graph, source) { // TODO
}
function spfaLikeRelaxation(graph, source) { // TODO
}
function compareBellmanFordAndQueueRelaxation(graph, source) { // TODO
}
function validateNonNegativeGraph(graph) { // TODO
}
function generatePositiveWeightedGraph(vertexCount, edgeCount, random) { // TODO
}
function generateNegativeEdgeGraph(vertexCount, edgeCount, random) { // TODO
}
function generateNegativeCycleGraph(vertexCount, random) { // TODO
}
function generateUnreachableNegativeCycleGraph(vertexCount, random) { // TODO
}
function generateNegativeDAG(vertexCount, edgeCount, random) { // TODO
}
function generateZeroWeightGraph(vertexCount, edgeCount, random) { // TODO
}
function generateDenseWeightedGraph(vertexCount, random) { // TODO
}
function generateLongPropagationGraph(vertexCount, random) { // TODO
}
function generateConstraintSystem(variableCount, constraintCount, random) { // TODO
}
function generateInconsistentConstraintSystem(variableCount, random) { // TODO
}
function runBellmanFordTests(workloads) { // TODO
}
function runNegativeEdgeTests(workloads) { // TODO
}
function runNegativeCycleTests(workloads) { // TODO
}
function runUnreachableNegativeCycleTests(workloads) { // TODO
}
function runPathReconstructionTests(workloads) { // TODO
}
function runCycleReconstructionTests(workloads) { // TODO
}
function runEarlyTerminationTests(workloads) { // TODO
}
function runDAGNegativeWeightTests(workloads) { // TODO
}
function runDifferenceConstraintTests(workloads) { // TODO
}
function runSuperSourceTests(workloads) { // TODO
}
function runZeroWeightTests(workloads) { // TODO
}
function runDisconnectedGraphTests(workloads) { // TODO
}
function runInvariantTests(workloads) { // TODO
}
function runDifferentialTests(workloads) { // TODO
}
function runPropertyTests(workloads) { // TODO
}
function runAdversarialTests(workloads) { // TODO
}
function runNumericSafetyTests(workloads) { // TODO
}
function benchmarkBellmanFord(workload) { // TODO
}
function benchmarkEarlyTermination(workload) { // TODO
}
function benchmarkNegativeCycleDetection(workload) { // TODO
}
function benchmarkDAGShortestPath(workload) { // TODO
}
function benchmarkQueueRelaxation(workload) { // TODO
}
function benchmarkDenseGraph(workload) { // TODO
}
function benchmarkSparseGraph(workload) { // TODO
}
function benchmarkLongPropagation(workload) { // TODO
}
function compareBellmanFordAndDijkstra(workload) { // TODO
}
function compareBellmanFordAndDAG(workload) { // TODO
}
function analyzeBellmanFordComplexity(vertexCount, edgeCount) { // TODO
}
function analyzeRelaxationPassComplexity(vertexCount, edgeCount) { // TODO
}
function analyzeNegativeCycleDetectionComplexity(vertexCount, edgeCount) { // TODO
}
function analyzeConstraintSystemComplexity(variableCount, constraintCount) { // TODO
}
function designBackendConstraintValidator(requirements) { // TODO
}
function designCostPropagationEngine(requirements) { // TODO
}
function designNegativeCycleMonitor(requirements) { // TODO
}
function designRoutingWithSignedCosts(requirements) { // TODO
}
function designAIConstraintSolver(requirements) { // TODO
}
function designAIPlanningWithSignedCosts(requirements) { // TODO
}
function traceBellmanFord(graph, source) { // TODO
}
function traceRelaxationPass(graph, distance, parent) { // TODO
}
function traceNegativeCycleDetection(graph, distance) { // TODO
}
function traceNegativeCycleReconstruction(parent, vertex, vertexCount) { // TODO
}
function traceDifferenceConstraints(constraints, variableCount) { // TODO
}
function proveVMinusOnePassCorrectness(graph, source, distance) { // TODO
}
function proveNegativeCycleDetection(graph, distance) { // TODO
}
function proveNegativeCycleReconstruction(graph, cycle) { // TODO
}
function proveEarlyTerminationCorrectness(graph, distance) { // TODO
}
function proveDifferenceConstraintReduction(constraints, graph) { // TODO
}
function deriveBellmanFordComplexity(graph, solution) { // TODO
}
function prepareBellmanFordInterviewExplanation(problem, solution) { // TODO
}

module.exports = {
  createWeightedGraph,
  addEdge,
  initializeDistances,
  relaxEdge,
  bellmanFord,
  bellmanFordWithParents,
  bellmanFordEarlyTermination,
  runRelaxationPass,
  detectReachableNegativeCycle,
  findNegativeCycle,
  reconstructNegativeCycle,
  reconstructShortestPath,
  pathCost,
  validateNegativeCycle,
  validateShortestDistances,
  validateRelaxationInvariant,
  reachableVertices,
  addSuperSource,
  detectAnyNegativeCycle,
  solveDifferenceConstraints,
  buildConstraintGraph,
  validateDifferenceConstraints,
  detectConstraintInconsistency,
  bellmanFordOnDAG,
  compareBellmanFordAndDAGShortestPath,
  spfaLikeRelaxation,
  compareBellmanFordAndQueueRelaxation,
  validateNonNegativeGraph,
  generatePositiveWeightedGraph,
  generateNegativeEdgeGraph,
  generateNegativeCycleGraph,
  generateUnreachableNegativeCycleGraph,
  generateNegativeDAG,
  generateZeroWeightGraph,
  generateDenseWeightedGraph,
  generateLongPropagationGraph,
  generateConstraintSystem,
  generateInconsistentConstraintSystem,
  runBellmanFordTests,
  runNegativeEdgeTests,
  runNegativeCycleTests,
  runUnreachableNegativeCycleTests,
  runPathReconstructionTests,
  runCycleReconstructionTests,
  runEarlyTerminationTests,
  runDAGNegativeWeightTests,
  runDifferenceConstraintTests,
  runSuperSourceTests,
  runZeroWeightTests,
  runDisconnectedGraphTests,
  runInvariantTests,
  runDifferentialTests,
  runPropertyTests,
  runAdversarialTests,
  runNumericSafetyTests,
  benchmarkBellmanFord,
  benchmarkEarlyTermination,
  benchmarkNegativeCycleDetection,
  benchmarkDAGShortestPath,
  benchmarkQueueRelaxation,
  benchmarkDenseGraph,
  benchmarkSparseGraph,
  benchmarkLongPropagation,
  compareBellmanFordAndDijkstra,
  compareBellmanFordAndDAG,
  analyzeBellmanFordComplexity,
  analyzeRelaxationPassComplexity,
  analyzeNegativeCycleDetectionComplexity,
  analyzeConstraintSystemComplexity,
  designBackendConstraintValidator,
  designCostPropagationEngine,
  designNegativeCycleMonitor,
  designRoutingWithSignedCosts,
  designAIConstraintSolver,
  designAIPlanningWithSignedCosts,
  traceBellmanFord,
  traceRelaxationPass,
  traceNegativeCycleDetection,
  traceNegativeCycleReconstruction,
  traceDifferenceConstraints,
  proveVMinusOnePassCorrectness,
  proveNegativeCycleDetection,
  proveNegativeCycleReconstruction,
  proveEarlyTerminationCorrectness,
  proveDifferenceConstraintReduction,
  deriveBellmanFordComplexity,
  prepareBellmanFordInterviewExplanation,
};
