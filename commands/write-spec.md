---
description: "[Think] Write a structured PRD / feature specification"
---

# /plan:write-spec

## Category: 🧠 Think — Plan before you build

Write a structured Product Requirements Document (PRD) with problem statement, user stories, requirements (MoSCoW), acceptance criteria, and success metrics.

## Workflow

```
Think → Build → Check

@planner "/plan:write-spec — Design the authentication feature"
  ↓ (produces PRD)
@executor "Implement the spec from PRD.md"
  ↓ (produces code)
@code-reviewer "Review implementation against the PRD"
```

## What This Command Does

1. **Asks** clarifying questions about the feature scope
2. **Generates** a structured PRD with:
   - Problem statement grounded in evidence
   - Goals (outcome-based, not output-based)
   - Non-goals (explicit scope boundaries)
   - User stories (INVEST format)
   - Requirements (Must/Should/Could/Won't)
   - Acceptance criteria (Given/When/Then)
   - Success metrics (leading + lagging indicators)
   - Open questions tagged by owner
3. **Outputs** a markdown document ready for stakeholder review

## Skills Used
- `product-management` — PRD structure, user stories, metrics
- `roadmap` — Prioritization frameworks (RICE, MoSCoW, ICE)

## Usage Examples

```bash
# Basic spec
@planner "/plan:write-spec — User authentication with OAuth2 and JWT"

# Detailed with constraints
@planner "/plan:write-spec — Real-time notifications. Target: mobile users. Must integrate with existing WebSocket infrastructure. Ship by Q2."

# From user research
@planner "/plan:write-spec — Based on these interview notes, spec the dashboard redesign: [paste notes]"
```

## Mode Guide

| Mode | How to use |
|------|-----------|
| **Think** | `@planner` or `@architect` — Generate and refine the spec |
| **Build** | `@executor` or `@ultra-executor` — Implement from the spec |
| **Check** | `@code-reviewer` or `@critic` — Validate implementation against spec |
