## Complete Implementation

Here's the complete bash implementation you should run:

```bash
#!/bin/bash

# Parse arguments
FORCE_MODE=false
if [[ "$*" == *"--force"* ]] || [[ "$*" == *"--all"* ]]; then
  FORCE_MODE=true
fi

# Force mode: clear everything
if [[ "$FORCE_MODE" == "true" ]]; then
  echo "FORCE CLEAR: Removing all SKC state files..."

  mkdir -p .skc/state

  # Stop rate-limit daemon if running
  if [[ -f .skc/state/rate-limit-daemon.pid ]]; then
    kill "$(cat .skc/state/rate-limit-daemon.pid)" 2>/dev/null || true
    rm -f .skc/state/rate-limit-daemon.pid
  fi

  # Remove local state files
  rm -f .skc/state/autopilot-state.json
  rm -f .skc/state/ralph-state.json
  rm -f .skc/state/ralph-plan-state.json
  rm -f .skc/state/ralph-verification.json
  rm -f .skc/state/ultrawork-state.json
  rm -f .skc/state/ecomode-state.json
  rm -f .skc/state/ultraqa-state.json
  rm -f .skc/state/swarm.db
  rm -f .skc/state/swarm.db-wal
  rm -f .skc/state/swarm.db-shm
  rm -f .skc/state/swarm-active.marker
  rm -f .skc/state/swarm-tasks.db
  rm -f .skc/state/ultrapilot-state.json
  rm -f .skc/state/ultrapilot-ownership.json
  rm -f .skc/state/pipeline-state.json
  rm -f .skc/state/plan-consensus.json
  rm -f .skc/state/ralplan-state.json
  rm -f .skc/state/boulder.json
  rm -f .skc/state/hud-state.json
  rm -f .skc/state/subagent-tracking.json
  rm -f .skc/state/subagent-tracker.lock
  rm -f .skc/state/rate-limit-daemon.log
  rm -rf .skc/state/checkpoints/

  echo ""
  echo "All SKC modes cleared. You are free to start fresh."
  exit 0
fi

# Track what we cancelled
CANCELLED_ANYTHING=false

# 1. Check Autopilot (highest priority, includes cleanup of ralph/ultraqa)
if [[ -f .skc/state/autopilot-state.json ]]; then
  AUTOPILOT_STATE=$(cat .skc/state/autopilot-state.json)
  AUTOPILOT_ACTIVE=$(echo "$AUTOPILOT_STATE" | jq -r '.active // false')

  if [[ "$AUTOPILOT_ACTIVE" == "true" ]]; then
    CURRENT_PHASE=$(echo "$AUTOPILOT_STATE" | jq -r '.phase // "unknown"')
    CLEANED_UP=()

    # Clean up ralph if active
    if [[ -f .skc/state/ralph-state.json ]]; then
      RALPH_STATE=$(cat .skc/state/ralph-state.json)
      RALPH_ACTIVE=$(echo "$RALPH_STATE" | jq -r '.active // false')

      if [[ "$RALPH_ACTIVE" == "true" ]]; then
        LINKED_UW=$(echo "$RALPH_STATE" | jq -r '.linked_ultrawork // false')

        # Clean linked ultrawork first
        if [[ "$LINKED_UW" == "true" ]] && [[ -f .skc/state/ultrawork-state.json ]]; then
          rm -f .skc/state/ultrawork-state.json
          CLEANED_UP+=("ultrawork")
        fi

        # Clean ralph
        rm -f .skc/state/ralph-state.json
        rm -f .skc/state/ralph-verification.json
        CLEANED_UP+=("ralph")
      fi
    fi

    # Clean up ultraqa if active
    if [[ -f .skc/state/ultraqa-state.json ]]; then
      ULTRAQA_STATE=$(cat .skc/state/ultraqa-state.json)
      ULTRAQA_ACTIVE=$(echo "$ULTRAQA_STATE" | jq -r '.active // false')

      if [[ "$ULTRAQA_ACTIVE" == "true" ]]; then
        rm -f .skc/state/ultraqa-state.json
        CLEANED_UP+=("ultraqa")
      fi
    fi

    # Mark autopilot inactive but preserve state for resume
    echo "$AUTOPILOT_STATE" | jq '.active = false' > .skc/state/autopilot-state.json

    echo "Autopilot cancelled at phase: $CURRENT_PHASE."

    if [[ ${#CLEANED_UP[@]} -gt 0 ]]; then
      echo "Cleaned up: ${CLEANED_UP[*]}"
    fi

    echo "Progress preserved for resume. Run /sk-claudecode:autopilot to continue."
    CANCELLED_ANYTHING=true
    exit 0
  fi
fi

# 2. Check Ralph (if not handled by autopilot)
if [[ -f .skc/state/ralph-state.json ]]; then
  RALPH_STATE=$(cat .skc/state/ralph-state.json)
  RALPH_ACTIVE=$(echo "$RALPH_STATE" | jq -r '.active // false')

  if [[ "$RALPH_ACTIVE" == "true" ]]; then
    LINKED_UW=$(echo "$RALPH_STATE" | jq -r '.linked_ultrawork // false')

    # Clean linked ultrawork first
    if [[ "$LINKED_UW" == "true" ]] && [[ -f .skc/state/ultrawork-state.json ]]; then
      UW_STATE=$(cat .skc/state/ultrawork-state.json)
      UW_LINKED=$(echo "$UW_STATE" | jq -r '.linked_to_ralph // false')

      # Only clear if it was linked to ralph
      if [[ "$UW_LINKED" == "true" ]]; then
        rm -f .skc/state/ultrawork-state.json
        echo "Cleaned up: ultrawork (linked to ralph)"
      fi
    fi

    # Clean linked ecomode if present
    LINKED_ECO=$(echo "$RALPH_STATE" | jq -r '.linked_ecomode // false')

    if [[ "$LINKED_ECO" == "true" ]] && [[ -f .skc/state/ecomode-state.json ]]; then
      ECO_STATE=$(cat .skc/state/ecomode-state.json)
      ECO_LINKED=$(echo "$ECO_STATE" | jq -r '.linked_to_ralph // false')

      if [[ "$ECO_LINKED" == "true" ]]; then
        rm -f .skc/state/ecomode-state.json
        echo "Cleaned up: ecomode (linked to ralph)"
      fi
    fi

    # Clean ralph state
    rm -f .skc/state/ralph-state.json
    rm -f .skc/state/ralph-plan-state.json
    rm -f .skc/state/ralph-verification.json

    echo "Ralph cancelled. Persistent mode deactivated."
    CANCELLED_ANYTHING=true
    exit 0
  fi
fi

# 3. Check Ultrawork (standalone, not linked)
if [[ -f .skc/state/ultrawork-state.json ]]; then
  UW_STATE=$(cat .skc/state/ultrawork-state.json)
  UW_ACTIVE=$(echo "$UW_STATE" | jq -r '.active // false')

  if [[ "$UW_ACTIVE" == "true" ]]; then
    LINKED=$(echo "$UW_STATE" | jq -r '.linked_to_ralph // false')

    if [[ "$LINKED" == "true" ]]; then
      echo "Warning: Ultrawork is linked to Ralph, but Ralph is not active."
      echo "Clearing ultrawork state anyway..."
    fi

    # Remove local state
    rm -f .skc/state/ultrawork-state.json

    echo "Ultrawork cancelled. Parallel execution mode deactivated."
    CANCELLED_ANYTHING=true
    exit 0
  fi
fi

# 4. Check Ecomode (standalone, not linked)
if [[ -f .skc/state/ecomode-state.json ]]; then
  ECO_STATE=$(cat .skc/state/ecomode-state.json)
  ECO_ACTIVE=$(echo "$ECO_STATE" | jq -r '.active // false')

  if [[ "$ECO_ACTIVE" == "true" ]]; then
    LINKED=$(echo "$ECO_STATE" | jq -r '.linked_to_ralph // false')

    if [[ "$LINKED" == "true" ]]; then
      echo "Warning: Ecomode is linked to Ralph, but Ralph is not active."
      echo "Clearing ecomode state anyway..."
    fi

    # Remove local state
    rm -f .skc/state/ecomode-state.json

    echo "Ecomode cancelled. Token-efficient execution mode deactivated."
    CANCELLED_ANYTHING=true
    exit 0
  fi
fi

# 5. Check UltraQA (standalone)
if [[ -f .skc/state/ultraqa-state.json ]]; then
  ULTRAQA_STATE=$(cat .skc/state/ultraqa-state.json)
  ULTRAQA_ACTIVE=$(echo "$ULTRAQA_STATE" | jq -r '.active // false')

  if [[ "$ULTRAQA_ACTIVE" == "true" ]]; then
    rm -f .skc/state/ultraqa-state.json
    echo "UltraQA cancelled. QA cycling workflow stopped."
    CANCELLED_ANYTHING=true
    exit 0
  fi
fi

# 6. Check Swarm (SQLite-based)
SWARM_DB=".skc/state/swarm.db"
if [[ -f "$SWARM_DB" ]]; then
  # Check if sqlite3 CLI is available
  if command -v sqlite3 &>/dev/null; then
    # Query SQLite to check if swarm is active
    SWARM_ACTIVE=$(sqlite3 "$SWARM_DB" "SELECT active FROM swarm_session WHERE id = 1;" 2>/dev/null || echo "0")

    if [[ "$SWARM_ACTIVE" == "1" ]]; then
      # Get stats before cancelling
      DONE_TASKS=$(sqlite3 "$SWARM_DB" "SELECT COUNT(*) FROM tasks WHERE status = 'done';" 2>/dev/null || echo "0")
      TOTAL_TASKS=$(sqlite3 "$SWARM_DB" "SELECT COUNT(*) FROM tasks;" 2>/dev/null || echo "0")

      # Mark swarm as inactive
      sqlite3 "$SWARM_DB" "UPDATE swarm_session SET active = 0, completed_at = $(date +%s000) WHERE id = 1;"

      echo "Swarm cancelled. $DONE_TASKS/$TOTAL_TASKS tasks completed."
      echo "Database preserved at $SWARM_DB for analysis."
      CANCELLED_ANYTHING=true
      exit 0
    fi
  else
    # Fallback: Check marker file if sqlite3 is not available
    MARKER_FILE=".skc/state/swarm-active.marker"
    if [[ -f "$MARKER_FILE" ]]; then
      rm -f "$MARKER_FILE"
      echo "Swarm cancelled (marker file removed). Database at $SWARM_DB may need manual cleanup."
      CANCELLED_ANYTHING=true
      exit 0
    fi
  fi
fi

# 7. Check Ultrapilot (standalone)
if [[ -f .skc/state/ultrapilot-state.json ]]; then
  ULTRAPILOT_STATE=$(cat .skc/state/ultrapilot-state.json)
  ULTRAPILOT_ACTIVE=$(echo "$ULTRAPILOT_STATE" | jq -r '.active // false')

  if [[ "$ULTRAPILOT_ACTIVE" == "true" ]]; then
    rm -f .skc/state/ultrapilot-state.json
    echo "Ultrapilot cancelled. Parallel autopilot workers stopped."
    CANCELLED_ANYTHING=true
    exit 0
  fi
fi

# 8. Check Pipeline (standalone)
if [[ -f .skc/state/pipeline-state.json ]]; then
  PIPELINE_STATE=$(cat .skc/state/pipeline-state.json)
  PIPELINE_ACTIVE=$(echo "$PIPELINE_STATE" | jq -r '.active // false')

  if [[ "$PIPELINE_ACTIVE" == "true" ]]; then
    rm -f .skc/state/pipeline-state.json
    echo "Pipeline cancelled. Sequential agent chain stopped."
    CANCELLED_ANYTHING=true
    exit 0
  fi
fi

# 9. Check Plan Consensus (standalone)
if [[ "$PLAN_CONSENSUS_ACTIVE" == "true" ]]; then
  echo "Cancelling Plan Consensus mode..."

  # Clear state files
  rm -f .skc/state/plan-consensus.json
  rm -f .skc/state/ralplan-state.json

  echo "Plan Consensus cancelled. Planning session ended."
  echo "Note: Plan file preserved at path specified in state."
  CANCELLED_ANYTHING=true
  exit 0
fi

# No active modes found
if [[ "$CANCELLED_ANYTHING" == "false" ]]; then
  echo "No active SKC modes detected."
  echo ""
  echo "Checked for:"
  echo "  - Autopilot (.skc/state/autopilot-state.json)"
  echo "  - Ralph (.skc/state/ralph-state.json)"
  echo "  - Ultrawork (.skc/state/ultrawork-state.json)"
  echo "  - Ecomode (.skc/state/ecomode-state.json)"
  echo "  - UltraQA (.skc/state/ultraqa-state.json)"
  echo "  - Swarm (.skc/state/swarm.db)"
  echo "  - Ultrapilot (.skc/state/ultrapilot-state.json)"
  echo "  - Pipeline (.skc/state/pipeline-state.json)"
  echo "  - Plan Consensus (.skc/state/plan-consensus.json)"
  echo ""
  echo "Use --force to clear all state files anyway."
fi
```
