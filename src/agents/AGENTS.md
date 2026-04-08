# agents

Consolidated agent set for sk-claudecode.

## Current state

- **28 agent prompt files** in `/agents`
- **28 agent definitions** in `src/agents/definitions.ts`  
  (legacy tier/alias names are supported through fallback prompt resolution in `loadAgentPrompt`)

## Prompt Files

Prompt source files under `/agents`:

```
architect.md
build-fixer.md
code-reviewer.md
critic.md
database-reviewer.md
designer-reviewer.md
designer.md
writer.md
e2e-runner.md
executor.md
explore.md
finance.md
git-master.md
go-reviewer.md
mobile-developer.md
ontology.md
planner.md
python-reviewer.md
qa-tester.md
refactor-cleaner.md
researcher.md
scientist.md
scientist-reviewer.md
security-reviewer.md
tdd-guide.md
ultra-executor.md
vision.md
writer.md
```

## Registry Aliases

Legacy names are accepted via `loadAgentPrompt()` (for tiered routing and renamed roles):
- `-low`, `-medium`, `-high` model variants (e.g., `architect-low`, `architect-medium`)
- `finance-developer`, `finance-expert` → `finance`
- `ontology-developer`, `ontology-expert`, `ontology-reviewer` → `ontology`
- `mobile-developer-low`, `mobile-developer-high` → `mobile-developer`
- `scientist-low`, `scientist-high` → `scientist`
- `security-reviewer-low` → `security-reviewer`
- `build-fixer-low` → `build-fixer`
- `tdd-guide-low` → `tdd-guide`
- `code-reviewer-low` → `code-reviewer`
- `qa-tester-high` → `qa-tester`
- `deep-executor` → `ultra-executor`

## How to add or modify agents

- Update the TS config in `src/agents/*.ts` and keep the `.md` prompt in `/agents`.
- Update prompt frontmatter in prompt file plus corresponding model/tool assignment in definition.
- If alias compatibility changes, update `resolvePromptName()` in `src/agents/utils.ts`.
