---
name: impl-quality-audit
description: 'Audit the quality and robustness of an implementation by inventorying the code, understanding how it works, then researching reference examples and community standards online to identify gaps. Use when: checking if a DSP routine is correct, validating a JUCE component follows best practices, reviewing an entire module for structural weaknesses, or verifying a feature is not just "working" but properly implemented.'
argument-hint: 'Name the specific implementation, file(s), or source folder to audit — e.g. "the reverb tail algorithm in Source/DSP/", "our APVTS parameter binding", or just drop the folder'
user-invocable: true
disable-model-invocation: false
---

# Implementation Quality Audit

## When to Use

- You want to know if an implementation is correct, not just functional
- A module was built quickly and never properly vetted
- You suspect a standard JUCE or C++ pattern exists that we're not following
- A DSP or audio algorithm feels fragile or produces subtle artifacts
- You want an outside benchmark — what does a solid production version of this look like?
- After completing a feature, before considering it "done"

## Philosophy

Working code is the floor, not the ceiling. This skill exists to answer a harder question: *is this implemented the way it should be?*

The audit is grounded in evidence. It reads the actual code, inventories what exists, then goes and finds reference implementations — real-world code snippets, official documentation, forum posts from domain experts — and uses those to measure the gap. Opinions and guesses are not findings. Every identified weakness is compared against a concrete external example.

---

## Procedure

1. **Determine scope.** Identify whether the audit covers a single function, a file, a module, or an entire source folder. Adjust depth accordingly.
2. **Inventory and read.** Traverse the relevant code. Understand what each piece does, how it connects to the rest, and what design choices were made.
3. **Research online.** For each distinct implementation area, search the web for: official documentation, reference implementations, community best-practice examples, and known anti-patterns in that domain.
4. **Run the gap analysis.** Compare what we have against what the research surfaced. Flag deviations, missing robustness, incorrect API usage, thread-safety issues, or needless complexity.
5. **Produce the audit report.** Deliver structured findings ranked by severity, with concrete comparisons and prioritized action items.

Use [workflow.md](references/workflow.md) for the full phase-by-phase procedure and domain-specific checks.

---

## Output

Deliver a structured audit report with:

1. **Scope and inventory** — what was reviewed, file list, high-level summary of purpose
2. **How it currently works** — plain-language walkthrough of the implementation
3. **Research findings** — links and excerpts from reference implementations or documentation
4. **Gap analysis** — issues found, graded by severity (Critical / High / Medium / Low)
5. **Prioritized action items** — concrete fixes, ordered by impact

---

## Severity Scale

| Level | Meaning |
|-------|---------|
| **Critical** | Correctness failure, data corruption, memory unsafety, or silent wrong behavior |
| **High** | Missing thread safety, incorrect API lifecycle usage, logic that breaks under normal edge cases |
| **Medium** | Antipattern used when a better standard approach exists, missing error handling for realistic scenarios |
| **Low** | Code style deviation, missed JUCE utility, minor redundancy |

---

## Example Usage Prompts

- `/impl-quality-audit` → "Audit our reverb DSP — I want to know if it's production-grade"
- `/impl-quality-audit` → "Look at everything in Source/DSP/ and tell me what's under-built"
- `/impl-quality-audit` → "How does our APVTS parameter binding compare to standard practice?"
- `/impl-quality-audit` → "Check the preset save/load system against what JUCE recommends"
- `/impl-quality-audit` → "Here's the whole Source folder — audit the entire plugin"

---

## References

- [workflow.md](references/workflow.md) — Full phase-by-phase procedure and domain-specific checks
- [EXAMPLES.md](EXAMPLES.md) — Concrete example audits and expected output shapes
