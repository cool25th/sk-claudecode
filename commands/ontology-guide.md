---
description: Ontology Development Guide — Step-by-step Think→Build→Check workflow for ontology projects
---

# 🗂️ Ontology Development Guide

온톨로지 개발을 위한 단계별 가이드입니다.

## 전체 흐름

```
Step 1        Step 2          Step 3         Step 4         Step 5
📚 Help  ──→  🧠 Think   ──→  ⚡ Build  ──→  🔍 Check  ──→  🔄 Iterate
@explore      @ontology-      @ontology-     @ontology-     @build-fixer
              expert          developer      reviewer       → Step 3
```

## Step 1: 📚 탐색
```bash
@explore "Analyze the current data models and identify entities, relationships, and operations"
```

## Step 2: 🧠 설계
```bash
@ontology-expert "Design an ontology architecture for [도메인명].
Include Object Types, Link Types, Actions, Functions, Paradigm choice"
```
**스킬:** `ontology`, `ontology-traditional`, `ontology-palantir`, `ontology-storage`

## Step 3: ⚡ 구현
```bash
@ontology-developer "Implement the ontology design:
Object Types, Link Types, Actions, Functions"
```
**스킬:** `ontology-object-types`, `ontology-links`, `ontology-actions`, `ontology-functions`

## Step 4: 🔍 검증
```bash
@ontology-reviewer "Review the ontology: schema consistency, link cardinality, action atomicity, completeness"
```
**스킬:** 8개 전체 (검증 기준)

## Step 5: 🔄 반복
```bash
@build-fixer "Fix issues from ontology-reviewer"
@ontology-reviewer "Re-review"
```

## 🚀 자동화
```bash
/sk-claudecode:ralph "Design and implement an ontology for [도메인명]"
```

## 에이전트 ↔ 스킬 매핑

| Skill | 🧠 Expert | ⚡ Developer | 🔍 Reviewer |
|-------|:---------:|:----------:|:----------:|
| `ontology` | 설계 | 참고 | 검증 기준 |
| `ontology-traditional` | 설계 | 참고 | OWL/RDF 준수 |
| `ontology-palantir` | 설계 | 참고 | Foundry 컨벤션 |
| `ontology-storage` | 설계 | 참고 | 아키텍처 패턴 |
| `ontology-object-types` | 참고 | **구현** | 베스트 프랙티스 |
| `ontology-links` | 참고 | **구현** | 모델링 표준 |
| `ontology-actions` | 참고 | **구현** | 액션 패턴 |
| `ontology-functions` | 참고 | **구현** | 함수 패턴 |

> 💡 상세 가이드: `docs/Agents-ontology-explain.md`

{{PROMPT}}
