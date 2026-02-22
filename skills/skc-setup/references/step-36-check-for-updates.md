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
