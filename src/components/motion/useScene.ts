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
const ORBIT_SPEED = 6; // deg/s

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
  gbWrap: HTMLElement | null;
  gbP: SVGPathElement | null;
  gbRound: HTMLElement | null;
  gbMse: HTMLElement | null;
};

const q = <T extends Element = HTMLElement>(s: string) => Array.from(document.querySelectorAll<T>(s));

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
    gbWrap: q("[data-gbwrap]")[0] ?? null,
    gbP: q<SVGPathElement>("[data-gbp]")[0] ?? null,
    gbRound: q("[data-gbround]")[0] ?? null,
    gbMse: q("[data-gbmse]")[0] ?? null,
  };
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
        // Interests: vertical scroll drives the horizontal track.
        if (E.hz) {
          const track = E.hz.querySelector<HTMLElement>("[data-hztrack]")!;
          if (rm || vw < 768) track.style.transform = "none";
          else {
            const r = E.hz.getBoundingClientRect();
            const p = cl(-r.top / Math.max(1, r.height - vh));
            track.style.transform = `translate3d(${(-p * Math.max(0, track.scrollWidth - vw)).toFixed(1)}px,0,0)`;
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

      // Skills orbit: golden-angle spacing, 6deg/s plus scroll.
      if (E.orbit && E.chips.length) {
        const OW = E.orbit.offsetWidth;
        const OH = E.orbit.offsetHeight;
        const tt = rm ? 0 : t;
        const spin = rm ? 0 : (((t / 1000) * ORBIT_SPEED * Math.PI) / 180) + sy * 0.0012;
        E.chips.forEach((ch, i) => {
          const a = i * 2.39996 + spin;
          const z = Math.sin(a);
          const d = (z + 1) / 2;
          const side = i % 2 ? 1 : -1;
          const x = Math.cos(a) * OW * (0.24 + (0.13 * ((i * 7) % 5)) / 4);
          const y = side * (0.23 + (0.2 * Math.floor(i / 2)) / 6) * OH + Math.sin(tt / 3100 + i * 1.7) * 10;
          const rx = Math.sin(tt / 2600 + i) * 24 + side * -10;
          const ry = -Math.cos(a) * 38;
          const rz = Math.sin(tt / 3400 + i * 2) * 12 + ((i % 3) - 1) * 10;
          ch.style.transform = `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${(0.76 + 0.28 * d).toFixed(3)}) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg) rotateZ(${rz.toFixed(1)}deg)`;
          ch.style.opacity = (0.55 + 0.45 * d).toFixed(3);
          ch.style.zIndex = z > 0 ? "3" : "1";
        });
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
