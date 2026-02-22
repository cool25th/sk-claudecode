## Advanced: Custom Decomposition

You can provide a custom decomposition file to skip Phase 1:

**Location:** `.skc/ultrapilot/custom-decomposition.json`

```json
{
  "subtasks": [
    {
      "id": "worker-auth",
      "description": "Add OAuth2 authentication",
      "files": ["src/auth/**", "src/middleware/auth.ts"],
      "dependencies": ["src/types/user.ts"]
    },
    {
      "id": "worker-db",
      "description": "Add user table and migrations",
      "files": ["src/db/migrations/**", "src/db/models/user.ts"],
      "dependencies": []
    }
  ],
  "sharedFiles": ["package.json", "src/types/user.ts"]
}
```

Then run:
```
/sk-claudecode:ultrapilot --custom-decomposition
```
