## Workflow

### 1. Parse Input
- Extract N (agent count)
- Extract agent-type
- Extract task description
- Validate N <= 5

### 2. Create Task Pool
- Analyze codebase based on task
- Break into file-specific subtasks
- Initialize SQLite database with task pool
- Each task gets: id, description, status (pending), and metadata columns

### 3. Spawn Agents
- Launch N agents via Task tool
- Set `run_in_background: true` for all
- Each agent connects to the SQLite database
- Agents enter claiming loop automatically

### 3.1. Agent Preamble (IMPORTANT)

When spawning swarm agents, ALWAYS wrap the task with the worker preamble to prevent recursive sub-agent spawning:

```typescript
import { wrapWithPreamble } from '../agents/preamble.js';

// When spawning each agent:
const agentPrompt = wrapWithPreamble(`
Connect to swarm at ${cwd}/.skc/state/swarm.db
Claim tasks with claimTask('agent-${n}')
Complete work with completeTask() or failTask()
Send heartbeat every 60 seconds
Exit when hasPendingWork() returns false
`);

Task({
  subagent_type: 'sk-claudecode:executor',
  prompt: agentPrompt,
  run_in_background: true
});
```

The worker preamble ensures agents:
- Execute tasks directly using tools (Read, Write, Edit, Bash)
- Do NOT spawn sub-agents (prevents recursive agent storms)
- Report results with absolute file paths

### 4. Task Claiming Protocol (SQLite Transactional)
Each agent follows this loop:

```
LOOP:
  1. Call claimTask(agentId)
  2. SQLite transaction:
     - Find first pending task
     - UPDATE status='claimed', claimed_by=agentId, claimed_at=now
     - INSERT/UPDATE heartbeat record
     - Atomically commit (only one agent succeeds)
  3. Execute task
  4. Call completeTask(agentId, taskId, result) or failTask()
  5. GOTO LOOP (until hasPendingWork() returns false)
```

**Atomic Claiming Details:**
- SQLite `IMMEDIATE` transaction prevents race conditions
- Only agent updating the row successfully gets the task
- Heartbeat automatically updated on claim
- If claim fails (already claimed), agent retries with next task
- Lease Timeout: 5 minutes per task
- If timeout exceeded + no heartbeat, cleanupStaleClaims releases task back to pending

### 5. Heartbeat Protocol
- Agents call `heartbeat(agentId)` every 60 seconds (or custom interval)
- Heartbeat records: agent_id, last_heartbeat timestamp, current_task_id
- Orchestrator runs cleanupStaleClaims every 60 seconds
- If heartbeat is stale (>5 minutes old) and task claimed, task auto-releases

### 6. Progress Tracking
- Orchestrator monitors via TaskOutput
- Shows live progress: pending/claimed/done/failed counts
- Active agent count via getActiveAgents()
- Reports which agent is working on which task via getAgentTasks()
- Detects idle agents (all tasks claimed by others)

### 7. Completion
Exit when ANY of:
- isSwarmComplete() returns true (all tasks done or failed)
- All agents idle (no pending tasks, no claimed tasks)
- User cancels via `/sk-claudecode:cancel`
