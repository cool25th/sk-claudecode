---
name: backend
description: Backend development patterns and best practices. Use for api, database, server, and backend development tasks.
---


# Backend Development Skill

## Purpose
Backend development patterns for APIs, databases, and server-side logic.

## Database Patterns

### Schema Design
- Use UUIDs for IDs
- Add `created_at`, `updated_at`
- Soft delete with `deleted_at`

### Query Optimization
- Index frequently queried columns
- Use connection pooling
- Avoid N+1 queries

## Security Checklist

- [ ] Validate all inputs
- [ ] Use parameterized queries
- [ ] Hash passwords (bcrypt)
- [ ] Rate limit APIs
- [ ] Use HTTPS

## Related Agent
- `executor`
---
name: backend-patterns
description: Backend architecture patterns, API design, database optimization, and server-side best practices for Node.js, Express, and Next.js API routes.
---

# Backend Development Patterns

Backend architecture patterns and best practices for scalable server-side applications.

## Related Agents

- `executor` - Backend task execution (Sonnet)
- `executor-low` - Simple backend tasks (Haiku)
- `architect` - System architecture design

## Detailed References

- **API Design**: See [references/api-design.md](references/api-design.md)
- **API Design Patterns**: See [references/api-design-patterns.md](references/api-design-patterns.md)
- **Database Patterns**: See [references/database-patterns.md](references/database-patterns.md)
- **Caching Strategies**: See [references/caching-strategies.md](references/caching-strategies.md)
- **Error Handling Patterns**: See [references/error-handling-patterns.md](references/error-handling-patterns.md)
- **Authentication & Authorization**: See [references/authentication-authorization.md](references/authentication-authorization.md)
- **Rate Limiting**: See [references/rate-limiting.md](references/rate-limiting.md)
- **Background Jobs & Queues**: See [references/background-jobs-queues.md](references/background-jobs-queues.md)
- **Logging & Monitoring**: See [references/logging-monitoring.md](references/logging-monitoring.md)
