# 07.12 — String Hashing & Rolling Hash

## 1. Concept Definition

**String hashing** maps a string or substring to a compact numeric fingerprint. A **rolling hash** is designed so that the hash of a neighboring window can be updated efficiently when the window moves.

The goal is usually not to prove that two strings are equal from a hash alone. The goal is to make candidate comparison, substring indexing, or pattern detection much cheaper, while understanding and controlling collision risk.

## 2. Why It Exists

Naively comparing a pattern of length `m` against every position in a text of length `n` can require `O(nm)` character comparisons.

A rolling hash can compute each window fingerprint in roughly constant update time after preprocessing, giving expected/typical `O(n + m)` pattern-search behavior under an appropriate collision strategy.

```text
text windows
     ↓
rolling fingerprints
     ↓
compare hash values
     ↓
verify candidates when correctness requires it
```

## 3. Mental Model

Treat a string as a sequence of digits in a positional numeral system.

For characters represented by values `x₀, x₁, ..., xₙ₋₁`:

```text
H = x₀·Bⁿ⁻¹ + x₁·Bⁿ⁻² + ... + xₙ₋₁
```

Usually this value is reduced modulo a large modulus or represented with machine-word arithmetic.

The important property is that removing the outgoing character and adding the incoming character can be done without rebuilding the entire hash.

## 4. Polynomial Rolling Hash

A common form is:

```text
H(s) = Σ value(s[i]) · B^(n-1-i) mod M
```

where:

- `B` = base;
- `M` = modulus;
- `value(c)` = deterministic character encoding.

The choice of encoding, base, modulus, and arithmetic model affects distribution, speed, and collision behavior.

## 5. Prefix Hash Model

A prefix-hash representation can be defined as:

```text
P[0] = 0
P[i + 1] = (P[i] · B + value(s[i])) mod M
```

Precompute powers:

```text
power[0] = 1
power[i + 1] = power[i] · B mod M
```

With a compatible convention, substring hashes can be extracted from prefix hashes without scanning the substring.

Always derive the exact formula from the chosen convention instead of copying a formula from a different orientation.

## 6. Substring Hash Extraction

For a prefix recurrence of the form above, the hash contribution of a substring can be isolated using prefix values and powers.

Conceptually:

```text
prefix hash at r
      −
prefix hash before l × base^(length)
```

then normalize modulo `M`.

The exact arithmetic must account for negative intermediate results and modular normalization.

## 7. Rolling Window Update

For a fixed-size window:

```text
old window: abcde
new window: bcdef
```

The update conceptually performs:

```text
remove a
shift remaining contribution
add f
```

This avoids recomputing all five characters.

For a window of length `m`, the update is typically `O(1)` arithmetic operations after the required power is available.

## 8. Hash Collisions

Different strings can produce the same hash:

```text
s ≠ t
but
H(s) = H(t)
```

This is a **collision**.

Therefore a single rolling hash is generally a probabilistic fingerprint, not a mathematical proof of equality.

Collision probability depends on the hash design, input distribution, modulus/arithmetic, and adversarial model.

## 9. Correctness Strategies

There are several engineering choices:

### A. Hash as a filter + exact verification

```text
hash matches
    ↓
compare actual characters
```

This preserves exact correctness while using hashing to reject most non-matches quickly.

### B. Double hashing

Use two independently designed hash values:

```text
(H₁(s), H₂(s))
```

A collision must occur in both components.

### C. Randomized parameters

Randomize suitable hash parameters when the threat model includes adversarial inputs.

### D. Exact algorithms

If a deterministic guarantee is more important than fingerprint speed, use an exact string-matching algorithm such as KMP or another appropriate deterministic technique.

## 10. Rolling Hash vs KMP

| Property | Rolling Hash | KMP |
|---|---|---|
| Core idea | Fingerprints | Prefix/failure structure |
| Typical search | Expected/heuristic linear | Guaranteed linear |
| Collision issue | Yes | No |
| Multiple substring equality | Very useful | Less direct |
| Easy substring fingerprinting | Excellent | Not its main purpose |
| Adversarial guarantee | Requires careful design | Deterministic |

Rolling hash is especially attractive when the task involves many substring equality queries or comparing many candidate windows.

## 11. Multi-Pattern and Dictionary Matching

For many patterns, hashing can create an index:

```text
hash(pattern) → candidate patterns
```

Then text windows can be hashed and looked up.

Collision handling is essential if the final answer must be exact.

For large dictionaries, memory and preprocessing costs become important.

## 12. Duplicate Substring Detection

To detect repeated substrings of fixed length `L`:

```text
for each window:
    compute rolling hash
    check Set/Map
```

If a hash repeats:

```text
candidate duplicate
```

Then verify exact equality if correctness cannot rely on collision probability.

## 13. Longest Repeated Substring — Binary Search + Hashing

A classic advanced combination is:

```text
binary search substring length L
        ↓
rolling hashes for all windows of length L
        ↓
detect duplicate fingerprint
        ↓
feasible / infeasible
```

The binary-search predicate must be monotonic for this technique to apply.

This combines:

- binary search on answer;
- rolling hash;
- Set/Map membership.

## 14. Palindrome Hashing

Compute hashes for both:

```text
string
reverse(string)
```

Compatible substring hashes can then help identify palindrome candidates.

Again, hash equality is a fingerprint match. Exact verification may be required depending on correctness requirements.

## 15. Canonicalization and Encoding

The hash is only as meaningful as the representation it receives.

Decide:

- Unicode code points vs UTF-16 code units;
- case sensitivity;
- normalization form;
- whitespace rules;
- punctuation handling;
- locale-specific rules.

For application-level identity, canonicalize deliberately before hashing.

Do not silently treat visually similar Unicode strings as identical unless the domain explicitly defines that equivalence.

## 16. JavaScript Considerations

JavaScript `Number` uses IEEE-754 floating-point representation. Large integer arithmetic can lose exactness.

Therefore naive multiplication such as:

```js
hash * base
```

can become problematic when values exceed the exact integer range.

Possible approaches include:

- carefully chosen arithmetic that remains within safe bounds;
- `BigInt` modular arithmetic;
- two smaller arithmetic domains;
- machine-word implementations in lower-level environments.

`BigInt` is exact for integers but may have different performance characteristics and cannot be freely mixed with `Number`.

## 17. BigInt Rolling Hash Model

A conceptual JavaScript implementation can use:

```js
hash = (hash * BigInt(base) + BigInt(code)) % BigInt(mod);
```

This prioritizes arithmetic correctness over raw speed.

When benchmarking, compare realistic input sizes and account for BigInt overhead.

## 18. Collision Resistance Is Not Cryptographic Security

A rolling hash is an algorithmic fingerprint.

It should not automatically be used as a cryptographic integrity primitive.

If a system requires cryptographic collision resistance, use a cryptographic hash designed for that security requirement.

The choice depends on the threat model:

```text
algorithmic acceleration → rolling hash
security/integrity       → cryptographic hash
```

## 19. Brute Force → Rolling Hash

Suppose we need to find occurrences of a pattern in a text.

### Brute force

At each text position, compare up to `m` characters.

Potential cost:

```text
O((n - m + 1) · m)
```

### Rolling hash

1. Hash the pattern.
2. Hash the first text window.
3. Compare fingerprints.
4. Roll to the next window in `O(1)` update time.
5. Verify candidate matches when required.

Typical total behavior:

```text
O(n + m)
```

for hash computation and scanning, with verification costs depending on the number and length of candidate collisions/matches.

## 20. Correctness Invariant

For a fixed-size rolling window:

> At every iteration, the maintained hash equals the hash function applied to exactly the characters currently inside the window.

For hash-filtered exact matching:

> Every reported match has passed both the hash equality condition and the exact character-equality verification.

These invariants separate efficient candidate generation from final correctness.

## 21. Complexity

For text length `n` and pattern length `m`:

- pattern hash: `O(m)`;
- initial window hash: `O(m)` or `O(1)` with prefix preprocessing;
- each rolling update: typically `O(1)`;
- scan: `O(n)`;
- auxiliary state: typically `O(1)` for one pattern/window, or `O(n)` for storing many fingerprints.

For many substring queries, prefix hashing can provide near-constant-time hash extraction after `O(n)` preprocessing.

Always separate:

```text
hash arithmetic
substring verification
Map/Set lookup
key construction
output storage
```

## 22. Common Mistakes

1. Treating hash equality as guaranteed string equality.
2. Using an inconsistent prefix-hash formula.
3. Forgetting modular normalization.
4. Removing the outgoing character incorrectly during rolling.
5. Using unsafe JavaScript integer arithmetic.
6. Mixing `Number` and `BigInt`.
7. Choosing a poor base or modulus without understanding the consequences.
8. Ignoring adversarial collision inputs.
9. Forgetting Unicode representation semantics.
10. Using a non-cryptographic hash where security is required.
11. Forgetting to verify candidate matches when exact correctness is required.
12. Storing every hash when streaming state would suffice.

## 23. Edge Cases & Failure Modes

Test:

- empty string;
- pattern longer than text;
- pattern equal to text;
- repeated characters;
- all-identical strings;
- Unicode text;
- large inputs;
- many repeated windows;
- collision candidates;
- modulus/base boundary behavior;
- `BigInt` vs `Number` arithmetic;
- zero-length patterns according to an explicit contract.

## 24. Backend Engineering Applications

String fingerprints can support:

- exact duplicate-content detection;
- cache keys;
- request/body fingerprints;
- log/message deduplication;
- substring indexing;
- document comparison candidates;
- rolling content windows.

Do not confuse an algorithmic fingerprint with a secure content digest. For security-sensitive identity or integrity, use an appropriate cryptographic hash.

## 25. AI Engineering Applications

Rolling/string hashes can support:

- document/chunk duplicate detection;
- exact text candidate deduplication;
- n-gram indexing;
- sequence fingerprints;
- repeated-span detection;
- retrieval preprocessing;
- cache keys for deterministic text transformations.

For semantic equivalence, rolling hash is insufficient: semantically similar text may have completely different exact fingerprints.

## 26. Problem-Solving Framework

When you see a string matching problem:

```text
1. Is the comparison exact?
2. Are there many substring/window comparisons?
3. Is fixed-length hashing useful?
4. Can a prefix hash answer substring fingerprints?
5. Is rolling update useful?
6. What collision guarantee is required?
7. Should candidates be exactly verified?
8. What character encoding is being hashed?
9. Is Number arithmetic safe?
10. Is the threat model adversarial?
```

## 27. Implementation Lab

For each exercise:

```text
A. Implement a simple exact comparator first.
B. Define character encoding.
C. Define base and modulus/arithmetic model.
D. Derive prefix-hash recurrence.
E. Derive rolling update algebraically.
F. State the rolling invariant.
G. Implement.
H. Test against brute force.
I. Add collision verification where exact correctness is required.
J. Benchmark realistic inputs.
```

## 28. Interview Preparation

Be able to explain:

1. What a rolling hash is.
2. Why it can update a fixed window in `O(1)`.
3. How prefix hashes support substring comparison.
4. Why collisions occur.
5. How double hashing reduces collision risk.
6. Why hash equality is not automatically string equality.
7. Rolling hash vs KMP.
8. How to detect duplicate substrings.
9. How binary search combines with rolling hash.
10. Why JavaScript `Number` can be dangerous for large modular arithmetic.
11. When to use `BigInt`.
12. Why rolling hashes are not cryptographic hashes.

## 29. Revision Checklist

- [ ] I can derive polynomial rolling hash.
- [ ] I can build prefix hashes and powers.
- [ ] I can derive a substring-hash formula.
- [ ] I can derive a rolling-window update.
- [ ] I understand collision risk.
- [ ] I can explain exact verification.
- [ ] I understand double hashing.
- [ ] I can compare rolling hash with KMP.
- [ ] I can detect duplicate fixed-length substrings.
- [ ] I can combine rolling hash with binary search on answer.
- [ ] I understand JavaScript numeric-safety issues.
- [ ] I can distinguish algorithmic and cryptographic hashing.
- [ ] I can apply string hashing to backend and AI workloads.

## 30. Key Takeaways

1. **Rolling hash turns neighboring fixed-size string fingerprints into cheap incremental updates.**
2. **Prefix hashing enables efficient substring fingerprint extraction.**
3. **Hash equality is a candidate-equality signal unless collisions are explicitly handled.**
4. **Exact correctness can be preserved with candidate verification.**
5. **Double hashing and randomized parameters can reduce collision risk under suitable models.**
6. **JavaScript numeric representation must be considered for modular arithmetic.**
7. **Rolling hash is an algorithmic technique, not a substitute for cryptographic hashing.**
8. **The strongest solutions derive the hash recurrence, rolling invariant, collision strategy, and complexity before coding.**
