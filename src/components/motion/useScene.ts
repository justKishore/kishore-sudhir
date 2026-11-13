"use client";

import { useEffect, useRef } from "react";
import { buildGB, gbModelAt, gbPath, GB_ROUNDS, type GB } from "@/lib/gradientBoosting";

/*
 * One requestAnimationFrame loop for the whole site, ported from the mockup's frame().
 * Elements are found by data attributes and cached; the list is rebuilt only when
 * `version` changes (tab swap) or the window resizes. Scroll-driven pieces only
 * recompute when scrollY changes. Time-driven pieces (marquee, pulse, cue, drift,
 * orbit) run every frame. Reduced motion puts everything in its end state.
 */

const MARQUEE_SPEED = 40; // px/s
// Skills vortex (after cosmos.so): chips sit at fixed depths on concentric rings and the
// whole field turns counter-clockwise around the centre. CSS px, perspective 900px.
const VORTEX_SPEED = 4; // deg/s
const VORTEX_FAR = -1300;
const VORTEX_NEAR = 120;
const PERSPECTIVE = 900; // matches .orbit__list perspective
const LABEL_MIN_PX = 12; // smallest rendered chip label after perspective shrink

const cl = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => 1 - Math.pow(1 - v, 3);

type Els = {
  rev: HTMLElement[];
  hero: HTMLElement[];
  words: HTMLElement | null;
  wordList: HTMLElement[];
  stat: HTMLElement | null;
  cards: HTMLElement[];
  hz: HTMLElement | null;
  mq: HTMLElement[];
  pulse: HTMLElement[];
  cue: HTMLElement[];
  drift: HTMLElement[];
  orbit: HTMLElement | null;
  chips: HTMLElement[];
  /** Chips actually rendered (the second set is display:none on small screens). */
  fieldChips: HTMLElement[];
  /** Per-chip constants (depth never changes, so z and perspective scale don't either). */
  chipZ: number[];
  chipP: number[];
  /** Clear ellipse around the title, in px from the orbit centre (before adding chip size). */
  clearA: number;
  clearB: number;
  chipHalf: number;
  /** Horizontal distance the interests track travels so the last card ends on the gutter. */
  hzTravel: number;
  gbWrap: HTMLElement | null;
  gbP: SVGPathElement | null;
  gbRound: HTMLElement | null;
  gbMse: HTMLElement | null;
};

const q = <T extends Element = HTMLElement>(s: string) => Array.from(document.querySelectorAll<T>(s));

/**
 * Everything about a chip that depends only on its depth is set once here: opacity, stacking,
 * whether its label shows, and a label size that stays >= 12px after the perspective shrink.
 * Also measures the title block so the loop can keep chips out of it.
 */
function setupChips(els: Els) {
  const n = els.fieldChips.length;
  els.chipZ = [];
  els.chipP = [];
  const base = Math.min(14, Math.max(11, window.innerWidth * 0.011));
  els.fieldChips.forEach((ch, j) => {
    const depth = ((j * 5) % n) / Math.max(1, n - 1); // 0 = far, 1 = near
    const z = VORTEX_FAR + depth * (VORTEX_NEAR - VORTEX_FAR);
    const pScale = PERSPECTIVE / (PERSPECTIVE - z);
    els.chipZ.push(z);
    els.chipP.push(pScale);
    ch.style.opacity = (0.45 + 0.55 * Math.pow(depth, 1.2)).toFixed(3);
    ch.style.zIndex = String(1 + Math.round(depth * 10));
    ch.toggleAttribute("data-far", depth < 0.35);
    const label = ch.querySelector<HTMLElement>(".chip__label");
    if (label) {
      // Big enough to read after the perspective shrink, small enough that the longest word
      // fits inside the chip (Geist Mono advances ~0.62em per character, labels get 88% width).
      const longest = Math.max(...(label.textContent ?? "").split(/\s+/).map((w) => w.length), 1);
      const fit = (ch.offsetWidth * 0.88) / (longest * 0.62);
      const size = Math.min(Math.max(base, LABEL_MIN_PX / pScale), fit);
      label.style.fontSize = `${size.toFixed(1)}px`;
      // If it can't be both readable and inside the chip, show the icon alone, like far chips.
      label.style.display = size * pScale < LABEL_MIN_PX - 1 ? "none" : "";
    }
  });
  const orbit = els.orbit;
  const center = orbit?.querySelector<HTMLElement>(".orbit__center");
  if (orbit && center && n) {
    const o = orbit.getBoundingClientRect();
    let l = Infinity, r = -Infinity, t = Infinity, b = -Infinity;
    Array.from(center.children).forEach((c) => {
      const cr = c.getBoundingClientRect();
      l = Math.min(l, cr.left); r = Math.max(r, cr.right); t = Math.min(t, cr.top); b = Math.max(b, cr.bottom);
    });
    const cx = o.left + o.width / 2, cy = o.top + o.height / 2;
    // Half extents of the title block, plus breathing room. An ellipse through the box corners
    // needs sqrt(2) times the half extents.
    els.clearA = Math.max(cx - l, r - cx) * Math.SQRT2 + 16;
    els.clearB = Math.max(cy - t, b - cy) * Math.SQRT2 + 16;
    els.chipHalf = els.fieldChips[0].offsetWidth / 2;
  }
}

function collect(gb: GB): Els {
  const els: Els = {
    rev: q("[data-reveal]"),
    hero: q("[data-hero]"),
    words: q("[data-words]")[0] ?? null,
    wordList: q("[data-word]"),
    stat: q("[data-stat]")[0] ?? null,
    cards: q("[data-card]"),
    hz: q("[data-hz]")[0] ?? null,
    mq: q("[data-mq]"),
    pulse: q("[data-pulse]"),
    cue: q("[data-cue]"),
    drift: q("[data-drift]"),
    orbit: q("[data-orbit]")[0] ?? null,
    chips: q("[data-chip]"),
    fieldChips: [],
    chipZ: [],
    chipP: [],
    clearA: 0,
    clearB: 0,
    chipHalf: 0,
    hzTravel: 0,
    gbWrap: q("[data-gbwrap]")[0] ?? null,
    gbP: q<SVGPathElement>("[data-gbp]")[0] ?? null,
    gbRound: q("[data-gbround]")[0] ?? null,
    gbMse: q("[data-gbmse]")[0] ?? null,
  };
  els.fieldChips = els.chips.filter((c) => c.offsetParent !== null);
  setupChips(els);
  if (els.hz) {
    const track = els.hz.querySelector<HTMLElement>("[data-hztrack]")!;
    const last = track.lastElementChild as HTMLElement | null;
    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const box = track.parentElement!.clientWidth; // excludes the scrollbar, unlike innerWidth
    els.hzTravel = last ? Math.max(0, last.offsetLeft + last.offsetWidth + pad - box) : 0;
  }
  q<SVGPathElement>("[data-gbt]").forEach((el) => el.setAttribute("d", gbPath(gb, gb.ys)));
  // Chips show the abbreviation, then swap to the icon once it has loaded.
  q("[data-ico]").forEach((el) => {
    const src = el.dataset.ico;
    if (!src || el.dataset.on) return;
    el.dataset.on = "1";
    const im = new Image();
    im.onload = () => {
      el.style.backgroundImage = `url("${src}")`;
      el.style.opacity = "1";
      const abbr = el.previousElementSibling as HTMLElement | null;
      if (abbr) abbr.style.visibility = "hidden";
    };
    im.src = src;
  });
  return els;
}

export type SceneApi = {
  /** Restart the hero settle (after a tab swap). */
  restartHero: (delayMs?: number) => void;
};

export function useScene(version: string) {
  const versionRef = useRef(version);
  const api = useRef<SceneApi>({ restartHero: () => {} });
  const dirty = useRef(true);

  useEffect(() => {
    versionRef.current = version;
    dirty.current = true;
  }, [version]);

  useEffect(() => {
    const gb = buildGB();
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const t0 = performance.now();
    let heroT0 = t0;
    let els: Els | null = null;
    let lsy = -1;
    let lrm: boolean | null = null;
    let lgp: number | null = null;
    let lk = -1;
    let gbCur: number | null = null;
    let raf = 0;

    api.current.restartHero = (delayMs = 0) => {
      heroT0 = performance.now() + delayMs;
    };
    const onResize = () => (dirty.current = true);
    window.addEventListener("resize", onResize);
    // The title block is measured for the chip clear zone; re-measure once web fonts are in.
    document.fonts?.ready.then(() => (dirty.current = true));

    const frame = (now: number) => {
      const rm = mql.matches;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const sy = window.scrollY;
      const wasDirty = dirty.current || !els;
      if (wasDirty) {
        els = collect(gb);
        dirty.current = false;
        lgp = null;
        lk = -1;
        gbCur = null;
      }
      const E = els!;
      const moved = wasDirty || sy !== lsy || rm !== lrm;
      lsy = sy;
      lrm = rm;
      const t = now - t0;

      // Line reveals: staggered .16s, first at .25s.
      E.rev.forEach((el) => {
        if (el.dataset.done) return;
        el.dataset.done = "1";
        const d = 0.25 + +(el.dataset.reveal ?? 0) * 0.16;
        void el.offsetWidth; // make sure the start state is computed so the transition runs
        el.style.transition = rm
          ? "none"
          : `transform 1.2s cubic-bezier(.2,.7,.1,1) ${d}s, opacity 1.2s ease ${d}s`;
        el.style.transform = "translateY(0)";
        el.style.opacity = "1";
      });

      // Hero: parallax, 1.08 -> 1 settle over 2.8s, dark layer and text fade on scroll.
      const hs = now - heroT0;
      const settling = hs < 3000;
      if (moved || settling)
        E.hero.forEach((h) => {
          const r = h.getBoundingClientRect();
          const s = cl(-r.top / r.height);
          const par = h.querySelector<HTMLElement>("[data-par]")!;
          const dark = h.querySelector<HTMLElement>("[data-dark]")!;
          const txt = h.querySelector<HTMLElement>("[data-herotext]")!;
          if (rm) {
            par.style.transform = "none";
            dark.style.opacity = "0";
            txt.style.opacity = "1";
            txt.style.transform = "none";
            return;
          }
          const sc = 1 + 0.08 * (1 - ease(cl(hs / 2800)));
          par.style.transform = `translate3d(0,${(-r.top * 0.38).toFixed(1)}px,0) scale(${sc.toFixed(4)})`;
          dark.style.opacity = (s * 0.85).toFixed(3);
          txt.style.opacity = cl(1 - s * 1.9).toFixed(3);
          txt.style.transform = `translate3d(0,${(-s * 110).toFixed(1)}px,0)`;
        });

      if (moved) {
        // Statement: words light up from .22 to 1 as the paragraph passes through.
        if (E.words) {
          const r = E.words.getBoundingClientRect();
          const p = rm ? 1e6 : cl((vh * 0.82 - r.top) / (r.height + vh * 0.42)) * (E.wordList.length + 1);
          E.wordList.forEach((w, i) => (w.style.opacity = (0.22 + 0.78 * cl(p - i)).toFixed(3)));
        }
        // Stat: strike-through scales in, then "Same day." fades up.
        if (E.stat) {
          const r = E.stat.getBoundingClientRect();
          const p = rm ? 1 : cl((vh * 0.72 - r.top) / (vh * 0.55));
          const strike = E.stat.querySelector<HTMLElement>("[data-strike]")!;
          const same = E.stat.querySelector<HTMLElement>("[data-same]")!;
          const qq = cl((p - 0.55) / 0.45);
          strike.style.transform = `scaleX(${cl(p * 1.9).toFixed(3)})`;
          same.style.opacity = qq.toFixed(3);
          same.style.transform = `translate3d(0,${((1 - qq) * 28).toFixed(1)}px,0)`;
        }
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
        // Interests: vertical scroll drives the horizontal track.
        if (E.hz) {
          const track = E.hz.querySelector<HTMLElement>("[data-hztrack]")!;
          if (rm || vw < 768) track.style.transform = "none";
          else {
            const r = E.hz.getBoundingClientRect();
            const p = cl(-r.top / Math.max(1, r.height - vh));
            track.style.transform = `translate3d(${(-p * E.hzTravel).toFixed(1)}px,0,0)`;
          }
        }
      }

      // Marquee: 40px/s plus scroll offset x .35, rows in opposite directions.
      E.mq.forEach((m) => {
        const half = m.scrollWidth / 2;
        if (!half) return;
        const dir = +(m.dataset.mq ?? 1);
        const v = rm ? 0 : ((t / 1000) * MARQUEE_SPEED + sy * 0.35) * dir;
        m.style.transform = `translate3d(${(-(((v % half) + half) % half)).toFixed(1)}px,0,0)`;
      });

      const ph = (t / 2000) % 1;
      E.pulse.forEach((p) => {
        p.style.transform = rm ? "none" : `scale(${(1 + ph * 2.4).toFixed(3)})`;
        p.style.opacity = rm ? "0" : (0.6 * (1 - ph)).toFixed(3);
      });
      E.cue.forEach((c) => (c.style.transform = rm ? "none" : `translate3d(0,${(-12 + ph * 46).toFixed(1)}px,0)`));
      E.drift.forEach((d, i) => {
        d.style.transform = rm
          ? "none"
          : `translate3d(${(Math.sin(t / 7000 + i * 2) * 40).toFixed(1)}px,${(Math.cos(t / 9000 + i) * 26).toFixed(1)}px,0)`;
      });

      // Skills vortex (after cosmos.so): every chip orbits the centre on its own ring, counter-
      // clockwise. Depth sets the ring: far chips are small, faint and close to the title, near
      // chips are large and out by the edges. Each chip is tilted to face the centre and the tilt
      // turns with it. Scroll nudges the spin. Reduced motion: one frozen frame.
      if (E.orbit && E.fieldChips.length) {
        const r = E.orbit.getBoundingClientRect();
        if (wasDirty || (r.bottom > 0 && r.top < vh)) {
          const W = r.width;
          const H = r.height;
          const n = E.fieldChips.length;
          const spin = rm ? 0 : -(((t / 1000) * VORTEX_SPEED * Math.PI) / 180 + sy * 0.0008);
          E.fieldChips.forEach((ch, j) => {
            // Coprime strides spread angle and depth evenly, so copies of a skill land on
            // different sides of the circle and on different rings.
            const m = (j * 7) % n;
            const depth = ((j * 5) % n) / Math.max(1, n - 1); // 0 = far, 1 = near
            const z = E.chipZ[j];
            const ps = E.chipP[j];
            const a = (m / n) * Math.PI * 2 + ((j * 0.618034) % 1) * 0.35 + spin;
            const ca = Math.cos(a);
            const sa = Math.sin(a);
            // Near chips ride the outer rings, far chips the inner ones; but never inside the
            // clear ellipse around the title, measured where the chip actually lands on screen.
            let R = 0.68 + 0.5 * depth + 0.12 * ((j * 0.381966) % 1);
            if (E.clearA) {
              const A = E.clearA + E.chipHalf * ps;
              const B = E.clearB + E.chipHalf * ps;
              const k = ps * Math.hypot((ca * W * 0.5) / A, (sa * H * 0.62) / B);
              R = Math.max(R, 1 / k);
            }
            const x = ca * R * W * 0.5;
            const y = sa * R * H * 0.62;
            const rx = sa * 28; // tilt toward the centre, turning with the orbit
            const ry = -ca * 28;
            const rz = ((j * 29) % 40) - 20 + ca * 10; // capped so labels stay readable
            ch.style.transform = `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateZ(${rz.toFixed(1)}deg) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg)`;
          });
        }
      }

      // Gradient boosting: scroll scrubs rounds; under 820px the button steps (eased).
      if (E.gbWrap && E.gbP) {
        const step = +(E.gbWrap.dataset.step ?? GB_ROUNDS);
        let p: number;
        if (rm) p = 1;
        else if (vw < 820) {
          const tg = step / GB_ROUNDS;
          const cur = gbCur ?? tg;
          p = Math.abs(tg - cur) < 0.002 ? tg : cur + (tg - cur) * 0.14;
          gbCur = p;
        } else {
          const r = E.gbWrap.getBoundingClientRect();
          p = cl(-r.top / Math.max(1, r.height - vh));
        }
        if (p !== lgp) {
          lgp = p;
          E.gbP.setAttribute("d", gbPath(gb, gbModelAt(gb, p)));
          const k = rm ? GB_ROUNDS : vw < 820 ? step : Math.min(GB_ROUNDS, Math.floor(p * GB_ROUNDS + 1e-6));
          if (k !== lk) {
            lk = k;
            if (E.gbRound) E.gbRound.textContent = String(k);
            if (E.gbMse) E.gbMse.textContent = gb.mses[k].toFixed(4);
          }
        }
      }
    };

    const loop = (now: number) => {
      try {
        frame(now);
      } catch (e) {
        console.error(e);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return api;
}
