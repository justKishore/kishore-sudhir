# 002 — Card stack: read all positions first, then write all transforms

- **Status**: DONE (2026-11-13)
- **Commit**: 4ea97c9 (plus uncommitted work; `useScene.ts` line numbers are from the working tree)
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file, ~25 lines

## Problem

On desktop (≥ 820px), each scrolled frame loops over the project cards. For each card it **reads** `getBoundingClientRect()` on that card and the next one, then **writes** `transform` on that card. Card *i*'s write dirties style. Card *i+1*'s read then forces the browser to recalculate style and layout synchronously before it can answer. With N cards that is up to N forced layouts per frame, on the most scroll-heavy part of the Work page.

```ts
// src/components/motion/useScene.ts:196-212 — current
        // Card stack: the card underneath scales to .94 and darkens as the next one covers it.
        E.cards.forEach((c, i) => {
          const shade = c.querySelector<HTMLElement>("[data-shade]")!;
          if (vw < 820) {
            c.style.transform = "none";
            shade.style.opacity = "0";
            return;
          }
          const nx = E.cards[i + 1];
          let p = 0;
          if (nx) {
            const ch = c.offsetHeight;
            p = cl((c.getBoundingClientRect().top + ch - nx.getBoundingClientRect().top) / ch);
          }
          c.style.transform = rm ? "none" : `scale(${(1 - 0.06 * p).toFixed(4)})`;
          shade.style.opacity = (p * 0.5).toFixed(3);
        });
```

Note: `getBoundingClientRect()` includes transforms, so the current code also measures card *i*'s already-scaled box. Reading every position before any write measures them all in one consistent state.

## Target

Two passes: a read pass that collects `top` and `offsetHeight` for every card, then a write pass. Same maths, same output values.

```ts
// target (replaces lines 196-212)
        // Card stack: the card underneath scales to .94 and darkens as the next one covers it.
        // Read every position first, then write, so the browser lays out once per frame.
        if (vw < 820) {
          E.cards.forEach((c) => {
            c.style.transform = "none";
            c.querySelector<HTMLElement>("[data-shade]")!.style.opacity = "0";
          });
        } else {
          const tops = E.cards.map((c) => c.getBoundingClientRect().top);
          const hs = E.cards.map((c) => c.offsetHeight);
          E.cards.forEach((c, i) => {
            const p = i + 1 < E.cards.length ? cl((tops[i] + hs[i] - tops[i + 1]) / hs[i]) : 0;
            c.style.transform = rm ? "none" : `scale(${(1 - 0.06 * p).toFixed(4)})`;
            c.querySelector<HTMLElement>("[data-shade]")!.style.opacity = (p * 0.5).toFixed(3);
          });
        }
```

## Repo conventions to follow

- All motion runs in the single rAF loop in `src/components/motion/useScene.ts`; helpers `cl` (clamp 0..1) and `ease` are at the top of that file. Keep using `cl`.
- Inline styles are written as strings with `toFixed(...)`, as in the current code. Keep the same precision (4 for scale, 3 for opacity).

## Steps

1. Open `src/components/motion/useScene.ts` and find the block starting `// Card stack:` (line 196) and ending with the `});` before `// Interests: vertical scroll drives the horizontal track.` (line 213).
2. Replace that block with the **Target** code exactly.
3. Make no other changes in the file.

## Boundaries

- Do NOT change the scale amount (0.06), the shade amount (0.5), or the 820px breakpoint.
- Do NOT touch the hero, statement, stat, interests, marquee, orbit or gradient-boosting blocks.
- Do NOT touch CSS (`.card` sticky positioning stays as is).
- If the current block doesn't match the excerpt above, STOP and report.

## Verification

- **Mechanical**: `npm run lint` and `npm run build` pass.
- **Feel check** (`npm run dev`, 1280px, Work tab, scroll slowly through "Selected work"):
  - Visually identical to before: each card scales down to 0.94 and darkens as the next one slides over it, with no jump at the start or end of each overlap.
  - DevTools > Performance, record a 3-second scroll through the cards: there are no "Forced reflow" warnings attributed to `useScene.ts`, and Layout entries are at most one per frame.
  - At 375px the cards stack normally with no scale or shade.
  - With `prefers-reduced-motion: reduce` emulated: cards do not scale. The shade still darkens; that is unchanged from today.
- **Done when**: the card block performs every `getBoundingClientRect()` / `offsetHeight` read before the first `style` write, and the feel check matches today's look.
