---
name: research
description: Orchestrate parallel scientist agents for comprehensive research with AUTO mode
---


# Research Skill

Orchestrate parallel scientist agents for comprehensive research workflows with optional AUTO mode for fully autonomous execution.

## Overview

Research is a multi-stage workflow that decomposes complex research goals into parallel investigations:

1. **Decomposition** - Break research goal into independent stages/hypotheses
2. **Execution** - Run parallel scientist agents on each stage
3. **Verification** - Cross-validate findings, check consistency
4. **Synthesis** - Aggregate results into comprehensive report

## Usage Examples

```
/sk-claudecode:research <goal>                    # Standard research with user checkpoints
/sk-claudecode:research AUTO: <goal>              # Fully autonomous until complete
/sk-claudecode:research status                    # Check current research session status
/sk-claudecode:research resume                    # Resume interrupted research session
/sk-claudecode:research list                      # List all research sessions
/sk-claudecode:research report <session-id>       # Generate report for session
```

### Quick Examples

```
/sk-claudecode:research What are the performance characteristics of different sorting algorithms?
/sk-claudecode:research AUTO: Analyze authentication patterns in this codebase
/sk-claudecode:research How does the error handling work across the API layer?
```

## Research Protocol

### Stage Decomposition Pattern

When given a research goal, decompose into 3-7 independent stages:

```markdown

## Report Generation

### Report Template

```markdown
# Research Report: {{GOAL}}

**Session ID:** {{SESSION_ID}}
**Date:** {{DATE}}
**Status:** {{STATUS}}

## Executive Summary

{{2-3 paragraph summary of key findings}}

## Methodology

### Research Stages

| Stage | Focus | Tier | Status |
|-------|-------|------|--------|
{{STAGES_TABLE}}

### Approach

{{Description of decomposition rationale and execution strategy}}

## Key Findings

### Finding 1: {{TITLE}}

**Confidence:** {{HIGH|MEDIUM|LOW}}

{{Detailed finding with evidence}}

#### Evidence

{{Embedded evidence blocks}}

### Finding 2: {{TITLE}}
...

## Visualizations

{{FIGURES}}

## Cross-Validation Results

{{Verification summary, any conflicts resolved}}

## Limitations

- {{Limitation 1}}
- {{Limitation 2}}
- {{Areas not covered and why}}

## Recommendations

1. {{Actionable recommendation}}
2. {{Actionable recommendation}}

## Cancellation

```
/sk-claudecode:cancel
```

Or say: "stop research", "cancel research", "abort"

Progress is preserved in `.skc/research/{session-id}/` for resume.

## Related Agents

- `researcher` - Research specialist (Sonnet)
- `researcher-low` - Quick research (Haiku)
- `scientist` - Scientific research (Sonnet)

## Detailed References

- **Research Decomposition**: See [references/research-decomposition.md](references/research-decomposition.md)
- **AUTO Mode**: See [references/auto-mode.md](references/auto-mode.md)
- **Parallel Execution Patterns**: See [references/parallel-execution-patterns.md](references/parallel-execution-patterns.md)
- **Session Management**: See [references/session-management.md](references/session-management.md)
- **Tag Extraction**: See [references/tag-extraction.md](references/tag-extraction.md)
- **Appendix**: See [references/appendix.md](references/appendix.md)
- **Visualizations**: See [references/visualizations.md](references/visualizations.md)
- **Configuration**: See [references/configuration.md](references/configuration.md)
- **Troubleshooting**: See [references/troubleshooting.md](references/troubleshooting.md)
