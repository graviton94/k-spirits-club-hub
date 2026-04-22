# Repomix Knowledge Base

## Core Command
```bash
npx repomix@latest --compress
```

## Key Capabilities for K-Spirits
- **Context Packing**: Merge entire project into one file (`repomix-output.xml`).
- **Tree-sitter Compression**: Use `--compress` to keep signatures but skip bodies. Essential for large Next.js apps.
- **Git Awareness**: Automatically respects `.gitignore` and `.repomixignore`.
- **Token Counting**: Reports tokens for GPT-4o, Claude 3.5, etc.

## Recommended `.repomixignore`
```
ai_improvement_machine/knowledge/
graphify-out/
.gemini/
.next/
node_modules/
dist/
*.log
```

## Advanced Usage
- **Pipe via Stdin**: `git ls-files "app/**/*.ts" | repomix --stdin` -> Focused context bundling.
- **Skill Generation**: `repomix --skill-generate k-spirits` -> Creates `.claude/skills/k-spirits/` for Antigravity-ready knowledge.
