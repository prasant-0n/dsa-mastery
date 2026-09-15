# 03.18 — Advanced String & Array Patterns

## Purpose

This chapter is a **pattern-composition layer**. The goal is not to memorize isolated tricks, but to recognize when arrays and strings can be transformed into representations that expose a stronger algorithmic structure.

Core progression:

```text
raw input
→ characterize constraints
→ choose representation
→ identify reusable state
→ select pattern
→ prove invariant
→ analyze complexity
```

---

# 1. Pattern Composition

Many hard interview problems are not solved by one pattern.

They combine:

- hashing + sliding window;
- sorting + two pointers;
- prefix sums + hashing;
- binary search + feasibility checking;
- monotonic structures + range reasoning;
- intervals + sweep line;
- strings + prefix-function metadata;
- arrays + coordinate compression.

The expert question becomes:

> **Which smaller patterns compose into the required state transition?**

---

# 2. Sliding Window + Frequency

A classic composition is:

```text
window boundaries
+
frequency state
+
validity invariant
```

Used for:

- longest substring with constraints;
- minimum covering window;
- permutation/anagram windows;
- at-most/at-least distinct symbols.

The window is useful when expanding/shrinking has predictable effects on validity.

---

# 3. Minimum Covering Window

Given text `T` and required symbols `P`, maintain:

```text
left
right
required frequencies
window frequencies
number of satisfied requirements
```

Expand `right` until the window becomes valid.

Then shrink `left` while validity remains true.

The algorithm depends on the invariant:

> The current window contains the required multiset whenever `satisfied === required`.

This produces an `O(N)` expected-time pattern under ordinary hash-map assumptions.

---

# 4. Prefix Sum + Hashing

Prefix sums become especially powerful when combined with a hash map.

For subarray sum `K`:

```text
prefix[j] - prefix[i] = K
```

which becomes:

```text
prefix[i] = prefix[j] - K
```

Therefore, while scanning the array, store previous prefix frequencies.

This transforms a quadratic enumeration problem into a linear expected-time algorithm.

---

# 5. Prefix State as a Key

The broader pattern is:

```text
running state
+
Map<state, occurrence information>
```

Examples:

- prefix sum;
- prefix XOR;
- transformed balance;
- parity mask;
- normalized cumulative state.

Ask:

> Can the condition between two positions be expressed as equality or a fixed relationship between their prefix states?

---

# 6. Prefix Sum → Prefix Balance

For equal numbers of two categories, map them to:

```text
A → +1
B → -1
```

Then an interval has equal counts exactly when its transformed sum is zero.

This converts a counting relation into a numeric prefix-state relation.

This representation trick is more important than the specific problem.

---

# 7. Prefix XOR Patterns

Because:

```text
x ^ x = 0
```

prefix XOR supports analogous reasoning.

For XOR range queries:

```text
prefix[r] ^ prefix[l-1]
```

returns the range XOR.

For subarray XOR constraints, a hash map of prefix XOR values can play the same role as prefix sums.

---

# 8. Bitmask Frequency State

When the alphabet is small, a bitmask can compress state.

For example, tracking whether each of 26 letters has appeared can use a bitset-like integer representation when the language/runtime constraints permit it.

For parity problems:

```text
bit = 0 → even
bit = 1 → odd
```

Toggling a bit updates parity in constant time.

This is a major state-compression pattern.

---

# 9. Parity Masks

Suppose a substring property depends only on whether each character count is odd or even.

Maintain:

```text
mask ^= 1 << characterIndex
```

Two equal masks imply that the interval between them has even counts for every tracked character.

This can turn a frequency-vector problem into a compact prefix-state problem.

---

# 10. Binary Search on the Answer

Not every binary-search problem searches an array.

Sometimes the search space is the answer:

```text
minimum capacity
maximum feasible length
minimum processing time
maximum achievable value
```

The required condition is a monotonic predicate:

```text
false false false true true true
```

Then binary search finds the boundary.

---

# 11. Feasibility Function

Define:

```text
feasible(x)
```

The key requirement is monotonicity.

For minimization:

```text
if feasible(x) is true,
then feasible(y) is true for every y >= x
```

Then search for the first true value.

The difficult part is often designing an `O(N)` feasibility check, not binary search itself.

---

# 12. Sort + Two Pointers

Sorting can expose order that was absent in the original representation.

Then two pointers can exploit monotonic movement.

Common uses:

- pair sum;
- three sum;
- closest pair;
- interval relationships;
- deduplication;
- merging sorted data.

Typical structure:

```text
sort → establish order
→ move pointers monotonically
```

The sort cost must be included.

---

# 13. Sort + Greedy

Sorting can also expose the order required by a greedy proof.

Examples:

- interval scheduling by earliest finish;
- merge intervals by start;
- assign resources by ordered demand;
- choose smallest/largest candidates first.

Never claim that sorting plus a locally optimal decision is correct without establishing the greedy exchange or dominance argument.

---

# 14. Monotonic Stack

A monotonic stack maintains elements in increasing or decreasing order.

Typical problems:

- next greater element;
- previous smaller element;
- stock span;
- largest rectangle in histogram;
- removing dominated candidates.

The stack invariant might be:

> Values in the active stack are monotonic in the required direction.

Each element is usually pushed once and popped once, giving amortized `O(N)` time.

---

# 15. Monotonic Queue

A deque can maintain candidates in monotonic order for sliding-window extrema.

For maximum over every window:

```text
remove expired indices
remove smaller dominated values from back
append current index
front = maximum candidate
```

Each index enters and leaves the deque at most once.

Therefore:

```text
O(N) amortized time
O(W) space
```

for window size `W`.

---

# 16. Difference Arrays

When many range updates are applied to an array, directly updating every element can be expensive.

Instead mark boundaries:

```text
add at left
subtract after right
```

Then recover actual values with a prefix sum.

For `Q` range updates over `N` positions:

```text
O(Q + N)
```

can replace `O(QN)` direct updating in the appropriate static setting.

---

# 17. Coordinate Compression

If coordinates are huge but only `U` distinct coordinates matter:

```text
sort unique coordinates
map original coordinate → compact index
```

This transforms sparse large domains into dense manageable indexes.

Used in:

- intervals;
- sweep lines;
- range updates;
- geometry;
- event processing.

The compressed representation must preserve the ordering relationships required by the algorithm.

---

# 18. Sweep Line + Events

Convert interval boundaries into events:

```text
(start, +1)
(end, -1)
```

Sort events and maintain active count.

This can solve:

- maximum concurrency;
- coverage;
- overlap counts;
- resource allocation.

Tie-breaking is part of correctness when endpoints touch.

Closed, open, and half-open interval semantics must be explicit.

---

# 19. Merge + Two Pointers

Two sorted sequences can be processed with:

```text
left index
right index
```

and monotonic advancement.

Applications:

- merge sorted arrays;
- intersection;
- union;
- ranked-list combination;
- external merge operations.

Time:

```text
O(N + M)
```

because each pointer moves only forward.

---

# 20. Selection Instead of Full Sorting

If only the kth element or Top-K is required, sorting everything may do unnecessary work.

Possible tools:

- heap → `O(N log K)`;
- Quickselect → expected `O(N)`;
- full sort → `O(N log N)`.

The correct choice depends on:

- whether all ordering is needed;
- `K` relative to `N`;
- worst-case requirements;
- mutation constraints;
- repeated queries.

---

# 21. Hashing + Sliding Window

Many substring problems can be represented as:

```text
window
+
frequency/hash state
+
left/right movement
```

Examples:

- anagram search;
- longest substring without duplicates;
- at-most-K distinct characters;
- minimum covering window.

The key is identifying what makes a window valid and how each boundary movement changes that state.

---

# 22. String Prefix Function

For exact pattern matching, prefix-function/LPS metadata captures reusable prefix-suffix structure.

Instead of restarting after mismatch:

```text
j = lps[j - 1]
```

The pattern's prior structure determines the next viable state.

This is a concrete example of converting repeated comparison into precomputed state transitions.

---

# 23. Z-Algorithm Concept

The Z-array records the length of the substring starting at each position that matches the prefix.

It supports:

- pattern matching;
- prefix occurrence analysis;
- border reasoning;
- string periodicity.

The central idea is maintaining a current matching interval and reusing information when a position lies inside it.

This is another example of interval/state reuse.

---

# 24. Rolling Hash

Rolling hashes summarize windows numerically.

When a window shifts:

```text
remove outgoing contribution
add incoming contribution
```

instead of recomputing the entire hash.

Applications:

- substring comparison;
- duplicate substring detection;
- plagiarism-style filtering;
- content chunk comparison.

Hash collisions mean a hash equality may be a candidate rather than definitive equality.

---

# 25. Randomized Hashing

Multiple moduli, randomized bases, or other constructions can reduce collision risks under appropriate models.

But “unlikely collision” is not equivalent to mathematical proof of equality.

For security-sensitive uses, use cryptographic constructions appropriate to the threat model rather than relying on ordinary algorithmic rolling hashes.

---

# 26. Offline Query Reordering

If queries do not require online answers, their order can sometimes be changed to reduce total work.

Examples include:

- sorting queries by endpoint;
- sweep-line processing;
- offline coordinate compression;
- Mo's algorithm for certain range-query workloads.

The key distinction is:

```text
online contract → answer must be available immediately
offline contract → preprocessing/reordering is allowed
```

---

# 27. Mo's Algorithm Preview

Mo's algorithm reorders static range queries so adjacent queries have similar boundaries.

Maintain a current range:

```text
[L, R]
```

and update it incrementally.

It can be useful when:

- the array is static;
- queries are known in advance;
- adding/removing one endpoint is cheap;
- no stronger data structure is more appropriate.

It demonstrates that **query ordering itself can be an algorithmic optimization**.

---

# 28. Coordinate Compression + Prefix/Difference

A powerful composition is:

```text
large coordinates
→ compression
→ difference updates
→ prefix recovery
```

This can solve large-domain interval coverage problems without allocating an array proportional to the raw coordinate magnitude.

Always preserve segment lengths if the query depends on physical coordinate distance rather than merely event ordering.

---

# 29. String → Array of Tokens

Many string algorithms become array algorithms after tokenization.

For example:

```text
text
→ tokens
→ integer token IDs
→ sequence algorithms
```

Then:

- two pointers;
- frequency maps;
- prefix state;
- hashing;
- matching;
- windows

can operate over token IDs rather than UTF-16 code units.

This is especially relevant to AI systems.

---

# 30. Representation Transformation

A hard problem often becomes easier after transformation:

```text
characters → frequencies
characters → bitmask
array → prefix state
intervals → events
coordinates → compressed indexes
text → token IDs
values → sorted order + original indexes
```

Expert DSA is largely the ability to discover these transformations.

---

# 31. Choosing the Pattern

Use this quick framework:

| Signal | Candidate pattern |
|---|---|
| Sorted order | binary search / two pointers |
| Contiguous range | sliding window / prefix state |
| Range sum | prefix sum |
| Many range updates | difference array |
| Duplicate/existence | Set / hashing |
| Frequency | Map / fixed array |
| Next greater/smaller | monotonic stack |
| Window max/min | monotonic deque |
| Intervals | sort / sweep line |
| Small alphabet parity | bitmask |
| Repeated pattern matching | prefix function / Z / hash |
| Huge sparse coordinates | coordinate compression |
| Static offline queries | offline ordering / advanced query methods |
| Only Top-K | heap / selection |
| Monotonic answer predicate | binary search on answer |

This table is a starting point, not a substitute for proof.

---

# 32. Pattern Failure Analysis

A pattern is wrong when its required property does not hold.

Examples:

### Sliding window failure

The validity condition is not monotonic under shrinking.

### Two pointers failure

Pointer movement cannot be justified without losing possible answers.

### Binary-search-on-answer failure

`feasible(x)` is not monotonic.

### Greedy failure

A local decision has no valid exchange/dominance proof.

### Hash optimization failure

Hash equality is being treated as exact proof without collision handling.

The expert habit is:

> **Before applying a pattern, prove the property that makes the pattern safe.**

---

# 33. Backend Applications

### Log Processing

Streaming windows + frequency state can detect event patterns.

### Rate Limiting

Sliding windows, queues, and prefix-like counters model request budgets.

### Search

Prefix indexes, token matching, hashing, and Top-K selection combine into retrieval pipelines.

### Scheduling

Intervals + sorting + sweep lines handle resource conflicts.

### Pagination / Merging

Two pointers merge ordered pages, logs, or event streams.

### Analytics

Prefix states and offline query processing reduce repeated aggregation work.

---

# 34. AI Applications

### Token Windows

Sliding-window techniques operate over token IDs.

### Vocabulary Statistics

Frequency maps and compressed representations support token analysis.

### Retrieval

Hashing, lexical matching, Top-K selection, and approximate retrieval compose into candidate-generation pipelines.

### Sequence Search

Prefix-function/Z-style reasoning applies to repeated token patterns.

### Context Management

Intervals and windows model token-budget ranges and context constraints.

### Evaluation

Canonicalization + hashing + exact verification can support dataset deduplication pipelines.

---

# 35. Complexity Discipline

For every composed algorithm, separate costs:

```text
preprocessing
+
main scan/query processing
+
output construction
+
allocation
+
auxiliary state
```

Example:

```text
sort: O(N log N)
scan: O(N)
output: O(R)
```

Overall:

```text
O(N log N + R)
```

Do not hide an expensive preprocessing step merely because the final scan is linear.

---

# 36. Correctness Discipline

For composed patterns, prove each layer's contract.

Example:

```text
prefix state is correct
↓
hash lookup represents required prior states
↓
matching prefix pair corresponds to valid interval
↓
reported answer is therefore valid
```

Composition should preserve invariants rather than rely on intuition.

---

# 37. Common Mistakes

1. Memorizing patterns without checking prerequisites.
2. Applying sliding window to non-monotone constraints.
3. Using binary search without proving monotonicity.
4. Forgetting sorting cost when using two pointers.
5. Treating amortized `O(N)` as worst-case `O(1)` per operation.
6. Ignoring output size.
7. Assuming hashes are collision-free.
8. Using coordinate compression without preserving distances when needed.
9. Losing original indexes after sorting.
10. Rebuilding window state instead of updating it incrementally.
11. Overusing advanced patterns when a simple linear scan is sufficient.
12. Failing to state the character/token model.

---

# Interview Framework

When faced with an advanced array/string problem:

1. Define the exact contract.
2. Name the input parameters and scales.
3. Identify whether order, contiguity, frequency, or ranges matter.
4. Find a useful representation transformation.
5. Start with brute force.
6. Identify repeated work.
7. Choose one or more composable patterns.
8. State the invariant for every moving state.
9. Prove pattern prerequisites such as monotonicity.
10. Analyze preprocessing, query, output, and memory costs separately.
11. Test adversarial cases.
12. Explain why the chosen pattern is better than alternatives.

---

# Revision Checklist

- [ ] I can combine frequency maps with sliding windows.
- [ ] I can combine prefix sums with hashing.
- [ ] I understand prefix-balance transformations.
- [ ] I understand prefix XOR state.
- [ ] I understand bitmask/parity state compression.
- [ ] I can recognize binary search on the answer.
- [ ] I can combine sorting with two pointers.
- [ ] I understand monotonic stacks.
- [ ] I understand monotonic deques.
- [ ] I understand difference arrays.
- [ ] I understand coordinate compression.
- [ ] I understand sweep-line events.
- [ ] I understand Top-K vs full sorting.
- [ ] I understand prefix-function/LPS and Z-algorithm concepts.
- [ ] I understand rolling-hash trade-offs.
- [ ] I understand offline query reordering.
- [ ] I can transform strings into token sequences.
- [ ] I can prove when a pattern is safe.
- [ ] I can analyze composed algorithms end-to-end.

## Key Takeaways

1. Advanced array/string problems are often solved by **composing simpler patterns**.
2. Representation transformation is one of the highest-leverage DSA skills.
3. Prefix state + hashing converts many pair-of-prefix conditions into linear expected-time algorithms.
4. Sliding windows require a valid monotonicity argument.
5. Binary search on the answer requires a monotonic feasibility predicate.
6. Monotonic stacks/deques rely on amortized one-entry/one-exit reasoning.
7. Coordinate compression and offline processing change the computational model, not merely the code.
8. Prefix-function, Z-algorithm, and rolling hash demonstrate different ways of reusing previously learned string structure.
9. Always prove the prerequisite that makes a pattern correct before applying it.
