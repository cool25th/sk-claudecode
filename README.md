# SK-ClaudeCode

> Unified agent and skill system for Claude Code

**29 agents** · **74 core skills** (+141 scientific domains in full mode) · **18 magic keywords** — all in one package.

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

| Mode | Command | Size |
|------|---------|------|
| Standard | `/sk-claudecode:setup` | ~2MB |
| Minimal | `/sk-claudecode:setup --minimal` | ~1MB |
| Full | `/sk-claudecode:setup --full` | ~17MB |

---

## 💡 Core Concept: Think → Build → Check

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

## 🤖 Agents (29)

### 🧠 Think

| Agent | Model | When to use |
|-------|-------|-------------|
| `architect` | Opus | System architecture, debugging strategy |
| `planner` | Opus | Feature planning, requirements analysis |
| `critic` | Opus | Review and challenge a work plan |

### ⚡ Build

| Agent | Model | When to use |
|-------|-------|-------------|
| `executor` | Sonnet | General implementation tasks |
| `ultra-executor` | Opus | Complex multi-file autonomous tasks |
| `designer` | Sonnet | UI/UX development |
| `build-fixer` | Sonnet | Fix build errors (TS, Go, etc.) |
| `git-master` | Sonnet | Commits, rebasing, history management |
| `scientist` | Sonnet | Data analysis, research, experiment design |
| `mobile-developer` | Sonnet | iOS / Android / Flutter apps |
| `finance` | Opus | Trading systems, portfolio management |
| `ontology` | Sonnet | Ontology design, implementation, review |
| `document-writer` | Sonnet | Document creation (PDF, PPTX, XLSX, DOCX) |

### 🔍 Check

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
| `tracer` | Opus | Runtime tracing, profiling, race conditions |
| `scientist-reviewer` | Opus | Research methodology validation |
| `designer-reviewer` | Opus | UI/UX accessibility, consistency |

### 📚 Help

| Agent | Model | When to use |
|-------|-------|-------------|
| `explore` | Sonnet | Search codebase for files and patterns |
| `researcher` | Sonnet | External docs and reference research |
| `writer` | Haiku | README, API docs, comments |
| `vision` | Sonnet | Analyze images, PDFs, diagrams |
| `refactor-cleaner` | Opus | Find and remove dead code |

---

## 🚀 Orchestration Modes

| Command | How it works |
|---------|-------------|
| **🔄 Full Cycle** | |
| `ralph` | 🧠→⚡→🔍 + **retry until all pass** |
| `autopilot` | 🧠→⚡→🔍 auto-selects best agents |
| `pipeline` | 🧠→⚡→🔍 you define the agent chain |
| `ecomode` | 🧠→⚡→🔍 Haiku/Sonnet only (60%+ cheaper) |
| **⚡ Parallel** | |
| `ultrawork` | All phases in parallel across files |
| `ultrapilot` | Splits by file owner, parallel per partition |
| `swarm` | N coordinated agents share the cycle |
| **🔍 Check** | |
| `ultraqa` | Build → Check → **loop until pass** |

```
ralph:       @planner → @executor → @code-reviewer ── fail? → @build-fixer → retry
ultrawork:   ┌─ @executor → @code-reviewer       (3 lanes
             ├─ @executor → @security-reviewer     in parallel)
             └─ @designer → @designer-reviewer
```

---

## 📋 Commands & Skills

| Command | Purpose |
|---------|---------|
| `/sk-claudecode:ralph` | Full cycle, retry until done |
| `/sk-claudecode:ultrawork` | Max parallelism (`ulw`) |
| `/sk-claudecode:plan` | Project planning with spec |
| `/sk-claudecode:code-review` | Code review (auto-detects language) |
| `/sk-claudecode:tdd` | Test-driven development |
| `/sk-claudecode:ultraqa` | Build/test/lint verification loop |
| `/sk-claudecode:deep-interview` | Socratic requirement extraction |
| `/sk-claudecode:ai-slop-cleaner` | Remove AI-generated anti-patterns |
| `/sk-claudecode:handoff` | Session handoff for continuation |
| `/sk-claudecode:learner` | Persistent cross-session learning |
| `/sk-claudecode:finance` | KR/US market, quant strategy |
| `/sk-claudecode:mobile` | iOS / Android / Flutter |
| `/sk-claudecode:ontology` | Palantir-style ontology |
| `/sk-claudecode:scientist` | 141 scientific domains |
| `/sk-claudecode:web-search-browser` | Browser-based web search (agent-browser) |
| `/sk-claudecode:cancel` | Stop any active mode |

---

## 🪄 Magic Keywords

Type anywhere in your prompt — no slash command needed. 한국어 지원.

| Keyword | Triggers | Effect |
|---------|----------|--------|
| **ultrawork** | `ultrawork` `ulw` `uw` | Parallel agent orchestration |
| **search** | `search` `find` `grep` `검색` | Exhaustive codebase search |
| **analyze** | `analyze` `debug` `audit` `분석` | Deep analysis with context |
| **ultrathink** | `ultrathink` `think` `reason` | Extended reasoning |
| **refactor** | `refactor` `cleanup` `리팩터` | Plan-first safe refactoring |
| **tdd** | `tdd` `write test` `테스트 작성` | RED→GREEN→REFACTOR cycle |
| **security** | `security` `owasp` `보안` | OWASP Top 10 checklist |
| **plan** | `plan` `spec` `blueprint` `기획` | Spec-first, no code until approved |
| **review** | `code review` `cr` `코드 리뷰` | Structured code review |
| **docs** | `document` `readme` `문서화` | Documentation mode |
| **perf** | `optimize` `slow` `성능` | Measure-first optimization |
| **browser** | `browser` `e2e` `브라우저` | Browser automation |
| **websearch** | `websearch` `web-search` `웹검색` | Browser-based web search |
| **deep-interview** | `interview` `clarify` `인터뷰` | Requirement extraction |
| **ai-slop** | `slop` `over-engineered` `슬로프` | Remove AI code patterns |
| **tracer** | `trace` `profile` `추적` | Runtime tracing & profiling |
| **handoff** | `handoff` `인수인계` `세션 이관` | Session context handoff |
| **ecomode** | `ecomode` `cheap` `절약` | Haiku-first, minimize tokens |

---

## 💻 Usage Examples

```bash
# Full Cycle — retry until done
/sk-claudecode:ralph implement user profile page with avatar upload

# Parallel — maximum speed
/sk-claudecode:ultrawork refactor authentication to use OAuth2

# Save tokens (60%+ cheaper)
/sk-claudecode:ecomode fix all lint errors in src/

# Clarify before coding
/sk-claudecode:deep-interview "I want to build a task management app"

# Remove AI slop
clean slop in src/services/

# Runtime profiling
trace execution of the login flow to find the bottleneck

# 📦 Session Handoff — preserve context for next session
handoff this session
```

> 💡 **Tip:** `ralph` automates Think → Build → Check and keeps iterating until everything passes.

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

[oh-my-claudecode](https://github.com/code-yeongyu/oh-my-claudecode) · [superpowers](https://github.com/obra/superpowers) · [claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) · [claude-mem](https://github.com/thedotmack/claude-mem) · [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode)

## 📜 License

MIT — Components retain their original licenses.

---

**Made with ❤️ by merging the best of Claude Code ecosystems**

## Testing

```bash
npm test                                    # run all tests
npm run test:unit -- --grep "module-name"   # filtered tests
npm run test:full                           # lint + all tests
npm run test:ci                             # CI-safe full check
```
