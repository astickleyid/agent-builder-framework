import { NextRequest, NextResponse } from 'next/server';
import { getAgentManager } from '@/lib/agent-manager';
import { randomBytes } from 'crypto';

// GET /api/agents - List all agents
export async function GET() {
  try {
    const manager = getAgentManager();
    const agents = await manager.listAgents();
    return NextResponse.json({ agents });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/agents - Create/save a new agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.provider || !body.model) {
      return NextResponse.json(
        { error: 'Missing required fields: name, provider, model' },
        { status: 400 }
      );
    }

    const manager = getAgentManager();
    
    // Generate ID if not provided
    const config = {
      id: body.id || randomBytes(16).toString('hex'),
      name: body.name,
      description: body.description || '',
      provider: body.provider,
      model: body.model,
      tools: body.tools || [],
      instructions: body.instructions || 'You are a helpful AI assistant.',
      temperature: body.temperature || 0.7,
      maxTokens: body.maxTokens || 2000,
      capabilities: body.capabilities || ['chat'],
      mcpServers: body.mcpServers || []
    };

    await manager.saveAgent(config);

    return NextResponse.json({ 
      success: true,
      agent: config
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
