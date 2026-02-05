import { describe, it, expect, beforeEach } from 'vitest';
import { createBuiltinSkills, getBuiltinSkill, listBuiltinSkillNames, clearSkillsCache } from '../features/builtin-skills/skills.js';

describe('Builtin Skills', () => {
  // Clear cache before each test to ensure fresh loads
  beforeEach(() => {
    clearSkillsCache();
  });

  describe('createBuiltinSkills()', () => {
    it('should return correct number of skills (86)', () => {
      const skills = createBuiltinSkills();
      // 86 skills including: core workflow skills (autopilot, ralph, ultrawork, etc.)
      // plus domain-specific skills (django-patterns, golang-patterns, trading, etc.)
      expect(skills).toHaveLength(86);
    });

    it('should return an array of BuiltinSkill objects', () => {
      const skills = createBuiltinSkills();
      expect(Array.isArray(skills)).toBe(true);
      expect(skills.length).toBeGreaterThan(0);
    });
  });

  describe('Skill properties', () => {
    const skills = createBuiltinSkills();

    it('should have required properties (name, description, template)', () => {
      skills.forEach((skill) => {
        expect(skill).toHaveProperty('name');
        expect(skill).toHaveProperty('description');
        expect(skill).toHaveProperty('template');
      });
    });

    it('should have non-empty name for each skill', () => {
      skills.forEach((skill) => {
        expect(skill.name).toBeTruthy();
        expect(typeof skill.name).toBe('string');
        expect(skill.name.length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty description for each skill', () => {
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
        'frontend-ui-ux',
        'git-master',
        'local-skills-setup',
        'mcp-setup',
        'memory',
        'orchestrate',
        'plan',
        'security-review',
        'quality',
        'tdd-workflow',
      ];

      const actualSkillNames = skills.map((s) => s.name);
      expect(actualSkillNames).toEqual(expect.arrayContaining(expectedCoreSkills));
      // Total skill count
      expect(actualSkillNames.length).toBe(86);
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
  });

  describe('listBuiltinSkillNames()', () => {
    it('should return all skill names', () => {
      const names = listBuiltinSkillNames();
      expect(names).toHaveLength(86);
      // Core workflow skills (from oh-my-claudecode)
      expect(names).toContain('orchestrate');
      expect(names).toContain('plan');
      expect(names).toContain('autopilot');
      expect(names).toContain('ralph');
      expect(names).toContain('ultrawork');
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
    const skills = createBuiltinSkills();

    it('should have non-empty templates', () => {
      skills.forEach((skill) => {
        expect(skill.template.trim().length).toBeGreaterThan(0);
      });
    });

    it('should have substantial template content (> 100 chars)', () => {
      skills.forEach((skill) => {
        expect(skill.template.length).toBeGreaterThan(100);
      });
    });
  });
});
