# 08.01 — Searching Fundamentals & Search-Space Reasoning

## 1. Concept Definition

Searching is the process of locating information, a position, a state, or an answer within a defined search space.

At the most basic level:

```text
search space
     ↓
search strategy
     ↓
candidate evaluation
     ↓
found / not found / best answer
```

Searching is broader than scanning an array. It includes:

- sequential search;
- binary search;
- search over ranges;
- search over states;
- search over trees and graphs;
- search over answer values;
- backend lookup systems;
- AI retrieval and candidate search.

## 2. Why Searching Exists

Without a search strategy, a program may repeatedly inspect every possible candidate.

The engineering goal is to reduce unnecessary work by exploiting structure in the search space.

Examples:

```text
Unordered data → linear search
Sorted data   → binary search may apply
Monotonic answer space → binary search on answer
Graph states  → BFS / DFS / informed search
Indexed data  → direct lookup
```

The central question is:

> **What structure does the search space provide, and how can the algorithm exploit it?**

## 3. Mental Model

Think of searching as progressively eliminating candidates.

```text
Candidate space
┌─────────────────────────────┐
│ 0 1 2 3 4 5 6 7 8 9         │
└─────────────────────────────┘
              ↓
        inspect / test
              ↓
┌───────────────┐   ┌─────────┐
│ possible       │   │ ruled   │
│ candidates     │   │ out     │
└───────────────┘   └─────────┘
```

A strong search algorithm identifies a rule that safely eliminates candidates.

## 4. Search Space

A search space is the set of candidates that could potentially satisfy the problem.

It may be:

```text
array indices
numbers in a range
strings
subsets
permutations
graph nodes
tree nodes
configuration states
possible answers
```

Before choosing an algorithm, explicitly define the search space.

## 5. Candidate, Predicate & Answer

Three concepts should be separated:

### Candidate
An object being considered.

### Predicate
A condition that determines whether a candidate is acceptable.

### Answer
The candidate or property the problem asks you to return.

Example:

```text
Find first value >= target in sorted array.
```

```text
candidate → array index
predicate → array[index] >= target
answer    → smallest index satisfying predicate
```

This formulation prepares the problem for binary search.

## 6. Search Goal Types

Common search goals include:

1. **Existence** — does a candidate exist?
2. **Position** — where is it?
3. **First occurrence** — what is the smallest valid position?
4. **Last occurrence** — what is the largest valid position?
5. **Boundary** — where does a condition change?
6. **Optimization** — what is the minimum/maximum feasible answer?
7. **Enumeration** — what are all valid candidates?
8. **Nearest candidate** — which candidate minimizes a distance?

The goal determines the search invariant.

## 7. Linear Search

For an unordered collection, the basic strategy is:

```text
for each candidate:
    evaluate candidate
    if valid:
        return candidate
```

For `n` elements:

```text
Best case  → O(1)
Worst case → O(n)
```

Linear search is often the correct baseline even when a more advanced method may later be possible.

## 8. Why Start With Brute Force

A brute-force search establishes:

- correctness baseline;
- exact search space;
- candidate predicate;
- complexity baseline;
- optimization opportunities.

Never optimize before understanding what the brute-force algorithm is actually doing.

## 9. Search-Space Structure

The most important optimization question is:

> **What information lets me eliminate multiple candidates at once?**

Examples:

```text
sorted order → binary elimination
hash index   → direct expected lookup
prefix state → indexed state lookup
monotonic predicate → binary search on answer
graph edges  → traversal structure
```

## 10. Sorted Search Spaces

Sorting creates an ordering invariant.

For a sorted array:

```text
A[i] <= A[i+1]
```

This enables comparisons to eliminate an entire region.

Without the required ordering property, binary search is not automatically valid.

## 11. Binary Search Mental Model

Binary search repeatedly divides the candidate interval.

```text
[ L ---------------- R ]
          ↓
         mid
       /     \
 discard   retain
 half        half
```

The search interval shrinks geometrically.

Therefore:

```text
T(n) = T(n/2) + O(1)
     = O(log n)
```

## 12. Binary Search Is About Invariants

A correct binary search maintains a precise statement about the interval.

Examples:

```text
answer is always inside [L, R]
```

or:

```text
all indices before L are known invalid
all indices at/after R satisfy the predicate
```

The exact invariant depends on the binary-search variant.

## 13. Search Interval Conventions

Common conventions:

### Closed interval

```text
[L, R]
```

### Half-open interval

```text
[L, R)
```

Both are valid.

The important requirement is consistency between:

- initialization;
- midpoint calculation;
- predicate evaluation;
- boundary updates;
- termination.

## 14. Midpoint Calculation

Conceptually:

```text
mid = floor((L + R) / 2)
```

In languages/runtime environments where integer overflow is possible, use an overflow-safe formulation such as:

```text
mid = L + floor((R - L) / 2)
```

JavaScript's `Number` model has different integer behavior than fixed-width integer languages, but the safe mental model remains useful for transferable algorithmic reasoning.

## 15. Binary Search Termination

Every iteration must make measurable progress.

A common failure is:

```text
L = mid
```

when `mid === L`, causing an infinite loop.

Boundary updates must guarantee that the candidate interval becomes smaller.

## 16. Exact Match Binary Search

Goal:

```text
find target in sorted array
```

At each step:

```text
A[mid] === target → found
A[mid] < target    → discard left side including mid
A[mid] > target    → discard right side including mid
```

Complexity:

```text
O(log n) time
O(1) auxiliary space
```

for iterative implementation.

## 17. Lower Bound

Lower bound finds the first position satisfying:

```text
A[i] >= target
```

For a sorted array, the predicate:

```text
P(i) = A[i] >= target
```

is monotonic:

```text
false false false true true true
```

Binary search can locate the transition.

## 18. Upper Bound

Upper bound finds the first position satisfying:

```text
A[i] > target
```

Again the predicate is monotonic:

```text
false false false true true
```

Lower/upper bound are foundational because they generalize binary search beyond exact equality.

## 19. Boundary Search

Many binary-search problems are really boundary problems:

```text
false false false | true true true
                  ↑
                answer
```

The algorithm searches for the transition rather than a specific value.

This is a more powerful mental model than memorizing one exact-match template.

## 20. Search on Answer

Sometimes the array itself is not sorted, but the **answer space** is monotonic.

Example structure:

```text
Can we complete the task with capacity C?
```

The predicate may look like:

```text
C too small → false
C sufficient → true
```

Then binary search can find the smallest feasible `C`.

## 21. Search-on-Answer Requirements

Before applying binary search to an answer range, verify:

1. The candidate answer space is ordered.
2. A feasibility predicate can be computed.
3. The predicate is monotonic.
4. The required boundary can be identified.

Without monotonicity, binary search can eliminate valid answers incorrectly.

## 22. Feasibility Predicate

Optimization problems often become:

```text
minimize X
subject to feasible(X)
```

or:

```text
maximize X
subject to feasible(X)
```

If feasibility is monotonic, binary search may reduce the optimization problem to repeated decision problems.

## 23. Complexity of Search on Answer

If the answer range contains `R` possible values and each feasibility check costs `F(n)`:

```text
Total ≈ O(F(n) · log R)
```

Example:

```text
feasibility = O(n)
answer range = R
→ O(n log R)
```

Always include both dimensions.

## 24. Search With Duplicates

Duplicates make exact-match search ambiguous.

The problem may ask for:

- any occurrence;
- first occurrence;
- last occurrence;
- count of occurrences;
- insertion position.

These require different invariants even though all use binary search.

## 25. Search vs Hashing

Hashing and binary search solve different structural problems.

| Requirement | Typical approach |
|---|---|
| Exact membership, unordered | Set/Map |
| Ordered lookup | Binary search |
| Range boundaries | Binary search |
| Frequency by key | Map |
| Sorted insertion position | Binary search |
| Dynamic ordered set | Balanced tree / specialized structure |

Do not confuse expected constant-time lookup with ordered search capabilities.

## 26. Search vs Sorting

If data is unsorted and only one search is needed:

```text
linear search → O(n)
```

Sorting first costs at least roughly:

```text
O(n log n)
```

and may not be worthwhile.

If many searches follow, preprocessing can change the trade-off:

```text
sort → O(n log n)
queries → O(log n) each
```

The correct choice depends on total workload.

## 27. Preprocessing as Search Optimization

Searching is often optimized by building an index:

```text
data
 ↓
preprocessing/index
 ↓
repeated queries
```

Possible indexes include:

- hash maps;
- sorted arrays;
- trees;
- inverted indexes;
- database indexes.

The preprocessing cost must be amortized across enough queries to justify it.

## 28. Search Space Reduction

General optimization pattern:

```text
large search space
      ↓
identify structure
      ↓
eliminate impossible candidates
      ↓
smaller search space
```

This principle appears throughout DSA:

- binary search;
- two pointers;
- pruning;
- BFS/DFS;
- branch and bound;
- dynamic programming;
- heuristic search.

## 29. Correctness Framework

For every search algorithm define:

### Candidate set
What can still be the answer?

### Invariant
What remains guaranteed after every iteration?

### Elimination rule
Why can discarded candidates never be the answer?

### Termination
When can the remaining search space no longer shrink?

### Result interpretation
How does the final state map to the requested answer?

## 30. Common Binary Search Mistakes

1. Applying binary search to unsorted data without another monotonic property.
2. Mixing closed and half-open interval conventions.
3. Incorrect boundary updates.
4. Infinite loops from non-shrinking intervals.
5. Returning `mid` when the problem asks for a boundary.
6. Forgetting duplicates.
7. Using the wrong monotonic predicate.
8. Ignoring answer-space bounds.
9. Mishandling empty arrays.
10. Failing to verify the final candidate.

## 31. Edge Cases

Always test:

- empty array;
- one element;
- target smaller than all values;
- target larger than all values;
- target equal to first value;
- target equal to last value;
- all values identical;
- many duplicates;
- target absent;
- two-element ranges;
- minimum/maximum answer bounds.

## 32. Backend Applications

Searching appears in backend engineering through:

- sorted in-memory indexes;
- time-range lookup;
- log/event search;
- pagination boundaries;
- threshold selection;
- capacity planning;
- rate-limit parameter search;
- database query planning concepts.

For large production datasets, application-level binary search is only one layer; database indexes and query engines usually perform the actual search.

## 33. AI Applications

Searching appears in AI systems through:

- sorted candidate thresholds;
- nearest-neighbor search;
- beam search;
- tree search;
- hyperparameter search;
- threshold tuning;
- retrieval candidate selection;
- search over discrete configuration spaces.

AI search often extends basic search with scoring, heuristics, pruning, or approximate methods.

## 34. Search and Retrieval

A retrieval system can be modeled as:

```text
query
 ↓
candidate space
 ↓
retrieval/index
 ↓
candidate set
 ↓
ranking/scoring
 ↓
final results
```

This separates **finding candidates** from **ranking candidates**.

## 35. Nearest Search

Searching for a nearest value differs from exact membership.

In sorted data, binary search can locate the insertion region, after which neighboring candidates can be compared.

This is a reusable technique:

```text
binary search → neighborhood → evaluate nearest candidate
```

## 36. Monotonicity

Monotonicity is one of the most important concepts in advanced search.

A predicate is monotonic over an ordered domain when it changes direction at most once for the relevant boundary search.

Typical form:

```text
false false false true true true
```

Binary search finds the transition efficiently.

## 37. Decision Problems

Optimization can often be transformed:

```text
Optimization problem
        ↓
Decision question
        ↓
Is X feasible?
        ↓
Monotonic predicate
        ↓
Binary search
```

This transformation is a major interview pattern.

## 38. Search Complexity Hierarchy

For a single operation:

```text
O(1)      direct/indexed access
O(log n)  binary search on ordered space
O(n)      linear scan
O(n log n) sorting/preprocessing
```

But the best strategy depends on whether preprocessing and repeated queries are included in the workload.

## 39. Production Performance Model

Real search cost includes:

```text
comparison cost
+ key extraction
+ serialization
+ memory access
+ cache locality
+ I/O
+ network latency
+ index maintenance
```

Asymptotic complexity is necessary but not sufficient for production performance analysis.

## 40. Interview Reasoning Template

When given a search problem:

```text
1. Define the candidate space.
2. Define the predicate/goal.
3. Determine whether the space is ordered.
4. Identify monotonicity or another exploitable structure.
5. Write brute force.
6. Identify repeated/unnecessary work.
7. Derive the elimination rule.
8. State the invariant.
9. Implement consistently.
10. Prove correctness.
11. Analyze complexity.
12. Test boundary cases.
```

## 41. Interview Explanation Template

A strong concise explanation:

> “The search space is ____. The key property is ____. Because the predicate is ordered/monotonic, after checking the midpoint I can safely eliminate ____. I maintain the invariant ____. Therefore the search takes O(log n) iterations, with each iteration costing ____, for total O(____).”

## 42. Implementation Lab

Implement from scratch:

1. linear search;
2. iterative binary search;
3. recursive binary search;
4. lower bound;
5. upper bound;
6. first occurrence;
7. last occurrence;
8. insertion position;
9. nearest value in sorted data;
10. binary search on answer.

Do not copy a template before deriving the invariant.

## 43. Practice Progression

### Level 1 — Direct Search

- find value;
- find index;
- detect absence;
- count comparisons.

### Level 2 — Boundary Search

- first occurrence;
- last occurrence;
- lower bound;
- upper bound.

### Level 3 — Structured Search

- rotated sorted arrays;
- peak/boundary problems;
- nearly sorted data.

### Level 4 — Search on Answer

- minimum feasible capacity;
- maximum feasible rate;
- allocation thresholds.

### Level 5 — Engineering

- repeated queries;
- index selection;
- backend search design;
- AI retrieval/search systems.

## 44. Revision Checklist

- [ ] I can define a search space precisely.
- [ ] I can write a brute-force search first.
- [ ] I understand candidate/predicate/answer separation.
- [ ] I can recognize when ordering enables binary search.
- [ ] I can state a binary-search invariant.
- [ ] I can use closed or half-open intervals consistently.
- [ ] I can implement exact-match binary search.
- [ ] I can derive lower/upper bounds.
- [ ] I can search for boundaries.
- [ ] I can recognize monotonic answer spaces.
- [ ] I can derive search-on-answer solutions.
- [ ] I can analyze preprocessing vs query trade-offs.
- [ ] I can compare hashing and binary search.
- [ ] I can explain correctness and complexity.
- [ ] I can identify edge cases that threaten termination.

## 45. Key Takeaways

1. **Searching is fundamentally about exploring a candidate space while eliminating candidates safely.**
2. **The first step is always to define the search space and goal.**
3. **Linear search is the baseline for unordered data.**
4. **Binary search requires exploitable ordering or monotonicity.**
5. **Binary search is best understood through invariants, not memorized code.**
6. **Lower bound and upper bound turn binary search into a general boundary-finding technique.**
7. **Search on answer converts monotonic optimization problems into decision problems.**
8. **Preprocessing can make repeated search cheaper, but its cost must be included in the workload model.**
9. **Hashing provides fast expected membership while binary search provides ordered search and boundary capabilities.**
10. **Expert search reasoning is the ability to identify structure, derive safe elimination, prove correctness, and quantify the full cost.**
