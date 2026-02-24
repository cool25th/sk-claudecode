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
| `architect` | Medium | Sonnet | Architecture planning and design |
| `architect-medium` | Medium | Sonnet | Standard architecture review |
| `architect-low` | Low | Haiku | Quick architecture checks |
| `executor` | Medium | Sonnet | Standard implementation |
| `executor-low` | Low | Haiku | Simple code changes |
| `explore` | Low | Haiku | Code exploration |
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

## Smart Model Routing

Agents use different models based on task complexity:

- **haiku**: Fast, cost-effective for simple tasks
- **sonnet**: Balanced for most work
- **opus**: Maximum capability for complex reasoning

## All Skills

Skills provide reusable workflows that can be triggered by keywords or slash commands.

| Skill | Trigger | Description |
|-------|---------|-------------|
| orchestrate | Start a task | Multi-agent orchestration |
| plan | Create a plan | Work planning workflow |
| continuous-learning | cl | Consolidate and replay learned patterns |
| strategy | strategy | Managed context and compacting |
| check | check | Structured verification checks |
| research | research | Deep research workflow |
| tdd | tdd | Test-driven development execution |

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
