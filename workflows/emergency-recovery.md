name: emergency-recovery
description: "Recover from broken state. Git-safe rollback + diagnosis."
trigger: "undo|rollback|revert|everything is broken|recover"
steps:
  - action: "Load skill: recovery-workflow"
  - action: "Assess severity: critical|high|medium|low"
  - action: "MCP-terminal: git stash (save current state safely)"
  - action: "MCP-terminal: git log --oneline -10 (find good state)"
  - action: "Present recovery options to human"
  - action: "On approval → execute recovery (revert/checkout/fix-forward)"
  - action: "MCP-terminal: npm run ci (verify recovered state)"
  - action: "MCP-filesystem: append ERROR-LOG.yaml with full incident report"
  - action: "If prevention rule identified → append to PROJECT-RULES.md"
