# Root Cause Debugging Workflow Reference

Use this reference for the full investigation flow and stack-specific debugging checks.

## Investigation Flow

### Phase 1: Define the Symptom

1. Restate the failure precisely.
2. Capture logs, traces, assertions, screenshots, or user steps.
3. Clarify expected behavior versus actual behavior.
4. Note whether the issue is deterministic, intermittent, environment-specific, or data-specific.

### Phase 2: Reproduce Reliably

1. Identify the shortest reproduction path.
2. Reproduce locally first when possible.
3. Narrow the trigger by route, input, thread, build target, runtime version, or ordering.
4. If flaky, vary timing, concurrency, cache state, and network conditions deliberately.

### Phase 3: Trace the Execution Path

1. Walk backward from the failure point.
2. Trace inputs across parameters, APIs, state, caches, config, and feature flags.
3. Check nearby diffs, upgrades, and behavior changes.
4. Test one hypothesis at a time and eliminate weak ones with evidence.

### Phase 4: Isolate the Root Cause

Typical classes:

- bad data shape or nullability assumption
- lifecycle ordering or state mutation bug
- async race or stale cache
- environment mismatch
- server and client boundary mistake
- hidden dependency or shared configuration side effect
- API contract drift
- lifetime, ownership, or thread-safety bug

### Phase 5: Fix and Validate

1. Choose the smallest fix that addresses the verified cause.
2. Check nearby flows for the same bug class.
3. Add tests where practical.
4. Re-run the reproduction and regression checks.

## Stack-Specific Guidance

### Next.js / React / Tailwind

- Check server and client boundaries
- Verify hydration, effect timing, routing, and cache invalidation
- Compare dev versus production behavior

### Python Web Development

- Check validation, async boundaries, serialization, DB transactions, and background jobs
- Compare local, test, and deployed environments

### Kotlin / Java

- Trace controller, service, DTO, and transaction boundaries
- Check nullability assumptions, exception translation, and profile-specific config

### C++ / JUCE

- Check thread ownership, locking, realtime safety, and object lifetime
- Distinguish audio-thread and message-thread behavior carefully