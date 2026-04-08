---
name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation."
triggers:
  - "brainstorm"
  - "ideate"
  - "idea refine"
  - "help me think"
---

# Brainstorming Ideas Into Designs

## Overview

Help turn ideas into fully formed designs and specs through natural collaborative dialogue with structured divergent and convergent thinking.

Start by understanding the current project context, then ask questions one at a time to refine the idea. Once you understand what you're building, present the design in small sections (200-300 words), checking after each section whether it looks right so far.

## The Process

### Phase 1: Understand & Expand (Divergent)

**Understanding the idea:**
- Check out the current project state first (files, docs, recent commits)
- Restate the idea as a crisp "How Might We" problem statement to force clarity
- Ask 3-5 sharpening questions (**one at a time**):
  - Who is this for, specifically?
  - What does success look like?
  - What are the real constraints (time, tech, resources)?
  - What's been tried before?
  - Why now?
- Prefer multiple choice questions when possible

**Exploring approaches with 7 Idea Lenses:**
- **Inversion:** "What if we did the opposite?"
- **Constraint removal:** "What if budget/time/tech weren't factors?"
- **Audience shift:** "What if this were for [different user]?"
- **Combination:** "What if we merged this with [adjacent idea]?"
- **Simplification:** "What's the version that's 10x simpler?"
- **10x version:** "What would this look like at massive scale?"
- **Expert lens:** "What would [domain] experts find obvious?"

Generate 5-8 well-considered variations, not 20 shallow ones. Each variation should have a reason it exists.

**If running inside a codebase:** Use `grep`, `find`, and `read` to scan for relevant context — existing architecture, patterns, constraints, prior art.

### Phase 2: Evaluate & Converge

After user reacts to Phase 1 (indicates what resonates, pushes back, adds context):

1. **Cluster** ideas that resonated into 2-3 distinct directions. Each should feel meaningfully different.

2. **Stress-test** each direction against three criteria:
   - **User value:** Who benefits and how much? Is this a painkiller or a vitamin?
   - **Feasibility:** Technical and resource cost? What's the hardest part?
   - **Differentiation:** What makes this genuinely different? Would someone switch?

3. **Surface hidden assumptions.** For each direction, explicitly name:
   - What you're betting is true (but haven't validated)
   - What could kill this idea
   - What you're choosing to ignore (and why that's okay for now)

**Be honest, not supportive.** If an idea is weak, say so with kindness. A good ideation partner is not a yes-machine.

### Phase 3: Sharpen & Ship

**Presenting the design:**
- Once direction is chosen, present the design in sections of 200-300 words
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, testing

**Produce a concrete "Not Doing" list** — this is arguably the most valuable part:

```markdown
## Not Doing (and Why)
- [Thing 1] — [reason]
- [Thing 2] — [reason]
- [Thing 3] — [reason]
```

Focus is about saying no to good ideas. Make the trade-offs explicit.

## After the Design

**Documentation:**
- Write the validated design to `docs/plans/YYYY-MM-DD-<topic>-design.md`
- Include: Problem Statement (HMW), Recommended Direction, Key Assumptions to Validate, MVP Scope, Not Doing list, Open Questions
- Commit the design document to git

**Implementation (if continuing):**
- Ask: "Ready to set up for implementation?"
- Use sk-claudecode:incremental-implementation for execution
- Use sk-claudecode:plan to create detailed implementation plan

## Anti-patterns to Avoid

- **Don't generate 20+ ideas** — 5-8 well-considered variations beat 20 shallow ones
- **Don't be a yes-machine** — Push back on weak ideas with specificity and kindness
- **Don't skip "who is this for"** — Every good idea starts with a person and their problem
- **Don't produce a plan without surfacing assumptions** — Untested assumptions kill ideas
- **Don't just list ideas — tell a story** — Each variation should have a reason it exists
- **Don't ignore the codebase** — Existing architecture is a constraint and an opportunity

## Key Principles

- **One question at a time** - Don't overwhelm with multiple questions
- **Multiple choice preferred** - Easier to answer than open-ended
- **YAGNI ruthlessly** - Remove unnecessary features from all designs
- **Explore alternatives** - Always propose 2-3 approaches before settling
- **Incremental validation** - Present design in sections, validate each
- **"How Might We" framing** - Restate problems as opportunities
- **"Not Doing" is essential** - Explicit trade-offs prevent scope creep

## Related Skills

- `plan` — Strategic planning with spec-driven foundation
- `incremental-implementation` — Executing the design incrementally
- `research` — Parallel research for tech evaluation

## Related Agents

- `architect` - Architecture analysis (Sonnet)
- `planner` - Planning specialist
- `critic` - Design critique
