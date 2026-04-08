name: research-and-decide
description: "Research a library, pattern, or approach before committing to it."
trigger: "research|how should we|what's the best|evaluate|compare"
steps:
  - action: "Load skill: research-workflow"
  - action: "Step 1: MCP-filesystem check ARCHITECTURE.yaml + MEMORY-LOG"
  - action: "Step 2: MCP-Context7 query official docs"
  - action: "Step 3: MCP-sequential-thinking evaluate options"
  - action: "Step 4: Present options table to human"
  - action: "Step 5: On approval → MCP-filesystem append ARCHITECTURE.yaml ADR"
  - action: "Step 6: MCP-memory store research for future sessions"
