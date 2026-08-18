import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      loaders: {
        css: {
          postcss: true,
        },
      },
    },
  },
};

export default nextConfig;
