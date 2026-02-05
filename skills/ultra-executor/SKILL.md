---
name: ultra-executor
description: Activate autonomous deep work mode for complex goal-oriented tasks
---

# Ultra Executor Skill

Triggers the ultra-executor agent for deep, autonomous work on complex tasks.

## Overview

Ultra Executor is SK-ClaudeCode's most powerful execution mode. It spawns an Opus-powered agent that:

- **Explores** the codebase thoroughly before acting
- **Plans** with full context of existing patterns
- **Executes** autonomously without hand-holding
- **Verifies** every change with diagnostics and tests

## When to Use

| Scenario | Use Ultra Executor |
|----------|-------------------|
| Multi-file refactoring | ✅ Yes |
| Complex feature implementation | ✅ Yes |
| Architecture changes | ✅ Yes |
| Bug fixing across systems | ✅ Yes |
| Simple typo fixes | ❌ No - use regular edit |
| Single file changes | ❌ No - do it directly |

## Activation

```
/skill ultra-executor <your complex task description>
```

Or use the agent directly:
```
/sk-claudecode:ultra-executor <your complex task>
```

## Key Features

### 1. Explore-First Protocol
Before any execution, Ultra Executor uses tools like `Glob`, `Grep`, and `ast_grep_search` to fully understand the problem space.

### 2. Pattern Discovery
Automatically discovers and follows existing code patterns, naming conventions, and error handling styles.

### 3. Parallel Exploration
Can spawn up to 3 parallel exploration agents to gather context faster (explore, explore-medium, explore-high).

### 4. Strict Verification
Every change is verified with:
- LSP diagnostics
- Build commands
- Test suites
- Debug code checks

### 5. Failure Recovery
Built-in escalation protocol after 3 failed attempts - consults architect-medium for guidance.

## Related Skills

- `/skill ultra-execute` - Plan execution mode
- `/skill ultra-plan` - Writing plans before execution
- `/skill ultrawork` - Combined planning and execution workflow

## Related Agents

- `ultra-executor` - This skill's primary agent (Opus)
- `architect-medium` - Consulted for escalation
- `explore` / `explore-medium` / `explore-high` - For parallel exploration
