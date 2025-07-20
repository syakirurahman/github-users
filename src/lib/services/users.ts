export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
  score: number;
}

export interface SearchUsersResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUser[];
}

function getGitHubToken(): string | null {
  return import.meta.env.VITE_GITHUB_PERSONAL_ACCESS_TOKEN || null;
}

export async function searchUsers(query: string): Promise<GitHubUser[]> {
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
      `https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=5`,
      { headers }
    );

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Rate limit exceeded. Please set VITE_GITHUB_PERSONAL_ACCESS_TOKEN environment variable for higher limits.');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: SearchUsersResponse = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
}
