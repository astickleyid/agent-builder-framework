import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

// Use system font stack to avoid external font dependency issues

export const metadata: Metadata = {
  title: "stick.ai - Enterprise AI Agent Orchestration Framework | Build & Deploy Intelligent AI Agents",
  description: "Transform your business with stick.ai's enterprise-grade AI agent orchestration framework. Build, deploy, and scale intelligent AI agents with complete data sovereignty. Local-first architecture with zero cloud dependencies. Free open-source core.",
  keywords: [
    "AI agents",
    "agent framework", 
    "AI orchestration",
    "local AI",
    "enterprise AI",
    "agent development",
    "AI automation",
    "multi-agent systems",
    "LLM orchestration",
    "OpenAI agents",
    "Anthropic Claude agents",
    "local-first AI",
    "self-hosted AI",
    "intelligent agents",
    "agent builder",
    "AI workflow automation",
    "developer tools",
    "TypeScript AI framework",
    "Node.js AI agents"
  ],
  authors: [{ name: "stick.ai", url: "https://stick.ai" }],
  creator: "stick.ai",
  publisher: "stick.ai",
  openGraph: {
    title: "stick.ai - Build & Deploy Enterprise AI Agents | Local-First Orchestration",
    description: "The most advanced local-first framework for building and deploying intelligent AI agents. Zero cloud dependencies, complete data sovereignty, enterprise-grade security. Start free.",
    url: "https://stick.ai",
    siteName: "stick.ai",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@stickai",
    title: "stick.ai - Enterprise AI Agent Orchestration Framework",
    description: "Build, deploy, and scale intelligent AI agents with enterprise-grade tooling. Local-first architecture with complete data sovereignty.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
