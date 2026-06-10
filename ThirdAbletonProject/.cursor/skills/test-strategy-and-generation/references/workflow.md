# Test Strategy and Generation Workflow Reference

Use this reference for the full test-selection flow and stack-specific testing guidance.

## Test Selection Flow

### Phase 1: Understand the Change Surface

1. Define the behavior that changed or must remain true.
2. Decide whether the goal is regression prevention, new feature coverage, refactor safety, or edge-case validation.
3. Identify the most valuable test boundary.

### Phase 2: Choose the Test Level

Prefer the lowest-cost level that still gives strong confidence:

- unit tests for pure logic
- integration tests for boundaries and contracts
- component tests for UI behavior
- end-to-end tests only for critical flows

### Phase 3: Enumerate Cases

Cover:

1. happy path
2. meaningful edge cases
3. failure path
4. known regression case
5. state, permission, or configuration variants when behavior changes

### Phase 4: Generate Tests in Project Style

1. Match existing naming, fixtures, helpers, and test organization.
2. Keep setup minimal.
3. Avoid fragile selectors, sleeps, and unnecessary mocks.
4. Assert observable behavior rather than private implementation details.

### Phase 5: Validate Test Quality

Ask:

- would the test fail for the broken behavior?
- is it deterministic?
- is it smaller than the behavior under test?
- is it asserting the right contract?
- is it redundant with stronger existing coverage?

## Stack-Specific Guidance

### Next.js / React / Tailwind

- Prefer behavior checks with React Testing Library style patterns
- Reserve E2E for critical route, auth, or checkout flows

### Python Web Development

- Prefer focused pytest fixtures and integration tests for API or DB boundaries

### Kotlin / Java

- Match the repo's stack such as JUnit, Kotest, Spring slices, MockK, or Mockito

### C++ / JUCE

- Prefer deterministic tests for non-realtime logic and be cautious with heavyweight host-specific validation