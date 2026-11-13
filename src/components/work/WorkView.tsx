import { Hero } from "./Hero";
import { Marquee } from "./Marquee";
import { Statement } from "./Statement";
import { Stat } from "./Stat";
import { ProjectStack } from "./ProjectStack";

export function WorkView() {
  return (
    <>
      <Hero />
      <div className="view-body">
        <Marquee />
        <Statement />
        <Stat />
        <ProjectStack />
      </div>
    </>
  );
}
