---
name: release
description: Automated release workflow for sk-claudecode
---

# Release Skill

Automate the release process for sk-claudecode.

## Usage

```
/sk-claudecode:release <version>
```

Example: `/sk-claudecode:release 2.4.0` or `/sk-claudecode:release patch` or `/sk-claudecode:release minor`

## Release Checklist

Execute these steps in order:

### 1. Version Bump
Update version in all locations:
- `package.json`
- `src/installer/index.ts` (VERSION constant)
- `src/__tests__/installer.test.ts` (expected version)
- `.claude-plugin/plugin.json`
- `README.md` (version badge and title)

### 2. Run Tests
```bash
npm run test:run
```
All 231+ tests must pass before proceeding.

### 3. Commit Version Bump
```bash
git add -A
git commit -m "chore: Bump version to <version>"
```

### 4. Create & Push Tag
```bash
git tag v<version>
git push origin main
git push origin v<version>
```

### 5. Publish to npm
```bash
npm publish --access public
```

### 6. Create GitHub Release
```bash
gh release create v<version> --title "v<version> - <title>" --notes "<release notes>"
```

### 7. Verify
- [ ] npm: https://www.npmjs.com/package/oh-my-claude-sisyphus
- [ ] GitHub: https://github.com/Yeachan-Heo/sk-claudecode/releases

## Version Files Reference

| File | Field/Line |
|------|------------|
| `package.json` | `"version": "X.Y.Z"` |
| `src/installer/index.ts` | `export const VERSION = 'X.Y.Z'` |
| `src/__tests__/installer.test.ts` | `expect(VERSION).toBe('X.Y.Z')` |
| `.claude-plugin/plugin.json` | `"version": "X.Y.Z"` |
| `README.md` | Title + version badge |

## Semantic Versioning

- **patch** (X.Y.Z+1): Bug fixes, minor improvements
- **minor** (X.Y+1.0): New features, backward compatible
- **major** (X+1.0.0): Breaking changes

## Notes

- Always run tests before publishing
- Create release notes summarizing changes
- Plugin marketplace syncs automatically from GitHub releases

## Production Launch Integration

For production application deployments (not just NPM publishes), use the full `shipping` skill which provides:
- Pre-launch checklist (code/security/performance/accessibility/infrastructure/docs)
- Staged rollout sequence with decision thresholds
- Feature flag lifecycle management
- Rollback strategy templates

See: `/sk-claudecode:shipping`

## Staged Rollout Guide

For critical releases, follow this staged approach:

```
1. Tag & publish to npm (this skill)
2. Deploy to staging → run full test suite
3. Deploy to production with feature flag OFF
4. Enable for internal team → 24h monitoring
5. Canary rollout (5%) → 24-48h monitoring
6. Gradual increase → 25% → 50% → 100%
```

### Rollout Decision Thresholds

| Metric | ✅ Advance | ⚠️ Hold | 🔴 Roll Back |
|--------|-----------|--------|-------------|
| Error rate | Within 10% of baseline | 10-100% above | > 2x baseline |
| P95 latency | Within 20% of baseline | 20-50% above | > 50% above |

## Rollback Strategy

Every release should have a rollback plan:

```bash
# Quick rollback via npm
npm unpublish oh-my-claude-sisyphus@<version>
npm publish --tag latest  # republish previous version

# Quick rollback via git
git revert <commit>
git push origin main
```

## Pre-Publish Deep Review (Optional)

For minor/major releases, run a multi-layer review before publishing. This catches issues that single-reviewer workflows miss.

### When to Apply

| Release Type | Review Level |
|---|---|
| **patch** | Standard checklist above is sufficient |
| **minor** | Recommended — run at least Layer 1 + Layer 3 |
| **major** | **Mandatory** — run all 3 layers |

### Layer 1: Per-Change Analysis

Group changes since last release by module/feature area:

```bash
# Get changes since last release
PUBLISHED=$(npm view <pkg> version 2>/dev/null || echo "0.0.0")
git log "v${PUBLISHED}"..HEAD --oneline
git diff "v${PUBLISHED}"..HEAD --stat
```

For each change group, analyze:

| Check | Question |
|---|---|
| **Correctness** | Does the code do what it claims? Trace 3+ scenarios. |
| **Breaking Changes** | Does this alter any public API, config format, or behavior? |
| **Pattern Adherence** | Does new code follow established patterns? |
| **Edge Cases** | What inputs/conditions would break this? |
| **Error Handling** | Are errors caught and propagated properly? |
| **Type Safety** | Any `as any`, `@ts-ignore`, loose typing? |
| **Test Coverage** | Are behavioral changes covered by meaningful tests? |
| **Side Effects** | Could this break a different module? |

**Output per group:**

```markdown
### [Group Name]
- Verdict: PASS / FAIL
- Risk: SAFE / CAUTION / RISKY
- Breaking Changes: YES / NO
- Blocking Issues: [list or "none"]
```

### Layer 2: Holistic Review

Review the FULL changeset as a whole using `/agent critic` or `/agent code-reviewer`:

| Review Area | What to Check |
|---|---|
| **Goal Compliance** | Do all changes serve the stated release goals? |
| **Code Quality** | Consistent style, no AI slop, proper naming |
| **Security** | No new vulnerabilities, secrets, or unsafe patterns |
| **Test Adequacy** | Integration tests cover cross-cutting concerns |
| **Context Mining** | Are there hidden dependencies or timing assumptions? |

### Layer 3: Release Synthesis

Final bird's-eye assessment:

1. **Release Coherence**: Do changes tell a coherent story, or is it a grab-bag?
2. **Version Bump Verification**: Based on semver analysis:
   - PATCH: Bug fixes only, no behavior changes
   - MINOR: New features, backward-compatible
   - MAJOR: Breaking changes to public API or behavior
3. **Breaking Changes Audit**: Exhaustive list of what could break existing users
4. **Migration Requirements**: If breaking, what steps do users need?
5. **Deployment Risk**: SAFE / CAUTION / RISKY / BLOCK

### Verdict Logic

| Condition | Verdict |
|---|---|
| Any layer found CRITICAL blocking issues | **BLOCK** — do NOT publish |
| Multiple change groups flagged CAUTION or FAIL | **RISKY** — fix before publish |
| Minor issues but nothing blocking | **CAUTION** — consider fixing |
| All layers pass | **SAFE** — proceed with publish |

### Pre-Publish Report Template

```markdown
## Pre-Publish Review — v{version}

### Overall Verdict: SAFE / CAUTION / RISKY / BLOCK
### Recommended Version Bump: PATCH / MINOR / MAJOR

### Per-Change Analysis
| # | Group | Verdict | Risk | Breaking? |
|---|-------|---------|------|-----------|
| 1 | {name} | PASS/FAIL | SAFE/CAUTION | YES/NO |

### Holistic Review
- Code Quality: PASS/FAIL
- Security: PASS/FAIL
- Test Coverage: PASS/FAIL

### Breaking Changes
[Exhaustive list or "None"]

### Blocking Issues (Prioritized)
[Must fix before publish, or "None"]
```

## See Also

- `shipping` — Full production launch checklist
- `ci-cd` — CI/CD pipeline management
- `pr-workflow` — Full PR lifecycle with verification loop
- `dead-code-removal` — Pre-release dead code cleanup
- `references/security-checklist.md` — Security pre-launch checks

