---
name: security-and-hardening
description: 'Review code and architecture for security risks, then harden the implementation without unnecessary complexity. Use when: checking auth flows, input validation, secrets, dependency risk, unsafe file or network access, or preparing a project for release.'
argument-hint: 'Describe the code, surface area, or threat concern to review'
user-invocable: true
disable-model-invocation: false
---

# Security and Hardening

## When to Use

- Reviewing a feature that handles auth, payments, uploads, or external input
- Hardening an API, admin panel, internal tool, or public web app
- Checking new dependencies, secrets handling, or deployment defaults
- Auditing file access, shell execution, serialization, or plugin boundaries
- Preparing for release or responding to a suspected vulnerability

## Approach

Start from trust boundaries, not just code snippets. Identify what inputs cross into the system, what privileged actions exist, where secrets live, and which failures could expose data or control.

Focus on realistic risks and practical mitigations. The goal is to reduce exploitability and blast radius while keeping the codebase maintainable.

## Procedure

1. Map the attack surface, assets, and trust boundaries.
2. Review core controls such as auth, validation, output safety, and secret handling.
3. Check common vulnerability classes relevant to the surface area.
4. Recommend the smallest effective hardening changes.
5. Validate the exploit path is closed without breaking legitimate use.

Use [workflow.md](references/workflow.md) for the full review flow and stack-specific checks.

## Output

Deliver a hardening report with:

1. Scope reviewed
2. Trust boundaries and sensitive assets
3. Findings ranked by severity
4. Concrete mitigations
5. Validation steps
6. Residual risks and next actions

## Example Usage Prompts

- `/security-and-hardening` -> "Review this auth flow for access-control mistakes"
- `/security-and-hardening` -> "Check this upload endpoint for common security issues"
- `/security-and-hardening` -> "Audit this JUCE preset-loading code for unsafe parsing or memory problems"

## Examples

See [EXAMPLES.md](EXAMPLES.md) for example security reviews, finding formats, and mitigation style.

## References

- [../../copilot-instructions.md](../../copilot-instructions.md) - Shared verification and dependency analysis standards
- [workflow.md](references/workflow.md) - Detailed security review flow and stack-specific guidance