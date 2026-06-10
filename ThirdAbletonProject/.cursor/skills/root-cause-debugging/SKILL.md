---
name: root-cause-debugging
description: 'Find the actual cause of bugs, failures, flaky tests, build errors, and regressions before proposing a fix. Use when: debugging runtime errors, CI failures, broken features, inconsistent behavior, JUCE/CMake build errors, or production incidents.'
argument-hint: 'Describe the bug, failure, or symptom and any evidence you already have'
user-invocable: true
disable-model-invocation: false
---

# Root Cause Debugging

## When to Use

- A bug is reproducible but the cause is unclear
- A test is failing or flaky and the failure mode is misleading
- A build passes locally but fails in CI
- A feature regressed after a recent change
- Logs, stack traces, or user reports point to a symptom but not the source

## Approach

Debugging should converge on the smallest verified explanation for the failure. Do not jump from symptom to fix. Gather evidence, reproduce deliberately, trace the execution path, isolate the failing assumption, and only then recommend or implement a change.

Prefer evidence over intuition. Every hypothesis should be checked against logs, code paths, data shape, runtime environment, and recent changes.

## Procedure

1. Define the symptom precisely and gather evidence.
2. Reproduce the issue with the shortest reliable path you can find.
3. Trace the execution path and test hypotheses one at a time.
4. Isolate the smallest verified explanation for the failure.
5. Fix and validate against the original reproduction.

Use [workflow.md](references/workflow.md) for the full investigation flow and stack-specific checks.

## Output

Produce a concise debugging report with:

1. Symptom summary
2. Reproduction steps
3. Evidence reviewed
4. Root cause
5. Recommended or implemented fix
6. Validation performed
7. Residual risks or follow-up checks

## Example Usage Prompts

- `/root-cause-debugging` -> "This React page only crashes after navigating back from checkout"
- `/root-cause-debugging` -> "Pytest passes locally but fails in CI with a database timeout"
- `/root-cause-debugging` -> "My JUCE plugin crackles only when automation is enabled"

## Examples

See [EXAMPLES.md](EXAMPLES.md) for example prompts, expected investigation patterns, and output shapes.

## JUCE 8.0.8 Specific Protocol (WAVFin)

When debugging JUCE C++ audio plugin projects:
1. **Efficiency Principle (Kory's Rule)**: If an issue isn't fixed after 2 tries, STOP incremental changes and rewrite the function from the ground up.
2. **Comprehensive Audit**: Audit the entire file/logic flow, not just the symptom area.
3. **Thread Safety**: Ensure NO memory allocations or locks on the audio thread.
4. **Documentation Check**: Always reference JUCE documentation via `jucedoclinks.mdc`.
5. **Output**: Save your detailed summary to `MIDITOOLS/Summaries/`.

### JUCE Build Error Protocol

When the failure is a build, CMake, compilation, or linker error:
1. **Analyze the error**: Identify the specific file, line number, and error code.
2. **Root Cause**: Determine if it's a syntax error, API change (e.g. JUCE 8 breaking change), missing `#include`, or missing CMake linkage.
3. **JUCE 8 API Changes**: Check if the identifier/class was renamed in JUCE 8 (e.g. `LadderFilterMode::LPF24` instead of `LP24`).
4. **Fix and verify**: Write the correct code or CMake configuration and verify against JUCE documentation.

**Example**: `C2065 'LP24': undeclared identifier` → In JUCE 8.0.8 `juce::dsp::LadderFilterMode` enumerators include an 'F' suffix → `filter.setMode(juce::dsp::LadderFilterMode::LPF24);`

## References

- [../../copilot-instructions.md](../../copilot-instructions.md) - Shared investigation and validation standards
- [workflow.md](references/workflow.md) - Detailed investigation flow and stack-specific guidance