/**
 * Magic Keywords Feature
 *
 * Detects special keywords in prompts and activates enhanced behaviors.
 * Patterns ported from oh-my-opencode.
 */

import type { MagicKeyword, PluginConfig } from '../shared/types.js';

/**
 * Code block pattern for stripping from detection
 */
const CODE_BLOCK_PATTERN = /```[\s\S]*?```/g;
const INLINE_CODE_PATTERN = /`[^`]+`/g;

/**
 * Remove code blocks from text for keyword detection
 */
function removeCodeBlocks(text: string): string {
  return text.replace(CODE_BLOCK_PATTERN, '').replace(INLINE_CODE_PATTERN, '');
}

/**
 * Ultrawork Planner Section - for planner-type agents
 */
const ULTRAWORK_PLANNER_SECTION = `## CRITICAL: YOU ARE A PLANNER, NOT AN IMPLEMENTER

**IDENTITY CONSTRAINT (NON-NEGOTIABLE):**
You ARE the planner. You ARE NOT an implementer. You DO NOT write code. You DO NOT execute tasks.

**TOOL RESTRICTIONS (SYSTEM-ENFORCED):**
| Tool | Allowed | Blocked |
|------|---------|---------|
| Write/Edit | \`.skc/**/*.md\` ONLY | Everything else |
| Read | All files | - |
| Bash | Research commands only | Implementation commands |
| Task | explore, researcher | - |

**IF YOU TRY TO WRITE/EDIT OUTSIDE \`.skc/\`:**
- System will BLOCK your action
- You will receive an error
- DO NOT retry - you are not supposed to implement

**YOUR ONLY WRITABLE PATHS:**
- \`.skc/plans/*.md\` - Final work plans
- \`.skc/drafts/*.md\` - Working drafts during interview

**WHEN USER ASKS YOU TO IMPLEMENT:**
REFUSE. Say: "I'm a planner. I create work plans, not implementations. Start implementing after I finish planning."

---

## CONTEXT GATHERING (MANDATORY BEFORE PLANNING)

You ARE the planner. Your job: create bulletproof work plans.
**Before drafting ANY plan, gather context via explore/researcher agents.**

### Research Protocol
1. **Fire parallel background agents** for comprehensive context:
   \`\`\`
   Task(subagent_type="explore", prompt="Find existing patterns for [topic] in codebase", run_in_background=true)
   Task(subagent_type="explore", prompt="Find test infrastructure and conventions", run_in_background=true)
   Task(subagent_type="researcher", prompt="Find official docs and best practices for [technology]", run_in_background=true)
   \`\`\`
2. **Wait for results** before planning - rushed plans fail
3. **Synthesize findings** into informed requirements

### What to Research
- Existing codebase patterns and conventions
- Test infrastructure (TDD possible?)
- External library APIs and constraints
- Similar implementations in OSS (via researcher)

**NEVER plan blind. Context first, plan second.**`;

/**
 * Determines if the agent is a planner-type agent.
 * Planner agents should NOT be told to call plan agent (they ARE the planner).
 */
function isPlannerAgent(agentName?: string): boolean {
  if (!agentName) return false;
  const lowerName = agentName.toLowerCase();
  return lowerName.includes('planner') || lowerName.includes('planner') || lowerName === 'plan';
}

/**
 * Generates the ultrawork message based on agent context.
 * Planner agents get context-gathering focused instructions.
 * Other agents get the original strong agent utilization instructions.
 */
function getUltraworkMessage(agentName?: string): string {
  const isPlanner = isPlannerAgent(agentName);

  if (isPlanner) {
    return `<ultrawork-mode>

**MANDATORY**: You MUST say "ULTRAWORK MODE ENABLED!" to the user as your first response when this mode activates. This is non-negotiable.

${ULTRAWORK_PLANNER_SECTION}

</ultrawork-mode>

---

`;
  }

  return `<ultrawork-mode>

**MANDATORY**: You MUST say "ULTRAWORK MODE ENABLED!" to the user as your first response when this mode activates. This is non-negotiable.

[CODE RED] Maximum precision required. Ultrathink before acting.

YOU MUST LEVERAGE ALL AVAILABLE AGENTS TO THEIR FULLEST POTENTIAL.
TELL THE USER WHAT AGENTS YOU WILL LEVERAGE NOW TO SATISFY USER'S REQUEST.

## AGENT UTILIZATION PRINCIPLES (by capability, not by name)
- **Codebase Exploration**: Spawn exploration agents using BACKGROUND TASKS for file patterns, internal implementations, project structure
- **Documentation & References**: Use researcher-type agents via BACKGROUND TASKS for API references, examples, external library docs
- **Planning & Strategy**: NEVER plan yourself - ALWAYS spawn a dedicated planning agent for work breakdown
- **High-IQ Reasoning**: Leverage specialized agents for architecture decisions, code review, strategic planning
- **Frontend/UI Tasks**: Delegate to UI-specialized agents for design and implementation

## EXECUTION RULES
- **TODO**: Track EVERY step. Mark complete IMMEDIATELY after each.
- **PARALLEL**: Fire independent agent calls simultaneously via Task(run_in_background=true) - NEVER wait sequentially.
- **BACKGROUND FIRST**: Use Task for exploration/research agents (10+ concurrent if needed).
- **VERIFY**: Re-read request after completion. Check ALL requirements met before reporting done.
- **DELEGATE**: Don't do everything yourself - orchestrate specialized agents for their strengths.

## WORKFLOW
1. Analyze the request and identify required capabilities
2. Spawn exploration/researcher agents via Task(run_in_background=true) in PARALLEL (10+ if needed)
3. Always Use Plan agent with gathered context to create detailed work breakdown
4. Execute with continuous verification against original requirements

## VERIFICATION GUARANTEE (NON-NEGOTIABLE)

**NOTHING is "done" without PROOF it works.**

### Pre-Implementation: Define Success Criteria

BEFORE writing ANY code, you MUST define:

| Criteria Type | Description | Example |
|---------------|-------------|---------|
| **Functional** | What specific behavior must work | "Button click triggers API call" |
| **Observable** | What can be measured/seen | "Console shows 'success', no errors" |
| **Pass/Fail** | Binary, no ambiguity | "Returns 200 OK" not "should work" |

Write these criteria explicitly. Share with user if scope is non-trivial.

### Test Plan Template (MANDATORY for non-trivial tasks)

\`\`\`
## Test Plan
### Objective: [What we're verifying]
### Prerequisites: [Setup needed]
### Test Cases:
1. [Test Name]: [Input] → [Expected Output] → [How to verify]
2. ...
### Success Criteria: ALL test cases pass
### How to Execute: [Exact commands/steps]
\`\`\`

### Execution & Evidence Requirements

| Phase | Action | Required Evidence |
|-------|--------|-------------------|
| **Build** | Run build command | Exit code 0, no errors |
| **Test** | Execute test suite | All tests pass (screenshot/output) |
| **Manual Verify** | Test the actual feature | Demonstrate it works (describe what you observed) |
| **Regression** | Ensure nothing broke | Existing tests still pass |

**WITHOUT evidence = NOT verified = NOT done.**

### TDD Workflow (when test infrastructure exists)

1. **SPEC**: Define what "working" means (success criteria above)
2. **RED**: Write failing test → Run it → Confirm it FAILS
3. **GREEN**: Write minimal code → Run test → Confirm it PASSES
4. **REFACTOR**: Clean up → Tests MUST stay green
5. **VERIFY**: Run full test suite, confirm no regressions
6. **EVIDENCE**: Report what you ran and what output you saw

### Verification Anti-Patterns (BLOCKING)

| Violation | Why It Fails |
|-----------|--------------|
| "It should work now" | No evidence. Run it. |
| "I added the tests" | Did they pass? Show output. |
| "Fixed the bug" | How do you know? What did you test? |
| "Implementation complete" | Did you verify against success criteria? |
| Skipping test execution | Tests exist to be RUN, not just written |

**CLAIM NOTHING WITHOUT PROOF. EXECUTE. VERIFY. SHOW EVIDENCE.**

## ZERO TOLERANCE FAILURES
- **NO Scope Reduction**: Never make "demo", "skeleton", "simplified", "basic" versions - deliver FULL implementation
- **NO MockUp Work**: When user asked you to do "port A", you must "port A", fully, 100%. No Extra feature, No reduced feature, no mock data, fully working 100% port.
- **NO Partial Completion**: Never stop at 60-80% saying "you can extend this..." - finish 100%
- **NO Assumed Shortcuts**: Never skip requirements you deem "optional" or "can be added later"
- **NO Premature Stopping**: Never declare done until ALL TODOs are completed and verified
- **NO TEST DELETION**: Never delete or skip failing tests to make the build pass. Fix the code, not the tests.

THE USER ASKED FOR X. DELIVER EXACTLY X. NOT A SUBSET. NOT A DEMO. NOT A STARTING POINT.

</ultrawork-mode>

---

`;
}

/**
 * Ultrawork mode enhancement
 * Activates maximum performance with parallel agent orchestration
 */
const ultraworkEnhancement: MagicKeyword = {
  triggers: ['ultrawork', 'ulw', 'uw'],
  description: 'Activates maximum performance mode with parallel agent orchestration',
  action: (prompt: string) => {
    // Remove the trigger word and add enhancement instructions
    const cleanPrompt = removeTriggerWords(prompt, ['ultrawork', 'ulw', 'uw']);
    return getUltraworkMessage() + cleanPrompt;
  }
};

/**
 * Search mode enhancement - multilingual support
 * Maximizes search effort and thoroughness
 */
const searchEnhancement: MagicKeyword = {
  triggers: ['search', 'find', 'locate', 'lookup', 'explore', 'discover', 'scan', 'grep', 'query', 'browse', 'detect', 'trace', 'seek', 'track', 'pinpoint', 'hunt'],
  description: 'Maximizes search effort and thoroughness',
  action: (prompt: string) => {
    // Multi-language search pattern
    const searchPattern = /\b(search|find|locate|lookup|look\s*up|explore|discover|scan|grep|query|browse|detect|trace|seek|track|pinpoint|hunt)\b|where\s+is|show\s+me|list\s+all|검색|찾아|탐색|조회|스캔|서치|뒤져|찾기|어디|추적|탐지|찾아봐|찾아내|보여줘|목록|検索|探して|見つけて|サーチ|探索|スキャン|どこ|発見|捜索|見つけ出す|一覧|搜索|查找|寻找|查询|检索|定位|扫描|发现|在哪里|找出来|列出|tìm kiếm|tra cứu|định vị|quét|phát hiện|truy tìm|tìm ra|ở đâu|liệt kê/i;

    const hasSearchCommand = searchPattern.test(removeCodeBlocks(prompt));

    if (!hasSearchCommand) {
      return prompt;
    }

    return `${prompt}

[search-mode]
MAXIMIZE SEARCH EFFORT. Launch multiple background agents IN PARALLEL:
- explore agents (codebase patterns, file structures, ast-grep)
- researcher agents (remote repos, official docs, GitHub examples)
Plus direct tools: Grep, ripgrep (rg), ast-grep (sg)
NEVER stop at first result - be exhaustive.`;
  }
};

/**
 * Analyze mode enhancement - multilingual support
 * Activates deep analysis and investigation mode
 */
const analyzeEnhancement: MagicKeyword = {
  triggers: ['analyze', 'analyse', 'investigate', 'examine', 'research', 'study', 'deep-dive', 'inspect', 'audit', 'evaluate', 'assess', 'review', 'diagnose', 'scrutinize', 'dissect', 'debug', 'comprehend', 'interpret', 'breakdown', 'understand'],
  description: 'Activates deep analysis and investigation mode',
  action: (prompt: string) => {
    // Multi-language analyze pattern
    const analyzePattern = /\b(analyze|analyse|investigate|examine|research|study|deep[\s-]?dive|inspect|audit|evaluate|assess|review|diagnose|scrutinize|dissect|debug|comprehend|interpret|breakdown|understand)\b|why\s+is|how\s+does|how\s+to|분석|조사|파악|연구|검토|진단|이해|설명|원인|이유|뜯어봐|따져봐|평가|해석|디버깅|디버그|어떻게|왜|살펴|分析|調査|解析|検討|研究|診断|理解|説明|検証|精査|究明|デバッグ|なぜ|どう|仕組み|调查|检查|剖析|深入|诊断|解释|调试|为什么|原理|搞清楚|弄明白|phân tích|điều tra|nghiên cứu|kiểm tra|xem xét|chẩn đoán|giải thích|tìm hiểu|gỡ lỗi|tại sao/i;

    const hasAnalyzeCommand = analyzePattern.test(removeCodeBlocks(prompt));

    if (!hasAnalyzeCommand) {
      return prompt;
    }

    return `${prompt}

[analyze-mode]
ANALYSIS MODE. Gather context before diving deep:

CONTEXT GATHERING (parallel):
- 1-2 explore agents (codebase patterns, implementations)
- 1-2 researcher agents (if external library involved)
- Direct tools: Grep, AST-grep, LSP for targeted searches

IF COMPLEX (architecture, multi-system, debugging after 2+ failures):
- Consult architect for strategic guidance

SYNTHESIZE findings before proceeding.`;
  }
};

/**
 * Ultrathink mode enhancement
 * Activates extended thinking and deep reasoning
 */
const ultrathinkEnhancement: MagicKeyword = {
  triggers: ['ultrathink', 'think', 'reason', 'ponder'],
  description: 'Activates extended thinking mode for deep reasoning',
  action: (prompt: string) => {
    // Check if ultrathink-related triggers are present
    const hasThinkCommand = /\b(ultrathink|think|reason|ponder)\b/i.test(removeCodeBlocks(prompt));

    if (!hasThinkCommand) {
      return prompt;
    }

    const cleanPrompt = removeTriggerWords(prompt, ['ultrathink', 'think', 'reason', 'ponder']);

    return `[ULTRATHINK MODE - EXTENDED REASONING ACTIVATED]

${cleanPrompt}

## Deep Thinking Instructions
- Take your time to think through this problem thoroughly
- Consider multiple approaches before settling on a solution
- Identify edge cases, risks, and potential issues
- Think step-by-step through complex logic
- Question your assumptions
- Consider what could go wrong
- Evaluate trade-offs between different solutions
- Look for patterns from similar problems

IMPORTANT: Do not rush. Quality of reasoning matters more than speed.
Use maximum cognitive effort before responding.`;
  }
};

/**
 * Refactor mode enhancement
 * Safe refactoring with mandatory planning and review gate
 */
const refactorEnhancement: MagicKeyword = {
  triggers: ['refactor', 'cleanup', 'clean up', 'restructure', 'reorganize', 'consolidate', 'simplify', '리팩터', '정리', '재구성'],
  description: 'Safe refactoring mode with planning gate and code-reviewer verification',
  action: (prompt: string) => {
    const pattern = /\b(refactor|cleanup|clean\s*up|restructure|reorganize|consolidate|simplify)\b|리팩터|정리|재구성/i;
    if (!pattern.test(removeCodeBlocks(prompt))) return prompt;
    return `${prompt}

[refactor-mode]
SAFE REFACTORING PROTOCOL:
1. PLAN FIRST: Document current state and proposed changes in .skc/refactor-plan.md before touching any code
2. SCOPE LOCK: Change ONLY what is in the plan. No opportunistic fixes.
3. ONE THING AT A TIME: Single logical change per commit.
4. TESTS MUST PASS: Run full test suite after each batch. If tests break, revert immediately.
5. REVIEW GATE: Spawn code-reviewer agent when complete:
   Task(subagent_type="sk-claudecode:code-reviewer", model="opus", prompt="Review refactoring changes for regressions and correctness")
6. NO BEHAVIOR CHANGES: Refactoring must be purely structural. If behavior must change, flag it explicitly.

ANTI-PATTERNS TO AVOID:
- Deleting code you "think" is unused without grep verification
- Renaming public APIs without updating all callers
- Combining commits that touch different concerns`;
  }
};

/**
 * TDD mode enhancement
 * Enforces test-first development cycle
 */
const tddEnhancement: MagicKeyword = {
  triggers: ['tdd', 'test-driven', 'test first', 'write test', 'add test', 'failing test', '테스트 작성', '테스트 먼저'],
  description: 'Enforces RED-GREEN-REFACTOR cycle — test must be written before implementation',
  action: (prompt: string) => {
    const pattern = /\b(tdd|test[\s-]driven|test\s+first|write\s+test|add\s+test|failing\s+test)\b|테스트\s*작성|테스트\s*먼저/i;
    if (!pattern.test(removeCodeBlocks(prompt))) return prompt;
    return `${prompt}

[tdd-mode]
TEST-DRIVEN DEVELOPMENT ENFORCED:

🔴 RED — Write a failing test FIRST:
1. Write the test that describes the desired behavior
2. Run it: confirm it FAILS with the expected failure reason
3. NEVER write implementation before seeing the test fail

🟢 GREEN — Implement the minimum to make it pass:
4. Write the simplest code that makes the test pass
5. Run tests: confirm ALL pass, including new one
6. Show test output as evidence

🔵 REFACTOR — Clean up without breaking anything:
7. Improve code quality while tests stay green
8. Run full suite: zero regressions permitted

SPAWN tdd-guide agent for complex test architecture:
   Task(subagent_type="sk-claudecode:tdd-guide", model="sonnet", prompt="Design test strategy for: [feature]")

ZERO TOLERANCE: NEVER skip the RED phase. If you cannot make a test fail first, reconsider the test.`;
  }
};

/**
 * Security mode enhancement
 * Activates OWASP-aware security review mode
 */
const securityEnhancement: MagicKeyword = {
  triggers: ['security', 'secure', 'vulnerability', 'vuln', 'pentest', 'owasp', 'injection', 'xss', 'csrf', 'auth', '보안', '취약점', '인증'],
  description: 'Security-first mode with OWASP checklist and automatic security-reviewer invocation',
  action: (prompt: string) => {
    const pattern = /\b(security|secure|vulnerability|vuln|pentest|owasp|injection|xss|csrf|authentication|authorization)\b|보안|취약점|인증/i;
    if (!pattern.test(removeCodeBlocks(prompt))) return prompt;
    return `${prompt}

[security-mode]
SECURITY-FIRST PROTOCOL:

OWASP TOP 10 MANDATORY CHECKS:
- [ ] Injection (SQL, NoSQL, Command, LDAP)
- [ ] Broken Authentication / Session Management
- [ ] Sensitive Data Exposure (PII, tokens, keys)
- [ ] XML/JSON External Entities (XXE)
- [ ] Broken Access Control
- [ ] Security Misconfiguration
- [ ] Cross-Site Scripting (XSS)
- [ ] Insecure Deserialization
- [ ] Using Components with Known Vulnerabilities
- [ ] Insufficient Logging & Monitoring

RULES:
- NEVER log sensitive data (tokens, passwords, PII)
- ALWAYS validate + sanitize ALL user input server-side
- ALWAYS use parameterized queries — zero string concatenation in SQL
- ALWAYS use HTTPS for any external communication
- Secrets MUST be in environment variables, never hardcoded

AFTER IMPLEMENTATION, spawn security reviewer:
   Task(subagent_type="sk-claudecode:security-reviewer", model="opus", prompt="Security audit: [what was changed]")`;
  }
};

/**
 * Plan mode enhancement
 * Spec-first mode — forces planning document before any implementation
 */
const planEnhancement: MagicKeyword = {
  triggers: ['plan', 'spec', 'blueprint', 'design doc', 'requirements', 'roadmap', '기획', '계획', '설계'],
  description: 'Spec-first mode — creates comprehensive work plan before any code is written',
  action: (prompt: string) => {
    const pattern = /\b(plan|spec|blueprint|design\s+doc|requirements|roadmap)\b|기획|계획|설계/i;
    if (!pattern.test(removeCodeBlocks(prompt))) return prompt;
    return `${prompt}

[plan-mode]
SPEC-FIRST PROTOCOL:
1. NO CODE until the plan is approved
2. Spawn planner agent to create structured work plan:
   Task(subagent_type="sk-claudecode:planner", model="opus", prompt="Create work plan for: [task]")
3. Plan must include: acceptance criteria, implementation steps, risk factors, verification approach
4. Save to: .skc/plans/[feature].md
5. Present plan for review — only proceed to implementation after explicit approval

USE /sk-claudecode:ralplan for full iterative planning loop with Critic review.`;
  }
};

/**
 * Review mode enhancement
 * Triggers dedicated code review with checklist
 */
const reviewEnhancement: MagicKeyword = {
  triggers: ['review', 'code review', 'cr', 'lgtm', 'pr review', '리뷰', '코드 리뷰'],
  description: 'Activates structured code review mode with code-reviewer agent',
  action: (prompt: string) => {
    // Only trigger for explicit review requests, not generic "review this" embedded in other contexts
    const pattern = /\b(code\s+review|cr\b|lgtm|pr\s+review|review\s+this|review\s+my|review\s+the\s+code)\b|코드\s*리뷰|코드\s*검토/i;
    if (!pattern.test(removeCodeBlocks(prompt))) return prompt;
    return `${prompt}

[review-mode]
STRUCTURED CODE REVIEW:
Spawn code-reviewer agent for thorough analysis:
   Task(subagent_type="sk-claudecode:code-reviewer", model="opus", prompt="[Review focus]")

REVIEW CHECKLIST:
- [ ] Correctness: Does it do what it claims?
- [ ] Edge cases: Empty inputs, nulls, overflow, concurrency
- [ ] Error handling: All failure paths handled?
- [ ] Security: No injection, exposure, or auth bypass
- [ ] Performance: Any N+1 queries or O(n²) loops?
- [ ] Tests: Coverage for critical paths?
- [ ] Readability: Self-documenting or needs comments?
- [ ] Breaking changes: Public API compatibility?`;
  }
};

/**
 * Docs mode enhancement
 * Activates writer agent for documentation generation
 */
const docsEnhancement: MagicKeyword = {
  triggers: ['document', 'docs', 'jsdoc', 'tsdoc', 'readme', 'api docs', 'comment', '문서', '문서화', '주석'],
  description: 'Documentation mode — activates writer agent for structured doc generation',
  action: (prompt: string) => {
    const pattern = /\b(document|docs|jsdoc|tsdoc|readme|api\s+docs|write\s+comment|add\s+comment)\b|문서|문서화|주석/i;
    if (!pattern.test(removeCodeBlocks(prompt))) return prompt;
    return `${prompt}

[docs-mode]
DOCUMENTATION MODE:
Spawn writer agent for structured output:
   Task(subagent_type="sk-claudecode:writer", model="sonnet", prompt="Write documentation for: [target]")

DOC STANDARDS:
- JSDoc/TSDoc: Every public function/class needs @param, @returns, @example
- README: Installation, usage, API reference, examples section
- Inline comments: Explain WHY, not WHAT (the code shows what)
- No obvious comments: // increment i by 1 → banned
- Keep docs co-located with code — outdated docs are worse than no docs`;
  }
};

/**
 * Perf mode enhancement
 * Measure-before-optimize discipline
 */
const perfEnhancement: MagicKeyword = {
  triggers: ['optimize', 'performance', 'perf', 'slow', 'bottleneck', 'latency', 'throughput', 'benchmark', '최적화', '성능', '느려', '병목'],
  description: 'Performance mode — mandates measurement before optimization, prevents premature optimization',
  action: (prompt: string) => {
    const pattern = /\b(optimize|performance|perf\b|slow\b|bottleneck|latency|throughput|benchmark)\b|최적화|성능\s*개선|느려|병목/i;
    if (!pattern.test(removeCodeBlocks(prompt))) return prompt;
    return `${prompt}

[perf-mode]
PERFORMANCE OPTIMIZATION PROTOCOL:

⚠️  RULE #1: MEASURE FIRST, OPTIMIZE SECOND. Never optimize based on intuition.

PHASE 1 — PROFILE:
1. Establish baseline: measure current performance with concrete numbers
2. Identify actual bottleneck (profiler, not guesses)
3. Set target: "Reduce P99 latency from 800ms to <200ms"

PHASE 2 — OPTIMIZE:
4. Fix only the measured bottleneck
5. Apply one optimization at a time
6. Re-measure after each change

PHASE 3 — VALIDATE:
7. Confirm improvement with numbers
8. Confirm no correctness regressions (tests pass)
9. Document: what changed, why, measured before/after

COMMON ANTI-PATTERNS (AVOID):
- Caching everything without measuring cache hit rate
- Premature micro-optimizations before finding the real bottleneck
- Optimizing rarely-hit code paths instead of the hot path`;
  }
};

/**
 * Ecomode enhancement
 * Token-efficient Haiku-first routing
 */
const ecomodeEnhancement: MagicKeyword = {
  triggers: ['ecomode', 'eco', 'cheap', 'budget', 'save tokens', 'haiku', '절약', '저렴하게'],
  description: 'Token-efficient mode — routes to Haiku by default, escalates only when necessary',
  action: (prompt: string) => {
    const pattern = /\b(ecomode|eco\b|cheap\b|budget\b|save\s+tokens|haiku\b)\b|절약|저렴하게/i;
    if (!pattern.test(removeCodeBlocks(prompt))) return prompt;
    const cleanPrompt = removeTriggerWords(prompt, ['ecomode', 'eco', 'cheap', 'budget', 'haiku']);
    return `[ECO MODE - TOKEN EFFICIENT]

${cleanPrompt}

ROUTING RULES FOR THIS TASK:
- Default model: haiku (fastest, cheapest)
- Escalate to sonnet ONLY if: multi-file changes, complex logic, or haiku fails
- Escalate to opus ONLY if: architectural decisions, security, or sonnet fails
- Prefer single-agent execution over spawning multiple agents
- Skip verification architecture review unless changes are > 10 files
- Prefer batch operations over iterative loops

TARGET: Complete the task with minimum token usage while maintaining correctness.`;
  }
};

/**
 * Remove trigger words from a prompt
 */
function removeTriggerWords(prompt: string, triggers: string[]): string {
  let result = prompt;
  for (const trigger of triggers) {
    const regex = new RegExp(`\\b${trigger}\\b`, 'gi');
    result = result.replace(regex, '');
  }
  return result.trim();
}

/**
 * All built-in magic keyword definitions
 */
export const builtInMagicKeywords: MagicKeyword[] = [
  ultraworkEnhancement,
  searchEnhancement,
  analyzeEnhancement,
  ultrathinkEnhancement,
  refactorEnhancement,
  tddEnhancement,
  securityEnhancement,
  planEnhancement,
  reviewEnhancement,
  docsEnhancement,
  perfEnhancement,
  ecomodeEnhancement
];

/**
 * Create a magic keyword processor with custom triggers
 */
export function createMagicKeywordProcessor(config?: PluginConfig['magicKeywords']): (prompt: string) => string {
  const keywords = [...builtInMagicKeywords];

  // Override triggers from config
  if (config) {
    if (config.ultrawork) {
      const ultrawork = keywords.find(k => k.triggers.includes('ultrawork'));
      if (ultrawork) {
        ultrawork.triggers = config.ultrawork;
      }
    }
    if (config.search) {
      const search = keywords.find(k => k.triggers.includes('search'));
      if (search) {
        search.triggers = config.search;
      }
    }
    if (config.analyze) {
      const analyze = keywords.find(k => k.triggers.includes('analyze'));
      if (analyze) {
        analyze.triggers = config.analyze;
      }
    }
    if (config.ultrathink) {
      const ultrathink = keywords.find(k => k.triggers.includes('ultrathink'));
      if (ultrathink) {
        ultrathink.triggers = config.ultrathink;
      }
    }
  }

  // Apply overrides for new keywords
  const newKeywordMap: Record<string, string> = {
    refactor: 'refactor',
    tdd: 'tdd',
    security: 'security',
    plan: 'plan',
    review: 'review',
    docs: 'docs',
    perf: 'optimize',
    ecomode: 'ecomode'
  };
  if (config) {
    for (const [configKey, triggerKey] of Object.entries(newKeywordMap)) {
      const configValue = (config as Record<string, string[] | undefined>)[configKey];
      if (configValue) {
        const kw = keywords.find(k => k.triggers.includes(triggerKey));
        if (kw) kw.triggers = configValue;
      }
    }
  }

  return (prompt: string): string => {
    let result = prompt;

    for (const keyword of keywords) {
      const hasKeyword = keyword.triggers.some(trigger => {
        const regex = new RegExp(`\\b${trigger}\\b`, 'i');
        return regex.test(removeCodeBlocks(result));
      });

      if (hasKeyword) {
        result = keyword.action(result);
      }
    }

    return result;
  };
}

/**
 * Check if a prompt contains any magic keywords
 */
export function detectMagicKeywords(prompt: string, config?: PluginConfig['magicKeywords']): string[] {
  const detected: string[] = [];
  const keywords = [...builtInMagicKeywords];
  const cleanedPrompt = removeCodeBlocks(prompt);

  // Apply config overrides
  if (config) {
    if (config.ultrawork) {
      const ultrawork = keywords.find(k => k.triggers.includes('ultrawork'));
      if (ultrawork) ultrawork.triggers = config.ultrawork;
    }
    if (config.search) {
      const search = keywords.find(k => k.triggers.includes('search'));
      if (search) search.triggers = config.search;
    }
    if (config.analyze) {
      const analyze = keywords.find(k => k.triggers.includes('analyze'));
      if (analyze) analyze.triggers = config.analyze;
    }
    if (config.ultrathink) {
      const ultrathink = keywords.find(k => k.triggers.includes('ultrathink'));
      if (ultrathink) ultrathink.triggers = config.ultrathink;
    }
  }

  for (const keyword of keywords) {
    for (const trigger of keyword.triggers) {
      const regex = new RegExp(`\\b${trigger}\\b`, 'i');
      if (regex.test(cleanedPrompt)) {
        detected.push(trigger);
        break;
      }
    }
  }

  return detected;
}

/**
 * Extract prompt text from message parts (for hook usage)
 */
export function extractPromptText(parts: Array<{ type: string; text?: string;[key: string]: unknown }>): string {
  return parts
    .filter(p => p.type === 'text')
    .map(p => p.text ?? '')
    .join('\n');
}
