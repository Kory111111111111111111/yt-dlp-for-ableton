# Security and Hardening Workflow Reference

Use this reference for detailed security review flow and stack-specific hardening checks.

## Review Flow

### Phase 1: Map the Attack Surface

1. Identify entry points.
2. Identify sensitive assets.
3. Identify trust boundaries and privilege transitions.

Common entry points:

- HTTP routes and RPC endpoints
- forms, uploads, and webhooks
- CLI arguments, config files, and env vars
- filesystem, database, and external integrations
- plugin, host, and IPC boundaries

### Phase 2: Review Core Controls

Check:

- authentication
- authorization
- input validation
- output encoding
- secret handling
- error handling
- dependency hygiene

### Phase 3: Review Common Vulnerability Classes

- SQL injection, command injection, template injection
- XSS, CSRF, SSRF, open redirects
- path traversal and unsafe file handling
- broken access control and IDOR
- insecure deserialization and unsafe parsing
- missing rate limiting or abuse controls
- misconfigured CORS, cookies, or headers
- overly permissive logging or telemetry
- memory safety and lifetime issues in native code

### Phase 4: Propose Hardening Changes

For each finding:

1. Describe the exploit path.
2. Rank severity.
3. Recommend the smallest effective mitigation.
4. Prefer safer defaults over isolated patches.
5. Add defensive tests or validation when practical.

### Phase 5: Validate

1. Re-check the original exploit path.
2. Verify legitimate workflows still work.
3. Confirm logs and errors remain useful without leaking sensitive detail.
4. Note residual architectural or infrastructure risks.

## Stack-Specific Guidance

### Next.js / React / Tailwind

- Check server actions, API routes, auth middleware, cookie settings, and browser data exposure

### Python Web Development

- Check request schemas, ORM usage, uploads, subprocess calls, settings, and debug behavior

### Kotlin / Java

- Check controller and service authorization boundaries, deserialization, validation, and profile defaults

### C++ / JUCE

- Check bounds, ownership, unsafe casts, preset parsing, and hostile host or file input handling