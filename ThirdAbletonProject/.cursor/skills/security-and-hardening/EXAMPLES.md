# Security and Hardening Examples

This file shows the expected review style for practical hardening work.

## Example 1: Auth Flow Review

**Prompt**:

```text
/security-and-hardening
Review this auth flow for access-control mistakes.
```

**What good behavior looks like**:

- Map trust boundaries first: login, session issue, protected route, admin action.
- Check both authentication and authorization separately.
- Flag missing server-side authorization even if the UI hides admin actions.
- Rank findings by severity and exploitability.

**Good output shape**:

```text
Scope: Login endpoint, session middleware, admin dashboard actions.
Boundary review: Browser -> API route -> session store -> admin service.
High severity: Admin action checks role in client UI only; server route accepts any authenticated user.
Mitigation: Enforce role check in server route and service boundary.
Validation: Re-test with non-admin session; confirm 403 and no state change.
Residual risk: Audit related admin routes for the same pattern.
```

## Example 2: Upload Endpoint Review

**Prompt**:

```text
/security-and-hardening
Check this upload endpoint for common security issues.
```

**What good behavior looks like**:

- Review file type validation, size limits, storage path safety, and malware or parsing exposure.
- Check whether uploaded filenames can trigger path traversal or overwrite behavior.
- Verify error responses do not leak internal paths.

## Example 3: JUCE Preset Loading

**Prompt**:

```text
/security-and-hardening
Audit this JUCE preset-loading code for unsafe parsing or memory problems.
```

**What good behavior looks like**:

- Check bounds, ownership, parsing assumptions, and malformed state handling.
- Call out denial-of-service risks from oversized or hostile preset data.
- Recommend smallest defensive checks that preserve normal host compatibility.