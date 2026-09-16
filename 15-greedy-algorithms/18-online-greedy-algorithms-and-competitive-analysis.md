# 15.18 — Online Greedy Algorithms & Competitive Analysis

## 1. Concept Definition

An **online algorithm** processes input incrementally and must make decisions before seeing future input.

This changes the problem fundamentally:

```text
offline -> future input is known
online   -> future input is unknown
```

An online greedy algorithm therefore needs a policy that performs well despite incomplete information.

## 2. Why Online Algorithms Matter

Backend and AI systems constantly make decisions while workloads are arriving:

- request routing
- cache admission
- job scheduling
- resource allocation
- autoscaling
- stream processing
- recommendation decisions

The future workload is not fully known when each decision is made.

## 3. Offline Optimum

Competitive analysis compares an online algorithm against an optimal offline algorithm that knows the entire input sequence in advance.

The offline optimum is a theoretical benchmark, not something the online system can use during execution.

## 4. Competitive Ratio

For a minimization problem, an online algorithm `A` is `c`-competitive when:

```text
A(I) <= c · OPT(I) + b
```

for every valid input sequence `I`, where `b` is an optional additive constant.

For maximization, the inequality direction is reversed:

```text
A(I) >= OPT(I) / c - b
```

The exact definition depends on the competitive-analysis model.

## 5. Approximation vs Competitive Analysis

Approximation usually assumes the full input is available.

Competitive analysis evaluates decisions made without knowledge of future input.

Therefore:

```text
approximation -> incomplete optimality
online analysis -> incomplete information
```

An online algorithm may also have an approximation-style guarantee under a specified arrival model, but the information restriction must be stated.

## 6. Deterministic Online Greedy

A deterministic online greedy algorithm chooses its action using only the state and current information.

Example pattern:

```text
request arrives
→ evaluate current state
→ choose locally preferred action
→ update state
→ continue
```

## 7. Adversarial Input

To establish a worst-case competitive ratio, consider an adversary that constructs a sequence designed to expose weaknesses in the algorithm.

This is different from random testing.

## 8. Adaptive vs Oblivious Adversary

An **adaptive adversary** may choose future input based on observed algorithm behavior.

An **oblivious adversary** fixes the sequence independently of the algorithm's random outcomes.

Randomized online algorithms require careful specification of which adversary model is being used.

## 9. Ski-Rental Problem

Ski rental is a canonical online problem.

The algorithm does not know how long the activity will continue.

Buying too early wastes money if the season ends quickly; renting forever wastes money if it lasts a long time.

The problem demonstrates the fundamental trade-off caused by unknown future duration.

## 10. Break-Even Greedy Rule

A natural policy rents until cumulative rental cost reaches the purchase cost, then buys.

This illustrates an important online pattern:

```text
accumulate cost
→ compare against irreversible investment
→ switch strategy at a threshold
```

## 11. Paging / Caching

In paging, a cache has limited capacity and requests arrive online.

An offline optimal algorithm can know which cached item will be needed farthest in the future.

An online system cannot.

This makes cache eviction a classic online decision problem.

## 12. LRU as an Online Policy

Least Recently Used evicts the item that has not been accessed for the longest time.

It is a practical online heuristic based on recency, not a universal proof of optimality.

The distinction between practical heuristic and worst-case competitive guarantee is important.

## 13. FIFO and Randomized Eviction

FIFO uses arrival age rather than recency.

Randomized policies can sometimes obtain guarantees that deterministic policies cannot achieve under the same model.

The policy must be analyzed under its exact assumptions.

## 14. Online Interval Scheduling

When intervals arrive online, an algorithm may have to accept or reject an interval immediately.

An offline earliest-finish rule cannot simply be applied because future intervals are unavailable.

The online objective and allowed actions must be defined first.

## 15. Online Resource Allocation

Suppose jobs arrive one at a time and require resources.

A greedy system might accept a job when sufficient capacity exists.

But accepting a large early job can block several future high-value jobs.

This is a standard source of online greedy failure.

## 16. Admission Control

Backend services often use admission control:

```text
request arrives
→ estimate resource demand
→ check capacity
→ accept or reject
```

A production policy may combine priority, quotas, deadlines, and tenant fairness.

## 17. Online Bin Packing

Items arrive sequentially and must be assigned to bins without knowing future items.

Greedy policies include:

- First Fit
- Best Fit
- Next Fit

These are practical online algorithms with known approximation/competitive analyses under their respective models.

## 18. First Fit

Place the item into the first existing bin where it fits; otherwise open a new bin.

Implementation can be simple, but naive scanning can be expensive for large workloads.

## 19. Best Fit

Place an item into the feasible bin leaving the smallest remaining capacity.

The policy attempts to consolidate remaining space.

Its quality must still be analyzed rather than assumed from intuition.

## 20. Next Fit

Maintain one active bin.

If the next item does not fit, close the current bin and open another.

This reduces state and search overhead at the cost of potentially worse packing.

## 21. Secretary-Style Selection

Some online selection problems require choosing the best candidate from a sequence when rejected candidates cannot be recovered.

Threshold-based strategies can balance exploration and exploitation.

This introduces probabilistic analysis and assumptions about arrival order.

## 22. Prophet Inequality Boundary

Prophet-inequality models compare online stopping decisions against an offline benchmark with knowledge of realized values.

They are related to online selection but have different probabilistic assumptions and guarantees.

## 23. Randomized Online Greedy

Randomization can prevent a fixed adversarial sequence from exploiting deterministic behavior as easily.

Typical analysis considers expected cost or expected value.

Always state the source of randomness and adversary model.

## 24. Potential Functions

A potential function tracks hidden or accumulated state that helps relate online cost to offline optimum.

A typical proof establishes:

```text
online cost + potential change
<= c · offline cost
```

Summing across operations telescopes the potential terms.

## 25. Amortized Analysis Connection

Competitive analysis often uses reasoning similar to amortized analysis.

The difference is the comparison target:

```text
amortized analysis -> average over an algorithm's own operation sequence
competitive analysis -> comparison with an offline optimum
```

## 26. Lower-Bound Strategy

To prove no deterministic online algorithm can beat a certain ratio:

1. construct a family of inputs
2. observe the algorithm's decision
3. choose future input strategically
4. compute online cost
5. compute offline optimum
6. derive the ratio

## 27. Upper-Bound Strategy

To prove an algorithm is competitive:

1. define a potential or charging scheme
2. relate each online decision to an offline decision
3. sum local inequalities
4. bound the initial/final potential
5. derive the global ratio

## 28. Competitive Invariants

A useful invariant can track:

- online resource usage
- offline benchmark state
- accumulated cost difference
- potential
- remaining capacity

The invariant must hold after every arrival.

## 29. Randomized Analysis

For randomized algorithms, a typical target is:

```text
E[cost(A(I))] <= c · OPT(I) + b
```

under a specified adversary model.

Expected guarantees do not mean every individual execution achieves the bound.

## 30. Advice and Predictions

Modern systems may have predictions about future workload.

An algorithm can incorporate predictions while retaining a worst-case robustness guarantee.

This creates a continuum between fully online and fully offline decision making.

## 31. Learning-Augmented Algorithms

A predicted future can influence cache eviction, scheduling, or admission decisions.

The system should separate:

```text
prediction quality
+ algorithmic robustness
```

A poor predictor should not silently destroy the intended worst-case safety property.

## 32. Backend Applications

Online greedy reasoning appears in:

- load balancing
- request admission
- cache eviction
- rate limiting
- autoscaling
- queue prioritization
- worker assignment
- connection management
- stream processing

## 33. AI Applications

AI systems can face online decisions in:

- streaming inference
- GPU job admission
- online retrieval caching
- model serving capacity
- token/request batching
- active learning
- online candidate selection

## 34. Distributed-System Constraints

Online decisions in distributed systems face:

- stale state
- delayed events
- duplicated messages
- partial failures
- inconsistent clocks
- concurrent reservations

A competitive algorithm cannot by itself guarantee distributed consistency.

## 35. Backpressure

When arrival rate exceeds processing capacity, backpressure determines which work is delayed, dropped, sampled, or rejected.

Greedy priority rules can be combined with:

- deadlines
- tenant quotas
- cost budgets
- fairness
- queue age

## 36. Starvation

A throughput-focused greedy rule can repeatedly postpone low-priority jobs.

Production schedulers may use aging:

```text
effectivePriority = basePriority + waitingTimeAdjustment
```

Changing the priority rule changes the analyzed algorithm.

## 37. Competitive Ratio Is Not Average Performance

An algorithm can have a weak worst-case ratio and excellent practical performance.

Conversely, a strong theoretical ratio does not guarantee low latency under a particular production workload.

Report theoretical and empirical results separately.

## 38. Simulation Testing

Use workload traces to measure:

- cost
- throughput
- latency
- rejection rate
- cache hit rate
- utilization
- fairness

Then compare against offline optimal solutions on small windows when feasible.

## 39. Adversarial Testing

Construct workloads that exploit:

- greedy thresholds
- capacity fragmentation
- repeated hot/cold transitions
- large early jobs
- alternating request patterns
- synchronized bursts

This exposes weaknesses that random tests may miss.

## 40. JavaScript Engineering

For high-volume online algorithms:

- avoid unnecessary full-array rescans
- use heaps/maps where appropriate
- bound memory growth
- define eviction and expiration semantics
- use monotonic time for elapsed durations
- make state transitions explicit

## 41. Interview Decision Framework

When given an online problem:

```text
Is future input known?
        |
        +-- yes -> offline algorithm / approximation
        |
        +-- no
             |
             +-- irrevocable decisions? -> online analysis
             |
             +-- randomized allowed? -> expected competitive analysis
             |
             +-- predictions available? -> learning-augmented model
```

## 42. Implementation Lab

Implement and compare:

1. ski-rental threshold policy
2. LRU cache policy
3. FIFO cache policy
4. First Fit bin packing
5. Best Fit bin packing
6. Next Fit bin packing
7. online interval admission
8. online resource allocation
9. randomized threshold selection
10. backend admission-control simulation
11. AI serving-capacity simulation

## 43. Revision Checklist

- [ ] Define an online algorithm.
- [ ] Explain offline optimum.
- [ ] Define competitive ratio.
- [ ] Distinguish approximation from competitive analysis.
- [ ] Understand adversary models.
- [ ] Explain ski rental.
- [ ] Understand online caching and LRU.
- [ ] Understand First Fit, Best Fit, and Next Fit.
- [ ] Understand potential-function proofs.
- [ ] Understand randomized online guarantees.
- [ ] Understand learning-augmented boundaries.
- [ ] Apply online greedy thinking to Backend and AI systems.

## Key Takeaways

1. Online algorithms must act without seeing future input.
2. Competitive analysis compares online behavior with an offline optimum.
3. A locally sensible decision can be globally poor when future demand is unknown.
4. Adversarial sequences are central to worst-case online analysis.
5. Potential functions and charging arguments are powerful proof techniques.
6. Randomization and predictions can change the achievable guarantees, but their assumptions must be explicit.
7. Backend and AI systems naturally contain online optimization problems involving caches, queues, resources, and arriving workloads.
