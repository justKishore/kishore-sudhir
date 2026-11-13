import { site, iconSrc } from "@/content/site";

const s = site.about.skills;

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
        <ul className="orbit__list">
          {s.items.map((k) => (
            <li key={k.name} data-chip="1" className="chip">
              <span className="chip__mark" aria-hidden>
                <span>{k.abbr}</span>
                <span data-ico={iconSrc(k.icon)} className="chip__ico" />
              </span>
              <span className="chip__label">
                {k.name === k.abbr ? <span className="sr-only">{k.name}</span> : k.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
