# Cursor Rules for SlackBound

This directory contains Cursor Rules that help AI assistants understand and work with this codebase effectively.

## Rules Overview

### Always Applied
- **project-structure.mdc** - Core architecture and file organization

### Context-Specific Rules
- **slack-bolt-patterns.mdc** - Applies to: `src/bolt/**/*.ts`
- **listener-patterns.mdc** - Applies to: `src/bolt/listeners/**/*.ts`
- **typescript-conventions.mdc** - Applies to: `*.ts`, `*.tsx`
- **nitro-api-routes.mdc** - Applies to: `src/server/**/*.ts`
- **styling-ui.mdc** - Applies to: `*.tsx`, `*.jsx`

### Manual Rules
- **development-workflow.mdc** - Development commands and workflow

## What These Rules Do

These rules help AI assistants:
1. Understand the project structure and architecture
2. Follow consistent patterns when creating new listeners
3. Apply proper TypeScript conventions
4. Work with Nitro's file-based routing
5. Use correct Slack Bolt patterns and types
6. Follow styling guidelines with Tailwind CSS

## Modifying Rules

To modify a rule:
1. Edit the `.mdc` file
2. Frontmatter controls how the rule is applied:
   - `alwaysApply: true` - Applied to every request
   - `globs: *.ts,*.tsx` - Applied to matching files
   - `description: "..."` - Manually triggered by description

## Adding New Rules

Create a new `.mdc` file with appropriate frontmatter:

```markdown
---
globs: src/custom/**/*.ts
---

# Your Rule Title

Your rule content here...
```

