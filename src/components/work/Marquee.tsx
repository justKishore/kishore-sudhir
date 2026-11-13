import { site } from "@/content/site";

const rep = <T,>(a: T[]) => a.concat(a, a, a);

function Row({ items, dir, variant }: { items: string[]; dir: 1 | -1; variant: "solid" | "outline" }) {
  return (
    <div className="marquee__row">
      <div data-mq={dir} className="marquee__track">
        {rep(items).map((m, i) => (
          <span key={i} className={`marquee__item marquee__item--${variant}`}>
            {m}
            <span className="marquee__dot" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  const { marqueeRow1, marqueeRow2 } = site.work;
  return (
    <section className="marquee" aria-label="What I work on">
      <p className="sr-only">{[...marqueeRow1, ...marqueeRow2].join(", ")}</p>
      <div aria-hidden>
        <Row items={marqueeRow1} dir={1} variant="solid" />
      </div>
      <div aria-hidden>
        <Row items={marqueeRow2} dir={-1} variant="outline" />
      </div>
    </section>
  );
}
