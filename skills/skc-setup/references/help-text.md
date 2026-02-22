## Help Text

When user runs `/sk-claudecode:skc-setup --help` or just `--help`, display:

```
SKC Setup - Configure sk-claudecode

USAGE:
  /sk-claudecode:skc-setup           Run initial setup wizard (or update if already configured)
  /sk-claudecode:skc-setup --local   Configure local project (.claude/CLAUDE.md)
  /sk-claudecode:skc-setup --global  Configure global settings (~/.claude/CLAUDE.md)
  /sk-claudecode:skc-setup --force   Force full setup wizard even if already configured
  /sk-claudecode:skc-setup --help    Show this help

MODES:
  Initial Setup (no flags)
    - Interactive wizard for first-time setup
    - Configures CLAUDE.md (local or global)
    - Sets up HUD statusline
    - Checks for updates
    - Offers MCP server configuration
    - If already configured, offers quick update option

  Local Configuration (--local)
    - Downloads fresh CLAUDE.md to ./.claude/
    - Backs up existing CLAUDE.md to .claude/CLAUDE.md.backup.YYYY-MM-DD
    - Project-specific settings
    - Use this to update project config after SKC upgrades

  Global Configuration (--global)
    - Downloads fresh CLAUDE.md to ~/.claude/
    - Backs up existing CLAUDE.md to ~/.claude/CLAUDE.md.backup.YYYY-MM-DD
    - Applies to all Claude Code sessions
    - Cleans up legacy hooks
    - Use this to update global config after SKC upgrades

  Force Full Setup (--force)
    - Bypasses the "already configured" check
    - Runs the complete setup wizard from scratch
    - Use when you want to reconfigure preferences

EXAMPLES:
  /sk-claudecode:skc-setup           # First time setup (or update CLAUDE.md if configured)
  /sk-claudecode:skc-setup --local   # Update this project
  /sk-claudecode:skc-setup --global  # Update all projects
  /sk-claudecode:skc-setup --force   # Re-run full setup wizard

For more info: https://github.com/Yeachan-Heo/sk-claudecode
```
