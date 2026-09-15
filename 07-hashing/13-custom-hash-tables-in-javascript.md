# 07.13 — Custom Hash Tables in JavaScript

## 1. Concept Definition

A **custom hash table** is a hash-based key-value data structure implemented directly rather than delegated to JavaScript's built-in `Map`.

Building one forces you to understand the complete mechanism:

```text
key
 ↓
hash function
 ↓
bucket / slot
 ↓
collision handling
 ↓
lookup / insertion / deletion
 ↓
resize / rehash
```

The purpose is educational and engineering-oriented: understand the machinery behind hashing, reason about invariants, and know when a custom implementation is justified.

## 2. Why It Exists

Production JavaScript code should normally prefer the built-in `Map`/`Set` unless there is a concrete reason not to.

A custom implementation is valuable for learning:

- hash-table internals;
- collision resolution;
- load-factor policy;
- resizing;
- memory representation;
- complexity analysis;
- specialized constraints;
- interview implementation questions.

## 3. Mental Model

A hash table is an array plus a rule for mapping keys to locations.

```text
capacity = M

hash(key) → integer
index = hash(key) mod M
```

The fundamental difficulty is that multiple keys can map to the same location.

Therefore a correct hash table requires both:

```text
hashing
+
collision resolution
```

## 4. Abstract Data Type

A minimal Map-like table supports:

```text
set(key, value)
get(key)
has(key)
delete(key)
size
clear()
```

Additional production-quality concerns include:

- iteration;
- resizing;
- capacity policy;
- key equality;
- error semantics;
- memory behavior;
- instrumentation.

## 5. Separate Chaining Design

One implementation uses an array of buckets where each bucket stores entries:

```text
buckets[0] → [(k1,v1), (k7,v7)]
buckets[1] → []
buckets[2] → [(k3,v3)]
```

Operations:

```text
hash key
   ↓
find bucket
   ↓
search bucket for exact key
```

Expected operation cost is approximately `O(1 + α)` under a reasonable distribution, where:

```text
α = entries / buckets
```

Worst-case lookup can become `O(n)`.

## 6. Open Addressing Design

Instead of storing chains, every entry occupies a table slot.

When the home slot is occupied, probe additional positions:

```text
h(k)
h(k)+1
h(k)+2
...
```

This requires explicit slot states such as:

```text
EMPTY
OCCUPIED
TOMBSTONE
```

Deletion is more subtle than in chaining because removing an entry can break a probe sequence.

## 7. Key Equality

Hash equality does not imply key equality.

The lookup process is:

```text
hash candidate
      ↓
locate candidate bucket/slot
      ↓
compare actual key equality
```

For primitive keys, equality can be straightforward. For object keys, decide whether identity or structural equality is intended.

A generic custom Map must define this contract explicitly.

## 8. Hash Function Contract

A hash function used by a table should be:

- deterministic for a key;
- consistent with the equality relation;
- sufficiently distributed;
- efficient enough for the workload.

Critical correctness rule:

> If two keys are equal according to the table's equality function, they must produce the same hash.

The reverse is not required because collisions are valid.

## 9. Collision Resolution

Common strategies include:

### Separate chaining

```text
bucket → collection of entries
```

### Linear probing

```text
h, h+1, h+2, ...
```

### Quadratic probing

```text
h + c₁i + c₂i²
```

### Double hashing

```text
h₁(k) + i·h₂(k)
```

The strategy affects clustering, memory locality, deletion, and performance.

## 10. Load Factor

For `N` entries and `M` buckets/slots:

```text
α = N / M
```

As `α` increases:

- collisions become more frequent;
- chains become longer;
- probes increase;
- latency may rise.

Therefore a practical table grows before becoming excessively full.

## 11. Resizing & Rehashing

When capacity changes, the old bucket positions are no longer necessarily correct:

```text
index = hash(key) mod oldCapacity
```

must become:

```text
index = hash(key) mod newCapacity
```

Therefore resizing requires **rehashing** entries.

A resize is `O(n)` for `n` stored entries, but geometric growth makes insertion amortized expected `O(1)` under ordinary assumptions.

## 12. Shrinking & Hysteresis

A production table may also shrink when utilization becomes low.

Do not grow and shrink around exactly the same threshold, or repeated insert/delete operations can cause resize thrashing.

Use hysteresis:

```text
grow at high utilization
shrink at substantially lower utilization
```

Minimum capacity should also be enforced.

## 13. JavaScript Array Representation

A simple chained table can use:

```js
const buckets = Array.from({ length: capacity }, () => []);
```

Each entry might conceptually be:

```js
{ key, value }
```

For learning this is clear. For performance-sensitive specialized structures, object allocation and garbage collection may dominate the theoretical operation cost.

## 14. Custom Hashing JavaScript Keys

JavaScript allows many key types:

- strings;
- numbers;
- symbols;
- objects;
- functions;
- BigInts;
- other primitives.

A custom hash table cannot safely convert arbitrary objects to strings and assume that represents identity.

For object identity, an identity-token mechanism such as `WeakMap` can be used as part of a specialized design. Structural hashing is a different problem and requires recursive/canonical representation.

## 15. String Hashing

For strings, a polynomial hash can provide a deterministic integer fingerprint:

```text
h = h·B + code(c)
```

usually reduced into a bounded arithmetic domain.

The hash table then maps that fingerprint to a bucket, while exact key comparison still resolves collisions.

## 16. Number Safety

JavaScript `Number` is floating-point and only represents integers exactly within a bounded range.

A custom hash implementation must avoid accidental precision loss.

Possible strategies:

- bounded arithmetic using safe integer operations;
- `BigInt`;
- carefully constrained multipliers/moduli;
- specialized typed-array/machine-word designs.

Do not assume `%` plus large multiplication automatically gives exact modular arithmetic with `Number`.

## 17. Correctness Invariants

A custom Map should preserve at least:

### Uniqueness

For every equality-equivalent key, there is at most one logical entry.

### Reachability

Every stored entry is reachable through the probing/chaining rules determined by its hash.

### Lookup consistency

`get(k)` returns the value associated with the equality-equivalent stored key, if one exists.

### Size consistency

The reported size equals the number of logical entries.

### Resize preservation

Resizing does not change key/value associations.

## 18. Deletion Semantics

### Chaining

Remove the matching entry from its bucket.

### Open addressing

Do not simply convert an occupied slot to `EMPTY` if later keys depend on that probe sequence.

Use a tombstone or perform a correct cluster-repair strategy.

Deletion therefore deserves separate tests from insertion and lookup.

## 19. Iteration Semantics

A custom table must define whether iteration order is:

- insertion order;
- bucket order;
- unspecified.

Do not accidentally promise insertion order merely because the implementation happens to produce it for current inputs.

If JavaScript `Map` compatibility is desired, explicitly design the ordering semantics and deletion/reinsertion behavior.

## 20. Error & API Semantics

Define:

- what `get` returns for missing keys;
- whether `delete` returns a boolean;
- whether `set` returns the table for chaining;
- how invalid capacities are handled;
- whether `undefined` is a valid stored value;
- whether `null` is a valid key.

These are API-contract decisions, not incidental implementation details.

## 21. Brute Force → Hash Table

A naive dictionary can store entries in an array:

```text
set/get/delete → linear scan → O(n)
```

Hashing changes the lookup strategy:

```text
key → hash → candidate location → exact key comparison
```

Expected lookup becomes approximately `O(1)` under good distribution and controlled load.

## 22. Complexity

For `n` entries:

### Chaining

- average/expected lookup: `O(1 + α)`;
- worst-case lookup: `O(n)`;
- insertion: expected `O(1)`, excluding resize;
- resize: `O(n)`;
- space: `O(n + M)`.

### Open addressing

Expected operation cost depends strongly on load factor and probing distribution. As the table approaches capacity, probe sequences can grow rapidly.

### Amortized insertion

With geometric resizing:

```text
individual resize = O(n)
long sequence of insertions = amortized expected O(1) per insertion
```

## 23. Testing Strategy

A custom table should be tested against a reference `Map`.

For randomized operations:

```text
random operation
      ↓
custom table
      ↓
reference Map
      ↓
compare observable state
```

Test sequences, not only isolated operations.

Important sequences:

- insert → get;
- insert same key twice;
- delete → get;
- delete → reinsert;
- resize during insertion;
- shrink after deletion;
- collision-heavy keys;
- empty table;
- single bucket;
- large input.

## 24. Property-Based Thinking

Useful properties include:

```text
set(k,v); get(k) === v

set(k,v1); set(k,v2); size unchanged

delete(k); has(k) === false

resize(); all key/value associations preserved

clear(); size === 0
```

For every generated sequence, compare with a trusted reference implementation.

## 25. Backend Engineering Applications

Custom hash tables can be useful only in specialized situations such as:

- fixed-key specialized indexes;
- memory-constrained components;
- predictable key domains;
- embedded/runtime implementations;
- educational or systems-level libraries.

For normal Node.js application code, built-in `Map` is usually the correct default.

Backend design must also consider:

- process-local scope;
- concurrency model;
- memory limits;
- garbage collection;
- serialization;
- persistence;
- distributed consistency.

## 26. AI Engineering Applications

Specialized hash structures can support:

- compact exact vocabularies;
- token dictionaries;
- candidate indexes;
- memoization tables;
- visited-state sets;
- preprocessing indexes.

For large AI workloads, memory layout and allocation overhead can matter as much as asymptotic complexity. This motivates specialized arrays, typed buffers, probabilistic structures, and external indexes.

## 27. When NOT to Build a Custom Hash Table

Do not implement one merely because hashing is involved.

Prefer `Map`/`Set` when:

- standard semantics are sufficient;
- maintainability matters;
- correctness risk outweighs custom optimization;
- the workload is not proven to need specialization;
- the table does not need a custom memory model.

Use a custom table only when its constraints and benefits are measurable.

## 28. Problem-Solving Framework

When asked to implement a hash table:

```text
1. Define key equality.
2. Define hash function contract.
3. Choose chaining or open addressing.
4. Define collision resolution.
5. Define load-factor thresholds.
6. Define resize policy.
7. Define deletion semantics.
8. Define API semantics.
9. State invariants.
10. Derive expected and worst-case complexity.
11. Test against a reference Map.
12. Benchmark realistic workloads.
```

## 29. Interview Preparation

Be able to explain:

1. How a hash table maps keys to locations.
2. Why collisions are unavoidable.
3. Chaining vs open addressing.
4. Load factor.
5. Why resizing requires rehashing.
6. Why deletion is difficult in open addressing.
7. Expected vs worst-case complexity.
8. Amortized insertion under geometric resizing.
9. Hash equality vs key equality.
10. JavaScript number-safety issues.
11. How you would test a custom table against `Map`.
12. Why production Node.js code usually prefers built-in `Map`.

## 30. Revision Checklist

- [ ] I can design a hash-table ADT.
- [ ] I can explain hash → bucket/slot mapping.
- [ ] I understand collision resolution.
- [ ] I can implement separate chaining.
- [ ] I understand open-addressing deletion.
- [ ] I can calculate load factor.
- [ ] I can explain resize + rehash.
- [ ] I understand amortized insertion.
- [ ] I can define key-equality semantics.
- [ ] I can state table invariants.
- [ ] I can test against a reference Map.
- [ ] I understand when custom implementation is inappropriate.

## 31. Key Takeaways

1. **A hash table is hashing plus collision resolution plus lifecycle policy.**
2. **Equal keys must hash equally; hash collisions are normal and must be resolved.**
3. **Load factor directly influences expected performance.**
4. **Resizing changes bucket/slot mapping and therefore requires rehashing.**
5. **Deletion is straightforward in chaining but subtle in open addressing.**
6. **Correctness depends on explicit equality, reachability, size, and resize invariants.**
7. **JavaScript numeric and object-identity semantics matter in custom implementations.**
8. **Built-in `Map` is usually the production default; custom tables are justified by specific constraints, not by curiosity alone.**
