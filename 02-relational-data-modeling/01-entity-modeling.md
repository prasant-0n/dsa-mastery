# 02.1 — Entity Modeling

> Entity modeling is the process of turning a real-world domain into a precise data model: identifying things that matter, their attributes, their relationships, and the rules that govern those relationships.

## Learning Objectives

By the end of this chapter, you should be able to:

- Identify entities from a real-world problem.
- Distinguish entities from attributes and events.
- Define entity boundaries and identity.
- Model attributes without prematurely designing tables.
- Identify relationships and relationship cardinality.
- Distinguish one-to-one, one-to-many, and many-to-many relationships.
- Model associative entities for relationships with their own data.
- Separate current state from historical events.
- Detect derived and redundant data.
- Translate a conceptual model into relational structures.
- Avoid common modeling mistakes that create ambiguity, duplication, and inconsistent state.

---

# 1. What Is Data Modeling?

Data modeling is the process of deciding:

```text
What information exists?
What does each piece of information mean?
How are pieces of information related?
What rules must always remain true?
How should the information be represented?
```

A database is not merely a collection of fields.

It is a representation of a domain and its rules.

For example, an e-commerce system may contain:

```text
Customer
Product
Order
Order Item
Payment
Shipment
```

The important work is not naming these objects.

The important work is defining:

```text
what each one represents
who/what owns it
how it relates to other entities
what facts belong to it
what rules govern those relationships
```

---

# 2. Why Entity Modeling Matters

Poor modeling creates problems that application code eventually has to compensate for.

Examples:

```text
duplicate customer information
inconsistent addresses
ambiguous ownership
invalid relationships
impossible states
update anomalies
complex queries
fragile application logic
```

Good modeling moves important correctness rules closer to the data itself.

A strong relational design begins with a strong conceptual model.

---

# 3. Entity: The Core Concept

An entity is a distinct thing, concept, or occurrence about which the system needs to maintain information.

Examples:

```text
Customer
Product
Order
Employee
Branch
Account
Invoice
Shipment
```

The key idea is **distinct identity**.

If the system needs to distinguish one instance from another, that is strong evidence that an entity exists.

---

# 4. Entity vs Real-World Object

Not every real-world object deserves an entity.

Suppose a company sells products.

The physical cardboard box used for packaging may exist in reality, but if the system never needs to track individual boxes, it may not belong in the data model.

Model what the system needs to reason about, not everything that physically exists.

---

# 5. Entity vs Attribute

An entity is something the system distinguishes.

An attribute describes an entity.

Example:

```text
Customer
├── customer_id
├── name
├── email
└── phone
```

Here:

```text
Customer = entity
name      = attribute
email     = attribute
phone     = attribute
```

A common mistake is turning every noun into an entity.

---

# 6. Entity vs Value

Consider:

```text
Customer
Address
```

Whether `Address` should be an independent entity depends on the domain.

If an address is simply a descriptive value belonging to a customer, it may be modeled as attributes or a value structure.

If addresses have independent identity, lifecycle, reuse, history, or relationships, they may deserve their own entity.

The correct question is:

> Does this concept need independent identity and behavior in the system?

---

# 7. Entity Identity

Two records represent different entity instances when the system must distinguish them.

For example:

```text
Customer A
Customer B
```

Even if they have the same name, they may represent different customers.

Therefore:

```text
name ≠ identity
```

Identity becomes especially important in the next chapter on keys.

---

# 8. Entity Attributes

Attributes describe facts about an entity.

For a product:

```text
Product
├── product_id
├── name
├── category
├── weight
└── active
```

Each attribute should have a clear semantic meaning.

Avoid vague fields such as:

```text
info
metadata
data
value
misc
```

unless their semantics are explicitly defined.

---

# 9. Atomic Meaning

An attribute should represent a well-defined fact.

For example:

```text
full_address = "12 Main Street, Hyderabad, Telangana"
```

may hide multiple facts:

```text
street
city
state
postal_code
country
```

Whether those should be separate attributes depends on the operations required by the system.

If the application frequently searches by city or postal code, a single opaque string is a poor representation.

---

# 10. Attribute Design Is Workload-Dependent

There is no universal rule that every real-world concept must be decomposed maximally.

Ask:

```text
Will this value be searched?
Filtered?
Sorted?
Validated separately?
Updated separately?
Related to another entity?
Used in constraints?
```

Model attributes according to the semantic contract and required operations.

Do not denormalize simply because “one field is easier.”

---

# 11. Entity Boundaries

Entity boundaries define what belongs together.

Suppose an order contains:

```text
Order
├── order date
├── customer
├── items
└── payment
```

This does not mean all information should become one giant entity.

An order and a payment usually have different:

- identity,
- lifecycle,
- state transitions,
- business rules,
- relationships.

That suggests separate entities.

---

# 12. Lifecycle as an Entity Signal

A concept is more likely to deserve an entity if it has its own lifecycle.

Example:

```text
Order
created → confirmed → shipped → delivered → cancelled
```

The order has state transitions.

Similarly:

```text
Payment
initiated → authorized → captured → refunded
```

Payment has its own lifecycle.

Independent lifecycle is strong evidence of an independent entity.

---

# 13. Ownership

Ask:

> Which entity owns this fact?

For example:

```text
Customer.email
```

belongs to Customer.

But:

```text
Order.shipping_address
```

may belong to the Order context if the historical shipping destination must remain unchanged even after the customer's current address changes.

Ownership is a semantic decision, not merely a table-placement decision.

---

# 14. Current State vs Historical Fact

This distinction is critical.

Suppose a customer changes their address.

Current state:

```text
Customer.current_address
```

Historical fact:

```text
Order.shipping_address_at_purchase
```

These are different facts.

A historical transaction should generally not change merely because the current customer profile changes.

---

# 15. Relationships

Entities rarely exist independently.

A relationship describes how entities are connected.

Examples:

```text
Customer places Order
Order contains Product
Employee works at Branch
Student enrolls in Course
```

A relationship should be expressed as a meaningful business statement.

---

# 16. Relationship Direction

A relationship can be described from either side.

Example:

```text
Customer places Order
```

Equivalent perspective:

```text
Order belongs to Customer
```

The database representation may store the relationship once, while application queries can traverse it in either direction.

---

# 17. Cardinality

Cardinality describes how many instances can participate in a relationship.

Common forms:

```text
1 : 1
1 : N
N : 1
N : M
```

Examples:

```text
Customer 1 ─── N Order
Order    1 ─── N OrderItem
Product  1 ─── N OrderItem
Student  N ─── M Course
```

Cardinality is one of the most important decisions in entity modeling.

---

# 18. One-to-One

One entity instance corresponds to at most one instance of another entity.

Example:

```text
Person 1 ─── 1 Passport
```

But always question whether both sides truly need independent identity.

Sometimes what looks like 1:1 is actually one entity with optional attributes.

---

# 19. One-to-Many

One parent can be associated with many child records.

Example:

```text
Customer 1 ─── N Orders
```

One customer may place many orders.

The relational representation commonly places the reference to the one-side entity in the many-side relation.

Conceptually:

```text
orders.customer_id → customer
```

The exact key design comes later.

---

# 20. Many-to-Many

Many instances on each side can be related to many instances on the other side.

Example:

```text
Student N ─── M Course
```

A student can take many courses.

A course can contain many students.

Relational databases generally represent this relationship through an associative entity/relation.

```text
Student
Course
Enrollment
```

---

# 21. Associative Entity

An associative entity represents a relationship that needs its own data.

Example:

```text
Student
Course
Enrollment
```

`Enrollment` may contain:

```text
enrollment_date
grade
status
completion_date
```

These facts describe the student's participation in the course, not the student alone or the course alone.

This is a fundamental modeling insight:

> If a relationship has attributes of its own, the relationship often deserves an entity.

---

# 22. Relationship Attributes

Consider:

```text
Employee works at Branch
```

If the system only needs to know the current assignment, a direct relationship may be enough.

But if it needs:

```text
start_date
end_date
role_at_branch
allocation_percentage
```

then the assignment itself has data.

Model:

```text
Employee
Branch
EmployeeBranchAssignment
```

---

# 23. Optionality

Cardinality answers “how many?”

Optionality answers “must one exist?”

Examples:

```text
Customer may have 0..N Orders
Order must have exactly 1 Customer
```

or:

```text
Employee may have 0..1 ParkingPermit
```

Distinguishing:

```text
0..1
1..1
0..N
1..N
```

is essential for correct modeling.

---

# 24. Mandatory Relationships

If an order cannot exist without a customer, the conceptual rule is:

```text
Order → exactly one Customer
```

This is stronger than merely saying “orders are related to customers.”

The stronger rule should eventually be enforced by the relational schema where practical.

---

# 25. Optional Relationships

An optional relationship is valid when the domain permits absence.

Example:

```text
Employee 0..1 Manager
```

A top-level executive may have no manager.

Do not use nullability merely because it is convenient.

Ask whether the absence has a legitimate domain meaning.

---

# 26. Entity vs Event

Events are occurrences in time.

Examples:

```text
OrderPlaced
PaymentCaptured
ShipmentDispatched
StockAdjusted
```

An event can deserve an entity when the system needs to retain its occurrence as historical data.

An event is different from current state.

```text
current inventory = 50
```

is not the same fact as:

```text
inventory adjustment +10 at time T
```

---

# 27. State vs Event Modeling

A state tells you:

```text
What is true now?
```

An event tells you:

```text
What happened?
```

For auditing and financial systems, events are often important because current state alone may lose historical information.

A mature model may store both:

```text
current state
+
immutable historical events
```

---

# 28. Derived Attributes

A derived attribute can be calculated from other facts.

Example:

```text
Order.total_amount
```

may be derived from order items:

```text
Σ(quantity × unit_price)
```

Ask whether storing the derived value is necessary.

Benefits of storing it:

- faster reads,
- historical snapshot,
- easier reporting.

Costs:

- synchronization,
- stale values,
- update complexity.

---

# 29. Stored Fact vs Derived Fact

Suppose:

```text
quantity = 5
unit_price = 100
```

Then:

```text
total = 500
```

If `total` is simply recomputed from current values, it is derived.

But a finalized invoice may intentionally store the charged total as a historical financial fact.

Therefore “derived” depends on the semantic meaning, not just the arithmetic formula.

---

# 30. Redundant Attributes

Redundancy means storing the same logical fact in multiple places.

Example:

```text
Order.customer_id
Order.customer_email
Customer.email
```

If `Order.customer_email` is intended to always mean the customer's current email, this duplicates the same fact.

If it means the email used at order time, it may be a legitimate historical snapshot.

Never judge redundancy without understanding semantics.

---

# 31. Entity Naming

Names should be:

- unambiguous,
- stable,
- domain-oriented,
- consistent.

Prefer:

```text
Customer
PurchaseOrder
OrderItem
Shipment
```

over vague names such as:

```text
Data
Record
Info
Details
Object
```

Naming quality affects every layer built on top of the model.

---

# 32. Entity Discovery From Requirements

Take a requirement:

> A customer places orders. Each order contains products. Products belong to categories. Orders are shipped to an address.

Candidate nouns:

```text
Customer
Order
Product
Category
Address
```

Do not immediately create five tables.

Classify each candidate:

```text
entity?
attribute?
value?
event?
relationship?
derived fact?
```

Then determine identity and lifecycle.

---

# 33. Verb Analysis

Verbs often reveal relationships.

Example:

```text
Customer places Order
Product belongs to Category
Order contains Product
Warehouse stores Product
```

Nouns suggest candidates.

Verbs suggest relationships.

But natural language is only a starting point; domain semantics decide the final model.

---

# 34. Entity Discovery Questions

For every candidate concept, ask:

```text
1. Does the system need to store information about it?
2. Can two instances be distinguished?
3. Does it have an independent lifecycle?
4. Does it participate in relationships?
5. Can other entities refer to it?
6. Does it have attributes of its own?
7. Does it need historical tracking?
8. Can it exist independently?
9. Does deleting another object destroy its meaning?
10. Is it really just a value or attribute?
```

These questions prevent premature table design.

---

# 35. Weak Entity Intuition

Some concepts have meaning only in the context of another entity.

Example:

```text
OrderItem
```

An order item may not have meaningful existence outside an order.

Its identity may depend on the order and a product or on an assigned identifier plus ownership.

This is sometimes called a weak/dependent entity conceptually.

The exact key strategy belongs to the keys phase.

---

# 36. Ownership and Deletion Semantics

Ask:

> What happens to this concept if its parent disappears?

Examples:

```text
Order → OrderItem
```

If an order is deleted, do its items lose meaning?

Usually yes.

But:

```text
Customer → Product
```

does not necessarily imply that deleting a customer should delete products.

Ownership affects lifecycle and referential rules.

---

# 37. Temporal Thinking

Some relationships change over time.

Example:

```text
Employee works at Branch A
Employee works at Branch B
```

If only the current branch matters:

```text
Employee.current_branch
```

If history matters:

```text
EmployeeBranchAssignment
├── employee
├── branch
├── start_date
└── end_date
```

The requirement “history matters” can fundamentally change the entity model.

---

# 38. Multi-Context Data

The same real-world fact can have different meanings in different contexts.

Example:

```text
Customer.address
Order.shipping_address
Invoice.billing_address
```

These may refer to the same physical location, but they represent different business facts.

Do not collapse them merely because their values look similar.

Semantic identity matters more than textual similarity.

---

# 39. Entity Modeling Example — Jewellery ERP

Consider a jewellery business domain.

Possible entities:

```text
Customer
Branch
Product
ProductVariant
Stock
Purchase
Sale
SaleItem
Supplier
Payment
Employee
```

But “gold purity” may initially be an attribute of a product or item.

Later, if purity has independent rules, rates, classifications, or relationships, the model may evolve toward a separate entity such as `Purity`.

The correct model is driven by domain behavior and required operations.

---

# 40. Jewellery ERP: Transaction vs Current Inventory

Consider a sale.

The sale is a historical transaction:

```text
Sale
SaleItem
Payment
```

Current stock is state:

```text
Stock
```

A sale may cause stock to change, but:

```text
Sale ≠ Stock
```

The transaction explains what happened.

Stock represents the resulting current state.

This distinction is critical for auditability and reconciliation.

---

# 41. Entity Modeling for Backend Systems

A backend service should not invent domain entities merely to match API endpoints.

For example:

```text
POST /orders
```

does not mean:

```text
CreateOrderRequest = Order entity
```

A request DTO is an application-layer representation.

The domain entity represents persistent/business identity.

Keep these concepts distinct.

---

# 42. Entity vs DTO vs View

These are different concepts:

```text
Entity
= domain/persistent identity

DTO
= data transferred between application boundaries

View/read model
= data shaped for a particular query/use case
```

A single entity may produce many DTOs.

A DTO may combine data from many entities.

Do not design your database solely around API response shapes.

---

# 43. Entity Modeling and AI Systems

AI systems also require careful entities.

For a RAG platform, possible entities include:

```text
Document
DocumentVersion
Chunk
Embedding
Collection
Source
RetrievalRun
```

A vector embedding is not necessarily the same conceptual entity as the document that produced it.

If embeddings can be regenerated, versioned, or generated by different models, their lifecycle may justify independent modeling.

---

# 44. AI: Document vs Chunk

A document can contain many chunks:

```text
Document 1 ─── N Chunk
```

A chunk may have:

```text
position
text
token_count
embedding
metadata
```

If chunk identity and lifecycle matter independently, `Chunk` should not simply disappear into an unstructured document field.

---

# 45. AI: Embedding as a Contextual Fact

An embedding depends on:

```text
source content
embedding model
model version
chunk
creation time
```

If the same chunk is embedded by multiple models:

```text
Chunk 1
├── Embedding using Model A
└── Embedding using Model B
```

The embedding record may therefore be a separate entity associated with both chunk and model/version.

---

# 46. Avoid Table-First Thinking

A common beginner process is:

```text
Requirement
↓
create table
↓
add columns
↓
add foreign keys
```

A stronger process is:

```text
Requirement
↓
identify domain concepts
↓
define semantics
↓
identify identity
↓
identify relationships
↓
define cardinality/optionality
↓
identify lifecycle/history
↓
then design relational structures
```

This is conceptual modeling before physical schema design.

---

# 47. Conceptual → Logical → Physical

Three useful levels:

### Conceptual model

What exists in the domain?

```text
Customer ─── Order
```

### Logical model

What entities, attributes, keys, and relationships represent it?

```text
Customer(customer_id, ...)
Order(order_id, customer_id, ...)
```

### Physical model

How will a specific database implement it?

```text
PostgreSQL types
indexes
partitions
storage settings
constraints
```

Do not jump directly to physical details before understanding the conceptual model.

---

# 48. Common Modeling Mistake: One Giant Table

A beginner may model:

```text
Order
customer_name
customer_email
product_1
product_2
product_3
...
```

Problems include:

- repeating groups,
- arbitrary limits,
- duplication,
- difficult querying,
- update anomalies.

The correct conceptual model is closer to:

```text
Customer
Order
OrderItem
Product
```

Normalization and relational design will formalize this later.

---

# 49. Common Modeling Mistake: Everything Is an Entity

Creating entities for every small concept creates unnecessary complexity.

Example:

```text
CustomerName
CustomerEmail
CustomerPhone
```

These are normally attributes, not entities.

Entity status should be justified by identity, lifecycle, relationships, or independent business meaning.

---

# 50. Common Modeling Mistake: Entity = Table

An entity is a conceptual domain construct.

A table is a relational implementation structure.

Usually they map closely, but not always.

A conceptual model should remain understandable even before choosing PostgreSQL, MySQL, or another database engine.

---

# 51. Common Modeling Mistake: Relationship = Column

A relationship is a conceptual connection.

A foreign key is one relational implementation of that connection.

Think:

```text
conceptual relationship
        ↓
logical association
        ↓
foreign key / associative relation
```

This distinction becomes important when relationships become many-to-many or carry their own attributes.

---

# 52. Common Modeling Mistake: Confusing Similar Values

Two fields may contain the same string but represent different facts.

Example:

```text
Customer.email
Order.email
```

If one means current contact information and the other means email used during purchase, they are not duplicates semantically.

Model meaning, not just data type.

---

# 53. Common Modeling Mistake: Ignoring Time

Ask:

```text
Is this fact current?
Was it true at a particular point in time?
Can it change?
Must old records preserve the old value?
```

Transactions, pricing, addresses, permissions, assignments, and statuses often require temporal thinking.

---

# 54. Common Modeling Mistake: Modeling UI Instead of Domain

A screen may show:

```text
Customer + Orders + Last Payment + Address
```

That does not mean one database entity contains all those facts.

The UI is a projection.

The database should model domain facts and relationships.

---

# 55. Entity Modeling Workflow

Use this process:

```text
1. Read requirements.
2. Highlight domain nouns.
3. Highlight meaningful verbs.
4. List candidate concepts.
5. Classify each as entity/attribute/value/event/relationship.
6. Identify independent identity.
7. Identify lifecycle.
8. Identify ownership.
9. Identify relationships.
10. Determine cardinality.
11. Determine optionality.
12. Identify relationship attributes.
13. Identify historical vs current facts.
14. Identify derived facts.
15. Remove unjustified redundancy.
16. Draw conceptual model.
17. Validate against real workflows.
18. Only then move toward logical schema design.
```

---

# 56. Validation Questions

A model is not complete because it looks clean.

Validate it with workflows.

Ask:

```text
Can a new entity be created?
Can it be updated?
Can it be deleted?
Can it exist independently?
Can the required relationships be represented?
Can historical facts remain correct?
Can important queries be answered?
Can invalid states be prevented?
Can concurrent operations preserve the domain rules?
```

A model should survive realistic scenarios, not only diagram review.

---

# 57. Interview Framework

If asked “How would you model this system?”:

```text
1. Clarify the domain.
2. Identify core entities.
3. Explain why each is an entity.
4. Identify important attributes.
5. Explain relationships.
6. State cardinality and optionality.
7. Identify associative entities.
8. Separate current state from historical facts.
9. Discuss identity.
10. Discuss constraints.
11. Validate using major workflows.
12. Only then discuss physical schema/indexes.
```

Avoid starting with:

> “I will create these tables...”

Start with:

> “The core domain concepts are...”

---

# 58. Key Takeaways

1. Entity modeling is about domain meaning, not table creation.
2. An entity represents a concept the system needs to distinguish and reason about.
3. Not every noun is an entity.
4. Identity, lifecycle, relationships, and independent business meaning are strong entity signals.
5. Attributes describe entities.
6. Relationships describe connections between entities.
7. Cardinality tells how many instances can participate.
8. Optionality tells whether participation is required.
9. Many-to-many relationships commonly require associative entities.
10. A relationship with its own attributes often deserves an entity.
11. Current state and historical events are different kinds of facts.
12. Derived values should not be stored blindly.
13. Redundancy must be judged semantically, not merely by identical values.
14. Ownership determines lifecycle and deletion semantics.
15. Conceptual, logical, and physical models are different abstraction levels.
16. API DTOs and database entities are not the same thing.
17. Entity modeling should be validated against real workflows.
18. Backend systems need models that reflect business rules rather than UI screens.
19. AI systems also contain entities, relationships, versions, and lifecycle state.
20. Good relational schema design begins with a correct conceptual model.

---

# Revision Checklist

- [ ] I can define an entity precisely.
- [ ] I can distinguish entity, attribute, value, event, and relationship.
- [ ] I can justify why a concept deserves independent identity.
- [ ] I understand entity boundaries.
- [ ] I can identify one-to-one relationships.
- [ ] I can identify one-to-many relationships.
- [ ] I can identify many-to-many relationships.
- [ ] I understand associative entities.
- [ ] I understand cardinality and optionality.
- [ ] I can identify relationship attributes.
- [ ] I can distinguish current state from historical facts.
- [ ] I can identify derived attributes.
- [ ] I can reason about redundancy semantically.
- [ ] I understand ownership and lifecycle.
- [ ] I can separate conceptual, logical, and physical modeling.
- [ ] I do not design tables directly from UI screens.
- [ ] I can model a transaction independently from resulting current state.
- [ ] I can model entities in a backend domain.
- [ ] I can model entities in an AI/RAG domain.
- [ ] I can explain an entity model clearly in an interview.
