## Implementation Notes

The orchestrator (main skill handler) is responsible for:
1. Initial task decomposition (via explore/architect)
2. Creating and initializing SQLite database via `startSwarm()`
3. Spawning N background agents
4. Monitoring progress via `getSwarmStats()` and `getActiveAgents()`
5. Running `cleanupStaleClaims()` automatically (via setInterval)
6. Detecting completion via `isSwarmComplete()`
7. Reporting final summary from database query

Each agent is a standard Task invocation with:
- `run_in_background: true`
- Agent-specific prompt with work loop instructions
- API import: `import { claimTask, completeTask, ... } from './swarm'`
- Connection: `await connectToSwarm(cwd)` to join existing swarm
- Loop: repeatedly call `claimTask()` → do work → `completeTask()` or `failTask()`
