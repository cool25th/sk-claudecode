---
name: memory
description: "Persistent memory and context management for Claude Code sessions. Use for remember, memory, context, persist, and note operations."
---

# Memory Skill

Persistent memory system from claude-mem for maintaining context across sessions.

## Available Modes

Located in `modes/` subdirectory:

| Mode | Purpose |
|------|---------|
| `observe` | Capture key observations during session |
| `recall` | Retrieve relevant past context |
| `persist` | Save important context for future sessions |
| `search` | Natural language search through memory |

## How It Works

1. **SessionStart Hook**: Loads relevant context from previous sessions
2. **PostToolUse Hook**: Captures observations during work
3. **SessionEnd Hook**: Persists important learnings

## Usage

```bash
# Implicit via hooks
# Or explicit invocation:
/sk-claudecode:memory/recall "authentication patterns"
```

## Notepad (Absorbed from note skill)

Save important context to `.skc/notepad.md` that survives conversation compaction.

| Command | Action |
|---------|--------|
| `/sk-claudecode:memory note <content>` | Add to Working Memory with timestamp |
| `/sk-claudecode:memory note --priority <content>` | Add to Priority Context (always loaded) |
| `/sk-claudecode:memory note --manual <content>` | Add to MANUAL section (never pruned) |
| `/sk-claudecode:memory note --show` | Display current notepad contents |
| `/sk-claudecode:memory note --prune` | Remove entries older than 7 days |

### Notepad Sections

| Section | Behavior | Use For |
|---------|----------|---------|
| **Priority Context** (500 char limit) | Always injected on session start | Critical facts: "Project uses pnpm", "API in src/api/client.ts" |
| **Working Memory** | Timestamped, auto-pruned after 7 days | Debugging breadcrumbs, temporary findings |
| **MANUAL** | Never auto-pruned | Team contacts, deployment info |

## Related
- `continuous-learning` skill for pattern extraction
- Memory hooks in `hooks/memory-hooks/`
