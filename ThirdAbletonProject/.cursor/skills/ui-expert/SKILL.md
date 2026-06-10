---
name: ui-expert
description: 'Apply algorithmic UI design principles, build production-grade frontend interfaces, conduct JUCE UI audits, and detect AI-generated UI patterns. Use when: generating web UI code, designing or reviewing interfaces, building distinctive frontend components, auditing JUCE plugin UIs for premium aesthetics, ensuring design system consistency, detecting vibe-coded or AI-generated design, fixing generic-looking websites, de-slopping a UI, removing AI tropes, identifying cookie-cutter patterns, auditing for AI aesthetics, or making a site look less AI-generated.'
argument-hint: 'Describe the screen, component, design system, or JUCE UI surface to build, audit, or de-slop. For audit mode, describe what looks generic or AI-generated.'
user-invocable: true
disable-model-invocation: false
---

# UI Expert

Apply algorithmic UI design principles derived from cognitive psychology and mathematical design systems to generate consistent, ergonomic, and accessible interfaces.

## When to Use

- Building or redesigning a web page, component, or full UI flow where visual quality and interaction design matter.
- Auditing an interface for accessibility, hierarchy, spacing, consistency, or conversion-oriented UX.
- Creating a distinctive design system instead of a generic default layout.
- Detecting and fixing AI-generated or vibe-coded UI patterns — see **UI De-Slop: Audit & Fix Mode** below.
- Reviewing or polishing a JUCE plugin UI against higher-end desktop audio standards.
- Improving an existing UI after the core feature already works and the remaining question is design quality.

If the primary problem is an unclear bug or broken behavior, use `root-cause-debugging` first. If the UI already changed and you need a risk review, use `code-change-review` first, then return to this skill for design-specific improvements.

## Core Philosophy

AI coding agents are text-native constructs that excel at code syntax and DOM structures but lack human spatial reasoning and visual judgment. To generate robust UI code, you must translate abstract design principles into deterministic, mathematical rulesets.

**Critical Rule**: Never rely on "vibe coding" or aesthetic intuition. Always apply explicit, programmatic constraints.

## Quick Decision Framework

### Component Selection Algorithm

Use this decision tree to select the optimal UI component based on data constraints:

| Data Constraint | Component | Justification |
|----------------|-----------|---------------|
| 2-4 mutually exclusive options | Radio buttons | Hick's Law: expose all options immediately, eliminate menu interaction cost |
| 2 mutually exclusive states | Toggle switch | Real-time effect, maps to physical switch mental model |
| Multiple independent options | Checkboxes | Select none/one/several without forced exclusivity |
| 5-10 mutually exclusive options | Select/dropdown | Conserves screen real estate, but avoid for <5 or >10 options |
| >10 options or complex data | Searchable text field/autocomplete | Bypasses Hick's Law via recall vs recognition |
| Deep hierarchical data | Miller's Columns | One hierarchy level at a time, respects working memory limits |
| Broad comparative data | Tree structures | Side-by-side branch comparison with strict node virtualization |

### Layout Pattern Selection

| Content Type | Pattern | Implementation |
|--------------|---------|----------------|
| Dense text, dashboards, search results | F-Pattern | Strict left-align, heavy font weights for first words, bulleted lists |
| Sparse, conversion-focused pages | Z-Pattern | Logo top-left, nav top-right, hero diagonal, CTA bottom-right |

## Mathematical Design Systems

### 8-Point Grid System

All dimensions must be multiples of 8 (8px, 16px, 24px, 32px, 40px, 48px). Half-steps of 4px permitted only for tight component adjustments.

**Why**: Ensures clean scaling across 1.5x, 2x, 3x pixel densities without sub-pixel rendering artifacts.

**Implementation**:
- Use CSS custom properties: `--space-1: 4px`, `--space-2: 8px`, `--space-3: 16px`, etc.
- Prefer layout primitives (Stack component with flexbox gap) over element margins
- Never hardcode arbitrary pixel values

### Typography Scales

Apply modular scales based on interface requirements:

| Scale Type | Ratio | Use Case |
|------------|-------|----------|
| High-contrast | 1.618 (Golden) or 1.414 | Marketing sites, landing pages, dramatic hierarchy |
| Medium-contrast | 1.333 (Perfect Fourth) or 1.250 | Articles, e-commerce, standard applications |
| Low-contrast | 1.067 (Minor Second) or 1.125 | Data-dense dashboards, complex mobile interfaces |

**Line Height Rules**:
- Body copy: 1.5–1.7 ratio (1.65 is a reliable default; 16px font = 26px line height)
- Headings: 1.1-1.35 ratio (tighter as size increases)

### WCAG 2.1 Contrast Requirements

| Element | Level AA | Level AAA |
|---------|----------|-----------|
| Normal text (<18pt or <14pt bold) | 4.5:1 | 7.0:1 |
| Large text (≥18pt or ≥14pt bold) | 3.0:1 | 4.5:1 |
| UI components, icons, focus rings | 3.0:1 | N/A |

**Note**: No fractional rounding permitted. 4.47:1 fails a 4.5:1 requirement.

## Cognitive Laws

### Hick's Law
Decision time increases logarithmically with choice complexity. Minimize choices when rapid response is critical. Break complex processes into sequential steps.

### Miller's Law
Humans hold 4±1 items in working memory. Group information into meaningful chunks. Limit visible options to respect this constraint.

### Fitts's Law
Target acquisition time depends on distance and target size. Larger targets are faster to acquire. Place related controls proximally. Exploit infinite screen edges for critical navigation.

## Gestalt Principles

| Principle | Application |
|-----------|-------------|
| Proximity | Bind related labels to inputs via spacing; distance unrelated fields |
| Common Region | Group elements with subtle backgrounds, borders, or card containers |
| Similarity | Consistent visual characteristics imply identical functionality |
| Prägnanz (Simplicity) | Prioritize clarity; avoid convoluted geometries |

## Behavioral Heuristics

| Law | Implementation |
|-----|----------------|
| Goal-Gradient Effect | Progress bars accelerate near completion to boost completion rates |
| Doherty Threshold | Keep interactions under 400ms; heavy animations cause frustration |
| Von Restorff Effect | Primary buttons use high-contrast accent colors distinct from secondary |
| Serial Position Effect | Place critical navigation at menu extremes (first/last) |
| Aesthetic-Usability Effect | Polished visuals forgive minor usability flaws |
| Jakob's Law | Users expect your site to work like others they know; follow conventions |

## Design Token Architecture

Never hardcode values. Always reference tokens:

```css
/* Bad */
color: #3B82F6;
padding: 15px;

/* Good */
color: var(--color-primary-500);
padding: var(--space-4);
```

Token categories:
- `--color-*`: Semantic color tokens (primary, secondary, success, error, etc.)
- `--space-*`: 8-point grid spacing (1-4px, 2-8px, 3-16px, 4-24px, 5-32px, etc.)
- `--font-size-*`: Modular scale typography
- `--line-height-*`: Contextual line heights

## State Persistence & Mental Models

- Retain user inputs globally across workflow steps
- Provide intelligent auto-complete
- Use sensible defaults
- State format requirements upfront (placeholders, inline helpers)
- Match established mental models: checkboxes allow multi-select, radio buttons are mutually exclusive

## Implementation Checklist

Before finalizing UI code:

- [ ] All spacing follows 8-point grid (multiples of 8)
- [ ] Typography uses modular scale, not arbitrary sizes
- [ ] Color contrast meets WCAG 2.1 AA minimums
- [ ] Component selection follows Hick's/Miller's decision table
- [ ] Layout pattern matches content type (F vs Z)
- [ ] Interactive targets meet minimum size requirements (Fitts's Law)
- [ ] State persistence implemented for multi-step workflows
- [ ] Design tokens used exclusively (no hardcoded values)
- [ ] Follows Jakob's Law: uses familiar patterns, not novel inventions
- [ ] No AI aesthetic defaults: Inter-only font, purple/indigo gradient, uniform `rounded-xl` on everything, or three-box icon grid without intentional deviation

## Additional Resources

- For detailed cognitive principles: [reference.md](reference.md)
- For implementation examples: [examples.md](examples.md)
- For source links and references: [resources.md](resources.md)
- For AI slop pattern catalog (typography, color, layout, component tropes): [references/anti-patterns.md](references/anti-patterns.md)
- For the de-slop audit workflow and interactive clarification templates: [references/audit-workflow.md](references/audit-workflow.md)

---

## Frontend Design

When asked to build web components, pages, or applications, commit to a bold aesthetic direction and implement real working code with exceptional attention to detail.

### Design Thinking

Before coding, understand the context and commit to a clear aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an intentional aesthetic extreme: brutally minimal, maximalist, retro-futuristic, organic, luxury/refined, playful, editorial, brutalist, art deco, soft/pastel, industrial, etc.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

### Frontend Aesthetics Guidelines

- **Typography**: Choose fonts that are beautiful, unique, and characterful. Avoid generic fonts like Arial and Inter. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic using CSS variables. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prefer CSS-only for HTML. Use Motion library for React when available. One well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth. Add contextual effects — gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, grain overlays.

**NEVER** use generic AI aesthetics: Inter/Roboto/Arial/system fonts, purple gradients on white, predictable layouts, or cookie-cutter patterns without context-specific character. Vary between light and dark themes across generations; never converge on common choices like Space Grotesk.

### Implementation Standard

Match complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations. Minimalist designs need restraint, precision, and careful attention to spacing and subtle details.

---

## UI De-Slop: Audit & Fix Mode

Use this mode when a UI looks generic, AI-generated, vibe-coded, or like it came out of a Bolt/v0/Claude default. The goal is to identify the specific patterns that mark it as AI-generated and fix them — with the user's explicit direction at every design decision point.

**This mode is interactive.** The agent cannot make visual judgments. Every Critical and High finding must be paused on, explained, and resolved with the user's chosen aesthetic direction before changes are applied.

### When to Invoke
- The user says the UI looks "vibe coded", "AI generated", "generic", "cookie cutter", or "like every other site"
- The user asks to "de-slop" the UI or remove AI tropes
- The user wants a site/app to look less like an AI built it
- You are about to generate a new UI and want to avoid AI clichés proactively

### Procedure

**Step 1 — Scan**: Read all CSS, component, and layout files. Catalog every pattern against the [AI Slop Checklist in references/anti-patterns.md](references/anti-patterns.md#the-ai-slop-checklist).

**Step 2 — Score**: Classify each finding as Critical, High, Medium, or Low severity. A UI with 3+ Critical findings is substantially AI-looking; report the full count.

**Step 3 — PAUSE and clarify**: For every Critical or High finding, stop and ask the user which direction they want to go. Follow the [Clarification Template in references/audit-workflow.md](references/audit-workflow.md#phase-3-clarify--ask-before-fixing). Never silently fix a design decision.

**Step 4 — Fix systematically**: Apply changes in this order: tokens → typography → color → layout → components. Show before/after for each change.

**Step 5 — Consistency check**: Verify no old patterns crept back in. All values must reference tokens; no new hardcoded hex or arbitrary pixel values.

### What Marks a UI as AI-Generated

The most common signals (full catalog in [references/anti-patterns.md](references/anti-patterns.md)):
- **Inter font as the only typeface** — the #1 AI default, zero intentionality
- **Purple/indigo gradient** — the literal Tailwind median, seen on millions of AI-generated pages
- **Three-column icon grid** (icon + title + description, center-aligned, uniform padding)
- **Generic SaaS template structure**: hero → features → testimonials → CTA
- **Uniform `rounded-xl`** on every element — no nested corner logic
- **Copy-pasted Tailwind utility strings** with no shared tokens
- **Pure `#000`/`#fff`** as base colors (violates Anthony Hobday's near-black/near-white rule)
- **`fade-in-up` on every section** — no motion language, just an animation default
- **Dark mode as `bg-gray-900 text-white`** inversion — not a dark-mode design

### Design Direction Questions

When asking the user for design direction, offer concrete alternatives that span different aesthetics. Don't ask "what font do you want?" — ask "should this feel editorial (serif + minimal), technical (monospace + geometric), luxury (high contrast + tight tracking), or something else? Describe the mood."

See [references/audit-workflow.md](references/audit-workflow.md) for the full interactive workflow including templates and fix sequencing.

---

## JUCE UI Audit (JUCE 8.0.8)

### When to Use
- Reviewing a new JUCE UI component for aesthetic alignment.
- Polishing an existing plugin interface to a "Boutique/High-End" standard.
- Checking for UI/UX workflow efficiency and component hierarchy in a JUCE project.

### Approach
Evaluate visual identity, signal flow visualization, modern minimalism, tactility, and technical implementation (CustomLookAndFeel integrity).
Prioritize visual excellence and authoritative guidance. Provide specific, code-ready design fixes rather than vague suggestions.

### Procedure
1. **Visual Identity Audit**: Check glassmorphism, glows (20% opacity), modern minimalism, and breathing room.
2. **Color Palette & Typography**: Ensure harmony, deep charcoal/slate-blue bases, and MANDATORY use of `GMarketSans` font. No hardcoded colors; use `CustomLookAndFeel`.
3. **Signal Flow & Layout**: Ensure UI layout follows audio signal path. Verify ADSR grouping and "Three-Click" rule for deep settings.
4. **Interaction**: Verify knob response, micro-animations, and clear parameter value displays.
5. **Technical Integrity**: Verify no allocations in `paint()`, use of vector paths, and semantic naming in LookAndFeel.

### Audit Output Format
Produce a detailed UI Audit report with:
1. The Flaw (why it looks cheap/uncorroborated)
2. The "Correct Way" (authoritative, specific design fix)
3. Severity (High, Medium, Low)
4. Reference (JUCE best practice or premium VST standard)

Save the audit log to `MIDITOOLS/Summaries/`.
