---
name: python-patterns
description: Pythonic idioms, PEP 8 standards, type hints, and best practices for building robust, efficient, and maintainable Python applications.
---


# Python Development Patterns

Idiomatic Python patterns and best practices for building robust, efficient, and maintainable applications.

## When to Activate

- Writing new Python code
- Reviewing Python code
- Refactoring existing Python code
- Designing Python packages/modules

## Core Principles

### 1. Readability Counts

Python prioritizes readability. Code should be obvious and easy to understand.

```python
# Good: Clear and readable
def get_active_users(users: list[User]) -> list[User]:
    """Return only active users from the provided list."""
    return [user for user in users if user.is_active]


# Bad: Clever but confusing
def get_active_users(u):
    return [x for x in u if x.a]
```

### 2. Explicit is Better Than Implicit

Avoid magic; be clear about what your code does.

```python
# Good: Explicit configuration
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Bad: Hidden side effects
import some_module
some_module.setup()  # What does this do?
```

### 3. EAFP - Easier to Ask Forgiveness Than Permission

Python prefers exception handling over checking conditions.

```python
# Good: EAFP style
def get_value(dictionary: dict, key: str) -> Any:
    try:
        return dictionary[key]
    except KeyError:
        return default_value

# Bad: LBYL (Look Before You Leap) style
def get_value(dictionary: dict, key: str) -> Any:
    if key in dictionary:
        return dictionary[key]
    else:
        return default_value
```

## Quick Reference: Python Idioms

| Idiom | Description |
|-------|-------------|
| EAFP | Easier to Ask Forgiveness than Permission |
| Context managers | Use `with` for resource management |
| List comprehensions | For simple transformations |
| Generators | For lazy evaluation and large datasets |
| Type hints | Annotate function signatures |
| Dataclasses | For data containers with auto-generated methods |
| `__slots__` | For memory optimization |
| f-strings | For string formatting (Python 3.6+) |
| `pathlib.Path` | For path operations (Python 3.4+) |
| `enumerate` | For index-element pairs in loops |

## Related Agents

- `executor` - Task execution (Sonnet)
- `python-reviewer` - Python code review

## Detailed References

- **Type Hints**: See [references/type-hints.md](references/type-hints.md)
- **Error Handling Patterns**: See [references/error-handling-patterns.md](references/error-handling-patterns.md)
- **Context Managers**: See [references/context-managers.md](references/context-managers.md)
- **Comprehensions and Generators**: See [references/comprehensions-and-generators.md](references/comprehensions-and-generators.md)
- **Data Classes and Named Tuples**: See [references/data-classes-and-named-tuples.md](references/data-classes-and-named-tuples.md)
- **Decorators**: See [references/decorators.md](references/decorators.md)
- **Concurrency Patterns**: See [references/concurrency-patterns.md](references/concurrency-patterns.md)
- **Package Organization**: See [references/package-organization.md](references/package-organization.md)
- **Memory and Performance**: See [references/memory-and-performance.md](references/memory-and-performance.md)
- **Python Tooling Integration**: See [references/python-tooling-integration.md](references/python-tooling-integration.md)
- **Anti-Patterns to Avoid**: See [references/anti-patterns-to-avoid.md](references/anti-patterns-to-avoid.md)
