'use client';

import Link from 'next/link';

const documentation = [
  {
    category: 'Getting Started',
    icon: '🚀',
    docs: [
      { title: 'Quick Start', slug: 'quick-start', description: 'Get up and running in 5 minutes' },
      { title: 'Installation', slug: 'installation', description: 'Install the framework and CLI' },
      { title: 'Your First Agent', slug: 'first-agent', description: 'Build your first AI agent' },
      { title: 'Configuration', slug: 'configuration', description: 'Configure agents and settings' }
    ]
  },
  {
    category: 'Core Concepts',
    icon: '🧠',
    docs: [
      { title: 'Agents', slug: 'agents', description: 'Understanding AI agents' },
      { title: 'Tools', slug: 'tools', description: '17 built-in tools explained' },
      { title: 'LLM Providers', slug: 'llm-providers', description: 'OpenAI, Anthropic, Ollama' },
      { title: 'Memory System', slug: 'memory', description: 'Persistent and vector memory' }
    ]
  },
  {
    category: 'Advanced',
    icon: '⚡',
    docs: [
      { title: 'Multi-Agent Systems', slug: 'multi-agent', description: 'Orchestrate multiple agents' },
      { title: 'MCP Integration', slug: 'mcp', description: 'Model Context Protocol servers' },
      { title: 'Security', slug: 'security', description: 'Sandboxing and rate limiting' },
      { title: 'Deployment', slug: 'deployment', description: 'Deploy to production' }
    ]
  },
  {
    category: 'API Reference',
    icon: '📚',
    docs: [
      { title: 'REST API', slug: 'api-reference', description: 'Complete API documentation' },
      { title: 'CLI Commands', slug: 'cli', description: 'Command line interface' },
      { title: 'SDK Reference', slug: 'sdk', description: 'TypeScript/JavaScript SDK' },
      { title: 'Configuration Schema', slug: 'schema', description: 'JSON configuration reference' }
    ]
  },
  {
    category: 'Guides',
    icon: '📖',
    docs: [
      { title: 'Building a Chatbot', slug: 'guide-chatbot', description: 'Create a conversational agent' },
      { title: 'Research Pipeline', slug: 'guide-research', description: 'Multi-agent research system' },
      { title: 'Code Review Bot', slug: 'guide-code-review', description: 'Automated code reviewer' },
      { title: 'Docker Deployment', slug: 'guide-docker', description: 'Deploy with Docker' }
    ]
  }
];

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Everything you need to build amazing AI agents
          </p>

          {/* Search */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full max-w-2xl px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid gap-8">
          {documentation.map((section) => (
            <div key={section.category} className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{section.icon}</span>
                <h2 className="text-2xl font-bold text-gray-800">{section.category}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.docs.map((doc) => (
                  <Link
                    key={doc.slug}
                    href={`/docs/${doc.slug}`}
                    className="group p-6 border-2 border-gray-100 rounded-xl hover:border-purple-500 hover:shadow-md transition-all"
                  >
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-gray-600 mt-2 text-sm">{doc.description}</p>
                    <div className="flex items-center gap-2 mt-4 text-purple-600 text-sm font-medium">
                      <span>Read more</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-blue-100 mb-4">Join our Discord community</p>
            <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50">
              Join Discord
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="text-3xl mb-3">💻</div>
            <h3 className="text-xl font-bold mb-2">GitHub</h3>
            <p className="text-purple-100 mb-4">View source code and contribute</p>
            <button className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50">
              View on GitHub
            </button>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white">
            <div className="text-3xl mb-3">🎓</div>
            <h3 className="text-xl font-bold mb-2">Examples</h3>
            <p className="text-pink-100 mb-4">Explore example projects</p>
            <button className="px-4 py-2 bg-white text-pink-600 rounded-lg font-medium hover:bg-pink-50">
              Browse Examples
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
