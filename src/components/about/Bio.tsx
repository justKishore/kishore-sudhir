import { site } from "@/content/site";

const a = site.about;

export function Bio() {
  return (
    <section className="bio" aria-label="Bio">
      <div className="bio__text">
        {a.bio.map((p) => {
          // "Let's talk." at the end of a paragraph becomes a link to the contact section.
          const cue = "Let's talk.";
          if (!p.endsWith(cue)) return <p key={p}>{p}</p>;
          return (
            <p key={p}>
              {p.slice(0, -cue.length)}
              <a href="#contact">{cue}</a>
            </p>
          );
        })}
      </div>
      <dl className="facts">
        {a.facts.map((f) => (
          <div key={f.label} className={f.big ? "fact fact--big" : "fact"}>
            <dt className="label">{f.label}</dt>
            {f.big ? (
              <dd>
                <em className="emph">{f.value}</em>
                <span>{f.suffix}</span>
              </dd>
            ) : (
              <dd>{f.value}</dd>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}
