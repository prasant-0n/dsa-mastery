# 13.18 — Multi-Pattern Matching & Aho–Corasick

## 1. Concept Definition

Multi-pattern matching finds occurrences of many patterns inside one text efficiently. A trie provides shared-prefix structure; Aho–Corasick adds failure links so the search can continue without restarting from the root after a mismatch.

## 2. Why It Exists

Searching `P` patterns independently can repeatedly scan the same text regions. Aho–Corasick builds one automaton that shares common prefixes and processes the text in one main pass.

Typical applications include keyword detection, content filtering, log analysis, dictionary matching, intrusion signatures, and lexical candidate generation.

## 3. Mental Model

Build:

```text
patterns
   ↓
 trie
   ↓
 failure links
   ↓
 output links / terminal metadata
   ↓
 automaton
```

During scanning, the automaton state represents the longest pattern-prefix suffix compatible with the text processed so far.

## 4. Trie Foundation

Insert every pattern into a trie. Shared prefixes occupy shared nodes.

Terminal nodes identify patterns that end at a particular state.

Duplicate patterns require an explicit policy: preserve duplicate IDs, deduplicate them, or aggregate metadata.

## 5. Failure Links

For a trie node representing string `s`, its failure link points to the node representing the longest proper suffix of `s` that is also a trie prefix.

Example conceptually:

```text
state("hers")
   ↓ failure
state("s")
```

Failure links let the automaton reuse already-computed prefix state.

## 6. Building Failure Links

Failure links are commonly constructed with BFS because a node's failure target depends on shallower states that should already have their failure links established.

Root failure points to root.

Children of root generally fail to root.

## 7. Transition Function

A scanner needs a transition for each input symbol.

There are two common designs:

1. store only trie edges and follow failure links during mismatch
2. materialize completed automaton transitions

The first saves memory; the second can make scanning more direct at the cost of additional storage.

## 8. Output Links

A state can correspond to multiple patterns because a shorter pattern may be a suffix of a longer pattern.

Output links can point to the nearest failure ancestor that is also terminal.

This avoids repeatedly walking the entire failure chain to report suffix patterns.

## 9. Example of Overlapping Matches

Patterns:

```text
he
she
hers
his
```

Text:

```text
ushers
```

The scanner can report overlapping matches such as `she`, `he`, and `hers` according to the pattern positions and output policy.

Never assume matches are non-overlapping unless the API explicitly requires it.

## 10. Correctness Invariant

After consuming text prefix `T[0..i)`, the automaton state represents the longest suffix of that prefix that is also a trie prefix.

This invariant is the key to explaining why failure transitions preserve all possible future matches.

## 11. Scan Algorithm

For each input symbol:

1. follow the transition if available
2. otherwise follow failure links until a valid transition exists or root is reached
3. update the current state
4. emit patterns associated with the resulting state/output links

The scanner does not restart pattern matching from scratch after every mismatch.

## 12. Complexity

Let:

- `N` = total text length
- `S` = total pattern length
- `Z` = number of reported matches

With suitable transition handling, construction is commonly `O(S)` up to alphabet/transition representation costs, and scanning is commonly modeled as `O(N + Z)` for the automaton traversal/output reporting.

Materialized transitions can alter memory complexity significantly.

## 13. Output-Sensitive Complexity

If millions of patterns match the same text region, reporting those matches is itself expensive.

Therefore a useful model is:

```text
search work + output work
```

Any API returning all matches must account for `Z`.

## 14. Dense vs Sparse Transitions

For a small fixed alphabet, arrays can provide direct transitions.

For sparse or large alphabets, maps or compact edge lists may save memory.

The transition representation should follow the actual alphabet and node-degree distribution.

## 15. Unicode and Token Alphabets

The automaton does not inherently require characters. Its alphabet can be:

- UTF-16 code units
- Unicode code points
- normalized characters
- tokens
- bytes
- application symbols

The tokenizer/normalizer is part of the search contract.

## 16. Case-Insensitive Matching

Case-insensitive matching should generally normalize both patterns and text consistently before building/scanning.

Do not mix normalization policies between the two sides.

## 17. Whole-Word Matching

A pattern occurrence may need word-boundary validation.

The automaton finds candidate spans; a boundary predicate can then determine whether a match qualifies as a whole word.

Structural matching and boundary policy should remain separate.

## 18. Pattern Metadata

Terminal nodes may store:

```text
patternId
category
priority
severity
source
```

Large metadata arrays can dominate memory. Integer IDs with external metadata tables can be more compact.

## 19. Match Policies

A system may need:

- all matches
- first match
- earliest ending match
- longest match
- highest-priority match
- non-overlapping matches

The automaton generates candidate matches; the policy determines which candidates to expose.

## 20. Earliest Match

To return the first occurrence, scan until a qualifying output appears.

This can terminate early, unlike exhaustive matching.

The result is exact only with respect to the specified ordering policy.

## 21. Longest Match

At a given start position, multiple patterns can match. Longest-match selection can be implemented by comparing candidate lengths or maintaining appropriate terminal metadata.

Aho–Corasick naturally discovers ending positions; start-position grouping may require additional bookkeeping.

## 22. Non-Overlapping Selection

After finding all candidate matches, interval selection may be required to choose non-overlapping occurrences.

This is a separate optimization problem from pattern detection.

Do not conflate automaton matching with interval scheduling.

## 23. Streaming Text

Aho–Corasick is suitable for streaming because the automaton state can persist across input chunks.

For a chunked stream:

```text
chunk 1 → state
chunk 2 → continue from state
chunk 3 → continue from state
```

Matches crossing chunk boundaries are therefore preserved.

## 24. Streaming State Contract

A streaming matcher should define:

- current automaton state
- absolute offset
- normalization state if applicable
- pending boundary context
- emitted-match policy

If normalization depends on neighboring input, chunk boundaries may require additional state.

## 25. Log and Event Processing

A backend service can scan logs or event streams for many signatures simultaneously.

Examples:

- error signatures
- compliance keywords
- product terms
- event classifications
- routing tokens

The pattern set can be compiled into an immutable automaton and shared across readers.

## 26. Content Filtering

Multi-pattern matching can detect prohibited or sensitive terms efficiently.

However, semantic interpretation, contextual policy, and false-positive handling are separate layers.

Pattern matching should be treated as deterministic candidate detection.

## 27. Backend Applications

Useful backend workloads include:

- log scanning
- API payload keyword detection
- security signature matching
- document indexing
- search preprocessing
- batch ETL classification
- event stream filtering

Set explicit limits on pattern count, pattern length, and output volume.

## 28. AI Applications

Aho–Corasick can support deterministic lexical layers in AI systems:

- entity phrase detection
- terminology extraction
- tool-name detection
- policy keyword scanning
- candidate generation
- document preprocessing

The automaton can reduce a large pattern set to one shared scan before semantic processing.

## 29. AI Entity Candidate Generation

A document can be scanned for thousands of known entity aliases in one pass:

```text
text
 ↓
Aho–Corasick
 ↓
entity mentions
 ↓
normalization / deduplication
 ↓
semantic disambiguation
```

This separates deterministic lexical retrieval from model-based interpretation.

## 30. Automaton Versioning

Pattern sets should be versioned:

```text
patterns v41 → compiled automaton v41
patterns v42 → compiled automaton v42
```

Readers should observe one coherent version rather than a partially updated structure.

## 31. Immutable Publication

A production pipeline can compile a new automaton off the request path, validate it, and publish it atomically.

Old readers can continue using the previous immutable version until their work completes.

## 32. Incremental Pattern Updates

Aho–Corasick is easiest to reason about as a batch-built automaton.

Dynamic insertion of patterns can invalidate failure and output links.

For frequently changing pattern sets, alternatives include:

- periodic rebuilds
- multiple immutable automata
- log-structured pattern indexes
- delta matchers

Choose based on update frequency and read latency requirements.

## 33. Multiple Automata

A system can maintain:

```text
base automaton
+
delta automaton
```

and scan both.

Periodic compaction merges the delta into a new base.

This resembles LSM-style indexing and shifts update complexity away from the hot read path.

## 34. Memory Engineering

Memory can grow through:

- trie nodes
- transition tables
- failure links
- output lists
- pattern metadata

Compact integer IDs and external metadata arrays can reduce object overhead.

## 35. Cache Engineering

During scanning, automaton transitions are highly repetitive.

Packed arrays can improve locality compared with pointer-heavy JavaScript object graphs.

Benchmark realistic alphabets and pattern distributions before selecting a representation.

## 36. Failure-Link Testing

A useful validation strategy is to independently compute expected failure targets for every node and compare them with the compiled automaton.

This catches subtle construction errors that may only appear after several nested suffix relationships.

## 37. Differential Testing

Compare the automaton against a brute-force reference:

```text
for each pattern:
  find all occurrences independently

compare with automaton output
```

Sort or canonicalize matches before comparison if traversal order is not part of the contract.

## 38. Property Testing

Generate random pattern sets and random texts.

Useful properties include:

- every reported match equals a real pattern occurrence
- every expected occurrence is reported in exact mode
- changing unrelated patterns does not alter existing match positions
- streaming and whole-text scans produce equivalent results

## 39. Adversarial Workloads

Test:

- many shared prefixes
- many suffix relationships
- repetitive text
- one-character alphabet
- thousands of overlapping patterns
- very long patterns
- empty-pattern policy
- huge output volume

These expose memory, output, and failure-link performance issues.

## 40. Security and Resource Limits

Untrusted pattern sets can cause memory exhaustion.

Untrusted text can cause massive output if many patterns match repeatedly.

Guardrails should include:

- maximum pattern count
- maximum total pattern bytes
- maximum pattern length
- maximum output matches
- maximum scan time
- cancellation/deadline support

## 41. Interview Framework

For a multi-pattern matching problem:

1. Define the pattern and alphabet model.
2. Build the trie.
3. Derive failure links with BFS.
4. Add output/failure-output relationships.
5. Explain the scanning invariant.
6. Derive construction and scanning complexity.
7. Account for output size.
8. Discuss sparse vs dense transitions.
9. Add streaming and versioning if required.
10. Validate against brute force.

## 42. Revision Checklist

- [ ] Build a trie for multiple patterns.
- [ ] Construct failure links with BFS.
- [ ] Implement automaton scanning.
- [ ] Implement output links.
- [ ] Handle overlapping matches.
- [ ] Handle duplicate patterns.
- [ ] Implement streaming chunk processing.
- [ ] Compare sparse and dense transitions.
- [ ] Add Unicode/token normalization.
- [ ] Build a brute-force differential tester.
- [ ] Analyze output-sensitive complexity.
- [ ] Design immutable automaton publication.
- [ ] Design an AI entity-matching pipeline.

## Key Takeaways

1. Aho–Corasick extends a trie with failure links for efficient multi-pattern matching.
2. Failure links preserve the longest compatible suffix-prefix state after mismatches.
3. Output handling is essential because one state can represent multiple matching patterns.
4. Exact complexity must include the number of reported matches.
5. Sparse/dense transition representation is a major memory-performance decision.
6. Streaming works naturally by preserving automaton state across chunks.
7. Immutable versioned automata are well suited to read-heavy backend and AI lexical workloads.
