# sk-claudecode

**SK-ClaudeCode** is a multi-agent orchestration system merged from multiple upstream repositories.

## Current scope

- **Agents**
  - 28 prompt files in `agents/`
  - 45 registry definitions in `src/agents/definitions.ts`
  - Legacy names remain supported through prompt alias fallback (for migration compatibility)
- **Skills**
  - 69 built-in skills loaded from `skills/*/SKILL.md` (standard install mode)

## Structure

```
sk-claudecode/
├── AGENTS.md
├── agents/                 # 28 prompt markdown files
├── commands/               # command prompts
├── skills/                 # 69 skill folders and SKILL.md metadata
├── hooks/                  # runtime hooks and event handlers
├── src/                   # orchestrator, registry, installer, tools
└── docs/                   # operator documentation
```

## Agent Summary

- Core analysis and execution agents: `architect`, `executor`, `planner`, `critic`, `researcher`, `designer`, `writer`, `vision`, `qa-tester`, `ultra-executor`
- Domain specialists: `finance`, `mobile-developer`, `ontology`, `go-reviewer`, `python-reviewer`, `database-reviewer`
- Review and quality: `code-reviewer`, `tdd-guide`, `security-reviewer`, `build-fixer`, `scientist`, `researcher`, `designer-reviewer`, `document-writer`, `e2e-runner`
- Additional alias routes resolved at runtime: tiered variants (`-low`, `-medium`, `-high`) and consolidated role aliases (e.g., `finance-expert` -> `finance`)

## Skill Summary (sample)

Core workflow: `orchestrate`, `plan`, `strategic-compact`, `continuous-learning`, `brainstorming`, `quality`, `verification-before-completion`

Backend + language: `backend`, `springboot`, `django`, `golang`, `python-patterns`, `jpa-patterns`, `coding-standards`, `postgres-patterns`, `clickhouse-io`

Domain: `finance`, `ontology`, `mobile`, `humanizer`, `documentation`

## Execution modes still provided

- `autopilot`, `ultrawork`, `ralph`, `pipeline`, `swarm`, `ultrapilot`, `ultraqa`, `ultra-executor`, `ecomode`

## Notes

- For alias migration details, keep `src/agents/utils.ts` and `src/agents/definitions.ts` aligned.
- For registry updates, ensure frontmatter is mirrored in prompt files and tests that read `/agents/*.md`.
- For skill updates, add/modify `skills/<skill>/SKILL.md` and ensure `createBuiltinSkills()` expectations reflect intended count.

## Sources

- [sk-claudecode](https://github.com/code-yeongyu/sk-claudecode)
- [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode)
- [claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills)
- [claude-mem](https://github.com/thedotmack/claude-mem)

*Updated: 2026-02-23*
