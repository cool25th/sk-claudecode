/**
 * Builtin Skills Feature
 *
 * Provides bundled skills for SK-ClaudeCode-Sisyphus.
 *
 * Adapted from oh-my-opencode's builtin-skills feature.
 */

export * from './types.js';
export {
    createBuiltinSkills,
    getBuiltinSkill,
    listBuiltinSkillNames,
    setInstallMode,
    getInstallMode,
    getSkillStats,
    clearSkillsCache,
    loadInstallModeFromConfig
} from './skills.js';
export type { InstallMode } from './skills.js';
