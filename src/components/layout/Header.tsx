"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { site } from "@/content/site";

export type Tab = "work" | "about";

type Props = { tab: Tab; onSelect: (e: MouseEvent<HTMLElement>, tab: Tab) => void };

export function Header({ tab, onSelect }: Props) {
  const ref = useRef<HTMLElement>(null);

  // Toggle the header band once the page leaves the very top. Set as an attribute, not state,
  // so scrolling never re-renders React.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => el.toggleAttribute("data-scrolled", window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header ref={ref} className="site-header">
      {/* Moves focus past the nav without touching the #work/#about hash. */}
      <a
        href="#top"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("top")?.focus();
        }}
      >
        Skip to content
      </a>
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
