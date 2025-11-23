"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistentMemory = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
/**
 * PersistentMemory - Save and load conversations to disk
 */
class PersistentMemory {
    storagePath;
    constructor(storagePath = './.stick-memory') {
        this.storagePath = storagePath;
    }
    /**
     * Initialize storage directory
     */
    async initialize() {
        try {
            await fs.mkdir(this.storagePath, { recursive: true });
            console.log(`[Memory] Storage initialized: ${this.storagePath}`);
        }
        catch (error) {
            console.error('[Memory] Failed to initialize storage:', error.message);
            throw error;
        }
    }
    /**
     * Save a conversation
     */
    async saveConversation(conversationId, agentName, messages) {
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
        }
        catch (error) {
            console.error('[Memory] Failed to save conversation:', error.message);
            throw error;
        }
    }
    /**
     * Load a conversation
     */
    async loadConversation(conversationId) {
        const filePath = path.join(this.storagePath, `${conversationId}.json`);
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            const conversation = JSON.parse(data);
            console.log(`[Memory] Loaded conversation: ${conversationId} (${conversation.messageCount} messages)`);
            return conversation.messages || [];
        }
        catch (error) {
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
    async listConversations() {
        await this.initialize();
        try {
            const files = await fs.readdir(this.storagePath);
            const conversations = [];
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
                    }
                    catch (error) {
                        // Skip invalid files
                        continue;
                    }
                }
            }
            return conversations.sort((a, b) => b.lastUpdate - a.lastUpdate);
        }
        catch (error) {
            console.error('[Memory] Failed to list conversations:', error.message);
            return [];
        }
    }
    /**
     * Delete a conversation
     */
    async deleteConversation(conversationId) {
        const filePath = path.join(this.storagePath, `${conversationId}.json`);
        try {
            await fs.unlink(filePath);
            console.log(`[Memory] Deleted conversation: ${conversationId}`);
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                console.error('[Memory] Failed to delete conversation:', error.message);
                throw error;
            }
        }
    }
    /**
     * Export conversation to different format
     */
    async exportConversation(conversationId, format = 'json') {
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
    async getStats() {
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
        }
        catch (error) {
            // Ignore errors
        }
        return {
            totalConversations: conversations.length,
            totalMessages,
            storageSize
        };
    }
}
exports.PersistentMemory = PersistentMemory;
//# sourceMappingURL=PersistentMemory.js.map