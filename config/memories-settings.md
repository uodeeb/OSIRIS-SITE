# Windsurf Memories Configuration
# Add these settings to Windsurf → Memories panel → Settings

## Memory Settings to Configure

```yaml
# Windsurf Memories Configuration
auto_index_paths:
  - "ai-context/*"              # All brain files
  - ".windsurfrules"            # Rules
  - "src/**/*.tsx"              # Components (structure, not content)
  - "package.json"              # Dependencies
  - "tsconfig.json"             # TS config

auto_learn: true
learning_sources:
  - ai-context/MEMORY-LOG.yaml   # Task history
  - ai-context/ARCHITECTURE.yaml # Decisions
  - ai-context/ERROR-LOG.yaml    # Mistakes to avoid
  
retention_policy:
  MEMORY-LOG: "60 days, then archive entries to MEMORY-ARCHIVE.yaml"
  ERROR-LOG: "90 days (lessons learned persist longer)"
  TODO: "Forever (completed tasks = project history)"

cross_session_behavior:
  on_new_session: "Read TODO.yaml + last 10 MEMORY-LOG entries + unresolved ERROR-LOG"
  on_context_loss: "MCP-memory recall project-summary entity"
```

## MCP Memory Integration

At project start, store in MCP-memory server:

```
Entity: "project-[name]-summary"
Content: {
  name, stack, key_patterns, current_phase, 
  known_pitfalls (from ERROR-LOG), 
  architecture_decisions (from ARCHITECTURE.yaml)
}
```

Update this entity weekly or after major changes.
This survives even if ai-context/ files aren't loaded.

## Instructions for Windsurf UI

1. Open Windsurf → Memories panel
2. Click Settings/Configuration
3. Add the above auto_index_paths
4. Enable auto_learn: true
5. Set retention_policy as specified
6. Configure cross_session_behavior
7. Save settings
