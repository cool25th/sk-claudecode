---
name: visual-verdict
description: Structured visual QA verdict for UI fidelity checks with deterministic JSON output
---

# Visual Verdict

Structured visual QA skill that renders a deterministic pass/fail judgment on UI fidelity. Use this after any UI implementation or modification to verify visual accuracy against specifications.

## When to Use

- After implementing or modifying UI components
- When reviewing visual fidelity against a mockup/spec/screenshot
- When the user says "visual check", "UI review", "screenshot verdict", or "does this match"
- When validating responsive layout changes across breakpoints
- After CSS/styling refactors to confirm no visual regressions

## When NOT to Use

- For functional testing (use `qa-tester` agent instead)
- For accessibility audits (use `references/accessibility-checklist.md` instead)
- For performance measurement (use `performance-optimization` skill instead)
- When no visual reference exists to compare against

## Workflow

### Phase 1: Capture

1. **Identify the target**: Which page/component/screen needs visual QA
2. **Establish reference**: What is the expected visual state (mockup, spec, previous screenshot, verbal description)
3. **Capture current state**: Take screenshot or examine current rendering

### Phase 2: Evaluate

Run through the Visual Fidelity Checklist:

| Dimension | Check | Weight |
|-----------|-------|--------|
| **Layout** | Element positioning, spacing, alignment, grid structure | 25% |
| **Typography** | Font family, size, weight, line-height, color, hierarchy | 20% |
| **Colors** | Background, text, borders, gradients, opacity | 15% |
| **Spacing** | Margins, paddings, gaps between elements | 15% |
| **Responsive** | Breakpoint behavior, overflow handling, viewport adaptation | 10% |
| **Interactive States** | Hover, focus, active, disabled states | 10% |
| **Assets** | Icons, images, illustrations, correct rendering | 5% |

### Phase 3: Verdict

Produce a structured verdict:

```json
{
  "verdict": "PASS | PARTIAL_PASS | FAIL",
  "score": 0-100,
  "summary": "one-line assessment",
  "dimensions": {
    "layout": { "score": 0-100, "issues": [] },
    "typography": { "score": 0-100, "issues": [] },
    "colors": { "score": 0-100, "issues": [] },
    "spacing": { "score": 0-100, "issues": [] },
    "responsive": { "score": 0-100, "issues": [] },
    "interactive_states": { "score": 0-100, "issues": [] },
    "assets": { "score": 0-100, "issues": [] }
  },
  "critical_issues": [],
  "recommendations": []
}
```

### Verdict Thresholds

| Verdict | Score Range | Meaning |
|---------|------------|---------|
| **PASS** | 90-100 | Production-ready. No significant visual discrepancies. |
| **PARTIAL_PASS** | 60-89 | Acceptable with noted issues. Minor visual discrepancies that don't block release. |
| **FAIL** | 0-59 | Not acceptable. Significant visual deviations that require correction. |

## Evidence Requirements

Every issue MUST include:
- **What**: Specific element affected (CSS selector or component name)
- **Expected**: What it should look like
- **Actual**: What it currently looks like
- **Evidence**: File path and line number when applicable
- **Severity**: CRITICAL / MAJOR / MINOR

## Red Flags

- Claiming PASS without examining all 7 dimensions
- Issuing verdict without comparing against a reference
- Reporting "looks good" without structured evidence
- Ignoring responsive behavior in a responsive design
- Missing hover/focus states in interactive components

## Verification

After verdict:
- [ ] All 7 dimensions scored
- [ ] Every critical issue has file:line evidence
- [ ] Verdict threshold matches calculated score
- [ ] Recommendations are actionable (not "make it better")
- [ ] Screenshots or visual evidence attached when available

## Related

- `/agent vision` — For screenshot capture and visual analysis
- `/agent designer-reviewer` — For design system compliance
- `skills/references/accessibility-checklist.md` — For a11y verification
