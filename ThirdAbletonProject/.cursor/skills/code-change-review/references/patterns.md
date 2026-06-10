# Code Change Review - Pattern Reference

## Logic & Implementation Patterns

### Negative Pattern: Silent Failures & Swallowed Errors

```javascript
// ❌ BAD - Error silently ignored
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    // Error disappears into the void
    return null;
  }
}

// ❌ BAD - Validation passes invalid data through
function processPayment(amount) {
  if (amount > 0) {
    // Process payment
  }
  // What if amount is undefined, null, or NaN?
  // Silently falls through
}
```

**What to look for**: Empty catch blocks, missing validation, functions that return null without logging why.

### Positive Pattern: Explicit Error Handling & Validation

```javascript
// ✅ GOOD - Clear error context
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    throw error; // Re-throw with context preserved
  }
}

// ✅ GOOD - Early validation & clear contracts
function processPayment(amount) {
  if (typeof amount !== 'number' || amount <= 0) {
    throw new Error(`Invalid amount: ${amount}. Must be positive number.`);
  }
  // Safe to proceed — invariants guaranteed
}
```

**Why it's good**: Errors are visible, context preserved, contract explicit, debugging is easy.

---

### Negative Pattern: Unintended State Mutation

```javascript
// ❌ BAD - Modifying shared state
const userCache = {};

function updateUserInCache(userId, data) {
  userCache[userId] = data; // Direct mutation
  return userCache[userId];
}

// Caller doesn't expect cache mutation
const result = updateUserInCache(123, { name: "Alice" });
result.name = "Bob"; // Oops! Mutated the cache
```

```python
# ❌ BAD - Mutable default argument
def add_to_list(item, items=[]):
    items.append(item)  # Modifies same list every call!
    return items

add_to_list(1)  # [1]
add_to_list(2)  # [1, 2] — surprise!
```

**What to look for**: Direct mutations of parameters/globals, mutable default arguments, shared state modified unexpectedly.

### Positive Pattern: Immutability & Pure Functions

```javascript
// ✅ GOOD - Returns new object, doesn't mutate
function updateUserInCache(userId, data) {
  const updatedCache = {
    ...userCache, // Explicit spread
    [userId]: { ...data } // Deep copy
  };
  return updatedCache; // Caller gets immutable copy
}

// Caller can mutate result without side effects
const result = updateUserInCache(123, { name: "Alice" });
result.name = "Bob"; // Only affects local result
```

```python
# ✅ GOOD - Immutable defaults & no mutation
def add_to_list(item, items=None):
    items = items or []       # Create new list if None
    new_items = items + [item] # Returns new list
    return new_items          # Original unchanged

add_to_list(1)  # [1]
add_to_list(2)  # [2] — no surprise
```

**Why it's good**: Predictable, testable, no hidden side effects, reasoning about code is easier.

---

### Negative Pattern: Magic Numbers & Hardcoded Values

```python
# ❌ BAD - Where do these numbers come from?
def calculate_discount(purchase_amount, customer_tier):
    if customer_tier == 1:
        return purchase_amount * 0.05
    elif customer_tier == 2:
        return purchase_amount * 0.10
    elif customer_tier == 3:
        return purchase_amount * 0.15
    
    if purchase_amount > 1000:
        return purchase_amount * 0.20

# ❌ BAD - Stringly-typed state
user_status = "act"  # typo? shorthand? unclear
if user_status == "act":
    # What about "active", "ACTIVE", "Active"?
    pass
```

**What to look for**: Unexplained numeric values, string literals that should be constants/enums, magic configuration.

### Positive Pattern: Named Constants & Clear Intent

```python
# ✅ GOOD - Self-documenting
DISCOUNT_TIER_1 = 0.05
DISCOUNT_TIER_2 = 0.10
DISCOUNT_TIER_3 = 0.15
VOLUME_DISCOUNT_THRESHOLD = 1000
VOLUME_DISCOUNT_RATE = 0.20

def calculate_discount(purchase_amount, customer_tier):
    tier_discounts = {
        1: DISCOUNT_TIER_1,
        2: DISCOUNT_TIER_2,
        3: DISCOUNT_TIER_3,
    }
    base_discount = tier_discounts.get(customer_tier, 0)
    
    if purchase_amount > VOLUME_DISCOUNT_THRESHOLD:
        return purchase_amount * VOLUME_DISCOUNT_RATE
    return purchase_amount * base_discount

# ✅ GOOD - Enumerated states
from enum import Enum

class UserStatus(Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"

user_status = UserStatus.ACTIVE  # Compiler catches typos
```

**Why it's good**: Meaning is clear, changes centralized, type-safe, easier to maintain.

---

### Negative Pattern: Over-Defensive Code

```typescript
// ❌ BAD - Excessive null checks for things that shouldn't be null
function processUser(user: User) {
  if (user == null) return null;
  if (user.profile == null) return null;
  if (user.profile.name == null) return null;
  
  let name = user.profile.name;
  if (typeof name !== 'string') return null;
  if (name.length === 0) return null;
  
  // By now, name is definitely valid
  return name.toUpperCase();
}

// Called from
const result = processUser(userData);
if (result == null) {
  // What went wrong? Silent failure.
}
```

**What to look for**: Chain of defensive checks, silent null returns, loss of error context.

### Positive Pattern: Contract-Based Approach

```typescript
// ✅ GOOD - Assumes valid input, fails loudly if not
function processUser(user: User | null): string {
  if (user == null) {
    throw new Error("User cannot be null");
  }
  
  // TypeScript helps narrow types here
  const { profile } = user;
  if (!profile?.name) {
    throw new Error("User must have a profile with a name");
  }
  
  return profile.name.toUpperCase();
}

// Called from
try {
  const result = processUser(userData);
  console.log(result);
} catch (error) {
  console.error("Invalid user:", error.message);
}
```

**Why it's good**: Contracts explicit, failures visible, debugging painless.

---

## UI/UX Patterns

### Negative Pattern: Inconsistent Spacing & Alignment

```css
/* ❌ BAD - No pattern, arbitrary spacing */
.card {
  padding: 12px;
  margin-bottom: 20px;
}

.button {
  margin: 8px;
  padding: 6px 14px;
}

.header {
  padding: 16px 20px;
  margin-bottom: 24px;
}

.modal {
  padding: 30px;
  margin: 0;
}

/* ❌ BAD - Mixing units and no hierarchy */
h1 { font-size: 42px; }
h2 { font-size: 24px; }
body { font-size: 14px; }
small { font-size: 11px; }
```

**What to look for**: Spacing values scattered everywhere (8, 12, 14, 16, 20, 24, 30px), no base unit, font sizes don't follow a scale.

### Positive Pattern: Design System Scale

```css
/* ✅ GOOD - 8px base unit, multiples only */
:root {
  --spacing-xs: 4px;   /* 0.5x */
  --spacing-sm: 8px;   /* 1x */
  --spacing-md: 16px;  /* 2x */
  --spacing-lg: 24px;  /* 3x */
  --spacing-xl: 32px;  /* 4x */
  
  --size-h1: 32px;
  --size-h2: 24px;
  --size-body: 16px;
  --size-small: 14px;
}

.card {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.button {
  padding: var(--spacing-sm) var(--spacing-md);
  margin: var(--spacing-sm);
}

h1 { font-size: var(--size-h1); }
h2 { font-size: var(--size-h2); }
```

**Why it's good**: Consistent, predictable, changes propagate globally, rhythm visual and pleasing.

---

### Negative Pattern: Hardcoded Colors & No Theme Support

```css
/* ❌ BAD - Scattered color values */
.button {
  background-color: #007bff;
  color: white;
  border: 1px solid #0056b3;
}

.alert {
  background-color: #f8d7da;
  color: #721c24;
}

.success {
  background-color: #28a745;
  color: white;
}

/* No dark mode support, colors can't change */
```

**What to look for**: Hex/rgb values inline, no attempt at theming, different colors for same semantic purpose.

### Positive Pattern: Semantic Color Variables & Theme Support

```css
/* ✅ GOOD - Semantic tokens, themeable */
:root {
  /* Light theme */
  --color-primary: #007bff;
  --color-primary-dark: #0056b3;
  --color-success: #28a745;
  --color-danger: #dc3545;
  
  --bg-primary: white;
  --bg-secondary: #f5f5f5;
  --text-primary: #212529;
  --text-secondary: #6c757d;
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark theme */
    --color-primary: #0d6efd;
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --text-primary: #f0f0f0;
    --text-secondary: #b0b0b0;
  }
}

.button-primary {
  background-color: var(--color-primary);
  color: var(--text-primary);
  border: 1px solid var(--color-primary-dark);
}

.button-success {
  background-color: var(--color-success);
  color: white;
}
```

**Why it's good**: Centralized, themeable, semantic meaning clear, dark mode works automatically.

---

### Negative Pattern: Missing Interactive States

```html
<!-- ❌ BAD - Button has no feedback -->
<button class="btn">Click me</button>

<style>
  .btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    /* No hover, no focus, no active state — feels unresponsive */
  }
</style>
```

**What to look for**: No hover state, no focus ring, disabled buttons still clickable, no loading state, no active highlighting.

### Positive Pattern: Complete Interactive States

```html
<!-- ✅ GOOD - Full state coverage -->
<button class="btn btn-primary">Click me</button>
<button class="btn btn-primary" disabled>Disabled</button>

<style>
  .btn {
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    transition: all 200ms ease;
    font-weight: 500;
    border-radius: 4px;
  }

  .btn-primary {
    background: var(--color-primary);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--color-primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
  }

  .btn-primary:focus:not(:disabled) {
    outline: 2px solid var(--color-primary-dark);
    outline-offset: 2px;
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn.is-loading {
    color: transparent;
    position: relative;
  }

  .btn.is-loading::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    top: 50%;
    left: 50%;
    margin: -8px 0 0 -8px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 600ms linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
```

**Why it's good**: Responsive, accessible, loading states clear, disabled state unambiguous, visual feedback for every interaction.

---

## Cross-Cutting Patterns

### Negative Pattern: Inconsistent Error States

```javascript
// ❌ BAD - Different error handling per component
// Component A
const fetchData = async () => {
  try {
    const data = await api.get('/data');
    setData(data);
  } catch (error) {
    console.log('Error:' + error); // Silent console log
  }
};

// Component B
const loadSettings = async () => {
  try {
    const settings = await api.get('/settings');
    setSettings(settings);
  } catch (error) {
    alert('Network error'); // Intrusive alert
    return;
  }
};

// Component C
const refreshUser = async () => {
  const userData = await api.get('/user'); // No error handling at all
  setUser(userData);
};

// Component D
const getConfig = async () => {
  return api.get('/config')
    .then(data => data)
    .catch(err => ({}))); // Silently returns empty object
};
```

**What to look for**: Different error handling strategies per component, inconsistent user feedback, silent vs. loud failures.

### Positive Pattern: Centralized Error Handling

```javascript
// ✅ GOOD - Unified error strategy
const ErrorContext = createContext();

function useError() {
  const { showError, clearError } = useContext(ErrorContext);
  return { showError, clearError };
}

const fetchData = async () => {
  const { showError, clearError } = useError();
  try {
    clearError();
    const data = await api.get('/data');
    setData(data);
  } catch (error) {
    showError(error); // Consistent error display
    throw error; // Re-throw for boundary handling
  }
};

const loadSettings = async () => {
  const { showError, clearError } = useError();
  try {
    clearError();
    const settings = await api.get('/settings');
    setSettings(settings);
  } catch (error) {
    showError(error); // Same treatment
    throw error;
  }
};

// Components use consistent pattern
const refreshUser = async () => {
  const { showError } = useError();
  try {
    const userData = await api.get('/user');
    setUser(userData);
  } catch (error) {
    showError(error);
  }
};
```

**Why it's good**: User experience consistent, debugging easier, error context preserved, changes to error UI propagate everywhere.

---

## Code Style Patterns

### Negative Pattern: Vague Variable & Function Names

```python
# ❌ BAD - Names don't explain purpose
def process(d):
    result = []
    for x in d:
        if x > 0:
            result.append(x * 2)
    return result

def handle_stuff(u):
    if u.get("s") == "a":
        return calculate(u)
    return None

data = {"s": "a", "v": 100}
temp = process([1, -2, 3])
```

**What to look for**: Single-letter variables, generic names like `data`, `result`, `temp`, `handle_stuff`, abbreviations that obscure meaning.

### Positive Pattern: Explicit, Descriptive Names

```python
# ✅ GOOD - Names explain purpose & type
def double_positive_numbers(numbers):
    doubled = []
    for num in numbers:
        if num > 0:
            doubled.append(num * 2)
    return doubled

# Or more idiomatically
def double_positive_numbers(numbers):
    return [num * 2 for num in numbers if num > 0]

def calculate_discount_for_user(user):
    user_status = user.get("status")
    if user_status == "active":
        return calculate_active_discount(user)
    return None

active_users = [1, 2, 3]
doubled_positive = double_positive_numbers([1, -2, 3])
```

**Why it's good**: Self-documenting, IDE autocomplete helpful, intent clear without comments, bugs spotted faster.

---

## Integration Patterns

### Negative Pattern: Tight Coupling & Circular Dependencies

```javascript
// ❌ BAD - Components tightly coupled
// UserCard.js
import { CartService } from './services/CartService';

function UserCard({ user }) {
  const addToCart = () => {
    CartService.add(user.defaultProduct);
  };
  
  return <button onClick={addToCart}>Buy</button>;
}

// CartService.js
import { UserCard } from './components/UserCard';

class CartService {
  add(product) {
    UserCard.updateUI(); // Circular dependency
  }
}
```

**What to look for**: Components importing services that import components, circular imports, tightly bound modules.

### Positive Pattern: Loose Coupling & Dependency Injection

```javascript
// ✅ GOOD - Decoupled via dependency injection
// UserCard.js
function UserCard({ user, onAddToCart }) {
  const handleAdd = () => {
    onAddToCart(user.defaultProduct);
  };
  
  return <button onClick={handleAdd}>Buy</button>;
}

// CartService.js
class CartService {
  add(product) {
    // No dependencies on UI components
    return { success: true, product };
  }
}

// App.js - Wires dependencies
function App() {
  const handleAddToCart = (product) => {
    const result = CartService.add(product);
    showNotification(`Added ${product.name}`);
  };
  
  return <UserCard user={user} onAddToCart={handleAddToCart} />;
}
```

**Why it's good**: Components reusable, testable, services framework-agnostic, changes isolated.

---

## Summary Quick Reference

| Category | Red Flag | Green Flag |
|----------|----------|-----------|
| **Error Handling** | Silent failures, swallowed errors | Explicit errors, context preserved |
| **State** | Shared mutable state, unintended mutations | Immutable, pure functions |
| **Magic Values** | Hardcoded numbers, stringly-typed | Named constants, enums |
| **Defensiveness** | Chain of null checks | Fail-fast with contracts |
| **UI Spacing** | Arbitrary values scattered | Design system scale (8px multiples) |
| **UI Colors** | Hardcoded hex values | Semantic vars, theme support |
| **Interactions** | No hover/focus states | Complete state coverage |
| **Names** | Single letters, generic | Explicit, descriptive |
| **Coupling** | Circular imports, tight binding | Dependency injection, interfaces |

