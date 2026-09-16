# 13.08 — Trie-Based String Matching & Dictionary Search

## Objective

Use tries as searchable dictionaries and pattern indexes. Understand exact matching, prefix matching, multi-pattern search, dictionary segmentation, and the boundary between trie traversal and more specialized string algorithms.

## 1. Dictionary Search

A trie stores a collection of keys as shared prefix paths. Searching a dictionary becomes traversal over the query symbols.

## 2. Exact Dictionary Membership

Exact membership requires every symbol to exist and the final node to be terminal.

## 3. Prefix Dictionary Search

A prefix query locates a node and then explores its descendants. This supports completion and candidate generation.

## 4. Multiple Pattern Search

A trie can store many patterns simultaneously. Scanning an input against the trie can discover dictionary words beginning at a selected position.

## 5. Naive Multi-Pattern Matching

For each text position, start from the trie root and advance while transitions exist.

If the text length is `N` and maximum pattern length is `M`, the straightforward worst-case bound can reach `O(NM)`.

## 6. Why Trie Search Helps

Patterns sharing prefixes reuse traversal work structurally. This can be advantageous when the dictionary is large and prefix overlap is substantial.

## 7. Aho-Corasick Boundary

For simultaneous matching of many patterns across a text, Aho-Corasick augments a trie with failure links. It can process the text in time related to text length, matched output, and preprocessing, rather than restarting a trie walk independently at every position.

The full algorithm is a later advanced string-algorithm topic.

## 8. Dictionary Word Segmentation

A trie can enumerate dictionary words beginning at each text position. Dynamic programming can then determine whether a complete segmentation exists.

```text
trie traversal + DP
```

## 9. Word Break State

Let `dp[i]` represent whether the text prefix ending at position `i` is segmentable. Trie traversal discovers candidate next words.

## 10. Prefix Constraints

A trie can restrict allowed strings by requiring every generated symbol to follow an existing transition.

## 11. Character-Level Matching

For ordinary lowercase dictionaries, each character can represent one trie edge. For Unicode, define symbol semantics explicitly.

## 12. Token-Level Tries

A trie does not have to operate on characters. Tokens, bytes, words, IDs, or domain-specific symbols can be edges.

This changes the representation and complexity model.

## 13. Case Normalization

Normalize dictionary entries and queries consistently when matching should be case-insensitive.

## 14. Unicode Normalization

Canonical equivalence, case folding, accents, and grapheme semantics can affect whether two visually similar strings are treated as identical.

## 15. Wildcards

A wildcard introduces branching. For example, `c?t` may require exploring every child at the wildcard position.

Worst-case search can become proportional to a large portion of the trie.

## 16. Single-Character Wildcards

Use DFS with explicit state `(node, patternIndex)`. The state graph may contain many branches even though the underlying trie is acyclic.

## 17. Multiple Wildcards

Multiple wildcards multiply branching opportunities. Constraints and pruning become important.

## 18. Glob-Style Patterns

Patterns such as `*` require matching variable-length sequences and can create substantially more search states. Memoization over `(node, patternIndex)` can avoid repeated work.

## 19. Approximate Matching Boundary

Edit-distance matching is different from exact trie traversal. A trie can still participate in approximate search by tracking dynamic-programming rows while traversing nodes.

## 20. Trie + Edit Distance

At each node, maintain the relevant edit-distance state. Branches whose minimum possible distance already exceeds the threshold can be pruned.

## 21. Dictionary Validation

A trie can validate that every token or identifier belongs to an approved vocabulary.

## 22. Reserved Words

Compilers and interpreters can use trie-like structures for keyword lookup, although hash tables are often sufficient for exact keyword membership.

## 23. Routing and Namespaces

Hierarchical route segments can be indexed as symbols. A trie can distinguish exact routes from valid prefixes.

## 24. Longest Dictionary Match

Given a text position, traverse until no transition exists and remember the deepest terminal node. This returns the longest dictionary word beginning there.

## 25. Shortest Dictionary Match

Stop at the first terminal node if the application needs the shortest matching dictionary word.

## 26. All Dictionary Matches

Record every terminal node encountered during a successful traversal. This produces all dictionary words beginning at a position.

## 27. Text Scan

To find all dictionary occurrences, repeat matching from relevant text positions or use an automaton such as Aho-Corasick for scalable multi-pattern matching.

## 28. Output-Sensitive Complexity

If many patterns match, producing all matches itself costs time. Always include output size in the complexity model.

## 29. Duplicate Patterns

If duplicate logical patterns are allowed, decide whether they merge, count multiplicity, or retain separate payloads.

## 30. Payloads

Terminal nodes can store IDs or metadata for matched dictionary entries. Multiple payloads may correspond to one normalized key.

## 31. Search Result Contracts

Define whether results contain:

```text
matched key
start position
end position
payload
score
```

before optimizing the traversal.

## 32. Backend Applications

Trie-based dictionary search can support:

- API route validation;
- command dictionaries;
- reserved-name checks;
- product/search dictionaries;
- namespace validation;
- prefix-based access rules.

## 33. AI Applications

Applications include:

- lexicon constraints;
- entity dictionaries;
- token-prefix candidate generation;
- constrained decoding;
- vocabulary filtering;
- lexical retrieval.

## 34. Constrained Decoding

During generation, the current trie node represents the valid continuation state. Invalid next symbols are excluded before model selection.

## 35. Trie + Model Scoring

The trie answers symbolic eligibility. A model can score the eligible candidates. Separating these responsibilities makes correctness easier to verify.

## 36. Correctness Invariant

For every active traversal state, the trie node represents exactly the consumed pattern prefix.

For text matching, additionally track the source-text position precisely.

## 37. Wildcard Correctness

A wildcard transition is valid only when each explored child corresponds to a legal symbol. Memoization must preserve all state dimensions that affect future behavior.

## 38. Longest-Match Correctness

Maintain the deepest terminal state encountered during a valid traversal. Once traversal fails, that saved state is the longest matching dictionary entry.

## 39. Common Mistakes

- treating a path as an exact match;
- forgetting multiple terminal nodes along a path;
- ignoring output size;
- using character assumptions for token tries;
- mishandling Unicode;
- implementing wildcard search without a state model;
- claiming trie matching is always better than hashing or specialized automata.

## 40. Testing

Test:

- exact matches;
- prefixes;
- overlapping patterns;
- duplicate patterns;
- longest/shortest matches;
- no matches;
- wildcard branches;
- empty patterns;
- Unicode;
- normalization;
- large output sets.

## 41. Differential Testing

Compare trie-based matching against a simple reference implementation that checks every dictionary pattern directly. For wildcard or approximate matching, compare against a trusted brute-force matcher.

## 42. Benchmarking

Measure:

- dictionary construction;
- query latency;
- text scan throughput;
- nodes visited;
- matches emitted;
- allocations;
- memory.

Compare trie approaches with hash sets, sorted arrays, and specialized string automata for the actual workload.

## 43. Production Design

A production dictionary index should specify:

- normalization;
- alphabet/token model;
- update frequency;
- persistence;
- memory budget;
- concurrency;
- result limits;
- consistency semantics.

## 44. Interview Pattern

When you see:

```text
many dictionary strings
prefixes
longest matching word
all words beginning here
```

consider a trie. For whole-text multi-pattern matching, also recognize the Aho-Corasick boundary.

## 45. Complexity Summary

For query/pattern length `L`:

```text
exact lookup             O(L · childLookup)
prefix lookup            O(L · childLookup)
longest prefix match     O(L · childLookup)
naive text scan           up to O(NM · childLookup)
```

Wildcard and approximate matching require state-space analysis rather than a single `O(L)` claim.

## Revision Checklist

- [ ] I can use a trie as a dictionary.
- [ ] I can find longest and shortest dictionary matches.
- [ ] I understand multi-pattern matching limitations.
- [ ] I know why Aho-Corasick extends trie matching.
- [ ] I can combine trie traversal with word-break DP.
- [ ] I can model wildcard search states.
- [ ] I understand approximate matching boundaries.
- [ ] I can design token/Unicode-aware matching.
- [ ] I can compare tries with hash sets and specialized automata.
- [ ] I can explain trie-based matching in a backend or AI system.

## Key Takeaways

1. **A trie is a shared-prefix dictionary, not a universal string-matching solution.**
2. **Longest, shortest, and all-match queries are simple variations of terminal-state tracking.**
3. **Wildcards and approximate matching turn traversal into a larger state-space search.**
4. **Aho-Corasick is the natural next step for scalable multi-pattern text matching.**
5. **Choose the trie representation and matching algorithm from the dictionary, query, output, and update workloads.**
