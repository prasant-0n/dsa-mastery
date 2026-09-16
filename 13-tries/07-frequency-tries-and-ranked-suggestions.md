# 13.07 — Frequency Tries & Ranked Suggestions

## Objective

Extend a trie from simple prefix matching into a ranking-aware suggestion index. Learn how frequency and aggregate metadata change update costs, query strategies, correctness requirements, and memory usage.

## 1. From Matching to Ranking

A normal trie answers:

```text
Which keys match this prefix?
```

A frequency trie additionally asks:

```text
Which matching keys should appear first?
```

## 2. Terminal Frequency

A terminal node can store a frequency or weight associated with the complete key.

```text
key → frequency
```

This supports popularity-based ranking after candidate generation.

## 3. Aggregate Prefix Metadata

A prefix node can store information about descendants, such as:

- maximum frequency;
- total frequency;
- top-K candidates;
- count of active keys.

Aggregate metadata can accelerate queries but increases update work.

## 4. Frequency Updates

When a key's frequency changes, its terminal metadata changes first. Any maintained ancestor aggregates may also need updating.

For key length `L`, a path update can touch `O(L)` nodes.

## 5. Query Strategy A — Enumerate and Sort

Collect all matching keys and sort by frequency.

If `R` candidates are returned from the prefix subtree:

```text
O(R log R)
```

ranking work may be required.

## 6. Query Strategy B — Bounded Top-K

If only `K` suggestions are needed, maintain a bounded heap:

```text
O(R log K)
```

This avoids fully sorting all candidates.

## 7. Query Strategy C — Cached Top-K

Store the best K descendants at each selected prefix node.

Then a query can approach direct metadata lookup, subject to cache validation and update semantics.

## 8. Write Amplification

Caching top-K at many prefixes means one key update may affect many ancestors.

The benefit is faster reads; the cost is increased writes and memory.

## 9. Selective Caching

Do not necessarily cache every prefix. Candidate policies include:

```text
hot prefixes only
fixed depth levels
high-traffic prefixes
memory-budgeted prefixes
```

## 10. Frequency vs Recency

Frequency and recency are different signals.

A useful score may combine:

```text
score = α × frequency + β × recency
```

The scoring contract must define normalization and tie-breaking.

## 11. Weighted Suggestions

Frequency can be generalized to arbitrary numeric weights. This makes the trie useful for popularity, quality, business priority, or relevance scores.

## 12. Stable Tie-Breaking

Equal scores require deterministic behavior when reproducibility matters. Possible secondary keys include:

- lexicographic order;
- creation timestamp;
- stable insertion sequence;
- unique ID.

## 13. Score Direction

Define whether larger or smaller values are better. Mixing min-heap and max-heap conventions is a common source of ranking bugs.

## 14. Top-K Correctness

For a result set of size K, every omitted candidate must have a score no better than the worst retained candidate under the complete comparator.

## 15. Aggregate Maximum Bound

If each subtree stores a valid maximum score, a search can prune a subtree when:

```text
subtreeMax ≤ currentTopKThreshold
```

assuming the comparator and tie-breaking rules are compatible.

## 16. Bound Maintenance

A subtree maximum must be updated whenever a descendant's score changes or is removed. Stale bounds can make pruning incorrect.

## 17. Lazy Bounds

Some systems permit stale optimization metadata and fall back to verification before returning results. This can simplify writes but complicates query correctness.

## 18. Popularity Decay

Real-world frequencies can become stale. Time-decayed scoring can model changing popularity:

```text
score(t) = baseScore × decay(t)
```

The decay model should be explicit.

## 19. Periodic Rebuild

Instead of updating every cached ranking on every event, rebuild ranking metadata periodically. This trades freshness for simpler and cheaper writes.

## 20. Event-Driven Updates

A backend can process usage events asynchronously:

```text
request event
→ aggregation
→ frequency update
→ index refresh
```

This separates user-facing latency from ranking maintenance.

## 21. Eventual Consistency

If frequency updates are asynchronous, autocomplete results may temporarily reflect older popularity information. This must be an intentional consistency contract.

## 22. Multi-Tenant Frequencies

Frequency can be global or tenant-specific:

```text
global frequency
vs
per-tenant frequency
```

Per-tenant metadata increases memory and update cost.

## 23. Personalized Frequencies

A user's history may be another ranking signal. Keep personalized state outside the structural trie when embedding it would cause unbounded per-prefix memory.

## 24. Filtering Before Ranking

A safe query pipeline is usually:

```text
candidate generation
→ eligibility filtering
→ scoring
→ top-K
```

Ranking unauthorized or ineligible candidates can waste work, but filtering must not violate correctness or leak protected information.

## 25. Ranking Before Filtering

In some systems, precomputed ranking metadata includes candidates that later become unavailable. The final response must still enforce eligibility.

## 26. Frequency Counter Semantics

Define whether repeated observations:

- increment frequency;
- replace frequency;
- add weighted increments;
- expire after a window.

## 27. Sliding-Window Popularity

For time-windowed popularity, maintain events or aggregated buckets. A plain integer frequency is insufficient when old activity must expire exactly.

## 28. Heavy Hitters

If the dictionary is enormous, storing exact ranking metadata everywhere may be expensive. Approximate heavy-hitter algorithms can identify popular candidates before they are inserted into cached top-K structures.

## 29. Memory Budgeting

A ranked trie must account for:

```text
base nodes
+ child structures
+ terminal metadata
+ aggregate scores
+ top-K IDs
+ timestamps/versioning
```

## 30. Node-Level Top-K

Storing K candidate IDs at every node can create large memory consumption. Calculate the number of cached nodes before adopting this strategy.

## 31. Prefix Cache Selection

Useful selection signals include query rate, candidate count, update rate, and memory cost.

## 32. Hot-Key Protection

Popular prefixes can become hotspots. Cache warming, local replicas, request coalescing, and rate limits can reduce repeated expensive traversal.

## 33. Cache Invalidation

When a key is deleted, its cached appearances must either be removed or detected as stale. Lazy validation can reduce update work but shifts cost to reads.

## 34. Versioned Metadata

Attach a version to ranking metadata when updates are asynchronous. Readers can detect stale versions and decide whether to refresh, retry, or serve boundedly stale results.

## 35. Ranking Comparator Contract

A comparator must define a total deterministic ordering for production use. Document how ties, missing scores, NaN, null values, and invalid metadata are handled.

## 36. Correctness Invariants

Maintain:

1. terminal frequency belongs to the correct key;
2. aggregate scores cover exactly the intended descendants;
3. cached Top-K entries are eligible under their cache scope;
4. score bounds are valid when used for pruning;
5. tie-breaking is deterministic.

## 37. Differential Testing

Use a reference implementation:

```text
enumerate all matching keys
→ calculate authoritative scores
→ sort with trusted comparator
→ take K
```

Compare optimized results against this baseline.

## 38. Property Testing

Useful properties include:

- increasing one key's score cannot make its own rank worse under a fixed comparator;
- returned results always match the prefix;
- K never exceeds the requested limit;
- cached and uncached queries agree under the same snapshot.

## 39. Benchmarking

Measure separately:

- query latency;
- update latency;
- candidates visited;
- candidates scored;
- cache hit rate;
- stale-result rate;
- memory per cached prefix.

## 40. Backend Architecture

A production design can use:

```text
usage events
   ↓
frequency aggregator
   ↓
rank metadata updater
   ↓
trie / prefix index
   ↓
autocomplete API
```

The indexing path can be asynchronous if eventual consistency is acceptable.

## 41. AI Applications

Frequency-ranked tries can support:

- lexical candidate generation;
- entity completion;
- constrained decoding;
- vocabulary filtering;
- candidate priors before model reranking.

## 42. AI Ranking Boundary

The trie should answer symbolic eligibility and candidate retrieval. A model can then provide contextual relevance. Keeping these responsibilities separate makes correctness and observability easier.

## 43. Interview Problem Pattern

When a problem says:

```text
prefix + most frequent
prefix + top K
popular completions
```

think:

```text
Trie + ranking strategy
```

Then decide whether on-demand Top-K, cached metadata, or branch-and-bound is justified.

## 44. Production Design Exercise

Design a service with:

- 10 million dictionary keys;
- frequent usage events;
- top 10 suggestions;
- hot-prefix traffic;
- bounded memory;
- eventually consistent popularity.

Compare on-demand heap ranking, selective prefix caching, and periodic rebuilds.

## 45. Complexity Summary

For prefix length `P`, explored candidates `R`, results `K`, and key length `L`:

```text
prefix navigation     O(P)
candidate traversal   O(R)
Top-K ranking         O(R log K)
full sorting          O(R log R)
path frequency update O(L)
```

Add scoring cost and metadata-maintenance cost separately.

## Revision Checklist

- [ ] I understand terminal frequency metadata.
- [ ] I can implement Top-K ranking over trie results.
- [ ] I can compare full sorting with a bounded heap.
- [ ] I understand cached Top-K metadata.
- [ ] I can reason about write amplification.
- [ ] I understand score bounds and pruning correctness.
- [ ] I can design frequency decay and asynchronous updates.
- [ ] I can handle tenant and personalization boundaries.
- [ ] I can test optimized ranking against a reference implementation.
- [ ] I can design a memory-bounded production ranking trie.

## Key Takeaways

1. **A frequency trie combines symbolic prefix structure with ranking metadata.**
2. **Top-K selection and full sorting have different costs and should be chosen from the query contract.**
3. **Cached ranking makes reads faster by moving work into updates and memory.**
4. **Score bounds are powerful only when their correctness is maintained.**
5. **Production ranking systems must explicitly handle freshness, consistency, memory budgets, authorization, and deterministic tie-breaking.**
