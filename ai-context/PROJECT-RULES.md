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
