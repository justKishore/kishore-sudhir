"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { Header, type Tab } from "@/components/layout/Header";
import { Contact } from "@/components/layout/Contact";
import { WorkView } from "@/components/work/WorkView";
import { AboutView } from "@/components/about/AboutView";
import { useScene } from "@/components/motion/useScene";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Click point for the wipe; keyboard activation (detail 0) uses the control's centre. */
function origin(e: MouseEvent<HTMLElement> | null) {
  if (!e) return { x: window.innerWidth / 2, y: 40 };
  if (e.detail > 0) return { x: e.clientX, y: e.clientY };
  const r = e.currentTarget.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

export function Site() {
  const [tab, setTab] = useState<Tab>("work");
  const [wipeWord, setWipeWord] = useState("Work.");
  const wipe = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLElement>(null);
  const wiping = useRef(false);
  const scene = useScene(tab);

  // #about opens the About view directly (no wipe on first paint).
  useEffect(() => {
    if (window.location.hash.includes("about")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the hash is only readable after mount
      setTab("about");
      setWipeWord("About.");
    }
  }, []);

  const toTop = useCallback((e?: MouseEvent<HTMLElement>) => {
    e?.preventDefault();
    window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" });
  }, []);

  // Full-screen circle grows from the click point (.8s), view swaps underneath,
  // then the overlay fades out (.55s). Reduced motion: a short cross-fade.
  const switchTab = useCallback(
    (e: MouseEvent<HTMLElement>, to: Tab) => {
      e.preventDefault();
      if (to === tab) return toTop();
      const ov = wipe.current;
      if (wiping.current || !ov) return;
      const rm = reduced();
      const { x, y } = origin(e);
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 20;
      const clip = (v: string) => {
        ov.style.setProperty("-webkit-clip-path", v);
        ov.style.clipPath = v;
      };
      wiping.current = true;
      setWipeWord(to === "work" ? "Work." : "About.");
      ov.style.transition = "none";
      if (rm) {
        clip("none");
        ov.style.opacity = "0";
        void ov.offsetWidth;
        ov.style.transition = "opacity .25s";
        ov.style.opacity = "1";
      } else {
        ov.style.opacity = "1";
        clip(`circle(0px at ${x}px ${y}px)`);
        void ov.offsetWidth;
        ov.style.transition = "clip-path .8s cubic-bezier(.65,0,.2,1), -webkit-clip-path .8s cubic-bezier(.65,0,.2,1)";
        clip(`circle(${r}px at ${x}px ${y}px)`);
      }
      setTimeout(
        () => {
          setTab(to);
          window.scrollTo(0, 0);
          scene.current.restartHero(250);
          try {
            history.replaceState(null, "", `#${to}`);
          } catch {}
          requestAnimationFrame(() => main.current?.focus({ preventScroll: true }));
          setTimeout(
            () => {
              ov.style.transition = "opacity .55s ease";
              ov.style.opacity = "0";
              setTimeout(() => {
                ov.style.transition = "none";
                clip("circle(0px at 50% 50%)");
                wiping.current = false;
              }, 580);
            },
            rm ? 150 : 380,
          );
        },
        rm ? 270 : 820,
      );
    },
    [tab, toTop, scene],
  );

  return (
    <>
      <Header tab={tab} onSelect={switchTab} />
      <main ref={main} id="top" tabIndex={-1} aria-label={tab === "work" ? "Work" : "About"}>
        {tab === "work" ? <WorkView key="work" /> : <AboutView key="about" />}
      </main>
      <Contact onTop={toTop} />
      <div ref={wipe} className="wipe" aria-hidden>
        <span>{wipeWord}</span>
      </div>
    </>
  );
}
