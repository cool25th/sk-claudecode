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
