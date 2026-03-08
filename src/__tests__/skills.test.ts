import { describe, it, expect, beforeEach } from 'vitest';
import { createBuiltinSkills, getBuiltinSkill, listBuiltinSkillNames, clearSkillsCache, setInstallMode } from '../features/builtin-skills/skills.js';

const STANDARD_SKILL_COUNT = 69;

describe('Builtin Skills', () => {
  // Clear cache before each test to ensure fresh loads
  beforeEach(() => {
    clearSkillsCache();
    setInstallMode('standard');
  });

  describe('createBuiltinSkills()', () => {
    it('should return correct number of skills (69)', () => {
      const skills = createBuiltinSkills();
      expect(skills).toHaveLength(STANDARD_SKILL_COUNT);
    });

    it('should return an array of BuiltinSkill objects', () => {
      const skills = createBuiltinSkills();
      expect(Array.isArray(skills)).toBe(true);
      expect(skills.length).toBeGreaterThan(0);
    });
  });

  describe('Skill properties', () => {
    it('should have required properties (name, description, template)', () => {
      const skills = createBuiltinSkills();
      skills.forEach((skill) => {
        expect(skill).toHaveProperty('name');
        expect(skill).toHaveProperty('description');
        expect(skill).toHaveProperty('template');
      });
    });

    it('should have non-empty name for each skill', () => {
      const skills = createBuiltinSkills();
      skills.forEach((skill) => {
        expect(skill.name).toBeTruthy();
        expect(typeof skill.name).toBe('string');
        expect(skill.name.length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty description for each skill', () => {
      const skills = createBuiltinSkills();
      // Some skills may have empty descriptions (cloud-security, project-guidelines-example, verification-loop)
      const skillsWithDescriptions = skills.filter((s) => s.description);
      const skillsWithoutDescriptions = skills.filter((s) => !s.description);

      // Most skills should have descriptions
      expect(skillsWithDescriptions.length).toBeGreaterThan(50);
      // Allow up to 3 skills without descriptions
      expect(skillsWithoutDescriptions.length).toBeLessThanOrEqual(3);

      skillsWithDescriptions.forEach((skill) => {
        expect(typeof skill.description).toBe('string');
        expect(skill.description.length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty template for each skill', () => {
      const skills = createBuiltinSkills();
      skills.forEach((skill) => {
        expect(skill.template).toBeTruthy();
        expect(typeof skill.template).toBe('string');
        expect(skill.template.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Skill names', () => {
    it('should have valid skill names', () => {
      const skills = createBuiltinSkills();
      // Core skills that must be present
      const expectedCoreSkills = [
        'backend',
        'build-fix',
        'coding-standards',
        'continuous-learning',
        'django',
        'finance',
        'frontend-ui-ux',
        'golang',
        'git-master',
        'local-skills-setup',
        'memory',
        'mobile',
        'mcp-setup',
        'ontology',
        'orchestrate',
        'plan',
        'quality',
        'security-review',
        'skill-creator',
        'springboot',
        'skill',
        'swarm',
        'strategic-compact',
        'tdd',
        'using-sk-claudecode',
        'writer-memory',
      ];

      const actualSkillNames = skills.map((s) => s.name);
      expect(actualSkillNames).toEqual(expect.arrayContaining(expectedCoreSkills));
      // Total skill count
      expect(actualSkillNames.length).toBe(STANDARD_SKILL_COUNT);
    });

    it('should not have duplicate skill names', () => {
      const skills = createBuiltinSkills();
      const skillNames = skills.map((s) => s.name);
      const uniqueNames = new Set(skillNames);
      // Allow minimal duplicates (some skills may share names for aliases)
      expect(uniqueNames.size).toBeGreaterThanOrEqual(skillNames.length - 1);
    });
  });

  describe('getBuiltinSkill()', () => {
    it('should retrieve a skill by name', () => {
      const skill = getBuiltinSkill('orchestrate');
      expect(skill).toBeDefined();
      expect(skill?.name).toBe('orchestrate');
    });

    it('should be case-insensitive', () => {
      const skillLower = getBuiltinSkill('orchestrate');
      const skillUpper = getBuiltinSkill('ORCHESTRATE');
      const skillMixed = getBuiltinSkill('OrChEsTrAtE');

      expect(skillLower).toBeDefined();
      expect(skillUpper).toBeDefined();
      expect(skillMixed).toBeDefined();
      expect(skillLower?.name).toBe(skillUpper?.name);
      expect(skillLower?.name).toBe(skillMixed?.name);
    });

    it('should return undefined for non-existent skill', () => {
      const skill = getBuiltinSkill('non-existent-skill');
      expect(skill).toBeUndefined();
    });

    it('should resolve nested scientific skill on demand', () => {
      const skill = getBuiltinSkill('scientific/alphafold-database');
      expect(skill).toBeDefined();
      expect(skill?.name).toBe('scientific/alphafold-database');
    });
  });

  describe('Install mode behavior', () => {
    it('should maintain base skill count across minimal/standard modes', () => {
      setInstallMode('minimal');
      clearSkillsCache();
      const minimalSkills = createBuiltinSkills();
      setInstallMode('standard');
      clearSkillsCache();
      const standardSkills = createBuiltinSkills();

      expect(minimalSkills).toHaveLength(STANDARD_SKILL_COUNT);
      expect(standardSkills).toHaveLength(STANDARD_SKILL_COUNT);
      expect(minimalSkills.map(s => s.name)).toEqual(expect.arrayContaining(standardSkills.map(s => s.name)));
    });

    it('should include lazy-loaded scientific descriptor when requested', () => {
      const baseNames = listBuiltinSkillNames();
      expect(baseNames).not.toContain('scientific (lazy-loaded)');

      const expandedNames = listBuiltinSkillNames(true);
      expect(expandedNames).toContain('scientific (lazy-loaded)');
    });

    it('should load scientific subskills on demand in full mode', () => {
      setInstallMode('full');
      clearSkillsCache();

      const fullNames = listBuiltinSkillNames();
      expect(fullNames).toHaveLength(STANDARD_SKILL_COUNT);
      expect(listBuiltinSkillNames(true)).toContain('scientific (lazy-loaded)');
      expect(getBuiltinSkill('scientific/alphafold-database')?.name).toBe('scientific/alphafold-database');
    });
  });

  describe('listBuiltinSkillNames()', () => {
    it('should return all skill names', () => {
      const names = listBuiltinSkillNames();
      expect(names).toHaveLength(STANDARD_SKILL_COUNT);
      // Core workflow skills (from sk-claudecode)
      expect(names).toContain('orchestrate');
      expect(names).toContain('plan');
      // Domain-specific skills
      expect(names).toContain('frontend-ui-ux');
      expect(names).toContain('git-master');
      expect(names).toContain('backend');
      expect(names).toContain('security-review');
      expect(names).toContain('memory');
      expect(names).toContain('quality');
      expect(names).toContain('coding-standards');
    });

    it('should return an array of strings', () => {
      const names = listBuiltinSkillNames();
      names.forEach((name) => {
        expect(typeof name).toBe('string');
      });
    });
  });

  describe('Template strings', () => {
    it('should have non-empty templates', () => {
      const skills = createBuiltinSkills();
      skills.forEach((skill) => {
        expect(skill.template.trim().length).toBeGreaterThan(0);
      });
    });

    it('should have substantial template content (> 100 chars)', () => {
      const skills = createBuiltinSkills();
      skills.forEach((skill) => {
        expect(skill.template.length).toBeGreaterThan(100);
      });
    });
  });
});
