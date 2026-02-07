---
description: "[Think] Plan and prioritize a product roadmap"
---

# /plan:roadmap

## Category: 🧠 Think — Plan before you build

Create or update a product roadmap with prioritization frameworks, dependency mapping, capacity planning, and stakeholder communication templates.

## Workflow

```
Think → Build → Check

@planner "/plan:roadmap — Plan Q2 features for the platform"
  ↓ (produces prioritized roadmap)
@executor "Implement the top-priority items from ROADMAP.md"
  ↓ (produces code)
@critic "Review the roadmap for gaps and risks"
```

## What This Command Does

1. **Gathers** current priorities, constraints, and team capacity
2. **Applies** prioritization framework:
   - **RICE**: (Reach × Impact × Confidence) / Effort
   - **ICE**: Impact × Confidence × Ease
   - **MoSCoW**: Must / Should / Could / Won't
   - **Value vs Effort**: 2×2 matrix (Quick wins → Big bets → Fill-ins → Money pits)
3. **Maps** dependencies (technical, team, external, knowledge, sequential)
4. **Estimates** capacity (70% features / 20% tech health / 10% buffer)
5. **Outputs** a structured roadmap in chosen format:
   - Now / Next / Later
   - Quarterly Themes
   - OKR-Aligned

## Skills Used
- `roadmap` — Prioritization, dependency mapping, capacity planning
- `product-management` — OKRs, metrics targets

## Usage Examples

```bash
# Create new roadmap
@planner "/plan:roadmap — Plan features for next quarter. Team: 4 engineers, 1 designer."

# Reprioritize
@planner "/plan:roadmap — Reprioritize backlog using RICE scoring. New constraint: launch must happen by March."

# Dependency analysis
@planner "/plan:roadmap — Map dependencies for the microservices migration. 3 teams involved."
```

## Mode Guide

| Mode | How to use |
|------|-----------|
| **Think** | `@planner` — Create/update roadmap, run prioritization |
| **Build** | `@executor` — Implement roadmap items |
| **Check** | `@critic` — Review roadmap for gaps, risks, feasibility |
| **Help** | `@writer` — Generate stakeholder update from roadmap changes |
