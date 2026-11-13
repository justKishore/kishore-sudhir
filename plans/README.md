# Animation plans

Written by `improve-animations` on 2026-11-13 against commit `4ea97c9` (plus uncommitted header/nav work).
Each plan is self-contained; run them with any agent, or `improve-animations execute <plan>`.

| # | Plan | Severity | Status |
|---|---|---|---|
| 001 | [Contact hover via transform + hover gating](001-contact-hover-transform-and-hover-gating.md) | MEDIUM | DONE |
| 002 | [Card stack: batch reads before writes](002-card-stack-batch-reads-before-writes.md) | MEDIUM | DONE |
| 003 | [Backdrop blur on moving glass (measure first)](003-backdrop-blur-on-moving-glass.md) | MEDIUM | DONE |
| 004 | [Press feedback on CTA, pill nav, Next round](004-press-feedback.md) | LOW | DONE |

## Execution order

1. **001**: the only issue a visitor would notice (stuck hovers on phones), and it touches the rules 004 builds on.
2. **002**: independent; one block in `useScene.ts`.
3. **003**: needs a production build and a performance recording; may end with "no change needed".
4. **004**: after 001 (same `.cta` and `.pill-nav button` rules).

## Dependencies

- 004 depends on 001.
- 002 and 003 are independent of everything.

## Not planned (from the audit, lower leverage)

- Move pulse, scroll cue and drift blobs from the rAF loop to CSS `@keyframes`; cache marquee `scrollWidth` (`useScene.ts:227, 234-245`).
- Make the mobile "Next round" easing time-based instead of per-frame (`useScene.ts:287`).
- Set constant chip opacity, z-index and `data-far` once instead of every frame (`useScene.ts:270-272`).
- Use `var(--ease-reveal)` / `var(--ease-wipe)` in the JS transition strings (`useScene.ts:149`, `Site.tsx:67`).
- Tab wipe and hero reveal durations are set by DESIGN_SPEC, so they're intentionally not flagged.
