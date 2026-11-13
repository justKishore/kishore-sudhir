import { site, showPlaceholders } from "@/content/site";
import { Emph } from "@/components/Emph";
import { Clock } from "./Clock";

const h = site.work.hero;

export function Hero() {
  return (
    <section data-hero="1" className="hero hero--work" aria-label="Introduction">
      <div data-par="1" className="hero__par" aria-hidden />
      <div className="hero__overlay" aria-hidden />
      <div data-dark="1" className="hero__dark" aria-hidden />
      <div data-herotext="1" className="hero__text">
        <h1 className="hero__title">
          {h.headline.map((line, i) => (
            <span key={i} className="line-mask">
              <span data-reveal={i}>
                <Emph text={line} className="emph emph--hero" />
              </span>
            </span>
          ))}
        </h1>
        <div className="placeholder-note hero__note">{showPlaceholders(h.headlineNote)}</div>
        <div data-reveal="3" className="hero__meta">
          <div className="status">
            <div className="status__title">
              <span className="dot" aria-hidden>
                <span data-pulse="1" className="dot__pulse" />
                <span />
              </span>
              <span>{h.status.title}</span>
            </div>
            <div className="status__text">{h.status.text}</div>
          </div>
          <Clock />
        </div>
      </div>
      <div className="scroll-cue" aria-hidden>
        <span>Scroll</span>
        <span className="scroll-cue__track">
          <span data-cue="1" className="scroll-cue__bar" />
        </span>
      </div>
    </section>
  );
}
