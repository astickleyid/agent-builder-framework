import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: Date.now(),
    version: '1.0.0',
    services: {
      agents: 'operational',
      memory: 'operational',
      api: 'operational'
    }
  });
}
