## Initialization

On first run, create default config:

```bash
mkdir -p ~/.psm/worktrees ~/.psm/logs

# Create default projects.json if not exists
if [[ ! -f ~/.psm/projects.json ]]; then
  cat > ~/.psm/projects.json << 'EOF'
{
  "aliases": {
    "skc": {
      "repo": "Yeachan-Heo/sk-claudecode",
      "local": "~/Workspace/sk-claudecode",
      "default_base": "main"
    }
  },
  "defaults": {
    "worktree_root": "~/.psm/worktrees",
    "cleanup_after_days": 14,
    "auto_cleanup_merged": true
  }
}
EOF
fi

# Create sessions.json if not exists
if [[ ! -f ~/.psm/sessions.json ]]; then
  echo '{"version":1,"sessions":{},"stats":{"total_created":0,"total_cleaned":0}}' > ~/.psm/sessions.json
fi
```
