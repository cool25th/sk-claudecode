---
name: roadmap
description: Plan and prioritize product roadmaps using RICE, MoSCoW, ICE, and Value-vs-Effort frameworks. Use when creating a roadmap, reprioritizing features, mapping dependencies, estimating capacity, or presenting tradeoffs to stakeholders.
---

# Roadmap Management Skill

You are an expert at product roadmap planning, prioritization, and communication.

## Roadmap Formats

### Now / Next / Later
- **Now** (current sprint/month): Committed. High confidence in scope and timeline.
- **Next** (1-3 months): Planned. Good confidence in what, less in when.
- **Later** (3-6+ months): Directional. Strategic bets, flexible scope and timing.

Best for: Most teams, most of the time. Avoids false precision on dates.

### Quarterly Themes
- 2-3 themes per quarter (e.g., "Enterprise readiness", "Activation improvements")
- Initiatives listed under each theme
- Themes map to company/team OKRs

Best for: Showing strategic alignment. Executive communication.

### OKR-Aligned Roadmap
- Start with team OKRs → list initiatives per Key Result
- Include expected impact of each initiative on the KR
- Creates clear accountability: building → measuring

Best for: Organizations that run on OKRs.

---

## Prioritization Frameworks

### RICE Score
**RICE = (Reach × Impact × Confidence) / Effort**

| Dimension | How to measure |
|-----------|---------------|
| Reach | Users/customers affected in a time period (concrete numbers) |
| Impact | 3=massive, 2=high, 1=medium, 0.5=low, 0.25=minimal |
| Confidence | 100%=data-backed, 80%=some evidence, 50%=gut feel |
| Effort | Person-months (engineering + design + others) |

### ICE Score (Simpler)
**ICE = Impact × Confidence × Ease** (each 1-10)

### MoSCoW
- **Must**: Non-negotiable for this period
- **Should**: Important, not critical for launch
- **Could**: Only if capacity allows
- **Won't**: Explicitly out of scope (document for clarity)

### Value vs Effort Matrix (2×2)
| | Low Effort | High Effort |
|--|-----------|-------------|
| **High Value** | ✅ Quick wins (do first) | 🎯 Big bets (plan carefully) |
| **Low Value** | 📋 Fill-ins (spare capacity) | ❌ Money pits (don't do) |

---

## Dependency Mapping

### Types
- **Technical**: Feature B requires infrastructure from Feature A
- **Team**: Requires work from another team (design, platform, data)
- **External**: Vendor, partner, third-party integration
- **Knowledge**: Needs research/investigation results first
- **Sequential**: Must ship A before starting B

### Managing Dependencies
- List all dependencies explicitly with owner + "need by" date
- Build buffer around dependencies (highest risk items)
- Flag cross-team dependencies early
- **Contingency plan**: What if the dependency slips?

### Reducing Dependencies
- Build simpler version avoiding the dependency
- Parallelize with interface contracts or mocks
- Sequence differently to move dependency earlier
- Absorb work into your team when possible

---

## Capacity Planning

### Estimating
- Start with engineers × time period
- Subtract overhead: meetings, on-call, interviews, PTO
- Rule of thumb: 60-70% of time on planned feature work

### Healthy Allocation
- **70%** planned features (strategic roadmap items)
- **20%** technical health (tech debt, reliability, DX)
- **10%** unplanned (buffer for urgent issues, quick wins)

Adjust by context:
- New product → more features, less tech debt
- Mature product → more tech debt, reliability
- Post-incident → more reliability, fewer features

### Capacity vs Ambition
- If commitments exceed capacity, **cut scope** (don't pretend people can do more)
- When adding to roadmap, always ask: "What comes off?"
- Better to commit to fewer things and deliver reliably

---

## Communicating Roadmap Changes

### How to Communicate
1. Acknowledge the change directly
2. Explain the reason (what new information drove this)
3. Show the tradeoff (what was deprioritized)
4. Show the new plan
5. Acknowledge impact on stakeholders

### Avoiding Roadmap Whiplash
- Don't change for every piece of new information — have a threshold
- Batch updates at natural cadences (monthly, quarterly) unless urgent
- Track how often roadmap changes. Frequent changes may signal unclear strategy
