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
