# UI Expert Reference

Detailed reference for algorithmic UI design principles.

## Table of Contents

1. [Cognitive Load Theory](#cognitive-load-theory)
2. [Hick's Law Deep Dive](#hicks-law-deep-dive)
3. [Miller's Law & Chunking](#millers-law--chunking)
4. [Fitts's Law & Ergonomics](#fitts-law--ergonomics)
5. [Visual Hierarchy Algorithms](#visual-hierarchy-algorithms)
6. [Scanning Patterns](#scanning-patterns)
7. [Typography Mathematics](#typography-mathematics)
8. [Accessibility Standards](#accessibility-standards)
9. [Heuristic Evaluation](#heuristic-evaluation)

---

## Cognitive Load Theory

Human working memory has strictly limited capacity. When information volume exceeds available neurological space, users become overwhelmed, miss details, and abandon interfaces.

### Types of Cognitive Load

| Type | Definition | UI Impact |
|------|------------|-----------|
| Intrinsic | Baseline mental effort to absorb information, track objectives | Required by task, cannot be eliminated |
| Extraneous | Wasteful processing from visual noise, fragmented workflows | Must be aggressively minimized |

### Minimization Strategies

1. **Embrace minimalism** - Remove unnecessary elements
2. **Utilize generous white space** - Provide cognitive breathing room
3. **Eliminate interactive complexity** - Simplify workflows
4. **Implement state persistence** - Don't force users to memorize across steps
5. **Use sensible defaults** - Reduce decision burden
6. **State requirements upfront** - Prevent guessing and error recovery

---

## Hick's Law Deep Dive

Decision time increases logarithmically with the number and complexity of choices.

### Mathematical Formulation

```
RT = a + b × log₂(n)
```

Where:
- RT = Reaction/decision time
- a = Baseline cognitive processing time
- b = Processing time per option (~155-250ms)
- n = Number of equally probable alternatives

### For Unequal Probabilities

Uses information-theoretic entropy:

```
RT = a + b × H
H = -Σ(pᵢ × log₂(pᵢ))
```

Where pᵢ is the probability of the i-th alternative.

### Critical Implications

1. **Logarithmic, not linear** - Users subdivide choices into categories, eliminating ~half at each step
2. **Minimize choices for rapid response** - Critical for time-sensitive interfaces
3. **Break complex processes into sequential steps** - E-commerce checkouts, user registration
4. **Use visual hierarchy for defaults** - Guide users to optimal paths

### Real-World Applications

| Example | Implementation |
|---------|----------------|
| Google homepage | Eliminates secondary content, focuses on single search decision |
| Slack onboarding | Progressive disclosure via conversational bot, reveals complexity gradually |

---

## Miller's Law & Chunking

The average human can hold only 4±1 items in short-term working memory simultaneously.

### Chunking Protocol

Break large datasets into meaningful, digestible groups:

```
Raw data: [A][B][C][D][E][F][G][H][I][J][K][L]
Chunked: [A B C D] [E F G H] [I J K L]
          Group 1   Group 2   Group 3
```

### Application with Hick's Law

Together these laws form the foundation for algorithmic component selection:

- **Hick's Law**: Reduce options to speed decision-making
- **Miller's Law**: Group information to prevent memory overflow

---

## Fitts's Law & Ergonomics

Target acquisition time is a function of distance to target and target width.

### Mathematical Formulation

```
MT = a + b × log₂(D/W + 1)
```

Where:
- MT = Movement time
- D = Distance to target
- W = Width of target along movement axis
- log₂(D/W + 1) = Index of Difficulty (ID), measured in bits

### Two-Component Movement Model

1. **Initial phase**: Rapid, coarse, ballistic movement (driven by distance)
2. **Final phase**: Slow, high-precision adjustment (driven by target dimensions)

### UI Implementation Rules

| Rule | Implementation |
|------|----------------|
| Target sizing | Larger targets = exponentially less precision required |
| Hit areas | Include text labels with icons; clickable boundaries include padding |
| Distance optimization | Place related controls proximally |
| Contextual placement | Menus/tooltips render adjacent to trigger |
| Infinite edges | Anchor critical navigation flush to viewport boundaries |
| Radial efficiency | Pie menus put all items equidistant from center |

### Minimum Target Sizes

| Input Type | Minimum Size |
|------------|--------------|
| Touch | 44×44px (Apple), 48×48dp (Material) |
| Mouse | Varies by context, larger is better |

---

## Visual Hierarchy Algorithms

Visual weight is the perceived psychological "pull" an element exerts within a layout.

### Hierarchy Scoring Mechanism

Assign distinct, non-competing properties to hierarchy levels:

| Level | Size | Color | Weight |
|-------|------|-------|--------|
| Primary | Largest | Highest contrast | Boldest |
| Secondary | Medium | Medium contrast | Medium |
| Tertiary | Smallest | Lowest contrast | Lightest |

### Visual Weight Factors

| Factor | Effect |
|--------|--------|
| Size/Scale | Larger elements draw more attention; creates topographic information maps |
| Color | Bright/saturated colors advance; muted/desaturated recede |
| Contrast | High contrast grabs attention; defines interactivity |
| Alignment | Provides structural rigidity; facilitates rapid scanning |

---

## Scanning Patterns

Users do not read digital interfaces; they scan them rapidly.

### F-Pattern

**Optimal for**: Dense, text-heavy interfaces (blogs, dashboards, search results)

**Pattern**:
1. Start top-left, move horizontally to top-right
2. Drop down, scan vertically along left edge
3. Branch horizontally only when prominent sub-heading detected

**Implementation**:
- Strict left-alignment
- Heavy font weights for first words of paragraphs
- Bulleted lists to break vertical monotony

### Z-Pattern

**Optimal for**: Sparse, low-density, conversion-focused layouts (landing pages)

**Pattern**:
1. Top-left to top-right
2. Diagonal to bottom-left
3. Horizontal to bottom-right

**Implementation**:
- Logo at top-left origin
- Primary navigation at top-right
- High-contrast hero image on diagonal axis
- CTA button at bottom-right terminal node

---

## Typography Mathematics

### Modular Scale Calculation

Base font size × ratio^n = scale step

Example with 16px base and 1.250 (Major Third) ratio:

| Step | Calculation | Size |
|------|-------------|------|
| -2 | 16 ÷ 1.25² | 10.24px |
| -1 | 16 ÷ 1.25 | 12.80px |
| 0 | 16 (base) | 16.00px |
| 1 | 16 × 1.25 | 20.00px |
| 2 | 16 × 1.25² | 25.00px |
| 3 | 16 × 1.25³ | 31.25px |
| 4 | 16 × 1.25⁴ | 39.06px |
| 5 | 16 × 1.25⁵ | 48.83px |

### Responsive Scale Strategy

| Viewport | Ratio | Rationale |
|----------|-------|-----------|
| Desktop | 1.250-1.618 | Aggressive hierarchy for large displays |
| Tablet | 1.200-1.333 | Moderate hierarchy |
| Mobile | 1.067-1.125 | Subdued hierarchy for tight spaces |

Alternative: Use CSS clamp() for fluid typography:

```css
font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
```

### Line Height Rules

| Content Type | Line Height | Rationale |
|--------------|-------------|-----------|
| Body copy | 1.5 | Extended reading requires breathing room |
| Headings | 1.1-1.35 | Large sizes appear to have more optical space |
| UI text | 1.2-1.4 | Balance readability with density |

---

## Accessibility Standards

### WCAG 2.1 Contrast Formula

Contrast ratio is calculated from relative luminance:

```
(L1 + 0.05) / (L2 + 0.05)
```

Where L1 is the lighter color's luminance and L2 is the darker.

### Compliance Matrix

| Scenario | Level AA | Level AAA | Notes |
|----------|----------|-----------|-------|
| Normal text | 4.5:1 | 7.0:1 | <18pt or <14pt bold |
| Large text | 3.0:1 | 4.5:1 | ≥18pt or ≥14pt bold |
| UI components | 3.0:1 | N/A | Icons, borders, focus rings |
| Links by color | 3:1 vs text AND 4.5:1 vs bg | N/A | Must have non-color cue on hover/focus |
| Incidental text | No requirement | No requirement | Disabled inputs, decoration |
| Logotypes | No requirement | No requirement | Brand identity exempt |

### Important Notes

- No fractional rounding: 4.47:1 fails 4.5:1
- Gradients/images: measure at point of lowest contrast
- Adjacent backgrounds: icon contrasts with button, button contrasts with page

---

## Heuristic Evaluation

Systematic assessment of interfaces against established usability principles.

### Nielsen's 10 Usability Heuristics

1. **Visibility of system status** - Keep users informed
2. **Match between system and real world** - Use familiar concepts
3. **User control and freedom** - Support undo/redo
4. **Consistency and standards** - Platform conventions
5. **Error prevention** - Eliminate error-prone conditions
6. **Recognition rather than recall** - Visible options vs memory
7. **Flexibility and efficiency of use** - Accelerators for experts
8. **Aesthetic and minimalist design** - No irrelevant information
9. **Help users recognize, diagnose, recover from errors** - Clear error messages
10. **Help and documentation** - Easy to search, focused on tasks

### AI Output Validation

For AI-generated interfaces, specifically check:

- Contextual error messages adjacent to problematic fields
- Visual hierarchy that guides attention appropriately
- Consistent component behavior across the interface
- Adequate target sizes for interactive elements
- Proper contrast ratios for all text and UI elements
- State persistence across workflow steps
- Adherence to mental models for standard components
