# sk-claudecode Documentation

## Multi-Agent Orchestration

sk-claudecode enables a multi-agent orchestration pattern where specialized agents handle different aspects of development work.

### Delegation-First Philosophy

The orchestrator delegates tasks to specialized agents rather than doing everything itself:

- **Orchestrator**: Coordinates work, creates plans, verifies results
- **Executor agents**: Implement code changes
- **Reviewer agents**: Analyze code quality and architecture

## Agent Tier Matrix

Agents are available at different tiers. Legacy tiered names are kept for compatibility and map to consolidated prompts.

| Agent | Tier | Model | Use Case |
|-------|------|-------|----------|
| `architect` | High | Opus | Architecture planning and design |
| `architect-medium` | Medium | Sonnet | Standard architecture review |
| `architect-low` | Low | Haiku | Quick architecture checks |
| `executor` | Medium | Sonnet | Standard implementation |
| `executor-low` | Low | Haiku | Simple code changes |
| `ultra-executor` | High | Opus | Complex multi-step execution |
| `explore` | Medium | Sonnet | Code exploration |
| `designer` | Medium | Sonnet | UI/UX implementation |
| `designer-low` | Low | Haiku | Simple UI changes |
| `designer-high` | High | Opus | Complex UI design |
| `researcher` | Medium | Sonnet | Research tasks |
| `researcher-low` | Low | Haiku | Quick lookups |
| `writer` | Low | Haiku | Documentation |
| `critic` | High | Opus | Plan and quality review |
| `planner` | High | Opus | Work planning |
| `qa-tester` | Medium | Sonnet | Testing |
| `qa-tester-high` | High | Opus | Deep testing and verification |
| `finance` | High | Opus | Trading systems, market logic, financial audit |
| `ontology` | Medium | Sonnet | Ontology design, implementation, schema validation |
| `mobile-developer` | Medium | Sonnet | iOS/Android mobile development |
| `scientist` | Medium | Sonnet | Data analysis and research |
| `scientist-reviewer` | High | Opus | Research methodology review |
| `code-reviewer` | High | Opus | Expert code review |
| `security-reviewer` | High | Opus | Security vulnerability detection |
| `build-fixer` | Medium | Sonnet | Build error resolution |
| `tdd-guide` | High | Opus | Test-driven development |
| `database-reviewer` | High | Opus | SQL and schema review |
| `go-reviewer` | High | Opus | Go best practices review |
| `python-reviewer` | High | Opus | Python best practices review |
| `designer-reviewer` | High | Opus | UI/UX design review |
| `document-writer` | Medium | Sonnet | PPTX, XLSX, PDF, DOCX creation |
| `e2e-runner` | High | Opus | End-to-end browser testing |
| `tracer` | High | Opus | Runtime tracing and profiling |
| `refactor-cleaner` | High | Opus | Dead code removal |
| `git-master` | Medium | Sonnet | Git operations expert |

## Slash Commands (Quick Start)

Use `/sk-claudecode:<command>` to invoke any agent or workflow:

### Domain Specialists
| Command | Description |
|---------|-------------|
| `/sk-claudecode:finance` | Trading, market analysis, quant strategy |
| `/sk-claudecode:ontology` | Ontology design & implementation |
| `/sk-claudecode:mobile` | iOS/Android development |
| `/sk-claudecode:scientist` | Data analysis & research |
| `/sk-claudecode:research` | Orchestrate parallel research |

### Build & Fix
| Command | Description |
|---------|-------------|
| `/sk-claudecode:executor` | Standard code implementation |
| `/sk-claudecode:designer` | UI/UX development |
| `/sk-claudecode:build-fix` | Build error resolution |
| `/sk-claudecode:git-master` | Git operations expert |
| `/sk-claudecode:writer` | Documentation writing |

### Review
| Command | Description |
|---------|-------------|
| `/sk-claudecode:code-review` | General code review (auto-detects language) |
| `/sk-claudecode:tdd` | Test-driven development |
| `/sk-claudecode:qa-tester` | Interactive CLI testing |
| `/sk-claudecode:e2e-runner` | Browser automation & E2E testing (agent-browser) |

### Execution Modes
| Command | Shortcut | Description |
|---------|----------|-------------|
| `/sk-claudecode:ultrawork` | `ulw` | Max parallelism |
| `/sk-claudecode:ralph` | `ralph` | Persist until done |
| `/sk-claudecode:autopilot` | - | Full autonomous |
| `/sk-claudecode:swarm` | - | N coordinated agents |

### Utility
| Command | Description |
|---------|-------------|
| `/sk-claudecode:help` | Full usage guide |
| `/sk-claudecode:plan` | Planning workflow |
| `/sk-claudecode:explore` | Codebase search |
| `/sk-claudecode:cancel` | Stop any active mode |

## Smart Model Routing

Agents use different models based on task complexity:

- **haiku**: Fast, cost-effective for simple tasks
- **sonnet**: Balanced for most work
- **opus**: Maximum capability for complex reasoning

## All Skills

Skills provide reusable workflows activated by keywords or agent context.

| Skill | Trigger | Description |
|-------|---------|-------------|
| orchestrate | Start a task | Multi-agent orchestration |
| plan | Create a plan | Work planning workflow |
| continuous-learning | cl | Consolidate and replay learned patterns |
| strategy | strategy | Managed context and compacting |
| check | check | Structured verification checks |
| research | research | Deep research workflow |
| tdd | tdd | Test-driven development execution |
| finance | finance | Korean/US market rules, quant strategy, trading execution |
| ontology | ontology | Ontology design, implementation, and review |
| mobile | mobile | Mobile development patterns |
| agent-browser | browser, e2e, scrape, screenshot | Browser automation CLI for AI agents |
| web-search-browser | websearch, 웹검색, 웹서치 | Browser-based web search via agent-browser (DuckDuckGo/Google) |

## Cancellation

All persistent modes can be cancelled with the `/sk-claudecode:cancel` command:

```
/sk-claudecode:cancel
```

If the normal cancel fails, use force mode:

```
/sk-claudecode:cancel --force
```

This will:
- Deactivate all active modes (ralph, ultrawork, autopilot, etc.)
- Clean up state files in `.skc/state/`
- Allow the session to end normally

Legacy compatibility shortcuts:
- `ralph`, `ralplan`, `ulw`

## File Structure

- `.skc/` - Project-level sk-claudecode state
  - `plans/` - Work plans
  - `state/` - Active mode state files
  - `notepads/` - Working memory
- `~/.claude/` - Global Claude configuration
