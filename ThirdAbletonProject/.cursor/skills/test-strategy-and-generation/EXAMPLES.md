# Test Strategy and Generation Examples

This file shows how the skill should choose test boundaries and generate focused coverage.

## Example 1: Pagination Regression

**Prompt**:

```text
/test-strategy-and-generation
Add regression tests for this pagination bug.
```

**What good behavior looks like**:

- Identify the broken contract first: duplicated items, skipped page, or wrong total.
- Choose the lowest stable layer that proves the fix.
- Add the regression case plus one adjacent edge case.

**Good output shape**:

```text
Recommended level: Service integration test plus one API contract test.
Cases:
1. Returns page 2 without duplicating final item from page 1.
2. Handles empty final page correctly.
3. Preserves total count metadata.
Generated tests: Added fixture-backed pagination tests using existing helpers.
Manual gap: Full UI infinite-scroll behavior still needs exploratory verification.
```

## Example 2: Spring Service Flow

**Prompt**:

```text
/test-strategy-and-generation
What tests should back this new Spring service flow?
```

**What good behavior looks like**:

- Prefer service-level tests for domain rules, not only controller tests.
- Match the repo's conventions for fixtures, mocks, and naming.
- Cover permission and transaction failure behavior if relevant.

## Example 3: Upload Endpoint in Python

**Prompt**:

```text
/test-strategy-and-generation
Generate the right pytest coverage for this upload endpoint.
```

**What good behavior looks like**:

- Cover happy path, invalid file type, oversize file, and permission errors.
- Prefer focused API/integration tests over brittle end-to-end coverage.
- Call out any remaining manual checks, such as storage provider integration.