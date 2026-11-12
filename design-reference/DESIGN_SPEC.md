# Design spec: Kishore Sudhir portfolio

Extracted from the approved Claude Design artifact (Portfolio + Overview frames). Build to this. Copy lives in `src/content/site.ts`.

## Tokens

### Colour
| Token | Hex | Use |
|---|---|---|
| deep-blue | `#134074` | top of page, hero base |
| navy | `#13315C` | mid page, cards |
| night | `#0B2545` | bottom of page, body bg |
| mist | `#8DA9C4` | large type, strokes, borders only (not body text) |
| secondary | `#C9D6E2` | secondary text, labels (passes 4.5:1 on all blues) |
| paper | `#EEF4ED` | body text, primary button |
| status | `#4ADE80` | "open to work" dot only |

Page background runs deep-blue to navy to night, top to bottom, inside each view: `linear-gradient(180deg,#134074 0%,#13315C 42%,#0B2545 100%)`.

**Accent words** (italic Playfair) use gradient text: `linear-gradient(100deg,#EEF4ED 0%,#C9D6E2 45%,#8DA9C4 100%)` with `background-clip:text`, `padding-right:.06em` so the italic doesn't clip.

### Type
- Headings: Playfair Display 400, italic for accent words and display
- Body/UI: Geist 400/500/600, 17px, line-height 1.6
- Labels/clock: Geist Mono 12 to 13px, uppercase, letter-spacing .12em, colour secondary
- Fluid scale (min to max): Display 46 to 210 · Hero 34 to 116 (`clamp(34px,6.4vw,116px)`) · H2 36 to 84 · Statement 28 to 64 · H3 28 to 52 · Lead 18 to 22 · Body 17 · Small 15 · Label 12

### Space, radius, shadow, glass
- Spacing: 4, 8, 12, 16, 24, 32, 48, 72, 96, 140, 180
- Page gutter `clamp(16px,5vw,80px)`; content max 1440 (hero 1600)
- Radii: 12 inputs, 16 image placeholders, 20 status card, 28 cards/panels, 999 pills/buttons
- Shadows: card `0 30px 60px rgba(11,37,69,.35)`; stack lift `0 -18px 50px rgba(11,37,69,.5)`; glow `0 0 14px 3px rgba(141,169,196,.85)`
- Glass: fill `rgba(11,37,69,.5)`, border `1px rgba(238,244,237,.22)`, `backdrop-filter: blur(18px) saturate(1.2)`. Fill alone must keep text readable where blur is unsupported

## Layout

### Header (fixed, both views)
- Left: "Kishore Sudhir" in Playfair italic 22px, links to Work
- Right: pill nav (glass, `rgba(11,37,69,.55)`, blur 14px) with Work / About buttons, min-height 44px. Active = paper bg + night text
- Tab state is mirrored in the URL hash (`#work`, `#about`); load the hash on mount

### Work view
1. **Hero** (100vh, content bottom-aligned). Background image `/assets/melbourne-dusk.png` (cover, position 50% 60%) with overlay `linear-gradient(180deg, rgba(11,37,69,.5) 0%, rgba(11,37,69,.18) 30%, rgba(11,37,69,.55) 62%, rgba(19,64,116,.94) 92%, #134074 100%)`, plus a "dusk" layer (night gradient) at opacity 0.
   - H1 two lines: "Data and AI work" / "that *holds up* in production" (accent on "holds up"). Placeholder note under it: `[Placeholder: confirm headline]`
   - Bottom row: glass status card (pulsing green dot, "Open to work now", "Data engineering, AI adoption and automation roles. Anywhere in Australia, or remote.") and, right-aligned, "MELBOURNE" + live clock HH:MM:SS in Australia/Melbourne, tabular nums
   - Scroll cue centred at bottom: "SCROLL" + 1px track with a moving 12px segment
2. **Marquee**: two rows, opposite directions. Row 1 Geist 500, `clamp(28px,5vw,76px)`, paper, dot separators in mist (areas list). Row 2 Playfair italic, transparent fill with 1px `#C9D6E2` text-stroke, ring separators (interests list)
3. **Statement**: label "HOW I WORK", then the statement sentence word by word, each word an inline-block starting at opacity .22
4. **Stat strike**: label "TIME TO SEND A QUOTE, BEFORE", big Playfair italic "6 to 7 weeks" in mist with a glowing strike line (paper, glow shadow) drawn across at 56% height. Then label "AFTER" and "Same day." in gradient text, two short paragraphs, and primary CTA pill "Book free consultation →" (paper bg, night text, min-height 56px, glow) linking to #contact
5. **Selected work**: H2 "Selected *work*", label "FIVE PROJECTS". Five cards, two-column grid (image | text), navy bg, 28px radius, mist border. Each: "01 / 05", title (Playfair), summary, tag pills (Geist Mono 12, mist border)

### About view
1. **About hero** (min `max(62vh,420px)`): same photo, wider crop (`width:170%`, position 0% 50%), giant italic "About" `clamp(64px,13vw,220px)`
2. **Bio**: two columns. Left: two paragraphs (lead size). Right: definition list with top borders: Experience "**3+ years** in industry" (big gradient italic), Based in Melbourne, Study, Background
3. **Gradient boosting** panel: label, H2 "Small steps in the right *direction*", line "Philosophers call it kaizen. We call it gradient boosting.", readout "Round k of 7" + "MSE x.xxxx", SVG 600x300: baseline at y=150, target as thin mist line, model as thick paper line with glow. Caption: "A small model built from scratch to show how the method works." and "thin line: target · thick line: model so far"
4. **Skills orbit**: centred label "SKILLS, DRIVEN BY" + giant gradient "Curiosity". 13 rounded-square chips (22% radius, `linear-gradient(150deg,#1B4A85,#13315C)`, inset highlight) orbit in 3D around it. Chip shows the Simple Icons logo (white) with the label; falls back to the abbreviation if the icon fails
5. **Areas of interest**: H2 "Areas of *interest*", four glass cards "01 / 04" with italic title and text. Two drifting radial blobs behind

### Contact (both views)
- Photo background (position 50% 78%) under a heavy night overlay
- H2 "Want to work on something *together?*", right column label "REACH OUT" and two big link rows (LinkedIn ↗, Email ↗) with top/bottom borders; hover shifts colour to mist and pads left 10px
- Footer row: email, LinkedIn, GitHub (placeholders), Blog, AI slop, "Back to top ↑" right-aligned

## Motion

All effects animate only transform and opacity. With reduced motion every effect rests in its end state.

| Effect | Trigger | Spec | Mobile | Reduced motion |
|---|---|---|---|---|
| Hero settle | load | bg scale 1.08 to 1 over 2.8s, ease-out cubic | same | none |
| Headline reveal | load | each line rises from `translateY(115%)` behind an overflow mask, 1.2s `cubic-bezier(.2,.7,.1,1)`, delay 0.25s + 0.16s per line; status row fades up from 24px | same | instant |
| Hero parallax + dusk | scroll | bg moves at ~0.38x scroll; dusk layer opacity 0 to .85 over hero height; text fades out at 1.9x rate and lifts 110px | same | off |
| Status dot | always | ring scales 1 to 3.4 and fades .6 to 0 every 2s | same | off |
| Marquee | always | 40px/s, rows opposite directions, scroll adds 0.35x scroll delta | same, smaller type | static |
| Word light-up | scroll | words go .22 to 1 one by one as the paragraph crosses from 82% viewport down (scrub) | same | all at 1 |
| Stat strike | scroll | strike scaleX 0 to 1 (origin left) in the first ~half; then "Same day." block fades up from 28px | same | end state |
| Card stack | scroll | cards `position:sticky`, top = 110 + 22*i px. As the next card covers one, it scales to .94 and a night shade goes to .5 opacity | under 820: plain list | stacking stays, no scale |
| Gradient boosting | scroll | section 300vh, panel pinned; model line morphs through 7 rounds (interpolate between rounds), readout updates | under 820: no pin, "Next round" tap button cycles 0 to 7 with easing | final round |
| Skills orbit | always + scroll | chips orbit (golden angle spacing 2.39996 rad), 6°/s plus scroll; depth drives scale .76 to 1.04, opacity .55 to 1, z-index; gentle per-chip wobble in rotateX/Y/Z | same | static |
| Areas horizontal | scroll | section 300vh, sticky; track slides left by (scrollWidth - viewport) | under 768: grid | grid |
| Drift blobs | always | slow sine drift ±40px / ±26px | same | off |
| Tab wipe | tab click | navy circle grows from click point (clip-path circle, .8s `cubic-bezier(.65,0,.2,1)`) showing "Work." / "About." in giant italic; swap view, scroll to top, fade overlay out .55s | same | short cross-fade |

GSAP mapping: use ScrollTrigger with `scrub: true` for parallax, word light-up, stat strike, card scale, horizontal track; `pin` for gradient boosting; `gsap.ticker` or `useFrame` for the always-on loops (marquee, orbit, pulse, drift).

## Gradient boosting model (port as-is to `src/lib/gradientBoosting.ts`)

```ts
// 97 points on x in [0,1]; target = 0.55 sin(2π·1.25x + .3) + .22 sin(2π·3.1x + 1.2)
// F0 = mean(y). 7 rounds: residuals -> depth-3 regression tree (greedy best split
// maximising l²/nL + r²/nR on contiguous x ranges) -> F += 0.55 * tree.
// Keep preds[0..7] and mse[0..7]. SVG x = 20 + 560x, y = 150 - 150v.
export function buildGB() {
  const n = 97, xs: number[] = [], ys: number[] = [];
  for (let i = 0; i < n; i++) { const x = i / (n - 1); xs.push(x); ys.push(0.55 * Math.sin(2 * Math.PI * 1.25 * x + 0.3) + 0.22 * Math.sin(2 * Math.PI * 3.1 * x + 1.2)); }
  const fit = (res: number[], lo: number, hi: number, depth: number, out: number[]) => {
    let sum = 0; for (let i = lo; i < hi; i++) sum += res[i];
    let best = -1, bestGain = -Infinity, l = 0;
    if (depth > 0 && hi - lo > 1) for (let s = lo + 1; s < hi; s++) { l += res[s - 1]; const g = l * l / (s - lo) + (sum - l) * (sum - l) / (hi - s); if (g > bestGain) { bestGain = g; best = s; } }
    if (best < 0) { const m = sum / (hi - lo); for (let i = lo; i < hi; i++) out[i] = m; return; }
    fit(res, lo, best, depth - 1, out); fit(res, best, hi, depth - 1, out);
  };
  const mse = (P: number[]) => P.reduce((a, p, i) => a + (ys[i] - p) ** 2, 0) / n;
  let F = ys.map(() => ys.reduce((a, b) => a + b, 0) / n);
  const preds = [F.slice()], mses = [mse(F)];
  for (let r = 0; r < 7; r++) { const res = ys.map((y, i) => y - F[i]), tree = new Array<number>(n); fit(res, 0, n, 3, tree); F = F.map((f, i) => f + 0.55 * tree[i]); preds.push(F.slice()); mses.push(mse(F)); }
  return { xs, ys, preds, mses };
}
```

## Skills orbit chip positions (from the prototype)

For chip i of n with `a = i*2.39996 + spin`, `z = sin(a)`, `d = (z+1)/2`, `side = i%2 ? 1 : -1`:
- x = cos(a) · W · (0.24 + 0.13 · ((i·7) mod 5)/4)
- y = side · (0.23 + 0.2 · floor(i/2)/6) · H + sin(t/3100 + 1.7i) · 10
- rotateX = sin(t/2600 + i)·24 − 10·side; rotateY = −cos(a)·38; rotateZ = sin(t/3400 + 2i)·12 + ((i mod 3) − 1)·10
- scale .76 + .28d, opacity .55 + .45d, z-index 3 if z > 0 else 1
- Container height `clamp(480px,82vh,780px)`, perspective 1000px
