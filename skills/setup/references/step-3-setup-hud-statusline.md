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
