# UI De-Slop Audit Workflow

Use this workflow when auditing an existing UI for AI/vibe-coded patterns, or when building new UI that needs to avoid generic aesthetics.

## Core Principle

An agent cannot see what it builds. It cannot judge whether padding looks cramped, whether an accent clashes with a header, or whether a layout feels awkward. The workflow below compensates for that limitation by making every design decision **explicit and confirmed by the human**.

> "Design systems exist precisely to solve consistency at scale. But they require visual judgment to create and maintain. You can't prompt your way to a coherent design language."
> — paddo.dev

---

## Phase 1: Scan — Identify AI Tropes

Before making any changes, read all relevant UI code and score it against the [anti-patterns catalog](./anti-patterns.md).

**Collect evidence for each category:**

### Typography
- [ ] What font(s) are in use? Are they Inter/Roboto/Arial/system-ui only?
- [ ] Is there a display font for headings vs. a body font?
- [ ] Is `font-display: swap` declared on `@font-face` rules?
- [ ] Is there a typographic scale, or are sizes arbitrary?
- [ ] Does letter-spacing tighten at larger sizes?

### Color & Tokens
- [ ] Are CSS custom properties used, or are hex values hardcoded?
- [ ] Is there a purple/indigo/violet gradient anywhere?
- [ ] Is the base background pure `#fff` or `#000`?
- [ ] Are neutrals saturated (warm or cool tint)?
- [ ] How many distinct blue/purple values exist? (Count them)
- [ ] Does dark mode have real elevation logic, or just `bg-gray-900`?

### Layout
- [ ] Does the page follow: hero → feature grid → testimonials → CTA?
- [ ] Is hero content center-aligned?
- [ ] Is the same padding value repeated on most sections?
- [ ] Is there any asymmetry, diagonal flow, or grid-breaking element?

### Components
- [ ] Is there a three-column icon grid?
- [ ] What border-radius values are used? Are they uniform across everything?
- [ ] Is the same `rounded-xl shadow-md` pattern on most cards?
- [ ] Are `fade-in-up` animations applied to every section?
- [ ] Are there mixed depth techniques (shadows on some, borders on others)?

### Code Hygiene
- [ ] Are Tailwind utility strings copy-pasted across files?
- [ ] Are there multiple shades of the same color with no system?
- [ ] Is glassmorphism applied without a rich background behind it?

---

## Phase 2: Report — Categorize Findings

Group findings into severity tiers:

| Severity | Meaning |
|----------|---------|
| **Critical** | Immediately marks the design as AI-generated (purple gradient, Inter-only, generic SaaS template structure) |
| **High** | Significantly undermines distinctiveness (no token system, uniform radius, three-box grid) |
| **Medium** | Degrades design quality (missing typographic scale, identical spacing, mixed depth) |
| **Low** | Polish issues (letter-spacing, line-height, shadow technique consistency) |

---

## Phase 3: Clarify — Ask Before Fixing

**STOP. Do not apply fixes autonomously.**

For each Critical or High severity finding, ask the user to choose a direction. Present the finding, explain why it reads as AI-generated, and offer concrete alternative directions.

### Clarification Template

```
I found [N] issues that mark this UI as AI-generated. Before I fix them,
I need your direction on a few key decisions:

**[Issue 1 — e.g., Typography: Inter-only font]**
Currently: `font-family: 'Inter', sans-serif` on everything.
Why it reads as AI: Inter is the #1 default in every AI-generated UI.
Your options:
  A) Editorial — Pair a serif display font (Playfair Display, Cormorant) with Inter body
  B) Technical/Clean — Pair a geometric display (Syne, Space Grotesk) with IBM Plex Mono
  C) Distinctive — Pick a single expressive variable font (Fraunces, Instrument Serif) for both
  D) Tell me what feel you want and I'll propose specific fonts

**[Issue 2 — e.g., Color: Purple gradient hero]**
Currently: `background: linear-gradient(135deg, #8B5CF6, #3B82F6)`
Why it reads as AI: This is the literal Tailwind default. Every AI tool outputs this.
Your options:
  A) Remove gradient entirely — single intentional background color
  B) Use your brand color as the gradient anchor instead
  C) Replace with a rich atmospheric texture or noise overlay
  D) Tell me the mood you want (luxury, editorial, playful, industrial, etc.)
```

**Do not proceed to Phase 4 until the user responds to all Critical/High findings.**

---

## Phase 4: Fix — Apply Changes Systematically

Apply fixes in this order to avoid cascading conflicts:

1. **Tokens first** — Establish the CSS custom property system before touching any component
2. **Typography second** — Load fonts, set the scale, fix hierarchy
3. **Color third** — Apply palette through tokens, fix neutrals, fix dark mode if present
4. **Layout fourth** — Break structural clichés, fix spacing hierarchy
5. **Components last** — Fix radius, shadow consistency, animation

For each fix, show the before/after and explain why the change removes the AI-generated signal.

### Fix Example: Typography

```css
/* BEFORE — AI slop */
body { font-family: 'Inter', system-ui, sans-serif; }
h1   { font-size: 48px; font-weight: 700; }
h2   { font-size: 32px; font-weight: 700; }
p    { font-size: 16px; }

/* AFTER — Intentional editorial pairing */
@font-face {
  font-family: 'Cormorant Garamond';
  src: url('...') format('woff2');
  font-display: swap;
  font-weight: 300 700;
}

:root {
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'Inter', system-ui, sans-serif;
  --text-scale:   1.333;  /* Perfect Fourth */

  --text-xs:  0.75rem;
  --text-sm:  1rem;
  --text-md:  1.333rem;
  --text-lg:  1.777rem;
  --text-xl:  2.369rem;
  --text-2xl: 3.157rem;
}

h1 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.025em;  /* tighter at large sizes — Anthony Hobday */
}
p {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: 1.65;
  max-width: 65ch;  /* ~70 chars — Anthony Hobday */
}
```

### Fix Example: Color Token System

```css
/* BEFORE — hardcoded slop */
.button { background: #8B5CF6; }
.hero   { background: linear-gradient(135deg, #8B5CF6, #3B82F6); }
.card   { background: #1e293b; }
body    { background: #000; color: #fff; }

/* AFTER — token-driven intentional palette */
:root {
  /* Brand — Warm Charcoal + Amber accent (not purple) */
  --color-brand-50:  hsl(38 95% 95%);
  --color-brand-500: hsl(38 90% 50%);
  --color-brand-900: hsl(38 60% 20%);

  /* Neutrals — warm-tinted (saturated, not gray) */
  --color-bg:        hsl(38 8% 97%);   /* near-white with warmth */
  --color-surface:   hsl(38 6% 93%);
  --color-border:    hsl(38 10% 85%);
  --color-text:      hsl(38 15% 12%);  /* near-black with warmth */
  --color-text-mute: hsl(38 8% 45%);

  /* Semantic */
  --color-primary:  var(--color-brand-500);
  --color-focus:    hsl(215 90% 55%);  /* accessible blue for focus rings */
}
```

### Fix Example: Break The SaaS Template Structure

```
BEFORE (The Generic SaaS Template):
Hero (centered, purple gradient, two buttons)
→ Three-column feature grid
→ Screenshot section
→ Testimonials
→ CTA with gradient

AFTER — ask user: "What's the one thing someone should remember about this site?"
Then break structure around that answer:

Option A — Editorial / Magazine:
Full-bleed typographic hero (huge headline, no subtext)
→ Staggered asymmetric feature layout (2-col alternating)
→ Single pull quote in oversized type
→ Dense case study grid

Option B — Minimal / Luxury:
Extreme negative space hero
→ Single feature with full-width image
→ No testimonials — instead, one notable fact in large type
→ Single CTA with restraint
```

---

## Phase 5: Consistency Check

After applying fixes, verify no old patterns crept back in:

- [ ] All color values reference tokens — no bare hex codes
- [ ] All spacing is from the 8-point grid system
- [ ] No new Inter/purple defaults introduced
- [ ] Border-radius values are nested properly where elements are contained
- [ ] One depth technique used consistently (shadow OR border OR background elevation)
- [ ] Dark mode uses elevation logic (closer = lighter), not just color inversion
- [ ] Font loading includes `font-display: swap`
- [ ] `max-width` on body text respects ~65–70ch line length

---

## Interaction Protocol

When asking the user about design direction, follow this format:

1. **State the finding plainly** — what the code currently does
2. **Name the pattern** — what makes it read as AI-generated
3. **Offer 3 concrete alternatives** — with different aesthetic directions
4. **Let the user choose or describe their own direction**
5. **Confirm before applying**

Never silently fix a Critical or High finding. The user's visual judgment is the source of truth — not the agent's default aesthetic choices.

> "Human: visual decisions, creative direction, edge cases. Agent: reading specs, generating code, mechanical consistency. Neither can do the other's job well."
> — paddo.dev
