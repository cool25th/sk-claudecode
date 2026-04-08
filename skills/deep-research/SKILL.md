---
name: deep-research
description: Orchestrate parallel research agents for comprehensive analysis with stage decomposition and cross-validation
---

# Deep Research

Multi-stage research orchestration skill that decomposes complex analysis goals into parallel investigations, cross-validates findings, and synthesizes comprehensive reports.

## When to Use

- Complex analysis requiring investigation across multiple code areas or domains
- When the user says "research", "deep research", "investigate thoroughly", or "comprehensive analysis"
- Security audits, architecture reviews, or codebase-wide pattern analysis
- Comparative analysis (approach A vs B)
- When a single-pass investigation would miss cross-cutting concerns

## When NOT to Use

- Simple lookup questions (just answer directly)
- Single-file debugging (use `trace` skill)
- Implementation tasks (use `plan` → `executor`)
- When the scope is already narrow and well-defined

## Workflow

### Phase 1: Decomposition

Break the research goal into 3-7 independent stages:

```markdown
## Research Decomposition

**Goal:** <original research goal>

### Stage 1: <stage-name>
- **Focus:** What this stage investigates
- **Hypothesis:** Expected finding (if applicable)
- **Scope:** Files/areas to examine
- **Tier:** LOW | MEDIUM | HIGH

### Stage 2: <stage-name>
- **Focus:** ...
- **Hypothesis:** ...
- **Scope:** ...
- **Tier:** ...
```

### Smart Model Routing

Route each stage to the appropriate complexity tier:

| Task Complexity | Tier | Use For |
|-----------------|------|---------|
| Data gathering, file enumeration, simple lookups | **LOW** | "Count all usages of X", "List files matching Y" |
| Code analysis, pattern detection, documentation | **MEDIUM** | "Analyze error handling patterns", "Document the auth flow" |
| Architecture analysis, cross-cutting concerns, hypothesis validation | **HIGH** | "Explain why race conditions occur", "Compare approaches A vs B" |

### Phase 2: Parallel Execution

Fire independent stages simultaneously:

```
// All fire at once — never serialize independent work
Stage 1 (LOW): [data gathering task]
Stage 2 (MEDIUM): [analysis task]
Stage 3 (HIGH): [complex reasoning task]
```

**Concurrency limit**: Maximum 7 parallel stages. If more than 7, batch them:
```
Batch 1: Stages 1-5 (parallel)
[wait for completion]
Batch 2: Stages 6-7 (parallel)
```

### Phase 3: Cross-Validation

After all stages complete, verify findings:

```
## Cross-Validation

Check for:
1. Contradictions between stages
2. Missing connections
3. Gaps in coverage
4. Evidence quality

Result: [VERIFIED] or [CONFLICTS: <list>]
```

### Phase 4: Synthesis

Aggregate all findings into a comprehensive report.

## Finding Tags

Use structured tags for all findings:

```
[FINDING:<id>] <title>
<evidence and analysis>
[/FINDING]

[EVIDENCE:<finding-id>]
- File: <path>
- Lines: <range>
- Content: <relevant code/text>
[/EVIDENCE]

[CONFIDENCE:<level>] # HIGH | MEDIUM | LOW
<reasoning for confidence level>
```

### Quality Validation

Every finding must meet:

| Check | Requirement |
|-------|-------------|
| Evidence present | At least 1 `[EVIDENCE]` per `[FINDING]` |
| Confidence stated | Each finding has `[CONFIDENCE]` |
| Source cited | File paths are absolute and valid |
| Reproducible | Another agent could verify the finding |

## Report Template

```markdown
# Research Report: <Goal>

**Date:** <date>
**Status:** complete | partial

## Executive Summary
<2-3 paragraph summary of key findings>

## Methodology

### Research Stages
| Stage | Focus | Tier | Status |
|-------|-------|------|--------|
| 1 | ... | LOW | ✅ |
| 2 | ... | MEDIUM | ✅ |

### Approach
<Description of decomposition rationale>

## Key Findings

### Finding 1: <Title>
**Confidence:** HIGH | MEDIUM | LOW

<Detailed finding with evidence>

#### Evidence
<Embedded evidence blocks>

### Finding 2: <Title>
...

## Cross-Validation Results
<Verification summary, conflicts resolved>

## Limitations
- <Limitation 1>
- <Areas not covered and why>

## Recommendations
1. <Actionable recommendation>
2. <Actionable recommendation>
```

## Session Management

Track research in a local state file:

```json
{
  "id": "research-20260409-abc",
  "goal": "Original research goal",
  "status": "in_progress | complete | blocked",
  "stages": [
    {
      "id": 1,
      "name": "Stage name",
      "tier": "LOW | MEDIUM | HIGH",
      "status": "pending | running | complete | failed",
      "findings_summary": "..."
    }
  ],
  "verification": {
    "status": "pending | passed | failed",
    "conflicts": []
  }
}
```

## Red Flags

- Running all stages at HIGH tier (wastes resources on simple lookups)
- Skipping cross-validation
- Stages that aren't truly independent (dependency means they can't parallelize)
- Findings without evidence tags
- Generating a report without verification
- More than 7 stages (over-decomposition — merge related stages)

## Verification

After research completes:
- [ ] All stages executed and findings collected
- [ ] Cross-validation passed (or conflicts documented)
- [ ] Every finding has evidence and confidence rating
- [ ] Report generated with all sections
- [ ] Recommendations are actionable

## Related

- `skills/trace` — For causal investigation (not broad research)
- `/agent researcher` — For executing individual research stages
- `/agent scientist` — For hypothesis-driven investigation stages
- `/agent explorer` — For codebase navigation during research
