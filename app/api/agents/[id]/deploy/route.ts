import { NextRequest, NextResponse } from 'next/server';
import { getAgentManager } from '@/lib/agent-manager';

// POST /api/agents/[id]/deploy - Deploy agent
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const manager = getAgentManager();
    
    const result = await manager.deployAgent(id);

    return NextResponse.json({ 
      success: true,
      url: result.url,
      message: 'Agent deployed successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/agents/[id]/deploy - Stop agent
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const manager = getAgentManager();
    
    await manager.stopAgent(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
