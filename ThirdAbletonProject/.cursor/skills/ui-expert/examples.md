# UI Expert Examples

Practical implementation examples applying algorithmic UI design principles.

## Table of Contents

1. [Component Selection Examples](#component-selection-examples)
2. [Layout Pattern Examples](#layout-pattern-examples)
3. [Design Token Examples](#design-token-examples)
4. [Typography Scale Examples](#typography-scale-examples)
5. [Spacing System Examples](#spacing-system-examples)
6. [Accessibility Implementation](#accessibility-implementation)
7. [Complete Component Examples](#complete-component-examples)

---

## Component Selection Examples

### Example 1: Subscription Plan Selection

**Scenario**: User must select one of 3 subscription tiers (Basic, Pro, Enterprise)

**Decision**: 2-4 mutually exclusive options → **Radio buttons**

```jsx
// Correct implementation
<div role="radiogroup" aria-label="Select subscription plan">
  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-primary">
    <input
      type="radio"
      name="plan"
      value="basic"
      defaultChecked
      className="w-4 h-4 text-primary"
    />
    <div>
      <div className="font-semibold">Basic</div>
      <div className="text-sm text-gray-600">$9/month</div>
    </div>
  </label>
  {/* Pro and Enterprise options... */}
</div>
```

**Why not dropdown?** Hick's Law: exposing all options immediately eliminates interaction cost of opening a menu and keeps choices visible for easy comparison.

---

### Example 2: Feature Toggles

**Scenario**: User can enable/disable dark mode, notifications, auto-save independently

**Decision**: Multiple independent options → **Toggle switches**

```jsx
// Correct implementation
<div className="space-y-4">
  <label className="flex items-center justify-between">
    <span className="font-medium">Dark Mode</span>
    <button
      role="switch"
      aria-checked={enabled}
      onClick={toggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        enabled ? 'bg-primary-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </label>
  {/* Additional toggles... */}
</div>
```

**Why toggles?** Maps to physical switch mental model; provides immediate real-time effect without requiring submit action.

---

### Example 3: Country Selection

**Scenario**: User must select their country from 195 options

**Decision**: >10 options → **Searchable autocomplete**

```jsx
// Correct implementation
<div className="relative">
  <label htmlFor="country" className="block text-sm font-medium mb-2">
    Country
  </label>
  <input
    id="country"
    type="text"
    list="countries"
    placeholder="Search countries..."
    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
  />
  <datalist id="countries">
    <option value="United States" />
    <option value="United Kingdom" />
    {/* ... 193 more countries */}
  </datalist>
</div>
```

**Why not dropdown?** 195 options cause severe choice overload. Text field bypasses Hick's Law by relying on user recall rather than interface recognition.

---

### Example 4: Category Filter

**Scenario**: User can filter products by multiple categories (Electronics, Clothing, Home, Sports)

**Decision**: Multiple independent options → **Checkboxes**

```jsx
// Correct implementation
<fieldset className="space-y-2">
  <legend className="font-medium mb-3">Categories</legend>
  {categories.map((category) => (
    <label key={category.id} className="flex items-center gap-2">
      <input
        type="checkbox"
        value={category.id}
        checked={selected.has(category.id)}
        onChange={handleChange}
        className="w-4 h-4 rounded border-gray-300 text-primary"
      />
      <span>{category.name}</span>
    </label>
  ))}
</fieldset>
```

**Why checkboxes?** Allows selection of none, one, or several options independently without forced mutual exclusivity.

---

## Layout Pattern Examples

### F-Pattern: Dashboard Layout

**Use case**: Dense data display with metrics, charts, tables

```jsx
// F-Pattern implementation
<div className="max-w-7xl mx-auto px-6">
  {/* Top horizontal: Header */}
  <header className="flex justify-between items-center py-6 border-b">
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <nav className="flex gap-4">
      <a href="#overview">Overview</a>
      <a href="#analytics">Analytics</a>
      <a href="#reports">Reports</a>
    </nav>
  </header>

  {/* Left-aligned vertical scan */}
  <main className="py-6">
    {/* Heavy font weight for scanning */}
    <h2 className="text-xl font-bold mb-4">Key Metrics</h2>

    {/* Grid with left-aligned content */}
    <div className="grid grid-cols-3 gap-6 mb-8">
      <MetricCard title="Revenue" value="$124,500" change="+12%" />
      <MetricCard title="Users" value="8,420" change="+5%" />
      <MetricCard title="Conversion" value="3.2%" change="-0.5%" />
    </div>

    {/* Bulleted lists break vertical monotony */}
    <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
    <ul className="space-y-2">
      <li className="flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full" />
        New user registration: john@example.com
      </li>
      {/* More items... */}
    </ul>
  </main>
</div>
```

---

### Z-Pattern: Landing Page

**Use case**: Conversion-focused marketing page

```jsx
// Z-Pattern implementation
<div className="min-h-screen">
  {/* Point 1: Top-left - Logo */}
  <header className="flex justify-between items-center px-8 py-6">
    <img src="/logo.svg" alt="Company" className="h-8" />

    {/* Point 2: Top-right - Navigation */}
    <nav className="flex gap-6">
      <a href="#features">Features</a>
      <a href="#pricing">Pricing</a>
      <a href="#about">About</a>
    </nav>
  </header>

  {/* Diagonal: Hero content */}
  <section className="flex items-center justify-between px-8 py-20">
    <div className="max-w-xl">
      <h1 className="text-5xl font-bold mb-6">Build Better Products</h1>
      <p className="text-xl text-gray-600 mb-8">
        The complete platform for modern teams.
      </p>
    </div>
    <img src="/hero.png" alt="Product" className="w-1/2" />
  </section>

  {/* Point 3: Bottom-left (implied) */}
  {/* Point 4: Bottom-right - CTA */}
  <section className="px-8 py-12 text-right">
    <button className="px-8 py-4 bg-primary text-white rounded-lg font-semibold">
      Get Started Free
    </button>
  </section>
</div>
```

---

## Design Token Examples

### CSS Custom Properties Setup

```css
/* tokens.css */
:root {
  /* 8-Point Grid Spacing */
  --space-0: 0px;
  --space-1: 4px;   /* Half-step */
  --space-2: 8px;   /* Base unit */
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 40px;
  --space-7: 48px;
  --space-8: 64px;

  /* Color Tokens - Semantic */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;

  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-600: #4b5563;
  --color-gray-900: #111827;

  /* Typography - Major Third Scale (1.25) */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */

  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
}
```

### Token Usage in Components

```jsx
// Correct: Using design tokens
<button
  className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium"
  style={{
    padding: 'var(--space-3) var(--space-4)',
    backgroundColor: 'var(--color-primary-500)',
  }}
>
  Submit
</button>

// Incorrect: Hardcoded values
<button className="px-5 py-2.5 bg-blue-500 text-white rounded font-medium">
  Submit
</button>
```

---

## Typography Scale Examples

### Major Third Scale (1.25) Implementation

```jsx
// Typography component using modular scale
function Typography({ variant, children }) {
  const styles = {
    h1: 'text-4xl font-bold leading-tight',      // 36px, 1.25 line-height
    h2: 'text-3xl font-bold leading-tight',      // 30px
    h3: 'text-2xl font-semibold leading-snug',   // 24px
    h4: 'text-xl font-semibold leading-snug',    // 20px
    h5: 'text-lg font-medium leading-snug',      // 18px
    body: 'text-base leading-normal',            // 16px, 1.5 line-height
    small: 'text-sm leading-normal',             // 14px
    caption: 'text-xs leading-normal',           // 12px
  };

  const tags = {
    h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5',
    body: 'p', small: 'span', caption: 'span',
  };

  const Tag = tags[variant];
  return <Tag className={styles[variant]}>{children}</Tag>;
}

// Usage
<Typography variant="h1">Page Title</Typography>
<Typography variant="body">
  This is body text with comfortable 1.5 line height for extended reading.
</Typography>
```

---

## Spacing System Examples

### Stack Component (8-Point Grid)

```jsx
// Layout primitive ensuring 8-point grid compliance
function Stack({ gap = 3, children, className = '' }) {
  const gapValues = {
    0: 'gap-0',      /* 0px */
    1: 'gap-1',      /* 4px */
    2: 'gap-2',      /* 8px */
    3: 'gap-4',      /* 16px */
    4: 'gap-6',      /* 24px */
    5: 'gap-8',      /* 32px */
    6: 'gap-10',     /* 40px */
    7: 'gap-12',     /* 48px */
  };

  return (
    <div className={`flex flex-col ${gapValues[gap]} ${className}`}>
      {children}
    </div>
  );
}

// Usage
<Stack gap={4}>
  <h2>Section Title</h2>
  <p>Content with consistent 24px spacing between elements.</p>
  <button>Action</button>
</Stack>
```

---

## Accessibility Implementation

### Contrast Verification

```jsx
// Helper to check WCAG contrast
function meetsContrast(foreground, background, level = 'AA') {
  const ratio = calculateContrastRatio(foreground, background);
  const thresholds = {
    'AA-normal': 4.5,
    'AA-large': 3.0,
    'AAA-normal': 7.0,
    'AAA-large': 4.5,
  };
  return ratio >= thresholds[level];
}

// Component with guaranteed contrast
function AccessibleButton({ variant = 'primary', children }) {
  const styles = {
    primary: {
      bg: 'bg-blue-600',      // #2563eb
      text: 'text-white',     // #ffffff
      // Contrast ratio: 4.6:1 (passes AA for normal text)
    },
    secondary: {
      bg: 'bg-gray-200',      // #e5e7eb
      text: 'text-gray-900',  // #111827
      // Contrast ratio: 11.2:1 (passes AAA)
    },
  };

  return (
    <button className={`${styles[variant].bg} ${styles[variant].text} px-4 py-2 rounded`}>
      {children}
    </button>
  );
}
```

### Focus States (WCAG 2.1 Compliance)

```jsx
// Visible focus indicators
<button
  className="px-4 py-2 bg-primary-500 text-white rounded
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
>
  Clickable Button
</button>
```

---

## Complete Component Examples

### Form with Full Compliance

```jsx
function RegistrationForm() {
  return (
    <form className="max-w-md mx-auto space-y-6">
      {/* Section grouping with Common Region (Gestalt) */}
      <fieldset className="p-6 bg-gray-50 rounded-lg border">
        <legend className="px-2 font-semibold text-lg">Account Information</legend>

        {/* Proximity: label close to input */}
        <Stack gap={4}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Min 8 characters"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            />
            {/* State requirement upfront */}
            <p className="mt-1 text-sm text-gray-600">
              Must be at least 8 characters with one number
            </p>
          </div>
        </Stack>
      </fieldset>

      {/* Plan selection: Radio buttons (Hick's Law: 3 options) */}
      <fieldset>
        <legend className="font-semibold mb-3">Select Plan</legend>
        <div className="space-y-3">
          {['Basic', 'Pro', 'Enterprise'].map((plan) => (
            <label
              key={plan}
              className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer
                hover:border-primary-500 transition-colors"
            >
              <input
                type="radio"
                name="plan"
                value={plan.toLowerCase()}
                defaultChecked={plan === 'Pro'}
                className="w-4 h-4 text-primary"
              />
              <span className="font-medium">{plan}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Submit button: High contrast, adequate size (Fitts's Law) */}
      <button
        type="submit"
        className="w-full py-3 px-6 bg-primary-600 text-white font-semibold rounded-lg
          hover:bg-primary-700 focus:ring-2 focus:ring-primary focus:ring-offset-2
          transition-colors"
        style={{ minHeight: '48px' }} /* Minimum touch target */
      >
        Create Account
      </button>
    </form>
  );
}
```

### Card Component with Visual Hierarchy

```jsx
function ProductCard({ product }) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image: Visual anchor */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-6">
        {/* Primary: Product name - largest, boldest */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {product.name}
        </h3>

        {/* Secondary: Price - medium weight, accent color */}
        <p className="text-lg font-semibold text-primary-600 mb-3">
          ${product.price}
        </p>

        {/* Tertiary: Description - smallest, muted */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* CTA: High contrast per Von Restorff Effect */}
        <button
          className="w-full py-2 px-4 bg-primary-600 text-white font-medium rounded
            hover:bg-primary-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
```

---

## Anti-Patterns to Avoid

### Don't: Vibe Coding

```jsx
// Bad: Arbitrary values, inconsistent spacing
<div className="p-5 m-3 bg-blue-400 text-white text-lg">
  <button className="px-3 py-1.5 mr-2 bg-blue-500">Save</button>
  <button className="px-4 py-2 ml-1 bg-gray-400">Cancel</button>
</div>
```

### Do: Token-Based System

```jsx
// Good: Design tokens, consistent 8-point grid
<div className="p-6 m-4 bg-primary-500 text-white text-base">
  <button className="px-4 py-2 mr-3 bg-primary-600">Save</button>
  <button className="px-4 py-2 bg-gray-500">Cancel</button>
</div>
```

### Don't: Novel Form Elements

```jsx
// Bad: Checkbox that behaves like radio button
<input
  type="checkbox"
  name="option"
  onChange={(e) => {
    // Deselects other checkboxes - violates mental model
    document.querySelectorAll('[name="option"]').forEach(cb => {
      if (cb !== e.target) cb.checked = false;
    });
  }}
/>
```

### Do: Use Correct Component

```jsx
// Good: Radio buttons for mutually exclusive selection
<input type="radio" name="option" value="a" />
<input type="radio" name="option" value="b" />
<input type="radio" name="option" value="c" />
```
