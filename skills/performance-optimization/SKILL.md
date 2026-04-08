---
name: performance-optimization
description: "Optimizes application performance. Use when performance requirements exist, when you suspect regressions, or when Core Web Vitals or load times need improvement."
triggers:
  - "optimize performance"
  - "slow"
  - "web vitals"
  - "performance"
  - "bundle size"
---

# Performance Optimization

Measure before optimizing. Performance work without measurement is guessing. Profile first, identify the actual bottleneck, fix it, measure again.

## When to Use

- Performance requirements exist in the spec (load time budgets, response time SLAs)
- Users or monitoring report slow behavior
- Core Web Vitals scores are below thresholds
- You suspect a change introduced a regression
- Building features that handle large datasets or high traffic

**When NOT to use:** Don't optimize before you have evidence of a problem. Premature optimization adds complexity that costs more than the performance it gains.

## Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

## The Optimization Workflow

```
1. MEASURE  → Establish baseline with real data
2. IDENTIFY → Find the actual bottleneck (not assumed)
3. FIX      → Address the specific bottleneck
4. VERIFY   → Measure again, confirm improvement
5. GUARD    → Add monitoring or tests to prevent regression
```

### Where to Start Measuring

Use the symptom to decide what to measure first:

```
What is slow?
├── First page load
│   ├── Large bundle? → Measure bundle size, check code splitting
│   ├── Slow server response? → Measure TTFB, check API/database
│   └── Render-blocking resources? → Check network waterfall
├── Interaction feels sluggish
│   ├── UI freezes on click? → Profile main thread, look for long tasks (>50ms)
│   ├── Form input lag? → Check re-renders, controlled component overhead
│   └── Animation jank? → Check layout thrashing, forced reflows
├── Page after navigation
│   ├── Data loading? → Measure API response times
│   └── Client rendering? → Profile component render time
└── Backend / API
    ├── Single endpoint slow? → Profile database queries, check indexes
    ├── All endpoints slow? → Check connection pool, memory, CPU
    └── Intermittent slowness? → Check for lock contention, GC pauses
```

## Common Anti-Patterns & Fixes

### N+1 Queries (Backend)

```typescript
// BAD: N+1 — one query per item for the related data
const items = await db.items.findMany();
for (const item of items) {
  item.owner = await db.users.findUnique({ where: { id: item.ownerId } });
}

// GOOD: Single query with join/include
const items = await db.items.findMany({
  include: { owner: true },
});
```

### Unbounded Data Fetching

```typescript
// BAD: Fetching all records
const all = await db.items.findMany();

// GOOD: Paginated with limits
const items = await db.items.findMany({
  take: 20,
  skip: (page - 1) * 20,
  orderBy: { createdAt: 'desc' },
});
```

### Missing Image Optimization

```html
<!-- BAD -->
<img src="/hero.jpg" />

<!-- GOOD: Responsive, lazy-loaded, properly sized -->
<img
  src="/hero.jpg"
  srcset="/hero-400.webp 400w, /hero-800.webp 800w, /hero-1200.webp 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  width="1200" height="600"
  loading="lazy"
  alt="Hero image description"
/>
```

### Unnecessary Re-renders (React)

```tsx
// BAD: Creates new object on every render
function List() {
  return <Filters options={{ sortBy: 'date', order: 'desc' }} />;
}

// GOOD: Stable reference
const DEFAULT_OPTIONS = { sortBy: 'date', order: 'desc' } as const;
function List() {
  return <Filters options={DEFAULT_OPTIONS} />;
}

// Use React.memo for expensive components
const ExpensiveItem = React.memo(function ExpensiveItem({ data }: Props) {
  return <div>{/* expensive render */}</div>;
});
```

### Large Bundle Size

```typescript
// BAD: Importing entire library
import { format } from 'date-fns';

// GOOD: Tree-shakable import
import { format } from 'date-fns/format';

// GOOD: Dynamic import for heavy, rarely-used features
const ChartLibrary = lazy(() => import('./ChartLibrary'));
```

### Missing Caching

```typescript
// Cache frequently-read, rarely-changed data
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cachedConfig: AppConfig | null = null;
let cacheExpiry = 0;

async function getAppConfig(): Promise<AppConfig> {
  if (cachedConfig && Date.now() < cacheExpiry) {
    return cachedConfig;
  }
  cachedConfig = await db.config.findFirst();
  cacheExpiry = Date.now() + CACHE_TTL;
  return cachedConfig;
}
```

## Performance Budget

Set budgets and enforce them:

```
JavaScript bundle: < 200KB gzipped (initial load)
CSS: < 50KB gzipped
Images: < 200KB per image (above the fold)
Fonts: < 100KB total
API response time: < 200ms (p95)
Time to Interactive: < 3.5s on 4G
Lighthouse Performance score: ≥ 90
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "We'll optimize later" | Performance debt compounds. Fix anti-patterns now. |
| "It's fast on my machine" | Your machine isn't the user's. Profile on representative hardware. |
| "This optimization is obvious" | If you didn't measure, you don't know. Profile first. |
| "Users won't notice 100ms" | Research shows 100ms delays impact conversion rates. |
| "The framework handles performance" | Frameworks can't fix N+1 queries or oversized bundles. |

## Red Flags

- Optimization without profiling data to justify it
- N+1 query patterns in data fetching
- List endpoints without pagination
- Images without dimensions, lazy loading, or responsive sizes
- Bundle size growing without review
- No performance monitoring in production
- `React.memo` and `useMemo` everywhere (overusing is as bad as underusing)

## Verification

After any performance-related change:

- [ ] Before and after measurements exist (specific numbers)
- [ ] The specific bottleneck is identified and addressed
- [ ] Core Web Vitals are within "Good" thresholds
- [ ] Bundle size hasn't increased significantly
- [ ] No N+1 queries in new data fetching code
- [ ] Existing tests still pass

## See Also

- `references/performance-checklist.md` — Detailed performance checklist

## Related Skills

- `frontend-ui-ux` — Frontend optimization
- `agent-browser` — Browser performance profiling
- `ci-cd` — Enforce performance budgets in CI

## Related Agents

- `architect` - Architecture analysis (Sonnet)
- `code-reviewer` - Performance review
