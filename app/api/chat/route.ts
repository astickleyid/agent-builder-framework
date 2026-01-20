import { NextRequest, NextResponse } from 'next/server';
import { getAgentManager } from '@/lib/agent-manager';

// POST /api/chat - Send a message to an agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { agentName, message } = body;

    if (!agentName || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: agentName, message' },
        { status: 400 }
      );
    }

    const manager = getAgentManager();
    const agents = await manager.listAgents();

    // Find the agent by name
    const agentConfig = agents.find(a => a.name === agentName);
    if (!agentConfig) {
      return NextResponse.json(
        { success: false, error: `Agent "${agentName}" not found` },
        { status: 404 }
      );
    }

    // Get the deployed agent
    const deployedAgent = await manager.getAgent(agentConfig.id);

    if (!deployedAgent) {
      return NextResponse.json(
        { success: false, error: `Agent "${agentName}" not found` },
        { status: 404 }
      );
    }

    // Check if agent is deployed
    if (deployedAgent.status !== 'running' || !deployedAgent.instance) {
      // Try to deploy the agent
      try {
        await manager.deployAgent(agentConfig.id);
        const updatedAgent = await manager.getAgent(agentConfig.id);
        if (updatedAgent?.instance) {
          const response = await updatedAgent.instance.run(message);
          return NextResponse.json({
            success: true,
            response,
            timestamp: Date.now()
          });
        }
      } catch (deployError: any) {
        return NextResponse.json(
          { success: false, error: `Failed to deploy agent: ${deployError.message}` },
          { status: 500 }
        );
      }
    }

    // Execute the message on the agent
    try {
      const response = await deployedAgent.instance!.run(message);
      return NextResponse.json({
        success: true,
        response,
        timestamp: Date.now()
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: `Agent execution failed: ${error.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
