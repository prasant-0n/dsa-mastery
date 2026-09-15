# 08.04 — Binary Search Variants: Lower Bound, Upper Bound & Boundary Search

## 1. Concept Definition

Boundary search is the systematic use of binary search to locate the transition point of a monotonic predicate.

Instead of asking only:

```text
Does target T exist?
```

we ask:

```text
Where does the predicate change state?
```

Typical pattern:

```text
false false false | true true true
                  ↑
               boundary
```

Lower bound and upper bound are the foundational variants.

## 2. Why Boundary Search Matters

Exact-match binary search is only one member of a larger family.

Boundary search supports:

- insertion positions;
- first occurrence;
- last occurrence;
- occurrence counts;
- range queries;
- threshold lookup;
- scheduling boundaries;
- capacity selection;
- answer-space optimization.

## 3. Mental Model

Think of a sorted array as a boolean predicate over indices.

For lower bound:

```text
P(i) = A[i] >= target
```

Example:

```text
A = [1, 3, 3, 3, 7, 9]
target = 3

P = [false, true, true, true, true, true]
                 ↑
             lower bound
```

The algorithm finds the first `true`.

## 4. Lower Bound

Definition:

> The smallest index `i` such that `A[i] >= target`.

If no such index exists, return `n` under the standard insertion-point convention.

Example:

```text
A = [2, 4, 4, 8]

target = 4
lowerBound = 1
```

## 5. Upper Bound

Definition:

> The smallest index `i` such that `A[i] > target`.

Example:

```text
A = [2, 4, 4, 8]

target = 4
upperBound = 3
```

## 6. Occurrence Count

For a sorted array:

```text
count(target) = upperBound(target) - lowerBound(target)
```

Why?

The interval:

```text
[lowerBound, upperBound)
```

contains exactly the values equal to `target`.

## 7. First Occurrence

The first occurrence of `target` is:

```text
lowerBound(target)
```

provided the returned index is inside the array and actually equals `target`.

This final equality check is important because lower bound may point to a larger value.

## 8. Last Occurrence

The last occurrence can be derived from upper bound:

```text
upperBound(target) - 1
```

Again verify that the resulting index is valid and contains `target`.

## 9. Insertion Position

For ascending sorted data, lower bound gives the position where `target` can be inserted while preserving sorted order.

```text
[1, 3, 5, 8]
target = 4

position = 2
```

The resulting array would preserve ordering after insertion.

## 10. Boundary Search Invariant

For first-true search over `[L, R)`:

```text
indices < L are known false
indices >= R are known true
```

The unknown region is:

```text
[L, R)
```

The answer remains inside this region until termination.

## 11. First-True Algorithm Reasoning

At midpoint `M`:

```text
P(M) === true
```

Then `M` may be the first true, so retain it:

```text
R = M
```

If:

```text
P(M) === false
```

then `M` cannot be the answer, so discard it:

```text
L = M + 1
```

The difference between retaining and excluding `M` is central to boundary search.

## 12. Termination

Continue while:

```text
L < R
```

When:

```text
L === R
```

there is one possible boundary position.

Depending on the problem, that position may be `n`, meaning no true value exists.

## 13. First True vs Last True

Two complementary problems:

```text
false false true true
             ↑
         first true
```

and:

```text
true true false false
         ↑
      last true
```

They require different invariants and midpoint decisions.

## 14. Generic Boundary Search

A powerful abstraction is:

```text
findBoundary(low, high, predicate, mode)
```

where the predicate has a known monotonic structure.

The abstraction should not hide the invariant from the engineer. A reusable implementation is safe only when its contract is precise.

## 15. Monotonicity

Binary boundary search requires a predictable predicate shape.

Valid first-true form:

```text
false false false true true true
```

Valid last-true form:

```text
true true true false false false
```

A pattern such as:

```text
false true false true
```

is not suitable for ordinary boundary binary search.

## 16. Duplicates

Duplicates are where boundary search becomes substantially more useful than exact search.

Example:

```text
[1, 2, 2, 2, 2, 5]
```

Exact search can return any `2`.

Boundary search can identify the complete equal-value interval.

## 17. Range Query

For target `T`:

```text
left  = lowerBound(T)
right = upperBound(T)
```

Then:

```text
matching range = [left, right)
```

This representation is naturally compatible with half-open intervals.

## 18. Nearest Value

Binary search can find the insertion boundary, then compare neighboring candidates.

For target `T`:

```text
p = lowerBound(T)
```

Potential nearest candidates are generally around:

```text
p - 1
p
```

The exact tie-breaking rule must be specified.

## 19. Floor

Floor is the largest value satisfying:

```text
value <= target
```

A lower-bound result can be transformed into a floor candidate:

```text
lowerBound(target) - 1
```

subject to boundary validation.

## 20. Ceiling

Ceiling is the smallest value satisfying:

```text
value >= target
```

The lower-bound result is therefore the natural candidate.

## 21. Strict Inequalities

Boundary search must match the exact predicate.

Examples:

```text
A[i] >= T  → lower bound
A[i] >  T  → upper bound
A[i] <= T  → last true under <= predicate
A[i] <  T  → last true under < predicate
```

Changing one comparison changes the boundary.

## 22. Descending Data

For descending arrays, the predicate direction changes.

Do not mechanically reuse ascending-array conditions.

Instead:

1. define the ordered relation;
2. define the predicate;
3. establish monotonicity;
4. derive the boundary updates.

## 23. Custom Objects

Boundary search works with objects when a comparator establishes a consistent ordering.

Example:

```text
records sorted by timestamp
records sorted by priority
records sorted by version
records sorted by score
```

The comparator must be deterministic and compatible with the assumed order.

## 24. Search Over Answer Space

The same first-true logic can search values that are not array indices.

Example:

```text
capacity = 1 ... 1,000,000
```

Predicate:

```text
feasible(capacity)
```

If:

```text
false ... false | true ... true
```

the minimum feasible capacity is a boundary.

## 25. Minimum Feasible Answer

The invariant is conceptually:

```text
values before L → infeasible
values at/after R → feasible
```

The final `L` is the smallest feasible value.

This is one of the most reusable interview transformations.

## 26. Maximum Feasible Answer

For maximizing an answer, define a monotonic predicate such as:

```text
feasible(x)
```

with:

```text
true true true false false
```

Then search for the last true position.

## 27. Complexity

For a search space of size `N`:

```text
iterations → O(log N)
```

If each predicate evaluation costs `C`:

```text
O(C log N)
```

For answer-space search, `N` means the size of the answer domain or its logarithmic range representation.

## 28. Key Processing Cost

If comparing keys costs `K`, then binary search is better described as:

```text
O(K log N)
```

rather than treating each comparison as free.

This matters for:

- long strings;
- complex objects;
- parsed versions;
- expensive feature vectors;
- custom comparison logic.

## 29. Lower Bound Correctness

To prove lower bound:

### Invariant
All indices before `L` have values `< target`; all indices at or after `R` have values `>= target` under the standard formulation.

### Maintenance
If midpoint satisfies `A[mid] >= target`, retain it as a possible answer; otherwise discard it and everything before it.

### Termination
When `L === R`, no earlier position can satisfy the predicate, and `L` is the first satisfying position.

## 30. Upper Bound Correctness

For upper bound:

```text
P(i) = A[i] > target
```

Maintain the equivalent boundary invariant and locate the first true position.

Then:

```text
upperBound - 1
```

is the last value `<= target`, when valid.

## 31. Half-Open Intervals

Half-open ranges are especially useful for boundary problems:

```text
[L, R)
```

because:

```text
length = R - L
```

and an empty interval is naturally:

```text
L === R
```

This also aligns with JavaScript's array slicing conventions.

## 32. Why Boundary Search Is Powerful

A single conceptual primitive can solve:

```text
first ≥ target
first > target
first feasible
last feasible
first threshold crossing
insertion point
range boundaries
```

The key difference is the predicate and invariant—not the existence of a special algorithm for each problem.

## 33. Common Mistakes

1. Returning `mid` immediately for first/last occurrence.
2. Using `A[mid] > target` when the problem requires `>=`.
3. Forgetting the `n` insertion position.
4. Returning an invalid `upperBound - 1`.
5. Mixing closed and half-open intervals.
6. Searching a non-monotonic predicate.
7. Ignoring descending ordering.
8. Forgetting duplicate semantics.
9. Not specifying tie-breaking for nearest search.
10. Hiding an incorrect invariant behind a generic helper.

## 34. Edge Cases

Test:

- empty array;
- target below minimum;
- target above maximum;
- target exactly at minimum;
- target exactly at maximum;
- one element;
- all duplicates;
- target absent between values;
- target absent outside range;
- every value `< target`;
- every value `>= target`.

## 35. Backend Applications

Boundary search can support:

- event-time cutoffs;
- version ranges;
- retention boundaries;
- sorted in-memory records;
- capacity thresholds;
- scheduling windows;
- percentile/range lookup over sorted samples.

For persistent data, database indexes generally provide the scalable implementation layer.

## 36. AI Applications

Boundary search can support:

- score thresholds;
- confidence cutoffs;
- sorted candidate filtering;
- calibration thresholds;
- nearest-value lookup;
- parameter feasibility;
- retrieval-score ranges.

The underlying pattern remains monotonic boundary detection.

## 37. Implementation Lab

Implement from first principles:

1. lower bound;
2. upper bound;
3. first occurrence;
4. last occurrence;
5. occurrence count;
6. insertion position;
7. floor;
8. ceiling;
9. nearest value;
10. first true;
11. last true;
12. minimum feasible answer;
13. maximum feasible answer.

For each implementation, write the invariant before code.

## 38. Verification Lab

For every boundary function:

1. Create a linear reference implementation.
2. Generate sorted random inputs.
3. Include duplicate-heavy inputs.
4. Compare results against the reference.
5. Test empty and boundary cases.
6. Trace two-element and three-element inputs.

## 39. Interview Questions

1. What is the difference between exact binary search and lower bound?
2. Why does lower bound return `n` when no value is large enough?
3. How do you count duplicates in `O(log n)`?
4. How do you find the last occurrence?
5. Why is `[L, R)` convenient for boundary search?
6. What predicate does upper bound use?
7. How do you find floor and ceiling?
8. How do you prove the boundary invariant?
9. How do you adapt boundary search to descending data?
10. How does binary search on answer use the same concept?

## 40. Revision Checklist

- [ ] I can define lower bound precisely.
- [ ] I can define upper bound precisely.
- [ ] I can derive first/last occurrence.
- [ ] I can count duplicates with two boundaries.
- [ ] I can derive insertion position.
- [ ] I can derive floor and ceiling.
- [ ] I can find nearest values from a boundary.
- [ ] I understand first-true and last-true search.
- [ ] I can prove monotonicity.
- [ ] I can maintain a half-open interval invariant.
- [ ] I can apply the technique to answer spaces.
- [ ] I can account for predicate/comparator cost.
- [ ] I can validate implementations against a linear reference.

## 41. Key Takeaways

1. **Lower and upper bound are boundary-finding algorithms, not merely modified exact searches.**
2. **A boundary is the transition point of a monotonic predicate.**
3. **The predicate determines whether `mid` is retained or discarded.**
4. **Half-open intervals make boundary semantics and empty results particularly clean.**
5. **Duplicates are handled naturally by searching boundaries.**
6. **Occurrence counts follow directly from two boundaries.**
7. **Floor, ceiling, insertion position, and nearest-value search can be derived from boundaries.**
8. **Search-on-answer is the same reasoning applied to an ordered feasibility domain.**
9. **Correctness comes from the invariant, not from memorizing a comparison pattern.**
10. **Mastery means being able to invent the correct boundary predicate for a new problem.**
