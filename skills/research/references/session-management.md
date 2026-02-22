## Session Management

### Directory Structure

```
.skc/research/{session-id}/
  state.json              # Session state and progress
  stages/
    stage-1.md            # Stage 1 findings
    stage-2.md            # Stage 2 findings
    ...
  findings/
    raw/                  # Raw findings from scientists
    verified/             # Post-verification findings
  figures/
    figure-1.png          # Generated visualizations
    ...
  report.md               # Final synthesized report
```

### State File Format

```json
{
  "id": "research-20240115-abc123",
  "goal": "Original research goal",
  "status": "in_progress | complete | blocked | cancelled",
  "mode": "standard | auto",
  "iteration": 3,
  "maxIterations": 10,
  "stages": [
    {
      "id": 1,
      "name": "Stage name",
      "tier": "LOW | MEDIUM | HIGH",
      "status": "pending | running | complete | failed",
      "startedAt": "ISO timestamp",
      "completedAt": "ISO timestamp",
      "findingsFile": "stages/stage-1.md"
    }
  ],
  "verification": {
    "status": "pending | passed | failed",
    "conflicts": [],
    "completedAt": "ISO timestamp"
  },
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

### Session Commands

| Command | Action |
|---------|--------|
| `/sk-claudecode:research status` | Show current session progress |
| `/sk-claudecode:research resume` | Resume most recent interrupted session |
| `/sk-claudecode:research resume <session-id>` | Resume specific session |
| `/sk-claudecode:research list` | List all sessions with status |
| `/sk-claudecode:research report <session-id>` | Generate/regenerate report |
| `/sk-claudecode:research cancel` | Cancel current session (preserves state) |
