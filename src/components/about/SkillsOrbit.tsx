import { site, iconSrc } from "@/content/site";

const s = site.about.skills;
// Three copies of every chip so the vortex fills the screen on desktop; the third set hides under 820px.
const SETS = [0, 1, 2];

/** Chips orbit the centre at different depths, after cosmos.so (positions set by useScene). */
export function SkillsOrbit() {
  return (
    <section className="skills" aria-labelledby="skills-title">
      <div data-orbit="1" className="orbit">
        <div className="orbit__center">
          <div className="label">{s.label}</div>
          <h2 id="skills-title" className="orbit__title">
            {s.heading}
          </h2>
        </div>
        <div className="orbit__list" aria-hidden>
          {SETS.map((set) =>
            s.items.map((k) => (
              <div key={`${set}-${k.name}`} data-chip="1" data-set={set} className="chip">
                <span className="chip__mark">
                  <span>{k.abbr}</span>
                  <span data-ico={iconSrc(k.icon)} className="chip__ico" />
                </span>
                {k.name !== k.abbr && <span className="chip__label">{k.name}</span>}
              </div>
            )),
          )}
        </div>
      </div>
      {/* The same skills as plain text, so they can be read and scanned without chasing the vortex. */}
      <ul className="skills__list">
        {s.items.map((k) => (
          <li key={k.name}>{k.name}</li>
        ))}
      </ul>
    </section>
  );
}
