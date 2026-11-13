"use client";

import type { MouseEvent } from "react";
import { site } from "@/content/site";

export type Tab = "work" | "about";

type Props = { tab: Tab; onSelect: (e: MouseEvent<HTMLElement>, tab: Tab) => void };

export function Header({ tab, onSelect }: Props) {
  return (
    <header className="site-header">
      <a href="#work" className="brand" onClick={(e) => onSelect(e, "work")}>
        {site.site.name}
      </a>
      <nav className="pill-nav" aria-label="Views">
        {site.nav.map((label) => {
          const id = label.toLowerCase() as Tab;
          return (
            <button
              key={id}
              type="button"
              aria-current={tab === id ? "page" : undefined}
              onClick={(e) => onSelect(e, id)}
            >
              {label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
