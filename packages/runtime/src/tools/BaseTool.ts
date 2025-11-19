export interface ToolConfig {
  name: string;
  description: string;
  parameters?: Record<string, any>;
}

export abstract class BaseTool {
  protected config: ToolConfig;

  constructor(config: ToolConfig) {
    this.config = config;
  }

  abstract execute(params: any): Promise<any>;

  public getName(): string {
    return this.config.name;
  }

  public getDescription(): string {
    return this.config.description;
  }

  public getConfig(): ToolConfig {
    return this.config;
  }
}
