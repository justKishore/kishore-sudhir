"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { site } from "@/content/site";
import { prefersReducedMotion } from "@/components/motion/useReducedMotion";
import type { ViewId } from "./Header";

export type Wipe = { id: number; to: ViewId; x: number; y: number };

type Props = {
  wipe: Wipe | null;
  /** Called once the overlay fully covers the page: swap the view here. */
  onCovered: (to: ViewId) => void;
  onDone: () => void;
};

/**
 * Navy circle grows from the click point (.8s), showing the destination name
 * in giant italic. The view swaps underneath, then the overlay fades out (.55s).
 * Reduced motion: a short cross-fade instead.
 */
export function TabWipe({ wipe, onCovered, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!wipe || !el) return;

      const label = site.views.find((v) => v.id === wipe.to)?.wipe ?? "";
      el.querySelector("[data-wipe-word]")!.textContent = label;

      const tl = gsap.timeline({ onComplete: onDone });

      if (prefersReducedMotion()) {
        tl.set(el, { visibility: "visible", clipPath: "none", opacity: 0 })
          .to(el, { opacity: 1, duration: 0.2, ease: "none" })
          .add(() => onCovered(wipe.to))
          .to(el, { opacity: 0, duration: 0.2, ease: "none" })
          .set(el, { visibility: "hidden" });
        return;
      }

      const { innerWidth: w, innerHeight: h } = window;
      const r = Math.hypot(Math.max(wipe.x, w - wipe.x), Math.max(wipe.y, h - wipe.y));
      const at = `at ${wipe.x}px ${wipe.y}px`;

      tl.set(el, { visibility: "visible", opacity: 1, clipPath: `circle(0px ${at})` })
        .to(el, { clipPath: `circle(${r}px ${at})`, duration: 0.8, ease: EASE.wipe })
        .add(() => onCovered(wipe.to))
        .to(el, { opacity: 0, duration: 0.55, ease: "power2.out" }, "+=0.12")
        .set(el, { visibility: "hidden", clipPath: "none" });
    },
    { dependencies: [wipe?.id], scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="invisible fixed inset-0 z-[60] flex items-center justify-center bg-navy"
    >
      <span
        data-wipe-word
        className="font-display gutter text-display leading-none italic tracking-[-0.02em] text-paper"
      />
    </div>
  );
}
