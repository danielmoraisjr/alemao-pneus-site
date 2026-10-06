#!/bin/bash
set -euo pipefail

# Only run in Claude Code on the web
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Installs ui-ux-pro-max-cli at the version pinned in package-lock.json
npm install --no-audit --no-fund

# .claude/skills is git-ignored: regenerate it when missing
if [ ! -f .claude/skills/ui-ux-pro-max/SKILL.md ]; then
  npx --no-install uipro init --ai claude --force
fi
