import { BaseTool } from './BaseTool';
export declare class XmlTool extends BaseTool {
    constructor();
    execute(params: {
        operation: 'parse' | 'stringify' | 'validate' | 'query';
        data: any;
        xpath?: string;
    }): Promise<any>;
    private simpleXmlParse;
    private objectToXml;
    private validateXml;
}
//# sourceMappingURL=XmlTool.d.ts.map