# 15.04 — Fractional Knapsack & Ratio-Based Greedy Optimization

## 1. Concept Definition

The **fractional knapsack** problem gives items with values and weights and allows each item to be taken partially. The objective is to maximize total value subject to a capacity limit.

For item `i`:

```text
value[i] = vᵢ
weight[i] = wᵢ
ratio[i] = vᵢ / wᵢ
```

The optimal greedy rule is to process items by decreasing value-to-weight ratio.

## 2. Why Fractionality Matters

Fractionality removes the indivisibility constraint that makes 0/1 knapsack difficult.

If the final item does not completely fit, it can be partially selected.

That makes ratio-based exchange arguments possible.

## 3. Formal Model

Given capacity `C`, choose fractions `xᵢ` satisfying:

```text
0 <= xᵢ <= 1
Σ xᵢ wᵢ <= C
```

Maximize:

```text
Σ xᵢ vᵢ
```

## 4. Greedy Rule

Sort items by descending:

```text
value / weight
```

Then:

1. take the highest-ratio item while it fits
2. continue to the next item
3. take the required fraction of the first item that does not completely fit
4. stop when capacity is exhausted

## 5. Exchange Argument

Suppose an optimal solution contains capacity allocated to an item with lower ratio while a higher-ratio item still has available capacity.

Move a small amount of weight from the lower-ratio item to the higher-ratio item.

Because the higher-ratio item produces at least as much value per unit weight, the objective does not decrease.

Repeated exchanges transform an optimal solution into the greedy structure.

## 6. Why Ratio Is the Correct Key

The constraint is measured in weight while the objective is measured in value.

Therefore the relevant marginal value is:

```text
value gained per unit of capacity consumed
```

which is exactly `value / weight`.

## 7. Zero-Weight Items

An item with zero weight requires explicit handling.

If it has positive value, taking its full amount consumes no capacity and increases the objective.

If its value is zero, it does not affect the objective.

Negative-value zero-weight items should generally be excluded from a maximization objective unless the problem imposes a mandatory-selection constraint.

## 8. Zero-Value Items

A positive-weight item with zero value contributes nothing.

It should not be selected when the objective is pure value maximization and selection is optional.

## 9. Negative-Value Items

Optional negative-value items should not be selected in a maximization problem because they consume capacity while reducing value.

Again, this assumes no separate mandatory-selection constraint.

## 10. Capacity Edge Cases

Define behavior for:

- `C < 0`
- `C = 0`
- `C` greater than total weight
- empty item list
- non-finite capacity

## 11. Fraction Representation

A selected fraction can be represented as:

```text
fraction = remainingCapacity / item.weight
```

The fraction must remain within `[0, 1]`.

## 12. Full vs Partial Selection

For every processed item:

```text
if weight <= remainingCapacity:
    take 100%
else:
    take remainingCapacity / weight
```

Once a partial item is taken, the capacity is exhausted.

## 13. Complexity

Sorting `N` items costs:

```text
O(N log N)
```

The scan costs:

```text
O(N)
```

Total:

```text
O(N log N)
```

Extra space depends on whether sorting requires a copied array and whether selected fractions are returned.

## 14. Pre-Sorted Inputs

If items are already guaranteed to be ordered by decreasing ratio, the scan itself is `O(N)`.

Avoid unnecessary sorting when the input contract guarantees the required order.

## 15. Ratio Comparison Precision

Direct floating-point division can introduce rounding concerns.

When values and weights are integers and overflow can be avoided, compare ratios using cross multiplication:

```text
v₁ / w₁ > v₂ / w₂
```

can be compared through:

```text
v₁ * w₂ > v₂ * w₁
```

Use an appropriate numeric type when products may exceed JavaScript's safe integer range.

## 16. JavaScript Number Considerations

JavaScript `Number` uses IEEE-754 double precision.

For exact large-integer arithmetic, consider `BigInt`, while remembering that `BigInt` cannot be mixed directly with `Number` in arithmetic expressions.

## 17. Tie-Breaking

Items with equal ratios are interchangeable with respect to the mathematical objective under the standard model.

For deterministic output, use a secondary key such as stable item ID.

## 18. Greedy Proof Boundary

The ratio proof depends on the ability to divide items.

Do not transfer the proof to 0/1 knapsack.

For indivisible items, taking the highest ratio can produce a suboptimal result.

## 19. 0/1 Knapsack Counterexample

A small-capacity instance can contain one high-ratio item that prevents a combination of lower-ratio items from achieving greater total value.

This demonstrates why local density is insufficient when items cannot be split.

## 20. Continuous Optimization View

Fractional knapsack is a simple linear optimization problem.

The feasible region permits fractional allocations, and the greedy ratio ordering follows the marginal objective contribution per unit resource.

## 21. Multiple Resource Dimensions Boundary

If each item consumes several independent resources, one scalar value/weight ratio is generally insufficient.

The problem may become multidimensional packing or another harder optimization problem.

## 22. Multiple Knapsacks Boundary

With several capacities or bins, independent ratio sorting does not automatically solve the global allocation problem.

The assignment structure becomes part of the optimization problem.

## 23. Backend Application: Capacity Allocation

Ratio-based greedy selection can model allocating a limited resource to divisible workloads where each workload has measurable value per unit capacity.

Examples include bandwidth, storage, compute time, or budget allocation under simplified assumptions.

## 24. Backend Production Boundary

Real resource allocation may include:

- minimum guarantees
- priorities
- fairness
- tenant quotas
- deadlines
- indivisible jobs
- setup costs
- nonlinear utility

These can invalidate the simple fractional-knapsack model.

## 25. AI Application: Compute Budget Allocation

A simplified AI system can allocate a continuous budget among candidates according to estimated utility per unit resource.

Possible resources include:

- inference time
- token budget
- memory
- sampling budget

The utility estimates must be treated as part of the model assumptions.

## 26. AI Application: Candidate Scoring

If candidate actions can receive fractional allocation and utility is approximately linear, marginal utility per resource can motivate a greedy allocation policy.

If utility has interactions or diminishing/nonlinear returns, ratio ordering may fail.

## 27. Marginal Value Perspective

The deepest pattern is not merely "divide value by weight".

It is:

```text
choose the currently available action with greatest marginal objective gain per unit scarce resource
```

This perspective generalizes the technique.

## 28. Greedy With Dynamic Ratios

If an item's marginal ratio changes after partial allocation, the static sort is insufficient.

A priority queue may be required to repeatedly choose the currently best marginal option.

## 29. Heap-Based Generalization

For dynamically changing marginal values:

```text
insert candidates
→ extract highest marginal ratio
→ allocate resource
→ recompute changed candidates
→ repeat
```

This resembles best-first resource allocation.

## 30. Correctness Invariant

After processing the first `k` ratio-sorted items, the algorithm has allocated as much capacity as possible to the highest-ratio prefix subject to the current capacity constraint.

## 31. Optimality Theorem

An optimal solution can be transformed through exchanges into one that fills capacity in non-increasing ratio order.

Therefore the greedy construction is optimal for fractional knapsack.

## 32. Brute-Force Verification Boundary

Because fractions create a continuous solution space, naive subset enumeration is not a direct reference algorithm.

For testing, use a linear-programming reference for small instances or construct exact analytical checks.

For integer/rational inputs, carefully designed small instances can also validate the greedy structure.

## 33. Property Testing

Useful properties include:

- total weight never exceeds capacity
- every fraction is within `[0,1]`
- selected value is nonnegative under optional nonnegative-value inputs
- all higher-ratio available capacity is filled before lower-ratio capacity
- no feasible exchange improves the solution

## 34. Adversarial Tests

Test:

- extreme ratios
- equal ratios
- zero weights
- zero values
- negative values
- capacity smaller than every positive-weight item
- capacity larger than total weight
- very large numeric values
- nearly equal ratios

## 35. Numerical Robustness

For nearly equal ratios, floating-point sorting can create unstable ordering.

Prefer exact comparison where feasible.

When exact comparison is impossible, define acceptable numerical tolerance and deterministic tie handling.

## 36. Common Mistakes

- applying ratio greedy to 0/1 knapsack
- dividing by zero
- allowing fractions outside `[0,1]`
- forgetting remaining capacity
- using floating-point ratios blindly for huge integers
- selecting negative-value optional items
- ignoring multiple resource constraints

## 37. Interview Framework

For fractional knapsack:

1. identify divisibility
2. identify the scarce resource
3. calculate value per unit resource
4. sort descending by that ratio
5. take full items while possible
6. take a fraction of the next item
7. prove the exchange argument
8. derive `O(N log N)`
9. explain why the proof fails for 0/1 knapsack

## 38. Revision Checklist

- [ ] Define fractional knapsack.
- [ ] Derive value/weight ratio.
- [ ] Implement ratio sorting.
- [ ] Handle partial selection.
- [ ] Handle zero-weight items.
- [ ] Understand ratio comparison precision.
- [ ] Prove correctness by exchange.
- [ ] Explain why 0/1 knapsack differs.
- [ ] Analyze complexity.
- [ ] Identify multi-resource boundaries.
- [ ] Apply marginal-value reasoning to backend/AI allocation.

## Key Takeaways

1. Fractional knapsack is optimally solved by decreasing value-to-weight ratio.
2. The exchange argument works because items are divisible.
3. Ratio is a marginal-value-per-unit-resource measure.
4. Zero weights and numeric precision require explicit engineering decisions.
5. Dynamic marginal values may require a heap rather than one initial sort.
6. The same reasoning pattern can inform simplified resource-allocation systems in backend and AI engineering.
