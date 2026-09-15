// 02.2 — Keys Exercises
// Keep all exercises unsolved.
// Focus on reasoning about identity, uniqueness, scope, and references.

// -----------------------------------------------------------------------------
// Exercise 01 — Superkey vs Candidate Key
// -----------------------------------------------------------------------------
// Given:
// Customer(customer_id, email, name, phone)
//
// Assume customer_id and email are both guaranteed unique.
//
// List several possible superkeys.
// Identify the candidate keys.
// Explain why some superkeys are not candidate keys.

// -----------------------------------------------------------------------------
// Exercise 02 — Choose the Primary Key
// -----------------------------------------------------------------------------
// A User entity has:
// - user_id: system-generated integer
// - email: unique today, but users may change it
// - username: unique within a tenant
//
// Propose a primary key.
// Identify alternate/business uniqueness constraints.
// Explain your reasoning.

// -----------------------------------------------------------------------------
// Exercise 03 — Composite Candidate Key
// -----------------------------------------------------------------------------
// A warehouse stores products.
// A product can appear only once in a warehouse's current stock position.
//
// Candidate attributes:
// warehouse_id
// product_id
// quantity
//
// Determine the candidate key and explain why quantity is not part of identity.

// -----------------------------------------------------------------------------
// Exercise 04 — Scope of Uniqueness
// -----------------------------------------------------------------------------
// Two branches may independently assign the same SKU.
//
// Example:
// Branch A → SKU-100
// Branch B → SKU-100
//
// Determine whether SKU alone is a candidate key.
// If not, identify a possible composite uniqueness rule.

// -----------------------------------------------------------------------------
// Exercise 05 — Foreign Key Reasoning
// -----------------------------------------------------------------------------
// Model:
// Customer 1 ─── N Order
//
// Identify:
// - referenced entity,
// - referencing entity,
// - primary identity,
// - foreign-key attribute.
//
// Explain what invalid database state the foreign key prevents.

// -----------------------------------------------------------------------------
// Exercise 06 — Primary Key vs Unique Constraint
// -----------------------------------------------------------------------------
// A User table contains:
// user_id
// email
// username
//
// Business rules:
// - user_id identifies the row,
// - email must be unique,
// - username must be unique within tenant.
//
// Identify the primary key and the additional uniqueness rules.

// -----------------------------------------------------------------------------
// Exercise 07 — Composite Key
// -----------------------------------------------------------------------------
// Enrollment contains:
// student_id
// course_id
// enrollment_date
// grade
//
// Assume a student can enroll in a course only once.
// Determine a candidate key.
// Explain why enrollment_date and grade should not be identity components.

// -----------------------------------------------------------------------------
// Exercise 08 — Multiple Enrollment Attempts
// -----------------------------------------------------------------------------
// Change the previous requirement:
// "A student may enroll in the same course multiple times in different terms."
//
// Reconsider the candidate key.
// What additional domain attribute may be required?
//
// Explain why the previous key is no longer sufficient.

// -----------------------------------------------------------------------------
// Exercise 09 — Candidate Key Minimality
// -----------------------------------------------------------------------------
// Suppose passport_number is globally unique.
//
// Evaluate these sets:
// {passport_number}
// {country_code, passport_number}
// {country_code, passport_number, name}
//
// Classify each as superkey/candidate key and explain minimality.

// -----------------------------------------------------------------------------
// Exercise 10 — Natural Identifier Stability
// -----------------------------------------------------------------------------
// A company wants to use customer email as the primary key.
//
// Analyze:
// - email changes,
// - reused email addresses,
// - multiple emails per customer,
// - historical references,
// - tenant scope.
//
// Decide whether email is a strong primary identity.
//
// Do not answer from habit; reason from the stated rules.

// -----------------------------------------------------------------------------
// Exercise 11 — Alternate Key
// -----------------------------------------------------------------------------
// Product has:
// product_id
// sku
// name
//
// Assume sku is guaranteed unique and stable.
//
// If product_id is selected as the primary key, classify sku.
// Explain why the uniqueness of sku should still be enforced.

// -----------------------------------------------------------------------------
// Exercise 12 — Composite Foreign Key
// -----------------------------------------------------------------------------
// Parent entity:
// Customer(tenant_id, customer_id, ...)
//
// Rule:
// customer_id is unique only within tenant.
//
// Design the conceptual foreign-key reference from Order to Customer.
//
// Explain why referencing customer_id alone would be unsafe.

// -----------------------------------------------------------------------------
// Exercise 13 — Associative Entity Key
// -----------------------------------------------------------------------------
// Model:
// Student N ─── M Course
//
// Requirement A:
// A student can enroll in a course only once.
//
// Requirement B:
// A student can have multiple enrollment attempts.
//
// Compare possible key strategies for Enrollment under A and B.

// -----------------------------------------------------------------------------
// Exercise 14 — Key vs Index
// -----------------------------------------------------------------------------
// A developer says:
// "I created an index on email, therefore email is the primary key."
//
// Explain why this statement is incorrect.
// Distinguish:
// - identity,
// - uniqueness,
// - access performance.

// -----------------------------------------------------------------------------
// Exercise 15 — Jewellery ERP Key Design
// -----------------------------------------------------------------------------
// A jewellery business has branches and products.
// Each branch may use its own SKU.
//
// Model candidate identities for the branch-product relationship.
//
// Explain how the answer changes if SKU becomes globally unique.

// -----------------------------------------------------------------------------
// Exercise 16 — Inventory Identity
// -----------------------------------------------------------------------------
// Current inventory is tracked by:
// - branch,
// - product,
// - lot.
//
// Determine a possible identity for an inventory position.
//
// Then explain how the key changes if lot tracking is removed.

// -----------------------------------------------------------------------------
// Exercise 17 — Historical Records
// -----------------------------------------------------------------------------
// A finalized sale must continue referencing the exact product involved even
// if product details change later.
//
// Explain why stable entity identity matters.
//
// Then distinguish stable product identity from historical snapshots such as:
// price, description, or purity.

// -----------------------------------------------------------------------------
// Exercise 18 — AI/RAG Keys
// -----------------------------------------------------------------------------
// A Chunk may have embeddings generated by multiple model versions.
//
// Entities:
// Chunk
// EmbeddingModelVersion
// Embedding
//
// Determine possible candidate keys for Embedding.
// Then explain what changes if the system permits multiple embedding runs using
// the same model version.

// -----------------------------------------------------------------------------
// Exercise 19 — Application Check vs Database Constraint
// -----------------------------------------------------------------------------
// Two concurrent requests both execute:
//
// 1. Check whether email exists.
// 2. If not, insert the user.
//
// Explain how duplicate users can still be created.
//
// Identify the database-level rule required to preserve correctness.

// -----------------------------------------------------------------------------
// Exercise 20 — Full Key-Design Challenge
// -----------------------------------------------------------------------------
// Design key strategies for:
//
// Customer
// Branch
// Product
// Supplier
// Inventory
// Purchase
// PurchaseItem
// Sale
// SaleItem
// Payment
// InventoryMovement
//
// For each entity provide:
// 1. primary-key candidate,
// 2. alternate/business identifiers,
// 3. uniqueness scope,
// 4. foreign keys,
// 5. composite-key considerations,
// 6. stability considerations.
//
// Then defend every decision as if you were explaining it in a backend system
// design interview.

// -----------------------------------------------------------------------------
// Revision Check
// -----------------------------------------------------------------------------
// [ ] I can define a superkey.
// [ ] I can identify candidate keys.
// [ ] I understand minimality.
// [ ] I can choose a primary key.
// [ ] I understand alternate keys.
// [ ] I can design composite keys.
// [ ] I can design foreign keys.
// [ ] I understand referential integrity.
// [ ] I can distinguish keys from indexes.
// [ ] I can distinguish primary identity from business uniqueness.
// [ ] I can reason about scoped uniqueness.
// [ ] I can reason about tenant-scoped keys.
// [ ] I can evaluate key stability.
// [ ] I can model associative-entity identity.
// [ ] I can reason about composite foreign keys.
// [ ] I can analyze natural identifiers.
// [ ] I can analyze surrogate identifiers.
// [ ] I can reason about historical references.
// [ ] I can model keys in AI/RAG systems.
// [ ] I can defend a key strategy under concurrency and real business rules.
