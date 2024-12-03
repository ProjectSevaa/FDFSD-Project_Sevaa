import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.fallback = { fs: false }; // Ensure no Node.js modules are required
    return config;
  },
};

export default nextConfig;
