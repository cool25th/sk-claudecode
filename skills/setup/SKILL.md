---
name: setup
description: Setup and configure sk-claudecode (the ONLY command you need to learn)
---

# SKC Setup

This is the **only command you need to learn**. After running this, everything else is automatic.

## Pre-Setup Check: Already Configured?

**CRITICAL**: Before doing anything else, check if setup has already been completed. This prevents users from having to re-run the full setup wizard after every update.

```bash
# Check if setup was already completed
CONFIG_FILE="$HOME/.claude/.skc-config.json"

if [ -f "$CONFIG_FILE" ]; then
  SETUP_COMPLETED=$(jq -r '.setupCompleted // empty' "$CONFIG_FILE" 2>/dev/null)
  SETUP_VERSION=$(jq -r '.setupVersion // empty' "$CONFIG_FILE" 2>/dev/null)

  if [ -n "$SETUP_COMPLETED" ] && [ "$SETUP_COMPLETED" != "null" ]; then
    echo "SKC setup was already completed on: $SETUP_COMPLETED"
    [ -n "$SETUP_VERSION" ] && echo "Setup version: $SETUP_VERSION"
    ALREADY_CONFIGURED="true"
  fi
fi
```

### If Already Configured (and no --force flag)

If `ALREADY_CONFIGURED` is true AND the user did NOT pass `--force`, `--local`, or `--global` flags:

Use AskUserQuestion to prompt:

**Question:** "SKC is already configured. What would you like to do?"

**Options:**
1. **Update CLAUDE.md only** - Download latest CLAUDE.md without re-running full setup
2. **Run full setup again** - Go through the complete setup wizard
3. **Cancel** - Exit without changes

**If user chooses "Update CLAUDE.md only":**
- Detect if local (.claude/CLAUDE.md) or global (~/.claude/CLAUDE.md) config exists
- If local exists, run the download/merge script from Step 2A
- If only global exists, run the download/merge script from Step 2B
- Skip all other steps
- Report success and exit

**If user chooses "Run full setup again":**
- Continue with Step 0 (Resume Detection) below

**If user chooses "Cancel":**
- Exit without any changes

### Force Flag Override

If user passes `--force` flag, skip this check and proceed directly to setup.

## Graceful Interrupt Handling

**IMPORTANT**: This setup process saves progress after each step. If interrupted (Ctrl+C or connection loss), the setup can resume from where it left off.

### State File Location
- `.skc/state/setup-state.json` - Tracks completed steps

### Resume Detection (Step 0)

Before starting any step, check for existing state:

```bash
# Check for existing setup state
STATE_FILE=".skc/state/setup-state.json"

# Cross-platform ISO date to epoch conversion
iso_to_epoch() {
  local iso_date="$1"
  local epoch=""
  # Try GNU date first (Linux)
  epoch=$(date -d "$iso_date" +%s 2>/dev/null)
  if [ $? -eq 0 ] && [ -n "$epoch" ]; then
    echo "$epoch"
    return 0
  fi
  # Try BSD/macOS date
  local clean_date=$(echo "$iso_date" | sed 's/[+-][0-9][0-9]:[0-9][0-9]$//' | sed 's/Z$//' | sed 's/T/ /')
  epoch=$(date -j -f "%Y-%m-%d %H:%M:%S" "$clean_date" +%s 2>/dev/null)
  if [ $? -eq 0 ] && [ -n "$epoch" ]; then
    echo "$epoch"
    return 0
  fi
  echo "0"
}

if [ -f "$STATE_FILE" ]; then
  # Check if state is stale (older than 24 hours)
  TIMESTAMP_RAW=$(jq -r '.timestamp // empty' "$STATE_FILE" 2>/dev/null)
  if [ -n "$TIMESTAMP_RAW" ]; then
    TIMESTAMP_EPOCH=$(iso_to_epoch "$TIMESTAMP_RAW")
    NOW_EPOCH=$(date +%s)
    STATE_AGE=$((NOW_EPOCH - TIMESTAMP_EPOCH))
  else
    STATE_AGE=999999  # Force fresh start if no timestamp
  fi
  if [ "$STATE_AGE" -gt 86400 ]; then
    echo "Previous setup state is more than 24 hours old. Starting fresh."
    rm -f "$STATE_FILE"
  else
    LAST_STEP=$(jq -r ".lastCompletedStep // 0" "$STATE_FILE" 2>/dev/null || echo "0")
    TIMESTAMP=$(jq -r .timestamp "$STATE_FILE" 2>/dev/null || echo "unknown")
    echo "Found previous setup session (Step $LAST_STEP completed at $TIMESTAMP)"
  fi
fi
```

If state exists, use AskUserQuestion to prompt:

**Question:** "Found a previous setup session. Would you like to resume or start fresh?"

**Options:**
1. **Resume from step $LAST_STEP** - Continue where you left off
2. **Start fresh** - Begin from the beginning (clears saved state)

If user chooses "Start fresh":
```bash
rm -f ".skc/state/setup-state.json"
echo "Previous state cleared. Starting fresh setup."
```

### Save Progress Helper

After completing each major step, save progress:

```bash
# Save setup progress (call after each step)
# Usage: save_setup_progress STEP_NUMBER
save_setup_progress() {
  mkdir -p .skc/state
  cat > ".skc/state/setup-state.json" << EOF
{
  "lastCompletedStep": $1,
  "timestamp": "$(date -Iseconds)",
  "configType": "${CONFIG_TYPE:-unknown}"
}
EOF
}
```

### Clear State on Completion

After successful setup completion (Step 7/8), remove the state file:

```bash
rm -f ".skc/state/setup-state.json"
echo "Setup completed successfully. State cleared."
```

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

## Step 2A: Local Configuration (--local flag or user chose LOCAL)

**CRITICAL**: This ALWAYS downloads fresh CLAUDE.md from GitHub to the local project. DO NOT use the Write tool - use bash curl exclusively.

### Create Local .claude Directory

```bash
# Create .claude directory in current project
mkdir -p .claude && echo ".claude directory ready"
```

### Download Fresh CLAUDE.md

```bash
# Define target path
TARGET_PATH=".claude/CLAUDE.md"

# Extract old version before download
OLD_VERSION=$(grep -m1 "^# sk-claudecode" "$TARGET_PATH" 2>/dev/null | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' || echo "none")

# Backup existing
if [ -f "$TARGET_PATH" ]; then
  BACKUP_DATE=$(date +%Y-%m-%d_%H%M%S)
  BACKUP_PATH="${TARGET_PATH}.backup.${BACKUP_DATE}"
  cp "$TARGET_PATH" "$BACKUP_PATH"
  echo "Backed up existing CLAUDE.md to $BACKUP_PATH"
fi

# Download fresh SKC content to temp file
TEMP_SKC=$(mktemp /tmp/skc-claude-XXXXXX.md)
trap 'rm -f "$TEMP_SKC"' EXIT
curl -fsSL "https://raw.githubusercontent.com/Yeachan-Heo/sk-claudecode/main/docs/CLAUDE.md" -o "$TEMP_SKC"

if [ ! -s "$TEMP_SKC" ]; then
  echo "ERROR: Failed to download CLAUDE.md. Aborting."
  rm -f "$TEMP_SKC"
  return 1
fi

# Strip existing markers from downloaded content (idempotency)
if grep -q '<!-- SKC:START -->' "$TEMP_SKC"; then
  # Extract content between markers
  sed -n '/<!-- SKC:START -->/,/<!-- SKC:END -->/{//!p}' "$TEMP_SKC" > "${TEMP_SKC}.clean"
  mv "${TEMP_SKC}.clean" "$TEMP_SKC"
fi

if [ ! -f "$TARGET_PATH" ]; then
  # Fresh install: wrap in markers
  {
    echo '<!-- SKC:START -->'
    cat "$TEMP_SKC"
    echo '<!-- SKC:END -->'
  } > "$TARGET_PATH"
  rm -f "$TEMP_SKC"
  echo "Installed CLAUDE.md (fresh)"
else
  # Merge: preserve user content outside SKC markers
  if grep -q '<!-- SKC:START -->' "$TARGET_PATH"; then
    # Has markers: replace SKC section, keep user content
    BEFORE_SKC=$(sed -n '1,/<!-- SKC:START -->/{ /<!-- SKC:START -->/!p }' "$TARGET_PATH")
    AFTER_SKC=$(sed -n '/<!-- SKC:END -->/,${  /<!-- SKC:END -->/!p }' "$TARGET_PATH")
    {
      [ -n "$BEFORE_SKC" ] && printf '%s\n' "$BEFORE_SKC"
      echo '<!-- SKC:START -->'
      cat "$TEMP_SKC"
      echo '<!-- SKC:END -->'
      [ -n "$AFTER_SKC" ] && printf '%s\n' "$AFTER_SKC"
    } > "${TARGET_PATH}.tmp"
    mv "${TARGET_PATH}.tmp" "$TARGET_PATH"
    echo "Updated SKC section (user customizations preserved)"
  else
    # No markers: wrap new content in markers, append old content as user section
    OLD_CONTENT=$(cat "$TARGET_PATH")
    {
      echo '<!-- SKC:START -->'
      cat "$TEMP_SKC"
      echo '<!-- SKC:END -->'
      echo ""
      echo "<!-- User customizations (migrated from previous CLAUDE.md) -->"
      printf '%s\n' "$OLD_CONTENT"
    } > "${TARGET_PATH}.tmp"
    mv "${TARGET_PATH}.tmp" "$TARGET_PATH"
    echo "Migrated existing CLAUDE.md (added SKC markers, preserved old content)"
  fi
  rm -f "$TEMP_SKC"
fi

# Extract new version and report
NEW_VERSION=$(grep -m1 "^# sk-claudecode" "$TARGET_PATH" 2>/dev/null | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' || echo "unknown")
if [ "$OLD_VERSION" = "none" ]; then
  echo "Installed CLAUDE.md: $NEW_VERSION"
elif [ "$OLD_VERSION" = "$NEW_VERSION" ]; then
  echo "CLAUDE.md unchanged: $NEW_VERSION"
else
  echo "Updated CLAUDE.md: $OLD_VERSION -> $NEW_VERSION"
fi
```

**Note**: The downloaded CLAUDE.md includes Context Persistence instructions with `<remember>` tags for surviving conversation compaction.

**Note**: If an existing CLAUDE.md is found, it will be backed up to `.claude/CLAUDE.md.backup.YYYY-MM-DD` before downloading the new version.

**MANDATORY**: Always run this command. Do NOT skip. Do NOT use Write tool.

**FALLBACK** if curl fails:
Tell user to manually download from:
https://raw.githubusercontent.com/Yeachan-Heo/sk-claudecode/main/docs/CLAUDE.md

### Verify Plugin Installation

```bash
grep -q "sk-claudecode" ~/.claude/settings.json && echo "Plugin verified" || echo "Plugin NOT found - run: claude /install-plugin sk-claudecode"
```

### Confirm Local Configuration Success

After completing local configuration, save progress and report:

```bash
# Save progress - Step 2 complete (Local config)
mkdir -p .skc/state
cat > ".skc/state/setup-state.json" << EOF
{
  "lastCompletedStep": 2,
  "timestamp": "$(date -Iseconds)",
  "configType": "local"
}
EOF
```

**SKC Project Configuration Complete**
- CLAUDE.md: Updated with latest configuration from GitHub at ./.claude/CLAUDE.md
- Backup: Previous CLAUDE.md backed up to `.claude/CLAUDE.md.backup.YYYY-MM-DD` (if existed)
- Scope: **PROJECT** - applies only to this project
- Hooks: Provided by plugin (no manual installation needed)
- Agents: 28+ available (base + tiered variants)
- Model routing: Haiku/Sonnet/Opus based on task complexity

**Note**: This configuration is project-specific and won't affect other projects or global settings.

If `--local` flag was used, clear state and **STOP HERE**:
```bash
rm -f ".skc/state/setup-state.json"
```
Do not continue to HUD setup or other steps.

## Step 2B: Global Configuration (--global flag or user chose GLOBAL)

**CRITICAL**: This ALWAYS downloads fresh CLAUDE.md from GitHub to global config. DO NOT use the Write tool - use bash curl exclusively.

### Download Fresh CLAUDE.md

```bash
# Define target path
TARGET_PATH="$HOME/.claude/CLAUDE.md"

# Extract old version before download
OLD_VERSION=$(grep -m1 "^# sk-claudecode" "$TARGET_PATH" 2>/dev/null | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' || echo "none")

# Backup existing
if [ -f "$TARGET_PATH" ]; then
  BACKUP_DATE=$(date +%Y-%m-%d_%H%M%S)
  BACKUP_PATH="${TARGET_PATH}.backup.${BACKUP_DATE}"
  cp "$TARGET_PATH" "$BACKUP_PATH"
  echo "Backed up existing CLAUDE.md to $BACKUP_PATH"
fi

# Download fresh SKC content to temp file
TEMP_SKC=$(mktemp /tmp/skc-claude-XXXXXX.md)
trap 'rm -f "$TEMP_SKC"' EXIT
curl -fsSL "https://raw.githubusercontent.com/Yeachan-Heo/sk-claudecode/main/docs/CLAUDE.md" -o "$TEMP_SKC"

if [ ! -s "$TEMP_SKC" ]; then
  echo "ERROR: Failed to download CLAUDE.md. Aborting."
  rm -f "$TEMP_SKC"
  return 1
fi

# Strip existing markers from downloaded content (idempotency)
if grep -q '<!-- SKC:START -->' "$TEMP_SKC"; then
  # Extract content between markers
  sed -n '/<!-- SKC:START -->/,/<!-- SKC:END -->/{//!p}' "$TEMP_SKC" > "${TEMP_SKC}.clean"
  mv "${TEMP_SKC}.clean" "$TEMP_SKC"
fi

if [ ! -f "$TARGET_PATH" ]; then
  # Fresh install: wrap in markers
  {
    echo '<!-- SKC:START -->'
    cat "$TEMP_SKC"
    echo '<!-- SKC:END -->'
  } > "$TARGET_PATH"
  rm -f "$TEMP_SKC"
  echo "Installed CLAUDE.md (fresh)"
else
  # Merge: preserve user content outside SKC markers
  if grep -q '<!-- SKC:START -->' "$TARGET_PATH"; then
    # Has markers: replace SKC section, keep user content
    BEFORE_SKC=$(sed -n '1,/<!-- SKC:START -->/{ /<!-- SKC:START -->/!p }' "$TARGET_PATH")
    AFTER_SKC=$(sed -n '/<!-- SKC:END -->/,${  /<!-- SKC:END -->/!p }' "$TARGET_PATH")
    {
      [ -n "$BEFORE_SKC" ] && printf '%s\n' "$BEFORE_SKC"
      echo '<!-- SKC:START -->'
      cat "$TEMP_SKC"
      echo '<!-- SKC:END -->'
      [ -n "$AFTER_SKC" ] && printf '%s\n' "$AFTER_SKC"
    } > "${TARGET_PATH}.tmp"
    mv "${TARGET_PATH}.tmp" "$TARGET_PATH"
    echo "Updated SKC section (user customizations preserved)"
  else
    # No markers: wrap new content in markers, append old content as user section
    OLD_CONTENT=$(cat "$TARGET_PATH")
    {
      echo '<!-- SKC:START -->'
      cat "$TEMP_SKC"
      echo '<!-- SKC:END -->'
      echo ""
      echo "<!-- User customizations (migrated from previous CLAUDE.md) -->"
      printf '%s\n' "$OLD_CONTENT"
    } > "${TARGET_PATH}.tmp"
    mv "${TARGET_PATH}.tmp" "$TARGET_PATH"
    echo "Migrated existing CLAUDE.md (added SKC markers, preserved old content)"
  fi
  rm -f "$TEMP_SKC"
fi

# Extract new version and report
NEW_VERSION=$(grep -m1 "^# sk-claudecode" "$TARGET_PATH" 2>/dev/null | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' || echo "unknown")
if [ "$OLD_VERSION" = "none" ]; then
  echo "Installed CLAUDE.md: $NEW_VERSION"
elif [ "$OLD_VERSION" = "$NEW_VERSION" ]; then
  echo "CLAUDE.md unchanged: $NEW_VERSION"
else
  echo "Updated CLAUDE.md: $OLD_VERSION -> $NEW_VERSION"
fi
```

**Note**: If an existing CLAUDE.md is found, it will be backed up to `~/.claude/CLAUDE.md.backup.YYYY-MM-DD` before downloading the new version.

### Clean Up Legacy Hooks (if present)

Check if old manual hooks exist and remove them to prevent duplicates:

```bash
# Remove legacy bash hook scripts (now handled by plugin system)
rm -f ~/.claude/hooks/keyword-detector.sh
rm -f ~/.claude/hooks/stop-continuation.sh
rm -f ~/.claude/hooks/persistent-mode.sh
rm -f ~/.claude/hooks/session-start.sh
echo "Legacy hooks cleaned"
```

Check `~/.claude/settings.json` for manual hook entries. If the "hooks" key exists with UserPromptSubmit, Stop, or SessionStart entries pointing to bash scripts, inform the user:

> **Note**: Found legacy hooks in settings.json. These should be removed since the plugin now provides hooks automatically. Remove the "hooks" section from ~/.claude/settings.json to prevent duplicate hook execution.

### Verify Plugin Installation

```bash
grep -q "sk-claudecode" ~/.claude/settings.json && echo "Plugin verified" || echo "Plugin NOT found - run: claude /install-plugin sk-claudecode"
```

### Confirm Global Configuration Success

After completing global configuration, save progress and report:

```bash
# Save progress - Step 2 complete (Global config)
mkdir -p .skc/state
cat > ".skc/state/setup-state.json" << EOF
{
  "lastCompletedStep": 2,
  "timestamp": "$(date -Iseconds)",
  "configType": "global"
}
EOF
```

**SKC Global Configuration Complete**
- CLAUDE.md: Updated with latest configuration from GitHub at ~/.claude/CLAUDE.md
- Backup: Previous CLAUDE.md backed up to `~/.claude/CLAUDE.md.backup.YYYY-MM-DD` (if existed)
- Scope: **GLOBAL** - applies to all Claude Code sessions
- Hooks: Provided by plugin (no manual installation needed)
- Agents: 28+ available (base + tiered variants)
- Model routing: Haiku/Sonnet/Opus based on task complexity

**Note**: Hooks are now managed by the plugin system automatically. No manual hook installation required.

If `--global` flag was used, clear state and **STOP HERE**:
```bash
rm -f ".skc/state/setup-state.json"
```
Do not continue to HUD setup or other steps.

## Step 3: Setup HUD Statusline

**Note**: If resuming and lastCompletedStep >= 3, skip to Step 3.5.

The HUD shows real-time status in Claude Code's status bar. **Invoke the hud skill** to set up and configure:

Use the Skill tool to invoke: `hud` with args: `setup`

This will:
1. Install the HUD wrapper script to `~/.claude/hud/skc-hud.mjs`
2. Configure `statusLine` in `~/.claude/settings.json`
3. Report status and prompt to restart if needed

After HUD setup completes, save progress:
```bash
# Save progress - Step 3 complete (HUD setup)
mkdir -p .skc/state
CONFIG_TYPE=$(cat ".skc/state/setup-state.json" 2>/dev/null | grep -oE '"configType":\s*"[^"]+"' | cut -d'"' -f4 || echo "unknown")
cat > ".skc/state/setup-state.json" << EOF
{
  "lastCompletedStep": 3,
  "timestamp": "$(date -Iseconds)",
  "configType": "$CONFIG_TYPE"
}
EOF
```

## Step 3.5: Clear Stale Plugin Cache

Clear old cached plugin versions to avoid conflicts:

```bash
# Clear stale plugin cache versions
CACHE_DIR="$HOME/.claude/plugins/cache/skc/sk-claudecode"
if [ -d "$CACHE_DIR" ]; then
  LATEST=$(ls -1 "$CACHE_DIR" | sort -V | tail -1)
  CLEARED=0
  for dir in "$CACHE_DIR"/*; do
    if [ "$(basename "$dir")" != "$LATEST" ]; then
      rm -rf "$dir"
      CLEARED=$((CLEARED + 1))
    fi
  done
  [ $CLEARED -gt 0 ] && echo "Cleared $CLEARED stale cache version(s)" || echo "Cache is clean"
else
  echo "No cache directory found (normal for new installs)"
fi
```

## Step 3.6: Check for Updates

Notify user if a newer version is available:

```bash
# Detect installed version
INSTALLED_VERSION=""

# Try cache directory first
if [ -d "$HOME/.claude/plugins/cache/skc/sk-claudecode" ]; then
  INSTALLED_VERSION=$(ls -1 "$HOME/.claude/plugins/cache/skc/sk-claudecode" | sort -V | tail -1)
fi

# Try .skc-version.json second
if [ -z "$INSTALLED_VERSION" ] && [ -f ".skc-version.json" ]; then
  INSTALLED_VERSION=$(grep -oE '"version":\s*"[^"]+' .skc-version.json | cut -d'"' -f4)
fi

# Try CLAUDE.md header third (local first, then global)
if [ -z "$INSTALLED_VERSION" ]; then
  if [ -f ".claude/CLAUDE.md" ]; then
    INSTALLED_VERSION=$(grep -m1 "^# sk-claudecode" .claude/CLAUDE.md 2>/dev/null | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' | sed 's/^v//')
  elif [ -f "$HOME/.claude/CLAUDE.md" ]; then
    INSTALLED_VERSION=$(grep -m1 "^# sk-claudecode" "$HOME/.claude/CLAUDE.md" 2>/dev/null | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' | sed 's/^v//')
  fi
fi

# Check npm for latest version
LATEST_VERSION=$(npm view oh-my-claude-sisyphus version 2>/dev/null)

if [ -n "$INSTALLED_VERSION" ] && [ -n "$LATEST_VERSION" ]; then
  # Simple version comparison (assumes semantic versioning)
  if [ "$INSTALLED_VERSION" != "$LATEST_VERSION" ]; then
    echo ""
    echo "UPDATE AVAILABLE:"
    echo "  Installed: v$INSTALLED_VERSION"
    echo "  Latest:    v$LATEST_VERSION"
    echo ""
    echo "To update, run: claude /install-plugin sk-claudecode"
  else
    echo "You're on the latest version: v$INSTALLED_VERSION"
  fi
elif [ -n "$LATEST_VERSION" ]; then
  echo "Latest version available: v$LATEST_VERSION"
fi
```

## Step 3.7: Set Default Execution Mode

Use the AskUserQuestion tool to prompt the user:

**Question:** "Which parallel execution mode should be your default when you say 'fast' or 'parallel'?"

**Options:**
1. **ultrawork (maximum capability)** - Uses all agent tiers including Opus for complex tasks. Best for challenging work where quality matters most. (Recommended)
2. **ecomode (token efficient)** - Prefers Haiku/Sonnet agents, avoids Opus. Best for pro-plan users who want cost efficiency.

Store the preference in `~/.claude/.skc-config.json`:

```bash
# Read existing config or create empty object
CONFIG_FILE="$HOME/.claude/.skc-config.json"
mkdir -p "$(dirname "$CONFIG_FILE")"

if [ -f "$CONFIG_FILE" ]; then
  EXISTING=$(cat "$CONFIG_FILE")
else
  EXISTING='{}'
fi

# Set defaultExecutionMode (replace USER_CHOICE with "ultrawork" or "ecomode")
echo "$EXISTING" | jq --arg mode "USER_CHOICE" '. + {defaultExecutionMode: $mode, configuredAt: (now | todate)}' > "$CONFIG_FILE"
echo "Default execution mode set to: USER_CHOICE"
```

**Note**: This preference ONLY affects generic keywords ("fast", "parallel"). Explicit keywords ("ulw", "eco") always override this preference.

### Optional: Disable Ecomode Entirely

If the user wants to disable ecomode completely (so ecomode keywords are ignored), add to the config:

```bash
echo "$EXISTING" | jq '. + {ecomode: {enabled: false}}' > "$CONFIG_FILE"
echo "Ecomode disabled completely"
```

## Step 3.8: Install CLI Analytics Tools (Optional)

The SKC CLI provides standalone token analytics commands (`skc stats`, `skc agents`, `skc tui`).

Ask user: "Would you like to install the SKC CLI for standalone analytics? (Recommended for tracking token usage and costs)"

**Options:**
1. **Yes (Recommended)** - Install CLI tools globally for `skc stats`, `skc agents`, etc.
2. **No** - Skip CLI installation, use only plugin skills

### CLI Installation Note

Install the SKC CLI globally for rate limit wait and analytics commands:

```bash
# Get the plugin installation path
SKC_PATH=""

# Check cache directory first
if [ -d "$HOME/.claude/plugins/cache/skc/sk-claudecode" ]; then
  SKC_PATH="$HOME/.claude/plugins/cache/skc/sk-claudecode/$(ls -1 "$HOME/.claude/plugins/cache/skc/sk-claudecode" | sort -V | tail -1)"
fi

# Fall back to local installation if available
if [ -z "$SKC_PATH" ] && [ -f "./package.json" ]; then
  if grep -q '"sk-claudecode"' ./package.json 2>/dev/null; then
    SKC_PATH="$(pwd)"
  fi
fi

if [ -n "$SKC_PATH" ]; then
  echo "Installing SKC CLI from: $SKC_PATH"
  cd "$SKC_PATH" && npm link 2>/dev/null && echo "✅ SKC CLI installed successfully!" || echo "⚠️ npm link failed - CLI not installed"
  cd - > /dev/null
else
  echo "⚠️ Could not locate sk-claudecode installation. CLI not installed."
  echo "   To manually install: cd /path/to/sk-claudecode && npm link"
fi

# Verify CLI is available
if command -v skc &>/dev/null; then
  echo ""
  echo "SKC CLI is ready! Available commands:"
  echo "  skc wait          - Check rate limit status"
  echo "  skc wait --start  - Enable auto-resume daemon"
  echo "  skc wait --stop   - Disable daemon"
  echo "  skc stats         - View token usage"
  echo "  skc agents        - See agent breakdown"
fi
```

## Step 3.8.5: Select Task Management Tool

First, detect available task tools:

```bash
# Detect beads (bd)
BD_VERSION=""
if command -v bd &>/dev/null; then
  BD_VERSION=$(bd --version 2>/dev/null | head -1 || echo "installed")
fi

# Detect beads-rust (br)
BR_VERSION=""
if command -v br &>/dev/null; then
  BR_VERSION=$(br --version 2>/dev/null | head -1 || echo "installed")
fi

# Report findings
if [ -n "$BD_VERSION" ]; then
  echo "Found beads (bd): $BD_VERSION"
fi
if [ -n "$BR_VERSION" ]; then
  echo "Found beads-rust (br): $BR_VERSION"
fi
if [ -z "$BD_VERSION" ] && [ -z "$BR_VERSION" ]; then
  echo "No external task tools found. Using built-in Tasks."
fi
```

If **neither** beads nor beads-rust is detected, skip this step (default to built-in).

If beads or beads-rust is detected, use AskUserQuestion:

**Question:** "Which task management tool should I use for tracking work?"

**Options:**
1. **Built-in Tasks (default)** - Use Claude Code's native TaskCreate/TodoWrite. Tasks are session-only.
2. **Beads (bd)** - Git-backed persistent tasks. Survives across sessions. [Only if detected]
3. **Beads-Rust (br)** - Lightweight Rust port of beads. [Only if detected]

(Only show options 2/3 if the corresponding tool is detected)

Store the preference:

```bash
CONFIG_FILE="$HOME/.claude/.skc-config.json"
mkdir -p "$(dirname "$CONFIG_FILE")"

if [ -f "$CONFIG_FILE" ]; then
  EXISTING=$(cat "$CONFIG_FILE")
else
  EXISTING='{}'
fi

# USER_CHOICE is "builtin", "beads", or "beads-rust" based on user selection
echo "$EXISTING" | jq --arg tool "USER_CHOICE" '. + {taskTool: $tool, taskToolConfig: {injectInstructions: true, useMcp: false}}' > "$CONFIG_FILE"
echo "Task tool set to: USER_CHOICE"
```

**Note:** The beads context instructions will be injected automatically on the next session start. No restart is needed for config to take effect.

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

## Step 7: Show Welcome Message

### For New Users:

```
SKC Setup Complete!

You don't need to learn any commands. I now have intelligent behaviors that activate automatically.

WHAT HAPPENS AUTOMATICALLY:
- Complex tasks -> I parallelize and delegate to specialists
- "plan this" -> I start a planning interview
- "don't stop until done" -> I persist until verified complete
- "stop" or "cancel" -> I intelligently stop current operation

MAGIC KEYWORDS (optional power-user shortcuts):
Just include these words naturally in your request:

| Keyword | Effect | Example |
|---------|--------|---------|
| ralph | Persistence mode | "ralph: fix the auth bug" |
| ralplan | Iterative planning | "ralplan this feature" |
| ulw | Max parallelism | "ulw refactor the API" |
| eco | Token-efficient mode | "eco refactor the API" |
| plan | Planning interview | "plan the new endpoints" |

**ralph includes ultrawork:** When you activate ralph mode, it automatically includes ultrawork's parallel execution. No need to combine keywords.

MCP SERVERS:
Run /sk-claudecode:mcp-setup to add tools like web search, GitHub, etc.

HUD STATUSLINE:
The status bar now shows SKC state. Restart Claude Code to see it.

CLI ANALYTICS (if installed):
- skc           - Full dashboard (stats + agents + cost)
- skc stats     - View token usage and costs
- skc agents    - See agent breakdown by cost
- skc tui       - Launch interactive TUI dashboard

That's it! Just use Claude Code normally.
```

### For Users Upgrading from 2.x:

```
SKC Setup Complete! (Upgraded from 2.x)

GOOD NEWS: Your existing commands still work!
- /ralph, /ultrawork, /plan, etc. all still function

WHAT'S NEW in 3.0:
You no longer NEED those commands. Everything is automatic now:
- Just say "don't stop until done" instead of /ralph
- Just say "fast" or "parallel" instead of /ultrawork
- Just say "plan this" instead of /plan
- Just say "stop" instead of /cancel

MAGIC KEYWORDS (power-user shortcuts):
| Keyword | Same as old... | Example |
|---------|----------------|---------|
| ralph | /ralph | "ralph: fix the bug" |
| ralplan | /ralplan | "ralplan this feature" |
| ulw | /ultrawork | "ulw refactor API" |
| eco | (new!) | "eco fix all errors" |
| plan | /plan | "plan the endpoints" |

HUD STATUSLINE:
The status bar now shows SKC state. Restart Claude Code to see it.

CLI ANALYTICS (if installed):
- skc           - Full dashboard (stats + agents + cost)
- skc stats     - View token usage and costs
- skc agents    - See agent breakdown by cost
- skc tui       - Launch interactive TUI dashboard

Your workflow won't break - it just got easier!
```

## Step 8: Ask About Starring Repository

First, check if `gh` CLI is available and authenticated:

```bash
gh auth status &>/dev/null
```

### If gh is available and authenticated:

Use the AskUserQuestion tool to prompt the user:

**Question:** "If you're enjoying sk-claudecode, would you like to support the project by starring it on GitHub?"

**Options:**
1. **Yes, star it!** - Star the repository
2. **No thanks** - Skip without further prompts
3. **Maybe later** - Skip without further prompts

If user chooses "Yes, star it!":

```bash
gh api -X PUT /user/starred/Yeachan-Heo/sk-claudecode 2>/dev/null && echo "Thanks for starring! ⭐" || true
```

**Note:** Fail silently if the API call doesn't work - never block setup completion.

### If gh is NOT available or not authenticated:

```bash
echo ""
echo "If you enjoy sk-claudecode, consider starring the repo:"
echo "  https://github.com/Yeachan-Heo/sk-claudecode"
echo ""
```

### Clear Setup State and Mark Completion

After Step 8 completes (regardless of star choice), clear the temporary state and mark setup as completed:

```bash
# Setup complete - clear temporary state file
rm -f ".skc/state/setup-state.json"

# Mark setup as completed in persistent config (prevents re-running full setup on updates)
CONFIG_FILE="$HOME/.claude/.skc-config.json"
mkdir -p "$(dirname "$CONFIG_FILE")"

# Get current SKC version from CLAUDE.md
SKC_VERSION=""
if [ -f ".claude/CLAUDE.md" ]; then
  SKC_VERSION=$(grep -m1 "^# sk-claudecode" .claude/CLAUDE.md 2>/dev/null | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' || echo "unknown")
elif [ -f "$HOME/.claude/CLAUDE.md" ]; then
  SKC_VERSION=$(grep -m1 "^# sk-claudecode" "$HOME/.claude/CLAUDE.md" 2>/dev/null | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' || echo "unknown")
fi

if [ -f "$CONFIG_FILE" ]; then
  EXISTING=$(cat "$CONFIG_FILE")
else
  EXISTING='{}'
fi

# Add setupCompleted timestamp and version
echo "$EXISTING" | jq --arg ts "$(date -Iseconds)" --arg ver "$SKC_VERSION" \
  '. + {setupCompleted: $ts, setupVersion: $ver}' > "$CONFIG_FILE"

echo "Setup completed successfully!"
echo "Note: Future updates will only refresh CLAUDE.md, not the full setup wizard."
```

## Keeping Up to Date

After installing sk-claudecode updates (via npm or plugin update):

**Automatic**: Just run `/sk-claudecode:skc-setup` - it will detect you've already configured and offer a quick "Update CLAUDE.md only" option that skips the full wizard.

**Manual options**:
- `/sk-claudecode:skc-setup --local` to update project config only
- `/sk-claudecode:skc-setup --global` to update global config only
- `/sk-claudecode:skc-setup --force` to re-run the full wizard (reconfigure preferences)

This ensures you have the newest features and agent configurations without the token cost of repeating the full setup.

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
