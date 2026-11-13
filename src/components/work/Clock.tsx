"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

const fmt = new Intl.DateTimeFormat("en-AU", {
  timeZone: site.site.timezone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** Live Melbourne time. Isolated so the per-second tick only re-renders this. */
export function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="clock">
      <span className="clock__city">{site.work.hero.clockLabel}</span>
      <time className="clock__time" suppressHydrationWarning>
        {time || "--:--:--"}
      </time>
    </div>
  );
}
