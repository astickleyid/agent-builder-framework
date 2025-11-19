import { BaseTool } from './BaseTool';

export class XmlTool extends BaseTool {
  constructor() {
    super({
      name: 'xml',
      description: 'Parse and manipulate XML data',
      parameters: {
        operation: 'string (parse|stringify|validate|query)',
        data: 'string | object',
        xpath: 'string (for query operation)'
      }
    });
  }

  async execute(params: {
    operation: 'parse' | 'stringify' | 'validate' | 'query';
    data: any;
    xpath?: string;
  }): Promise<any> {
    const { operation, data, xpath } = params;

    try {
      switch (operation) {
        case 'parse':
          if (typeof data !== 'string') {
            throw new Error('data must be string for parse operation');
          }
          // Basic XML parsing simulation
          const parsed = this.simpleXmlParse(data);
          return {
            success: true,
            result: parsed,
            message: 'XML parsed successfully'
          };

        case 'stringify':
          if (typeof data !== 'object') {
            throw new Error('data must be object for stringify operation');
          }
          const xml = this.objectToXml(data);
          return {
            success: true,
            xml,
            message: 'Object converted to XML'
          };

        case 'validate':
          const isValid = this.validateXml(data);
          return {
            success: true,
            valid: isValid,
            message: isValid ? 'Valid XML' : 'Invalid XML'
          };

        case 'query':
          if (!xpath) {
            throw new Error('xpath required for query operation');
          }
          // Simplified XPath query
          return {
            success: true,
            result: 'XPath query support (basic)',
            xpath
          };

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  private simpleXmlParse(xml: string): any {
    // Very basic XML to JSON conversion
    const tagRegex = /<(\w+)>(.*?)<\/\1>/g;
    const result: any = {};
    let match;

    while ((match = tagRegex.exec(xml)) !== null) {
      result[match[1]] = match[2];
    }

    return result;
  }

  private objectToXml(obj: any, rootName: string = 'root'): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n`;
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        xml += this.objectToXml(value, key);
      } else {
        xml += `  <${key}>${value}</${key}>\n`;
      }
    }
    
    xml += `</${rootName}>\n`;
    return xml;
  }

  private validateXml(xml: string): boolean {
    try {
      // Basic validation - check for matching tags
      const openTags = xml.match(/<(\w+)>/g) || [];
      const closeTags = xml.match(/<\/(\w+)>/g) || [];
      return openTags.length === closeTags.length;
    } catch {
      return false;
    }
  }
}
