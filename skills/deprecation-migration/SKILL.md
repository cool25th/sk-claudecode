---
name: deprecation-migration
description: "Manages deprecation and migration. Use when removing old systems, APIs, or features. Use when migrating users from one implementation to another or deciding whether to maintain or sunset existing code."
triggers:
  - "deprecate"
  - "migrate"
  - "sunset"
  - "remove legacy"
---

# Deprecation & Migration

Code is a liability, not an asset. Every line has ongoing maintenance cost. Deprecation removes code that no longer earns its keep; migration moves users safely from old to new.

## When to Use

- Replacing an old system, API, or library with a new one
- Sunsetting a feature that's no longer needed
- Consolidating duplicate implementations
- Removing dead code that nobody owns but everybody depends on
- Planning the lifecycle of a new system

**When NOT to use:** Active systems that still provide unique value and have reasonable maintenance cost.

## The Deprecation Decision

Before deprecating anything, answer:

```
1. Does this system still provide unique value?
   → If yes, maintain it. If no, proceed.

2. How many users/consumers depend on it?
   → Quantify the migration scope.

3. Does a replacement exist?
   → If no, build the replacement first. Don't deprecate without an alternative.

4. What's the migration cost for each consumer?
   → If trivially automated, do it. If manual and high-effort, weigh against maintenance cost.

5. What's the ongoing maintenance cost of NOT deprecating?
   → Security risk, engineer time, opportunity cost of complexity.
```

## Compulsory vs Advisory Deprecation

| Type | When to Use | Mechanism |
|------|-------------|-----------|
| **Advisory** | Migration is optional, old system is stable | Warnings, documentation, nudges |
| **Compulsory** | Security issues, blocks progress, or unsustainable maintenance | Hard deadline with migration tooling |

**Default to advisory.** Use compulsory only when maintenance cost or risk justifies forcing migration.

## The Migration Process

### Step 1: Build the Replacement

Don't deprecate without a working alternative. The replacement must:
- Cover all critical use cases of the old system
- Have documentation and migration guides
- Be proven in production (not just "theoretically better")

### Step 2: Announce and Document

```markdown
## Deprecation Notice: OldService

**Status:** Deprecated as of YYYY-MM-DD
**Replacement:** NewService (see migration guide below)
**Removal date:** Advisory — no hard deadline yet
**Reason:** OldService requires manual scaling and lacks observability.

### Migration Guide
1. Replace `import { client } from 'old-service'` with `import { client } from 'new-service'`
2. Update configuration (see examples below)
3. Run the migration verification script: `npx migrate-check`
```

### Step 3: Migrate Incrementally

Migrate consumers one at a time:

1. Identify all touchpoints with the deprecated system
2. Update to use the replacement
3. Verify behavior matches (tests, integration checks)
4. Remove references to the old system
5. Confirm no regressions

**The Churn Rule:** If you own the infrastructure being deprecated, you are responsible for migrating your users — or providing backward-compatible updates that require no migration.

### Step 4: Remove the Old System

Only after all consumers have migrated:

1. Verify zero active usage (metrics, logs, dependency analysis)
2. Remove the code
3. Remove associated tests, documentation, and configuration
4. Remove the deprecation notices
5. Celebrate — removing code is an achievement

## Migration Patterns

### Strangler Pattern

Run old and new systems in parallel. Route traffic incrementally from old to new.

```
Phase 1: New system handles 0%, old handles 100%
Phase 2: New system handles 10% (canary)
Phase 3: New system handles 50%
Phase 4: New system handles 100%, old system idle
Phase 5: Remove old system
```

### Adapter Pattern

Create an adapter that translates calls from the old interface to the new implementation.

```typescript
class LegacyService implements OldAPI {
  constructor(private newService: NewService) {}

  // Old method signature, delegates to new implementation
  getData(id: number): OldFormat {
    const data = this.newService.findById(String(id));
    return this.toOldFormat(data);
  }
}
```

### Feature Flag Migration

Use feature flags to switch consumers one at a time:

```typescript
function getService(userId: string): Service {
  if (featureFlags.isEnabled('new-service', { userId })) {
    return new NewService();
  }
  return new LegacyService();
}
```

## Zombie Code

Code that nobody owns but everybody depends on. Signs:

- No commits in 6+ months but active consumers exist
- No assigned maintainer or team
- Failing tests that nobody fixes
- Dependencies with known vulnerabilities that nobody updates

**Response:** Either assign an owner and maintain it properly, or deprecate it with a concrete migration plan. Zombie code cannot stay in limbo.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "It still works, why remove it?" | Working code that nobody maintains accumulates security debt and complexity. |
| "Someone might need it later" | If needed later, it can be rebuilt. Keeping unused code costs more than rebuilding. |
| "The migration is too expensive" | Compare migration cost to ongoing maintenance cost over 2-3 years. |
| "Users will migrate on their own" | They won't. Provide tooling, documentation, and incentives. |
| "We can maintain both indefinitely" | Two systems doing the same thing is double the maintenance. |

## Red Flags

- Deprecated systems with no replacement available
- Deprecation announcements with no migration tooling
- "Soft" deprecation advisory for years with no progress
- Zombie code with no owner and active consumers
- New features added to a deprecated system
- Removing code without verifying zero active consumers

## Verification

After completing a deprecation:

- [ ] Replacement is production-proven and covers all critical use cases
- [ ] Migration guide exists with concrete steps and examples
- [ ] All active consumers have been migrated (verified by metrics/logs)
- [ ] Old code, tests, documentation, and configuration are fully removed
- [ ] No references to the deprecated system remain in the codebase

## Related Skills

- `plan` — Planning the migration strategy
- `code-review` — Reviewing migration changes
- `docs` — Documenting ADRs for deprecation decisions

## Related Agents

- `architect` - Architecture analysis (Sonnet)
- `refactor-cleaner` - Code cleanup
