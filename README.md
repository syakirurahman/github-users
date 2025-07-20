# GitHub Explorer

A React application that allows you to search for GitHub users and view their repositories. Built with React, TypeScript, Vite, Tailwind CSS and Shadcn UI.

## Features

- Search for GitHub users by username (up to 5 results)
- View user repositories with details (name, description, language, stars, etc.)
- Responsive design with modern UI components
- GitHub API integration with rate limiting support

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root directory and add your GitHub personal access token:
   ```env
   VITE_GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
   ```

### Getting a GitHub Personal Access Token

1. Go to [GitHub Settings](https://github.com/settings/tokens)
2. Click "Developer settings" → "Personal access tokens" → "Tokens (classic)"
3. Click "Generate new token (classic)"
4. Select the "public_repo" scope (for public repositories)
5. Copy the generated token and add it to your `.env` file

**Note:** The token is optional but recommended to avoid rate limiting. Without a token, you're limited to 60 requests per hour. With a token, you get 5,000 requests per hour.

## Development

Start the development server:
```bash
pnpm dev
```

Build for production:
```bash
pnpm build
```

## Technologies Used

- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- GitHub API v3
- Lucide React icons

## API Documentation

This app uses the [GitHub API v3](https://developer.github.com/v3/):
- User search: `GET /search/users`
- User repositories: `GET /users/{username}/repos`
