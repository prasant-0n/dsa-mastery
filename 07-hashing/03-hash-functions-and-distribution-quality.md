# 07.03 — Hash Functions & Distribution Quality

> **Phase 07 — Hashing**
>
> A hash table is only as effective as the mapping from keys to candidate locations. This chapter studies how hash functions behave, what “good distribution” means, why clustering happens, and how to reason about hash quality without confusing table hashing with cryptographic security.

## 1. Learning Objectives

By the end of this chapter, you should be able to:

- define the job of a hash function precisely;
- distinguish hash-code generation from bucket-index reduction;
- explain determinism, uniformity, mixing, and avalanche behavior;
- analyze simple numeric and string hash functions;
- identify distribution defects and clustering;
- reason about modulo bias and table-size choices;
- distinguish hash quality from collision-resolution quality;
- understand when a fast non-cryptographic hash is appropriate;
- design experiments to evaluate a hash function;
- explain hash-function trade-offs in backend and AI systems.

---

## 2. What Makes a Hash Function Useful?

A hash function for a hash table should map a large key space into a finite numeric space while distributing realistic keys well enough that the table can resolve lookups efficiently.

Conceptually:

```text
large key space
      ↓
   hash(key)
      ↓
large numeric space
      ↓
reduce to M buckets
      ↓
0 ... M-1
```

The hash function is not required to be collision-free. For most table designs, collision-free mapping over an unrestricted key space is impossible.

---

## 3. Hash Code vs Bucket Index

Do not conflate these two operations:

```text
hashCode = h(key)
index    = reduce(hashCode, bucketCount)
```

A hash function may produce a 32-bit or 64-bit value while the table may contain only a few thousand buckets.

This separation matters when analyzing distribution and table-size effects.

---

## 4. Determinism

For a fixed hashing algorithm and key representation:

```text
h(K) = same result
```

when the same key is hashed under the same rules.

Without determinism, a key could be inserted into one location and searched in another.

Randomization can still be part of a table's design if the random seed remains stable for the table's lifetime.

---

## 5. Equality Compatibility

Hashing must obey the fundamental rule:

```text
if A equals B
then h(A) = h(B)
```

But:

```text
h(A) = h(B)
```

does not imply:

```text
A equals B
```

This is the mathematical foundation of collision handling.

---

## 6. Uniformity

Ideally, keys should be spread approximately evenly over the available buckets.

For M buckets and N independently distributed keys, the expected occupancy of a bucket is approximately:

```text
N / M
```

Uniformity reduces the amount of collision work.

Real workloads are not uniformly random, so the hash function must also mix structured inputs effectively.

---

## 7. Distribution and Real Input Structure

A hash function can appear good on random test data but fail on structured production keys.

Examples of structured keys:

```text
user-000001
user-000002
user-000003
...

192.168.1.x

order:tenant:timestamp
```

If a hash function ignores or weakly mixes the changing part, buckets can become highly uneven.

Always test realistic key distributions.

---

## 8. A Bad Hash Function

Consider:

```js
function badHash(key) {
  return key.length;
}
```

Every string with the same length receives the same hash.

For:

```text
"cat"
"dog"
"api"
"xyz"
```

all hashes are identical.

The function is deterministic, but its distribution quality is terrible for ordinary string workloads.

---

## 9. Another Weak Function

A naive character-code sum:

```text
h = c1 + c2 + c3 + ...
```

has an important weakness:

```text
"abc"
"acb"
"bac"
```

produce the same sum.

It loses positional information.

A stronger simple family uses positional mixing.

---

## 10. Polynomial String Hashing

A common conceptual form is:

```text
h = 0

for each character c:
    h = h × base + code(c)
```

The multiplication makes character position matter.

The exact base and arithmetic width are design choices.

This form is also the foundation for rolling-hash techniques studied later.

---

## 11. Why Multiplication Helps

Compare:

```text
sum(code(c))
```

with:

```text
h × base + code(c)
```

In the second formulation, earlier characters influence later digits through repeated multiplication.

Therefore permutations are much less likely to collapse to exactly the same intermediate value merely because they contain the same characters.

Collisions still remain possible.

---

## 12. Hash Mixing

Mixing attempts to spread information from different input bits throughout the output bits.

A conceptual mixing pipeline might use:

```text
xor
addition
multiplication
bit shifts
rotations
```

The exact construction depends on the hash family.

Do not memorize an arbitrary sequence of bit operations without understanding what property it is intended to improve.

---

## 13. Avalanche Behavior

A useful heuristic is that changing a small portion of the input should cause many output bits to change.

This is often called avalanche behavior.

It reduces correlations between structured input differences and bucket placement.

Avalanche quality is useful for distribution but does not by itself make a hash function cryptographically secure.

---

## 14. Speed vs Mixing Quality

Hashing is performed on every relevant operation.

A very expensive function may improve distribution but reduce total application throughput.

A useful engineering objective is:

```text
sufficient distribution
+
acceptable collision behavior
+
low computation cost
```

The right point depends on the workload.

---

## 15. Modulo Reduction

A simple bucket reduction is:

```text
index = hash mod M
```

The result is in:

```text
0 ... M-1
```

But the statistical behavior of this reduction depends on both the hash output and M.

A poor choice of table size can expose patterns in weak hash functions.

---

## 16. Power-of-Two Tables

Some implementations use bucket counts related to powers of two because bit masking can be efficient:

```text
index = hash & (M - 1)
```

when M is a power of two.

However, this makes the quality of the low output bits especially important.

A hash function with weak low-bit mixing can perform badly under such reduction.

---

## 17. Prime-Sized Tables

Another traditional strategy is to use a prime bucket count with modulo reduction.

This can reduce some simple arithmetic-pattern interactions.

However, “use a prime” is not a universal law of hash-table design. Modern implementations may use other strategies because the hash function and table architecture matter together.

---

## 18. Modulo Bias

If hash values are uniformly distributed over a range that is not an exact multiple of M, modulo reduction can make some residues slightly more likely than others.

For ordinary large hash spaces and sensible table sizes, this may be negligible.

But the principle matters when analyzing distributions precisely.

---

## 19. Bucket Occupancy

Given bucket counts:

```text
b0, b1, ..., b(M-1)
```

we can measure:

```text
mean occupancy
maximum occupancy
variance
```

A perfectly uniform distribution would make occupancies close to each other.

Real samples fluctuate even under a good hash function, so evaluation must use statistical reasoning rather than expecting perfect equality.

---

## 20. Collision Count

For N inserted keys, a simple collision metric is the number of insertions whose target bucket was already occupied.

But collision count alone is not enough.

Two hash functions can have similar total collision counts but very different concentration patterns.

Measure bucket occupancy as well.

---

## 21. Maximum Bucket Load

A useful diagnostic is:

```text
max(bucket occupancy)
```

If one bucket contains a large fraction of all entries, that indicates severe clustering.

For chaining, this can create a long chain.

For open addressing, related clustering appears as long probe sequences.

---

## 22. Variance of Bucket Occupancy

Let:

```text
x_i = occupancy of bucket i
μ = N / M
```

A basic population variance is:

```text
(1/M) × Σ(x_i - μ)^2
```

Higher variance indicates less even occupancy.

This gives a stronger distribution diagnostic than collision count alone.

---

## 23. Chi-Square Intuition

For more formal testing, bucket frequencies can be compared with the expected frequency under a uniform model.

A chi-square-style statistic can identify unusually uneven distributions.

You do not need statistical testing for every DSA problem, but the concept becomes valuable when engineering or benchmarking a hash implementation.

---

## 24. Collision Probability and the Birthday Effect

Even a good hash function will produce collisions surprisingly early relative to the size of its output space.

This is related to the birthday paradox.

If the hash space contains approximately K equally likely outputs, collisions become materially likely after roughly the square root of K samples.

This is another reason never to treat a hash as a unique identifier.

---

## 25. Hash Width Matters

Common conceptual output widths include:

```text
32-bit
64-bit
128-bit
```

A wider hash space reduces accidental collision probability for the same number of inputs, but may increase storage or computation cost depending on the implementation.

For a hash table, however, bucket reduction still determines the immediate table index.

---

## 26. Non-Cryptographic vs Cryptographic Hashing

Non-cryptographic hashing generally prioritizes:

```text
speed
distribution
low overhead
```

Cryptographic hashing additionally targets security properties such as resistance to specific forms of attack.

A cryptographic hash is not automatically the best choice for a high-throughput in-memory hash table.

Conversely, a fast table hash is not suitable for password storage or integrity/security requirements that need cryptographic guarantees.

---

## 27. Keyed Hashing and Adversarial Inputs

If an attacker controls keys, predictable hashing can sometimes be exploited to create pathological collision workloads.

A keyed or randomized hash can make deliberate collision construction harder.

This is a security-engineering consideration rather than a universal requirement for every local data structure.

---

## 28. Hash Function Families

Common conceptual families include:

```text
integer mixing hashes
polynomial string hashes
universal hashing families
non-cryptographic general-purpose hashes
cryptographic hashes
keyed hashes
```

Each family has different goals.

The correct choice depends on the threat model, key distribution, performance budget, and required semantics.

---

## 29. Universal Hashing Intuition

A universal hashing family contains multiple candidate hash functions and selects one according to a random choice.

The goal is to reduce the probability that any particular pair of distinct keys collides under the selected function.

This is especially useful when inputs may be adversarial or when theoretical collision guarantees matter.

---

## 30. Distribution Quality Is Workload-Dependent

Suppose a function performs well for:

```text
random integers
```

but poorly for:

```text
sequential IDs
```

It is not enough to call the function “good.”

Hash quality should be evaluated against the actual input domain.

---

## 31. Canonicalization Before Hashing

For logical equality, normalize before hashing when required.

Example:

```text
"User@Example.com"
"user@example.com"
```

If the application declares these equivalent, they must reach equivalent hashing semantics after canonicalization.

The hash function should not silently decide application-level equality.

---

## 32. Compound-Key Hashing

For:

```text
tenantId
userId
```

hashing each field independently and combining them can be preferable to ambiguous string concatenation.

A conceptual combination might be:

```text
h = mix(h(tenantId), h(userId))
```

The combination should preserve distinctions between field boundaries and avoid systematic correlations.

---

## 33. Mutable Inputs

If the hash depends on mutable key content, changing the key after insertion can invalidate lookup.

Therefore hash-table keys should normally have stable equality and hashing semantics during their membership lifetime.

This is especially important when building custom data structures around objects.

---

## 34. JavaScript Considerations

JavaScript's built-in `Map` and `Set` hide the hash-table implementation details.

When learning hashing, build a conceptual implementation yourself, but in production prefer the standard collection abstraction unless there is a specific reason to implement another structure.

Do not infer the exact engine algorithm from language-level behavior.

---

## 35. Backend Applications

Hash quality can affect:

```text
cache key distribution
session lookup
in-memory routing tables
rate-limit state
connection pools
idempotency stores
partition selection
```

Poor distribution can create hot buckets or hot partitions, increasing latency even when the asymptotic algorithm remains nominally O(1).

---

## 36. Distributed Systems Preview

Distributed systems often hash keys to select a node or partition:

```text
key
 ↓
hash
 ↓
partition/node
```

Here distribution quality affects workload balance across machines, not merely entries inside one process.

Consistent hashing and partitioning will be studied later.

---

## 37. AI Applications

AI systems can hash exact identifiers such as:

```text
prompt + model + version + parameters
embedding ID
feature key
document ID
agent state ID
```

Poor hashing can create cache hot spots or uneven work distribution.

For semantic similarity, however, ordinary exact-key hashing is not a replacement for vector indexes or nearest-neighbor algorithms.

---

## 38. Experimental Evaluation

A serious hash-function experiment should measure:

```text
bucket occupancy
collision count
maximum bucket load
variance
hash computation time
lookup time
memory overhead
```

Test multiple input families:

```text
random
sequential
structured strings
long strings
repeated prefixes
adversarial-looking patterns
```

Do not conclude from a single dataset.

---

## 39. Correctness vs Quality

A hash function can be:

```text
correct but poorly distributed
```

A function is correct for table equality if equal keys always hash equally.

Distribution quality is a performance property.

This distinction is essential:

```text
correctness → table semantics remain valid
quality     → table performs well
```

---

## 40. Common Mistakes

- Believing collisions indicate a broken hash function.
- Treating a hash as a unique ID.
- Testing only random input.
- Ignoring structured production keys.
- Looking only at total collision count.
- Ignoring maximum bucket load.
- Assuming more hash bits automatically means faster lookup.
- Confusing cryptographic security with distribution quality.
- Using a hash to define application equality accidentally.
- Assuming prime table sizes are always superior.
- Assuming JavaScript `Map` exposes a specific implementation.

---

## 41. Interview Questions

1. What makes a good hash function?
2. Why must equal keys have equal hashes?
3. Why can different keys have equal hashes?
4. What is avalanche behavior?
5. Why does key distribution matter?
6. What is modulo bias?
7. Why might power-of-two table sizes care about low bits?
8. What is the birthday paradox's relevance to hashing?
9. Non-cryptographic vs cryptographic hashing?
10. What is universal hashing?
11. How would you test a custom hash function?
12. Why can a hash function be correct but still poor?
13. How can adversarial inputs hurt a hash table?
14. How does hashing affect distributed partitioning?
15. Why is exact-key hashing different from semantic AI retrieval?

---

## 42. Implementation Lab

Implement at least three candidate hash functions for strings:

```text
length-based
character-sum
polynomial/mixed
```

Feed them the same realistic datasets and record:

```text
collision count
maximum bucket load
occupancy variance
hash time
lookup time
```

Then explain which function you would choose and why.

Do not optimize blindly. First identify the measured bottleneck.

---

## 43. Revision Checklist

- [ ] I can separate hash-code generation from bucket-index reduction.
- [ ] I understand determinism and equality compatibility.
- [ ] I can explain uniformity and distribution quality.
- [ ] I understand why structured inputs matter.
- [ ] I can explain polynomial string hashing.
- [ ] I understand mixing and avalanche behavior.
- [ ] I understand modulo reduction and modulo bias.
- [ ] I know why table-size strategy interacts with hash quality.
- [ ] I understand collision probability and the birthday effect.
- [ ] I can distinguish cryptographic and non-cryptographic hashing.
- [ ] I understand universal hashing at a conceptual level.
- [ ] I can evaluate a hash function experimentally.
- [ ] I can explain backend partitioning implications.
- [ ] I can explain AI exact-key caching implications.

---

## 44. Key Takeaways

1. A hash function converts keys into numeric routing information.
2. Hash-code generation and bucket reduction are separate concepts.
3. Equal keys must hash equally; unequal keys may still collide.
4. Distribution quality determines how much collision work the table performs.
5. Realistic structured inputs are essential when evaluating a hash function.
6. Mixing and avalanche behavior help reduce harmful input/output correlations.
7. Table-size strategy interacts with the properties of the hash output.
8. Collision probability grows much sooner than intuition may suggest because of the birthday effect.
9. Hash-table performance and cryptographic security are different objectives.
10. Good hash engineering is a workload-and-threat-model decision, not a single memorized formula.
