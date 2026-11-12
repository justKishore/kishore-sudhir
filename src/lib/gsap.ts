"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

// Register once for the whole app.
gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);

// Spec curves, available by name in every tween.
export const EASE = {
  reveal: CustomEase.create("reveal", ".2,.7,.1,1"),
  wipe: CustomEase.create("wipe", ".65,0,.2,1"),
};

export { gsap, ScrollTrigger, useGSAP };
