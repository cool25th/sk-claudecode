---
description: Code review — general, security, database, Go, Python (auto-detects or specify mode)
---

# Code Review

[CODE REVIEW MODE ACTIVATED]

## Modes

| Mode | Trigger | Agent | Focus |
|------|---------|-------|-------|
| **General** | (default) | `code-reviewer` | Quality, bugs, best practices |
| **Security** | `--security` or security-related prompt | `security-reviewer` | OWASP Top 10, secrets, injection |
| **Database** | `--db` or SQL/schema prompt | `database-reviewer` | SQL optimization, schema design |
| **Go** | `--go` or Go files detected | `go-reviewer` | Go idioms, concurrency, error handling |
| **Python** | `--python` or Python files detected | `python-reviewer` | PEP 8, type hints, Pythonic patterns |

## Auto-Detection

If no mode specified, detect from context:
- Files contain `.go` → Go review mode
- Files contain `.py` → Python review mode
- Prompt mentions "security", "vulnerability", "OWASP" → Security mode
- Prompt mentions "SQL", "schema", "database", "query" → Database mode
- Otherwise → General code review

## Severity Levels

| Level | Description | Action Required |
|-------|-------------|-----------------|
| CRITICAL | Security vulnerability | Must fix before merge |
| HIGH | Bug or major code smell | Should fix before merge |
| MEDIUM | Minor issue | Fix when possible |
| LOW | Style/suggestion | Consider fixing |

## Output

Code review report with:
- Files reviewed count
- Issues by severity
- Specific file:line locations
- Fix recommendations
- Approval recommendation (APPROVE / REQUEST CHANGES / COMMENT)

{{PROMPT}}
