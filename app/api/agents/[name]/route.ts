import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// GET /api/agents/[name] - Get specific agent
export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const agentName = params.name;
    const configPath = path.join(
      process.cwd(),
      'packages/cli/test-agent',
      `${agentName}.json`
    );

    try {
      const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
      
      return NextResponse.json({
        success: true,
        agent: {
          name: config.name,
          description: config.description,
          capabilities: config.capabilities,
          tools: config.tools,
          provider: config.llm?.provider,
          model: config.llm?.model,
          instructions: config.instructions
        }
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/agents/[name] - Delete agent
export async function DELETE(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const agentName = params.name;
    const configPath = path.join(
      process.cwd(),
      'packages/cli/test-agent',
      `${agentName}.json`
    );

    await fs.unlink(configPath);

    return NextResponse.json({
      success: true,
      message: `Agent ${agentName} deleted`
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
