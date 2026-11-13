"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { Emph } from "@/components/Emph";
import { GB_ROUNDS } from "@/lib/gradientBoosting";

const g = site.about.gradientBoosting;

/** Paths, round and MSE are written by the scene loop (useScene). */
export function GradientBoosting() {
  const wrap = useRef<HTMLElement>(null);
  const next = () => {
    const el = wrap.current;
    if (!el) return;
    const s = +(el.dataset.step ?? GB_ROUNDS);
    el.dataset.step = String(s >= GB_ROUNDS ? 0 : s + 1);
  };
  return (
    <section ref={wrap} className="gb-outer" data-gbwrap="1" data-step={GB_ROUNDS} aria-labelledby="gb-title">
      <div className="gb-sticky">
        <div className="gb-panel">
          <div className="gb-head">
            <div className="gb-intro">
              <div className="label">{g.label}</div>
              <h2 id="gb-title">
                <Emph text={g.heading} />
              </h2>
              <p>{g.sub}</p>
            </div>
            <div className="gb-stats" aria-live="polite">
              <span>
                Round <span data-gbround="1">0</span> of {GB_ROUNDS}
              </span>
              <span className="gb-mse">
                MSE <span data-gbmse="1" />
              </span>
              <button type="button" className="gb-tap" onClick={next}>
                Next round
              </button>
            </div>
          </div>
          <svg viewBox="0 0 600 300" role="img" aria-label="A model fitting a curve more closely each round" className="gb-svg">
            <line x1="20" y1="150" x2="580" y2="150" className="gb-axis" />
            <path data-gbt="1" className="gb-target" />
            <path data-gbp="1" className="gb-model" />
          </svg>
          <div className="gb-foot">
            <span>{g.caption}</span>
            <span className="gb-legend">{g.legend}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
