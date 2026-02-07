# sk-claudecode

**SK-ClaudeCode** - A comprehensive multi-agent orchestration system merging the best from 5 projects.

---

## Overview

SK-ClaudeCode is a unified agent and skill system combining:

| Source | Contribution |
|--------|--------------|
| **sk-claudecode** | 46 agents (with tier variants), execution modes |
| **everything-claude-code**| Language-specific patterns, specialized reviewers, continuous learning |
| **claude-scientific-skills** | 141 scientific skill categories |
| **claude-mem** | Persistent memory system |
| **oh-my-opencode** | Hook system (keyword-detector, etc.) |

---

## Structure

```
sk-claudecode/
├── AGENTS.md               # This file
├── agents/                  # 46 agents (including tiered variants)
├── skills/
│   ├── workflow/           # Workflow skills
│   ├── execution-modes/    # 8 execution modes
│   ├── quality/            # Code quality, TDD, Verification
│   ├── backend/            # Consolidated Backend patterns
│   ├── frontend/           # Consolidated Frontend UI/UX
│   ├── language/           # Go, Python, Java, Django, SpringBoot
│   ├── database/           # Postgres, Clickhouse
│   ├── scientific/         # 141 scientific skill categories
│   ├── memory/             # Persistent memory modes
│   ├── continuous-learning/# Session pattern extraction
│   └── ...
├── hooks/                   # Event-driven hooks
└── docs/                   # Documentation
```

---

## Agents (46 total)

| Category | Agents | Purpose |
|----------|--------|---------|
| **Orchestration** | `planner`, `architect` (base, low, medium) | Strategic planning and system design |
| **Execution** | `executor` (base, low, high), `ultra-executor`, `financial-execution` | Task execution and trade execution |
| **Specialized Dev** | `backend-developer`, `designer` (base, low, high), `vision`, `e2e-runner` | Feature implementation and specialized tasks |
| **Review & Quality**| `code-reviewer` (base, low), `database-reviewer`, `go-reviewer`, `python-reviewer`, `security-reviewer` (base, low), `qa-tester` (base, high) | Multi-layered quality assurance |
| **Research & Docs** | `researcher` (base, low), `scientist` (base, low, high), `writer` | Analysis and documentation maintenance |
| **Tools & Fixes** | `build-fixer` (base, low), `refactor-cleaner`, `git-master`, `go-build-resolver`, `critic` | Maintenance and problem resolution |

---

## Skills (60+ total)

### Core Workflow & Execution

| Skill | Purpose |
|-------|---------|
| `brainstorming` | Interactive design refinement |
| `continuous-learning` | Automatic pattern extraction from sessions |
| `strategic-compact` | Managed context compaction at logical boundaries |
| `verification-loop` | Comprehensive build/test/lint verification |
| `ultra-plan` / `plan` | High-density project planning |
| `ultra-execute` | Reliable batch task execution |
| `memory` | Persistent cross-session context |

### Technical Domains

| Domain | Skills Included |
|--------|-----------------|
| **Backend** | `backend` (consolidated), `springboot-*`, `django-*`, `jpa-patterns` |
| **Frontend** | `frontend` (consolidated), `frontend-patterns`, `ui-ux` |
| **Database** | `postgres-patterns`, `clickhouse-io` |
| **Languages** | `golang-*`, `python-*`, `java-coding-standards` |
| **Quality** | `verify`, `verification-loop`, `tdd-workflow`, `security-review` |
| **Markets** | `market-kr`, `market-us`, `trading`, `quant` |

### Scientific Skills (141 categories)
Categories include: `biopython`, `rdkit`, `pytorch-lightning`, `scanpy`, `pubmed-database`, `literature-review`, `statistical-analysis`, and 134 more.

### Execution Modes (from sk-claudecode)

| Mode | Purpose |
|------|---------|
| `autopilot` | Full autonomous execution |
| `ralph` | Persistence until verified |
| `ultrawork` | Maximum parallel agents |
| `swarm` | N coordinated agents |
| `ecomode` | Token-efficient execution |
| `pipeline` | Sequential chaining |
| `ultrapilot` | Parallel with file ownership |
| `ultraqa` | QA cycling until goal met |

### Scientific Skills (141 categories)

Categories include: `biopython`, `rdkit`, `pytorch-lightning`, `scanpy`, `pubmed-database`, `literature-review`, `statistical-analysis`, and 134 more.

### Memory System (from claude-mem)

- Persistent context across sessions
- Progressive disclosure for token efficiency
- Skill-based search with natural language

---

## Hooks

### From oh-my-opencode

| Hook | Purpose |
|------|---------|
| `directory-agents-injector` | Auto-inject AGENTS.md on file read |
| `keyword-detector` | Trigger skills by keywords |
| `session-recovery` | Recover from session interruptions |

### From claude-mem

| Hook | Purpose |
|------|---------|
| `PostToolUse` | Capture observations |
| `SessionStart` | Load context |
| `SessionEnd` | Persist memory |

---

## Usage

### Invoking Skills

```bash
# Workflow skills
/sk-claudecode:brainstorming
/sk-claudecode:test-driven-development

# Execution modes
/sk-claudecode:autopilot
/sk-claudecode:ralph

# Scientific skills
/sk-claudecode:literature-review
```

### Agent Delegation

Agents are automatically selected based on task context, or explicitly via:
- Tier selection for cost/performance balance
- Direct agent invocation

---

## Sources

| Project | GitHub | License |
|---------|--------|---------|
| sk-claudecode | [code-yeongyu/sk-claudecode](https://github.com/code-yeongyu/sk-claudecode) | MIT |
| oh-my-opencode | [code-yeongyu/oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) | MIT |
| sk-claudecode | [obra/sk-claudecode](https://github.com/obra/sk-claudecode) | MIT |
| claude-scientific-skills | [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) | MIT |
| claude-mem | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | AGPL-3.0 |

---

*Generated: 2026-02-05*
