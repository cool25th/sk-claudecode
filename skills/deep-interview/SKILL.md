---
name: deep-interview
description: "Socratic requirement extraction through systematic questioning. Use when the user has a vague idea, unclear requirements, or wants to explore a problem before coding. Triggers: 'deep interview', 'clarify requirements', 'what should I build', 'help me think through', '요구사항 정리', '뭘 만들어야 할지', '인터뷰'"
---

# Deep Interview — Socratic Requirement Extraction

Use this skill when a user has a vague or incomplete idea and needs structured thinking before any code is written.

## When to Use

- User says "I want to build..." but details are unclear
- Requirements are ambiguous or contradictory
- Scope is undefined ("make it good", "something like X")
- User is exploring possibilities, not yet committed to a design
- Before creating a plan or PRD

## Process

### Phase 1: Understanding (3-5 questions)

Ask clarifying questions that expose **hidden assumptions**:

```
1. "What problem are you actually trying to solve?"
   → Exposes: User might describe a solution, not the problem

2. "Who will use this? Walk me through their workflow."
   → Exposes: Missing user personas, edge cases

3. "What's the simplest version that would still be useful?"
   → Exposes: Scope creep, MVP boundaries

4. "What existing tools/systems does this need to work with?"
   → Exposes: Integration requirements, constraints

5. "What would make this project a failure?"
   → Exposes: Non-obvious success criteria, dealbreakers
```

### Phase 2: Disambiguation (2-3 questions)

Resolve contradictions and fill gaps:

```
- "You mentioned X and Y — those seem to conflict. Which takes priority?"
- "How should this handle [edge case derived from Phase 1]?"
- "When you say 'fast', what's the actual latency target?"
```

### Phase 3: Clarity Score

Rate the clarity across 5 dimensions (1-5 scale):

```
## Clarity Assessment

| Dimension       | Score | Notes |
|----------------|-------|-------|
| Problem        | 4/5   | Clear problem, one edge case unclear |
| Users          | 3/5   | Primary user clear, admin flow undefined |
| Scope          | 2/5   | MVP not yet bounded |
| Constraints    | 5/5   | Tech stack and integrations well-defined |
| Success Criteria | 3/5 | Partial — needs measurable targets |

**Overall Clarity: 3.4/5** — Not ready for planning yet.
```

### Phase 4: Extracted Requirements Document

When clarity ≥ 4.0/5, produce a structured output:

```markdown
## Requirements Summary

### Problem Statement
[One paragraph describing the actual problem]

### User Stories
1. As a [persona], I want [action] so that [value]
2. ...

### Scope (MVP)
**In Scope:**
- Feature A
- Feature B

**Out of Scope (Future):**
- Feature C
- Feature D

### Technical Constraints
- Must integrate with [X]
- Performance target: [Y]
- Data format: [Z]

### Success Criteria
- [ ] Criterion 1 (measurable)
- [ ] Criterion 2 (measurable)

### Open Questions (for user)
1. [Unresolved question]
2. [Decision needed]
```

## Critical Rules

1. **NEVER start coding** during a deep interview. Output is a document, not code.
2. **Ask ONE question at a time** when possible — don't overwhelm.
3. **Reflect back** — Restate what you understood before asking the next question.
4. **Challenge weak answers** — "That's interesting, but what happens when [edge case]?"
5. **Quantify vagueness** — If user says "fast", ask "under 100ms fast or under 1s fast?"
6. **Know when to stop** — Once clarity ≥ 4.0, hand off to planner.

## Handoff

When the interview is complete:
- Save the requirements document to `.skc/interviews/{topic}.md`
- Recommend: "Requirements are clear. Ready for `/agent planner` to create a work plan."
- If still unclear: "Clarity is 2.8/5. Let's resolve [specific questions] before planning."

## Anti-Patterns to Watch For

| User Says | Hidden Problem | Ask Instead |
|-----------|---------------|-------------|
| "Make it like X" | Undefined scope | "Which specific features of X do you need?" |
| "It should be fast" | No performance target | "What response time would users notice?" |
| "Add a dashboard" | Feature without purpose | "What decisions will users make from this dashboard?" |
| "Use microservices" | Solution before problem | "What scaling challenges are you anticipating?" |
| "Make it production-ready" | Undefined quality bar | "What's the expected traffic/user count?" |
