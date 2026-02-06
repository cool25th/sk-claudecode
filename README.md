# SK-ClaudeCode

> Unified agent and skill system for Claude Code

A comprehensive multi-agent orchestration system merging capabilities from 5 projects: oh-my-claudecode, oh-my-opencode, superpowers, claude-scientific-skills, and claude-mem.

## 🚀 Installation

### Method 1: Claude Marketplace (Recommended)
```bash
# Add marketplace source
/plugin marketplace add https://github.com/cool25th/sk-claudecode

# Install plugin
/plugin install sk-claudecode
```

### Method 2: Direct Plugin Install
```bash
claude /install-plugin https://github.com/cool25th/sk-claudecode
```

### Method 3: Local Install
```bash
git clone https://github.com/cool25th/sk-claudecode
cd sk-claudecode
npm install && npm run build
npm run setup
```

### Install Modes

| Mode | Command | Description |
|------|---------|-------------|
| **Standard** | `npm run setup` | Default - Core skills, lazy-loads scientific |
| **Minimal** | `npm run setup -- --minimal` | Core skills only (~1MB) |
| **Full** | `npm run setup -- --full` | All skills including scientific (~17MB) |

## ✨ Features

| Component | Count |
|-----------|-------|
| **Agents** | 50 (with tiered variants) |
| **Skills** | 89 categories |
| **Scientific** | 141 domains |
| **Memory Modes** | 31 |
| **Hooks** | 10+ |

### 🔥 Core Capabilities

- **Real-time HUD** - Status line shows what's happening under the hood
- **Smart Model Routing** - Saves 30-50% on tokens with intelligent routing
- **Automatic Parallelization** - Complex tasks distributed across specialized agents
- **Persistent Execution** - Won't give up until the job is verified complete
- **Learn from Experience** - Automatically extracts and reuses problem-solving patterns

## 🪄 Magic Keywords

Type these anywhere in your prompt to trigger special behaviors:

| Keyword | Effect |
|---------|--------|
| `ultrawork` | Maximum parallel agent execution |
| `ultrapilot` | File ownership-based parallelization |
| `search` | Deep codebase search mode |
| `analyze` | Comprehensive code analysis |
| `research` | Extended research workflow |

**Example:**
```
ultrawork implement authentication with JWT and OAuth2
```

## 📖 Quick Start

```bash
# Start Claude Code in your project
claude

# Invoke an agent
@planner "Design a new API endpoint"

# Use a skill
/sk-claudecode:ultra-plan

# Use a specialized agent
@financial-expert "Analyze risk for momentum strategy"
@database-reviewer "Optimize slow SQL queries in src/db"
@backend-developer "Create REST API for user management"
```

## 🤖 Featured Agents

| Agent | Role |
|-------|------|
| `planner` | Task planning and breakdown |
| `executor` / `ultra-executor` | Task execution |
| `designer` | Frontend UI/UX |
| `backend-developer` | API, DB, server logic |
| `database-reviewer` | SQL & Schema optimization |
| `e2e-runner` | End-to-end testing |
| `financial-expert` | Quant strategies, risk management |
| `financial-execution` | Trade order execution |
| `go-reviewer` / `python-reviewer` | Language-specific review |
| `code-reviewer` | General code quality review |

## 🛠 Key Skills

| Skill | Purpose |
|-------|---------|
| `plan` / `ultra-plan` | Project planning |
| `quality/tdd` / `quality/ultratdd` | Test-driven development |
| `quant` | Quantitative trading |
| `trading` | Trade execution |
| `market-kr` / `market-us` | Market regulations |
| `backend` | Backend development |
| `frontend-ui-ux` | Frontend design |

## 📚 Documentation

- [**Ultra Suite Guide**](docs/ULTRA-SUITE.md) - Advanced workflow skills (12 skills, 2 agents)
- [**Ultra vs Ralph**](docs/ULTRA-VS-RALPH.md) - Workflow family comparison
- **Ontology Suite** - 8 skills for data modeling: ontology, ontology-traditional, ontology-palantir, ontology-storage
- [AGENTS.md](AGENTS.md) - Complete agent and skill reference

## 📁 Structure

```
sk-claudecode/
├── agents/           # 39 agent definitions
├── skills/           # 26+ skill categories
│   ├── quality/      # TDD, code review, security
│   ├── quant/        # Quant strategies
│   ├── trading/      # Trade execution
│   ├── scientific/   # 141 scientific domains
│   └── ...
├── hooks/            # Event-driven behaviors
├── .claude-plugin/   # Plugin configuration
├── package.json      # NPM package
└── scripts/          # Setup scripts
```

## 🙏 Inspired By

This project combines the best ideas from these amazing projects:

| Project | Contribution | Author |
|---------|--------------|--------|
| [oh-my-claudecode](https://github.com/code-yeongyu/oh-my-claudecode) | HUD, Model Routing, Swarm hooks | [@code-yeongyu](https://github.com/code-yeongyu) |
| [superpowers](https://github.com/obra/superpowers) | Workflow skills, execution modes | [@obra](https://github.com/obra) |
| [claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) | 141 scientific domains | [@K-Dense-AI](https://github.com/K-Dense-AI) |
| [claude-mem](https://github.com/thedotmack/claude-mem) | Persistent memory system | [@thedotmack](https://github.com/thedotmack) |
| [everything-claude-code](https://github.com) | Language patterns, reviewers | Community |
| [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) | Sisyphus prompt patterns | [@code-yeongyu](https://github.com/code-yeongyu) |

## 📜 License

MIT License - Components retain their original licenses.

---

**Made with ❤️ by merging the best of Claude Code ecosystems**
