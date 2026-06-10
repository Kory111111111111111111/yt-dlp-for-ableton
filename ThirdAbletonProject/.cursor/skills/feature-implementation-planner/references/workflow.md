# Feature Implementation Planner Workflow Reference

Use this reference for the full planning sequence and stack-specific implementation considerations.

## Planning Flow

### Phase 1: Clarify the Request

1. Restate the user-visible outcome.
2. Separate must-haves from nice-to-haves.
3. Identify constraints such as compatibility, performance, security, deadlines, and rollout needs.
4. Define acceptance criteria.

### Phase 2: Inspect Existing Patterns

1. Find similar features or adjacent flows.
2. Identify architecture and extension points.
3. Note naming, validation, error-handling, and testing conventions.
4. Identify fragile integrations or technical debt that affect the design.

### Phase 3: Map the Impact

Identify changes to:

- entry points
- business logic
- persistence or API contracts
- UI state and edge cases
- config, permissions, or flags
- tests and rollout steps

### Phase 4: Compare Options

When multiple approaches are viable, compare them on:

- complexity
- fit with existing patterns
- rollout or migration cost
- regression risk
- long-term maintainability

### Phase 5: Build the Plan

Produce an ordered plan that covers prerequisites, file or module changes, contract changes, UI changes, tests, validation, and rollout.

### Phase 6: Define Done

Completion checks should include functional correctness, compatibility expectations, edge cases, tests, and documentation updates.

## Stack-Specific Guidance

### Next.js / React / Tailwind

- Separate server and client responsibilities early
- Plan loading, empty, error, and responsive states
- Note route and cache invalidation impact

### Python Web Development

- Plan request and response schemas, validation, DB changes, async side effects, and deployment implications

### Kotlin / Java

- Map controller, service, repository, DTO, and transaction impacts

### C++ / JUCE

- Identify host integration points, serialization impact, and thread-boundary-sensitive sequencing