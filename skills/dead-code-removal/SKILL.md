---
name: dead-code-removal
description: Systematic dead code detection and removal with LSP verification, parallel batch execution, and atomic commits
---

# Dead Code Removal

Structured workflow for finding and removing unused code with zero false positives. Uses compiler/LSP verification before any removal, batches changes for parallel execution, and commits atomically per batch.

## When to Use

- Regular codebase hygiene (quarterly or after major feature completion)
- Before major refactoring (clean slate before restructuring)
- Technical debt reduction sprints
- When the user says "remove dead code", "find unused code", "clean up unused exports"
- Post-migration cleanup (removing code from deprecated APIs)

## When NOT to Use

- Small files where manual review is faster
- When uncertain about dynamic usage patterns (reflection, eval, dynamic imports)
- On auto-generated code (schemas, migrations, bindings)
- Without a working test suite (no safety net for false positives)

## Prerequisites

- [ ] **Working test suite** — Tests must pass before starting
- [ ] **Clean git state** — No uncommitted changes
- [ ] **TypeScript/lint tooling available** — Need `--noUnusedLocals` or equivalent
- [ ] **LSP access** — For `FindReferences` verification (or equivalent grep-based fallback)

## Workflow

### Phase 1: SCAN — Find Candidates

Run detection methods in parallel:

**Method A: Compiler strict mode (primary scanner)**
```bash
# TypeScript
npx tsc --noEmit --noUnusedLocals --noUnusedParameters 2>&1

# ESLint (for JS projects)
npx eslint --rule 'no-unused-vars: error' src/

# Python
ruff check --select F811,F841 .
```

**Method B: Unused exports detection**
```bash
# Find exported symbols not imported elsewhere
# For each export, grep the symbol name across src/
# If it only appears in its own file → candidate
```

**Method C: Orphaned files**
```bash
# Find files in src/ NOT imported by any other file
# EXCLUDE: index.ts, *.test.*, entry points, config files
```

Collect ALL results into a unified candidate list.

### Phase 2: VERIFY — Zero False Positives

For EACH candidate, verify with LSP or equivalent:

```
FindReferences(symbol, includeDeclaration=false)
→ 0 references = CONFIRMED dead
→ 1+ references = NOT dead, DROP from list
```

#### False Positive Guards

NEVER mark as dead:
- Symbols in entry points (`index.ts`, `main.ts`, `app.ts`)
- Symbols in barrel `index.ts` re-exports
- Symbols referenced in test files (tests ARE valid consumers)
- Symbols with `@public` / `@api` / `@exported` JSDoc tags
- Factory functions (`createXXX`), hook registrations, plugin definitions
- Command/route handlers registered dynamically
- Symbols referenced in `package.json` exports or bin fields
- Symbols used via dependency injection or reflection patterns

**Produce a verified list:**

```markdown
| # | File:Line | Symbol | Type | Action |
|---|-----------|--------|------|--------|
| 1 | src/foo.ts:42 | unusedFunc | function | REMOVE |
| 2 | src/bar.ts:10 | OldType | type | REMOVE |
| 3 | src/baz.ts:7 | ctx | parameter | PREFIX _ |
```

**Action types:**
- `REMOVE` — Delete the symbol/import/file entirely
- `PREFIX _` — Unused parameter required by signature → rename to `_paramName`

If ZERO confirmed candidates: report "No dead code found" and **STOP**.

### Phase 3: BATCH — Group for Conflict-Free Execution

**Goal: maximize parallel work with ZERO file conflicts.**

1. Group confirmed items by FILE PATH
2. All items in the SAME file → SAME batch (prevents edit conflicts)
3. Entire-file deletions → their own batch
4. Target 3-10 batches

```
Batch A: [src/hooks/foo.ts — 3 unused imports]
Batch B: [src/features/bar.ts — 2 unused constants, 1 dead function]
Batch C: [src/utils/old-helper.ts — entire file deletion]
```

### Phase 4: EXECUTE — Remove Per Batch

For each batch:

1. **Read** each file to understand exact syntax at target lines
2. **Re-verify** with `FindReferences` (another change may have created new usage)
3. **Apply** the change:
   - Unused import (only symbol): remove entire import line
   - Unused import (one of many): remove only that symbol from the import
   - Unused declaration: remove the declaration + clean up trailing blank lines
   - Unused parameter: prefix with `_` (do NOT remove — required by signature)
   - Dead file: delete the file
4. **Run verification**:
   ```bash
   # Language-appropriate check
   npx tsc --noEmit       # TypeScript
   python -m py_compile   # Python
   go vet ./...            # Go
   ```
5. **If verification fails**: Revert all changes in this batch and report failure
6. **If verification passes**: Commit atomically:
   ```bash
   git add [specific-files-only]  # NEVER git add -A
   git commit -m "refactor: remove dead code from [brief file list]

   Removed: [symbol names]
   Verified: typecheck pass, LSP confirmed 0 references"
   ```

> **CRITICAL**: Stage ONLY files in this batch. Never `git add -A` or `git add .` — other batches may be in progress.

### Phase 5: FINAL VERIFICATION

After ALL batches complete:

```bash
# Full project verification
npm run typecheck   # or equivalent
npm test            # note NEW failures vs pre-existing
npm run build       # must pass
```

## Output Template

```markdown
## Dead Code Removal Report

### Summary
- **Candidates Found**: N
- **Verified Dead**: M
- **Successfully Removed**: K
- **Failed Batches**: F

### Removed
| # | Symbol | File | Type | Batch |
|---|--------|------|------|-------|
| 1 | unusedFunc | src/foo.ts | function | A |

### Skipped (verification failed)
| # | Symbol | File | Reason |
|---|--------|------|--------|

### Final Verification
- Typecheck: PASS/FAIL
- Tests: X passing, Y failing (Z pre-existing)
- Build: PASS/FAIL
- Total removed: N symbols across M files
```

## Red Flags

- Removing code without LSP/compiler verification first
- Using `git add -A` during batch execution
- Removing entry points, test files, or config files
- Ignoring dynamic usage patterns (eval, reflection, DI containers)
- Not re-verifying before removal (another edit may have created references)
- Removing parameters from public API functions (breaks callers)

## Verification

After the full workflow:
- [ ] All tests pass
- [ ] Build succeeds
- [ ] No new lint errors
- [ ] Git history has clean, atomic commits per batch
- [ ] No false positives reported by team/users

## Related

- `skills/ai-slop-cleaner` — For broader AI-generated code cleanup
- `skills/references/modular-code-rules` — For structural quality enforcement
- `/agent refactor-cleaner` — For mechanical refactoring tasks
