import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // From create-next-app (Next 16): Tailwind v4 runs as a Turbopack CSS loader
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // From the kit: three.js ships untranspiled add-ons; R3F docs recommend this
  transpilePackages: ["three"],
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
