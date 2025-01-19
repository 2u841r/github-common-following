import React, { useState } from 'react';
import { Github, Loader2, Users } from 'lucide-react';
import { getCommonFollowing } from './api';
import type { GitHubUser } from './types';

function App() {
  const [username1, setUsername1] = useState('');
  const [username2, setUsername2] = useState('');
  const [commonFollowing, setCommonFollowing] = useState<GitHubUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username1 || !username2) {
      setError('Please enter both usernames');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await getCommonFollowing(username1, username2);
      setCommonFollowing(result);
      if (result.length === 0) {
        setError('No common following found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCommonFollowing([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Github className="w-8 h-8 text-gray-700" />
            <h1 className="text-3xl font-bold text-gray-800">GitHub Common Following</h1>
          </div>
          <p className="text-gray-600">Find people that two GitHub users both follow</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username1" className="block text-sm font-medium text-gray-700 mb-1">
                First Username
              </label>
              <input
                id="username1"
                type="text"
                value={username1}
                onChange={(e) => setUsername1(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., octocat"
              />
            </div>
            <div>
              <label htmlFor="username2" className="block text-sm font-medium text-gray-700 mb-1">
                Second Username
              </label>
              <input
                id="username2"
                type="text"
                value={username2}
                onChange={(e) => setUsername2(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., defunkt"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Users className="w-5 h-5" />
                Find Common Following
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {commonFollowing.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Common Following ({commonFollowing.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {commonFollowing.map((user) => (
                <a
                  key={user.id}
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{user.login}</h3>
                    {user.name && <p className="text-sm text-gray-500">{user.name}</p>}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;