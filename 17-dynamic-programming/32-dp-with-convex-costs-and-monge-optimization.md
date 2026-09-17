# 32 — DP with Convex Costs & Monge Optimization

> **Phase 17 — Dynamic Programming**

## Core Idea

Partition DPs often have the form `dp[g][j] = min_k(prev[k] + W(k,j))`. A naive transition is `O(Gn²)`. Structural properties can reduce the candidate search.

## Monotone Argmin

If the selected optimal split `opt[j]` is monotone, divide-and-conquer DP optimization can restrict candidate ranges recursively. Tie-breaking is part of the mathematical specification.

## Monge & Quadrangle Inequality

Monge structure is expressed through a four-point inequality such as `A[i][j] + A[i+1][j+1] <= A[i][j+1] + A[i+1][j]`, with orientation depending on the convention. Interval costs may satisfy a corresponding quadrangle inequality. These properties can imply monotone minima.

## Divide-and-Conquer DP

For `dp[j] = min_k(prev[k] + W(k,j))`, recursively solve destination ranges while restricting candidate split ranges around the proven optimal index. The recurrence does not change; only candidate enumeration changes.

## Knuth Optimization

Suitable interval DPs can use stronger root monotonicity conditions to reduce split ranges. Knuth is highly conditional and must never be applied without verifying its assumptions.

## Total Monotonicity & SMAWK

Total monotonicity concerns monotone locations of row or column minima. SMAWK can find minima of an implicit totally monotone matrix without materializing every entry, using an `A(row,column)` oracle.

## Convex Hull Trick Comparison

CHT optimizes line queries such as `min_j(m_j*x_i+b_j)`. Monge/D&C optimization targets candidate matrices such as `min_j(prev[j]+W(j,i))`. They exploit different algebraic structures.

## Unimodality

A candidate objective may sometimes be discretely unimodal, allowing a reduced search. Unimodality must be proved rather than inferred from small tests.

## Reconstruction & Numeric Safety

Store selected splits/roots for reconstruction. Preserve the same tie policy used by the value DP. Structural comparisons involving large integers may require `BigInt` or exact transformations because unsafe `Number` arithmetic can change ordering.

## Verification

Always implement a naive oracle first. Differential-test optimized layers, argmins, ties, reconstruction, degenerate intervals, negative costs, and large values. Deliberately search for counterexamples to claimed Monge, quadrangle, or monotonicity properties.

## Complexity

Typical conditional bounds include naive `O(Gn²)`, divide-and-conquer DP often `O(Gn log n)`, Knuth often `O(n²)`, and SMAWK `O(r+c)` oracle evaluations for an `r × c` totally monotone matrix.

## Backend & AI Applications

These techniques can optimize workload partitioning, batching, ordered scheduling, storage segmentation, sequence segmentation, changepoint detection, ordered clustering, and other exact structured inference tasks.

## Recognition Framework

1. Derive the naive recurrence.
2. Write the candidate matrix exactly.
3. Make cost evaluation efficient.
4. Prove the relevant Monge/quadrangle property.
5. Establish argmin monotonicity.
6. Choose D&C, Knuth, or SMAWK only when justified.
7. Preserve tie semantics.
8. Verify against brute force.
9. Document the structural proof and complexity assumptions.

## Master Pattern

```text
derive recurrence
      ↓
identify candidate matrix
      ↓
prove structural property
      ↓
choose optimizer
      ↓
verify against naive DP
      ↓
reconstruct + certify
```

## Mastery Checklist

- [ ] Partition DP
- [ ] Candidate matrices
- [ ] Monge inequality
- [ ] Quadrangle inequality
- [ ] Monotone argmins
- [ ] Divide-and-conquer optimization
- [ ] Knuth optimization
- [ ] Total monotonicity
- [ ] SMAWK
- [ ] Discrete unimodality
- [ ] CHT comparison
- [ ] Tie-breaking
- [ ] Reconstruction
- [ ] Numeric safety
- [ ] Counterexample search
- [ ] Differential testing
- [ ] Correctness proofs
- [ ] Complexity audit
- [ ] Backend lab
- [ ] AI lab
