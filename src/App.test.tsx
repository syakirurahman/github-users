import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import App from './App'
import * as usersService from './lib/services/users'
import * as reposService from './lib/services/repositories'

// Mock the services
vi.mock('./lib/services/users')
vi.mock('./lib/services/repositories')

const mockSearchUsers = vi.mocked(usersService.searchUsers)
const mockGetUserRepositories = vi.mocked(reposService.getUserRepositories)

describe('App Integration', () => {
  const mockUsers = [
    {
      id: 1,
      login: 'testuser1',
      avatar_url: 'https://example.com/avatar1.jpg',
      html_url: 'https://github.com/testuser1',
      type: 'User',
      score: 1.0
    },
    {
      id: 2,
      login: 'testuser2',
      avatar_url: 'https://example.com/avatar2.jpg',
      html_url: 'https://github.com/testuser2',
      type: 'User',
      score: 0.9
    }
  ]

  const mockRepositories = [
    {
      id: 1,
      name: 'test-repo-1',
      full_name: 'testuser1/test-repo-1',
      description: 'A test repository',
      html_url: 'https://github.com/testuser1/test-repo-1',
      stargazers_count: 10,
      language: 'JavaScript',
      updated_at: '2024-01-01T00:00:00Z',
      fork: false,
      private: false
    },
    {
      id: 2,
      name: 'test-repo-2',
      full_name: 'testuser1/test-repo-2',
      description: null,
      html_url: 'https://github.com/testuser1/test-repo-2',
      stargazers_count: 5,
      language: 'TypeScript',
      updated_at: '2024-01-02T00:00:00Z',
      fork: true,
      private: true
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByText('GitHub User Explorer')).toBeInTheDocument()
  })

  it('shows search input and button', () => {
    render(<App />)
    expect(screen.getByPlaceholderText('Search github users')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  it('performs user search successfully', async () => {
    mockSearchUsers.mockResolvedValue(mockUsers)
    
    render(<App />)
    const user = userEvent.setup()
    
    const searchInput = screen.getByPlaceholderText('Search github users')
    const searchButton = screen.getByRole('button', { name: 'Search' })
    
    await user.type(searchInput, 'testuser')
    await user.click(searchButton)
    
    expect(mockSearchUsers).toHaveBeenCalledWith('testuser')
    
    await waitFor(() => {
      expect(screen.getByText('testuser1')).toBeInTheDocument()
      expect(screen.getByText('testuser2')).toBeInTheDocument()
    })
    
    expect(screen.getByText("Showing users for 'testuser'")).toBeInTheDocument()
  })

  it('handles search with Enter key', async () => {
    mockSearchUsers.mockResolvedValue(mockUsers)
    
    render(<App />)
    const user = userEvent.setup()
    
    const searchInput = screen.getByPlaceholderText('Search github users')
    
    await user.type(searchInput, 'testuser{enter}')
    
    expect(mockSearchUsers).toHaveBeenCalledWith('testuser')
  })

  it('shows loading state during search', async () => {
    let resolvePromise: (value: typeof mockUsers) => void
    const searchPromise = new Promise<typeof mockUsers>((resolve) => {
      resolvePromise = resolve
    })
    mockSearchUsers.mockReturnValue(searchPromise)
    
    render(<App />)
    const user = userEvent.setup()
    
    const searchInput = screen.getByPlaceholderText('Search github users')
    const searchButton = screen.getByRole('button', { name: 'Search' })
    
    await user.type(searchInput, 'testuser')
    await user.click(searchButton)
    
    expect(screen.getByText('Searching...')).toBeInTheDocument()
    expect(searchButton).toBeDisabled()
    
    // Resolve the promise
    resolvePromise!(mockUsers)
    
    await waitFor(() => {
      expect(screen.getByText('testuser1')).toBeInTheDocument()
    })
  })

  it('shows error message when search fails', async () => {
    mockSearchUsers.mockRejectedValue(new Error('API Error'))
    
    render(<App />)
    const user = userEvent.setup()
    
    const searchInput = screen.getByPlaceholderText('Search github users')
    const searchButton = screen.getByRole('button', { name: 'Search' })
    
    await user.type(searchInput, 'testuser')
    await user.click(searchButton)
    
    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument()
    })
  })

  it('loads repositories when user accordion is expanded', async () => {
    mockSearchUsers.mockResolvedValue(mockUsers)
    mockGetUserRepositories.mockResolvedValue(mockRepositories)
    
    render(<App />)
    const user = userEvent.setup()
    
    // First search for users
    const searchInput = screen.getByPlaceholderText('Search github users')
    const searchButton = screen.getByRole('button', { name: 'Search' })
    
    await user.type(searchInput, 'testuser')
    await user.click(searchButton)
    
    await waitFor(() => {
      expect(screen.getByText('testuser1')).toBeInTheDocument()
    })
    
    // Click on the first user to expand and load repositories
    const userAccordion = screen.getByRole('button', { name: /testuser1/ })
    await user.click(userAccordion)
    
    expect(mockGetUserRepositories).toHaveBeenCalledWith('testuser1')
    
    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument()
      expect(screen.getByText('test-repo-2')).toBeInTheDocument()
    })
  })

  it('shows loading state when fetching repositories', async () => {
    mockSearchUsers.mockResolvedValue(mockUsers)
    
    let resolveReposPromise: (value: typeof mockRepositories) => void
    const reposPromise = new Promise<typeof mockRepositories>((resolve) => {
      resolveReposPromise = resolve
    })
    mockGetUserRepositories.mockReturnValue(reposPromise)
    
    render(<App />)
    const user = userEvent.setup()
    
    // Search for users
    const searchInput = screen.getByPlaceholderText('Search github users')
    const searchButton = screen.getByRole('button', { name: 'Search' })
    
    await user.type(searchInput, 'testuser')
    await user.click(searchButton)
    
    await waitFor(() => {
      expect(screen.getByText('testuser1')).toBeInTheDocument()
    })
    
    const userAccordion = screen.getByRole('button', { name: /testuser1/ })
    await user.click(userAccordion)
    
    expect(screen.getByText('Loading repositories...')).toBeInTheDocument()
    
    resolveReposPromise!(mockRepositories)
    
    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument()
    })
  })

  it('disables search button when input is empty', () => {
    render(<App />)
    const searchButton = screen.getByRole('button', { name: 'Search' })
    expect(searchButton).toBeDisabled()
  })

  it('shows "No users found" when search returns empty results', async () => {
    mockSearchUsers.mockResolvedValue([])
    
    render(<App />)
    const user = userEvent.setup()
    
    const searchInput = screen.getByPlaceholderText('Search github users')
    const searchButton = screen.getByRole('button', { name: 'Search' })
    
    await user.type(searchInput, 'nonexistentuser')
    await user.click(searchButton)
    
    await waitFor(() => {
      expect(screen.getByText('No users found')).toBeInTheDocument()
    })
  })
}) 