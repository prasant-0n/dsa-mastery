# 08.12 — Custom Comparators & Searching Complex Objects

## 1. Concept Definition

A custom comparator defines the ordering relationship used by a search algorithm when values are not naturally compared with primitive operators.

For records such as:

```js
{ id: 42, name: "Asha", score: 91 }
```

the search algorithm should not need to understand the record's internal structure. It should receive an ordering function.

```text
compare(a, b)
→ negative: a before b
→ zero: equivalent for the ordering
→ positive: a after b
```

## 2. Why It Matters

Production systems rarely search only arrays of primitive numbers.

Common searchable entities include:

- users;
- products;
- timestamps;
- versions;
- database records;
- ranked candidates;
- configuration objects.

Separating **search mechanics** from **ordering policy** makes algorithms reusable and testable.

## 3. Mental Model

Think of a comparator as an ordering adapter:

```text
complex object
      ↓
 comparator
      ↓
 ordered relation
      ↓
 generic search algorithm
```

The search algorithm operates only on the relation it is given.

## 4. Comparator Contract

A comparator should provide a consistent ordering relation.

For a valid strict ordering, the comparison should satisfy properties such as:

- antisymmetry in the ordering sense;
- transitivity;
- consistency for equal values;
- deterministic behavior.

Violating these properties can invalidate binary-search reasoning.

## 5. Comparator vs Equality

A comparator returning `0` normally means:

> The two values are equivalent under this ordering.

It does **not necessarily mean the objects are identical**.

Example:

```js
compareByScore(a, b) === 0
```

may mean both records have the same score while having different IDs.

This distinction is critical for duplicate and boundary semantics.

## 6. Binary Search with Comparator

The generic binary-search structure is:

```text
compare(A[mid], target)
```

Then:

```text
< 0 → search right
> 0 → search left
= 0 → match
```

The algorithm remains independent of the object's representation.

## 7. Search by Key

A common comparator searches records by a specific field:

```js
record.id
```

or:

```js
record.createdAt
```

The key-extraction policy can be separated from the comparison policy.

## 8. Key Selector

Instead of requiring callers to write full comparators, an API can accept:

```text
keySelector(record) → key
```

and internally compare keys.

This can improve ergonomics while keeping the ordering contract explicit.

## 9. Numeric Key Search

For records ordered by a numeric key:

```text
compare(a, b) = key(a) - key(b)
```

However, subtraction should not be used blindly when keys can exceed exact numeric ranges or when the comparator is intended to avoid arithmetic overflow/precision issues.

A sign-based comparison is safer for large or special numeric domains.

## 10. String Keys

String ordering depends on the intended semantics:

- Unicode code-unit ordering;
- locale-aware ordering;
- case-insensitive ordering;
- normalized ordering.

The comparator contract must state which one is used.

## 11. Case-Insensitive Search

If the array is sorted using case-insensitive comparison, searching with a case-sensitive comparator is incorrect.

The comparator used during search must match the comparator used to establish the sorted order.

## 12. Normalization

A normalized search may transform keys before comparison:

```text
raw value
→ normalize
→ compare
```

Examples:

- lowercase text;
- Unicode normalization;
- trimmed identifiers;
- canonical version strings.

Repeated normalization during every comparison can be expensive.

## 13. Decorated Search

For expensive key extraction, precompute comparable keys:

```text
record → { record, normalizedKey }
```

Then search the decorated representation.

This trades preprocessing/storage for cheaper repeated comparisons.

## 14. Stability of Ordering

If records are mutable, changing a key after sorting can invalidate the search precondition.

A sorted array is not a persistent guarantee if the values used by its comparator can change.

## 15. Mutable Objects

Suppose:

```js
records.sort(compareByScore);
```

and later:

```js
records[10].score = 999;
```

The array may no longer be sorted by `score`.

A binary search can then return incorrect results.

## 16. Immutable Search Keys

Production designs should prefer:

- immutable ordering keys;
- controlled updates;
- rebuilding/reinsertion after key changes;
- indexed data structures when updates are frequent.

The search algorithm cannot compensate for an invalid sortedness invariant.

## 17. Multi-Key Ordering

Records often use lexicographic ordering:

```text
primary key
→ secondary key
→ tertiary key
```

Example:

```text
lastName
→ firstName
→ id
```

The comparator should define every tie-break rule required by the search contract.

## 18. Comparator Composition

A comparator can be composed from smaller policies:

```text
compare primary
if equal → compare secondary
if equal → compare tertiary
```

This creates reusable ordering specifications.

## 19. Descending Comparator

A descending search can be implemented by reversing the comparator semantics.

The search algorithm itself need not be duplicated.

The important requirement is that the comparator and data ordering agree.

## 20. Lower Bound with Objects

For records ordered by a key, lower bound means:

```text
first record whose key >= targetKey
```

The result may be a record whose key equals the target but whose object is not reference-equal to the target object.

## 21. Upper Bound with Objects

Upper bound means:

```text
first record whose key > targetKey
```

This is useful for ranges and duplicate groups.

## 22. Range Search

A sorted object array can support:

```text
lowerBound(startKey)
upperBound(endKey)
```

and therefore efficiently identify a contiguous range.

Typical complexity:

```text
O(log n + k)
```

where `k` is the number of returned records.

## 23. Comparator Consistency

A binary search can fail if the comparator behaves differently between calls.

Avoid comparators depending on:

- current time;
- random state;
- mutable external variables;
- network responses;
- changing configuration.

Search requires a stable ordering relation during execution.

## 24. Comparator Cost

If comparison costs `C`, then a logarithmic search is better modeled as:

```text
O(C log n)
```

rather than treating each comparison as unit cost.

For complex objects, `C` can dominate the algorithm.

## 25. Expensive String Comparison

Locale-aware comparison, Unicode normalization, and long-string comparison can be substantially more expensive than integer comparison.

Possible engineering strategies include:

- precomputed normalized keys;
- cached comparison keys;
- compact sortable representations.

Measure before introducing complexity.

## 26. Search Result Semantics

Define whether search returns:

- index;
- object;
- key;
- insertion point;
- range;
- all equivalent records.

A generic algorithm should not leave these semantics implicit.

## 27. Stable Identity vs Ordering Identity

A record may have:

```text
identity = id
ordering = score
```

Two records can be ordering-equivalent but identity-distinct.

Do not use ordering equality as object identity unless the contract explicitly permits it.

## 28. Custom Comparator and JavaScript `Map`/`Set`

`Map` and `Set` use JavaScript's key equality semantics, not arbitrary user-defined comparators.

If the application requires custom equivalence such as case-insensitive strings, canonicalization or a derived key is usually required.

## 29. Binary Search API Design

A production-quality generic API should make the following explicit:

```text
values
comparator
search target
range boundaries
return semantics
sortedness precondition
```

Avoid hidden assumptions.

## 30. Correctness Invariant

For exact search:

> If an element equivalent to the target exists according to the comparator, it remains within the active interval.

For lower bound:

> Every position before `left` is known to be `< target`, while the answer, if any, remains at or after `left`.

The exact invariant should match the search objective.

## 31. Comparator Correctness Proof

The binary-search proof depends on the comparator defining the same ordering used to sort the data.

If sorted order is based on comparator `C1` but search uses `C2`, the proof does not apply unless `C1` and `C2` induce compatible ordering.

## 32. Backend Applications

Custom-comparator searching appears in:

- sorted user records by timestamp;
- version lookup;
- price/range indexes;
- event streams;
- configuration snapshots;
- pagination boundaries;
- in-memory caches;
- ordered queues and scheduling metadata.

For large mutable datasets, database indexes or specialized trees may be more suitable than repeatedly sorting arrays.

## 33. AI Applications

Examples include searching records by:

- model score;
- timestamp;
- token position;
- ranking score;
- candidate ID;
- embedding metadata.

For approximate nearest-neighbor retrieval, specialized vector indexes are usually needed; ordinary comparator-based binary search is appropriate only when the data has a suitable total ordering.

## 34. Testing Strategy

Test comparator-driven searches with:

- numeric keys;
- strings;
- case-insensitive strings;
- descending order;
- multi-key records;
- duplicate keys;
- mutable-key failure cases;
- custom objects.

Every test must sort and search using the same ordering definition.

## 35. Differential Testing

Create a reference implementation that scans records using the same comparator.

Compare:

```text
optimized result
vs
reference result
```

For multiple valid matches, compare according to the documented occurrence contract rather than requiring an arbitrary matching index.

## 36. Benchmarking

Measure separately:

- search iterations;
- comparator calls;
- key-extraction calls;
- normalization calls;
- memory used by decorated keys;
- total runtime.

This reveals whether optimization should target the search algorithm or the comparator itself.

## 37. Common Mistakes

1. Searching with a comparator different from the sorting comparator.
2. Treating comparator equality as object identity.
3. Using subtraction for unsafe numeric ranges.
4. Ignoring mutable ordering keys.
5. Performing expensive normalization on every comparison without measurement.
6. Forgetting duplicate semantics.
7. Implementing descending search separately when comparator reversal is sufficient.
8. Returning an ambiguous result contract.
9. Using arbitrary comparator state.
10. Assuming logarithmic search means low total cost when comparisons are expensive.

## 38. Edge Cases

Test:

- empty input;
- singleton;
- all equivalent keys;
- duplicate keys;
- target before first;
- target after last;
- exact boundary matches;
- descending order;
- multi-key ties;
- long strings;
- normalized-equivalent strings;
- mutated keys.

## 39. Implementation Lab

Implement:

1. generic comparator binary search;
2. comparator lower bound;
3. comparator upper bound;
4. object search by key selector;
5. multi-key comparator;
6. descending comparator adapter;
7. range search;
8. decorated-key optimization;
9. reference implementation;
10. comparator-call benchmark.

## 40. Interview Questions

1. Why should binary search accept a comparator?
2. What does comparator return value `0` mean?
3. Why must sorting and searching use compatible comparators?
4. How do you search objects by multiple fields?
5. How do lower and upper bounds work with duplicate object keys?
6. How do mutable records break binary-search assumptions?
7. How would you optimize an expensive comparator?
8. Why can `Map`/`Set` not directly accept an arbitrary comparator?
9. How would you design a reusable search API?
10. What is the real cost of `O(log n)` when each comparison is expensive?

## 41. Revision Checklist

- [ ] I can define a comparator contract.
- [ ] I can implement generic binary search.
- [ ] I understand comparator equality vs identity.
- [ ] I can search objects by key.
- [ ] I can build multi-key ordering.
- [ ] I can implement comparator lower/upper bounds.
- [ ] I understand mutable-key failure modes.
- [ ] I can reason about expensive comparisons.
- [ ] I can preserve `O(log n + k)` range-query behavior.
- [ ] I can test optimized search against a comparator-matched reference.
- [ ] I can explain why sortedness and comparator consistency are part of correctness.

## 42. Key Takeaways

1. **A comparator separates search mechanics from domain-specific ordering.**
2. **Binary search is correct only when the search comparator matches the ordering invariant of the data.**
3. **Comparator equality means ordering equivalence, not necessarily object identity.**
4. **Key selectors and composed comparators make object searching reusable.**
5. **Lower and upper bounds turn ordered object arrays into efficient range-query structures.**
6. **Comparator cost can dominate the nominal `O(log n)` search cost.**
7. **Mutable ordering keys can silently invalidate a sorted array.**
8. **Stable, deterministic comparison is part of the correctness contract.**
9. **Decorated/precomputed keys can trade memory and preprocessing for cheaper comparisons.**
10. **The deeper engineering skill is designing a correct ordering contract before choosing the search implementation.**
