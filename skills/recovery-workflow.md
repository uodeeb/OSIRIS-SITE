# recovery-workflow
# Recovers from errors, failed deploys, broken states, git messes.
# Invoke when: build broken, deploy failed, tests regressed,
# "undo what the AI did", state corruption, merge conflicts.
# Scope: Global

## WHEN TO USE
- Build/deploy failure after AI changes
- "Undo", "rollback", "revert", "it's broken now"
- ERROR-LOG.yaml has unresolved entries
- Agent got stuck in a loop or produced bad output
- Merge conflicts

## SEVERITY ASSESSMENT (first action always)
```yaml
severity:
  critical: "App won't start/build. Production down."
  high: "Feature broken. Tests failing. Deploy failed."  
  medium: "Lint errors. Type errors. Non-blocking issues."
  low: "Style issues. Minor warnings. Cleanup needed."
```

## PROTOCOL BY SEVERITY

### CRITICAL: Nuclear Recovery
```bash
# 1. Stop everything
# 2. MCP-terminal:
git stash                           # Save current mess
git log --oneline -10               # Find last known good
git checkout [last-good-hash] -- .  # Restore files
npm install                         # Reset deps
npm run build                       # Verify recovery
# 3. If build passes:
git commit -m "recovery: revert to [hash] - [reason]"
# 4. Analyze what went wrong from stash
git stash show -p                   # What was the bad change?
```

### HIGH: Targeted Revert
```bash
# 1. Identify bad commit(s):
git log --oneline -5
git diff HEAD~[n] -- [affected files]
# 2. Revert specific commit:
git revert [bad-hash] --no-edit
# 3. Verify:
npm run ci  # lint + test + build
```

### MEDIUM: Fix Forward
1. Read ERROR-LOG.yaml for context
2. Apply minimal fix (invoke debug-workflow if needed)
3. Verify with full CI

### LOW: Queue Fix
1. Add to TODO.yaml with priority:low
2. Continue current task

## POST-RECOVERY (always)
Append to ERROR-LOG.yaml:
```yaml
- timestamp: "[ISO]"
  severity: "[level]"
  trigger: "[what caused it]"
  recovery_action: "[what we did]"
  root_cause: "[why it happened]"
  prevention: "[rule to add to PROJECT-RULES.md to prevent repeat]"
  tokens_spent: [recovery cost]
```

If `prevention` suggests a new rule → append to PROJECT-RULES.md automatically.

## RULES  
- ALWAYS git stash before destructive recovery
- NEVER force-push to shared branches
- If >2 recovery attempts fail → stop, present full context to human
- After recovery → run FULL test suite, not just the failing test
