# 16 — Probability DP & Stochastic State Transitions

> **Phase 17 — Dynamic Programming**
>
> Probability DP extends dynamic programming from deterministic transitions to weighted outcomes. The central task is still state design, but transitions now combine probabilities, expectations, or distributions instead of simple min/max/count operations.

---

## 1. Core Mental Model

A deterministic DP often looks like:

```text
dp[state] = aggregate(nextState values)
```

A stochastic DP looks like:

```text
dp[state] = Σ P(outcome | state) × contribution(outcome)
```

The state represents everything required to describe the future. Randomness changes the transition weights, not the need for a sufficient state.

Typical objectives:

- probability of eventually reaching a target;
- expected number of steps;
- expected accumulated reward;
- probability distribution over final states;
- probability of satisfying a bounded condition;
- optimal expected value when decisions and randomness coexist.

---

## 2. State Design Still Comes First

Before writing probabilities, define:

```text
What exactly is known at this point?
What random outcomes remain?
What future behavior depends on the history?
```

A state may include:

```text
(position, remaining steps)
(balance, remaining rounds)
(node, steps)
(score, resource)
```

If two histories have identical future transition behavior and identical objective semantics, they can share one state.

---

## 3. Probability DP on a DAG

If every transition moves toward a terminal state, process states in reverse topological order.

For a state `s` with outcomes `t`:

```text
P[s] = Σ p(s → t) × P[t]
```

Terminal states define boundary conditions:

```text
P[target] = 1
P[dead]   = 0
```

The recurrence is simply weighted aggregation over stochastic edges.

---

## 4. Expected Value DP

Let `E[s]` be the expected future reward from state `s`.

For an immediate reward `r(s, t)`:

```text
E[s] = Σ p(s → t) × (r(s, t) + E[t])
```

If the reward belongs to the current state instead:

```text
E[s] = reward[s] + Σ p(s → t) × E[t]
```

Be precise about where the reward is counted. Off-by-one reward errors are common.

---

## 5. Expected Number of Steps

For a non-terminal state where exactly one transition occurs next:

```text
E[s] = 1 + Σ p(s → t) × E[t]
```

The `1` represents the current step.

For a terminal state:

```text
E[terminal] = 0
```

This recurrence is valid when the process terminates with probability one and the expected value is finite.

---

## 6. Boundary Conditions

Probability and expectation DPs are extremely sensitive to terminal semantics.

Define explicitly:

- success state;
- failure state;
- absorbing state;
- maximum-step cutoff;
- impossible state;
- reward at entry vs exit.

A correct recurrence with incorrect boundary conditions still produces a wrong algorithm.

---

## 7. Finite-Horizon Random Processes

When a process lasts at most `K` rounds, use a time dimension:

```text
dp[step][state]
```

For example:

```text
dp[t + 1][next] += dp[t][state] × probability
```

This is often the cleanest formulation because the dependency graph is acyclic in `t`.

Space can frequently be reduced to two layers:

```text
current[state]
next[state]
```

when only the previous time layer is required.

---

## 8. Distribution DP

Sometimes the objective is not one probability but an entire distribution.

Example:

```text
dp[t][sum] = probability of obtaining sum after t rounds
```

Transition:

```text
dp[t + 1][sum + outcome] +=
    dp[t][sum] × P(outcome)
```

This is structurally similar to counting DP, except integer addition becomes probability-weighted addition.

---

## 9. Convolution View

If independent outcomes are repeatedly added, distribution DP can be interpreted as repeated convolution.

For a die:

```text
newDistribution = oldDistribution * dieDistribution
```

Naive DP is often sufficient for moderate ranges.

For very large horizons or domains, polynomial multiplication, FFT/NTT, matrix exponentiation, or other transforms may become relevant.

The algorithm should be chosen from the state-space and transition structure, not from the word “probability” alone.

---

## 10. Absorbing Markov States

A stochastic process may contain cycles:

```text
A → B → A
```

Now ordinary DAG ordering is impossible.

For an absorbing Markov process, expected values may satisfy simultaneous linear equations such as:

```text
E[A] = 1 + p E[B] + (1-p)E[target]
E[B] = 1 + q E[A] + (1-q)E[target]
```

The recurrence is still a DP-like state equation, but it is no longer evaluated by simple topological order.

For small systems, solve the resulting linear equations directly. For structured processes, exploit the structure instead of blindly constructing a dense matrix.

---

## 11. Probability of Eventual Success in Cyclic Processes

Similarly:

```text
P[A] = p P[B] + (1-p) × 1
P[B] = q P[A] + (1-q) × 0
```

Cycles require additional mathematical assumptions and solution techniques.

Do not apply memoized DFS to a cyclic stochastic graph and assume recursion will terminate.

---

## 12. Conditional Probability and State Expansion

If future transition probabilities depend on hidden history, the current state is insufficient.

Expand the state until the process becomes Markovian with respect to the modeled state.

For example, if the next probability depends on the previous outcome:

```text
state = (position, previousOutcome)
```

This is the same state-sufficiency principle used throughout DP.

---

## 13. Exact Rational vs Floating Point

JavaScript `Number` uses binary floating-point arithmetic.

Repeated probability operations can accumulate rounding error.

For typical engineering simulations, `Number` may be appropriate. For exact small rational problems, represent fractions explicitly:

```text
numerator / denominator
```

or use `BigInt` numerator/denominator arithmetic.

Never use `BigInt` directly for fractional probabilities.

---

## 14. Numerical Stability

Watch for:

- cancellation;
- underflow in long probability chains;
- overflow in unnormalized weights;
- accumulated floating-point error;
- comparing nearly equal probabilities.

For products of many tiny probabilities, log-space can help:

```text
log P(path) = Σ log p(edge)
```

For sums of probabilities in log-space, use log-sum-exp rather than naive addition.

Choose numerical representation based on the scale and required error tolerance.

---

## 15. Probability Conservation

For a valid finite distribution:

```text
Σ_s P[s] ≈ 1
```

within an appropriate floating-point tolerance.

This is one of the strongest invariants available for testing distribution DPs.

A transition kernel should also satisfy:

```text
Σ_t P(s → t) ≈ 1
```

unless explicitly modeling termination or sub-probability transitions.

---

## 16. Monte Carlo as an Independent Oracle

For sufficiently simple stochastic problems, simulation provides an independent validation mechanism.

Run many random trials and estimate:

```text
estimatedProbability = successes / trials
```

or:

```text
estimatedExpectation = totalReward / trials
```

The simulation result should converge toward the DP result as the number of trials grows, subject to sampling error.

Monte Carlo is a validation tool here, not a replacement for an exact finite-state DP when exact computation is feasible.

---

## 17. Optimal Decisions + Randomness

Some problems combine choices and stochastic transitions.

Then the recurrence may be:

```text
V[s] = max_action Σ_t P(t | s, action) × V[t]
```

or, for cost minimization:

```text
V[s] = min_action expectedCost(action, s)
```

This is the bridge from probability DP to finite-horizon Markov decision processes.

The state must include every variable needed for future transition and reward semantics.

---

## 18. Finite-Horizon Decision DP

With a bounded number of decisions:

```text
V[t][s] = best expected value from state s with t decisions remaining
```

Transition:

```text
V[t][s] = max_a Σ_t' P(t' | s, a)
                 × (reward + V[t-1][t'])
```

Because `t` decreases, this is a standard acyclic DP.

Store the chosen action when policy reconstruction is required.

---

## 19. Bellman Principle

The principle of optimality still applies:

> Given the current sufficient state, an optimal continuation can be selected independently of the exact history that produced that state.

Randomness changes the aggregation from deterministic `max/min` over successor values to an expectation over stochastic outcomes, optionally followed by an action optimization.

---

## 20. Policy Reconstruction

For decision problems, the output may be:

```text
optimal value
```

or:

```text
optimal policy[action for each reachable state]
```

Keep the value computation separate from policy reconstruction when possible.

If multiple actions have equal expected value, define deterministic tie-breaking if reproducibility matters.

---

## 21. Monotonicity and Coupling

Some stochastic DPs admit powerful test properties.

If increasing a reward cannot decrease the optimal expected reward, test that relation.

If one transition distribution stochastically dominates another under the same monotone objective, the resulting value should respect that ordering when the model satisfies the required assumptions.

These are examples of **metamorphic properties** rather than fixed expected outputs.

---

## 22. Backend Engineering Applications

Probability DP can model:

- retry success probabilities;
- workflow completion likelihoods;
- queue/resource processes with bounded horizons;
- reliability of finite-state workflows;
- expected latency under randomized routing;
- risk accumulation across finite workflows.

Separate the algorithm from infrastructure concerns such as random-number generation, persistence, API timeouts, and observability.

For production systems, document whether probabilities are empirical estimates, configured assumptions, or mathematically derived values.

---

## 23. AI Engineering Applications

Stochastic DP concepts connect directly to:

- finite-horizon planning;
- probabilistic decoding;
- sequential decision processes;
- expected reward optimization;
- beam/search state scoring;
- probabilistic automata;
- dynamic programming over uncertainty states.

The important engineering distinction is between an exact finite-state model and an approximation caused by pruning, sampling, quantization, or beam limits.

---

## 24. Complexity

For finite-horizon state space `S`, horizon `K`, and average branching factor `B`:

```text
Time:  O(K × S × B)
Space: O(S)
```

with rolling layers.

For a dense transition matrix over `S` states:

```text
Time:  O(K × S²)
```

unless structure allows acceleration.

Always count the actual state dimensions. Probability itself does not determine complexity.

---

## 25. Common Failure Modes

### Failure 1 — Forgetting transition probabilities
Treating all outcomes as equally likely.

### Failure 2 — Wrong terminal condition
Assigning success/failure values to the wrong state.

### Failure 3 — Counting the current step incorrectly
Adding `1` in both terminal and non-terminal transitions.

### Failure 4 — Ignoring history dependence
Using an insufficient state when transition probabilities depend on previous outcomes.

### Failure 5 — Memoizing a cyclic recurrence
Assuming memoization solves cycles automatically.

### Failure 6 — Floating-point equality
Using `a === b` for values that result from many probability operations.

### Failure 7 — Invalid distribution
Allowing probabilities to sum to substantially more or less than one.

---

## 26. Correctness Proof Template

For finite-horizon probability DP:

1. Define the state precisely.
2. State the terminal/base condition.
3. Assume the value for every next-layer state is correct.
4. Enumerate all mutually exclusive stochastic outcomes.
5. Weight each continuation by its transition probability.
6. Sum the weighted values.
7. Therefore the recurrence equals the true probability/expectation for the current state.

For decision + randomness:

1. Prove each action's expected continuation value.
2. Show the optimization considers every legal action.
3. Select the maximum/minimum according to the objective.
4. Therefore the chosen value is optimal.

---

## 27. Differential Testing

Whenever possible, compare:

```text
exact DP
vs
brute-force outcome enumeration
```

for tiny horizons.

For larger cases, compare against:

```text
exact DP
vs
Monte Carlo estimate
```

Use confidence intervals or standard-error reasoning rather than expecting simulation to equal the exact value digit-for-digit.

---

## 28. Adversarial Test Suite

Include:

- probability `0` transitions;
- probability `1` transitions;
- deterministic transitions represented probabilistically;
- one-state processes;
- immediate success/failure;
- maximum horizon;
- highly skewed probabilities;
- tiny probabilities;
- repeated states;
- history-dependent transitions;
- ties between actions;
- unreachable states;
- cyclic models where the chosen solver must reject or separately handle cycles.

---

## 29. Interview Framework

When you see a probability problem, ask:

1. What is the state?
2. What are the terminal conditions?
3. What are all stochastic outcomes?
4. Do transition probabilities sum to one?
5. Is the horizon finite?
6. Is the dependency graph acyclic?
7. Am I computing probability, expectation, distribution, or optimal expected value?
8. Does history need to be encoded in the state?
9. Is floating-point precision sufficient?
10. Can brute force or Monte Carlo validate the implementation?

---

## 30. Master Pattern

```text
Random process
      ↓
Define sufficient state
      ↓
Identify terminal / horizon semantics
      ↓
Enumerate stochastic transitions
      ↓
Weighted aggregation
      ↓
Probability / expectation / distribution
      ↓
If decisions exist → optimize expected value
      ↓
Check numerical representation
      ↓
Prove invariants
      ↓
Validate with brute force / simulation
```

Probability DP is still DP at its core: compress equivalent histories into sufficient states. The new ingredient is that successor states contribute according to a probability distribution, and numerical correctness becomes part of algorithm correctness.