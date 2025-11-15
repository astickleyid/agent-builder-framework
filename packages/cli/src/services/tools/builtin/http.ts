/**
 * HTTP Tool
 * Makes HTTP requests with security constraints
 */

import { Tool, ToolDefinition, ToolExecutionContext, ToolExecutionResult } from '../types';
import https from 'https';
import http from 'http';
import { URL } from 'url';

export class HttpTool implements Tool {
  definition: ToolDefinition = {
    name: 'http',
    description: 'Make HTTP/HTTPS requests',
    category: 'web',
    parameters: [
      {
        name: 'url',
        type: 'string',
        description: 'The URL to request',
        required: true,
      },
      {
        name: 'method',
        type: 'string',
        description: 'HTTP method (GET, POST, PUT, DELETE, etc.)',
        required: false,
        default: 'GET',
      },
      {
        name: 'headers',
        type: 'object',
        description: 'HTTP headers',
        required: false,
        default: {},
      },
      {
        name: 'body',
        type: 'string',
        description: 'Request body',
        required: false,
      },
    ],
    requiresPermission: true,
    dangerLevel: 'medium',
  };

  private readonly DEFAULT_TIMEOUT = 30000; // 30 seconds
  private readonly MAX_RESPONSE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly FORBIDDEN_HOSTS = ['169.254.169.254']; // AWS metadata service

  async execute(
    params: Record<string, any>,
    context?: ToolExecutionContext
  ): Promise<ToolExecutionResult> {
    const startTime = Date.now();

    try {
      // Validate URL
      if (!params.url || typeof params.url !== 'string') {
        return {
          success: false,
          error: 'Invalid URL parameter',
        };
      }

      const url = new URL(params.url);

      // Security check
      if (this.isForbiddenHost(url.hostname)) {
        return {
          success: false,
          error: 'Access denied: forbidden host',
        };
      }

      const method = (params.method || 'GET').toUpperCase();
      const headers = params.headers || {};
      const body = params.body;

      const result = await this.makeRequest(url, method, headers, body, context);

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        output: result,
        executionTime,
        metadata: {
          url: params.url,
          method,
          statusCode: result.statusCode,
        },
      };
    } catch (error: any) {
      const executionTime = Date.now() - startTime;

      return {
        success: false,
        error: error.message || 'HTTP request failed',
        executionTime,
      };
    }
  }

  private async makeRequest(
    url: URL,
    method: string,
    headers: Record<string, string>,
    body: string | undefined,
    context?: ToolExecutionContext
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        method,
        headers: {
          'User-Agent': 'stick-ai-agent/1.0',
          ...headers,
        },
        timeout: context?.timeout || this.DEFAULT_TIMEOUT,
      };

      const protocol = url.protocol === 'https:' ? https : http;

      const req = protocol.request(url, options, (res) => {
        let data = '';
        let totalSize = 0;

        res.on('data', (chunk) => {
          totalSize += chunk.length;

          if (totalSize > this.MAX_RESPONSE_SIZE) {
            req.destroy();
            reject(new Error('Response size exceeds maximum allowed'));
            return;
          }

          data += chunk;
        });

        res.on('end', () => {
          let parsedBody: any = data;

          // Try to parse JSON response
          const contentType = res.headers['content-type'] || '';
          if (contentType.includes('application/json')) {
            try {
              parsedBody = JSON.parse(data);
            } catch {
              // Keep as string if JSON parsing fails
            }
          }

          resolve({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.headers,
            body: parsedBody,
            size: totalSize,
          });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        req.write(body);
      }

      req.end();
    });
  }

  private isForbiddenHost(hostname: string): boolean {
    return this.FORBIDDEN_HOSTS.includes(hostname);
  }
}
