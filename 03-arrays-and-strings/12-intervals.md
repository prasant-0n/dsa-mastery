# 03.12 — Intervals

## Definition

An **interval** represents a continuous range between two boundaries, commonly written as `[start, end]`.

Examples:

```text
[1, 4]
[7, 10]
[12, 20]
```

Interval problems are primarily about **ordering, overlap semantics, boundary transitions, and active ranges**.

The most important transformation is usually:

```text
unsorted intervals → sort by a boundary → linear scan
```

---

# 1. Why Intervals Matter

Intervals appear in:

- scheduling;
- reservations;
- meeting rooms;
- CPU/job execution;
- time windows;
- database validity ranges;
- network availability;
- log/event ranges;
- genomic ranges;
- geometric computation.

They are a major bridge from basic arrays into greedy algorithms, heaps, sweep-line algorithms, and advanced data structures.

---

# 2. Interval Semantics

Never solve an interval problem until the endpoint semantics are clear.

### Closed

```text
[a, b]
```

Both endpoints included.

### Open

```text
(a, b)
```

Neither endpoint included.

### Half-open

```text
[a, b)
```

Start included, end excluded.

Half-open intervals are especially useful in programming because adjacent ranges naturally do not overlap:

```text
[0, 5) and [5, 10)
```

are adjacent.

---

# 3. Overlap Conditions

For closed intervals `[a,b]` and `[c,d]`, they overlap when:

```text
a <= d && c <= b
```

For half-open intervals `[a,b)` and `[c,d)`, overlap requires:

```text
a < d && c < b
```

The difference between `<` and `<=` is not a small implementation detail. It changes the mathematical contract.

---

# 4. Interval Ordering

For most interval problems, sort by:

```text
start ascending
```

Sometimes sorting by end is better, especially for interval scheduling and greedy selection.

Sometimes a problem requires:

```text
(start ascending, end ascending)
```

or another tie-breaking rule.

The correct sort key should follow the decision that the algorithm needs to make.

---

# 5. Merge Intervals

Given overlapping intervals, merge them into disjoint ranges.

Strategy:

1. sort by start;
2. initialize the active interval;
3. compare the next interval's start to the active end;
4. overlap → extend active end;
5. otherwise finalize active and begin a new interval.

Complexity:

```text
O(N log N)
```

for sorting plus `O(N)` scanning.

---

# 6. Merge Invariant

After processing a sorted prefix:

> Every interval already emitted is final and disjoint from the active interval; the active interval represents all overlapping processed intervals that can still be merged.

This invariant explains why a single forward scan is sufficient after sorting.

---

# 7. Insert an Interval

If existing intervals are already sorted and non-overlapping, inserting a new interval can be done in linear time.

Conceptually:

1. copy intervals ending before the new interval;
2. merge all overlapping intervals;
3. append intervals starting afterward.

If the input is not sorted, sorting may be required first.

This illustrates why input guarantees can fundamentally change complexity.

---

# 8. Detect Any Overlap

After sorting by start, compare each interval with its predecessor/current active interval.

If:

```text
current.start < previous.end
```

under half-open semantics, an overlap exists.

The problem becomes a linear scan after preprocessing.

---

# 9. Maximum Concurrent Intervals

A different question is:

> What is the maximum number of intervals active at the same time?

Two common approaches:

### Events / Sweep Line

Represent:

```text
(start, +1)
(end, -1)
```

Sort events and maintain an active counter.

### Min-Heap

Sort intervals by start and maintain the earliest finishing active interval.

The choice depends on whether you need only maximum concurrency, actual assignments, or additional scheduling information.

---

# 10. Sweep-Line Thinking

Sweep-line algorithms convert intervals into boundary events.

Example:

```text
interval [2,5)

2 → +1
5 → -1
```

Then process events in sorted coordinate order.

The algorithm's state is:

```text
active intervals at current coordinate
```

This is a one-dimensional version of spatial event processing.

---

# 11. Event Tie-Breaking

If multiple events occur at the same coordinate, their ordering matters.

For half-open intervals `[start,end)`, an interval ending at `t` is inactive at `t`, while one starting at `t` becomes active.

Therefore end events may need to be processed before start events at the same coordinate.

For closed intervals, the interpretation can differ.

Tie-breaking must follow interval semantics.

---

# 12. Minimum Meeting Rooms

Given meeting intervals, determine the number of rooms required.

A sweep-line solution:

1. create starts and ends;
2. sort events;
3. update active count;
4. track maximum active count.

Alternative:

- sort meetings by start;
- maintain a min-heap of end times.

Complexity:

```text
O(N log N)
```

The heap solution additionally models which resource becomes free first.

---

# 13. Interval Scheduling

Goal:

> Select the maximum number of non-overlapping intervals.

The classic greedy strategy is to sort by **earliest finishing time** and repeatedly choose the next compatible interval.

Why end time?

Choosing the interval that finishes earliest leaves the largest remaining opportunity for future intervals.

This is a canonical greedy proof pattern.

---

# 14. Greedy Invariant for Scheduling

After selecting some intervals:

> The selected set is feasible, and among schedules with the same number of selected intervals, the maintained finishing time is as early as possible according to the greedy exchange argument.

The full correctness argument uses an exchange argument:

- take an optimal solution;
- replace its first selected interval with the greedy earliest-finishing interval;
- feasibility is preserved;
- continue inductively.

Detailed greedy theory appears later, but interval scheduling is an important early example.

---

# 15. Weighted Interval Scheduling

If intervals have values/weights and the goal is maximum total value, earliest-finish greedy is no longer sufficient.

A standard solution uses dynamic programming:

```text
sort by end time
find previous compatible interval
DP[i] = max(skip, take + DP[previous])
```

This is an important distinction:

> Adding weights can change the computational structure of the problem.

Weighted interval scheduling belongs naturally to DP reasoning.

---

# 16. Interval Intersection

Given two sorted, disjoint interval lists, intersections can be found using two pointers.

At intervals `A[i]` and `B[j]`:

```text
intersection start = max(A.start, B.start)
intersection end   = min(A.end, B.end)
```

If the intersection is valid, emit it.

Then advance the interval that finishes first.

Why?

The interval that ends earlier cannot overlap any future interval from the other list while remaining active.

This is a powerful **interval + two-pointer composition**.

---

# 17. Interval Union

The union of interval sets can be obtained by:

1. concatenate intervals;
2. sort by start;
3. merge overlaps.

This creates a canonical disjoint representation.

A canonical representation is valuable because later operations become simpler.

---

# 18. Difference / Coverage Counting

For integer coordinates over a manageable domain, difference arrays can represent range additions efficiently.

For an update:

```text
add +1 on [l, r]
```

use:

```text
D[l] += 1
D[r + 1] -= 1
```

then prefix-sum `D` to reconstruct coverage.

This is an interval version of the difference-array technique from earlier array chapters.

---

# 19. Coordinate Compression for Huge Coordinates

If endpoints are large but only a limited set of boundaries appears, coordinate compression can map them to ranks.

Example:

```text
10^9, 10^9+5, 700, 900
```

can be mapped to ordered coordinate indices.

But compression must preserve the meaning of distances and covered lengths. If actual geometric lengths matter, store the original coordinate differences between compressed points.

Do not compress coordinates and then pretend each compressed step has equal physical length unless that is valid.

---

# 20. Interval Queries

Repeated queries may ask:

- which intervals contain point `x`?
- how many intervals overlap `x`?
- what is total coverage?
- which intervals overlap `[l,r]`?

A simple scan costs `O(N)` per query.

Sorting endpoints, prefix structures, interval trees, segment trees, or sweep preprocessing may improve repeated-query performance depending on whether the data is static or dynamic.

The workload model matters:

```text
N = intervals
Q = queries
U = updates
```

---

# 21. Static vs Dynamic Intervals

### Static

Intervals are loaded once and queried repeatedly.

Preprocessing can be expensive if it reduces query cost.

### Dynamic

Intervals are inserted, deleted, or modified frequently.

A structure optimized only for static queries may become too expensive because every update requires rebuilding.

This is the same build/query/update trade-off seen throughout DSA.

---

# 22. Interval Trees Preview

When dynamic overlap queries are required, specialized structures such as interval trees can maintain ranges while supporting overlap searches.

The exact complexity depends on the data structure and balancing assumptions.

The conceptual lesson is more important here:

> When intervals become a persistent dynamic dataset, repeatedly sorting from scratch may no longer be the right representation.

Detailed interval trees belong to advanced data-structure study.

---

# 23. Common Interval Patterns

Recognize these shapes:

| Problem | First thought |
|---|---|
| Merge overlapping ranges | sort by start + scan |
| Insert into sorted disjoint ranges | scan + merge |
| Detect overlap | sort by start + scan |
| Maximum concurrency | sweep line / heap |
| Meeting rooms | events / min-heap |
| Maximum unweighted schedule | sort by end + greedy |
| Maximum weighted schedule | DP |
| Intersection of sorted lists | two pointers |
| Range coverage | difference/prefix |
| Dynamic overlap queries | interval-oriented data structure |

---

# 24. Complexity Model

Let `N` be the number of intervals and `Q` the number of queries.

Typical costs:

| Technique | Time |
|---|---:|
| Unsorted overlap scan | `O(N)` per query/check |
| Sort + merge | `O(N log N)` |
| Insert into sorted intervals | `O(N)` |
| Two-list intersection | `O(N + M)` |
| Sweep-line concurrency | `O(N log N)` |
| Heap-based scheduling | `O(N log N)` |
| Weighted interval DP | typically `O(N log N)` with binary-search predecessor lookup |
| Difference-array coverage | `O(N + K)` for coordinate/domain size `K` |

Always account for preprocessing and output size.

---

# 25. Backend Applications

### Booking Systems

Reservations are naturally intervals:

```text
room × [start,end)
```

Overlap detection prevents double booking.

### Job Scheduling

CPU jobs, worker leases, and maintenance windows can be modeled as intervals.

### Database Validity Ranges

Records may be valid over time intervals.

### Log Windows

Events can be grouped into temporal ranges.

### Resource Capacity

Sweep-line reasoning can estimate concurrent resource demand.

Production concerns include timezone normalization, timestamp precision, inclusive/exclusive boundaries, clock skew, concurrency, and transactional race conditions.

---

# AI Applications

### Document / Token Windows

Chunk ranges can be represented as intervals over token positions.

### Retrieval Results

Candidate spans from multiple systems can be merged or intersected.

### Temporal AI Data

Sensor/event intervals support activity windows and coverage analysis.

### Batch Scheduling

GPU/CPU workloads can be represented as resource-time intervals.

### Context Window Management

Token ranges can be merged, clipped, or prioritized under context-length constraints.

---

# Common Mistakes

1. Using `<` instead of `<=`, or vice versa, without defining endpoint semantics.
2. Sorting by the wrong endpoint.
3. Forgetting to sort before a merge/greedy scan.
4. Mutating caller-owned intervals unexpectedly.
5. Mishandling equal start/end events.
6. Assuming earliest-start greedy solves interval scheduling.
7. Using greedy for weighted interval scheduling.
8. Ignoring zero-length intervals.
9. Mishandling empty interval lists.
10. Compressing coordinates without preserving physical distances.
11. Rebuilding static structures unnecessarily for repeated queries.
12. Ignoring concurrency when translating interval logic into backend booking systems.

---

# Interview Framework

1. Define interval semantics.
2. Identify whether intervals are already sorted.
3. Choose the boundary to sort by.
4. Define the active state/invariant.
5. Determine whether the problem asks merge, overlap, concurrency, intersection, scheduling, or coverage.
6. Decide between scan, sweep line, heap, two pointers, difference array, or DP.
7. Handle equal-boundary events explicitly.
8. Calculate complete complexity.
9. Check empty, singleton, nested, touching, duplicate, and zero-length intervals.
10. Explain why the chosen ordering makes future decisions safe.

---

# Revision Checklist

- [ ] I understand closed/open/half-open intervals.
- [ ] I can derive overlap conditions.
- [ ] I can merge intervals.
- [ ] I can insert into sorted disjoint intervals.
- [ ] I can detect conflicts.
- [ ] I understand sweep-line events.
- [ ] I understand event tie-breaking.
- [ ] I can solve minimum meeting rooms conceptually.
- [ ] I understand interval scheduling greedy.
- [ ] I understand weighted interval scheduling as DP.
- [ ] I can intersect two sorted interval lists.
- [ ] I understand interval union.
- [ ] I can use difference arrays for bounded coverage.
- [ ] I understand coordinate compression caveats.
- [ ] I can reason about static vs dynamic interval workloads.
- [ ] I know why specialized interval structures may be needed.
- [ ] I can analyze interval algorithms with `N`, `M`, `Q`, and domain size.
- [ ] I can connect intervals to backend scheduling/booking.
- [ ] I can connect intervals to AI windows and resource scheduling.

## Key Takeaways

1. Interval problems are primarily about **boundary semantics and ordering**.
2. Sorting by the right boundary often converts a complex set of pairwise relationships into a linear scan.
3. Merge intervals is a foundational sort + invariant pattern.
4. Sweep-line algorithms convert ranges into ordered start/end events.
5. Equal-coordinate event ordering must match closed/open/half-open semantics.
6. Unweighted interval scheduling has a greedy solution; weighted scheduling requires different reasoning.
7. Interval intersection is a natural two-pointer problem.
8. Difference arrays and coordinate compression provide efficient coverage techniques under suitable constraints.
9. Static and dynamic interval workloads require different representations.
10. Backend booking, scheduling, logs, AI token windows, and resource planning all reuse the same interval abstractions.
