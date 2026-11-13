import { AboutHero } from "./AboutHero";
import { Bio } from "./Bio";
import { GradientBoosting } from "./GradientBoosting";
import { SkillsOrbit } from "./SkillsOrbit";
import { Interests } from "./Interests";

export function AboutView() {
  return (
    <>
      <AboutHero />
      <div className="view-body view-body--about">
        <Bio />
        <GradientBoosting />
        <SkillsOrbit />
        <Interests />
      </div>
    </>
  );
}
