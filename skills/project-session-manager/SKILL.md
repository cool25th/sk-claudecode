---
name: project-session-manager
description: Manage isolated dev environments with git worktrees and tmux sessions
---


# Project Session Manager (PSM) Skill

> **Quick Start:** For simple worktree creation without tmux sessions, use `skc teleport`:
> ```bash
> skc teleport #123          # Create worktree for issue/PR
> skc teleport my-feature    # Create worktree for feature
> skc teleport list          # List worktrees
> ```
> See [Teleport Command](#teleport-command) below for details.

Automate isolated development environments using git worktrees and tmux sessions with Claude Code. Enables parallel work across multiple tasks, projects, and repositories.

## Commands

| Command | Description | Example |
|---------|-------------|---------|
| `review <ref>` | PR review session | `/psm review skc#123` |
| `fix <ref>` | Issue fix session | `/psm fix skc#42` |
| `feature <proj> <name>` | Feature development | `/psm feature omc add-webhooks` |
| `list [project]` | List active sessions | `/psm list` |
| `attach <session>` | Attach to session | `/psm attach skc:pr-123` |
| `kill <session>` | Kill session | `/psm kill skc:pr-123` |
| `cleanup` | Clean merged/closed | `/psm cleanup` |
| `status` | Current session info | `/psm status` |

## Project References

Supported formats:
- **Alias**: `skc#123` (requires `~/.psm/projects.json`)
- **Full**: `owner/repo#123`
- **URL**: `https://github.com/owner/repo/pull/123`
- **Current**: `#123` (uses current directory's repo)

## Directory Structure

```
~/.psm/
├── projects.json       # Project aliases
├── sessions.json       # Active session registry
└── worktrees/          # Worktree storage
    └── <project>/
        └── <type>-<id>/
```

## Session Naming

| Type | Tmux Session | Worktree Dir |
|------|--------------|--------------|
| PR Review | `psm:skc:pr-123` | `~/.psm/worktrees/skc/pr-123` |
| Issue Fix | `psm:skc:issue-42` | `~/.psm/worktrees/skc/issue-42` |
| Feature | `psm:skc:feat-auth` | `~/.psm/worktrees/skc/feat-auth` |

---

## Error Handling

| Error | Resolution |
|-------|------------|
| Worktree exists | Offer: attach, recreate, or abort |
| PR not found | Verify URL/number, check permissions |
| No tmux | Warn and skip session creation |
| No gh CLI | Error with install instructions |

## Requirements

Required:
- `git` - Version control (with worktree support v2.5+)
- `jq` - JSON parsing
- `tmux` - Session management (optional, but recommended)

Optional (per provider):
- `gh` - GitHub CLI (for GitHub workflows)
- `jira` - Jira CLI (for Jira workflows)

## Detailed References

- **Configuration**: See [references/configuration.md](references/configuration.md)
- **Providers**: See [references/providers.md](references/providers.md)
- **Implementation Protocol**: See [references/implementation-protocol.md](references/implementation-protocol.md)
- **Teleport Command**: See [references/teleport-command.md](references/teleport-command.md)
- **Initialization**: See [references/initialization.md](references/initialization.md)
