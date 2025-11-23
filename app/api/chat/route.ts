import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

// POST /api/chat - Run agent with input
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agentName, message, stream = false } = body;

    if (!agentName || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing agentName or message' },
        { status: 400 }
      );
    }

    // Execute agent via CLI
    const cliPath = path.join(process.cwd(), 'packages/cli/dist/cli.js');
    const agentPath = path.join(process.cwd(), 'packages/cli/test-agent');

    return new Promise((resolve) => {
      let output = '';
      let error = '';

      const child = spawn('node', [cliPath, 'run', agentName, '--input', message], {
        cwd: agentPath,
        env: process.env
      });

      child.stdout?.on('data', (data) => {
        output += data.toString();
      });

      child.stderr?.on('data', (data) => {
        error += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          // Extract agent response (simple parsing)
          const lines = output.split('\n');
          const responseLine = lines.find(l => l.includes('Agent>'));
          const response = responseLine ? responseLine.replace(/.*Agent>\s*/, '').trim() : output.trim();

          resolve(NextResponse.json({
            success: true,
            response,
            agentName,
            timestamp: Date.now()
          }));
        } else {
          resolve(NextResponse.json(
            {
              success: false,
              error: error || 'Agent execution failed',
              output
            },
            { status: 500 }
          ));
        }
      });

      // Timeout after 60 seconds
      setTimeout(() => {
        child.kill();
        resolve(NextResponse.json(
          { success: false, error: 'Request timeout' },
          { status: 408 }
        ));
      }, 60000);
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
