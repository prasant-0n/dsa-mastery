# 31 — DP with Data Structures: Fenwick Trees, Segment Trees & Online Transitions

> **Phase 17 — Dynamic Programming**

## 1. Why Data Structures Belong in DP

A classic DP transition may look like:

`dp[i] = value[i] + max(dp[j])` over many earlier states `j` satisfying a condition.

The recurrence is correct, but evaluating every candidate independently can make the implementation `O(n²)`.

The deeper optimization is:

> **Separate the DP recurrence from the data structure that aggregates eligible previous states.**

If eligibility can be represented as a point or range query, a Fenwick tree, segment tree, heap, deque, or another indexed structure can maintain the required aggregate efficiently.

---

## 2. Transition-Aggregation Pattern

Rewrite a recurrence as:

`dp[i] = localContribution(i) ⊕ aggregate(valid predecessors)`

where `⊕` may represent maximum, minimum, sum, count, XOR, or another associative operation.

The DP defines **which states are valid**. The data structure defines **how their aggregate is maintained**.

This separation is the key recognition skill for data-structure-accelerated DP.

---

## 3. Weighted Increasing Subsequence

For items `(key, weight)`:

`dp[i] = weight[i] + max(dp[j])` for `key[j] < key[i]`.

The naive implementation scans all `j < i`, producing `O(n²)` time.

After coordinate compression, a Fenwick tree can maintain the best DP value by key:

```text
query(keys < currentKey)
compute dp[i]
update(currentKey, dp[i])
```

The recurrence does not change; only predecessor aggregation is accelerated.

---

## 4. Coordinate Compression

Problem coordinates may be huge, negative, sparse, or timestamps. Indexed structures generally need compact integer positions.

Compression maps:

```text
raw ordered values
        ↓
sorted unique values
        ↓
ranks 1..m
```

The important property is preservation of ordering.

For strict `<` versus non-strict `<=`, use lower/upper-bound semantics carefully. Duplicate coordinates are a major source of incorrect optimized DPs.

---

## 5. Fenwick Tree for Prefix Aggregation

A Fenwick tree supports point updates and prefix queries in `O(log n)`.

For prefix maximum:

```text
update(pos, value) → improve stored maxima
query(pos)         → max over [1..pos]
```

Unlike ordinary sum Fenwick trees, a max Fenwick structure relies on a monotone improvement model. Arbitrary replacement/deletion requires additional techniques or a different data structure.

---

## 6. Algebra Determines the Data Structure

Do not memorize a Fenwick implementation without understanding its invariant.

Examples:

- sum + additive point updates → natural;
- max + monotone point improvements → natural;
- min + monotone point improvements → natural;
- arbitrary replacement under max → not automatically supported by the simple max Fenwick model;
- range queries with arbitrary updates → often better served by a segment tree.

The operation and update semantics must match.

---

## 7. Strict vs Non-Strict Transitions

For `key[j] < key[i]`, equal-key states must not become predecessors.

A robust pattern is to batch equal keys:

1. query all states in the equal-key group;
2. compute all their DP values;
3. update the structure only after the group is complete.

This preserves layer semantics and prevents accidental same-key chains.

---

## 8. Segment Trees

Segment trees provide general interval aggregation and point updates in `O(log n)`.

A DP transition can become:

`dp[i] = cost[i] + query(L(i), R(i))`.

This is useful when the predecessor condition is an arbitrary coordinate interval rather than a prefix.

Compared with Fenwick trees, segment trees offer more flexible range queries and richer node summaries.

---

## 9. Rich DP Summaries

A tree node can store a compound summary such as:

```text
{
  value,
  count,
  index,
  parent
}
```

This permits one structure to answer:

- best value;
- number of optimal ways;
- deterministic tie-breaking;
- reconstruction information.

The merge operation must define all fields consistently.

---

## 10. Range-Transition DP

Many quadratic recurrences have the form:

`dp[i] = cost[i] + max(dp[j])` where `coordinate(j) ∈ [L(i), R(i)]`.

The optimization process is:

```text
derive naive recurrence
        ↓
identify predecessor geometry
        ↓
map geometry to indexed coordinates
        ↓
replace scan with range aggregation
```

This pattern appears in scheduling, event processing, bounded-distance transitions, and ordered resource planning.

---

## 11. Online DP

When states must be processed in dependency order, an online structure maintains summaries as states arrive:

```text
state i
  ↓
query previous states
  ↓
compute dp[i]
  ↓
insert/update dp[i]
```

The ordering is part of the correctness argument. A state must never observe information that is not a valid predecessor under the recurrence.

---

## 12. Weighted Scheduling Connection

Weighted interval scheduling has:

`dp[i] = max(dp[i-1], weight[i] + dp[p(i)])`.

Binary search finds one predecessor `p(i)`. More general scheduling constraints may yield an entire interval of valid predecessors.

When predecessor eligibility becomes a range, indexed aggregation can replace repeated scanning.

---

## 13. Two-Dimensional Dominance

Some transitions require:

`x[j] < x[i]` and `y[j] < y[i]`.

A one-dimensional Fenwick tree is no longer enough.

Possible techniques include:

- CDQ divide-and-conquer;
- nested Fenwick structures;
- segment trees of structures;
- offline dominance sweeps;
- multidimensional coordinate compression.

The conceptual DP recurrence can remain simple while the transition engine becomes multidimensional.

---

## 14. CDQ as a DP Accelerator

CDQ divide-and-conquer processes dependency contributions offline.

Conceptually:

```text
left half states → contribute to → right half states
```

During the merge, a Fenwick or segment tree aggregates contributions from the left side.

This is powerful for ordered multidimensional transitions because the expensive predecessor relation is handled in a structured sweep.

---

## 15. Range Updates

Some DPs require updating an entire interval rather than one coordinate.

Possible operations include:

- range add;
- range maximum assignment;
- range minimum assignment;
- conditional range updates.

Lazy propagation can defer updates while maintaining node invariants.

Advanced structures such as segment-tree-beats are applicable only when their exact update/query algebra matches the DP transition.

---

## 16. Heap and Deque Alternatives

Fenwick and segment trees are not always the simplest solution.

If valid predecessors form a moving window, a heap or monotone deque may be sufficient:

```text
insert candidate
remove expired candidate
read best candidate
```

The geometry of the predecessor set should determine the structure.

---

## 17. Online vs Offline

**Online:** preserve dependency order and query/update as states arrive.

**Offline:** reorder or batch states only when the dependency relation proves that doing so is safe.

Offline methods enable:

- coordinate sweeps;
- CDQ;
- batching equal keys;
- dominance processing.

Never sort states merely because sorting makes the implementation convenient.

---

## 18. Counting Optimal Solutions

A transition may need both the best value and the number of ways to achieve it.

Merge logic is:

```text
better value → replace
same value   → combine counts
worse value → ignore
```

Duplicates and equivalent predecessor paths require careful counting semantics.

---

## 19. Reconstruction and Tie-Breaking

If the structure stores the representative predecessor, the final DP state can be traced backward.

Tie-breaking might require:

- smallest predecessor index;
- earliest event;
- lexicographically smallest witness.

The tie policy belongs inside the summary comparison/merge operation. Otherwise an optimized structure may return a value that is correct but a witness that is inconsistent with the requested policy.

---

## 20. Numeric Safety in JavaScript

DP values can exceed `Number.MAX_SAFE_INTEGER`.

Use:

- `Number` only with proven bounds;
- `BigInt` for exact large integer values;
- modular arithmetic when required.

A BigInt segment tree must use BigInt identities and arithmetic consistently. Do not silently mix `Number` and `BigInt`.

---

## 21. Complexity

A common transformation is:

```text
naive predecessor scan       O(n²)
compression + Fenwick        O(n log n)
compression + segment tree   O(n log n)
2D dominance techniques      often O(n log² n)
```

The exact bound depends on state dimensions, preprocessing, sorting, query/update complexity, and reconstruction.

Always report preprocessing separately from transition complexity.

---

## 22. Correctness Proof Pattern

Prove two layers of invariants.

### DP invariant

`dp[i]` represents exactly the intended optimum/count/value over valid predecessors.

### Data-structure invariant

Each indexed summary represents exactly the aggregate of the currently inserted DP states in its represented coordinate range.

Then prove that the query returns exactly the predecessor aggregate required by the recurrence.

This separation makes optimized DP proofs auditable.

---

## 23. Testing Strategy

Build a quadratic reference implementation for small inputs and compare the optimized solver against it.

Test:

- duplicate coordinates;
- equal keys;
- negative coordinates;
- empty ranges;
- singleton ranges;
- all-compatible states;
- no-compatible states;
- ties;
- zero weights;
- decreasing sequences;
- huge sparse coordinates;
- large numeric values.

For online algorithms, also test that no future state leaks into an earlier transition.

---

## 24. Backend Engineering Applications

This pattern can optimize:

- event scheduling;
- job dependency planning;
- request prioritization;
- time-window planning;
- deployment sequencing;
- SLA-aware task selection;
- version compatibility histories;
- ordered resource allocation.

A practical pipeline is:

```text
incoming event
      ↓
normalize / compress key
      ↓
query DP summary
      ↓
compute state
      ↓
update indexed structure
```

---

## 25. AI Engineering Applications

Structured discrete optimization can contain the same transition pattern in:

- constrained sequence decoding;
- ordered candidate selection;
- temporal structured prediction;
- ranking constraints;
- exact optimization inside inference pipelines.

The engineering lesson is to derive the mathematical transition first and select the data structure second.

---

## 26. Recognition Checklist

When an `O(n²)` DP appears, ask:

1. What is the exact predecessor condition?
2. Can predecessors be represented by a prefix or interval?
3. Is the aggregate associative?
4. Are updates point or range based?
5. Is processing order fixed?
6. Are equal keys allowed to interact?
7. Can coordinates be compressed?
8. Is the transition one-dimensional or multidimensional?
9. Would a Fenwick tree suffice?
10. Do I need a segment tree?
11. Would a heap/deque be simpler?
12. Can the problem be processed offline?
13. Do I need counts or reconstruction?
14. What are the exact DP and data-structure invariants?

---

## 27. Master Pattern

```text
derive recurrence
      ↓
identify predecessor set
      ↓
express it as prefix/range/dominance relation
      ↓
choose aggregation structure
      ↓
compress coordinates if necessary
      ↓
process states in dependency order
      ↓
query aggregate
      ↓
compute dp[state]
      ↓
update aggregate
      ↓
reconstruct + verify
```

The central skill is not memorizing Fenwick-tree code. It is recognizing when a DP transition is an **indexed aggregation problem**.

---

## 28. Mastery Checklist

- [ ] Derive the naive predecessor DP first.
- [ ] Separate recurrence from aggregation.
- [ ] Implement Fenwick prefix sum.
- [ ] Implement Fenwick prefix maximum.
- [ ] Implement lower/upper bound correctly.
- [ ] Handle strict inequalities.
- [ ] Batch equal keys when required.
- [ ] Implement segment-tree range aggregation.
- [ ] Store compound summaries.
- [ ] Implement deterministic tie-breaking.
- [ ] Reconstruct through parent links.
- [ ] Recognize heap/deque alternatives.
- [ ] Understand online vs offline processing.
- [ ] Understand CDQ as a DP accelerator.
- [ ] Recognize multidimensional dominance.
- [ ] Handle counting of optimal solutions.
- [ ] Handle Number/BigInt/modular arithmetic safely.
- [ ] Prove both DP and data-structure invariants.
- [ ] Differential-test against a naive oracle.
- [ ] Complete backend and AI labs.
- [ ] Explain the optimization without relying on memorized templates.
