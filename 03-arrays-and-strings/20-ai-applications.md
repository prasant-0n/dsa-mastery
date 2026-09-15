# 03.20 — AI Applications of Arrays & Strings

## Purpose

This chapter maps Phase 03 array/string reasoning to practical AI and ML engineering workloads.

The objective is **algorithmic understanding**, not AI hype. Arrays and strings are the underlying representations for tokens, embeddings, scores, candidates, documents, labels, and evaluation data.

Core pipeline:

```text
raw data
→ normalization/tokenization
→ numerical representation
→ sequence/array algorithm
→ candidate processing
→ ranking/aggregation
→ output
```

---

# 1. Why Arrays & Strings Matter in AI

AI systems constantly manipulate:

- token sequences;
- token IDs;
- embedding vectors;
- batches;
- candidate lists;
- attention masks;
- scores;
- labels;
- document chunks;
- evaluation strings;
- feature arrays.

The model may be complex, but surrounding engineering frequently depends on ordinary algorithmic operations.

---

# 2. Text → Tokens → Integer Arrays

A language pipeline commonly transforms:

```text
text
→ normalized text
→ tokens
→ token IDs
→ integer array
```

Once represented as integers, familiar DSA patterns become available:

- frequency counting;
- sliding windows;
- hashing;
- prefix state;
- two pointers;
- sorting/selection;
- sequence matching.

The tokenization contract determines what a “symbol” means.

---

# 3. Token Windows

Many AI workloads process fixed-size or bounded token windows.

Given:

```text
tokens[0 ... N-1]
```

and context size `W`, windows can be generated using:

```text
[start, start + W)
```

For overlapping chunks with stride `S`:

```text
0
S
2S
3S
...
```

The number of windows is approximately:

```text
O((N - W) / S)
```

plus boundary handling.

---

# 4. Sliding Window for Context Management

A sliding window can maintain a bounded active token context.

State may include:

```text
left token index
right token index
current token count
metadata
```

This is useful for chunking, streaming inference, and bounded-context processing.

The important invariant is:

> The active sequence always satisfies the context-size constraint.

---

# 5. Token Frequency Analysis

Frequency maps can measure:

- token frequency;
- vocabulary usage;
- rare-token rates;
- repeated phrases;
- dataset statistics.

For a fixed vocabulary of size `V`, an integer frequency array can provide compact storage:

```text
freq[tokenId]++
```

Space becomes `O(V)` rather than depending on object overhead for every observed token.

---

# 6. Vocabulary and Sparse Frequency State

A huge vocabulary may make a dense array expensive when only a small fraction of tokens occur in a batch.

Then alternatives include:

```text
Map<tokenId, count>
```

or sparse representations.

Choice depends on:

- vocabulary size;
- batch size;
- frequency density;
- reuse;
- memory budget.

This is the same representation-selection principle used throughout DSA.

---

# 7. Dataset Deduplication

Training and evaluation datasets can contain duplicate or near-duplicate examples.

A basic exact-dedup pipeline:

```text
text
→ canonical normalization
→ exact representation/hash
→ Set/Map
```

For each item, storage and comparison costs matter.

Hash equality should be followed by exact verification when correctness requires collision-free equality.

---

# 8. Normalization for AI Data

Possible preprocessing includes:

```text
Unicode normalization
case policy
whitespace normalization
punctuation policy
canonical formatting
```

But aggressive normalization can destroy information.

For example, casing may matter in code, identifiers, names, or specialized datasets.

Therefore:

> Normalize according to the downstream task, not according to a generic “clean text” rule.

---

# 9. Exact Duplicate vs Semantic Duplicate

These are fundamentally different:

### Exact duplicate

The representations are identical under a defined normalization contract.

### Semantic duplicate

Different texts express substantially similar meaning.

Arrays/strings can solve exact deduplication efficiently.

Semantic deduplication generally requires embeddings or another semantic representation.

Do not substitute string equality for semantic similarity.

---

# 10. Embeddings as Arrays

An embedding is commonly represented as:

```text
[v1, v2, v3, ..., vd]
```

where `d` is dimensionality.

Operations include:

- dot product;
- cosine similarity;
- Euclidean distance;
- normalization;
- Top-K selection.

A naive comparison of one query against `N` vectors of dimension `D` is approximately:

```text
O(ND)
```

for dense exact scoring.

---

# 11. Vector Normalization

For cosine similarity:

```text
cos(a,b) = dot(a,b) / (||a|| ||b||)
```

If vectors are normalized in advance, similarity can often be represented by the dot product.

This is a preprocessing trade-off:

```text
build cost + memory
→ cheaper repeated queries
```

Exactly the same principle appears in prefix sums and indexing.

---

# 12. Exact Vector Search

Given query vector `q` and `N` vectors:

```text
for each vector:
    compute score(q, vector)
    maintain candidate result
```

If only Top-K is required, maintaining a size-`K` heap can avoid fully sorting all scores.

Typical dense computation remains approximately `O(ND)` plus `O(N log K)` selection overhead.

---

# 13. Top-K in Retrieval

Retrieval pipelines frequently need only a small number of candidates:

```text
millions of candidates
→ Top-100
→ reranker
→ Top-10
```

This is an algorithmic pipeline, not merely an ML operation.

Choosing Top-K selection instead of full sorting can reduce unnecessary work.

---

# 14. Merge Ranked Candidate Lists

Multiple retrieval systems may each produce sorted candidates:

```text
lexical search
vector search
metadata search
```

Their ranked outputs can be merged using two pointers for two sources or a heap for many sources.

This is the same ordered-merge pattern used for backend feeds.

---

# 15. Reciprocal Rank / Score Aggregation

Suppose multiple rankers produce candidate lists.

A combined system may:

```text
candidate ID
→ collect scores/ranks
→ aggregate
→ select Top-K
```

A `Map` provides candidate-keyed aggregation.

The final selection can use sorting or a heap depending on `K` and `N`.

---

# 16. RAG Candidate Pipeline

A simplified retrieval-augmented generation pipeline can be viewed as:

```text
query
 ↓
normalize/tokenize
 ↓
retrieve candidates
 ↓
merge/filter/deduplicate
 ↓
score
 ↓
Top-K
 ↓
context assembly
```

Each stage has its own complexity and memory behavior.

The final latency is not just model inference time.

---

# 17. Chunking Documents

Documents are often split into chunks based on:

- token count;
- character count;
- semantic boundaries;
- overlap/stride;
- metadata constraints.

Array/string reasoning helps manage:

```text
window boundaries
prefix positions
overlap
output count
memory
```

Chunking should be evaluated as a sequence-processing algorithm, not just a preprocessing script.

---

# 18. Prefix/Suffix Reasoning in Text Pipelines

Prefix/suffix operations appear in:

- document boundaries;
- prompt templates;
- token-budget accounting;
- truncation;
- log parsing;
- file/path handling.

For repeated token-budget calculations, prefix sums can provide constant-time range accounting after preprocessing.

---

# 19. Token Budgeting

Suppose multiple prompt sections have token counts:

```text
system
history
retrieved context
user message
output reservation
```

A simple sum determines whether the request fits within a budget.

For repeated range queries over a static sequence, prefix sums can accelerate calculations.

The important concept is to treat token counts as measurable numerical resources.

---

# 20. Attention Masks as Arrays

Attention masks and related sequence metadata are array-like structures.

Algorithmic concerns include:

- dimensions;
- indexing;
- padding positions;
- valid/invalid tokens;
- batch alignment;
- memory layout.

A one-indexing mistake can corrupt an entire batch while still producing syntactically valid numerical data.

This is why invariants matter in ML engineering.

---

# 21. Padding and Sequence Batching

Variable-length sequences may be batched by padding to a common length.

Suppose batch size is `B` and padded sequence length is `L`.

The representation can require:

```text
O(BL)
```

memory even when the real token count is much smaller.

Bucketing similar sequence lengths can reduce wasted padding.

This is an algorithmic and systems-level optimization.

---

# 22. Sorting by Sequence Length

Before batching, sort or bucket examples by length.

Potential benefit:

```text
less padding
→ fewer processed tokens
→ lower compute/memory
```

But sorting itself has a cost and can affect randomness/distribution.

Production pipelines must balance efficiency with training semantics.

---

# 23. Batch Top-K and Selection

Inference systems often process scores in arrays:

```text
scores[0 ... N-1]
```

For each query:

```text
Top-K selection
```

can use a heap or selection algorithm.

For batched queries, complexity should be expressed with all dimensions:

```text
Q = queries
N = candidates
D = vector dimension
K = requested results
```

Avoid collapsing everything into a misleading single `N`.

---

# 24. Approximate Nearest Neighbor Context

Exact vector search is approximately:

```text
O(ND)
```

per query for dense vectors.

ANN systems reduce search work by indexing the vector space and exploring only a subset of candidates.

The trade-off is typically:

```text
lower latency
↔
additional index memory/build cost
↔
possible recall loss
```

The DSA lesson is that a different representation changes the search space.

---

# 25. Candidate Generation vs Reranking

A common architecture separates:

```text
cheap broad retrieval
→ expensive precise scoring
```

This is algorithmic cost modeling.

If the expensive reranker sees `K` candidates instead of `N` documents, its cost can drop dramatically.

The system intentionally spends more computation only on promising candidates.

---

# 26. Beam Search Preview

Beam search keeps only the best `B` partial candidates at each step.

Conceptually:

```text
expand candidates
→ score
→ Top-B
→ continue
```

This is a bounded approximation to exhaustive search.

Arrays, heaps, and sorting are involved at every beam step.

The beam width is an explicit quality/compute trade-off.

---

# 27. Sequence Matching

Token sequences can use exact string/array matching techniques:

- two pointers;
- prefix-function/KMP;
- Z-algorithm;
- rolling hash.

Potential applications include:

- template detection;
- repeated phrase discovery;
- structured prompt validation;
- evaluation pattern matching.

Choose algorithms according to the token representation and workload.

---

# 28. Longest Common Subsequence Context

Sequence alignment problems appear in:

- text comparison;
- evaluation;
- edit analysis;
- diff generation.

LCS is usually dynamic programming rather than a simple array pattern, but the sequence representation is the foundation.

The key lesson is to distinguish:

```text
substring → contiguous
subsequence → order preserved, gaps allowed
```

---

# 29. Dataset Evaluation

Evaluation often compares arrays of predictions and labels.

Common operations:

```text
zip predictions with labels
count matches
aggregate by class
Top-K accuracy
confusion statistics
filter subsets
```

A mismatch in array alignment can invalidate metrics.

Invariant:

> Prediction `i` corresponds to label `i` under the same dataset ordering.

---

# 30. Streaming Inference

For continuous requests:

```text
request stream
→ batch/window
→ inference
→ result
```

A batching algorithm must balance:

- batch size;
- wait time;
- throughput;
- memory;
- tail latency.

This is a streaming-window problem with operational constraints.

---

# 31. Memory-Aware AI Pipelines

Large arrays create memory pressure.

Potential techniques:

- streaming;
- chunking;
- batching;
- bounded queues;
- typed arrays;
- in-place transformations;
- avoiding unnecessary copies.

Peak live memory is often more important than total theoretical storage.

---

# 32. Typed Arrays

Numerical AI workloads frequently benefit from compact numeric storage:

```js
Float32Array
Int32Array
Uint32Array
```

Compared with generic JavaScript arrays, typed arrays provide a more explicit numeric representation and can reduce memory overhead for large dense numeric data.

The choice depends on required precision and downstream APIs.

---

# 33. Embedding Quantization Preview

Reducing representation precision can reduce memory and improve bandwidth.

Conceptually:

```text
Float32
→ lower-precision representation
```

This is another representation trade-off:

```text
memory/bandwidth
↔ numerical precision
↔ retrieval quality
```

Quantization is an AI-specific example of changing representation to change system cost.

---

# 34. Hashing in AI Data Systems

Hashes can support:

- exact duplicate detection;
- cache keys;
- content-addressed storage;
- document identity;
- sharding hints;
- memoization.

A hash is a representation, not automatically a proof of equality.

When correctness is critical, verify candidates after hash matches.

---

# 35. Cache Keys and Canonical Prompts

If semantically identical request forms are intentionally canonicalized:

```text
request
→ canonical representation
→ hash/key
→ cache lookup
```

This can improve cache hit rates.

But canonicalization must preserve the semantics relevant to the model operation.

Never remove information merely to create more cache hits.

---

# 36. AI Retrieval Complexity Model

For a simplified dense retrieval system:

```text
N = indexed vectors
D = vector dimensions
K = returned candidates
R = reranking cost per candidate
```

Exact retrieval may cost approximately:

```text
O(ND + N log K)
```

while reranking adds approximately:

```text
O(KR)
```

The architecture therefore tries to keep `K << N`.

ANN changes the candidate-search term by exploring only part of the index.

---

# 37. AI Algorithm Review Checklist

Ask:

1. What exactly is the sequence representation?
2. Are elements characters, tokens, IDs, or vectors?
3. What are `N`, `D`, `K`, `B`, and `Q`?
4. Is exact or approximate computation acceptable?
5. Can preprocessing be amortized?
6. Can candidates be pruned before expensive scoring?
7. Is Top-K required or full ranking?
8. Can work be streamed or batched?
9. What is peak memory?
10. How many copies/allocations occur?
11. Does normalization alter task semantics?
12. Are hashes verified when equality must be exact?
13. Are sequence indexes aligned?
14. What is the quality/latency trade-off?
15. Does the representation fit the hardware/runtime?

---

# 38. Backend + AI Bridge

The strongest engineering pattern is often shared across both domains:

| Problem | Backend interpretation | AI interpretation |
|---|---|---|
| Sequence | events/rows | tokens |
| Frequency | metrics | token statistics |
| Window | time range | context/token range |
| Top-K | search results | retrieval candidates |
| Hashing | dedup/cache | dataset/cache identity |
| Prefix state | analytics | token-budget/range accounting |
| Two pointers | ordered feeds | ranked candidate merge |
| Heap | scheduling/Top-K | beam/retrieval Top-K |
| Normalization | identifiers | text preprocessing |
| Streaming | logs/events | inference/data pipelines |
| Compression | compact storage | embedding/feature compression |

This is why foundational DSA remains valuable in AI engineering.

---

# 39. Common Mistakes

1. Treating every AI problem as a model problem.
2. Ignoring tokenization and representation costs.
3. Using full sorting when only Top-K is needed.
4. Materializing huge arrays unnecessarily.
5. Ignoring batch padding waste.
6. Treating hashes as collision-free.
7. Confusing exact duplicate detection with semantic similarity.
8. Applying normalization that changes model semantics.
9. Forgetting vector dimensionality in complexity.
10. Ignoring candidate-generation cost before reranking.
11. Ignoring memory copies between pipeline stages.
12. Reporting complexity using only one input parameter.
13. Forgetting quality/recall trade-offs in approximate algorithms.
14. Losing alignment between predictions, tokens, or labels.
15. Optimizing theoretical complexity while ignoring hardware and memory bandwidth.

---

# 40. Interview Framework

When asked an AI-flavored algorithm question:

```text
1. define representation
2. define dimensions
3. establish exact/approximate contract
4. build brute-force baseline
5. identify repeated work
6. transform representation if useful
7. choose data structure/pattern
8. prove the invariant
9. analyze CPU + memory + allocation
10. identify quality/latency trade-off
11. explain production scaling
```

This prevents vague answers such as “use a vector database” without understanding the underlying computational work.

---

# 41. AI Capstone Scenarios

### Scenario A — Exact Dataset Deduplication

Millions of documents must be deduplicated before training.

Reason about normalization, hashing, collision verification, memory, and streaming.

### Scenario B — Top-50 Retrieval

A system has millions of embeddings but needs 50 candidates.

Compare exact scan + heap with an indexed approximate method.

### Scenario C — Context Packing

A prompt has multiple retrieved chunks with token counts and a strict budget.

Design a selection strategy while preserving ordering and required metadata.

### Scenario D — Streaming Inference

Requests arrive continuously and can be batched for throughput.

Model batching as a bounded window and analyze latency/memory trade-offs.

### Scenario E — Multi-Ranker Retrieval

Three ranked sources produce candidates.

Merge, deduplicate, aggregate scores, and produce deterministic Top-K output.

---

# Revision Checklist

- [ ] I can represent text as token-ID arrays.
- [ ] I understand token-window algorithms.
- [ ] I can reason about token frequency state.
- [ ] I understand exact vs semantic deduplication.
- [ ] I can analyze dense vector search as `O(ND)` scoring.
- [ ] I understand Top-K selection in retrieval.
- [ ] I can merge ranked candidate lists.
- [ ] I understand RAG as an algorithmic pipeline.
- [ ] I can reason about chunking and token budgets.
- [ ] I understand padding waste.
- [ ] I understand prefix/suffix and sequence matching applications.
- [ ] I understand streaming/batching trade-offs.
- [ ] I understand typed-array representation.
- [ ] I understand approximate-search trade-offs.
- [ ] I can identify candidate-generation vs reranking costs.
- [ ] I can analyze memory and allocation costs.
- [ ] I can connect DSA patterns to AI engineering.

## Key Takeaways

1. Tokens, embeddings, scores, candidates, and labels are all data structures that require algorithmic reasoning.
2. AI engineering frequently uses ordinary DSA beneath sophisticated models.
3. Representation determines computational cost: characters → tokens, dense vectors → indexed candidates, full rankings → Top-K.
4. Candidate reduction is one of the most important AI performance patterns.
5. Exact and approximate algorithms have different correctness and quality contracts.
6. Token windows, batching, and context limits are sequence/window problems.
7. Memory, allocation, and data movement can dominate real AI workloads.
8. The same DSA principles—representation, state, invariants, preprocessing, selection, streaming, and complexity—bridge backend and AI engineering.
