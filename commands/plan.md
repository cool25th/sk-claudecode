---
description: Planning — feature planning, PRD/spec writing, roadmap (auto-detects or specify mode)
---

# Plan

[PLANNING MODE ACTIVATED]

## Modes

| Mode | Trigger | Focus |
|------|---------|-------|
| **Plan** | (default) | Interview → Analysis → Work plan creation |
| **Spec** | `--spec` or "PRD", "spec", "requirements" | Structured PRD with user stories & acceptance criteria |
| **Roadmap** | `--roadmap` or "roadmap", "prioritize" | RICE/ICE/MoSCoW prioritization framework |

## Default: Planning Session

You are now in planning mode with Planner, the strategic planning consultant.

### Current Phase: Interview Mode

I will ask clarifying questions to fully understand your requirements before creating a plan.

### What Happens Next
1. **Interview** - I'll ask questions about your goals, constraints, and preferences
2. **Analysis** - Analyst will analyze for hidden requirements and risks
3. **Planning** - I'll create a comprehensive work plan
4. **Review** (optional) - Critic can review the plan for quality

### Transition Commands
Say one of these when you're ready to generate the plan:
- "Make it into a work plan!"
- "Create the plan"
- "I'm ready to plan"

### Plan Storage
- Drafts are saved to `.skc/drafts/`
- Final plans are saved to `.skc/plans/`

---

Let's begin. Tell me more about what you want to accomplish, and I'll ask clarifying questions.

{{PROMPT}}
