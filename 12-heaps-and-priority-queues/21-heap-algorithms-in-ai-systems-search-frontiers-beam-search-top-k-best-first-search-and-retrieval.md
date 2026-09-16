# 12.21 — Heap Algorithms in AI Systems: Search Frontiers, Beam Search, Top-K, Best-First Search & Retrieval

## Objective

Heaps are central to many AI search and ranking algorithms because they maintain a frontier ordered by a score, cost, probability, deadline, or other key. This chapter connects priority queues to best-first search, A*, beam search, top-K selection, retrieval fusion, planning, and production AI systems.

## 1. Priority Queues as AI Search Frontiers

A search algorithm maintains candidate states that have not yet been expanded.

A priority queue lets the algorithm repeatedly select the candidate with the most useful current priority.

```text
frontier → priority queue → best candidate → expand → new candidates
```

## 2. Cost, Score, and Ordering

AI systems may use either minimization or maximization:

- path cost: smaller is better;
- probability: larger is better;
- similarity score: larger is better;
- heuristic estimate: depends on the algorithm.

The comparator must match the mathematical objective.

## 3. Best-First Search

Best-first search selects the currently preferred frontier node according to an evaluation function.

The evaluation function determines what the heap represents.

## 4. Greedy Best-First Search

Greedy best-first search commonly prioritizes a heuristic estimate `h(n)`.

```text
f(n) = h(n)
```

It can reach promising states quickly but does not generally guarantee an optimal path.

## 5. Uniform-Cost Search

Uniform-cost search prioritizes accumulated path cost:

```text
f(n) = g(n)
```

With nonnegative edge costs and appropriate termination conditions, it can recover a least-cost path.

## 6. A* Search

A* commonly uses:

```text
f(n) = g(n) + h(n)
```

The heap stores states ordered by this evaluation value.

## 7. Admissible Heuristic

A heuristic is admissible when it does not overestimate the remaining optimal cost under the problem's cost model.

This property is important to A* optimality reasoning.

## 8. Consistent Heuristic

A consistent heuristic satisfies a triangle-like condition. Consistency can simplify reasoning about node reopening and priority behavior.

## 9. Duplicate Detection

Search may generate the same logical state through multiple paths. A `Set` or `Map` can prevent unnecessary expansion.

The heap and visited structure solve different problems:

```text
heap → which candidate next?
map/set → have we seen or recorded this state?
```

## 10. State Canonicalization

Two representations may describe the same logical state. Canonicalization makes duplicate detection reliable.

Poor canonicalization can cause redundant search or incorrect pruning.

## 11. Stale Heap Entries

Priority updates can be implemented by pushing a new entry rather than modifying an existing one. The old entry becomes stale.

A version or best-known-cost map can identify stale entries when they reach the root.

## 12. Lazy Priority Updates

Lazy insertion can simplify heap mutation:

```text
new better record → push
old record → remain
root → discard if stale
```

The trade-off is additional memory and heap operations.

## 13. Beam Search

Beam search limits the number of active candidates to a beam width `B`.

At each stage, retain only the strongest candidates according to the model score.

## 14. Beam Width Trade-Off

Larger beams generally retain more alternatives and consume more computation and memory. Smaller beams reduce resource usage but can prune useful candidates earlier.

The appropriate width is a system parameter, not an invariant of the heap itself.

## 15. Top-K Selection

Many AI workloads need only the best K items rather than a fully sorted list.

A heap can maintain a bounded candidate set.

For top-K largest values, a min-heap of size K is often useful: the root represents the weakest retained candidate.

## 16. Streaming Top-K

When items arrive continuously, maintain a bounded heap instead of storing every item.

For N items and heap size K, a standard bounded-heap strategy uses approximately `O(N log K)` time and `O(K)` heap space, ignoring input storage.

## 17. Retrieval Ranking

A retrieval service may receive candidates from multiple indexes, shards, or models. A heap can merge ranked streams while maintaining only the next candidates required for output.

## 18. K-Way Retrieval Merge

If each source produces candidates in sorted order, maintain one current candidate per source in a heap.

```text
source heads → heap → best candidate → advance source
```

This avoids materializing all candidates.

## 19. Score Direction

Retrieval systems must define whether larger or smaller scores are preferred. Mixing cosine similarity, distance, negative log probability, and cost conventions is a common source of ranking bugs.

## 20. Score Calibration

Scores from different retrieval systems may not be directly comparable. A heap can order values, but it cannot make incompatible scoring functions semantically comparable.

Normalize or calibrate scores before global ranking when required.

## 21. Deduplication During Fusion

Multiple retrieval sources may return the same document. Combine heap ordering with identity-based deduplication.

A document ID map can track already emitted candidates.

## 22. Diversity Constraints

Pure score ordering can over-select nearly identical results. Retrieval systems may impose diversity or quota constraints.

In such systems, the next globally highest-scoring candidate may not always be the next candidate accepted.

## 23. Reranking

A common pipeline is:

```text
retrieve → top-K candidate heap → expensive reranker → final ranking
```

Use a cheap first-stage score to bound the expensive second-stage computation.

## 24. Approximate Search

Approximate nearest-neighbor systems may use priority queues internally to explore promising regions or candidates.

The heap is part of the search strategy, while approximation guarantees depend on the surrounding index and pruning rules.

## 25. Search Pruning

Pruning removes candidates that cannot or will not be explored further. Correct pruning requires a justified bound or explicitly accepted approximation.

## 26. Beam Candidate Storage

Beam entries should normally contain compact ranking information plus an identifier or state reference rather than unnecessarily large payloads.

This can reduce memory movement during heap operations.

## 27. Language Model Decoding

Beam search and related decoding algorithms maintain candidate sequences ranked by model-derived scores.

The candidate score may include:

- cumulative log probability;
- length normalization;
- penalties;
- constraints.

## 28. Length Normalization

Sequence scores can favor short or long outputs depending on the scoring formulation. If normalization is used, the comparator must consistently apply the chosen definition.

## 29. Constrained Decoding

A candidate may be eligible only if it satisfies grammar, schema, token, or business constraints. Priority ordering and constraint validation are separate concerns.

## 30. Planning

AI planning systems can maintain partial plans in a priority queue ordered by estimated total cost, utility, or expected value.

The heap supports candidate selection; the planning model defines state transitions and validity.

## 31. Monte Carlo Tree Search

MCTS itself is not simply a heap algorithm, but priority structures can assist candidate management in variants involving selection, progressive widening, or bounded candidate sets.

Do not reduce an entire search algorithm to its supporting data structure.

## 32. Priority and Exploration

Pure exploitation selects the highest current score. Exploration strategies may intentionally select less certain candidates.

A priority function can incorporate exploration terms, but the resulting semantics must be explicitly defined.

## 33. Anytime Search

An anytime algorithm improves its best known answer as time permits. A heap can maintain promising frontier states while the system tracks the best complete solution separately.

## 34. Time-Bounded AI Search

For latency-sensitive inference, the frontier may be bounded by:

- maximum nodes;
- maximum heap memory;
- maximum expansions;
- deadline.

The algorithm should define what happens when the budget is exhausted.

## 35. Memory-Bounded Search

Large frontiers can dominate memory. Techniques include beam width, top-K pruning, duplicate detection, compact state representations, and stale-entry cleanup.

## 36. Externalized Frontiers

When the frontier exceeds process memory, candidates may need to be partitioned or persisted. This changes the cost model from in-memory heap operations to an external-memory or distributed workflow.

## 37. Parallel Search

Multiple workers can expand candidates concurrently, but a globally ordered frontier introduces synchronization costs.

Practical systems may use local queues, sharding, or approximate priority selection.

## 38. Distributed Retrieval

A coordinator can merge top candidates from distributed shards using a heap of shard heads.

The communication protocol and shard result quality determine end-to-end ranking behavior.

## 39. Early Termination

A retrieval or search system can stop when it has sufficient evidence that additional candidates cannot improve the final result.

Such termination requires a valid bound on unseen candidates.

## 40. Heap + Hash Map Pattern

AI search commonly combines:

```text
heap → frontier priority
map  → best-known state/cost
set  → expanded states
```

This combination is often more important than the heap alone.

## 41. Correctness Invariants

Depending on the algorithm, verify:

- heap order;
- state identity correctness;
- best-known-cost consistency;
- stale-entry handling;
- duplicate detection;
- admissibility assumptions;
- beam-size bounds;
- top-K membership.

## 42. Complexity

For a binary heap with N frontier entries:

```text
insert       O(log N)
extract      O(log N)
peek         O(1)
```

For bounded top-K with K entries, each retained insertion is typically `O(log K)`.

The overall AI algorithm also depends on state expansion, scoring, model inference, and memory costs.

## 43. Expensive Scoring

If calculating a candidate score requires model inference, feature extraction, or embedding computation, heap comparison itself should remain cheap. Store computed scores where they are stable.

## 44. Batch Scoring

AI systems often score candidates in batches for accelerator efficiency. Candidate generation and scoring may therefore be decoupled from heap ordering.

## 45. GPU Scheduling

Inference systems can use priority structures to select requests for GPU execution. Scheduling must account for batching compatibility, memory limits, deadlines, and fairness rather than priority alone.

## 46. Token-Budget Scheduling

For language-model workloads, estimated token cost can become part of scheduling. A request with high priority but extreme resource demand may need admission controls.

## 47. Fair AI Serving

A globally highest-priority request can monopolize scarce accelerator capacity. Multi-tenant AI systems may combine priority with quotas, aging, or weighted scheduling.

## 48. Observability

Measure:

- frontier size;
- expansions;
- duplicate rate;
- stale-entry rate;
- pruning rate;
- score computation time;
- heap time;
- model inference time;
- memory;
- deadline misses;
- top-K recall/quality.

## 49. Testing AI Heap Algorithms

Use deterministic synthetic states and a reference implementation. Test ties, duplicates, score direction, stale entries, empty frontiers, beam limits, and adversarial score distributions.

## 50. Differential Testing

Compare heap-based selection against a simple sorted reference on identical candidate sets. This catches comparator and tie-breaking bugs.

## 51. Benchmarking

Separate:

```text
heap overhead
vs
scoring/model cost
vs
state expansion
vs
I/O/network
```

Otherwise heap optimization may target a component that is not the actual bottleneck.

## 52. Common Mistakes

1. Mixing score direction or cost conventions.
2. Treating stale heap entries as valid.
3. Forgetting duplicate-state detection.
4. Claiming A* optimality without checking heuristic assumptions.
5. Treating beam search as equivalent to exact best-first search.
6. Comparing incompatible retrieval scores directly.
7. Letting heap memory grow without bounds.
8. Assuming top-K requires full sorting.
9. Optimizing heap operations when model inference dominates runtime.

## 53. Interview Framework

```text
Define objective
→ define candidate state
→ define priority function
→ choose min/max heap
→ define duplicate handling
→ define stale-entry policy
→ define pruning/budget
→ prove selection invariant
→ derive complexity
→ benchmark heap vs scoring cost
```

## Revision Checklist

- [ ] I can explain how heaps implement AI search frontiers.
- [ ] I understand best-first, uniform-cost, and A* priority functions.
- [ ] I can reason about stale entries and duplicate detection.
- [ ] I understand beam-search trade-offs.
- [ ] I can implement bounded streaming top-K reasoning.
- [ ] I can merge ranked retrieval sources with a heap.
- [ ] I understand score-direction and score-calibration problems.
- [ ] I can reason about memory-bounded and distributed search.
- [ ] I can separate heap cost from model/scoring cost.

## Key Takeaways

1. **In AI systems, a heap often represents the frontier of candidates rather than merely a generic priority queue.**
2. **Best-first search, A*, beam search, top-K selection, and retrieval fusion all use priority ordering in different ways.**
3. **The heap must be combined with duplicate detection, state tracking, scoring, and pruning logic to form a correct search system.**
4. **AI workloads make comparator/scoring cost and memory bounds especially important.**
5. **The data structure does not define the AI algorithm's guarantees; those come from the objective, scoring model, pruning rules, and correctness assumptions.**
