---
name: ultrapilot
description: Parallel autopilot with file ownership partitioning
---


# Ultrapilot Skill

Parallel autopilot that spawns multiple workers with file ownership partitioning for maximum speed.

## Overview

Ultrapilot is the parallel evolution of autopilot. It decomposes your task into independent parallelizable subtasks, assigns non-overlapping file sets to each worker, and runs them simultaneously.

**Key Capabilities:**
1. **Decomposes** task into parallel-safe components
2. **Partitions** files with exclusive ownership (no conflicts)
3. **Spawns** up to 5 parallel workers (Claude Code limit)
4. **Coordinates** progress via TaskOutput
5. **Integrates** changes with sequential handling of shared files
6. **Validates** full system integrity

**Speed Multiplier:** Up to 5x faster than sequential autopilot for suitable tasks.

## Usage

```
/sk-claudecode:ultrapilot <your task>
/sk-claudecode:up "Build a full-stack todo app"
/sk-claudecode:ultrapilot Refactor the entire backend
```

## Magic Keywords

These phrases auto-activate ultrapilot:
- "ultrapilot", "ultra pilot"
- "parallel build", "parallel autopilot"
- "swarm build", "swarm mode"
- "fast parallel", "ultra fast"

## When to Use

**Ultrapilot Excels At:**
- Multi-component systems (frontend + backend + database)
- Independent feature additions across different modules
- Large refactorings with clear module boundaries
- Parallel test file generation
- Multi-service architectures

**Autopilot Better For:**
- Single-threaded sequential tasks
- Heavy interdependencies between components
- Tasks requiring constant integration checks
- Small focused features in a single module

## Cancellation

```
/sk-claudecode:cancel
```

Or say: "stop", "cancel ultrapilot", "abort"

**Behavior:**
- All active workers gracefully terminated
- Partial progress saved to state file
- Session can be resumed

## Resume

If ultrapilot was cancelled or a worker failed:

```
/sk-claudecode:ultrapilot resume
```

**Resume Logic:**
- Restart failed workers only
- Re-use completed worker outputs
- Continue from last phase

## Best Practices

1. **Clear module boundaries** - Works best with well-separated code
2. **Minimal shared state** - Reduces integration complexity
3. **Trust the decomposition** - Architect knows what's parallel-safe
4. **Monitor progress** - Check `.skc/ultrapilot/progress.json`
5. **Review conflicts early** - Don't wait until integration

## Differences from Autopilot

| Feature | Autopilot | Ultrapilot |
|---------|-----------|------------|
| Execution | Sequential | Parallel (up to 5x) |
| Best For | Single-threaded tasks | Multi-component systems |
| Complexity | Lower | Higher |
| Speed | Standard | 3-5x faster (suitable tasks) |
| File Conflicts | N/A | Ownership partitioning |
| Fallback | N/A | Can fallback to autopilot |
| Setup | Instant | Decomposition phase (~1-2 min) |

**Rule of Thumb:** If task has 3+ independent components, use ultrapilot. Otherwise, use autopilot.

## STATE CLEANUP ON COMPLETION

**IMPORTANT: Delete state files on completion - do NOT just set `active: false`**

When all workers complete successfully:

```bash
# Delete ultrapilot state files
rm -f .skc/state/ultrapilot-state.json
rm -f .skc/state/ultrapilot-ownership.json
```

## Future Enhancements

**Planned for v4.1:**
- Dynamic worker scaling (start with 2, spawn more if needed)
- Predictive conflict detection (pre-integration analysis)
- Worker-to-worker communication (for rare dependencies)
- Speculative execution (optimistic parallelism)
- Resume from integration phase (if validation fails)

**Planned for v4.2:**
- Multi-machine distribution (if Claude Code supports)
- Real-time progress dashboard
- Worker performance analytics
- Auto-tuning of decomposition strategy

## Detailed References

- **Architecture**: See [references/architecture.md](references/architecture.md)
- **Phases**: See [references/phases.md](references/phases.md)
- **State Management**: See [references/state-management.md](references/state-management.md)
- **Configuration**: See [references/configuration.md](references/configuration.md)
- **Examples**: See [references/examples.md](references/examples.md)
- **File Ownership Strategy**: See [references/file-ownership-strategy.md](references/file-ownership-strategy.md)
- **Conflict Handling**: See [references/conflict-handling.md](references/conflict-handling.md)
- **Troubleshooting**: See [references/troubleshooting.md](references/troubleshooting.md)
- **Advanced: Custom Decomposition**: See [references/advanced-custom-decomposition.md](references/advanced-custom-decomposition.md)
