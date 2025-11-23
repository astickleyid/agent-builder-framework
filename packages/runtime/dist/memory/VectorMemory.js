"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorMemory = void 0;
const chromadb_1 = require("chromadb");
const uuid_1 = require("uuid");
/**
 * VectorMemory - Persistent memory with semantic search using ChromaDB
 */
class VectorMemory {
    client;
    collection = null;
    collectionName;
    initialized = false;
    constructor(collectionName = 'agent_memory', host = 'http://localhost:8000') {
        this.collectionName = collectionName;
        this.client = new chromadb_1.ChromaClient({ path: host });
    }
    /**
     * Initialize the memory system
     */
    async initialize() {
        if (this.initialized)
            return;
        try {
            // Try to get existing collection
            this.collection = await this.client.getOrCreateCollection({
                name: this.collectionName,
                metadata: { 'hnsw:space': 'cosine' }
            });
            this.initialized = true;
            console.log(`[Memory] Initialized collection: ${this.collectionName}`);
        }
        catch (error) {
            console.error('[Memory] Failed to initialize:', error.message);
            throw error;
        }
    }
    /**
     * Add a memory entry
     */
    async add(content, metadata = {}) {
        await this.ensureInitialized();
        const id = (0, uuid_1.v4)();
        const fullMetadata = {
            role: metadata.role || 'agent',
            timestamp: Date.now(),
            ...metadata
        };
        try {
            await this.collection.add({
                ids: [id],
                documents: [content],
                metadatas: [fullMetadata]
            });
            console.log(`[Memory] Added entry: ${id}`);
            return id;
        }
        catch (error) {
            console.error('[Memory] Failed to add entry:', error.message);
            throw error;
        }
    }
    /**
     * Search memories semantically
     */
    async search(query, limit = 5) {
        await this.ensureInitialized();
        try {
            const results = await this.collection.query({
                queryTexts: [query],
                nResults: limit
            });
            if (!results.ids || !results.ids[0] || results.ids[0].length === 0) {
                return [];
            }
            const memories = [];
            for (let i = 0; i < results.ids[0].length; i++) {
                memories.push({
                    id: results.ids[0][i],
                    content: results.documents?.[0]?.[i] || '',
                    metadata: results.metadatas?.[0]?.[i] || {},
                    distance: results.distances?.[0]?.[i] || 0
                });
            }
            return memories;
        }
        catch (error) {
            console.error('[Memory] Search failed:', error.message);
            return [];
        }
    }
    /**
     * Get recent memories
     */
    async getRecent(limit = 10) {
        await this.ensureInitialized();
        try {
            const result = await this.collection.get({
                limit: limit
            });
            if (!result.ids || result.ids.length === 0) {
                return [];
            }
            const memories = [];
            for (let i = 0; i < result.ids.length; i++) {
                memories.push({
                    id: result.ids[i],
                    content: result.documents?.[i] || '',
                    metadata: result.metadatas?.[i] || {}
                });
            }
            // Sort by timestamp descending
            return memories.sort((a, b) => b.metadata.timestamp - a.metadata.timestamp);
        }
        catch (error) {
            console.error('[Memory] Failed to get recent:', error.message);
            return [];
        }
    }
    /**
     * Delete a memory entry
     */
    async delete(id) {
        await this.ensureInitialized();
        try {
            await this.collection.delete({ ids: [id] });
            console.log(`[Memory] Deleted entry: ${id}`);
        }
        catch (error) {
            console.error('[Memory] Failed to delete:', error.message);
        }
    }
    /**
     * Clear all memories
     */
    async clear() {
        await this.ensureInitialized();
        try {
            await this.client.deleteCollection({ name: this.collectionName });
            this.collection = await this.client.createCollection({
                name: this.collectionName,
                metadata: { 'hnsw:space': 'cosine' }
            });
            console.log('[Memory] Cleared all memories');
        }
        catch (error) {
            console.error('[Memory] Failed to clear:', error.message);
        }
    }
    /**
     * Get memory statistics
     */
    async getStats() {
        await this.ensureInitialized();
        try {
            const result = await this.collection.count();
            return {
                count: result,
                collectionName: this.collectionName
            };
        }
        catch (error) {
            console.error('[Memory] Failed to get stats:', error.message);
            return { count: 0, collectionName: this.collectionName };
        }
    }
    async ensureInitialized() {
        if (!this.initialized) {
            await this.initialize();
        }
    }
    /**
     * Check if ChromaDB is available
     */
    async healthCheck() {
        try {
            await this.client.heartbeat();
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.VectorMemory = VectorMemory;
//# sourceMappingURL=VectorMemory.js.map