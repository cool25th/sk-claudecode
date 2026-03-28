/**
 * Tracer Agent - Runtime Execution Tracing and Profiling
 *
 * READ-ONLY diagnostic agent for runtime execution tracing,
 * performance profiling, and concurrency issue diagnosis.
 *
 * Inspired by oh-my-claudecode's tracer agent concept.
 */

import type { AgentConfig, AgentPromptMetadata } from './types.js';
import { loadAgentPrompt } from './utils.js';

export const TRACER_PROMPT_METADATA: AgentPromptMetadata = {
  category: 'advisor',
  cost: 'EXPENSIVE',
  promptAlias: 'tracer',
  triggers: [
    { domain: 'Performance bottleneck', trigger: 'Slow execution, high latency' },
    { domain: 'Race condition', trigger: 'Intermittent failures, data corruption' },
    { domain: 'Memory leak', trigger: 'Growing memory usage over time' },
  ],
  useWhen: [
    'Runtime debugging (execution flow tracing)',
    'Performance profiling and bottleneck identification',
    'Race condition / concurrency diagnosis',
    'Memory leak detection',
    'Stack trace analysis and call graph mapping',
    'Log correlation and timeline reconstruction',
  ],
  avoidWhen: [
    'Static code analysis (use architect)',
    'Code needs fixing (use executor)',
    'Test creation (use tdd-guide)',
    'Simple error messages (read the error)',
  ],
};

// Prompt loaded dynamically from agents/tracer.md (authoritative source)

export const tracerAgent: AgentConfig = {
  name: 'tracer',
  description: 'Read-only runtime tracing and profiling specialist (Opus). Use for execution flow analysis, performance bottlenecks, and concurrency issues.',
  prompt: loadAgentPrompt('tracer'),
  model: 'opus',
  defaultModel: 'opus',
  metadata: TRACER_PROMPT_METADATA
};
