import type { MouseEvent } from "react";
import { site, isPlaceholderHref } from "@/content/site";
import { Emph } from "@/components/Emph";

const c = site.contact;
const href = (h: string) => (isPlaceholderHref(h) ? "#" : h);

export function Contact({ onTop }: { onTop: (e: MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact__bg" aria-hidden />
      <div className="contact__overlay" aria-hidden />
      <div className="contact__inner">
        <h2 id="contact-title">
          <Emph text={c.heading} />
        </h2>
        <div className="contact__links">
          <div className="label">{c.label}</div>
          <ul className="contact__list">
            {c.links.map((l) => (
              <li key={l.label}>
                <a className="contact__link" href={href(l.href)}>
                  <span className="contact__label">{l.label}</span> <span className="contact__arrow" aria-hidden>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <footer className="footer">
        {c.footer.map((l) => (
          <a key={l.label} href={href(l.href)}>
            {isPlaceholderHref(l.href) ? `[Placeholder: ${l.label}]` : l.label}
          </a>
        ))}
        <a href="#top" className="to-top" onClick={onTop}>
          Back to top <span aria-hidden>↑</span>
        </a>
      </footer>
    </section>
  );
}
