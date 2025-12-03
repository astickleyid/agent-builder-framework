import { NextRequest, NextResponse } from 'next/server';
import { getAgentManager } from '@/lib/agent-manager';

// POST /api/agents/[id]/test - Test agent with input
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (!body.input) {
      return NextResponse.json(
        { error: 'Input required' },
        { status: 400 }
      );
    }

    const manager = getAgentManager();
    const result = await manager.testAgent(id, body.input);

    return NextResponse.json({ 
      success: true,
      result
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
