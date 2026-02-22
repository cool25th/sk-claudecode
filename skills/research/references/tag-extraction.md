## Tag Extraction

Scientists use structured tags for findings. Extract them with these patterns:

### Finding Tags

```
[FINDING:<id>] <title>
<evidence and analysis>
[/FINDING]

[EVIDENCE:<finding-id>]
- File: <path>
- Lines: <range>
- Content: <relevant code/text>
[/EVIDENCE]

[CONFIDENCE:<level>] # HIGH | MEDIUM | LOW
<reasoning for confidence level>
```

### Extraction Regex Patterns

```javascript
// Finding extraction
const findingPattern = /\[FINDING:(\w+)\]\s*(.*?)\n([\s\S]*?)\[\/FINDING\]/g;

// Evidence extraction
const evidencePattern = /\[EVIDENCE:(\w+)\]([\s\S]*?)\[\/EVIDENCE\]/g;

// Confidence extraction
const confidencePattern = /\[CONFIDENCE:(HIGH|MEDIUM|LOW)\]\s*(.*)/g;

// Stage completion
const stageCompletePattern = /\[STAGE_COMPLETE:(\d+)\]/;

// Verification result
const verificationPattern = /\[(VERIFIED|CONFLICTS):?(.*?)\]/;
```

### Evidence Window

When extracting evidence, include context window:

```
[EVIDENCE:F1]
- File: /src/auth/login.ts
- Lines: 45-52 (context: 40-57)
- Content:
  ```typescript
  // Lines 45-52 with 5 lines context above/below
  ```
[/EVIDENCE]
```

### Quality Validation

Findings must meet quality threshold:

| Quality Check | Requirement |
|---------------|-------------|
| Evidence present | At least 1 [EVIDENCE] per [FINDING] |
| Confidence stated | Each finding has [CONFIDENCE] |
| Source cited | File paths are absolute and valid |
| Reproducible | Another agent could verify |
