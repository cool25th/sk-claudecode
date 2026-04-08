---
name: pr-workflow
description: Full PR lifecycle — worktree isolation, implementation, PR creation, multi-gate verification loop, and merge with cleanup
---

# PR Workflow

Complete PR lifecycle from isolated workspace setup through implementation, PR creation, and an unbounded verification loop until the PR passes all gates and is merged. Designed for safe, conflict-free development that never pollutes the user's working directory.

## When to Use

- Implementing features/fixes that need PR review before merging
- When the user says "create a PR", "implement and PR", "land this as a PR"
- Multi-file changes that benefit from isolated development
- Contributing to repositories with CI/review requirements
- Any work that should go through a review process before landing

## When NOT to Use

- Quick single-file fixes that can be committed directly
- When the user explicitly wants to commit to main/dev directly
- Repositories without PR review culture
- Draft/experimental work not ready for review

## Prerequisites

- [ ] **`gh` CLI** installed and authenticated
- [ ] **Git** initialized with a remote
- [ ] **Clean working directory** (or understanding that worktree isolates changes)
- [ ] **CI pipeline** configured (for Gate A verification)

## Workflow

### Phase 0: Setup — Isolated Worktree

Create an isolated worktree so the user's main working directory stays clean. This is critical because the user may have uncommitted work.

```bash
# 1. Resolve context
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
REPO_NAME=$(basename "$PWD")
BASE_BRANCH="main"  # or "dev", "master" — check repo convention
ORIGINAL_DIR="$PWD"

# 2. Create branch
BRANCH_NAME="feature/short-description"  # or fix/, refactor/, docs/
git fetch origin "$BASE_BRANCH"
git branch "$BRANCH_NAME" "origin/$BASE_BRANCH"

# 3. Create worktree (sibling directory — NOT inside repo)
WORKTREE_PATH="../${REPO_NAME}-wt/${BRANCH_NAME}"
mkdir -p "$(dirname "$WORKTREE_PATH")"
git worktree add "$WORKTREE_PATH" "$BRANCH_NAME"

# 4. Install dependencies in worktree
cd "$WORKTREE_PATH"
[ -f "package-lock.json" ] && npm install
[ -f "bun.lock" ] && bun install
[ -f "requirements.txt" ] && pip install -r requirements.txt
```

> **Why worktrees?** They share the same `.git` directory but have independent working trees. The user's main checkout remains untouched.

### Phase 1: Implement

Do the actual work inside the worktree.

#### Commit Strategy (Atomic Commits)

```
3+ files changed  → 2+ commits minimum
5+ files changed  → 3+ commits minimum
10+ files changed → 5+ commits minimum
```

Each commit should be a logical unit: pair implementation with its tests.

#### Scope Discipline

- For bug fixes: Fix the bug, add a test. **Nothing else.**
- For features: Implement the feature, add tests. **Don't refactor "while you're here."**
- The verification loop will catch regressions — trust the process.

#### Pre-Push Local Validation

Before pushing, run the same checks CI will run:

```bash
# Language-appropriate checks
npm run typecheck && npm test && npm run build  # Node
go vet ./... && go test ./...                   # Go
pytest && mypy .                                # Python
```

Fix any failures before pushing. Each fix should be its own atomic commit.

### Phase 2: PR Creation

```bash
git push -u origin "$BRANCH_NAME"

gh pr create \
  --base "$BASE_BRANCH" \
  --head "$BRANCH_NAME" \
  --title "$PR_TITLE" \
  --body "## Summary
[1-3 sentences describing what this PR does and why]

## Changes
[Bullet list of key changes]

## Testing
- Typecheck: ✅
- Tests: ✅
- Build: ✅

## Related Issues
[Link to issue if applicable]"

PR_NUMBER=$(gh pr view --json number -q .number)
```

### Phase 3: Verification Loop (Unbounded)

Three gates must ALL pass. The loop continues until done — no iteration cap.

```
while true:
  1. Wait for CI          → Gate A
  2. If CI fails          → read logs, fix, commit, push, restart loop
  3. Run code review      → Gate B
  4. If review has issues → fix blocking issues, commit, push, restart loop
  5. All gates pass       → break
```

#### Gate A: CI Checks

```bash
# Wait for checks to complete
gh pr checks "$PR_NUMBER" --watch --fail-fast

# On failure — get logs:
RUN_ID=$(gh run list --branch "$BRANCH_NAME" --status failure \
  --json databaseId --jq '.[0].databaseId')
gh run view "$RUN_ID" --log-failed
```

Read the logs, fix the issue, commit atomically, push, restart from Gate A.

#### Gate B: Code Review

After CI passes, perform a thorough review:

```
Use /agent code-reviewer or /agent critic to review the PR changes.

Review checklist:
- [ ] Correctness: Does the code do what it claims?
- [ ] Edge cases: Empty inputs, null values, concurrent access
- [ ] Error handling: No swallowed errors, proper propagation
- [ ] Pattern adherence: Follows existing codebase conventions
- [ ] Test coverage: Are behavioral changes tested?
- [ ] Breaking changes: Any public API impact?
```

If blocking issues are found: fix each issue, commit, push, restart from Gate A (since code changed, CI must re-run).

#### Iteration Discipline

Each iteration:
1. Fix ONLY the issues identified by the failing gate
2. Commit atomically (one logical fix per commit)
3. Push
4. Restart from Gate A (code changed → full re-verification)

**Avoid scope creep** during fix iterations. Improving unrelated code makes debugging harder.

### Phase 4: Merge & Cleanup

Once all gates pass:

```bash
# Merge (squash keeps history clean)
gh pr merge "$PR_NUMBER" --squash --delete-branch

# Return to original directory
cd "$ORIGINAL_DIR"

# Sync any local state from worktree before removal
# (e.g., notes, task files, etc.)

# Clean up worktree
git worktree remove "$WORKTREE_PATH"
git worktree prune

# Pull the merged changes
git pull --rebase
```

#### Completion Report

```markdown
## PR Merged ✅

- **PR**: #{PR_NUMBER} — {PR_TITLE}
- **Branch**: {BRANCH_NAME} → {BASE_BRANCH}
- **Iterations**: N verification loops
- **Gates passed**: CI ✅ | Review ✅
- **Worktree**: cleaned up
```

## Failure Recovery

If you hit an unrecoverable error (merge conflict, infrastructure failure):

1. **Do NOT delete the worktree** — the user may want to inspect or resume manually
2. Report what happened, what was attempted, and where things stand
3. Include the worktree path so the user can resume

For merge conflicts:
```bash
cd "$WORKTREE_PATH"
git fetch origin "$BASE_BRANCH"
git rebase "origin/$BASE_BRANCH"
# Resolve conflicts, then continue the loop
```

## Red Flags

- Working in main worktree instead of isolated worktree (pollutes user's directory)
- Pushing directly to main/dev (bypasses review)
- Skipping CI gate after code changes
- Using `git add -A` or `git add .` without checking what's staged
- Fixing unrelated code during the verification loop (scope creep)
- Deleting the worktree on failure (loses user's ability to inspect/resume)
- Giant single commits (harder to isolate failures)
- Not running local checks before push (wastes CI time)

## Verification

After PR is merged:
- [ ] All CI checks passed on final push
- [ ] Code review had no blocking issues
- [ ] Worktree removed and pruned
- [ ] Main branch has the merged changes
- [ ] No dangling branches

## Related

- `skills/git-master` — For commit conventions and git best practices
- `skills/release` — For release workflow after PRs are merged
- `skills/code-review` — For the review gate methodology
- `/agent code-reviewer` — For automated code review
