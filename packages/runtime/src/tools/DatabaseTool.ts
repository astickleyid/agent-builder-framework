import { BaseTool } from './BaseTool';

// Database client interfaces
interface DatabaseConnection {
  type: 'postgres' | 'mongodb' | 'mysql';
  client: any;
  connectionString: string;
}

export class DatabaseTool extends BaseTool {
  private connections: Map<string, DatabaseConnection> = new Map();

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

  private async createConnection(type: string, connectionString: string): Promise<any> {
    switch (type) {
      case 'postgres': {
        // Dynamic import to avoid bundling if not used
        const { Client } = await import('pg');
        const client = new Client({ connectionString });
        await client.connect();
        return client;
      }

      case 'mongodb': {
        const { MongoClient } = await import('mongodb');
        const client = new MongoClient(connectionString);
        await client.connect();
        return client;
      }

      case 'mysql': {
        const mysql = await import('mysql2/promise');
        const connection = await mysql.createConnection(connectionString);
        return connection;
      }

      default:
        throw new Error(`Unsupported database type: ${type}`);
    }
  }

  async execute(params: {
    operation: 'connect' | 'query' | 'close';
    type?: 'postgres' | 'mongodb' | 'mysql';
    connectionString?: string;
    query?: string;
    connectionId?: string;
    database?: string; // For MongoDB
    collection?: string; // For MongoDB
  }): Promise<any> {
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
          } catch (error: any) {
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

          let result: any;

          switch (conn.type) {
            case 'postgres': {
              const queryResult = await conn.client.query(query);
              result = {
                success: true,
                rows: queryResult.rows,
                rowCount: queryResult.rowCount,
                fields: queryResult.fields?.map((f: any) => f.name) || [],
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
              } else if (queryObj.operation === 'insert') {
                const insertResult = await coll.insertMany(queryObj.documents || []);
                result = {
                  success: true,
                  insertedCount: insertResult.insertedCount,
                  insertedIds: insertResult.insertedIds,
                  query: queryObj
                };
              } else if (queryObj.operation === 'update') {
                const updateResult = await coll.updateMany(queryObj.filter || {}, queryObj.update || {});
                result = {
                  success: true,
                  matchedCount: updateResult.matchedCount,
                  modifiedCount: updateResult.modifiedCount,
                  query: queryObj
                };
              } else if (queryObj.operation === 'delete') {
                const deleteResult = await coll.deleteMany(queryObj.filter || {});
                result = {
                  success: true,
                  deletedCount: deleteResult.deletedCount,
                  query: queryObj
                };
              } else {
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
                fields: fields?.map((f: any) => f.name) || [],
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
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        stack: error.stack
      };
    }
  }

  // Cleanup method to close all connections
  async closeAllConnections(): Promise<void> {
    const promises = Array.from(this.connections.keys()).map(id =>
      this.execute({ operation: 'close', connectionId: id })
    );
    await Promise.all(promises);
  }
}
