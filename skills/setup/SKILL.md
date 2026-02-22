---
name: setup
description: Setup and configure sk-claudecode (the ONLY command you need to learn)
---


# SKC Setup

This is the **only command you need to learn**. After running this, everything else is automatic.

## Usage Modes

This skill handles three scenarios:

1. **Initial Setup (no flags)**: First-time installation wizard
2. **Local Configuration (`--local`)**: Configure project-specific settings (.claude/CLAUDE.md)
3. **Global Configuration (`--global`)**: Configure global settings (~/.claude/CLAUDE.md)

## Mode Detection

Check for flags in the user's invocation:
- If `--local` flag present → Skip Pre-Setup Check, go to Local Configuration (Step 2A)
- If `--global` flag present → Skip Pre-Setup Check, go to Global Configuration (Step 2B)
- If `--force` flag present → Skip Pre-Setup Check, run Initial Setup wizard (Step 1)
- If no flags → Run Pre-Setup Check first, then Initial Setup wizard (Step 1) if needed

## Step 1: Initial Setup Wizard (Default Behavior)

**Note**: If resuming and lastCompletedStep >= 1, skip to the appropriate step based on configType.

Use the AskUserQuestion tool to prompt the user:

**Question:** "Where should I configure sk-claudecode?"

**Options:**
1. **Local (this project)** - Creates `.claude/CLAUDE.md` in current project directory. Best for project-specific configurations.
2. **Global (all projects)** - Creates `~/.claude/CLAUDE.md` for all Claude Code sessions. Best for consistent behavior everywhere.

## Step 4: Verify Plugin Installation

```bash
grep -q "sk-claudecode" ~/.claude/settings.json && echo "Plugin verified" || echo "Plugin NOT found - run: claude /install-plugin sk-claudecode"
```

## Step 5: Offer MCP Server Configuration

MCP servers extend Claude Code with additional tools (web search, GitHub, etc.).

Ask user: "Would you like to configure MCP servers for enhanced capabilities? (Context7, Exa search, GitHub, etc.)"

If yes, invoke the mcp-setup skill:
```
/sk-claudecode:mcp-setup
```

If no, skip to next step.

## Step 6: Detect Upgrade from 2.x

Check if user has existing configuration:
```bash
# Check for existing 2.x artifacts
ls ~/.claude/commands/ralph-loop.md 2>/dev/null || ls ~/.claude/commands/ultrawork.md 2>/dev/null
```

If found, this is an upgrade from 2.x.

## Keeping Up to Date

After installing sk-claudecode updates (via npm or plugin update):

**Automatic**: Just run `/sk-claudecode:skc-setup` - it will detect you've already configured and offer a quick "Update CLAUDE.md only" option that skips the full wizard.

**Manual options**:
- `/sk-claudecode:skc-setup --local` to update project config only
- `/sk-claudecode:skc-setup --global` to update global config only
- `/sk-claudecode:skc-setup --force` to re-run the full wizard (reconfigure preferences)

This ensures you have the newest features and agent configurations without the token cost of repeating the full setup.

## Detailed References

- **Pre-Setup Check: Already Configured?**: See [references/pre-setup-check-already-configured.md](references/pre-setup-check-already-configured.md)
- **Graceful Interrupt Handling**: See [references/graceful-interrupt-handling.md](references/graceful-interrupt-handling.md)
- **Step 2A: Local Configuration (--local flag or user chose LOCAL)**: See [references/step-2a-local-configuration-local-flag-or-user-chose-local.md](references/step-2a-local-configuration-local-flag-or-user-chose-local.md)
- **Step 2B: Global Configuration (--global flag or user chose GLOBAL)**: See [references/step-2b-global-configuration-global-flag-or-user-chose-global.md](references/step-2b-global-configuration-global-flag-or-user-chose-global.md)
- **Step 3: Setup HUD Statusline**: See [references/step-3-setup-hud-statusline.md](references/step-3-setup-hud-statusline.md)
- **Step 3.5: Clear Stale Plugin Cache**: See [references/step-35-clear-stale-plugin-cache.md](references/step-35-clear-stale-plugin-cache.md)
- **Step 3.6: Check for Updates**: See [references/step-36-check-for-updates.md](references/step-36-check-for-updates.md)
- **Step 3.7: Set Default Execution Mode**: See [references/step-37-set-default-execution-mode.md](references/step-37-set-default-execution-mode.md)
- **Step 3.8: Install CLI Analytics Tools (Optional)**: See [references/step-38-install-cli-analytics-tools-optional.md](references/step-38-install-cli-analytics-tools-optional.md)
- **Step 3.8.5: Select Task Management Tool**: See [references/step-385-select-task-management-tool.md](references/step-385-select-task-management-tool.md)
- **Step 7: Show Welcome Message**: See [references/step-7-show-welcome-message.md](references/step-7-show-welcome-message.md)
- **Step 8: Ask About Starring Repository**: See [references/step-8-ask-about-starring-repository.md](references/step-8-ask-about-starring-repository.md)
- **Help Text**: See [references/help-text.md](references/help-text.md)
