## Parallel Execution Patterns

### Independent Dataset Analysis (Parallel)

When stages analyze different data sources:

```
// All fire simultaneously
Task(subagent_type="sk-claudecode:scientist", model="haiku", prompt="[STAGE:1] Analyze src/api/...")
Task(subagent_type="sk-claudecode:scientist", model="haiku", prompt="[STAGE:2] Analyze src/utils/...")
Task(subagent_type="sk-claudecode:scientist", model="haiku", prompt="[STAGE:3] Analyze src/components/...")
```

### Hypothesis Battery (Parallel)

When testing multiple hypotheses:

```
// Test hypotheses simultaneously
Task(subagent_type="sk-claudecode:scientist", model="sonnet", prompt="[HYPOTHESIS:A] Test if caching improves...")
Task(subagent_type="sk-claudecode:scientist", model="sonnet", prompt="[HYPOTHESIS:B] Test if batching reduces...")
Task(subagent_type="sk-claudecode:scientist", model="sonnet", prompt="[HYPOTHESIS:C] Test if lazy loading helps...")
```

### Cross-Validation (Sequential)

When verification depends on all findings:

```
// Wait for all parallel stages
[stages complete]

// Then sequential verification
Task(subagent_type="sk-claudecode:scientist", model="opus", prompt="
[CROSS_VALIDATION]
Validate consistency across all findings:
- Finding 1: ...
- Finding 2: ...
- Finding 3: ...
")
```

### Concurrency Limit

**Maximum 5 concurrent scientist agents** to prevent resource exhaustion.

If more than 5 stages, batch them:
```
Batch 1: Stages 1-5 (parallel)
[wait for completion]
Batch 2: Stages 6-7 (parallel)
```
