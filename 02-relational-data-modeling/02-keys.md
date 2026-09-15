# 02.2 — Keys

> A key is a relational mechanism for identifying rows and expressing identity and relationships precisely.

## Learning Objectives

By the end of this chapter, you should be able to:

- Explain what a key is and why relational systems need keys.
- Distinguish superkeys, candidate keys, primary keys, alternate keys, and foreign keys.
- Determine whether a set of attributes uniquely identifies a row.
- Understand composite keys and their trade-offs.
- Distinguish entity identity from a key chosen for implementation.
- Understand key constraints: uniqueness, minimality, stability, and non-null identity.
- Reason about foreign keys and referential integrity.
- Choose keys from workload and domain semantics rather than habit.
- Recognize common key-design failures in backend systems.

---

# 1. Why Keys Exist

A relational table contains rows.

The database needs a reliable way to answer:

```text
Which row is this?
```

and:

```text
Which row does this relationship refer to?
```

Keys provide that identity mechanism.

Without reliable keys, updates, deletes, relationships, and integrity become ambiguous.

---

# 2. Key Terminology

Important key concepts:

```text
Superkey
Candidate key
Primary key
Alternate key
Composite key
Foreign key
Natural key
Surrogate key
```

Natural vs surrogate keys is covered in depth in the next chapter.

---

# 3. Superkey

A superkey is any set of attributes that uniquely identifies a row.

Suppose:

```text
Customer(customer_id, email, name)
```

If `customer_id` is unique, then all of these could theoretically be superkeys:

```text
{customer_id}
{customer_id, name}
{customer_id, email}
{customer_id, email, name}
```

They all contain enough information to identify a row.

But some contain unnecessary attributes.

---

# 4. Candidate Key

A candidate key is a **minimal superkey**.

Minimal means no attribute can be removed while preserving uniqueness.

If both are guaranteed unique:

```text
customer_id
email
```

then both can be candidate keys.

The database designer chooses one as the primary key.

---

# 5. Primary Key

The primary key is the candidate key selected as the table's principal identifier.

Example:

```text
Customer
---------
customer_id  PRIMARY KEY
name
email
```

A primary key should provide stable, unambiguous row identity.

Conceptually:

```text
one row → one primary-key value
one primary-key value → at most one row
```

---

# 6. Alternate Key

A candidate key that is not selected as the primary key is an alternate key.

Example:

```text
Customer
customer_id  ← primary key
email        ← alternate/candidate key
```

If email must be unique by business rules, that uniqueness should be explicitly represented rather than assumed by application code.

---

# 7. Primary Key Properties

A good primary key generally has:

```text
Uniqueness
Non-null identity
Stability
Minimality
Predictable semantics
```

The exact implementation can vary, but the identity contract must remain clear.

---

# 8. Uniqueness

A primary key must uniquely identify each row.

Invalid:

```text
Customer
id | name
1  | A
1  | B
```

Two rows cannot share the same primary-key identity.

---

# 9. Null and Identity

Identity cannot be ambiguous.

A primary-key value therefore cannot be absent.

Conceptually:

```text
unknown identity
```

is not a usable row identifier.

This is why relational systems impose non-null semantics on primary keys.

---

# 10. Minimality

Consider:

```text
country_code
passport_number
```

If the combination uniquely identifies a person, the pair may be a candidate key.

But if `passport_number` alone is globally unique under the domain rules, then:

```text
{country_code, passport_number}
```

is a superkey but not a minimal candidate key.

Always test whether an attribute can be removed.

---

# 11. Composite Key

A composite key contains multiple attributes.

Example:

```text
Enrollment
student_id
course_id
```

The combination may uniquely identify an enrollment.

Conceptually:

```text
(student_id, course_id)
```

is the key.

Neither component alone necessarily identifies the row.

---

# 12. Why Composite Keys Matter

Composite keys naturally model relationships whose identity is defined by multiple dimensions.

Examples:

```text
WarehouseStock
(warehouse_id, product_id)

Enrollment
(student_id, course_id)

BranchProductPrice
(branch_id, product_id)
```

The choice depends on whether the combination itself represents meaningful identity.

---

# 13. Composite-Key Trade-Offs

Advantages:

- directly represents domain uniqueness,
- can prevent duplicate relationships,
- often naturally matches associative entities.

Costs:

- foreign keys become wider,
- joins carry multiple columns,
- indexes become larger,
- references from application code become more cumbersome,
- changing one component can be disruptive.

Do not choose composite keys automatically.

---

# 14. Foreign Key

A foreign key represents a relationship to another relation.

Example:

```text
Customer
customer_id

Order
order_id
customer_id  ← references Customer
```

Conceptually:

```text
Order.customer_id → Customer.customer_id
```

The foreign key says that referenced identity must satisfy the relationship's integrity rules.

---

# 15. Referential Integrity

Referential integrity prevents invalid references.

Without it, the database could contain:

```text
Order.customer_id = 999999
```

when no customer 999999 exists.

A foreign-key constraint can prevent this invalid state.

This is a major reason keys are more than naming conventions.

---

# 16. Parent and Child

In a typical one-to-many relationship:

```text
Customer 1 ─── N Order
```

Customer is the referenced/parent side.

Order is the referencing/child side.

The child stores the foreign-key reference to the parent identity.

---

# 17. Foreign Key ≠ Primary Key

A foreign key does not have to be a primary key.

Example:

```text
OrderItem
order_id
product_id
quantity
```

Both `order_id` and `product_id` can be foreign keys.

The row's own identity may be:

```text
order_item_id
```

or potentially:

```text
(order_id, product_id)
```

depending on domain rules.

---

# 18. Foreign Key to a Candidate Key

A relationship can reference a uniquely constrained candidate key, not merely the chosen primary key, where the database and design permit it.

The deeper principle is:

> A reference needs a stable, unique target identity.

This becomes important when business identifiers and technical identifiers coexist.

---

# 19. Key vs Index

Do not confuse keys with indexes.

A key expresses an integrity/identity rule.

An index is primarily an access structure used to make operations faster.

Example:

```text
PRIMARY KEY (customer_id)
```

may also result in an index, but:

```text
index on email
```

does not automatically mean email is the entity's primary identity.

---

# 20. Unique Constraint vs Primary Key

Both can enforce uniqueness, but they have different semantic roles.

```text
Primary key
= principal row identity

Unique constraint
= another value/set that must remain unique
```

Example:

```text
User
user_id     PRIMARY KEY
email       UNIQUE
username    UNIQUE
```

Here there may be multiple alternate identifiers, but one principal identity.

---

# 21. Business Identity vs Database Identity

A business may identify a product using:

```text
SKU
```

while the database uses:

```text
product_id
```

Both can be meaningful.

The distinction is:

```text
business identifier
vs
chosen relational identity
```

This distinction leads directly to natural and surrogate keys.

---

# 22. Key Stability

A key used as identity should not change casually.

Suppose:

```text
customer_id = 1042
```

is referenced by:

```text
orders
payments
support tickets
addresses
```

Changing the identity creates cascading consequences.

Stable identifiers reduce coupling.

---

# 23. Why Names Are Usually Poor Primary Keys

Names are often:

- duplicated,
- changeable,
- inconsistently formatted,
- culturally ambiguous,
- not guaranteed unique.

Therefore:

```text
customer_name
```

is usually a poor row identifier.

The same reasoning applies to many human-readable fields.

---

# 24. Email as a Key

Email may be unique in a particular system, but ask:

```text
Can the user change it?
Can an account have multiple emails?
Can email be reused after account closure?
Is uniqueness global or tenant-scoped?
```

A value can be unique today without being a good long-term identity.

Do not confuse current uniqueness with durable identity.

---

# 25. Tenant-Scoped Keys

In multi-tenant systems, uniqueness may be scoped.

For example:

```text
(tenant_id, username)
```

may be unique while:

```text
username
```

is not globally unique.

This changes the candidate-key analysis.

A key must be evaluated under the actual domain scope.

---

# 26. Scope Is Part of Uniqueness

Suppose two branches can independently use the same SKU:

```text
Branch A → SKU 100
Branch B → SKU 100
```

Then:

```text
SKU
```

is not globally unique.

Potential uniqueness may instead be:

```text
(branch_id, sku)
```

This is a crucial backend modeling skill.

---

# 27. Natural Key

A natural key is an identifier with business/domain meaning.

Examples may include:

```text
ISBN
SKU
country_code
business registration number
```

Natural-key analysis is covered deeply in 02.3.

---

# 28. Surrogate Key

A surrogate key is an identifier introduced primarily for database identity rather than because it represents a domain fact.

Examples:

```text
customer_id = 1042
UUID
```

The database may use this as the primary key while business identifiers remain separately constrained.

---

# 29. Keys in Associative Entities

Consider:

```text
Student
Course
Enrollment
```

Possible identity:

```text
(student_id, course_id)
```

This means a student can have at most one enrollment for a course.

But if the domain allows multiple enrollment attempts, that combination is insufficient.

The key depends on business rules.

---

# 30. Key Design Must Follow Cardinality and Business Rules

Suppose:

```text
Customer can have many addresses.
```

Then:

```text
customer_id
```

cannot uniquely identify an address row.

Potential identity could involve:

```text
address_id
```

or a domain-specific composite identity.

Keys cannot be designed independently of the entity model.

---

# 31. Key Dependencies

A foreign key creates dependency between identities.

Example:

```text
Order.customer_id
```

depends on the existence of the referenced customer identity.

This allows the database to reason about:

```text
who owns what
what references what
which relationships are valid
```

---

# 32. Key Selection Questions

For every candidate key ask:

```text
Is it guaranteed unique?
Is it minimal?
Is it stable?
Is it always present?
What is its scope?
Can the business change it?
Will many tables reference it?
Will it become wider over time?
Does it expose business semantics unnecessarily?
```

Do not select a key merely because it “looks unique.”

---

# 33. Key Width

Key width matters physically.

A wide primary key can affect:

- foreign keys,
- indexes,
- joins,
- cache footprint,
- storage,
- network payloads.

This does not mean “always use integers.”

It means key choice has physical consequences.

---

# 34. Sequential vs Random Identifiers

Different identifier strategies have different operational behavior.

Sequential identifiers can be compact and locality-friendly.

Random identifiers can reduce predictability and simplify distributed generation but may affect index locality and storage behavior depending on database and implementation.

These are physical trade-offs, not merely syntax choices.

---

# 35. Distributed Systems and Key Generation

In distributed systems, independent services may need to generate identifiers without a central counter.

Common conceptual strategies include:

```text
UUID-like identifiers
ULID-like time-sortable identifiers
Snowflake-style distributed identifiers
application-generated IDs
```

The correct choice depends on ordering, uniqueness, locality, interoperability, and operational requirements.

Do not treat key generation as purely a database detail.

---

# 36. Key Exposure in APIs

A database key may become an API identifier.

Example:

```text
GET /customers/1042
```

If identifiers are sequential, they may reveal information about record volume or make enumeration easier.

This does not automatically mean random IDs are required.

API security should use authorization regardless of identifier design.

---

# 37. Composite Foreign Keys

If the parent identity is composite:

```text
Parent
(tenant_id, customer_id)
```

then a child referencing it may need:

```text
Child
(tenant_id, customer_id)
```

as a composite foreign key.

This is valid, but it increases relational width and complexity.

---

# 38. Tenant ID as a Key Component

In some multi-tenant schemas, a tenant identifier is part of uniqueness:

```text
UNIQUE (tenant_id, email)
```

This means:

```text
same email in different tenants = valid
same email inside one tenant = invalid
```

Key scope must match business semantics.

---

# 39. Key and Soft Deletion

Soft deletion introduces another question:

```text
Can a deleted identifier be reused?
```

For example:

```text
username = "alex"
```

If the account is soft-deleted, can another user claim `alex`?

The answer is a business rule that affects uniqueness design.

Do not design keys without considering lifecycle rules.

---

# 40. Historical Data and Keys

Historical records need stable references.

For example:

```text
Sale → Product
```

The sale should continue to identify the product involved even if current product attributes change.

A stable entity key helps preserve that relationship.

Historical snapshots of changing attributes may still be required.

---

# 41. Key Design Example — Jewellery ERP

Consider:

```text
Product
product_id
sku
name
```

Potential identities:

```text
product_id
sku
```

If SKU is globally unique and stable, it may be a candidate key.

If SKU is branch-scoped:

```text
(branch_id, sku)
```

may be the candidate key for that context.

Do not decide until the business scope is known.

---

# 42. Key Design Example — Inventory

Suppose stock is tracked per:

```text
branch
product
```

Then one logical inventory position may be identified by:

```text
(branch_id, product_id)
```

If the system instead needs multiple lots:

```text
(branch_id, product_id, lot_id)
```

may become necessary.

Changing the granularity changes the key.

---

# 43. Key Design Example — RAG

Suppose:

```text
Chunk
chunk_id
```

and:

```text
Embedding
embedding_id
chunk_id
model_version_id
```

If one chunk can have multiple embeddings across model versions, then:

```text
(chunk_id, model_version_id)
```

may represent a candidate uniqueness constraint.

If multiple runs with the same model are valid, that combination may no longer be sufficient.

Again, business semantics determine key design.

---

# 44. Keys and Data Integrity

Keys enforce important invariants:

```text
No duplicate identity.
No missing primary identity.
No invalid referenced identity.
No duplicate values where uniqueness is required.
```

This turns the database into an active participant in correctness rather than merely storage.

---

# 45. Key Selection Failure: “Everything Gets an ID”

Giving every entity a surrogate ID can be reasonable, but it does not eliminate the need for business uniqueness.

Bad:

```text
User
id
email
```

with no uniqueness rule on email when the business says emails must be unique.

A surrogate primary key answers:

> Which row is this?

It does not answer:

> What other business facts must be unique?

---

# 46. Key Selection Failure: “Natural Key Everywhere”

Natural identifiers can change, be reused, become wider, or acquire new business semantics.

A key that looks perfect at first may become expensive to reference across a large system.

Natural-key design must account for lifecycle and coupling.

---

# 47. Key Selection Failure: Application-Only Uniqueness

This is unsafe:

```text
check if email exists
↓
insert user
```

Two concurrent requests can both pass the check.

The database should enforce the actual uniqueness constraint.

Application validation improves user experience.

Database constraints preserve correctness.

---

# 48. Key Selection Failure: Assuming Human-Readable Means Better

A readable identifier may be useful to humans:

```text
INV-2026-000123
```

But human readability does not automatically make it the best relational identity.

You may store it as a business identifier while using another primary key.

---

# 49. Key Design Workflow

Use this process:

```text
1. Identify the entity.
2. Define what makes one instance different from another.
3. List candidate unique attributes/combinations.
4. Check uniqueness scope.
5. Check minimality.
6. Check nullability.
7. Check stability.
8. Check lifecycle and reuse rules.
9. Evaluate references and key width.
10. Choose primary identity.
11. Preserve other important candidate/business uniqueness constraints.
12. Define foreign-key relationships.
13. Validate against real workflows and concurrency.
```

---

# 50. Interview Framework

When asked “What is a primary key?” avoid only saying:

> A primary key uniquely identifies a row.

A stronger answer:

> A primary key is the selected candidate key that serves as the principal identity of rows in a relation. It must provide unique, non-null identity, and its choice should consider stability, scope, reference cost, and domain semantics. Other candidate identifiers can remain alternate keys enforced through uniqueness constraints.

---

# 51. Backend Perspective

Keys influence:

- API resource identity,
- caching,
- deduplication,
- idempotency,
- database joins,
- authorization lookups,
- event correlation,
- distributed data generation.

For example, an idempotency key is not necessarily the database primary key, but both solve identity-related problems at different layers.

---

# 52. AI Perspective

AI systems frequently need stable identities for:

```text
Document
DocumentVersion
Chunk
Embedding
ModelVersion
RetrievalRun
```

Stable keys make it possible to trace:

```text
retrieval result
→ chunk
→ document version
→ source document
→ embedding model
```

This is essential for debugging, reproducibility, evaluation, and lineage.

---

# 53. The Key Mental Model

Think of keys as answering three questions:

```text
Identity:
Which entity is this?

Uniqueness:
Can another row claim the same identity?

Reference:
How can another entity safely point to it?
```

If your key design answers all three clearly, you are modeling identity correctly.

---

# Key Takeaways

1. A key identifies rows and supports relational integrity.
2. A superkey uniquely identifies but may contain unnecessary attributes.
3. A candidate key is a minimal superkey.
4. The primary key is the selected principal candidate key.
5. Other candidate keys can be alternate keys.
6. Composite keys use multiple attributes.
7. Foreign keys represent references between relations.
8. Referential integrity prevents invalid references.
9. Keys are not the same as indexes.
10. Unique constraints express additional uniqueness rules.
11. Business uniqueness and primary identity are separate concerns.
12. Key scope matters in multi-tenant and multi-branch systems.
13. Stable identity reduces coupling.
14. Composite keys are useful but have physical and application costs.
15. Natural and surrogate key trade-offs require domain analysis.
16. A surrogate key does not eliminate business uniqueness constraints.
17. Application checks cannot replace database uniqueness constraints under concurrency.
18. Key choice affects backend performance, APIs, and distributed systems.
19. AI systems need stable identities for lineage and reproducibility.
20. Key design must follow entity semantics and business rules.

---

# Revision Checklist

- [ ] I can define a superkey.
- [ ] I can define a candidate key.
- [ ] I can explain minimality.
- [ ] I can define a primary key.
- [ ] I can define an alternate key.
- [ ] I can define a composite key.
- [ ] I can define a foreign key.
- [ ] I understand referential integrity.
- [ ] I understand key scope.
- [ ] I can identify candidate keys from requirements.
- [ ] I can distinguish keys from indexes.
- [ ] I can distinguish primary identity from business uniqueness.
- [ ] I understand why key stability matters.
- [ ] I can reason about composite foreign keys.
- [ ] I can reason about tenant-scoped uniqueness.
- [ ] I understand key implications in APIs.
- [ ] I can reason about keys in associative entities.
- [ ] I can model keys for inventory.
- [ ] I can model keys for AI/RAG lineage.
- [ ] I can defend a key choice in an interview.
