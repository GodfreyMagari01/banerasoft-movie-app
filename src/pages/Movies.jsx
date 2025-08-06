import { useEffect, useState } from 'react'
import {
  Box, Container, Grid, TextField, FormControl, InputLabel, Select,
  MenuItem, Slider, Button, Typography, Pagination, Stack, CircularProgress
} from '@mui/material'
import MovieCard from '../components/MovieCard'
import {
  getGenres, searchMovies, discoverMovies,
  searchTVShows, discoverTVShows
} from '../services/tmdb'

export default function Movies() {
  const [contentType, setContentType] = useState('movie') // 'movie' | 'tv' | 'both'
  const [genres, setGenres] = useState([])
  const [query, setQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [year, setYear] = useState('')
  const [rating, setRating] = useState(0)
  const [sort, setSort] = useState('popularity.desc')
  const [results, setResults] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load genres
  useEffect(() => {
    async function fetchGenresList() {
      try {
        // For "both", just show movie genres
        const list = await getGenres(contentType === 'tv' ? 'tv' : 'movie')
        setGenres(list)
      } catch {
        setGenres([])
      }
    }
    fetchGenresList()
  }, [contentType])

  // Fetch movies and/or shows
  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true)
        setError(null)
        let data = [], pages = 1

        // Movie/TV options mapping
        const movieOpts = {
          page,
          sort_by: sort,
          with_genres: selectedGenre || undefined,
          year: year || undefined,
          vote_average_gte: rating || undefined,
        }
        const tvOpts = {
          page,
          sort_by: sort,
          with_genres: selectedGenre || undefined,
          first_air_date_year: year || undefined,
          vote_average_gte: rating || undefined,
        }

        if (contentType === 'movie') {
          if (query.trim()) {
            const res = await searchMovies(query, { page, year })
            data = res.results.map(m => ({ ...m, _type: 'movie' }))
            pages = Math.min(res.total_pages, 500)
          } else {
            const res = await discoverMovies(movieOpts)
            data = res.results.map(m => ({ ...m, _type: 'movie' }))
            pages = Math.min(res.total_pages, 500)
          }
        } else if (contentType === 'tv') {
          if (query.trim()) {
            const res = await searchTVShows(query, { page, year })
            data = res.results.map(m => ({ ...m, _type: 'tv' }))
            pages = Math.min(res.total_pages, 500)
          } else {
            const res = await discoverTVShows(tvOpts)
            data = res.results.map(m => ({ ...m, _type: 'tv' }))
            pages = Math.min(res.total_pages, 500)
          }
        } else if (contentType === 'both') {
          let movieData, tvData
          if (query.trim()) {
            [movieData, tvData] = await Promise.all([
              searchMovies(query, { page, year }),
              searchTVShows(query, { page, year })
            ])
          } else {
            [movieData, tvData] = await Promise.all([
              discoverMovies(movieOpts),
              discoverTVShows(tvOpts)
            ])
          }
          data = [
            ...movieData.results.map(m => ({ ...m, _type: 'movie' })),
            ...tvData.results.map(m => ({ ...m, _type: 'tv' })),
          ]
          // Sort all by main sort (popularity, date, etc.)
          if (sort.startsWith('popularity')) {
            data.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
          } else if (sort.startsWith('release_date')) {
            data.sort((a, b) =>
              new Date((b.release_date || b.first_air_date) || 0) -
              new Date((a.release_date || a.first_air_date) || 0)
            )
          } else if (sort.startsWith('vote_average')) {
            data.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
          }
          pages = Math.min(movieData.total_pages, tvData.total_pages, 500)
        }
        setResults(data)
        setTotalPages(pages)
      } catch (err) {
        setError(err.message || 'Error loading content')
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [contentType, query, selectedGenre, year, rating, sort, page])

  // Reset page when filters other than page change
  useEffect(() => {
    setPage(1)
  }, [contentType, query, selectedGenre, year, rating, sort])

  const handleResetFilters = () => {
    setContentType('movie')
    setQuery('')
    setSelectedGenre('')
    setYear('')
    setRating(0)
    setSort('popularity.desc')
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Browse Movies & TV Shows
      </Typography>
      {/* Filter panel */}
      <Box
        sx={{
          mb: 4,
          p: 2,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 2
        }}
      >
        <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              value={contentType}
              label="Type"
              onChange={e => setContentType(e.target.value)}
            >
              <MenuItem value="movie">Movies</MenuItem>
              <MenuItem value="tv">TV Shows</MenuItem>
              <MenuItem value="both">Both</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            variant="outlined"
            size="small"
          />
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select
              labelId="genre-label"
              value={selectedGenre}
              label="Genre"
              onChange={e => setSelectedGenre(e.target.value)}
            >
              <MenuItem value="">
                <em>Any</em>
              </MenuItem>
              {genres.map(g => (
                <MenuItem key={g.id} value={g.id.toString()}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Year"
            type="number"
            value={year}
            onChange={e => setYear(e.target.value)}
            inputProps={{ min: 1900, max: new Date().getFullYear(), step: 1 }}
            sx={{ width: 100 }}
            size="small"
          />
          <FormControl sx={{ minWidth: 180 }} size="small">
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              value={sort}
              label="Sort By"
              onChange={e => setSort(e.target.value)}
            >
              <MenuItem value="popularity.desc">Popularity ↓</MenuItem>
              <MenuItem value="popularity.asc">Popularity ↑</MenuItem>
              <MenuItem value="release_date.desc">Release Date ↓</MenuItem>
              <MenuItem value="release_date.asc">Release Date ↑</MenuItem>
              <MenuItem value="vote_average.desc">Rating ↓</MenuItem>
              <MenuItem value="vote_average.asc">Rating ↑</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center', width: 200 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Min Rating
            </Typography>
            <Slider
              value={rating}
              onChange={(e, val) => setRating(val)}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={9}
            />
          </Box>
          <Button variant="outlined" onClick={handleResetFilters} size="small">
            Reset
          </Button>
        </Stack>
      </Box>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Typography color="error" sx={{ my: 2 }}>
          {error}
        </Typography>
      )}
      {!loading && !error && results.length === 0 && (
        <Typography sx={{ my: 2 }}>No movies or TV shows found.</Typography>
      )}
      {!loading && results.length > 0 && (
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {results.map(item => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={item.id + '-' + item._type}>
              <MovieCard movie={item} type={item._type} />
            </Grid>
          ))}
        </Grid>
      )}
      {!loading && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Pagination
            count={Math.min(totalPages, 20)}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Container>
  )
}
