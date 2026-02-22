## Conflict Handling

### Conflict Types

**Unexpected Overlap:**
- Two workers modified the same file
- **Resolution:** Coordinator merges with human confirmation

**Shared File Contention:**
- Multiple workers need to update package.json
- **Resolution:** Sequential application in integration phase

**Boundary File Conflict:**
- Type definition needed by multiple workers
- **Resolution:** First worker creates, others import

### Conflict Policy

**coordinator-handles (default):**
- Coordinator attempts automatic merge
- Falls back to user if complex

**abort-on-conflict:**
- Any conflict immediately cancels ultrapilot
- User reviews conflict report
- Can resume after manual fix
