# 08.22 — Search with Custom Comparators & Complex Objects

## 1. Concept Definition

Searching complex objects requires separating **data representation** from **ordering semantics**.

Instead of comparing primitive values directly, define a comparator:

```js
compare(a, b)
```

A valid ordered-search algorithm then operates on the comparator's ordering rather than on object identity.

## 2. Why It Matters

Real backend and application data rarely consists only of numbers:

```js
{ id, name, createdAt, priority }
```

Search may be ordered by any one of these fields or by a compound rule.

The algorithm is reusable only when its ordering contract is explicit.

## 3. Comparator Contract

A comparator should conventionally return:

```text
< 0  → a precedes b
  0  → a and b are equivalent under the ordering
> 0  → a follows b
```

The comparator must be consistent with the data's sorted order.

## 4. Ordering vs Equality

A critical distinction:

```text
compare(a, b) === 0
```

does not necessarily mean:

```text
a === b
```

Two records may have the same `createdAt` while having different IDs.

Therefore exact identity and ordering equivalence must be modeled separately.

## 5. Key Selector

Many searches can be expressed with:

```js
keySelector(record)
```

followed by primitive comparison.

For example:

```text
record → record.score → numeric ordering
```

This is often simpler than writing a complete object comparator.

## 6. Composite Ordering

Records can be ordered by multiple fields:

```text
priority ASC
then createdAt ASC
then id ASC
```

The comparator must implement the complete lexicographic ordering.

## 7. Stable Tie-Breaking

A tie-breaker makes ordering deterministic.

For example:

```text
same timestamp → compare unique ID
```

This is especially useful when records share the primary search key.

## 8. Binary Search with Objects

Binary search remains conceptually unchanged:

1. choose midpoint;
2. compare midpoint record with target key/object;
3. eliminate one side;
4. repeat.

Only the comparison operation changes.

## 9. Generic Binary Search

A reusable abstraction is:

```text
binarySearch(values, target, compare)
```

The search algorithm owns interval movement.

The comparator owns ordering semantics.

This separation improves reuse and testing.

## 10. Lower Bound with Objects

Lower bound finds the first record satisfying an ordering predicate such as:

```text
record.key >= targetKey
```

The comparator-based formulation must define exactly what equality means.

## 11. Upper Bound with Objects

Upper bound finds the first record strictly after the target ordering key:

```text
record.key > targetKey
```

This is particularly useful for duplicate keys and range queries.

## 12. Range Queries

Two boundary searches can produce a range:

```text
left = lowerBound(targetLow)
right = lowerBound(targetHigh)
```

or use upper bound depending on inclusive/exclusive semantics.

Always document whether endpoints are inclusive.

## 13. Date Ordering

Dates should preferably be normalized to a comparable representation before repeated searching.

For high-throughput systems, repeatedly parsing date strings inside the comparator can dominate search cost.

Precompute normalized keys when justified.

## 14. String Ordering

String ordering depends on the intended semantics:

- code-unit ordering;
- locale-aware ordering;
- case-insensitive ordering;
- normalized Unicode ordering.

The comparator must match the data's sort contract.

## 15. Case-Insensitive Search

A case-insensitive search should normalize both comparison operands consistently.

Repeated normalization can be expensive, so an indexed or precomputed normalized key may be preferable for large workloads.

## 16. Numeric Keys

Numeric comparisons should use numeric semantics rather than accidental string ordering.

For example:

```text
"10" < "2"
```

under lexical string ordering, but:

```text
10 > 2
```

under numeric ordering.

## 17. Null and Missing Keys

The comparator must define behavior for:

- `null`;
- `undefined`;
- missing fields;
- invalid values.

A hidden implicit ordering can produce incorrect search results.

## 18. NaN and Invalid Numeric Values

`NaN` does not participate in ordinary numeric ordering like normal numbers.

A comparator over numeric records should either reject invalid keys or explicitly define their ordering.

## 19. Comparator Consistency

Ordered search assumes a coherent ordering relation.

Problems occur when the comparator is:

- non-transitive;
- inconsistent across calls;
- dependent on mutable external state;
- inconsistent with the actual sorted order.

These failures can invalidate the algorithm even when the binary-search loop itself is correct.

## 20. Mutable Objects

If the search array is sorted by `record.score` and that score changes after insertion, the array may no longer satisfy its ordering invariant.

A comparator-based search is only as correct as the current data ordering.

## 21. Search by Key vs Search by Identity

These are different operations:

```text
find record whose ID === targetId
```

versus:

```text
find record whose score compares equal to targetScore
```

Hash indexes are often appropriate for identity lookup, while ordered search is appropriate for ordered keys and ranges.

## 22. Object Equality

Do not use reference equality as an accidental substitute for domain equality.

Two independently created objects can represent the same logical record.

Define the domain identity explicitly.

## 23. Custom Search Result Contracts

A generic search can return:

```text
index
record
null
```

or a richer result:

```js
{ found, index, value }
```

Production code should choose one contract and keep it consistent.

## 24. Error Semantics

Decide how invalid inputs are handled:

- throw an error;
- return a sentinel;
- validate in development only;
- rely on an upstream contract.

Do not mix error and not-found semantics accidentally.

## 25. Comparator Cost

The usual binary-search complexity:

```text
O(log n)
```

assumes each comparison is approximately constant time.

If comparator cost is `K`, model the work as:

```text
O(K log n)
```

This matters for expensive string normalization, deep object comparison, or computed keys.

## 26. Key Extraction Cost

If:

```js
keySelector(record)
```

performs expensive work, repeated extraction can dominate the search.

Possible optimization:

```text
precompute keys → search normalized representation
```

at the cost of memory and preprocessing.

## 27. Decorate–Search–Undecorate

A useful technique is:

```text
records
→ decorate with search key
→ search decorated records
→ map result back to record
```

This separates expensive key computation from the logarithmic search loop.

## 28. Compound Comparators

A compound comparator should compare fields in a fixed sequence:

```text
primary
→ secondary
→ tertiary
```

Stop at the first unequal field.

This creates deterministic lexicographic ordering.

## 29. Comparator Factories

Reusable comparator factories can express domain rules:

```text
compareBy("createdAt")
compareBy("priority")
compareByMultiple([...])
```

The generated comparator must still satisfy the ordering contract.

## 30. Backend Applications

Comparator-based searching appears in:

- sorted API result sets;
- event timelines;
- priority queues represented as arrays;
- cached records;
- range indexes;
- pagination boundaries;
- in-memory lookup tables.

Database query engines should generally handle database-scale ordered indexing, but application-level structures often use the same reasoning.

## 31. Pagination Boundaries

Cursor-based pagination can use an ordered tuple such as:

```text
(createdAt, id)
```

The comparator defines exactly where the next page begins.

A deterministic tie-breaker prevents duplicate or missing records when timestamps collide.

## 32. AI Applications

Comparator-based search can support:

- sorted candidate lists;
- thresholded scores;
- ranking metadata;
- model-version ordering;
- timestamped inference results;
- structured retrieval metadata.

The comparator should represent the retrieval contract rather than embedding hidden business logic.

## 33. Correctness Invariant

For binary search:

> If the target exists, it remains within the active interval after every iteration.

The comparator determines which half is impossible.

## 34. Boundary Correctness

For lower bound:

```text
all positions before result satisfy predicate = false
result and positions after satisfy predicate = true
```

The exact predicate depends on the comparator and target semantics.

## 35. Termination

The search interval strictly shrinks.

Eventually:

```text
low > high
```

for exact search or:

```text
low == high
```

for common boundary searches.

## 36. Testing Strategy

Test the comparator independently before testing the search.

Then test:

- empty input;
- singleton;
- duplicate keys;
- null/missing values if supported;
- compound keys;
- descending order;
- random targets.

## 37. Differential Testing

Compare generic comparator-based search with a trusted linear reference using the **same comparator**.

This isolates search correctness from domain-ordering correctness.

## 38. Benchmarking

Measure separately:

- search iterations;
- comparator calls;
- key extraction calls;
- normalization work;
- preprocessing cost;
- total latency.

A search with fewer comparisons can still be slower if each comparison is much more expensive.

## 39. Common Mistakes

1. Searching objects with `===` when domain equality is key-based.
2. Using a comparator inconsistent with the sorted array.
3. Ignoring duplicate-key semantics.
4. Parsing or normalizing expensive keys on every comparison.
5. Mixing identity and ordering equality.
6. Ignoring `null`, missing keys, or `NaN`.
7. Mutating fields used for ordering after sorting.
8. Returning inconsistent result types.
9. Forgetting compound-key tie-breakers.
10. Assuming `O(log n)` means constant practical cost.

## 40. Edge Cases

Test:

- empty array;
- one object;
- duplicate primary keys;
- identical compound keys;
- missing fields;
- null fields;
- invalid numeric values;
- case variants;
- date boundaries;
- ascending and descending ordering.

## 41. Implementation Lab

Implement:

1. generic comparator binary search;
2. comparator lower bound;
3. comparator upper bound;
4. key-selector search;
5. compound-key comparator;
6. date search;
7. case-insensitive search;
8. cursor boundary search;
9. decorate-search-undecorate pipeline;
10. comparator instrumentation harness.

## 42. Interview Questions

1. How do you binary-search an array of objects?
2. What should a comparator return?
3. What is the difference between ordering equality and object identity?
4. How do lower and upper bounds work with duplicate object keys?
5. Why can comparator cost change practical complexity?
6. How would you search by multiple fields?
7. How would you handle missing values?
8. Why is a deterministic cursor tie-breaker important?
9. How would you test a comparator-based search?
10. When should a hash index be used instead of ordered search?

## 43. Revision Checklist

- [ ] I can define a valid comparator.
- [ ] I can separate ordering from identity.
- [ ] I can implement generic binary search over objects.
- [ ] I can implement lower and upper bounds.
- [ ] I can handle compound keys.
- [ ] I can reason about comparator cost.
- [ ] I can handle null/missing/invalid values explicitly.
- [ ] I can use deterministic cursor ordering.
- [ ] I can differential-test against a linear reference.
- [ ] I can decide between ordered search and hash indexing based on the workload.

## 44. Key Takeaways

1. **Generic search algorithms become reusable when ordering is injected through a comparator.**
2. **Ordering equivalence is not necessarily object identity.**
3. **Comparator consistency is a correctness precondition.**
4. **Lower/upper bounds provide precise duplicate and range semantics.**
5. **Comparator and key-extraction costs belong in the practical cost model.**
6. **Compound ordering requires deterministic tie-breaking.**
7. **Cursor pagination is fundamentally an ordered-boundary problem.**
8. **The same abstraction applies to backend records and structured AI retrieval metadata.**
9. **The deeper lesson is to separate algorithm mechanics from domain-specific ordering rules.**
