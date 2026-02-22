## File Ownership Strategy

### Ownership Types

**Exclusive Ownership:**
- Worker has sole write access
- No other worker can touch these files
- Worker can create new files in owned directories

**Shared Files:**
- No worker has exclusive access
- Handled sequentially in integration phase
- Includes: package.json, tsconfig.json, config files, root README

**Boundary Files:**
- Can be read by all workers
- Write access determined by usage analysis
- Typically: type definitions, shared utilities, interfaces

### Ownership Detection Algorithm

```
For each file in codebase:
  If file in shared_patterns (package.json, *.config.js):
    → sharedFiles

  Else if file imported by 2+ subtask modules:
    → boundaryFiles
    → Assign to most relevant worker OR defer to shared

  Else if file in subtask directory:
    → Assign to subtask worker

  Else:
    → sharedFiles (safe default)
```

### Shared File Patterns

Automatically classified as shared:
- `package.json`, `package-lock.json`
- `tsconfig.json`, `*.config.js`, `*.config.ts`
- `.eslintrc.*`, `.prettierrc.*`
- `README.md`, `CONTRIBUTING.md`, `LICENSE`
- Docker files: `Dockerfile`, `docker-compose.yml`
- CI files: `.github/**`, `.gitlab-ci.yml`
