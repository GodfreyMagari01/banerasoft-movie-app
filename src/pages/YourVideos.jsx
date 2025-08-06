import { useWatchlist } from "../context/WatchlistContext";
import { Box, Typography, Button, Chip, Grid, Card, CardMedia, CardContent, MenuItem, Select } from "@mui/material";
import { useState, useMemo } from "react";

const statusOptions = [
  { label: "All", value: "" },
  { label: "Plan to Watch", value: "plan" },
  { label: "Watching", value: "watching" },
  { label: "Watched", value: "watched" }
];
const sortOptions = [
  { label: "Recently Added", value: "date" },
  { label: "Title (A-Z)", value: "title" },
  { label: "Rating", value: "rating" }
];

export default function YourVideos() {
  const { watchlist } = useWatchlist();
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("date");

  // Filter and sort
  const filtered = useMemo(() => {
    let list = watchlist;
    if (status) list = list.filter(m => m.status === status);
    if (sort === "title") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "rating") list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else list = [...list].sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    return list;
  }, [watchlist, status, sort]);

  // Stats
  const total = watchlist.length;
  const avgRating = total ? (watchlist.reduce((sum, m) => sum + (m.rating || 0), 0) / total).toFixed(1) : "-";
  const mostGenre = (() => {
    const freq = {};
    watchlist.forEach(m => (m.genres || []).forEach(g => { freq[g] = (freq[g] || 0) + 1; }));
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
  })();

  return (
    <Box sx={{ p: { xs: 1, md: 4 } }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Your Videos</Typography>
      <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        <Select value={status} onChange={e => setStatus(e.target.value)} size="small">
          {statusOptions.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
        </Select>
        <Select value={sort} onChange={e => setSort(e.target.value)} size="small">
          {sortOptions.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
        </Select>
        <Chip label={`Total: ${total}`} color="info" />
        <Chip label={`Avg. Rating: ${avgRating}`} color="primary" />
        <Chip label={`Top Genre: ${mostGenre}`} color="success" />
      </Box>
      <Grid container spacing={2}>
        {filtered.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2, mt: 2 }}>
            No videos to show. Add some to your watchlist!
          </Typography>
        )}
        {filtered.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <Card>
              <CardMedia
                component="img"
                image={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                    : "/no-poster.png"
                }
                alt={movie.title}
                sx={{ height: 300, objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="subtitle1" noWrap>{movie.title}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip size="small" label={movie.status || "unknown"} />
                  <Chip size="small" color="warning" label={movie.rating ? `★${movie.rating}` : "Unrated"} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
