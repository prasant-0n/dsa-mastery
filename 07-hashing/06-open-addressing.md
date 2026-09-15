# 07.06 — Open Addressing

> **Phase 07 — Hashing**  
> **Focus:** collision resolution by probing inside the table itself

## 1. Concept Definition

**Open addressing** is a hash-table collision-resolution strategy in which every entry is stored directly inside the table's slot array. When the home slot is occupied, the algorithm follows a deterministic **probe sequence** until it finds the key or an available slot.

Conceptually:

```text
hash(key) → home slot
               ↓ collision
        probe slot 1
               ↓ collision
        probe slot 2
               ↓
        available / key found
```

Unlike separate chaining, there is no separate linked chain of entry objects outside the primary slot array.

---

## 2. Why Open Addressing Exists

A hash function maps keys into a finite table. Collisions are unavoidable. Open addressing resolves those collisions by searching for another slot according to a probe rule.

The design trades some flexibility for a compact memory layout:

```text
slot 0 | slot 1 | slot 2 | slot 3 | slot 4 | ...
 entry | empty  | entry  | entry  | empty  |
```

This can provide excellent cache locality because entries are stored in a contiguous array-like structure.

---

## 3. Mental Model

Separate chaining asks:

> "Which bucket contains my collision list?"

Open addressing asks:

> "Which slot in my probe sequence should contain this key?"

For a key `k`, define a probe function:

```text
P(k, 0), P(k, 1), P(k, 2), ...
```

The table searches these positions until it finds:

- the target key,
- a slot that proves the key is absent, or
- a condition indicating the table cannot continue safely.

---

## 4. Mathematical Model

Let:

- `M` = number of table slots
- `N` = number of stored entries
- `α = N / M` = load factor
- `h(k)` = home position
- `P(k, i)` = position examined on probe `i`

A correct probe sequence should eventually cover enough of the table to provide the required insertion/search guarantee.

Open addressing normally requires:

```text
N < M
```

because entries cannot live outside the table's slots.

As `α` approaches `1`, probe sequences become longer and performance can degrade sharply. Therefore practical open-addressed tables keep a meaningful amount of empty capacity.

---

## 5. Core Operations

### 5.1 Search

1. Compute the key's home position.
2. Examine the probe sequence.
3. If the key is found, return it.
4. If a genuinely never-used slot is reached, the key is absent.
5. Continue correctly through deleted slots represented by tombstones.

### 5.2 Insert

1. Probe for the key.
2. Update if an equal key already exists according to API semantics.
3. Otherwise place the new entry in the first valid available position according to the strategy.

### 5.3 Delete

Deletion is the major conceptual difference from chaining. Simply marking a deleted slot as empty can break searches for keys that were displaced beyond that slot.

Therefore open addressing typically uses a **tombstone** state:

```text
EMPTY       → never occupied
OCCUPIED    → currently contains an entry
TOMBSTONE   → previously occupied; search must continue
```

A tombstone can be reused for insertion but cannot always terminate a search.

---

## 6. Slot State Machine

A useful model is:

```text
          insert
EMPTY ─────────────→ OCCUPIED
                       │
                       │ delete
                       ↓
                   TOMBSTONE
                       │
                       │ reuse
                       ↓
                   OCCUPIED
```

The distinction between `EMPTY` and `TOMBSTONE` is essential for correctness.

---

## 7. Probe Sequence Requirements

A probe strategy must be deterministic for a given key and table state/configuration.

For example, linear probing uses:

```text
P(k, i) = (h(k) + i) mod M
```

Quadratic probing uses a quadratic offset, and double hashing uses a second hash function to determine the step size.

A poor probe function can fail to visit enough slots, causing false insertion failures even when free slots remain.

---

## 8. Memory Model

A typical table contains:

```text
slots[0 ... M-1]

slot =
  EMPTY
  OCCUPIED { key, value }
  TOMBSTONE
```

Space is `O(M)`.

This differs from chaining, whose explicit entry storage is usually `O(N)` plus bucket-array overhead. Open addressing allocates the slot capacity up front or through resize operations.

The contiguous layout can improve locality, but oversized tables consume memory even when many slots are unused.

---

## 9. Complexity

Under good distribution and a controlled load factor, open addressing can provide expected near-constant-time operations.

Typical high-level bounds:

| Operation | Expected | Worst case |
|---|---:|---:|
| Search | `O(1)` | `O(N)` |
| Insert | `O(1)` | `O(N)` |
| Delete | `O(1)` | `O(N)` |
| Resize/rehash | `O(N)` | `O(N)` |

These are assumptions, not guarantees independent of the hash and probe strategy.

The actual cost depends strongly on load factor, clustering, probe sequence quality, key hashing cost, and cache behavior.

---

## 10. Linear Probing

Linear probing checks consecutive slots:

```text
h, h+1, h+2, h+3, ... (mod M)
```

### Strengths

- very simple
- excellent locality
- low metadata overhead
- often fast in practice at moderate load factors

### Weakness

**Primary clustering**: contiguous runs of occupied slots tend to grow and attract more entries, increasing probe lengths.

Example:

```text
[ X X X X . . X . ]
      ↑ cluster
```

---

## 11. Quadratic Probing

A common conceptual form is:

```text
P(k, i) = (h(k) + c1*i + c2*i²) mod M
```

It spreads probes more widely than linear probing and can reduce primary clustering.

However, depending on the parameters and table size, it may not visit every slot. The exact probe-coverage guarantee must therefore be analyzed rather than assumed.

---

## 12. Double Hashing

Double hashing uses two hash functions:

```text
P(k, i) = (h1(k) + i * h2(k)) mod M
```

The second hash controls the step size.

A valid design must ensure the step size is compatible with the table size so that the probe sequence can cover the intended slot set.

Double hashing usually distributes probes better than simple linear probing and is useful when reducing clustering is important.

---

## 13. Clustering

Two major concepts:

### Primary clustering

Associated strongly with linear probing: large contiguous runs form.

### Secondary clustering

Different keys with the same initial hash can follow the same probe pattern even when the probe rule is not linear.

Double hashing reduces both effects more effectively because the probe step can differ between keys.

---

## 14. Deletion and Tombstones

Consider:

```text
hash(A) = 2
hash(B) = 2
```

Suppose the table becomes:

```text
2: A
3: B
```

If `A` is deleted and slot `2` becomes `EMPTY`, searching for `B` might stop at slot `2` and incorrectly conclude that `B` is absent.

With a tombstone:

```text
2: TOMBSTONE
3: B
```

search continues.

Tombstones have a cost: too many deleted slots can lengthen future probes. Production tables therefore often clean them through rehashing or resize operations.

---

## 15. Load Factor Engineering

For open addressing, load factor is more operationally sensitive than for chaining.

As the table fills:

```text
α ↑  →  empty slots ↓  →  probe length ↑  →  latency ↑
```

A production implementation should establish thresholds for:

- maximum occupancy
- tombstone ratio
- resize trigger
- shrink policy, if supported

Do not choose a threshold solely because it is common elsewhere. Benchmark the actual workload.

---

## 16. Resizing and Rehashing

When resizing from `M` to `M'` slots, existing entries must normally be reinserted under the new probe geometry.

```text
old table
   ↓
allocate new slot array
   ↓
iterate live entries
   ↓
recompute home/probe positions
   ↓
insert into new table
```

Tombstones are normally discarded during a clean rehash because they represent historical occupancy, not live entries.

The resize itself costs `O(N)`.

---

## 17. Correctness Invariants

A robust open-addressed table should preserve:

1. Every live key occupies exactly one slot.
2. Every live key is reachable through its probe sequence.
3. `EMPTY` terminates a search only when the probe semantics justify it.
4. `TOMBSTONE` never incorrectly terminates a search.
5. No live key is stored twice when the API requires unique keys.
6. `size` counts live entries, not tombstones.
7. Probe sequences remain within valid table indices.
8. Resize/rehash preserves all live key/value pairs.
9. The table never reports a false negative for an existing key.
10. Insertion cannot overwrite an unrelated live key.

Invariant #2 is particularly important: **storage location is not arbitrary; it must remain discoverable by the search procedure.**

---

## 18. JavaScript Implementation Lab

Build an open-addressed table without using `Map` or `Set` internally.

A useful conceptual representation is:

```js
{
  slots: Array(capacity),
  size: 0,
  tombstones: 0,
  capacity,
}
```

Represent slot state explicitly. Avoid relying on ordinary `undefined` alone because a stored value may itself be `undefined` depending on API design.

Keep these layers separate:

```text
key
 ↓
hash
 ↓
home index
 ↓
probe sequence
 ↓
slot state
 ↓
key equality
```

---

## 19. Backend Engineering Applications

Open addressing can be useful where compact, high-throughput in-memory lookup matters:

- hot in-process caches
- routing tables
- connection/session metadata
- request deduplication
- idempotency-key tracking
- bounded lookup tables
- high-throughput counters and state maps

But backend design must also consider:

- concurrent access
- resizing pauses
- memory limits
- untrusted keys
- tail latency
- garbage-collection behavior
- persistence requirements

A data structure that wins a microbenchmark can still be the wrong production choice if resizing or memory behavior violates service-level objectives.

---

## 20. AI Engineering Applications

Open addressing can support compact high-throughput exact lookup in AI systems:

- visited-state sets during search
- exact memoization tables
- candidate-ID deduplication
- token/ID metadata tables
- inference result caches
- bounded feature/state maps
- compact agent-state registries

For large AI workloads, evaluate memory footprint and cache locality alongside asymptotic complexity.

---

## 21. Chaining vs Open Addressing

| Dimension | Separate Chaining | Open Addressing |
|---|---|---|
| Storage | buckets + entries | slots only |
| Load factor | can exceed `1` | must remain below capacity |
| Collision handling | bucket collection | probing |
| Deletion | direct removal | tombstones/rehash |
| Locality | often weaker | often stronger |
| Allocation | more entry allocation | compact slot storage |
| High occupancy | degrades gradually | can degrade sharply |
| Implementation | conceptually simple | more state-sensitive |

The right choice depends on workload, memory model, latency requirements, deletion frequency, concurrency model, and threat model.

---

## 22. Problem-Solving Patterns

Recognize open addressing when a problem requires:

- a fixed/contiguous table
- no external collision lists
- probing after collisions
- custom hash-table implementation
- reasoning about tombstones
- comparing linear/quadratic/double hashing
- analyzing clustering

Reasoning sequence:

```text
key
 ↓
hash
 ↓
home slot
 ↓
occupied?
 ├── no → use/search slot
 └── yes → continue probe sequence
```

For deletion, add:

```text
EMPTY ≠ TOMBSTONE
```

---

## 23. Interview Preparation

### Core questions

1. What is open addressing?
2. How does it differ from separate chaining?
3. Why must `N < M`?
4. What is a probe sequence?
5. Why does deletion require tombstones or rehashing?
6. What is primary clustering?
7. What is secondary clustering?
8. Compare linear probing, quadratic probing, and double hashing.
9. Why does high load factor hurt open addressing?
10. Why must entries be rehashed after resizing?

### Senior-level questions

- How would you choose a load-factor threshold?
- How would you handle a high tombstone ratio?
- How would you prove that a probe sequence covers the table?
- How does cache locality change the performance comparison with chaining?
- How would you benchmark probe lengths rather than only wall-clock latency?
- How would you defend an open-addressed table against adversarial collision patterns?

---

## 24. Implementation Lab

### Stage 1 — Fixed table

Implement:

- slot states
- hashing
- probing
- insert
- get
- has
- delete

### Stage 2 — Collision analysis

Measure:

- probes per operation
- maximum probe length
- average probe length
- occupancy
- clustering

### Stage 3 — Resizing

Implement:

- growth threshold
- rehashing
- tombstone cleanup
- optional shrink policy

### Stage 4 — Strategy comparison

Implement and benchmark:

- linear probing
- quadratic probing
- double hashing

Use the same key set, table sizes, operation mix, and measurement methodology.

---

## 25. Practice Problems

The companion exercise file contains unsolved tasks covering:

- slot-state modeling
- probe sequences
- insertion/search
- tombstone correctness
- clustering metrics
- load-factor analysis
- resizing
- rehashing
- linear/quadratic/double hashing
- invariant validation
- benchmarking
- backend design
- AI exact-lookup design

**Rule:** prove that your search and insertion procedures agree on the same probe sequence before optimizing them.

---

## 26. Revision Checklist

- [ ] I can explain open addressing from first principles.
- [ ] I understand home slots and probe sequences.
- [ ] I know why open addressing needs free capacity.
- [ ] I can explain `EMPTY`, `OCCUPIED`, and `TOMBSTONE`.
- [ ] I can explain why naive deletion breaks search.
- [ ] I can implement linear probing.
- [ ] I can reason about quadratic probing.
- [ ] I can explain double hashing.
- [ ] I understand primary and secondary clustering.
- [ ] I can resize and rehash a table correctly.
- [ ] I can compare chaining and open addressing using workload characteristics.
- [ ] I can defend the design in a backend/AI engineering interview.

## Key Takeaways

1. Open addressing stores live entries directly in the table's slots.
2. Collisions are resolved by probing, not external chains.
3. `EMPTY` and `TOMBSTONE` have different semantic meanings.
4. High load factor can dramatically increase probe cost.
5. Linear probing is simple and cache-friendly but suffers primary clustering.
6. Quadratic probing changes the probe geometry but requires careful coverage analysis.
7. Double hashing provides key-dependent probe steps and can reduce clustering.
8. Resizing normally requires rehashing every live entry.
9. Correctness depends on maintaining the relationship between insertion and search probe sequences.
10. Real engineering decisions require measuring locality, memory, latency, deletion behavior, and adversarial workloads—not just Big-O.
