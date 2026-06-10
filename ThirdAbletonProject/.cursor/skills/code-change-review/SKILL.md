---
name: code-change-review
description: 'Review AI-generated code changes for unintended consequences, logic errors, UI inconsistencies, and context-specific issues. Use when: code has just been modified, flag potential bugs, verify UI consistency, check implementation correctness against project patterns.'
argument-hint: 'Describe the change or file(s) to review'
user-invocable: true
disable-model-invocation: false
---

# Code Change Review

## When to Use

- After AI agents make modifications to code
- Before committing changes to verify quality
- When suspicious about consistency or hidden impacts
- Testing cross-cutting effects (styling, state management, routing)
- UI/UX quality check for visual consistency

## Philosophy

The best changes are the ones that appear *invisible* — they fit seamlessly into the existing codebase without standing out. This skill helps ensure changes follow project patterns, don't introduce unnecessary complexity, and don't break subtle invariants. The goal of this is to ensure robustness and maintainability, not just to catch obvious bugs. By systematically checking for common pitfalls and patterns, we can catch issues that might be missed in a quick glance. 

---

## Step-by-Step Procedure

1. Understand the request and scan the diff or whatever code the user wants reviewed. Identify the scope and nature of the change (local vs cross-cutting, logic vs UI). If the user does not specify, you are at that point to audit the primary source code files in the codebase, tracing them to what they power and continue your audit from there.
2. Review logic paths, side effects, and edge cases thoroughly. Check assumptions and compare against project patterns. Evaluate whether the change would hold up in production use.
3. Review UI consistency if presentation changed.
4. Check integrations, configuration impact, and documentation needs.
5. Report concrete findings with severity and suggested fixes.

Use [workflow.md](references/workflow.md) for the full checklists and detailed review sequence. You do not deviate from 

## Output

Produce a review report in the chat with: 

1. Findings ranked by severity
2. Why each issue matters
3. Suggested fix or mitigation
4. Any remaining risks or testing gaps

---

## Common Red Flags

Watch for these patterns when reviewing AI-generated changes:

| Red Flag | What It Means | Check |
|----------|------------------|-------|
| Overly defensive code | Too many null checks, type guards for things that shouldn't be null | Traces assumptions — are they valid? |
| New utility function doing work that exists elsewhere | Code duplication or missing abstraction | Search for similar logic in codebase |
| Magic numbers or strings | Hardcoded values that should be constants/config | Find where same values defined elsewhere |
| Nested ternaries or complex conditionals | Hard to reason about logic | Simplify to guard clauses or early returns |
| Inconsistent error handling | mix of try/catch, if-checks, silent failures | Standardize to project's error pattern |
| Unused variables after refactor | Leftover declarations | Search for actual usage |
| New dependency added without thought | Library bloat or version conflicts | Check if something similar exists in project |
| State mutation in pure function context | Unexpected side effects | Check whether function should be pure |
| CSS specificity arms race | `!important`, deeply nested selectors, inline styles | Migrate to design system utilities |
| Component too complex | Too many props, state, or nested children | Consider splitting or simplifying |

For concrete examples of negative patterns to avoid and positive patterns to follow, see [Pattern Reference](./references/patterns.md).

---

## Example Usage Prompts

- `/code-change-review` -> "Review this change for bugs or issues I might have missed"
- `/code-change-review` -> "Check if this implementation fits our codebase patterns"
- `/code-change-review` -> "Look for UI inconsistencies in this component"

---

## Quick Reference

**For quick reviews**: Use the Common Red Flags table and spot-check 2-3 items.

**For thorough reviews**: Walk through [workflow.md](references/workflow.md) systematically.

**For UI-heavy changes**: Use the UI checklist in [workflow.md](references/workflow.md).

**For complex logic**: Use the logic checklist in [workflow.md](references/workflow.md) and trace execution paths carefully.

## JUCE 8.0.8 Code Quality Protocol (WAVFin)

When reviewing JUCE C++ audio plugin projects:
1. **Memory & Threading**: Check for raw pointers and ensure NO allocations or locks exist on the audio thread.
2. **Modern C++ & Performance**: Recommend modern C++ features where compatible, and note any performance-critical optimizations.
3. **Robustness**: Highlight any exception safety issues or non-real-time safe code.
4. **Documentation Check**: Base all recommendations on JUCE documentation via `jucedoclinks.mdc`.

## References

- [workflow.md](references/workflow.md) - Full review checklists and detailed procedure
- [Pattern Reference](references/patterns.md) - Positive and negative implementation patterns
