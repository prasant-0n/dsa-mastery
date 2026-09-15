# 04.20 — Recursive Algorithms in Backend Systems

## Purpose

Recursion is not merely an interview technique. Backend systems routinely process hierarchical data, dependency graphs, nested configuration, workflows, authorization structures, and search spaces.

This chapter focuses on recognizing where recursive algorithms fit in backend architecture—and where recursion should be replaced with iterative or graph-based approaches for reliability.

> Backend recursion is useful when the domain is hierarchical, but production code must make depth, cycles, resource usage, and failure behavior explicit.

---

# 1. Hierarchical Backend Data

Common recursive structures include:

- organization trees;
- category hierarchies;
- folder/document trees;
- nested comments;
- menu structures;
- workflow definitions;
- dependency graphs;
- permission inheritance.

The first design question is whether the structure is truly a tree or actually a graph.

---

# 2. Tree vs Graph in Backend Data

A tree generally has:

```text
one parent
no cycles
```

A graph may have:

```text
multiple parents
shared nodes
cycles
```

Using tree recursion on graph-shaped data can cause repeated work or infinite traversal.

---

# 3. Recursive API Payloads

APIs may return nested resources:

```json
{
  "department": {
    "teams": [
      { "members": [] }
    ]
  }
}
```

Recursive traversal can validate, normalize, transform, or summarize such payloads.

For untrusted input, enforce maximum nesting depth and payload size.

---

# 4. Nested Validation

A recursive validator can enforce rules at every level:

```text
validate(node)
→ validate children
→ validate node-specific constraints
```

Validation should distinguish:

```text
schema violation
cycle
unsupported depth
resource exhaustion
```

These are different failure classes.

---

# 5. Category and Organization Trees

A common backend operation is constructing a tree from flat records:

```text
id | parentId | name
```

The recursive phase can then calculate:

- descendants;
- subtree size;
- depth;
- inherited attributes;
- paths.

Construction itself may be iterative even if later traversal is recursive.

---

# 6. Avoid N+1 Recursive Database Queries

A naive recursive implementation might perform:

```text
query parent
→ query children
→ query grandchildren
→ ...
```

This can produce an N+1 query pattern.

Prefer fetching appropriate data in batches or using database-supported recursive queries when suitable.

The algorithmic recursion should not automatically become network recursion.

---

# 7. Recursive SQL and Application Recursion

Relational databases can express hierarchical traversal using recursive common table expressions (CTEs).

Conceptually:

```text
anchor rows
→ recursive step
→ repeat until no new rows
```

This can keep data-intensive traversal close to the database.

The correct choice depends on data volume, indexing, transaction boundaries, and query planner behavior.

---

# 8. Dependency Resolution

Backend systems frequently resolve dependencies:

```text
service A
→ requires B
→ requires C
```

A graph traversal can recursively visit dependencies.

Because dependencies may cycle, use cycle detection rather than assuming a tree.

---

# 9. Topological Ordering

For acyclic dependencies, topological ordering provides an execution order.

A recursive DFS implementation tracks states such as:

```text
unvisited
active
completed
```

Encountering an active node indicates a cycle.

---

# 10. Configuration Inheritance

Configuration systems may inherit values:

```text
global
→ organization
→ team
→ service
```

Recursive resolution can walk parent relationships and combine overrides.

Define precedence explicitly so inheritance does not become ambiguous.

---

# 11. Permission Inheritance

Authorization systems may contain hierarchical roles or resources.

A recursive computation may collect inherited permissions:

```text
resource
→ parent resource
→ inherited permissions
```

Security-sensitive recursion must define deny/allow precedence and avoid accidentally traversing unauthorized relationships.

---

# 12. Workflow Execution

Workflow definitions can contain nested steps:

```text
workflow
→ sequence
→ branch
→ nested workflow
```

Recursive interpretation can execute nested structures.

Production engines should add:

- execution limits;
- cancellation;
- timeouts;
- cycle detection;
- audit events.

---

# 13. Dependency Graph Traversal

For graph traversal, track:

```text
visited
active path
result
```

Depending on the problem, global visited may avoid repeated work while active-path state detects cycles.

These concepts must not be conflated.

---

# 14. Caching Recursive Backend Computations

Repeated subtree/dependency computations can be cached.

A cache key should represent the complete future-relevant state:

```text
nodeId + relevant context
```

Do not cache results that depend on hidden mutable context without including that context in the key.

---

# 15. Request-Scoped vs Global Caches

A request-scoped memo can safely reuse work during one computation.

A global cache introduces additional concerns:

- invalidation;
- stale data;
- concurrency;
- memory limits;
- tenant isolation.

Algorithmic memoization and distributed caching are related but not interchangeable.

---

# 16. Multi-Tenant Data

Recursive traversal over tenant-scoped resources must preserve tenant boundaries.

Tenant identity is often part of the security context even if it is not part of the structural node state.

Never allow a cache or traversal to accidentally cross tenant boundaries.

---

# 17. Pagination and Recursive APIs

Deep recursive retrieval can create enormous responses.

Prefer:

```text
bounded depth
pagination
lazy expansion
```

over returning an unbounded hierarchy in one request.

---

# 18. Recursive Serialization

Serializing nested structures may recursively walk every child.

Potential issues include:

- circular references;
- excessive depth;
- huge output;
- repeated shared objects.

Serialization boundaries should define what happens for each condition.

---

# 19. Circular References

JavaScript object graphs can contain:

```js
obj.self = obj;
```

A naive recursive serializer or visitor can loop forever.

Use identity-based tracking when arbitrary object graphs are accepted.

---

# 20. Cycle Detection

Typical graph DFS uses:

```text
unvisited → active → completed
```

Transitions:

```text
active neighbor → cycle
completed neighbor → already processed
```

This is more precise than a simple boolean visited flag when cycle classification matters.

---

# 21. Resource Exhaustion

A recursive backend operation can fail through:

```text
call-stack overflow
CPU exhaustion
heap exhaustion
network amplification
database amplification
```

Therefore complexity analysis must include external resources, not just CPU operations.

---

# 22. Depth Limits

Define an explicit policy:

```text
if depth > MAX_DEPTH:
    reject or stop
```

The limit should be based on legitimate domain requirements and tested against production workloads.

---

# 23. Time and Node Budgets

Search-like recursive operations can enforce:

```text
max nodes
max duration
max cost
```

This prevents unexpectedly large recursive workloads from consuming an entire service worker.

---

# 24. Cancellation

Long-running recursive work should be cancellable when possible.

Conceptually:

```text
if signal.aborted:
    stop
```

Cancellation checks should occur at meaningful work boundaries rather than only after the computation finishes.

---

# 25. Transaction Boundaries

Do not casually combine deep recursive processing with one enormous database transaction.

Consider:

- lock duration;
- rollback cost;
- partial progress;
- retries;
- idempotency.

Algorithmic recursion and transactional recursion are separate concerns.

---

# 26. Recursive Batch Processing

For large hierarchies, process bounded batches:

```text
fetch batch
→ process
→ enqueue next work
```

A queue-based architecture may be safer than holding the entire recursive computation in one request.

---

# 27. Queue as Explicit Recursion

Many recursive workflows can become:

```text
pending = [root]
while pending not empty:
    item = pending.pop()
    process(item)
    pending.push(children)
```

This makes work scheduling explicit and can support distributed processing.

---

# 28. Observability

Instrument recursive backend operations with:

```text
requestId
node/resource ID
depth
nodes processed
cache hits
cache misses
query count
elapsed time
termination reason
```

Without observability, recursive production failures are difficult to diagnose.

---

# 29. Error Semantics

Define whether one child failure:

```text
fails entire operation
or
isolation/partial failure
```

Recursive batch systems often need structured error aggregation rather than immediate process termination.

---

# 30. Backend Complexity Model

A useful model is:

```text
algorithmic work
+ database work
+ network work
+ serialization
+ allocation
+ cache overhead
```

An O(N) recursive traversal can still be operationally expensive if each node causes a database or network operation.

---

# 31. Production Choice: Recursion vs Iteration

Prefer recursion when:

- depth is bounded;
- structure is naturally hierarchical;
- clarity is valuable;
- stack safety is established.

Prefer iteration/explicit worklists when:

- depth is untrusted;
- cancellation matters;
- work must be paused/resumed;
- memory must be controlled;
- processing is large-scale.

---

# 32. Production Choice: Application vs Database

Keep traversal in the application when:

- domain logic dominates;
- data is already loaded;
- external side effects occur.

Consider database-side traversal when:

- the hierarchy is relational;
- traversal is data-intensive;
- set-based execution is advantageous.

Measure rather than assuming one layer is always faster.

---

# 33. Security Considerations

Recursive input is an attack surface when depth or branching is attacker-controlled.

Defenses include:

- input limits;
- depth limits;
- node budgets;
- query budgets;
- timeouts;
- cancellation;
- tenant isolation;
- cycle detection.

---

# 34. Backend Interview Example

A strong explanation:

> “I would first classify the structure as a tree or graph. Then I would define the recursive state and prove progress or cycle handling. If data comes from a database, I would avoid turning recursion into one query per node and consider batching or a recursive query. For production, I would enforce depth and resource budgets, preserve tenant/security context, instrument traversal, and switch to an explicit worklist when depth or cancellation requirements make ordinary recursion unsafe.”

---

# 35. Design Procedure

```text
1. Identify whether the data is a tree, DAG, or graph.
2. Define node and context state.
3. Define progress and cycle behavior.
4. Estimate depth and branching.
5. Identify external work per node.
6. Avoid N+1 recursive I/O.
7. Choose application vs database traversal.
8. Add caching only with correct context keys.
9. Enforce depth and resource limits.
10. Add cancellation and timeouts.
11. Preserve security/tenant context.
12. Instrument traversal.
13. Decide recursion vs explicit worklist.
14. Test adversarial depth and branching.
```

---

# 36. Revision Checklist

- [ ] Can I distinguish a tree from a graph in backend data?
- [ ] Can I design recursive validation safely?
- [ ] Can I detect cycles in dependencies?
- [ ] Can I avoid N+1 recursive database queries?
- [ ] Can I reason about recursive SQL vs application traversal?
- [ ] Can I preserve tenant/security context?
- [ ] Can I design request-scoped memoization safely?
- [ ] Can I bound recursive API depth?
- [ ] Can I add time/node/cost budgets?
- [ ] Can I design cancellation?
- [ ] Can I reason about transaction boundaries?
- [ ] Can I replace recursion with a queue/worklist?
- [ ] Can I instrument recursive production workloads?
- [ ] Can I identify algorithmic vs external-resource complexity?
- [ ] Can I defend recursion vs iteration in an interview?

# Key Takeaways

1. Backend recursion should begin with classifying the data structure as a tree, DAG, or graph.
2. Recursive application logic must not automatically imply recursive database/network calls.
3. N+1 query amplification is a major production failure mode.
4. Cycle detection, depth limits, and resource budgets are first-class requirements for untrusted structures.
5. Memoization must include every context dimension that affects the result, including security boundaries where relevant.
6. Explicit worklists are often superior when cancellation, pause/resume, large depth, or scheduling control matters.
7. Complexity must include database, network, serialization, and allocation costs.
8. Observability should expose depth, work, cache behavior, query amplification, and termination reasons.
9. Production recursion is as much about operational safety as algorithmic correctness.
10. The backend expert chooses recursion because it fits the workload—not because recursion is inherently better.
