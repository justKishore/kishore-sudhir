# Kishore Sudhir: portfolio site

Personal portfolio for Kish (Kishore Sudhir), Data Scientist and AI Engineer in Melbourne. Two views, **Work** and **About**, plus a shared Contact footer. The approved design lives in `design-reference/DESIGN_SPEC.md`. That spec is the source of truth: build it faithfully, do not redesign it.

## Build approach (updated 2026-11-13, overrides the Stack/Scroll/Content notes below)

`kish-portfolio-kit/BUILD.md` is the current brief. The site is a faithful port of the mockup (`design-reference/mock-website/mockup-source.html` is the extracted readable source): plain CSS from `design-reference/tokens.css` in `src/app/globals.css`, and ONE `requestAnimationFrame` loop in `src/components/motion/useScene.ts` running the mockup's own maths. No GSAP, Lenis or R3F in use (still installed, unused). Copy lives in `src/content/content.json` (a copy of `design-reference/content.json`), read through `src/content/site.ts`.

## Stack

- Next.js (App Router) + React 19 + TypeScript, `src/` layout, Tailwind v4
- **GSAP** + `@gsap/react` (`useGSAP`) + **ScrollTrigger** for every scroll-driven effect
- **Lenis** for smooth scroll, synced to ScrollTrigger (see "Scroll setup")
- **three** + **@react-three/fiber** (v9, pairs with React 19): available, use only where real 3D earns its weight (candidate: Skills orbit). Always lazy-load with `next/dynamic({ ssr: false })`
- **React Bits**: copy-in components via shadcn CLI, e.g. `npx shadcn@latest add @react-bits/BlurText-TS-TW`. Use TS-TW variants. Only pull one in when it matches a spec'd effect; restyle it to the tokens
- **Shader gradient**: NOT installed. The design uses a photo hero and CSS gradients. Only add `@shadergradient/react three-stdlib camera-controls` if Kish asks for an animated gradient background
- Fonts via `next/font/google`: Playfair Display (400/500, italic), Geist (300 to 600), Geist Mono (400/500)

## Content

All copy, projects, skills and interests live in `src/content/site.ts`. Components read from there; never hard-code copy in JSX. Anything marked `[Placeholder: ...]` stays visible as-is until Kish supplies text. Do not invent metrics, employers, or outcomes.

## Writing rules for any copy you touch

- No em dashes. Plain, direct, human sentences.
- Only claims Kish can defend in an interview. The headline metric is: quoting went from 6 to 7 weeks to same day.

## Project structure (target)

```
src/
  app/            layout.tsx (fonts, Lenis provider), page.tsx (Work/About tab state via #hash)
  components/
    layout/       Header (pill nav), Footer/Contact, TabWipe
    work/         Hero, Marquee, Statement, StatStrike, ProjectStack
    about/        AboutHero, Bio, GradientBoosting, SkillsOrbit, InterestsHorizontal
    motion/       SmoothScroll (Lenis), useReducedMotion, reveal helpers
  content/site.ts
  lib/gradientBoosting.ts   (pure function, ported from the spec)
public/assets/    hero + project images
```

## Scroll setup (do this once, in a client `SmoothScroll` provider)

- Lenis drives scroll; `lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add(t => lenis.raf(t * 1000))`; `gsap.ticker.lagSmoothing(0)`
- If `prefers-reduced-motion: reduce`, do not start Lenis and put every effect in its end state
- Register plugins once: `gsap.registerPlugin(ScrollTrigger, useGSAP)`
- Animate only `transform` and `opacity`. No layout properties in scroll handlers
- Clean up all triggers on tab switch (useGSAP scope handles this)

## Motion rules

- Every effect in DESIGN_SPEC "Motion" has a reduced-motion end state and a mobile behaviour. Implement both
- Breakpoints from the spec: 768 (horizontal interests), 820 (card stack, gradient boosting tap mode)
- Use `will-change` only on elements that animate continuously
- Touch targets >= 44px

## Skills installed in this project

- Emil Kowalski's skill (emilkowalski/skill): motion and interaction polish (easing, timing, micro-interactions)
- `impeccable`: design audit/polish commands (`/audit`, `/polish`, `/critique`, `/animate`)
- `design-taste-frontend` (taste-skill): anti-generic design judgment

**Precedence when they disagree:** DESIGN_SPEC.md > this file > skills. The skills sharpen execution; they must not change the palette, type, layout or section order. If a skill suggests a structural change, list it as a suggestion for Kish instead of applying it.

## Verification loop (Playwright MCP)

After each section is built, run `/verify` (see `.claude/commands/verify.md`). Never report a section as done without screenshots at 375, 768, 1280 and 1920 plus one with reduced motion emulated, and zero console errors.

## Commands

- `npm run dev` (http://localhost:3000)
- `npm run build && npm run start` before calling anything finished
- `npm run lint`
