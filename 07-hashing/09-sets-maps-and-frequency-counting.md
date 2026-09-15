# 07.09 — Sets, Maps & Frequency Counting

## 1. Concept Definition

A **Set** stores unique values. A **Map** stores key → value associations. Both are hash-oriented structures that provide expected constant-time membership, insertion, lookup, and deletion when hashing and implementation assumptions hold.

Frequency counting is one of the most important applications of hashing: transform a sequence into a mapping from each distinct value to the number of times it occurs.

```text
values: [a, b, a, c, b, a]

frequency map:
a → 3
b → 2
c → 1
```

## 2. Why It Exists

Arrays are excellent for ordered positional data, but many algorithmic problems ask questions about **identity rather than position**:

- Have we seen this value?
- How many times does it occur?
- Does this value exist in another collection?
- Which records share the same key?
- Can we find a complement immediately?
- Which values are unique?

Repeated linear scans can turn an otherwise simple task into `O(n²)`. A Set or Map can often reduce those operations to expected `O(1)` per lookup.

## 3. Mental Model

Think of the structures as specialized dictionaries:

```text
Set
value → presence

Map
key → associated value

Frequency Map
value → count

Index
key → record / records
```

The key insight is that the structure changes the question from:

> “Where should I search?”

to:

> “Can I answer this by key?”

## 4. Set vs Map vs Array vs Object

| Structure | Primary purpose | Typical lookup | Duplicates |
|---|---|---:|---|
| Array | Ordered sequence | `O(n)` | Allowed |
| Set | Unique membership | Expected `O(1)` | Removed |
| Map | Key → value | Expected `O(1)` | Keys unique |
| Object | String/symbol property dictionary | Expected `O(1)`* | Property keys unique |

`Map` and `Set` preserve insertion order during iteration, but ordering should not be confused with sorted order.

For algorithmic work, prefer `Map`/`Set` when the problem is explicitly about arbitrary keys or membership.

## 5. Core Operations

### Set

```js
const seen = new Set();
seen.add(value);
seen.has(value);
seen.delete(value);
seen.size;
```

### Map

```js
const counts = new Map();
counts.set(key, value);
counts.get(key);
counts.has(key);
counts.delete(key);
counts.size;
```

For frequency counting:

```js
counts.set(x, (counts.get(x) ?? 0) + 1);
```

## 6. Frequency Counting

The canonical one-pass pattern is:

```text
create empty map
for each value:
    increment value's count
```

For `n` values and `u` distinct keys:

- Time: expected `O(n)` plus key-processing cost.
- Space: `O(u)` auxiliary space.

The number of distinct keys, not merely the input length, determines the size of the frequency map.

## 7. Fundamental Hashing Patterns

### 7.1 Seen Set

Use when only presence matters.

```text
for x:
    if x already seen → duplicate
    otherwise add x
```

### 7.2 Frequency Map

Use when multiplicity matters.

```text
value → occurrence count
```

### 7.3 Complement Lookup

For a target relationship such as two-sum, store previously seen values and query the required complement.

### 7.4 Grouping

Map a derived key to a collection of records:

```text
category → records
```

### 7.5 Indexing

Build a direct lookup structure:

```text
userId → user
```

or, for non-unique keys:

```text
status → [records]
```

### 7.6 Inverse Mapping

Convert:

```text
key → value
```

to:

```text
value → key
```

only when the reverse key is unique or a collision policy is explicitly defined.

## 8. JavaScript Semantics

JavaScript `Map` and `Set` use **SameValueZero** equality for keys/values. This means `NaN` matches `NaN`, and `+0` and `-0` are treated as the same key.

Objects use property-key coercion for ordinary string/number keys and have prototype-related concerns. For algorithmic arbitrary-key dictionaries, `Map` is usually the clearer choice.

Important object pitfalls include:

- inherited properties when using unsafe checks;
- special property names such as `__proto__`;
- coercion of numeric property names to strings;
- accidental collisions between application data and object metadata.

`Map` avoids these particular object-property semantics and can use objects, functions, and other values directly as keys.

## 9. Equality and Canonicalization

Hash-based algorithms only work correctly when the key represents the intended notion of identity.

Examples:

```text
"Alice" vs "alice"
"00123" vs 123
UTC timestamp vs local timestamp
normalized email vs raw email
```

If the domain considers two representations equivalent, canonicalize before hashing.

```text
raw input
   ↓
normalize / canonicalize
   ↓
hash key
   ↓
Map / Set operation
```

Do not normalize implicitly unless the problem or domain specification requires it.

## 10. Correctness Invariants

A frequency map should satisfy:

```text
sum(counts.values()) = number of processed values
```

For a Set:

```text
size = number of distinct inserted values
```

For an index:

```text
lookup(key) returns exactly the records represented by that key
```

For deduplication:

```text
at most one output record exists for each identity key
```

These invariants turn implementation into something that can be reasoned about and tested.

## 11. Brute Force → Optimized Reasoning

Suppose the task is to detect duplicates.

### Brute force

Compare each value with later values:

```text
O(n²) time
O(1) auxiliary space
```

### Hash-based optimization

Maintain a Set of values already observed:

```text
O(n) expected time
O(n) auxiliary space
```

The trade-off is explicit: **extra memory buys fewer repeated comparisons**.

## 12. Complexity Nuances

Expected `O(1)` does not mean mathematically guaranteed constant time for every possible implementation and input.

Consider:

- hash computation cost;
- key size;
- collisions;
- resizing;
- adversarial input;
- garbage collection;
- memory locality;
- serialization/canonicalization cost.

If keys themselves are strings of length `L`, processing them may cost `O(L)`. A more precise bound may therefore be `O(nL)` rather than simply `O(n)`.

## 13. Common Mistakes

1. Using an array for repeated membership checks.
2. Confusing Set uniqueness with sorted order.
3. Forgetting to handle a missing Map key.
4. Assuming every reverse map is one-to-one.
5. Mutating keys or relying on mutable object identity unexpectedly.
6. Mixing raw and normalized representations.
7. Ignoring duplicate records during indexing.
8. Claiming worst-case `O(1)` without qualification.
9. Forgetting that `Map.get()` can legitimately return `undefined`.
10. Building a full frequency map when a Set is sufficient.

## 14. Edge Cases & Failure Modes

Always consider:

- empty input;
- one element;
- all values identical;
- all values distinct;
- negative and zero values;
- `NaN` where applicable;
- object/function keys;
- very long strings;
- duplicate identifiers;
- normalization collisions;
- `k <= 0` or `k` larger than the number of distinct values;
- integer-count overflow concerns in systems with bounded counters.

## 15. Backend Engineering Applications

Sets and Maps appear throughout backend systems:

### Deduplication

Track processed event IDs, request IDs, import IDs, or message IDs.

### Idempotency

```text
idempotency-key → request result/state
```

### Authorization

```text
permission → allowed
role → permissions
```

### Aggregation

```text
customerId → total amount
status → count
endpoint → request count
```

### Indexing

```text
userId → user
email → account
orderId → order
```

Production systems must also define lifecycle, concurrency, persistence, memory limits, and eviction. An in-process Map is not automatically a distributed or durable data store.

## 16. AI Engineering Applications

Hash-based structures are useful in AI systems for:

- vocabulary and token-frequency metadata;
- exact memoization caches;
- candidate deduplication;
- entity normalization/indexing;
- label and class-frequency statistics;
- document/chunk identity tracking;
- retrieval result deduplication;
- feature/value counting.

For large-scale AI systems, exact Maps may become memory-heavy. That motivates later probabilistic structures such as Bloom filters and Count-Min Sketch.

## 17. Problem-Solving Decision Framework

When reading a problem, ask:

```text
Do I need only membership?
    → Set

Do I need key → value?
    → Map

Do I need occurrence counts?
    → Frequency Map

Do I repeatedly search by an identifier?
    → Build an index

Do multiple records share the same key?
    → Map key → collection

Do equivalent representations differ syntactically?
    → Define canonicalization first
```

## 18. Interview Preparation

You should be able to explain:

1. Why Set can outperform repeated array membership scans.
2. How a frequency map works.
3. Set vs Map vs Object.
4. Expected vs worst-case hash-table complexity.
5. How two-sum becomes linear using a Map.
6. How to group records by a derived key.
7. How to deduplicate records by identity.
8. Why canonicalization matters.
9. Why an in-memory Map is not a distributed cache.
10. How to choose between exact and probabilistic membership structures.

## 19. Implementation Lab

Implement the exercise file without copying a solution.

For each problem:

```text
1. State the input/output model.
2. Identify whether membership, mapping, or frequency is required.
3. Write the brute-force idea.
4. Identify the repeated operation.
5. Replace repeated search with Set/Map when justified.
6. State the invariant.
7. Derive time and auxiliary-space complexity.
8. Test edge cases.
9. Explain the trade-off.
```

## 20. Backend + AI Engineering Lab

Design three production-oriented components:

### A. Idempotency Key Store

Define:

- key identity;
- stored state;
- expiration;
- duplicate request semantics;
- concurrent request behavior;
- memory/durability requirements.

### B. Backend Deduplication Index

Define:

- record identity;
- canonical key;
- collision policy;
- retention window;
- cleanup strategy;
- observability.

### C. AI Candidate Deduplication

Define:

- candidate identity/signature;
- normalization;
- duplicate policy;
- memory bound;
- approximate vs exact trade-off.

## 21. Revision Checklist

- [ ] I can explain Set vs Map vs Array.
- [ ] I can build a frequency map in one pass.
- [ ] I can detect duplicates in expected `O(n)` time.
- [ ] I can explain expected vs worst-case hashing complexity.
- [ ] I understand JavaScript Map/Set equality semantics.
- [ ] I can group records by a derived key.
- [ ] I can build an index for repeated lookups.
- [ ] I can reason about canonicalization.
- [ ] I can state the correctness invariant.
- [ ] I can derive auxiliary space.
- [ ] I can explain backend deduplication and idempotency uses.
- [ ] I can explain AI candidate-deduplication uses.

## 22. Key Takeaways

1. **Set answers membership and uniqueness questions.**
2. **Map answers key → value questions.**
3. **Frequency maps convert repeated counting into linear expected-time processing.**
4. **Hashing trades memory for faster lookup.**
5. **Correct key identity is as important as the data structure itself.**
6. **Expected `O(1)` must not be confused with an unconditional guarantee.**
7. **The same patterns power algorithmic problems, backend indexes, caches, deduplication, and AI pipelines.**
8. **Always derive the invariant and complexity instead of memorizing a template.**
