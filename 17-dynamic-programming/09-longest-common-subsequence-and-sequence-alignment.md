# 09 — Longest Common Subsequence & Sequence Alignment

> **Phase 17 — Dynamic Programming**
>
> LCS is the canonical two-sequence DP pattern. The important skill is not memorizing a table: define what a pair of prefixes means, derive the match/mismatch decisions, and understand how reconstruction and alignment extend the same state graph.

---

## 1. The Core Problem

Given sequences `A` and `B`, find the longest sequence that appears in both while preserving relative order.

A subsequence may skip elements but may not reorder them.

Example:

```text
A = A B C D
B = A C D

LCS = A C D
```

This is fundamentally different from substring problems, where the selected characters must be contiguous.

---

## 2. The State

Define:

```text
dp[i][j] = LCS length of A[0..i-1] and B[0..j-1]
```

The prefix formulation is powerful because every state asks the same smaller question:

> What is the best common subsequence between these two prefixes?

Using prefix lengths instead of raw indices also gives natural empty-prefix base cases.

---

## 3. Base Cases

If either sequence is empty:

```text
dp[0][j] = 0
dp[i][0] = 0
```

No non-empty common subsequence can exist.

As always, derive the base case from the state meaning instead of memorizing it.

---

## 4. Match Transition

If the final characters of the prefixes match:

```text
A[i - 1] === B[j - 1]
```

then an optimal LCS can extend the smaller prefixes:

```text
dp[i][j] = dp[i - 1][j - 1] + 1
```

Why can we safely take the diagonal?

Because the matching characters can be paired as the final selected pair of an LCS for these prefixes.

---

## 5. Mismatch Transition

If:

```text
A[i - 1] !== B[j - 1]
```

then those two final characters cannot be paired with each other in a common subsequence.

At least one must be excluded from consideration, giving:

```text
dp[i][j] = max(
    dp[i - 1][j],
    dp[i][j - 1]
)
```

This is a classic DP pattern:

```text
match     → forced-compatible diagonal extension
mismatch  → choose the better remaining prefix
```

---

## 6. Why the Mismatch Recurrence Works

Suppose the final characters differ.

Any common subsequence must omit at least one of them from its final pairing. Therefore an optimal solution is represented by one of the two states:

```text
remove A[i - 1]
```

or:

```text
remove B[j - 1]
```

Taking the maximum preserves the better possibility.

This is an important proof pattern: enumerate the necessary last decisions, then show every valid solution belongs to at least one case.

---

## 7. Evaluation Order

Each state depends on:

```text
(i - 1, j - 1)
(i - 1, j)
(i, j - 1)
```

Therefore iterate:

```text
for i = 1 → m
    for j = 1 → n
```

The dependency graph is a DAG because both prefix dimensions move monotonically toward larger indices during tabulation.

---

## 8. Top-Down Formulation

The equivalent memoized state can be:

```text
solve(i, j)
```

meaning the LCS answer for suffixes beginning at `i` and `j`.

Then:

```text
A[i] === B[j]
    → 1 + solve(i + 1, j + 1)

otherwise
    → max(solve(i + 1, j), solve(i, j + 1))
```

Prefix and suffix formulations are both valid.

The correct choice is the one whose state semantics make transitions and boundaries easiest to reason about.

---

## 9. Complexity

For sequences of lengths `m` and `n`:

```text
Time:  O(mn)
Space: O(mn)
```

for the full table.

If only the LCS length is required, the previous row can often be retained:

```text
Space: O(min(m, n))
```

But reconstruction changes the space discussion.

---

## 10. LCS Length vs Reconstruction

Computing:

```text
LCS length = 5
```

is not the same task as returning an actual sequence.

A full DP table allows backward reconstruction.

At state `(i, j)`:

- if characters match, move diagonally and emit the character;
- otherwise move toward the predecessor with the larger DP value.

The path through the DP table is itself a representation of the decisions.

---

## 11. Multiple LCS Answers

There may be many distinct LCS sequences with the same maximum length.

For example, different mismatch branches can produce equal values.

Therefore define the output contract:

```text
any LCS
lexicographically smallest LCS
all distinct LCS values
count of LCS solutions
```

These are different computational problems.

Do not silently add expensive tie-breaking or enumeration when the caller only needs one witness.

---

## 12. Deterministic Tie-Breaking

If two predecessor states have equal length:

```text
dp[i - 1][j] === dp[i][j - 1]
```

choosing one consistently gives deterministic reconstruction, but it does not automatically produce a lexicographically smallest LCS.

A required lexicographic tie-break may need additional state or a more sophisticated reconstruction strategy.

Tie-breaking is part of the specification, not merely presentation.

---

## 13. Space-Optimized LCS Length

Only the previous row and current row are required for the length:

```text
previous[j]
current[j]
```

This gives:

```text
O(n)
```

space after choosing the shorter sequence as the column dimension.

The update must preserve the diagonal value from the previous row before overwriting it.

A common implementation pattern is:

```text
prevDiagonal = previous[j - 1]
```

before the current cell is updated.

---

## 14. One-Row LCS Length

With careful bookkeeping, LCS length can be computed with one row:

```text
left = current[j - 1]
up = dp[j]
oldDiagonal = previous row's dp[j - 1]
```

The critical invariant is that the diagonal dependency must remain the value from the previous row.

This is the same state-liveness problem encountered in other in-place DP optimizations.

Never compress a DP table until every dependency's logical lifetime is understood.

---

## 15. Longest Common Substring Is Different

LCS permits gaps.

Longest Common Substring requires contiguity.

For substring matching:

```text
dp[i][j] = dp[i - 1][j - 1] + 1
```

when characters match, otherwise:

```text
dp[i][j] = 0
```

That single change in state semantics produces a fundamentally different problem.

Interviewers frequently test whether you notice this distinction.

---

## 16. Shortest Common Supersequence

The Shortest Common Supersequence (SCS) contains both input sequences as subsequences.

Its length is related to LCS:

```text
SCS length = m + n - LCS length
```

Why?

Characters belonging to the common subsequence can be shared once; all other characters must be contributed separately.

This is an example of reducing one problem to a previously understood DP quantity.

---

## 17. Insertions and Deletions Through LCS

Suppose only insertions and deletions are allowed to transform `A` into `B`.

If:

```text
L = LCS(A, B)
```

then a natural minimum-operation construction is:

```text
m - L deletions
n - L insertions
```

Total:

```text
m + n - 2L
```

The common subsequence acts as the preserved backbone.

This relationship is useful for reasoning about diff systems and transformation plans.

---

## 18. LCS as an Alignment Problem

LCS can be viewed as a restricted sequence-alignment problem.

Each aligned pair is either:

```text
match selected → +1
```

or one sequence advances while the other stays conceptually unpaired:

```text
gap → 0
```

This perspective lets us generalize LCS into weighted alignment.

---

## 19. Weighted Sequence Alignment

Instead of treating every match as `+1`, define a scoring function:

```text
score(a, b)
```

and gap penalties.

A general recurrence can compare:

```text
align A[i - 1] with B[j - 1]

skip A[i - 1]

skip B[j - 1]
```

For maximization:

```text
dp[i][j] = max(
    dp[i - 1][j - 1] + score(A[i - 1], B[j - 1]),
    dp[i - 1][j] + gap,
    dp[i][j - 1] + gap
)
```

LCS is therefore one point in a larger alignment design space.

---

## 20. Global vs Local Alignment

Two important alignment objectives are:

### Global alignment

Align the sequences across their full lengths.

The DP usually permits leading/trailing gaps according to the scoring model.

### Local alignment

Find the highest-scoring matching region inside the sequences.

The recurrence typically allows a reset to a baseline score such as zero:

```text
dp[i][j] = max(0, candidates...)
```

The reset changes the optimization semantics from global to local.

---

## 21. Gap Penalties

A constant gap penalty is simple but may not model real alignment costs well.

A common extension distinguishes:

```text
opening a gap
extending an existing gap
```

This leads to multiple DP states, such as:

```text
M[i][j] = end with a character-character alignment
X[i][j] = end with a gap in B
Y[i][j] = end with a gap in A
```

The extra state tracks information that affects future transition cost.

This is a direct application of the state-sufficiency principle.

---

## 22. Alignment as a State Graph

Every cell `(i, j)` represents a pair of sequence prefixes.

Edges represent decisions:

```text
(i-1, j-1) → match/mismatch
(i-1, j)   → gap
(i, j-1)   → gap
```

The DP computes an optimal path through this DAG.

This graph interpretation makes it easier to generalize the algorithm to custom scoring systems.

---

## 23. Reconstruction as Path Recovery

Once the DP table is viewed as a graph of decisions, reconstruction becomes:

> Follow parent decisions from the terminal state back to the source.

Possible parent labels:

```text
DIAGONAL
UP
LEFT
```

For weighted alignment there may be three or more transition types.

If multiple transitions have equal scores, the parent policy determines which valid alignment is returned.

---

## 24. Hirschberg-Style Linear-Space Reconstruction

There is an important distinction between:

```text
linear-space LCS length
```

and:

```text
linear-space LCS reconstruction
```

Hirschberg's technique combines divide-and-conquer with forward/backward linear-space DP to reconstruct an LCS while using linear memory.

The high-level idea is:

1. Split one sequence around its midpoint.
2. Compute prefix scores for the left half.
3. Compute suffix scores for the right half.
4. Find the split point in the other sequence that maximizes the combined score.
5. Recurse on the two halves.

This trades some recomputation for reduced memory.

---

## 25. Counting LCS Solutions

If the question asks how many optimal subsequences exist, storing only the maximum length is insufficient.

The DP state may need to store both:

```text
best length
count associated with that optimum
```

When both predecessor choices have equal optimal length, counts must be combined carefully.

Duplicate sequence values introduce another subtlety: counting index-distinct optimal embeddings is different from counting distinct sequence values.

Define the counting semantics before implementing.

---

## 26. Enumerating All LCS Values

Returning all distinct LCS strings can be much more expensive than returning one.

The number of optimal solutions can be exponential in the input size.

A production implementation should therefore distinguish:

```text
one witness
count
first K witnesses
streaming enumeration
all witnesses
```

Output size itself may dominate runtime.

Memoizing sets of strings can also cause substantial memory and allocation costs.

---

## 27. Lexicographically Constrained Reconstruction

If the output contract requires a lexicographically smallest LCS, ordinary parent selection is insufficient.

Possible approaches include:

- precomputed next-occurrence tables
- memoized suffix states with lexicographic comparison
- greedy reconstruction backed by feasibility DP
- ranking-aware state representations

The key lesson is that a tie-break can change the state requirements and complexity.

---

## 28. Differential Testing

For short sequences, build an exhaustive subsequence oracle.

Then compare:

```text
brute-force LCS length
vs
full-table DP
vs
space-optimized DP
```

For reconstruction, validate:

1. output is a subsequence of `A`;
2. output is a subsequence of `B`;
3. output length equals the DP optimum.

For alignment, additionally validate that the reported score equals the sum of transition scores.

---

## 29. Metamorphic Testing

Useful properties include:

- swapping the two input sequences preserves LCS length;
- appending the same character to both sequences can increase LCS by at most one;
- identical sequences have LCS length equal to their length;
- an empty sequence has LCS length zero with any sequence;
- a reconstructed LCS must remain valid when the DP implementation is replaced by an equivalent space-optimized version.

Be careful with stronger claims. Appending the same character does not necessarily increase the LCS by exactly one if the character already interacts with an existing optimal structure.

---

## 30. Adversarial Cases

Test deliberately difficult structures:

```text
empty strings
one-character strings
identical long strings
completely different strings
repeated-character strings
alternating characters
many duplicate optimal branches
highly asymmetric lengths
Unicode strings
```

Repeated characters are especially useful because they create many equal-score reconstruction choices.

For Unicode text, decide whether the algorithm operates on JavaScript UTF-16 code units or Unicode code points.

---

## 31. JavaScript Engineering

JavaScript strings are UTF-16 sequences.

Therefore:

```js
"😀".length === 2
```

because the character is represented by a surrogate pair.

If the problem is defined over Unicode code points, convert explicitly:

```js
const chars = Array.from(text);
```

The choice affects both correctness and complexity.

For ASCII-oriented interview problems, indexing strings directly is usually sufficient.

---

## 32. Memory Engineering

A full table of `(m + 1) × (n + 1)` integers can become expensive.

Production strategies include:

- choose the shorter sequence as the column dimension;
- use typed arrays when values have bounded numeric ranges;
- use rolling rows for length-only queries;
- use Hirschberg-style reconstruction when memory is constrained;
- impose input-size limits before allocating large tables.

As with all DP, memory is part of the algorithm's operational complexity.

---

## 33. Backend Applications

LCS and alignment patterns appear in backend systems such as:

- document diffing
- configuration version comparison
- migration planning
- reconciliation engines
- audit-log comparison
- text/version similarity services
- change detection

For a backend API, define:

```text
maximum input length
maximum CPU budget
maximum memory budget
output contract
cancellation behavior
```

Do not expose an unbounded `O(mn)` endpoint to arbitrary user input without resource guardrails.

---

## 34. AI Engineering Applications

Sequence alignment is useful for deterministic comparison around AI systems:

- comparing generated text with reference text;
- aligning token sequences;
- evaluating structured outputs;
- comparing model-generated plans with validated plans;
- sequence-level reconciliation.

A robust architecture is:

```text
AI-generated candidate
        ↓
normalize/tokenize
        ↓
deterministic alignment
        ↓
structured difference
        ↓
validation / metrics
```

The alignment layer should have explicit tokenization semantics and deterministic scoring.

---

## 35. Correctness Invariants

For full-table LCS:

> `dp[i][j]` equals the maximum common-subsequence length of the first `i` elements of `A` and the first `j` elements of `B`.

For reconstruction:

> Every emitted element corresponds to a diagonal match, and every movement remains consistent with the DP recurrence.

For weighted alignment:

> `dp[i][j]` equals the optimal score among all legal alignments of the two prefixes represented by that state.

These invariants are the foundation of correctness proofs.

---

## 36. Complexity Summary

For sequence lengths `m` and `n`:

| Variant | Time | Space |
|---|---:|---:|
| Full LCS length | `O(mn)` | `O(mn)` |
| Rolling-row LCS length | `O(mn)` | `O(min(m,n))` |
| One-row LCS length | `O(mn)` | `O(min(m,n))` |
| Hirschberg-style reconstruction | `O(mn)` | `O(min(m,n))` auxiliary space |
| Full alignment DP | `O(mn)` | `O(mn)` |

Enumeration of all solutions must additionally account for output size.

---

## 37. Common Failure Modes

### Failure 1 — Confusing subsequence and substring

LCS allows gaps; substring does not.

### Failure 2 — Wrong mismatch transition

Using diagonal on mismatch loses valid solutions.

### Failure 3 — Overwriting the diagonal during one-row compression

The recurrence then reads a current-row value instead of the previous-row value.

### Failure 4 — Assuming one LCS exists

Multiple optimal sequences are common.

### Failure 5 — Claiming a tie-break without implementing it

Consistent parent selection is not automatically lexicographic minimization.

### Failure 6 — Ignoring Unicode semantics

JavaScript string indexing operates on UTF-16 code units.

### Failure 7 — Treating reconstruction as free

Memory and time requirements can change significantly when a witness is required.

### Failure 8 — Unbounded API input

`O(mn)` becomes an operational risk when both dimensions are attacker-controlled.

---

## 38. Interview Derivation Framework

When given an LCS/alignment problem:

1. Determine whether matching must be contiguous.
2. Define the two-sequence state precisely.
3. Decide prefix or suffix semantics.
4. Derive match and mismatch decisions.
5. Establish empty-prefix base cases.
6. Determine dependency order.
7. Compute the full table first if clarity matters.
8. Add reconstruction only if required.
9. Compress space after proving dependency safety.
10. Clarify tie-breaking and counting semantics.
11. Check whether weighted gaps change the state.
12. State `O(mn)` time and the actual space requirement.
13. Discuss input-size guardrails for production systems.

---

## 39. Master Pattern

The reusable pattern is:

```text
Two sequences
    ↓
State = answer for a pair of prefixes/suffixes
    ↓
Compare current elements
    ↓
Match → diagonal transition
Mismatch → choose/aggregate alternative advances
    ↓
Evaluate in dependency order
    ↓
Recover value
    ↓
Optionally recover decision path
```

Then generalize:

```text
LCS
  ↓
weighted alignment
  ↓
gap-aware alignment
  ↓
local/global alignment
  ↓
sequence transformation and diff systems
```

The central skill is **state sufficiency + decision completeness**, not memorizing the LCS table.

---

## 40. Revision Checklist

Before considering this topic mastered, you should be able to explain and implement:

- [ ] LCS state semantics
- [ ] prefix and suffix formulations
- [ ] base cases
- [ ] match transition
- [ ] mismatch transition
- [ ] correctness proof
- [ ] full-table implementation
- [ ] rolling-row implementation
- [ ] one-row dependency preservation
- [ ] reconstruction
- [ ] deterministic tie-breaking
- [ ] LCS vs longest common substring
- [ ] SCS relationship
- [ ] insertion/deletion relationship
- [ ] weighted sequence alignment
- [ ] global vs local alignment
- [ ] gap-state modeling
- [ ] Hirschberg-style reconstruction
- [ ] counting semantics
- [ ] enumeration/output-size analysis
- [ ] differential testing
- [ ] metamorphic testing
- [ ] Unicode semantics in JavaScript
- [ ] backend resource guardrails
- [ ] AI alignment architecture
- [ ] interview derivation

> **Mastery standard:** Given a new two-sequence problem, you should be able to derive the state, transitions, base cases, evaluation order, reconstruction strategy, and complexity without memorizing a solution.
