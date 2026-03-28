/**
 * agent-browser Full Integration Verification Test Suite
 *
 * Tests all 4 routing layers:
 * 1. Magic Keywords — browserEnhancement trigger matching
 * 2. Delegation Categories — browser-automation category detection
 * 3. System Prompt — e2e-runner presence in skcSystemPrompt
 * 4. Agent Registry — e2e-runner agent definition & skill linkage
 *
 * NOTE on Magic Keywords architecture:
 * The magic keyword system uses a 2-gate matching:
 *   Gate 1 (triggers): Uses \b word boundary — does NOT match Korean or multi-word triggers
 *   Gate 2 (action pattern): Uses full regex — matches Korean, multi-word patterns
 *
 * Therefore:
 * - English single-word triggers ('browser', 'e2e', 'screenshot') → Gate 1 opens → Gate 2 checks
 * - Korean triggers ('브라우저', '스크래핑') → Gate 1 blocks (known framework limitation)
 * - Multi-word triggers ('open website') → Gate 1 blocks (contains spaces)
 *
 * Korean/multi-word matching works when an English trigger co-occurs in the prompt.
 * This is consistent with ALL existing magic keywords (security '보안', refactor '리팩터', etc.)
 */
import { describe, it, expect } from 'vitest';
import { createMagicKeywordProcessor, detectMagicKeywords } from '../features/magic-keywords.js';
import { detectCategoryFromPrompt, resolveCategory, CATEGORY_CONFIGS } from '../features/delegation-categories/index.js';
import { getAgentDefinitions, skcSystemPrompt, e2eRunnerAgent } from '../agents/definitions.js';
import { createBuiltinSkills, getBuiltinSkill, listBuiltinSkillNames } from '../features/builtin-skills/skills.js';

describe('agent-browser Full Integration', () => {

  // ============================================================
  // 1. MAGIC KEYWORDS
  // ============================================================
  describe('Magic Keywords — browserEnhancement', () => {
    const processor = createMagicKeywordProcessor();

    describe('English single-word triggers (Gate 1 → Gate 2)', () => {
      it('should trigger on "e2e test" (trigger: "e2e")', () => {
        const result = processor('e2e test this web app');
        expect(result).toContain('[browser-mode]');
      });

      it('should trigger on "take screenshot" (trigger: "screenshot")', () => {
        const result = processor('take screenshot of the page');
        expect(result).toContain('[browser-mode]');
      });

      it('should trigger on "scrape data" (trigger: "scrape")', () => {
        const result = processor('scrape data from the website');
        expect(result).toContain('[browser-mode]');
      });

      it('should trigger on "headless browser" (trigger: "headless")', () => {
        const result = processor('run headless browser test');
        expect(result).toContain('[browser-mode]');
      });

      it('should trigger on standalone "browser automate" (trigger: "browser")', () => {
        // Note: "browser" matches Gate 1, then "browser automat*" matches Gate 2
        const result = processor('browser automation for login');
        expect(result).toContain('[browser-mode]');
      });

      it('should trigger on "crawl" keyword', () => {
        const result = processor('crawl site for data');
        expect(result).toContain('[browser-mode]');
      });

      it('should trigger on "playwright test"', () => {
        const result = processor('playwright test the form');
        expect(result).toContain('[browser-mode]');
      });
    });

    describe('Gate 2 pattern matching (when Gate 1 opens via English trigger)', () => {
      it('should match "open website" when browser trigger present', () => {
        const result = processor('use browser to open website and check login');
        expect(result).toContain('[browser-mode]');
      });

      it('should match "fill form" when e2e trigger present', () => {
        const result = processor('e2e: fill out a form and submit');
        expect(result).toContain('[browser-mode]');
      });

      it('should match "click a button" when browser trigger present', () => {
        const result = processor('browser: click a button on the page');
        expect(result).toContain('[browser-mode]');
      });

      it('should match Korean "브라우저 열어서" when e2e trigger present', () => {
        const result = processor('e2e 브라우저 열어서 테스트 해줘');
        expect(result).toContain('[browser-mode]');
      });

      it('should match Korean "스크린샷" when screenshot trigger present', () => {
        const result = processor('screenshot 스크린샷 찍어줘');
        expect(result).toContain('[browser-mode]');
      });
    });

    describe('Negative cases (should NOT trigger)', () => {
      it('should NOT trigger on "deploy to production"', () => {
        const result = processor('deploy to production');
        expect(result).not.toContain('[browser-mode]');
      });

      it('should NOT trigger on "add a database table"', () => {
        const result = processor('add a new database table');
        expect(result).not.toContain('[browser-mode]');
      });

      it('should NOT trigger on "write a REST API"', () => {
        const result = processor('write a REST API endpoint');
        expect(result).not.toContain('[browser-mode]');
      });
    });

    describe('Content validation', () => {
      it('should mention agent-browser CLI in appended content', () => {
        const result = processor('e2e test the login page');
        expect(result).toContain('agent-browser');
      });

      it('should mention e2e-runner agent in appended content', () => {
        const result = processor('e2e test the login page');
        expect(result).toContain('e2e-runner');
      });

      it('should mention snapshot pattern in appended content', () => {
        const result = processor('e2e test the login page');
        expect(result).toContain('snapshot');
      });

      it('should include BROWSER AUTOMATION PROTOCOL header', () => {
        const result = processor('e2e test the login page');
        expect(result).toContain('BROWSER AUTOMATION PROTOCOL');
      });
    });

    describe('detectMagicKeywords', () => {
      it('should detect "browser" trigger in English prompts', () => {
        const detected = detectMagicKeywords('browser automate the login flow');
        expect(detected).toContain('browser');
      });

      it('should detect "e2e" trigger', () => {
        const detected = detectMagicKeywords('e2e test this web app');
        expect(detected).toContain('e2e');
      });

      it('should detect "screenshot" trigger', () => {
        const detected = detectMagicKeywords('take a screenshot of the page');
        expect(detected).toContain('screenshot');
      });
    });
  });

  // ============================================================
  // 2. DELEGATION CATEGORIES
  // ============================================================
  describe('Delegation Categories — browser-automation', () => {
    it('should have browser-automation in CATEGORY_CONFIGS', () => {
      expect(CATEGORY_CONFIGS).toHaveProperty('browser-automation');
    });

    it('should be configured as HIGH tier', () => {
      expect(CATEGORY_CONFIGS['browser-automation'].tier).toBe('HIGH');
    });

    it('should have temperature 0.4', () => {
      expect(CATEGORY_CONFIGS['browser-automation'].temperature).toBe(0.4);
    });

    it('should have thinking budget "high"', () => {
      expect(CATEGORY_CONFIGS['browser-automation'].thinkingBudget).toBe('high');
    });

    it('should mention agent-browser in promptAppend', () => {
      expect(CATEGORY_CONFIGS['browser-automation'].promptAppend).toContain('agent-browser');
    });

    it('should mention e2e-runner in promptAppend', () => {
      expect(CATEGORY_CONFIGS['browser-automation'].promptAppend).toContain('e2e-runner');
    });

    describe('Category detection from prompts', () => {
      it('should detect browser-automation from E2E browser test prompt', () => {
        const result = detectCategoryFromPrompt('run e2e browser test on the login page with screenshot');
        expect(result).toBe('browser-automation');
      });

      it('should detect browser-automation from scrape+crawl prompt', () => {
        const result = detectCategoryFromPrompt('scrape and crawl the website');
        expect(result).toBe('browser-automation');
      });

      it('should detect browser-automation from playwright+headless prompt', () => {
        const result = detectCategoryFromPrompt('run playwright in headless mode for testing');
        expect(result).toBe('browser-automation');
      });

      it('should NOT detect browser-automation from unrelated prompt', () => {
        const result = detectCategoryFromPrompt('add a REST API endpoint');
        expect(result).not.toBe('browser-automation');
      });
    });

    describe('resolveCategory', () => {
      it('should resolve browser-automation correctly', () => {
        const resolved = resolveCategory('browser-automation');
        expect(resolved.category).toBe('browser-automation');
        expect(resolved.tier).toBe('HIGH');
        expect(resolved.temperature).toBe(0.4);
      });
    });
  });

  // ============================================================
  // 3. SYSTEM PROMPT
  // ============================================================
  describe('System Prompt — e2e-runner presence', () => {
    it('should mention e2e-runner in skcSystemPrompt', () => {
      expect(skcSystemPrompt).toContain('e2e-runner');
    });

    it('should mention browser in skcSystemPrompt', () => {
      expect(skcSystemPrompt).toContain('browser');
    });

    it('should mention agent-browser in skcSystemPrompt', () => {
      expect(skcSystemPrompt).toContain('agent-browser');
    });

    it('should list e2e-runner as an available subagent', () => {
      expect(skcSystemPrompt).toMatch(/\*\*e2e-runner\*\*/);
    });
  });

  // ============================================================
  // 4. AGENT REGISTRY
  // ============================================================
  describe('Agent Registry — e2e-runner definition', () => {
    it('should have e2e-runner in agent definitions', () => {
      const agents = getAgentDefinitions();
      expect(agents).toHaveProperty('e2e-runner');
    });

    it('should use Opus model', () => {
      const agents = getAgentDefinitions();
      expect(agents['e2e-runner'].model).toBe('opus');
    });

    it('should reference agent-browser in prompt', () => {
      const agents = getAgentDefinitions();
      expect(agents['e2e-runner'].prompt).toContain('agent-browser');
    });

    it('should reference Playwright as fallback', () => {
      const agents = getAgentDefinitions();
      expect(agents['e2e-runner'].prompt).toContain('Playwright');
    });

    it('should have correct exported agent config', () => {
      expect(e2eRunnerAgent.name).toBe('e2e-runner');
      expect(e2eRunnerAgent.model).toBe('opus');
    });
  });

  // ============================================================
  // 5. SKILL REGISTRY
  // ============================================================
  describe('Skill Registry — agent-browser skill', () => {
    it('should include agent-browser in builtin skill names', () => {
      const names = listBuiltinSkillNames();
      expect(names).toContain('agent-browser');
    });

    it('should return agent-browser from getBuiltinSkill', () => {
      const skill = getBuiltinSkill('agent-browser');
      expect(skill).toBeDefined();
      expect(skill!.name).toBe('agent-browser');
    });

    it('should have correct description', () => {
      const skill = getBuiltinSkill('agent-browser');
      expect(skill!.description).toContain('Browser automation');
    });

    it('should include agent-browser in createBuiltinSkills', () => {
      const skills = createBuiltinSkills();
      const abSkill = skills.find(s => s.name === 'agent-browser');
      expect(abSkill).toBeDefined();
    });
  });

  // ============================================================
  // 6. CROSS-REFERENCES
  // ============================================================
  describe('Cross-References', () => {
    it('data-crawling skill should reference agent-browser', () => {
      const skills = createBuiltinSkills();
      const dcSkill = skills.find(s => s.name === 'data-crawling');
      expect(dcSkill).toBeDefined();
      expect(dcSkill!.template).toContain('agent-browser');
    });

    it('should not conflict: data-crawling and agent-browser have distinct descriptions', () => {
      const dcSkill = getBuiltinSkill('data-crawling');
      const abSkill = getBuiltinSkill('agent-browser');
      expect(dcSkill!.description).not.toBe(abSkill!.description);
    });
  });
});
