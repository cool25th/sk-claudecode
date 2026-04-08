---
name: github-triage
description: Read-only GitHub issue and PR triage with evidence-backed analysis, structured reports, and zero GitHub mutations
---

# GitHub Triage

Read-only GitHub triage orchestrator. Analyzes open issues and PRs, classifies them by type, produces evidence-backed reports with GitHub permalinks, and generates a prioritized summary. **NEVER takes any action on GitHub** — no comments, no merges, no closes, no labels.

## When to Use

- Regular issue/PR backlog triage (weekly or bi-weekly)
- Onboarding to a new repository (understanding open issues landscape)
- Pre-sprint planning (prioritizing what to work on)
- When the user says "triage", "review open issues", "what needs attention"
- Stale issue cleanup assessment

## When NOT to Use

- When the user wants to actually respond to issues (that requires manual action)
- For repositories you don't have read access to
- When `gh` CLI is not installed or authenticated

## Zero-Action Policy (ABSOLUTE)

**FORBIDDEN** (non-exhaustive):
- `gh issue comment`, `gh issue close`, `gh issue edit`
- `gh pr comment`, `gh pr merge`, `gh pr review`, `gh pr edit`
- `gh api -X POST`, `gh api -X PUT`, `gh api -X PATCH`, `gh api -X DELETE`

**ALLOWED**:
- `gh issue view`, `gh issue list`, `gh pr view`, `gh pr list` — read GitHub data
- `gh api` (GET only) — read API data
- `grep`, file reads, `glob` — read codebase
- `git log`, `git show`, `git blame` — read git history
- Write report files to local directory ONLY

> **ANY GitHub mutation = CRITICAL violation.**

## Evidence Rule

Every factual claim in a report MUST include a GitHub permalink as proof.

### Permalink Format
```
https://github.com/{owner}/{repo}/blob/{commit_sha}/{path}#L{start}-L{end}
```

### Rules
- **No permalink = no claim.** If you cannot back a statement with a permalink, state "No evidence found"
- Claims without permalinks are marked `[UNVERIFIED]` and carry zero weight
- Permalinks MUST use commit SHAs, NOT branch names (branches are mutable)

### How to Generate Permalinks
1. Find the relevant file and line(s) via grep/read
2. Get the current commit SHA: `git rev-parse HEAD`
3. Construct: `https://github.com/{REPO}/blob/{SHA}/{filepath}#L{line}`

## Workflow

### Phase 0: Setup

```bash
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
REPORT_DIR="./triage-report-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$REPORT_DIR"
COMMIT_SHA=$(git rev-parse HEAD)
```

### Phase 1: Fetch Open Items

```bash
# Issues (basic metadata — avoid body/comments in bulk fetch to prevent JSON issues)
gh issue list --state open --limit 500 \
  --json number,title,labels,author,createdAt

# PRs
gh pr list --state open --limit 500 \
  --json number,title,labels,author,headRefName,baseRefName,isDraft,createdAt
```

### Phase 2: Classify

| Type | Detection Signals |
|------|-------------------|
| `ISSUE_QUESTION` | `[Question]`, `?`, "how to" / "why does" / "is it possible" |
| `ISSUE_BUG` | `[Bug]`, `Bug:`, error messages, stack traces, "unexpected behavior" |
| `ISSUE_FEATURE` | `[Feature]`, `[RFE]`, `Feature Request`, `Proposal` |
| `ISSUE_OTHER` | Anything else |
| `PR_BUGFIX` | Title starts with `fix`, branch contains `fix/`/`bugfix/`, label `bug` |
| `PR_OTHER` | Everything else |

### Phase 3: Analyze Each Item

For each item, fetch full details and produce a type-specific report.

#### ISSUE_QUESTION Report

```markdown
# Issue #{number}: {title}
**Type:** Question | **Author:** {author} | **Created:** {date}

## Question
[1-2 sentence summary]

## Findings
[Each finding with permalink proof]
- The config is parsed in [`src/config/loader.ts#L42-L58`](permalink)

## Suggested Answer
[Draft answer with code references and permalinks]

## Confidence: [HIGH | MEDIUM | LOW]
[Reason. If LOW: what's missing]

## Recommended Action
[What maintainer should do]
```

#### ISSUE_BUG Report

```markdown
# Issue #{number}: {title}
**Type:** Bug Report | **Author:** {author} | **Created:** {date}

## Bug Summary
**Expected:** [what user expects]
**Actual:** [what actually happens]
**Reproduction:** [steps if provided]

## Verdict: [CONFIRMED_BUG | NOT_A_BUG | ALREADY_FIXED | UNCLEAR]

## Analysis

### Evidence
[Each piece of evidence with permalink. No permalink = [UNVERIFIED]]

### Root Cause (if CONFIRMED_BUG)
[Which file, function, what goes wrong — with permalinks]

### Fix Details (if ALREADY_FIXED)
- **Fixed in commit:** [`{short_sha}`](https://github.com/{REPO}/commit/{full_sha})
- **Fixed date:** {date}
- **What changed:** [description]

## Severity: [LOW | MEDIUM | HIGH | CRITICAL]
## Suggested Fix (if CONFIRMED_BUG)
[Specific approach: "In {file}#L{N}, change X to Y because Z"]
```

**Finding "ALREADY_FIXED" commits:**
```bash
git log --all --oneline -- {file}                              # Recent file changes
git log --all --grep="fix" --grep="{keyword}" --all-match      # Commit message search
git blame {file}                                                # Last change per line
git show {commit_sha}                                           # Verify the fix
```

#### ISSUE_FEATURE Report

```markdown
# Issue #{number}: {title}
**Type:** Feature Request | **Author:** {author} | **Created:** {date}

## Request Summary
[What the user wants]

## Existing Implementation: [YES_FULLY | YES_PARTIALLY | NO]
[If exists: where, with permalinks]

## Feasibility: [EASY | MODERATE | HARD | ARCHITECTURAL_CHANGE]
## Relevant Files
[With permalinks]
## Recommended Action
```

#### PR Report

```markdown
# PR #{number}: {title}
**Type:** [Bugfix | Feature | Refactor | Docs] | **Author:** {author}
**Base:** {base} ← {head} | **Draft:** {isDraft}

## Summary
[2-3 sentences with permalinks to key changes]

## Merge Readiness

| Check | Status |
|-------|--------|
| CI | [PASS / FAIL / PENDING] |
| Review | [APPROVED / CHANGES_REQUESTED / PENDING / NONE] |
| Mergeable | [YES / NO / CONFLICTED] |
| Risk | [LOW / MEDIUM / HIGH] |

## Files Changed
[Count and key files]

## Recommended Action: [MERGE | REQUEST_CHANGES | NEEDS_REVIEW | WAIT]
```

### Phase 4: Generate Summary

Write to `{REPORT_DIR}/SUMMARY.md`:

```markdown
# GitHub Triage Report — {REPO}

**Date:** {date} | **Commit:** {SHA}
**Items Processed:** {total}

## Issues ({count})
| Category | Count |
|----------|-------|
| Bug Confirmed | N |
| Bug Already Fixed | N |
| Not A Bug | N |
| Question Analyzed | N |
| Feature Assessed | N |
| Other | N |

## PRs ({count})
| Category | Count |
|----------|-------|
| Bugfix | N |
| Feature / Other | N |

## Items Requiring Immediate Attention
[Each: number, title, verdict, 1-line summary]

## Stale Items (>30 days, no activity)
[List with age and recommendation]
```

## Red Flags

- Taking ANY action on GitHub (commenting, closing, merging, labeling)
- Making claims without permalink evidence
- Using branch names instead of commit SHAs in permalinks
- Guessing without codebase evidence
- Checking out PR branches (`git checkout`) — analyze via API only
- Summarizing without reading the actual issue/PR body

## Verification

After triage:
- [ ] Zero GitHub mutations made
- [ ] Every claim has a permalink or is marked `[UNVERIFIED]`
- [ ] All report files written to local directory
- [ ] Summary accurately reflects individual reports

## Related

- `/agent code-reviewer` — For detailed code review of specific PRs
- `skills/release` — For pre-release review workflows
- `skills/git-master` — For git conventions
