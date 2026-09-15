// Phase 04.12 — Recursive Tree Algorithms & Advanced Tree Recursion
// Intentionally UNSOLVED.
// Binary-tree node shape used by most exercises:
// { value, left, right }

function treePreOrder(node, result = []) { // TODO }
function treeInOrder(node, result = []) { // TODO }
function treePostOrder(node, result = []) { // TODO }
function treeSize(node) { // TODO }
function treeHeight(node) { // TODO }
function countTreeLeaves(node) { // TODO }
function treeSum(node) { // TODO }
function treeContains(node, target) { // TODO }
function treeMin(node) { // TODO }
function treeMax(node) { // TODO }
function bstSearch(node, target) { // TODO }
function rootToLeafPaths(node, path = [], result = []) { // TODO }
function hasRootToLeafSum(node, target) { // TODO }
function lowestCommonAncestor(node, a, b) { // TODO }
function treeDiameter(node) { // TODO }
function validateBST(node, low = -Infinity, high = Infinity) { // TODO }
function invertTree(node) { // TODO }
function areTreesEqual(a, b) { // TODO }
function isBalancedTree(node) { // TODO }
function recursiveTreeSynthesis(problem) { // TODO }

// Self-check:
// - define the null/base-case contract
// - state whether height counts edges or nodes
// - distinguish general-tree search from BST search
// - identify exactly what each recursive call returns
// - avoid repeated subtree traversals
// - preserve path push/pop invariants where state is shared
// - test empty, leaf, balanced, and skewed trees
// - test duplicate values according to the chosen BST convention
// - distinguish tree, DAG, and cyclic graph inputs
// - analyze O(N) traversal and O(H) recursion stack
// - consider iterative alternatives for untrusted depth
