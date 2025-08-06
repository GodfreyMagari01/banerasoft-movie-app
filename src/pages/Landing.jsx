import { useEffect, useState, useMemo } from 'react'
import { Box, Typography, Button, CircularProgress, Grid, MenuItem, Select, Stack } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { useWatchlist } from '../context/WatchlistContext'
import { getTrendingMovies } from '../services/tmdb'
import MovieCard from '../components/MovieCard'
import { useNavigate } from 'react-router-dom'

/*
 * Landing page implementing a modern streaming dashboard.  The layout
 * includes a hero banner highlighting a trending movie, a thumbnail
 * carousel of additional trending titles, and a "Continue Watching"
 * row powered by the user's watchlist.  A simple select allows
 * switching the sorting of the continue watching carousel.
 */

export default function Landing () {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortOption, setSortOption] = useState('popular')
  const { watchlist } = useWatchlist()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchTrending () {
      try {
        setLoading(true)
        const data = await getTrendingMovies()
        setMovies(data.results.slice(0, 12))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTrending()
  }, [])

  // Determine hero movie (first trending item)
  const hero = useMemo(() => (movies.length > 0 ? movies[0] : null), [movies])

  // Sort watchlist for continue watching row
  const sortedWatchlist = useMemo(() => {
    if (sortOption === 'popular') {
      return [...watchlist].sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    } else if (sortOption === 'recent') {
      return [...watchlist].sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
    } else {
      return watchlist
    }
  }, [watchlist, sortOption])

  return (
    <Box sx={{ p: 3 }}>
      {/* Hero banner */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 300, md: 400 },
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: '#1a1a1a',
          mb: 5
        }}
      >
        {hero && (
          <>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(https://image.tmdb.org/t/p/original/${hero.backdrop_path || hero.poster_path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.5)'
              }}
            />
            {/* Overlay content */}
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                height: '100%',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                px: 3,
                py: 2
              }}
            >
              <Box sx={{ flex: 1, color: '#fff' }}>
                <Typography variant='h4' sx={{ fontWeight: 700, mb: 1 }}>
                  {hero.title}
                </Typography>
                <Typography variant='body2' sx={{ mb: 2, maxWidth: { xs: '100%', md: '70%' }, opacity: 0.8 }}>
                  {hero.overview?.slice(0, 150)}...
                </Typography>
                <Stack direction='row' spacing={2} sx={{ mb: 2 }}>
                  <Typography variant='subtitle2'>⭐ {hero.vote_average}</Typography>
                  {hero.original_language && (
                    <Typography variant='subtitle2' sx={{ textTransform: 'uppercase' }}>
                      {hero.original_language}
                    </Typography>
                  )}
                </Stack>
                <Button
                  variant='contained'
                  color='primary'
                  sx={{ width: 150, borderRadius: 2 }}
                  onClick={() => navigate(`/movies/${hero.id}`)}
                >
                  Watch
                </Button>
              </Box>
              {/* Thumbnail carousel */}
              <Box sx={{ width: { xs: '100%', md: 300 }, ml: { md: 3 }, mt: { xs: 2, md: 0 } }}>
                <Swiper
                  modules={[Autoplay]}
                  spaceBetween={10}
                  slidesPerView={4}
                  autoplay={{ delay: 3000 }}
                >
                  {movies.slice(1, 9).map(item => (
                    <SwiperSlide key={item.id}>
                      <Box
                        onClick={() => navigate(`/movies/${item.id}`)}
                        sx={{
                          position: 'relative',
                          pb: '56%',
                          borderRadius: 1,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          '&:hover': { opacity: 0.8 }
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(https://image.tmdb.org/t/p/w500/${item.poster_path || item.backdrop_path})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>
            </Box>
          </>
        )}
        {loading && (
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Box sx={{ p: 2, color: 'error.main' }}>{error}</Box>
        )}
      </Box>
      {/* Continue Watching */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            Continue Watching
          </Typography>
          <Select
            size='small'
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
            sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }, '& .MuiSvgIcon-root': { color: '#fff' } }}
          >
            <MenuItem value='popular'>Popular</MenuItem>
            <MenuItem value='recent'>Recent</MenuItem>
          </Select>
        </Box>
        {watchlist.length === 0 ? (
          <Typography variant='body2' sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Your watchlist is empty.  Start browsing to add movies!
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {sortedWatchlist.slice(0, 10).map(item => (
              <Grid item key={item.id} xs={6} sm={4} md={3} lg={2}>
                <MovieCard movie={item} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      {/* Additional trending section can be added here */}
    </Box>
  )
}