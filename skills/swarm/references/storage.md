## Storage

### SQLite Database (`.skc/state/swarm.db`)

The swarm uses a single SQLite database stored at `.skc/state/swarm.db`. This provides:
- **ACID compliance** - All task state transitions are atomic
- **Concurrent access** - Multiple agents query/update safely
- **Persistence** - State survives agent crashes
- **Query efficiency** - Fast status lookups and filtering

#### `tasks` Table Schema
```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
    -- pending: waiting to be claimed
    -- claimed: claimed by an agent, in progress
    -- done: completed successfully
    -- failed: completed with error
  claimed_by TEXT,                  -- agent ID that claimed this task
  claimed_at INTEGER,               -- Unix timestamp when claimed
  completed_at INTEGER,             -- Unix timestamp when completed
  result TEXT,                      -- Optional result/output from task
  error TEXT                        -- Error message if task failed
);
```

#### `heartbeats` Table Schema
```sql
CREATE TABLE heartbeats (
  agent_id TEXT PRIMARY KEY,
  last_heartbeat INTEGER NOT NULL,  -- Unix timestamp of last heartbeat
  current_task_id TEXT              -- Task agent is currently working on
);
```

#### `session` Table Schema
```sql
CREATE TABLE session (
  id TEXT PRIMARY KEY,
  agent_count INTEGER NOT NULL,
  started_at INTEGER NOT NULL,
  completed_at INTEGER,
  active INTEGER DEFAULT 1
);
```
