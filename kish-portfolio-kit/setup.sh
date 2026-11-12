#!/usr/bin/env bash
# Kish portfolio: one-shot project setup (macOS / Linux / WSL / Git Bash)
# Usage:  bash setup.sh [project-name]
set -euo pipefail

NAME="${1:-kish-portfolio}"
KIT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "==> Checking prerequisites"
command -v node >/dev/null || { echo "Node.js 20+ is required: https://nodejs.org"; exit 1; }
command -v git  >/dev/null || { echo "git is required"; exit 1; }
command -v claude >/dev/null || echo "!! Claude Code CLI not found. Install: npm i -g @anthropic-ai/claude-code (the MCP step will be skipped)"

echo "==> 1/6 Scaffolding Next.js (App Router, TypeScript, Tailwind, src/)"
npx --yes create-next-app@latest "$NAME" \
  --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
cd "$NAME"

echo "==> 2/6 Animation + 3D libraries"
npm install gsap @gsap/react lenis three @react-three/fiber
npm install -D @types/three

echo "==> 3/6 shadcn init (needed for React Bits components)"
npx --yes shadcn@latest init -d

echo "==> 4/6 Claude Code skills (installed into this project's .claude/skills)"
npx --yes skills add emilkowalski/skill --agent claude-code -y
npx --yes skills add pbakaus/impeccable --agent claude-code -y
npx --yes skills add leonxlnx/taste-skill --skill design-taste-frontend --agent claude-code -y

echo "==> 5/6 Project files (CLAUDE.md, design spec, content, Playwright MCP, /verify command)"
cp -R "$KIT_DIR/template/." .

echo "==> 6/6 Playwright browser (MCP server is registered by .mcp.json)"
npx --yes playwright install chromium || true

git add -A && git commit -qm "Project setup: Next.js, GSAP, Lenis, R3F, skills, Playwright MCP" || true

cat <<EOF

Done. Next:
  1. Export images from the Design artifact into $NAME/public/assets (see public/assets/README.md)
  2. code $NAME
  3. In the VS Code terminal run: claude
  4. First prompt:  Read CLAUDE.md and design-reference/DESIGN_SPEC.md, then build the Work page hero and run /verify
EOF
