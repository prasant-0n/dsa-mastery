# 13.06 — Prefix Search & Autocomplete

## Objective

Turn trie prefix navigation into a practical search primitive for autocomplete, suggestions, routing, and candidate generation. Learn the difference between locating a prefix and efficiently ranking its descendants.

## 1. Prefix Search

A prefix query asks for keys beginning with a sequence `P`.

```text
prefix = "dev"
→ developer
→ device
→ devops
```

The trie makes the prefix an explicit path.

## 2. Two-Stage Algorithm

A typical query is:

```text
1. traverse root → prefix node
2. explore the prefix subtree
```

The first stage costs approximately `O(P)` with constant-time child selection. The second depends on the number of candidates explored and returned.

## 3. Autocomplete

Autocomplete is prefix search plus a result policy.

The policy may define:

- maximum results;
- ordering;
- ranking score;
- filters;
- personalization;
- freshness;
- permissions.

## 4. Prefix Existence vs Suggestions

These are different workloads:

```text
hasPrefix("dev")
→ boolean

suggest("dev", 10)
→ ranked candidates
```

Do not analyze both as the same operation.

## 5. Naive Autocomplete

The simplest implementation enumerates every descendant and then sorts or selects the best results.

If `R` candidates are visited and `K` are returned, ranking can dominate the traversal cost.

## 6. Top-K Without Full Sorting

When only `K` results are required, a bounded heap can avoid sorting all candidates.

Typical cost:

```text
O(R log K)
```

instead of `O(R log R)` full sorting, assuming candidate scoring is already available.

## 7. Ranking Dimensions

Possible ranking signals include:

```text
frequency
recency
business priority
quality score
personalization
lexical distance
context relevance
```

The trie provides candidate generation; ranking is a separate layer.

## 8. Frequency-Based Autocomplete

A terminal node can store frequency. Descendants can then be ranked by frequency after enumeration.

## 9. Cached Top-K

A prefix node can cache its best suggestions.

```text
prefix node
└── topK = [candidate IDs...]
```

This can make repeated queries fast but makes updates more expensive.

## 10. Metadata Propagation

When a key's score changes, cached metadata may need to be updated along its ancestor path.

For key length `L`, a path-based update can touch `O(L)` prefix states.

## 11. Update Trade-Off

Read-heavy systems often favor cached prefix metadata. Write-heavy systems may prefer on-demand traversal to avoid maintaining many caches.

## 12. Bounded Result Sets

Autocomplete APIs should impose limits:

```text
limit ≤ configured maximum
```

This prevents accidental large responses.

## 13. Lazy Enumeration

A generator can stream candidates and stop after enough results have been collected.

This is useful when ranking can be performed incrementally.

## 14. Pagination

If users can continue browsing suggestions, a deterministic cursor may be needed. Cursor design must specify ordering and mutation consistency.

## 15. Lexicographic Autocomplete

If requirements call for alphabetical suggestions, traverse children in sorted order.

This does not imply relevance ranking.

## 16. Ranked Autocomplete

For relevance ranking, traversal order is insufficient. Use one of:

- cached ranking metadata;
- bounded heap;
- specialized top-K index;
- external ranking service.

## 17. Weighted Trie

Store aggregate subtree information such as maximum score. During search, branches whose upper bound cannot beat the current top-K threshold may be pruned.

This converts the problem into branch-and-bound search.

## 18. Correctness of Score Bounds

Pruning is safe only if the stored bound is guaranteed to be an upper bound for every candidate in that subtree.

An incorrect bound can silently remove valid top results.

## 19. Personalized Suggestions

A global trie can generate candidates while a ranking layer incorporates user-specific features.

Avoid storing unbounded user-specific state in every prefix node.

## 20. Multi-Tenant Autocomplete

Tenant-specific dictionaries may require:

```text
tenant → trie
```

or shared structures with tenant-aware metadata.

Isolation and memory limits become architectural concerns.

## 21. Permissions

Suggestions must respect authorization. Candidate generation must not reveal protected names merely because they exist in the trie.

## 22. Normalization

Autocomplete usually requires a canonical matching policy:

```text
case folding
Unicode normalization
accent policy
whitespace
punctuation
```

The query and indexed key must use compatible normalization.

## 23. Fuzzy Search Boundary

Prefix search requires an exact prefix. Typo tolerance is a different problem and is addressed later with approximate/fuzzy trie techniques.

## 24. Unicode

User-visible autocomplete should define whether matching is based on code points, normalized strings, or grapheme-aware semantics.

## 25. Empty Prefix

An empty prefix means the entire dictionary is eligible. This can be extremely expensive and should normally be restricted or handled by a separate popular-items index.

## 26. No-Match Queries

If the prefix path is absent, return an empty result quickly after the first missing transition.

## 27. Hot Prefixes

Popular prefixes can create disproportionate load. Caching, rate limiting, and bounded work are important for production services.

## 28. Cold Prefixes

Cold prefixes may not justify persistent ranking metadata. On-demand traversal can be more memory-efficient.

## 29. Backend Architecture

A practical service can separate:

```text
API layer
  ↓
normalization
  ↓
prefix index
  ↓
candidate generation
  ↓
ranking
  ↓
authorization/filtering
  ↓
response limit
```

## 30. Caching

Cache complete query results only when cache keys, invalidation, tenant scope, authorization, and freshness semantics are well defined.

## 31. Cache Invalidation

Updating one key may invalidate every cached prefix containing that key's path. This can create a write amplification problem.

## 32. AI Candidate Generation

A trie can constrain candidate strings or generate lexical candidates before an AI model reranks them.

This is especially useful when the candidate vocabulary is known and symbolic prefix constraints matter.

## 33. Constrained Generation

For constrained decoding, the trie can represent allowed continuations. At each step, valid next symbols come from the current trie node.

## 34. Beam Search Integration

A trie can constrain a beam search state while a heap or priority queue ranks beam candidates. The structures solve different parts of the problem.

## 35. Complexity Model

Let:

```text
P = prefix length
R = nodes/candidates explored
K = results returned
L = average candidate length
```

Then a simple ranked autocomplete can be modeled as:

```text
prefix navigation: O(P)
traversal:          O(R)
ranking top-K:      O(R log K)
output:             O(KL)
```

Add scoring cost separately when scoring is not constant-time.

## 36. Memory Model

Base trie memory is determined by stored prefixes. Cached top-K metadata adds additional memory approximately related to the number of cached prefix entries and `K`.

## 37. Correctness Invariants

A prefix suggestion system should guarantee:

1. every returned key begins with the normalized query prefix;
2. every returned key is eligible under the filtering contract;
3. ranking order satisfies the comparator;
4. top-K pruning uses valid bounds;
5. tenant and authorization boundaries are respected.

## 38. Testing

Test:

- exact prefix;
- missing prefix;
- empty prefix;
- prefix equal to a key;
- key being a prefix of another;
- duplicate keys;
- normalization;
- Unicode;
- ties in ranking;
- `K = 0`;
- `K` larger than candidate count;
- authorization filtering.

## 39. Differential Testing

Compare optimized autocomplete against a reference implementation that enumerates all eligible candidates and performs a trusted ranking operation.

This is especially valuable when implementing cached metadata or pruning.

## 40. Benchmarking

Measure:

```text
p50/p95/p99 latency
nodes visited
candidates scored
cache hit rate
memory
allocation rate
```

Test both hot and cold prefixes.

## 41. Interview Pattern

When asked to implement autocomplete:

```text
1. identify trie suitability
2. locate prefix node
3. define result contract
4. enumerate candidates
5. decide ranking strategy
6. bound work with K/limits
7. derive complexity
8. handle normalization and edge cases
```

## 42. Production Design Exercise

Design an autocomplete endpoint supporting:

```text
GET /autocomplete?q=dev&limit=10
```

Requirements:

- multi-tenant isolation;
- authorization;
- frequency ranking;
- bounded latency;
- hot-prefix caching;
- deterministic results.

Define the index, update path, query path, cache policy, and failure behavior.

## 43. AI Design Exercise

Design a constrained candidate generator where the trie stores allowed strings and an AI reranker assigns contextual scores.

Specify where the trie ends and model scoring begins.

## Revision Checklist

- [ ] I can implement prefix lookup.
- [ ] I can build naive autocomplete.
- [ ] I can derive its output-sensitive complexity.
- [ ] I can use a bounded heap for Top-K.
- [ ] I understand cached prefix metadata.
- [ ] I can reason about score-bound pruning.
- [ ] I understand normalization and Unicode issues.
- [ ] I can design tenant/authorization boundaries.
- [ ] I can integrate a trie with AI candidate generation.
- [ ] I can design and benchmark a production autocomplete service.

## Key Takeaways

1. **Autocomplete is prefix search plus candidate and ranking policy.**
2. **Trie traversal generates candidates; heaps, caches, or ranking models determine relevance.**
3. **Top-K queries should avoid unnecessary full sorting when the workload permits.**
4. **Cached metadata trades update complexity and memory for faster reads.**
5. **Production autocomplete requires bounded work, normalization, authorization, tenant isolation, and explicit consistency semantics.**
