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
export declare class PersistentMemory {
    private storagePath;
    constructor(storagePath?: string);
    /**
     * Initialize storage directory
     */
    initialize(): Promise<void>;
    /**
     * Save a conversation
     */
    saveConversation(conversationId: string, agentName: string, messages: Message[]): Promise<void>;
    /**
     * Load a conversation
     */
    loadConversation(conversationId: string): Promise<Message[]>;
    /**
     * List all conversations
     */
    listConversations(): Promise<ConversationMetadata[]>;
    /**
     * Delete a conversation
     */
    deleteConversation(conversationId: string): Promise<void>;
    /**
     * Export conversation to different format
     */
    exportConversation(conversationId: string, format?: 'json' | 'txt' | 'md'): Promise<string>;
    /**
     * Get storage statistics
     */
    getStats(): Promise<{
        totalConversations: number;
        totalMessages: number;
        storageSize: number;
    }>;
}
//# sourceMappingURL=PersistentMemory.d.ts.map