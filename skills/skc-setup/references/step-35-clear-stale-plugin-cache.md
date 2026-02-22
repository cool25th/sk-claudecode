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
