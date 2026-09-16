# 15.06 — Huffman Coding & Optimal Prefix Codes

## 1. Concept Definition

**Huffman coding** constructs a binary prefix code that minimizes the weighted average code length for a known set of symbol frequencies.

The algorithm repeatedly combines the two least-frequent symbols or subtrees.

## 2. Problem Model

Given symbols with frequencies `fᵢ`, assign binary codewords minimizing:

```text
Σ fᵢ × codeLengthᵢ
```

subject to the code being prefix-free.

## 3. Prefix-Free Codes

A prefix-free code has no codeword that is a prefix of another codeword.

Therefore encoded symbols can be decoded unambiguously from left to right without separators.

## 4. Greedy Rule

Repeatedly:

1. extract the two minimum-frequency nodes
2. combine them into a parent whose frequency is their sum
3. insert the parent back
4. continue until one tree remains

## 5. Why Two Minimum Frequencies

The least-frequent symbols can safely be placed deepest in an optimal prefix tree.

The two least-frequent symbols can be made siblings at maximum depth through an exchange argument.

## 6. Exchange Argument

Take the two least-frequent symbols `a` and `b`.

In an optimal prefix tree, choose two deepest sibling leaves `x` and `y`. Since `a` and `b` have no greater frequencies than `x` and `y`, exchanging their positions with `a` and `b` cannot increase weighted path cost.

Thus an optimal tree exists in which the two least-frequent symbols are siblings.

## 7. Reduction to a Smaller Problem

Merge the two least-frequent symbols into a compound symbol with frequency:

```text
f(a,b) = f(a) + f(b)
```

Solve the smaller problem recursively.

Expanding the compound node restores the original symbols.

## 8. Priority Queue

A min-heap efficiently retrieves the two smallest frequencies.

For `N` distinct symbols:

```text
N insertions/extractions → O(N log N)
```

The resulting tree contains `N` leaves and `N - 1` internal nodes.

## 9. Complexity

Typical complexity:

```text
Time:  O(N log N)
Space: O(N)
```

where `N` is the number of distinct symbols.

If frequencies arrive already sorted, specialized linear-time constructions are possible.

## 10. Tree Construction

Each merge creates:

```text
parent.frequency = left.frequency + right.frequency
```

The two children receive opposite binary branches, conventionally `0` and `1`.

Swapping left/right changes codewords but not total weighted cost.

## 11. Code Generation

Traverse the final tree from the root.

Append:

```text
0 → left
1 → right
```

The root-to-leaf path becomes the symbol's code.

## 12. Single-Symbol Alphabet

A one-symbol alphabet is a special case because there is no internal branching.

Define a deterministic encoding convention, such as assigning a one-bit code, according to the application contract.

## 13. Equal Frequencies

Equal-frequency nodes can produce multiple optimal Huffman trees.

The weighted cost can remain identical even though codewords differ.

Use deterministic tie-breaking when reproducible output is required.

## 14. Canonical Huffman Codes

Canonical Huffman coding represents the same code-length structure using a deterministic assignment of codewords.

This can reduce metadata and simplify serialization.

## 15. Code Lengths vs Codewords

The compression objective depends on code lengths, not the textual identity of a particular binary codeword.

Therefore canonicalization can change codewords without changing optimal weighted cost when code lengths are preserved.

## 16. Encoding

Build a symbol-to-code map and emit the corresponding bits for each input symbol.

The encoder must define how the final partial byte is padded and how the decoder learns the valid bit length.

## 17. Decoding

Starting at the root:

```text
0 → left
1 → right
leaf → emit symbol and return to root
```

A prefix-free tree guarantees unambiguous decoding.

## 18. Serialization Boundary

A decoder needs enough information to reconstruct the codebook.

Options include:

- frequencies
- code lengths
- serialized tree shape
- canonical code metadata

Metadata itself consumes storage and must be included in real compression analysis.

## 19. Compression Ratio

For input of `B` original bits and encoded representation of `C` bits:

```text
compression ratio = B / C
```

Real formats must include headers, codebooks, padding, and framing overhead.

## 20. Weighted Path Length

The total weighted path length is:

```text
WPL = Σ fᵢ × depthᵢ
```

Huffman minimizes WPL among binary prefix codes for the given frequencies.

## 21. Entropy Boundary

Entropy provides a theoretical lower bound on the average number of bits per symbol for lossless coding under an appropriate probabilistic model.

Huffman coding generally produces integer-length codes and may therefore sit above entropy.

## 22. Huffman vs Fixed-Length Coding

Fixed-length coding uses the same number of bits for every symbol.

Huffman assigns shorter codes to frequent symbols and longer codes to rare symbols.

## 23. Huffman vs Arithmetic Coding

Arithmetic/range coding can represent fractional average code lengths and can approach entropy more closely under suitable models.

Huffman remains attractive for its simplicity, speed, and prefix-code properties.

## 24. Huffman vs Shannon-Fano

Shannon-Fano uses a different recursive partitioning strategy and is not guaranteed to achieve Huffman's minimum weighted path length.

## 25. Adaptive Huffman Boundary

Static Huffman assumes frequencies are known or estimated before coding.

Adaptive variants update the coding tree as data arrives, changing the engineering and proof model.

## 26. Streaming Considerations

A streaming compressor may need to:

- estimate frequencies
- buffer input for a codebook pass
- use adaptive coding
- emit codebook metadata

There is a trade-off between compression quality, latency, and memory.

## 27. Backend Applications

Huffman-style coding appears in compression pipelines and can support:

- log storage
- archival data
- network payload compression
- serialized artifacts
- static dictionaries

## 28. AI Applications

Prefix-code reasoning is useful for understanding:

- compressed model artifacts
- entropy coding
- token frequency distributions
- vocabulary metadata
- storage-efficient symbol representations

It is conceptually distinct from modern subword tokenization, which optimizes different objectives.

## 29. Greedy Proof Invariant

After each merge, the constructed compound symbol represents a subtree whose frequency equals the sum of its leaves.

The remaining priority queue represents the reduced optimal-subproblem instance.

## 30. Optimality Proof

The proof follows:

1. two least-frequent symbols can be siblings in some optimal tree
2. merge them into one compound symbol
3. solve the smaller problem optimally
4. expand the compound symbol
5. the expansion adds exactly `f(a) + f(b)` to the relevant weighted-depth contribution

Thus the greedy construction is optimal.

## 31. Correctness of Decoding

Because no codeword is a prefix of another, the first leaf reached while reading bits identifies exactly one symbol.

This gives unique decodability.

## 32. Integer Overflow

Frequency sums can exceed JavaScript's safe integer range for very large datasets.

Use appropriate numeric representation and define whether exact frequency arithmetic is required.

## 33. Memory Engineering

A naive implementation may allocate many small node objects.

For high-throughput systems, compact arrays or typed structures can reduce allocation and improve locality.

## 34. Determinism

Define tie-breaking for equal frequencies if byte-for-byte reproducibility matters.

Possible keys include:

```text
frequency → symbol ID → creation ID
```

## 35. Testing

Test:

- empty input
- one symbol
- two symbols
- equal frequencies
- highly skewed frequencies
- repeated symbols
- Unicode symbols
- large frequency values
- malformed encoded streams
- truncated bitstreams

## 36. Differential Testing

Compare:

- generated codes against prefix-free validation
- decoded output against original input
- weighted cost against a brute-force optimum for tiny alphabets
- canonical and non-canonical representations by decoded semantics

## 37. Property Tests

Verify:

- every symbol has exactly one code
- no code is a prefix of another
- all codes terminate at leaves
- encode → decode preserves input
- tree root frequency equals total frequency
- internal frequency equals child-frequency sum

## 38. Backend Production Concerns

Production compression should account for:

- CPU cost
- memory pressure
- streaming latency
- metadata overhead
- corruption detection
- version compatibility
- deterministic serialization

## 39. AI Production Concerns

When applying entropy coding to AI artifacts, measure the entire pipeline rather than only symbol payload size.

Consider model loading latency, decompression CPU, random-access requirements, and hardware constraints.

## 40. Common Mistakes

- using a max-heap instead of a min-heap
- forgetting that two minimum nodes are merged
- assuming every optimal tree is unique
- ignoring codebook overhead
- confusing Huffman coding with tokenization
- claiming Huffman always reaches entropy
- failing to handle a one-symbol alphabet

## 41. Interview Framework

For Huffman coding:

1. identify a prefix-code optimization problem
2. define weighted path length
3. select the two least frequencies
4. merge them
5. use a min-heap
6. repeat until one tree remains
7. prove the greedy choice using an exchange argument
8. derive `O(N log N)`
9. explain encoding/decoding and prefix-freeness

## 42. Revision Checklist

- [ ] Define prefix-free coding.
- [ ] Explain weighted path length.
- [ ] Build the Huffman tree.
- [ ] Use a min-heap.
- [ ] Explain the two-minimum greedy choice.
- [ ] Perform the exchange argument.
- [ ] Generate codes by tree traversal.
- [ ] Explain decoding.
- [ ] Handle equal frequencies and one-symbol input.
- [ ] Understand canonical Huffman codes.
- [ ] Analyze compression overhead.
- [ ] Apply the concept to backend/AI storage systems.

## Key Takeaways

1. Huffman coding is a canonical greedy algorithm for optimal binary prefix codes.
2. The two least-frequent symbols can safely be made deepest siblings.
3. A min-heap makes repeated minimum selection efficient.
4. Multiple Huffman trees can be optimal; deterministic tie-breaking is an engineering choice.
5. Real compression includes codebook and framing overhead, not just payload bits.
6. Huffman's greedy proof is a model example of exchange-based algorithm correctness.
