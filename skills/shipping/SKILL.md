---
name: shipping
description: "Prepares production launches. Use when deploying to production, setting up monitoring, planning a staged rollout, or when you need a rollback strategy."
triggers:
  - "ship"
  - "launch"
  - "deploy to production"
  - "go live"
  - "rollout"
---

# Shipping & Launch

Ship with confidence. Deploy safely, with monitoring in place, a rollback plan ready, and a clear understanding of what success looks like. Every launch should be reversible, observable, and incremental.

## When to Use

- Deploying a feature to production for the first time
- Releasing a significant change to users
- Migrating data or infrastructure
- Opening a beta or early access program
- Any deployment that carries risk (all of them)

**When NOT to use:** Local development or staging-only deploys that don't affect users.

## The Pre-Launch Checklist

### Code Quality

- [ ] All tests pass (unit, integration, e2e)
- [ ] Build succeeds with no warnings
- [ ] Lint and type checking pass
- [ ] Code reviewed and approved
- [ ] No TODO comments that should be resolved before launch
- [ ] No `console.log` debugging statements in production code
- [ ] Error handling covers expected failure modes

### Security

- [ ] No secrets in code or version control
- [ ] `npm audit` shows no critical or high vulnerabilities
- [ ] Input validation on all user-facing endpoints
- [ ] Authentication and authorization checks in place
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] Rate limiting on authentication endpoints
- [ ] CORS configured to specific origins (not wildcard)

### Performance

- [ ] Core Web Vitals within "Good" thresholds
- [ ] No N+1 queries in critical paths
- [ ] Images optimized (compression, responsive sizes, lazy loading)
- [ ] Bundle size within budget
- [ ] Database queries have appropriate indexes
- [ ] Caching configured for static assets and repeated queries

### Accessibility

- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader can convey page content and structure
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 for text)
- [ ] Focus management correct for modals and dynamic content
- [ ] Error messages are descriptive and associated with form fields

### Infrastructure

- [ ] Environment variables set in production
- [ ] Database migrations applied (or ready to apply)
- [ ] DNS and SSL configured
- [ ] CDN configured for static assets
- [ ] Logging and error reporting configured
- [ ] Health check endpoint exists and responds

### Documentation

- [ ] README updated with any new setup requirements
- [ ] API documentation current
- [ ] ADRs written for any architectural decisions
- [ ] Changelog updated
- [ ] User-facing documentation updated (if applicable)

## Feature Flag Strategy

Ship behind feature flags to decouple deployment from release:

```typescript
const flags = await getFeatureFlags(userId);

if (flags.newFeature) {
  return <NewFeaturePanel />;
}
return null;
```

**Feature flag lifecycle:**

```
1. DEPLOY with flag OFF     → Code in production but inactive
2. ENABLE for team/beta     → Internal testing in production
3. GRADUAL ROLLOUT          → 5% → 25% → 50% → 100%
4. MONITOR at each stage    → Watch error rates, performance
5. CLEAN UP                 → Remove flag and dead code after full rollout
```

**Rules:**
- Every feature flag has an owner and an expiration date
- Clean up flags within 2 weeks of full rollout
- Don't nest feature flags
- Test both flag states in CI

## Staged Rollout

### The Rollout Sequence

```
1. DEPLOY to staging → Full test suite + manual smoke test
2. DEPLOY to production (flag OFF) → Verify health check
3. ENABLE for team (flag ON for internal) → 24-hour window
4. CANARY rollout (5%) → Monitor 24-48 hours
5. GRADUAL increase (25% → 50% → 100%)
6. FULL rollout → Monitor 1 week → Clean up flag
```

### Rollout Decision Thresholds

| Metric | ✅ Advance | ⚠️ Hold | 🔴 Roll Back |
|--------|-----------|--------|-------------|
| Error rate | Within 10% of baseline | 10-100% above baseline | > 2x baseline |
| P95 latency | Within 20% of baseline | 20-50% above baseline | > 50% above baseline |
| Client JS errors | No new error types | New errors at < 0.1% | New errors at > 0.1% |
| Business metrics | Neutral or positive | Decline < 5% | Decline > 5% |

### When to Roll Back Immediately

- Error rate increases by more than 2x baseline
- P95 latency increases by more than 50%
- User-reported issues spike
- Data integrity issues detected
- Security vulnerability discovered

## Rollback Strategy

Every deployment needs a rollback plan BEFORE it happens:

```markdown
## Rollback Plan for [Feature/Release]

### Trigger Conditions
- Error rate > 2x baseline
- P95 latency > [X]ms
- User reports of [specific issue]

### Rollback Steps
1. Disable feature flag (if applicable) — < 1 minute
   OR
1. Deploy previous version: `git revert <commit> && git push` — < 5 minutes
2. Verify rollback: health check, error monitoring
3. Communicate: notify team of rollback

### Database Considerations
- Migration [X] has a rollback: `npx prisma migrate rollback`
- Data inserted by new feature: [preserved / cleaned up]
```

## Post-Launch Verification

In the first hour after launch:

1. Check health endpoint returns 200
2. Check error monitoring dashboard (no new error types)
3. Check latency dashboard (no regression)
4. Test the critical user flow manually
5. Verify logs are flowing and readable
6. Confirm rollback mechanism works (dry run if possible)

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "It works in staging, it'll work in production" | Production has different data, traffic patterns, and edge cases. |
| "We don't need feature flags for this" | Every feature benefits from a kill switch. |
| "Monitoring is overhead" | You discover problems from dashboards, not user complaints. |
| "Rolling back is admitting failure" | Rolling back is responsible engineering. Shipping broken is the failure. |
| "It's Friday afternoon, let's ship it" | Never ship on Friday. |

## Red Flags

- Deploying without a rollback plan
- No monitoring or error reporting in production
- Big-bang releases (everything at once, no staging)
- Feature flags with no expiration or owner
- No one monitoring the deploy for the first hour
- Production configuration done by memory, not code

## Verification

Before deploying:

- [ ] Pre-launch checklist completed (all sections green)
- [ ] Feature flag configured (if applicable)
- [ ] Rollback plan documented
- [ ] Monitoring dashboards set up
- [ ] Team notified of deployment

After deploying:

- [ ] Health check returns 200
- [ ] Error rate is normal
- [ ] Latency is normal
- [ ] Critical user flow works
- [ ] Logs are flowing
- [ ] Rollback tested or verified ready

## See Also

- `references/security-checklist.md` — Security pre-launch checks
- `references/performance-checklist.md` — Performance pre-launch checks
- `references/accessibility-checklist.md` — Accessibility verification

## Related Skills

- `release` — NPM/package release workflow
- `ci-cd` — CI/CD pipeline management
- `security-review` — Security audit

## Related Agents

- `qa-tester` - Quality assurance
- `security-reviewer` - Security review
