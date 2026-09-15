# 03.16 — Palindromes

## Definition

A **palindrome** is a sequence that reads the same forward and backward under a specified equality rule.

Examples:

```text
"racecar" → palindrome
"level"   → palindrome
"hello"   → not a palindrome
```

The important algorithmic idea is symmetry:

```text
left side ↔ right side
```

A palindrome problem is therefore a natural application of **two pointers, invariants, normalization, and center expansion**.

---

# 1. Why Palindromes Matter

Palindrome problems teach several reusable techniques:

- opposite-direction two pointers;
- symmetric comparisons;
- center expansion;
- boundary reasoning;
- normalization before computation;
- avoiding unnecessary allocations;
- deriving linear-time algorithms from symmetry.

The same ideas appear in arrays, strings, linked lists, and tree/path problems.

---

# 2. Exact Palindrome Definition

For a sequence of length `N`, it is a palindrome when:

```text
s[i] === s[N - 1 - i]
```

for every valid `i`.

It is enough to check the first half because every comparison covers two symmetric positions.

Number of required comparisons:

```text
floor(N / 2)
```

Therefore the direct verification algorithm is:

```text
O(N) time
O(1) auxiliary space
```

under the problem's direct-access model.

---

# 3. Two-Pointer Verification

Initialize:

```text
left  = 0
right = N - 1
```

Then:

```text
while left < right:
    compare s[left] and s[right]
    move left forward
    move right backward
```

Stop immediately on mismatch.

This is the canonical palindrome algorithm.

---

# 4. Correctness Invariant

A useful invariant is:

> Before every iteration, all positions outside `[left, right]` have already been verified to match their symmetric counterparts.

Maintenance:

- compare the current symmetric pair;
- if equal, both positions become verified;
- move inward.

Termination:

When `left >= right`, every symmetric pair has been checked.

Therefore the sequence is a palindrome exactly when no mismatch occurred.

---

# 5. Why Only Half the String?

Suppose:

```text
s = "abcdefgfedcba"
```

Checking both directions independently duplicates work.

The pair:

```text
s[0] ↔ s[n-1]
```

already establishes both sides of that symmetry.

Thus checking the first half is sufficient.

This is an important general pattern:

> **When a property is symmetric, look for paired work that can be performed once.**

---

# 6. Empty and Singleton Strings

Both are palindromes under the standard definition.

```text
""    → palindrome
"a"   → palindrome
```

The two-pointer algorithm naturally handles these because:

```text
left >= right
```

before any mismatch exists.

Always verify such boundary cases explicitly in interviews.

---

# 7. Even vs Odd Length

### Even length

There are two central elements:

```text
abba
```

### Odd length

There is one central element:

```text
abcba
```

The center itself never needs comparison against another position.

The algorithm works uniformly for both cases.

---

# 8. Early Termination

For:

```text
"abcdef..."
```

if the first pair differs, the algorithm can stop immediately.

Best-case behavior can therefore be:

```text
O(1)
```

while worst-case behavior is:

```text
O(N)
```

Do not confuse early termination with a different asymptotic worst-case bound.

---

# 9. Reverse-and-Compare

A simple alternative is:

```text
reverse(s) === s
```

Conceptually correct, but it usually requires constructing a reversed representation.

Typical auxiliary cost:

```text
O(N)
```

compared with the direct two-pointer method's `O(1)` auxiliary algorithmic space.

The two-pointer approach is preferable when the contract allows direct access and mutation is not required.

---

# 10. Recursive Palindrome Check

A recursive formulation is:

```text
if left >= right → true
if s[left] != s[right] → false
otherwise solve(left+1, right-1)
```

Time:

```text
O(N)
```

Recursive stack:

```text
O(N)
```

This is useful for learning recursive state and invariants, but it is generally less memory-efficient than the iterative two-pointer version in JavaScript.

---

# 11. Normalized Palindrome

Some problems define a palindrome after ignoring:

- spaces;
- punctuation;
- case;
- other specified characters.

Example:

```text
"A man, a plan, a canal: Panama"
```

The important point is that normalization is part of the contract.

Do not silently modify input unless the problem says to do so.

---

# 12. Normalize Then Compare

One strategy:

```text
normalized = preprocess(s)
check normalized
```

If normalization materializes another string:

```text
O(N) extra space
```

may be required.

This approach is simple and often readable.

But it may allocate more memory than necessary.

---

# 13. Normalize While Comparing

A more memory-efficient strategy can use two pointers and advance over characters that should be ignored.

Conceptually:

```text
while left < right:
    skip ignored left characters
    skip ignored right characters
    compare normalized symbols
    move inward
```

This can preserve:

```text
O(1)
```

auxiliary algorithmic space.

The exact implementation depends on the normalization contract.

---

# 14. Case-Insensitive Palindromes

For ASCII-only problems, case conversion can be straightforward.

For arbitrary Unicode text, case mapping can be more complex.

Therefore state the model explicitly:

```text
ASCII case-insensitive
vs
Unicode-aware case-insensitive
```

Production systems should use well-defined Unicode-aware semantics where appropriate.

---

# 15. Unicode and Palindromes

A JavaScript string can contain UTF-16 surrogate pairs.

Therefore naive indexing can operate on code units rather than complete Unicode code points.

For example, a visual emoji is not necessarily one JavaScript index position.

For Unicode-aware palindrome logic, consider whether the problem is defined over:

```text
UTF-16 code units
Unicode code points
grapheme clusters
normalized graphemes
```

The correct algorithm depends on that definition.

---

# 16. Longest Palindromic Substring

A different problem asks:

> What is the longest contiguous palindromic substring?

This is not solved by simply checking whether the entire string is a palindrome.

A foundational approach is **expand around center**.

Every palindrome has a center:

- one character for odd length;
- a gap between characters for even length.

Expand outward while symmetric characters match.

---

# 17. Center Expansion

For each possible center:

```text
left = center
right = center
```

for odd-length palindromes, and:

```text
left = center
right = center + 1
```

for even-length palindromes.

Then repeatedly compare:

```text
s[left] === s[right]
```

and expand.

There are `O(N)` centers, each potentially expanding `O(N)` times.

Therefore worst-case complexity is:

```text
O(N²)
```

with `O(1)` auxiliary space if only the answer boundaries are stored.

---

# 18. Why Center Expansion Works

Every palindrome has symmetric boundaries around a center.

If:

```text
s[left] === s[right]
```

then the next possible extension depends only on:

```text
left - 1
right + 1
```

The algorithm enumerates all possible centers, so it cannot miss the center of the longest palindrome.

This gives a direct correctness argument.

---

# 19. Brute Force Longest Palindrome

A brute-force approach can:

1. enumerate every substring;
2. test whether each substring is a palindrome;
3. retain the longest.

There are `O(N²)` substrings.

A naive palindrome check can take `O(N)`.

Worst-case:

```text
O(N³)
```

Center expansion improves this to:

```text
O(N²)
```

This is a textbook example of eliminating repeated work.

---

# 20. Dynamic Programming Preview

Another approach stores whether each substring is a palindrome.

Define:

```text
dp[l][r] = whether s[l..r] is a palindrome
```

Transition:

```text
s[l] === s[r]
AND
inner substring is palindrome
```

Typical complexity:

```text
O(N²) time
O(N²) space
```

This demonstrates the trade-off between time and memory.

---

# 21. Manacher's Algorithm Preview

There is an advanced linear-time algorithm for longest palindromic substring:

```text
Manacher's algorithm
```

It reuses palindrome-radius information to avoid repeated expansion.

Complexity:

```text
O(N) time
```

with linear auxiliary representation depending on implementation.

You do not need to implement it here yet; understand the progression:

```text
brute force O(N³)
→ center expansion O(N²)
→ DP O(N²)
→ Manacher O(N)
```

---

# 22. Palindromic Substrings Count

The task:

> Count all palindromic substrings.

Center expansion can count every palindrome encountered during each expansion.

Worst-case:

```text
O(N²)
```

because a string such as:

```text
"aaaaaa..."
```

contains quadratic many palindromic substrings.

This is an important output-sensitive observation.

---

# 23. Number of Palindromic Substrings Can Be Quadratic

For a string of length `N`, the number of distinct positions/substrings that are palindromic can be `Θ(N²)`.

Therefore an algorithm returning or counting every occurrence cannot generally have a subquadratic output-independent interpretation when the output itself is quadratic.

Distinguish:

```text
number of palindromic occurrences
vs
number of distinct palindrome values
```

They are different problems.

---

# 24. Palindrome Partitioning Preview

Another problem asks whether a string can be partitioned into palindromic pieces, or asks for the minimum number of cuts.

This introduces:

- dynamic programming;
- substring palindrome state;
- recursive search;
- backtracking;
- state compression.

The simple palindrome predicate becomes a building block for larger algorithms.

---

# 25. Backend Applications

### Validation

Detect symmetric identifiers or protocol structures when required by a domain rule.

### Data Quality

Identify repeated/symmetric textual patterns in logs or imported records.

### Search

Palindrome detection can be used as a component in specialized text-processing tasks.

### Parsing

Symmetric delimiters or structured fields can sometimes be modeled using the same boundary reasoning.

The more important backend lesson is the two-pointer pattern itself, which transfers to ordered event and buffer processing.

---

# AI Applications

### Text Analysis

Palindrome detection is a simple sequence-processing primitive.

### Token Sequences

The same algorithm can operate on token IDs instead of characters.

### Synthetic Data Validation

Symmetry-based checks can validate generated structured sequences.

### Algorithmic Training

Palindrome problems are useful for teaching models and engineers about sequence state, invariants, and boundary movement.

---

# Common Mistakes

1. Comparing the entire reversed string when `O(1)` extra space is required.
2. Forgetting empty and singleton strings.
3. Using `left <= right` incorrectly and over-processing the center.
4. Confusing palindrome with anagram.
5. Silently ignoring punctuation or spaces without a contract.
6. Assuming JavaScript indexes always represent Unicode characters.
7. Forgetting even-length centers in longest-palindrome problems.
8. Counting only distinct palindrome values when occurrences are requested.
9. Calling longest-palindrome center expansion `O(N)`.
10. Ignoring output size in enumeration problems.
11. Using recursive palindrome checks without accounting for stack space.
12. Treating normalization as free.

---

# Interview Framework

For a palindrome problem:

1. Define the equality rule.
2. Define the character model.
3. Decide whether normalization is required.
4. Ask whether the task is whole-string verification or longest/count/all palindromes.
5. For whole-string verification, use two pointers.
6. State the symmetry invariant.
7. For longest palindrome, consider center expansion.
8. Include both odd and even centers.
9. Analyze output size when returning all results.
10. State time, auxiliary space, and allocation costs.

---

# Revision Checklist

- [ ] I can verify a palindrome with two pointers.
- [ ] I can prove the two-pointer invariant.
- [ ] I understand empty, singleton, even, and odd cases.
- [ ] I understand early termination.
- [ ] I can compare reverse-and-compare with two pointers.
- [ ] I understand recursive palindrome complexity.
- [ ] I can handle normalization as part of the contract.
- [ ] I understand Unicode character-model issues.
- [ ] I can explain center expansion.
- [ ] I understand longest palindromic substring complexity.
- [ ] I understand why brute force can be `O(N³)`.
- [ ] I understand the DP formulation.
- [ ] I know what Manacher's algorithm achieves conceptually.
- [ ] I can count palindromic substrings using centers.
- [ ] I understand output-sensitive reasoning.

## Key Takeaways

1. Whole-string palindrome verification is a canonical two-pointer problem.
2. Symmetry reduces the necessary comparisons to half the sequence.
3. The key invariant is that the already-processed outer pairs are verified.
4. Normalization and Unicode semantics are part of correctness, not implementation trivia.
5. Longest palindromic substring is a different problem and naturally leads to center expansion.
6. Center expansion improves brute force from `O(N³)` to `O(N²)`.
7. Dynamic programming trades `O(N²)` memory for reusable palindrome state.
8. Manacher's algorithm demonstrates how deeper reuse can achieve linear-time palindrome-radius computation.
9. Palindrome problems are valuable because the underlying boundary and symmetry reasoning transfers far beyond strings.
