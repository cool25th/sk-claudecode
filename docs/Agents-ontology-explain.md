# Ontology Development Guide

> SK-ClaudeCode의 Think → Build → Check 에이전트를 활용한 온톨로지 개발 단계 가이드

## 전체 흐름

```
Step 1        Step 2          Step 3         Step 4         Step 5
📚 Help  ──→  🧠 Think   ──→  ⚡ Build  ──→  🔍 Check  ──→  🔄 Iterate
@explore      @ontology-      @ontology-     @ontology-     @build-fixer
              expert          developer      reviewer       → Step 3
```

---

## Step 1: 📚 탐색 — 기존 코드 이해

```bash
@explore "Analyze the current data models and identify entities, relationships, and operations"
```

- 기존 코드베이스에서 **도메인 엔티티** 파악
- 데이터 흐름, API, 비즈니스 로직 분석
- 이 결과가 다음 단계의 **입력**이 됨

---

## Step 2: 🧠 설계 — 온톨로지 아키텍처

```bash
@ontology-expert "Based on the analysis, design an ontology architecture for [도메인명].
Include:
- Object Types with properties
- Link Types with cardinality
- Actions and Functions
- Paradigm choice (Traditional/Palantir/Hybrid)"
```

**사용 스킬:** `ontology`, `ontology-traditional`, `ontology-palantir`, `ontology-storage`

**산출물:**
- 엔티티 카탈로그
- 관계 매트릭스
- 패러다임 선택 (OWL/Palantir/Hybrid)
- 아키텍처 설계서

---

## Step 3: ⚡ 구현 — 코드 작성

```bash
@ontology-developer "Implement the ontology design:
1. Object Types with TypeScript interfaces
2. Link Types with cardinality
3. Actions with validations
4. Functions with business logic"
```

**사용 스킬:** `ontology-object-types`, `ontology-links`, `ontology-actions`, `ontology-functions`

**산출물:**
- TypeScript 인터페이스/스키마
- 액션 구현 (CRUD + 비즈니스)
- 함수 구현
- 단위 테스트

---

## Step 4: 🔍 검증 — 품질 감사

```bash
@ontology-reviewer "Review the ontology implementation:
- Schema consistency & naming conventions
- Link cardinality & direction
- Action atomicity & validation
- Completeness & domain alignment"
```

**사용 스킬:** 8개 스킬 전체 (검증 기준)

**산출물:**
- PASS / PASS_WITH_CONCERNS / NEEDS_REVISION / FAIL 판정
- 🟢 강점 / 🟡 우려 / 🔴 치명적 이슈

---

## Step 5: 🔄 반복 — 이슈 수정

Check에서 이슈가 나오면:

```bash
@build-fixer "Fix the issues identified by ontology-reviewer: [이슈 목록]"
# 그리고 다시
@ontology-reviewer "Re-review the fixed ontology"
```

---

## 🚀 자동화 (한 줄로)

위 전체 과정을 **ralph**가 자동으로 반복해줍니다:

```bash
# ralph = Step 2 → 3 → 4 → 5(반복) 자동화
/sk-claudecode:ralph "Design and implement an ontology for [도메인명]"
```

| 방식 | 장점 | 언제 사용 |
|------|------|----------|
| 수동 (Step 1~5) | 세밀한 제어, 각 단계 결과 확인 | 처음 또는 복잡한 도메인 |
| 자동 (`ralph`) | 빠르고 편함 | 익숙해진 이후 |

> 💡 **추천:** 처음에는 Step 1~4를 **수동으로** 진행해서 각 에이전트의 산출물을 확인하고, 익숙해지면 `ralph`로 자동화하세요.

---

## 에이전트 ↔ 스킬 매핑

| Skill | 🧠 ontology-expert | ⚡ ontology-developer | 🔍 ontology-reviewer |
|-------|:--:|:--:|:--:|
| `ontology` | 설계 | 참고 | 검증 기준 |
| `ontology-traditional` | 설계 | 참고 | OWL/RDF 준수 |
| `ontology-palantir` | 설계 | 참고 | Foundry 컨벤션 |
| `ontology-storage` | 설계 | 참고 | 아키텍처 패턴 |
| `ontology-object-types` | 참고 | **구현** | 베스트 프랙티스 |
| `ontology-links` | 참고 | **구현** | 모델링 표준 |
| `ontology-actions` | 참고 | **구현** | 액션 패턴 |
| `ontology-functions` | 참고 | **구현** | 함수 패턴 |

---

## 관련 문서

- [README](README.md) — 전체 에이전트/스킬 가이드
- [AGENTS.md](AGENTS.md) — 에이전트 상세 레퍼런스
