# research-workflow
# Structured research before coding: Docs → Patterns → Decisions → Plan.
# Invoke when: unfamiliar library, new pattern, "how should we...",
# version upgrade, or any uncertainty about approach.
# Scope: Global

## WHEN TO USE
- Before using any library/API not in ARCHITECTURE.yaml
- "How should we implement [X]?"
- "What's the best pattern for [Y]?"
- Version compatibility questions
- Any claim about a dependency that may have changed

## PROTOCOL

### Step 1: Check Internal Context First
1. MCP-filesystem: Read ARCHITECTURE.yaml → is this already decided?
2. MCP-filesystem: Read MEMORY-LOG.yaml → have we solved this before?
3. MCP-memory: Query knowledge graph → any stored research?

### Step 2: Check Official Docs (MCP)
1. MCP-Context7: Query library documentation
   - Get latest version, API surface, breaking changes
   - Get recommended patterns from official docs
2. If Context7 insufficient → MCP-firecrawl: Crawl official docs site

### Step 3: Evaluate Options
Use MCP-sequential-thinking to reason through:
```yaml
research:
  question: "[what we need to decide]"
  options:
    - name: "[Option A]"
      pros: ["..."]
      cons: ["..."]
      fits_stack: [true/false]
    - name: "[Option B]"
      pros: ["..."]  
      cons: ["..."]
      fits_stack: [true/false]
  recommendation: "[which and why - <30 words]"
  confidence: [high|medium|low]
```

### Step 4: Document Decision
Append to ARCHITECTURE.yaml decisions (ADR format).
If low confidence → present options to human, don't decide.

### Step 5: Plan Implementation
Create steps in CURRENT-TASK.yaml based on research.

## MCP PRIORITY FOR RESEARCH
1. Context7 (structured docs) → first choice
2. firecrawl-mcp (web crawl) → if docs site needed  
3. mcpadvisor (find tools) → if we need a new MCP server
4. deepview (deep analysis) → complex architectural research

## RULES
- NEVER use training knowledge alone for version-specific info
- NEVER add a dependency without researching alternatives first
- If research takes >5 min equivalent → summarize findings, ask human to decide
- Cache research results in MCP-memory for future sessions
