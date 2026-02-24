---
name: ultra-executor
description: Activate autonomous deep work mode for complex goal-oriented tasks
---

# Ultra Executor Skill

Triggers the ultra-executor agent for deep, autonomous work on complex tasks.

## Overview

Ultra Executor is SK-ClaudeCode's most powerful execution mode. It spawns an Opus-powered agent that:

- **Explores** the codebase thoroughly before acting
- **Plans** with full context of existing patterns
- **Executes** autonomously without hand-holding
- **Verifies** every change with diagnostics and tests

## When to Use

| Scenario | Use Ultra Executor |
|----------|-------------------|
| Multi-file refactoring | ✅ Yes |
| Complex feature implementation | ✅ Yes |
| Architecture changes | ✅ Yes |
| Bug fixing across systems | ✅ Yes |
| Simple typo fixes | ❌ No - use regular edit |
| Single file changes | ❌ No - do it directly |

## Activation

```
/skill ultra-executor <your complex task description>
```

Or use the agent directly:
```
/sk-claudecode:ultra-executor <your complex task>
```

## Key Features

### 1. Explore-First Protocol
Before any execution, Ultra Executor uses tools like `Glob`, `Grep`, and `ast_grep_search` to fully understand the problem space.

### 2. Pattern Discovery
Automatically discovers and follows existing code patterns, naming conventions, and error handling styles.

### 3. Parallel Exploration
Can spawn up to 3 parallel exploration agents to gather context faster (explore, researcher).

### 4. Strict Verification
Every change is verified with:
- LSP diagnostics
- Build commands
- Test suites
- Debug code checks

### 5. Failure Recovery
Built-in escalation protocol after 3 failed attempts - consults architect-medium for guidance.

## Related Skills

- `/skill ultra-executor` - Plan execution mode
- `/skill plan` - Writing plans before execution
- `/skill ultrawork` - Combined planning and execution workflow

## Related Agents

- `ultra-executor` - This skill's primary agent (Opus)
- `architect-medium` - Consulted for escalation
- `explore` / `researcher` - For parallel exploration


## Merged from `ultra-execute`


# Executing Plans

## Overview

Load plan, review critically, execute tasks in batches, report for review between batches.

**Core principle:** Batch execution with checkpoints for architect review.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

## The Process

### Step 1: Load and Review Plan
1. Read plan file
2. Review critically - identify any questions or concerns about the plan
3. If concerns: Raise them with your human partner before starting
4. If no concerns: Create TodoWrite and proceed

### Step 2: Execute Batch
**Default: First 3 tasks**

For each task:
1. Mark as in_progress
2. Follow each step exactly (plan has bite-sized steps)
3. Run verifications as specified
4. Mark as completed

### Step 3: Report
When batch complete:
- Show what was implemented
- Show verification output
- Say: "Ready for feedback."

### Step 4: Continue
Based on feedback:
- Apply changes if needed
- Execute next batch
- Repeat until complete

### Step 5: Complete Development

After all tasks complete and verified:
- Announce: "I'm using the finishing-a-development-branch skill to complete this work."
- **REQUIRED SUB-SKILL:** Use sk-claudecode:finishing-a-development-branch
- Follow that skill to verify tests, present options, execute choice

## When to Stop and Ask for Help

**STOP executing immediately when:**
- Hit a blocker mid-batch (missing dependency, test fails, instruction unclear)
- Plan has critical gaps preventing starting
- You don't understand an instruction
- Verification fails repeatedly

**Ask for clarification rather than guessing.**

## When to Revisit Earlier Steps

**Return to Review (Step 1) when:**
- Partner updates the plan based on your feedback
- Fundamental approach needs rethinking

**Don't force through blockers** - stop and ask.

## Remember
- Review plan critically first
- Follow plan steps exactly
- Don't skip verifications
- Reference skills when plan says to
- Between batches: just report and wait
- Stop when blocked, don't guess
- Never start implementation on main/master branch without explicit user consent

## Integration

**Required workflow skills:**
- **sk-claudecode:using-git-worktrees** - REQUIRED: Set up isolated workspace before starting
- **sk-claudecode:writing-plans** - Creates the plan this skill executes
- **sk-claudecode:finishing-a-development-branch** - Complete development after all tasks

---

## Related Agents

- `ultra-executor` - Ultra execution agent
- `executor` - Standard execution (Sonnet)
