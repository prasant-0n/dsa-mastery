# 34 — Combinatorial DP: Catalan, Ballot, Motzkin & Structural Counting

## 1. Why structural counting matters

Some counting problems are difficult because the objects are recursively structured rather than because the numeric state is large. Binary trees, balanced parentheses, lattice paths, polygon triangulations, noncrossing structures, and constrained walks are examples.

These problems often collapse into compact recurrences once the **first or last structural component** is identified. This lesson develops a reusable family of combinatorial DP patterns rather than treating Catalan numbers as isolated formulas.

---

## 2. Structural decomposition

For a recursively defined object, ask:

1. What is the root, first step, last step, or outermost component?
2. Once that component is fixed, which independent subproblems remain?
3. Are the subproblems independent and therefore multiplicative?
4. Does choosing a split position create a sum over products?
5. Can every object have exactly one canonical decomposition?

A typical recurrence is

```text
F[n] = Σ F[i] * F[n-1-i]
```

The multiplication combines independent left/right structures; the summation considers the possible split.

---

## 3. Catalan recurrence

The Catalan sequence begins with

```text
C[0] = 1
C[n] = Σ C[i] * C[n-1-i]
```

This recurrence appears in many different-looking problems because they share the same recursive structure.

Examples include:

- full binary trees;
- balanced parenthesis structures;
- binary search tree shapes;
- polygon triangulations;
- noncrossing partitions;
- Dyck paths.

The important skill is recognizing the structural bijection, not memorizing the sequence.

---

## 4. Full binary trees

A full binary tree has either zero children or exactly two children.

If a tree has `n` internal nodes, its root consumes one internal node and the remaining `n-1` nodes are divided between the left and right subtrees.

Therefore:

```text
F[n] = Σ F[i]F[n-1-i]
```

This is the Catalan recurrence.

The proof depends on a unique root decomposition: every tree has one root and exactly one left/right size split.

---

## 5. Balanced parentheses and Dyck paths

Balanced-parenthesis strings can be mapped to lattice paths:

- `(` means an up step;
- `)` means a down step.

Validity requires the path never to go below height zero and to finish at height zero.

A prefix-height DP can count such paths directly. A structural decomposition can derive the Catalan recurrence.

This gives two independent implementations:

1. state by position and current balance;
2. recursive structural decomposition.

Independent formulations are excellent testing oracles.

---

## 6. Catalan as a closed form

For `n >= 0`,

```text
C[n] = 1/(n+1) * binomial(2n,n)
```

The closed form is useful for validation, but direct division is dangerous under modular arithmetic.

For a general modulus, compute using methods appropriate to the modulus rather than assuming every denominator has an inverse.

For exact JavaScript computation, use `BigInt` when values exceed `Number.MAX_SAFE_INTEGER`.

---

## 7. Unique decomposition is the central proof

A recurrence of the form

```text
F[n] = Σ_i A[i] * B[n-1-i]
```

is correct when every object has exactly one selected decomposition index `i`, and the remaining components are independently represented by `A` and `B`.

Two questions must always be answered:

- **Completeness:** every valid object appears.
- **Uniqueness:** no valid object appears twice.

This proof style generalizes far beyond Catalan numbers.

---

## 8. Ballot paths

Consider paths using up and down steps subject to a lower-bound condition on the running balance.

A direct DP can use

```text
position, balance
```

with transitions for each legal step.

This illustrates an important distinction:

- a Catalan-style structural recurrence compresses the object through decomposition;
- a prefix-state DP tracks the constraint directly.

Both may be correct, but their state spaces and generalizability differ.

---

## 9. Reflection principle intuition

For some path-counting constraints, invalid paths can be mapped bijectively to another class of unrestricted paths by reflecting a prefix around a boundary.

This can produce closed forms from an apparently two-dimensional DP.

The algorithmic lesson is not to apply reflection mechanically. First prove that the transformation is bijective and preserves the relevant endpoint information.

---

## 10. Motzkin paths

A Motzkin path uses:

- an up step;
- a down step;
- a horizontal step;

while staying at or above zero and ending at zero.

Its counting recurrence can be derived by classifying the first structural event. This creates another example where a small local grammar becomes a counting DP.

---

## 11. Grammar-to-DP translation

A context-free-style structural rule such as

```text
S -> empty
S -> atom S
S -> '(' S ')' S
```

can suggest a counting recurrence.

The challenge is determining whether the grammar is **unambiguous**. If one object can have multiple derivations, blindly counting derivations overcounts objects.

Therefore, structural counting requires both:

```text
grammar / decomposition
          +
uniqueness proof
```

---

## 12. Ambiguous decompositions

A recurrence may look mathematically elegant and still be wrong because the same object can be generated through different structural choices.

When designing a counting grammar or recurrence:

1. define the canonical representation;
2. specify the decomposition rule;
3. prove termination;
4. prove completeness;
5. prove uniqueness.

If uniqueness fails, either canonicalize the decomposition or change the state so equivalent derivations collapse.

---

## 13. Polygon triangulation

A convex polygon can be triangulated by selecting a distinguished edge and choosing the third vertex of its triangle.

The remaining regions become independent smaller polygons.

The resulting interval recurrence is Catalan-shaped and connects directly to interval DP from Lesson 12.

This is a useful recognition bridge:

```text
structural split
      ↓
interval / size state
      ↓
sum of products
```

---

## 14. Binary search tree shapes

If only tree **shape** matters, choosing the root partitions the remaining keys into left and right subsets.

For `n` distinct ordered keys, a root position determines the left/right key counts, while the shape counts multiply.

This again yields a Catalan recurrence.

Be precise about whether the problem counts:

- shapes;
- labeled trees;
- insertion sequences;
- actual key assignments.

These are different objects.

---

## 15. Noncrossing structures

Many planar or noncrossing objects admit an outermost-chord decomposition. Choosing the partner of a distinguished endpoint divides the structure into independent regions.

This frequently produces:

```text
sum over split positions of products
```

The recurrence may therefore resemble Catalan even when no trees or parentheses appear in the statement.

---

## 16. Narayana refinement

Catalan objects can be refined by an additional statistic. Instead of storing only

```text
C[n]
```

store

```text
DP[n][k]
```

where `k` represents a statistic such as the number of peaks or a related structural feature.

This demonstrates a general principle:

> When the problem asks for a distribution over a structural statistic, add that statistic to the DP state instead of discarding it.

---

## 17. Refined structural DP

A structural recurrence can become multidimensional:

```text
DP[size][statistic]
```

A split combines two child statistics, often through convolution.

For a parent statistic `k`, the transition may require

```text
Σ_i DP[left][i] * DP[right][k-i]
```

This connects structural combinatorial DP directly to the polynomial-state techniques from Lesson 33.

---

## 18. Lattice-path DP as a universal fallback

When a closed structural recurrence is difficult to derive, use the explicit state:

```text
(position, balance / resource / boundary state)
```

This is often larger but easier to prove.

A valuable workflow is:

```text
explicit state DP
       ↓
find structural invariant
       ↓
compress representation
       ↓
derive closed recurrence when justified
```

---

## 19. State compression by symmetry

If two partial structures have identical future possibilities, they can share one state.

For path problems, this can mean storing only current height rather than the entire prefix. For structural objects, it may mean storing size and a small statistic rather than the full partial object.

The state must preserve exactly the information needed by future transitions.

---

## 20. Modular combinatorial DP

Structural counting grows extremely quickly. Production and competitive implementations therefore often use a modulus.

Use:

- `BigInt` for exact results;
- modular addition/multiplication for modular results;
- precomputed factorials/inverse factorials only when the modulus supports the required inverses;
- recurrence-based computation when division is inconvenient.

Never silently replace exact counting with floating-point arithmetic.

---

## 21. Fast Catalan computation

The recurrence costs `O(n²)` if every `C[n]` is computed from all previous split points.

For a single large `n`, the closed form can be substantially faster if binomial coefficients are available efficiently.

For many consecutive values, the recurrence or incremental formulas may be preferable depending on arithmetic constraints.

The correct method depends on whether the workload is:

- one query;
- all values through `n`;
- many repeated queries;
- exact or modular.

---

## 22. Structural DP vs explicit enumeration

The number of objects can itself be exponential or super-polynomial, while the number of DP states is only polynomial.

This is the essence of counting DP: compute the number of objects without materializing them.

Do not confuse:

```text
number of objects
```

with

```text
number of DP states
```

A tiny DP can represent an enormous combinatorial universe.

---

## 23. Counting vs ranking/unranking

Once objects have been counted by prefixes or structural branches, the counts can support ranking and unranking.

To unrank an object:

1. count objects under the first candidate branch;
2. compare the desired rank with that count;
3. skip the branch if appropriate;
4. otherwise descend into it.

This turns counting DP into a constructive algorithm without enumerating every object.

---

## 24. Sampling from counting DP

Exact counts can also support approximately or exactly uniform sampling from a finite object family.

At each branch, select a branch with probability proportional to the number of completions beneath it.

This requires careful random-integer generation and exact count handling when uniformity matters.

The conceptual pipeline is:

```text
count completions → choose weighted branch → recurse
```

---

## 25. Testing structural recurrences

Use multiple independent viewpoints:

- brute-force enumeration for tiny sizes;
- explicit prefix/balance DP;
- structural recurrence;
- known closed forms;
- symmetry identities;
- recurrence consistency checks;
- randomized differential tests.

For Catalan-style problems, test at least `n = 0` and several small values where manual enumeration is possible.

---

## 26. Backend applications

Structural counting can support:

- enumerating configuration families without materializing them;
- estimating workflow shape spaces;
- counting valid parser/grammar structures;
- test-case generation;
- bounded planning spaces;
- ranking candidate structures.

Always impose practical bounds. Structural counts can become enormous even when the algorithm itself is polynomial.

---

## 27. AI engineering applications

Structural counting can be useful for:

- constrained decoding;
- grammar-constrained generation;
- counting valid structured outputs;
- ranking or sampling valid candidates;
- exact evaluation of finite structured search spaces.

Keep the structural validator deterministic. A model may propose candidate grammar rules, but the DP should independently establish whether the rules are valid and how many objects they generate.

---

## 28. Recognition framework

When a problem involves trees, parentheses, triangulations, noncrossing structures, or bounded walks, ask:

1. Is there a distinguished root/edge/first step?
2. Does choosing it split the object into independent parts?
3. Does the transition become a sum of products?
4. Is the decomposition unique?
5. Is there a prefix-state formulation that can serve as an oracle?
6. Can a known combinatorial family validate the result?
7. Is an additional statistic required?
8. Can the counts support ranking or sampling?

---

## 29. Master pattern

```text
Identify structural object
        ↓
Find canonical decomposition
        ↓
Prove completeness + uniqueness
        ↓
Define size / statistic state
        ↓
Derive sum-of-products recurrence
        ↓
Implement explicit DP first
        ↓
Refine with polynomial states if needed
        ↓
Validate against independent formulation
        ↓
Exploit counts for reconstruction/ranking/sampling
```

The deepest lesson is that many famous combinatorial sequences are simply **dynamic programs whose state has been compressed by a structural decomposition**.
