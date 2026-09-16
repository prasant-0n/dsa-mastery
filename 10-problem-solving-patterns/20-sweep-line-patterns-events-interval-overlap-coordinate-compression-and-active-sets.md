# 10.20 — Sweep Line Patterns: Events, Interval Overlap, Coordinate Compression & Active Sets

## 1. Objective

A sweep-line algorithm converts a geometric, interval, or temporal problem into an ordered sequence of events processed from left to right.

```text
ranges / objects
→ boundary events
→ sort by coordinate
→ maintain active state
→ answer at event positions
```

## 2. Why It Exists

Many problems ask about overlaps, coverage, concurrent activity, or interactions among intervals. Pairwise comparison can be quadratic. Ordering boundaries lets the algorithm process changes incrementally.

## 3. Event Model

An interval can produce events such as:

```text
start → +1
end   → -1
```

A scan accumulates the active count.

## 4. Endpoint Semantics

Decide whether intervals are:

- `[start, end)`;
- `[start, end]`;
- another explicitly defined convention.

Touching intervals can produce different answers depending on this choice.

## 5. Event Ordering

When multiple events share a coordinate, their processing order matters.

For half-open intervals, starts and ends at the same coordinate can be processed according to the chosen semantics so an interval ending at `x` is not counted as active at `x`.

## 6. Active Count Invariant

Immediately after processing an event coordinate:

> the active state represents exactly the intervals covering the current sweep region under the declared endpoint convention.

## 7. Maximum Overlap

Track the maximum active count during the scan.

This solves problems such as minimum rooms/resources required for intervals.

## 8. Concurrent Intervals

For meeting rooms, servers, machines, or workers, the maximum number of simultaneously active intervals gives the minimum required capacity under a reusable-resource model.

## 9. Merge Intervals as a Sweep

Sort interval starts and maintain the current merged component.

When the next interval overlaps the current component, extend its end; otherwise emit the completed component.

## 10. Coverage Length

For union length, process sorted boundary events while tracking the previous coordinate and active count.

When active count is positive, add the coordinate difference to covered length.

## 11. Weighted Coverage

Events can change a weighted active sum rather than a count.

The same sweep can calculate integrated resource usage or weighted coverage.

## 12. Interval Intersection

Multiple sets of intervals can be swept together by processing boundaries and tracking which sources are active.

For two ordered interval lists, specialized two-pointer methods may be simpler.

## 13. Active Set

Some sweep problems need the identities of currently active objects, not just a count.

Use an ordered set, heap, balanced tree, or other structure depending on the query.

## 14. Heap in Sweep Line

For interval scheduling/resource reuse, a min-heap of end times can identify the resource that becomes available first.

The heap approach is often `O(N log N)` after sorting.

## 15. Ordered Active Set

If the query asks for the smallest/largest active coordinate or predecessor/successor, a count-only sweep is insufficient.

An ordered structure is required.

## 16. Event Compression

When many events share coordinates, aggregate them before processing.

This reduces repeated state transitions and makes endpoint semantics easier to reason about.

## 17. Coordinate Compression

If coordinates are huge but only a small number of boundaries matter, replace each relevant coordinate with its rank.

Preserve the original coordinate gaps when computing lengths.

## 18. Compression Invariant

Compression must preserve ordering:

```text
x < y  ⇒ rank(x) < rank(y)
```

If physical distances matter, store the original coordinates alongside compressed indices.

## 19. Difference Arrays + Sweep

A difference array is a discrete sweep-line representation:

```text
boundary event → cumulative state
```

This connects interval algorithms with prefix reconstruction.

## 20. Temporal Event Processing

The same model applies to:

- requests;
- reservations;
- jobs;
- sessions;
- resource occupancy;
- telemetry.

Timestamp semantics must be explicit.

## 21. Event-Time vs Processing-Time

In distributed streams, event timestamp and arrival timestamp can differ.

A simple sorted sweep assumes events are processed in coordinate order. Out-of-order data requires buffering, watermarks, or another ordering strategy.

## 22. 2D Sweep Line

For rectangle problems, sweep one dimension while maintaining active intervals in the other dimension.

This can reduce a 2D problem to a sequence of 1D active-set problems.

## 23. Rectangle Union

A common architecture is:

```text
x-events
→ active y-coverage structure
→ covered y-length × Δx
```

The active structure may require coordinate compression and a segment tree for efficient range updates and covered-length queries.

## 24. Closest Pair / Geometric Sweeps

Some computational-geometry algorithms maintain a bounded active region while sweeping sorted points.

The correctness relies on geometric bounds that justify discarding points outside the relevant region.

## 25. Line Segment Intersections

Sweep-line methods can maintain active segments and detect candidate intersections.

General computational geometry requires careful treatment of ties, numerical precision, and degeneracies.

## 26. Sweep + Hashing

Hash maps can maintain counts keyed by event attributes while the coordinate sweep handles temporal/spatial ordering.

This is useful when the active query is categorical rather than ordered.

## 27. Sweep + Monotonic Structures

A monotonic deque or stack can summarize active candidates when dominance permits permanent removal.

This combines event ordering with candidate-pruning techniques.

## 28. Sweep + DSU

Offline interval activation can be combined with DSU when the active relationship only merges components.

For dynamic connectivity over time, rollback DSU can be paired with a time-segment decomposition.

## 29. Correctness Proof

A sweep proof should establish:

1. events represent every relevant state transition;
2. event ordering matches the problem's endpoint semantics;
3. active state is correct between consecutive event coordinates;
4. every reported answer corresponds to the active state;
5. no interval/object is omitted.

## 30. Complexity

Typical 1D interval sweep:

```text
build events: O(N)
sort: O(N log N)
sweep: O(N)
space: O(N)
```

With an active balanced structure, add its per-event operation cost.

## 31. Common Mistakes

1. Ignoring endpoint semantics.
2. Processing equal-coordinate events in the wrong order.
3. Forgetting zero-length intervals.
4. Compressing coordinates without preserving distances.
5. Assuming arrival order is event-time order.
6. Using a count when identity/order queries are required.
7. Forgetting sorting cost.
8. Ignoring numerical precision in geometry.

## 32. Edge Cases

Test:

- empty intervals;
- one interval;
- touching intervals;
- identical endpoints;
- nested intervals;
- duplicate intervals;
- zero-length intervals;
- negative coordinates;
- huge sparse coordinates;
- simultaneous starts/ends;
- out-of-order timestamps.

## 33. Backend Applications

Sweep-line reasoning appears in:

- resource occupancy;
- reservations;
- concurrent requests;
- job scheduling;
- rate/capacity analysis;
- billing windows;
- temporal joins.

## 34. AI Applications

Applications include:

- temporal feature aggregation;
- event-stream preprocessing;
- overlapping annotation intervals;
- active candidate regions;
- sequence segmentation;
- batched temporal statistics.

## 35. Testing Strategy

Use:

- brute-force interval coverage references;
- randomized endpoint generation;
- equal-coordinate cases;
- differential compressed/uncompressed tests;
- event-order permutation tests under equivalent semantics;
- active-set invariant checks;
- adversarial sparse-coordinate workloads.

## 36. Interview Framework

When interval overlap or event activity appears:

```text
1. What are the state-change events?
2. What endpoint convention applies?
3. How should equal coordinates be ordered?
4. What must the active state remember?
5. Is a count enough?
6. Do I need a heap or ordered set?
7. Can coordinates be compressed?
8. Are distances affected by compression?
9. Are events guaranteed to be ordered?
10. What invariant proves the sweep state?
```

## 37. Revision Checklist

- [ ] I can convert intervals into events.
- [ ] I understand endpoint ordering.
- [ ] I can calculate maximum overlap.
- [ ] I can calculate union coverage.
- [ ] I understand active-set requirements.
- [ ] I can apply coordinate compression.
- [ ] I understand sweep + difference arrays.
- [ ] I know how out-of-order events change the model.
- [ ] I understand 2D sweep architecture.
- [ ] I can explain backend and AI applications.

## 38. Key Takeaways

1. **A sweep line turns interval or geometric boundaries into ordered state transitions.**
2. **Endpoint semantics and event ordering are part of correctness, not implementation details.**
3. **The active-state data structure must match the query: count, heap, ordered set, hash map, or more advanced structure.**
4. **Coordinate compression preserves order but not physical distance unless original coordinates are retained.**
5. **Sweep-line reasoning is a broad pattern that composes naturally with prefix state, difference arrays, monotonic structures, hashing, and DSU.**
