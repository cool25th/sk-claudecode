# SK-ClaudeCode Skills & Agents 병합 및 구조 최적화

현재 `skills/` 111개, `agents/` 46개가 있으며, 상당수가 중복되거나 유사합니다. 이를 병합하여 compact한 구조로 만듭니다.

## 현황 분석

| 구분 | Before | After (예상) |
|------|--------|-------------|
| Skills | 111 dirs | ~40 dirs |
| Agents | 46 files | ~28 files |
| 총 크기 | 19MB | ~17MB |

> [!IMPORTANT]
> `scientific/` (1069 sub-skills, 16MB)은 별도의 도메인 패키지이므로 이번 병합에서 제외합니다.

## Proposed Changes

### Phase 1: 완전 중복 삭제

#### 1-1. `setup` 삭제 (setup과 동일)
- `diff` 결과 이름만 다름 (95줄 완전 동일)
- **삭제**: `skills/setup/` → `skills/setup/`만 유지

#### 1-2. `execution-modes/` 내 sub-skill과 중복되는 standalone 삭제
`execution-modes/`가 이미 autopilot, ecomode, pipeline, ralph, swarm, ultrapilot, ultraqa, ultrawork를 sub-directory로 포함합니다.

**삭제 대상** (standalone 버전):
- `skills/autopilot/` — `execution-modes/autopilot/`에 존재
- `skills/ecomode/` — `execution-modes/ecomode/`에 존재
- `skills/pipeline/` — `execution-modes/pipeline/`에 존재
- `skills/ralph/` — `execution-modes/ralph/`에 존재
- `skills/ultraqa/` — `execution-modes/ultraqa/`에 존재
- `skills/ultrawork/` — `execution-modes/ultrawork/`에 존재
- `skills/ultrapilot/` — `execution-modes/ultrapilot/`에 존재

#### 1-3. `exploration/` 내 sub-skill과 중복되는 standalone 삭제
- `skills/analyze/` → `exploration/analyze/`에 존재
- `skills/deepinit/` → `exploration/deepinit/`에 존재

---

### Phase 2: 유사 스킬 병합

#### 2-1. TDD 스킬 병합
| 현재 | 설명 | 라인수 |
|------|------|--------|
| `tdd/` | TDD 기본 | 112 |
| `tdd-workflow/` | TDD + 80% 커버리지 | 416 |

→ **`tdd/`에 병합** (`tdd-workflow`의 내용이 상위 호환)
→ `tdd-workflow/` 삭제

#### 2-2. 검증 스킬 병합
| 현재 | 설명 | 라인수 |
|------|------|--------|
| `verify/` | 완료 전 검증 | 147 |
| `verification-loop/` | 빌드/린트/테스트 검증 | 125 |

→ **`verify/`에 병합** (두 스킬의 체크리스트 통합)
→ `verification-loop/` 삭제

#### 2-3. Continuous Learning 병합
| 현재 | 설명 | 라인수 |
|------|------|--------|
| `continuous-learning/` | v1 | 110 |
| `continuous-learning-v2/` | v2 (+agents, hooks, scripts) | 283 |

→ **`continuous-learning/`에 v2 내용 병합** (v2가 상위 호환)
→ `continuous-learning-v2/` 삭제

#### 2-4. Subagent 스킬 병합
| 현재 | 설명 | 라인수 |
|------|------|--------|
| `subagent/` | 2+ 독립 작업 병렬 | 180 |
| `ultra-subagent/` | 구현 계획 실행 | 242 |

→ **`subagent/`에 병합** (ultra-subagent 프롬프트 파일도 이동)
→ `ultra-subagent/` 삭제

#### 2-5. Plan 스킬 병합
| 현재 | 설명 | 라인수 |
|------|------|--------|
| `plan/` | 전략 계획 | 225 |
| `ultra-plan/` | 멀티스텝 계획 | 123 |
| `ralplan/` | Planner+Architect+Critic 합의 | 49 |

→ **`plan/`에 통합** (모드 구분: basic / detailed / consensus)
→ `ultra-plan/`, `ralplan/` 삭제

#### 2-6. Executor 스킬 병합
| 현재 | 설명 | 라인수 |
|------|------|--------|
| `ultra-execute/` | 구현 계획 실행 | 91 |
| `ultra-executor/` | 자율 딥 워크 | 72 |

→ **`ultra-executor/`로 통합** (상위 호환)
→ `ultra-execute/` 삭제

#### 2-7. Skill 작성 스킬 병합
| 현재 | 설명 | 라인수 |
|------|------|--------|
| `skill-creator/` | 스킬 생성 가이드 (+ scripts/refs) | 349 |
| `ultra-skill-writing/` | 스킬 작성/편집/검증 (+ examples/refs) | 180 |

→ **`skill-creator/`에 통합** (ultra-skill-writing의 예제와 참조 이동)
→ `ultra-skill-writing/` 삭제

---

### Phase 3: 도메인 스킬 통합

#### 3-1. Ontology 스킬 통합 (8 → 1)
현재 8개 분리:
- `ontology/` (125줄, 퀵레퍼런스)
- `ontology-actions/`, `ontology-functions/`, `ontology-links/`, `ontology-object-types/`
- `ontology-palantir/`, `ontology-storage/`, `ontology-traditional/`

→ **`ontology/SKILL.md`에 라우터 역할 유지** + 나머지를 `ontology/` 하위로 이동:
```
ontology/
├── SKILL.md (라우터)
├── actions/SKILL.md
├── functions/SKILL.md
├── links/SKILL.md
├── object-types/SKILL.md
├── palantir/SKILL.md
├── storage/SKILL.md
└── traditional/SKILL.md
```
→ 루트 레벨의 `ontology-*` 7개 삭제

#### 3-2. Django 스킬 통합 (4 → 1)
- `django-patterns/`, `django-security/`, `django-tdd/`, `django-verification/`

→ **`django/` 단일 디렉토리**:
```
django/
├── SKILL.md (메인 + 라우팅)
├── patterns/ (기존 전체 이동)
├── security/ (기존 전체 이동)
├── tdd/ (기존 전체 이동)
└── verification/ (기존 전체 이동)
```

#### 3-3. Spring Boot 스킬 통합 (4 → 1)
- `springboot-patterns/`, `springboot-security/`, `springboot-tdd/`, `springboot-verification/`

→ **`springboot/`** (같은 구조)

#### 3-4. Go 스킬 통합 (2 → 1)
- `golang-patterns/`, `golang-testing/`

→ **`golang/`** (patterns/ + testing/ 하위로)

#### 3-5. `coding-standards` + `java-coding-standards` 병합
→ **`coding-standards/`**에 java 섹션 추가 → `java-coding-standards/` 삭제

#### 3-6. Finance/Trading 스킬 통합 (4 → 1)
- `market-kr/`, `market-us/`, `quant/`, `trading/`

→ **`finance/`** (하위 sub-dirs로 이동)

---

### Phase 4: Agents 통합

동일 역할의 Tier별 Agent를 단일 파일로 병합:

| Before | After |
|--------|-------|
| [architect-low.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/architect-low.md) + [architect-medium.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/architect-medium.md) + [architect.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/architect.md) | [architect.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/architect.md) (3 tiers 포함) |
| [build-fixer-low.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/build-fixer-low.md) + [build-fixer.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/build-fixer.md) | [build-fixer.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/build-fixer.md) |
| [code-reviewer-low.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/code-reviewer-low.md) + [code-reviewer.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/code-reviewer.md) | [code-reviewer.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/code-reviewer.md) |
| [designer-low.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/designer-low.md) + [designer.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/designer.md) + [designer-high.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/designer-high.md) | [designer.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/designer.md) (reviewer 별도 유지) |
| [executor-low.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/executor-low.md) + [executor.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/executor.md) | [executor.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/executor.md) |
| [mobile-developer-low.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/mobile-developer-low.md) + `-medium` + `-high` | [mobile-developer.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/mobile-developer.md) |
| [researcher-low.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/researcher-low.md) + [researcher.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/researcher.md) | [researcher.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/researcher.md) |
| [scientist-low.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/scientist-low.md) + [scientist.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/scientist.md) + `-high` | [scientist.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/scientist.md) (reviewer 별도) |
| [security-reviewer-low.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/security-reviewer-low.md) + [security-reviewer.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/security-reviewer.md) | [security-reviewer.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/security-reviewer.md) |
| [tdd-guide-low.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/tdd-guide-low.md) + [tdd-guide.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/tdd-guide.md) | [tdd-guide.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/tdd-guide.md) |
| [qa-tester.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/qa-tester.md) + [qa-tester-high.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/qa-tester-high.md) | [qa-tester.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/qa-tester.md) |
| [finance-developer.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/finance-developer.md) + [finance-expert.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/finance-expert.md) | `finance.md` |
| [ontology-developer.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/ontology-developer.md) + [-expert.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/finance-expert.md) + [-reviewer.md](file:///Users/cool-m1-max/MyDev/claude/custom/sk-claudecode/agents/go-reviewer.md) | `ontology.md` |

**예상**: 46 → ~28 agent files

---

## Verification Plan

### Automated Tests
```bash
# 프로젝트 루트에서 실행
cd /Users/cool-m1-max/MyDev/claude/custom/sk-claudecode

# 1. 모든 skill dir에 SKILL.md 존재 확인
find skills/ -mindepth 1 -maxdepth 1 -type d \
  ! -name scientific ! -name execution-modes ! -name exploration ! -name quality \
  | while read d; do
    [ -f "$d/SKILL.md" ] || echo "MISSING: $d/SKILL.md"
  done

# 2. 삭제된 skill이 여전히 참조되는지 확인
for deleted in setup tdd-workflow verification-loop continuous-learning-v2 \
  ultra-subagent ultra-plan ralplan ultra-execute ultra-skill-writing \
  java-coding-standards django-patterns django-security django-tdd django-verification \
  springboot-patterns springboot-security springboot-tdd springboot-verification \
  golang-patterns golang-testing ontology-actions ontology-functions ontology-links \
  ontology-object-types ontology-palantir ontology-storage ontology-traditional \
  market-kr market-us quant trading; do
  hits=$(grep -rl "$deleted" commands/ agents/ hooks/ src/ 2>/dev/null | wc -l)
  [ "$hits" -gt 0 ] && echo "STILL REFERENCED ($hits files): $deleted"
done

# 3. Agent 파일 유효성
for f in agents/*.md; do
  head -3 "$f" | grep -q "description:" || echo "MISSING DESC: $f"
done

# 4. 기존 테스트 실행
npm test 2>&1 | tail -20
```

### Manual Verification
- `/setup` 명령어 정상 동작 확인 (setup 삭제 후)
- 병합된 SKILL.md가 원본 핵심 내용을 모두 포함하는지 샘플 리뷰
