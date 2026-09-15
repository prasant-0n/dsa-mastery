# 07.07 — Linear, Quadratic & Double Hashing

> **Phase 07 — Hashing**  
> **Focus:** designing and analyzing open-addressing probe sequences

## 1. Concept Definition

Open addressing resolves collisions by probing additional slots. The **probe strategy** determines which slots are examined and therefore controls clustering, coverage, cache behavior, and lookup cost.

The three foundational strategies are:

1. **Linear probing** — fixed step of `1`.
2. **Quadratic probing** — quadratic displacement from the home slot.
3. **Double hashing** — a second hash determines the key-specific step.

They share the same outer hash-table model but produce very different probe behavior.

---

## 2. Why Probe Strategy Matters

Two hash tables can use the same keys and primary hash function yet perform very differently because their collision paths differ.

Probe strategy influences:

- clustering
- average probes
- maximum probes
- cache locality
- deletion behavior
- coverage of the table
- sensitivity to load factor
- implementation complexity

Therefore, "O(1) hash table" is incomplete reasoning. You must understand the probe sequence and workload.

---

## 3. Mathematical Model

Let:

- `M` = table capacity
- `h(k)` = home index
- `i` = probe number, starting at `0`
- `P(k,i)` = slot examined at probe `i`

All strategies repeatedly evaluate `P(k,i)` modulo the table capacity.

The critical question is:

> **Does the probe sequence visit enough distinct slots to provide the required correctness guarantee?**

A strategy with excellent average behavior but poor coverage can still be incorrect.

---

## 4. Linear Probing

The standard formula is:

```text
P(k,i) = (h(k) + i) mod M
```

For a home index of `4` in a table of size `8`:

```text
4 → 5 → 6 → 7 → 0 → 1 → 2 → 3
```

Every slot is visited exactly once before repetition.

### Advantages

- simplest strategy
- excellent locality
- predictable memory access
- low metadata cost
- easy to implement and benchmark

### Disadvantage

Linear probing creates **primary clustering**.

Once a contiguous occupied run forms, new keys that encounter any point in the run tend to extend it.

---

## 5. Primary Clustering

Example:

```text
[ X X X X X . . . ]
  └──── cluster ───┘
```

A key whose home position lands anywhere before or inside this run may need to scan through many occupied slots.

As the load factor increases, these runs become more expensive.

This is the central trade-off of linear probing:

> **excellent locality vs increasing cluster length.**

---

## 6. Quadratic Probing

A common formula is:

```text
P(k,i) = (h(k) + c1*i + c2*i²) mod M
```

The exact constants matter.

For example, with `c1 = 0` and `c2 = 1`:

```text
h,
h + 1,
h + 4,
h + 9,
h + 16, ...
```

modulo `M`.

Quadratic displacement spreads probes farther apart and reduces primary clustering.

---

## 7. Quadratic Probing and Coverage

Do **not** assume quadratic probing visits every slot.

Depending on:

- table size
- coefficients
- arithmetic properties of the capacity

some slots may never be visited by a particular sequence.

Therefore a correct implementation must establish a coverage condition or impose a capacity/parameter restriction that guarantees the required behavior.

This is a major interview distinction:

> "The probe formula looks different" is not a correctness proof.

---

## 8. Secondary Clustering

Quadratic probing can still exhibit **secondary clustering**.

Keys with the same home position can follow the same quadratic sequence:

```text
key A: h → h+1 → h+4 → h+9 → ...
key B: h → h+1 → h+4 → h+9 → ...
```

They therefore continue to interfere with one another even though primary clustering is reduced.

---

## 9. Double Hashing

Double hashing uses two hash functions:

```text
P(k,i) = (h1(k) + i * h2(k)) mod M
```

`h1` determines the home position. `h2` determines the step size.

Different keys can therefore have different probe sequences even when their initial positions are related.

Example:

```text
key A: h1=2, step=3
2 → 5 → 0 → 3 → ...

key B: h1=2, step=5
2 → 7 → 4 → 1 → ...
```

This generally reduces clustering more effectively than a single fixed probe geometry.

---

## 10. Double-Hash Coverage

The step size must be compatible with the table capacity.

For the sequence:

```text
(h1 + i*h2) mod M
```

all `M` slots are reachable when:

```text
gcd(h2, M) = 1
```

for the relevant key.

If the greatest common divisor is greater than `1`, the sequence visits only a subset of the table and may cycle early.

This is a fundamental correctness property, not merely a performance optimization.

---

## 11. Comparing the Three Strategies

| Property | Linear | Quadratic | Double Hashing |
|---|---|---|---|
| Formula | `h+i` | `h+c1i+c2i²` | `h1+i·h2` |
| Primary clustering | high | reduced | strongly reduced |
| Secondary clustering | yes | yes | reduced |
| Locality | excellent | good | less predictable |
| Implementation | easiest | moderate | more complex |
| Coverage analysis | simple | parameter-dependent | gcd-dependent |
| Key-specific path | no | usually no | yes |

No strategy dominates every workload.

---

## 12. Probe Count as the Real Cost

For open addressing, one useful operational metric is:

```text
probe count = number of slots examined
```

Measure separately:

- successful-search probes
- unsuccessful-search probes
- insertion probes
- deletion probes
- maximum probe length
- percentile probe length

Average latency alone can hide pathological tails.

For backend systems, p95/p99 probe behavior can matter more than the mean.

---

## 13. Load Factor Interaction

As `α = N/M` rises, the probability of encountering occupied slots increases.

Conceptually:

```text
α ↑
 ↓
free slots ↓
 ↓
probe sequences grow
 ↓
cache accesses / comparisons ↑
 ↓
latency ↑
```

The exact expected probe formulas depend on assumptions such as uniform hashing and the strategy used. Do not memorize a single number without understanding its assumptions.

---

## 14. Deletion Works the Same Across Strategies

All three strategies normally require deletion to preserve the search path.

A deleted slot generally becomes:

```text
TOMBSTONE
```

rather than `EMPTY`.

The probe sequence is strategy-specific, but the deletion invariant is shared:

> A deleted slot must not cause a search for a displaced key to terminate early.

---

## 15. Resizing

When the table grows:

```text
old capacity M
      ↓
new capacity M'
      ↓
recompute h1 / h / h2 as required
      ↓
reinsert every live entry
```

For double hashing, the second hash step may also interact with the new capacity. Never copy entries into identical numeric positions and assume correctness.

A clean resize also eliminates tombstones.

---

## 16. Memory and Cache Behavior

### Linear probing

Often excellent for modern CPU caches because nearby probes access nearby memory.

### Quadratic probing

Still array-based but accesses become less sequential.

### Double hashing

Probe locations can be more scattered, potentially reducing locality while improving distribution.

This creates an important engineering trade-off:

```text
distribution quality ↔ memory locality
```

Benchmark on realistic hardware and workload rather than assuming the theoretically most distributed strategy will always be fastest.

---

## 17. Hash Function Interaction

Probe strategy does not rescue a fundamentally unsuitable primary hash.

A good design considers:

```text
key representation
      ↓
hash quality
      ↓
home distribution
      ↓
probe strategy
      ↓
load factor
      ↓
observed probe behavior
```

For double hashing, both `h1` and `h2` require careful design.

The second hash should not produce an unusable step such as `0`, and its values should satisfy the required coverage relationship with `M`.

---

## 18. Correctness Invariants

### Linear probing

- probe sequence covers the required slots
- search and insertion use the same sequence
- `EMPTY` can terminate search under the normal invariant
- tombstones do not terminate search

### Quadratic probing

Additionally:

- chosen parameters provide the required coverage
- capacity constraints are respected

### Double hashing

Additionally:

- `h2(k)` produces a valid non-zero step
- `gcd(h2(k), M) = 1` when full-table coverage is required

These invariants should be encoded into tests, not merely documented.

---

## 19. Backend Engineering Applications

Probe strategy can matter in high-throughput in-memory backend components:

- local caches
- request deduplication
- idempotency tracking
- routing metadata
- bounded state maps
- connection/session metadata

Example decision:

```text
Very latency-sensitive + compact hot set
        ↓
consider linear probing

Clustering is problematic
        ↓
consider quadratic probing

Need stronger key-specific distribution
        ↓
consider double hashing
```

Then benchmark under the real operation mix.

---

## 20. AI Engineering Applications

The same strategies can support:

- exact memoization tables
- visited-state sets
- candidate deduplication
- inference-result caches
- token/ID metadata lookup
- bounded agent-state maps

AI workloads can have bursty access patterns and large working sets, so evaluate:

- cache locality
- memory footprint
- probe-tail latency
- resize behavior
- adversarial or skewed keys

---

## 21. Benchmarking Methodology

A meaningful comparison should keep constant:

- key set
- capacity
- load factor
- hash function
- operation mix
- warm-up policy
- runtime/hardware
- measurement interval

Measure:

```text
throughput
average probes
p50 probes
p95 probes
p99 probes
maximum probes
memory usage
resize cost
```

Do not compare one strategy at 70% load with another at 90% load and call the result fair.

---

## 22. Problem-Solving Patterns

When a problem asks you to choose a probe strategy:

1. Determine the capacity constraints.
2. Determine the expected load factor.
3. Identify whether locality matters.
4. Identify whether clustering is likely.
5. Determine deletion frequency.
6. Establish probe coverage.
7. Estimate probe costs.
8. Benchmark if the decision is production-critical.

Pattern:

```text
Requirements
   ↓
Capacity + load factor
   ↓
Hash quality
   ↓
Probe coverage
   ↓
Clustering
   ↓
Locality
   ↓
Strategy choice
```

---

## 23. Interview Preparation

### Core

1. Explain linear probing.
2. Explain quadratic probing.
3. Explain double hashing.
4. What is primary clustering?
5. What is secondary clustering?
6. Why does double hashing reduce clustering?
7. Why can quadratic probing fail to cover the table?
8. Why must `gcd(h2(k), M) = 1` for full double-hash coverage?
9. Why does deletion require tombstones?
10. How does load factor affect probe length?

### Advanced

- Prove that linear probing visits every slot.
- Determine whether a quadratic configuration covers a given capacity.
- Derive the cycle length of a double-hash sequence.
- Design an adversarial workload for linear probing.
- Explain why better distribution can reduce locality.
- Design a benchmark that isolates probe behavior from hashing cost.

---

## 24. Implementation Lab

Build one open-addressed table with a pluggable probe strategy:

```js
createTable({
  capacity,
  hash1,
  hash2,
  strategy,
})
```

Implement:

- linear probing
- quadratic probing
- double hashing
- search
- insertion
- deletion
- tombstones
- resizing
- probe instrumentation

Then compare all strategies using identical workloads.

---

## 25. Practice Problems

The companion exercise file should make you derive:

- linear probe positions
- quadratic sequences
- double-hash sequences
- coverage conditions
- cycle lengths
- clustering metrics
- probe distributions
- strategy selection
- benchmark design
- production hash-table architecture

**Rule:** never select a probe strategy without proving or testing its coverage guarantee.

---

## 26. Revision Checklist

- [ ] I can derive the linear probing formula.
- [ ] I can explain primary clustering.
- [ ] I can derive a quadratic probe sequence.
- [ ] I understand why quadratic coverage depends on capacity and coefficients.
- [ ] I can derive double hashing.
- [ ] I understand the `gcd(h2, M) = 1` coverage condition.
- [ ] I can explain primary vs secondary clustering.
- [ ] I can measure probe counts.
- [ ] I can explain the locality/distribution trade-off.
- [ ] I can correctly handle tombstones for every strategy.
- [ ] I can resize and rehash correctly.
- [ ] I can choose a strategy from workload requirements.

## Key Takeaways

1. A probe strategy defines how an open-addressed table resolves collisions.
2. Linear probing is simple and cache-friendly but creates primary clustering.
3. Quadratic probing reduces primary clustering but requires careful coverage analysis.
4. Double hashing gives keys different step sizes and can substantially reduce clustering.
5. Probe coverage is a correctness property.
6. Load factor strongly influences probe cost.
7. Locality and distribution quality can pull performance in opposite directions.
8. Benchmark probe distributions—not only average runtime—when engineering for latency.
9. The correct strategy depends on workload, capacity, deletion behavior, memory, and threat model.
