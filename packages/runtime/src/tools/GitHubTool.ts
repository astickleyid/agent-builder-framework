import { BaseTool } from './BaseTool';
import axios from 'axios';

export class GitHubTool extends BaseTool {
  constructor() {
    super({
      name: 'github',
      description: 'Interact with GitHub API (repos, issues, PRs)',
      parameters: {
        operation: 'string (get-repo|list-issues|create-issue|list-prs)',
        owner: 'string (repository owner)',
        repo: 'string (repository name)',
        token: 'string (GitHub personal access token, optional)',
        data: 'object (for create operations)'
      }
    });
  }

  async execute(params: {
    operation: string;
    owner?: string;
    repo?: string;
    token?: string;
    data?: any;
  }): Promise<any> {
    const { operation, owner, repo, token, data } = params;

    try {
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'stick.ai-bot/1.0'
      };

      if (token) {
        headers['Authorization'] = `token ${token}`;
      }

      const baseUrl = 'https://api.github.com';

      switch (operation) {
        case 'get-repo':
          if (!owner || !repo) {
            throw new Error('owner and repo required');
          }
          const repoResponse = await axios.get(
            `${baseUrl}/repos/${owner}/${repo}`,
            { headers }
          );
          return {
            success: true,
            repo: {
              name: repoResponse.data.name,
              description: repoResponse.data.description,
              stars: repoResponse.data.stargazers_count,
              forks: repoResponse.data.forks_count,
              language: repoResponse.data.language,
              url: repoResponse.data.html_url
            }
          };

        case 'list-issues':
          if (!owner || !repo) {
            throw new Error('owner and repo required');
          }
          const issuesResponse = await axios.get(
            `${baseUrl}/repos/${owner}/${repo}/issues`,
            { headers, params: { state: 'open', per_page: 10 } }
          );
          return {
            success: true,
            issues: issuesResponse.data.map((issue: any) => ({
              number: issue.number,
              title: issue.title,
              state: issue.state,
              url: issue.html_url,
              created_at: issue.created_at
            })),
            count: issuesResponse.data.length
          };

        case 'list-prs':
          if (!owner || !repo) {
            throw new Error('owner and repo required');
          }
          const prsResponse = await axios.get(
            `${baseUrl}/repos/${owner}/${repo}/pulls`,
            { headers, params: { state: 'open', per_page: 10 } }
          );
          return {
            success: true,
            pullRequests: prsResponse.data.map((pr: any) => ({
              number: pr.number,
              title: pr.title,
              state: pr.state,
              url: pr.html_url,
              created_at: pr.created_at
            })),
            count: prsResponse.data.length
          };

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        status: error.response?.status
      };
    }
  }
}
