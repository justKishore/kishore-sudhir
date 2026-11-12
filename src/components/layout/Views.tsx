"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { site } from "@/content/site";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { Header, type ViewId } from "./Header";
import { TabWipe, type Wipe } from "./TabWipe";
import { WorkView } from "@/components/work/WorkView";
import { AboutView } from "@/components/about/AboutView";

const isView = (s: string): s is ViewId => site.views.some((v) => v.id === s);
const hashView = () => {
  const h = window.location.hash.slice(1);
  return isView(h) ? h : null;
};

/** Work/About tab state, mirrored in the URL hash (#work, #about). */
export function Views() {
  const [view, setView] = useState<ViewId>("work");
  const [wipe, setWipe] = useState<Wipe | null>(null);
  const busy = useRef(false);
  const mainRef = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();

  // Load the hash on mount (no wipe on first paint).
  useEffect(() => {
    const initial = hashView();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hash is only readable after mount
    if (initial) setView(initial);
  }, []);

  const select = useCallback(
    (to: ViewId, point: { x: number; y: number }, push = true) => {
      if (busy.current) return;
      if (to === view) {
        scrollTo(0);
        return;
      }
      busy.current = true;
      if (push) history.pushState(null, "", `#${to}`);
      setWipe({ id: Date.now(), to, ...point });
    },
    [view, scrollTo],
  );

  // Back/forward between #work and #about: wipe from the centre.
  useEffect(() => {
    const onPop = () => {
      const to = hashView();
      if (to) select(to, { x: window.innerWidth / 2, y: window.innerHeight / 2 }, false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [select]);

  const onCovered = useCallback(
    (to: ViewId) => {
      setView(to);
      scrollTo(0, { immediate: true });
      // Let the new view mount, then re-measure triggers and move focus to it.
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        mainRef.current?.focus({ preventScroll: true });
      });
    },
    [scrollTo],
  );

  const onDone = useCallback(() => {
    busy.current = false;
    setWipe(null);
  }, []);

  return (
    <>
      <Header view={view} onSelect={select} />
      <main ref={mainRef} tabIndex={-1} className="outline-none">
        {view === "work" ? <WorkView /> : <AboutView />}
      </main>
      <TabWipe wipe={wipe} onCovered={onCovered} onDone={onDone} />
    </>
  );
}
