# sk-claudecode

**SK-ClaudeCode** is a multi-agent orchestration system merged from multiple upstream repositories.

## Current scope

- **Agents**
  - 28 prompt files in `agents/`
  - 28 registry definitions in `src/agents/definitions.ts` (includes base + specialization variants)
  - Legacy names remain supported through prompt alias fallback (for migration compatibility)
- **Skills**
  - 74 built-in skills loaded from `skills/*/SKILL.md` (standard install mode)

## Structure

```
sk-claudecode/
├── AGENTS.md
├── agents/                 # 28 prompt markdown files
├── commands/               # command prompts
├── skills/                 # 74 skill folders and SKILL.md metadata
├── hooks/                  # runtime hooks and event handlers
├── src/                   # orchestrator, registry, installer, tools
└── docs/                   # operator documentation
```

## Agent Summary

- Core analysis and execution agents: `architect`, `executor`, `planner`, `critic`, `researcher`, `designer`, `writer`, `vision`, `qa-tester`, `ultra-executor`
- Domain specialists: `finance`, `mobile-developer`, `ontology`, `go-reviewer`, `python-reviewer`, `database-reviewer`
- Review and quality: `code-reviewer`, `tdd-guide`, `security-reviewer`, `build-fixer`, `scientist`, `researcher`, `designer-reviewer`, `writer`, `e2e-runner`
- Additional runtime fallback routes resolved at load time: tiered variants (`-low`, `-medium`, `-high`) and legacy role aliases (e.g., removed/rebased names fallback to active agent prompts when needed)

## Skill Summary (sample)

Core workflow: `orchestrate`, `plan`, `strategic-compact`, `continuous-learning`, `brainstorming`, `quality`, `verification-before-completion`

Backend + language: `backend`, `springboot`, `django`, `golang`, `python-patterns`, `jpa-patterns`, `coding-standards`, `postgres-patterns`, `clickhouse-io`

Domain: `finance`, `ontology`, `mobile`, `humanizer`, `documentation`

## Execution modes still provided

- `autopilot`, `ultrawork`, `ralph`, `pipeline`, `swarm`, `ultrapilot`, `ultraqa`, `ultra-executor`, `ecomode`

## Web Search

- Built-in `WebSearch` tool for quick lookups
- `agent-browser` CLI for browser-based web search (JS rendering, multi-page extraction)
- `web-search-browser` skill for search workflow patterns
- DuckDuckGo preferred over Google to avoid CAPTCHA

## Notes

- For alias migration details, keep `src/agents/utils.ts` and `src/agents/definitions.ts` aligned.
- For registry updates, ensure frontmatter is mirrored in prompt files and tests that read `/agents/*.md`.
- For skill updates, add/modify `skills/<skill>/SKILL.md` and ensure `createBuiltinSkills()` expectations reflect intended count.

## Sources

- [sk-claudecode](https://github.com/code-yeongyu/sk-claudecode)
- [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode)
- [claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills)
- [claude-mem](https://github.com/thedotmack/claude-mem)

*Updated: 2026-03-29*
