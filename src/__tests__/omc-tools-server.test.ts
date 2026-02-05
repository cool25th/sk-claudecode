import { describe, it, expect } from 'vitest';
import { skcToolsServer, skcToolNames, getSkcToolNames } from '../mcp/skc-tools-server.js';

describe('skc-tools-server', () => {
  describe('skcToolNames', () => {
    it('should export 33 tools total', () => {
      expect(skcToolNames).toHaveLength(33);
    });

    it('should have 12 LSP tools', () => {
      const lspTools = skcToolNames.filter(n => n.includes('lsp_'));
      expect(lspTools).toHaveLength(12);
    });

    it('should have 2 AST tools', () => {
      const astTools = skcToolNames.filter(n => n.includes('ast_'));
      expect(astTools).toHaveLength(2);
    });

    it('should have python_repl tool', () => {
      expect(skcToolNames).toContain('mcp__t__python_repl');
    });

    it('should use correct MCP naming format', () => {
      skcToolNames.forEach(name => {
        expect(name).toMatch(/^mcp__t__/);
      });
    });
  });

  describe('getSkcToolNames', () => {
    it('should return all tools by default', () => {
      const tools = getSkcToolNames();
      expect(tools).toHaveLength(33);
    });

    it('should filter out LSP tools when includeLsp is false', () => {
      const tools = getSkcToolNames({ includeLsp: false });
      expect(tools.some(t => t.includes('lsp_'))).toBe(false);
      expect(tools).toHaveLength(21); // 2 AST + 1 python + 3 skills + 5 state + 6 notepad + 4 memory
    });

    it('should filter out AST tools when includeAst is false', () => {
      const tools = getSkcToolNames({ includeAst: false });
      expect(tools.some(t => t.includes('ast_'))).toBe(false);
      expect(tools).toHaveLength(31); // 12 LSP + 1 python + 3 skills + 5 state + 6 notepad + 4 memory
    });

    it('should filter out python_repl when includePython is false', () => {
      const tools = getSkcToolNames({ includePython: false });
      expect(tools.some(t => t.includes('python_repl'))).toBe(false);
      expect(tools).toHaveLength(32); // 12 LSP + 2 AST + 3 skills + 5 state + 6 notepad + 4 memory
    });

    it('should filter out skills tools', () => {
      const names = getSkcToolNames({ includeSkills: false });
      expect(names).toHaveLength(30);
      expect(names.every(n => !n.includes('load_skc_skills') && !n.includes('list_skc_skills'))).toBe(true);
    });

    it('should have 3 skills tools', () => {
      const skillsTools = skcToolNames.filter(n => n.includes('load_skc_skills') || n.includes('list_skc_skills'));
      expect(skillsTools).toHaveLength(3);
    });
  });

  describe('skcToolsServer', () => {
    it('should be defined', () => {
      expect(skcToolsServer).toBeDefined();
    });
  });
});
