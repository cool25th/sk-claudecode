/**
 * Builtin Skills Definitions
 *
 * Loads skills from bundled SKILL.md files in the skills directory.
 * This provides a single source of truth for skill definitions.
 *
 * Skills are loaded from project_root/skills/SKILLNAME/SKILL.md
 *
 * Features:
 * - Caching: Skills are cached after first load
 * - Lazy Loading: Scientific skills loaded on-demand (16MB+ folder)
 * - Install Modes: --minimal (core only), --full (all including scientific)
 *
 * Adapted from oh-my-opencode's builtin-skills feature.
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { BuiltinSkill } from './types.js';

// Get the project root directory (go up from src/features/builtin-skills/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..', '..', '..');
const SKILLS_DIR = join(PROJECT_ROOT, 'skills');

// Lazy-loaded skill folders (large skill sets loaded on-demand)
const LAZY_LOAD_FOLDERS = ['scientific'];

// Install mode configuration
export type InstallMode = 'minimal' | 'standard' | 'full';
let currentInstallMode: InstallMode = 'standard';

/**
 * Set the install mode for skill loading
 * - 'minimal': Core skills only, excludes large skill sets
 * - 'standard': All skills except lazy-loaded (default)
 * - 'full': All skills including large sets like scientific
 */
export function setInstallMode(mode: InstallMode): void {
  currentInstallMode = mode;
  clearSkillsCache(); // Clear cache when mode changes
}

/**
 * Get current install mode
 */
export function getInstallMode(): InstallMode {
  return currentInstallMode;
}

/**
 * Parse YAML-like frontmatter from markdown file
 */
function parseFrontmatter(content: string): { data: Record<string, string>; body: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { data: {}, body: content };
  }

  const [, yamlContent, body] = match;
  const data: Record<string, string> = {};

  for (const line of yamlContent.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Remove surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    data[key] = value;
  }

  return { data, body };
}

/**
 * Load a single skill from a SKILL.md file
 */
function loadSkillFromFile(skillPath: string, skillName: string): BuiltinSkill | null {
  try {
    const content = readFileSync(skillPath, 'utf-8');
    const { data, body } = parseFrontmatter(content);

    return {
      name: data.name || skillName,
      description: data.description || '',
      template: body.trim(),
      // Optional fields from frontmatter
      model: data.model,
      agent: data.agent,
      argumentHint: data['argument-hint'],
    };
  } catch {
    return null;
  }
}

/**
 * Check if a skill folder should be lazy-loaded based on current mode
 */
function shouldLazyLoad(folderName: string): boolean {
  if (currentInstallMode === 'full') {
    return false; // Load everything immediately in full mode
  }
  return LAZY_LOAD_FOLDERS.includes(folderName);
}

/**
 * Load all skills from the skills/ directory
 */
function loadSkillsFromDirectory(): BuiltinSkill[] {
  if (!existsSync(SKILLS_DIR)) {
    return [];
  }

  const skills: BuiltinSkill[] = [];

  try {
    const entries = readdirSync(SKILLS_DIR, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      // Skip lazy-loaded folders in non-full mode
      if (shouldLazyLoad(entry.name)) continue;

      const skillPath = join(SKILLS_DIR, entry.name, 'SKILL.md');
      if (existsSync(skillPath)) {
        const skill = loadSkillFromFile(skillPath, entry.name);
        if (skill) {
          skills.push(skill);
        }
      }
    }
  } catch {
    // Return empty array if directory read fails
    return [];
  }

  return skills;
}

// Cache loaded skills to avoid repeated file reads
let cachedSkills: BuiltinSkill[] | null = null;

// Separate cache for lazy-loaded skills
const lazyLoadedSkillsCache: Map<string, BuiltinSkill[]> = new Map();

/**
 * Load skills from a lazy-loaded folder on demand
 */
function loadLazySkillsFolder(folderName: string): BuiltinSkill[] {
  if (lazyLoadedSkillsCache.has(folderName)) {
    return lazyLoadedSkillsCache.get(folderName)!;
  }

  const folderPath = join(SKILLS_DIR, folderName);
  if (!existsSync(folderPath)) {
    return [];
  }

  const skills: BuiltinSkill[] = [];
  const skillPath = join(folderPath, 'SKILL.md');

  if (existsSync(skillPath)) {
    const skill = loadSkillFromFile(skillPath, folderName);
    if (skill) {
      skills.push(skill);
    }
  }

  // Also check for subdirectories with SKILL.md files
  try {
    const entries = readdirSync(folderPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const subSkillPath = join(folderPath, entry.name, 'SKILL.md');
      if (existsSync(subSkillPath)) {
        const skill = loadSkillFromFile(subSkillPath, `${folderName}/${entry.name}`);
        if (skill) {
          skills.push(skill);
        }
      }
    }
  } catch {
    // Ignore errors reading subdirectories
  }

  lazyLoadedSkillsCache.set(folderName, skills);
  return skills;
}

/**
 * Get all builtin skills
 *
 * Skills are loaded from bundled SKILL.md files in the skills/ directory.
 * Results are cached after first load.
 * 
 * Note: In 'standard' mode, scientific skills are NOT included.
 * Use getBuiltinSkill('scientific/...') to load them on demand.
 */
export function createBuiltinSkills(): BuiltinSkill[] {
  if (cachedSkills === null) {
    cachedSkills = loadSkillsFromDirectory();
  }
  return cachedSkills;
}

/**
 * Get a skill by name
 * 
 * Supports lazy loading for scientific skills:
 * - 'scientific' or 'scientific/domain' will trigger lazy load
 */
export function getBuiltinSkill(name: string): BuiltinSkill | undefined {
  const normalizedName = name.toLowerCase();

  // Check if requesting a lazy-loaded skill
  for (const lazyFolder of LAZY_LOAD_FOLDERS) {
    if (normalizedName === lazyFolder || normalizedName.startsWith(`${lazyFolder}/`)) {
      // Load the lazy folder if not in cache
      const lazySkills = loadLazySkillsFolder(lazyFolder);
      const found = lazySkills.find(s => s.name.toLowerCase() === normalizedName);
      if (found) return found;
    }
  }

  // Check regular cached skills
  const skills = createBuiltinSkills();
  return skills.find(s => s.name.toLowerCase() === normalizedName);
}

/**
 * List all builtin skill names
 * 
 * Note: Does NOT include lazy-loaded skills by default.
 * Pass includeAll=true to include lazy-loaded skill names.
 */
export function listBuiltinSkillNames(includeAll = false): string[] {
  const names = createBuiltinSkills().map(s => s.name);

  if (includeAll || currentInstallMode === 'full') {
    // Add lazy-loaded folder names as placeholders
    for (const folder of LAZY_LOAD_FOLDERS) {
      if (!names.some(n => n.startsWith(folder))) {
        names.push(`${folder} (lazy-loaded)`);
      }
    }
  }

  return names;
}

/**
 * Clear the skills cache (useful for testing)
 */
export function clearSkillsCache(): void {
  cachedSkills = null;
  lazyLoadedSkillsCache.clear();
}

/**
 * Get the skills directory path (useful for debugging)
 */
export function getSkillsDir(): string {
  return SKILLS_DIR;
}

/**
 * Get skill loading statistics
 */
export function getSkillStats(): { loaded: number; lazyFolders: string[]; mode: InstallMode } {
  return {
    loaded: cachedSkills?.length ?? 0,
    lazyFolders: LAZY_LOAD_FOLDERS,
    mode: currentInstallMode
  };
}
