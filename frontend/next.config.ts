/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/HeroMove-CZ",
  assetPrefix: "/HeroMove-CZ/",
};

module.exports = nextConfig;