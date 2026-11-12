# Kish portfolio: Claude Code starter kit

## Before you run it
- Node.js 20+ and git installed
- Claude Code installed (`npm i -g @anthropic-ai/claude-code`) and the Claude Code extension in VS Code

## Run
Unzip, open a terminal in the unzipped folder, then:

- macOS / Linux / WSL: `bash setup.sh kish-portfolio`
- Windows PowerShell: `powershell -ExecutionPolicy Bypass -File setup.ps1 kish-portfolio`

The project is created next to the kit folder's current directory.

## What it sets up
| Step | What |
|---|---|
| Scaffold | Next.js App Router, TypeScript, Tailwind, `src/` |
| Libraries | gsap, @gsap/react, lenis, three, @react-three/fiber, @types/three |
| React Bits | shadcn initialised so you can `npx shadcn@latest add @react-bits/<Name>-TS-TW` |
| Skills (project-level, `.claude/skills`) | emilkowalski/skill, pbakaus/impeccable, taste-skill (`design-taste-frontend` only) |
| MCP | Playwright via `.mcp.json` (approve it the first time Claude Code asks) |
| Project files | `CLAUDE.md`, `design-reference/DESIGN_SPEC.md`, `src/content/site.ts`, `/verify` command, `next.config.ts` |

## After setup
1. Put the six images into `public/assets` (list in that folder's README).
2. `code kish-portfolio`, open the terminal, run `claude`.
3. Check everything loaded: `/mcp` should show playwright; typing `/` should list impeccable commands.
4. Build section by section. Suggested order:
   1. `Read CLAUDE.md and design-reference/DESIGN_SPEC.md. Set up fonts, tokens, the Lenis + ScrollTrigger provider and the header with tab wipe. Then /verify`
   2. `Build the Work hero and marquee. /verify`
   3. `Build the statement, stat strike and project card stack. /verify`
   4. `Build the About view: hero, bio, gradient boosting, skills orbit, interests. /verify`
   5. `Build contact + footer. Then /audit and /polish the whole site, keeping DESIGN_SPEC as the rule.`

## Notes
- Shader gradient is deliberately left out: the design uses the Melbourne dusk photo and CSS gradients, so it would add ~300 KB of three.js for nothing visible. If you later want an animated gradient: `npm i @shadergradient/react three-stdlib camera-controls`.
- Only one taste-skill variant is installed on purpose. The repo ships 13, and some (minimalist-ui: "no gradients", brutalist) contradict this design.
- Install Impeccable via the plugin instead if you prefer: inside Claude Code run `/plugin marketplace add pbakaus/impeccable`, then install it from `/plugin`. Don't do both.
