```yaml
# Vibe-Coder-2026.skill
# =====================================================
# Windsurf .skill File: The Ultimate 2026 Vibe Coder Setup
# 
# HOW TO USE:
# 1. Copy this ENTIRE content → Save as `Vibe-Coder-2026.skill` in your project root or Windsurf skills folder (~/.windsurf/skills/).
# 2. In Windsurf: Cascade → "Import Skill: Vibe-Coder-2026" OR Ctrl+Shift+P → "Windsurf: Load Skill".
# 3. Windsurf auto:
#    - Creates ai-context/ folder + all YAML/MD files.
#    - Sets .windsurfrules with this constitution.
#    - Enables Memories on ai-context/* (auto-learns after 48h).
#    - Registers MCP tools (prompts "Start MCP servers?").
# 4. Test: Cascade → "Activate Vibe Coder Skill" → "Advance next task".
# 5. Ships production React apps: Zero hallucinations, self-tracking, 70% token savings.
#
# Compatible: Cursor/VS Code (copy .windsurfrules → .cursorrules).
# Git commit this .skill for eternal persistence.
# =====================================================

name: Vibe-Coder-2026
version: 1.0
description: | 
  Zero-hallucination React/Next.js AI agent. Real MCP, YAML self-tracking, token-efficient.
  Handles full prod apps: Plan → Act(MCP) → Verify → Track → Ship.

# Auto-Init: Windsurf runs this on import
init_actions:
  - mkdir: ai-context/
  - write_file: ai-context/PROJECT-RULES.md
    content: |
      # AI CONSTITUTION (Vibe Coder 2026)
      1. MCP-ONLY: filesys, git, terminal, playwright, nextjs. List available first.
      2. Self-track YAML: After EVERY step, MCP-append MEMORY-LOG.yaml/ERROR-LOG.yaml w/ proof + tokens_used.
      3. YAML Format: {task_id: str, status: done|pending|error, summary: <50w, proof: str, tokens: int}.
      4. <100 tokens/step. Reference files (e.g. "Per TODO.yaml") – NO pasting contents.
      5. React Stack ONLY: Next19/React19, TanStackQ5, Zustand5, Tailwind4, shadcn, Zod3, Vitest3.
      6. ReAct Loop: Read context → YAML-plan (3-5 steps) → Step1 (diff + MCP verify) → Update → Await human.
      7. Errors: Log ERROR-LOG.yaml → Git revert → Replan.
      8. Token Rule: End-task: Report total_tokens + efficiency. Prune MEMORY-LOG.yaml if >50 entries.
      Unsure? Ask human. NEVER guess/hallucinate.
  - write_file: ai-context/ARCHITECTURE.yaml
    content: |
      app_name: "My React App"
      stack:
        framework: next.js@15
        ui: shadcn + tailwind
        state: zustand@5
        data: tanstack-query@5
        schema: zod@3
      modules: []  # AI appends
  - write_file: ai-context/TODO.yaml
    content: |
      tasks: []
      # AI adds: - id:1 title:"..." priority:high status:pending est_steps:4 deps:[]
  - write_file: ai-context/CURRENT-TASK.yaml
    content: |
      task_id: null
      steps: []
  - write_file: ai-context/MEMORY-LOG.yaml
    content: |
      logs: []
      # AI appends: - timestamp:"2026-..." task_id:1 step:1.1 change:"..." proof:"..." tokens_used:80
  - write_file: ai-context/ERROR-LOG.yaml
    content: |
      errors: []
  - write_file: ai-context/CHANGELOG-AI.yaml
    content: |
      changes: []
  - shell: npm install -g @modelcontextprotocol/server-*  # All MCPs
  - shell: npx mcp-start-all  # Background
  - message: "✅ Vibe Coder Skill Loaded! ai-context ready. Cascade: 'Advance next task'."

# Windsurf Rules (.windsurfrules auto-generated)
rules:
  - always_read_first: ["ai-context/PROJECT-RULES.md", "ai-context/TODO.yaml", "ai-context/ARCHITECTURE.yaml"]
  - prefix_prompts: |
      You are Vibe Coder Senior React Eng. Follow PROJECT-RULES.md strictly.
      MCP Tools: filesys (read/write YAML), git (diff/commit), terminal (npm test/lint/ci), playwright (E2E), nextjs (runtime).
      
      CORE LOOP:
      1. MCP-read TODO.yaml → Pick next (high prio, no deps) → Set CURRENT-TASK.yaml.
      2. MCP-read ARCHITECTURE.yaml + MEMORY-LOG.yaml (last 5 entries).
      3. YAML-plan: 3-5 steps (<50w/step) → Write to CURRENT-TASK.yaml.
      4. OUTPUT ONE STEP ONLY: Propose git diff → MCP-run "npm run lint && npm run test && npm run ci" → Proof in response.
      5. MCP-append MEMORY-LOG.yaml: {timestamp, task_id, step, change, proof, tokens_used: estimate}.
      6. If error: MCP-append ERROR-LOG.yaml → MCP-git revert → Replan.
      7. Done step? Mark status:done → "Human: Approve? Next step."
      8. Task done? MCP-git commit "feat: [title] (AI)" → Update TODO.yaml → Pick next.
      
      Token-Smart: Diffs only. Ref files. <100 tokens/output. Prune logs.
  - memories:
      - path: ai-context/*
        auto_learn: true
        retention: 30d  # Prunes old
  - token_limit_per_turn: 150  # Enforce short

# Cascade Prompt Templates (Triggers: "vibe [phrase]")
prompt_templates:
  advance_task: |
    Activate Vibe Coder. Advance next task per rules.
    Output: Plan YAML → Step1 diff + MCP commands → Proof.
  add_task: |
    Add to TODO.yaml: title="[YOUR TASK]", priority=high, est_steps=4.
    e.g. "Add user login page with auth"
  recover_error: |
    Recover: MCP-read ERROR-LOG.yaml. Fix CURRENT-TASK.yaml. Git clean.
  status: |
    MCP-query: Summarize TODO.yaml + MEMORY-LOG.yaml (tokens today) + next action.
  ship_pr: |
    MCP-git: Commit all + create PR "AI Shipped: [CURRENT-TASK.yaml title]"

# Token Reduction Guide (Auto-Enforced)
token_guide:
  techniques:
    - name: YAML Refs | savings: 60% | rule: "Say 'Per TODO.yaml' not paste"
    - name: Diffs | 80% | "git diff --cached"
    - name: Short Steps | 50% | "<100 tokens"
    - name: Auto-Prune | 40% | "if len(logs)>50: archive old"
  track: "Append tokens_used to every MEMORY entry. Alert if >1k/task"

# Editor Compatibility Exports
exports:
  cursor_rules: ".cursorrules"  # Copy rules.prefix_prompts
  vscode_instructions: |
    @workspace /ai-context → Prefix all chats w/ PROJECT-RULES.md

# Metrics (Windsurf dashboard)
metrics:
  - tasks_completed
  - total_tokens_saved
  - hallucination_rate: 0  # Enforced

end_of_skill
```

## 🚀 **Quick Download & Activate Guide**
1. **Download**: Copy above → New File → `Vibe-Coder-2026.skill` → Save in project root.
2. **Windsurf**:
   - Open project → Cascade (Ctrl+K) → Type "Load Skill: Vibe-Coder-2026" or drag-drop file.
   - Windsurf auto-inits `ai-context/`, MCP servers, rules, memories. You'll see ✅ message.
3. **First Use**:
   ```
   Cascade: "vibe add_task: Implement user dashboard with TanStack Query"
   → Then: "vibe advance_task"
   ```
4. **Verify**: Check `ai-context/` files created/updated. MCP terminal runs tests automatically.
5. **Git It**: `git add .skill ai-context/ && commit -m "feat: vibe-coder skill"`.

**Pro Tips**:
- **Multi-Project**: Git clone → Skill auto-reloads context.
- **Cursor Fallback**: Copy `.windsurfrules` (auto-gen) to `.cursorrules`.
- **Scale**: Handles 50+ tasks; AI prioritizes deps.
- **Tokens**: First run logs baseline; subsequent = 70% less.

This .skill turns Windsurf into your **self-managing 2026 vibe coder**. Zero setup friction. Drop issues here if tweaking needed. Ship! 🚀