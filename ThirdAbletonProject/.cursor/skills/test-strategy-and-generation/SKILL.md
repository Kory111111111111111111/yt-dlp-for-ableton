---
name: test-strategy-and-generation
description: 'Design the smallest effective set of tests for a change, then generate them in the project''s style. Use when: fixing bugs, adding features, preventing regressions, or improving weak test coverage across web, JVM, Python, and native codebases.'
argument-hint: 'Describe the change, bug, or code path that needs test coverage'
user-invocable: true
disable-model-invocation: false
---

# Test Strategy and Generation

## When to Use

- A bug fix needs a regression test
- A new feature needs coverage before or after implementation
- Existing tests are weak, noisy, or brittle
- You need to choose between unit, integration, component, or end-to-end coverage
- A change affects multiple languages or layers and the right test boundary is unclear

## Approach

Good testing is selective. Do not maximize test count. Choose the smallest set of tests that proves the behavior, guards the highest-risk paths, and matches the codebase's testing style.

Prefer stable tests around contracts and behavior over tests that mirror implementation details.

## Procedure

1. Identify the behavior that changed and the most valuable boundary to test.
2. Choose the lowest-cost test level that still provides confidence.
3. Enumerate happy path, edge, failure, and regression cases.
4. Generate tests in the repo's style.
5. Validate that the tests are deterministic and would fail for the broken behavior.

Use [workflow.md](references/workflow.md) for the full test-selection flow and stack-specific guidance.

## Output

Deliver:

1. Recommended test levels
2. Specific cases to cover
3. Generated tests or test skeletons in project style
4. Gaps that still require manual or exploratory testing

## Example Usage Prompts

- `/test-strategy-and-generation` -> "Add regression tests for this pagination bug"
- `/test-strategy-and-generation` -> "What tests should back this new Spring service flow?"
- `/test-strategy-and-generation` -> "Generate the right pytest coverage for this upload endpoint"

## Examples

See [EXAMPLES.md](EXAMPLES.md) for example test-boundary choices, case selection, and output formats.

## References

- [../../copilot-instructions.md](../../copilot-instructions.md) - Shared validation, edge-case, and codebase-pattern rules
- [workflow.md](references/workflow.md) - Detailed test-selection flow and stack-specific guidance