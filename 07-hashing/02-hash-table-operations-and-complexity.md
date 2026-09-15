# 07.02 — Hash Table Operations & Complexity

> **Phase 07 — Hashing**
>
> This chapter turns the hashing mental model into an operational model. The goal is to understand exactly what happens during insert, lookup, update, and delete—and why these operations are expected O(1), when they degrade, and how resizing changes the analysis.

## 1. Learning Objectives

You should be able to:

- trace a hash-table operation step by step;
- distinguish lookup, insertion, update, and deletion;
- reason about successful and unsuccessful searches;
- analyze collision work;
- derive expected and worst-case complexity;
- separate ordinary operation cost from resizing cost;
- understand amortized cost of dynamic resizing;
- compare chaining and open-addressing complexity at a high level;
- identify workload-dependent performance factors;
- explain these trade-offs in backend interviews.

---

## 2. Abstract Hash Table API

A key-value table normally exposes:

```text
set(key, value)
get(key)
has(key)
delete(key)
size()
```

The abstraction promises dictionary semantics, while the implementation decides how keys are stored.

---

## 3. Insert

Conceptual execution:

```text
set(K, V)
  ↓
compute h(K)
  ↓
compute bucket/probe start
  ↓
inspect candidate location(s)
  ↓
if K exists → update value
else → create entry
```

The operation is not simply “put value at hash index.” Collision handling determines the remaining work.

---

## 4. Lookup

Conceptual execution:

```text
get(K)
  ↓
compute h(K)
  ↓
find starting bucket/probe position
  ↓
inspect candidates
  ↓
compare keys
  ↓
return matching value
```

A successful lookup stops when the actual key is found.

An unsuccessful lookup must establish that no matching key exists.

---

## 5. Update

A key-value update is usually a lookup followed by replacement:

```text
set(existingKey, newValue)
```

A correct implementation must not accidentally create a duplicate logical entry for the same key.

Therefore the table needs a clear key-equality rule.

---

## 6. Delete

Deletion means removing a key-value association while preserving future lookup correctness.

This requirement is easy with separate chaining but requires special treatment in open addressing.

Never analyze deletion independently from the collision-resolution strategy.

---

## 7. Successful vs Unsuccessful Search

For chaining, successful lookup may inspect some number of entries in one bucket.

Unsuccessful lookup must establish that the key is absent from that bucket.

For open addressing, unsuccessful search may continue through a probe sequence until an empty slot or other termination condition is reached.

Therefore “O(1)” is shorthand for an expected bounded amount of work under assumptions about distribution and load.

---

## 8. Why Expected O(1)?

Suppose:

```text
N entries
M buckets
```

and hashing distributes keys reasonably evenly.

The average number of entries associated with a bucket is approximately related to:

```text
α = N / M
```

If α is controlled by resizing and collisions are well distributed, each operation examines only a small expected number of candidates.

Hence:

```text
expected lookup ≈ O(1)
expected insert  ≈ O(1)
expected delete  ≈ O(1)
```

---

## 9. Chaining Cost Intuition

With separate chaining, a bucket can hold multiple entries:

```text
bucket[3] → (K1,V1) → (K8,V8) → (K20,V20)
```

The expected chain length is influenced by α.

A simplified model gives expected work proportional to:

```text
O(1 + α)
```

for common search cases under uniform hashing assumptions.

When α is maintained as a constant, this becomes expected O(1).

---

## 10. Open Addressing Cost Intuition

Open addressing stores entries directly in the table array.

A collision produces a probe sequence:

```text
p0 → p1 → p2 → p3 → ...
```

The number of probes depends strongly on the load factor and probing strategy.

As the table becomes full, probe lengths can grow rapidly.

---

## 11. Worst-Case O(N)

A pathological table can behave like a linear structure:

```text
K1 → same bucket
K2 → same bucket
K3 → same bucket
...
KN → same bucket
```

A lookup may inspect N candidates.

Therefore:

```text
worst-case = O(N)
```

This is why “hash table = O(1)” is incomplete interview reasoning.

---

## 12. Hash Computation Is Part of the Cost

For a string key of length L, hashing may itself require reading the characters.

Therefore a more precise model can be:

```text
hash computation: O(L)
lookup after hashing: expected O(1)
```

So for large variable-length keys, the total cost is not literally independent of key size.

A useful engineering model is:

```text
O(key length + expected table work)
```

---

## 13. Complexity Depends on Key Representation

For numeric keys, hashing can often be close to constant work.

For strings:

```text
"a"       → short
"a...z"   → longer
```

For compound keys, serialization/canonicalization may add additional work.

Always state what your input-size parameter represents.

---

## 14. Space Complexity

For N stored entries, a hash table requires storage for:

```text
entries
bucket metadata
collision structure
unused capacity
```

Typical total space is:

```text
O(N)
```

with the constant affected by load factor and representation.

---

## 15. Auxiliary vs Total Space

If a function creates a frequency map from an input array of N values:

```text
input → existing memory
frequency map → additional memory
```

The auxiliary space is O(U), where U is the number of distinct values.

Since U ≤ N, it is often stated as O(N) in a simpler analysis.

Precision matters when comparing algorithms.

---

## 16. Resizing

A dynamic table periodically grows when its load factor becomes too high.

Conceptually:

```text
old table
   ↓
allocate larger table
   ↓
recompute positions
   ↓
insert old entries
   ↓
replace table
```

Why recompute positions?

Because the bucket count changed, so the mapping from hash code to bucket index may change.

---

## 17. Resize Cost

If there are N entries, rebuilding the table costs approximately:

```text
O(N)
```

This creates an important distinction:

```text
individual resize operation → O(N)
normal operation             → expected O(1)
```

The correct long-run analysis uses amortized reasoning.

---

## 18. Amortized Insertion Cost

Suppose capacity grows geometrically, for example:

```text
8 → 16 → 32 → 64 → ...
```

Although one insertion may trigger O(N) rebuilding, expensive rebuilds happen increasingly far apart.

Across many operations, the total resizing work is linear in the number of inserted entries under standard geometric-growth assumptions.

Therefore the amortized insertion cost remains O(1).

---

## 19. Why Geometric Growth Matters

If capacity increased by only one slot each time:

```text
N → N+1
```

repeated resizing could cause quadratic total work.

Geometric growth reduces the number of rebuilds while maintaining bounded unused capacity.

This is the same broad amortized-design principle encountered with dynamic arrays.

---

## 20. Deletion and Capacity

Deletion does not necessarily shrink a table immediately.

Aggressive shrinking can cause oscillation:

```text
insert → grow
remove → shrink
insert → grow
remove → shrink
```

This can create unnecessary rebuilding.

Production implementations use thresholds and hysteresis or other policies to control resize churn.

---

## 21. Collision Cost

The total lookup cost can be viewed as:

```text
hashing cost
+
indexing cost
+
candidate inspection cost
+
key comparison cost
```

Good hashing mainly tries to control candidate inspection.

It cannot eliminate the cost of computing a long key's hash or comparing long keys.

---

## 22. Workload Matters

Two hash tables with identical N can have different performance because of:

```text
key lengths
key distribution
load factor
collision patterns
cache behavior
allocation behavior
resize frequency
access locality
```

As an engineer, complexity classes are the beginning of analysis, not the end.

---

## 23. Operation Complexity Summary

| Operation | Expected | Worst case | Notes |
|---|---:|---:|---|
| `get` | O(1) | O(N) | plus key hashing |
| `has` | O(1) | O(N) | same search behavior |
| `set` | O(1) amortized | O(N) | resize/collisions can dominate |
| `delete` | O(1) | O(N) | strategy-dependent |
| resize | — | O(N) | rebuilds entries |
| space | O(N) | O(N) | depends on capacity policy |

For variable-length keys, include key-processing cost when precision is required.

---

## 24. Chaining vs Open Addressing

### Separate chaining

Advantages:

- deletion is conceptually straightforward;
- load factor can exceed 1;
- collision entries live outside the primary array.

Trade-offs:

- extra references/objects;
- pointer chasing;
- allocation overhead.

### Open addressing

Advantages:

- entries remain in table storage;
- can have good locality;
- avoids per-entry chain nodes.

Trade-offs:

- deletion is more complex;
- performance degrades as load becomes high;
- probe behavior matters heavily.

Later chapters study each strategy deeply.

---

## 25. Hash Table vs Array Lookup

Unsorted array membership:

```text
O(N)
```

Hash membership:

```text
expected O(1)
```

The trade-off is additional memory and loss of inherent ordering.

---

## 26. Hash Table vs Sorted Array

Sorted-array lookup:

```text
search → O(log N)
```

But insertion may cost:

```text
O(N)
```

due to shifting.

A hash table is often better when the dominant operation is exact membership/update rather than ordered queries.

---

## 27. Hash Table vs Balanced Tree

Balanced search tree:

```text
lookup → O(log N)
insert → O(log N)
delete → O(log N)
```

Advantages include ordered traversal and range queries.

Hash tables trade ordering for expected constant-time exact lookup.

---

## 28. Backend Example: Session Store

Suppose a service needs:

```text
sessionId → session data
```

A request performs:

```text
extract session ID
→ hash key
→ locate entry
→ validate session
```

Expected lookup is constant with controlled load and good distribution.

In a distributed backend, the actual store may be Redis or another service, but the same dictionary abstraction and complexity reasoning remain useful.

---

## 29. Backend Example: Idempotency

For an API:

```text
idempotencyKey → result/status
```

Hash-based lookup lets the service quickly determine whether a request key has already been processed.

Correctness still depends on atomicity and persistence; hashing only addresses the lookup problem.

---

## 30. Backend Example: Cache

A cache often behaves conceptually as:

```text
cacheKey → cached response
```

The key might include:

```text
route
user/tenant
query parameters
version
locale
```

The key must be canonicalized before hashing if logically equivalent requests should share a cache entry.

---

## 31. AI Example: Exact-Key Memoization

An AI pipeline can cache deterministic work using:

```text
model + version + prompt + parameters
```

as a canonical key.

Then:

```text
key → cached output
```

This is exact-key caching—not semantic retrieval.

---

## 32. AI Example: Candidate Deduplication

Suppose a retrieval system produces candidate IDs:

```text
[17, 4, 17, 9, 4, 12]
```

A hash set can track seen IDs in expected O(N) total time and prevent duplicate downstream processing.

---

## 33. Correctness Invariants

For a key-value hash table:

1. Every stored key is reachable using the same lookup procedure used for insertion.
2. Equal keys do not create multiple logical entries unless explicitly supported.
3. Hash collisions do not merge distinct keys.
4. Lookup never returns a value for a non-equal key.
5. Deletion preserves future lookup correctness.
6. Resizing preserves all logical key-value associations.

These invariants are more important than memorizing O(1).

---

## 34. Failure Modes

Watch for:

```text
bad hash distribution
excessive load
broken equality
incorrect deletion
failed rehashing
resize thrashing
mutable keys
ambiguous compound keys
adversarial inputs
```

A table can be asymptotically “correct” while still being operationally poor.

---

## 35. Mutable Keys

If key identity depends on mutable data, changing that data after insertion can make the entry unreachable under its original hashing rules.

Conceptually:

```text
insert key K
→ hash(K) = H1

mutate K
→ hash(K) = H2
```

The entry may still physically exist but no longer be found where lookup expects it.

Prefer stable key representations.

---

## 36. Benchmarking Hash Tables

Do not benchmark only successful lookups.

Measure representative workloads:

```text
insert-heavy
lookup-heavy
mixed read/write
successful lookup
unsuccessful lookup
high collision
high load
resize-heavy
short keys
long keys
```

Use warm-up and repeated measurements when benchmarking JavaScript runtimes, and avoid drawing conclusions from one tiny run.

---

## 37. Interview Reasoning Template

When asked “What is the complexity of a hash table lookup?”, answer:

> “Expected O(1) under a suitable hash distribution and controlled load factor, because only a constant expected number of candidates are inspected. Worst-case can be O(N) under pathological collisions. If keys are variable-length, hashing the key itself also costs time proportional to the key representation.”

This is much stronger than simply saying “O(1).”

---

## 38. Problem-Solving Patterns

Hashing commonly appears in:

- frequency counting;
- membership testing;
- duplicate detection;
- complement lookup;
- grouping;
- memoization;
- prefix-state lookup;
- exact-key caching;
- visited-state tracking.

The key recognition question is:

> “Do I need repeated exact lookup by a value or state?”

If yes, hashing should be one of your first candidates.

---

## 39. Implementation Lab

Build a hash table using a fixed bucket array and a deliberately simple hash function.

Then instrument:

```text
number of entries
number of buckets
load factor
collision count
lookup probes/comparisons
resize count
```

Run the same workload under multiple distributions.

The objective is to connect mathematical complexity to observed behavior.

---

## 40. Revision Checklist

- [ ] I can trace `set`, `get`, `has`, and `delete`.
- [ ] I can explain successful and unsuccessful lookup.
- [ ] I understand expected O(1).
- [ ] I can explain why worst-case is O(N).
- [ ] I can include key-hashing cost in a precise analysis.
- [ ] I understand load factor.
- [ ] I understand why resizing costs O(N).
- [ ] I can explain amortized O(1) insertion under geometric growth.
- [ ] I can compare chaining and open addressing.
- [ ] I can compare hashing with arrays and trees.
- [ ] I understand mutable-key failure modes.
- [ ] I can instrument a hash table for collision/probe analysis.
- [ ] I can explain backend and AI lookup applications.
- [ ] I can give a rigorous interview answer for hash-table complexity.

---

## 41. Key Takeaways

1. Hash-table operations are algorithms, not magic O(1) primitives.
2. Lookup cost is the sum of hashing, indexing, candidate inspection, and key comparison.
3. Expected O(1) depends on distribution and controlled load.
4. Worst-case collisions can produce O(N) work.
5. Resizing costs O(N) at the resize event but can be O(1) amortized per insertion under geometric growth.
6. Variable-length keys require key-processing cost in precise complexity models.
7. Collision strategy determines important deletion and locality behavior.
8. Correctness invariants must survive collisions, deletion, and resizing.
9. Backend and AI systems frequently use the same exact-key lookup model for sessions, caches, idempotency, memoization, and deduplication.
10. The next step is understanding how hash functions determine distribution quality.
