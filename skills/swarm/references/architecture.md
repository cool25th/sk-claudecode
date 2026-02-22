## Architecture

```
User: "/swarm 5:executor fix all TypeScript errors"
              |
              v
      [SWARM ORCHESTRATOR]
              |
   +--+--+--+--+--+
   |  |  |  |  |
   v  v  v  v  v
  E1 E2 E3 E4 E5
   |  |  |  |  |
   +--+--+--+--+
          |
          v
    [SQLITE DATABASE]
    ┌─────────────────────┐
    │ tasks table         │
    ├─────────────────────┤
    │ id, description     │
    │ status (pending,    │
    │   claimed, done,    │
    │   failed)           │
    │ claimed_by, claimed_at
    │ completed_at, result│
    │ error               │
    ├─────────────────────┤
    │ heartbeats table    │
    │ (agent monitoring)  │
    └─────────────────────┘
```

**Key Features:**
- SQLite transactions ensure only one agent can claim a task
- Lease-based ownership with automatic timeout and recovery
- Heartbeat monitoring for detecting dead agents
- Full ACID compliance for task state
