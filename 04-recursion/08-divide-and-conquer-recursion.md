# 04.8 — Divide & Conquer Recursion

## Purpose

Divide and conquer is one of the most important recursive algorithmic strategies.

Instead of processing a problem as one large unit, we:

```text
1. Divide the problem into smaller subproblems.
2. Recursively solve the subproblems.
3. Combine their results.
```

The central mental model is:

> Make the recursive subproblem substantially smaller, solve it correctly, then combine the smaller answers into the original answer.

---

# 1. The Divide-and-Conquer Shape

A generic algorithm looks like:

```text
solve(problem)
│
├── base case
│
├── divide
│   ├── subproblem A
│   └── subproblem B
│
├── solve(A)
├── solve(B)
│
└── combine(A, B)
```

The recursion is not the strategy by itself. **The decomposition and combination are the strategy.**

---

# 2. Three Essential Parts

Every divide-and-conquer algorithm should answer three questions:

### Divide
How is the original problem split?

### Conquer
What recursive problems are solved?

### Combine
How are the recursive results assembled?

If any of these is unclear, the algorithm design is incomplete.

---

# 3. Base Case

The base case represents a problem small enough to solve directly.

Examples:

```text
array of size 0
array of size 1
single tree node
range containing one element
```

A good base case should make the recursive result immediately known.

---

# 4. What Makes It Different from Ordinary Recursion?

Ordinary recursion may reduce the problem by one step:

```text
n → n - 1
```

Divide and conquer usually reduces it by a factor:

```text
n → n / 2
```

or creates multiple smaller subproblems:

```text
n → n/2 + n/2
```

This distinction is critical for complexity analysis.

---

# 5. Binary Search as Divide and Conquer

Binary search repeatedly discards half the search space.

```text
n
↓
n/2
↓
n/4
↓
n/8
↓
...
↓
1
```

The recurrence is:

```text
T(n) = T(n/2) + O(1)
```

Therefore:

```text
T(n) = O(log n)
```

---

# 6. Merge Sort

Merge sort divides an array into two halves:

```text
[8 3 5 1 7 2]
       ↓
[8 3 5] [1 7 2]
       ↓
 smaller sorted arrays
       ↓
       merge
```

Its recurrence is:

```text
T(n) = 2T(n/2) + O(n)
```

The `O(n)` merge work occurs at each recursion level.

Therefore:

```text
T(n) = O(n log n)
```

---

# 7. Recursion Tree

A recursion tree visualizes total work:

```text
                 n
              /     \
            n/2     n/2
           /  \     /  \
         n/4 n/4  n/4 n/4
```

For merge sort, each level processes approximately `n` elements.

There are approximately `log n` levels.

Therefore:

```text
n × log n = O(n log n)
```

---

# 8. Work Per Level

A powerful analysis technique is:

```text
total cost
= sum of work across recursion levels
```

Ask:

```text
How many subproblems exist at this level?
How large is each subproblem?
How much work happens outside recursive calls?
How many levels exist?
```

This often makes recursive complexity much easier to derive.

---

# 9. Uneven Division

The subproblems do not need to be equal.

For example:

```text
T(n) = T(n/3) + T(2n/3) + O(n)
```

The important property is that the subproblems become smaller and eventually reach the base case.

Equal halves are convenient, not mandatory.

---

# 10. Divide Without Copying

A common implementation mistake is physically creating new arrays during every recursive call.

Instead of:

```js
solve(arr.slice(0, mid));
solve(arr.slice(mid));
```

prefer index/range state when appropriate:

```js
solve(arr, left, mid);
solve(arr, mid + 1, right);
```

This can avoid repeated copying and unnecessary allocation.

---

# 11. Range-Based Recursive State

A typical divide-and-conquer state is:

```text
array + left + right
```

The recursive contract becomes:

> `solve(arr, left, right)` solves exactly the subarray from `left` through `right`.

This is a strong example of precise recursive state design.

---

# 12. Combine Step

The combine operation can be:

```text
merge two sorted arrays
choose minimum
choose maximum
sum results
construct a parent result
```

Some divide-and-conquer algorithms have almost no combine work.

For binary search, the decision after recursive reduction is effectively constant work.

---

# 13. Divide-and-Conquer Correctness

A correctness proof commonly follows:

### Base case
Show the direct solution is correct.

### Recursive assumption
Assume recursive calls correctly solve their smaller subproblems.

### Combine step
Show that correctly solved subproblems produce a correct original solution.

This is structural induction in algorithmic form.

---

# 14. Merge Sort Correctness

For merge sort:

1. Arrays of size 0 or 1 are sorted.
2. Assume both recursive halves become correctly sorted.
3. The merge procedure combines two sorted halves into one sorted array.
4. Therefore the complete array is sorted.

The proof mirrors the implementation.

---

# 15. Divide-and-Conquer vs Decrease-and-Conquer

These are related but different.

### Decrease-and-conquer
Usually solves one smaller instance:

```text
T(n) = T(n-1) + work
```

Examples:

- insertion sort reasoning;
- simple recursive accumulation.

### Divide-and-conquer
Usually solves multiple smaller instances:

```text
T(n) = aT(n/b) + work
```

Examples:

- merge sort;
- many recursive tree algorithms.

---

# 16. Binary vs Multiple Subproblems

The branching factor matters.

```text
one recursive call  → linear/decrease style
2 recursive calls   → binary branching
k recursive calls   → k-way divide-and-conquer
```

But branching factor alone does not determine complexity.

You must also account for subproblem size and work at each node.

---

# 17. Master-Theorem Pattern

A common recurrence is:

```text
T(n) = aT(n/b) + f(n)
```

where:

```text
a = number of subproblems
b = reduction factor
f(n) = non-recursive work
```

For standard polynomial `f(n)` cases, the Master Theorem provides a fast classification.

You should understand the reasoning behind it rather than treating it as a memorized formula.

---

# 18. Three Important Master-Theorem Cases

Let:

```text
T(n) = aT(n/b) + Θ(n^d)
```

Compare:

```text
n^(log_b a)
```

with:

```text
n^d
```

Conceptually:

- recursive-tree work dominates → one complexity class;
- equal growth → logarithmic factor appears;
- combine work dominates → another complexity class.

The theorem has technical conditions, so not every recurrence can be blindly inserted into it.

---

# 19. Common Divide-and-Conquer Algorithms

Important examples include:

```text
Binary Search
Merge Sort
Quick Sort
Closest Pair of Points
Karatsuba Multiplication
Strassen-style Matrix Multiplication
Divide-and-conquer counting techniques
```

Some advanced algorithms combine divide-and-conquer with other paradigms.

---

# 20. Quick Sort

Quick sort chooses a pivot and partitions the input around it.

Then:

```text
solve(left partition)
solve(right partition)
```

Average behavior can be:

```text
O(n log n)
```

but poor pivot choices can produce:

```text
O(n²)
```

Therefore partition quality and pivot strategy matter.

---

# 21. Randomized Divide and Conquer

Randomization can improve expected behavior.

Random pivot selection can reduce the probability of consistently producing highly unbalanced quick-sort partitions.

Important distinction:

```text
expected complexity ≠ guaranteed worst-case complexity
```

Always state which complexity guarantee you are discussing.

---

# 22. Divide-and-Conquer Space Complexity

Do not automatically claim `O(log n)` space.

Analyze:

```text
recursion depth
auxiliary arrays
temporary buffers
result allocation
partitioning
```

For merge sort, recursive depth is `O(log n)`, but merge buffers can require `O(n)` additional memory depending on implementation.

---

# 23. Recursion Depth vs Total Work

A binary recursion tree can contain many calls while having relatively small depth.

For example:

```text
Depth = O(log n)
Calls = O(n)
```

Therefore:

> Stack depth and total recursive work are different quantities.

This distinction must become automatic in complexity analysis.

---

# 24. Divide-and-Conquer with Return Values

A clean implementation often follows:

```js
function solve(input, left, right) {
    if (baseCase) return baseResult;

    const mid = chooseSplit(left, right);

    const leftResult = solve(input, left, mid);
    const rightResult = solve(input, mid + 1, right);

    return combine(leftResult, rightResult);
}
```

The exact state and combine operation change by problem.

---

# 25. Avoiding Accidental Quadratic Work

A divide-and-conquer structure can still become inefficient if each recursive call performs excessive copying or scanning.

Example danger:

```text
recursive calls
+ full-array scan at every level
+ repeated array copying
```

Always calculate:

```text
recursive work + local work + allocation cost
```

not merely the number of recursive calls.

---

# 26. Backend Applications

Divide and conquer appears in backend engineering through:

- batch processing;
- large dataset partitioning;
- parallel task decomposition;
- log/data aggregation;
- distributed job splitting;
- range queries;
- merge-based processing;
- hierarchical processing.

The principle scales beyond recursion: split work, process independently, combine results.

---

# 27. AI Applications

Divide and conquer is useful for:

- hierarchical document processing;
- recursive search;
- tree-based planning;
- recursive parsing;
- large-input preprocessing;
- spatial algorithms;
- distributed inference/data preparation.

The same decomposition principle appears in parallel and distributed AI pipelines.

---

# 28. Production Engineering Considerations

Recursive divide-and-conquer is elegant, but production code must consider:

```text
maximum depth
input size
allocation pressure
stack limits
parallel scheduling overhead
serialization cost
load balancing
failure propagation
```

For huge workloads, explicit work queues or iterative implementations may be safer.

---

# 29. When to Use It

Use divide and conquer when:

- the problem naturally splits into smaller independent subproblems;
- subproblems have the same general structure;
- their results can be combined efficiently;
- recursive decomposition simplifies correctness;
- parallel execution may be beneficial.

---

# 30. When Not to Use It

Avoid it when:

- subproblems overlap heavily and memoization/DP is more appropriate;
- splitting creates more overhead than useful work;
- the input structure does not naturally support decomposition;
- recursion depth becomes unsafe;
- the combine step is more expensive than the original problem.

Divide and conquer is a strategy, not a default requirement for every recursive problem.

---

# 31. Design Procedure

For a new problem:

```text
1. Define the complete problem.
2. Find a smaller equivalent subproblem.
3. Decide how many subproblems exist.
4. Define the exact recursive state/range.
5. Define the base case.
6. Solve subproblems recursively.
7. Design the combine step.
8. Prove correctness.
9. Derive the recurrence.
10. Analyze recursion depth.
11. Analyze allocations and auxiliary memory.
12. Check whether overlap suggests memoization instead.
```

---

# 32. Interview Explanation Template

A strong explanation sounds like:

> “I divide the input into smaller subproblems, recursively solve each one, and combine their results. The recursive state represents the exact remaining range. The base case handles the smallest valid range. The recurrence is `...`, giving `...` time and `...` auxiliary space.”

Then explain why the combine step is correct.

---

# 33. Revision Checklist

- [ ] Can I define divide and conquer?
- [ ] Can I distinguish divide-and-conquer from decrease-and-conquer?
- [ ] Can I identify divide, conquer, and combine?
- [ ] Can I design range-based recursive state?
- [ ] Can I derive binary-search complexity?
- [ ] Can I derive merge-sort complexity?
- [ ] Can I draw a recursion tree?
- [ ] Can I calculate work per level?
- [ ] Can I distinguish depth from total calls?
- [ ] Can I derive and interpret common recurrences?
- [ ] Can I explain the Master-Theorem pattern?
- [ ] Can I analyze quick-sort worst and expected behavior?
- [ ] Can I account for copying and allocation?
- [ ] Can I identify overlapping subproblems?
- [ ] Can I apply divide and conquer to backend/AI workloads?

# Key Takeaways

1. Divide and conquer recursively solves smaller versions of the same problem.
2. Its three pillars are divide, conquer, and combine.
3. Binary search demonstrates logarithmic recursive depth.
4. Merge sort demonstrates multiple recursive calls plus linear combine work.
5. Recursion-tree analysis reveals total work across levels.
6. Range/index state often avoids unnecessary copying.
7. Stack depth is not the same as total recursive work.
8. The recurrence captures the algorithm's true cost.
9. Overlapping subproblems may indicate dynamic programming rather than pure divide and conquer.
10. Production implementations must account for stack limits, allocation, load balancing, and overhead.
