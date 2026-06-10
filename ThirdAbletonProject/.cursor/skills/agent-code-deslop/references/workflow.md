# Agent Code DeSlop Workflow Reference

Use this reference for the full cleanup checklist and language-specific guidance.

## Cleanup Priorities

Look for these patterns first:

- Unused imports, variables, functions, and parameters
- Overly verbose conditionals or loops
- Trivial abstraction layers that add no value
- Copy-pasted or duplicated logic
- Non-idiomatic constructs where standard patterns are clearer
- Over-broad or silent error handling
- Hallucinated modules, files, APIs, or environment variables
- Placeholder code and TODOs in production paths
- Excessive comments, debug prints, or noisy logging

## Review Sequence

1. Read the code and note language, framework, architecture constraints, and audience.
2. Remove obvious dead code and invalid dependencies first.
3. Simplify structure while preserving behavior and public APIs.
4. Re-scan for language-specific cleanup opportunities.
5. Keep uncertain symbols if project-wide usage is unclear.

## Language-Specific Guidance

### Python

- Replace verbose comparisons like `== True`
- Prefer context managers and standard library helpers
- Remove unnecessary classes around simple functions
- Narrow broad exception handling where safe

### JavaScript and TypeScript

- Remove unnecessary async and await layers
- Avoid redundant null checks that hide contracts
- Prefer built-ins over over-engineered utilities
- Remove dead imports and vestigial helpers

### Go

- Remove unused interfaces and wrappers
- Prefer straightforward explicit code over hidden indirection
- Simplify repetitive but harmless boilerplate only when clarity improves

### Java and Kotlin

- Remove unused annotations and redundant type declarations
- Prefer properties, data classes, and language-idiomatic constructs
- Remove empty or misleading catch blocks

### Rust

- Avoid unnecessary unsafe blocks
- Simplify excessive trait bounds and wrapper types where behavior remains clear

## Output Reminder

- Return the refactored code first
- Then summarize the cleanup in a short "Changes made" list