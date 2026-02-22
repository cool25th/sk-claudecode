## Teleport Command

The `skc teleport` command provides a lightweight alternative to full PSM sessions. It creates git worktrees without tmux session management — ideal for quick, isolated development.

### Usage

```bash
# Create worktree for an issue or PR
skc teleport #123
skc teleport owner/repo#123
skc teleport https://github.com/owner/repo/issues/42

# Create worktree for a feature
skc teleport my-feature

# List existing worktrees
skc teleport list

# Remove a worktree
skc teleport remove issue/my-repo-123
skc teleport remove --force feat/my-repo-my-feature
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `--worktree` | Create worktree (default, kept for compatibility) | `true` |
| `--path <path>` | Custom worktree root directory | `~/Workspace/skc-worktrees/` |
| `--base <branch>` | Base branch to create from | `main` |
| `--json` | Output as JSON | `false` |

### Worktree Layout

```
~/Workspace/skc-worktrees/
├── issue/
│   └── my-repo-123/        # Issue worktrees
├── pr/
│   └── my-repo-456/        # PR review worktrees
└── feat/
    └── my-repo-my-feature/ # Feature worktrees
```

### PSM vs Teleport

| Feature | PSM | Teleport |
|---------|-----|----------|
| Git worktree | Yes | Yes |
| Tmux session | Yes | No |
| Claude Code launch | Yes | No |
| Session registry | Yes | No |
| Auto-cleanup | Yes | No |
| Project aliases | Yes | No (uses current repo) |

Use **PSM** for full managed sessions. Use **teleport** for quick worktree creation.

---
