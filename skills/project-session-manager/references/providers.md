## Providers

PSM supports multiple issue tracking providers:

| Provider | CLI Required | Reference Formats | Commands |
|----------|--------------|-------------------|----------|
| GitHub (default) | `gh` | `owner/repo#123`, `alias#123`, GitHub URLs | review, fix, feature |
| Jira | `jira` | `PROJ-123` (if PROJ configured), `alias#123` | fix, feature |

### Jira Configuration

To use Jira, add an alias with `jira_project` and `provider: "jira"`:

```json
{
  "aliases": {
    "mywork": {
      "jira_project": "MYPROJ",
      "repo": "mycompany/my-project",
      "local": "~/Workspace/my-project",
      "default_base": "develop",
      "provider": "jira"
    }
  }
}
```

**Important:** The `repo` field is still required for cloning the git repository. Jira tracks issues, but you work in a git repo.

For non-GitHub repos, use `clone_url` instead:
```json
{
  "aliases": {
    "private": {
      "jira_project": "PRIV",
      "clone_url": "git@gitlab.internal:team/repo.git",
      "local": "~/Workspace/repo",
      "provider": "jira"
    }
  }
}
```

### Jira Reference Detection

PSM only recognizes `PROJ-123` format as Jira when `PROJ` is explicitly configured as a `jira_project` in your aliases. This prevents false positives from branch names like `FIX-123`.

### Jira Examples

```bash
# Fix a Jira issue (MYPROJ must be configured)
psm fix MYPROJ-123

# Fix using alias (recommended)
psm fix mywork#123

# Feature development (works same as GitHub)
psm feature mywork add-webhooks

# Note: 'psm review' is not supported for Jira (no PR concept)
# Use 'psm fix' for Jira issues
```

### Jira CLI Setup

Install the Jira CLI:
```bash
# macOS
brew install ankitpokhrel/jira-cli/jira-cli

# Linux
# See: https://github.com/ankitpokhrel/jira-cli#installation

# Configure (interactive)
jira init
```

The Jira CLI handles authentication separately from PSM.
