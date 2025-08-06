import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMovieDetail } from '../services/tmdb'
import { Box, Container, Typography, Button, Grid, Chip } from '@mui/material'
import { useWatchlist } from '../context/WatchlistContext'

/*
 * MovieDetail page shows detailed information about a single movie. It fetches
 * data from TMDb using the movie ID from the URL, displays a hero banner,
 * poster, title, overview, release date, rating and genres. Users can
 * add or remove the movie to/from their watchlist.
 */

export default function MovieDetail () {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [error, setError] = useState(null)
  const { addToWatchlist, removeFromWatchlist, watchlist } = useWatchlist()

  useEffect(() => {
    async function fetchDetail () {
      try {
        const data = await getMovieDetail(id)
        setMovie(data)
      } catch (err) {
        setError('Failed to load movie details')
      }
    }
    fetchDetail()
  }, [id])

  const inWatchlist = movie && watchlist.some(m => m.id === movie.id)

  const toggleWatchlist = () => {
    if (!movie) return
    if (inWatchlist) removeFromWatchlist(movie.id)
    else addToWatchlist(movie)
  }

  if (error) {
    return <Container sx={{ py: 4 }}><Typography color="error">{error}</Typography></Container>
  }
  if (!movie) {
    return <Container sx={{ py: 4 }}><Typography>Loading...</Typography></Container>
  }

  const bgImage = movie.backdrop_path
    ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
    : undefined

  return (
    <Box>
      {/* Hero banner */}
      <Box
        sx={{
          height: { xs: 300, md: 400 },
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: bgImage
            ? `${bgImage}`
            : 'linear-gradient(135deg, #e50914 0%, #b81c24 100%)',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), #0d0f11 80%)'
          }}
        />
      </Box>
      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            {movie.poster_path && (
              <Box
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 3
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: '100%', display: 'block' }}
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              {movie.title}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1, color: 'rgba(255,255,255,0.8)' }}>
              {movie.release_date?.slice(0, 4)} · {movie.runtime} min · Rating {movie.vote_average?.toFixed(1)}
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {movie.genres?.map(genre => (
                <Chip key={genre.id} label={genre.name} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
              ))}
            </Box>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              {movie.overview}
            </Typography>
            <Button
              variant={inWatchlist ? 'outlined' : 'contained'}
              color="primary"
              size="large"
              onClick={toggleWatchlist}
            >
              {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}