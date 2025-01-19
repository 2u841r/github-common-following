import axios from 'axios';
import { GitHubUser } from './types';

const GITHUB_API = 'https://api.github.com';

export async function getFollowing(username: string): Promise<GitHubUser[]> {
  try {
    const response = await axios.get(`${GITHUB_API}/users/${username}/following?per_page=100`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(`User ${username} not found`);
    }
    throw new Error('Failed to fetch following list');
  }
}

export async function getCommonFollowing(username1: string, username2: string): Promise<GitHubUser[]> {
  const [following1, following2] = await Promise.all([
    getFollowing(username1),
    getFollowing(username2)
  ]);

  const following1Set = new Set(following1.map(user => user.id));
  return following2.filter(user => following1Set.has(user.id));
}