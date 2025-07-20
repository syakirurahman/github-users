
import { useState } from 'react'
import { Input } from './components/input'
import { Button } from './components/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/accordion'
import { searchUsers, type GitHubUser } from './lib/services/users'
import { getUserRepositories, type GitHubRepository } from './lib/services/repositories'
import { Loader2, Star } from 'lucide-react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<GitHubUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userRepositories, setUserRepositories] = useState<Record<string, GitHubRepository[]>>({})
  const [loadingRepos, setLoadingRepos] = useState<Record<string, boolean>>({})

  const handleSearch = async () => {
    if (!username.trim()) return

    setSearchQuery(username.trim())
    setLoading(true)
    setError(null)
    
    try {
      const searchResults = await searchUsers(username.trim())
      setUsers(searchResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleUserExpand = async (userLogin: string) => {
    // If repositories are already loaded, don't fetch again
    if (userRepositories[userLogin]) return

    setLoadingRepos(prev => ({ ...prev, [userLogin]: true }))
    
    try {
      const repos = await getUserRepositories(userLogin)
      setUserRepositories(prev => ({ ...prev, [userLogin]: repos }))
    } catch (err) {
      console.error(`Error fetching repositories for ${userLogin}:`, err)
      setUserRepositories(prev => ({ ...prev, [userLogin]: [] }))
    } finally {
      setLoadingRepos(prev => ({ ...prev, [userLogin]: false }))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="h-full bg-gray-50 lg:px-4">
      <div className="max-w-3xl min-h-screen mx-auto bg-white border-x border-neutral-200/70 p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          GitHub User Explorer
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              id="username"
              type="text"
              placeholder="Search github users"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={loading || !username.trim()}
            className="sm:w-auto"
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {users.length > 0 && (
        <>
          <p className="text-gray-600 py-4">
            Showing users for '{searchQuery}'
          </p>
        
          <Accordion type="single" collapsible className="space-y-2 py-1">
            {users.map((user) => (
              <AccordionItem 
                key={user.id} 
                value={user.login}
                className="border rounded-lg"
              >
                <AccordionTrigger 
                  className="px-4 py-3 hover:bg-gray-50"
                  onClick={() => handleUserExpand(user.login)}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.avatar_url} 
                      alt={`${user.login} avatar`}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium text-gray-900">{user.login}</span>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent>
                  {loadingRepos[user.login] ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-2 text-gray-600">
                      <Loader2 className="size-5 animate-spin " />
                      <div>Loading repositories...</div>
                    </div>
                  ) : userRepositories[user.login] ? (
                    <div className="space-y-3 px-4 max-h-[370px] overflow-y-auto">
                      {userRepositories[user.login].length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          No repositories found for this user.
                        </p>
                      ) : (
                        userRepositories[user.login].map((repo) => (
                          <div 
                            key={repo.id} 
                            className="bg-gray-50 rounded-lg p-4 border"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                  <a href={repo.html_url} target='_blank'>{repo.name}</a>
                                </h3>
                                {repo.description && (
                                  <p className="text-gray-600 text-sm mb-2">
                                    {repo.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  {repo.language && (
                                    <span>{repo.language}</span>
                                  )}
                                  <span>{repo.fork ? 'Fork' : 'Original'}</span>
                                  {repo.private && (
                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                      Private
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600 ml-4">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm font-medium">
                                  {repo.stargazers_count}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-4">
                      Click to load repositories
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}

      {
        !!searchQuery && users.length === 0 && !loading && (
          <div className="text-gray-500 text-center py-4">
            No users found
          </div>
        )
      }
      </div>
    </div>
  )
}

export default App
