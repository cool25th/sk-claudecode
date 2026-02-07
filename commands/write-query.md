---
description: "[Build] Generate SQL queries with validation and optimization"
---

# /scientist:write-query

## Category: ⚡ Build — Write and implement

Generate optimized SQL queries from natural language descriptions with built-in validation and best practices.

## Workflow

```
Think → Build → Check

@scientist-high "Plan the data analysis approach for user churn"
  ↓ (produces methodology)
@scientist "/scientist:write-query — Query monthly churn rates by cohort"
  ↓ (produces SQL)
@scientist-reviewer "Validate the query logic and statistical approach"
```

## What This Command Does

1. **Understands** the data question in natural language
2. **Generates** optimized SQL with:
   - Proper JOIN types and index-friendly WHERE clauses
   - CTE structure for complex queries
   - Aggregation and window functions
   - Parameterized inputs (no SQL injection)
3. **Validates** query logic:
   - Checks for common mistakes (cartesian joins, NULL handling)
   - Suggests indexes for performance
   - Warns about potential data issues
4. **Explains** the query step by step

## Skills Used
- `postgres-patterns` — PostgreSQL-specific optimization
- `clickhouse-io` — ClickHouse analytical queries

## Usage Examples

```bash
# Basic query
@scientist "/scientist:write-query — Get top 10 customers by revenue this month"

# Complex analysis
@scientist "/scientist:write-query — Cohort retention analysis: for each signup month, what % of users are still active after 1, 7, 30, 90 days"

# With specific DB
@scientist "/scientist:write-query — ClickHouse query for real-time event aggregation by 5-minute windows"
```

## Mode Guide

| Mode | How to use |
|------|-----------|
| **Think** | `@scientist-high` — Plan the analysis methodology |
| **Build** | `@scientist` — Write and optimize queries |
| **Check** | `@scientist-reviewer` — Validate logic and statistics |
