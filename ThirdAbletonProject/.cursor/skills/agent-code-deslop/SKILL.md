---
name: agent-code-deslop
description: 'Clean up AI-generated or over-engineered code while preserving behavior. Use when: refactoring noisy code, removing dead code, simplifying abstractions, or making code more idiomatic without changing the public API.'
argument-hint: 'Describe the code, file, or refactor target to clean up'
user-invocable: true
disable-model-invocation: false
---

# Agent Code DeSlop

## When to Use

- AI-generated code is noisy, repetitive, or over-engineered
- A refactor should simplify code without changing behavior
- Dead code, weak abstractions, or hallucinated dependencies need cleanup
- The code works but does not fit the language or codebase idioms

## Approach

Prefer small, focused refactorings that preserve behavior, public APIs, and project constraints. Remove unnecessary complexity first, then tighten the code toward idiomatic patterns for the target language.

Do not invent dependencies, config, or environment requirements unless explicitly asked.

## Procedure

1. Identify obvious dead code, invalid dependencies, and misleading structure.
2. Simplify the code while preserving behavior and public APIs.
3. Re-scan for language-specific cleanup opportunities.
4. Use [workflow.md](references/workflow.md) for the full cleanup checklist and language-specific guidance.

## Output

1. Return the refactored code.
2. Summarize the key cleanup steps in a short "Changes made" list.

## Example Usage Prompts

- `/agent-code-deslop` -> "Clean up this over-engineered Kotlin service without changing its API"
- `/agent-code-deslop` -> "Refactor this Python helper module to remove dead code and make it idiomatic"
- `/agent-code-deslop` -> "Simplify this React component tree and remove AI-generated noise"

## Examples

See [EXAMPLES.md](EXAMPLES.md) for detailed before/after examples in Python, JavaScript/TypeScript, and Go, demonstrating de-slopping patterns across languages.

## References

- [workflow.md](references/workflow.md) - Cleanup priorities, review sequence, and language-specific guidance
