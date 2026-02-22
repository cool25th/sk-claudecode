## Error Handling & Recovery

### Agent Crash
- Task is claimed but agent stops sending heartbeats
- After 5 minutes of no heartbeat, cleanupStaleClaims() releases the task
- Task returns to 'pending' status for another agent to claim
- Original agent's incomplete work is safely abandoned

### Task Completion Failure
- Agent calls `completeTask()` but is no longer the owner (was released)
- The update silently fails (no agent matches in WHERE clause)
- Agent can detect this by checking return value
- Agent should log error and continue to next task

### Database Unavailable
- `startSwarm()` returns false if database initialization fails
- `claimTask()` returns `{ success: false, reason: 'Database not initialized' }`
- Check `isSwarmReady()` before proceeding

### All Agents Idle
- Orchestrator detects via `getActiveAgents() === 0` or `hasPendingWork() === false`
- Triggers final cleanup and marks swarm as complete
- Remaining failed tasks are preserved in database

### No Tasks Available
- `claimTask()` returns success=false with reason 'No pending tasks available'
- Agent should check `hasPendingWork()` before looping
- Safe for agent to exit cleanly when no work remains
