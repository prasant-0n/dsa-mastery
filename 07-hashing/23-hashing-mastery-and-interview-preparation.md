# 07.23 — Hashing Mastery & Interview Preparation

## 1. Mastery Objective

Hashing mastery means being able to recognize, derive, implement, prove, analyze, test, and defend hash-based solutions.

The target progression is:

```text
recognize pattern
→ define state
→ define key
→ choose structure
→ derive algorithm
→ prove invariant
→ analyze complexity
→ test edge cases
→ discuss trade-offs
→ engineer production version
```

## 2. Core Mental Model

Hashing turns a key into a location or compact state identifier.

For problem solving:

```text
problem state
     ↓
key
     ↓
Map / Set / specialized hash structure
     ↓
expected O(1) access
```

The data structure is not the solution by itself. The state representation is the solution.

## 3. Recognition Signals

Look for phrases such as:

- seen before;
- duplicate;
- frequency;
- count occurrences;
- first/last occurrence;
- pair/complement;
- group equivalent items;
- repeated state;
- lookup by ID;
- deduplicate;
- cache;
- idempotency;
- approximate membership;
- approximate frequency.

These signals suggest hash-based state may be useful.

## 4. Set vs Map

Use a `Set` when the only question is membership:

```text
Have I seen x?
```

Use a `Map` when associated information is needed:

```text
x → count
x → index
x → object
x → state
```

Use neither automatically if a direct array or another structure better matches the domain.

## 5. Frequency Map

Canonical pattern:

```text
for x in input:
    count[x] += 1
```

Interview questions commonly extend this into:

- most frequent item;
- duplicates;
- anagrams;
- frequency comparison;
- top-K frequencies;
- resource construction.

## 6. Seen-State Pattern

Canonical pattern:

```text
for x in input:
    if seen.has(x):
        duplicate
    seen.add(x)
```

The invariant is:

> Before processing the current element, `seen` contains exactly the required previously processed values.

## 7. Complement Pattern

Derive the required partner rather than scanning for it.

For two-sum:

```text
x + y = target
→ y = target - x
```

Store prior values in a Map.

This is a model example of converting repeated search into indexed state.

## 8. Prefix-State Pattern

Many subarray problems become:

```text
currentState - previousState = requiredRelation
```

Then store prior states in a Map.

Common state families:

- prefix sum;
- prefix XOR;
- transformed balance;
- normalized counters;
- composite state.

## 9. Occurrence Policy

Always ask what value the Map should preserve:

```text
earliest
latest
count
all positions
best position
```

This single decision frequently determines whether a solution is correct.

## 10. Sliding Window + Hashing

A sliding window often requires exact state about the current window:

```text
left/right pointers
+
frequency Map or Set
```

The key invariant is usually:

> The current window satisfies the required constraint.

Each pointer moves monotonically, producing linear total pointer movement.

## 11. Canonicalization

Equivalent inputs need equivalent keys.

For example:

```text
"Listen"
"silent"
```

can become equivalent under a chosen case-insensitive anagram normalization.

The canonicalization rule must be explicit.

## 12. Composite Keys

Never rely on ambiguous concatenation.

Bad conceptual encoding:

```text
[a, bc] → "abc"
[ab, c] → "abc"
```

Use length-delimited, typed, structured, or otherwise unambiguous encoding.

## 13. Memoization

Memoization state is:

```text
complete problem state → result
```

The hardest part is often identifying the complete state key.

If a result-affecting parameter is omitted, memoization can return a result for the wrong state.

## 14. Graph State

Visited sets prevent repeated processing:

```text
visited.add(nodeId)
```

For stateful searches, node ID may be insufficient.

The key might need:

```text
(nodeId, remainingBudget, mask, phase, ...)
```

State compression is valid only when equivalent states have equivalent future behavior.

## 15. Exact vs Approximate Hashing

Know the guarantee before choosing the structure.

| Requirement | Structure |
|---|---|
| Exact membership | Set |
| Exact mapping | Map |
| Exact frequency | Map |
| Approximate membership | Bloom filter |
| Approximate frequency | Count-Min Sketch |
| Exact content fingerprint | Cryptographic digest |
| Distributed placement | Hash partitioning / consistent hashing |
| Semantic similarity | Vector/similarity structure |

## 16. Complexity Interview Rules

For a hash-based solution, say:

```text
Expected lookup/update: O(1)
```

Then state the total complexity.

Example:

```text
n inputs
→ O(n) expected time
→ O(n) auxiliary space
```

But also mention:

- key hashing cost;
- key length;
- worst-case collision behavior;
- memory overhead.

## 17. Amortized Resizing

Hash tables often resize geometrically.

Individual resize operations can cost `O(n)`, but insertion over a long sequence can have expected/amortized constant behavior under standard assumptions.

Do not claim every individual insertion is literally constant-time.

## 18. Collision Reasoning

Collisions are unavoidable in finite hash spaces.

Correctness requires:

```text
same bucket
    ≠
same key
```

A robust implementation verifies equality according to its key semantics.

## 19. JavaScript Interview Knowledge

Know the practical distinction between:

```text
Map
Set
Object
Array
```

Understand:

- Map key semantics;
- Set membership semantics;
- iteration behavior;
- object property coercion/prototype concerns;
- reference identity for object keys;
- serialization when building string-based composite keys.

## 20. Common Interview Problem Families

### Family A — Membership

- Contains duplicate
- Intersection
- Union
- Missing/repeated values

### Family B — Frequency

- Character counts
- Anagrams
- Majority/frequency
- Resource construction

### Family C — Complement

- Two Sum
- Pair relationships
- Difference matching

### Family D — Prefix State

- Subarray sum
- Zero-sum subarray
- Equal-balance subarray
- XOR subarray

### Family E — Window State

- Longest distinct substring/window
- At-most-K distinct
- Minimum covering window
- Anagram windows

### Family F — Grouping

- Group anagrams
- Group records
- Inverted indexes

## 21. Interview Problem: Two Sum

Expected reasoning:

```text
For each x:
    complement = target - x
    check prior Map
    store x
```

Complexity:

```text
Expected time → O(n)
Space → O(n)
```

Discuss duplicate values and whether the same element may be reused.

## 22. Interview Problem: First Unique Element

Two-pass pattern:

```text
Pass 1 → frequency
Pass 2 → first key with count 1
```

This separates counting from selection and keeps the invariant simple.

## 23. Interview Problem: Longest Distinct Window

Maintain:

```text
left
right
last occurrence Map
```

When a duplicate appears, move `left` beyond the previous occurrence while preserving the window invariant.

## 24. Interview Problem: Group Anagrams

Derive:

```text
word → canonical frequency signature
```

Then:

```text
signature → group
```

Alternative signatures can have different complexity and memory characteristics.

## 25. Interview Problem: Subarray Sum = K

Use:

```text
prefix sum
Map<prefixSum, frequency>
```

At current prefix `P`, seek:

```text
P - K
```

The frequency, rather than merely existence, is needed when counting all valid subarrays.

## 26. Correctness Proof Template

For a hash solution:

### Invariant
State exactly what the Map/Set contains after each iteration.

### Initialization
Show the invariant holds before processing the first element.

### Maintenance
Show lookup/update preserves the invariant.

### Termination
Show the invariant implies the returned result is correct.

This is stronger than saying “the code works.”

## 27. Brute Force → Optimized Explanation

Use:

```text
Brute force:
repeatedly scan prior/all elements.
```

Then:

```text
Observation:
the same information is searched repeatedly.
```

Then:

```text
Optimization:
store that information in a hash structure.
```

Finally:

```text
Complexity:
replace O(n²) repeated search with expected O(n) indexed processing.
```

## 28. When Hashing Is Not Best

Consider alternatives when:

- key domain is small and dense;
- sorted output/range queries are required;
- memory is constrained;
- deterministic worst-case guarantees matter;
- ordering is central;
- a specialized structure provides stronger guarantees.

Expertise includes knowing when **not** to hash.

## 29. Backend Interview Applications

Be prepared to design:

- idempotency-key stores;
- request deduplication;
- cache indexes;
- session lookup;
- authorization maps;
- rate-limit state;
- database partition routing;
- distributed cache routing;
- content deduplication.

For each, identify whether state is local, shared, durable, or approximate.

## 30. AI Interview Applications

Be prepared to discuss:

- inference cache keys;
- dataset fingerprints;
- retrieval candidate deduplication;
- token frequencies;
- feature hashing;
- Bloom filters;
- Count-Min Sketch;
- dataset sharding;
- experiment bucketing;
- model artifact identity.

## 31. Production Interview Questions

### Q1. Why can hash lookup be O(1)?
Because a hash maps the key into a bucket/index and expected constant-time work is required under appropriate distribution assumptions.

### Q2. What causes worst-case degradation?
Collision concentration, poor hashing, adversarial input, or pathological load can increase work.

### Q3. Why not always use a hash table?
Because ordering, range queries, memory constraints, dense integer domains, or stronger worst-case requirements can favor other structures.

### Q4. Why is a hash collision not a correctness failure?
A collision only means multiple keys share a hash location; exact equality still determines identity.

### Q5. Why use a Set instead of Map?
When only membership is required and no associated value needs to be stored.

## 32. Advanced Production Questions

Be able to reason about:

- hash flooding;
- incremental rehashing;
- concurrent hash tables;
- cache locality;
- memory overhead;
- consistent hashing;
- weighted nodes;
- hot keys;
- Bloom filters;
- Count-Min Sketch;
- hash-version migration;
- canonicalization;
- crash recovery for persistent hash indexes.

## 33. Testing Strategy

Every implementation should have:

```text
example tests
+ edge tests
+ randomized tests
+ differential tests
+ invariant tests
```

For a custom hash table, compare against a trusted `Map` where semantics match.

## 34. Benchmarking Strategy

Benchmark with:

- uniform keys;
- sequential keys;
- highly skewed keys;
- duplicate-heavy workloads;
- long keys;
- large values;
- high load factors;
- adversarial inputs.

Measure latency, throughput, memory, collision/probe behavior, and resize effects.

## 35. Revision Drill

For each problem, answer these questions before coding:

1. What is the brute-force solution?
2. What work repeats?
3. What must be remembered?
4. What is the key?
5. What is the value?
6. What is the invariant?
7. When is the state updated?
8. Is the structure exact or approximate?
9. What are expected and worst-case costs?
10. What edge cases can break the invariant?

## 36. 60-Second Interview Template

Use this structure:

```text
1. Clarify the required relationship.
2. State brute-force complexity.
3. Identify repeated search.
4. Introduce Map/Set state.
5. Define key and value.
6. State invariant.
7. Walk through one example.
8. Give complexity.
9. Mention edge cases.
10. Mention alternative if relevant.
```

## 37. 5-Minute Deep-Dive Template

For a senior-style discussion:

```text
problem model
→ state representation
→ key semantics
→ collision/equality
→ correctness invariant
→ algorithm
→ complexity
→ memory
→ concurrency
→ distribution
→ failure modes
→ observability
→ alternatives
```

## 38. Mastery Checklist

- [ ] I recognize Set/Map patterns quickly.
- [ ] I can derive frequency-map solutions.
- [ ] I can derive complement lookup.
- [ ] I can derive prefix-state hashing.
- [ ] I can combine hashing with sliding windows.
- [ ] I can construct canonical signatures.
- [ ] I can choose occurrence policy correctly.
- [ ] I can prove correctness with invariants.
- [ ] I can state expected and worst-case complexity.
- [ ] I understand collisions.
- [ ] I understand resizing and amortized cost.
- [ ] I know JavaScript Map/Set semantics.
- [ ] I can explain when hashing is not appropriate.
- [ ] I can design backend hash-based systems.
- [ ] I can design AI hash-based systems.
- [ ] I can discuss probabilistic hashing.
- [ ] I can reason about distributed hashing.
- [ ] I can test and benchmark custom implementations.

## 39. Key Takeaways

1. **Hashing mastery begins with state representation, not syntax.**
2. **Set answers membership; Map stores relationships.**
3. **Frequency, complement, prefix-state, occurrence, grouping, and window-state patterns are the core interview toolkit.**
4. **Every solution needs a precise key, value meaning, and invariant.**
5. **Expected O(1) is an assumption-backed performance model, not a universal guarantee.**
6. **Correctness survives collisions because equality is distinct from bucket selection.**
7. **Arrays, sorting, trees, and specialized structures remain valid alternatives.**
8. **Production hashing adds memory, concurrency, distribution, security, persistence, migration, and observability concerns.**
9. **AI systems use hashing for identity, caching, deduplication, feature processing, routing, and approximate analytics—not semantic similarity itself.**
10. **The final interview skill is being able to derive and defend the solution rather than recall a memorized pattern.**
