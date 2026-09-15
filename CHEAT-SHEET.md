# DSA Complexity Cheat Sheet

## Common Growth Rates

| Complexity | Intuition |
|---|---|
| O(1) | Constant work |
| O(log n) | Repeatedly reduce search space |
| O(n) | One pass over input |
| O(n log n) | Efficient divide-and-conquer / comparison sorting |
| O(n²) | Pairwise comparison / nested iteration |
| O(2ⁿ) | Explore binary choice space |
| O(n!) | Explore permutations |

## Core Data Structures

| Structure | Access | Search | Insert | Delete | Notes |
|---|---:|---:|---:|---:|---|
| Array | O(1) | O(n) | O(n) | O(n) | Contiguous indexed storage |
| Linked List | O(n) | O(n) | O(1)* | O(1)* | *When node position/reference is known |
| Hash Table | — | O(1) avg. | O(1) avg. | O(1) avg. | Depends on hashing and resizing |
| Stack | O(n) | O(n) | O(1) | O(1) | LIFO |
| Queue | O(n) | O(n) | O(1) | O(1) | FIFO |
| Heap | — | O(n) | O(log n) | O(log n) | Peek min/max in O(1) |
| BST | O(log n)* | O(log n)* | O(log n)* | O(log n)* | *Balanced case; worst case O(n) |

## Common Algorithms

| Algorithm | Typical Time | Extra Space | Core Idea |
|---|---:|---:|---|
| Linear Search | O(n) | O(1) | Scan |
| Binary Search | O(log n) | O(1) iterative | Halve search space |
| Merge Sort | O(n log n) | O(n) | Divide and merge |
| Quick Sort | O(n log n) avg. | O(log n) avg. | Partition |
| Heap Sort | O(n log n) | O(1) | Heap selection |
| BFS | O(V + E) | O(V) | Queue-based traversal |
| DFS | O(V + E) | O(V) | Stack/recursion traversal |
| Dijkstra | O((V + E) log V) with binary heap | O(V) | Greedy shortest path |

## Complexity Questions

Before accepting an algorithm, ask:

1. What is the input size `n`?
2. How many times can each element be processed?
3. Are there nested loops?
4. Is the input being divided?
5. Is there a data structure providing faster lookup?
6. What additional memory is allocated?
7. Is recursion adding stack space?
8. Is the stated complexity average, amortized, or worst-case?

## Important Caveats

Complexity tables summarize typical behavior. Always state assumptions. In particular, hash-table operations are commonly described as expected O(1), balanced BST operations depend on maintaining balance, and Quick Sort has O(n²) worst-case time without suitable guarantees on partitioning.
