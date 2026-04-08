# Modular Code Architecture — Enforcement Rules

Strict structural rules enforcing Single Responsibility Principle, clean module boundaries, and manageable file sizes. Apply these rules when writing, reviewing, or refactoring any TypeScript, JavaScript, or similar language code.

---

## Rule 1: index.ts = Entry Point ONLY

`index.ts` (or `index.js`) files MUST ONLY contain:
- Re-exports (`export { ... } from "./module"`)
- Factory function calls that compose modules
- Top-level wiring/registration (hook registration, plugin setup)

`index.ts` MUST NEVER contain:
- Business logic implementation
- Helper/utility functions
- Type definitions beyond simple re-exports
- Multiple unrelated responsibilities mixed together

**If you find mixed logic in index.ts**: Extract each responsibility into its own dedicated file BEFORE making any other changes. This is not optional.

---

## Rule 2: No Catch-All Files

The following file names are **BANNED** as top-level catch-alls:
- `utils.ts` / `utils.js`
- `helpers.ts` / `helpers.js`
- `service.ts` / `service.js`
- `common.ts` / `common.js`
- `misc.ts` / `misc.js`

These are gravity wells — every unrelated function gets tossed in, growing into untestable, unreviewable blobs.

### Refactoring Pattern

| Anti-Pattern | Refactor To |
|---|---|
| `utils.ts` with `formatDate()`, `slugify()`, `retry()` | `date-formatter.ts`, `slugify.ts`, `retry.ts` |
| `service.ts` handling auth + billing + notifications | `auth-service.ts`, `billing-service.ts`, `notification-service.ts` |
| `helpers.ts` with 15 unrelated exports | One file per logical domain |

**Design Rule**: Each module should be:
- **Independently importable** — no consumer should need to pull in unrelated code
- **Self-contained** — its dependencies are explicit, not buried in a shared grab-bag
- **Nameable by purpose** — the filename alone tells you what it does

If you catch yourself typing `utils.ts`, STOP and name the file after what it actually does.

---

## Rule 3: Single Responsibility Principle — Absolute

Every source file MUST have exactly ONE clear, nameable responsibility.

**Self-test**: If you cannot describe the file's purpose in ONE short phrase (e.g., "parses YAML frontmatter", "matches rules against file paths"), the file does too much. Split it.

| Signal | Action |
|--------|--------|
| File has 2+ unrelated exported functions | **SPLIT NOW** — each into its own module |
| File mixes I/O with pure logic | **SPLIT NOW** — separate side effects from computation |
| File has both types and implementation | **SPLIT NOW** — `types.ts` + `implementation.ts` |
| You need to scroll to understand the file | **SPLIT NOW** — it's too large |

---

## Rule 4: 200 LOC Soft Limit

Any source file exceeding **200 lines of code** (excluding comments, blank lines, and long string literals/prompts) is an **immediate code smell**.

### When You Detect a File > 200 LOC

1. **STOP** current work
2. **Identify** the multiple responsibilities hiding in the file
3. **Extract** each responsibility into a focused module
4. **Verify** each resulting file is < 200 LOC and has a single purpose
5. **Resume** original work

### Exemptions

- Prompt-heavy files where the bulk of content is template literal prompt text — but their non-prompt logic must still be < 200 LOC
- Auto-generated files (schemas, migrations, etc.)
- Test files with many test cases

### How to Count LOC

**Count these** (= actual logic):
- Import statements
- Variable/constant declarations
- Function/class/interface/type definitions
- Control flow (`if`, `for`, `while`, `switch`, `try/catch`)
- Expressions, assignments, return statements

**Exclude these** (= not logic):
- Blank lines
- Comment-only lines
- Lines inside template literals that are prompt/instruction text
- Lines inside multi-line strings used as documentation content

---

## Rule 5: Import Discipline

- **Relative within module**: `import { foo } from "./foo"`
- **Barrel imports across modules**: `import { log } from "../shared"`
- **No path aliases** (`@/`) unless the project explicitly configures them
- **No circular imports** — if A imports B and B imports A, extract shared code to C

---

## Anti-Patterns Checklist

| Anti-Pattern | Fix |
|---|---|
| `as any`, `@ts-ignore`, `@ts-expect-error` | Use proper types or create type definitions |
| Empty catch blocks `catch(e) {}` | Always handle errors — at minimum, log them |
| index.ts with business logic | Extract to purpose-named modules |
| catch-all `utils.ts` | Split by domain (one file per function/concern) |
| File > 200 LOC | Decompose into focused modules |
| Mixed I/O and pure logic | Separate side effects from computation |
| Circular imports | Extract shared dependency |

---

## When to Apply

- **Code review**: Check every touched file against these rules
- **New file creation**: Verify name, purpose, and size before committing
- **Refactoring**: Apply rules as the first step before any feature work
- **AI code generation**: Validate generated output against all 5 rules before accepting

## Related

- `skills/ai-slop-cleaner` — For AI-generated code cleanup
- `skills/coding-standards` — For language-specific conventions
- `skills/code-review` — For the code review workflow
