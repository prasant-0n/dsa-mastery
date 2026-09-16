# 15.20 — Greedy String, Compression & Encoding Engineering

## 1. Concept Definition

String compression and encoding problems often contain local choices over symbols, runs, code lengths, dictionary entries, or representations.

Some admit exact greedy solutions; others only appear greedy and require dynamic programming, parsing, or entropy-based modeling.

The central skill is to identify the structural reason a local encoding choice is safe.

## 2. Encoding vs Compression

Encoding maps information into a representation.

Compression attempts to reduce representation cost while preserving the required information.

```text
encoding   -> representation
compression -> representation + size objective
```

## 3. Fixed-Length Encoding

If an alphabet has `m` symbols and all symbols have equal frequency and equal importance, fixed-length binary encoding can use approximately:

```text
ceil(log2(m)) bits/symbol
```

This is an encoding decision rather than an adaptive compression strategy.

## 4. Variable-Length Prefix Codes

A prefix code ensures no codeword is a prefix of another.

This allows unambiguous decoding without explicit separators.

The optimization objective can be weighted code length:

```text
Σ frequency(symbol) × codeLength(symbol)
```

## 5. Huffman as Greedy Compression

Huffman coding repeatedly combines the two least-frequent nodes.

The resulting binary tree minimizes weighted path length among binary prefix codes under the standard model.

This is a canonical example of a greedy algorithm with an exchange-style correctness argument.

## 6. Why the Two Smallest Frequencies?

In an optimal binary prefix tree, two least-frequent symbols can be placed as siblings at maximum depth.

Combining them into a single meta-symbol produces a smaller equivalent problem.

This reduction creates the greedy recurrence.

## 7. Canonical Huffman Codes

Canonical Huffman coding preserves code lengths while assigning codes in a deterministic ordered manner.

Benefits include:

- compact metadata
- deterministic representation
- simple reconstruction
- efficient implementation

The exact tree shape is not required by the decoder when code lengths are available.

## 8. Run-Length Encoding

Run-Length Encoding (RLE) replaces repeated runs with counts and symbols:

```text
AAAABBCC -> 4A2B2C
```

RLE is highly effective on repetitive data and ineffective on highly varied data.

Its local transformation is simple, but whether compression improves depends on representation overhead.

## 9. Run-Length Boundary

A run should be encoded according to the target format's count limits and escape rules.

Production implementations must define:

- maximum run length
- literal escaping
- empty input
- malformed encoded input
- integer overflow behavior

## 10. Greedy Run Grouping

When a string operation rewards maximal consecutive runs, scanning once and consuming the current run is often optimal.

The proof is usually based on the fact that a run's members cannot be separated without violating the objective's structure.

## 11. Dictionary Compression

Dictionary methods replace repeated substrings with references to previously known sequences.

Examples include LZ-family approaches.

Dictionary matching can look greedy:

```text
choose longest available match
```

but whether longest-match is globally optimal depends on the exact coding model and token costs.

## 12. Longest-Match Pitfall

Choosing the longest substring is not automatically optimal if a shorter match enables a better future dictionary state or cheaper tokenization.

Always model the cost of the emitted token and the resulting state.

## 13. Greedy Tokenization

A parser or encoder may repeatedly choose the longest valid token.

This is correct only when the grammar and cost model provide the necessary exchange or prefix property.

Otherwise dynamic programming may be required.

## 14. Prefix Properties

Greedy scanning becomes safer when the representation is prefix-free or when the earliest valid decision cannot invalidate a better future solution.

Prefix structure is therefore an important signal when analyzing string algorithms.

## 15. Lexicographically Smallest Greedy Construction

Many string construction problems ask for the lexicographically smallest valid result.

A local smallest character is safe only when feasibility of the remaining suffix can be tested.

A typical pattern is:

```text
choose smallest feasible next character
→ update state
→ continue
```

## 16. Feasibility Oracle

The phrase **smallest feasible choice** is stronger than **smallest choice**.

The algorithm needs a way to determine whether choosing a candidate still permits completion.

This can require counts, suffix information, automata, or dynamic programming.

## 17. Remove-Duplicate-Letters Pattern

A classic pattern constructs the lexicographically smallest string containing each distinct character once.

A stack plus remaining-frequency counts allows decisions based on whether the current stack character can safely be removed.

This combines greedy choice with a feasibility condition.

## 18. Monotonic Stack Connection

When a later character is smaller and the earlier character can safely be deferred, repeatedly removing larger stack elements creates a monotonic-stack pattern.

This pattern appears in many sequence optimization problems.

## 19. Greedy String Merge

When merging strings while optimizing lexicographic order, comparing only the next character can be insufficient.

Two equal prefixes require comparing future suffixes.

The correct comparator depends on the exact objective.

## 20. Shortest Superstring Boundary

Repeatedly merging the pair with maximum overlap is a natural greedy strategy for Shortest Common Superstring heuristics.

However, it is not generally an exact algorithm.

This is an important example of a plausible greedy rule that crosses into approximation/heuristic territory.

## 21. Compression Objective Modeling

Before implementing a compressor, define:

```text
payload cost
metadata cost
CPU cost
memory cost
latency cost
```

Minimizing bytes alone may produce an undesirable production system.

## 22. Entropy

For symbol probabilities `p_i`, Shannon entropy is:

```text
H(X) = -Σ p_i log2(p_i)
```

It provides a lower-bound intuition for average lossless coding cost under an idealized independent-symbol model.

Entropy is not itself a compression algorithm.

## 23. Huffman vs Arithmetic Coding

Huffman uses a discrete prefix-code structure.

Arithmetic/range coding represents sequences through intervals and can approach entropy more closely in many models.

The choice is determined by the probability model, implementation requirements, and format constraints.

## 24. Adaptive Frequency Coding

A static compressor knows symbol frequencies before encoding.

An adaptive compressor updates its model as data arrives.

This creates an online learning problem over symbol frequencies.

## 25. Streaming Compression

Streaming encoders must bound memory and preserve decoder synchronization.

Important concerns include:

- chunk boundaries
- state carry-over
- flush semantics
- partial symbols
- error recovery

## 26. Backend Applications

String compression and encoding are useful for:

- HTTP payloads
- logs
- event streams
- database text storage
- cache values
- message queues
- API responses
- telemetry

The algorithmic objective should be combined with CPU, latency, and memory constraints.

## 27. AI Applications

AI workloads can compress:

- prompts
- token streams
- embeddings metadata
- retrieval payloads
- evaluation datasets
- model artifacts
- logs and traces

Compression may reduce storage and network cost but increase CPU latency.

## 28. Token-Level Optimization

AI systems operate over tokens rather than raw characters.

A compression or batching strategy should therefore consider tokenization boundaries and model-specific cost rather than character count alone.

## 29. Dictionary Selection for AI Data

Repeated instruction templates, JSON structures, schemas, and tool-call patterns can create dictionary opportunities.

The optimal strategy depends on repetition frequency and metadata overhead.

## 30. Deduplication Before Compression

Removing duplicate content can produce larger savings than optimizing the encoding of repeated bytes.

A pipeline may therefore be:

```text
deduplicate
→ normalize
→ compress
→ encode
```

Each stage has different correctness requirements.

## 31. Content-Defined Chunking

For large data, fixed-size chunks are simple but can lose alignment after insertions.

Content-defined chunking uses content-dependent boundaries to improve deduplication stability.

Chunk-boundary selection is a separate algorithmic problem from compression.

## 32. Greedy Chunking Boundary

Selecting the earliest boundary that satisfies a local condition can be efficient, but the chunk size objective may require lookahead or global optimization.

Do not assume a local boundary rule minimizes total storage.

## 33. Encoding Safety

A production decoder must treat input as untrusted.

Validate:

- code lengths
- references
- offsets
- counts
- termination markers
- maximum output size

Compression formats can otherwise become denial-of-service vectors through decompression bombs or malformed metadata.

## 34. Streaming Decoder Invariants

Maintain:

```text
input position is valid
output size remains bounded
decoder state is internally consistent
references point to valid history
```

These invariants matter more than the happy-path example.

## 35. Canonical Representation

Deterministic encoding improves:

- reproducibility
- cache keys
- testing
- content hashing
- debugging

Canonical forms are especially valuable in distributed systems.

## 36. Compression and Caching

A cache can store compressed values to reduce memory or network transfer.

But compression changes CPU cost and may complicate partial reads.

Benchmark the complete read/write path.

## 37. Complexity Engineering

Separate:

```text
scan cost
+ frequency-model cost
+ heap/tree cost
+ dictionary lookup cost
+ output cost
```

For Huffman with `n` distinct symbols, heap construction and merging are typically `O(n log n)`.

## 38. Testing Strategy

Test:

- empty strings
- one symbol
- highly repetitive strings
- random strings
- Unicode text
- very long runs
- malformed encodings
- maximum counts
- repeated dictionary references

Round-trip testing is fundamental:

```text
decode(encode(input)) === input
```

## 39. Differential Testing

Compare optimized implementations with a simple reference implementation.

For compression, compare:

- decoded output
- encoded validity
- metadata consistency
- compression ratio
- runtime

## 40. Benchmarking

Measure:

- input size
- output size
- compression ratio
- throughput
- CPU time
- memory
- latency

A smaller output is not automatically better if latency becomes unacceptable.

## 41. Interview Framework

When given a string greedy problem:

1. define the objective
2. identify the local choice
3. state the feasibility condition
4. prove the exchange or invariant
5. identify whether future state changes
6. search for counterexamples
7. compare against DP/graph alternatives
8. analyze time and space

## 42. Implementation Lab

Implement and compare:

1. RLE encoder/decoder
2. Huffman coding
3. canonical Huffman generation
4. greedy tokenization
5. lexicographic stack construction
6. dictionary matching simulation
7. content-defined chunking simulation
8. brute-force string greedy oracle
9. compression benchmarks
10. backend payload compression pipeline
11. AI token/data compression experiments

## 43. Revision Checklist

- [ ] Explain encoding vs compression.
- [ ] Explain prefix codes.
- [ ] Derive Huffman's greedy rule.
- [ ] Understand canonical Huffman coding.
- [ ] Implement safe RLE.
- [ ] Recognize longest-match greedy boundaries.
- [ ] Understand feasibility-aware lexicographic greedy.
- [ ] Recognize monotonic-stack string patterns.
- [ ] Understand shortest-superstring greedy as a heuristic boundary.
- [ ] Understand entropy conceptually.
- [ ] Understand streaming compression constraints.
- [ ] Apply compression engineering to Backend and AI systems.

## Key Takeaways

1. String problems often hide greedy structure behind prefix, run, or feasibility properties.
2. Huffman coding is a canonical exact greedy optimization algorithm.
3. Longest-match and lexicographically smallest choices are not automatically safe; the future state must be considered.
4. Compression quality is only one production objective; CPU, memory, latency, and metadata matter.
5. Streaming and distributed encoders require explicit state and safety invariants.
6. Round-trip, malformed-input, differential, and benchmark testing are essential for production encoding systems.
