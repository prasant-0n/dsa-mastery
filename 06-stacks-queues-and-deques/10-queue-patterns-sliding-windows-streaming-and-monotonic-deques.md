# 06.10 — Queue Patterns: Sliding Windows, Streaming & Monotonic Deques

> **Phase 06 — Stacks, Queues & Deques**
>
> This chapter introduces the deque as the natural structure for problems where a moving window needs efficient access to both ends. We develop sliding-window reasoning, monotonic deques, streaming algorithms, expiration by index/time, and production applications.

---

# 1. Learning Objectives

By the end of this chapter, you should be able to:

- model a sliding window precisely;
- distinguish fixed-size and variable-size windows;
- maintain window boundaries without rescanning old elements;
- understand why a deque is useful for two-ended window maintenance;
- solve sliding-window maximum/minimum in O(N);
- derive the monotonic deque invariant;
- reason about duplicates and strict vs non-strict comparisons;
- handle index expiration correctly;
- extend windows from index-based to time-based streams;
- analyze amortized complexity;
- connect deques to rate limiting, telemetry, monitoring, and AI streams.

---

# 2. What Is a Sliding Window?

A sliding window is a contiguous region over a sequence:

```text
values = [A B C D E F G]
          └─────┘
          window
```

As the input advances, the window moves:

```text
[A B C]
  [B C D]
    [C D E]
      [D E F]
```

The challenge is to update the window's answer without recomputing it from scratch after every movement.

---

# 3. Fixed-Size Window

For window size `K`:

```text
window = values[i-K+1 ... i]
```

For every new element:

```text
add incoming
remove expired
update answer
```

A naive maximum algorithm scans K elements for every position:

```text
O(NK)
```

The goal is often to reduce this to:

```text
O(N)
```

---

# 4. Why a Plain Queue Is Not Enough

A FIFO queue provides access to the oldest element.

But a sliding-window maximum also needs to efficiently remove candidates that can no longer become the maximum.

We may need to:

```text
remove from front
remove dominated elements from back
```

Therefore a deque is a natural fit.

---

# 5. Deque ADT Preview

A deque supports insertion and removal at both ends:

```text
pushFront
pushBack
popFront
popBack
peekFront
peekBack
```

A monotonic deque uses those operations while maintaining an ordering invariant over its candidates.

---

# 6. Sliding-Window Maximum

Suppose:

```text
values = [2, 1, 3, 4, 6, 3]
K = 3
```

For every position, we want the largest value in the current window.

The deque stores **candidate indices**, not merely values.

This is important because indices tell us when candidates expire.

---

# 7. Monotonic Decreasing Deque

For a maximum query, maintain candidate values in decreasing order:

```text
front → largest ... smallest ← back
```

When adding value `x`, remove candidates from the back while:

```text
candidateValue <= x
```

Those candidates can never become maximum while x remains in the window.

Then append x's index.

---

# 8. Why Dominated Candidates Can Be Removed

Suppose the deque contains:

```text
[8, 5, 3]
```

and incoming value is:

```text
6
```

The `3` is dominated because:

```text
6 > 3
```

and 6 entered later.

While both are inside the window, 6 will always beat 3.

So keeping 3 provides no future benefit.

This is the key monotonic-deque insight.

---

# 9. Why Indices Are Stored

Values alone cannot tell us whether an element has expired.

Suppose:

```text
index = 2
K = 3
currentIndex = 5
```

Index 2 is outside the current window.

Expiration rule:

```text
index <= currentIndex - K
```

Therefore store indices and retrieve values from the original sequence.

---

# 10. Window Expiration

Before using the deque front:

```text
while frontIndex <= i - K
    popFront()
```

The front must always refer to an element inside the current window.

This is a fundamental invariant.

---

# 11. Complete Maximum Algorithm

For each index `i`:

```text
1. Remove expired indices from front.
2. Remove dominated indices from back.
3. Push i.
4. If the window is complete, front is the maximum.
```

The deque invariant is:

```text
indices increase from front to back
values decrease from front to back
all indices belong to the current window
```

---

# 12. Complexity

Each index is:

```text
pushed at most once
popped from front at most once
popped from back at most once
```

Therefore total deque operations are O(N).

So:

```text
Time  = O(N)
Space = O(K)
```

This is an amortized argument: individual iterations may perform multiple pops, but every index can pay for only a bounded number of deque operations.

---

# 13. Amortized Reasoning

A loop such as:

```text
while deque not empty and dominated
    popBack()
```

may look O(N) inside another O(N) loop.

That does **not** automatically make the algorithm O(N²).

Every element pushed into the deque can be popped only once from the back.

Across the entire run:

```text
N pushes + at most N back pops + at most N front pops
= O(N)
```

This is a classic aggregate amortized analysis.

---

# 14. Sliding-Window Minimum

For minimum queries, reverse the ordering:

```text
front → smallest ... largest ← back
```

When adding x, remove from the back while:

```text
candidateValue >= x
```

The resulting deque is monotonic increasing.

The same framework solves both maximum and minimum.

---

# 15. Strict vs Non-Strict Comparisons

Consider duplicate values:

```text
[5, 5, 5]
```

When maintaining a maximum, should equal values be removed?

Possible rules:

```text
pop while candidate < x
```

or:

```text
pop while candidate <= x
```

Both can be correct depending on whether older equal candidates need to be preserved for identity, stability, or expiration behavior.

The comparison policy must match the problem's requirements.

---

# 16. Values vs Candidate Identity

If the problem asks only for numeric maxima, equal candidates may often be interchangeable.

If it asks:

```text
which index produced the maximum?
```

then identity matters.

An implementation should preserve the candidate index that satisfies the required tie-breaking rule.

---

# 17. Sliding-Window Sum Is Different

A sum does not need a monotonic deque.

For fixed K:

```text
windowSum += incoming
windowSum -= outgoing
```

This gives:

```text
O(N)
```

time and O(1) auxiliary state.

This teaches an important pattern-selection rule:

> Use the smallest state that preserves the required aggregate.

---

# 18. Sliding-Window Average

Average can be maintained from the same running sum:

```text
average = windowSum / K
```

Again, no deque is required.

The data structure should match the operation being maintained.

---

# 19. Variable-Size Windows

Some problems do not fix K.

Instead, the window expands until a constraint is violated:

```text
expand right
while invalid
    move left
```

This often uses:

```text
array + left/right pointers
frequency map
running sum
```

rather than a deque.

The monotonic-deque technique is especially powerful when the window is fixed or when a moving expiration boundary combines with an extremum query.

---

# 20. Time-Based Windows

Real streams often use timestamps rather than array indices.

Example:

```text
window = last 60 seconds
```

For an incoming event at time `t`:

```text
expire events with timestamp < t - 60s
```

The same deque logic applies, but the expiration key becomes time.

This is a major bridge from DSA to backend systems.

---

# 21. Streaming Data

In a stream, you may not know N in advance.

The algorithm processes events incrementally:

```text
event → update state → emit metric
```

A bounded deque can maintain only the state necessary for the active window.

This avoids storing the entire historical stream.

---

# 22. Rate Limiting

A timestamp deque can implement a sliding-window request limiter.

For each request:

```text
1. remove expired timestamps
2. inspect queue length
3. reject if limit reached
4. otherwise append current timestamp
```

If the limit is `L` requests per `W` seconds:

```text
active timestamps ≤ L
```

The deque naturally removes the oldest events first.

---

# 23. Rate Limiter Correctness

Invariant:

```text
all timestamps in deque are inside the active time window
```

and:

```text
timestamps are nondecreasing
```

Before accepting a request, cleanup must happen first.

Otherwise expired requests can incorrectly consume capacity.

---

# 24. Telemetry and Monitoring

Sliding windows are useful for:

```text
requests/minute
errors/5 minutes
p95-like windowed metrics
maximum latency
minimum latency
queue depth over time
recent event counts
```

For exact percentiles, a simple deque is insufficient; specialized sketches or ordered structures may be required.

This distinction matters in production design.

---

# 25. Backend Applications

Deque-based window maintenance appears in:

- API rate limiting;
- rolling latency metrics;
- recent-event processing;
- anomaly detection windows;
- connection activity tracking;
- stream aggregation;
- scheduling deadlines;
- event-time processing.

For distributed systems, local deque state is not automatically a globally correct rate limiter. Clock synchronization, partitioning, replication, and shared state may change the design.

---

# 26. AI Applications

Sliding windows appear in:

- streaming inference;
- recent-token/context processing;
- online feature calculation;
- rolling model metrics;
- event-based anomaly detection;
- beam/frontier maintenance;
- candidate retention.

A monotonic deque can maintain extrema over recent scores or timestamps without repeatedly scanning the whole window.

---

# 27. Beam Search Connection

Beam search keeps only the best B candidates at each step.

Although a heap is often the natural structure for global top-K selection, a deque can become useful when candidates have ordered arrival/expiration constraints.

The broader lesson is:

```text
queue → order by arrival
heap → order by priority
deque → order by arrival + efficient two-ended maintenance
```

---

# 28. Monotonic Queue General Pattern

A monotonic queue maintains candidates according to a dominance relation.

For maximum:

```text
value(front) ≥ value(next) ≥ ...
```

For minimum:

```text
value(front) ≤ value(next) ≤ ...
```

The structure contains only candidates that can still become the answer.

This is a form of **state compression through dominance**.

---

# 29. Dominance Reasoning

Candidate A is dominated by candidate B if B is:

```text
at least as good under the query
and
no worse with respect to future validity
```

For a fixed-window maximum:

```text
B arrives later
B.value >= A.value
```

Therefore A cannot beat B before A expires.

This is why A can be discarded safely.

---

# 30. Correctness Proof

For maximum sliding window, prove:

### Invariant 1

Deque indices increase from front to back.

### Invariant 2

Deque values decrease from front to back.

### Invariant 3

Every deque index belongs to the current window.

### Invariant 4

Every candidate that could still become the maximum remains represented.

The front is therefore the maximum valid candidate.

---

# 31. Why Every Candidate Is Safe to Remove

When removing a back candidate A because incoming B satisfies:

```text
B.value >= A.value
```

B is newer.

For every future window in which A remains valid, B is at least as good and expires no earlier.

Therefore A can never become strictly better than B.

This is the key proof of the monotonic-deque optimization.

---

# 32. Memory Complexity

A monotonic deque stores only candidate indices.

Worst case:

```text
O(K)
```

For a strictly increasing sequence under maximum-window processing, many earlier candidates are removed and the deque remains small.

For a strictly decreasing sequence, many candidates can remain, approaching O(K).

---

# 33. Common Mistakes

- storing values instead of indices when expiration matters;
- removing expired items from the wrong end;
- using the wrong inequality for duplicates;
- forgetting that the answer is valid only after the first full window;
- assuming a nested while loop automatically means O(N²);
- using a deque for aggregates that need only a running scalar;
- mixing timestamps and indices incorrectly;
- allowing unbounded stream state;
- confusing local sliding-window correctness with distributed global correctness.

---

# 34. Testing Strategy

Test:

```text
empty input
K = 1
K = N
K > N
strictly increasing
strictly decreasing
all equal
alternating extremes
negative values
large values
many duplicate maxima
many duplicate minima
```

For time windows, test events with identical timestamps, out-of-order timestamps if allowed, and boundary timestamps exactly at expiration.

---

# 35. Differential Testing

For sliding-window maximum, compare the optimized deque algorithm against a brute-force implementation:

```text
for every window
    scan K values
    compute maximum
```

Randomly generate arrays and K values.

For every test:

```text
optimized result === brute-force result
```

This is especially valuable for validating duplicate and boundary semantics.

---

# 36. Benchmarking

Compare:

```text
brute-force O(NK)
heap-based approach
monotonic deque O(N)
```

Use different distributions:

```text
random
increasing
decreasing
many duplicates
small K
large K
```

The goal is to understand both asymptotic and practical behavior.

---

# 37. Production Design Framework

For a streaming window:

```text
1. Define the window boundary.
2. Define event ordering assumptions.
3. Define the aggregate/query.
4. Determine whether expiration is index- or time-based.
5. Choose queue/deque/heap/scalar state.
6. Define duplicate/tie semantics.
7. Bound memory.
8. Define out-of-order behavior.
9. Define failure/restart semantics.
10. Test against a reference model.
11. Benchmark realistic event rates.
12. Add metrics for state size and processing lag.
```

---

# 38. Interview Framework

When you see:

```text
maximum/minimum of every K-sized window
```

think:

```text
sliding window
→ candidate dominance
→ monotonic deque
```

Then explain:

```text
1. store indices
2. expire from front
3. remove dominated candidates from back
4. append current index
5. read front as answer
6. prove each index enters/exits bounded times
7. derive O(N) time and O(K) space
```

---

# 39. Revision Checklist

- [ ] I understand fixed sliding windows.
- [ ] I can explain why a deque is useful.
- [ ] I can derive the monotonic-deque invariant.
- [ ] I can solve sliding-window maximum in O(N).
- [ ] I can adapt it to minimum.
- [ ] I understand candidate indices and expiration.
- [ ] I understand duplicate/tie handling.
- [ ] I can prove amortized O(N).
- [ ] I can distinguish deque problems from running-aggregate problems.
- [ ] I can adapt index windows to time windows.
- [ ] I understand rate-limiter applications.
- [ ] I understand streaming/backend applications.
- [ ] I understand AI sliding-window applications.
- [ ] I can differential-test the optimization.
- [ ] I can defend the solution in an interview.

---

# 40. Key Takeaways

1. Sliding windows maintain a moving contiguous region of data.
2. A deque is useful when both expiration and candidate elimination happen at the ends.
3. Monotonic deques compress the candidate set through dominance.
4. Store indices when expiration matters.
5. Sliding-window maximum and minimum can be solved in O(N) time.
6. The nested pop loop is still amortized O(N) because each index is removed a bounded number of times.
7. Duplicates require an explicit tie policy.
8. Not every sliding-window problem needs a deque; sums and averages often need only O(1) state.
9. Time-based windows connect the same DSA pattern directly to backend streaming and rate limiting.
10. Production designs must consider ordering, memory bounds, distributed semantics, and failure recovery.
