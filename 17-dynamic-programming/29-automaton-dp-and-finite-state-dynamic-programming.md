# 29 — Automaton DP & Finite-State Dynamic Programming

> **Phase 17 — Dynamic Programming**

## 1. Core Idea

Some DP problems combine a sequence position with a small machine state. The machine remembers exactly the information needed to determine which future transitions are legal or valuable.

The mental model is:

> **When constraints can be represented by a finite automaton, take the automaton state as part of the DP state.**

This turns string constraints, pattern avoidance, bounded-memory workflows, regular-language counting, and constrained optimization into systematic finite-state DP.

---

## 2. DP × Automaton Product

Suppose a sequence has position `i` and an automaton state `q`.

Use:

`dp[i][q] = value after processing i symbols and ending in automaton state q`.

For every legal symbol `c`:

`q' = transition(q,c)`.

Then aggregate:

`dp[i+1][q'] = aggregate(dp[i+1][q'], dp[i][q] + contribution)`.

The resulting state graph is layered and therefore acyclic when `i` always increases.

---

## 3. Deterministic Finite Automata

A DFA has:

- finite states;
- an alphabet;
- exactly one next state for each state/symbol pair;
- accepting states.

This is ideal for DP because transition lookup is deterministic.

Typical DP objectives:

- count accepted strings of length `n`;
- maximize/minimize score among accepted strings;
- find the lexicographically smallest accepted optimum;
- count strings avoiding forbidden patterns.

---

## 4. Nondeterministic Automata

An NFA may have multiple possible transitions for the same state and symbol.

For counting or optimization, naive branching can duplicate equivalent machine states.

Two approaches are common:

1. determinize the automaton;
2. keep a set-of-states representation when its size remains manageable.

Subset construction can create exponentially many DFA states, so the state-space trade-off must be explicit.

---

## 5. Pattern Matching Automata

Multiple forbidden or required patterns can be represented using a trie plus failure transitions.

A multi-pattern automaton lets a DP process one symbol at a time while tracking which suffix/pattern context matters.

This is useful for:

- forbidden substring counting;
- keyword-constrained generation;
- dictionary pattern matching;
- sequence scoring with pattern events.

The automaton removes the need to remember the entire processed prefix.

---

## 6. Forbidden-Pattern Counting

Suppose certain patterns are forbidden.

Mark automaton states that correspond to a forbidden match as dead or invalid.

Then count only transitions that remain valid.

For alphabet size `A`, automaton size `S`, and sequence length `N`, straightforward DP costs approximately:

`O(N*S*A)`.

If `N` is enormous and transitions are fixed, Lesson 27's transfer-matrix techniques can accelerate repeated layers.

---

## 7. Required Patterns

The state may need to remember whether required events have occurred.

For a small number of required patterns, add a bitmask:

`state = (automatonState, seenMask)`.

This is a product of finite-state machines.

The trade-off is multiplicative state growth: `S * 2^k` for `k` tracked requirements.

---

## 8. Weighted Automaton DP

Transitions can carry scores or costs.

Then the same automaton becomes a weighted state graph.

Examples:

- maximize sequence score;
- minimize penalty;
- count weighted strings;
- compute probability of accepted sequences.

The aggregation operator determines the DP algebra:

- sum for counting;
- max for best score;
- min for minimum cost;
- probability accumulation for stochastic models.

---

## 9. Lexicographic Reconstruction

A DP value alone does not identify a witness.

To recover the lexicographically smallest optimal sequence:

1. compute the optimal value from each state;
2. inspect candidate symbols in lexicographic order;
3. choose the first symbol preserving optimality;
4. advance to the next state.

This avoids storing every candidate string.

---

## 10. Regular-Language View

Finite automata recognize regular languages.

Therefore DP over automaton states can answer quantitative questions about regular languages:

- how many accepted strings of length `n`?
- what is the maximum score among accepted strings?
- what is the minimum cost?
- which optimal string should be reconstructed?

The conceptual pipeline is:

```text
regular constraint
      ↓
automaton
      ↓
DP state = position × automaton state
      ↓
value / count / optimum / witness
```

---

## 11. Cyclic Automata and Huge Lengths

The automaton itself can contain cycles. That is normal.

If the sequence length is bounded by `N`, position layering makes the DP acyclic.

If `N` is huge and transitions repeat identically, construct a transition operator and use matrix/semiring exponentiation.

This directly connects finite-state DP with transfer matrices.

---

## 12. Semiring Perspective

Many automaton DPs share the same graph structure while changing the algebra.

A generic transition can be interpreted over a semiring-like pair of operations:

```text
extend edge values → ⊗
combine alternatives → ⊕
```

Examples:

| Objective | Combine | Extend |
|---|---|---|
| Count | `+` | `*` |
| Best score | `max` | `+` |
| Min cost | `min` | `+` |
| Boolean reachability | `OR` | `AND` |

The algebra must satisfy the properties required by the chosen algorithm.

---

## 13. Automaton Construction as State Compression

The hardest part is often not the DP loop but finding the smallest sufficient automaton state.

Ask:

> What information about the prefix can change the legal or valuable future?

Equivalent prefixes should map to the same state whenever their future behavior is identical for the problem's objective.

This is the automaton analogue of good DP state design.

---

## 14. State Minimization

Two DFA states can sometimes be merged when they have identical future acceptance behavior.

Minimization can reduce DP complexity without changing semantics.

For weighted or optimization automata, equivalence is more subtle: states must preserve the relevant future value structure, not merely Boolean acceptance.

Never minimize based only on similar-looking transition tables.

---

## 15. Position-Independent vs Position-Dependent Transitions

If transitions depend only on the current automaton state and chosen symbol, every layer uses the same operator.

If transitions depend on position, time, or external data, a single matrix power may no longer apply.

Possible structures include:

- periodic transition operators;
- block composition;
- segment trees over operators;
- ordinary layered DP.

The fixed-transition assumption must be proved before exponentiation.

---

## 16. Constraint Composition

Multiple independent finite constraints can be combined by taking their product automaton.

For machines `A` and `B`:

`productState = (stateA, stateB)`.

The combined transition applies both machines to the same input symbol.

This provides a systematic way to combine:

- pattern constraints;
- digit restrictions;
- parity conditions;
- forbidden substrings;
- bounded counters.

The downside is state explosion.

---

## 17. Automaton + Bitmask DP

If the number of tracked requirements is small, combine an automaton with a bitmask:

`dp[position][automatonState][mask]`.

This connects automaton DP with the bitmask techniques from earlier lessons.

Typical uses include collecting required patterns or satisfying a small set of event constraints.

Analyze whether the product state can be compressed or sparsified before allocating the full table.

---

## 18. Probability Automata

If transitions represent probabilities, the same state graph supports probability DP.

Maintain:

`p[i][q] = probability of being in state q after i symbols/steps`.

For fixed transition probabilities and huge horizons, matrix multiplication can propagate distributions quickly.

Numerical conservation should be tested:

`sum_q p[i][q] ≈ 1`.

For exact rational probabilities, use rational arithmetic when practical.

---

## 19. Backend Engineering Applications

Finite-state DP can model:

- protocol validation;
- workflow rules;
- event-sequence constraints;
- fraud/risk rule combinations;
- rate-limit state machines;
- log pattern analysis;
- configuration validators.

For production systems, version the automaton definition and keep state semantics explicit. A changed rule set changes the transition operator and invalidates cached powers built for the old machine.

---

## 20. AI Engineering Applications

Automaton DP is useful for exact finite constraints around sequence systems:

- constrained decoding abstractions;
- lexically restricted generation;
- grammar-like regular constraints;
- finite-state reward models;
- structured sequence search;
- weighted finite-state pipelines.

It is especially useful when constraints are exact and finite-state even if the underlying model is much larger.

---

## 21. Correctness Proof Template

Prove:

### Claim 1 — State sufficiency

Two prefixes mapped to the same DP state have equivalent future behavior for the objective.

### Claim 2 — Transition correctness

Every legal symbol causes exactly the corresponding automaton transition.

### Claim 3 — Aggregation correctness

The chosen `⊕` and `⊗` operations combine alternatives exactly as required.

### Claim 4 — Acceptance correctness

The final accepting states correspond exactly to valid complete sequences.

For product automata, prove each component invariant and then their conjunction.

---

## 22. Testing Strategy

Use brute force for short strings.

Test:

- empty strings;
- one-symbol alphabets;
- forbidden patterns of length one;
- overlapping patterns;
- repeated patterns;
- impossible requirements;
- all-accepting automata;
- all-rejecting automata;
- cyclic automata;
- product-state constraints;
- large counts requiring `BigInt` or modulo arithmetic.

Compare automaton DP against explicit string enumeration on small alphabets and lengths.

---

## 23. Recognition Framework

When a problem says “strings/sequences satisfying these rules,” ask:

1. Can the rule be recognized with finite memory?
2. What is the minimum automaton state?
3. Can I build a DFA/NFA/trie-failure machine?
4. What DP objective is required?
5. Does position belong in the state?
6. Can constraints be composed by a product automaton?
7. Is state growth manageable?
8. Are transitions fixed across layers?
9. If length is huge, can I use transfer-matrix exponentiation?
10. How will I reconstruct and verify a witness?

---

## 24. Common Failure Modes

- storing the entire prefix instead of finite relevant memory;
- building an unnecessarily large product state;
- mishandling overlapping pattern matches;
- confusing accepting states with transition legality;
- forgetting empty-string semantics;
- using one matrix power for position-dependent transitions;
- losing counts through unsafe `Number` arithmetic;
- minimizing states without proving equivalence;
- reconstructing a non-optimal witness;
- assuming every sequence constraint is regular.

---

## 25. Master Pattern

```text
identify finite-memory constraint
        ↓
build minimal useful automaton state
        ↓
combine with sequence position
        ↓
define transition + aggregation
        ↓
run layered DP
        ↓
add reconstruction if required
        ↓
if horizon is huge + transition is fixed
        ↓
use transfer operator / matrix power
        ↓
validate against brute force
        ↓
prove state sufficiency + transition correctness
```

The deepest lesson is:

> **Automata provide the memory model; DP provides the quantitative computation over that memory.**

---

## 26. Mastery Checklist

- [ ] Build a DFA and run DP over it.
- [ ] Count accepted strings of length `N`.
- [ ] Avoid multiple forbidden patterns.
- [ ] Handle overlapping pattern matches.
- [ ] Add required-pattern bitmasks.
- [ ] Solve weighted automaton optimization.
- [ ] Reconstruct a lexicographically smallest optimum.
- [ ] Build product automata.
- [ ] Understand state minimization.
- [ ] Combine automaton DP with bitmask DP.
- [ ] Build probability automaton DP.
- [ ] Accelerate fixed automaton transitions with transfer matrices.
- [ ] Differential-test against brute force.
- [ ] Prove state sufficiency and acceptance correctness.
- [ ] Complete backend and AI labs.
