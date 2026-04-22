# OpenHarness Knowledge Base

## Core Command
```bash
oh # Launch OpenHarness (openh on Windows)
ohmo init # Launch Personal Agent ohmo
```

## Key Capabilities for K-Spirits
- **Agent Governance**: Define precise `permission_mode` (Plan vs Auto) for different project phases.
- **Skill Loading**: Dynamic loading of `.md` skills to extend my (Antigravity's) capability.
- **Persistent Memory**: Uses `MEMORY.md` and `SESSION_LOG.md` to persist state across sessions.
- **Dry Run**: `oh --dry-run -p "Fix the bug"` -> Previews the plan and tool usage without execution.

## Architectural Best Practice
- **Soul.md**: Define the "Personality" and "Core Directive" of the project agent.
- **Task Lifecycle**: Use background tasks for long-running processes (e.g., news collection, graph rebuild).
- **Subagent Coordination**: Delegate sub-tasks to specialized transient "Team members".
