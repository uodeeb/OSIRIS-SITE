name: ship-pr
description: "Full shipping pipeline: test → commit → PR → deploy → verify."
trigger: "ship|create pr|deploy|release|push"
steps:
  - action: "Load skill: ship-workflow"
  - action: "Phase 1: Pre-flight — MCP-terminal full CI"
  - action: "If fail → auto-invoke workflow: debug-and-fix → restart"
  - action: "Phase 2: Doc check — load skill: doc-generator if needed"
  - action: "Phase 3: Git prep — MCP-terminal git add + commit"
  - action: "Phase 4: PR — MCP-GitHub create PR with template"
  - action: "Phase 5: Deploy — MCP-netlify deploy preview"
  - action: "Phase 6: Verify — MCP-playwright screenshot preview"
  - action: "Phase 7: Post-ship — update all ai-context/ files"
  - action: "Present: PR URL + Preview URL + Screenshot → human approves merge"
