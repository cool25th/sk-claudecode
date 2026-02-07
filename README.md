# SK-ClaudeCode

> Unified agent and skill system for Claude Code

**45 agents** · **100 skills** · **141 scientific domains** · **84 commands** — all in one package.

## 🚀 Installation

```bash
# Marketplace (Recommended)
/plugin install sk-claudecode
/sk-claudecode:skc-setup

# Direct
claude /install-plugin https://github.com/cool25th/sk-claudecode

# Local
git clone https://github.com/cool25th/sk-claudecode && cd sk-claudecode
npm install && npm run build && npm run setup
```

| Install Mode | Command | Size |
|-------------|---------|------|
| **Standard** | `/sk-claudecode:skc-setup` | ~2MB |
| **Minimal** | `/sk-claudecode:skc-setup --minimal` | ~1MB |
| **Full** | `/sk-claudecode:skc-setup --full` | ~17MB |

---

## 💡 Core Concept: Think → Build → Check

Every workflow follows the same cycle. Pick agents from each phase, or let an **orchestration mode** do it for you.

```
🧠 Think          ⚡ Build          🔍 Check          📚 Help
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ architect │     │ executor │     │ reviewer │     │ explore  │
│ planner   │────▶│ designer │────▶│ qa-tester│     │ writer   │
│ critic    │     │ scientist│     │ security │     │researcher│
└──────────┘     └──────────┘     └──────────┘     └──────────┘
      ▲                                 │
      └─────────────────────────────────┘
                 Iterate until ✅
```

---

## 🤖 Agents (45)

### 🧠 Think — Plan before you build

| Agent | Model | When to use |
|-------|-------|-------------|
| `architect` | Opus | System architecture, debugging strategy |
| `architect-medium` | Sonnet | Medium-complexity design questions |
| `architect-low` | Haiku | Quick code questions |
| `planner` | Opus | Feature planning, requirements analysis |
| `critic` | Opus | Review and challenge a work plan |
| `designer-high` | Opus | UI/UX design planning, style & tone review |
| `scientist-high` | Opus | Research planning, experiment design |
| `ontology-expert` | Opus | Ontology architecture & domain analysis |
| `finance-expert` | Opus | Finance domain audit (KR/US markets) |

### ⚡ Build — Write and implement code

| Agent | Model | When to use |
|-------|-------|-------------|
| `executor` | Sonnet | General implementation tasks |
| `executor-low` | Haiku | Simple single-file changes |
| `ultra-executor` | Opus | Complex multi-file autonomous tasks |
| `designer` | Sonnet | UI/UX development |
| `designer-low` | Haiku | Minor styling tweaks |
| `build-fixer` | Sonnet | Fix build errors (TS, Go, etc.) |
| `build-fixer-low` | Haiku | Trivial type errors |
| `git-master` | Sonnet | Commits, rebasing, history management |
| `scientist` | Sonnet | Data analysis, research |
| `scientist-low` | Haiku | Quick data inspection |
| `mobile-developer` | Sonnet | iOS / Android apps |
| `mobile-developer-high` | Opus | Complex mobile architecture |
| `mobile-developer-low` | Haiku | Quick mobile fixes |
| `finance-developer` | Opus | Trading systems development |
| `ontology-developer` | Sonnet | Ontology implementation |

### 🔍 Check — Review and test code

| Agent | Model | When to use |
|-------|-------|-------------|
| `code-reviewer` | Opus | Comprehensive code review |
| `code-reviewer-low` | Haiku | Quick review of small changes |
| `security-reviewer` | Opus | Security vulnerabilities (OWASP Top 10) |
| `security-reviewer-low` | Haiku | Fast security scan |
| `database-reviewer` | Opus | SQL optimization, schema design |
| `go-reviewer` | Opus | Go-specific best practices |
| `python-reviewer` | Opus | Python-specific (PEP 8, type hints) |
| `qa-tester` | Sonnet | Interactive CLI testing (tmux) |
| `qa-tester-high` | Opus | Production-ready QA |
| `tdd-guide` | Opus | Test-Driven Development |
| `tdd-guide-low` | Haiku | Quick test suggestions |
| `e2e-runner` | Opus | End-to-end browser testing |
| `scientist-reviewer` | Opus | Research methodology & statistics validation |
| `designer-reviewer` | Opus | UI/UX accessibility, consistency, responsiveness |
| `ontology-reviewer` | Opus | Ontology schema validation & consistency |

### 📚 Help — Search and document

| Agent | Model | When to use |
|-------|-------|-------------|
| `explore` | Sonnet | Search codebase for files and patterns |
| `researcher` | Sonnet | External docs and reference research |
| `researcher-low` | Haiku | Quick documentation lookups |
| `writer` | Sonnet | README, API docs, comments |
| `vision` | Sonnet | Analyze images, PDFs, diagrams |
| `refactor-cleaner` | Opus | Find and remove dead code |

---

## 🚀 Orchestration Modes

Agents do one thing well. **Modes** chain them into complete Think → Build → Check workflows automatically.

| Command | Covers | How it works |
|---------|--------|-------------|
| | **🔄 Full Cycle** | |
| `/sk-claudecode:ralph` | 🧠→⚡→🔍 **+ retry** | Full cycle, **retries until all checks pass** |
| `/sk-claudecode:autopilot` | 🧠→⚡→🔍 auto | Auto-selects best agents for each phase |
| `/sk-claudecode:pipeline` | 🧠→⚡→🔍 chain | You define the agent chain explicitly |
| `/sk-claudecode:ecomode` | 🧠→⚡→🔍 cheap | Same cycle, Haiku/Sonnet only (60%+ cheaper) |
| | **⚡ Parallel** | |
| `/sk-claudecode:ultrawork` | 🧠⚡🔍 **∥** | All phases in parallel across files |
| `/sk-claudecode:ultrapilot` | ⚡🔍 **∥ partitioned** | Splits files by owner, parallel per partition |
| `/sk-claudecode:swarm` | 🧠⚡🔍 **∥ N agents** | N coordinated agents share the cycle |
| | **🔍 Check-Focused** | |
| `/sk-claudecode:ultraqa` | ⚡→🔍 **loop** | Build → Check → **loops until all pass** |

### How Modes Run the Cycle

```
ralph:       @planner → @executor → @code-reviewer ── fail? → @build-fixer → retry
ultrawork:   ┌─ @planner → @executor → @code-reviewer     (all 3 lanes
             ├─ @planner → @executor → @security-reviewer   run in
             └─ @designer → @designer → @designer-reviewer  parallel)
pipeline:    @architect → @planner → @executor → @code-reviewer → @qa-tester
```

---

## 🗂 Domain Matrix

Which agents to use for each domain, organized by Think → Build → Check → Help:

| Domain | 🧠 Think | ⚡ Build | 🔍 Check | 📚 Help |
|--------|---------|---------|---------|--------|
| **Code** | `architect` `planner` | `executor` `ultra-executor` | `code-reviewer` `security-reviewer` | `explore` `researcher` |
| **Product** | `planner` + `/plan:write-spec` | `executor` | `critic` | `writer` + `stakeholder-comms` |
| **Data** | `scientist-high` | `scientist` + `/scientist:write-query` | `scientist-reviewer` | `researcher` |
| **Design** | `designer-high` | `designer` | `designer-reviewer` | `vision` |
| **Mobile** | `mobile-developer-high` | `mobile-developer` | `code-reviewer` | `researcher` |
| **Finance** | `finance-expert` | `finance-developer` | `code-reviewer` | `researcher` |
| **Ontology** | `ontology-expert` | `ontology-developer` | `ontology-reviewer` | `explore` |

---

## 📋 Commands

### Product Management

| Command | Category | What it does |
|---------|----------|--------------|
| `/plan:write-spec` | 🧠 Think | Structured PRD with user stories & acceptance criteria |
| `/plan:roadmap` | 🧠 Think | Roadmap planning with RICE/ICE/MoSCoW prioritization |
| `/scientist:write-query` | ⚡ Build | Optimized SQL query generation |
| `/scientist:visualize` | ⚡ Build | Data visualization with chart type selection |

### Key Skills

| Skill | Command | Purpose |
|-------|---------|---------| 
| Planning | `/sk-claudecode:plan` | High-density project planning |
| TDD | `/sk-claudecode:tdd` | Test-first workflow |
| Verification | `/sk-claudecode:ultraqa` | Build/test/lint verification loop |
| Memory | `/sk-claudecode:learner` | Persistent cross-session learning |
| Backend | `/sk-claudecode:code-review` | Backend code review patterns |
| Frontend | `/sk-claudecode:build-fix` | Build error resolution |
| Scientific | `/sk-claudecode:scientist` | 141 scientific domains |
| Finance | `/sk-claudecode:finance-expert` | KR/US market audit |
| Mobile | `/sk-claudecode:mobile` | iOS / Android / Flutter |
| Ontology | `/sk-claudecode:ontology-expert` | Palantir-style ontology |

---

## 🪄 Magic Keywords

Type these anywhere in your prompt — no slash command needed:

| Keyword | Effect |
|---------|--------|
| `ultrawork` | Activates parallel agent execution |
| `ultrapilot` | File ownership parallelization |
| `search` | Deep codebase search mode |
| `analyze` | Comprehensive code analysis |
| `research` | Extended research workflow |

---

## 💻 Usage Examples

```bash
# 🔄 Full Cycle — "just make it work"
/sk-claudecode:ralph implement user profile page with avatar upload

# ⚡ Parallel — maximum speed across files
/sk-claudecode:ultrawork refactor authentication to use OAuth2

# 🔗 Pipeline — explicit agent chain
/sk-claudecode:pipeline architect → planner → executor → code-reviewer

# 💰 Eco — save tokens (60%+ cheaper)
/sk-claudecode:ecomode fix all lint errors in src/

# 📋 Product — PRD + roadmap
/sk-claudecode:ralph @planner "/plan:write-spec — Design the payment flow"
/sk-claudecode:ralph @planner "/plan:roadmap — Q2 feature prioritization"

# 🔬 Data — query + visualize
/sk-claudecode:ralph @scientist "/scientist:write-query — Monthly churn by cohort"
/sk-claudecode:ralph @scientist "/scientist:visualize — Revenue trends by region"

# 🧬 Domain workflows
@planner "Design authentication with JWT and OAuth2"
@executor "Implement the auth middleware from the plan"
@code-reviewer "Review all changes in src/auth/"
```

> 💡 **Tip:** Use `/sk-claudecode:ralph` to automate the entire Think → Build → Check cycle — it keeps iterating until everything passes.

---

## ✨ Highlights

- **Real-time HUD** — Status line shows active agents and progress
- **Smart Model Routing** — Saves 30-50% on tokens automatically
- **Automatic Parallelization** — Complex tasks distributed across agents
- **Persistent Execution** — Won't give up until the job is verified complete
- **Learn from Experience** — Extracts and reuses problem-solving patterns

## 📚 More Documentation

- [Ultra Suite Guide](docs/ULTRA-SUITE.md) — Advanced workflow skills
- [Ontology Guide](docs/Agents-ontology-explain.md) — Ontology development step-by-step
- [AGENTS.md](AGENTS.md) — Complete agent reference

## 🙏 Inspired By

| Project | Contribution |
|---------|-------------|
| [oh-my-claudecode](https://github.com/code-yeongyu/oh-my-claudecode) | HUD, Model Routing, Swarm |
| [superpowers](https://github.com/obra/superpowers) | Workflow skills, execution modes |
| [claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) | 141 scientific domains |
| [claude-mem](https://github.com/thedotmack/claude-mem) | Persistent memory system |
| [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) | Sisyphus prompt patterns |

## 📜 License

MIT License — Components retain their original licenses.

---

**Made with ❤️ by merging the best of Claude Code ecosystems**
