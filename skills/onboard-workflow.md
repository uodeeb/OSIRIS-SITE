# onboard-workflow
# Bootstrap new projects OR onboard agent to existing project.
# Invoke when: "new project", "init", first time opening a codebase,
# or when ai-context/ folder doesn't exist.
# Scope: Global

## WHEN TO USE
- `ai-context/` folder doesn't exist in project
- User says "new project", "set up", "initialize"
- Agent detects it has no context for this codebase

## NEW PROJECT PROTOCOL

### Step 1: Gather Requirements
Ask (only if not provided):
1. App name and purpose (1 sentence)
2. Stack preference (default: Next.js 15 + React 19 + locked stack)
3. Key features (list of 3-5 for initial TODO)
4. Deploy target (default: Netlify)
5. Database (default: Prisma + SQLite for dev)

### Step 2: Scaffold
```bash
npx create-next-app@latest [name] --typescript --tailwind --eslint --app --src-dir
cd [name]
npm i @tanstack/react-query@5 zustand@5 zod@3
npm i -D vitest@3 @playwright/test @testing-library/react
npx shadcn@latest init
```

### Step 3: Create ai-context/ Brain
Create all 7 YAML/MD files per the templates in this skill system.
Populate ARCHITECTURE.yaml with gathered requirements.
Populate TODO.yaml with initial features.

### Step 4: Configure Quality Gates
```bash
# package.json scripts:
"lint": "eslint . --max-warnings 0",
"test": "vitest run",
"test:e2e": "playwright test",
"ci": "npm run lint && npm run test && npm run build",
"precommit": "npm run ci"
```

### Step 5: Git Init + First Commit
```bash
git init
git add -A  
git commit -m "init: [app name] scaffold + ai-context brain"
```

## EXISTING PROJECT ONBOARD

### Step 1: Scan
```bash
# MCP-filesystem: Read project structure
find . -name "*.ts" -o -name "*.tsx" -o -name "*.json" | head -50
cat package.json
cat tsconfig.json
```

### Step 2: Generate ai-context/ from scan
- ARCHITECTURE.yaml: Infer from package.json + file structure
- TODO.yaml: Empty (ask user for priorities)  
- PROJECT-RULES.md: Adapt stack rules to what's actually installed

### Step 3: Memory Seed
- MCP-memory: Store project summary as knowledge entity
- Read recent git log → seed MEMORY-LOG.yaml with last 5 changes

### Step 4: Announce
```
✅ Onboarded: [project name]
Stack: [detected]
Files: [count] 
Tests: [detected framework]
ai-context/: Created + seeded
Ready: "vibe advance" to start working
```

## RULES
- Never overwrite existing configuration without asking
- Detect and respect existing patterns (CSS modules vs Tailwind, etc.)
- If project has no tests → add to TODO.yaml as priority:high
