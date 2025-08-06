import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Button,
  CircularProgress
} from '@mui/material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'
import { useWatchlist } from '../context/WatchlistContext'
import { getGenres, getPopularMovies, getTrendingMovies } from '../services/tmdb'
import { Link as RouterLink } from 'react-router-dom'

/*
 * Dashboard page shows personalised statistics for the signed‑in user.
 * It displays counts, a bar chart of the watchlist by genre, and a
 * sortable table of recent movies from the API. Users can click a
 * button to navigate to the full movie catalogue.
 */

function descendingComparator (a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1
  if (b[orderBy] > a[orderBy]) return 1
  return 0
}

function getComparator (order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

export default function Dashboard () {
  const { watchlist, browseCount } = useWatchlist()
  const [genreMap, setGenreMap] = useState({})
  const [chartData, setChartData] = useState([])
  const [ratingData, setRatingData] = useState([])
  const [averageRating, setAverageRating] = useState(null)
  // Year distribution for watchlist
  const [yearData, setYearData] = useState([])
  const [recentMovies, setRecentMovies] = useState([])
  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('release_date')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load genres mapping and compute watchlist genre distribution
  useEffect(() => {
    async function loadGenres () {
      try {
        const list = await getGenres()
        const map = {}
        list.forEach(g => {
          map[g.id] = g.name
        })
        setGenreMap(map)
      } catch (err) {
        // ignore
      }
    }
    loadGenres()
  }, [])

  // Compute chart data when watchlist or genreMap changes
  useEffect(() => {
    const counts = {}
    watchlist.forEach(movie => {
      if (!movie.genre_ids) return
      movie.genre_ids.forEach(id => {
        const name = genreMap[id] || 'Other'
        counts[name] = (counts[name] || 0) + 1
      })
    })
    const data = Object.entries(counts).map(([name, value]) => ({ name, value }))
    setChartData(data)

    // compute rating distribution and average rating
    if (watchlist.length > 0) {
      const distribution = {
        '0-5': 0,
        '5-6': 0,
        '6-7': 0,
        '7-8': 0,
        '8+': 0
      }
      let sum = 0
      watchlist.forEach(m => {
        const rating = m.vote_average || 0
        sum += rating
        if (rating < 5) distribution['0-5']++
        else if (rating < 6) distribution['5-6']++
        else if (rating < 7) distribution['6-7']++
        else if (rating < 8) distribution['7-8']++
        else distribution['8+']++
      })
      setAverageRating((sum / watchlist.length).toFixed(1))
      setRatingData(
        Object.entries(distribution).map(([range, value]) => ({ range, value }))
      )

      // Compute year distribution
      const yearCounts = {}
      watchlist.forEach(m => {
        const date = m.release_date
        if (!date) return
        const year = date.split('-')[0]
        yearCounts[year] = (yearCounts[year] || 0) + 1
      })
      const yearArray = Object.entries(yearCounts).map(([year, value]) => ({ year, value }))
      // Sort ascending by year (numeric)
      yearArray.sort((a, b) => {
        const yrA = parseInt(a.year)
        const yrB = parseInt(b.year)
        if (isNaN(yrA) || isNaN(yrB)) return 0
        return yrA - yrB
      })
      setYearData(yearArray)
    } else {
      setAverageRating(null)
      setRatingData([])
      setYearData([])
    }
  }, [watchlist, genreMap])

  // Fetch recent movies for the table
  useEffect(() => {
    async function fetchRecent () {
      try {
        setLoading(true)
        setError(null)
        // Fetch both trending and popular and merge; we pick up to 20 unique movies
        const [trending, popular] = await Promise.all([getTrendingMovies(), getPopularMovies()])
        const combined = [...trending.results, ...popular.results]
        // remove duplicates by id
        const unique = []
        const seen = new Set()
        combined.forEach(movie => {
          if (!seen.has(movie.id)) {
            seen.add(movie.id)
            unique.push(movie)
          }
        })
        setRecentMovies(unique.slice(0, 15))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchRecent()
  }, [])

  const handleSortRequest = property => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const sortedMovies = recentMovies.slice().sort(getComparator(order, orderBy)).slice(0, 5)

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Stat cards */}
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{ p: 3, textAlign: 'center', backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
              Movies Browsed
            </Typography>
            <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
              {browseCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{ p: 3, textAlign: 'center', backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
              Watchlist
            </Typography>
            <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
              {watchlist.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{ p: 3, textAlign: 'center', backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
              Avg Rating
            </Typography>
            <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
              {averageRating ?? '--'}
            </Typography>
          </Paper>
        </Grid>
        {/* Charts row */}
        {/* Genre distribution chart */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3, height: '100%' }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
              Watchlist by Genre
            </Typography>
            {chartData.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Add some movies to your watchlist to see statistics.
              </Typography>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={120}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e2125', border: 'none', borderRadius: 4 }}
                    cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                  />
                  <Bar dataKey="value" fill="#e50914" barSize={14} radius={[4, 4, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
        {/* Rating distribution chart */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3, height: '100%' }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
              Rating Distribution
            </Typography>
            {ratingData.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Add some movies to your watchlist to see statistics.
              </Typography>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={ratingData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="range" axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e2125', border: 'none', borderRadius: 4 }}
                    cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                  />
                  <Bar dataKey="value" fill="#b81c24" barSize={14} radius={[4, 4, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
        {/* Year distribution chart */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3, height: '100%' }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
              Movies by Year
            </Typography>
            {yearData.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Add some movies to your watchlist to see statistics.
              </Typography>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={yearData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e2125', border: 'none', borderRadius: 4 }}
                    cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                  />
                  <Bar dataKey="value" fill="#701112" barSize={14} radius={[4, 4, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
      <Typography variant="h6" gutterBottom>
        Latest Movies
      </Typography>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Typography color="error" sx={{ my: 2 }}>
          {error}
        </Typography>
      )}
      {!loading && !error && (
        <TableContainer
          component={Paper}
          sx={{ mb: 2, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3 }}
        >
          <Table size="small" sx={{ minWidth: 450 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}> 
                  <TableSortLabel
                    active={orderBy === 'title'}
                    direction={orderBy === 'title' ? order : 'asc'}
                    onClick={() => handleSortRequest('title')}
                    sx={{ color: 'text.primary' }}
                  >
                    Title
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <TableSortLabel
                    active={orderBy === 'release_date'}
                    direction={orderBy === 'release_date' ? order : 'asc'}
                    onClick={() => handleSortRequest('release_date')}
                    sx={{ color: 'text.primary' }}
                  >
                    Release Date
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  <TableSortLabel
                    active={orderBy === 'vote_average'}
                    direction={orderBy === 'vote_average' ? order : 'asc'}
                    onClick={() => handleSortRequest('vote_average')}
                    sx={{ color: 'text.primary' }}
                  >
                    Rating
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedMovies.map((movie, idx) => (
                <TableRow
                  key={movie.id}
                  hover
                  sx={{ backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.04)' }}
                >
                  <TableCell component="th" scope="row">
                    {movie.title}
                  </TableCell>
                  <TableCell>{movie.release_date}</TableCell>
                  <TableCell align="right">{movie.vote_average?.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Button
        component={RouterLink}
        to="/movies"
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 2, fontWeight: 600 }}
      >
        View More Movies
      </Button>
    </Container>
  )
}