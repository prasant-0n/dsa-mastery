# 07.16 — Consistent Hashing & Distributed Systems

## 1. Concept Definition

**Consistent hashing** is a partitioning technique designed to reduce key remapping when the number of nodes in a distributed system changes.

The basic model places both keys and nodes into a shared hash space:

```text
             hash ring
        ┌─────────────────┐
        │                 │
     N1 ●                 ● N2
        │                 │
        ● N4           ● N3
        └─────────────────┘
```

A key is assigned to the next node according to the chosen ring-direction convention.

The important property is not that no keys move. **Some keys must move when membership changes.** The goal is to limit unnecessary movement.

## 2. Why It Exists

Simple modulo partitioning uses:

```text
partition = hash(key) % N
```

Changing `N` changes the partition function for many keys.

For example:

```text
N = 4 → hash(key) % 4
N = 5 → hash(key) % 5
```

A large fraction of keys can move.

This can cause:

- cache misses;
- data migration;
- connection churn;
- load movement;
- expensive rebalancing.

Consistent hashing is designed to reduce this movement.

## 3. Mental Model

Think of a circular ordered hash space:

```text
0 ─────────────────────── MAX
│                         │
└─────────────────────────┘
```

Each node owns one or more positions on the ring.

For a key:

```text
hash(key) → point on ring
                  ↓
         walk to assigned node
```

If a node is added, only keys in the newly claimed interval need to move under the standard successor-based model.

## 4. Basic Ring Algorithm

Let every node have a hash position:

```text
position(node) = H(nodeId)
```

Sort positions.

For key `k`:

```text
p = H(k)
find first node position >= p
wrap to first node if necessary
```

That node becomes the owner.

The search can be implemented with binary search over sorted node positions.

## 5. Ring Invariants

A correct ring should maintain:

1. node positions are ordered;
2. every active key maps to exactly one node under the chosen boundary convention;
3. wrap-around is handled correctly;
4. adding/removing nodes updates ownership consistently;
5. virtual-node identity remains stable;
6. no stale node remains in the active ring.

Boundary semantics must be explicit because exact hash-position collisions are possible.

## 6. Virtual Nodes

Using one point per physical node can produce uneven ownership.

A common technique is **virtual nodes**:

```text
physical node A
   ├─ vnode A-1
   ├─ vnode A-2
   ├─ vnode A-3
   └─ ...
```

Each physical node owns many positions.

This improves statistical distribution when the hash function is suitable.

Virtual-node count is an engineering parameter:

```text
more vnodes → finer distribution
             + more ring metadata
             + more lookup/management work
```

## 7. Weighted Nodes

Nodes may have different capacities.

A larger machine can receive more virtual nodes:

```text
capacity weight
      ↓
number of virtual positions
```

The weight should represent a measured capacity model rather than an arbitrary label.

Weighted ownership must still be validated against observed load.

## 8. Adding a Node

Suppose a new node `N5` is inserted between `N2` and `N3`.

Only the keys in the interval that becomes owned by `N5` move from the previous successor owner.

This is the core operational advantage over naive modulo partitioning.

However, the actual system still needs a migration mechanism.

Consistent hashing determines **ownership**; it does not automatically transfer bytes, connections, or application state.

## 9. Removing a Node

When node `N2` leaves:

```text
its owned intervals
      ↓
next eligible nodes
```

take over those keys under the ring policy.

Again, the ring determines the new owner. The application must still handle:

- state transfer;
- cache warm-up;
- replication;
- connection routing;
- failure detection;
- retries.

## 10. Key Movement

Let `K` be the number of keys.

With modulo partitioning, changing partition count can remap a large fraction of `K`.

With consistent hashing, an idealized node addition typically moves approximately the fraction of keyspace corresponding to the new node's ownership.

The exact fraction depends on:

- node count;
- virtual-node placement;
- weights;
- hash distribution;
- key distribution;
- ring implementation.

Do not treat the ideal fraction as a guarantee for every workload.

## 11. Lookup Complexity

If ring positions are stored in a sorted array:

```text
hash key        → O(hash cost)
binary search   → O(log V)
```

where `V` is the number of virtual-node positions.

A Map can then resolve:

```text
virtual position → physical node
```

Lookup is therefore typically `O(log V)` after hashing.

Alternative ring representations can change the operational cost.

## 12. Ring Construction

Building a ring generally requires:

```text
create vnode positions
      ↓
hash each position
      ↓
sort positions
      ↓
construct ownership metadata
```

If there are `V` virtual nodes:

```text
hashing → O(V)
sorting → O(V log V)
```

A membership change may require updating the sorted structure and associated ownership metadata.

## 13. Hash Function Requirements

The ring depends heavily on distribution quality.

The hash should provide suitable distribution across the ring for the expected key space.

Important considerations:

- deterministic mapping;
- stable node identifiers;
- adequate distribution;
- collision handling;
- adversarial inputs;
- arithmetic correctness.

A poor hash function can create ownership imbalance regardless of the ring algorithm.

## 14. Collision Handling

Two node IDs can theoretically hash to the same ring position.

The implementation needs a deterministic policy such as:

- secondary identity ordering;
- additional vnode salt;
- a collision-resolution scheme.

The same applies to key positions if the representation requires exact uniqueness.

## 15. Consistent Hashing Is Not Replication

These concepts are related but different:

```text
consistent hashing → ownership / placement
replication         → multiple copies
```

A system can combine them:

```text
primary owner
   ↓
next R-1 eligible ring nodes
```

where `R` is the replication factor.

The replica-selection policy must avoid accidentally choosing multiple virtual positions belonging to the same physical node.

## 16. Failure & Failover

If a node becomes unavailable:

```text
primary owner unavailable
        ↓
select eligible replica/fallback
```

The system must define:

- failure detection;
- timeout behavior;
- replica selection;
- consistency guarantees;
- recovery/reintegration;
- data repair.

A hash ring alone does not provide failure detection or consensus.

## 17. Membership Changes

Distributed systems need a consistent view of membership.

If different clients have different ring membership:

```text
client A → key → node 1
client B → same key → node 3
```

then routing becomes inconsistent.

Therefore ring updates need a membership/distribution mechanism with explicit versioning or coordination semantics.

## 18. Ring Versioning

A useful model is:

```text
ring version 41
    ↓
all routing decisions tagged with version
```

During transitions, systems may need to support both old and new ownership maps.

This is especially important during gradual migration.

## 19. Rebalancing

A ring change may require data migration:

```text
old owner
   ↓
transfer relevant keys
   ↓
new owner
   ↓
validate
   ↓
activate ownership
```

Migration should account for:

- bandwidth;
- throttling;
- consistency;
- duplicate writes;
- retries;
- interruption;
- rollback.

## 20. Cache Clusters

Consistent hashing is frequently useful for distributed caches:

```text
cache key → ring → cache node
```

Adding a cache node should remap only a subset of keys, reducing the cache-wide miss storm that naive modulo partitioning can cause.

Cache systems may additionally use replication, TTL, eviction, and request coalescing.

## 21. Database / Storage Sharding

A distributed storage system may route records by a shard key:

```text
tenant/user/entity
        ↓
partition function
        ↓
shard
```

Consistent hashing can help when shard membership changes, but the database still needs a migration and consistency protocol.

The shard key itself must be chosen to avoid pathological skew.

## 22. Service Routing

A ring can also route requests to service instances:

```text
routing key → node
```

For stateful workloads, this can provide stable affinity.

For stateless services, ordinary load-balancing algorithms may be simpler because there is less value in stable ownership.

## 23. Sticky Sessions

A hash-based routing key can provide deterministic affinity:

```text
sessionId → service instance
```

But failure and scaling behavior must be defined.

If the session state is not replicated or externally stored, a node failure can make the session unavailable regardless of routing correctness.

## 24. Hot-Key Limitations

Consistent hashing distributes **keys**, not necessarily **requests**.

If one key receives extreme traffic:

```text
one key → one logical owner
```

That owner can become hot.

Possible approaches include:

- replication;
- local caching;
- request coalescing;
- controlled key splitting where semantics permit.

Splitting a key can violate ordering or consistency assumptions, so it must be designed deliberately.

## 25. Rendezvous / Highest-Random-Weight Hashing

An alternative placement algorithm is **rendezvous hashing**.

For each key, score each candidate node:

```text
score = H(key, node)
```

Choose the node with the highest score.

It has useful membership-change properties and does not require an explicit ring.

A naive implementation evaluates every node, giving `O(N)` selection cost, though specialized variants can optimize this.

## 26. Consistent Hashing vs Rendezvous Hashing

| Property | Ring-Based Consistent Hashing | Rendezvous Hashing |
|---|---|---|
| Main model | Ordered hash space | Per-node score |
| Typical lookup | `O(log V)` with sorted ring | Naive `O(N)` |
| Virtual nodes | Common | Not required in same form |
| Ownership reasoning | Ring intervals | Highest score |
| Membership changes | Limited remapping | Limited remapping |
| Replication selection | Walk ring | Choose next-highest scores |

The appropriate choice depends on scale, implementation constraints, and operational requirements.

## 27. Simple Modulo vs Consistent Hashing

| Property | Modulo Partitioning | Consistent Hashing |
|---|---|---|
| Simplicity | Very high | Higher complexity |
| Lookup | `O(1)` arithmetic | Usually `O(log V)` ring search |
| Membership change | Potentially large remapping | Designed for limited remapping |
| Metadata | Minimal | Ring/vnode metadata |
| Rebalancing | Potentially expensive | More localized, but still required |
| Hot-key solution | No | No, by itself |

This is a trade-off comparison, not a universal rule that one technique should always replace the other.

## 28. Correctness Invariants

A production implementation should preserve:

### Determinism

Same ring version + same key → same owner.

### Coverage

Every key maps to an eligible owner.

### Uniqueness

A primary ownership decision selects exactly one owner under the policy.

### Membership consistency

All routing participants use compatible membership/ring state.

### Migration safety

Ownership changes do not silently lose or duplicate state under the migration protocol.

## 29. Complexity

For `V` virtual positions:

```text
ring build:     O(V log V)
routing lookup: O(log V)
metadata space: O(V)
```

Adding/removing a node requires ring metadata updates plus application-level migration.

The migration cost is determined by the amount of state that changes ownership, not simply by the ring lookup complexity.

## 30. Common Mistakes

1. Thinking consistent hashing means zero key movement.
2. Confusing placement with replication.
3. Forgetting virtual-node ownership is physical-node ownership.
4. Ignoring ring membership consistency.
5. Ignoring data migration.
6. Treating consistent hashing as a solution to hot keys.
7. Using unstable node identifiers.
8. Ignoring weighted capacity.
9. Forgetting wrap-around.
10. Ignoring hash collisions.
11. Claiming `O(1)` lookup for a binary-searched ring.
12. Assuming a cache ring solves cache invalidation.
13. Ignoring failure/recovery semantics.

## 31. Edge Cases & Failure Modes

Test:

- zero nodes;
- one node;
- two nodes;
- one virtual node;
- many virtual nodes;
- identical node IDs;
- ring-position collisions;
- wrap-around keys;
- node addition;
- node removal;
- simultaneous membership changes;
- node failure during migration;
- stale ring version;
- highly skewed key distribution;
- hot keys;
- weighted nodes.

## 32. Backend Engineering Lab

Build a simulation with:

```text
N physical nodes
V virtual nodes per physical node
K keys
```

Measure:

- ownership distribution;
- standard deviation/load skew;
- keys remapped after node addition;
- keys remapped after node removal;
- lookup latency;
- metadata size;
- migration volume.

Then compare against modulo partitioning.

## 33. AI Engineering Applications

Consistent hashing can be useful for distributing:

- embedding/vector preprocessing jobs;
- document shards;
- model-serving cache entries;
- prompt/result caches;
- feature computation state;
- inference-affinity workloads.

However, AI workloads often have large and uneven objects. Placement must consider object size and compute cost, not merely key count.

A node owning 10 keys may still be overloaded if those keys correspond to huge datasets or extremely expensive inference requests.

## 34. Problem-Solving Framework

When a distributed system needs hashing-based placement:

```text
1. What is the logical key?
2. Is stable ownership valuable?
3. How often does membership change?
4. What is the key distribution?
5. Are keys equal-cost?
6. Is the workload stateful?
7. Is replication required?
8. What happens on failure?
9. How is membership synchronized?
10. How is state migrated?
11. Are hot keys possible?
12. Would modulo, ring hashing, or rendezvous hashing fit?
```

## 35. Interview Preparation

Be able to explain:

1. Why modulo partitioning causes large remapping.
2. How a consistent-hash ring works.
3. What virtual nodes solve.
4. How node addition/removal affects ownership.
5. Why consistent hashing does not automatically migrate data.
6. Consistent hashing vs rendezvous hashing.
7. Primary ownership vs replication.
8. Hot-key limitations.
9. Ring membership consistency.
10. Weighted nodes.
11. Ring versioning.
12. Rebalancing and migration safety.
13. Complexity of ring lookup.
14. How you would benchmark distribution quality.

## 36. Revision Checklist

- [ ] I can derive modulo partitioning limitations.
- [ ] I can build a hash ring.
- [ ] I can explain successor ownership.
- [ ] I understand virtual nodes.
- [ ] I understand weighted ownership.
- [ ] I can calculate approximate key movement.
- [ ] I understand replication vs placement.
- [ ] I can reason about node failure.
- [ ] I understand membership consistency.
- [ ] I can design ring versioning.
- [ ] I understand migration/rebalancing.
- [ ] I can explain hot-key limitations.
- [ ] I can compare consistent and rendezvous hashing.
- [ ] I can benchmark distribution and remapping.

## 37. Key Takeaways

1. **Consistent hashing reduces key movement during membership changes; it does not eliminate movement.**
2. **A ring maps keys to ownership intervals in a shared hash space.**
3. **Virtual nodes improve statistical distribution and enable weighted capacity.**
4. **Placement, replication, failure detection, and data migration are separate concerns.**
5. **Membership consistency is essential: different routing views can send the same key to different owners.**
6. **Consistent hashing does not inherently solve hot keys or skewed request rates.**
7. **Ring lookup is commonly `O(log V)` with sorted virtual-node positions.**
8. **Rendezvous hashing provides an alternative membership-stable placement model.**
9. **Real distributed-system complexity lies beyond the hash calculation: migration, consistency, failure, and observability matter.**
