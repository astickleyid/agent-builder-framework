import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const MEMORY_PATH = path.join(process.cwd(), '.stick-memory');

// GET /api/memory - List conversations
export async function GET() {
  try {
    await fs.mkdir(MEMORY_PATH, { recursive: true });
    const files = await fs.readdir(MEMORY_PATH);
    
    const conversations = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(MEMORY_PATH, file);
          const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
          conversations.push({
            id: data.id,
            agentName: data.agentName,
            startTime: data.startTime,
            lastUpdate: data.lastUpdate,
            messageCount: data.messageCount
          });
        } catch (error) {
          // Skip invalid files
          continue;
        }
      }
    }

    return NextResponse.json({
      success: true,
      conversations: conversations.sort((a, b) => b.lastUpdate - a.lastUpdate),
      count: conversations.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/memory - Save conversation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId, agentName, messages } = body;

    if (!conversationId || !agentName || !messages) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await fs.mkdir(MEMORY_PATH, { recursive: true });

    const conversation = {
      id: conversationId,
      agentName,
      startTime: messages[0]?.timestamp || Date.now(),
      lastUpdate: Date.now(),
      messageCount: messages.length,
      messages
    };

    const filePath = path.join(MEMORY_PATH, `${conversationId}.json`);
    await fs.writeFile(filePath, JSON.stringify(conversation, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Conversation saved',
      conversationId
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/memory - Clear all conversations
export async function DELETE() {
  try {
    const files = await fs.readdir(MEMORY_PATH);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        await fs.unlink(path.join(MEMORY_PATH, file));
      }
    }

    return NextResponse.json({
      success: true,
      message: 'All conversations cleared'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
