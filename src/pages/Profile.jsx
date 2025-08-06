import { useMemo } from 'react'
import {
  Box, Typography, Card, CardContent, Grid, Avatar, Select, MenuItem,
  FormControl, InputLabel, Stack, Container
} from '@mui/material'
import { Rating } from '@mui/material'
import { useUser } from '@clerk/clerk-react'
import { useWatchlist } from '../context/WatchlistContext'
import {
  PieChart, Pie, Cell, Tooltip as RechartTooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from 'recharts'
import { useTheme } from '@mui/material'

const STATUS_COLORS = {
  plan: "#7da6fa",
  watching: "#f5be47",
  watched: "#7ee397",
}
const RATING_COLORS = ["#7da6fa", "#f5be47", "#7ee397", "#ef476f", "#ff7f50", "#8e44ad"]

export default function Profile() {
  const { user } = useUser()
  const { watchlist, updateWatchlistStatus, setWatchlistRating } = useWatchlist()
  const theme = useTheme()

  // Compute counts by status and average rating
  const stats = useMemo(() => {
    const counts = { plan: 0, watching: 0, watched: 0 }
    let ratingSum = 0
    let ratingCount = 0
    watchlist.forEach(item => {
      counts[item.status] = (counts[item.status] || 0) + 1
      if (item.rating) {
        ratingSum += item.rating
        ratingCount += 1
      }
    })
    const averageRating = ratingCount > 0 ? (ratingSum / ratingCount).toFixed(1) : 'N/A'
    return { counts, averageRating }
  }, [watchlist])

  // Pie chart: Watchlist by status
  const statusData = [
    { name: 'Plan', value: stats.counts.plan, color: STATUS_COLORS.plan },
    { name: 'Watching', value: stats.counts.watching, color: STATUS_COLORS.watching },
    { name: 'Watched', value: stats.counts.watched, color: STATUS_COLORS.watched },
  ]

  // Bar chart: Ratings distribution
  const ratingsDistribution = useMemo(() => {
    const counts = {}
    watchlist.forEach(item => {
      if (item.rating) {
        const r = Math.round(item.rating)
        counts[r] = (counts[r] || 0) + 1
      }
    })
    return Object.entries(counts)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([rating, count]) => ({ rating, count }))
  }, [watchlist])

  return (
    <>

      {/* PAGE CONTENT BELOW, INSIDE CONTAINER */}
      <Container sx={{ p: { xs: 1, sm: 3 } }}>
        <Typography variant='h4' sx={{ mb: 3, fontWeight: 700 }}>Profile</Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar src={user.imageUrl} sx={{ width: 64, height: 64, mr: 2 }} />
            <Box>
              <Typography variant='h6'>{user.fullName || user.username}</Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>{user.primaryEmailAddress?.emailAddress}</Typography>
            </Box>
          </Box>
        )}

        {/* Stats cards */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>Plan to Watch</Typography>
                <Typography variant='h5'>{stats.counts.plan}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>Watching</Typography>
                <Typography variant='h5'>{stats.counts.watching}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>Watched</Typography>
                <Typography variant='h5'>{stats.counts.watched}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>Average Rating</Typography>
                <Typography variant='h5'>{stats.averageRating}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* FULL-WIDTH CHART ROW */}
        <Box

        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '1700px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              alignItems: 'stretch',
            }}
          >
            <Card sx={{ flex: 1, p: 3, borderRadius: 3, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, alignSelf: 'flex-start' }}>Watchlist by Status</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={55}
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ""}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
            <Card sx={{ flex: 1, p: 3, borderRadius: 3, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, alignSelf: 'flex-start' }}>Your Ratings</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={ratingsDistribution}>
                  <XAxis dataKey="rating" tickLine={false} />
                  <YAxis allowDecimals={false} />
                  <Bar dataKey="count" fill={theme.palette.primary.main} radius={[6, 6, 0, 0]}>
                    {ratingsDistribution.map((entry, idx) => (
                      <Cell key={entry.rating} fill={RATING_COLORS[idx % RATING_COLORS.length]} />
                    ))}
                  </Bar>
                  <RechartTooltip />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Box>
        </Box>


        {/* Watchlist details */}
        <Typography variant='h6' sx={{ mt: 4, mb: 2, fontWeight: 600 }}>Your Watchlist</Typography>
        {watchlist.length === 0 ? (
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>Your watchlist is empty.</Typography>
        ) : (
          <Grid
            container
            spacing={4}
            sx={{
              width: '100%',
              maxWidth: '1700px',
              margin: '0 auto',
              alignItems: 'stretch',
            }}
          >
            {watchlist.map(item => (
              <Grid item key={item.id} xs={12} md={6} lg={4}>
                <Card sx={{ display: 'flex', backgroundColor: 'background.paper', borderRadius: 3 }}>
                  <Box sx={{ width: 100, flexShrink: 0 }}>
                    <img
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w185${item.poster_path}` : ''}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>{item.title}</Typography>
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>{item.release_date}</Typography>
                    <FormControl fullWidth size='small' sx={{ mt: 1 }}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        label='Status'
                        value={item.status || 'plan'}
                        onChange={e => updateWatchlistStatus(item.id, e.target.value)}
                      >
                        <MenuItem value='plan'>Plan to Watch</MenuItem>
                        <MenuItem value='watching'>Watching</MenuItem>
                        <MenuItem value='watched'>Watched</MenuItem>
                      </Select>
                    </FormControl>
                    <Stack direction='row' alignItems='center' sx={{ mt: 1 }}>
                      <Typography variant='body2' sx={{ mr: 1 }}>Your Rating:</Typography>
                      <Rating
                        name={`rating-${item.id}`}
                        value={item.rating || 0}
                        precision={0.5}
                        max={10}
                        onChange={(_, newValue) => setWatchlistRating(item.id, newValue)}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  )
}
