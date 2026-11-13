# 001 — Move the contact link hover shift to transform and gate all hovers to real pointers

- **Status**: DONE (2026-11-13)
- **Commit**: 4ea97c9 (plus uncommitted header/nav work in `src/app/globals.css`; line numbers below are from that working tree)
- **Severity**: MEDIUM
- **Category**: Performance + Accessibility
- **Estimated scope**: 2 files, ~20 lines

## Problem

The contact rows ("LinkedIn ↗", "Email ↗") shift right on hover by animating `padding-left`, a layout property. Every frame of the 0.3s transition re-lays out the row. The hover is also not gated to hover-capable devices, so on a phone a tap leaves the row stuck in its shifted, recoloured state.

```css
/* src/app/globals.css:449-457 — current */
.contact__link {
  display: flex; align-items: baseline; justify-content: space-between; gap: 16px; min-height: 64px; padding: 16px 0;
  border-top: 1px solid var(--border-line); text-decoration: none; color: var(--paper-50);
  font-family: var(--font-serif); font-size: clamp(24px, 2.6vw, 36px); line-height: 1.2;
  transition: color 0.3s, padding 0.3s;
}
.contact__list li:last-child .contact__link { border-bottom: 1px solid var(--border-line); }
.contact__link:hover { color: var(--steel-400); padding-left: 10px; }
```

```tsx
// src/components/layout/Contact.tsx:22-24 — current
<a className="contact__link" href={href(l.href)}>
  {l.label} <span className="contact__arrow" aria-hidden>↗</span>
</a>
```

Other ungated hovers with the same sticky-on-tap problem:

```css
/* src/app/globals.css:73 */   a:hover { color: var(--mist-200); }
/* src/app/globals.css:161 */  .pill-nav button:hover { color: var(--paper-50); }
/* src/app/globals.css:281 */  .cta:hover { background: var(--mist-200); color: var(--navy-950); }
```

The 10px shift itself is required by `design-reference/DESIGN_SPEC.md` line 61 ("hover shifts colour to mist and pads left 10px"). Keep the look and change only how it is produced.

## Target

- The label text moves 10px right via `transform: translateX(10px)`; the arrow stays put (as it does today, because the row is `justify-content: space-between`).
- Colour transition stays `0.3s ease`; the transform uses the repo's ease-out token over 300ms: `transform 300ms var(--ease-reveal)` where `--ease-reveal: cubic-bezier(0.2, 0.7, 0.1, 1)`.
- Every `:hover` rule listed above sits inside `@media (hover: hover) and (pointer: fine)`.
- Reduced motion: colour change stays, the translate is dropped.

```css
/* target */
.contact__link {
  display: flex; align-items: baseline; justify-content: space-between; gap: 16px; min-height: 64px; padding: 16px 0;
  border-top: 1px solid var(--border-line); text-decoration: none; color: var(--paper-50);
  font-family: var(--font-serif); font-size: clamp(24px, 2.6vw, 36px); line-height: 1.2;
  transition: color 0.3s ease;
}
.contact__label { display: inline-block; transition: transform 300ms var(--ease-reveal); }
@media (hover: hover) and (pointer: fine) {
  .contact__link:hover { color: var(--steel-400); }
  .contact__link:hover .contact__label { transform: translateX(10px); }
}
```

## Repo conventions to follow

- Easing tokens live on `:root` in `src/app/globals.css:48-49` (`--ease-reveal`, `--ease-wipe`). Use `var(--ease-reveal)`; do not add a new curve.
- Reduced-motion overrides are collected in one block at the end of the file (`src/app/globals.css`, the `@media (prefers-reduced-motion: reduce)` block that already contains `.contact__link { transition: none; }`).

## Steps

1. `src/components/layout/Contact.tsx:23` — wrap the label:
   ```tsx
   <span className="contact__label">{l.label}</span> <span className="contact__arrow" aria-hidden>↗</span>
   ```
2. `src/app/globals.css:453` — change `transition: color 0.3s, padding 0.3s;` to `transition: color 0.3s ease;`.
3. `src/app/globals.css:457` — replace `.contact__link:hover { color: var(--steel-400); padding-left: 10px; }` with the `.contact__label` rule and the gated media block from **Target**.
4. Gate the three other hovers by wrapping each in `@media (hover: hover) and (pointer: fine) { ... }`, leaving it where it is:
   - `a:hover { color: var(--mist-200); }` (line 73)
   - `.pill-nav button:hover { color: var(--paper-50); }` (line 161)
   - `.cta:hover { background: var(--mist-200); color: var(--navy-950); }` (line 281)
5. In the final `@media (prefers-reduced-motion: reduce)` block, replace `.contact__link { transition: none; }` with:
   ```css
   .contact__label { transition: none; }
   .contact__link:hover .contact__label { transform: none; }
   ```
   (Colour change on hover is kept: it's feedback, not movement.)

## Boundaries

- Do NOT change the 10px distance, the colours, or the row layout.
- Do NOT touch `.brand:hover` (it sets the same colour as rest, so it has no effect either way).
- Do NOT touch `src/components/motion/useScene.ts` or any other component.
- If any quoted line does not match what you find, STOP and report.

## Verification

- **Mechanical**: `npm run lint` passes; `npm run build` succeeds.
- **Feel check** (`npm run dev`, scroll to the Contact section at 1280px):
  - Hovering "LinkedIn" moves only the word right by 10px; the ↗ stays at the right edge; colour fades to steel.
  - DevTools > Performance, record while hovering on and off the rows: no purple "Layout" entries during the hover transition.
  - DevTools > Animations at 10%: the label glides with a fast start and soft settle (ease-out), not a linear slide.
  - Device toolbar at 375px with touch emulation: tap a contact row, go back, the row is NOT left shifted or recoloured. Tapping the CTA and pill nav leaves no stuck hover colour.
  - Rendering > emulate `prefers-reduced-motion: reduce`: hover still recolours, nothing moves.
- **Done when**: no `padding` in any `transition` declaration in `globals.css`, and `grep -n ":hover" src/app/globals.css` shows every hover except `.brand:hover` inside a `(hover: hover) and (pointer: fine)` block.
