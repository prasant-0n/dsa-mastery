# 07.22 — Hash-Based Problem Synthesis

## 1. Purpose

This chapter turns hashing knowledge into a repeatable problem-solving system.

The objective is not to memorize isolated tricks. It is to recognize when a problem's state can be represented as:

```text
key → information
```

and then choose the smallest correct representation that supports the required operations.

## 2. Core Recognition Question

When reading a problem, ask:

> What information do I need to remember so that I never have to recompute it?

Common answers:

```text
seen values
frequency
last index
first index
value → index
key → group
prefix state → index
composite state → count
```

## 3. The Hashing Decision Tree

```text
Need exact membership?
 ├─ yes → Set
 └─ no

Need key → value mapping?
 └─ Map

Need frequency?
 └─ Map<key, count>

Need prefix-state lookup?
 └─ Map<prefixState, earliest/best information>

Need approximate membership?
 └─ Bloom filter

Need approximate frequency?
 └─ Count-Min Sketch

Need distributed placement?
 └─ consistent hashing / partition hashing
```

## 4. Pattern: Seen Set

Use a `Set` when only membership matters:

```text
seen = {}
for each x:
    if seen contains x:
        duplicate
    else:
        add x
```

Typical complexity:

```text
expected time → O(n)
space          → O(n)
```

## 5. Pattern: Frequency Map

Use a frequency map when multiplicity matters:

```text
count[x] += 1
```

Applications:

- duplicates;
- anagrams;
- majority/frequency problems;
- inventory counts;
- event aggregation.

## 6. Pattern: Value → Index

Store an index instead of only membership:

```text
index[value] = position
```

This enables complement and pair-sum problems in linear expected time.

The stored index may be:

- first occurrence;
- last occurrence;
- current occurrence;
- best occurrence according to the objective.

## 7. Pattern: First / Last Occurrence

The correct update policy depends on the problem.

For longest-distance problems, preserving the earliest occurrence can be useful.

For nearest/latest-state problems, the latest occurrence may be required.

Hashing is only the storage mechanism; the update invariant determines correctness.

## 8. Pattern: Prefix State Map

Many subarray problems can be transformed into state equality.

Example structure:

```text
prefix state at i
       ↓
map state → index/count
```

If two prefix states satisfy the problem's relationship, their difference corresponds to a valid subarray.

The important step is deriving the state—not blindly applying a Map.

## 9. Pattern: Prefix Sum + Map

For a target sum `K`:

```text
prefix[i] - prefix[j] = K
```

therefore:

```text
prefix[j] = prefix[i] - K
```

A map stores previously observed prefix sums.

This converts repeated search into expected constant-time lookup.

## 10. Pattern: Prefix XOR + Map

XOR has cancellation properties:

```text
x ^ x = 0
x ^ 0 = x
```

Prefix XOR can therefore be stored as a hash key for problems involving XOR subarrays or state transitions.

## 11. Pattern: Normalized State

Different representations can be mapped to one canonical key.

Examples:

```text
anagram → sorted/signature/frequency representation
case-insensitive text → normalized form
composite state → canonical tuple
```

Correctness depends on preserving exactly the equivalence relation required by the problem.

## 12. Pattern: Grouping

Map keys can represent groups:

```text
Map<groupKey, items[]>
```

Typical applications:

- group anagrams;
- group records by tenant;
- group logs by error signature;
- aggregate events by route.

## 13. Pattern: Inverse Mapping

If a forward mapping is:

```text
A → B
```

an inverse map can support:

```text
B → A
```

But inversion is valid only when the required relationship is one-to-one or the inverse stores multiple values.

## 14. Pattern: Complement Lookup

For a target relation:

```text
x + y = target
```

when `x` is known, derive:

```text
y = target - x
```

Store previously seen values in a map.

This pattern generalizes beyond addition whenever the required complement can be computed efficiently.

## 15. Pattern: Duplicate Detection

If the problem asks whether something appeared before:

```text
Set → membership
```

If it asks how many times:

```text
Map → frequency
```

If it asks where:

```text
Map → position
```

Choosing the minimal state prevents unnecessary complexity.

## 16. Pattern: Sliding Window + Hash State

A sliding window often combines:

```text
left/right pointers
+
frequency map/set
```

The window changes while the map tracks its current state.

Typical complexity becomes `O(n)` because each element enters and leaves the window a bounded number of times.

## 17. Pattern: Longest Distinct Window

Maintain frequencies or last positions:

```text
window = [left, right]
state = hash structure
```

When a duplicate violates the invariant, advance `left` until the window is valid again.

The key reasoning is the window invariant, not the Map itself.

## 18. Pattern: Anagram Detection

Two strings are anagrams when they have equivalent character multiplicities under the chosen normalization.

A frequency map provides a direct representation:

```text
character → count
```

For fixed alphabets, arrays can sometimes replace Maps for lower constant factors.

## 19. Pattern: Canonical Signature

When grouping equivalent objects, construct a canonical signature:

```text
object → signature → group
```

Examples:

- character-frequency signature;
- sorted-character signature;
- normalized tuple;
- serialized structural state.

The signature must avoid ambiguous encodings.

## 20. Pattern: State Compression

A complex state can sometimes be reduced to a compact hash key:

```text
large state
    ↓
relevant invariant
    ↓
hash key
```

This is common in dynamic programming, graph search, memoization, and constraint search.

The compression is valid only if equivalent keys truly represent interchangeable states.

## 21. Pattern: Memoization

Memoization stores:

```text
problem state → result
```

A Map can provide expected constant-time state lookup.

The critical design problem is defining the complete state key.

Omitting a result-affecting parameter creates incorrect cache reuse.

## 22. Pattern: Graph Traversal

A `Set` commonly tracks visited nodes:

```text
visited[node] = true
```

This prevents repeated processing in BFS/DFS when node identity is well-defined.

For composite graph states, the visited key may need to include multiple dimensions.

## 23. Pattern: Frequency-Constrained Construction

Problems such as constructing one string/multiset from another often reduce to:

```text
available[key] >= required[key]
```

A frequency map captures the resource inventory.

## 24. Pattern: Offline Query Indexing

For repeated queries, preprocess records into a map:

```text
records
   ↓
index
   ↓
queries
```

If preprocessing is `O(n)` and each query is expected `O(1)`, `q` queries can approach:

```text
O(n + q)
```

instead of repeatedly scanning all records.

## 25. Pattern: Deduplication

For exact record deduplication:

```text
identity → first/selected record
```

The identity function must be defined before implementation.

Possible identities include:

- database ID;
- normalized business key;
- content fingerprint.

## 26. Pattern: Idempotency

Backend requests can be keyed by an idempotency key:

```text
idempotencyKey → request/result state
```

The map may be in-memory for local coordination, but durable correctness generally requires an authoritative shared store and atomic uniqueness semantics.

## 27. Pattern: Cache

A cache is conceptually:

```text
cacheKey → value + metadata
```

The key must capture every input that affects the cached result under the cache contract.

Hashing the key can reduce key size, but a digest collision policy must be considered when exact correctness matters.

## 28. Pattern: Distributed Routing

Hashing can route a key to a partition:

```text
key → hash → partition
```

For changing node membership, consistent hashing can reduce remapping relative to simple modulo schemes, but rebalancing and hot-key behavior still require explicit design.

## 29. Pattern: Probabilistic Membership

When exact membership storage is too expensive:

```text
Bloom filter
```

The reasoning changes:

```text
false positive → allowed
false negative → not allowed in the standard model
```

Always identify which errors are acceptable.

## 30. Pattern: Approximate Frequency

When exact counters are too large:

```text
Count-Min Sketch
```

Use it when approximate frequency is sufficient and the error budget is understood.

It does not store the complete key universe.

## 31. Choosing Set vs Map vs Array

Ask what operation is dominant:

```text
indexed position → Array
membership        → Set
key/value         → Map
small fixed domain → Array may be simpler/faster
```

Do not use hashing automatically when direct indexing is possible and the key domain is compact.

## 32. JavaScript-Specific Engineering

Prefer `Map` and `Set` when their semantics match the problem.

Important distinctions:

```text
Map → arbitrary key types
Set → unique values
Object → string/symbol property model
```

Objects have prototype/inheritance semantics that can make them unsuitable as a generic hash-map replacement without careful handling.

## 33. Equality and Key Semantics

Before hashing, define equality:

```text
What makes two keys the same?
```

Possible answers:

- strict value identity;
- normalized text;
- composite business identity;
- object ID;
- content identity.

Incorrect equality produces incorrect hash state regardless of implementation quality.

## 34. Complexity Reasoning

Typical expected complexity:

```text
Set membership     → O(1)
Map lookup         → O(1)
frequency build    → O(n)
query processing   → O(q)
```

But include:

- key hashing cost;
- key length;
- memory allocation;
- collision behavior;
- worst-case behavior;
- preprocessing cost.

## 35. Brute Force → Hash Optimization

A recurring optimization is:

```text
Brute force:
for each item
    scan previous/all items
```

becoming:

```text
Optimized:
for each item
    hash lookup previous state
```

The conceptual transformation is:

```text
repeated search → indexed state
```

## 36. Correctness Framework

For every hash-based solution define:

1. **Key:** what is stored?
2. **Invariant:** what does each entry mean?
3. **Update:** when does it change?
4. **Lookup:** what does a hit mean?
5. **Collision/equality:** how is identity preserved?
6. **Initialization:** what state exists before processing?
7. **Termination:** when is the result complete?

## 37. Common Failure Modes

### Wrong key
The stored state does not capture the needed relationship.

### Wrong update timing
The current element is inserted before a lookup when the problem requires previous elements only.

### Wrong occurrence policy
Earliest vs latest index changes the answer.

### Ambiguous signature
Different states serialize to the same logical key.

### Overusing hashing
A direct array or sorting approach may be simpler when the domain permits it.

### Ignoring memory
An `O(n)` Map can be unacceptable when memory constraints are tight.

## 38. Edge Cases

Always test:

- empty input;
- one element;
- all duplicates;
- all unique values;
- negative numbers;
- zero;
- repeated prefixes;
- Unicode text;
- large keys;
- duplicate records;
- multiple valid answers;
- absent lookup keys;
- extreme frequency skew.

## 39. Backend Problem Synthesis

When a backend problem mentions:

```text
idempotency
uniqueness
deduplication
lookup
cache
aggregation
rate limiting
session state
```

ask whether the core state is naturally:

```text
key → state
```

If yes, a hash-based structure may be part of the solution.

Then determine whether the state must be:

```text
local
shared
durable
approximate
```

## 40. AI Problem Synthesis

When an AI problem mentions:

```text
candidate deduplication
memoization
token frequency
dataset deduplication
feature hashing
retrieval popularity
cache
sharding
```

identify the exact state representation first.

Then select:

```text
Set / Map
Bloom filter
Count-Min Sketch
content digest
consistent hashing
feature hashing
```

according to the required guarantees.

## 41. Problem-Solving Workflow

Use this sequence:

```text
1. Parse the requirement.
2. Identify repeated work.
3. Define equality/identity.
4. Identify state that must be remembered.
5. Choose exact vs approximate representation.
6. Derive the brute-force baseline.
7. Replace repeated search with indexed state.
8. Define the invariant.
9. Implement.
10. Prove correctness.
11. Analyze time + auxiliary space.
12. Test edge cases.
13. Evaluate production constraints.
```

## 42. Interview Explanation Template

A concise explanation should follow:

> “The brute-force solution repeatedly searches previously processed state. I can avoid that repeated search by storing the relevant state in a hash structure. The key represents ____, and the value represents ____. During each iteration I perform an expected O(1) lookup/update. The invariant is ____. Therefore the total expected complexity is O(n) with O(n) auxiliary space.”

Then discuss worst-case behavior and alternatives.

## 43. Advanced Synthesis

Harder problems often combine multiple structures:

```text
Map + sliding window
Map + prefix sum
Set + two pointers
Map + heap
Map + graph traversal
Bloom filter + exact Set/DB
CMS + candidate tracker
consistent hashing + cache
```

The goal is to identify which structure owns which responsibility.

## 44. Production Decision Matrix

| Requirement | Candidate |
|---|---|
| Exact membership | Set |
| Exact key/value | Map |
| Frequency | Map |
| Compact fixed-domain counter | Array |
| Approximate membership | Bloom filter |
| Approximate frequency | Count-Min Sketch |
| Exact content identity | Cryptographic digest + authoritative verification as required |
| Distributed placement | Hash partitioning / consistent hashing |
| Semantic similarity | Vector/similarity structure, not exact hashing |

## 45. Mastery Problems

Before leaving Phase 07, solve problems involving:

1. duplicate detection;
2. frequency counting;
3. two-sum/complement lookup;
4. longest distinct window;
5. anagram grouping;
6. prefix-sum subarrays;
7. prefix-XOR states;
8. record indexing;
9. exact deduplication;
10. idempotency state;
11. cache-key design;
12. partition routing;
13. Bloom filtering;
14. Count-Min Sketch;
15. heavy-hitter estimation;
16. distributed hash routing;
17. feature hashing;
18. dataset fingerprinting;
19. hot-key mitigation;
20. production hash-system design.

## 46. Revision Checklist

- [ ] I can recognize when repeated search should become hash lookup.
- [ ] I can choose Set vs Map.
- [ ] I can design frequency maps.
- [ ] I can choose earliest vs latest occurrence storage.
- [ ] I can derive prefix-state hashing solutions.
- [ ] I can combine hashing with sliding windows.
- [ ] I can build canonical signatures.
- [ ] I can reason about equality and collisions.
- [ ] I can distinguish exact and probabilistic structures.
- [ ] I can apply hashing to backend systems.
- [ ] I can apply hashing to AI systems.
- [ ] I can analyze expected and worst-case complexity.
- [ ] I can explain correctness using an invariant.
- [ ] I can defend a hash-based solution against alternatives.

## 47. Key Takeaways

1. **Hashing is fundamentally about turning repeated search into indexed state lookup.**
2. **The key and invariant matter more than the container itself.**
3. **Set is for exact membership; Map is for key-to-information relationships.**
4. **Frequency maps, complement lookup, occurrence tracking, prefix-state maps, and grouping are core reusable patterns.**
5. **A correct solution begins by defining equality and the exact information that must be remembered.**
6. **Hashing is not always the right choice; arrays, sorting, trees, or specialized structures may better match the domain.**
7. **Probabilistic structures require explicit error semantics.**
8. **Backend and AI systems often combine exact and approximate hash structures rather than relying on one mechanism.**
9. **Production reasoning includes memory, key-processing cost, persistence, concurrency, distribution, security, and observability.**
10. **Expert problem solving means deriving the state representation first and selecting the data structure second.**
