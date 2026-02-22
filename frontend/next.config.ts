import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/HeroMove-CZ",   // repo name
  assetPrefix: "/HeroMove-CZ/",
};

export default nextConfig;