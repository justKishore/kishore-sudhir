import type { MouseEvent } from "react";
import { site, isPlaceholderHref } from "@/content/site";
import { Emph } from "@/components/Emph";

const c = site.contact;

/** For a mailto: link, the address itself, so visitors can read and copy it. */
const emailOf = (href: string) => (href.startsWith("mailto:") ? href.slice(7).split("?")[0] : null);

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
            {c.links.map((l) => {
              // Until Kish supplies the URL, show the row as text rather than a link that goes nowhere.
              if (isPlaceholderHref(l.href))
                return (
                  <li key={l.label}>
                    <span className="contact__link contact__link--pending">
                      <span className="contact__label">{l.label}</span>
                      <span className="placeholder-note">[Placeholder: link]</span>
                    </span>
                  </li>
                );
              const email = emailOf(l.href);
              return (
                <li key={l.label}>
                  <a className="contact__link" href={l.href}>
                    <span className="contact__label">
                      {l.label}
                      {email && <span className="contact__email">{email}</span>}
                    </span>
                    <span className="contact__arrow" aria-hidden>
                      ↗
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <footer className="footer">
        {c.footer.map((l) =>
          isPlaceholderHref(l.href) ? (
            <span key={l.label} className="footer__pending">{`[Placeholder: ${l.label}]`}</span>
          ) : (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ),
        )}
        <a href="#top" className="to-top" onClick={onTop}>
          Back to top <span aria-hidden>↑</span>
        </a>
      </footer>
    </section>
  );
}
