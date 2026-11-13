// All copy lives in content.json (from the design kit). Components read it through here.
// `*word*` marks italic gradient emphasis. "PLACEHOLDER" marks text Kish still has to supply.
import content from "./content.json";

export const site = content;

export type Project = (typeof content.work.projects)[number] & { link?: string };
export type Skill = (typeof content.about.skills.items)[number];

const PH = "PLACEHOLDER";

/** "PLACEHOLDER: x" renders as "[Placeholder: x]" so it stays visible on the page. */
export function showPlaceholders(text: string) {
  return text.replace(/PLACEHOLDER:\s*([^.\n]*)/g, "[Placeholder: $1]");
}

export const isPlaceholderHref = (href: string) => href === PH;

/** Local copy of the Simple Icons SVG (downloaded into public/icons). */
export const iconSrc = (icon: string | null) => (icon ? `/icons/${icon.split("/").pop()}.svg` : "");
