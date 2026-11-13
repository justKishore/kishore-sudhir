import type { CSSProperties } from "react";
import { site, type Project } from "@/content/site";
import { Emph } from "@/components/Emph";

const projects = site.work.projects as Project[];
const total = String(projects.length).padStart(2, "0");
const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];

export function ProjectStack() {
  return (
    <section className="work" aria-labelledby="work-title">
      <div className="section-head">
        <h2 id="work-title" className="h2">
          <Emph text={site.work.projectsHeading} />
        </h2>
        <div className="label">{words[projects.length] ?? projects.length} projects</div>
      </div>
      <div className="cards">
        {projects.map((p, i) => (
          <article key={p.no} data-card="1" className="card" style={{ "--i": i } as CSSProperties}>
            <div className="card__media">
              <div className="card__img">
                {/* eslint-disable-next-line @next/next/no-img-element -- 12 KB webp, plain lazy img is enough */}
                <img src={p.img} alt="" width={960} height={720} loading="lazy" decoding="async" />
              </div>
            </div>
            <div className="card__body">
              <div className="card__top">
                <div className="card__no">
                  {p.no} / {total}
                </div>
                <h3 className="card__title">{p.title}</h3>
                <p className="card__summary">{p.summary}</p>
              </div>
              <div className="card__foot">
                <ul className="tags" aria-label="Tools and methods">
                  {p.tags.map((t) => (
                    <li key={t} className="tag">
                      {t}
                    </li>
                  ))}
                </ul>
                {p.link && (
                  <a className="card__link" href={p.link} target="_blank" rel="noreferrer">
                    Read the paper <span aria-hidden>↗</span>
                  </a>
                )}
              </div>
            </div>
            <div data-shade="1" className="card__shade" aria-hidden />
          </article>
        ))}
      </div>
    </section>
  );
}
