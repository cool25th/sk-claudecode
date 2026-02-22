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
