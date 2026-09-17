# 45 — Symbolic DP: BDDs, ADDs & Decision-Diagram State Compression

## 0. Learning Objective

Most dynamic programs explicitly enumerate states:

```text
state_0
state_1
state_2
...
```

That is powerful when the reachable state set is small. But some problems have an enormous Cartesian-product state space while the actual state function has a compact logical or algebraic structure.

**Decision diagrams** provide a different representation:

- a BDD represents Boolean functions compactly;
- an ADD represents finite-domain functions whose leaves carry values;
- related reduced decision diagrams merge equivalent suffix computations.

This lesson develops the DP abstraction:

> **When a DP state space is huge but the transition/value function has repeated substructure, represent the state function as a reduced DAG rather than as an explicit table.**

The goal is to understand symbolic dynamic programming as a state-compression technique, not to memorize a BDD library API.

---

## 1. Explicit DP Versus Symbolic DP

A normal DP table may look like:

```text
dp[state] = value
```

If a state has `n` Boolean variables, there can be `2^n` assignments.

Symbolic DP instead stores a decision diagram whose paths represent assignments and whose leaves represent values.

The representation can exploit repeated subfunctions:

```text
many assignments
      ↓
same residual function
      ↓
shared DAG node
```

The asymptotic improvement comes from **structural sharing**, not from changing the recurrence itself.

---

## 2. Ordered Binary Decision Diagrams

A binary decision diagram branches on Boolean variables.

At a node for variable `x_i`:

```text
          x_i
         /   \
      low     high
```

The low edge means:

```text
x_i = 0
```

and the high edge means:

```text
x_i = 1
```

An **ordered** BDD uses one global variable ordering:

```text
x0 < x1 < x2 < ...
```

along every path.

Ordering gives a canonical structural discipline and enables aggressive sharing.

---

## 3. Reduced BDDs

Two key reduction rules are:

### Rule A — Eliminate redundant tests

If both branches of a node are identical:

```text
low === high
```

then the node can be replaced by that child.

### Rule B — Merge isomorphic nodes

If two nodes have the same:

```text
variable
low child
high child
```

they represent the same residual Boolean function and can be shared.

A unique-table map can canonicalize nodes:

```text
(variable, low, high) -> nodeId
```

The result is a DAG, not a tree.

---

## 4. Why Reduction Is a DP Idea

Consider evaluating a Boolean function recursively.

A naive recursion creates one subproblem for each assignment prefix.

If two prefixes induce the same residual function, their future computation is identical.

Therefore:

```text
residual function = DP state
```

and

```text
unique-table node = memoized state
```

This is the same overlapping-subproblem principle as ordinary memoization, but the state is represented as a canonical decision-diagram node.

---

## 5. Shannon Expansion

For a Boolean function `f` and variable `x`:

```text
f = (~x AND f|x=0) OR (x AND f|x=1)
```

This is Shannon expansion.

A BDD node stores exactly the two cofactors:

```text
low  = f[x=0]
high = f[x=1]
```

Recursive Boolean operations therefore become recursive DP over cofactors.

The most important engineering question is:

> Are repeated cofactors being recognized and shared?

Without canonicalization, a decision diagram can degenerate into a large tree.

---

## 6. Terminal Semantics

A BDD normally has two terminals:

```text
FALSE
TRUE
```

An ADD generalizes this to value terminals:

```text
0
1
17
-3
INF
...
```

This means a decision diagram can represent a function:

```text
f : {0,1}^n -> Values
```

where each assignment maps to an algebraic result.

That is exactly the shape of many DP tables.

---

## 7. Algebraic Decision Diagrams

An ADD is useful when the leaf value is not just Boolean.

Examples:

```text
assignment -> cost
assignment -> count
assignment -> probability
assignment -> score
assignment -> resource usage
```

The internal variable structure remains Boolean or finite-domain branching, while terminal values live in an application-defined algebra.

For optimization:

```text
terminal values -> costs/scores
combine -> min/max
```

For counting:

```text
terminal values -> integers
combine -> + and × where appropriate
```

The decision structure and numeric algebra can therefore be separated.

---

## 8. Symbolic State Sets

Suppose a system state is a bit-vector:

```text
x0 x1 x2 ... xn-1
```

The set of legal states can be represented as a Boolean function:

```text
Reachable(x) = true/false
```

Instead of storing every reachable state, store one BDD representing the set.

Then operations such as:

- conjunction of constraints;
- disjunction of alternatives;
- existential elimination;
- relational image;

can update the symbolic set without enumerating every assignment.

This is the foundation of symbolic reachability algorithms.

---

## 9. Symbolic DP Over a Transition Relation

Let

```text
T(x, y)
```

be a Boolean transition relation from current state `x` to next state `y`.

Let

```text
R_t(x)
```

represent states reachable after `t` steps.

Then the symbolic successor operation is:

```text
R_{t+1}(y)
  = EXISTS_x [ R_t(x) AND T(x,y) ]
```

followed by renaming/selecting the `y` variables as the new current-state variables.

This is dynamic programming over a set-valued state function.

The recurrence is explicit in logic rather than an array loop.

---

## 10. Relational Product

The operation

```text
EXISTS_x [ R(x) AND T(x,y) ]
```

is commonly viewed as a relational product.

It performs two conceptual steps:

```text
filter transitions by reachable source states
        ↓
project away source variables
```

The key point is that the intermediate assignments do not need to be materialized explicitly.

A symbolic solver succeeds when this projection remains compact in the chosen variable ordering.

---

## 11. Existential Quantification

Given a Boolean function `f(x, y)`, existentially eliminate `x`:

```text
EXISTS_x f = f[x=0] OR f[x=1]
```

For a set representation, this means:

```text
some assignment to x exists
```

In a decision diagram, quantification is a recursive combine operation.

For multiple variables:

```text
EXISTS_{x1,...,xk} f
```

can be implemented by repeated quantification, though operation ordering and caching strongly affect performance.

---

## 12. ADD-Based Dynamic Programming

Suppose a DP maps every configuration to a numeric value:

```text
V(x)
```

An ADD can represent `V`.

A transition can be represented as another decision diagram or decomposed operation.

Then a symbolic Bellman-style step can look like:

```text
V_next(y)
  = aggregate_x { V(x) + Cost(x,y) }
```

with:

```text
aggregate = min
```

for shortest-cost semantics.

For maximization, use `max`; for counting, use the corresponding algebra.

The hard problem is implementation of the aggregate over eliminated variables without causing a representation blow-up.

---

## 13. Variable Elimination as DP

A decision diagram can be viewed as a structured variable-elimination order.

At every node:

```text
choose variable
split
solve both cofactors
merge equivalent results
```

This creates a direct conceptual bridge to earlier DP lessons:

- state design;
- separator-based decomposition;
- variable elimination;
- treewidth-style reasoning.

The difference is that a reduced decision diagram dynamically merges equal residual functions rather than fixing one explicit bag-state representation in advance.

---

## 14. Variable Ordering Is an Algorithmic Parameter

BDD size can vary dramatically with variable ordering.

The same Boolean function may have:

```text
small BDD under ordering A
huge BDD under ordering B
```

Therefore ordering belongs in the complexity analysis.

Useful heuristics include grouping related variables:

```text
current-state variables together
next-state variables together

or

interleaved x0,y0,x1,y1,...
```

depending on the transition structure.

There is no universal best ordering.

---

## 15. State-Versus-Next-State Ordering

For transition relations using current and next state:

```text
T(x0,...,xn-1, y0,...,yn-1)
```

common layouts include:

### Blocked

```text
x0 x1 x2 ... xn-1 y0 y1 ... yn-1
```

### Interleaved

```text
x0 y0 x1 y1 x2 y2 ...
```

Interleaving can preserve locality for bitwise transition logic; other structures may favor blocked ordering.

The correct choice must be measured on representative instances.

---

## 16. Unique Tables and Canonicalization

A reduced decision diagram needs canonical node creation.

Conceptually:

```text
makeNode(variable, low, high):
    if low == high:
        return low

    key = (variable, low, high)
    if key exists in uniqueTable:
        return uniqueTable[key]

    create node
    uniqueTable[key] = node
    return node
```

This is a hash-consing pattern.

Canonicalization converts semantic equality into pointer/node-ID equality.

That can dramatically simplify memoization and equality checks.

---

## 17. Apply Algorithm

A central operation is applying a binary operator to two decision diagrams:

```text
Apply(op, A, B)
```

Examples:

```text
AND(A,B)
OR(A,B)
XOR(A,B)
ADD(A,B)
MIN(A,B)
MAX(A,B)
```

The recursive algorithm:

1. handle terminal cases;
2. inspect the top variable of each operand;
3. split on the smaller variable according to the global order;
4. recursively combine matching cofactors;
5. rebuild through the unique table.

Memoization key:

```text
(op, nodeA, nodeB)
```

is another DP cache.

---

## 18. Apply as a Product Computation

The complexity of Apply depends on the number of distinct node-pairs reached, not merely on the number of assignments represented.

This is crucial.

A function can represent exponentially many assignments while an operation visits only a polynomial number of node pairs.

But the opposite can also happen: Apply can generate many new node pairs and trigger a large BDD.

Therefore benchmark **node-pair growth**, not just input size.

---

## 19. Restriction and Cofactor

Given a function diagram `F` and assignment:

```text
x_i = b
```

restriction produces:

```text
F|x_i=b
```

A recursive restriction follows only one branch when it encounters the selected variable.

Restriction is useful for:

- conditioning a DP state;
- evaluating partial assignments;
- debugging symbolic functions;
- branch-and-bound hybrids;
- decomposition into cofactors.

It is often cheaper than enumerating all assignments consistent with the partial condition.

---

## 20. Quantification and DP State Elimination

A powerful interpretation is:

```text
explicit DP dimension
        ↓
symbolic variable
        ↓
quantify/eliminate variable
        ↓
compressed residual function
```

For example, if

```text
F(x,y,z)
```

stores feasible transitions and `y` is internal, then:

```text
G(x,z) = EXISTS_y F(x,y,z)
```

removes that dimension.

This is structurally similar to eliminating an intermediate DP index, but performed on a shared symbolic representation.

---

## 21. Symbolic Reachability as Repeated DP

Start with:

```text
R0 = InitialStates
```

Then iterate:

```text
R_{t+1} = Image(R_t)
```

where `Image` is implemented symbolically through the transition relation.

For a finite state space, continue until:

```text
R_{t+1} == R_t
```

This computes a reachable-state fixed point.

The stopping condition is semantic equality of represented sets, not equality of explicit arrays.

---

## 22. Frontier-Based Symbolic DP

Some problems process variables in layers.

A frontier state can be represented symbolically rather than enumerated.

For example:

```text
processed prefix
    ↓
frontier assignment
    ↓
valid frontier states = BDD
```

A transition relation maps one frontier to the next:

```text
F_next = Image(F_current)
```

This combines frontier DP with symbolic state compression.

The technique is especially useful when the number of syntactically possible frontier assignments is huge but many share the same logical structure.

---

## 23. ADDs for Cost Functions

Suppose each Boolean configuration gets a numeric cost:

```text
cost(x) = x0*5 + x1*2 + ...
```

An ADD can represent this function while sharing repeated suffixes.

Operations such as:

```text
MIN
MAX
PLUS
TIMES
```

can then compose or compare value functions symbolically.

A DP over Boolean configuration space can therefore become a sequence of ADD operations.

---

## 24. Symbolic Knapsack / Constraint Example

Suppose each item selection is a Boolean variable:

```text
x_i ∈ {0,1}
```

and the DP/objective depends on a structured set of constraints.

An explicit subset table may require:

```text
O(2^n)
```

states.

A symbolic representation can encode:

```text
feasible selections
```

as a BDD and attach values through an ADD.

Whether this helps depends entirely on structural regularity.

Symbolic representation is not a free replacement for pseudo-polynomial or exponential DP.

---

## 25. Symbolic Counting

A reduced Boolean function can support model counting:

```text
# assignments satisfying F
```

A recursive count can exploit skipped variables.

If a node at variable `x_i` jumps directly to a deeper variable `x_j`, then the skipped variables contribute multiplicative factors:

```text
2^(number of skipped variables)
```

This is another DP over the diagram DAG.

For exact large counts in JavaScript, use `BigInt`.

---

## 26. Weighted Model Counting

Replace Boolean existence with weights:

```text
W(F) = sum over satisfying assignments of product of literal weights
```

The decision-diagram structure can recursively aggregate these values.

This connects symbolic DP to:

- probabilistic inference;
- reliability models;
- feature selection;
- combinatorial counting;
- weighted constraint solving.

The same reduced graph may serve many queries if the leaf/algebra operations are modularly designed.

---

## 27. Symbolic Shortest-Path / Bellman Updates

Suppose a state is a Boolean vector and transition cost depends on local variables.

An ADD can represent:

```text
V(state)
```

A symbolic Bellman update is conceptually:

```text
V_new(next)
  = min_previous {
      V(previous) + Cost(previous,next)
    }
```

The previous-state variables are eliminated.

This is dynamic programming over a function algebra.

The critical engineering challenge is representing the intermediate product compactly.

---

## 28. Exact Versus Approximate Symbolic DP

Symbolic DP is normally exact when operations and reductions preserve semantics exactly.

Approximate alternatives include:

- diagram-size thresholds;
- abstraction/merging of similar numeric leaves;
- beam-like pruning of symbolic states;
- bounded-width approximations.

Once approximation is introduced, correctness guarantees change.

Keep exact and approximate modes separate in the engine API.

---

## 29. Complementary Abstraction: BDD, ADD, MDD

Different state domains motivate different diagrams.

### BDD

Boolean variables and Boolean terminal semantics.

### ADD

Boolean variables with arbitrary terminal values.

### MDD

Multi-valued decision diagrams where variables can have more than two values.

For a categorical DP state:

```text
color ∈ {0,1,2,3}
```

an MDD can avoid binary encoding overhead in some cases.

The same principle applies:

```text
ordered variables
+ canonical DAG
+ merged equivalent residual functions
```

---

## 30. Dynamic Variable Ordering

Static ordering can be poor for some workloads.

A symbolic engine may attempt dynamic reordering by transformations such as swapping adjacent variables while preserving semantics.

The objective is:

```text
reduce node count
```

without changing the represented function.

Reordering is algorithm engineering at the representation layer.

Measure:

- node count before/after;
- operation time;
- cache invalidation cost;
- memory pressure.

Do not assume fewer nodes always means faster total execution.

---

## 31. Cache Architecture

A serious symbolic engine usually has several memo tables:

```text
uniqueTable
applyCache
restrictCache
quantifyCache
renameCache
composeCache
```

These are all forms of memoization.

Cache-key design matters as much as in ordinary DP:

```text
(op, nodeA, nodeB)
```

must uniquely identify the operation's future semantics.

Incorrect cache keys can silently corrupt results.

---

## 32. Garbage Collection and Node Lifetime

A node may become unreachable from all externally held roots.

A production symbolic engine therefore needs a memory policy such as:

- reference counting;
- mark-and-sweep;
- generation-based reclamation;
- explicit arena lifetime management.

The algorithmic structure is a DAG, so accidental retention can make memory grow even when semantic state size remains stable.

Memory management is part of symbolic-DP correctness in long-running services.

---

## 33. Canonical Equality Versus Hash Equality

With canonical reduced nodes, two equivalent functions can share the same root node identity.

Therefore:

```text
A === B
```

can become a semantic equality test.

Without canonicalization, hash equality is only evidence, not proof.

This distinction matters when checking convergence:

```text
R_next === R_current
```

should mean canonical semantic identity.

---

## 34. Terminal Arithmetic and Numeric Contracts

ADD terminals can carry large integers or floating-point values.

For exact counts:

```text
BigInt
```

may be required.

For probabilities:

```text
floating-point or log-space
```

may be appropriate.

For min-plus optimization:

```text
INF
```

must be distinct from every legitimate finite value.

Never build a generic symbolic algebra without explicitly documenting:

- zero;
- one;
- unreachable;
- equality;
- combine semantics;
- numeric overflow behavior.

---

## 35. Complexity: Node Count Is the Real State Size

For explicit DP:

```text
complexity ≈ number of states × transitions per state
```

For symbolic DP, replace state count with quantities such as:

```text
number of diagram nodes
number of reachable node-pairs in Apply
number of quantification steps
number of unique-table insertions
```

The same logical function can have drastically different diagram sizes under different orderings.

Thus a good symbolic complexity report includes both:

```text
semantic state-space size
representation size
```

---

## 36. Why Symbolic DP Can Still Blow Up

A BDD does not magically make exponential problems polynomial.

Bad cases include functions with poor sharing.

Then:

```text
BDD nodes ≈ number of assignments
```

and explicit enumeration may be unavoidable.

Typical causes:

- adversarial variable interactions;
- poor variable order;
- large intermediate products;
- XOR-heavy functions under unsuitable encodings;
- numeric ADDs with many distinct terminal values.

A symbolic solver must therefore detect and report representation growth.

---

## 37. Hybrid Symbolic + Explicit DP

A practical engine may use both representations:

```text
symbolic BDD/ADD
       ↓ if compact
continue symbolically
       ↓ if representation explodes
materialize selected frontier / partition
       ↓
explicit DP locally
       ↓
compress back if useful
```

This is another form of adaptive state representation.

The switch criterion should be measurable:

```text
node count
memory
operation latency
estimated explicit state count
```

Avoid arbitrary thresholds without benchmarking.

---

## 38. Verification Through Dual Representations

For tiny instances, implement both:

```text
explicit enumerator
symbolic decision diagram
```

and compare:

```text
function values for every assignment
reachable sets
counts
optimization values
```

This creates a strong differential-testing strategy.

Because symbolic implementations are compact but intricate, an independent explicit oracle is especially valuable.

---

## 39. Backend Engineering Applications

Symbolic DP can model:

- feature-flag combinations;
- authorization-policy state spaces;
- workflow reachability;
- configuration validation;
- dependency constraints;
- finite-state service modes.

Example:

```text
configuration bits
      ↓
constraint BDD
      ↓
reachable configurations
      ↓
cost/priority ADD
      ↓
optimal valid configuration
```

This is useful when the explicit Cartesian product is large but constraints share substantial structure.

---

## 40. AI Engineering Applications

Symbolic DP can complement learned models by representing hard finite constraints exactly.

Examples:

- constrained decoding over finite state features;
- exact feasibility filtering;
- structured configuration search;
- finite-state planning;
- weighted rule systems;
- explanation/certificate generation.

A model score can live in an ADD while a hard constraint lives in a BDD.

The combination supports:

```text
feasible ∧ high-score
```

without relaxing the constraint into a soft heuristic.

---

## 41. Relationship to Earlier DP Patterns

This lesson connects several earlier ideas:

```text
memoization
    ↓ canonical residual states

bitmask DP
    ↓ Boolean configuration variables

profile/frontier DP
    ↓ symbolic frontier set

treewidth / variable elimination
    ↓ eliminate internal variables

automaton DP
    ↓ transition relation over finite states

semiring DP
    ↓ configurable terminal/aggregate algebra
```

The new abstraction is the representation layer:

> **Instead of enumerating every state, represent the state-value function as a reduced DAG.**

---

## 42. Recognition Framework

When a DP has a huge Boolean/categorical state space, ask:

### Question 1
Can states be expressed as assignments to a small or structured set of variables?

### Question 2
Do many assignments share the same future behavior/value?

### Question 3
Can the constraints be represented compactly as a Boolean relation?

### Question 4
Can the transition be composed symbolically?

### Question 5
Will the chosen variable ordering preserve sharing?

If the answers are favorable, symbolic DP may be appropriate.

If not, explicit DP, bitsets, decomposition, or another representation may be superior.

---

## 43. Common Failure Modes

### Treating node count as guaranteed polynomial

A compact diagram is workload-dependent.

### Ignoring variable ordering

Ordering is often the dominant representation parameter.

### Confusing path semantics with symbolic function semantics

The diagram represents a function/set; the DP recurrence still determines what that function means.

### Using non-canonical nodes

Equivalent functions then fail to merge.

### Wrong Apply memo keys

Can produce incorrect results.

### Numeric leaf explosion

Many distinct terminal values can destroy ADD sharing.

### Hiding approximation inside pruning

Exactness and approximation must be explicitly separated.

---

## 44. Correctness Proof Template

A symbolic DP proof should establish:

1. **Representation invariant** — every node represents the documented residual function.
2. **Canonical construction** — equivalent nodes are merged and redundant tests removed.
3. **Apply correctness** — recursive cofactors combine to the intended operator result.
4. **Quantification correctness** — eliminated variables are aggregated with the correct algebra.
5. **Transition correctness** — the symbolic relation encodes exactly the legal transitions.
6. **DP recurrence correctness** — one symbolic step equals one semantic DP step.
7. **Convergence correctness** — equality of canonical roots implies semantic fixed point.
8. **Reconstruction/certificate correctness** when witnesses are required.

These proof obligations are the symbolic analogue of ordinary DP invariants and recurrence proofs.

---

## 45. Master Pattern

```text
Huge explicit state space
        ↓
Represent state/value function symbolically
        ↓
Canonicalize equivalent residual functions
        ↓
Compose transition/value operators
        ↓
Quantify internal variables
        ↓
Memoize diagram operations
        ↓
Measure representation growth
        ↓
Switch to explicit/hybrid DP when needed
        ↓
Verify against independent explicit oracles
```

The deepest lesson is:

> **Dynamic programming is not tied to arrays. It is the systematic reuse of future-equivalent subproblems. Decision diagrams provide a canonical DAG representation of those subproblems when the state function has exploitable structure.**

---

## 46. Interview Framework

When asked about symbolic DP:

1. Define the explicit state space.
2. Explain why enumeration is expensive.
3. Identify repeated residual functions.
4. Choose BDD, ADD, or MDD semantics.
5. Define variable ordering.
6. Define canonical node construction.
7. Explain Apply/restriction/quantification.
8. Derive the symbolic recurrence.
9. State representation-sensitive complexity.
10. Explain blow-up risks and fallback strategy.
11. Give a brute-force differential-test plan.

Do not claim that BDDs solve every exponential DP. The value comes from exploitable structural sharing.

---

## 47. Final Checklist

Before considering symbolic DP mastered, you should be able to:

- design a reduced ordered BDD from first principles;
- explain why canonical DAG nodes are memoized DP states;
- implement unique-table node creation;
- implement Apply with memoization;
- implement restriction and existential quantification;
- represent reachable-state sets symbolically;
- represent numeric value functions with ADDs;
- perform symbolic transition/image computation;
- reason about variable ordering;
- distinguish semantic state-space size from diagram size;
- detect representation blow-up;
- build explicit-versus-symbolic differential tests;
- design a hybrid fallback strategy;
- prove the symbolic recurrence correct.
