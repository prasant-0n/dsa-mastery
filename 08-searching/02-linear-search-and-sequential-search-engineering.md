# 08.02 — Linear Search & Sequential Search Engineering

## 1. Definition

Linear search, or sequential search, examines candidates in a defined sequence until the required condition is satisfied or the search space is exhausted.

```text
candidate 0 → candidate 1 → candidate 2 → ... → candidate n-1
```

It requires no ordering of the input.

## 2. Why It Exists

Linear search is the fundamental baseline for unordered search.

It is useful when:

- the dataset is small;
- the query is infrequent;
- data is unsorted;
- preprocessing is too expensive;
- the desired condition may be found early;
- only one pass over a stream is possible.

## 3. Mental Model

At each step, the algorithm maintains a simple invariant:

> Every candidate already examined has been correctly classified.

For existence search:

```text
examined prefix → target absent from that prefix
unexamined suffix → still possible
```

## 4. Core Algorithm

```text
for each candidate:
    evaluate predicate
    if predicate is true:
        return result
return not-found
```

The algorithm is correct because every candidate is examined before it can be eliminated.

## 5. Complexity

For `n` candidates:

| Case | Time |
|---|---:|
| Best | O(1) |
| Average | O(n) |
| Worst | O(n) |

Iterative linear search normally uses:

```text
Auxiliary space → O(1)
```

unless additional result storage is required.

## 6. Predicate Cost Matters

If each candidate evaluation costs `C(n)`, total work is:

```text
O(n · C(n))
```

For example, searching `n` strings while comparing each string in `O(L)` gives approximately:

```text
O(nL)
```

The cost of examining a candidate is part of the algorithm.

## 7. First Match

For a first-match search, immediately returning the first valid candidate gives:

- best case `O(1)`;
- worst case `O(n)`.

The ordering of the input can therefore affect observed latency even though the asymptotic worst case remains unchanged.

## 8. Last Match

Finding the last matching candidate requires examining the complete search space unless additional structure exists.

A typical implementation records the latest valid position:

```text
answer = not-found
for each candidate:
    if valid:
        answer = candidate
return answer
```

## 9. All Matches

Enumeration requires visiting every candidate.

If `k` matches are returned:

```text
Time → O(n + k)
```

where `k` is output size. Since `k <= n`, this is still `O(n)` in the usual array setting.

## 10. Sentinel / Not-Found Semantics

Choose the absence representation deliberately:

```text
-1
null
undefined
false
empty array
```

Do not confuse a valid result such as index `0` with a falsy absence value.

## 11. Equality Semantics

Searching depends on what “equal” means.

Possible semantics include:

- strict primitive equality;
- normalized strings;
- object identity;
- selected object fields;
- case-insensitive matching;
- domain-specific equality.

The equality contract should be explicit before implementation.

## 12. Custom Predicates

A generic sequential search can accept a predicate:

```text
search(collection, predicate)
```

This turns linear search into a general filtering/traversal primitive.

Examples:

```text
first active user
first failed request
first value above threshold
first matching record
```

## 13. Early Termination

Early termination is an optimization only when the required answer permits it.

Safe:

```text
find first match → stop at first match
```

Unsafe:

```text
find maximum → stop at first large value
```

unless the problem provides additional ordering or bounds.

## 14. Multiple Conditions

A search may combine predicates:

```text
active AND premium AND region === targetRegion
```

Evaluate cheap/selective conditions early when doing so preserves semantics and measurably reduces work.

This is a practical engineering optimization, not an asymptotic improvement.

## 15. Short-Circuit Reasoning

For compound predicates:

```text
A && B && C
```

if `A` is false, later predicates need not run.

Therefore predicate ordering can affect real performance.

Consider:

- computational cost;
- probability of rejection;
- side effects;
- correctness dependencies.

## 16. Search in Arrays

JavaScript provides many built-in sequential operations:

```text
find
findIndex
some
includes
indexOf
lastIndexOf
filter
```

Understand their semantics before implementing custom loops.

The underlying algorithmic question remains the same: how many candidates must be inspected?

## 17. Search in Objects

For object collections, distinguish:

```text
property lookup
```

from:

```text
search through object values
```

Direct property lookup uses an indexed/hash-like object mechanism and is conceptually different from scanning every property.

## 18. Search in Linked Structures

Sequential search naturally applies to linked lists because arbitrary random access is unavailable.

Typical complexity:

```text
lookup by value → O(n)
lookup by position → O(n)
```

The absence of random access makes linear traversal the natural baseline.

## 19. Search in Streams

For a stream, the entire dataset may not exist in memory.

Sequential processing is often the only practical strategy:

```text
read item
→ evaluate
→ discard/retain
→ continue
```

Memory can remain `O(1)` for existence or first-match queries.

## 20. Streaming Invariants

For a stream search, maintain only state necessary for the requested answer.

Examples:

```text
first match → current candidate
minimum → current minimum
maximum → current maximum
count → current count
```

This is a key memory-engineering principle.

## 21. Online Search

An online algorithm processes input without requiring future elements.

Linear scans naturally support online processing.

This is valuable for:

- logs;
- events;
- message streams;
- telemetry;
- large files;
- network streams.

## 22. Multiple Queries

Repeated linear scans cost approximately:

```text
O(QN)
```

for `Q` queries over `N` records.

This often motivates preprocessing:

```text
build index → query efficiently
```

The index may be a Map, Set, sorted structure, database index, or search engine index.

## 23. When Linear Search Wins in Practice

Asymptotically faster algorithms are not automatically faster for every workload.

Linear search can be effective when:

- `N` is small;
- data is contiguous;
- the query is one-shot;
- matches are frequently near the beginning;
- preprocessing is expensive;
- the predicate is cheap;
- cache locality is excellent.

These are workload-dependent observations, not universal guarantees.

## 24. Cache Locality

A sequential scan over a contiguous array can exploit spatial locality.

Conceptually:

```text
A[0], A[1], A[2], A[3] ...
```

are often physically close in memory representations used by runtimes.

This can make a simple scan highly efficient despite `O(n)` complexity.

JavaScript engines have additional runtime-specific representation details, so avoid assuming a single fixed physical layout.

## 25. Branch Behavior

A search loop often contains a branch:

```text
if (candidate matches)
```

Branch behavior can affect real CPU performance, especially in low-level implementations and very large workloads.

For JavaScript applications, higher-level costs such as allocation, callbacks, runtime optimization, and data representation may also dominate.

## 26. Callback vs Loop Overhead

Built-in methods such as `find` and `some` are expressive, but callback invocation has runtime overhead.

For ordinary application code, clarity is usually more important than micro-optimization.

For hot paths, benchmark the actual workload before changing implementation style.

## 27. Stable Search Semantics

A production search API should document:

```text
input assumptions
equality semantics
return value
not-found behavior
ordering behavior
mutation behavior
error behavior
```

This prevents subtle caller-side bugs.

## 28. Defensive Validation

Validation may include:

- collection type;
- predicate type;
- required fields;
- malformed records.

Do not blindly validate every element if validation itself dominates the operation and trusted boundaries already guarantee correctness.

## 29. Error vs Not Found

These states are different:

```text
valid search + no match
```

versus:

```text
invalid input / operational failure
```

A production API should not silently convert operational failures into “not found.”

## 30. Backend Applications

Linear search appears in:

- small configuration lists;
- middleware chains;
- route candidate evaluation;
- authorization rules;
- retry policies;
- feature configuration;
- request validation;
- in-memory queues and collections;
- log/event streams.

For large repeated lookups, an index is usually considered instead.

## 31. AI Applications

Sequential search can be used for:

- scanning small candidate sets;
- rule-based filtering;
- post-retrieval filtering;
- evaluating generated candidates;
- threshold checks;
- dataset validation;
- streaming token/event processing.

Large-scale retrieval normally introduces indexes or specialized approximate/exact search structures.

## 32. Search vs Filter

These are different goals:

```text
find → one matching result
filter → all matching results
```

A filter cannot generally stop after the first match.

Choosing the wrong operation can create unnecessary work or incorrect semantics.

## 33. Search vs Membership

Membership asks:

```text
Does any candidate satisfy equality?
```

Position search asks:

```text
Where is the candidate?
```

Enumeration asks:

```text
Which candidates satisfy the condition?
```

These distinctions should be explicit in API design.

## 34. Correctness Proof

For first-match search:

### Initialization
Before scanning, no elements have been classified.

### Maintenance
After examining positions before `i`, none is a valid match; therefore if `A[i]` matches, it is the first match.

### Termination
Either a match is found or every candidate has been examined.

Therefore the algorithm returns the first matching candidate if one exists, otherwise not-found.

## 35. Common Mistakes

1. Returning the wrong duplicate occurrence.
2. Confusing index `0` with not-found.
3. Mutating the input unexpectedly.
4. Forgetting empty input.
5. Using an expensive predicate repeatedly without noticing its cost.
6. Returning early when the problem requires all matches.
7. Repeating linear scans when an index is appropriate.
8. Treating errors as absence.
9. Assuming `O(n)` says everything about practical performance.
10. Optimizing micro-level code before measuring.

## 36. Edge Cases

Test:

- empty collection;
- one element;
- first element matches;
- last element matches;
- no match;
- every element matches;
- duplicate matches;
- falsy values;
- `null`/`undefined` where allowed;
- malformed records;
- expensive predicates;
- very large streams.

## 37. Implementation Lab

Implement and compare:

1. first-match search;
2. last-match search;
3. all-match enumeration;
4. predicate-based search;
5. minimum/maximum scan;
6. stream search;
7. indexed repeated-query alternative.

For each, record the invariant and complexity.

## 38. Benchmarking Lab

Compare:

```text
for loop
Array.find
Array.some
Map/Set after preprocessing
sorted array + binary search
```

Vary:

- collection size;
- match position;
- match frequency;
- query count;
- predicate cost;
- key size.

Measure actual latency before drawing performance conclusions.

## 39. Interview Questions

1. Why is linear search `O(n)`?
2. What is its best case?
3. Why is searching a linked list naturally linear?
4. When would you prefer linear search over binary search?
5. When does preprocessing become worthwhile?
6. What changes when the predicate costs `O(k)`?
7. How do you search a stream with `O(1)` extra memory?
8. How do first-match and all-match searches differ?
9. How does input ordering affect practical latency?
10. How would you optimize repeated searches?

## 40. Backend Engineering Exercise

Design a request-policy evaluator that scans rules sequentially.

Document:

```text
rule ordering
match semantics
first-match behavior
fallback behavior
error handling
complexity
metrics
```

Then identify when a Map, sorted structure, or database index would be more appropriate.

## 41. AI Engineering Exercise

Design a streaming candidate filter.

Input:

```text
candidate stream
```

For each candidate:

```text
validate
→ apply filters
→ optionally stop early
→ emit result
```

Specify memory usage, predicate costs, and termination conditions.

## 42. Revision Checklist

- [ ] I can implement first-match linear search.
- [ ] I can implement last-match and all-match variants.
- [ ] I understand predicate cost.
- [ ] I can explain best/average/worst cases.
- [ ] I understand streaming search.
- [ ] I can reason about repeated-query costs.
- [ ] I know when preprocessing changes the trade-off.
- [ ] I understand cache locality at a high level.
- [ ] I distinguish search, membership, and filtering.
- [ ] I can prove a sequential search correct.
- [ ] I can design a production search contract.
- [ ] I can benchmark before optimizing.

## 43. Key Takeaways

1. **Linear search is the universal baseline for unordered sequential data.**
2. **Its fundamental invariant is that examined candidates have been correctly classified.**
3. **Early termination changes best-case behavior but not the general worst-case bound.**
4. **The cost of the predicate must be included in the true complexity.**
5. **Sequential search naturally supports streams and online processing.**
6. **Repeated `O(n)` queries often justify preprocessing or indexing.**
7. **Real performance depends on workload, memory locality, predicate cost, and runtime behavior—not asymptotic notation alone.**
8. **Search semantics—first, last, any, all, nearest, or existence—must be defined explicitly.**
9. **Production systems must distinguish not-found from invalid input or operational failure.**
10. **Mastery means knowing when a simple scan is sufficient and when the search space deserves an index or stronger algorithm.**
