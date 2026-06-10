# Idea to Project Workflow Reference

This reference contains the detailed workflow, prompts, and fallback patterns for the skill.

## Phase 1: Conversational Discovery

**Goal**: Understand the user's core idea, problem, and vision through natural dialogue.

### Agent Behavior

1. **Opening**: Ask the user to describe their idea naturally, without requiring polished language.
   - Example: "Tell me about your idea. What's the spark here, and what problem are you trying to solve?"
2. **Probe deeper on problem and pain point**.
   - If vague: "You mentioned organization. What specifically is hard about this today?"
3. **Map the users**.
   - "Who feels this pain?"
4. **Uncover motivation and constraints**.
   - Timeline
   - Team size
   - Tech preferences
   - Success definition
5. **Extract features organically**.
   - "What's the first thing someone would do when they open this?"
   - "What would make it worth their time?"
   - "Anything you'd remove to keep it simple?"
6. **Validate and summarize**.

### Decision Gate

- Move forward when the problem, users, 2-3 core features, and major constraints are clear.
- Loop back if the request is still vague or contradictory.

## Phase 2: Research and Validation

**Goal**: Ground the idea in reality by researching what exists and what patterns already work.

### Agent Behavior

1. Identify search terms from the discovery phase.
2. Find 3-7 existing projects, tools, or competitors.
3. Record names, URLs, key features, target users, and pricing when relevant.
4. Analyze patterns, strengths, weaknesses, and market gaps.
5. Present findings conversationally and let the user react.

### Decision Gate

- Proceed if the user still sees a viable angle.
- Pivot if the space is crowded and the idea needs differentiation.
- Pause if the user wants to rethink the problem.

## Phase 3: Feature Definition and Project Spec

**Goal**: Produce a collaborative project specification.

### Agent Behavior

1. Frame the next step as co-authoring a spec.
2. Build a `PROJECT_SPEC.md` with:
   - project overview
   - feature list
   - requirements
   - architecture
   - UI or theming outline
3. Iterate on feature priority and scope.
4. Validate completeness before moving on.

### Decision Gate

- Continue when the user agrees the spec is complete enough for implementation or design work.

## Phase 4: Design System and UI Theming

**Goal**: Define a practical design system and interaction direction.

### Agent Behavior

1. Start with tone and product feel.
2. Collaboratively define:
   - color palette
   - typography
   - components and states
   - layout and spacing
   - accessibility expectations
   - responsiveness strategy
3. Provide implementation-oriented examples in the chosen stack.
4. Iterate until the direction is coherent and usable.

### Deliverable

Create `DESIGN_SYSTEM.md` or append an approved design section to `PROJECT_SPEC.md`.

## Conversational Tips

- Listen more than direct.
- Validate after each phase.
- Adapt quickly when the user pivots.
- Stay curious when rationale is unclear.
- Keep the conversation collaborative.