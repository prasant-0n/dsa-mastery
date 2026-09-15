# 08.05 — Binary Search on Answer & Monotonic Feasibility

## 1. Concept Definition

Binary search on answer applies binary search to an ordered **answer domain** rather than directly searching an input array.

The central transformation is:

```text
optimization problem
        ↓
choose candidate answer X
        ↓
ask: is X feasible?
        ↓
monotonic predicate
        ↓
binary-search the boundary
```

Typical objective:

```text
find the minimum X such that feasible(X) === true
```

or:

```text
find the maximum X such that feasible(X) === true
```

## 2. Why This Pattern Exists

Many optimization problems appear to require trying every possible answer.

For example:

```text
minimum capacity
minimum processing rate
minimum time
maximum allowable load
maximum distance
```

If feasibility changes monotonically as the candidate answer changes, most candidates can be eliminated without testing them individually.

## 3. The Key Insight

Do not immediately ask:

> How do I construct the optimal answer?

Instead ask:

> If I guess an answer `X`, can I efficiently determine whether `X` is sufficient?

This converts an optimization problem into a decision problem.

## 4. Candidate Answer Space

The first step is to define valid answer bounds.

Example:

```text
minimum capacity ∈ [1, totalWork]
```

For a rate problem:

```text
rate ∈ [1, maximumRequiredRate]
```

The bounds must contain every possible valid answer.

## 5. Feasibility Predicate

Define:

```text
feasible(X)
```

which returns whether candidate `X` satisfies the problem requirements.

Example:

```text
Can all jobs finish within T hours at rate X?
```

The predicate should solve the decision problem, not the original optimization problem.

## 6. Monotonicity

For minimum-answer problems, the usual structure is:

```text
false false false true true true
```

As `X` increases, feasibility eventually becomes true and remains true.

For maximum-answer problems:

```text
true true true false false false
```

As `X` increases, feasibility eventually becomes false.

Without this property, binary search is not justified.

## 7. Minimum Feasible Answer

Goal:

```text
min X such that feasible(X)
```

Use a first-true boundary search.

Conceptual invariant:

```text
below L → known infeasible
at/after R → known feasible
```

The final boundary is the smallest feasible value.

## 8. Maximum Feasible Answer

Goal:

```text
max X such that feasible(X)
```

Use a last-true boundary search.

Conceptual pattern:

```text
true true true | false false
               ↑
          last feasible
```

## 9. Proving Monotonicity

Never assume monotonicity because the problem “looks like binary search.”

Write the proof explicitly.

For a minimum-feasible problem:

> If `X` is feasible, then every `Y >= X` is also feasible.

For a maximum-feasible problem:

> If `X` is feasible, then every `Y <= X` is also feasible.

The domain and predicate must make the implication true.

## 10. Example: Minimum Capacity

Suppose jobs have workloads:

```text
[4, 7, 3, 8]
```

and must be processed by a fixed number of workers under a particular allocation rule.

Instead of directly finding the minimum capacity, ask:

```text
Can capacity C satisfy all workloads?
```

Then search `C` over its valid range.

The feasibility implementation determines whether the candidate is usable.

## 11. Example: Minimum Processing Rate

Suppose work amounts must finish within a time limit.

Candidate rate:

```text
R
```

Feasibility:

```text
sum(ceil(work[i] / R)) <= timeLimit
```

As `R` increases, required time does not increase.

Therefore the feasibility predicate has a monotonic structure.

## 12. Example: Maximum Minimum Distance

A common opposite form asks for the largest possible minimum separation.

Candidate distance:

```text
D
```

Feasibility:

```text
Can we place all required items with at least D distance between them?
```

If `D` is feasible, every smaller distance is also feasible.

Therefore the pattern is:

```text
true true true false false
```

and we search for the last true.

## 13. Decision Procedure Quality

Binary search does not make an inefficient feasibility check efficient.

If:

```text
feasible(X) = O(N)
```

and the answer range has `R` candidates:

```text
Total = O(N log R)
```

If feasibility is `O(N log N)`, then:

```text
Total = O(N log N log R)
```

The complete cost matters.

## 14. Answer Range Size

The number of binary-search iterations is approximately:

```text
O(log(high - low + 1))
```

For integer domains, this is often written simply as:

```text
O(log R)
```

where `R` represents the answer range.

## 15. Choosing Bounds

Good bounds can simplify correctness and reduce unnecessary work.

Typical techniques:

- derive mathematical minimum;
- derive mathematical maximum;
- use input extrema;
- use total sums;
- use maximum individual requirement;
- use domain constraints.

Do not use arbitrary huge bounds when a tight valid bound can be derived.

## 16. Overflow and Numeric Bounds

In fixed-width integer languages, sums and midpoint arithmetic can overflow.

Use safe arithmetic and wider integer types where required.

JavaScript's `Number` uses floating-point representation, so integer safety must also be considered for values beyond the exact integer range.

For very large exact integers, `BigInt` may be appropriate, subject to API and performance requirements.

## 17. Feasibility Must Be Deterministic

A binary-search predicate should behave consistently for the same candidate.

If:

```text
feasible(X)
```

can randomly change between calls, the monotonic boundary model breaks.

Production systems should isolate nondeterministic external state when possible.

## 18. Feasibility Side Effects

Prefer predicates without side effects.

Bad conceptual design:

```text
feasible(X)
→ mutates shared state
→ next call sees different state
```

Better:

```text
feasible(X)
→ pure decision based on defined inputs
```

This improves correctness, testing, and reproducibility.

## 19. Feasibility Invariants

A good decision procedure should itself have an invariant.

Example:

```text
processed work <= candidate capacity
number of groups <= allowed groups
```

The feasibility proof and binary-search proof are separate layers:

```text
proof of feasible(X)
        +
proof of monotonicity
        +
proof of boundary search
```

## 20. Two-Level Correctness

Binary search on answer requires proving three things:

1. **Feasibility correctness** — the predicate accurately answers the decision question.
2. **Monotonicity** — the predicate changes in only the required direction.
3. **Boundary correctness** — binary search returns the requested first/last feasible value.

A bug in any layer invalidates the final result.

## 21. Greedy Feasibility

Many answer-search problems become tractable because feasibility itself has a greedy solution.

Pattern:

```text
candidate answer X
      ↓
construct/check using greedy rule
      ↓
feasible / infeasible
```

The greedy procedure must be independently justified.

## 22. Example: Partitioning

For workloads that must be divided into at most `K` contiguous groups:

```text
candidate maximum group sum = X
```

A feasibility check can greedily fill the current group until adding the next item would exceed `X`, then start another group.

If the resulting number of groups is `<= K`, the candidate is feasible.

The correctness of this greedy decision procedure must be established before using it inside binary search.

## 23. Why Greedy Works in Some Predicates

The greedy checker is useful when placing an item as early as possible does not make a feasible solution worse under the problem's structure.

This is problem-specific.

Do not infer greedy correctness merely because it is convenient.

## 24. Binary Search + Greedy Pattern

A common interview structure is:

```text
1. Define answer X.
2. Define feasibility(X).
3. Prove feasibility.
4. Prove monotonicity.
5. Establish low/high.
6. Binary-search boundary.
7. Analyze checker × iterations.
```

Recognizing this chain is more important than memorizing individual problems.

## 25. Search Space Transformation

The original problem may have a complicated solution space.

Instead of searching all constructions:

```text
possible arrangements
possible allocations
possible schedules
```

search the scalar objective:

```text
X = capacity / time / distance / rate
```

The decision procedure then answers whether at least one valid construction exists for `X`.

## 26. Feasible Region

Mathematically, define:

```text
F = { X | feasible(X) }
```

For a minimum-feasible problem:

```text
F = [X*, ∞)
```

within the discrete domain.

For a maximum-feasible problem:

```text
F = (-∞, X*]
```

The task is therefore to locate the boundary of `F`.

## 27. Why Exact Optimization Is Harder

Without monotonicity, a candidate answer may alternate between feasible and infeasible.

Example:

```text
false true false true false
```

A midpoint result cannot safely eliminate an entire side.

This is why monotonicity is the fundamental precondition.

## 28. Multiple Constraints

A feasibility predicate may combine constraints:

```text
capacity sufficient
AND
workers sufficient
AND
time limit satisfied
```

All constraints must be incorporated consistently.

The resulting combined predicate must still be monotonic in the searched parameter.

## 29. Multiple Answer Dimensions

Binary search on answer generally searches one ordered scalar dimension.

If the problem has multiple independent optimization variables, naive one-dimensional binary search may not apply.

Possible alternatives include:

- nested search with proven monotonicity;
- dynamic programming;
- parametric search;
- optimization algorithms;
- exhaustive search over a small dimension.

The structure must be derived from the problem.

## 30. Continuous Answer Domains

For real-valued answers, binary search becomes interval narrowing:

```text
while high - low > epsilon:
    mid = (low + high) / 2
    if feasible(mid):
        high = mid
    else:
        low = mid
```

Termination depends on:

- tolerance;
- numerical precision;
- maximum iterations;
- predicate stability.

## 31. Precision Engineering

For floating-point answer search, define:

```text
absolute tolerance
relative tolerance
maximum iterations
rounding policy
```

The returned value should satisfy the documented approximation guarantee.

## 32. Backend Applications

Binary search on answer can model:

- minimum server capacity;
- maximum safe batch size;
- minimum worker pool size;
- throughput thresholds;
- rate-limit parameters;
- timeout/capacity tuning;
- resource allocation limits.

In production, the feasibility check may depend on a model or benchmark rather than only an array.

## 33. AI Applications

Applications include:

- minimum compute budget satisfying latency;
- confidence thresholds;
- retrieval score cutoffs;
- token-budget feasibility;
- batch-size constraints;
- hyperparameter ranges with monotonic behavior;
- minimum resource allocation satisfying an inference requirement.

The predicate must reflect the actual engineering constraint.

## 34. Observability

A production feasibility search should expose useful diagnostics when appropriate:

```text
candidate tested
predicate duration
predicate result
number of iterations
input/workload characteristics
final boundary
```

Do not log sensitive payloads merely to debug a search algorithm.

## 35. Testing Strategy

Test the decision predicate independently.

Then test the boundary search independently.

Then test the composition.

```text
predicate tests
      ↓
binary-search tests
      ↓
integration tests
```

This isolates failures.

## 36. Differential Testing

For small domains, compare binary-search-on-answer against brute force:

```text
brute force → exact optimum
binary search → candidate optimum
```

Randomized small cases can reveal incorrect bounds, non-monotonic assumptions, and boundary bugs.

## 37. Common Mistakes

1. Applying binary search without proving monotonicity.
2. Defining an incorrect feasibility predicate.
3. Choosing bounds that exclude the answer.
4. Using arbitrary bounds that overflow or waste iterations.
5. Mixing minimum-feasible and maximum-feasible semantics.
6. Using a greedy checker without proving it.
7. Forgetting impossible-instance handling.
8. Ignoring predicate cost.
9. Introducing side effects into feasibility checks.
10. Returning a boundary without validating its existence.

## 38. Edge Cases

Test:

- empty input;
- one item;
- answer at lower bound;
- answer at upper bound;
- no feasible answer;
- every candidate feasible;
- exactly one feasible candidate;
- duplicate workloads;
- maximum numeric values;
- minimum numeric values;
- zero/negative values when domain permits;
- floating-point precision boundaries.

## 39. Impossible Instances

Some problems permit no feasible answer.

The contract must define this explicitly:

```text
return null
return -1
throw an error
return a domain-specific result
```

Do not silently return an arbitrary boundary.

## 40. Complexity Framework

For:

```text
answer range = R
feasibility cost = F(N)
```

binary search on answer costs:

```text
O(F(N) log R)
```

Auxiliary space is:

```text
O(space used by feasibility checker + search state)
```

The checker may dominate both time and memory.

## 41. Interview Recognition Signals

Look for wording such as:

- minimum possible maximum;
- maximum possible minimum;
- smallest capacity;
- minimum speed/rate;
- maximum distance;
- within at most K groups;
- can we finish within T;
- smallest X that satisfies;
- largest X that remains possible.

These phrases often indicate an answer-search transformation, but recognition must be followed by a monotonicity proof.

## 42. Interview Derivation Template

Say:

> “I will binary-search the answer rather than the input. For a candidate `X`, I define `feasible(X)` as ____. I can prove that if `X` is feasible, every larger/smaller candidate is also feasible, so the predicate is monotonic. Therefore I only need to find the first/last boundary. Each feasibility check costs `O(F)`, and there are `O(log R)` checks, giving `O(F log R)`.”

## 43. Implementation Lab

Implement from scratch:

1. minimum feasible integer;
2. maximum feasible integer;
3. minimum capacity partitioning;
4. minimum processing rate;
5. maximum minimum distance;
6. floating-point threshold search;
7. impossible-instance handling;
8. differential brute-force verification.

For each one document:

```text
answer space
bounds
predicate
monotonicity proof
invariant
complexity
```

## 44. Revision Checklist

- [ ] I can recognize answer-search problems.
- [ ] I can define a scalar answer domain.
- [ ] I can derive safe lower/upper bounds.
- [ ] I can write a feasibility predicate.
- [ ] I can prove predicate correctness.
- [ ] I can prove monotonicity.
- [ ] I can choose first-true or last-true search.
- [ ] I can prove the binary-search invariant.
- [ ] I can analyze `O(F(N) log R)` complexity.
- [ ] I understand greedy feasibility checkers.
- [ ] I can handle impossible instances.
- [ ] I can handle continuous domains and tolerance.
- [ ] I can validate against brute force on small cases.
- [ ] I can apply the pattern to backend resource problems.
- [ ] I can apply the pattern to AI resource/threshold problems.

## 45. Key Takeaways

1. **Binary search on answer searches an ordered optimization domain rather than an input array.**
2. **The essential ingredient is a correct monotonic feasibility predicate.**
3. **The original optimization problem becomes repeated decision problems.**
4. **Minimum-feasible problems use first-true boundaries; maximum-feasible problems use last-true boundaries.**
5. **Safe answer bounds are part of correctness, not merely an optimization.**
6. **The total complexity is feasibility cost multiplied by logarithmic answer-space reduction.**
7. **A greedy feasibility checker must be proven independently.**
8. **Correctness has multiple layers: checker correctness, monotonicity, and boundary-search correctness.**
9. **Continuous answer search requires explicit precision and termination rules.**
10. **Expert mastery means being able to transform an unfamiliar optimization problem into a monotonic decision problem when the mathematical structure permits it.**
