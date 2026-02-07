/**
 * Agents Module Exports
 *
 * New modular agent system with individual files and metadata.
 * Maintains backward compatibility with definitions.ts exports.
 */

// Types
export * from './types.js';

// Utilities
export {
  createAgentToolRestrictions,
  mergeAgentConfig,
  buildDelegationTable,
  buildUseAvoidSection,
  createEnvContext,
  getAvailableAgents,
  buildKeyTriggersSection,
  validateAgentConfig,
  deepMerge,
  loadAgentPrompt
} from './utils.js';

// Individual agent exports (rebranded intuitive names)
export { architectAgent, ARCHITECT_PROMPT_METADATA } from './architect.js';
export { exploreAgent, EXPLORE_PROMPT_METADATA } from './explore.js';
export { researcherAgent, RESEARCHER_PROMPT_METADATA } from './researcher.js';
export { executorAgent, SISYPHUS_JUNIOR_PROMPT_METADATA } from './executor.js';
export { designerAgent, FRONTEND_ENGINEER_PROMPT_METADATA } from './designer.js';
export { writerAgent, DOCUMENT_WRITER_PROMPT_METADATA } from './writer.js';
export { visionAgent, MULTIMODAL_LOOKER_PROMPT_METADATA } from './vision.js';
export { criticAgent, CRITIC_PROMPT_METADATA } from './critic.js';
// analyst removed — use planner for requirements analysis
export { plannerAgent, PLANNER_PROMPT_METADATA } from './planner.js';
export { qaTesterAgent, QA_TESTER_PROMPT_METADATA } from './qa-tester.js';
export { scientistAgent, SCIENTIST_PROMPT_METADATA } from './scientist.js';
export { ultraExecutorAgent, ULTRA_EXECUTOR_PROMPT_METADATA } from './ultra-executor.js';

// Tiered agent variants (prompts loaded dynamically from /agents/*.md)
export {
  architectMediumAgent,
  architectLowAgent,
  executorLowAgent,
  researcherLowAgent,
  designerLowAgent,
  designerHighAgent,
  qaTesterHighAgent,
  scientistLowAgent,
  scientistHighAgent,
  scientistReviewerAgent,
  designerReviewerAgent,
  ontologyReviewerAgent
} from './definitions.js';

// Specialized agents (Security, Build, TDD, Code Review, Git)
export {
  securityReviewerAgent,
  securityReviewerLowAgent,
  buildFixerAgent,
  buildFixerLowAgent,
  tddGuideAgent,
  tddGuideLowAgent,
  codeReviewerAgent,
  codeReviewerLowAgent,
  gitMasterAgent
} from './definitions.js';

// Domain agents (Finance, Mobile, Ontology, Language-specific, E2E)
export {
  databaseReviewerAgent,
  e2eRunnerAgent,
  financeDeveloperAgent,
  financeExpertAgent,
  goReviewerAgent,
  pythonReviewerAgent,
  mobileDeveloperAgent,
  mobileDeveloperHighAgent,
  mobileDeveloperLowAgent,
  ontologyDeveloperAgent,
  ontologyExpertAgent,
  refactorCleanerAgent
} from './definitions.js';

// Core exports (getAgentDefinitions and skcSystemPrompt)
export {
  getAgentDefinitions,
  skcSystemPrompt
} from './definitions.js';

// Deprecated exports (for backward compatibility)
export {
  coordinatorAgent,
  ORCHESTRATOR_SISYPHUS_PROMPT_METADATA
} from './coordinator-deprecated.js';
