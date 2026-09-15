# 03.17 — Anagrams & Normalization

## Definition

Two strings are **anagrams** when they contain the same symbols with the same multiplicities, under a clearly defined equality and normalization contract.

Example:

```text
"listen" ↔ "silent"
```

The central abstraction is the **multiset of symbols**.

```text
sequence order      → ignored
symbol multiplicity  → preserved
```

Normalization determines what counts as the same symbol before the multiset is compared.

---

# 1. Why Anagrams Matter

Anagram problems teach:

- frequency counting;
- multiset reasoning;
- fixed-domain optimization;
- hashing with `Map`;
- sorting as canonicalization;
- normalization as part of correctness;
- one-pass state design;
- time-space trade-offs.

The same concepts appear in deduplication, grouping, indexing, caching, and AI token analysis.

---

# 2. Multiset Mental Model

For:

```text
"aabbc"
```

the multiset is:

```text
a → 2
b → 2
c → 1
```

Anagrams have equal multisets.

This immediately suggests two main approaches:

```text
frequency representation
or
canonical sorted representation
```

---

# 3. Length Is a Necessary Condition

For exact anagrams:

```text
length(a) !== length(b) → not anagrams
```

This is an inexpensive early rejection.

It is necessary but not sufficient.

```text
"ab" and "ac"
```

have equal lengths but are not anagrams.

Always exploit cheap necessary conditions before expensive work.

---

# 4. Frequency-Map Method

General solution:

```js
const freq = new Map();

for (const ch of a) {
  freq.set(ch, (freq.get(ch) ?? 0) + 1);
}

for (const ch of b) {
  const count = freq.get(ch) ?? 0;
  if (count === 0) return false;
  freq.set(ch, count - 1);
}
```

After processing `b`, every count must be zero.

Expected complexity:

```text
O(N + M) time
O(U) space
```

where `U` is the number of distinct symbols.

---

# 5. Frequency-Difference Invariant

For a two-string difference map:

```text
count[x] = occurrences of x in processed prefix of a
           - occurrences of x in processed prefix of b
```

At the end:

```text
count[x] = 0 for every x
```

exactly when the multisets are equal.

This invariant is the core correctness argument.

---

# 6. Fixed Alphabet Optimization

If the input is guaranteed to contain only lowercase English letters:

```js
const freq = new Array(26).fill(0);
```

Then frequency comparison can use fixed indexing.

Complexity:

```text
O(N + M) time
O(26) space = O(1)
```

under the fixed-alphabet assumption.

This is usually faster and more memory-predictable than a general-purpose `Map`.

---

# 7. Sorting Method

Another approach is:

```text
sort(a)
sort(b)
compare
```

For lengths `N` and `M` where `N = M`:

```text
O(N log N)
```

Typical auxiliary complexity depends on the sorting implementation and representation.

Sorting is often simpler to explain but asymptotically inferior to frequency counting when the alphabet can be represented efficiently.

---

# 8. Canonical Representation

Sorting creates a canonical form.

For example:

```text
"eat"  → "aet"
"tea"  → "aet"
"ate"  → "aet"
```

Equal canonical representations imply equal symbol multisets.

Canonicalization is a broad algorithmic technique:

> Transform equivalent objects into a common representation so equality becomes easy to test.

---

# 9. Grouping Anagrams

Given many strings, group those with the same character multiset.

Sorting approach:

```text
key = sorted string
```

Then:

```text
Map<key, list of strings>
```

If there are `Q` strings of average length `L`, sorting each can cost approximately:

```text
O(Q · L log L)
```

Frequency-vector keys can reduce per-string sorting when the alphabet is fixed.

---

# 10. Frequency Vector as a Key

For lowercase English letters:

```text
[0,1,0,0,2,...]
```

represents the multiset.

A serialization of this vector can serve as a grouping key.

The representation must be unambiguous.

For example, careless concatenation can create collisions between different vectors.

Canonical representations must preserve equality exactly.

---

# 11. Anagram Substring Search

A more advanced problem asks:

> Find every substring of text that is an anagram of a given pattern.

Let pattern length be `M`.

Maintain a frequency state for the current window of length `M`.

At each shift:

```text
add entering symbol
remove leaving symbol
compare frequency state
```

This combines:

```text
frequency counting + fixed-size sliding window
```

and can achieve linear-time scanning under a fixed alphabet.

---

# 12. Why Rebuilding Frequencies Is Wasteful

A naive substring-anagram solution might rebuild a frequency map for every window.

There are `O(N)` windows and each has `O(M)` symbols.

That can become:

```text
O(NM)
```

A sliding frequency state reuses almost all information between adjacent windows.

This is the same optimization principle seen throughout DSA:

> **Reuse incremental state instead of recomputing overlapping work.**

---

# 13. Comparing Frequency States Efficiently

Comparing every alphabet count at every window costs:

```text
O(K)
```

per window.

If `K` is fixed, this is still linear overall.

For a dynamic alphabet, you can maintain a mismatch counter representing how many symbol counts currently differ from the target.

Then a window can be tested in `O(1)` expected update time.

This is a useful state-compression technique.

---

# 14. Normalization

Normalization transforms input into the equivalence class required by the problem.

Possible rules include:

```text
case folding
whitespace removal
punctuation removal
Unicode normalization
accent handling
custom character mapping
```

Never treat normalization as universally correct.

It changes the equality relation.

---

# 15. Normalize Before Algorithm

The simplest design is:

```text
input
 ↓
normalize
 ↓
anagram algorithm
```

Advantages:

- simple logic;
- easy testing;
- clear separation of concerns.

Potential costs:

- extra memory;
- extra traversal;
- allocation;
- loss of original positions unless retained separately.

---

# 16. Normalize During Traversal

An alternative is to normalize each symbol as it is processed.

Conceptually:

```text
for each input symbol:
    normalized = normalize(symbol)
    update frequency(normalized)
```

This can avoid materializing a second complete string.

But the normalization function itself may be non-trivial.

Complexity must include normalization cost.

---

# 17. Case-Insensitive Anagrams

For a simple ASCII contract:

```text
"Listen" ↔ "Silent"
```

can be compared after case normalization.

For arbitrary Unicode, case mapping is not equivalent to simply assuming every visible letter has one lowercase counterpart.

Production systems should define Unicode-aware behavior explicitly.

---

# 18. Whitespace and Punctuation

If the contract says to ignore whitespace and punctuation:

```text
"conversation"
```

may be compared against text containing separators.

But the algorithm must specify exactly which characters are ignored.

Avoid vague rules such as “ignore special characters” without defining the set.

---

# 19. Unicode Normalization

Unicode permits text with visually equivalent representations that have different underlying code-point sequences.

Common normalization forms include:

```text
NFC
NFD
NFKC
NFKD
```

These forms have different semantics.

Do not apply compatibility normalization automatically when exact textual identity matters.

For JavaScript:

```js
s.normalize("NFC")
```

can explicitly select a normalization form.

---

# 20. Canonical vs Compatibility Normalization

### Canonical normalization

Targets equivalent representations of the same abstract text.

### Compatibility normalization

Can additionally collapse compatibility distinctions.

Therefore normalization is not merely formatting; it defines an equivalence policy.

For security-sensitive identifiers, normalization and canonicalization rules should be designed deliberately.

---

# 21. Anagram vs Permutation

An anagram describes equal symbol multiplicities.

A permutation is an ordering of elements.

The relationship is:

```text
all permutations of a sequence are anagrams
```

but anagram problems usually do not require generating permutations.

Generating all permutations is factorial/exponential work and is unnecessary when only multiset equality is needed.

---

# 22. Anagram vs Subsequence

Anagram:

```text
order irrelevant
counts matter
```

Subsequence:

```text
order matters
contiguity not required
```

Substring:

```text
order matters
contiguity required
```

These three concepts should never be conflated.

---

# 23. Frequency State Design

Ask what the final decision requires.

Possible states:

```text
Set                 → existence
Map                 → arbitrary counts
fixed array         → bounded counts
mismatch counter    → whether all counts currently agree
count + position   → frequency plus tie-breaking
```

Choosing the smallest sufficient state often improves both clarity and performance.

---

# 24. Early Rejection

Useful checks include:

1. lengths differ;
2. normalized lengths differ;
3. a required symbol count becomes negative;
4. a symbol cannot belong to the permitted alphabet.

Early rejection can substantially reduce practical work while preserving the same worst-case asymptotic complexity.

---

# 25. Multiple-Query Anagram Workloads

Suppose one long text must be searched against many patterns.

Possible strategies differ depending on:

- number of patterns;
- pattern lengths;
- alphabet size;
- repeated patterns;
- whether all occurrences are required;
- memory budget.

For repeated identical patterns, cache their normalized representation or frequency state.

For many patterns, a trie or multi-pattern technique may be more appropriate than independently scanning the text for every pattern.

---

# 26. Complexity Summary

Let:

```text
N = length of first string
M = length of second string
U = distinct symbols
K = fixed alphabet size
Q = number of strings/queries
```

| Strategy | Typical Time | Space |
|---|---:|---:|
| Frequency map | `O(N+M)` expected | `O(U)` |
| Fixed frequency array | `O(N+M)` | `O(K)` |
| Sorting | `O(N log N)` for equal lengths | implementation-dependent |
| Sliding-window anagram search | `O(N)` for fixed alphabet | `O(K)` |
| Grouping by sorting keys | `O(Q·L log L)` | `O(Q·L)` output/key storage |
| Grouping by frequency keys | roughly `O(Q·L)` under fixed alphabet | output/key storage dependent |

Always include normalization and output costs when they apply.

---

# Backend Applications

### User/Identifier Canonicalization

Normalize according to explicit business rules before equality or grouping.

### Log Classification

Normalize event strings before frequency analysis.

### Deduplication

Canonical representations can group equivalent records.

### Search

Anagram-window techniques can support specialized lexical matching.

### Security

Canonicalization mistakes can produce inconsistent authorization, identity, or routing behavior. Equality rules must be explicit and consistently applied.

---

# AI Applications

### Vocabulary Statistics

Frequency vectors can represent token distributions.

### Data Deduplication

Canonical normalized text can help identify equivalent examples, provided the normalization policy is appropriate.

### Retrieval

Lexical matching can use normalized terms and frequency information.

### Token Windows

Anagram-style window reasoning transfers directly to fixed-length token sequences.

### Evaluation

Exact equality, normalized equality, and semantic similarity answer different questions and should not be substituted for one another.

---

# Common Mistakes

1. Checking only string lengths.
2. Sorting when a bounded frequency array would be simpler and faster.
3. Forgetting multiplicity.
4. Treating anagrams as subsequences.
5. Rebuilding frequency maps for every sliding window.
6. Using ambiguous serialized frequency keys.
7. Applying lowercase conversion without defining the character model.
8. Assuming Unicode normalization is unnecessary.
9. Treating normalization as free.
10. Losing original positions when normalization is required.
11. Calling `Map` performance worst-case `O(1)` without qualification.
12. Forgetting output/key-storage costs in grouping problems.

---

# Interview Framework

1. Define what counts as the same symbol.
2. Decide whether normalization is required.
3. Check lengths first.
4. Choose fixed frequency array vs `Map` based on alphabet constraints.
5. State the frequency invariant.
6. Decide whether one or two passes are needed.
7. For many windows, reuse frequency state.
8. For grouping, choose sorting-key vs frequency-key representation.
9. Define tie-breaking and canonicalization rules.
10. State complete time, space, and allocation complexity.

---

# Revision Checklist

- [ ] I can define anagrams as multiset equality.
- [ ] I can use a frequency `Map`.
- [ ] I can use a fixed frequency array.
- [ ] I understand frequency-difference invariants.
- [ ] I can compare frequency counting with sorting.
- [ ] I can group anagrams conceptually.
- [ ] I understand canonical representations.
- [ ] I can solve anagram substring search with a sliding window.
- [ ] I understand mismatch-counter optimization.
- [ ] I understand normalization as an equality policy.
- [ ] I know NFC/NFD/NFKC/NFKD conceptually.
- [ ] I distinguish canonical from compatibility normalization.
- [ ] I understand ASCII vs Unicode assumptions.
- [ ] I can reason about multiple-query workloads.
- [ ] I can connect anagram/frequency techniques to backend and AI workloads.

## Key Takeaways

1. Anagrams are fundamentally **multiset equality** problems.
2. Frequency counting is usually the strongest approach when the symbol domain permits it.
3. Sorting provides a simple canonical representation but often costs more.
4. Sliding-window frequency turns anagram matching into an incremental-state problem.
5. Normalization changes the equality relation and must be part of the explicit contract.
6. Unicode normalization is different from simple lowercasing.
7. The smallest sufficient state—counts, sets, positions, or mismatch counters—often determines the best solution.
8. Canonicalization, frequency vectors, and sliding windows are broadly useful beyond interview puzzles.
