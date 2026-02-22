## Implementation Steps

When you invoke this skill:

### 1. Parse Arguments

```bash
# Check for --force or --all flags
FORCE_MODE=false
if [[ "$*" == *"--force"* ]] || [[ "$*" == *"--all"* ]]; then
  FORCE_MODE=true
fi
```

### 2. Detect Active Modes

```bash
# Check which modes are active
AUTOPILOT_ACTIVE=false
RALPH_ACTIVE=false
ULTRAWORK_ACTIVE=false
ECOMODE_ACTIVE=false
ULTRAQA_ACTIVE=false

if [[ -f .skc/state/autopilot-state.json ]]; then
  AUTOPILOT_ACTIVE=$(cat .skc/state/autopilot-state.json | jq -r '.active // false')
fi

if [[ -f .skc/state/ralph-state.json ]]; then
  RALPH_ACTIVE=$(cat .skc/state/ralph-state.json | jq -r '.active // false')
fi

if [[ -f .skc/state/ultrawork-state.json ]]; then
  ULTRAWORK_ACTIVE=$(cat .skc/state/ultrawork-state.json | jq -r '.active // false')
fi

if [[ -f .skc/state/ecomode-state.json ]]; then
  ECOMODE_ACTIVE=$(cat .skc/state/ecomode-state.json | jq -r '.active // false')
fi

if [[ -f .skc/state/ultraqa-state.json ]]; then
  ULTRAQA_ACTIVE=$(cat .skc/state/ultraqa-state.json | jq -r '.active // false')
fi

PLAN_CONSENSUS_ACTIVE=false

# Check both new and legacy locations
if [[ -f .skc/state/plan-consensus.json ]]; then
  PLAN_CONSENSUS_ACTIVE=$(cat .skc/state/plan-consensus.json | jq -r '.active // false')
elif [[ -f .skc/state/ralplan-state.json ]]; then
  PLAN_CONSENSUS_ACTIVE=$(cat .skc/state/ralplan-state.json | jq -r '.active // false')
fi
```

### 3A. Force Mode (if --force or --all)

```bash
if [[ "$FORCE_MODE" == "true" ]]; then
  echo "FORCE CLEAR: Removing all SKC state files..."

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
  rm -f .skc/state/rate-limit-daemon.pid
  rm -f .skc/state/rate-limit-daemon.log
  rm -rf .skc/state/checkpoints/

  # Stop rate-limit daemon if running
  if [[ -f .skc/state/rate-limit-daemon.pid ]]; then
    kill "$(cat .skc/state/rate-limit-daemon.pid)" 2>/dev/null || true
    rm -f .skc/state/rate-limit-daemon.pid
  fi

  echo "All SKC modes cleared. You are free to start fresh."
  exit 0
fi
```

### 3B. Smart Cancellation (default)

#### If Autopilot Active

Call `cancelAutopilot()` from `src/hooks/autopilot/cancel.ts:27-78`:

```bash
# Autopilot handles its own cleanup + ralph + ultraqa
# Just mark autopilot as inactive (preserves state for resume)
if [[ -f .skc/state/autopilot-state.json ]]; then
  # Clean up ralph if active
  if [[ -f .skc/state/ralph-state.json ]]; then
    RALPH_STATE=$(cat .skc/state/ralph-state.json)
    LINKED_UW=$(echo "$RALPH_STATE" | jq -r '.linked_ultrawork // false')

    # Clean linked ultrawork first
    if [[ "$LINKED_UW" == "true" ]] && [[ -f .skc/state/ultrawork-state.json ]]; then
      rm -f .skc/state/ultrawork-state.json
      echo "Cleaned up: ultrawork (linked to ralph)"
    fi

    # Clean ralph
    rm -f .skc/state/ralph-state.json
    rm -f .skc/state/ralph-verification.json
    echo "Cleaned up: ralph"
  fi

  # Clean up ultraqa if active
  if [[ -f .skc/state/ultraqa-state.json ]]; then
    rm -f .skc/state/ultraqa-state.json
    echo "Cleaned up: ultraqa"
  fi

  # Mark autopilot inactive but preserve state
  CURRENT_STATE=$(cat .skc/state/autopilot-state.json)
  CURRENT_PHASE=$(echo "$CURRENT_STATE" | jq -r '.phase // "unknown"')
  echo "$CURRENT_STATE" | jq '.active = false' > .skc/state/autopilot-state.json

  echo "Autopilot cancelled at phase: $CURRENT_PHASE. Progress preserved for resume."
  echo "Run /sk-claudecode:autopilot to resume."
fi
```

#### If Ralph Active (but not Autopilot)

Call `clearRalphState()` + `clearLinkedUltraworkState()` from `src/hooks/ralph-loop/index.ts:147-182`:

```bash
if [[ -f .skc/state/ralph-state.json ]]; then
  # Check if ultrawork is linked
  RALPH_STATE=$(cat .skc/state/ralph-state.json)
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

  # Clean ralph state
  rm -f .skc/state/ralph-state.json
  rm -f .skc/state/ralph-plan-state.json
  rm -f .skc/state/ralph-verification.json

  echo "Ralph cancelled. Persistent mode deactivated."
fi
```

#### If Ultrawork Active (standalone, not linked)

Call `deactivateUltrawork()` from `src/hooks/ultrawork/index.ts:150-173`:

```bash
if [[ -f .skc/state/ultrawork-state.json ]]; then
  # Check if linked to ralph
  UW_STATE=$(cat .skc/state/ultrawork-state.json)
  LINKED=$(echo "$UW_STATE" | jq -r '.linked_to_ralph // false')

  if [[ "$LINKED" == "true" ]]; then
    echo "Ultrawork is linked to Ralph. Use /sk-claudecode:cancel to cancel both."
    exit 1
  fi

  # Remove local state
  rm -f .skc/state/ultrawork-state.json

  echo "Ultrawork cancelled. Parallel execution mode deactivated."
fi
```

#### If UltraQA Active (standalone)

Call `clearUltraQAState()` from `src/hooks/ultraqa/index.ts:107-120`:

```bash
if [[ -f .skc/state/ultraqa-state.json ]]; then
  rm -f .skc/state/ultraqa-state.json
  echo "UltraQA cancelled. QA cycling workflow stopped."
fi
```

#### No Active Modes

```bash
echo "No active SKC modes detected."
echo ""
echo "Checked for:"
echo "  - Autopilot (.skc/state/autopilot-state.json)"
echo "  - Ralph (.skc/state/ralph-state.json)"
echo "  - Ultrawork (.skc/state/ultrawork-state.json)"
echo "  - UltraQA (.skc/state/ultraqa-state.json)"
echo ""
echo "Use --force to clear all state files anyway."
```
