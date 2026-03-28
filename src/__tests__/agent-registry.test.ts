import { describe, test, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { getAgentDefinitions } from '../agents/definitions.js';
import { loadAgentPrompt } from '../agents/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Agent Registry Validation', () => {
  const aliasMappings: Array<[string, string]> = [
    ['architect-low', 'architect'],
    ['architect-medium', 'architect'],
    ['executor-low', 'executor'],
    ['researcher-low', 'researcher'],
    ['designer-low', 'designer'],
    ['designer-high', 'designer'],
    ['explore-low', 'explore'],
    ['explore-medium', 'explore'],
    ['explore-high', 'explore'],
    ['qa-tester-high', 'qa-tester'],
    ['scientist-low', 'scientist'],
    ['scientist-high', 'scientist'],
    ['security-reviewer-low', 'security-reviewer'],
    ['build-fixer-low', 'build-fixer'],
    ['tdd-guide-low', 'tdd-guide'],
    ['code-reviewer-low', 'code-reviewer'],
    ['finance-expert', 'finance'],
    ['finance-developer', 'finance'],
    ['ontology-expert', 'ontology'],
    ['ontology-developer', 'ontology'],
    ['ontology-reviewer', 'ontology'],
    ['mobile-developer-low', 'mobile-developer'],
    ['mobile-developer-high', 'mobile-developer'],
    ['deep-executor', 'ultra-executor']
  ];

  test('agent count matches documentation', () => {
    const agents = getAgentDefinitions();
    // 29 prompt files + 11 tier/alias variants = 40 total definitions
    expect(Object.keys(agents).length).toBe(40);
  });

  test('all agents have .md prompt files', () => {
    const agents = Object.keys(getAgentDefinitions());
    for (const name of agents) {
      const prompt = loadAgentPrompt(name);
      expect(prompt, `Prompt unavailable for agent: ${name}`).not.toContain('Prompt unavailable');
    }
  });

  test('agent aliases resolve to canonical prompt content', () => {
    for (const [alias, canonical] of aliasMappings) {
      const aliasPrompt = loadAgentPrompt(alias);
      const canonicalPrompt = loadAgentPrompt(canonical);
      expect(aliasPrompt, `${alias} should resolve to ${canonical} prompt`).toBe(canonicalPrompt);
    }
  });

  test('all registry agents are exported from index.ts', async () => {
    const registryAgents = Object.keys(getAgentDefinitions());
    const exports = await import('../agents/index.js') as Record<string, unknown>;
    for (const name of registryAgents) {
      const exportName = name.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase()) + 'Agent';
      expect(exports[exportName], `Missing export for agent: ${name} (expected ${exportName})`).toBeDefined();
    }
  });

  test('no hardcoded prompts in base agent .ts files', () => {
    const baseAgents = ['architect', 'executor', 'explore', 'designer', 'researcher',
      'writer', 'vision', 'planner', 'critic', 'scientist', 'qa-tester'];
    const agentsDir = path.join(__dirname, '../agents');
    for (const name of baseAgents) {
      const content = fs.readFileSync(path.join(agentsDir, `${name}.ts`), 'utf-8');
      expect(content, `Hardcoded prompt found in ${name}.ts`).not.toMatch(/const\s+\w+_PROMPT\s*=\s*`/);
    }
  });
});
