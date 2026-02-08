---
name: stakeholder-comms
description: Draft stakeholder updates, status reports, decision documentation, and meeting facilitation guides. Use when writing weekly updates, monthly reports, launch announcements, risk communications, ADRs, or preparing for sprint planning and retros.
---

# Stakeholder Communications Skill

You are an expert at product and engineering communications — status updates, risk communication, decision documentation, and meeting facilitation.

## Update Templates by Audience

### Executive / Leadership
```
Status: [Green / Yellow / Red]
TL;DR: [One sentence — the most important thing to know]

Progress:
- [Outcome achieved, tied to goal/OKR]
- [Key metric movement]

Risks:
- [Risk]: [Mitigation]. [Ask if needed].

Decisions needed:
- [Decision]: [Options with recommendation]. Need by [date].

Next milestones:
- [Milestone] — [Date]
```

**Tips**: Lead with conclusion, not the journey. Under 200 words. Status color = your genuine assessment. Only include risks you want help with. Asks must be specific.

### Engineering Team
```
Shipped:
- [Feature/fix] — [Link]. [Impact if notable].

In progress:
- [Item] — [Owner]. [Expected completion]. [Blockers].

Decisions:
- [Decided]: [Rationale]. [Link to ADR].
- [Needed]: [Context]. [Options]. [Recommendation].

Priority changes:
- [What changed and why]

Coming up:
- [Next items] — [Context on why]
```

**Tips**: Link to specific tickets and PRs. Explain priority changes. Be explicit about blockers.

### Cross-Functional Partners
```
What's coming:
- [Feature/launch] — [Date]. [What this means for your team].

What we need from you:
- [Specific ask] — [Context]. By [date].

Decisions made:
- [Decision] — [How it affects your team].
```

### Customer / External
```
What's new:
- [Feature] — [Benefit in customer terms]. [How to use it].

Coming soon:
- [Feature] — [Expected timing]. [Why it matters].

Known issues:
- [Issue] — [Status]. [Workaround if available].
```

**Tips**: No internal jargon. Frame in terms of what customer can DO. Be honest about timelines.

---

## Status Reporting

### Green / Yellow / Red

| Status | Meaning | When to use |
|--------|---------|------------|
| 🟢 Green | On track, no significant risks | Things genuinely going well |
| 🟡 Yellow | At risk, mitigation underway | FIRST sign of risk (early = more options) |
| 🔴 Red | Off track, needs intervention | Exhausted own options, need escalation |

- Move to Yellow at FIRST sign of risk, not when sure things are bad
- Move back to Green only when risk is genuinely resolved
- Document what changed when status changes

---

## Risk Communication (ROAM)

| Status | Meaning |
|--------|---------|
| **R**esolved | No longer a concern |
| **O**wned | Someone actively managing it |
| **A**ccepted | Known, choosing to proceed without mitigation |
| **M**itigated | Actions reduced risk to acceptable level |

### Communicating Risks
1. State risk clearly: "There is a risk that [thing] happens because [reason]"
2. Quantify impact: "If this happens, the consequence is [impact]"
3. State likelihood: "[likely/possible/unlikely] because [evidence]"
4. Present mitigation: "We are managing this by [actions]"
5. Make the ask: "We need [specific help]"

**Common mistakes**: Burying risks in good news. Being vague. No mitigations. Waiting too long.

---

## Decision Documentation (ADR)

```markdown
# [Decision Title]

## Status
[Proposed / Accepted / Deprecated / Superseded by ADR-XXX]

## Context
What situation requires a decision? What forces are at play?

## Decision
What did we decide? State clearly and directly.

## Consequences
- Positive consequences
- Negative consequences / tradeoffs accepted
- What this enables or prevents in the future

## Alternatives Considered
For each: what was it, why was it rejected?
```

**When to write**: Strategic decisions, significant technical choices, controversial decisions, decisions that constrain future options.

---

## Meeting Facilitation

### Stand-up (15 min)
Each person: accomplished → working on → blockers.
Focus on blockers — highest-value part. Cancel if nothing to sync.

### Sprint Planning
1. Review: what shipped, carried over, was cut
2. Priorities: most important this sprint
3. Capacity: account for PTO, on-call, meetings
4. Commitment: select items from backlog
5. Dependencies: flag cross-team needs

**Tip**: Come with proposed priority order. Push back on overcommitment.

### Retrospective
1. Set the stage (psychological safety)
2. Gather data: went well / didn't / confusing
3. Generate insights: patterns, root causes
4. Decide actions: pick 1-3 improvements
5. Close: thank for honest feedback

**Key**: Follow up on previous retro items. If you never follow up, people stop engaging.

### Stakeholder Demo
1. Context (goal + what they saw last time)
2. Demo real product (not slides)
3. Early metrics/feedback
4. Structured feedback collection
5. Next steps + next review date

---

## Related Agents

- `writer` - Technical writing (Sonnet)
