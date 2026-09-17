# 33 — Counting DP, Generating Functions & Polynomial State Transitions

## 1. Why this lesson exists

Many dynamic programs do not return a minimum, maximum, or boolean. They **count** valid objects. Once a state represents a family of objects, transitions become additions and products of counts, and the same recurrence can often be expressed as a generating function or polynomial operation.

This chapter builds a bridge between ordinary counting DP, combinatorics, generating functions, and polynomial state transitions. The goal is not to memorize formulas. The goal is to recognize when a combinatorial process can be represented as coefficient extraction, convolution, or a small algebraic state machine.

---

## 2. Counting DP mental model

A counting DP has the form

```text
number[state] = sum over valid predecessors number[predecessor]
```

The key questions are:

1. What exactly does one state count?
2. Does every object have exactly one transition path, or will transitions double-count it?
3. What are the base objects?
4. What choices are independent and therefore multiply?
5. What choices are alternatives and therefore add?
6. Is order relevant?
7. Are objects distinguishable?
8. Is the answer exact, modular, or approximate?

A correct counting state is a **partition of the objects being counted**: each object should land in exactly one state/path representation unless intentional multiplicity is part of the definition.

---

## 3. Addition and multiplication: the combinatorial algebra

The fundamental rules are:

- **Sum rule:** disjoint alternatives add.
- **Product rule:** independent sequential choices multiply.

For example, if an object is formed by choosing one item from family `A` and one from family `B`, the number of combinations is `|A| * |B|`.

If a valid object can end in several mutually exclusive categories, their counts are added.

This is the algebra behind many DP transitions and generating functions.

---

## 4. Ordinary generating functions

For a sequence `a[0], a[1], ...`, its ordinary generating function is

```text
A(x) = a[0] + a[1]x + a[2]x² + ...
```

The coefficient of `x^n` is `a[n]`.

A generating function is useful when the index being counted behaves like a resource such as:

- total sum,
- length,
- capacity,
- number of selected items,
- number of parts.

Coefficient extraction turns an algebraic expression back into a DP answer.

---

## 5. Product of generating functions = convolution

If

```text
A(x) = Σ a[i]x^i
B(x) = Σ b[j]x^j
```

then

```text
A(x)B(x) = Σ c[k]x^k
c[k] = Σ a[i]b[k-i]
```

This is convolution.

A two-stage counting process therefore often becomes polynomial multiplication. The naive convolution costs `O(n²)`, while specialized algorithms can reduce the cost for sufficiently large dense inputs.

Do not reach for fast polynomial multiplication automatically. For small state ranges, ordinary DP is often simpler and faster in practice.

---

## 6. Coin-change generating functions

For unlimited use of denominations `d`, the contribution is

```text
1 + x^d + x^(2d) + x^(3d) + ...
```

The product over denominations encodes the number of ways to obtain each total.

The coefficient of `x^T` answers the counting question.

This representation explains why the standard unbounded coin-change DP iterates denominations outside and totals inside when counting combinations: it imposes a canonical ordering of choices and avoids counting the same multiset in different orders.

---

## 7. 0/1 choices as polynomial factors

For an item with weight `w`, selecting it zero or one time contributes

```text
1 + x^w
```

For independent items, multiply their factors.

Coefficient `x^T` counts subsets of total weight `T`.

If an item also has a value dimension, the state may become a multivariate polynomial or a conventional multidimensional DP. The representation should be chosen according to the query rather than mathematical elegance alone.

---

## 8. Tracking an additional statistic with a marker variable

Generating functions can encode more than one statistic.

For example, use

```text
x = total weight
 y = number of selected items
```

Then an item of weight `w` contributes

```text
1 + y*x^w
```

The coefficient of `x^T y^K` counts subsets with total weight `T` and exactly `K` selected items.

This is a powerful way to reason about multidimensional counting DP.

---

## 9. Bounded multiplicities

If an item of weight `w` may be selected between `0` and `c` times, its factor is

```text
1 + x^w + x^(2w) + ... + x^(cw)
```

The conventional bounded-knapsack counting DP and the polynomial representation are two descriptions of the same combinatorial process.

When `c` is large, algebraic manipulation may expose optimizations; when the target capacity is small, a direct DP can remain preferable.

---

## 10. Sequence counting and linear recurrences

A finite-state counting process frequently produces a linear recurrence.

For example, if a sequence can end in states `S1 ... Sk`, define a vector

```text
v_n = [count(S1,n), ..., count(Sk,n)]
```

and a transition matrix `M` such that

```text
v_(n+1) = M v_n
```

Then

```text
v_n = M^n v_0
```

This connects counting DP with matrix exponentiation and transfer matrices. Lesson 22 develops fast exponentiation in detail; here the focus is recognizing the counting interpretation.

---

## 11. Compositions vs partitions

A recurring source of counting bugs is confusing:

- **composition:** order matters;
- **partition:** order does not matter.

For target `4` with parts `1` and `3`:

```text
1 + 3
3 + 1
```

are two compositions but one unordered partition.

A DP's loop ordering often determines which interpretation it computes. Always define the object before writing the recurrence.

---

## 12. Stars and bars as a DP sanity check

The number of nonnegative integer solutions to

```text
x1 + x2 + ... + xk = n
```

is

```text
C(n + k - 1, k - 1)
```

A counting DP can independently compute the same result. Such closed-form identities are valuable test oracles.

The bounded version requires additional reasoning and may be handled through inclusion-exclusion or generating functions.

---

## 13. Inclusion-exclusion and generating functions

If objects violate several constraints, inclusion-exclusion can convert a constrained count into alternating sums of easier counts.

For sets `A1 ... Am`,

```text
|valid| = total - Σ|Ai| + Σ|Ai∩Aj| - ...
```

Generating functions can encode the same restrictions through modified factors. The engineering challenge is choosing the representation whose state space is manageable.

---

## 14. Stirling numbers as counting DP

Stirling numbers of the second kind count partitions of `n` labeled elements into `k` nonempty unlabeled groups:

```text
S(n,k) = S(n-1,k-1) + k*S(n-1,k)
```

The two cases mean:

1. create a new singleton group;
2. insert the new element into one of the existing `k` groups.

This is a canonical example of deriving a recurrence from the final structural decision.

---

## 15. Binomial coefficients as DP and generating coefficients

Pascal's recurrence is

```text
C(n,k) = C(n-1,k-1) + C(n-1,k)
```

while

```text
(1+x)^n
```

has coefficient `C(n,k)` at `x^k`.

The same numbers therefore appear as both DP states and generating-function coefficients.

For modular answers, choose arithmetic carefully. JavaScript `Number` cannot represent arbitrary large integer products exactly.

---

## 16. Polynomial DP

A state can itself be a polynomial:

```text
DP[state](x)
```

A transition may shift, add, or multiply polynomials.

Examples include:

- tracking the distribution of a score,
- counting by total cost,
- combining independent subtrees,
- counting selections by cardinality,
- probability distributions with exact rational/modular weights.

The critical engineering question is the degree bound. If only coefficients through degree `K` matter, truncate aggressively after every operation.

---

## 17. Truncation is a correctness-preserving optimization when justified

Suppose only coefficients `0..K` are required and all exponents are nonnegative. Terms with degree greater than `K` can never contribute back to a lower degree under ordinary polynomial multiplication.

Therefore truncating them is safe.

This property fails when the representation allows negative exponents or operations that can move degree downward. State-space assumptions must be documented before applying truncation.

---

## 18. Sparse vs dense polynomial states

A polynomial may be represented as:

- dense array of coefficients;
- `Map<degree, coefficient>` for sparse support;
- typed array for bounded modular coefficients;
- specialized transform representation.

Dense arrays are generally preferable when most degrees are populated. Sparse maps can win when reachable degrees are few.

The representation is an algorithmic choice, not merely a coding preference.

---

## 19. Convolution inside tree and graph DP

When two independent child subtrees must be combined, their distributions often combine by convolution.

If child `A` has `a[i]` ways to produce statistic `i` and child `B` has `b[j]` ways to produce statistic `j`, the parent distribution is

```text
c[k] = Σ a[i]b[k-i]
```

This appears in:

- subtree-size counting,
- knapsack-on-tree,
- matching distributions,
- polynomial tree DP,
- probabilistic subtree aggregation.

Naive merging can become `O(K²)` per edge; degree bounds and small-to-large strategies may matter.

---

## 20. Formal power-series intuition

For advanced work, it is useful to distinguish a polynomial from an infinite formal power series.

A formal power series is manipulated algebraically without requiring numerical convergence. This makes identities such as

```text
1 / (1-x) = 1 + x + x² + ...
```

meaningful as a coefficient identity.

For algorithm engineering, usually only a finite prefix of coefficients is needed, so operations are performed modulo `x^(K+1)`.

---

## 21. Rational generating functions and recurrences

Many linear recurrences correspond to rational generating functions. For a recurrence such as

```text
a_n = c1*a_(n-1) + ... + ck*a_(n-k)
```

the generating function has a denominator derived from the characteristic recurrence.

This creates a conceptual bridge:

```text
DP recurrence ↔ generating function ↔ linear algebra
```

Knowing the bridge helps with recognition, but the implementation technique should match the constraints.

---

## 22. Counting modulo M

Most competitive-programming and production counting problems specify a modulus.

For a prime or arbitrary modulus, do not assume division is legal. Addition and multiplication are always safe modulo `M`; division requires an inverse and therefore additional conditions.

In JavaScript, modular multiplication with large operands may exceed exact `Number` precision. Use `BigInt` or a carefully designed safe modular arithmetic strategy.

---

## 23. Exact counting with BigInt

When the exact answer is required, `BigInt` is the natural JavaScript representation for arbitrary-size integers.

Keep the entire arithmetic pipeline consistent:

```js
const MOD = 1000000007n;
let ways = 0n;
ways = (ways + contribution) % MOD;
```

Do not mix `Number` and `BigInt` implicitly; JavaScript does not permit arithmetic between them without explicit conversion.

---

## 24. Avoiding overcounting

For every counting DP, write an **object-to-path argument**:

1. What is one object?
2. What is its unique canonical representation?
3. Which transition represents its final choice?
4. Why can two transitions not represent the same object?
5. Why does every valid object appear?

If the answer to uniqueness is unclear, the recurrence may be counting permutations when combinations were intended, or otherwise introducing multiplicity.

---

## 25. Verification strategy

Counting algorithms deserve unusually strong testing because an answer that is off by one can hide structural errors.

Use:

- brute-force enumeration for tiny instances;
- closed-form combinatorial identities;
- independent polynomial and DP implementations;
- modular and exact arithmetic cross-checks;
- symmetry tests;
- monotonicity where mathematically valid;
- decomposition tests;
- randomized differential testing;
- adversarial duplicate and zero-value cases.

Do not use a property as an oracle unless the property is actually proven for the model.

---

## 26. Backend engineering applications

Counting DP and generating functions appear in backend systems when the system needs to aggregate combinatorial possibilities rather than merely store records.

Examples:

- counting workflow configurations;
- estimating possible scheduling assignments;
- feature-combination enumeration;
- quota/resource allocation;
- exact audit counts over bounded state spaces;
- combinatorial test generation;
- finite configuration search.

For production systems, protect endpoints against combinatorial explosion. A mathematically correct `O(2^n)` or `O(K²)` computation can still be operationally unsafe.

---

## 27. AI engineering applications

Finite-state counting and polynomial state transitions can support:

- constrained sequence generation;
- counting paths through rule automata;
- probability distributions over bounded scores;
- exact evaluation of structured candidate spaces;
- feature-combination analysis;
- dynamic programming inside decoding or planning components.

When integrating such algorithms into AI systems, separate exact algorithmic computation from model-generated heuristics. A language model can propose a recurrence, but the implementation should validate it against executable oracles.

---

## 28. Complexity reasoning

Always identify the true dimensions:

- number of DP states;
- polynomial degree;
- number of transitions;
- convolution cost;
- number of polynomial merges;
- modulus arithmetic cost;
- sparsity.

Typical costs include:

```text
O(NK)       ordinary bounded counting DP
O(K²)       naive polynomial convolution
O(NK²)      repeated polynomial transitions
O(NK log K) transform-based convolution in suitable settings
```

The last bound requires appropriate polynomial multiplication machinery and algebraic assumptions; it is not a drop-in replacement for every DP.

---

## 29. Recognition checklist

When a problem asks **how many**, ask:

1. Can I define a finite state that uniquely classifies partial objects?
2. Is the final choice naturally additive?
3. Are independent components multiplicative?
4. Is there a resource index that can become a polynomial degree?
5. Would multiplying factors represent independent choices?
6. Is the transition a convolution?
7. Is order relevant?
8. Can a closed-form identity validate small cases?
9. Would a finite-state transition matrix help for huge horizons?
10. Is the modulus/arithmetic representation safe?

---

## 30. Master pattern

The reusable progression is:

```text
Define the object
      ↓
Choose a canonical decomposition
      ↓
Design counting state
      ↓
Derive additive/multiplicative recurrence
      ↓
Check uniqueness / overcounting
      ↓
Implement ordinary DP
      ↓
Recognize polynomial or generating-function form
      ↓
Exploit convolution / transforms only when justified
      ↓
Verify against brute force and independent identities
```

The main skill is not knowing generating-function notation. It is recognizing when **counting structure can be represented algebraically without losing the semantics of the original DP**.
