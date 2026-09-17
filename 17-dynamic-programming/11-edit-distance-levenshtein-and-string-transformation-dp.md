# 11 — Edit Distance, Levenshtein & String Transformation DP

> **Phase 17 — Dynamic Programming**
>
> Edit Distance is the canonical **minimum-cost transformation DP**. The important skill is not memorizing Levenshtein's table: define the state around prefixes, enumerate the final transformation decision, assign costs, derive base cases, and understand how changing the operation set changes the recurrence.

---

## 1. The Core Problem

Given strings `A` and `B`, transform `A` into `B` using operations such as:

- insert a character
- delete a character
- substitute one character for another

The classic Levenshtein distance gives each operation unit cost.

Example:

```text
A = cat
B = cut

cat → cut
     substitute a → u

Distance = 1
```

The problem is an optimization problem over a sequence of transformation decisions.

---

## 2. The State

Define:

```text
dp[i][j] = minimum cost to transform A[0..i-1] into B[0..j-1]
```

This prefix state is sufficient because the remaining work depends only on the two remaining prefixes, not on the complete history of previous edits.

That is the central DP principle:

> Preserve exactly the information that determines all future decisions.

---

## 3. Base Cases

Transforming an empty prefix into a target prefix requires insertions:

```text
dp[0][j] = j
```

Transforming a source prefix into an empty prefix requires deletions:

```text
dp[i][0] = i
```

For weighted operations, replace `j` and `i` with the corresponding accumulated insertion/deletion costs.

Base cases follow directly from state semantics.

---

## 4. Final-Decision Decomposition

At state `(i, j)`, consider the final transformation operation.

Three possibilities are sufficient for ordinary Levenshtein distance:

```text
insert B[j - 1]
delete A[i - 1]
match/substitute A[i - 1] ↔ B[j - 1]
```

Therefore:

```text
dp[i][j] = min(
    dp[i][j - 1] + insertionCost,
    dp[i - 1][j] + deletionCost,
    dp[i - 1][j - 1] + substitutionCost
)
```

When characters already match, substitution cost is normally zero.

This is a reusable derivation pattern:

> Enumerate the last action, move to the state before that action, then add its cost.

---

## 5. Match vs Substitution

If:

```text
A[i - 1] === B[j - 1]
```

there is no reason to pay a positive substitution cost under the standard model:

```text
dp[i][j] = dp[i - 1][j - 1]
```

If they differ:

```text
dp[i][j] = min(
    insert,
    delete,
    substitute
)
```

The recurrence is therefore a shortest-path computation over a grid of prefix states.

---

## 6. Why the Recurrence Is Correct

Take an optimal transformation from `A[0..i-1]` to `B[0..j-1]`.

Its final action must fall into one of the supported categories:

1. the final target character was inserted;
2. the final source character was deleted;
3. the final source and target characters were aligned through match/substitution.

Remove that final action. The remaining transformation is a valid solution for the corresponding predecessor state.

Therefore the optimum must be represented by one of the recurrence candidates.

Conversely, every candidate extends a valid predecessor solution with a legal final operation.

This gives both directions of the correctness proof:

```text
optimal solution → considered case
considered case  → valid transformation
```

---

## 7. Evaluation Order

Dependencies are:

```text
(i, j - 1)
(i - 1, j)
(i - 1, j - 1)
```

So a forward table can be evaluated with:

```text
for i = 1 → m
    for j = 1 → n
```

The dependency graph is acyclic because both prefix dimensions only move toward larger indices during tabulation.

---

## 8. Complexity

For strings of lengths `m` and `n`:

```text
Time:  O(mn)
Space: O(mn)
```

for a full table.

If only the distance is required, two rolling rows reduce space to:

```text
O(min(m, n))
```

The distinction between value computation and reconstruction matters when optimizing memory.

---

## 9. Top-Down Memoized Form

A suffix formulation can define:

```text
solve(i, j) = minimum cost to transform A[i..] into B[j..]
```

Then:

```text
A[i] === B[j]
    → solve(i + 1, j + 1)

otherwise
    → min(
         insert + solve(i, j + 1),
         delete + solve(i + 1, j),
         substitute + solve(i + 1, j + 1)
      )
```

The state graph is the same as tabulation's graph.

Only the evaluation strategy differs.

---

## 10. Weighted Edit Distance

The unit-cost model is only one instance of a larger optimization problem.

Define:

```text
insertCost(character)
deleteCost(character)
substituteCost(from, to)
```

Then each transition receives its own cost.

The recurrence becomes:

```text
dp[i][j] = min(
    dp[i][j - 1] + insertCost(B[j - 1]),
    dp[i - 1][j] + deleteCost(A[i - 1]),
    dp[i - 1][j - 1] + substituteCost(A[i - 1], B[j - 1])
)
```

The state remains unchanged because future cost depends only on the current prefixes and the chosen final operation.

---

## 11. Operation Sets Matter

Do not automatically use the classic three-operation recurrence.

If the allowed operations are changed, the state transitions must change.

Examples:

```text
insert + delete only
insert + delete + substitute
insert + delete + transpose
custom domain-specific edits
```

The operation contract is part of the algorithm specification.

A recurrence can be mathematically correct for one edit model and wrong for another.

---

## 12. Insert/Delete-Only Distance

If substitution is forbidden, the problem reduces to preserving a common subsequence.

For ordinary unit costs:

```text
insert/delete distance = m + n - 2 × LCS(A, B)
```

This connects Lesson 09 directly to Lesson 11.

The same transformation problem can therefore be viewed through two different DP models:

```text
LCS → maximize preserved structure
Edit DP → minimize transformation cost
```

Recognizing equivalent formulations is an important advanced-DP skill.

---

## 13. Edit Script Reconstruction

The distance alone may not be enough.

A real system may require:

```text
INSERT
DELETE
MATCH
SUBSTITUTE
```

To reconstruct an edit script, retain parent decisions or the full DP table.

At `(i, j)`, follow a predecessor that satisfies:

```text
currentCost = predecessorCost + operationCost
```

Reverse the collected operations if reconstructing from the end toward the beginning.

Always validate the resulting script by applying it to the source.

---

## 14. Tie-Breaking

Several edit scripts can have the same minimum cost.

Possible output contracts include:

```text
any optimal script
minimum substitutions among optimal scripts
minimum operations
prefer match
prefer substitution
prefer insertion/deletion
lexicographically constrained output
```

Tie-breaking is not automatically free.

A deterministic parent order gives deterministic output, but does not necessarily satisfy a semantic tie-break such as minimum substitutions.

---

## 15. Counting Optimal Edit Scripts

If the task asks for the number of minimum-cost scripts, storing only the minimum cost is insufficient.

Each state may need:

```text
bestCost
numberOfWaysAchievingBestCost
```

For every transition with strictly better cost:

```text
bestCost = candidateCost
count = predecessorCount
```

For a transition tied with the current optimum:

```text
count += predecessorCount
```

The counting semantics must define whether distinct operation sequences, aligned outputs, or equivalent transformations are counted.

Use `BigInt` or modular arithmetic when counts exceed safe integer range.

---

## 16. Bounded Edit Distance

Sometimes the caller only needs to know whether:

```text
distance(A, B) <= k
```

Computing the entire `m × n` table may be unnecessary.

A banded DP can restrict computation to cells near the main diagonal:

```text
|i - j| <= k
```

For unit-cost Levenshtein distance, any path whose distance is at most `k` cannot drift arbitrarily far from the diagonal.

This can reduce work substantially when `k` is small relative to string length.

---

## 17. Early Termination and Threshold Semantics

For threshold queries:

```text
is distance <= k?
```

we can use bounded representations and stop when a row's minimum possible value already exceeds the threshold under a justified implementation.

Do not confuse:

```text
distance computation
```

with:

```text
threshold decision
```

A decision problem may admit stronger pruning than an exact-value problem.

---

## 18. Memory Optimization

For distance only, two rows are sufficient:

```text
previous[j]
current[j]
```

With one-row compression, preserve the previous diagonal value before overwriting the cell.

The dependency pattern is similar to one-row LCS:

```text
left
up
oldDiagonal
```

The invariant must explicitly state which logical state each variable represents.

Never compress a DP table merely because the table "looks similar" to another problem.

---

## 19. Banded DP

When a maximum distance `k` is known, compute only:

```text
j ∈ [i-k, i+k]
```

within valid bounds.

Outside the band, states cannot participate in a path whose total cost stays within the threshold.

For small `k`, approximate work becomes:

```text
O((m + n)k)
```

rather than `O(mn)`.

The exact complexity and constants depend on the implementation and relative string lengths.

---

## 20. Long-String Engineering

A production string-distance service should not blindly allocate:

```text
(m + 1) × (n + 1)
```

cells for arbitrary user input.

Define operational limits such as:

```text
maximum source length
maximum target length
maximum k
CPU budget
memory budget
request timeout/cancellation
```

For large inputs, select an algorithm based on the actual contract:

```text
exact distance
threshold only
witness/edit script
small threshold
large threshold
```

Algorithm selection is part of production engineering.

---

## 21. Unicode Semantics in JavaScript

JavaScript string indexing uses UTF-16 code units.

Therefore:

```js
"😀".length === 2;
```

If the application defines an edit as operating on Unicode code points, tokenize explicitly:

```js
const chars = Array.from(text);
```

For grapheme clusters, code points are still not necessarily equivalent to user-perceived characters.

The algorithm's unit of comparison must be defined before complexity and correctness claims are made.

---

## 22. Normalization

Text may have multiple Unicode representations that look equivalent to users.

For example, an accented character can sometimes be represented as:

```text
precomposed code point
```

or:

```text
base character + combining mark
```

A text-normalization policy can therefore affect edit distance.

Possible contracts include:

```text
raw code-unit distance
code-point distance
normalized Unicode distance
grapheme-aware distance
```

Normalization is a domain decision, not something the DP recurrence can infer.

---

## 23. Damerau-Levenshtein / Transposition Extensions

If adjacent transposition is allowed, the classic three-transition recurrence is no longer sufficient.

A common Damerau-style extension introduces a transition such as:

```text
A[i - 1] ↔ A[i - 2]
B[j - 1] ↔ B[j - 2]
```

when the appropriate characters are crossed.

More general transposition models can require additional historical information or different algorithms.

This is a valuable lesson:

> When a new operation depends on more history, the state may need to become richer.

---

## 24. Restricted vs General Transpositions

Not all algorithms called "Damerau-Levenshtein" implement the same operation model.

You must specify whether transpositions can:

- occur independently;
- overlap;
- involve arbitrary distances;
- repeat through complex interactions.

Do not mix recurrence formulas from different definitions.

The operation algebra determines the state graph.

---

## 25. Edit Distance as Shortest Path

View every DP state `(i, j)` as a node.

Edges represent edits:

```text
(i, j) → (i, j + 1)       insert
(i, j) → (i + 1, j)       delete
(i, j) → (i + 1, j + 1)   match/substitute
```

Each edge has an operation cost.

Then edit distance is the shortest path from:

```text
(0, 0)
```

to:

```text
(m, n)
```

The grid is acyclic because both coordinates never decrease.

This graph view explains why dynamic programming works so naturally.

---

## 26. Relation to Sequence Alignment

Lesson 09 treated alignment as an optimization over matches, gaps, and scores.

Edit distance uses the same state geometry but interprets transitions as transformation operations with costs.

Conceptually:

```text
LCS
  → maximize similarity

alignment
  → optimize alignment score

edit distance
  → minimize transformation cost
```

These are not isolated tricks. They are variations of a common two-sequence state graph.

---

## 27. Similarity Scores

A system may convert distance into a normalized similarity score, for example:

```text
similarity = 1 - distance / max(m, n)
```

But normalization is an application-level metric, not part of Levenshtein correctness.

Two strings with the same normalized distance may have very different operational meanings depending on domain vocabulary and length.

Do not confuse a useful product metric with the underlying DP objective.

---

## 28. Approximate Matching

Edit distance can support approximate lookup:

```text
query
  ↓
shortlist candidates
  ↓
compute bounded edit distance
  ↓
accept if distance <= threshold
```

For large databases, computing exact DP against every candidate is often too expensive.

A production architecture may therefore use indexing or candidate-generation techniques before exact DP validation.

The DP becomes the deterministic verification layer.

---

## 29. Backend Applications

Edit-distance DP appears in:

- typo-tolerant search
- username suggestions
- duplicate detection
- version/config comparison
- migration validation
- command correction
- data-cleaning pipelines
- reconciliation services
- fuzzy matching

For an API, expose explicit limits:

```text
maxInputLength
maxDistance
normalizationMode
comparisonUnit
returnScript
```

Reject or route pathological workloads before allocating large matrices.

---

## 30. AI Engineering Applications

Edit distance is useful around AI systems as a deterministic evaluator or constraint layer:

```text
AI-generated candidate
        ↓
exact edit-distance validation
        ↓
threshold / ranking / repair
```

Examples include:

- comparing generated structured text to an expected format;
- measuring small transformations between model outputs;
- validating controlled modifications;
- ranking candidate corrections;
- detecting near-duplicate generated artifacts.

For semantic similarity, edit distance alone is insufficient because it operates on sequence-level transformations rather than meaning.

---

## 31. Differential Testing

For short strings, build an exhaustive or recursive oracle.

Then compare:

```text
brute-force transformation search
vs
full-table DP
vs
rolling-row DP
vs
banded DP for threshold cases
```

For reconstructed scripts, apply the script to the source and verify:

```text
result === target
scriptCost === reportedDistance
```

This validates both optimization and reconstruction.

---

## 32. Metamorphic Testing

Useful properties include:

- `distance(A, A) = 0`;
- `distance(A, B) = distance(B, A)` for symmetric unit-cost Levenshtein distance;
- `distance(A, "") = A.length` under unit deletion cost and the chosen character model;
- equivalent implementations must agree on the same operation model;
- adding identical prefixes to both strings should preserve the distance under ordinary unit costs.

Do not blindly apply these properties to asymmetric weighted costs.

---

## 33. Adversarial Cases

Test:

```text
empty strings
one-character strings
identical strings
completely different strings
repeated characters
alternating characters
very asymmetric lengths
long common prefix
long common suffix
many equally optimal edit scripts
Unicode surrogate pairs
combining marks
large threshold k
k = 0
```

Repeated characters are especially valuable because they create many alternative optimal paths.

---

## 34. Numeric Safety

Classic unit-cost distance is at most roughly:

```text
max(m, n)
```

under the standard model, so ordinary `Number` is sufficient for realistic string lengths.

Weighted/custom cost models can have much larger values.

If costs or counts can exceed JavaScript's safe integer range, use `BigInt` consistently or apply a carefully specified numeric representation.

Do not mix `Number` and `BigInt` arithmetic.

---

## 35. Correctness Invariant

For full-table Levenshtein DP:

> `dp[i][j]` equals the minimum cost of every valid transformation from `A[0..i-1]` to `B[0..j-1]` under the declared operation model.

The proof uses induction over increasing prefix lengths.

Every optimal transformation ends with one legal operation represented by a recurrence candidate, and every recurrence candidate constructs a legal transformation.

Therefore the minimum candidate is exactly the optimum.

---

## 36. Interview Derivation Framework

When you see an edit/transformation problem:

1. Define the source and target units.
2. List the legal operations.
3. Decide whether costs are uniform or weighted.
4. Define the smallest sufficient prefix/suffix state.
5. Enumerate the possible final operations.
6. Derive each predecessor state.
7. Add the operation cost.
8. Derive empty-prefix base cases.
9. Establish dependency order.
10. Decide whether reconstruction is required.
11. Analyze whether space can be compressed.
12. Check whether a distance threshold enables banding/pruning.
13. State the exact operation semantics.
14. Validate against a brute-force oracle for small cases.

This is the reusable method, not merely the Levenshtein formula.

---

## 37. Common Failure Modes

### Mistake 1 — Wrong state meaning

Writing a table before defining what a cell represents.

### Mistake 2 — Missing an operation

Using the classic recurrence even when the operation set changed.

### Mistake 3 — Wrong base cases

Forgetting that empty-to-nonempty requires insertions and nonempty-to-empty requires deletions.

### Mistake 4 — Confusing distance with similarity

A transformed product metric is not the same as the underlying optimization objective.

### Mistake 5 — Incorrect reconstruction

Returning a script whose reported cost does not equal its actual cost.

### Mistake 6 — Unicode assumptions

Treating JavaScript string length as a count of user-perceived characters.

### Mistake 7 — Unsafe banding

Restricting the DP band without proving that excluded states cannot participate in a valid threshold solution.

### Mistake 8 — Unbounded API input

Allocating an `O(mn)` matrix for attacker-controlled strings without limits.

---

## 38. Master Pattern

The complete mental model is:

```text
Define transformation contract
        ↓
Define prefix/suffix state
        ↓
Enumerate final operations
        ↓
Map each operation to predecessor state
        ↓
Add operation cost
        ↓
Take MIN / MAX / COUNT as required
        ↓
Establish dependency order
        ↓
Compute value
        ↓
Optionally reconstruct path/script
        ↓
Optimize memory only after proving dependencies
        ↓
Add threshold/banding only with correctness proof
        ↓
Validate with brute force + adversarial tests
```

Once this becomes automatic, many two-sequence transformation problems stop looking like separate algorithms.

---

## 39. Revision Checklist

Before considering this lesson mastered, you should be able to explain from first principles:

- [ ] What exactly does `dp[i][j]` mean?
- [ ] Why are empty-prefix states the base cases?
- [ ] Why are insert/delete/substitute the complete final decisions?
- [ ] Why does each operation point to its specific predecessor?
- [ ] Why is the recurrence a minimum?
- [ ] How do weighted costs change the transition?
- [ ] How does insert/delete-only distance connect to LCS?
- [ ] How do you reconstruct an edit script?
- [ ] How do you count optimal scripts?
- [ ] Why can tie-breaking alter implementation requirements?
- [ ] How does rolling-row compression work?
- [ ] Why must the old diagonal be preserved in one-row DP?
- [ ] When can banded DP be used safely?
- [ ] How do transposition operations change the state model?
- [ ] What is the shortest-path interpretation?
- [ ] What Unicode unit does your implementation operate on?
- [ ] How would you guard an edit-distance backend API?
- [ ] How could edit distance be used as a deterministic AI validation layer?
- [ ] How would you prove the recurrence correct?
- [ ] How would you differential-test the implementation?

---

## 40. Final Takeaway

Edit Distance is not fundamentally a memorized `min(...)` formula.

It is an instance of a general DP design process:

> **State = what transformation prefix has been completed.**
>
> **Decision = what legal operation happens next/last.**
>
> **Transition = move to the state before that operation.**
>
> **Value = accumulated transformation cost.**
>
> **Objective = minimum valid cost.**

The deeper lesson is that changing the operation set, cost model, threshold, reconstruction requirement, or comparison unit can change the state graph and implementation.

That is the level at which Dynamic Programming becomes a reasoning skill rather than a collection of interview formulas.
