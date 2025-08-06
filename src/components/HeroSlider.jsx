import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'
import { getTrendingMovies } from '../services/tmdb'
import { Box, Typography, Button, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'

/*
 * HeroSlider displays a carousel of trending movies using Swiper.
 * Each slide shows a backdrop image, title, overview and action buttons.
 * Users can add/remove the movie to/from their watchlist or navigate
 * directly to the movie details page.
 */

const IMAGE_BASE = 'https://image.tmdb.org/t/p/original'

export default function HeroSlider () {
  const [slides, setSlides] = useState([])
  const { addToWatchlist, removeFromWatchlist, watchlist } = useWatchlist()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchTrending () {
      try {
        const data = await getTrendingMovies()
        setSlides(data.results.slice(0, 5))
      } catch (err) {
        // ignore
      }
    }
    fetchTrending()
  }, [])

  const isInWatchlist = movie => watchlist.some(m => m.id === movie.id)

  return (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden', height: { xs: 400, md: 550 } }}>
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        spaceBetween={0}
        slidesPerView={1}
        loop
      >
        {slides.map(movie => {
          const bgImage = `${IMAGE_BASE}${movie.backdrop_path || movie.poster_path}`
          const inList = isInWatchlist(movie)
          return (
            <SwiperSlide key={movie.id}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: 400, md: 550 },
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundImage: `url(${bgImage})`
                }}
              >
                {/* Dark overlay */}
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
                {/* Content */}
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: { xs: 'center', md: 'flex-start' },
                    px: { xs: 2, md: 8 },
                    color: 'common.white',
                    textAlign: { xs: 'center', md: 'left' }
                  }}
                >
                  <Typography variant="h2" component="h2" sx={{ mb: 2, fontWeight: 700 }}>
                    {movie.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, maxWidth: 600, lineHeight: 1.4, display: { xs: 'none', sm: 'block' } }}>
                    {movie.overview?.slice(0, 150)}...
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={() => navigate(`/movies/${movie.id}`)}
                    >
                      Watch Now
                    </Button>
                    <Button
                      variant={inList ? 'outlined' : 'contained'}
                      color="secondary"
                      size="large"
                      onClick={() => {
                        if (inList) removeFromWatchlist(movie.id)
                        else addToWatchlist(movie)
                      }}
                    >
                      {inList ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </Box>
  )
}