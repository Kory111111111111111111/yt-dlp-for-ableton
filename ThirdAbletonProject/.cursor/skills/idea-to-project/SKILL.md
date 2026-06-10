---
name: idea-to-project
description: 'Turn small ideas into fully-fledged projects through structured discovery, research, and specification. Use when: starting a new project from a rough idea, need to validate feasibility, want to create comprehensive project documentation, exploring feature requirements and design patterns. Conversational, adaptive workflow.'
argument-hint: 'Describe your project idea or problem you want to solve'
user-invocable: true
disable-model-invocation: false
---

# Idea to Project

Transform a rough concept into a complete project specification through four conversational, adaptive phases: discovery, research, feature definition, and design systems.

## When to Use

- **Starting from scratch**: You have a vague idea and need structure
- **Validating feasibility**: Want to know if similar solutions exist
- **Team alignment**: Creating a shared project specification document
- **Risk reduction**: Understanding features and design before development
- **Scope clarification**: Converting informal requirements into executable specs

## Approach

This skill uses progressive questioning, adaptive branching, and natural dialogue to guide the user from vague idea to concrete project direction. Keep the main interaction collaborative and lightweight, then rely on reference docs for the detailed phase workflow.

See [../../copilot-instructions.md](../../copilot-instructions.md) for workspace-wide interaction standards and [workflow.md](references/workflow.md) for the detailed phase guidance.

## Procedure

1. Run four phases in order: discovery, research, specification, and design direction.
2. Validate with the user after each phase before moving forward.
3. Keep the interaction conversational in chat and move detailed structure into artifacts like `PROJECT_SPEC.md` and `DESIGN_SYSTEM.md`.
4. Use the detailed phase prompts, gates, and fallback guidance in [workflow.md](references/workflow.md).

## Example Usage Prompts

- `/idea-to-project` → "I want to build a habit tracker for small teams"
- `/idea-to-project` → "Problem: Developers waste time context-switching between monitoring tools"
- `/idea-to-project` → "An app to help friends organize and split shared expenses"

## Output & Deliverables

Two markdown files created in project root (or user-specified folder):

1. **PROJECT_SPEC.md** – Overview, problem, features, requirements, architecture, UI outline
2. **DESIGN_SYSTEM.md** – Colors, typography, components, layout, accessibility, responsiveness, design tokens

Both are ready for team collaboration and developer handoff.

## Conversational Tips

See [../../copilot-instructions.md](../../copilot-instructions.md) for shared conversational patterns and [workflow.md](references/workflow.md) for detailed discovery and fallback guidance.

## References

- [../../copilot-instructions.md](../../copilot-instructions.md) - Workspace rules, conversational guidelines, and decision trees for this skill
- [workflow.md](references/workflow.md) – Detailed phase workflow, prompts, and decision gates
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Design Systems Best Practices](https://www.nngroup.com/articles/design-systems-101/)
- [User Story Format](https://en.wikipedia.org/wiki/User_story)
