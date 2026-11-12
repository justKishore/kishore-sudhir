# Kish portfolio: one-shot project setup (Windows PowerShell)
# Usage:  powershell -ExecutionPolicy Bypass -File setup.ps1 [project-name]
param([string]$Name = "kish-portfolio")
$ErrorActionPreference = "Stop"
$KitDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "==> Checking prerequisites"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw "Node.js 20+ is required: https://nodejs.org" }
if (-not (Get-Command git  -ErrorAction SilentlyContinue)) { throw "git is required" }
$hasClaude = [bool](Get-Command claude -ErrorAction SilentlyContinue)
if (-not $hasClaude) { Write-Warning "Claude Code CLI not found. Install: npm i -g @anthropic-ai/claude-code (MCP step skipped)" }

Write-Host "==> 1/6 Scaffolding Next.js"
npx --yes create-next-app@latest $Name --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
Set-Location $Name

Write-Host "==> 2/6 Animation + 3D libraries"
npm install gsap @gsap/react lenis three @react-three/fiber
npm install -D @types/three

Write-Host "==> 3/6 shadcn init (for React Bits)"
npx --yes shadcn@latest init -d

Write-Host "==> 4/6 Claude Code skills"
npx --yes skills add emilkowalski/skill --agent claude-code -y
npx --yes skills add pbakaus/impeccable --agent claude-code -y
npx --yes skills add leonxlnx/taste-skill --skill design-taste-frontend --agent claude-code -y

Write-Host "==> 5/6 Project files"
Copy-Item -Path (Join-Path $KitDir "template\*") -Destination . -Recurse -Force
Copy-Item -Path (Join-Path $KitDir "template\.claude") -Destination . -Recurse -Force
Copy-Item -Path (Join-Path $KitDir "template\.mcp.json") -Destination . -Force

Write-Host "==> 6/6 Playwright browser (MCP server is registered by .mcp.json)"
try { npx --yes playwright install chromium } catch {}

git add -A; git commit -qm "Project setup: Next.js, GSAP, Lenis, R3F, skills, Playwright MCP"

Write-Host ""
Write-Host "Done. Next:"
Write-Host "  1. Export images from the Design artifact into $Name\public\assets"
Write-Host "  2. code $Name"
Write-Host "  3. In the VS Code terminal run: claude"
Write-Host "  4. First prompt: Read CLAUDE.md and design-reference/DESIGN_SPEC.md, then build the Work page hero and run /verify"
