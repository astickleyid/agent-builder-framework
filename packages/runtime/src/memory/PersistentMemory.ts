import * as fs from 'fs/promises';
import * as path from 'path';
import { Message } from '../agent/Agent';

export interface ConversationMetadata {
  id: string;
  agentName: string;
  startTime: number;
  lastUpdate: number;
  messageCount: number;
}

/**
 * PersistentMemory - Save and load conversations to disk
 */
export class PersistentMemory {
  private storagePath: string;

  constructor(storagePath: string = './.stick-memory') {
    this.storagePath = storagePath;
  }

  /**
   * Initialize storage directory
   */
  async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.storagePath, { recursive: true });
      console.log(`[Memory] Storage initialized: ${this.storagePath}`);
    } catch (error: any) {
      console.error('[Memory] Failed to initialize storage:', error.message);
      throw error;
    }
  }

  /**
   * Save a conversation
   */
  async saveConversation(
    conversationId: string,
    agentName: string,
    messages: Message[]
  ): Promise<void> {
    await this.initialize();

    const conversationData = {
      id: conversationId,
      agentName,
      startTime: messages[0]?.timestamp || Date.now(),
      lastUpdate: Date.now(),
      messageCount: messages.length,
      messages
    };

    const filePath = path.join(this.storagePath, `${conversationId}.json`);

    try {
      await fs.writeFile(filePath, JSON.stringify(conversationData, null, 2));
      console.log(`[Memory] Saved conversation: ${conversationId}`);
    } catch (error: any) {
      console.error('[Memory] Failed to save conversation:', error.message);
      throw error;
    }
  }

  /**
   * Load a conversation
   */
  async loadConversation(conversationId: string): Promise<Message[]> {
    const filePath = path.join(this.storagePath, `${conversationId}.json`);

    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const conversation = JSON.parse(data);
      console.log(`[Memory] Loaded conversation: ${conversationId} (${conversation.messageCount} messages)`);
      return conversation.messages || [];
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`[Memory] Conversation not found: ${conversationId}`);
        return [];
      }
      console.error('[Memory] Failed to load conversation:', error.message);
      throw error;
    }
  }

  /**
   * List all conversations
   */
  async listConversations(): Promise<ConversationMetadata[]> {
    await this.initialize();

    try {
      const files = await fs.readdir(this.storagePath);
      const conversations: ConversationMetadata[] = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const filePath = path.join(this.storagePath, file);
            const data = await fs.readFile(filePath, 'utf-8');
            const conversation = JSON.parse(data);
            
            conversations.push({
              id: conversation.id,
              agentName: conversation.agentName,
              startTime: conversation.startTime,
              lastUpdate: conversation.lastUpdate,
              messageCount: conversation.messageCount
            });
          } catch (error) {
            // Skip invalid files
            continue;
          }
        }
      }

      return conversations.sort((a, b) => b.lastUpdate - a.lastUpdate);
    } catch (error: any) {
      console.error('[Memory] Failed to list conversations:', error.message);
      return [];
    }
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    const filePath = path.join(this.storagePath, `${conversationId}.json`);

    try {
      await fs.unlink(filePath);
      console.log(`[Memory] Deleted conversation: ${conversationId}`);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        console.error('[Memory] Failed to delete conversation:', error.message);
        throw error;
      }
    }
  }

  /**
   * Export conversation to different format
   */
  async exportConversation(
    conversationId: string,
    format: 'json' | 'txt' | 'md' = 'json'
  ): Promise<string> {
    const messages = await this.loadConversation(conversationId);

    switch (format) {
      case 'txt':
        return messages
          .map(m => `[${m.role}] ${m.content}`)
          .join('\n\n');

      case 'md':
        return messages
          .map(m => `**${m.role}**: ${m.content}`)
          .join('\n\n');

      case 'json':
      default:
        return JSON.stringify(messages, null, 2);
    }
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<{
    totalConversations: number;
    totalMessages: number;
    storageSize: number;
  }> {
    const conversations = await this.listConversations();
    const totalMessages = conversations.reduce((sum, c) => sum + c.messageCount, 0);

    // Calculate storage size
    let storageSize = 0;
    try {
      const files = await fs.readdir(this.storagePath);
      for (const file of files) {
        const filePath = path.join(this.storagePath, file);
        const stats = await fs.stat(filePath);
        storageSize += stats.size;
      }
    } catch (error) {
      // Ignore errors
    }

    return {
      totalConversations: conversations.length,
      totalMessages,
      storageSize
    };
  }
}
