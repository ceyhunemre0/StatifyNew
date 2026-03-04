import { getAccessToken, logout } from './auth.js';

const BASE_URL = 'https://api.spotify.com/v1';

async function fetchFromSpotify(endpoint) {
  const token = await getAccessToken();

  if (!token) {
    logout();
    return null;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (response.status === 401) {
    logout();
    return null;
  }

  if (!response.ok) {
    console.error('Spotify API error:', response.status);
    return null;
  }

  return await response.json();
}

/**
 * Get user's top artists
 * @param {string} timeRange - short_term (1 month), medium_term (6 months), long_term (years)
 * @param {number} limit - Number of items (1-50)
 */
export async function getTopArtists(timeRange = 'medium_term', limit = 20) {
  return await fetchFromSpotify(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
}

/**
 * Get user's top tracks
 * @param {string} timeRange - short_term (1 month), medium_term (6 months), long_term (years)
 * @param {number} limit - Number of items (1-50)
 */
export async function getTopTracks(timeRange = 'medium_term', limit = 20) {
  return await fetchFromSpotify(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
}

/**
 * Get current user's profile
 */
export async function getUserProfile() {
  return await fetchFromSpotify('/me');
}
