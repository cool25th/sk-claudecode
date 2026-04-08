---
name: trace
description: Evidence-driven causal tracing with competing hypotheses, rebuttal rounds, and discriminating probe recommendations
---

# Trace

Evidence-driven causal tracing skill for complex debugging and root cause analysis. Separates observation from interpretation, generates competing hypotheses, and converges on the most evidence-backed explanation.

## When to Use

- Bug investigation where the root cause is not obvious
- Production incidents requiring systematic causal analysis
- Performance regressions with multiple possible explanations
- Any "why did this happen?" question requiring rigorous investigation
- When the user says "trace", "investigate", "root cause", or "why is this happening"

## When NOT to Use

- Simple bugs where the fix is obvious (just fix it)
- Feature requests or implementation tasks (use `plan` → `executor`)
- Code review (use `code-reviewer` agent)
- Performance optimization after cause is known (use `performance-optimization` skill)

## Tracing Protocol

### Step 1: OBSERVE

Restate the observed result precisely — without interpretation.

```
## Observation
- What was seen: [exact behavior, error message, metric]
- When: [timestamp, frequency, conditions]
- Where: [component, endpoint, service]
- Reproducibility: [always / intermittent / once]
```

### Step 2: FRAME

Define the exact "why" question being investigated.

> "Why does X happen when Y?" — not "What's wrong with the system?"

### Step 3: HYPOTHESIZE

Generate **at least 3** competing causal explanations. Use deliberately different frames:

| Lane | Frame | Example |
|------|-------|---------|
| 1 | Code-path / implementation | "A race condition in the handler causes..." |
| 2 | Config / environment / orchestration | "A misconfigured timeout triggers..." |
| 3 | Measurement / artifact / assumption mismatch | "The observed behavior is expected but misinterpreted because..." |

### Step 4: GATHER EVIDENCE

For **each** hypothesis, collect:
- **Evidence FOR** — What supports this explanation?
- **Evidence AGAINST** — What contradicts it?
- **GAPS** — What evidence is missing?

#### Evidence Strength Hierarchy

Rank evidence from strongest to weakest:

1. **Controlled reproduction** — Direct experiment uniquely discriminating between explanations
2. **Primary artifact** — Timestamped logs, trace events, metrics, config snapshots, git history with tight provenance
3. **Multiple independent convergence** — Several independent sources pointing to the same explanation
4. **Single-source inference** — Code-path reasoning that fits but doesn't uniquely discriminate
5. **Weak circumstantial** — Naming, temporal proximity, stack position, similarity to past incidents
6. **Intuition / analogy** — Speculation based on experience

> Prefer explanations backed by stronger tiers. When a higher tier conflicts with a lower tier, the lower tier should be down-ranked or discarded.

### Step 5: APPLY LENSES

Pressure-test leading hypotheses through:

- **Systems lens**: Boundaries, retries, queues, feedback loops, upstream/downstream interactions
- **Premortem lens**: Assume the current best explanation is wrong — what failure mode would embarrass this trace later?
- **Science lens**: Controls, confounders, measurement error, alternative variables, falsifiable predictions

### Step 6: DISCONFIRM

Apply Disconfirmation Rules:

- For every hypothesis, actively seek the **strongest disconfirming evidence**
- Ask: "What should be present if this hypothesis were true? Do we see it?"
- Ask: "What would be hard to explain if this hypothesis were true?"
- Prefer probes that **distinguish between** top hypotheses, not probes that merely gather more of the same support
- If a hypothesis survives only because no one looked for disconfirming evidence, its confidence stays low

### Step 7: REBUT

Run a **rebuttal round**: Let the strongest remaining alternative challenge the current leader with its best contrary evidence.

### Step 8: RANK / CONVERGE

- Down-rank explanations contradicted by evidence
- Down-rank explanations requiring extra unverified assumptions
- Down-rank explanations failing to make distinctive predictions
- **Detect convergence**: If multiple hypotheses reduce to the same root mechanism, merge explicitly
- **Preserve separation**: If they only sound similar but imply different mechanisms, keep them distinct

### Step 9: SYNTHESIZE

State the current best explanation and why it outranks alternatives.

### Step 10: PROBE

Name the **critical unknown** and recommend the single highest-value **discriminating probe** that would collapse the most uncertainty.

## Output Format

```markdown
## Trace Report

### Observation
[What was observed, without interpretation]

### Hypothesis Table
| Rank | Hypothesis | Confidence | Evidence Strength | Why it remains plausible |
|------|------------|------------|-------------------|----|
| 1 | ... | High/Medium/Low | Strong/Moderate/Weak | ... |

### Evidence For
- Hypothesis 1: ...
- Hypothesis 2: ...

### Evidence Against / Gaps
- Hypothesis 1: ...
- Hypothesis 2: ...

### Rebuttal Round
- Best challenge to the current leader: ...
- Why the leader still stands or was down-ranked: ...

### Convergence / Separation Notes
[Which hypotheses collapse to the same root cause vs which remain distinct]

### Current Best Explanation
[Explicitly provisional if uncertainty remains]

### Critical Unknown
[Single missing fact most responsible for current uncertainty]

### Discriminating Probe
[Single highest-value next investigation step]

### Uncertainty Notes
[What is still unknown or weakly supported]
```

## Red Flags

- Jumping to a fix before completing the hypothesis table
- Only one hypothesis generated (minimum 3)
- No evidence gathered AGAINST the favored explanation
- Claiming "convergence" for hypotheses that only sound similar
- Ending with "not sure" instead of a concrete discriminating probe
- Treating speculation as equal to primary artifact evidence
- Confusing correlation, proximity, or stack order with causation

## Failure Modes to Avoid

| Mode | Description |
|------|-------------|
| **Premature certainty** | Declaring a cause before examining alternatives |
| **Observation drift** | Rewriting what was observed to fit a theory |
| **Confirmation bias** | Collecting only supporting evidence |
| **Flat evidence weighting** | Treating speculation as equal to direct artifacts |
| **Debugger collapse** | Jumping to implementation/fixes instead of explanation |
| **Fake convergence** | Merging alternatives that imply different root causes |
| **Missing probe** | Ending without a concrete next investigation step |

## Verification

After completing a trace:
- [ ] Observation stated before interpretation
- [ ] At least 3 hypotheses generated
- [ ] Evidence gathered FOR and AGAINST each hypothesis
- [ ] Evidence ranked by strength hierarchy
- [ ] Disconfirmation pass completed
- [ ] Rebuttal round executed
- [ ] Critical unknown and discriminating probe named

## Related

- `/agent tracer` — Dedicated tracer agent for execution
- `skills/performance-optimization` — After cause is identified
- `/agent executor` — For implementing fixes
