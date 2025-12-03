import type { NextConfig } from "next";

// Only use basePath for GitHub Pages, not Vercel
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  // Only export for GitHub Pages (not when we have API routes)
  ...(isGitHubPages && { output: 'export' }),
  
  images: {
    unoptimized: true,
  },
  
  // Only add basePath for GitHub Pages
  basePath: isGitHubPages ? '/agent-builder-framework' : '',
  
  trailingSlash: true,

  // Mark server-only packages as external
  serverExternalPackages: ['@stick-ai/runtime', 'express', 'axios'],

  experimental: {
    // Allow dynamic imports of server-only modules
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
