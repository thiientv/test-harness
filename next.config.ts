import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  reactStrictMode: true,
  // We can add canvas loaders or disable some rules if needed
};

export default nextConfig;
