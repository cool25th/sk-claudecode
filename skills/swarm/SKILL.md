---
name: swarm
description: N coordinated agents on shared task list with SQLite-based atomic claiming
---


# Swarm Skill

Spawn N coordinated agents working on a shared task list with SQLite-based atomic claiming. Like a dev team tackling multiple files in parallel—fast, reliable, and with full fault tolerance.

## Usage

```
/swarm N:agent-type "task description"
```

### Parameters

- **N** - Number of agents (1-5, enforced by Claude Code limit)
- **agent-type** - Agent to spawn (e.g., executor, build-fixer, architect)
- **task** - High-level task to decompose and distribute

### Examples

```bash
/swarm 5:executor "fix all TypeScript errors"
/swarm 3:build-fixer "fix build errors in src/"
/swarm 4:designer "implement responsive layouts for all components"
/swarm 2:architect "analyze and document all API endpoints"
```

## Key Parameters

- **Max Agents:** 5 (enforced by Claude Code background task limit)
- **Lease Timeout:** 5 minutes (default, configurable)
  - Tasks claimed longer than this without heartbeat are auto-released
- **Heartbeat Interval:** 60 seconds (recommended)
  - Agents should call `heartbeat()` at least this often
  - Prevents false timeout while working on long tasks
- **Cleanup Interval:** 60 seconds
  - Orchestrator automatically runs `cleanupStaleClaims()` to release orphaned tasks
- **Database:** SQLite (stored at `.skc/state/swarm.db`)
  - One database per swarm session
  - Survives agent crashes
  - Provides ACID guarantees

## Cancel Swarm

User can cancel via `/sk-claudecode:cancel`:
- Stops orchestrator monitoring
- Signals all background agents to exit
- Preserves partial progress in SQLite database
- Marks session as "cancelled" in database

## STATE CLEANUP ON COMPLETION

**IMPORTANT: Delete state files on completion - do NOT just set `active: false`**

When all tasks are done:

```bash
# Delete swarm state files
rm -f .skc/state/swarm-state.json
rm -f .skc/state/swarm-tasks.json
rm -f .skc/state/swarm-claims.json
```

## Detailed References

- **Architecture**: See [references/architecture.md](references/architecture.md)
- **Workflow**: See [references/workflow.md](references/workflow.md)
- **Storage**: See [references/storage.md](references/storage.md)
- **Task Claiming Protocol (Detailed)**: See [references/task-claiming-protocol-detailed.md](references/task-claiming-protocol-detailed.md)
- **API Reference**: See [references/api-reference.md](references/api-reference.md)
- **Error Handling & Recovery**: See [references/error-handling-recovery.md](references/error-handling-recovery.md)
- **Use Cases**: See [references/use-cases.md](references/use-cases.md)
- **Benefits of SQLite-Based Implementation**: See [references/benefits-of-sqlite-based-implementation.md](references/benefits-of-sqlite-based-implementation.md)
- **Implementation Notes**: See [references/implementation-notes.md](references/implementation-notes.md)
