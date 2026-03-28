---
name: handoff
description: Generate structured session handoff document for seamless continuation in a new session
---

# Handoff Skill

Generate a comprehensive handoff document that captures the current work state, enabling seamless continuation in a new Claude Code session.

## When to Use

- Context window is getting full and needs session rotation
- Stopping work for the day and resuming later
- Handing off work to a different agent or person
- Before running `/compact` to preserve critical context

## Handoff Document Template

Generate a markdown file at `.skc/handoffs/{timestamp}-{topic}.md`:

```markdown
# Session Handoff — {Topic}

> Generated: {ISO timestamp}
> Session Duration: {approximate}

## 🎯 Objective
{One paragraph: what the user originally asked for}

## ✅ Completed
{Numbered list of completed work items with file paths}

1. **{Task}** — `path/to/file`
   - What was done and why

## 🔄 In Progress
{Current work that was interrupted}

- **{Task}** — `path/to/file`
  - Current state: {what's done so far}
  - Next step: {exactly what to do next}
  - Blocker (if any): {what's blocking}

## 📋 Remaining
{Work items not yet started}

- [ ] {Task description}
- [ ] {Task description}

## 📁 Key Files
{Files that are central to this work}

| File | Role | Status |
|------|------|--------|
| `path/to/file` | {purpose} | Modified / Created / Reviewed |

## ⚠️ Gotchas & Decisions
{Important context that would be lost without this document}

- **Decision**: {what was decided and why}
- **Gotcha**: {non-obvious issue discovered}
- **Pattern**: {established convention to follow}

## 🧪 Verification State
{Current test/build status}

- Tests: {passing/failing — which ones}
- Build: {clean/errors}
- Lint: {clean/warnings}

## 🚀 Resume Instructions
{Exact prompt to paste in the new session to continue}

```
Read .skc/handoffs/{filename} and continue the work from where it left off.
```
```

## Execution Protocol

### Phase 1: Gather Context (READ-ONLY)

1. **Review conversation history** — Identify the original objective
2. **List modified files** — `git diff --name-only` or `git status`
3. **Check test state** — Run tests if applicable
4. **Identify todos** — Scan for any active todo items

### Phase 2: Classify Work Items

Categorize every work item into exactly one bucket:

| Status | Criteria |
|--------|----------|
| ✅ Completed | Code written, tests pass, no follow-up needed |
| 🔄 In Progress | Partially done, can describe exact next step |
| 📋 Remaining | Not started, but identified as needed |

### Phase 3: Generate Document

1. Write the handoff document using the template above
2. Be **specific** — file paths, line numbers, function names
3. Be **actionable** — each "next step" should be executable without guessing
4. Include **decisions** — rationale for choices made (most likely to be lost)

### Phase 4: Verify Completeness

Self-check the document:

| Check | Requirement |
|-------|-------------|
| Objective clear? | A new agent should understand the goal in one read |
| Next steps specific? | Each remaining task has a concrete action, not vague description |
| Files listed? | Every modified/created file is referenced |
| Decisions preserved? | Non-obvious choices are documented with rationale |
| Resume prompt works? | The resume instruction is copy-pasteable |

## Output Location

```
.skc/
└── handoffs/
    ├── 2026-03-28T15-handoff-auth-refactor.md
    ├── 2026-03-27T09-handoff-api-migration.md
    └── ...
```

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| "Continue the refactoring" | "Refactor `UserService.create()` in `src/services/user.ts:45` to use the new `AuthProvider` interface" |
| "Fix remaining tests" | "Fix `auth.test.ts` — `testLogin` fails because mock doesn't include `refreshToken` field (added in step 2)" |
| "Some decisions were made" | "Chose JWT over session cookies because the API is stateless (discussed with user)" |
| Dump entire conversation | Extract only actionable state and decisions |

## Integration with Other Skills

- **After `deep-interview`**: Handoff preserves interview results for implementation session
- **After `plan`**: Handoff captures plan execution progress
- **Before `/compact`**: Run handoff first to preserve context
- **With `learner`**: Handoff captures session-specific state; learner captures cross-session patterns
