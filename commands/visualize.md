---
description: "[Build] Create data visualizations with proper chart selection"
---

# /scientist:visualize

## Category: ⚡ Build — Write and implement

Create data visualizations with automatic chart type selection, styling, and data-to-insight storytelling.

## Workflow

```
Think → Build → Check

@scientist-high "Plan the analysis for quarterly revenue trends"
  ↓ (produces methodology)
@scientist "/scientist:visualize — Revenue trends by region, quarterly"
  ↓ (produces visualization code)
@scientist-reviewer "Validate the visualization accuracy and statistical claims"
```

## What This Command Does

1. **Analyzes** the data type and question
2. **Selects** the optimal chart type:
   - Time series → Line chart
   - Comparison → Bar chart (horizontal for many categories)
   - Distribution → Histogram / Box plot
   - Composition → Stacked bar / Pie (≤5 categories only)
   - Correlation → Scatter plot
   - Funnel → Funnel chart
   - Geographic → Map / Choropleth
3. **Generates** visualization code (Python matplotlib/plotly, or JS Chart.js/D3)
4. **Applies** best practices:
   - Clear title and axis labels
   - Proper color palette (colorblind-safe)
   - No chart junk (3D effects, excessive gridlines)
   - Data-ink ratio maximized

## Skills Used
- `product-management` — Dashboard design principles, metrics hierarchy

## Usage Examples

```bash
# Quick chart
@scientist "/scientist:visualize — Bar chart of monthly active users by platform"

# Dashboard
@scientist "/scientist:visualize — Create a metrics dashboard: DAU/MAU, retention curve, conversion funnel"

# With data
@scientist "/scientist:visualize — Plot the correlation between session length and purchase probability from this CSV: [paste data]"
```

## Mode Guide

| Mode | How to use |
|------|-----------|
| **Think** | `@scientist-high` — Plan analysis approach and metrics |
| **Build** | `@scientist` — Generate visualization code |
| **Check** | `@scientist-reviewer` — Validate accuracy and methodology |
