---
name: ai-slop-cleaner
description: Clean AI-generated code slop with a regression-safe, deletion-first workflow
---

# AI Slop Cleaner

Bounded cleanup workflow for AI-generated code that works but feels bloated, repetitive, weakly tested, or over-abstracted. Focuses on simplification without changing behavior.

## When to Use

- After AI-assisted coding sessions that left noisy, repetitive, or over-abstracted code
- When the user says "deslop", "anti-slop", "AI slop", or "clean up the AI code"
- When code has duplicate logic, dead code, wrapper layers, or boundary leaks
- Post-implementation cleanup when the feature works but the code quality is poor
- When the goal is simplification, not new feature delivery

## When NOT to Use

- New feature development or product changes
- Broad redesigns (use `plan` → `executor`)
- Generic refactoring with no simplification intent
- Simple formatting or style fixes (use linter)
- Code with unclear behavior that can't be protected by tests

## Core Principles

1. **Preserve behavior** — Unless explicitly asked for behavior changes
2. **Lock before edit** — Write regression tests first, then clean
3. **Plan before code** — Write a cleanup plan before touching files
4. **Deletion over addition** — Prefer removing code over adding code
5. **Reuse over create** — Use existing utilities before introducing new ones
6. **Small diffs** — Keep changes reversible and smell-focused

## Workflow

### Step 1: Protect Current Behavior

Before editing anything:

1. Identify what must stay the same
2. Add or run the narrowest regression tests needed
3. If tests can't come first, record the verification plan explicitly

```
## Behavior Lock
- Feature X: [test file / manual verification steps]
- Feature Y: [test file / manual verification steps]
- Edge case Z: [test file / manual verification steps]
```

### Step 2: Write a Cleanup Plan

Bound the pass to specific files/areas:

```
## Cleanup Plan
- Scope: [files / feature area]
- Smells to remove:
  1. [specific smell with file:line reference]
  2. [specific smell with file:line reference]
- Order: safest deletion → riskier consolidation
```

### Step 3: Classify the Slop

| Category | Description | Examples |
|----------|-------------|---------|
| **Duplication** | Repeated logic, copy-paste branches | Two handlers doing the same validation |
| **Dead code** | Unused code, unreachable branches | Exported function with zero callers |
| **Needless abstraction** | Pass-through wrappers, speculative indirection | `fetchData()` that just calls `fetch()` |
| **Boundary violations** | Hidden coupling, misplaced responsibilities | UI component importing DB utilities |
| **Missing tests** | Behavior not locked, weak regression coverage | Core function with zero test coverage |

### Step 4: Run Smell-Focused Passes

Execute **one pass at a time**, in this order:

| Pass | Focus | Verification |
|------|-------|-------------|
| **Pass 1** | Dead code deletion | Run tests after |
| **Pass 2** | Duplicate removal | Run tests after |
| **Pass 3** | Naming and error handling cleanup | Run tests after |
| **Pass 4** | Test reinforcement | Verify coverage improves |

> **DO NOT** bundle unrelated refactors into the same edit set.

### Step 5: Run Quality Gates

After each pass:
- [ ] Regression tests green
- [ ] Lint passes
- [ ] Type check passes
- [ ] No new warnings introduced

If a gate fails → fix or back out, don't force through.

### Step 6: Close with Evidence Report

```
## Cleanup Report

### Changed Files
- [list of modified files]

### Simplifications
- Removed N unused functions (-X lines)
- Consolidated M duplicate helpers (-Y lines)
- Eliminated K wrapper layers (-Z lines)

### Behavior Lock / Verification
- All regression tests passing
- [specific test suite]: ✅

### Remaining Risks
- [anything that couldn't be safely cleaned]
```

## Review Mode

For post-cleanup quality review (separate from the editing pass):

1. Do **NOT** edit files
2. Review the cleanup plan, changed files, and regression coverage
3. Check for:
   - Leftover dead code or unused exports
   - Duplicate logic that should have been consolidated
   - Needless wrappers that still blur boundaries
   - Missing tests for preserved behavior
   - Cleanup that accidentally changed behavior
4. Produce a reviewer verdict with required follow-ups
5. Hand needed changes back to a separate editing pass

## Red Flags

- Cleaning code without regression tests in place
- Bundling "bonus" behavior changes into cleanup
- Adding new abstractions during a simplification pass
- Expanding scope beyond the declared cleanup plan
- Skipping the plan and jumping directly to editing

## Verification

After a complete cleanup session:
- [ ] All regression tests pass
- [ ] Net line count is reduced (or justified if increased)
- [ ] No new dependencies added
- [ ] Cleanup report generated with evidence
- [ ] Behavior is unchanged (unless explicitly intended)

## Related

- `skills/self-improve` — For autonomous multi-candidate improvement
- `skills/incremental-implementation` — For scope discipline
- `/agent refactor-cleaner` — For mechanical refactoring execution
- `skills/references/testing-patterns.md` — For regression test patterns
