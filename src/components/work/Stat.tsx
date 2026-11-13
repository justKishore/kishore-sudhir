import { site } from "@/content/site";

const s = site.work.stat;

export function Stat() {
  return (
    <section data-stat="1" className="stat" aria-label="Result">
      <div className="stat__group">
        <div className="label">{s.beforeLabel}</div>
        <div className="stat__big stat__before">
          <s style={{ textDecoration: "none" }}>{s.before}</s>
          <span data-strike="1" className="stat__strike" aria-hidden />
        </div>
      </div>
      <div data-same="1" className="stat__same">
        <div className="stat__group">
          <div className="label">{s.afterLabel}</div>
          <div className="stat__big stat__after">{s.after}</div>
        </div>
        <div className="stat__body">
          {s.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <a href={s.cta.href} className="cta">
          {s.cta.label} <span className="mono" aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
