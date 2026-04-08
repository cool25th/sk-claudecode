---
name: context-engineering
description: "Optimizes agent context for maximum output quality. Use when starting a new session, when agent output quality degrades, when switching tasks, or when configuring CLAUDE.md and rules files."
triggers:
  - "context setup"
  - "set up context"
  - "improve context"
  - "configure rules"
---

# Context Engineering

Feed agents the right information at the right time. Context is the single biggest lever for agent output quality — too little and the agent hallucinates, too much and it loses focus.

## When to Use

- Starting a new coding session
- Agent output quality is declining (wrong patterns, hallucinated APIs)
- Switching between different parts of a codebase
- Setting up a new project for AI-assisted development
- Agent is not following project conventions

**When NOT to use:** Simple one-off tasks where context is already clear from the conversation.

## The Context Hierarchy

Structure context from most persistent to most transient:

```
┌─────────────────────────────────────┐
│  1. Rules Files (CLAUDE.md, etc.)   │ ← Always loaded, project-wide
├─────────────────────────────────────┤
│  2. Spec / Architecture Docs        │ ← Loaded per feature/session
├─────────────────────────────────────┤
│  3. Relevant Source Files            │ ← Loaded per task
├─────────────────────────────────────┤
│  4. Error Output / Test Results      │ ← Loaded per iteration
├─────────────────────────────────────┤
│  5. Conversation History             │ ← Accumulates, compacts
└─────────────────────────────────────┘
```

### Level 1: Rules Files

Create a rules file that persists across sessions. This is the highest-leverage context you can provide.

**CLAUDE.md** (for Claude Code):
```markdown
# Project: [Name]

## Tech Stack
- React 18, TypeScript 5, Vite

## Commands
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint --fix`
- Dev: `npm run dev`

## Code Conventions
- Functional components with hooks (no class components)
- Named exports (no default exports)
- Colocate tests next to source: `Button.tsx` → `Button.test.tsx`

## Boundaries
- Never commit .env files or secrets
- Never add dependencies without checking bundle size impact
- Ask before modifying database schema
- Always run tests before committing

## Patterns
[One short example of a well-written component in your style]
```

**Equivalent files for other tools:**
- `.cursorrules` or `.cursor/rules/*.md` (Cursor)
- `.windsurfrules` (Windsurf)
- `.github/copilot-instructions.md` (GitHub Copilot)
- `AGENTS.md` (OpenAI Codex / Antigravity)

### Level 2: Specs and Architecture

Load the relevant spec section when starting a feature. Don't load the entire spec if only one section applies.

**Effective:** "Here's the authentication section of our spec: [auth spec content]"

**Wasteful:** "Here's our entire 5000-word spec: [full spec]" (when only working on auth)

### Level 3: Relevant Source Files

Before editing a file, read it. Before implementing a pattern, find an existing example in the codebase.

**Pre-task context loading:**
1. Read the file(s) you'll modify
2. Read related test files
3. Find one example of a similar pattern already in the codebase
4. Read any type definitions or interfaces involved

### Level 4: Error Output

When tests fail or builds break, feed the specific error — not the entire 500-line test output.

### Level 5: Conversation Management

Long conversations accumulate stale context. Manage this:
- **Start fresh sessions** when switching between major features
- **Summarize progress** when context is getting long
- **Compact deliberately** — use `/compact` before critical work

## Context Packing Strategies

### The Brain Dump

At session start, provide everything the agent needs:

```
PROJECT CONTEXT:
- We're building [X] using [tech stack]
- The relevant spec section is: [spec excerpt]
- Key constraints: [list]
- Files involved: [list with brief descriptions]
- Related patterns: [pointer to an example file]
- Known gotchas: [list of things to watch out for]
```

### The Selective Include

Only include what's relevant to the current task:

```
TASK: Add email validation to the registration endpoint

RELEVANT FILES:
- src/routes/auth.ts (the endpoint to modify)
- src/lib/validation.ts (existing validation utilities)
- tests/routes/auth.test.ts (existing tests to extend)

PATTERN TO FOLLOW:
- See how phone validation works in src/lib/validation.ts:45-60

CONSTRAINT:
- Must use the existing ValidationError class, not throw raw errors
```

### The Hierarchical Summary

For large projects, maintain a summary index:

```markdown
# Project Map

## Authentication (src/auth/)
Handles registration, login, password reset.
Key files: auth.routes.ts, auth.service.ts, auth.middleware.ts
Pattern: All routes use authMiddleware, errors use AuthError class

## Tasks (src/tasks/)
CRUD for user tasks with real-time updates.
Key files: task.routes.ts, task.service.ts, task.socket.ts
Pattern: Optimistic updates via WebSocket, server reconciliation
```

## MCP Integrations

For richer context, use Model Context Protocol servers:

| MCP Server | What It Provides |
|-----------|-----------------|
| **Context7** | Auto-fetches relevant library documentation |
| **Chrome DevTools** | Live browser state, DOM, console, network |
| **PostgreSQL** | Direct database schema and query results |
| **Filesystem** | Project file access and search |
| **GitHub** | Issue, PR, and repository context |

## Confusion Management

Even with good context, you will encounter ambiguity.

### When Context Conflicts

```
Spec says:         "Use REST for all endpoints"
Existing code has: GraphQL for the user profile query
```

**Do NOT** silently pick one. Surface it:

```
CONFUSION:
The spec calls for REST endpoints, but the existing codebase uses GraphQL
for user queries (src/graphql/user.ts).

Options:
A) Follow the spec — add REST endpoint, deprecate GraphQL later
B) Follow existing patterns — use GraphQL, update the spec
C) Ask — this seems like an intentional decision I shouldn't override

→ Which approach should I take?
```

### When Requirements Are Incomplete

If the spec doesn't cover a case you need to implement:

1. Check existing code for precedent
2. If no precedent exists, **stop and ask**
3. Don't invent requirements — that's the human's job

```
MISSING REQUIREMENT:
The spec defines task creation but doesn't specify what happens
when a user creates a task with a duplicate title.

Options:
A) Allow duplicates (simplest)
B) Reject with validation error (strictest)
C) Append a number suffix like "Task (2)" (most user-friendly)

→ Which behavior do you want?
```

### The Inline Planning Pattern

For multi-step tasks, emit a lightweight plan before executing:

```
PLAN:
1. Add Zod schema for task creation
2. Wire schema into POST /api/tasks route handler
3. Add test for validation error response
→ Executing unless you redirect.
```

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Context starvation | Agent invents APIs, ignores conventions | Load rules file + source files before each task |
| Context flooding | Agent loses focus with >5,000 lines of non-task context | Include only what is relevant. Aim for <2,000 lines. |
| Stale context | Agent references outdated patterns | Start fresh sessions when context drifts |
| Missing examples | Agent invents a new style | Include one example of the pattern to follow |
| Implicit knowledge | Agent doesn't know project rules | Write it down in rules files |
| Silent confusion | Agent guesses when it should ask | Surface ambiguity using confusion management patterns |

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The agent should figure out conventions" | It can't read your mind. Write a rules file — 10 minutes that saves hours. |
| "I'll just correct it when it goes wrong" | Prevention is cheaper than correction. Upfront context prevents drift. |
| "More context is always better" | Performance degrades with too many instructions. Be selective. |
| "The context window is huge, I'll use it all" | Context window size ≠ attention budget. Focused context outperforms large context. |

## Red Flags

- Agent output doesn't match project conventions
- Agent invents APIs or imports that don't exist
- Agent re-implements utilities that already exist in the codebase
- Agent quality degrades as the conversation gets longer
- No rules file exists in the project
- External data files treated as trusted instructions

## Verification

After setting up context, confirm:

- [ ] Rules file exists and covers tech stack, commands, conventions, and boundaries
- [ ] Agent output follows the patterns shown in the rules file
- [ ] Agent references actual project files and APIs (not hallucinated ones)
- [ ] Context is refreshed when switching between major tasks

## Related Skills

- `configure-ecc` — ECC-specific configuration
- `plan` — Strategic planning with context
- `exploration` — Codebase context gathering

## Related Agents

- `explore` - Codebase exploration (Haiku)
- `architect` - Architecture analysis (Sonnet)
