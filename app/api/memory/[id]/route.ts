import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const MEMORY_PATH = path.join(process.cwd(), '.stick-memory');

// GET /api/memory/[id] - Get conversation
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(MEMORY_PATH, `${params.id}.json`);
    
    try {
      const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      
      return NextResponse.json({
        success: true,
        conversation: data
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
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

// DELETE /api/memory/[id] - Delete conversation
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(MEMORY_PATH, `${params.id}.json`);
    await fs.unlink(filePath);

    return NextResponse.json({
      success: true,
      message: 'Conversation deleted'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
