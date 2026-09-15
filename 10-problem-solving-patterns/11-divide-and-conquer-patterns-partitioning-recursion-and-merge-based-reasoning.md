# 10.11 — Divide & Conquer Patterns: Partitioning, Recursion & Merge-Based Reasoning

## 1. Objective

Divide and conquer solves a problem by decomposing it into smaller independent or structured subproblems, solving them recursively, and combining their results.

```text
divide
→ solve smaller problems
→ combine
```

## 2. Why It Exists

A direct solution may repeatedly process the same large search space. Decomposition can reduce work, expose parallel structure, or make correctness easier to reason about.

## 3. Three Core Questions

1. How is the input divided?
2. What is the base case?
3. How are subproblem results combined?

Every divide-and-conquer algorithm should answer all three explicitly.

## 4. Independent vs Dependent Subproblems

Some subproblems are independent, as in merge sort.
Others interact through a partition, boundary, or shared state, as in quicksort or selection.

The dependency determines both the recurrence and the proof.

## 5. Merge Sort

Merge sort divides an array into halves, recursively sorts each half, and merges two sorted halves.

The merge step is linear in the combined subproblem size.

## 6. Merge Invariant

During merging:

> The output prefix is sorted and contains exactly the smallest not-yet-output elements from the two input ranges.

This invariant supports correctness.

## 7. Quicksort

Quicksort partitions values around a pivot and recursively processes the resulting regions.

Unlike merge sort, partition quality determines recursion depth and therefore performance.

## 8. Partition Invariant

A partition procedure must precisely define what every region means.

For example:

```text
[left, boundary) → values satisfying relation to pivot
[boundary, i)    → processed values not yet placed in final region
[i, right)       → unprocessed
```

Exact boundaries depend on the partition scheme.

## 9. Pivot Selection

Possible strategies include:

- first element;
- last element;
- random pivot;
- median-of-three;
- deterministic selection methods.

Pivot selection changes expected or worst-case behavior but does not remove the need for a correct partition invariant.

## 10. Quickselect

Quickselect uses partitioning to find an order statistic without recursively solving both sides.

Only the partition containing the target rank needs to be processed further.

Expected complexity is linear under suitable randomized pivot assumptions; worst-case complexity can be quadratic for naive pivot strategies.

## 11. Binary Search as Divide and Conquer

Binary search repeatedly discards half the search space.

It can be viewed as a specialized divide-and-conquer algorithm with only one recursive branch surviving.

## 12. Closest-Pair Style Decomposition

Some geometric problems divide points into regions, solve each region, and handle cross-boundary candidates during combination.

The combine step is often the hardest part.

## 13. Divide and Conquer on Linked Structures

A linked list can be divided using slow/fast pointers, recursively sorted, and merged without requiring random access.

This demonstrates that divide and conquer depends on structural decomposition, not array indexing.

## 14. Recursive Tree Decomposition

Tree algorithms naturally divide at a node:

```text
solve(left)
solve(right)
combine at node
```

The combine operation may compute height, balance, aggregates, or other metadata.

## 15. Recurrence Relations

A typical divide-and-conquer recurrence is:

```text
T(N) = aT(N/b) + f(N)
```

where `a` is the number of recursive subproblems, `N/b` is their size, and `f(N)` is division plus combination cost.

## 16. Master-Theorem Intuition

Compare:

```text
aN^(log_b a)
```

with the non-recursive work `f(N)`.

This gives useful asymptotic intuition for many balanced recurrences, but not every recurrence fits the theorem's assumptions.

## 17. Uneven Recursion

Quicksort and selection may produce uneven subproblems.

Analyze:

```text
T(N) = T(k) + T(N-k-1) + O(N)
```

rather than assuming balanced halves.

## 18. Recursion Tree

A recursion tree expands each recursive call as a node and sums work across levels.

This is especially useful when the recurrence is irregular or when deriving total work manually.

## 19. Tail and Stack Depth

Divide-and-conquer algorithms can consume stack proportional to recursion depth.

Balanced recursion usually gives logarithmic depth; adversarial partitioning can create linear depth.

Production JavaScript code should consider explicit stacks or randomized balancing when necessary.

## 20. In-Place vs Auxiliary Memory

Merge-based methods may require auxiliary buffers.

Partition-based methods can operate in place but may trade memory savings for more complicated invariants.

Always distinguish total space from auxiliary space.

## 21. Stable vs Unstable Algorithms

Merge sort can be implemented stably by preserving relative order when keys compare equal.

Quicksort partitioning is not inherently stable.

Stability matters when records have secondary semantic ordering.

## 22. Divide + Conquer + Combine

The combine step can be:

- merge;
- aggregate;
- boundary correction;
- cross-pair counting;
- partition metadata;
- geometric candidate filtering.

The combine operation often determines the overall complexity.

## 23. Counting Inversions

A merge-based divide-and-conquer algorithm can count cross-half inversions while merging.

If a right-half value is selected before remaining left-half values, those remaining left values form inversions with it.

## 24. Range Aggregation

Divide-and-conquer can combine partial aggregates from subranges.

This idea connects to segment trees and other hierarchical structures developed later.

## 25. Parallelism

Independent subproblems can potentially execute concurrently.

This creates a bridge between divide-and-conquer algorithms and parallel computation, although scheduling overhead and shared resources must be analyzed.

## 26. Backend Applications

Divide-and-conquer patterns appear in:

- batch processing;
- hierarchical aggregation;
- log/event processing;
- parallel data transformations;
- distributed partitioning;
- large dataset sorting.

## 27. AI Applications

Applications include:

- hierarchical search;
- recursive partitioning;
- spatial decomposition;
- tree-based inference;
- parallel preprocessing;
- divide-and-conquer candidate reduction.

## 28. Correctness Proof

A standard proof uses induction on problem size:

1. prove the base case;
2. assume recursive solutions are correct for smaller inputs;
3. prove the combine step produces the correct larger solution.

For partition algorithms, also prove the partition invariant.

## 29. Complexity

Always account for:

```text
recursive subproblem cost
+
division cost
+
combine cost
+
recursion depth
+
auxiliary memory
```

Do not infer complexity from recursion depth alone.

## 30. Common Mistakes

1. Forgetting the combine cost.
2. Assuming subproblems are independent when they share state.
3. Using an unproven partition invariant.
4. Assuming quicksort is always `O(N log N)`.
5. Ignoring recursion depth.
6. Confusing in-place with zero auxiliary memory.
7. Applying the Master Theorem outside its assumptions.
8. Losing stable ordering when it is required.

## 31. Edge Cases

Test:

- empty input;
- one element;
- duplicate-heavy input;
- already sorted input;
- reverse sorted input;
- all equal values;
- highly unbalanced partitions;
- odd-sized arrays;
- very deep recursion;
- records with equal keys.

## 32. Interview Framework

When divide and conquer appears:

```text
1. What is the decomposition?
2. Are subproblems independent?
3. What is the base case?
4. What information must cross the boundary?
5. What is the combine cost?
6. What recurrence describes the algorithm?
7. Is recursion balanced?
8. What is stack depth?
9. What auxiliary memory is required?
10. What invariant proves the partition/combine step?
```

## 33. Revision Checklist

- [ ] I can explain divide-and-conquer from first principles.
- [ ] I can derive merge sort.
- [ ] I understand partition invariants.
- [ ] I can explain quicksort's performance dependence on pivot quality.
- [ ] I can derive quickselect.
- [ ] I can write and solve common recurrences.
- [ ] I understand recursion-tree reasoning.
- [ ] I can count inversions using merge logic.
- [ ] I can analyze recursion depth and auxiliary space.
- [ ] I can connect divide-and-conquer to backend and AI workloads.

## 34. Key Takeaways

1. **Divide and conquer is defined by decomposition, recursive solution, and combination—not merely by recursion.**
2. **The combine step and partition invariant are often where correctness and complexity are decided.**
3. **Balanced recursion can provide logarithmic depth, while poor partitioning can create linear depth.**
4. **Quickselect demonstrates that a divide-and-conquer algorithm can discard one recursive branch entirely.**
5. **Recurrence analysis must include subproblem sizes, non-recursive work, recursion depth, and auxiliary memory.**
