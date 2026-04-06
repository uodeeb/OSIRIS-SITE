# OSIRIS NOVEL — MASTER PRODUCTION PLAN
**Document ID:** 01  
**Created:** 2026-04-06  
**Status:** ACTIVE  
**Version:** 1.0.0  

---

## DOCUMENT HIERARCHY

| # | Document | Purpose | Status |
|---|----------|---------|--------|
| 01 | **Master Production Plan** (this) | Complete roadmap, timeline, dependencies | ACTIVE |
| 02 | Architecture & Asset Migration Plan | Vercel static asset strategy | ACTIVE |
| 03 | UX/UI Review & Fixes | All UI/UX issues and solutions | ACTIVE |
| 04 | Implementation Tracking | Git commits, change log, progress | ACTIVE |

---

## PROJECT VISION

**Goal:** Deploy OSIRIS interactive novel to Vercel with optimized performance, accessibility compliance, and cinematic UX preserved.

**Success Criteria:**
- Lighthouse scores ≥ 90 (all categories)
- Zero critical accessibility violations
- First Contentful Paint < 1.5s on 4G
- 100% asset loading success rate
- Full keyboard navigation support
- Mobile-responsive (iPhone SE → Desktop)

---

## ARCHITECTURAL DECISION RECORD (ADR)

### ADR-001: Static Asset Strategy over DB/R2
**Status:** ACCEPTED  
**Date:** 2026-04-06

**Context:** Current architecture uses Cloudflare R2 + PostgreSQL for asset storage. Vercel deployment requires reevaluation.

**Decision:** Migrate to pure static assets served from Vercel Edge Network.

**Rationale:**
- 50 assets = fits entirely in static build
- No user-generated content
- Eliminates $25+/month database costs
- Removes cold-start latency (2-5s → 0s)
- Simpler architecture = fewer failure points
- No serverless function timeout risks

**Consequences:**
- Positive: Faster, cheaper, simpler
- Negative: 100GB bandwidth limit (acceptable)
- Neutral: Build time increases slightly

### ADR-002: Framer Motion with Reduced Motion Support
**Status:** ACCEPTED  

**Decision:** Keep Framer Motion but implement comprehensive `prefers-reduced-motion` support.

**Rationale:** Motion is core to cinematic experience, but accessibility requires user control.

---

## PHASE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRODUCTION TIMELINE (15 Days)                      │
├─────┬─────────────────────────────────────────────────────────────────────┤
│ Day │ Phase & Key Deliverables                                           │
├─────┼─────────────────────────────────────────────────────────────────────┤
│ 1-2 │ PHASE 0: Foundation                                                │
│     │ • Design system tokens                                               │
│     │ • Animation utilities                                                │
│     │ • TypeScript fixes                                                 │
├─────┼─────────────────────────────────────────────────────────────────────┤
│ 3-5 │ PHASE 1: Asset Architecture Migration                                │
│     │ • Asset manifest generation                                          │
│     │ • Static asset system implementation                                 │
│     │ • Vercel configuration                                             │
├─────┼─────────────────────────────────────────────────────────────────────┤
│ 6-9 │ PHASE 2: UI/UX Refactoring                                         │
│     │ • Motion fixes (reduced-motion, performance)                       │
│     │ • Interaction improvements (loading, focus, keyboard)                │
│     │ • Accessibility compliance (a11y audit fixes)                      │
│     │ • Responsive design (mobile-first)                                   │
├─────┼─────────────────────────────────────────────────────────────────────┤
│10-12│ PHASE 3: Code Quality                                              │
│     │ • State management optimization                                      │
│     │ • Performance improvements                                           │
│     │ • Error handling & boundaries                                      │
├─────┼─────────────────────────────────────────────────────────────────────┤
│13-14│ PHASE 4: Testing & Validation                                        │
│     │ • Accessibility testing (axe, screen readers)                        │
│     │ • Performance testing (Lighthouse CI)                                │
│     │ • Cross-browser testing                                             │
├─────┼─────────────────────────────────────────────────────────────────────┤
│ 15  │ PHASE 5: Deployment                                                │
│     │ • Production build                                                 │
│     │ • Vercel deployment                                                │
│     │ • Post-deployment verification                                     │
└─────┴─────────────────────────────────────────────────────────────────────┘
```

---

## DETAILED PHASE BREAKDOWN

### PHASE 0: Foundation (Days 1-2)

#### Day 1 Morning: Design System Tokens
**Files to Create:**
```
client/src/tokens/
├── colors.ts          # Centralized color system
├── typography.ts      # Type scale & semantic tokens
├── spacing.ts         # Spacing scale
├── radius.ts          # Border radius tokens
├── animation.ts       # Animation presets & timing
└── index.ts           # Barrel export
```

**Acceptance Criteria:**
- [ ] All colors from existing code extracted and tokenized
- [ ] Typography scale replaces all arbitrary values (text-[11px])
- [ ] Tokens are TypeScript-typed with autocompletion
- [ ] No hardcoded colors remain in component files

**Git Commit:** `feat(tokens): establish design system foundation`

#### Day 1 Afternoon: Animation Utilities
**Files to Create:**
```
client/src/hooks/
├── useReducedMotion.ts      # Motion preference detection
├── useHapticFeedback.ts     # Mobile haptic feedback
├── useFocusTrap.ts          # Modal focus management
├── useLoadingState.ts       # Consistent loading states
└── useMediaSelector.ts      # Fine-grained media context

client/src/lib/
├── animationPresets.ts      # Reusable animation configs
└── styleUtils.ts            # Type-safe CSS custom properties
```

**Acceptance Criteria:**
- [ ] `useReducedMotion` integrates with Framer Motion
- [ ] `useFocusTrap` works with Radix Dialog
- [ ] `animationPresets` exports pre-configured transitions
- [ ] All hooks have JSDoc documentation

**Git Commit:** `feat(hooks): add animation and interaction utilities`

#### Day 2 Morning: TypeScript Fixes
**Files to Modify:**
- `client/src/lib/styleUtils.ts` (create)
- All files using `as React.CSSProperties`

**Pattern to Replace:**
```typescript
// BEFORE
style={{ '--choice-bg': 'rgba(0,0,0,0.72)' } as React.CSSProperties}

// AFTER
import { customStyles } from '@/lib/styleUtils';
style={customStyles({ '--choice-bg': 'rgba(0,0,0,0.72)' })}
```

**Acceptance Criteria:**
- [ ] Zero `as React.CSSProperties` casts remain
- [ ] `styleUtils` provides typed custom property helpers
- [ ] No TypeScript errors in strict mode

**Git Commit:** `refactor(types): replace unsafe CSS property casts`

#### Day 2 Afternoon: Phase 0 Validation
**Checklist:**
- [ ] Tokens compile without errors
- [ ] Hooks work in test components
- [ ] Import paths resolve correctly
- [ ] Storybook (if used) displays tokens

---

### PHASE 1: Asset Architecture Migration (Days 3-5)

#### Day 3 Morning: Asset Inventory & Manifest Generation
**Script to Create:** `scripts/generate-asset-manifest.ts`

**Function:**
1. Scan `generated-assets/` directory
2. Generate normalized filenames (no Arabic characters)
3. Create `assets-manifest.json`
4. Validate all referenced assets exist

**Output:**
```json
{
  "version": "1.0.0",
  "generatedAt": "2026-04-06T12:00:00Z",
  "assets": {
    "characters": {
      "yahya": "/generated-assets/characters/yahya-portrait.jpeg",
      "laila": "/generated-assets/characters/laila-portrait.jpeg",
      "tarek": "/generated-assets/characters/tarek-portrait.jpeg"
    },
    "backgrounds": {
      "osiris_cosmic": "/generated-assets/images/01.jpg",
      "courtroom": "/generated-assets/images/courtroom.webp"
    },
    "audio": {
      "theme_main": "/generated-assets/music-tracks/osiris-theme.mp3"
    },
    "video": {
      "intro": "/generated-assets/video-bg/intro.mp4"
    }
  }
}
```

**Acceptance Criteria:**
- [ ] Script runs successfully
- [ ] All assets accounted for
- [ ] URLs are relative (not absolute domains)
- [ ] Missing assets are flagged with warnings

**Git Commit:** `feat(assets): add asset manifest generation script`

#### Day 3 Afternoon: Static Asset System
**Files to Create:**
- `client/src/lib/staticAssets.ts` — replaces `assetOverrides.ts`

**API Design:**
```typescript
// lib/staticAssets.ts
import assetManifest from '../../../assets-manifest.json';

export const STATIC_ASSETS = assetManifest.assets;

export function getAssetUrl(
  category: 'characters' | 'backgrounds' | 'audio' | 'video',
  key: string
): string;

export function getChapterAccent(chapterId: string): string;

export function preloadAssets(keys: string[]): Promise<void>;
```

**Files to Modify:**
- `client/src/lib/assetUrls.ts` — migrate to static system
- `client/src/lib/assetOverrides.ts` — deprecate, add warnings

**Acceptance Criteria:**
- [ ] `ASSET_URLS` proxy replaced with static lookups
- [ ] No runtime tRPC calls for asset URLs
- [ ] All components import from new location
- [ ] Console warnings for old API usage

**Git Commit:** `feat(assets): implement static asset resolution system`

#### Day 4 Morning: Vercel Configuration
**Files to Modify:**
- `vercel.json` — complete rewrite

**Configuration:**
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/generated-assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" },
        { "key": "Vary", "value": "Accept-Encoding" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "default-src 'self'; img-src 'self' data: blob:; media-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

**Acceptance Criteria:**
- [ ] Static assets cache for 1 year (immutable)
- [ ] CSP headers configured
- [ ] Security headers applied
- [ ] SPA routing works

**Git Commit:** `config(vercel): production deployment configuration`

#### Day 4 Afternoon: Build Script Integration
**Files to Modify:**
- `package.json` — add build steps
- `scripts/copy-assets.js` — copy to dist

**Script:**
```json
{
  "scripts": {
    "prebuild": "node scripts/generate-asset-manifest.ts",
    "build": "vite build && node scripts/copy-assets.js",
    "postbuild": "node scripts/verify-build.ts"
  }
}
```

**Acceptance Criteria:**
- [ ] Build generates manifest automatically
- [ ] Assets copied to `dist/public/generated-assets/`
- [ ] Verification script passes
- [ ] Build completes without errors

**Git Commit:** `build(scripts): integrate asset pipeline into build`

#### Day 5: Phase 1 Validation
**Testing:**
```bash
# 1. Generate manifest
npm run prebuild

# 2. Verify manifest valid JSON
jq . assets-manifest.json

# 3. Full build
npm run build

# 4. Check dist structure
ls -la dist/public/generated-assets/

# 5. Serve locally
npx serve dist/public

# 6. Manual URL test
curl -I http://localhost:3000/generated-assets/characters/yahya-portrait.jpeg
# Expected: 200 OK with Cache-Control header
```

**Acceptance Criteria:**
- [ ] All assets accessible via new URLs
- [ ] 200 responses with proper caching headers
- [ ] No 404s in browser console
- [ ] Local server works identically to production

---

### PHASE 2: UI/UX Refactoring (Days 6-9)

#### Day 6 Morning: Motion Fixes (Critical)
**Files to Modify:**
- `client/src/components/ExpandableChapters.tsx`

**Changes:**
```diff
+ import { useReducedMotion } from "framer-motion";

  export default function ExpandableChapters(...) {
+   const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
-     if (!autoPlay || isHovering) return;
+     if (!autoPlay || isHovering || shouldReduceMotion) return;
      const interval = setInterval(() => {...}, 5000);
      return () => clearInterval(interval);
-   }, [autoPlay, isHovering]);
+   }, [autoPlay, isHovering, shouldReduceMotion]);
  }
```

**Files to Modify:**
- `client/src/components/MainPlayer.tsx` (55 animation instances)

**Pattern:** Add `shouldReduceMotion` check to all `motion.*` components.

**Git Commit:** `a11y(motion): add prefers-reduced-motion support`

#### Day 6 Afternoon: Performance Animation Fixes
**Files to Modify:**
- `client/src/components/MainPlayer.tsx`

**Replace inline styles:**
```diff
- <motion.button
-   style={{ '--choice-bg': 'rgba(0,0,0,0.72)' } as React.CSSProperties}
-   onMouseEnter={(e) => {...}}
- >
+ <motion.button className={styles.dynamicChoicePanel}>
```

**Create:** `client/src/components/MainPlayer.module.css`

**Git Commit:** `perf(animation): move inline styles to CSS modules`

#### Day 7 Morning: Interaction Improvements
**Files to Create:**
- `client/src/components/SceneTransitionLoader.tsx`

**Files to Modify:**
- `client/src/components/MainPlayer.tsx` — add loading states

**Acceptance Criteria:**
- [ ] Scene transitions show progress
- [ ] Assets preload before display
- [ ] Error states handled gracefully

**Git Commit:** `feat(ui): add loading states and transitions`

#### Day 7 Afternoon: Keyboard Navigation
**Files to Modify:**
- `client/src/components/ExpandableChapters.tsx` — add keyboard handlers
- `client/src/components/ChapterLaunchModal.tsx` — focus trap
- `client/src/components/AudioConsentModal.tsx` — focus management

**Git Commit:** `a11y(keyboard): implement full keyboard navigation`

#### Day 8 Morning: Responsive Design
**Files to Modify:**
- `client/src/pages/EnhancedHome.tsx` — mobile layout
- `client/src/components/MainPlayer.tsx` — responsive adjustments

**Changes:**
- Replace `h-screen` with `h-dvh`
- Add mobile-first breakpoints
- Implement horizontal scroll for chapters on mobile

**Git Commit:** `feat(responsive): mobile-first layout implementation`

#### Day 8 Afternoon: Visual Polish
**Files to Modify:**
- All components using arbitrary Tailwind values

**Pattern:**
```diff
- <span className="text-[11px]" />
+ <span className={typography.label} />
```

**Git Commit:** `style(tokens): apply design system consistently`

#### Day 9: Phase 2 Validation
**Testing:**
```bash
# 1. Reduced motion test
# System Preferences → Accessibility → Display → Reduce Motion → ON
# Verify all animations disabled

# 2. Keyboard navigation test
# Tab through entire application
# Verify all interactive elements reachable

# 3. Mobile responsive test
# Chrome DevTools → iPhone SE
# Verify no horizontal overflow
# Verify touch targets ≥ 44px
```

---

### PHASE 3: Code Quality (Days 10-12)

#### Day 10: State Management
**Files to Create:**
- `client/src/contexts/MediaStateContext.tsx`
- `client/src/contexts/MediaActionsContext.tsx`

**Files to Modify:**
- Deprecate `MediaControllerContext.tsx` (monolithic)

**Migration Guide:**
```typescript
// BEFORE
const { state, play, pause } = useMediaController(); // Re-renders on any state change

// AFTER
const state = useMediaState();      // Re-renders on state changes
const actions = useMediaActions();  // Never re-renders
```

**Git Commit:** `refactor(state): split context for performance`

#### Day 11: Performance Optimization
**Tasks:**
1. Memoize inline objects in JSX
2. Implement route-based code splitting
3. Add preloading strategy
4. Optimize bundle with Rollup visualizer

**Git Commit:** `perf(bundle): implement code splitting and preloading`

#### Day 12: Error Handling
**Files to Create:**
- `client/src/components/ErrorBoundary.tsx` (enhanced)
- `client/src/components/RouteErrorFallback.tsx`

**Files to Modify:**
- `client/src/App.tsx` — wrap all routes

**Git Commit:** `feat(error): comprehensive error boundaries`

---

### PHASE 4: Testing & Validation (Days 13-14)

#### Day 13: Automated Testing
**Run Commands:**
```bash
# 1. Type check
npx tsc --noEmit

# 2. Lint
npm run lint

# 3. Unit tests
npm run test:unit

# 4. E2E tests
npm run test:e2e

# 5. Lighthouse CI
npx lhci autorun
```

**Acceptance Criteria:**
- [ ] 0 TypeScript errors
- [ ] 0 ESLint errors
- [ ] All tests pass
- [ ] Lighthouse scores ≥ 90

**Git Commit:** `test(validation): add automated testing pipeline`

#### Day 14: Manual Testing
**Checklist:**
- [ ] Screen reader test (NVDA/VoiceOver)
- [ ] Keyboard-only navigation complete
- [ ] Mobile devices (iPhone, Android)
- [ ] Cross-browser (Chrome, Firefox, Safari, Edge)
- [ ] Color contrast verification (WCAG AAA)
- [ ] Performance profiling (React DevTools Profiler)

**Document Results:**
Add findings to `project_history/04_implementation_tracking.md`

---

### PHASE 5: Deployment (Day 15)

#### Morning: Production Build
```bash
# Clean build
rm -rf dist/
npm ci
npm run build

# Verify build
ls -la dist/public/
npx serve dist/public
```

#### Afternoon: Vercel Deployment
```bash
# Deploy to production
vercel --prod

# Verify deployment
vercel --version
```

#### Post-Deployment Verification
```bash
# 1. Asset verification
curl -I https://osiris-novel.vercel.app/generated-assets/characters/yahya-portrait.jpeg

# 2. Security headers
curl -I https://osiris-novel.vercel.app/ | grep -E "(CSP|X-Frame|X-Content)"

# 3. Lighthouse test
npx lighthouse https://osiris-novel.vercel.app/ --output=json

# 4. Mobile test (PageSpeed Insights)
# https://pagespeed.web.dev/
```

**Final Git Commit:** `chore(release): v1.0.0 production deployment`
**Git Tag:** `git tag -a v1.0.0 -m "Production release"`

---

## CHANGE TRACKING PROTOCOL

### Git Commit Convention

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` — New feature
- `fix` — Bug fix
- `refactor` — Code restructuring
- `perf` — Performance improvement
- `style` — Visual/style changes
- `a11y` — Accessibility improvement
- `config` — Configuration changes
- `docs` — Documentation
- `test` — Testing
- `chore` — Maintenance

**Scopes:**
- `tokens` — Design system
- `assets` — Asset system
- `ui` — UI components
- `motion` — Animations
- `a11y` — Accessibility
- `state` — State management
- `build` — Build system
- `vercel` — Deployment

### Document Updates

Every significant change must update:
1. `04_implementation_tracking.md` — Change log
2. Git commit message — Technical details
3. This master plan — If scope changes

---

## RISK MITIGATION

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Asset migration breaks existing URLs | Medium | High | Keep redirects; test all URLs |
| Reduced-motion breaks animations | Low | Medium | Feature flag; gradual rollout |
| Mobile layout issues | Medium | Medium | Device testing; responsive QA |
| Performance regression | Low | High | Lighthouse CI gates |
| Accessibility violations | Medium | High | Automated a11y testing |
| Deployment failure | Low | High | Staging environment; rollback plan |

---

## SUCCESS METRICS

### Objective KPIs
- Lighthouse Performance: ≥ 90
- Lighthouse Accessibility: ≥ 95
- Lighthouse Best Practices: ≥ 95
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

### Subjective KPIs
- No critical bug reports in first week
- Positive user feedback on performance
- Successful mobile usage (> 30% of traffic)

---

## APPENDICES

### A. File Inventory (Modified)
```
client/src/
├── tokens/                          [NEW - 6 files]
├── hooks/                           [NEW/UPDATE - 5 files]
├── contexts/                        [REFACTOR - 2 files]
├── components/
│   ├── MainPlayer.tsx               [CRITICAL - 500+ lines changed]
│   ├── ExpandableChapters.tsx       [HIGH - 50 lines changed]
│   ├── ChapterLaunchModal.tsx       [MEDIUM - 20 lines changed]
│   └── [additional files]
├── lib/
│   ├── staticAssets.ts              [NEW - replaces assetOverrides.ts]
│   ├── assetUrls.ts                 [UPDATE - use static system]
│   └── assetOverrides.ts            [DEPRECATED - add warnings]
├── pages/
│   └── EnhancedHome.tsx             [MEDIUM - responsive layout]
└── App.tsx                          [MEDIUM - error boundaries]

scripts/
├── generate-asset-manifest.ts       [NEW]
├── copy-assets.js                   [NEW/UPDATE]
└── verify-build.ts                  [NEW]

config/
└── vercel.json                      [COMPLETE REWRITE]
```

### B. Dependency Changes
```json
{
  "dependencies": {
    "@vercel/analytics": "^1.0.0"    // ADD
  },
  "devDependencies": {
    "@axe-core/react": "^4.8.0",     // ADD - a11y testing
    "@lhci/cli": "^0.12.0",          // ADD - Lighthouse CI
    "rollup-plugin-visualizer": "^5.9.0"  // ADD - bundle analysis
  }
}
```

### C. Testing Commands Reference
```bash
# Development
npm run dev              # Start dev server
npm run build          # Production build
npm run preview        # Preview production build

# Testing
npm run test           # Unit tests
npm run test:e2e       # E2E tests
npm run test:a11y      # Accessibility tests
npm run lighthouse     # Lighthouse CI

# Analysis
npm run analyze        # Bundle analysis
npm run typecheck      # TypeScript check
npm run lint           # ESLint
```

---

## DOCUMENT CONTROL

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-04-06 | Cascade | Initial release |

**Next Review Date:** 2026-04-20 (post-deployment)

**Document Owner:** Development Lead

**Distribution:** Full team, stakeholders

---

*This document is the single source of truth for the OSIRIS Novel production deployment. All changes must be tracked in git and documented in `04_implementation_tracking.md`.*
