## Examples

### Example 1: Full-Stack App

```
/sk-claudecode:ultrapilot Build a todo app with React frontend, Express backend, and PostgreSQL database
```

**Workers:**
1. Frontend (src/client/)
2. Backend (src/server/)
3. Database (src/db/)
4. Tests (tests/)
5. Docs (docs/)

**Shared Files:** package.json, docker-compose.yml, README.md

**Duration:** ~15 minutes (vs ~75 minutes sequential)

### Example 2: Multi-Service Refactor

```
/sk-claudecode:up Refactor all services to use dependency injection
```

**Workers:**
1. Auth service
2. User service
3. Payment service
4. Notification service

**Shared Files:** src/types/services.ts, tsconfig.json

**Duration:** ~8 minutes (vs ~32 minutes sequential)

### Example 3: Test Coverage

```
/sk-claudecode:ultrapilot Generate tests for all untested modules
```

**Workers:**
1. API tests
2. UI component tests
3. Database tests
4. Utility tests
5. Integration tests

**Shared Files:** jest.config.js, test-utils.ts

**Duration:** ~10 minutes (vs ~50 minutes sequential)
