# OMC Analytics CLI

Command-line interface for Oh-My-ClaudeCode analytics, token tracking, cost reports, and session management.

## Installation

After installing oh-my-claudecode:

```bash
npm install -g oh-my-claude-sisyphus
```

The `skc-analytics` command will be available globally.

## Commands

### Stats

Show current session statistics including token usage, costs, and top agents.

```bash
skc-analytics stats
skc-analytics stats --json
```

### Cost Reports

Generate cost reports for different time periods.

```bash
skc-analytics cost daily
skc-analytics cost weekly
skc-analytics cost monthly
skc-analytics cost monthly --json
```

### Session History

View historical session data.

```bash
skc-analytics sessions
skc-analytics sessions --limit 20
skc-analytics sessions --json
```

### Agent Usage

Show agent usage breakdown by tokens and cost.

```bash
skc-analytics agents
skc-analytics agents --limit 20
skc-analytics agents --json
```

### Export Data

Export analytics data to JSON or CSV format.

```bash
# Export cost report
skc-analytics export cost json ./cost-report.json
skc-analytics export cost csv ./cost-report.csv --period weekly

# Export session history
skc-analytics export sessions json ./sessions.json
skc-analytics export sessions csv ./sessions.csv

# Export usage patterns
skc-analytics export patterns json ./patterns.json
```

### Cleanup

Remove old logs and orphaned background tasks.

```bash
skc-analytics cleanup
skc-analytics cleanup --retention 60  # Keep 60 days instead of default 30
```

## Data Storage

Analytics data is stored in:
- `~/.skc/analytics/tokens/` - Token usage logs
- `~/.skc/analytics/sessions/` - Session history
- `~/.skc/analytics/metrics/` - Performance metrics

## JSON Output

All commands support `--json` flag for machine-readable output, useful for integration with other tools or scripts.

```bash
# Example: Parse JSON output with jq
skc-analytics stats --json | jq '.stats.totalCost'
skc-analytics agents --json | jq '.topAgents[0].agent'
```

## Examples

### Daily Cost Tracking

```bash
# Check today's cost
skc-analytics cost daily

# Export weekly report
skc-analytics export cost csv weekly-report.csv --period weekly
```

### Session Analysis

```bash
# View recent sessions
skc-analytics sessions --limit 5

# Export all sessions for analysis
skc-analytics export sessions json all-sessions.json
```

### Agent Performance

```bash
# See which agents are most expensive
skc-analytics agents --limit 10

# Export for spreadsheet analysis
skc-analytics export patterns csv agent-patterns.csv
```

### Maintenance

```bash
# Monthly cleanup (keep 90 days of data)
skc-analytics cleanup --retention 90
```
