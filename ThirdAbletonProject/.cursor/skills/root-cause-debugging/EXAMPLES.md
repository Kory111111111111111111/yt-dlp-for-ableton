# Root Cause Debugging Examples

This file shows how the skill should behave across common debugging scenarios.

## Example 1: Next.js Regression After Navigation

**Prompt**:

```text
/root-cause-debugging
This React page only crashes after navigating back from checkout.
```

**What good behavior looks like**:

- Restate the symptom precisely and distinguish first-load behavior from back-navigation behavior.
- Ask for or inspect reproduction steps before suggesting a fix.
- Trace cache, route state, server/client boundaries, and effect timing.
- Conclude with a verified root cause, not a list of guesses.

**Good output shape**:

```text
Symptom: Crash occurs only after returning from checkout via browser back.
Reproduction: Add item -> checkout -> browser back -> product page crashes.
Evidence: Stack trace points to undefined order summary state during hydration.
Root cause: Component assumes checkout context is still present after back navigation, but cache is rehydrated without that state.
Fix: Guard the state boundary and rebuild summary state from route data.
Validation: Reproduced before fix, re-ran flow after fix, added regression test for back navigation.
```

## Example 2: Pytest Fails Only in CI

**Prompt**:

```text
/root-cause-debugging
Pytest passes locally but fails in CI with a database timeout.
```

**What good behavior looks like**:

- Compare local versus CI environment and test ordering.
- Check connection pool limits, startup dependencies, and seeded data assumptions.
- Avoid generic advice like "increase timeout" unless evidence supports it.

## Example 3: JUCE Automation Crackle

**Prompt**:

```text
/root-cause-debugging
My JUCE plugin crackles only when parameter automation is enabled.
```

**What good behavior looks like**:

- Distinguish audio thread from message thread behavior.
- Check locking, allocation, smoothing, and parameter update frequency.
- Prefer realtime-safety analysis over UI-focused guesses.