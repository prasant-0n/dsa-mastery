# 07.10 — Hashing Patterns & Problem Recognition

## 1. Concept Definition

Hashing becomes powerful in DSA when you recognize that a problem contains a repeated **membership, counting, lookup, grouping, or identity** operation.

The goal is not to memorize “use a Map.” The goal is to detect when storing information by key changes the computational model.

Typical transformation:

```text
Repeated search / comparison
        ↓
Identify reusable information
        ↓
Store it by a key
        ↓
Answer future queries with Map / Set lookup
```

## 2. Why It Exists

Many brute-force algorithms repeatedly ask the same kind of question:

- Have I seen this value?
- How many times have I seen it?
- Does a complement exist?
- Have I already processed this identifier?
- Which records belong to this category?
- Does another object have the same signature?

If each query scans `n` items, the total cost can become `O(n²)`. Hashing can often reduce the repeated search to expected `O(1)` per operation.

The central trade-off is:

> **Store information now so future decisions become cheap.**

## 3. Mental Model: Remember the Right State

A hash-based solution is usually a form of state compression.

Instead of retaining every previous item only as raw history, retain exactly the information required for future decisions.

Examples:

```text
Need membership       → Set
Need counts           → Map<value, count>
Need last position    → Map<value, index>
Need first position   → Map<value, index>
Need complement       → Map<value, position>
Need groups           → Map<key, collection>
Need identity         → Set<canonicalKey>
Need cached result    → Map<inputKey, result>
```

## 4. The Recognition Checklist

When reading a problem, ask these questions in order:

1. Is the input a sequence of values or records?
2. Is the same value/key likely to be queried repeatedly?
3. Is membership important?
4. Is frequency important?
5. Is a derived key available?
6. Can previous information help answer a future query?
7. Can I represent that information as a compact Map or Set?
8. Does the extra memory justify the time reduction?

If several answers are yes, hashing should be one of the first approaches you test.

## 5. Pattern 1 — Seen Set

### Problem signal

Words such as:

- duplicate;
- unique;
- already seen;
- repeated;
- distinct;
- visited;
- processed;
- membership.

### Model

```text
seen = Set()

for x:
    if seen.has(x):
        duplicate / previously processed
    else:
        seen.add(x)
```

### Complexity

Expected:

```text
Time:  O(n)
Space: O(u)
```

where `u` is the number of distinct values.

## 6. Pattern 2 — Frequency Map

### Problem signal

Look for:

- frequency;
- count occurrences;
- most common;
- exactly `k` times;
- anagram;
- inventory;
- character counts;
- histogram.

### Model

```text
count[x] = count[x] + 1
```

This creates a compact representation of multiplicity.

### Example

```text
[a, b, a, c, b, a]

→

a: 3
b: 2
c: 1
```

## 7. Pattern 3 — Complement Lookup

Classic example: two values must satisfy:

```text
x + y = target
```

For current `x`, the required value is:

```text
needed = target - x
```

Instead of searching the remaining array, query a Map/Set of previously seen values.

### Reasoning

```text
Brute force:
for each x
    search for y

Hashing:
for each x
    calculate y
    ask whether y exists
```

The problem changes from repeated search to constant-time expected lookup.

## 8. Pattern 4 — Last-Seen Index

Sometimes membership alone is insufficient.

You need to know **where** a value was last observed.

```text
Map<value, lastIndex>
```

This is especially useful for:

- longest distinct subarray/window;
- duplicate distance;
- nearest previous occurrence;
- jumping the left boundary of a sliding window.

The state is not merely:

```text
seen[value] = true
```

but:

```text
lastSeen[value] = i
```

## 9. Pattern 5 — First-Seen Index

The inverse problem stores the earliest position:

```text
Map<value, firstIndex>
```

Useful for:

- earliest occurrence;
- longest subarray with a property;
- prefix-sum indexing;
- reconstructing earliest matches.

Do not overwrite the first index unless the algorithm explicitly requires it.

## 10. Pattern 6 — Prefix State + Hashing

A powerful family combines a running prefix state with a Map.

General idea:

```text
prefix state at i
        ↓
store / query by state
        ↓
identify a previous compatible state
```

Classic applications include:

- subarray sum problems;
- equal-prefix relationships;
- zero-sum subarrays;
- parity-state problems;
- repeated prefix signatures.

The deeper pattern is:

> If two prefix states are equal or satisfy a known relationship, the segment between them has a useful property.

## 11. Pattern 7 — Group by Signature

When different objects should be considered equivalent under some transformation, derive a canonical signature.

Example:

```text
"eat" → "aet"
"tea" → "aet"
"ate" → "aet"
```

Then:

```text
signature → group
```

Applications:

- anagrams;
- normalized identifiers;
- duplicate documents;
- equivalent configuration objects;
- AI candidate grouping.

The hard part is often **designing the signature correctly**, not constructing the Map.

## 12. Pattern 8 — Frequency Signature

For anagrams or categorical equality, a sorted string is not the only option.

You can represent an object by its frequency vector:

```text
character → count
```

or a fixed-size encoded signature.

For an alphabet of fixed size `A`:

```text
signature construction = O(A)
```

rather than sorting each string when the alphabet model permits a bounded frequency representation.

## 13. Pattern 9 — Two-Collection Membership

Typical signals:

- common elements;
- intersection;
- overlap;
- subset;
- disjointness;
- values appearing in both collections.

Build a Set for one collection and scan the other:

```text
Set(A)
   ↓
scan B
   ↓
membership queries
```

Expected time is typically `O(n + m)` with `O(min(n,m))` or `O(n)` auxiliary space depending on which collection is indexed.

## 14. Pattern 10 — Frequency Difference / Multiset Comparison

A Set only answers:

```text
Does it exist?
```

A frequency Map answers:

```text
How many exist?
```

This distinction matters for:

- ransom-note style problems;
- inventory reconciliation;
- multiset equality;
- permutation checking;
- transaction reconciliation.

Example:

```text
A = [a, a, b]
B = [a, b, b]

Set(A) = Set(B)
```

but their multisets are different.

## 15. Pattern 11 — Deduplication by Identity

For records, define an identity function:

```text
record → canonical identity key
```

Then:

```text
Set(identityKey)
```

can enforce uniqueness.

Examples:

```text
user.id
order.id
event.id
email.toLowerCase()
contentHash
```

The critical engineering question is not “how do I use Set?” but:

> **What exactly makes two records the same?**

## 16. Pattern 12 — Indexing Records

If repeated searches use a field:

```text
records.find(r => r.id === id)
```

then repeated lookup is linear.

Build:

```text
Map<id, record>
```

once, then query by key.

This is algorithmic indexing and mirrors database index thinking.

## 17. Pattern 13 — Grouping / Bucketing

When many items share a derived category:

```text
Map<category, items[]>
```

Examples:

- users by country;
- logs by service;
- orders by status;
- documents by language;
- AI candidates by source.

The Map stores the bucket; the bucket stores the members.

## 18. Pattern 14 — Memoization

Hashing can store computed results:

```text
Map<inputState, result>
```

When the same state appears again, return the stored result instead of recomputing it.

This connects hashing directly to:

- recursion;
- dynamic programming;
- graph search;
- expensive backend computations;
- AI inference/candidate scoring caches.

Correct state identity is essential. An incomplete cache key can return an incorrect result.

## 19. Pattern 15 — Canonicalization Before Hashing

Equivalent data may have multiple representations.

```text
raw input
   ↓
canonicalization
   ↓
key
   ↓
Map / Set
```

Examples:

```text
Email → lowercase + domain policy
Phone → normalized country format
URL → canonical URL policy
Text → normalization rules
Object → deterministic serialization
```

Never invent normalization rules merely to make a problem easier. They must come from the problem's equivalence definition.

## 20. Pattern 16 — Sliding Window + Hashing

Hashing and sliding windows frequently work together.

State may contain:

```text
Set of current values
```

or:

```text
Map<value, lastIndex/count>
```

The window moves while the Map/Set maintains the window invariant.

Common problems:

- longest substring without repetition;
- at-most-`k` distinct values;
- minimum window constraints;
- frequency-constrained windows.

## 21. Pattern 17 — State Signature for Search

A complex state can sometimes be encoded as a canonical key:

```text
state → signature
```

Then a Set can detect revisits:

```text
if visited.has(signature): skip
```

This is useful in:

- BFS state-space search;
- puzzle solving;
- graph traversal with implicit states;
- AI planning;
- configuration exploration.

The signature must uniquely represent every distinction that affects future behavior.

## 22. Pattern 18 — Hashing for Caching

General model:

```text
request identity → cached result
```

For backend systems, define:

- cache key;
- value;
- TTL;
- invalidation;
- memory bound;
- concurrency behavior;
- serialization;
- consistency expectations.

An in-process Map is useful for local caching but does not automatically provide cross-instance consistency.

## 23. Pattern 19 — Backend Idempotency

A common production pattern is:

```text
idempotency key → request state/result
```

Possible states:

```text
ABSENT
PROCESSING
COMPLETED
FAILED / EXPIRED
```

The algorithmic problem becomes a state-transition problem combined with keyed lookup.

Correct production design additionally requires atomicity, expiration, persistence decisions, and concurrency semantics.

## 24. Pattern 20 — AI Candidate Deduplication

AI retrieval and ranking pipelines may generate repeated candidates from multiple sources.

A typical flow is:

```text
candidate
   ↓
normalize identity
   ↓
compute signature
   ↓
Set membership
   ↓
unique candidates
```

Possible identity choices include:

- document ID;
- chunk ID;
- normalized URL;
- content hash;
- model-specific candidate signature.

Exact identity and semantic similarity are different problems. A hash Set solves exact-key duplication, not arbitrary semantic equivalence.

## 25. Brute Force → Hashing Transformation

Use this template during problem solving:

### Step 1 — Write the brute force

Do not jump immediately to a Map.

### Step 2 — Identify the expensive repeated operation

Usually:

```text
search
count
compare
find previous occurrence
check membership
```

### Step 3 — Ask what information would make that operation cheap

Examples:

```text
membership → Set
count → frequency Map
position → index Map
relationship → grouped Map
result → memoization Map
```

### Step 4 — Define the state invariant

State exactly what the Map/Set means at every iteration.

### Step 5 — Derive complexity

Compare:

```text
brute force
vs
hash-based approach
```

### Step 6 — Check the trade-off

Extra memory, hashing cost, key construction, and worst-case behavior must be considered.

## 26. Pattern Recognition Table

| Problem signal | Likely pattern | Structure |
|---|---|---|
| duplicate | seen set | Set |
| frequency | counting | Map |
| complement | lookup | Map/Set |
| last occurrence | last-seen index | Map |
| first occurrence | first-seen index | Map |
| anagram | frequency/signature | Map |
| common values | membership intersection | Set |
| subset | membership validation | Set |
| grouping | buckets | Map → collection |
| repeated expensive state | memoization | Map |
| repeated record lookup | index | Map |
| exact deduplication | identity set | Set |
| distinct window | sliding window | Set/Map |
| prefix relationship | prefix state index | Map |
| visited state | state signature | Set |
| idempotency | keyed state | Map |
| candidate dedup | canonical signature | Set |

## 27. Choosing Set vs Map

Use a **Set** when the answer to the question is essentially:

```text
Does this key exist?
```

Use a **Map** when you need:

```text
key → information
```

Examples:

```text
duplicate detection      → Set
frequency                → Map
last index               → Map
visited states           → Set
cache                    → Map
record index             → Map
candidate identity       → Set
candidate score by ID    → Map
```

## 28. Correctness & Invariants

A strong hashing solution should be explainable through an invariant.

Examples:

### Seen Set

> Before processing index `i`, the Set contains exactly the distinct values from the processed prefix.

### Frequency Map

> Before processing index `i`, each key's count equals its occurrences in the processed prefix.

### Last-Seen Map

> Before processing index `i`, each key maps to its latest processed position.

### Grouping Map

> Every processed record appears in exactly the bucket corresponding to its derived key.

### Memoization

> Every stored result corresponds to a previously evaluated state under the exact cache-key definition.

## 29. Complexity Analysis

For `n` input elements and `u` distinct keys:

- one-pass Set/Map processing: expected `O(n)`;
- frequency storage: `O(u)` auxiliary space;
- grouping: `O(n + u)` plus output storage;
- two collections of sizes `n` and `m`: typically expected `O(n + m)`;
- string keys: include key-processing cost when significant.

Always distinguish:

```text
algorithmic work
hash computation
key construction
output space
auxiliary space
```

## 30. Common Mistakes

1. Using hashing without identifying what is being keyed.
2. Storing too much state.
3. Storing too little state and losing required information.
4. Using Set where counts are required.
5. Using Map where only membership is required.
6. Overwriting first occurrence when it must be preserved.
7. Failing to update last occurrence.
8. Building an incorrect canonical signature.
9. Ignoring duplicate-key policy in indexes.
10. Claiming guaranteed `O(1)` instead of expected `O(1)`.
11. Ignoring the cost of large keys.
12. Treating exact hashing as semantic similarity.
13. Using an in-memory Map as though it were durable/distributed storage.
14. Forgetting memory growth and eviction in long-running services.

## 31. Backend Engineering Applications

Hashing patterns map directly to production systems:

- request deduplication;
- idempotency keys;
- authorization indexes;
- cache keys;
- connection/session indexes;
- aggregation by tenant or endpoint;
- event processing deduplication;
- feature/configuration lookup;
- log correlation;
- import reconciliation.

The production questions are:

```text
What is the identity key?
What is the lifecycle?
Is the state durable?
Is it shared across instances?
What happens during concurrency?
How is memory bounded?
How is stale state removed?
```

## 32. AI Engineering Applications

Hashing patterns support:

- exact retrieval-result deduplication;
- candidate tracking;
- token statistics;
- vocabulary metadata;
- memoized deterministic transformations;
- feature-frequency statistics;
- document/chunk indexing;
- state-space search;
- batch grouping.

When exact identity is insufficient, later topics such as Bloom filters, Count-Min Sketch, locality-sensitive methods, and vector similarity become relevant.

## 33. Interview Preparation

Be able to answer:

1. When should you use a Set instead of a Map?
2. How do you recognize a frequency-map problem?
3. How does hashing turn Two Sum into expected `O(n)`?
4. When should you store first occurrence versus last occurrence?
5. How do prefix sums combine with hashing?
6. How do you group objects by a derived key?
7. How do you deduplicate records safely?
8. What makes a canonical signature correct?
9. What are the trade-offs of hashing?
10. Why is expected `O(1)` not unconditional?
11. How would you use hashing for backend idempotency?
12. How would you deduplicate AI retrieval candidates?

## 34. Implementation Lab

For each exercise, follow this workflow:

```text
1. Restate the problem.
2. Identify the repeated operation.
3. Write brute force.
4. Identify reusable information.
5. Choose Set or Map.
6. Define the key.
7. Define the invariant.
8. Implement.
9. Prove correctness informally.
10. Derive time and auxiliary space.
11. Test edge cases.
12. Explain the trade-off in an interview.
```

## 35. Revision Checklist

- [ ] I can recognize a Set pattern from problem wording.
- [ ] I can recognize a frequency-map pattern.
- [ ] I can derive complement lookup.
- [ ] I understand first-seen and last-seen maps.
- [ ] I can combine prefix state with hashing.
- [ ] I can group records by signatures.
- [ ] I can reason about canonicalization.
- [ ] I can combine hashing with sliding windows.
- [ ] I can build record indexes.
- [ ] I can explain memoization as keyed state storage.
- [ ] I can design exact backend deduplication.
- [ ] I can explain AI candidate deduplication.
- [ ] I can state hashing invariants.
- [ ] I can derive expected time and auxiliary space.

## 36. Key Takeaways

1. **Hashing is a problem-solving technique, not merely a data structure.**
2. **Recognize the repeated query and store exactly the information needed to answer it.**
3. **Set is for membership; Map is for key → information.**
4. **Frequency, complement, first/last occurrence, grouping, indexing, memoization, and deduplication are core patterns.**
5. **The key/signature definition is often the hardest and most important part.**
6. **Correctness comes from a precise invariant.**
7. **Performance claims must distinguish expected hashing behavior from worst-case behavior.**
8. **Backend and AI systems use the same patterns, but production adds lifecycle, concurrency, durability, memory, and observability concerns.**
