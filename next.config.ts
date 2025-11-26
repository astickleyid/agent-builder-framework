import type { NextConfig } from "next";

// Only use basePath for GitHub Pages, not Vercel
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  // Only export for GitHub Pages
  ...(isGitHubPages && { output: 'export' }),
  
  images: {
    unoptimized: true,
  },
  
  // Only add basePath for GitHub Pages
  basePath: isGitHubPages ? '/agent-builder-framework' : '',
  
  trailingSlash: true,
};

export default nextConfig;
