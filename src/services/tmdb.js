import axios from 'axios'

/*
 * This service wraps all requests to the TMDb (The Movie Database) API.
 * Calls are centralised here so other modules can import functions without
 * repeating the base URL or API key logic. The API key is read from
 * Vite environment variables (VITE_TMDB_API_KEY). When running the
 * application locally, copy the `.env.example` file to `.env` and provide
 * your API key.
 */

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

// Pre-configured axios instance with base URL and default params
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US'
  }
})

// ==================== MOVIES =====================

// Trending movies (daily)
export async function getTrendingMovies (page = 1) {
  const { data } = await apiClient.get('/trending/movie/day', { params: { page } })
  return data
}

// Popular movies
export async function getPopularMovies (page = 1) {
  const { data } = await apiClient.get('/movie/popular', { params: { page } })
  return data
}

// Search movies by title/keyword
export async function searchMovies (query, options = {}) {
  const { page = 1, year, includeAdult = false } = options
  const { data } = await apiClient.get('/search/movie', {
    params: {
      query,
      page,
      year,
      include_adult: includeAdult
    }
  })
  return data
}

// Discover movies with filters
export async function discoverMovies (options = {}) {
  const {
    page = 1,
    with_genres,
    year,
    vote_average_gte,
    sort_by = 'popularity.desc'
  } = options
  const { data } = await apiClient.get('/discover/movie', {
    params: {
      page,
      with_genres,
      primary_release_year: year,
      'vote_average.gte': vote_average_gte,
      sort_by
    }
  })
  return data
}

// Movie detail by ID
export async function getMovieDetail (id) {
  const { data } = await apiClient.get(`/movie/${id}`)
  return data
}

// Movie genres (array of {id, name})
export async function getGenres (type = 'movie') {
  // type: 'movie' | 'tv'
  const endpoint = type === 'tv' ? '/genre/tv/list' : '/genre/movie/list'
  const { data } = await apiClient.get(endpoint)
  return data.genres
}

// ===================== TV SHOWS =====================

// Trending TV shows (daily)
export async function getTrendingTVShows (page = 1) {
  const { data } = await apiClient.get('/trending/tv/day', { params: { page } })
  return data
}

// Popular TV shows
export async function getPopularTVShows (page = 1) {
  const { data } = await apiClient.get('/tv/popular', { params: { page } })
  return data
}

// Search TV shows by name/keyword
export async function searchTVShows (query, options = {}) {
  const { page = 1, year, includeAdult = false } = options
  const { data } = await apiClient.get('/search/tv', {
    params: {
      query,
      page,
      first_air_date_year: year,
      include_adult: includeAdult
    }
  })
  return data
}

// Discover TV shows with filters
export async function discoverTVShows (options = {}) {
  const {
    page = 1,
    with_genres,
    first_air_date_year,
    vote_average_gte,
    sort_by = 'popularity.desc'
  } = options
  const { data } = await apiClient.get('/discover/tv', {
    params: {
      page,
      with_genres,
      first_air_date_year,
      'vote_average.gte': vote_average_gte,
      sort_by
    }
  })
  return data
}

// TV show detail by ID
export async function getTVShowDetail (id) {
  const { data } = await apiClient.get(`/tv/${id}`)
  return data
}

// TV genres (use getGenres('tv'))

// ==================== COMMON UTILS ===================

// Optionally, a utility to fetch credits for either movie or tv
export async function getCredits (id, type = 'movie') {
  // type: 'movie' | 'tv'
  const endpoint = type === 'tv' ? `/tv/${id}/credits` : `/movie/${id}/credits`
  const { data } = await apiClient.get(endpoint)
  return data
}
