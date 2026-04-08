---
name: docs
description: "Documentation writing, ADRs, and technical writing. Use for document, readme, docs, architectural decisions, and writing tasks."
triggers:
  - "document"
  - "readme"
  - "docs"
  - "adr"
  - "architecture decision"
---

# Documentation & ADRs Skill

## Purpose
Create clear, comprehensive documentation for code, APIs, and projects. Record architectural decisions that capture the *why* — not just the *what*.

## Architecture Decision Records (ADRs)

ADRs capture the reasoning behind significant technical decisions. They're the highest-value documentation you can write.

### When to Write an ADR

- Choosing a framework, library, or major dependency
- Designing a data model or database schema
- Selecting an authentication strategy
- Deciding on an API architecture (REST vs. GraphQL vs. tRPC)
- Choosing between build tools, hosting platforms, or infrastructure
- Any decision that would be expensive to reverse

### ADR Template

Store ADRs in `docs/decisions/` with sequential numbering:

```markdown
# ADR-001: [Decision Title]

## Status
Accepted | Superseded by ADR-XXX | Deprecated

## Date
YYYY-MM-DD

## Context
[What problem are we solving? Key requirements and constraints.]

## Decision
[What we chose and why.]

## Alternatives Considered

### [Alternative A]
- Pros: [...]
- Cons: [...]
- Rejected: [reason]

### [Alternative B]
- Pros: [...]
- Cons: [...]
- Rejected: [reason]

## Consequences
[What this decision means for the project going forward.]
```

### ADR Lifecycle

```
PROPOSED → ACCEPTED → (SUPERSEDED or DEPRECATED)
```

- **Don't delete old ADRs.** They capture historical context.
- When a decision changes, write a new ADR that references and supersedes the old one.

## README Template

```markdown
# Project Name

One-paragraph description of what this project does.

## Quick Start
1. Clone the repo
2. Install dependencies: `npm install`
3. Set up environment: `cp .env.example .env`
4. Run the dev server: `npm run dev`

## Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm test` | Run tests |
| `npm run build` | Production build |
| `npm run lint` | Run linter |

## Architecture
Brief overview of the project structure and key design decisions.
Link to ADRs for details.

## Contributing
How to contribute, coding standards, PR process.
```

## API Documentation

### Inline with Types (Preferred for TypeScript)

```typescript
/**
 * Creates a new task.
 *
 * @param input - Task creation data (title required, description optional)
 * @returns The created task with server-generated ID and timestamps
 * @throws {ValidationError} If title is empty or exceeds 200 characters
 * @throws {AuthenticationError} If the user is not authenticated
 *
 * @example
 * const task = await createTask({ title: 'Buy groceries' });
 * console.log(task.id); // "task_abc123"
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  // ...
}
```

### Endpoint Format

```markdown
## GET /api/users

Get all users.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| page | int | No | Page number |

**Response:**
\`\`\`json
{ "users": [...] }
\`\`\`
```

## Code Comments

### Comment the Why, Not the What

```typescript
// BAD: Restates the code
// Increment counter by 1
counter += 1;

// GOOD: Explains non-obvious intent
// Rate limit uses a sliding window — reset counter at window boundary,
// not on a fixed schedule, to prevent burst attacks at window edges
if (now - windowStart > WINDOW_SIZE_MS) {
  counter = 0;
  windowStart = now;
}
```

### When NOT to Comment

```typescript
// Don't comment self-explanatory code
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Don't leave TODO comments for things you should just do now
// TODO: add error handling  ← Just add it

// Don't leave commented-out code
// const oldImpl = () => { ... }  ← Delete it, git has history
```

### Document Known Gotchas

```typescript
/**
 * IMPORTANT: This function must be called before the first render.
 * If called after hydration, it causes a flash of unstyled content
 * because the theme context isn't available during SSR.
 *
 * See ADR-003 for the full design rationale.
 */
export function initializeTheme(theme: Theme): void {
  // ...
}
```

## Changelog Maintenance

For shipped features:

```markdown
# Changelog

## [1.2.0] - YYYY-MM-DD
### Added
- Task sharing: users can share tasks with team members (#123)
- Email notifications for task assignments (#124)

### Fixed
- Duplicate tasks appearing when rapidly clicking create button (#125)

### Changed
- Task list now loads 50 items per page (was 20) for better UX (#126)
```

## Documentation for Agents

Special consideration for AI agent context:
- **CLAUDE.md / rules files** — Document project conventions so agents follow them
- **Spec files** — Keep specs updated so agents build the right thing
- **ADRs** — Help agents understand past decisions (prevents re-deciding)
- **Inline gotchas** — Prevent agents from falling into known traps

## Best Practices

- Write for your audience
- Include examples
- Keep it up to date
- Use consistent formatting
- Comment the *why*, not the *what*
- Record decisions, not just code
- No commented-out code — git has history

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The code is self-documenting" | Code shows *what*. It doesn't show *why* or what alternatives were rejected. |
| "We'll write docs when the API stabilizes" | APIs stabilize faster when you document them. |
| "Nobody reads docs" | Agents do. Future engineers do. Your 3-months-later self does. |
| "ADRs are overhead" | A 10-minute ADR prevents a 2-hour debate six months later. |
| "Comments get outdated" | Comments on *why* are stable. Comments on *what* get outdated. |

## Red Flags

- Architectural decisions with no written rationale
- Public APIs with no documentation or types
- README that doesn't explain how to run the project
- Commented-out code instead of deletion
- TODO comments that have been there for weeks
- No ADRs in a project with significant architectural choices

## Verification

- [ ] ADRs exist for all significant architectural decisions
- [ ] README covers quick start, commands, and architecture overview
- [ ] API functions have parameter and return type documentation
- [ ] Known gotchas are documented inline where they matter
- [ ] No commented-out code remains
- [ ] Rules files (CLAUDE.md etc.) are current and accurate

## Related Skills

- `context-engineering` — Setting up CLAUDE.md and rules files
- `plan` — Spec-driven planning with documentation

## Related Agents

- `writer` - Technical writing (Sonnet)
- `writer` - Documentation specialist
