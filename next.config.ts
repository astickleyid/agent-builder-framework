import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/agent-builder-framework' : '',
  // Disable API routes for static export
  trailingSlash: true,
};

export default nextConfig;
