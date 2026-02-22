---
name: python-testing
description: Python testing strategies using pytest, TDD methodology, fixtures, mocking, parametrization, and coverage requirements.
---


# Python Testing Patterns

Comprehensive testing strategies for Python applications using pytest, TDD methodology, and best practices.

## When to Activate

- Writing new Python code (follow TDD: red, green, refactor)
- Designing test suites for Python projects
- Reviewing Python test coverage
- Setting up testing infrastructure

## Quick Reference

| Pattern | Usage |
|---------|-------|
| `pytest.raises()` | Test expected exceptions |
| `@pytest.fixture()` | Create reusable test fixtures |
| `@pytest.mark.parametrize()` | Run tests with multiple inputs |
| `@pytest.mark.slow` | Mark slow tests |
| `pytest -m "not slow"` | Skip slow tests |
| `@patch()` | Mock functions and classes |
| `tmp_path` fixture | Automatic temp directory |
| `pytest --cov` | Generate coverage report |
| `assert` | Simple and readable assertions |

**Remember**: Tests are code too. Keep them clean, readable, and maintainable. Good tests catch bugs; great tests prevent them.

---

## Related Agents

- `python-reviewer` - Python code review
- `tdd-guide` - TDD specialist

## Detailed References

- **Core Testing Philosophy**: See [references/core-testing-philosophy.md](references/core-testing-philosophy.md)
- **pytest Fundamentals**: See [references/pytest-fundamentals.md](references/pytest-fundamentals.md)
- **Fixtures**: See [references/fixtures.md](references/fixtures.md)
- **Parametrization**: See [references/parametrization.md](references/parametrization.md)
- **Markers and Test Selection**: See [references/markers-and-test-selection.md](references/markers-and-test-selection.md)
- **Mocking and Patching**: See [references/mocking-and-patching.md](references/mocking-and-patching.md)
- **Testing Async Code**: See [references/testing-async-code.md](references/testing-async-code.md)
- **Testing Exceptions**: See [references/testing-exceptions.md](references/testing-exceptions.md)
- **Testing Side Effects**: See [references/testing-side-effects.md](references/testing-side-effects.md)
- **Test Organization**: See [references/test-organization.md](references/test-organization.md)
- **Best Practices**: See [references/best-practices.md](references/best-practices.md)
- **Common Patterns**: See [references/common-patterns.md](references/common-patterns.md)
- **pytest Configuration**: See [references/pytest-configuration.md](references/pytest-configuration.md)
- **Running Tests**: See [references/running-tests.md](references/running-tests.md)
