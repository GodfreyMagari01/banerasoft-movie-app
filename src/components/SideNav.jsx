import { Box, List, ListItemButton, ListItemIcon, ListItemText, Avatar, Typography } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Link as RouterLink, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Home', icon: <HomeIcon />, path: '/' },
  { label: 'Trending', icon: <WhatshotIcon />, path: '/movies' },
  { label: 'Your Videos', icon: <VideoLibraryIcon />, path: '/your-videos' },
  { label: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
]

export default function SideNav() {
  const location = useLocation()
  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        backgroundColor: '#0d0f11',
        color: 'rgba(255,255,255,0.87)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Brand / Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 3 }}>
        <Avatar sx={{ mr: 1.5, bgcolor: 'primary.main' }}>B</Avatar>
        <Typography variant='h6' sx={{ fontWeight: 700 }}>
          BaneraSoft
        </Typography>
      </Box>
      {/* Navigation */}
      <List sx={{ flexGrow: 1 }}>
        {navItems.map(item => (
          <ListItemButton
            key={item.label}
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              my: 0.5,
              mx: 1,
              borderRadius: 2,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: '#fff',
                '& .MuiListItemIcon-root': { color: '#fff' },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}
