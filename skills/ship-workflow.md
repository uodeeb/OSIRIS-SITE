# ship-workflow
# End-to-end shipping: Test → Build → PR → Deploy Preview → Verify → Merge.
# Invoke when: "ship it", "create PR", "deploy", "release", "push to prod".
# Scope: Global

## WHEN TO USE
- Task marked done in TODO.yaml and human approves shipping
- "Ship this", "create a PR", "deploy to staging/prod"
- End of a feature branch

## PROTOCOL

### Phase 1: PRE-FLIGHT CHECK
```bash
# MCP-terminal: Run full CI locally
npm run lint          # Must: 0 errors, 0 warnings
npm run test          # Must: 100% pass
npm run build         # Must: succeed, 0 errors
npx tsc --noEmit      # Must: 0 type errors
```
If ANY fails → stop → invoke `debug-workflow` skill → fix first.

Report:
```
PRE-FLIGHT: ✅ lint | ✅ test (47/47) | ✅ build | ✅ types
```

### Phase 2: DOCUMENTATION CHECK
1. Is CHANGELOG-AI.yaml updated? If not → invoke `doc-generator`
2. Are new components documented? If not → generate JSDoc
3. Is README current? Flag if stale.

### Phase 3: GIT PREP
```bash
# MCP-GitHub:
git add -A
git status  # Review: no unintended files
git commit -m "[type]: [description] (#[task_id])

- [bullet point changes]
- AI-assisted: [skill used]

Task: [task_id] | Tokens: ~[total]"
```

Commit types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

### Phase 4: PR CREATION
MCP-GitHub create PR:
```markdown
## What
[Task title from TODO.yaml]

## Why  
[Context from ARCHITECTURE.yaml decisions]

## Changes
[From CHANGELOG-AI.yaml recent entries]

## Testing
- [ ] Lint: 0 errors
- [ ] Unit tests: [count] pass
- [ ] E2E tests: [count] pass  
- [ ] Build: success
- [ ] Manual review: [describe what to check]

## AI Context
Task #[id] | Steps: [count] | Tokens: ~[total]
Full log: `ai-context/MEMORY-LOG.yaml`
```

### Phase 5: DEPLOY PREVIEW
```bash
# MCP-netlify:
netlify deploy --dir=.next  # or build output
# Capture preview URL
```
Then MCP-playwright: Navigate to preview URL → screenshot key pages → report.

### Phase 6: POST-SHIP
1. Update TODO.yaml: status → shipped
2. Update MEMORY-LOG.yaml: final entry with PR URL + deploy URL
3. Git commit ai-context/: `ctx: shipped task#[id]`
4. Announce: "✅ Shipped: [title] | PR: [url] | Preview: [url]"

## RULES
- NEVER ship without all Phase 1 checks passing
- NEVER force-push or merge without human approval
- If deploy fails → capture error → invoke `recovery-workflow`
