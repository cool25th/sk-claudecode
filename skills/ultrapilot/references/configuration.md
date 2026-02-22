## Configuration

Optional settings in `.claude/settings.json`:

```json
{
  "skc": {
    "ultrapilot": {
      "maxWorkers": 5,
      "maxValidationRounds": 3,
      "conflictPolicy": "coordinator-handles",
      "fallbackToAutopilot": true,
      "parallelThreshold": 2,
      "pauseAfterDecomposition": false,
      "verboseProgress": true
    }
  }
}
```

**Settings Explained:**
- `maxWorkers` - Max parallel workers (5 is Claude Code limit)
- `maxValidationRounds` - Validation retry attempts
- `conflictPolicy` - "coordinator-handles" or "abort-on-conflict"
- `fallbackToAutopilot` - Auto-switch if task not parallelizable
- `parallelThreshold` - Min subtasks to use ultrapilot (else fallback)
- `pauseAfterDecomposition` - Confirm with user before execution
- `verboseProgress` - Show detailed worker progress
