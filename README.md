# SK-ClaudeCode

> Unified agent and skill system for Claude Code

**28 agents** · **69 core skills** (standard mode, +141 scientific domains in full mode) · **17 magic keywords** — all in one package.

## 🚀 Installation

```bash
# Marketplace (Recommended)
claude plugin marketplace add cool25th/sk-claudecode
claude plugin install sk-claudecode
/sk-claudecode:setup

# NPM (Direct)
npm install -g sk-claudecode

# Local (Development)
git clone https://github.com/cool25th/sk-claudecode && cd sk-claudecode
npm install && npm run build && npm run setup
```

| Install Mode | Command | Size |
|-------------|---------|------|
| **Standard** | `/sk-claudecode:setup` | ~2MB |
| **Minimal** | `/sk-claudecode:setup --minimal` | ~1MB |
| **Full** | `/sk-claudecode:setup --full` | ~17MB |

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

## 🤖 Agents (28)

### 🧠 Think — Plan before you build

| Agent | Model | When to use |
|-------|-------|-------------|
| `architect` | Opus | System architecture, debugging strategy |
| `planner` | Opus | Feature planning, requirements analysis |
| `critic` | Opus | Review and challenge a work plan |

### ⚡ Build — Write and implement code

| Agent | Model | When to use |
|-------|-------|-------------|
| `executor` | Sonnet | General implementation tasks |
| `ultra-executor` | Opus | Complex multi-file autonomous tasks |
| `designer` | Sonnet | UI/UX development |
| `build-fixer` | Sonnet | Fix build errors (TS, Go, etc.) |
| `git-master` | Sonnet | Commits, rebasing, history management |
| `scientist` | Sonnet | Data analysis, research, experiment design |
| `mobile-developer` | Sonnet | iOS / Android / Flutter apps |
| `finance` | Opus | Trading systems, portfolio management, audit |
| `ontology` | Sonnet | Ontology design, implementation, review |
| `document-writer` | Sonnet | Document creation/editing (PDF, PPTX, XLSX, DOCX) |

### 🔍 Check — Review and test code

| Agent | Model | When to use |
|-------|-------|-------------|
| `code-reviewer` | Opus | Comprehensive code review |
| `security-reviewer` | Opus | Security vulnerabilities (OWASP Top 10) |
| `database-reviewer` | Opus | SQL optimization, schema design |
| `go-reviewer` | Opus | Go-specific best practices |
| `python-reviewer` | Opus | Python-specific (PEP 8, type hints) |
| `qa-tester` | Sonnet | Interactive CLI testing (tmux) |
| `tdd-guide` | Opus | Test-Driven Development |
| `e2e-runner` | Opus | End-to-end browser testing |
| `scientist-reviewer` | Opus | Research methodology & statistics validation |
| `designer-reviewer` | Opus | UI/UX accessibility, consistency, responsiveness |

### 📚 Help — Search and document

| Agent | Model | When to use |
|-------|-------|-------------|
| `explore` | Sonnet | Search codebase for files and patterns |
| `researcher` | Sonnet | External docs and reference research |
| `writer` | Haiku | README, API docs, comments |
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
| **Code** | `architect` `planner` | `executor` `ultra-executor` | `/code-review` `/code-review --security` | `explore` `researcher` |
| **Product** | `planner` + `/plan --spec` | `executor` | `critic` | `writer` + `stakeholder-comms` |
| **Data** | `scientist` | `/scientist` `/scientist --query` | `/code-review` | `researcher` |
| **Design** | `designer` | `designer` | `/code-review` | `/explore --vision` |
| **Mobile** | `mobile-developer` | `mobile-developer` | `/code-review` | `researcher` |
| **Finance** | `/finance` (audit) | `/finance --build` | `/code-review` | `researcher` |
| **Ontology** | `/ontology` (design) | `/ontology --build` | `/ontology --review` | `explore` |
| **Document** | — | `document-writer` | — | `writer` + `humanizer` |

---

## 📋 Commands

### Quick Start

| Category | Command | Description |
|----------|---------|-------------|
| **Domain** | `/sk-claudecode:finance` | Trading, market analysis, quant strategy |
| | `/sk-claudecode:ontology` | Ontology design & implementation |
| | `/sk-claudecode:mobile` | iOS / Android / Flutter |
| | `/sk-claudecode:scientist` | Data analysis & research |
| **Build** | `/sk-claudecode:executor` | Standard code implementation |
| | `/sk-claudecode:designer` | UI/UX development |
| | `/sk-claudecode:build-fix` | Build error resolution |
| **Review** | `/sk-claudecode:code-review` | General code review (auto-detects language) |
| | `/sk-claudecode:tdd` | Test-driven development |
| **Mode** | `/sk-claudecode:ultrawork` | Max parallelism (shortcut: `ulw`) |
| | `/sk-claudecode:ralph` | Persist until done |
| **Utility** | `/sk-claudecode:help` | Full usage guide |
| | `/sk-claudecode:plan` | Planning workflow |
| | `/sk-claudecode:cancel` | Stop any active mode |

### Product Management

| Command | Category | What it does |
|---------|----------|--------------|
| `/plan --spec` | 🧠 Think | Structured PRD with user stories & acceptance criteria |
| `/roadmap` | 🧠 Think | Roadmap planning with RICE/ICE/MoSCoW prioritization |
| `/scientist --query` | ⚡ Build | Optimized SQL query generation |
| `/scientist --viz` | ⚡ Build | Data visualization with chart type selection |

### Key Skills

| Skill | Command | Purpose |
|-------|---------|---------|
| Planning | `/sk-claudecode:plan` | High-density project planning |
| TDD | `/sk-claudecode:tdd` | Test-first workflow |
| Verification | `/sk-claudecode:ultraqa` | Build/test/lint verification loop |
| Memory | `/sk-claudecode:learner` | Persistent cross-session learning |
| Finance | `/sk-claudecode:finance` | KR/US market rules, quant strategy, trading |
| Mobile | `/sk-claudecode:mobile` | iOS / Android / Flutter |
| Ontology | `/sk-claudecode:ontology` | Palantir-style ontology (design/build/review) |
| Scientific | `/sk-claudecode:scientist` | 141 scientific domains |
| Document | `@document-writer` | PDF, PPTX, XLSX, DOCX, CSV creation & analysis |

---

## 🪄 Magic Keywords

Type these anywhere in your prompt — no slash command needed. All keywords support Korean triggers (한국어 지원).

| Keyword | Triggers | Effect |
|---------|----------|--------|
| **ultrawork** | `ultrawork` `ulw` `uw` | Maximum performance, parallel agent orchestration |
| **search** | `search` `find` `grep` `검색` `찾아` | Exhaustive parallel codebase search |
| **analyze** | `analyze` `debug` `audit` `분석` `디버그` | Deep analysis with context gathering |
| **ultrathink** | `ultrathink` `think` `reason` | Extended reasoning, consider all edge cases |
| **refactor** | `refactor` `cleanup` `리팩터` `정리` | Safe refactoring with plan-first gate + review |
| **tdd** | `tdd` `write test` `테스트 작성` | RED→GREEN→REFACTOR cycle enforced |
| **security** | `security` `owasp` `xss` `보안` | OWASP Top 10 checklist + security-reviewer |
| **plan** | `plan` `spec` `blueprint` `기획` | Spec-first — no code until plan approved |
| **review** | `code review` `cr` `코드 리뷰` | Structured code review with checklist |
| **docs** | `document` `jsdoc` `readme` `문서화` | Documentation mode with writer agent |
| **perf** | `optimize` `slow` `bottleneck` `성능` | Measure-first optimization protocol |
| **ecomode** | `ecomode` `cheap` `절약` | Haiku-first routing, minimize token usage |

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
/sk-claudecode:plan --spec Design the payment flow
/sk-claudecode:roadmap Q2 feature prioritization

# 🔬 Data — query + visualize
/sk-claudecode:scientist --query Monthly churn by cohort
/sk-claudecode:scientist --viz Revenue trends by region

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

## Testing Commands

- `npm test` : run all tests once (`test:unit`)
- `npm run test:unit -- --grep "module-name"` : run filtered tests
- `npm run test:full` : lint + all tests (recommended release/checkpoint command)
- `npm run test:ci` : CI-safe full check (`lint + test`)
