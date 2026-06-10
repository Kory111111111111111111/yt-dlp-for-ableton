# UI Anti-Patterns: The AI Slop Catalog

This reference catalogs the specific visual, typographic, layout, and code patterns that mark a UI as AI-generated or "vibe coded." These patterns emerge because LLMs are trained on the statistical median of Tailwind tutorials and GitHub repos from 2019–2024. That median is **purple, rounded, Inter-fonted, and three-column**.

> "LLMs gravitate toward the median of every Tailwind tutorial scraped from GitHub between 2019 and 2024. And that median is purple."
> — paddo.dev, *Claude Code Plugins: Breaking the AI Slop Aesthetic* (Nov 2025)

> "Vibe coding often introduces dead code that hangs around like some evolutionary discarded organ."
> — Grady Booch, Feb 2026

---

## Category 1: Typography Tropes

### 1.1 The Safe Font Default
**Pattern:** `font-family: 'Inter', system-ui, sans-serif` on everything. No display font, no serif, no personality.

**Why it reads as AI:** Inter is the #1 most-used Google Font in AI-generated UIs. It signals "I ran out of ideas."

**Also suspect:** Any single font family used for everything — even trendier choices like Space Grotesk, Plus Jakarta Sans, or DM Sans converge when used solo with no pairing strategy. The problem is the absence of a deliberate pairing decision, not any specific font.

**Fix:** Choose a distinctive display font for headings. Pair with a refined body font. Two typefaces max (per MDN/Anthony Hobday best practices). Consider variable fonts for expressive weight ranges.

```css
/* SLOP */
:root { font-family: 'Inter', sans-serif; }
h1, h2, h3, p { font-family: inherit; }

/* INTENTIONAL */
:root { font-family: 'Lora', Georgia, serif; }
h1, h2, h3 { font-family: 'Playfair Display', serif; font-variation-settings: "wght" 700; }
```

### 1.2 Missing font-display: swap
**Pattern:** Web fonts loaded without `font-display: swap`, causing FOIT (Flash of Invisible Text).

**MDN Standard:** Always declare `font-display: swap` in `@font-face` to prevent invisible text during load.

```css
/* SLOP — font blocking */
@font-face { font-family: "MyFont"; src: url("..."); }

/* CORRECT */
@font-face { font-family: "MyFont"; src: url("...") format("woff2"); font-display: swap; }
```

### 1.3 Uniform Weight — No Typographic Hierarchy
**Pattern:** Every heading uses `font-weight: 700`. Body at `font-weight: 400`. Nothing in between. No contrast between display and body sizing.

**Fix:** Apply a modular scale ratio (Perfect Fourth = 1.333 or Golden Ratio = 1.618 for dramatic pages). Set letter-spacing tighter on large text, looser on small text (Anthony Hobday rule: lower letter spacing with larger text).

```css
/* SLOP */
h1 { font-size: 48px; font-weight: 700; }
h2 { font-size: 36px; font-weight: 700; }
p  { font-size: 16px; font-weight: 400; }

/* INTENTIONAL (Perfect Fourth scale) */
:root {
  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   1rem;      /* 16px */
  --text-md:   1.333rem;  /* 21px */
  --text-lg:   1.777rem;  /* 28px */
  --text-xl:   2.369rem;  /* 38px */
  --text-2xl:  3.157rem;  /* 51px */
}
h1 { font-size: var(--text-2xl); font-weight: 900; letter-spacing: -0.03em; line-height: 1.1; }
p  { font-size: var(--text-sm);  font-weight: 400; line-height: 1.65; }
```

### 1.4 Line Height Ignored
**Pattern:** No explicit `line-height` set, relying on browser defaults. Or a single value applied everywhere.

**Rule (MDN/Anthony Hobday):** Body copy needs 1.5 line-height. Headings should tighten to 1.1–1.35. Large display text at 1.0–1.1.

---

## Category 2: Color & Gradient Tropes

### 2.1 The Purple Gradient
**Pattern:** `background: linear-gradient(135deg, #8B5CF6, #3B82F6)` — the canonical AI color signature. Variants include indigo-to-blue, violet-to-purple, purple-to-pink.

These are literally Tailwind's `from-violet-500 to-blue-500` defaults. Zero thought required.

```css
/* THE SLOP — seen 10 million times */
.hero { background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); }

/* ALSO SLOP */
.cta-button { background: linear-gradient(to right, #7C3AED, #4F46E5); }
```

**Fix:** Commit to an intentional palette. Use `oklch()` or `hsl()` for perceptually uniform color. Dominant color with sharp accent beats timid gradients.

### 2.2 Pure Black and Pure White
**Pattern:** `color: #000000` and `background: #ffffff` used as base values.

**Rule (Anthony Hobday):** Never use pure black `#000` or pure white `#fff`. Use near-black and near-white. Saturate neutrals with a hint of your brand hue (<5% saturation in HSB).

```css
/* SLOP */
body { background: #ffffff; color: #000000; }

/* CORRECT */
:root {
  --color-bg:   hsl(220 15% 97%);   /* near-white, slightly cool */
  --color-text: hsl(220 25% 12%);   /* near-black, slightly cool */
}
```

### 2.3 Hardcoded Hex Values Everywhere
**Pattern:** `color: #8B5CF6`, `padding: 15px`, `border-radius: 8px` scattered inline throughout the codebase with no token system.

**MDN Standard:** CSS custom properties on `:root`. Never hardcode values — they break consistency and dark mode.

```css
/* SLOP — "prompt debt" version */
.card { background: #1e293b; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.card:nth-child(2) { background: #1e293b; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); } /* copy-pasted */

/* CORRECT */
:root {
  --color-surface:  hsl(215 28% 17%);
  --radius-card:    0.75rem;
  --space-card:     var(--space-6);        /* 8-point grid: 24px */
  --shadow-card:    0 4px 8px hsl(0 0% 0% / 0.15);
}
.card { background: var(--color-surface); border-radius: var(--radius-card); padding: var(--space-card); box-shadow: var(--shadow-card); }
```

### 2.4 Non-Distinct Palette Brightness
**Pattern:** All colors in the palette have similar brightness/lightness values, making them fight each other.

**Rule (Anthony Hobday):** Colors in a palette should have distinct brightness values so they feel distinctive in both hue and weight.

### 2.5 Dark Mode as Color Inversion
**Pattern:** `dark:bg-gray-900 dark:text-white` — the Tailwind dark mode reflex. Doesn't account for elevation (closer elements should be lighter), doesn't maintain brand identity, doesn't avoid shadows (shadows don't make sense in dark environments — Anthony Hobday).

---

## Category 3: Layout & Structure Tropes

### 3.1 The Generic SaaS Template
**Pattern:** Every page follows this exact structure:
1. Navbar with logo left, links center, CTA button right
2. Full-width hero: centered heading + subtitle + two buttons
3. "Trusted by" logos strip
4. Three-column feature grid (icon + title + description)
5. Screenshot or mockup section
6. Testimonials (avatar + stars + quote)
7. Pricing cards (3 tiers)
8. CTA section with gradient background
9. Footer with 4 column links

This isn't wrong — it's just invisible. Nobody notices it. Nobody remembers it.

**Fix:** Break at least one structural expectation. Asymmetry, diagonal flow, grid-breaking elements, or unexpected component placement signals deliberate design.

### 3.2 Everything is Centered
**Pattern:** `text-align: center` on all headings, descriptions, and hero copy. Also: content max-width containers centered with `mx-auto` on every section with identical padding.

**Problem:** Centered text loses F-pattern readability for dense content (NNGroup). Reserve center-align for short display text only.

### 3.3 Identical Spacing On Everything
**Pattern:** `p-6` (24px) or `p-8` (32px) applied uniformly to every card, section, and container. No spatial hierarchy — no compression to signal density, no generosity to signal importance.

**Rule (Anthony Hobday):** Outer padding should be equal to or greater than inner padding. Related items should be closer together than unrelated items.

```css
/* SLOP — dice-roll spacing */
.section { padding: 80px 24px; }
.card    { padding: 24px; }
.hero    { padding: 80px 24px; }  /* same as every section */

/* CORRECT — deliberate spatial hierarchy */
:root {
  --space-1: 4px;   --space-2: 8px;   --space-3: 16px;
  --space-4: 24px;  --space-5: 32px;  --space-6: 48px;
  --space-7: 64px;  --space-8: 96px;
}
.section-hero    { padding: var(--space-8) var(--space-4); }   /* generous — premium feel */
.section-content { padding: var(--space-6) var(--space-4); }   /* standard */
.card            { padding: var(--space-5); }                   /* tight but comfortable */
```

### 3.4 Uniform Border Radius
**Pattern:** `rounded-xl` (12px) on every element — cards, buttons, images, inputs, badges. One radius to rule them all.

**Rule (Anthony Hobday):** Nest corners properly. Inner corner radius = outer corner radius minus the gap between them. Mixing 4px buttons inside 16px cards looks wrong.

```css
/* SLOP */
.card   { border-radius: 12px; }
.button { border-radius: 12px; }  /* same as card */
.input  { border-radius: 12px; }  /* same as card */

/* CORRECT */
:root {
  --radius-sm: 4px;    /* inputs, tags */
  --radius-md: 8px;    /* buttons */
  --radius-lg: 16px;   /* cards */
  --radius-xl: 24px;   /* modals, panels */
}
/* nested: card (16px) contains button (8px) — difference matches ~8px gap */
```

---

## Category 4: Component Tropes

### 4.1 The Three-Box Icon Grid
**Pattern:**
```html
<div class="grid grid-cols-3 gap-8">
  <div class="flex flex-col items-center text-center p-6">
    <Icon />
    <h3>Feature One</h3>
    <p>Description of feature one that explains what it does.</p>
  </div>
  <!-- × 3 -->
</div>
```
Perfectly symmetric. Identical padding. Center-aligned. Heroicons. This is the single most AI-generated component pattern in existence.

**Fix:** Break symmetry. Vary card sizes. Use typographic hierarchy instead of icons. Let content breathe asymmetrically.

### 4.2 Generic Button Styles
**Pattern:** `bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6 py-3 font-semibold` — the default Tailwind CTA button. Seen on 80% of AI-generated sites.

**Fix:** Derive button style from the actual design language. Not all buttons should be `rounded-full`. The Von Restorff Effect says primary buttons need to stand out from *your* specific palette — not from a generic template.

### 4.3 Mixed Depth Techniques
**Pattern:** Some elements have `box-shadow`, others have borders, others have background-color elevation, with no consistent system.

**Rule (Anthony Hobday):** Don't mix depth techniques. Pick one approach and apply it consistently: all shadows, all borders, or all background elevation.

**Also:** Don't use box shadows in dark interfaces. Shadows require a light source — they look wrong against dark backgrounds. Use subtle background lightness elevation instead (closer = lighter, per Anthony Hobday).

### 4.4 Two Hard Divides Next to Each Other
**Pattern:** A section with a colored background AND a border on top — creating two adjacent hard visual divides.

**Rule (Anthony Hobday):** Never put two hard divides next to each other. A dividing line next to a background change is redundant and creates visual noise.

### 4.5 Scroll-Triggered fade-in-up on Everything
**Pattern:**
```css
.section { opacity: 0; transform: translateY(20px); transition: all 0.6s ease; }
.section.visible { opacity: 1; transform: translateY(0); }
```
Applied to every single element. Same duration. Same easing. No choreography. Feels like an animation library tutorial.

**Fix:** Reserve motion for elements that benefit from it. Staggered reveals with purpose beat uniform entrance animations. The Doherty Threshold (400ms) means slow animations create frustration, not delight.

---

## Category 5: Token & Code Hygiene Tropes

### 5.1 Eight Shades of Blue
**Pattern:** No token system. Blue is `#3B82F6` in one place, `#2563EB` in another, `#1D4ED8` elsewhere. Three sizes of the same button exist in different components with no shared implementation.

**Source:** paddo.dev — "You won't get a proper component library. You'll get eight shades of blue, three button sizes, and spacing chosen by dice roll."

### 5.2 Inline Tailwind Utility Soup
**Pattern:** Long `className` strings that are never abstracted:
```jsx
<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 px-4">
  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
```
Copy-pasted across files. Zero shared tokens. Zero reusability.

### 5.3 Glassmorphism Without Context
**Pattern:** `backdrop-blur-md bg-white/10 border border-white/20` applied to everything. Glassmorphism over a plain dark background makes no sense — it requires a rich background to "look through."

### 5.4 The Gradient Hero Background That Goes Nowhere
**Pattern:**
```css
.hero { background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%); }
```
The dark purple gradient hero. Every single v0.dev, Bolt.new, and Claude Code default output used this exact pattern from 2023–2025.

---

## The AI Slop Checklist

Use this to score a UI. 3+ hits = significant AI slop risk.

| Check | Slop Signal |
|-------|-------------|
| Font | Inter, Roboto, Arial as only font |
| Color | Purple/indigo gradient anywhere |
| Color | Pure #000 or #fff as base |
| Color | Hardcoded hex values (no tokens) |
| Layout | Hero → 3-col features → testimonials → CTA structure |
| Layout | `text-align: center` on hero heading AND description |
| Spacing | Same `p-6`/`p-8` on every container |
| Components | Three-column icon grid exists |
| Components | `rounded-xl` or `rounded-full` on every element |
| Components | `fade-in-up` animation on every section |
| Depth | Mix of shadows and borders on same layer |
| Dark mode | Just `bg-gray-900 text-white` inversion |
| Code | Copy-pasted Tailwind blocks across files |
| Code | 5+ different blue values with no token |

---

## References

- paddo.dev — [Agents Can't Do Design Systems](https://paddo.dev/blog/agents-cant-do-design-systems/) (Feb 2026)
- paddo.dev — [Claude Code Plugins: Breaking the AI Slop Aesthetic](https://paddo.dev/blog/claude-code-plugins-frontend-design/) (Nov 2025)
- Anthony Hobday — [Visual design rules you can safely follow every time](https://anthonyhobday.com/sideprojects/saferules/)
- MDN — [Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- MDN — [Variable fonts guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide)
- NNGroup — [First Impressions Matter: How Designers Can Support Humans' Automatic Cognitive Processing](https://www.nngroup.com/articles/first-impressions-human-automaticity/)
