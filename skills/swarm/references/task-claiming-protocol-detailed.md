## Task Claiming Protocol (Detailed)

### Atomic Claim Operation with SQLite

The core strength of the new implementation is transactional atomicity:

```typescript
function claimTask(agentId: string): ClaimResult {
  // Transaction ensures only ONE agent succeeds
  const claimTransaction = db.transaction(() => {
    // Step 1: Find first pending task
    const task = db.prepare(
      'SELECT id, description FROM tasks WHERE status = "pending" ORDER BY id LIMIT 1'
    ).get();

    if (!task) {
      return { success: false, reason: 'No pending tasks' };
    }

    // Step 2: Attempt claim (will only succeed if status is still 'pending')
    const result = db.prepare(
      'UPDATE tasks SET status = "claimed", claimed_by = ?, claimed_at = ? WHERE id = ? AND status = "pending"'
    ).run(agentId, Date.now(), task.id);

    if (result.changes === 0) {
      // Another agent claimed it between SELECT and UPDATE - try next
      return { success: false, reason: 'Task was claimed by another agent' };
    }

    // Step 3: Update heartbeat to show we're alive and working
    db.prepare(
      'INSERT OR REPLACE INTO heartbeats (agent_id, last_heartbeat, current_task_id) VALUES (?, ?, ?)'
    ).run(agentId, Date.now(), task.id);

    return { success: true, taskId: task.id, description: task.description };
  }).immediate();  // Explicitly acquire RESERVED lock for immediate transaction

  return claimTransaction();  // Atomic execution
}
```

**Why SQLite Transactions Work:**
- Transactions are called with `.immediate()` to acquire RESERVED lock
- Prevents other agents from modifying rows between SELECT and UPDATE
- All-or-nothing atomicity: claim succeeds completely or fails completely
- No race conditions, no lost updates

### Lease Timeout & Auto-Release

Tasks are automatically released if claimed too long without heartbeat:

```typescript
function cleanupStaleClaims(leaseTimeout: number = 5 * 60 * 1000) {
  // Default 5-minute timeout
  const cutoffTime = Date.now() - leaseTimeout;

  const cleanupTransaction = db.transaction(() => {
    // Find claimed tasks where:
    // 1. Claimed longer than timeout, OR
    // 2. Agent hasn't sent heartbeat in that time
    const staleTasks = db.prepare(`
      SELECT t.id
      FROM tasks t
      LEFT JOIN heartbeats h ON t.claimed_by = h.agent_id
      WHERE t.status = 'claimed'
        AND t.claimed_at < ?
        AND (h.last_heartbeat IS NULL OR h.last_heartbeat < ?)
    `).all(cutoffTime, cutoffTime);

    // Release each stale task back to pending
    for (const staleTask of staleTasks) {
      db.prepare('UPDATE tasks SET status = "pending", claimed_by = NULL, claimed_at = NULL WHERE id = ?')
        .run(staleTask.id);
    }

    return staleTasks.length;
  }).immediate();  // Explicitly acquire RESERVED lock for immediate transaction

  return cleanupTransaction();
}
```

**How Recovery Works:**
1. Orchestrator calls cleanupStaleClaims() every 60 seconds
2. If agent hasn't sent heartbeat in 5 minutes, task is auto-released
3. Another agent picks up the orphaned task
4. Original agent can continue working (it doesn't know it was released)
5. When original agent tries to mark task as done, verification fails safely
