# 02.18 — Multiple-Parameter Complexity

## Learning Objective

Learn to analyze algorithms whose cost depends on more than one independent input dimension.

> **Expert complexity analysis does not force every problem into `n`. It identifies the parameters that actually control the computation.**

---

# 1. Why Multiple Parameters Matter

Many real problems have several independent dimensions.

Examples:

```text
Graph:
V = number of vertices
E = number of edges

Matrix:
R = rows
C = columns

Strings:
N = number of strings
L = total/string length

Vectors:
N = number of vectors
D = dimensions

Backend:
N = records
Q = queries
C = concurrent requests
```

A correct complexity expression should preserve these dimensions when they materially affect the cost.

---

# 2. The Danger of Replacing Everything With n

Suppose an algorithm processes an `R × C` matrix.

The natural time complexity is:

```text
O(RC)
```

Writing:

```text
O(n²)
```

may be misleading unless you explicitly define:

```text
n ≈ R ≈ C
```

If `R = 10^6` and `C = 10`, treating both as one `n` hides the actual workload shape.

---

# 3. Independent Parameters

Two parameters are independent when neither is necessarily determined by the other.

Example:

```text
R = rows
C = columns
```

A matrix can be:

```text
1 × 1,000,000
```

or:

```text
1,000,000 × 1
```

Both contain the same number of cells, but some algorithms behave differently depending on orientation and operations.

---

# 4. Product Complexity

If an algorithm performs work for every pair:

```text
for each of R rows
    for each of C columns
```

then:

```text
Time = O(RC)
```

Examples:

- matrix traversal
- Cartesian products
- pairwise feature comparisons
- table joins under nested-loop execution

---

# 5. Additive Complexity

Suppose an algorithm performs:

```text
O(R)
```

work followed by:

```text
O(C)
```

Total:

```text
O(R + C)
```

Do not automatically multiply independent loops.

Sequential costs add.

Nested costs multiply when the inner work occurs for each outer iteration.

---

# 6. Multiple Sequential Stages

Consider:

```text
Stage A: O(N)
Stage B: O(Q log N)
Stage C: O(D)
```

Total:

```text
O(N + Q log N + D)
```

You should preserve the expression when `N`, `Q`, and `D` represent different dimensions.

Only simplify further if the constraints justify doing so.

---

# 7. Dominant Terms With Multiple Parameters

Suppose:

```text
T(N, Q) = N + QN
```

You can factor:

```text
T(N, Q) = N(1 + Q)
```

but you should generally report:

```text
O(NQ)
```

if both parameters can grow independently.

Do not discard `N` merely because `Q` may be large in one particular workload.

---

# 8. When Simplification Is Legitimate

Suppose the problem explicitly guarantees:

```text
Q ≤ N
```

Then:

```text
O(N + Q) = O(N)
```

because `Q` is bounded by `N`.

Constraints can justify reducing a multi-parameter expression.

Without such a relationship, preserve the parameters.

---

# 9. Example — Matrix Search

Searching every cell of an `R × C` matrix:

```text
Time: O(RC)
Space: O(1)
```

If the matrix is sorted in a way that enables elimination of one row or column at each step, the complexity can differ significantly.

The representation and ordering assumptions must be stated.

---

# 10. Example — Matrix Multiplication

Naive multiplication of:

```text
A: R × K
B: K × C
```

performs approximately:

```text
R × K × C
```

scalar operations.

Therefore:

```text
Time = O(RKC)
```

This is a classic example where one-dimensional `n` notation loses important information.

---

# 11. Rectangular Matrices

For an `R × C` matrix:

```text
Storage = O(RC)
```

If an algorithm uses an additional matrix of the same dimensions:

```text
Auxiliary space = O(RC)
```

If it stores only a row or column:

```text
Auxiliary space = O(min(R, C))
```

when the implementation chooses the smaller dimension appropriately.

---

# 12. Strings: Number vs Length

Suppose there are `N` strings with maximum length `L`.

Scanning every character may cost:

```text
O(NL)
```

But if the total number of characters is:

```text
S = sum of all string lengths
```

then a tighter expression is often:

```text
O(S)
```

This is an example of choosing a parameter that reflects the actual work.

---

# 13. Total Input Size vs Maximum Element Size

These are different.

For strings:

```text
N = number of strings
L = maximum string length
S = total characters
```

Then:

```text
S ≤ NL
```

An algorithm that touches every character is naturally described using `S` when total input size is the true driver.

---

# 14. Nested String Comparisons

Suppose we compare every pair of strings and each comparison can inspect up to `L` characters.

There are:

```text
O(N²)
```

pairs.

Each comparison costs:

```text
O(L)
```

Therefore:

```text
O(N²L)
```

A common mistake is to report only `O(N²)` and forget string-processing cost.

---

# 15. Pairwise Vector Similarity

Suppose there are:

```text
N vectors
D dimensions
```

and we compute every pairwise similarity.

Number of pairs:

```text
O(N²)
```

Cost per similarity:

```text
O(D)
```

Therefore:

```text
Time = O(N²D)
```

This is a fundamental AI complexity pattern.

---

# 16. Retrieval With Candidate and Dimension Parameters

Suppose a system retrieves `K` candidates and computes a `D`-dimensional similarity for each.

Then scoring costs:

```text
O(KD)
```

If `Q` queries are processed:

```text
O(QKD)
```

Preserving all parameters makes bottlenecks visible.

---

# 17. Graph Complexity

Graphs naturally use:

```text
V = vertices
E = edges
```

A standard adjacency-list traversal is:

```text
O(V + E)
```

This cannot generally be simplified to `O(V)` because a graph can have many more edges than vertices.

Likewise, an adjacency matrix requires:

```text
O(V²)
```

space.

---

# 18. Backend Example — N+1 Query Pattern

Suppose a backend fetches:

```text
N parent records
```

and then performs one database query per parent.

Ignoring database internals, query count is approximately:

```text
1 + N
```

If each child query processes `M` records on average, application/database work may depend on both:

```text
N and M
```

The key lesson is that request complexity may depend on multiple workload dimensions.

---

# 19. Backend Example — Pagination

Suppose:

```text
N = total records
P = page size
Q = number of pages requested
```

If each requested page scans `P` records:

```text
Processing = O(QP)
```

If users request all records:

```text
Q ≈ N/P
```

so total processed records are:

```text
O(N)
```

But repeated offset-based database scans can introduce additional costs not represented by this simple model.

---

# 20. Backend Example — Concurrent Processing

Suppose each request processes:

```text
N records
```

and there are:

```text
C concurrent requests
```

If each request requires `O(N)` working memory, aggregate live memory can approach:

```text
O(CN)
```

This demonstrates why per-request complexity is not the same as system-level resource complexity.

---

# 21. Query Complexity

For data systems, distinguish:

```text
N = data size
Q = query count
```

Suppose preprocessing costs:

```text
O(N log N)
```

and each query costs:

```text
O(log N)
```

Then total workload cost is:

```text
O(N log N + Q log N)
```

This allows break-even reasoning between preprocessing and repeated scanning.

---

# 22. Build Time vs Query Time

An index may cost:

```text
Build: O(N log N)
Query: O(log N)
```

For `Q` queries:

```text
Total = O(N log N + Q log N)
```

Without the index, suppose each query costs `O(N)`:

```text
Total = O(QN)
```

The best strategy depends on `Q` and whether the dataset is static or changing.

---

# 23. Dynamic Data Changes the Model

Suppose an index supports updates.

Then total workload may be:

```text
Build cost
+ U × update cost
+ Q × query cost
```

where:

```text
U = number of updates
Q = number of queries
```

This is more realistic than describing only query complexity.

---

# 24. Output-Sensitive Complexity

Some algorithms should depend on output size.

Let:

```text
N = input size
K = output size
```

If an algorithm must produce `K` results, it has a lower bound of:

```text
Ω(K)
```

A useful complexity expression might therefore be:

```text
O(N + K)
```

rather than only `O(N)`.

---

# 25. Parameter Relationships

Sometimes parameters are related.

Examples:

```text
E ≤ V²
K ≤ N
Q ≤ N
```

These relationships can simplify bounds, but only when explicitly guaranteed or mathematically inherent.

For example:

```text
O(V + E)
```

can be bounded by:

```text
O(V²)
```

for simple graphs because `E = O(V²)`.

But `O(V + E)` is often more informative because it reflects sparsity.

---

# 26. Tightness and Information Loss

A mathematically valid bound is not always the best description.

For example:

```text
O(V²)
```

is valid for adjacency-list traversal because `E ≤ V²`, but:

```text
O(V + E)
```

contains more information about actual graph density.

Expert analysis prefers a useful tight parameterization before applying broad worst-case simplifications.

---

# 27. Complexity With Different Input Types

A function may receive:

```text
A = length of first array
B = length of second array
```

If it compares every pair:

```text
O(AB)
```

Not:

```text
O(n²)
```

unless `A` and `B` are both represented by a common `n` under an explicit assumption.

---

# 28. Multiple Parameters in Space Complexity

Space can also depend on several dimensions.

Examples:

```text
Matrix: O(RC)
Graph: O(V + E)
Embeddings: O(ND)
Concurrent requests: O(CM)
Candidates: O(KD)
```

The same principle applies:

> Identify what occupies memory and which parameters determine its size.

---

# 29. Complexity of Nested Multi-Parameter Loops

Consider:

```js
for (let i = 0; i < A; i++) {
  for (let j = 0; j < B; j++) {
    for (let k = 0; k < C; k++) {
      work(i, j, k);
    }
  }
}
```

Complexity:

```text
O(ABC)
```

Each dimension contributes multiplicatively because the full inner work executes for every combination.

---

# 30. Sequential Multi-Parameter Loops

```js
for (let i = 0; i < A; i++) workA(i);
for (let j = 0; j < B; j++) workB(j);
```

Complexity:

```text
O(A + B)
```

This distinction should become automatic:

```text
sequential → add
nested → multiply
```

subject to dependent bounds and early exits.

---

# 31. Dependent Bounds With Multiple Parameters

Suppose:

```js
for (let i = 0; i < A; i++) {
  for (let j = 0; j < min(B, i); j++) {
    work();
  }
}
```

The total cost is:

```text
Σ min(B, i)
```

which requires analyzing the relationship between `A` and `B`.

Possible bounds differ depending on whether:

```text
A ≤ B
```

or:

```text
A > B
```

This is why dependent-loop analysis cannot always be reduced by inspection.

---

# 32. Piecewise Complexity

Some algorithms have different complexity regimes.

Example:

```text
if A < B:
    O(A²)
else:
    O(AB)
```

A correct analysis may need to describe the cases separately.

Piecewise complexity is useful when parameter relationships change the computational structure.

---

# 33. Backend Example — Join Shapes

Joining datasets with sizes:

```text
N = left rows
M = right rows
```

A naive nested-loop join can require:

```text
O(NM)
```

An indexed/hash-based strategy may approach:

```text
O(N + M)
```

under suitable assumptions.

The choice depends on data size, index availability, selectivity, memory, and workload.

---

# 34. AI Example — Pairwise Ranking

Suppose:

```text
Q queries
K candidates per query
D feature dimensions
```

A scoring operation costing `O(D)` produces:

```text
O(QKD)
```

If candidates are compared pairwise instead:

```text
O(QK²D)
```

This demonstrates why algorithmic structure can matter more than a constant-factor optimization.

---

# 35. AI Example — Dataset Evaluation

Suppose an evaluation pipeline compares:

```text
N queries
K retrieved candidates/query
D-dimensional embeddings
```

Pairwise similarity work can be modeled as:

```text
O(NKD)
```

If every candidate pair is compared:

```text
O(NK²D)
```

Keeping parameters explicit reveals which dimension should be reduced.

---

# 36. Choosing the Right Parameters

Good parameters correspond to independent workload drivers.

Bad parameterization:

```text
n = everything
```

Better:

```text
N = records
Q = queries
K = candidates
D = dimensions
```

Then derive:

```text
O(N + QK log N)
```

or whatever the actual algorithm requires.

---

# 37. Common Mistakes

### Mistake 1

Replacing every parameter with `n`.

### Mistake 2

Multiplying sequential loops.

### Mistake 3

Adding nested loops.

### Mistake 4

Dropping one parameter without a valid constraint.

### Mistake 5

Ignoring output size.

### Mistake 6

Ignoring string length or vector dimension.

### Mistake 7

Using worst-case parameter relationships without stating them.

### Mistake 8

Giving a valid but uninformative bound such as `O(V²)` when `O(V + E)` is available.

### Mistake 9

Analyzing one request while ignoring concurrency.

### Mistake 10

Ignoring build/update/query workload composition.

---

# 38. Expert Workflow

```text
1. Identify every independent input dimension.
2. Define meaningful symbols.
3. Translate each loop/search/data operation into parameterized cost.
4. Add sequential stages.
5. Multiply truly nested independent work.
6. Analyze dependent bounds.
7. Apply known parameter relationships.
8. Preserve useful tight expressions.
9. Separate time and space parameters.
10. Include output size when necessary.
11. Model workload composition: build + update + query.
12. For backend/AI systems, include concurrency and dimensionality.
```

---

# 39. Interview Template

When a problem has multiple dimensions, say:

> “There are `N` records and `Q` queries, so I will keep those parameters separate because they can grow independently. Preprocessing costs `O(N log N)` and each query costs `O(log N)`, giving total workload `O(N log N + Q log N)`. If the constraints guarantee `Q ≤ N`, we can simplify the bound, but without that relationship I would preserve both parameters.”

This demonstrates much stronger reasoning than simply saying `O(n log n)`.

---

# 40. Mastery Checklist

- [ ] I know when to preserve multiple parameters.
- [ ] I can distinguish additive and multiplicative parameter costs.
- [ ] I can analyze rectangular matrices.
- [ ] I can analyze matrix multiplication.
- [ ] I can reason about string count vs total string length.
- [ ] I can analyze graph complexity using V and E.
- [ ] I can analyze vector algorithms using N and D.
- [ ] I can model candidate retrieval using Q, K, and D.
- [ ] I can model build/query/update workloads.
- [ ] I can use output-sensitive parameters.
- [ ] I understand parameter relationships.
- [ ] I can simplify bounds only when justified.
- [ ] I can analyze dependent multi-parameter loops.
- [ ] I understand piecewise complexity.
- [ ] I can model backend concurrency.
- [ ] I can identify N+1 query complexity.
- [ ] I can compare naive and indexed join shapes.
- [ ] I avoid hiding important dimensions behind `n`.
- [ ] I can explain the model clearly in an interview.
- [ ] I can choose parameters that reflect real production bottlenecks.

---

# Key Takeaways

1. **Use one parameter per independent workload dimension.**
2. **Sequential work adds; truly nested work multiplies.**
3. **Do not collapse `R` and `C` into `n` unless a constraint justifies it.**
4. **Strings often require both number of strings and total character count.**
5. **Graphs naturally require `V` and `E`.**
6. **AI vector workloads often require `N`, `K`, `D`, and sometimes `Q`.**
7. **Backend workloads often require data size, query count, updates, and concurrency.**
8. **A valid bound can still be uninformative; preserve useful structure.**
9. **Parameter relationships can justify simplification, but they must be real constraints.**
10. **Expert complexity analysis models the workload before simplifying the mathematics.**
