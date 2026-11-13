# Kishore Sudhir portfolio: build brief for Claude Code

Build a production version of the mockup in `reference/Portfolio.mockup.html`.
That file is a Claude Design source (custom `<x-dc>`, `<sc-for>`, `<sc-if>`, `{{ }}` bindings, a `DCLogic` class). It will not run on its own. Treat it as the spec: copy its markup, inline styles and motion maths, not its runtime.

## Bundle contents

| Path | What it is |
|---|---|
| `/kish-portfolio-kit/template/public/assets/*.webp` | Use these. Optimised images (projects ~12 KB each, hero 250 KB) |
| `/kish-portfolio-kit/template/public/assets/melbourne-dusk-960.webp` | Mobile hero (use via `srcset` / `image-set`) |
| `/kish-portfolio-kit/template/public/assets/*.png` | Lossless originals, keep as fallback / source |
| `/kish-portfolio-kit/template/design-reference/tokens.css` | Colours, type, spacing, shadows, easings as CSS variables |
| `/kish-portfolio-kit/template/design-reference/content.json` | Every string on the site. `*word*` = italic gradient emphasis. `PLACEHOLDER` = Kish still to write |
| `/kish-portfolio-kit/template/design-reference/mock-website/Portfolio mockups for review – Portfolio.html` | Full mockup source: layout, every animation formula |

Image sizes: hero 1672×941, project cards 960×720 (4:3, shown `cover`).

## Suggested stack

Astro or Next.js (static export), plain CSS using `tokens.css`, one small client script (or a React hook) running a single `requestAnimationFrame` loop. No animation library needed; the maths is all in the mockup. Deploy to Vercel or Netlify.

## Structure

Two views, **Work** (default) and **About**, switched by a pill nav in a fixed header. Use `#work` / `#about` hash routes (or `/` and `/about`). The **Contact** section and footer sit below both views.

Tab switch = full-screen circular wipe: `#13315C` overlay with `clip-path: circle()` expanding from the click point over .8s (`--ease-wipe`), shows "Work." or "About." in big Playfair italic, swaps view, scrolls to top, fades out over .55s. Clicking the active tab scrolls to top.

### Work view
1. **Hero** (100vh): `melbourne-dusk` background with parallax (`translateY(-top*0.38)`), a 1.08→1 scale settle over 2.8s on load, navy gradient overlay, a dark layer that fades in as you scroll. H1 two lines, each line slides up from `translateY(115%)` staggered 0.16s. Glass "Open to work now" card with a pulsing green dot. Live Melbourne clock (HH:MM:SS, `Intl.DateTimeFormat` en-AU). "Scroll" cue line animating at the bottom. Hero text fades and lifts as you scroll out.
2. **Marquee**: two rows, row 1 Geist 500 solid scrolling left, row 2 Playfair italic outlined (`-webkit-text-stroke`) scrolling right. Speed 40px/s plus scroll offset × 0.35. Items separated by small dots.
3. **Statement** "How I work": each word starts at opacity .22 and lights up to 1 as the paragraph scrolls through the viewport.
4. **Stat**: "6 to 7 weeks" gets a glowing strike-through line scaling in on scroll, then "Same day." (gradient text) + copy + "Book free consultation →" CTA fade up.
5. **Selected work**: 5 stacked sticky cards (`top: 110px + i*22px`). As the next card slides over, the one beneath scales to .94 and a navy shade fades to .5. Card = image left, number / title / summary / tag pills right. Below 820px: plain stacked cards, no sticky.

### About view
1. **Hero** (62vh): same photo zoomed and offset, giant italic "About".
2. **Bio**: two paragraphs + a `<dl>` of facts ("3+ years" big gradient italic).
3. **Gradient boosting demo**: sticky 300vh section. An SVG shows a target curve (sum of two sines, 97 points) and a model built from 7 boosting rounds of depth-3 regression trees, learning rate .55. Scroll scrubs between rounds; shows "Round k of 7" and MSE. Under 820px a "Next round" button steps instead. Port `buildGB()` and `drawGB()` from the mockup as-is.
4. **Skills orbit**: 13 rounded-square chips orbiting "Curiosity" in 3D (golden-angle spacing, `perspective:1000px`, 6°/s plus scroll). Chips show the abbreviation, then swap to the Simple Icons SVG (white) once it loads: `https://cdn.jsdelivr.net/npm/<icon>.svg` using the `icon` paths in content.json. Better: download those SVGs into `public/icons/` at build time.
5. **Areas of interest**: sticky 300vh horizontal scroll of 4 glass cards with two drifting radial blobs. Under 768px: a normal grid.

### Contact + footer
Dusk photo under a heavy navy overlay. "Want to work on something together?" + LinkedIn / Email rows that nudge right and turn steel blue on hover. Footer links + "Back to top ↑".

## Must-haves

- **Reduced motion**: honour `prefers-reduced-motion`. Every effect has a static end state in the mockup (`rm` branches): no parallax, all words lit, strike drawn, cards unscaled, sticky sections become normal flow, orbit frozen.
- One rAF loop, only recompute scroll-driven pieces when `scrollY` changes; cache element lists.
- Accessibility: real `<button>`/`<a>`, 44px tap targets, `aria-label` on the SVG demo, text contrast as specified (mono labels use `#C9D6E2` on navy).
- No horizontal scroll at 360px; gutters `clamp(16px,5vw,80px)`.
- `<link rel=preload>` the hero image; lazy-load project images.
- Meta: title "Kishore Sudhir · Data and AI", OG image (crop of the hero).

## Still to fill (from Kish)
- Interest card copy (4 placeholders)
- Real LinkedIn, email, GitHub, Blog, "AI slop" URLs
