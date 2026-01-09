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
exports.DatabaseTool = void 0;
const BaseTool_1 = require("./BaseTool");
class DatabaseTool extends BaseTool_1.BaseTool {
    connections = new Map();
    constructor() {
        super({
            name: 'database',
            description: 'Execute database queries (PostgreSQL, MongoDB, MySQL)',
            parameters: {
                operation: 'string (connect|query|close)',
                type: 'string (postgres|mongodb|mysql)',
                connectionString: 'string',
                query: 'string (for query operation)',
                connectionId: 'string (optional, for query and close operations)'
            }
        });
    }
    async createConnection(type, connectionString) {
        switch (type) {
            case 'postgres': {
                // Dynamic import to avoid bundling if not used
                const { Client } = await Promise.resolve().then(() => __importStar(require('pg')));
                const client = new Client({ connectionString });
                await client.connect();
                return client;
            }
            case 'mongodb': {
                const { MongoClient } = await Promise.resolve().then(() => __importStar(require('mongodb')));
                const client = new MongoClient(connectionString);
                await client.connect();
                return client;
            }
            case 'mysql': {
                const mysql = await Promise.resolve().then(() => __importStar(require('mysql2/promise')));
                const connection = await mysql.createConnection(connectionString);
                return connection;
            }
            default:
                throw new Error(`Unsupported database type: ${type}`);
        }
    }
    async execute(params) {
        const { operation, type, connectionString, query, connectionId, database, collection } = params;
        try {
            switch (operation) {
                case 'connect': {
                    if (!type || !connectionString) {
                        throw new Error('type and connectionString required for connect');
                    }
                    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    try {
                        const client = await this.createConnection(type, connectionString);
                        this.connections.set(id, {
                            type,
                            client,
                            connectionString
                        });
                        return {
                            success: true,
                            connectionId: id,
                            type,
                            message: `Connected to ${type} database successfully`
                        };
                    }
                    catch (error) {
                        throw new Error(`Failed to connect to ${type} database: ${error.message}`);
                    }
                }
                case 'query': {
                    if (!connectionId || !query) {
                        throw new Error('connectionId and query required for query operation');
                    }
                    const conn = this.connections.get(connectionId);
                    if (!conn) {
                        throw new Error(`Connection not found: ${connectionId}`);
                    }
                    let result;
                    switch (conn.type) {
                        case 'postgres': {
                            const queryResult = await conn.client.query(query);
                            result = {
                                success: true,
                                rows: queryResult.rows,
                                rowCount: queryResult.rowCount,
                                fields: queryResult.fields?.map((f) => f.name) || [],
                                query
                            };
                            break;
                        }
                        case 'mongodb': {
                            // For MongoDB, the query should be a JSON string
                            if (!database || !collection) {
                                throw new Error('database and collection required for MongoDB queries');
                            }
                            const db = conn.client.db(database);
                            const coll = db.collection(collection);
                            // Parse the query as JSON
                            const queryObj = JSON.parse(query);
                            // Determine operation type from query structure
                            if (queryObj.operation === 'find') {
                                const docs = await coll.find(queryObj.filter || {}).toArray();
                                result = {
                                    success: true,
                                    documents: docs,
                                    count: docs.length,
                                    query: queryObj
                                };
                            }
                            else if (queryObj.operation === 'insert') {
                                const insertResult = await coll.insertMany(queryObj.documents || []);
                                result = {
                                    success: true,
                                    insertedCount: insertResult.insertedCount,
                                    insertedIds: insertResult.insertedIds,
                                    query: queryObj
                                };
                            }
                            else if (queryObj.operation === 'update') {
                                const updateResult = await coll.updateMany(queryObj.filter || {}, queryObj.update || {});
                                result = {
                                    success: true,
                                    matchedCount: updateResult.matchedCount,
                                    modifiedCount: updateResult.modifiedCount,
                                    query: queryObj
                                };
                            }
                            else if (queryObj.operation === 'delete') {
                                const deleteResult = await coll.deleteMany(queryObj.filter || {});
                                result = {
                                    success: true,
                                    deletedCount: deleteResult.deletedCount,
                                    query: queryObj
                                };
                            }
                            else {
                                throw new Error(`Unsupported MongoDB operation: ${queryObj.operation}`);
                            }
                            break;
                        }
                        case 'mysql': {
                            const [rows, fields] = await conn.client.query(query);
                            result = {
                                success: true,
                                rows: Array.isArray(rows) ? rows : [rows],
                                rowCount: Array.isArray(rows) ? rows.length : 1,
                                fields: fields?.map((f) => f.name) || [],
                                query
                            };
                            break;
                        }
                        default:
                            throw new Error(`Unsupported database type: ${conn.type}`);
                    }
                    return result;
                }
                case 'close': {
                    if (!connectionId) {
                        throw new Error('connectionId required for close operation');
                    }
                    const conn = this.connections.get(connectionId);
                    if (!conn) {
                        throw new Error(`Connection not found: ${connectionId}`);
                    }
                    // Close the connection based on type
                    switch (conn.type) {
                        case 'postgres':
                            await conn.client.end();
                            break;
                        case 'mongodb':
                            await conn.client.close();
                            break;
                        case 'mysql':
                            await conn.client.end();
                            break;
                    }
                    this.connections.delete(connectionId);
                    return {
                        success: true,
                        message: `Connection ${connectionId} closed successfully`
                    };
                }
                default:
                    throw new Error(`Unknown operation: ${operation}`);
            }
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                stack: error.stack
            };
        }
    }
    // Cleanup method to close all connections
    async closeAllConnections() {
        const promises = Array.from(this.connections.keys()).map(id => this.execute({ operation: 'close', connectionId: id }));
        await Promise.all(promises);
    }
}
exports.DatabaseTool = DatabaseTool;
//# sourceMappingURL=DatabaseTool.js.map