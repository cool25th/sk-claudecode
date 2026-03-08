---
description: Guide on using sk-claudecode plugin
---

# How SKC Works

**You don't need to learn any commands!** SKC enhances Claude Code with intelligent behaviors that activate automatically.

## What Happens Automatically

| When You... | I Automatically... |
|-------------|-------------------|
| Give me a complex task | Parallelize and delegate to specialist agents |
| Ask me to plan something | Start a planning interview |
| Need something done completely | Persist until verified complete |
| Work on UI/frontend | Activate design sensibility |
| Say "stop" or "cancel" | Intelligently stop current operation |

## Quick Start: Agent Commands

Use `/sk-claudecode:<agent>` to invoke a specific agent:

### 🧠 Think (Plan & Review)
| Command | Agent | Description |
|---------|-------|-------------|
| `/sk-claudecode:architect` | Opus | Architecture planning & design (read-only) |
| `/sk-claudecode:critic` | Opus | Plan & quality review |
| `/sk-claudecode:plan` | Opus | Work planning workflow |

### ⚡ Build (Implement)
| Command | Agent | Description |
|---------|-------|-------------|
| `/sk-claudecode:executor` | Sonnet | Standard code implementation |
| `/sk-claudecode:ultra-executor` | Opus | Complex autonomous execution |
| `/sk-claudecode:designer` | Sonnet | UI/UX implementation |
| `/sk-claudecode:build-fix` | Sonnet | Build error resolution |
| `/sk-claudecode:git-master` | Sonnet | Git operations expert |

### 🔬 Domain Specialists
| Command | Agent | Domain |
|---------|-------|--------|
| `/sk-claudecode:finance` | Opus | Trading, market analysis, quant |
| `/sk-claudecode:ontology` | Sonnet | Ontology design & implementation |
| `/sk-claudecode:mobile` | Sonnet | iOS/Android development |
| `/sk-claudecode:scientist` | Sonnet | Data analysis & research |

### 🔍 Check (Review & Test)
| Command | Agent | Description |
|---------|-------|-------------|
| `/sk-claudecode:code-review` | Opus | Expert code review |
| `/sk-claudecode:security-reviewer` | Opus | Security vulnerability detection |
| `/sk-claudecode:tdd` | Opus | Test-driven development |
| `/sk-claudecode:qa-tester` | Sonnet | Interactive CLI testing |

### 📚 Help (Search & Document)
| Command | Agent | Description |
|---------|-------|-------------|
| `/sk-claudecode:explore` | Sonnet | Codebase search |
| `/sk-claudecode:research` | Sonnet | Deep research workflow |
| `/sk-claudecode:writer` | Haiku | Documentation writing |

## Execution Modes

| Command | Keyword | Description |
|---------|---------|-------------|
| `/sk-claudecode:ralph` | **ralph** | Persistent loop until task complete |
| `/sk-claudecode:ralplan` | **ralplan** | Iterative planning with consensus |
| `/sk-claudecode:ultrawork` | **ulw** | Max parallelism mode |
| `/sk-claudecode:autopilot` | - | Full autonomous execution |
| `/sk-claudecode:swarm` | - | N coordinated agents on shared tasks |

## Magic Keywords (Natural Language Shortcuts)

Include these words naturally in your request:

| Keyword | Effect |
|---------|--------|
| **ralph** | Persistence mode |
| **ralplan** | Iterative planning |
| **ulw** / **ultrawork** | Max parallelism |
| **plan** | Planning interview |
| **tdd** | Test-driven development |
| **review** | Code review mode |
| **security** / **보안** | Security review |
| **refactor** / **정리** | Safe refactoring |
| **analyze** / **research** | Deep analysis mode |

## Stopping Things

Just say "stop", "cancel", or "abort". Or use:
```
/sk-claudecode:cancel
```

## First Time Setup

```
/sk-claudecode:setup
```

This is the **only command** you need to know to get started.
