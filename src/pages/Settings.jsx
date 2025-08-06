import { Container, Typography, Paper, Button, Box } from '@mui/material'
import { useClerk } from '@clerk/clerk-react'

/*
 * Settings page provides account management actions. Currently it offers
 * a sign out button wrapped with a confirmation prompt. Additional
 * settings could be added here (such as profile preferences) if desired.
 */

export default function Settings () {
  const { signOut } = useClerk()
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await signOut()
      window.location.replace('/')
    }
  }
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Settings
      </Typography>
      <Paper
        sx={{
          p: 4,
          maxWidth: 400,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
          Account
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Button variant="contained" color="secondary" size="large" onClick={handleLogout} sx={{ fontWeight: 600 }}>
            Log Out
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}