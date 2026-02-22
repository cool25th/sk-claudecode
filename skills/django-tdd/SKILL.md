---
name: django-tdd
description: Django testing strategies with pytest-django, TDD methodology, factory_boy, mocking, coverage, and testing Django REST Framework APIs.
---


# Django Testing with TDD

Test-driven development for Django applications using pytest, factory_boy, and Django REST Framework.

## When to Activate

- Writing new Django applications
- Implementing Django REST Framework APIs
- Testing Django models, views, and serializers
- Setting up testing infrastructure for Django projects

## Quick Reference

| Pattern | Usage |
|---------|-------|
| `@pytest.mark.django_db` | Enable database access |
| `client` | Django test client |
| `api_client` | DRF API client |
| `factory.create_batch(n)` | Create multiple objects |
| `patch('module.function')` | Mock external dependencies |
| `override_settings` | Temporarily change settings |
| `force_authenticate()` | Bypass authentication in tests |
| `assertRedirects` | Check for redirects |
| `assertTemplateUsed` | Verify template usage |
| `mail.outbox` | Check sent emails |

Remember: Tests are documentation. Good tests explain how your code should work. Keep them simple, readable, and maintainable.

---

## Related Agents

- `tdd-guide` - TDD specialist (Sonnet)

## Detailed References

- **TDD Workflow for Django**: See [references/tdd-workflow-for-django.md](references/tdd-workflow-for-django.md)
- **Setup**: See [references/setup.md](references/setup.md)
- **Factory Boy**: See [references/factory-boy.md](references/factory-boy.md)
- **Model Testing**: See [references/model-testing.md](references/model-testing.md)
- **View Testing**: See [references/view-testing.md](references/view-testing.md)
- **DRF API Testing**: See [references/drf-api-testing.md](references/drf-api-testing.md)
- **Mocking and Patching**: See [references/mocking-and-patching.md](references/mocking-and-patching.md)
- **Integration Testing**: See [references/integration-testing.md](references/integration-testing.md)
- **Testing Best Practices**: See [references/testing-best-practices.md](references/testing-best-practices.md)
- **Coverage**: See [references/coverage.md](references/coverage.md)
