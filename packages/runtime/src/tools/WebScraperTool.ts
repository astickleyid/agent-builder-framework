import { BaseTool } from './BaseTool';
import axios from 'axios';

export class WebScraperTool extends BaseTool {
  constructor() {
    super({
      name: 'web-scraper',
      description: 'Scrape and extract data from web pages',
      parameters: {
        url: 'string',
        selector: 'string (CSS selector, optional)',
        timeout: 'number (optional, default: 30000ms)',
        headers: 'object (optional)'
      }
    });
  }

  async execute(params: {
    url: string;
    selector?: string;
    timeout?: number;
    headers?: Record<string, string>;
  }): Promise<any> {
    const { url, selector, timeout = 30000, headers = {} } = params;

    try {
      // Fetch the page
      const response = await axios.get(url, {
        timeout,
        headers: {
          'User-Agent': 'stick.ai-bot/1.0',
          ...headers
        }
      });

      const html = response.data;
      
      // In production, would use cheerio or jsdom to parse HTML
      // For now, return basic info
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : '';

      // Extract meta description
      const descMatch = html.match(/<meta name="description" content="(.*?)"/i);
      const description = descMatch ? descMatch[1] : '';

      // Count links
      const linkMatches = html.match(/<a\s+[^>]*href/gi);
      const linkCount = linkMatches ? linkMatches.length : 0;

      return {
        success: true,
        url,
        title,
        description,
        linkCount,
        contentLength: html.length,
        statusCode: response.status,
        message: 'Page scraped successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        url
      };
    }
  }
}
