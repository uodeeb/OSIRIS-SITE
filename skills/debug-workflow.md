# debug-workflow
# Structured debugging: Reproduce → Isolate → Root-cause → Fix → Verify → Document.
# Invoke when: error reported, test failing, unexpected behavior, crash, regression.
# Scope: Global

## WHEN TO USE
- User reports a bug or error
- Tests are failing
- "It was working before and now it's broken"
- Console errors, build failures, runtime exceptions

## PROTOCOL (strict order — never skip steps)

### Phase 1: REPRODUCE (before touching any code)
1. Read the error message/description completely
2. MCP-filesystem: Read the relevant source files
3. MCP-sequential-thinking: Form hypothesis about root cause
4. Identify the minimal reproduction:
   - Which file(s)?
   - Which function/component?
   - What input triggers it?
5. MCP-terminal: Run the failing test or trigger the error
   ```bash
   npm run test -- --filter="[relevant test]"
   # or
   npm run dev  # + MCP-playwright navigate to error state
   ```
6. Capture EXACT error output → paste into response

### Phase 2: ISOLATE
1. Is this a:
   - [ ] Syntax error (typo, missing import, wrong path)
   - [ ] Logic error (wrong condition, off-by-one, race condition)
   - [ ] Type error (TS strict violation, null/undefined)
   - [ ] Dependency error (version mismatch, missing package)
   - [ ] State error (stale state, wrong update pattern)
   - [ ] API error (wrong endpoint, auth, payload shape)
   - [ ] Environment error (env var, config, build vs dev)
2. Use `git log --oneline -10` to check: did this break recently?
3. If recent: `git diff HEAD~3 -- [file]` to find the breaking change

### Phase 3: ROOT CAUSE
1. MCP-sequential-thinking: Chain through the logic
2. State the root cause in ONE sentence:
   > "The bug is caused by [X] in [file:line] because [Y]"
3. Confirm by predicting: "If my diagnosis is correct, then [Z] should also be true"
4. Verify prediction

### Phase 4: FIX
1. Smallest possible change. Do NOT refactor adjacent code.
2. Output as git diff format
3. If fix requires >20 lines → break into sub-steps
4. Each sub-step: propose → wait for approval

### Phase 5: VERIFY
```bash
# Run in order:
npm run lint          # 0 errors
npm run test          # all pass
npm run build         # succeeds
# If UI bug:
npx playwright test   # E2E passes
```
Report exact output.

### Phase 6: DOCUMENT
Append to `ai-context/ERROR-LOG.yaml`:
```yaml
- timestamp: "[ISO]"
  task_id: [id if applicable]
  error: "[original error message]"
  root_cause: "[one sentence]"
  fix: "[what was changed]"
  files: ["changed files"]
  prevention: "[how to prevent this class of bug]"
  regression_test: "[test file:name if added]"
```
Append to MEMORY-LOG.yaml as normal step.

## ESCALATION
If after Phase 2 you cannot isolate:
1. Say: "I cannot isolate this with available context. I need:"
2. List specific files/info needed
3. Suggest: MCP-deepview for deep analysis (if complex), or
4. MCP-Context7 to check if this is a known library bug

## RULES
- NEVER guess at a fix without reproducing first
- NEVER apply a fix without running verification
- If the fix works but you don't understand WHY → flag it
- One bug per debug cycle. Don't scope-creep into other issues.
