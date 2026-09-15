# 03.24 — Phase 03 Mastery & Capstone

## Phase Objective

This is the final gate for **Phase 03 — Arrays & Strings**.

The goal is not to memorize array and string patterns. The goal is to demonstrate that you can take an unfamiliar problem, model it, select the right representation and algorithm, prove it, analyze it, implement it in JavaScript, test it adversarially, and explain the engineering trade-offs.

```text
problem
→ contract
→ constraints
→ candidate space
→ brute force
→ bottleneck
→ representation
→ pattern
→ state
→ invariant
→ proof
→ complexity
→ implementation
→ validation
→ engineering trade-offs
```

---

# 1. Phase 03 Knowledge Map

You should now be able to reason across:

- array memory and mutation;
- traversal and iteration;
- insertion/deletion;
- linear and binary searching;
- prefix/suffix techniques;
- two pointers;
- frequency counting;
- subarrays and subsequences;
- matrices and 2D arrays;
- in-place techniques;
- sorting and sort-based patterns;
- intervals;
- string fundamentals;
- character frequency;
- string matching;
- palindromes;
- anagrams and normalization;
- advanced array/string patterns;
- backend applications;
- AI applications;
- performance engineering;
- integrated problem synthesis.

The important skill is connecting them rather than studying them as isolated chapters.

---

# 2. The Phase 03 Mastery Standard

A solution is considered mastered only when you can answer:

```text
1. What exactly is the input contract?
2. What exactly must be returned?
3. What are the constraints?
4. How large is the candidate space?
5. What is the brute-force algorithm?
6. What makes brute force expensive?
7. What information is repeated?
8. What structure can be exploited?
9. Which representation makes that structure useful?
10. What state must be maintained?
11. What invariant does that state satisfy?
12. Why is every optimization safe?
13. What is the time complexity?
14. What is the auxiliary-space complexity?
15. What is the peak live memory?
16. What edge cases can break the solution?
17. How would you differential-test it?
18. What changes at production scale?
19. Why are alternative strategies worse?
20. Can I explain the solution without memorizing it?
```

---

# 3. Capstone Track A — Algorithm Derivation

For each capstone problem, begin with a blank page.

Do **not** start by searching for the known pattern.

Write:

```text
Contract
Constraints
Candidate space
Brute force
Bottleneck
Useful property
Representation
State
Invariant
Optimization
Complexity
```

Only then implement.

This prevents pattern memorization from replacing algorithmic thinking.

---

# 4. Capstone Track B — Implementation

Implement every final solution in JavaScript.

Review:

- correctness;
- mutation contract;
- numeric behavior;
- Unicode behavior where relevant;
- allocation behavior;
- deterministic ordering;
- input validation;
- output shape;
- complexity;
- readability.

A correct algorithm with an incorrect mutation contract is not a production-quality solution.

---

# 5. Capstone Track C — Interview Defense

For every solution, explain it in approximately this order:

```text
Brute force
→ bottleneck
→ observation
→ optimized representation
→ algorithm
→ invariant
→ correctness
→ complexity
→ edge cases
→ trade-offs
```

The interviewer should be able to see that you derived the solution rather than remembered it.

---

# 6. Capstone Problem Families

The final exercises deliberately mix patterns.

Expect combinations such as:

```text
prefix sum + hashing
sorting + two pointers
sliding window + frequency
binary search + greedy feasibility
intervals + sweep line
heap + ordered streams
normalization + hashing
matrix traversal + state
Top-K + bounded memory
streaming + approximate state
```

Some problems intentionally contain misleading signals. You must determine which technique actually fits the contract.

---

# 7. Capstone Complexity Gate

For each solution derive complexity from the code, not from memory.

Record:

```text
N = primary input size
M = secondary input size
Q = query count
K = requested output/selection size
R,C = matrix dimensions
U = unique values/characters
D = vector or feature dimension where relevant
```

Do not collapse independent parameters unnecessarily.

Example:

```text
O(N log N + Q log N)
```

is more informative than vaguely saying `O(N log N)` when both preprocessing and query work matter.

---

# 8. Capstone Memory Gate

For every problem distinguish:

```text
input space
auxiliary space
output space
peak live memory
temporary allocations
```

Ask whether a theoretically optimal algorithm is practical under the memory limit.

A streaming algorithm may beat a materializing algorithm even when both have the same asymptotic time complexity.

---

# 9. Capstone Correctness Gate

Every optimized solution needs a correctness argument.

Use:

### Invariant
What remains true throughout execution?

### Progress
Why does the algorithm move toward termination?

### Completeness
Why can no valid answer be lost?

### Soundness
Why is every reported answer valid?

This is especially important for:

- two pointers;
- sliding windows;
- binary search;
- pruning;
- Top-K;
- interval sweep;
- state compression.

---

# 10. Capstone Testing Gate

Build a small brute-force oracle whenever practical.

Then compare:

```text
oracle(input) === optimized(input)
```

Use:

- empty inputs;
- singleton inputs;
- duplicates;
- negative values;
- all equal values;
- sorted inputs;
- reverse-sorted inputs;
- extreme boundaries;
- no-match cases;
- maximal-match cases;
- random small cases;
- pathological cases.

---

# 11. Metamorphic Testing Gate

Use transformations with predictable outcomes.

Examples:

```text
reverse(reverse(A)) = A
sort(sort(A)) = sort(A)
normalize(normalize(S)) = normalize(S)
```

For anagram detection:

```text
anagram(A,B) should remain true after applying the same permutation to both.
```

For frequency analysis:

```text
permutation(input) should preserve frequency counts.
```

---

# 12. Backend Capstone Lens

When a problem resembles backend infrastructure, ask:

```text
What happens at 10M records?
What happens with concurrent requests?
Can input be streamed?
Can memory be bounded?
Can results be paginated?
Is deterministic ordering required?
What happens under skew?
Can preprocessing be amortized?
Can the operation be sharded?
What is the failure mode?
```

Typical mappings:

| DSA | Backend |
|---|---|
| hashing | deduplication/indexing |
| prefix state | cumulative metrics |
| two pointers | ordered stream merge |
| sliding window | rate limiting |
| intervals | booking/scheduling |
| heap | Top-K/job priority |
| binary search | threshold/capacity selection |
| strings | validation/search/autocomplete |
| matrix | grid/state processing |

---

# 13. AI Capstone Lens

For AI-oriented problems ask:

```text
What is N?
What is K?
What is D?
Can candidates be reduced before expensive scoring?
Can the data be streamed?
Can memory be bounded?
Is exact search required?
Can approximate retrieval be accepted?
What is the quality/latency trade-off?
```

Typical mappings:

| DSA | AI |
|---|---|
| arrays | tensors/sequences |
| strings | text/tokens |
| frequency maps | vocabulary statistics |
| sliding windows | context windows |
| Top-K | candidate selection |
| merge | ranked retrieval fusion |
| hashing | signatures/dedup |
| binary search | threshold tuning |
| matrices | embeddings/logits |
| streaming | inference/evaluation pipelines |

---

# 14. Capstone Scenario A — Massive Event Deduplication

A service receives sorted event streams from many workers.

Return the latest `K` unique events with bounded memory.

You must decide:

- uniqueness key;
- ordering semantics;
- tie-breaking;
- merge strategy;
- duplicate handling;
- memory bound;
- failure behavior.

Potential techniques include k-way merge, hashing, and bounded selection.

Do not assume one technique is automatically correct.

---

# 15. Capstone Scenario B — Search Suggestions

Given a large collection of strings and repeated prefix queries:

```text
prefix → ranked suggestions
```

Consider:

- normalization;
- sorting;
- binary search bounds;
- trie representation;
- Top-K selection;
- memory;
- repeated-query preprocessing.

The correct solution depends on workload and constraints.

---

# 16. Capstone Scenario C — Token Window Processing

A model pipeline receives a huge token stream and must process overlapping windows.

Analyze:

```text
window size
stride
number of generated windows
memory
copy vs view
batching
padding
ordering
```

Do not materialize all windows if the workload can be processed incrementally.

---

# 17. Capstone Scenario D — Capacity Planning

Given workloads and a maximum number of processing days, find the minimum capacity that satisfies the constraint.

The challenge is to derive:

```text
feasible(capacity)
```

and prove monotonicity.

Then apply binary search on the answer.

---

# 18. Capstone Scenario E — Ranked Retrieval Fusion

Several systems return sorted candidate lists.

Produce the best unique `K` candidates.

Consider:

- k-way merge;
- duplicate identities;
- score ties;
- deterministic ordering;
- bounded memory;
- candidate quality;
- expensive downstream reranking.

This models a common backend/AI algorithmic pipeline.

---

# 19. Final Phase Review

Before leaving Phase 03, verify that you can implement without reference:

```text
linear search
binary search
lower bound
prefix sums
suffix state
two pointers
sliding window
frequency map
subarray sum with prefix hashing
Kadane's algorithm
matrix traversal
transpose/rotation
in-place compaction
merge intervals
sweep line
Top-K
k-way merge
naive string matching
prefix-function/KMP foundations
palindrome algorithms
anagram grouping
normalization
```

You do not need to memorize every implementation character-for-character.

You must understand the derivation and be able to reconstruct it.

---

# 20. Final Anti-Memorization Test

Take an unfamiliar problem.

Hide the topic name.

Do not search for its solution.

Then determine:

```text
What is the candidate space?
What is the brute force?
What structure does the input expose?
What information can be discarded?
What state is sufficient?
What invariant makes the discard safe?
```

If you can derive the algorithm, you have learned the concept.

If you only recognize the problem after seeing the title, you need more practice.

---

# 21. Phase 03 Exit Criteria

Phase 03 is complete when all of the following are true:

- [ ] All chapter exercises have been attempted.
- [ ] Brute-force baselines can be written for unfamiliar problems.
- [ ] Common array/string patterns can be derived rather than guessed.
- [ ] Pattern composition feels natural.
- [ ] Invariants can be stated before implementation.
- [ ] Complexity can be derived from code.
- [ ] Memory behavior can be explained.
- [ ] Edge cases are generated systematically.
- [ ] Optimized solutions can be differential-tested.
- [ ] Backend use cases can be recognized.
- [ ] AI use cases can be recognized.
- [ ] Trade-offs can be defended in interviews.
- [ ] You can solve unfamiliar problems without relying on memorized templates.

---

# 22. What Phase 03 Gives You

After Phase 03, arrays and strings should no longer feel like separate beginner topics.

They become a general algorithmic medium for:

```text
search
aggregation
filtering
selection
matching
streaming
state tracking
ranking
scheduling
retrieval
text processing
backend data pipelines
AI candidate pipelines
```

The deeper lesson is:

> **Algorithm design is largely the art of choosing what information to preserve, what information to discard, and proving that the discarded information cannot change the answer.**

---

# Final Takeaways

1. Model before coding.
2. Estimate the candidate space.
3. Build a brute-force baseline when possible.
4. Find the repeated work.
5. Choose a representation that exposes useful structure.
6. Maintain only sufficient state.
7. Define the invariant.
8. Prove every candidate elimination.
9. Derive complexity instead of guessing it.
10. Treat memory and allocation as part of the algorithm.
11. Test adversarially and differentially.
12. Consider backend and AI production constraints.
13. Prefer measured optimization over cleverness.
14. Know when a simpler algorithm is better.
15. Most importantly: **derive, implement, prove, analyze, test, and defend.**

---

# Phase 03 Status

**Phase 03 — Arrays & Strings: COMPLETE**

The next phase is:

> **Phase 04 — Recursion**

Arrays and strings should now serve as foundational building blocks for the deeper data structures and algorithms ahead.
