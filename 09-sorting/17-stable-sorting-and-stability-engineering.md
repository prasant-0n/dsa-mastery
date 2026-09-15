# 09.17 — Stable Sorting & Stability Engineering

## 1. Definition

A sorting algorithm is **stable** if elements with equivalent sort keys retain their original relative order after sorting.

For records:

```text
(key, originalPosition)
```

if two records have equal keys, their `originalPosition` order must remain unchanged.

## 2. Why Stability Matters

Stability is not merely an implementation detail. It is part of an algorithm or API's behavioral contract.

It matters when:

- sorting by multiple fields;
- preserving arrival order;
- processing event streams;
- building deterministic pipelines;
- composing sequential sorts.

## 3. Mental Model

Consider:

```text
A: score=90, position=0
B: score=70, position=1
C: score=90, position=2
```

Sorting by score produces:

```text
B, A, C
```

A must remain before C because both have the same primary key.

## 4. Stability as an Ordering Contract

Define key equality separately from object identity.

A comparator may return:

```text
negative → a before b
zero     → equivalent sort keys
positive → a after b
```

When the comparator returns zero, a stable algorithm preserves the existing order.

## 5. Stable vs Unstable

Stable algorithms include common variants of:

- Merge Sort;
- Tim Sort;
- Insertion Sort;
- Bubble Sort;
- Counting Sort with stable placement;
- Radix Sort when each digit pass is stable.

Commonly unstable algorithms include typical:

- Heap Sort;
- Quicksort;
- Selection Sort;
- IntroSort.

Stability is implementation-specific, so always verify the actual contract rather than relying only on algorithm family names.

## 6. Stability and Multi-Key Sorting

Suppose records must be ordered by:

```text
department → salary
```

One approach is:

1. stable-sort by salary;
2. stable-sort by department.

The second stable sort preserves salary order within equal departments.

Alternatively, use a composite comparator:

```text
compare(department)
then compare(salary)
```

The composite comparator is usually clearer and avoids relying on multiple passes.

## 7. Stability Invariant

For any two records `a` and `b`:

```text
key(a) == key(b)
```

and `a` occurs before `b` in the input, then `a` must occur before `b` in the output.

This is the central stability invariant.

## 8. How Stability Is Lost

Stability can be destroyed by:

- swapping equal-key elements;
- reversing a range containing equal keys;
- choosing the right run before the left run on ties during merge;
- unstable partitioning;
- arbitrary hash/bucket iteration order;
- incorrect digit-pass placement.

## 9. Stable Merge

During a merge, if both current records have equal keys, choose the record from the left run first.

That preserves the order inherited from the earlier sequence.

The tie rule must be explicit.

## 10. Stable Partitioning

Partition-based algorithms often move equal-key elements across one another.

Making partitioning stable may require additional storage or more expensive movement.

Therefore stability can impose a meaningful engineering cost.

## 11. Decorate-Sort-Undecorate

A useful technique is to attach original position:

```text
{ key, value, originalIndex }
```

Then use `originalIndex` as a deterministic secondary key.

This can simulate stable behavior even when the underlying algorithm is not stable, but it changes the effective comparator and usually adds memory.

## 12. Explicit Tie-Breaking

Adding original position as a secondary key creates:

```text
primary key
→ original position
```

This makes the desired output deterministic.

However, it should be distinguished conceptually from intrinsic algorithmic stability: the implementation is explicitly encoding the tie order.

## 13. Stability and Mutation

An in-place algorithm can still be stable.

Mutation and stability are independent properties.

Therefore an API should document both:

```text
mutates input? yes/no
stable? yes/no
```

## 14. Stability and Complexity

Preserving stability may require:

- additional buffers;
- extra metadata;
- more constrained movement;
- stable merging;
- stable partitioning.

There is no universal constant-factor cost because it depends on the algorithm and representation.

## 15. Stability Testing

A numeric sortedness test is insufficient.

Use records with duplicate keys and unique original indices:

```text
{ key: 2, id: 'A' }
{ key: 1, id: 'B' }
{ key: 2, id: 'C' }
```

After sorting by `key`, `A` must remain before `C`.

## 16. Differential Stability Testing

Compare a candidate implementation with a trusted stable reference.

Check:

```text
sorted keys equal
and
relative order of equal-key records equal
```

This catches stability bugs that ordinary sortedness checks miss.

## 17. Property-Based Testing

Generate random records containing:

- repeated keys;
- unique IDs;
- random payloads.

Then assert the stability invariant for every equal-key group.

## 18. Stability and JavaScript

When using JavaScript's built-in sorting facilities, understand the runtime/version contract and comparator semantics rather than assuming behavior from historical implementations.

For custom algorithms, define stability explicitly in the API documentation and tests.

## 19. Backend Applications

Stability is useful for:

- deterministic API ordering;
- event processing;
- batch ranking;
- pagination preparation;
- multi-stage data transformations;
- preserving ingestion order for equal timestamps.

For pagination, a deterministic total ordering is usually preferable to relying on stability alone; include an explicit unique tie-breaker when records can share the primary key.

## 20. AI Applications

Stable ordering can support:

- deterministic candidate ranking;
- reproducible preprocessing;
- preserving source order among equal scores;
- stable batching;
- multi-stage ranking pipelines.

Deterministic tie-breaking is especially useful when reproducibility matters.

## 21. Stability in Distributed Systems

Distributed sorting introduces additional ordering state.

If equal-key records originate from different partitions, global stability requires a deterministic cross-partition order such as:

```text
partitionId → sequenceNumber
```

A local stable sort alone does not automatically establish global stability.

## 22. External Sorting Stability

External merge sorting can preserve stability by attaching source-order metadata to each record or run.

During k-way merge, equal keys must use the chosen global tie policy.

## 23. Radix Sort Stability

LSD Radix Sort depends on stable digit passes.

Each pass preserves the ordering created by previously processed less-significant digits.

An unstable digit pass can make the final result incorrect.

## 24. Counting Sort Stability

Stable Counting Sort uses cumulative positions and consumes records in a direction that preserves equal-key order.

This is one of the most important practical examples of how a local stability guarantee becomes necessary for a larger algorithm.

## 25. Stable vs Deterministic

These concepts are related but different.

**Stable:** preserves input relative order for equal keys.

**Deterministic:** produces the same result for the same input and environment.

An unstable algorithm can still be deterministic if its tie behavior is fixed.

## 26. Stable vs Total Ordering

A comparator can define a total order by adding a unique tie-breaker.

For example:

```text
score → timestamp → id
```

This eliminates comparator equality between distinct records.

That improves deterministic ordering but does not mean the underlying sorting algorithm itself is stable.

## 27. Performance Engineering

Benchmark stability-preserving implementations separately from unstable variants.

Measure:

- comparisons;
- writes/moves;
- allocations;
- auxiliary memory;
- elapsed time;
- cache behavior where measurable.

Do not assume a stable implementation is always slower; workload and algorithm structure matter.

## 28. Common Mistakes

1. Testing only distinct keys.
2. Confusing sortedness with stability.
3. Reversing equal-key runs without analysis.
4. Choosing the right merge record on ties.
5. Assuming an algorithm family guarantees stability.
6. Treating deterministic output as proof of stability.
7. Forgetting cross-partition tie semantics.
8. Ignoring stable digit passes in Radix Sort.
9. Using unstable sorting in a multi-pass sort without understanding the consequence.
10. Omitting a unique tie-breaker from production pagination.

## 29. Edge Cases

Test:

- all keys equal;
- no duplicate keys;
- alternating equal keys;
- large duplicate groups;
- equal keys across runs;
- equal keys across partitions;
- descending equal-key runs;
- null/missing keys when supported.

## 30. Interview Questions

1. What does stable sorting mean?
2. Why is stability important?
3. Give an example where stability changes the result.
4. How do you test stability?
5. How does stable merge preserve order?
6. Why does LSD Radix Sort require stable digit sorting?
7. Can an in-place algorithm be stable?
8. What is the difference between stability and deterministic tie-breaking?
9. How would you preserve stability in external sorting?
10. Why is an explicit unique tie-breaker useful for pagination?

## 31. Revision Checklist

- [ ] I can define stability precisely.
- [ ] I can distinguish stability from sortedness.
- [ ] I can test equal-key relative order.
- [ ] I can explain stable merge tie handling.
- [ ] I understand stable Counting Sort.
- [ ] I understand why LSD Radix requires stable passes.
- [ ] I can distinguish stable behavior from explicit tie-breaking.
- [ ] I can reason about stability across distributed runs.
- [ ] I can design deterministic pagination ordering.
- [ ] I can evaluate stability as an API contract.

## 32. Key Takeaways

1. **Stability means equal-key records retain their original relative order.**
2. **Sortedness alone does not prove stability.**
3. **Stable merge and stable digit passes are fundamental building blocks.**
4. **Stability can require extra memory or constrain movement, so it is an engineering trade-off.**
5. **Deterministic tie-breaking and intrinsic stability are related but distinct concepts.**
6. **Distributed and external sorting require an explicit global tie policy.**
7. **For production pagination and ranking, an explicit unique ordering key often provides stronger determinism than relying on incidental stability.**
8. **The deeper lesson is to treat ordering semantics as part of the data contract, not merely as an implementation detail.**
