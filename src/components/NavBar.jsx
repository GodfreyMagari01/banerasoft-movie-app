import { Link as RouterLink } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/clerk-react'

/*
 * Navigation bar displayed at the top of all pages. Uses MUI components
 * for styling and includes conditional actions depending on whether the
 * user is signed in. When signed in, the user sees their avatar via
 * <UserButton/>. When signed out, sign‑in and sign‑up buttons are shown.
 */

export default function NavBar () {
  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ py: 1, backdropFilter: 'blur(8px)', backgroundColor: 'rgba(13,15,17,0.7)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 700, fontSize: '1.4rem' }}
        >
          MovieStream
        </Typography>
        <Box sx={{ display: 'flex', gap: { xs: 1, md: 3 }, alignItems: 'center' }}>
          <Button component={RouterLink} to="/movies" color="inherit" sx={{ fontSize: '0.95rem' }}>
            Movies
          </Button>
          <SignedIn>
            <Button component={RouterLink} to="/dashboard" color="inherit" sx={{ fontSize: '0.95rem' }}>
              Dashboard
            </Button>
            <Button component={RouterLink} to="/settings" color="inherit" sx={{ fontSize: '0.95rem' }}>
              Settings
            </Button>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: { width: 32, height: 32 } } }} />
          </SignedIn>
          <SignedOut>
            {/* Clerk buttons require a single child element or text. Use span
                elements styled like buttons instead of MUI Button components. */}
            <SignInButton mode="modal">
              <Box
                component="span"
                sx={{
                  cursor: 'pointer',
                  color: 'inherit',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.95rem',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
                }}
              >
                Sign&nbsp;In
              </Box>
            </SignInButton>
            <SignUpButton mode="modal">
              <Box
                component="span"
                sx={{
                  cursor: 'pointer',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  fontSize: '0.95rem',
                  ml: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'primary.light'
                  }
                }}
              >
                Sign&nbsp;Up
              </Box>
            </SignUpButton>
          </SignedOut>
        </Box>
      </Toolbar>
    </AppBar>
  )
}