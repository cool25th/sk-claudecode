# sk-claudecode Documentation

## Multi-Agent Orchestration

sk-claudecode enables a multi-agent orchestration pattern where specialized agents handle different aspects of development work.

### Delegation-First Philosophy

The orchestrator delegates tasks to specialized agents rather than doing everything itself:

- **Orchestrator**: Coordinates work, creates plans, verifies results
- **Executor agents**: Implement code changes
- **Reviewer agents**: Analyze code quality and architecture

## Agent Tier Matrix

Agents are available at different tiers based on task complexity:

| Agent | Tier | Model | Use Case |
|-------|------|-------|----------|
| `architect` | High | Opus | Complex system design |
| `architect-medium` | Medium | Sonnet | Standard architecture review |
| `architect-low` | Low | Haiku | Quick architecture checks |
| `executor` | Medium | Sonnet | Standard implementation |
| `executor-high` | High | Opus | Complex implementation |
| `executor-low` | Low | Haiku | Simple changes |
| `explore` | Low | Haiku | Code exploration |
| `explore-medium` | Medium | Sonnet | Deeper exploration |
| `explore-high` | High | Opus | Complex research |
| `designer` | Medium | Sonnet | UI/UX implementation |
| `designer-low` | Low | Haiku | Simple UI changes |
| `designer-high` | High | Opus | Complex UI design |
| `researcher` | Medium | Sonnet | Research tasks |
| `researcher-low` | Low | Haiku | Quick lookups |
| `writer` | Low | Haiku | Documentation |
| `critic` | High | Opus | Plan review |
| `analyst` | High | Opus | Requirements analysis |
| `planner` | High | Opus | Work planning |
| `qa-tester` | Medium | Sonnet | Testing |

## Smart Model Routing

Agents use different models based on complex:

- **haiku**: Fast, cost-effective for simple tasks
- **sonnet**: Balanced for most work
- **opus**: Maximum capability for complex reasoning

## All Skills

Skills provide reusable workflows that can be triggered by keywords or slash commands.

| Skill | Trigger | Description |
|-------|---------|-------------|
| orchestrate | Start a task | Multi-agent orchestration |
| plan | Create a plan | Work planning workflow |
| ralph | ralph, ralplan | Continuous work loop |
| ultrawork | ulw | Deep work mode |
| analyze | Analyze code | Code analysis |
| research | Research topic | Deep research |

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

## File Structure

- `.skc/` - Project-level sk-claudecode state
  - `plans/` - Work plans
  - `state/` - Active mode state files
  - `notepads/` - Working memory
- `~/.claude/` - Global Claude configuration
