---
name: ci-cd
description: "Automates CI/CD pipeline setup and quality gates. Use when setting up or modifying build pipelines, configuring test runners in CI, establishing deployment strategies, or debugging CI failures."
triggers:
  - "ci/cd"
  - "pipeline"
  - "github actions"
  - "deploy"
  - "quality gate"
---

# CI/CD & Automation

Automate quality gates so that no change reaches production without passing tests, lint, type checking, and build. CI/CD catches what humans and agents miss.

## When to Use

- Setting up a new project's CI pipeline
- Adding or modifying automated checks
- Configuring deployment pipelines
- Debugging CI failures
- When a change should trigger automated verification

**When NOT to use:** Local-only development without any deployment target.

## The Quality Gate Pipeline

Every change goes through these gates before merge:

```
Pull Request Opened
    │
    ▼
┌─────────────────┐
│   LINT CHECK     │  eslint, prettier
│   ↓ pass         │
│   TYPE CHECK     │  tsc --noEmit
│   ↓ pass         │
│   UNIT TESTS     │  jest/vitest
│   ↓ pass         │
│   BUILD          │  npm run build
│   ↓ pass         │
│   INTEGRATION    │  API/DB tests
│   ↓ pass         │
│   E2E (optional) │  Playwright/Cypress
│   ↓ pass         │
│   SECURITY AUDIT │  npm audit
│   ↓ pass         │
│   BUNDLE SIZE    │  bundlesize check
└─────────────────┘
    │
    ▼
  Ready for review
```

**No gate can be skipped.** If lint fails, fix lint — don't disable the rule.

## GitHub Actions Configuration

### Basic CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - name: Lint
        run: npm run lint
      - name: Type check
        run: npx tsc --noEmit
      - name: Test
        run: npm test -- --coverage
      - name: Build
        run: npm run build
      - name: Security audit
        run: npm audit --audit-level=high
```

### With Database Integration Tests

```yaml
  integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: ci_user
          POSTGRES_PASSWORD: ${{ secrets.CI_DB_PASSWORD }}
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://ci_user:${{ secrets.CI_DB_PASSWORD }}@localhost:5432/testdb
      - name: Integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://ci_user:${{ secrets.CI_DB_PASSWORD }}@localhost:5432/testdb
```

### E2E Tests

```yaml
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
      - name: Build
        run: npm run build
      - name: Run E2E tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## Feeding CI Failures Back to Agents

The power of CI with AI agents is the feedback loop:

```
CI fails → Copy failure output → Feed to agent → Agent fixes → Push → CI re-runs
```

**Key patterns:**

| Failure Type | Agent Action |
|---|---|
| Lint failure | Run `npm run lint --fix` and commit |
| Type error | Read error location and fix the type |
| Test failure | Follow `ultra-debugging` skill |
| Build error | Check config and dependencies |

## Deployment Strategies

### Preview Deployments

Every PR gets a preview deployment for manual testing.

### Feature Flags

Ship behind feature flags to decouple deployment from release:

```typescript
if (featureFlags.isEnabled('new-feature', { userId })) {
  return renderNewFeature();
}
return renderLegacyFeature();
```

**Flag lifecycle:** Create → Enable for testing → Canary → Full rollout → Remove flag and dead code.

### Staged Rollouts

```
PR merged → Staging (auto) → Manual verify → Production → Monitor 15 min
```

## CI Optimization

When the pipeline exceeds 10 minutes:

```
Slow CI pipeline?
├── Cache dependencies (actions/cache or setup-node cache)
├── Run jobs in parallel (split lint, typecheck, test, build)
├── Only run what changed (path filters for docs-only PRs)
├── Use matrix builds (shard test suites)
├── Optimize tests (remove slow tests from critical path)
└── Use larger runners
```

## Environment Management

```
.env.example       → Committed (template)
.env                → NOT committed (local dev)
.env.test           → Committed (test env, no real secrets)
CI secrets          → GitHub Secrets / vault
Production secrets  → Deployment platform / vault
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "CI is too slow" | Optimize the pipeline, don't skip it. |
| "This change is trivial, skip CI" | Trivial changes break builds. CI is fast for trivial changes anyway. |
| "The test is flaky, just re-run" | Flaky tests mask real bugs. Fix the flakiness. |
| "We'll add CI later" | Projects without CI accumulate broken states. Set up on day one. |

## Red Flags

- No CI pipeline in the project
- CI failures ignored or silenced
- Tests disabled in CI to make the pipeline pass
- Production deploys without staging verification
- No rollback mechanism
- Secrets stored in code (not secrets manager)

## Verification

After setting up or modifying CI:

- [ ] All quality gates are present (lint, types, tests, build, audit)
- [ ] Pipeline runs on every PR and push to main
- [ ] Failures block merge (branch protection configured)
- [ ] CI results feed back into the development loop
- [ ] Secrets are stored in the secrets manager
- [ ] Deployment has a rollback mechanism
- [ ] Pipeline runs in under 10 minutes

## Related Skills

- `build-fix` — Fix CI build failures
- `tdd` — Test-driven development
- `security-review` — Security audit
- `shipping` — Production launch checklist

## Related Agents

- `build-fixer` - Build error resolution
- `qa-tester` - Test validation
