# 04.19 — Recursive Parsing & AST Processing

## Purpose

Parsers and abstract syntax trees (ASTs) are practical examples of recursive structures. Expressions contain subexpressions, statements contain nested statements, and syntax trees naturally encode hierarchical computation.

This chapter applies recursion to parsing, AST traversal, evaluation, transformation, validation, and code-analysis workflows.

> Recursive parsing is fundamentally recursive state management over a grammar or tree structure.

---

# 1. Why Parsing Is Recursive

A grammar may contain nested productions:

```text
expression
  → term
      → factor
          → expression
```

Nested syntax naturally maps to recursive descent.

---

# 2. Tokens vs AST

A tokenizer converts source text into tokens:

```text
source → tokens
```

A parser converts tokens into structure:

```text
tokens → AST
```

The AST removes irrelevant lexical details and represents semantic structure.

---

# 3. Example AST

An arithmetic expression such as:

```text
2 + 3 * 4
```

may become conceptually:

```text
      +
     / \
    2   *
       / \
      3   4
```

The tree captures precedence through structure.

---

# 4. Recursive Descent

A recursive-descent parser typically has one function per grammar construct:

```text
parseExpression()
parseTerm()
parseFactor()
```

Each function consumes the portion of the token stream described by its grammar rule.

---

# 5. Parser State

A parser commonly needs:

```text
input tokens
current position
lookahead
error context
recursion state
```

The cursor is critical state. Forgetting to advance it can cause non-termination.

---

# 6. Grammar and Termination

Every recursive grammar rule needs a path toward consuming input or reaching a terminal production.

Dangerous grammar shape:

```text
A → A
```

This creates immediate left recursion without progress.

A practical parser must either transform such grammar or use a parsing strategy that handles it correctly.

---

# 7. Left Recursion

A rule such as:

```text
Expr → Expr + Term | Term
```

causes naive recursive descent to recurse forever before consuming input.

It can be transformed conceptually into an iterative repetition:

```text
Expr → Term ( + Term )*
```

This demonstrates an important principle:

> Recursive structure is useful only when recursive calls make measurable progress.

---

# 8. Precedence

Operator precedence determines tree structure.

Typical hierarchy:

```text
expression
→ addition/subtraction
→ multiplication/division
→ unary
→ primary
```

Higher-precedence constructs are parsed deeper in the grammar.

---

# 9. Associativity

Operators may be:

```text
left-associative
right-associative
non-associative
```

For example, subtraction is generally left-associative:

```text
a - b - c
= (a - b) - c
```

Parser design must encode this deliberately.

---

# 10. Primary Expressions

A primary expression can include:

- literals;
- identifiers;
- parenthesized expressions;
- arrays;
- objects;
- function expressions.

These constructs frequently become recursive AST children.

---

# 11. AST Node Design

A useful AST node should contain enough information for later passes.

Example:

```js
{
    type: 'BinaryExpression',
    operator: '+',
    left: ..., 
    right: ...
}
```

Avoid storing unnecessary information in every node when memory matters, but preserve source information when diagnostics require it.

---

# 12. Source Locations

Production ASTs often track:

```text
start offset
end offset
line
column
```

This allows precise error messages and source mapping.

Location metadata increases memory usage, so representation should match tooling requirements.

---

# 13. Recursive AST Traversal

A generic traversal follows:

```text
visit(node)
→ visit child nodes
```

Traversal can implement:

- validation;
- interpretation;
- transformation;
- metrics;
- code generation.

---

# 14. Visitor Pattern

A visitor separates traversal mechanics from node-specific behavior.

Conceptually:

```text
visit(node)
    dispatch by node.type
```

This makes multiple AST operations reusable over the same tree structure.

---

# 15. Preorder AST Processing

Preorder processes the parent before children.

Useful for:

- entering scopes;
- collecting declarations;
- propagating context;
- instrumentation.

---

# 16. Postorder AST Processing

Postorder processes children before the parent.

Useful for:

- expression evaluation;
- type inference dependencies;
- constant folding;
- computing subtree properties.

---

# 17. AST Evaluation

An interpreter can recursively evaluate nodes:

```text
Literal → value
BinaryExpression → evaluate children → combine
```

The AST itself defines the recursive computation structure.

---

# 18. Environment State

Variable references require an environment:

```text
name → value
```

A nested scope may create a new environment linked to its parent.

Recursive evaluation must preserve the correct environment at each subtree.

---

# 19. Scope and Restoration

Block/function evaluation may conceptually:

```text
enter scope
→ evaluate children
→ exit scope
```

An explicit environment stack or lexical parent chain can represent this state.

---

# 20. AST Transformation

A transformation recursively maps one tree to another:

```text
transform(node)
→ transform children
→ construct replacement node
```

Examples:

- remove redundant nodes;
- normalize syntax;
- rewrite operators;
- optimize expressions.

---

# 21. Structural Sharing

An AST transformation does not always need to copy every node.

If a subtree is unchanged, it can sometimes be reused safely:

```text
old subtree === new subtree
```

This reduces allocation but requires immutable or carefully controlled ownership.

---

# 22. Constant Folding

An AST can be simplified:

```text
2 + 3
```

into:

```text
5
```

A recursive postorder transformation evaluates child constants before deciding whether the parent can be folded.

---

# 23. Short-Circuit Semantics

Logical operators may not evaluate both children.

For:

```text
A && B
```

if `A` is false, `B` may never be evaluated.

Recursive AST evaluation must preserve language semantics rather than blindly traversing every child.

---

# 24. Error Propagation

Recursive parser/evaluator errors should retain useful context:

```text
node type
source location
expected token
actual token
nested operation
```

Avoid swallowing child errors merely because they occur deep in recursion.

---

# 25. Recursive Parser Correctness

A useful parser proof considers:

### Consumption invariant
The parser cursor points to the first unconsumed token.

### Production invariant
Each parser function consumes exactly the tokens represented by its grammar production.

### Progress
Every successful recursive path consumes input or reaches a terminal production.

### Failure correctness
Invalid input produces a meaningful parse error rather than silently accepting malformed syntax.

---

# 26. Complexity of Parsing

For a well-designed parser where each token is consumed a bounded number of times:

```text
Time: O(N)
```

where `N` is token count.

AST construction adds allocation proportional to the number of nodes.

Poor backtracking parsers can become exponential on ambiguous grammars.

---

# 27. Backtracking Parsers

Some recursive parsers try alternatives:

```text
try production A
if failure → restore cursor → try B
```

This is structurally similar to backtracking search.

Without memoization or grammar constraints, repeated parsing can create large search trees.

---

# 28. Packrat / Memoized Parsing

If parser states repeat, memoization can store results for:

```text
(grammar rule, input position)
```

This converts repeated parsing work into state reuse at the cost of memory.

The exact complexity depends on grammar properties and parser implementation.

---

# 29. AST Cycle Safety

Ordinary parsed ASTs are trees, but transformed or programmatically constructed AST-like structures may contain cycles accidentally.

Generic visitors should not assume acyclicity when operating on arbitrary object graphs.

Use identity-based cycle detection when the input contract permits cycles.

---

# 30. Deep ASTs and Stack Safety

Generated or adversarial source can produce very deep nesting:

```text
((((((((x))))))))
```

Recursive parsing or traversal can exceed the call stack.

For untrusted or extreme depth, consider iterative parsing/traversal or explicit frame state.

---

# 31. Backend Applications

Recursive parsing is useful for:

- query languages;
- configuration languages;
- rule engines;
- expression evaluators;
- workflow definitions;
- template languages;
- filter builders.

Backend systems should enforce input-size and nesting-depth limits.

---

# 32. AI Applications

AST recursion is central to:

- code analysis;
- static analysis;
- code transformation;
- program synthesis;
- symbolic reasoning;
- code generation pipelines;
- syntax-aware retrieval and transformation.

Tree structure provides a stronger representation than raw text for many code-oriented AI tasks.

---

# 33. Production Architecture

A production parser pipeline often separates:

```text
source
→ lexer
→ parser
→ AST
→ validation
→ transformation
→ analysis
→ execution/code generation
```

Separating phases makes correctness, testing, and optimization easier.

---

# 34. Common Mistakes

1. Forgetting parser cursor progress.
2. Introducing left recursion into recursive descent.
3. Losing operator precedence or associativity.
4. Evaluating short-circuit operands eagerly.
5. Mutating shared AST nodes unexpectedly.
6. Dropping source-location information required for diagnostics.
7. Ignoring deep nesting and stack limits.
8. Assuming every AST is acyclic.
9. Backtracking without understanding worst-case complexity.
10. Building expensive copies during every recursive transformation.

---

# 35. Design Procedure

```text
1. Define the grammar or AST node model.
2. Define parser/traversal state.
3. Define progress invariant.
4. Establish terminal productions.
5. Encode precedence and associativity.
6. Design node representations.
7. Separate traversal from node-specific behavior.
8. Decide pre/post processing requirements.
9. Preserve semantic evaluation order.
10. Handle errors with source context.
11. Analyze depth and total work.
12. Consider memoization for repeated parser states.
13. Consider iterative traversal for extreme depth.
14. Enforce input/resource limits.
15. Test malformed, ambiguous, and deeply nested inputs.
```

---

# 36. Interview Explanation Template

> “Recursive parsing works because grammar and syntax trees are hierarchical. I define parser state around the token cursor and ensure every recursive production makes measurable progress. Once an AST is built, recursive visitors can evaluate or transform it using pre- or postorder semantics. For backtracking grammars I analyze repeated parser states and may memoize by rule and input position. In production, I also consider deep nesting, source-location memory, error propagation, and stack safety.”

---

# 37. Revision Checklist

- [ ] Can I explain why recursive descent maps to grammar structure?
- [ ] Can I define parser state and cursor invariants?
- [ ] Can I detect left recursion?
- [ ] Can I encode precedence and associativity?
- [ ] Can I design AST nodes?
- [ ] Can I traverse an AST recursively?
- [ ] Can I distinguish preorder and postorder processing?
- [ ] Can I evaluate AST nodes correctly?
- [ ] Can I preserve scope/environment state?
- [ ] Can I transform an AST recursively?
- [ ] Can I explain structural sharing?
- [ ] Can I preserve short-circuit semantics?
- [ ] Can I reason about parser backtracking complexity?
- [ ] Can I identify memoization states in parsing?
- [ ] Can I handle deep ASTs safely?
- [ ] Can I connect recursive parsing to backend and AI systems?

# Key Takeaways

1. Grammars and ASTs are naturally recursive hierarchical structures.
2. Parser state must include a precise cursor/progress model.
3. Recursive descent requires recursive calls to make measurable progress.
4. Left recursion must be handled deliberately.
5. AST traversal order determines what information is available when processing a node.
6. AST transformations can use structural sharing when ownership permits.
7. Backtracking parsers are recursive search systems and can benefit from memoization.
8. Deep syntax requires the same stack-safety discipline as other recursive data processing.
9. Production parsers must treat malformed input, resource limits, and diagnostics as first-class concerns.
10. Recursive parsing is a concrete bridge between DSA recursion, language tooling, backend systems, and AI code intelligence.
