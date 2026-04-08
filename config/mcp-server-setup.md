# MCP Server Configuration for Windsurf
# Follow this guide to optimize your 20 MCP servers

## MCP SERVER USAGE MAP

```
┌─────────────────────────────────────────────────────────────┐
│                MCP SERVER USAGE MAP                          │
│                                                             │
│  WORKFLOW          → SERVERS USED (in order)                │
│  ─────────────────────────────────────────────              │
│  daily-standup     → filesystem, memory                     │
│  advance-task      → filesystem, sequential-thinking,       │
│                      terminal, coding-agent                 │
│  debug-and-fix     → filesystem, terminal, sequential-      │
│                      thinking, playwright, Context7         │
│  ship-pr           → terminal, GitHub, netlify,             │
│                      playwright, filesystem                 │
│  research-decide   → Context7, firecrawl, sequential-       │
│                      thinking, memory, filesystem           │
│  full-review       → filesystem, terminal, playwright       │
│  emergency-recover → terminal (git), filesystem             │
│                                                             │
│  RARELY USED (enable for specific needs):                   │
│  • deepview        → Complex arch analysis                  │
│  • desktop-cmdr    → System-level operations                │
│  • Puppeteer       → When playwright insufficient           │
│  • mcpadvisor      → Finding new MCP servers                │
│  • prisma          → Only during DB work                    │
│                                                             │
│  KEEP DISABLED (conflicts or redundant):                    │
│  • git-memory      → Replaced by memory + filesystem YAML  │
│  • hpkv-memory     → Replaced by memory server             │
│  • mult-fetch      → Replaced by firecrawl + Context7      │
└─────────────────────────────────────────────────────────────┘
```

## SERVER CONFIGURATION STEPS

### Tier 1: Always Available (Enable These)
- ✅ **filesystem** - Read/write ai-context/ YAML, any project file
- ✅ **GitHub** - Issues, PRs, repo queries, code search  
- ✅ **sequential-thinking** - Complex planning, multi-step reasoning chains
- ✅ **memory** - Store/retrieve cross-session knowledge entities
- ✅ **coding-agent** - Delegate sub-tasks, parallel code generation

### Tier 2: Task-Triggered (Enable These)
- ✅ **playwright** - E2E tests, visual regression, browser automation
- ✅ **Puppeteer** - Scraping, screenshots, PDF generation
- ✅ **netlify** - Deploy previews, production deploys
- ✅ **prisma-mcp-server** - Database schema, migrations, queries
- ✅ **desktop-commander** - System commands, file operations outside project

### Tier 3: On-Demand Research (Enable These)
- ✅ **Context7** - Look up library docs, API references, latest versions
- ✅ **firecrawl-mcp** - Crawl external docs, scrape reference sites
- ✅ **mcpadvisor** - Find new MCP servers for emerging needs
- ✅ **deepview** - Deep code analysis (enable first)

### Tier 4: Disable These (Redundant/Conflicting)
- ❌ **hpkv-memory-server** - Replaced by memory server
- ❌ **git-memory** - Replaced by memory + filesystem YAML
- ❌ **mult-fetch-mcp-server** - Replaced by firecrawl + Context7

## ENVIRONMENT VARIABLES SETUP

Update your MCP config to reference env vars (Windsurf reads process env):

```jsonc
// In Windsurf MCP settings — replace hardcoded keys:
"env": {
  "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}",
  "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}",
  "GEMINI_API_KEY": "${GEMINI_API_KEY}",
  "NETLIFY_PERSONAL_ACCESS_TOKEN": "${NETLIFY_PERSONAL_ACCESS_TOKEN}"
}
```

## VERIFICATION

After configuration, test with:
- Cascade → "list available MCP tools"
- Should see: filesystem, GitHub, playwright, sequential-thinking, memory, coding-agent, netlify, prisma, Context7, firecrawl
- Should NOT see: git-memory, hpkv-memory, mult-fetch

## SERVER-SPECIFIC NOTES

### Context7
- Use for official docs lookup
- Better than firecrawl for structured API docs
- First choice for version-specific information

### firecrawl-mcp  
- Use when Context7 insufficient
- Crawl entire docs sites
- Good for community tutorials/examples

### deepview
- Enable only when doing complex architecture analysis
- Resource intensive - disable when not needed
- Use for understanding large codebases

### playwright
- Primary E2E testing tool
- Use for visual regression testing
- Better than Puppeteer for modern web apps

### coding-agent
- Use for parallel code generation
- Good for splitting large tasks
- Can delegate to other AI instances
