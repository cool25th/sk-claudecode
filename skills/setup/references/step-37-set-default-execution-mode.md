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
