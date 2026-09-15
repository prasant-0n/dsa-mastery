# DSA Pattern Index

| Pattern | Primary Signal | Typical Tools |
|---|---|---|
| Two Pointers | Pair/range relationship in ordered data | Array pointers |
| Sliding Window | Contiguous range with changing validity | Two pointers + state |
| Prefix Sum | Repeated range-sum queries | Prefix accumulator |
| Difference Array | Repeated range updates | Difference representation |
| Frequency Counting | Repeated membership/count checks | Map / Set |
| Fast & Slow Pointer | Cycle or middle-position structure | Two pointers |
| Binary Search | Monotonic search space | Left/right bounds |
| Sorting + Scanning | Order reveals relationships | Sort + one pass |
| Intervals | Overlapping or adjacent ranges | Sort + scan |
| Monotonic Stack | Next greater/smaller relationship | Stack |
| Monotonic Queue | Window min/max | Deque |
| Heap / Top-K | Repeated min/max selection | Heap |
| BFS | Shortest unweighted path / levels | Queue |
| DFS | Exhaustive traversal / components | Stack or recursion |
| Topological Sort | Dependency ordering in DAG | Indegree / DFS |
| Union-Find | Dynamic connectivity | DSU |
| Backtracking | Choices + constraints + undo | Recursion |
| Greedy | Safe local choice | Sorting / priority structures |
| Dynamic Programming | Overlap + optimal substructure | Memoization/tabulation |
| Divide & Conquer | Split into independent subproblems | Recursion |

## Recognition Rule

Do not choose a pattern from its name. Start with the problem constraints and structure, then derive the candidate pattern.

## Pattern Study Template

For each pattern document:

- Problem shape
- Recognition signals
- Mental model
- Core invariant
- Basic template
- Derivation from brute force
- Complexity
- Variations
- Failure cases
- Common mistakes
- Backend applications
- AI applications
- Representative problems
