import { useState } from 'react'
import { Box, IconButton, InputBase, Paper, Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import LogoutIcon from '@mui/icons-material/Logout'
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton, useClerk } from '@clerk/clerk-react'

export default function TopBar () {
  const [searchValue, setSearchValue] = useState('')
  const [openSignOut, setOpenSignOut] = useState(false)
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    await signOut()
    setOpenSignOut(false)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        py: 2,
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      {/* Search field */}
      <Paper
        component='form'
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: { xs: '100%', sm: '50%' },
          backgroundColor: '#15171a',
          px: 1.5,
          py: 0.5,
          borderRadius: 2
        }}
        onSubmit={e => {
          e.preventDefault()
          // handle search action
        }}
      >
        <SearchIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.6)' }} />
        <InputBase
          placeholder='Search everything'
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          sx={{ color: '#fff', flex: 1 }}
        />
      </Paper>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
          <NotificationsNoneIcon />
        </IconButton>
        <SignedIn>
          <UserButton afterSignOutUrl='/' appearance={{ elements: { avatarBox: { width: 36, height: 36 } } }} />
          <IconButton
            color="inherit"
            aria-label="Sign out"
            sx={{ ml: 1 }}
            onClick={() => setOpenSignOut(true)}
          >
            <LogoutIcon />
          </IconButton>
        </SignedIn>
        <SignedOut>
          <SignInButton mode='modal'>
            <Box
              component='span'
              sx={{
                cursor: 'pointer',
                color: 'inherit',
                px: 2,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.875rem',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Sign&nbsp;In
            </Box>
          </SignInButton>
          <SignUpButton mode='modal'>
            <Box
              component='span'
              sx={{
                cursor: 'pointer',
                px: 2,
                py: 0.5,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'primary.main',
                color: 'primary.main',
                fontSize: '0.875rem',
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

      {/* Sign Out Confirmation Dialog */}
      <Dialog
        open={openSignOut}
        onClose={() => setOpenSignOut(false)}
      >
        <DialogTitle>Sign Out</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to sign out of your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSignOut(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSignOut} color="primary" variant="contained">
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
