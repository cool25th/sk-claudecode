---
name: cancel
description: Cancel any active SKC mode (autopilot, ralph, ultrawork, ecomode, ultraqa, swarm, ultrapilot, pipeline)
---


# Cancel Skill

Intelligent cancellation that detects and cancels the active SKC mode.

**The cancel skill is the standard way to complete and exit any SKC mode.**
When the stop hook detects work is complete, it instructs the LLM to invoke
this skill for proper state cleanup. If cancel fails or is interrupted,
retry with `--force` flag, or wait for the 2-hour staleness timeout as
a last resort.

## What It Does

Automatically detects which mode is active and cancels it:
- **Autopilot**: Stops workflow, preserves progress for resume
- **Ralph**: Stops persistence loop, clears linked ultrawork if applicable
- **Ultrawork**: Stops parallel execution (standalone or linked)
- **Ecomode**: Stops token-efficient parallel execution (standalone or linked to ralph)
- **UltraQA**: Stops QA cycling workflow
- **Swarm**: Stops coordinated agent swarm, releases claimed tasks
- **Ultrapilot**: Stops parallel autopilot workers
- **Pipeline**: Stops sequential agent pipeline

## Usage

```
/sk-claudecode:cancel
```

Or say: "cancelskc", "stopskc"

## What Gets Preserved

| Mode | State Preserved | Resume Command |
|------|-----------------|----------------|
| Autopilot | Yes (phase, files, spec, plan, verdicts) | `/sk-claudecode:autopilot` |
| Ralph | No | N/A |
| Ultrawork | No | N/A |
| UltraQA | No | N/A |
| Swarm | No | N/A |
| Ultrapilot | No | N/A |
| Pipeline | No | N/A |
| Plan Consensus | Yes (plan file path preserved) | N/A |

## Notes

- **Dependency-aware**: Autopilot cancellation cleans up Ralph and UltraQA
- **Link-aware**: Ralph cancellation cleans up linked Ultrawork or Ecomode
- **Safe**: Only clears linked Ultrawork, preserves standalone Ultrawork
- **Local-only**: Clears state files in `.skc/state/` directory
- **Resume-friendly**: Autopilot state is preserved for seamless resume

## Detailed References

- **Auto-Detection**: See [references/auto-detection.md](references/auto-detection.md)
- **Force Clear All**: See [references/force-clear-all.md](references/force-clear-all.md)
- **Implementation Steps**: See [references/implementation-steps.md](references/implementation-steps.md)
- **Complete Implementation**: See [references/complete-implementation.md](references/complete-implementation.md)
- **Messages Reference**: See [references/messages-reference.md](references/messages-reference.md)
