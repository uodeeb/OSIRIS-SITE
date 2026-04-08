# task-tracker
# Manages the full task lifecycle via ai-context/ YAML files.
# Invoke when: creating tasks, checking status, prioritizing, 
# updating progress, or any "what should I work on" question.
# Scope: Global

## WHEN TO USE
- User says: "add task", "what's next", "status", "prioritize", "update task"
- Start of any coding session (read TODO.yaml first)
- After completing any step (update MEMORY-LOG.yaml)

## TASK LIFECYCLE
```
CREATE → PLAN → IN_PROGRESS → VERIFY → DONE → LOGGED
                    ↓ (fail)
                  ERROR → DIAGNOSE → REPLAN → IN_PROGRESS
```

## FILE OPERATIONS (via filesystem MCP)

### Create Task
Append to `ai-context/TODO.yaml`:
```yaml
- id: [auto-increment]
  title: "[from user request]"
  priority: [critical|high|medium|low]
  status: pending
  created: "[ISO timestamp]"
  est_steps: [3-7]
  deps: []  # other task IDs
  tags: [feature|bugfix|refactor|docs|test]
```

### Start Task
1. Read TODO.yaml → find highest priority with status:pending and no unmet deps
2. Write to `ai-context/CURRENT-TASK.yaml`:
```yaml
task_id: [id]
title: "[title]"
started: "[timestamp]"
status: in_progress
plan:
  - step: 1
    action: "[specific action]"
    status: pending
    est_tokens: [number]
  - step: 2
    action: "..."
    status: pending
```
3. Update TODO.yaml entry status → in_progress

### Complete Step
Append to `ai-context/MEMORY-LOG.yaml`:
```yaml
- timestamp: "[ISO]"
  task_id: [id]
  step: [n]
  action: "[what was done]"
  result: "[outcome]"  
  proof: "[lint:0 errors, tests:14 pass, build:ok]"
  files_changed: ["src/...", "..."]
  tokens_est: [number]
```
Update CURRENT-TASK.yaml step status → done

### Complete Task
1. Mark all steps done in CURRENT-TASK.yaml
2. Update TODO.yaml status → done, add `completed: [timestamp]`
3. Append to `ai-context/CHANGELOG-AI.yaml`:
```yaml
- date: "[ISO]"
  task_id: [id]
  title: "[title]"
  summary: "[<50 words what changed and why]"
  files: ["list of changed files"]
  tests_added: [count]
```
4. Git commit: `git add ai-context/ && git commit -m "ctx: task [id] done - [title]"`
5. Read TODO.yaml → announce next priority task

### Status Report
When asked for status, compile from YAML files:
```
ACTIVE: [task title] - Step [n/total] - [status]
QUEUE:  [count] pending ([count] high priority)
DONE TODAY: [count] tasks, ~[tokens] tokens used
BLOCKERS: [any error-log entries from today]
NEXT UP: [highest priority pending task]
```

## RULES
- Never create duplicate task IDs
- Never skip updating MEMORY-LOG after a step
- If TODO.yaml has >20 pending tasks → suggest pruning/grouping to human
- Auto-assign priority:critical to any task with "bug", "broken", "crash" in title
