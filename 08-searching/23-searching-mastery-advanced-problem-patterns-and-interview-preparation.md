# 08.23 — Searching Mastery: Advanced Problem Patterns & Interview Preparation

## 1. Purpose

This chapter consolidates Phase 08 into a reusable search-selection and interview framework.

The goal is not memorizing algorithms. The goal is deriving the search strategy from:

```text
input representation
+ ordering invariant
+ query semantics
+ workload
+ access model
+ correctness contract
```

## 2. The Search Decision Pipeline

Use this sequence:

1. What exactly must be found?
2. Is the data ordered?
3. What ordering guarantee exists?
4. Is the query exact, boundary, range, or optimization-based?
5. Is preprocessing allowed?
6. How many queries will be executed?
7. What does one data access cost?
8. What are the memory constraints?

Only then select an algorithm.

## 3. Baseline Search

If there is no useful structure, start with linear search:

```text
O(n)
```

This is the correctness baseline against which optimized searches should be tested.

## 4. Binary Search

Use binary search when a monotone ordering invariant permits half-interval elimination.

Typical complexity:

```text
O(log n)
```

The essential invariant is that every discarded region is proven unable to contain the answer.

## 5. Lower and Upper Bounds

Many practical searches are boundary problems rather than exact-membership problems.

Lower bound:

```text
first position with value >= target
```

Upper bound:

```text
first position with value > target
```

These primitives support insertion points, ranges, duplicates, and pagination.

## 6. Duplicate-Aware Search

For duplicates, always distinguish:

- any occurrence;
- first occurrence;
- last occurrence;
- count;
- complete range.

The same input can require different algorithms or boundary semantics depending on the requested result.

## 7. Rotated Sorted Arrays

A rotated sorted array contains sorted regions separated by a rotation boundary.

The key reasoning task is identifying which half remains sorted and whether the target lies inside that half.

Do not use ordinary binary search without adapting the invariant.

## 8. Nearly Sorted Arrays

If elements have bounded displacement `k`, exploit that guarantee.

Possible strategies include:

- bounded-neighborhood search;
- k-aware heap preprocessing;
- repeated-query indexing.

The contract must define what “nearly sorted” means.

## 9. Block-Based Search

Jump search uses:

```text
blocks + local scan
```

with general cost:

```text
O(n / b + b)
```

The classical `b = sqrt(n)` choice assumes a simple unit-cost model.

## 10. Fibonacci Search

Fibonacci search partitions the candidate interval using Fibonacci offsets.

Its classical complexity is logarithmic, but binary search and Fibonacci search should be compared using the actual access model rather than complexity alone.

## 11. Interpolation Search

Interpolation search estimates the likely target position using key values.

It can be effective for suitable numeric distributions but has weaker worst-case behavior than binary search.

Its correctness requires ordered numeric data; its performance depends on distribution assumptions.

## 12. Exponential Search

Exponential search is useful when the upper boundary is unknown or when searching an unbounded conceptual sequence.

Typical structure:

```text
expand boundary exponentially
→ binary search discovered interval
```

This gives `O(log p)` behavior when the target is near position `p`.

## 13. Search on Answer

Some problems do not ask for an existing value. They ask for the smallest or largest feasible answer.

If feasibility is monotone:

```text
false false false true true true
```

binary search can operate over the **answer space** rather than the input array.

## 14. Monotone Predicate

The reusable pattern is:

```text
predicate(x)
```

where the predicate changes direction at most once.

Then find the boundary between false and true.

This pattern is fundamental to advanced binary-search problems.

## 15. Continuous Search

Binary-search-like reasoning can also be applied to continuous numeric domains when a monotone predicate or sufficient numerical condition exists.

The termination criterion becomes an error tolerance rather than an integer interval becoming empty.

## 16. 2D Search

First identify the matrix contract:

- unsorted;
- row sorted;
- column sorted;
- row and column sorted;
- globally flattened sorted.

Then choose the corresponding elimination strategy.

## 17. Object Search

For complex objects, inject ordering through:

```text
comparator
```

or:

```text
key selector + primitive comparator
```

Keep identity semantics separate from ordering semantics.

## 18. Search vs Hashing

Ordered search is useful when:

- ordering matters;
- range queries matter;
- sorted output already exists.

Hashing is useful when:

- exact membership dominates;
- ordering is irrelevant;
- expected constant-time lookup is valuable.

The choice is workload-dependent.

## 19. Search vs Heap

A heap answers priority-selection questions.

Searching answers membership or boundary questions.

Sometimes preprocessing with a heap can transform an input into an ordered representation, but the underlying objectives remain different.

## 20. Search vs Database Index

At database scale, application code should generally use the database's indexing and query engine rather than copying large datasets into application memory solely to run a textbook search.

The DSA reasoning remains valuable because database indexes implement structured search ideas at a different storage layer.

## 21. Access Model

Traditional complexity often assumes:

```text
one array access ≈ constant cost
```

Real systems may have:

- cache misses;
- disk/page reads;
- remote access;
- decompression;
- expensive key extraction.

A search algorithm should be evaluated under the actual cost model when performance matters.

## 22. Comparator Cost

For object searches:

```text
search cost ≈ number of comparisons × comparator cost
```

Thus `O(log n)` comparisons do not guarantee negligible latency.

## 23. Query Workload

For repeated queries compare:

```text
Q × queryCost
```

with:

```text
preprocessing + Q × indexedQueryCost
```

This often changes the best architecture.

## 24. Correctness Framework

For every search algorithm identify:

### Precondition
What must be true before execution?

### Invariant
What remains true after every iteration?

### Progress Measure
Why does the algorithm move toward termination?

### Postcondition
What does the returned result guarantee?

### Failure Semantics
How is “not found” represented?

## 25. Termination Framework

Common progress measures include:

- interval length decreases;
- index strictly increases;
- index strictly decreases;
- candidate blocks decrease;
- remaining answer space shrinks.

A correct search must make progress under every control-flow path.

## 26. Complexity Framework

For each algorithm report:

```text
best case
average case, when meaningful
worst case
auxiliary space
preprocessing cost
query cost
amortized cost, when applicable
```

Do not hide preprocessing inside query complexity.

## 27. Adversarial Inputs

Search implementations should be tested against:

- empty data;
- singleton data;
- boundary targets;
- absent targets;
- duplicates;
- extreme values;
- malformed ordering;
- pathological distributions;
- very large inputs.

## 28. Differential Testing

Maintain a simple trusted reference:

```text
linear scan
```

Then generate many valid inputs and compare optimized results against the reference.

For invalid contracts, verify that validation or documented failure behavior occurs.

## 29. Property Testing

Useful properties include:

- returned index contains the target;
- no earlier index satisfies first-occurrence semantics;
- no later index satisfies last-occurrence semantics;
- lower bound is minimal;
- upper bound is minimal;
- all eliminated regions satisfy the algorithm's exclusion proof.

## 30. Benchmarking Method

Benchmark by workload rather than by one convenient example.

Vary:

- input size;
- target distribution;
- duplicate density;
- query count;
- data shape;
- comparator cost;
- cache/access model.

Record both latency and operation counts.

## 31. Pattern Recognition Checklist

When seeing a problem, ask:

```text
Sorted?
    ↓
Yes → What is monotone?
    ↓
Exact value → binary-family search
Boundary → lower/upper bound
Unknown bound → exponential search
Nearly sorted → exploit displacement
2D monotone → staircase/2D strategy
Feasibility monotone → search on answer
Complex objects → comparator/key search
No useful order → linear/hash/index strategy
```

## 32. Interview Derivation Template

A strong explanation can follow:

1. State the invariant.
2. Explain the brute-force baseline.
3. Identify exploitable structure.
4. Explain how one step eliminates candidates.
5. Prove the target cannot be eliminated incorrectly.
6. Explain termination.
7. Derive complexity.
8. Discuss edge cases.
9. State production trade-offs.

## 33. Common Interview Traps

1. Applying binary search to data that is not globally ordered.
2. Returning an arbitrary duplicate when a boundary is required.
3. Off-by-one errors in `low`, `high`, and midpoint updates.
4. Infinite loops caused by non-shrinking intervals.
5. Forgetting integer overflow in languages where it matters.
6. Assuming comparator equality means object identity.
7. Ignoring preprocessing cost.
8. Giving only Big-O without stating assumptions.
9. Ignoring invalid input contracts.
10. Optimizing before establishing a reference implementation.

## 34. Backend Applications

Search reasoning appears in:

- cursor pagination;
- time-range lookup;
- sorted caches;
- configuration thresholds;
- in-memory indexes;
- event ordering;
- rate-limit windows;
- scheduling boundaries;
- log and telemetry queries.

## 35. AI Applications

Search reasoning appears in:

- candidate retrieval;
- threshold selection;
- ranking boundaries;
- sorted scores;
- approximate candidate filtering;
- structured retrieval metadata;
- monotone hyperparameter feasibility searches.

The algorithm should match the representation and objective rather than being selected because it is a familiar interview pattern.

## 36. Production Engineering

Before shipping a search implementation:

- document preconditions;
- validate or enforce ordering where appropriate;
- define duplicate semantics;
- define error/not-found behavior;
- test boundaries;
- instrument expensive comparisons;
- benchmark realistic workloads;
- protect against malformed data.

## 37. Implementation Lab

Build a unified search library containing:

1. linear search;
2. binary search;
3. lower bound;
4. upper bound;
5. rotated-array search;
6. exponential search;
7. interpolation search;
8. Fibonacci search;
9. jump search;
10. nearly-sorted search;
11. staircase matrix search;
12. comparator-based object search;
13. monotone predicate search.

Every implementation should expose its contract and include reference tests.

## 38. Master Practice Set

Solve progressively:

### Level 1 — Fundamentals
- exact membership;
- first occurrence;
- last occurrence;
- insertion position;
- count duplicates.

### Level 2 — Variants
- rotated arrays;
- nearly sorted arrays;
- exponential search;
- jump search;
- Fibonacci search.

### Level 3 — Structured Data
- 2D matrices;
- custom comparators;
- compound keys;
- range queries;
- cursor boundaries.

### Level 4 — Search on Answer
- capacity feasibility;
- minimum maximum load;
- threshold optimization;
- monotone scheduling constraints.

### Level 5 — Engineering
- benchmark competing searches;
- design preprocessing policies;
- account for comparator cost;
- build differential/property tests.

## 39. Interview Questions

1. When is binary search valid?
2. What invariant does binary search maintain?
3. How do you derive lower bound?
4. Why can binary search fail on rotated arrays?
5. What is the difference between jump and exponential search?
6. Why does jump search use `sqrt(n)` traditionally?
7. When can Fibonacci search be useful?
8. What exactly does “nearly sorted” mean?
9. How do you search a row-and-column sorted matrix?
10. When can a matrix be flattened for binary search?
11. How do you binary-search objects?
12. How does comparator cost affect complexity?
13. What is search on answer?
14. How do you prove a feasibility predicate is monotone?
15. When should preprocessing replace repeated searching?

## 40. Final Revision Checklist

- [ ] I can derive binary search instead of memorizing it.
- [ ] I can implement lower/upper bounds without off-by-one errors.
- [ ] I can identify when binary search is invalid.
- [ ] I can adapt search to rotated and nearly sorted data.
- [ ] I understand jump, Fibonacci, interpolation, and exponential search.
- [ ] I can search structured 2D data from its ordering invariant.
- [ ] I can search objects through comparators.
- [ ] I can recognize monotone predicates and search on answer.
- [ ] I can model preprocessing and repeated-query cost.
- [ ] I can prove correctness and termination.
- [ ] I can benchmark under a realistic access model.
- [ ] I can explain trade-offs clearly in an interview.

## 41. Key Takeaways

1. **Search is fundamentally candidate-space elimination.**
2. **The strongest valid invariant should drive algorithm selection.**
3. **Binary search is a family of boundary-search techniques, not merely an exact lookup loop.**
4. **Duplicates, ordering contracts, and result semantics must be explicit.**
5. **Search-on-answer extends binary-search reasoning beyond arrays.**
6. **Preprocessing changes the economics of repeated queries.**
7. **Comparator cost and physical access cost belong in real performance analysis.**
8. **Correctness comes from an invariant plus a proof that every elimination is safe.**
9. **The interview skill is deriving the algorithm from constraints, not recalling a template.**
10. **The engineering skill is knowing when the textbook model does not match the production access model.**
