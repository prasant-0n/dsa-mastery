// 02.1 — Entity Modeling Exercises
//
// Keep all exercises unsolved.
// Focus on conceptual modeling before writing SQL.
// For every exercise, identify entities, attributes, relationships,
// cardinality, optionality, lifecycle, ownership, and historical facts.

// -----------------------------------------------------------------------------
// Exercise 01 — Entity or Attribute?
// -----------------------------------------------------------------------------
// Classify each concept as an entity, attribute, value, event, or relationship:
//
// Customer
// Customer Name
// Email Address
// Order
// Order Placed
// Product
// Shipping Address
// Payment
// Payment Captured
// Category
//
// Explain the reasoning for every classification.

// -----------------------------------------------------------------------------
// Exercise 02 — Candidate Entity Extraction
// -----------------------------------------------------------------------------
// Requirement:
// "A customer can place many orders. Each order contains multiple products.
// Products belong to categories. Customers may have multiple addresses."
//
// Extract candidate entities.
// Then eliminate concepts that should not be independent entities.

// -----------------------------------------------------------------------------
// Exercise 03 — Cardinality
// -----------------------------------------------------------------------------
// Determine cardinality and optionality for:
//
// A. Customer → Order
// B. Order → OrderItem
// C. Product → OrderItem
// D. Category → Product
// E. Customer → Address
//
// Express each relationship using forms such as 0..1, 1..1, 0..N, 1..N.

// -----------------------------------------------------------------------------
// Exercise 04 — Many-to-Many
// -----------------------------------------------------------------------------
// Model:
// "Students can enroll in many courses and each course can have many students."
//
// Identify the associative entity.
//
// Then identify attributes that belong to the relationship rather than either
// endpoint entity.

// -----------------------------------------------------------------------------
// Exercise 05 — Relationship With Attributes
// -----------------------------------------------------------------------------
// Requirement:
// "An employee can work at multiple branches. For each branch assignment,
// the company records the start date, end date, role, and allocation percentage."
//
// Determine whether the relationship should become an entity.
// Explain why.

// -----------------------------------------------------------------------------
// Exercise 06 — Current State vs History
// -----------------------------------------------------------------------------
// A customer changes their address several times. Orders must preserve the
// shipping address used when each order was placed.
//
// Model the relevant entities and facts.
//
// Explain why simply referencing the customer's current address is insufficient.

// -----------------------------------------------------------------------------
// Exercise 07 — Derived Attribute
// -----------------------------------------------------------------------------
// An order contains quantity and unit price for every item.
//
// Determine whether order total is:
// - a derived value,
// - a stored fact,
// - or potentially both depending on business semantics.
//
// Explain the difference between a calculated current total and a finalized
// historical financial amount.

// -----------------------------------------------------------------------------
// Exercise 08 — Entity Boundary
// -----------------------------------------------------------------------------
// Consider an Order containing:
// - customer information,
// - product information,
// - payment information,
// - shipment information.
//
// Decide which concepts deserve independent entities.
//
// Justify each boundary using identity, lifecycle, ownership, and relationships.

// -----------------------------------------------------------------------------
// Exercise 09 — Weak/Dependent Entity
// -----------------------------------------------------------------------------
// Model an OrderItem that has no meaningful existence outside an Order.
//
// Explain:
// - why it may be a dependent entity,
// - what lifecycle it follows,
// - what happens when its parent order is removed.
//
// Do not choose a final key strategy yet.

// -----------------------------------------------------------------------------
// Exercise 10 — One-to-One Analysis
// -----------------------------------------------------------------------------
// Consider:
// Person ↔ Passport
//
// Determine whether both concepts need independent identity.
//
// Then compare this with:
// User ↔ UserProfile
//
// Explain when a one-to-one relationship may actually be better represented as
// one entity with optional attributes.

// -----------------------------------------------------------------------------
// Exercise 11 — Event vs State
// -----------------------------------------------------------------------------
// A warehouse currently has 500 units of a product.
// During the day, the following occur:
// - +100 received,
// - -20 sold,
// - -5 damaged.
//
// Model:
// A. current inventory state,
// B. inventory adjustment events.
//
// Explain why current quantity alone cannot reconstruct the historical events.

// -----------------------------------------------------------------------------
// Exercise 12 — Natural Language to Domain Model
// -----------------------------------------------------------------------------
// Requirement:
// "A supplier supplies products to warehouses. A warehouse stores many products.
// Each purchase creates a purchase transaction containing multiple line items.
// Payments can be made against purchases."
//
// Extract:
// - entities,
// - relationships,
// - cardinalities,
// - likely transaction entities.

// -----------------------------------------------------------------------------
// Exercise 13 — Redundancy or Historical Snapshot?
// -----------------------------------------------------------------------------
// Consider:
//
// Customer.email
// Order.customer_id
// Order.customer_email
//
// Determine two different semantic interpretations for customer_email:
// A. current contact email,
// B. email captured at order time.
//
// Explain why the modeling decision changes between A and B.

// -----------------------------------------------------------------------------
// Exercise 14 — UI vs Domain
// -----------------------------------------------------------------------------
// A dashboard displays:
// - customer name,
// - current balance,
// - latest order,
// - latest payment,
// - branch name.
//
// Design the underlying conceptual entities without creating a "Dashboard"
// entity simply because the UI displays the combined information.

// -----------------------------------------------------------------------------
// Exercise 15 — Jewellery ERP Modeling
// -----------------------------------------------------------------------------
// Model the following domain:
//
// "A jewellery business has branches. Customers purchase jewellery items.
// Each sale contains multiple sale items. Items have purity and weight.
// Payments may be made against a sale. Stock changes when items are sold or
// received."
//
// Identify the core entities and explain which concepts represent transactions,
// current state, and reusable master data.

// -----------------------------------------------------------------------------
// Exercise 16 — Historical Pricing
// -----------------------------------------------------------------------------
// A product's current selling price changes over time, but finalized sales must
// retain the price actually charged.
//
// Model the entities/facts required to support both:
// - current product pricing,
// - historical transaction pricing.
//
// Explain why reading the current product price cannot reconstruct old sales.

// -----------------------------------------------------------------------------
// Exercise 17 — AI/RAG Entity Modeling
// -----------------------------------------------------------------------------
// Model a RAG platform containing:
// - documents,
// - document versions,
// - chunks,
// - embeddings,
// - embedding models,
// - collections.
//
// Identify entities, relationships, cardinality, and independent lifecycles.

// -----------------------------------------------------------------------------
// Exercise 18 — Embedding Lifecycle
// -----------------------------------------------------------------------------
// A chunk can be embedded using multiple model versions.
// A model version can produce embeddings for many chunks.
//
// Determine whether the embedding itself should be modeled independently.
//
// Identify the relationship and its important attributes.

// -----------------------------------------------------------------------------
// Exercise 19 — Workflow Validation
// -----------------------------------------------------------------------------
// Take any conceptual model you created above.
//
// Validate it against these workflows:
// 1. create the main entity,
// 2. create related entities,
// 3. update current state,
// 4. create a transaction,
// 5. preserve historical facts,
// 6. query related records,
// 7. remove/deactivate an entity.
//
// Identify any workflow that the model cannot represent cleanly.

// -----------------------------------------------------------------------------
// Exercise 20 — Full Entity Modeling Challenge
// -----------------------------------------------------------------------------
// Design a conceptual model for a multi-branch commerce system.
//
// Requirements:
// - customers,
// - branches,
// - employees,
// - products,
// - suppliers,
// - inventory,
// - purchases,
// - sales,
// - payments,
// - shipments,
// - historical pricing,
// - inventory movements.
//
// Your deliverable must include:
//
// 1. Entity list.
// 2. Purpose of every entity.
// 3. Important attributes.
// 4. Relationships.
// 5. Cardinality.
// 6. Optionality.
// 7. Ownership.
// 8. Lifecycle.
// 9. Current state vs historical events.
// 10. Derived values.
// 11. Potential redundancy.
// 12. Associative entities.
// 13. Conceptual diagram in text or Mermaid.
// 14. Three realistic workflows used to validate the model.
//
// Do not design indexes or database-specific types yet.
//
// -----------------------------------------------------------------------------
// Revision Check
// -----------------------------------------------------------------------------
// [ ] I can identify entities from requirements.
// [ ] I can distinguish entities from attributes.
// [ ] I can distinguish entities from values.
// [ ] I can distinguish entities from events.
// [ ] I can identify meaningful relationships.
// [ ] I can determine cardinality.
// [ ] I can determine optionality.
// [ ] I can identify associative entities.
// [ ] I can recognize independent lifecycle as an entity signal.
// [ ] I can reason about ownership.
// [ ] I can separate current state from historical facts.
// [ ] I can identify derived data.
// [ ] I can detect semantic redundancy.
// [ ] I can distinguish conceptual entities from DTOs/views.
// [ ] I can model transaction entities separately from resulting state.
// [ ] I can validate a model using real workflows.
// [ ] I can model a commerce/jewellery domain.
// [ ] I can model a RAG/AI domain.
// [ ] I can avoid table-first thinking.
// [ ] I can explain and defend my entity model before discussing SQL.
