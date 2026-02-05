---
name: memory
description: Persistent memory and context management for Claude Code sessions
triggers:
  - "remember"
  - "memory"
  - "context"
  - "persist"
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

## Related
- `continuous-learning` skill for pattern extraction
- Memory hooks in `hooks/memory-hooks/`
