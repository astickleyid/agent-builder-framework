import { NextResponse } from 'next/server';
import { IntelligentAgent } from '../../../packages/runtime/dist/index.js';
import fs from 'fs/promises';
import path from 'path';

// In-memory agent registry (in production, use a database)
const agents = new Map<string, any>();

// Load agents from config directory
async function loadAgents() {
  try {
    const configPath = path.join(process.cwd(), 'packages/cli/test-agent');
    const files = await fs.readdir(configPath);
    
    for (const file of files) {
      if (file.endsWith('.json') && !file.includes('package')) {
        const filePath = path.join(configPath, file);
        const config = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        
        if (config.name && config.llm) {
          agents.set(config.name, {
            name: config.name,
            description: config.description,
            capabilities: config.capabilities || [],
            tools: config.tools || [],
            provider: config.llm.provider,
            model: config.llm.model
          });
        }
      }
    }
  } catch (error) {
    console.error('Failed to load agents:', error);
  }
}

// Load agents on startup
loadAgents();

// GET /api/agents - List all agents
export async function GET() {
  const agentList = Array.from(agents.values());
  
  return NextResponse.json({
    success: true,
    agents: agentList,
    count: agentList.length
  });
}

// POST /api/agents - Create new agent
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, tools, provider, model, instructions } = body;

    if (!name || !provider || !model) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create agent config
    const agentConfig = {
      name,
      version: '1.0.0',
      description: description || 'Custom agent',
      capabilities: ['chat', 'reasoning'],
      tools: tools || ['datetime', 'text'],
      instructions: instructions || 'You are a helpful AI assistant.',
      environment: {
        maxTokens: 2000,
        temperature: 0.7
      }
    };

    // Save to registry
    agents.set(name, {
      name,
      description,
      capabilities: agentConfig.capabilities,
      tools: agentConfig.tools,
      provider,
      model
    });

    return NextResponse.json({
      success: true,
      agent: agents.get(name),
      message: 'Agent created successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
