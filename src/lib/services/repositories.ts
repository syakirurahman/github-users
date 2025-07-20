export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
  private: boolean;
}

function getGitHubToken(): string | null {
  return import.meta.env.VITE_GITHUB_PERSONAL_ACCESS_TOKEN || null;
}

export async function getUserRepositories(username: string): Promise<GitHubRepository[]> {
  try {
    const token = getGitHubToken();
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Explorer-App'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`,
      { headers }
    );

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Rate limit exceeded. Please set VITE_GITHUB_PERSONAL_ACCESS_TOKEN environment variable for higher limits.');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: GitHubRepository[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
}
