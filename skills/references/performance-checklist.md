# Performance Checklist

Quick reference for performance optimization. Use alongside `performance-optimization` and `shipping` skills.

## Frontend Performance

### Core Web Vitals
- [ ] LCP (Largest Contentful Paint) ≤ 2.5s
- [ ] INP (Interaction to Next Paint) ≤ 200ms
- [ ] CLS (Cumulative Layout Shift) ≤ 0.1

### Bundle & Assets
- [ ] JavaScript bundle < 200KB gzipped (initial load)
- [ ] CSS < 50KB gzipped
- [ ] Images < 200KB per image (above the fold)
- [ ] Fonts < 100KB total
- [ ] Code splitting for route-based lazy loading
- [ ] Tree-shaking enabled (no unused imports)
- [ ] Static assets served with long-term cache headers

### Images
- [ ] All images have explicit `width` and `height` attributes
- [ ] Above-fold images use `loading="eager"`, below-fold use `loading="lazy"`
- [ ] Responsive images use `srcset` and `sizes`
- [ ] Modern formats used (WebP/AVIF with fallback)
- [ ] Images compressed appropriately

### Rendering
- [ ] No layout shifts from dynamically loaded content
- [ ] No long tasks (>50ms) blocking the main thread
- [ ] `React.memo` used on expensive components (not everywhere)
- [ ] Stable references for props (avoid inline objects/functions)
- [ ] Virtual scrolling for large lists (>100 items)

### Fonts
- [ ] `font-display: swap` or `optional` set
- [ ] Font files preloaded for critical text
- [ ] Subset fonts to used characters if possible

## Backend Performance

### Database
- [ ] No N+1 query patterns
- [ ] Indexes on frequently queried columns
- [ ] Pagination on all list endpoints
- [ ] Connection pooling configured
- [ ] Slow query logging enabled

### API
- [ ] Response time < 200ms (p95) for critical endpoints
- [ ] Appropriate caching headers (Cache-Control, ETag)
- [ ] Compression enabled (gzip/brotli)
- [ ] No unbounded data fetching (always limit/paginate)
- [ ] Rate limiting on expensive endpoints

### Caching
- [ ] Frequently-read, rarely-changed data is cached
- [ ] Cache invalidation strategy defined
- [ ] CDN configured for static assets
- [ ] HTTP caching headers set appropriately

## Performance Budget

```
JavaScript bundle: < 200KB gzipped (initial load)
CSS: < 50KB gzipped
Images: < 200KB per image (above the fold)
Fonts: < 100KB total
API response time: < 200ms (p95)
Time to Interactive: < 3.5s on 4G
Lighthouse Performance score: ≥ 90
```

## Profiling Commands

```bash
# Bundle analysis
npx webpack-bundle-analyzer stats.json
npx vite-bundle-visualizer

# Lighthouse CI
npx lhci autorun

# Bundle size check
npx bundlesize --config bundlesize.config.json

# Web Vitals in code
import { onLCP, onINP, onCLS } from 'web-vitals';
onLCP(console.log);
onINP(console.log);
onCLS(console.log);
```

## Common Anti-Patterns

| Anti-Pattern | Fix |
|---|---|
| N+1 queries | Use `include`/`join` or DataLoader |
| Unbounded fetches | Always paginate with `take`/`limit` |
| Importing entire libraries | Use tree-shakable imports or `import()` |
| Inline objects in JSX props | Extract to constants or use `useMemo` |
| No image dimensions | Always set `width` and `height` |
| Synchronous heavy computation | Use Web Workers or chunked processing |
| Missing caching headers | Set `Cache-Control` for static and API responses |
