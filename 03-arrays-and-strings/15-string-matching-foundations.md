# 03.15 — String Matching Foundations

## Definition

String matching asks whether, where, or how often a **pattern** occurs inside a **text**.

Given:

```text
Text    = T
Pattern = P
```

common goals include:

- determine whether `P` occurs in `T`;
- find the first occurrence;
- find every occurrence;
- count occurrences;
- find overlapping occurrences;
- find a prefix/suffix relationship;
- answer many matching queries efficiently.

The central mental model is:

> **Matching is controlled comparison between two sequences, and the key optimization is avoiding comparisons that repeat information already learned.**

---

# 1. Why String Matching Matters

String matching appears in:

- search engines;
- log filtering;
- routing;
- validation;
- source-code analysis;
- plagiarism detection;
- DNA sequence analysis;
- autocomplete;
- lexical retrieval;
- token sequence processing.

Basic matching also prepares the foundation for KMP, Z-algorithm, rolling hash, tries, suffix structures, and advanced pattern algorithms.

---

# 2. Text and Pattern

Let:

```text
N = text length
M = pattern length
```

Usually:

```text
M <= N
```

but edge cases must define behavior for:

- empty pattern;
- empty text;
- pattern longer than text;
- identical text and pattern.

Never leave empty-pattern semantics implicit in production code or an interview solution.

---

# 3. Exact Matching

Exact matching means every symbol in the pattern must equal the corresponding text symbol.

Example:

```text
text:    abcdef
pattern: cde
```

The pattern occurs starting at index `2`.

This is different from:

- case-insensitive matching;
- normalized matching;
- fuzzy matching;
- regex matching;
- approximate matching.

The algorithm depends on the contract.

---

# 4. Brute-Force Matching

The simplest algorithm tries every possible starting position.

For each start:

```text
compare pattern[0..M-1]
with
text[start..start+M-1]
```

Pseudocode:

```text
for start from 0 to N-M:
    j = 0
    while j < M and T[start+j] == P[j]:
        j++
    if j == M:
        match found
```

Worst-case time:

```text
O((N-M+1)M) = O(NM)
```

Space:

```text
O(1)
```

This algorithm is important because it provides a correctness baseline and an oracle for testing optimized matchers.

---

# 5. Why Brute Force Repeats Work

Suppose the pattern shares a long prefix with a text segment but fails near the end.

A naive algorithm shifts by one and may compare many of the same pattern characters again.

The key optimization question is:

> **What did the failed comparison already prove that can be reused?**

This question leads directly to prefix-based algorithms.

---

# 6. Early Mismatch

Even brute force can be efficient on many practical inputs because mismatches may happen quickly.

Example:

```text
text:    zxxxxxxxxxxxxxxxx
pattern: abcdef
```

Most candidate positions fail immediately.

Therefore:

```text
worst-case complexity ≠ performance on every input
```

But asymptotic analysis still uses the appropriate worst-case bound unless another model is explicitly requested.

---

# 7. Finding the First Occurrence

The first-match problem stops immediately after the first complete match.

This can make the actual runtime much smaller than searching for all matches.

However, worst-case complexity remains `O(NM)` for naive matching.

The distinction between:

```text
first match
all matches
count matches
```

is important because termination behavior changes.

---

# 8. Finding All Occurrences

After a match at position `i`, the next candidate may begin at:

```text
i + 1
```

not necessarily:

```text
i + M
```

because matches may overlap.

Example:

```text
text:    aaaaa
pattern: aaa
```

matches begin at:

```text
0, 1, 2
```

This is a classic edge case.

---

# 9. Overlapping Matches

Overlapping matches are frequently mishandled by solutions that jump past the entire pattern after a match.

The correct behavior depends on the contract:

- overlapping occurrences required → advance appropriately to allow overlap;
- non-overlapping occurrences → skip past the matched pattern;
- only first occurrence → stop immediately.

Algorithm design starts with the exact output contract.

---

# 10. `indexOf` and Built-In Matching

JavaScript provides:

```js
text.indexOf(pattern)
text.includes(pattern)
text.startsWith(pattern)
text.endsWith(pattern)
```

These are appropriate for application code when the built-in semantics match the requirement.

For DSA learning, implementing matching manually is still valuable because it exposes:

- candidate positions;
- repeated comparisons;
- invariants;
- complexity;
- optimization opportunities.

Do not assume a built-in operation has the complexity of your conceptual implementation without understanding the API/runtime contract.

---

# 11. Prefix Matching

A prefix match asks whether:

```text
text starts with pattern
```

Only one alignment matters.

Therefore it requires at most:

```text
O(M)
```

comparisons.

This is much simpler than general substring matching.

Similarly, suffix matching checks one ending alignment.

---

# 12. Single-Character Matching

If:

```text
M = 1
```

matching becomes a simple linear scan.

This illustrates why parameterized complexity matters:

```text
O(NM)
```

can effectively become `O(N)` when `M` is a fixed constant.

Never collapse multiple parameters prematurely when their relative sizes matter.

---

# 13. Matching by Windows

A pattern of length `M` creates candidate windows:

```text
T[0..M-1]
T[1..M]
T[2..M+1]
...
```

There are:

```text
N - M + 1
```

candidate alignments.

The naive algorithm compares each window independently.

The advanced algorithms later exploit relationships between adjacent windows.

---

# 14. Avoid Materializing Every Window

A tempting implementation is:

```js
for (...) {
  const window = text.slice(i, i + pattern.length);
  if (window === pattern) ...
}
```

This can introduce repeated allocations and copying.

Index-based comparison avoids explicitly creating every candidate substring.

General principle:

> **Do not construct a representation when the algorithm only needs to inspect its boundaries or elements.**

---

# 15. Matching with Two Pointers

A conceptual matching state can use:

```text
i = text position
j = pattern position
```

The naive algorithm resets `j` after a mismatch.

The optimization challenge is to avoid throwing away useful information about the pattern prefix already matched.

This leads to prefix-function reasoning.

---

# 16. Prefix-Suffix Structure

A string can have a **border**: a non-empty string that is both:

- a prefix;
- a suffix.

Example:

```text
abab
```

has border:

```text
ab
```

Why does this matter?

After a mismatch, a matched prefix may contain a smaller prefix that is also a suffix of the matched region.

That smaller prefix can become the next candidate instead of restarting from zero.

---

# 17. Prefix Function / LPS Preview

KMP uses an array commonly called:

```text
prefix function
LPS (Longest Proper Prefix which is also Suffix)
```

For each pattern position, it records the length of the longest proper prefix matching a suffix ending there.

This preprocessing captures reusable pattern structure.

The important conceptual transition is:

```text
naive:
reset after mismatch

KMP:
reuse known prefix/suffix information
```

The full KMP algorithm is covered later; here the goal is to understand why such metadata exists.

---

# 18. Proper Prefix

A proper prefix is a prefix shorter than the entire string.

For:

```text
abc
```

proper prefixes include:

```text
a
ab
```

but not `abc`.

When computing LPS/prefix-function values, including the entire pattern would make the fallback definition meaningless.

---

# 19. Pattern Preprocessing

There are two broad strategies:

### Recompute from scratch

Simple but potentially expensive.

### Preprocess pattern

Build reusable metadata once and use it during matching.

This creates a classic build-vs-query trade-off:

```text
preprocessing cost
+
query/matching cost
```

If the same pattern is matched against many texts, preprocessing becomes especially valuable.

---

# 20. One Pattern, Many Texts

Suppose one pattern is searched across `Q` documents.

Naive matching can repeatedly rediscover the same pattern structure.

Pattern preprocessing allows the pattern's internal structure to be computed once.

This is a general algorithmic engineering principle:

> **Move reusable computation out of repeated queries.**

---

# 21. Many Patterns, One Text

The opposite workload is different:

```text
one large text
many patterns
```

A separate algorithm for every pattern may be expensive.

Possible future tools include:

- tries;
- Aho–Corasick;
- suffix structures;
- hashing/indexing.

The workload determines the correct representation.

---

# 22. Hash-Based Matching Preview

Rolling hash approaches represent substrings by hash values.

Instead of comparing every symbol for every window:

```text
compute pattern hash
compute/update text-window hash
compare hashes
```

A hash match is not automatically proof of equality because collisions are possible.

A robust exact algorithm may verify candidate matches or use a sufficiently strong collision model.

This is a probabilistic-algorithm connection.

---

# 23. Exact vs Probabilistic Matching

### Exact comparison

A match is mathematically definitive.

### Hash filtering

A matching hash identifies a candidate; equality verification may be needed.

The distinction between:

```text
candidate
vs
proof
```

is essential in production systems.

---

# 24. Case-Insensitive Matching

Case-insensitive matching requires a defined normalization policy.

A naive approach might call:

```js
text.toLowerCase()
pattern.toLowerCase()
```

but this creates transformed representations and can have Unicode semantics beyond simple ASCII assumptions.

For interview problems, explicitly state the assumed character model.

---

# 25. Unicode and Matching

String matching over arbitrary Unicode text requires care about what constitutes a symbol.

Possible levels include:

```text
UTF-16 code units
Unicode code points
grapheme clusters
normalized text
```

A byte/code-unit-oriented algorithm may produce a different result from a user-perceived-character-oriented algorithm.

Production systems must define this contract explicitly.

---

# 26. Complexity Summary

Let:

```text
N = text length
M = pattern length
Q = number of text queries
```

Typical foundations:

| Technique | Preprocessing | Matching |
|---|---:|---:|
| Direct prefix check | `O(1)` | `O(M)` |
| Naive substring search | `O(1)` | `O(NM)` worst case |
| KMP-style prefix preprocessing | `O(M)` | `O(N)` |
| Rolling-hash style | `O(M)` | typically near-linear expected/average behavior, model-dependent |

The exact cost of hashing depends on the implementation and collision strategy.

---

# 27. Correctness Invariants

For naive matching:

> At candidate start `i`, every compared position before mismatch is equal between text and pattern.

For prefix-function construction:

> The stored value represents the longest valid proper prefix/suffix relationship for the processed prefix.

For rolling hash:

> The maintained hash corresponds to the current window under the chosen hash recurrence.

Explicit invariants make string algorithms easier to derive and debug.

---

# 28. Backend Applications

### Log Search

Find exact patterns in logs or event payloads.

### Routing

Prefix matching is fundamental to route selection.

### Validation

Detect required prefixes/suffixes or structured markers.

### Protocol Parsing

Delimiter and marker matching can be implemented as state transitions.

### Search APIs

Repeated pattern queries benefit from preprocessing and indexing strategies.

### Observability

Pattern matching can identify known error signatures, although high-volume production systems should avoid unbounded repeated scans.

---

# AI Applications

### Lexical Retrieval

Substring and token-sequence matching can complement semantic retrieval.

### Prompt / Output Validation

Detect required markers, tags, or structured output boundaries.

### Dataset Deduplication

Exact sequence matching can identify repeated text or token spans.

### Token Matching

The same algorithms can operate on token IDs instead of characters.

### Retrieval Pipelines

Hashing, prefix indexes, and pattern metadata can reduce repeated matching work.

---

# Common Mistakes

1. Forgetting empty-pattern semantics.
2. Treating substring and subsequence as the same problem.
3. Skipping overlapping matches unintentionally.
4. Materializing every text window.
5. Claiming naive matching is always `O(N)`.
6. Forgetting the second parameter `M` in complexity analysis.
7. Assuming a hash match proves equality without considering collisions.
8. Confusing prefix with substring.
9. Applying ASCII assumptions to arbitrary Unicode text.
10. Recomputing reusable pattern metadata for every query.
11. Ignoring output size when returning all matches.
12. Using case conversion without defining normalization semantics.

---

# Interview Framework

When given a string-matching problem:

1. Define text and pattern lengths `N` and `M`.
2. Clarify exact vs normalized/case-insensitive matching.
3. Define empty-input behavior.
4. Determine whether the task needs first/all/count/existence.
5. Start with brute force as a correctness baseline.
6. Identify repeated comparisons.
7. Ask whether prefix/suffix structure can be reused.
8. Consider preprocessing when the pattern is reused.
9. Consider hashing when appropriate.
10. Account for overlapping matches and output size.
11. State the character model.
12. Give time, auxiliary space, and allocation costs.

---

# Revision Checklist

- [ ] I can define exact string matching.
- [ ] I can implement naive matching.
- [ ] I understand why naive matching can be `O(NM)`.
- [ ] I understand candidate windows.
- [ ] I can find first and all occurrences.
- [ ] I understand overlapping matches.
- [ ] I understand prefix/suffix/border structure.
- [ ] I understand why LPS/prefix-function metadata exists.
- [ ] I understand preprocessing vs repeated-query trade-offs.
- [ ] I understand the conceptual idea behind KMP.
- [ ] I understand rolling-hash matching at a high level.
- [ ] I understand hash collision implications.
- [ ] I can reason about Unicode matching contracts.
- [ ] I can connect string matching to backend search and routing.
- [ ] I can connect matching to AI token sequences.

## Key Takeaways

1. Naive matching is the baseline: test every alignment and compare until mismatch.
2. Its worst-case complexity is `O(NM)`.
3. Overlapping matches require careful advancement rules.
4. Prefix/suffix structure explains why advanced algorithms can avoid repeated comparisons.
5. Pattern preprocessing is valuable when the same pattern is reused.
6. Rolling hashes can filter candidates but introduce collision considerations.
7. Exact matching, normalized matching, and user-perceived text matching are different contracts.
8. String matching is fundamentally a state-and-invariant problem and prepares the foundation for KMP, Z-algorithm, rolling hash, tries, and advanced search structures.
