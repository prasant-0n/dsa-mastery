# 03.14 — String Traversal & Character Frequency

## Definition

String traversal means processing the symbols of a string in a controlled order. Character-frequency analysis records how often symbols occur.

Together they form one of the most reusable string foundations:

```text
traverse → maintain state → answer a property
```

The state may be:

- a fixed frequency array;
- a `Map`;
- a `Set`;
- a running count;
- first/last occurrence positions;
- multiple counters;
- a sliding-window frequency structure.

---

# 1. Why This Matters

A large class of string problems is solved without advanced string algorithms.

Examples:

- first unique character;
- duplicate detection;
- anagram testing;
- character histogram;
- longest substring with constraints;
- frequency-based grouping;
- counting symbols in a stream;
- tracking the most frequent character.

The fundamental skill is learning to convert a verbal property into a small amount of maintained state.

---

# 2. Traversal Models

### Index traversal

```js
for (let i = 0; i < s.length; i++) {
  const ch = s[i];
}
```

Best when the algorithm needs indexes or ASCII-style input.

### Code-point traversal

```js
for (const ch of s) {
  // ch is a Unicode code point sequence element
}
```

Useful when processing Unicode code points.

The correct traversal depends on the problem's character model.

---

# 3. Character Model First

Before writing a frequency algorithm, determine whether the input is:

```text
lowercase English letters
ASCII
extended single-byte domain
Unicode code points
tokens
```

This determines both implementation and complexity.

For a fixed alphabet of size `K`:

```text
space = O(K)
```

If `K` is constant, this is conventionally `O(1)` auxiliary space.

For a dynamic alphabet with `U` distinct symbols:

```text
space = O(U)
```

---

# 4. Frequency Array

For lowercase `a-z`:

```js
const freq = new Array(26).fill(0);

for (const ch of s) {
  const index = ch.charCodeAt(0) - 97;
  freq[index]++;
}
```

Advantages:

- predictable memory;
- fast indexing;
- no hashing overhead;
- simple invariant.

Constraint:

> Every possible character must map safely into the allocated domain.

---

# 5. Frequency Map

For arbitrary symbols:

```js
const freq = new Map();

for (const ch of s) {
  freq.set(ch, (freq.get(ch) ?? 0) + 1);
}
```

Typical expected complexity:

```text
O(N) time
O(U) space
```

where `U` is the number of distinct symbols.

Map-based solutions are usually more general than fixed arrays.

---

# 6. Frequency Invariant

After processing the first `i` symbols:

> The frequency structure contains exactly the number of occurrences of every tracked symbol within the processed prefix `s[0..i-1]`.

Each iteration preserves this invariant by incrementing exactly one symbol's count.

At termination, the state describes the entire string.

This is a simple but important proof pattern.

---

# 7. Counting a Target Character

For one target character:

```text
count occurrences of c
```

requires one traversal:

```text
O(N) time
O(1) extra space
```

No frequency table is necessary if only one symbol matters.

This illustrates a general rule:

> Maintain only the state required by the query.

---

# 8. Multiple Character Counts

If many symbols must be counted, a frequency table is more efficient than repeatedly scanning.

Bad repeated strategy:

```text
for every possible character:
    scan entire string
```

For alphabet size `K`:

```text
O(NK)
```

A single frequency pass is:

```text
O(N + K)
```

with `O(K)` storage.

For fixed `K`, this becomes linear in `N`.

---

# 9. Distinct Character Count

A `Set` directly models distinctness:

```js
const seen = new Set();

for (const ch of s) {
  seen.add(ch);
}
```

At the end:

```js
seen.size
```

gives the number of distinct symbols.

Alternatively, a frequency map can provide both distinctness and counts.

Choose the representation based on future operations.

---

# 10. Duplicate Detection

If the goal is only:

> Does any character repeat?

you do not need full frequencies.

Maintain a `Set` and stop when a character is already present.

Expected complexity:

```text
O(N) time
O(U) space
```

with possible early termination.

This is an example of **minimal sufficient state**.

---

# 11. First Unique Character

A common two-pass pattern:

### Pass 1

Build frequencies.

### Pass 2

Traverse from left to right and return the first character with frequency `1`.

Why two passes?

During the first pass, you do not yet know whether a character appearing early will appear again later.

Complexity:

```text
O(N) time
O(U) space
```

This is a good example of separating **measurement** from **decision**.

---

# 12. First Repeating Character

You can solve this online with a `Set`:

```text
if seen → answer
else add
```

Unlike first unique character, the decision can be made at the first repeated occurrence.

This distinction is useful:

- first repeating → one pass;
- first unique → generally requires knowing final frequencies.

---

# 13. Anagram Detection

Two strings are anagrams if they have identical character multisets.

For a fixed alphabet:

1. count first string;
2. subtract counts for second string;
3. ensure all counts return to zero.

Complexity:

```text
O(N + M)
```

and `O(K)` space.

You can also use a single counter structure if the strings have equal length.

---

# 14. Incremental Frequency Comparison

Instead of storing two complete maps:

```text
freq[a] += 1
freq[b] -= 1
```

Then verify every count is zero.

This reduces duplicated state.

The invariant is:

> The counter for each symbol equals its frequency in the processed prefix of `a` minus its frequency in the processed prefix of `b`.

At the end, all zero counts imply equal multisets.

---

# 15. Most Frequent Character

Build frequencies, then scan the frequency structure to find the maximum.

Be precise about tie-breaking.

Possible contracts:

- first character encountered;
- lexicographically smallest;
- earliest original position;
- arbitrary maximum.

The frequency values alone may not contain enough information to resolve every tie rule.

---

# 16. Frequency + Original Position

Sometimes the algorithm needs both:

```text
frequency
first occurrence
```

Maintain records such as:

```js
{
  count: 0,
  firstIndex: -1
}
```

This demonstrates an important principle:

> Data structures should represent the complete decision state, not just the most obvious statistic.

---

# 17. Frequency + Threshold

Problems may ask:

- characters occurring at least `K` times;
- characters occurring exactly twice;
- symbols occurring once;
- characters exceeding a percentage.

Frequency counting turns these into simple post-processing decisions.

For fixed alphabet:

```text
O(N + K)
```

For dynamic symbols:

```text
O(N + U)
```

---

# 18. Frequency and Sliding Windows

Global frequency:

```text
count entire string
```

Window frequency:

```text
add right character
remove left character
```

The same frequency representation becomes dynamic.

For example, to maintain character counts inside a window:

```js
freq.set(s[right], (freq.get(s[right]) ?? 0) + 1);

freq.set(s[left], freq.get(s[left]) - 1);
```

This becomes fundamental in the next stages of string pattern recognition.

---

# 19. Fixed-Size Window Frequency

For a window of length `W`:

1. build the initial frequency state;
2. slide one position;
3. add entering symbol;
4. remove leaving symbol;
5. inspect the updated state.

After initialization, each shift can be `O(1)` expected work for a hash map operation or `O(1)` array updates.

Thus many fixed-window frequency problems are:

```text
O(N)
```

rather than `O(NW)`.

---

# 20. Variable-Size Window Frequency

For constraints such as:

> longest substring containing at most `K` distinct characters

maintain:

```text
left
right
frequency state
number of distinct symbols
```

Expand `right`, and shrink `left` while the constraint is violated.

This works when the validity condition has the required monotonic behavior under shrinking/expanding.

Do not blindly apply sliding windows to problems involving negative values or non-monotone conditions.

---

# 21. Character Frequency vs Token Frequency

The same abstraction works for token sequences:

```text
string characters → tokens
```

Instead of:

```js
Map<char, count>
```

you may have:

```text
Map<tokenId, count>
```

This makes frequency reasoning directly relevant to AI preprocessing and sequence analysis.

---

# 22. Frequency Sorting

If the task asks to order symbols by frequency:

1. count frequencies;
2. convert frequency records to an array;
3. sort using the required tie-breaking rule.

Complexity can be:

```text
O(N + U log U)
```

where `U` is the number of distinct symbols.

If the frequency range is bounded, bucket-based methods may improve this.

---

# 23. Frequency Buckets

Frequencies lie between `1` and `N`.

You can create buckets indexed by frequency:

```text
bucket[count] = symbols with this count
```

This can support frequency-order queries without sorting all distinct symbols.

The exact complexity depends on the output and bucket representation.

This is an important example of exploiting a bounded derived domain.

---

# 24. Streaming Frequency

A string may arrive as a stream rather than one complete in-memory object.

You can maintain frequency state incrementally:

```text
receive symbol
update count
continue
```

Memory depends on the number of tracked symbols rather than the total stream length when the required statistic is sufficient to summarize history.

This is a key streaming principle:

> Store a compact summary instead of materializing the entire input.

---

# 25. Frequency Under Normalization

If the contract says case-insensitive comparison:

```text
normalize → count
```

If Unicode normalization is required:

```text
normalize according to the specified form → count
```

Do not assume that visual equality implies code-point equality.

Normalization itself has a computational and semantic cost.

---

# 26. Frequency Array Pitfalls

A fixed array is not automatically correct.

Check:

- character domain;
- index mapping;
- negative/out-of-range indexes;
- uppercase/lowercase rules;
- Unicode behavior;
- memory size.

For example, using `charCodeAt(0) - 97` on arbitrary Unicode input is invalid as a general solution.

---

# 27. Complexity Model

Let:

```text
N = string length under the chosen character model
U = distinct symbols
K = fixed alphabet size
W = window size
Q = number of queries
```

Typical costs:

| Task | Time | Space |
|---|---:|---:|
| Count one character | `O(N)` | `O(1)` |
| Fixed-alphabet frequency | `O(N)` | `O(K)` |
| General frequency map | `O(N)` expected | `O(U)` |
| Duplicate detection | `O(N)` expected | `O(U)` |
| First unique | `O(N)` | `O(U)` |
| Anagram comparison | `O(N+M)` | `O(U)` / `O(K)` |
| Frequency sorting | `O(N + U log U)` | `O(U)` |
| Fixed-window frequency | `O(N)` | `O(K)` / `O(U)` |

---

# Backend Applications

### Request Validation

Frequency and traversal can enforce allowed-character policies and detect malformed input.

### Log Analysis

Count event types, error codes, or categorical tokens in streams.

### Rate-Limit Keys

Normalize and count request attributes before applying policy logic.

### Search / Filtering

Character/token frequency can support lightweight ranking and filtering.

### Streaming Services

Maintain compact frequency summaries without retaining the complete event stream.

Production systems must additionally consider normalization, encoding, memory growth, malformed input, and adversarially large symbol domains.

---

# AI Applications

### Token Statistics

Count token IDs or token classes across datasets.

### Dataset Analysis

Measure vocabulary usage, rare tokens, dominant tokens, and distribution changes.

### Text Preprocessing

Normalization and frequency analysis can support filtering and vocabulary construction.

### Retrieval

Lexical retrieval systems can use term-frequency statistics as part of ranking.

### Streaming Evaluation

Maintain online counts for labels, token classes, or error categories without retaining every observation.

---

# Common Mistakes

1. Using a 26-element array for non-lowercase input.
2. Forgetting whether case matters.
3. Confusing code units with code points.
4. Treating `Map` complexity as an unconditional worst-case guarantee.
5. Storing more state than the query requires.
6. Using one pass for first-unique without enough information.
7. Forgetting tie-breaking rules.
8. Rebuilding frequency counts for every window.
9. Applying sliding windows without proving the validity condition is suitable.
10. Ignoring normalization costs.
11. Forgetting output size in frequency-grouping problems.
12. Allowing unbounded symbol state in a long-running stream without a retention policy.

---

# Interview Framework

1. What exactly is a symbol?
2. Is the alphabet fixed or dynamic?
3. Do I need counts, existence, first position, or all of them?
4. Can a `Set` solve the problem with less state?
5. Can one pass answer the question, or do I need two passes?
6. Is the frequency state global or window-specific?
7. Does the window condition have the required monotonic behavior?
8. What is the tie-breaking rule?
9. What are the Unicode/normalization assumptions?
10. What are the complete time, auxiliary-space, and allocation costs?

---

# Revision Checklist

- [ ] I can traverse a string correctly.
- [ ] I understand index vs code-point traversal.
- [ ] I can build fixed-alphabet frequency arrays.
- [ ] I can build general frequency maps.
- [ ] I can detect duplicates.
- [ ] I can find the first unique character.
- [ ] I can find the first repeating character.
- [ ] I can test anagrams with frequency differences.
- [ ] I can maintain first-position information.
- [ ] I can solve threshold-frequency problems.
- [ ] I understand global vs window frequency.
- [ ] I understand fixed-size window frequency.
- [ ] I understand variable-size window prerequisites.
- [ ] I can reason about frequency sorting/buckets.
- [ ] I understand streaming frequency summaries.
- [ ] I can analyze `N`, `U`, `K`, and `W` correctly.
- [ ] I understand Unicode and normalization caveats.
- [ ] I can connect frequency analysis to backend streams.
- [ ] I can connect it to AI/token statistics.

## Key Takeaways

1. Most basic string problems can be reduced to **traversal + minimal state**.
2. Fixed frequency arrays are excellent when the alphabet is known and bounded.
3. `Map` and `Set` are better when the symbol domain is dynamic.
4. First unique and first repeating characters demonstrate different information requirements.
5. Frequency state becomes even more powerful when combined with sliding windows.
6. Always define the character model before claiming complexity.
7. Tie-breaking, normalization, Unicode semantics, and output requirements are part of correctness.
8. Frequency counting is not just a DSA trick; it is a reusable abstraction for backend streams and AI/token pipelines.
