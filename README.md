# SK-ClaudeCode

> Unified agent and skill system for Claude Code

42 specialized agents + 89 skills + 141 scientific domains in one package.

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

## 💡 Recommended Workflow

The best results come from following the **Think → Build → Check** cycle:

```
🧠 Think          ⚡ Build          🔍 Check
 ┌──────────┐     ┌──────────┐     ┌──────────┐
 │ architect │────▶│ executor │────▶│ reviewer │
 │ planner   │     │ designer │     │ qa-tester│
 │ critic    │     │ builder  │     │ security │
 └──────────┘     └──────────┘     └──────────┘
       ▲                                 │
       └─────────────────────────────────┘
                  Iterate
```

**Example workflows by domain:**
```bash
# 💻 Code — Think → Build → Check
@planner "Design authentication with JWT and OAuth2"
@executor "Implement the auth middleware from the plan"
@code-reviewer "Review all changes in src/auth/"

# 📋 Product Management — Think → Build → Check
@planner "/plan:write-spec — Design the onboarding feature"
@executor "Implement the spec from PRD.md"
@critic "Review implementation against the PRD"

# 🔬 Data Science — Think → Build → Check
@scientist-high "Plan the churn analysis methodology"
@scientist "/scientist:write-query — Monthly churn by cohort"
@scientist-reviewer "Validate query logic and statistics"

# 🎨 Design — Think → Build → Check
@designer-high "Plan the dashboard layout and design system"
@designer "Build the dashboard with charts and dark mode"
@designer-reviewer "Audit accessibility, consistency, responsiveness"

# 🗂️ Ontology — Think → Build → Check
@ontology-expert "Design the object type hierarchy"
@ontology-developer "Implement the ontology schema"
@ontology-reviewer "Validate schema consistency and completeness"
```

> 💡 **Tip:** Use `/sk-claudecode:ralph` to automate this entire cycle — it keeps iterating until everything passes.

---

## 🤖 Agent Guide — "What do I use?"

All 45 agents fall into 4 categories based on **what you want to do**:

### 🧠 Think — Plan before you build

> Use when you need to analyze, design, or review a plan.

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

```bash
@planner "Design authentication system with JWT and OAuth2"
@architect "Review the database schema for scalability issues"
@designer-high "Review the UI for design consistency and tone"
@critic "Review this implementation plan for gaps"
```

---

### ⚡ Build — Write and implement code

> Use when you need to create, modify, or fix code.

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
| `mobile-developer` | Sonnet | iOS / Android apps |
| `mobile-developer-high` | Opus | Complex mobile architecture |
| `mobile-developer-low` | Haiku | Quick mobile fixes |
| `scientist` | Sonnet | Data analysis, research |
| `scientist-low` | Haiku | Quick data inspection |
| `finance-developer` | Opus | Trading systems development |
| `ontology-developer` | Sonnet | Ontology implementation |

```bash
@executor "Add user authentication middleware"
@ultra-executor "Refactor the entire API layer to use async/await"
@designer "Build a dashboard with charts and dark mode"
@build-fixer "Fix all TypeScript errors in src/"
```

---

### 🔍 Check — Review and test code

> Use when you need to verify quality, security, or correctness.

| Agent | Model | When to use |
|-------|-------|-------------|
| `code-reviewer` | Opus | Comprehensive code review |
| `code-reviewer-low` | Haiku | Quick review of small changes |
| `security-reviewer` | Opus | Security vulnerabilities (OWASP Top 10) |
| `security-reviewer-low` | Haiku | Fast security scan |
| `go-reviewer` | Opus | Go-specific best practices |
| `python-reviewer` | Opus | Python-specific (PEP 8, type hints) |
| `database-reviewer` | Opus | SQL optimization, schema design |
| `qa-tester` | Sonnet | Interactive CLI testing (tmux) |
| `qa-tester-high` | Opus | Production-ready QA |
| `tdd-guide` | Opus | Test-Driven Development |
| `tdd-guide-low` | Haiku | Quick test suggestions |
| `e2e-runner` | Opus | End-to-end browser testing |
| `finance-expert` | Opus | Finance domain audit (KR/US markets) |
| `scientist-reviewer` | Opus | Research methodology & statistics validation |
| `designer-reviewer` | Opus | UI/UX accessibility, consistency, responsiveness |
| `ontology-reviewer` | Opus | Ontology schema validation & consistency |

```bash
@code-reviewer "Review the changes in src/auth/"
@security-reviewer "Audit the API endpoints for vulnerabilities"
@database-reviewer "Optimize slow queries in src/db"
@qa-tester "Test the login flow end-to-end"
```

---

### 📚 Help — Search and document

> Use when you need to find information or write documentation.

| Agent | Model | When to use |
|-------|-------|-------------|
| `explore` | Sonnet | Search codebase for files and patterns |
| `researcher` | Sonnet | External docs and reference research |
| `researcher-low` | Haiku | Quick documentation lookups |
| `writer` | Sonnet | README, API docs, comments |
| `vision` | Sonnet | Analyze images, PDFs, diagrams |
| `refactor-cleaner` | Opus | Find and remove dead code |

```bash
@explore "Find all authentication patterns in the codebase"
@researcher "How does Next.js 15 handle server components?"
@writer "Document the REST API endpoints in src/api/"
@vision "Analyze this wireframe and suggest component structure"
```

---

## 🚀 Orchestration — How modes connect Think → Build → Check

Agents do one thing well. **Orchestration modes** chain them into complete workflows by automating the Think → Build → Check cycle.

```
             ┌──────────────────────────────────────────────────────┐
             │               Orchestration Mode                     │
             │  (ralph / autopilot / ultrawork / pipeline / ...)    │
             └──────┬──────────────┬──────────────┬────────────────┘
                    │              │              │
              🧠 Think        ⚡ Build        🔍 Check       📚 Help
            ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
            │ planner   │   │ executor │   │ reviewer │   │ explore  │
            │ architect │──▶│ designer │──▶│ qa-tester│   │ writer   │
            │ critic    │   │ builder  │   │ security │   │researcher│
            └──────────┘   └──────────┘   └──────────┘   └──────────┘
                  ▲                              │
                  └──────────────────────────────┘
                         Iterate until ✅
```

### Mode Selection Guide

| Command | Covers | How it works |
|---------|--------|-------------|
| | **🔄 Full Cycle (Think → Build → Check)** | |
| `/sk-claudecode:ralph` | 🧠→⚡→🔍 **+ retry** | Runs full cycle, **retries Build→Check until all pass** |
| `/sk-claudecode:autopilot` | 🧠→⚡→🔍 auto | Auto-selects best agents for each phase |
| `/sk-claudecode:pipeline` | 🧠→⚡→🔍 chain | You define the agent chain explicitly |
| `/sk-claudecode:ecomode` | 🧠→⚡→🔍 cheap | Same full cycle, routes to Haiku/Sonnet (60%+ cheaper) |
| | **⚡ Parallel Execution** | |
| `/sk-claudecode:ultrawork` | 🧠⚡🔍 **∥ parallel** | All phases run in parallel across files |
| `/sk-claudecode:ultrapilot` | ⚡🔍 **∥ partitioned** | Splits files by owner, parallel Build+Check per partition |
| `/sk-claudecode:swarm` | 🧠⚡🔍 **∥ N agents** | N coordinated agents share Think→Build→Check |
| | **🔍 Check-Focused** | |
| `/sk-claudecode:ultraqa` | ⚡→🔍 **loop** | Build → Check → **loops Check until all pass** |

### How Each Mode Runs the Cycle

**`/sk-claudecode:ralph`** — 🧠→⚡→🔍 + retry loop
```
@planner "Plan auth system"     🧠 Think
    ↓
@executor "Implement auth"      ⚡ Build
    ↓
@code-reviewer "Review auth"    🔍 Check ── fail? ──→ @build-fixer ──→ 🔍 Check again
    ↓ pass
Done ✅
```

**`/sk-claudecode:ultrawork`** — 🧠⚡🔍 all parallel
```
┌─ @planner "Plan auth"  ──→ @executor "Implement auth"  ──→ @code-reviewer
├─ @planner "Plan API"   ──→ @executor "Implement API"   ──→ @security-reviewer
└─ @designer "Plan UI"   ──→ @designer "Build UI"        ──→ @designer-reviewer
                                     All in parallel
```

**`/sk-claudecode:pipeline`** — 🧠→⚡→🔍 explicit chain
```
@architect ──→ @planner ──→ @executor ──→ @code-reviewer ──→ @qa-tester
 (Analyze)    (Plan)       (Build)      (Review)           (Test)
```

### Domain-Specific Orchestrations

| Domain | 🧠 Think | ⚡ Build | 🔍 Check | 📚 Help |
|--------|---------|---------|---------|--------|
| **Code** | `architect` `planner` | `executor` `ultra-executor` | `code-reviewer` `security-reviewer` | `explore` `researcher` |
| **Product** | `planner` + `/plan:write-spec` | `executor` | `critic` | `writer` + `stakeholder-comms` |
| **Data** | `scientist-high` | `scientist` + `/scientist:write-query` | `scientist-reviewer` | `researcher` |
| **Design** | `designer-high` | `designer` | `designer-reviewer` | `vision` |
| **Mobile** | `mobile-developer-high` | `mobile-developer` | `code-reviewer` | `researcher` |
| **Finance** | `finance-expert` | `finance-developer` | `code-reviewer` | `researcher` |
| **Ontology** | `ontology-expert` | `ontology-developer` | `ontology-reviewer` | `explore` |

### 📋 Slash Commands

```bash
# 🔄 Full Cycle — "just make it work"
/sk-claudecode:ralph implement user profile page with avatar upload

# ⚡ Parallel — maximum speed across files
/sk-claudecode:ultrawork refactor authentication to use OAuth2

# 🔗 Pipeline — explicit agent chain
/sk-claudecode:pipeline architect → planner → executor → code-reviewer

# 💰 Eco — save tokens (60%+ cheaper)
/sk-claudecode:ecomode fix all lint errors in src/

# 📋 Product — PRD + roadmap workflows
/sk-claudecode:ralph @planner "/plan:write-spec — Design the payment flow"
/sk-claudecode:ralph @planner "/plan:roadmap — Q2 feature prioritization"

# 🔬 Data — query + visualize workflows
/sk-claudecode:ralph @scientist "/scientist:write-query — Monthly churn by cohort"
/sk-claudecode:ralph @scientist "/scientist:visualize — Revenue trends by region"
```

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

## 🛠 Key Skills

| Skill | Command | Purpose |
|-------|---------|---------|
| Planning | `/sk-claudecode:ultra-plan` | High-density project planning |
| TDD | `/sk-claudecode:test-driven-development` | Test-first workflow |
| Verification | `/sk-claudecode:verification-loop` | Build/test/lint verification |
| Memory | `/sk-claudecode:memory` | Persistent cross-session context |
| Backend | `/sk-claudecode:backend` | Backend development patterns |
| Frontend | `/sk-claudecode:frontend-ui-ux` | UI/UX design patterns |
| Scientific | `/sk-claudecode:scientist` | 141 scientific domains |
| Quant | `/sk-claudecode:quant` | Quantitative trading strategies |

## ✨ Highlights

- **Real-time HUD** — Status line shows active agents and progress
- **Smart Model Routing** — Saves 30-50% on tokens automatically
- **Automatic Parallelization** — Complex tasks distributed across agents
- **Persistent Execution** — Won't give up until the job is verified complete
- **Learn from Experience** — Extracts and reuses problem-solving patterns

## 📚 More Documentation

- [Ultra Suite Guide](docs/ULTRA-SUITE.md) — Advanced workflow skills
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
