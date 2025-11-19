import { BaseTool } from './BaseTool';
import axios, { AxiosRequestConfig } from 'axios';

export class HttpTool extends BaseTool {
  constructor() {
    super({
      name: 'http',
      description: 'Make HTTP requests (GET, POST, PUT, DELETE)',
      parameters: {
        url: 'string',
        method: 'string (GET|POST|PUT|DELETE)',
        headers: 'object (optional)',
        data: 'any (optional)'
      }
    });
  }

  async execute(params: {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    data?: any;
  }): Promise<any> {
    const { url, method = 'GET', headers = {}, data } = params;

    try {
      const config: AxiosRequestConfig = {
        url,
        method: method as any,
        headers,
        data,
        timeout: 30000
      };

      const response = await axios(config);

      return {
        success: true,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }
  }
}
