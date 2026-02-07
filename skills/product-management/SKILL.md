---
name: product-management
description: Write structured PRDs, feature specs, user stories, and acceptance criteria. Use when speccing a feature, writing a PRD, defining requirements, setting success metrics, or documenting product decisions. Combines feature-spec, metrics-tracking, user-research-synthesis, and competitive-analysis.
---

# Product Management Skill

You are an expert product manager who helps write specifications, analyze metrics, synthesize research, and evaluate competitive positioning.

## PRD Structure

### 1. Problem Statement
- Describe the user problem in 2-3 sentences
- Who experiences this problem and how often
- What is the cost of not solving it (user pain, business impact, competitive risk)
- Ground in evidence: user research, support data, metrics, customer feedback

### 2. Goals
- 3-5 specific, measurable outcomes this feature should achieve
- Each goal answers: "How will we know this succeeded?"
- Distinguish user goals (what users get) from business goals (what the company gets)
- Goals should be outcomes, not outputs ("reduce time to first value by 50%" not "build onboarding wizard")

### 3. Non-Goals
- 3-5 things this feature explicitly will NOT do
- Adjacent capabilities that are out of scope for this version
- Briefly explain why each is out of scope

### 4. User Stories
Format: "As a [user type], I want [capability] so that [benefit]"

**Good stories are** (INVEST):
- **I**ndependent — deliverable on their own
- **N**egotiable — details can be discussed
- **V**aluable — delivers user value
- **E**stimable — team can roughly estimate effort
- **S**mall — completable in one sprint
- **T**estable — clear way to verify

**Common mistakes**:
- Too vague: "As a user, I want the product to be faster"
- Solution-prescriptive: "I want a dropdown menu" — describe the need, not the widget
- No benefit: "I want to click a button" — why?
- Internal focus: "As the engineering team, we want to refactor" — task, not user story

### 5. Requirements (MoSCoW)
- **Must have (P0)**: Feature cannot ship without these
- **Should have (P1)**: Important but not critical for launch
- **Could have (P2)**: Desirable if time permits
- **Won't have (this time)**: Explicitly out of scope

> If everything is P0, nothing is P0. Challenge every must-have.

### 6. Acceptance Criteria
Given/When/Then format:
```
Given [precondition or context]
When [action the user takes]
Then [expected outcome]
```

Or checklist format:
- [ ] Admin can configure SSO in organization settings
- [ ] Failed SSO attempts show clear error message
- [ ] SSO login creates new account if one does not exist

### 7. Success Metrics

**Leading indicators** (days-weeks):
- Adoption rate, activation rate, task completion rate
- Time to complete, error rate, usage frequency

**Lagging indicators** (weeks-months):
- Retention impact, revenue impact, NPS change
- Support ticket reduction, competitive win rate

**Setting targets**:
- Specific: "50% adoption within 30 days" not "high adoption"
- Base on benchmarks, comparable features, or explicit hypotheses
- Set "commit" (high confidence) + "stretch" (ambitious) targets
- Define measurement method, tool, time window

### 8. Open Questions
- Tag each with who should answer (engineering, design, legal, data)
- Distinguish blocking (must answer before starting) vs non-blocking

### 9. Timeline Considerations
- Hard deadlines, dependencies on other teams
- Suggested phasing if feature is too large for one release

---

## OKR Framework

**Objectives**: Qualitative, aspirational, time-bound goals
**Key Results**: Quantitative measures (2-4 per Objective)

```
Objective: Make our product indispensable for daily workflows

Key Results:
- Increase DAU/MAU ratio from 0.35 to 0.50
- Increase D30 retention for new users from 40% to 55%
- 3 core workflows with >80% task completion rate
```

**Best practices**:
- 70% completion is the target for stretch OKRs
- KRs measure outcomes (user behavior), not outputs (features shipped)
- 2-3 objectives with 2-4 KRs each maximum
- Grade honestly: 0.0-0.3 missed, 0.4-0.6 progress, 0.7-1.0 achieved

---

## Product Metrics Hierarchy

### North Star Metric
Single metric capturing core value. Must be:
- Value-aligned, leading, actionable, understandable

### L1 Metrics (Health Indicators)
| Stage | Key Metrics |
|-------|------------|
| Acquisition | New signups, conversion rate, channel mix |
| Activation | Activation rate, time to activate, setup completion |
| Engagement | DAU/WAU/MAU, stickiness (DAU/MAU), feature adoption |
| Retention | D1/D7/D30 retention, cohort curves, churn rate |
| Monetization | Free→paid conversion, MRR/ARR, ARPU, net revenue retention |
| Satisfaction | NPS, CSAT, support volume |

### L2 Metrics (Diagnostic)
Funnel conversion, feature-level usage, segment breakdowns, performance metrics

---

## Competitive Analysis

### Competitive Set
- **Direct**: Same problem, same approach
- **Indirect**: Same problem, different approach
- **Adjacent**: Could expand into your space
- **Substitutes**: Entirely different solutions (manual, general-purpose tools)

### Feature Comparison Matrix
```
| Capability  | Us     | Comp A  | Comp B |
|-------------|--------|---------|--------|
| Feature 1   | Strong | Adequate| Absent |
| Feature 2   | Adequate| Strong | Weak   |
```

Rating: Strong → Adequate → Weak → Absent

### Positioning Analysis
Template: For [target customer] who [need], [Product] is a [category] that [key benefit]. Unlike [alternative], [Product] [key differentiator].

---

## User Research Synthesis

### Thematic Analysis
1. Familiarization → 2. Initial coding → 3. Theme development → 4. Theme review → 5. Theme refinement → 6. Report

### Interview Notes
Extract:
- **Observations**: Behaviors vs attitudes, workarounds (unmet needs)
- **Direct quotes**: Specific and vivid, attributed to type not name
- **Signals of intensity**: Emotional language, frequency, impact

### Qual-Quant Feedback Loop
1. **Qualitative first**: Reveals WHAT and WHY, generates hypotheses
2. **Quantitative validation**: Reveals HOW MUCH and HOW MANY
3. **Qualitative deep-dive**: Explains unexpected quantitative findings

### Persona Template
```
[Name] — [One-line description]
Who: Role, company type/size
Goals: Primary jobs to be done
Usage: Frequency, key workflows, adjacent tools
Pain points: Top 3 frustrations, workarounds
Values: What matters most, what would cause churn
Quotes: 2-3 representative verbatim quotes
```

---

## Scope Management

### Recognizing Scope Creep
- Requirements added after spec approved
- "Small" additions accumulating
- Building features no user asked for ("while we're at it...")
- Launch date keeps moving without re-scoping

### Preventing Scope Creep
- Write explicit non-goals in every spec
- Any scope addition requires a scope removal or timeline extension
- Separate v1 from v2 clearly
- Time-box investigations: "If we can't figure out X in 2 days, cut it"
- Create a "parking lot" for good ideas not in scope
