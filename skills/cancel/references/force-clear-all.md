## Force Clear All

To clear ALL state files regardless of what's active:

```
/sk-claudecode:cancel --force
```

Or use the `--all` alias:

```
/sk-claudecode:cancel --all
```

This removes all state files:
- `.skc/state/autopilot-state.json`
- `.skc/state/ralph-state.json`
- `.skc/state/ralph-plan-state.json`
- `.skc/state/ralph-verification.json`
- `.skc/state/ultrawork-state.json`
- `.skc/state/ecomode-state.json`
- `.skc/state/ultraqa-state.json`
- `.skc/state/swarm.db`
- `.skc/state/swarm.db-wal`
- `.skc/state/swarm.db-shm`
- `.skc/state/swarm-active.marker`
- `.skc/state/swarm-tasks.db`
- `.skc/state/ultrapilot-state.json`
- `.skc/state/ultrapilot-ownership.json`
- `.skc/state/pipeline-state.json`
- `.skc/state/plan-consensus.json`
- `.skc/state/ralplan-state.json`
- `.skc/state/boulder.json`
- `.skc/state/hud-state.json`
- `.skc/state/subagent-tracking.json`
- `.skc/state/subagent-tracker.lock`
- `.skc/state/rate-limit-daemon.pid`
- `.skc/state/rate-limit-daemon.log`
- `.skc/state/budget-guard-state.json`
- `.skc/state/checkpoints/` (directory)
