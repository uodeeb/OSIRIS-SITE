name: full-review
description: "Comprehensive code review: quality, perf, a11y, security, docs."
trigger: "review|audit|check code|code review"
steps:
  - action: "Load skills: react-best-practices + vercel-react-best-practices"
  - action: "MCP-filesystem read changed files (git diff)"
  - action: "Check 1: Code quality — patterns, types, error handling"
  - action: "Check 2: Load skill: web-design-guidelines → a11y + UX"
  - action: "Check 3: Performance — bundle size, re-renders, data fetching"
  - action: "Check 4: Security — XSS, injection, auth, env vars"
  - action: "Check 5: Test coverage — are new paths tested?"
  - action: "Compile review as structured report with severity ratings"
  - action: "MCP-filesystem append MEMORY-LOG.yaml with review summary"
