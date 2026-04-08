name: daily-standup
description: "Start-of-session context load + status + plan. Run this first every day."
trigger: "standup|start session|good morning|what's the status"
steps:
  - action: "MCP-filesystem read ai-context/TODO.yaml"
    output: "task_queue"
  - action: "MCP-filesystem read ai-context/MEMORY-LOG.yaml (last 10)"
    output: "recent_history"  
  - action: "MCP-filesystem read ai-context/ERROR-LOG.yaml (unresolved)"
    output: "open_errors"
  - action: "MCP-memory recall project-summary"
    output: "project_context"
  - action: "Compile status report"
    template: |
      ## 📋 Daily Standup
      
      **Project**: {project_context.app_name}
      **Session Start**: {timestamp}
      
      ### Yesterday's Progress
      {recent_history — last session entries}
      
      ### Open Errors/Blockers
      {open_errors or "None ✅"}
      
      ### Today's Queue (by priority)
      {task_queue — pending tasks sorted by priority}
      
      ### Recommended First Action
      {highest priority pending task with no deps}
      
      **Ready?** Say "advance" to start top task.
