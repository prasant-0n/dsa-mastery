# 03.13 — Strings Fundamentals

## Definition

A **string** is an ordered sequence of characters. In JavaScript, strings are immutable primitive values.

For DSA, treat a string as a sequence with:

- positions/indexes;
- length;
- character access;
- traversal;
- equality and comparison;
- substring/subsequence relationships;
- transformations.

The key mental model is:

> **A string problem is usually a sequence problem with additional representation and encoding concerns.**

---

# 1. Why Strings Matter

Strings appear everywhere in software engineering:

- usernames and identifiers;
- URLs and routes;
- logs;
- search queries;
- configuration;
- source code;
- tokens;
- natural-language text;
- database keys;
- protocol messages.

In DSA, strings introduce important ideas around traversal, frequency counting, matching, normalization, hashing, dynamic programming, and pattern recognition.

---

# 2. JavaScript String Basics

```js
const s = "backend";

console.log(s.length);
console.log(s[0]);
console.log(s[s.length - 1]);
```

Important properties:

- zero-based indexing;
- `.length` gives the number of UTF-16 code units;
- strings are immutable;
- methods such as `slice()` create new strings.

---

# 3. Strings Are Immutable

This does not modify the original string:

```js
const s = "cat";
const t = s.toUpperCase();
```

Likewise:

```js
s[0] = "b";
```

does not perform normal mutable array-style replacement.

To transform a string, construct another string or convert it to a mutable representation such as an array of characters.

---

# 4. Character Access

Common access forms:

```js
s[i]
s.at(i)
```

`at()` can also access from the end:

```js
s.at(-1)
```

For DSA, direct indexed access should be reasoned about under JavaScript's string representation and operation semantics rather than assuming every Unicode concept is one array element.

---

# 5. Traversal

Basic traversal:

```js
for (let i = 0; i < s.length; i++) {
  // process s[i]
}
```

Value-oriented traversal:

```js
for (const ch of s) {
  // process code points
}
```

These are not identical for all Unicode text.

For ordinary ASCII interview problems, index-based traversal is usually sufficient. For real international text, encoding semantics matter.

---

# 6. String Length and Unicode

A critical JavaScript detail:

```js
"😀".length
```

is `2`, because JavaScript strings are based on UTF-16 code units.

But:

```js
[..."😀"].length
```

is `1`, because the spread operation iterates Unicode code points.

Therefore distinguish:

```text
code unit count
vs
code point count
vs
user-perceived character count (grapheme clusters)
```

Do not use `.length` as “number of visible characters” for arbitrary Unicode text.

---

# 7. Equality

For primitive strings:

```js
"abc" === "abc"
```

is true.

For DSA, equality usually means exact sequence equality unless the problem explicitly defines normalization or case-insensitive comparison.

Do not silently normalize input unless the contract requires it.

---

# 8. Lexicographic Ordering

Strings can be compared according to a lexicographic order.

Conceptually:

```text
compare first differing position
```

For algorithm problems, lexicographic ordering is useful in:

- sorting strings;
- dictionary-order problems;
- prefix relationships;
- trie construction;
- greedy string algorithms.

Be careful: JavaScript string comparison follows its language-defined string ordering semantics and is not automatically equivalent to locale-aware human alphabetical order.

---

# 9. Substring vs Subsequence

### Substring

Characters must be contiguous.

```text
"abc" in "xxabczz"
```

### Subsequence

Characters only need to preserve order.

```text
"ace" is a subsequence of "abcde"
```

but not a substring.

This distinction drives many different algorithms.

---

# 10. Prefix and Suffix

For:

```text
"backend"
```

prefixes include:

```text
"b"
"ba"
"bac"
...
```

suffixes include:

```text
"d"
"nd"
"end"
...
```

Prefixes are fundamental to:

- tries;
- prefix matching;
- autocomplete;
- string search;
- prefix hashes.

Suffixes appear in:

- suffix-based matching;
- suffix arrays/trees;
- substring reasoning.

---

# 11. Slice vs Substring

JavaScript provides several string extraction APIs.

For DSA, `slice()` is often the clearest:

```js
const part = s.slice(left, right);
```

The end boundary is exclusive.

Example:

```js
"abcdef".slice(1, 4); // "bcd"
```

Creating many substrings inside nested loops can create substantial runtime and allocation costs. Sometimes index-based reasoning avoids this.

---

# 12. Avoid Unnecessary String Allocation

Suppose you repeatedly construct substrings:

```js
for (...) {
  const part = s.slice(i, j);
}
```

The algorithm may have more allocation work than its simple loop structure suggests.

For performance-sensitive algorithms, prefer:

```text
indices + comparisons
```

over materializing every intermediate string when possible.

This matters particularly in nested loops and large inputs.

---

# 13. Converting String ↔ Array

```js
const chars = [...s];
```

can provide a mutable sequence representation.

Then:

```js
chars.reverse();
```

and reconstruct:

```js
const result = chars.join("");
```

But conversion costs time and memory.

For ASCII-only algorithms, many solutions can operate directly on indexes without creating a character array.

---

# 14. Building Strings Efficiently

Repeated concatenation:

```js
let result = "";
for (...) {
  result += piece;
}
```

is common and often practical in JavaScript, but performance depends on runtime behavior and workload.

For large collections of pieces, an array plus `join()` can make the intended accumulation structure explicit:

```js
const parts = [];
parts.push(piece);
const result = parts.join("");
```

For complexity analysis, count the total amount of output produced rather than blindly labeling every concatenation pattern `O(1)`.

---

# 15. Character Frequency

A foundational string technique is frequency counting.

For lowercase English letters:

```js
const freq = new Array(26).fill(0);
```

Map a character to an index and increment.

Complexity:

```text
O(N) time
O(1) auxiliary space
```

when the alphabet is fixed and bounded.

For arbitrary characters, a `Map` may be more appropriate.

---

# 16. Fixed Alphabet vs General Alphabet

A fixed frequency array is attractive when:

```text
alphabet size = constant K
```

Then space is:

```text
O(K) = O(1)
```

For arbitrary Unicode or large dynamic domains:

```text
Map<character, count>
```

may require up to `O(U)` space, where `U` is the number of distinct symbols encountered.

Never call frequency-array space `O(1)` without stating the fixed-alphabet assumption.

---

# 17. Case Sensitivity

These are different strings:

```text
"Node"
"node"
```

If a problem is case-insensitive, normalize explicitly:

```js
s.toLowerCase()
```

But normalization can create a new string and may have language/locale implications.

For interview problems, follow the stated contract rather than inventing normalization rules.

---

# 18. Whitespace and Normalization

Real text may contain:

- leading/trailing whitespace;
- repeated spaces;
- tabs;
- line breaks;
- different Unicode normalization forms.

For example, visually equivalent text can have different underlying Unicode sequences.

A production text-processing system may need explicit normalization rules.

A DSA problem may intentionally avoid these concerns. Keep the algorithm's contract precise.

---

# 19. String Reversal

Conceptually:

```text
"abcd" → "dcba"
```

For ASCII-like character sequences:

1. convert to array;
2. reverse;
3. join.

Or use two pointers on a mutable character representation.

For arbitrary Unicode user-perceived characters, naive reversal can produce incorrect visual text because code points do not necessarily correspond to grapheme clusters.

---

# 20. Palindrome Foundation

A palindrome reads the same forward and backward.

Two-pointer strategy:

```text
left = 0
right = n - 1
```

Compare:

```text
s[left] === s[right]
```

then move inward.

For a simple exact string contract:

```text
O(N) time
O(1) extra algorithmic space
```

when direct indexing is sufficient.

---

# 21. Anagram Foundation

Two strings are anagrams when they contain the same character multiset.

Possible strategies:

### Frequency counting

```text
O(N)
```

under a fixed alphabet.

### Sorting

```text
O(N log N)
```

for each string, followed by equality comparison.

The frequency approach is generally preferable when its domain assumptions hold.

---

# 22. String Comparison Without Materializing Substrings

Many problems ask whether a range has some property.

Instead of repeatedly creating:

```js
s.slice(i, j)
```

consider comparing indices or maintaining incremental state.

This is a recurring algorithmic principle:

> **Represent the property you need rather than repeatedly constructing the object that contains it.**

---

# 23. String Algorithms Preview

Later chapters will build toward:

- character frequency;
- anagrams;
- palindrome algorithms;
- substring search;
- prefix-function/KMP;
- rolling hash;
- tries;
- suffix-based techniques;
- dynamic programming on strings;
- subsequence algorithms.

The goal here is to establish the representation and cost model first.

---

# 24. Backend Applications

### Validation

Identifiers, emails, URLs, and structured text often require linear scans.

### Parsing

Request paths, headers, logs, and configuration data are strings that can be processed with state machines.

### Search

Prefix checks and substring matching appear in filtering and routing.

### Keys

String keys are common in caches, Maps, databases, and distributed systems.

### Security

Normalization and exact comparison rules matter for authentication, authorization, routing, and input validation.

Avoid security-sensitive assumptions based solely on simple string comparison when canonicalization or Unicode equivalence is relevant.

---

# AI Applications

### Tokens

AI systems frequently represent text as token sequences rather than raw characters. Many array/string ideas transfer directly to token IDs.

### Preprocessing

Normalization, filtering, grouping, and sequence-length analysis are common preprocessing tasks.

### Retrieval

Prefix and substring matching can support lexical retrieval and filtering.

### Prompt Processing

String/token transformations can affect context length, escaping, and downstream semantics.

### Evaluation

Exact string comparison, normalized comparison, edit-based metrics, and token-level metrics answer different questions. The metric must match the intended notion of correctness.

---

# Complexity Checklist

When analyzing a string algorithm, identify:

```text
N = number of code units / characters / tokens under the problem's model
K = alphabet size when bounded
U = distinct symbols
M = second-string length
Q = number of queries
```

Then ask:

1. Are characters scanned once or repeatedly?
2. Are substrings materialized?
3. Is a frequency structure used?
4. Is sorting involved?
5. Is output construction included?
6. Does Unicode representation change the model?

---

# Common Mistakes

1. Treating JavaScript strings as mutable arrays.
2. Forgetting UTF-16 semantics.
3. Confusing code units, code points, and grapheme clusters.
4. Assuming `.length` means visible characters.
5. Confusing substring and subsequence.
6. Creating unnecessary substrings in nested loops.
7. Calling frequency-array space `O(1)` without a bounded alphabet assumption.
8. Forgetting case/normalization requirements.
9. Mutating a character array while assuming the original string changed.
10. Reversing arbitrary Unicode text naively.
11. Ignoring output construction cost.
12. Applying human-language alphabetical assumptions to technical lexicographic comparison.

---

# Interview Framework

1. What exactly is a character under this problem's contract?
2. Is the input ASCII, lowercase alphabet, arbitrary Unicode, or tokenized data?
3. Is the string immutable?
4. Do I need indexes or actual characters?
5. Can I solve it with one traversal?
6. Can frequency counting replace sorting?
7. Am I creating unnecessary substrings?
8. Does original order matter?
9. What normalization/case rules apply?
10. What are the exact time and auxiliary-space costs?

---

# Revision Checklist

- [ ] I understand JavaScript string immutability.
- [ ] I can traverse strings by index and by code point.
- [ ] I understand UTF-16 code units.
- [ ] I can distinguish code units, code points, and grapheme clusters.
- [ ] I understand substring vs subsequence.
- [ ] I understand prefix and suffix.
- [ ] I can use frequency arrays for bounded alphabets.
- [ ] I know when to use `Map` instead.
- [ ] I understand string slicing and allocation concerns.
- [ ] I can reason about string reversal.
- [ ] I understand palindrome and anagram foundations.
- [ ] I can analyze string algorithms with multiple parameters.
- [ ] I understand case and normalization as part of the contract.
- [ ] I can connect strings to backend parsing/validation.
- [ ] I can connect strings to AI/token processing.

## Key Takeaways

1. A string is an ordered sequence, but JavaScript's UTF-16 representation creates important Unicode details.
2. Strings are immutable; transformations create new representations.
3. Distinguish code units, code points, and user-perceived characters.
4. Frequency arrays are powerful when the alphabet is fixed and bounded.
5. Avoid unnecessary substring materialization when index-based reasoning is enough.
6. Substring and subsequence are fundamentally different problem spaces.
7. Case, normalization, and endpoint semantics belong to the algorithm contract.
8. String problems frequently combine traversal, hashing/frequency, two pointers, sorting, binary search, and later advanced matching techniques.
9. The same sequence reasoning transfers naturally to backend text processing and AI token pipelines.
