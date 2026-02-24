---
name: golang
description: Go development guidance covering idiomatic patterns, concurrency, and testing practices.
---


# Go Development Patterns

Idiomatic Go patterns and best practices for building robust, efficient, and maintainable applications.

## When to Activate

- Writing new Go code
- Reviewing Go code
- Refactoring existing Go code
- Designing Go packages/modules

## Core Principles

### 1. Simplicity and Clarity

Go favors simplicity over cleverness. Code should be obvious and easy to read.

```go
// Good: Clear and direct
func GetUser(id string) (*User, error) {
    user, err := db.FindUser(id)
    if err != nil {
        return nil, fmt.Errorf("get user %s: %w", id, err)
    }
    return user, nil
}

// Bad: Overly clever
func GetUser(id string) (*User, error) {
    return func() (*User, error) {
        if u, e := db.FindUser(id); e == nil {
            return u, nil
        } else {
            return nil, e
        }
    }()
}
```

### 2. Make the Zero Value Useful

Design types so their zero value is immediately usable without initialization.

```go
// Good: Zero value is useful
type Counter struct {
    mu    sync.Mutex
    count int // zero value is 0, ready to use
}

func (c *Counter) Inc() {
    c.mu.Lock()
    c.count++
    c.mu.Unlock()
}

// Good: bytes.Buffer works with zero value
var buf bytes.Buffer
buf.WriteString("hello")

// Bad: Requires initialization
type BadCounter struct {
    counts map[string]int // nil map will panic
}
```

### 3. Accept Interfaces, Return Structs

Functions should accept interface parameters and return concrete types.

```go
// Good: Accepts interface, returns concrete type
func ProcessData(r io.Reader) (*Result, error) {
    data, err := io.ReadAll(r)
    if err != nil {
        return nil, err
    }
    return &Result{Data: data}, nil
}

// Bad: Returns interface (hides implementation details unnecessarily)
func ProcessData(r io.Reader) (io.Reader, error) {
    // ...
}
```

## Quick Reference: Go Idioms

| Idiom | Description |
|-------|-------------|
| Accept interfaces, return structs | Functions accept interface params, return concrete types |
| Errors are values | Treat errors as first-class values, not exceptions |
| Don't communicate by sharing memory | Use channels for coordination between goroutines |
| Make the zero value useful | Types should work without explicit initialization |
| A little copying is better than a little dependency | Avoid unnecessary external dependencies |
| Clear is better than clever | Prioritize readability over cleverness |
| gofmt is no one's favorite but everyone's friend | Always format with gofmt/goimports |
| Return early | Handle errors first, keep happy path unindented |

## Related Agents

- `executor` - Task execution (Sonnet)
- `go-reviewer` - Go code review

## Detailed References

- **Error Handling Patterns**: See [references/error-handling-patterns.md](references/error-handling-patterns.md)
- **Concurrency Patterns**: See [references/concurrency-patterns.md](references/concurrency-patterns.md)
- **Interface Design**: See [references/interface-design.md](references/interface-design.md)
- **Package Organization**: See [references/package-organization.md](references/package-organization.md)
- **Struct Design**: See [references/struct-design.md](references/struct-design.md)
- **Memory and Performance**: See [references/memory-and-performance.md](references/memory-and-performance.md)
- **Go Tooling Integration**: See [references/go-tooling-integration.md](references/go-tooling-integration.md)
- **Anti-Patterns to Avoid**: See [references/anti-patterns-to-avoid.md](references/anti-patterns-to-avoid.md)


## Merged from `golang-testing`



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
