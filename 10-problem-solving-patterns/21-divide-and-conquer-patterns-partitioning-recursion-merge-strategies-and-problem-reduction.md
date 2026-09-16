# 10.21 — Divide & Conquer Patterns: Partitioning, Recursion, Merge Strategies & Problem Reduction

## 1. Objective

Divide and conquer solves a problem by recursively breaking it into smaller subproblems, solving them, and combining their results.

```text
problem
→ divide
→ solve subproblems
→ combine
→ solution
```

## 2. Why It Exists

A problem may become dramatically easier after partitioning its input into independent or simpler regions. The pattern often reduces work from quadratic to `O(N log N)` or enables logarithmic search.

## 3. Three Core Steps

1. **Divide** — partition the problem.
2. **Conquer** — solve each smaller problem.
3. **Combine** — construct the parent result.

Some algorithms have an trivial combine step; others derive their efficiency from the merge operation.

## 4. Recursive Structure

For a balanced divide:

```text
T(N) = aT(N / b) + f(N)
```

The recurrence describes recursive work plus non-recursive work.

## 5. Base Case

Every recursive algorithm needs a well-defined smallest input where the result is directly known.

The base case is part of correctness and termination, not just syntax.

## 6. Merge Sort

Merge sort divides the array into halves, recursively sorts each half, and merges two sorted sequences.

```text
Time: O(N log N)
Auxiliary space: typically O(N)
```

## 7. Merge Operation

Two sorted arrays can be merged by comparing their current heads and advancing one pointer.

Each element is consumed once, making a merge `O(N + M)`.

## 8. Quick Sort

Quicksort partitions around a pivot, then recursively processes the resulting regions.

Average expected performance is often `O(N log N)` with suitable pivot behavior; worst-case recursion can be `O(N²)`.

## 9. Partitioning

Partitioning rearranges elements around a pivot according to a predicate such as:

```text
left region ≤ pivot
right region > pivot
```

The exact invariant depends on the partition scheme.

## 10. Pivot Selection

Possible strategies include:

- first/last element;
- random pivot;
- median-based approaches;
- median-of-three.

Pivot choice affects recursion balance and therefore performance.

## 11. Randomized Quicksort

Random pivot selection reduces dependence on adversarial input ordering and gives expected `O(N log N)` comparison complexity under the standard randomized model.

Expected complexity is not a guarantee for every execution.

## 12. In-Place Divide & Conquer

Some algorithms partition within the original array and use only recursion stack space.

“In-place” must be defined carefully because recursion itself consumes stack space.

## 13. Binary Search

Binary search is divide and conquer with one surviving subproblem.

Each step halves the search region under a monotone ordering invariant.

```text
Time: O(log N)
```

## 14. First / Last Occurrence

Binary search can be modified to continue searching after finding a match in order to locate the leftmost or rightmost valid position.

This is a boundary-search form of divide and conquer.

## 15. Search on Answer

If a feasibility predicate is monotone over an ordered answer domain, binary search can divide the answer space rather than the input array.

The expensive part is usually the feasibility check.

## 16. Count Inversions

Merge sort can count cross-half inversions during merging.

When a right-side value is smaller than the current left-side value, all remaining left values form inversions with it.

This turns a quadratic pair-counting problem into `O(N log N)`.

## 17. Closest Pair of Points

A classical divide-and-conquer geometry algorithm splits points by x-coordinate, solves each half, then checks a narrow strip around the dividing line.

The combine step depends on a geometric bound that limits candidate comparisons.

## 18. Divide-and-Conquer Maximum Subarray

A maximum subarray can lie:

- entirely in the left half;
- entirely in the right half;
- across the midpoint.

The combine step evaluates all three cases.

## 19. Karatsuba Multiplication

Karatsuba reduces the number of recursive multiplications by algebraically rearranging the product.

The broader lesson is that changing the combine algebra can improve a recurrence.

## 20. Strassen-Style Matrix Multiplication

Strassen reduces the number of recursive matrix multiplications using additional additions/subtractions.

It illustrates the trade-off between arithmetic count, memory traffic, numerical behavior, and implementation complexity.

## 21. Recursion Tree

A recursion tree visualizes the work at each depth.

For balanced divide-and-conquer, there are often `log N` levels.

Multiply work per level by the number of levels only when the per-level cost has been correctly characterized.

## 22. Master Theorem

For suitable recurrences of the form:

```text
T(N) = aT(N/b) + f(N)
```

the Master Theorem can classify asymptotic growth by comparing `f(N)` with `N^(log_b a)`.

Its assumptions and cases must be checked rather than applied mechanically.

## 23. Uneven Recursion

Not every divide is balanced. Recurrences such as:

```text
T(N) = T(N - 1) + O(N)
```

behave very differently from halving recurrences.

Always derive the actual recurrence.

## 24. Multi-Branch Divide & Conquer

A problem may generate multiple independent recursive calls with different sizes.

Correct analysis must account for all branches and the combine cost.

## 25. Parallelism

Independent subproblems can potentially execute concurrently.

Parallelism changes wall-clock analysis while total work may remain similar.

Distinguish:

- work;
- span/depth;
- synchronization overhead.

## 26. Cache Behavior

Divide-and-conquer can improve locality by working on smaller contiguous regions, but recursion and temporary allocations can also increase overhead.

Benchmark real implementations when performance matters.

## 27. External-Memory Divide & Conquer

For data larger than RAM, the useful cost model may count block transfers rather than individual operations.

The partition strategy should minimize expensive I/O and exploit sequential access.

## 28. Divide & Conquer vs Dynamic Programming

If recursive subproblems are independent, ordinary divide and conquer is appropriate.

If the same subproblems overlap, memoization or bottom-up DP may eliminate repeated work.

## 29. Divide & Conquer vs Greedy

Divide and conquer solves subproblems and combines them. Greedy commits to a local choice and discards alternatives based on a proof.

They can appear together, but their correctness arguments differ.

## 30. Correctness Proof

A divide-and-conquer proof should establish:

1. every recursive subproblem is a valid instance;
2. recursive calls solve their specified subproblems;
3. the combine step correctly constructs the parent solution;
4. base cases are correct;
5. recursion terminates.

## 31. Complexity

Typical patterns:

```text
binary search: O(log N)
merge sort: O(N log N)
balanced divide-and-conquer: often O(N log N)
naive unbalanced recursive partition: potentially O(N²)
```

Include auxiliary memory, recursion depth, allocations, and combine costs.

## 32. Common Mistakes

1. Assuming every divide-and-conquer algorithm is `O(N log N)`.
2. Ignoring the combine step.
3. Using the Master Theorem outside its assumptions.
4. Forgetting recursion-stack space.
5. Creating overlapping subproblems without memoization.
6. Ignoring pivot quality.
7. Claiming in-place despite large hidden allocations.
8. Confusing work with parallel span.

## 33. Edge Cases

Test:

- empty input;
- one element;
- two elements;
- already sorted data;
- reverse-sorted data;
- all equal values;
- highly unbalanced partitions;
- duplicate pivots;
- non-power-of-two sizes;
- deep recursion.

## 34. Backend Applications

Divide and conquer appears in:

- database query processing;
- large-data aggregation;
- parallel batch processing;
- sorting/index preparation;
- hierarchical computation;
- distributed task decomposition.

## 35. AI Applications

Applications include:

- hierarchical search;
- recursive spatial partitioning;
- parallel preprocessing;
- divide-and-conquer clustering variants;
- model/data sharding;
- large-scale batch computation.

## 36. Testing Strategy

Use:

- brute-force references for small inputs;
- partition invariant checks;
- recursive-size assertions;
- randomized pivot testing;
- adversarial recursion-depth tests;
- differential merge tests;
- work/stack/memory benchmarks.

## 37. Interview Framework

When divide and conquer appears:

```text
1. What is the smallest valid problem?
2. How can the input be divided?
3. Are subproblems independent or overlapping?
4. How many recursive calls exist?
5. What are their sizes?
6. What is the combine cost?
7. What recurrence follows?
8. Is the recursion balanced?
9. What is the recursion depth?
10. Can the combine step be optimized?
```

## 38. Revision Checklist

- [ ] I can identify divide/conquer/combine.
- [ ] I can derive recurrences.
- [ ] I understand merge sort.
- [ ] I can reason about quicksort partitioning.
- [ ] I understand binary-search divide and conquer.
- [ ] I can count inversions using merge logic.
- [ ] I know when subproblems overlap.
- [ ] I can use the Master Theorem appropriately.
- [ ] I can reason about work vs span.
- [ ] I can explain backend and AI applications.

## 39. Key Takeaways

1. **Divide and conquer is a structural pattern: partition, solve smaller problems, then combine.**
2. **The recurrence must be derived from the actual branch sizes and combine cost.**
3. **Balanced partitioning is often crucial for logarithmic recursion depth.**
4. **Overlapping subproblems are a signal to consider memoization or dynamic programming.**
5. **Production performance also depends on memory, cache behavior, allocation, recursion depth, and parallel work—not only asymptotic comparisons.**
