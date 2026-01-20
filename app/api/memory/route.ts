import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';

const MEMORY_DIR = path.join(process.cwd(), '.stick-memory');

// Ensure memory directory exists
async function ensureMemoryDir() {
  if (!await fs.pathExists(MEMORY_DIR)) {
    await fs.mkdirp(MEMORY_DIR);
  }
}

// GET /api/memory - Get all conversations
export async function GET() {
  try {
    await ensureMemoryDir();

    const files = await fs.readdir(MEMORY_DIR);
    const conversations = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(MEMORY_DIR, file);
        const data = await fs.readJson(filePath);
        conversations.push({
          id: data.conversationId,
          agentName: data.agentName,
          messageCount: data.messages?.length || 0,
          lastUpdate: data.lastUpdate || Date.now()
        });
      }
    }

    // Sort by last update (newest first)
    conversations.sort((a, b) => b.lastUpdate - a.lastUpdate);

    return NextResponse.json({ success: true, conversations });
  } catch (error: any) {
    console.error('Memory GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/memory - Save a conversation
export async function POST(request: NextRequest) {
  try {
    await ensureMemoryDir();

    const body = await request.json();
    const { conversationId, agentName, messages } = body;

    if (!conversationId || !agentName || !messages) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: conversationId, agentName, messages' },
        { status: 400 }
      );
    }

    const data = {
      conversationId,
      agentName,
      messages,
      lastUpdate: Date.now()
    };

    const filePath = path.join(MEMORY_DIR, `${conversationId}.json`);
    await fs.writeJson(filePath, data, { spaces: 2 });

    return NextResponse.json({ success: true, saved: true });
  } catch (error: any) {
    console.error('Memory POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
