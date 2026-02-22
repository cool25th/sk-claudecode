---
name: django-patterns
description: Django architecture patterns, REST API design with DRF, ORM best practices, caching, signals, middleware, and production-grade Django apps.
---


# Django Development Patterns

Production-grade Django architecture patterns for scalable, maintainable applications.

## When to Activate

- Building Django web applications
- Designing Django REST Framework APIs
- Working with Django ORM and models
- Setting up Django project structure
- Implementing caching, signals, middleware

## Quick Reference

| Pattern | Description |
|---------|-------------|
| Split settings | Separate dev/prod/test settings |
| Custom QuerySet | Reusable query methods |
| Service Layer | Business logic separation |
| ViewSet | REST API endpoints |
| Serializer validation | Request/response transformation |
| select_related | Foreign key optimization |
| prefetch_related | Many-to-many optimization |
| Cache first | Cache expensive operations |
| Signals | Event-driven actions |
| Middleware | Request/response processing |

Remember: Django provides many shortcuts, but for production applications, structure and organization matter more than concise code. Build for maintainability.

---

## Related Agents

- `executor` - Task execution (Sonnet)
- `architect` - System architecture

## Detailed References

- **Project Structure**: See [references/project-structure.md](references/project-structure.md)
- **Model Design Patterns**: See [references/model-design-patterns.md](references/model-design-patterns.md)
- **Django REST Framework Patterns**: See [references/django-rest-framework-patterns.md](references/django-rest-framework-patterns.md)
- **Service Layer Pattern**: See [references/service-layer-pattern.md](references/service-layer-pattern.md)
- **Caching Strategies**: See [references/caching-strategies.md](references/caching-strategies.md)
- **Signals**: See [references/signals.md](references/signals.md)
- **Middleware**: See [references/middleware.md](references/middleware.md)
- **Performance Optimization**: See [references/performance-optimization.md](references/performance-optimization.md)
