## Research Decomposition

**Goal:** <original research goal>

### Stage 1: <stage-name>
- **Focus:** What this stage investigates
- **Hypothesis:** Expected finding (if applicable)
- **Scope:** Files/areas to examine
- **Tier:** LOW | MEDIUM | HIGH

### Stage 2: <stage-name>
...
```

### Parallel Scientist Invocation

Fire independent stages in parallel via Task tool:

```
// Stage 1 - Simple data gathering
Task(subagent_type="sk-claudecode:scientist", model="haiku", prompt="[RESEARCH_STAGE:1] Investigate...")

// Stage 2 - Standard analysis
Task(subagent_type="sk-claudecode:scientist", model="sonnet", prompt="[RESEARCH_STAGE:2] Analyze...")

// Stage 3 - Complex reasoning
Task(subagent_type="sk-claudecode:scientist", model="opus", prompt="[RESEARCH_STAGE:3] Deep analysis of...")
```

### Smart Model Routing

**CRITICAL: Always pass `model` parameter explicitly!**

| Task Complexity | Agent | Model | Use For |
|-----------------|-------|-------|---------|
| Data gathering | `scientist` | haiku | File enumeration, pattern counting, simple lookups |
| Standard analysis | `scientist` | sonnet | Code analysis, pattern detection, documentation review |
| Complex reasoning | `scientist` | opus | Architecture analysis, cross-cutting concerns, hypothesis validation |

### Routing Decision Guide

| Research Task | Tier | Example Prompt |
|---------------|------|----------------|
| "Count occurrences of X" | LOW | "Count all usages of useState hook" |
| "Find all files matching Y" | LOW | "List all test files in the project" |
| "Analyze pattern Z" | MEDIUM | "Analyze error handling patterns in API routes" |
| "Document how W works" | MEDIUM | "Document the authentication flow" |
| "Explain why X happens" | HIGH | "Explain why race conditions occur in the cache layer" |
| "Compare approaches A vs B" | HIGH | "Compare Redux vs Context for state management here" |

### Verification Loop

After parallel execution completes, verify findings:

```
// Cross-validation stage
Task(subagent_type="sk-claudecode:scientist", model="sonnet", prompt="
[RESEARCH_VERIFICATION]
Cross-validate these findings for consistency:

Stage 1 findings: <summary>
Stage 2 findings: <summary>
Stage 3 findings: <summary>

Check for:
1. Contradictions between stages
2. Missing connections
3. Gaps in coverage
4. Evidence quality

Output: [VERIFIED] or [CONFLICTS:<list>]
")
```
