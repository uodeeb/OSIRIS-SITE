# doc-generator  
# Auto-generates and maintains project documentation from code + ai-context/.
# Invoke when: user asks to document, after major features, before PRs,
# or when CHANGELOG/README needs updating.
# Scope: Global

## WHEN TO USE
- "Document this", "update README", "write API docs"
- After completing a major task (auto-suggest)
- Before shipping a PR
- When ai-context/CHANGELOG-AI.yaml has >5 undocumented entries

## DOCUMENT TYPES

### 1. Component Documentation
For each React component, generate in JSDoc above the component:
```typescript
/**
 * ComponentName — [one-line purpose]
 * 
 * @props {Type} propName - description
 * @state uses [Zustand store] for [what]
 * @data fetches [endpoint] via TanStack Query
 * @example <ComponentName prop="value" />
 * 
 * @ai-context Created task#[id], step#[n]. See MEMORY-LOG [date].
 */
```

### 2. Architecture Decision Records (ADR)
Append to `ai-context/ARCHITECTURE.yaml`:
```yaml
decisions:
  - id: ADR-[n]
    date: "[ISO]"
    title: "[decision title]"
    context: "[why this came up - <30 words]"
    decision: "[what we chose - <30 words]"
    alternatives: ["what we rejected"]
    consequences: ["tradeoffs accepted"]
```

### 3. README Sync
When asked, regenerate sections of README.md from:
- ARCHITECTURE.yaml → Tech stack + structure
- TODO.yaml → Current status / roadmap
- CHANGELOG-AI.yaml → Recent changes

### 4. API Documentation
For API routes (Next.js), generate:
```markdown
## [METHOD] /api/[route]
- **Purpose**: [one line]
- **Auth**: [required/public]
- **Request**: `{ field: type }` (Zod schema ref)
- **Response**: `{ field: type }`
- **Errors**: [status codes + meanings]
```

### 5. Changelog Compilation
Compile `ai-context/CHANGELOG-AI.yaml` into human-readable `CHANGELOG.md`:
```markdown
## [date] - v[x.y.z]
### Added
- [feature from changelog entries]
### Fixed  
- [bugfix from error-log entries]
### Changed
- [refactor entries]
```

## RULES
- Keep docs DRY: reference ai-context/ files, don't duplicate
- Match existing doc style in the project
- Never document internal/private implementation details in public docs
- Auto-suggest doc updates when CHANGELOG has >5 new entries
