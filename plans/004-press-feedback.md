# 004 — Add press feedback to the CTA, pill nav and "Next round" buttons

- **Status**: DONE (2026-11-13)
- **Commit**: 4ea97c9 (plus uncommitted work; line numbers are from the working tree)
- **Severity**: LOW (missed opportunity)
- **Category**: Physicality & origin (press feedback)
- **Estimated scope**: 1 file, ~15 lines
- **Depends on**: 001. Both edit the `.cta` and `.pill-nav button` rules; do 001 first.

## Problem

None of the site's buttons respond to being pressed. The most important is the primary conversion button, "Book free consultation →" (`src/components/work/Stat.tsx:25`). The whole Work page leads to it, and clicking it gives no physical confirmation before the page scrolls to Contact.

```css
/* src/app/globals.css:276-280 — current */
.cta {
  display: flex; align-items: center; gap: 10px; min-height: 56px; padding: 0 32px; border-radius: var(--radius-pill);
  background: var(--paper-50); color: var(--navy-950); font-size: 17px; font-weight: 600; text-decoration: none;
  box-shadow: var(--shadow-glow); transition: background 0.3s;
}

/* src/app/globals.css:154-160 — current */
.pill-nav button {
  position: relative;
  min-height: var(--tap); padding: 0 20px; border: 0; border-radius: var(--radius-pill);
  font-size: 15px; font-weight: 500; cursor: pointer;
  transition: background 0.3s, color 0.3s, box-shadow 0.3s;
  background: transparent; color: rgba(238, 244, 237, 0.82);
}

/* src/app/globals.css:360-363 — current ("Next round", mobile only) */
.gb-tap {
  align-items: center; min-height: var(--tap); padding: 0 18px; border-radius: var(--radius-pill);
  border: 1px solid rgba(238, 244, 237, 0.6); background: transparent; color: var(--paper-50); font-size: 14px; cursor: pointer;
}
```

## Target

A subtle scale-down on `:active`, using the repo's ease-out token `--ease-reveal: cubic-bezier(0.2, 0.7, 0.1, 1)`:

| Element | Pressed scale | Duration |
|---|---|---|
| `.cta` (large, 56px tall) | `scale(0.97)` | 160ms |
| `.pill-nav button` | `scale(0.96)` | 120ms |
| `.gb-tap` | `scale(0.96)` | 120ms |

```css
/* target, add transform to each existing transition list, then: */
.cta { transition: background 0.3s, transform 160ms var(--ease-reveal); }
.cta:active { transform: scale(0.97); }

.pill-nav button { transition: background 0.3s, color 0.3s, box-shadow 0.3s, transform 120ms var(--ease-reveal); }
.pill-nav button:active { transform: scale(0.96); }

.gb-tap { transition: transform 120ms var(--ease-reveal); }
.gb-tap:active { transform: scale(0.96); }
```

`:active` is NOT gated behind `(hover: hover)`. Press feedback is exactly what touch users need.

Reduced motion: keep a gentler press rather than none, because it's feedback, not travel:

```css
@media (prefers-reduced-motion: reduce) {
  .cta:active { transform: scale(0.99); }
  .pill-nav button:active, .gb-tap:active { transform: scale(0.98); }
}
```

## Repo conventions to follow

- Tokens: `--ease-reveal` on `:root` at `src/app/globals.css:48`. Do not add new curves.
- Reduced-motion overrides go in the existing final `@media (prefers-reduced-motion: reduce)` block at the end of `globals.css`.
- Touch targets stay ≥ 44px. `scale` doesn't change the hit area, so this holds.

## Steps

1. `src/app/globals.css`, `.cta` rule (~line 276): change `transition: background 0.3s;` to `transition: background 0.3s, transform 160ms var(--ease-reveal);`. Directly after the `.cta` rule (and after the hover media block added by plan 001), add `.cta:active { transform: scale(0.97); }`.
2. `.pill-nav button` rule (~line 154): change the transition to `transition: background 0.3s, color 0.3s, box-shadow 0.3s, transform 120ms var(--ease-reveal);`. Add `.pill-nav button:active { transform: scale(0.96); }` after the `[aria-current="page"]` rule.
3. `.gb-tap` rule (~line 360): append `transition: transform 120ms var(--ease-reveal);` inside the rule and add `.gb-tap:active { transform: scale(0.96); }` after it.
4. Add the three reduced-motion lines from **Target** to the final `@media (prefers-reduced-motion: reduce)` block.

## Boundaries

- Do NOT add press feedback to links (`.contact__link`, footer links, `.card__link`). Rows and text links don't need a physical press.
- Do NOT change colours, sizes, or the hover rules (handled by plan 001).
- Do NOT use `transition: all`.

## Verification

- **Mechanical**: `npm run lint` and `npm run build` pass.
- **Feel check** (`npm run dev`):
  - Press and hold "Book free consultation": it visibly settles inward almost immediately (≤ 160ms). Release: it springs back just as fast. It should feel like a physical button, not a zoom.
  - DevTools > Animations at 10%: the press starts fast and eases into 0.97 (ease-out), not linear.
  - Rapidly click Work/About in the pill. The scale never restarts from zero mid-press, because transitions retarget.
  - At 375px with touch emulation, tap "Next round" in the gradient-boosting panel: a brief press dip, then the curve animates.
  - With `prefers-reduced-motion: reduce`: presses still dip, just less (0.98 to 0.99).
- **Done when**: all three elements dip on press within budget, reduced motion keeps a gentler dip, and nothing else changed.
