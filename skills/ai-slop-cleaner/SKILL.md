---
name: ai-slop-cleaner
description: "Detect and remove AI-generated code patterns (slop). Use when code feels over-engineered, has excessive comments, unnecessary abstractions, or verbose try/catch blocks. Triggers: 'clean slop', 'remove AI patterns', 'simplify code', 'over-engineered', '슬로프 제거', 'AI가 만든 코드 정리', '과잉 추상화'"
---

# AI Slop Cleaner — Detect and Remove AI-Generated Anti-Patterns

AI code generation produces systematic anti-patterns ("slop") that inflate codebases with unnecessary complexity. This skill identifies and removes them.

## When to Use

- After significant AI-generated code additions
- When code feels bloated or over-engineered
- During refactoring/cleanup sprints
- Before code review to preemptively fix common AI slop
- When `refactor-cleaner` agent flags verbose code

## Detection Checklist

### 🔴 Critical Slop (Always Remove)

#### 1. Captain Obvious Comments
```diff
- // Get the user by ID
  function getUserById(id: string) {
-   // Create a variable to store the user
    const user = await db.users.findOne({ id });
-   // Return the user
    return user;
  }
```

#### 2. Unnecessary Try/Catch Wrapping
```diff
  async function fetchData(url: string) {
-   try {
      const response = await fetch(url);
      return response.json();
-   } catch (error) {
-     console.error('Error fetching data:', error);
-     throw error;  // ← Just re-throws! Useless.
-   }
  }
```

#### 3. Premature Abstraction (1-caller patterns)
```diff
- // Abstract base class for a single implementation
- abstract class BaseNotificationService {
-   abstract send(msg: string): Promise<void>;
- }
-
- class EmailNotificationService extends BaseNotificationService {
+ class EmailService {
    async send(msg: string) { /* ... */ }
  }
```

#### 4. Verbose Type Gymnastics
```diff
- const result: Array<{ id: string; name: string; email: string }> =
-   users.map((user: { id: string; name: string; email: string }) => ({
-     id: user.id,
-     name: user.name,
-     email: user.email,
-   }));
+ const result = users.map(user => ({
+   id: user.id, name: user.name, email: user.email,
+ }));
```

### 🟡 Moderate Slop (Context-Dependent)

#### 5. Over-Defensive Null Checks
```diff
  function getName(user: User): string {
-   if (!user) throw new Error('User is required');  // ← TypeScript already enforces this
-   if (!user.name) return '';  // ← Only if name is truly optional
    return user.name;
  }
```

#### 6. Gratuitous Constants
```diff
- const MAX_RETRIES = 3;
- const RETRY_DELAY_MS = 1000;
- const DEFAULT_TIMEOUT = 5000;
-
  // Only used once, inline them
- for (let i = 0; i < MAX_RETRIES; i++) {
+ for (let i = 0; i < 3; i++) {
```

#### 7. Utility Function Graveyards
```diff
- // utils.ts — 200 lines of functions, 3 actually used
- export function capitalize(s: string) { ... }     // Used 0 times
- export function truncate(s: string, n: number) { ... }  // Used 0 times
- export function slugify(s: string) { ... }        // Used 1 time — inline it
```

### ⚪ Stylistic Slop (Optional Cleanup)

#### 8. Excessive Logging
```diff
  function processOrder(order: Order) {
-   console.log('Processing order:', order.id);
-   console.log('Order items:', order.items.length);
    const total = calculateTotal(order);
-   console.log('Calculated total:', total);
    const result = submitOrder(order, total);
-   console.log('Order submitted:', result);
    return result;
  }
```

#### 9. README-Style File Headers
```diff
- /**
-  * UserService.ts
-  *
-  * This module provides the UserService class which handles all user-related
-  * operations including creation, retrieval, updating, and deletion of users.
-  * It integrates with the database layer and provides validation logic.
-  *
-  * @module UserService
-  * @author AI Assistant
-  * @created 2026-01-15
-  */
  export class UserService {
```

## Execution Protocol

### Step 1: Scan
```bash
# Find large files (likely AI-generated)
find src -name '*.ts' -o -name '*.tsx' | xargs wc -l | sort -rn | head -20

# Find comment-heavy files
grep -rcl '// ' src/ | xargs grep -c '// ' | sort -t: -k2 -rn | head -10

# Find unused exports
npx ts-unused-exports tsconfig.json
```

### Step 2: Categorize
For each file, categorize slop into 🔴 Critical / 🟡 Moderate / ⚪ Stylistic.

### Step 3: Clean
Apply fixes in order:
1. Remove 🔴 Critical slop (always safe)
2. Remove 🟡 Moderate slop (verify each case)
3. Optionally clean ⚪ Stylistic slop

### Step 4: Verify
```bash
# Run tests to ensure nothing broke
npm test

# Check TypeScript compilation
npx tsc --noEmit

# Verify no dead code was missed
npx ts-prune
```

## Output Format

```markdown
## AI Slop Report

### Files Analyzed: 12
### Slop Instances Found: 47

| Category | Count | Lines Removed | Example |
|----------|-------|---------------|---------|
| 🔴 Captain Obvious Comments | 18 | 54 | `// Return the result` |
| 🔴 Useless Try/Catch | 5 | 25 | `catch { throw error }` |
| 🔴 Premature Abstraction | 2 | 40 | `BaseService` with 1 child |
| 🟡 Over-Defensive Nulls | 8 | 16 | `if (!x) throw Error` |
| 🟡 Gratuitous Constants | 6 | 12 | `MAX_RETRIES = 3` used once |
| ⚪ Excessive Logging | 8 | 24 | 5 console.logs in 10-line fn |

**Total Lines Removed: 171**
**Code Reduction: 12%**
```

## Critical Rules

1. **Tests first** — Run tests before AND after cleanup. If tests break, revert.
2. **No behavior changes** — Slop cleanup is cosmetic. Logic must stay identical.
3. **One commit per category** — Separate "remove dead comments" from "inline abstractions".
4. **Keep meaningful comments** — API docs, regex explanations, workaround notes are NOT slop.
5. **Team conventions override** — If the team prefers verbose constants, don't inline them.

## Integration with refactor-cleaner

This skill complements the `refactor-cleaner` agent:
- **ai-slop-cleaner**: Identifies and removes AI-specific patterns (comments, abstractions)
- **refactor-cleaner**: General dead code removal, code health, structural cleanup

Use both together for comprehensive code hygiene:
```
1. /skill ai-slop-cleaner  → Remove AI patterns
2. /agent refactor-cleaner → Deep structural cleanup
```
