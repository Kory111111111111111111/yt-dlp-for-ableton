# Code Change Review Workflow Reference

This reference contains the full review checklists and step-by-step procedure for thorough reviews.

## Review Checklist: Logic and Implementation

### 1. Context and Intent

- Change aligns with the stated objective.
- No gold-plating or unnecessary complexity.
- Solution fits the codebase's normal path.

### 2. Unintended Side Effects

- Called functions do not behave unexpectedly in this context.
- Shared state mutations are understood.
- Configuration or globals are not changed accidentally.
- Lifecycle hooks do not trigger side effects elsewhere.

### 3. Error Handling and Edge Cases

- Null, empty, and malformed inputs are handled.
- Boundary conditions are considered.
- External failures are handled correctly.
- Error messages remain actionable.

### 4. Implementation Correctness

- Logic matches real project intent.
- Assumptions about data shape are validated.
- Loop and branch behavior is correct.
- Implicit coercions or weak typing do not create surprises.

### 5. Code Style and Patterns

- Naming and structure match local conventions.
- No inconsistent patterns relative to nearby code.
- Functions are not doing too many things.

### 6. Dependencies and Imports

- Imports are used.
- No circular dependencies are introduced.
- Dependency versions and APIs remain compatible.

### 7. Performance and Scalability

- No repeated unnecessary work.
- No accidental large allocations or deep nesting.
- No debug logging or leftover instrumentation remains.

## Review Checklist: UI and UX Consistency

### 1. Visual Consistency

- Typography follows established hierarchy.
- Colors come from defined palette or tokens.
- Spacing and radii match the system.

### 2. Layout and Placement

- Component fits surrounding hierarchy and alignment.
- Responsive behavior remains sound.
- Layering and z-index remain safe.

### 3. Interactive Elements

- Hover, focus, active, and disabled states are coherent.
- Touch targets and keyboard support are acceptable.
- Feedback exists for loading, success, and error states.

### 4. Content and Text

- Labels and capitalization are consistent.
- Text contrast and overflow handling are adequate.

### 5. State Management

- Loading, empty, error, and disabled states are distinct.
- Transitions are not jarring.

### 6. Design System Integration

- Existing components or utilities are preferred over one-off custom styles.
- Theme support remains intact when applicable.

## Step-by-Step Procedure

### Phase 1: Understand the Change

1. Read the request.
2. Scan the diff.
3. Identify whether the change is local or cross-cutting.

### Phase 2: Logic Review

1. Trace execution paths.
2. Check assumptions.
3. Probe edge cases mentally.
4. Compare against project patterns.
5. Evaluate whether the change would hold up in production use.

### Phase 3: UI Review

1. Perform a visual consistency check.
2. Review hierarchy, spacing, and color usage.
3. Check interaction states.
4. Consider mobile, tablet, and desktop behavior.
5. Check theme or dark-mode support when relevant.

### Phase 4: Integration and Context

1. Identify dependent code.
2. Validate config and permissions implications.
3. Check external systems.
4. Confirm whether docs or tests need updates.

### Phase 5: Report and Recommend

- List findings clearly.
- Explain why each issue matters.
- Suggest a fix or mitigation.
- Rank findings by severity.