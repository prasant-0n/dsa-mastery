# 08.24 — Phase 08 Searching Mastery & Capstone

## 1. Purpose

This capstone integrates Phase 08 into one production-oriented search engineering problem.

The objective is to demonstrate that you can:

```text
model → identify invariant → choose search strategy → implement → prove → analyze → test → benchmark → engineer
```

## 2. Capstone Scenario

Build a reusable **Search Engine Toolkit** for a backend service that receives multiple kinds of searchable data:

- primitive sorted arrays;
- duplicate-heavy arrays;
- rotated sorted arrays;
- nearly sorted arrays;
- 2D monotone matrices;
- complex records with custom ordering;
- monotone feasibility domains;
- repeated-query workloads.

The toolkit must not assume one universal search algorithm.

## 3. Core Requirement

Given a workload contract, the system must determine:

1. data representation;
2. ordering guarantees;
3. query semantics;
4. candidate-elimination strategy;
5. preprocessing opportunities;
6. complexity model;
7. correctness invariants;
8. failure behavior.

## 4. Required Search Algorithms

Implement and integrate:

1. linear search;
2. binary search;
3. lower bound;
4. upper bound;
5. first/last occurrence;
6. rotated-array search;
7. exponential search;
8. interpolation search;
9. Fibonacci search;
10. jump search;
11. nearly-sorted search;
12. staircase matrix search;
13. flattened matrix search;
14. comparator-based object search;
15. search on answer.

## 5. Contract-First Design

Every search function must document:

```text
Preconditions
Input shape
Ordering invariant
Target semantics
Result contract
Failure semantics
Time complexity
Auxiliary space
```

An implementation that works only because undocumented assumptions happen to hold is not considered complete.

## 6. Search Dispatcher

Design a dispatcher that receives a workload description such as:

```js
{
  ordered: true,
  structure: "array",
  ordering: "ascending",
  queryType: "lower-bound",
  repeatedQueries: true,
  comparatorCost: "low"
}
```

It should select an appropriate strategy based on explicit rules.

Do not encode a subjective universal “best” algorithm.

## 7. Primitive Array Layer

Support:

- exact lookup;
- first occurrence;
- last occurrence;
- insertion point;
- duplicate count;
- range query.

Use lower/upper bounds as reusable primitives.

## 8. Rotated Array Layer

Support exact membership under a documented rotation model.

For duplicate values, explicitly define whether the algorithm may degrade to linear behavior and test that case.

## 9. Nearly Sorted Layer

Support a documented maximum-displacement contract `k`.

Provide both:

```text
query-time bounded search
```

and:

```text
k-aware preprocessing
```

where appropriate.

## 10. Matrix Layer

Support separate contracts for:

- arbitrary matrices;
- row-sorted matrices;
- column-sorted matrices;
- row-and-column sorted matrices;
- globally flattened-sorted matrices.

Never dispatch an algorithm whose preconditions are not satisfied.

## 11. Object Layer

Support records searched through:

- key selectors;
- primitive comparators;
- compound comparators;
- deterministic tie-breakers.

Separate domain identity from ordering equality.

## 12. Search-on-Answer Layer

Support monotone predicates such as:

```text
feasible(x) === false ... false true ... true
```

Implement first-feasible and last-feasible boundaries.

The predicate contract must be explicit.

## 13. Correctness Requirements

For each algorithm document:

### Precondition
What must be true before execution?

### Invariant
What candidate region is guaranteed to contain the answer?

### Progress
What strictly decreases or advances?

### Postcondition
What does the returned result guarantee?

### Failure
How is “not found” or invalid input represented?

## 14. Proof Requirements

At minimum provide proof sketches for:

- binary search;
- lower bound;
- upper bound;
- rotated search;
- jump search;
- nearly-sorted search;
- staircase search;
- flattened matrix search;
- search on answer.

Each proof must connect the comparison rule to safe candidate elimination.

## 15. Complexity Requirements

Create a complexity table containing:

```text
Algorithm
Preconditions
Best
Average
Worst
Auxiliary Space
Preprocessing
Primary Use Case
```

Keep `R`, `C`, `k`, comparator cost, and query count `Q` explicit where relevant.

## 16. Workload Cost Model

For repeated queries model:

```text
TotalCost = PreprocessingCost + Q × QueryCost
```

For expensive comparators:

```text
TotalCost ≈ Comparisons × ComparatorCost
```

For remote or page-based access, include access latency in the model.

## 17. Adaptive Strategy

Design an optional policy that considers:

- input size;
- ordering strength;
- query count;
- preprocessing budget;
- memory budget;
- comparator cost;
- access cost.

The policy must be explainable from measurable workload properties.

## 18. Validation Layer

Implement validators for:

- sorted arrays;
- rotated arrays;
- k-displacement contracts;
- matrix ordering contracts;
- comparator consistency;
- monotone predicates.

Decide which validations occur at development/test time and which are enforced in production.

## 19. Reference Implementations

Maintain simple trusted references:

```text
linear array search
linear matrix search
linear range scan
small-domain answer scan
```

Optimized implementations must be differential-tested against these references.

## 20. Property Testing

Required properties include:

- exact search never reports an incorrect index;
- first occurrence has no earlier equal value;
- last occurrence has no later equal value;
- lower bound is minimal;
- upper bound is minimal;
- range boundaries are consistent;
- staircase search never eliminates a valid candidate;
- search-on-answer returns a valid minimal/maximal boundary.

## 21. Edge-Case Matrix

Test at minimum:

- empty input;
- singleton;
- two elements;
- all duplicates;
- target absent;
- target at both boundaries;
- extreme numeric values;
- rotated by zero;
- rotated by `n-1`;
- `k = 0`;
- `k >= n`;
- one-row matrix;
- one-column matrix;
- empty rows where supported;
- duplicate object keys;
- null/missing keys where supported;
- non-monotone predicates as invalid inputs.

## 22. Benchmark Suite

Benchmark across:

- `n`;
- `R × C` matrix shape;
- `k`;
- duplicate density;
- query count `Q`;
- target distribution;
- comparator cost;
- data representation.

Record:

- wall-clock time;
- comparison count;
- element-access count;
- preprocessing time;
- memory allocation where measurable.

## 23. Backend Integration

Expose search capabilities through realistic backend components:

### Pagination
Use deterministic compound cursor boundaries.

### Configuration
Binary-search threshold tables.

### Event Processing
Handle bounded-lateness ordering.

### In-Memory Indexes
Use ordered arrays when range semantics justify them.

### Cache
Select search/index structures according to query patterns.

## 24. AI Integration

Build example components for:

### Candidate Retrieval
Search ordered candidate metadata.

### Threshold Selection
Search a monotone quality/cost predicate.

### Ranking Boundaries
Use lower/upper bounds over sorted scores.

### Structured Metadata
Search records with compound comparators.

### Repeated Retrieval
Model preprocessing versus per-query search cost.

## 25. Observability

Instrument:

- selected strategy;
- input-size bucket;
- query count;
- comparison count;
- fallback count;
- validation failures;
- preprocessing time;
- query latency.

This turns algorithm selection into an observable engineering decision.

## 26. Failure Injection

Intentionally test:

- unsorted input passed to binary search;
- wrong `k` contract;
- malformed matrix ordering;
- inconsistent comparator;
- non-monotone predicate;
- duplicate boundary cases;
- invalid keys.

Verify that the system fails according to its documented contract.

## 27. Security Considerations

For externally supplied data, consider:

- adversarial distributions;
- pathological duplicate patterns;
- expensive comparator inputs;
- oversized workloads;
- memory amplification during preprocessing.

Algorithmic complexity is part of defensive engineering.

## 28. API Design

Design a consistent interface such as:

```text
search(data, query, options)
```

with explicit options for:

- strategy;
- comparator;
- key selector;
- ordering contract;
- duplicate semantics;
- validation mode.

Avoid silently guessing critical correctness assumptions.

## 29. Test Architecture

Organize tests into:

```text
unit tests
property tests
differential tests
contract tests
failure tests
benchmark tests
integration tests
```

Every optimized algorithm needs both normal and adversarial coverage.

## 30. Interview Defense

Be prepared to answer:

1. Why this algorithm?
2. What assumption makes it valid?
3. What invariant does it preserve?
4. Why is elimination safe?
5. How does it terminate?
6. What is the exact complexity?
7. What happens with duplicates?
8. What happens when the precondition is violated?
9. When would preprocessing change the decision?
10. What would change in a production backend?

## 31. Capstone Deliverables

Create:

1. `search/` algorithm implementations;
2. `search/validators/` contract validators;
3. `search/references/` trusted baselines;
4. `search/tests/` unit/property/differential tests;
5. `search/benchmarks/` workload benchmarks;
6. `search/docs/` contracts and proofs;
7. `search/backend/` backend examples;
8. `search/ai/` AI examples;
9. strategy-selection documentation;
10. complexity matrix.

## 32. Completion Standard

Phase 08 is mastered when you can take an unfamiliar search problem and independently:

```text
1. formalize the input
2. identify the invariant
3. establish a brute-force baseline
4. identify exploitable structure
5. derive candidate elimination
6. choose the algorithm
7. implement without off-by-one errors
8. prove correctness
9. derive complexity
10. test adversarial cases
11. benchmark realistic workloads
12. explain production trade-offs
```

## 33. Final Phase Checklist

- [ ] Linear search is automatic.
- [ ] Binary search is derived, not memorized.
- [ ] Lower/upper bounds are reliable.
- [ ] Duplicate semantics are explicit.
- [ ] Rotated arrays are understood.
- [ ] Exponential search is understood.
- [ ] Interpolation search assumptions are understood.
- [ ] Fibonacci search is understood.
- [ ] Jump search and block-cost modeling are understood.
- [ ] Nearly sorted search is understood.
- [ ] Matrix search contracts are understood.
- [ ] Comparator-based object search is understood.
- [ ] Search on answer is understood.
- [ ] Correctness proofs are routine.
- [ ] Differential/property testing is routine.
- [ ] Workload-level benchmarking is routine.
- [ ] Backend applications are understood.
- [ ] AI applications are understood.
- [ ] Production contracts and failure modes are explicit.

## 34. Phase 08 Mastery Statement

You have completed the phase when **search is no longer a collection of memorized loops**.

You should be able to recognize search as a general method of reducing a candidate space using a provable invariant, then select the representation, algorithm, preprocessing strategy, and cost model appropriate to the workload.

That reasoning transfers directly into backend systems, databases, distributed systems, and AI engineering.
