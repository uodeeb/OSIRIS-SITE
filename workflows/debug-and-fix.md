name: debug-and-fix  
description: "Structured debugging with full documentation. Never guess."
trigger: "debug|fix bug|broken|error|failing test|crash"
steps:
  - action: "Load skill: debug-workflow"
  - action: "Phase 1: Reproduce — MCP-terminal run failing command"
  - action: "Phase 2: Isolate — MCP-filesystem read source + MCP-sequential-thinking"
  - action: "Phase 3: Root cause — state in one sentence"
  - action: "Present diagnosis to human → wait approval"
  - action: "Phase 4: Fix — output minimal diff"
  - action: "Phase 5: Verify — MCP-terminal full CI"
  - action: "Phase 6: Document — MCP-filesystem append ERROR-LOG.yaml"
  - action: "Load skill: task-tracker → log step"
