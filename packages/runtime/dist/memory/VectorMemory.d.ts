export interface MemoryEntry {
    id: string;
    content: string;
    metadata: {
        role: 'user' | 'agent';
        timestamp: number;
        agentName?: string;
        [key: string]: any;
    };
}
export interface MemorySearchResult {
    id: string;
    content: string;
    metadata: any;
    distance: number;
}
/**
 * VectorMemory - Persistent memory with semantic search using ChromaDB
 */
export declare class VectorMemory {
    private client;
    private collection;
    private collectionName;
    private initialized;
    constructor(collectionName?: string, host?: string);
    /**
     * Initialize the memory system
     */
    initialize(): Promise<void>;
    /**
     * Add a memory entry
     */
    add(content: string, metadata?: Partial<MemoryEntry['metadata']>): Promise<string>;
    /**
     * Search memories semantically
     */
    search(query: string, limit?: number): Promise<MemorySearchResult[]>;
    /**
     * Get recent memories
     */
    getRecent(limit?: number): Promise<MemoryEntry[]>;
    /**
     * Delete a memory entry
     */
    delete(id: string): Promise<void>;
    /**
     * Clear all memories
     */
    clear(): Promise<void>;
    /**
     * Get memory statistics
     */
    getStats(): Promise<{
        count: number;
        collectionName: string;
    }>;
    private ensureInitialized;
    /**
     * Check if ChromaDB is available
     */
    healthCheck(): Promise<boolean>;
}
//# sourceMappingURL=VectorMemory.d.ts.map