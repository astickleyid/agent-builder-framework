import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "stick.ai - Enterprise AI Agent Orchestration Framework",
  description: "Build, deploy, and scale specialized AI agents with the most advanced local-first orchestration framework. Enterprise-grade tooling for developers.",
  keywords: ["AI agents", "agent framework", "AI orchestration", "local AI", "enterprise AI", "agent development", "AI tools", "developer tools"],
  authors: [{ name: "stick.ai" }],
  openGraph: {
    title: "stick.ai - Enterprise AI Agent Orchestration",
    description: "The most advanced local-first framework for building and deploying AI agents. Built by developers, for developers.",
    url: "https://stick.ai",
    siteName: "stick.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "stick.ai - Enterprise AI Agent Orchestration",
    description: "Build, deploy, and scale specialized AI agents with enterprise-grade tooling.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
