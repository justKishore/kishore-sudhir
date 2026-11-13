import { Fragment } from "react";

/** Renders `*word*` from content.json as italic gradient emphasis. */
export function Emph({ text, className = "emph" }: { text: string; className?: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/).map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <em key={i} className={className}>
            {part.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
