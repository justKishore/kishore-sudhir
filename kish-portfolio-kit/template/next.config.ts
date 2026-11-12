import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // three.js ships untranspiled add-ons; R3F docs recommend this
  transpilePackages: ["three"],
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
