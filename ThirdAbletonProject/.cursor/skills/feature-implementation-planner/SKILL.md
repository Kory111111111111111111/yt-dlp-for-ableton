---
name: feature-implementation-planner
description: 'Turn a feature request, issue, or rough spec into a safe implementation plan for an existing codebase. Use when: planning a new feature, scoping impacted files, evaluating trade-offs, or deciding rollout steps before coding.'
argument-hint: 'Describe the feature, issue, or requirement to plan'
user-invocable: true
disable-model-invocation: false
---

# Feature Implementation Planner

## When to Use

- A feature is defined loosely and needs an implementation plan
- A ticket exists, but the code impact is unclear
- The change crosses multiple modules or layers
- You want file-level guidance before editing code
- You need rollout, migration, or testing steps before starting implementation

## Approach

The goal is not to brainstorm endlessly. The goal is to produce a defensible implementation plan that fits the existing codebase, identifies risk early, and keeps the work sequence clear.

This skill should inspect existing patterns first, then recommend the smallest architecture that satisfies the requirement.

## Procedure

1. Clarify the request and define acceptance criteria.
2. Inspect existing patterns before proposing architecture.
3. Map affected modules, contracts, state, and rollout needs.
4. Compare viable options and recommend one path clearly.
5. Produce an ordered implementation plan and explicit completion checks.

Use [workflow.md](references/workflow.md) for the full planning sequence and stack-specific considerations.

## Output

Produce a feature implementation brief with:

1. Goal and acceptance criteria
2. Existing patterns found
3. Impacted modules/files
4. Recommended approach
5. Ordered implementation plan
6. Risks, edge cases, and validation steps

## Example Usage Prompts

- `/feature-implementation-planner` -> "Plan adding role-based access control to this admin dashboard"
- `/feature-implementation-planner` -> "Map the work to add offline preset browsing in this JUCE app"
- `/feature-implementation-planner` -> "Plan a billing settings page in our Next.js app without breaking existing routes"

## Examples

See [EXAMPLES.md](EXAMPLES.md) for model plans, output structure, and expected planning depth.

## JUCE 8.0.8 Feature Planning Protocol (WAVFin)

When planning features for JUCE C++ audio plugin projects:
1. **Clarification is Mandatory**: Never assume user intent. Ask clarifying questions regarding UI/UX, integration, and audio behavior.
2. **Consequence Assessment**: Identify trade-offs in CPU usage, real-time safety, and cross-platform compatibility.
3. **LookAndFeel & Theming**: ALWAYS plan to use the `CustomLookAndFeel` class and `GMarketSans` font. No hardcoded colors.
4. **Thread Safety Design**: Ensure the design enforces separation of UI updates (message thread) and audio processing (real-time safe).
5. **Documentation**: Always verify patterns against `jucedoclinks.mdc`.

## References

- [../../copilot-instructions.md](../../copilot-instructions.md) - Shared context gathering, dependency analysis, and verification rules
- [workflow.md](references/workflow.md) - Detailed planning flow and stack-specific considerations