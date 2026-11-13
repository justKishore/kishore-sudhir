import { site, showPlaceholders } from "@/content/site";
import { Emph } from "@/components/Emph";

const a = site.about;
const total = String(a.interests.length).padStart(2, "0");

export function Interests() {
  return (
    <section className="hz-outer" data-hz="1" aria-labelledby="interests-title">
      <div className="hz-sticky">
        <div data-drift="1" className="drift drift--1" aria-hidden />
        <div data-drift="2" className="drift drift--2" aria-hidden />
        <h2 id="interests-title" className="h2">
          <Emph text={a.interestsHeading} />
        </h2>
        <div className="hz-track" data-hztrack="1">
          {a.interests.map((g) => (
            <article key={g.no} className="hz-card interest">
              <span className="card__no">
                {g.no} / {total}
              </span>
              <div className="interest__body">
                <h3>{g.title}</h3>
                <p>{showPlaceholders(g.text)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
