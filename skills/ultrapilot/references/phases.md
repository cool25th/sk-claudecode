## Phases

### Phase 0: Task Analysis

**Goal:** Determine if task is parallelizable

**Checks:**
- Can task be split into 2+ independent subtasks?
- Are file boundaries clear?
- Are dependencies minimal?

**Output:** Go/No-Go decision (falls back to autopilot if unsuitable)

### Phase 1: Decomposition

**Goal:** Break task into parallel-safe subtasks

**Agent:** Architect (Opus)

**Method:** AI-Powered Task Decomposition

Ultrapilot uses the `decomposer` module to generate intelligent task breakdowns:

```typescript
import {
  generateDecompositionPrompt,
  parseDecompositionResult,
  validateFileOwnership,
  extractSharedFiles
} from 'src/hooks/ultrapilot/decomposer';

// 1. Generate prompt for Architect
const prompt = generateDecompositionPrompt(task, codebaseContext, {
  maxSubtasks: 5,
  preferredModel: 'sonnet'
});

// 2. Call Architect agent
const response = await Task({
  subagent_type: 'sk-claudecode:architect',
  model: 'opus',
  prompt
});

// 3. Parse structured result
const result = parseDecompositionResult(response);

// 4. Validate no file conflicts
const { isValid, conflicts } = validateFileOwnership(result.subtasks);

// 5. Extract shared files from subtasks
const finalResult = extractSharedFiles(result);
```

**Process:**
1. Analyze task requirements via Architect agent
2. Identify independent components with file boundaries
3. Assign agent type (executor-low/executor/executor-high) per complexity
4. Map dependencies between subtasks (blockedBy)
5. Generate parallel execution groups
6. Identify shared files (handled by coordinator)

**Output:** Structured `DecompositionResult`:

```json
{
  "subtasks": [
    {
      "id": "1",
      "description": "Backend API routes",
      "files": ["src/api/routes.ts", "src/api/handlers.ts"],
      "blockedBy": [],
      "agentType": "executor",
      "model": "sonnet"
    },
    {
      "id": "2",
      "description": "Frontend components",
      "files": ["src/ui/App.tsx", "src/ui/TodoList.tsx"],
      "blockedBy": [],
      "agentType": "executor",
      "model": "sonnet"
    },
    {
      "id": "3",
      "description": "Wire frontend to backend",
      "files": ["src/client/api.ts"],
      "blockedBy": ["1", "2"],
      "agentType": "executor-low",
      "model": "haiku"
    }
  ],
  "sharedFiles": [
    "package.json",
    "tsconfig.json",
    "README.md"
  ],
  "parallelGroups": [["1", "2"], ["3"]]
}
```

**Decomposition Types:**

| Type | Description | Use Case |
|------|-------------|----------|
| `DecomposedTask` | Full task with id, files, blockedBy, agentType, model | Intelligent worker spawning |
| `DecompositionResult` | Complete result with subtasks, sharedFiles, parallelGroups | Full decomposition output |
| `toSimpleSubtasks()` | Convert to string[] for legacy compatibility | Simple task lists |

### Phase 2: File Ownership Partitioning

**Goal:** Assign exclusive file sets to workers

**Rules:**
1. **Exclusive ownership** - No file in multiple worker sets
2. **Shared files deferred** - Handled sequentially in integration
3. **Boundary files tracked** - Files that import across boundaries

**Data Structure:** `.skc/state/ultrapilot-ownership.json`

```json
{
  "sessionId": "ultrapilot-20260123-1234",
  "workers": {
    "worker-1": {
      "ownedFiles": ["src/api/routes.ts", "src/api/handlers.ts"],
      "ownedGlobs": ["src/api/**"],
      "boundaryImports": ["src/types.ts"]
    },
    "worker-2": {
      "ownedFiles": ["src/ui/App.tsx", "src/ui/TodoList.tsx"],
      "ownedGlobs": ["src/ui/**"],
      "boundaryImports": ["src/types.ts"]
    }
  },
  "sharedFiles": ["package.json", "tsconfig.json", "src/types.ts"],
  "conflictPolicy": "coordinator-handles"
}
```

### Phase 3: Parallel Execution

**Goal:** Run all workers simultaneously

**Spawn Workers:**
```javascript
// Pseudocode
workers = [];
for (subtask in decomposition.subtasks) {
  workers.push(
    Task(
      subagent_type: "sk-claudecode:executor",
      model: "sonnet",
      prompt: `ULTRAPILOT WORKER ${subtask.id}

Your exclusive file ownership: ${subtask.files}

Task: ${subtask.description}

CRITICAL RULES:
1. ONLY modify files in your ownership set
2. If you need to modify a shared file, document the change in your output
3. Do NOT create new files outside your ownership
4. Track all imports from boundary files

Deliver: Code changes + list of boundary dependencies`,
      run_in_background: true
    )
  );
}
```

**Monitoring:**
- Poll TaskOutput for each worker
- Track completion status
- Detect conflicts early
- Accumulate boundary dependencies

**Max Workers:** 5 (Claude Code limit)

### Phase 4: Integration

**Goal:** Merge all worker changes and handle shared files

**Process:**
1. **Collect outputs** - Gather all worker deliverables
2. **Detect conflicts** - Check for unexpected overlaps
3. **Handle shared files** - Sequential updates to package.json, etc.
4. **Integrate boundary files** - Merge type definitions, shared utilities
5. **Resolve imports** - Ensure cross-boundary imports are valid

**Agent:** Executor (Sonnet) - sequential processing

**Conflict Resolution:**
- If workers unexpectedly touched same file → manual merge
- If shared file needs multiple changes → sequential apply
- If boundary file changed → validate all dependent workers

### Phase 5: Validation

**Goal:** Verify integrated system works

**Checks (parallel):**
1. **Build** - Run the project's build command
2. **Lint** - Run the project's lint command
3. **Type check** - Run the project's type check command
4. **Unit tests** - All tests pass
5. **Integration tests** - Cross-component tests

**Agents (parallel):**
- Build-fixer (Sonnet) - Fix build errors
- Architect (Opus) - Functional completeness
- Security-reviewer (Opus) - Cross-component vulnerabilities

**Retry Policy:** Up to 3 validation rounds. If failures persist, detailed error report to user.
