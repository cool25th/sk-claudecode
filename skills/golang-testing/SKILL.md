---
name: golang-testing
description: Go testing patterns including table-driven tests, subtests, benchmarks, fuzzing, and test coverage. Follows TDD methodology with idiomatic Go practices.
---


# Go Testing Patterns

Comprehensive Go testing patterns for writing reliable, maintainable tests following TDD methodology.

## When to Activate

- Writing new Go functions or methods
- Adding test coverage to existing code
- Creating benchmarks for performance-critical code
- Implementing fuzz tests for input validation
- Following TDD workflow in Go projects

## Testing Commands

```bash
# Run all tests
go test ./...

# Run tests with verbose output
go test -v ./...

# Run specific test
go test -run TestAdd ./...

# Run tests matching pattern
go test -run "TestUser/Create" ./...

# Run tests with race detector
go test -race ./...

# Run tests with coverage
go test -cover -coverprofile=coverage.out ./...

# Run short tests only
go test -short ./...

# Run tests with timeout
go test -timeout 30s ./...

# Run benchmarks
go test -bench=. -benchmem ./...

# Run fuzzing
go test -fuzz=FuzzParse -fuzztime=30s ./...

# Count test runs (for flaky test detection)
go test -count=10 ./...
```

## Related Agents

- `go-reviewer` - Go code review
- `tdd-guide` - TDD specialist

## Detailed References

- **TDD Workflow for Go**: See [references/tdd-workflow-for-go.md](references/tdd-workflow-for-go.md)
- **Table-Driven Tests**: See [references/table-driven-tests.md](references/table-driven-tests.md)
- **Subtests and Sub-benchmarks**: See [references/subtests-and-sub-benchmarks.md](references/subtests-and-sub-benchmarks.md)
- **Test Helpers**: See [references/test-helpers.md](references/test-helpers.md)
- **Golden Files**: See [references/golden-files.md](references/golden-files.md)
- **Mocking with Interfaces**: See [references/mocking-with-interfaces.md](references/mocking-with-interfaces.md)
- **Benchmarks**: See [references/benchmarks.md](references/benchmarks.md)
- **Fuzzing (Go 1.18+)**: See [references/fuzzing-go-118.md](references/fuzzing-go-118.md)
- **Test Coverage**: See [references/test-coverage.md](references/test-coverage.md)
- **HTTP Handler Testing**: See [references/http-handler-testing.md](references/http-handler-testing.md)
- **Best Practices**: See [references/best-practices.md](references/best-practices.md)
- **Integration with CI/CD**: See [references/integration-with-cicd.md](references/integration-with-cicd.md)
