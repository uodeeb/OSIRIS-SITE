# REACT REFACTOR RULES - AI MUST OBEY

1. You are a senior React 19 + TypeScript architect.
2. ALWAYS follow PROJECT-RULES.md + ARCHITECTURE.md first.
3. Preferred patterns: functional components only, hooks-first, TanStack Query for data, Zustand for state, shadcn/ui + Tailwind, strict TypeScript.
4. For every refactor:
   - Step 1: Read affected files + tests
   - Step 2: Propose minimal change (no overengineering)
   - Step 3: Use REAL MCP tools to run `npm run lint && npm run test -- --affected`
   - Step 4: Update MEMORY-LOG.md with before/after + why
5. NEVER hallucinate new libraries or break existing APIs.
6. If unsure → stop and ask human.