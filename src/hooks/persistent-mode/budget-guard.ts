/**
 * Budget Guard - Global safety limit for persistent mode hooks
 *
 * Provides a cross-mode safety net that prevents runaway token consumption
 * by tracking total stop-blocks per session and enforcing global limits.
 *
 * This works as a "last resort" — individual mode limits (Ralph max_iterations,
 * Ultrawork max_reinforcements, etc.) should normally trigger first.
 * The Budget Guard catches edge cases where multiple modes interact or
 * individual limits are misconfigured.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

// ============================================================================
// Types
// ============================================================================

export interface BudgetGuardConfig {
  /** Maximum number of stop-blocks per session (default: 100) */
  maxStopBlocksPerSession: number;
  /** Minimum interval between stop-blocks in ms (default: 3000) */
  minBlockIntervalMs: number;
  /** Maximum estimated tokens injected via hook messages per session (default: 100_000) */
  maxEstimatedTokensPerSession: number;
}

export interface BudgetGuardState {
  /** Session ID this state is bound to */
  session_id: string;
  /** Total number of stop-blocks issued this session */
  total_blocks: number;
  /** Estimated total tokens injected via hook messages */
  estimated_tokens_injected: number;
  /** Timestamp of last stop-block */
  last_block_at: string;
  /** When tracking started */
  started_at: string;
  /** Whether the budget has been exceeded (sticky flag) */
  budget_exceeded: boolean;
}

// ============================================================================
// Constants
// ============================================================================

export const DEFAULT_BUDGET_CONFIG: BudgetGuardConfig = {
  maxStopBlocksPerSession: 100,
  minBlockIntervalMs: 3000,
  maxEstimatedTokensPerSession: 100_000,
};

/** Average characters per token for rough estimation */
const CHARS_PER_TOKEN = 4;

const STATE_FILENAME = 'budget-guard-state.json';

// ============================================================================
// State Management
// ============================================================================

function getStatePath(directory: string): string {
  return join(directory, '.skc', 'state', STATE_FILENAME);
}

function readBudgetState(directory: string, sessionId: string): BudgetGuardState | null {
  const statePath = getStatePath(directory);
  try {
    if (!existsSync(statePath)) return null;
    const raw = readFileSync(statePath, 'utf-8');
    const state = JSON.parse(raw) as BudgetGuardState;
    // Only return state for matching session
    if (state.session_id !== sessionId) return null;
    return state;
  } catch {
    return null;
  }
}

function writeBudgetState(directory: string, state: BudgetGuardState): void {
  const statePath = getStatePath(directory);
  const dir = dirname(statePath);
  try {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(statePath, JSON.stringify(state, null, 2));
  } catch {
    // Best-effort — don't crash the hook system
  }
}

// ============================================================================
// Core Logic
// ============================================================================

export interface BudgetCheckResult {
  /** Whether the budget is exceeded */
  exceeded: boolean;
  /** Human-readable reason if exceeded */
  reason?: string;
  /** Whether to apply rate-limiting (too frequent blocks) */
  rateLimited: boolean;
  /** Current usage stats */
  stats: {
    totalBlocks: number;
    maxBlocks: number;
    estimatedTokens: number;
    maxTokens: number;
  };
}

/**
 * Check if a stop-block should be allowed based on budget constraints.
 * Call this BEFORE executing any persistent mode's block logic.
 *
 * @param directory - Project working directory
 * @param sessionId - Current session ID
 * @param messageLength - Length of the message that would be injected (in chars)
 * @param config - Optional custom budget configuration
 */
export function checkBudget(
  directory: string,
  sessionId: string,
  messageLength: number = 0,
  config: BudgetGuardConfig = DEFAULT_BUDGET_CONFIG
): BudgetCheckResult {
  if (!sessionId) {
    return { exceeded: false, rateLimited: false, stats: { totalBlocks: 0, maxBlocks: config.maxStopBlocksPerSession, estimatedTokens: 0, maxTokens: config.maxEstimatedTokensPerSession } };
  }

  let state = readBudgetState(directory, sessionId);
  const now = Date.now();

  if (!state) {
    state = {
      session_id: sessionId,
      total_blocks: 0,
      estimated_tokens_injected: 0,
      last_block_at: '',
      started_at: new Date().toISOString(),
      budget_exceeded: false,
    };
  }

  // If budget was already exceeded, stay exceeded (sticky)
  if (state.budget_exceeded) {
    return {
      exceeded: true,
      reason: `[BUDGET GUARD] Session budget was previously exceeded. Run /sk-claudecode:cancel to reset.`,
      rateLimited: false,
      stats: {
        totalBlocks: state.total_blocks,
        maxBlocks: config.maxStopBlocksPerSession,
        estimatedTokens: state.estimated_tokens_injected,
        maxTokens: config.maxEstimatedTokensPerSession,
      },
    };
  }

  // Check total blocks limit
  if (state.total_blocks >= config.maxStopBlocksPerSession) {
    state.budget_exceeded = true;
    writeBudgetState(directory, state);
    return {
      exceeded: true,
      reason: `[BUDGET GUARD] Max stop-blocks (${config.maxStopBlocksPerSession}) reached for this session. ` +
              `This likely indicates a loop. All persistent modes will be allowed to stop.`,
      rateLimited: false,
      stats: {
        totalBlocks: state.total_blocks,
        maxBlocks: config.maxStopBlocksPerSession,
        estimatedTokens: state.estimated_tokens_injected,
        maxTokens: config.maxEstimatedTokensPerSession,
      },
    };
  }

  // Check estimated token limit
  const estimatedNewTokens = Math.ceil(messageLength / CHARS_PER_TOKEN);
  if (state.estimated_tokens_injected + estimatedNewTokens > config.maxEstimatedTokensPerSession) {
    state.budget_exceeded = true;
    writeBudgetState(directory, state);
    return {
      exceeded: true,
      reason: `[BUDGET GUARD] Estimated token injection limit (~${config.maxEstimatedTokensPerSession} tokens) reached. ` +
              `This session has consumed excessive tokens via hook messages.`,
      rateLimited: false,
      stats: {
        totalBlocks: state.total_blocks,
        maxBlocks: config.maxStopBlocksPerSession,
        estimatedTokens: state.estimated_tokens_injected,
        maxTokens: config.maxEstimatedTokensPerSession,
      },
    };
  }

  // Check rate limiting
  const lastBlockTime = state.last_block_at ? new Date(state.last_block_at).getTime() : 0;
  const timeSinceLastBlock = Number.isFinite(lastBlockTime) ? now - lastBlockTime : Infinity;
  const rateLimited = timeSinceLastBlock < config.minBlockIntervalMs;

  // Update state
  state.total_blocks++;
  state.estimated_tokens_injected += estimatedNewTokens;
  state.last_block_at = new Date().toISOString();
  writeBudgetState(directory, state);

  return {
    exceeded: false,
    rateLimited,
    stats: {
      totalBlocks: state.total_blocks,
      maxBlocks: config.maxStopBlocksPerSession,
      estimatedTokens: state.estimated_tokens_injected,
      maxTokens: config.maxEstimatedTokensPerSession,
    },
  };
}

/**
 * Reset budget guard state (called on /sk-claudecode:cancel)
 */
export function resetBudgetGuard(directory: string): void {
  const statePath = getStatePath(directory);
  try {
    if (existsSync(statePath)) {
      const { unlinkSync } = require('fs');
      unlinkSync(statePath);
    }
  } catch {
    // Best-effort cleanup
  }
}
