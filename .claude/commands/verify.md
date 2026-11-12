---
description: Inspect the running site with Playwright MCP at all breakpoints and reduced motion, then report issues
argument-hint: [section or route, optional]
---

Verify ${ARGUMENTS:-the whole site} against design-reference/DESIGN_SPEC.md.

1. Make sure `npm run dev` is running on http://localhost:3000 (start it in the background if not).
2. With the Playwright MCP browser, for each viewport 375x812, 768x1024, 1280x800, 1920x1080:
   - Load `/#work` and `/#about`
   - Take a full-page screenshot, then scroll in steps of ~60% viewport height and screenshot at each step so scroll effects are captured mid-animation
   - Read console messages; any error or hydration warning is a failure
3. Emulate `prefers-reduced-motion: reduce` at 1280 and confirm every effect sits in its end state (no hidden text, no 22% opacity words, stat "Same day." visible, cards not scaled).
4. Check: colours match tokens, Playfair/Geist/Geist Mono actually loaded (not fallback), no horizontal overflow at 375, touch targets >= 44px, tab wipe works both directions.
5. Report as a short table: viewport, section, issue, fix. Then fix the issues and re-run only the failing checks.
