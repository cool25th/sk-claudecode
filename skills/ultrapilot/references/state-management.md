## State Management

### Session State

**Location:** `.skc/ultrapilot-state.json`

```json
{
  "sessionId": "ultrapilot-20260123-1234",
  "taskDescription": "Build a full-stack todo app",
  "phase": "execution",
  "startTime": "2026-01-23T10:30:00Z",
  "decomposition": { /* from Phase 1 */ },
  "workers": {
    "worker-1": {
      "status": "running",
      "taskId": "task-abc123",
      "startTime": "2026-01-23T10:31:00Z",
      "estimatedDuration": "5m"
    }
  },
  "conflicts": [],
  "validationAttempts": 0
}
```

### File Ownership Map

**Location:** `.skc/state/ultrapilot-ownership.json`

Tracks which worker owns which files (see Phase 2 example above).

### Progress Tracking

**Location:** `.skc/ultrapilot/progress.json`

```json
{
  "totalWorkers": 5,
  "completedWorkers": 3,
  "activeWorkers": 2,
  "failedWorkers": 0,
  "estimatedTimeRemaining": "2m30s"
}
```
