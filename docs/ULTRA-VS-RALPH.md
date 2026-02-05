# Ultra vs Ralph - Workflow Comparison

SK-ClaudeCode provides two major workflow families: **Ultra** (high-powered parallel/autonomous) and **Ralph** (iterative consensus-driven). This guide explains their differences and when to use each.

## Quick Comparison

| Aspect | Ultra Family | Ralph Family |
|--------|--------------|--------------|
| **Philosophy** | Autonomous, parallel, maximum throughput | Iterative, consensus, verified completion |
| **Agent Style** | Single powerful agent OR parallel swarm | Multi-agent deliberation loops |
| **Best For** | Large-scale tasks, speed | Quality-critical tasks, verification |
| **Human Involvement** | Checkpoint-based review | Continuous iteration until approval |

---

## Ultra Family

High-powered autonomous execution with parallel capabilities.

### Key Skills

| Skill | Purpose |
|-------|---------|
| `ultra-executor` | Autonomous deep work (Opus-powered) |
| `ultra-plan` | Write implementation plans |
| `ultra-execute` | Execute written plans with checkpoints |
| `ultrapilot` | Parallel autopilot with file ownership |
| `ultrawork` | High-throughput parallel execution |
| `ultraqa` | QA cycling (test→fix→repeat) |

### Characteristics

- ✅ **Autonomous**: Minimal hand-holding needed
- ✅ **Fast**: Parallel execution when possible
- ✅ **Thorough**: Built-in verification steps
- ⚠️ **Less deliberation**: Executes quickly, may need correction

### Typical Workflow

```
1. ultra-plan    → Create implementation plan
2. ultra-execute → Execute with batch checkpoints
3. ultraqa       → QA cycling until verified
4. ultra-finish  → Complete branch
```

---

## Ralph Family

Iterative loops with multi-agent consensus and verification.

### Key Skills

| Skill | Purpose |
|-------|---------|
| `ralph` | Self-referential loop until completion verified |
| `ralph-init` | Create PRD (Product Requirements Document) |
| `ralplan` | Multi-agent consensus planning (Planner + Architect + Critic) |

### Characteristics

- ✅ **Verified**: Multiple agents check work
- ✅ **Deliberate**: Iterates until consensus
- ✅ **Quality-focused**: Critic approval required
- ⚠️ **Slower**: Multiple iterations needed

### Typical Workflow

```
1. ralph-init → Create PRD for the task
2. ralplan    → 3-agent consensus until Critic approves
3. ralph      → Loop execution until completion promise
```

---

## Head-to-Head Comparison

### ultra-execute vs ralplan

| Aspect | ultra-execute | ralplan |
|--------|---------------|---------|
| **Purpose** | Execute existing plan | Create consensus plan |
| **Input** | Written plan file | Task description |
| **Output** | Implemented code | Approved plan document |
| **Agents** | Single executor | Planner + Architect + Critic |
| **Iterations** | Batch checkpoints | Until Critic approves (max 5) |

### ultra-plan vs ralplan

| Aspect | ultra-plan | ralplan |
|--------|------------|---------|
| **Purpose** | Quick plan writing | Consensus plan writing |
| **Agents** | Single planner | 3 agents deliberating |
| **Speed** | Fast | Slower (multiple iterations) |
| **Quality** | Good | Higher (multi-perspective) |
| **Use When** | Clear requirements | Complex/ambiguous requirements |

### ultrawork vs ralph

| Aspect | ultrawork | ralph |
|--------|-----------|-------|
| **Execution** | Parallel swarm | Single agent loop |
| **Termination** | Task list complete | Completion promise verified |
| **Speed** | Maximum throughput | Iterative refinement |
| **Verification** | Built-in checks | Architect verification |

---

## When to Use Which

### Use Ultra When:
- ⏱️ Time is critical
- 📋 Requirements are clear
- 🔄 Task can be parallelized
- 🎯 You know what you want

### Use Ralph When:
- ✅ Quality over speed
- ❓ Requirements need exploration
- 🔍 Multiple perspectives needed
- 📝 PRD/specification work

### Combined Workflow (Best of Both)

For complex projects, combine both:

```
1. ralph-init  → Create detailed PRD
2. ralplan     → Get 3-agent consensus on plan
3. ultra-execute → Execute approved plan efficiently
4. ralph       → Final verification loop
```

---

## See Also

- [Ultra Suite Guide](ULTRA-SUITE.md) - Detailed ultra-* documentation
- [skills/ralph/](../skills/ralph/) - Ralph skill details
- [skills/ralplan/](../skills/ralplan/) - Ralplan skill details
