# 13.15 — Trie-Based Routing & Namespace Indexing

## 1. Concept Definition

Trie-based routing uses hierarchical keys and prefixes to select a destination, handler, policy, or resource. Namespace indexing applies the same idea to paths such as URLs, filesystem paths, tenant keys, configuration names, and object-store prefixes.

The central operation is often not exact lookup but **most-specific matching**: find the longest stored prefix that matches the query.

## 2. Why Prefix Routing Exists

Hash tables answer exact-key membership efficiently, but they do not naturally answer:

> Which configured prefix most specifically matches this key?

A trie makes shared prefixes explicit and therefore provides a natural index for hierarchical routing.

## 3. Mental Model

Represent routes as a hierarchy:

```text
/api
├── /users
│   ├── /active
│   └── /:id
└── /orders
```

A request travels through the shared path until no further matching branch exists.

The stored terminal nodes carry routing metadata.

## 4. Exact vs Prefix Routing

### Exact routing

```text
/users/42
```

must match the complete key.

### Prefix routing

```text
/api/users/42
```

may match `/api/users`.

### Longest-prefix routing

If both `/api` and `/api/users` exist, `/api/users` is the more specific match.

These semantics must be explicitly defined by the routing API.

## 5. Route Representation

A route can contain:

```js
{
  prefix: "/api/users",
  target: "user-service",
  priority: 10,
  metadata: {}
}
```

Separate structural matching from policy selection whenever possible.

## 6. Longest-Prefix Match Algorithm

Track the latest terminal route while traversing:

```text
root
 ↓
/api       ← candidate
 ↓
/users     ← better candidate
 ↓
/42        ← no stored route
```

Return the deepest valid candidate.

This is the core pattern behind many prefix-routing problems.

## 7. Namespace Indexing

A namespace is a hierarchy of identifiers:

```text
tenant:42/project:7/document:abc
```

A trie can index namespaces by components or characters.

Choosing characters vs tokens/components depends on query semantics and normalization requirements.

## 8. Character vs Component Tries

Character trie:

```text
/api/users/42
```

Component trie:

```text
["api", "users", "42"]
```

Component tries naturally prevent accidental partial-component matches.

For example, `/app` should not automatically match `/apple` when the routing contract is component-based.

## 9. URL Routing

URL routers may require:

- static segments
- parameters
- wildcards
- optional segments
- catch-all routes
- HTTP method constraints
- host constraints

A plain prefix trie handles only a subset of this space. Parameterized routing introduces pattern precedence and ambiguity rules.

## 10. Static vs Dynamic Segments

Consider:

```text
/users/me
/users/:id
/users/*rest
```

A router needs deterministic precedence.

A typical policy might distinguish:

1. exact/static segment
2. parameter segment
3. wildcard segment

The precise ordering is an API decision and should be documented and tested.

## 11. Route Precedence

When multiple routes match, selection may depend on:

- longest path
- static segment count
- explicit priority
- HTTP method
- host
- tenant

Do not assume “longest string” is sufficient for structured routing.

## 12. Ambiguity Detection

A routing index should detect conflicting definitions when the product contract forbids them.

Examples:

```text
/users/:id
/users/:name
```

These may represent the same structural pattern.

A registration-time validator can reject ambiguous routes rather than leaving behavior to insertion order.

## 13. Route Compilation

Instead of interpreting route patterns on every request, compile them into a trie once:

```text
route definitions
      ↓
parser
      ↓
compiled trie
      ↓
request matching
```

This shifts complexity from request-time matching to update/build time.

## 14. Immutable Route Snapshots

Read-heavy routers can publish immutable compiled snapshots:

```text
route config
    ↓
compile
    ↓
validate
    ↓
publish snapshot
    ↓
request readers
```

This combines trie indexing with the concurrency principles from Chapter 13.13.

## 15. Namespace Authorization

A prefix index can represent policies such as:

```text
org/finance/* → allow
org/finance/payroll/* → deny
```

The lookup may need the most-specific matching policy rather than the first matching policy.

Authorization semantics must define deny/allow precedence explicitly.

## 16. Multi-Tenant Namespaces

Tenant identity should usually be part of the index key or an isolated namespace.

Possible designs:

```text
tenant → trie
```

or:

```text
tenant/key → shared trie
```

Separate tries can simplify isolation; a shared trie can improve operational consolidation. The correct choice depends on scale and security boundaries.

## 17. Tenant Isolation

A shared prefix index must never allow a query from tenant A to observe tenant B's entries.

Tenant identity should be established before index lookup or encoded into the lookup key.

Authorization should not depend solely on a caller-supplied prefix.

## 18. Filesystem and Object Paths

Hierarchical paths are natural trie keys:

```text
home/users/prasant/docs
```

Applications include:

- virtual filesystems
- object-store prefixes
- document namespaces
- configuration trees
- package/module paths

Normalization is essential because logically equivalent paths can have different textual representations.

## 19. Path Normalization

Define rules for:

- repeated separators
- `.` segments
- `..` segments
- case sensitivity
- Unicode normalization
- trailing separators
- percent encoding where applicable

Normalize at a clear boundary before indexing.

## 20. Route Parameters

A parameter route can store a wildcard-like transition:

```text
/users/:id
```

At runtime, the router captures the segment and passes it to the handler.

The trie therefore stores both structural routing state and capture metadata.

## 21. Wildcard Routes

Catch-all patterns such as:

```text
/static/*path
```

can terminate matching at a wildcard edge while consuming the remaining path.

Wildcard precedence must be lower than more specific routes if that is the desired contract.

## 22. Method-Aware Routing

A route may be indexed by:

```text
method + path
```

or by path first and method second.

Path-first indexing can share structural work across methods; method-first indexing can isolate method-specific workloads.

Choose according to query distribution.

## 23. Host and Domain Routing

Domain names are hierarchical too:

```text
api.example.com
```

For suffix-oriented matching, the natural trie direction may be reversed:

```text
com → example → api
```

This allows suffix matching to become prefix traversal.

## 24. Reverse Tries

A reverse trie stores symbols from the end toward the beginning.

Useful cases include:

- domain suffix matching
- file-extension matching
- string suffix indexes
- reverse routing policies

The representation should clearly document the transformed key order.

## 25. Backend Service Routing

A service gateway may use a trie to map:

```text
/api/orders → orders-service
/api/users  → users-service
/api/search → search-service
```

The trie is the local routing index; service discovery, health checks, load balancing, and retries remain separate concerns.

## 26. Cache-Key Namespace Routing

Prefix indexes can route cache operations:

```text
user:* → user-cache
product:* → product-cache
```

The index can determine the namespace before a cache lookup.

This can simplify multi-cache architectures but introduces another routing dependency.

## 27. Configuration Namespaces

Configuration keys often form hierarchies:

```text
service.database.host
service.database.pool.max
```

A component trie can support subtree operations such as:

- enumerate descendants
- inherit configuration
- override a subtree
- validate namespaces

## 28. Prefix Inheritance

A parent configuration can provide defaults:

```text
service
  ↓
service.database
  ↓
service.database.production
```

Lookup can walk toward the most specific applicable node and merge inherited values according to policy.

## 29. Namespace Operations

Useful operations include:

- create namespace
- delete subtree
- rename subtree
- move subtree
- enumerate descendants
- test existence
- resolve inherited value

Subtree mutation can be much more complex than single-key insertion/deletion.

## 30. Subtree Deletion

If a namespace owns an entire subtree, deletion can detach the subtree in one structural operation when the data model permits it.

The persistence, authorization, cache, and audit layers still need to process the logical deletion.

## 31. Subtree Move

Moving:

```text
team/a → team/b
```

may be implemented as detach + attach in a mutable tree or as a new immutable version.

All descendant references, metadata, and external indexes must be considered.

## 32. Backend Security Applications

Trie routing can support:

- hierarchical ACLs
- namespace policy lookup
- tenant routing
- API route dispatch
- configuration access

Security-critical routing must be tested against ambiguous paths, normalization bypasses, and cross-namespace access.

## 33. AI Applications

Namespace tries can index:

- tool/function names
- model capability paths
- entity namespaces
- constrained-generation vocabularies
- prompt-policy keys
- retrieval source namespaces

For AI systems, deterministic prefix matching can be combined with ranking or policy filtering.

## 34. AI Tool Routing

A tool namespace might look like:

```text
filesystem/read
filesystem/write
database/query
database/admin
```

A trie can identify the tool family or namespace quickly before policy and capability checks.

Never treat structural matching as authorization by itself.

## 35. Routing and Caching

A route result can be cached using:

```text
normalized key → route version → target
```

When the routing snapshot changes, versioning can prevent stale entries from being interpreted as current.

## 36. Production Update Pipeline

A robust route index can use:

```text
configuration source
      ↓
parse
      ↓
normalize
      ↓
compile trie
      ↓
validate conflicts
      ↓
benchmark/quality gates
      ↓
publish immutable snapshot
```

Failed builds should leave the last valid snapshot available.

## 37. Observability

Track:

- lookup latency
- route hit counts
- unmatched requests
- ambiguity errors
- snapshot version
- snapshot age
- update/build latency
- route count
- trie node count
- hot prefixes

Logs should avoid leaking sensitive tenant or path data.

## 38. Complexity

For a normalized key of length `L`, ordinary trie lookup is approximately `O(L)` symbol traversal.

Prefix output operations additionally depend on output size.

Parameterized routing adds pattern matching and capture costs.

A realistic model should include normalization, parsing, route-policy evaluation, and downstream target selection.

## 39. Common Mistakes

- using exact-key hashing for a longest-prefix problem
- confusing string-prefix with path-segment prefix
- ignoring normalization
- ambiguous dynamic routes
- allowing wildcard routes to override specific routes unintentionally
- mixing tenant identity with untrusted input
- rebuilding the index during request handling
- publishing partially compiled route state
- treating routing as authorization

## 40. Interview Framework

For a trie routing problem:

1. Define the key grammar.
2. Define normalization.
3. Choose character vs component indexing.
4. Define exact/prefix/longest-prefix semantics.
5. Define route precedence.
6. Handle parameters and wildcards.
7. Design registration validation.
8. Choose mutable vs immutable updates.
9. Analyze complexity and memory.
10. Add observability and security boundaries.

## 41. Revision Checklist

- [ ] Implement longest-prefix routing.
- [ ] Distinguish exact and component-prefix matching.
- [ ] Design parameter and wildcard routes.
- [ ] Define route precedence.
- [ ] Detect ambiguous patterns.
- [ ] Normalize hierarchical paths.
- [ ] Design reverse-trie domain routing.
- [ ] Design multi-tenant namespace isolation.
- [ ] Implement subtree enumeration.
- [ ] Explain subtree deletion/move.
- [ ] Design immutable route snapshots.
- [ ] Add version-aware route caching.
- [ ] Design AI tool namespace routing.
- [ ] Separate routing from authorization.

## Key Takeaways

1. Tries naturally model hierarchical routing and namespaces.
2. Longest-prefix matching is the core routing pattern.
3. Component-based routing prevents accidental partial-segment matches.
4. Dynamic and wildcard routes require explicit precedence rules.
5. Reverse tries turn suffix matching into prefix traversal.
6. Immutable compiled snapshots are well suited to read-heavy routing systems.
7. Tenant isolation, normalization, conflict detection, and authorization boundaries are production concerns, not optional details.
