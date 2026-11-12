"use client";

import type { MouseEvent } from "react";
import { site } from "@/content/site";

export type ViewId = (typeof site.views)[number]["id"];

type Props = {
  view: ViewId;
  onSelect: (to: ViewId, point: { x: number; y: number }) => void;
};

/** Click point for the wipe. Keyboard activation (detail 0) uses the control's centre. */
function pointFrom(e: MouseEvent<HTMLElement>) {
  if (e.detail > 0) return { x: e.clientX, y: e.clientY };
  const r = e.currentTarget.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

export function Header({ view, onSelect }: Props) {
  const activeIndex = site.views.findIndex((v) => v.id === view);

  const go = (to: ViewId) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onSelect(to, pointFrom(e));
  };

  return (
    <header className="gutter fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 py-4 md:py-5">
      <a
        href="#work"
        onClick={go("work")}
        className="font-display flex min-h-11 items-center text-[22px] leading-none italic text-paper no-underline"
      >
        {site.name}
      </a>

      <nav aria-label="Views">
        <div className="relative grid grid-cols-2 rounded-full border border-[rgba(238,244,237,0.22)] bg-[rgba(11,37,69,0.55)] p-1 backdrop-blur-[14px]">
          {/* Active pill slides between the two equal-width slots */}
          <span
            aria-hidden
            className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-paper transition-transform duration-[360ms] ease-[cubic-bezier(.77,0,.175,1)] motion-reduce:transition-none"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
          {site.views.map((v) => {
            const active = v.id === view;
            return (
              <a
                key={v.id}
                href={`#${v.id}`}
                onClick={go(v.id)}
                aria-current={active ? "page" : undefined}
                className={[
                  "relative z-10 flex min-h-11 min-w-[84px] items-center justify-center rounded-full px-5 text-[15px] font-medium no-underline",
                  "transition-[color,transform] duration-200 ease-out active:scale-[0.97]",
                  active ? "text-night" : "text-secondary-text hover:text-paper",
                ].join(" ")}
              >
                {v.label}
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
