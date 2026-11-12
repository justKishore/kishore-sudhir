"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "./useReducedMotion";

type ScrollApi = {
  /** Jump or glide to a position. Falls back to native scroll when Lenis is off. */
  scrollTo: (
    target: number | string | HTMLElement,
    opts?: { immediate?: boolean },
  ) => void;
};

const ScrollContext = createContext<ScrollApi>({
  scrollTo: () => {},
});

export function useSmoothScroll() {
  return useContext(ScrollContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Reduced motion: no Lenis, native scroll, ScrollTrigger still reads it.
    if (reduced) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  const api = useMemo<ScrollApi>(
    () => ({
      scrollTo: (target, opts) => {
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(target, { immediate: opts?.immediate, force: true });
          return;
        }
        const behavior: ScrollBehavior = opts?.immediate ? "instant" : "smooth";
        if (typeof target === "number")
          window.scrollTo({ top: target, behavior });
        else {
          const el =
            typeof target === "string"
              ? document.querySelector(target)
              : target;
          el?.scrollIntoView({ behavior });
        }
      },
    }),
    [],
  );

  return (
    <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>
  );
}
