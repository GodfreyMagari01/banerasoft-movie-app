import React, { useEffect } from 'react'
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Chip, Stack } from '@mui/material'
import { useWatchlist } from '../context/WatchlistContext'

/*
 * MovieCard displays basic information about a movie, including its
 * poster, title, release date and average vote. It also allows the
 * user to add or remove the movie from their watchlist via the
 * WatchlistContext. Genres can optionally be passed as an array of
 * strings; if provided they will be displayed as chips below the
 * title.
 */

export default function MovieCard ({ movie, genres = [] }) {
  const { watchlist, addToWatchlist, removeFromWatchlist, incrementBrowseCount } = useWatchlist()
  const isInWatchlist = watchlist.some(item => item.id === movie.id)

  const handleClick = () => {
    if (isInWatchlist) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(movie)
    }
  }

  // Trigger browse count increment once when component mounts
  useEffect(() => {
    incrementBrowseCount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card
      sx={{
        maxWidth: 230,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardMedia
        component="img"
        sx={{ height: 340, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''}
        alt={movie.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" component="div" noWrap title={movie.title} sx={{ fontWeight: 600 }}>
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'} • {movie.vote_average?.toFixed(1)}★
        </Typography>
        {genres.length > 0 && (
          <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap' }}>
            {genres.map(g => (
              <Chip key={g} label={g} size="small" color="primary" variant="outlined" />
            ))}
          </Stack>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          size="small"
          onClick={handleClick}
          variant={isInWatchlist ? 'outlined' : 'contained'}
          color={isInWatchlist ? 'secondary' : 'primary'}
        >
          {isInWatchlist ? 'Remove' : 'Add'}
        </Button>
      </CardActions>
    </Card>
  )
}