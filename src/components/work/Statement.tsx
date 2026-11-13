import { site } from "@/content/site";

const s = site.work.statement;

export function Statement() {
  return (
    <section className="statement" aria-labelledby="statement-label">
      <div id="statement-label" className="label">
        {s.label}
      </div>
      <p data-words="1" className="statement__text">
        {s.text.split(" ").map((w, i) => (
          <span key={i} data-word="1" className="statement__word">
            {w}
          </span>
        ))}
      </p>
    </section>
  );
}
