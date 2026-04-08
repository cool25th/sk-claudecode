---
name: self-improve
description: Autonomous evolutionary code improvement engine with tournament selection and rollback-safe verification
---

# Self-Improve

Autonomous code improvement engine that generates multiple improvement candidates, evaluates them in isolation, and selects the best through tournament competition. Designed for safe, incremental codebase evolution without human-in-the-loop for each iteration.

## When to Use

- Codebase quality improvement across multiple files/modules
- Refactoring with uncertain optimal approach (need to explore alternatives)
- When the user says "self-improve", "evolve", "optimize this codebase", or "find and fix quality issues"
- Post-feature cleanup sessions
- Technical debt reduction sprints

## When NOT to Use

- Feature development (use `plan` → `executor`)
- Bug fixing with known root cause (use `executor` directly)
- Performance optimization (use `performance-optimization` skill)
- When changes require human review before each step (use manual code review instead)
- On production-critical code without a test suite (too risky for autonomous improvement)

## Prerequisites

Before starting a self-improve session:

- [ ] **Test suite exists** — Must have automated tests to verify improvements don't break anything
- [ ] **Git is initialized** — Need version control for rollback safety
- [ ] **Clean working directory** — No uncommitted changes (`git status --porcelain` is empty)

## Workflow

### Phase 1: Assessment

1. **Scan the target** — Identify improvement opportunities in the specified scope
2. **Classify improvements** by type:

| Type | Description | Risk |
|------|-------------|------|
| **Dead code removal** | Unused functions, imports, variables | Low |
| **Duplication reduction** | Repeated logic that should be consolidated | Low |
| **Naming improvements** | Unclear names, inconsistent conventions | Low |
| **Error handling** | Missing error paths, swallowed exceptions | Medium |
| **Type safety** | Missing types, `any` usage, unsafe casts | Medium |
| **Architecture** | Misplaced responsibilities, boundary violations | High |
| **Algorithm optimization** | Inefficient implementations | High |

3. **Prioritize** — Order by impact/risk ratio (high impact + low risk first)

### Phase 2: Candidate Generation (Tournament)

For each improvement opportunity:

1. **Create isolated workspace**:
   ```bash
   # Option A: Git worktree (preferred)
   git worktree add .improve-candidate-N -b improve/candidate-N

   # Option B: File backup (fallback)
   cp -r target_file target_file.improve-backup
   ```

2. **Generate N candidates** (typically 2-3):
   - Each candidate takes a different approach to the same improvement
   - Candidates MUST be independent — no shared state between them

3. **Evaluate each candidate** against:
   - [ ] All existing tests still pass
   - [ ] No new lint/type errors introduced
   - [ ] Code complexity is reduced or unchanged (measured by cyclomatic complexity or line count)
   - [ ] Readability is improved (subjective but documented)
   - [ ] No behavior change unless explicitly intended

### Phase 3: Tournament Selection

Compare candidates and select the winner:

```
## Tournament Round: [Improvement Name]

### Candidate A: [Approach description]
- Tests: ✅ PASS / ❌ FAIL
- Lines changed: +N / -M
- Complexity delta: [reduced/unchanged/increased]
- Readability: [improved/unchanged/degraded]

### Candidate B: [Approach description]
- Tests: ✅ PASS / ❌ FAIL
- Lines changed: +N / -M
- Complexity delta: [reduced/unchanged/increased]
- Readability: [improved/unchanged/degraded]

### Winner: Candidate [A/B]
### Reason: [Evidence-based justification]
```

**Selection rules**:
- Any candidate that breaks tests is **automatically eliminated**
- Among passing candidates, prefer: fewer lines → lower complexity → better readability
- If candidates are close, prefer the **simpler** approach (Rule 0)

### Phase 4: Apply & Verify

1. **Apply the winning candidate** to the main branch
2. **Run full verification**:
   ```bash
   # Run all tests
   npm test  # or appropriate test command
   
   # Run type checker
   npx tsc --noEmit  # or equivalent
   
   # Run linter
   npm run lint  # or equivalent
   ```
3. **Commit with descriptive message**:
   ```bash
   git add -A
   git commit -m "improve: [description of improvement]

   Candidates evaluated: N
   Winner: Candidate [X] - [reason]
   Tests: all passing
   Lines: +N/-M (net: -K)"
   ```

### Phase 5: Cleanup

1. **Remove worktrees/backups**:
   ```bash
   git worktree remove .improve-candidate-N
   git branch -D improve/candidate-N
   ```
2. **Generate session report**

## State Management

Track session state in a local file:

```json
{
  "session_id": "improve-20260409-abc",
  "target_scope": "src/auth/",
  "status": "in_progress",
  "improvements": [
    {
      "id": 1,
      "type": "dead_code_removal",
      "target": "src/auth/legacy.ts",
      "candidates": 2,
      "winner": "A",
      "status": "applied",
      "tests_passing": true
    }
  ],
  "started_at": "ISO timestamp",
  "completed_at": null
}
```

## Session Report Template

```markdown
# Self-Improve Session Report

**Scope**: [target directory/files]
**Duration**: [time]
**Improvements Applied**: N / M attempted

## Applied Improvements
| # | Type | Target | Approach | Lines Changed |
|---|------|--------|----------|---------------|
| 1 | Dead code | file.ts | Removed 3 unused functions | -45 |
| 2 | Duplication | utils.ts | Consolidated 2 helpers | +12 / -38 |

## Rejected Candidates
| # | Type | Target | Reason |
|---|------|--------|--------|
| 3 | Architecture | service.ts | All candidates broke tests |

## Net Impact
- Lines: -71 net reduction
- Test coverage: unchanged
- Type safety: improved (2 `any` removed)
```

## Red Flags

- Proceeding without a test suite
- Making changes on a dirty git working directory
- Skipping tournament selection and directly applying the first idea
- Not cleaning up worktrees/backups after session
- Changing behavior as a "bonus" during a quality improvement
- Applying improvements that increase complexity

## Verification

After each improvement cycle:
- [ ] All tests pass
- [ ] No new lint/type errors
- [ ] Git history is clean (no dangling worktrees)
- [ ] Session report generated
- [ ] Net complexity is reduced or unchanged

## Related

- `skills/ai-slop-cleaner` — For targeted AI-generated code cleanup
- `skills/incremental-implementation` — For scope discipline during improvements
- `/agent refactor-cleaner` — For mechanical refactoring tasks
