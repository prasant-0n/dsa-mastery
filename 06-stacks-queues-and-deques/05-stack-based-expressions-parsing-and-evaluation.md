# 06.05 — Stack-Based Expressions, Parsing & Evaluation

> Phase 06 — Stacks, Queues & Deques

This chapter develops expression processing from first principles: tokenization, parsing, precedence, associativity, parentheses, infix/prefix/postfix notation, stack evaluation, unary operators, AST construction, validation, complexity, and production-safe expression engines.

## 1. Learning Objectives

You should be able to:

- distinguish lexing, parsing, and evaluation;
- explain why stacks model deferred operators and nested expressions;
- evaluate postfix expressions;
- convert infix expressions to postfix;
- reason about precedence and associativity;
- handle parentheses and unary operators;
- validate malformed expressions;
- build expression trees/ASTs;
- separate parsing from execution;
- define resource limits and structured errors;
- prove stack-based expression algorithms are linear;
- apply the ideas to backend and AI systems.

## 2. Expression Pipeline

A robust expression engine can be modeled as:

```text
source text → tokens → parse structure → AST/IR → evaluation
```

Lexing answers **what are the tokens?** Parsing answers **how are they related?** Evaluation answers **what does the structure compute?**

Keeping these responsibilities separate makes validation, testing, diagnostics, and security easier.

## 3. Expression Notations

### Infix

```text
A + B
```

### Prefix

```text
+ A B
```

### Postfix

```text
A B +
```

Postfix is naturally compatible with a stack because an operator consumes the most recently produced operands.

## 4. Postfix Evaluation

For:

```text
2 3 4 * +
```

process left-to-right:

```text
2 → push
3 → push
4 → push
* → pop 4 and 3 → push 12
+ → pop 12 and 2 → push 14
```

The final stack contains `14`.

### Core invariant

Every stack entry represents a completed subexpression value waiting to be consumed by a future operator.

For a binary operator:

```text
right = pop()
left  = pop()
result = left operator right
push(result)
```

Operand order is critical for subtraction, division, and exponentiation.

## 5. Postfix Validation

For every binary operator:

```text
stack size >= 2
```

After applying it:

```text
stack size decreases by 1
```

At successful termination, a complete single expression normally leaves exactly one value.

Therefore stack depth itself becomes a structural validation mechanism.

## 6. Infix Parsing

Consider:

```text
2 + 3 * 4
```

The parser cannot apply `+` immediately because `*` has higher precedence.

The operator stack stores deferred operators.

General processing:

```text
operand       → emit
opening '('   → push
closing ')'   → pop until '('
operator      → resolve operators that must precede it, then push
end of input  → flush remaining operators
```

This is the central idea of the shunting-yard family of algorithms.

## 7. Precedence

A simplified hierarchy is:

```text
exponentiation
multiplication / division
addition / subtraction
```

Higher-precedence operations must be resolved before lower-precedence operations.

Operator metadata should be centralized rather than scattered through parser conditionals.

Useful metadata:

```text
symbol
precedence
associativity
arity
```

## 8. Associativity

Precedence alone does not determine grouping.

For:

```text
A - B - C
```

left associativity gives:

```text
(A - B) - C
```

For a right-associative operator such as commonly defined exponentiation:

```text
A ^ B ^ C
```

the intended grouping can be:

```text
A ^ (B ^ C)
```

Therefore the operator-pop rule depends on both precedence and associativity.

## 9. Parentheses

Parentheses create a parsing barrier.

For:

```text
(A + B) * C
```

operators inside the group must be resolved before the group closes.

On `)`:

```text
pop operators until '('
remove '('
```

A closing parenthesis without a matching opening parenthesis is invalid. An opening parenthesis remaining at end of input is also invalid.

## 10. Unary Operators

The same symbol may have different arity.

```text
-5       → unary negation
5 - 3    → binary subtraction
```

The parser should determine operator role from grammatical context and preferably represent the internal forms distinctly, such as `NEG` versus `SUB`.

Operator metadata should therefore include arity.

## 11. Parser State

A useful mental model is a small state machine:

```text
EXPECT_OPERAND
EXPECT_OPERATOR
```

At expression start:

```text
EXPECT_OPERAND
```

After a number or closing parenthesis:

```text
EXPECT_OPERATOR
```

After a binary operator or opening parenthesis:

```text
EXPECT_OPERAND
```

This makes malformed input easier to reject systematically.

## 12. Error Categories

Do not collapse every failure into one generic error.

### Lexical error

Unknown token.

### Syntax error

Invalid token sequence or unmatched grouping.

### Evaluation error

A valid expression cannot be evaluated under the chosen numeric rules.

Useful diagnostics can include:

```text
category
message
source position
offending token
expected token/category
```

## 13. Infix → Postfix Complexity

For `N` tokens, each token is read once and an operator is pushed and popped at most once.

Therefore:

```text
Time  = O(N)
Space = O(N)
```

The apparent nested `while` loop does not make the algorithm O(N²) because total pops are bounded by the number of pushed operators.

## 14. AST Construction

Instead of immediately computing:

```text
2 + 3 * 4
```

we can build:

```text
    +
   / \
  2   *
     / \
    3   4
```

An AST represents structure independently of execution.

A stack can hold partially constructed nodes. For postfix input, operands become nodes; an operator pops its child nodes, creates a parent node, and pushes it back.

## 15. Why AST Separation Matters

An AST enables:

- validation before execution;
- optimization;
- pretty printing;
- interpretation;
- compilation;
- static analysis;
- caching;
- multiple execution targets.

For backend systems, this separation is especially valuable when expressions are user-defined configuration or rules.

## 16. Safe Expression Engines

A constrained expression language should define its own grammar and supported operations.

Do not confuse parsing a controlled expression language with executing arbitrary application code.

A controlled parser gives explicit authority over:

```text
allowed syntax
allowed operators
allowed functions
side effects
numeric semantics
resource limits
```

## 17. Resource Limits

Untrusted expressions should have explicit limits such as:

```text
maximum source length
maximum token count
maximum nesting depth
maximum AST nodes
maximum evaluation steps
maximum string size
```

Correct algorithms can still become denial-of-service surfaces if resource consumption is unbounded.

## 18. Numeric Semantics

The expression language must define its numeric behavior.

Questions include:

```text
integer or floating point?
division behavior?
overflow behavior?
NaN/Infinity allowed?
precision requirements?
```

Do not silently import the semantics of another programming language.

## 19. Backend Applications

Stack-based expression processing appears in:

- query/filter languages;
- authorization rules;
- pricing formulas;
- workflow conditions;
- feature flags;
- configuration expressions;
- validation rules;
- search syntax;
- rule engines;
- metrics expressions.

Example:

```text
(user.role == "admin") && (order.total > 10000)
```

A backend can parse this into a controlled AST and evaluate it against an explicitly permitted environment.

## 20. AI Applications

Expression parsing supports:

- symbolic reasoning;
- mathematical formulas;
- generated-expression validation;
- structured tool arguments;
- agent DSLs;
- workflow planning languages;
- AST transformation;
- constrained computation.

AI-generated expressions should be treated as untrusted input unless their execution environment is explicitly trusted.

## 21. Correctness Framework

For postfix evaluation, prove:

1. every stack entry represents a completed subexpression;
2. every binary operator consumes exactly its two required operands;
3. replacement of two operands with one result preserves the invariant;
4. successful termination leaves exactly one completed expression.

For infix conversion, prove:

1. emitted operands preserve input order;
2. operators are emitted according to precedence and associativity;
3. parentheses form barriers;
4. final flushing emits every remaining operator exactly once.

## 22. Common Mistakes

- reversing operands for subtraction/division;
- ignoring associativity;
- treating unary minus as binary subtraction;
- forgetting final operator flushing;
- accepting unmatched parentheses;
- mixing tokenization and evaluation prematurely;
- storing parser state ambiguously;
- exposing arbitrary code execution;
- omitting resource limits;
- failing to define numeric semantics.

## 23. Interview Framework

When given an expression problem:

```text
1. Identify token types.
2. Define the grammar.
3. Separate unary and binary operators.
4. Define precedence.
5. Define associativity.
6. Choose value/postfix/AST output.
7. Define stack invariants.
8. Define malformed-input behavior.
9. Derive correctness.
10. Derive time and space complexity.
11. Test nesting and non-commutative operators.
12. Discuss production safety.
```

## 24. Revision Checklist

- [ ] I can distinguish lexing, parsing, and evaluation.
- [ ] I can evaluate postfix expressions.
- [ ] I preserve operand order.
- [ ] I can derive infix-to-postfix conversion.
- [ ] I understand precedence and associativity.
- [ ] I can process parentheses.
- [ ] I can distinguish unary and binary operators.
- [ ] I can validate malformed expressions.
- [ ] I can construct an AST.
- [ ] I can prove O(N) stack processing.
- [ ] I can define parser resource limits.
- [ ] I can design a safe backend expression engine.
- [ ] I can explain AI applications.

## 25. Key Takeaways

1. Expression processing is deferred-state management, which makes stacks a natural tool.
2. Postfix evaluation is direct LIFO computation.
3. Infix parsing requires precedence, associativity, grouping, and operator state.
4. Parentheses are nested unresolved state.
5. Unary and binary operators should be represented explicitly.
6. ASTs separate syntax from execution.
7. Linear complexity follows from bounded pushes and pops.
8. Production parsers require explicit errors, numeric semantics, and resource limits.
9. The important skill is deriving the parser invariant rather than memorizing a template.
