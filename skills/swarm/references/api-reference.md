## API Reference

Agents interact with the swarm via a TypeScript API:

### Initialization

```typescript
import { startSwarm, connectToSwarm } from './swarm';

// Orchestrator starts the swarm
await startSwarm({
  agentCount: 5,
  tasks: ['fix a.ts', 'fix b.ts', ...],
  leaseTimeout: 5 * 60 * 1000,      // 5 minutes (default)
  heartbeatInterval: 60 * 1000      // 60 seconds (default)
});

// Agents join existing swarm
await connectToSwarm(process.cwd());
```

### Agent Loop Pattern

```typescript
import {
  claimTask,
  completeTask,
  failTask,
  heartbeat,
  hasPendingWork,
  disconnectFromSwarm
} from './swarm';

const agentId = 'agent-1';

// Main work loop
while (hasPendingWork()) {
  // Claim next task
  const claim = claimTask(agentId);

  if (!claim.success) {
    console.log('No tasks available:', claim.reason);
    break;
  }

  const { taskId, description } = claim;
  console.log(`Agent ${agentId} working on: ${description}`);

  try {
    // Do the work...
    const result = await executeTask(description);

    // Mark complete
    completeTask(agentId, taskId, result);
    console.log(`Agent ${agentId} completed task ${taskId}`);

  } catch (error) {
    // Mark failed
    failTask(agentId, taskId, error.message);
    console.error(`Agent ${agentId} failed on ${taskId}:`, error);
  }

  // Send heartbeat every 60 seconds (while working on long tasks)
  heartbeat(agentId);
}

// Cleanup
disconnectFromSwarm();
```

### Core API Functions

#### `startSwarm(config: SwarmConfig): Promise<boolean>`
Initialize the swarm with task pool and start cleanup timer.

```typescript
const success = await startSwarm({
  agentCount: 5,
  tasks: ['task 1', 'task 2', 'task 3'],
  leaseTimeout: 5 * 60 * 1000,
  heartbeatInterval: 60 * 1000
});
```

#### `stopSwarm(deleteDatabase?: boolean): boolean`
Stop the swarm and optionally delete the database.

```typescript
stopSwarm(true);  // Delete database on cleanup
```

#### `claimTask(agentId: string): ClaimResult`
Claim the next pending task. Returns `{ success, taskId, description, reason }`.

```typescript
const claim = claimTask('agent-1');
if (claim.success) {
  console.log(`Claimed: ${claim.description}`);
}
```

#### `completeTask(agentId: string, taskId: string, result?: string): boolean`
Mark a task as done. Only succeeds if agent still owns the task.

```typescript
completeTask('agent-1', 'task-1', 'Fixed the bug');
```

#### `failTask(agentId: string, taskId: string, error: string): boolean`
Mark a task as failed with error details.

```typescript
failTask('agent-1', 'task-1', 'Could not compile: missing dependency');
```

#### `heartbeat(agentId: string): boolean`
Send a heartbeat to indicate agent is alive. Call every 60 seconds during long-running tasks.

```typescript
heartbeat('agent-1');
```

#### `cleanupStaleClaims(leaseTimeout?: number): number`
Manually trigger cleanup of expired claims. Called automatically every 60 seconds.

```typescript
const released = cleanupStaleClaims(5 * 60 * 1000);
console.log(`Released ${released} stale tasks`);
```

#### `hasPendingWork(): boolean`
Check if there are unclaimed tasks available.

```typescript
if (!hasPendingWork()) {
  console.log('All tasks claimed or completed');
}
```

#### `isSwarmComplete(): boolean`
Check if all tasks are done or failed.

```typescript
if (isSwarmComplete()) {
  console.log('Swarm finished!');
}
```

#### `getSwarmStats(): SwarmStats | null`
Get task counts and timing info.

```typescript
const stats = getSwarmStats();
console.log(`${stats.doneTasks}/${stats.totalTasks} done`);
```

#### `getActiveAgents(): number`
Get count of agents with recent heartbeats.

```typescript
const active = getActiveAgents();
console.log(`${active} agents currently active`);
```

#### `getAllTasks(): SwarmTask[]`
Get all tasks with current status.

```typescript
const tasks = getAllTasks();
const pending = tasks.filter(t => t.status === 'pending');
```

#### `getTasksWithStatus(status: string): SwarmTask[]`
Filter tasks by status: 'pending', 'claimed', 'done', 'failed'.

```typescript
const failed = getTasksWithStatus('failed');
```

#### `getAgentTasks(agentId: string): SwarmTask[]`
Get all tasks claimed by a specific agent.

```typescript
const myTasks = getAgentTasks('agent-1');
```

#### `retryTask(agentId: string, taskId: string): ClaimResult`
Attempt to reclaim a failed task.

```typescript
const retry = retryTask('agent-1', 'task-1');
if (retry.success) {
  console.log('Task reclaimed, trying again...');
}
```

### Configuration (SwarmConfig)

```typescript
interface SwarmConfig {
  agentCount: number;           // Number of agents (1-5)
  tasks: string[];              // Task descriptions
  agentType?: string;           // Agent type (default: 'executor')
  leaseTimeout?: number;        // Milliseconds (default: 5 min)
  heartbeatInterval?: number;   // Milliseconds (default: 60 sec)
  cwd?: string;                 // Working directory
}
```

### Types

```typescript
interface SwarmTask {
  id: string;
  description: string;
  status: 'pending' | 'claimed' | 'done' | 'failed';
  claimedBy: string | null;
  claimedAt: number | null;
  completedAt: number | null;
  error?: string;
  result?: string;
}

interface ClaimResult {
  success: boolean;
  taskId: string | null;
  description?: string;
  reason?: string;
}

interface SwarmStats {
  totalTasks: number;
  pendingTasks: number;
  claimedTasks: number;
  doneTasks: number;
  failedTasks: number;
  activeAgents: number;
  elapsedTime: number;
}
```
