# Feature Implementation Planner Examples

This file shows the level of planning detail expected before code changes begin.

## Example 1: Add Role-Based Access Control

**Prompt**:

```text
/feature-implementation-planner
Plan adding role-based access control to this admin dashboard.
```

**What good behavior looks like**:

- Clarify roles, permissions, and backward compatibility.
- Inspect current auth and routing patterns before proposing architecture.
- Produce an ordered plan covering middleware, server checks, UI states, and tests.

**Good output shape**:

```text
Goal: Restrict admin actions by role without breaking existing authenticated flows.
Acceptance criteria: Non-admins can sign in but cannot view or execute admin-only actions.
Patterns found: Existing session middleware and route-level guard pattern in billing area.
Impacted areas: auth middleware, admin API routes, dashboard navigation, role seed data, tests.
Recommended approach: Enforce authorization on the server first, then mirror in UI.
Plan:
1. Add role enum and permission mapping.
2. Extend session payload with role.
3. Add route/service authorization guards.
4. Update UI visibility and error states.
5. Add integration and regression tests.
6. Validate non-admin, admin, and unauthenticated flows.
```

## Example 2: Next.js Billing Settings Page

**Prompt**:

```text
/feature-implementation-planner
Plan a billing settings page in our Next.js app without breaking existing routes.
```

**What good behavior looks like**:

- Separate server-side data loading from client interactions.
- Include route, loading, error, and empty states.
- Call out rollout concerns if the feature depends on flags or new API contracts.

## Example 3: JUCE Offline Preset Browser

**Prompt**:

```text
/feature-implementation-planner
Map the work to add offline preset browsing in this JUCE app.
```

**What good behavior looks like**:

- Identify file indexing, background scanning, UI state, and thread boundaries.
- Sequence the work to avoid unsafe audio-thread interactions.
- Include validation for host behavior and corrupted preset files.