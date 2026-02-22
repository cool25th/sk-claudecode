## Step 3.8: Install CLI Analytics Tools (Optional)

The SKC CLI provides standalone token analytics commands (`skc stats`, `skc agents`, `skc tui`).

Ask user: "Would you like to install the SKC CLI for standalone analytics? (Recommended for tracking token usage and costs)"

**Options:**
1. **Yes (Recommended)** - Install CLI tools globally for `skc stats`, `skc agents`, etc.
2. **No** - Skip CLI installation, use only plugin skills

### CLI Installation Note

The CLI (`skc` command) is **no longer supported** via npm/bun global install.

All functionality is available through the plugin system:
- Use `/sk-claudecode:help` for guidance
- Use `/sk-claudecode:doctor` for diagnostics

Skip this step - the plugin provides all features.
