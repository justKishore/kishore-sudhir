# 003 — Check, and if needed drop, the backdrop blur on moving glass panels

- **Status**: DONE (2026-11-13). `.interest` blur removed: unthrottled scroll through Interests went from 50-67ms median frames (87-100% over budget) with blur to 16.7ms without. `.status` kept: hero measurement was blocked by browser occlusion throttling, so no evidence to change it.
- **Commit**: 4ea97c9 (plus uncommitted work; line numbers are from the working tree)
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file, 2 lines (only if the measurement says so)

## Problem

Until 2026-11-13 every rule in `src/app/globals.css` listed `backdrop-filter` before `-webkit-backdrop-filter`. The CSS minifier treats them as one property and keeps the last one, so only the `-webkit-` version shipped, and current Chrome ignores it. The order was fixed that day, so these blurs now actually render for the first time:

```css
/* src/app/globals.css:422-426 — Interests cards */
.interest {
  min-height: clamp(240px, 38vh, 380px); padding: clamp(22px, 2.6vw, 36px); border-radius: var(--radius-card);
  background: rgba(238, 244, 237, 0.07); border: 1px solid rgba(238, 244, 237, 0.2);
  -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px); box-shadow: 0 24px 60px rgba(11, 37, 69, 0.4);
  ...
}

/* src/app/globals.css:203-208 — hero status card */
.status {
  max-width: 440px; padding: 18px 22px; border-radius: 20px;
  background: var(--glass-bg); border: 1px solid var(--glass-border);
  -webkit-backdrop-filter: blur(18px) saturate(1.2); backdrop-filter: blur(18px) saturate(1.2);
  box-shadow: 0 20px 50px rgba(11, 37, 69, 0.35);
}
```

Why it might cost frames:
- `.interest` cards sit on `.hz-track`, which `useScene.ts` translates on every scrolled frame. Behind them, two large radial-gradient `.drift` blobs move on **every** frame. So the browser re-blurs a 20px region under every visible card, every frame, for the whole 300vh Interests section.
- `.status` sits over the hero photo, which is scaled (first 2.8s) and parallaxed on scroll.

The backdrop behind `.interest` is soft gradients only, so a 20px blur adds little that you can see. Whether this drops frames can't be judged from code. **Measure before changing.**

## Target

Decision rule:
- If the Interests section holds 60fps on the test machine (see Verification), change nothing and mark this plan DONE (no change needed).
- If it drops frames: remove the backdrop blur from `.interest` only, and raise its fill slightly so it still reads as glass:
  ```css
  /* target, only if frames drop */
  .interest {
    ...
    background: rgba(238, 244, 237, 0.09); border: 1px solid rgba(238, 244, 237, 0.2);
    box-shadow: 0 24px 60px rgba(11, 37, 69, 0.4);
    ...
  }
  ```
- `.status` is a single small card. Keep its blur unless the hero alone drops frames, in which case reduce it to `blur(12px) saturate(1.2)` (both prefixed and standard, standard last).

## Repo conventions to follow

- When a `backdrop-filter` stays, write `-webkit-backdrop-filter` FIRST and `backdrop-filter` LAST on the same rule. The minifier keeps only the last one. Exemplar: `src/app/globals.css:146-147` (`.pill-nav`).

## Steps

1. `npm run build && npm run start`. Measure on the production build, not dev.
2. Chrome DevTools > Performance, CPU throttling **4x slowdown**, viewport 1280x800, About tab. Record while scrolling steadily through "Areas of interest" for ~4 seconds.
3. Read the Frames track. If more than ~5% of frames are dropped or partially presented, apply the `.interest` change from **Target** at `src/app/globals.css:424-425`. Remove both the `-webkit-backdrop-filter` and the `backdrop-filter` declarations, and change the background alpha from `0.07` to `0.09`.
4. Repeat the recording. Note before and after dropped-frame counts in the plan's Status line.
5. Repeat steps 2-3 for the Work hero (scroll the first 100vh). Only touch `.status` if the hero drops frames.

## Boundaries

- Do NOT touch `.pill-nav` (header) blur. It's small and was explicitly requested.
- Do NOT change `useScene.ts`, the drift blobs, or the track motion.
- Do NOT change any colour other than the `.interest` background alpha.

## Verification

- **Mechanical**: `npm run lint` and `npm run build` pass.
- **Feel check**:
  - Side-by-side screenshots of an interest card before and after, at 1280px. It must still read as a translucent glass card with a visible border and shadow.
  - Scrolling through Interests feels as smooth as scrolling through plain text sections.
- **Done when**: the plan records the dropped-frame numbers, and either no change was needed or the `.interest` change is applied and the numbers improved.
