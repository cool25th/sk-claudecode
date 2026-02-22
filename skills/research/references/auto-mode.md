## AUTO Mode

AUTO mode runs the complete research workflow autonomously with loop control.

### Loop Control Protocol

```
[RESEARCH + AUTO - ITERATION {{ITERATION}}/{{MAX}}]

Your previous attempt did not output the completion promise. Continue working.

Current state: {{STATE}}
Completed stages: {{COMPLETED_STAGES}}
Pending stages: {{PENDING_STAGES}}
```

### Promise Tags

| Tag | Meaning | When to Use |
|-----|---------|-------------|
| `[PROMISE:RESEARCH_COMPLETE]` | Research finished successfully | All stages done, verified, report generated |
| `[PROMISE:RESEARCH_BLOCKED]` | Cannot proceed | Missing data, access issues, circular dependency |

### AUTO Mode Rules

1. **Max Iterations:** 10 (configurable)
2. **Continue until:** Promise tag emitted OR max iterations
3. **State tracking:** Persist after each stage completion
4. **Cancellation:** `/sk-claudecode:cancel` or "stop", "cancel"

### AUTO Mode Example

```
/sk-claudecode:research AUTO: Comprehensive security analysis of the authentication system

[Decomposition]
- Stage 1 (LOW): Enumerate auth-related files
- Stage 2 (MEDIUM): Analyze token handling
- Stage 3 (MEDIUM): Review session management
- Stage 4 (HIGH): Identify vulnerability patterns
- Stage 5 (MEDIUM): Document security controls

[Execution - Parallel]
Firing stages 1-3 in parallel...
Firing stages 4-5 after dependencies complete...

[Verification]
Cross-validating findings...

[Synthesis]
Generating report...

[PROMISE:RESEARCH_COMPLETE]
```
