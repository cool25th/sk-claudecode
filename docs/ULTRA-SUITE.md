# Ultra Suite - Advanced Workflow Skills

SK-ClaudeCode's Ultra suite provides high-powered workflow skills for complex development tasks. Each skill is optimized for specific scenarios and can work independently or in combination.

## Quick Reference

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| [ultrapilot](#ultrapilot) | Parallel autopilot | Large multi-file tasks with file ownership |
| [ultrawork](#ultrawork) | Parallel execution | High-throughput parallel task completion |
| [ultra-executor](#ultra-executor) | Autonomous deep work | Complex goal-oriented tasks (Opus) |
| [ultra-plan](#ultra-plan) | Writing plans | Before multi-step implementation |
| [ultra-execute](#ultra-execute) | Executing plans | Running written plans with checkpoints |
| [ultra-subagent](#ultra-subagent) | Multi-agent coordination | Independent tasks in current session |
| [ultra-debugging](#ultra-debugging) | Systematic debugging | Bug hunting and root cause analysis |
| [ultraqa](#ultraqa) | QA cycling | Test → verify → fix → repeat |
| [ultra-brainstorm](#ultra-brainstorm) | Ideation | Before creative/feature work |
| [ultra-git](#ultra-git) | Git worktrees | Isolated feature development |
| [ultra-finish](#ultra-finish) | Branch completion | Merge/PR decisions after implementation |
| [ultra-skill-writing](#ultra-skill-writing) | Skill authoring | Creating/editing SKC skills |

---

## Workflow Categories

### 🚀 Parallel Execution

#### ultrapilot
**Parallel autopilot with file ownership partitioning**

Best for large-scale changes spanning many files. Spawns multiple agents with exclusive file ownership to prevent conflicts.

```
/skill ultrapilot <your-complex-task>
```

**Key Features:**
- File ownership partitioning
- Parallel agent spawning
- Automatic conflict prevention
- Progress tracking

---

#### ultrawork
**Parallel execution engine for high-throughput task completion**

General-purpose parallel execution when you need maximum throughput.

```
/skill ultrawork <task-description>
```

**Key Features:**
- High-throughput execution
- Task batching
- Automatic retry on failure

---

#### ultra-subagent
**Subagent-driven development for independent tasks**

Coordinates multiple subagents for tasks that can be executed independently in the current session.

```
/skill ultra-subagent <implementation-plan>
```

**Key Features:**
- Task decomposition
- Agent coordination
- Result aggregation

---

### 📋 Planning & Execution

#### ultra-plan
**Writing implementation plans before coding**

Use when you have requirements but need a structured plan before writing code.

```
/skill ultra-plan <spec-or-requirements>
```

**Output:** Detailed implementation plan with tasks, dependencies, and verification steps.

---

#### ultra-execute
**Executing written plans with review checkpoints**

Use after `ultra-plan` to methodically execute the plan with human review points.

```
/skill ultra-execute <path-to-plan>
```

**Key Features:**
- Checkpoint-based execution
- Review gates between phases
- Progress persistence

---

#### ultra-executor
**Autonomous deep work mode (Opus-powered)**

The most powerful execution mode. Use for complex, goal-oriented tasks that require deep exploration, planning, and autonomous execution.

```
/skill ultra-executor <complex-goal>
```

**Key Features:**
- Explore-first protocol
- Pattern discovery
- Parallel exploration (up to 3 agents)
- Automatic failure recovery
- Escalation after 3 attempts

**Agent:** `sk-claudecode:ultra-executor` (Opus)

---

### 🐛 Quality Assurance

#### ultra-debugging
**Systematic debugging methodology**

Use when encountering any bug, test failure, or unexpected behavior. Provides structured root-cause analysis.

```
/skill ultra-debugging <error-description>
```

**Includes:**
- Root cause tracing
- Defense in depth analysis
- Condition-based waiting patterns
- Academic debugging techniques

---

#### ultraqa
**QA cycling workflow**

Structured test → verify → fix → repeat cycle until quality goals are met.

```
/skill ultraqa <quality-goals>
```

**Key Features:**
- Iterative quality cycles
- Verification checkpoints
- Regression prevention

---

### 💡 Creative & Git

#### ultra-brainstorm
**Brainstorming before creative work**

**MUST use before** any creative work - features, components, functionality changes.

```
/skill ultra-brainstorm <feature-idea>
```

**Output:** Explored requirements, design alternatives, implementation approach.

---

#### ultra-git
**Git worktrees for isolated development**

Creates isolated git worktrees for feature work separated from your main workspace.

```
/skill ultra-git <feature-name>
```

**Key Features:**
- Automatic worktree creation
- Smart directory selection
- Safety verification

---

#### ultra-finish
**Completing development branches**

Use when implementation is done, tests pass, and you need to decide: merge, PR, or cleanup.

```
/skill ultra-finish
```

**Output:** Structured options for integrating or discarding the work.

---

#### ultra-skill-writing
**Authoring SKC skills**

Use when creating, editing, or testing new skills for SK-ClaudeCode.

```
/skill ultra-skill-writing <skill-topic>
```

**Includes:**
- Best practices from Anthropic
- Skill testing with subagents
- Persuasion principles
- GraphViz conventions

---

## Ultra Agents

| Agent | Model | Purpose |
|-------|-------|---------|
| `ultra-executor` | Opus | Autonomous deep work for complex tasks |
| `ultra-code-reviewer` | Sonnet | Code review with ultra-strict standards |

### Ultra Executor Agent

The most powerful agent in SK-ClaudeCode. Use for:
- Multi-file refactoring
- Complex feature implementation
- Architecture changes
- Bug fixing across systems

```
/sk-claudecode:ultra-executor <complex-task>
```

---

## Recommended Workflows

### New Feature Development
```
1. /skill ultra-brainstorm <feature-idea>
2. /skill ultra-git create-feature <name>
3. /skill ultra-plan <brainstorm-output>
4. /skill ultra-execute <plan-path>
5. /skill ultraqa
6. /skill ultra-finish
```

### Complex Debugging
```
1. /skill ultra-debugging <error>
2. Review root cause analysis
3. /skill ultra-executor <fix-description>
4. /skill ultraqa
```

### Large-Scale Refactoring
```
1. /skill ultrapilot <refactoring-description>
   OR
   /skill ultra-executor <refactoring-description>
```

---

## See Also

- [README.md](README.md) - Project overview
- [skills/](skills/) - All available skills
- [agents/](agents/) - All available agents
