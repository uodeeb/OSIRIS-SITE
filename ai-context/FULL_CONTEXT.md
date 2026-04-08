# OSIRIS Novel — Full Project Context

## Project Overview
**Name:** OSIRIS-SITE  
**Type:** Interactive novel web application  
**Stack:** React 19 + Vite + Tailwind + tRPC + Drizzle (MySQL)

## Active Skills Registry

### 1. Vibe-Coder-2026 (Active)
**Source:** `launch_skill.md`  
**Purpose:** Zero-hallucination React development with YAML self-tracking  
**Location:** `ai-context/` (7 files created)  
**Commands:**
- `vibe add_task: [description]` — Add task to TODO.yaml
- `vibe advance_task` — Execute next task with verification
- `vibe status` — Show progress summary
- `vibe recover_error` — Error recovery
- `vibe ship_pr` — Commit and prepare PR

**Constitution:**
- MCP-only tools (filesys, git, terminal, playwright)
- Self-track YAML after every step
- <100 tokens/step
- React 19 + TanStack Query 5 + Zustand 5 + Tailwind 4 + shadcn + Zod 3
- ReAct loop: Read context → YAML-plan → Execute → Verify → Log

### 2. Asset System Fix (Planned)
**Source:** `.windsurf/plans/asset-system-once-and-for-all-e60f5e.md`  
**Purpose:** Consolidate 3 competing asset systems into single static architecture  
**Status:** Phase 1-2 complete, Phase 3-5 pending  
**Timeline:** ~7 hours total

## Technical Architecture

### Current Stack (from ARCHITECTURE.yaml)
```yaml
framework: react@19
ui: tailwind + shadcn
state: zustand@5
data: tanstack-query@5
schema: zod@3
```

### Asset Systems (3 competing — being consolidated)
| System | File | Status | Lines |
|--------|------|--------|-------|
| assetUrls.ts | `client/src/lib/assetUrls.ts` | DEPRECATED | 270+ |
| assetOverrides.ts | `client/src/lib/assetOverrides.ts` | DEPRECATED | 200+ |
| staticAssets.ts | `client/src/lib/staticAssets.ts` | DEPRECATED | 100+ |
| **assets.ts** | `client/src/lib/assets.ts` | **ACTIVE** | ~150 |

**Impact:** 149 matches across 36 files still using deprecated systems

### tRPC Routers (Keep vs Remove)
| Router | Purpose | Status |
|--------|---------|--------|
| mediaRouter | Asset URLs from DB | **REMOVE** (replaced by static) |
| systemRouter | Health, debug, seeding | KEEP |
| auth | User authentication | KEEP |
| voiceTranscription | AI voice-to-text | KEEP |
| imageGeneration | AI image generation | KEEP |
| llm | LLM integration | KEEP |
| map | Story map features | KEEP |
| notification | Push notifications | KEEP |

## AI Context Files Structure

```
ai-context/
├── PROJECT-RULES.md      # AI constitution (Vibe Coder 2026)
├── ARCHITECTURE.yaml     # Tech stack definition
├── TODO.yaml            # Task queue
├── CURRENT-TASK.yaml    # Active task tracker
├── MEMORY-LOG.yaml      # Step-by-step execution log
├── ERROR-LOG.yaml       # Error recovery tracking
├── CHANGELOG-AI.yaml    # AI-generated changes
└── FULL_CONTEXT.md      # This file — project encyclopedia
```

## Key Files Reference

### Configuration
- `package.json` — Dependencies and scripts
- `vite.config.ts` — Vite configuration
- `tsconfig.json` — TypeScript config
- `.env.example` — Environment template

### Documentation
- `README.md` — Project overview
- `ASSET_SYSTEM_IMPLEMENTATION.md` — Asset system status
- `docs/ASSET_SYSTEM.md` — Asset architecture
- `docs/ASSET_TROUBLESHOOTING.md` — Debug guide
- `.windsurf/plans/asset-system-once-and-for-all-e60f5e.md` — Full asset fix plan

### Client Core
- `client/src/App.tsx` — Main app component
- `client/src/lib/assets.ts` — New asset system
- `client/src/index.css` — Global styles

### Server Core
- `server/index.ts` — Express server entry
- `server/db.ts` — Database connection
- `server/_core/` — tRPC routers and core logic

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev              # Starts on port 3000

# Production build
pnpm build
pnpm start

# Type checking
pnpm check

# Testing
pnpm test

# Database
pnpm db:push          # Generate + run migrations
```

## Asset Build Pipeline

```bash
# Build assets (normalize Arabic filenames, copy to /public)
npx tsx scripts/build-assets.ts

# Verify asset health
npx tsx server/scripts/verify-assets.ts

# Seed database with R2 URLs
npx tsx server/inlineSeed.ts
```

## Pending Work (from ASSET_SYSTEM_IMPLEMENTATION.md)

1. **Component Migration** — Update 38 files to use new `assets.ts` imports
2. **tRPC Cleanup** — Remove `mediaRouter.ts` and database asset tables
3. **Delete Legacy** — Remove deprecated asset systems

## Token Efficiency Targets

- Per-step output: <100 tokens
- YAML references over content pasting: 60% savings
- Git diffs over full files: 80% savings
- Auto-prune MEMORY-LOG.yaml at 50 entries

## Git Branches Context

- `audit-progress` — Current working branch with fixes applied
- `production` — Target stable branch for comparison

---

**Last Updated:** 2026-04-08  
**Skill Version:** Vibe-Coder-2026 v1.0
