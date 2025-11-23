import { ChromaClient, Collection } from 'chromadb';
import { v4 as uuidv4 } from 'uuid';

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
export class VectorMemory {
  private client: ChromaClient;
  private collection: Collection | null = null;
  private collectionName: string;
  private initialized: boolean = false;

  constructor(collectionName: string = 'agent_memory', host: string = 'http://localhost:8000') {
    this.collectionName = collectionName;
    this.client = new ChromaClient({ path: host });
  }

  /**
   * Initialize the memory system
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Try to get existing collection
      this.collection = await this.client.getOrCreateCollection({
        name: this.collectionName,
        metadata: { 'hnsw:space': 'cosine' }
      });
      this.initialized = true;
      console.log(`[Memory] Initialized collection: ${this.collectionName}`);
    } catch (error: any) {
      console.error('[Memory] Failed to initialize:', error.message);
      throw error;
    }
  }

  /**
   * Add a memory entry
   */
  async add(content: string, metadata: Partial<MemoryEntry['metadata']> = {}): Promise<string> {
    await this.ensureInitialized();

    const id = uuidv4();
    const fullMetadata = {
      role: metadata.role || 'agent',
      timestamp: Date.now(),
      ...metadata
    };

    try {
      await this.collection!.add({
        ids: [id],
        documents: [content],
        metadatas: [fullMetadata as any]
      });

      console.log(`[Memory] Added entry: ${id}`);
      return id;
    } catch (error: any) {
      console.error('[Memory] Failed to add entry:', error.message);
      throw error;
    }
  }

  /**
   * Search memories semantically
   */
  async search(query: string, limit: number = 5): Promise<MemorySearchResult[]> {
    await this.ensureInitialized();

    try {
      const results = await this.collection!.query({
        queryTexts: [query],
        nResults: limit
      });

      if (!results.ids || !results.ids[0] || results.ids[0].length === 0) {
        return [];
      }

      const memories: MemorySearchResult[] = [];
      for (let i = 0; i < results.ids[0].length; i++) {
        memories.push({
          id: results.ids[0][i] as string,
          content: results.documents?.[0]?.[i] as string || '',
          metadata: results.metadatas?.[0]?.[i] || {},
          distance: results.distances?.[0]?.[i] || 0
        });
      }

      return memories;
    } catch (error: any) {
      console.error('[Memory] Search failed:', error.message);
      return [];
    }
  }

  /**
   * Get recent memories
   */
  async getRecent(limit: number = 10): Promise<MemoryEntry[]> {
    await this.ensureInitialized();

    try {
      const result = await this.collection!.get({
        limit: limit
      });

      if (!result.ids || result.ids.length === 0) {
        return [];
      }

      const memories: MemoryEntry[] = [];
      for (let i = 0; i < result.ids.length; i++) {
        memories.push({
          id: result.ids[i] as string,
          content: result.documents?.[i] as string || '',
          metadata: result.metadatas?.[i] as any || {}
        });
      }

      // Sort by timestamp descending
      return memories.sort((a, b) => b.metadata.timestamp - a.metadata.timestamp);
    } catch (error: any) {
      console.error('[Memory] Failed to get recent:', error.message);
      return [];
    }
  }

  /**
   * Delete a memory entry
   */
  async delete(id: string): Promise<void> {
    await this.ensureInitialized();

    try {
      await this.collection!.delete({ ids: [id] });
      console.log(`[Memory] Deleted entry: ${id}`);
    } catch (error: any) {
      console.error('[Memory] Failed to delete:', error.message);
    }
  }

  /**
   * Clear all memories
   */
  async clear(): Promise<void> {
    await this.ensureInitialized();

    try {
      await this.client.deleteCollection({ name: this.collectionName });
      this.collection = await this.client.createCollection({
        name: this.collectionName,
        metadata: { 'hnsw:space': 'cosine' }
      });
      console.log('[Memory] Cleared all memories');
    } catch (error: any) {
      console.error('[Memory] Failed to clear:', error.message);
    }
  }

  /**
   * Get memory statistics
   */
  async getStats(): Promise<{ count: number; collectionName: string }> {
    await this.ensureInitialized();

    try {
      const result = await this.collection!.count();
      return {
        count: result,
        collectionName: this.collectionName
      };
    } catch (error: any) {
      console.error('[Memory] Failed to get stats:', error.message);
      return { count: 0, collectionName: this.collectionName };
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  /**
   * Check if ChromaDB is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.heartbeat();
      return true;
    } catch (error) {
      return false;
    }
  }
}
